import { defineConfig } from 'vitest/config';
import node from './projects/node.js';
import jsdom from './projects/jsdom.js';

export default defineConfig({
  test: {
    pool: 'threads', // ~20% faster than default 'forks' pool
    reporters: [['default', { summary: false }], 'json', 'junit'],
    outputFile: {
      junit: './tests/results/test-results-unit-junit.xml',
      json: './tests/results/test-results-unit.json',
    },
    onConsoleLog (log) {
      if (log.includes('Lit is in dev mode.')) return false;
    },
    projects: [node, jsdom],
  },
});
