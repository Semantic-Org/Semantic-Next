/**
 * Turns on context naming and structured block error logs across reactivity
 * and the renderer. Cheap enough to leave on in development.
 */
export function setTracing(enabled: boolean): void;

/**
 * Captures a stack trace on every Signal notification so a change can be traced
 * back to the line that made it. Expensive, so it is opt-in.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging#setstackcapture setStackCapture}
 */
export function setStackCapture(enabled: boolean): void;

/**
 * Lets the renderer recover from a block error and keep rendering the rest of
 * the template instead of failing the whole render.
 */
export function setRecovery(enabled: boolean): void;
