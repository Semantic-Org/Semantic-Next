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
});
