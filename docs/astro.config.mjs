import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import semanticUI from '@semantic-ui/astro';
import lit from '@semantic-ui/astro-lit';
import astroExpressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import fs from 'fs';

// Load the package version from parent package.json
const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf-8'));
const packageVersion = packageJson.version;

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
    enabled: false,
  },

  server: {
    host: true,
    port: 443,
  },

  vite: {
    resolve: {
      dedupe: [
        'lit',
        'lit-html',
        'lit-element',
        '@lit/reactive-element',
        '@codemirror/state',
        '@codemirror/view',
        '@codemirror/language',
        '@codemirror/autocomplete',
        '@codemirror/lsp-client',
      ],
    },
    define: {
      PACKAGE_VERSION: JSON.stringify(packageVersion),
    },
    assetsInclude: ['**/*.html'],
    server: {
      // SSL for localhost and dev.semantic-ui.com.
      // Add '127.0.0.1 dev.semantic-ui.com' to /etc/hosts and run `npm run cert` to generate certs.
      // Without certs, dev runs over HTTP and the REPL won't work.
      ...(fs.existsSync('./cert/dev.semantic-ui.com-key.pem') && fs.existsSync('./cert/dev.semantic-ui.com.pem')
        ? {
          https: {
            key: fs.readFileSync('./cert/dev.semantic-ui.com-key.pem'),
            cert: fs.readFileSync('./cert/dev.semantic-ui.com.pem'),
          },
          hmr: {
            host: 'dev.semantic-ui.com',
            protocol: 'wss',
          },
        }
        : (console.warn(
          '[docs] HTTPS dev server disabled — run `npm run cert` in docs/ to enable. REPL requires HTTPS.',
        ),
          {})),
      fs: {
        allow: ['..'],
      },
    },
    ssr: {
      // Example: Force a broken package to skip SSR processing, if needed
      // external: ['playground-ide'],
    },
    optimizeDeps: {
      force: true,
      exclude: [
        'playground-elements',
        '@codemirror/state',
        '@codemirror/view',
        '@codemirror/language',
        '@lezer/highlight',
        'tailwindcss-iso',
        '@semantic-ui/core',
        '@semantic-ui/query',
        '@semantic-ui/component',
        '@semantic-ui/utils',
        '@semantic-ui/reactivity',
        '@semantic-ui/templating',
      ],
    },
  },

  integrations: [
    semanticUI(),
    astroExpressiveCode(),
    mdx({}),
    starlight({
      title: 'Semantic UI',
      disable404Route: true,
    }),
  ],
  // adapter: vercel()
});
