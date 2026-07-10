import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    pool: 'threads',
    reporters: ['default'],
    include: ['test/**/*.test.js'],
    environment: 'node',
  },
});
