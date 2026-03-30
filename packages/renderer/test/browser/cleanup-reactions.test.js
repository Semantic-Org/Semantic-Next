import { defineComponent } from '@semantic-ui/component';
import { Reaction } from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach(engine => {
  /*******************************
         Test Helpers
*******************************/

  let tagCounter = 0;
  function uniqueTag() {
    return `test-cleanup-${engine}-${++tagCounter}`;
  }

  async function flush(el) {
    Reaction.flush();
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 0));
  }

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  /*******************************
   Conditional Branch Cleanup
*******************************/

  describe('conditional branch cleanup', () => {
    it('should stop reactions in removed if branch', async () => {
      let spyCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#if showBranch}<span>{spyExpr}</span>{/if}',
        defaultState: { showBranch: true, tracked: 'initial' },
        createComponent: ({ state }) => ({
          spyExpr: () => {
            spyCount++;
            return `val:${state.tracked.get()}`;
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(spyCount).toBeGreaterThan(0);

      // Remove the branch
      el.template.state.showBranch.set(false);
      await flush(el);
      const countAfterRemoval = spyCount;

      // Mutate the signal the removed expression was tracking
      el.template.state.tracked.set('changed');
      await flush(el);

      // Removed branch's reaction should not have fired
      expect(spyCount).toBe(countAfterRemoval);
    });

    it('should stop nested each reactions when parent if branch is removed', async () => {
      let itemSpyCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#if showList}{#each item in items}<span>{itemSpy item.name}</span>{/each}{/if}',
        defaultState: { showList: true, tick: 0 },
        createComponent: ({ state }) => ({
          items: [{ name: 'A' }, { name: 'B' }],
          itemSpy: (name) => {
            itemSpyCount++;
            state.tick.get();
            return name;
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(itemSpyCount).toBeGreaterThan(0);

      // Remove entire if branch (containing the each)
      el.template.state.showList.set(false);
      await flush(el);
      const countAfterRemoval = itemSpyCount;

      // Mutate signal that item expressions were tracking
      el.template.state.tick.set(1);
      await flush(el);

      expect(itemSpyCount).toBe(countAfterRemoval);
    });

    it('should stop reactions in swapped else branch', async () => {
      let branchASpy = 0;
      let branchBSpy = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#if isA}<span>{spyA}</span>{else}<span>{spyB}</span>{/if}',
        defaultState: { isA: true, valueA: 'a', valueB: 'b' },
        createComponent: ({ state }) => ({
          spyA: () => {
            branchASpy++;
            return state.valueA.get();
          },
          spyB: () => {
            branchBSpy++;
            return state.valueB.get();
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(branchASpy).toBeGreaterThan(0);

      // Swap to else branch
      el.template.state.isA.set(false);
      await flush(el);
      const aCountAfterSwap = branchASpy;

      // Mutate signal that branch A was tracking
      el.template.state.valueA.set('changed-a');
      await flush(el);

      // Branch A's reaction should not fire
      expect(branchASpy).toBe(aCountAfterSwap);
      // Branch B should still be alive
      expect(branchBSpy).toBeGreaterThan(0);
    });
  });

  /*******************************
     Each Item Cleanup
*******************************/

  describe('each item cleanup', () => {
    it('should stop reactions for removed list items', async () => {
      let removedItemSpy = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#each item in getItems}<span>{item.render}</span>{/each}',
        defaultState: { version: 0, signal: 'initial' },
        createComponent: ({ state }) => ({
          getItems: () => {
            return state.version.get() === 0
              ? [
                { _id: 'a', render: 'static-A' },
                {
                  _id: 'b',
                  render: () => {
                    removedItemSpy++;
                    return `B:${state.signal.get()}`;
                  },
                },
                {
                  _id: 'c',
                  render: () => {
                    removedItemSpy++;
                    return `C:${state.signal.get()}`;
                  },
                },
              ]
              : [
                { _id: 'a', render: 'static-A' },
              ];
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const countAfterRender = removedItemSpy;
      expect(countAfterRender).toBeGreaterThan(0); // B and C rendered

      // Shrink list — remove B and C
      el.template.state.version.set(1);
      await flush(el);
      const countAfterShrink = removedItemSpy;

      // Mutate signal that B and C were tracking
      el.template.state.signal.set('changed');
      await flush(el);

      // Removed items' reactions should not have fired
      expect(removedItemSpy).toBe(countAfterShrink);
    });

    it('should stop reactions when list becomes empty', async () => {
      let itemSpy = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#each item in getItems}<span>{itemExpr}</span>{else}<span>empty</span>{/each}',
        defaultState: { showItems: true, tracked: 'init' },
        createComponent: ({ state }) => ({
          getItems: () =>
            state.showItems.get()
              ? [{ name: 'X' }, { name: 'Y' }]
              : [],
          itemExpr: () => {
            itemSpy++;
            return `val:${state.tracked.get()}`;
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(itemSpy).toBeGreaterThan(0);

      // Empty the list
      el.template.state.showItems.set(false);
      await flush(el);
      const countAfterEmpty = itemSpy;

      // Mutate signal that item expressions were tracking
      el.template.state.tracked.set('changed');
      await flush(el);

      // Item reactions should not fire — they're gone
      expect(itemSpy).toBe(countAfterEmpty);
    });
  });

  /*******************************
   Rerender Block Cleanup
*******************************/

  describe('rerender block cleanup', () => {
    it('should stop old content reactions when rerender key changes', async () => {
      let renderCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#rerender key}<span>{trackingSpy}</span>{/rerender}',
        defaultState: { key: 0, tracked: 'initial' },
        createComponent: ({ state }) => ({
          trackingSpy: () => {
            renderCount++;
            return `${state.tracked.get()}:${state.key.get()}`;
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      // Trigger rerender — old content is destroyed and rebuilt
      el.template.state.key.set(1);
      await flush(el);
      const countAfterRerender = renderCount;

      // Change tracked — only the NEW content reaction should fire
      el.template.state.tracked.set('changed');
      await flush(el);

      // Should increase by exactly 1 (the new content's reaction),
      // not 2 (which would mean old content's reaction also fired)
      expect(renderCount).toBe(countAfterRerender + 1);
    });
  });

  /*******************************
   Subtemplate Cleanup
*******************************/

  describe('subtemplate cleanup on conditional removal', () => {
    it('should call onDestroyed when subtemplate is conditionally removed', async () => {
      let destroyed = false;
      const tag = uniqueTag();

      const child = defineComponent({
        renderingEngine: engine,
        template: '<span>{label}</span>',
        onDestroyed: () => {
          destroyed = true;
        },
      });

      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#if showChild}{>child label=getLabel}{/if}',
        defaultState: { showChild: true, text: 'hello' },
        createComponent: ({ state }) => ({
          getLabel: () => state.text.get(),
        }),
        subTemplates: { child },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(destroyed).toBe(false);

      el.template.state.showChild.set(false);
      await flush(el);

      expect(destroyed).toBe(true);
    });

    it('should stop subtemplate reactions after conditional removal', async () => {
      let childSpy = 0;
      const tag = uniqueTag();

      const child = defineComponent({
        renderingEngine: engine,
        template: '<span>{spyExpr}</span>',
      });

      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#if showChild}{>child spyExpr=getSpy}{/if}',
        defaultState: { showChild: true, tracked: 'initial' },
        createComponent: ({ state }) => ({
          getSpy: () => {
            childSpy++;
            return `spy:${state.tracked.get()}`;
          },
        }),
        subTemplates: { child },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(childSpy).toBeGreaterThan(0);

      // Remove subtemplate
      el.template.state.showChild.set(false);
      await flush(el);
      const countAfterRemoval = childSpy;

      // Mutate signal the subtemplate was tracking
      el.template.state.tracked.set('changed');
      await flush(el);

      expect(childSpy).toBe(countAfterRemoval);
    });
  });

  /*******************************
   Unbounded Growth Prevention
*******************************/

  describe('unbounded reaction growth prevention', () => {
    it('should not accumulate reactions across repeated branch swaps', async () => {
      let evalCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#if toggle}<span>{branchExpr}</span>{else}<span>{branchExpr}</span>{/if}',
        defaultState: { toggle: true, tracked: 'v0' },
        createComponent: ({ state }) => ({
          branchExpr: () => {
            evalCount++;
            return state.tracked.get();
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      // Swap branches several times to potentially accumulate leaked reactions
      for (let i = 0; i < 5; i++) {
        el.template.state.toggle.set(i % 2 === 0);
        await flush(el);
      }
      const countAfterSwaps = evalCount;

      // Now trigger tracked signal — should cause exactly 1 re-evaluation
      // (the currently active branch), not N (leaked reactions from old branches)
      el.template.state.tracked.set('v1');
      await flush(el);

      // Allow for some variance in how the framework batches, but the key
      // assertion: we should not see 5+ extra evaluations from leaked reactions
      const delta = evalCount - countAfterSwaps;
      expect(delta).toBeLessThanOrEqual(2);
    });

    it('should not accumulate reactions across repeated each list updates', async () => {
      let evalCount = 0;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#each item in getItems}<span>{spy item.name}</span>{/each}',
        defaultState: { version: 0, signal: 'init' },
        createComponent: ({ state }) => ({
          getItems: () => {
            const v = state.version.get();
            // Return a different set of items each time
            return [
              { _id: 'x', name: `X-v${v}` },
              { _id: 'y', name: `Y-v${v}` },
            ];
          },
          spy: (name) => {
            evalCount++;
            state.signal.get();
            return name;
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      // Update the list several times
      for (let i = 1; i <= 5; i++) {
        el.template.state.version.set(i);
        await flush(el);
      }
      const countAfterUpdates = evalCount;

      // Trigger signal — should cause exactly 2 evaluations (2 current items)
      el.template.state.signal.set('changed');
      await flush(el);

      const delta = evalCount - countAfterUpdates;
      expect(delta).toBeLessThanOrEqual(2);
    });
  });
}); // RENDERING_ENGINES.forEach
