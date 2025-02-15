import * as Utils from './utils';

// Export everything from utils
export * from './utils';

// Export default (the entire utility belt)
declare const _: typeof Utils;
export default _;
