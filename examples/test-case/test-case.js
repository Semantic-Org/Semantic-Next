import { createComponent } from '@semantic-ui/component';

import template from './test-case.html?raw';
import css from './test-case.css?raw';

const createInstance = function ({ tpl, $ }) {
  // test instance
  return {};
};

const onCreated = function ({ tpl }) {
  // test created
};

const onDestroyed = function ({ tpl }) {
  // test destroyed
};

const events = {
  // test events
};

const TestCase = createComponent({
  tagName: 'test-case',
  template,
  css,
  createInstance,
  onCreated,
  onDestroyed,
  events,
});

export { TestCase };
