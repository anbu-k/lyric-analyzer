import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import "../css/App.css";

const SampleDetector: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sampleResult, setSampleResult] = useState<any>(null);

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

  const handleSampleSearch = async () => {
    if (!selectedTrack) {
      alert("Please select a track from the dropdown.");
      return;
    }

    setLoading(true);
    setShowSuggestions(false);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/get-samples-ai",
        {
          artist: selectedTrack.artists[0],
          title: selectedTrack.name,
        }
      );
      const parsed = response.data.samples;
      setSampleResult({ samples: parsed });
    } catch (error) {
      console.error("Sample detection error:", error);
      setSampleResult({ error: "Sample detection failed." });
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|v=)([^&]+)/);
    return match ? match[1] : "";
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        <div className="main-content">
          <div className="input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search for a song to detect samples"
              className="input-box"
              onKeyDown={(e) => e.key === "Enter" && handleSampleSearch()}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="suggestion-item"
                    onMouseDown={() => {
                      setQuery(`${suggestion.name} ${suggestion.artists[0]}`);
                      setSelectedTrack(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    <img
                      src={suggestion.album.image}
                      alt="Album cover"
                      className="suggestion-image"
                    />
                    <div className="suggestion-text">
                      <div className="suggestion-title">{suggestion.name}</div>
                      <div className="suggestion-artist">
                        {suggestion.artists.join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleSampleSearch}
              disabled={loading}
              className="fetch-button"
              style={{ marginLeft: "1rem" }}
            >
              {loading ? "Detecting..." : "Detect Samples"}
            </button>
          </div>

          {sampleResult && !sampleResult.error && (
            <>
              {selectedTrack && (
                <div className="sample-song-header">
                  <div className="sample-song-title">{selectedTrack.name}</div>
                  <div className="sample-song-artist">
                    {selectedTrack.artists.join(", ")}
                  </div>
                </div>
              )}
              <div className="sample-box">
                <h2>Samples Found:</h2>
                {sampleResult.samples?.length > 0 ? (
                  sampleResult.samples.map((sample: any, idx: number) => (
                    <div key={idx} className="sample-entry fade-in">
                      <div className="sample-title">
                        🎶 <strong>{sample.sample_title}</strong> by{" "}
                        {sample.sample_artist}
                      </div>
                      <div className="sample-meta">{sample.explanation}</div>

                      {sample.youtube_link && (
                        <div className="sample-preview">
                          <a
                            href={sample.youtube_link}
                            target="_blank"
                            rel="noreferrer"
                            className="sample-link"
                          >
                            <img
                              src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                                sample.youtube_link
                              )}/hqdefault.jpg`}
                              alt="YouTube thumbnail"
                              className="sample-thumbnail"
                            />
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="sample-meta">No samples detected.</div>
                )}
              </div>
            </>
          )}

          {sampleResult?.error && (
            <p className="error-text">{sampleResult.error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SampleDetector;
