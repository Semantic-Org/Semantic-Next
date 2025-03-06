/**
 * Extracts CSS rules that match a specific tag name from all stylesheets.
 * Creates a new stylesheet containing only the matching rules.
 * 
 * @param tagName - The custom element tag name to extract styles for
 * @returns A new CSSStyleSheet containing the extracted rules
 */
export function extractCSS(tagName: string): CSSStyleSheet;
