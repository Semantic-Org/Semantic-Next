import { describe, expect, it } from 'vitest';

import { buildFiles } from '../src/worker/build.js';

const cdnBaseUrl = 'https://cdn.jsdelivr.net/npm';
const importMap = { imports: { '@semantic-ui/component': '/node_modules/@semantic-ui/component/src/index.js' } };

const find = (result, name) => result.files.find(file => file.name === name);

describe('buildFiles', () => {
  it('injects the import map into documents only', async () => {
    const result = await buildFiles({
      cdnBaseUrl,
      importMap,
      files: [
        { name: 'page.html', content: '<html><head></head><body></body></html>', contentType: 'text/html' },
        { name: 'component.html', content: '<b>Count: {count}</b>', contentType: 'text/html' },
      ],
    });
    expect(find(result, 'page.html').content).toContain('<script type="importmap">');
    // template fragments must serve byte-identical — getText() consumers read them raw
    expect(find(result, 'component.html').content).toBe('<b>Count: {count}</b>');
  });

  it('injects headHTML into documents only, after the import map', async () => {
    const headHTML = '<script>document.documentElement.classList.add("dark");</script>';
    const result = await buildFiles({
      cdnBaseUrl,
      importMap,
      headHTML,
      files: [
        {
          name: 'page.html',
          content: '<!DOCTYPE html><html><head></head><body></body></html>',
          contentType: 'text/html',
        },
        { name: 'component.html', content: '<b>Count: {count}</b>', contentType: 'text/html' },
      ],
    });
    const page = find(result, 'page.html').content;
    expect(page).toContain(headHTML);
    expect(page.indexOf(headHTML)).toBeLessThan(page.indexOf('importmap'));
    expect(find(result, 'component.html').content).toBe('<b>Count: {count}</b>');
  });

  it('does not mistake a fragment containing <header> for a document', async () => {
    const content = '<header class="hero">{title}</header>';
    const result = await buildFiles({
      cdnBaseUrl,
      importMap,
      files: [{ name: 'component.html', content, contentType: 'text/html' }],
    });
    expect(find(result, 'component.html').content).toBe(content);
  });

  it('serves non-script files verbatim', async () => {
    const content = '{ "answer": 42 }';
    const result = await buildFiles({
      cdnBaseUrl,
      files: [{ name: 'data.json', content, contentType: 'application/json' }],
    });
    expect(find(result, 'data.json').content).toBe(content);
  });

  it('rewrites bare imports in js without loading typescript', async () => {
    const result = await buildFiles({
      cdnBaseUrl,
      importMap,
      files: [{
        name: 'index.js',
        content: `import { defineComponent } from '@semantic-ui/component';\nimport confetti from 'canvas-confetti';`,
        contentType: 'application/javascript',
      }],
    });
    const output = find(result, 'index.js');
    expect(output.content).toContain(`from '@semantic-ui/component'`);
    expect(output.content).toContain('canvas-confetti@latest/+esm');
  });

  it('transpiles typescript and renames outputs to .js', async () => {
    const result = await buildFiles({
      cdnBaseUrl,
      files: [{
        name: 'index.ts',
        content: `interface Point { x: number }\nconst p: Point = { x: 1 };\nexport default p;`,
        contentType: 'application/javascript',
      }],
    });
    const output = find(result, 'index.js');
    expect(output).toBeDefined();
    expect(output.content).not.toContain('interface');
    expect(output.content).toContain('const p = { x: 1 }');
  });

  it('reads dependency versions from a project package.json', async () => {
    const result = await buildFiles({
      cdnBaseUrl,
      files: [
        {
          name: 'package.json',
          content: '{ "dependencies": { "canvas-confetti": "^1.9.0" } }',
          contentType: 'application/json',
        },
        { name: 'index.js', content: `import confetti from 'canvas-confetti';`, contentType: 'application/javascript' },
      ],
    });
    expect(find(result, 'index.js').content).toContain('canvas-confetti@1.9.0/+esm');
  });

  it('reads the import map from a project file when not passed directly', async () => {
    const result = await buildFiles({
      cdnBaseUrl,
      files: [
        { name: 'import-map.js', content: JSON.stringify(importMap), contentType: 'text/importmap' },
        { name: 'page.html', content: '<html><head></head></html>', contentType: 'text/html' },
      ],
    });
    expect(find(result, 'page.html').content).toContain('@semantic-ui/component');
  });
});
