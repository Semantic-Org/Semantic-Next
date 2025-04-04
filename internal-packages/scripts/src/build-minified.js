import { build } from './lib/build.js';


// This is called from npm script to build a package
(async function() {

  const result = await build({
    minify: true,
  });

  if (!result.success) {
    process.exit(1);
  }
})();
