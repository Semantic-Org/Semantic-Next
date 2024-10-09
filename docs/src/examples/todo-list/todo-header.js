import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';
import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./todo-header.css');
const template = await getText('./todo-header.html');

const createInstance = ({ self, $, reaction, findParent }) => ({
  allCompleted: new ReactiveVar(false),

  getTodoList() {
    return findParent('todoList');
  },

  getTodos() {
    return self.getTodoList().todos;
  },

  completeAll() {
    self.getTodos().setArrayProperty('completed', true);
  },

  completeNone() {
    self.getTodos().setArrayProperty('completed', false);
  },

  addTodo(text) {
    self.getTodos().push({
      _id: text,
      text: text,
      completed: false,
    });
  },

  calculateAllCompleted() {
    reaction((comp) => {
      const allCompleted = self.allCompleted.get();
      if (comp.firstRun) {
        return;
      }
      if (allCompleted) {
        self.completeAll();
      }
      else {
        self.completeNone();
      }
    });
  },
});

const events = {
  'keydown input.new-todo'({ event, self, $, $$ }) {
    if (event.key === 'Enter') {
      const text = $(this).val();
      if (!text) {
        return;
      }
      self.addTodo(text);
      $(this).val('');
      Reaction.afterFlush(() => {
        self.getTodoList().scrollToBottom();
      });
    }
  },
};

const onCreated = ({ self }) => {
  self.calculateAllCompleted();
};

const todoHeader = createComponent({
  templateName: 'todoHeader',
  template,
  css,
  createInstance,
  onCreated,
  events,
});

export { todoHeader };
