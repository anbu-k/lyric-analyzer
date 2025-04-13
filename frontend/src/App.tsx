import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import './css/App.css';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [snippet, setSnippet] = useState('');
  const [result, setResult] = useState<any>(null);
  const [snippetResult, setSnippetResult] = useState<any>(null);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snippetLoading, setSnippetLoading] = useState(false);

  const handleFullExplain = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/interpret', { query });
      setResult(res.data);
      setSnippetResult(null);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Something went wrong fetching lyrics.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSnippetExplain = async (lineText: string) => {
    setSnippetLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/explain-snippet', {
        snippet: lineText,
        full_lyrics: result.lyrics,
      });
      setSnippetResult(res.data);
      setSnippet(lineText);
    } catch (err) {
      console.error(err);
      setSnippetResult({ error: 'Something went wrong interpreting the snippet.' });
    } finally {
      setSnippetLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-layout">
        <div className="main-content">
          <div className="input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a song (e.g., Hello Adele)"
              className="input-box"
            />
            <button onClick={handleFullExplain} disabled={loading} className="fetch-button">
              {loading ? 'Fetching...' : 'Fetch Lyrics'}
            </button>
          </div>

          {result && !result.error && (
            <div>
              <h2>{result.title} — {result.artist}</h2>
              <h3>Lyrics:</h3>

              <div className="lyrics-box">
                {result.lyrics
                  .split(/\r?\n/)
                  .filter((line: string) => line.trim() !== '')
                  .map((line: string, idx: number) => (
                    <div
                      key={idx}
                      className={`lyric-line ${hoveredLine === idx ? 'hovered' : ''}`}
                      onClick={() => handleSnippetExplain(line)}
                      onMouseEnter={() => setHoveredLine(idx)}
                      onMouseLeave={() => setHoveredLine(null)}
                    >
                      {line}
                      {hoveredLine === idx && (
                        <span className="line-hint">💡 Click to analyze</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {result?.error && <p className="error-text">{result.error}</p>}
        </div>

        <div className={`side-panel ${isPanelOpen ? 'open' : ''}`}>
          <div className="toggle-button-wrapper">
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="toggle-button"
              title={isPanelOpen ? 'Collapse' : 'Expand'}
            />
          </div>
          
          <div className="panel-content">
            <h2>📝 Explanation Panel</h2>

            {snippetLoading && <p className="loading-text">Loading interpretation...</p>}

            {!snippetLoading && !snippetResult && (
              <p>Click a lyric line to see its interpretation.</p>
            )}

            {!snippetLoading && snippetResult?.error && (
              <p className="error-text">{snippetResult.error}</p>
            )}

            {!snippetLoading && snippetResult && !snippetResult.error && (
              <>
                <h3>Selected Line</h3>
                <blockquote className="quote-box">{snippetResult.snippet}</blockquote>

                {/* <h3 className="section-heading">Interpretation</h3> */}
                <div className="interpretation">
                  {snippetResult.explanation
                    .split(/\n(?=[A-Z])/)
                    .map((para: string, idx: number) => {
                      const match = para.match(/^([^:]+):(.*)/);
                      return (
                        <p key={idx}>
                          {match ? (
                            <>
                              <strong>{match[1]}:</strong>{match[2]}
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