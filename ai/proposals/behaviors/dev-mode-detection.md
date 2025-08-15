# Development Mode Detection Proposal

## Overview
Add automatic development mode detection to Query behaviors for intelligent default configuration.

## Implementation Location
- **File**: `/packages/query/src/register-behavior.js`
- **Storage**: `Query.development` static property

## Proposed Implementation

```javascript
// At top of register-behavior.js
const development = (() => {
  // Check Node.js environment variable (webpack, rollup, etc.)
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    return true;
  }
  
  // Check Vite/modern bundler env
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    return true;
  }
  
  // Check global __DEV__ flag (some bundlers)
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return true;
  }
  
  // Default to false (production)
  return false;
})();

// Store on Query for global access
Query.development = development;
```

## Usage

```javascript
// In behaviors or user code
if (Query.development) {
  console.log('Development mode active');
}

// Auto-configure settings based on mode
Query.settings = {
  silent: !Query.development,
  verbose: false,
  performance: false,
  errors: Query.development
};
```

## Benefits
- Zero configuration for users
- Automatic optimization in production
- Standard detection methods used by major frameworks
- No runtime overhead in production builds

## Compatibility
- Works with all major bundlers (Vite, Webpack, Rollup, ESBuild)
- Falls back safely to production mode if uncertain
- No breaking changes to existing API

## Size Impact
- ~200 bytes unminified
- Tree-shaken in production builds when using modern bundlers