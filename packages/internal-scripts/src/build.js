import { build } from './tasks/build.js';
import { resolve } from 'path';


const baseDir = process.env.BASE_DIR;

// Wrap in async function to handle top-level await
(async function() {
  console.log('DEBUG: Running build() function for package:', baseDir);

  const result = await build({
    baseDir: baseDir
  });

  console.log('DEBUG: Build function completed with success =', result.success);

  if (!result.success) {
    process.exit(1);
  }
})();
