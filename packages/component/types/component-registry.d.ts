import { ComponentConstructor } from './define-component.js';

/**
 * Registers a component class under a tag name.
 * `defineComponent` does this for every component it is given a `tagName` for,
 * so the registry knows what to expand during server rendering.
 */
export function registerComponent(tagName: string, componentClass: ComponentConstructor): void;

/**
 * Looks up a registered component class by tag name.
 */
export function getComponent(tagName: string): ComponentConstructor | undefined;

/**
 * Whether a component class is registered under the given tag name.
 */
export function hasComponent(tagName: string): boolean;
