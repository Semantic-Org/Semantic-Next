import { defineComponent } from '@semantic-ui/component';

import css from './component.css?raw';
import template from './component.html?raw';

const settings = {
  counter1: 0,
  counter7: 0,
};

const state = {
  counter2: 0
};

const createComponent = ({ reactiveVar, self }) => ({
  counter3: reactiveVar(0),
  counter4: 0,
  counter5: () => self.counter4,
});


const onCreated = function({ settings, state, self }) {
  setInterval(() => {
    settings.counter1++;
    state.counter2.increment();
    self.counter3.increment();
    self.counter4++;
  }, 1000);
};

const onRendered = function({ self, $ }) {
  self.counter6 = Number($('.counter').first().text());
};


export const UICounter = defineComponent({
  tagName: 'ui-counter',
  template,
  css,
  createComponent,
  onCreated,
  onRendered,
  state,
  settings,
});
