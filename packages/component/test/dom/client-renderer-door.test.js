import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  defineComponent,
  expandCustomElements,
  renderToStaticMarkup,
  renderToString,
} from '@semantic-ui/component/server';
import { Template } from '@semantic-ui/templating';

// under a DOM the template picks the client renderer and hands back a fragment, which every
// server door refuses with the same named error
const Card = defineComponent({
  tagName: 'door-card',
  template: '<div class="card">{title}</div>',
});
const door = 'Set Template.isServer = true';

describe('the server doors under the client renderer', () => {
  let wasServer;
  beforeEach(() => {
    wasServer = Template.isServer;
    Template.isServer = false;
  });
  afterEach(() => {
    Template.isServer = wasServer;
  });

  it('renderToString names the door', () => {
    expect(() => renderToString(Card, { title: 'x' })).toThrow(door);
  });

  it('renderToStaticMarkup names the door', () => {
    expect(() => renderToStaticMarkup(Card, { title: 'x' })).toThrow(door);
  });

  it('expandCustomElements names the door for a fragment', () => {
    expect(() => expandCustomElements(document.createDocumentFragment(), { renderFn: renderToString })).toThrow(door);
  });
});
