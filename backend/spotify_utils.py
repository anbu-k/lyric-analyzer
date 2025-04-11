# backend/spotify_utils.py
import os
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv

load_dotenv()

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET")
))

def search_song(query):
    result = sp.search(q=query, type='track', limit=1)
    track = result['tracks']['items'][0]
    artist = track['artists'][0]['name']
    title = track['name']
    return artist, title
