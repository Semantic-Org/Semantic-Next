import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

defineComponent({
  tagName: 'employee-card',
  template,
  css,
  settings: {
    name: '',
    location: '',
    role: '',
    joined: 2024,
    image: '',
    gender: 'female'
  }
});
