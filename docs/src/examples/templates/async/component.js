import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createComponent = () => ({
  async fetchData() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Data loaded!', timestamp: new Date().toLocaleTimeString() };
  },

  async fetchError() {
    await new Promise(resolve => setTimeout(resolve, 500));
    throw new Error('Simulated error');
  },

  async fetchUser() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'Mathematician',
      team: 'Analytical Engine',
    };
  },
});

defineComponent({
  tagName: 'async-forms',
  template,
  css,
  createComponent,
});
