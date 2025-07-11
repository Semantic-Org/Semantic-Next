import { capitalize, noop } from '@semantic-ui/utils';
import { Plugin } from './plugin.js';
import { Query } from './query.js';

export const registerPlugin = (plugin) => {
  const {
    name,
    defaultSettings = {},
    createPlugin = noop,
    events = {},
    onCreate = noop,
    onDestroy = noop,
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

  const namespace = `plugin${capitalize(name)}`;

  const pluginDef = {
    ...plugin,
    namespace,
  };

  // Register this plugin
  Query.plugins.set(name, pluginDef);

  Query.prototype[name] = function(settings) {
    // Retrieve the current defaults -- they might be overwritten by end user
    const { defaultSettings, classNames, errors, selectors } = Query.prototype[name];

    settings = {
      ...defaultSettings,
      ...settings,
    };

    // store reference to all elements
    const $elements = this;

    // check if we're calling a method
    let methodInvoked, methodArguments;
    if (isString(settings[0])) {
      [methodInvoked, ...methodArguments] = arguments;
    }

    // value to store return
    let returnedValue;

    $allElements.each(($el, el, index) => {
      const element = this;

      const instance = element[namespace];

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

        new PluginInstance(element, $element, plugin, settings);
      }
    });

    return (returnedValue !== undefined)
      ? returnedValue
      : $allElements;
  };

  // Expose settings, class names and errors on the prototype
  // This allows end-users to override the defaults
  Query.prototype[name].defaultSettings = defaultSettings;
  Query.prototype[name].classNames = classNames;
  Query.prototype[name].errors = errors;
};
