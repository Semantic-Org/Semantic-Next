import { createComponent } from '@semantic-ui/component';

createComponent({
  tagName: 'ui-counter',
  template: '<div>Counter is <b>{{counter}}</b></div>',
  css: 'div { border: var(--border); color: var(--standard-80); padding: var(--spacing); }',
  state: { counter: 0 },
  onCreated({state}) {
    setInterval(() => state.counter.increment(), 1000);
  }
});
