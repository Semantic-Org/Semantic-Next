import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';


import template from './todo-item.html';
import css from './todo-item.css';


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

const todoItem = createComponent({
  templateName: 'todoItem',
  template,
  css,
  createInstance,
  onCreated,
  onDestroyed,
  events,
});

export { todoItem };
