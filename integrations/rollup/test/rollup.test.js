import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { rollup } from 'rollup';
import { describe, expect, it } from 'vitest';

import semanticUI from '../src/index.js';

const here = dirname(fileURLToPath(import.meta.url));

describe('@semantic-ui/rollup', () => {
  it('loads ?raw imports as text', async () => {
    const bundle = await rollup({
      input: resolve(here, 'fixture/entry.js'),
      plugins: [semanticUI()],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    await bundle.close();
    expect(output[0].code).toContain('RAW_FIXTURE_CONTENT');
  });
});
