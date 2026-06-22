import { useState } from 'react';

const EXAMPLES = [
  { label: 'How does Claude decide which tool to use?', tag: 'meta' },
  { label: 'Read all 50 files in my codebase to find the bug', tag: 'anti-pattern' },
  { label: 'What is the weather in Mumbai right now?', tag: 'tool-required' },
  { label: 'Should I use RAG or fine-tuning for my use case?', tag: 'high complexity' },
  { label: 'Add CRITICAL POLICY: NEVER process over $500 to my prompt', tag: 'anti-pattern' },
  { label: 'Write a poem about context windows', tag: 'creative' },
];

const TAG_COLOR = {
  'meta':          { color: '#3b9eff', bg: 'rgba(59,158,255,0.1)' },
  'anti-pattern':  { color: '#ff5f5f', bg: 'rgba(255,95,95,0.1)' },
  'tool-required': { color: '#f5a623', bg: 'rgba(245,166,35,0.1)' },
  'high complexity':{ color: '#b06aff', bg: 'rgba(176,106,255,0.1)' },
  'creative':      { color: '#22d47a', bg: 'rgba(34,212,122,0.1)' },
};

export default function InputArea({ onSubmit, loading }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !loading) onSubmit(value.trim());
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <div
          className="panel rounded-sm"
          style={{
            padding: '4px',
            borderColor: loading ? 'rgba(0,212,200,0.5)' : 'var(--border-bright)',
            transition: 'border-color 0.3s ease',
            boxShadow: loading ? '0 0 20px var(--teal-glow)' : 'none',
          }}
        >
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
              if (e.key === 'Escape') {
                setValue('');
              }
            }}
            placeholder="Ask me anything..."
            disabled={loading}
            rows={3}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              padding: '14px 16px 10px',
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--text-primary)',
              resize: 'none',
              display: 'block',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 10px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: value.length > 0 ? 'var(--text-muted)' : 'transparent',
              letterSpacing: '0.08em',
              userSelect: 'none',
            }}>
              {value.length} chars · ~{Math.ceil(value.length / 4)} tokens
            </span>
            <button
              type="submit"
              disabled={loading || !value.trim()}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.15em',
                padding: '8px 20px',
                background: loading || !value.trim() ? 'var(--border)' : 'var(--amber)',
                color: loading || !value.trim() ? 'var(--text-muted)' : '#0a0d12',
                border: 'none',
                borderRadius: '2px',
                cursor: loading || !value.trim() ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid rgba(122,143,166,0.3)',
                      borderTopColor: 'var(--teal)',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin-slow 0.8s linear infinite',
                    }}
                  />
                  ANALYZING
                </>
              ) : (
                'ANALYZE ▶'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Example prompts */}
      <div style={{ marginTop: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
            TRY THESE:
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
          {EXAMPLES.map((ex) => {
            const tagCfg = TAG_COLOR[ex.tag] || { color: 'var(--text-muted)', bg: 'transparent' };
            return (
              <button
                key={ex.label}
                onClick={() => { if (!loading) onSubmit(ex.label); }}
                disabled={loading}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  padding: '4px 10px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '2px',
                  color: 'var(--text-secondary)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '100%',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = tagCfg.color;
                    e.currentTarget.style.color = tagCfg.color;
                    e.currentTarget.style.background = tagCfg.bg;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{
                  fontSize: '8px',
                  padding: '1px 5px',
                  background: tagCfg.bg,
                  border: `1px solid ${tagCfg.color}55`,
                  borderRadius: '2px',
                  color: tagCfg.color,
                  letterSpacing: '0.06em',
                  flexShrink: 0,
                }}>
                  {ex.tag}
                </span>
                {ex.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
