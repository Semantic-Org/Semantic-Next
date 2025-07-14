import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');

const createComponent = ({ self }) => ({
  async fetchData() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Data loaded!', timestamp: new Date().toLocaleTimeString() };
  },

  async fetchError() {
    await new Promise(resolve => setTimeout(resolve, 500));
    throw new Error('Simulated error');
  },
});

defineComponent({
  tagName: 'load-basic',
  template,
  createComponent,
});
