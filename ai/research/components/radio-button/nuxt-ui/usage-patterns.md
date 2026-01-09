# Nuxt UI - Radio Group Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.nuxt.com/docs/components/radio-group
Status: ✅ Working
Version: Current (Nuxt UI 3.0+)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The documentation provides thorough coverage of all props, variants, item configurations, and layout options with clear interactive examples. Strong emphasis on flexible data structures and visual variants.

## Component Definition
- **Core purpose**: A radio group component that enables selection of a single option from a multiple-choice list, providing both controlled and uncontrolled state management with rich visual presentation options.
- **Mental model**: A set of mutually exclusive choices where selecting one automatically deselects the others. Users think of it as "pick one from this list" with visual feedback for the currently selected option. The component handles the mutual exclusivity logic internally.
- **Semantic meaning**: Communicates single-choice selection through visual indicators (radio circles), enforces mutual exclusivity semantically, and provides context through legends and descriptions. Visual variants (list/card/table) signal different levels of information density and importance.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text labels | ✅ | Native | Via `items` array with `label` property or `labelKey` for custom field mapping. Each item displays a primary label. |
| Descriptions | ✅ | Native | Via `description` property in items or `descriptionKey` for custom field mapping. Provides secondary explanatory text below labels. |
| Legend/Title | ✅ | Native | Via `legend` prop for semantic grouping. Renders as `<legend>` element within `<fieldset>` structure. |
| String arrays | ✅ | Native | Simplest pattern: `items: ['Option 1', 'Option 2']` - items are both label and value. |
| Object arrays | ✅ | Native | Full pattern: `items: [{ label: 'Label', description: 'Desc', value: 'val', disabled: false }]`. Supports arbitrary object structures via key mapping. |
| Custom field mapping | ✅ | Native | `valueKey`, `labelKey`, `descriptionKey` props allow using custom property names (e.g., `value-key="id"` to use `id` field as value). |
| Custom content | ⚠️ | Limited | No slot-based custom content per item. Customization via `ui` prop for styling only. |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| List variant | ✅ | Native | Default variant. `variant="list"` - vertical list with standard radio indicators and spacing. |
| Card variant | ✅ | Native | `variant="card"` - each option rendered as a card with border and padding, elevated appearance. Better for options with descriptions. |
| Table variant | ✅ | Native | `variant="table"` - compact table-like layout with rows for each option. Denser information presentation. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled (group) | ✅ | Native | `disabled` boolean prop disables entire radio group. All items become non-interactive. |
| Disabled (individual) | ✅ | Native | Per-item `disabled: true` in items array. Allows selective disabling while keeping group active. |
| Required | ⚠️ | Not documented | No explicit `required` prop mentioned in documentation. Would need to handle via form validation. |
| Error state | ⚠️ | Not documented | No explicit error or invalid state prop. Likely handled through form integration or custom styling. |
| Initial value | ✅ | Native | `default-value` prop for uncontrolled state. Sets initial selection without v-model binding. |
| Controlled value | ✅ | Native | `v-model` or `modelValue` prop for controlled state management. Two-way binding with parent component. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Five sizes: `xs`, `sm`, `md` (default), `lg`, `xl`. Applied via `size` prop. Affects indicator size and spacing. |
| Color options | ✅ | Native | Seven semantic colors: `primary` (default), `secondary`, `success`, `info`, `warning`, `error`, `neutral`. Applied via `color` prop. |
| Orientation | ✅ | Native | `orientation="vertical"` (default) or `"horizontal"`. Controls layout direction of radio options. |
| Indicator position | ✅ | Native | `indicator="start"` (default), `"end"`, or `"hidden"`. Controls radio button indicator placement relative to label. |
| Loop focus | ✅ | Native | `loop` boolean prop. When true, keyboard navigation loops from last to first item (and vice versa). |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Value change handler | ✅ | Native | Standard Vue `v-model` two-way binding. Use `@update:modelValue` for change events. |
| Controlled mode | ✅ | Native | Via `v-model` or `modelValue` prop. Parent controls selected value. |
| Uncontrolled mode | ✅ | Native | Via `default-value` prop. Component manages its own state. |
| Keyboard navigation | ✅ | Native | Built-in arrow key navigation between items. Optional loop behavior via `loop` prop. |
| Form integration | ✅ | Native | Works with v-model for standard form binding. Integrates with Nuxt UI form components (UForm, UFormField). |

## Code Examples

### Basic String Array
```vue
<template>
  <URadioGroup
    v-model="selected"
    :items="['Option 1', 'Option 2', 'Option 3']"
  />
</template>

<script setup>
const selected = ref('Option 1')
</script>
```

### Object Arrays with Descriptions
```vue
<template>
  <URadioGroup
    v-model="selected"
    :items="options"
  />
</template>

<script setup>
const selected = ref('option-1')

const options = [
  {
    label: 'Option 1',
    description: 'Description for option 1',
    value: 'option-1'
  },
  {
    label: 'Option 2',
    description: 'Description for option 2',
    value: 'option-2'
  },
  {
    label: 'Option 3',
    description: 'Description for option 3',
    value: 'option-3',
    disabled: true
  }
]
</script>
```

### Custom Field Mapping
```vue
<template>
  <URadioGroup
    v-model="selected"
    :items="users"
    value-key="id"
    label-key="name"
    description-key="email"
  />
</template>

<script setup>
const selected = ref(1)

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
]
</script>
```

### With Legend
```vue
<template>
  <URadioGroup
    v-model="selected"
    legend="Choose your preferred option"
    :items="['Option 1', 'Option 2', 'Option 3']"
  />
</template>

<script setup>
const selected = ref('Option 1')
</script>
```

### Visual Variants
```vue
<!-- List variant (default) -->
<URadioGroup
  v-model="selected"
  variant="list"
  :items="options"
/>

<!-- Card variant -->
<URadioGroup
  v-model="selected"
  variant="card"
  :items="options"
/>

<!-- Table variant -->
<URadioGroup
  v-model="selected"
  variant="table"
  :items="options"
/>
```

### Size and Color Customization
```vue
<!-- Color customization -->
<URadioGroup
  v-model="selected"
  color="neutral"
  :items="options"
/>

<URadioGroup
  v-model="selected"
  color="success"
  :items="options"
/>

<!-- Size options -->
<URadioGroup
  v-model="selected"
  size="xs"
  :items="options"
/>

<URadioGroup
  v-model="selected"
  size="xl"
  :items="options"
/>
```

### Layout Options
```vue
<!-- Horizontal orientation -->
<URadioGroup
  v-model="selected"
  orientation="horizontal"
  :items="['Option 1', 'Option 2', 'Option 3']"
/>

<!-- Indicator at end -->
<URadioGroup
  v-model="selected"
  indicator="end"
  :items="options"
/>

<!-- Hidden indicator -->
<URadioGroup
  v-model="selected"
  indicator="hidden"
  :items="options"
/>
```

### Disabled States
```vue
<!-- Entire group disabled -->
<URadioGroup
  v-model="selected"
  disabled
  :items="options"
/>

<!-- Individual items disabled -->
<script setup>
const options = [
  { label: 'Available', value: 'available' },
  { label: 'Disabled', value: 'disabled', disabled: true },
  { label: 'Available', value: 'available-2' }
]
</script>

<template>
  <URadioGroup v-model="selected" :items="options" />
</template>
```

### Uncontrolled with Default Value
```vue
<template>
  <URadioGroup
    default-value="option-2"
    :items="options"
  />
</template>

<script setup>
const options = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' }
]
</script>
```

### Keyboard Navigation with Loop
```vue
<template>
  <URadioGroup
    v-model="selected"
    loop
    :items="options"
  />
</template>

<script setup>
// Arrow keys navigate through options
// With loop=true, navigation wraps from last to first
const selected = ref('option-1')
const options = ['Option 1', 'Option 2', 'Option 3']
</script>
```

### Form Integration
```vue
<script setup>
import { z } from 'zod'

const state = reactive({
  plan: undefined
})

const schema = z.object({
  plan: z.enum(['free', 'pro', 'enterprise'], {
    required_error: 'Please select a plan'
  })
})

const plans = [
  {
    label: 'Free',
    description: 'Basic features for personal use',
    value: 'free'
  },
  {
    label: 'Pro',
    description: 'Advanced features for professionals',
    value: 'pro'
  },
  {
    label: 'Enterprise',
    description: 'Custom solutions for organizations',
    value: 'enterprise'
  }
]

async function onSubmit() {
  console.log('Selected plan:', state.plan)
}
</script>

<template>
  <UForm :state="state" :schema="schema" @submit="onSubmit">
    <UFormField name="plan" label="Select a plan">
      <URadioGroup
        v-model="state.plan"
        :items="plans"
        variant="card"
      />
    </UFormField>

    <UButton type="submit">Continue</UButton>
  </UForm>
</template>
```

### Advanced Customization via UI Prop
```vue
<script setup>
const selected = ref('option-1')

const customUI = {
  fieldset: 'space-y-4',
  legend: 'text-lg font-bold',
  item: 'hover:bg-gray-50',
  indicator: 'text-blue-500',
  label: 'font-medium',
  description: 'text-gray-500 text-sm'
}
</script>

<template>
  <URadioGroup
    v-model="selected"
    legend="Custom Styled Radio Group"
    :items="options"
    :ui="customUI"
  />
</template>
```

### Per-Item Customization
```vue
<script setup>
const options = [
  {
    label: 'Standard Option',
    value: 'standard'
  },
  {
    label: 'Custom Styled',
    value: 'custom',
    class: 'border-2 border-blue-500',
    ui: {
      label: 'text-blue-600 font-bold',
      description: 'text-blue-400'
    }
  },
  {
    label: 'Another Standard',
    value: 'standard-2'
  }
]
</script>

<template>
  <URadioGroup v-model="selected" :items="options" />
</template>
```

## Notable Features

- **Flexible data structures**: The `valueKey`, `labelKey`, and `descriptionKey` props enable reuse with differently-structured data sources without transformation. This is particularly useful when working with API responses or diverse data models.

- **Three distinct visual variants**: Unlike most radio group implementations that offer a single presentation, Nuxt UI provides `list`, `card`, and `table` variants for different information density needs. Card variant works well for options with descriptions, while table is optimal for compact presentations.

- **Per-item and group-level disabling**: Individual items can be disabled while keeping the group interactive, allowing fine-grained control over available options based on application state.

- **Indicator positioning flexibility**: The `indicator` prop with `start`, `end`, or `hidden` options provides layout flexibility uncommon in radio group components. Hidden indicators support custom radio button styling.

- **Keyboard navigation with loop control**: Built-in arrow key navigation with optional looping (via `loop` prop) provides excellent accessibility and user experience control.

- **Semantic HTML structure**: Uses proper `<fieldset>` and `<legend>` elements for accessibility and form semantics, ensuring screen reader compatibility and proper form grouping.

- **Controlled and uncontrolled modes**: Supports both `v-model` (controlled) and `default-value` (uncontrolled) patterns, accommodating different state management approaches.

- **Orientation control**: Unlike many radio group implementations limited to vertical layout, the `orientation` prop enables horizontal layouts for different design needs.

- **Rich customization system**: Multi-layer customization through `ui` prop at both group and per-item levels, targeting specific elements (root, fieldset, legend, item, container, base, indicator, wrapper, label, description).

- **Color-mode aware**: Integrates with Nuxt UI's color-mode system for automatic dark/light theme adaptation.

## Research Notes

**Framework Approach Observations:**

1. **Vue-centric state management**: Uses Vue's `v-model` for two-way binding and reactivity. State management is implicit through Vue's reactivity system rather than explicit signals or stores.

2. **Data-driven rendering**: Strong emphasis on array-based configuration (`items` prop) rather than composing individual radio components. This approach simplifies programmatic generation of options.

3. **Flexible data binding**: The key mapping props (`valueKey`, `labelKey`, `descriptionKey`) show sophisticated handling of diverse data structures, reducing need for data transformation layers.

4. **Variant-based visual presentation**: Three variants (list, card, table) provide semantic meaning to presentation choices rather than requiring custom styling for different information densities.

5. **Semantic HTML priority**: Uses proper fieldset/legend structure, demonstrating commitment to accessibility and form semantics over div-based layouts.

6. **Utility-first customization**: Based on Tailwind CSS, customization happens through utility classes via `ui` prop and `class` prop, both at group and item levels.

7. **Accessibility-first design**: Built-in keyboard navigation, semantic HTML, proper ARIA attributes, and screen reader support are core features, not afterthoughts.

8. **TypeScript-first**: Strong typing for props, items structure, and event handlers ensures type safety throughout component usage.

9. **Orientation flexibility**: Uncommon horizontal layout support shows attention to diverse UI patterns beyond standard vertical radio groups.

10. **Indicator control**: Hidden indicator option suggests support for custom radio button styling while maintaining semantic radio behavior.

**Distinctive Patterns vs Other Frameworks:**

- **Three visual variants** (list, card, table) is uncommon - most frameworks provide single presentation style
- **Flexible field mapping** through dedicated key props is more sophisticated than typical label/value patterns
- **Per-item UI customization** through item-level `ui` objects is rare in radio group components
- **Indicator positioning** (start/end/hidden) provides layout flexibility not found in most implementations
- **Loop navigation control** is an accessibility feature not commonly exposed as a configurable option
- **Semantic HTML structure** with fieldset/legend is more standards-compliant than many modern implementations

**Potential Learning Points for Semantic UI:**

- The **variant system** (list, card, table) could inspire semantic presentation modes for radio groups based on information density needs
- **Flexible field mapping** (valueKey, labelKey, descriptionKey) enables cleaner integration with diverse data sources without transformation layers
- **Per-item customization** through structured `ui` objects provides powerful styling control while maintaining declarative patterns
- **Indicator positioning control** (start/end/hidden) could support diverse layout requirements without custom CSS
- **Loop navigation control** as an explicit prop improves accessibility while giving developers control over navigation behavior
- **Orientation as a first-class prop** simplifies horizontal radio group layouts without custom styling
- **Card variant** for options with descriptions provides better information hierarchy than standard radio layouts
- **Uncontrolled mode** via `default-value` prop offers simpler state management for static forms
- **Data-driven item configuration** through arrays may be more ergonomic than composing individual radio components for dynamic lists
- **Semantic HTML structure** with proper fieldset/legend should be prioritized for accessibility and form semantics
