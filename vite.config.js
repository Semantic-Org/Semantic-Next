import { defineConfig } from 'vite';

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
  }
});