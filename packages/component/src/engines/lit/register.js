import { registerEngine } from '@semantic-ui/renderer';
import { LitRenderer } from '@semantic-ui/renderer/lit';
import { createLitComponent } from './factory.js';

const LitEngine = { renderer: LitRenderer, factory: createLitComponent };
registerEngine('lit', LitEngine);

export { LitEngine as LitRenderer };
