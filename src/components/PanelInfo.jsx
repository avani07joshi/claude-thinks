import { useState, useEffect, useRef } from 'react';

export default function PanelInfo({ text }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onMouse = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: `1px solid ${open ? 'var(--teal)' : 'var(--border-bright)'}`,
          background: open ? 'var(--teal-dim)' : 'transparent',
          color: open ? 'var(--teal)' : 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
          lineHeight: 1,
          padding: 0,
        }}
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.borderColor = 'var(--teal)';
            e.currentTarget.style.color = 'var(--teal)';
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.borderColor = 'var(--border-bright)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }
        }}
        title="About this panel"
        aria-label="Panel information"
      >
        i
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '26px',
            right: 0,
            zIndex: 200,
            width: '270px',
            padding: '13px 15px',
            background: '#0a0d12',
            border: '1px solid rgba(0,212,200,0.35)',
            borderRadius: '4px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 16px rgba(0,212,200,0.08)',
            animation: 'panel-enter 0.15s ease',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-5px',
              right: '6px',
              width: '8px',
              height: '8px',
              background: '#0a0d12',
              border: '1px solid rgba(0,212,200,0.35)',
              borderBottom: 'none',
              borderRight: 'none',
              transform: 'rotate(45deg)',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              margin: 0,
            }}
          >
            {text}
          </p>
        </div>
      )}
    </div>
  );
}
