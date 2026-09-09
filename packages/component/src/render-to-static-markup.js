import { createServerTemplate } from './component-helpers.js';

/*
  Render a component to its markup alone: no shadow root, no style, no hydration
  markers. What a mail client, a feed, a static page or a snippet holds as it is.

  Usage:
    import { defineComponent, renderToStaticMarkup } from '@semantic-ui/component';

    const Welcome = defineComponent({ tagName: 'welcome-mail', template, css });
    const html = renderToStaticMarkup(Welcome, { name: 'jack' });
    const text = renderToStaticMarkup(Welcome, { name: 'jack' }, { text: true });

  Slot content fills in where each {>slot} sits, there being no light DOM to project.
*/
export function renderToStaticMarkup(ComponentClass, attrs = {}, { slots = null, text = false } = {}) {
  const { template } = createServerTemplate(ComponentClass, attrs, {
    renderOptions: { markers: false, text, slots: slots || {} },
  });
  return template.render();
}
