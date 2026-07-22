import type { Recommendation, Resource } from '../types';

type Props = {
  resource: Resource;
  findings: Recommendation[];
};

export function DecisionPanel({ resource, findings }: Props) {
  const primary = findings[0];
  return (
    <div>
      <p>
        Decision framing for <strong style={{ color: 'var(--text)' }}>{resource.label}</strong> —
        educational only. No live Azure change is proposed from this lab.
      </p>
      {primary ? (
        <dl>
          <dt>Suggested</dt>
          <dd>{primary.action}</dd>
          <dt>Why</dt>
          <dd>{primary.evidence}</dd>
          <dt>Risk</dt>
          <dd>{primary.risk}</dd>
          <dt>Status</dt>
          <dd>{primary.status}</dd>
        </dl>
      ) : (
        <p>No automated finding on this node. Treat as context for the host map or healthy sample.</p>
      )}
    </div>
  );
}
