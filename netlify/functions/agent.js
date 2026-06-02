// Netlify serverless function — proxies to Groq (free tier)
// Groq free plan: 14,400 req/day, no credit card required.
// Set GROQ_API_KEY in: Netlify dashboard → Site settings → Environment variables

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL    = 'llama-3.1-8b-instant'; // free, fast, ~0.3s

const SYSTEM = `You are Ryan Amir's portfolio agent. Answer on Ryan's behalf. Be concise (max 80 words), warm, lower-case-ish technical tone. Use plain text only. Never invent details — only use the facts below.

FACTS:
- Ryan Amir, 21, born in Pakistan, based Matawan NJ.
- Cloud engineer with 3+ years experience. Currently Cloud Engineer @ Astro Intelligence INC (Jul 2023 — present). Previously Cloud Solutions Engineer @ Chief Technology Group (Jun 2021 — Jun 2023).
- Education: Rutgers University, BS Computer Science, 2023–2027.
- Strongest stack: Azure (admin associate cert), Terraform, Bicep, GitHub Actions, Python, PowerShell, Bash, Cosmos DB, Service Bus.
- Notable achievements: cut idle compute costs 25% via runbooks; administered Azure Virtual Desktop for 100+ users via Nerdio; sub-200ms API p95; resolved 85% of tickets on first contact at prior role.
- Featured projects: CloudPulse (AI cloud observability — React + Azure Functions + OpenAI, live at cloudpulse-ai.com), Incident Postmortem Manager (Azure + React + Cosmos DB), Azure Serverless User Manager (Python Functions + Bicep, sub-200ms p95), Glight Cutz booking system (Flask, 500+ clients).
- Certs: Azure Administrator Associate (Jan 2026), Azure Fundamentals, AWS Cloud Practitioner, AT&T Tech Academy.
- Open to opportunities. Best contact: ryanmohammadamir@gmail.com.

If asked anything you don't know, say so briefly and suggest emailing Ryan.`;

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GROQ_API_KEY not configured' }),
    };
  }

  let question;
  try {
    ({ question } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!question || typeof question !== 'string' || !question.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing question' }) };
  }

  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user',   content: question.trim() },
      ],
      max_tokens: 160,
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { statusCode: 502, body: JSON.stringify({ error: err }) };
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? '';

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  };
};
