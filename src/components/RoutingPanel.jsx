import PanelInfo from './PanelInfo';

const PANEL_INFO = "In production systems, not every query needs real-time processing. This panel shows whether your request should use Anthropic's Batch API (~50% cost reduction, ~24h turnaround) or requires immediate streaming. The SLA category (Urgent Exception, Standard Workflow, Continuous Arrival) tells you how to prioritize this request in a processing queue.";

const SLA_CONFIG = {
  'Urgent Exception':    { color: '#ff5f5f', note: 'Needs immediate human attention' },
  'Standard Workflow':   { color: '#f5a623', note: 'Predictable, schedulable' },
  'Continuous Arrival':  { color: '#22d47a', note: 'High-volume, batch-eligible' },
};

export default function RoutingPanel({ data }) {
  const isBatch = data.routing_decision === 'BATCH';

  const realtimeActive = !isBatch;
  const batchActive = isBatch;

  const rtColor  = realtimeActive ? '#ff7c3e' : 'var(--text-muted)';
  const rtBg     = realtimeActive ? 'rgba(255,124,62,0.12)' : 'rgba(255,255,255,0.02)';
  const rtBorder = realtimeActive ? 'rgba(255,124,62,0.45)' : 'var(--border)';

  const bColor  = batchActive ? '#22d47a' : 'var(--text-muted)';
  const bBg     = batchActive ? 'rgba(34,212,122,0.12)' : 'rgba(255,255,255,0.02)';
  const bBorder = batchActive ? 'rgba(34,212,122,0.4)' : 'var(--border)';

  const sla = SLA_CONFIG[data.sla_category] ?? SLA_CONFIG['Standard Workflow'];

  return (
    <div className="panel rounded-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="panel-label mb-1">SIGNAL-09</div>
          <div className="panel-title">Routing Decision</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            className="badge"
            style={{
              background: isBatch ? 'rgba(34,212,122,0.12)' : 'rgba(255,124,62,0.12)',
              border: `1px solid ${isBatch ? 'rgba(34,212,122,0.4)' : 'rgba(255,124,62,0.4)'}`,
              color: isBatch ? '#22d47a' : '#ff7c3e',
            }}
          >
            {isBatch ? '⚡ BATCH' : '⚡ REAL-TIME'}
          </div>
          <PanelInfo text={PANEL_INFO} />
        </div>
      </div>

      {/* Flowchart */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '0', marginBottom: '16px' }}>
        {/* Source node */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 12px',
          background: 'var(--teal-dim)',
          border: '1px solid rgba(0,212,200,0.25)',
          borderRadius: '2px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--teal)',
          letterSpacing: '0.08em',
          textAlign: 'center',
          minWidth: '60px',
        }}>
          REQUEST
        </div>

        {/* Arrow stem */}
        <div style={{ display: 'flex', alignItems: 'center', width: '24px', position: 'relative', flexShrink: 0 }}>
          <div style={{ width: '100%', height: '2px', background: 'var(--border-bright)' }} />
        </div>

        {/* Fork + paths */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* REAL-TIME path */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            opacity: realtimeActive ? 1 : 0.4,
          }}>
            <div style={{
              width: '2px', height: '20px',
              background: realtimeActive ? '#ff7c3e' : 'var(--border)',
              marginRight: '6px',
              flexShrink: 0,
            }} />
            <div style={{
              flex: 1,
              padding: '6px 10px',
              background: rtBg,
              border: `1px solid ${rtBorder}`,
              borderRadius: '2px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: rtColor, letterSpacing: '0.1em', fontWeight: realtimeActive ? '700' : '400' }}>
                  {realtimeActive ? '▶ ' : ''}REAL-TIME
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: realtimeActive ? '#ff7c3e' : 'var(--text-muted)' }}>
                  instant · full cost
                </span>
              </div>
            </div>
          </div>

          {/* BATCH path */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            opacity: batchActive ? 1 : 0.4,
          }}>
            <div style={{
              width: '2px', height: '20px',
              background: batchActive ? '#22d47a' : 'var(--border)',
              marginRight: '6px',
              flexShrink: 0,
            }} />
            <div style={{
              flex: 1,
              padding: '6px 10px',
              background: bBg,
              border: `1px solid ${bBorder}`,
              borderRadius: '2px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: bColor, letterSpacing: '0.1em', fontWeight: batchActive ? '700' : '400' }}>
                  {batchActive ? '▶ ' : ''}BATCH
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: batchActive ? '#22d47a' : 'var(--text-muted)' }}>
                  ~24h · {data.estimated_cost_saving || '~50%'} savings
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLA + reason */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <div style={{
          padding: '4px 10px',
          background: `${sla.color}15`,
          border: `1px solid ${sla.color}44`,
          borderRadius: '2px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: sla.color,
          letterSpacing: '0.08em',
        }}>
          SLA: {data.sla_category || '—'}
        </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.6', fontFamily: 'var(--font-body)' }}>
        {data.routing_reason}
      </p>
    </div>
  );
}
