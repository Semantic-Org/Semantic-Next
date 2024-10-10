import { defineComponent } from '@semantic-ui/component';

import template from './test-case.html?raw';
import css from './test-case.css?raw';

const createComponent = function(tpl, $) {
  // test instance
  return {};
};

const onCreated = (tpl) => {
  // test created
  console.log('test case created');
};

const onDestroyed = (tpl) => {
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
