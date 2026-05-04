/*
  Each-block coordination shared between server and client.

  The server emits `<!--sui-item:v1:KEY-->` markers with keys derived
  from `getItemID`; the client reads those markers in `adoptServerItems`
  and re-derives keys via the same `getItemID` to match. Same for
  `getEachData` (per-item data context shape) — server's `renderEach`
  and client's `createRecord` / `adoptServerItems` must agree.

  This module is the single source of truth for that coordination.
  Either side drifting silently produces hydration mismatches.
*/

import { isPlainObject, isString } from '@semantic-ui/utils';

// Marker prefix for per-item boundaries inside an each block. Server
// writes `<!--sui-item:v1:KEY-->` before each item's content; client's
// adoption walker recognizes this prefix to group server-rendered nodes
// by item.
export const SUI_ITEM_MARKER = 'sui-item:v1:';

// Identity for an item in a list. Server and client must agree or
// adoption misses keys. Result is always a string — Map / === compare
// by value identity, and the server's KEY is always serialized as
// text inside the comment marker.
//
// Order: positional key (object collections), then standard fields
// (_id, id, key, hash, _hash, value), then index fallback.
export function getItemID(item, indexOrKey, collectionType) {
  let raw;
  if (isPlainObject(item)) {
    const key = (collectionType === 'object') ? indexOrKey : undefined;
    raw = key || item._id || item.id || item.key || item.hash || item._hash || item.value || indexOrKey;
  }
  else if (isString(item)) {
    raw = item + ':' + indexOrKey;
  }
  else {
    raw = indexOrKey;
  }
  return String(raw);
}

// Per-item data context shape. The wrapper is always a fresh object so
// Signal.set() sees a new top-level reference and doesn't short-circuit
// on identity. Inner properties are shallow-copied from item (no-`as`
// case) so item-property mutations are captured at the wrapper level.
export function getEachData(item, indexOrKey, collectionType, node) {
  let { as, indexAs } = node;
  if (!indexAs) {
    indexAs = (collectionType === 'array') ? 'index' : 'key';
  }
  if (collectionType === 'object') {
    indexOrKey = item.key;
    item = item.value;
  }
  return as
    ? { [as]: item, [indexAs]: indexOrKey }
    : { ...item, this: item, [indexAs]: indexOrKey };
}

// HTML comment contents cannot contain `--` or `>` (WHATWG spec).
// User-supplied keys may; encode them defensively. URL-encoding covers
// both classes plus `%` itself. Keys are typically IDs (`x1`,
// `user-42`) that don't need encoding, so the overhead is negligible
// in practice.
export function encodeItemKey(key) {
  return encodeURIComponent(String(key ?? ''));
}

// Reverse of encodeItemKey. Falls back to the raw input if decoding
// throws (malformed escape) — preserves whatever the server emitted.
export function decodeItemKey(rawKey) {
  try {
    return decodeURIComponent(rawKey);
  }
  catch {
    return rawKey;
  }
}
