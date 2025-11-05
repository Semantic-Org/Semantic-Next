# Nuxt UI - Progress Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.nuxt.com/components/progress
Status: ✅ Working
Version: Nuxt UI 4.1.0
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The documentation provides extensive coverage of all props, variants, animations, states, and integration patterns. Built on Reka UI primitives with clear examples and interactive playground showing all features.

## Component Definition
- **Core purpose**: A visual indicator that communicates task completion status, supporting both determinate (percentage-based) and indeterminate (animated) states. Provides flexible visual feedback for processes ranging from simple progress to multi-stage workflows.
- **Mental model**: A progress bar that shows "how far along" a task is. Users think of it in two modes: (1) known progress where you show a percentage/value, and (2) unknown/busy state where it continuously animates. Can display step labels for multi-stage processes.
- **Semantic meaning**: Communicates process status and completion expectation. A filled bar indicates progress made, animation indicates active work without known completion time, and percentage text provides precise feedback for accessibility and clarity.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `modelValue`, `max`, `status`)
- **Composed**: Via composition/children (e.g., custom status slot content)
- **CSS-only**: Requires custom styling (e.g., `class` prop for spacing/layout customization)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Percentage display | ✅ | Native | Via `status` prop or custom `status` slot. Prop shows calculated percentage above bar. Slot receives `{ percent?: number }` for custom rendering (e.g., "75%" or "45 of 60 files"). |
| Step labels | ✅ | Native | Pass array to `max` prop: `<UProgress :max="['Step 1', 'Step 2', 'Step 3']" />`. Displays step text beneath bar for multi-stage processes. |
| Custom status content | ✅ | Composed | Via `status` slot receiving `{ percent?: number }` object. Enables custom formatting, units, labels, or icons combined with percentage. |
| Value text (accessibility) | ✅ | Native | Via `getValueText` prop accepting function `(value: number, max: number) => string` for screen readers and accessible labeling. |
| Animated indeterminate | ✅ | Native | Set `modelValue` to `null` or undefined. Component auto-animates with configurable animation style (carousel, swing, elastic). |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar (horizontal) | ✅ | Native | Default with `orientation="horizontal"`. Fills left-to-right. Use `inverted` prop to reverse direction. |
| Vertical bar | ✅ | Native | `orientation="vertical"` with height constraint (e.g., `class="h-48"`). Fills bottom-to-top. |
| Indeterminate/Animated | ✅ | Native | When `modelValue` is null/undefined, shows continuous animation. Four animation styles available: carousel, carousel-inverse, swing, elastic. |
| Step indicator | ✅ | Native | Pass array to `max` prop to display step labels. Useful for wizards, multi-stage deployments, or sequential processes. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Indeterminate | ✅ | Native | `modelValue={null}` triggers continuous animation. Indicates "work in progress, time unknown". Configurable via `animation` prop. |
| Complete state | ✅ | Native | Set `modelValue` equal to `max`. Progress bar fills completely. Status display shows "100%". |
| Empty state | ✅ | Native | Set `modelValue` to 0 or undefined (for indeterminate). Shows unfilled bar or animated bar. |
| Loading/Active (animated) | ✅ | Native | Use `modelValue={null}` with selected `animation` style. Best for upload/download/processing feedback. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Eight sizes: `2xs`, `xs`, `sm`, `md` (default), `lg`, `xl`, `2xl`. Control bar height via `size` prop. |
| Color options | ✅ | Native | Seven semantic colors: `primary` (default), `secondary`, `success`, `info`, `warning`, `error`, `neutral`. Applied via `color` prop. |
| Animation styles | ✅ | Native | Four animation types for indeterminate state: `carousel` (default), `carousel-inverse`, `swing`, `elastic`. Control movement pattern and direction. |
| Orientation | ✅ | Native | `horizontal` (default) or `vertical`. Vertical requires height constraint. |
| Inverted direction | ✅ | Native | `inverted` boolean prop reverses visual fill direction for RTL or custom UX. |
| Maximum value type | ✅ | Native | Numeric `max` or array of step labels. Array enables step-based workflows with text labels. |

## Code Examples

### Basic Progress with Value
```vue
<script setup lang="ts">
  const value = ref(50)
</script>
<template>
  <!-- Simple progress at 50% -->
  <UProgress v-model="value" />

  <!-- With max value explicitly set -->
  <UProgress v-model="value" :max="100" />
</template>
```
[View Live](https://ui.nuxt.com/components/progress) *(if available)*

### Progress with Status Display
```vue
<script setup lang="ts">
  const value = ref(75)
</script>
<template>
  <!-- Shows "75%" above the bar -->
  <UProgress v-model="value" status />

  <!-- Custom status text via slot -->
  <UProgress v-model="value">
    <template #status="{ percent }">
      <span class="text-sm font-semibold">{{ percent }}% Complete</span>
    </template>
  </UProgress>

  <!-- Custom formatting with context -->
  <UProgress :model-value="45" :max="60">
    <template #status="{ percent }">
      45 of 60 files processed
    </template>
  </UProgress>
</template>
```

### Indeterminate Progress (Animated)
```vue
<template>
  <!-- Carousel animation (default) -->
  <UProgress :model-value="null" />

  <!-- Carousel inverse animation -->
  <UProgress :model-value="null" animation="carousel-inverse" />

  <!-- Swing animation (pendulum effect) -->
  <UProgress :model-value="null" animation="swing" />

  <!-- Elastic animation (bouncy) -->
  <UProgress :model-value="null" animation="elastic" />
</template>
```

### Step-Based Progress
```vue
<script setup lang="ts">
  const step = ref(1)
  const steps = ['Waiting...', 'Cloning...', 'Migrating...', 'Deploying...', 'Done!']
</script>
<template>
  <!-- Step labels displayed beneath bar -->
  <UProgress v-model="step" :max="steps" />

  <!-- Manually control step -->
  <div class="space-y-4">
    <UProgress v-model="step" :max="steps.length" status />
    <div class="space-x-2">
      <button @click="step = Math.max(1, step - 1)">Previous</button>
      <button @click="step = Math.min(steps.length, step + 1)">Next</button>
    </div>
  </div>
</template>
```

### Color and Size Variations
```vue
<template>
  <!-- Colors -->
  <UProgress value="50" color="primary" />
  <UProgress value="60" color="secondary" />
  <UProgress value="70" color="success" />
  <UProgress value="40" color="warning" />
  <UProgress value="20" color="error" />

  <!-- Sizes -->
  <UProgress value="50" size="2xs" />
  <UProgress value="50" size="sm" />
  <UProgress value="50" size="md" />
  <UProgress value="50" size="lg" />
  <UProgress value="50" size="2xl" />
</template>
```

### Vertical Progress
```vue
<script setup lang="ts">
  const downloadProgress = ref(65)
</script>
<template>
  <!-- Vertical bar requires height constraint -->
  <div class="flex items-end gap-4">
    <div class="w-8 h-48">
      <UProgress v-model="downloadProgress" orientation="vertical" status />
    </div>
    <p>{{ downloadProgress }}% Downloaded</p>
  </div>
</template>
```

### Inverted Progress
```vue
<template>
  <!-- Fills right-to-left or bottom-to-top -->
  <UProgress value="40" inverted />

  <!-- Inverted vertical -->
  <div class="h-48">
    <UProgress value="40" orientation="vertical" inverted />
  </div>
</template>
```

### Accessible Value Text
```vue
<script setup lang="ts">
  const value = ref(45)

  // Custom function for screen readers
  const getValueText = (value, max) => {
    return `${value} of ${max} steps completed`
  }
</script>
<template>
  <!-- Screen reader will announce custom text -->
  <UProgress
    v-model="value"
    :max="100"
    :get-value-text="getValueText"
  />
</template>
```

### Real-World: File Upload
```vue
<script setup lang="ts">
  const uploadProgress = ref(null) // null = indeterminate during upload
  const uploadedBytes = ref(0)
  const totalBytes = ref(1024 * 1024 * 100) // 100MB

  async function handleUpload(file) {
    uploadProgress.value = null // Show indeterminate
    try {
      // ... upload logic with progress tracking
      uploadProgress.value = (uploadedBytes.value / totalBytes.value) * 100
    } catch (e) {
      uploadProgress.value = null
    }
  }
</script>
<template>
  <div class="space-y-2">
    <UProgress v-model="uploadProgress" color="primary" size="lg">
      <template #status="{ percent }">
        {{ uploadedBytes }} / {{ totalBytes }} bytes
      </template>
    </UProgress>
    <input type="file" @change="e => handleUpload(e.files[0])" />
  </div>
</template>
```

### Real-World: Multi-Stage Process
```vue
<script setup lang="ts">
  const currentStep = ref(1)
  const steps = [
    'Initialization',
    'Data Processing',
    'Validation',
    'Deployment',
    'Completion'
  ]

  async function advanceStep() {
    if (currentStep.value < steps.length) {
      currentStep.value++
      // Simulate work
      await new Promise(r => setTimeout(r, 1000))
    }
  }
</script>
<template>
  <div class="space-y-4">
    <UProgress
      v-model="currentStep"
      :max="steps"
      status
    />
    <p>Current: {{ steps[currentStep - 1] }}</p>
    <button @click="advanceStep" :disabled="currentStep === steps.length">
      {{ currentStep === steps.length ? 'Complete' : 'Next Step' }}
    </button>
  </div>
</template>
```

## Theming & Customization

### Via UI Prop
```vue
<script setup lang="ts">
  const customUI = {
    base: 'relative overflow-hidden rounded-full bg-gray-200',
    indicator: 'bg-gradient-to-r from-blue-500 to-purple-500',
    status: 'text-xs font-semibold text-center'
  }
</script>
<template>
  <UProgress
    value="50"
    status
    :ui="customUI"
  />
</template>
```

### Via Class Prop
```vue
<template>
  <!-- Adjust spacing -->
  <div class="space-y-2">
    <UProgress value="50" status />
  </div>

  <!-- Custom container styling -->
  <div class="p-4 bg-white rounded-lg border">
    <UProgress value="65" color="success" />
  </div>
</template>
```

### Global Configuration
```ts
// app.config.ts
export default defineAppConfig({
  ui: {
    progress: {
      variants: {
        color: {
          brand: 'bg-brand-500'
        }
      },
      size: {
        xl: 'h-3'
      }
    }
  }
})
```

## Notable Features

- **Four animation styles for indeterminate state**: carousel, carousel-inverse, swing, and elastic provide visual variety for different UX contexts (loading spinners, processing bars, etc.).

- **Step-based progress via array max**: Passing an array of strings to the `max` prop automatically displays step labels, eliminating the need for separate step indicators. Particularly useful for wizards and deployment processes.

- **Flexible status slot**: The `status` slot receives a computed `percent` value, enabling custom formatting (percentages, bytes, progress text, icons) without component modifications.

- **Inverted direction option**: Useful for RTL languages or specialized UX patterns where progress fills right-to-left or bottom-to-top.

- **Vertical orientation**: Built-in vertical support with proper height constraints enables flexible layout options (download meter, volume slider analog, etc.).

- **Accessibility-first with getValueText**: The `getValueText` prop provides screen readers with meaningful text, crucial for accessible progress indication.

- **Reka UI foundation**: Built on industry-standard Reka UI primitives ensuring solid accessibility (WAI-ARIA) and cross-browser compatibility.

- **Compound color/animation variants**: Tailwind-based styling handles complex scenarios (inverted + vertical, animation + size) through compound variant system.

## Research Notes

**Framework Approach Observations:**

1. **Vue v-model pattern**: Two-way binding through `v-model` is the primary way to control progress. Aligns with Vue conventions for reactive state management. No explicit signal system; reactivity is implicit through Vue's Proxy-based system.

2. **Null for indeterminate state**: Using `null` or `undefined` for `modelValue` to trigger indeterminate animation is elegant - leverages JavaScript's type system for meaningful state distinction.

3. **Array-based step configuration**: Passing an array to `max` prop for step labels is a creative pattern avoiding need for separate step component or complex configuration.

4. **Slot-based customization**: The `status` slot provides a minimal but powerful extension point - receives computed percent and allows complete custom rendering without wrapper components.

5. **Animation as visual variant**: Four animation types (carousel, swing, elastic) are first-class variations, suggesting animation style is important for UX distinction in indeterminate states.

6. **Accessibility-conscious**: `getValueText` prop and Reka UI foundation show commitment to accessible progress indicators - not all UI frameworks prioritize this.

7. **Orientation as variant**: Rather than separate vertical component, using `orientation` prop is simpler while maintaining unified API.

8. **Inverted as inversion toggle**: Rather than separate reverse/inverse component, single boolean prop keeps API small while enabling advanced layouts.

9. **Compound theming**: Tailwind CSS foundation enables complex styling through utility combinations. `ui` prop slot-based customization adds escape hatch for radical styling changes.

10. **Value semantics**: Supports both numeric progress (0-100) and array-indexed (step-based), showing flexibility in how "progress" can be conceptualized.

**Distinctive Patterns vs Other Frameworks:**

- **Step array pattern**: Using `:max="['Step 1', 'Step 2', ...]"` to automatically render steps is creative and uncommon. Most frameworks require separate step components or manual configuration.

- **Four animation types built-in**: Rather than single animation style, providing carousel, swing, elastic, and carousel-inverse shows thoughtfulness about different animation aesthetics.

- **Null semantics**: Using `null` for indeterminate (rather than a boolean flag like `indeterminate={true}`) leverages JavaScript's type system elegantly.

- **Vertical orientation support**: Many progress components are horizontal-only; built-in vertical support with `orientation` prop and height constraints is convenient.

- **Status slot flexibility**: Slot receives just `percent` value, keeping interface minimal while allowing unlimited custom content (icons, units, custom formatting).

**Potential Learning Points for Semantic UI:**

- The `animation` prop providing multiple animation style options could inspire varied animation support in indeterminate states across components.

- Step-based progress via array could inform design of other sequential/stepped components (steppers, tabs, wizard components).

- The `status` slot pattern (minimal context, maximum flexibility) is a good model for other components' slot designs.

- Vertical orientation support shows value in components being orientation-agnostic where possible.

- Using `null`/`undefined` for indeterminate states is cleaner semantics than boolean flags.

- Accessible `getValueText` prop should be standard in components that communicate information to users.

- Compound animation variants show how to provide visual variety without bloating the component with special cases.

**Code Quality & Architecture Notes:**

- Built on Reka UI, a mature headless UI library, ensuring solid foundation for accessibility and functionality.
- Nuxt UI's design follows Vue 3 composition API patterns and conventions.
- Slot-based customization avoids prop explosion while maintaining composability.
- Tailwind CSS integration enables lightweight styling with utility classes and compound variants.
- Global configuration through `app.config.ts` follows Nuxt conventions for theme management.
