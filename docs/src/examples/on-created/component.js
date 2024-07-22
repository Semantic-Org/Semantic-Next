import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const state = {
  text: 'Not Clicked'
};


const onCreated = ({state, $, attachEvent}) => {
  // event will teardown when component is destroyed
  attachEvent('body', 'click', () => {
    state.text.set('Clicked');
    state.counter.increment();
  });
};

createComponent({
  tagName: 'ui-clicker',
  template,
  css,
  state,
  onCreated,
});
