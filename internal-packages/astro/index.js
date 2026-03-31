/*
  Astro integration for Semantic UI native SSR.

  Registers a renderer that server-renders SUI components using
  Declarative Shadow DOM. Complex props (arrays, objects) are serialized
  as JSON inside the DSD template and restored during hydration.
*/

export default function semanticUI() {
  return {
    name: '@semantic-ui/astro',
    hooks: {
      'astro:config:setup'({ addRenderer }) {
        addRenderer({
          name: '@semantic-ui/astro',
          serverEntrypoint: new URL('./server.js', import.meta.url).pathname,
        });
      },
    },
  };
}
