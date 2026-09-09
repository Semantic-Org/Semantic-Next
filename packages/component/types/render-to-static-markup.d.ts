import type { Template } from '@semantic-ui/templating';

import { ComponentConstructor } from './define-component.js';

/**
 * Options for a single {@link renderToStaticMarkup} pass.
 */
export interface RenderToStaticMarkupOptions {
  /** Content per slot name, filled in where the slot sits. The `default` key is the unnamed slot. */
  slots?: Record<string, string> | null;
  /** Render plain text: nothing is escaped. `{#html}` is raw either way. */
  text?: boolean;
  /** Return `{ html, css }`, the css being that of every component the render reached, parent first. */
  css?: boolean;
}

/** A static render with the css it needs, returned under `css: true`. */
export interface StaticMarkup {
  html: string;
  css: string;
}

/**
 * Renders a component to the markup of its template alone, as a mail client,
 * a feed reader or a static page holds it. Nested registered components render
 * flat where their tags sat, their children assigned to slots by `slot` attribute.
 * A tag-less definition, the prototype Template `defineComponent` returns
 * without a `tagName`, renders the same way.
 *
 * @throws when the class was defined without a `tagName`, or has no template.
 *
 * @example
 * const html = renderToStaticMarkup(MyCard, { title: 'Hello' });
 * // <div class="card">Hello</div>
 * @see {@link https://next.semantic-ui.com/docs/api/renderer/server-rendering#static-markup Static Markup}
 */
export function renderToStaticMarkup(
  definition: ComponentConstructor | Template,
  attrs: Record<string, any>,
  options: RenderToStaticMarkupOptions & { css: true; },
): StaticMarkup;
export function renderToStaticMarkup(
  definition: ComponentConstructor | Template,
  attrs?: Record<string, any>,
  options?: RenderToStaticMarkupOptions & { css?: false; },
): string;
export function renderToStaticMarkup(
  definition: ComponentConstructor | Template,
  attrs?: Record<string, any>,
  options?: RenderToStaticMarkupOptions,
): string | StaticMarkup;
