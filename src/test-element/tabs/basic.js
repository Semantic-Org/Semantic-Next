import { createComponent } from '@semantic-ui/component';
import template from './basic.html';

const createInstance = (tpl, $) => ({
  date: new ReactiveVar(new Date()),
  echo(value) {
    return value;
  }
});

const basicTab = createComponent({
  template,
  createInstance,
});

export { basicTab };
