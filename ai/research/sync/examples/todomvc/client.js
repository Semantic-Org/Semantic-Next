import { syncClient } from '@semantic-ui/sync';

import './component.js';

syncClient({
  url: 'wss://localhost:4000',
  persist: true, // hydrate from IndexedDB at boot, write-behind after
});
