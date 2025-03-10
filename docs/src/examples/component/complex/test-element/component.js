/* playground-fold */
import { defineComponent } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');
/* playground-fold-end */

const createComponent = () => ({
});

const onCreated = () => {
  console.log('on created');
};

defineComponent({
  tagName: 'test-component',
  template,
  css,
  createComponent,
  onCreated,
});
