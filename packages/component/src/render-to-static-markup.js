import { each, filterEmpty } from '@semantic-ui/utils';
import { createServerTemplate } from './component-helpers.js';
import { expandCustomElements } from './expand-custom-elements.js';

/*
  Render a component to the markup of its template alone, as a mail client, a feed,
  a static page or a snippet holds it. The web form's shadow root wrapper, style and
  hydration markers are left out.

  Usage:
    import { defineComponent, renderToStaticMarkup } from '@semantic-ui/component';

    const Welcome = defineComponent({ tagName: 'welcome-mail', template, css });
    const html = renderToStaticMarkup(Welcome, { name: 'jack' });
    const text = renderToStaticMarkup(Welcome, { name: 'jack' }, { text: true });
    const styled = renderToStaticMarkup(Welcome, { name: 'jack' }, { css: true }); // { html, css }

  Slot content fills in where each {>slot} sits, there being no light DOM to project,
  and a nested component renders where its tag sat with its children assigned to its
  slots. css: true adds the css of every component the render reached, parent first.
*/
export function renderToStaticMarkup(ComponentClass, attrs = {}, { slots = null, text = false, css = false } = {}) {
  const { html, components } = renderFlat(ComponentClass, attrs, { slots, text });
  if (!css) {
    return html;
  }
  return { html, css: filterEmpty(Array.from(components, (component) => component.config?.css)).join('\n') };
}

// one flat render and the components it reached, in document order so their css cascades as written
function renderFlat(ComponentClass, attrs, { slots, text, depth = 0 }) {
  const { template } = createServerTemplate(ComponentClass, attrs, {
    renderOptions: { markers: false, text, slots: slots || {} },
  });
  const components = new Set([ComponentClass]);
  const html = expandCustomElements(template.render(), {
    depth,
    assignSlots: true,
    renderFn: (NestedClass, nestedAttrs, nested) => {
      const rendered = renderFlat(NestedClass, nestedAttrs, { slots: nested.slots, text, depth: nested.depth });
      each(rendered.components, (component) => components.add(component));
      return rendered.html;
    },
  });
  return { html, components };
}
