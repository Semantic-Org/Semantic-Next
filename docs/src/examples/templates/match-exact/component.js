import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

// undefined = not fetched yet, null = fetched but empty, object = present
const states = [undefined, null, { name: 'Ada Lovelace' }];

const defaultState = {
  step: 0,
};

const createComponent = ({ state }) => ({
  user() {
    return states[state.step.get()];
  },
  cycle() {
    state.step.set((state.step.get() + 1) % states.length);
  },
});

export default defineComponent({
  tagName: 'match-exact',
  template,
  css,
  defaultState,
  createComponent,
});
