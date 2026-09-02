import { arrayFromObject, isArray, isEmpty } from '@semantic-ui/utils';
import { isBlockClose, isBlockOpen, MARKER_VERSION } from '../../../build-html-string.js';
import { decodeItemKey, getCollectionType, getEachData, getItemId } from '../../../shared/each.js';
import { lisIndices } from '../../../shared/lis.js';
import { defineBlock } from '../define-block.js';
import { ReactiveDataContext } from '../reactive-context.js';
import { markScopeRange } from '../scope-context.js';
import { registerBlock } from './registry.js';

export const SUI_ITEM_MARKER = `sui-item:${MARKER_VERSION}:`;

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

  Each record holds a ReactiveDataContext that exposes per-key Signals
  via a Proxy. The proxy is the data context the item's content renders
  against; reading `proxy.foo` registers a per-key dependency, falling
  through to the parent context on miss. Mutations are detected via a
  per-record snapshot diff. Spread-mode pushes each changed primitive
  through `setKey`; as-mode object items route every wakeup through
  `notifyField` per changed key, fanning out to per-FIELD deps registered
  by the item proxy in ReactiveDataContext.

  Hydrate adopts the server-rendered per-item DOM via
  `<!--sui-item:v1:KEY-->` markers and wires per-item Reactions in
  place — the same "register Reactions on hydrate" contract every
  other block honors.

*/

// Allocate once per record at first reconcile (createSnapshot). On
// subsequent reconciles, refreshSnapshotAndDetect both diffs the item
// against the cached snapshot AND updates the snapshot in place — one
// pass, zero allocation. The common case on update-10th (900 unchanged
// items) pays only a cache-friendly `snapshot.k === item.k` check per
// prop per item.
function createSnapshot(item) {
  if (item === null || typeof item !== 'object') { return item; }
  const snapshot = {};
  for (const key in item) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      snapshot[key] = item[key];
    }
  }
  return snapshot;
}

// Returns the list of changed keys (or null if nothing changed) and
// updates `snapshot` to match `item` in place. Removed keys count as
// changed: heuristic (positional) keying reuses records across logical
// items whose field sets differ — e.g. a filter that spreads `highlight`
// onto matches — and a field the new item lacks must wake its bindings,
// not linger. Callers distinguish removal via `key in item`.
function refreshSnapshotAndDetect(snapshot, item) {
  if (snapshot === null || typeof snapshot !== 'object') { return null; }
  if (item === null || typeof item !== 'object') { return null; }
  let changedKeys = null;
  for (const key in snapshot) {
    if (!Object.prototype.hasOwnProperty.call(item, key)) {
      (changedKeys ??= []).push(key);
      delete snapshot[key];
    }
  }
  for (const key in item) {
    if (!Object.prototype.hasOwnProperty.call(item, key)) { continue; }
    if (snapshot[key] !== item[key]) {
      (changedKeys ??= []).push(key);
      snapshot[key] = item[key];
    }
  }
  return changedKeys;
}

// Remove every node in the half-open range (start, end] — i.e. from
// start.nextSibling through end inclusive. Used by both move (to drain an
// item's content into a fragment for re-insertion) and remove (to tear
// the live item DOM out wholesale). Walking live siblings is what lets
// this handle nested-block mutations correctly: any node between the
// markers right now IS the item's current DOM, regardless of what was
// there at createRecord time.
function removeRangeContent(startMarker, endMarker) {
  let node = startMarker.nextSibling;
  while (node && node !== endMarker) {
    const next = node.nextSibling;
    node.remove();
    node = next;
  }
}

// Move a record's markers + everything between them into `fragment`.
// The record's DOM identity is preserved exactly; no childNodes snapshot
// is used. Captures the first between-marker sibling *before* detaching
// startMarker — once startMarker is in the fragment, its .nextSibling
// would point into the fragment, not the source. After this call, both
// markers and all inner content are in the fragment in original order.
function extractRangeToFragment(startMarker, endMarker, fragment) {
  let node = startMarker.nextSibling;
  fragment.appendChild(startMarker);
  while (node && node !== endMarker) {
    const next = node.nextSibling;
    fragment.appendChild(node);
    node = next;
  }
  fragment.appendChild(endMarker);
}

function clearRecords(records) {
  for (const record of records) {
    record.scope?.dispose();
    if (record.dataContext) { record.dataContext.dispose(); }
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

// For object iteration, items[i] is the {key, value} wrapper from
// arrayFromObject — the snapshot must track the unpacked inner value so
// reconcile's per-FIELD diff sees the same shape bindings observe.
function snapshotForRecord(item, collectionType) {
  return collectionType === 'object' && item != null ? createSnapshot(item.value) : createSnapshot(item);
}

function createRecord({ key, item, index, collectionType, node, data, scope, renderAST, isSVG }) {
  const eachData = getEachData(item, index, collectionType, node);
  const itemScope = scope.child();
  const dataContext = new ReactiveDataContext(data, {
    registerItemContext: true,
    sealKeysAfterReplace: !!node.as,
    asKey: node.as,
  });
  dataContext.replace(eachData);
  const fragment = renderAST({ ast: node.content, data: dataContext.proxy, scope: itemScope, isSVG });
  // Marker-bounded item range: startMarker ... [item content] ... endMarker.
  // These two empty text nodes are the record's only positional identity.
  // Inner blocks never touch them — each nested DynamicRegion owns its own
  // anchor + endAnchor and swaps only the nodes it created.
  const startMarker = document.createTextNode('');
  const endMarker = document.createTextNode('');
  fragment.insertBefore(startMarker, fragment.firstChild);
  fragment.appendChild(endMarker);
  const record = {
    key,
    item,
    index,
    dataContext,
    startMarker,
    endMarker,
    fragment,
    scope: itemScope,
    isElse: false,
    // Captured on creation so the first reconcile pass can detect
    // in-place mutations against a real reference. Refreshed in place
    // by refreshSnapshotAndDetect on each subsequent reconcile.
    snapshot: snapshotForRecord(item, collectionType),
    // True until the record's first reconcile pass. Distinguishes
    // freshly-created records (whose bindings were wired against the
    // current data and have no stale subscribers to wake) from steady-
    // state records (which need notifyKey broadcasts on in-place mutation).
    fresh: true,
  };
  // scope stamps for event-handler resolution
  markScopeRange(startMarker, endMarker, record);
  return record;
}

function disposeRecord(record) {
  // a held record disposes with nothing wired: no scope, no data context
  record.scope?.dispose();
  if (record.dataContext) { record.dataContext.dispose(); }
  disposeRecordDOM(record);
}

// a held record (server DOM between its anchors, nothing wired) meets its
// first data: build the item's context and scope and render into the existing
// markers — the naive update path, aimed at the anchors the hold minted
function materializeRecord(record, { item, index, collectionType, node, data, scope, renderAST, isSVG }) {
  const eachData = getEachData(item, index, collectionType, node);
  const itemScope = scope.child();
  const dataContext = new ReactiveDataContext(data, {
    registerItemContext: true,
    sealKeysAfterReplace: !!node.as,
    asKey: node.as,
  });
  dataContext.replace(eachData);
  const fragment = renderAST({ ast: node.content, data: dataContext.proxy, scope: itemScope, isSVG });
  removeRangeContent(record.startMarker, record.endMarker);
  record.startMarker.after(fragment);
  record.item = item;
  record.index = index;
  record.dataContext = dataContext;
  record.scope = itemScope;
  record.snapshot = snapshotForRecord(item, collectionType);
  record.fresh = false;
  markScopeRange(record.startMarker, record.endMarker, record);
}

// Survivors to leave untouched in Phase 2: the LIS of their old DOM positions.
// Everything off it is the minimal move set. Fresh records (still carrying their
// build fragment) are excluded — they always insert.
function lisKeepSet(records) {
  const positions = [];
  const recordIndex = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (!record || record.fragment) { continue; }
    positions.push(record.index);
    recordIndex.push(i);
  }
  const keep = new Set();
  for (const seqIndex of lisIndices(positions)) {
    keep.add(recordIndex[seqIndex]);
  }
  return keep;
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
// Phase 3: per-key data updates. Ref-changed records refresh their
//          whole context via dataContext.replace(); same-ref records
//          run a snapshot diff and only touch keys that actually
//          mutated.
function reconcile({ records, items, collectionType, node, data, scope, region, renderAST, isSVG }) {
  const oldRecords = records.slice();
  const newKeys = items.map((item, i) => getItemId(item, i, collectionType));
  const newRecords = new Array(items.length);

  let oldHead = 0;
  let oldTail = oldRecords.length - 1;
  let newHead = 0;
  let newTail = items.length - 1;
  let oldKeyToIdx;
  let newKeySet;
  let freshCount = 0;

  while (oldHead <= oldTail && newHead <= newTail) {
    const oldHeadRec = oldRecords[oldHead];
    if (oldHeadRec === null) {
      oldHead++;
      continue;
    }
    const oldTailRec = oldRecords[oldTail];
    if (oldTailRec === null) {
      oldTail--;
      continue;
    }
    if (oldHeadRec.key === newKeys[newHead]) {
      newRecords[newHead++] = oldHeadRec;
      oldHead++;
    }
    else if (oldTailRec.key === newKeys[newTail]) {
      newRecords[newTail--] = oldTailRec;
      oldTail--;
    }
    else if (oldHeadRec.key === newKeys[newTail]) {
      newRecords[newTail--] = oldHeadRec;
      oldHead++;
    }
    else if (oldTailRec.key === newKeys[newHead]) {
      newRecords[newHead++] = oldTailRec;
      oldTail--;
    }
    else {
      if (!oldKeyToIdx) {
        oldKeyToIdx = new Map();
        for (let i = oldHead; i <= oldTail; i++) {
          const rec = oldRecords[i];
          if (rec !== null) { oldKeyToIdx.set(rec.key, i); }
        }
        newKeySet = new Set();
        for (let i = newHead; i <= newTail; i++) { newKeySet.add(newKeys[i]); }
      }
      if (!newKeySet.has(oldHeadRec.key)) {
        disposeRecord(oldHeadRec);
        oldHead++;
      }
      else if (!newKeySet.has(oldTailRec.key)) {
        disposeRecord(oldTailRec);
        oldTail--;
      }
      else {
        const oldIdx = oldKeyToIdx.get(newKeys[newHead]);
        const oldRecord = oldIdx !== undefined ? oldRecords[oldIdx] : null;
        if (oldRecord === null) {
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
          freshCount++;
        }
        else {
          newRecords[newHead] = oldRecord;
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
    freshCount++;
    newHead++;
  }

  while (oldHead <= oldTail) {
    const record = oldRecords[oldHead++];
    if (record !== null) { disposeRecord(record); }
  }

  // Move only records off the LIS of their old DOM positions — minimal moves for
  // any permutation (Vue `getSequence`, inferno). `record.index` still holds the
  // *old* position here: Phase 1 never writes it, Phase 3 does afterward. Fresh
  // records (still carrying their build fragment) always insert. Build the LIS
  // only on a real reorder; otherwise survivors stay ascending and `cursor`'s
  // in-place skip suffices.
  let cursor = region.anchor;
  let reordered = false;
  // Fewer than two survivors can't be out of order, so all-fresh reconciles
  // (replace, create) skip the scan entirely.
  if (items.length - freshCount > 1) {
    let lastOldIndex = -1;
    for (const record of newRecords) {
      if (!record || record.fragment) { continue; }
      if (record.index < lastOldIndex) {
        reordered = true;
        break;
      }
      lastOldIndex = record.index;
    }
  }
  const keep = reordered ? lisKeepSet(newRecords) : null;
  for (let i = 0; i < newRecords.length; i++) {
    const record = newRecords[i];
    if (!record) { continue; }
    if (record.fragment) {
      cursor.after(record.fragment);
      record.fragment = null;
    }
    else if (keep ? !keep.has(i) : record.startMarker.previousSibling !== cursor) {
      const fragment = document.createDocumentFragment();
      extractRangeToFragment(record.startMarker, record.endMarker, fragment);
      cursor.after(fragment);
    }
    cursor = record.endMarker;
  }

  // Phase 3: per-key data updates.
  //
  // As-mode object items take the per-FIELD path: diff fields against
  // the record's snapshot, fire only the changed-field deps via
  // notifyField. Two branches funnel through the same notifyField
  // contract — they differ only in whether values[asKey] needs an
  // explicit update:
  //
  //   - refChanged + same-key match: cloning Signals return fresh refs
  //     every reconcile pass, so refs differ even when the item is the
  //     same logical entity. Phase 1 preserved the record by key match;
  //     update values[asKey] directly (skipping setKey's per-key dep
  //     fire) and notifyField only for fields that actually mutated.
  //
  //   - same-ref + snapshot-diff: reference-mode Signals preserve the
  //     item ref across in-place mutations. values[asKey] is already
  //     correct; the diff fires per-FIELD deps for changed fields.
  //
  // Spread-mode, primitive items, and object iteration take the legacy
  // refChanged / setKey path. Spread mode emits setKey per changed field
  // plus notifyKey('this') for whole-item readers of {this}. Object
  // iteration's per-record value is the {key, value} wrapper from
  // arrayFromObject; getEachData unwraps it into top-level dataContext
  // keys, so the per-FIELD optimization doesn't apply (the "fields" are
  // already at the top level and bindings read them as primitives).
  //
  // Fresh records (just created in this pass) skip the diff because
  // their bindings were wired synchronously against the current values
  // and have no stale subscribers to wake.
  const isArrayAsMode = collectionType === 'array' && !!node.as;
  for (let i = 0; i < newRecords.length; i++) {
    const record = newRecords[i];
    const item = items[i];
    if (record.dataContext === null && !record.isElse) {
      materializeRecord(record, { item, index: i, collectionType, node, data, scope, renderAST, isSVG });
      continue;
    }
    const refChanged = record.item !== item || record.index !== i;
    const isObjectItem = typeof item === 'object' && item !== null;

    if (refChanged && isArrayAsMode && isObjectItem) {
      // Hydrated records arrive at first reconcile with fresh=true and
      // refChanged=true; they need the snapshot diff + notifyField
      // fan-out to wake bindings wired during hydration. In-reconcile-
      // fresh records have refChanged=false by construction (createRecord
      // runs with items[newHead] and the record is placed at
      // newRecords[newHead]), so fresh-status doesn't gate this branch.
      let changedKeys = null;
      if (record.snapshot !== null && typeof record.snapshot === 'object') {
        changedKeys = refreshSnapshotAndDetect(record.snapshot, item);
      }
      else {
        // Prior snapshot was a primitive (item morphed from primitive
        // to object on the same key). Re-snapshot from the new object
        // and fire the per-key dep on the as-key — bindings registered
        // during the primitive period subscribed via trapGet's primitive
        // branch and have no per-FIELD subscriptions yet.
        record.snapshot = createSnapshot(item);
        record.dataContext.notifyKey(node.as);
      }
      record.dataContext.values[node.as] = item;
      record.item = item;
      if (record.index !== i) {
        const indexAs = node.indexAs || (collectionType === 'array' ? 'index' : 'key');
        record.dataContext.setKey(indexAs, i);
        record.index = i;
      }
      if (changedKeys) {
        for (const key of changedKeys) {
          record.dataContext.notifyField(key);
        }
      }
    }
    else if (refChanged) {
      record.dataContext.replace(getEachData(item, i, collectionType, node));
      record.item = item;
      record.index = i;
      // Object iteration in as-mode unpacks {key,value} wrappers into the
      // as-key. When the unpacked value is itself an object, bindings
      // reading entry.X subscribed via the itemProxy and won't wake from
      // setKey's per-key fire. Diff the prior snapshot vs the unpacked
      // value and fire per-FIELD wakeups for changed fields.
      const asValue = node.as ? record.dataContext.values[node.as] : null;
      if (asValue !== null && typeof asValue === 'object') {
        let changedKeys = null;
        if (record.snapshot !== null && typeof record.snapshot === 'object') {
          // refreshSnapshotAndDetect updates the snapshot in place — no need
          // to re-allocate via createSnapshot afterwards.
          changedKeys = refreshSnapshotAndDetect(record.snapshot, asValue);
        }
        else {
          record.snapshot = createSnapshot(asValue);
        }
        if (changedKeys) {
          for (const key of changedKeys) {
            record.dataContext.notifyField(key);
          }
        }
      }
      else {
        record.snapshot = snapshotForRecord(item, collectionType);
      }
    }
    else if (isObjectItem && !record.fresh) {
      if (record.snapshot === null) {
        record.snapshot = createSnapshot(item);
      }
      else {
        const changedKeys = refreshSnapshotAndDetect(record.snapshot, item);
        if (changedKeys) {
          if (isArrayAsMode) {
            for (const key of changedKeys) {
              record.dataContext.notifyField(key);
            }
          }
          else {
            for (const key of changedKeys) {
              if (Object.prototype.hasOwnProperty.call(item, key)) {
                record.dataContext.setKey(key, item[key]);
              }
              else {
                record.dataContext.removeKey(key);
              }
            }
            record.dataContext.notifyKey('this');
          }
        }
      }
    }
    record.fresh = false;
  }

  records.length = 0;
  for (const record of newRecords) { records.push(record); }
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
    dataContext: null,
    startMarker: null,
    endMarker: null,
    scope: elseScope,
    isElse: true,
    snapshot: null,
    fresh: false,
  });
}

function resolveItems(node, lookupExpression) {
  const rawItems = lookupExpression(node.over) || [];
  const collectionType = getCollectionType(rawItems);
  const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;
  return { items, collectionType };
}

// Walk `region.ownedNodes` (server-rendered content between the each block's
// open/close markers) and group nodes by their preceding
// `<!--sui-item:v1:KEY-->` marker. Returns one entry per item:
// { key, startComment, nodes: Node[] }. Nodes exclude the startComment
// itself — they're the item's rendered DOM content.
//
// Nested each blocks inside items emit their own sui-block markers + their
// own sui-item markers inside; depth tracking ensures we only pick up
// outer-level item boundaries.
function extractServerItemGroups(ownedNodes) {
  const groups = [];
  let current = null;
  let blockDepth = 0;

  for (const node of ownedNodes) {
    if (node.nodeType === Node.COMMENT_NODE) {
      const data = node.data;
      if (isBlockOpen(data)) {
        blockDepth++;
        if (current) { current.nodes.push(node); }
        continue;
      }
      if (isBlockClose(data)) {
        blockDepth--;
        if (current) { current.nodes.push(node); }
        continue;
      }
      if (blockDepth === 0 && data.startsWith(SUI_ITEM_MARKER)) {
        if (current) { groups.push(current); }
        const key = decodeItemKey(data.slice(SUI_ITEM_MARKER.length));
        current = { key, startComment: node, nodes: [] };
        continue;
      }
    }
    if (current) { current.nodes.push(node); }
  }
  if (current) { groups.push(current); }
  return groups;
}

// Reuses server-rendered per-item DOM by matching item keys, wiring
// per-item reactivity against the existing nodes via hydrateInnerContent.
// Items with no matching server group render fresh; server groups whose
// keys aren't claimed get disposed. The server unconditionally emits
// `<!--sui-item:v1:KEY-->` markers for non-empty items (server.js); a
// missing-markers shape here means a build/version mismatch.
function adoptServerItems({
  self,
  items,
  collectionType,
  node,
  data,
  scope,
  region,
  renderAST,
  hydrateInnerContent,
  isSVG,
}) {
  const serverGroups = extractServerItemGroups(region.ownedNodes);
  if (serverGroups.length === 0) {
    throw new Error('each.hydrate: server-rendered per-item markers missing — server/client renderer version mismatch');
  }

  const serverByKey = new Map();
  for (const group of serverGroups) { serverByKey.set(group.key, group); }

  const newRecords = [];
  const usedKeys = new Set();
  let insertAfter = region.anchor;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = getItemId(item, i, collectionType);
    const serverGroup = !usedKeys.has(key) ? serverByKey.get(key) : null;

    if (serverGroup) {
      usedKeys.add(key);
      const eachData = getEachData(item, i, collectionType, node);
      const itemScope = scope.child();
      const dataContext = new ReactiveDataContext(data, {
        registerItemContext: true,
        sealKeysAfterReplace: !!node.as,
        asKey: node.as,
      });
      dataContext.replace(eachData);

      // Wire per-item reactivity on the existing DOM. hydrateInnerContent
      // moves the nodes into a temporary fragment, walks with
      // hydrateMarkers against the block's inner entries, and leaves the
      // hydrated nodes in `mutableNodes`.
      const mutableNodes = [...serverGroup.nodes];
      hydrateInnerContent({
        ownedNodes: mutableNodes,
        innerAST: node.content,
        data: dataContext.proxy,
        scope: itemScope,
      });

      // Rewrite the per-item comment marker into the stable empty-text
      // startMarker this block uses at runtime, and add a sibling
      // endMarker after the item content. Both are invisible positional
      // anchors; inner blocks never touch them.
      const startMarker = document.createTextNode('');
      const endMarker = document.createTextNode('');
      if (serverGroup.startComment.parentNode) {
        serverGroup.startComment.replaceWith(startMarker);
      }

      // Sibling block markers can land between item boundaries —
      // reassemble via fragment so endMarker follows the last item node,
      // not whichever node happens to be last.
      const fragment = document.createDocumentFragment();
      fragment.append(startMarker, ...mutableNodes, endMarker);
      insertAfter.after(fragment);
      insertAfter = endMarker;

      const record = {
        key,
        item,
        index: i,
        dataContext,
        startMarker,
        endMarker,
        scope: itemScope,
        isElse: false,
        snapshot: createSnapshot(item),
        // Not fresh: unlike a record created during reconcile, an adopted
        // record's bindings were wired during hydration, so it already
        // carries subscribers that a first in-place field mutation must
        // wake. fresh:true would gate it out of the same-ref snapshot-diff
        // branch and drop that mutation.
        fresh: false,
      };
      markScopeRange(startMarker, endMarker, record);
      newRecords.push(record);
    }
    else {
      const record = createRecord({
        key,
        item,
        index: i,
        collectionType,
        node,
        data,
        scope,
        renderAST,
        isSVG,
      });
      insertAfter.after(record.fragment);
      record.fragment = null;
      insertAfter = record.endMarker;
      newRecords.push(record);
    }
  }

  // Dispose unused server items — their DOM is no longer in the list.
  for (const group of serverGroups) {
    if (usedKeys.has(group.key)) { continue; }
    if (group.startComment.parentNode) { group.startComment.remove(); }
    for (const orphan of group.nodes) {
      if (orphan.parentNode) { orphan.remove(); }
    }
  }

  self.records = newRecords;
}

const eachBlock = defineBlock({
  name: 'each',

  create() {
    return { records: [] };
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

  hydrate({ node, data, scope, region, renderAST, lookupExpression, hydrateInnerContent, hydrateInto, self, isSVG }) {
    const { items, collectionType } = resolveItems(node, lookupExpression);

    if (items.length === 0) {
      const serverGroups = extractServerItemGroups(region.ownedNodes);
      // the server drew items the client cannot resolve yet (a fetch still in
      // flight, a sync snapshot not yet applied). convert each group's comment
      // handshake into the block's own text-node anchors NOW — the durable
      // references every record lives by — and keep the server DOM on screen
      // between them, unwired. the resolveItems read above registered the
      // items dependency, so the first real change reconciles by the server's
      // own keys and renders each item into its anchors exactly like the
      // naive non-SSR update path. a client resolving different data than the
      // server drew is the ordinary hydration-mismatch class, and it heals
      // here the ordinary way: the keyed re-render
      if (serverGroups.length > 0) {
        for (const group of serverGroups) {
          // in place: nothing moves, unlike adoption (whose hydrateInnerContent
          // detaches nodes into a fragment). the anchors take the positions the
          // server's own markup dictates
          const startMarker = document.createTextNode('');
          const endMarker = document.createTextNode('');
          group.startComment.replaceWith(startMarker);
          const lastNode = group.nodes.length > 0 ? group.nodes[group.nodes.length - 1] : startMarker;
          lastNode.after(endMarker);
          const record = {
            key: group.key,
            item: undefined,
            index: -1,
            // no data context and no scope: nothing is wired. the first
            // reconcile renders into the markers and builds both
            dataContext: null,
            startMarker,
            endMarker,
            fragment: null,
            scope: null,
            isElse: false,
            snapshot: null,
            fresh: true,
          };
          self.records.push(record);
        }
        return;
      }
      // no item markers: the server resolved empty too and rendered the else
      // branch (or nothing) — hydrate what it actually drew
      if (node.elseContent) {
        const elseScope = hydrateInto({ innerAST: node.elseContent });
        self.records.push({
          key: null,
          item: null,
          index: -1,
          dataContext: null,
          startMarker: null,
          endMarker: null,
          scope: elseScope,
          isElse: true,
          snapshot: null,
          fresh: false,
        });
      }
      return;
    }

    adoptServerItems({
      self,
      items,
      collectionType,
      node,
      data,
      scope,
      region,
      renderAST,
      hydrateInnerContent,
      isSVG,
    });
  },

  update({ node, data, scope, region, renderAST, lookupExpression, self, isSVG }) {
    const { items, collectionType } = resolveItems(node, lookupExpression);

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
        record.scope?.dispose();
        if (record.dataContext) { record.dataContext.dispose(); }
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
