import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';


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
  template,
  css,
  createInstance,
  onCreated,
  onDestroyed,
  events,
});

export { TodoItem };
