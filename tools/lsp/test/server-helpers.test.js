import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { formatAttributeDoc, getCompletionContext, getWordAtOffset } from '../src/server-helpers.js';

const root = resolve(import.meta.dirname, '../../..');

/*
  These tests validate context detection against real component templates
  from src/, not synthetic snippets. This catches issues that only appear
  with real formatting, nesting depth, and template patterns.

  The server-logic.test.js file covers the same functions with synthetic
  inputs. This file is the real-world counterpart.
*/

function readTemplate(relativePath) {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

/*******************************
   Real template context tests
*******************************/

describe('getCompletionContext — real templates', () => {

  describe('button.html', () => {
    const text = readTemplate('src/primitives/button/button.html');

    it('expression context inside {ui} class pattern', () => {
      const idx = text.indexOf('{ui}');
      expect(getCompletionContext(text, idx + 1)).toMatchObject({ type: 'expression' });
    });

    it('block context at {#if badge}', () => {
      const idx = text.indexOf('{#if badge}');
      expect(getCompletionContext(text, idx + 2)).toEqual({ type: 'block' });
    });

    it('block context at {#if not iconOnly}', () => {
      const idx = text.indexOf('{#if not iconOnly}');
      expect(getCompletionContext(text, idx + 2)).toEqual({ type: 'block' });
    });

    it('reference context at {> slot}', () => {
      const idx = text.indexOf('{> slot}');
      expect(getCompletionContext(text, idx + 2)).toEqual({ type: 'reference' });
    });

    it('reference context at {> icon}', () => {
      const idx = text.indexOf('{> icon}');
      expect(getCompletionContext(text, idx + 2)).toEqual({ type: 'reference' });
    });

    it('reference context at {>slot icon} (named slot)', () => {
      const idx = text.indexOf('{>slot icon}');
      expect(getCompletionContext(text, idx + 2)).toEqual({ type: 'reference' });
    });

    it('expression context for {icon} inside template', () => {
      // {icon} appears inside a snippet — verify it's still expression, not confused by nesting
      const idx = text.indexOf('{icon}', text.indexOf('{#if icon}'));
      if (idx !== -1) {
        expect(getCompletionContext(text, idx + 1)).toMatchObject({ type: 'expression' });
      }
    });

    it('expression context at {badge} inside snippet', () => {
      // {badge} is inside {#snippet badge}
      const snippetIdx = text.indexOf('{#snippet badge}');
      const badgeExprIdx = text.indexOf('{badge}', snippetIdx + 16);
      if (badgeExprIdx !== -1) {
        expect(getCompletionContext(text, badgeExprIdx + 1)).toMatchObject({ type: 'expression' });
      }
    });

    it('expression context at {href}', () => {
      const idx = text.indexOf('{href}');
      expect(getCompletionContext(text, idx + 1)).toMatchObject({ type: 'expression' });
    });
  });

  describe('menu.html', () => {
    const text = readTemplate('src/primitives/menu/menu.html');

    it('block context at {#each item in items}', () => {
      const idx = text.indexOf('{#each');
      expect(getCompletionContext(text, idx + 2)).toEqual({ type: 'block' });
    });

    it('expression context at {item.label} inside each loop', () => {
      const idx = text.indexOf('{item.label}');
      expect(getCompletionContext(text, idx + 1)).toMatchObject({ type: 'expression' });
    });

    it('expression context at {item.icon} inside each loop', () => {
      const idx = text.indexOf('{item.icon}');
      if (idx !== -1) {
        expect(getCompletionContext(text, idx + 1)).toMatchObject({ type: 'expression' });
      }
    });

    it('expression context at {item.badge} inside each loop', () => {
      const idx = text.indexOf('{item.badge}');
      if (idx !== -1) {
        expect(getCompletionContext(text, idx + 1)).toMatchObject({ type: 'expression' });
      }
    });

    it('reference context at {>slot} after {else}', () => {
      const elseIdx = text.indexOf('{else}');
      const slotIdx = text.indexOf('{>slot}', elseIdx);
      if (slotIdx !== -1) {
        expect(getCompletionContext(text, slotIdx + 2)).toEqual({ type: 'reference' });
      }
    });

    it('expression context at {getIndicatorPosition}', () => {
      const idx = text.indexOf('{getIndicatorPosition}');
      if (idx !== -1) {
        expect(getCompletionContext(text, idx + 1)).toMatchObject({ type: 'expression' });
      }
    });

    it('html-attribute context inside <ui-icon> tag', () => {
      const idx = text.indexOf('<ui-icon');
      if (idx !== -1) {
        // Position after "<ui-icon "
        expect(getCompletionContext(text, idx + 9).type).toBe('html-attribute');
      }
    });
  });

  describe('input.html', () => {
    const text = readTemplate('src/primitives/input/input.html');

    it('expression context at {classMap getStateClasses}', () => {
      const idx = text.indexOf('{classMap');
      expect(getCompletionContext(text, idx + 1)).toMatchObject({ type: 'expression' });
    });

    it('expression context at {type}', () => {
      const idx = text.indexOf('{type}');
      expect(getCompletionContext(text, idx + 1)).toMatchObject({ type: 'expression' });
    });

    it('expression context at {placeholder}', () => {
      const idx = text.indexOf('{placeholder}');
      expect(getCompletionContext(text, idx + 1)).toMatchObject({ type: 'expression' });
    });

    it('expression context at {getIcon} inside nested if', () => {
      const idx = text.indexOf('{getIcon}');
      if (idx !== -1) {
        expect(getCompletionContext(text, idx + 1)).toMatchObject({ type: 'expression' });
      }
    });
  });

  describe('modal.html (double-brace syntax)', () => {
    const text = readTemplate('src/primitives/modal/modal.html');

    it('block context inside double-brace {{#if}}', () => {
      const idx = text.indexOf('{{#if');
      if (idx !== -1) {
        // The inner brace creates the context
        expect(getCompletionContext(text, idx + 3)).toEqual({ type: 'block' });
      }
    });

    it('expression context inside double-brace {{ui}}', () => {
      const idx = text.indexOf('{{ui}}');
      if (idx !== -1) {
        expect(getCompletionContext(text, idx + 2)).toMatchObject({ type: 'expression' });
      }
    });

    it('reference context inside double-brace {{>slot}}', () => {
      const idx = text.indexOf('{{>slot}}');
      if (idx !== -1) {
        expect(getCompletionContext(text, idx + 3)).toEqual({ type: 'reference' });
      }
    });
  });

  describe('card.html (deeply nested snippets)', () => {
    const text = readTemplate('src/primitives/card/card.html');

    it('reference context at {>image}', () => {
      const idx = text.indexOf('{>image}');
      expect(getCompletionContext(text, idx + 2)).toEqual({ type: 'reference' });
    });

    it('reference context at {>header}', () => {
      const idx = text.indexOf('{>header}');
      expect(getCompletionContext(text, idx + 2)).toEqual({ type: 'reference' });
    });

    it('expression context at {header} inside snippet', () => {
      // {header} appears as an expression inside {#snippet header}
      const snippetIdx = text.indexOf('{#snippet header}');
      const exprIdx = text.indexOf('{header}', snippetIdx + 17);
      if (exprIdx !== -1) {
        expect(getCompletionContext(text, exprIdx + 1)).toMatchObject({ type: 'expression' });
      }
    });

    it('block context at {#each value in meta}', () => {
      const idx = text.indexOf('{#each value in meta}');
      if (idx !== -1) {
        expect(getCompletionContext(text, idx + 2)).toEqual({ type: 'block' });
      }
    });
  });
});

/*******************************
   Edge cases for getCompletionContext
*******************************/

describe('getCompletionContext — edge cases', () => {

  it('closing block {/if} is expression context (not block)', () => {
    // Developer places cursor inside {/if} — the / doesn't start with # or >
    const text = '<div>{/if}</div>';
    const offset = 7; // after "{/i"
    expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
  });

  it('{else} is expression context', () => {
    // {else} is inside braces but has no # or > prefix
    const text = '{#if x}hello{else}bye{/if}';
    const offset = 15; // inside {else}
    expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
  });

  it('handles empty document', () => {
    expect(getCompletionContext('', 0)).toEqual({ type: 'none' });
  });

  it('handles cursor at offset 0', () => {
    const text = '{count}';
    expect(getCompletionContext(text, 0)).toEqual({ type: 'none' });
  });

  it('expression after closed brace followed by new brace', () => {
    // {count}{| — two adjacent expressions, cursor in the second
    const text = '{count}{name}';
    const offset = 8; // after second {
    expect(getCompletionContext(text, offset)).toMatchObject({ type: 'expression' });
  });

  it('attribute context with brace-bound attribute value', () => {
    // <menu-item active={isActive} | — brace value without quotes
    // After the closing }, the cursor should see html-attribute context
    const text = '<menu-item active={isActive} ';
    const offset = text.length;
    expect(getCompletionContext(text, offset)).toEqual({
      type: 'html-attribute',
      tagName: 'menu-item',
    });
  });

  it('200-char lookback limit: tag more than 200 chars before cursor', () => {
    // The beforeCursor window is max 200 chars. If the opening < is outside
    // that window, attribute detection fails gracefully to "none".
    const padding = 'x'.repeat(250);
    const text = `<ui-button ${padding}`;
    const offset = text.length;
    // The < is more than 200 chars before cursor
    expect(getCompletionContext(text, offset)).toEqual({ type: 'none' });
  });

  it('attribute detection works within 200-char window', () => {
    const padding = 'x'.repeat(150);
    const text = `<ui-button ${padding}`;
    const offset = text.length;
    // The < is within 200 chars of cursor
    expect(getCompletionContext(text, offset).type).toBe('html-attribute');
  });
});

/*******************************
   getWordAtOffset — edge cases
*******************************/

describe('getWordAtOffset — boundary cases', () => {
  it('handles offset beyond text length', () => {
    const text = 'hello';
    // offset 10 is past the end — should still extract "hello" since the scan
    // starts at offset and walks backward
    expect(getWordAtOffset(text, 10)).toBe('hello');
  });

  it('handles hyphenated HTML attribute names as separate words', () => {
    // "icon-only" — hyphens are not in \w, so it stops at the hyphen
    const text = 'icon-only';
    expect(getWordAtOffset(text, 2)).toBe('icon');
    expect(getWordAtOffset(text, 6)).toBe('only');
  });

  it('handles underscore-separated names', () => {
    const text = 'my_variable';
    expect(getWordAtOffset(text, 5)).toBe('my_variable');
  });

  it('handles numeric values in identifiers', () => {
    const text = 'value2';
    expect(getWordAtOffset(text, 3)).toBe('value2');
  });
});

/*******************************
   formatAttributeDoc — with real spec data
*******************************/

describe('formatAttributeDoc — with real button spec data', () => {
  it('formats emphasis attribute from real spec JSON', () => {
    const meta = {
      name: 'Emphasis',
      description: 'be emphasized in a layout',
      exampleCode: '\n            <ui-button primary>Confirm</ui-button>\n            <ui-button>Cancel</ui-button>\n          ',
    };
    const spec = {
      propertyTypes: { emphasis: 'string' },
      allowedValues: { emphasis: ['primary', 'secondary'] },
    };

    const doc = formatAttributeDoc('emphasis', meta, spec);
    // Example code should be trimmed
    expect(doc).toContain('<ui-button primary>Confirm</ui-button>');
    expect(doc).not.toMatch(/^\s*\n/); // no leading whitespace in code block
  });
});
