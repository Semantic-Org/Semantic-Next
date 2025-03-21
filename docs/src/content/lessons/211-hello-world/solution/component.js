import { defineComponent } from '@semantic-ui/component';

defineComponent({
  tagName: 'hello-world',
  template: `<div class="container">
    Hello, {name}!
    <div class="date">Today is <b>{formatDate time "MMMM DD, YYYY"}</b></div>
    <div class="time">Current time: <b>{formatDate time "h:mm:ss a"}</b></div>
  </div>`,
  css: `
    .container {
      padding: var(--padding);
      border-radius: var(--border-radius);
      background-color: var(--primary-color);
      color: white;
      text-align: center;
      
      .date, .time {
        var(--compact-spacing)
        font-size: var(--small);
      }
    }
  `,
  defaultState: { 
    time: new Date(),
    name: 'Developer'
  },
  onCreated({ state }) {
    setInterval(() => state.time.now(), 1000);
  },
});
