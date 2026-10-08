/**
 * Environment detection utility functions
 * @see {@link https://next.semantic-ui.com/docs/api/utils/environment Environment Utilities Documentation}
 */

/**
 * Constant indicating if code is running on server-side
 * @see {@link https://next.semantic-ui.com/docs/api/utils/environment#isserver isServer}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/environment#isclient isClient}
 *
 * @example
 * ```ts
 * if (isClient) {
 *   // Browser-specific code
 * }
 * ```
 */
export const isClient: boolean;

/**
 * Constant indicating if code is running in development environment
 * @see {@link https://next.semantic-ui.com/docs/api/utils/environment#isdevelopment isDevelopment}
 * @see {@link https://next.semantic-ui.com/examples/utils-isdevelopment Example}
 *
 * Returns true when any of these conditions are met:
 * - Cloud dev environments: CODESPACE_NAME, GITPOD_WORKSPACE_ID
 * - Vercel: VERCEL_ENV="development" or "preview"
 * - Netlify: CONTEXT="deploy-preview", "branch-deploy", or "dev"
 * - Node.js: NODE_ENV="development", "dev", "local", or "test"
 * - Vite: import.meta.env.DEV=true or MODE≠"production"
 * - Nuxt: process.dev=true
 * - React Native: __DEV__=true
 *
 * @example
 * ```ts
 * if (isDevelopment) {
 *   console.log('Debug info');
 * }
 * ```
 */
export const isDevelopment: boolean;

/**
 * Constant indicating if code is running in a CI environment
 * @see {@link https://next.semantic-ui.com/docs/api/utils/environment#isci isCI}
 * @see {@link https://next.semantic-ui.com/examples/utils-isci Example}
 *
 * Returns true when CI=true or any CI platform is detected:
 * GitHub Actions, GitLab CI, Jenkins, Buildkite, CircleCI, Travis,
 * AppVeyor, Drone, Semaphore, TeamCity, Azure DevOps, Bamboo, AWS CodeBuild
 *
 * @example
 * ```ts
 * if (isCI) {
 *   // Skip interactive prompts
 * }
 * ```
 */
export const isCI: boolean;

/**
 * Options for defineGlobal
 */
export interface DefineGlobalOptions {
  /** The object to define on (default: globalThis) */
  host?: object;
  /** What to do when the name is held by a different value: `'warn'` (default) keeps it and
   * warns in development, `'keep'` keeps it quietly, `'replace'` overwrites it, getters and
   * read-only configurable properties included */
  onConflict?: 'warn' | 'keep' | 'replace';
  /** Receives the conflict message under `'warn'` in development (default: console.warn).
   * A logger's `warnOnce` makes it one warning per name */
  onWarn?: (message: string) => void;
}

/**
 * Puts a value on the global object (or a chosen host) under a name and returns the value
 * the name holds afterward. The same value again is no conflict, so a module re-run under
 * hot reload is quiet. A name held by a different value keeps its value by default
 * @see {@link https://next.semantic-ui.com/docs/api/utils/environment#defineglobal defineGlobal}
 * @see {@link https://next.semantic-ui.com/examples/utils-defineglobal Example}
 *
 * @param name - The property name (a string or a symbol)
 * @param value - The value to define
 * @param options - The host, the conflict policy and the warning door
 * @returns The value the name holds after the call: the given value, or the existing one when it was kept
 *
 * @example
 * ```ts
 * isDevelopment && defineGlobal('store', store);              // poke at it in the devtools console
 * const db = defineGlobal('db', createClient(), { onConflict: 'keep' }); // survives hot reloads
 * defineGlobal('fetch', mockFetch, { onConflict: 'replace' }); // test setup
 * defineGlobal('plugins', [], { host: MyLibrary, onWarn: warnOnce });
 * ```
 */
export function defineGlobal<T>(name: PropertyKey, value: T, options?: DefineGlobalOptions): T;
