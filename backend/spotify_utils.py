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

def get_search_suggestions(query, limit=5):
    """New function for getting search suggestions with album art"""
    try:
        results = sp.search(q=query, type='track', limit=limit)
        suggestions = []
        for track in results['tracks']['items']:
            suggestions.append({
                'id': track['id'],
                'name': track['name'],
                'artists': [artist['name'] for artist in track['artists']],
                'album': {
                    'name': track['album']['name'],
                    'image': track['album']['images'][0]['url'] if track['album']['images'] else None
                }
            })
        return suggestions
    except Exception as e:
        print(f"Error fetching Spotify suggestions: {e}")
        return []