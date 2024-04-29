import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

const getText = async (src) => {
  const response = await fetch(src);
  return await response.text();
};

const css = await getText('./component.css');
const template = await getText('./component.html');

const createInstance = ({tpl}) => ({
});

const onCreated = ({tpl}) => {
  console.log('on created');
};

createComponent({
  tagName: 'test-component',
  template,
  css,
  createInstance,
  onCreated,
});
