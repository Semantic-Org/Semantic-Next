import { flush, reaction, signal } from '@semantic-ui/reactivity';

const config = signal({ theme: 'dark', locale: 'en' });

// depend() registers a dependency without reading the value
reaction(() => {
  config.depend();
  console.log('Config changed, re-rendering...');
});

config.set({ theme: 'light', locale: 'en' });
flush();

config.set({ theme: 'light', locale: 'fr' });
