import { defineComponent } from '@semantic-ui/component';
import { $ } from '@semantic-ui/query';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach(engine => {
  describe(engine, () => {
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
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(shadowText(el)).toContain('val:initial');
        expect(shadowText(el)).toContain('spy:fixed');
        const countAfterRender = spyCount;

        const updated = $(el).onNext('updated');
        el.template.state.target.set('changed');
        await updated;

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
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(shadowText(el)).toContain('val:initial');
        expect(shadowText(el)).toContain('static');
        const countAfterRender = spyCount;

        const updated = $(el).onNext('updated');
        el.template.state.target.set('changed');
        await updated;

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
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(shadowText(el)).toContain('spy:outside');
        expect(shadowText(el)).toContain('Alpha');
        const countAfterRender = spyCount;

        const updated = $(el).onNext('updated');
        el.template.state.version.set(1);
        await updated;

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
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(shadowText(el)).toContain('spy:stable');
        expect(shadowText(el)).toContain('SHOWN');
        const countAfterRender = spyCount;

        const updated = $(el).onNext('updated');
        el.template.state.visible.set(false);
        await updated;

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
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(shadowText(el)).toContain('spy:stable');
        expect(shadowText(el)).toContain('inner:0');
        const countAfterRender = spyCount;

        const updated = $(el).onNext('updated');
        el.template.state.key.set(1);
        await updated;

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
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(shadowText(el)).toContain('A:A1');
        expect(shadowText(el)).toContain('B:B1');
        const countAfterRender = spyItemCount;

        const updated = $(el).onNext('updated');
        el.template.state.versionA.set(1);
        await updated;

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
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(shadowText(el)).toContain('X:ok');
        expect(shadowText(el)).toContain('target:initial');
        const countAfterRender = spyCount;

        const updated = $(el).onNext('updated');
        el.template.state.target.set('changed');
        await updated;

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
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(shadowText(el)).toContain('first-ok');
        expect(shadowText(el)).toContain('second-ok');
        expect(shadowText(el)).toContain('third-ok');
        // 3 items rendered initially = 3 calls
        const countAfterRender = spyTotal;

        const updated = $(el).onNext('updated');
        el.template.state.version.set(1);
        await updated;

        expect(shadowText(el)).toContain('updated-ok');
        // staticSpy reads no signal. Under per-key reactivity (native) it
        // has no dependency that the item-key change would invalidate,
        // so no re-evaluations fire. Under whole-record reactivity (lit)
        // every property access registers itemSignal, so the changed-item
        // notify drives one extra staticSpy call.
        const expectedSpyCount = engine === 'native' ? countAfterRender : countAfterRender + 1;
        expect(spyTotal).toBe(expectedSpyCount);
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
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(shadowText(el)).toContain('sibling:fixed');
        expect(shadowText(el)).toContain('P');
        expect(shadowText(el)).toContain('rerender:0');
        const siblingCountAfterRender = siblingSpyCount;
        const eachCountAfterRender = eachSpyCount;

        const updated = $(el).onNext('updated');
        el.template.state.key.set(1);
        await updated;

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
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(shadowText(el)).toContain('static');
        expect(shadowText(el)).toContain('inside:0');
        const countAfterRender = spyCount;

        const updated = $(el).onNext('updated');
        el.template.state.key.set(1);
        await updated;

        expect(shadowText(el)).toContain('inside:1');
        expect(spyCount).toBe(countAfterRender);
      });
    });
    /*******************************
  8. Verbose data=expression
     Should Re-evaluate ALL
     Subtemplate Expressions
*******************************/

    describe('snippet args per-key granularity', () => {
      // Confirms the snippet path does per-expression isolation. Each
      // expression in a snippet body gets its own Reaction. Markers
      // (which read no signals) never re-fire after initial render —
      // their Reactions track no dependencies. The expression that
      // reads the snippet arg's source signal does fire, propagates
      // the new value, and updates the DOM.
      it('changing one snippet arg does not fire markers in adjacent expressions', async () => {
        let labelEvalCount = 0;
        let statusEvalCount = 0;
        const tag = uniqueTag();

        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: [
            '{#snippet card}',
            '  <span>{markLabel}{label}</span>',
            '  <span>{markStatus}{status}</span>',
            '{/snippet}',
            '{>card label=getLabel status=getStatus}',
          ].join(''),
          defaultState: { labelVal: 'hello', statusVal: 'active' },
          createComponent: ({ state }) => ({
            getLabel: () => state.labelVal.get(),
            getStatus: () => state.statusVal.get(),
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

        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(shadowText(el)).toContain('hello');
        expect(shadowText(el)).toContain('active');
        const labelCountAfterRender = labelEvalCount;
        const statusCountAfterRender = statusEvalCount;

        const updated = $(el).onNext('updated');
        el.template.state.labelVal.set('changed');
        await updated;

        expect(shadowText(el)).toContain('changed');
        expect(shadowText(el)).toContain('active');
        expect(labelEvalCount).toBe(labelCountAfterRender);
        expect(statusEvalCount).toBe(statusCountAfterRender);
      });
    });

    describe('reactiveData per-key granularity', () => {
      // Per-key isolation on reactiveData: changing one field's source
      // should re-evaluate only the binding reading that field. Bindings
      // reading a different field should not re-evaluate.
      it('changing one reactiveData field should not re-evaluate subtemplate expressions that read a different field', async () => {
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
          template: "{> template name='child' reactiveData={label: getLabel, status: getStatus}}",
          subTemplates: { child },
          defaultState: { labelVal: 'hello', statusVal: 'active' },
          createComponent: ({ state }) => ({
            getLabel: () => state.labelVal.get(),
            getStatus: () => state.statusVal.get(),
          }),
        });

        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(shadowText(el)).toContain('hello');
        expect(shadowText(el)).toContain('active');
        const labelCountAfterRender = labelEvalCount;
        const statusCountAfterRender = statusEvalCount;

        // Only labelVal changes. The expectation under fine-grained
        // reactiveData would be: label re-evaluates, status does NOT.
        const updated = $(el).onNext('updated');
        el.template.state.labelVal.set('changed');
        await updated;

        expect(shadowText(el)).toContain('changed');
        expect(shadowText(el)).toContain('active');
        expect(labelEvalCount).toBeGreaterThan(labelCountAfterRender);
        expect(statusEvalCount).toBe(statusCountAfterRender); // the claim under test
      });
    });

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
        await el.updateComplete;

        expect(shadowText(el)).toContain('hello');
        expect(shadowText(el)).toContain('active');
        const labelCountAfterRender = labelEvalCount;
        const statusCountAfterRender = statusEvalCount;

        // change only label — both expressions should re-evaluate
        // because data=expression is a blob (coarse reactivity)
        const updated = $(el).onNext('updated');
        el.component.updateLabel('changed');
        await updated;

        expect(shadowText(el)).toContain('changed');
        expect(shadowText(el)).toContain('active');
        expect(labelEvalCount).toBeGreaterThan(labelCountAfterRender);
        expect(statusEvalCount).toBeGreaterThan(statusCountAfterRender);
      });
    });

    /*******************************
   Per-key isolation across N subtemplates
   (mirrors bench-template-reactivity's
   subtemplate-reactive-data-100 scenario)
*******************************/

    describe('per-key isolation across N subtemplates', () => {
      it('mutating one reactiveData source should not re-fire bindings reading a different reactiveData key', async () => {
        // Mirrors bench-reactivedata in
        // packages/component/bench/tachometer/bench-template-reactivity.js:
        // 100 child subtemplates, each receiving label + status via
        // reactiveData. Mutating labelVal 50 times should re-fire the
        // label-reading binding in each child but NOT the status-reading
        // binding. Per-key isolation is the design promise; the bench is
        // saturated by rAF so wall-clock can't see the win, but the
        // binding-fire counter can.
        let statusBindingFires = 0;
        let labelBindingFires = 0;
        const child = defineComponent({
          renderingEngine: engine,
          template: '<span>{readLabel}</span><span>{readStatus}</span>',
          createComponent: ({ data }) => ({
            readLabel() {
              labelBindingFires++;
              return data.label;
            },
            readStatus() {
              statusBindingFires++;
              return data.status;
            },
          }),
        });
        const tag = uniqueTag();
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: `{#each i in idxs}{>child label=getLabel status=getStatus}{/each}`,
          subTemplates: { child },
          defaultState: { labelVal: 'init' },
          createComponent: ({ state }) => ({
            idxs: Array.from({ length: 100 }, (_, i) => i),
            getLabel: () => state.labelVal.get(),
            getStatus: () => 'static',
          }),
        });
        const el = document.createElement(tag);
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(labelBindingFires).toBe(100);
        expect(statusBindingFires).toBe(100);

        for (let i = 0; i < 50; i++) {
          const updated = $(el).onNext('updated');
          el.template.state.labelVal.set(`v${i}`);
          await updated;
        }

        // Per-key isolation: every labelVal mutation re-fires the 100
        // label bindings. Status bindings should not re-fire — status
        // never changed.
        expect(labelBindingFires).toBe(100 + 50 * 100);
        expect(statusBindingFires).toBe(100);
      });
    });

    /*******************************
   FGR per-key isolation contract
   — full enumeration of the
   per-key isolation contract across
   each adoption site.
*******************************/

    describe('FGR contract: each-block in-place mutation', () => {
      it('mutating one item field via setProperty re-fires only the binding reading that field', async () => {
        // {#each item in items} body has two bindings reading two
        // different fields of the same item. setProperty mutates one
        // field. Per-key isolation: only that field's binding fires.
        let textFires = 0;
        let completedFires = 0;
        const tag = uniqueTag();
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{#each todo in getTodos}<span>{readText todo}</span><span>{readCompleted todo}</span>{/each}',
          createComponent: ({ signal }) => {
            const todos = signal([{ _id: 'a', text: 'first', completed: false }]);
            return {
              todos,
              getTodos: () => todos.get(),
              readText: (todo) => {
                textFires++;
                return todo.text;
              },
              readCompleted: (todo) => {
                completedFires++;
                return String(todo.completed);
              },
              toggle: () => todos.setProperty('a', 'completed', !todos.getItem('a').completed),
            };
          },
        });
        const el = document.createElement(tag);
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(textFires).toBe(1);
        expect(completedFires).toBe(1);

        const updated = $(el).onNext('updated');
        el.component.toggle();
        await updated;

        expect(completedFires).toBe(2);
        expect(textFires).toBe(1);
      });

      it('mutating one item field does NOT re-fire bindings of unaffected sibling items', async () => {
        // Each block has 3 items. setProperty on item 'a'.completed
        // should re-fire only item a's completed-binding. Items b and c
        // should not re-fire any bindings (their data is unchanged).
        const fires = { a: 0, b: 0, c: 0 };
        const tag = uniqueTag();
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{#each todo in getTodos}<span>{readCompleted todo}</span>{/each}',
          createComponent: ({ signal }) => {
            const todos = signal([
              { _id: 'a', completed: false },
              { _id: 'b', completed: false },
              { _id: 'c', completed: false },
            ]);
            return {
              todos,
              getTodos: () => todos.get(),
              readCompleted: (todo) => {
                fires[todo._id]++;
                return String(todo.completed);
              },
              toggleA: () => todos.setProperty('a', 'completed', !todos.getItem('a').completed),
            };
          },
        });
        const el = document.createElement(tag);
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(fires).toEqual({ a: 1, b: 1, c: 1 });

        const updated = $(el).onNext('updated');
        el.component.toggleA();
        await updated;

        expect(fires).toEqual({ a: 2, b: 1, c: 1 });
      });
    });

    describe('FGR contract: subtemplate reactiveData (shorthand syntax)', () => {
      it("mutating one shorthand reactive prop source re-fires only that key's binding", async () => {
        // Mirrors the verbose-syntax test at the it.fails block above,
        // but uses `{>child a=expr b=expr}` shorthand. Same per-key
        // contract — the parser produces the same node.reactiveData
        // shape regardless of syntax, but a separate test pins the
        // shorthand path to the contract.
        let labelFires = 0;
        let statusFires = 0;
        const child = defineComponent({
          renderingEngine: engine,
          template: '<span>{readLabel}</span><span>{readStatus}</span>',
          createComponent: ({ data }) => ({
            readLabel() {
              labelFires++;
              return data.label;
            },
            readStatus() {
              statusFires++;
              return data.status;
            },
          }),
        });
        const tag = uniqueTag();
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{>child label=getLabel status=getStatus}',
          subTemplates: { child },
          defaultState: { labelVal: 'hello', statusVal: 'active' },
          createComponent: ({ state }) => ({
            getLabel: () => state.labelVal.get(),
            getStatus: () => state.statusVal.get(),
          }),
        });
        const el = document.createElement(tag);
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(labelFires).toBe(1);
        expect(statusFires).toBe(1);

        const updated = $(el).onNext('updated');
        el.template.state.labelVal.set('changed');
        await updated;

        expect(labelFires).toBe(2);
        expect(statusFires).toBe(1);
      });
    });

    describe('FGR contract: subtemplate-inside-each composition (bench-todo)', () => {
      it('mutating one item field via setProperty re-fires only the matching subtemplate-binding key', async () => {
        // bench-todo's exact composition: {#each todo in todos}{>todoItem
        // id=todo.id title=todo.title completed=todo.completed}{/each}.
        // setProperty('a', 'completed', true) should re-fire only the
        // completed-reading binding inside item a's todoItem subtemplate.
        // Title and id bindings should not re-fire.
        const fires = { id: 0, title: 0, completed: 0 };
        const todoItem = defineComponent({
          renderingEngine: engine,
          template: '<span>{readId}</span><span>{readTitle}</span><span>{readCompleted}</span>',
          createComponent: ({ data }) => ({
            readId() {
              fires.id++;
              return data.id;
            },
            readTitle() {
              fires.title++;
              return data.title;
            },
            readCompleted() {
              fires.completed++;
              return String(data.completed);
            },
          }),
        });
        const tag = uniqueTag();
        defineComponent({
          renderingEngine: engine,
          tagName: tag,
          template: '{#each todo in getTodos}{>todoItem id=todo._id title=todo.title completed=todo.completed}{/each}',
          subTemplates: { todoItem },
          createComponent: ({ signal }) => {
            const todos = signal([{ _id: 'a', title: 'first', completed: false }]);
            return {
              todos,
              getTodos: () => todos.get(),
              toggle: () => todos.setProperty('a', 'completed', !todos.getItem('a').completed),
            };
          },
        });
        const el = document.createElement(tag);
        const rendered = $(el).onNext('rendered');
        document.body.appendChild(el);
        await rendered;

        expect(fires).toEqual({ id: 1, title: 1, completed: 1 });

        const updated = $(el).onNext('updated');
        el.component.toggle();
        await updated;

        expect(fires.completed).toBe(2);
        expect(fires.id).toBe(1);
        expect(fires.title).toBe(1);
      });
    });
  }); // describe(engine)
}); // RENDERING_ENGINES.forEach
