import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/browser/**/*.test.js'],
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
});