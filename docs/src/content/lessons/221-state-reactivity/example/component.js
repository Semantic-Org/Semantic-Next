import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultState = {
  count: 0,
  isActive: false
};

const createComponent = ({ state }) => ({
  increment() {
    state.count.increment();
  },
  
  decrement() {
    state.count.decrement();
  },
  
  toggleActive() {
    state.isActive.toggle();
  },
  
  isEven(number) {
    return number % 2 === 0;
  }
});

const events = {
  'click .increment'({ self }) {
    self.increment();
  },
  
  'click .decrement'({ self }) {
    self.decrement();
  },
  
  'click .toggle'({ self }) {
    self.toggleActive();
  }
};

defineComponent({
  tagName: 'ui-counter',
  template,
  css,
  defaultState,
  createComponent,
  events
});
