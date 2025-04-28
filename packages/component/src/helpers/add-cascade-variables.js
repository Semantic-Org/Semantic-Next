/**
 * @fileoverview Utility to modify CSS variables for cascading overrides in Web Components.
 * Exports a function `addCascadeVariables` that processes a CSS string.
 */

/**
 * Rewrites CSS variable declarations and usages within a CSS string
 * to enable cascading overrides, typically for Web Component styles.
 *
 * This function performs two main transformations using regular expressions:
 * 1. Renames variable declarations: `--my-var` becomes `--my-var-default`.
 * Example: `--my-color: blue;` -> `--my-color-default: blue;`
 * 2. Updates variable usages (`var()`) to include a fallback to the renamed default,
 * but only if the `var()` function doesn't already have a fallback.
 * Example: `color: var(--my-color);` -> `color: var(--my-color, var(--my-color-default));`
 * Example: `margin: var(--margin, 10px);` -> (remains unchanged)
 *
 * This pattern allows external CSS (outside a Shadow DOM) to define `--my-var`
 * to override a component's default styles defined within its Shadow DOM,
 * while the component itself uses `--my-var-default` internally if no
 * override is provided via the cascade.
 *
 * @param {string} cssString The original CSS code as a string.
 * @returns {string} The modified CSS string with default variables and fallbacks.
 * Returns an empty string if the input is not a valid string.
 */
export function addCascadeVariables(cssString) {
  // Basic input validation
  if (typeof cssString !== 'string') {
    console.error('Invalid input: cssString must be a string.');
    return '';
  }

  let modifiedCss = cssString;

  // 1. Rename variable declarations: Append "-default" to the variable name.
  // Matches '--variable-name:' pattern.
  modifiedCss = modifiedCss.replace(
    /(--)([\w-]+)(\s*:)/g, // $1=--, $2=name, $3=:\s*
    '$1$2-default$3' // Changed replacement: append '-default'
  );

  // 2. Update variable usages: Add a fallback to the corresponding "-default" variable.
  // Matches 'var(--variable-name)' but not 'var(--variable-name, fallback)'.
  modifiedCss = modifiedCss.replace(
    /var\(\s*(--)([\w-]+)\s*\)/g, // $1=--, $2=name
    'var($1$2, var($1$2-default))' // Changed replacement: use name-default for fallback
  );

  return modifiedCss;
}
