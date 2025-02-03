import { defineComponent, getText } from '@semantic-ui/component';
import { generateID } from '@semantic-ui/utils';

const css = await getText('./todo-header.css');
const template = await getText('./todo-header.html');

const createComponent = ({ self, $, findParent }) => ({

  getTodoList() {
    return findParent('todoList');
  },

  getTodos() {
    return self.getTodoList().todos;
  },

  addTodo(text) {
    self.getTodos().push({
      _id: generateID(),
      text: text,
      completed: false,
    });
  },

  clearInput() {
    $('input.todo').val('');
  },

});

const events = {
  'keydown input.new-todo'({ self, event, value, afterFlush }) {
    if (event.key === 'Enter') {
      if (!value) {
        return;
      }
      self.addTodo(value);
      self.clearInput();

      // scroll to bottom after reactive update to the list
      const todoList = self.getTodoList();
      afterFlush(todoList.scrollToBottom);
    }
  },
};

const todoHeader = defineComponent({
  templateName: 'todoHeader',
  template,
  css,
  createComponent,
  events,
});

export { todoHeader };
