import { Signal } from '@semantic-ui/reactivity';
import { arrayFromObject, isArray, isEmpty, isPlainObject, isString } from '@semantic-ui/utils';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  {#each items as item} — keyed list reconciliation with per-item reactive
  data channels. Each item owns a pair of empty text-node markers
  (startMarker / endMarker) that bracket its DOM; everything rendered for
  the item lives strictly between them. Markers are stable positional
  anchors — inner blocks (rerender, if, nested each, ...) swap only the
  nodes they themselves own, never touching our markers. That lets
  reconcile identify, move, and remove items by walking marker-to-marker
  over *live* DOM, instead of dereferencing a stale childNodes snapshot
  taken at item-creation time.

  Six plan fixes (ai/plans/native-renderer-blocks.md §EachBlock):
    (1) dual update path — one set(), always a fresh wrapper object so
        deep-equality sees distinct content at the outer level. Inner
        refs are still shared; same-ref mutations still rely on notify()
        for that one specific case (documented below)
    (2) parallel collections — a single ordered ItemRecord[] replaces
        itemMap + currentKeys; key lookup builds a transient Map per run
    (3) __isItemProxy leakage — replaced with a WeakSet tracked inside
        this module; template dispatch checks via isItemContext() import
    (5) showingElse flag — else-content is a single ItemRecord entry with
        isElse: true, rendered once when items is empty
    (6) Proxy preservation — unchanged; the parent-data-fallthrough +
        item-signal-reactivity pattern is load-bearing
  Hydrate trusts server DOM and registers a dep on the collection. The
  first data change invalidates the block; `update` then clears the region
  and rebuilds via `reconcile`. Per-item DOM reuse across that boundary is
  out of scope here — see ai/workspace/reference/perf/06-plans/
  09-each-hydration-dom-reuse.md (Strategy D+E) for the plan that pairs
  SSR per-item markers with a DOM-reusing first-mutation path.

*/

// Proxies created by this module go into the WeakSet; template.js checks
// membership to decide when expression reads should register deps directly
// (item context) versus wrapping in Reaction.nonreactive (static data).
const itemContextProxies = new WeakSet();
export function isItemContext(data) {
  return data != null && itemContextProxies.has(data);
}

function getCollectionType(items) {
  return isArray(items) ? 'array' : 'object';
}

function getItemID(item, indexOrKey, collectionType) {
  if (isPlainObject(item)) {
    const key = (collectionType === 'object') ? indexOrKey : undefined;
    return key || item._id || item.id || item.key || item.hash || item._hash || item.value || indexOrKey;
  }
  if (isString(item)) { return item + ':' + indexOrKey; }
  return indexOrKey;
}

function getEachData(item, indexOrKey, collectionType, node) {
  let { as, indexAs } = node;
  if (!indexAs) {
    indexAs = (collectionType === 'array') ? 'index' : 'key';
  }
  if (collectionType === 'object') {
    indexOrKey = item.key;
    item = item.value;
  }
  // The wrapper is always a fresh object so Signal.set() sees a new
  // top-level reference and doesn't short-circuit on identity. Inner
  // properties are shallow-copied from item (for the no-`as` case) so
  // mutations to item's own properties ARE captured at the wrapper level.
  return as
    ? { [as]: item, [indexAs]: indexOrKey }
    : { ...item, this: item, [indexAs]: indexOrKey };
}

function createItemDataProxy(parentData, itemSignal) {
  const proxy = new Proxy(parentData, {
    get(target, prop) {
      if (typeof prop === 'symbol') { return target[prop]; }
      const itemData = itemSignal.value;
      if (prop in itemData) { return itemData[prop]; }
      return target[prop];
    },
    has(target, prop) {
      const itemData = itemSignal.peek();
      return (prop in itemData) || (prop in target);
    },
  });
  itemContextProxies.add(proxy);
  return proxy;
}

// Remove every node in the half-open range (start, end] — i.e. from
// start.nextSibling through end inclusive. Used by both move (to drain an
// item's content into a fragment for re-insertion) and remove (to tear
// the live item DOM out wholesale). Walking live siblings is what lets
// this handle nested-block mutations correctly: any node between the
// markers right now IS the item's current DOM, regardless of what was
// there at createRecord time.
function removeRangeContent(startMarker, endMarker) {
  let n = startMarker.nextSibling;
  while (n && n !== endMarker) {
    const next = n.nextSibling;
    n.remove();
    n = next;
  }
}

// Move a record's markers + everything between them into `fragment`.
// The record's DOM identity is preserved exactly; no childNodes snapshot
// is used. Captures the first between-marker sibling *before* detaching
// startMarker — once startMarker is in the fragment, its .nextSibling
// would point into the fragment, not the source. After this call, both
// markers and all inner content are in the fragment in original order.
function extractRangeToFragment(startMarker, endMarker, fragment) {
  let n = startMarker.nextSibling;
  fragment.appendChild(startMarker);
  while (n && n !== endMarker) {
    const next = n.nextSibling;
    fragment.appendChild(n);
    n = next;
  }
  fragment.appendChild(endMarker);
}

function clearRecords(records) {
  for (const record of records) {
    record.scope.dispose();
    disposeRecordDOM(record);
  }
  records.length = 0;
}

// Remove all DOM belonging to a record — both markers and everything
// between them. Walk live siblings so any DOM that inner blocks have
// swapped in since createRecord is still correctly torn down.
function disposeRecordDOM(record) {
  if (record.isElse) {
    // Else records pre-date the marker scheme; they live in region.ownedNodes
    // and are cleared via region.clear() at the call sites that transition
    // out of the else state. Nothing to do here.
    return;
  }
  const { startMarker, endMarker } = record;
  if (startMarker && startMarker.parentNode) {
    removeRangeContent(startMarker, endMarker);
    startMarker.remove();
  }
  if (endMarker && endMarker.parentNode) {
    endMarker.remove();
  }
}

function createRecord({ key, item, index, collectionType, node, data, scope, renderAST, isSVG }) {
  const eachData = getEachData(item, index, collectionType, node);
  const itemScope = scope.child();
  const itemSignal = new Signal(eachData, { allowClone: false });
  const itemProxy = createItemDataProxy(data, itemSignal);
  const fragment = renderAST({ ast: node.content, data: itemProxy, scope: itemScope, isSVG });
  // Marker-bounded item range: startMarker ... [item content] ... endMarker.
  // These two empty text nodes are the record's only positional identity.
  // Inner blocks never touch them — each nested DynamicRegion owns its own
  // anchor + endAnchor and swaps only the nodes it created.
  const startMarker = document.createTextNode('');
  const endMarker = document.createTextNode('');
  fragment.insertBefore(startMarker, fragment.firstChild);
  fragment.appendChild(endMarker);
  return {
    key,
    item,
    index,
    itemSignal,
    startMarker,
    endMarker,
    fragment,
    scope: itemScope,
    isElse: false,
  };
}

function disposeRecord(record) {
  record.scope.dispose();
  disposeRecordDOM(record);
}

// Lit-style head/tail keyed reconcile (lit-html's repeat directive).
// Walks both ends inward; lazily builds key→index maps only when forced
// by non-contiguous changes. Common cases (head/tail unchanged, single
// move, full reverse, sequential add/remove) skip the map entirely.
//
// Phase 1: walk produces newRecords[] order + removes dropped records.
// Phase 2: linearize DOM order in one pass, using each record's
//          startMarker/endMarker as stable positional anchors. Movement
//          extracts the [startMarker..endMarker] range into a fragment,
//          then reinserts it — correct regardless of what inner blocks
//          have done to content between the markers.
// Phase 3: itemSignal updates for records whose item/index changed.
function reconcile({ records, items, collectionType, node, data, scope, region, renderAST, isSVG }) {
  const oldRecords = records.slice();
  const oldKeys = oldRecords.map((r) => r.key);
  const newKeys = items.map((item, i) => getItemID(item, i, collectionType));
  const newRecords = new Array(items.length);

  let oldHead = 0;
  let oldTail = oldRecords.length - 1;
  let newHead = 0;
  let newTail = items.length - 1;
  let oldKeyToIdx;
  let newKeySet;

  while (oldHead <= oldTail && newHead <= newTail) {
    if (oldRecords[oldHead] === null) {
      oldHead++;
      continue;
    }
    if (oldRecords[oldTail] === null) {
      oldTail--;
      continue;
    }
    if (oldKeys[oldHead] === newKeys[newHead]) {
      newRecords[newHead++] = oldRecords[oldHead++];
    }
    else if (oldKeys[oldTail] === newKeys[newTail]) {
      newRecords[newTail--] = oldRecords[oldTail--];
    }
    else if (oldKeys[oldHead] === newKeys[newTail]) {
      newRecords[newTail--] = oldRecords[oldHead++];
    }
    else if (oldKeys[oldTail] === newKeys[newHead]) {
      newRecords[newHead++] = oldRecords[oldTail--];
    }
    else {
      if (!oldKeyToIdx) {
        oldKeyToIdx = new Map();
        for (let i = oldHead; i <= oldTail; i++) { oldKeyToIdx.set(oldKeys[i], i); }
        newKeySet = new Set();
        for (let i = newHead; i <= newTail; i++) { newKeySet.add(newKeys[i]); }
      }
      if (!newKeySet.has(oldKeys[oldHead])) {
        disposeRecord(oldRecords[oldHead]);
        oldHead++;
      }
      else if (!newKeySet.has(oldKeys[oldTail])) {
        disposeRecord(oldRecords[oldTail]);
        oldTail--;
      }
      else {
        const oldIdx = oldKeyToIdx.get(newKeys[newHead]);
        const oldRec = oldIdx !== undefined ? oldRecords[oldIdx] : null;
        if (oldRec === null) {
          newRecords[newHead] = createRecord({
            key: newKeys[newHead],
            item: items[newHead],
            index: newHead,
            collectionType,
            node,
            data,
            scope,
            renderAST,
            isSVG,
          });
        }
        else {
          newRecords[newHead] = oldRec;
          oldRecords[oldIdx] = null;
        }
        newHead++;
      }
    }
  }

  while (newHead <= newTail) {
    newRecords[newHead] = createRecord({
      key: newKeys[newHead],
      item: items[newHead],
      index: newHead,
      collectionType,
      node,
      data,
      scope,
      renderAST,
      isSVG,
    });
    newHead++;
  }

  while (oldHead <= oldTail) {
    const r = oldRecords[oldHead++];
    if (r !== null) { disposeRecord(r); }
  }

  // Phase 2: linearize DOM order using markers.
  //
  // `cursor` is always a currently-attached node that we know the next
  // item's startMarker should follow. It starts as region.anchor and
  // advances to each placed record's endMarker. Markers are stable — they
  // are the invariant that survives inner-block mutations.
  //
  // For each record:
  //   - If the record's startMarker is already the cursor's nextSibling,
  //     the record is already in the right place; skip insertion.
  //   - Otherwise, extract its [startMarker .. content .. endMarker]
  //     range into a fragment, then insert the fragment after the cursor.
  //     Fresh records start with their content already in the fragment
  //     we built in createRecord — insert it directly.
  let cursor = region.anchor;
  for (const rec of newRecords) {
    if (!rec) { continue; }
    if (rec.fragment) {
      // Freshly created record — content and markers are in the fragment.
      cursor.after(rec.fragment);
      rec.fragment = null;
    }
    else if (rec.startMarker.previousSibling !== cursor) {
      // Existing record in the wrong position — extract and reinsert.
      const frag = document.createDocumentFragment();
      extractRangeToFragment(rec.startMarker, rec.endMarker, frag);
      cursor.after(frag);
    }
    cursor = rec.endMarker;
  }

  // Phase 3: update item signals where item ref or index changed.
  // Same-ref same-index objects fall into notify() because Signal.isEqual
  // short-circuits on a === b and won't see in-place mutations.
  for (let i = 0; i < newRecords.length; i++) {
    const rec = newRecords[i];
    const item = items[i];
    if (rec.item !== item || rec.index !== i) {
      rec.itemSignal.set(getEachData(item, i, collectionType, node));
      rec.item = item;
      rec.index = i;
    }
    else if (typeof item === 'object') {
      rec.itemSignal.notify();
    }
  }

  records.length = 0;
  for (const r of newRecords) { records.push(r); }
}

function renderElse({ records, node, data, scope, region, renderAST, isSVG }) {
  clearRecords(records);
  const elseScope = scope.child();
  const fragment = renderAST({ ast: node.elseContent, data, scope: elseScope, isSVG });
  region.setContent(fragment, elseScope);
  records.push({
    key: null,
    item: null,
    index: -1,
    itemSignal: null,
    startMarker: null,
    endMarker: null,
    scope: elseScope,
    isElse: true,
  });
}

function resolveItems(node, lookupExpression) {
  const rawItems = lookupExpression(node.over) || [];
  const collectionType = getCollectionType(rawItems);
  const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;
  return { items, collectionType };
}

const eachBlock = defineBlock({
  name: 'each',

  create() {
    return { records: [], hasHydrated: false };
  },

  render({ node, data, scope, region, renderAST, lookupExpression, self, isSVG }) {
    const { items, collectionType } = resolveItems(node, lookupExpression);

    if (isEmpty(items) && node.elseContent) {
      renderElse({ records: self.records, node, data, scope, region, renderAST, isSVG });
      return;
    }

    reconcile({
      records: self.records,
      items,
      collectionType,
      node,
      data,
      scope,
      region,
      renderAST,
      isSVG,
    });
  },

  hydrate({ node, lookupExpression, self }) {
    // Trust server DOM. Register a dep on the collection so the first data
    // change invalidates the block — `update` then clears the region and
    // rebuilds via reconcile. Per-item reactivity (text/attr Reactions
    // inside item content) is established at that rebuild, not on hydrate.
    lookupExpression(node.over);
    self.hasHydrated = true;
  },

  update({ node, data, scope, region, renderAST, lookupExpression, self, isSVG }) {
    const { items, collectionType } = resolveItems(node, lookupExpression);

    if (self.hasHydrated) {
      // First data change after hydration — server DOM is now stale.
      // Clear the region and let reconciliation rebuild from scratch.
      region.clear();
      self.records.length = 0;
      self.hasHydrated = false;
    }

    const showingElse = self.records.length === 1 && self.records[0].isElse;

    // Fast-path: empty items. Skip reconcile (no keyIndex Map allocation,
    // no backward-splice loop) — just tear down records directly. The
    // krausest "clear" benchmark hits this path with 1000 records to
    // dispose; matters more here than the algorithmic shape inside
    // reconcile.
    if (items.length === 0) {
      if (node.elseContent) {
        if (!showingElse) {
          renderElse({ records: self.records, node, data, scope, region, renderAST, isSVG });
        }
        return;
      }
      for (const record of self.records) {
        if (record.isElse) { continue; }
        record.scope.dispose();
        disposeRecordDOM(record);
      }
      self.records.length = 0;
      return;
    }

    if (showingElse) {
      region.clear();
      self.records.length = 0;
    }

    reconcile({
      records: self.records,
      items,
      collectionType,
      node,
      data,
      scope,
      region,
      renderAST,
      isSVG,
    });
  },

  destroy({ self }) {
    clearRecords(self.records);
  },

  evaluateText({ node, data, renderer }) {
    const items = renderer.lookupExpression(node.over, data) || [];
    const list = isArray(items) ? items : arrayFromObject(items);
    let result = '';
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const eachData = Object.create(data);
      if (node.as) {
        eachData[node.as] = item;
      }
      else {
        Object.assign(eachData, item);
        eachData.this = item;
      }
      eachData[node.indexAs || 'index'] = i;
      result += renderer.evaluateRawTextNodes(node.content, eachData);
    }
    return result;
  },
});

registerBlock('each', eachBlock);

export default eachBlock;
