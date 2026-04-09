import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./filter-list.html');
const css = await getText('./filter-list.css');

const defaultSettings = {
  filter: () => true,
};

const createComponent = ({ self, settings }) => ({
  fruits: ['Apple', 'Blueberry', 'Cherry', 'Dragonfruit', 'Fig', 'Kiwi'],
  getFiltered() {
    return self.fruits.filter(settings.filter);
  }
});

export const filterList = defineComponent({
  tagName: 'filter-list',
  template,
  css,
  defaultSettings,
  createComponent,
});
