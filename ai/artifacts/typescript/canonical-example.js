/**
 * CANONICAL JAVASCRIPT EXAMPLE - CHECKBOX COMPONENT
 *
 * This is based on the actual checkbox component from the Semantic UI codebase
 * at docs/src/examples/component/checkbox/component.js
 *
 * This shows the EXACT JavaScript pattern that needs TypeScript inference support.
 * The challenge: make `self.methodName()` calls fully typed when extracted.
 */

import { defineComponent } from '@semantic-ui/component';

// Inline template for simplicity
const template = `
<label class="switch">
  <input type="checkbox" checked={checked}>
  <span class="slider"></span>
  <span class="label">
    {#if label}
      {label}
    {else}
      {>slot}
    {/if}
  </span>
</label>
`;

// CSS omitted for simplicity - assume it exists
const css = `/* checkbox styles */`;

const defaultSettings = {
  checked: false,
  label: '',
};

// Test 1: EXTRACTED function (current problematic pattern)
const createComponentExtracted = ({ self, state, settings }) => ({
  // In the actual checkbox, there are no self.method() calls
  // because it's a simple component with just settings
  // Let me show both inline vs extracted to test your hypothesis
});

// Test 2: INLINE function (your hypothesis - this might work)
defineComponent({
  tagName: 'ui-checkbox-inline',
  template,
  css,
  defaultSettings,

  createComponent: ({ self, state, settings }) => ({
    // Inline version - does TypeScript inference work here?
    someMethod() {
      // If we had self.method() calls here, would they be typed?
      return settings.checked;
    },
  }),
});

// Test 3: EXTRACTED function usage (the problematic pattern)
defineComponent({
  tagName: 'ui-checkbox',
  template,
  css,
  defaultSettings,
  createComponent: createComponentExtracted, // <-- Does this lose inference?
});

/**
 * EXTERNAL USAGE (should be fully typed):
 */

// Get component instance
const checkbox = document.querySelector('ui-checkbox');
const instance = checkbox.component; // this is what is returned from define component

// These method calls should have full TypeScript autocomplete and type safety:
instance.toggle(); // Should be known method
instance.setChecked(true); // Should accept boolean parameter
instance.check(); // Should be known method
const isChecked = instance.isChecked(); // Should return boolean

/**
 * THE TYPESCRIPT CHALLENGE SUMMARY:
 *
 * When `createComponent` is extracted (as shown above), TypeScript needs to infer:
 *
 * 1. `self.toggle()` - should know this method exists
 * 2. `self.setChecked()` - should know this method exists and takes a boolean
 * 3. `self.updateVisualState()` - should know this method exists
 * 4. `state.isChecked.get()` - should know this is a Signal<boolean>
 * 5. `settings.checked` - should know this is a boolean
 * 6. `settings.onChange` - should know this is a function or null
 *
 * All while preserving the elegant destructuring pattern:
 * `({ self, state, settings }) => ({ ... })`
 *
 * This is the EXACT pattern used throughout the Semantic UI codebase.
 */
