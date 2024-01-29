import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { range } from '@semantic-ui/utils';

import template from './test.html';
import css from './test.css';

const TestElement = {};

TestElement.createInstance = function(tpl, $) {
  return {

    tab: new ReactiveVar('basic'),
    number: new ReactiveVar(6),
    date: new ReactiveVar(new Date()),

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


TestElement.onCreated = function(tpl) {

  tpl.interval = setInterval(() => {
    tpl.date.value = new Date();
  }, 1000);
};

TestElement.onDestroyed = function(tpl) {
  clearInterval(tpl.interval);
};

TestElement.events = {
  'input input'(event, tpl, $) {
    tpl.number.value = $(this).value();
  },
  'click .tab'(event, tpl, $, data) {
    tpl.tab.set(data.tab);
  },
};

createComponent('test-element', {
  template,
  css,
  ...TestElement,
});

export { TestElement };
