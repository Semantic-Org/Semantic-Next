# Nuxt UI - Form Usage Patterns

## Component URL
https://ui.nuxt.com/components/form
Status: ✅ Working
Version: Current (Nuxt UI v3)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent documentation with detailed validation patterns, nested form support, and multiple validation library integrations.

## Component Definition
- **Core purpose**: Provides form-level validation, submission handling, and error routing for Vue applications. Acts as a coordination layer that manages validation state and distributes errors to child FormField components.
- **Mental model**: A validation orchestrator that wraps form controls and automatically routes validation errors to matching field components. It doesn't render form controls itself but provides the validation context.
- **Semantic meaning**: Represents a validated form container that coordinates validation timing, submission handling, and error distribution across nested fields.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Field grouping | ✅ | Composed | Via nested `UFormField` components; supports nested forms with `nested` prop and dot notation (`user.email`) |
| Field labels | ✅ | Composed | Through `UFormField` component with `label` prop, automatic `for` attribute association |
| Help text | ✅ | Composed | `UFormField` provides `help` (below field), `description` (below label), and `hint` (next to label, e.g., "Optional") |
| Error messages | ✅ | Native | Automatic error routing to `UFormField` components by matching `name` attributes; supports `error` event for custom handling |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ✅ | Native | Supports Standard Schema interface with Valibot, Zod, Regle, Yup, Joi, Superstruct - no included validation library |
| Custom validation | ✅ | Native | `validate` prop accepts function returning `FormError[]` with `{ name, message }` structure |
| Async validation | ✅ | Native | Validation functions can be async; `loadingAuto` prop disables form during async operations |
| Cross-field validation | ✅ | Native | Custom validation function receives entire state object enabling cross-field validation logic |
| Validation triggers | ✅ | Native | `validateOn` prop accepts array: `['blur', 'change', 'input']`; `validateOnInputDelay` for debouncing (300ms default); always validates on submit |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled values | ✅ | Native | Requires reactive `state` object (via Vue's `reactive()`); uses v-model on child inputs |
| Uncontrolled values | ❌ | N/A | Not supported - requires controlled state object |
| Initial values | ✅ | Native | Set initial values in `state` object definition |
| Dynamic fields | ✅ | Composed | Nested forms with `v-for` and indexed naming (`items.${count}.description`) for dynamic lists |
| Field dependencies | ✅ | Native | Custom validation function can check entire state object; conditional nested forms with `v-if` |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal layout | ✅ | CSS-only | FormField uses slot system (`labelWrapper`, `container`) allowing custom layouts via styling |
| Vertical layout | ✅ | Native | Default layout is vertical stack (label → description → input → help/error) |
| Inline layout | ✅ | CSS-only | Achievable through custom slot styling in FormField |
| Grid layout | ✅ | CSS-only | Parent container can apply grid/flex layouts to multiple FormField components |
| Responsive layout | ✅ | Native | FormField has size variants (`xs`, `sm`, `md`, `lg`, `xl`) that propagate to children |

## Submission Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Submit handling | ✅ | Native | `@submit` event emits `FormSubmitEvent<Schema>` with validated `data` property |
| Loading state | ✅ | Native | `loadingAuto` prop (default true) auto-disables form elements during async submission |
| Error handling | ✅ | Native | `@error` event emits `FormErrorEvent` with `errors[]` array containing `{ id, name, message }` |
| Success handling | ✅ | Composed | Handle in `@submit` event handler; no built-in success state |
| Reset functionality | ✅ | Composed | Manually reset reactive state object (no dedicated reset method) |

## Code Examples

### Basic Form with Schema Validation
```vue
<script setup lang="ts">
import * as v from 'valibot'

const schema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8, 'Must be 8+ characters'))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField label="Email" name="email" required>
      <UInput v-model="state.email" placeholder="Enter your email" />
    </UFormField>

    <UFormField label="Password" name="password" required>
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Custom Validation Function
```typescript
function validate(state: Partial<Schema>): FormError[] {
  const errors = []
  if (!state.email) {
    errors.push({ name: 'email', message: 'Email is required' })
  }
  if (!state.password || state.password.length < 8) {
    errors.push({ name: 'password', message: 'Password must be 8+ characters' })
  }
  return errors
}

<template>
  <UForm :validate="validate" :state="state" @submit="onSubmit">
    <!-- form fields -->
  </UForm>
</template>
```

### Nested Forms with Dynamic Lists
```vue
<script setup lang="ts">
const state = reactive({
  user: {
    name: '',
    email: ''
  },
  items: [
    { description: '' },
    { description: '' }
  ]
})

const userSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  email: v.pipe(v.string(), v.email())
})

const itemSchema = v.object({
  description: v.pipe(v.string(), v.minLength(1))
})
</script>

<template>
  <UForm :schema="userSchema" :state="state">
    <UFormField label="Name" name="user.name">
      <UInput v-model="state.user.name" />
    </UFormField>

    <UFormField label="Email" name="user.email">
      <UInput v-model="state.user.email" />
    </UFormField>

    <!-- Dynamic list with nested validation -->
    <UForm
      v-for="(item, index) in state.items"
      :key="index"
      :name="`items.${index}`"
      :schema="itemSchema"
      nested
    >
      <UFormField name="description" :label="`Item ${index + 1}`">
        <UInput v-model="item.description" />
      </UFormField>
    </UForm>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Error Handling with Focus
```typescript
async function onError(event: FormErrorEvent) {
  const firstError = event?.errors?.[0]
  if (firstError?.id) {
    const element = document.getElementById(firstError.id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

<template>
  <UForm @submit="onSubmit" @error="onError" :state="state" :schema="schema">
    <!-- form fields -->
  </UForm>
</template>
```

### Validation Timing Control
```vue
<template>
  <!-- Validate on blur and change, with 500ms input debounce -->
  <UForm
    :state="state"
    :schema="schema"
    :validate-on="['blur', 'change']"
    :validate-on-input-delay="500"
  >
    <UFormField label="Email" name="email" eager-validation>
      <UInput v-model="state.email" />
    </UFormField>
  </UForm>
</template>
```

### FormField with All Text Props
```vue
<template>
  <UFormField
    label="Email Address"
    description="We'll never share your email with anyone else."
    hint="Optional"
    help="Enter a valid email address"
    required
    size="lg"
  >
    <UInput v-model="state.email" placeholder="you@example.com" />
  </UFormField>
</template>
```

[View Live](https://ui.nuxt.com/components/form)

## Notable Features

- **Standard Schema Interface**: Unified API across multiple validation libraries (Valibot, Zod, Yup, Joi, Regle, Superstruct) without framework lock-in
- **Automatic Error Routing**: Form component automatically distributes validation errors to matching FormField components by name
- **Nested Form Composition**: `nested` prop enables form composition with parent validation inheritance and dot-notation state paths
- **Flexible Validation Triggers**: Fine-grained control over when validation occurs with per-event configuration and input debouncing
- **Transform Support**: Optional schema transformations (coercion, normalization) applied on submission via `transform` prop
- **Auto-Loading State**: Automatic form disabling during async operations (configurable via `loadingAuto`)
- **No Validation Library Included**: Framework-agnostic approach - developers choose their preferred validation library
- **Eager Validation Option**: FormField's `eagerValidation` prop enables real-time validation before first blur event
- **Error Pattern Matching**: FormField supports `errorPattern` (RegExp) for field-specific error filtering from form-level validation
- **TypeScript Integration**: Full type inference from schema definitions to submit event handlers
- **Accessible by Default**: Auto-generated IDs, proper label association, ARIA attributes

## Research Notes

- The Form component is a validation orchestrator rather than a visual container - it doesn't render visual structure itself
- The separation between Form (validation/submission) and FormField (layout/labeling) is clean and composable
- Nested forms support is sophisticated with automatic parent state inheritance and indexed path notation for dynamic lists
- The Standard Schema interface is a smart abstraction that avoids framework lock-in to any single validation library
- The `loadingAuto` feature shows attention to UX details for async operations
- The error event provides structured error data (id, name, message) enabling custom error handling like focus management
- The `validateOn` array pattern with debouncing shows good understanding of form UX trade-offs
- The framework maintains Vue's reactive patterns consistently (reactive state, v-model)
- Documentation is clear about what's included vs. what requires developer choice (validation library)
- The `transform` prop enabling schema transformations on submit is useful for data normalization
- Size propagation from FormField to children shows thoughtful component composition
- The three-level text hierarchy (description, help, hint) provides flexibility for different information types
- Accessibility is baked in with automatic ID generation and label association
