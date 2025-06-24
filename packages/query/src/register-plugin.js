import { noop } from '@semantic-ui/utils';
import { Query } from './query.js';
import { Plugin } from './plugin.js';

export const registerPlugin = function({
  name, // name of plugin

  defaultSettings = {}, // settings for plugin
  namespace = `plugin${name}`,

  onCreated = noop,
  onDestroyed = noop,
  createPlugin = noop,
} = {}) {

  if (name) {
    throw new Error('Plugin must have a name');
  }
  if (Query.plugins.has(name)) {
    throw new Error('Plugin name already in use', plugin.name);
  }

  const plugin = new Plugin({
    name,
    defaultSettings,
    namespace,
    onCreated,
    onDestroyed,
    createPlugin
  });

  Query.plugins.set(name, {
    settings,
    plugin
  });

  // Extend Query prototype with the plugin function
  Query.prototype[plugin.name] = plugin.initialize;
};
