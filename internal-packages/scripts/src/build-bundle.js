import { build } from './lib/build.js';

// Wrapped for cli consumption
(async function() {

  const result = await build({
    bundle: true
  });

  const minResult = await build({
    bundle: true,
    minify: true,
  });

  if (!result?.success || !minResult?.success) {
    process.exit(1);
  }

})();
