import { useState, useEffect } from 'react';
import PanelInfo from './PanelInfo';

const PANEL_INFO = 'Claude evaluates how likely it is to generate plausible-sounding but factually incorrect information. Risk depends on whether the answer relies on verifiable training data, requires up-to-date information, or touches domain knowledge that may be sparse or contradictory. The claim confidence bars break down uncertainty by specific assertion so you know exactly which parts to fact-check.';

const RISK_CONFIG = {
  LOW:    { color: '#22d47a', bg: 'rgba(34,212,122,0.12)',  border: 'rgba(34,212,122,0.3)',  label: '● LOW RISK' },
  MEDIUM: { color: '#f5a623', bg: 'rgba(245,166,35,0.12)', border: 'rgba(245,166,35,0.3)',  label: '◆ MEDIUM RISK' },
  HIGH:   { color: '#ff5f5f', bg: 'rgba(255,95,95,0.12)',  border: 'rgba(255,95,95,0.3)',   label: '▲ HIGH RISK' },
};

function claimColor(confidence) {
  if (confidence >= 85) return '#22d47a';
  if (confidence >= 70) return '#f5a623';
  return '#ff5f5f';
}

function ClaimBar({ claim, confidence, risk, index }) {
  const [width, setWidth] = useState(0);
  const color = claimColor(confidence);

  useEffect(() => {
    const t = setTimeout(() => setWidth(confidence), 100 + index * 120);
    return () => clearTimeout(t);
  }, [confidence, index]);

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          flex: 1,
          paddingRight: '8px',
          lineHeight: '1.4',
        }}>
          {claim}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color,
          fontWeight: '600',
          flexShrink: 0,
        }}>
          {confidence}%
        </span>
      </div>
      <div style={{
        height: '5px',
        background: 'var(--bg-base)',
        border: '1px solid var(--border)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: color,
          boxShadow: `0 0 6px ${color}80`,
          borderRadius: '2px',
          transition: 'width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }} />
      </div>
    </div>
  );
}

export default function HallucinationPanel({ data }) {
  const risk = data.hallucination_risk ?? 'LOW';
  const cfg = RISK_CONFIG[risk] ?? RISK_CONFIG.LOW;
  const claims = data.confidence_by_claim ?? [];

  return (
    <div
      className="panel rounded-sm p-5"
      style={{ borderColor: risk === 'HIGH' ? 'rgba(255,95,95,0.4)' : undefined }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="panel-label mb-1">SIGNAL-08</div>
          <div className="panel-title">Hallucination Risk</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            className="badge"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
          >
            {cfg.label}
          </div>
          <PanelInfo text={PANEL_INFO} />
        </div>
      </div>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        lineHeight: '1.6',
        marginBottom: '16px',
      }}>
        {data.hallucination_risk_reason}
      </p>

      {claims.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          <div className="panel-label mb-3">CLAIM CONFIDENCE</div>
          {claims.map((c, i) => (
            <ClaimBar
              key={i}
              claim={c.claim}
              confidence={c.confidence}
              risk={c.risk}
              index={i}
            />
          ))}
        </div>
      )}

      {risk === 'HIGH' && (
        <div style={{
          marginTop: '12px',
          padding: '8px 10px',
          background: 'rgba(255,95,95,0.08)',
          border: '1px solid rgba(255,95,95,0.2)',
          borderRadius: '2px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: '#ff5f5f',
          letterSpacing: '0.06em',
          lineHeight: '1.5',
        }}>
          ⚠ HIGH RISK — Claude may generate plausible but unverified information. Apply human-in-the-loop validation.
        </div>
      )}
    </div>
  );
}
