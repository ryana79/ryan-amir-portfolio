export type Resource = {
  id: string;
  type: string;
  category: string;
  environment: string;
  region: string;
  label: string;
  tags: Record<string, string>;
  layer: 'host' | 'sample-inventory';
  iacRef?: string | null;
  metricsRef?: string | null;
};

export type TopologyEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  relationshipType: string;
};

export type Recommendation = {
  resourceId: string;
  category: string;
  finding: string;
  evidence: string;
  action: string;
  effect: string;
  confidence: string;
  risk: string;
  status: string;
};

export type IacEntry = {
  path: string;
  kind: string;
  snippetStart: number;
  snippetEnd: number;
  note: string;
};

export type DeploymentManifest = {
  commit: string;
  validationStatus: string;
  resourceCount: number;
  testsPassed: number | null;
  deployedAt: string;
  dataClassification: string;
  notes?: string;
};

export type BladeTab =
  | 'overview'
  | 'relationships'
  | 'observability'
  | 'cost'
  | 'optimization'
  | 'iac'
  | 'decision';
