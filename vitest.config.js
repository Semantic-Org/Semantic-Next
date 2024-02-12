import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    host: true,
  },
  test: {
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['json', 'html'],
      include: [
        'packages/**/src/**/*.js'
      ]
    }
  },
  workspace: './vitest.workspace.js'
});
