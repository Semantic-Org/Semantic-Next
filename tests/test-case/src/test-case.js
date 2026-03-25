import { defineComponent } from '@semantic-ui/component';

import template from './test-case.html?raw';
import css from './test-case.css?raw';

const createComponent = ({ self, el, settings, $ }) => ({

  // example prop
  prop: 1,

  example() {
    // example method
  }

});

const onCreated = ({ self, el, settings, $ }) => {
  // test created
  console.log('test case created');
};

const onDestroyed = ({ self, el, settings, $ }) => {
  // test destroyed
};

const events = {
  // events
};


const keys = {
  // keys
};

const TestCase = defineComponent({
  tagName: 'test-case',
  template,
  css,
  createComponent,
  onCreated,
  onDestroyed,
  events,
  keys
});

export { TestCase };
