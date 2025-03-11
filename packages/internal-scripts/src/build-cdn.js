import { buildCDN } from './tasks/build-cdn.js';
import { resolve } from 'path';

const baseDir = process.env.BASE_DIR;

// Wrap in async function to handle top-level await
(async function() {
  const result = await buildCDN({
    baseDir: process.env.BASE_DIR
  });
  if (!result.success) {
    process.exit(1);
  }
})();
