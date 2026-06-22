export async function fetchMeta(question) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Analysis failed (${response.status}): ${text}`);
  }

  const raw = await response.text();
  return JSON.parse(raw);
}
