// Fresh-Template fixture for Template tests.
//
// Creates a Template with sane defaults (stub engine, simple template string,
// empty options) and returns both the template and a cleanup function. The
// cleanup is critical — Template registers itself in `Template.renderedTemplates`
// when `onCreated` fires, and tests must clear that to avoid bleeding into
// subsequent tests.
//
// Usage:
//   const { template, cleanup } = freshTemplate({ defaultState: { count: 0 } });
//   try {
//     // ... exercise the template ...
//   } finally {
//     cleanup();
//   }
//
// Or with afterEach:
//   let template, cleanup;
//   afterEach(() => cleanup?.());
//   it('...', () => {
//     ({ template, cleanup } = freshTemplate());
//     // ...
//   });

import { Template } from '../../src/template.js';
import { stubEngine } from './stub-engine.js';

const DEFAULT_TEMPLATE_STRING = '<div></div>';

/**
 * Create a fresh Template with stub engine and reasonable defaults.
 *
 * @param {object} [opts]
 * @param {string} [opts.template] - Template string. Default: '<div></div>'
 * @param {object} [opts.defaultState] - defaultState passed to Template
 * @param {object} [opts.defaultSettings] - defaultSettings (subtemplate-style)
 * @param {object} [opts.data] - initial data context
 * @param {Function} [opts.createComponent] - createComponent factory
 * @param {object} [opts.events] - events DSL object
 * @param {object} [opts.keys] - keys binding object
 * @param {object} [opts.subTemplates] - { name: Template }
 * @param {Template} [opts.parentTemplate] - parent (for subtemplate fixtures)
 * @param {Element} [opts.element] - DOM element (browser/jsdom only)
 * @param {Element|ShadowRoot} [opts.renderRoot] - render root (browser only)
 * @param {string} [opts.templateName] - explicit template name
 * @param {Function} [opts.onCreated] - lifecycle hook
 * @param {Function} [opts.onRendered] - lifecycle hook
 * @param {Function} [opts.onDestroyed] - lifecycle hook
 * @param {Function} [opts.onThemeChanged] - lifecycle hook
 * @param {object|string} [opts.renderingEngine] - override stub engine
 * @returns {{ template: Template, cleanup: () => void }}
 */
export function freshTemplate(opts = {}) {
  const {
    template = DEFAULT_TEMPLATE_STRING,
    renderingEngine = stubEngine,
    ...rest
  } = opts;

  const tpl = new Template({
    template,
    renderingEngine,
    ...rest,
  });

  return {
    template: tpl,
    cleanup: () => {
      try {
        if (tpl.initialized && !tpl.destroyed) {
          tpl.onDestroyed();
        }
      }
      catch (e) {
        // teardown order may not be perfectly idempotent in all states;
        // swallow so cleanup always succeeds even if test left things partial
      }
    },
  };
}

/**
 * Create a parent + child pair wired via setParent. The parent has a fake
 * element with a settings object (for subtemplate parent-fallback tests).
 * Returns both Templates and a single cleanup that tears down both.
 *
 * @param {object} [opts]
 * @param {object} [opts.parentSettings] - settings on the parent's fake element
 * @param {object} [opts.childDefaultSettings] - defaultSettings on the subtemplate
 * @param {object} [opts.childData] - data passed to the subtemplate (parent props)
 * @returns {{ parent: Template, child: Template, cleanup: () => void }}
 */
export function subtemplateFixture(opts = {}) {
  const { parentSettings = {}, childDefaultSettings, childData = {} } = opts;

  // Fake element for the parent — provides .settings for the subtemplate's
  // parent-fallback Proxy (template.js:954). Real components have this set
  // up via WebComponentBase; in unit tests we stub it directly.
  const fakeElement = {
    settings: { ...parentSettings },
  };

  const { template: parent, cleanup: cleanupParent } = freshTemplate({
    template: '<div></div>',
    element: fakeElement,
  });

  const { template: child, cleanup: cleanupChild } = freshTemplate({
    template: '<span></span>',
    defaultSettings: childDefaultSettings,
    data: childData,
  });

  child.setParent(parent);

  return {
    parent,
    child,
    cleanup: () => {
      cleanupChild();
      cleanupParent();
    },
  };
}
