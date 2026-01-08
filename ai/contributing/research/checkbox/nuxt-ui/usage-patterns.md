# Nuxt UI - Checkbox Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://ui.nuxt.com/components/checkbox
Status: ✅ Working
Version: Current (Nuxt UI 3.0+)
Last Verified: 2024-11-04

## Documentation Quality
Comprehensive - The documentation provides thorough coverage of all props, variants, states, and customization options with clear examples and interactive demonstrations. Built on Reka UI primitives for accessibility.

## Component Definition
- **Core purpose**: A form input component that allows users to toggle between checked, unchecked, and indeterminate states, supporting both controlled (v-model) and uncontrolled (default-value) modes with rich label, description, and validation support.
- **Mental model**: A binary or tri-state selection control that communicates choice confirmation. Users think of it as "the thing I toggle to mark something as selected/confirmed" with clear visual feedback for all states.
- **Semantic meaning**: Represents selection state in forms, indicates agreement/acknowledgment, and manages hierarchical selections through the indeterminate state. Color variants communicate semantic meaning (error for validation, success for confirmation).

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/slots
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label text | ✅ | Native | Via `label` prop. Positioned according to `indicator` prop (start/end). Required state shown with asterisk via `required` prop. |
| Description/help text | ✅ | Native | Via `description` prop. Displays below label for additional context. |
| Custom label content | ✅ | Composed | Via `label` slot with scope `{ label?: string }`. Allows rich content like icons, links, or formatted text. |
| Custom description | ✅ | Composed | Via `description` slot with scope `{ description?: string }`. Enables rich help text with HTML formatting. |
| Required indicator | ✅ | Native | Via `required` boolean prop. Automatically adds asterisk to label for visual required indication. |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| List variant | ✅ | Native | Default variant. `variant="list"` - standard checkbox with label/description layout. |
| Card variant | ✅ | Native | `variant="card"` - checkbox presented in card-like container with enhanced visual grouping. Better for forms with multiple sections. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Unchecked | ✅ | Native | Default state when `modelValue` or `defaultValue` is false. Empty checkbox indicator. |
| Checked | ✅ | Native | When `modelValue` or `defaultValue` is true. Shows check icon (customizable via `icon` prop). |
| Indeterminate | ✅ | Native | Via `modelValue="indeterminate"` or `defaultValue="indeterminate"`. Shows minus icon (customizable via `indeterminateIcon` prop). Crucial for parent checkboxes in hierarchical lists. |
| Disabled | ✅ | Native | Via `disabled` boolean prop. Reduces opacity, prevents interaction, shows not-allowed cursor. Works in all states (checked/unchecked/indeterminate). |
| Required | ✅ | Native | Via `required` boolean prop. Adds visual asterisk to label. Integrates with form validation. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Five sizes: `xs`, `sm`, `md` (default), `lg`, `xl`. Applied via `size` prop. Affects both checkbox and label/description sizing. |
| Color options | ✅ | Native | Seven semantic colors: `primary` (default), `secondary`, `success`, `info`, `warning`, `error`, `neutral`. Applied via `color` prop. Controls indicator background color when checked. |
| Indicator position | ✅ | Native | Three positions via `indicator` prop: `start` (default, left-aligned), `end` (right-aligned), `hidden` (no visual indicator). Hidden useful for custom implementations. |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled mode | ✅ | Native | Via `v-model` binding. Component value is fully controlled by parent. Updates on user interaction. Supports boolean or "indeterminate" string value. |
| Uncontrolled mode | ✅ | Native | Via `defaultValue` prop. Component manages its own state. Useful for simple forms without complex state management. |
| Form integration | ✅ | Native | Via `name` prop for form submission. `value` prop (default: "on") sets the value submitted when checked. `id` prop for label association. |
| Click/change events | ✅ | Native | Standard Vue `@update:modelValue` event emitted on state changes. Integrates with v-model. |

## Icon Customization
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom checked icon | ✅ | Native | Via `icon` prop. Accepts string identifier (e.g., `"i-lucide-heart"`) or icon object. Defaults to `appConfig.ui.icons.check`. |
| Custom indeterminate icon | ✅ | Native | Via `indeterminateIcon` prop. Accepts string identifier or icon object. Defaults to `appConfig.ui.icons.minus`. |
| Global icon config | ✅ | Native | Icons customizable globally via `app.config.ts` (Nuxt) or `vite.config.ts` (Vue) under `ui.icons.check` and `ui.icons.minus`. |

## Code Examples

### Basic Checkbox States
```vue
<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
const indeterminate = ref('indeterminate')
</script>

<template>
  <!-- Unchecked -->
  <UCheckbox v-model="checked" label="Unchecked state" />

  <!-- Checked (controlled) -->
  <UCheckbox v-model="checked" label="Check me" />

  <!-- Checked (uncontrolled) -->
  <UCheckbox default-value label="Checked by default" />

  <!-- Indeterminate -->
  <UCheckbox v-model="indeterminate" label="Partially selected" />
  <UCheckbox default-value="indeterminate" label="Indeterminate default" />
</template>
```

### Label and Description Patterns
```vue
<template>
  <!-- Simple label -->
  <UCheckbox label="Accept terms" />

  <!-- Label with description -->
  <UCheckbox
    label="Enable notifications"
    description="Receive email updates about your account activity."
  />

  <!-- Required field -->
  <UCheckbox
    label="I agree to the Terms of Service"
    description="You must accept to continue."
    required
  />

  <!-- Custom label via slot -->
  <UCheckbox>
    <template #label>
      <span class="font-bold">Custom Label</span>
      <a href="#">Learn more</a>
    </template>
  </UCheckbox>

  <!-- Custom description via slot -->
  <UCheckbox label="Marketing emails">
    <template #description>
      <span class="text-xs">
        Promotional content and special offers.
        <a href="#" class="underline">Privacy Policy</a>
      </span>
    </template>
  </UCheckbox>
</template>
```

### Color Variants
```vue
<template>
  <!-- Semantic colors -->
  <UCheckbox color="primary" default-value label="Primary" />
  <UCheckbox color="secondary" default-value label="Secondary" />
  <UCheckbox color="success" default-value label="Success" />
  <UCheckbox color="info" default-value label="Info" />
  <UCheckbox color="warning" default-value label="Warning" />
  <UCheckbox color="error" default-value label="Error" />
  <UCheckbox color="neutral" default-value label="Neutral" />
</template>
```

### Visual Variants
```vue
<template>
  <!-- List variant (default) -->
  <UCheckbox
    variant="list"
    label="List variant"
    description="Standard layout"
  />

  <!-- Card variant -->
  <UCheckbox
    variant="card"
    label="Card variant"
    description="Enhanced visual grouping"
  />

  <!-- Card variant with color -->
  <UCheckbox
    variant="card"
    color="primary"
    default-value
    label="Highlighted card"
    description="Combines card style with color accent"
  />
</template>
```

### Size Variations
```vue
<template>
  <UCheckbox size="xs" label="Extra small" />
  <UCheckbox size="sm" label="Small" />
  <UCheckbox size="md" label="Medium (default)" />
  <UCheckbox size="lg" label="Large" />
  <UCheckbox size="xl" label="Extra large" />
</template>
```

### Indicator Positioning
```vue
<template>
  <!-- Left-aligned indicator (default) -->
  <UCheckbox
    indicator="start"
    label="Indicator at start"
  />

  <!-- Right-aligned indicator -->
  <UCheckbox
    indicator="end"
    label="Indicator at end"
  />

  <!-- Hidden indicator (custom implementations) -->
  <UCheckbox
    indicator="hidden"
    label="No visible indicator"
  />

  <!-- Right indicator with card variant -->
  <UCheckbox
    variant="card"
    indicator="end"
    default-value
    label="Card with right indicator"
    description="Useful for certain layouts"
  />
</template>
```

### Disabled State
```vue
<template>
  <!-- Disabled unchecked -->
  <UCheckbox disabled label="Disabled unchecked" />

  <!-- Disabled checked -->
  <UCheckbox disabled default-value label="Disabled checked" />

  <!-- Disabled indeterminate -->
  <UCheckbox
    disabled
    default-value="indeterminate"
    label="Disabled indeterminate"
  />
</template>
```

### Custom Icons
```vue
<template>
  <!-- Custom check icon -->
  <UCheckbox
    icon="i-lucide-heart"
    default-value
    label="Love this option"
  />

  <!-- Custom indeterminate icon -->
  <UCheckbox
    indeterminate-icon="i-lucide-minus-circle"
    default-value="indeterminate"
    label="Partially selected"
  />

  <!-- Both custom icons -->
  <UCheckbox
    icon="i-lucide-star"
    indeterminate-icon="i-lucide-star-half"
    default-value
    label="Star rating style"
  />
</template>
```

### Form Integration
```vue
<script setup lang="ts">
import { reactive } from 'vue'

const formData = reactive({
  newsletter: false,
  terms: false,
  privacy: false
})

function handleSubmit() {
  console.log('Form data:', formData)
  // formData.newsletter, formData.terms, formData.privacy
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- With name and value for native form submission -->
    <UCheckbox
      v-model="formData.newsletter"
      name="newsletter"
      value="yes"
      label="Subscribe to newsletter"
    />

    <!-- Required field -->
    <UCheckbox
      v-model="formData.terms"
      name="terms"
      required
      label="I accept the Terms of Service"
      description="Required to create an account"
    />

    <UCheckbox
      v-model="formData.privacy"
      name="privacy"
      label="I have read the Privacy Policy"
    />

    <button type="submit">Submit</button>
  </form>
</template>
```

### Hierarchical Selection (Indeterminate Usage)
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref([
  { id: 1, label: 'Item 1', checked: false },
  { id: 2, label: 'Item 2', checked: false },
  { id: 3, label: 'Item 3', checked: false }
])

const parentState = computed(() => {
  const checkedCount = items.value.filter(i => i.checked).length
  if (checkedCount === 0) return false
  if (checkedCount === items.value.length) return true
  return 'indeterminate'
})

function toggleParent() {
  const newValue = parentState.value === true ? false : true
  items.value.forEach(item => item.checked = newValue)
}
</script>

<template>
  <!-- Parent checkbox with indeterminate state -->
  <UCheckbox
    :model-value="parentState"
    @update:model-value="toggleParent"
    label="Select all items"
    description="Toggle all child items"
  />

  <!-- Child checkboxes -->
  <div class="ml-6">
    <UCheckbox
      v-for="item in items"
      :key="item.id"
      v-model="item.checked"
      :label="item.label"
    />
  </div>
</template>
```

### Global Configuration
```typescript
// app.config.ts (Nuxt)
export default defineAppConfig({
  ui: {
    icons: {
      check: 'i-lucide-check-circle',
      minus: 'i-lucide-minus-square'
    },
    checkbox: {
      default: {
        color: 'primary',
        size: 'md',
        variant: 'list'
      }
    }
  }
})
```

### Custom Styling via UI Prop
```vue
<template>
  <!-- Custom class overrides via ui prop -->
  <UCheckbox
    label="Custom styled"
    :ui="{
      root: 'p-4 border rounded',
      container: 'gap-4',
      base: 'border-2',
      indicator: 'rounded-full',
      icon: 'text-white',
      wrapper: 'space-y-2',
      label: 'font-bold text-lg',
      description: 'text-sm italic'
    }"
    description="Fully customized appearance"
  />
</template>
```

### Polymorphic Rendering
```vue
<template>
  <!-- Render as different element -->
  <UCheckbox as="label" label="Rendered as label element" />

  <!-- Default is div -->
  <UCheckbox as="div" label="Default div wrapper" />
</template>
```

## Complete Props API

| Prop | Default | Type | Description |
|------|---------|------|-------------|
| `as` | `'div'` | `any` | Element or component to render as root |
| `label` | `undefined` | `string` | Label text displayed next to checkbox |
| `description` | `undefined` | `string` | Helper text displayed below label |
| `color` | `'primary'` | `"error" \| "primary" \| "secondary" \| "success" \| "info" \| "warning" \| "neutral"` | Color scheme for checked state |
| `variant` | `'list'` | `"card" \| "list"` | Visual style variant |
| `size` | `'md'` | `"md" \| "xs" \| "sm" \| "lg" \| "xl"` | Size of checkbox and label |
| `indicator` | `'start'` | `"start" \| "end" \| "hidden"` | Position of checkbox indicator |
| `icon` | `appConfig.ui.icons.check` | `string \| object` | Icon displayed when checked |
| `indeterminateIcon` | `appConfig.ui.icons.minus` | `string \| object` | Icon displayed in indeterminate state |
| `disabled` | `false` | `boolean` | Disable interaction |
| `name` | `undefined` | `string` | Form field name for submission |
| `id` | `undefined` | `string` | Element ID for label association |
| `required` | `false` | `boolean` | Mark field as required (adds asterisk) |
| `defaultValue` | `undefined` | `boolean \| "indeterminate"` | Initial value for uncontrolled mode |
| `value` | `"on"` | `null \| string \| number \| bigint \| Record<string, any>` | Value submitted in form when checked |
| `modelValue` | `undefined` | `boolean \| "indeterminate"` | Controlled state value (v-model) |
| `ui` | `{}` | `object` | Custom CSS classes for component parts |

## Slots API

| Slot | Scope | Description |
|------|-------|-------------|
| `label` | `{ label?: string }` | Custom label content. Receives label prop in scope. |
| `description` | `{ description?: string }` | Custom description content. Receives description prop in scope. |

## UI Configuration

The `ui` prop accepts an object with these keys for granular styling:

| Key | Description |
|-----|-------------|
| `root` | Outermost wrapper element |
| `container` | Container for indicator and content |
| `base` | Base checkbox visual element |
| `indicator` | Checkbox indicator wrapper |
| `icon` | Check/indeterminate icon element |
| `wrapper` | Label and description wrapper |
| `label` | Label text element |
| `description` | Description text element |

## Accessibility Features

- **Built on Reka UI**: Uses accessible primitives with proper ARIA attributes
- **Label association**: `id` prop enables explicit label-input association
- **Keyboard support**: Space/Enter to toggle, Tab to navigate
- **Required state**: Visual indicator (asterisk) plus form validation integration
- **Disabled state**: Proper `disabled` attribute and cursor styling
- **Screen reader support**: Semantic HTML with ARIA state attributes for checked/indeterminate/disabled states
- **Focus management**: Visible focus indicators for keyboard navigation

## Styling & Theming

### Color System
- Uses OKLCH color space for modern, perceptually uniform colors
- Primary color defaults to green with customizable shade levels (50-950)
- Supports light and dark mode automatically
- Color variants map to semantic meanings (error for validation, success for confirmation)

### Customization Layers
1. **Global config**: `app.config.ts` (Nuxt) or `vite.config.ts` (Vue) for app-wide defaults
2. **UI prop**: Component-level class overrides for specific instances
3. **Slots**: Complete content replacement for maximum flexibility

### CSS Architecture
- Built on Tailwind CSS utility classes
- Shadow DOM not used - relies on scoped styles via Vue SFCs
- Responsive sizing through Tailwind's responsive utilities
- Dark mode support through Tailwind's dark mode classes

## Best Practices

### When to Use Checkbox vs Other Inputs

**Use Checkbox when:**
- Binary choice (on/off, yes/no, enabled/disabled)
- Multiple independent selections in a group
- Confirming agreement (terms of service, consent)
- Managing hierarchical selections (with indeterminate state)
- Toggling features or settings

**Don't use Checkbox for:**
- Mutually exclusive options (use Radio instead)
- Single selection from a list (use Select/Radio instead)
- Actions that take immediate effect (use Toggle/Switch instead)

### State Management Patterns

**Controlled (recommended for complex forms):**
```vue
<script setup>
const accepted = ref(false)
// Full control, can validate, transform, or prevent changes
</script>
<template>
  <UCheckbox v-model="accepted" />
</template>
```

**Uncontrolled (good for simple forms):**
```vue
<template>
  <!-- Component manages its own state -->
  <UCheckbox default-value name="terms" />
</template>
```

### Indeterminate State Best Practices

- Use for parent checkboxes when some (but not all) children are selected
- Update parent to checked/unchecked when all/none children change
- Provide clear visual feedback for the indeterminate state
- Consider accessibility - ensure screen readers announce the state correctly

### Form Integration

- Always provide `name` prop for form submission
- Use `required` for mandatory fields
- Consider `description` for validation hints
- Group related checkboxes visually and semantically
- Use semantic `color` for validation feedback (error for invalid)

### Label Best Practices

- Keep labels concise but descriptive
- Use `description` for additional context, not critical information
- For long labels, ensure proper wrapping and alignment
- Make labels clickable by proper checkbox-label association
- Consider `required` indicator placement in layout

### Performance Considerations

- v-model binding is reactive - avoid unnecessary parent re-renders
- Use uncontrolled mode (`defaultValue`) for static forms
- Icons are loaded via Nuxt's icon system - ensure icons are optimized
- Card variant adds visual weight - use sparingly in dense forms

## Comparison Notes

### vs Traditional HTML Checkbox

**Advantages:**
- Built-in label and description support
- Native indeterminate state handling
- Consistent styling across browsers
- Size and color variants without custom CSS
- Form validation integration
- Accessibility improvements out of the box
- Card variant for richer presentations

**Tradeoffs:**
- Requires Nuxt UI framework
- Additional bundle size vs native input
- Vue reactivity overhead for simple cases

### vs Other Checkbox Components

**Unique Features:**
- Indeterminate state as first-class citizen with dedicated prop/icon
- Card variant for enhanced visual grouping
- Three-position indicator placement (start/end/hidden)
- Separate slots for label and description customization
- Built-in required state indicator
- Global icon configuration system
- OKLCH color system for modern color handling

**Common Patterns:**
- v-model for controlled state (standard Vue pattern)
- Disabled and required states (universal)
- Custom styling via props/slots (common in component libraries)
- Size variants (common pattern)

**Missing Features:**
- No built-in validation (relies on form component integration)
- No error state separate from color variants
- No built-in checkbox group component (manual implementation needed)
- No mixed content between checkbox and label (via slots only)

## Notable Features

- **First-class indeterminate support**: Unlike many checkbox implementations that treat indeterminate as an afterthought, Nuxt UI provides dedicated prop, icon, and full state management for indeterminate state.

- **Card variant**: Unique presentation mode that wraps checkbox in card-like container, useful for forms with visual hierarchy and grouping needs.

- **Indicator positioning**: Three-way control (start/end/hidden) provides layout flexibility. Hidden mode enables completely custom implementations while maintaining checkbox logic.

- **Separate label/description slots**: Fine-grained control over label and description rendering while maintaining accessibility and layout.

- **Required indicator**: Automatic asterisk rendering for required fields maintains consistency across forms without manual styling.

- **Global icon customization**: Icons configurable at app level ensures brand consistency across all checkboxes without per-instance configuration.

- **Built on Reka UI**: Leverages battle-tested accessible primitives, ensuring ARIA compliance and keyboard navigation work correctly.

- **Polymorphic rendering**: `as` prop allows rendering as different elements while maintaining checkbox behavior.

## Research Notes

**Framework Approach Observations:**

1. **Vue-centric state management**: Fully embraces Vue's reactivity with v-model for controlled mode and internal state management for uncontrolled mode. No explicit state primitives exposed.

2. **Composition-first customization**: Slots for label/description enable rich content composition while maintaining accessibility and layout.

3. **Accessibility foundation**: Built on Reka UI primitives ensures proper ARIA attributes, keyboard navigation, and screen reader support without manual implementation.

4. **Utility-first styling**: Based on Tailwind CSS, customization happens through utility classes (ui prop) rather than CSS-in-JS or styled-components.

5. **Config-driven theming**: Global configuration through app.config.ts follows Nuxt conventions for application-wide settings (icons, default props).

6. **Icon resolution system**: String-based icon identifiers ("i-lucide-*") integrate with Nuxt's auto-import and icon resolution system.

7. **Type-safe props**: TypeScript-first design with strict prop typing and union types for variant/color/size options.

8. **Form ecosystem integration**: Designed to work within Nuxt UI's form components (UForm, UFormField) for validation and state management.

9. **Semantic color system**: Color variants map to semantic meanings (error, success, warning) rather than purely visual distinctions.

10. **No shadow DOM**: Unlike web components, uses scoped styles via Vue SFCs for encapsulation.

**Distinctive Patterns vs Other Frameworks:**

- **Indeterminate as first-class state**: Most checkbox components treat indeterminate as a tertiary concern; Nuxt UI provides dedicated prop and icon system
- **Card variant**: Uncommon in checkbox components - most stick to list/inline presentations
- **Indicator positioning with hidden option**: More flexible than typical left/right positioning
- **Required indicator automation**: Most frameworks require manual asterisk or custom styling
- **Built-in description support**: Many checkbox components only support labels, requiring manual description markup
- **Separate label/description slots**: Fine-grained composition control is rarer than single default slot

**Potential Learning Points for Semantic UI:**

- **Indeterminate state handling**: Dedicated props and visual treatment for indeterminate state improves DX for hierarchical selections
- **Description support**: Built-in description prop with dedicated styling reduces boilerplate for form fields
- **Required indicator**: Automatic asterisk rendering maintains consistency and reduces manual styling
- **Indicator positioning**: Hidden option enables custom implementations while preserving checkbox logic
- **Card variant pattern**: Enhanced visual grouping could inspire similar pattern for form-heavy interfaces
- **Slots for label/description**: Separate slots provide composition flexibility while maintaining accessibility
- **Global icon configuration**: Reduces per-instance verbosity for brand consistency
- **Color semantic mapping**: Using colors to communicate validation/semantic state rather than purely aesthetic choices
