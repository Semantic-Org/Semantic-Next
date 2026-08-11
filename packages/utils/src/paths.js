import { createCache } from './cache.js';
import { isDevelopment } from './environment.js';
import { configured } from './functions.js';
import { isArray, isObject } from './types.js';

/*-------------------
       Paths
--------------------*/

/*
  The path grammar's one home: dot-joined parts, [2] positional and [#key]
  keyed array indexes, '*' the pattern wildcard. A key carries any character
  except ']'. Addressing (get/set/has/unset), spelling (keyedPath), traversal
  (splitPath, eachPath, parsePath), building (pathFrom, elementPath),
  relations (pathCovers, pathsOverlap), and expansion (expandPath) all read
  one boundary rule — one lexer, each consumer collapses the detail it
  doesn't need.
*/

// the identity fields a keyed array element is matched on, first present wins —
// identity of an array element, shared by every keyed helper, vocabulary adjustable at boot
export const elementKey = /* @__PURE__ */ configured(
  (item, keys = elementKey.config.keys) => {
    if (!isObject(item)) {
      return undefined;
    }
    // fast track the default vocabulary, a static chain instead of the field loop
    if (keys.length === 4 && keys[0] === 'id' && keys[1] === '_id' && keys[2] === 'hash' && keys[3] === 'key') {
      return item.id ?? item._id ?? item.hash ?? item.key;
    }
    for (const field of keys) {
      if (item[field] != null) {
        return item[field];
      }
    }
    return undefined;
  },
  { keys: ['id', '_id', 'hash', 'key'] },
);

// resolve a keyed array segment to a live index, -1 if absent. identity compares
// String-coerced because the path carries a string and ids may be number or string
const findKeyed = (array, keyValue, keys = elementKey.config.keys) => {
  if (!isArray(array)) {
    return -1;
  }
  for (let i = 0; i < array.length; i++) {
    const id = elementKey(array[i], keys);
    if (id != null && String(id) === keyValue) {
      return i;
    }
  }
  return -1;
};

/*
  A key can ride the dot-bracket path grammar unless it carries ']', the one
  character that closes a keyed selector. Dots, '@', '[' and a leading '#'
  all round-trip (items[#jack@semantic-ui.com]). The guard for a key that
  exists before any item does — a user-typed id at a form boundary.
*/
export const isPathKey = (key) => String(key).indexOf(']') === -1;

/*
  An element's key as it can appear in a path — the text between [# and ] —
  or null when the element is unkeyed or its key can't ride the grammar.
  The item-to-path route: every keyed path the emitters produce goes
  through this check, so an emitted path always parses back through get.
*/
export const pathKey = (item, keys = elementKey.config.keys) => {
  const id = elementKey(item, keys);
  if (id == null) {
    return null;
  }
  const key = String(id);
  return isPathKey(key) ? key : null;
};

const INDEX_SEGMENT = /^\d+$/;
const isIndexSegment = (part) => INDEX_SEGMENT.test(part);

// a bracket segment resolves to a keyed selector (field[#identity]) or a
// numeric positional index (field[2]). null for a malformed segment — an
// unclosed bracket, or a positional body that isn't a whole index — which
// every caller treats as addressing nothing
const extractBracketAccess = (part) => {
  const bracketIndex = part.indexOf('[');
  const closeIndex = part.indexOf(']', bracketIndex + 1);
  if (closeIndex === -1) {
    return null;
  }
  const key = part.substring(0, bracketIndex);
  const body = part.substring(bracketIndex + 1, closeIndex);
  // a leading # marks a keyed element selector; the identity rides as a raw string value
  if (body.charCodeAt(0) === 35) {
    return { key, keyValue: body.slice(1) };
  }
  if (!isIndexSegment(body)) {
    return null;
  }
  return { key, index: parseInt(body, 10) };
};

// the segment split under every path walk. a dot inside a bracket belongs to
// the identity (items[#jack@semantic-ui.com].role), so '[' fast-forwards to
// its ']' and only outside dots separate segments
export const splitPath = (path) => {
  if (path.indexOf('[') === -1) {
    return path.split('.');
  }
  const parts = [];
  let start = 0;
  for (let i = 0; i < path.length; i++) {
    const char = path[i];
    if (char === '[') {
      const close = path.indexOf(']', i + 1);
      if (close === -1) {
        break;
      }
      i = close;
    }
    else if (char === '.') {
      parts.push(path.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(path.slice(start));
  return parts;
};

/*
  Walk the paths a path passes through, shortest first — 'todos[#a].done'
  visits 'todos', 'todos[#a]', 'todos[#a].done'. Every visited value is itself
  a resolvable path: a bracket splits its segment into container and element,
  and a dot inside a keyed id is identity, never a boundary. Pass self: false
  to visit only the ancestors above the target. Returning false stops the
  walk, like each.
*/
export const eachPath = (path, callback, { self = true } = {}) => {
  let index = 0;
  for (let i = 0; i < path.length; i++) {
    const char = path[i];
    if (char === '[') {
      if (i > 0 && callback(path.slice(0, i), index++, path) === false) {
        return path;
      }
      const close = path.indexOf(']', i + 1);
      if (close === -1) {
        break;
      }
      i = close;
    }
    else if (char === '.') {
      if (i > 0 && callback(path.slice(0, i), index++, path) === false) {
        return path;
      }
    }
  }
  if (self && path !== '') {
    callback(path, index, path);
  }
  return path;
};

// the one walk under get and has. resolves the dot-bracket grammar to the
// stored value, MISSING when the path never lands on one. a stored undefined
// resolves as undefined, so has can tell it apart from a missing path
const MISSING = Symbol('missing');

const resolvePath = (obj, path, keys) => {
  if (obj === null || !isObject(obj)) {
    return MISSING;
  }

  const parts = splitPath(path);
  let currentObject = obj;
  let pathOffset = 0;

  for (let i = 0; i < parts.length; i++) {
    if (currentObject === null || !isObject(currentObject)) {
      return MISSING;
    }

    const part = parts[i];

    if (part.includes('[')) {
      const access = extractBracketAccess(part);
      if (access === null) {
        return MISSING;
      }
      // an empty key ([0].x against an array root) addresses the current value as the array
      const array = access.key === '' ? currentObject : currentObject[access.key];
      if (!isArray(array)) {
        return MISSING;
      }
      const index = 'keyValue' in access ? findKeyed(array, access.keyValue, keys) : access.index;
      if (index < 0 || index >= array.length) {
        return MISSING;
      }
      currentObject = array[index];
    }
    else if (part in currentObject) {
      currentObject = currentObject[part];
    }
    else {
      // an existing literal dotted key wins, the whole remainder first (obj['a.b.c'])
      const remainingPath = path.substring(pathOffset);
      if (remainingPath in currentObject) {
        currentObject = currentObject[remainingPath];
        break;
      }
      // then this and the next part combined (obj['a.b'])
      const combinedKey = `${part}.${parts[i + 1]}`;
      if (combinedKey in currentObject) {
        currentObject = currentObject[combinedKey];
        i++;
        // the loop footer advances past the first part only, cover the consumed second
        pathOffset += parts[i].length + 1;
      }
      else {
        return MISSING;
      }
    }

    pathOffset += part.length + 1;
  }

  return currentObject;
};

/*
  Access a nested object field from a string, like 'a.b.c'
*/
export const get = function(obj, path = '', keys = elementKey.config.keys) {
  if (typeof path !== 'string') {
    return undefined;
  }
  // simple property access — no dots, no brackets
  if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
    return (obj !== null && isObject(obj)) ? obj[path] : undefined;
  }
  const value = resolvePath(obj, path, keys);
  return value === MISSING ? undefined : value;
};

/*
  Existence twin of get — true when the path resolves to a real location,
  even one holding undefined. get() conflates a missing path with a stored
  undefined, has() is how callers tell them apart.
*/
export const has = function(obj, path = '', keys = elementKey.config.keys) {
  if (typeof path !== 'string') {
    return false;
  }
  // simple property access — no dots, no brackets
  if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
    return obj !== null && isObject(obj) && path in obj;
  }
  return resolvePath(obj, path, keys) !== MISSING;
};

// set and unset act only on a real path into a real object, and refuse
// prototype pollution (__proto__ and friends)
const CLIMBS_PROTOTYPE = /(^|\.|\[)(__proto__|constructor|prototype)(\.|\[|\]|$)/;

// a keyed id is an opaque identity, never a property access, so guards that
// read path structure see it blanked (users[#mail.constructor.dev].role passes)
const KEYED_ID = /\[#[^\]]*\]/g;
const pathShape = (path) => path.indexOf('[#') === -1 ? path : path.replace(KEYED_ID, '[]');

const isWritablePath = (obj, path) =>
  typeof path === 'string' && path !== '' && obj !== null && isObject(obj)
  && !CLIMBS_PROTOTYPE.test(pathShape(path));

/*
  Set a nested object field from a string path, the write twin of get, so
  paths from trackWrites and detectChanges apply back. Creates missing
  intermediates — arrays when the next segment is an index, objects otherwise.
*/
export const set = function(obj, path, value, keys = elementKey.config.keys) {
  if (!isWritablePath(obj, path)) {
    return obj;
  }

  // simple property access — no dots, no brackets
  if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
    obj[path] = value;
    return obj;
  }

  const parts = splitPath(path);
  let currentObject = obj;
  let pathOffset = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;

    if (part.includes('[')) {
      const access = extractBracketAccess(part);
      if (access === null) {
        return obj;
      }
      let array;
      if (access.key === '') {
        // an empty key addresses the current value as the array; it can't be vivified in place
        if (!isArray(currentObject)) {
          return obj;
        }
        array = currentObject;
      }
      else {
        if (!isArray(currentObject[access.key])) {
          currentObject[access.key] = [];
        }
        array = currentObject[access.key];
      }
      if ('keyValue' in access) {
        const index = findKeyed(array, access.keyValue, keys);
        if (isLast) {
          if (index === -1) {
            array.push(value); // keyed add: an absent key appends a new element
          }
          else {
            array[index] = value; // keyed replace: a present key overwrites in place
          }
          return obj;
        }
        if (index === -1) {
          return obj; // a field write to a vanished element is a no-op
        }
        currentObject = array[index];
      }
      else {
        const { index } = access;
        if (isLast) {
          array[index] = value;
          return obj;
        }
        if (array[index] === null || !isObject(array[index])) {
          array[index] = isIndexSegment(parts[i + 1]) ? [] : {};
        }
        currentObject = array[index];
      }
    }
    else if (isLast) {
      currentObject[part] = value;
      return obj;
    }
    else {
      if (!(part in currentObject)) {
        // an existing literal dotted key wins over creating intermediates,
        // mirroring get()'s resolution
        const remainingPath = path.substring(pathOffset);
        if (remainingPath in currentObject) {
          currentObject[remainingPath] = value;
          return obj;
        }
        const combinedKey = `${part}.${parts[i + 1]}`;
        if (combinedKey in currentObject) {
          if (currentObject[combinedKey] === null || !isObject(currentObject[combinedKey])) {
            currentObject[combinedKey] = isIndexSegment(parts[i + 2]) ? [] : {};
          }
          currentObject = currentObject[combinedKey];
          pathOffset += combinedKey.length + 1;
          i++;
          continue;
        }
      }
      if (currentObject[part] === null || !isObject(currentObject[part])) {
        currentObject[part] = isIndexSegment(parts[i + 1]) ? [] : {};
      }
      currentObject = currentObject[part];
    }

    pathOffset += part.length + 1;
  }

  return obj;
};

/*
  Remove a nested object field from a string path, the delete twin of get/set.
  A missing path is a no-op, and a removed array index leaves a hole rather
  than splicing, so sibling index paths stay valid when applying several
  removals at once.
*/
export const unset = function(obj, path, keys = elementKey.config.keys) {
  if (!isWritablePath(obj, path)) {
    return obj;
  }

  // simple property access — no dots, no brackets
  if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
    delete obj[path];
    return obj;
  }

  const parts = splitPath(path);
  let currentObject = obj;
  let pathOffset = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;

    if (part.includes('[')) {
      const access = extractBracketAccess(part);
      if (access === null) {
        return obj;
      }
      const array = access.key === '' ? currentObject : currentObject[access.key];
      if (!isArray(array)) {
        return obj;
      }
      if ('keyValue' in access) {
        const index = findKeyed(array, access.keyValue, keys);
        if (index === -1) {
          return obj;
        }
        if (isLast) {
          array.splice(index, 1); // keyed removal splices: no positional siblings to keep valid
          return obj;
        }
        currentObject = array[index];
      }
      else {
        const { index } = access;
        if (isLast) {
          delete array[index];
          return obj;
        }
        currentObject = array[index];
      }
    }
    else if (isLast) {
      delete currentObject[part];
      return obj;
    }
    else if (part in currentObject) {
      currentObject = currentObject[part];
    }
    else {
      // an existing literal dotted key wins, mirroring get()'s resolution
      const remainingPath = path.substring(pathOffset);
      if (remainingPath in currentObject) {
        delete currentObject[remainingPath];
        return obj;
      }
      const combinedKey = `${part}.${parts[i + 1]}`;
      if (combinedKey in currentObject) {
        currentObject = currentObject[combinedKey];
        if (currentObject === null || !isObject(currentObject)) {
          return obj;
        }
        pathOffset += combinedKey.length + 1;
        i++;
        continue;
      }
      return obj;
    }

    if (currentObject === null || !isObject(currentObject)) {
      return obj;
    }
    pathOffset += part.length + 1;
  }

  return obj;
};

// a path can address an identity-bearing array element two ways: by position (items.0.qty) or by
// key (items[#a].qty). the positional spelling is only stable while the array doesn't move;
// keyedPath resolves it to the keyed spelling against a live object, rewriting each positional
// segment whose element carries a path-safe identity. returns the input string itself when
// nothing rewrites, so callers compare by reference
const HAS_POSITIONAL_SEGMENT = /(^|\.|\[)\d/;

export const keyedPath = (obj, path, keys = elementKey.config.keys) => {
  // the probe reads pathShape so a digit inside a keyed id (items[#200.40.50])
  // doesn't look like a positional segment
  if (typeof path !== 'string' || !HAS_POSITIONAL_SEGMENT.test(pathShape(path)) || obj === null || !isObject(obj)) {
    return path;
  }
  const parts = splitPath(path);
  // a leading index means the root itself is an array; get/set cannot parse a leading bracket, so
  // that spelling stays positional
  if (isIndexSegment(parts[0])) {
    return path;
  }
  const out = [];
  let currentObject = obj;
  let changed = false;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (currentObject === null || !isObject(currentObject)) {
      return path;
    }
    if (part.includes('[')) {
      const access = extractBracketAccess(part);
      if (access === null) {
        return path;
      }
      const array = currentObject[access.key];
      if (!isArray(array)) {
        return path;
      }
      const index = 'keyValue' in access ? findKeyed(array, access.keyValue, keys) : access.index;
      const element = array[index];
      if ('keyValue' in access) {
        out.push(part);
      }
      else {
        const keyValue = pathKey(element, keys);
        if (keyValue !== null) {
          out.push(`${access.key}[#${keyValue}]`);
          changed = true;
        }
        else {
          out.push(part);
        }
      }
      currentObject = element;
    }
    else if (isIndexSegment(part) && isArray(currentObject)) {
      const element = currentObject[Number(part)];
      const keyValue = pathKey(element, keys);
      if (keyValue !== null) {
        out[out.length - 1] += `[#${keyValue}]`;
        changed = true;
      }
      else {
        out.push(part);
      }
      currentObject = element;
    }
    else if (part in currentObject) {
      out.push(part);
      currentObject = currentObject[part];
    }
    else {
      // an unresolvable segment (including get()'s literal dotted-key forms) holds no positional
      // rewrite; leave the spelling alone
      return path;
    }
  }
  return changed ? out.join('.') : path;
};

const BRACKET_BODY = /\[([^\]]*)\]/g;

// one dot-part into segments, false when the part is malformed — empty, an
// unclosed bracket, trailing text after a bracket, or a positional body that
// isn't a whole index. a segment can chain brackets (a[#x][#y]), and [^\]]*
// is exact because ']' is the one character a key can't carry
const lexSegment = (part, segments) => {
  if (part === '*') {
    segments.push({ type: 'wildcard' });
    return true;
  }
  const bracket = part.indexOf('[');
  if (bracket === -1) {
    if (part === '') {
      return false;
    }
    segments.push(
      isIndexSegment(part)
        ? { type: 'index', index: Number(part) }
        : { type: 'field', name: part },
    );
    return true;
  }
  if (bracket > 0) {
    segments.push({ type: 'field', name: part.slice(0, bracket) });
  }
  BRACKET_BODY.lastIndex = bracket;
  let cursor = bracket;
  let match;
  while ((match = BRACKET_BODY.exec(part)) !== null) {
    if (match.index !== cursor) {
      return false;
    }
    const body = match[1];
    if (body === '*') {
      segments.push({ type: 'wildcard' });
    }
    else if (body.charCodeAt(0) === 35) {
      segments.push({ type: 'key', key: body.slice(1) });
    }
    else if (isIndexSegment(body)) {
      segments.push({ type: 'index', index: Number(body) });
    }
    else {
      return false;
    }
    cursor = match.index + match[0].length;
  }
  return cursor === part.length;
};

// parsed paths repeat heavily on hot fan paths, and client-minted keys make
// the input space adversarial — a bounded cache, sized via parsePath.config
let segmentCache = null;

/*
  Parse a path into its segments — { type: 'field', name }, { type: 'key', key },
  { type: 'index', index }, { type: 'wildcard' } — the semantic reading beside
  splitPath's textual one. null when the path doesn't parse, so a relation
  over garbage reads as no relation. Results are cached and shared: treat
  returned segments as immutable (frozen in development).
*/
export const parsePath = /* @__PURE__ */ configured(
  (path) => {
    if (typeof path !== 'string') {
      return null;
    }
    segmentCache ??= createCache({ maxSize: parsePath.config.cacheSize });
    let segments = segmentCache.get(path);
    if (segments === undefined) {
      segments = [];
      if (path !== '') {
        for (const part of splitPath(path)) {
          if (!lexSegment(part, segments)) {
            segments = null;
            break;
          }
        }
      }
      if (isDevelopment && segments !== null) {
        for (const segment of segments) {
          Object.freeze(segment);
        }
        Object.freeze(segments);
      }
      segmentCache.set(path, segments);
    }
    return segments;
  },
  { cacheSize: 4096 },
);

// one segment appended to a path under the emission contract: fields,
// positional indexes, and wildcards join with dots, keys append as [#key]
const appendSegment = (path, segment) => {
  if (typeof segment === 'string') {
    return path === '' ? segment : `${path}.${segment}`;
  }
  if (segment.type === 'key') {
    return `${path}[#${segment.key}]`;
  }
  let text;
  if (segment.type === 'field') {
    text = segment.name;
  }
  else if (segment.type === 'index') {
    text = String(segment.index);
  }
  else {
    text = '*';
  }
  return path === '' ? text : `${path}.${text}`;
};

/*
  The path from segments — the inverse of parsePath, and of splitPath: the
  array may mix parsed segments and plain segment strings. Positional indexes
  emit the dot form (items.2), so pathFrom(parsePath(path)) normalizes a
  bracket spelling rather than preserving it.
*/
export const pathFrom = (segments) => {
  let path = '';
  for (const segment of segments) {
    path = appendSegment(path, segment);
  }
  return path;
};

/*
  The path of one element under a list path — by key in the [#key] form, by
  index in the dot form. The birth point of a path from raw data, so the key
  contract is enforced here: a key carrying ']' throws instead of emitting a
  path nothing can parse. Route items through pathKey first.
*/
export const elementPath = (listPath, { key, index } = {}) => {
  if (key !== undefined) {
    const keyText = String(key);
    if (!isPathKey(keyText)) {
      throw new TypeError(
        `elementPath: key '${keyText}' can't appear in a path — a key carries any character except ']'`,
      );
    }
    return `${listPath}[#${keyText}]`;
  }
  if (index !== undefined) {
    return listPath === '' ? String(index) : `${listPath}.${index}`;
  }
  throw new TypeError('elementPath: pass { key } or { index } to address an element');
};

// one segment against one segment. a wildcard matches any single segment;
// keyed and positional indexes stay apart ([#7] never means [7])
const segmentMatches = (a, b) => {
  if (a.type === 'wildcard' || b.type === 'wildcard') {
    return true;
  }
  if (a.type !== b.type) {
    return false;
  }
  if (a.type === 'field') {
    return a.name === b.name;
  }
  return a.type === 'key' ? a.key === b.key : a.index === b.index;
};

/*
  Does path a cover path b — b at or under a, segment-aligned: 'contact'
  covers 'contact.taxId' but never 'contacts', 'items' covers
  'items[#r7].amount', 'lines.*.cost' covers 'lines[#a].cost'. The one
  covering relation a projection, a write guard, and an invalidation check
  all read.
*/
export const pathCovers = (a, b) => {
  if (a === b) {
    return true;
  }
  const aSegments = parsePath(a);
  const bSegments = parsePath(b);
  if (aSegments === null || bSegments === null || aSegments.length > bSegments.length) {
    return false;
  }
  for (let i = 0; i < aSegments.length; i++) {
    if (!segmentMatches(aSegments[i], bSegments[i])) {
      return false;
    }
  }
  return true;
};

/*
  Do two paths lie on one line — a at or under b, or b at or under a, with
  segment alignment ('items' overlaps 'items[#r7].amount', never 'itemsLog').
*/
export const pathsOverlap = (a, b) => {
  const aSegments = parsePath(a);
  const bSegments = parsePath(b);
  if (aSegments === null || bSegments === null) {
    return false;
  }
  const shared = Math.min(aSegments.length, bSegments.length);
  for (let i = 0; i < shared; i++) {
    if (!segmentMatches(aSegments[i], bSegments[i])) {
      return false;
    }
  }
  return true;
};

/*
  Collapse a concrete path to its pattern spelling — lines[#a].tax becomes
  lines.*.tax — so per-element paths group under one dependency pattern.
  A path that doesn't parse passes through unchanged.
*/
export const patternFrom = (path) => {
  const segments = parsePath(path);
  if (segments === null) {
    return path;
  }
  return segments.map((segment) => segment.type === 'field' ? segment.name : '*').join('.');
};

/*
  Expand a path spelling into the concrete paths it addresses, always as an
  array. A leading-dot relative spelling resolves against { from } — '..tax'
  from 'lines[#a].qty' is 'lines[#a].tax', each dot stripping one trailing
  segment, a keyed segment counting one like any other. A '*' enumerates the
  array at that level of { doc }: an element with a path key takes the [#key]
  spelling so a derived write respects a keyed override, a keyless element
  stays positional, and a level that isn't an array contributes nothing.
  Both spellings compose in one call. A path with neither returns itself as
  one element, so callers destructure uniformly.
*/
export const expandPath = (path, { from, doc, keys = elementKey.config.keys } = {}) => {
  if (typeof path !== 'string') {
    throw new TypeError('expandPath: path must be a string');
  }
  let absolute = path;
  if (path.charCodeAt(0) === 46) {
    if (typeof from !== 'string') {
      throw new TypeError(`expandPath: the relative path '${path}' needs { from } to resolve against`);
    }
    let depth = 1;
    while (path.charCodeAt(depth) === 46) {
      depth += 1;
    }
    const suffix = path.slice(depth);
    const fromSegments = parsePath(from);
    if (fromSegments === null) {
      throw new TypeError(`expandPath: can't parse the from path '${from}'`);
    }
    const prefix = pathFrom(fromSegments.slice(0, Math.max(0, fromSegments.length - depth)));
    if (prefix === '' || suffix === '') {
      absolute = prefix || suffix;
    }
    else {
      absolute = `${prefix}.${suffix}`;
    }
  }
  const segments = parsePath(absolute);
  if (segments === null) {
    throw new TypeError(`expandPath: can't parse the path '${absolute}'`);
  }
  if (!segments.some((segment) => segment.type === 'wildcard')) {
    return [absolute];
  }
  if (doc === null || !isObject(doc)) {
    throw new TypeError(`expandPath: the wildcards in '${absolute}' need { doc } to enumerate`);
  }
  let paths = [''];
  for (const segment of segments) {
    if (segment.type !== 'wildcard') {
      paths = paths.map((currentPath) => appendSegment(currentPath, segment));
      continue;
    }
    paths = paths.flatMap((currentPath) => {
      const array = currentPath === '' ? doc : get(doc, currentPath, keys);
      if (!isArray(array)) {
        return [];
      }
      return array.map((element, position) => {
        const key = pathKey(element, keys);
        if (key !== null) {
          return `${currentPath}[#${key}]`;
        }
        return currentPath === '' ? String(position) : `${currentPath}.${position}`;
      });
    });
  }
  return paths;
};
