import { indentHTML, indentLines } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('HTML Utilities', () => {
  describe('indentLines', () => {
    it('should add 2 spaces of indentation by default', () => {
      const input = 'line 1\nline 2\nline 3';
      const expected = '  line 1\n  line 2\n  line 3';
      expect(indentLines(input)).toBe(expected);
    });

    it('should add custom number of spaces', () => {
      const input = 'line 1\nline 2';
      const expected = '    line 1\n    line 2';
      expect(indentLines(input, 4)).toBe(expected);
    });

    it('should handle single line text', () => {
      expect(indentLines('single line')).toBe('  single line');
      expect(indentLines('single line', 4)).toBe('    single line');
    });

    it('should handle empty string', () => {
      // Intentional: an empty string is treated as a single empty line, so it gets indented
      expect(indentLines('')).toBe('  ');
      expect(indentLines('', 4)).toBe('    ');
    });

    it('should handle non-string input', () => {
      expect(indentLines(null)).toBe('');
      expect(indentLines(undefined)).toBe('');
      expect(indentLines(123)).toBe('');
    });

    it('should preserve existing indentation', () => {
      const input = '  already indented\n  line 2';
      const expected = '    already indented\n    line 2';
      expect(indentLines(input)).toBe(expected);
    });

    it('should work with tabs', () => {
      const input = 'line 1\nline 2';
      expect(indentLines(input, 0)).toBe('line 1\nline 2');
    });
  });

  describe('indentHTML', () => {
    it('should properly indent nested HTML with default 2 spaces', () => {
      const input = '<div>\n<p>Content</p>\n</div>';
      const expected = '<div>\n  <p>Content</p>\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle multiple levels of nesting', () => {
      const input = '<div>\n<div>\n<p>Content</p>\n</div>\n</div>';
      const expected = '<div>\n  <div>\n    <p>Content</p>\n  </div>\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle void elements without increasing depth', () => {
      const input = '<div>\n<img src="test.jpg">\n<br>\n<input type="text">\n</div>';
      const expected = '<div>\n  <img src="test.jpg">\n  <br>\n  <input type="text">\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle self-closing tags', () => {
      const input = '<div>\n<img src="test.jpg" />\n<component />\n</div>';
      const expected = '<div>\n  <img src="test.jpg" />\n  <component />\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle elements with opening and closing tags on same line', () => {
      const input = '<div>\n<p>Title</p>\n<span>Text</span>\n</div>';
      const expected = '<div>\n  <p>Title</p>\n  <span>Text</span>\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle HTML comments', () => {
      const input = '<div>\n<!-- Comment -->\n<p>Content</p>\n</div>';
      const expected = '<div>\n  <!-- Comment -->\n  <p>Content</p>\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should use custom indent string', () => {
      const input = '<div>\n<p>Content</p>\n</div>';
      const expected = '<div>\n    <p>Content</p>\n</div>';
      expect(indentHTML(input, { indent: '    ' })).toBe(expected);
    });

    it('should use custom indent with tabs', () => {
      const input = '<div>\n<p>Content</p>\n</div>';
      const expected = '<div>\n\t<p>Content</p>\n</div>';
      expect(indentHTML(input, { indent: '\t' })).toBe(expected);
    });

    it('should respect startLevel option', () => {
      const input = '<div>\n<p>Content</p>\n</div>';
      const expected = '  <div>\n    <p>Content</p>\n  </div>';
      expect(indentHTML(input, { startLevel: 1 })).toBe(expected);
    });

    it('should remove empty lines by default', () => {
      const input = '<div>\n\n<p>Content</p>\n\n</div>';
      const expected = '<div>\n  <p>Content</p>\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should preserve empty lines when trimEmptyLines is false', () => {
      const input = '<div>\n\n<p>Content</p>\n\n</div>';
      const expected = '<div>\n  \n  <p>Content</p>\n  \n</div>';
      expect(indentHTML(input, { trimEmptyLines: false })).toBe(expected);
    });

    it('should handle messy indentation from template literals', () => {
      const input = `<div class="ui segment">
<div class="ui header">Title</div>
<p>Content here</p>
<div class="ui list">
<div class="item">
<img src="image.jpg" />
<div class="content">Item 1</div>
</div>
</div>
</div>`;

      const expected = `<div class="ui segment">
  <div class="ui header">Title</div>
  <p>Content here</p>
  <div class="ui list">
    <div class="item">
      <img src="image.jpg" />
      <div class="content">Item 1</div>
    </div>
  </div>
</div>`;

      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle all void elements', () => {
      const voidTags = [
        'area',
        'base',
        'br',
        'col',
        'embed',
        'hr',
        'img',
        'input',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr',
      ];

      voidTags.forEach(tag => {
        const input = `<div>\n<${tag}>\n</div>`;
        const expected = `<div>\n  <${tag}>\n</div>`;
        expect(indentHTML(input)).toBe(expected);
      });
    });

    it('should handle complex real-world HTML', () => {
      const input = `<div class="ui segment">
<div class="ui header">
Product List
</div>
<div class="ui list">
<div class="item">
<img src="product1.jpg" />
<div class="content">
<div class="header">Product 1</div>
<div class="description">Description here</div>
</div>
</div>
<div class="item">
<img src="product2.jpg" />
<div class="content">
<div class="header">Product 2</div>
</div>
</div>
</div>
</div>`;

      const result = indentHTML(input);

      // Verify structure by checking key lines
      expect(result).toContain('  <div class="ui header">');
      expect(result).toContain('    <div class="item">');
      expect(result).toContain('      <img src="product1.jpg" />');
      expect(result).toContain('        <div class="header">Product 1</div>');
    });

    it('should handle non-string input', () => {
      expect(indentHTML(null)).toBe('');
      expect(indentHTML(undefined)).toBe('');
      expect(indentHTML(123)).toBe('');
    });

    it('should handle empty string', () => {
      expect(indentHTML('')).toBe('');
    });

    it('should not break on attributes with angle brackets in values', () => {
      const input = '<div>\n<input placeholder="Enter <value>">\n</div>';
      const expected = '<div>\n  <input placeholder="Enter <value>">\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });
  });
});
