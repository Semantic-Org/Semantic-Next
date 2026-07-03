import { promises as fs } from 'fs';
import { build } from './lib/build.js';

/*
  Bundle builds inline dependencies (no external list, unlike the ESM build) so they
  work standalone via <script type="module">. @pagefind/modular-ui gets inlined this
  way, carrying along its own `import(\`${bundlePath}pagefind.js\`)` — a genuinely
  runtime-only path (pagefind.js doesn't exist until the pagefind CLI indexes a site)
  that Vite can't statically analyze when a consumer (e.g. docs) later loads our bundle.
  Mark it ignorable at the source so the comment survives into dist/bundle output.
  @preserve keeps esbuild's minifier from stripping the comment.
*/
const ignorePagefindDynamicImport = {
  name: 'ignore-pagefind-dynamic-import',
  setup(build) {
    build.onLoad({ filter: /@pagefind[\\/]modular-ui[\\/]npm_dist[\\/]mjs[\\/]modular-core\.mjs$/ }, async (args) => {
      const contents = await fs.readFile(args.path, 'utf8');
      return {
        contents: contents.replace(
          'await import(`${this.options.bundlePath}pagefind.js`)',
          'await import(/* @preserve @vite-ignore */ `${this.options.bundlePath}pagefind.js`)',
        ),
        loader: 'js',
      };
    });
  },
};

export const buildBundle = async ({
  watch = false,
  minify = true,
  plugins = [],
  ...config
} = {}) => {
  const tasks = [];
  const bundlePlugins = [...plugins, ignorePagefindDynamicImport];

  tasks.push(
    build({
      ...config,
      watch,
      bundle: true,
      minify: false,
      plugins: bundlePlugins,
    }),
  );

  if (minify) {
    tasks.push(
      build({
        ...config,
        watch,
        bundle: true,
        minify: true,
        plugins: bundlePlugins,
      }),
    );
  }

  return Promise.all(tasks);
};

// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildBundle();
  })();
}
