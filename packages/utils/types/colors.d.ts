/**
 * Represents an RGB color object.
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Converts an OKLCH color string to an RGB object.
 * Handles potential out-of-gamut colors by clamping the final RGB values.
 * Based on https://bottosson.github.io/posts/oklab/
 * @see {@link https://next.semantic-ui.com/docs/api/utils/colors#oklchtorgb oklchToRgb}
 *
 * @param oklchString - The color string in the format "oklch(L C H)" or "oklch(L, C, H)".
 *                      L: Lightness (0-1), C: Chroma (0-~0.4), H: Hue (0-360).
 * @returns An object with r, g, b properties (0-255), or an empty string if the input is invalid.
 */
export function oklchToRgb(oklchString?: string): RGBColor | '';

/**
 * Converts an OKLCH color string to a hex color string (e.g., "#RRGGBB"),
 * or returns the input if it's already a valid hex color string.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/colors#oklchtohex oklchToHex}
 *
 * @param colorString - The color string, either OKLCH format "oklch(L C H)" or a hex code.
 * @returns The hex color string (e.g., "#FF0000") or an empty string if the input is invalid or empty.
 */
export function oklchToHex(colorString?: string): string;
