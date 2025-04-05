import { build } from './lib/build.js';

// Wrapped for cli consumption
(async function() {

  const result = await build({
    esm: true,
    minify: false,
  });

  const result = await build({
    esm: true,
    minify: true,
  });

  if (!result.success) {
    process.exit(1);
  }
})();
