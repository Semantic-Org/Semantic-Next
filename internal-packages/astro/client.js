/*
  Astro client entrypoint for Semantic UI native SSR.

  Handles hydration of server-rendered components:
  1. Sets complex props (arrays, objects) as JS properties
  2. Removes defer-hydration attribute to trigger hydration
*/

export default (element) => async (Component, props, { default: defaultChildren, ...slotted }) => {
  let component = element.children[0];
  const isClientOnly = element.getAttribute('client') === 'only';

  if (isClientOnly) {
    component = new Component();
    // Build slotted content
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
    element.appendChild(component);
  }

  if (!component || !(component.hasAttribute('defer-hydration') || isClientOnly)) {
    return;
  }

  // Set all props as JS properties — this handles complex values (arrays, objects)
  // that can't be serialized as HTML attributes
  for (const [name, value] of Object.entries(props)) {
    component[name] = value;
  }

  // Remove defer-hydration to trigger connectedCallback hydration
  component.removeAttribute('defer-hydration');
};
