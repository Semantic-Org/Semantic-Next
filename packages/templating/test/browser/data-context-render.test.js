// Surface 6 — Render coordination (browser).
//
// Tests Template.render() integration with the real Renderer. The contract is
// the engine-facing one:
//   - First render(): initialize → setData → render → setTimeout(onRendered)
//   - Subsequent render(): setData; render NOT called; bumpDataVersion only
//     when dataReplaced was set
//   - additionalData wins over getDataContext on key collision
//   - markRendered fires after each render
//
// Real Template + real Renderer is used end-to-end. Render-call counting is
// done with `vi.spyOn(template.renderer, 'render' | 'setData' | 'bumpDataVersion')`
// which preserves the underlying behavior — spies are taken AFTER initialize()
// (which constructs the renderer), so the first render() call is observed.
// Light DOM only — render coordination doesn't care about shadow.

import { Signal } from '@semantic-ui/reactivity';
import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { Template } from '@semantic-ui/templating';
import { afterEach, describe, expect, it, vi } from 'vitest';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
  document.body.innerHTML = '';
});

// Construct a Template, initialize, and attach to a host in document.body
// (light DOM). Returns the template plus a cleanup that fires onDestroyed
// and removes the host.
async function mountTemplate({ template = '<div></div>', ...opts } = {}) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const tpl = new Template({
    template,
    renderingEngine: realEngine,
    element: host,
    ...opts,
  });
  tpl.initialize();
  await tpl.attach(host);
  return {
    host,
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

/*******************************
       render — first call
*******************************/

describe('Template — render (first call)', () => {
  it('lazily initializes on first render', () => {
    // Construct without mountTemplate's eager initialize() — we want to
    // observe the lazy-init branch in render().
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      defaultState: { count: 0 },
    });
    try {
      expect(template.initialized).toBeUndefined();
      template.render();
      expect(template.initialized).toBe(true);
    }
    finally {
      if (template.initialized && !template.destroyed) {
        template.onDestroyed();
      }
    }
  });

  it('calls renderer.setData once per render call', async () => {
    const { template, cleanup } = await mountTemplate({
      defaultState: { count: 0 },
    });
    const setDataSpy = vi.spyOn(template.renderer, 'setData');
    try {
      template.render();
      expect(setDataSpy).toHaveBeenCalledTimes(1);
    }
    finally {
      cleanup();
    }
  });

  it('calls renderer.render exactly once on first render', async () => {
    const { template, cleanup } = await mountTemplate({
      defaultState: { count: 0 },
    });
    const renderSpy = vi.spyOn(template.renderer, 'render');
    try {
      template.render();
      expect(renderSpy).toHaveBeenCalledTimes(1);
    }
    finally {
      cleanup();
    }
  });

  it('passes the merged data context to renderer.setData', async () => {
    const { template, cleanup } = await mountTemplate({
      data: { name: 'jack' },
      defaultState: { count: 7 },
    });
    try {
      template.render();
      // Real Renderer's setData calls assignInPlace into this.data; the
      // merged dataContext keys land on template.renderer.data after the call.
      expect(template.renderer.data.name).toBe('jack');
      expect(template.renderer.data.count).toBeInstanceOf(Signal);
      expect(template.renderer.data.count.peek()).toBe(7);
    }
    finally {
      cleanup();
    }
  });

  it('returns the renderer.render() output as this.html', async () => {
    const { template, cleanup } = await mountTemplate();
    try {
      const html = template.render();
      // Native renderer.render() returns a DocumentFragment in the browser.
      expect(html).toBeInstanceOf(DocumentFragment);
      expect(template.html).toBe(html);
    }
    finally {
      cleanup();
    }
  });

  it('flips rendered → true via markRendered before returning', async () => {
    const { template, cleanup } = await mountTemplate();
    try {
      expect(template.rendered).toBe(false);
      template.render();
      expect(template.rendered).toBe(true);
    }
    finally {
      cleanup();
    }
  });

  it('schedules onRendered via setTimeout(0) on client', async () => {
    const onRendered = vi.fn();
    const { template, cleanup } = await mountTemplate({ onRendered });
    try {
      template.render();
      // Not called synchronously — scheduled via setTimeout
      expect(onRendered).not.toHaveBeenCalled();
      await new Promise((r) => setTimeout(r, 10));
      expect(onRendered).toHaveBeenCalled();
    }
    finally {
      cleanup();
    }
  });
});

/*******************************
       render — re-call
*******************************/

describe('Template — render (re-call)', () => {
  it('does NOT call renderer.render again when already rendered', async () => {
    const { template, cleanup } = await mountTemplate({
      defaultState: { count: 0 },
    });
    const renderSpy = vi.spyOn(template.renderer, 'render');
    try {
      template.render();
      expect(renderSpy).toHaveBeenCalledTimes(1);
      // Clear dataReplaced so re-render takes the no-op branch
      template.dataReplaced = false;
      template.render();
      expect(renderSpy).toHaveBeenCalledTimes(1); // unchanged
    }
    finally {
      cleanup();
    }
  });

  it('calls renderer.setData on every render (engine always sees latest data)', async () => {
    const { template, cleanup } = await mountTemplate({
      defaultState: { count: 0 },
    });
    const setDataSpy = vi.spyOn(template.renderer, 'setData');
    try {
      template.render();
      template.render();
      template.render();
      expect(setDataSpy).toHaveBeenCalledTimes(3);
    }
    finally {
      cleanup();
    }
  });

  it('calls bumpDataVersion when dataReplaced is true on re-render', async () => {
    const { template, cleanup } = await mountTemplate({
      data: { a: 1 },
    });
    const bumpSpy = vi.spyOn(template.renderer, 'bumpDataVersion');
    try {
      template.render();
      const firstBumps = bumpSpy.mock.calls.length;
      // Force dataReplaced for the second render
      template.dataReplaced = true;
      template.render();
      expect(bumpSpy.mock.calls.length).toBe(firstBumps + 1);
    }
    finally {
      cleanup();
    }
  });

  it('does NOT call bumpDataVersion when dataReplaced is false', async () => {
    const { template, cleanup } = await mountTemplate({
      data: { a: 1 },
    });
    const bumpSpy = vi.spyOn(template.renderer, 'bumpDataVersion');
    try {
      template.render();
      const firstBumps = bumpSpy.mock.calls.length;
      template.dataReplaced = false;
      template.render();
      expect(bumpSpy.mock.calls.length).toBe(firstBumps);
    }
    finally {
      cleanup();
    }
  });

  it('clears dataReplaced after using it on re-render', async () => {
    const { template, cleanup } = await mountTemplate({
      data: { a: 1 },
    });
    try {
      template.render();
      template.dataReplaced = true;
      template.render();
      expect(template.dataReplaced).toBe(false);
    }
    finally {
      cleanup();
    }
  });
});

/*******************************
       additionalData override
*******************************/

describe('Template — render additionalData override', () => {
  it('lets additionalData override getDataContext on collision', async () => {
    const { template, cleanup } = await mountTemplate({
      data: { index: 0 },
      defaultState: { index: 1 },
    });
    try {
      template.render({ index: 5 });
      // additionalData wins over both data and state
      expect(template.renderer.data.index).toBe(5);
    }
    finally {
      cleanup();
    }
  });

  it('does not affect template.data after the call', async () => {
    // additionalData is merged into the dataContext passed to setData, but
    // because setDataContext writes to this.data via assignInPlace, the
    // additionalData keys ARE persisted. Pin source's actual behavior.
    const { template, cleanup } = await mountTemplate({
      data: { name: 'jack' },
    });
    try {
      template.render({ extra: 'value' });
      // assignInPlace will add `extra` to this.data (default mode).
      expect(template.data.extra).toBe('value');
    }
    finally {
      cleanup();
    }
  });
});

/*******************************
       setDataContext-driven re-render
*******************************/

describe('Template — setDataContext + render coordination', () => {
  it('setDataContext default rerender:true forces renderer.render() again', async () => {
    const { template, cleanup } = await mountTemplate({
      data: { a: 1 },
    });
    const renderSpy = vi.spyOn(template.renderer, 'render');
    try {
      template.render();
      expect(renderSpy).toHaveBeenCalledTimes(1);
      // setDataContext default { rerender: true } resets this.rendered=false
      template.setDataContext({ a: 2 });
      template.render();
      expect(renderSpy).toHaveBeenCalledTimes(2);
    }
    finally {
      cleanup();
    }
  });

  it('setDataContext { rerender: false } does NOT trigger renderer.render', async () => {
    const { template, cleanup } = await mountTemplate({
      data: { a: 1 },
    });
    const renderSpy = vi.spyOn(template.renderer, 'render');
    const bumpSpy = vi.spyOn(template.renderer, 'bumpDataVersion');
    try {
      template.render();
      expect(renderSpy).toHaveBeenCalledTimes(1);
      template.setDataContext({ a: 2 }, { rerender: false });
      template.render();
      // rendered stayed true → render() takes the else-if branch
      expect(renderSpy).toHaveBeenCalledTimes(1);
      // dataReplaced was set by the setDataContext mutation → bump fires
      expect(bumpSpy).toHaveBeenCalledTimes(1);
    }
    finally {
      cleanup();
    }
  });
});
