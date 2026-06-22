export default function AntiPatternPanel({ data }) {
  if (!data.antipattern_detected) return null;

  return (
    <div
      className="panel rounded-sm p-5 panel-enter"
      style={{
        borderColor: 'rgba(255,95,95,0.45)',
        boxShadow: '0 0 20px rgba(255,95,95,0.08)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="panel-label mb-1" style={{ color: '#ff5f5f' }}>SIGNAL-10</div>
          <div className="panel-title" style={{ color: '#ff5f5f' }}>⚠ Anti-Pattern Warning</div>
        </div>
        <div
          className="badge"
          style={{
            background: 'rgba(255,95,95,0.12)',
            border: '1px solid rgba(255,95,95,0.4)',
            color: '#ff5f5f',
            animation: 'pulse-amber 2s ease-in-out infinite',
          }}
        >
          DETECTED
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Anti-pattern section */}
        <div style={{
          padding: '14px',
          background: 'rgba(255,95,95,0.07)',
          border: '1px solid rgba(255,95,95,0.25)',
          borderRadius: '2px',
          borderLeft: '3px solid #ff5f5f',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.12em',
            color: '#ff5f5f',
            marginBottom: '6px',
          }}>
            ANTI-PATTERN
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: '700',
            color: '#ff5f5f',
            marginBottom: '8px',
            lineHeight: '1.3',
          }}>
            {data.antipattern_name}
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'rgba(255,95,95,0.8)',
            lineHeight: '1.6',
          }}>
            {data.antipattern_explanation}
          </p>
        </div>

        {/* Architect's fix section */}
        <div style={{
          padding: '14px',
          background: 'rgba(34,212,122,0.07)',
          border: '1px solid rgba(34,212,122,0.25)',
          borderRadius: '2px',
          borderLeft: '3px solid #22d47a',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.12em',
            color: '#22d47a',
            marginBottom: '6px',
          }}>
            ARCHITECT'S FIX
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: '700',
            color: '#22d47a',
            marginBottom: '8px',
          }}>
            Correct Pattern
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'rgba(34,212,122,0.8)',
            lineHeight: '1.6',
          }}>
            {data.architects_fix}
          </p>
        </div>
      </div>
    </div>
  );
}
