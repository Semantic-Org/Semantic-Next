import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    host: true,
  },
  test: {
    reporter: ['html'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['html', 'json-summary', 'json'],
      include: [
        'packages/**/src/**/*.js'
      ],
      reportOnFailure: true
    }
  },
  workspace: './vitest.workspace.js'
});
