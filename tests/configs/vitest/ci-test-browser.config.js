import { defineConfig } from 'vitest/config';
import browser from './projects/browser.js';

export default defineConfig({
  test: {
    pool: 'threads', // ~20% faster than default 'forks' pool
    reporters: [['default', { summary: false }], 'json', 'junit', 'github-actions'],
    outputFile: {
      junit: './tests/results/test-results-browser-junit.xml',
      json: './tests/results/test-results-browser.json',
    },
    onConsoleLog (log) {
      if (log.includes('Lit is in dev mode.')) return false;
    },
    projects: [browser],
  },
});
