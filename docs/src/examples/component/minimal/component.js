import { createComponent } from '@semantic-ui/component';

createComponent({
  tagName: 'current-time',
  template: `Time is <b>{{formatDate time "h:mm ss a"}}</b>`,
  css: 'b { color: var(--primary-text-color); }',
  state: { time: new Date() },
  onCreated({state}) {
    setInterval(() => state.time.now(), 1000);
  }
});
