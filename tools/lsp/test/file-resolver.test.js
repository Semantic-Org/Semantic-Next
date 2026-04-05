import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { resolveComponentFile, uriToPath } from '../src/file-resolver.js';

const root = resolve(import.meta.dirname, '../../..');

describe('uriToPath', () => {
  it('converts file:// URI to path', () => {
    expect(uriToPath('file:///home/jack/project/button.html')).toBe('/home/jack/project/button.html');
  });

  it('handles Windows file:// URI', () => {
    expect(uriToPath('file:///C:/Users/Jack/project/button.html')).toBe('C:/Users/Jack/project/button.html');
  });

  it('handles WSL vscode-remote URI', () => {
    const uri = 'vscode-remote://wsl+Ubuntu/home/jack/project/button.html';
    expect(uriToPath(uri)).toBe('/home/jack/project/button.html');
  });

  it('decodes percent-encoded characters', () => {
    expect(uriToPath('file:///home/jack/my%20project/button.html')).toBe('/home/jack/my project/button.html');
  });

  it('returns null for unparseable URI', () => {
    expect(uriToPath('not-a-uri')).toBeNull();
  });
});

describe('resolveComponentFile', () => {
  it('finds button.js for button.html by convention', () => {
    const htmlPath = resolve(root, 'src/primitives/button/button.html');
    const result = resolveComponentFile(`file://${htmlPath}`);
    expect(result).toContain('button.js');
  });

  it('finds menu.js for menu.html by convention', () => {
    const htmlPath = resolve(root, 'src/primitives/menu/menu.html');
    const result = resolveComponentFile(`file://${htmlPath}`);
    expect(result).toContain('menu.js');
  });

  it('returns null for non-existent template', () => {
    const result = resolveComponentFile('file:///nonexistent/path/foo.html');
    expect(result).toBeNull();
  });
});
