import { define } from '../component.js';

// Register lit engine so both are available at runtime
import '../../../../component/src/engines/lit/register.js';

const engine = new URLSearchParams(location.search).get('engine') || 'native';
const tagName = define(engine);

export function mount() {
  const el = document.createElement(tagName);
  document.body.appendChild(el);
  return el;
}

// Wait for all pending microtasks (signal reactions, DOM patches)
// then one setTimeout to clear any deferred callbacks (rendered/updated events)
export function afterRender() {
  return new Promise(resolve => setTimeout(resolve, 0));
}
