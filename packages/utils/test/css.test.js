import { prefixCSS } from '@semantic-ui/utils';
import { describe, expect, it } from 'vitest';

describe('prefixCSS', () => {
  it('should add -webkit-user-select prefix', () => {
    const input = '  .select-none {\n    user-select: none;\n  }';
    const output = prefixCSS(input);
    expect(output).toContain('-webkit-user-select: none;');
    expect(output).toContain('user-select: none;');
  });

  it('should add -webkit-backdrop-filter prefix', () => {
    const input = '  .blur {\n    backdrop-filter: blur(4px);\n  }';
    const output = prefixCSS(input);
    expect(output).toContain('-webkit-backdrop-filter: blur(4px);');
    expect(output).toContain('backdrop-filter: blur(4px);');
  });

  it('should add -webkit-print-color-adjust prefix', () => {
    const input = '  .exact {\n    print-color-adjust: exact;\n  }';
    const output = prefixCSS(input);
    expect(output).toContain('-webkit-print-color-adjust: exact;');
  });

  it('should add -moz-text-size-adjust prefix', () => {
    const input = '  html {\n    text-size-adjust: 100%;\n  }';
    const output = prefixCSS(input);
    expect(output).toContain('-moz-text-size-adjust: 100%;');
    expect(output).toContain('text-size-adjust: 100%;');
  });

  it('should not prefix already-prefixed lines', () => {
    const input = '    -webkit-user-select: none;';
    const output = prefixCSS(input);
    const count = (output.match(/-webkit-user-select/g) || []).length;
    expect(count).toBe(1);
  });

  it('should not modify unrelated properties', () => {
    const input = '  .flex {\n    display: flex;\n    color: red;\n  }';
    const output = prefixCSS(input);
    expect(output).toBe(input);
  });

  it('should preserve indentation', () => {
    const input = '      user-select: none;';
    const output = prefixCSS(input);
    expect(output).toContain('      -webkit-user-select: none;');
  });

  it('should handle multiple properties in one block', () => {
    const input = '.foo {\n  user-select: none;\n  backdrop-filter: blur(10px);\n}';
    const output = prefixCSS(input);
    expect(output).toContain('-webkit-user-select');
    expect(output).toContain('-webkit-backdrop-filter');
  });

  it('should return empty/null input unchanged', () => {
    expect(prefixCSS('')).toBe('');
    expect(prefixCSS(null)).toBe(null);
    expect(prefixCSS(undefined)).toBe(undefined);
  });
});
