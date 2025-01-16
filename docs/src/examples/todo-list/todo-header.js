import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./todo-header.css');
const template = await getText('./todo-header.html');

const createComponent = ({ self, $, signal, reaction, findParent }) => ({
  allCompleted: signal(false),

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
  'keydown input.new-todo'({ event, self, afterFlush, $, $$ }) {
    if (event.key === 'Enter') {
      const text = $(this).val();
      if (!text) {
        return;
      }
      self.addTodo(text);
      $(this).val('');
      afterFlush(() => {
        self.getTodoList().scrollToBottom();
      });
    }
  },
};

const onCreated = ({ self }) => {
  self.calculateAllCompleted();
};

const todoHeader = defineComponent({
  templateName: 'todoHeader',
  template,
  css,
  createComponent,
  onCreated,
  events,
});

export { todoHeader };
