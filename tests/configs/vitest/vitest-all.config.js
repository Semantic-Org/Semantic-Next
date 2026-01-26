import { defineConfig } from 'vitest/config';
import node from './projects/node.js';
import jsdom from './projects/jsdom.js';
import browser from './projects/browser.js';

export default defineConfig({
  server: {
    host: true,
  },
  test: {
    outdir: 'tests/',
    pool: 'threads', // ~20% faster than default 'forks' pool
    reporters: ['html'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reports: ['html'],
      include: [
        'packages/**/src/**/*.js'
      ],
      reportsDirectory: './tests/coverage',
      reportOnFailure: true
    },
    onConsoleLog (log) {
      if (log.includes('Lit is in dev mode.')) return false;
    },
    projects: [node, jsdom, browser],
  },
});
