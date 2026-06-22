import { useState, useRef } from 'react';
import { fetchMeta } from './api/analyst';
import { streamAnswer } from './api/answerer';
import InputArea from './components/InputArea';
import IntentPanel from './components/IntentPanel';
import ToolPanel from './components/ToolPanel';
import ContextPanel from './components/ContextPanel';
import ReasoningPanel from './components/ReasoningPanel';
import AnswerPanel from './components/AnswerPanel';
import DomainPanel from './components/DomainPanel';
import ConceptsPanel from './components/ConceptsPanel';
import TelemetryBar from './components/TelemetryBar';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [visiblePanels, setVisiblePanels] = useState([]);
  const [error, setError] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const answerRef = useRef('');
  const timingRef = useRef({});

  const handleSubmit = async (question) => {
    setLoading(true);
    setMeta(null);
    setAnswer('');
    answerRef.current = '';
    setVisiblePanels([]);
    setError(null);
    setIsStreaming(false);
    setTelemetry(null);
    setShowRaw(false);

    const queryStart = performance.now();
    timingRef.current = { queryStart, charsStreamed: 0 };

    try {
      let metaDone = false;
      let streamDone = false;

      const checkDone = () => {
        if (metaDone && streamDone) {
          setLoading(false);
          setTelemetry({ ...timingRef.current });
        }
      };

      setVisiblePanels([4]);
      setIsStreaming(true);

      await Promise.all([
        fetchMeta(question).then((result) => {
          timingRef.current.analyzeEnd = performance.now();
          setMeta(result);
          [0, 1, 2, 3, 5, 6].forEach((panelIdx, order) => {
            setTimeout(() => {
              setVisiblePanels((prev) => [...new Set([...prev, panelIdx])]);
            }, order * 150);
          });
          metaDone = true;
          checkDone();
        }),
        streamAnswer(
          question,
          (chunk) => {
            answerRef.current += chunk;
            setAnswer(answerRef.current);
            timingRef.current.charsStreamed = (timingRef.current.charsStreamed || 0) + chunk.length;
            if (!timingRef.current.firstChunk) {
              timingRef.current.firstChunk = performance.now();
            }
          },
          () => {
            timingRef.current.streamEnd = performance.now();
            setIsStreaming(false);
            streamDone = true;
            checkDone();
          }
        ),
      ]);
    } catch (err) {
      console.error(err);
      setError(err.message ?? 'Something went wrong. Check your API key in .env');
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const showPanel = (i) => visiblePanels.includes(i);

  return (
    <div style={{ minHeight: '100vh', padding: '0 16px 80px' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', padding: '48px 0 40px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'var(--teal)',
            background: 'var(--teal-dim)',
            border: '1px solid rgba(0,212,200,0.2)',
            borderRadius: '2px',
            padding: '4px 12px',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '8px' }}>◉</span>
          POWERED BY CLAUDE
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            fontSize: 'clamp(32px, 6vw, 64px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}
        >
          How Claude{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--amber) 0%, var(--teal) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Thinks
          </span>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            letterSpacing: '0.02em',
          }}
        >
          Real-time CCA-F architecture telemetry for every answer
        </p>

        <div
          style={{
            width: '80px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--amber), var(--teal), transparent)',
            margin: '24px auto 0',
          }}
        />
      </header>

      {/* Input */}
      <div style={{ marginBottom: '32px' }}>
        <InputArea onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto 32px',
            padding: '14px 18px',
            background: 'rgba(255,95,95,0.1)',
            border: '1px solid rgba(255,95,95,0.3)',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: '#ff5f5f',
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && !meta && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: 'var(--teal)',
            textAlign: 'center',
            marginBottom: '24px',
            animation: 'blink 1.2s step-end infinite',
          }}
        >
          ◉ PARALLEL ANALYSIS RUNNING — META AGENT + ANSWER STREAM...
        </div>
      )}

      {/* Telemetry bar (appears after both calls complete) */}
      {telemetry && (
        <TelemetryBar
          telemetry={telemetry}
          showRaw={showRaw}
          onToggleRaw={() => setShowRaw((v) => !v)}
        />
      )}

      {/* Panels */}
      {(meta || answer) && (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Row 1: Intent + Tool + Context */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            {meta && showPanel(0) && (
              <div className="panel-enter"><IntentPanel data={meta} /></div>
            )}
            {meta && showPanel(1) && (
              <div className="panel-enter" style={{ animationDelay: '0.05s' }}>
                <ToolPanel data={meta} />
              </div>
            )}
            {meta && showPanel(2) && (
              <div className="panel-enter" style={{ animationDelay: '0.1s' }}>
                <ContextPanel data={meta} />
              </div>
            )}
          </div>

          {/* Row 2: Reasoning + Domain Map */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            {meta && showPanel(3) && (
              <div className="panel-enter" style={{ animationDelay: '0.15s' }}>
                <ReasoningPanel data={meta} />
              </div>
            )}
            {meta && showPanel(5) && (
              <div className="panel-enter" style={{ animationDelay: '0.2s' }}>
                <DomainPanel data={meta} />
              </div>
            )}
          </div>

          {/* Row 3: CCA-F Concepts */}
          {meta && showPanel(6) && (
            <div className="panel-enter" style={{ animationDelay: '0.25s', marginBottom: '16px' }}>
              <ConceptsPanel data={meta} />
            </div>
          )}

          {/* Raw JSON panel */}
          {showRaw && meta && (
            <div className="panel-enter" style={{ marginBottom: '16px' }}>
              <div className="panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div className="panel-label" style={{ marginBottom: '4px' }}>RAW PAYLOAD</div>
                    <div className="panel-title">API Response JSON</div>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(meta, null, 2))}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      padding: '5px 12px',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >
                    COPY JSON
                  </button>
                </div>
                <pre
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    lineHeight: '1.7',
                    color: 'var(--teal)',
                    overflow: 'auto',
                    maxHeight: '420px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border)',
                    borderRadius: '2px',
                  }}
                >
                  {JSON.stringify(meta, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Row 4: Answer */}
          {showPanel(4) && (
            <div className="panel-enter">
              <AnswerPanel
                answer={answer}
                isStreaming={isStreaming}
                confidence={meta?.confidence}
              />
            </div>
          )}
        </div>
      )}

      <footer
        style={{
          textAlign: 'center',
          marginTop: '64px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.15em',
          color: 'var(--text-muted)',
        }}
      >
        CCAF · 5 DOMAINS · CLAUDE AGENT ARCHITECTURE · REACT + VITE
      </footer>
    </div>
  );
}
