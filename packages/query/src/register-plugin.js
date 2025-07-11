import { capitalize, isString, noop } from '@semantic-ui/utils';
import { Plugin } from './plugin.js';
import { Query } from './query.js';

// Register Plugin
export const registerPlugin = (plugin) => {
  const {
    name,

    // settings for plugin
    defaultSettings = {},

    // returns plugin instance
    createPlugin = noop,

    // event object
    events = {},

    // callbacks
    onCreated = noop,
    onMutated = noop,
    onDestroyed = noop,

    // standard
    selectors = {},
    classNames = {},
    errors = {},
  } = plugin;

  if (!name) {
    throw new Error('Plugin must have a name');
  }

  if (Query.plugins.has(name)) {
    throw new Error(`Plugin '${name}' already registered`);
  }

  const pluginDefaults = {
    namespace: `plugin${capitalize(name)}`,
  };

  plugin = {
    ...pluginDefaults,
    ...plugin,
  };

  // Register this plugin
  Query.plugins.set(name, plugin);

  // Create abstraction around plugin initialization
  console.log('adding func name');
  Query.prototype[name] = function(settings) {
    // Retrieve the current defaults in case they are modified
    const {
      defaultSettings,
      classNames,
      errors,
      selectors,
    } = Query.prototype[name];

    settings = {
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

    $elements.each((element, index) => {
      const instance = element[plugin.namespace];
      if (!instance) {
        // create plugin instance
      }

      if (methodInvoked) {
      }
      else {
        // Initialize
        if (instance !== undefined) {
          instance.destroy();
        }
        // new Plugin(element, plugin);
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
  Query.prototype[name].errors = errors;
};
