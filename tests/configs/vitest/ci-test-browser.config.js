import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporter: ['basic', 'json', 'junit'],
    outputFile: {
      junit: './tests/results/test-results-browser-junit.xml',
      json: './tests/results/test-results-browser.json',
    },
    onConsoleLog (log) {
      if (log.includes('Lit is in dev mode.')) return false;
    },
    workspace: './tests/configs/vitest/workspaces/vitest.browser.workspace.js'
  },
});
