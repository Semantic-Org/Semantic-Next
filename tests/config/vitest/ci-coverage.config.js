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
        lines: [30, 70],
        functions: [30, 70],
        branches: [30, 70],
        statements: [30, 70]
      }
    }
  },
});
