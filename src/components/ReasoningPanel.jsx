import { useState, useEffect } from 'react';

export default function ReasoningPanel({ data }) {
  const [visible, setVisible] = useState(0);
  const steps = data.reasoning_steps ?? [];

  useEffect(() => {
    steps.forEach((_, i) => {
      setTimeout(() => setVisible(i + 1), i * 200);
    });
  }, [steps.length]);

  return (
    <div className="panel rounded-sm p-5">
      <div className="mb-4">
        <div className="panel-label mb-1">SIGNAL-04</div>
        <div className="panel-title">Reasoning Chain</div>
      </div>

      <div className="flex flex-col gap-0">
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              opacity: i < visible ? 1 : 0,
              transform: i < visible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            <div className="flex gap-3 items-start">
              <div
                style={{
                  flexShrink: 0,
                  width: '22px',
                  height: '22px',
                  borderRadius: '2px',
                  background: 'var(--amber-dim)',
                  border: '1px solid rgba(245,166,35,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: '600',
                  color: 'var(--amber)',
                  marginTop: '2px',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.65', flex: 1 }}>
                {step}
              </p>
            </div>

            {i < steps.length - 1 && (
              <div
                style={{
                  marginLeft: '10px',
                  width: '2px',
                  height: '20px',
                  background: 'linear-gradient(to bottom, rgba(245,166,35,0.35), transparent)',
                  marginTop: '2px',
                  marginBottom: '2px',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
