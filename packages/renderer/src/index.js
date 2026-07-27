// shared, reusable by any engine
export { analyzePosition, buildHTMLString, MAIN_BRANCH_INDEX, MARKER_VERSION } from './build-html-string.js';
export { ExpressionEvaluator } from './expression-evaluator.js';
export { isRecovery, isTracing, setRecovery, setTracing } from './helpers.js';
// list identity, so an engine reconciles {#each} the same way the shipped ones do
export { decodeItemKey, encodeItemKey, getCollectionType, getEachData, getItemId } from './shared/each.js';
export { lisIndices } from './shared/lis.js';

// engine registry
export { getEngine, registerEngine } from './engine-registry.js';

// native renderer
export { Renderer } from './engines/native/renderer.js';

// server renderer
export { ServerRenderer } from './engines/native/server.js';

// Lit renderer exports are NOT in this barrel — they're tree-shaking poison.
// Import LitRenderer via @semantic-ui/component (which triggers engine registration)
// or directly from ./engines/lit/renderer.js for internal use.
