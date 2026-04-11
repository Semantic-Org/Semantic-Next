import { bench, describe } from 'vitest';
import { deepExtend, get, weightedObjectSearch } from '../src/objects.js';

/*******************************
       Test Data — Realistic
*******************************/

// Component defaults being merged with user settings
const defaults = {
  type: 'button',
  variant: 'default',
  size: 'medium',
  animation: { duration: 300, easing: 'ease-in-out' },
  callbacks: { onClick: null, onHover: null },
  classes: { active: 'active', disabled: 'disabled', loading: 'loading' },
};
const userSettings = {
  variant: 'primary',
  animation: { duration: 200 },
  classes: { active: 'is-active' },
};

// Nested config for get() lookups
const componentState = {
  ui: {
    dropdown: {
      settings: { placeholder: 'Select...', multiple: false, search: true },
      state: { open: false, selected: ['item-1'], filtered: [] },
    },
    modal: {
      settings: { closable: true, dimmer: 'blurring' },
    },
  },
  'dotted.key': { nested: 42 },
  items: [{ id: 1, meta: { tags: ['a', 'b'] } }, { id: 2, meta: { tags: ['c'] } }],
};

// Search data for weightedObjectSearch
const searchData = Array.from({ length: 200 }, (_, i) => ({
  name: `Component ${i}`,
  description: `A ${i % 2 ? 'primary' : 'secondary'} UI component for ${
    ['forms', 'layouts', 'navigation', 'display'][i % 4]
  }`,
  category: ['input', 'container', 'menu', 'visual'][i % 4],
}));

/*******************************
         Benchmarks
*******************************/

describe('deepExtend', () => {
  bench('shallow merge (no nesting)', () => {
    deepExtend({}, { a: 1, b: 2, c: 3 }, { d: 4, e: 5 });
  });
  bench('component defaults + user settings', () => {
    deepExtend({}, defaults, userSettings);
  });
});

describe('get — property access', () => {
  bench('simple key', () => {
    get(componentState, 'ui');
  });
  bench('3-level path', () => {
    get(componentState, 'ui.dropdown.settings');
  });
  bench('deep path', () => {
    get(componentState, 'ui.dropdown.state.selected');
  });
  bench('dotted key fallback', () => {
    get(componentState, 'dotted.key.nested');
  });
  bench('miss (undefined)', () => {
    get(componentState, 'ui.nonexistent.path');
  });
});

describe('weightedObjectSearch', () => {
  bench('single word, 200 items', () => {
    weightedObjectSearch('component', searchData, {
      propertiesToMatch: ['name', 'description', 'category'],
    });
  });
  bench('multi word, 200 items', () => {
    weightedObjectSearch('primary forms', searchData, {
      propertiesToMatch: ['name', 'description', 'category'],
    });
  });
});
