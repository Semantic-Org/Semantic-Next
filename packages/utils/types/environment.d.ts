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
 * What defineGlobal does when the name is already held by a different value
 * - `'warn'` keeps the existing value and warns once per name in development
 * - `'keep'` keeps the existing value quietly (polyfills, get-or-create singletons)
 * - `'replace'` overwrites it, including a getter or a read-only configurable property
 */
export type DefineGlobalConflict = 'warn' | 'keep' | 'replace';

/**
 * Options for defineGlobal
 */
export interface DefineGlobalOptions {
  /** The object to define on (default: globalThis) */
  host?: object;
  /** What to do when the name is held by a different value (default: 'warn') */
  onConflict?: DefineGlobalConflict;
}

/**
 * Puts a value on the global object (or a chosen host) under a name and returns the value
 * the name holds afterward. The same value again is no conflict, so a module re-run under
 * hot reload is quiet. A name held by a different value keeps its value by default, with
 * one development warning per name
 * @see {@link https://next.semantic-ui.com/docs/api/utils/environment#defineglobal defineGlobal}
 * @see {@link https://next.semantic-ui.com/examples/utils-defineglobal Example}
 *
 * @param name - The property name (a string or a symbol)
 * @param value - The value to define
 * @param options - The host and the conflict policy
 * @returns The value the name holds after the call: the given value, or the existing one when it was kept
 * @throws TypeError for an unknown onConflict, a host that cannot hold a property, or a replace over a non-configurable read-only property
 *
 * @example
 * ```ts
 * isDevelopment && defineGlobal('store', store);              // poke at it in the devtools console
 * const prisma = defineGlobal('prisma', new PrismaClient(), { onConflict: 'keep' }); // survives hot reloads
 * defineGlobal('fetch', mockFetch, { onConflict: 'replace' }); // test setup
 * defineGlobal('plugins', [], { host: MyLibrary });             // a namespace object instead of a global
 * ```
 */
export function defineGlobal<T>(name: PropertyKey, value: T, options?: DefineGlobalOptions): T;
