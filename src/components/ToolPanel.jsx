export default function ToolPanel({ data }) {
  const useTools = data.tool_decision === 'USE_TOOLS';
  const failureMode = data.tool_failure_handling ?? 'NOT_APPLICABLE';
  const isGraceful = failureMode === 'GRACEFUL';
  const isCrash = failureMode === 'CRASH_RISK';

  return (
    <div className="panel rounded-sm p-5">
      <div className="mb-4">
        <div className="panel-label mb-1">SIGNAL-02</div>
        <div className="panel-title">Tool Decision</div>
      </div>

      {/* Flowchart */}
      <div className="flex items-center gap-3 mb-5" style={{ flexWrap: 'wrap' }}>
        <div
          className="rounded-sm px-4 py-2 text-center"
          style={{
            background: 'var(--teal-dim)',
            border: '1px solid rgba(0,212,200,0.25)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--teal)',
            letterSpacing: '0.08em',
            minWidth: '120px',
          }}
        >
          TOOLS AVAILABLE
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
          <div style={{ width: '24px', height: '1px', background: 'var(--border-bright)' }} />
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}>▶</span>
        </div>

        <div
          className="rounded-sm px-4 py-2 text-center font-bold"
          style={{
            background: useTools ? 'rgba(34,212,122,0.12)' : 'rgba(59,158,255,0.12)',
            border: `1px solid ${useTools ? 'rgba(34,212,122,0.4)' : 'rgba(59,158,255,0.4)'}`,
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: useTools ? '#22d47a' : '#3b9eff',
            letterSpacing: '0.08em',
            minWidth: '160px',
          }}
        >
          {useTools ? '✓ USE TOOLS' : '✓ ANSWER FROM MEMORY'}
        </div>
      </div>

      {/* Tools needed */}
      <div className="mb-4">
        <div className="panel-label mb-2">TOOLS IDENTIFIED</div>
        {data.tools_needed && data.tools_needed.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.tools_needed.map((tool) => (
              <span key={tool} className="chip">{tool}</span>
            ))}
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            — None needed
          </span>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginBottom: failureMode !== 'NOT_APPLICABLE' ? '12px' : '0' }}>
        <div className="panel-label">DECISION RATIONALE</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', lineHeight: '1.6' }}>
          {data.tool_decision_reason}
        </p>
      </div>

      {/* Failure handling — only when tools are involved */}
      {failureMode !== 'NOT_APPLICABLE' && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          <div className="panel-label mb-3">FAILURE HANDLING</div>

          {/* Mini sequence */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'TOOL CALL', color: 'var(--teal)', bg: 'var(--teal-dim)', border: 'rgba(0,212,200,0.25)' },
              null,
              { label: 'SERVER', color: 'var(--text-secondary)', bg: 'rgba(255,255,255,0.03)', border: 'var(--border)' },
              null,
              isGraceful
                ? { label: '{ isError: true }', color: '#22d47a', bg: 'rgba(34,212,122,0.1)', border: 'rgba(34,212,122,0.3)' }
                : { label: '⚠ CRASH', color: '#ff5f5f', bg: 'rgba(255,95,95,0.1)', border: 'rgba(255,95,95,0.3)' },
            ].map((node, i) => node === null ? (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '0 3px' }}>
                <div style={{ width: '12px', height: '1px', background: 'var(--border-bright)' }} />
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>▶</span>
              </div>
            ) : (
              <div
                key={i}
                style={{
                  padding: '3px 8px',
                  background: node.bg,
                  border: `1px solid ${node.border}`,
                  borderRadius: '2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: node.color,
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}
              >
                {node.label}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div
              className="badge"
              style={{
                background: isGraceful ? 'rgba(34,212,122,0.1)' : 'rgba(255,95,95,0.1)',
                border: `1px solid ${isGraceful ? 'rgba(34,212,122,0.3)' : 'rgba(255,95,95,0.3)'}`,
                color: isGraceful ? '#22d47a' : '#ff5f5f',
                fontSize: '10px',
              }}
            >
              {isGraceful ? '✓ Graceful Failure' : '⚠ Crash Risk'}
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.5', fontFamily: 'var(--font-body)' }}>
            {data.tool_failure_mode}
          </p>
        </div>
      )}
    </div>
  );
}
