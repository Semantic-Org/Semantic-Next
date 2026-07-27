/**
 * Rendering engine for Semantic UI templates. Turns a compiled AST into DOM on
 * the client and into HTML on the server, and keeps the result in step with the
 * signals the template reads.
 * @see {@link https://next.semantic-ui.com/docs/api/renderer Renderer API Reference}
 */

// shared
export { analyzePosition, buildHTMLString, MAIN_BRANCH_INDEX, MARKER_VERSION } from './build-html-string.js';
export type {
  AttributePart,
  BindingPosition,
  BuildEntry,
  BuildHTMLStringOptions,
  BuildHTMLStringResult,
} from './build-html-string.js';

export { ExpressionEvaluator } from './expression-evaluator.js';
export type { ExpressionArray, ExpressionEvaluatorSettings } from './expression-evaluator.js';

export { isRecovery, isTracing, setRecovery, setTracing } from './helpers.js';

// engine registry
export { getEngine, registerEngine } from './engine-registry.js';
export type { Engine } from './engine-registry.js';

// native renderer
export { Renderer } from './engines/native/renderer.js';
export type { DynamicRegion, ReactionScope, RendererSettings } from './engines/native/renderer.js';

// server renderer
export { ServerRenderer } from './engines/native/server.js';
export type { ServerRendererSettings, ServerRenderScope } from './engines/native/server.js';
