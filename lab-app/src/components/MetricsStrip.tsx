import type { DeploymentManifest } from '../types';

type Props = {
  hostCount: number;
  inventoryCount: number;
  findingCount: number;
  manifest: DeploymentManifest;
};

export function MetricsStrip({ hostCount, inventoryCount, findingCount, manifest }: Props) {
  return (
    <div className="metrics-strip" aria-label="Lab metrics">
      <div className="metric">
        <span className="metric-key">Host nodes</span>
        <span className="metric-val">{hostCount}</span>
        <span className="metric-src">source · k8s/Helm map</span>
      </div>
      <div className="metric">
        <span className="metric-key">Sample inventory</span>
        <span className="metric-val">{inventoryCount}</span>
        <span className="metric-src">source · sanitized-demo JSON</span>
      </div>
      <div className="metric">
        <span className="metric-key">Demo findings</span>
        <span className="metric-val">{findingCount}</span>
        <span className="metric-src">source · rules.py shapes</span>
      </div>
      <div className="metric">
        <span className="metric-key">Manifest</span>
        <span className="metric-val">{manifest.validationStatus}</span>
        <span className="metric-src">commit · {manifest.commit}</span>
      </div>
    </div>
  );
}
