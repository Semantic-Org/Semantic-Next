# Vuetify v-text-field - Usage Patterns

> **Component**: `v-text-field`
> **Type**: Text input component
> **Framework**: Vuetify (Vue.js Material Design Framework)
> **Version**: Vuetify 3.x
> **Research Date**: 2024

## Component Overview

`v-text-field` is a versatile text input component that combines the functionality of `v-input` and `v-field` components. It serves as the baseline for other form inputs like selects, autocompletes, and comboboxes. The component provides comprehensive text input functionality with support for validation, icons, hints, labels, and multiple visual variants.

**Mental Model**: The v-text-field is the primary mechanism for collecting text-based user input in Vuetify applications. It provides a consistent interface for labeled, validated text fields with rich decoration options (icons, hints, labels) and visual feedback for user interactions.

---

## Basic Usage

### Minimal Text Field
```vue
<template>
  <v-text-field label="Username"></v-text-field>
</template>
```

### With v-model
```vue
<template>
  <v-text-field
    v-model="username"
    label="Username"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const username = ref('')
    return { username }
  }
}
</script>
```

### With Placeholder
```vue
<template>
  <v-text-field
    label="Email"
    placeholder="Enter your email address"
  ></v-text-field>
</template>
```

### With Persistent Placeholder
```vue
<template>
  <v-text-field
    label="Search"
    placeholder="Search items..."
    persistent-placeholder
  ></v-text-field>
</template>
```

---

## Props/API

### Labeling & Display Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `label` | `string` | - | Displays custom text identifying the input's purpose |
| `placeholder` | `string` | - | Shows hint text; fades on focus with label elevation |
| `persistent-placeholder` | `boolean` | `false` | Forces placeholder visibility; auto-elevates label |
| `prefix` | `string` | - | Non-modifiable text prepended to input (example: "$") |
| `suffix` | `string` | - | Non-modifiable text appended to input (example: "kg") |
| `hint` | `string` | - | Supplementary text displayed below the input |
| `persistent-hint` | `boolean` | `false` | Keeps hint visible when input is unfocused |
| `messages` | `string | string[]` | - | Custom detail text displayed in messages area |
| `hide-details` | `auto | boolean` | `auto` | Controls visibility of messages/hints (`auto`, `true`, `false`) |

### Validation Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `rules` | `function[]` | `[]` | Array of validation functions returning `true` or error message string |
| `validate-on` | `string` | `'input'` | When validation occurs: `input`, `blur`, `lazy`, `change` |
| `error-messages` | `string | string[]` | - | Error messages displayed when validation fails |
| `error` | `boolean` | `false` | Manually set error state |
| `disabled` | `boolean` | `false` | Disables the input field |
| `readonly` | `boolean` | `false` | Makes input readonly (no modification allowed) |

### Visual State Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `variant` | `'solo' | 'filled' | 'outlined' | 'plain' | 'underlined'` | `'outlined'` | Controls visual style |
| `density` | `'default' | 'comfortable' | 'compact'` | `'default'` | Controls spacing/padding |
| `color` | `string` | - | Applies to focused label, prefix, suffix, icons (supports theme colors) |
| `bg-color` | `string` | - | Background color for the input container |
| `base-color` | `string` | - | Color when not focused |

### Icon & Decoration Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `prepend-icon` | `string` | - | Icon name prepended before field (external, left of container) |
| `prepend-inner-icon` | `string` | - | Icon name prepended inside field (internal, at field start) |
| `append-icon` | `string` | - | Icon name appended after field (external, right of container) |
| `append-inner-icon` | `string` | - | Icon name appended inside field (internal, at field end) |
| `clearable` | `boolean` | `false` | Shows clear icon; clears value on click |
| `persistent-clear` | `boolean` | `false` | Always shows clear icon when value is present |

### Character Management Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `counter` | `boolean | number` | `false` | Displays character count; if number, shows max count |
| `maxlength` | `number` | - | Maximum input length |
| `persistent-counter` | `boolean` | `false` | Always displays character count (not just on focus) |

### Focus Management Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `autofocus` | `boolean` | `false` | Automatically focuses input on mount |
| `focused` | `boolean` | - | Controlled focus state; v-model can track this with `@update:focused` |

### Input Type Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `type` | `string` | `'text'` | HTML input type (text, password, email, number, search, tel, url, date, time, datetime-local, month, week, etc.) |

### Additional Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `id` | `string` | - | HTML id attribute for label association |
| `name` | `string` | - | HTML name attribute for form submission |
| `spellcheck` | `boolean` | `true` | Enable/disable spell checking |
| `loading` | `boolean` | `false` | Shows loading indicator |
| `single-line` | `boolean` | `false` | Prevents label from floating above input |

---

## Common Patterns

### Pattern 1: Basic Form Input with Validation

```vue
<template>
  <v-text-field
    v-model="email"
    label="Email Address"
    :rules="emailRules"
    validate-on="change"
    type="email"
    hint="Enter a valid email address"
    persistent-hint
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const email = ref('')
    const emailRules = [
      v => !!v || 'Email is required',
      v => /.+@.+\..+/.test(v) || 'Email must be valid'
    ]

    return { email, emailRules }
  }
}
</script>
```

**Use Case**: Standard form field with email validation and user feedback.

---

### Pattern 2: Clearable Search Input

```vue
<template>
  <v-text-field
    v-model="searchQuery"
    label="Search"
    placeholder="Type to search..."
    clearable
    prepend-inner-icon="mdi-magnify"
    @click:clear="handleClear"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const searchQuery = ref('')

    const handleClear = () => {
      searchQuery.value = ''
      // Trigger search reset
    }

    return { searchQuery, handleClear }
  }
}
</script>
```

**Use Case**: Search inputs with clear functionality and search icon.

---

### Pattern 3: Password Input with Visibility Toggle

```vue
<template>
  <v-text-field
    v-model="password"
    label="Password"
    :type="showPassword ? 'text' : 'password'"
    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
    @click:append-inner="showPassword = !showPassword"
    hint="Password must be at least 8 characters"
    persistent-hint
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const password = ref('')
    const showPassword = ref(false)

    return { password, showPassword }
  }
}
</script>
```

**Use Case**: Secure password input with toggle visibility feature.

---

### Pattern 4: Input with Prefix/Suffix

```vue
<template>
  <v-text-field
    v-model="price"
    label="Price"
    type="number"
    prefix="$"
    suffix="USD"
    hint="Enter product price"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const price = ref('')
    return { price }
  }
}
</script>
```

**Use Case**: Inputs with units or currency indicators that cannot be edited.

---

### Pattern 5: Character Counter with Max Length

```vue
<template>
  <v-text-field
    v-model="bio"
    label="Bio"
    maxlength="160"
    counter="160"
    persistent-counter
    hint="Brief description of yourself"
    variant="outlined"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const bio = ref('')
    return { bio }
  }
}
</script>
```

**Use Case**: Text areas with character limits and visible counters.

---

### Pattern 6: Compact Input in Toolbar

```vue
<template>
  <v-toolbar>
    <v-text-field
      v-model="filterText"
      label="Filter"
      single-line
      hide-details
      density="compact"
      variant="solo"
      prepend-inner-icon="mdi-filter"
    ></v-text-field>
  </v-toolbar>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const filterText = ref('')
    return { filterText }
  }
}
</script>
```

**Use Case**: Compact inputs in dense layouts like toolbars.

---

### Pattern 7: Multi-Rule Validation

```vue
<template>
  <v-text-field
    v-model="username"
    label="Username"
    :rules="[
      v => !!v || 'Username is required',
      v => v.length >= 3 || 'Username must be at least 3 characters',
      v => v.length <= 20 || 'Username cannot exceed 20 characters',
      v => /^[a-zA-Z0-9_-]+$/.test(v) || 'Username can only contain letters, numbers, hyphens, and underscores'
    ]"
    counter="20"
    hint="3-20 characters (alphanumeric, hyphen, underscore)"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const username = ref('')
    return { username }
  }
}
</script>
```

**Use Case**: Complex validation with multiple rules and user feedback.

---

### Pattern 8: Async Validation with Loading State

```vue
<template>
  <v-text-field
    v-model="username"
    label="Username"
    :rules="validationRules"
    :loading="isChecking"
    @blur="checkUsernameAvailability"
    hint="Checking availability..."
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const username = ref('')
    const isChecking = ref(false)
    const validationRules = [
      v => !!v || 'Username is required'
    ]

    const checkUsernameAvailability = async () => {
      if (!username.value) return

      isChecking.value = true
      try {
        const response = await fetch(`/api/check-username/${username.value}`)
        const data = await response.json()
        if (!data.available) {
          validationRules.push(v => 'Username already taken')
        }
      } finally {
        isChecking.value = false
      }
    }

    return { username, isChecking, validationRules, checkUsernameAvailability }
  }
}
</script>
```

**Use Case**: Inputs requiring server-side validation with async feedback.

---

### Pattern 9: Readonly Input (Disabled Editing)

```vue
<template>
  <v-text-field
    label="Order ID"
    :model-value="orderId"
    readonly
    append-inner-icon="mdi-lock"
    hint="This field cannot be modified"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const orderId = ref('ORD-2024-001')
    return { orderId }
  }
}
</script>
```

**Use Case**: Displaying non-editable information in input field format.

---

## Visual Variations

### Variant: Outlined (Default)

```vue
<template>
  <v-text-field
    label="Default Outlined"
    variant="outlined"
  ></v-text-field>
</template>
```

**Appearance**: Border outline with elevated label and internal content area.
**Use Case**: Most common variant for standard form fields.

---

### Variant: Filled

```vue
<template>
  <v-text-field
    label="Filled Variant"
    variant="filled"
  ></v-text-field>
</template>
```

**Appearance**: Filled background with underline (Material Design style).
**Use Case**: When a more modern, Material Design aesthetic is preferred.

---

### Variant: Solo

```vue
<template>
  <v-text-field
    label="Solo Variant"
    variant="solo"
  ></v-text-field>
</template>
```

**Appearance**: Minimal styling with background fill and no border.
**Use Case**: Clean, minimal interfaces or search bars.

---

### Variant: Underlined

```vue
<template>
  <v-text-field
    label="Underlined Variant"
    variant="underlined"
  ></v-text-field>
</template>
```

**Appearance**: Single underline with no full border (classic style).
**Use Case**: Retro or minimalist designs.

---

### Variant: Plain

```vue
<template>
  <v-text-field
    label="Plain Variant"
    variant="plain"
  ></v-text-field>
</template>
```

**Appearance**: Minimal styling, no border or background (basic text input).
**Use Case**: Simple, text-only inputs with maximum minimalism.

---

## Size Patterns

### Default Density

```vue
<template>
  <v-text-field
    label="Default Density"
    density="default"
  ></v-text-field>
</template>
```

**Spacing**: Standard padding and height.
**Use Case**: Most form layouts.

---

### Comfortable Density

```vue
<template>
  <v-text-field
    label="Comfortable Density"
    density="comfortable"
  ></v-text-field>
</template>
```

**Spacing**: Slightly reduced padding compared to default.
**Use Case**: More compact layouts without appearing cramped.

---

### Compact Density

```vue
<template>
  <v-text-field
    label="Compact Density"
    density="compact"
  ></v-text-field>
</template>
```

**Spacing**: Minimal padding for space-efficient layouts.
**Use Case**: Dense data entry forms, toolbars, tables.

---

## States

### Disabled State

```vue
<template>
  <v-text-field
    label="Disabled Input"
    disabled
    model-value="Cannot edit"
  ></v-text-field>
</template>
```

**Behavior**: Field is not interactive; grayed out and prevents input.
**Use Case**: Inputs that shouldn't be modified under certain conditions.

---

### Readonly State

```vue
<template>
  <v-text-field
    label="Readonly Input"
    readonly
    model-value="Can select but not edit"
  ></v-text-field>
</template>
```

**Behavior**: Field is visible but cannot be modified; text can be selected and copied.
**Use Case**: Display-only values that maintain input appearance.

---

### Error State

```vue
<template>
  <v-text-field
    v-model="email"
    label="Email"
    error
    error-messages="This email is already registered"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const email = ref('')
    return { email }
  }
}
</script>
```

**Appearance**: Red border and error text display.
**Use Case**: Showing validation failures or server-side errors.

---

### Loading State

```vue
<template>
  <v-text-field
    v-model="username"
    label="Username"
    loading
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const username = ref('')
    return { username }
  }
}
</script>
```

**Appearance**: Loading spinner displayed in append area.
**Use Case**: Async operations like validation or data fetching.

---

### Focused State

```vue
<template>
  <v-text-field
    v-model="input"
    label="Click to focus"
    :focused="isFocused"
    @update:focused="isFocused = $event"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const input = ref('')
    const isFocused = ref(false)
    return { input, isFocused }
  }
}
</script>
```

**Behavior**: Can be controlled programmatically; emits update:focused event.
**Use Case**: Managing focus state across form components.

---

## Validation Patterns

### Basic Validation with Rules

```vue
<template>
  <v-text-field
    v-model="name"
    label="Full Name"
    :rules="[
      v => !!v || 'Name is required',
      v => v.length >= 2 || 'Name must be at least 2 characters'
    ]"
    required
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const name = ref('')
    return { name }
  }
}
</script>
```

**Trigger**: Validates on input by default (controlled by `validate-on` prop).

---

### Lazy Validation (Only on Blur)

```vue
<template>
  <v-text-field
    v-model="phone"
    label="Phone Number"
    :rules="phoneRules"
    validate-on="lazy"
    hint="Validation occurs on blur"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const phone = ref('')
    const phoneRules = [
      v => !!v || 'Phone is required',
      v => /^\d{10}$/.test(v.replace(/\D/g, '')) || 'Phone must be 10 digits'
    ]

    return { phone, phoneRules }
  }
}
</script>
```

**Trigger**: `validate-on="lazy"` validates only after blur event.

---

### Validation with External Rules

```vue
<template>
  <v-form ref="form">
    <v-text-field
      v-model="email"
      label="Email"
      :rules="emailRules"
      type="email"
    ></v-text-field>
    <v-btn @click="form.validate()">Validate</v-btn>
  </v-form>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const form = ref(null)
    const email = ref('')

    const emailRules = [
      v => !!v || 'Email is required',
      v => /.+@.+\..+/.test(v) || 'Email must be valid'
    ]

    return { form, email, emailRules }
  }
}
</script>
```

**Use Case**: Form-level validation with manual trigger.

---

## Label & Placeholder Patterns

### Label with Hint

```vue
<template>
  <v-text-field
    label="Website URL"
    placeholder="https://example.com"
    hint="Include the protocol (http:// or https://)"
    type="url"
  ></v-text-field>
</template>
```

**Pattern**: Label + Placeholder + Hint provides progressive disclosure of information.

---

### Persistent Placeholder (Always Visible)

```vue
<template>
  <v-text-field
    label="Search"
    placeholder="Type keywords..."
    persistent-placeholder
  ></v-text-field>
</template>
```

**Behavior**: Placeholder stays visible even when label is elevated (on focus).

---

### Persistent Hint (Always Visible)

```vue
<template>
  <v-text-field
    label="Password"
    hint="8+ characters with uppercase, lowercase, number, and symbol"
    persistent-hint
    type="password"
  ></v-text-field>
</template>
```

**Behavior**: Hint always displayed below input, not just on focus.

---

### Custom Messages

```vue
<template>
  <v-text-field
    v-model="input"
    label="Input with Messages"
    messages="This is a custom message"
    hide-details="false"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const input = ref('')
    return { input }
  }
}
</script>
```

**Use Case**: Display custom feedback messages alongside hints/errors.

---

## Prefix & Suffix Patterns

### Currency Input with Prefix

```vue
<template>
  <v-text-field
    v-model="amount"
    label="Amount"
    type="number"
    prefix="$"
    hint="Enter amount in USD"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const amount = ref('')
    return { amount }
  }
}
</script>
```

**Pattern**: Prefix for currency symbol or unit indicator.

---

### Measurement Input with Suffix

```vue
<template>
  <v-text-field
    v-model="temperature"
    label="Temperature"
    type="number"
    suffix="°C"
    hint="Enter temperature in Celsius"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const temperature = ref('')
    return { temperature }
  }
}
</script>
```

**Pattern**: Suffix for units (weight, distance, temperature, etc.).

---

### Phone Number with Prefix

```vue
<template>
  <v-text-field
    v-model="phone"
    label="Phone"
    type="tel"
    prefix="+1"
    hint="Enter 10-digit number"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const phone = ref('')
    return { phone }
  }
}
</script>
```

**Pattern**: Country code prefix for international phone numbers.

---

## Input Types

### Text Input (Default)

```vue
<template>
  <v-text-field label="Full Name" type="text"></v-text-field>
</template>
```

---

### Email Input

```vue
<template>
  <v-text-field
    label="Email Address"
    type="email"
    hint="Enter a valid email"
  ></v-text-field>
</template>
```

---

### Password Input

```vue
<template>
  <v-text-field
    label="Password"
    type="password"
  ></v-text-field>
</template>
```

---

### Number Input

```vue
<template>
  <v-text-field
    label="Age"
    type="number"
    min="0"
    max="120"
  ></v-text-field>
</template>
```

---

### Search Input

```vue
<template>
  <v-text-field
    label="Search"
    type="search"
    clearable
    prepend-inner-icon="mdi-magnify"
  ></v-text-field>
</template>
```

---

### Telephone Input

```vue
<template>
  <v-text-field
    label="Phone Number"
    type="tel"
    hint="Format: (123) 456-7890"
  ></v-text-field>
</template>
```

---

### URL Input

```vue
<template>
  <v-text-field
    label="Website URL"
    type="url"
    hint="Include protocol (http:// or https://)"
  ></v-text-field>
</template>
```

---

### Date Input

```vue
<template>
  <v-text-field
    label="Birth Date"
    type="date"
  ></v-text-field>
</template>
```

---

### Time Input

```vue
<template>
  <v-text-field
    label="Meeting Time"
    type="time"
  ></v-text-field>
</template>
```

---

### Datetime-Local Input

```vue
<template>
  <v-text-field
    label="Event Date/Time"
    type="datetime-local"
  ></v-text-field>
</template>
```

---

## Accessibility

### Label Association

```vue
<template>
  <v-text-field
    id="email-input"
    label="Email Address"
    type="email"
    aria-label="Email Address"
  ></v-text-field>
</template>
```

**Pattern**: Labels are automatically associated via `id` prop.

---

### Error Messages for Screen Readers

```vue
<template>
  <v-text-field
    v-model="email"
    label="Email"
    type="email"
    error
    error-messages="Please enter a valid email address"
    aria-describedby="email-error"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const email = ref('')
    return { email }
  }
}
</script>
```

**Pattern**: Error messages are announced to screen readers via `aria-describedby`.

---

### Hint Text as Description

```vue
<template>
  <v-text-field
    label="Password"
    type="password"
    hint="8+ characters with uppercase, lowercase, numbers, and symbols"
    persistent-hint
    aria-describedby="password-hint"
  ></v-text-field>
</template>
```

**Pattern**: Hints provide context without cluttering the UI for visual users.

---

### Required Field Indication

```vue
<template>
  <v-text-field
    label="Full Name"
    required
    :rules="[v => !!v || 'Name is required']"
  ></v-text-field>
</template>
```

**Pattern**: `required` attribute indicates mandatory fields.

---

### Focus Management

```vue
<template>
  <v-text-field
    ref="emailInput"
    label="Email"
    type="email"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const emailInput = ref(null)

    const focusEmail = () => {
      emailInput.value.$el.focus()
    }

    return { emailInput, focusEmail }
  }
}
</script>
```

**Pattern**: Programmatic focus management for keyboard navigation.

---

## Integration Patterns

### Form Integration with v-form

```vue
<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-text-field
      v-model="name"
      label="Name"
      :rules="[v => !!v || 'Name is required']"
    ></v-text-field>

    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      :rules="[
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ]"
    ></v-text-field>

    <v-btn type="submit" color="primary">Submit</v-btn>
  </v-form>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const form = ref(null)
    const name = ref('')
    const email = ref('')

    const handleSubmit = async () => {
      const isValid = await form.value.validate()
      if (isValid) {
        // Submit form data
      }
    }

    return { form, name, email, handleSubmit }
  }
}
</script>
```

**Use Case**: Multi-field form validation with centralized validation control.

---

### Custom Input Component Wrapper

```vue
<template>
  <v-text-field
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-on="$listeners"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue']
}
</script>
```

**Use Case**: Create custom form components that extend v-text-field.

---

### Controlled Value Pattern

```vue
<template>
  <v-text-field
    :model-value="value"
    @update:model-value="onValueChange"
    label="Controlled Input"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    value: String
  },
  emits: ['input'],
  setup(props, { emit }) {
    const onValueChange = (newValue) => {
      // Custom processing
      emit('input', newValue)
    }

    return { onValueChange }
  }
}
</script>
```

**Use Case**: Implement controlled input behavior in custom components.

---

## Advanced Patterns

### Custom Validation with Debounce

```vue
<template>
  <v-text-field
    v-model="username"
    label="Username"
    :rules="[v => validationResult || 'Username is not available']"
    @input="validateUsername"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const username = ref('')
    const validationResult = ref(null)
    let debounceTimer = null

    const validateUsername = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(async () => {
        const response = await fetch(`/api/validate-username/${username.value}`)
        const data = await response.json()
        validationResult.value = data.isAvailable
      }, 300)
    }

    return { username, validationResult, validateUsername }
  }
}
</script>
```

**Use Case**: Async validation with debounce to reduce server requests.

---

### Dynamic Rules Based on State

```vue
<template>
  <v-text-field
    v-model="password"
    label="Password"
    :type="showPassword ? 'text' : 'password'"
    :rules="dynamicRules"
    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
    @click:append-inner="showPassword = !showPassword"
  ></v-text-field>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  setup() {
    const password = ref('')
    const showPassword = ref(false)

    const dynamicRules = computed(() => [
      v => !!v || 'Password is required',
      v => v.length >= 8 || 'Password must be at least 8 characters',
      v => /[A-Z]/.test(v) || 'Password must contain uppercase letter',
      v => /[0-9]/.test(v) || 'Password must contain number'
    ])

    return { password, showPassword, dynamicRules }
  }
}
</script>
```

**Use Case**: Validation rules that change based on component state.

---

### Auto-Format Input

```vue
<template>
  <v-text-field
    :model-value="formattedPhone"
    @update:model-value="onPhoneChange"
    label="Phone Number"
    type="tel"
    placeholder="(123) 456-7890"
    hint="Format: (123) 456-7890"
  ></v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const rawPhone = ref('')

    const formatPhone = (value) => {
      const digits = value.replace(/\D/g, '')
      if (digits.length === 0) return ''
      if (digits.length <= 3) return `(${digits}`
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }

    const onPhoneChange = (value) => {
      rawPhone.value = value.replace(/\D/g, '')
    }

    return {
      rawPhone,
      formattedPhone: formatPhone(rawPhone.value),
      onPhoneChange
    }
  }
}
</script>
```

**Use Case**: Auto-formatting user input (phone numbers, credit cards, etc.).

---

### With Slot-Based Icon Customization

```vue
<template>
  <v-text-field
    v-model="search"
    label="Advanced Search"
  >
    <template #prepend-inner>
      <v-icon size="small">mdi-magnify</v-icon>
    </template>

    <template #append-inner>
      <v-icon
        v-if="search"
        size="small"
        @click="search = ''"
        class="cursor-pointer"
      >
        mdi-close
      </v-icon>
    </template>
  </v-text-field>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const search = ref('')
    return { search }
  }
}
</script>
```

**Use Case**: Custom icon rendering with interactive functionality.

---

### Password Strength Indicator

```vue
<template>
  <div>
    <v-text-field
      v-model="password"
      label="Password"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showPassword = !showPassword"
      :rules="[v => !!v || 'Password is required']"
    ></v-text-field>

    <v-progress-linear
      :value="passwordStrength"
      :color="strengthColor"
      class="mt-2"
    ></v-progress-linear>

    <p class="mt-2" :style="{ color: strengthColor }">
      Strength: {{ strengthLabel }}
    </p>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  setup() {
    const password = ref('')
    const showPassword = ref(false)

    const calculateStrength = (pwd) => {
      let score = 0
      if (pwd.length >= 8) score += 20
      if (/[a-z]/.test(pwd)) score += 20
      if (/[A-Z]/.test(pwd)) score += 20
      if (/[0-9]/.test(pwd)) score += 20
      if (/[^a-zA-Z0-9]/.test(pwd)) score += 20
      return score
    }

    const passwordStrength = computed(() => calculateStrength(password.value))

    const strengthLabel = computed(() => {
      const strength = passwordStrength.value
      if (strength === 0) return 'None'
      if (strength < 40) return 'Weak'
      if (strength < 60) return 'Fair'
      if (strength < 80) return 'Good'
      return 'Strong'
    })

    const strengthColor = computed(() => {
      const strength = passwordStrength.value
      if (strength < 40) return 'red'
      if (strength < 60) return 'orange'
      if (strength < 80) return 'amber'
      return 'green'
    })

    return {
      password,
      showPassword,
      passwordStrength,
      strengthLabel,
      strengthColor
    }
  }
}
</script>
```

**Use Case**: Password fields with visual strength indicator.

---

### Masked Input Pattern

```vue
<template>
  <v-text-field
    :model-value="maskedValue"
    @update:model-value="onMaskedInput"
    label="Credit Card"
    placeholder="0000 0000 0000 0000"
    maxlength="19"
    hint="Enter 16-digit card number"
  ></v-text-field>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  setup() {
    const cardNumber = ref('')

    const formatCard = (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 16)
      return cleaned.replace(/(.{4})/g, '$1 ').trim()
    }

    const maskedValue = computed(() => formatCard(cardNumber.value))

    const onMaskedInput = (value) => {
      cardNumber.value = value.replace(/\D/g, '')
    }

    return { cardNumber, maskedValue, onMaskedInput }
  }
}
</script>
```

**Use Case**: Masked input for sensitive information like credit cards.

---

## Notes

### Key Implementation Insights

1. **Variant Selection**: The `variant` prop controls visual appearance. `outlined` is most versatile; `filled` is Material Design standard; `solo` is minimal for search/toolbar contexts.

2. **Validation Timing**: The `validate-on` prop controls when rules are evaluated:
   - `input` (default): Real-time validation as user types
   - `blur`: Only when user leaves the field
   - `lazy`: Only on blur or form submission
   - `change`: Only on actual value changes

3. **Icon Strategy**: Choose between:
   - `prepend-icon`/`append-icon`: External (outside container border)
   - `prepend-inner-icon`/`append-inner-icon`: Internal (inside container)
   - Slot-based: Maximum customization flexibility

4. **Hint vs Messages**: Use `hint` for guidance; use `messages` and `error-messages` for feedback.

5. **Focus State Management**: The `focused` prop enables programmatic focus control with `@update:focused` event tracking.

6. **Rules Function Pattern**: Rules must return `true` (pass) or string (error message):
   ```javascript
   v => !!v || 'Field is required'  // Correct
   v => v.length > 5 || 'Too short' // Correct
   ```

7. **Reactive Validation**: Rules are reactive - computed dependencies update automatically when dependencies change.

8. **Performance Consideration**: Complex validation functions should be memoized or debounced for async operations.

9. **Accessibility**: Always provide:
   - `label` for input purpose
   - `hint` for additional context
   - `error-messages` for validation failures
   - Appropriate `type` attribute for semantic HTML

10. **Type Attribute Usage**: Different input types enable native browser features:
    - `email`: Validation and mobile keyboard
    - `number`: Spinner controls and numeric keyboard
    - `tel`: Telephone keyboard layout
    - `date`, `time`: Native date/time pickers

### Common Pitfalls

1. **Confusing prefix/suffix with icons**: Prefix/suffix are non-editable text; use icons for clickable decorations.

2. **Not using v-form for multi-field validation**: While individual fields can validate, coordinating multiple fields is easier with `v-form`.

3. **Forgetting persistent hints on important information**: If hint content is critical, use `persistent-hint`.

4. **Not handling loading state feedback**: Always indicate async operations with `loading` prop.

5. **Ignoring RTL considerations**: Use `startIcon`/`endIcon` naming or directional logic instead of `leftIcon`/`rightIcon`.

### Browser Support

- Vuetify v3 supports Vue 3.3+
- Web Components and Shadow DOM fully utilized
- All modern browsers supported (Chrome, Firefox, Safari, Edge)
- Mobile browser support with touch events

### Version Information

- **Vuetify Version**: 3.x (current)
- **Vue Version**: 3.3+ required
- **Material Design**: Material Design 3 (latest)
- **Icon Library**: Material Design Icons (mdi)

### Related Components

- **v-form**: Container for coordinating multiple input validations
- **v-field**: Lower-level component underlying v-text-field
- **v-input**: Base component for form inputs
- **v-textarea**: Multi-line text input (similar API)
- **v-select**: Dropdown selection (similar validation API)
- **v-autocomplete**: Searchable dropdown (extends v-text-field)

### Slots Available

| Slot | Content |
|------|---------|
| `prepend` | Content before entire field container |
| `prepend-inner` | Content at start of input field |
| `label` | Custom label rendering |
| `append-inner` | Content at end of input field |
| `append` | Content after entire field container |
| `details` | Error messages, hints, counters area |

### Events Emitted

| Event | Payload | Purpose |
|-------|---------|---------|
| `update:modelValue` | `string` | Value changed |
| `update:focused` | `boolean` | Focus state changed |
| `click:prepend` | `Event` | Prepend icon clicked |
| `click:append` | `Event` | Append icon clicked |
| `click:append-inner` | `Event` | Append-inner icon clicked |
| `click:clear` | `Event` | Clear icon clicked |
| `blur` | `Event` | Focus lost |
| `focus` | `Event` | Focus gained |
| `input` | `string` | User input (deprecated, use update:modelValue) |
| `keydown` | `KeyboardEvent` | Key pressed |
| `keyup` | `KeyboardEvent` | Key released |

---

## Conclusion

Vuetify's `v-text-field` provides a comprehensive, Material Design-compliant text input component with extensive customization options. Its strength lies in:

- **Rich validation system** with customizable rules and timing
- **Flexible visual variants** for different design contexts
- **Comprehensive icon/decoration system** (prefix, suffix, icons, slots)
- **Integration with v-form** for multi-field validation
- **Strong accessibility support** with ARIA attributes and semantic HTML
- **Extensive state management** (disabled, readonly, error, loading, focused)

The component serves as a foundation for specialized inputs (autocomplete, select) while remaining flexible enough for custom implementations through slots and events.

