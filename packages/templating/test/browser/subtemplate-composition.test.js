// Surface 7 (browser) — Subtemplate composition with real DOM element shapes.
//
// The bulk of subtemplate-settings semantics is covered in the node test file
// (`test/subtemplate-settings.test.js`). This file pins the cases that need a
// real Element on the parent — primarily the parent-fallback path where
// `parentTemplate.element?.settings` is reached through `this.element` after
// the renderer's setElement(parent.element) wiring.
//
// Subtemplates don't have their own render root (they render into the parent's
// region), so light DOM is the right setup — the parent has an element, the
// child shares it.

import { Reaction } from '@semantic-ui/reactivity';
import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { afterEach, describe, expect, it } from 'vitest';

import { Template } from '../../src/template.js';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
  document.body.innerHTML = '';
});

// Local helper — mounts a parent Template attached to a real host element
// (light DOM), plus a child subtemplate that shares the parent's element via
// the same setElement(parent.element) wiring the renderer performs in
// production. Returns { host, parent, child, cleanup }.
async function mountSubtemplatePair({
  parentTemplate = '<div></div>',
  childTemplate = '<span></span>',
  parentSettings = {},
  childDefaultSettings,
  childData = {},
} = {}) {
  const host = document.createElement('div');
  document.body.appendChild(host);

  // Parent has a real element with .settings (mimics WebComponentBase shape).
  // Settings must land on the host BEFORE child.initialize() so the
  // subtemplate Proxy captures the reference.
  host.settings = parentSettings;

  const parent = new Template({
    template: parentTemplate,
    renderingEngine: realEngine,
    element: host,
  });
  parent.initialize();
  await parent.attach(host);

  const child = new Template({
    template: childTemplate,
    renderingEngine: realEngine,
    defaultSettings: childDefaultSettings,
    data: childData,
    element: host, // shares parent's element (renderer's setElement wiring)
  });
  child.setParent(parent);
  child.initialize();

  return {
    host,
    parent,
    child,
    cleanup: () => {
      try {
        if (child.initialized && !child.destroyed) {
          child.onDestroyed();
        }
      }
      catch (_) {}
      try {
        if (parent.initialized && !parent.destroyed) {
          parent.onDestroyed();
        }
      }
      catch (_) {}
      host.remove();
    },
  };
}

// Local helper — mounts only a parent Template + host (no child created).
// Used by production-wiring tests that walk the clone() flow manually.
async function mountParent({
  parentTemplate = '<div></div>',
  parentSettings = {},
} = {}) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  host.settings = parentSettings;

  const parent = new Template({
    template: parentTemplate,
    renderingEngine: realEngine,
    element: host,
  });
  parent.initialize();
  await parent.attach(host);

  return {
    host,
    parent,
    cleanup: () => {
      try {
        if (parent.initialized && !parent.destroyed) {
          parent.onDestroyed();
        }
      }
      catch (_) {}
      host.remove();
    },
  };
}

/*******************************
       Parent-fallback (live element)
*******************************/

describe('Subtemplate settings — parent fallback through real element', () => {
  it('reads own settings (no fallback) when key is in defaultSettings', async () => {
    const fixture = await mountSubtemplatePair({
      childDefaultSettings: { ownProp: 'X' },
      parentSettings: { brand: 'parent-brand' },
    });
    try {
      expect(fixture.child.settings.ownProp).toBe('X');
    }
    finally {
      fixture.cleanup();
    }
  });

  it('falls back to parent host element.settings for keys not in defaultSettings', async () => {
    const fixture = await mountSubtemplatePair({
      childDefaultSettings: { ownProp: 'X' },
      parentSettings: { brand: 'parent-brand' },
    });
    try {
      // Own key resolves to defaultSettings; parent key falls through.
      expect(fixture.child.settings.ownProp).toBe('X');
      expect(fixture.child.settings.brand).toBe('parent-brand');
      expect(fixture.child.settings.notInEither).toBeUndefined();
    }
    finally {
      fixture.cleanup();
    }
  });

  it('shadows the parent fallback once an unrelated key is written through the Proxy', async () => {
    const fixture = await mountSubtemplatePair({
      childDefaultSettings: { ownProp: 'X' },
      parentSettings: { brand: 'parent-brand' },
    });
    try {
      expect(fixture.child.settings.brand).toBe('parent-brand');
      fixture.child.settings.brand = 'shadowed';
      expect(fixture.child.settings.brand).toBe('shadowed');
      // Parent settings object is untouched
      expect(fixture.host.settings.brand).toBe('parent-brand');
    }
    finally {
      fixture.cleanup();
    }
  });
});

/*******************************
   Reactivity through the Proxy with real element
*******************************/

describe('Subtemplate settings — reactivity in browser context', () => {
  it('a Reaction reading through the Proxy fires when the same key is updated via updateSubtemplateSettings', async () => {
    const fixture = await mountSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    let runs = 0;
    let observed;
    let reaction;
    try {
      reaction = Reaction.create(() => {
        runs++;
        observed = fixture.child.settings.theme;
      });
      expect(runs).toBe(1);
      expect(observed).toBe('light');

      fixture.child.updateSubtemplateSettings({ theme: 'dark' });
      Reaction.flush();
      expect(runs).toBe(2);
      expect(observed).toBe('dark');
    }
    finally {
      reaction?.stop();
      fixture.cleanup();
    }
  });
});

/*******************************
        Production wiring
*******************************/

describe('Subtemplate composition — production clone+wire+initialize sequence', () => {
  it('clone → setElement(parent.element) → setParent → initialize completes and settings work end-to-end', async () => {
    // Mount the parent only; we'll manually carry out the clone sequence
    // for the child to mirror the renderer's behavior in production.
    const parentFixture = await mountParent({
      parentTemplate: '<div class="region"></div>',
      parentSettings: { brand: 'parent' },
    });

    const proto = new Template({
      template: '<span>{theme}</span>',
      templateName: 'protoChild',
      defaultSettings: { theme: 'light' },
      renderingEngine: realEngine,
    });

    let child;
    try {
      child = proto.clone({
        parentTemplate: parentFixture.parent,
        data: { theme: 'dark' },
      });
      child.setElement(parentFixture.host);
      child.setParent(parentFixture.parent);
      child.initialize();

      expect(child.isSubtemplate()).toBe(true);
      expect(child.settings.theme).toBe('dark'); // data overrides default
      expect(child.settings.brand).toBe('parent'); // parent element fallback
      expect(parentFixture.parent._childTemplates).toContain(child);
    }
    finally {
      try {
        child?.onDestroyed();
      }
      catch (_) {}
      parentFixture.cleanup();
    }
  });

  it('two independently-cloned children of the same prototype have FRESH state and settings signals', async () => {
    const parentFixture = await mountParent({
      parentTemplate: '<div></div>',
      parentSettings: {},
    });

    const proto = new Template({
      template: '<span>{theme}</span>',
      defaultSettings: { theme: 'light' },
      defaultState: { count: 0 },
      renderingEngine: realEngine,
    });

    let childA, childB;
    try {
      childA = proto.clone({
        parentTemplate: parentFixture.parent,
        data: { theme: 'red' },
      });
      childA.setElement(parentFixture.host);
      childA.setParent(parentFixture.parent);
      childA.initialize();

      childB = proto.clone({
        parentTemplate: parentFixture.parent,
        data: { theme: 'blue' },
      });
      childB.setElement(parentFixture.host);
      childB.setParent(parentFixture.parent);
      childB.initialize();

      // settings are independent
      expect(childA.settings.theme).toBe('red');
      expect(childB.settings.theme).toBe('blue');

      // settingsVars Maps are independent objects
      expect(childA.settingsVars).not.toBe(childB.settingsVars);

      // state Signals are independent
      expect(childA.state.count).not.toBe(childB.state.count);

      // Both children appear in parent._childTemplates
      expect(parentFixture.parent._childTemplates).toContain(childA);
      expect(parentFixture.parent._childTemplates).toContain(childB);
    }
    finally {
      try {
        childA?.onDestroyed();
      }
      catch (_) {}
      try {
        childB?.onDestroyed();
      }
      catch (_) {}
      parentFixture.cleanup();
    }
  });
});
