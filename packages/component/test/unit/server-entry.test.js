import { getEngine, ServerRenderer } from '@semantic-ui/renderer';
import { describe, expect, it } from 'vitest';

import {
  defineComponent,
  expandCustomElements,
  renderToStaticMarkup,
  renderToString,
} from '@semantic-ui/component/server';

describe('@semantic-ui/component/server', () => {
  it('carries the browser surface and the server functions', () => {
    expect(defineComponent).toBeTypeOf('function');
    expect(renderToString).toBeTypeOf('function');
    expect(renderToStaticMarkup).toBeTypeOf('function');
    expect(expandCustomElements).toBeTypeOf('function');
  });

  it('gives the native engine its server renderer on load', () => {
    expect(getEngine('native').serverRenderer).toBe(ServerRenderer);
  });

  it("reflects settings to attributes through each type's toAttribute", () => {
    const Reflected = defineComponent({
      tagName: 'ssr-reflected-settings',
      template: '<i>{label}</i>',
      defaultSettings: { active: false, count: 0, config: {}, label: '' },
    });
    const html = renderToString(Reflected, { active: true, count: 5, config: { a: 1 }, label: 'x' });
    const openTag = html.slice(0, html.indexOf('>') + 1);
    expect(openTag).toContain('active="true"');
    expect(openTag).toContain('count="5"');
    expect(openTag).toContain('config="{&quot;a&quot;:1}"');
    expect(openTag).toContain('label="x"');
    // a nullish value drops its attribute instead of serializing a poison string
    const dropped = renderToString(Reflected, { count: null });
    expect(dropped.slice(0, dropped.indexOf('>') + 1)).not.toContain('count=');
  });
});
