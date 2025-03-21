import { defineComponent } from '@semantic-ui/component';

defineComponent({
  tagName: 'hello-world',
  
  template: `<div class="container">
    Hello World!
    <div class="time">Current time: <b>{formatDate time "h:mm:ss a"}</b></div>
  </div>`,
  
  css: `
    .container {
      padding: var(--padding);
      border-radius: var(--border-radius);
      background-color: var(--primary-color);
      color: var(--white-80);
      text-align: center;

      .date, .time {
        var(--compact-spacing)
        font-size: var(--small);
      }
    }
  `,
  
  defaultState: { 
    time: new Date() 
  },
  
  onCreated({ state }) {
    setInterval(() => state.time.now(), 1000);
  },
});
