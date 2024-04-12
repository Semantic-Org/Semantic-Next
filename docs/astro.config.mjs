import { defineConfig } from 'astro/config';
import fs from 'fs';

import lit from '@astrojs/lit';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  //site: 'https://next.semantic-ui.com',
  devToolbar: { enabled: false },

  server: {
    host: true,
    port: 443,
  },
  vite: {
    assetsInclude: ['**/*.html'],
    server: {
      // SSL for localhost and dev.semantic-ui.com
      // add '127.0.0.1 dev.semantic-ui.com ' to your 'etc/hosts' file to use
      https: {
        key: fs.readFileSync('./cert/dev-key.pem'),
        cert: fs.readFileSync('./cert/dev.pem'),
      },
    },
  },
  integrations: [lit(), mdx()],
});
