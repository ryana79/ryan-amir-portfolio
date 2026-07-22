# CloudPulse Architecture Lab data

The lab at `/lab/cloudpulse/` is a **static** Vite/React app. It never calls Azure APIs and never embeds credentials.

## Layers

| Layer | File (source) | Classification | Meaning |
|-------|---------------|----------------|---------|
| Host map | `scripts/lab-source/host-topology.json` | `public-self-architecture` | How CloudPulse itself runs (web, API, DB, Entra, OpenRouter, k8s ingress, Render demo path) from k8s/Helm/README |
| Sample inventory | `scripts/lab-source/sample-inventory.json` | `sanitized-demo` | Illustrative Azure resources CloudPulse *analyzes* — not an employer subscription |
| Recommendations | `scripts/lab-source/recommendations.json` | `sanitized-demo` | Finding rows shaped like `engine/rules.py` (`missing_required_tags`, `underutilized_vm`, `unattached_disk`, `orphaned_public_ip`) |
| IaC index | `scripts/lab-source/iac-index.json` | public paths | Maps host node ids → repo paths (k8s/Helm/python). **No invented Bicep for CloudPulse.** |
| Manifest | `scripts/lab-source/deployment-manifest.json` | stub / CI | Hand-curated until CI publishes a signed fixture |

## Regenerate

```bash
node scripts/generate-lab-data.mjs
cd lab-app && npm ci && npm run build
```

The script validates unique IDs, edge references, and recommendation `resourceId`s, then writes `lab-app/src/data/*.json`. Netlify runs the same generate + build on deploy.

## What is real vs demo

- **Real:** product stack (Next.js + FastAPI + Entra + OpenRouter/Grok), host topology from deploy artifacts, finding *categories* from the rules engine.
- **Demo:** sample inventory names, metrics refs, estimated savings language, Query Evidence KQL (read-only examples).
- **Not claimed:** live Cost Management, Advisor, Entra elevate, free-form KQL execution, employer AVD metrics, Bicep provisioning of CloudPulse itself.

## Deep link

`/lab/cloudpulse/?resource=cp-api` selects a node on load.
