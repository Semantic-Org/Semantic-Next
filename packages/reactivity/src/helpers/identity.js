// Symbol.for keys survive cross-realm boundaries (bundles, iframes), so
// `instanceof Signal` works against any realm's class definition.
export const IS_SIGNAL = Symbol.for('semantic-ui/Signal');
