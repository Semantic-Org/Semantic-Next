import { MARKER_VERSION } from '@semantic-ui/renderer';
import { adoptStylesheet, each, isFunction, isServer, kebabToCamel, keys } from '@semantic-ui/utils';

import {
  createSettingsProxy,
  defineAccessors,
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
let baseDescriptors;

class WebComponentBase extends HTMLElementBase {
  // a mounted element keeps its own tag prototype (HTMLDivElement, HTMLDialogElement)
  // and carries ComponentClass as its constructor, so instanceof matches both
  static [Symbol.hasInstance](instance) {
    const ctor = instance?.constructor;
    return Boolean(ctor && (ctor === this || this.isPrototypeOf(ctor)));
  }

  // a plain element inherits the component class's prototype while mounted, the way the
  // custom elements polyfill upgraded an element: prototype swapped in, the constructor's
  // work run, nothing copied onto the element (benched at 33us vs 54us for per-mount
  // property and method assignment). keys an instance carries or a mount passes beyond
  // the class's declaration get accessors of their own and a signal through the defaults
  static upgradeElement(el, { settings, renderRoot } = {}) {
    const original = Object.getPrototypeOf(el);
    el.originalPrototype = original;
    Object.setPrototypeOf(el, this.getUpgradePrototype(original));
    el.construct({
      isLightDOM: true,
      settings,
      renderRoot,
    });
  }

  // layers the component class over the element's native tag prototype so a mounted
  // <dialog> can still call native methods like showModal() and close() while taking on
  // the custom element's properties and methods like settings, requestUpdate(), and $,
  // acting as a facsimile of the custom element without losing its native behavior
  static getUpgradePrototype(original) {
    const cache = this.upgradePrototypes ??= new WeakMap();
    let proto = cache.get(original);
    if (!proto) {
      baseDescriptors ??= Object.getOwnPropertyDescriptors(WebComponentBase.prototype);
      proto = Object.create(original, {
        ...baseDescriptors,
        ...Object.getOwnPropertyDescriptors(this.prototype),
      });
      cache.set(original, proto);
    }
    return proto;
  }

  constructor() {
    super();
    this.construct();
  }

  // the constructor's work on its own: a plain element that mount upgrades with this class
  // runs it the way the custom elements polyfill ran a definition's constructor after
  // swapping an element's prototype
  construct({ isLightDOM = false, settings, renderRoot } = {}) {
    this.isLightDOM = isLightDOM;
    this.isCustomElement = !isLightDOM;
    this.properties = new Map();
    this.renderRoot = renderRoot;

    // If the element has a declarative shadow root (created by DSD parsing),
    // suppress requestUpdate until hydration completes — attribute parsing
    // fires before connectedCallback and would schedule a render cascade
    if (this.isCustomElement && this.shadowRoot) {
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

    if (this.isLightDOM && settings) {
      const undeclared = {};
      each(settings, (value, name) => {
        if (!resolvedProperties || !(name in resolvedProperties)) {
          undeclared[name] = this.constructor.getPropertySettings({
            name,
            type: value?.constructor,
            propertyOnly: true,
          });
          this.defaultSettings[name] = undefined;
        }
        // seeded in the store rather than through the accessors, so nothing renders early
        this.properties.set(name, value);
      });
      if (keys(undeclared).length) {
        this.extraProperties = undeclared;
        defineAccessors(this, undeclared);
      }
    }
  }

  addTemplateToEl(template) {
    this.template = template;
    this.component = template.instance;
    this.dataContext = template.getDataContext();
  }

  removeTemplateFromEl() {
    this.template = undefined;
    this.component = undefined;
    this.dataContext = undefined;
  }

  mount(template, { signal } = {}) {
    const renderRoot = this.renderRoot;
    try {
      // a prototype mounts a copy built on the element's data, an instance mounts itself
      const data = this.getData();
      if (template.isPrototype) {
        template = template.clone({ data, element: this });
      }
      else {
        template.setElement(this);
        template.data = data;
      }

      // the settings a callback sees are the element's, handed to the template so the
      // returned handle talks the same way
      template.settings = this.settings;

      // a host adopted its own css when it connected, a bare element has nobody else to
      if (this.isLightDOM && template.css) {
        adoptStylesheet(template.css, renderRoot);
      }

      template.initialize();
      // exposed on el before rendering so a child element upgrading during insertion can find its parent
      this.addTemplateToEl(template);

      template.attach(renderRoot);
      const fragment = template.render(data);
      renderRoot.replaceChildren(fragment);
    }
    catch (error) {
      this.discard(template);
      throw error;
    }
    template.mounted = true;

    if (signal) {
      signal.addEventListener('abort', () => this.unmount(), { once: true, signal: template.abortSignal });
    }
    return template;
  }

  // a mount that fails partway leaves nothing behind: the template's timers and reactions
  // end, the element is as it was, and the error reaches the caller
  discard(template) {
    if (template && !template.isPrototype) {
      if (template.initialized) {
        template.onDestroyed();
      }
      else {
        template.clearReactions();
        template.abortController.abort('mount failed');
      }
    }
    this.removeTemplateFromEl();
    if (this.isLightDOM) {
      this.restoreElement();
    }
  }

  unmount() {
    const template = this.template;
    if (!template?.mounted) {
      return;
    }
    template.mounted = false;
    // the handle's settings were the element's, and the element is about to be restored
    template.settings = undefined;
    // fire destroyed before clearing the DOM so listeners can still read the rendered nodes
    template.onDestroyed();
    this.renderRoot.replaceChildren();
    this.removeTemplateFromEl();
    if (this.isLightDOM) {
      this.restoreElement();
    }
  }

  restoreElement() {
    const original = this.originalPrototype;
    this.originalPrototype = undefined;
    this.teardown();
    Object.setPrototypeOf(this, original);
  }

  // the constructor's fields stay as names holding nothing: a delete would leave the
  // element in dictionary mode for the rest of its life
  teardown() {
    if (this.extraProperties) {
      each(this.extraProperties, (config, name) => {
        if (!config.noAccessor) {
          delete this[name];
        }
      });
      this.extraProperties = undefined;
    }
    this.isLightDOM = undefined;
    this.isCustomElement = undefined;
    this.properties = undefined;
    this.renderRoot = undefined;
    this.isHydrating = undefined;
    this.css = undefined;
    this.componentSpec = undefined;
    this.settings = undefined;
    this.settingsVars = undefined;
    this.uiClasses = undefined;
    this.defaultSettings = undefined;
    this.updateScheduled = undefined;
    this.pendingRender = undefined;
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
      this.mount(prototypeTemplate);
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
    const template = prototypeTemplate.clone({
      data,
      element: this,
    });

    template.isHydrating = true;
    template.initialize();
    this.addTemplateToEl(template);
    // hydrated content tears down the same way mounted content does
    this.template.mounted = true;

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

  disconnectedCallback() {
    if (!this.template) { return; }
    // disconnect+connect in one task is a move, not a removal. defer
    // teardown so block hydration relocating nested components is safe.
    queueMicrotask(() => {
      if (this.isConnected || !this.template) { return; }
      this.unmount();
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

  render(data = this.getData()) {
    return this.template?.render(data);
  }

  update(data) {
    return this.render(data);
  }

  requestUpdate() {
    this.updateScheduled = true;
    if (this.pendingRender) {
      return;
    }
    this.pendingRender = true;
    queueMicrotask(() => {
      if (this.pendingRender) {
        this.pendingRender = false;
      }
      if (this.template) {
        this.render();
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
      Lifecycle State & Promises
  *******************************/

  get isMounted() {
    return Boolean(this.template?.mounted);
  }
  get isRendered() {
    return Boolean(this.template?.rendered);
  }
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

  /*
    el.$ and el.$$ are the consumer-facing DOM API, deliberately on the element
    so they are discoverable without reaching through the internal el.template.
    They delegate so external callers get the same template-range filtering an
    author gets, rather than a raw renderRoot query that can return a sibling
    subtemplate's nodes. The template only exists once the element upgrades, so
    querying before that is a real mistake and says so.
  */
  $(...args) {
    if (!this.template) {
      console.error('Cannot query DOM until element has rendered.');
      return;
    }
    return this.template.$(...args);
  }

  $$(...args) {
    if (!this.template) {
      console.error('Cannot query DOM until element has rendered.');
      return;
    }
    return this.template.$$(...args);
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
