export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `You are Claude. Answer the user's question clearly and helpfully. Keep your response concise — 3 to 5 sentences max unless the question truly requires more.`;

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

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: question }],
        stream: true,
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      return new Response(err, { status: anthropicResponse.status });
    }

    // Transform Anthropic SSE → plain text chunks
    const textStream = new ReadableStream({
      async start(controller) {
        const reader = anthropicResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // keep incomplete last line

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const data = line.slice(6).trim();
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
                  controller.enqueue(new TextEncoder().encode(parsed.delta.text));
                }
              } catch {}
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        ...corsHeaders(),
      },
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
