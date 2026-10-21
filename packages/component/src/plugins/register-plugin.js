import { isClient, isServer } from '@semantic-ui/utils';

/*******************************
            Plugins
*******************************/

const plugins = new Map();
export const addRegisteredPlugin = (name, plugin) => plugins.set(name, plugin);
export const getRegisteredPlugin = (name) => plugins.get(name);

/*******************************
       Available Plugins
*******************************/

export const registerPlugin = (plugin = {}) => {
  // namespace defaults to name if not specified
  plugin.namespace = plugin?.namespace || plugin?.name;
  if (!isString(plugin.namespace)) {
    throwError('pluginNamespaceRequired', String(namespace ?? ''), {
      explanation: isDevelopment
        ? 'registerPlugin requires a namespace string.'
        : 0,
    });
  }

  const defaults = {
    defaultSettings: {},
    appliesTo: 'components',
  };

  plugin = {
    ...defaults,
    ...plugin,
  };

  // register it globally
  addRegisteredPlugin(namespace, definition);

  return definition;
};
