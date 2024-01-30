import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import template from './basic.html';

const createInstance = (tpl, $) => ({
  date: new ReactiveVar(new Date()),
  echo(value) {
    return value;
  }
});


const onCreated = (tpl) => {
  console.log('on created called');
  tpl.interval = setInterval(() => {
    tpl.date.value = new Date();
  }, 1000);
};

const basicTab = createComponent({
  template,
  createInstance,
  onCreated,
});

export { basicTab };
