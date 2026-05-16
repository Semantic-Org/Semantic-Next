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

// Default value-protection preset for new Signals when `safety` isn't set
// at the call site.
//   'clone'     — clone on get/set; mutation isolation, identity unstable
//   'reference' — no clone; identity stable, mutate-after-get bypasses reactivity
//   'freeze'    — deep-freeze on set; mutation throws at the call site
//   'none'      — no clone, no equality dedupe; every set notifies
let safety = 'clone';

const SAFETY_PRESETS = new Set(['clone', 'reference', 'freeze', 'none']);

export const setSafety = (preset) => {
  if (!SAFETY_PRESETS.has(preset)) {
    throw new TypeError(`Invalid safety preset: ${preset}. Must be 'clone', 'reference', 'freeze', or 'none'.`);
  }
  safety = preset;
};

export const getSafety = () => safety;

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
