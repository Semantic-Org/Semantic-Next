import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { uriToPath } from '../src/language-service.js';

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

describe('resolveComponentFile via LanguageService', () => {
  it('finds button.js for button.html by convention', async () => {
    const { readFileSync, readdirSync, existsSync } = await import('fs');
    const { globSync } = await import('glob');
    const { LanguageService } = await import('../src/language-service.js');
    const service = new LanguageService({
      resolver: {
        readFile: (p) => readFileSync(p, 'utf8'),
        exists: (p) => existsSync(p),
        listDir: (p) => readdirSync(p),
        glob: (pattern, cwd) => globSync(pattern, { cwd, absolute: true, ignore: ['**/node_modules/**'] }),
      },
    });
    const htmlPath = resolve(root, 'src/primitives/button/button.html');
    const result = service.resolveComponentFile(`file://${htmlPath}`);
    expect(result).toContain('button.js');
  });

  it('returns null for non-existent template', async () => {
    const { readFileSync, readdirSync, existsSync } = await import('fs');
    const { globSync } = await import('glob');
    const { LanguageService } = await import('../src/language-service.js');
    const service = new LanguageService({
      resolver: {
        readFile: (p) => readFileSync(p, 'utf8'),
        exists: (p) => existsSync(p),
        listDir: (p) => readdirSync(p),
        glob: (pattern, cwd) => globSync(pattern, { cwd, absolute: true, ignore: ['**/node_modules/**'] }),
      },
    });
    const result = service.resolveComponentFile('file:///nonexistent/path/foo.html');
    expect(result).toBeNull();
  });
});
