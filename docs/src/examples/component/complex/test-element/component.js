/* playground-fold */
import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

const css = await getText('./component.css');
const template = await getText('./component.html');
/* playground-fold-end */

const createInstance = () => ({
});

const onCreated = () => {
  console.log('on created');
};

createComponent({
  tagName: 'test-component',
  template,
  css,
  createInstance,
  onCreated,
});
