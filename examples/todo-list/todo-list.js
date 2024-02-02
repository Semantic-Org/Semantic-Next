import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { each } from '@semantic-ui/utils';

import { todoItem } from './todo-item.js';

import template from './todo-list.html';
import css from './todo-list.css';


const createInstance = (tpl, $) => ({

  todos: new ReactiveVar([
    { text: 'Start a band', completed: false },
    { text: 'Tour country', completed: false }
  ]),

  allSelected: new ReactiveVar(false),

  selectAll() {
    todos.set(each(tpl.todos.value, todo => todo.selected));
  },

  selectNone() {
    todos.set(each(tpl.todos.value, todo => !todo.selected));
  },

  getIncomplete() {
    return tpl.todos.value.filter(todo => !todo.completed);
  },

  addTodo(text = $('input.add').val()) {
    tpl.todos.push({
      text: text,
      completed: false,
    });
  },

  calculateSelection() {
    tpl.reaction((comp) => {
      if(comp.firstRun) {
        return;
      }
      if(tpl.allSelected.get()) {
        tpl.selectAll();
      }
      else {
        tpl.selectNone();
      }
    });
  }

});

const onCreated = (tpl) => {
  tpl.calculateSelection();

};

const events = {
  'keydown input.add'(event, tpl, $) {
    if(event.key === 'Enter') {
      tpl.addTodo();
    }
  },
  'click .select-all'(event, tpl) {
    tpl.allSelected.toggle();
  },
  'click .filters'(event, tpl, data) {
    console.log(data);
  }
};


const TodoList = createComponent({
  tagName: 'todo-list',
  subTemplates: {
    todoItem
  },
  template,
  css,
  createInstance,
  onCreated,
  events,
});

export { TodoList };
