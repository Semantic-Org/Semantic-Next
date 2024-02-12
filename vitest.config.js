import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    host: true,
  },
  test: {
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'json-summary', 'json'],
      include: [
        'packages/**/src/**/*.js'
      ]
    }
  },
  workspace: './vitest.workspace.js'
});
