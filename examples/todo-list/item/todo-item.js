import { createComponent } from '@semantic-ui/component';
import { Reaction } from '@semantic-ui/reactivity';

import template from './todo-item.html?raw';
import css from './todo-item.css?raw';

const createInstance = ({ tpl, data, reactiveVar, findParent, $ }) => ({
  editing: reactiveVar(false),
  getClasses() {
    return {
      completed: data.todo.completed,
      editing: tpl.editing.get()
    };
  },
  getTodos() {
    return findParent('todoList').todos;
  },
  toggleCompleted() {
    const todos = tpl.getTodos();
    const todo = data.todo;
    todos.setProperty(todo._id, 'completed', !todo.completed);
  },
  changeText(text) {
    const todos = tpl.getTodos();
    todos.setProperty(data.todo._id, 'text', text);
  },
  removeTodo() {
    tpl.getTodos().removeItem(data.todo._id);
  },
});

const onCreated = ({data}) => {
  console.log('created', data.todo._id);
};
const onRendered = ({data}) => {
  console.log('rendered', data.todo._id);
};


const events = {
  'change .toggle'({ event, tpl, $ }) {
    tpl.toggleCompleted();
  },
  'click .destroy'({ event, tpl }) {
    tpl.removeTodo();
  },
  'dblclick li'({ event, tpl, $ }) {
    tpl.editing.set(true);
    Reaction.afterFlush(() => {
      $('input.edit').focus();
    });
  },
  'keydown input.edit'({ event, tpl, $ }) {
    if (event.key === 'Enter') {
      $(this).blur();
    }
  },
  'blur input.edit'({ event, tpl, $ }) {
    tpl.changeText($(this).val());
    tpl.editing.set(false);
  },
};

const todoItem = createComponent({
  templateName: 'todoItem',
  template,
  css,
  createInstance,
  onCreated,
  onRendered,
  events,
});

export { todoItem };
