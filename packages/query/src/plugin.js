import {
  adoptStylesheet,
  clone,
  each,
  extend,
  isFunction,
  mapObject,
  noop
} from '@semantic-ui/utils';

export class Plugin {

  constructor({
    name,

    namespace = name,

    // returns plugin instance
    createPlugin = noop,

    // event object
    events = {},

    // $element to initialize
    $element,

    css = '',

    // allow el data to be specified in data attributes
    allowDataOverride = true,

    // callbacks
    onCreated = noop,
    onDestroyed = noop,

    // standard
    selectors = {},
    classNames = {},
    errors = {},
    settings = {},
  } = {}) {

    // handle query instance
    this.$ = (selector, options) => new $element.constructor(selector, options);
    this.$element = $element;
    this.element = $element.el();

    // handle run-time settings
    this.settings = clone(settings);
    this.namespace = namespace;

    if(css) {
      this.adoptStylesheet(css);
    }

    // allow html metadata to override settings like <div data-setting="new-setting">
    if(allowDataOverride) {
      this.addDataOverrides();
    }

    // use abort controllers for lifecycle teardown
    // <https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal>
    this.controller = new AbortController();

    // extend with methods from createPlugin
    const instance = this.call(createPlugin) || {};
    extend(this, instance);

    // attach to dom
    this.element[namespace] = this;

    // attach events
    this.attachEvents(events);

    this.element[namespace] = this;
  }

  adoptStylesheet(css) {
    adoptStylesheet(css, this.element, { cacheStylesheet: true });
  }

  addDataOverrides(element = this.element) {
    const elementData = this.getElementData();
    each(this.settings, (value, name) => {
      if(elementData[name]) {
        this.settings[name] = elementData[name];
      }
    });
  }

  reinitialize(settings) {
    if (this.instance !== undefined) {
      this.instance.destroy();
    }
    const plugin = new Plugin(settings);
    this.element[namespace] = plugin;
  }

  parseEventString(eventString) {
    // 'delegate eventType selector' - bind to an element using event delegation
    // 'global eventType selector' - attach event to an element on the page
    // 'bind selector' - bind to an element directly
    let eventType = 'delegate';
    let keywords = ['global', 'bind'];
    each(keywords, (keyword) => {
      if (eventString.startsWith(keyword)) {
        eventString = eventString.replace(keyword, '');
        eventType = keyword;
      }
    });

    eventString = eventString.trim();

    // we are using event delegation so we will have to bind
    // some events to their corresponding event that bubbles
    const getBubbledEvent = (eventName) => {
      const bubbleMap = {
        blur: 'focusout',
        focus: 'focusin',
        load: 'DOMContentLoaded',
        unload: 'beforeunload',
        mouseenter: 'mouseover',
        mouseleave: 'mouseout',
      };
      if (bubbleMap[eventName]) {
        eventName = bubbleMap[eventName];
      }
      return eventName;
    };
    let events = [];
    let parts = eventString.split(/\s+/);

    let addedEvents = false;
    let addedSelectors = false;
    const eventNames = [];
    const selectors = [];
    // parse out various syntax like `click, mousedown foo`, `click .foo, .bar`
    each(parts, (part, index) => {
      const value = part.replace(/(\,|\W)+$/, '').trim();
      const hasComma = part.includes(',');
      if (!addedEvents) {
        eventNames.push(getBubbledEvent(value));
        addedEvents = !hasComma;
      }
      else if (!addedSelectors) {
        const selectorParts = parts.slice(index).join(' ').split(',');
        each(selectorParts, (value) => {
          selectors.push(value.trim());
        });
        addedSelectors = true;
      }
    });
    each(eventNames, (eventName) => {
      // this event has no selectors which means it should occur on component
      if (!selectors.length) {
        selectors.push('');
      }
      each(selectors, (selector) => {
        events.push({ eventName, eventType, selector });
      });
    });
    return events;
  }

  getElementData(element = this.element) {
    return mapObject({ ...element?.dataset }, (stringValue) => {
      let value;
      try {
        value = JSON.parse(stringValue);
      }
      catch (e) {
        value = stringValue;
      }
      return value;
    });
  }

  attachEvents(events = this.events) {
    each(events, (userHandler, eventString) => {
      const subEvents = this.parseEventString(eventString);
      const plugin = this;
      each(subEvents, (event) => {
        const { eventName, selector, eventType } = event;
        const eventHandler = function(event) {
          // prepare data for users event handler
          const targetElement = this;
          const boundEvent = userHandler.bind(targetElement);
          const eventData = event?.detail || {};
          // dataset is always stringified for atts, we want this as native values
          const elData = plugin.getElementData(targetElement);
          const elValue = targetElement?.value || event.target?.value || event?.detail?.value;
          plugin.call(boundEvent, {
            additionalData: {
              event: event,
              target: targetElement,
              value: elValue,
              data: {
                ...elData,
                ...eventData,
              },
            },
          });
        };

        const eventSettings = { abortController: this.controller };

        // allow user to bind to global selectors if they opt in using the 'global' keyword
        // also allow events to be directly bound when opted in
        if(!selector) {
          this.$element.on(eventName, eventHandler, eventSettings);
        }
        else if (eventType == 'global') {
          this.$(selector).on(eventName, eventHandler, eventSettings);
        }
        else if (eventType == 'delegate' && selector) {
          this.$(this.element).find(selector).on(eventName, eventHandler, eventSettings);
        }
        else {
          // default to event delegation
          this.$(this.element).on(eventName, selector, eventHandler, eventSettings);
        }
      });
    });
  }

  removeEvents() {
    if (this.controller) {
      this.controller.abort('Plugin destroyed');
    }
  }

  dispatchEvent(eventName, detail = {}, eventSettings = {}) {
    this.element.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        cancelable: true,
        ...eventSettings
      }),
    );
  }

  // calls callback if defined with consistent params and this context
  call(func, { params, additionalParams = {} } = {}) {
    const plugin = this;
    const args = [];
    if (!params) {
      params = {
        $: plugin.$,
        el: plugin.element,
        $el: plugin.$(plugin.element),
        self: plugin,
        plugin,
        namespace: plugin.namespace,
        get data() {
          return plugin.getElementData(plugin.element);
        },
        get selectors() {
          return plugin.selectors;
        },
        get errors() {
          return plugin.errors;
        },
        get classNames() {
          return plugin.classNames;
        },
        get settings() {
          return plugin.settings;
        },
        ...additionalParams,
      };
      args.push(params);
    }
    if (isFunction(func)) {
      return func.apply(plugin.element, args);
    }
  }

  destroy() {
    this.removeEvents();
    this.call(this.onDestroyed);
    delete this.element[this.namespace];
  }

  static getPluginInstance(element, namespace) {
    return element[namespace];
  }
}
