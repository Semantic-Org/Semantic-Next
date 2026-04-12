import { Signal } from '@semantic-ui/reactivity';
import { arrayFromObject, isArray, isEmpty, isPlainObject, isString } from '@semantic-ui/utils';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  {#each items as item} — keyed list reconciliation with per-item reactive
  data channels. Each item renders into its own DynamicRegion-independent
  ownedNodes slice; a Signal carries the item's data context so mutations
  flow into the item's inner Reactions without re-rendering the list.

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
  Fix (4) — hydration-bypass / per-item server markers — lands in step 9.
  Step-6 hydrate registers deps and preserves server DOM until the first
  data change, which clears region and re-renders from scratch.

*/

// Proxies created by this module go into the WeakSet; template.js checks
// membership to decide when expression reads should register deps directly
// (item context) versus wrapping in Reaction.nonreactive (static data).
const itemContextProxies = new WeakSet();
export function isItemContext(data) {
  return data != null && itemContextProxies.has(data);
}

const EACH_ITEM_OPEN = 'sui-each-item:v1:';
const EACH_ITEM_CLOSE = '/sui-each-item:v1:';

// Walk a flat nodes list looking for <!--sui-each-item:v1:N-->...
// <!--/sui-each-item:v1:N--> pairs. Returns one slice per opening marker
// (inner nodes only; marker comments are collected separately and removed
// from the DOM). Handles nested block markers by depth-tracking so a
// nested {#each} doesn't confuse the walker.
function extractItemSlices(ownedNodes) {
  const slices = [];
  const markersToRemove = [];
  let currentSlice = null;
  let depth = 0;

  for (const node of ownedNodes) {
    if (node.nodeType === Node.COMMENT_NODE) {
      const data = node.data;
      if (data.startsWith(EACH_ITEM_OPEN)) {
        if (depth === 0) {
          currentSlice = [];
          markersToRemove.push(node);
          depth = 1;
          continue;
        }
        depth++;
      }
      else if (data.startsWith(EACH_ITEM_CLOSE)) {
        depth--;
        if (depth === 0) {
          slices.push(currentSlice);
          currentSlice = null;
          markersToRemove.push(node);
          continue;
        }
      }
    }
    if (currentSlice) {
      currentSlice.push(node);
    }
  }

  for (const m of markersToRemove) { m.remove(); }
  return slices;
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

function clearRecords(records) {
  for (const record of records) {
    record.scope.dispose();
    for (const n of record.nodes) { n.remove(); }
  }
  records.length = 0;
}

// Build a key → record index map for O(1) lookup during reconciliation.
// Rebuilt every run — cheap because records is the source of truth.
function buildKeyIndex(records) {
  const idx = new Map();
  for (const record of records) {
    if (!record.isElse) { idx.set(record.key, record); }
  }
  return idx;
}

// Reconcile records against new items. Mutates records in place.
function reconcile({ records, items, collectionType, node, data, scope, region, renderAST, isSVG }) {
  const keyIndex = buildKeyIndex(records);
  const newKeys = items.map((item, i) => getItemID(item, i, collectionType));
  const newKeySet = new Set(newKeys);

  // Drop records whose keys are no longer present.
  for (let i = records.length - 1; i >= 0; i--) {
    const record = records[i];
    if (record.isElse || !newKeySet.has(record.key)) {
      record.scope.dispose();
      for (const n of record.nodes) { n.remove(); }
      records.splice(i, 1);
    }
  }

  // Rebuild index after deletions.
  keyIndex.clear();
  for (const r of records) { keyIndex.set(r.key, r); }

  let insertAfter = region.anchor;
  const reordered = [];

  for (let i = 0; i < newKeys.length; i++) {
    const key = newKeys[i];
    const item = items[i];
    const existing = keyIndex.get(key);

    if (existing) {
      const eachData = getEachData(item, i, collectionType, node);
      const prevItem = existing.item;
      const prevIndex = existing.index;

      if (prevItem !== item || prevIndex !== i) {
        existing.itemSignal.set(eachData);
      }
      else if (typeof item === 'object') {
        // Same ref at same position — isEqual short-circuits on a === b,
        // so explicit notify is the only way in-place mutations propagate.
        existing.itemSignal.notify();
      }

      existing.item = item;
      existing.index = i;

      // Move DOM if position changed.
      const firstNode = existing.nodes[0];
      if (firstNode && firstNode.previousSibling !== insertAfter) {
        for (const n of existing.nodes) {
          insertAfter.after(n);
          insertAfter = n;
        }
      }
      else if (existing.nodes.length > 0) {
        insertAfter = existing.nodes[existing.nodes.length - 1];
      }

      reordered.push(existing);
    }
    else {
      const eachData = getEachData(item, i, collectionType, node);
      const itemScope = scope.child();
      const itemSignal = new Signal(eachData, { allowClone: false });
      const itemProxy = createItemDataProxy(data, itemSignal);

      const fragment = renderAST({ ast: node.content, data: itemProxy, scope: itemScope, isSVG });
      const nodes = [...fragment.childNodes];
      insertAfter.after(fragment);
      if (nodes.length > 0) {
        insertAfter = nodes[nodes.length - 1];
      }

      reordered.push({
        key,
        item,
        index: i,
        itemSignal,
        nodes,
        scope: itemScope,
        isElse: false,
      });
    }
  }

  records.length = 0;
  records.push(...reordered);
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
    nodes: [...region.ownedNodes],
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

  hydrate({ node, data, scope, region, renderAST, lookupExpression, hydrateInnerContent, self, isSVG }) {
    const { items, collectionType } = resolveItems(node, lookupExpression);

    // Empty + else-content: server rendered elseContent as a single block.
    // Claim it as a singleton else record.
    if (isEmpty(items) && node.elseContent) {
      if (region.ownedNodes.length > 0) {
        const elseScope = scope.child();
        region.childScopes.push(elseScope);
        hydrateInnerContent({ ownedNodes: region.ownedNodes, innerAST: node.elseContent, data, scope: elseScope });
        const frag = document.createDocumentFragment();
        for (const n of region.ownedNodes) { frag.appendChild(n); }
        region.anchor.after(frag);
        self.records.push({
          key: null,
          item: null,
          index: -1,
          itemSignal: null,
          nodes: [...region.ownedNodes],
          scope: elseScope,
          isElse: true,
        });
      }
      return;
    }

    // Normal case: parse per-item markers and claim each slice.
    const itemSlices = extractItemSlices(region.ownedNodes);

    // Legacy-server fallback: no per-item markers present (pre-step-9 server
    // output). Preserve the pre-existing "nuke-and-rerender on first data
    // change" semantics by deferring to update().
    if (itemSlices.length === 0 && items.length > 0) {
      self.hasHydrated = true;
      return;
    }

    // Positional 1-to-1 claim: each client item gets the slice at the same
    // index. Count mismatches (items.length !== itemSlices.length) are
    // handled defensively — extras on either side get a fresh render or
    // dispose after the claimed prefix. See plan §ServerRenderer's note
    // on mismatch recovery.
    const claimCount = Math.min(items.length, itemSlices.length);
    const outerFrag = document.createDocumentFragment();

    for (let i = 0; i < claimCount; i++) {
      const itemNodes = itemSlices[i];
      const item = items[i];
      const key = getItemID(item, i, collectionType);
      const eachData = getEachData(item, i, collectionType, node);
      const itemScope = scope.child();
      const itemSignal = new Signal(eachData, { allowClone: false });
      const itemProxy = createItemDataProxy(data, itemSignal);

      hydrateInnerContent({ ownedNodes: itemNodes, innerAST: node.content, data: itemProxy, scope: itemScope });
      for (const n of itemNodes) { outerFrag.appendChild(n); }

      self.records.push({
        key,
        item,
        index: i,
        itemSignal,
        nodes: itemNodes,
        scope: itemScope,
        isElse: false,
      });
    }

    // Dispose any excess slices — server rendered more items than the
    // client sees. The slices' content is orphaned in hydrateInnerContent's
    // containers via an earlier call or never claimed; explicitly remove
    // any leftover DOM.
    for (let i = claimCount; i < itemSlices.length; i++) {
      for (const n of itemSlices[i]) {
        if (n.parentNode) { n.remove(); }
      }
    }

    region.anchor.after(outerFrag);

    // Fresh-render any items the server didn't emit — client has more
    // items than slices. Append after the last claimed item's nodes.
    if (items.length > itemSlices.length) {
      let insertAfter = self.records.length > 0
        ? self.records[self.records.length - 1].nodes.at(-1) || region.anchor
        : region.anchor;
      for (let i = itemSlices.length; i < items.length; i++) {
        const item = items[i];
        const key = getItemID(item, i, collectionType);
        const eachData = getEachData(item, i, collectionType, node);
        const itemScope = scope.child();
        const itemSignal = new Signal(eachData, { allowClone: false });
        const itemProxy = createItemDataProxy(data, itemSignal);

        const fragment = renderAST({ ast: node.content, data: itemProxy, scope: itemScope, isSVG });
        const nodes = [...fragment.childNodes];
        insertAfter.after(fragment);
        if (nodes.length > 0) { insertAfter = nodes[nodes.length - 1]; }

        self.records.push({
          key,
          item,
          index: i,
          itemSignal,
          nodes,
          scope: itemScope,
          isElse: false,
        });
      }
    }
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

    if (isEmpty(items) && node.elseContent) {
      if (!showingElse) {
        renderElse({ records: self.records, node, data, scope, region, renderAST, isSVG });
      }
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
