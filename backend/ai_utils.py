# backend/ai_utils.py
import openai
import os
from textblob import TextBlob
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def explain_lyrics(lyrics):
    prompt = f"""
You are a music expert. Explain the meaning of the following song lyrics line by line in plain English:

Lyrics:
{lyrics}
"""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{ "role": "user", "content": prompt }],
        max_tokens=600
    )
    return response['choices'][0]['message']['content']

def detect_mood(lyrics):
    blob = TextBlob(lyrics)
    polarity = blob.sentiment.polarity
    if polarity > 0.2:
        return "positive"
    elif polarity < -0.2:
        return "negative"
    else:
        return "neutral"
