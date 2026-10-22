import { createErrors, isDevelopment, isObject, isString } from '@semantic-ui/utils';

import { Plugin } from './plugin.js';
import { getRegisteredPlugin, registerPlugin } from './register-plugin.js';

const { throwError } = createErrors({ namespace: 'component' });

/*******************************
        Available Plugins
*******************************/

/* These are plugins enabled by a user with configs */

export const availablePlugins = new Map();
export const addAvailablePlugin = (name, plugin) => availablePlugins.set(name, plugin);
export const getAvailablePlugin = (name) => availablePlugins.get(name);
export const clearAvailablePlugins = () => availablePlugins.clear();

/*******************************
          Add Plugin
*******************************/

export const addPlugin = (plugin, userSettings = {}) => {
  let definition;
  if (isString(plugin)) {
    definition = getRegisteredPlugin(plugin);
    if (!definition) {
      throwError('pluginNotRegistered', plugin, {
        explanation: isDevelopment
          ? `Plugin "${plugin}" is not registered. Call registerPlugin first or pass the plugin object.`
          : 0,
      });
    }
  }
  else if (isObject(plugin)) {
    definition = registerPlugin(plugin);
  }
  else {
    throwError('invalidPlugin', String(plugin), {
      explanation: isDevelopment
        ? 'addPlugin expects a registered plugin definition or namespace string.'
        : 0,
    });
  }

  const { namespace } = definition;

  const availablePlugin = new Plugin({
    ...definition,
    userSettings,
  });

  addAvailablePlugin(namespace, availablePlugin);

  return availablePlugin;
};
