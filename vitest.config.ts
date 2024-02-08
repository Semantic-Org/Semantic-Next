import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./playwright.config.cjs'],
    coverage: {
      reporter: ['text', 'html'],
    }
  },
});
