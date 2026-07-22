import type { Resource } from '../types';

type Props = {
  resources: Resource[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function ResourceExplorer({ resources, selectedId, onSelect }: Props) {
  if (!resources.length) {
    return <p className="blade-empty">No resources match filters.</p>;
  }

  return (
    <ul className="resource-list" role="listbox" aria-label="Resources">
      {resources.map((r) => (
        <li key={r.id} role="none">
          <button
            type="button"
            role="option"
            aria-selected={selectedId === r.id}
            className={`resource-item${selectedId === r.id ? ' active' : ''}`}
            onClick={() => onSelect(r.id)}
          >
            <span className="resource-item-label">{r.label}</span>
            <span className="resource-item-meta">
              {r.layer} · {r.category} · {r.region}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
