import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

const template = '';
const createInstance = ({tpl}) => ({
  initialize() {
    tpl.tick();
  },
  timer: new ReactiveVar(0),
  isEven: () => tpl.timer.get() % 2 == 0,
  tick: () => tpl.timer.increment()
});

const onCreated = ({tpl}) => {
  tpl.tick();
};

createComponent({
  tagName: 'ui-counter',
  template,
  createInstance,
  onCreated,
});
