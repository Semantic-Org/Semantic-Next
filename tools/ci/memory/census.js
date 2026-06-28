/*
  Instance counting, two ways.

  Tier 1 (the gate) — countLiveInstances: ask V8 directly via
  Runtime.queryObjects(prototype). It returns an array of every live object with
  that prototype on its chain *after a GC*, so its length is the live-instance
  count. It keys on the prototype object, not the class name, so esbuild's
  name munging (see normalizeConstructor below) can't fool it. This is why the
  gate needs no snapshot.

  Tier 2 (attribution) — censusBySnapshot: count nodes by constructor name in a
  parsed .heapsnapshot. Coarser and name-sensitive, but it reaches structures
  the prototypes don't enumerate (detached DOM, stray closures). Only the
  on-failure path uses it.
*/

/*
  esbuild emits a self-referencing class as `var Reaction = class _Reaction {}`,
  and a named class expression's own binding wins for `.name` — so the heap
  snapshot labels the node `_Reaction`, not `Reaction`. (Anonymous class
  expressions assigned to a var infer the var name, so those stay clean.) The
  snapshot census must fold the leading underscore to match the invariant ids;
  the queryObjects path is immune because it never reads the name. Verified
  against dist/current/bench-memory.js: ReactionScope and Signal come through as
  _ReactionScope / _Signal.
*/
export function normalizeConstructor(name) {
  if (typeof name !== 'string') { return name; }
  // a single leading underscore is the esbuild self-reference artifact; deeper
  // dunder names (__proto__ etc.) are left alone
  return name.replace(/^_(?=[A-Z])/, '');
}

/*
  Count live instances of one prototype over CDP.

  `client` is a CDP session, `prototypeRemote` is a RemoteObject handle to the
  prototype (obtained by evaluating `window.__heap.prototypes.<id>`).
  queryObjects implicitly GCs first, so the count is post-collection — but the
  caller should still settle() before this so async teardown has finished.
*/
export async function countLiveInstances(client, prototypeObjectId) {
  const { objects } = await client.send('Runtime.queryObjects', {
    prototypeObjectId,
  });
  // objects is a RemoteObject for the result Array. Read its length, then
  // release the array so its own handle doesn't pin the matched instances.
  const { result } = await client.send('Runtime.callFunctionOn', {
    objectId: objects.objectId,
    functionDeclaration: 'function () { return this.length; }',
    returnByValue: true,
  });
  await client.send('Runtime.releaseObject', { objectId: objects.objectId });
  return result.value;
}

/*
  Snapshot-constructor census (Tier 2). `graph` is the parsed snapshot from
  retainers.js (it carries node names already decoded from the strings table).
  Returns a Map of normalized-constructor-name -> count. `detachedOnly` filters
  to nodes the snapshot flags detached (the detachedness field == 2).
*/
export function censusBySnapshot(graph, { detachedOnly = false } = {}) {
  const counts = new Map();
  for (const node of graph.nodes) {
    if (detachedOnly && !node.detached) { continue; }
    const name = normalizeConstructor(node.name);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return counts;
}
