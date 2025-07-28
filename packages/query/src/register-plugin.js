import { capitalize, isString, noop, wrapFunction } from '@semantic-ui/utils';
import { Plugin } from './plugin.js';
import { Query } from './query.js';

// Register Plugin
export const registerPlugin = (plugin) => {
  let {

    name,

    namespace = name,

    // settings for plugin
    defaultSettings = {},

    // returns plugin instance
    createPlugin = noop,

    // event object
    events = {},

    // whether html data can override settings
    allowDataOverride = true,

    // one time setup callback
    setup = noop,

    // callbacks
    onCreated = noop,
    onMutated = noop,
    onDestroyed = noop,

    // standard
    selectors = {},
    classNames = {},
    errors = {},
  } = plugin;

  let isSetup = false;

  if (!name) {
    throw new Error('Plugin must have a name');
  }

  // may be called via side effects which should not throw an error
  // when multiple components rely on same plugin
  if (Query.plugins.has(name)) {
    return;
  }

  // Register this plugin
  Query.plugins.set(name, plugin);

  // Create abstraction around plugin initialization
  Query.prototype[name] = function(settings) {

    const QueryInstance = this;

    // allow setup function
    if(!isSetup) {
      wrapFunction(plugin.setup)();
    }

    // Retrieve the current defaults in case they are modified
    const {
      defaultSettings,
      classNames,
      errors,
      selectors,
      setup,
    } = Query.prototype[name];

    // when this element is initialized we create run time settings
    // this looks at current default settings at time of init
    const runtimeSettings = {
      ...defaultSettings,
      ...settings,
    };

    // store reference to all elements
    const $elements = this;

    // check if we're calling a method
    let methodInvoked, methodArguments;
    if (isString(arguments[0])) {
      [methodInvoked, ...methodArguments] = arguments;
    }

    // value to store return
    let returnedValue;

    $elements.each(function(element, index) {

      const $element = this;
      const instance = Plugin.getPluginInstance(element, namespace);

      // create plugin instance if not defined
      // this might even occur if a method is invoked
      // if this method has no instance defined
      if (!instance) {
        const pluginInstance = new Plugin({
          $element,
          ...plugin,
          settings: runtimeSettings
        });
      }

      if (methodInvoked) {
        returnedValue = instance.call(methodArguments);
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

  // Expose settings, class names and errors on the prototype
  // This allows end-users to override the defaults
  Query.prototype[name].defaultSettings = defaultSettings;
  Query.prototype[name].classNames = classNames;
  Query.prototype[name].selectors = selectors;
  Query.prototype[name].errors = errors;

};
