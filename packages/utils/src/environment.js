import { isFunction, isObject } from './types.js';

/*-------------------
      Constants
--------------------*/

/*
  isDevelopment leads the module and reads __DEV__ FIRST so a bundler define
  (__DEV__: false) folds it to a literal and every gated dev branch dead-code-
  eliminates across the fleet. the fold is order-fragile: an IIFE above this
  const defeats cross-module inlining, so this stays the leading declaration.
  precedence is deliberate: an explicit build define outranks environment
  sniffing; with no define, detection below behaves exactly as before.
*/
const detectDevelopment = () => {
  if (typeof process !== 'undefined' && process.env) {
    const env = process.env;

    // Check cloud development environments (always development)
    if (env.CODESPACE_NAME || env.GITPOD_WORKSPACE_ID) {
      return true;
    }

    // Check Vercel environment
    if (env.VERCEL_ENV) {
      const vercelEnv = env.VERCEL_ENV.toLowerCase();
      if (vercelEnv === 'development' || vercelEnv === 'preview') {
        return true;
      }
    }

    // Check Netlify preview contexts
    if (env.CONTEXT) {
      const context = env.CONTEXT.toLowerCase();
      if (['deploy-preview', 'branch-deploy', 'dev'].includes(context)) {
        return true;
      }
    }

    // Check Node.js environment with common development values
    if (env.NODE_ENV) {
      const nodeEnv = env.NODE_ENV.toLowerCase();
      if (['development', 'dev', 'local', 'test'].includes(nodeEnv)) {
        return true;
      }
    }

    // Check Nuxt.js development flag
    if (process.dev === true) {
      return true;
    }
  }

  // Check Vite/modern bundler env
  if (import.meta?.env) {
    const env = import.meta.env;

    if (env.DEV) {
      return true;
    }

    if (env.MODE === 'development') {
      return true;
    }
  }

  // Default to false (production)
  return false;
};

export const isDevelopment = typeof __DEV__ !== 'undefined' ? !!__DEV__ : detectDevelopment();

export const isServer = (() => {
  return typeof window === 'undefined';
})();

export const isClient = (() => {
  return typeof window !== 'undefined';
})();

export const isCI = (() => {
  if (typeof process === 'undefined' || !process.env) {
    return false;
  }

  const env = process.env;

  // Check common CI environment indicators
  if (env.CI === 'true') {
    return true;
  }

  // Check specific CI platforms
  const ciVars = [
    'GITHUB_ACTIONS',
    'GITLAB_CI',
    'JENKINS_URL',
    'BUILDKITE',
    'CIRCLECI',
    'TRAVIS',
    'APPVEYOR',
    'DRONE',
    'SEMAPHORE',
    'TEAMCITY_VERSION',
    'TF_BUILD', // Azure DevOps
    'BAMBOO_BUILD_KEY',
    'CODEBUILD_BUILD_ID', // AWS CodeBuild
  ];

  return ciVars.some(varName => env[varName]);
})();

/*-------------------
       Globals
--------------------*/

const warnedNames = /* @__PURE__ */ new WeakMap();

const warnOnce = (host, name, message) => {
  let names = warnedNames.get(host);
  if (!names) {
    names = new Set();
    warnedNames.set(host, names);
  }
  if (!names.has(name)) {
    names.add(name);
    console.warn(message);
  }
};

const replaceProperty = (host, name, value) => {
  const own = Object.getOwnPropertyDescriptor(host, name);
  // a top-level var is non-configurable but writable, so it takes plain assignment
  if (own && !own.configurable && own.writable) {
    host[name] = value;
    return value;
  }
  // assignment leaves a getter or a read-only value in place, so shadow it
  Object.defineProperty(host, name, {
    value,
    writable: true,
    enumerable: own ? own.enumerable : true,
    configurable: true,
  });
  return value;
};

/*
  Puts a value on the global object (or any host) under a name and returns the
  value the name holds afterward. A name held by a different value is a
  conflict: 'warn' keeps the existing value and warns once per name in
  development, 'keep' keeps it quietly, 'replace' overwrites it
*/
export const defineGlobal = (name, value, { host = globalThis, onConflict = 'warn' } = {}) => {
  if (onConflict !== 'warn' && onConflict !== 'keep' && onConflict !== 'replace') {
    throw new TypeError(`defineGlobal: onConflict is 'warn', 'keep' or 'replace', got ${String(onConflict)}`);
  }
  if (!isObject(host) && !isFunction(host)) {
    throw new TypeError(`defineGlobal: host must be an object to hold ${String(name)}, got ${String(host)}`);
  }
  if (!(name in host)) {
    host[name] = value;
    return value;
  }
  const held = host[name];
  // the same value again is a module re-run under hot reload
  if (Object.is(held, value)) {
    return held;
  }
  if (onConflict === 'replace') {
    return replaceProperty(host, name, value);
  }
  if (onConflict === 'warn') {
    isDevelopment
      && warnOnce(
        host,
        name,
        `defineGlobal: '${
          String(name)
        }' is already defined, keeping the existing value. pass onConflict 'keep' to keep it quietly or 'replace' to overwrite it`,
      );
  }
  return held;
};
