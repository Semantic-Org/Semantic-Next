import { describe, expect, it } from 'vitest';
import { formatHelperSignature, getHelper, getHelperNames, helpers } from '../src/shared/helper-registry.js';

describe('HelperRegistry', () => {
  it('contains all major helpers', () => {
    const names = getHelperNames();
    // Logic
    expect(names).toContain('exists');
    expect(names).toContain('not');
    expect(names).toContain('both');
    // Comparison
    expect(names).toContain('is');
    expect(names).toContain('greaterThan');
    // String
    expect(names).toContain('concat');
    expect(names).toContain('capitalize');
    // CSS
    expect(names).toContain('classIf');
    expect(names).toContain('classMap');
    expect(names).toContain('activeIf');
    // Array
    expect(names).toContain('first');
    expect(names).toContain('range');
    // Date
    expect(names).toContain('formatDate');
    // Debug
    expect(names).toContain('log');
    // Reactivity
    expect(names).toContain('guard');
    expect(names).toContain('nonreactive');
  });

  it('returns null for unknown helper', () => {
    expect(getHelper('nonExistentHelper')).toBeNull();
  });

  it('returns signature for known helper', () => {
    const helper = getHelper('formatDate');
    expect(helper).toBeTruthy();
    expect(helper.params).toHaveLength(3);
    expect(helper.params[0].name).toBe('date');
    expect(helper.returns).toBe('string');
  });

  it('marks optional params', () => {
    const helper = getHelper('formatDate');
    expect(helper.params[1].optional).toBe(true);
    expect(helper.params[2].optional).toBe(true);
  });

  it('formats signatures correctly', () => {
    expect(formatHelperSignature('classIf')).toBe('classIf(expr, trueClass, falseClass?): string');
    expect(formatHelperSignature('not')).toBe('not(a): boolean');
    expect(formatHelperSignature('concat')).toBe('concat(...args): string');
  });

  it('has descriptions for all helpers', () => {
    for (const [name, helper] of Object.entries(helpers)) {
      expect(helper.description, `${name} missing description`).toBeTruthy();
    }
  });
});
