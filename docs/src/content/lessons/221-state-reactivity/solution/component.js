import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultState = {
  count: 0,
  isActive: false,
  step: 1
};

const createComponent = ({ state }) => ({
  increment() {
    const step = state.step.get();
    state.count.set(state.count.get() + step);
  },
  
  decrement() {
    const step = state.step.get();
    state.count.set(state.count.get() - step);
  },
  
  reset() {
    state.count.set(0);
  },
  
  toggleActive() {
    state.isActive.toggle();
  },
  
  increaseStep() {
    state.step.increment();
  },
  
  decreaseStep() {
    if (state.step.get() > 1) {
      state.step.decrement();
    }
  },
  
  isEven(number) {
    return number % 2 === 0;
  },
  
  isMilestone(number) {
    return number !== 0 && number % 10 === 0;
  }
});

const events = {
  'click .increment'({ self }) {
    self.increment();
  },
  
  'click .decrement'({ self }) {
    self.decrement();
  },
  
  'click .reset'({ self }) {
    self.reset();
  },
  
  'click .toggle'({ self }) {
    self.toggleActive();
  },
  
  'click .increase'({ self }) {
    self.increaseStep();
  },
  
  'click .decrease'({ self }) {
    self.decreaseStep();
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