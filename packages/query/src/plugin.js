import { capitalize, isFunction, isString, noop } from '@semantic-ui/utils';

export class Plugin {
  constructor({
    element,
    name,
    namespace = `plugin${capitalize(name)}`,

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
    settings,
  } = {}) {
    this.element = element;
    this.settings = settings;
    this.namespace = namespace;

    // this is to cancel event bindings when template tears down
    // <https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal>
    this.controller = new AbortController();

    // Get methods from createPlugin
    this.instance = this.call(createPlugin) || {};

    // Store on element
  }

  attachEvents(events = this.events) {
  }

  removeEvents() {
    if (this.controller) {
      this.controller.abort('Plugin destroyed');
    }
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

  // calls callback if defined with consistent params and this context
  call(func, { params, additionalParams = {} } = {}) {
    const args = [];
    if (!params) {
      const element = this.element;
      const settings = this.settings;
      params = {
        el: this.element,
        get settings() {
          return settings;
        },
        ...additionalParams,
      };
      args.push(params);
    }
    if (isFunction(func)) {
      return func.apply(this.element, args);
    }
  }

  destroy() {
    this.onDestroy?.(this.context);
    this.eventHandlers?.forEach(handler => handler.abort());
    delete this.element[this.namespace];
  }
}
