import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({

  site: 'https://next.semantic-ui.com',

  server: {
    host: true,
    port: 8000,
  },

});
