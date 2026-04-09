import { $ } from '@semantic-ui/query';
import { describe, expect, it } from 'vitest';
import { LitRenderer } from '../../src/engines/lit/register.js';
import { defineComponent, NativeRenderer } from '../../src/index.js';

/*
  Engine selection tests — verifies that renderingEngine accepts
  both string names and engine objects for all supported paths.
*/
describe('Engine Selection', () => {
  let tagCounter = 0;
  const uniqueTag = () => `engine-sel-${++tagCounter}`;

  it('should render with renderingEngine: "native" (string)', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      renderingEngine: 'native',
      template: '<div class="content">native-string</div>',
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await $(el).onNext('rendered');
    expect(el.shadowRoot.querySelector('.content').textContent).toBe('native-string');
  });

  it('should render with renderingEngine: "lit" (string)', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      renderingEngine: 'lit',
      template: '<div class="content">lit-string</div>',
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.content').textContent).toBe('lit-string');
  });

  it('should render with renderingEngine: NativeRenderer (object)', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      renderingEngine: NativeRenderer,
      template: '<div class="content">native-object</div>',
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await $(el).onNext('rendered');
    expect(el.shadowRoot.querySelector('.content').textContent).toBe('native-object');
  });

  it('should render with renderingEngine: LitRenderer (object)', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      renderingEngine: LitRenderer,
      template: '<div class="content">lit-object</div>',
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.content').textContent).toBe('lit-object');
  });

  it('should use default engine (lit) when renderingEngine is omitted', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: '<div class="content">default-engine</div>',
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.content').textContent).toBe('default-engine');
  });
});
