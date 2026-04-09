import { Reaction, Signal } from '@semantic-ui/reactivity';

const config = new Signal({ theme: 'dark', locale: 'en' });

// depend() registers the signal as a dependency without reading its value
Reaction.create(() => {
  config.depend();
  console.log('Config changed, re-rendering...');
});

// Triggers the reaction even though we never called config.get()
config.set({ theme: 'light', locale: 'en' });
Reaction.flush();

config.set({ theme: 'light', locale: 'fr' });
