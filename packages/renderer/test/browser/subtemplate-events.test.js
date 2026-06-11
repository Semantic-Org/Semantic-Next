// Subtemplate-own events for {>name} invocations inside an each block.
// Two shapes per engine: the invocation wrapped in an element, and the
// invocation as the top level of the each item content. The DOM and the
// rendered output are identical — only the bind-time parent of the {>}
// comment differs.

import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach((engine) => {
  describe(engine, () => {
    let tagCounter = 0;
    function uniqueTag() {
      return `test-subtpl-events-${engine}-${++tagCounter}`;
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

    function defineRow() {
      let fired = 0;
      const row = defineComponent({
        renderingEngine: engine,
        template: '<li><a class="lbl">{name}</a></li>',
        events: {
          'click .lbl'() {
            fired++;
          },
        },
      });
      return { row, count: () => fired };
    }

    describe('subtemplate events inside each', () => {
      it('fires when the invocation is wrapped in an element', async () => {
        const tag = uniqueTag();
        const { row, count } = defineRow();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          subTemplates: { row },
          template: '<ul>{#each item in items}<div class="wrap">{>row name=item.name}</div>{/each}</ul>',
          defaultState: {
            items: [{ id: 1, name: 'one' }],
          },
        });
        const el = await mount(tag);
        clickOn(el.shadowRoot.querySelector('.lbl'));
        expect(count()).toBe(1);
      });

      it('fires when the invocation is the top level of the item content', async () => {
        const tag = uniqueTag();
        const { row, count } = defineRow();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          subTemplates: { row },
          template: '<ul>{#each item in items}{>row name=item.name}{/each}</ul>',
          defaultState: {
            items: [{ id: 1, name: 'one' }],
          },
        });
        const el = await mount(tag);
        clickOn(el.shadowRoot.querySelector('.lbl'));
        expect(count()).toBe(1);
      });
    });
  });
});
