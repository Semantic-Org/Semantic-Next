import { defineConfig } from 'vitest/config';
import node from './projects/node.js';
import jsdom from './projects/jsdom.js';
import browser from './projects/browser.js';

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['json-summary', 'json'],
      include: [
        'packages/**/src/**/*.js'
      ],
      reportOnFailure: true,
      reportsDirectory: './tests/coverage',
      thresholds: {
        lines: 30,
        functions: 30,
        branches: 30,
        statements: 30
      }
    },
    onConsoleLog (log) {
      if (log.includes('Lit is in dev mode.')) return false;
    },
    projects: [node, jsdom, browser],
  },
});
