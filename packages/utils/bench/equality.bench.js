import { bench, describe } from 'vitest';
import { isEqual } from '../src/equality.js';

/*******************************
       Test Data — Realistic
*******************************/

// Component settings shape — the most common isEqual target
const settingsA = {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  icon: 'check',
  label: 'Submit',
  className: 'ui primary button',
  tabIndex: 0,
  ariaLabel: 'Submit form',
};
const settingsB = { ...settingsA };
const settingsDiff = { ...settingsA, variant: 'secondary' };

// Nested state shape — component with nested config
const stateA = {
  config: { theme: 'dark', locale: 'en-US', debug: false },
  layout: { columns: 3, gap: '1rem', padding: '2rem' },
  items: [
    { id: 1, name: 'First', active: true },
    { id: 2, name: 'Second', active: false },
    { id: 3, name: 'Third', active: true },
  ],
  metadata: { version: 2, updatedAt: '2024-01-01' },
};
const stateB = JSON.parse(JSON.stringify(stateA));
const stateDiff = JSON.parse(JSON.stringify(stateA));
stateDiff.items[1].active = true;

// Primitive — signal dirty check most common case
const num = 42;
const str = 'hello world';

/*******************************
         Benchmarks
*******************************/

describe('isEqual — same reference (signal unchanged)', () => {
  bench('object ref', () => {
    isEqual(settingsA, settingsA);
  });
  bench('array ref', () => {
    isEqual(stateA.items, stateA.items);
  });
  bench('primitive number', () => {
    isEqual(num, num);
  });
  bench('primitive string', () => {
    isEqual(str, str);
  });
});

describe('isEqual — shallow equal objects', () => {
  bench('10-key equal', () => {
    isEqual(settingsA, settingsB);
  });
  bench('10-key not equal', () => {
    isEqual(settingsA, settingsDiff);
  });
});

describe('isEqual — nested structures', () => {
  bench('nested equal', () => {
    isEqual(stateA, stateB);
  });
  bench('nested diff in array', () => {
    isEqual(stateA, stateDiff);
  });
});

describe('isEqual — with options', () => {
  bench('ignoreKeys (top-level)', () => {
    isEqual(settingsA, settingsDiff, { ignoreKeys: ['variant'] });
  });
  bench('partial match', () => {
    isEqual({ type: 'button' }, settingsA, { partial: true });
  });
});
