import { describe, expect, it } from 'vitest';

import { rewriteBareImports, toCdnUrl } from '../src/worker/resolve.js';

const cdnBaseUrl = 'https://cdn.jsdelivr.net/npm';

describe('rewriteBareImports', () => {
  it('rewrites bare specifiers to CDN esm urls', () => {
    const source = `import confetti from 'canvas-confetti';`;
    const result = rewriteBareImports({ source, cdnBaseUrl });
    expect(result).toBe(`import confetti from 'https://cdn.jsdelivr.net/npm/canvas-confetti@latest/+esm';`);
  });

  it('pins versions from project dependencies', () => {
    const source = `import { format } from 'date-fns';`;
    const result = rewriteBareImports({ source, cdnBaseUrl, dependencies: { 'date-fns': '^3.6.0' } });
    expect(result).toContain('date-fns@3.6.0/+esm');
  });

  it('handles scoped packages with subpaths', () => {
    const source = `import x from '@scope/pkg/sub/path';`;
    const result = rewriteBareImports({ source, cdnBaseUrl });
    expect(result).toContain('@scope/pkg@latest/sub/path/+esm');
  });

  it('leaves import-map entries bare', () => {
    const source = `import { defineComponent } from '@semantic-ui/component';`;
    const importMap = { imports: { '@semantic-ui/component': '/node_modules/@semantic-ui/component/src/index.js' } };
    expect(rewriteBareImports({ source, cdnBaseUrl, importMap })).toBe(source);
  });

  it('matches import-map prefix keys', () => {
    const source = `import x from '@semantic-ui/core/button';`;
    const importMap = { imports: { '@semantic-ui/core/': '/packages/core/' } };
    expect(rewriteBareImports({ source, cdnBaseUrl, importMap })).toBe(source);
  });

  it('leaves relative and absolute specifiers untouched', () => {
    const source = [
      `import a from './local.js';`,
      `import b from '../up.js';`,
      `import c from 'https://example.com/x.js';`,
      `import d from '/rooted.js';`,
    ].join('\n');
    expect(rewriteBareImports({ source, cdnBaseUrl })).toBe(source);
  });

  it('rewrites static dynamic imports and skips expression imports', () => {
    const source = `const mod = await import('lodash-es');\nconst dyn = await import(someVar);`;
    const result = rewriteBareImports({ source, cdnBaseUrl });
    expect(result).toContain(`import('https://cdn.jsdelivr.net/npm/lodash-es@latest/+esm')`);
    expect(result).toContain('import(someVar)');
  });

  it('returns source unchanged when parsing fails', () => {
    const source = `import { from 'broken`;
    expect(rewriteBareImports({ source, cdnBaseUrl })).toBe(source);
  });
});

describe('toCdnUrl', () => {
  it('uses plain paths for non-jsdelivr CDNs', () => {
    const url = toCdnUrl({ specifier: 'canvas-confetti', cdnBaseUrl: 'https://cdn.semantic-ui.com', dependencies: {} });
    expect(url).toBe('https://cdn.semantic-ui.com/canvas-confetti@latest');
  });
});
