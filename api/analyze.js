export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `You are a meta-cognitive AI architecture analyzer trained on enterprise LLM design patterns. Given a user's question, analyze it and return ONLY a valid JSON object with no markdown, no backticks, no explanation. Return exactly this structure:

{
  "intent_type": "one of: Factual | Creative | Analytical | Conversational | Tool-Required",
  "intent_explanation": "one sentence",
  "tools_needed": ["array of tools or empty array"],
  "tool_decision": "USE_TOOLS or ANSWER_FROM_MEMORY",
  "tool_decision_reason": "one sentence",
  "tool_failure_handling": "GRACEFUL | CRASH_RISK | NOT_APPLICABLE",
  "tool_failure_mode": "one sentence describing how failure is handled or why not applicable",
  "reasoning_steps": ["step 1", "step 2", "step 3", "step 4"],
  "complexity": "LOW | MEDIUM | HIGH",
  "complexity_reason": "one sentence",
  "estimated_tokens_prompt": 150,
  "context_window_percent_used": 3,
  "confidence": 88,
  "hallucination_risk": "LOW | MEDIUM | HIGH",
  "hallucination_risk_reason": "one sentence",
  "confidence_by_claim": [
    { "claim": "short claim text under 10 words", "confidence": 85, "risk": "LOW" },
    { "claim": "short claim text under 10 words", "confidence": 72, "risk": "MEDIUM" },
    { "claim": "short claim text under 10 words", "confidence": 65, "risk": "HIGH" }
  ],
  "routing_decision": "REAL_TIME | BATCH",
  "routing_reason": "one sentence",
  "sla_category": "Urgent Exception | Standard Workflow | Continuous Arrival",
  "estimated_cost_saving": "0% (real-time required) | ~50% if batched",
  "architect_problem": "Token Bloat | Latency | Compliance/Control | Accuracy",
  "architect_domain": "Data Extraction | Customer Support | Developer Productivity | Multi-Agent",
  "architect_pattern_applied": "specific pattern name e.g. Scratchpad File, Batch Routing, App-Layer Intercepts, Schema Redundancy, Parallelization & Caching, Shared Vector Store, Granular MCP Tools, Structured Intermediates, tool_choice Enforcement",
  "architect_pattern_explanation": "one sentence explaining why this pattern applies",
  "antipattern_detected": false,
  "antipattern_name": null,
  "antipattern_explanation": null,
  "architects_fix": null,
  "context_pruning_needed": false,
  "raw_context_fields": ["field1", "field2", "verboseField"],
  "pruned_context_fields": ["field1"],
  "pruning_strategy": null,
  "tokens_saved_estimate": null
}

ARCHITECT'S REFERENCE MATRIX — use this to pick architect_problem and architect_domain:
Token Bloat + Data Extraction → Scratchpad File
Token Bloat + Customer Support → Schema Redundancy
Token Bloat + Developer Productivity → Structured Intermediates
Token Bloat + Multi-Agent → Scratchpad File
Latency + Data Extraction → Parallelization & Caching
Latency + Customer Support → Batch Routing
Latency + Developer Productivity → Granular MCP Tools
Latency + Multi-Agent → Parallelization & Caching
Compliance/Control + Data Extraction → App-Layer Intercepts
Compliance/Control + Customer Support → App-Layer Intercepts
Compliance/Control + Developer Productivity → tool_choice Enforcement
Compliance/Control + Multi-Agent → Shared Vector Store
Accuracy + Data Extraction → Schema Redundancy
Accuracy + Customer Support → Schema Redundancy
Accuracy + Developer Productivity → Structured Intermediates
Accuracy + Multi-Agent → Shared Vector Store

ANTI-PATTERNS to detect (set antipattern_detected: true when found):
- "Sequential Context Loading": question implies loading all files/data before processing (e.g., "read all 50 files", "load entire codebase", "analyze everything at once")
- "Monolithic Tool Design": combining many operations into one tool call (e.g., "analyze everything about user in one call")
- "Emphatic Prompt Compliance": using CAPS, CRITICAL, NEVER, ALWAYS, !!! in system prompts — this is probabilistic, not deterministic (e.g., "add CRITICAL POLICY: NEVER do X to my prompt")
- "Fragile Schema Expansion": adding nullable fields without migration strategy

CONTEXT PRUNING RULES:
- context_pruning_needed: true when question involves tools, multi-step workflows, session state, or large data processing
- context_pruning_needed: false for simple factual, creative, or conversational questions
- raw_context_fields: simulate realistic fields that would exist for this type of request
- pruned_context_fields: only fields truly needed for the task
- pruning_strategy options: "Filter Stale Tool Results" | "Summarize Resolved Turns" | "Extract Relevant Fields Only"

Always return exactly 3 confidence_by_claim entries. All fields required — use null for optional string fields when not applicable.`;

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { question } = await req.json();
    if (!question) return new Response('Missing question', { status: 400 });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 3000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: question }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: err }), { status: response.status, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
    }

    const data = await response.json();
    const raw = data.content[0].text;
    const clean = raw.replace(/```json|```/g, '').trim();

    return new Response(clean, {
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
