import { flush } from '@semantic-ui/reactivity';
import { MARKER_VERSION } from '@semantic-ui/renderer';
import { adoptStylesheet, each, inArray, isFunction, isServer, kebabToCamel } from '@semantic-ui/utils';

import {
  createSettingsProxy,
  getProperties,
  getPropertySettings,
  getSettingsFromConfig,
  getUIClasses,
  isDarkMode,
  resolveAttributeAliases,
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
  // a mounted element keeps its own tag prototype (HTMLDivElement, HTMLDialogElement)
  // and carries ComponentClass as its constructor, so instanceof matches both
  static [Symbol.hasInstance](instance) {
    const ctor = instance?.constructor;
    return Boolean(ctor && (ctor === this || this.isPrototypeOf(ctor)));
  }

  // swap in the component prototype and run construct() rather than copying properties
  // onto the element (benched at 33us vs 54us per mount)
  static upgradeElement(el, { settings, data, renderRoot } = {}) {
    const original = Object.getPrototypeOf(el);
    el.originalPrototype = original;
    Object.setPrototypeOf(el, this.getUpgradePrototype(original));
    try {
      el.construct({
        isLightDOM: true,
        settings,
        data,
        renderRoot,
      });
    }
    catch (error) {
      el.restoreElement();
      throw error;
    }
  }

  // the base's own prototype descriptors, read once and shared by every upgrade prototype
  static baseDescriptors;

  // layers the component class over the element's native tag prototype so a mounted
  // <dialog> can still call native methods like showModal() and close() while taking on
  // the custom element's properties and methods like settings, requestUpdate(), and $,
  // acting as a facsimile of the custom element without losing its native behavior
  static getUpgradePrototype(original) {
    // keep a separate cache per component subclass rather than inheriting the parent's
    if (!Object.hasOwn(this, 'upgradePrototypes')) {
      this.upgradePrototypes = new WeakMap();
    }
    const cache = this.upgradePrototypes;
    let proto = cache.get(original);
    if (!proto) {
      WebComponentBase.baseDescriptors ??= Object.getOwnPropertyDescriptors(WebComponentBase.prototype);
      proto = Object.create(original, {
        ...WebComponentBase.baseDescriptors,
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

  // shared constructor logic for custom element upgrades and light DOM mounts
  construct({ isLightDOM = false, settings = {}, data = {}, renderRoot } = {}) {
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

    if (this.isLightDOM) {
      // a declared key is that setting, anything else is additional data for the template.
      // the property table also lists spellings, the spec's and the kebab ones, as aliases
      const take = (value, key) => {
        const declared = resolvedProperties[key];
        if (declared && !declared.alias) {
          this.setSetting(key, value);
        }
        else {
          this.additionalData ??= {};
          this.additionalData[key] = value;
        }
      };

      // data comes first: the template's own and what the call passes, taken as written
      each(data, take);

      // then the markup: a mounted element has no custom element lifecycle, so the attributes
      // it carries are replayed through the hook the browser fires on a tag, and later changes
      // are observed into the same hook a microtask later
      const observed = this.constructor.observedAttributes;
      if (observed?.length) {
        for (const attribute of this.attributes) {
          if (inArray(attribute.name, observed)) {
            this.attributeChangedCallback(attribute.name, null, attribute.value);
          }
        }
        this.attributeObserver = new MutationObserver((records) => {
          for (const { attributeName, oldValue } of records) {
            this.attributeChangedCallback(attributeName, oldValue, this.getAttribute(attributeName));
          }
        });
        this.attributeObserver.observe(this, { attributes: true, attributeOldValue: true, attributeFilter: observed });
      }

      // settings last, so the call wins over the markup. only settings speak the spec's
      // dialects and the kebab aliases, which is why only they are resolved
      each(resolveAttributeAliases({ ...settings }, componentSpec), (value, name) => {
        take(value, resolvedProperties[name]?.aliasFor ?? name);
      });
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
      // copy getData() via property descriptors so getters like darkMode stay live
      const data = { ...this.additionalData };
      Object.defineProperties(data, Object.getOwnPropertyDescriptors(this.getData()));
      if (template.isPrototype) {
        template = template.clone({ data, element: this });
      }
      else {
        template.setElement(this);
        template.data = data;
      }

      template.settings = this.settings;

      // custom elements adopt css in connectedCallback, light DOM mounts adopt it here
      if (this.isLightDOM && template.css) {
        adoptStylesheet(template.css, renderRoot);
      }

      template.initialize();
      // attach template references before rendering so child elements upgrading during insertion can find their parent
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

  // clean up partial initialization and restore the element when mount() throws
  discard(template) {
    try {
      if (template && !template.isPrototype) {
        if (template.initialized) {
          template.onDestroyed();
        }
        else {
          template.clearReactions();
          template.abortController.abort('mount failed');
        }
      }
    }
    finally {
      this.removeTemplateFromEl();
      this.restoreElement();
    }
  }

  unmount() {
    const template = this.template;
    if (!template?.mounted) {
      return;
    }
    template.mounted = false;
    template.settings = undefined;
    // fire onDestroyed before clearing the DOM so callbacks can still query rendered nodes
    try {
      template.onDestroyed();
    }
    finally {
      this.renderRoot.replaceChildren();
      this.removeTemplateFromEl();
      this.restoreElement();
    }
  }

  // only restore the prototype if the element was upgraded by upgradeElement
  restoreElement() {
    const original = this.originalPrototype;
    if (!original) {
      return;
    }
    this.originalPrototype = undefined;
    this.teardown();
    Object.setPrototypeOf(this, original);
  }

  // instance fields managed by the base class and cleared on teardown
  static fields = [
    'template',
    'component',
    'dataContext',
    'isLightDOM',
    'isCustomElement',
    'properties',
    'renderRoot',
    'isHydrating',
    'css',
    'componentSpec',
    'settings',
    'settingsVars',
    'uiClasses',
    'defaultSettings',
    'additionalData',
    'attributeObserver',
    'updateScheduled',
    'isUpdatePending',
  ];

  // resets every instance field to undefined (avoiding `delete` so the element stays out of V8 dictionary mode)
  teardown() {
    this.attributeObserver?.disconnect();
    each(WebComponentBase.fields, (name) => {
      this[name] = undefined;
    });
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
    if (!this.updateScheduled && !this.isUpdatePending) {
      return Promise.resolve();
    }
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  // a plain key fires the coarse channel, which ends in onUpdated, so that is the
  // update the lifecycle waits on. a setting reaches onUpdated through its own signal
  update(data = this.getData()) {
    if (this.template?.update(data)) {
      this.updateScheduled = true;
    }
  }

  requestUpdate() {
    // nothing to render before a template is mounted, its first render reads these writes
    if (!this.template) {
      return;
    }
    if (this.isUpdatePending) {
      return;
    }
    this.isUpdatePending = true;
    queueMicrotask(() => {
      this.isUpdatePending = false;
      if (!this.template) {
        return;
      }
      this.update();
      flush();
      // nothing moved, so nothing reaches onUpdated for the waiters this update collected
      if (!this.updateScheduled && !this.template.updateScheduled) {
        this.template.resolveLifecyclePromise('updated');
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
    if (!this.updateScheduled && !this.isUpdatePending) {
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
