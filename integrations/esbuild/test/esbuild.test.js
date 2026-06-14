import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';
import { describe, expect, it } from 'vitest';

import { semanticUI } from '../src/index.js';

const here = dirname(fileURLToPath(import.meta.url));

describe('@semantic-ui/esbuild', () => {
  it('loads ?raw imports as text', async () => {
    const result = await esbuild.build({
      entryPoints: [resolve(here, 'fixture/entry.js')],
      bundle: true,
      format: 'esm',
      write: false,
      plugins: [semanticUI()],
    });
    const output = result.outputFiles[0].text;
    expect(output).toContain('RAW_FIXTURE_CONTENT');
  });

  it('errors on a missing ?raw file', async () => {
    await expect(esbuild.build({
      stdin: { contents: "import x from './does-not-exist.html?raw'; export default x;", resolveDir: here },
      bundle: true,
      format: 'esm',
      write: false,
      logLevel: 'silent',
      plugins: [semanticUI()],
    })).rejects.toThrow();
  });
});
