export default function TelemetryBar({ telemetry, showRaw, onToggleRaw }) {
  if (!telemetry) return null;

  const { queryStart, analyzeEnd, firstChunk, streamEnd, charsStreamed } = telemetry;

  const toSec = (a, b) => ((b - a) / 1000).toFixed(2);
  const totalEnd = Math.max(analyzeEnd || 0, streamEnd || 0);
  const totalMs = totalEnd - queryStart;

  const analyzeDur = toSec(queryStart, analyzeEnd);
  const ttft = toSec(queryStart, firstChunk || queryStart);
  const streamDur = toSec(firstChunk || queryStart, streamEnd || queryStart);
  const total = toSec(queryStart, totalEnd);
  const cps = streamEnd && firstChunk && streamEnd > firstChunk
    ? Math.round(charsStreamed / ((streamEnd - firstChunk) / 1000))
    : 0;
  const estTokens = Math.round(charsStreamed / 4);
  // Claude Sonnet output: $15/MTok
  const estCost = (estTokens / 1_000_000 * 15).toFixed(6);

  // Waterfall widths as percentages of total
  const pct = (a, b) => totalMs > 0 ? ((b - a) / totalMs * 100).toFixed(1) : '0';
  const analyzeWidth = pct(queryStart, analyzeEnd);
  const streamLeft = pct(queryStart, firstChunk || queryStart);
  const streamWidth = pct(firstChunk || queryStart, streamEnd || queryStart);

  const metrics = [
    { label: 'ANALYZE', value: `${analyzeDur}s`, color: 'var(--amber)' },
    { label: 'TTFT', value: `${ttft}s`, color: 'var(--teal)' },
    { label: 'STREAM', value: `${streamDur}s`, color: 'var(--teal)' },
    { label: 'TOTAL', value: `${total}s`, color: 'var(--text-primary)' },
    { label: 'SPEED', value: `${cps} c/s`, color: 'var(--text-secondary)' },
    { label: '≈TOKENS', value: estTokens.toLocaleString(), color: 'var(--text-secondary)' },
    { label: '≈COST', value: `$${estCost}`, color: '#7afa6e' },
  ];

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto 32px', fontFamily: 'var(--font-mono)' }}>
      {/* Metrics row */}
      <div style={{
        display: 'flex',
        border: '1px solid var(--border)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '6px',
        background: 'var(--bg-panel)',
      }}>
        {metrics.map(({ label, value, color }, i) => (
          <div
            key={label}
            style={{
              flex: '1 1 0',
              padding: '7px 8px',
              borderRight: '1px solid var(--border)',
              textAlign: 'center',
              minWidth: 0,
            }}
          >
            <div style={{ fontSize: '7px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '3px' }}>
              {label}
            </div>
            <div style={{ fontSize: '12px', color, fontWeight: '600', whiteSpace: 'nowrap' }}>
              {value}
            </div>
          </div>
        ))}

        {/* Raw JSON toggle */}
        <button
          onClick={onToggleRaw}
          title="Toggle raw API response JSON"
          style={{
            padding: '7px 14px',
            background: showRaw ? 'rgba(245,166,35,0.12)' : 'transparent',
            border: 'none',
            color: showRaw ? 'var(--amber)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            letterSpacing: '0.05em',
            transition: 'color 0.15s, background 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { if (!showRaw) e.currentTarget.style.color = 'var(--text-secondary)'; }}
          onMouseLeave={(e) => { if (!showRaw) e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          {'{ }'}
        </button>
      </div>

      {/* Waterfall */}
      <div style={{
        position: 'relative',
        height: '22px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        {/* Analyze bar */}
        <div style={{
          position: 'absolute',
          top: '4px', bottom: '4px', left: 0,
          width: `${analyzeWidth}%`,
          background: 'rgba(245,166,35,0.35)',
          borderRadius: '1px',
          display: 'flex', alignItems: 'center', paddingLeft: '6px', overflow: 'hidden',
        }}>
          <span style={{ fontSize: '7px', letterSpacing: '0.12em', color: 'var(--amber)', whiteSpace: 'nowrap' }}>
            ANALYZE {analyzeDur}s
          </span>
        </div>

        {/* Stream bar */}
        <div style={{
          position: 'absolute',
          top: '4px', bottom: '4px',
          left: `${streamLeft}%`,
          width: `${streamWidth}%`,
          background: 'rgba(0,212,200,0.3)',
          borderRadius: '1px',
          display: 'flex', alignItems: 'center', paddingLeft: '6px', overflow: 'hidden',
        }}>
          <span style={{ fontSize: '7px', letterSpacing: '0.12em', color: 'var(--teal)', whiteSpace: 'nowrap' }}>
            STREAM {streamDur}s
          </span>
        </div>

        {/* Total label */}
        <div style={{
          position: 'absolute',
          right: '6px', top: '50%', transform: 'translateY(-50%)',
          fontSize: '7px', color: 'var(--text-muted)', letterSpacing: '0.12em',
        }}>
          {total}s
        </div>
      </div>
    </div>
  );
}
