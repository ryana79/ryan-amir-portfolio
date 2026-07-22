import { useEffect, useMemo, useState } from 'react';
import { LabHeader } from './components/LabHeader';
import { MetricsStrip } from './components/MetricsStrip';
import { FilterBar } from './components/FilterBar';
import { ResourceExplorer } from './components/ResourceExplorer';
import { TopologyCanvas } from './components/TopologyCanvas';
import { ArchitectureList } from './components/ArchitectureList';
import { ResourceBlade } from './components/ResourceBlade';
import type {
  BladeTab,
  DeploymentManifest,
  IacEntry,
  Recommendation,
  Resource,
  TopologyEdge,
} from './types';
import resourcesData from './data/resources.json';
import topologyData from './data/topology.json';
import recommendationsData from './data/recommendations.json';
import iacIndexData from './data/iac-index.json';
import manifestData from './data/deployment-manifest.json';

type LayerKey = 'host' | 'sample-inventory';

function readDeepLink(): string | null {
  try {
    return new URLSearchParams(window.location.search).get('resource');
  } catch {
    return null;
  }
}

export default function App() {
  const allResources: Resource[] = useMemo(
    () => [
      ...(resourcesData.host as Resource[]),
      ...(resourcesData.inventory as Resource[]),
    ],
    [],
  );

  const [query, setQuery] = useState('');
  const [layer, setLayer] = useState('all');
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<BladeTab>('overview');
  const [view, setView] = useState<'graph' | 'list'>('graph');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!allResources.length) {
      setLoadError('Lab data missing. Run node scripts/generate-lab-data.mjs');
      return;
    }
    const deep = readDeepLink();
    if (deep && allResources.some((r) => r.id === deep)) {
      setSelectedId(deep);
    }
  }, [allResources]);

  const categories = useMemo(
    () => Array.from(new Set(allResources.map((r) => r.category))).sort(),
    [allResources],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allResources.filter((r) => {
      if (layer !== 'all' && r.layer !== layer) return false;
      if (category !== 'all' && r.category !== category) return false;
      if (!q) return true;
      return (
        r.id.toLowerCase().includes(q) ||
        r.label.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
      );
    });
  }, [allResources, query, layer, category]);

  const edges: TopologyEdge[] = useMemo(() => {
    const layers = topologyData.layers as Record<
      string,
      { edges: TopologyEdge[] }
    >;
    const keys: LayerKey[] =
      layer === 'host'
        ? ['host']
        : layer === 'sample-inventory'
          ? ['sample-inventory']
          : ['host', 'sample-inventory'];
    const out: TopologyEdge[] = [];
    for (const key of keys) {
      const pack = layers[key === 'sample-inventory' ? 'inventory' : key];
      if (pack?.edges) out.push(...pack.edges);
    }
    const ids = new Set(filtered.map((r) => r.id));
    return out.filter((e) => ids.has(e.source) && ids.has(e.target));
  }, [layer, filtered]);

  const selected = allResources.find((r) => r.id === selectedId) ?? null;
  const findings = ((recommendationsData.items || []) as Recommendation[]).filter(
    (i) => i.resourceId === selectedId,
  );
  const iac: IacEntry | null = selectedId
    ? ((iacIndexData.entries as Record<string, IacEntry>)[selectedId] ?? null)
    : null;
  const manifest = manifestData as DeploymentManifest;

  function select(id: string) {
    setSelectedId(id);
    setTab('overview');
    const url = new URL(window.location.href);
    url.searchParams.set('resource', id);
    window.history.replaceState({}, '', url.toString());
  }

  function closeBlade() {
    setSelectedId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('resource');
    window.history.replaceState({}, '', url.toString());
  }

  if (loadError) {
    return (
      <div className="lab">
        <LabHeader dataClassification="error" />
        <p className="blade-empty">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="lab">
      <LabHeader dataClassification={manifest.dataClassification} />
      <MetricsStrip
        hostCount={resourcesData.host.length}
        inventoryCount={resourcesData.inventory.length}
        findingCount={(recommendationsData.items || []).length}
        manifest={manifest}
      />
      <div className="lab-body">
        <aside className="lab-sidebar" aria-label="Resource explorer">
          <div className="pane-head">Explorer</div>
          <FilterBar
            query={query}
            layer={layer}
            category={category}
            categories={categories}
            onQuery={setQuery}
            onLayer={setLayer}
            onCategory={setCategory}
          />
          <ResourceExplorer
            resources={filtered}
            selectedId={selectedId}
            onSelect={select}
          />
        </aside>

        <section className="lab-canvas" aria-label="Topology">
          <div className="view-toggle" role="group" aria-label="Topology view">
            <button
              type="button"
              className={view === 'graph' ? 'active' : ''}
              onClick={() => setView('graph')}
            >
              Graph
            </button>
            <button
              type="button"
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              List
            </button>
          </div>
          {view === 'graph' ? (
            <div style={{ width: '100%', height: '100%', minHeight: 420 }}>
              <TopologyCanvas
                resources={filtered}
                edges={edges}
                selectedId={selectedId}
                onSelect={select}
              />
            </div>
          ) : (
            <ArchitectureList
              resources={filtered}
              edges={edges}
              selectedId={selectedId}
              onSelect={select}
            />
          )}
        </section>

        <ResourceBlade
          resource={selected}
          edges={edges}
          findings={findings}
          iac={iac}
          tab={tab}
          onTab={setTab}
          onClose={closeBlade}
        />
      </div>
      <footer className="lab-footer">
        <span>
          Demo JSON only · no Azure credentials · host map from k8s/Helm · inventory is sanitized
        </span>
        <span>
          <a href="https://www.cloudpulse-ai.com/" target="_blank" rel="noopener noreferrer">
            Live app
          </a>
          {' · '}
          <a
            href="https://github.com/ryana79/cloudpulse-azure-optimizer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
          {' · '}
          <a href="/">Portfolio</a>
        </span>
      </footer>
    </div>
  );
}
