import { build } from './lib/build.js';

export const buildBundle = async ({watch = false, ...config} = {}) => {
  const result = build({
    ...config,
    watch,
    bundle: true,
    minify: false
  });

  const minResult = build({
    ...config,
    watch,
    bundle: true,
    minify: true,
  });

  return await Promise.all([result, minResult]);
};

// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildBundle();
  })();
}
