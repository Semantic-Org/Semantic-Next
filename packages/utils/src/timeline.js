import { isFunction, isPlainObject } from './types.js';

/*-------------------
      Timeline
--------------------*/

/*
  Guarded instrumentation over the performance timeline. Every entry point is
  throw-safe by contract: a runtime without the performance API, a measure whose
  endpoint mark never fired, or a throwing detail builder must never break the
  code being instrumented — instrumentation observes, it does not participate.

  `detail` may be a value or a thunk; thunks are evaluated inside the guard.
  When the resolved value speaks the DevTools extensibility vocabulary (track,
  trackGroup, color, tooltipText, properties, dataType), the `{ devtools }`
  envelope is composed here — dataType defaults to 'track-entry' for measures
  and spans, 'marker' for marks. Structural keys are cheap and belong in every
  build; tooltipText is prose and belongs behind the consumer's own
  development ternary (`tooltipText: isDevelopment ? '...' : 0`) — a bundler
  define folds branches, never arguments, so the ternary lives at the callsite
  and a folded tooltip drops out of the envelope here.
*/

const DRESSING_KEYS = ['dataType', 'track', 'trackGroup', 'color', 'tooltipText', 'properties'];

const composeDetail = (detail, dataType) => {
  const value = isFunction(detail) ? detail() : detail;
  if (!value) {
    return undefined;
  }
  if (!isPlainObject(value) || value.devtools !== undefined) {
    return value;
  }
  if (!DRESSING_KEYS.some((key) => value[key] !== undefined)) {
    return value;
  }
  const { tooltipText, ...structure } = value;
  return {
    devtools: {
      dataType,
      ...structure,
      ...(tooltipText ? { tooltipText } : {}),
    },
  };
};

export const timeline = {
  // a point on the timeline (performance.mark)
  mark(name, { detail } = {}) {
    try {
      const composed = composeDetail(detail, 'marker');
      performance.mark(name, composed === undefined ? undefined : { detail: composed });
    }
    catch {
      // no performance runtime, or a throwing detail builder — never propagate
    }
  },

  // a duration between two named marks (performance.measure). an omitted `from`
  // measures from the time origin; an endpoint whose mark never fired emits
  // nothing rather than throwing
  measure(name, { from, to, detail } = {}) {
    try {
      performance.measure(name, {
        start: from,
        end: to,
        detail: composeDetail(detail, 'track-entry'),
      });
    }
    catch {
      // an endpoint mark never fired, or no performance runtime
    }
  },

  // a self-closing duration: captures its own start and returns a closer, so a
  // mistyped or never-fired mark name cannot silently no-op the measurement.
  // the closer is idempotent; `detail` may ride the open or the close
  span(name, { detail } = {}) {
    let start;
    try {
      start = performance.now();
    }
    catch {
      return () => {};
    }
    let closed = false;
    return ({ detail: closeDetail } = {}) => {
      if (closed) {
        return;
      }
      closed = true;
      try {
        performance.measure(name, {
          start,
          end: performance.now(),
          detail: composeDetail(closeDetail ?? detail, 'track-entry'),
        });
      }
      catch {
        // no performance runtime — the span dies quietly with it
      }
    };
  },
};
