// External Sync: Syncing signals with external systems
import { Reaction, Signal } from '@semantic-ui/reactivity';

// Simulate localStorage
const mockStorage = {
  data: '{"theme":"dark","lang":"en"}',
  getItem(key) {
    return this.data;
  },
  setItem(key, value) {
    this.data = value;
  },
};

// Signal for user preferences
const preferences = new Signal(
  JSON.parse(mockStorage.getItem('prefs') || '{}'),
);

// Sync preferences to localStorage
Reaction.create(() => {
  const prefs = preferences.get();
  const serialized = JSON.stringify(prefs);
  console.log('Saving to storage:', serialized);
  mockStorage.setItem('prefs', serialized);
});

// Update preferences - automatically syncs to storage
preferences.set({ theme: 'light', lang: 'es' });
Reaction.flush();

preferences.setProperty('theme', 'dark');
Reaction.flush();

console.log('Final storage:', mockStorage.getItem('prefs'));
