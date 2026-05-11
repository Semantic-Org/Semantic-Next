import { defineComponent, renderToString } from '@semantic-ui/component';
import { $ } from '@semantic-ui/query';
import { Template } from '@semantic-ui/templating';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES, waitForUpdate } from './test-utils.js';

/*******************************
   Block-In-Attribute Tests

 Regression coverage for the native renderer rewrite. Lit's
 ReactiveConditionalDirective introspects partInfo.type and serializes
 matched-branch content for attribute parts; the native renderer's
 buildHTMLString classifies only expression entries, so blocks emit
 comment markers regardless of position. Comments inside attribute
 values aren't markup — they become literal attribute text.

 Symptom: <ui-panel size="<!--sui-block:v1:0-->grow<!--/sui-block:v1:0:b1000-->"
 in SSR output; <ui-panel size="<!--sui-block:v1:0-->" client-side.

 These tests pass on the lit engine (works today) and fail on native
 (the regression). After the Block Dispatch Unification refactor (Step
 1), both engines pass.
*******************************/

let tagCounter = 0;
function uniqueTag(engine) {
  return `block-in-attr-${engine}-${++tagCounter}`;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

/*******************************
       Client-side render
*******************************/

RENDERING_ENGINES.forEach(engine => {
  describe(`{#if} in attribute value [${engine}]`, () => {
    it('renders matched branch as attribute value (single-expression attribute)', async () => {
      const tag = uniqueTag(engine);
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div class="card" data-mode="{#if isActive}on{else}off{/if}"></div>',
        defaultState: { isActive: true },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.rendered;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('data-mode')).toBe('on');
    });

    it('renders else branch when condition is false', async () => {
      const tag = uniqueTag(engine);
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div data-mode="{#if isActive}on{else}off{/if}"></div>',
        defaultState: { isActive: false },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.rendered;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('data-mode')).toBe('off');
    });

    it('updates attribute when condition signal flips', async () => {
      const tag = uniqueTag(engine);
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div data-mode="{#if isActive}on{else}off{/if}"></div>',
        defaultState: { isActive: true },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.rendered;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('data-mode')).toBe('on');

      el.template.state.isActive.set(false);
      await waitForUpdate(el);
      expect(div.getAttribute('data-mode')).toBe('off');

      el.template.state.isActive.set(true);
      await waitForUpdate(el);
      expect(div.getAttribute('data-mode')).toBe('on');
    });

    it('supports interpolated attribute values surrounding the block', async () => {
      const tag = uniqueTag(engine);
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div class="base {#if isActive}active{else}inactive{/if} suffix"></div>',
        defaultState: { isActive: true },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.rendered;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('class')).toBe('base active suffix');

      el.template.state.isActive.set(false);
      await waitForUpdate(el);
      expect(div.getAttribute('class')).toBe('base inactive suffix');
    });

    it('supports {:elseif} chains in attribute position', async () => {
      const tag = uniqueTag(engine);
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template:
          "<div data-status=\"{#if is status 'loading'}wait{else if is status 'error'}fail{else}ready{/if}\"></div>",
        defaultState: { status: 'loading' },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.rendered;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('data-status')).toBe('wait');

      el.template.state.status.set('error');
      await waitForUpdate(el);
      expect(div.getAttribute('data-status')).toBe('fail');

      el.template.state.status.set('done');
      await waitForUpdate(el);
      expect(div.getAttribute('data-status')).toBe('ready');
    });

    it('renders attribute correctly inside {#each} per-item context (SpecimenExplorer shape)', async () => {
      const tag = uniqueTag(engine);
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: `
          <div class="panels">
            {#each item in items}
              <span class="cell" data-size="{#if item.last}grow{else}natural{/if}">{item.label}</span>
            {/each}
          </div>
        `,
        defaultState: {
          items: [
            { label: 'A', last: false },
            { label: 'B', last: false },
            { label: 'C', last: true },
          ],
        },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.rendered;

      const cells = el.shadowRoot.querySelectorAll('.cell');
      expect(cells.length).toBe(3);
      expect(cells[0].getAttribute('data-size')).toBe('natural');
      expect(cells[1].getAttribute('data-size')).toBe('natural');
      expect(cells[2].getAttribute('data-size')).toBe('grow');
    });

    it('does not leave hydration markers in the attribute value', async () => {
      // Direct regression assertion — the original symptom was the attribute
      // containing literal `<!--sui-block:v1:N-->` text.
      const tag = uniqueTag(engine);
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div data-mode="{#if isActive}on{else}off{/if}"></div>',
        defaultState: { isActive: true },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.rendered;

      const value = el.shadowRoot.querySelector('div').getAttribute('data-mode');
      expect(value).not.toMatch(/sui-block/);
      expect(value).not.toMatch(/<!--/);
    });
  });

  describe(`{#rerender} in attribute value [${engine}]`, () => {
    it('renders inner content as attribute value', async () => {
      const tag = uniqueTag(engine);
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div data-label="{#rerender count}item-{count}{/rerender}"></div>',
        defaultState: { count: 1 },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.rendered;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('data-label')).toBe('item-1');

      el.template.state.count.set(2);
      await waitForUpdate(el);
      expect(div.getAttribute('data-label')).toBe('item-2');
    });
  });
});

/*******************************
       SSR + hydration
*******************************/

function shadowAttrValue(el, selector, attr) {
  return el.shadowRoot.querySelector(selector).getAttribute(attr);
}

async function ssrAndHydrate(opts, attrs = {}) {
  const tag = uniqueTag('ssr');
  const Component = defineComponent({ tagName: tag, renderingEngine: 'native', ...opts });
  const wasServer = Template.isServer;
  Template.isServer = true;
  let html;
  try {
    html = renderToString(Component, attrs);
  }
  finally {
    Template.isServer = wasServer;
  }
  const wrapper = document.createElement('div');
  wrapper.setHTMLUnsafe(html);
  const el = wrapper.firstElementChild;
  const rendered = $(el).onNext('rendered');
  document.body.appendChild(el);
  await rendered;
  return { el, html };
}

describe('block-in-attribute — SSR output', () => {
  it('server emits evaluated attribute value, not comment markers', async () => {
    const { html } = await ssrAndHydrate({
      template: '<div data-mode="{#if isActive}on{else}off{/if}"></div>',
      defaultState: { isActive: true },
    });

    // The bug: server emits `data-mode="&lt;!--sui-block:v1:N--&gt;on&lt;!--/sui-block:v1:N:b1000--&gt;"`.
    // The fix: server emits `data-mode="on"` inline, with data-sui-bind on the element.
    expect(html).not.toMatch(/data-mode="[^"]*sui-block/);
    expect(html).not.toMatch(/data-mode="[^"]*&lt;!/);
    expect(html).toMatch(/data-mode="on"/);
  });

  it('server emits else-branch when condition is false', async () => {
    const { html } = await ssrAndHydrate({
      template: '<div data-mode="{#if isActive}on{else}off{/if}"></div>',
      defaultState: { isActive: false },
    });
    expect(html).toMatch(/data-mode="off"/);
    expect(html).not.toMatch(/data-mode="[^"]*sui-block/);
  });
});

describe('block-in-attribute — hydration', () => {
  it('hydrates without re-rendering the attribute', async () => {
    const { el } = await ssrAndHydrate({
      template: '<div data-mode="{#if isActive}on{else}off{/if}"></div>',
      defaultState: { isActive: true },
    });
    expect(shadowAttrValue(el, 'div', 'data-mode')).toBe('on');
  });

  it('updates attribute reactively after hydration', async () => {
    const { el } = await ssrAndHydrate({
      template: '<div data-mode="{#if isActive}on{else}off{/if}"></div>',
      defaultState: { isActive: true },
    });
    expect(shadowAttrValue(el, 'div', 'data-mode')).toBe('on');

    el.template.state.isActive.set(false);
    await waitForUpdate(el);
    expect(shadowAttrValue(el, 'div', 'data-mode')).toBe('off');
  });

  it('hydrates interpolated attribute with embedded block', async () => {
    const { el, html } = await ssrAndHydrate({
      template: '<div class="base {#if isActive}active{else}inactive{/if} suffix"></div>',
      defaultState: { isActive: true },
    });

    // Server should emit the full joined string, no markers
    expect(html).toMatch(/class="base active suffix"/);

    // Client should preserve it through hydration
    expect(shadowAttrValue(el, 'div', 'class')).toBe('base active suffix');

    // And update reactively
    el.template.state.isActive.set(false);
    await waitForUpdate(el);
    expect(shadowAttrValue(el, 'div', 'class')).toBe('base inactive suffix');
  });
});
