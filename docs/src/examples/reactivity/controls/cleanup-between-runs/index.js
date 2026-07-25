import { reaction, signal } from '@semantic-ui/reactivity';

const channel = signal('weather');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// a fake feed that ticks until it is closed
const subscribe = (name) => {
  const timer = setInterval(() => console.log(`${name} tick`), 300);
  return () => {
    clearInterval(timer);
    console.log(`${name} closed`);
  };
};

const watcher = reaction((comp) => {
  const close = subscribe(channel.get());
  comp.onCleanup(close); // fires before the next run, and once more on stop
});

await wait(700);
channel.set('traffic'); // closes the weather feed before resubscribing

await wait(700);
watcher.stop();
