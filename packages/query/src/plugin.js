export class Plugin {
  constructor(element, plugin) {
    this.element = element;
    this.$element = $element;
    this.plugin = plugin;
    this.settings = {
      ...plugin.defaultSettings,
      ...settings,
    };
    this.namespace = plugin.namespace;

    // this is to cancel event bindings when template tears down
    // <https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal>
    this.controller = new AbortController();

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
      this.instance = {};
      if (isFunction(this.createComponent)) {
        instance = this.call(this.createComponent) || {};
        extend(this.instance, instance);
      }
      element[this.namespace] = this.instance;
    }

    // Bind events
    this.bindEvents();

    // Store on element
  }

  attachEvents(events = this.plugin.events) {
    each(events, (userHandler, eventString) => {
      const subEvents = this.parseEventString(eventString);
      const template = this;
      each(subEvents, (event) => {
        const { eventName, selector, eventType } = event;

        // BUG: iOS Safari will not bubble the touchstart / touchend events
        // if theres no handler on the actual element
        if (selector) {
          $(selector, { root: this.renderRoot }).on(eventName, noop, { abortController: this.eventController });
        }

        const eventHandler = function(event) {
          // check if the event occurred in the current template if not global
          if (eventType !== 'global' && !template.isNodeInTemplate(event.target)) {
            return;
          }

          // check if event occured on a deep event handler and the handler type isnt 'deep'
          const isDeep = selector && $(event.target).closest(selector).length == 0;
          if (!inArray(eventType, ['deep', 'global']) && isDeep) {
            return;
          }

          // handle related target use case for special events
          if (
            inArray(eventName, ['mouseover', 'mouseout'])
            && event.relatedTarget
            && event.target.contains(event.relatedTarget)
          ) {
            return;
          }

          // prepare data for users event handler
          const targetElement = this;
          const boundEvent = userHandler.bind(targetElement);
          const eventData = event?.detail || {};
          // convert "1" to 1
          const elData = mapObject({ ...targetElement?.dataset }, (stringValue) => {
            let value;
            try {
              value = JSON.parse(stringValue);
            }
            catch (e) {
              value = stringValue;
            }
            return value;
          });
          const elValue = targetElement?.value || event.target?.value || event?.detail?.value;
          template.call(boundEvent, {
            additionalData: {
              event: event,
              isDeep,
              target: targetElement,
              value: elValue,
              data: {
                ...elData,
                ...eventData,
              },
            },
          });
        };

        const eventSettings = { abortController: this.eventController };

        // allow user to bind to global selectors if they opt in using the 'global' keyword
        // also allow events to be directly bound when opted in
        if (eventType == 'global') {
          $(selector).on(eventName, eventHandler, eventSettings);
        }
        else if (eventType == 'bind') {
          this.onRenderOnce = () => {
            this.$(selector).on(eventName, eventHandler, eventSettings);
            wrapFunction(this.onRenderOnce);
          };
        }
        else {
          // otherwise use event delegation at the components shadow root
          $(this.renderRoot).on(eventName, selector, eventHandler, eventSettings);
        }
      });
    });
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
      params = {
        el: this.element,
        get settings() {
          return this.settings;
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
    this.plugin.onDestroy?.(this.context);
    this.eventHandlers?.forEach(handler => handler.abort());
    delete this.element[this.namespace];
  }
}
