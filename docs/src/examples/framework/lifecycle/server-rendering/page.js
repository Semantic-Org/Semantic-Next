import { $ } from '@semantic-ui/query';

import { hydratedHTML, inertHTML } from './server.js';

// a server would ship this markup in the document, the playground injects it
// setHTMLUnsafe parses <template shadowrootmode>, innerHTML discards it
$('.hydrated.mount').el().setHTMLUnsafe(hydratedHTML);
$('.inert.mount').el().setHTMLUnsafe(inertHTML);

$('.hydrated.source').text(hydratedHTML);
$('.inert.source').text(inertHTML);
