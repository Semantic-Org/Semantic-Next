# Script Configuration Proposal

## Overview
Enable standard script-based configuration of Query behavior settings, following patterns used by modern libraries like Lit and Vue for development/production configuration.

## Implementation Approach
Use standard ES module imports and conditionals for configuration, avoiding meta tags or query parameters in favor of explicit script configuration.

## Usage Patterns

### Development Configuration
```javascript
// main.js or app setup
import { $ } from '@semantic-ui/query';

// Development mode configuration
if (import.meta.env.DEV) {
  $.settings.verbose = true;
  $.settings.performance = true;
  $.settings.errors = true;
}

// Production mode (settings remain at defaults)
// No additional configuration needed
```

### Environment-Specific Setup
```javascript
// config/development.js
export const devConfig = {
  verbose: true,
  performance: true,
  errors: true,
  debug: true
};

// config/production.js  
export const prodConfig = {
  silent: true,
  verbose: false,
  performance: false,
  errors: false
};

// main.js
import { $ } from '@semantic-ui/query';

if (import.meta.env.DEV) {
  const { devConfig } = await import('./config/development.js');
  Object.assign($.settings, devConfig);
} else {
  const { prodConfig } = await import('./config/production.js');
  Object.assign($.settings, prodConfig);
}
```

### Conditional Debug Features
```javascript
// Enable verbose logging for specific debugging
if (localStorage.getItem('debug-semantic')) {
  $.settings.verbose = true;
  $.settings.performance = true;
}

// Enable performance tracking for optimization
if (location.hostname === 'staging.example.com') {
  $.settings.performance = true;
}

// Disable all logging for demos or screenshots
if (location.search.includes('silent')) {
  $.settings.silent = true;
}
```

### Build-Time Configuration
```javascript
// vite.config.js or webpack.config.js defines these
const isDebugBuild = process.env.SEMANTIC_DEBUG === 'true';
const isPerfBuild = process.env.SEMANTIC_PERF === 'true';

// In application code
if (import.meta.env.VITE_SEMANTIC_DEBUG) {
  $.settings.verbose = true;
}

if (import.meta.env.VITE_SEMANTIC_PERF) {
  $.settings.performance = true;
}
```

### Per-Feature Configuration
```javascript
// Enable logging for specific behavior types during development
if (import.meta.env.DEV) {
  // Global settings for all behaviors
  $.settings.verbose = true;
  
  // Per-behavior type override
  $.modal.defaultSettings.verbose = true;
  $.tooltip.defaultSettings.silent = false;
  $.transition.defaultSettings.performance = true;
}
```

### Dynamic Configuration
```javascript
// Runtime configuration changes
const enableDebug = () => {
  $.settings.verbose = true;
  $.settings.performance = true;
  console.log('Semantic UI debugging enabled');
};

const disableDebug = () => {
  $.settings.verbose = false;
  $.settings.performance = false;
  console.log('Semantic UI debugging disabled');
};

// Expose for console access
window.semantic = { enableDebug, disableDebug };
```

### Framework Integration Examples

#### Vite + Vue/React
```javascript
// src/main.js
import { $ } from '@semantic-ui/query';

if (import.meta.env.DEV) {
  $.settings.verbose = true;
  $.settings.performance = import.meta.env.VITE_PERF === 'true';
}
```

#### Next.js
```javascript
// pages/_app.js or app/layout.js
import { $ } from '@semantic-ui/query';

if (process.env.NODE_ENV === 'development') {
  $.settings.verbose = true;
  $.settings.performance = process.env.NEXT_PUBLIC_SEMANTIC_PERF === 'true';
}
```

#### Astro
```javascript
// src/components/Layout.astro
---
import { $ } from '@semantic-ui/query';

if (import.meta.env.DEV) {
  $.settings.verbose = true;
}
---
```

## Benefits
- **Standard approach**: Follows established patterns from major frameworks
- **Explicit configuration**: Clear, visible in source code
- **Build-time optimization**: Configurations can be tree-shaken in production
- **Flexible**: Supports multiple configuration strategies
- **No magic**: No hidden configuration mechanisms

## Why Not Meta Tags or Query Params
- **Meta tags**: Uncommon pattern, requires DOM parsing, not standard for JS libraries
- **Query parameters**: Fragile, affects URLs, not suitable for production configuration
- **Scripts are standard**: Every major library (Lit, Vue, React, Angular) uses script configuration

## Implementation Requirements
- No special parsing or detection logic needed
- Works with existing settings merge system
- Compatible with all bundlers and frameworks
- Can be configured before any behaviors are initialized

## Example Real-World Setup
```javascript
// semantic-ui-config.js - centralized configuration
export const configureSemanticUI = () => {
  const { $ } = await import('@semantic-ui/query');
  
  // Base configuration
  const config = {
    silent: !import.meta.env.DEV,
    verbose: false,
    performance: false,
    errors: import.meta.env.DEV
  };
  
  // Environment overrides
  if (import.meta.env.DEV) {
    config.verbose = localStorage.getItem('semantic-verbose') === 'true';
    config.performance = localStorage.getItem('semantic-perf') === 'true';
  }
  
  // Apply configuration
  Object.assign($.settings, config);
  
  return $;
};

// main.js
import { configureSemanticUI } from './semantic-ui-config.js';

const $ = await configureSemanticUI();
// Now all behaviors use the configured settings
```

## Size Impact
- Zero bytes: No additional code needed in library
- Configuration is user code, not library code
- Tree-shaken in production builds when using modern bundlers