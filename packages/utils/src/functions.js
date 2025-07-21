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
    abortController
  } = options;

  // Validate options
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

  // Handle abort signal
  const handleAbort = () => {
    cancel();
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    pendingPromises.forEach(({ reject }) => reject(abortError));
    pendingPromises = [];
  };

  if (signal?.aborted) {
    throw new DOMException('The operation was aborted', 'AbortError');
  }
  signal?.addEventListener('abort', handleAbort);

  const invokeFunc = (thisArg, args) => {
    lastInvokeTime = Date.now();
    firstCallTime = undefined; // Reset for next debounce cycle
    
    try {
      const funcResult = func.apply(thisArg, args);
      
      if (funcResult instanceof Promise) {
        return funcResult.then(
          value => {
            result = value;
            pendingPromises.forEach(({ resolve }) => resolve(value));
            pendingPromises = [];
            return value;
          },
          error => {
            pendingPromises.forEach(({ reject }) => reject(error));
            pendingPromises = [];
            throw error;
          }
        );
      } else {
        result = funcResult;
        pendingPromises.forEach(({ resolve }) => resolve(funcResult));
        pendingPromises = [];
        return funcResult;
      }
    } catch (error) {
      pendingPromises.forEach(({ reject }) => reject(error));
      pendingPromises = [];
      throw error;
    }
  };

  const shouldInvoke = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeSinceFirstCall = firstCallTime ? time - firstCallTime : 0;

    return (lastCallTime === undefined || 
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 || 
            (maxWait !== undefined && timeSinceFirstCall >= maxWait));
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
    timeoutId = undefined;
    leadingInvoked = false;

    if (trailing && lastArgs) {
      try {
        const result = invokeFunc(lastThis, lastArgs);
        // Handle async rejections
        if (result instanceof Promise) {
          result.catch(() => {
            // Error already propagated to pending promises in invokeFunc
            // This catch prevents unhandled promise rejection
          });
        }
        return result;
      } catch (error) {
        // Error was already handled in invokeFunc
        return;
      }
    }
    
    // Resolve any remaining promises with the last result
    pendingPromises.forEach(({ resolve }) => resolve(result));
    pendingPromises = [];
    lastArgs = lastThis = undefined;
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

    // Track first call time for maxWait
    if (firstCallTime === undefined) {
      firstCallTime = time;
    }

    // Check if signal is aborted
    if (signal?.aborted) {
      const error = new DOMException('The operation was aborted', 'AbortError');
      return Promise.reject(error);
    }

    if (isInvoking) {
      if (timeoutId === undefined) {
        const leadingResult = leadingEdge(this, args);
        
        // For leading edge sync functions, return the result directly
        if (leading && !(leadingResult instanceof Promise)) {
          return leadingResult;
        }
        
        // For leading edge async functions or non-leading, return/create promise
        if (leadingResult instanceof Promise) {
          return leadingResult;
        }
      }
    }

    if (timeoutId === undefined && !isInvoking) {
      timeoutId = setTimeout(timerExpired, wait);
      
      // Set maxWait timer on first call if specified
      if (maxWait !== undefined && maxTimeoutId === undefined) {
        maxTimeoutId = setTimeout(() => {
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
          }
          maxTimeoutId = undefined;
          try {
            const result = invokeFunc(lastThis, lastArgs);
            // Handle async rejections
            if (result instanceof Promise) {
              result.catch(() => {
                // Error already propagated to pending promises in invokeFunc
                // This catch prevents unhandled promise rejection
              });
            }
          } catch (error) {
            // Sync errors already handled in invokeFunc
            // This catch is for any other edge cases
          }
        }, maxWait);
      }
    }

    // Return a promise for non-leading calls or when already pending
    return new Promise((resolve, reject) => {
      if (rejectSkipped && timeoutId !== undefined && !isInvoking && pendingPromises.length > 0) {
        // Previous calls are being skipped by this new call
        const skippedPromises = [...pendingPromises];
        pendingPromises = [{ resolve, reject }]; // This call will eventually execute
        
        // Reject all previous promises that were skipped
        skippedPromises.forEach(({ reject: rejectPrevious, args: prevArgs }) => {
          rejectPrevious({
            code: 'DEBOUNCED',
            message: 'Call was skipped due to debounce',
            replacedBy: prevArgs || args
          });
        });
        return;
      }
      
      pendingPromises.push({ resolve, reject, args });
    });
  }

  debounced.cancel = () => {
    cancel();
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    pendingPromises.forEach(({ reject }) => reject(abortError));
    pendingPromises = [];
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
    abortController
  } = options;

  // Validate options
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

  // Handle abort signal
  const handleAbort = () => {
    cancel();
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    pendingPromises.forEach(({ reject }) => reject(abortError));
    pendingPromises = [];
  };

  if (signal?.aborted) {
    throw new DOMException('The operation was aborted', 'AbortError');
  }
  signal?.addEventListener('abort', handleAbort);

  const invokeFunc = (thisArg, args) => {
    lastInvokeTime = Date.now();
    
    try {
      const funcResult = func.apply(thisArg, args);
      
      if (funcResult instanceof Promise) {
        return funcResult.then(
          value => {
            result = value;
            pendingPromises.forEach(({ resolve }) => resolve(value));
            pendingPromises = [];
            return value;
          },
          error => {
            pendingPromises.forEach(({ reject }) => reject(error));
            pendingPromises = [];
            throw error;
          }
        );
      } else {
        result = funcResult;
        pendingPromises.forEach(({ resolve }) => resolve(funcResult));
        pendingPromises = [];
        return funcResult;
      }
    } catch (error) {
      pendingPromises.forEach(({ reject }) => reject(error));
      pendingPromises = [];
      throw error;
    }
  };

  const shouldInvoke = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (lastCallTime === undefined || 
            timeSinceLastInvoke >= wait ||
            timeSinceLastCall < 0);
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
          const result = invokeFunc(lastThis, lastArgs);
          // Handle async rejections
          if (result instanceof Promise) {
            result.catch(() => {
              // Error already propagated to pending promises in invokeFunc
              // This catch prevents unhandled promise rejection
            });
          }
          return result;
        } catch (error) {
          // Error was already handled in invokeFunc
          return;
        }
      }
      timeoutId = setTimeout(timerExpired, remainingTime);
    } else {
      timeoutId = undefined;
      // Resolve any remaining promises with the last result
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

    // Check if signal is aborted
    if (signal?.aborted) {
      const error = new DOMException('The operation was aborted', 'AbortError');
      return Promise.reject(error);
    }

    if (isInvoking) {
      if (timeoutId === undefined) {
        const leadingResult = leadingEdge(this, args);
        
        // Set up trailing timeout if needed
        if (trailing) {
          timeoutId = setTimeout(timerExpired, wait);
        }
        
        // For leading edge sync functions, return the result directly
        if (leading && !(leadingResult instanceof Promise)) {
          return leadingResult;
        }
        
        // For leading edge async functions, return the promise
        if (leadingResult instanceof Promise) {
          return leadingResult;
        }
      }
    } else {
      // Not invoking immediately, set up timeout if not already set
      if (timeoutId === undefined && trailing) {
        timeoutId = setTimeout(timerExpired, remainingWait(time));
      }
    }

    // Return a promise for non-leading calls or when already pending
    return new Promise((resolve, reject) => {
      if (rejectSkipped && !isInvoking) {
        reject({
          code: 'THROTTLED',
          message: 'Call was skipped due to throttle',
          replacedBy: args
        });
        return;
      }
      
      pendingPromises.push({ resolve, reject });
    });
  }

  throttled.cancel = () => {
    cancel();
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    pendingPromises.forEach(({ reject }) => reject(abortError));
    pendingPromises = [];
  };

  throttled.flush = flush;
  throttled.pending = pending;

  return throttled;
};
