import { describe, expect, it } from 'vitest';
import { formatHelperSignature, getHelper, getHelperNames, helpers } from '../src/helper-registry.js';

/*
  Validates the LSP helper registry against real-world usage patterns.
  The registry must stay in sync with packages/templating/src/template-helpers.js.
  If a helper exists in the framework but not in the LSP registry, developers
  get no completions or hover info when using it.
*/

// The canonical list of template helpers from packages/templating/src/template-helpers.js
const REAL_HELPERS = [
  // Logic
  'exists', 'isEmpty', 'hasAny', 'both', 'either', 'maybe', 'not', 'default',
  // Comparison
  'is', 'isNot', 'notEqual', 'isExactly', 'isNotExactly',
  'greaterThan', 'lessThan', 'greaterThanEquals', 'lessThanEquals',
  // String
  'concat', 'capitalize', 'titleCase', 'stringify', 'maybePlural',
  'tokenize', 'escapeHTML', 'truncate', 'lowercase', 'uppercase',
  // CSS
  'classIf', 'classMap', 'activeIf', 'selectedIf', 'disabledIf', 'checkedIf', 'classes',
  // Array & Object
  'first', 'last', 'count', 'join', 'joinComma', 'range', 'sequence', 'arrayFromObject',
  // Date & Number
  'formatDate', 'formatDateTime', 'formatTime',
  'roundNumber', 'round', 'roundDecimal', 'numberFromIndex',
  // Debug
  'log', 'debugger', 'debugReactivity',
  // Reactivity
  'guard', 'nonreactive',
];

describe('HelperRegistry — sync with framework', () => {
  it('contains every helper from the templating package', () => {
    const registeredNames = getHelperNames();
    const missing = REAL_HELPERS.filter(name => !registeredNames.includes(name));
    expect(missing, `LSP registry is missing helpers: ${missing.join(', ')}`).toEqual([]);
  });

  it('does not contain phantom helpers not in the framework', () => {
    const registeredNames = getHelperNames();
    const extra = registeredNames.filter(name => !REAL_HELPERS.includes(name));
    expect(extra, `LSP registry has extra helpers: ${extra.join(', ')}`).toEqual([]);
  });
});

describe('HelperRegistry — param accuracy', () => {
  /*
    Validates param counts match the real function signatures.
    If the LSP says concat takes 1 param but it actually takes ...args,
    the completion detail will mislead users.
  */

  it('concat has variadic params', () => {
    const h = getHelper('concat');
    expect(h.params).toHaveLength(1);
    expect(h.params[0].name).toBe('...args');
  });

  it('classIf has 3 params (expr, trueClass, falseClass)', () => {
    const h = getHelper('classIf');
    expect(h.params).toHaveLength(3);
    expect(h.params[0].name).toBe('expr');
    expect(h.params[1].name).toBe('trueClass');
    expect(h.params[2].name).toBe('falseClass');
    expect(h.params[2].optional).toBe(true);
  });

  it('maybe has 3 params (expr, trueExpr, falseExpr)', () => {
    const h = getHelper('maybe');
    expect(h.params).toHaveLength(3);
  });

  it('formatDate marks format and options as optional', () => {
    const h = getHelper('formatDate');
    expect(h.params[0].optional).toBeFalsy();
    expect(h.params[1].optional).toBe(true);
    expect(h.params[2].optional).toBe(true);
  });

  it('join marks delimiter as optional', () => {
    const h = getHelper('join');
    expect(h.params).toHaveLength(2);
    expect(h.params[1].optional).toBe(true);
  });

  it('joinComma marks oxford and quotes as optional', () => {
    const h = getHelper('joinComma');
    expect(h.params).toHaveLength(3);
    expect(h.params[1].optional).toBe(true);
    expect(h.params[2].optional).toBe(true);
  });

  it('truncate marks options as optional', () => {
    const h = getHelper('truncate');
    expect(h.params).toHaveLength(3);
    expect(h.params[2].optional).toBe(true);
  });

  it('all helpers with params have param names', () => {
    for (const [name, helper] of Object.entries(helpers)) {
      for (const param of helper.params) {
        expect(param.name, `${name} has a param without a name`).toBeTruthy();
      }
    }
  });

  it('all helpers have a returns type', () => {
    for (const [name, helper] of Object.entries(helpers)) {
      expect(helper.returns, `${name} has no return type`).toBeTruthy();
    }
  });
});

describe('HelperRegistry — signature formatting for common templates', () => {
  /*
    These are helpers most commonly seen in real SUI templates.
    The formatted signature appears in VS Code completion detail.
  */

  it('formats classMap correctly', () => {
    expect(formatHelperSignature('classMap')).toBe('classMap(classObj): string');
  });

  it('formats activeIf correctly', () => {
    expect(formatHelperSignature('activeIf')).toBe('activeIf(expr): string');
  });

  it('formats hasAny correctly', () => {
    expect(formatHelperSignature('hasAny')).toBe('hasAny(a): boolean');
  });

  it('formats is correctly', () => {
    expect(formatHelperSignature('is')).toBe('is(a, b): boolean');
  });

  it('formats formatDate with optional params', () => {
    expect(formatHelperSignature('formatDate')).toBe('formatDate(date, format?, options?): string');
  });

  it('formats range correctly', () => {
    expect(formatHelperSignature('range')).toBe('range(start, stop, step?): number[]');
  });

  it('returns null for unknown helpers', () => {
    expect(formatHelperSignature('doesNotExist')).toBeNull();
  });
});
