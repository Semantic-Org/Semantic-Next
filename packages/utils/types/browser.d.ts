/**
 * Browser-specific utility functions
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
 * Options for getting IP address
 */
export interface GetIPAddressOptions {
  /** Type of IP address to retrieve: 'local', 'public', or 'all' */
  type?: 'local' | 'public' | 'all';
  /** Timeout in milliseconds */
  timeout?: number;
  /** Milliseconds to wait after last IP before resolving (for local/all types) */
  waitAfterLastIP?: number;
}

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
 * Retrieves the user's IP address using WebRTC ICE gathering
 * @see {@link https://next.semantic-ui.com/api/utils/browser#getipaddress getIPAddress}
 * @see {@link https://next.semantic-ui.com/examples/utils-getipaddress Example}
 *
 * @param options - Configuration options for IP retrieval
 * @returns Promise resolving to IP address(es). Returns a single string for 'public' type, or an array of strings for 'local'/'all' types
 *
 * @example
 * ```ts
 * // Get public IP address (default)
 * const publicIP = await getIPAddress();
 * console.log(publicIP); // '203.0.113.45'
 *
 * // Get local IP addresses
 * const localIPs = await getIPAddress({ type: 'local' });
 * console.log(localIPs); // ['192.168.1.100', '10.0.0.5']
 * ```
 */
export function getIPAddress(options?: GetIPAddressOptions): Promise<string | string[]>;
