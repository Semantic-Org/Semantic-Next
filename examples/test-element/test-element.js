import { defineComponent } from '@semantic-ui/component';

import template from './test-element.html?raw';
import css from './test-element.css?raw';

import { basicTab } from './tabs/basic.js';
import { eventsTab } from './tabs/events.js';

const createInstance = function ({ self, reactiveVar, $ }) {
  return {
    tab: reactiveVar('events'),
    morningActivity: reactiveVar('running'),
    eveningActivity: reactiveVar('reading'),
    maybeActive(tab) {
      return self.tab.get() == tab ? 'active' : '';
    },
    maybeDisabled() {
      return self.tab.get() == 'basic' ? 'disabled' : '';
    },
    getText() {
      return 'banana';
    },
  };
};

const onCreated = ({ self }) => {
  // nothing
};

const onDestroyed = ({ self }) => {
  // nothing
};

const events = {
  'click .tab'({ event, self, $, data }) {
    self.tab.set(data.tab);
  },
  'click .morning'({ event, self }) {
    self.morningActivity.set('Mowing the lawn');
  },
  'click .evening'({ event, self }) {
    self.eveningActivity.set('Reading');
  },
};

const TestElement = defineComponent({
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
