/*-------------------
      Constants
--------------------*/

export const isServer = (() => {
  return typeof window === 'undefined';
})();

export const isClient = (() => {
  return typeof window !== 'undefined';
})();

export const isDevelopment = (() => {
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

  // Check global __DEV__ flag (React Native, some bundlers)
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return true;
  }

  // Default to false (production)
  return false;
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
