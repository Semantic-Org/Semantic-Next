import { Signal } from '@semantic-ui/reactivity';
import { bench, describe } from 'vitest';
import { ExpressionEvaluator } from '../src/expression-evaluator.js';
import { ExpressionEvaluatorBaseline } from './baseline/expression-evaluator.js';

/*******************************
       Test Data — Realistic
*******************************/

// Template helpers — mirrors TemplateHelpers from templating package
const helpers = {
  exists(a) {
    return a != null && a !== '';
  },
  isEmpty(a) {
    return a == null || a === '' || (Array.isArray(a) && a.length === 0);
  },
  not(a) {
    return !a;
  },
  is(a, b) {
    return a == b;
  },
  concat(...args) {
    return args.join('');
  },
  classIf(expr, trueClass = '', falseClass = '') {
    return expr ? `${trueClass} ` : falseClass ? `${falseClass} ` : '';
  },
  maybe(expr, a, b) {
    return expr ? a : b;
  },
  capitalize(s) {
    return s ? s[0].toUpperCase() + s.slice(1) : '';
  },
  formatDate() {
    return '4/9/2026';
  },
  join(arr, d) {
    return arr ? arr.join(d) : '';
  },
  round(n) {
    return Math.round(n);
  },
  isClient: true,
  isServer: false,
};

// Component data context — flat namespace (settings + state + return values merged)
const data = {
  // Settings
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  icon: 'check',
  label: 'Submit',
  // State
  count: 42,
  isOpen: false,
  items: ['one', 'two', 'three'],
  user: { name: 'Jack', role: 'admin', settings: { theme: 'dark' } },
  // Computed
  isActive: true,
  classes: 'ui primary button',
};

// Create evaluators
const baseline = new ExpressionEvaluatorBaseline({ data, helpers });
const optimized = new ExpressionEvaluator({ data, helpers });

/*******************************
     A/B — Simple identifier (most common)
*******************************/

describe('simple identifier — {count}', () => {
  bench('baseline', () => {
    baseline.evaluate('count', data);
  });
  bench('optimized', () => {
    optimized.evaluate('count', data);
  });
});

describe('simple identifier — {label}', () => {
  bench('baseline', () => {
    baseline.evaluate('label', data);
  });
  bench('optimized', () => {
    optimized.evaluate('label', data);
  });
});

/*******************************
     A/B — Dotted path
*******************************/

describe('dotted path — {user.name}', () => {
  bench('baseline', () => {
    baseline.evaluate('user.name', data);
  });
  bench('optimized', () => {
    optimized.evaluate('user.name', data);
  });
});

describe('deep dotted path — {user.settings.theme}', () => {
  bench('baseline', () => {
    baseline.evaluate('user.settings.theme', data);
  });
  bench('optimized', () => {
    optimized.evaluate('user.settings.theme', data);
  });
});

/*******************************
     A/B — JS expressions
*******************************/

describe('JS expression — {count + 1}', () => {
  bench('baseline', () => {
    baseline.evaluate('count + 1', data);
  });
  bench('optimized', () => {
    optimized.evaluate('count + 1', data);
  });
});

describe('JS ternary — {isOpen ? "open" : "closed"}', () => {
  bench('baseline', () => {
    baseline.evaluate('isOpen ? "open" : "closed"', data);
  });
  bench('optimized', () => {
    optimized.evaluate('isOpen ? "open" : "closed"', data);
  });
});

/*******************************
     A/B — Lisp-style helper calls
*******************************/

describe('helper call — {classIf isActive "active"}', () => {
  bench('baseline', () => {
    baseline.evaluate("classIf isActive 'active'", data);
  });
  bench('optimized', () => {
    optimized.evaluate("classIf isActive 'active'", data);
  });
});

describe('helper call — {maybe disabled "off" "on"}', () => {
  bench('baseline', () => {
    baseline.evaluate("maybe disabled 'off' 'on'", data);
  });
  bench('optimized', () => {
    optimized.evaluate("maybe disabled 'off' 'on'", data);
  });
});

/*******************************
     A/B — Mixed batch (realistic component render)
*******************************/

describe('mixed batch — 8 expressions (simulating a component render)', () => {
  const expressions = [
    'label',
    'icon',
    'classes',
    'user.name',
    'count + 1',
    "classIf isActive 'active'",
    'isOpen ? "open" : "closed"',
    "maybe disabled 'off' 'on'",
  ];

  bench('baseline', () => {
    for (let i = 0; i < expressions.length; i++) {
      baseline.evaluate(expressions[i], data);
    }
  });

  bench('optimized', () => {
    for (let i = 0; i < expressions.length; i++) {
      optimized.evaluate(expressions[i], data);
    }
  });
});
