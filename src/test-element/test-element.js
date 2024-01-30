import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

import template from './test-element.html';
import css from './test-element.css';

import { basicTab } from './tabs/basic.js';
import { eventsTab } from './tabs/events.js';

const createInstance = function(tpl, $) {
  return {
    tab: new ReactiveVar('basic'),
    morningActivity: new ReactiveVar('running'),
    maybeActive(tab) {
      return tpl.tab.get() == tab
        ? 'active'
        : ''
      ;
    },
    maybeDisabled() {
      return tpl.tab.get() == 'basic' ? 'disabled' : '';
    },
    getText() {
      return $('.helper').text();
    }
  };
};

const onCreated = (tpl) => {
  // nothing
};

const onDestroyed = (tpl) => {
  // nothing
};

const events = {
  'click .tab'(event, tpl, $, data) {
    tpl.tab.set(data.tab);
  },
  'click .activity'(event, tpl) {
    tpl.morningActivity.set('Mowing the lawn');
  }
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
