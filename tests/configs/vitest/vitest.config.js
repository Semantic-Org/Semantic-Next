import { defineConfig } from 'vitest/config';
import node from './projects/node.js';
import jsdom from './projects/jsdom.js';
import browser from './projects/browser.js';

export default defineConfig({
  test: {
    watch: false,
    onConsoleLog (log) {
      if (log.includes('Lit is in dev mode.')) return false;
    },
    projects: [node, jsdom, browser],
  },
});
