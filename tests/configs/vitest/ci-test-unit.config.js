import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporter: ['basic', 'json', 'junit'],
    outputFile: {
      junit: './tests/results/test-results-unit-junit.xml',
      json: './tests/results/test-results-unit.json',
    },
    workspace: './tests/configs/vitest/workspaces/vitest.unit.workspace.js'
  },
});
