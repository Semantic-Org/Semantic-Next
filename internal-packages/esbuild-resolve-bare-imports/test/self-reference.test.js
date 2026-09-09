import { build } from 'esbuild';
import { describe, expect, it } from 'vitest';

import { resolveBareImports } from '../src/index.js';

const packageJson = { name: '@semantic-ui/fixture', version: '1.2.3', dependencies: { '@semantic-ui/utils': '1.2.3' } };

const bundle = async (contents) => {
  const result = await build({
    stdin: { contents, resolveDir: import.meta.dirname, loader: 'js' },
    bundle: true,
    format: 'esm',
    write: false,
    logLevel: 'silent',
    plugins: [
      resolveBareImports({
        packageJson,
        cdnRoot: 'https://cdn.example',
        resolveEntrypoint: () => '',
        resolvePackagePath: (name) => name.replace('@semantic-ui/', ''),
      }),
    ],
  });
  return result.outputFiles[0].text;
};

describe('resolveBareImports', () => {
  it('rewrites a package importing itself by name to its own root', async () => {
    const out = await bundle(`export { x } from '@semantic-ui/fixture';`);
    expect(out).toContain('"https://cdn.example/fixture@1.2.3"');
  });

  it('rewrites a dependency to its root the same way', async () => {
    const out = await bundle(`export { each } from '@semantic-ui/utils';`);
    expect(out).toContain('"https://cdn.example/utils@1.2.3"');
  });
});
