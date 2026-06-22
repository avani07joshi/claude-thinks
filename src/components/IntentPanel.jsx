import PanelInfo from './PanelInfo';

const PANEL_INFO = 'Claude first classifies your query\'s intent before doing anything else. The intent type (Factual, Creative, Analytical, Conversational, Tool-Required) shapes every downstream decision: which tools to call, how deeply to reason, and which knowledge sources to draw from. Complexity (LOW/MEDIUM/HIGH) sets the reasoning budget allocated.';

const INTENT_CONFIG = {
  Factual:       { color: '#3b9eff', bg: 'rgba(59,158,255,0.12)', border: 'rgba(59,158,255,0.3)' },
  Creative:      { color: '#b06aff', bg: 'rgba(176,106,255,0.12)', border: 'rgba(176,106,255,0.3)' },
  Analytical:    { color: '#f5a623', bg: 'rgba(245,166,35,0.12)',  border: 'rgba(245,166,35,0.3)' },
  Conversational:{ color: '#22d47a', bg: 'rgba(34,212,122,0.12)', border: 'rgba(34,212,122,0.3)' },
  'Tool-Required':{ color: '#ff5f5f', bg: 'rgba(255,95,95,0.12)', border: 'rgba(255,95,95,0.3)' },
};

const COMPLEXITY_CONFIG = {
  LOW:    { color: '#22d47a', label: '● LOW' },
  MEDIUM: { color: '#f5a623', label: '◆ MEDIUM' },
  HIGH:   { color: '#ff5f5f', label: '▲ HIGH' },
};

export default function IntentPanel({ data }) {
  const intent = INTENT_CONFIG[data.intent_type] || INTENT_CONFIG.Factual;
  const complexity = COMPLEXITY_CONFIG[data.complexity] || COMPLEXITY_CONFIG.MEDIUM;

  return (
    <div className="panel rounded-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="panel-label mb-1">SIGNAL-01</div>
          <div className="panel-title">Intent Detected</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            className="badge"
            style={{ background: complexity.color + '18', border: `1px solid ${complexity.color}55`, color: complexity.color }}
          >
            {complexity.label}
          </div>
          <PanelInfo text={PANEL_INFO} />
        </div>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <div
          className="badge text-base font-bold tracking-widest"
          style={{ background: intent.bg, border: `1px solid ${intent.border}`, color: intent.color, fontSize: '13px', padding: '6px 14px' }}
        >
          {data.intent_type.toUpperCase()}
        </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-body)' }}>
        {data.intent_explanation}
      </p>

      <div
        className="mt-4 pt-4"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="panel-label">COMPLEXITY REASON</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', fontFamily: 'var(--font-mono)', lineHeight: '1.5' }}>
          {data.complexity_reason}
        </p>
      </div>
    </div>
  );
}
