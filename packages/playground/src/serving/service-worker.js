/*
  Sandbox service worker — serves each session's built files at real URLs:
  {scope}sui-playground-v1/{sessionId}/{path}

  Sessions are pushed fully materialized (no per-file round-trips to the page).
  The one async flow is session recovery: this worker can be terminated by the
  browser at any idle moment, wiping the session map. A fetch for an unknown
  session broadcasts a recovery request to window clients and holds the fetch
  briefly while the owning page re-registers and re-pushes files.
*/

import { engineVersion } from '../generated/version.js';

const namespace = 'sui-playground-v1';
const sessions = new Map();
const recoveries = new Map();
const recoveryTimeout = 4000;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const { type, sessionId } = event.data ?? {};
  if (type === 'connect' && sessionId && event.ports[0]) {
    connectSession(sessionId, event.ports[0]);
  }
});

const connectSession = (sessionId, port) => {
  // reconnect replaces any prior port — idempotent registration, never two live ports
  const session = { port, files: new Map() };
  sessions.set(sessionId, session);
  port.onmessage = (event) => {
    const { type, requestId, files } = event.data ?? {};
    if (type === 'setFiles') {
      session.files = new Map(files.map(file => [file.name, file]));
      settleRecovery(sessionId);
      port.postMessage({ type: 'ack', requestId });
    }
    else if (type === 'destroy') {
      sessions.delete(sessionId);
      port.postMessage({ type: 'ack', requestId });
    }
    else if (type === 'ping') {
      port.postMessage({ type: 'ack', requestId, version: engineVersion });
    }
  };
  port.postMessage({ type: 'connected', version: engineVersion });
};

const settleRecovery = (sessionId) => {
  const recovery = recoveries.get(sessionId);
  if (recovery) {
    recoveries.delete(sessionId);
    clearTimeout(recovery.timer);
    recovery.resolve();
  }
};

const requestRecovery = async (sessionId) => {
  let recovery = recoveries.get(sessionId);
  if (!recovery) {
    recovery = {};
    recovery.promise = new Promise((resolve) => {
      recovery.resolve = resolve;
      // expired recoveries must clear, or the next fetch short-circuits on a settled promise
      recovery.timer = setTimeout(() => {
        if (recoveries.get(sessionId) === recovery) {
          recoveries.delete(sessionId);
        }
        resolve();
      }, recoveryTimeout);
    });
    recoveries.set(sessionId, recovery);
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      client.postMessage({ type: 'sui-playground-recover', sessionId });
    }
  }
  return recovery.promise;
};

const parseSessionUrl = (url) => {
  const scopePath = new URL(self.registration.scope).pathname;
  const path = new URL(url).pathname;
  if (!path.startsWith(scopePath)) {
    return null;
  }
  const parts = path.slice(scopePath.length).split('/');
  if (parts[0] !== namespace || !parts[1]) {
    return null;
  }
  return { sessionId: parts[1], filePath: parts.slice(2).join('/') };
};

const respond = async ({ sessionId, filePath }) => {
  let session = sessions.get(sessionId);
  if (!session || session.files.size === 0) {
    await requestRecovery(sessionId);
    session = sessions.get(sessionId);
  }
  if (!session || session.files.size === 0) {
    return new Response(missingSessionPage(sessionId), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  const file = session.files.get(filePath);
  if (!file) {
    return new Response(`File not found: ${filePath}`, { status: 404 });
  }
  return new Response(file.content, {
    status: 200,
    headers: {
      'Content-Type': file.contentType,
      'Cache-Control': 'no-store',
    },
  });
};

/* Shown only when recovery failed — tells the parent frame so it can rebuild and replace the iframe */
const missingSessionPage = (sessionId) =>
  `<!doctype html>
<script>window.parent?.postMessage({ type: 'sui-playground-session-missing', sessionId: ${
    JSON.stringify(sessionId)
  } }, '*');</script>`;

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  const parsed = parseSessionUrl(event.request.url);
  if (parsed) {
    event.respondWith(respond(parsed));
  }
});
