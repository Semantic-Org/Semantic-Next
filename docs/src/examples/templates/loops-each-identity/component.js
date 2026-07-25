import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  fruits: [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Orange' },
  ],
};

const createComponent = ({ state }) => ({

  withoutIds() {
    return state.fruits.get().map(({ name }) => ({ name }));
  },

  rotate() {
    const [first, ...rest] = state.fruits.get();
    state.fruits.set([...rest, first]);
  },

});

defineComponent({
  tagName: 'each-identity',
  template,
  css,
  defaultState,
  createComponent,
});
