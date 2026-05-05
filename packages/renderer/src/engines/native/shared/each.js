/*
  Each-block coordination shared between server and client. Both sides
  must agree on item key, item-data shape, and marker encoding or hydration
  silently mismatches.
*/

import { isPlainObject, isString } from '@semantic-ui/utils';

import { MARKER_VERSION } from '../../../build-html-string.js';

export const SUI_ITEM_MARKER = `sui-item:${MARKER_VERSION}:`;

// Stringified — Map / === compare by value identity, and the server's
// KEY is always serialized as text inside the comment marker.
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

// Wrapper is always a fresh object so Signal.set() sees a new top-level
// reference and doesn't short-circuit on identity.
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

// HTML comment contents cannot contain `--` or `>` (WHATWG spec); user
// keys may. URL-encoding covers both plus `%`.
export function encodeItemKey(key) {
  return encodeURIComponent(String(key ?? ''));
}

// Falls back to raw input if decoding throws (malformed escape) so the
// roundtrip can't strand the value mid-flight.
export function decodeItemKey(rawKey) {
  try {
    return decodeURIComponent(rawKey);
  }
  catch {
    return rawKey;
  }
}
