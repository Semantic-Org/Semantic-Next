# Global Settings Proposal

## Overview
Add global configuration flags for controlling logging, performance tracking, and error behavior across all Query behaviors.

## Implementation Location
- **File**: `/packages/query/src/register-behavior.js`
- **Storage**: `Query.settings` static property

## Proposed Implementation

```javascript
// In register-behavior.js, after development detection
Query.settings = {
  // Logging control
  logLevel: Query.development ? 'info' : 'silent',  // 'silent', 'error', 'warn', 'info', 'debug'
  performance: false,                               // Enable performance tracking (orthogonal)
};
```

## Implementation Details

### Settings Storage and Access
```javascript
// Query.settings is accessible as:
Query.settings           // Direct access
$.settings              // Via $ import (Query.settings)

// Alias setup in helpers.js (if needed)
const $ = function(selector, args = {}) {
  return new Query(selector, args);
};
$.settings = Query.settings;  // Alias for convenience
```

### Settings Merge Process
```javascript
// In registerBehavior, modify the existing settings merge
export const registerBehavior = (behavior) => {
  // ... existing behavior setup ...
  
  Query.prototype[name] = function(settings) {
    // ... existing defaultValues and runtimeConfig setup ...
    
    // MODIFY THIS EXISTING LINE:
    // Currently: const runtimeSettings = deepExtend({}, defaultSettings, settings);
    // Change to include global settings:
    const runtimeSettings = deepExtend(
      {},
      Query.settings,      // Add global settings first
      defaultSettings,     // Then behavior defaults
      settings            // Then user settings (highest priority)
    );
    
    // ... rest of existing behavior initialization
  };
};
```

### Integration Points
The merge happens at **line 85** in the current `register-behavior.js` where `runtimeSettings` is created. This ensures global settings are inherited by every behavior instance while still allowing per-behavior and per-instance overrides.

### Settings Flow Through System
```javascript
// 1. Global settings established
Query.settings = {
  logLevel: Query.development ? 'info' : 'silent',
  performance: false
};

// 2. Behavior defines its defaults
const defaultSettings = {
  logLevel: 'debug',  // This behavior wants debug by default
  showDelay: 100
};

// 3. User provides overrides
$('.modal').modal({
  logLevel: 'silent',  // User wants this specific modal silent
  showDelay: 200
});

// 4. Final merged settings passed to Behavior constructor
// Result: { logLevel: 'silent', performance: false, showDelay: 200 }
```

## Usage Patterns

### Global Configuration
```javascript
// Set globally for all behaviors
Query.settings.logLevel = 'debug';      // Show everything
Query.settings.performance = true;

// Development setup
if (import.meta.env.DEV) {
  Query.settings.logLevel = 'info';     // Normal development logging
  Query.settings.performance = localStorage.getItem('perf') === 'true';
}

// Production (only show critical issues)
Query.settings.logLevel = 'error';     // Only errors
```

### Per-Behavior Override
```javascript
// Override for specific behavior instance
$('.modal').modal({
  logLevel: 'debug',      // This modal shows everything even if global is silent
});
```

### Per-Behavior Type Override
```javascript
// Override defaults for all tooltips
$.tooltip.defaultSettings.logLevel = 'debug';
```

## Benefits
- Consistent debugging experience across all behaviors
- Easy global configuration for development vs production
- Per-instance override capability
- Follows existing Semantic UI settings pattern

## Compatibility
- Non-breaking: existing behaviors continue to work
- Additive: only adds new optional settings
- Familiar: uses same pattern as existing behavior settings

## Size Impact
- ~100 bytes for settings object
- No runtime overhead when disabled