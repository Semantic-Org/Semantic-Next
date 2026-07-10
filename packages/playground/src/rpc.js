/*
  Minimal JSON-RPC 2.0 over postMessage. Used page↔worker and page↔service-worker,
  so the transport is a bag: { post, listen } — postMessage fn and subscribe fn.
*/

let requestCounter = 0;

export const createRpc = ({ post, listen }) => {
  const pending = new Map();
  const handlers = new Map();

  const receive = async (message) => {
    if (!message || message.rpc !== 1) {
      return;
    }
    if (message.id !== undefined && (message.result !== undefined || message.error !== undefined)) {
      const settle = pending.get(message.id);
      if (settle) {
        pending.delete(message.id);
        message.error
          ? settle.reject(Object.assign(new Error(message.error.message), message.error))
          : settle.resolve(message.result);
      }
      return;
    }
    const handler = handlers.get(message.method);
    if (!handler) {
      if (message.id !== undefined) {
        post({ rpc: 1, id: message.id, error: { message: `Unknown method: ${message.method}` } });
      }
      return;
    }
    if (message.id === undefined) {
      handler(message.params);
      return;
    }
    try {
      const result = await handler(message.params);
      post({ rpc: 1, id: message.id, result: result ?? null });
    }
    catch (error) {
      post({ rpc: 1, id: message.id, error: { message: error.message } });
    }
  };

  const stopListening = listen(receive);

  return {
    request(method, params, { timeout = 15000 } = {}) {
      const id = ++requestCounter;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`RPC timeout: ${method}`));
        }, timeout);
        pending.set(id, {
          resolve: (value) => {
            clearTimeout(timer);
            resolve(value);
          },
          reject: (error) => {
            clearTimeout(timer);
            reject(error);
          },
        });
        post({ rpc: 1, id, method, params });
      });
    },
    notify(method, params) {
      post({ rpc: 1, method, params });
    },
    handle(method, fn) {
      handlers.set(method, fn);
    },
    close() {
      stopListening?.();
      for (const settle of pending.values()) {
        settle.reject(new Error('RPC closed'));
      }
      pending.clear();
    },
  };
};
