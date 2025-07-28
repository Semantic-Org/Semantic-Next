import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  // Data for comparison helpers
  userAge: 25,
  requiredAge: 18,
  score: 85,
  passingScore: 70,
  status: 'active',
  level: 3,
};

defineComponent({
  tagName: 'helpers-comparison',
  template,
  css,
  defaultState,
});
