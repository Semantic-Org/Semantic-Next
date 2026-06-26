/*
  Tier 2 — leak attribution. NOT YET WIRED.

  This is a tested-but-unwired library, a head start on Tier 2. Nothing in the
  runner captures a .heapsnapshot today, and there is no /memory-deep trigger —
  so the bot never invokes this path and the PR comment never shows a retainer
  shape. Wiring that capture (snapshot on an invariant break) and validating the
  retainer output against real Chrome .heapsnapshots is the Tier-2 follow-up; the
  fixture tests below exercise the parser/BFS against planted leaks but not a
  real-world graph (see the v1 -> v2 TODO in aggregateByShape).

  When wired, it runs only on a broken Tier-1 invariant (or a /memory-deep
  label). Never on the gate path, so it can be heavy and is allowed to be
  imperfect — a smaller correct hint beats a large wrong one.

  The job: name what's retaining a leaked object. Inputs are two .heapsnapshot
  graphs (a clean baseline and a post-churn target); the output is the top-N
  retainer path *shapes* for the leaked/detached set, with real edge names
  (SUI's internals are named — Dependency.subscribers, ReactionScope.reactions —
  so the paths come out human-readable).

  Zero-dep: the .heapsnapshot is a flat JSON graph and the backward walk is
  small enough to roll by hand, matching the bundle/bench harnesses.

  Snapshot format (v8):
    meta.node_fields  : field names, one node = node_fields.length ints, flat in `nodes`
                        [type, name, id, self_size, edge_count, trace_node_id, detachedness]
                        — the 7th field, detachedness, is 2 for a detached DOM node
    meta.edge_fields  : [type, name_or_index, to_node]  (to_node is a byte offset
                        into `nodes`, i.e. index * node_fields.length)
    strings           : the string table both node names and edge names index into
*/
import { RETAINER_TOP_N } from './targets.js';

/*
  Parse a raw .heapsnapshot (already JSON.parse'd) into a node/edge graph we can
  walk. We materialize per-node objects with their out-edges resolved to node
  indices, plus a reverse index (retainers) so the backward BFS is O(1) per hop.
*/
export function parseSnapshot(raw) {
  const meta = raw.snapshot.meta;
  const nodeFields = meta.node_fields;
  const edgeFields = meta.edge_fields;
  const nodeTypes = meta.node_types[0]; // first node_field ("type") enum
  const edgeTypes = meta.edge_types[0];
  const strings = raw.strings;
  const nodeFieldCount = nodeFields.length;
  const edgeFieldCount = edgeFields.length;

  const idxType = nodeFields.indexOf('type');
  const idxName = nodeFields.indexOf('name');
  const idxId = nodeFields.indexOf('id');
  const idxSelfSize = nodeFields.indexOf('self_size');
  const idxEdgeCount = nodeFields.indexOf('edge_count');
  const idxDetached = nodeFields.indexOf('detachedness'); // may be -1 on old snapshots

  const eType = edgeFields.indexOf('type');
  const eName = edgeFields.indexOf('name_or_index');
  const eTo = edgeFields.indexOf('to_node');

  const rawNodes = raw.nodes;
  const rawEdges = raw.edges;
  const nodeCount = rawNodes.length / nodeFieldCount;

  const nodes = new Array(nodeCount);
  // edges are laid out in node order; walk once, tracking the running edge
  // cursor so each node claims its edge_count slice
  let edgeCursor = 0;
  for (let i = 0; i < nodeCount; i++) {
    const base = i * nodeFieldCount;
    const edgeCount = rawNodes[base + idxEdgeCount];
    const node = {
      index: i,
      type: nodeTypes[rawNodes[base + idxType]],
      name: strings[rawNodes[base + idxName]],
      id: rawNodes[base + idxId],
      selfSize: rawNodes[base + idxSelfSize],
      detached: idxDetached >= 0 && rawNodes[base + idxDetached] === 2,
      edgeStart: edgeCursor,
      edgeCount,
      edges: [],
      retainers: [],
    };
    nodes[i] = node;
    edgeCursor += edgeCount;
  }

  // resolve edges + build the reverse (retainer) index
  for (let i = 0; i < nodeCount; i++) {
    const node = nodes[i];
    for (let e = 0; e < node.edgeCount; e++) {
      const base = (node.edgeStart + e) * edgeFieldCount;
      const type = edgeTypes[rawEdges[base + eType]];
      const nameOrIndex = rawEdges[base + eName];
      const toNodeOffset = rawEdges[base + eTo];
      const toIndex = toNodeOffset / nodeFieldCount;
      // for named edges (property/internal) nameOrIndex is a string-table index;
      // for element/hidden edges it's a numeric index — keep both meanings
      const named = type === 'property' || type === 'internal' || type === 'shortcut' || type === 'context';
      const edge = {
        type,
        name: named ? strings[nameOrIndex] : String(nameOrIndex),
        from: i,
        to: toIndex,
        weak: type === 'weak',
      };
      node.edges.push(edge);
      nodes[toIndex].retainers.push(edge);
    }
  }

  return { nodes, strings, meta };
}

/*
  Detached DOM nodes in a graph — V8 stamps `detachedness === 2` on DOM nodes
  unreachable from the document but still retained in JS. This is the cleanest
  leak signal for the lifecycle case: a torn-down component whose <tr>/<td>
  survive.
*/
export function detachedNodes(graph) {
  return graph.nodes.filter((n) => n.detached);
}

/*
  Survivor diff: object nodes present in `target` whose id is absent from
  `base`. Restricted to constructor-named object nodes (the ones we can blame),
  optionally to a set of constructor names of interest (the broken invariants).
*/
export function survivors(targetGraph, baseGraph, { names } = {}) {
  const baseIds = new Set(baseGraph.nodes.map((n) => n.id));
  const wanted = names ? new Set(names) : null;
  return targetGraph.nodes.filter((n) => {
    if (n.type !== 'object') { return false; }
    if (baseIds.has(n.id)) { return false; }
    if (wanted && !wanted.has(stripUnderscore(n.name))) { return false; }
    return true;
  });
}

/*
  Backward BFS from a leaked node to the nearest *named* retainer chain ending
  at a GC root. Prefers shortest non-weak paths. Returns an array of edge-name
  hops from the GC root down to the leaked node, e.g.
    ['(global)', 'detachedScopes', 'reactions', '[]']
  Truncated at maxDepth so a pathological graph can't run away.
*/
export function nearestRetainerPath(graph, startIndex, { maxDepth = 30 } = {}) {
  const seen = new Set([startIndex]);
  let frontier = [{ index: startIndex, path: [] }];
  for (let depth = 0; depth < maxDepth; depth++) {
    const next = [];
    for (const { index, path } of frontier) {
      const node = graph.nodes[index];
      if (isRoot(node)) {
        return { path: [rootLabel(node), ...path], rootId: node.id };
      }
      // prefer non-weak retainers; a weak edge doesn't keep anything alive
      const retainers = node.retainers.filter((e) => !e.weak);
      for (const edge of retainers) {
        if (seen.has(edge.from)) { continue; }
        seen.add(edge.from);
        next.push({ index: edge.from, path: [edgeLabel(edge), ...path] });
      }
    }
    if (next.length === 0) { break; }
    frontier = next;
  }
  // no root found within maxDepth — return the partial chain we have, marked
  return { path: frontier[0]?.path ?? [], rootId: null, truncated: true };
}

/*
  Aggregate-by-shape. 1000 identical leaks share one retainer path shape, so we
  collapse them: key on the joined edge-name path, count occurrences, keep one
  representative. Returns the top-N shapes by count.

  TODO (v1 -> v2): the path *shape* here keys purely on edge names. Two
  genuinely distinct leaks that happen to share an edge-name sequence would
  merge. A v2 should also key on the constructor-name sequence along the path,
  and validate the BFS against a fixture snapshot with a known planted leak
  (the bundle/bench harnesses both have golden fixtures — this one does not yet,
  which is why Tier 2 is gated off the verdict and marked best-effort).
*/
export function aggregateByShape(graph, leakedNodes, { topN = RETAINER_TOP_N, maxDepth = 30 } = {}) {
  const shapes = new Map();
  for (const node of leakedNodes) {
    const { path, truncated } = nearestRetainerPath(graph, node.index, { maxDepth });
    const leafName = stripUnderscore(node.name);
    const key = `${path.join(' → ')} → ${leafName}`;
    const existing = shapes.get(key);
    if (existing) {
      existing.count++;
    }
    else {
      shapes.set(key, { shape: key, path, leaf: leafName, count: 1, truncated: !!truncated });
    }
  }
  return [...shapes.values()].sort((a, b) => b.count - a.count).slice(0, topN);
}

/*
  Whole-pipeline convenience: parse two raw snapshots, find the leaked set for
  the named broken invariants (plus detached DOM), aggregate, return top-N. This
  is what a workflow / leak:debug entrypoint calls. Marked v1 — the returned
  shapes are a *likely* hint, not gospel (multiple valid paths, weak/internal
  edges, the shape-key caveat above).
*/
export function attributeLeak(rawTarget, rawBase, { names, topN = RETAINER_TOP_N } = {}) {
  const target = parseSnapshot(rawTarget);
  const base = parseSnapshot(rawBase);
  const detached = detachedNodes(target).filter((n) => !base.nodes.some((b) => b.id === n.id));
  const grown = survivors(target, base, { names });
  const leaked = dedupeById([...grown, ...detached]);
  return {
    version: 'v1',
    leakedCount: leaked.length,
    detachedCount: detached.length,
    shapes: aggregateByShape(target, leaked, { topN }),
    note: 'best-effort v1 retainer attribution — a likely hint, not a verdict. needs fixture validation.',
  };
}

/* ----------------------------- helpers ----------------------------- */

function isRoot(node) {
  return node.type === 'synthetic' && /root|GC roots|(Global handles)/.test(node.name)
    || node.name === '(GC roots)'
    || node.name === '(global)';
}

function rootLabel(node) {
  return node.name === '(global)' ? '(global)' : node.name || '(root)';
}

function edgeLabel(edge) {
  if (edge.type === 'element') { return '[]'; }
  if (edge.type === 'internal') { return `<${edge.name}>`; }
  return edge.name || `<${edge.type}>`;
}

function stripUnderscore(name) {
  return typeof name === 'string' ? name.replace(/^_(?=[A-Z])/, '') : name;
}

function dedupeById(nodes) {
  const seen = new Set();
  const out = [];
  for (const n of nodes) {
    if (seen.has(n.id)) { continue; }
    seen.add(n.id);
    out.push(n);
  }
  return out;
}
