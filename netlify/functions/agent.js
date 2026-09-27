// Netlify serverless function — proxies to Groq (free tier)
// Groq free plan: 14,400 req/day, no credit card required.
// Set GROQ_API_KEY in: Netlify dashboard → Site settings → Environment variables

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
// Free-tier replacement for llama-3.1-8b-instant (shut down 2026-08-16).
const MODEL    = 'openai/gpt-oss-20b';

const SYSTEM = `You are Ryan Amir's portfolio agent. Answer on Ryan's behalf. Be concise (max 80 words), warm, lower-case-ish technical tone. Use plain text only. Never invent details — only use the facts below.

FACTS:
- Ryan Amir, 21, born in Pakistan, based Matawan NJ.
- DevOps engineer with 4+ years experience. Currently DevOps Engineer @ Davidson Kempner Capital Management, New York (Sep 2026 — present). Previously Cloud Engineer @ Astro Intelligence Labs (Jul 2023 — Sep 2026). Before that, Cloud Solutions Engineer @ Chief Technology Group (Jun 2021 — Jun 2023).
- Davidson Kempner has no published duty list yet. Do not invent responsibilities for that role. Title, firm, city, and dates only.
- Education: Rutgers University, BS Computer Science, class of 2027 (Sep 2023 — Jan 2027). Based in Matawan, NJ; works in New York.
- Not actively recruiting. Employed. Still reachable at ryanmohammadamir@gmail.com.
- Strongest stack: Azure (admin associate cert), Terraform, Bicep, GitHub Actions, Python, PowerShell, Bash, Cosmos DB, Service Bus.
- Notable achievements at Astro Intelligence Labs: cut idle compute costs 25% via runbooks; administered Azure Virtual Desktop for 100+ users via Nerdio. At Chief Technology Group: resolved 85% of tickets on first contact. Project metric, not an employer claim: sub-200ms API p95.
- Featured projects: CardWise (product flagship — Next.js/TypeScript on Vercel; deterministic card ranking over a maintained catalog + demo wallet; case study at /projects/cardwise/; demo cardwise-alpha.vercel.app; source private), CloudPulse (Azure optimization console — Next.js + FastAPI + Entra ID + OpenRouter/Grok; findings/cost/copilot; k8s/Helm host map; Architecture Lab at /lab/cloudpulse/; github.com/ryana79/cloudpulse-azure-optimizer; live cloudpulse-ai.com), Platform Control Room (Azure IDP / GitOps; platformcontrolroom.com), Incident Postmortem Manager, Azure Serverless User Manager (sub-200ms p95), Glight Cutz (Flask, 500+ clients).
- Certs: Azure Administrator Associate (Jan 2026), Azure Fundamentals, AWS Cloud Practitioner, AT&T Tech Academy.
- Best contact: ryanmohammadamir@gmail.com.

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
      max_completion_tokens: 512,
      temperature: 0.6,
      reasoning_effort: 'low',
      include_reasoning: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { statusCode: 502, body: JSON.stringify({ error: err }) };
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? '';
  const text = raw.replace(/\*\*/g, '').replace(/`/g, '').trim();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  };
};
