import { describe, expect, it } from 'vitest';

import { parseRoute } from '../../worker/index.js';
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
    expect(parseRoute('/semantic-ui.css')).toEqual({ type: 'css', version: 'latest', map: false });
  });

  it('/semantic-ui@canary.css → canary', () => {
    expect(parseRoute('/semantic-ui@canary.css')).toEqual({ type: 'css', version: 'canary', map: false });
  });

  it('/semantic-ui@canary.css.map → canary sourcemap', () => {
    expect(parseRoute('/semantic-ui@canary.css.map')).toEqual({ type: 'css', version: 'canary', map: true });
  });

  it('/semantic-ui.min.css.map → latest sourcemap (inline URL)', () => {
    expect(parseRoute('/semantic-ui.min.css.map')).toEqual({ type: 'css', version: 'latest', map: true });
  });

  it('/semantic-ui.min.css → latest', () => {
    expect(parseRoute('/semantic-ui.min.css')).toEqual({ type: 'css', version: 'latest', map: false });
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
  it('/load → latest loader', () => {
    expect(parseRoute('/load')).toEqual({ type: 'load', version: null, format: 'js' });
  });

  it('/load@0.18.0 → versioned loader', () => {
    expect(parseRoute('/load@0.18.0')).toEqual({ type: 'load', version: '0.18.0', format: 'js' });
  });

  it('/load@canary → canary loader', () => {
    expect(parseRoute('/load@canary')).toEqual({ type: 'load', version: 'canary', format: 'js' });
  });

  it('/load@0.18.0.json → versioned raw JSON', () => {
    expect(parseRoute('/load@0.18.0.json')).toEqual({ type: 'load', version: '0.18.0', format: 'json' });
  });

  it('/load.json → latest raw JSON', () => {
    expect(parseRoute('/load.json')).toEqual({ type: 'load', version: null, format: 'json' });
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

  it('asset-set routes take precedence over SUI packages with same name', () => {
    expect(parseRoute('/icons@0.18.0/lucide').type).toBe('asset-set');
    expect(parseRoute('/fonts@0.18.0/lato').type).toBe('asset-set');
  });
});

/*----------------------------------------------
  Worker fetch — Load endpoint
----------------------------------------------*/

describe('load endpoint fetch', () => {
  it('serves loader script', async () => {
    const loaderJs = '(function(){ /* loader */ })();';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/load@canary.js': loaderJs,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/load@canary');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/javascript');
    expect(await res.text()).toBe(loaderJs);
  });

  it('serves raw JSON import map', async () => {
    const mapJson = '{"imports":{}}';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/load@canary.json': mapJson,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/load@canary.json');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/json');
    expect(await res.text()).toBe(mapJson);
  });

  it('serves unversioned loader from latest', async () => {
    const loaderJs = '(function(){ /* latest */ })();';
    const env = {
      CDN_BUCKET: mockR2Bucket({
        '_meta/load.js': loaderJs,
      }),
    };
    const req = new Request('https://cdn.semantic-ui.com/load');
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/javascript');
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
