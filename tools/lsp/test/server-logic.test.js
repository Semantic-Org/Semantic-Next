import { describe, expect, it } from 'vitest';
import {
  formatAttributeDoc,
  getAttributeBindingAtOffset,
  getBlockKeywordAtOffset,
  getCompletionContext,
  getHelperCallAtOffset,
  getOpenBlocks,
  getScopeVariables,
  getWordAtOffset,
} from '../src/server-helpers.js';

describe('getCompletionContext', () => {
  describe('expression context', () => {
    it('detects cursor inside an expression brace', () => {
      // {|} — cursor right after opening brace
      const text = '<div>{}</div>';
      const offset = 6; // between { and }
      expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
    });

    it('detects cursor mid-expression with partial text', () => {
      // {cou|nt} — cursor in the middle of a word
      const text = '<div>{count}</div>';
      const offset = 9; // after "cou"
      expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
    });

    it('detects expression after helper name', () => {
      // {classIf |} — cursor after helper name
      const text = '<div class="{classIf }button">';
      const offset = 21; // after "classIf "
      expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
    });

    it('handles expression in attribute value', () => {
      // class="{ui|}button"
      const text = '<div class="{uiClasses}button">';
      const offset = 15; // after "ui"
      expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
    });

    it('handles nested braces in class expressions', () => {
      // Real pattern: {classMap getStateClasses}
      const text = '<div class="{classMap getStateClasses}input">';
      const offset = 22; // after "classMap "
      expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
    });
  });

  describe('block context', () => {
    it('detects block start with #', () => {
      const text = '{#}';
      const offset = 2;
      expect(getCompletionContext(text, offset)).toEqual({ type: 'block' });
    });

    it('detects partial block keyword', () => {
      // {#if|} — typing "if" after #
      const text = '{#if}';
      const offset = 4;
      expect(getCompletionContext(text, offset)).toEqual({ type: 'block' });
    });

    it('detects block with preceding content', () => {
      // Real pattern from button.html: {#if badge}
      const text = '<span>{#if badge}</span>';
      const offset = 10; // after "{#if"
      expect(getCompletionContext(text, offset)).toEqual({ type: 'block' });
    });

    it('returns expression context for block argument area', () => {
      // After the keyword + space, cursor is in the argument area
      // where expression completions (variables, helpers) are appropriate
      expect(getCompletionContext('{#each }', 7)).toMatchObject({ type: 'expression' });
      expect(getCompletionContext('{#snippet }', 10)).toMatchObject({ type: 'expression' });
    });
  });

  describe('block section context', () => {
    it('offers case labels at tag start inside a match block', () => {
      const text = '{#match status}{}{/match}';
      const offset = 16; // inside the bare {}
      expect(getCompletionContext(text, offset)).toMatchObject({
        type: 'expression',
        sections: ['else', 'is', 'isExactly'],
      });
    });

    it('offers async sections at tag start inside an async block', () => {
      const text = '{#async getUser as user}{}{/async}';
      const offset = 25;
      expect(getCompletionContext(text, offset)).toMatchObject({
        type: 'expression',
        sections: ['loading', 'before', 'error', 'catch'],
      });
    });

    it('keeps offering sections while the keyword is typed', () => {
      const text = '{#match status}{isEx}{/match}';
      const offset = 20; // after "{isEx"
      expect(getCompletionContext(text, offset)).toMatchObject({
        prefix: 'isEx',
        sections: ['else', 'is', 'isExactly'],
      });
    });

    it('drops sections once the tag holds an expression', () => {
      // {#match} case values are expressions, so past the first token this is
      // no longer a keyword position
      const text = '{#match status}{is name}{/match}';
      const offset = 23; // on "name"
      expect(getCompletionContext(text, offset).sections).toBeUndefined();
    });

    it('drops sections after the block closes', () => {
      const text = '{#match status}{/match}{}';
      const offset = 24;
      expect(getCompletionContext(text, offset).sections).toBeUndefined();
    });

    it('reports the innermost block when blocks nest', () => {
      const text = '{#async getUser as user}{#match user.role}{}{/match}{/async}';
      const offset = 43;
      expect(getCompletionContext(text, offset)).toMatchObject({ sections: ['else', 'is', 'isExactly'] });
    });

    it('offers no sections outside a block', () => {
      expect(getCompletionContext('{}', 1).sections).toBeUndefined();
    });
  });

  describe('reference context', () => {
    it('detects subtemplate reference', () => {
      // {>} — cursor after >
      const text = '{>}';
      const offset = 2;
      expect(getCompletionContext(text, offset)).toEqual({ type: 'reference' });
    });

    it('detects partial reference', () => {
      // {>slot} — real pattern from templates
      const text = '{>slot}';
      const offset = 4; // after ">sl"
      expect(getCompletionContext(text, offset)).toEqual({ type: 'reference' });
    });

    it('detects reference with space', () => {
      // {> slot} — real pattern with space
      const text = '{> slot}';
      const offset = 3; // after "> "
      expect(getCompletionContext(text, offset)).toEqual({ type: 'reference' });
    });

    it('detects named slot reference', () => {
      // {>slot icon} — real pattern from button.html
      const text = '{>slot icon}';
      const offset = 6; // after ">slot "
      expect(getCompletionContext(text, offset)).toEqual({ type: 'reference' });
    });

    it('returns expression context for reference argument area', () => {
      // After the reference name + space, cursor is in the data-binding area
      // where expression completions are appropriate, not reference completions
      const text = '{>highlight text=title match=titleHighlight}';
      const offset = 12; // after ">highlight "
      expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
    });
  });

  describe('html-attribute context', () => {
    it('detects attribute position in SUI component', () => {
      // <ui-button |> — cursor after space in tag
      const text = '<ui-button >';
      const offset = 11; // before >
      expect(getCompletionContext(text, offset)).toEqual({
        type: 'html-attribute',
        tagName: 'ui-button',
      });
    });

    it('detects attribute after existing attributes', () => {
      // <ui-button primary |> — cursor after existing attribute
      const text = '<ui-button primary >';
      const offset = 19;
      expect(getCompletionContext(text, offset)).toEqual({
        type: 'html-attribute',
        tagName: 'ui-button',
      });
    });

    it('detects attribute in multiline tag', () => {
      const text = '<ui-input\n  fluid\n  icon="search"\n  >';
      const offset = text.length - 2; // before >
      expect(getCompletionContext(text, offset)).toEqual({
        type: 'html-attribute',
        tagName: 'ui-input',
      });
    });

    it('detects attribute for custom element with hyphenated name', () => {
      const text = '<menu-item >';
      const offset = 11;
      expect(getCompletionContext(text, offset)).toEqual({
        type: 'html-attribute',
        tagName: 'menu-item',
      });
    });
  });

  describe('attribute-value context', () => {
    it('detects value position with double quotes', () => {
      const text = '<ui-button size="';
      const offset = text.length;
      expect(getCompletionContext(text, offset)).toEqual({
        type: 'attribute-value',
        tagName: 'ui-button',
        attributeName: 'size',
      });
    });

    it('detects value position with single quotes', () => {
      const text = "<ui-button emphasis='";
      const offset = text.length;
      expect(getCompletionContext(text, offset)).toEqual({
        type: 'attribute-value',
        tagName: 'ui-button',
        attributeName: 'emphasis',
      });
    });

    it('detects partial value', () => {
      const text = '<ui-button size="lar';
      const offset = text.length;
      expect(getCompletionContext(text, offset)).toEqual({
        type: 'attribute-value',
        tagName: 'ui-button',
        attributeName: 'size',
      });
    });

    it('detects value after other attributes', () => {
      const text = '<ui-button primary size="';
      const offset = text.length;
      expect(getCompletionContext(text, offset)).toEqual({
        type: 'attribute-value',
        tagName: 'ui-button',
        attributeName: 'size',
      });
    });
  });

  describe('event-binding context', () => {
    it('detects @ event binding', () => {
      const text = '<div @';
      const offset = text.length;
      expect(getCompletionContext(text, offset)).toEqual({ type: 'event-binding' });
    });

    it('detects partial event name', () => {
      const text = '<div @cli';
      const offset = text.length;
      expect(getCompletionContext(text, offset)).toEqual({ type: 'event-binding' });
    });
  });

  describe('no context', () => {
    it('returns none for plain text outside any structure', () => {
      const text = 'hello world';
      const offset = 5;
      expect(getCompletionContext(text, offset)).toEqual({ type: 'none' });
    });

    it('returns none after a closed expression', () => {
      const text = '{count} ';
      const offset = 8;
      expect(getCompletionContext(text, offset)).toEqual({ type: 'none' });
    });

    it('returns none between tags', () => {
      const text = '<div></div>';
      const offset = 5;
      expect(getCompletionContext(text, offset)).toEqual({ type: 'none' });
    });
  });

  describe('real template patterns', () => {
    it('handles double-brace syntax from modal.html', () => {
      // modal.html uses {{#if not closeable}} (double braces)
      const text = '{{#if not closeable}}';
      // Cursor after the first {, inside the second {
      const offset = 5; // after "{{#if"
      // The inner { creates the block context
      expect(getCompletionContext(text, offset)).toEqual({ type: 'block' });
    });

    it('handles {uiClasses} class pattern', () => {
      // Common pattern: class="{uiClasses}button"
      const text = '<div class="{uiClasses}button">';
      const offset = 14; // inside {uiClasses}
      expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
    });

    it('handles argument area in each loop as expression', () => {
      // {#each item in items} — cursor on "items" is past the keyword
      const text = '{#each item in items}';
      const offset = 19;
      expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
    });

    it('handles expression with helper call and arguments', () => {
      // {classIf copied "copied"} — from copy-button
      const text = '<div class="copy-button {classIf copied \'copied\'}">';
      const offset = 33; // after "{classIf "
      expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
    });

    it('handles conditional expression with helper in attribute', () => {
      // {activeIf is index selectedIndex} — from global-search
      const text = '<a class="result {activeIf is index selectedIndex}">';
      const offset = 27; // after "{activeIf "
      expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
    });
  });
});

describe('getWordAtOffset', () => {
  it('extracts a simple word', () => {
    const text = 'hello world';
    expect(getWordAtOffset(text, 2)).toBe('hello');
  });

  it('extracts word at start', () => {
    const text = 'count';
    expect(getWordAtOffset(text, 0)).toBe('count');
  });

  it('extracts word at end', () => {
    const text = 'count';
    expect(getWordAtOffset(text, 5)).toBe('count');
  });

  it('extracts word from expression context', () => {
    const text = '{formatDate}';
    expect(getWordAtOffset(text, 5)).toBe('formatDate');
  });

  it('extracts dotted path', () => {
    const text = '{item.value}';
    expect(getWordAtOffset(text, 6)).toBe('item.value');
  });

  it('strips leading dots', () => {
    const text = '.foo';
    expect(getWordAtOffset(text, 2)).toBe('foo');
  });

  it('strips trailing dots', () => {
    const text = 'foo.';
    expect(getWordAtOffset(text, 2)).toBe('foo');
  });

  it('returns null for empty/whitespace', () => {
    const text = '   ';
    expect(getWordAtOffset(text, 1)).toBeNull();
  });

  it('returns null for braces only', () => {
    const text = '{}';
    expect(getWordAtOffset(text, 1)).toBeNull();
  });

  it('extracts helper name from template expression', () => {
    // {classIf copied 'copied'} — hovering over classIf
    const text = "{classIf copied 'copied'}";
    expect(getWordAtOffset(text, 4)).toBe('classIf');
  });

  it('extracts state variable from expression', () => {
    const text = '{count}';
    expect(getWordAtOffset(text, 3)).toBe('count');
  });

  it('handles real template: {uiClasses} pattern', () => {
    const text = '<div class="{uiClasses}button">';
    expect(getWordAtOffset(text, 14)).toBe('uiClasses');
  });

  it('handles helper with arguments', () => {
    const text = '{activeIf is index selectedIndex}';
    expect(getWordAtOffset(text, 5)).toBe('activeIf');
    expect(getWordAtOffset(text, 12)).toBe('is');
    expect(getWordAtOffset(text, 17)).toBe('index');
    expect(getWordAtOffset(text, 25)).toBe('selectedIndex');
  });
});

describe('getOpenBlocks', () => {
  it('returns the blocks open at an offset, outermost first', () => {
    const text = '{#each items}{#if active}|{/if}{/each}';
    expect(getOpenBlocks(text, text.indexOf('|'))).toEqual(['each', 'if']);
  });

  it('pops closed blocks', () => {
    const text = '{#if a}yes{/if}|';
    expect(getOpenBlocks(text, text.indexOf('|'))).toEqual([]);
  });

  it('ignores expression modifiers that never open a scope', () => {
    const text = '{#html raw}|';
    expect(getOpenBlocks(text, text.indexOf('|'))).toEqual([]);
  });

  it('handles double-brace syntax', () => {
    const text = '{{#match status}}|{{/match}}';
    expect(getOpenBlocks(text, text.indexOf('|'))).toEqual(['match']);
  });

  it('recovers from an unbalanced inner close', () => {
    // {/if} with no open if must not pop the each
    const text = '{#each items}{/if}|{/each}';
    expect(getOpenBlocks(text, text.indexOf('|'))).toEqual(['each']);
  });

  it('returns nothing for plain markup', () => {
    expect(getOpenBlocks('<div>{name}</div>', 8)).toEqual([]);
  });
});

describe('getScopeVariables', () => {
  const at = (text) => getScopeVariables(text, text.indexOf('|'));
  const names = (text) => at(text).map(variable => variable.name);

  it('binds the each..in alias plus the implicit index and key', () => {
    const text = '{#each fruit in fruits}{|}{/each}';
    expect(at(text)[0]).toEqual({
      name: 'fruit',
      description: 'current item of `fruits`',
      tag: '{#each fruit in fruits}',
    });
    expect(names(text)).toEqual(['fruit', 'index', 'key']);
    expect(at(text)[1].description).toBe('index in `fruits` (implicit for arrays)');
  });

  it('an explicit index alias replaces the implicit bindings', () => {
    const text = '{#each value, key in person}{|}{/each}';
    expect(names(text)).toEqual(['value', 'key']);
    expect(at(text)[1].description).toBe('index (or key) of `person`');
    expect(names('{#each fruits as fruit, idx}{|}{/each}')).toEqual(['fruit', 'idx']);
  });

  it('binds the each..as form', () => {
    expect(names('{#each fruits as fruit}{|}{/each}')).toEqual(['fruit', 'index', 'key']);
  });

  it('binds this and the implicit index for an aliasless each', () => {
    expect(names('{#each numbers}{|}{/each}')).toEqual(['this', 'index', 'key']);
    expect(at('{#each numbers}{|}{/each}')[0].description).toBe('current item of `numbers`');
  });

  it('binds the async resolved value, including call expressions', () => {
    const text = '{#async getResults searchTerm as searchResults}{|}{/async}';
    expect(at(text)).toEqual([
      {
        name: 'searchResults',
        description: 'resolved value of `getResults searchTerm`',
        tag: '{#async getResults searchTerm as searchResults}',
      },
    ]);
  });

  it('binds destructured async values', () => {
    const text = '{#async fetchUser as {name, email, ...meta}}{|}{/async}';
    expect(names(text)).toEqual(['name', 'email', 'meta']);
    expect(at(text)[0].description).toBe('destructured from the resolved value of `fetchUser`');
  });

  it('binds the error alias inside the error section only', () => {
    const text = '{#async fetchData as data}{data}{error as e}{|}{/async}';
    expect(names(text)).toContain('e');
    const before = '{#async fetchData as data}{|}{error as e}{/async}';
    expect(names(before)).not.toContain('e');
  });

  it('drops bindings once the block closes and lets inner bindings shadow', () => {
    expect(names('{#each fruit in fruits}{/each}{|}')).toEqual([]);
    const nested = '{#each item in outer}{#each item in item.children}{|}{/each}{/each}';
    const item = at(nested).find(variable => variable.name === 'item');
    expect(item.description).toBe('current item of `item.children`');
  });
});

describe('getAttributeBindingAtOffset', () => {
  const at = (text, marker = '|') => {
    const offset = text.indexOf(marker);
    return getAttributeBindingAtOffset(text.replace(marker, ''), offset);
  };

  it('resolves an @event binding in attribute position', () => {
    expect(at('<div class="toggle" @cl|ick={toggleCheckbox}>')).toEqual({ kind: 'event', name: 'click' });
  });

  it('resolves a .property binding in attribute position', () => {
    expect(at('<ui-chart .da|ta={getComplexData}>')).toEqual({ kind: 'property', name: 'data' });
  });

  it('ignores dotted paths inside expressions', () => {
    expect(at('<li>{fruit.ta|ste}</li>')).toBeNull();
    expect(at('<div @click={handlers.on|Click}>')).toBeNull();
  });

  it('ignores plain attributes and text', () => {
    expect(at('<div cla|ss="toggle">')).toBeNull();
    expect(at('<div>email@exa|mple.com</div>')).toBeNull();
  });
});

describe('getBlockKeywordAtOffset', () => {
  it('resolves an opening keyword', () => {
    const text = '{#rerender userId}';
    expect(getBlockKeywordAtOffset(text, 4)).toEqual({ name: 'rerender', tag: '{#rerender}' });
  });

  it('resolves a closing keyword', () => {
    const text = '{#guard value}x{/guard}';
    expect(getBlockKeywordAtOffset(text, 18)).toEqual({ name: 'guard', tag: '{/guard}' });
  });

  it('resolves else if as a single keyword', () => {
    const text = '{#if a}1{else if b}2{/if}';
    expect(getBlockKeywordAtOffset(text, 14)).toEqual({ name: 'else if', tag: '{else if}' });
  });

  it('resolves a case label only inside a match block', () => {
    const inMatch = "{#match plan}{is 'free'}Free{/match}";
    expect(getBlockKeywordAtOffset(inMatch, 15)).toEqual({ name: 'is', tag: '{is}' });
    // same tag, no enclosing match — this is the equality helper
    expect(getBlockKeywordAtOffset("{is plan 'free'}", 2)).toBeNull();
  });

  it('resolves an async section only inside an async block', () => {
    const inAsync = '{#async load as data}{data}{error as e}{e}{/async}';
    expect(getBlockKeywordAtOffset(inAsync, 30)).toEqual({ name: 'error', tag: '{error}' });
    expect(getBlockKeywordAtOffset('{error}', 3)).toBeNull();
  });

  it('returns null for a block keyword written as a bare expression', () => {
    // {guard x} is the reactivity helper, {#guard x} is the block
    expect(getBlockKeywordAtOffset('{guard value}', 3)).toBeNull();
  });

  it('returns null past the keyword', () => {
    expect(getBlockKeywordAtOffset('{#if isActive}', 10)).toBeNull();
  });

  it('returns null outside a tag', () => {
    expect(getBlockKeywordAtOffset('{#if a}text', 9)).toBeNull();
    expect(getBlockKeywordAtOffset('plain text', 4)).toBeNull();
  });

  it('returns null for unknown keywords', () => {
    expect(getBlockKeywordAtOffset('{#nope thing}', 4)).toBeNull();
  });
});

describe('getHelperCallAtOffset', () => {
  // | marks the cursor
  const callAt = (text) => getHelperCallAtOffset(text, text.indexOf('|'));

  it('advances the argument index across Lisp arguments', () => {
    expect(callAt("{formatDate |date 'h:mm a'}")).toEqual({ name: 'formatDate', argIndex: 0 });
    expect(callAt("{formatDate dat|e 'h:mm a'}")).toEqual({ name: 'formatDate', argIndex: 0 });
    expect(callAt("{formatDate date |'h:mm a'}")).toEqual({ name: 'formatDate', argIndex: 1 });
  });

  it('keeps a quoted argument whole', () => {
    // the space inside 'h:mm a' does not start a new argument
    expect(callAt("{formatDate date 'h:m|m a'}")).toEqual({ name: 'formatDate', argIndex: 1 });
  });

  it('splits the parenthesized form on commas', () => {
    expect(callAt("{formatDate(|date, 'h:mm a')}")).toEqual({ name: 'formatDate', argIndex: 0 });
    expect(callAt("{formatDate(date, |'h:mm a')}")).toEqual({ name: 'formatDate', argIndex: 1 });
    expect(callAt("{formatDate(date, 'h:mm a')|}")).toBeNull();
  });

  it('resolves the innermost call', () => {
    expect(callAt("{concat 'at ' (formatDate date |'h:mm a')}")).toEqual({ name: 'formatDate', argIndex: 1 });
    // a finished subexpression counts as one argument of the outer call
    expect(callAt('{maybe isOn (concat a b) |}')).toEqual({ name: 'maybe', argIndex: 2 });
  });

  it('reads arguments of a block tag', () => {
    expect(callAt('{#if hasAny |items}')).toEqual({ name: 'hasAny', argIndex: 0 });
    expect(callAt('{#each |items}')).toBeNull();
    expect(callAt('{#eac|h items}')).toBeNull();
    expect(callAt('{/each|}')).toBeNull();
  });

  it('skips a section keyword to reach its arguments', () => {
    const inMatch = "{#match plan}{is |'free'}{/match}";
    expect(callAt(inMatch)).toBeNull();
    // same tag with no enclosing match is the equality helper
    expect(callAt("{is plan |'free'}")).toEqual({ name: 'is', argIndex: 1 });
  });

  it('returns null while the name is still being typed', () => {
    expect(callAt('{formatDa|}')).toBeNull();
    expect(callAt('<div>{|}</div>')).toBeNull();
  });

  it('returns null for JS expressions and non-expression positions', () => {
    expect(callAt('{count + |2}')).toBeNull();
    expect(callAt("{>template name=|'x'}")).toBeNull();
    expect(callAt('<div class="wide|">')).toBeNull();
  });

  it('reports the name unchecked, leaving helper lookup to the caller', () => {
    expect(callAt('{userName |}')).toEqual({ name: 'userName', argIndex: 0 });
  });
});

describe('formatAttributeDoc', () => {
  it('formats basic attribute with name and description', () => {
    const doc = formatAttributeDoc('emphasis', {
      name: 'Emphasis',
      description: 'How much the button is emphasized',
    }, {
      propertyTypes: { emphasis: 'string' },
      allowedValues: { emphasis: ['primary', 'secondary'] },
    });

    expect(doc).toContain('**Emphasis**');
    expect(doc).toContain('How much the button is emphasized');
    expect(doc).toContain('Type: `string`');
    expect(doc).toContain('`primary`');
    expect(doc).toContain('`secondary`');
  });

  it('formats attribute with example code string', () => {
    const doc = formatAttributeDoc('icon', {
      name: 'Icon',
      description: 'An icon for the button',
      exampleCode: '<ui-button icon="star">Star</ui-button>',
    }, {
      propertyTypes: { icon: 'string' },
      allowedValues: {},
    });

    expect(doc).toContain('```html');
    expect(doc).toContain('<ui-button icon="star">Star</ui-button>');
    expect(doc).toContain('```');
  });

  it('formats attribute with array of example codes', () => {
    const doc = formatAttributeDoc('size', {
      name: 'Size',
      description: 'Controls the size',
      exampleCode: [
        '<ui-button small>Small</ui-button>',
        '<ui-button large>Large</ui-button>',
      ],
    }, {
      propertyTypes: { size: 'string' },
      allowedValues: { size: ['small', 'large'] },
    });

    // Should use first example
    expect(doc).toContain('<ui-button small>Small</ui-button>');
  });

  it('handles attribute with no values', () => {
    const doc = formatAttributeDoc('fluid', {
      name: 'Fluid',
      description: 'Takes full width',
    }, {
      propertyTypes: { fluid: 'boolean' },
      allowedValues: {},
    });

    expect(doc).toContain('Type: `boolean`');
    expect(doc).not.toContain('Values:');
  });

  it('handles minimal metadata', () => {
    const doc = formatAttributeDoc('href', {}, {
      propertyTypes: { href: 'string' },
      allowedValues: {},
    });

    expect(doc).toContain('Type: `string`');
    expect(doc).not.toContain('**');
  });
});
