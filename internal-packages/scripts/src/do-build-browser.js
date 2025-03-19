import { build } from './tasks/build-browser.js';

const baseDir = process.env.BASE_DIR;

// This is called from npm script to build a package
(async function() {
  const result = await build({
    baseDir: baseDir,
  });
  if (!result.success) {
    process.exit(1);
  }
})();
