import PanelInfo from './PanelInfo';

const PANEL_INFO = 'Real-world Claude deployments accumulate bloated context windows — stale tool results, resolved conversation turns, verbose schemas. This panel shows which fields in the simulated context are truly needed versus which can safely be pruned. Leaner context means lower costs, faster responses, and fewer distractions for the model during reasoning.';

export default function ContextPruningPanel({ data }) {
  if (!data.context_pruning_needed) return null;

  const raw = data.raw_context_fields ?? [];
  const pruned = new Set(data.pruned_context_fields ?? []);

  return (
    <div className="panel rounded-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="panel-label mb-1">SIGNAL-11</div>
          <div className="panel-title">Context Pruning</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            className="badge"
            style={{
              background: 'rgba(34,212,122,0.12)',
              border: '1px solid rgba(34,212,122,0.3)',
              color: '#22d47a',
            }}
          >
            {data.tokens_saved_estimate || '~?% saved'}
          </div>
          <PanelInfo text={PANEL_INFO} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'start', marginBottom: '16px' }}>
        {/* Raw context */}
        <div style={{
          padding: '12px',
          background: 'rgba(255,95,95,0.06)',
          border: '1px solid rgba(255,95,95,0.2)',
          borderRadius: '2px',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.12em',
            color: '#ff5f5f',
            marginBottom: '8px',
          }}>
            RAW CONTEXT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {raw.map((field) => {
              const kept = pruned.has(field);
              return (
                <div
                  key={field}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: kept ? 'var(--text-secondary)' : '#ff5f5f',
                    textDecoration: kept ? 'none' : 'line-through',
                    opacity: kept ? 0.7 : 1,
                    letterSpacing: '0.04em',
                    padding: '2px 4px',
                    background: kept ? 'transparent' : 'rgba(255,95,95,0.07)',
                    borderRadius: '2px',
                  }}
                >
                  {field}
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          paddingTop: '28px',
        }}>
          <div style={{
            width: '32px',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(255,95,95,0.5), rgba(34,212,122,0.5))',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            color: 'var(--text-muted)',
          }}>▶</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '8px',
            color: '#22d47a',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}>
            {data.tokens_saved_estimate}
          </span>
        </div>

        {/* Pruned context */}
        <div style={{
          padding: '12px',
          background: 'rgba(34,212,122,0.06)',
          border: '1px solid rgba(34,212,122,0.2)',
          borderRadius: '2px',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.12em',
            color: '#22d47a',
            marginBottom: '8px',
          }}>
            PRUNED CONTEXT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {Array.from(pruned).map((field) => (
              <div
                key={field}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: '#22d47a',
                  letterSpacing: '0.04em',
                  padding: '2px 4px',
                  background: 'rgba(34,212,122,0.08)',
                  borderRadius: '2px',
                }}
              >
                ✓ {field}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategy */}
      {data.pruning_strategy && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'var(--bg-base)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            STRATEGY:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--teal)', letterSpacing: '0.06em' }}>
            {data.pruning_strategy}
          </span>
        </div>
      )}
    </div>
  );
}
