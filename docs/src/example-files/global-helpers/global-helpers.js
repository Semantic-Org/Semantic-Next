import { createComponent, getText } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

const template = await getText('./component.html');

const createInstance = ({tpl}) => ({
  currentTime: new ReactiveVar(new Date()),
  updateTime() {
    tpl.currentTime.set(new Date());
  }
});

const onCreated = ({tpl}) => {
  setInterval(tpl.updateTime, 1000);
};

createComponent({
  tagName: 'current-time',
  template,
  createInstance,
  onCreated,
});
