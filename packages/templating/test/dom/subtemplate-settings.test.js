import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Reaction } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import '@semantic-ui/component'; // registers the native rendering engine

// Documented behaviors under test (see):
//   docs/src/pages/docs/guides/templates/subtemplates.mdx
//     - "Data Reactivity": data passed into subtemplates is reactive by default;
//       individual props give surgical updates per key.
//   docs/src/pages/docs/guides/components/settings.mdx
//     - defaultSettings declares the configurable surface.
//   ai/skills/authoring/component-templating.md
//     - Flat data context lookup order (1=instance, 2=settings, 3=state,
//       4=subtemplate data, 5=helpers).
//   ai/skills/authoring/component-composition.md
//     - "Template-as-Settings": subtemplates are Templates without tagName,
//       declared via subTemplates and rendered with `{> template name=… data=…}`.

let host;
beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
});
afterEach(() => {
  document.body.innerHTML = '';
  Template.renderedTemplates.clear();
});

// Build a parent template attached to `host`. Caller chooses whether to
// initialize() before constructing the child.
function makeParent({ parentSettings, parentElement } = {}) {
  return new Template({
    templateName: 'parent',
    template: '<div></div>',
    element: parentElement || host,
    defaultSettings: parentSettings,
  });
}

// Build a subtemplate child of an existing parent.
function makeChild(parent, { defaultSettings, data, element } = {}) {
  return new Template({
    templateName: 'child',
    template: '<div></div>',
    parentTemplate: parent,
    defaultSettings,
    data,
    element: element || host,
  });
}

describe('Template — subtemplate settings', () => {
  /*******************************
      Declaring settings
  *******************************/

  describe('declaring settings via defaultSettings', () => {
    // A non-subtemplate Template (one with no parentTemplate) does not get a
    // settings proxy — settings on a web component live on the element itself,
    // not on the template. This is implied by define-component.js, which only
    // assigns `defaultSettings` to the template when there's no `tagName`.
    it('non-subtemplate template never receives a settings proxy', () => {
      const tpl = new Template({
        templateName: 'plain',
        template: '<div></div>',
        element: host,
        defaultSettings: { color: 'red' },
      });
      tpl.initialize();
      expect(tpl.settings).toBeUndefined();
    });

    it('subtemplate without defaultSettings has no settings proxy', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent);
      child.initialize();
      expect(child.settings).toBeUndefined();
    });

    it('subtemplate with empty defaultSettings: {} has no settings proxy', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: {} });
      child.initialize();
      expect(child.settings).toBeUndefined();
    });

    it('subtemplate with non-empty defaultSettings exposes a settings object', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();
      expect(child.settings).toBeDefined();
      expect(typeof child.settings).toBe('object');
    });
  });

  /*******************************
      Initial values: defaults + passed data
  *******************************/

  // Subtemplates receive their data context from the parent template via
  // shorthand props (`{> row row=row}`), data expressions (`{> row data=…}`),
  // or verbose syntax. Whatever is passed becomes the subtemplate's data.
  describe('initial values from defaults and passed data', () => {
    it('seeds settings from defaultSettings when no data is passed', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { color: 'red', size: 10 },
      });
      child.initialize();
      expect(child.settings.color).toBe('red');
      expect(child.settings.size).toBe(10);
    });

    it('passed data overrides defaults for matching keys', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { color: 'red' },
        data: { color: 'blue' },
      });
      child.initialize();
      expect(child.settings.color).toBe('blue');
    });

    // defaultSettings declares the public surface — undeclared keys aren't
    // promoted to settings. (settings.mdx: "Default settings are specified by
    // passing a defaultSettings object")
    it('data keys not declared in defaultSettings are not surfaced as settings', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { color: 'red' },
        data: { extra: 'ignored' },
      });
      child.initialize();
      expect(child.settings.color).toBe('red');
      expect(child.settings.extra).toBeUndefined();
    });

    it('explicit `undefined` in data preserves the declared default', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { color: 'red' },
        data: { color: undefined },
      });
      child.initialize();
      expect(child.settings.color).toBe('red');
    });
  });

  /*******************************
      Inheritance from the host component
  *******************************/

  // The flat data-context model (component-templating.md "Data Context") gives
  // expressions access to the host component's settings. For subtemplates this
  // means: a key not declared in the subtemplate's own defaultSettings can
  // still resolve against the host element's settings. The
  // subtemplates-reactivity example relies on this — `{company}` reads from
  // the parent component's defaultSettings inside the row subtemplate.
  describe('inheritance from host component settings', () => {
    it('reads own settings when the key is declared in defaultSettings', () => {
      const parent = makeParent();
      parent.initialize();
      host.settings = { brandColor: 'green' };
      const child = makeChild(parent, {
        defaultSettings: { localColor: 'red' },
      });
      child.initialize();
      expect(child.settings.localColor).toBe('red');
    });

    it('falls through to host component settings for undeclared keys', () => {
      const parent = makeParent();
      parent.initialize();
      // simulate the host web component exposing settings on the element
      host.settings = { brandColor: 'green' };
      const child = makeChild(parent, {
        defaultSettings: { localColor: 'red' },
      });
      child.initialize();
      // brandColor is not in the child's defaultSettings — looking it up
      // resolves against the host component's settings.
      expect(child.settings.brandColor).toBe('green');
    });

    it('returns undefined when no own setting and no host fallback exist', () => {
      const parent = makeParent();
      parent.initialize();
      // host.settings is undefined — no fallback target
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();
      expect(child.settings.missing).toBeUndefined();
    });
  });

  /*******************************
      Mutation through settings
  *******************************/

  describe('mutating settings', () => {
    it('updating a setting reflects on subsequent reads', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();

      child.settings.color = 'blue';
      expect(child.settings.color).toBe('blue');
    });
  });

  /*******************************
      Reactivity
  *******************************/

  // subtemplates.mdx → "Data Reactivity": data passed into subtemplates is
  // reactive by default. When the underlying data changes, the subtemplate
  // updates automatically. Reactions are the substrate the renderer uses, so
  // tracking them here proves the renderer will pick up the change.
  describe('reactivity', () => {
    it('reads inside a Reaction re-run when the setting is updated through the proxy', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();

      let observed;
      let runs = 0;
      const reaction = Reaction.create(() => {
        runs++;
        observed = child.settings.color;
      });
      expect(runs).toBe(1);
      expect(observed).toBe('red');

      child.settings.color = 'blue';
      Reaction.flush();
      expect(runs).toBe(2);
      expect(observed).toBe('blue');

      reaction.stop();
    });

    // subtemplates.mdx → "Surgical vs Coarse Updates": "Individual props give
    // you surgical updates — each value is tracked independently. Changing
    // `name` won't cause `age` to re-evaluate."
    it('per-key reactivity — changing one setting does not re-run reactions on other settings', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { name: 'a', age: 1 },
      });
      child.initialize();

      let nameRuns = 0;
      let ageRuns = 0;
      const nameReaction = Reaction.create(() => {
        nameRuns++;
        // read only `name`
        void child.settings.name;
      });
      const ageReaction = Reaction.create(() => {
        ageRuns++;
        void child.settings.age;
      });
      expect(nameRuns).toBe(1);
      expect(ageRuns).toBe(1);

      child.settings.name = 'b';
      Reaction.flush();
      expect(nameRuns).toBe(2);
      expect(ageRuns).toBe(1); // surgical — age reaction did not re-run

      child.settings.age = 2;
      Reaction.flush();
      expect(nameRuns).toBe(2); // surgical — name reaction did not re-run
      expect(ageRuns).toBe(2);

      nameReaction.stop();
      ageReaction.stop();
    });
  });

  /*******************************
      Parent-driven updates
  *******************************/

  // When the parent re-evaluates a subtemplate invocation (e.g. because a
  // signal in `{> row name=user.name}` changed), the renderer pushes a fresh
  // dataContext into the subtemplate via updateSubtemplateSettings. That call
  // must reflect the new parent values into the subtemplate's settings,
  // re-firing reactive readers (i.e. the subtemplate's rendered expressions).
  describe('parent-driven updates (updateSubtemplateSettings)', () => {
    it('updates an existing setting when the new dataContext provides it', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();

      child.updateSubtemplateSettings({ color: 'newvalue' });
      expect(child.settings.color).toBe('newvalue');
    });

    it('ignores dataContext keys that are not declared in defaultSettings', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();

      child.updateSubtemplateSettings({ color: 'blue', extra: 'ignored' });
      expect(child.settings.color).toBe('blue');
      expect(child.settings.extra).toBeUndefined();
    });

    it('leaves the existing value when the dataContext omits a declared key', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();

      child.updateSubtemplateSettings({ unrelated: 1 });
      expect(child.settings.color).toBe('red');
    });

    it('is a graceful no-op when the subtemplate declared no settings', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent); // no defaultSettings
      child.initialize();
      expect(child.settings).toBeUndefined();
      expect(() => child.updateSubtemplateSettings({ x: 1 })).not.toThrow();
    });

    it('a parent-driven update re-runs reactions tracking that setting', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();

      let observed;
      let runs = 0;
      const reaction = Reaction.create(() => {
        runs++;
        observed = child.settings.color;
      });
      expect(runs).toBe(1);
      expect(observed).toBe('red');

      child.updateSubtemplateSettings({ color: 'blue' });
      Reaction.flush();
      expect(runs).toBe(2);
      expect(observed).toBe('blue');

      reaction.stop();
    });
  });
});
