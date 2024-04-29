import { defineConfig } from 'vitest/config';

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
        lines: 10,
        functions: 10,
        branches: 10,
        statements: 10
      }
    },
    workspace: './tests/configs/vitest/workspaces/vitest.all.workspace.js'
  },
});
