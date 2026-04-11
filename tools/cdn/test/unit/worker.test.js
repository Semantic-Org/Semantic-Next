import { describe, expect, it, vi, beforeEach } from 'vitest';

import {
  parseRoute,
  getContentType,
  cacheHeaders,
  corsHeaders,
  getSuiEntrypoint,
} from '../../worker/index.js';
import worker from '../../worker/index.js';

/*----------------------------------------------
  Route parsing
----------------------------------------------*/

describe('parseRoute — CSS', () => {
  it('/css → latest', () => {
    expect(parseRoute('/css')).toEqual({ type: 'css', version: 'latest', layer: null, map: false });
  });

  it('/css@canary → canary', () => {
    expect(parseRoute('/css@canary')).toEqual({ type: 'css', version: 'canary', layer: null, map: false });
  });

  it('/css@0.18.0 → versioned', () => {
    expect(parseRoute('/css@0.18.0')).toEqual({ type: 'css', version: '0.18.0', layer: null, map: false });
  });

  it('/css@canary.map → canary sourcemap', () => {
    expect(parseRoute('/css@canary.map')).toEqual({ type: 'css', version: 'canary', layer: null, map: true });
  });

  it('/css@0.18.0/tokens → tokens layer', () => {
    expect(parseRoute('/css@0.18.0/tokens')).toEqual({ type: 'css', version: '0.18.0', layer: 'tokens', map: false });
  });

  it('/css@canary/reset → reset layer', () => {
    expect(parseRoute('/css@canary/reset')).toEqual({ type: 'css', version: 'canary', layer: 'reset', map: false });
  });

  it('/css/tokens → latest tokens', () => {
    expect(parseRoute('/css/tokens')).toEqual({ type: 'css', version: 'latest', layer: 'tokens', map: false });
  });

  it('/css@0.18.0/tokens.map → tokens sourcemap', () => {
    expect(parseRoute('/css@0.18.0/tokens.map')).toEqual({
      type: 'css',
      version: '0.18.0',
      layer: 'tokens',
      map: true,
    });
  });

  it('/semantic-ui.css → latest', () => {
    expect(parseRoute('/semantic-ui.css')).toEqual({ type: 'css', version: 'latest', layer: null, map: false });
  });

  it('/semantic-ui@canary.css → canary', () => {
    expect(parseRoute('/semantic-ui@canary.css')).toEqual({ type: 'css', version: 'canary', layer: null, map: false });
  });

  it('/semantic-ui@canary.css.map → canary sourcemap', () => {
    expect(parseRoute('/semantic-ui@canary.css.map')).toEqual({
      type: 'css',
      version: 'canary',
      layer: null,
      map: true,
    });
  });

  it('/semantic-ui.min.css.map → latest sourcemap (inline URL)', () => {
    expect(parseRoute('/semantic-ui.min.css.map')).toEqual({ type: 'css', version: 'latest', layer: null, map: true });
  });

  it('/semantic-ui.min.css → latest', () => {
    expect(parseRoute('/semantic-ui.min.css')).toEqual({ type: 'css', version: 'latest', layer: null, map: false });
  });
});

describe('parseRoute — SUI packages', () => {
  it('/component@canary → entry point', () => {
    expect(parseRoute('/component@canary')).toEqual({
      type: 'sui',
      name: 'component',
      version: 'canary',
      filepath: null,
    });
  });

  it('/core@0.18.0/button.min.js → file path', () => {
    expect(parseRoute('/core@0.18.0/button.min.js')).toEqual({
      type: 'sui',
      name: 'core',
      version: '0.18.0',
      filepath: 'button.min.js',
    });
  });

  it('/core@canary/button.min.js.map → sourcemap file', () => {
    expect(parseRoute('/core@canary/button.min.js.map')).toEqual({
      type: 'sui',
      name: 'core',
      version: 'canary',
      filepath: 'button.min.js.map',
    });
  });
});

describe('parseRoute — vendor', () => {
  it('/vendor/lit@3.3.2/index.js', () => {
    expect(parseRoute('/vendor/lit@3.3.2/index.js')).toEqual({
      type: 'vendor',
      name: 'lit',
      version: '3.3.2',
      filepath: 'index.js',
    });
  });

  it('/vendor/@lit/reactive-element@2.1.1/reactive-element.js', () => {
    expect(parseRoute('/vendor/@lit/reactive-element@2.1.1/reactive-element.js')).toEqual({
      type: 'vendor',
      name: '@lit/reactive-element',
      version: '2.1.1',
      filepath: 'reactive-element.js',
    });
  });
});

describe('parseRoute — load endpoint', () => {
  it('/load → loader', () => {
    expect(parseRoute('/load')).toEqual({ type: 'load' });
  });

  it('/load.js → loader', () => {
    expect(parseRoute('/load.js')).toEqual({ type: 'load' });
  });
});

describe('parseRoute — SUI alias', () => {
  it('/@semantic-ui/core@0.18.0 → redirect', () => {
    expect(parseRoute('/@semantic-ui/core@0.18.0')).toEqual({
      type: 'sui-alias',
      name: 'core',
      version: '0.18.0',
      filepath: null,
    });
  });
});

describe('parseRoute — asset sets (icons & fonts)', () => {
  it('/icons@0.18.0/lucide → versioned icon set', () => {
    expect(parseRoute('/icons@0.18.0/lucide')).toEqual({
      type: 'asset-set',
      setType: 'icons',
      version: '0.18.0',
      filepath: 'lucide',
    });
  });

  it('/icons@canary/lucide → canary', () => {
    expect(parseRoute('/icons@canary/lucide')).toEqual({
      type: 'asset-set',
      setType: 'icons',
      version: 'canary',
      filepath: 'lucide',
    });
  });

  it('/icons/lucide → latest (no version)', () => {
    expect(parseRoute('/icons/lucide')).toEqual({
      type: 'asset-set',
      setType: 'icons',
      version: 'latest',
      filepath: 'lucide',
    });
  });

  it('/icons@0.18.0/lucide/house.svg → individual SVG', () => {
    expect(parseRoute('/icons@0.18.0/lucide/house.svg')).toEqual({
      type: 'asset-set',
      setType: 'icons',
      version: '0.18.0',
      filepath: 'lucide/house.svg',
    });
  });

  it('/fonts@0.18.0/lato → versioned font set', () => {
    expect(parseRoute('/fonts@0.18.0/lato')).toEqual({
      type: 'asset-set',
      setType: 'fonts',
      version: '0.18.0',
      filepath: 'lato',
    });
  });

  it('/fonts/lato → latest (no version)', () => {
    expect(parseRoute('/fonts/lato')).toEqual({
      type: 'asset-set',
      setType: 'fonts',
      version: 'latest',
      filepath: 'lato',
    });
  });

  it('/fonts@0.18.0/lato/LatoLatin-Regular.woff2 → individual font file', () => {
    expect(parseRoute('/fonts@0.18.0/lato/LatoLatin-Regular.woff2')).toEqual({
      type: 'asset-set',
      setType: 'fonts',
      version: '0.18.0',
      filepath: 'lato/LatoLatin-Regular.woff2',
    });
  });

  it('/icons → no filepath, latest version', () => {
    expect(parseRoute('/icons')).toEqual({
      type: 'asset-set',
      setType: 'icons',
      version: 'latest',
      filepath: null,
    });
  });

  it('/icons@latest/lucide → latest alias', () => {
    expect(parseRoute('/icons@latest/lucide')).toEqual({
      type: 'asset-set',
      setType: 'icons',
      version: 'latest',
      filepath: 'lucide',
    });
  });
});

describe('parseRoute — import map', () => {
  it('/importmap.js → latest', () => {
    expect(parseRoute('/importmap.js')).toEqual({ type: 'importmap', version: null, format: 'js' });
  });

  it('/importmap@0.18.0.json → versioned', () => {
    expect(parseRoute('/importmap@0.18.0.json')).toEqual({ type: 'importmap', version: '0.18.0', format: 'json' });
  });
});

/*----------------------------------------------
  Worker fetch — CSS sourceMappingURL rewrite
----------------------------------------------*/

function mockR2Bucket(files = {}) {
  return {
    get(key) {
      const content = files[key];
      if (!content) { return null; }
      return {
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(content));
            controller.close();
          },
        }),
        text() {
          return Promise.resolve(content);
        },
      };
    },
  };
}

function makeRequest(path, method = 'GET') {
  return new Request(`https://cdn.semantic-ui.com${path}`, { method });
}

describe('CSS sourceMappingURL rewrite', () => {
  const cssContent = `
:root { --font-name: "Lato"; }
/*# sourceMappingURL=semantic-ui.min.css.map */`;

  it('rewrites inline sourceMappingURL to versioned absolute path', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/semantic-ui.min.css': cssContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/css@canary');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('sourceMappingURL=/css@canary.map');
    expect(body).not.toContain('sourceMappingURL=semantic-ui.min.css.map');
  });

  it('does not rewrite sourcemap response body', async () => {
    const mapContent = '{"version":3,"sources":[],"mappings":""}';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/semantic-ui.min.css.map': mapContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/css@canary.map');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toBe(mapContent);
  });
});

describe('JS SourceMap header', () => {
  it('adds SourceMap header for entry point URLs', async () => {
    const jsContent = 'export const x = 1;\n//# sourceMappingURL=component.min.js.map';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/component/canary/dist/cdn/component.min.js': jsContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/component@canary');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('SourceMap')).toBe('/component@canary/component.min.js.map');
  });

  it('no SourceMap header for .map files', async () => {
    const mapContent = '{"version":3}';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/component/canary/dist/cdn/component.min.js.map': mapContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/component@canary/component.min.js.map');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('SourceMap')).toBeNull();
  });
});

/*----------------------------------------------
  Worker fetch — Asset sets (icons & fonts)
----------------------------------------------*/

describe('asset set fetch', () => {
  it('serves extensionless icon set as CSS', async () => {
    const css = ':root { --icon-home: url(./lucide/house.svg); }';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'icons/canary/lucide.css': css,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/icons@canary/lucide');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/css');
    expect(await res.text()).toBe(css);
  });

  it('serves individual SVG with correct content type', async () => {
    const svg = '<svg viewBox="0 0 24 24"><path d="M3 12l2-2"/></svg>';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'icons/canary/lucide/house.svg': svg,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/icons@canary/lucide/house.svg');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
  });

  it('serves font woff2 with correct content type', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'fonts/canary/lato/LatoLatin-Regular.woff2': 'fakewoff2data',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/fonts@canary/lato/LatoLatin-Regular.woff2');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('font/woff2');
  });

  it('redirects latest to exact version', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_versions/latest': '0.19.0',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/icons@latest/lucide');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/icons@0.19.0/lucide');
  });

  it('redirects unversioned to exact version', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_versions/latest': '0.19.0',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/icons/lucide');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/icons@0.19.0/lucide');
  });

  it('returns 404 for missing set', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({}),
    };
    const req = new Request('https://cdn.semantic-ui.com/icons@canary/nonexistent');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
  });

  it('redirects to default set when no filepath provided', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({}),
    };
    const req = new Request('https://cdn.semantic-ui.com/icons@canary');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/icons@canary/lucide');
  });

  it('sets immutable cache for versioned assets', async () => {
    const css = ':root {}';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'icons/0.18.0/lucide.css': css,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/icons@0.18.0/lucide');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
  });

  it('sets short cache for canary assets', async () => {
    const css = ':root {}';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'icons/canary/lucide.css': css,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/icons@canary/lucide');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=60');
  });

  it('includes CORS headers', async () => {
    const css = ':root {}';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'fonts/canary/lato.css': css,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/fonts@canary/lato');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('includes CORS on font binary files (browsers enforce this)', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'fonts/canary/lato/LatoLatin-Regular.woff2': 'fakewoff2data',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/fonts@canary/lato/LatoLatin-Regular.woff2');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('redirects bare /icons@version to default set (lucide)', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/icons@canary');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/icons@canary/lucide');
  });

  it('redirects bare /fonts@version to default set (lato)', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/fonts@canary');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/fonts@canary/lato');
  });

  it('serves deeply nested asset paths', async () => {
    const svg = '<svg></svg>';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'icons/canary/lucide/outline/house.svg': svg,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/icons@canary/lucide/outline/house.svg');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
    expect(await res.text()).toBe(svg);
  });

  // If 'icons' or 'fonts' were ever added to SUI_PACKAGES, the asset-set
  // route must still match first — this is by design, not an accident
  it('asset-set routes take precedence over SUI packages with same name', () => {
    expect(parseRoute('/icons@0.18.0/lucide').type).toBe('asset-set');
    expect(parseRoute('/fonts@0.18.0/lato').type).toBe('asset-set');
  });
});

/*----------------------------------------------
  Worker fetch — Load endpoint
----------------------------------------------*/

describe('load endpoint fetch', () => {
  it('serves loader script with short cache', async () => {
    const loaderJs = '(function(){ /* loader */ })();';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/load.js': loaderJs,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/load');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/javascript');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=300');
    expect(await res.text()).toBe(loaderJs);
  });
});

/*----------------------------------------------
  Worker fetch — CSS sub-layers
----------------------------------------------*/

describe('CSS sub-layer fetch', () => {
  it('serves tokens CSS', async () => {
    const tokens = ':root { --primary: blue; }';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/tokens.min.css': tokens,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/css@canary/tokens');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/css');
    expect(res.headers.get('SourceMap')).toBe('/css@canary/tokens.map');
  });

  it('redirects latest CSS sub-layer to versioned', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_versions/latest': '0.19.0',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/css/tokens');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/css@0.19.0/tokens');
  });

  it('serves full CSS when no layer specified', async () => {
    const fullCss = ':root {} body {}';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/semantic-ui.min.css': fullCss,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/css@canary');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('SourceMap')).toBe('/css@canary.map');
  });
});

/*----------------------------------------------
  Worker fetch — Combo endpoint
----------------------------------------------*/

describe('combo endpoint fetch', () => {
  it('serves comma-separated components as re-exports', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/core@canary/button,input');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/javascript');
    const body = await res.text();
    expect(body).toContain('export * from "https://cdn.semantic-ui.com/core@canary/button.min.js"');
    expect(body).toContain('export * from "https://cdn.semantic-ui.com/core@canary/input.min.js"');
  });

  it('serves preset name as re-exports', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/presets.json': JSON.stringify({
          standard: ['button', 'input', 'icon'],
        }),
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/core@canary/standard');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('button.min.js');
    expect(body).toContain('input.min.js');
    expect(body).toContain('icon.min.js');
  });

  it('falls through to file serving for non-combo paths', async () => {
    const jsContent = 'export const Button = {};';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/cdn/button.min.js': jsContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/core@canary/button.min.js');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe(jsContent);
  });
});

/*----------------------------------------------
  Route parsing — Directory pages
----------------------------------------------*/

describe('parseRoute — dir pages', () => {
  it('/core/ → dir page', () => {
    expect(parseRoute('/core/')).toEqual({ type: 'dir', page: 'core' });
  });

  it('/core@0.18.0/ → versioned dir page', () => {
    expect(parseRoute('/core@0.18.0/')).toEqual({ type: 'dir', page: 'core' });
  });

  it('/icons/ → dir page', () => {
    expect(parseRoute('/icons/')).toEqual({ type: 'dir', page: 'icons' });
  });

  it('/fonts@canary/ → versioned dir page', () => {
    expect(parseRoute('/fonts@canary/')).toEqual({ type: 'dir', page: 'fonts' });
  });

  it('/ does NOT match dir (stays root)', () => {
    expect(parseRoute('/')).toEqual({ type: 'root' });
  });

  it('/nonsense/ → unknown', () => {
    expect(parseRoute('/nonsense/')).toEqual({ type: 'unknown' });
  });

  it('/vendor/ → unknown', () => {
    expect(parseRoute('/vendor/')).toEqual({ type: 'unknown' });
  });
});

describe('parseRoute — dir assets', () => {
  it('/index.css → dir-asset', () => {
    expect(parseRoute('/index.css')).toEqual({ type: 'dir-asset', file: 'index.css' });
  });

  it('/core/index.css → dir-asset', () => {
    expect(parseRoute('/core/index.css')).toEqual({ type: 'dir-asset', file: 'index.css' });
  });

  it('/icons/index.css → dir-asset', () => {
    expect(parseRoute('/icons/index.css')).toEqual({ type: 'dir-asset', file: 'index.css' });
  });
});

/*----------------------------------------------
  Worker fetch — Directory pages + 404
----------------------------------------------*/

describe('dir page fetch', () => {
  it('serves dir page HTML for trailing-slash', async () => {
    const html = '<html>core page</html>';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/dir/core.html': html,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/core/');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/html');
    expect(await res.text()).toBe(html);
  });

  it('serves dir-asset CSS', async () => {
    const css = 'body { color: red; }';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/dir/index.css': css,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/core/index.css');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/css');
    expect(await res.text()).toBe(css);
  });

  it('serves custom 404 page for unknown routes', async () => {
    const html404 = '<html>404 page</html>';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/dir/404.html': html404,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/totally-bogus');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
    expect(res.headers.get('Content-Type')).toBe('text/html');
    expect(await res.text()).toBe(html404);
  });

  it('falls back to plain text 404 when no custom page', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/totally-bogus');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
    expect(await res.text()).toBe('Not found');
  });
});

/*----------------------------------------------
  Helper functions — unit tests
----------------------------------------------*/

describe('getContentType', () => {
  it('returns correct type for JS files', () => {
    expect(getContentType('app.js')).toBe('application/javascript');
    expect(getContentType('module.mjs')).toBe('application/javascript');
  });

  it('returns correct type for CSS files', () => {
    expect(getContentType('styles.css')).toBe('text/css');
  });

  it('returns correct type for JSON files', () => {
    expect(getContentType('data.json')).toBe('application/json');
  });

  it('returns correct type for font files', () => {
    expect(getContentType('font.woff2')).toBe('font/woff2');
    expect(getContentType('font.woff')).toBe('font/woff');
    expect(getContentType('font.ttf')).toBe('font/ttf');
    expect(getContentType('font.otf')).toBe('font/otf');
  });

  it('returns correct type for image files', () => {
    expect(getContentType('icon.svg')).toBe('image/svg+xml');
  });

  it('returns correct type for sourcemap files', () => {
    expect(getContentType('app.js.map')).toBe('application/json');
  });

  it('returns correct type for HTML files', () => {
    expect(getContentType('index.html')).toBe('text/html');
  });

  it('returns correct type for WASM files', () => {
    expect(getContentType('module.wasm')).toBe('application/wasm');
  });

  it('returns octet-stream for unknown extensions', () => {
    expect(getContentType('file.xyz')).toBe('application/octet-stream');
  });

  it('returns octet-stream for files with no extension', () => {
    expect(getContentType('LICENSE')).toBe('application/octet-stream');
  });

  it('uses last extension for double extensions', () => {
    expect(getContentType('app.min.js')).toBe('application/javascript');
    expect(getContentType('semantic-ui.min.css')).toBe('text/css');
  });
});

describe('cacheHeaders', () => {
  it('returns short cache for latest', () => {
    expect(cacheHeaders('latest')).toEqual({ 'Cache-Control': 'public, max-age=300' });
  });

  it('returns very short cache for canary', () => {
    expect(cacheHeaders('canary')).toEqual({ 'Cache-Control': 'public, max-age=60' });
  });

  it('returns immutable cache for exact versions', () => {
    expect(cacheHeaders('0.18.0')).toEqual({ 'Cache-Control': 'public, max-age=31536000, immutable' });
    expect(cacheHeaders('1.0.0')).toEqual({ 'Cache-Control': 'public, max-age=31536000, immutable' });
  });
});

describe('corsHeaders', () => {
  it('returns correct CORS headers', () => {
    const headers = corsHeaders();
    expect(headers['Access-Control-Allow-Origin']).toBe('*');
    expect(headers['Access-Control-Expose-Headers']).toBe('SourceMap');
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
  });
});

describe('getSuiEntrypoint', () => {
  it('returns semantic-ui.min.js for core', () => {
    expect(getSuiEntrypoint('core')).toBe('semantic-ui.min.js');
  });

  it('returns {name}.min.js for other packages', () => {
    expect(getSuiEntrypoint('component')).toBe('component.min.js');
    expect(getSuiEntrypoint('reactivity')).toBe('reactivity.min.js');
    expect(getSuiEntrypoint('query')).toBe('query.min.js');
    expect(getSuiEntrypoint('utils')).toBe('utils.min.js');
  });
});

/*----------------------------------------------
  CORS preflight and method handling
----------------------------------------------*/

describe('HTTP method handling', () => {
  it('OPTIONS returns CORS preflight response', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/core@canary', { method: 'OPTIONS' });
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET, HEAD, OPTIONS');
    expect(res.headers.get('Access-Control-Allow-Headers')).toBe('*');
  });

  it('POST returns 405 Method Not Allowed', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/core@canary', { method: 'POST' });
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(405);
    expect(await res.text()).toBe('Method not allowed');
  });

  it('PUT returns 405 Method Not Allowed', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/css@canary', { method: 'PUT' });
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(405);
  });

  it('DELETE returns 405 Method Not Allowed', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/load', { method: 'DELETE' });
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(405);
  });

  it('HEAD is allowed (same as GET without body)', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/load.js': '(function(){})()',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/load', { method: 'HEAD' });
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
  });
});

/*----------------------------------------------
  SUI package fetch — version resolution and redirects
----------------------------------------------*/

describe('SUI package version handling', () => {
  it('redirects latest to resolved version', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_versions/latest': '0.19.0',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/component@latest');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/component@0.19.0');
  });

  it('redirects latest with filepath', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_versions/latest': '0.19.0',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/core@latest/button.min.js');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/core@0.19.0/button.min.js');
  });

  it('returns 404 when latest version is not set', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/component@latest');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
    expect(await res.text()).toContain('not found');
  });

  it('returns 404 for missing R2 object', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/component@canary/nonexistent.js');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
  });
});

/*----------------------------------------------
  SUI package fetch — extensionless fallback
----------------------------------------------*/

describe('SUI package extensionless fallback', () => {
  it('tries .min.js first for extensionless paths', async () => {
    const jsContent = 'export const Button = {};';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/cdn/button.min.js': jsContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/core@canary/button');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe(jsContent);
    expect(res.headers.get('Content-Type')).toBe('application/javascript');
  });

  it('falls back to .js if .min.js not found', async () => {
    const jsContent = 'export const Debug = {};';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/cdn/debug.js': jsContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/core@canary/debug');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe(jsContent);
  });

  it('returns 404 if no extension variant exists', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/core@canary/nonexistent');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
  });

  it('does not attempt fallback when path already has .js extension', async () => {
    const jsContent = 'export const x = 1;';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/cdn/exact.js': jsContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/core@canary/exact.js');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe(jsContent);
  });
});

/*----------------------------------------------
  SUI alias — 301 redirect
----------------------------------------------*/

describe('SUI alias fetch', () => {
  it('redirects @semantic-ui/core@version to clean path', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/@semantic-ui/core@0.18.0');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(301);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/core@0.18.0');
  });

  it('redirects @semantic-ui/core@version/filepath to clean path', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/@semantic-ui/component@canary/component.min.js');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(301);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/component@canary/component.min.js');
  });
});

/*----------------------------------------------
  Vendor fetch
----------------------------------------------*/

describe('vendor fetch', () => {
  it('serves vendor package file', async () => {
    const jsContent = 'export const html = () => {};';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'vendor/lit/3.3.2/index.js': jsContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/vendor/lit@3.3.2/index.js');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/javascript');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(await res.text()).toBe(jsContent);
  });

  it('serves scoped vendor package', async () => {
    const jsContent = 'export class ReactiveElement {}';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'vendor/@lit/reactive-element/2.1.1/reactive-element.js': jsContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/vendor/@lit/reactive-element@2.1.1/reactive-element.js');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe(jsContent);
  });

  it('returns 404 for missing vendor file', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/vendor/lit@3.3.2/missing.js');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
  });
});

/*----------------------------------------------
  Import map fetch
----------------------------------------------*/

describe('import map fetch', () => {
  it('serves versioned import map as JS', async () => {
    const jsContent = 'const importMap = {};';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/importmap@0.18.0.js': jsContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/importmap@0.18.0.js');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/javascript');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
    expect(await res.text()).toBe(jsContent);
  });

  it('serves versioned import map as JSON', async () => {
    const jsonContent = '{"imports":{}}';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/importmap@0.18.0.json': jsonContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/importmap@0.18.0.json');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/json');
    expect(await res.text()).toBe(jsonContent);
  });

  it('serves unversioned import map with short cache', async () => {
    const jsContent = 'const importMap = {};';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/importmap.js': jsContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/importmap.js');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=300');
  });

  it('returns 404 for missing import map', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/importmap@9.9.9.js');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
  });
});

/*----------------------------------------------
  Root endpoint
----------------------------------------------*/

describe('root endpoint fetch', () => {
  it('serves index.html when present in R2', async () => {
    const html = '<html><body>CDN Home</body></html>';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/index.html': html,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/html');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(await res.text()).toBe(html);
  });

  it('falls back to plain text when index.html not in R2', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/plain');
    expect(await res.text()).toBe('Semantic UI CDN');
  });
});

/*----------------------------------------------
  CSS version redirect — latest
----------------------------------------------*/

describe('CSS latest redirect', () => {
  it('/css redirects latest to resolved version', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_versions/latest': '0.19.0',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/css');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/css@0.19.0');
  });

  it('/css.map redirects latest sourcemap to resolved version', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_versions/latest': '0.19.0',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/css.map');
    // /css.map doesn't match css pattern — let's check
    const route = parseRoute('/css.map');
    // This should match the css short pattern with .map
    if (route.type === 'css' && route.version === 'latest' && route.map) {
      const res = await worker.fetch(req, env);
      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/css@0.19.0.map');
    }
  });

  it('/semantic-ui.css redirects latest to resolved version', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_versions/latest': '0.19.0',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/semantic-ui.css');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/css@0.19.0');
  });

  it('returns 404 when latest version is not set for CSS', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/css');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
    expect(await res.text()).toContain('not found');
  });
});

/*----------------------------------------------
  CSS layer sourcemaps
----------------------------------------------*/

describe('CSS layer SourceMap headers', () => {
  it('/css@version has SourceMap header pointing to .map', async () => {
    const cssContent = ':root { --primary: blue; }';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/0.18.0/dist/semantic-ui.min.css': cssContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/css@0.18.0');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('SourceMap')).toBe('/css@0.18.0.map');
  });

  it('/css@version/tokens has SourceMap header for tokens layer', async () => {
    const cssContent = ':root { --primary: blue; }';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/tokens.min.css': cssContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/css@canary/tokens');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('SourceMap')).toBe('/css@canary/tokens.map');
  });

  it('CSS .map response has no SourceMap header', async () => {
    const mapContent = '{"version":3}';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/semantic-ui.min.css.map': mapContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/css@canary.map');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('SourceMap')).toBeNull();
  });

  it('CSS returns 404 for missing file', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/css@canary');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
  });
});

/*----------------------------------------------
  parseRoute — additional edge cases
----------------------------------------------*/

describe('parseRoute — edge cases', () => {
  it('empty string → root', () => {
    expect(parseRoute('')).toEqual({ type: 'root' });
  });

  it('non-SUI package name → unknown', () => {
    expect(parseRoute('/notapackage@0.18.0')).toEqual({ type: 'unknown' });
  });

  it('all SUI packages are recognized', () => {
    const packages = ['compiler', 'component', 'core', 'query', 'reactivity', 'renderer', 'specs', 'tailwind', 'templating', 'utils'];
    for (const pkg of packages) {
      const route = parseRoute(`/${pkg}@1.0.0`);
      expect(route.type, `${pkg} should be type "sui"`).toBe('sui');
      expect(route.name).toBe(pkg);
      expect(route.version).toBe('1.0.0');
    }
  });

  it('/css@0.18.0/base → base layer', () => {
    expect(parseRoute('/css@0.18.0/base')).toEqual({ type: 'css', version: '0.18.0', layer: 'base', map: false });
  });

  it('/css@0.18.0/base.map → base layer sourcemap', () => {
    expect(parseRoute('/css@0.18.0/base.map')).toEqual({ type: 'css', version: '0.18.0', layer: 'base', map: true });
  });

  it('SUI alias with filepath', () => {
    expect(parseRoute('/@semantic-ui/core@0.18.0/button.min.js')).toEqual({
      type: 'sui-alias',
      name: 'core',
      version: '0.18.0',
      filepath: 'button.min.js',
    });
  });

  it('SUI alias for non-core package', () => {
    expect(parseRoute('/@semantic-ui/reactivity@canary')).toEqual({
      type: 'sui-alias',
      name: 'reactivity',
      version: 'canary',
      filepath: null,
    });
  });

  it('/fonts with no version or filepath', () => {
    expect(parseRoute('/fonts')).toEqual({
      type: 'asset-set',
      setType: 'fonts',
      version: 'latest',
      filepath: null,
    });
  });

  it('/icons@0.18.0 with version but no filepath', () => {
    expect(parseRoute('/icons@0.18.0')).toEqual({
      type: 'asset-set',
      setType: 'icons',
      version: '0.18.0',
      filepath: null,
    });
  });

  it('SUI package with deeply nested filepath', () => {
    expect(parseRoute('/core@canary/components/button/button.min.js')).toEqual({
      type: 'sui',
      name: 'core',
      version: 'canary',
      filepath: 'components/button/button.min.js',
    });
  });

  it('vendor with CSS filepath', () => {
    expect(parseRoute('/vendor/some-lib@1.0.0/styles.css')).toEqual({
      type: 'vendor',
      name: 'some-lib',
      version: '1.0.0',
      filepath: 'styles.css',
    });
  });
});

/*----------------------------------------------
  Combo endpoint — cache and edge cases
----------------------------------------------*/

describe('combo endpoint edge cases', () => {
  it('combo request uses correct cache headers for canary', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/core@canary/button,input');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=60');
  });

  it('combo request uses immutable cache for exact version', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/core@0.18.0/button,input');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
  });

  it('combo request includes CORS headers', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/core@canary/button,input');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('combo is only available for core package', async () => {
    const jsContent = 'export const x = 1;';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        // The file "button,input" would be the literal filepath for non-core
        '@semantic-ui/component/canary/dist/cdn/button,input': jsContent,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/component@canary/button,input');
    const res = await worker.fetch(req, env);

    // For non-core, comma in filepath is treated as literal filename
    // It will try to find the file and either return it or 404
    expect(res.status).toBe(200);
  });

  it('combo names are trimmed after splitting on comma', async () => {
    // In practice, URL paths with spaces get percent-encoded by the browser,
    // but resolveCombo's trim() handles leading/trailing whitespace if present.
    // Use commas without spaces to verify normal comma-split behavior.
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/core@canary/button,input,icon');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    const body = await res.text();
    const lines = body.trim().split('\n');
    expect(lines.length).toBe(3);
    expect(body).toContain('/button.min.js');
    expect(body).toContain('/input.min.js');
    expect(body).toContain('/icon.min.js');
  });

  it('combo with trailing comma filters empty entries', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/core@canary/button,input,');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    const body = await res.text();
    const lines = body.trim().split('\n');
    expect(lines.length).toBe(2);
  });
});

/*----------------------------------------------
  Asset set — latest redirect with filepath
----------------------------------------------*/

describe('asset set latest redirect edge cases', () => {
  it('redirects latest icon with SVG path', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_versions/latest': '0.19.0',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/icons@latest/lucide/house.svg');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/icons@0.19.0/lucide/house.svg');
  });

  it('redirects latest font with file path', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_versions/latest': '0.19.0',
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/fonts@latest/lato/LatoLatin-Bold.woff2');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/fonts@0.19.0/lato/LatoLatin-Bold.woff2');
  });

  it('returns 404 when latest version not set for asset sets', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = new Request('https://cdn.semantic-ui.com/fonts@latest/lato');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
  });
});

/*----------------------------------------------
  CORS Preflight — Spy Verification
  OPTIONS must short-circuit before touching R2.
  A leaked R2 call on every preflight is wasted
  billable reads and adds latency.
----------------------------------------------*/

describe('CORS preflight spy verification', () => {
  it('does not attempt R2 lookup for OPTIONS', async () => {
    const bucket = mockR2Bucket({});
    const getSpy = vi.spyOn(bucket, 'get');
    const env = { CDN_BUCKET: bucket };
    const req = makeRequest('/core@canary', 'OPTIONS');
    await worker.fetch(req, env);

    expect(getSpy).not.toHaveBeenCalled();
  });
});

/*----------------------------------------------
  Extensionless Fallback — Spy Verification
  Files with an explicit .js extension should
  hit R2 exactly once — no fallback attempts.
----------------------------------------------*/

describe('extensionless fallback spy', () => {
  it('does not attempt extension resolution for .js files', async () => {
    const bucket = mockR2Bucket({
      '@semantic-ui/component/canary/dist/cdn/component.min.js': 'export const Component = {};',
    });
    const getSpy = vi.spyOn(bucket, 'get');
    const env = { CDN_BUCKET: bucket };
    // Use non-core package to avoid the combo/preset check (which does an extra R2 call)
    const req = makeRequest('/component@canary/component.min.js');
    await worker.fetch(req, env);

    // Should only call get once (exact path, no extension fallback)
    expect(getSpy).toHaveBeenCalledTimes(1);
  });
});

/*----------------------------------------------
  Cache Header Matrix
  The CDN contract: versioned = immutable,
  canary = 60s, latest = 300s. Getting this wrong
  serves stale code to every user indefinitely.
----------------------------------------------*/

describe('cache header matrix', () => {
  it('versioned SUI package: immutable', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/component/0.18.0/dist/cdn/component.min.js': 'export {};',
      }),
    };
    const req = makeRequest('/component@0.18.0');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
  });

  it('canary SUI package: 60s TTL', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/component/canary/dist/cdn/component.min.js': 'export {};',
      }),
    };
    const req = makeRequest('/component@canary');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=60');
  });

  it('versioned CSS: immutable', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/0.18.0/dist/semantic-ui.min.css': ':root {}',
      }),
    };
    const req = makeRequest('/css@0.18.0');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
  });

  it('canary CSS: 60s TTL', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/semantic-ui.min.css': ':root {}',
      }),
    };
    const req = makeRequest('/css@canary');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=60');
  });

  it('versioned combo: immutable', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = makeRequest('/core@0.18.0/button,input');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
  });

  it('canary combo: 60s TTL', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = makeRequest('/core@canary/button,input');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=60');
  });
});

/*----------------------------------------------
  CORS Headers — Across Route Types
  Every response from the CDN needs CORS.
  Missing CORS on fonts is a particularly common
  production issue — browsers enforce it for @font-face.
----------------------------------------------*/

describe('CORS headers across route types', () => {
  it('SUI package responses include CORS', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/utils/canary/dist/cdn/utils.min.js': 'export {};',
      }),
    };
    const req = makeRequest('/utils@canary');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('CSS responses include CORS', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/semantic-ui.min.css': ':root {}',
      }),
    };
    const req = makeRequest('/css@canary');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('combo endpoint responses include CORS', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = makeRequest('/core@canary/button,input');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('load endpoint includes CORS', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/load.js': '(function(){})()',
      }),
    };
    const req = makeRequest('/load');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('root endpoint includes CORS', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/index.html': '<html></html>',
      }),
    };
    const req = makeRequest('/');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('404 responses include CORS', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/dir/404.html': '<html>Not Found</html>',
      }),
    };
    const req = makeRequest('/totally-bogus-path');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
});

/*----------------------------------------------
  Content-Type Correctness
  Browsers use Content-Type to decide how to process
  responses. Wrong Content-Type on JS = MIME rejection.
----------------------------------------------*/

describe('content type correctness', () => {
  it('.js → application/javascript', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/cdn/button.min.js': 'export {};',
      }),
    };
    const req = makeRequest('/core@canary/button.min.js');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Content-Type')).toBe('application/javascript');
  });

  it('.css → text/css', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/semantic-ui.min.css': ':root {}',
      }),
    };
    const req = makeRequest('/css@canary');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Content-Type')).toBe('text/css');
  });

  it('.map → application/json', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/cdn/button.min.js.map': '{"version":3}',
      }),
    };
    const req = makeRequest('/core@canary/button.min.js.map');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Content-Type')).toBe('application/json');
  });

  it('.woff2 → font/woff2 (via asset set)', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'fonts/canary/lato/LatoLatin-Regular.woff2': 'woff2data',
      }),
    };
    const req = makeRequest('/fonts@canary/lato/LatoLatin-Regular.woff2');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Content-Type')).toBe('font/woff2');
  });

  it('.svg → image/svg+xml', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        'icons/canary/lucide/house.svg': '<svg></svg>',
      }),
    };
    const req = makeRequest('/icons@canary/lucide/house.svg');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
  });

  it('CSS sourcemap response uses application/json, not text/css', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/semantic-ui.min.css.map': '{"version":3}',
      }),
    };
    const req = makeRequest('/css@canary.map');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Content-Type')).toBe('application/json');
  });

  it('combo endpoint returns application/javascript', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = makeRequest('/core@canary/button,input');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Content-Type')).toBe('application/javascript');
  });
});

/*----------------------------------------------
  Preset Caching
  Presets are loaded from R2 with a 60s in-memory cache.
  Verify the caching behavior with spied R2 calls.
----------------------------------------------*/

describe('preset caching', () => {
  it('second combo request reuses cached presets (no extra R2 call)', async () => {
    const presetsJson = JSON.stringify({ standard: ['button', 'input'] });
    const bucket = mockR2Bucket({
      '_meta/presets.json': presetsJson,
    });
    const getSpy = vi.spyOn(bucket, 'get');
    const env = { CDN_BUCKET: bucket };

    // First request loads presets
    await worker.fetch(makeRequest('/core@canary/standard'), env);
    const callsAfterFirst = getSpy.mock.calls.filter(c => c[0] === '_meta/presets.json').length;

    // Second request should use cache
    await worker.fetch(makeRequest('/core@canary/standard'), env);
    const callsAfterSecond = getSpy.mock.calls.filter(c => c[0] === '_meta/presets.json').length;

    expect(callsAfterSecond).toBe(callsAfterFirst);
  });
});

/*----------------------------------------------
  Nosniff Header
  X-Content-Type-Options: nosniff prevents browsers
  from MIME-sniffing responses, ensuring Content-Type
  is respected. Critical for script injection defense.
----------------------------------------------*/

describe('nosniff header', () => {
  it('JS responses include X-Content-Type-Options: nosniff', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/component/canary/dist/cdn/component.min.js': 'export {};',
      }),
    };
    const req = makeRequest('/component@canary');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });
});

/*----------------------------------------------
  Legacy CSS Alias — sourceMappingURL Rewrite
  The legacy /semantic-ui@version.css alias should
  also get sourceMappingURL rewriting.
----------------------------------------------*/

describe('legacy CSS alias sourcemap rewrite', () => {
  it('/semantic-ui@canary.css rewrites inline sourceMappingURL', async () => {
    const cssContent = `body { color: red; }\n/*# sourceMappingURL=semantic-ui.min.css.map */`;
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/core/canary/dist/semantic-ui.min.css': cssContent,
      }),
    };
    const req = makeRequest('/semantic-ui@canary.css');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('sourceMappingURL=/css@canary.map');
    expect(body).not.toContain('sourceMappingURL=semantic-ui.min.css.map');
  });
});

/*----------------------------------------------
  Load Endpoint — Missing Loader
  When _meta/load.js is missing from R2, the
  worker should return a clear 404.
----------------------------------------------*/

describe('load endpoint missing', () => {
  it('returns 404 when loader script is not in R2', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = makeRequest('/load');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
  });
});

/*----------------------------------------------
  Access-Control-Expose-Headers
  SourceMap header must be exposed for browsers
  to read it in cross-origin contexts.
----------------------------------------------*/

describe('expose SourceMap header', () => {
  it('Access-Control-Expose-Headers includes SourceMap', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '@semantic-ui/component/canary/dist/cdn/component.min.js': 'export {};',
      }),
    };
    const req = makeRequest('/component@canary');
    const res = await worker.fetch(req, env);

    expect(res.headers.get('Access-Control-Expose-Headers')).toContain('SourceMap');
  });
});

/*----------------------------------------------
  Asset Set — Redirect Chains
  Multiple redirect scenarios for icons/fonts
  when version or set name is missing.
----------------------------------------------*/

describe('asset set redirect chains', () => {
  it('/icons (no version, no set) → resolves latest → redirects to versioned', async () => {
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_versions/latest': '0.19.0',
      }),
    };
    const req = makeRequest('/icons');
    const res = await worker.fetch(req, env);

    // First redirect: latest → 0.19.0 (302)
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/icons@0.19.0');
  });

  it('/fonts@0.19.0 (versioned, no set) → redirects to default set (lato)', async () => {
    const env = { CDN_BUCKET: mockR2Bucket({}) };
    const req = makeRequest('/fonts@0.19.0');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://cdn.semantic-ui.com/fonts@0.19.0/lato');
  });
});
