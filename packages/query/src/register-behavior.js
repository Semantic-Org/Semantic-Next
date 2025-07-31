import { pick, isString, isArray, noop, deepExtend } from '@semantic-ui/utils';
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
    createBehavior: noop,
    // event object
    events: {},
    // mutation observer object
    mutations: {},
    // whether html data can override settings
    allowDataOverride: true,
    // one time setup callback
    setup: noop,
    // callbacks
    onCreated: noop,
    onMutated: noop,
    onDestroyed: noop,
    // standard object storage
    selectors: {},
    classNames: {},
    errors: {},
    templates: {},
  };

  behavior = {
    ...behaviorDefaults,
    ...behavior
  };
  // handle default namespace
  if(!behavior.namespace) {
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


    // At run time we need to check if defaults are changed from original registration
    const defaultValues = ['defaultSettings', 'classNames', 'errors', 'selector'];
    const behaviorDefaults = pick(Query.prototype[name], ...defaultValues);
    const runtimeConfig = {
      ...behaviorDefaults,
      ...behavior,
    };

    // when this element is initialized we create run time settings
    // this looks at current default settings at time of init
    // use deepExtend to properly merge nested objects like selectors, classNames, etc.
    const runtimeSettings = deepExtend({}, defaultSettings, settings);

    // store reference to all elements
    const $elements = this;

    // check if we're calling a method (string as first param)
    let methodName, methodArguments;
    if (isString(arguments[0])) {
      [methodName, ...methodArguments] = arguments;
    }
    // value to store return
    let returnedValue;

    $elements.each(function(element, index) {

      // handle setup function on first invocation
      if(!isSetup) {
        sharedBehavior = Behavior.runSetup(behavior.setup, { $elements, settings, templates }) ?? {};
        isSetup = true;
      }

      const $element = this;

      // behavior is stored in namespace like el.behavior
      const instance = Behavior.getInstance(element, namespace);

      const behaviorConfig = {
        sharedBehavior, // setup can pass shared behavior across instances
        $element,
        ...runtimeConfig,
        settings: runtimeSettings
      };

      // create behavior instance if not defined
      // this might even occur if a method is invoked
      // if this method has no instance defined
      if (!instance) {
        new Behavior(behaviorConfig);
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
      else if(instance !== undefined) {
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
