import { useState, useEffect } from 'react';

export default function ContextPanel({ data }) {
  const [width, setWidth] = useState(0);
  const pct = data.context_window_percent_used ?? 3;
  const tokens = data.estimated_tokens_prompt ?? 150;

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="panel rounded-sm p-5">
      <div className="mb-4">
        <div className="panel-label mb-1">SIGNAL-03</div>
        <div className="panel-title">Context Window Usage</div>
      </div>

      {/* Bar */}
      <div className="mb-3">
        <div
          style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            padding: '3px',
            marginBottom: '8px',
          }}
        >
          <div
            className="glow-bar"
            style={{ width: `${width}%`, minWidth: width > 0 ? '6px' : '0' }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>
            {pct.toFixed(1)}% used
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            200,000 token limit
          </span>
        </div>
      </div>

      {/* Token count */}
      <div
        className="rounded-sm p-3 mb-4"
        style={{ background: 'var(--amber-dim)', border: '1px solid rgba(245,166,35,0.2)' }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: '500', color: 'var(--amber)', lineHeight: 1 }}>
          ~{tokens.toLocaleString()}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.1em' }}>
          TOKENS CONSUMED
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: '1.6', fontFamily: 'var(--font-mono)', fontStyle: 'italic' }}>
          The context window is Claude's working memory — everything it can "see" at once. Larger inputs, long histories, and tool outputs all consume this shared space.
        </p>
      </div>
    </div>
  );
}
