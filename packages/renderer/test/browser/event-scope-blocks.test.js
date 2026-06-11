// Block scope layers in the event-handler `scope` param: each item vars,
// subtemplate args, snippet args, async vars, resolved from the event
// target's position via the boundary-marker bracket scan. Layer resolution
// is a native-engine contract — lit degrades to an empty object, asserted
// at the bottom of the engine loop.

import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES, waitForUpdate } from './test-utils.js';

RENDERING_ENGINES.forEach((engine) => {
  const isLit = engine === 'lit';

  describe(engine, () => {
    let tagCounter = 0;
    function uniqueTag() {
      return `test-scope-${engine}-${++tagCounter}`;
    }

    function clickOn(element) {
      element.dispatchEvent(
        new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }),
      );
    }

    async function mount(tag) {
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.rendered;
      return el;
    }

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    describe('event scope — each layers', () => {
      it.skipIf(isLit)('exposes as-mode item and index at the clicked row', async () => {
        const tag = uniqueTag();
        let captured;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<ul>{#each item in items}<li class="row">{item.name}</li>{/each}</ul>',
          defaultState: {
            items: [
              { id: 'a', name: 'Alpha' },
              { id: 'b', name: 'Beta' },
            ],
          },
          events: {
            'click .row'({ scope }) {
              captured = scope;
            },
          },
        });
        const el = await mount(tag);
        clickOn(el.shadowRoot.querySelectorAll('.row')[1]);
        expect(captured.item).toEqual({ id: 'b', name: 'Beta' });
        expect(captured.index).toBe(1);
        expect(Object.getPrototypeOf(captured)).toBe(Object.prototype);
      });

      it.skipIf(isLit)('exposes spread-mode fields, this, and index', async () => {
        const tag = uniqueTag();
        let captured;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<ul>{#each items}<li class="row">{name}</li>{/each}</ul>',
          defaultState: {
            items: [{ id: 'a', name: 'Alpha' }],
          },
          events: {
            'click .row'({ scope }) {
              captured = scope;
            },
          },
        });
        const el = await mount(tag);
        clickOn(el.shadowRoot.querySelector('.row'));
        expect(captured.name).toBe('Alpha');
        expect(captured.this).toEqual({ id: 'a', name: 'Alpha' });
        expect(captured.index).toBe(0);
      });

      it.skipIf(isLit)('stays current across reorder and in-place mutation', async () => {
        const tag = uniqueTag();
        const a = { id: 'a', name: 'Alpha' };
        const b = { id: 'b', name: 'Beta' };
        let captured;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<ul>{#each item in items}<li class="row">{item.name}</li>{/each}</ul>',
          defaultState: { items: [a, b] },
          events: {
            'click .row'({ scope }) {
              captured = scope;
            },
          },
        });
        const el = await mount(tag);

        el.template.state.items.set([b, a]);
        await waitForUpdate(el);
        clickOn(el.shadowRoot.querySelectorAll('.row')[0]);
        expect(captured.item.id).toBe('b');
        expect(captured.index).toBe(0);

        el.template.state.items.peek()[0].name = 'Beta v2';
        el.template.state.items.notify();
        await waitForUpdate(el);
        clickOn(el.shadowRoot.querySelectorAll('.row')[0]);
        expect(captured.item.name).toBe('Beta v2');
      });

      it.skipIf(isLit)('resolves nested each with the inner layer winning', async () => {
        const tag = uniqueTag();
        let captured;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template:
            '{#each outer in outers}<div class="group">{#each inner in outer.kids}<span class="cell">{inner.id}</span>{/each}</div>{/each}',
          defaultState: {
            outers: [
              { id: 'o1', kids: [{ id: 'k1' }, { id: 'k2' }] },
            ],
          },
          events: {
            'click .cell'({ scope }) {
              captured = scope;
            },
          },
        });
        const el = await mount(tag);
        clickOn(el.shadowRoot.querySelectorAll('.cell')[1]);
        expect(captured.inner.id).toBe('k2');
        expect(captured.outer.id).toBe('o1');
        expect(captured.index).toBe(1);
      });

      it.skipIf(isLit)('resolves block content swapped in after creation to the row layer', async () => {
        const tag = uniqueTag();
        let captured;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template:
            '<ul>{#each item in items}<li>{#if showExtra}<button class="extra">x</button>{/if}<span>{item.name}</span></li>{/each}</ul>',
          defaultState: {
            items: [{ id: 'a', name: 'Alpha' }],
            showExtra: false,
          },
          events: {
            'click .extra'({ scope }) {
              captured = scope;
            },
          },
        });
        const el = await mount(tag);
        el.template.state.showExtra.set(true);
        await waitForUpdate(el);
        clickOn(el.shadowRoot.querySelector('.extra'));
        expect(captured.item.id).toBe('a');
      });

      it.skipIf(isLit)('resolves an element after the list to an empty scope', async () => {
        const tag = uniqueTag();
        let captured;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template:
            '<div><ul>{#each item in items}<li class="row">{item.name}</li>{/each}</ul><button class="after">after</button></div>',
          defaultState: {
            items: [{ id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta' }],
          },
          events: {
            'click .after'({ scope }) {
              captured = scope;
            },
          },
        });
        const el = await mount(tag);
        clickOn(el.shadowRoot.querySelector('.after'));
        expect(captured).toEqual({});
      });
    });

    describe('event scope — subtemplate and snippet layers', () => {
      it.skipIf(isLit)('exposes subtemplate args to the parent handler without data attributes', async () => {
        const tag = uniqueTag();
        let parentScope;
        let ownScope;
        const rowItem = defineComponent({
          renderingEngine: engine,
          template: '<li><a class="lbl">{name}</a></li>',
          events: {
            'click .lbl'({ scope }) {
              ownScope = scope;
            },
          },
        });
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<ul>{#each item in items}{>rowItem id=item.id name=item.name}{/each}</ul>',
          subTemplates: { rowItem },
          defaultState: {
            items: [{ id: 7, name: 'Seven' }],
          },
          events: {
            'click .lbl'({ scope }) {
              parentScope = scope;
            },
          },
        });
        const el = await mount(tag);
        clickOn(el.shadowRoot.querySelector('.lbl'));
        expect(parentScope.id).toBe(7);
        expect(parentScope.name).toBe('Seven');
        expect(parentScope.item).toEqual({ id: 7, name: 'Seven' });
        // the subtemplate's own handler sees its own tree only — the
        // parent's row vars sit beyond its start anchor
        expect(ownScope).toEqual({});
      });

      it.skipIf(isLit)('limits snippet layers to declared args', async () => {
        const tag = uniqueTag();
        let captured;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '{#snippet badge}<b class="badge">{label}</b>{/snippet}<div>{>badge label=current}</div>',
          defaultState: {
            current: 'live',
            items: ['parent-key'],
          },
          events: {
            'click .badge'({ scope }) {
              captured = scope;
            },
          },
        });
        const el = await mount(tag);
        clickOn(el.shadowRoot.querySelector('.badge'));
        expect(captured.label).toBe('live');
        // parent context keys are not a layer — they already arrive as
        // settings/state/self params
        expect('items' in captured).toBe(false);
      });

      it.skipIf(isLit)('drops the subtemplate layer once the invocation clears', async () => {
        const tag = uniqueTag();
        let captured;
        const rowItem = defineComponent({
          renderingEngine: engine,
          template: '<span class="lbl">{id}</span>',
        });
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div>{>template name=maybeRow data={id: 7}}<button class="after">after</button></div>',
          subTemplates: { rowItem },
          defaultState: { maybeRow: 'rowItem' },
          events: {
            'click .after'({ scope }) {
              captured = scope;
            },
          },
        });
        const el = await mount(tag);
        expect(el.shadowRoot.querySelector('.lbl')).not.toBeNull();
        el.template.state.maybeRow.set(null);
        await waitForUpdate(el);
        expect(el.shadowRoot.querySelector('.lbl')).toBeNull();
        clickOn(el.shadowRoot.querySelector('.after'));
        expect(captured).toEqual({});
      });
    });

    describe('event scope — async layers', () => {
      it.skipIf(isLit)('exposes async as-vars from the current state render', async () => {
        const tag = uniqueTag();
        let captured;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '{#async getData as result}<span class="res">{result.x}</span>{/async}',
          createComponent: () => ({
            getData: () => ({ x: 5 }),
          }),
          events: {
            'click .res'({ scope }) {
              captured = scope;
            },
          },
        });
        const el = await mount(tag);
        clickOn(el.shadowRoot.querySelector('.res'));
        expect(captured.result).toEqual({ x: 5 });
      });
    });

    describe('event scope — engine degradation', () => {
      it.skipIf(!isLit)('resolves to an empty object on engines without layer resolution', async () => {
        const tag = uniqueTag();
        let captured;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<ul>{#each item in items}<li class="row">{item.name}</li>{/each}</ul>',
          defaultState: {
            items: [{ id: 'a', name: 'Alpha' }],
          },
          events: {
            'click .row'({ scope }) {
              captured = scope;
            },
          },
        });
        const el = await mount(tag);
        clickOn(el.shadowRoot.querySelector('.row'));
        expect(captured).toEqual({});
      });
    });
  });
});
