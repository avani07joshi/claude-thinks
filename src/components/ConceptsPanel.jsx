const DOMAIN_COLOR = {
  D1: '#f5a623',
  D2: '#b06aff',
  D3: '#3b9eff',
  D4: '#22d47a',
  D5: '#00d4c8',
};

const DOMAIN_LABEL = {
  D1: 'Agent Arch',
  D2: 'Tool Design',
  D3: 'Claude Code',
  D4: 'Prompt Eng',
  D5: 'Context Mgmt',
};

const ARCH_ICONS = {
  single_agent:       '◎ Single Agent',
  hub_and_spoke:      '⬡ Hub-and-Spoke',
  pipeline:           '⟶ Pipeline',
  parallel_subagents: '⫴ Parallel Subagents',
  not_applicable:     '— Not Applicable',
};

const PROMPT_ICONS = {
  zero_shot:        '↯ Zero-Shot',
  few_shot:         '≋ Few-Shot',
  chain_of_thought: '⟳ Chain-of-Thought',
  structured_output:'⊞ Structured Output',
  role_based:       '◈ Role-Based',
  multi_pass:       '⟲ Multi-Pass',
};

const KNOWLEDGE_ICONS = {
  training_data:    '◆ Training Data',
  real_time_required: '◉ Real-Time Required',
  tool_augmented:   '⊕ Tool-Augmented',
  hybrid:           '◈ Hybrid',
};

export default function ConceptsPanel({ data }) {
  const concepts = data.ccaf_concepts ?? [];

  return (
    <div className="panel rounded-sm p-5">
      <div className="mb-4">
        <div className="panel-label mb-1">SIGNAL-07</div>
        <div className="panel-title" style={{ color: 'var(--teal)' }}>CCA-F Concepts Applied</div>
      </div>

      {/* Architecture + Prompt Strategy meta-row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {[
          { label: 'ARCHITECTURE', value: ARCH_ICONS[data.architecture_pattern] ?? data.architecture_pattern, reason: data.architecture_reason },
          { label: 'PROMPT STRATEGY', value: PROMPT_ICONS[data.prompt_strategy] ?? data.prompt_strategy, reason: data.prompt_strategy_reason },
          { label: 'KNOWLEDGE SOURCE', value: KNOWLEDGE_ICONS[data.knowledge_source] ?? data.knowledge_source, reason: data.knowledge_source_reason },
        ].map(({ label, value, reason }) => (
          <div
            key={label}
            style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border)',
              borderRadius: '2px',
              padding: '10px',
            }}
          >
            <div className="panel-label" style={{ marginBottom: '6px' }}>{label}</div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--amber)',
                marginBottom: '6px',
                letterSpacing: '0.04em',
              }}
            >
              {value}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {reason}
            </p>
          </div>
        ))}
      </div>

      {/* Concept cards */}
      <div className="panel-label mb-3">CONCEPTS ACTIVATED</div>
      <div className="flex flex-col gap-3">
        {concepts.map((c, i) => {
          const col = DOMAIN_COLOR[c.domain] ?? 'var(--amber)';
          return (
            <div
              key={i}
              style={{
                background: `${col}0d`,
                border: `1px solid ${col}33`,
                borderLeft: `3px solid ${col}`,
                borderRadius: '2px',
                padding: '12px 14px',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: col,
                    letterSpacing: '0.02em',
                  }}
                >
                  {c.concept}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: col,
                    background: `${col}20`,
                    border: `1px solid ${col}40`,
                    padding: '1px 6px',
                    borderRadius: '2px',
                    letterSpacing: '0.1em',
                  }}
                >
                  {DOMAIN_LABEL[c.domain] ?? c.domain}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em' }}>WHAT IT IS  </span>
                {c.explanation}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: col, lineHeight: '1.55', opacity: 0.9 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', opacity: 0.7 }}>APPLIED HERE  </span>
                {c.applied_here}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
