import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const packageDir = path.resolve(fileURLToPath(import.meta.url), '../../..');
// inside the workspace so the bundles' bare @semantic-ui imports resolve, under a dir git ignores
const outdir = path.resolve(packageDir, '../../node_modules/.cache/semantic-ui/entry-bundles');

// a CDN serves each entry as its own bundle with sibling packages external, so the root and
// the server entry each carry their own copy of the engine registration
beforeAll(async () => {
  await build({
    entryPoints: [
      { in: path.join(packageDir, 'src/index.js'), out: 'index' },
      { in: path.join(packageDir, 'src/server/index.js'), out: 'server' },
    ],
    outdir,
    bundle: true,
    format: 'esm',
    platform: 'node',
    external: ['@semantic-ui/*'],
    logLevel: 'silent',
  });
});

afterAll(() => {
  rmSync(outdir, { recursive: true, force: true });
});

// each order runs in its own process, a fresh module graph like a page load
const load = (...entries) => {
  const imports = entries
    .map((entry, index) => `const m${index} = await import(${JSON.stringify(path.join(outdir, entry))});`)
    .join('\n');
  const code = `
    ${imports}
    const { getEngine, ServerRenderer } = await import('@semantic-ui/renderer');
    const root = m${entries.indexOf('index.js')};
    const server = m${entries.indexOf('server.js')};
    const Card = root.defineComponent({ tagName: 'entry-card', template: '<p>{title}</p>' });
    let html, error;
    try {
      html = server.renderToString(Card, { title: 'hi' });
    }
    catch (thrown) {
      error = thrown.message;
    }
    console.log(JSON.stringify({ shared: getEngine('native').serverRenderer === ServerRenderer, html, error }));
  `;
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', code], {
    cwd: packageDir,
    encoding: 'utf8',
  });
  return JSON.parse(out.trim().split('\n').pop());
};

describe('the root and server entries bundled apart', () => {
  it('share one native engine when the server entry loads first', () => {
    const { shared, html, error } = load('server.js', 'index.js');
    expect(error).toBeUndefined();
    expect(shared).toBe(true);
    expect(html).toContain('<p><!--sui:v1:0-->hi</p>');
  });

  it('share one native engine when the root loads first', () => {
    const { shared, html, error } = load('index.js', 'server.js');
    expect(error).toBeUndefined();
    expect(shared).toBe(true);
    expect(html).toContain('<p><!--sui:v1:0-->hi</p>');
  });
});
