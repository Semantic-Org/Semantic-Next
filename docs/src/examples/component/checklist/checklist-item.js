import { defineComponent, getText } from '@semantic-ui/component';

import css from './checklist-item.css?raw';
import template from './checklist-item.html?raw';

const createComponent = ({ self, data, findParent }) => ({
  toggleCompleted() {
    const tasks = findParent('uiChecklist').tasks;
    tasks.setProperty(data.task._id, 'completed', !data.task.completed);
  },
});

const events = {
  'change input[type="checkbox"]'({ self }) {
    self.toggleCompleted();
  },
};

export const checklistItem = defineComponent({
  templateName: 'checklistItem',
  template,
  css,
  createComponent,
  events,
});
