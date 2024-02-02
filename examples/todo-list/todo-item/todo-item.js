import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

import { TodoItem } from 'todo-item/todo-item.js';

import template from './todo-list.html';
import css from './todo-list.css';


const createInstance = (tpl, $) => ({
  //nothing yet

});

const onCreated = (tpl) => {
  // nothing
};

const onDestroyed = (tpl) => {
  // nothing
};

const events = {
};

const TodoItem = createComponent({
  tagName: 'todo-list',
  subTemplates: {
    todoItem
  },
  template,
  css,
  createInstance,
  onCreated,
  onDestroyed,
  events,
});

export { TodoItem };
