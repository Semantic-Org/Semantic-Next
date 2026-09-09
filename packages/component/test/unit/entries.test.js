import { getEngine } from '@semantic-ui/renderer';
import { describe, expect, it } from 'vitest';

import * as component from '@semantic-ui/component';

describe('@semantic-ui/component', () => {
  it('keeps the root entry to the browser surface', () => {
    expect(component.defineComponent).toBeTypeOf('function');
    expect(component.renderToString).toBeUndefined();
    expect(component.renderToStaticMarkup).toBeUndefined();
    expect(component.expandCustomElements).toBeUndefined();
    expect(getEngine('native').serverRenderer).toBeUndefined();
  });
});
