import { renderToString } from '@semantic-ui/component';
import { Template } from '@semantic-ui/templating';

import { Card } from './component.js';

Template.isServer = true; // runs in browser, a real server has this set already

export const hydratedHTML = renderToString(Card, { label: 'hydrate: true' });
export const inertHTML = renderToString(Card, { label: 'hydrate: false' }, { hydrate: false });

Template.isServer = false; // hydration reads the same flag
