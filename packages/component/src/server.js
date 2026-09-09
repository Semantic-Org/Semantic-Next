import { ServerRenderer } from '@semantic-ui/renderer';

import { NativeEngine } from './engines/native/register.js';

/*
  The server entry: the browser surface plus what only a server needs. Loading it
  gives the native engine its server renderer, so a bundle built from the root
  never carries one.
*/
NativeEngine.serverRenderer = ServerRenderer;

export { expandCustomElements } from './expand-custom-elements.js';
export * from './index.js';
export { renderToStaticMarkup } from './render-to-static-markup.js';
export { renderToString } from './render-to-string.js';
