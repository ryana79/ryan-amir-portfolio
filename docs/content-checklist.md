# Content consistency checklist (Phase 0)

Run before publish. Last verified against local CardWise + CloudPulse repos and résumé copy on site.

| Claim | Expected | Status |
|-------|----------|--------|
| CloudPulse stack | Next.js · FastAPI · Entra · OpenRouter/Grok | Fixed (was Azure Functions + OpenAI) |
| CloudPulse host IaC | k8s/Helm + Render API path — not Bicep-in-repo | Honest in folio + lab |
| CardWise stack | Next.js · TypeScript · Vercel; ranking via `recommend.ts` | Case study |
| CardWise source | Private | Labeled |
| CardWise outcomes | Modeled estimates / not financial advice | Case study disclaimer |
| Employment | Astro Intelligence Jul 2023–present; CTG Jun 2021–Jun 2023 | Matches index/README |
| Education | Rutgers CS, class of 2027 | Matches |
| Lab data | Sanitized demo + public host map only | `docs/lab-data.md` |
| Agent FACTS | Same stacks as folio | `portfolio.js` + `netlify/functions/agent.js` |
