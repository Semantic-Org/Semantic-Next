import { createComponent } from '@semantic-ui/component';

import template from './component.html?raw';
import css from './component.css?raw';

const settings = {
  reactiveCounter1: 0,
  staticCounter2: 0,
};

const state = {
  reactiveCounter2: 0
};

const createInstance = ({reactiveVar, tpl}) => ({
  reactiveCounter3: reactiveVar(0),
  staticCounter3: 0,
  staticCounter4: () => tpl.staticCounter3,
});


const onCreated = function({settings, state, tpl}) {
  setInterval(() => {
    settings.reactiveCounter1++;
    state.reactiveCounter2.increment();
    tpl.reactiveCounter3.increment();
    tpl.staticCounter3++;
  }, 1000);
};

const onRendered = function({tpl, $}) {
  tpl.staticCounter1 = $('.counter').first().text();
};


export const UICounter = createComponent({
  tagName: 'ui-counter',
  template,
  css,
  createInstance,
  onCreated,
  onRendered,
  state,
  settings,
});
