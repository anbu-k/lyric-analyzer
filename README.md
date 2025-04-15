# 🎧 LyricIQ

**LyricIQ** is an interactive web application that helps users interpret song lyrics and detect musical samples used in songs.

---

## Current Pages/Features

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

![image](https://github.com/user-attachments/assets/614d16dc-d61b-4061-8486-3bc3195940d3)
![image](https://github.com/user-attachments/assets/e18ce115-a711-4ec8-aef1-31f2b4fdec35)
![image](https://github.com/user-attachments/assets/df2f0ab6-0695-46e4-a265-31b49a6d63ff)
![image](https://github.com/user-attachments/assets/1880c027-df8a-4659-bfb7-8a114ee89099)


### Sample Detection
- Analyze songs to find known or suspected samples
- Get direct YouTube links and previews for sample verification

![image](https://github.com/user-attachments/assets/5a460e31-7678-43f7-ac88-1a66bc17a703)

---

## Tech Stack

### Frontend
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
