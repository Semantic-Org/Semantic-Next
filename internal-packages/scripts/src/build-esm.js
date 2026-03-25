import { build } from './lib/build.js';

export const buildESM = async ({
  watch = false,
  minify = true,
  ...config
} = {}) => {
  const tasks = [];

  tasks.push(
    build({
      ...config,
      watch,
      esm: true,
      minify: false,
    }),
  );

  if (minify) {
    tasks.push(
      build({
        ...config,
        watch,
        esm: true,
        minify: true,
      }),
    );
  }

  return Promise.all(tasks);
};

export const buildPageCSS = async ({
  watch = false,
  minify = true,
  ...config
} = {}) => {
  const tasks = [];

  tasks.push(
    build({
      ...config,
      watch,
      type: 'css',
      bundle: true,
      minify: false,
    }),
  );

  if (minify) {
    tasks.push(
      build({
        ...config,
        watch,
        type: 'css',
        bundle: true,
        minify: true,
      }),
    );
  }

  return Promise.all(tasks);
};

// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildESM();
  })();
}
