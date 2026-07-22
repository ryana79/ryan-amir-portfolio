import type { Recommendation } from '../types';

type Props = {
  items: Recommendation[];
};

export function RecommendationPanel({ items }: Props) {
  if (!items.length) {
    return (
      <div className="rec-panel">
        <p style={{ margin: 0, fontSize: 11 }}>No demo findings for this resource.</p>
      </div>
    );
  }

  return (
    <div className="rec-panel">
      <div className="pane-head" style={{ position: 'static', padding: '0 0 10px', border: 'none' }}>
        Findings
      </div>
      {items.map((item, i) => (
        <article key={`${item.resourceId}-${item.category}-${i}`} className="rec-card">
          <strong>{item.finding}</strong>
          <div>evidence · {item.evidence}</div>
          <div>action · {item.action}</div>
          <div>effect · {item.effect}</div>
          <div>
            confidence · {item.confidence} · risk · {item.risk}
          </div>
          <div className="rec-status">status · {item.status}</div>
        </article>
      ))}
    </div>
  );
}
