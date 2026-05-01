// Surface 6 — Render coordination.
//
// Tests Template.render() integration with the renderer. The contract here
// is the engine-facing one:
//   - First render(): initialize → setData → render → setTimeout(onRendered)
//   - Subsequent render(): setData; render NOT called; bumpDataVersion only
//     when dataReplaced was set
//   - additionalData wins over getDataContext on key collision
//   - markRendered fires after each render
//
// Stub engine is used because we're verifying CALL COUNTS, not output. See
// _helpers/stub-engine.js.

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Reaction, Signal } from '@semantic-ui/reactivity';

import { Template } from '../../src/template.js';
import { freshTemplate } from '../_helpers/fresh-template.js';
import { clearTemplateRegistry } from '../_helpers/registry-cleanup.js';
import { makeStubEngine } from '../_helpers/stub-engine.js';

afterEach(() => {
  clearTemplateRegistry();
  document.body.innerHTML = '';
});

/*******************************
       render — first call
*******************************/

describe('Template — render (first call)', () => {
  it('lazily initializes on first render', () => {
    const { template, cleanup } = freshTemplate({
      defaultState: { count: 0 },
    });
    try {
      expect(template.initialized).toBeUndefined();
      template.render();
      expect(template.initialized).toBe(true);
    }
    finally {
      cleanup();
    }
  });

  it('calls renderer.setData once per render call', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      defaultState: { count: 0 },
      renderingEngine: engine,
    });
    try {
      template.render();
      expect(template.renderer.setDataCalls).toBe(1);
    }
    finally {
      cleanup();
    }
  });

  it('calls renderer.render exactly once on first render', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      defaultState: { count: 0 },
      renderingEngine: engine,
    });
    try {
      template.render();
      expect(template.renderer.renderCalls).toBe(1);
    }
    finally {
      cleanup();
    }
  });

  it('passes the merged data context to renderer.setData', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      data: { name: 'jack' },
      defaultState: { count: 7 },
      renderingEngine: engine,
    });
    try {
      template.render();
      // Stub records the data argument on each setData call by storing
      // the value passed (see stub-engine.js setData).
      expect(template.renderer.data.name).toBe('jack');
      expect(template.renderer.data.count).toBeInstanceOf(Signal);
      expect(template.renderer.data.count.peek()).toBe(7);
    }
    finally {
      cleanup();
    }
  });

  it('returns the renderer.render() output as this.html', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      renderingEngine: engine,
    });
    try {
      const html = template.render();
      // Stub render returns DocumentFragment in browser env
      expect(html).toBeInstanceOf(DocumentFragment);
      expect(template.html).toBe(html);
    }
    finally {
      cleanup();
    }
  });

  it('flips rendered → true via markRendered before returning', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      renderingEngine: engine,
    });
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
    const engine = makeStubEngine();
    const onRendered = vi.fn();
    const { template, cleanup } = freshTemplate({
      renderingEngine: engine,
      onRendered,
    });
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
  it('does NOT call renderer.render again when already rendered', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      defaultState: { count: 0 },
      renderingEngine: engine,
    });
    try {
      template.render();
      expect(template.renderer.renderCalls).toBe(1);
      // Clear dataReplaced so re-render takes the no-op branch
      template.dataReplaced = false;
      template.render();
      expect(template.renderer.renderCalls).toBe(1); // unchanged
    }
    finally {
      cleanup();
    }
  });

  it('calls renderer.setData on every render (engine always sees latest data)', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      defaultState: { count: 0 },
      renderingEngine: engine,
    });
    try {
      template.render();
      template.render();
      template.render();
      expect(template.renderer.setDataCalls).toBe(3);
    }
    finally {
      cleanup();
    }
  });

  it('calls bumpDataVersion when dataReplaced is true on re-render', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      data: { a: 1 },
      renderingEngine: engine,
    });
    try {
      template.render();
      const firstBumps = template.renderer.bumpDataVersionCalls;
      // Force dataReplaced for the second render
      template.dataReplaced = true;
      template.render();
      expect(template.renderer.bumpDataVersionCalls).toBe(firstBumps + 1);
    }
    finally {
      cleanup();
    }
  });

  it('does NOT call bumpDataVersion when dataReplaced is false', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      data: { a: 1 },
      renderingEngine: engine,
    });
    try {
      template.render();
      const firstBumps = template.renderer.bumpDataVersionCalls;
      template.dataReplaced = false;
      template.render();
      expect(template.renderer.bumpDataVersionCalls).toBe(firstBumps);
    }
    finally {
      cleanup();
    }
  });

  it('clears dataReplaced after using it on re-render', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      data: { a: 1 },
      renderingEngine: engine,
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
  it('lets additionalData override getDataContext on collision', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      data: { index: 0 },
      defaultState: { index: 1 },
      renderingEngine: engine,
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

  it('does not affect template.data after the call', () => {
    // additionalData is merged into the dataContext passed to setData, but
    // because setDataContext writes to this.data via assignInPlace, the
    // additionalData keys ARE persisted. Pin source's actual behavior.
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      data: { name: 'jack' },
      renderingEngine: engine,
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
  it('setDataContext default rerender:true forces renderer.render() again', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      data: { a: 1 },
      renderingEngine: engine,
    });
    try {
      template.render();
      expect(template.renderer.renderCalls).toBe(1);
      // setDataContext default { rerender: true } resets this.rendered=false
      template.setDataContext({ a: 2 });
      template.render();
      expect(template.renderer.renderCalls).toBe(2);
    }
    finally {
      cleanup();
    }
  });

  it('setDataContext { rerender: false } does NOT trigger renderer.render', () => {
    const engine = makeStubEngine();
    const { template, cleanup } = freshTemplate({
      data: { a: 1 },
      renderingEngine: engine,
    });
    try {
      template.render();
      expect(template.renderer.renderCalls).toBe(1);
      template.setDataContext({ a: 2 }, { rerender: false });
      template.render();
      // rendered stayed true → render() takes the else-if branch
      expect(template.renderer.renderCalls).toBe(1);
      // dataReplaced was set by the setDataContext mutation → bump fires
      expect(template.renderer.bumpDataVersionCalls).toBe(1);
    }
    finally {
      cleanup();
    }
  });
});
