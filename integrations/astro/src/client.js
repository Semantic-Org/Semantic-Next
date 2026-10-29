/*
  Astro client entrypoint for Semantic UI native SSR.

  Components rendered with a client directive (client:load, client:only)
  are rendered without the `ssr` attribute so they self-hydrate normally.
  Server-only components get `ssr` and stay inert.

  This entrypoint handles:
  1. client:only — full client render (no server HTML)
  2. client:load — forward complex props after self-hydration
*/

import { Template } from '@semantic-ui/templating';

function restorePropValue(value, existingValue) {
  if (
    value
    && typeof value === 'object'
    && !(value instanceof Template)
    && value.isPrototype
    && Array.isArray(value.ast)
  ) {
    if (
      existingValue instanceof Template
      && existingValue.template === value.template
      && existingValue.css === value.css
    ) {
      return existingValue;
    }
    return new Template({
      templateName: value.templateName,
      ast: value.ast,
      template: value.template,
      css: value.css,
      defaultState: value.defaultState,
      defaultSettings: value.defaultSettings,
      renderingEngine: value.renderingEngine,
      isPrototype: true,
    });
  }
  return value;
}

export default (element) => async (Component, props, { default: defaultChildren, ...slotted }, { client }) => {
  let component = element.children[0];

  if (client === 'only') {
    component = new Component();
    const slotHTML = Object.entries(slotted)
      .map(([name, html]) => {
        const templ = document.createElement('template');
        templ.innerHTML = html;
        for (const child of templ.content.children) {
          child.setAttribute('slot', name);
        }
        return templ.innerHTML;
      })
      .join('');
    component.innerHTML = `${defaultChildren ?? ''}${slotHTML}`;

    // Forward props BEFORE connecting to DOM — connectedCallback triggers
    // fullRender synchronously, so settings must be populated first
    for (const [name, value] of Object.entries(props)) {
      component[name] = restorePropValue(value, component.defaultSettings?.[name]);
    }

    element.appendChild(component);
  }

  if (!component) {
    return;
  }

  // Forward complex props that can't round-trip through HTML attributes.
  // String/boolean/number props are already correct from server-rendered
  // attributes and alias resolution — overwriting them would clobber
  // fuzzed values (e.g. "chevron down" overwriting "chevron-down").
  if (client !== 'only') {
    for (const [name, value] of Object.entries(props)) {
      if (value != null && (typeof value === 'object' || typeof value === 'function')) {
        component[name] = restorePropValue(value, component[name] ?? component.defaultSettings?.[name]);
      }
    }
  }

  // Cleanup during View Transitions page swaps
  element.addEventListener('astro:unmount', () => {
    if (component?.isConnected) {
      component.remove();
    }
  }, { once: true });
};
