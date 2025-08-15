# Logging Functions Proposal

## Overview
Add logging methods to the Behavior class that can be called from behavior implementations and accessed via DOM element instances.

## Implementation Location
- **File**: `/packages/query/src/behavior.js`
- **Methods**: Added to Behavior class prototype

## Proposed Implementation

### Behavior Class Methods

```javascript
// In behavior.js class
export class Behavior {
  // ... existing methods ...

  // Helper method for log level checking
  canLog(requiredLevel) {
    const levels = ['silent', 'error', 'warn', 'info', 'debug'];
    const currentLevel = levels.indexOf(this.settings.logLevel || 'silent');
    const required = levels.indexOf(requiredLevel);
    return currentLevel >= required;
  }

  log(message, data) {
    if (!this.canLog('info')) return;
    
    const prefix = `[${this.namespace}]`;
    
    if (this.settings.logLevel === 'debug') {
      console.log(prefix, message, data || '');  // Debug: full details
    } else {
      console.info(prefix, message);             // Info: basic message
    }
  }

  warn(message, data) {
    if (!this.canLog('warn')) return;
    console.warn(`[${this.namespace}]`, message, data || '');
  }

  error(message, data) {
    if (!this.canLog('error')) return;
    console.error(`[${this.namespace}]`, message, data || '');
    
    // Optional: dispatch error event for handling
    this.dispatchEvent('behavior:error', { 
      message, 
      namespace: this.namespace,
      data 
    });
  }
}
```

### Destructured Access in Callbacks

```javascript
// In behavior.js call() method
call(func, { params, additionalParams = {} } = {}) {
  const self = this;
  
  if (!params) {
    params = {
      // ... existing params ...
      
      // Add logging functions
      log: (message, data) => self.log(message, data),
      warn: (message, data) => self.warn(message, data),
      error: (message, data) => self.error(message, data),
      
      // ... rest of params
    };
  }
  
  // ... rest of call method
}
```

## Usage Patterns

### In Behavior Implementation
```javascript
registerBehavior({
  name: 'accordion',
  
  createBehavior: ({ log, warn, error }) => ({
    open(index) {
      log('Opening panel', { index });
      
      if (index >= this.panels.length) {
        error('Panel index out of bounds', { 
          requested: index, 
          available: this.panels.length 
        });
        return;
      }
      
      log('Animation starting');
      // ... implementation
    }
  }),
  
  events: {
    'click .header': ({ log, target }) => {
      log('Header clicked', { target });
    }
  }
});
```

### Log Level Examples
```javascript
// Different log levels in action
createBehavior: ({ log, warn, error }) => ({
  processData(data) {
    log('Processing data', { count: data.length });        // Shown at 'info' level
    
    if (data.some(item => !item.id)) {
      warn('Some items missing IDs', { data });             // Shown at 'warn' level
    }
    
    if (!data.length) {
      error('No data provided');                            // Shown at 'error' level
      return;
    }
  }
});
```

### Access via DOM Element
```javascript
// Since behavior instance is stored on element
const element = document.querySelector('.accordion');
element.accordion.log('Manual log from outside');
element.accordion.warn('Something might be wrong');
element.accordion.error('Critical issue');
```

### Access via Query
```javascript
// Through behavior instance
$('.accordion').accordion('log', 'Message from query');
// Or get instance and call directly
const instance = $('.accordion').eq(0).el().accordion;
instance.log('Direct instance call');
```

## Benefits
- Methods available on behavior instances for external debugging
- Consistent logging interface across all behaviors
- Respects global settings (silent, verbose, errors)
- Can be called from anywhere that has access to the behavior instance
- Zero overhead when silent mode is enabled

## Implementation Notes
- Methods check settings before doing any work (performance)
- Use console.debug for normal logs (hidden by default in production)
- Error method optionally dispatches events for error handling
- All methods respect the `silent` setting for complete suppression

## Size Impact
- ~300 bytes for the three logging methods
- Minimal runtime overhead due to early returns when disabled