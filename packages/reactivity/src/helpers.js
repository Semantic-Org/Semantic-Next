// Tracing mode controls debug metadata attached to Signals, Reactions, and
// Dependencies. One field instead of two booleans — stack implies context,
// and the impossible "stack without context" state is unrepresentable.
//   'off'     — no context, no allocation on notify
//   'context' — cheap: attach { firstRun, value, ... } bags for naming
//   'stack'   — expensive: Error.captureStackTrace per notify, on top of context
let mode = 'off';

export const setTracing = (enabled) => {
  if (enabled) {
    if (mode === 'off') { mode = 'context'; }
  }
  else {
    mode = 'off';
  }
};

export const setStackCapture = (enabled) => {
  if (enabled) {
    mode = 'stack';
  }
  else if (mode === 'stack') {
    mode = 'context';
  }
};

export const isTracing = () => mode !== 'off';
export const isStackCapture = () => mode === 'stack';

// Safety preset controls value protection on set.
//   'reference' — no protection; dedupe via isEqual (default, standard signals model)
//   'freeze'    — deepFreeze on set; downstream mutations throw
//   'none'      — no protection, no dedupe (event-stream semantics)
let defaultSafety = 'reference';
const VALID_SAFETY = new Set(['freeze', 'reference', 'none']);

export const getDefaultSafety = () => defaultSafety;
export const setDefaultSafety = (preset) => {
  if (!VALID_SAFETY.has(preset)) {
    throw new Error(`Invalid Signal.safety: ${preset}. Must be one of: ${[...VALID_SAFETY].join(', ')}`);
  }
  defaultSafety = preset;
};

// Capture a stack trace into target.context. Passes `caller` to
// Error.captureStackTrace so the framework frame is trimmed from the trace.
export const captureStack = (target, caller) => {
  if (mode !== 'stack') {
    return;
  }
  if (!target.context) {
    target.context = {};
  }
  if (Error.captureStackTrace) {
    Error.captureStackTrace(target.context, caller);
  }
  else {
    target.context.stack = new Error().stack;
  }
};
