/**
 * Adopts a stylesheet into the specified element or document.
 * Uses constructable stylesheets to efficiently share styles.
 * 
 * @param css - The CSS styles to adopt
 * @param adoptedElement - The element to adopt the styles into (defaults to document)
 * @param options - Additional options for style adoption
 * @param options.scopeSelector - Optional selector to scope all styles under
 */
export function adoptStylesheet(
  css: string,
  adoptedElement?: HTMLElement | Document,
  options?: {
    scopeSelector?: string;
  }
): void;
