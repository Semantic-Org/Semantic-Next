// Browser fixture for Template tests that need a real DOM with shadow root.
//
// Sidesteps WebComponentBase / defineComponent (which live in the component
// package — a circular dep we can't take here) by mounting a Template
// directly into a host element's shadow root. This is sufficient for
// testing Template's own contracts:
//   - Events DSL (delegation, deep, global, bind keywords)
//   - DOM scoping ($/$$/isNodeInTemplate)
//   - Lifecycle wrappers (onCreated/onRendered/onDestroyed firing through
//     Template's own dispatch path)
//   - Tree traversal where the parent has an element + shadowRoot
//
// For tests that need the FULL WebComponentBase integration (custom-element
// lifecycle, attribute-changed callbacks, native settings proxy, etc.),
// place those tests in `packages/component/test/browser/` instead. The
// fixture there can use `defineComponent` directly.
//
// Usage:
//   const fixture = mountTemplateInShadow({
//     template: '<button class="btn">click</button>',
//     events: { 'click .btn'({ self }) { self.clicked = true; } },
//     defaultState: { count: 0 },
//   });
//   try {
//     // fixture.host is in document.body
//     // fixture.shadow is the shadow root (renderRoot)
//     // fixture.template is the Template instance
//     // ... exercise interactions ...
//   } finally {
//     fixture.cleanup();
//   }

import { Template } from '../../src/template.js';
import { stubEngine } from './stub-engine.js';

/**
 * Mount a Template into a fresh shadow root attached to document.body.
 * Returns the host element, shadow root, and Template instance, plus a
 * cleanup that tears down lifecycle and removes the host from the DOM.
 *
 * @param {object} [opts]
 * @param {string} [opts.template] - Template HTML string
 * @param {string} [opts.hostTag] - Host element tag. Default 'div'.
 * @param {object} [opts.shadowMode] - Shadow root mode. Default 'open'.
 * @param {object|string} [opts.renderingEngine] - Engine. Default stub.
 *   Pass 'native' (and ensure native engine is registered via component import)
 *   if you want real DOM rendering. For Template-internal contract tests,
 *   stub is sufficient.
 * @param {object} [opts] - Any other Template options (events, keys, etc.)
 * @returns {{
 *   host: HTMLElement,
 *   shadow: ShadowRoot,
 *   template: Template,
 *   cleanup: () => void
 * }}
 */
export function mountTemplateInShadow(opts = {}) {
  if (typeof document === 'undefined') {
    throw new Error('mountTemplateInShadow requires a DOM environment (browser/jsdom)');
  }

  const {
    template: templateString = '<div></div>',
    hostTag = 'div',
    shadowMode = 'open',
    renderingEngine = stubEngine,
    ...templateOpts
  } = opts;

  const host = document.createElement(hostTag);
  const shadow = host.attachShadow({ mode: shadowMode });
  document.body.appendChild(host);

  const tpl = new Template({
    template: templateString,
    renderingEngine,
    element: host,
    ...templateOpts,
  });

  // initialize must run before attach (attach calls initialize itself if
  // needed, but doing it explicitly here makes the lifecycle ordering
  // observable for tests)
  tpl.initialize();
  tpl.attach(shadow);

  return {
    host,
    shadow,
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

/**
 * Same as mountTemplateInShadow but creates a parent + child Template pair
 * where child is a subtemplate of parent. The parent's shadow root contains
 * a region for the child to render into.
 *
 * Useful for Surface 8 (tree traversal) tests where DOM cascade requires
 * a real shadow root with nested elements that have `.component`.
 *
 * @param {object} [opts]
 * @returns {{
 *   parentHost: HTMLElement,
 *   parentShadow: ShadowRoot,
 *   parent: Template,
 *   child: Template,
 *   cleanup: () => void
 * }}
 */
export function mountSubtemplateInShadow(opts = {}) {
  const { parentTemplate, childTemplate, childDefaultSettings, ...rest } = opts;

  const parentFixture = mountTemplateInShadow({
    template: parentTemplate || '<div class="region"></div>',
    ...rest,
  });

  const child = new Template({
    template: childTemplate || '<span></span>',
    defaultSettings: childDefaultSettings,
    renderingEngine: stubEngine,
    element: parentFixture.host,
  });
  child.setParent(parentFixture.template);
  child.initialize();

  return {
    parentHost: parentFixture.host,
    parentShadow: parentFixture.shadow,
    parent: parentFixture.template,
    child,
    cleanup: () => {
      try {
        if (child.initialized && !child.destroyed) {
          child.onDestroyed();
        }
      }
      catch (_) {}
      parentFixture.cleanup();
    },
  };
}
