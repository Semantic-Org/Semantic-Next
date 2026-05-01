// Surface 7 (browser) — Subtemplate composition with real DOM element shapes.
//
// The bulk of subtemplate-settings semantics is covered in the node test file
// (`test/subtemplate-settings.test.js`). This file pins the cases that need a
// real Element with a real shadowRoot — primarily the parent-fallback path
// where `parentTemplate.element?.settings` is reached through `this.element`
// after the renderer's setElement(parent.element) wiring.
//
// Tests use `mountSubtemplateInShadow` which mirrors the renderer wiring:
//   parent gets host element + shadow root
//   child gets the parent's host as its `.element`
//   child.setParent(parent) + child.initialize()

import { Reaction } from '@semantic-ui/reactivity';
import { afterEach, describe, expect, it } from 'vitest';

import { Template } from '../../src/template.js';
import { mountSubtemplateInShadow, mountTemplateInShadow } from '../_helpers/browser-fixture.js';
import { clearTemplateRegistry } from '../_helpers/registry-cleanup.js';
import { stubEngine } from '../_helpers/stub-engine.js';

afterEach(() => {
  clearTemplateRegistry();
  document.body.innerHTML = '';
});

/*******************************
       Parent-fallback (live element)
*******************************/

describe('Subtemplate settings — parent fallback through real element', () => {
  it('reads own settings (no fallback) when key is in defaultSettings', () => {
    const fixture = mountSubtemplateInShadow({
      childDefaultSettings: { ownProp: 'X' },
    });
    // Attach .settings on the host element so the fallback path captures it.
    fixture.parentHost.settings = { brand: 'parent-brand' };
    try {
      // The child was constructed inside the fixture without yet capturing
      // parent settings — re-init by recreating the Proxy via direct call.
      // (The fixture initialized before settings was attached. For this
      // suite we test against a fresh re-init flow.)
      fixture.child.createSubtemplateSettings();
      expect(fixture.child.settings.ownProp).toBe('X');
    }
    finally {
      fixture.cleanup();
    }
  });

  it('falls back to parent host element.settings for keys not in defaultSettings', () => {
    const fixture = mountSubtemplateInShadow({
      childDefaultSettings: { ownProp: 'X' },
    });
    fixture.parentHost.settings = { brand: 'parent-brand' };
    try {
      fixture.child.createSubtemplateSettings();
      // Own key resolves to defaultSettings; parent key falls through.
      expect(fixture.child.settings.ownProp).toBe('X');
      expect(fixture.child.settings.brand).toBe('parent-brand');
      expect(fixture.child.settings.notInEither).toBeUndefined();
    }
    finally {
      fixture.cleanup();
    }
  });

  it('shadows the parent fallback once an unrelated key is written through the Proxy', () => {
    const fixture = mountSubtemplateInShadow({
      childDefaultSettings: { ownProp: 'X' },
    });
    fixture.parentHost.settings = { brand: 'parent-brand' };
    try {
      fixture.child.createSubtemplateSettings();
      expect(fixture.child.settings.brand).toBe('parent-brand');
      fixture.child.settings.brand = 'shadowed';
      expect(fixture.child.settings.brand).toBe('shadowed');
      // Parent settings object is untouched
      expect(fixture.parentHost.settings.brand).toBe('parent-brand');
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
  it('a Reaction reading through the Proxy fires when the same key is updated via updateSubtemplateSettings', () => {
    const fixture = mountSubtemplateInShadow({
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
  it('clone → setElement(parent.element) → setParent → initialize completes and settings work end-to-end', () => {
    // Mount the parent fixture; we'll manually carry out the clone sequence
    // for the child to mirror the renderer's behavior in production.
    const parentFixture = mountTemplateInShadow({
      template: '<div class="region"></div>',
    });
    parentFixture.host.settings = { brand: 'parent' };

    const proto = new Template({
      template: '<span>{theme}</span>',
      templateName: 'protoChild',
      defaultSettings: { theme: 'light' },
      renderingEngine: stubEngine,
    });

    let child;
    try {
      child = proto.clone({
        parentTemplate: parentFixture.template,
        data: { theme: 'dark' },
      });
      child.setElement(parentFixture.host);
      child.setParent(parentFixture.template);
      child.initialize();

      expect(child.isSubtemplate()).toBe(true);
      expect(child.settings.theme).toBe('dark'); // data overrides default
      expect(child.settings.brand).toBe('parent'); // parent element fallback
      expect(parentFixture.template._childTemplates).toContain(child);
    }
    finally {
      try {
        child?.onDestroyed();
      }
      catch (_) {}
      parentFixture.cleanup();
    }
  });

  it('two independently-cloned children of the same prototype have FRESH state and settings signals', () => {
    const parentFixture = mountTemplateInShadow({
      template: '<div></div>',
    });
    parentFixture.host.settings = {};

    const proto = new Template({
      template: '<span>{theme}</span>',
      defaultSettings: { theme: 'light' },
      defaultState: { count: 0 },
      renderingEngine: stubEngine,
    });

    let childA, childB;
    try {
      childA = proto.clone({
        parentTemplate: parentFixture.template,
        data: { theme: 'red' },
      });
      childA.setElement(parentFixture.host);
      childA.setParent(parentFixture.template);
      childA.initialize();

      childB = proto.clone({
        parentTemplate: parentFixture.template,
        data: { theme: 'blue' },
      });
      childB.setElement(parentFixture.host);
      childB.setParent(parentFixture.template);
      childB.initialize();

      // settings are independent
      expect(childA.settings.theme).toBe('red');
      expect(childB.settings.theme).toBe('blue');

      // settingsVars Maps are independent objects
      expect(childA.settingsVars).not.toBe(childB.settingsVars);

      // state Signals are independent
      expect(childA.state.count).not.toBe(childB.state.count);

      // Both children appear in parent._childTemplates
      expect(parentFixture.template._childTemplates).toContain(childA);
      expect(parentFixture.template._childTemplates).toContain(childB);
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
