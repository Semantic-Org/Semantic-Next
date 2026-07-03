import { describe, expect, it } from 'vitest';

import { getContentType, isScriptFile, isTypescriptFile, normalizeFiles } from '../src/files.js';

describe('normalizeFiles', () => {
  it('flattens the consumer file object shape', () => {
    const files = normalizeFiles({
      'page.html': { content: '<html></html>', contentType: 'text/html' },
      'data.txt': 'plain string content',
    });
    expect(files).toEqual([
      { name: 'page.html', content: '<html></html>', contentType: 'text/html' },
      { name: 'data.txt', content: 'plain string content', contentType: 'text/plain; charset=utf-8' },
    ]);
  });

  it('infers content types from extensions', () => {
    const [file] = normalizeFiles({ 'app.wasm': { content: '' } });
    expect(file.contentType).toBe('application/wasm');
  });
});

describe('file type predicates', () => {
  it('classifies script and typescript files', () => {
    expect(isScriptFile('component.js')).toBe(true);
    expect(isScriptFile('component.ts')).toBe(true);
    expect(isScriptFile('component.css')).toBe(false);
    expect(isTypescriptFile('index.ts')).toBe(true);
    expect(isTypescriptFile('index.js')).toBe(false);
  });

  it('falls back to text/plain for unknown extensions', () => {
    expect(getContentType('shader.xyz')).toBe('text/plain; charset=utf-8');
  });
});
