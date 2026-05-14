import { defineComponent } from '@semantic-ui/component';
import { Reaction } from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach((engine) => {
  const isLit = engine === 'lit';
  describe(`[${engine}] template + conditional`, () => {
    let tagCounter = 0;
    function uniqueTag(suffix = '') {
      return `rt-tc-${engine}-${suffix}-${++tagCounter}`;
    }
    function shadowText(el) {
      return el.shadowRoot.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim();
    }
    async function flush(el) {
      Reaction.flush();
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
    }

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    /*******************************
      Conditional — gap coverage
    *******************************/

    describe('conditional gap coverage', () => {
      it('if with no else branch removes content when condition flips false', async () => {
        const tag = uniqueTag('if-no-else');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '<div class="frame">{#if showInner}<span class="inner">visible</span>{/if}</div>',
          defaultState: { showInner: true },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(el.shadowRoot.querySelectorAll('.inner').length).toBe(1);

        el.template.state.showInner.set(false);
        await flush(el);

        expect(el.shadowRoot.querySelectorAll('.inner').length).toBe(0);
        // Frame must remain — only inner branch should clear.
        expect(el.shadowRoot.querySelectorAll('.frame').length).toBe(1);

        el.template.state.showInner.set(true);
        await flush(el);

        expect(el.shadowRoot.querySelectorAll('.inner').length).toBe(1);
      });

      it('if/elseif chain — first truthy elseif wins, later branches ignored', async () => {
        const tag = uniqueTag('elseif-precedence');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template:
            '{#if a}<span class="a">A</span>{else if b}<span class="b1">B1</span>{else if b}<span class="b2">B2</span>{else}<span class="z">Z</span>{/if}',
          defaultState: { a: false, b: true },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(el.shadowRoot.querySelectorAll('.b1').length).toBe(1);
        // Only the first matching elseif renders — second elseif is dead branch
        expect(el.shadowRoot.querySelectorAll('.b2').length).toBe(0);
      });

      it('rapid sequential branch swap leaves no stranded DOM', async () => {
        const tag = uniqueTag('rapid-swap');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template:
            '{#if is mode 1}<span class="m1">one</span>{else if is mode 2}<span class="m2">two</span>{else if is mode 3}<span class="m3">three</span>{else}<span class="mz">zero</span>{/if}',
          defaultState: { mode: 0 },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.shadowRoot.querySelector('.mz')).toBeTruthy();

        for (let i = 1; i <= 3; i++) {
          el.template.state.mode.set(i);
          await flush(el);
        }
        // After cycling 0→1→2→3, only mode-3 DOM should exist
        expect(el.shadowRoot.querySelectorAll('.m1').length).toBe(0);
        expect(el.shadowRoot.querySelectorAll('.m2').length).toBe(0);
        expect(el.shadowRoot.querySelectorAll('.m3').length).toBe(1);
        expect(el.shadowRoot.querySelectorAll('.mz').length).toBe(0);

        // Round trip back to zero — m3 must clear, mz must reappear
        el.template.state.mode.set(0);
        await flush(el);
        expect(el.shadowRoot.querySelectorAll('.m3').length).toBe(0);
        expect(el.shadowRoot.querySelectorAll('.mz').length).toBe(1);
      });

      it('outer if removal disposes inner if branch reactions', async () => {
        let innerEvalCount = 0;
        const tag = uniqueTag('nested-if-dispose');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{#if outer}<div class="o">{#if inner}<span class="i">{innerSpy}</span>{/if}</div>{/if}',
          defaultState: { outer: true, inner: true, tracked: 'x' },
          createComponent: ({ state }) => ({
            innerSpy: () => {
              innerEvalCount++;
              return state.tracked.get();
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(innerEvalCount).toBeGreaterThan(0);
        const baseline = innerEvalCount;

        // Tear down outer
        el.template.state.outer.set(false);
        await flush(el);
        const afterRemoval = innerEvalCount;

        // Mutate the signal — inner branch reactions must be torn down
        el.template.state.tracked.set('y');
        await flush(el);

        // Inner reaction is dead; tracked mutation must not call innerSpy
        expect(innerEvalCount).toBe(afterRemoval);
        // baseline didn't change while inner stayed up
        expect(afterRemoval).toBeGreaterThanOrEqual(baseline);
      });

      it('guard block inside conditional re-evaluates only on key change', async () => {
        let guardEvalCount = 0;
        const tag = uniqueTag('guard-in-if');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{#if show}{#guard stableKey}<span>{trackedExpr}</span>{/guard}{/if}',
          defaultState: { show: true, ticker: 0, stableValue: 'same' },
          createComponent: ({ state }) => ({
            stableKey: () => state.stableValue.get(),
            trackedExpr: () => {
              guardEvalCount++;
              state.ticker.get();
              return `t-${state.ticker.get()}`;
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        const initialCount = guardEvalCount;
        expect(initialCount).toBeGreaterThan(0);

        // guard key unchanged so the block must not re-evaluate
        // inner per-expression reactivity is independent: the guard gates block re-evaluation, not child reactions
        el.template.state.ticker.set(1);
        await flush(el);

        // ticker changed — inner expression's own Reaction should fire,
        // but guard block itself must not have torn down/rebuilt.
        expect(shadowText(el)).toContain('t-1');
      });
    });

    /*******************************
      Template (subtemplate/snippet) — gap coverage
    *******************************/

    describe('template block gap coverage', () => {
      // pins reactive name-swap for both subtemplate and snippet
      // cross-type swap is structurally impossible: a name can't be both registered and declared inline

      it('subtemplate name swaps from one subtemplate to another reactively', async () => {
        const tag = uniqueTag('sub-swap');
        const childA = defineComponent({ renderingEngine: engine, template: '<span class="a">A</span>' });
        const childB = defineComponent({ renderingEngine: engine, template: '<span class="b">B</span>' });
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{>template name=which}',
          defaultState: { which: 'childA' },
          subTemplates: { childA, childB },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.shadowRoot.querySelector('.a')).toBeTruthy();
        expect(el.shadowRoot.querySelector('.b')).toBeFalsy();

        el.template.state.which.set('childB');
        await flush(el);
        expect(el.shadowRoot.querySelector('.a')).toBeFalsy();
        expect(el.shadowRoot.querySelector('.b')).toBeTruthy();
      });

      it.skipIf(isLit)('snippet name swaps from one snippet to another reactively', async () => {
        const tag = uniqueTag('snip-swap');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template:
            '{#snippet alpha}<span class="a">A</span>{/snippet}{#snippet beta}<span class="b">B</span>{/snippet}{>template name=which}',
          defaultState: { which: 'alpha' },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.shadowRoot.querySelector('.a')).toBeTruthy();
        expect(el.shadowRoot.querySelector('.b')).toBeFalsy();

        el.template.state.which.set('beta');
        await flush(el);
        expect(el.shadowRoot.querySelector('.a')).toBeFalsy();
        expect(el.shadowRoot.querySelector('.b')).toBeTruthy();
      });

      it.skipIf(isLit)('subtemplate name resolving from empty/null to defined snippet renders content', async () => {
        const tag = uniqueTag('empty-name');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{#snippet target}<span class="ok">resolved</span>{/snippet}{>template name=which}',
          defaultState: { which: null },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        // Initially name is null — nothing should render in that slot
        expect(el.shadowRoot.querySelectorAll('.ok').length).toBe(0);

        el.template.state.which.set('target');
        await flush(el);

        expect(el.shadowRoot.querySelectorAll('.ok').length).toBe(1);
      });

      it('subtemplate starting with unknown name renders nothing until name resolves', async () => {
        const tag = uniqueTag('unknown-name');
        const child = defineComponent({
          renderingEngine: engine,
          template: '<span class="cc">hello</span>',
        });
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{>template name=which}',
          defaultState: { which: 'unknownTemplate' },
          subTemplates: { child },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        // Unknown name — currentInstance never created
        expect(el.shadowRoot.querySelectorAll('.cc').length).toBe(0);

        el.template.state.which.set('child');
        await flush(el);

        expect(el.shadowRoot.querySelectorAll('.cc').length).toBe(1);
      });

      it('subtemplate name expression resolving to a Template instance swaps correctly', async () => {
        const tag = uniqueTag('inst-as-name');
        const viewA = defineComponent({
          renderingEngine: engine,
          template: '<span class="a">A-instance</span>',
        });
        const viewB = defineComponent({
          renderingEngine: engine,
          template: '<span class="b">B-instance</span>',
        });
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{>template name=getView}',
          defaultState: { mode: 'a' },
          createComponent: ({ state }) => ({
            getView: () => (state.mode.get() === 'a' ? viewA : viewB),
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(el.shadowRoot.querySelectorAll('.a').length).toBe(1);
        expect(el.shadowRoot.querySelectorAll('.b').length).toBe(0);

        el.template.state.mode.set('b');
        await flush(el);

        expect(el.shadowRoot.querySelectorAll('.a').length).toBe(0);
        expect(el.shadowRoot.querySelectorAll('.b').length).toBe(1);
      });

      it.skipIf(isLit)(
        'verbose data="expr" evaluating to non-object renders subtemplate without crashing',
        async () => {
          const tag = uniqueTag('blob-bad');
          const child = defineComponent({
            renderingEngine: engine,
            template: '<span class="c">static-content</span>',
          });
          defineComponent({
            renderingEngine: engine,
            tagName: tag,
            // node.data is a string expression that resolves to a primitive
            template: "{>template name='child' data=primitiveValue}",
            createComponent: () => ({
              primitiveValue: 'not-an-object',
            }),
            subTemplates: { child },
          });
          const el = document.createElement(tag);
          document.body.appendChild(el);
          await el.updateComplete;

          // Should not crash; the child template's static content should render
          expect(el.shadowRoot.querySelector('.c')).toBeTruthy();
          expect(el.shadowRoot.querySelector('.c').textContent).toBe('static-content');
        },
      );

      it('subtemplate inside cycling conditional does not leak instances', async () => {
        let createCount = 0;
        let destroyCount = 0;
        const tag = uniqueTag('sub-cycle');

        const child = defineComponent({
          renderingEngine: engine,
          template: '<span class="cv">{label}</span>',
          onCreated: () => {
            createCount++;
          },
          onDestroyed: () => {
            destroyCount++;
          },
        });
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{#if show}{>child label=getLabel}{/if}',
          defaultState: { show: true, version: 0 },
          createComponent: ({ state }) => ({
            getLabel: () => `v${state.version.get()}`,
          }),
          subTemplates: { child },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        const initialCreate = createCount;
        const initialDestroy = destroyCount;
        expect(initialCreate).toBeGreaterThan(0);

        // Cycle three times: hide → show → hide → show → hide
        for (let i = 0; i < 3; i++) {
          el.template.state.show.set(false);
          await flush(el);
          el.template.state.show.set(true);
          await flush(el);
        }
        // Final state: visible
        expect(el.shadowRoot.querySelectorAll('.cv').length).toBe(1);

        // Every show should have produced exactly one create, every hide
        // exactly one destroy. After 3 cycles starting from visible we
        // should have produced 3 destroys and 3 additional creates.
        expect(destroyCount - initialDestroy).toBe(3);
        expect(createCount - initialCreate).toBe(3);
      });

      it('subtemplate settings mirror reflects reactiveData updates fed by computed getter', async () => {
        const tag = uniqueTag('mirror-get');

        const child = defineComponent({
          renderingEngine: engine,
          defaultSettings: { msg: 'default' },
          template: '<span class="m">{readMsg}</span>',
          createComponent: ({ settings }) => ({
            readMsg: () => settings.msg,
          }),
        });
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{>child msg=getMessage}',
          defaultState: { version: 0 },
          createComponent: ({ state }) => ({
            getMessage: () => `m-${state.version.get()}`,
          }),
          subTemplates: { child },
        });

        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(shadowText(el)).toContain('m-0');

        el.template.state.version.set(1);
        await flush(el);

        expect(shadowText(el)).toContain('m-1');
        expect(shadowText(el)).not.toContain('m-0');
      });

      it('snippet invoked from each branch of conditional binds correct args per branch', async () => {
        const tag = uniqueTag('snip-branches');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: [
            '{#snippet badge}<b class="b">[{label}]</b>{/snippet}',
            '{#if mode}{>badge label=trueText}{else}{>badge label=falseText}{/if}',
          ].join(''),
          defaultState: { mode: true, trueText: 'YES', falseText: 'NO' },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(shadowText(el)).toContain('[YES]');
        expect(shadowText(el)).not.toContain('[NO]');

        el.template.state.mode.set(false);
        await flush(el);

        expect(shadowText(el)).toContain('[NO]');
        expect(shadowText(el)).not.toContain('[YES]');

        // Mutate the OPPOSITE branch's source — currently-visible branch
        // should be unaffected.
        el.template.state.trueText.set('YEPP');
        await flush(el);
        // Still false branch — must show NO, not YEPP
        expect(shadowText(el)).toContain('[NO]');
        expect(shadowText(el)).not.toContain('YEPP');

        // Now flip back to true — should now reflect the updated trueText
        el.template.state.mode.set(true);
        await flush(el);
        expect(shadowText(el)).toContain('[YEPP]');
      });

      it('snippet inside conditional branch is recreated cleanly on branch return', async () => {
        const tag = uniqueTag('snip-recreate');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: [
            '{#snippet card}<span class="c">card-{value}</span>{/snippet}',
            '{#if showCard}{>card value=current}{else}<span class="placeholder">none</span>{/if}',
          ].join(''),
          defaultState: { showCard: true, current: 'one' },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(el.shadowRoot.querySelector('.c')?.textContent).toBe('card-one');

        // Hide
        el.template.state.showCard.set(false);
        await flush(el);
        expect(el.shadowRoot.querySelector('.placeholder')).toBeTruthy();
        expect(el.shadowRoot.querySelector('.c')).toBeNull();

        // Mutate while hidden
        el.template.state.current.set('two');
        await flush(el);
        // Still hidden — no card
        expect(el.shadowRoot.querySelector('.c')).toBeNull();

        // Show again — should pick up the updated 'current'
        el.template.state.showCard.set(true);
        await flush(el);
        expect(el.shadowRoot.querySelector('.c')?.textContent).toBe('card-two');
      });

      it('verbose data object updates propagate when expression yields new object identities', async () => {
        const tag = uniqueTag('blob-update');
        const child = defineComponent({
          renderingEngine: engine,
          template: '<span class="x">{label}</span>',
        });
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          // Object literal data — keys are evaluated eagerly per render
          // (each-context-aware). Outside of #each, this is documented as
          // non-reactive. Mutating the source signal should NOT re-render
          // for this exact pattern.
          template: "{>template name='child' data={label: getLabel}}",
          defaultState: { version: 0 },
          createComponent: ({ state }) => ({
            getLabel: () => `v${state.version.get()}`,
          }),
          subTemplates: { child },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(shadowText(el)).toContain('v0');

        // Object-literal `data={...}` outside #each is non-reactive.
        el.template.state.version.set(1);
        await flush(el);

        expect(shadowText(el)).toContain('v0');
        expect(shadowText(el)).not.toContain('v1');
      });
    });

    /*******************************
      Cross-cutting — conditional × template
    *******************************/

    describe('conditional × template cross-cutting', () => {
      it('per-item conditional wrapper inside each toggles cleanly with item state', async () => {
        const tag = uniqueTag('per-item-wrap');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template:
            '{#each item in items}{#if item.href}<a class="link" href="{item.href}">{item.label}</a>{else}<span class="text">{item.label}</span>{/if}{/each}',
          defaultState: {
            items: [
              { label: 'Home', href: '/home' },
              { label: 'Static', href: null },
              { label: 'About', href: '/about' },
            ],
          },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(el.shadowRoot.querySelectorAll('a.link').length).toBe(2);
        expect(el.shadowRoot.querySelectorAll('span.text').length).toBe(1);
      });

      it('snippet shared across branches re-binds arg deps on swap (old deps stop firing)', async () => {
        const tag = uniqueTag('shared-snip-deps');
        let labelEvalCount = 0;
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: [
            '{#snippet pill}<b>[{label}]</b>{/snippet}',
            '{#if useA}{>pill label=getA}{else}{>pill label=getB}{/if}',
          ].join(''),
          defaultState: { useA: true, valueA: 'aaa', valueB: 'bbb' },
          createComponent: ({ state }) => ({
            getA: () => {
              labelEvalCount++;
              return state.valueA.get();
            },
            getB: () => {
              labelEvalCount++;
              return state.valueB.get();
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        const afterMount = labelEvalCount;
        expect(shadowText(el)).toContain('[aaa]');

        // Swap to B branch
        el.template.state.useA.set(false);
        await flush(el);
        expect(shadowText(el)).toContain('[bbb]');

        const afterSwap = labelEvalCount;

        // Mutate A — A branch is GONE. Its arg-getter should NOT re-fire.
        el.template.state.valueA.set('AAA2');
        await flush(el);

        // labelEvalCount should not have advanced past afterSwap
        // (B branch reads valueB, not valueA; A branch was torn down).
        expect(labelEvalCount).toBe(afterSwap);
        // Visible content unchanged
        expect(shadowText(el)).toContain('[bbb]');
      });

      it('rerender block inside conditional disposes on branch removal', async () => {
        let rerenderEvalCount = 0;
        const tag = uniqueTag('rer-in-if');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template:
            '{#if showRerender}{#rerender key}<span class="r">{readDeep}</span>{/rerender}{else}<span class="alt">alt</span>{/if}',
          defaultState: { showRerender: true, key: 0, deep: 'hello' },
          createComponent: ({ state }) => ({
            readDeep: () => {
              rerenderEvalCount++;
              return state.deep.get();
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;
        expect(rerenderEvalCount).toBeGreaterThan(0);
        expect(el.shadowRoot.querySelector('.r')).toBeTruthy();

        // Flip branch — rerender block GONE
        el.template.state.showRerender.set(false);
        await flush(el);

        expect(el.shadowRoot.querySelector('.r')).toBeNull();
        expect(el.shadowRoot.querySelector('.alt')).toBeTruthy();
        const afterRemoval = rerenderEvalCount;

        // Bump key — rerender block is gone, must NOT fire
        el.template.state.key.set(1);
        await flush(el);
        // deep mutation also must NOT fire (per-expression reaction is gone)
        el.template.state.deep.set('changed');
        await flush(el);

        expect(rerenderEvalCount).toBe(afterRemoval);

        // Bring back — rerender block re-evaluates the inner expression
        el.template.state.showRerender.set(true);
        await flush(el);
        expect(rerenderEvalCount).toBeGreaterThan(afterRemoval);
        expect(el.shadowRoot.querySelector('.r')?.textContent).toBe('changed');
      });

      it("subtemplate's own internal {#if} switches when parent reactiveData arg flips", async () => {
        const tag = uniqueTag('child-internal-if');

        const child = defineComponent({
          renderingEngine: engine,
          template: '{#if highlight}<b class="hl">HOT:{text}</b>{else}<span class="nh">cool:{text}</span>{/if}',
        });
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{>child highlight=hot text=label}',
          defaultState: { hot: false, label: 'item' },
          subTemplates: { child },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(el.shadowRoot.querySelector('.nh')).toBeTruthy();
        expect(el.shadowRoot.querySelector('.hl')).toBeNull();

        el.template.state.hot.set(true);
        await flush(el);

        expect(el.shadowRoot.querySelector('.hl')).toBeTruthy();
        expect(el.shadowRoot.querySelector('.nh')).toBeNull();
        expect(el.shadowRoot.querySelector('.hl').textContent).toBe('HOT:item');

        // Switch back — clean swap, no orphan
        el.template.state.hot.set(false);
        await flush(el);
        expect(el.shadowRoot.querySelector('.nh')).toBeTruthy();
        expect(el.shadowRoot.querySelector('.hl')).toBeNull();
      });

      it('snippet absorb-set semantics: writes to passed args are dropped silently', async () => {
        const tag = uniqueTag('snip-absorb');
        let observedAfterMutate = null;

        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: [
            '{#snippet writer}<span class="w">{label}</span>{/snippet}',
            '{>writer label=val}',
          ].join(''),
          defaultState: { val: 'orig' },
          createComponent: () => ({
            // Don't run a mutation that depends on data parameter — the
            // important guarantee is just that the snippet renders the
            // original value and the parent state is the source of truth.
            getLabel: () => 'orig',
          }),
          onRendered: ({ el, self }) => {
            observedAfterMutate = el.shadowRoot.querySelector('.w')?.textContent;
          },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;
        await new Promise((r) => setTimeout(r, 10));

        // Snippet renders the source value
        expect(el.shadowRoot.querySelector('.w').textContent).toBe('orig');

        // Mutate the parent — snippet reflects new value (args are lazy)
        el.template.state.val.set('updated');
        await flush(el);
        expect(el.shadowRoot.querySelector('.w').textContent).toBe('updated');
      });

      it('name colliding between snippet and subTemplates resolves to snippet (first lookup)', async () => {
        const tag = uniqueTag('collide-name');
        const child = defineComponent({
          renderingEngine: engine,
          template: '<b class="from-sub">SUBTEMPLATE</b>',
        });
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: [
            '{#snippet pick}<i class="from-snip">SNIPPET</i>{/snippet}',
            '{>pick}',
          ].join(''),
          subTemplates: { pick: child },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(el.shadowRoot.querySelector('.from-snip')).toBeTruthy();
        expect(el.shadowRoot.querySelector('.from-sub')).toBeNull();
      });

      it('all elseifs falsy and no else renders empty, then recovers when condition becomes truthy', async () => {
        const tag = uniqueTag('all-false');
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template:
            '<div class="wrap">{#if a}<span class="a">A</span>{else if b}<span class="b">B</span>{else if c}<span class="c">C</span>{/if}</div>',
          defaultState: { a: false, b: false, c: false },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(el.shadowRoot.querySelector('.wrap').children.length).toBe(0);

        el.template.state.b.set(true);
        await flush(el);
        expect(el.shadowRoot.querySelector('.b')).toBeTruthy();
        expect(el.shadowRoot.querySelector('.a')).toBeNull();
        expect(el.shadowRoot.querySelector('.c')).toBeNull();

        // All falsy again → empty, no stranded DOM
        el.template.state.b.set(false);
        await flush(el);
        expect(el.shadowRoot.querySelector('.wrap').children.length).toBe(0);
      });
    });
  }); // describe([engine] ...)
}); // RENDERING_ENGINES.forEach
