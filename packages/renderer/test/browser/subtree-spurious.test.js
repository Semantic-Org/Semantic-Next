import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach(engine => {
  /*******************************
         Test Helpers
*******************************/

  let tagCounter = 0;
  function uniqueTag() {
    return `test-spurious-${engine}-${++tagCounter}`;
  }

  function shadowText(el) {
    return el.shadowRoot.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim();
  }

  async function waitForUpdate(el) {
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 0));
    await el.updateComplete;
  }

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  /*******************************
  1. Sibling Expressions
     in Flat Template
*******************************/

  describe('sibling expressions in flat template', () => {
    it('changing one signal should not re-evaluate an expression reading a different signal', async () => {
      let spyCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '<span>{targetExpr}</span><span>{spyExpr}</span>',
        defaultState: { target: 'initial', other: 'fixed' },
        createComponent: ({ state }) => ({
          targetExpr: () => `val:${state.target.get()}`,
          spyExpr: () => {
            spyCount++;
            return `spy:${state.other.get()}`;
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('val:initial');
      expect(shadowText(el)).toContain('spy:fixed');
      const countAfterRender = spyCount;

      el.template.state.target.set('changed');
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('val:changed');
      expect(shadowText(el)).toContain('spy:fixed');
      expect(spyCount).toBe(countAfterRender);
    });

    it('changing one signal should not re-evaluate a static expression reading no signals', async () => {
      let spyCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '<span>{targetExpr}</span><span>{spyExpr}</span>',
        defaultState: { target: 'initial' },
        createComponent: ({ state }) => ({
          targetExpr: () => `val:${state.target.get()}`,
          spyExpr: () => {
            spyCount++;
            return 'static';
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('val:initial');
      expect(shadowText(el)).toContain('static');
      const countAfterRender = spyCount;

      el.template.state.target.set('changed');
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('val:changed');
      expect(spyCount).toBe(countAfterRender);
    });
  });

  /*******************************
  2. Expression Outside vs
     Inside {#each}
*******************************/

  describe('expression outside vs inside each', () => {
    it('changing each data should not re-evaluate an expression outside the loop', async () => {
      let spyCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '<span>{spyExpr}</span>{#each item in getItems}<span>{item.name}</span>{/each}',
        defaultState: { version: 0, label: 'outside' },
        createComponent: ({ state }) => ({
          spyExpr: () => {
            spyCount++;
            return `spy:${state.label.get()}`;
          },
          getItems: () => {
            const v = state.version.get();
            return v === 0
              ? [{ name: 'Alpha' }, { name: 'Beta' }]
              : [{ name: 'Gamma' }, { name: 'Delta' }];
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('spy:outside');
      expect(shadowText(el)).toContain('Alpha');
      const countAfterRender = spyCount;

      el.template.state.version.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('Gamma');
      expect(shadowText(el)).not.toContain('Alpha');
      expect(spyCount).toBe(countAfterRender);
    });
  });

  /*******************************
  3. Expression Outside vs
     Inside {#if}
*******************************/

  describe('expression outside vs inside if', () => {
    it('toggling a condition should not re-evaluate an expression outside the conditional', async () => {
      let spyCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '<span>{spyExpr}</span>{#if visible}<span>SHOWN</span>{else}<span>HIDDEN</span>{/if}',
        defaultState: { visible: true, label: 'stable' },
        createComponent: ({ state }) => ({
          spyExpr: () => {
            spyCount++;
            return `spy:${state.label.get()}`;
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('spy:stable');
      expect(shadowText(el)).toContain('SHOWN');
      const countAfterRender = spyCount;

      el.template.state.visible.set(false);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('HIDDEN');
      expect(shadowText(el)).not.toContain('SHOWN');
      expect(spyCount).toBe(countAfterRender);
    });
  });

  /*******************************
  4. Expression Outside vs
     Inside {#rerender}
*******************************/

  describe('expression outside vs inside rerender', () => {
    it('bumping the rerender key should not re-evaluate an expression outside the rerender block', async () => {
      let spyCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '<span>{spyExpr}</span>{#rerender key}<span>{innerExpr}</span>{/rerender}',
        defaultState: { key: 0, label: 'stable' },
        createComponent: ({ state }) => ({
          spyExpr: () => {
            spyCount++;
            return `spy:${state.label.get()}`;
          },
          innerExpr: () => `inner:${state.key.get()}`,
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('spy:stable');
      expect(shadowText(el)).toContain('inner:0');
      const countAfterRender = spyCount;

      el.template.state.key.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('inner:1');
      expect(spyCount).toBe(countAfterRender);
    });
  });

  /*******************************
  5. Sibling {#each} Blocks
*******************************/

  describe('sibling each blocks', () => {
    it('changing one each source should not re-evaluate expressions in a sibling each', async () => {
      let spyItemCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: [
          '{#each item in getListA}<span>A:{item.name}</span>{/each}',
          '{#each item in getListB}<span>B:{spyItem item}</span>{/each}',
        ].join(''),
        defaultState: { versionA: 0, versionB: 0 },
        createComponent: ({ state }) => ({
          getListA: () => {
            const v = state.versionA.get();
            return v === 0
              ? [{ name: 'A1' }, { name: 'A2' }]
              : [{ name: 'A3' }, { name: 'A4' }];
          },
          getListB: () => {
            state.versionB.get();
            return [{ name: 'B1' }, { name: 'B2' }];
          },
          spyItem: (item) => {
            spyItemCount++;
            return item.name;
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('A:A1');
      expect(shadowText(el)).toContain('B:B1');
      const countAfterRender = spyItemCount;

      el.template.state.versionA.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('A:A3');
      expect(shadowText(el)).toContain('B:B1');
      expect(spyItemCount).toBe(countAfterRender);
    });
  });

  /*******************************
  6. Per-item Granularity
     Inside a Single Each
*******************************/

  describe('per-item granularity inside a single each', () => {
    it('changing an external signal should not cause per-item expressions to re-evaluate when they do not read it', async () => {
      let spyCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#each item in items}<span>{item.name}:{spyFn}</span>{/each}<span>{targetExpr}</span>',
        defaultState: { target: 'initial' },
        createComponent: ({ state }) => ({
          items: [{ name: 'X' }, { name: 'Y' }, { name: 'Z' }],
          spyFn: () => {
            spyCount++;
            return 'ok';
          },
          targetExpr: () => `target:${state.target.get()}`,
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('X:ok');
      expect(shadowText(el)).toContain('target:initial');
      const countAfterRender = spyCount;

      el.template.state.target.set('changed');
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('target:changed');
      expect(spyCount).toBe(countAfterRender);
    });

    it('re-rendering each list should not re-evaluate per-item static expressions in untouched items', async () => {
      // Tracks total calls to the static spy function across all items.
      // In a perfectly granular system, re-rendering the list with the same
      // items should not re-evaluate expressions that read no changed data.
      let spyTotal = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#each item in getItems}<span>{item.label}-{staticSpy}</span>{/each}',
        defaultState: { version: 0 },
        createComponent: ({ state }) => ({
          getItems: () => {
            const v = state.version.get();
            return [
              { id: 1, label: v === 0 ? 'first' : 'updated' },
              { id: 2, label: 'second' },
              { id: 3, label: 'third' },
            ];
          },
          staticSpy: () => {
            spyTotal++;
            return 'ok';
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('first-ok');
      expect(shadowText(el)).toContain('second-ok');
      expect(shadowText(el)).toContain('third-ok');
      // 3 items rendered initially = 3 calls
      const countAfterRender = spyTotal;

      el.template.state.version.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('updated-ok');
      // Ideally only item 1's expressions would re-evaluate (countAfterRender + 1),
      // but since the each list source changed, the framework may re-evaluate all items.
      // We test for the ideal: unchanged items should not cause extra calls.
      expect(spyTotal).toBe(countAfterRender + 1);
    });
  });

  /*******************************
  7. {#rerender} Should NOT
     Re-evaluate Expressions
     Outside Its Block
*******************************/

  describe('rerender isolation from sibling content', () => {
    it('bumping rerender key should not re-evaluate sibling expressions or sibling each items', async () => {
      let siblingSpyCount = 0;
      let eachSpyCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: [
          '<span>{siblingExpr}</span>',
          '{#each item in items}<span>{eachSpy item.name}</span>{/each}',
          '{#rerender key}<span>{rerenderContent}</span>{/rerender}',
        ].join(''),
        defaultState: { key: 0, other: 'fixed' },
        createComponent: ({ state }) => ({
          siblingExpr: () => {
            siblingSpyCount++;
            return `sibling:${state.other.get()}`;
          },
          items: [{ name: 'P' }, { name: 'Q' }],
          eachSpy: (name) => {
            eachSpyCount++;
            return name;
          },
          rerenderContent: () => `rerender:${state.key.get()}`,
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('sibling:fixed');
      expect(shadowText(el)).toContain('P');
      expect(shadowText(el)).toContain('rerender:0');
      const siblingCountAfterRender = siblingSpyCount;
      const eachCountAfterRender = eachSpyCount;

      el.template.state.key.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('rerender:1');
      expect(siblingSpyCount).toBe(siblingCountAfterRender);
      expect(eachSpyCount).toBe(eachCountAfterRender);
    });

    it('bumping rerender key should not re-evaluate a preceding sibling expression that reads no shared signals', async () => {
      let spyCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '<span>{staticSpy}</span>{#rerender key}<span>inside:{key}</span>{/rerender}',
        defaultState: { key: 0 },
        createComponent: () => ({
          staticSpy: () => {
            spyCount++;
            return 'static';
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('static');
      expect(shadowText(el)).toContain('inside:0');
      const countAfterRender = spyCount;

      el.template.state.key.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('inside:1');
      expect(spyCount).toBe(countAfterRender);
    });
  });
  /*******************************
  8. Verbose data=expression
     Should Re-evaluate ALL
     Subtemplate Expressions
*******************************/

  describe('verbose data=expression re-evaluates all expressions', () => {
    it('changing one field in data blob should re-evaluate all subtemplate expressions', async () => {
      let labelEvalCount = 0;
      let statusEvalCount = 0;
      const tag = uniqueTag();

      const child = defineComponent({
        renderingEngine: engine,
        template: '<span>{markLabel}{label}</span><span>{markStatus}{status}</span>',
        createComponent: () => ({
          markLabel: () => {
            labelEvalCount++;
            return '';
          },
          markStatus: () => {
            statusEvalCount++;
            return '';
          },
        }),
      });

      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: "{> template name='child' data=getRow}",
        subTemplates: { child },
        createComponent: ({ signal }) => {
          const row = signal({ label: 'hello', status: 'active' });
          return {
            getRow: () => row.get(),
            updateLabel: (val) => row.set({ ...row.get(), label: val }),
          };
        },
      });

      const el = document.createElement(tag);
      document.body.appendChild(el);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('hello');
      expect(shadowText(el)).toContain('active');
      const labelCountAfterRender = labelEvalCount;
      const statusCountAfterRender = statusEvalCount;

      // change only label — both expressions should re-evaluate
      // because data=expression is a blob (coarse reactivity)
      el.component.updateLabel('changed');
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('changed');
      expect(shadowText(el)).toContain('active');
      expect(labelEvalCount).toBeGreaterThan(labelCountAfterRender);
      expect(statusEvalCount).toBeGreaterThan(statusCountAfterRender);
    });
  });
}); // RENDERING_ENGINES.forEach
