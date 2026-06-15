import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'vite';
import { describe, expect, it } from 'vitest';

import semanticUI from '../src/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, 'fixture');

describe('@semantic-ui/vite auto-expand', () => {
  it('expands a registered user tag in built HTML to DSD', async () => {
    const result = await build({
      root,
      logLevel: 'silent',
      plugins: [semanticUI({ components: ['./components.js'] })],
      build: { write: false },
    });

    const outputs = Array.isArray(result) ? result : [result];
    const html = outputs
      .flatMap((bundle) => bundle.output)
      .find((file) => file.fileName.endsWith('.html'))?.source;

    expect(html).toContain('shadowrootmode="open"'); // <my-button> became DSD
    expect(html).toContain('PROTO_BTN'); // the component's own markup
  }, 30000);
});
