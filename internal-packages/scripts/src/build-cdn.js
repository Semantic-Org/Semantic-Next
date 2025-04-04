import { build } from './lib/build.js';


// This is called from npm script to build a package
(async function() {

  const result = await build({
    cdn: true
  });

  const minResult = await build({
    cdn: true,
    minify: true,
  });

  if (!result?.success || !minResult?.success) {
    process.exit(1);
  }
})();
