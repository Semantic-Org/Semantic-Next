import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach(engine => {
  /*******************************
         Test Helpers
*******************************/

  let tagCounter = 0;
  function uniqueTag() {
    return `test-each-${engine}-${++tagCounter}`;
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
   each → expression
*******************************/

  describe('each → expression', () => {
    it('reactive: inner expression updates when signal changes', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#each item in items}<span>{item.name}:{label}</span>{/each}',
        defaultState: { label: 'old' },
        createComponent: () => ({
          items: [{ name: 'A' }, { name: 'B' }],
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('A:old');
      expect(shadowText(el)).toContain('B:old');

      el.template.state.label.set('new');
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('A:new');
      expect(shadowText(el)).toContain('B:new');
      expect(shadowText(el)).not.toContain('old');
    });

    it('non-reactive: expression updates when parent returns new objects', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#each item in getItems}<span>{item.name}:{item.status}</span>{/each}',
        defaultState: { version: 0 },
        createComponent: ({ state }) => ({
          getItems: () => {
            const v = state.version.get();
            return [
              { name: 'A', status: v === 0 ? 'pending' : 'done' },
              { name: 'B', status: v === 0 ? 'waiting' : 'complete' },
            ];
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('A:pending');
      expect(shadowText(el)).toContain('B:waiting');

      el.template.state.version.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('A:done');
      expect(shadowText(el)).toContain('B:complete');
    });
  });

  /*******************************
   each → if → expression
*******************************/

  describe('each → if → expression', () => {
    it('reactive: conditional branch switches when signal changes', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template:
          '{#each item in items}{#if showDetail}<span>{item.name}:detail</span>{else}<span>{item.name}:summary</span>{/if}{/each}',
        defaultState: { showDetail: false },
        createComponent: () => ({
          items: [{ name: 'X' }, { name: 'Y' }],
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('X:summary');
      expect(shadowText(el)).toContain('Y:summary');

      el.template.state.showDetail.set(true);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('X:detail');
      expect(shadowText(el)).toContain('Y:detail');
      expect(shadowText(el)).not.toContain('summary');
    });

    it('non-reactive: conditional reads plain item data that changes across renders', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template:
          '{#each item in getItems}{#if item.active}<span>ON:{item.name}</span>{else}<span>OFF:{item.name}</span>{/if}{/each}',
        defaultState: { version: 0 },
        createComponent: ({ state }) => ({
          getItems: () => {
            const v = state.version.get();
            return [
              { name: 'A', active: v > 0 },
              { name: 'B', active: v === 0 },
            ];
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('OFF:A');
      expect(shadowText(el)).toContain('ON:B');

      el.template.state.version.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('ON:A');
      expect(shadowText(el)).toContain('OFF:B');
    });
  });

  /*******************************
   each → snippet → expression
*******************************/

  describe('each → snippet → expression', () => {
    it('reactive: snippet expression updates when signal changes', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template:
          '{#snippet card}<span>{label}:{suffix}</span>{/snippet}{#each item in items}{>card label=item.name}{/each}',
        defaultState: { suffix: 'v1' },
        createComponent: () => ({
          items: [{ name: 'Card1' }, { name: 'Card2' }],
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('Card1:v1');
      expect(shadowText(el)).toContain('Card2:v1');

      el.template.state.suffix.set('v2');
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('Card1:v2');
      expect(shadowText(el)).toContain('Card2:v2');
      expect(shadowText(el)).not.toContain('v1');
    });

    it('non-reactive: snippet data updates when parent returns new objects', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#snippet row}<span>[{text}]</span>{/snippet}{#each item in getItems}{>row text=item.label}{/each}',
        defaultState: { version: 0 },
        createComponent: ({ state }) => ({
          getItems: () => {
            const v = state.version.get();
            return [
              { label: v === 0 ? 'alpha' : 'ALPHA' },
              { label: v === 0 ? 'beta' : 'BETA' },
            ];
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('[alpha]');
      expect(shadowText(el)).toContain('[beta]');

      el.template.state.version.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('[ALPHA]');
      expect(shadowText(el)).toContain('[BETA]');
      expect(shadowText(el)).not.toContain('alpha');
    });
  });

  /*******************************
   each → async → expression
*******************************/

  describe('each → async → expression', () => {
    it('reactive: async block re-executes when signal changes', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template:
          '{#each item in items}{#async fetchLabel as result}<span>{result}</span>{loading}<span>...</span>{/async}{/each}',
        defaultState: { prefix: 'v1' },
        createComponent: ({ state }) => ({
          items: [{ id: 1 }, { id: 2 }],
          async fetchLabel(p = state.prefix.get()) {
            await new Promise(r => setTimeout(r, 50));
            return `${p}-done`;
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      // Wait for async resolution
      await new Promise(r => setTimeout(r, 100));
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('v1-done');

      el.template.state.prefix.set('v2');
      await waitForUpdate(el);

      // Wait for new async resolution
      await new Promise(r => setTimeout(r, 100));
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('v2-done');
      expect(shadowText(el)).not.toContain('v1-done');
    });

    it('non-reactive: async receives new item data when parent returns new objects', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template:
          '{#each item in getItems}{#async formatItem as result}<span>{result}</span>{loading}<span>...</span>{/async}{/each}',
        defaultState: { version: 0 },
        createComponent: ({ state }) => ({
          getItems: () => {
            const v = state.version.get();
            return [
              { name: v === 0 ? 'old-A' : 'new-A' },
              { name: v === 0 ? 'old-B' : 'new-B' },
            ];
          },
          async formatItem(v = state.version.get()) {
            await new Promise(r => setTimeout(r, 50));
            return v === 0 ? 'old-result' : 'new-result';
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      await new Promise(r => setTimeout(r, 100));
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('old-result');

      el.template.state.version.set(1);
      await waitForUpdate(el);

      await new Promise(r => setTimeout(r, 100));
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('new-result');
      expect(shadowText(el)).not.toContain('old-result');
    });
  });

  /*******************************
   each → each → expression
*******************************/

  describe('each → each → expression', () => {
    it('reactive: inner each expression updates when signal changes', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#each group in groups}{#each item in group.items}<span>{item}:{mode}</span>{/each}{/each}',
        defaultState: { mode: 'light' },
        createComponent: () => ({
          groups: [
            { items: ['a', 'b'] },
            { items: ['c'] },
          ],
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('a:light');
      expect(shadowText(el)).toContain('b:light');
      expect(shadowText(el)).toContain('c:light');

      el.template.state.mode.set('dark');
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('a:dark');
      expect(shadowText(el)).toContain('b:dark');
      expect(shadowText(el)).toContain('c:dark');
      expect(shadowText(el)).not.toContain('light');
    });

    it('non-reactive: nested each updates when parent returns new objects', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template:
          '{#each group, gi in getGroups}{#each tag in group.tags}<span>{group.name}:{tag}</span>{/each}{/each}',
        defaultState: { version: 0 },
        createComponent: ({ state }) => ({
          getGroups: () => {
            const v = state.version.get();
            return v === 0
              ? [
                { name: 'G1', tags: ['x', 'y'] },
                { name: 'G2', tags: ['z'] },
              ]
              : [
                { name: 'G1', tags: ['a', 'b', 'c'] },
                { name: 'G2', tags: ['d'] },
              ];
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('G1:x');
      expect(shadowText(el)).toContain('G1:y');
      expect(shadowText(el)).toContain('G2:z');

      el.template.state.version.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('G1:a');
      expect(shadowText(el)).toContain('G1:b');
      expect(shadowText(el)).toContain('G1:c');
      expect(shadowText(el)).toContain('G2:d');
      expect(shadowText(el)).not.toContain('G1:x');
      expect(shadowText(el)).not.toContain('G2:z');
    });
  });

  /*******************************
   each → rerender → expression
*******************************/

  describe('each → rerender → expression', () => {
    it('reactive: rerender block re-evaluates when key signal changes', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#each item in items}{#rerender tick}<span>{item.name}:{tick}</span>{/rerender}{/each}',
        defaultState: { tick: 0 },
        createComponent: () => ({
          items: [{ name: 'R1' }, { name: 'R2' }],
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('R1:0');
      expect(shadowText(el)).toContain('R2:0');

      el.template.state.tick.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('R1:1');
      expect(shadowText(el)).toContain('R2:1');
      expect(shadowText(el)).not.toContain(':0');
    });

    it('non-reactive: rerender picks up new item data when key changes', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '{#each item in getItems}{#rerender version}<span>{item.name}:{item.color}</span>{/rerender}{/each}',
        defaultState: { version: 0 },
        createComponent: ({ state }) => ({
          getItems: () => {
            const v = state.version.get();
            return [
              { name: 'P', color: v === 0 ? 'red' : 'blue' },
              { name: 'Q', color: v === 0 ? 'green' : 'yellow' },
            ];
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      expect(shadowText(el)).toContain('P:red');
      expect(shadowText(el)).toContain('Q:green');

      el.template.state.version.set(1);
      await waitForUpdate(el);

      expect(shadowText(el)).toContain('P:blue');
      expect(shadowText(el)).toContain('Q:yellow');
      expect(shadowText(el)).not.toContain('red');
      expect(shadowText(el)).not.toContain('green');
    });
  });
}); // RENDERING_ENGINES.forEach
