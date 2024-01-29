import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { range } from '@semantic-ui/utils';

import { TestSpec, TestTemplate, TestCSS } from './';

const TestElement = {};

TestElement.createInstance = function(tpl, $) {
  return {

    tab: new ReactiveVar('basic'),

    number: new ReactiveVar(6),
    date: new ReactiveVar(new Date()),

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

createComponent('ui-test-element', {
  spec: TestSpec,
  template: TestTemplate,
  css: TestCSS,
  ...TestElement,
});

export { TestElement };
