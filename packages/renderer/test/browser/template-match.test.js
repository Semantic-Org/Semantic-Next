import { defineComponent } from '@semantic-ui/component';
import { flush } from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach((engine) => {
  describe(`[${engine}] template + match`, () => {
    let tagCounter = 0;
    function uniqueTag(suffix = '') {
      return `rt-tm-${engine}-${suffix}-${++tagCounter}`;
    }
    function shadowText(el) {
      return el.shadowRoot.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim();
    }
    async function settle(el) {
      flush();
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
    }
    async function mount({ template, ...opts }) {
      const tag = uniqueTag(opts.suffix || '');
      defineComponent({ renderingEngine: engine, tagName: tag, template, ...opts });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;
      return el;
    }

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('renders the case matching the discriminant', async () => {
      const el = await mount({
        template:
          `{#match status}{is 'loading'}<span class="a">Wait</span>{is 'done'}<span class="b">Ready</span>{else}<span class="c">Idle</span>{/match}`,
        defaultState: { status: 'done' },
      });
      expect(el.shadowRoot.querySelector('.b')).toBeTruthy();
      expect(el.shadowRoot.querySelectorAll('.a, .c').length).toBe(0);
    });

    it('matches any value in a multi-value case', async () => {
      const el = await mount({
        template:
          `{#match status}{is 'loading' 'pending'}<span class="wait">Wait</span>{else}<span class="done">Done</span>{/match}`,
        defaultState: { status: 'pending' },
      });
      expect(el.shadowRoot.querySelector('.wait')).toBeTruthy();
    });

    it('falls back to else when no case matches', async () => {
      const el = await mount({
        template: `{#match status}{is 'loading'}<span class="a">Wait</span>{else}<span class="z">Idle</span>{/match}`,
        defaultState: { status: 'mystery' },
      });
      expect(el.shadowRoot.querySelector('.z')).toBeTruthy();
    });

    it('renders nothing when no case matches and there is no else', async () => {
      const el = await mount({
        template: `<div class="frame">{#match status}{is 'loading'}<span class="a">Wait</span>{/match}</div>`,
        defaultState: { status: 'other' },
      });
      expect(el.shadowRoot.querySelector('.frame')).toBeTruthy();
      expect(el.shadowRoot.querySelector('.a')).toBeFalsy();
    });

    it('re-matches reactively when the discriminant changes', async () => {
      const el = await mount({
        template:
          `{#match status}{is 'loading'}<span class="a">Wait</span>{is 'done'}<span class="b">Ready</span>{else}<span class="c">Idle</span>{/match}`,
        defaultState: { status: 'loading' },
      });
      expect(el.shadowRoot.querySelector('.a')).toBeTruthy();

      el.template.state.status.set('done');
      await settle(el);
      expect(el.shadowRoot.querySelector('.b')).toBeTruthy();
      // Prior branch DOM must be cleared, not stranded.
      expect(el.shadowRoot.querySelectorAll('.a, .c').length).toBe(0);

      el.template.state.status.set('unknown');
      await settle(el);
      expect(el.shadowRoot.querySelector('.c')).toBeTruthy();
      expect(el.shadowRoot.querySelectorAll('.a, .b').length).toBe(0);
    });

    it('evaluates case values against the data context', async () => {
      const el = await mount({
        template:
          `{#match role}{is adminRole}<span class="admin">Admin</span>{else}<span class="user">User</span>{/match}`,
        defaultState: { role: 'x', adminRole: 'x' },
      });
      expect(el.shadowRoot.querySelector('.admin')).toBeTruthy();

      el.template.state.role.set('y');
      await settle(el);
      expect(el.shadowRoot.querySelector('.user')).toBeTruthy();
    });

    it('matches with loose equality, like the is helper', async () => {
      const el = await mount({
        template: `{#match code}{is '1'}<span class="one">One</span>{else}<span class="other">Other</span>{/match}`,
        defaultState: { code: 1 },
      });
      expect(el.shadowRoot.querySelector('.one')).toBeTruthy();
    });

    it('first matching case wins', async () => {
      const el = await mount({
        template:
          `{#match v}{is 'a'}<span class="first">first</span>{is 'a'}<span class="second">second</span>{/match}`,
        defaultState: { v: 'a' },
      });
      expect(el.shadowRoot.querySelector('.first')).toBeTruthy();
      expect(el.shadowRoot.querySelector('.second')).toBeFalsy();
    });

    it('supports nested match blocks', async () => {
      const el = await mount({
        template:
          `{#match outer}{is 'x'}{#match inner}{is 'y'}<span class="deep">deep</span>{else}<span class="shallow">shallow</span>{/match}{/match}`,
        defaultState: { outer: 'x', inner: 'y' },
      });
      expect(el.shadowRoot.querySelector('.deep')).toBeTruthy();

      el.template.state.inner.set('z');
      await settle(el);
      expect(el.shadowRoot.querySelector('.shallow')).toBeTruthy();
    });

    it('leaves the is helper intact in plain expressions alongside a match', async () => {
      const el = await mount({
        template:
          `<b class="flag">{is mode 'on'}</b>{#match mode}{is 'on'}<span class="lit">lit</span>{else}<span class="dark">dark</span>{/match}`,
        defaultState: { mode: 'on' },
      });
      expect(el.shadowRoot.querySelector('.flag').textContent).toBe('true');
      expect(el.shadowRoot.querySelector('.lit')).toBeTruthy();
    });

    it('{isExactly} matches strictly, distinguishing values that == collapses', async () => {
      const el = await mount({
        template:
          `{#match v}{isExactly ''}<span class="empty">empty</span>{isExactly 0}<span class="zero">zero</span>{else}<span class="other">other</span>{/match}`,
        defaultState: { v: 0 },
      });
      // 0 === '' is false, 0 === 0 is true — strict skips the empty-string case
      expect(el.shadowRoot.querySelector('.zero')).toBeTruthy();
      expect(el.shadowRoot.querySelector('.empty')).toBeFalsy();
    });

    it('{is} collapses falsy values where {isExactly} would not', async () => {
      const el = await mount({
        template: `{#match v}{is ''}<span class="empty">empty</span>{is 0}<span class="zero">zero</span>{/match}`,
        defaultState: { v: 0 },
      });
      // 0 == '' is true — loose matches the empty-string case first
      expect(el.shadowRoot.querySelector('.empty')).toBeTruthy();
    });

    it('{isExactly} separates null from undefined', async () => {
      const el = await mount({
        template:
          `{#match v}{isExactly undefined}<span class="u">undef</span>{isExactly null}<span class="n">null</span>{else}<span class="o">other</span>{/match}`,
        defaultState: { v: null },
      });
      // null === undefined is false, null === null is true
      expect(el.shadowRoot.querySelector('.n')).toBeTruthy();
      expect(el.shadowRoot.querySelector('.u')).toBeFalsy();
    });

    it('mixes {is} and {isExactly} cases in one match', async () => {
      const el = await mount({
        template:
          `{#match v}{is 'loading'}<span class="a">load</span>{isExactly 0}<span class="b">zero</span>{else}<span class="c">other</span>{/match}`,
        defaultState: { v: 0 },
      });
      expect(el.shadowRoot.querySelector('.b')).toBeTruthy();

      el.template.state.v.set('loading');
      await settle(el);
      expect(el.shadowRoot.querySelector('.a')).toBeTruthy();
    });
  });
});
