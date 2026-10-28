import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  heading: 'Confirm Action',
};

const createComponent = ({ el }) => ({
  open() {
    el.showModal();
  },
  close() {
    el.close();
  },
});

const events = {
  'click .close'({ self }) {
    self.close();
  },
};

export const Dialog = defineComponent({
  template,
  css,
  defaultSettings,
  createComponent,
  events,
});
