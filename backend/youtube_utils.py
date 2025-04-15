import requests
import os
from dotenv import load_dotenv

load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def search_youtube_video(query: str) -> str:
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "key": YOUTUBE_API_KEY,
        "maxResults": 1
    }

    try:
        response = requests.get(url, params=params)
        results = response.json()
        if results.get("items"):
            video_id = results["items"][0]["id"]["videoId"]
            return f"https://www.youtube.com/watch?v={video_id}"
    except Exception as e:
        print(f"❌ YouTube API Error: {e}")

    return None
