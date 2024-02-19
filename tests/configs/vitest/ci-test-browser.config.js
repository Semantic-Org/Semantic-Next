import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporter: ['basic', 'json', 'junit'],
    outputFile: {
      junit: './tests/results/test-results-browser-junit.xml',
      json: './tests/results/test-results-browser.json',
    },
    workspace: './tests/configs/vitest/workspaces/vitest.browser.workspace.js'
  },
});
