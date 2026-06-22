import PanelInfo from './PanelInfo';

const PANEL_INFO = 'CCA-F (Claude Competency Assessment Framework) maps your query across 5 architectural domains: Agent Architecture, Tool Design, Claude Code, Prompt Engineering, and Context Management — each weighted differently in the framework. This map helps you identify which CCA-F competencies to prioritize when building production systems that handle this type of request.';

const RELEVANCE_COLOR = {
  HIGH:   { color: '#f5a623', bg: 'rgba(245,166,35,0.15)',  border: 'rgba(245,166,35,0.4)' },
  MEDIUM: { color: '#00d4c8', bg: 'rgba(0,212,200,0.12)',   border: 'rgba(0,212,200,0.3)' },
  LOW:    { color: '#3b5068', bg: 'rgba(59,80,104,0.15)',   border: 'rgba(59,80,104,0.4)' },
  NONE:   { color: '#2a3a4a', bg: 'rgba(30,45,64,0.5)',     border: 'rgba(30,45,64,0.8)' },
};

const DOMAIN_PERCENT = { D1: 27, D2: 18, D3: 20, D4: 20, D5: 15 };

export default function DomainPanel({ data }) {
  const domains = data.ccaf_domains ?? [];

  return (
    <div className="panel rounded-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="panel-label mb-1">SIGNAL-06</div>
          <div className="panel-title">CCA-F Domain Map</div>
        </div>
        <PanelInfo text={PANEL_INFO} />
      </div>

      <div className="flex flex-col gap-2">
        {domains.map((d) => {
          const style = RELEVANCE_COLOR[d.relevance] ?? RELEVANCE_COLOR.NONE;
          const pct = DOMAIN_PERCENT[d.id] ?? 20;
          return (
            <div
              key={d.id}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: '2px',
                padding: '10px 12px',
                transition: 'opacity 0.3s',
                opacity: d.relevance === 'NONE' ? 0.45 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: '700',
                      color: style.color,
                      background: `${style.color}22`,
                      border: `1px solid ${style.color}55`,
                      padding: '1px 6px',
                      borderRadius: '2px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {d.id} · {pct}%
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: style.color,
                      letterSpacing: '0.08em',
                    }}
                  >
                    {d.relevance}
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: d.relevance === 'NONE' ? 'var(--text-muted)' : 'var(--text-primary)',
                  marginBottom: '4px',
                  letterSpacing: '0.02em',
                }}
              >
                {d.name}
              </div>
              {d.relevance !== 'NONE' && (
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                  }}
                >
                  {d.reason}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
