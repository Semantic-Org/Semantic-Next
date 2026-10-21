import { signal } from '@semantic-ui/reactivity';
import { registerHelpers, TemplateHelpers } from '@semantic-ui/templating';
// direct import avoids circular chunk dependency between component and templating
import { Template } from '@semantic-ui/templating/template';
import {
  any,
  createErrors,
  createLogger,
  deepExtend,
  each,
  extend,
  isArray,
  isClassInstance,
  isDevelopment,
  isFunction,
  isObject,
  isPlainObject,
  isString,
  keys,
  noop,
} from '@semantic-ui/utils';

const { throwError } = createErrors({ namespace: 'component' });

let extendCount = 0;

/*******************************
         Plugin Helpers
*******************************/

function createPluginLogger(namespace) {
  const logger = createLogger({ namespace });
  const wrap = (emit) => (message, ...data) => {
    const options = data.length === 1 && isPlainObject(data[0])
      ? data[0]
      : (data.length ? { data } : undefined);
    return emit(message, options);
  };
  return {
    ...logger,
    log: wrap((message, options) => logger.log(message, 'log', options)),
    debug: wrap(logger.debug),
    info: wrap(logger.info),
    warn: wrap(logger.warn),
    error: wrap(logger.error),
  };
}

function createPerformanceProxy(target, namespace) {
  return new Proxy(target, {
    get(obj, prop) {
      if (!isString(prop) || prop === 'constructor' || prop.startsWith('_')) {
        return obj[prop];
      }
      const value = obj[prop];
      if (!isFunction(value) || isClassInstance(value)) {
        return value;
      }
      return (...args) => {
        const startMark = `${namespace}:${prop}-start`;
        const endMark = `${namespace}:${prop}-end`;
        performance.mark(startMark);
        const result = value.apply(obj, args);
        performance.mark(endMark);
        performance.measure(`${namespace}:${prop}`, startMark, endMark);
        return result;
      };
    },
  });
}

function createSettingsProxy(target, settingsVars, fallbackProxy, fallbackBase) {
  return new Proxy(target, {
    get(obj, prop) {
      if (!isString(prop)) {
        return obj[prop];
      }
      if (fallbackProxy && !Object.hasOwn(obj, prop) && Object.hasOwn(fallbackBase, prop)) {
        return fallbackProxy[prop];
      }
      if (!Object.hasOwn(obj, prop) && prop in Object.prototype) {
        return obj[prop];
      }
      let settingSignal = settingsVars.get(prop);
      if (!settingSignal) {
        settingSignal = signal(obj[prop], { safety: 'reference' });
        settingsVars.set(prop, settingSignal);
      }
      settingSignal.depend();
      return obj[prop];
    },
    set(obj, prop, value) {
      // shared settings not overridden by this component write through to the plugin proxy
      if (fallbackProxy && !Object.hasOwn(obj, prop) && Object.hasOwn(fallbackBase, prop)) {
        fallbackProxy[prop] = value;
        return true;
      }
      obj[prop] = value;
      let settingSignal = settingsVars.get(prop);
      if (settingSignal) {
        settingSignal.set(value);
      }
      else {
        settingSignal = signal(value, { safety: 'reference' });
        settingsVars.set(prop, settingSignal);
      }
      return true;
    },
  });
}

/*******************************
      Lifecycle & Scoping
*******************************/

function matchesAppliesTo(template, appliesTo, config, settings, componentSettings) {
  const isSubtemplate = template.isSubtemplate();
  // subtemplates borrow the host element, so only read element.tagName on the host itself
  const tagName = isSubtemplate
    ? template.tagName
    : (template.tagName || template.element?.tagName?.toLowerCase());
  const templateName = template.templateName;

  if (appliesTo === 'all' || appliesTo === 'templates') {
    return true;
  }
  if (appliesTo === 'configured') {
    return config !== undefined;
  }
  if (!appliesTo || appliesTo === 'components') {
    return !isSubtemplate || config !== undefined;
  }
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

function attachElementPlugin(template, namespace, self) {
  if (template.isSubtemplate() || !template.element) {
    return;
  }
  const el = template.element;
  el.plugins ??= {};
  el.plugins[namespace] = self;
  if (!(namespace in el)) {
    el[namespace] = self;
  }
}

function detachElementPlugin(template, namespace, self) {
  if (template.isSubtemplate() || !template.element) {
    return;
  }
  const el = template.element;
  if (el.plugins?.[namespace] === self) {
    delete el.plugins[namespace];
  }
  if (el[namespace] === self) {
    delete el[namespace];
  }
}

function resolveInstanceSettings(template, entry, config, componentSettings) {
  const { definition, baseSettings, pluginSettings, sharedState, logger } = entry;
  const namespace = definition.namespace;

  if (
    config !== undefined
    && !isFunction(definition.resolveSettings)
    && !isPlainObject(config)
    && keys(baseSettings).length === 0
  ) {
    return config;
  }

  const ownSettings = {};
  if (config !== undefined) {
    if (isFunction(definition.resolveSettings)) {
      const seedTarget = isPlainObject(config) ? deepExtend({}, config) : {};
      // proxy reads baseSettings as fallback while {...settings} only spreads own overrides
      const seed = new Proxy(seedTarget, {
        get(target, prop) {
          if (!isString(prop) || Object.hasOwn(target, prop)) {
            return target[prop];
          }
          return baseSettings[prop];
        },
      });
      const resolveBag = extend({}, template.buildCallParams(), {
        self: sharedState,
        plugin: sharedState,
        settings: seed,
        config,
        componentSettings,
        namespace,
        ...logger,
      });
      const resolved = definition.resolveSettings(resolveBag);
      if (isPlainObject(resolved)) {
        deepExtend(ownSettings, resolved);
      }
    }
    else if (isPlainObject(config)) {
      deepExtend(ownSettings, config);
    }
  }

  return createSettingsProxy(ownSettings, new Map(), pluginSettings, baseSettings);
}

function syncPluginBagParams(template) {
  if (!template.pluginCallParams || !template._activePlugins) {
    return;
  }
  each(template._activePlugins, ({ pluginBag }) => {
    for (const key in template.pluginCallParams) {
      const desc = Object.getOwnPropertyDescriptor(template.pluginCallParams, key);
      if (desc) {
        Object.defineProperty(pluginBag, key, desc);
      }
    }
  });
}

function initializeTemplatePlugins(template) {
  if (Template.plugins.size === 0) {
    return;
  }

  const definitionOptions = template.definitionOptions || {};
  const componentSettings = template.settings || template.element?.settings;

  for (const [namespace, entry] of Template.plugins) {
    const { definition, sharedState, logger } = entry;
    const config = definitionOptions[namespace];

    if (!isFunction(definition.appliesTo) && !matchesAppliesTo(template, definition.appliesTo, config)) {
      continue;
    }

    const settings = resolveInstanceSettings(template, entry, config, componentSettings);

    if (
      isFunction(definition.appliesTo)
      && !matchesAppliesTo(template, definition.appliesTo, config, settings, componentSettings)
    ) {
      continue;
    }

    const rawSelf = Object.create(isObject(sharedState) ? sharedState : null);
    const self = definition.logPerformance
      ? createPerformanceProxy(rawSelf, namespace)
      : rawSelf;

    const pluginBag = extend({}, template.buildCallParams(), {
      self,
      plugin: self,
      settings,
      config,
      componentSettings,
      namespace,
      get el() {
        return template.element;
      },
      get helpers() {
        return template.helpers || TemplateHelpers;
      },
      ...logger,
    });

    if (isFunction(definition.createPlugin)) {
      const instanceMethods = definition.createPlugin.call(self, pluginBag);
      if (isObject(instanceMethods)) {
        extend(rawSelf, instanceMethods);
      }
    }

    template.plugins ??= {};
    template.plugins[namespace] = self;
    attachElementPlugin(template, namespace, self);

    if (isFunction(rawSelf.initialize)) {
      rawSelf.initialize.call(self, pluginBag);
    }

    if (definition.lifecycleParams) {
      const params = isFunction(definition.lifecycleParams)
        ? definition.lifecycleParams.call(self, pluginBag)
        : definition.lifecycleParams;
      if (isObject(params)) {
        template.pluginCallParams ??= {};
        extend(template.pluginCallParams, params);
      }
    }

    if (isFunction(definition.templateHelpers)) {
      const helpers = definition.templateHelpers.call(self, pluginBag);
      if (isObject(helpers)) {
        template.helpers ??= Object.create(TemplateHelpers);
        extend(template.helpers, helpers);
      }
    }

    (template._activePlugins ??= []).push({
      namespace,
      definition,
      self,
      pluginBag,
    });
  }

  if (template._activePlugins?.length) {
    syncPluginBagParams(template);

    template.runPlugins = (hook) => {
      if (hook === 'onCreated') {
        syncPluginBagParams(template);
      }
      each(template._activePlugins, ({ namespace, definition, self, pluginBag }) => {
        if (hook === 'onRendered') {
          attachElementPlugin(template, namespace, self);
        }
        if (isFunction(definition[hook]) && definition[hook] !== noop) {
          definition[hook].call(self, pluginBag);
        }
        if (hook === 'onDestroyed') {
          detachElementPlugin(template, namespace, self);
        }
      });
    };
  }
}

/*******************************
       Public Registration
*******************************/

export const registerPlugin = (plugin = {}) => {
  const namespace = plugin?.namespace || plugin?.name;
  if (!namespace || !isString(namespace)) {
    throwError('pluginNamespaceRequired', String(namespace ?? ''), {
      explanation: isDevelopment
        ? 'registerPlugin requires a namespace string.'
        : 0,
    });
  }

  const definition = {
    defaultSettings: {},
    resolveSettings: undefined,
    setup: undefined,
    createPlugin: undefined,
    lifecycleParams: undefined,
    templateHelpers: undefined,
    onCreated: noop,
    onRendered: noop,
    onDestroyed: noop,
    appliesTo: 'components',
    logPerformance: false,
    ...plugin,
    namespace,
  };

  Template.registeredPlugins.set(namespace, definition);
  return definition;
};

export const removePlugin = (PluginOrNamespace) => {
  const namespace = isString(PluginOrNamespace)
    ? PluginOrNamespace
    : (PluginOrNamespace?.namespace || PluginOrNamespace?.name);
  const entry = Template.plugins.get(namespace);
  if (!entry) {
    return false;
  }
  if (entry.previousHelpers) {
    entry.previousHelpers.forEach((desc, key) => {
      if (desc) {
        Object.defineProperty(TemplateHelpers, key, desc);
      }
      else {
        delete TemplateHelpers[key];
      }
    });
  }
  Template.plugins.delete(namespace);
  return true;
};

export const clearPlugins = () => {
  const activeNamespaces = [...Template.plugins.keys()].reverse();
  each(activeNamespaces, (namespace) => removePlugin(namespace));
  Template.registeredPlugins.clear();
};

export const addPlugin = (PluginOrNamespace, appSettings = {}) => {
  let definition;
  if (isString(PluginOrNamespace)) {
    definition = Template.registeredPlugins.get(PluginOrNamespace);
    if (!definition) {
      throwError('pluginNotRegistered', PluginOrNamespace, {
        explanation: isDevelopment
          ? `Plugin "${PluginOrNamespace}" is not registered. Call registerPlugin first or pass the plugin object.`
          : 0,
      });
    }
  }
  else if (isObject(PluginOrNamespace)) {
    definition = registerPlugin(PluginOrNamespace);
  }
  else {
    throwError('invalidPlugin', String(PluginOrNamespace), {
      explanation: isDevelopment
        ? 'addPlugin expects a registered plugin definition or namespace string.'
        : 0,
    });
  }

  const { namespace } = definition;
  if (Template.plugins.has(namespace)) {
    removePlugin(namespace);
  }

  const baseSettings = deepExtend({}, definition.defaultSettings, appSettings);
  const settingsVars = new Map();
  const pluginSettings = createSettingsProxy(baseSettings, settingsVars);
  const logger = createPluginLogger(namespace);

  let sharedState = {};
  if (isFunction(definition.setup)) {
    sharedState = definition.setup({
      settings: pluginSettings,
      isServer: Template.isServer,
      isClient: !Template.isServer,
      namespace,
      ...logger,
    }) || {};
  }

  let previousHelpers;
  if (isPlainObject(definition.templateHelpers)) {
    previousHelpers = new Map();
    each(keys(definition.templateHelpers), (key) => {
      previousHelpers.set(key, Object.getOwnPropertyDescriptor(TemplateHelpers, key));
    });
    registerHelpers(definition.templateHelpers);
  }

  const entry = {
    namespace,
    definition,
    baseSettings,
    pluginSettings,
    settingsVars,
    sharedState,
    logger,
    previousHelpers,
  };

  Template.initializePlugins = initializeTemplatePlugins;
  Template.clearPlugins = clearPlugins;
  Template.plugins.set(namespace, entry);
  return entry;
};

export const extendParams = (params) => {
  return addPlugin({
    namespace: `params_${++extendCount}`,
    appliesTo: 'all',
    lifecycleParams: params,
  });
};
