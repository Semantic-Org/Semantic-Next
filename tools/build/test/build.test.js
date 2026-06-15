import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';
import { rollup } from 'rollup';
import { describe, expect, it } from 'vitest';

import { semanticUI } from '../src/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const entry = resolve(here, 'fixture/entry.js');

// string VALUES survive bundling verbatim even when minifiers drop quotes on
// object keys, so we assert against those rather than the JSON key syntax.
function expectLoaded(code) {
  expect(code).toContain('RAW_CSS_MARKER'); // ?raw returned the file text
  expect(code).toContain('"expression"'); // ?ast compiled — node type value
  expect(code).toContain('"title"'); // ?ast compiled — expression value
}

describe('@semantic-ui/build', () => {
  it('esbuild: loads ?raw as text and ?ast as compiled AST', async () => {
    const result = await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      format: 'esm',
      write: false,
      plugins: [semanticUI.esbuild()],
    });
    expectLoaded(result.outputFiles[0].text);
  });

  it('rollup: loads ?raw as text and ?ast as compiled AST', async () => {
    const bundle = await rollup({ input: entry, plugins: [semanticUI.rollup()] });
    const { output } = await bundle.generate({ format: 'esm' });
    await bundle.close();
    expectLoaded(output[0].code);
  });
});
