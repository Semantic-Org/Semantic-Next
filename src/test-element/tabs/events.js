import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { range } from '@semantic-ui/utils';

import template from './events.html';

const createInstance = (tpl, $) => {
  console.log('rendering events tab');
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



const events = {
  'input input'(event, tpl, $) {
    tpl.number.value = $(this).value();
  },
  'click button'(event, tpl, $) {
    tpl.number.value = 5;
    $('input').value(5);
  }
};

const eventsTab = createComponent({
  template,
  createInstance,
  events,
});

export { eventsTab };
