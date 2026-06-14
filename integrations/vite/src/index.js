/*
  Vite plugin for Semantic UI.

  Bundles the @semantic-ui/* packages through Vite's SSR pipeline instead of
  leaving them external. The core packages (component, renderer, templating,
  reactivity, query) ship raw ESM source with no "type":"module" field, so
  Node's native loader would treat them as CommonJS and throw on the ESM
  syntax. Passing them through Vite's transform sidesteps that.
*/

export default function semanticUI() {
  return {
    name: '@semantic-ui/vite',
    config() {
      return {
        ssr: {
          noExternal: [/^@semantic-ui\//],
        },
      };
    },
  };
}
