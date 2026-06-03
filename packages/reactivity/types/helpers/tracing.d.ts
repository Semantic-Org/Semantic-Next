/**
 * Enables or disables context tracing, the cheap debug metadata attached to
 * signals, reactions, and dependencies. Off by default.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging#settracing setTracing}
 * @param enabled - Whether to enable tracing
 */
export function setTracing(enabled: boolean): void;

/**
 * Enables or disables stack capture, which adds stack traces to tracing context
 * via Error.captureStackTrace. Implies tracing and is expensive. Off by default.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging#setstackcapture setStackCapture}
 * @param enabled - Whether to enable stack capture
 */
export function setStackCapture(enabled: boolean): void;

/**
 * Returns whether tracing is currently enabled.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging#istracing isTracing}
 */
export function isTracing(): boolean;

/**
 * Returns whether stack capture is currently enabled.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging#isstackcapture isStackCapture}
 */
export function isStackCapture(): boolean;
