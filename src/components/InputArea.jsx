import { useState } from 'react';

const EXAMPLES = [
  'How does photosynthesis work?',
  'Write a haiku about recursion',
  'What is the difference between TCP and UDP?',
  'Explain quantum entanglement simply',
];

export default function InputArea({ onSubmit, loading }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !loading) onSubmit(value.trim());
  };

  const handleExample = (ex) => {
    if (!loading) {
      setValue(ex);
    }
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
              justifyContent: 'flex-end',
              padding: '8px 10px',
              borderTop: '1px solid var(--border)',
            }}
          >
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
      <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', alignSelf: 'center', letterSpacing: '0.1em' }}>
          TRY:
        </span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => handleExample(ex)}
            disabled={loading}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              padding: '3px 10px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '2px',
              color: 'var(--text-secondary)',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { if (!loading) { e.target.style.borderColor = 'var(--amber)'; e.target.style.color = 'var(--amber)'; }}}
            onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
