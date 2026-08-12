import { isFunction, isPlainObject } from './types.js';

/*-------------------
      Timeline
--------------------*/

/*
  Guarded instrumentation over the performance timeline. Every entry point is
  throw-safe by contract: a runtime without the performance API, a measure whose
  endpoint mark never fired, or a throwing detail builder must never break the
  code being instrumented — instrumentation observes, it does not participate.

  `detail` may be a value or a thunk; thunks are evaluated inside the guard at
  record-time. When the resolved value speaks the DevTools extensibility
  vocabulary (track, trackGroup, color, tooltipText, properties, dataType), the
  `{ devtools }` envelope is composed here — dataType defaults to 'track-entry'
  for measures, 'marker' for marks. Structural keys are cheap and belong in
  every build; tooltipText is prose and belongs behind the consumer's own
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

// a point on the timeline (performance.mark)
export const markTimeline = (name, { detail } = {}) => {
  try {
    const composed = composeDetail(detail, 'marker');
    performance.mark(name, composed === undefined ? undefined : { detail: composed });
  }
  catch {
    // no performance runtime, or a throwing detail builder — never propagate
  }
};

// a duration on the timeline (performance.measure), two forms split on `to`.
// with `to` — a mark name, a timestamp, or the reserved 'now' for this instant —
// the measure records immediately; an endpoint whose mark never fired emits
// nothing rather than throwing. without `to` it returns an idempotent done()
// closer that records at close, so there is no end mark to mistype. `from`
// defaults to performance.now() at call; a named `from` on the closer form
// resolves at done-time, so its mark may fire after this call. `detail` may
// ride the open or the close, and the close's wins
export const measureTimeline = (name, { from, to, detail } = {}) => {
  if (to !== undefined) {
    try {
      performance.measure(name, {
        start: from ?? performance.now(),
        end: to === 'now' ? performance.now() : to,
        detail: composeDetail(detail, 'track-entry'),
      });
    }
    catch {
      // an endpoint mark never fired, or no performance runtime
    }
    return;
  }
  let start = from;
  if (start === undefined) {
    try {
      start = performance.now();
    }
    catch {
      return () => {};
    }
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
      // a named `from` whose mark never fired, or no performance runtime
    }
  };
};
