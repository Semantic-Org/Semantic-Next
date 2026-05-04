/*

  Decides whether an `{#each}` block's per-item content can stay lazy on
  hydrate. Each block's `hydrate` hook intentionally defers per-item
  Reaction wiring until the items collection signal fires — it's a
  perf optimization that assumes per-item bindings only depend on item-
  local data. When a binding closes over external state (a helper that
  reads `state.x`, a component method, etc.), that assumption is wrong:
  the items signal may never fire, so the per-binding Reaction never
  wires, so external state mutations have nothing to invalidate.

  This classifier is the gate: walk the each's content AST, classify
  every binding's identifier set against the local iteration scope plus
  the framework's pure-helper registry. If everything resolves locally,
  hydrate can defer (cheap). If anything could read external state,
  hydrate must wire eagerly via `adoptServerItems` (correct).

  Conservative-not-self-contained is the safe default — false positives
  pay the eager-wire cost where it wasn't strictly needed; false negatives
  silently lose reactivity (the bug). The classifier bails to "external"
  for shapes it can't statically prove safe: no-`as` each (item keys
  spread into local scope, statically indistinguishable from external
  names), snippet/subtemplate/rerender/async invocations (cross-AST
  flow), JS expressions whose identifier set is best-effort.

  Browser-only render paths never call `each.hydrate`, so this analysis
  costs nothing for the ~90% of users who runtime-compile in the browser
  without SSR. SSR users pay it once per unique each-content AST shape
  (cached on AST identity).

*/

import { TemplateHelpers } from '@semantic-ui/templating';

// All framework-shipped helpers are considered safe — they don't read
// user signals. User-registered helpers (`Template.registerHelper`) are
// statically indistinguishable from component methods, so they fall into
// the "external" bucket via the identifier check. That's the correct
// call: a helper that reads state needs the per-binding Reaction to wire.
const PURE_HELPERS = new Set(Object.keys(TemplateHelpers));

// Reserved iteration-context names that show up implicitly. `this` is
// the no-as item (also exposed when `as` is set). `index`/`key` are the
// default `indexAs` names for arrays/objects when not explicitly named.
const IMPLICIT_LOCALS = ['this', 'index', 'key'];

// JS keywords and literal names that appear as bare identifiers but
// don't read data context.
const RESERVED_NAMES = new Set([
  'true',
  'false',
  'null',
  'undefined',
  'return',
  'if',
  'else',
  'in',
  'of',
  'typeof',
  'instanceof',
  'new',
  'delete',
  'void',
  'this',
]);

// Strips quoted/backtick string literals before identifier extraction
// so identifiers inside string contents aren't treated as data refs.
const STRING_LITERAL_RE = /'[^']*'|"[^"]*"|`[^`]*`/g;

const IDENT_START_RE = /[a-zA-Z_$]/;
const IDENT_BODY_RE = /[a-zA-Z0-9_$]/;

const cache = new WeakMap();

// Build the local-name set for an each block. Iteration vars from the
// node + the implicit names always available inside item content.
function buildLocalScope(eachNode, parentScope) {
  const scope = parentScope ? new Set(parentScope) : new Set();
  for (const name of IMPLICIT_LOCALS) { scope.add(name); }
  if (eachNode.as) { scope.add(eachNode.as); }
  if (eachNode.indexAs) { scope.add(eachNode.indexAs); }
  return scope;
}

// True if every identifier head reachable from this expression resolves
// to the local iteration scope, the pure-helper registry, or a reserved
// name. Strips string literals first so tokens inside strings don't
// count. Skips:
//   - identifiers preceded by `.` (property access — only head matters)
//   - identifiers followed by `:` while inside `{...}` braces (object
//     literal key — `{active: x}` shouldn't classify `active`)
//
// Static-syntactic: handles plain identifiers, dotted paths, Lisp helper
// calls, JS expressions, ternary, inline objects/arrays — anything where
// unsafe reads would surface as a bare identifier name.
function isExpressionSelfContained(expression, localScope) {
  if (typeof expression !== 'string' || !expression) { return true; }
  const src = expression.replace(STRING_LITERAL_RE, '');
  const len = src.length;
  let braceDepth = 0;
  let i = 0;
  while (i < len) {
    const c = src[i];
    if (c === '{') {
      braceDepth++;
      i++;
      continue;
    }
    if (c === '}') {
      braceDepth--;
      i++;
      continue;
    }
    if (!IDENT_START_RE.test(c)) {
      i++;
      continue;
    }

    let j = i + 1;
    while (j < len && IDENT_BODY_RE.test(src[j])) { j++; }
    const head = src.slice(i, j);
    const prev = i > 0 ? src[i - 1] : '';
    i = j;

    // Property access — head was already classified at the dotted root.
    if (prev === '.') { continue; }

    // Object literal key — `{key: value}` while inside braces.
    if (braceDepth > 0) {
      let k = j;
      while (k < len && (src[k] === ' ' || src[k] === '\t')) { k++; }
      if (k < len && src[k] === ':') { continue; }
    }

    if (RESERVED_NAMES.has(head)) { continue; }
    if (localScope.has(head)) { continue; }
    if (PURE_HELPERS.has(head)) { continue; }
    return false;
  }
  return true;
}

// Recursively walk content. For nested blocks, expand the local scope
// or treat as opaque per the block's semantics.
function isContentSelfContained(content, localScope) {
  if (!Array.isArray(content)) { return true; }
  for (const node of content) {
    if (!isNodeSelfContained(node, localScope)) { return false; }
  }
  return true;
}

function isNodeSelfContained(node, localScope) {
  if (!node || !node.type) { return true; }

  switch (node.type) {
    case 'html':
      return true;
    case 'expression':
      return isExpressionSelfContained(node.value, localScope);
    case 'if': {
      if (!isExpressionSelfContained(node.condition, localScope)) { return false; }
      if (!isContentSelfContained(node.content, localScope)) { return false; }
      if (node.branches) {
        for (const branch of node.branches) {
          if (branch.condition && !isExpressionSelfContained(branch.condition, localScope)) { return false; }
          if (!isContentSelfContained(branch.content, localScope)) { return false; }
        }
      }
      return true;
    }
    case 'each': {
      if (!isExpressionSelfContained(node.over, localScope)) { return false; }
      // No-`as` each spreads item keys into local scope; we can't
      // statically enumerate them, so any bare identifier inside could
      // be either an item key or external. Bail.
      if (!node.as) { return false; }
      const innerScope = buildLocalScope(node, localScope);
      if (!isContentSelfContained(node.content, innerScope)) { return false; }
      if (node.elseContent && !isContentSelfContained(node.elseContent, localScope)) { return false; }
      return true;
    }
    case 'svg':
      return isContentSelfContained(node.content, localScope);
    // Cross-AST and dynamic blocks: bail conservative. Their bindings
    // live in separate ASTs (snippets, subtemplates) or have dynamic
    // semantics (rerender, async, guard) the classifier doesn't trace.
    case 'template':
    case 'snippet':
    case 'rerender':
    case 'guard':
    case 'async':
      return false;
    default:
      // Unknown node type — bail conservative.
      return false;
  }
}

/*
  Public entry point. Returns true if the each block's content can stay
  lazy on hydrate (only iteration-local + pure-helper reads), false if
  any descendant binding could read external state.

  Result is cached per each-AST-node identity. Same prototype reused
  across component instances pays once.
*/
export function isEachContentSelfContained(eachNode) {
  if (!eachNode || eachNode.type !== 'each') { return false; }
  // No-`as` each can't be analyzed (item keys spread into local scope).
  if (!eachNode.as) { return false; }

  let cached = cache.get(eachNode);
  if (cached !== undefined) { return cached; }

  const scope = buildLocalScope(eachNode);
  // elseContent renders when items is empty — the inner each handler
  // checks both branches; the public entry needs the same to avoid
  // silent reactivity loss when SSR served only the {:else} branch.
  cached = isContentSelfContained(eachNode.content, scope)
    && (!eachNode.elseContent || isContentSelfContained(eachNode.elseContent, scope));
  cache.set(eachNode, cached);
  return cached;
}
