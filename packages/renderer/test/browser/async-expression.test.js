/*
  Red-team coverage for native async, expression, and raw-text blocks.

  Scope:
    packages/renderer/src/engines/native/blocks/async.js
    packages/renderer/src/engines/native/blocks/expression.js
    packages/renderer/src/engines/native/blocks/raw-text.js

  These hunt for real user-facing contract gaps. Tests assert documented
  behavior from the MCP skill set (component-templating, native-renderer,
  render-pipeline) and the canonical examples.
*/
import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach((engine) => {
  describe(engine, () => {
    let tagCounter = 0;
    function uniqueTag(label = 'async') {
      return `test-${label}-${engine}-${++tagCounter}`;
    }

    function shadowText(el) {
      return el.shadowRoot.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim();
    }

    async function waitForUpdate(el) {
      await el.updated;
    }

    async function sleep(ms) {
      await new Promise(r => setTimeout(r, ms));
    }

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    /*******************************
    Async — destructuring `as {a, b, ...rest}`
    *******************************/

    describe('async destructuring (`as {a, b, ...rest}`)', () => {
      it('should bind destructured fields from the resolved object', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template:
            '{#async fetchUser as {name, email}}<span class="n">{name}</span><span class="e">{email}</span>{/async}',
          createComponent: () => ({
            async fetchUser() {
              await sleep(30);
              return { name: 'Ada', email: 'ada@example.com', extra: 'noise' };
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        await sleep(80);
        await waitForUpdate(el);

        expect(el.shadowRoot.querySelector('.n').textContent).toBe('Ada');
        expect(el.shadowRoot.querySelector('.e').textContent).toBe('ada@example.com');
      });

      it('should expose remaining fields under the `...rest` alias', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template:
            '{#async fetchUser as {name, ...rest}}<span class="n">{name}</span><span class="r">{rest.email}|{rest.age}</span>{/async}',
          createComponent: () => ({
            async fetchUser() {
              await sleep(30);
              return { name: 'Ada', email: 'ada@example.com', age: 42 };
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        await sleep(80);
        await waitForUpdate(el);

        expect(el.shadowRoot.querySelector('.n').textContent).toBe('Ada');
        expect(el.shadowRoot.querySelector('.r').textContent).toBe('ada@example.com|42');
      });
    });

    /*******************************
    Async — `{this}` without `as` alias
    *******************************/

    describe('async with implicit `{this}` (no `as` alias)', () => {
      it('should expose resolved value as `{this}` when `as` is omitted', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '{#async getMessage}<span>{this}</span>{/async}',
          createComponent: () => ({
            async getMessage() {
              await sleep(30);
              return 'Hello';
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        await sleep(80);
        await waitForUpdate(el);

        expect(el.shadowRoot.querySelector('span').textContent).toBe('Hello');
      });

      it('should expose error value as `{this}` when `error` has no alias', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template:
            '{#async getMessage}<span class="ok">ok</span>{error}<span class="err">{this.message}</span>{/async}',
          createComponent: () => ({
            async getMessage() {
              await sleep(30);
              throw new Error('Kaboom');
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        await sleep(80);
        await waitForUpdate(el);

        expect(el.shadowRoot.querySelector('.err').textContent).toBe('Kaboom');
        expect(el.shadowRoot.querySelector('.ok')).toBeNull();
      });
    });

    /*******************************
      Async — re-show in flight
    *******************************/

    // hasResolved && !loadingContent path (async.js lines 68-72).

    describe('async re-fire while in flight, no loadingContent', () => {
      it('should keep last resolved value visible while next promise is pending', async () => {
        const tag = uniqueTag();
        let resolveFn;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          // No {loading} — should fall into the hasResolved fallback path
          template: '{#async fetchValue v as result}<span class="r">{result}</span>{/async}',
          defaultState: { v: 0 },
          createComponent: ({ state }) => ({
            async fetchValue(version = state.v.get()) {
              if (version === 0) { return `v${version}`; }
              // Hold version 1 open so we can observe what's on screen
              await new Promise(r => {
                resolveFn = r;
              });
              return `v${version}`;
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        // Wait for first resolution
        await sleep(30);
        await waitForUpdate(el);
        expect(shadowText(el)).toContain('v0');

        // Kick off a second fetch — held open, no loadingContent. v0 should
        // remain visible since hasResolved=true. Contract from async.js: a
        // re-fire without loadingContent shows the last resolved value
        // instead of an empty region.
        el.template.state.v.set(1);
        await waitForUpdate(el);
        await sleep(20);

        expect(shadowText(el)).toContain('v0');
        expect(shadowText(el)).not.toContain('v1');

        // Now resolve the pending fetch
        resolveFn();
        await sleep(40);
        await waitForUpdate(el);

        expect(shadowText(el)).toContain('v1');
        expect(shadowText(el)).not.toContain('v0');
      });
    });

    /*******************************
    Async — stale promise discarded after rejection
    *******************************/

    describe('async stale promise rejection', () => {
      it('should discard a late rejection from a superseded promise', async () => {
        const tag = uniqueTag();
        let rejectFirst;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template:
            '{#async fetchValue v as result}<span class="ok">{result}</span>{loading}<span>...</span>{error as e}<span class="err">err:{e.message}</span>{/async}',
          defaultState: { v: 0 },
          createComponent: ({ state }) => ({
            async fetchValue(version = state.v.get()) {
              if (version === 0) {
                await new Promise((_, reject) => {
                  rejectFirst = reject;
                });
              }
              await sleep(20);
              return `v${version}`;
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;
        await waitForUpdate(el);

        // Supersede the in-flight first fetch
        el.template.state.v.set(1);
        await waitForUpdate(el);

        // Then reject the stale first fetch — should be ignored
        rejectFirst(new Error('stale-rejection'));
        await sleep(60);
        await waitForUpdate(el);

        const content = shadowText(el);
        expect(content).toContain('v1');
        expect(content).not.toContain('err:stale-rejection');
      });
    });

    /*******************************
    Async — sync throw with no errorContent
    *******************************/

    describe('async sync throw with no error branch', () => {
      it('should propagate the throw when no errorContent is declared', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<header>H</header>{#async syncThrow as r}<span>{r}</span>{/async}<footer>F</footer>',
          createComponent: () => ({
            syncThrow() {
              throw new Error('sync-boom');
            },
          }),
        });

        // shouldRecover gate returns false when errorContent is empty —
        // the throw propagates. el.rendered may never resolve, so we
        // capture on the global error event instead.
        let caught = null;
        const errorHandler = (event) => {
          if (!caught) {
            caught = event.error || new Error(event.message);
          }
          event.preventDefault();
        };
        window.addEventListener('error', errorHandler);

        try {
          const el = document.createElement(tag);
          try {
            document.body.appendChild(el);
          }
          catch (err) {
            caught = caught || err;
          }
          await sleep(100);
        }
        finally {
          window.removeEventListener('error', errorHandler);
        }

        expect(caught).not.toBeNull();
        expect(String(caught)).toMatch(/sync-boom/);
      });
    });

    /*******************************
    Async — promise rejection with no errorContent
    *******************************/

    describe('async rejected promise with no error branch', () => {
      it('should swallow rejection silently when errorContent is empty', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template:
            '<header>H</header>{#async getError as r}<span>r:{r}</span>{loading}<span class="l">L</span>{/async}<footer>F</footer>',
          createComponent: () => ({
            async getError() {
              await sleep(30);
              throw new Error('async-boom');
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        expect(shadowText(el)).toContain('<header>H</header>');
        expect(shadowText(el)).toContain('<span class="l">L</span>');
        expect(shadowText(el)).toContain('<footer>F</footer>');

        await sleep(80);
        await waitForUpdate(el);

        // After rejection: loading content is gone (replaced or cleared) but
        // no error rendering should occur — surrounding HTML survives.
        const html = shadowText(el);
        expect(html).toContain('<header>H</header>');
        expect(html).toContain('<footer>F</footer>');
        expect(html).not.toContain('r:');
      });
    });

    /*******************************
    Async — sync (non-promise) return value
    *******************************/

    describe('async sync return (non-promise)', () => {
      it('should render content immediately when expression returns a non-promise', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template:
            '{#async getValue as value}<span class="v">sync:{value}</span>{loading}<span class="l">L</span>{/async}',
          createComponent: () => ({
            getValue() {
              // No await, returns synchronously
              return 'IMMEDIATE';
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        // The loading content should never appear since the expression
        // returned a non-promise.
        expect(el.shadowRoot.querySelector('.v').textContent).toBe('sync:IMMEDIATE');
        expect(el.shadowRoot.querySelector('.l')).toBeNull();
      });
    });

    /*******************************
    Async — stale resolution after component removal
    *******************************/

    describe('async resolution after component disconnect', () => {
      it('should not throw when a pending promise resolves after the component is removed', async () => {
        const tag = uniqueTag();
        let resolveFn;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '{#async fetchData as r}<span>{r}</span>{loading}<span>...</span>{/async}',
          createComponent: () => ({
            fetchData() {
              return new Promise(r => {
                resolveFn = r;
              });
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        // Remove the element while the promise is still pending
        el.remove();

        // Resolution should not throw — no DOM ops should run on
        // disconnected nodes.
        let thrown = null;
        try {
          resolveFn('post-disconnect');
          await sleep(30);
        }
        catch (err) {
          thrown = err;
        }
        expect(thrown).toBeNull();
      });
    });

    /*******************************
    Async — destructuring on non-object
    *******************************/

    describe('async destructuring with non-object resolution', () => {
      it('should bind destructured fields to undefined when value is a primitive', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '{#async fetchValue as {name}}<span class="n">name={name}</span>{/async}',
          createComponent: () => ({
            async fetchValue() {
              await sleep(20);
              // Primitive — destructuring should not crash, fields are undefined
              return 'just-a-string';
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        await sleep(60);
        await waitForUpdate(el);

        // Documented behavior is unclear — createSuccessDataContext only
        // destructures when isPlainObject(value); otherwise falls back to
        // { this: value }. We assert "no crash, name is empty string"
        // because undefined renders as empty.
        expect(el.shadowRoot.querySelector('.n').textContent).toBe('name=');
      });
    });

    /*******************************
    Expression — `{#html}` with null/undefined and boundary cases
    *******************************/

    describe('expression: unsafeHTML clearing', () => {
      it('should clear previous DOM nodes when unsafe HTML expression becomes null', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div>{#html getContent}</div>',
          defaultState: { mode: 'a' },
          createComponent: ({ state }) => ({
            getContent: () => {
              const m = state.mode.get();
              if (m === 'a') { return '<b>HELLO</b>'; }
              if (m === 'b') { return null; }
              return '<i>WORLD</i>';
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        expect(el.shadowRoot.querySelector('b')).not.toBeNull();

        el.template.state.mode.set('b');
        await waitForUpdate(el);
        expect(el.shadowRoot.querySelector('b')).toBeNull();
        expect(el.shadowRoot.querySelector('i')).toBeNull();

        el.template.state.mode.set('c');
        await waitForUpdate(el);
        expect(el.shadowRoot.querySelector('i')).not.toBeNull();
        expect(el.shadowRoot.querySelector('i').textContent).toBe('WORLD');
      });

      it('should replace previous DOM nodes (not append) when unsafe HTML changes', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div>{#html getContent}</div>',
          defaultState: { mode: 'pair' },
          createComponent: ({ state }) => ({
            getContent: () =>
              state.mode.get() === 'pair'
                ? '<span class="a">A</span><span class="b">B</span>'
                : '<span class="c">C</span>',
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const div = el.shadowRoot.querySelector('div');
        expect(div.querySelectorAll('span').length).toBe(2);

        el.template.state.mode.set('single');
        await waitForUpdate(el);

        expect(div.querySelectorAll('span').length).toBe(1);
        expect(div.querySelector('.c').textContent).toBe('C');
        expect(div.querySelector('.a')).toBeNull();
        expect(div.querySelector('.b')).toBeNull();
      });
    });

    /*******************************
    Expression — text expression with undefined
    *******************************/

    describe('expression: text-position with undefined', () => {
      it('should render empty string when text expression resolves to undefined', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div class="d">[{missing}]</div>',
          // No `missing` in state or settings
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const div = el.shadowRoot.querySelector('.d');
        // Source line in define-block.js: `state.anchor.data = state.compute(state) ?? '';`
        expect(div.textContent).toBe('[]');
      });

      it('should render empty when text expression toggles from a value to undefined', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div class="d">[{value}]</div>',
          defaultState: { value: 'hi' },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        expect(el.shadowRoot.querySelector('.d').textContent).toBe('[hi]');

        el.template.state.value.set(undefined);
        await waitForUpdate(el);
        expect(el.shadowRoot.querySelector('.d').textContent).toBe('[]');

        el.template.state.value.set(0);
        await waitForUpdate(el);
        // 0 should render as "0", not be elided as falsy
        expect(el.shadowRoot.querySelector('.d').textContent).toBe('[0]');

        el.template.state.value.set(false);
        await waitForUpdate(el);
        // false should render as "false"
        expect(el.shadowRoot.querySelector('.d').textContent).toBe('[false]');
      });
    });

    /*******************************
      `{#fn}` literal in text
    *******************************/

    // expression.js compute branch — literalValue uses lookupTokenValue.

    describe('expression: {#fn} literal in text position', () => {
      it('should render a literal function reference as its stringified form (no auto-invoke)', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div class="d">{#fn computeIt}</div>',
          createComponent: () => ({
            computeIt() {
              return 'INVOKED';
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const text = el.shadowRoot.querySelector('.d').textContent;
        // The literal value path skips auto-invoke. The text should be the
        // function's stringification — not "INVOKED" (which would mean
        // the function was called).
        expect(text).not.toBe('INVOKED');
        // Function toString includes 'computeIt' or 'function' or '()'
        expect(text.length).toBeGreaterThan(0);
      });
    });

    /*******************************
    Expression — mixed Lisp + JS syntax (documented in skill)
    *******************************/

    describe('expression: mixed lisp/JS in one expression', () => {
      it('should evaluate a lisp call whose arg is a parenthesized ternary', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: "<div class=\"d\">{concat firstName ' is ' (age >= 18 ? 'adult' : 'minor')}</div>",
          defaultState: { firstName: 'Alice', age: 25 },
          createComponent: () => ({
            concat(...args) {
              return args.join('');
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        expect(el.shadowRoot.querySelector('.d').textContent).toBe('Alice is adult');
      });

      it('should evaluate inline object literal as a lisp argument', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div class="d">{classMap {one: true, two: false, three: isActive}}</div>',
          defaultState: { isActive: true },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        // classMap returns space-joined truthy keys. Documented in
        // component-templating skill: `{classMap {active: isActive, error: hasError}}`.
        // Two truthy keys: 'one' and 'three' — output should be 'one three'.
        expect(el.shadowRoot.querySelector('.d').textContent.trim()).toBe('one three');
      });
    });

    /*******************************
       Raw-text — non-script
    *******************************/

    // <script>, <style>, <textarea>, <title> are the raw-text elements.
    // Only <script> was previously tested.

    describe('raw-text: non-script raw-text elements', () => {
      it('should bind expressions inside <style> with a brace-free body', async () => {
        // Verifies the raw-text scanner treats <style> the same way it
        // treats <script>. Uses brace-free body so the compiler's
        // expression-delimiter scanner doesn't fold the body itself.
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<style>{cssBody}</style>',
          createComponent: () => ({
            cssBody: 'body color red',
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const style = el.shadowRoot.querySelector('style');
        expect(style.textContent).toBe('body color red');
      });

      it('cannot use CSS rule braces inside <style> alongside expressions (compiler conflict)', async () => {
        // FINDING: the template compiler scans for `{` as an expression
        // delimiter without raw-text awareness. CSS rule braces inside
        // <style> get folded into one nonsensical expression. Documented
        // user workaround: use {#html getCSS} to inject the full block, OR
        // restructure to avoid in-style braces.
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<style>.theme { color: {color}; }</style><div class="theme">themed</div>',
          defaultState: { color: 'red' },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const style = el.shadowRoot.querySelector('style');
        // The expectation here documents the buggy behavior so the
        // user-facing failure mode is locked in. The CSS body does NOT
        // render the way an author would expect.
        expect(style.textContent.trim()).not.toBe('.theme { color: red; }');
      });

      it('renders <style>{#html getStyles}</style> content into the style element, not into the next sibling', async () => {
        // Reproduces docs/src/examples/templates/expressions-raw-html style-injection
        // pattern. The rawtext marker must land immediately after </style>, not
        // after subsequent siblings — otherwise raw-text.js walks back from the
        // marker and finds the wrong element to set textContent on.
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<style>{#html getStyles}</style>\n<button class="themed-button">Themed Button</button>',
          createComponent: () => ({
            getStyles: () => '.themed-button { color: red; }',
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const style = el.shadowRoot.querySelector('style');
        const button = el.shadowRoot.querySelector('button.themed-button');
        expect(style.textContent).toContain('.themed-button { color: red; }');
        expect(button.textContent).toBe('Themed Button');
      });

      it('updates <style> textContent reactively when the {#html} source changes', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<style>{#html getStyles}</style>\n<button class="themed-button">x</button>',
          defaultState: { theme: 'red' },
          createComponent: ({ state }) => ({
            getStyles: () => `.themed-button { color: ${state.theme.get()}; }`,
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;
        const style = el.shadowRoot.querySelector('style');
        expect(style.textContent).toContain('color: red');

        el.template.state.theme.set('blue');
        await waitForUpdate(el);
        expect(style.textContent).toContain('color: blue');
      });

      it('should bind expression inside <textarea>', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<textarea>{initial}</textarea>',
          defaultState: { initial: 'first draft' },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const ta = el.shadowRoot.querySelector('textarea');
        expect(ta.textContent).toBe('first draft');

        el.template.state.initial.set('second draft');
        await waitForUpdate(el);
        expect(ta.textContent).toBe('second draft');
      });

      it('renders <script> inside {#each} with dynamic attrs and reactive body, with sibling after (codeplayground shape)', async () => {
        // Mirrors docs/src/components/CodePlayground/CodePlayground.html —
        // {#each file in files}<script type="{file.type}">{file.content}</script>{/each}
        // followed by sibling content. If the raw-text marker lands after the
        // sibling instead of immediately after </script>, the rawText block
        // walks back to the wrong element and the script content ends up
        // elsewhere in the DOM.
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template:
            '<div class="wrap">{#each f in files}<script type="{f.type}">{f.content}</script>{/each}<p class="after">after</p></div>',
          defaultState: {
            files: [
              { type: 'text/css', content: '.a { color: red; }' },
              { type: 'application/json', content: '{"x":1}' },
            ],
          },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const scripts = el.shadowRoot.querySelectorAll('script');
        expect(scripts.length).toBe(2);
        expect(scripts[0].getAttribute('type')).toBe('text/css');
        expect(scripts[0].textContent).toBe('.a { color: red; }');
        expect(scripts[1].getAttribute('type')).toBe('application/json');
        expect(scripts[1].textContent).toBe('{"x":1}');

        const after = el.shadowRoot.querySelector('p.after');
        expect(after.textContent).toBe('after');
        // The script bodies must not leak into the sibling.
        expect(after.textContent).not.toContain('color');
        expect(after.textContent).not.toContain('"x":1');
      });

      it('should bind expression inside <title>', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<title>{pageTitle}</title>',
          defaultState: { pageTitle: 'Hello' },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const title = el.shadowRoot.querySelector('title');
        expect(title.textContent).toBe('Hello');

        el.template.state.pageTitle.set('Goodbye');
        await waitForUpdate(el);
        expect(title.textContent).toBe('Goodbye');
      });
    });

    /*******************************
      Raw-text — block dispatch
    *******************************/

    // renderer.js evaluateRawTextNodes throws when a block has no
    // evaluateText. async.js opts out (line 144-147); each.js defines
    // evaluateText (line 753).

    describe('raw-text: blocks that cannot operate inside raw-text contexts', () => {
      it('should surface an error when {#async} appears inside <script>', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<script>{#async fetcher as r}{r}{/async}</script>',
          createComponent: () => ({
            async fetcher() {
              return 'ok';
            },
          }),
        });

        // The throw happens inside a Reaction callback during render. It
        // propagates to the unhandled error path. Capture via window.error.
        let caught = null;
        const errorHandler = (event) => {
          if (!caught) {
            caught = event.error || new Error(event.message);
          }
          event.preventDefault();
        };
        window.addEventListener('error', errorHandler);

        try {
          const el = document.createElement(tag);
          // Throwing during render means el.rendered may never resolve.
          // Append and let the throw surface, then probe.
          try {
            document.body.appendChild(el);
          }
          catch (err) {
            caught = caught || err;
          }
          // Give the synchronous throw a tick to surface to the global handler.
          await sleep(100);
        }
        finally {
          window.removeEventListener('error', errorHandler);
        }

        // Source: renderer.js evaluateRawTextNodes — throws when a block
        // type has no evaluateText. async.js explicitly omits evaluateText
        // because promise lifecycle can't operate in text-position.
        expect(caught).not.toBeNull();
        expect(String(caught)).toMatch(/async/);
      });

      it('should evaluate {#each} inside <script> via evaluateText (no error)', async () => {
        // each block does define an evaluateText hook (each.js:753) so it
        // works in raw-text context. The output joins each iteration's text.
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<script type="sample/js">{#each item in items}{item};{/each}</script>',
          createComponent: () => ({ items: ['a', 'b', 'c'] }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const script = el.shadowRoot.querySelector('script');
        expect(script.textContent).toBe('a;b;c;');
      });
    });

    /*******************************
        Raw-text — empty case
    *******************************/

    // raw-text.js: `if (!element) { comment.remove(); return; }` —
    // handles malformed raw-text marker placement.

    describe('raw-text: degenerate cases', () => {
      it('FINDING: fully static <style> content with `{` braces does not round-trip', async () => {
        // Compiler scans `{` as expression delimiter without raw-text
        // awareness. Even fully static `<style>.x { ... }</style>` gets
        // treated as `<style>.x ` + expression(' ... ') + `</style>`.
        // Author workaround: use the component `css:` option (preferred)
        // or wrap with `{#html cssString}`.
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<style>.solid { color: red; }</style><div class="probe">ok</div>',
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const style = el.shadowRoot.querySelector('style');
        // Original CSS rule body is NOT preserved as written.
        expect(style.textContent).not.toContain('color: red;');
      });

      it('should treat <textarea> placeholder attribute as a normal attribute, not raw-text', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<textarea placeholder="{ph}">{body}</textarea>',
          defaultState: { ph: 'type here', body: 'initial' },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        const ta = el.shadowRoot.querySelector('textarea');
        expect(ta.getAttribute('placeholder')).toBe('type here');
        expect(ta.textContent).toBe('initial');

        el.template.state.ph.set('updated');
        el.template.state.body.set('new body');
        await waitForUpdate(el);

        expect(ta.getAttribute('placeholder')).toBe('updated');
        expect(ta.textContent).toBe('new body');
      });
    });

    /*******************************
      Async — `{before}` alias
    *******************************/

    // Documented in component-templating skill.

    describe('async: alternative section aliases', () => {
      it('should accept `{before}` as alias for `{loading}`', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '{#async fetchData as r}<span class="ok">{r}</span>{before}<span class="b">Wait</span>{/async}',
          createComponent: () => ({
            async fetchData() {
              await sleep(30);
              return 'Done';
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        expect(el.shadowRoot.querySelector('.b')).not.toBeNull();
        expect(el.shadowRoot.querySelector('.b').textContent).toBe('Wait');

        await sleep(80);
        await waitForUpdate(el);

        expect(el.shadowRoot.querySelector('.ok').textContent).toBe('Done');
        expect(el.shadowRoot.querySelector('.b')).toBeNull();
      });

      it('should accept `{catch as e}` as alias for `{error as e}`', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '{#async failer as r}<span>{r}</span>{catch as e}<span class="c">caught:{e.message}</span>{/async}',
          createComponent: () => ({
            async failer() {
              await sleep(30);
              throw new Error('whoops');
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        await sleep(80);
        await waitForUpdate(el);

        expect(el.shadowRoot.querySelector('.c')).not.toBeNull();
        expect(el.shadowRoot.querySelector('.c').textContent).toBe('caught:whoops');
      });
    });

    /*******************************
     Async — reactive re-execution
    *******************************/

    // Documented: "When a signal used in the async expression changes,
    // the block re-executes the promise automatically."

    describe('async reactive re-execution', () => {
      it('should re-fire promise when an argument signal in the expression changes', async () => {
        const tag = uniqueTag();
        let callCount = 0;
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template:
            '{#async getResults searchTerm as results}<span class="r">{results}</span>{loading}<span>...</span>{/async}',
          defaultState: { searchTerm: 'apple' },
          createComponent: () => ({
            async getResults(term) {
              callCount++;
              await sleep(20);
              return `found:${term}`;
            },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        await sleep(60);
        await waitForUpdate(el);

        expect(el.shadowRoot.querySelector('.r').textContent).toBe('found:apple');
        expect(callCount).toBe(1);

        el.template.state.searchTerm.set('banana');
        await waitForUpdate(el);
        await sleep(60);
        await waitForUpdate(el);

        expect(el.shadowRoot.querySelector('.r').textContent).toBe('found:banana');
        expect(callCount).toBe(2);
      });
    });
  }); // describe(engine)
}); // RENDERING_ENGINES.forEach
