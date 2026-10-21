import { signal } from '@semantic-ui/reactivity';
import { registerHelpers, TemplateHelpers } from '@semantic-ui/templating';
// direct import avoids circular chunk dependency between component and templating
import { Template } from '@semantic-ui/templating/template';
import {
  any,
  clone,
  createErrors,
  each,
  extend,
  isArray,
  isDevelopment,
  isFunction,
  isObject,
  isPlainObject,
  isString,
  keys,
} from '@semantic-ui/utils';

const { throwError } = createErrors({ namespace: 'component' });

let extendCount = 0;

/*******************************
         Settings Proxy
*******************************/

function createSettingsProxy(target, settingsVars = new Map(), fallbackProxy, fallbackBase) {
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

function resolveInstanceSettings(baseParams, entry, config, componentSettings) {
  const { definition, baseSettings, pluginSettings, sharedState } = entry;

  if (
    config !== undefined
    && !isFunction(definition.resolveSettings)
    && !isPlainObject(config)
    && keys(baseSettings).length === 0
  ) {
    return config;
  }

  let ownSettings = {};
  if (config !== undefined) {
    if (isFunction(definition.resolveSettings)) {
      // prototype fallback reads baseSettings while {...settings} only spreads own overrides
      const seed = Object.assign(
        Object.create(baseSettings),
        isPlainObject(config) ? clone(config) : null,
      );
      const resolved = definition.resolveSettings(extend({}, baseParams, {
        self: sharedState,
        plugin: sharedState,
        settings: seed,
        config,
        componentSettings,
        namespace: definition.namespace,
      }));
      if (isObject(resolved)) {
        ownSettings = clone({ ...resolved });
      }
    }
    else if (isPlainObject(config)) {
      ownSettings = clone(config);
    }
  }

  return createSettingsProxy(ownSettings, new Map(), pluginSettings, baseSettings);
}

function initializeTemplatePlugins(template) {
  if (Template.plugins.size === 0) {
    return;
  }

  const definitionOptions = template.definitionOptions || {};
  const componentSettings = template.settings || template.element?.settings;
  const baseParams = template.buildCallParams();

  for (const [namespace, entry] of Template.plugins) {
    const { definition, sharedState } = entry;
    const config = definitionOptions[namespace];

    if (!isFunction(definition.appliesTo) && !matchesAppliesTo(template, definition.appliesTo, config)) {
      continue;
    }

    const settings = resolveInstanceSettings(baseParams, entry, config, componentSettings);

    if (
      isFunction(definition.appliesTo)
      && !matchesAppliesTo(template, definition.appliesTo, config, settings, componentSettings)
    ) {
      continue;
    }

    const self = Object.create(isObject(sharedState) ? sharedState : null);
    const pluginBag = extend({}, baseParams, {
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
    });

    if (isFunction(definition.createPlugin)) {
      const instanceMethods = definition.createPlugin.call(self, pluginBag);
      if (isObject(instanceMethods)) {
        extend(self, instanceMethods);
      }
    }

    template.plugins ??= {};
    template.plugins[namespace] = self;
    attachElementPlugin(template, namespace, self);

    if (isFunction(self.initialize)) {
      self.initialize.call(self, pluginBag);
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
    template.runPlugins = (hook) => {
      each(template._activePlugins, ({ namespace, definition, self, pluginBag }) => {
        if (hook === 'onRendered') {
          attachElementPlugin(template, namespace, self);
        }
        if (isFunction(definition[hook])) {
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
    appliesTo: 'components',
    ...plugin,
    namespace,
  };

  Template.registeredPlugins.set(namespace, definition);
  return definition;
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
  const baseSettings = clone({ ...definition.defaultSettings, ...appSettings });
  const settingsVars = new Map();
  const pluginSettings = createSettingsProxy(baseSettings, settingsVars);

  let sharedState = {};
  if (isFunction(definition.setup)) {
    sharedState = definition.setup({
      settings: pluginSettings,
      isServer: Template.isServer,
      isClient: !Template.isServer,
      namespace,
    }) || {};
  }

  if (isPlainObject(definition.templateHelpers)) {
    registerHelpers(definition.templateHelpers);
  }

  const entry = {
    namespace,
    definition,
    baseSettings,
    pluginSettings,
    settingsVars,
    sharedState,
  };

  Template.initializePlugins = initializeTemplatePlugins;
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
