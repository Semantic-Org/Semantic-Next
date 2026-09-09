import { NativeEngine } from '@semantic-ui/component';
import { ServerRenderer } from '@semantic-ui/renderer';

/*
  The server entry: the browser surface plus what only a server needs. It reaches
  the root by its package name, so a bundle per entry and the CDN's urls alike hold
  one root and one registration. Loading it gives the native engine its server
  renderer, so a bundle built from the root never carries one.
*/
NativeEngine.serverRenderer = ServerRenderer;

export * from '@semantic-ui/component';
export { expandCustomElements } from './expand-custom-elements.js';
export { renderToStaticMarkup } from './render-to-static-markup.js';
export { renderToString } from './render-to-string.js';
