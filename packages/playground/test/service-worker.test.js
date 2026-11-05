import { beforeAll, describe, expect, it, vi } from 'vitest';

/*
  Drives the service worker through the listeners it registers on a stubbed
  `self`: a session connects over a fake port, pushes files, then fetches are
  answered the way a preview frame would see them.
*/

const scope = 'https://host.test/sandbox/';
const listeners = {};

beforeAll(async () => {
  vi.stubGlobal('self', {
    addEventListener: (type, handler) => {
      listeners[type] = handler;
    },
    skipWaiting: () => {},
    clients: { claim: () => {}, matchAll: async () => [] },
    registration: { scope },
  });
  await import('../src/serving/service-worker.js');
});

const files = [
  {
    name: 'index.html',
    content:
      '<!doctype html><html><head><script type="module" src="./app.js"></script></head><body><main id="app"></main></body></html>',
    contentType: 'text/html; charset=utf-8',
  },
  {
    name: 'own-base.html',
    content: '<html><head><base href="/elsewhere/"></head></html>',
    contentType: 'text/html; charset=utf-8',
  },
  { name: 'app.js', content: 'export const app = 1;', contentType: 'application/javascript; charset=utf-8' },
];

const connect = (sessionId, { fallback } = {}) => {
  const port = { postMessage: () => {} };
  listeners.message({ data: { type: 'connect', sessionId }, ports: [port] });
  port.onmessage({ data: { type: 'setFiles', requestId: 1, files, fallback } });
};

const fetch = (sessionId, path, { mode = 'cors' } = {}) => {
  let response;
  listeners.fetch({
    request: { method: 'GET', url: `${scope}sui-playground-v1/${sessionId}/${path}`, mode },
    respondWith: (promise) => {
      response = promise;
    },
  });
  return response;
};

describe('service worker', () => {
  it('serves session files with their content type', async () => {
    connect('plain');
    const response = await fetch('plain', 'app.js');
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/javascript; charset=utf-8');
    expect(await response.text()).toBe('export const app = 1;');
  });

  it('404s a path with no file when no fallback is set', async () => {
    connect('plain');
    const response = await fetch('plain', 'team/acme', { mode: 'navigate' });
    expect(response.status).toBe(404);
  });

  it('serves the fallback document for a navigation to a path with no file, based at the session root', async () => {
    connect('app', { fallback: 'index.html' });
    const response = await fetch('app', 'team/acme', { mode: 'navigate' });
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
    const html = await response.text();
    expect(html).toContain('<main id="app">');
    // relative urls in the document must keep resolving from the root, not from team/
    expect(html).toContain('<head><base href="/sandbox/sui-playground-v1/app/"><script');
  });

  it('serves the fallback at the session root', async () => {
    connect('app', { fallback: 'index.html' });
    const response = await fetch('app', '', { mode: 'navigate' });
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('<main id="app">');
  });

  it('leaves a fallback document that sets its own base alone', async () => {
    connect('app', { fallback: 'own-base.html' });
    const html = await (await fetch('app', 'team/acme', { mode: 'navigate' })).text();
    expect(html).toBe(files[1].content);
  });

  it('keeps 404s for asset fetches of missing files', async () => {
    connect('app', { fallback: 'index.html' });
    expect((await fetch('app', 'missing.js')).status).toBe(404);
    expect((await fetch('app', 'team/acme')).status).toBe(404);
  });

  it('404s when the fallback names a file the session lacks', async () => {
    connect('app', { fallback: 'missing.html' });
    expect((await fetch('app', 'team/acme', { mode: 'navigate' })).status).toBe(404);
  });

  it('serves an existing file ahead of the fallback, byte-identical', async () => {
    connect('app', { fallback: 'index.html' });
    expect(await (await fetch('app', 'app.js', { mode: 'navigate' })).text()).toBe('export const app = 1;');
    expect(await (await fetch('app', 'index.html', { mode: 'navigate' })).text()).toBe(files[0].content);
  });
});
