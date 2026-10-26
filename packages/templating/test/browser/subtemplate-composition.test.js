// Subtemplate composition with real DOM element shapes. The bulk of
// subtemplate-settings semantics is covered in the node test file
// (test/subtemplate-settings.test.js); this file pins cases that need a real
// Element on the parent — primarily the parent-fallback path where
// `parentTemplate.element?.settings` is reached through `this.element` after
// the renderer's setElement(parent.element) wiring.
//
// Subtemplates render into the parent's region rather than their own root, so
// light DOM is the right setup — the parent owns the element and the child
// shares it.

import { flush, reaction } from '@semantic-ui/reactivity';
import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { afterEach, describe, expect, it } from 'vitest';

import { Template } from '../../src/template.js';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
  document.body.innerHTML = '';
});

// Mounts a parent Template attached to a real host element (light DOM) plus a
// child subtemplate that shares the parent's element via the same
// setElement(parent.element) wiring the renderer performs in production.
async function mountSubtemplatePair({
  parentTemplate = '<div></div>',
  childTemplate = '<span></span>',
  parentSettings = {},
  childDefaultSettings,
  childData = {},
} = {}) {
  const host = document.createElement('div');
  document.body.appendChild(host);

  // Settings must land on the host before child.initialize() so the
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
    element: host,
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

// Mounts only a parent Template + host (no child created). Used by tests that
// walk the clone() flow manually.
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
       Parent fallback
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
      expect(fixture.host.settings.brand).toBe('parent-brand');
    }
    finally {
      fixture.cleanup();
    }
  });
});

/*******************************
        Reactivity
*******************************/

describe('Subtemplate settings — reactivity in browser context', () => {
  it('a Reaction reading through the Proxy fires when updateSubtemplateSettings updates the same key', async () => {
    const fixture = await mountSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    let runs = 0;
    let observed;
    let thisReaction;
    try {
      thisReaction = reaction(() => {
        runs++;
        observed = fixture.child.settings.theme;
      });
      expect(runs).toBe(1);
      expect(observed).toBe('light');

      fixture.child.updateSubtemplateSettings({ theme: 'dark' });
      flush();
      expect(runs).toBe(2);
      expect(observed).toBe('dark');
    }
    finally {
      thisReaction?.stop();
      fixture.cleanup();
    }
  });
});

/*******************************
       Production wiring
*******************************/

describe('Subtemplate composition — clone + wire + initialize sequence', () => {
  it('clone → setElement → setParent → initialize completes and settings work end-to-end', async () => {
    // Mount the parent only; carry out the clone sequence for the child
    // manually to mirror the renderer's behavior in production.
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
      expect(child.settings.theme).toBe('dark');
      expect(child.settings.brand).toBe('parent');
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

  it('two independently-cloned children of the same prototype have fresh state and settings signals', async () => {
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

      expect(childA.settings.theme).toBe('red');
      expect(childB.settings.theme).toBe('blue');

      expect(childA.settingsVars).not.toBe(childB.settingsVars);

      expect(childA.state.count).not.toBe(childB.state.count);

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
