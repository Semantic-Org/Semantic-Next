import { createErrors, isDevelopment, isString } from '@semantic-ui/utils';

const { throwError } = createErrors({ namespace: 'component' });

/*******************************
       Registered Plugins
*******************************/

export const registeredPlugins = new Map();
export const addRegisteredPlugin = (name, plugin) => registeredPlugins.set(name, plugin);
export const getRegisteredPlugin = (name) => registeredPlugins.get(name);
export const clearRegisteredPlugins = () => registeredPlugins.clear();

/*******************************
        Register Plugin
*******************************/

export const registerPlugin = (plugin = {}) => {
  // namespace defaults to name if not specified
  const namespace = plugin?.namespace || plugin?.name;
  if (!namespace || !isString(namespace)) {
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

  const definition = {
    ...defaults,
    ...plugin,
    namespace,
  };

  // register it globally
  addRegisteredPlugin(namespace, definition);

  return definition;
};
