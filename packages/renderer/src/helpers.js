let tracing = false;
let recovery = false;

export const setTracing = (enabled) => {
  tracing = !!enabled;
};

export const isTracing = () => tracing;

export const setRecovery = (enabled) => {
  recovery = !!enabled;
};

export const isRecovery = () => recovery;

// Unwrap protocol — values that wrap framework-internal state (the
// item-tracking proxy, future getter-record wrappers, etc.) opt in to
// revealing their underlying form at userland boundaries by responding
// to this Symbol from a `get` trap or as an own property. The protocol
// mirrors `Symbol.iterator` / `Symbol.toPrimitive` — opt in by
// responding to the well-known symbol; pass-through otherwise.
//
// The expression evaluator calls `unwrap` on each helper-call argument
// before spreading into the helper invocation, so user code receives
// the underlying value, not the framework wrapper.
export const UNWRAP = Symbol.for('@semantic-ui/unwrap');

export const unwrap = (value) => {
  if (value !== null && typeof value === 'object') {
    const target = value[UNWRAP];
    if (target !== undefined) { return target; }
  }
  return value;
};
