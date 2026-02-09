import codspeedPlugin from '@codspeed/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [codspeedPlugin()],
  test: {
    benchmark: {
      include: ['**/*.bench.{js,ts}'],
    },
  },
  server: {
    host: '127.0.0.1',
    hmr: false,
  },
});
