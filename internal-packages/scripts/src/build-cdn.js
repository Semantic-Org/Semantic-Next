import { build } from './lib/build.js';

// Wrapped for NPM wireit consumption
(async function() {

  const result = await build({
    cdn: true,
    minify: false
  });

  const minResult = await build({
    cdn: true,
    minify: true,
  });

  process.exit(1);

  if (!result?.success || !minResult?.success) {
    process.exit(1);
  }
})();
