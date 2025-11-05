# Nuxt UI - Form Field Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.nuxt.com/components/form
https://ui.nuxt.com/components/form-field
Status: ✅ Working
Version: Current
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with multiple integration examples, validation patterns, and detailed API reference.

## Component Definition
- **Core purpose**: Provides form validation, error handling, and field composition through two complementary components (Form and FormField). Form manages validation state and submission, while FormField wraps individual form controls to display labels, errors, help text, and validation feedback.
- **Mental model**: Forms validate state against schemas, automatically propagating errors to FormField components by matching field names. FormField acts as a structured wrapper providing consistent labeling, description, and error display for any form control.
- **Semantic meaning**: Communicates form structure, field requirements, validation state, and guides users through data entry with clear feedback and contextual help.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `label="Name"`)
- **Composed**: Via composition/children (e.g., `<FormField label="Name">`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label association | ✅ | Native | `label` prop on FormField, auto-generates unique ID for proper association |
| Help text | ✅ | Native | `help` prop displays guidance text below form control with `mt-2 text-muted` styling |
| Error messages | ✅ | Native | `error` prop (string or boolean) shows errors below control, auto-populated from Form validation, takes precedence over help text |
| Required indicator | ✅ | Native | `required` boolean prop shows asterisk via CSS: `after:content-['*'] after:ms-0.5 after:text-error` |
| Description text | ✅ | Native | `description` prop displays additional context below label with `text-muted` styling |
| Hint text | ✅ | Native | `hint` prop shows secondary text next to label (right-aligned via `justify-between`) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Invalid/Error | ✅ | Native | Automatic via Form validation or manual via `error` prop; sets `color: error` on control; displays error message with `text-error` class |
| Disabled | ✅ | Native | `disabled` prop on Form disables all inputs; individual controls can also be disabled |
| Required | ✅ | Native | `required` boolean prop shows asterisk indicator on label |
| Read-only | ✅ | Composed | Applied directly to form controls (Input, Textarea, etc.) not FormField itself |
| Validation state | ✅ | Native | Managed by Form component, automatically communicated to FormField via `name` matching |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | Native | Default layout: label/hint row → description → control (mt-1) → help/error; uses flex column stacking |
| Horizontal layout | ❌ | CSS-only | Not provided out-of-box; would require custom CSS/classes for side-by-side label and control |
| Inline layout | ❌ | CSS-only | Not a built-in pattern; would require custom flex/grid styling |
| Label placement | ✅ | Native | Top placement (default); label and hint in `flex items-center justify-between` row above control |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ✅ | Native | Form component supports Standard Schema interface compatible with Zod, Valibot, Yup, Joi, Regle, Superstruct |
| Custom validation | ✅ | Native | `validate` prop accepts function returning `FormError[]` with `name` and `message` properties |
| Real-time validation | ✅ | Native | `validateOn` array prop controls timing: 'blur', 'change', 'input'; `validateOnInputDelay` (300ms default) debounces input validation |
| Error message display | ✅ | Native | Automatic error display in FormField matching `name` prop; `error` prop for manual override; errors display with `mt-2 text-error` styling |
| Eager validation | ✅ | Native | `eagerValidation` boolean on FormField for immediate validation vs. on-blur; `validateOnInputDelay` controls debounce timing |
| Nested validation | ✅ | Native | `nested` boolean on Form enables parent-child validation coordination; `name` prop targets nested object paths with dot notation (e.g., `items.0.price`) |
| Schema transformation | ✅ | Native | `transform` prop (true default) applies schema transformations on submit for data normalization |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Form library integration | ✅ | Native | Standard Schema interface supports Zod, Valibot, Yup, Joi, Regle, Superstruct; no bundled dependencies - bring your own |
| Native HTML form | ✅ | Native | Supports standard HTML form attributes: `action`, `method`, `enctype`, `autocomplete`, `novalidate`, `target`, `acceptcharset` |
| Controlled components | ✅ | Native | Uses reactive `state` object with `v-model` bindings for controlled input pattern |
| Uncontrolled components | ✅ | Composed | Can use form controls without Form component; FormField displays static labels/errors without validation |
| Event handling | ✅ | Native | `@submit` event with `FormSubmitEvent<Schema>` containing validated data; `@error` event with `FormErrorEvent` containing error array |
| Nested forms | ✅ | Native | Child forms with `nested="true"` inherit parent state; parent validation automatically validates nested children; `name` prop targets nested paths |
| Dynamic lists | ✅ | Native | Nested forms support dynamic arrays with indexed names (e.g., `items.${index}.description`) for list item validation |

## Code Examples

### Example 1: Basic Form with Zod Validation
```vue
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: 'Success',
    description: 'The form has been submitted.',
    color: 'success'
  })
  console.log(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Example 2: FormField with All Content Patterns
```vue
<template>
  <UFormField
    label="Email"
    description="We'll never share your email with anyone else."
    hint="Optional"
    help="Please enter a valid email address."
    required
    size="xl"
  >
    <UInput placeholder="Enter your email" class="w-full" />
  </UFormField>
</template>
```

### Example 3: Custom Validation Function
```vue
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

const state = reactive({
  email: undefined,
  password: undefined
})

type Schema = typeof state

function validate(state: Partial<Schema>): FormError[] {
  const errors = []
  if (!state.email) errors.push({ name: 'email', message: 'Required' })
  if (!state.password) errors.push({ name: 'password', message: 'Required' })
  return errors
}

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: 'Success',
    description: 'The form has been submitted.',
    color: 'success'
  })
  console.log(event.data)
}
</script>

<template>
  <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Example 4: Error Handling with Auto-Focus
```vue
<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'

const state = reactive({
  email: undefined,
  password: undefined
})

type Schema = typeof state

function validate(state: Partial<Schema>): FormError[] {
  const errors = []
  if (!state.email) errors.push({ name: 'email', message: 'Required' })
  if (!state.password) errors.push({ name: 'password', message: 'Required' })
  return errors
}

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: 'Success',
    description: 'The form has been submitted.',
    color: 'success'
  })
  console.log(event.data)
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<template>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
    @error="onError"
  >
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Example 5: Nested Forms with Conditional Fields
```vue
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  name: z.string().min(2),
  news: z.boolean().default(false)
})

type Schema = z.output<typeof schema>

const nestedSchema = z.object({
  email: z.string().email()
})

type NestedSchema = z.output<typeof nestedSchema>

const state = reactive<Partial<Schema & NestedSchema>>({})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: 'Success',
    description: 'The form has been submitted.',
    color: 'success'
  })
  console.log(event.data)
}
</script>

<template>
  <UForm
    :state="state"
    :schema="schema"
    class="gap-4 flex flex-col w-60"
    @submit="onSubmit"
  >
    <UFormField label="Name" name="name">
      <UInput v-model="state.name" placeholder="John Lennon" />
    </UFormField>

    <div>
      <UCheckbox
        v-model="state.news"
        name="news"
        label="Register to our newsletter"
        @update:model-value="state.email = undefined"
      />
    </div>

    <UForm v-if="state.news" :schema="nestedSchema" nested>
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" placeholder="john@lennon.com" />
      </UFormField>
    </UForm>

    <div>
      <UButton type="submit">Submit</UButton>
    </div>
  </UForm>
</template>
```

### Example 6: Dynamic List Items with Nested Forms
```vue
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  customer: z.string().min(2)
})

type Schema = z.output<typeof schema>

const itemSchema = z.object({
  description: z.string().min(1),
  price: z.number().min(0)
})

type ItemSchema = z.output<typeof itemSchema>

const state = reactive<Partial<Schema & { items: Partial<ItemSchema>[] }>>({})

function addItem() {
  if (!state.items) {
    state.items = []
  }
  state.items.push({})
}

function removeItem() {
  if (state.items) {
    state.items.pop()
  }
}

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: 'Success',
    description: 'The form has been submitted.',
    color: 'success'
  })
  console.log(event.data)
}
</script>

<template>
  <UForm
    :state="state"
    :schema="schema"
    class="gap-4 flex flex-col w-60"
    @submit="onSubmit"
  >
    <UFormField label="Customer" name="customer">
      <UInput v-model="state.customer" placeholder="Wonka Industries" />
    </UFormField>

    <UForm
      v-for="item, count in state.items"
      :key="count"
      :name="`items.${count}`"
      :schema="itemSchema"
      class="flex gap-2"
      nested
    >
      <UFormField :label="!count ? 'Description' : undefined" name="description">
        <UInput v-model="item.description" />
      </UFormField>
      <UFormField :label="!count ? 'Price' : undefined" name="price" class="w-20">
        <UInput v-model="item.price" type="number" />
      </UFormField>
    </UForm>

    <div class="flex gap-2">
      <UButton color="neutral" variant="subtle" size="sm" @click="addItem()">
        Add Item
      </UButton>
      <UButton color="neutral" variant="ghost" size="sm" @click="removeItem()">
        Remove Item
      </UButton>
    </div>

    <div>
      <UButton type="submit">Submit</UButton>
    </div>
  </UForm>
</template>
```

### Example 7: Valibot Schema Validation
```vue
<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters'))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: 'Success',
    description: 'The form has been submitted.',
    color: 'success'
  })
  console.log(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

## Notable Features

### Form Component
- **Standard Schema Interface**: Supports multiple validation libraries (Zod, Valibot, Yup, Joi, Regle, Superstruct) without bundling dependencies - developers choose and install their preferred solution
- **Flexible Validation Timing**: `validateOn` array prop customizes when validation occurs across 'blur', 'change', 'input' events with configurable debounce delay (300ms default)
- **Nested Form Coordination**: Parent forms automatically coordinate validation with child forms via `nested` prop; supports complex multi-section data entry and dynamic list validation
- **Dual Validation Modes**: Combine schema validation with custom validation function for complex scenarios requiring both declarative rules and imperative logic
- **Auto-Loading State**: `loadingAuto` prop (true default) automatically disables form elements during submission to prevent double-submission
- **Schema Transformation**: Optional `transform` prop applies schema transformations on submit for data normalization before sending to server
- **Native HTML Support**: Full support for standard HTML form attributes (action, method, enctype, autocomplete, novalidate, target, acceptcharset)

### FormField Component
- **Automatic Error Matching**: Errors from Form validation automatically populate FormField by matching `name` prop; supports dot notation for nested fields (e.g., `user.email`, `items.0.price`)
- **Regex Error Patterns**: `errorPattern` prop accepts RegExp for flexible error matching beyond exact name matching
- **Comprehensive Content System**: Five content slots (label, hint, description, help, error) provide complete field documentation and guidance system
- **Size Propagation**: `size` prop (xs/sm/md/lg/xl) automatically proxies to nested form controls for consistent sizing
- **Eager Validation**: `eagerValidation` boolean enables immediate validation on input vs. on-blur for real-time feedback
- **Slot Customization**: Six named slots (label, hint, description, help, error, default) enable complete visual customization while preserving behavior
- **Theme System**: Nine customizable UI slots in `app.config.ts` (root, wrapper, labelWrapper, label, container, description, error, hint, help) for design system integration
- **Smart Error Priority**: Error message takes precedence over help text automatically; color propagation (`color: error`) to wrapped controls
- **Required Indicator**: Pure CSS asterisk implementation via `after:content` pseudo-element for zero-JavaScript overhead
- **Flexible Rendering**: `as` prop enables rendering as any element or component for advanced composition patterns

## Research Notes

### Documentation Access
- Documentation is well-organized with separate pages for Form and FormField components
- Both Vue 3 and Nuxt-specific patterns documented
- Comprehensive code examples with TypeScript support
- Multiple validation library examples showing real-world integration patterns

### Framework Approach Observations
- **Vue-First Design**: Built specifically for Vue 3 with composition API patterns; uses reactive state and v-model bindings throughout
- **Library Agnostic Validation**: Standard Schema interface provides abstraction over validation libraries rather than coupling to one solution
- **Progressive Enhancement**: Works as simple wrapper without Form component; gains full validation when wrapped in Form
- **Composition Over Configuration**: Two-component split (Form + FormField) enables flexible composition while maintaining clean separation of concerns
- **Type Safety**: Strong TypeScript integration with proper type inference from validation schemas
- **Nuxt Integration**: Designed for Nuxt but works in plain Vue; uses Nuxt composables (useToast) in examples but not required
- **Performance Focus**: Debounced input validation and optional eager validation provide balance between UX and performance
- **Accessibility Conscious**: Automatic ID generation for label association; ARIA attributes handled by underlying UI components (Input, etc.)

### Unique Patterns
- **Nested Form System**: Sophisticated parent-child validation coordination for complex forms (conditionally shown fields, dynamic lists)
- **Dot Notation Names**: Field names support dot notation for nested object validation (e.g., `items.${index}.description`)
- **Error Event System**: `@error` event with FormErrorEvent enables custom error handling (focus management, scroll to error, analytics)
- **Dual Content System**: Both help text and description provide different levels of guidance (description above control, help below)
- **Hint Positioning**: Hint text positioned next to label (right-aligned) for optional field indicators or character counts
- **Auto-Focus on Error**: Example pattern showing how to focus first error field using FormErrorEvent data
- **Transform on Submit**: Schema transformations applied automatically on submit for data normalization (e.g., trimming strings, converting types)

---

**Research completed:** 2025-11-05
**Component:** Form / FormField
**Framework:** Nuxt UI
**Documentation:** https://ui.nuxt.com/components/form + https://ui.nuxt.com/components/form-field

**Key Insights:**
- Two-component architecture (Form + FormField) provides clean separation between validation logic and field presentation
- Standard Schema abstraction enables validation library choice without framework lock-in
- Nested form support with dot notation names handles complex multi-section and dynamic list scenarios
- Comprehensive content system (label, hint, description, help, error) provides complete field documentation
- Vue 3 reactive patterns with v-model enable clean controlled component patterns
- Flexible validation timing with debounce and eager modes balances UX and performance
