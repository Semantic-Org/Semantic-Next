/*-------------------
       Errors
--------------------*/

export const fatal = (
  message,
  {
    errorType = Error,
    metadata = {},
    onError = null,
    removeStackLines = 1,
  } = {}
) => {
  const error = new errorType(message);
  Object.assign(error, metadata);

  if (error.stack) {
    const stackLines = error.stack.split('\n');
    stackLines.splice(1, removeStackLines);
    error.stack = stackLines.join('\n');
  }

  const throwError = () => {
    if (typeof global.onError === 'function') {
      global.onError(error);
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
