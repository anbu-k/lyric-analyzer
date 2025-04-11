# backend/app.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from spotify_utils import search_song
from lyrics_utils import fetch_lyrics
from ai_utils import explain_lyrics, detect_mood
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

@app.route("/ping")
def ping():
    return "pong"

@app.route("/api/interpret", methods=["POST"])
def interpret():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"error": "Missing query"}), 400

    try:
        artist, title = search_song(query)
        lyrics = fetch_lyrics(artist, title)
        explanation = explain_lyrics(lyrics)
        mood = detect_mood(lyrics)

        return jsonify({
            "artist": artist,
            "title": title,
            "lyrics": lyrics,
            "explanation": explanation,
            "mood": mood
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Enable external access in dev and allow reload on code change
    app.run(host="0.0.0.0", port=5000, debug=True)
