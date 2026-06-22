import PanelInfo from './PanelInfo';

const PANEL_INFO = 'The final response, streamed token-by-token via Server-Sent Events (SSE). Streaming dramatically reduces perceived latency — you see output as it is generated rather than waiting for the full completion. The confidence score reflects Claude\'s self-assessed certainty based on how well your query aligns with its training data and reasoning quality.';

export default function AnswerPanel({ answer, isStreaming, confidence }) {
  return (
    <div className="panel rounded-sm p-5" style={{ borderColor: 'var(--teal)', borderOpacity: 0.5 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="panel-label mb-1">SIGNAL-05</div>
          <div className="panel-title" style={{ color: 'var(--teal)' }}>Claude's Answer</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {confidence != null && (
            <div
              className="badge"
              style={{
                background: 'var(--teal-dim)',
                border: '1px solid rgba(0,212,200,0.3)',
                color: 'var(--teal)',
                fontSize: '12px',
              }}
            >
              <span style={{ fontSize: '8px' }}>◉</span>
              {confidence}% confident
            </div>
          )}
          <PanelInfo text={PANEL_INFO} />
        </div>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          lineHeight: '1.75',
          color: 'var(--text-primary)',
          minHeight: '60px',
        }}
      >
        {answer || (
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
            Awaiting response stream...
          </span>
        )}
        {isStreaming && <span className="cursor-blink" />}
      </div>
    </div>
  );
}
