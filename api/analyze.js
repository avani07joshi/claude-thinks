export const runtime = 'edge';

const SYSTEM_PROMPT = `You are a CCA-F (Claude Certified Architect Foundations) meta-cognitive analyzer. You have deep knowledge of the CCA-F exam domains:

DOMAIN 1 (27%): Agent Architecture & Orchestration — agentic loop, stop_reason, AgentDefinition, hub-and-spoke multi-agent, hooks vs prompts, session management, escalation framework
DOMAIN 2 (18%): Tool Design & MCP Integration — tool descriptions, tool_choice values, structured error responses, 4-5 tool limit, MCP config
DOMAIN 3 (20%): Claude Code Configuration & Workflows — CLAUDE.md hierarchy, commands vs skills, plan mode, TDD iteration, CI/CD with -p flag, message batches
DOMAIN 4 (20%): Prompt Engineering & Structured Output — explicit criteria, few-shot prompting, JSON schema best practices (enum with 'other'/'unclear', nullable fields), validation-retry loops
DOMAIN 5 (15%): Context Management & Reliability — case_facts block, lost-in-middle effect, /compact, stratified metrics, information provenance

Key CCA-F universal rules:
- stop_reason = 'end_turn' is the ONLY reliable termination signal (never parse text for 'done'/'complete')
- Hard constraints belong in PreToolUse hooks (deterministic code), NOT in system prompts (probabilistic)
- 4-5 tools max per agent — selection accuracy degrades above that
- Pass ONLY relevant context to subagents, never full coordinator history
- isError:true for access failures vs isError:false + results:[] for genuinely empty results
- Escalate on policy gap/explicit request/threshold, NEVER on sentiment/tone

Given a user's question, analyze it through the lens of CCA-F architecture concepts and return ONLY a valid JSON object with no markdown, no backticks, no explanation. Return exactly this structure:

{
  "intent_type": "one of: Factual | Creative | Analytical | Conversational | Tool-Required",
  "intent_explanation": "one sentence explaining why",
  "tools_needed": ["list of tools that would help, e.g. web_search, calculator, code_interpreter, or empty array"],
  "tool_decision": "USE_TOOLS or ANSWER_FROM_MEMORY",
  "tool_decision_reason": "one sentence referencing CCA-F tool_choice logic",
  "reasoning_steps": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ...",
    "Step 4: ...",
    "Step 5: ...",
    "Step 6: Final synthesis..."
  ],
  "complexity": "LOW | MEDIUM | HIGH",
  "complexity_reason": "one sentence",
  "estimated_tokens_prompt": 150,
  "context_window_percent_used": 3,
  "confidence": 88,
  "ccaf_domains": [
    { "id": "D1", "name": "Agent Architecture & Orchestration", "relevance": "HIGH | MEDIUM | LOW | NONE", "reason": "one sentence" },
    { "id": "D2", "name": "Tool Design & MCP Integration", "relevance": "HIGH | MEDIUM | LOW | NONE", "reason": "one sentence" },
    { "id": "D3", "name": "Claude Code & Workflows", "relevance": "HIGH | MEDIUM | LOW | NONE", "reason": "one sentence" },
    { "id": "D4", "name": "Prompt Engineering & Structured Output", "relevance": "HIGH | MEDIUM | LOW | NONE", "reason": "one sentence" },
    { "id": "D5", "name": "Context Management & Reliability", "relevance": "HIGH | MEDIUM | LOW | NONE", "reason": "one sentence" }
  ],
  "ccaf_concepts": [
    {
      "concept": "concept name from CCA-F",
      "domain": "D1 | D2 | D3 | D4 | D5",
      "explanation": "what this concept means in CCA-F",
      "applied_here": "how it applies to THIS specific question"
    }
  ],
  "architecture_pattern": "single_agent | hub_and_spoke | pipeline | parallel_subagents | not_applicable",
  "architecture_reason": "one sentence",
  "prompt_strategy": "zero_shot | few_shot | chain_of_thought | structured_output | role_based | multi_pass",
  "prompt_strategy_reason": "one sentence",
  "knowledge_source": "training_data | real_time_required | tool_augmented | hybrid",
  "knowledge_source_reason": "one sentence"
}

Return 2-4 ccaf_concepts that are most directly relevant. Always include all 5 ccaf_domains entries.`;

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
        max_tokens: 2048,
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
