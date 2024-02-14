import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporter: ['basic', 'junit'],
    outputFile: './tests/results/test-results-all-junit.xml',
    workspace: './tests/configs/vitest/workspaces/vitest.all.workspace.js'
  },
});
