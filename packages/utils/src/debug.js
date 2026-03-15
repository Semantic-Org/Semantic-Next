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
      ...(data?.length) ? { data } : {},
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

  if (data?.length > 0) {
    logArgs.push(data);
  }

  console[method](...logArgs);
};

/*-------------------
       Errors
--------------------*/

export const fatal = (
  message,
  {
    errorType = Error,
    metadata = {},
    onError,
    removeStackLines = 1,
  } = {},
) => {
  const error = new errorType(message);
  Object.assign(error, metadata);

  if (error.stack) {
    const stackLines = error.stack.split('\n');
    stackLines.splice(1, removeStackLines);
    error.stack = stackLines.join('\n');
  }

  const throwError = () => {
    if (onError) {
      onError(error);
      return;
    }
    if (typeof globalThis.onError === 'function') {
      globalThis.onError(error);
    }
    throw error;
  };

  if (typeof queueMicrotask === 'function') {
    queueMicrotask(throwError);
  }
  else {
    setTimeout(throwError, 0);
  }
};
