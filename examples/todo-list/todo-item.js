import { createComponent } from '@semantic-ui/component';


import template from './todo-item.html';
import css from './todo-item.css';


const createInstance = (tpl, $) => ({
  //nothing yet

});

const onCreated = (tpl) => {
  // nothing
};

const onRendered = (tpl, $) => {/*
  // nothing
  if(tpl.data.item.checked) {
    $('.completed').attr('checked');
  }
  else {
    $('.completed').removeAttr('checked');
  }*/
};

const onDestroyed = (tpl) => {
  // nothing
};

const events = {
  'change input.completed'(event, tpl) {
    let todos = tpl.parent().todos.get();
    todos[tpl.data.index].completed = !!todos[tpl.data.index].completed;
    tpl.parent().todos.set(todos);
  }
};

const todoItem = createComponent({
  templateName: 'todoItem',
  template,
  css,
  createInstance,
  onCreated,
  onRendered,
  onDestroyed,
  events,
});

export { todoItem };
