/*
  Static registry of built-in template helpers.
  Maps helper name to signature info for completions and hover.
  Mirrors the helpers in packages/templating/src/template-helpers.js.
*/

export const helpers = {
  // Logic
  exists: {
    params: [{ name: 'a', type: 'any' }],
    returns: 'boolean',
    description: 'Returns true if value is not empty',
  },
  isEmpty: { params: [{ name: 'a', type: 'any' }], returns: 'boolean', description: 'Returns true if value is empty' },
  hasAny: {
    params: [{ name: 'a', type: 'array' }],
    returns: 'boolean',
    description: 'Returns true if array has items',
  },
  both: {
    params: [{ name: 'a', type: 'any' }, { name: 'b', type: 'any' }],
    returns: 'boolean',
    description: 'Returns a && b',
  },
  either: {
    params: [{ name: 'a', type: 'any' }, { name: 'b', type: 'any' }],
    returns: 'any',
    description: 'Returns a || b',
  },
  maybe: {
    params: [{ name: 'expr', type: 'any' }, { name: 'trueExpr', type: 'any' }, { name: 'falseExpr', type: 'any' }],
    returns: 'any',
    description: 'Ternary: expr ? trueExpr : falseExpr',
  },
  not: { params: [{ name: 'a', type: 'any' }], returns: 'boolean', description: 'Returns !a' },
  default: {
    params: [{ name: 'value', type: 'any' }, { name: 'fallback', type: 'any' }],
    returns: 'any',
    description: 'Returns value ?? fallback',
  },

  // Comparison
  is: {
    params: [{ name: 'a', type: 'any' }, { name: 'b', type: 'any' }],
    returns: 'boolean',
    description: 'Loose equality (a == b)',
  },
  isNot: {
    params: [{ name: 'a', type: 'any' }, { name: 'b', type: 'any' }],
    returns: 'boolean',
    description: 'Strict inequality (a !== b)',
  },
  notEqual: {
    params: [{ name: 'a', type: 'any' }, { name: 'b', type: 'any' }],
    returns: 'boolean',
    description: 'Alias for isNot',
  },
  isExactly: {
    params: [{ name: 'a', type: 'any' }, { name: 'b', type: 'any' }],
    returns: 'boolean',
    description: 'Strict equality (a === b)',
  },
  isNotExactly: {
    params: [{ name: 'a', type: 'any' }, { name: 'b', type: 'any' }],
    returns: 'boolean',
    description: 'Strict inequality (a !== b)',
  },
  greaterThan: {
    params: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    returns: 'boolean',
    description: 'Returns a > b',
  },
  lessThan: {
    params: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    returns: 'boolean',
    description: 'Returns a < b',
  },
  greaterThanEquals: {
    params: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    returns: 'boolean',
    description: 'Returns a >= b',
  },
  lessThanEquals: {
    params: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    returns: 'boolean',
    description: 'Returns a <= b',
  },

  // String
  concat: {
    params: [{ name: '...args', type: 'any[]' }],
    returns: 'string',
    description: 'Joins all arguments into a string',
  },
  capitalize: {
    params: [{ name: 'text', type: 'string' }],
    returns: 'string',
    description: 'Capitalizes the first letter',
  },
  titleCase: { params: [{ name: 'text', type: 'string' }], returns: 'string', description: 'Converts to title case' },
  stringify: { params: [{ name: 'a', type: 'any' }], returns: 'string', description: 'JSON.stringify' },
  maybePlural: {
    params: [{ name: 'value', type: 'number' }, { name: 'plural', type: 'string', optional: true }],
    returns: 'string',
    description: 'Returns plural suffix if value != 1',
  },
  tokenize: {
    params: [{ name: 'string', type: 'string' }],
    returns: 'string',
    description: 'Converts to kebab-case tokens',
  },
  escapeHTML: { params: [{ name: 'string', type: 'string' }], returns: 'string', description: 'Escapes HTML entities' },
  truncate: {
    params: [{ name: 'text', type: 'string' }, { name: 'length', type: 'number' }, {
      name: 'options',
      type: 'object',
      optional: true,
    }],
    returns: 'string',
    description: 'Truncates text to length',
  },
  lowercase: { params: [{ name: 'text', type: 'string' }], returns: 'string', description: 'Converts to lowercase' },
  uppercase: { params: [{ name: 'text', type: 'string' }], returns: 'string', description: 'Converts to uppercase' },

  // CSS
  classIf: {
    params: [{ name: 'expr', type: 'any' }, { name: 'trueClass', type: 'string' }, {
      name: 'falseClass',
      type: 'string',
      optional: true,
    }],
    returns: 'string',
    description: 'Returns class name if expr is truthy',
  },
  classMap: {
    params: [{ name: 'classObj', type: 'object' }],
    returns: 'string',
    description: 'Returns space-joined class names for truthy values',
  },
  activeIf: { params: [{ name: 'expr', type: 'any' }], returns: 'string', description: 'Returns "active " if truthy' },
  selectedIf: {
    params: [{ name: 'expr', type: 'any' }],
    returns: 'string',
    description: 'Returns "selected " if truthy',
  },
  disabledIf: {
    params: [{ name: 'expr', type: 'any' }],
    returns: 'string',
    description: 'Returns "disabled " if truthy',
  },
  checkedIf: {
    params: [{ name: 'expr', type: 'any' }],
    returns: 'string',
    description: 'Returns "checked " if truthy',
  },
  classes: {
    params: [{ name: 'array', type: 'string[]' }],
    returns: 'string',
    description: 'Joins array into space-separated class string',
  },

  // Array & Object
  first: { params: [{ name: 'array', type: 'array' }], returns: 'any', description: 'Returns the first element' },
  last: { params: [{ name: 'array', type: 'array' }], returns: 'any', description: 'Returns the last element' },
  count: { params: [{ name: 'a', type: 'array | string' }], returns: 'number', description: 'Returns the length' },
  join: {
    params: [{ name: 'array', type: 'array' }, { name: 'delimiter', type: 'string', optional: true }],
    returns: 'string',
    description: 'Joins array with delimiter',
  },
  joinComma: {
    params: [{ name: 'array', type: 'array' }, { name: 'oxford', type: 'boolean', optional: true }, {
      name: 'quotes',
      type: 'boolean',
      optional: true,
    }],
    returns: 'string',
    description: 'Joins array with commas and "and"',
  },
  range: {
    params: [{ name: 'start', type: 'number' }, { name: 'stop', type: 'number' }, {
      name: 'step',
      type: 'number',
      optional: true,
    }],
    returns: 'number[]',
    description: 'Generates a range of numbers',
  },
  sequence: {
    params: [{ name: 'count', type: 'number' }, { name: 'interval', type: 'number', optional: true }, {
      name: 'start',
      type: 'number',
      optional: true,
    }],
    returns: 'number[]',
    description: 'Generates a sequence',
  },
  arrayFromObject: {
    params: [{ name: 'obj', type: 'object' }],
    returns: 'array',
    description: 'Converts object to array of {key, value}',
  },

  // Date & Number
  formatDate: {
    params: [{ name: 'date', type: 'Date' }, { name: 'format', type: 'string', optional: true }, {
      name: 'options',
      type: 'object',
      optional: true,
    }],
    returns: 'string',
    description: 'Formats a date (default: "L")',
  },
  formatDateTime: {
    params: [{ name: 'date', type: 'Date' }, { name: 'format', type: 'string', optional: true }, {
      name: 'options',
      type: 'object',
      optional: true,
    }],
    returns: 'string',
    description: 'Formats date and time (default: "LLL")',
  },
  formatTime: {
    params: [{ name: 'date', type: 'Date' }, { name: 'format', type: 'string', optional: true }, {
      name: 'options',
      type: 'object',
      optional: true,
    }],
    returns: 'string',
    description: 'Formats time (default: "LTS")',
  },
  roundNumber: {
    params: [{ name: 'number', type: 'number' }, { name: 'precision', type: 'number', optional: true }],
    returns: 'number',
    description: 'Rounds a number',
  },
  round: {
    params: [{ name: 'number', type: 'number' }, { name: 'precision', type: 'number', optional: true }],
    returns: 'number',
    description: 'Alias for roundNumber',
  },
  roundDecimal: {
    params: [{ name: 'number', type: 'number' }, { name: 'precision', type: 'number', optional: true }],
    returns: 'number',
    description: 'Rounds to decimal places',
  },
  numberFromIndex: {
    params: [{ name: 'a', type: 'number' }],
    returns: 'number',
    description: 'Returns a + 1 (1-indexed display)',
  },

  // Debug
  log: { params: [{ name: '...args', type: 'any[]' }], returns: 'void', description: 'console.log' },
  debugger: { params: [], returns: 'void', description: 'Triggers debugger breakpoint' },
  debugReactivity: { params: [], returns: 'void', description: 'Logs reactive dependency source' },

  // Reactivity
  guard: {
    params: [{ name: 'value', type: 'any' }],
    returns: 'any',
    description: 'Only re-evaluates when value changes',
  },
  nonreactive: {
    params: [{ name: 'value', type: 'any' }],
    returns: 'any',
    description: 'Evaluates without tracking dependencies',
  },
};

export function getHelper(name) {
  return helpers[name] || null;
}

export function getHelperNames() {
  return Object.keys(helpers);
}

export function formatHelperSignature(name) {
  const h = helpers[name];
  if (!h) { return null; }
  const params = h.params.map(p => p.optional ? `${p.name}?` : p.name).join(', ');
  return `${name}(${params}): ${h.returns}`;
}
