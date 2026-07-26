/**
 * DOM querying and manipulation, shadow DOM aware. Provides the `$` and `$$`
 * collection helpers, the Query class behind them, and the behavior system.
 * @see {@link https://next.semantic-ui.com/docs/api/query Query Documentation}
 */

export {
  $,
  $$,
  exportGlobals,
  ExportGlobalsOptions,
  restoreGlobals,
  RestoreGlobalsOptions,
  useAlias,
} from './helpers.js';

export { registerBehavior } from './register-behavior.js';

export {
  BehaviorConfig,
  BehaviorContext,
  BehaviorDefinition,
  BehaviorEventContext,
  BehaviorInvocationContext,
  BehaviorMethod,
  BehaviorMutationContext,
  BehaviorSetupContext,
} from './behavior.js';

/* the class is not exported from src/index.js, only its type is nameable here */
export type { Behavior } from './behavior.js';

export {
  CSSOptions,
  DimensionOptions,
  EventHandler,
  EventOptions,
  IntersectionDetails,
  IntersectionOptions,
  LogLevel,
  NaturalHeightOptions,
  NaturalWidthOptions,
  Query,
  QueryFilter,
  QueryOptions,
  QuerySelector,
} from './query.js';
