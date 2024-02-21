import { createComponent } from '@semantic-ui/component';

import template from './test-case.html';
import css from './test-case.css';

const createInstance = function(tpl, $) {
  // test instance
  return {};
};

const onCreated = (tpl) => {
  // test created
};

const onDestroyed = (tpl) => {
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
