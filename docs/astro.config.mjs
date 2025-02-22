import { defineConfig } from 'astro/config';
import fs from 'fs';
import lit from '@astrojs/lit';
import mdx from '@astrojs/mdx';
import astroExpressiveCode from 'astro-expressive-code';
import starlight from '@astrojs/starlight';

// Load the custom language definition
const sui = {
  id: 'sui',
  scopeName: 'source.sui',
  aliases: ['sui-template'],
  ...JSON.parse(fs.readFileSync('./../sui.tmlanguage.json', 'utf-8')),
  name: 'sui',
};

// for now this relies on deploying to vercel
// the site param is primarily used for the ImportMap for playground/examples
const isProduction = process.env.VERCEL_ENV === 'production';
const site = isProduction
  ? 'https://next.semantic-ui.com' // Your production URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}` // Vercel preview URL
    : 'https://dev.semantic-ui.com' // Local development URL
;

export default defineConfig({

  site,
  devToolbar: {
    enabled: false
  },
  server: {
    host: true,
    port: 443
  },
  vite: {
    assetsInclude: ['**/*.html'],
    server: {
      // SSL for localhost and dev.semantic-ui.com
      // add '127.0.0.1 dev.semantic-ui.com ' to your 'etc/hosts' file to use
      https: {
        key: fs.readFileSync('./cert/dev.semantic-ui.com-key.pem'),
        cert: fs.readFileSync('./cert/dev.semantic-ui.com.pem')
      }
    },
    ssr: {
      // Example: Force a broken package to skip SSR processing, if needed
      //external: ['playground-ide'],
    },
    optimizeDeps: {
      force: true,
      exclude: ['playground-elements'],
    },
  },
  integrations: [
    lit(),
    astroExpressiveCode({
      themes: ['github-dark'],
      useDarkModeMediaQuery: false,
      shiki: {
        langs: [sui],
      },
    }),
    mdx({}),
    starlight({
      title: 'Semantic UI'
    })
  ]
});
