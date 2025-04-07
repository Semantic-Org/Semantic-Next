import { build } from './lib/build.js';

export const buildCDN = async ({watch = false, ...config} = {}) => {
  const result = build({
    ...config,
    watch,
    cdn: true,
    minify: false
  });

  const minResult = build({
    ...config,
    watch,
    cdn: true,
    minify: true,
  });

  return await Promise.all([result, minResult]);
};

// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildCDN();
  })();
}
