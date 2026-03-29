import { describe, expect, it } from 'vitest';

import { parseRoute } from '../../worker/index.js';
import worker from '../../worker/index.js';

/*----------------------------------------------
  Route parsing
----------------------------------------------*/

describe('parseRoute — CSS', () => {
  it('/css → latest', () => {
    expect(parseRoute('/css')).toEqual({ type: 'css', version: 'latest', map: false });
  });

  it('/css@canary → canary', () => {
    expect(parseRoute('/css@canary')).toEqual({ type: 'css', version: 'canary', map: false });
  });

  it('/css@0.18.0 → versioned', () => {
    expect(parseRoute('/css@0.18.0')).toEqual({ type: 'css', version: '0.18.0', map: false });
  });

  it('/css@canary.map → canary sourcemap', () => {
    expect(parseRoute('/css@canary.map')).toEqual({ type: 'css', version: 'canary', map: true });
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
    expect(body).toContain('sourceMappingURL=/semantic-ui@canary.css.map');
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
