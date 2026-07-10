/*
  Same-origin serving adapter — registers the sandbox service worker and manages
  session ports. Implements the ServingAdapter contract:

    connect() → Promise<void>
    createSession(sessionId, { onRecover }) → { baseUrl, setFiles, destroy }
    destroy()

  baseUrl is opaque to consumers. A cross-origin implementation (separate sandbox
  TLD via a proxy page) swaps in behind the same contract.
*/

import { engineVersion } from '../generated/version.js';

const namespace = 'sui-playground-v1';

const workerActivated = (registration) => {
  const worker = registration.active ?? registration.waiting ?? registration.installing;
  if (!worker) {
    return Promise.reject(new Error('Sandbox service worker failed to install'));
  }
  if (worker.state === 'activated') {
    return Promise.resolve(worker);
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Sandbox service worker activation timeout')), 10000);
    worker.addEventListener('statechange', () => {
      if (worker.state === 'activated') {
        clearTimeout(timer);
        resolve(worker);
      }
      else if (worker.state === 'redundant') {
        clearTimeout(timer);
        reject(new Error('Sandbox service worker became redundant during install'));
      }
    });
  });
};

export const createServingAdapter = ({
  serviceWorkerUrl = '/sandbox/service-worker.js',
  scope = '/sandbox/',
} = {}) => {
  let registrationPromise;
  const sessions = new Map();

  const connect = () => {
    if (!registrationPromise) {
      if (!('serviceWorker' in navigator)) {
        return Promise.reject(new Error('Service workers unavailable — sandbox previews require them'));
      }
      // not navigator.serviceWorker.ready — that resolves only for a registration
      // whose scope covers the page URL, and pages live outside the sandbox scope
      registrationPromise = navigator.serviceWorker
        .register(serviceWorkerUrl, { scope, type: 'module', updateViaCache: 'none' })
        .then(async (registration) => {
          await workerActivated(registration);
          registration.update();
          // a replacing worker severs every session port — reconnect once it activates
          registration.addEventListener('updatefound', () => {
            const incoming = registration.installing;
            incoming?.addEventListener('statechange', () => {
              if (incoming.state === 'activated') {
                for (const session of sessions.values()) {
                  session.recover();
                }
              }
            });
          });
          return registration;
        });
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'sui-playground-recover') {
          sessions.get(event.data.sessionId)?.recover();
        }
      });
    }
    return registrationPromise;
  };

  const getActiveWorker = async () => {
    const registration = await connect();
    const worker = registration.active ?? registration.waiting ?? registration.installing;
    if (!worker) {
      throw new Error('Sandbox service worker failed to activate');
    }
    return worker;
  };

  const openPort = async (sessionId) => {
    const worker = await getActiveWorker();
    const channel = new MessageChannel();
    const port = channel.port1;
    port.start();
    const connected = new Promise((resolve, reject) => {
      const onMessage = (event) => {
        if (event.data?.type === 'connected') {
          cleanup();
          resolve(event.data.version);
        }
      };
      const cleanup = () => {
        clearTimeout(timer);
        port.removeEventListener('message', onMessage);
      };
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('Sandbox session connect timeout'));
      }, 10000);
      port.addEventListener('message', onMessage);
    });
    worker.postMessage({ type: 'connect', sessionId }, [channel.port2]);
    const version = await connected;
    if (version !== engineVersion) {
      // stale worker from a previous deploy — update and reconnect once it takes over
      const registration = await connect();
      await registration.update();
      console.info(`[playground] sandbox worker updating (${version} → ${engineVersion})`);
    }
    return port;
  };

  const createSession = (sessionId, { onRecover } = {}) => {
    let portPromise = openPort(sessionId);
    let lastFiles = null;
    let requestCounter = 0;

    const sendOnce = async (message, timeout) => {
      const port = await portPromise;
      const requestId = ++requestCounter;
      return new Promise((resolve, reject) => {
        const onMessage = (event) => {
          if (event.data?.type === 'ack' && event.data.requestId === requestId) {
            cleanup();
            resolve(event.data);
          }
        };
        const cleanup = () => {
          clearTimeout(timer);
          port.removeEventListener('message', onMessage);
        };
        const timer = setTimeout(() => {
          cleanup();
          reject(new Error(`Sandbox session ${message.type} timeout`));
        }, timeout);
        port.addEventListener('message', onMessage);
        port.postMessage({ ...message, requestId });
      });
    };

    /*
      A dead port (worker replaced or terminated) answers nothing — reconnect
      and retry once. Retried setFiles always carries the latest payload so a
      slow first attempt can't resurrect files a newer send already replaced.
    */
    const send = async (message) => {
      try {
        return await sendOnce(message, 3000);
      }
      catch {
        portPromise = openPort(sessionId);
        const retry = message.type === 'setFiles' ? { ...message, files: lastFiles } : message;
        return sendOnce(retry, 10000);
      }
    };

    const session = {
      baseUrl: `${scope}${namespace}/${sessionId}/`,
      async setFiles(files) {
        lastFiles = files;
        await send({ type: 'setFiles', files });
      },
      async destroy() {
        sessions.delete(sessionId);
        await send({ type: 'destroy' }).catch(() => {});
      },
      /* service worker restarted and lost state — reconnect and re-push */
      recover() {
        portPromise = openPort(sessionId);
        if (lastFiles) {
          send({ type: 'setFiles', files: lastFiles })
            .then(() => onRecover?.())
            .catch((error) => {
              // the 404 recovery page remains the backstop; surface the failure instead of wedging silently
              console.error('[playground] sandbox session recovery failed', error);
            });
        }
      },
    };
    sessions.set(sessionId, session);
    return session;
  };

  return { connect, createSession };
};
