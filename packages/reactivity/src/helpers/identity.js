// Symbol markers for cross-realm instanceof checks. A consumer running across
// multiple bundles or iframes can still satisfy `instanceof Signal` because
// the marker key is registered globally via Symbol.for. Each class installs
// its own marker getter that its Symbol.hasInstance trap reads.
export const IS_SIGNAL = Symbol.for('semantic-ui/Signal');
