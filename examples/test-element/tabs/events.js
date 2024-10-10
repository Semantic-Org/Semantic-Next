import { defineComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { range } from '@semantic-ui/utils';

import template from './events.html?raw';

const createComponent = ({ self, $ }) => {
  return {
    number: new ReactiveVar(6),
    getRange() {
      if (!Number.isFinite(+self.number.value)) {
        return [];
      }
      return range(self.number.value);
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
        ...self.newPerson,
      };
      if (self.addedCount > 0) {
        person._id = `${person._id}${self.addedCount}`;
        person.name = `${person.name} #${self.addedCount}`;
      }
      self.addedCount++;
      return person;
    },
  };
};

const events = {
  'input input[type="text"]'({ event, self, $ }) {
    self.number.value = $(this).value();
  },
  'click .set'({ event, self, $ }) {
    self.number.value = 5;
    $('input').value(5);
  },
  'click .add.end'({ event, self }) {
    self.persons.push(self.getPerson());
  },
  'click .add.front'({ event, self }) {
    self.persons.unshift(self.getPerson());
  },
  'click .replace.second'({ event, self }) {
    self.persons.setIndex(1, self.getPerson());
  },
  'click .remove.front'({ event, self }) {
    self.persons.removeIndex(0);
  },
  'click .remove.end'({ event, self }) {
    self.persons.splice(-1);
  },
};

const eventsTab = defineComponent({
  templateName: 'events',
  template,
  createComponent,
  events,
});

export { eventsTab };
