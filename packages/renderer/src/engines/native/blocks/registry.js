/*

  Block registry — maps AST node.type strings to their defineBlock dispatch
  functions. Populated by side-effect imports of block modules (see
  packages/renderer/src/engines/native/blocks/*.js).

  The renderer uses this in a single dispatch path for both bind-time and
  hydrate-time flows, collapsing what today is a six-way switch across
  bindBlockDirective, hydrateBlockDirective, the raw-text switch, and the
  ServerRenderer's getServerRenderedAST.

*/

const registry = new Map();

export function registerBlock(type, block) {
  registry.set(type, block);
}

export function getBlock(type) {
  return registry.get(type);
}

export function hasBlock(type) {
  return registry.has(type);
}

export function allBlockTypes() {
  return [...registry.keys()];
}
