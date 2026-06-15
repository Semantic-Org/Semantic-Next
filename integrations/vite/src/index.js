/*
  Vite plugin for Semantic UI.

  Adds the ?ast loader (Vite resolves ?raw natively) and configures the SSR
  pipeline so the framework packages bundle through Vite instead of Node's
  loader. Pair it with @semantic-ui/server for the actual rendering.
*/

import { semanticUI } from '@semantic-ui/build';

export default function semanticUIVite() {
  return [
    semanticUI.vite(),
    {
      name: '@semantic-ui/vite:ssr',
      config() {
        return {
          ssr: {
            noExternal: [/^@semantic-ui\//],
          },
        };
      },
    },
  ];
}
