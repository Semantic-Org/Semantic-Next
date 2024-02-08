import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  test: {
    browser: {
      enabled: true,
      headless: true,
      name: 'chrome'
    },
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['json', 'html'],
      include: [
        'packages/**/src/**/*.js'
      ]
    }
  }
});
