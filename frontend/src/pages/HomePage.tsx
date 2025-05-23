import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import "../css/App.css";

const App: React.FC = () => {
  const [query, setQuery] = useState("");
  const [snippet, setSnippet] = useState("");
  const [result, setResult] = useState<any>(null);
  const [snippetResult, setSnippetResult] = useState<any>(null);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snippetLoading, setSnippetLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  

  const fetchSuggestions = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:5000/api/spotify-suggestions",
          {
            params: { q: searchQuery },
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel();
  }, [query, fetchSuggestions]);

  const handleFullExplain = async () => {
    setLoading(true);
    setShowSuggestions(false);
    try {
      const res = await axios.post("http://localhost:5000/api/interpret", {
        query,
      });
      setResult(res.data);
      setSnippetResult(null);
    } catch (err) {
      console.error(err);
      setResult({ error: "Something went wrong fetching lyrics." });
    } finally {
      setLoading(false);
    }
  };

  const handleSnippetExplain = async (lineText: string) => {
    setSnippetLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/explain-snippet",
        {
          snippet: lineText,
          full_lyrics: result.lyrics,
        }
      );
      setSnippetResult(res.data);
      setSnippet(lineText);
    } catch (err) {
      console.error(err);
      setSnippetResult({
        error: "Something went wrong interpreting the snippet.",
      });
    } finally {
      setSnippetLoading(false);
    }
  };

  const handleSelectionStart = (idx: number) => {
    setIsSelecting(true);
    setSelectionStart(idx);
    setSelectionEnd(idx);
  };

  const handleSelectionMove = (idx: number) => {
    if (isSelecting) {
      setSelectionEnd(idx);
    }
  };

  const handleSelectionEnd = () => {
    setIsSelecting(false);
    if (selectionStart !== null && selectionEnd !== null) {
      const start = Math.min(selectionStart, selectionEnd);
      const end = Math.max(selectionStart, selectionEnd);
      const selectedLines = result.lyrics
        .split(/\r?\n/)
        .filter((line: string) => line.trim() !== '')
        .slice(start, end + 1)
        .join('\n');
      handleSnippetExplain(selectedLines);
    }
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        <div className="main-content">
          <div className="input-group" style={{ position: "relative" }}>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Type in a song"
              className="input-box"
              onKeyDown={(e) => e.key === "Enter" && handleFullExplain()}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "42.5rem",
                  width: "300px",
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "0 0 8px 8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  zIndex: 100,
                }}
              >
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseDown={() => {
                      setQuery(`${suggestion.name} ${suggestion.artists[0]}`);
                      setShowSuggestions(false);
                    }}
                  >
                    <img
                      src={suggestion.album.image}
                      alt="Album cover"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginRight: "12px",
                        borderRadius: "4px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{suggestion.name}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {suggestion.artists.join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleFullExplain}
              disabled={loading}
              className="fetch-button"
              style={{ marginLeft: "1rem" }}
            >
              {loading ? "Fetching..." : "Fetch Lyrics"}
            </button>
          </div>

          {result && !result.error && (
            <div className="song-title-container">
              <h2>
                <span className="song-title">{result.title}</span>
                <span> — </span>
                <span className="song-artist">{result.artist}</span>
              </h2>
              <div className={`lyrics-box ${isSelecting ? 'selecting' : ''}`}>
                {result.lyrics
                  .split(/\r?\n/)
                  .filter((line: string) => line.trim() !== '')
                  .map((line: string, idx: number) => {
                    const isSelected = selectionStart !== null && 
                                      selectionEnd !== null && 
                                      idx >= Math.min(selectionStart, selectionEnd) && 
                                      idx <= Math.max(selectionStart, selectionEnd);
                    
                    return (
                      <div
                        key={idx}
                        className={`lyric-line ${hoveredLine === idx ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSnippetExplain(line)}
                        onMouseDown={() => handleSelectionStart(idx)}
                        onMouseEnter={() => {
                          setHoveredLine(idx);
                          handleSelectionMove(idx);
                        }}
                        onMouseUp={handleSelectionEnd}
                        data-idx={idx}
                      >
                        {line}
                        {hoveredLine === idx && (
                          <span className="line-hint">💡 Click to analyze a single line, Click and drag to analyze multiple lines</span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {result?.error && <p className="error-text">{result.error}</p>}
        </div>

        <div className={`side-panel ${isPanelOpen ? "open" : ""}`}>
          <div className="toggle-button-wrapper">
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="toggle-button"
              title={isPanelOpen ? "Collapse" : "Expand"}
            />
          </div>

          <div className="panel-content">
            <h2>Explanation Panel</h2>

            {snippetLoading && (
              <p className="loading-text">Loading interpretation...</p>
            )}

            {!snippetLoading && !snippetResult && (
              <p style={{marginTop: "-10px"}}>Click or drag lyrics to analyze</p>
            )}

            {!snippetLoading && snippetResult?.error && (
              <p className="error-text">{snippetResult.error}</p>
            )}

            {!snippetLoading && snippetResult && !snippetResult.error && (
              <>
                <h3>Selected Line(s)</h3>
                <blockquote className="quote-box">
                  {snippetResult.snippet}
                </blockquote>

                <div className="interpretation">
                  {snippetResult.explanation
                    .split(/\n(?=[A-Z])/)
                    .map((para: string, idx: number) => {
                      const match = para.match(/^([^:]+):(.*)/);
                      return (
                        <p key={idx}>
                          {match ? (
                            <>
                              <strong>{match[1]}:</strong>
                              {match[2]}
                            </>
                          ) : (
                            para
                          )}
                        </p>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;