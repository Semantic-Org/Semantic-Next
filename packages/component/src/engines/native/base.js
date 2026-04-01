import { $ } from '@semantic-ui/query';
const MARKER_VERSION = 'v1';
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
    this.propertyStore = new Map();

    // If the element has a declarative shadow root (created by DSD parsing),
    // suppress requestUpdate until hydration completes — attribute parsing
    // fires before connectedCallback and would schedule a render cascade
    if (this.shadowRoot) {
      this._hydrating = true;
    }

    const { css, componentSpec, defaultSettings, resolvedProperties } = this.constructor.config || {};
    this.css = css;
    this.componentSpec = componentSpec;
    if (resolvedProperties) {
      this.settings = this.createSettingsProxy();
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
      // DSD means the visual is already correct — defer the expensive
      // hydration wiring so the browser can paint and respond to input
      requestAnimationFrame(() => this.hydrate(prototypeTemplate));
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

    this.template = prototypeTemplate.clone({
      data,
      element: this,
      renderRoot: this.renderRoot,
    });

    this.template._isHydrating = true;
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
    this.template.renderer.hydrateMarkers(
      this.shadowRoot,
      entries,
      this.template.renderer.data,
      this.template.renderer.scope,
    );

    this.template._isHydrating = false;
    this.template.rendered = true;
    this._hydrating = false;

    // Remove all hydration markers — clean DevTools, zero comment noise
    this.removeMarkers();

    setTimeout(() => this.template?.onRendered(), 0);
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
    removeComments(this.shadowRoot);
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
    if (this.template) {
      this.template.onDestroyed();
      delete this.template;
      delete this.component;
      delete this.dataContext;
    }
    this.constructor.template?.onDestroyed();
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    const { resolvedProperties, componentSpec, onAttributeChanged } = this.constructor.config || {};
    if (!resolvedProperties) {
      return;
    }

    const propName = kebabToCamel(attribute);
    const config = resolvedProperties[propName];
    if (config?.converter?.fromAttribute) {
      newValue = config.converter.fromAttribute(newValue, config.type);
    }
    if (config && !config.noAccessor) {
      this[propName] = newValue;
    }

    // During hydration, attribute parsing fires for every server-rendered
    // attribute. Properties are set above (needed for getData), but skip
    // the spec resolution cascade — the DOM already reflects the correct
    // state and adjustPropertyFromAttribute triggers requestUpdate.
    if (this._hydrating) {
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

  requestUpdate() {
    if (this.updateScheduled) {
      return;
    }
    this.updateScheduled = true;
    queueMicrotask(() => {
      this.updateScheduled = false;
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
    let data = {
      ...this.getSettings(),
    };
    if (!isServer) {
      data.darkMode = this.isDarkMode();
    }
    if (componentSpec) {
      data.ui = this.getUIClasses({ componentSpec, properties: resolvedProperties });
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
