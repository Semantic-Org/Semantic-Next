import { isServer } from './environment.js';

/*-------------------
       Logging
--------------------*/

const levelConfig = {
  debug: { method: 'debug', titleColor: '#666666' },
  log: { method: 'log', titleColor: '#0066CC' },
  info: { method: 'info', titleColor: '#009FDA' },
  warn: { method: 'warn', titleColor: '#FF9800' },
  error: { method: 'error', titleColor: '#F44336' },
};

export const log = (
  message,
  level = 'log',
  {
    namespace = '',
    data = undefined,
    timestamp = false,
    format = 'standard',
    consoleMethod = null,
    silent = false,
    title = namespace,
    showTitle = true,
    titleColor = null,
    color = 'inherit',
    // node consumes %c silently, so styling is dead weight in server output —
    // plain text keeps the style args out of structured logs
    noColor = isServer,
  } = {},
) => {
  if (silent) {
    return;
  }

  const config = levelConfig[level] || levelConfig.info;
  const method = consoleMethod || config.method;

  if (!titleColor) {
    titleColor = config.titleColor;
  }

  // Format message based on options
  const logArgs = [];
  let logFormat = '';

  // JSON output — one serialized record per line, for process managers and
  // log aggregators
  if (format === 'json') {
    console[method](JSON.stringify({
      ...(timestamp) ? { timestamp: new Date().toISOString() } : {},
      level,
      namespace,
      message,
      ...(data !== undefined && (!Array.isArray(data) || data.length > 0)) ? { data } : {},
    }));
    return;
  }

  // Standard output
  if (timestamp) {
    const time = new Date().toISOString().split('T')[1].slice(0, 12);
    if (noColor) {
      logFormat += `[${time}] `;
    }
    else {
      logFormat += `%c[${time}]%c `;
      logArgs.push('color: #999999;', 'color: inherit;');
    }
  }

  if (title && showTitle) {
    if (noColor) {
      logFormat += `${title} `;
    }
    else {
      logFormat += `%c${title}%c `;
      logArgs.push(
        `color: ${titleColor}; font-weight: bold;`,
        `color: ${color};`,
      );
    }
  }

  logFormat += message;
  logArgs.unshift(logFormat);

  if (data !== undefined && (!Array.isArray(data) || data.length > 0)) {
    logArgs.push(data);
  }

  console[method](...logArgs);
};

// binds log to shared defaults — namespace, timestamp, any log option — and
// returns flat functions for destructuring. the level wrappers absorb the
// level slot only; callsite options shallow-merge over the defaults and win
export const createLogger = (defaults = {}) => {
  const merged = (options) => ({ ...defaults, ...options });
  const leveled = (level) => (message, options) => log(message, level, merged(options));
  return {
    log: (message, level, options) => log(message, level, merged(options)),
    debug: leveled('debug'),
    info: leveled('info'),
    warn: leveled('warn'),
    error: leveled('error'),
  };
};

/*-------------------
       Errors
--------------------*/

/*
  Coded errors with a development/production message split. Every message leads
  with one uniform, greppable line — `<namespace> <verb> [<code>] <at>` —
  parseable with /^(\S+) (\S+) \[([\w-]+)\] (.*)$/m. The verb is a stable
  token position carrying the caller's own classification of the line — any
  word, with a nullish verb falling back to `refused`. Production carries the
  line alone; development appends the teaching explanation on its own line, so
  the address prints in every posture and explanations never restate it. The
  explanation is meant to fold out of production builds at the CALLSITE
  (`explanation: isDevelopment ? '...' : 0`): a bundler define folds branches,
  never arguments, so the ternary must live where the string does. Measured on
  a real corpus: deferring explanations behind a helper or thunk reclaimed 37
  bytes of a ~2KB pool; the inline ternary reclaimed all of it.
*/

const errorLine = (namespace, verb, code, at) =>
  `${namespace ? `${namespace} ` : ''}${verb ?? 'refused'} [${code}] ${at}`;

const build = (code, at, { namespace = '', ErrorClass = Error, explanation, detail, verb } = {}) => {
  const line = errorLine(namespace, verb, code, at);
  const built = new ErrorClass(explanation ? `${line}\n${explanation}` : line);
  built.code = code;
  built.at = at;
  if (detail !== undefined) {
    built.detail = detail;
  }
  return built;
};

// report through the error channel and continue — log's sibling for errors.
// the raise is asynchronous so the current call stack completes: it routes to
// globalThis.onError when an app installs one, and falls back to
// console.error otherwise so a report is never silently lost. returns the
// Error it reported. report: false builds and returns without raising — for
// when the error is a value (a rejection, a result) and reporting is the
// consumer's job.
export const error = (code, at, options) => {
  const built = build(code, at, options);
  // open the stack at the caller — captureStackTrace (V8) drops every frame
  // above and including the named function, so each public door captures
  // against itself. engines without it keep the full stack
  Error.captureStackTrace?.(built, error);
  if (options?.report === false) {
    return built;
  }
  const raise = () => {
    if (typeof globalThis.onError === 'function') {
      globalThis.onError(built);
      return;
    }
    console.error(built);
  };
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(raise);
  }
  else {
    setTimeout(raise, 0);
  }
  return built;
};

// the production one-liner alone, for console seats
error.line = (code, at, { namespace = '', verb } = {}) => errorLine(namespace, verb, code, at);

// the throwing form: same arguments, never returns
export const throwError = (code, at, options) => {
  const built = build(code, at, options);
  Error.captureStackTrace?.(built, throwError);
  throw built;
};

// the binder over the pair, mirroring createLogger over log — pre-fills the
// options into every call, callsite options win. the bound forms capture the
// stack against themselves so the wrapper frame folds away too
export const createErrors = (defaults = {}) => {
  const merged = (options) => ({ ...defaults, ...options });
  const bound = (code, at, options) => {
    const built = error(code, at, merged(options));
    Error.captureStackTrace?.(built, bound);
    return built;
  };
  bound.line = (code, at, options) => error.line(code, at, merged(options));
  const boundThrow = (code, at, options) => {
    const built = build(code, at, merged(options));
    Error.captureStackTrace?.(built, boundThrow);
    throw built;
  };
  return {
    error: bound,
    throwError: boundThrow,
  };
};
