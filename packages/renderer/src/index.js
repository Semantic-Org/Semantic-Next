// shared
export { analyzePosition, buildHTMLString, MARKER_VERSION } from './build-html-string.js';
export { ExpressionEvaluator } from './expression-evaluator.js';

// engine registry
export { getEngine, registerEngine } from './engine-registry.js';

// native renderer
export { Renderer } from './engines/native/renderer.js';

// server renderer
export { renderToString } from './engines/native/server.js';

// Lit renderer exports are NOT in this barrel — they're tree-shaking poison.
// Import LitRenderer via @semantic-ui/component (which triggers engine registration)
// or directly from ./engines/lit/renderer.js for internal use.
