import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const packageDir = path.resolve(fileURLToPath(import.meta.url), '../../..');
const buildScript = path.resolve(packageDir, '../../internal-packages/scripts/src/build-cdn.js');
// inside the workspace so the entries' sibling packages resolve, under a dir git ignores
const outdir = path.resolve(packageDir, '../../node_modules/.cache/semantic-ui/cdn-entries');

// the CDN serves each entry as one file, with sibling packages as versioned urls shared by
// identity. here the urls become bare names node shares the same way, and the package's own
// root url becomes the root entry file beside it
const localize = (source) =>
  source
    .replace(/https:\/\/cdn\.semantic-ui\.com\/component@[\d.]+(?=["'])/g, './component.js')
    .replace(/https:\/\/cdn\.semantic-ui\.com\/([\w-]+)@[\d.]+(\/[^"']*)?/g, (_, name, sub = '') =>
      `@semantic-ui/${name}${sub}`);

beforeAll(() => {
  execFileSync(process.execPath, [buildScript], { cwd: packageDir, stdio: 'ignore' });
  mkdirSync(outdir, { recursive: true });
  for (const entry of ['component.js', 'server.js']) {
    writeFileSync(path.join(outdir, entry), localize(readFileSync(path.join(packageDir, 'dist/cdn', entry), 'utf8')));
  }
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
    const root = m${entries.indexOf('component.js')};
    const server = m${entries.indexOf('server.js')};
    root.defineComponent({ tagName: 'cdn-part', template: '<b>{label}</b>' });
    const Card = root.defineComponent({ tagName: 'cdn-card', template: '<p><cdn-part label="hi"></cdn-part></p>' });
    let html, error;
    try {
      html = server.renderToString(Card);
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

const expectOneRoot = ({ shared, html, error }) => {
  expect(error).toBeUndefined();
  expect(shared).toBe(true);
  expect(html).toContain('<cdn-card><template shadowrootmode="open">');
  // the part registered through the root expands through the server entry, one registry
  expect(html).toContain(
    '<cdn-part label="hi"><template shadowrootmode="open"><b><!--sui:v1:0-->hi</b></template></cdn-part>',
  );
};

describe('the CDN entries', () => {
  it('share the root when the server entry loads first', () => {
    expectOneRoot(load('server.js', 'component.js'));
  });

  it('share the root when the root loads first', () => {
    expectOneRoot(load('component.js', 'server.js'));
  });
});
