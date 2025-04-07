import { build } from './lib/build.js';

export const buildESM = async ({watch = false, ...config} = {}) => {
  const result = await build({
    ...config,
    watch,
    esm: true,
    minify: false
  });

  const minResult = await build({
    ...config,
    watch,
    esm: true,
    minify: true,
  });

  return Promise.all([result, minResult]);
};

// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildESM();
  })();
}
