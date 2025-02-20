/**
 * Constant indicating if code is running on server-side
 * @see {@link https://next.semantic-ui.com/api/utils/browser#isserver isServer}
 *
 * @example
 * ```ts
 * if (isServer) {
 *   // Server-side specific code
 * }
 * ```
 */
export const isServer: boolean;

/**
 * Constant indicating if code is running in browser environment
 * @see {@link https://next.semantic-ui.com/api/utils/browser#isclient isClient}
 *
 * @example
 * ```ts
 * if (isClient) {
 *   // Browser-specific code
 * }
 * ```
 */
export const isClient: boolean;
