import { existsSync } from 'node:fs';
import { bench, describe } from 'vitest';
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

const current = new ExpressionEvaluator({ data, helpers });
const baseline = hasBaseline ? new ExpressionEvaluatorBaseline({ data, helpers }) : null;

/*******************************
     Simple identifier (most common)
*******************************/

describe('simple identifier — {count}', () => {
  bench('current', () => {
    current.evaluate('count', data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate('count', data);
    });
  }
});

describe('simple identifier — {label}', () => {
  bench('current', () => {
    current.evaluate('label', data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate('label', data);
    });
  }
});

/*******************************
     Dotted path
*******************************/

describe('dotted path — {user.name}', () => {
  bench('current', () => {
    current.evaluate('user.name', data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate('user.name', data);
    });
  }
});

describe('deep dotted path — {user.settings.theme}', () => {
  bench('current', () => {
    current.evaluate('user.settings.theme', data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate('user.settings.theme', data);
    });
  }
});

/*******************************
     JS expressions
*******************************/

describe('JS expression — {count + 1}', () => {
  bench('current', () => {
    current.evaluate('count + 1', data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate('count + 1', data);
    });
  }
});

describe('JS ternary — {isOpen ? "open" : "closed"}', () => {
  bench('current', () => {
    current.evaluate('isOpen ? "open" : "closed"', data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate('isOpen ? "open" : "closed"', data);
    });
  }
});

/*******************************
     Lisp-style helper calls
*******************************/

describe('helper call — {classIf isActive "active"}', () => {
  bench('current', () => {
    current.evaluate("classIf isActive 'active'", data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate("classIf isActive 'active'", data);
    });
  }
});

describe('helper call — {maybe disabled "off" "on"}', () => {
  bench('current', () => {
    current.evaluate("maybe disabled 'off' 'on'", data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate("maybe disabled 'off' 'on'", data);
    });
  }
});

/*******************************
     Parenthesized sub-expressions
*******************************/

describe('order of operations — {(value + 2) * 5}', () => {
  bench('current', () => {
    current.evaluate('(value + 2) * 5', data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate('(value + 2) * 5', data);
    });
  }
});

/*******************************
     Mixed Lisp + JS (the hard path)
*******************************/

describe('mixed — {concat "my " "friend " (isDog ? "simon" : "pookie")}', () => {
  bench('current', () => {
    current.evaluate("concat 'my ' 'friend ' (isDog ? 'simon' : 'pookie')", data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate("concat 'my ' 'friend ' (isDog ? 'simon' : 'pookie')", data);
    });
  }
});

describe('Lisp helper with nested parens — {maybe (not disabled) "on" "off"}', () => {
  bench('current', () => {
    current.evaluate("maybe (not disabled) 'on' 'off'", data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate("maybe (not disabled) 'on' 'off'", data);
    });
  }
});

/*******************************
     JS method calls with computed args
*******************************/

describe('JS method call — {addOne(value + 1)}', () => {
  bench('current', () => {
    current.evaluate('addOne(value + 1)', data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate('addOne(value + 1)', data);
    });
  }
});

describe('JS equality + helper — {activeIf(value == 1)}', () => {
  bench('current', () => {
    current.evaluate('activeIf(value == 1)', data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate('activeIf(value == 1)', data);
    });
  }
});

/*******************************
     Inline objects and arrays
*******************************/

describe('inline object — {getValue {one: "two"} "one"}', () => {
  bench('current', () => {
    current.evaluate("getValue {one: 'two'} 'one'", data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate("getValue {one: 'two'} 'one'", data);
    });
  }
});

describe('inline array — {join ["1", "2", "3"] " and "}', () => {
  bench('current', () => {
    current.evaluate("join ['1', '2', '3'] ' and '", data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate("join ['1', '2', '3'] ' and '", data);
    });
  }
});

describe('classMap with inline object — {classMap { one: true, two: true, three: isActive }}', () => {
  bench('current', () => {
    current.evaluate('classMap { one: true, two: true, three: isActive }', data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate('classMap { one: true, two: true, three: isActive }', data);
    });
  }
});

/*******************************
     Signal comparison in JS
*******************************/

describe('signal equality — {fruit == "cherry" ? "yum" : "yuck"}', () => {
  bench('current', () => {
    current.evaluate("fruit == 'cherry' ? 'yum' : 'yuck'", data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate("fruit == 'cherry' ? 'yum' : 'yuck'", data);
    });
  }
});

/*******************************
     Lisp helper call — spaced arg is data lookup
*******************************/

describe('Lisp data arg — {addOne value}', () => {
  bench('current', () => {
    current.evaluate('addOne value', data);
  });
  if (baseline) {
    bench('baseline', () => {
      baseline.evaluate('addOne value', data);
    });
  }
});

/*******************************
     Mixed batch (realistic component render)
*******************************/

describe('mixed batch — 12 expressions (simulating a component render)', () => {
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

  bench('current', () => {
    for (let i = 0; i < expressions.length; i++) {
      current.evaluate(expressions[i], data);
    }
  });

  if (baseline) {
    bench('baseline', () => {
      for (let i = 0; i < expressions.length; i++) {
        baseline.evaluate(expressions[i], data);
      }
    });
  }
});
