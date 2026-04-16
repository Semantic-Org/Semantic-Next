export const config = {
  // debug metadata attached during notify
  //   'off'     — zero cost; no allocation
  //   'context' — attach { firstRun, value, ... } bags for naming
  //   'stack'   — Error.captureStackTrace per notify, on top of context
  mode: 'off',

  // default value protection on set for new signals
  //   'reference' — no protection; dedupe via isEqual
  //   'freeze'    — deepFreeze on set; downstream mutations throw
  //   'none'      — no protection, no dedupe (event-stream semantics)
  safety: 'reference',
};

// `caller` is passed to Error.captureStackTrace so the framework frame is trimmed from the trace
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

// solves 'instanceof Signal' checks if across realms or package duplication
export const signalTag = Symbol.for('semantic-ui/Signal');
