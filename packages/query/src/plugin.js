class PluginInstance {
  constructor(element, $element, plugin, settings) {
    this.element = element;
    this.$element = $element;
    this.plugin = plugin;
    this.settings = { ...plugin.defaultSettings, ...settings };
    this.namespace = plugin.namespace;

    // Create context for all plugin functions
    this.context = {
      element,
      $element,
      settings: this.settings,
      dispatchEvent: this.dispatchEvent.bind(this),
      data: element.dataset,
    };

    // Get methods from createPlugin
    if (plugin.createPlugin) {
      const methods = plugin.createPlugin(this.context);
      each(methods, (method, name) => {
        this[name] = method;
      });
    }

    // Bind events
    this.bindEvents();

    // Store on element
    element[this.namespace] = this;

    // Lifecycle
    plugin.onCreate?.(this.context);
    this.initialize?.();
  }

  bindEvents() {
    this.eventHandlers = [];

    each(this.plugin.events || {}, (handler, eventDef) => {
      const [eventName, ...selectorParts] = eventDef.split(' ');
      const selector = selectorParts.join(' ');

      const eventHandler = this.$element.on(
        eventName,
        selector || undefined,
        (event) => {
          handler({
            ...this.context,
            self: this,
            event,
            target: event.target,
          });
        },
        { returnHandler: true },
      );

      this.eventHandlers.push(eventHandler);
    });
  }

  dispatchEvent(eventName, detail = {}) {
    this.element.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  destroy() {
    this.plugin.onDestroy?.(this.context);
    this.eventHandlers?.forEach(handler => handler.abort());
    delete this.element[this.namespace];
  }
}
