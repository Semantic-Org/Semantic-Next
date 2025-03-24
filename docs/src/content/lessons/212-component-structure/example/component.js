import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

defineComponent({
  tagName: 'ui-profile',
  template,
  css,
  defaultState: {
    user: {
      name: 'Jane Doe',
      role: 'Developer',
      avatar: 'https://semantic-ui.com/images/avatar/small/elliot.jpg'
    }
  }
});