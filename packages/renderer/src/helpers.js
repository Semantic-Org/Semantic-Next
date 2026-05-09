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
// Cross-engine: `Symbol.for` shares one identity across realms and
// duplicate package copies. The expression evaluator (engine-agnostic)
// inlines the check at each unwrap site rather than importing a helper,
// so the protocol is sigil-only — engines wire their wrappers up to
// respond to UNWRAP and the evaluator finds them with no engine-
// specific import.
export const UNWRAP = Symbol.for('@semantic-ui/unwrap');
