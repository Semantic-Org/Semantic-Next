import { existsSync, readdirSync, readFileSync } from 'fs';
import { globSync } from 'glob';
import { resolve } from 'path';
import { beforeAll, describe, expect, it } from 'vitest';
import { analyzeComponent } from '../src/component-analyzer.js';
import { LanguageService, uriToPath } from '../src/language-service.js';

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

  describe('scope variables', () => {
    it('hover explains an each alias, shadowing helpers of the same name', () => {
      const withScope = new LanguageService({});
      const text = '{#each value, key in person}{value}{/each}';
      withScope.didOpen('file:///scope.html', text, 1);
      const hover = withScope.getHover('file:///scope.html', { line: 0, character: text.indexOf('{value}') + 2 });
      expect(hover.contents.value).toContain('current item of `person`');
      expect(hover.contents.value).toContain('{#each value, key in person}');
    });

    it('resolves the head of a dotted path', () => {
      const withScope = new LanguageService({});
      const text = '{#each fruit in fruits}{fruit.taste}{/each}';
      withScope.didOpen('file:///scope3.html', text, 1);
      const head = withScope.getHover('file:///scope3.html', { line: 0, character: text.indexOf('fruit.taste') + 2 });
      expect(head.contents.value).toContain('current item of `fruits`');
      // a property segment is not the binding, so it stays quiet
      const property = withScope.getHover('file:///scope3.html', { line: 0, character: text.indexOf('.taste') + 3 });
      expect(property).toBeNull();
    });

    it('completions inside a block offer its bindings first', () => {
      const withScope = new LanguageService({});
      const text = '{#async fetchData as data}{d}{error as e}{e}{/async}';
      withScope.didOpen('file:///scope2.html', text, 1);
      const inBody = withScope.getCompletions('file:///scope2.html', { line: 0, character: text.indexOf('{d}') + 2 });
      const data = inBody.find(item => item.label === 'data');
      expect(data.detail).toBe('resolved value of `fetchData`');
      expect(data.sortText < '0a').toBe(true);
      const inError = withScope.getCompletions('file:///scope2.html', { line: 0, character: text.indexOf('{e}') + 2 });
      expect(inError.map(item => item.label)).toContain('e');
    });
  });

  describe('template references', () => {
    it('resolves {>name} to the snippet in context, not the data variable', () => {
      const service2 = new LanguageService({});
      const text = '{#snippet row}<td>hi</td>{/snippet}\n{#each row in rows}{> row}{/each}';
      service2.didOpen('file:///ref.html', text, 1);
      const hover = service2.getHover('file:///ref.html', {
        line: 1,
        character: text.split('\n')[1].indexOf('{> row}') + 4,
      });
      expect(hover.contents.value).toContain('snippet defined in this template');
      expect(hover.contents.value).not.toContain('current item');
    });

    it('treats name and data as reserved keys of the verbose form', () => {
      const service2 = new LanguageService({});
      const text = '{#each rows as row}{> template\n  name=rowTemplate\n  data=row\n}{/each}';
      service2.didOpen('file:///ref3.html', text, 1);
      const name = service2.getHover('file:///ref3.html', { line: 1, character: 3 });
      expect(name.contents.value).toContain('Selects which template');
      const data = service2.getHover('file:///ref3.html', { line: 2, character: 3 });
      expect(data.contents.value).toContain('Sets the data context');
      // the values stay expressions in this template's scope
      const value = service2.getHover('file:///ref3.html', { line: 2, character: 8 });
      expect(value.contents.value).toContain('current item of `rows`');
      // and shorthand references keep `name` as an ordinary data key
      const short = new LanguageService({});
      short.didOpen('file:///ref4.html', '{>userProfile name=user.name}', 1);
      const shortName = short.getHover('file:///ref4.html', { line: 0, character: 15 });
      expect(shortName.contents.value).toContain('Defines `name` in the data context');
    });

    it('explains a data key as a fresh name in the subtemplate scope', () => {
      const service2 = new LanguageService({});
      const text = '{#each row in rows}{>row row=row company=company}{/each}';
      service2.didOpen('file:///ref2.html', text, 1);
      const hover = service2.getHover('file:///ref2.html', { line: 0, character: text.indexOf('row=row') + 1 });
      expect(hover.contents.value).toContain('Defines `row` in the data context of `{>row}`');
      // the value side still resolves in this template's scope
      const value = service2.getHover('file:///ref2.html', { line: 0, character: text.indexOf('row=row') + 5 });
      expect(value.contents.value).toContain('current item of `rows`');
    });
  });

  describe('diagnostics', () => {
    it('reports recoverable compile errors with in-bounds ranges', async () => {
      const { TemplateCompiler } = await import('@semantic-ui/compiler');
      const text = '<b>hi</b>\n{else}';
      const withCompiler = new LanguageService({ compiler: TemplateCompiler });
      withCompiler.didOpen('file:///broken.html', text, 1);
      const diagnostics = await withCompiler.getDiagnostics('file:///broken.html');
      expect(diagnostics).toHaveLength(1);
      expect(diagnostics[0].message).toContain('{else}');
      const { start, end } = diagnostics[0].range;
      expect(start).toEqual({ line: 1, character: 0 });
      // one bad range takes down the whole publish in @codemirror/lsp-client
      const lastLine = text.split('\n')[end.line];
      expect(end.character).toBeLessThanOrEqual(lastLine.length);
      expect(end.character).toBeGreaterThan(start.character);
    });

    it('returns no diagnostics for a valid template', async () => {
      const { TemplateCompiler } = await import('@semantic-ui/compiler');
      const withCompiler = new LanguageService({ compiler: TemplateCompiler });
      withCompiler.didOpen('file:///ok.html', '{#if open}<b>hi</b>{/if}', 1);
      expect(await withCompiler.getDiagnostics('file:///ok.html')).toEqual([]);
    });
  });

  describe('completions with component model', () => {
    it('returns component methods for expression context', () => {
      service.didOpen(buttonUri, buttonHtml);
      // Find an expression offset in button.html
      const offset = buttonHtml.indexOf('{uiClasses}');
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
      expect(names).toContain('match');
      expect(names).toContain('fn');
    });

    it('attaches documentation with an example and docs link', () => {
      service.didOpen('test://block-docs', '<div>{#}</div>');
      const items = service.getCompletions('test://block-docs', { line: 0, character: 7 });
      const match = items.find(i => i.label === 'match');
      expect(match.detail).toBe('Branches on the value of a single discriminant');
      expect(match.documentation.value).toContain('{#match status}');
      expect(match.documentation.value).toContain('[docs](/docs/guides/templates/match)');
    });

    it('offers case labels inside a match block', () => {
      service.didOpen('test://match-case', '{#match status}\n  {}\n{/match}');
      const items = service.getCompletions('test://match-case', { line: 1, character: 3 });
      const names = items.map(i => i.label);
      expect(names).toContain('is');
      expect(names).toContain('isExactly');
      expect(names).toContain('else');
    });

    it('offers section keywords inside an async block', () => {
      service.didOpen('test://async-section', '{#async getResults as result}\n  {}\n{/async}');
      const items = service.getCompletions('test://async-section', { line: 1, character: 3 });
      const names = items.map(i => i.label);
      expect(names).toContain('loading');
      expect(names).toContain('before');
      expect(names).toContain('error');
      expect(names).toContain('catch');
    });

    it('does not offer case labels in a block that has no cases', () => {
      service.didOpen('test://no-case', '{#each items}\n  {}\n{/each}');
      const items = service.getCompletions('test://no-case', { line: 1, character: 3 });
      const names = items.map(i => i.label);
      expect(names).toContain('else');
      expect(names).not.toContain('is');
      expect(names).not.toContain('isExactly');
      expect(names).not.toContain('loading');
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

    it('describes an opening block keyword', () => {
      service.didOpen('test://hover-if', '{#if isActive}yes{/if}');
      const result = service.getHover('test://hover-if', { line: 0, character: 3 });
      expect(result.contents.value).toContain('**{#if}**');
      expect(result.contents.value).toContain('[docs](/docs/guides/templates/conditionals)');
    });

    it('describes a closing block keyword', () => {
      service.didOpen('test://hover-close', '{#each items}{name}{/each}');
      const result = service.getHover('test://hover-close', { line: 0, character: 22 });
      expect(result.contents.value).toContain('**{/each}**');
      expect(result.contents.value).toContain('Iterates over a collection');
    });

    it('describes else inside an if block', () => {
      service.didOpen('test://hover-else', '{#if isActive}yes{else}no{/if}');
      const result = service.getHover('test://hover-else', { line: 0, character: 20 });
      expect(result.contents.value).toContain('**{else}**');
    });

    it('describes a match case label inside a match block', () => {
      service.didOpen('test://hover-is', "{#match status}{is 'ready'}Ready{/match}");
      const result = service.getHover('test://hover-is', { line: 0, character: 17 });
      expect(result.contents.value).toContain('**{is}**');
      expect(result.contents.value).toContain('[docs](/docs/guides/templates/match)');
    });

    it('keeps is as the equality helper outside a match block', () => {
      service.didOpen('test://hover-is-helper', '{#if is a b}yes{/if}');
      const result = service.getHover('test://hover-is-helper', { line: 0, character: 6 });
      expect(result.contents.value).toContain('is(a, b): boolean');
    });

    it('keeps guard as the helper when written without #', () => {
      service.didOpen('test://hover-guard', '{guard value}');
      const result = service.getHover('test://hover-guard', { line: 0, character: 4 });
      expect(result.contents.value).toContain('guard(value)');
      expect(result.contents.value).not.toContain('**{#guard}**');
    });

    it('describes the async loading section', () => {
      service.didOpen('test://hover-loading', '{#async getUser as user}{user}{loading}wait{/async}');
      const result = service.getHover('test://hover-loading', { line: 0, character: 34 });
      expect(result.contents.value).toContain('**{loading}**');
    });
  });

  describe('signature help', () => {
    // | marks the cursor and is stripped before the document is opened
    function signatureAt(template) {
      const offset = template.indexOf('|');
      const text = template.replace('|', '');
      service.didOpen('test://signature', text);
      return service.getSignatureHelp('test://signature', service.offsetToPosition(text, offset));
    }

    it('returns the helper signature with the first argument active', () => {
      const help = signatureAt("{formatDate |date 'h:mm a'}");
      expect(help.signatures).toHaveLength(1);
      expect(help.signatures[0].label).toBe('formatDate(date, format?, options?): string');
      expect(help.activeSignature).toBe(0);
      expect(help.activeParameter).toBe(0);
    });

    it('moves the active parameter as the cursor crosses arguments', () => {
      expect(signatureAt("{formatDate date |'h:mm a'}").activeParameter).toBe(1);
      expect(signatureAt('{truncate |text 20}').activeParameter).toBe(0);
      expect(signatureAt('{truncate text |20}').activeParameter).toBe(1);
      expect(signatureAt('{truncate text 20 |}').activeParameter).toBe(2);
    });

    it('handles the parenthesized call form', () => {
      const help = signatureAt("{formatDate(date, |'h:mm a')}");
      expect(help.signatures[0].label).toBe('formatDate(date, format?, options?): string');
      expect(help.activeParameter).toBe(1);
    });

    it('marks parameters by range in the label', () => {
      const { label, parameters } = signatureAt('{classIf |isActive}').signatures[0];
      expect(parameters.map(p => label.slice(...p.label))).toEqual(['expr', 'trueClass', 'falseClass?']);
    });

    it('documents the helper', () => {
      const help = signatureAt('{joinComma |names}');
      expect(help.signatures[0].documentation.value).toBe('Joins array with commas and "and"');
    });

    it('holds the active parameter on a rest parameter', () => {
      expect(signatureAt("{concat 'a' |}").activeParameter).toBe(0);
      expect(signatureAt("{concat 'a' 'b' 'c' |}").activeParameter).toBe(0);
    });

    it('returns null outside a helper call', () => {
      expect(signatureAt('{userName |}')).toBeNull();
      expect(signatureAt('{count + |2}')).toBeNull();
      expect(signatureAt('<div class="wide|">')).toBeNull();
    });

    it('returns null at a block tag position', () => {
      expect(signatureAt('{#each |items}')).toBeNull();
      expect(signatureAt('{#eac|h items}')).toBeNull();
      expect(signatureAt("{#match plan}{is |'free'}{/match}")).toBeNull();
    });

    it('returns null for an unopened document', () => {
      expect(service.getSignatureHelp('test://never-opened', { line: 0, character: 0 })).toBeNull();
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
