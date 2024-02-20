import { defineConfig } from 'astro/config';
import fs from 'fs';

// https://astro.build/config
export default defineConfig({

  //site: 'https://next.semantic-ui.com',

  server: {
    host: true,
    port: 443,
  },

  vite: {
    server: {
      // SSL for localhost and dev.semantic-ui.com
      // add '127.0.0.1 dev.semantic-ui.com ' to your 'etc/hosts' file to use
      https: {
        key: fs.readFileSync('./cert/dev-key.pem'),
        cert: fs.readFileSync('./cert/dev.pem')
      },
    }
  }

});
