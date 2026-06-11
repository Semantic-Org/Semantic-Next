// Browser tests for the event-handler `data` param at the Template level:
// the merged-bag contract (data attributes, block scope, event.detail —
// later sources win) and the empty result for targets carrying none of
// the three. Block-layer resolution (each/subtemplate/snippet/async) is
// covered in the renderer suite at
// packages/renderer/test/browser/event-scope-blocks.test.js.

import { afterEach, describe, expect, it } from 'vitest';

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
    describe('event data param', () => {
      it('is a plain empty object when no source contributes', async () => {
        let captured;
        const fixture = await mountTemplate({
          target,
          events: {
            'click .btn'({ data }) {
              captured = data;
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

      it('merges data attributes and event.detail with detail winning', async () => {
        let captured;
        const fixture = await mountTemplate({
          target,
          events: {
            'custom .btn'({ data, value, target: clicked, event }) {
              captured = { data, value, clicked, event };
            },
          },
        });
        fixture.renderRoot.innerHTML = '<button class="btn" data-id="7" data-kind="attr" value="hello">Click</button>';
        try {
          const btn = fixture.renderRoot.querySelector('.btn');
          btn.dispatchEvent(
            new CustomEvent('custom', {
              bubbles: true,
              composed: true,
              detail: { kind: 'detail' },
            }),
          );
          expect(captured.data).toEqual({ id: 7, kind: 'detail' });
          expect(captured.value).toBe('hello');
          expect(captured.clicked).toBe(btn);
          expect(captured.event).toBeInstanceOf(CustomEvent);
        }
        finally {
          fixture.cleanup();
        }
      });
    });
  });
});

describe('event data param — non-delegated dialects', () => {
  it('resolves to an empty object for naked-selector host events', async () => {
    let captured;
    const fixture = await mountTemplate({
      events: {
        'click'({ data }) {
          captured = data;
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
        'global hashchange window'({ data }) {
          captured = data;
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
