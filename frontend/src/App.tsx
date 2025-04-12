import React, { useState } from 'react';
import axios from 'axios';

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
    <div style={{ height: '100vh', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <h1>Lyrics Explainer</h1>

          <div style={{ marginBottom: '2rem' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter song query (e.g., Hello Adele)"
              style={{ width: '300px', padding: '0.5rem', marginRight: '1rem' }}
            />
            <button onClick={handleFullExplain} disabled={loading}>
              {loading ? 'Fetching...' : 'Fetch & Explain'}
            </button>
          </div>

          {result && !result.error && (
            <div>
              <h2>{result.title} — {result.artist}</h2>
              <h3>Lyrics:</h3>

              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', background: '#fefefe' }}>
                {result.lyrics
                  .split(/\r?\n/)
                  .filter((line: string) => line.trim() !== '')
                  .map((line: string, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => handleSnippetExplain(line)}
                      onMouseEnter={() => setHoveredLine(idx)}
                      onMouseLeave={() => setHoveredLine(null)}
                      style={{
                        position: 'relative',
                        padding: '8px 12px',
                        marginBottom: '4px',
                        borderRadius: '6px',
                        transition: 'background 0.2s ease',
                        cursor: 'pointer',
                        fontSize: '16px',
                        lineHeight: '1.5',
                        background: hoveredLine === idx ? '#f0f0f0' : 'transparent',
                      }}
                    >
                      {line}
                      {hoveredLine === idx && (
                        <span
                          style={{
                            position: 'absolute',
                            right: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '12px',
                            color: '#888',
                          }}
                        >
                          💡 Click to analyze
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {result?.error && <p style={{ color: 'red' }}>{result.error}</p>}
        </div>
      </div>

      {/* Toggle Button */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: isPanelOpen ? '400px' : '0',
          transform: 'translateY(-50%)',
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
          title={isPanelOpen ? 'Collapse' : 'Expand'}
        >
          {isPanelOpen ? '🡄' : '🡆'}
        </button>
      </div>

      {/* Right Sidebar Panel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '400px',
          transform: isPanelOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: isPanelOpen ? 1 : 0,
          transition: 'transform 0.4s ease, opacity 0.4s ease',
          borderLeft: '1px solid #ccc',
          background: '#f9f9f9',
          overflowY: 'auto',
          zIndex: 50,
        }}
      >
        <div style={{ padding: '2rem', opacity: isPanelOpen ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          <h2>📝 Explanation Panel</h2>

          {snippetLoading && (
            <p style={{ fontStyle: 'italic', color: '#666' }}>Loading interpretation...</p>
          )}

          {!snippetLoading && !snippetResult && (
            <p>Click a lyric line to see its interpretation.</p>
          )}

          {!snippetLoading && snippetResult?.error && (
            <p style={{ color: 'red' }}>{snippetResult.error}</p>
          )}

          {!snippetLoading && snippetResult && !snippetResult.error && (
            <>
              <h3>Selected Line</h3>
              <blockquote style={{ background: '#f0f0f0', padding: '0.5rem', fontStyle: 'italic' }}>
                {snippetResult.snippet}
              </blockquote>

              <h3 style={{ marginTop: '50px' }}>Interpretation</h3>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {snippetResult.explanation
                  .split(/\n(?=[A-Z])/)
                  .map((para: string, idx: number) => {
                    const match = para.match(/^([^:]+):(.*)/);
                    return (
                      <p key={idx} style={{ marginBottom: '1rem' }}>
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
  );
};

export default App;
