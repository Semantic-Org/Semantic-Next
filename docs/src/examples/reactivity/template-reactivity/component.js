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

const createInstance = ({ reactiveVar, self }) => ({
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
  self.counter6 = $('.counter').first().text();
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
