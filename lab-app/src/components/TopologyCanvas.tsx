import { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Resource, TopologyEdge } from '../types';

type Props = {
  resources: Resource[];
  edges: TopologyEdge[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function layoutNodes(resources: Resource[], selectedId: string | null): Node[] {
  const host = resources.filter((r) => r.layer === 'host');
  const inv = resources.filter((r) => r.layer === 'sample-inventory');
  const place = (list: Resource[], row: number) =>
    list.map((r, i) => ({
      id: r.id,
      position: { x: 40 + (i % 4) * 180, y: 40 + row * 160 + Math.floor(i / 4) * 90 },
      data: { label: r.label, type: r.type, layer: r.layer },
      className: `topo-node ${r.layer === 'host' ? 'host' : ''}${selectedId === r.id ? ' selected' : ''}`,
      style: {
        border: selectedId === r.id ? '1px solid var(--accent)' : undefined,
        background: 'var(--bg-2)',
        color: 'var(--text)',
        fontSize: 11,
        padding: 8,
        minWidth: 120,
      },
    }));

  return [...place(host, 0), ...place(inv, 2)];
}

export function TopologyCanvas({ resources, edges, selectedId, onSelect }: Props) {
  const initialNodes = useMemo(
    () => layoutNodes(resources, selectedId),
    [resources, selectedId],
  );
  const initialEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
        style: { stroke: '#3a4254' },
        labelStyle: { fill: '#8a8f9c', fontSize: 10 },
      })),
    [edges],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [rfEdges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(layoutNodes(resources, selectedId));
  }, [resources, selectedId, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={rfEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={(_, node) => onSelect(node.id)}
      fitView
      proOptions={{ hideAttribution: true }}
      nodesDraggable
      elementsSelectable
    >
      <Background gap={20} color="#1e2330" />
      <Controls />
      <MiniMap
        nodeColor={() => '#7dffa8'}
        maskColor="rgba(6,7,10,0.7)"
        style={{ background: '#0c0e14' }}
      />
    </ReactFlow>
  );
}
