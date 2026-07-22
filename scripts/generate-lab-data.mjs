#!/usr/bin/env node
/**
 * Validates curated lab JSON and copies into lab-app/src/data/.
 * Usage: node scripts/generate-lab-data.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'scripts/lab-source');
const outDir = join(root, 'lab-app/src/data');

const REQUIRED_NODE = ['id', 'type', 'category', 'environment', 'region', 'label', 'tags'];
const REQUIRED_EDGE = ['id', 'source', 'target', 'label', 'relationshipType'];

function load(name) {
  return JSON.parse(readFileSync(join(srcDir, name), 'utf8'));
}

function assertUnique(ids, label) {
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`Duplicate ${label} id: ${id}`);
    seen.add(id);
  }
}

function validateTopology(topo, name) {
  if (!topo.nodes?.length) throw new Error(`${name}: nodes required`);
  if (!Array.isArray(topo.edges)) throw new Error(`${name}: edges required`);
  for (const n of topo.nodes) {
    for (const k of REQUIRED_NODE) {
      if (n[k] === undefined || n[k] === null) throw new Error(`${name}: node missing ${k}`);
    }
  }
  assertUnique(topo.nodes.map((n) => n.id), `${name} node`);
  const ids = new Set(topo.nodes.map((n) => n.id));
  for (const e of topo.edges) {
    for (const k of REQUIRED_EDGE) {
      if (!e[k]) throw new Error(`${name}: edge missing ${k}`);
    }
    if (!ids.has(e.source) || !ids.has(e.target)) {
      throw new Error(`${name}: edge ${e.id} refs unknown node`);
    }
  }
  assertUnique(topo.edges.map((e) => e.id), `${name} edge`);
}

function main() {
  const host = load('host-topology.json');
  const inventory = load('sample-inventory.json');
  const recommendations = load('recommendations.json');
  const iacIndex = load('iac-index.json');
  const manifest = load('deployment-manifest.json');

  validateTopology(host, 'host-topology');
  validateTopology(inventory, 'sample-inventory');

  const allIds = new Set([
    ...host.nodes.map((n) => n.id),
    ...inventory.nodes.map((n) => n.id),
  ]);
  for (const item of recommendations.items || []) {
    if (!item.resourceId || !item.finding || !item.status) {
      throw new Error('recommendations: each item needs resourceId, finding, status');
    }
    if (!allIds.has(item.resourceId)) {
      throw new Error(`recommendations: unknown resourceId ${item.resourceId}`);
    }
  }

  for (const key of Object.keys(iacIndex.entries || {})) {
    if (!allIds.has(key)) {
      console.warn(`iac-index: entry ${key} has no matching node (ok if host-only)`);
    }
  }

  const resources = {
    dataClassification: 'mixed-labeled',
    host: host.nodes.map((n) => ({ ...n, layer: 'host' })),
    inventory: inventory.nodes.map((n) => ({ ...n, layer: 'sample-inventory' })),
  };

  const topology = {
    dataClassification: 'mixed-labeled',
    layers: {
      host: { nodes: host.nodes, edges: host.edges, dataClassification: host.dataClassification },
      inventory: {
        nodes: inventory.nodes,
        edges: inventory.edges,
        dataClassification: inventory.dataClassification,
      },
    },
  };

  mkdirSync(outDir, { recursive: true });
  const writes = {
    'resources.json': resources,
    'topology.json': topology,
    'recommendations.json': recommendations,
    'iac-index.json': iacIndex,
    'deployment-manifest.json': manifest,
  };
  for (const [file, data] of Object.entries(writes)) {
    writeFileSync(join(outDir, file), JSON.stringify(data, null, 2) + '\n');
  }

  console.log('Lab data OK → lab-app/src/data/');
  console.log(`  host nodes: ${host.nodes.length}, inventory: ${inventory.nodes.length}`);
  console.log(`  recommendations: ${recommendations.items.length}`);
  console.log(`  manifest: ${manifest.validationStatus}`);
}

main();
