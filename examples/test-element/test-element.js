import { createComponent } from '@semantic-ui/component';

import template from './test-element.html?raw';
import css from './test-element.css?raw';

import { basicTab } from './tabs/basic.js';
import { eventsTab } from './tabs/events.js';

const createInstance = function ({ tpl, reactiveVar, $ }) {
  return {
    tab: reactiveVar('events'),
    morningActivity: reactiveVar('running'),
    eveningActivity: reactiveVar('reading'),
    maybeActive(tab) {
      return tpl.tab.get() == tab ? 'active' : '';
    },
    maybeDisabled() {
      return tpl.tab.get() == 'basic' ? 'disabled' : '';
    },
    getText() {
      return 'banana';
    },
  };
};

const onCreated = ({ tpl }) => {
  // nothing
};

const onDestroyed = ({ tpl }) => {
  // nothing
};

const events = {
  'click .tab'({ event, tpl, $, data }) {
    tpl.tab.set(data.tab);
  },
  'click .morning'({ event, tpl }) {
    tpl.morningActivity.set('Mowing the lawn');
  },
  'click .evening'({ event, tpl }) {
    tpl.eveningActivity.set('Reading');
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
  },
});

export { TestElement };
