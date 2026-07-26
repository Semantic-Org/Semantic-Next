import { BehaviorDefinition, BehaviorMethod } from './behavior.js';

/**
 * Registers a behavior, adding it as a method on every Query instance.
 * @see {@link https://next.semantic-ui.com/docs/guides/query/plugins Behavior Guide}
 * @param behavior - The behavior definition.
 * @returns The method added to `Query.prototype`, or `undefined` when a behavior
 * with this name is already registered.
 */
export function registerBehavior(behavior: BehaviorDefinition): BehaviorMethod | undefined;
