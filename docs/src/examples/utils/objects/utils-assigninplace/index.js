import { assignInPlace } from '@semantic-ui/utils';

// Basic usage — syncs target to match source
const config = { host: 'localhost', port: 3000, debug: true };
console.log('Before:', config);
assignInPlace(config, { host: 'production.app', port: 443 });
console.log('After:', config);

// Preserve existing keys — only adds and updates, never deletes
const defaults = { theme: 'light', lang: 'en', sidebar: true };
assignInPlace(defaults, { theme: 'dark', fontSize: 14 }, { preserveExistingKeys: true });
console.log('Preserved:', defaults);

// Detect changes — returns boolean instead of target
const state = { count: 5, label: 'items' };
const changed = assignInPlace(state, { count: 5, label: 'items' }, { returnChanged: true });
console.log('Changed:', changed);

const updated = assignInPlace(state, { count: 10, label: 'items' }, { returnChanged: true });
console.log('Updated:', updated);
