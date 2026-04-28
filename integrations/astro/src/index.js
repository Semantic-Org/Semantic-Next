/*
  Astro integration for Semantic UI native SSR.

  Registers a renderer that server-renders SUI components using
  Declarative Shadow DOM. Complex props (arrays, objects) are serialized
  as JSON inside the DSD template and restored during hydration.
*/

export function getContainerRenderer() {
  return {
    name: '@semantic-ui/astro',
    serverEntrypoint: '@semantic-ui/astro/server',
  };
}

export default function semanticUI() {
  return {
    name: '@semantic-ui/astro',
    hooks: {
      'astro:config:setup'({ addRenderer, updateConfig }) {
        addRenderer({
          name: '@semantic-ui/astro',
          serverEntrypoint: '@semantic-ui/astro/server',
          clientEntrypoint: '@semantic-ui/astro/client',
        });
        updateConfig({
          vite: {
            ssr: {
              noExternal: [
                /^@semantic-ui\//,
              ],
            },
            optimizeDeps: {
              include: ['@semantic-ui/astro/client'],
              exclude: ['@semantic-ui/astro/server'],
            },
          },
        });
      },
    },
  };
}
