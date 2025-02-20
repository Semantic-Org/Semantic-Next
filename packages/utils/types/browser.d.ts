/**
 * Browser utilities
 * @see {@link https://next.semantic-ui.com/api/utils/browser Browser Utilities Documentation}
 */

/**
 * Options for opening a link
 */
export interface OpenLinkOptions {
  /** Open in a new window */
  newWindow?: boolean;
  /** Window settings when opening in new window */
  settings?: string;
  /** Target attribute for the window */
  target?: string;
  /** Optional event to prevent default behavior */
  event?: Event;
}

/**
 * Options for fetching text/JSON
 */
export type FetchSettings = RequestInit;

/**
 * Copies text to the clipboard using the clipboard API
 * @see {@link https://next.semantic-ui.com/api/utils/browser#copytext copyText}
 * @param text - The text to copy
 */
export function copyText(text: string): void;

/**
 * Opens a URL with configurable options
 * @see {@link https://next.semantic-ui.com/api/utils/browser#openlink openLink}
 * @param url - The URL to open
 * @param options - Configuration options for opening the URL
 */
export function openLink(url: string, options?: OpenLinkOptions): void;

/**
 * Extracts a standardized key string from a keyboard event
 * Handles modifiers (ctrl, alt, shift, meta) and special keys
 * @see {@link https://next.semantic-ui.com/api/utils/browser#getkeyfromEvent getKeyFromEvent}
 * 
 * @param event - The keyboard event
 * @returns A standardized key string (e.g. "ctrl+a", "shift+enter")
 * 
 * @example
 * ```ts
 * element.onkeydown = (e) => {
 *   const key = getKeyFromEvent(e);
 *   if (key === 'ctrl+s') {
 *     // Handle save shortcut
 *   }
 * };
 * ```
 */
export function getKeyFromEvent(event: KeyboardEvent): string;

/**
 * Fetches text content from a URL
 * @see {@link https://next.semantic-ui.com/api/utils/browser#gettext getText}
 * @param src - The URL to fetch from
 * @param settings - Optional fetch settings
 * @returns Promise resolving to the text content
 */
export function getText(src: string, settings?: FetchSettings): Promise<string>;

/**
 * Fetches and parses JSON from a URL
 * @see {@link https://next.semantic-ui.com/api/utils/browser#getjson getJSON}
 * @param src - The URL to fetch from
 * @param settings - Optional fetch settings
 * @returns Promise resolving to the parsed JSON
 */
export function getJSON<T = any>(src: string, settings?: FetchSettings): Promise<T>;

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
