import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    enabled: false,
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['json-summary', 'json'],
      include: [
        'packages/**/src/**/*.js'
      ],
      reportOnFailure: true,
      thresholds: {
        lines: 60,
        branches: 60,
        functions: 60,
        statements: 60
      }
    }
  },
});
