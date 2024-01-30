import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

import template from './events.html';

const createInstance = (tpl, $) => {
  return {

    number: new ReactiveVar(6),

    items: new ReactiveVar([
      { _id: 'a', name: 'First', age: 23 },
      { _id: 'b', name: 'Second', age: 36 },
      { _id: 'c', name: 'Third', age: 36 },
      { _id: 'd', name: 'Fourth', age: 36 },
      { _id: 'e', name: 'Fifth', age: 36 },
    ]),

    getRange() {
      if(!Number.isFinite(+tpl.number.value)) {
        return [];
      }
      return range(tpl.number.value);
    },

    echo(value) {
      return value;
    },

    isNumber(value) {
      return Number.isFinite(+value);
    }
  };
};


const onCreated = (tpl) => {
  tpl.interval = setInterval(() => {
    tpl.date.value = new Date();
  }, 1000);
};

const onDestroyed = (tpl) => {
  clearInterval(tpl.interval);
};

const events = {
  'input input'(event, tpl, $) {
    tpl.number.value = $(this).value();
  },
  'click .tab'(event, tpl, $, data) {
    tpl.tab.set(data.tab);
  },
};

const eventsTab = createComponent('test-element', {
  template,
  createInstance,
  onCreated,
  onDestroyed,
  events,
});

export { eventsTab };
