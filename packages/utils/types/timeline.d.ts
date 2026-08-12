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
  /** 'track-entry' for measures (default), 'marker' for marks */
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
 * evaluated inside the guard at record-time so a throwing builder never breaks
 * the caller */
export type TimelineDetail =
  | TimelineDressing
  | Record<string, unknown>
  | 0
  | (() => TimelineDressing | Record<string, unknown> | 0);

/**
 * Options for markTimeline
 */
export interface MarkTimelineOptions {
  detail?: TimelineDetail;
}

/**
 * Options for measureTimeline
 */
export interface MeasureTimelineOptions {
  /** The start mark's name, or a timestamp. Defaults to the call instant
   * (performance.now()); a named mark on the closer form resolves at done-time */
  from?: string | number;
  /** The end mark's name, a timestamp, or the reserved 'now' for this instant.
   * Omit it to receive an idempotent done() closer instead */
  to?: string | number | 'now';
  detail?: TimelineDetail;
}

/** The closer returned by measureTimeline when `to` is omitted — idempotent,
 * records the measure on its first call; a detail passed here wins over the
 * open's */
export type MeasureTimelineCloser = (close?: { detail?: TimelineDetail; }) => void;

/**
 * Records a point on the performance timeline (performance.mark). Throw-safe:
 * a runtime without the performance API or a throwing detail builder never
 * breaks the code being instrumented.
 *
 * @see {@link https://next.semantic-ui.com/docs/api/utils/timeline#marktimeline markTimeline}
 * @see {@link https://next.semantic-ui.com/examples/utils-timeline Example}
 *
 * @example
 * ```ts
 * markTimeline('app:boot');
 * ```
 */
export function markTimeline(name: string, options?: MarkTimelineOptions): void;

/**
 * Records a duration on the performance timeline (performance.measure), two
 * forms split on `to`. With `to` — a mark name, a timestamp, or the reserved
 * 'now' for this instant — the measure records immediately. Without `to` it
 * returns an idempotent done() closer that captures its own start, immune to
 * the mistyped-mark silent no-op. Throw-safe: an endpoint whose mark never
 * fired emits nothing rather than throwing.
 *
 * @see {@link https://next.semantic-ui.com/docs/api/utils/timeline#measuretimeline measureTimeline}
 * @see {@link https://next.semantic-ui.com/examples/utils-timeline Example}
 *
 * @example
 * ```ts
 * markTimeline('app:boot');
 * measureTimeline('app:startup', { from: 'app:boot', to: 'app:ready', detail: {
 *   track: 'boot', color: 'primary',
 *   tooltipText: isDevelopment ? 'transfer, parse, and first render' : 0,
 * } });
 *
 * const done = measureTimeline('app:query');
 * await runQuery();
 * done();
 * ```
 */
export function measureTimeline(
  name: string,
  options: MeasureTimelineOptions & { to: string | number; },
): void;
export function measureTimeline(
  name: string,
  options?: Omit<MeasureTimelineOptions, 'to'>,
): MeasureTimelineCloser;
