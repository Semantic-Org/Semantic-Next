import { hashCode } from './crypto.js';
import { isFunction } from './types.js';

/*-------------------
      Functions
--------------------*/

/*
  Efficient no operation func
*/
export const noop = (v) => v;

/*
  Call function even if its not defined
*/
export const wrapFunction = (x) => {
  return isFunction(x) ? x : () => x;
};

/*
  Memoize
*/
export const memoize = (fn, hashFunction = (args) => hashCode(JSON.stringify(args))) => {
  const cache = new Map();

  return function(...args) {
    const key = hashFunction(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);

    return result;
  };
};
export const debounce = (func, wait, options = {}) => {
  const {
    rejectSkipped = false,
    leading = false,
    trailing = true,
    maxWait,
    abortController,
  } = options;

  if (!leading && !trailing) {
    throw new Error('At least one of leading or trailing must be true');
  }

  let timeoutId;
  let maxTimeoutId;
  let lastCallTime;
  let lastInvokeTime = 0;
  let firstCallTime;
  let lastArgs;
  let lastThis;
  let result;
  let pendingPromises = [];
  let leadingInvoked = false;

  const signal = abortController?.signal;

  const cleanupListener = () => {
    if (signal) {
      signal.removeEventListener('abort', handleAbort);
    }
  };

  const handleAbort = () => {
    cancel();
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    pendingPromises.forEach(({ reject }) => reject(abortError));
    pendingPromises = [];
    cleanupListener();
  };

  if (signal?.aborted) {
    throw new DOMException('The operation was aborted', 'AbortError');
  }
  signal?.addEventListener('abort', handleAbort);

  const invokeFunc = (thisArg, args) => {
    lastInvokeTime = Date.now();
    firstCallTime = undefined;

    try {
      const funcResult = func.apply(thisArg, args);

      if (funcResult && typeof funcResult.then === 'function') {
        return funcResult.then(
          value => {
            result = value;
            pendingPromises.forEach(({ resolve }) => resolve(value));
            pendingPromises = [];
            cleanupListener();
            return value;
          },
          error => {
            pendingPromises.forEach(({ reject }) => reject(error));
            pendingPromises = [];
            cleanupListener();
            throw error;
          },
        );
      }
      else {
        result = funcResult;
        pendingPromises.forEach(({ resolve }) => resolve(funcResult));
        pendingPromises = [];
        cleanupListener();
        return funcResult;
      }
    }
    catch (error) {
      pendingPromises.forEach(({ reject }) => reject(error));
      pendingPromises = [];
      cleanupListener();
      throw error;
    }
  };

  const shouldInvoke = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeSinceFirstCall = firstCallTime ? time - firstCallTime : 0;

    return (lastCallTime === undefined
      || timeSinceLastCall >= wait
      || timeSinceLastCall < 0
      || (maxWait !== undefined && timeSinceFirstCall >= maxWait));
  };

  const remainingWait = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceFirstCall = firstCallTime ? time - firstCallTime : 0;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceFirstCall)
      : timeWaiting;
  };

  const leadingEdge = (thisArg, args) => {
    lastInvokeTime = Date.now();
    timeoutId = setTimeout(timerExpired, wait);
    leadingInvoked = true;
    return leading ? invokeFunc(thisArg, args) : result;
  };

  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  };

  const trailingEdge = (time) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
      maxTimeoutId = undefined;
    }

    leadingInvoked = false;

    const args = lastArgs;
    const ctx = lastThis;
    lastArgs = undefined;
    lastThis = undefined;

    if (trailing && args) {
      try {
        const res = invokeFunc(ctx, args);
        if (res && typeof res.then === 'function') {
          res.catch(() => {});
        }
        return res;
      }
      catch (error) {
        return;
      }
    }

    pendingPromises.forEach(({ resolve }) => resolve(result));
    pendingPromises = [];

    return result;
  };

  const cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
      maxTimeoutId = undefined;
    }
    leadingInvoked = false;
    lastInvokeTime = 0;
    firstCallTime = undefined;
    lastArgs = lastThis = undefined;
  };

  const flush = () => {
    if (timeoutId === undefined) {
      return result;
    }
    return invokeFunc(lastThis, lastArgs);
  };

  const pending = () => {
    return timeoutId !== undefined;
  };

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (firstCallTime === undefined) {
      firstCallTime = time;
    }

    if (signal?.aborted) {
      const error = new DOMException('The operation was aborted', 'AbortError');
      return Promise.reject(error);
    }

    if (isInvoking) {
      if (timeoutId === undefined) {
        const leadingResult = leadingEdge(this, args);

        if (leading && !(leadingResult && typeof leadingResult.then === 'function')) {
          return leadingResult;
        }

        if (leadingResult && typeof leadingResult.then === 'function') {
          return leadingResult;
        }
      }
    }

    if (timeoutId === undefined && !isInvoking) {
      timeoutId = setTimeout(timerExpired, wait);

      if (maxWait !== undefined && maxTimeoutId === undefined) {
        maxTimeoutId = setTimeout(() => {
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
          }
          maxTimeoutId = undefined;
          try {
            const res = invokeFunc(lastThis, lastArgs);
            if (res && typeof res.then === 'function') {
              res.catch(() => {});
            }
          }
          catch (error) {}
        }, maxWait);
      }
    }

    return new Promise((resolve, reject) => {
      if (rejectSkipped && timeoutId !== undefined && !isInvoking && pendingPromises.length > 0) {
        const skippedPromises = [...pendingPromises];
        pendingPromises = [{ resolve, reject }];

        skippedPromises.forEach(({ reject: rejectPrevious, args: prevArgs }) => {
          rejectPrevious({
            code: 'DEBOUNCED',
            message: 'Call was skipped due to debounce',
            replacedBy: prevArgs || args,
          });
        });
        return;
      }

      pendingPromises.push({ resolve, reject, args });
    });
  }

  debounced.cancel = () => {
    cancel();
    const cancellationError = new Error('The operation was cancelled.');
    cancellationError.code = 'CANCELLED';
    pendingPromises.forEach(({ reject }) => reject(cancellationError));
    pendingPromises = [];
    cleanupListener();
    return Promise.resolve();
  };

  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
};

export const throttle = (func, wait, options = {}) => {
  const {
    rejectSkipped = false,
    leading = true,
    trailing = true,
    abortController,
  } = options;

  if (!leading && !trailing) {
    throw new Error('At least one of leading or trailing must be true');
  }

  let timeoutId;
  let lastCallTime;
  let lastInvokeTime = 0;
  let lastArgs;
  let lastThis;
  let result;
  let pendingPromises = [];
  let trailingInvoked = false;

  const signal = abortController?.signal;

  const cleanupListener = () => {
    if (signal) {
      signal.removeEventListener('abort', handleAbort);
    }
  };

  const handleAbort = () => {
    cancel();
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    pendingPromises.forEach(({ reject }) => reject(abortError));
    pendingPromises = [];
    cleanupListener();
  };

  if (signal?.aborted) {
    throw new DOMException('The operation was aborted', 'AbortError');
  }
  signal?.addEventListener('abort', handleAbort);

  const invokeFunc = (thisArg, args) => {
    lastInvokeTime = Date.now();

    try {
      const funcResult = func.apply(thisArg, args);

      if (funcResult && typeof funcResult.then === 'function') {
        return funcResult.then(
          value => {
            result = value;
            pendingPromises.forEach(({ resolve }) => resolve(value));
            pendingPromises = [];
            cleanupListener();
            return value;
          },
          error => {
            pendingPromises.forEach(({ reject }) => reject(error));
            pendingPromises = [];
            cleanupListener();
            throw error;
          },
        );
      }
      else {
        result = funcResult;
        pendingPromises.forEach(({ resolve }) => resolve(funcResult));
        pendingPromises = [];
        cleanupListener();
        return funcResult;
      }
    }
    catch (error) {
      pendingPromises.forEach(({ reject }) => reject(error));
      pendingPromises = [];
      cleanupListener();
      throw error;
    }
  };

  const shouldInvoke = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (lastCallTime === undefined
      || timeSinceLastInvoke >= wait
      || timeSinceLastCall < 0);
  };

  const remainingWait = (time) => {
    const timeSinceLastInvoke = time - lastInvokeTime;
    return wait - timeSinceLastInvoke;
  };

  const leadingEdge = (thisArg, args) => {
    lastInvokeTime = Date.now();
    return leading ? invokeFunc(thisArg, args) : result;
  };

  const timerExpired = () => {
    const time = Date.now();
    if (trailing && lastArgs && !trailingInvoked) {
      const remainingTime = remainingWait(time);
      if (remainingTime <= 0) {
        timeoutId = undefined;
        trailingInvoked = false;
        try {
          const res = invokeFunc(lastThis, lastArgs);
          if (res && typeof res.then === 'function') {
            res.catch(() => {});
          }
          return res;
        }
        catch (error) {
          return;
        }
      }
      timeoutId = setTimeout(timerExpired, remainingTime);
    }
    else {
      timeoutId = undefined;
      pendingPromises.forEach(({ resolve }) => resolve(result));
      pendingPromises = [];
    }
  };

  const cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    trailingInvoked = false;
    lastInvokeTime = 0;
    lastArgs = lastThis = undefined;
  };

  const flush = () => {
    if (timeoutId === undefined) {
      return result;
    }
    return invokeFunc(lastThis, lastArgs);
  };

  const pending = () => {
    return timeoutId !== undefined;
  };

  function throttled(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (signal?.aborted) {
      const error = new DOMException('The operation was aborted', 'AbortError');
      return Promise.reject(error);
    }

    if (isInvoking) {
      if (timeoutId === undefined) {
        const leadingResult = leadingEdge(this, args);

        if (trailing) {
          timeoutId = setTimeout(timerExpired, wait);
        }

        if (leading && !(leadingResult && typeof leadingResult.then === 'function')) {
          return leadingResult;
        }

        if (leadingResult && typeof leadingResult.then === 'function') {
          return leadingResult;
        }
      }
    }
    else {
      if (timeoutId === undefined && trailing) {
        timeoutId = setTimeout(timerExpired, remainingWait(time));
      }
    }

    return new Promise((resolve, reject) => {
      if (rejectSkipped && !isInvoking) {
        reject({
          code: 'THROTTLED',
          message: 'Call was skipped due to throttle',
          replacedBy: args,
        });
        return;
      }

      pendingPromises.push({ resolve, reject });
    });
  }

  throttled.cancel = () => {
    cancel();
    const cancellationError = new Error('The operation was cancelled.');
    cancellationError.code = 'CANCELLED';
    pendingPromises.forEach(({ reject }) => reject(cancellationError));
    pendingPromises = [];
    cleanupListener();
    return Promise.resolve();
  };

  throttled.flush = flush;
  throttled.pending = pending;

  return throttled;
};
