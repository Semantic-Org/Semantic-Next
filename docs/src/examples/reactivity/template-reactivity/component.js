import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  counter1: 0,
  counter7: 0,
};

const state = {
  counter2: 0
};

const createComponent = ({ signal, self }) => ({
  counter3: signal(0),
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


defineComponent({
  tagName: 'ui-counter',
  template,
  css,
  createComponent,
  onCreated,
  onRendered,
  state,
  settings,
});
