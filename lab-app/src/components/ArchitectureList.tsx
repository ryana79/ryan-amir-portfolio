import type { Resource, TopologyEdge } from '../types';

type Props = {
  resources: Resource[];
  edges: TopologyEdge[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function ArchitectureList({ resources, edges, selectedId, onSelect }: Props) {
  return (
    <div className="arch-list">
      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 0 }}>
        Keyboard-friendly topology fallback (graph view also available).
      </p>
      <ul>
        {resources.map((r) => {
          const related = edges.filter((e) => e.source === r.id || e.target === r.id);
          return (
            <li key={r.id} style={selectedId === r.id ? { borderColor: 'var(--accent)' } : undefined}>
              <button type="button" onClick={() => onSelect(r.id)}>
                {r.label}
              </button>
              <div style={{ marginTop: 6, color: 'var(--muted)' }}>
                {r.type} · {r.layer}
              </div>
              {related.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  {related.map((e) => (
                    <div key={e.id}>
                      {e.source === r.id ? '→' : '←'} {e.label}{' '}
                      {e.source === r.id ? e.target : e.source}
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
