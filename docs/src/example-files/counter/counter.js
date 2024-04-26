import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

const getText = async (src) => {
  const response = await fetch(src);
  return await response.text();
};

const css = await getText('./component.css');
const template = await getText('./component.html');


const createInstance = ({tpl}) => ({
  initialize() {
    tpl.tick();
  },
  timer: new ReactiveVar(0),
  isEven: () => tpl.timer.get() % 2 == 0,
  tick: () => tpl.timer.set(tpl.timer.value + 1)
});

const onCreated = ({tpl}) => {
  setInterval(tpl.tick, 1000);
};

createComponent({
  tagName: 'ui-counter',
  template,
  css,
  createInstance,
  onCreated,
});
