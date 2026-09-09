import { registerEngine, Renderer } from '@semantic-ui/renderer';
import { createComponent } from './factory.js';

// the server renderer joins on the server entry, so the root stays browser-sized
const NativeEngine = { renderer: Renderer, factory: createComponent };
registerEngine('native', NativeEngine);

export { NativeEngine };
