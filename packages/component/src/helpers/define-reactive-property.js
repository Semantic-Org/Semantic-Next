import { ReactiveVar } from '@semantic-ui/reactivity';

/*
  This is a simple standalone helper for adding a reactive property
  that hides the complexity of the underlying signals
*/
export const defineReactiveProperty = (obj, propertyName, initialValue) => {
  const reactiveVar = new ReactiveVar(initialValue);

  Object.defineProperty(obj, propertyName, {
    get: function() {
      return reactiveVar.value;
    },
    set: function(value) {
      reactiveVar.value = value;
    },
    enumerable: true,
    configurable: true
  });
};
