import { $ } from '@semantic-ui/query';
import { MARKER_VERSION } from '@semantic-ui/renderer';
import { adoptStylesheet, isFunction, isServer, kebabToCamel } from '@semantic-ui/utils';

import {
  createSettingsProxy,
  getProperties,
  getPropertySettings,
  getSettingsFromConfig,
  getUIClasses,
  isDarkMode,
  setDefaultSettings,
} from '../../component-helpers.js';
import { adjustPropertyFromAttribute } from '../../helpers/adjust-property-from-attribute.js';

/*
  Standard web component base class — extends HTMLElement directly.
  No framework dependencies. Shared logic lives in component-helpers.js.

  Component-specific config is stored as static `config` on the generated
  subclass by the factory. Methods here read from config so factories
  don't need to define inline methods.
*/

const HTMLElementBase = isServer ? class {} : HTMLElement;

class WebComponentBase extends HTMLElementBase {
  constructor() {
    super();
    this.renderCallbacks = [];
    this.properties = new Map();

    // If the element has a declarative shadow root (created by DSD parsing),
    // suppress requestUpdate until hydration completes — attribute parsing
    // fires before connectedCallback and would schedule a render cascade
    if (this.shadowRoot) {
      this.isHydrating = true;
    }

    const { css, componentSpec, defaultSettings, resolvedProperties } = this.constructor.config || {};
    this.css = css;
    this.componentSpec = componentSpec;
    if (resolvedProperties) {
      this.settings = this.createSettingsProxy();
    }
    if (componentSpec) {
      this.uiClasses = () => this.getUIClasses({ componentSpec, properties: resolvedProperties });
    }
    if (defaultSettings) {
      this.setDefaultSettings({ defaultSettings, componentSpec });
    }
    else {
      this.defaultSettings = {};
    }
  }

  connectedCallback() {
    if (this.template) {
      return;
    }

    // SSR'd components are marked with `ssr` — they should not self-hydrate
    // when the browser auto-upgrades them. The client integration
    // removes this attribute and calls connectedCallback explicitly.
    if (this.hasAttribute('ssr')) {
      return;
    }

    // DSD creates the shadow root before connectedCallback fires
    const hasServerContent = this.shadowRoot && this.shadowRoot.childNodes.length > 0;

    if (!this.shadowRoot) {
      this.attachShadow({
        mode: 'open',
        delegatesFocus: this.constructor.delegatesFocus || false,
      });
    }
    this.renderRoot = this.shadowRoot;

    if (this.css) {
      adoptStylesheet(this.css, this.shadowRoot);
    }

    const prototypeTemplate = this.constructor.template;

    if (hasServerContent && this.canHydrate()) {
      // DSD means the visual is already correct — defer hydration wiring
      // to avoid blocking the parser, but use microtask to close the gap
      // where events would be lost (rAF leaves a full frame unbound)
      queueMicrotask(() => this.hydrate(prototypeTemplate));
    }
    else {
      if (hasServerContent) {
        // Version mismatch — discard server content
        this.shadowRoot.innerHTML = '';
      }
      this.fullRender(prototypeTemplate);
    }
  }

  canHydrate() {
    // Walk comments looking for a versioned marker
    const walker = document.createTreeWalker(this.shadowRoot, NodeFilter.SHOW_COMMENT);
    let comment;
    while ((comment = walker.nextNode())) {
      const text = comment.data;
      if (text.startsWith('sui:') || text.startsWith('sui-block:')) {
        return text.includes(`:${MARKER_VERSION}:`);
      }
    }
    // No markers — static content, safe to hydrate (nothing to wire)
    return true;
  }

  hydrate(prototypeTemplate) {
    // Remove server <style> — CSS is handled via adoptedStyleSheets
    const serverStyle = this.shadowRoot.querySelector('style');
    if (serverStyle) {
      serverStyle.remove();
    }

    const data = this.getData();

    // Don't pass renderRoot — avoids triggering attach() from the constructor.
    // Matches the subtemplate pattern: explicit initialize() → work → attach().
    this.template = prototypeTemplate.clone({
      data,
      element: this,
    });

    this.template.initialize();
    this.template.isHydrating = true;
    this.component = this.template.instance;
    this.dataContext = this.template.getDataContext();

    // Build entries for hydration (same marker IDs the server produced).
    // Cache on the prototype — entries depend only on AST structure, not data.
    if (!prototypeTemplate._hydrationEntries) {
      const { entries } = this.template.renderer.buildHTMLString(this.template.ast);
      prototypeTemplate._hydrationEntries = entries;
    }
    const entries = prototypeTemplate._hydrationEntries;

    // Wire reactive bindings to existing server-rendered DOM
    this.template.renderer.hydrateMarkers({
      root: this.shadowRoot,
      entries,
      data: this.template.renderer.data,
      scope: this.template.renderer.scope,
    });

    this.template.isHydrating = false;
    this.template.markRendered();
    this.isHydrating = false;

    // Attach events after hydration completes
    this.template.attach(this.renderRoot);

    queueMicrotask(() => this.template?.onRendered());

    // Plan 02 — defer marker cleanup to the post-paint rAF. Markers are
    // invisible (comment nodes + data-sui-bind attribute inside shadow
    // root); keeping them in the DOM for one frame has no user-visible
    // effect but moves ~1-6ms of TreeWalker + removeAttribute work off
    // the synchronous hydration path. The `isConnected` guard handles
    // the edge case where the element is torn down between hydration
    // and the rAF firing.
    requestAnimationFrame(() => {
      if (this.isConnected) { this.removeMarkers(); }
    });
  }

  removeMarkers() {
    const removeComments = (root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
      const toRemove = [];
      let node;
      while ((node = walker.nextNode())) {
        if (node.data.startsWith('sui') || node.data.startsWith('/sui')) {
          toRemove.push(node);
        }
      }
      for (const node of toRemove) { node.remove(); }
    };
    const removeDataSuiBind = (root) => {
      // Strip the Plan-04 hydration hint. Element selector is cheap and
      // shadow-scoped; the attribute served its purpose at hydrate time.
      const bound = root.querySelectorAll('[data-sui-bind]');
      for (const el of bound) { el.removeAttribute('data-sui-bind'); }
    };
    removeComments(this.shadowRoot);
    removeDataSuiBind(this.shadowRoot);
  }

  fullRender(prototypeTemplate) {
    this.template = prototypeTemplate.clone({
      data: this.getData(),
      element: this,
      renderRoot: this.renderRoot,
    });
    if (!this.template.initialized) {
      this.template.initialize();
    }
    this.component = this.template.instance;
    this.dataContext = this.template.getDataContext();

    const fragment = this.template.render(this.getData());
    this.shadowRoot.append(fragment);
  }

  disconnectedCallback() {
    if (!this.template) { return; }
    // disconnect+connect in one task is a move, not a removal. defer
    // teardown so block hydration relocating nested components is safe.
    queueMicrotask(() => {
      if (this.isConnected || !this.template) { return; }
      this.template.onDestroyed();
      delete this.template;
      delete this.component;
      delete this.dataContext;
    });
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    const { resolvedProperties, componentSpec, onAttributeChanged } = this.constructor.config || {};
    if (!resolvedProperties) {
      return;
    }

    const propName = kebabToCamel(attribute);
    const config = resolvedProperties[propName];
    const convertedValue = config?.converter?.fromAttribute
      ? config.converter.fromAttribute(newValue, config.type)
      : newValue;
    if (config && !config.noAccessor) {
      this[propName] = convertedValue;
    }

    // During hydration, attribute parsing fires for every server-rendered
    // attribute. Properties are set above (needed for getData), but skip
    // the spec resolution cascade — the DOM already reflects the correct
    // state and adjustPropertyFromAttribute triggers requestUpdate.
    if (this.isHydrating) {
      return;
    }

    adjustPropertyFromAttribute({
      el: this,
      attribute,
      attributeValue: newValue,
      properties: resolvedProperties,
      oldValue,
      componentSpec,
    });
    if (onAttributeChanged) {
      this.call(onAttributeChanged, { args: [attribute, oldValue, newValue] });
    }
  }

  get updateComplete() {
    if (!this.updateScheduled) {
      return Promise.resolve();
    }
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  requestUpdate() {
    this.updateScheduled = true;
    if (this._pendingRender) {
      return;
    }
    this._pendingRender = true;
    queueMicrotask(() => {
      this._pendingRender = false;
      if (this.template) {
        this.template.render(this.getData());
      }
    });
  }

  /*******************************
      Settings / Template Data
  *******************************/

  getSettings() {
    const { componentSpec, resolvedProperties } = this.constructor.config || {};
    return this.getSettingsFromConfig({ componentSpec, properties: resolvedProperties });
  }

  setSetting(name, value) {
    this[name] = value;
  }

  getData() {
    const { componentSpec, resolvedProperties, plural } = this.constructor.config || {};
    const el = this;
    let data = {
      ...this.getSettings(),
    };
    if (!isServer) {
      Object.defineProperty(data, 'darkMode', {
        get() {
          return el.isDarkMode();
        },
        enumerable: true,
        configurable: true,
      });
    }
    if (this.uiClasses) {
      data.uiClasses = this.uiClasses;
    }
    if (plural) {
      data.plural = true;
    }
    return data;
  }

  /*******************************
      Property Configuration
  *******************************/

  static getProperties(options) {
    return getProperties(options);
  }

  static getPropertySettings(options) {
    return getPropertySettings(options);
  }

  /*******************************
      Instance Helpers
  *******************************/

  setDefaultSettings(options) {
    setDefaultSettings(this, options);
  }

  getSettingsFromConfig(options) {
    return getSettingsFromConfig(this, options);
  }

  createSettingsProxy() {
    return createSettingsProxy(this);
  }

  getUIClasses(options) {
    return getUIClasses(this, options);
  }

  isDarkMode() {
    return isDarkMode(this);
  }

  /*******************************
      Lifecycle Promises
  *******************************/

  get created() {
    return this.template?.lifecyclePromise('created');
  }
  get rendered() {
    return this.template?.lifecyclePromise('rendered');
  }
  get updated() {
    if (!this.updateScheduled) {
      return Promise.resolve();
    }
    return this.template?.lifecyclePromise('updated');
  }
  get destroyed() {
    return this.template?.lifecyclePromise('destroyed');
  }

  /*******************************
            DOM Helpers
  *******************************/

  $(selector, { root = this.renderRoot || this.shadowRoot } = {}) {
    if (!root) {
      console.error('Cannot query DOM until element has rendered.');
    }
    return $(selector, { root });
  }

  $$(selector) {
    return $(selector, { root: this.originalDOM.content });
  }

  call(
    func,
    { firstArg, additionalArgs, args = [this.component, this.$.bind(this)] } = {},
  ) {
    if (firstArg) {
      args.unshift(firstArg);
    }
    if (additionalArgs) {
      args.push(...additionalArgs);
    }
    if (isFunction(func)) {
      return func.apply(this, args);
    }
  }
}

export { WebComponentBase };
