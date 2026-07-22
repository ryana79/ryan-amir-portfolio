type Props = {
  dataClassification: string;
};

export function LabHeader({ dataClassification }: Props) {
  return (
    <header className="lab-header">
      <div className="lab-brand">
        <nav className="lab-crumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          {' / '}
          <a href="/#folio">Folio</a>
          {' / '}
          <span aria-current="page">CloudPulse Lab</span>
        </nav>
        <h1 className="lab-title">CloudPulse Architecture Lab</h1>
      </div>
      <span className="lab-badge" title="Public demo JSON only — no live tenant data">
        {dataClassification}
      </span>
    </header>
  );
}
