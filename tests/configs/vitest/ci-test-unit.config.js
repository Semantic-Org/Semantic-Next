import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporter: ['basic', 'junit'],
    outputFile: './tests/results/test-results-unit-junit.xml',
    workspace: './tests/configs/vitest/workspaces/vitest.unit.workspace.js'
  },
});
