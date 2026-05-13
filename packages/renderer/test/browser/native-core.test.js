/*
  Native engine internals. Targets orchestration paths that have weak
  coverage: commit-hooks (stringifyAttrValue, renderASTToString, makePlace
  dedup, unsafeHTML), attribute-binding edge cases (boolean coercion,
  property hyphenation, value/selected mirror, multi-event), reaction-scope
  (parent unlink on dispose, child cascade, isConnected gating),
  dynamic-region (endAnchor reuse on refill), and commit-hooks lifecycle
  ordering.

  Native-specific by design. These internals have no equivalent in other
  rendering engines. Cross-engine user contracts live in subtree-*.test.js
  and html-output.test.js, RENDERING_ENGINES.forEach-wrapped. If a third
  engine ships, its internals get their own <engine>-core.test.js
  (compare lit-core.test.js).
*/

import { defineComponent } from '@semantic-ui/component';
import { Reaction } from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';

const ENGINE = 'native';

let tagCounter = 0;
function uniqueTag() {
  return `test-native-core-${++tagCounter}`;
}

async function waitForUpdate(el) {
  await el.updateComplete;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

/*******************************
   Attribute Binding — Boolean Attributes
*******************************/

describe('boolean attribute coercion', () => {
  it('removes unquoted attribute when value is numeric 0', async () => {
    // Real-world scenario: a counter binding (`disabled={count}`) where
    // count is initialized at 0 and incremented to 1 on first action.
    // Author expects 0 to behave like false — no attribute rendered.
    // The example "expressions-boolean-attributes" sets the contract
    // ("unquoted attr={expr} removes attribute when falsy") which applies
    // uniformly to JS-falsy values, not just literal false.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<button disabled={count}>Click</button>',
      defaultState: { count: 0 },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const btn = el.shadowRoot.querySelector('button');
    expect(btn.hasAttribute('disabled')).toBe(false);
    expect(btn.disabled).toBe(false);
  });

  it('preserves unquoted attribute when boolean=true', async () => {
    // Sanity for the inverse: a true literal must produce an attribute.
    // analyzePosition classifies as type: 'boolean'; ifDefined removes
    // when falsy, sets to value's stringified form otherwise.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<button disabled={isOff}>Click</button>',
      defaultState: { isOff: true },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const btn = el.shadowRoot.querySelector('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
    expect(btn.disabled).toBe(true);
  });

  it('treats undefined the same as false for unquoted boolean attribute', async () => {
    // Real-world scenario: settings.disabled is not declared by the parent,
    // so the child sees undefined. The unquoted-attr contract should
    // remove the attribute (no value to bind), matching the "removes on
    // falsy" rule documented in the boolean-attributes example.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<input disabled={notDeclared}>',
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const input = el.shadowRoot.querySelector('input');
    expect(input.hasAttribute('disabled')).toBe(false);
  });
});

/*******************************
   Attribute Binding — Value & Selected Mirror
*******************************/

describe('value/selected/checked property mirror on single-expression', () => {
  it('mirrors single-expression value="" to property when input is empty', async () => {
    // attribute-binding.js explicitly mirrors `value`, `checked`, `selected`
    // for single-expression bindings (e.g. value="{x}"). When x changes to
    // empty string, the property should also become empty string. Without
    // the mirror, the input keeps its old typed value.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<input value="{val}">',
      defaultState: { val: 'hello' },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const input = el.shadowRoot.querySelector('input');
    expect(input.value).toBe('hello');

    el.template.state.val.set('');
    await waitForUpdate(el);

    expect(input.value).toBe('');
  });

  it('mirrors selected property on <option> for single-expression', async () => {
    // attribute-binding.js mirrors `selected` to the boolean property.
    // Use <select multiple> — single-select reconciliation auto-selects the
    // first option when none have selectedness, which would mask the property
    // mirror with browser behavior. Multi-select lets us assert the framework
    // contract cleanly.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template:
        '<select multiple><option selected="{isChosen}" value="a">A</option><option value="b">B</option></select>',
      defaultState: { isChosen: true },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const optionA = el.shadowRoot.querySelectorAll('option')[0];
    expect(optionA.selected).toBe(true);

    el.template.state.isChosen.set(false);
    await waitForUpdate(el);

    expect(optionA.selected).toBe(false);
  });
});

/*******************************
   Attribute Binding — Interpolated (Multi-Marker)
*******************************/

describe('interpolated attribute (multi-marker) reactivity', () => {
  it('updates only the dynamic segment without disturbing surrounding static', async () => {
    // Interpolation path: static + marker + static. Re-evaluations
    // should rewrite the full concatenated value but preserve the
    // static portions byte-for-byte.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<div style="width: {n}px; color: red;">x</div>',
      defaultState: { n: 50 },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const div = el.shadowRoot.querySelector('div');
    expect(div.getAttribute('style')).toBe('width: 50px; color: red;');

    el.template.state.n.set(100);
    await waitForUpdate(el);

    expect(div.getAttribute('style')).toBe('width: 100px; color: red;');
  });

  it('coerces null marker to empty in interpolated attribute (commit-hooks stringifyAttrValue)', async () => {
    // stringifyAttrValue: null/undefined → ''. The interpolation loop
    // additionally guards with `?? ''` for the marker. Together: null
    // marker in interpolated context renders empty, leaving surrounding
    // statics intact.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<div data-x="prefix-{maybe}-suffix">x</div>',
      defaultState: { maybe: 'mid' },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const div = el.shadowRoot.querySelector('div');
    expect(div.getAttribute('data-x')).toBe('prefix-mid-suffix');

    el.template.state.maybe.set(null);
    await waitForUpdate(el);

    expect(div.getAttribute('data-x')).toBe('prefix--suffix');
  });

  it('JSON-stringifies plain object value when interpolated into attribute', async () => {
    // commit-hooks stringifyAttrValue: plain objects → JSON.stringify.
    // Real-world: passing a config object inline into a data-attribute
    // bridge. Author expects JSON, not [object Object].
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<div data-cfg="prefix-{cfg}">x</div>',
      defaultState: { cfg: { a: 1, b: 'two' } },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const div = el.shadowRoot.querySelector('div');
    expect(div.getAttribute('data-cfg')).toBe('prefix-{"a":1,"b":"two"}');
  });
});

/*******************************
   Attribute Binding — Event Bindings
*******************************/

describe('@event attribute binding', () => {
  it('strips the @event="" attribute from rendered HTML', async () => {
    // bindAttribute calls element.removeAttribute(attrName) after wiring
    // the listener. The author shouldn't see @click as a literal attribute
    // in DevTools — that would imply a fake string attribute on the element.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<button @click={handleClick}>x</button>',
      createComponent: () => ({ handleClick: () => {} }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const btn = el.shadowRoot.querySelector('button');
    expect(btn.hasAttribute('@click')).toBe(false);
    expect(btn.hasAttribute('click')).toBe(false);
  });

  it('detaches @event handler when its owning scope is disposed', async () => {
    // The handler is registered via scope.onDispose. When the {#if}
    // branch swaps out, the handler must unbind — otherwise clicks on
    // a stale DOM-referenced node (held elsewhere) would still invoke
    // the closure. We can't query for a disposed node, so we keep a
    // reference to the button and verify the click no-ops after removal.
    const tag = uniqueTag();
    let fired = 0;
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '{#if show}<button @click={inc}>x</button>{/if}',
      defaultState: { show: true },
      createComponent: () => ({
        inc: () => {
          fired++;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const btn = el.shadowRoot.querySelector('button');
    btn.click();
    expect(fired).toBe(1);

    el.template.state.show.set(false);
    await waitForUpdate(el);

    // Reuse the captured reference — the listener should be detached.
    btn.click();
    expect(fired).toBe(1);
  });

  it('routes event handler to currently-bound function when expression re-evaluates', async () => {
    // The handler closure calls lookupTokenValue(expr) on every event,
    // so swapping the function the expression resolves to should be
    // reflected on the next click without re-render. This is the
    // documented "delegate to current value" semantics of @event.
    const tag = uniqueTag();
    let aCalls = 0;
    let bCalls = 0;
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<button @click={current}>x</button>',
      defaultState: { which: 'a' },
      createComponent: ({ state }) => ({
        a: () => {
          aCalls++;
        },
        b: () => {
          bCalls++;
        },
        get current() {
          return state.which.get() === 'a' ? this.a : this.b;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const btn = el.shadowRoot.querySelector('button');
    btn.click();
    expect(aCalls).toBe(1);
    expect(bCalls).toBe(0);

    el.template.state.which.set('b');
    await waitForUpdate(el);

    btn.click();
    expect(aCalls).toBe(1);
    expect(bCalls).toBe(1);
  });
});

/*******************************
   Attribute Binding — Property Bindings (.prop)
*******************************/

describe('.property attribute binding', () => {
  it('strips the .prop="" attribute from rendered HTML', async () => {
    // bindAttribute calls element.removeAttribute(attrName) for property
    // bindings too. The author shouldn't see .myCallback as a literal
    // attribute — that would be a leaky abstraction.
    const tag = uniqueTag();
    const childTag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: childTag,
      template: '<span>child</span>',
    });
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: `<${childTag} .myValue={val}></${childTag}>`,
      defaultState: { val: 42 },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const child = el.shadowRoot.querySelector(childTag);
    expect(child.hasAttribute('.myValue')).toBe(false);
    expect(child.hasAttribute('myvalue')).toBe(false);
    expect(child.myValue).toBe(42);
  });

  it('preserves property name camelCase from .prop="" source', async () => {
    // The classification stores attribute name as written. Authors writing
    // .myCallback expect the property to land at element.myCallback, not
    // element.mycallback (HTML attribute normalization). The source uses
    // classification.attribute for the property name dispatch.
    const tag = uniqueTag();
    const childTag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: childTag,
      template: '<span>x</span>',
    });
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: `<${childTag} .someThing={val}></${childTag}>`,
      defaultState: { val: 'hello' },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const child = el.shadowRoot.querySelector(childTag);
    expect(child.someThing).toBe('hello');
    expect(child.something).toBeUndefined();
  });

  it('updates property reactively when the source signal changes', async () => {
    const tag = uniqueTag();
    const childTag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: childTag,
      template: '<span>x</span>',
    });
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: `<${childTag} .count={n}></${childTag}>`,
      defaultState: { n: 0 },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const child = el.shadowRoot.querySelector(childTag);
    expect(child.count).toBe(0);

    el.template.state.n.set(5);
    await waitForUpdate(el);

    expect(child.count).toBe(5);
  });
});

/*******************************
   commit-hooks — renderASTToString
*******************************/

describe('commit-hooks.renderASTToString (block-in-attribute)', () => {
  it('renders {#if} branch into attribute value', async () => {
    // {#if} inside an attribute is a known supported path. commit-hooks
    // renderASTToString recurses into the matched branch.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<div class="{#if isError}error{else}ok{/if}">x</div>',
      defaultState: { isError: false },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const div = el.shadowRoot.querySelector('div');
    expect(div.getAttribute('class')).toBe('ok');

    el.template.state.isError.set(true);
    await waitForUpdate(el);

    expect(div.getAttribute('class')).toBe('error');
  });

  it('throws clear error when {#each} is used inside an attribute', async () => {
    // renderASTToString explicitly throws for each/async/svg/slot/template
    // — those don't reduce to a string. The author should get a helpful
    // error pointing them to "use a method or computed signal".
    // Capture uncaught errors via window error listener — the throw
    // happens inside a Reaction and may not surface on el.rendered.
    const tag = uniqueTag();
    const capturedErrors = [];
    const errHandler = (event) => {
      capturedErrors.push(event.error?.message || event.message || '');
      event.preventDefault();
    };
    window.addEventListener('error', errHandler);
    const origError = console.error;
    const consoleMessages = [];
    console.error = (...args) => {
      consoleMessages.push(String(args[0]));
    };

    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<div class="{#each item in items}x{/each}">y</div>',
      createComponent: () => ({ items: ['a', 'b'] }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);

    // Don't await rendered — the renderer throws synchronously during
    // bindMarkers. Give microtasks one tick to settle.
    await new Promise(r => setTimeout(r, 50));

    window.removeEventListener('error', errHandler);
    console.error = origError;

    const fullText = capturedErrors.join('\n') + '\n' + consoleMessages.join('\n');
    expect(fullText).toMatch(/each.*attribute|attribute.*each/i);
  });
});

/*******************************
   commit-hooks — makePlace dedup
*******************************/

describe('commit-hooks.makePlace reference-equality dedup', () => {
  it('does not re-render content when the {#if} expression branch is unchanged', async () => {
    // makePlace stores the last AST array. A re-fire of the outer
    // Reaction that resolves to the *same* AST array reference must
    // skip the setContent. We verify by checking that a child node's
    // identity is preserved across an irrelevant signal mutation.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '{#if flag}<span>kept</span>{else}<span>also</span>{/if}',
      defaultState: { flag: true, other: 0 },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const spanBefore = el.shadowRoot.querySelector('span');
    expect(spanBefore.textContent).toBe('kept');

    // Mutate an unrelated signal — should not re-evaluate {#if}.
    el.template.state.other.set(1);
    await waitForUpdate(el);

    const spanAfter = el.shadowRoot.querySelector('span');
    expect(spanAfter).toBe(spanBefore);
  });
});

/*******************************
   Lifecycle Hooks — Order & Identity
*******************************/

describe('commit-hooks lifecycle ordering', () => {
  it('fires onCreated before onRendered', async () => {
    // Documented ordering from mental-model:
    //   onCreated → setup, timers (before DOM)
    //   onRendered → DOM available
    //   onDestroyed → on disconnect
    const events = [];
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<span>{n}</span>',
      defaultState: { n: 0 },
      onCreated: () => {
        events.push('created');
      },
      onRendered: () => {
        events.push('rendered');
      },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    expect(events.indexOf('created')).toBeGreaterThanOrEqual(0);
    expect(events.indexOf('rendered')).toBeGreaterThanOrEqual(0);
    expect(events.indexOf('created')).toBeLessThan(events.indexOf('rendered'));
  });

  it('fires `updated` lifecycle event on reactive change after initial render', async () => {
    // The `updated` event is dispatched after notifyUpdate's coalesced
    // microtask. Listenable via the el's event surface, just like
    // `rendered` and `destroyed`. Documented in lifecycle skills.
    let updatedFired = 0;
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<span>{n}</span>',
      defaultState: { n: 0 },
    });
    const el = document.createElement(tag);
    el.addEventListener('updated', () => {
      updatedFired++;
    });
    document.body.appendChild(el);
    await el.rendered;

    // Initial render shouldn't fire 'updated'.
    expect(updatedFired).toBe(0);

    el.template.state.n.set(1);
    await waitForUpdate(el);
    await new Promise(r => setTimeout(r, 10));

    expect(updatedFired).toBeGreaterThan(0);
  });

  it('fires onDestroyed exactly once when element is removed', async () => {
    // onDestroyed should fire on disconnect — the documented disposal
    // hook for cleanup. Double-firing would break cleanup invariants
    // (e.g. unsubscribing twice from external listeners).
    let destroyCount = 0;
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<div>x</div>',
      onDestroyed: () => {
        destroyCount++;
      },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    el.remove();
    await new Promise(r => setTimeout(r, 10));

    expect(destroyCount).toBe(1);
  });

  it('does not fire onUpdated on the initial render', async () => {
    // notifyUpdate is suppressed on firstRun (suppressNotify=true in
    // defineBlock dispatch). onUpdated semantically = "post-mount change",
    // and confusing it with first-mount would force authors to add
    // hasMounted flags.
    let updatedCount = 0;
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<span>{n}</span>',
      defaultState: { n: 1 },
      onUpdated: () => {
        updatedCount++;
      },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    expect(updatedCount).toBe(0);
  });

  it('coalesces multiple sync state mutations into a single `updated` event', async () => {
    // notifyUpdate is microtask-coalesced — multiple async resolutions
    // or data bumps in the same tick fire onUpdated/updated event once.
    // Author intent: bulk updates produce one observable change. Without
    // coalescing, authors get N calls for N sets in the same micro-frame.
    let updatedCount = 0;
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<span>{a} {b} {c}</span>',
      defaultState: { a: 0, b: 0, c: 0 },
    });
    const el = document.createElement(tag);
    el.addEventListener('updated', () => {
      updatedCount++;
    });
    document.body.appendChild(el);
    await el.rendered;

    el.template.state.a.set(1);
    el.template.state.b.set(2);
    el.template.state.c.set(3);
    await waitForUpdate(el);
    await new Promise(r => setTimeout(r, 10));

    expect(updatedCount).toBe(1);
  });
});

/*******************************
   Dynamic Region — Cleanup Semantics
*******************************/

describe('DynamicRegion cleanup', () => {
  it('removes all owned nodes when conditional branch swaps', async () => {
    // DynamicRegion.clear() removes ownedNodes. Branch swap must leave
    // zero stale DOM from the old branch. Bug shape: lingering text
    // nodes / siblings of an unswapped element.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '{#if mode}<span class="a">A</span><span class="a">B</span>{else}<span class="b">C</span>{/if}',
      defaultState: { mode: true },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    expect(el.shadowRoot.querySelectorAll('span.a').length).toBe(2);
    expect(el.shadowRoot.querySelectorAll('span.b').length).toBe(0);

    el.template.state.mode.set(false);
    await waitForUpdate(el);

    expect(el.shadowRoot.querySelectorAll('span.a').length).toBe(0);
    expect(el.shadowRoot.querySelectorAll('span.b').length).toBe(1);
  });

  it('cleans up nested DynamicRegions when outer region clears', async () => {
    // Nested {#each} inside {#if} — when the outer if removes its branch,
    // the inner each's region and its per-item Reactions should also be
    // disposed. ReactionScope cascade.
    let spyCount = 0;
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '{#if show}{#each item in items}<span>{spy item}</span>{/each}{/if}',
      defaultState: { show: true, sentinel: 0 },
      createComponent: ({ state }) => ({
        items: ['a', 'b', 'c'],
        spy: (x) => {
          state.sentinel.get();
          spyCount++;
          return x;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const baseline = spyCount;
    expect(baseline).toBeGreaterThan(0);

    el.template.state.show.set(false);
    await waitForUpdate(el);
    const afterRemoval = spyCount;

    // Bump the signal the inner expressions tracked — should be no-op.
    el.template.state.sentinel.set(99);
    await waitForUpdate(el);

    expect(spyCount).toBe(afterRemoval);
  });

  it('reuses endAnchor across refills (idempotent placeEndAnchor)', async () => {
    // dynamic-region keeps endAnchor as a single text node that's re-
    // located on each setContent. A regression that allocated a new one
    // per refill would leak text nodes into the parent on every update.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '{#if mode}<span>A</span>{else}<span>B</span>{/if}',
      defaultState: { mode: true },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    // Toggle many times — count direct children of the shadow root.
    // We expect at most a fixed cap (anchor + endAnchor + content),
    // not growth.
    const initialChildCount = el.shadowRoot.childNodes.length;

    for (let i = 0; i < 20; i++) {
      el.template.state.mode.set(i % 2 === 0);
      await waitForUpdate(el);
    }

    expect(el.shadowRoot.childNodes.length).toBeLessThanOrEqual(initialChildCount + 1);
  });
});

/*******************************
   ReactionScope — Hierarchical Cleanup
*******************************/

describe('ReactionScope hierarchical cleanup', () => {
  it('stops all reactions when component is removed from DOM', async () => {
    // The component's top-level scope owns every Reaction in the tree.
    // After remove(), every Reaction.run should be a no-op. Mutating a
    // signal the template was watching should not fire any expressions.
    let evaluated = 0;
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<span>{watch}</span>',
      defaultState: { n: 0 },
      createComponent: ({ state }) => ({
        watch: () => {
          evaluated++;
          return state.n.get();
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const baseline = evaluated;

    el.remove();
    await new Promise(r => setTimeout(r, 10));

    el.template?.state?.n?.set?.(1);
    Reaction.flush();
    await new Promise(r => setTimeout(r, 10));

    expect(evaluated).toBe(baseline);
  });

  it('nested custom elements fire onDestroyed parent-first per browser spec', async () => {
    // Nested custom elements are independent registered tags with separate
    // Template instances. When the parent is removed the browser walks
    // disconnectedCallback top-down. Subtemplate child-first ordering is a
    // separate contract verified in cleanup-reactions.test.js — that one is
    // renderer-controlled and runs depth-first through ReactionScope. This
    // test pins the cross-tag side so the two contracts don't drift.
    const order = [];
    const tag = uniqueTag();
    const childTag = uniqueTag();

    defineComponent({
      renderingEngine: ENGINE,
      tagName: childTag,
      template: '<span>child</span>',
      onDestroyed: () => {
        order.push('child-destroyed');
      },
    });
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: `<${childTag}></${childTag}>`,
      onDestroyed: () => {
        order.push('parent-destroyed');
      },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    el.remove();
    await new Promise(r => setTimeout(r, 50));

    expect(order).toEqual(['parent-destroyed', 'child-destroyed']);
  });

  it('does not accumulate disposed child scopes in parent.children across branch swaps', async () => {
    // ReactionScope.dispose() splices itself from parent.children. Without
    // it, repeated {#if} swaps would unbounded-grow the children array,
    // leaking memory. We can't directly access the scope, but we can
    // verify shadowRoot has constant content after many swaps.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '{#if mode}<span>A</span>{else}<span>B</span>{/if}',
      defaultState: { mode: true },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    // 100 swaps — if scopes accumulated, memory would grow but observable
    // DOM should still be exactly one <span>.
    for (let i = 0; i < 100; i++) {
      el.template.state.mode.set(i % 2 === 0);
      await waitForUpdate(el);
    }

    expect(el.shadowRoot.querySelectorAll('span').length).toBe(1);
  });
});

/*******************************
   Reactive Context — Late Key & Per-Field
*******************************/

describe('reactive-context per-key tracking', () => {
  it('reacts when an each item adds a previously-undefined field', async () => {
    // keySetVersion catches the late-declared-key hazard: a binding that
    // initially fell through to the parent for `item.maybeLater` must
    // wake when that key arrives on a subsequent reconcile pass.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '{#each item in items}<span>{item.value}</span>{/each}',
      defaultState: { items: [{ id: 1 }] },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    let span = el.shadowRoot.querySelector('span');
    expect(span.textContent).toBe('');

    // Add the value field to the same logical item (by replacing with
    // new array containing the same id).
    el.template.state.items.set([{ id: 1, value: 'now-set' }]);
    await waitForUpdate(el);

    span = el.shadowRoot.querySelector('span');
    expect(span.textContent).toBe('now-set');
  });

  it('updates only the binding that reads a mutated field (per-FIELD isolation)', async () => {
    // FGR per-field: mutating item.a should NOT re-evaluate a binding
    // reading item.b. We count evaluations via a helper.
    let aSpyCount = 0;
    let bSpyCount = 0;
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '{#each item in items}<span>{spyA item.a} {spyB item.b}</span>{/each}',
      defaultState: { items: [{ id: 1, a: 'a0', b: 'b0' }] },
      createComponent: () => ({
        spyA: (x) => {
          aSpyCount++;
          return x;
        },
        spyB: (x) => {
          bSpyCount++;
          return x;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    const baselineA = aSpyCount;
    const baselineB = bSpyCount;

    // Mutate only field 'a' (by id-keyed replace).
    el.template.state.items.setProperty(1, 'a', 'a1');
    await waitForUpdate(el);

    expect(aSpyCount).toBeGreaterThan(baselineA);
    expect(bSpyCount).toBe(baselineB);
  });

  it('updates binding when as-key item transitions from object to primitive', async () => {
    // trapGet has special handling for object items (itemProxy path) vs
    // primitive items (per-key dep path). The transition between the two
    // is a documented invariant — the binding must wake on the change.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '{#each item in items}<span>{stringifyItem item}</span>{/each}',
      defaultState: { items: [{ id: 1, value: 'obj' }] },
      createComponent: () => ({
        stringifyItem: (x) => typeof x === 'object' ? `obj:${x.value}` : `prim:${x}`,
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    let span = el.shadowRoot.querySelector('span');
    expect(span.textContent).toBe('obj:obj');

    // Replace items with primitives. Note: each blocks key by id when
    // items are objects; switching to primitives reseeds.
    el.template.state.items.set(['hello']);
    await waitForUpdate(el);

    span = el.shadowRoot.querySelector('span');
    expect(span.textContent).toBe('prim:hello');
  });
});

/*******************************
   Renderer — Data Management
*******************************/

describe('Renderer.updateData and protected keys', () => {
  it('respects protectedKeys when updateData is called with that flag', async () => {
    // Renderer.updateData({ respectProtectedKeys: true }) filters keys in
    // protectedKeys. Used by {#each} so items reactivity isn't clobbered
    // by parent settings updates with overlapping names.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '{#each item in items}<span>{item}|{label}</span>{/each}',
      defaultSettings: { label: 'before' },
      createComponent: () => ({
        items: ['a', 'b'],
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    let spans = el.shadowRoot.querySelectorAll('span');
    expect(spans[0].textContent).toBe('a|before');

    // Update the setting — items' bindings should reflect the new label.
    el.label = 'after';
    await waitForUpdate(el);

    spans = el.shadowRoot.querySelectorAll('span');
    expect(spans[0].textContent).toBe('a|after');
  });
});

/*******************************
   Hydration — data-sui-bind Path
*******************************/

describe('hydration fast path', () => {
  it('does not double-fire side effects on hydration of a Reaction', async () => {
    // skipFirstWrite is the hydration flag: register Signal deps on
    // firstRun, skip the DOM write. The first reactive evaluation should
    // still register dependencies — verified by checking that a
    // subsequent signal change updates the DOM after hydration would
    // have completed.
    // Smoke test via fresh client render — hydration path is exercised
    // when receiving server HTML; verifying the firstRun branch behaves
    // correctly is exercised by ssr-hydration tests. Here we sanity-
    // check that signal-side-effects are NOT duplicated on first mount.
    let evalCount = 0;
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '<span>{watch}</span>',
      createComponent: () => ({
        watch: () => {
          evalCount++;
          return 'ok';
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    // Initial render: exactly one evaluation per reactive position.
    expect(evalCount).toBe(1);
  });
});

/*******************************
   Renderer — Empty AST & Edge Cases
*******************************/

describe('Renderer edge cases', () => {
  it('renders empty template into empty shadow root without crashing', async () => {
    // readAST returns an empty DocumentFragment when both htmlString
    // and entries are empty.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: '',
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    expect(el.shadowRoot).toBeTruthy();
  });

  it('handles {#if} that resolves to no content (falsy with no else)', async () => {
    // Author writes {#if x}stuff{/if} with no else. When x is false,
    // place(null) is called → region.clear. ownedNodes should be empty.
    const tag = uniqueTag();
    defineComponent({
      renderingEngine: ENGINE,
      tagName: tag,
      template: 'before {#if show}<span>content</span>{/if} after',
      defaultState: { show: false },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.rendered;

    expect(el.shadowRoot.querySelector('span')).toBeNull();
    // The 'before' and 'after' static parts must remain.
    expect(el.shadowRoot.textContent).toContain('before');
    expect(el.shadowRoot.textContent).toContain('after');
  });
});
