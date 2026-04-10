import { ExpressionEvaluator } from '../src/expression-evaluator.js';

/*******************************
     Standalone profiling script
  ******************************

  Usage:
    node --prof bench/profile.js [filter]
    node --prof-process --preprocess isolate-*.log

  Runs expression evaluation in a tight loop with no test harness overhead.
  The resulting V8 tick log shows exactly where time is spent.

  Optional filter narrows to matching expression groups:
    node --prof bench/profile.js "inline"
    node --prof bench/profile.js "mixed"
*/

const ITERATIONS = 500_000;

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
  isClient: true,
  isServer: false,
};

const data = {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  icon: 'check',
  label: 'Submit',
  count: 42,
  value: 1,
  isOpen: false,
  isTrue: true,
  isDog: true,
  fruit: 'cherry',
  items: ['one', 'two', 'three'],
  user: { name: 'Jack', role: 'admin', settings: { theme: 'dark' } },
  isActive: true,
  classes: 'ui primary button',
};

const groups = {
  'simple identifier': ['count', 'label'],
  'dotted path': ['user.name', 'user.settings.theme'],
  'JS expression': ['count + 1', '(value + 2) * 5', 'isOpen ? "open" : "closed"'],
  'JS method call': ['addOne(value + 1)', 'activeIf(value == 1)'],
  'signal equality': ["fruit == 'cherry' ? 'yum' : 'yuck'"],
  'Lisp helper': ["classIf isActive 'active'", "maybe disabled 'off' 'on'", 'addOne value'],
  'Lisp nested parens': ["concat 'my ' 'friend ' (isDog ? 'simon' : 'pookie')", "maybe (not disabled) 'on' 'off'"],
  'inline object': ["getValue {one: 'two'} 'one'", 'classMap { one: true, two: true, three: isActive }'],
  'inline array': ["join ['1', '2', '3'] ' and '"],
};

const filter = process.argv[2]?.toLowerCase();
const evaluator = new ExpressionEvaluator({ data, helpers });

// Warm up — let V8 optimize before profiling
for (const [, exprs] of Object.entries(groups)) {
  for (const expr of exprs) {
    for (let i = 0; i < 1000; i++) { evaluator.evaluate(expr, data); }
  }
}

for (const [name, exprs] of Object.entries(groups)) {
  if (filter && !name.toLowerCase().includes(filter)) { continue; }
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    for (let j = 0; j < exprs.length; j++) {
      evaluator.evaluate(exprs[j], data);
    }
  }
  const ms = (performance.now() - start).toFixed(1);
  const total = ITERATIONS * exprs.length;
  const opsPerSec = ((total / (ms / 1000)) / 1000).toFixed(0);
  console.log(
    `${name.padEnd(22)} ${ms.padStart(8)}ms  ${
      opsPerSec.padStart(8)
    }K ops/s  (${exprs.length} exprs × ${ITERATIONS.toLocaleString()})`,
  );
}
