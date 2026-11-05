import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    pool: 'threads',
    reporters: ['default'],
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          include: ['test/*.test.js'],
        },
      },
      {
        test: {
          name: 'jsdom',
          environment: 'jsdom',
          include: ['test/dom/**/*.test.js'],
        },
      },
    ],
  },
});
