import { deepExtend, filterObject, isArray, isString, noop, pick } from '@semantic-ui/utils';
import { Behavior } from './behavior.js';
import { Query } from './query.js';

// Register Behavior
export const registerBehavior = (behavior) => {
  const behaviorDefaults = {
    name: undefined,
    css: undefined,
    // storage in el
    namespace: behavior?.name,
    // settings for behavior
    defaultSettings: {},
    // returns behavior instance
    createBehavior: function() {},
    // event object
    events: {},
    // mutation observer object
    mutations: {},
    // whether html data can override settings
    allowDataOverride: true,
    // one time setup callback
    setup: function() {},
    // callbacks
    onCreated: noop,
    onDestroyed: noop,
    // standard object storage
    selectors: {},
    classNames: {},
    errors: {},
    templates: {},
  };

  behavior = {
    ...behaviorDefaults,
    ...behavior,
  };
  // handle default namespace
  if (!behavior.namespace) {
    behavior.namespace = behavior.name;
  }

  // shorthand
  let {
    namespace,
    name,
    defaultSettings,
    selectors,
    classNames,
    errors,
    templates,
  } = behavior;

  let isSetup = false;

  if (!name) {
    throw new Error('Behavior must have a name');
  }

  // may be called via side effects which should not throw an error
  // when multiple components rely on same behavior
  if (Query.behaviors.has(name)) {
    return;
  }

  // Register this behavior
  Query.behaviors.set(name, behavior);

  // setup() can setup a shared behavior that is preserved across calls
  let sharedBehavior;

  // Create abstraction around behavior initialization
  Query.prototype[name] = function(settings) {
    // ignore undefined settings
    settings = filterObject(settings, (value) => value !== undefined);

    // At run time we need to check if defaults are changed by user
    // this can occur if $.plugin.defaultSettings is modified
    const defaultValues = ['classNames', 'errors', 'selectors', 'logLevel', 'logPerformance'];
    const globalDefaults = pick(Query, ...defaultValues);
    const behaviorDefaults = pick(Query.prototype[name], ...defaultValues);
    const settingsDefaults = pick(settings, ...defaultValues);

    // store runtime config for Behavior
    const runtimeConfig = {
      ...globalDefaults,
      ...behaviorDefaults,
      ...settingsDefaults,
      ...behavior,
    };

    console.log('log performance', runtimeConfig.logPerformance);

    // determine run time settings for behavior
    const runtimeSettings = deepExtend({}, Query.prototype[name].defaultSettings, settings);

    // store reference to all elements
    const $elements = this;

    // check if we're calling a method (string as first param)
    let methodName, methodArguments;
    if (isString(arguments[0])) {
      [methodName, ...methodArguments] = arguments;
    }
    // value to store return
    let returnedValue;

    $elements.each(function(element, elementIndex) {
      // handle setup function on first invocation
      if (!isSetup) {
        sharedBehavior = Behavior.runSetup(behavior.setup, { $elements, settings, templates }) ?? {};
        isSetup = true;
      }

      const $element = this;
      const totalElements = $elements.count();

      // behavior is stored in namespace like el.behavior
      let instance = Behavior.getInstance(element, namespace);
      let existingInstance = !!instance;

      const behaviorConfig = {
        sharedBehavior, // setup can pass shared behavior across instances
        $element,
        $elements,
        Query,
        elementIndex,
        totalElements,
        ...runtimeConfig,
        settings: runtimeSettings,
      };

      // create behavior instance if not defined
      // this might even occur if a method is invoked
      // if this method has no instance defined
      if (!instance) {
        instance = new Behavior(behaviorConfig);
      }

      if (methodName) {
        const response = instance.callMethod(methodName, ...methodArguments);

        // Collect return values using original SUI pattern
        if (isArray(returnedValue)) {
          returnedValue.push(response);
        }
        else if (returnedValue !== undefined) {
          // Only create array if values are different
          if (returnedValue !== response) {
            returnedValue = [returnedValue, response];
          }
          // If same value, keep the single value (don't create array)
        }
        else if (response !== undefined) {
          returnedValue = response;
        }
      }
      else if (existingInstance) {
        // if they are not calling a method and there are settings
        // than they are attempting to reinitialize the behavior with new settings
        instance.reinitialize(behaviorConfig);
      }
    });

    return (returnedValue !== undefined)
      ? returnedValue
      : $elements;
  };

  // preserve shared behavior from setup()
  Query.prototype[name].sharedBehavior = sharedBehavior;

  // Expose settings, class names and errors on the prototype
  // This allows end-users to override the defaults
  Query.prototype[name].defaultSettings = defaultSettings;
  Query.prototype[name].classNames = classNames;
  Query.prototype[name].selectors = selectors;
  Query.prototype[name].errors = errors;
};
