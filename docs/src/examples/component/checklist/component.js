import { defineComponent, getText } from '@semantic-ui/component';
import { checklistItem } from './checklist-item.js';

import css from './component.css?raw';
import template from './component.html?raw';

let nextID = 5;

const createComponent = ({ self, signal }) => ({
  tasks: signal([
    { _id: '1', label: 'Read the docs', completed: true },
    { _id: '2', label: 'Build a component', completed: false },
    { _id: '3', label: 'Write tests', completed: false },
    { _id: '4', label: 'Ship it', completed: false },
  ]),
  getTasks() {
    return self.tasks.get();
  },
  getCompletedCount() {
    return self.tasks.get().filter(t => t.completed).length;
  },
  getTotalCount() {
    return self.tasks.get().length;
  },
  addTask() {
    const id = String(nextID++);
    self.tasks.push({ _id: id, label: `Task ${id}`, completed: false });
  },
  removeTask() {
    const tasks = self.tasks.get();
    if (tasks.length > 0) {
      self.tasks.removeIndex(0);
    }
  },
});

const events = {
  'click .add'({ self }) {
    self.addTask();
  },
  'click .remove'({ self }) {
    self.removeTask();
  },
};

const Checklist = defineComponent({
  tagName: 'ui-checklist',
  template,
  css,
  createComponent,
  events,
  subTemplates: {
    checklistItem,
  },
});

export default Checklist;
export { Checklist };
