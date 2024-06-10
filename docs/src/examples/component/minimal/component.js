import { createComponent } from '@semantic-ui/component';

createComponent({
  tagName: 'ui-counter',
  template: '<div>{{counter}}</div>',
  css: 'div { background-color: red; padding: 1rem; }',
  state: { counter: 0 },
  onCreated({state}) {
    setInterval(() => state.counter.increment(), 1000);
  }
});
/* playground-fold-end */
