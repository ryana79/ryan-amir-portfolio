import { useEffect, useRef } from 'react';
import type { BladeTab, IacEntry, Recommendation, Resource, TopologyEdge } from '../types';
import { RecommendationPanel } from './RecommendationPanel';
import { DecisionPanel } from './DecisionPanel';

const TABS: { id: BladeTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'observability', label: 'Observability' },
  { id: 'cost', label: 'Cost' },
  { id: 'optimization', label: 'Optimization' },
  { id: 'iac', label: 'IaC' },
  { id: 'decision', label: 'Decision' },
];

type Props = {
  resource: Resource | null;
  edges: TopologyEdge[];
  findings: Recommendation[];
  iac: IacEntry | null;
  tab: BladeTab;
  onTab: (t: BladeTab) => void;
  onClose: () => void;
};

const EXAMPLE_KQL = `// Read-only example — not executable in this lab
Resources
| where type =~ "microsoft.compute/virtualmachines"
| where name == "{{name}}"
| project id, name, location, tags`;

export function ResourceBlade({
  resource,
  edges,
  findings,
  iac,
  tab,
  onTab,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (resource && panelRef.current) {
      panelRef.current.focus();
    }
  }, [resource?.id]);

  if (!resource) {
    return (
      <aside className="lab-blade" aria-label="Resource details">
        <div className="pane-head">Blade</div>
        <p className="blade-empty">Select a resource from the list or topology.</p>
      </aside>
    );
  }

  const related = edges.filter((e) => e.source === resource.id || e.target === resource.id);

  return (
    <aside
      className="lab-blade"
      aria-label={`${resource.label} details`}
      ref={panelRef}
      tabIndex={-1}
    >
      <div className="pane-head">
        <span>Blade</span>
        <button type="button" className="blade-close" onClick={onClose}>
          Close · Esc
        </button>
      </div>
      <div className="blade-tabs" role="tablist" aria-label="Resource sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? 'active' : ''}
            onClick={() => onTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="blade-body" role="tabpanel">
        {tab === 'overview' && (
          <>
            <h3>{resource.label}</h3>
            <dl>
              <dt>ID</dt>
              <dd>{resource.id}</dd>
              <dt>Type</dt>
              <dd>{resource.type}</dd>
              <dt>Layer</dt>
              <dd>{resource.layer}</dd>
              <dt>Env</dt>
              <dd>{resource.environment}</dd>
              <dt>Region</dt>
              <dd>{resource.region}</dd>
              <dt>Tags</dt>
              <dd>{Object.entries(resource.tags).map(([k, v]) => `${k}=${v}`).join(', ') || '—'}</dd>
            </dl>
          </>
        )}
        {tab === 'relationships' && (
          <>
            <h3>Relationships</h3>
            {related.length === 0 ? (
              <p>No edges on the current layer filter.</p>
            ) : (
              <ul>
                {related.map((e) => (
                  <li key={e.id}>
                    {e.source} —{e.label}→ {e.target} ({e.relationshipType})
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {tab === 'observability' && (
          <>
            <h3>Observability</h3>
            <p>
              {resource.metricsRef
                ? `Demo metrics ref: ${resource.metricsRef}`
                : 'No metrics fixture attached for this node.'}
            </p>
            <div className="kql-block">
              <span className="kql-label">Query evidence · example KQL (read-only)</span>
              {EXAMPLE_KQL.replace('{{name}}', resource.label)}
            </div>
          </>
        )}
        {tab === 'cost' && (
          <>
            <h3>Cost</h3>
            <p>
              No live Cost Management ticker. Findings may include estimated_savings shapes from the
              engine when present in demo fixtures — labeled demonstration only.
            </p>
          </>
        )}
        {tab === 'optimization' && (
          <>
            <h3>Optimization</h3>
            <RecommendationPanel items={findings} />
          </>
        )}
        {tab === 'iac' && (
          <>
            <h3>IaC mapping</h3>
            {iac ? (
              <dl>
                <dt>Path</dt>
                <dd>{iac.path}</dd>
                <dt>Kind</dt>
                <dd>{iac.kind}</dd>
                <dt>Lines</dt>
                <dd>
                  {iac.snippetStart}–{iac.snippetEnd}
                </dd>
                <dt>Note</dt>
                <dd>{iac.note}</dd>
              </dl>
            ) : (
              <p>
                No IaC index entry. Sample inventory nodes are analyzer demos — CloudPulse itself is
                mapped via k8s/Helm, not invented Bicep.
              </p>
            )}
          </>
        )}
        {tab === 'decision' && <DecisionPanel resource={resource} findings={findings} />}
      </div>
    </aside>
  );
}
