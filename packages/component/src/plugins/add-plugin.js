import { Plugin } from './plugin.js';

/*******************************
          User Plugins
*******************************/

/* These are plugins enabled by a user with configs */

const userPlugins = new Map();
export const addUserPlugin = (name, plugin) => userPlugins.set(name, plugin);
export const getUserPlugin = (name, plugin) => userPlugins.set(name, plugin);

/*******************************
          Add Plugin
*******************************/

export const addPlugin = (plugin, userSettings = {}) => {
  if (isString(plugin)) {
    plugin = getRegisteredPlugin(plugin);
    if (!definition) {
      throwError('pluginNotRegistered', plugin, {
        explanation: isDevelopment
          ? `Plugin "${plugin}" is not registered. Call registerPlugin first or pass the plugin object.`
          : 0,
      });
    }
  }
  else if (isObject(plugin)) {
    plugin = registerPlugin(plugin);
  }
  else {
    throwError('invalidPlugin', String(plugin), {
      explanation: isDevelopment
        ? 'addPlugin expects a registered plugin definition or namespace string.'
        : 0,
    });
  }

  const { namespace } = plugin;

  // create the settings and wrap them in signals
  const settings = createSettingsProxy({
    ...plugin.defaultSettings,
    ...userSettings,
  });

  const userPlugin = new Plugin({
    ...plugin,
    namespace,
    templateHelpers: plugin.templateHelpers,
    params: plugin.params,
  });

  addUserPlugin(namespace, userPlugin);

  return userPlugin;
};
