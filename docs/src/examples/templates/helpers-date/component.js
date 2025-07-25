import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  createdAt: new Date('2024-03-15T14:30:00Z'),
  lastLogin: new Date('2024-07-24T09:15:30Z'),
  averageScore: 87.34567,
};

defineComponent({
  tagName: 'helpers-date',
  template,
  css,
  defaultState,
});
