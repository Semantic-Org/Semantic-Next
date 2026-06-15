/*
  Vite plugin for Semantic UI. Three jobs, one drop-in:

    - the ?ast loader (Vite resolves ?raw natively)
    - SSR config so the framework packages bundle through Vite, not Node's loader
    - auto-expansion: any registered tag in the built HTML (<ui-button>, your own
      <my-widget>) is server-rendered to Declarative Shadow DOM, so it hydrates
      with no flash of an unupgraded element

  Pass `components` (the module path(s) whose import registers your components)
  to turn on auto-expansion.
*/

import { resolve } from 'node:path';

import { semanticUI } from '@semantic-ui/build';

export default function semanticUIVite({ components } = {}) {
  const entries = components ? [].concat(components) : [];
  let root = process.cwd();
  let runtime;

  // one Vite SSR runner imports the user's components AND the renderer through
  // the same module graph. the registry is a module-scoped Map, so reading it
  // from a separate graph (or a plain Node import) would see an empty registry.
  async function startRuntime() {
    const { createServer } = await import('vite');
    const server = await createServer({
      configFile: false,
      root,
      logLevel: 'silent',
      server: { middlewareMode: true, hmr: false, watch: null },
      appType: 'custom',
      plugins: [semanticUI.vite()],
      ssr: { noExternal: [/^@semantic-ui\//] },
      optimizeDeps: { noDiscovery: true },
    });
    const { runner } = server.environments.ssr;
    for (const entry of entries) {
      await runner.import(resolve(root, entry));
    }
    const { renderHTML } = await runner.import('@semantic-ui/server');
    return { renderHTML, close: () => server.close() };
  }

  return [
    semanticUI.vite(),
    {
      name: '@semantic-ui/vite:ssr',
      config() {
        return { ssr: { noExternal: [/^@semantic-ui\//] } };
      },
    },
    {
      name: '@semantic-ui/vite:expand',
      configResolved(config) {
        root = config.root;
      },
      transformIndexHtml: {
        order: 'post',
        async handler(html) {
          if (!entries.length) {
            return;
          }
          runtime ??= startRuntime();
          const { renderHTML } = await runtime;
          return renderHTML(html, { hydrate: true });
        },
      },
      async closeBundle() {
        if (runtime) {
          (await runtime).close();
        }
      },
    },
  ];
}
