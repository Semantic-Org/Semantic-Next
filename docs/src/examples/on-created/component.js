import { createComponent, getText } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createInstance = ({tpl}) => ({
  text: new ReactiveVar('Not Clicked'),
});

const onCreated = ({tpl, attachEvent}) => {
  // event will teardown when component is destroyed
  attachEvent('body', 'click', () => {
    tpl.text.set('Clicked')
  });
};

createComponent({
  tagName: 'ui-clicker',
  template,
  css,
  createInstance,
  onCreated,
});
