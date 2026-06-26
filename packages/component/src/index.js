import './engines/native/register.js';

export { registerHelper, registerHelpers } from '@semantic-ui/templating';
export { adoptStylesheet, extractCSS, getJSON, getText, scopeStyles } from '@semantic-ui/utils';

export { getComponent, hasComponent, registerComponent } from './component-registry.js';
export { defineComponent } from './define-component.js';
export { WebComponentBase } from './engines/native/base.js';
export { NativeEngine } from './engines/native/register.js';
export { expandCustomElements } from './expand-custom-elements.js';
export { setRecovery, setStackCapture, setTracing } from './helpers.js';
export { renderToString } from './render-to-string.js';
// smoke test: pulls @semantic-ui/smoke into the component bundle. Not for merge.
export { byKey, records, total } from '@semantic-ui/smoke';
