
export const Plugin = class Plugin {
  constructor({
    namespace = `plugin${name}`,

    onCreated = noop,
    onDestroyed = noop,
    createPlugin = noop,
    isPrototype = true
  } = {}) {

    this.onCreated = onCreated;
    this.onDestroyed = onDestroyed;
    this.isPrototype = true;
  }

  initialize() {
    const clonedPlugin = {
      isPrototype: false,
      onCreated: this.onCreated,
      onDestroyed: this.onDestroyed,
      createPlugin: this.createPlugin,
      settings: this.settings,
    };
    return new Plugin({
      ...clonedPlugin,
      settings,
    })

  }
};
