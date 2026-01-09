# Nuxt UI Input - Usage Patterns

> Last Modified: 2024-11-05

## Component URL
https://ui.nuxt.com/docs/components/input
Status: ✅ Working
Version: Current (Nuxt UI 3.0+)
Last Verified: 2024-11-05

## Documentation Quality
Comprehensive - The documentation provides extensive coverage of all props, variants, states, icons, and integration patterns with clear examples and interactive playground.

## Component Overview

The Nuxt UI Input component is a fundamental form control that extends the native HTML `<input>` element with rich theming, state management, icon support, and accessibility features. It serves as the primary text capture mechanism in Nuxt UI applications with seamless integration into form systems and validation workflows.

**Core purpose**: A versatile, single-line text input component that provides consistent styling across the application, supports multiple input types, integrates with form validation, and allows rich composition through slots and props.

**Mental model**: A text capture field that extends beyond basic HTML inputs by providing built-in styling, icon support, validation integration, and flexible customization. Users think of it as "the field where I type text or other single-line data" with automatic visual feedback for states like focus, error, and loading.

**Semantic meaning**: Communicates inputability through visual affordances (underline, border, background), current state (focused, disabled, error), and data type through icons and helper text. Part of a larger form ecosystem that includes validation, error display, and submission handling.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children/slots
- **CSS-only**: Requires custom styling

## Basic Usage

### Minimal Input
```vue
<script setup lang="ts">
const value = ref('')
</script>

<template>
  <UInput v-model="value" />
</template>
```

### With Placeholder
```vue
<template>
  <UInput
    v-model="value"
    placeholder="Enter your text here..."
  />
</template>
```

### With Label
```vue
<template>
  <UFormField label="Full Name" required>
    <UInput v-model="fullName" placeholder="John Doe" />
  </UFormField>
</template>
```

## Props/API

### Value Binding
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` / `modelValue` | `string \| number` | - | Two-way binding for input value |
| `type` | `string` | `'text'` | HTML input type (text, password, email, number, search, tel, etc.) |

### Appearance & Styling
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'outline' \| 'soft' \| 'subtle' \| 'ghost' \| 'none'` | `'outline'` | Visual style of the input |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'error' \| 'neutral'` | `'primary'` | Ring/border color when focused |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Input size (affects padding, font, padding) |

### Icons & Visuals
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | - | Leading icon identifier (e.g., `'i-lucide-search'`) - positioned before text |
| `leading` | `boolean` | `true` | Position icon at start when using `icon` prop |
| `trailing` | `boolean` | `false` | Position icon at end instead of start |
| `leading-icon` | `string` | - | Explicitly set a leading (start) icon |
| `trailing-icon` | `string` | - | Explicitly set a trailing (end) icon |
| `avatar` | `object` | - | Display avatar instead of icons with properties: `src`, `alt`, `icon`, `text`, `size` |

### State Management
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disables the input, shows cursor-not-allowed |
| `readonly` | `boolean` | `false` | Makes input read-only (HTML attribute) |
| `loading` | `boolean` | `false` | Shows a loading icon inside the input |
| `loading-icon` | `string` | `'i-lucide-loader-circle'` | Custom loading spinner icon |
| `highlight` | `boolean` | `false` | Shows focus/error state highlight (used internally for validation) |

### HTML Input Attributes
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | - | Placeholder text when input is empty |
| `autofocus` | `boolean` | `false` | Auto-focus the input on mount |
| `autocomplete` | `string` | - | HTML autocomplete attribute value |
| `inputmode` | `string` | - | HTML input mode (text, numeric, decimal, etc.) |
| `name` | `string` | - | HTML name attribute for form submission |
| `min`, `max`, `step` | `string \| number` | - | Numeric constraints for number inputs |
| `maxlength`, `minlength` | `number` | - | Text length constraints |
| `pattern` | `string` | - | Regex pattern for validation |

### Customization
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ui` | `object` | - | Slot-based style customization following component structure |
| `class` | `string` | - | Additional CSS classes |

## Common Patterns

### Pattern 1: Text Input with Icon
**Description**: Single-line text input with leading or trailing icon to indicate field purpose.

```vue
<script setup lang="ts">
const email = ref('')
const search = ref('')
</script>

<template>
  <!-- Email with icon (leading) -->
  <UInput
    v-model="email"
    type="email"
    placeholder="Enter your email"
    icon="i-lucide-at-sign"
  />

  <!-- Search with icon (trailing) -->
  <UInput
    v-model="search"
    type="text"
    placeholder="Search..."
    icon="i-lucide-search"
    :trailing="true"
  />

  <!-- Custom trailing icon -->
  <UInput
    v-model="search"
    placeholder="Search..."
    trailing-icon="i-lucide-magnifying-glass"
  />
</template>
```

### Pattern 2: Clear Button in Trailing Slot
**Description**: Conditional clear button that only appears when input has content, uses trailing slot for composition.

```vue
<script setup lang="ts">
const value = ref('')
</script>

<template>
  <UInput
    v-model="value"
    placeholder="Type something..."
    :ui="{ trailing: 'pe-1' }"
  >
    <template v-if="value?.length" #trailing>
      <UButton
        color="gray"
        variant="ghost"
        size="sm"
        icon="i-lucide-circle-x"
        aria-label="Clear input"
        @click="value = ''"
      />
    </template>
  </UInput>
</template>
```

### Pattern 3: Password Input with Toggle Visibility
**Description**: Password field with trailing button to toggle between password and text view for better UX and accessibility.

```vue
<script setup lang="ts">
const password = ref('')
const showPassword = ref(false)
</script>

<template>
  <UInput
    :type="showPassword ? 'text' : 'password'"
    v-model="password"
    placeholder="Enter your password"
    icon="i-lucide-lock"
    :ui="{ trailing: 'pe-1' }"
  >
    <template #trailing>
      <UButton
        color="gray"
        variant="ghost"
        size="sm"
        :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        @click="showPassword = !showPassword"
      />
    </template>
  </UInput>
</template>
```

### Pattern 4: Copy to Clipboard
**Description**: Trailing button to copy input value to clipboard using VueUse composable.

```vue
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const token = ref('abc123def456')
const { copy, copied } = useClipboard({ source: token })
</script>

<template>
  <UInput
    v-model="token"
    readonly
    placeholder="Your API token"
    icon="i-lucide-key"
    :ui="{ trailing: 'pe-1' }"
  >
    <template #trailing>
      <UButton
        color="gray"
        variant="ghost"
        size="sm"
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        @click="copy()"
      />
    </template>
  </UInput>
</template>
```

### Pattern 5: Loading State
**Description**: Input with loading indicator, typically used during async operations like search or validation.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
const isLoading = ref(false)

async function handleSearch() {
  isLoading.value = true
  try {
    await new Promise(res => setTimeout(res, 1000))
    // API call here
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UInput
    v-model="search"
    :loading="isLoading"
    placeholder="Searching..."
    icon="i-lucide-search"
    @input="handleSearch"
  />
</template>
```

### Pattern 6: Form Integration with Validation
**Description**: Input within UForm and UFormField with automatic error highlighting and validation.

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'

const state = reactive({
  email: '',
  password: ''
})

const validate = (state) => {
  const errors = []
  if (!state.email) {
    errors.push({ path: 'email', message: 'Email is required' })
  } else if (!state.email.includes('@')) {
    errors.push({ path: 'email', message: 'Invalid email format' })
  }
  if (!state.password) {
    errors.push({ path: 'password', message: 'Password is required' })
  }
  return errors
}

async function onSubmit() {
  console.log('Form submitted:', state)
}
</script>

<template>
  <UForm :state="state" :validate="validate" @submit="onSubmit">
    <UFormField name="email" label="Email" required help="We won't share your email">
      <UInput
        v-model="state.email"
        type="email"
        placeholder="you@example.com"
        icon="i-lucide-at-sign"
      />
    </UFormField>

    <UFormField name="password" label="Password" required>
      <UInput
        v-model="state.password"
        type="password"
        placeholder="Enter your password"
        icon="i-lucide-lock"
      />
    </UFormField>

    <UButton type="submit">Sign In</UButton>
  </UForm>
</template>
```

### Pattern 7: Number Input
**Description**: Input optimized for numeric values with type-specific constraints.

```vue
<script setup lang="ts">
const age = ref('')
const quantity = ref(1)
const price = ref(0)
</script>

<template>
  <!-- Age with constraints -->
  <UInput
    v-model="age"
    type="number"
    placeholder="Enter your age"
    :min="0"
    :max="150"
    icon="i-lucide-hash"
  />

  <!-- Quantity with step -->
  <UInput
    v-model="quantity"
    type="number"
    placeholder="Quantity"
    :step="1"
    :min="1"
    icon="i-lucide-shopping-cart"
  />

  <!-- Price with decimal step -->
  <UInput
    v-model="price"
    type="number"
    placeholder="Price"
    :step="0.01"
    :min="0"
    icon="i-lucide-dollar-sign"
  />
</template>
```

### Pattern 8: Search Input
**Description**: Specialized search field with search icon and optional clear button.

```vue
<script setup lang="ts">
const query = ref('')
const results = ref([])
const isSearching = ref(false)

async function performSearch() {
  if (!query.value.trim()) {
    results.value = []
    return
  }

  isSearching.value = true
  try {
    // Simulate API call
    await new Promise(res => setTimeout(res, 500))
    results.value = [`Result for "${query.value}"`]
  } finally {
    isSearching.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <UInput
      v-model="query"
      type="search"
      placeholder="Search items..."
      :loading="isSearching"
      icon="i-lucide-search"
      @input="performSearch"
      :ui="{ trailing: 'pe-1' }"
    >
      <template v-if="query?.length" #trailing>
        <UButton
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-lucide-x"
          @click="query = ''"
        />
      </template>
    </UInput>

    <!-- Search results -->
    <div v-if="results.length" class="space-y-2">
      <div v-for="(result, idx) in results" :key="idx" class="p-3 bg-gray-50 rounded">
        {{ result }}
      </div>
    </div>
  </div>
</template>
```

### Pattern 9: Avatar with Input
**Description**: Input with avatar display using avatar prop for visual identification.

```vue
<script setup lang="ts">
const message = ref('')
const userAvatar = {
  src: 'https://github.com/username.png',
  alt: 'User Avatar'
}
</script>

<template>
  <UInput
    v-model="message"
    :avatar="userAvatar"
    placeholder="Type a message..."
  />
</template>
```

### Pattern 10: Readonly Display
**Description**: Read-only input for displaying values that shouldn't be edited.

```vue
<script setup lang="ts">
const referralCode = 'REF-ABC-123-XYZ'
const generatedId = 'uuid-1234-5678-9999'
</script>

<template>
  <!-- Readonly with icon for context -->
  <UInput
    :model-value="referralCode"
    readonly
    placeholder="Referral code"
    icon="i-lucide-share-2"
    :ui="{ trailing: 'pe-1' }"
  >
    <template #trailing>
      <UButton
        color="gray"
        variant="ghost"
        size="sm"
        icon="i-lucide-copy"
        @click="navigator.clipboard.writeText(referralCode)"
      />
    </template>
  </UInput>

  <!-- Readonly ID field -->
  <UInput
    :model-value="generatedId"
    readonly
    disabled
    icon="i-lucide-id-card"
  />
</template>
```

## Visual Variations

### Variants
**Description**: Different visual styles for different contexts and emphasis levels.

```vue
<template>
  <!-- Outline (default) - standard bordered style -->
  <UInput variant="outline" placeholder="Outline variant" />

  <!-- Soft - subtle background, less prominent -->
  <UInput variant="soft" placeholder="Soft variant" />

  <!-- Subtle - minimal styling with light background -->
  <UInput variant="subtle" placeholder="Subtle variant" />

  <!-- Ghost - transparent, only shows on focus -->
  <UInput variant="ghost" placeholder="Ghost variant" />

  <!-- None - no default styling, custom only -->
  <UInput variant="none" placeholder="None variant" />
</template>
```

### Variant Structure
| Variant | CSS Classes | Use Case |
|---------|-------------|----------|
| `outline` | `text-highlighted bg-default ring ring-inset ring-accented` | Standard form fields, primary inputs |
| `soft` | `text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated` | Secondary inputs, less emphasis |
| `subtle` | `text-highlighted bg-elevated ring ring-inset ring-accented` | Minimal background, standard ring |
| `ghost` | `text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated` | Inline inputs, minimal spacing |
| `none` | `text-highlighted bg-transparent` | Custom styling required, baseline element |

### Colors
**Description**: Semantic colors for different input intents and states.

```vue
<template>
  <UInput color="primary" placeholder="Primary color" />
  <UInput color="secondary" placeholder="Secondary color" />
  <UInput color="success" placeholder="Success color" />
  <UInput color="info" placeholder="Info color" />
  <UInput color="warning" placeholder="Warning color" />
  <UInput color="error" placeholder="Error color" />
  <UInput color="neutral" placeholder="Neutral color" />
</template>
```

## Size Patterns

### Standard Sizes
**Description**: Five size options providing consistent spacing across different contexts.

```vue
<template>
  <!-- xs: px-2 py-1 text-xs gap-1 -->
  <UInput size="xs" placeholder="Extra small" />

  <!-- sm: px-3 py-1.5 text-sm gap-1 -->
  <UInput size="sm" placeholder="Small" />

  <!-- md (default): px-3 py-2 text-base gap-2 -->
  <UInput size="md" placeholder="Medium" />

  <!-- lg: px-4 py-2 text-lg gap-2 -->
  <UInput size="lg" placeholder="Large" />

  <!-- xl: px-4 py-3 text-xl gap-3 -->
  <UInput size="xl" placeholder="Extra large" />
</template>
```

### Responsive Sizes
**Description**: Use Tailwind responsive classes through class prop for responsive sizing.

```vue
<template>
  <UInput
    v-model="value"
    size="sm"
    class="md:size-md lg:size-lg"
    placeholder="Responsive input"
  />
</template>
```

### Full Width
**Description**: Make input span full available width.

```vue
<template>
  <!-- Using class -->
  <UInput
    v-model="value"
    placeholder="Full width"
    class="w-full"
  />

  <!-- In a form -->
  <div class="w-full max-w-md">
    <UInput
      v-model="value"
      placeholder="Constrained width"
      class="w-full"
    />
  </div>
</template>
```

## States

### Disabled State
**Description**: Input that cannot be interacted with, shows visual feedback.

```vue
<script setup lang="ts">
const disabledValue = ref('Cannot edit')
const isDisabled = ref(true)
</script>

<template>
  <!-- Always disabled -->
  <UInput
    disabled
    placeholder="This is disabled"
  />

  <!-- Conditionally disabled -->
  <UInput
    v-model="disabledValue"
    :disabled="isDisabled"
    placeholder="Conditionally disabled"
  />

  <!-- Toggle disabled state -->
  <UCheckbox v-model="isDisabled" label="Disable input" />
</template>
```

### Read-Only State
**Description**: Input that displays value but prevents editing.

```vue
<template>
  <UInput
    model-value="This value cannot be changed"
    readonly
    placeholder="Read only"
  />
</template>
```

### Loading State
**Description**: Shows loading indicator while async operation is in progress.

```vue
<script setup lang="ts">
const email = ref('')
const isValidating = ref(false)

async function validateEmail() {
  if (!email.value) return
  isValidating.value = true
  try {
    await new Promise(res => setTimeout(res, 1000))
    // Validation logic here
  } finally {
    isValidating.value = false
  }
}
</script>

<template>
  <UInput
    v-model="email"
    :loading="isValidating"
    placeholder="Email (auto-validating)"
    @blur="validateEmail"
  />
</template>
```

### Error/Highlight State
**Description**: Shows error/focus state, typically managed by parent form component.

```vue
<template>
  <!-- Used internally by UFormField for error state -->
  <UFormField name="email" label="Email" error="Invalid email">
    <UInput
      v-model="email"
      type="email"
      placeholder="Enter valid email"
      icon="i-lucide-at-sign"
      highlight  <!-- This shows the error state -->
    />
  </UFormField>
</template>
```

### Focus State
**Description**: Automatically applied when input is focused, shows ring color based on color prop.

```vue
<template>
  <!-- Ring color changes on focus based on color prop -->
  <UInput
    v-model="value"
    color="primary"
    placeholder="Focus to see ring color"
  />

  <!-- Different color rings -->
  <UInput color="success" placeholder="Green ring on focus" />
  <UInput color="warning" placeholder="Yellow ring on focus" />
  <UInput color="error" placeholder="Red ring on focus" />
</template>
```

## Validation Patterns

### Basic Validation
**Description**: Input validation using form's validate function.

```vue
<script setup lang="ts">
const state = reactive({
  email: ''
})

const validate = (state) => {
  const errors = []
  if (!state.email) {
    errors.push({ path: 'email', message: 'Email required' })
  } else if (!state.email.includes('@')) {
    errors.push({ path: 'email', message: 'Must include @' })
  }
  return errors
}
</script>

<template>
  <UForm :state="state" :validate="validate">
    <UFormField name="email" label="Email">
      <UInput
        v-model="state.email"
        type="email"
        placeholder="you@example.com"
      />
    </UFormField>
  </UForm>
</template>
```

### Real-time Validation
**Description**: Validate as user types with debouncing to avoid excessive checks.

```vue
<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const email = ref('')
const error = ref('')

const validateEmail = useDebounceFn(async (value) => {
  if (!value) {
    error.value = ''
    return
  }
  if (!value.includes('@')) {
    error.value = 'Invalid email format'
    return
  }
  // API validation
  const isValid = await checkEmailAvailability(value)
  error.value = isValid ? '' : 'Email already registered'
}, 300)

watch(email, validateEmail)
</script>

<template>
  <div class="space-y-2">
    <UInput
      v-model="email"
      type="email"
      placeholder="Check availability..."
      icon="i-lucide-at-sign"
      :highlight="!!error"
    />
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>
```

### Min/Max Length Validation
**Description**: HTML5 constraints for length validation.

```vue
<template>
  <!-- Username: 3-20 characters -->
  <UInput
    v-model="username"
    placeholder="Username"
    minlength="3"
    maxlength="20"
    :size="3"
  />

  <!-- Short code: exactly 6 characters -->
  <UInput
    v-model="code"
    placeholder="Code"
    minlength="6"
    maxlength="6"
  />

  <!-- Description with 500 char limit -->
  <UInput
    v-model="description"
    placeholder="Max 500 characters"
    maxlength="500"
  />
</template>
```

### Pattern Validation
**Description**: Use regex pattern attribute for validation.

```vue
<template>
  <!-- Phone number pattern -->
  <UInput
    v-model="phone"
    placeholder="(123) 456-7890"
    pattern="\\(\\d{3}\\) \\d{3}-\\d{4}"
  />

  <!-- Postal code pattern -->
  <UInput
    v-model="zip"
    placeholder="12345"
    pattern="\\d{5}"
  />

  <!-- Alphanumeric only -->
  <UInput
    v-model="code"
    placeholder="ABC123"
    pattern="[A-Za-z0-9]{6}"
  />
</template>
```

## Label & Placeholder Patterns

### With Label
**Description**: Using UFormField component for label and help text.

```vue
<template>
  <UFormField label="Email Address">
    <UInput
      v-model="email"
      type="email"
      placeholder="you@example.com"
    />
  </UFormField>
</template>
```

### With Help Text
**Description**: Display helpful information below the label.

```vue
<template>
  <UFormField
    label="Password"
    help="Use a mix of uppercase, lowercase, numbers, and symbols"
  >
    <UInput
      v-model="password"
      type="password"
      placeholder="Enter password"
    />
  </UFormField>
</template>
```

### With Required Indicator
**Description**: Show that field is required.

```vue
<template>
  <UFormField label="Name" required>
    <UInput
      v-model="name"
      placeholder="Full name"
    />
  </UFormField>
</template>
```

### With Error Message
**Description**: Display validation error below input.

```vue
<template>
  <UFormField
    label="Email"
    error="Please enter a valid email address"
  >
    <UInput
      v-model="email"
      type="email"
      placeholder="you@example.com"
      highlight
    />
  </UFormField>
</template>
```

### Placeholder as Design Pattern
**Description**: Different placeholder strategies for different contexts.

```vue
<template>
  <!-- Example placeholder -->
  <UInput placeholder="john@example.com" />

  <!-- Descriptive placeholder -->
  <UInput placeholder="Enter a search query or select from suggestions" />

  <!-- Action placeholder -->
  <UInput placeholder="Type to search..." />

  <!-- Format placeholder -->
  <UInput placeholder="MM/DD/YYYY" />

  <!-- No placeholder (label sufficient) -->
  <UFormField label="Full Name">
    <UInput v-model="name" />
  </UFormField>
</template>
```

## Prefix & Suffix Patterns

### Leading Icon
**Description**: Icon at the start of input to indicate input type or purpose.

```vue
<template>
  <!-- Email -->
  <UInput
    v-model="email"
    type="email"
    icon="i-lucide-at-sign"
    placeholder="email@example.com"
  />

  <!-- Search -->
  <UInput
    v-model="search"
    icon="i-lucide-search"
    placeholder="Search..."
  />

  <!-- Phone -->
  <UInput
    v-model="phone"
    icon="i-lucide-phone"
    placeholder="+1 (555) 000-0000"
  />

  <!-- Lock (password) -->
  <UInput
    v-model="password"
    type="password"
    icon="i-lucide-lock"
    placeholder="Password"
  />

  <!-- User -->
  <UInput
    v-model="username"
    icon="i-lucide-user"
    placeholder="Username"
  />
</template>
```

### Trailing Icon
**Description**: Icon at the end of input for actions or states.

```vue
<template>
  <!-- Check icon (success) -->
  <UInput
    v-model="value"
    trailing-icon="i-lucide-check"
    :trailing="true"
  />

  <!-- Settings/options -->
  <UInput
    v-model="value"
    trailing-icon="i-lucide-settings"
    :trailing="true"
  />

  <!-- Chevron (dropdown hint) -->
  <UInput
    v-model="value"
    trailing-icon="i-lucide-chevron-down"
    :trailing="true"
  />
</template>
```

### Custom Prefix/Suffix Content
**Description**: Using leading and trailing slots for custom prefix and suffix content.

```vue
<template>
  <!-- Currency prefix -->
  <UInput v-model="price" type="number" placeholder="0.00">
    <template #leading>
      <span class="text-gray-500 font-medium">$</span>
    </template>
  </UInput>

  <!-- Percent suffix -->
  <UInput v-model="percentage" type="number">
    <template #trailing>
      <span class="text-gray-500 font-medium">%</span>
    </template>
  </UInput>

  <!-- Units -->
  <UInput v-model="weight" type="number">
    <template #trailing>
      <span class="text-gray-500 text-sm">kg</span>
    </template>
  </UInput>

  <!-- Status badge -->
  <UInput v-model="status" readonly>
    <template #trailing>
      <UBadge color="green" size="sm">Active</UBadge>
    </template>
  </UInput>
</template>
```

### Icon + Button Combination
**Description**: Leading icon with trailing action button.

```vue
<template>
  <!-- Search with filters button -->
  <UInput
    v-model="search"
    icon="i-lucide-search"
    placeholder="Search..."
    :ui="{ trailing: 'pe-1' }"
  >
    <template #trailing>
      <UButton
        icon="i-lucide-sliders"
        color="gray"
        variant="ghost"
        size="sm"
      />
    </template>
  </UInput>
</template>
```

## Input Types

### Text Input (Default)
```vue
<template>
  <UInput type="text" placeholder="Enter text" />
</template>
```

### Email Input
**Description**: Specialized for email addresses with browser validation.

```vue
<template>
  <UInput
    v-model="email"
    type="email"
    placeholder="you@example.com"
    icon="i-lucide-at-sign"
  />
</template>
```

### Password Input
**Description**: Masks character input with toggle visibility option.

```vue
<script setup lang="ts">
const password = ref('')
const showPassword = ref(false)
</script>

<template>
  <UInput
    :type="showPassword ? 'text' : 'password'"
    v-model="password"
    icon="i-lucide-lock"
    :ui="{ trailing: 'pe-1' }"
  >
    <template #trailing>
      <UButton
        :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        color="gray"
        variant="ghost"
        size="sm"
        @click="showPassword = !showPassword"
      />
    </template>
  </UInput>
</template>
```

### Number Input
**Description**: For numeric values with optional step and min/max.

```vue
<template>
  <UInput
    v-model="quantity"
    type="number"
    :min="1"
    :max="100"
    :step="1"
  />
</template>
```

### Search Input
**Description**: Optimized for search with search icon and clear button.

```vue
<template>
  <UInput
    v-model="query"
    type="search"
    placeholder="Search..."
    icon="i-lucide-search"
  />
</template>
```

### Tel (Telephone) Input
**Description**: For phone numbers, allows special characters.

```vue
<template>
  <UInput
    v-model="phone"
    type="tel"
    placeholder="+1 (555) 000-0000"
    icon="i-lucide-phone"
  />
</template>
```

### URL Input
**Description**: For URLs with browser validation.

```vue
<template>
  <UInput
    v-model="website"
    type="url"
    placeholder="https://example.com"
    icon="i-lucide-link"
  />
</template>
```

### Date Input
**Description**: For date selection (note: Nuxt UI also has dedicated DatePicker component).

```vue
<template>
  <UInput
    v-model="date"
    type="date"
    icon="i-lucide-calendar"
  />
</template>
```

### Time Input
**Description**: For time selection.

```vue
<template>
  <UInput
    v-model="time"
    type="time"
    icon="i-lucide-clock"
  />
</template>
```

### Color Input
**Description**: For color selection.

```vue
<template>
  <UInput
    v-model="color"
    type="color"
  />
</template>
```

## Accessibility

### ARIA Labels
**Description**: Proper semantic labeling for screen readers.

```vue
<template>
  <!-- Via UFormField (recommended) -->
  <UFormField label="Email Address">
    <UInput
      v-model="email"
      type="email"
    />
  </UFormField>

  <!-- Or explicit aria-label -->
  <UInput
    v-model="email"
    aria-label="Email address"
    placeholder="you@example.com"
  />

  <!-- With aria-describedby for help text -->
  <div>
    <label for="password-input">Password</label>
    <UInput
      id="password-input"
      v-model="password"
      type="password"
      aria-describedby="password-help"
    />
    <p id="password-help" class="text-sm text-gray-600">
      Use at least 8 characters with mixed case and numbers
    </p>
  </div>
</template>
```

### Keyboard Navigation
**Description**: Standard keyboard support (automatic).

```vue
<!-- All these work without additional configuration: -->
<!-- Tab/Shift+Tab: Navigate between inputs -->
<!-- Enter: Submit form or trigger action -->
<!-- Escape: Clear input (in some patterns) -->
<!-- Arrow keys: In number and date inputs -->
```

### Error Announcements
**Description**: Clear communication of validation errors to screen readers.

```vue
<template>
  <div class="space-y-2">
    <label for="email">Email</label>
    <UInput
      id="email"
      v-model="email"
      type="email"
      aria-invalid="true"
      aria-describedby="email-error"
      placeholder="you@example.com"
    />
    <p id="email-error" class="text-red-500 text-sm" role="alert">
      Please enter a valid email address
    </p>
  </div>
</template>
```

### Required Fields
**Description**: Indicate required fields accessibly.

```vue
<template>
  <!-- Via UFormField with required prop -->
  <UFormField label="Full Name" required>
    <UInput v-model="fullName" />
  </UFormField>

  <!-- Or via aria-required -->
  <label for="name">
    Full Name
    <span aria-label="required">*</span>
  </label>
  <UInput id="name" v-model="name" required />
</template>
```

### Password Visibility Toggle
**Description**: Accessible password visibility toggle with proper ARIA attributes.

```vue
<script setup lang="ts">
const password = ref('')
const showPassword = ref(false)
</script>

<template>
  <div class="space-y-2">
    <label for="password">Password</label>
    <UInput
      id="password"
      :type="showPassword ? 'text' : 'password'"
      v-model="password"
      :ui="{ trailing: 'pe-1' }"
    >
      <template #trailing>
        <UButton
          :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
          :aria-pressed="showPassword"
          aria-controls="password"
          color="gray"
          variant="ghost"
          size="sm"
          @click="showPassword = !showPassword"
        />
      </template>
    </UInput>
  </div>
</template>
```

## Integration Patterns

### With Form Component
**Description**: Complete form integration with validation and submission.

```vue
<script setup lang="ts">
const state = reactive({
  name: '',
  email: '',
  message: ''
})

const validate = (state) => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Name required' })
  if (!state.email) errors.push({ path: 'email', message: 'Email required' })
  if (!state.message) errors.push({ path: 'message', message: 'Message required' })
  return errors
}

async function onSubmit() {
  console.log('Submitting:', state)
  // API call
  await new Promise(res => setTimeout(res, 1000))
}
</script>

<template>
  <UForm :state="state" :validate="validate" @submit="onSubmit">
    <UFormField name="name" label="Name" required>
      <UInput v-model="state.name" placeholder="Your name" />
    </UFormField>

    <UFormField name="email" label="Email" required>
      <UInput
        v-model="state.email"
        type="email"
        icon="i-lucide-at-sign"
        placeholder="your@email.com"
      />
    </UFormField>

    <UFormField name="message" label="Message" required>
      <UInput
        v-model="state.message"
        placeholder="Your message"
      />
    </UFormField>

    <UButton type="submit">Send</UButton>
  </UForm>
</template>
```

### With useAsyncData
**Description**: Fetching data and binding to input.

```vue
<script setup lang="ts">
const userId = ref('123')
const { data: user } = await useAsyncData('user', () =>
  fetch(`/api/users/${userId.value}`).then(r => r.json())
)
</script>

<template>
  <div class="space-y-4">
    <UFormField label="User ID">
      <UInput v-model="userId" type="number" />
    </UFormField>

    <div v-if="user">
      <UFormField label="Name">
        <UInput
          :model-value="user.name"
          readonly
        />
      </UFormField>
    </div>
  </div>
</template>
```

### With Computed Values
**Description**: Binding input to computed properties for reactive transformations.

```vue
<script setup lang="ts">
const firstName = ref('')
const lastName = ref('')

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`.trim()
  },
  set(value) {
    const [first, last] = value.split(' ')
    firstName.value = first || ''
    lastName.value = last || ''
  }
})
</script>

<template>
  <div class="space-y-4">
    <UInput v-model="firstName" placeholder="First name" />
    <UInput v-model="lastName" placeholder="Last name" />
    <UInput :model-value="fullName" readonly />
  </div>
</template>
```

## Advanced Patterns

### Custom Input Mask
**Description**: Format input as user types (e.g., phone numbers, credit cards).

```vue
<script setup lang="ts">
import { useMask } from 'maska'

const phone = ref('')
const { input } = useMask(phone, '(###) ###-####', '#')
</script>

<template>
  <UInput
    :model-value="phone"
    @update:model-value="input"
    type="tel"
    placeholder="(555) 123-4567"
    icon="i-lucide-phone"
  />
</template>
```

### Autocomplete with Suggestions
**Description**: Input with dynamic suggestion list.

```vue
<script setup lang="ts">
const query = ref('')
const suggestions = ref([])

async function fetchSuggestions(q) {
  if (!q) {
    suggestions.value = []
    return
  }
  // Simulate API call
  suggestions.value = [
    `${q} option 1`,
    `${q} option 2`,
    `${q} option 3`
  ]
}

watch(query, fetchSuggestions)
</script>

<template>
  <div class="relative">
    <UInput
      v-model="query"
      placeholder="Search..."
      autocomplete="off"
    />

    <div v-if="suggestions.length" class="absolute top-full left-0 right-0 bg-white border rounded mt-1 shadow-lg">
      <button
        v-for="(suggestion, idx) in suggestions"
        :key="idx"
        class="w-full text-left px-3 py-2 hover:bg-gray-100"
        @click="query = suggestion"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>
```

### Debounced Search
**Description**: Delay search request until user stops typing.

```vue
<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const query = ref('')
const results = ref([])
const isSearching = ref(false)

const search = useDebounceFn(async (q) => {
  if (!q.trim()) {
    results.value = []
    return
  }
  isSearching.value = true
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
    results.value = await response.json()
  } finally {
    isSearching.value = false
  }
}, 300)

watch(query, search)
</script>

<template>
  <div class="space-y-4">
    <UInput
      v-model="query"
      :loading="isSearching"
      placeholder="Search..."
      icon="i-lucide-search"
    />

    <div class="space-y-2">
      <div v-for="result in results" :key="result.id" class="p-3 bg-gray-50 rounded">
        {{ result.title }}
      </div>
    </div>
  </div>
</template>
```

### Dynamic Input Array
**Description**: Add/remove multiple inputs dynamically in a form.

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  emails: ['']
})

function addEmail() {
  form.emails.push('')
}

function removeEmail(index) {
  form.emails.splice(index, 1)
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(email, index) in form.emails"
      :key="index"
      class="flex gap-2"
    >
      <UInput
        v-model="form.emails[index]"
        type="email"
        placeholder="email@example.com"
        class="flex-1"
      />
      <UButton
        v-if="form.emails.length > 1"
        icon="i-lucide-x"
        color="red"
        variant="ghost"
        @click="removeEmail(index)"
      />
    </div>

    <UButton
      icon="i-lucide-plus"
      color="blue"
      variant="soft"
      @click="addEmail"
    >
      Add Email
    </UButton>
  </div>
</template>
```

### Synchronized Inputs
**Description**: Update multiple inputs that represent the same data in different formats.

```vue
<script setup lang="ts">
const rgb = reactive({
  r: 255,
  g: 0,
  b: 0
})

const hex = computed({
  get() {
    return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`.toUpperCase()
  },
  set(value) {
    const match = value.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    if (match) {
      rgb.r = parseInt(match[1], 16)
      rgb.g = parseInt(match[2], 16)
      rgb.b = parseInt(match[3], 16)
    }
  }
})
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <span class="w-16 h-16 rounded" :style="{ backgroundColor: hex }"></span>
      <div class="flex-1 space-y-2">
        <UInput v-model.number="rgb.r" type="number" :min="0" :max="255" placeholder="Red" />
        <UInput v-model.number="rgb.g" type="number" :min="0" :max="255" placeholder="Green" />
        <UInput v-model.number="rgb.b" type="number" :min="0" :max="255" placeholder="Blue" />
      </div>
    </div>

    <UInput v-model="hex" placeholder="#FF0000" />
  </div>
</template>
```

## Notes

**Framework Approach Observations:**

1. **Vue-centric reactivity**: Props are reactive by default, v-model provides two-way binding. No explicit signal management needed. Changes to v-model immediately reflect in the DOM.

2. **Slot-based composition**: While props cover basic patterns, the component provides extensive slot support (leading, trailing, leadingIcon, trailingIcon, leadingAvatar) for flexible composition without prop explosion.

3. **TypeScript-first design**: Strong prop typing with semantic color and variant enums. Size system is consistent with other Nuxt UI components.

4. **Form ecosystem integration**: Deep integration with UForm, UFormField, and validation system. Error states and highlighting are managed by parent components, not the input itself.

5. **Icon system**: String-based icon identifiers ("i-lucide-*") suggesting Nuxt's icon resolution system, likely auto-importing from Lucide Icons.

6. **Utility-first styling**: Customization through Tailwind classes (class prop) and slot-based utility injection (ui prop) following Nuxt UI's configuration model.

7. **Config-driven theming**: Global theming through app.config.ts for colors, sizes, variants, and default icons (e.g., loading icon).

8. **HTML attribute delegation**: Supports all standard HTML input attributes (type, disabled, readonly, min, max, step, pattern, etc.) via attribute fallthrough.

9. **Minimal state responsibility**: Input focuses on presentation and value binding. Validation, submission, and complex state are handled by parent Form component.

10. **Accessibility built-in**: ARIA attributes automatically applied, keyboard navigation standard. Form integration manages error announcements through parent components.

**Distinctive Patterns vs Other Frameworks:**

- **Avatar integration** is more prominent than typical inputs - built-in support for user avatars
- **Flexible icon positioning** through dedicated props (leadingIcon, trailingIcon) plus position booleans provides good DX
- **Form component dependency** creates strong separation of concerns - input purely for data binding, form handles validation
- **Trailing slot usage** for interactive elements (clear, copy, visibility toggle) is a common and well-supported pattern
- **Loading state** is prop-based rather than managed internally, allowing parent components full control

**Potential Learning Points for Semantic UI:**

- The slot-based composition model (leading, trailing, leadingIcon, trailingIcon) provides excellent extensibility without prop bloat
- Form-input separation allows clean responsibility boundaries where input focuses on data binding
- Trailing button pattern (clear, copy, etc.) is elegant and reusable across multiple input use cases
- Icon positioning flexibility through both dedicated props and position booleans supports both common and advanced cases
- Avatar support in inputs is less common but useful for displaying user context
- Global icon configuration (app.config.ts) reduces per-component customization needs

**Notable Feature Gaps and Workarounds:**

- No built-in character counter despite maxlength support (can be added via help text and computed property)
- No built-in autocomplete dropdown (can be composed with slots and external data)
- Password reveal toggle not automatic (must be manually implemented via slots)
- No input mask support (requires external library like maska or direct string manipulation)
- No built-in search clear button (can be added via trailing slot)
