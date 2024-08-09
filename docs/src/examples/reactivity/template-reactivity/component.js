import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  counter1: 0,
  counter7: 0,
};

const state = {
  counter2: 0
};

const createInstance = ({reactiveVar, tpl}) => ({
  counter3: reactiveVar(0),
  counter4: 0,
  counter5: () => tpl.counter4,
});


const onCreated = function({settings, state, tpl}) {
  setInterval(() => {
    settings.counter1++;
    state.counter2.increment();
    tpl.counter3.increment();
    tpl.counter4++;
  }, 1000);
};

const onRendered = function({tpl, $}) {
  tpl.counter6 = $('.counter').first().text();
};


createComponent({
  tagName: 'ui-counter',
  template,
  css,
  createInstance,
  onCreated,
  onRendered,
  state,
  settings,
});
