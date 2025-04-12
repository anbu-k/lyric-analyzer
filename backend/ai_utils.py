import openai
import os
from textblob import TextBlob
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def explain_lyrics(full_lyrics: str, snippet: str) -> str:
    prompt = f"""
You are a literary, cultural, and music analysis expert. You are given the full lyrics of a song and a specific line or section the user wants interpreted.

Use the **full lyrics** to understand the context — then provide a rich, thoughtful analysis of the **selected snippet**.

Please break down:
- The **literal meaning** of the line(s) in context
- Any **emotional or psychological tone**
- **Cultural, historical, or social references** (e.g., race, politics, generational views, slang)
- Any **metaphors, symbolism, wordplay, or double meanings**
- How these lines **connect to or contrast** with previous or future lines in the song
- Optionally, how the line fits the artist’s **broader themes or career**

Stay objective and insightful. Do not simply restate the lyrics. Think like a Genius editor with cultural literacy and literary sharpness.

Full song:
\"\"\"{full_lyrics}\"\"\"

Selected snippet to interpret:
\"\"\"{snippet}\"\"\"
"""
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{ "role": "user", "content": prompt }],
        max_tokens=900,
        temperature=0.7,
    )
    return response['choices'][0]['message']['content']


def detect_mood(lyrics: str) -> str:
    blob = TextBlob(lyrics)
    polarity = blob.sentiment.polarity
    if polarity > 0.2:
        return "positive"
    elif polarity < -0.2:
        return "negative"
    else:
        return "neutral"
