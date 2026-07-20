# Ryan Amir — Portfolio (Folio №07 / 2026)

Personal site for Ryan Amir, Cloud Engineer. Live at [ryanamir.online](https://ryanamir.online/).

## Stack

- Static HTML / CSS / vanilla JS (`index.html`, `portfolio.css`, `portfolio.js`)
- Fonts: Instrument Serif + JetBrains Mono (Google Fonts)
- Contact form: Formspree
- Optional agent chat: Netlify Function → Groq (`netlify/functions/agent.js`)
- Dev-only Tweaks panel: React + Babel, loaded only on `localhost` or `?tweaks=1`

## Structure

```
├── index.html
├── portfolio.css
├── portfolio.js
├── tweaks.jsx / tweaks-panel.jsx   # gated off production
├── netlify.toml
├── netlify/functions/agent.js
└── images/                        # WebP folio shots + portrait + résumé PDF
```

## Local development

```bash
python3 -m http.server 8000
# open http://localhost:8000
# Tweaks: http://localhost:8000/?tweaks=1
```

## Featured work

- **CloudPulse** — AI cloud observability ([cloudpulse-ai.com](https://www.cloudpulse-ai.com/))
- **Platform Control Room** — Azure IDP / GitOps ([platformcontrolroom.com](https://platformcontrolroom.com/))
- **CardWise** — credit-card rewards optimizer ([cardwise-alpha.vercel.app](https://cardwise-alpha.vercel.app/))

## Experience (summary)

- Cloud Engineer @ Astro Intelligence INC (Jul 2023 — present)
- Cloud Solutions Engineer @ Chief Technology Group (Jun 2021 — Jun 2023)
- Rutgers University, BS Computer Science (2023–2027)
