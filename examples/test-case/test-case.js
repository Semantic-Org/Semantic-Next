import { defineComponent } from '@semantic-ui/component';

import template from './test-case.html?raw';
import css from './test-case.css?raw';

const createComponent = function ({ self, $ }) {
  // test instance
  return {};
};

const onCreated = function ({ self }) {
  // test created
};

const onDestroyed = function ({ self }) {
  // test destroyed
};

const events = {
  // test events
};

const TestCase = defineComponent({
  tagName: 'test-case',
  template,
  css,
  createComponent,
  onCreated,
  onDestroyed,
  events,
});

export { TestCase };
