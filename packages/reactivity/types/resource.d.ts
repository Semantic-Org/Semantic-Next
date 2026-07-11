import type { Reaction } from './reaction.js';
import type { Signal, SignalOptions } from './signal.js';

/**
 * Configuration options for creating a new Resource instance. Extends
 * `SignalOptions`, so a Resource carries the same `equality` (which becomes the
 * refresh dedup), `safety`, `id`, and `context` configuration as any Signal.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/resource#options Resource Options}
 */
export interface ResourceOptions<T> extends SignalOptions<T> {
  /**
   * The value `get()` returns before the first fetch settles. Defaults to
   * `undefined`.
   */
  initialValue?: T;

  /**
   * Called when a fetch rejects, after the `error` face is set and the faces
   * settle. Superseded runs never report. For value-only consumers that would
   * otherwise miss rejections landing silently in the `error` face.
   */
  onError?: (error: unknown) => void;

  /**
   * How a refetch behaves when a tracked read or `refresh()` fires while a run
   * is in flight. `'latest'` (the default) serializes runs: the in-flight run
   * aborts through `computation.abortSignal` and the refetch coalesces into one
   * re-run after it settles, so at most one fetch is ever in flight. `'overlap'`
   * starts every fetch immediately and lets the newest run's settle win, for
   * fetchers that cannot cooperate with cancellation. Overlap costs concurrent
   * fetches under churn, and its runs are invisible to `settled()` because the
   * backing reaction stays synchronous. Defaults to `'latest'`.
   */
  concurrency?: 'latest' | 'overlap';
}

/**
 * A Resource is a Signal whose value an async fetcher produces. The fetcher runs
 * as an async reaction: signals it reads before its first `await` are tracked
 * and re-fire the fetch when they change. By default runs never overlap and a
 * superseded run aborts through `computation.abortSignal` (latest-wins), which
 * the `concurrency` option can relax to overlapping runs. The stored value
 * holds last-good through a refresh and through a rejection. Fetch status lives
 * in the separate `loading`, `error`, and `settled` faces, each reactive on its
 * own.
 *
 * Create one with the `resource()` factory or `new Resource()` — both are
 * supported. It is a Signal, so `get()`, `peek()`, `getItem()`, equality dedup,
 * and the rest of the Signal surface apply.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/resource Resource Documentation}
 */
export class Resource<T> extends Signal<T> {
  /**
   * Creates a Resource backed by a fetcher. The fetcher runs immediately as an
   * async reaction and receives the backing Reaction as its argument. A promise
   * return holds the resource in flight until it settles, a synchronous return
   * settles at once.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/resource#resource constructor}
   * @param fetcher - Produces the value, receiving the backing computation
   * @param options - Configuration for the resource's behavior
   */
  constructor(fetcher: (computation: Reaction) => T | Promise<T>, options?: ResourceOptions<T>);

  /**
   * `true` while a fetch is in flight, `false` otherwise. A synchronous fetcher
   * return never flips it. Reads re-run only at the transition, so a skeleton
   * state is `loading && !settled` and a refresh shimmer is `loading && settled`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/resource#loading loading}
   */
  readonly loading: boolean;

  /**
   * The error from the most recent rejected fetch, cleared on the next fulfilled
   * settle and `undefined` otherwise. Reads re-run only at transitions. A
   * rejection never reaches `console.error` or surfaces as an unhandled rejection.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/resource#error error}
   */
  readonly error: unknown;

  /**
   * Latches `true` after the first completed fetch (fulfilled or rejected) and
   * stays `true` for the resource's life. Reads re-run once, at that first settle.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/resource#settled settled}
   */
  readonly settled: boolean;

  /**
   * Re-fires the fetcher by invalidating the backing reaction. The stored value
   * holds until the refresh settles.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/resource#refresh refresh}
   */
  refresh(): void;

  /**
   * Permanently stops the resource. Re-fires end, the loading face clears, and
   * the last value stays readable. A resource created inside a reaction stops
   * with its parent, and an unreferenced handle self-stops. Idempotent.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/resource#stop stop}
   */
  stop(): void;
}
