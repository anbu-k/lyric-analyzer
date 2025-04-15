# 🎧 LyricIQ

**LyricIQ** is an interactive web application that helps users interpret song lyrics and detect musical samples used in songs.

---

## Features

### Lyrics Analysis
- Search for songs with autocomplete powered by the Spotify API
- Fetch complete lyrics
- Get contextual lyric explanations including:
  - Literal interpretation
  - Emotional tone
  - Cultural and historical significance
  - Symbolism, metaphors, and wordplay

### Snippet-Level Interpretation
- Click a line or drag to select multiple lines
- View focused interpretations in a clean sidebar panel

### Sample Detection
- Analyze songs to find known or suspected samples
- Get direct YouTube links and previews for sample verification

---

## Tech Stack

### 🖥Frontend
- React + TypeScript
- React Router
- Axios for API requests
- Custom CSS animations and UI styling (`App.css`, `Navbar.css`)

### Backend
- Flask (Python)
- Spotipy for Spotify API integration
- YouTube Data API for video previews
- Lyrics.ovh API for lyrics retrieval
- Custom logic for lyric and sample analysis
