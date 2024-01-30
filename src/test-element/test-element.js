import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

import template from './test-element.html';
import css from './test-element.css';

import { basicTab } from './tabs/basic.js';
import { eventsTab } from './tabs/events.js';

const createInstance = (tpl, $) => ({

  tab: new ReactiveVar('basic'),

});

const onCreated = (tpl) => {
  // nothing
};

const onDestroyed = (tpl) => {
  // nothing
};

const events = {
  'input input'(event, tpl, $) {
    tpl.number.value = $(this).value();
  },
  'click .tab'(event, tpl, $, data) {
    tpl.tab.set(data.tab);
  },
};

const TestElement = createComponent({
  tagName: 'test-element',
  template,
  css,
  createInstance,
  onCreated,
  onDestroyed,
  events,
  subTemplates: {
    events: eventsTab,
    basic: basicTab,
  }
});

export { TestElement };
