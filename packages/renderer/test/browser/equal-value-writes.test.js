import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES, waitForUpdate } from './test-utils.js';

/*
  A binding whose value did not change must not touch the DOM. The shape that exposes it is one
  signal holding an object that a tick replaces wholesale: a dashboard's sampler, a store's
  snapshot. The signal's own equality skips a replacement that is deep-equal, so the case worth
  pinning is the mixed one, where some other field moved and this binding's string did not.

  Equal-value writes are not cosmetic. A text write invalidates the node and a class write
  invalidates style for the element, so a steady field on a busy signal pays layout and paint
  on every tick.
*/

RENDERING_ENGINES.forEach((engine) => {
  let tagCounter = 0;
  const uniqueTag = () => `test-equal-writes-${engine}-${++tagCounter}`;

  // characterData and attribute records whose value came back the same
  function countRewrites(root) {
    const seen = { text: 0, multiPartAttribute: 0, singleExpressionAttribute: 0, moved: 0 };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const now = record.type === 'characterData'
          ? record.target.data
          : record.target.getAttribute(record.attributeName);
        if (record.oldValue !== now) {
          seen.moved += 1;
          continue;
        }
        if (record.type === 'characterData') { seen.text += 1; }
        else if (record.target.dataset.binding === 'single') { seen.singleExpressionAttribute += 1; }
        else { seen.multiPartAttribute += 1; }
      }
    });
    observer.observe(root, {
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['class'],
    });
    return {
      seen,
      stop: () => {
        observer.takeRecords();
        observer.disconnect();
      },
    };
  }

  async function mount() {
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: engine,
      tagName: tag,
      template: `
        <div class="stat conn {metrics.connection}" data-binding="multi"><b>{metrics.connection}</b></div>
        <div class="{metrics.connection}" data-binding="single"></div>
      `,
      defaultState: { metrics: { connection: 'active', fps: 60 } },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;
    return el;
  }

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe(`${engine}: a binding whose value did not change`, () => {
    it('writes nothing when the whole object is replaced with a deep-equal one', async () => {
      const el = await mount();
      const { seen, stop } = countRewrites(el.shadowRoot);
      for (let i = 0; i < 10; i += 1) {
        el.template.state.metrics.set({ connection: 'active', fps: 60 });
        await waitForUpdate(el);
      }
      stop();
      // the signal's own equality skips the set, so nothing downstream runs at all
      expect(seen).toEqual({ text: 0, multiPartAttribute: 0, singleExpressionAttribute: 0, moved: 0 });
    });

    it('writes nothing when another field moved and this one did not', async () => {
      const el = await mount();
      const { seen, stop } = countRewrites(el.shadowRoot);
      for (let i = 0; i < 10; i += 1) {
        el.template.state.metrics.set({ connection: 'active', fps: 60 + i });
        await waitForUpdate(el);
      }
      stop();
      // before the guards the native engine wrote the same string 9 times to the text node and 9
      // times to the multi-part class, while the single-expression class was already quiet
      expect(seen.text).toBe(0);
      expect(seen.multiPartAttribute).toBe(0);
      expect(seen.singleExpressionAttribute).toBe(0);
      expect(seen.moved).toBe(0);
    });

    it('still writes when the value itself moves', async () => {
      const el = await mount();
      const states = ['waiting', 'retrying', 'active'];
      const { seen, stop } = countRewrites(el.shadowRoot);
      for (const connection of states) {
        el.template.state.metrics.set({ connection, fps: 60 });
        await waitForUpdate(el);
      }
      stop();
      // three moves across a text node and two class attributes, and no equal-value write
      expect(seen.moved).toBe(states.length * 3);
      expect(seen.text + seen.multiPartAttribute + seen.singleExpressionAttribute).toBe(0);
      expect(el.shadowRoot.querySelector('b').textContent).toBe('active');
      expect(el.shadowRoot.querySelector('[data-binding="multi"]').getAttribute('class')).toBe('stat conn active');
    });
  });
});
