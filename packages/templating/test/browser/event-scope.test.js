// Browser tests for the event-handler `scope` param at the Template level:
// the plain-object contract, lazy resolution, per-dispatch memoization, and
// the empty result for targets under no block scope. Block-layer resolution
// (each/subtemplate/snippet/async) is covered in the renderer suite at
// packages/renderer/test/browser/event-scope-blocks.test.js.

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { Template } from '@semantic-ui/templating';

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
  document.body.innerHTML = '';
});

const RENDER_TARGETS = [
  { name: 'light', target: 'light' },
  { name: 'shadow', target: 'shadow' },
];

async function mountTemplate({
  template = '<div></div>',
  events,
  target = 'shadow',
  ...opts
} = {}) {
  const host = document.createElement('div');
  const renderRoot = target === 'shadow'
    ? host.attachShadow({ mode: 'open' })
    : host;
  document.body.appendChild(host);
  const tpl = new Template({
    template,
    renderingEngine: { renderer: Renderer, serverRenderer: ServerRenderer },
    element: host,
    events,
    ...opts,
  });
  tpl.initialize();
  await tpl.attach(renderRoot);
  return {
    host,
    renderRoot,
    template: tpl,
    cleanup: () => {
      try {
        if (tpl.initialized && !tpl.destroyed) {
          tpl.onDestroyed();
        }
      }
      catch (_) {}
      if (host.parentNode) {
        host.parentNode.removeChild(host);
      }
    },
  };
}

function clickOn(element, init = {}) {
  element.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    }),
  );
}

RENDER_TARGETS.forEach(({ name, target }) => {
  describe(name, () => {
    describe('event scope param', () => {
      it('is a plain empty object for targets under no block scope', async () => {
        let captured;
        const fixture = await mountTemplate({
          target,
          events: {
            'click .btn'({ scope }) {
              captured = scope;
            },
          },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Click</button>';
        try {
          clickOn(fixture.renderRoot.querySelector('.btn'));
          expect(captured).toEqual({});
          expect(Object.getPrototypeOf(captured)).toBe(Object.prototype);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('resolves lazily — handlers that never read scope never resolve it', async () => {
        const fixture = await mountTemplate({
          target,
          events: {
            'click .btn'() {},
          },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Click</button>';
        const spy = vi.spyOn(fixture.template, 'getEventScope');
        try {
          clickOn(fixture.renderRoot.querySelector('.btn'));
          expect(spy).not.toHaveBeenCalled();
        }
        finally {
          fixture.cleanup();
        }
      });

      it('resolves once per dispatch when read repeatedly', async () => {
        let first;
        let second;
        const fixture = await mountTemplate({
          target,
          events: {
            'click .btn'(params) {
              first = params.scope;
              second = params.scope;
            },
          },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Click</button>';
        const spy = vi.spyOn(fixture.template, 'getEventScope');
        try {
          clickOn(fixture.renderRoot.querySelector('.btn'));
          expect(spy).toHaveBeenCalledTimes(1);
          expect(first).toBe(second);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('leaves the existing handler params unchanged alongside scope', async () => {
        let captured;
        const fixture = await mountTemplate({
          target,
          events: {
            'click .btn'({ scope, data, value, target: clicked, event }) {
              captured = { scope, data, value, clicked, event };
            },
          },
        });
        fixture.renderRoot.innerHTML = '<button class="btn" data-id="7" value="hello">Click</button>';
        try {
          const btn = fixture.renderRoot.querySelector('.btn');
          clickOn(btn);
          expect(captured.scope).toEqual({});
          expect(captured.data).toEqual({ id: 7 });
          expect(captured.value).toBe('hello');
          expect(captured.clicked).toBe(btn);
          expect(captured.event).toBeInstanceOf(MouseEvent);
        }
        finally {
          fixture.cleanup();
        }
      });
    });
  });
});

describe('event scope param — non-delegated dialects', () => {
  it('resolves to an empty object for naked-selector host events', async () => {
    let captured;
    const fixture = await mountTemplate({
      events: {
        'click'({ scope }) {
          captured = scope;
        },
      },
    });
    try {
      clickOn(fixture.host);
      expect(captured).toEqual({});
    }
    finally {
      fixture.cleanup();
    }
  });

  it('resolves to an empty object for global events', async () => {
    let captured;
    const fixture = await mountTemplate({
      events: {
        'global hashchange window'({ scope }) {
          captured = scope;
        },
      },
    });
    try {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      expect(captured).toEqual({});
    }
    finally {
      fixture.cleanup();
    }
  });
});
