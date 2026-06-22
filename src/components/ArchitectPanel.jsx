import PanelInfo from './PanelInfo';

const PANEL_INFO = "A 4×4 reference matrix from The Architect's Playbook maps enterprise problems (Token Bloat, Latency, Compliance/Control, Accuracy) against deployment domains to recommend the right architectural pattern. The highlighted cell (★) is where your query lands — one of 16 design patterns chosen to solve your specific problem-domain combination.";

const PROBLEMS = ['Token Bloat', 'Latency', 'Compliance/Control', 'Accuracy'];
const DOMAINS = ['Data Extraction', 'Customer Support', 'Developer Productivity', 'Multi-Agent'];

const MATRIX = {
  'Token Bloat|Data Extraction':           'Scratchpad File',
  'Token Bloat|Customer Support':          'Schema Redundancy',
  'Token Bloat|Developer Productivity':    'Structured Intermediates',
  'Token Bloat|Multi-Agent':               'Scratchpad File',
  'Latency|Data Extraction':              'Parallelization & Caching',
  'Latency|Customer Support':             'Batch Routing',
  'Latency|Developer Productivity':       'Granular MCP Tools',
  'Latency|Multi-Agent':                  'Parallelization & Caching',
  'Compliance/Control|Data Extraction':   'App-Layer Intercepts',
  'Compliance/Control|Customer Support':  'App-Layer Intercepts',
  'Compliance/Control|Developer Productivity': 'tool_choice Enforcement',
  'Compliance/Control|Multi-Agent':       'Shared Vector Store',
  'Accuracy|Data Extraction':             'Schema Redundancy',
  'Accuracy|Customer Support':            'Schema Redundancy',
  'Accuracy|Developer Productivity':      'Structured Intermediates',
  'Accuracy|Multi-Agent':                 'Shared Vector Store',
};

const SHORT_DOMAIN = {
  'Data Extraction':        'Data',
  'Customer Support':       'CX',
  'Developer Productivity': 'Dev',
  'Multi-Agent':            'Multi-A',
};

const SHORT_PROBLEM = {
  'Token Bloat':       'Token Bloat',
  'Latency':           'Latency',
  'Compliance/Control':'Compliance',
  'Accuracy':          'Accuracy',
};

export default function ArchitectPanel({ data }) {
  const activeP = data.architect_problem ?? '';
  const activeD = data.architect_domain ?? '';

  return (
    <div className="panel rounded-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="panel-label mb-1">SIGNAL-07</div>
          <div className="panel-title">Architect's Pattern</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <div
            className="badge"
            style={{
              background: 'var(--amber-dim)',
              border: '1px solid rgba(245,166,35,0.3)',
              color: 'var(--amber)',
              fontSize: '10px',
              maxWidth: '160px',
              textAlign: 'right',
              whiteSpace: 'normal',
              lineHeight: '1.3',
            }}
          >
            {data.architect_domain || '—'}
          </div>
          <PanelInfo text={PANEL_INFO} />
        </div>
      </div>

      {/* Reference matrix */}
      <div style={{ marginBottom: '16px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '80px' }} />
              {DOMAINS.map((d) => (
                <th
                  key={d}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8px',
                    letterSpacing: '0.08em',
                    color: d === activeD ? 'var(--amber)' : 'var(--text-muted)',
                    fontWeight: d === activeD ? '700' : '400',
                    padding: '0 2px 6px',
                    textAlign: 'center',
                  }}
                >
                  {SHORT_DOMAIN[d] || d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROBLEMS.map((prob) => (
              <tr key={prob}>
                <td
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8px',
                    letterSpacing: '0.06em',
                    color: prob === activeP ? 'var(--amber)' : 'var(--text-muted)',
                    fontWeight: prob === activeP ? '700' : '400',
                    paddingRight: '6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {SHORT_PROBLEM[prob]}
                </td>
                {DOMAINS.map((dom) => {
                  const key = `${prob}|${dom}`;
                  const pattern = MATRIX[key] || '';
                  const isActive = prob === activeP && dom === activeD;
                  const isRow = prob === activeP;
                  const isCol = dom === activeD;
                  return (
                    <td
                      key={dom}
                      title={pattern}
                      style={{
                        padding: '3px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          borderRadius: '2px',
                          padding: '4px 2px',
                          fontSize: '7px',
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.04em',
                          lineHeight: '1.3',
                          background: isActive
                            ? 'rgba(245,166,35,0.25)'
                            : isRow || isCol
                            ? 'rgba(245,166,35,0.07)'
                            : 'rgba(255,255,255,0.02)',
                          border: isActive
                            ? '1px solid rgba(245,166,35,0.6)'
                            : isRow || isCol
                            ? '1px solid rgba(245,166,35,0.2)'
                            : '1px solid var(--border)',
                          color: isActive
                            ? 'var(--amber)'
                            : isRow || isCol
                            ? 'rgba(245,166,35,0.6)'
                            : 'var(--text-muted)',
                          fontWeight: isActive ? '700' : '400',
                          transition: 'all 0.2s',
                          minHeight: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isActive ? '★' : '·'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pattern applied */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <div className="panel-label mb-2">PATTERN APPLIED</div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--amber-dim)',
            border: '1px solid rgba(245,166,35,0.3)',
            borderRadius: '2px',
            padding: '5px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--amber)',
            fontWeight: '600',
            letterSpacing: '0.06em',
            marginBottom: '8px',
          }}
        >
          ◆ {data.architect_pattern_applied || '—'}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.6', fontFamily: 'var(--font-body)' }}>
          {data.architect_pattern_explanation}
        </p>
      </div>
    </div>
  );
}
