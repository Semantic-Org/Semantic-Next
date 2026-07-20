/*
  shared each-block helpers used by native + lit so the {#each} contract stays uniform across engines
  pure logic, no DOM or engine primitives
*/

import { Signal } from '@semantic-ui/reactivity';
import { isArray, isPlainObject, isString } from '@semantic-ui/utils';

export function getCollectionType(items) {
  return isArray(items) ? 'array' : 'object';
}

// Stringified — Map / === compare by value identity, and the server's
// KEY is always serialized as text inside the comment marker.
export function getItemId(item, indexOrKey, collectionType) {
  let raw;
  if (isPlainObject(item)) {
    const key = (collectionType === 'object') ? indexOrKey : undefined;
    // key is the object positional index — a 0 falls through (||) to the
    // shared id resolver, so each + signals key items the same way
    raw = key || (Signal.id(item) ?? indexOrKey);
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
