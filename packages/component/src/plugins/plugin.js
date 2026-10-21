import { extend } from '@semantic-ui/utils';

export class Plugin {
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
    defaultSettings = {},
    userConfig = {}, // users configuration for this plugin
    namespace, // name for this plugin
    template, // current template being applied to
    appliesTo, // conditions for this template
    params, // what params should be added to lifecycle events
    templateHelpers, // template helpers to be added to templates
  } = {}) {
    this.isPrototype = true;
    this.template = template;

    extend(this, {
      isPrototype: template === undefined,
      namespace,
      appliesTo,
      params,
      templateHelpers,
    });

    if (isPlainObject(templateHelpers)) {
      registerHelpers(templateHelpers);
    }
    if (isFunction(plugin.setup)) {
      globalState = plugin.setup({
        settings,
        isServer,
        isClient,
        namespace,
      }) || {};
    }
  }

  isApplicable(template) {
    if (appliesTo === 'all' || appliesTo === 'templates') {
      return true;
    }

    const isSubtemplate = template.isSubtemplate();
    // subtemplates read from host
    const tagName = isSubtemplate
      ? template.tagName
      : (template.tagName || template.element?.tagName?.toLowerCase());

    if (appliesTo === 'configured') {
      return config !== undefined;
    }
    if (!appliesTo || appliesTo === 'components') {
      return !isSubtemplate || config !== undefined;
    }

    // check users applies to if its a func
    if (isFunction(appliesTo)) {
      return appliesTo({
        config,
        tagName,
        settings,
        componentSettings,
        el: template.element,
        template,
      });
    }

    const targets = isArray(appliesTo) ? appliesTo : [appliesTo];
    return any(targets, (target) => (
      isString(target) && (
        (tagName && target === tagName)
        || target === templateName
      )
    ));
  }

  // applies a plugin to a template
  applyTo(template, userConfig) {
    if (!this.isApplicable(template)) {
      return;
    }
    const plugin = new Plugin({
      template,
      namespace,
      appliesTo,
      params,
      templateHelpers,
      userConfig,
    });
    template.addPlugin(plugin);
  }
}
