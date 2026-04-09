import { describe, expect, it } from 'vitest';
import { getCompletionContext, getWordAtOffset, formatAttributeDoc } from '../src/server-helpers.js';


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
      const text = '<div class="{ui}button">';
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

    it('handles {ui} class pattern', () => {
      // Common pattern: class="{ui}button"
      const text = '<div class="{ui}button">';
      const offset = 14; // inside {ui}
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
    const text = '{classIf copied \'copied\'}';
    expect(getWordAtOffset(text, 4)).toBe('classIf');
  });

  it('extracts state variable from expression', () => {
    const text = '{count}';
    expect(getWordAtOffset(text, 3)).toBe('count');
  });

  it('handles real template: {ui} pattern', () => {
    const text = '<div class="{ui}button">';
    expect(getWordAtOffset(text, 14)).toBe('ui');
  });

  it('handles helper with arguments', () => {
    const text = '{activeIf is index selectedIndex}';
    expect(getWordAtOffset(text, 5)).toBe('activeIf');
    expect(getWordAtOffset(text, 12)).toBe('is');
    expect(getWordAtOffset(text, 17)).toBe('index');
    expect(getWordAtOffset(text, 25)).toBe('selectedIndex');
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
