import { syncClient } from '@semantic-ui/sync';

// the folder convention's loader — replaces Meteor's eager load. every
// collections/**/{mutators,actions} file registers itself on import
import.meta.glob('./collections/**/{mutators,actions}/*.js', { eager: true });

import './component.js';

syncClient({ url: 'wss://localhost:4000' });
