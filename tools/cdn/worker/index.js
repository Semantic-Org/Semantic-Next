/**
 * Cloudflare Worker for cdn.semantic-ui.com
 *
 * Routes clean public URLs to R2 object keys, handles version
 * aliases (latest/canary) via 302 redirects, and sets cache headers.
 */

// SUI package names — the Worker needs to distinguish SUI from vendor routes.
// Updated when new packages are added (e.g., react wrapper).
const SUI_PACKAGES = new Set([
  'compiler',
  'component',
  'core',
  'query',
  'reactivity',
  'renderer',
  'specs',
  'tailwind',
  'templating',
  'utils',
]);

// Combo endpoint presets — loaded from R2 at runtime.
// Source of truth: `bundle` field in each component's .spec.js file,
// aggregated at build time into dist/presets.json and uploaded to _meta/presets.json.
let cachedPresets = null;
let presetsExpiry = 0;

async function getPresets(env) {
  const now = Date.now();
  if (cachedPresets && now < presetsExpiry) {
    return cachedPresets;
  }
  const object = await env.CDN_BUCKET.get('_meta/presets.json');
  if (object) {
    cachedPresets = JSON.parse(await object.text());
    presetsExpiry = now + 60_000;
  }
  return cachedPresets || {};
}

// Entry point follows the convention {name}.min.js, with core as the exception
function getSuiEntrypoint(name) {
  if (name === 'core') { return 'semantic-ui.min.js'; }
  return `${name}.min.js`;
}

// Detect combo requests: comma-separated names or preset name.
// Returns array of component names, or null if not a combo request.
async function resolveCombo(filepath, env) {
  if (filepath.includes(',')) {
    return filepath.split(',').map(s => s.trim()).filter(Boolean);
  }
  const presets = await getPresets(env);
  if (presets[filepath]) {
    return presets[filepath];
  }
  return null;
}

const CONTENT_TYPES = {
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.html': 'text/html',
  '.wasm': 'application/wasm',
  '.map': 'application/json',
};

function getContentType(filepath) {
  for (const [ext, type] of Object.entries(CONTENT_TYPES)) {
    if (filepath.endsWith(ext)) {
      return type;
    }
  }
  return 'application/octet-stream';
}

// Parse URL into route info
// Supports:
//   /core@0.18.0/semantic-ui.min.js        → SUI package
//   /@semantic-ui/core@0.18.0/...           → SUI alias (redirects to clean path)
//   /vendor/lit@3.3.2/directive.js          → third-party
//   /css                                    → framework CSS (latest)
//   /css@0.18.0                             → framework CSS (versioned)
//   /css@0.18.0.map                         → framework CSS sourcemap
//   /semantic-ui@0.18.0.css                 → framework CSS (legacy alias)
//   /semantic-ui@0.18.0.css.map             → framework CSS sourcemap (legacy alias)
//   /semantic-ui.css                        → framework CSS (legacy alias)
//   /importmap.js                           → import map loader (latest)
//   /importmap@0.18.0.js                    → versioned import map loader
function parseRoute(pathname) {
  // Import map loader — version can contain dots (semver)
  const importmapMatch = pathname.match(/^\/importmap(?:@(.+))?\.(js|json)$/);
  if (importmapMatch) {
    return {
      type: 'importmap',
      version: importmapMatch[1] || null,
      format: importmapMatch[2],
    };
  }

  // Framework CSS — /css, /css@0.18.0, /semantic-ui.css, /semantic-ui@0.18.0.css
  // Also matches .min and sourcemap variants: /semantic-ui.min.css.map, /css@0.18.0.map
  const cssShortMatch = pathname.match(/^\/css(?:@(.+?))?(\.map)?$/);
  if (cssShortMatch) {
    return {
      type: 'css',
      version: cssShortMatch[1] || 'latest',
      map: !!cssShortMatch[2],
    };
  }
  const cssMatch = pathname.match(/^\/semantic-ui(?:@(.+?))?(?:\.min)?\.css(\.map)?$/);
  if (cssMatch) {
    return {
      type: 'css',
      version: cssMatch[1] || 'latest',
      map: !!cssMatch[2],
    };
  }

  // SUI alias: /@semantic-ui/name@version/...
  const suiAliasMatch = pathname.match(/^\/@semantic-ui\/([^@]+)@([^/]+)(?:\/(.*))?$/);
  if (suiAliasMatch) {
    return {
      type: 'sui-alias',
      name: suiAliasMatch[1],
      version: suiAliasMatch[2],
      filepath: suiAliasMatch[3] || null,
    };
  }

  // Vendor: /vendor/name@version/filepath or /vendor/@scope/name@version/filepath
  const vendorMatch = pathname.match(/^\/vendor\/((?:@[^/]+\/)?[^@]+)@([^/]+)\/(.+)$/);
  if (vendorMatch) {
    return {
      type: 'vendor',
      name: vendorMatch[1],
      version: vendorMatch[2],
      filepath: vendorMatch[3],
    };
  }

  // SUI package: /name@version/filepath
  const suiMatch = pathname.match(/^\/([^@/]+)@([^/]+)(?:\/(.*))?$/);
  if (suiMatch && SUI_PACKAGES.has(suiMatch[1])) {
    return {
      type: 'sui',
      name: suiMatch[1],
      version: suiMatch[2],
      filepath: suiMatch[3] || null,
    };
  }

  // Root
  if (pathname === '/' || pathname === '') {
    return { type: 'root' };
  }

  return { type: 'unknown' };
}

// Resolve version aliases to exact versions via 302.
// Canary files are stored directly at the 'canary' path — no redirect needed.
async function resolveVersion(env, version) {
  if (version === 'latest') {
    const pointer = await env.CDN_BUCKET.get('_versions/latest');
    if (pointer) {
      return await pointer.text();
    }
    return null;
  }
  return version;
}

function cacheHeaders(version) {
  if (version === 'latest') {
    return { 'Cache-Control': 'public, max-age=300' };
  }
  if (version === 'canary') {
    return { 'Cache-Control': 'public, max-age=60' };
  }
  return { 'Cache-Control': 'public, max-age=31536000, immutable' };
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'SourceMap',
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const route = parseRoute(url.pathname);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          ...corsHeaders(),
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }

    switch (route.type) {
      case 'sui': {
        const { name, version, filepath } = route;

        // Redirect latest to exact version (canary serves directly)
        if (version === 'latest') {
          const resolved = await resolveVersion(env, version);
          if (!resolved) {
            return new Response(`Version "${version}" not found`, { status: 404 });
          }
          const redirectPath = filepath
            ? `/${name}@${resolved}/${filepath}`
            : `/${name}@${resolved}`;
          return Response.redirect(new URL(redirectPath, url.origin).href, 302);
        }

        // Combo endpoint — comma-separated components or preset name (core only)
        if (name === 'core' && filepath) {
          const comboComponents = await resolveCombo(filepath, env);
          if (comboComponents) {
            const origin = url.origin;
            const lines = comboComponents.map(
              c => `export * from "${origin}/core@${version}/${c}.min.js";`,
            );
            return new Response(lines.join('\n') + '\n', {
              headers: {
                'Content-Type': 'application/javascript',
                ...corsHeaders(),
                ...cacheHeaders(version),
              },
            });
          }
        }

        // No filepath → serve the entry point JS directly
        const resolvedFilepath = filepath || getSuiEntrypoint(name);
        const baseKey = `@semantic-ui/${name}/${version}/dist/cdn/${resolvedFilepath}`;

        // Try exact path first, then with .min.js and .js extensions
        let object = await env.CDN_BUCKET.get(baseKey);
        let servedPath = resolvedFilepath;
        if (!object && !resolvedFilepath.endsWith('.js')) {
          object = await env.CDN_BUCKET.get(`${baseKey}.min.js`);
          servedPath = `${resolvedFilepath}.min.js`;
          if (!object) {
            object = await env.CDN_BUCKET.get(`${baseKey}.js`);
            servedPath = `${resolvedFilepath}.js`;
          }
        }

        if (!object) {
          return new Response(`Not found: ${baseKey}`, { status: 404 });
        }

        // SourceMap header so browsers resolve maps correctly for bare URLs
        const sourceMapHeader = servedPath.endsWith('.js')
          ? { 'SourceMap': `/${name}@${version}/${servedPath}.map` }
          : {};

        return new Response(object.body, {
          headers: {
            'Content-Type': getContentType(servedPath),
            ...sourceMapHeader,
            ...corsHeaders(),
            ...cacheHeaders(version),
          },
        });
      }

      case 'sui-alias': {
        const { name, version, filepath } = route;
        const redirectPath = filepath
          ? `/${name}@${version}/${filepath}`
          : `/${name}@${version}`;
        return Response.redirect(new URL(redirectPath, url.origin).href, 301);
      }

      case 'vendor': {
        const { name, version, filepath } = route;
        const r2Key = `vendor/${name}/${version}/${filepath}`;
        const object = await env.CDN_BUCKET.get(r2Key);
        if (!object) {
          return new Response(`Not found: ${r2Key}`, { status: 404 });
        }

        return new Response(object.body, {
          headers: {
            'Content-Type': getContentType(filepath),
            ...corsHeaders(),
            ...cacheHeaders(version),
          },
        });
      }

      case 'css': {
        const { version, map } = route;

        if (version === 'latest') {
          const resolved = await resolveVersion(env, version);
          if (!resolved) {
            return new Response('Latest version not found', { status: 404 });
          }
          const suffix = map ? '.css.map' : '.css';
          return Response.redirect(
            new URL(`/semantic-ui@${resolved}${suffix}`, url.origin).href,
            302,
          );
        }

        // Serve minified CSS (or its sourcemap) from dist/
        const filename = map ? 'semantic-ui.min.css.map' : 'semantic-ui.min.css';
        const r2Key = `@semantic-ui/core/${version}/dist/${filename}`;
        const object = await env.CDN_BUCKET.get(r2Key);
        if (!object) {
          return new Response(`Not found: ${r2Key}`, { status: 404 });
        }

        const contentType = map ? 'application/json' : 'text/css';
        const sourceMapHeader = map ? {} : { 'SourceMap': `/semantic-ui@${version}.css.map` };

        return new Response(object.body, {
          headers: {
            'Content-Type': contentType,
            ...sourceMapHeader,
            ...corsHeaders(),
            ...cacheHeaders(version),
          },
        });
      }

      case 'importmap': {
        const { version, format } = route;
        // Unversioned (importmap.js) serves the latest file directly
        const r2Key = version
          ? `_meta/importmap@${version}.${format}`
          : `_meta/importmap.${format}`;
        const object = await env.CDN_BUCKET.get(r2Key);
        if (!object) {
          return new Response(`Import map not found`, { status: 404 });
        }

        const contentType = format === 'js' ? 'application/javascript' : 'application/json';
        const cache = version ? cacheHeaders(version) : { 'Cache-Control': 'public, max-age=300' };
        return new Response(object.body, {
          headers: {
            'Content-Type': contentType,
            ...corsHeaders(),
            ...cache,
          },
        });
      }

      case 'root': {
        const object = await env.CDN_BUCKET.get('_meta/index.html');
        if (!object) {
          return new Response('Semantic UI CDN', {
            headers: { 'Content-Type': 'text/plain' },
          });
        }
        return new Response(object.body, {
          headers: {
            'Content-Type': 'text/html',
            ...corsHeaders(),
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }

      default:
        return new Response('Not found', { status: 404 });
    }
  },
};
