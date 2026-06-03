/**
 * Synchronously processes all pending reactions instead of waiting for the
 * microtask queue. Batched writes resolve to their final value, errors are
 * captured and rethrown after the queue drains, and a reactive cycle is broken
 * after a fixed iteration cap.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/flushing#flush flush}
 */
export function flush(): void;

/**
 * Schedules pending reactions to be processed on the next microtask. This is the
 * default behavior when a signal changes, and is idempotent within a tick.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/flushing#scheduleflush scheduleFlush}
 */
export function scheduleFlush(): void;

/**
 * Registers a callback to run after the next flush drains. Useful for side
 * effects that should happen once all reactions have settled.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/flushing#afterflush afterFlush}
 * @param callback - Function to run after updates are processed
 */
export function afterFlush(callback: () => void): void;

/**
 * Logs the source of the currently running reaction to the console, for
 * debugging reactive update chains. Requires tracing to be enabled.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging#getsource getSource}
 */
export function getSource(): void;
