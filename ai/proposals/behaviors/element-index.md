# Element Index Proposal

## Overview
Add index and total element count to behavior callbacks, enabling behaviors to be aware of their position in multi-element selections for features like animation staggering.

## Implementation Location
- **File**: `/packages/query/src/register-behavior.js`
- **Scope**: Behavior initialization and callback parameters

## Proposed Implementation

### Registration Phase
```javascript
// In registerBehavior, where $elements.each() is called
$elements.each(function(element, index) {
  // ... existing setup code ...
  
  const behaviorConfig = {
    sharedBehavior,
    $element,
    Query,
    ...runtimeConfig,
    settings: runtimeSettings,
    
    // Add index information
    elementIndex: index,
    totalElements: $elements.length,
  };
  
  // Pass to Behavior constructor
  if (!instance) {
    instance = new Behavior(behaviorConfig);
  }
  
  // ... rest of method call handling
});
```

### Behavior Class Storage
```javascript
// In behavior.js constructor
constructor({
  // ... existing parameters ...
  elementIndex = 0,
  totalElements = 1,
  // ... rest of parameters
} = {}) {
  // ... existing initialization ...
  
  // Store index information
  this.elementIndex = elementIndex;
  this.totalElements = totalElements;
  
  // ... rest of constructor
}
```

### Callback Parameters
```javascript
// In behavior.js call() method
call(func, { params, additionalParams = {} } = {}) {
  const self = this;
  
  if (!params) {
    params = {
      // ... existing params ...
      
      // Add index information
      index: self.elementIndex,           // 0-based index in selection
      total: self.totalElements,          // Total elements in selection
      isFirst: self.elementIndex === 0,   // Convenience boolean
      isLast: self.elementIndex === self.totalElements - 1,  // Convenience boolean
      
      // ... rest of params
    };
  }
  
  // ... rest of call method
}
```

## Usage Patterns

### Animation Staggering
```javascript
registerBehavior({
  name: 'slideIn',
  
  defaultSettings: {
    staggerDelay: 100,  // ms between each element
  },
  
  createBehavior: ({ index, total, settings, log }) => ({
    animate() {
      const delay = index * settings.staggerDelay;
      
      log('Animating element', { 
        index: index + 1,  // Human-readable (1-based)
        total, 
        delay 
      });
      
      setTimeout(() => {
        this.performAnimation();
      }, delay);
    }
  })
});

// Usage: stagger animations across multiple elements
$('.cards').slideIn({ staggerDelay: 150 });
```

### Progressive Loading
```javascript
registerBehavior({
  name: 'lazyLoad',
  
  createBehavior: ({ index, total, isFirst, isLast }) => ({
    load() {
      // Load first image immediately, others with delay
      const delay = isFirst ? 0 : index * 200;
      
      setTimeout(() => {
        this.loadImage();
        
        if (isLast) {
          this.onAllLoaded();
        }
      }, delay);
    }
  })
});
```

### Transition Queueing
```javascript
registerBehavior({
  name: 'transition',
  
  createBehavior: ({ index, total, mark, measure }) => ({
    fadeIn() {
      // Use index for transition queue delays
      const queueDelay = index * 50;
      
      mark(`queue-${index}`);
      
      setTimeout(() => {
        this.performFade();
        measure(`fade-${index}`, `${this.namespace}:queue-${index}`);
      }, queueDelay);
    }
  })
});
```

### Conditional Behavior Based on Position
```javascript
registerBehavior({
  name: 'accordion',
  
  createBehavior: ({ index, isFirst, isLast, log }) => ({
    initialize() {
      // First accordion might start open
      if (isFirst && this.settings.openFirst) {
        this.open();
      }
      
      // Last accordion might have different styling
      if (isLast) {
        this.$element.addClass('last-item');
      }
      
      log('Initialized accordion', { 
        position: `${index + 1} of ${this.total}`,
        isFirst,
        isLast 
      });
    }
  })
});
```

### Event Coordination
```javascript
registerBehavior({
  name: 'tabs',
  
  events: {
    'click .tab': ({ index, total, self, log }) => {
      log('Tab clicked', { clickedTab: index, totalTabs: total });
      
      // Close all other tabs (they know their own index)
      self.notifyOthers('close', { except: index });
    }
  },
  
  createBehavior: ({ index }) => ({
    notifyOthers(action, data) {
      // Each tab instance knows its position
      this.dispatchEvent('tab:action', { 
        action, 
        sourceIndex: index,
        ...data 
      });
    }
  })
});
```

## Benefits
- Enables animation staggering and sequencing
- Supports queue-based behaviors (needed for transitions)
- Allows position-aware behavior modifications
- Enables coordination between behavior instances
- Essential for building complex multi-element interactions

## Use Cases
- **Transition queuing**: Delay animations based on element position
- **Progressive loading**: Load content in sequence with delays
- **Animation staggering**: CSS/JS animations with timing offsets
- **Event coordination**: Behaviors that need to communicate with siblings
- **Conditional logic**: Different behavior for first/last elements

## Compatibility
- Non-breaking: existing behaviors continue to work
- Additive: only adds new optional parameters
- Backward compatible: defaults to single element (index=0, total=1)

## Size Impact
- ~100 bytes for index storage and calculations
- No runtime overhead for single-element selections