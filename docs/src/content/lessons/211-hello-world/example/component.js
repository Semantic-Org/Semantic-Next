import { defineComponent } from '@semantic-ui/component';

defineComponent({
  tagName: 'hello-world',

  defaultState: {
    time: new Date()
  },
  
  template: `<div class="container">
    Hello World!
    <div class="date">Today is
      <b>{formatDate time "MMMM DD, YYYY}</b>
    </div>
  </div>`,
  
  css: `
    .container {
      padding: var(--padding);
      border-radius: var(--border-radius);
      background: var(--standard-5);
      border: var(--border);
      color: var(--standard-20);
      font-size: var(--small);
      font-weight: var(--bold);

      .time {
        color: var(--standard-80);
        font-size: var(--medium);
      }
      b {
        color: var(--primary-text-color);
      }
    }
  `,
  
  onCreated({ state }) {
    setInterval(() => state.time.now(), 1000);
  },
});
