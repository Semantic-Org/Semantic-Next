# Stepper / Wizard - Nuxt UI Usage Patterns

> **Framework**: Nuxt UI
> **Component**: Stepper
> **Documentation**: https://ui.nuxt.com/docs/components/stepper
> **Research Date**: 2025-11-05

## Component Definition

The Stepper component in Nuxt UI is a navigation component designed to display a list of items in a stepper format to indicate progress through multi-step processes. It is built on top of Reka UI and provides customizable step indicators with flexible content rendering. The Stepper component is suitable for wizards, onboarding flows, checkout processes, and any multi-step workflow where users need clear visual indication of their progress and remaining steps.

The component operates in two modes: controlled (using `v-model`) or uncontrolled (using `defaultValue`), and supports both horizontal and vertical orientations. Steps can be configured with titles, descriptions, icons, and custom content, with optional linear progression that requires steps to be completed in order.

---

## Core Features

### Multi-Step Navigation

The Stepper provides visual progress indication through a sequence of steps. Each step can be in different states (completed, active, or pending) and users can navigate between steps either by clicking on step indicators or programmatically through component methods.

### Orientation Modes

Supports two layout directions:
- **Horizontal** - Steps are arranged left-to-right, suitable for desktop layouts
- **Vertical** - Steps are arranged top-to-bottom, better for mobile layouts and lengthy step sequences

### State Management

Offers both controlled and uncontrolled state management:
- **Controlled** - Parent component manages active step via `v-model`
- **Uncontrolled** - Component manages its own state with `defaultValue`

### Linear vs Non-Linear Progression

- **Linear mode** (default) - Steps must be completed in sequential order
- **Non-linear mode** - Users can jump to any step regardless of completion status

### Content Customization

Provides multiple ways to customize step content:
- Per-item `content` property for simple text
- `#content` slot for dynamic content based on active step
- Named slots (via `slot` property) for completely custom step rendering

### Size Variants

Five size options control the scale of step indicators and text:
- `xs` - Extra small
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `xl` - Extra large

### Color Schemes

Seven built-in color options for step indicator styling:
- `primary` (default)
- `secondary`
- `success`
- `info`
- `warning`
- `error`
- `neutral`

---

## Props API

### Stepper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `StepperItem[]` | required | Array of step configurations defining the stepper sequence |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Controls the size of step indicators and text |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'error' \| 'neutral'` | `'primary'` | Color scheme for step indicators |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the stepper |
| `disabled` | `boolean` | `false` | Disables navigation between steps |
| `linear` | `boolean` | `true` | Whether steps must be completed in sequential order |
| `modelValue` | `string \| number` | - | Controlled active step value (use with v-model) |
| `defaultValue` | `string \| number` | - | Initial active step for uncontrolled mode |
| `ui` | `object` | - | Theme configuration object for styling customization |

### StepperItem Props

Each item in the `items` array supports the following properties:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | - | Unique identifier for the step |
| `title` | `string` | - | Primary label displayed for the step |
| `description` | `string` | - | Additional descriptive text shown below the title |
| `icon` | `string \| object` | - | Icon identifier (e.g., "i-lucide-house") for the step indicator |
| `content` | `string` | - | Text content displayed when step is active |
| `slot` | `string` | - | Named slot identifier for custom content rendering |
| `disabled` | `boolean` | `false` | Whether this specific step is disabled |
| `class` | `any` | - | Custom CSS classes for the step item |
| `ui` | `object` | - | Per-item theme overrides |

---

## Usage Patterns

### Pattern 1: Basic Stepper

**Use case**: Simple multi-step process with minimal configuration

**Implementation**: Define an array of items with titles and let the component handle state management

```vue
<template>
  <UStepper :items="items" />
</template>

<script setup>
const items = [
  { title: 'Account' },
  { title: 'Profile' },
  { title: 'Confirmation' }
]
</script>
```

### Pattern 2: Controlled Stepper with Navigation

**Use case**: Parent component needs to control active step and provide navigation buttons

**Implementation**: Use `v-model` for two-way binding and component refs to access navigation methods

```vue
<template>
  <div>
    <UStepper v-model="step" :items="items" ref="stepper" />

    <div class="navigation">
      <UButton
        @click="stepper.prev()"
        :disabled="!stepper.hasPrev"
      >
        Previous
      </UButton>

      <UButton
        @click="stepper.next()"
        :disabled="!stepper.hasNext"
      >
        Next
      </UButton>
    </div>
  </div>
</template>

<script setup>
const step = ref(1)
const stepper = ref()

const items = [
  { value: 1, title: 'Step 1' },
  { value: 2, title: 'Step 2' },
  { value: 3, title: 'Step 3' }
]
</script>
```

### Pattern 3: Steps with Icons and Descriptions

**Use case**: Provide rich visual indicators and additional context for each step

**Implementation**: Add `icon` and `description` properties to step items

```vue
<template>
  <UStepper :items="items" />
</template>

<script setup>
const items = [
  {
    title: 'Personal Info',
    description: 'Enter your basic information',
    icon: 'i-lucide-user'
  },
  {
    title: 'Contact Details',
    description: 'Provide contact information',
    icon: 'i-lucide-mail'
  },
  {
    title: 'Review',
    description: 'Confirm your details',
    icon: 'i-lucide-check'
  }
]
</script>
```

### Pattern 4: Vertical Orientation

**Use case**: Mobile-friendly layout or when vertical space is preferable

**Implementation**: Set `orientation="vertical"`

```vue
<template>
  <UStepper
    :items="items"
    orientation="vertical"
  />
</template>

<script setup>
const items = [
  { title: 'Step 1' },
  { title: 'Step 2' },
  { title: 'Step 3' }
]
</script>
```

### Pattern 5: Non-Linear Progression

**Use case**: Allow users to jump between steps without sequential completion

**Implementation**: Set `linear="false"`

```vue
<template>
  <UStepper
    :items="items"
    :linear="false"
  />
</template>

<script setup>
const items = [
  { value: 1, title: 'Overview' },
  { value: 2, title: 'Settings' },
  { value: 3, title: 'Advanced' }
]
</script>
```

### Pattern 6: Custom Content per Step

**Use case**: Display different content based on the active step

**Implementation**: Use the `#content` slot which receives the current item

```vue
<template>
  <UStepper :items="items">
    <template #content="{ item }">
      <div v-if="item.value === 1">
        <h3>Welcome</h3>
        <p>Let's get started with your account setup.</p>
      </div>

      <div v-else-if="item.value === 2">
        <h3>Profile Information</h3>
        <form>
          <!-- form fields -->
        </form>
      </div>

      <div v-else-if="item.value === 3">
        <h3>All Set!</h3>
        <p>Your account is ready to use.</p>
      </div>
    </template>
  </UStepper>
</template>

<script setup>
const items = [
  { value: 1, title: 'Welcome' },
  { value: 2, title: 'Profile' },
  { value: 3, title: 'Complete' }
]
</script>
```

### Pattern 7: Named Slots for Specific Steps

**Use case**: Use dedicated template slots for complete control over individual step content

**Implementation**: Define `slot` property on items and create corresponding named slots

```vue
<template>
  <UStepper :items="items">
    <template #welcome>
      <div>
        <!-- Custom welcome content -->
      </div>
    </template>

    <template #profile>
      <div>
        <!-- Custom profile content -->
      </div>
    </template>

    <template #finish>
      <div>
        <!-- Custom finish content -->
      </div>
    </template>
  </UStepper>
</template>

<script setup>
const items = [
  { value: 1, title: 'Welcome', slot: 'welcome' },
  { value: 2, title: 'Profile', slot: 'profile' },
  { value: 3, title: 'Finish', slot: 'finish' }
]
</script>
```

### Pattern 8: Disabled Steps

**Use case**: Prevent access to certain steps until conditions are met

**Implementation**: Set `disabled` property on individual items or the entire component

```vue
<template>
  <UStepper :items="items" />
</template>

<script setup>
const items = [
  { value: 1, title: 'Basic Info' },
  { value: 2, title: 'Payment', disabled: true },
  { value: 3, title: 'Confirmation', disabled: true }
]
</script>
```

### Pattern 9: Size Variants

**Use case**: Adjust stepper size based on available space or design requirements

**Implementation**: Use the `size` prop with values from `xs` to `xl`

```vue
<template>
  <UStepper
    :items="items"
    size="lg"
  />
</template>

<script setup>
const items = [
  { title: 'Step 1' },
  { title: 'Step 2' },
  { title: 'Step 3' }
]
</script>
```

### Pattern 10: Custom Color Scheme

**Use case**: Match stepper colors to application theme or indicate different workflows

**Implementation**: Use the `color` prop with available color options

```vue
<template>
  <UStepper
    :items="items"
    color="success"
  />
</template>

<script setup>
const items = [
  { title: 'Start' },
  { title: 'Process' },
  { title: 'Complete' }
]
</script>
```

---

## Variants and Composition

### Orientation Variants

- **Horizontal** - Default layout with steps arranged horizontally
- **Vertical** - Alternative layout with steps stacked vertically

### Size Variants

- **xs** - Extra small indicators and text
- **sm** - Small indicators and text
- **md** - Medium indicators and text (default)
- **lg** - Large indicators and text
- **xl** - Extra large indicators and text

### Color Variants

- **primary** - Default brand color (default)
- **secondary** - Secondary brand color
- **success** - Green success state color
- **info** - Blue informational color
- **warning** - Yellow/orange warning color
- **error** - Red error state color
- **neutral** - Gray neutral color

### Sub-components

The Stepper component is composed of several internal parts that can be styled via the `ui` prop:

- **Root** - Main container element
- **Header** - Container for step indicators
- **Item** - Individual step container
- **Container** - Wrapper for step trigger
- **Trigger** - Clickable step indicator area
- **Indicator** - Visual step indicator (circle/icon)
- **Icon** - Icon element within indicator
- **Separator** - Line connecting steps
- **Wrapper** - Content area wrapper
- **Title** - Step title text
- **Description** - Step description text
- **Content** - Active step content area

---

## Accessibility

The Nuxt UI Stepper component inherits accessibility foundations from Reka UI, which follows ARIA best practices for stepped navigation patterns.

### Keyboard Navigation

- Users can navigate between focusable step indicators using standard keyboard navigation
- Interactive step triggers can be activated with Enter or Space keys

### Screen Reader Support

- Step states (active, completed, pending) are communicated to assistive technologies
- The component provides proper semantic structure for screen readers to announce progress

### Focus Management

- Focus is managed appropriately when navigating between steps
- Disabled steps are properly marked and excluded from keyboard navigation

### ARIA Attributes

The component likely implements ARIA attributes such as:
- `aria-label` or `aria-labelledby` for step identification
- `aria-current` for the active step
- `aria-disabled` for disabled steps

---

## Responsive Design

The Stepper component adapts to different viewport sizes:

### Horizontal Orientation
Works well on desktop and tablet devices where horizontal space is available. Steps are displayed in a row with connecting lines.

### Vertical Orientation
Better suited for mobile devices and narrow viewports where vertical space is preferable to horizontal. Steps are stacked with vertical connecting lines.

### Recommended Approach
Use responsive utilities or media queries to switch between horizontal and vertical orientations based on viewport width:

```vue
<template>
  <UStepper
    :items="items"
    :orientation="isMobile ? 'vertical' : 'horizontal'"
  />
</template>

<script setup>
const isMobile = computed(() => window.innerWidth < 768)
</script>
```

---

## Theme Integration

The Stepper component supports comprehensive theming through the `ui` prop, which allows customization of all internal elements:

```vue
<template>
  <UStepper
    :items="items"
    :ui="{
      root: 'custom-root-class',
      header: 'custom-header-class',
      item: 'custom-item-class',
      indicator: 'custom-indicator-class',
      title: 'custom-title-class',
      description: 'custom-description-class',
      content: 'custom-content-class'
    }"
  />
</template>
```

### Available UI Keys

- `root` - Main container styling
- `header` - Step indicators container
- `item` - Individual step wrapper
- `container` - Step trigger container
- `trigger` - Clickable step area
- `indicator` - Step indicator circle/icon
- `icon` - Icon within indicator
- `separator` - Connecting line between steps
- `wrapper` - Content area wrapper
- `title` - Step title text
- `description` - Step description text
- `content` - Active step content area

### Per-Item Customization

Individual steps can have unique styling via the `ui` and `class` properties on each `StepperItem`:

```vue
<script setup>
const items = [
  {
    title: 'Important Step',
    class: 'font-bold',
    ui: { indicator: 'bg-red-500' }
  }
]
</script>
```

---

## Related Components

### NavigationMenu
Alternative for hierarchical navigation structures with dropdown menus rather than linear progression.

### Tabs
Similar navigation pattern but for switching between different views of the same level rather than progressing through steps.

### Breadcrumb
Shows hierarchical navigation path and current location but doesn't enforce progression like a stepper.

### Progress
Simpler progress indicator without distinct steps, better for continuous progress tracking.

---

## Framework-Specific Features

### Vue 3 / Nuxt Integration

The Stepper component is designed specifically for Vue 3 and Nuxt applications:

- Uses Vue 3 Composition API patterns
- Supports `v-model` for two-way data binding
- Component refs provide access to navigation methods (`next()`, `prev()`, `hasNext`, `hasPrev`)
- Template slots follow Vue 3 slot conventions

### TypeScript Support

Nuxt UI provides full TypeScript support:

```typescript
import type { StepperItem } from '#ui/types'

const items: StepperItem[] = [
  { value: 1, title: 'Step 1' },
  { value: 2, title: 'Step 2' }
]
```

### Color Mode Integration

The component respects Nuxt's color mode system and adapts its appearance for light and dark themes automatically.

### Icon System

Integrates with Nuxt UI's icon system, supporting various icon libraries through the icon property (e.g., `i-lucide-*`, `i-heroicons-*`).

---

## Code Examples

### Example 1: Basic Wizard Flow

```vue
<template>
  <div class="wizard-container">
    <UStepper
      v-model="currentStep"
      :items="steps"
      ref="stepperRef"
    >
      <template #content="{ item }">
        <div class="step-content">
          <component :is="stepComponents[item.value]" />
        </div>
      </template>
    </UStepper>

    <div class="wizard-actions">
      <UButton
        @click="stepperRef.prev()"
        :disabled="!stepperRef.hasPrev"
        variant="outline"
      >
        Back
      </UButton>

      <UButton
        @click="handleNext"
        :disabled="!stepperRef.hasNext"
      >
        {{ stepperRef.hasNext ? 'Next' : 'Finish' }}
      </UButton>
    </div>
  </div>
</template>

<script setup>
const currentStep = ref(1)
const stepperRef = ref()

const steps = [
  {
    value: 1,
    title: 'Account Setup',
    icon: 'i-lucide-user',
    description: 'Create your account'
  },
  {
    value: 2,
    title: 'Personal Info',
    icon: 'i-lucide-id-card',
    description: 'Tell us about yourself'
  },
  {
    value: 3,
    title: 'Preferences',
    icon: 'i-lucide-settings',
    description: 'Customize your experience'
  },
  {
    value: 4,
    title: 'Complete',
    icon: 'i-lucide-check-circle',
    description: 'Review and finish'
  }
]

const stepComponents = {
  1: AccountSetup,
  2: PersonalInfo,
  3: Preferences,
  4: Complete
}

const handleNext = () => {
  if (stepperRef.value.hasNext) {
    stepperRef.value.next()
  } else {
    // Submit or complete wizard
    console.log('Wizard complete!')
  }
}
</script>
```

### Example 2: E-commerce Checkout

```vue
<template>
  <div class="checkout">
    <h1>Checkout</h1>

    <UStepper
      v-model="checkoutStep"
      :items="checkoutSteps"
      color="success"
      size="lg"
    >
      <template #shipping>
        <div class="shipping-form">
          <h2>Shipping Address</h2>
          <UFormGroup label="Address">
            <UInput v-model="shipping.address" />
          </UFormGroup>
          <UFormGroup label="City">
            <UInput v-model="shipping.city" />
          </UFormGroup>
          <UFormGroup label="Postal Code">
            <UInput v-model="shipping.postalCode" />
          </UFormGroup>
        </div>
      </template>

      <template #payment>
        <div class="payment-form">
          <h2>Payment Information</h2>
          <UFormGroup label="Card Number">
            <UInput v-model="payment.cardNumber" />
          </UFormGroup>
          <UFormGroup label="Expiry">
            <UInput v-model="payment.expiry" />
          </UFormGroup>
        </div>
      </template>

      <template #review>
        <div class="review">
          <h2>Order Summary</h2>
          <p>Review your order details</p>
          <UButton @click="placeOrder" color="success">
            Place Order
          </UButton>
        </div>
      </template>
    </UStepper>
  </div>
</template>

<script setup>
const checkoutStep = ref('shipping')

const checkoutSteps = [
  {
    value: 'shipping',
    title: 'Shipping',
    icon: 'i-lucide-truck',
    slot: 'shipping'
  },
  {
    value: 'payment',
    title: 'Payment',
    icon: 'i-lucide-credit-card',
    slot: 'payment'
  },
  {
    value: 'review',
    title: 'Review',
    icon: 'i-lucide-clipboard-check',
    slot: 'review'
  }
]

const shipping = reactive({
  address: '',
  city: '',
  postalCode: ''
})

const payment = reactive({
  cardNumber: '',
  expiry: ''
})

const placeOrder = () => {
  console.log('Order placed!', { shipping, payment })
}
</script>
```

### Example 3: Vertical Stepper for Mobile Form

```vue
<template>
  <div class="mobile-form">
    <UStepper
      v-model="formStep"
      :items="formSteps"
      orientation="vertical"
      size="sm"
      color="primary"
    >
      <template #content="{ item }">
        <div class="form-section">
          <h3>{{ item.title }}</h3>
          <p class="text-gray-600">{{ item.description }}</p>

          <div v-if="item.value === 1">
            <UFormGroup label="Name">
              <UInput v-model="formData.name" />
            </UFormGroup>
            <UFormGroup label="Email">
              <UInput v-model="formData.email" type="email" />
            </UFormGroup>
          </div>

          <div v-else-if="item.value === 2">
            <UFormGroup label="Phone">
              <UInput v-model="formData.phone" />
            </UFormGroup>
            <UFormGroup label="Company">
              <UInput v-model="formData.company" />
            </UFormGroup>
          </div>

          <div v-else-if="item.value === 3">
            <UFormGroup label="Message">
              <UTextarea v-model="formData.message" />
            </UFormGroup>
          </div>
        </div>
      </template>
    </UStepper>

    <div class="form-actions">
      <UButton @click="prevStep" :disabled="formStep === 1">
        Previous
      </UButton>
      <UButton @click="nextStep" :disabled="formStep === 3">
        Next
      </UButton>
    </div>
  </div>
</template>

<script setup>
const formStep = ref(1)

const formSteps = [
  {
    value: 1,
    title: 'Basic Info',
    description: 'Enter your basic information',
    icon: 'i-lucide-user'
  },
  {
    value: 2,
    title: 'Contact',
    description: 'How can we reach you?',
    icon: 'i-lucide-phone'
  },
  {
    value: 3,
    title: 'Message',
    description: 'Tell us more',
    icon: 'i-lucide-message-square'
  }
]

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  message: ''
})

const nextStep = () => {
  if (formStep.value < 3) formStep.value++
}

const prevStep = () => {
  if (formStep.value > 1) formStep.value--
}
</script>
```

---

## Notes and Observations

### Built on Reka UI

The component is built on top of Reka UI, which provides the foundational accessibility and interaction patterns. This ensures robust keyboard navigation and screen reader support out of the box.

### Flexible State Management

The component supports both controlled and uncontrolled patterns, giving developers flexibility in how they manage stepper state. The controlled pattern (v-model) is recommended for complex wizards where parent components need to orchestrate navigation logic.

### Navigation Methods

Component refs expose `next()` and `prev()` methods along with `hasNext` and `hasPrev` properties, providing programmatic control over navigation and enabling smart button states.

### Linear vs Non-Linear

The `linear` prop (true by default) enforces sequential step completion, which is appropriate for most wizard flows. Setting it to false allows free navigation between steps, useful for settings panels or non-sequential workflows.

### Icon Integration

The icon system accepts string identifiers (e.g., "i-lucide-house") that integrate with Nuxt UI's icon system, supporting multiple icon libraries through a consistent interface.

### Slot Flexibility

The component provides three levels of content customization:
1. Simple text via `content` property
2. Dynamic content via `#content` slot with access to current item
3. Named slots via `slot` property for complete control over individual steps

### Per-Item Styling

Each step item can have its own `class` and `ui` properties, allowing fine-grained styling control without needing to create wrapper components.

### TypeScript Support

Strong TypeScript support with exported types (e.g., `StepperItem`) makes it easier to build type-safe stepper implementations.

### Theme Customization

The comprehensive `ui` prop system allows styling of all internal elements without modifying component source code, following Nuxt UI's theming patterns.

### Responsive Considerations

While the component doesn't automatically switch orientations based on viewport, the orientation prop makes it easy to implement responsive behavior using computed properties or media query composables.

### Color Mode Awareness

The component automatically adapts to Nuxt's color mode system, ensuring proper contrast and appearance in both light and dark themes without additional configuration.
