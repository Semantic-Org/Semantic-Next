/**
 * Scopes CSS styles under a specific selector.
 * Useful for scoping styles when not using Shadow DOM.
 * 
 * @param css - The CSS styles to scope
 * @param scopeSelector - The selector to scope styles under (e.g. '.my-component')
 * @returns The scoped CSS string
 */
export function scopeStyles(css: string, scopeSelector?: string): string;
