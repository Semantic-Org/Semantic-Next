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
      reportOnFailure: true
    }
  },
});
