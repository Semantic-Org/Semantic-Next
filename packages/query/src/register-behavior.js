import { pick, isString, isArray, noop, clone, deepExtend } from '@semantic-ui/utils';
import { Plugin } from './plugin.js';
import { Query } from './query.js';

// Register Behavior
export const registerBehavior = (plugin) => {

  const pluginDefaults = {
    name: undefined,
    css: undefined,
    // storage in el
    namespace: plugin?.name,
    // settings for plugin
    defaultSettings: {},
    // returns plugin instance
    createPlugin: noop,
    // event object
    events: {},
    // mutation observer object
    mutations: {},
    // whether html data can override settings
    allowDataOverride: true,
    // one time setup callback
    setup: noop,
    // callbacks
    onCreated: noop,
    onMutated: noop,
    onDestroyed: noop,
    // standard object storage
    selectors: {},
    classNames: {},
    errors: {},
    templates: {},
  };

  plugin = {
    ...pluginDefaults,
    ...plugin
  };
  // handle default namespace
  if(!plugin.namespace) {
    plugin.namespace = plugin.name;
  }

  // shorthand
  let {
    namespace,
    name,
    defaultSettings,
    selectors,
    classNames,
    errors,
    templates,
  } = plugin;

  let isSetup = false;

  if (!name) {
    throw new Error('Plugin must have a name');
  }

  // may be called via side effects which should not throw an error
  // when multiple components rely on same plugin
  if (Query.behaviors.has(name)) {
    return;
  }

  // Register this behavior
  Query.behaviors.set(name, plugin);

  // setup() can setup a shared plugin that is preserved across calls
  let sharedPlugin;

  // Create abstraction around plugin initialization
  Query.prototype[name] = function(settings) {


    // At run time we need to check if defaults are changed from original registration
    const defaultValues = ['defaultSettings', 'classNames', 'errors', 'selector'];
    const pluginDefaults = pick(Query.prototype[name], ...defaultValues);
    const runtimePluginConfig = {
      ...pluginDefaults,
      ...plugin,
    };

    // when this element is initialized we create run time settings
    // this looks at current default settings at time of init
    // use deepExtend to properly merge nested objects like selectors, classNames, etc.
    const runtimeSettings = deepExtend({}, defaultSettings, settings);

    // store reference to all elements
    const $elements = this;

    // check if we're calling a method (string as first param)
    let methodName, methodArguments;
    if (isString(arguments[0])) {
      [methodName, ...methodArguments] = arguments;
    }
    // value to store return
    let returnedValue;

    $elements.each(function(element, index) {

      // handle setup function on first invocation
      if(!isSetup) {
        sharedPlugin = Plugin.callSetupMethod(plugin.setup, { $elements, settings, templates }) ?? {};
        isSetup = true;
      }

      const $element = this;

      // plugin is stored in namespace like el.plugin
      const instance = Plugin.getPluginInstance(element, namespace);

      // create plugin instance if not defined
      // this might even occur if a method is invoked
      // if this method has no instance defined
      if (!instance) {
        new Plugin({
          initialPlugin: sharedPlugin, // setup can pass through props in setup
          $element,
          self,
          ...runtimePluginConfig,
          settings: runtimeSettings
        });
      }

      if (methodName) {
        const response = instance.callPluginMethod(methodName, ...methodArguments);

        // Collect return values using original SUI pattern
        if (isArray(returnedValue)) {
          returnedValue.push(response);
        }
        else if (returnedValue !== undefined) {
          // Only create array if values are different
          if (returnedValue !== response) {
            returnedValue = [returnedValue, response];
          }
          // If same value, keep the single value (don't create array)
        }
        else if (response !== undefined) {
          returnedValue = response;
        }
      }
      else if(instance !== undefined) {
        // if they are not calling a method and there are settings
        // than they are attempting to reinitialize the plugin with new settings
        instance.reinitialize(settings);
      }
    });


    return (returnedValue !== undefined)
      ? returnedValue
      : $elements;
  };

  // preserve shared plugin from setup()
  Query.prototype[name].sharedPlugin = sharedPlugin;

  // Expose settings, class names and errors on the prototype
  // This allows end-users to override the defaults
  Query.prototype[name].defaultSettings = defaultSettings;
  Query.prototype[name].classNames = classNames;
  Query.prototype[name].selectors = selectors;
  Query.prototype[name].errors = errors;

};
