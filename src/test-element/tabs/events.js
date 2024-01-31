import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { range } from '@semantic-ui/utils';

import template from './events.html';

const createInstance = (tpl, $) => {
  console.log('rendering events tab');
  return {

    number: new ReactiveVar(6),
    getRange() {
      if(!Number.isFinite(+tpl.number.value)) {
        return [];
      }
      return range(tpl.number.value);
    },

    persons: new ReactiveVar([
      { _id: 'a', name: 'Firstman', age: 23 },
      { _id: 'b', name: 'Seconder', age: 36 },
      { _id: 'c', name: 'Thirdman', age: 36 },
      { _id: 'd', name: 'Fourthy', age: 36 },
      { _id: 'e', name: 'Fiftherstein', age: 36 },
    ]),

    newPerson: { _id: 'f', name: 'Sixthly', age: 34 },
    addedCount: 0,
    getPerson() {
      let person = {
        ... tpl.newPerson
      };
      if(tpl.addedCount > 0) {
        person._id = `${person._id}${tpl.addedCount}`;
        person.name = `${person.name} #${tpl.addedCount}`;
      }
      tpl.addedCount++;
      return person;
    },

  };
};



const events = {
  'input input[type="text"]'(event, tpl, $) {
    tpl.number.value = $(this).value();
  },
  'click .set'(event, tpl, $) {
    tpl.number.value = 5;
    $('input').value(5);
  },
  'click .add.end'(event, tpl) {
    tpl.persons.push(tpl.getPerson());
  },
  'click .add.front'(event, tpl) {
    tpl.persons.unshift(tpl.getPerson());
  },
  'click .replace.second'(event, tpl) {
    tpl.persons.setItem(1, tpl.getPerson());
  },
  'click .remove.front'(event, tpl) {
    tpl.persons.removeItem(0);
  },
  'click .remove.end'(event, tpl) {
    tpl.persons.splice(-1);
  },
};

const eventsTab = createComponent({
  template,
  createInstance,
  events,
});

export { eventsTab };
