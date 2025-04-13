import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from spotify_utils import search_song, get_search_suggestions
from lyrics_utils import fetch_lyrics
from ai_utils import explain_lyrics, detect_mood
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  

@app.route("/ping")
def ping():
    return "pong"

@app.route("/api/spotify-suggestions", methods=["GET"])
def spotify_suggestions():
    query = request.args.get("q")
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400

    try:
        suggestions = get_search_suggestions(query)
        return jsonify(suggestions)
    except Exception as e:
        print(f"Error in suggestions endpoint: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/interpret", methods=["POST"])
def interpret():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"error": "Missing query"}), 400

    try:
        print(f"🔍 Searching for: {query}")
        artist, title = search_song(query)
        print(f"🎵 Found: {artist} — {title}")
        lyrics = fetch_lyrics(artist, title)
        print(f"📝 Lyrics fetched ({len(lyrics)} chars)")
        explanation = explain_lyrics(lyrics, lyrics)  # full + full as fallback
        mood = detect_mood(lyrics)

        return jsonify({
            "artist": artist,
            "title": title,
            "lyrics": lyrics,
            "explanation": explanation,
            "mood": mood
        })
    except Exception as e:
        print(f"❌ Error during interpretation: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/explain-snippet", methods=["POST"])
def explain_snippet():
    data = request.get_json()
    snippet = data.get("snippet")
    full_lyrics = data.get("full_lyrics")

    if not snippet or not full_lyrics:
        return jsonify({"error": "Missing snippet or full lyrics"}), 400

    try:
        explanation = explain_lyrics(full_lyrics, snippet)  
        mood = detect_mood(snippet)

        return jsonify({
            "snippet": snippet,
            "explanation": explanation,
            # "mood": mood
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
