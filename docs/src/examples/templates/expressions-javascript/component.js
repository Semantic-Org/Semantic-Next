import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  items: [
    { id: 1, name: 'Widget', active: true },
    { id: 2, name: 'Gadget', active: false },
    { id: 3, name: 'Doohickey', active: true },
  ],
  stats: {
    total: 42,
    active: 28,
    pending: 14,
    successCount: 28,
  },
  status: 'success',
  scores: [85, 92, 78, 95, 88],
  user: {},
};

export default defineComponent({
  tagName: 'expression-examples',
  template,
  css,
  defaultState,

  createComponent() {
    return {
      formatScore(score) {
        return score >= 90 ? `${score} (excellent)` : `${score}`;
      },
    };
  },
});
