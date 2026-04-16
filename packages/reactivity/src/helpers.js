// Shared reactivity configuration. Mutated via Signal's static accessors;
// read directly at call sites to avoid a function-call layer on hot paths.
//
// mode — debug metadata attached to Signals, Reactions, and Dependencies.
//   'off'     — zero cost; no allocation on notify
//   'context' — cheap: attach { firstRun, value, ... } bags for naming
//   'stack'   — expensive: Error.captureStackTrace per notify, on top of context
//
// safety — default value protection on set for new signals.
//   'reference' — no protection; dedupe via isEqual (default)
//   'freeze'    — deepFreeze on set; downstream mutations throw
//   'none'      — no protection, no dedupe (event-stream semantics)
export const config = {
  mode: 'off',
  safety: 'reference',
};

// Capture a stack trace into target.context. Passes `caller` to
// Error.captureStackTrace so the framework frame is trimmed from the trace.
export const captureStack = (target, caller) => {
  if (config.mode !== 'stack') { return; }
  if (!target.context) { target.context = {}; }
  if (Error.captureStackTrace) {
    Error.captureStackTrace(target.context, caller);
  }
  else {
    target.context.stack = new Error().stack;
  }
};
