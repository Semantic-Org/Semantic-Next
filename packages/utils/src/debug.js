import { toTitleCase } from './strings.js';

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
    title = toTitleCase(namespace),
    showTitle = true,
    titleColor = null,
    color = 'inherit',
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

  // JSON output
  if (format === 'json') {
    console[method]({
      ...(timestamp) ? { timestamp: new Date().toISOString() } : {},
      level,
      namespace,
      message,
      ...(data !== undefined && (!Array.isArray(data) || data.length > 0)) ? { data } : {},
    });
    return;
  }

  // Standard output
  if (timestamp) {
    const time = new Date().toISOString().split('T')[1].slice(0, 12);
    logFormat += `%c[${time}]%c `;
    logArgs.push('color: #999999;', 'color: inherit;');
  }

  if (title && showTitle) {
    logFormat += `%c${title}%c `;
    logArgs.push(
      `color: ${titleColor}; font-weight: bold;`,
      `color: ${color};`,
    );
  }

  logFormat += message;
  logArgs.unshift(logFormat);

  if (data !== undefined && (!Array.isArray(data) || data.length > 0)) {
    logArgs.push(data);
  }

  console[method](...logArgs);
};

/*-------------------
       Errors
--------------------*/

/*
  Coded errors with a development/production message split. Development carries a
  teaching explanation; production carries one uniform, greppable line —
  `<layer> refused [<code>] <at>` — parseable with
  /^(\S+) refused \[([\w-]+)\] (.*)$/. The explanation is meant to fold out of
  production builds at the CALLSITE (`explanation: isDevelopment ? '...' : 0`):
  a bundler define folds branches, never arguments, so the ternary must live
  where the string does. Measured on a real corpus: deferring explanations
  behind a helper or thunk reclaimed 37 bytes of a ~2KB pool; the inline
  ternary reclaimed all of it.
*/

const refusalLine = (layer, code, at) => `${layer ? `${layer} ` : ''}refused [${code}] ${at}`;

export const createErrors = ({
  layer = '',
  ErrorClass = Error,
} = {}) => {
  const build = (code, at, { explanation, detail } = {}) => {
    const built = new ErrorClass(explanation || refusalLine(layer, code, at));
    built.code = code;
    if (detail !== undefined) {
      built.detail = detail;
    }
    return built;
  };

  // report through the error channel and continue — log's sibling for errors.
  // the raise is asynchronous so the current call stack completes: it routes to
  // globalThis.onError when an app installs one, and throws otherwise so a
  // report is never silently lost. returns the Error it reported.
  const error = (code, at, options) => {
    const built = build(code, at, options);
    const raise = () => {
      if (typeof globalThis.onError === 'function') {
        globalThis.onError(built);
        return;
      }
      throw built;
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
  error.line = (code, at) => refusalLine(layer, code, at);

  // the throwing form: same arguments, never returns
  const throwError = (code, at, options) => {
    throw build(code, at, options);
  };

  return { error, throwError };
};
