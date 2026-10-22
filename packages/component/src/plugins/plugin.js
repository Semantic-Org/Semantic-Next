import { signal } from '@semantic-ui/reactivity';
import { registerHelpers, TemplateHelpers } from '@semantic-ui/templating';
import { Template } from '@semantic-ui/templating/template';
import {
  any,
  clone,
  each,
  extend,
  isArray,
  isFunction,
  isObject,
  isPlainObject,
  isString,
  keys,
  noop,
} from '@semantic-ui/utils';

export class Plugin {
  // creates a reactive wrapper around settings so they trigger reactions through a proxy object
  static createReactiveProxy(target) {
    const signals = new Map();
    return new Proxy(target, {
      get(obj, prop) {
        if (!isString(prop)) {
          return obj[prop];
        }
        let settingSignal = signals.get(prop);
        if (!settingSignal) {
          settingSignal = signal(obj[prop]);
          signals.set(prop, settingSignal);
        }
        settingSignal.depend();
        return obj[prop];
      },
      set(obj, prop, value) {
        obj[prop] = value;
        let settingSignal = signals.get(prop);
        if (settingSignal) {
          settingSignal.set(value);
        }
        else {
          settingSignal = signal(value);
          signals.set(prop, settingSignal);
        }
        return true;
      },
    });
  }

  constructor({
    namespace, // name for this plugin
    template, // current template being applied to
    appliesTo = 'components', // conditions for this template
    defaultSettings = {},
    userSettings = {}, // app-level settings passed to addPlugin
    userConfig, // component configuration for this plugin
    settings, // resolved settings proxy for this instance
    resolveSettings, // hook to normalize component config into settings
    setup, // shared prototype state across all instances
    sharedState = {},
    createPlugin,
    params, // what params should be added to lifecycle events
    lifecycleParams,
    templateHelpers, // template helpers to be added to templates
    onCreated = noop,
    onRendered = noop,
    onDestroyed = noop,
  } = {}) {
    this.isPrototype = template === undefined;
    this.template = template;

    extend(this, {
      namespace,
      appliesTo,
      defaultSettings,
      userSettings,
      userConfig,
      resolveSettingsCallback: resolveSettings,
      setup,
      sharedState,
      createPlugin,
      params: params || lifecycleParams,
      templateHelpers,
      onCreated: noop,
      onRendered: noop,
      onDestroyed: noop,
      onCreatedCallback: onCreated,
      onRenderedCallback: onRendered,
      onDestroyedCallback: onDestroyed,
    });

    if (this.isPrototype) {
      this.baseSettings = clone({
        ...defaultSettings,
        ...userSettings,
      });
      this.settings = Plugin.createReactiveProxy(this.baseSettings);
      this.pluginSettings = this.settings;

      if (isPlainObject(templateHelpers)) {
        registerHelpers(templateHelpers);
      }
      if (isFunction(setup)) {
        this.sharedState = setup({
          settings: this.settings,
          isServer: Template.isServer,
          isClient: !Template.isServer,
          namespace,
        }) || {};
      }
    }
    else {
      this.settings = settings;
      this.initialize();
    }
  }

  initialize() {
    const { template } = this;
    this.instance = Object.create(isObject(this.sharedState) ? this.sharedState : null);
    this.callParams = extend({}, template.buildCallParams(), {
      self: this.instance,
      plugin: this.instance,
      settings: this.settings,
      config: this.userConfig,
      componentSettings: template.settings || template.element?.settings,
      namespace: this.namespace,
      get el() {
        return template.element;
      },
      get helpers() {
        return template.helpers || TemplateHelpers;
      },
    });

    if (isFunction(this.createPlugin)) {
      const instanceMethods = this.createPlugin.call(this.instance, this.callParams);
      if (isObject(instanceMethods)) {
        extend(this.instance, instanceMethods);
      }
    }

    this.attachElement();

    if (isFunction(this.instance.initialize)) {
      this.instance.initialize.call(this.instance, this.callParams);
    }

    if (this.params) {
      const params = isFunction(this.params)
        ? this.params.call(this.instance, this.callParams)
        : this.params;
      if (isObject(params)) {
        template.addParams(params);
      }
    }

    if (isFunction(this.templateHelpers)) {
      const helpers = this.templateHelpers.call(this.instance, this.callParams);
      if (isObject(helpers)) {
        template.addHelpers(helpers);
      }
    }

    this.onCreated = () => {
      this.onCreatedCallback.call(this.instance, this.callParams);
    };

    this.onRendered = () => {
      this.attachElement();
      this.onRenderedCallback.call(this.instance, this.callParams);
    };

    this.onDestroyed = () => {
      this.onDestroyedCallback.call(this.instance, this.callParams);
      this.detachElement();
    };

    this.initialized = true;
  }

  resolveSettings(baseParams, config, componentSettings) {
    if (
      config !== undefined
      && !isFunction(this.resolveSettingsCallback)
      && !isPlainObject(config)
      && keys(this.baseSettings).length === 0
    ) {
      return config;
    }

    let ownSettings = {};
    if (config !== undefined) {
      if (isFunction(this.resolveSettingsCallback)) {
        // prototype fallback reads baseSettings while {...settings} only spreads own overrides
        const seed = Object.assign(
          Object.create(this.baseSettings),
          isPlainObject(config) ? clone(config) : null,
        );
        const resolved = this.resolveSettingsCallback(extend({}, baseParams, {
          self: this.sharedState,
          plugin: this.sharedState,
          settings: seed,
          config,
          componentSettings,
          namespace: this.namespace,
        }));
        if (isObject(resolved)) {
          ownSettings = clone({ ...resolved });
        }
        else {
          ownSettings = clone({ ...seed });
        }
      }
      else if (isPlainObject(config)) {
        ownSettings = clone(config);
      }
    }

    each(this.baseSettings, (_, key) => {
      if (!Object.hasOwn(ownSettings, key)) {
        Object.defineProperty(ownSettings, key, {
          get: () => this.settings[key],
          set: (value) => {
            this.settings[key] = value;
          },
          enumerable: true,
          configurable: true,
        });
      }
    });

    return Plugin.createReactiveProxy(ownSettings);
  }

  isApplicable(template, config, settings, componentSettings) {
    const { appliesTo } = this;

    if (appliesTo === 'all' || appliesTo === 'templates') {
      return true;
    }

    const isSubtemplate = template.isSubtemplate();
    // subtemplates read from host
    const tagName = isSubtemplate
      ? template.tagName
      : (template.tagName || template.element?.tagName?.toLowerCase());
    const templateName = template.templateName;

    if (appliesTo === 'configured') {
      return config !== undefined;
    }
    if (!appliesTo || appliesTo === 'components') {
      return !isSubtemplate || config !== undefined;
    }

    // check users applies to if its a func
    if (isFunction(appliesTo)) {
      return Boolean(appliesTo({
        config,
        tagName,
        templateName,
        isSubtemplate,
        settings,
        componentSettings,
        el: template.element,
        template,
      }));
    }

    const targets = isArray(appliesTo) ? appliesTo : [appliesTo];
    return any(targets, (target) => (
      isString(target) && (
        (tagName && target.toLowerCase() === tagName)
        || target === templateName
      )
    ));
  }

  // applies a plugin to a template
  applyTo(template, userConfig) {
    if (!isFunction(this.appliesTo) && !this.isApplicable(template, userConfig)) {
      return;
    }

    const componentSettings = template.settings || template.element?.settings;
    const baseParams = template.buildCallParams();
    const settings = this.resolveSettings(baseParams, userConfig, componentSettings);

    if (isFunction(this.appliesTo) && !this.isApplicable(template, userConfig, settings, componentSettings)) {
      return;
    }

    const plugin = new Plugin({
      template,
      namespace: this.namespace,
      appliesTo: this.appliesTo,
      params: this.params,
      templateHelpers: this.templateHelpers,
      createPlugin: this.createPlugin,
      sharedState: this.sharedState,
      onCreated: this.onCreatedCallback,
      onRendered: this.onRenderedCallback,
      onDestroyed: this.onDestroyedCallback,
      userConfig,
      settings,
    });
    template.addPlugin(plugin);
    return plugin;
  }

  attachElement() {
    const { template, namespace, instance } = this;
    if (template.isSubtemplate() || !template.element) {
      return;
    }
    const el = template.element;
    el.plugins ??= {};
    el.plugins[namespace] = instance;
    if (!(namespace in el)) {
      el[namespace] = instance;
    }
  }

  detachElement() {
    const { template, namespace, instance } = this;
    if (template.isSubtemplate() || !template.element) {
      return;
    }
    const el = template.element;
    if (el.plugins?.[namespace] === instance) {
      delete el.plugins[namespace];
    }
    if (el[namespace] === instance) {
      delete el[namespace];
    }
  }
}
