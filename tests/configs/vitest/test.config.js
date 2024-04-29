import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    host: true,
  },
  test: {
    reporter: ['basic', 'html'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['html'],
      include: [
        'packages/**/src/**/*.js'
      ],
      reportsDirectory: './tests/coverage',
      reportOnFailure: true,
      thresholds: {
        lines: 10,
        branches: 10,
        functions: 10,
        statements: 10
      }
    },
    workspace: './tests/configs/vitest/workspaces/vitest.all.workspace.js'
  },
});
