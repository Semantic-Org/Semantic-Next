/**
 * Enables or disables structured block error logging. Off by default. When on,
 * a block whose hook throws reports the block name, template syntax, hook, and
 * stack to the console.
 * @param enabled - Whether to enable tracing
 */
export function setTracing(enabled: boolean): void;

/** Returns whether block error tracing is currently enabled. */
export function isTracing(): boolean;

/**
 * Enables or disables error recovery. Off by default. When on, every block wraps
 * its hooks so a throw isolates the failing region instead of tearing down the
 * surrounding render.
 * @param enabled - Whether to enable recovery
 */
export function setRecovery(enabled: boolean): void;

/** Returns whether error recovery is currently enabled. */
export function isRecovery(): boolean;
