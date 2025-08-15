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

## Settings Inheritance

Settings are merged in this order (last wins):
1. Global `Query.settings`
2. Behavior `defaultSettings`
3. User-provided `settings`

```javascript
// In registerBehavior prototype function
const runtimeSettings = deepExtend(
  {},
  Query.settings,      // Global settings first
  defaultSettings,     // Then behavior defaults
  settings            // Then user settings (highest priority)
);
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