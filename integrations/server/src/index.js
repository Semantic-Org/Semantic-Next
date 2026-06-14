/*
  Framework-agnostic server rendering for Semantic UI.

  Render components to Declarative Shadow DOM strings on any server (Express,
  Hono, plain node:http) or in any build step. renderToString is pure string
  work with no DOM shim, so it runs unmodified in Node, Bun, Deno, and at the
  edge. The component self-hydrates from the DSD once its JS loads.
*/

import { expandCustomElements, getComponent, renderToString } from '@semantic-ui/component';

/*
  Render one component to a DSD string. Accepts a component class or the tag
  name of an already-registered component. Pass hydrate:false for static
  markup that should never be claimed by the client runtime.
*/
export function render(component, props = {}, { slots = null, hydrate = true } = {}) {
  const ComponentClass = typeof component === 'string' ? getComponent(component) : component;
  if (!ComponentClass) {
    throw new Error(
      `@semantic-ui/server: "${component}" is not a registered component. Import its module before rendering it.`,
    );
  }
  return renderToString(ComponentClass, props, { slots, hydrate });
}

/*
  Expand every registered Semantic UI tag inside an HTML string into DSD,
  leaving all other markup untouched. The path for templating engines and
  pages that emit <ui-*> tags directly.
*/
export function renderHTML(html, { hydrate = true } = {}) {
  return expandCustomElements(html, { renderFn: renderToString, hydrate });
}

export { getComponent, hasComponent, registerComponent } from '@semantic-ui/component';
