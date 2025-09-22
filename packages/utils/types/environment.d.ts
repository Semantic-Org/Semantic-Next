/**
 * Environment detection utility functions
 * @see {@link https://next.semantic-ui.com/api/utils/environment Environment Utilities Documentation}
 */

/**
 * Constant indicating if code is running on server-side
 * @see {@link https://next.semantic-ui.com/api/utils/environment#isserver isServer}
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
 * @see {@link https://next.semantic-ui.com/api/utils/environment#isclient isClient}
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
 * @see {@link https://next.semantic-ui.com/api/utils/environment#isdevelopment isDevelopment}
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
 * @see {@link https://next.semantic-ui.com/api/utils/environment#isci isCI}
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
