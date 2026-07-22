# Ryan Amir — Portfolio (Folio №07 / 2026)

Personal site for Ryan Amir, Cloud Engineer. Live at [ryanamir.online](https://ryanamir.online/).

## Stack

- Static HTML / CSS / vanilla JS (`index.html`, `portfolio.css`, `portfolio.js`)
- Fonts: Instrument Serif + JetBrains Mono (Google Fonts)
- Contact form: Formspree
- Optional agent chat: Netlify Function → Groq (`netlify/functions/agent.js`)
- Dev-only Tweaks panel: React + Babel, loaded only on `localhost` or `?tweaks=1`
- **CloudPulse Architecture Lab:** Vite + React + React Flow (`lab-app/`) → publish to `/lab/cloudpulse/` (built on Netlify)

## Structure

```
├── index.html                 # Folio: CardWise featured · CloudPulse second
├── portfolio.css / portfolio.js
├── projects/cardwise/         # Static CardWise case study
├── lab-app/                   # Architecture Lab source (Vite)
├── lab/cloudpulse/            # Lab build output
├── scripts/generate-lab-data.mjs
├── scripts/lab-source/        # Curated host + sanitized inventory JSON
├── docs/lab-data.md
├── netlify.toml
└── netlify/functions/agent.js
```

## Local development

```bash
# Main site
python3 -m http.server 8000
# open http://localhost:8000
# Case study: http://localhost:8000/projects/cardwise/
# Tweaks: http://localhost:8000/?tweaks=1

# Lab data + SPA
node scripts/generate-lab-data.mjs
cd lab-app && npm ci && npm run build
# Lab: http://localhost:8000/lab/cloudpulse/
# Or: cd lab-app && npm run dev  (Vite on :5173 with base /lab/cloudpulse/)
```

Netlify build: `node scripts/generate-lab-data.mjs && cd lab-app && npm ci && npm run build` (see `netlify.toml`).

## Flagship work

1. **CardWise** — rewards optimizer · [case study](/projects/cardwise/) · [demo](https://cardwise-alpha.vercel.app/) · source private
2. **CloudPulse** — Azure optimization console (Next.js · FastAPI · Entra · OpenRouter/Grok) · [lab](/lab/cloudpulse/) · [live](https://www.cloudpulse-ai.com/) · [GitHub](https://github.com/ryana79/cloudpulse-azure-optimizer)
3. **Platform Control Room** — Azure IDP / GitOps ([platformcontrolroom.com](https://platformcontrolroom.com/))

See [docs/lab-data.md](docs/lab-data.md) for demo vs real data boundaries.

## Experience (summary)

- Cloud Engineer @ Astro Intelligence INC (Jul 2023 — present)
- Cloud Solutions Engineer @ Chief Technology Group (Jun 2021 — Jun 2023)
- Rutgers University, BS Computer Science (2023–2027)
