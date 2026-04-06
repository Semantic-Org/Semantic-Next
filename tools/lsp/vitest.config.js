import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    pool: 'threads',
    reporters: ['default'],
    onConsoleLog(log) {
      if (log.includes('Lit is in dev mode.')) { return false; }
    },
    projects: [
      {
        test: {
          include: [
            '**/test/unit/**/*.test.{ts,js}',
            '**/test/*.test.{ts,js}',
          ],
          name: 'node',
          environment: 'node',
        },
      },
    ],
  },
});
