import { registerEngine, Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { createComponent } from './factory.js';

const NativeEngine = { renderer: Renderer, serverRenderer: ServerRenderer, factory: createComponent };
registerEngine('native', NativeEngine);

export { NativeEngine as NativeRenderer };
