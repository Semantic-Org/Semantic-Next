/*
  Tests for retainers.js — the zero-dep .heapsnapshot parser, detached-node
  detection, survivor diff, and backward-BFS to the nearest named retainer. Run:
    node --test tools/ci/memory/retainers.test.js

  These build tiny format-faithful snapshots with a planted leak so the BFS has
  a known answer. This is the fixture validation the attribution path needs;
  it's deliberately small (the full real-snapshot validation is the v1 -> v2
  TODO in retainers.js).
*/
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  aggregateByShape,
  attributeLeak,
  detachedNodes,
  nearestRetainerPath,
  parseSnapshot,
  survivors,
} from './retainers.js';

// Minimal v8 snapshot builder. Nodes are [type, name, id, self_size,
// edge_count, trace_node_id, detachedness]; edges are [type, name_or_index,
// to_node] where to_node is a *byte offset* (node index * node_fields.length).
const NODE_FIELDS = ['type', 'name', 'id', 'self_size', 'edge_count', 'trace_node_id', 'detachedness'];
const EDGE_FIELDS = ['type', 'name_or_index', 'to_node'];
const NODE_TYPES = [
  'hidden',
  'array',
  'string',
  'object',
  'code',
  'closure',
  'regexp',
  'number',
  'native',
  'synthetic',
];
const EDGE_TYPES = ['context', 'element', 'property', 'internal', 'hidden', 'shortcut', 'weak'];

function buildSnapshot(spec) {
  // spec.nodes: [{ type, name, detached?, edges: [{ type, name, to }] }]
  // `to` is the index into spec.nodes.
  const strings = [];
  const strIdx = (s) => {
    const i = strings.indexOf(s);
    if (i >= 0) { return i; }
    strings.push(s);
    return strings.length - 1;
  };

  const nodes = [];
  const edges = [];
  // first pass: emit node records with edge_count
  for (let i = 0; i < spec.nodes.length; i++) {
    const n = spec.nodes[i];
    nodes.push(
      NODE_TYPES.indexOf(n.type),
      strIdx(n.name),
      i + 1, // id
      n.selfSize ?? 16,
      (n.edges ?? []).length,
      0,
      n.detached ? 2 : 0,
    );
  }
  // second pass: emit edges in node order
  for (const n of spec.nodes) {
    for (const e of n.edges ?? []) {
      const named = ['property', 'internal', 'shortcut', 'context'].includes(e.type);
      edges.push(
        EDGE_TYPES.indexOf(e.type),
        named ? strIdx(e.name) : e.name, // element edges carry a numeric index
        e.to * NODE_FIELDS.length,
      );
    }
  }

  return {
    snapshot: {
      meta: {
        node_fields: NODE_FIELDS,
        node_types: [NODE_TYPES],
        edge_fields: EDGE_FIELDS,
        edge_types: [EDGE_TYPES],
      },
    },
    nodes,
    edges,
    strings,
  };
}

// A graph: (global) --leakedScopes--> Array --[]--> _Reaction (the leak)
function leakGraph() {
  return buildSnapshot({
    nodes: [
      { type: 'synthetic', name: '(global)', edges: [{ type: 'property', name: 'leakedScopes', to: 1 }] },
      { type: 'array', name: 'Array', edges: [{ type: 'element', name: 0, to: 2 }] },
      { type: 'object', name: '_Reaction', edges: [] },
    ],
  });
}

test('parseSnapshot resolves nodes, edges, and the reverse retainer index', () => {
  const graph = parseSnapshot(leakGraph());
  assert.equal(graph.nodes.length, 3);
  const reaction = graph.nodes.find((n) => n.name === '_Reaction');
  assert.equal(reaction.retainers.length, 1);
  assert.equal(reaction.retainers[0].type, 'element');
  // its retainer's retainer is the (global) via the named edge
  const array = graph.nodes[reaction.retainers[0].from];
  assert.equal(array.name, 'Array');
  assert.equal(array.retainers[0].name, 'leakedScopes');
});

test('detachedNodes finds the detached-flagged DOM node', () => {
  const raw = buildSnapshot({
    nodes: [
      { type: 'synthetic', name: '(global)', edges: [{ type: 'property', name: 'x', to: 1 }] },
      { type: 'native', name: 'Detached HTMLLIElement', detached: true, edges: [] },
    ],
  });
  const graph = parseSnapshot(raw);
  const detached = detachedNodes(graph);
  assert.equal(detached.length, 1);
  assert.equal(detached[0].name, 'Detached HTMLLIElement');
});

test('nearestRetainerPath walks backward from the leak to the global', () => {
  const graph = parseSnapshot(leakGraph());
  const reaction = graph.nodes.find((n) => n.name === '_Reaction');
  const { path } = nearestRetainerPath(graph, reaction.index);
  // root-first: (global) -> leakedScopes -> [] (the array element)
  assert.deepEqual(path, ['(global)', 'leakedScopes', '[]']);
});

test('survivors diff finds object nodes new in target', () => {
  const base = parseSnapshot(buildSnapshot({
    nodes: [{ type: 'synthetic', name: '(global)', edges: [] }],
  }));
  const target = parseSnapshot(leakGraph());
  const grown = survivors(target, base, { names: ['Reaction'] });
  assert.equal(grown.length, 1);
  assert.equal(grown[0].name, '_Reaction'); // matched after underscore-fold
});

test('aggregateByShape collapses identical leaks into one counted shape', () => {
  // global -> array -> [three identical _Reaction leaves]
  const raw = buildSnapshot({
    nodes: [
      {
        type: 'synthetic',
        name: '(global)',
        edges: [{ type: 'property', name: 'leakedScopes', to: 1 }],
      },
      {
        type: 'array',
        name: 'Array',
        edges: [
          { type: 'element', name: 0, to: 2 },
          { type: 'element', name: 1, to: 3 },
          { type: 'element', name: 2, to: 4 },
        ],
      },
      { type: 'object', name: '_Reaction', edges: [] },
      { type: 'object', name: '_Reaction', edges: [] },
      { type: 'object', name: '_Reaction', edges: [] },
    ],
  });
  const graph = parseSnapshot(raw);
  const leaks = graph.nodes.filter((n) => n.name === '_Reaction');
  const shapes = aggregateByShape(graph, leaks, { topN: 3 });
  assert.equal(shapes.length, 1); // three leaks, one shape
  assert.equal(shapes[0].count, 3);
  assert.equal(shapes[0].leaf, 'Reaction');
  assert.match(shapes[0].shape, /leakedScopes/);
});

test('attributeLeak ties the whole pipeline together and marks itself v1', () => {
  const base = buildSnapshot({ nodes: [{ type: 'synthetic', name: '(global)', edges: [] }] });
  const target = leakGraph();
  const result = attributeLeak(target, base, { names: ['Reaction'], topN: 3 });
  assert.equal(result.version, 'v1');
  assert.ok(result.leakedCount >= 1);
  assert.ok(result.shapes.length >= 1);
  assert.match(result.note, /best-effort v1/);
});
