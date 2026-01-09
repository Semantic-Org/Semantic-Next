# Vuetify - Radio Button Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://vuetifyjs.com/en/components/radio-buttons
Status: ✅ Working
Version: v3.x (current stable)
Last Verified: 2025-11-05

## Documentation Quality
Moderate - The official documentation provides basic examples and covers core functionality, though API documentation pages have minimal content. The component follows Material Design specifications. Community resources (Stack Overflow, GitHub issues, Medium articles) provide additional practical examples and workarounds for advanced use cases.

## Component Definition
- **Core purpose**: Provides a Vue.js-based radio button control for single selection from a predefined set of options, with grouping functionality via v-radio-group component
- **Mental model**: A form control for mutually exclusive choices built on Material Design principles, using Vue's v-model for two-way data binding with both individual and grouped selection patterns
- **Semantic meaning**: Communicates a single choice from a set of options, with visual cues for selection state, validation, and interaction availability, following Material Design radio button specifications

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `v-model`, `disabled`, `color="primary"`)
- **Composed**: Via composition/children (e.g., `<v-radio-group><v-radio /></v-radio-group>`)
- **Slots**: Custom content via Vue slots (e.g., `<template #label>`)
- **CSS-only**: Requires custom styling or Vuetify theme customization

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text label | ✅ | Native | `label` prop for text directly adjacent to radio button |
| HTML label | ✅ | Slots | `label` slot allows defining labels with HTML content support |
| Group label | ✅ | Native | `v-radio-group` supports `label` prop for group-level labeling |
| Error message | ✅ | Native | `error-messages` prop displays validation error messages on group |
| Hint text | ⚠️ | Limited | `hint` and `persistent-hint` props not natively supported on v-radio (feature requested but not implemented) |
| Custom icon | ❌ | Not Available | No native custom icon support (uses Material Design standard radio appearance) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single radio | ✅ | Native | Individual `v-radio` component with `v-model` for standalone use |
| Radio group | ✅ | Native | `v-radio-group` component manages selection state for multiple v-radio components |
| True/False toggle | ✅ | Native | Single radio with `true-value` and `false-value` props for custom boolean states |
| Row layout | ✅ | Native | `row` prop on `v-radio-group` displays radios horizontally |
| Column layout | ✅ | Native | `column` prop on `v-radio-group` (default) displays radios vertically |
| Inline layout | ✅ | Native | `inline` prop on `v-radio-group` for inline display in Vuetify 3 |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Unchecked | ✅ | Native | Default state - radio not selected |
| Checked | ✅ | Native | Controlled via `v-model` on v-radio-group or individual radio |
| Disabled unchecked | ✅ | Native | `disabled` prop on unchecked radio prevents interaction |
| Disabled checked | ✅ | Native | `disabled` prop on checked radio shows selected but non-interactive |
| Readonly | ✅ | Native | `readonly` prop available for all form input elements |
| Error state | ✅ | Native | `:error-messages` prop or `:rules` validation on v-radio-group |
| Required | ✅ | Native | `required` prop on v-radio-group with validation rules |
| Mandatory | ✅ | Native | `mandatory` prop ensures radio group always has a value selected |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | `color` prop accepts Vuetify theme colors (e.g., "primary", "red", "indigo-darken-3") |
| Density options | ✅ | Native | `density` prop supports "compact" and "comfortable" modes in Vuetify 3 |
| Theme integration | ✅ | Native | Integrates with Vuetify theme system via `useTheme()` in Vue 3 composition API |
| Horizontal layout | ✅ | Native | `row` or `inline` props on v-radio-group for horizontal arrangement |
| Vertical layout | ✅ | Native | `column` prop on v-radio-group (default behavior) |
| Custom spacing | ✅ | CSS-only | No native spacing prop; use CSS classes or Vuetify utility classes |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Uncontrolled | ⚠️ | Limited | Vue encourages controlled components; no explicit `defaultValue` prop |
| Controlled | ✅ | Native | `v-model` or `:model-value` + `@update:model-value` for full control |
| Group controlled | ✅ | Native | `v-radio-group` with `v-model` manages selected value from child v-radio values |
| onChange handler | ✅ | Native | `@update:model-value` event (Vue 3) or `@change` event for value changes |
| Integer values | ✅ | Native | Use `:value` binding (e.g., `:value="0"`) to set numeric values instead of strings |
| Form integration | ✅ | Native | Standard `name` and `value` attributes for native form submission |
| Validation | ✅ | Native | `:rules` prop accepts array of validation functions returning true or error string |
| Async validation | ⚠️ | Complex | Async validation requires explicit `form.validate()` call due to timing issues |
| Cannot uncheck | ✅ | Native | Standard radio behavior - once group value is set, it cannot be unchecked without programmatic reset to null |

## Code Examples

### Basic Usage
```vue
<template>
  <v-radio label="I cannot be unchecked" />
</template>
```

### Basic Radio Group
```vue
<template>
  <v-radio-group v-model="selectedValue">
    <v-radio label="Option 1" value="option1"></v-radio>
    <v-radio label="Option 2" value="option2"></v-radio>
    <v-radio label="Option 3" value="option3"></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const selectedValue = ref('option1')
</script>
```

### Radio Group with Integer Values
```vue
<template>
  <v-radio-group v-model="selectedNumber">
    <v-radio label="Zero" :value="0"></v-radio>
    <v-radio label="One" :value="1"></v-radio>
    <v-radio label="Two" :value="2"></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const selectedNumber = ref(0)
</script>
```

### Radio Group with Label and Description
```vue
<template>
  <v-radio-group
    v-model="framework"
    label="Select your favorite framework"
  >
    <v-radio label="Vue.js" value="vue"></v-radio>
    <v-radio label="React" value="react"></v-radio>
    <v-radio label="Angular" value="angular"></v-radio>
    <v-radio label="Svelte" value="svelte"></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const framework = ref('vue')
</script>
```

### Colors
```vue
<template>
  <v-radio-group v-model="selectedColor">
    <v-radio
      v-for="color in colors"
      :key="color"
      :label="color"
      :value="color"
      :color="color"
    ></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const colors = ['red', 'red-darken-3', 'indigo', 'indigo-darken-3', 'orange', 'primary']
const selectedColor = ref('red')
</script>
```

### Row Layout
```vue
<template>
  <v-radio-group v-model="selected" row>
    <v-radio label="Option 1" value="1"></v-radio>
    <v-radio label="Option 2" value="2"></v-radio>
    <v-radio label="Option 3" value="3"></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref('1')
</script>
```

### Inline Layout (Vuetify 3)
```vue
<template>
  <v-radio-group v-model="selected" inline>
    <v-radio label="Option 1" value="1"></v-radio>
    <v-radio label="Option 2" value="2"></v-radio>
    <v-radio label="Option 3" value="3"></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref('1')
</script>
```

### Disabled State
```vue
<template>
  <v-radio-group v-model="selected">
    <v-radio label="Enabled option" value="enabled"></v-radio>
    <v-radio label="Disabled unchecked" value="disabled-unchecked" disabled></v-radio>
    <v-radio label="Disabled checked" value="disabled-checked" disabled></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref('disabled-checked')
</script>
```

### Mandatory (Always Has Value)
```vue
<template>
  <v-radio-group v-model="required" mandatory>
    <v-radio label="Option A" value="a"></v-radio>
    <v-radio label="Option B" value="b"></v-radio>
    <v-radio label="Option C" value="c"></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const required = ref('a')
</script>
```

### Validation with Rules
```vue
<template>
  <v-form v-model="valid">
    <v-radio-group
      v-model="selection"
      :rules="[v => !!v || 'Selection is required']"
      label="Pick an option *"
      required
    >
      <v-radio label="Radio One" value="one"></v-radio>
      <v-radio label="Radio Two" value="two"></v-radio>
      <v-radio label="Radio Three" value="three"></v-radio>
    </v-radio-group>
  </v-form>
</template>

<script setup>
import { ref } from 'vue'

const valid = ref(false)
const selection = ref(null)
</script>
```

### Error Messages
```vue
<template>
  <v-radio-group
    v-model="selection"
    :error-messages="errorMessage"
    label="Pick a number"
  >
    <v-radio label="Radio 1" :value="0"></v-radio>
    <v-radio label="Radio 2" :value="1"></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref, watch } from 'vue'

const selection = ref(null)
const errorMessage = ref('Please select an option')

watch(selection, (newVal) => {
  errorMessage.value = newVal !== null ? null : 'Please select an option'
})
</script>
```

### Single Radio with True/False Values
```vue
<template>
  <v-radio
    v-model="agreement"
    label="I agree to the terms"
    :true-value="true"
    :false-value="false"
  ></v-radio>
  <p>Value: {{ agreement }}</p>
</template>

<script setup>
import { ref } from 'vue'

const agreement = ref(false)
</script>
```

### Density (Compact/Comfortable)
```vue
<template>
  <v-radio-group v-model="theme" inline>
    <v-radio
      label="Light Theme"
      value="light"
      density="compact"
    ></v-radio>
    <v-radio
      label="Dark Theme"
      value="dark"
      density="compact"
    ></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const theme = ref('light')
</script>
```

### Theme Integration (Vuetify 3)
```vue
<template>
  <v-radio-group v-model="currentTheme" inline>
    <v-radio
      label="Light"
      value="light"
      density="compact"
    ></v-radio>
    <v-radio
      label="Dark"
      value="dark"
      density="compact"
    ></v-radio>
  </v-radio-group>
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()
const currentTheme = theme.global.name
</script>
```

### Label Slot with HTML
```vue
<template>
  <v-radio-group v-model="selected">
    <v-radio value="custom">
      <template #label>
        <div>
          <strong>Custom Label</strong>
          <span class="text-grey"> - with HTML support</span>
        </div>
      </template>
    </v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref('custom')
</script>
```

### Dynamic Iteration
```vue
<template>
  <v-radio-group v-model="selected" label="Select a framework">
    <v-radio
      v-for="framework in frameworks"
      :key="framework.value"
      :label="framework.label"
      :value="framework.value"
    ></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const frameworks = [
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' }
]

const selected = ref('vue')
</script>
```

## Notable Features

### Vue.js Integration
- Built specifically for Vue.js with native Vue 3 composition API support
- Uses Vue's `v-model` directive for seamless two-way data binding
- Supports both Options API and Composition API patterns
- Reactive by default through Vue's reactivity system

### Material Design Implementation
- Follows Material Design specifications for radio button interactions and appearance
- Consistent with Material Design visual language and animation guidelines
- Provides expected Material Design states (hover, focus, disabled, selected)
- Standard Material Design radio button styling and behavior

### v-radio-group Component
- Acts as a container to manage selection state across multiple radio buttons
- Provides group-level props (label, mandatory, row/column/inline layout)
- Simplifies state management - single v-model controls entire group
- Handles value coordination between child v-radio components automatically
- Supports validation and error messages at the group level

### Two-Way Data Binding
- Native v-model support on both individual radios and radio groups
- Automatic synchronization between component state and data model
- No need for explicit event handlers in simple cases
- Supports both string and numeric values with proper binding

### Mandatory Selection
- `mandatory` prop ensures a radio group always has a selected value
- Prevents users from deselecting all options
- Useful for required choices in forms
- Combined with validation for robust form controls

### Layout Flexibility
- Three layout modes: column (default), row, and inline
- Column layout for vertical stacking
- Row layout for horizontal arrangement
- Inline layout for tight horizontal spacing (Vuetify 3)
- No hardcoded layout constraints - compose freely

### Integer Value Support
- Explicit support for numeric values via `:value` binding
- Properly handles integers instead of coercing to strings
- Important for forms with numeric options (ratings, quantities, etc.)
- Clean API without string-to-number conversion hacks

### Custom True/False States
- Individual radios support `true-value` and `false-value` props
- Enables radio buttons as boolean toggles with custom values
- Useful for agreement checkboxes or on/off settings
- More flexible than standard boolean binding

### Validation System
- Rules-based validation via `:rules` prop
- Array of validation functions returning true or error message
- Integrates with v-form for coordinated form validation
- Supports required field validation out of the box
- Error message display via `:error-messages` prop

### Vuetify Theme System
- Deep integration with Vuetify's theming system
- Color prop accepts full Vuetify color palette with shades
- Density options (compact, comfortable) for size control
- Can access and control theme via `useTheme()` composable
- Automatic dark mode support through theme switching

### Slot-Based Customization
- Label slot accepts HTML content for rich label formatting
- Enables complex label layouts (icons, badges, formatted text)
- Maintains accessibility while allowing visual customization
- Clean separation between behavior and presentation

### Accessibility
- Built on standard HTML radio input for native accessibility
- Proper ARIA attributes for screen reader support
- Keyboard navigation follows standard radio button patterns
- Focus management handled automatically
- Label association for clickable labels

### Disabled and Readonly States
- Disabled prop prevents interaction while showing state
- Readonly prop allows viewing but prevents changes
- Both work on individual radios or entire groups
- Visual feedback for non-interactive states
- Maintains form value structure when disabled

### Form Integration
- Standard `name` and `value` attributes for native form submission
- Works with HTML form POST without JavaScript
- Compatible with form validation libraries (VeeValidate, Vuelidate)
- Integrates with Vuetify's v-form component
- Progressive enhancement from plain HTML forms

### Vue 3 Composition API
- Full support for Vue 3 Composition API with `<script setup>`
- Reactive refs work seamlessly with v-model
- Composables like `useTheme()` for advanced integration
- Modern Vue 3 patterns throughout documentation
- TypeScript support implied through Vue 3 compatibility

## Research Notes

- Vuetify is a Vue.js-specific Material Design component framework, not framework-agnostic
- v-radio-group is the primary component, with v-radio as the child component for individual buttons
- Documentation structure follows Vuetify conventions: component page + separate API pages
- Official documentation is somewhat sparse; community resources provide significant value
- Vuetify 2 has reached EOL; current stable is Vuetify 3 with Vue 3 support
- The component leverages Vue's reactivity system rather than implementing custom reactivity
- No custom icon support unlike some other frameworks (uses standard Material Design radio appearance)
- Hint/persistent-hint props requested by community but not implemented (GitHub issues #6576, #1478)
- Validation system requires careful handling with async updates (may need explicit form.validate() calls)
- The `mandatory` prop is a distinctive feature not commonly found in other frameworks
- Density prop (compact/comfortable) is a Vuetify 3 addition for responsive sizing
- Integer value support requires explicit `:value` binding to avoid string coercion
- Layout control (row/column/inline) happens at the group level, not individual radio level
- Error messages and validation are group-level concerns rather than individual radio concerns
- The framework follows Material Design 3 specifications in current versions
- Theme integration via `useTheme()` is powerful for dynamic theme switching
- Community reports issues with programmatic value updates and validation timing
- Standard radio behavior enforced: cannot uncheck a selected radio without resetting to null
- The component is part of the larger Vuetify ecosystem with consistent APIs across components
- Package: vuetify (includes all components, not published as separate packages)
- Active development with regular updates, though documentation could be more comprehensive
- Strong community support with extensive Stack Overflow coverage and GitHub discussions
