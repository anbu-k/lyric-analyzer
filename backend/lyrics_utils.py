import requests

def fetch_lyrics(artist, title):
    url = f"https://api.lyrics.ovh/v1/{artist}/{title}"
    res = requests.get(url)
    if res.status_code == 200:
        return res.json().get("lyrics", "Lyrics not found.")
    else:
        return "Lyrics not found."
