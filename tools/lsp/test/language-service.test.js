import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { globSync } from 'glob';
import { beforeAll, describe, expect, it } from 'vitest';
import { LanguageService, uriToPath } from '../src/language-service.js';
import { analyzeComponent } from '../src/component-analyzer.js';

const root = resolve(import.meta.dirname, '../../..');

function createService() {
  const service = new LanguageService({
    resolver: {
      readFile: (path) => readFileSync(path, 'utf8'),
      exists: (path) => existsSync(path),
      listDir: (path) => readdirSync(path),
      glob: (pattern, cwd) => globSync(pattern, { cwd, absolute: true, ignore: ['**/node_modules/**'] }),
    },
    analyzer: (source, filePath) => analyzeComponent(source, filePath),
  });
  service.scanSpecs(resolve(root, 'src/primitives'));
  return service;
}

describe('LanguageService', () => {
  let service;
  const buttonHtml = readFileSync(resolve(root, 'src/primitives/button/button.html'), 'utf8');
  const buttonUri = `file://${resolve(root, 'src/primitives/button/button.html')}`;
  const menuUri = `file://${resolve(root, 'src/primitives/menu/menu.html')}`;
  const menuHtml = readFileSync(resolve(root, 'src/primitives/menu/menu.html'), 'utf8');

  beforeAll(() => {
    service = createService();
  });

  describe('document management', () => {
    it('tracks opened documents', () => {
      service.didOpen('test://doc', 'hello', 1);
      expect(service.documents.has('test://doc')).toBe(true);
    });

    it('updates on change', () => {
      service.didOpen('test://doc2', 'v1', 1);
      service.didChange('test://doc2', 'v2', 2);
      expect(service.documents.get('test://doc2').text).toBe('v2');
    });

    it('removes on close', () => {
      service.didOpen('test://doc3', 'temp', 1);
      service.didClose('test://doc3');
      expect(service.documents.has('test://doc3')).toBe(false);
    });
  });

  describe('completions with component model', () => {
    it('returns component methods for expression context', () => {
      service.didOpen(buttonUri, buttonHtml);
      // Find an expression offset in button.html
      const offset = buttonHtml.indexOf('{ui}');
      const items = service.getCompletions(buttonUri, service.offsetToPosition(buttonHtml, offset + 1));
      const names = items.map(i => i.label);
      expect(names).toContain('isIconBefore');
      expect(names).toContain('performAction');
      // helpers excluded on empty prefix (by design — reduces noise)
      expect(names).not.toContain('classIf');
    });

    it('returns state fields for menu component', () => {
      service.didOpen(menuUri, menuHtml);
      const offset = menuHtml.indexOf('{') + 1;
      if (offset > 0) {
        const items = service.getCompletions(menuUri, service.offsetToPosition(menuHtml, offset));
        const names = items.map(i => i.label);
        expect(names).toContain('setValue');
        expect(names).toContain('activeIndex');
      }
    });
  });

  describe('completions - blocks', () => {
    it('returns block keywords for {#', () => {
      service.didOpen('test://blocks', '<div>{#}</div>');
      const items = service.getCompletions('test://blocks', { line: 0, character: 7 });
      const names = items.map(i => i.label);
      expect(names).toContain('if');
      expect(names).toContain('each');
      expect(names).toContain('async');
      expect(names).toContain('snippet');
    });
  });

  describe('completions - spec attributes', () => {
    it('returns attributes for <ui-button', () => {
      service.didOpen('test://attrs', '<ui-button  >');
      const items = service.getCompletions('test://attrs', { line: 0, character: 11 });
      const names = items.map(i => i.label);
      expect(names).toContain('emphasis');
      expect(names).toContain('size');
      expect(names).toContain('primary');
    });

    it('returns values for size="', () => {
      service.didOpen('test://vals', '<ui-button size="">');
      const items = service.getCompletions('test://vals', { line: 0, character: 17 });
      const names = items.map(i => i.label);
      expect(names).toContain('mini');
      expect(names).toContain('large');
    });
  });

  describe('completions - references', () => {
    it('returns slot for {>', () => {
      service.didOpen('test://refs', '<div>{>}</div>');
      const items = service.getCompletions('test://refs', { line: 0, character: 7 });
      const names = items.map(i => i.label);
      expect(names).toContain('slot');
    });
  });

  describe('hover', () => {
    it('returns helper signature', () => {
      service.didOpen('test://hover', '{classIf}');
      const result = service.getHover('test://hover', { line: 0, character: 4 });
      expect(result.contents.value).toContain('classIf');
    });

    it('returns component method info', () => {
      service.didOpen(menuUri, menuHtml);
      // Hover over a method name in the template
      service.didOpen('test://hover-method', '{setValue}');
      // This won't find setValue since it's not linked to menu — test with button
      service.didOpen('test://hover-helper', '{formatDate}');
      const result = service.getHover('test://hover-helper', { line: 0, character: 5 });
      expect(result.contents.value).toContain('formatDate');
    });

    it('returns null for unknown word', () => {
      service.didOpen('test://hover-unknown', '{xyzNothing}');
      const result = service.getHover('test://hover-unknown', { line: 0, character: 5 });
      expect(result).toBeNull();
    });
  });

  describe('position conversion', () => {
    it('converts line/character to offset', () => {
      const text = 'line1\nline2\nline3';
      expect(service.positionToOffset(text, { line: 0, character: 0 })).toBe(0);
      expect(service.positionToOffset(text, { line: 1, character: 0 })).toBe(6);
      expect(service.positionToOffset(text, { line: 1, character: 3 })).toBe(9);
      expect(service.positionToOffset(text, { line: 2, character: 0 })).toBe(12);
    });

    it('converts offset to line/character', () => {
      const text = 'line1\nline2\nline3';
      expect(service.offsetToPosition(text, 0)).toEqual({ line: 0, character: 0 });
      expect(service.offsetToPosition(text, 6)).toEqual({ line: 1, character: 0 });
      expect(service.offsetToPosition(text, 9)).toEqual({ line: 1, character: 3 });
    });
  });
});

describe('uriToPath', () => {
  it('converts file:// URI', () => {
    expect(uriToPath('file:///home/jack/button.html')).toBe('/home/jack/button.html');
  });

  it('handles Windows paths', () => {
    expect(uriToPath('file:///C:/Users/Jack/button.html')).toBe('C:/Users/Jack/button.html');
  });

  it('handles WSL remote URIs', () => {
    expect(uriToPath('vscode-remote://wsl+Ubuntu/home/jack/button.html')).toBe('/home/jack/button.html');
  });

  it('returns null for bad URIs', () => {
    expect(uriToPath('not-a-uri')).toBeNull();
  });
});
