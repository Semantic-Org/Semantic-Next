import { createErrors, isDevelopment, isObject, isString } from '@semantic-ui/utils';

import { Plugin } from './plugin.js';
import { getRegisteredPlugin, registerPlugin } from './register-plugin.js';

const { throwError } = createErrors({ namespace: 'component' });

/*******************************
          User Plugins
*******************************/

/* These are plugins enabled by a user with configs */

export const userPlugins = new Map();
export const addUserPlugin = (name, plugin) => userPlugins.set(name, plugin);
export const getUserPlugin = (name) => userPlugins.get(name);
export const clearUserPlugins = () => userPlugins.clear();

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

  const userPlugin = new Plugin({
    ...definition,
    userSettings,
  });

  addUserPlugin(namespace, userPlugin);

  return userPlugin;
};
