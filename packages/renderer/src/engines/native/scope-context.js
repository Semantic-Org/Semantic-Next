import { ReactiveDataContext } from './reactive-context.js';

/*

  Block scope resolution for event handlers — the `scope` callback param.

  Scope-creating blocks (each records, subtemplates, snippets with args,
  async vars) already delimit their DOM ranges with boundary nodes they
  maintain: each-record startMarker/endMarker pairs and DynamicRegion
  anchor/endAnchor pairs. Those nodes get two symbol expandos:

    SCOPE_OWNER on a range start — resolves to a data layer
    SCOPE_END on a range end — carries the node a backward scan jumps
    to when the range is closed relative to the target

  Resolution walks up from the event target. At each level a backward
  sibling scan bracket-matches over the stamps: a SCOPE_END means the
  range closed before the target (jump past it in one hop), a bare
  SCOPE_OWNER means the range encloses the target (collect its layer).
  Pairs at one sibling level are properly nested or disjoint — markers
  move atomically through extractRangeToFragment — so bracket matching
  is exact. Content swapped in by inner blocks after creation lands
  between the same markers, so it resolves with zero extra bookkeeping,
  the same live-sibling invariant each's reconcile relies on.

  Owner shapes:
    each record        — .dataContext (RDC), layer is the live values
                         bag; .regionAnchor compresses the rest of the
                         list to one hop after collection
    { data, keys }     — subtemplate/snippet/async descriptor; keys
                         limits the layer to declared args (args records
                         also carry copied parent descriptors that
                         freeze at mount and would mask fresher outer
                         layers)

*/

export const SCOPE_OWNER = Symbol('sui-scope-owner');
export const SCOPE_END = Symbol('sui-scope-end');

// stashed on args records by buildArgsRecord so stamp sites can limit
// the layer to declared keys without recomputing them
export const DECLARED_KEYS = Symbol('sui-declared-keys');

export function markScopeRange(startNode, endNode, owner, jumpTarget = startNode) {
  startNode[SCOPE_OWNER] = owner;
  if (endNode) {
    endNode[SCOPE_END] = jumpTarget;
  }
}

function getLayer(owner) {
  if (owner.dataContext instanceof ReactiveDataContext) {
    return owner.dataContext.values;
  }
  const { data, keys } = owner;
  if (!keys) {
    return data;
  }
  const layer = {};
  for (const key of keys) {
    layer[key] = data[key];
  }
  return layer;
}

// Layers innermost-first, or null when the target is not inside
// rootNode's tree (host-surface events, global events). startNode is
// the template's own start anchor — scopes beyond it belong to the
// parent template, not this one.
export function resolveScopeLayers(target, { rootNode, startNode } = {}) {
  const layers = [];
  let node = target;
  while (node && node !== rootNode) {
    let sibling = node.previousSibling;
    while (sibling) {
      if (sibling === startNode) {
        return layers;
      }
      const skipTo = sibling[SCOPE_END];
      if (skipTo !== undefined) {
        sibling = skipTo;
      }
      else {
        const owner = sibling[SCOPE_OWNER];
        if (owner !== undefined) {
          layers.push(getLayer(owner));
          if (owner.regionAnchor) {
            sibling = owner.regionAnchor;
          }
        }
      }
      sibling = sibling.previousSibling;
    }
    const parent = node.parentNode;
    if (parent === null) {
      // crossing out of a shadow tree — deep targets resolve through
      // the host into the handler-owning template's tree
      const host = node.host;
      if (!host) {
        return null;
      }
      node = host;
      continue;
    }
    node = parent;
  }
  return node === rootNode ? layers : null;
}
