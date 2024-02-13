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
      reportOnFailure: true
    }
  },
  workspace: './vitest.workspace.js'
});
