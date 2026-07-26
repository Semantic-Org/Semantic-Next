import { ComponentConstructor } from './define-component.js';

/**
 * Options for a single {@link renderToString} pass.
 */
export interface RenderToStringOptions {
  /** Light DOM content keyed by slot name. The `default` key is emitted unwrapped. */
  slots?: Record<string, string> | null;
  /** Current nesting depth. Recursion stops at 10 to guard against cycles. */
  depth?: number;
  /**
   * Whether the output should hydrate on the client. When `false` the element
   * is marked `ssr` so it does not self-hydrate when the component's JS loads.
   */
  hydrate?: boolean;
}

/**
 * Server-renders a component to a declarative shadow DOM string.
 *
 * Nested registered components are expanded recursively, so a single call
 * produces the full tree.
 *
 * @throws when the class was defined without a `tagName`, or has no template.
 *
 * @example
 * const html = renderToString(MyCard, { title: 'Hello' });
 * // <my-card title="Hello"><template shadowrootmode="open">...</template></my-card>
 */
export function renderToString(
  ComponentClass: ComponentConstructor,
  attrs?: Record<string, any>,
  options?: RenderToStringOptions,
): string;
