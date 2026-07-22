type Props = {
  query: string;
  layer: string;
  category: string;
  categories: string[];
  onQuery: (v: string) => void;
  onLayer: (v: string) => void;
  onCategory: (v: string) => void;
};

export function FilterBar({
  query,
  layer,
  category,
  categories,
  onQuery,
  onLayer,
  onCategory,
}: Props) {
  return (
    <div className="filter-bar">
      <label>
        Search
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="id, label, type…"
          autoComplete="off"
        />
      </label>
      <label>
        Layer
        <select value={layer} onChange={(e) => onLayer(e.target.value)}>
          <option value="all">all</option>
          <option value="host">host map</option>
          <option value="sample-inventory">sample inventory</option>
        </select>
      </label>
      <label>
        Category
        <select value={category} onChange={(e) => onCategory(e.target.value)}>
          <option value="all">all</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
