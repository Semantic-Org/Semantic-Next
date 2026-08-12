/**
 * Guarded instrumentation over the performance timeline
 * @see {@link https://next.semantic-ui.com/docs/api/utils/timeline Timeline Utilities Documentation}
 */

/**
 * The DevTools extensibility dressing. Structural keys (track, color,
 * properties) are cheap and belong in every build; tooltipText is prose and
 * belongs behind the consumer's own development ternary
 * (`tooltipText: isDevelopment ? '...' : 0`).
 */
export interface TimelineDressing {
  /** 'track-entry' for measures and spans (default), 'marker' for marks */
  dataType?: 'track-entry' | 'marker';
  /** The custom track's name in the performance panel */
  track?: string;
  /** Groups several tracks under one header */
  trackGroup?: string;
  /** A DevTools palette color name (e.g. 'primary', 'secondary-light', 'error') */
  color?: string;
  /** Teaching prose shown on hover — development builds only, by convention */
  tooltipText?: string | 0;
  /** Key/value rows shown in the entry's tooltip — data, not prose */
  properties?: Array<[string, unknown]>;
}

/** A detail value, a dressing bag, or a thunk producing either — thunks are
 * evaluated inside the guard so a throwing builder never breaks the caller */
export type TimelineDetail =
  | TimelineDressing
  | Record<string, unknown>
  | 0
  | (() => TimelineDressing | Record<string, unknown> | 0);

/**
 * Options for timeline.mark
 */
export interface TimelineMarkOptions {
  detail?: TimelineDetail;
}

/**
 * Options for timeline.measure
 */
export interface TimelineMeasureOptions {
  /** The start mark's name, or a timestamp; omitted measures from the time origin */
  from?: string | number;
  /** The end mark's name, or a timestamp */
  to?: string | number;
  detail?: TimelineDetail;
}

/**
 * Guarded performance-timeline instrumentation. Every entry point is
 * throw-safe: a runtime without the performance API, a measure whose endpoint
 * mark never fired, or a throwing detail builder never breaks the code being
 * instrumented.
 *
 * @see {@link https://next.semantic-ui.com/docs/api/utils/timeline timeline}
 * @see {@link https://next.semantic-ui.com/examples/utils-timeline Example}
 *
 * @example
 * ```ts
 * timeline.mark('app:boot');
 * timeline.measure('app:startup', { from: 'app:boot', to: 'app:ready', detail: {
 *   track: 'boot', color: 'primary',
 *   tooltipText: isDevelopment ? 'transfer, parse, and first render' : 0,
 * } });
 *
 * const done = timeline.span('app:query');
 * await runQuery();
 * done();
 * ```
 */
export declare const timeline: {
  /** A point on the timeline (performance.mark) */
  mark(name: string, options?: TimelineMarkOptions): void;
  /** A duration between two named marks or timestamps (performance.measure) */
  measure(name: string, options?: TimelineMeasureOptions): void;
  /** A self-closing duration: captures its own start, returns an idempotent
   * closer — immune to the mistyped-mark silent no-op */
  span(name: string, options?: TimelineMarkOptions): (close?: TimelineMarkOptions) => void;
};
