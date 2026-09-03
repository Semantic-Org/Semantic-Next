import { Signal } from '@semantic-ui/reactivity';
import { existsSync } from 'node:fs';
import { test } from 'vitest';
import { ExpressionEvaluator } from '../src/expression-evaluator.js';

// A/B comparison: populate bench/baseline/expression-evaluator.js to enable.
// See bench/baseline/README.md for instructions.
const baselinePath = new URL('./baseline/expression-evaluator.js', import.meta.url);
const hasBaseline = existsSync(baselinePath);
let ExpressionEvaluatorBaseline;
if (hasBaseline) {
  ({ ExpressionEvaluatorBaseline } = await import(baselinePath.href));
}

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
  addOne(value = 0) {
    return value + 1;
  },
  getValue(obj = {}, prop) {
    return obj[prop];
  },
  activeIf(expr) {
    return expr ? 'active' : '';
  },
  classMap(obj) {
    return Object.entries(obj).filter(([, v]) => v).map(([k]) => k).join(' ');
  },
  formatDate(date, fmt, opts) {
    return '12:00:00 PM';
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
  value: 1,
  isOpen: false,
  isTrue: true,
  isDog: true,
  fruit: 'cherry',
  items: ['one', 'two', 'three'],
  user: { name: 'Jack', role: 'admin', settings: { theme: 'dark' } },
  // Computed
  isActive: true,
  classes: 'ui primary button',
};

// Same shape as data but with Signals wrapping state values — mirrors real components
// where state is always signals and settings are plain values
const signalData = {
  // Settings (plain)
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  icon: 'check',
  label: 'Submit',
  // State (signals)
  count: new Signal(42),
  value: new Signal(1),
  isOpen: new Signal(false),
  isTrue: new Signal(true),
  isDog: new Signal(true),
  fruit: new Signal('cherry'),
  items: new Signal(['one', 'two', 'three']),
  user: { name: new Signal('Jack'), role: 'admin', settings: { theme: 'dark' } },
  // Computed
  isActive: new Signal(true),
  classes: 'ui primary button',
};

const current = new ExpressionEvaluator({ data, helpers });
const currentSignal = new ExpressionEvaluator({ data: signalData, helpers });
const baseline = hasBaseline ? new ExpressionEvaluatorBaseline({ data, helpers }) : null;

// A/B group with an optional baseline: 'current' always runs, 'baseline' joins
// the comparison only when bench/baseline/expression-evaluator.js is populated.
// bench.compare() requires at least 2 benchmarks, so without a baseline this
// just runs 'current' alone.
async function compareWithOptionalBaseline(bench, currentFn, baselineFn) {
  if (!baseline) {
    await bench('current', currentFn).run();
    return;
  }
  await bench.compare(
    bench('current', currentFn),
    bench('baseline', baselineFn),
  );
}

/*******************************
     Simple identifier (most common)
*******************************/

test('simple identifier — {count}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate('count', data);
    },
    () => {
      baseline.evaluate('count', data);
    },
  );
});

test('simple identifier — {label}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate('label', data);
    },
    () => {
      baseline.evaluate('label', data);
    },
  );
});

/*******************************
     Dotted path
*******************************/

test('dotted path — {user.name}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate('user.name', data);
    },
    () => {
      baseline.evaluate('user.name', data);
    },
  );
});

test('deep dotted path — {user.settings.theme}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate('user.settings.theme', data);
    },
    () => {
      baseline.evaluate('user.settings.theme', data);
    },
  );
});

/*******************************
     JS expressions
*******************************/

test('JS expression — {count + 1}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate('count + 1', data);
    },
    () => {
      baseline.evaluate('count + 1', data);
    },
  );
});

test('JS ternary — {isOpen ? "open" : "closed"}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate('isOpen ? "open" : "closed"', data);
    },
    () => {
      baseline.evaluate('isOpen ? "open" : "closed"', data);
    },
  );
});

/*******************************
     Lisp-style helper calls
*******************************/

test('helper call — {classIf isActive "active"}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate("classIf isActive 'active'", data);
    },
    () => {
      baseline.evaluate("classIf isActive 'active'", data);
    },
  );
});

test('helper call — {maybe disabled "off" "on"}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate("maybe disabled 'off' 'on'", data);
    },
    () => {
      baseline.evaluate("maybe disabled 'off' 'on'", data);
    },
  );
});

/*******************************
     Parenthesized sub-expressions
*******************************/

test('order of operations — {(value + 2) * 5}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate('(value + 2) * 5', data);
    },
    () => {
      baseline.evaluate('(value + 2) * 5', data);
    },
  );
});

/*******************************
     Mixed Lisp + JS (the hard path)
*******************************/

test('mixed — {concat "my " "friend " (isDog ? "simon" : "pookie")}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate("concat 'my ' 'friend ' (isDog ? 'simon' : 'pookie')", data);
    },
    () => {
      baseline.evaluate("concat 'my ' 'friend ' (isDog ? 'simon' : 'pookie')", data);
    },
  );
});

test('Lisp helper with nested parens — {maybe (not disabled) "on" "off"}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate("maybe (not disabled) 'on' 'off'", data);
    },
    () => {
      baseline.evaluate("maybe (not disabled) 'on' 'off'", data);
    },
  );
});

/*******************************
     JS method calls with computed args
*******************************/

test('JS method call — {addOne(value + 1)}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate('addOne(value + 1)', data);
    },
    () => {
      baseline.evaluate('addOne(value + 1)', data);
    },
  );
});

test('JS equality + helper — {activeIf(value == 1)}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate('activeIf(value == 1)', data);
    },
    () => {
      baseline.evaluate('activeIf(value == 1)', data);
    },
  );
});

/*******************************
     Inline objects and arrays
*******************************/

test('inline object — {getValue {one: "two"} "one"}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate("getValue {one: 'two'} 'one'", data);
    },
    () => {
      baseline.evaluate("getValue {one: 'two'} 'one'", data);
    },
  );
});

test('inline array — {join ["1", "2", "3"] " and "}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate("join ['1', '2', '3'] ' and '", data);
    },
    () => {
      baseline.evaluate("join ['1', '2', '3'] ' and '", data);
    },
  );
});

test('classMap with inline object — {classMap { one: true, two: true, three: isActive }}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate('classMap { one: true, two: true, three: isActive }', data);
    },
    () => {
      baseline.evaluate('classMap { one: true, two: true, three: isActive }', data);
    },
  );
});

/*******************************
     Signal comparison in JS
*******************************/

test('signal equality — {fruit == "cherry" ? "yum" : "yuck"}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate("fruit == 'cherry' ? 'yum' : 'yuck'", data);
    },
    () => {
      baseline.evaluate("fruit == 'cherry' ? 'yum' : 'yuck'", data);
    },
  );
});

/*******************************
     Lisp helper call — spaced arg is data lookup
*******************************/

test('Lisp data arg — {addOne value}', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      current.evaluate('addOne value', data);
    },
    () => {
      baseline.evaluate('addOne value', data);
    },
  );
});

/*******************************
     Signal unwrapping
*******************************/

test('signal identifier — {count} (Signal)', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      currentSignal.evaluate('count', signalData);
    },
    () => {
      baseline.evaluate('count', signalData);
    },
  );
});

test('signal dotted path — {user.name} (Signal)', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      currentSignal.evaluate('user.name', signalData);
    },
    () => {
      baseline.evaluate('user.name', signalData);
    },
  );
});

test('signal vs plain — {label} (plain in mixed context)', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      currentSignal.evaluate('label', signalData);
    },
    () => {
      baseline.evaluate('label', signalData);
    },
  );
});

test('signal ternary — {isOpen ? "open" : "closed"} (Signal)', async ({ bench }) => {
  await compareWithOptionalBaseline(
    bench,
    () => {
      currentSignal.evaluate('isOpen ? "open" : "closed"', signalData);
    },
    () => {
      baseline.evaluate('isOpen ? "open" : "closed"', signalData);
    },
  );
});

/*******************************
     Mixed batch (realistic component render)
*******************************/

test('mixed batch — 12 expressions (simulating a component render)', async ({ bench }) => {
  const expressions = [
    'label',
    'icon',
    'classes',
    'user.name',
    'count + 1',
    "classIf isActive 'active'",
    'isOpen ? "open" : "closed"',
    "maybe disabled 'off' 'on'",
    "concat 'my ' 'friend ' (isDog ? 'simon' : 'pookie')",
    'addOne(value + 1)',
    "getValue {one: 'two'} 'one'",
    "fruit == 'cherry' ? 'yum' : 'yuck'",
  ];

  await compareWithOptionalBaseline(
    bench,
    () => {
      for (let i = 0; i < expressions.length; i++) {
        current.evaluate(expressions[i], data);
      }
    },
    () => {
      for (let i = 0; i < expressions.length; i++) {
        baseline.evaluate(expressions[i], data);
      }
    },
  );
});

test('mixed batch — 12 expressions (Signal context)', async ({ bench }) => {
  const expressions = [
    'label',
    'icon',
    'classes',
    'user.name',
    'count + 1',
    "classIf isActive 'active'",
    'isOpen ? "open" : "closed"',
    "maybe disabled 'off' 'on'",
    "concat 'my ' 'friend ' (isDog ? 'simon' : 'pookie')",
    'addOne(value + 1)',
    "getValue {one: 'two'} 'one'",
    "fruit == 'cherry' ? 'yum' : 'yuck'",
  ];

  await compareWithOptionalBaseline(
    bench,
    () => {
      for (let i = 0; i < expressions.length; i++) {
        currentSignal.evaluate(expressions[i], signalData);
      }
    },
    () => {
      for (let i = 0; i < expressions.length; i++) {
        baseline.evaluate(expressions[i], signalData);
      }
    },
  );
});
