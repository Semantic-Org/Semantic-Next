# Nuxt UI - Form Component

## Component Overview

The Form component in Nuxt UI provides built-in validation and submission handling for Vue/Nuxt applications. It is designed with a schema-first approach, integrating seamlessly with multiple validation libraries that support the Standard Schema format. Unlike many form libraries that bundle a specific validator, Nuxt UI Form is validation-library agnostic - no validation library is included by default, allowing developers to choose from Valibot, Zod, Regle, Yup, Joi, or Superstruct based on their project needs.

The component provides reactive state management, configurable validation triggers, nested form support, and automatic loading states. It integrates with FormField components to display validation errors and supports both schema-based and custom validation approaches.

---

## Core Patterns

### Basic Form Usage

The simplest form with state and submission handling:

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<any>) {
  console.log('Submitted data:', event.data)
  // Handle form submission
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
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

### Schema-Based Validation

Using a schema for automatic validation:

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as v from 'valibot'

const schema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email address')),
  password: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters'))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // event.data is validated and typed
  console.log('Valid data:', event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
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

### Custom Validation

Implementing custom validation logic:

```vue
<script setup lang="ts">
import { reactive } from 'vue'

interface FormError {
  name: string
  message: string
}

const state = reactive({
  username: '',
  age: undefined
})

function validate(state: Partial<any>): FormError[] {
  const errors: FormError[] = []

  if (!state.username) {
    errors.push({ name: 'username', message: 'Username is required' })
  } else if (state.username.length < 3) {
    errors.push({ name: 'username', message: 'Username must be at least 3 characters' })
  }

  if (state.age !== undefined && state.age < 18) {
    errors.push({ name: 'age', message: 'Must be 18 or older' })
  }

  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  console.log('Submitted:', event.data)
}
</script>

<template>
  <UForm :state="state" :validate="validate" @submit="onSubmit">
    <UFormField label="Username" name="username">
      <UInput v-model="state.username" />
    </UFormField>

    <UFormField label="Age" name="age">
      <UInput v-model.number="state.age" type="number" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Combined Schema and Custom Validation

Using both schema and custom validation for complex scenarios:

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as v from 'valibot'

const schema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  password: '',
  confirmPassword: ''
})

// Custom validation for additional logic beyond schema
function validate(state: Partial<Schema>): FormError[] {
  const errors: FormError[] = []

  if (state.password !== state.confirmPassword) {
    errors.push({
      name: 'confirmPassword',
      message: 'Passwords do not match'
    })
  }

  return errors
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Valid data:', event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" :validate="validate" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UFormField label="Confirm Password" name="confirmPassword">
      <UInput v-model="state.confirmPassword" type="password" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

---

## Props & Configuration

### Form Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string \| number` | — | Unique identifier for the form element |
| `schema` | `Struct \| StandardSchemaV1` | — | Validation schema from any Standard Schema library (Valibot, Zod, Yup, Joi, Superstruct) |
| `state` | `Partial<any>` | — | Reactive object holding the form's state |
| `validate` | `(state: Partial<any>) => FormError[]` | — | Custom validation function returning array of errors |
| `validateOn` | `FormInputEvents[]` | `['blur', 'change', 'input']` | Array of input events that trigger validation |
| `validateOnInputDelay` | `number` | `300` | Delay in milliseconds before validating on input event |
| `disabled` | `boolean` | `false` | Disable all inputs inside the form |
| `name` | `string` | — | Path for nested form state (used with nested forms) |
| `transform` | `boolean` | `true` | Whether to apply schema transformations on submit |
| `nested` | `boolean` | `false` | Attach to parent Form and validate together |
| `loadingAuto` | `boolean` | `true` | Automatically disable form elements during submit event |

### Native HTML Attributes

The Form component also accepts standard HTML form attributes:

- `acceptcharset` - Character encodings for form submission
- `action` - URL to submit form data
- `autocomplete` - Browser autocomplete behavior
- `enctype` - Encoding type for form data
- `method` - HTTP method for form submission (GET, POST)
- `novalidate` - Disable native HTML5 validation
- `target` - Where to display response after submission

---

## Validation Patterns

### Valibot Schema

```typescript
import * as v from 'valibot'

const schema = v.object({
  email: v.pipe(
    v.string('Email must be a string'),
    v.email('Invalid email address'),
    v.minLength(1, 'Email is required')
  ),
  password: v.pipe(
    v.string('Password must be a string'),
    v.minLength(8, 'Password must be at least 8 characters'),
    v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  ),
  age: v.pipe(
    v.number('Age must be a number'),
    v.minValue(18, 'Must be 18 or older')
  ),
  newsletter: v.boolean('Must be a boolean')
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  password: '',
  age: undefined,
  newsletter: false
})
```

### Zod Schema

```typescript
import * as z from 'zod'

const schema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
  age: z.number()
    .min(18, 'Must be 18 or older'),
  newsletter: z.boolean()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  password: '',
  age: undefined,
  newsletter: false
})
```

### Yup Schema

```typescript
import { object, string, number, boolean } from 'yup'

const schema = object({
  email: string()
    .email('Invalid email address')
    .required('Email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .required('Password is required'),
  age: number()
    .min(18, 'Must be 18 or older')
    .required('Age is required'),
  newsletter: boolean()
    .required('Newsletter preference is required')
})

const state = reactive({
  email: '',
  password: '',
  age: undefined,
  newsletter: false
})
```

### Joi Schema

```typescript
import Joi from 'joi'

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Invalid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter'
    }),
  age: Joi.number()
    .min(18)
    .required()
    .messages({
      'number.min': 'Must be 18 or older'
    }),
  newsletter: Joi.boolean().required()
})

const state = reactive({
  email: '',
  password: '',
  age: undefined,
  newsletter: false
})
```

### Superstruct Schema

```typescript
import { object, string, nonempty, number, boolean } from 'superstruct'

const schema = object({
  email: nonempty(string()),
  password: string(),
  age: number(),
  newsletter: boolean()
})

const state = reactive({
  email: '',
  password: '',
  age: undefined,
  newsletter: false
})
```

---

## Schema-based Validation

### Basic Schema Integration

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as v from 'valibot'

const schema = v.object({
  username: v.pipe(v.string(), v.minLength(3, 'At least 3 characters')),
  email: v.pipe(v.string(), v.email('Invalid email'))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Partial<Schema>>({
  username: '',
  email: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // event.data is fully validated and typed
  await saveUser(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField label="Username" name="username">
      <UInput v-model="state.username" />
    </UFormField>

    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UButton type="submit">Create Account</UButton>
  </UForm>
</template>
```

### Nested Object Validation

Validate nested objects using dot notation:

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as v from 'valibot'

const schema = v.object({
  user: v.object({
    firstName: v.pipe(v.string(), v.minLength(1, 'First name is required')),
    lastName: v.pipe(v.string(), v.minLength(1, 'Last name is required')),
    email: v.pipe(v.string(), v.email('Invalid email'))
  }),
  address: v.object({
    street: v.pipe(v.string(), v.minLength(1, 'Street is required')),
    city: v.pipe(v.string(), v.minLength(1, 'City is required')),
    zipCode: v.pipe(v.string(), v.regex(/^\d{5}$/, 'Must be 5 digits'))
  })
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Partial<Schema>>({
  user: {
    firstName: '',
    lastName: '',
    email: ''
  },
  address: {
    street: '',
    city: '',
    zipCode: ''
  }
})
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <!-- User fields use dot notation -->
    <UFormField label="First Name" name="user.firstName">
      <UInput v-model="state.user.firstName" />
    </UFormField>

    <UFormField label="Last Name" name="user.lastName">
      <UInput v-model="state.user.lastName" />
    </UFormField>

    <UFormField label="Email" name="user.email">
      <UInput v-model="state.user.email" />
    </UFormField>

    <!-- Address fields use dot notation -->
    <UFormField label="Street" name="address.street">
      <UInput v-model="state.address.street" />
    </UFormField>

    <UFormField label="City" name="address.city">
      <UInput v-model="state.address.city" />
    </UFormField>

    <UFormField label="Zip Code" name="address.zipCode">
      <UInput v-model="state.address.zipCode" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Schema Transformations

Control whether schema transformations are applied:

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as v from 'valibot'

const schema = v.object({
  email: v.pipe(
    v.string(),
    v.email(),
    v.transform(input => input.toLowerCase()) // Transform to lowercase
  ),
  age: v.pipe(
    v.string(),
    v.transform(input => parseInt(input, 10)) // Transform string to number
  )
})

const state = reactive({
  email: '',
  age: ''
})

async function onSubmit(event: FormSubmitEvent<any>) {
  // With transform: true (default), transformations are applied
  // event.data.email will be lowercase
  // event.data.age will be a number
  console.log(event.data)
}
</script>

<template>
  <!-- Default: transformations applied -->
  <UForm :schema="schema" :state="state" :transform="true" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Age" name="age">
      <UInput v-model="state.age" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

---

## Field Management

### Field Name Mapping

FormField name prop must match state keys:

```vue
<script setup lang="ts">
const state = reactive({
  email: '',
  password: '',
  profile: {
    firstName: '',
    lastName: ''
  }
})
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <!-- Top-level fields -->
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <!-- Nested fields use dot notation -->
    <UFormField label="First Name" name="profile.firstName">
      <UInput v-model="state.profile.firstName" />
    </UFormField>

    <UFormField label="Last Name" name="profile.lastName">
      <UInput v-model="state.profile.lastName" />
    </UFormField>
  </UForm>
</template>
```

### Dynamic Field Names

Generate field names dynamically:

```vue
<script setup lang="ts">
const state = reactive({
  fields: [
    { name: 'field1', value: '' },
    { name: 'field2', value: '' }
  ]
})

function addField() {
  state.fields.push({ name: `field${state.fields.length + 1}`, value: '' })
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <div v-for="(field, index) in state.fields" :key="field.name">
      <UFormField :label="`Field ${index + 1}`" :name="`fields.${index}.value`">
        <UInput v-model="field.value" />
      </UFormField>
    </div>

    <UButton @click="addField">Add Field</UButton>
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Array Field Management

Manage arrays of items within forms:

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as v from 'valibot'

const schema = v.object({
  items: v.array(v.object({
    name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
    quantity: v.pipe(v.number(), v.minValue(1, 'Must be at least 1'))
  }))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Partial<Schema>>({
  items: []
})

function addItem() {
  if (!state.items) state.items = []
  state.items.push({ name: '', quantity: 1 })
}

function removeItem(index: number) {
  state.items?.splice(index, 1)
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <div v-for="(item, index) in state.items" :key="index">
      <UFormField :label="`Item ${index + 1} Name`" :name="`items.${index}.name`">
        <UInput v-model="item.name" />
      </UFormField>

      <UFormField :label="`Item ${index + 1} Quantity`" :name="`items.${index}.quantity`">
        <UInput v-model.number="item.quantity" type="number" />
      </UFormField>

      <UButton @click="removeItem(index)">Remove</UButton>
    </div>

    <UButton @click="addItem">Add Item</UButton>
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

---

## Submission Patterns

### Basic Submit Handler

```vue
<script setup lang="ts">
async function onSubmit(event: FormSubmitEvent<any>) {
  console.log('Form data:', event.data)

  // Perform API call
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(event.data)
    })

    if (response.ok) {
      console.log('Success!')
    }
  } catch (error) {
    console.error('Submission failed:', error)
  }
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <!-- Form fields -->
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Async Submit with Loading State

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isSubmitting = ref(false)

async function onSubmit(event: FormSubmitEvent<any>) {
  isSubmitting.value = true

  try {
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(event.data)
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <!-- Form fields -->
    <UButton type="submit" :loading="isSubmitting">
      Submit
    </UButton>
  </UForm>
</template>
```

### Auto Loading State

The form automatically disables elements during submission when `loadingAuto` is true (default):

```vue
<template>
  <!-- All form elements automatically disabled during submit -->
  <UForm :state="state" :loading-auto="true" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Manual Loading State Control

Disable automatic loading and control it manually:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isLoading = ref(false)

async function onSubmit(event: FormSubmitEvent<any>) {
  isLoading.value = true

  try {
    await submitData(event.data)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UForm
    :state="state"
    :loading-auto="false"
    :disabled="isLoading"
    @submit="onSubmit"
  >
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UButton type="submit" :loading="isLoading">
      Submit
    </UButton>
  </UForm>
</template>
```

### Submit with Redirect

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

async function onSubmit(event: FormSubmitEvent<any>) {
  try {
    await createUser(event.data)

    // Redirect on success
    router.push('/dashboard')
  } catch (error) {
    console.error('Failed to create user:', error)
  }
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <!-- Form fields -->
    <UButton type="submit">Create Account</UButton>
  </UForm>
</template>
```

---

## State Management

### Reactive State

Use Vue's reactive for form state:

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  username: '',
  email: '',
  password: ''
})
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <UFormField label="Username" name="username">
      <UInput v-model="state.username" />
    </UFormField>

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

### Computed State

Derive values from form state:

```vue
<script setup lang="ts">
import { reactive, computed } from 'vue'

const state = reactive({
  firstName: '',
  lastName: ''
})

const fullName = computed(() => {
  return `${state.firstName} ${state.lastName}`.trim()
})
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <UFormField label="First Name" name="firstName">
      <UInput v-model="state.firstName" />
    </UFormField>

    <UFormField label="Last Name" name="lastName">
      <UInput v-model="state.lastName" />
    </UFormField>

    <p v-if="fullName">Full name: {{ fullName }}</p>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Conditional Fields

Show/hide fields based on state:

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  accountType: 'personal',
  companyName: '',
  vatNumber: ''
})
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <UFormField label="Account Type" name="accountType">
      <USelect v-model="state.accountType">
        <option value="personal">Personal</option>
        <option value="business">Business</option>
      </USelect>
    </UFormField>

    <!-- Conditional fields for business accounts -->
    <template v-if="state.accountType === 'business'">
      <UFormField label="Company Name" name="companyName">
        <UInput v-model="state.companyName" />
      </UFormField>

      <UFormField label="VAT Number" name="vatNumber">
        <UInput v-model="state.vatNumber" />
      </UFormField>
    </template>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Resetting State

Reset form to initial values:

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const initialState = {
  email: '',
  password: ''
}

const state = reactive({ ...initialState })

function resetForm() {
  Object.assign(state, initialState)
}

async function onSubmit(event: FormSubmitEvent<any>) {
  await submitData(event.data)
  resetForm() // Reset after successful submission
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
    <UButton @click="resetForm">Reset</UButton>
  </UForm>
</template>
```

---

## Error Handling

### Error Event Handling

Handle validation errors on submit:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const errorMessage = ref('')

async function onError(event: FormErrorEvent) {
  // event.errors contains array of FormError objects
  // Each error has: id, name, message

  const firstError = event.errors[0]
  errorMessage.value = `${firstError.name}: ${firstError.message}`

  // Focus the first error field
  const element = document.getElementById(firstError.id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

async function onSubmit(event: FormSubmitEvent<any>) {
  errorMessage.value = '' // Clear previous errors
  await submitData(event.data)
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit" @error="onError">
    <UAlert v-if="errorMessage" color="red" :text="errorMessage" />

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

### Field-Level Error Display

Errors automatically route to FormField components:

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as v from 'valibot'

const schema = v.object({
  email: v.pipe(v.string(), v.email('Please enter a valid email address')),
  password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters'))
})

const state = reactive({
  email: '',
  password: ''
})
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <!-- Errors automatically displayed in FormField -->
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

### Custom Error Messages

Provide detailed error messages in validation:

```vue
<script setup lang="ts">
import { reactive } from 'vue'

function validate(state: any): FormError[] {
  const errors: FormError[] = []

  if (!state.email) {
    errors.push({
      name: 'email',
      message: 'Email is required to create your account'
    })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.push({
      name: 'email',
      message: 'Please enter a valid email address (e.g., user@example.com)'
    })
  }

  if (!state.password) {
    errors.push({
      name: 'password',
      message: 'Password is required for security'
    })
  } else if (state.password.length < 8) {
    errors.push({
      name: 'password',
      message: 'Password must be at least 8 characters for security'
    })
  }

  return errors
}

const state = reactive({
  email: '',
  password: ''
})
</script>

<template>
  <UForm :state="state" :validate="validate" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">Create Account</UButton>
  </UForm>
</template>
```

### Server-Side Error Handling

Display server errors in the form:

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'

const state = reactive({
  email: '',
  password: ''
})

const serverError = ref('')

async function onSubmit(event: FormSubmitEvent<any>) {
  serverError.value = ''

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(event.data)
    })

    if (!response.ok) {
      const error = await response.json()
      serverError.value = error.message
      return
    }

    // Success - redirect or update UI
  } catch (error) {
    serverError.value = 'An unexpected error occurred. Please try again.'
  }
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <UAlert v-if="serverError" color="red" :text="serverError" />

    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">Sign In</UButton>
  </UForm>
</template>
```

---

## Slot System

The Form component does not expose explicit slots. Content is provided as children within the form tags, and validation errors are automatically routed to FormField components based on the `name` prop.

---

## Accessibility

### Focus Management

Automatically focus the first error field:

```vue
<script setup lang="ts">
async function onError(event: FormErrorEvent) {
  // Get the first error
  const firstError = event.errors[0]

  // Find and focus the element
  const element = document.getElementById(firstError.id)
  if (element) {
    element.focus()
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit" @error="onError">
    <!-- Form fields -->
  </UForm>
</template>
```

### Semantic HTML

Form uses native HTML form element with proper attributes:

```vue
<template>
  <UForm
    :state="state"
    method="POST"
    autocomplete="on"
    novalidate
    @submit="onSubmit"
  >
    <!-- Proper form element with native attributes -->
  </UForm>
</template>
```

### Error Announcements

FormField components include proper ARIA attributes for error announcements to screen readers.

### Keyboard Navigation

All form elements support standard keyboard navigation (Tab, Enter, etc.) without special configuration.

---

## Framework-Specific Features

### Vue Composables

#### useFormField Composable

Implement validation within custom components:

```vue
<script setup lang="ts">
import { useFormField } from '#ui/composables'

// Use in custom form components to integrate with Form validation
const formField = useFormField()
</script>
```

### Vue Reactivity

Form state uses Vue's reactivity system:

```vue
<script setup lang="ts">
import { reactive, watch } from 'vue'

const state = reactive({
  email: '',
  newsletter: false
})

// Watch for changes
watch(() => state.email, (newEmail) => {
  console.log('Email changed to:', newEmail)
})

// Watch entire state
watch(state, (newState) => {
  console.log('State updated:', newState)
}, { deep: true })
</script>
```

### v-model Integration

Form inputs use v-model for two-way binding:

```vue
<template>
  <UForm :state="state" @submit="onSubmit">
    <!-- Standard v-model -->
    <UInput v-model="state.email" />

    <!-- v-model with modifiers -->
    <UInput v-model.number="state.age" type="number" />
    <UInput v-model.trim="state.username" />

    <!-- Checkbox v-model -->
    <UCheckbox v-model="state.newsletter" />
  </UForm>
</template>
```

### Template Refs

Access form element programmatically:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref(null)

function focusFirstField() {
  const firstInput = formRef.value?.querySelector('input')
  firstInput?.focus()
}
</script>

<template>
  <UForm ref="formRef" :state="state" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>
  </UForm>

  <UButton @click="focusFirstField">Focus Form</UButton>
</template>
```

### TypeScript Support

Full TypeScript support with schema inference:

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as v from 'valibot'
import type { FormSubmitEvent, FormErrorEvent, FormError } from '#ui/types'

const schema = v.object({
  email: v.pipe(v.string(), v.email()),
  age: v.pipe(v.number(), v.minValue(18))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  age: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // event.data is typed as Schema
  const validData: Schema = event.data
}

async function onError(event: FormErrorEvent) {
  // event.errors is typed as FormError[]
  const errors: FormError[] = event.errors
}
</script>
```

---

## Validation Triggers

### Configure Validation Events

Control when validation occurs:

```vue
<script setup lang="ts">
// Validate only on blur
const validateOnBlur = ['blur']

// Validate on input and change
const validateOnInput = ['input', 'change']

// Validate on all events (default)
const validateOnAll = ['blur', 'change', 'input']
</script>

<template>
  <!-- Validate only when leaving field -->
  <UForm :state="state" :validate-on="validateOnBlur" @submit="onSubmit">
    <!-- Form fields -->
  </UForm>

  <!-- Validate as user types -->
  <UForm :state="state" :validate-on="validateOnInput" @submit="onSubmit">
    <!-- Form fields -->
  </UForm>
</template>
```

### Validation Input Delay

Configure debounce delay for input validation:

```vue
<template>
  <!-- Wait 500ms after typing before validating -->
  <UForm
    :state="state"
    :validate-on="['input']"
    :validate-on-input-delay="500"
    @submit="onSubmit"
  >
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>
  </UForm>

  <!-- Instant validation (no delay) -->
  <UForm
    :state="state"
    :validate-on="['input']"
    :validate-on-input-delay="0"
    @submit="onSubmit"
  >
    <UFormField label="Username" name="username">
      <UInput v-model="state.username" />
    </UFormField>
  </UForm>
</template>
```

### Validation on Submit

Forms always validate on submit regardless of `validateOn` setting:

```vue
<script setup lang="ts">
async function onSubmit(event: FormSubmitEvent<any>) {
  // This only executes if validation passes
  console.log('Valid data:', event.data)
}

async function onError(event: FormErrorEvent) {
  // This executes if validation fails on submit
  console.log('Validation errors:', event.errors)
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit" @error="onError">
    <!-- Validation always occurs on submit -->
  </UForm>
</template>
```

---

## Nested Forms

### Basic Nested Forms

Create nested forms that validate together:

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as v from 'valibot'

const parentSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, 'Name is required'))
})

const nestedSchema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email'))
})

const state = reactive({
  name: '',
  email: '',
  newsletter: false
})
</script>

<template>
  <!-- Parent form -->
  <UForm :schema="parentSchema" :state="state" @submit="onSubmit">
    <UFormField label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormField>

    <!-- Nested form - validates with parent -->
    <UForm
      v-if="state.newsletter"
      :schema="nestedSchema"
      nested
    >
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormField>
    </UForm>

    <UCheckbox v-model="state.newsletter" label="Subscribe to newsletter" />

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Nested Forms with Name Prop

Target nested attributes using the `name` prop:

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as v from 'valibot'

const schema = v.object({
  user: v.object({
    profile: v.object({
      firstName: v.pipe(v.string(), v.minLength(1)),
      lastName: v.pipe(v.string(), v.minLength(1))
    })
  })
})

const state = reactive({
  user: {
    profile: {
      firstName: '',
      lastName: ''
    }
  }
})
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <!-- Nested form targets user.profile -->
    <UForm name="user.profile" nested>
      <UFormField label="First Name" name="user.profile.firstName">
        <UInput v-model="state.user.profile.firstName" />
      </UFormField>

      <UFormField label="Last Name" name="user.profile.lastName">
        <UInput v-model="state.user.profile.lastName" />
      </UFormField>
    </UForm>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Nested Forms Inheriting State

Nested forms directly inherit their parent's state:

```vue
<script setup lang="ts">
const state = reactive({
  companyName: '',
  companyEmail: '',
  personalEmail: ''
})
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <UFormField label="Company Name" name="companyName">
      <UInput v-model="state.companyName" />
    </UFormField>

    <!-- Nested form inherits state from parent -->
    <UForm nested>
      <UFormField label="Company Email" name="companyEmail">
        <UInput v-model="state.companyEmail" />
      </UFormField>
    </UForm>

    <UFormField label="Personal Email" name="personalEmail">
      <UInput v-model="state.personalEmail" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

---

## Implementation Notes

### No Bundled Validators

Nuxt UI Form does not include any validation library by default. You must install your preferred validation library separately:

```bash
# Install Valibot
npm install valibot

# Or install Zod
npm install zod

# Or install Yup
npm install yup

# Or install Joi
npm install joi

# Or install Superstruct
npm install superstruct
```

### Standard Schema Compatibility

The Form component accepts any schema that follows the Standard Schema format. This includes:
- Valibot
- Zod
- Regle
- Yup
- Joi
- Superstruct

All of these libraries can be used interchangeably as they implement the same standard interface.

### TypeScript Best Practices

1. Always type your schema output:
```typescript
type Schema = v.InferOutput<typeof schema>
const state = reactive<Partial<Schema>>({})
```

2. Type event handlers:
```typescript
async function onSubmit(event: FormSubmitEvent<Schema>) {}
async function onError(event: FormErrorEvent) {}
```

3. Type custom validation:
```typescript
function validate(state: Partial<Schema>): FormError[] {}
```

### Performance Considerations

1. **Validation Delay**: The default `validateOnInputDelay` of 300ms prevents excessive validation on fast typing. Adjust based on your use case.

2. **Loading States**: Use `loadingAuto: true` (default) for automatic form disabling during submission, reducing boilerplate.

3. **Nested Forms**: Nested forms validate together with parent, reducing separate validation passes.

### Form State Patterns

1. **Reactive State**: Always use `reactive()` for form state to ensure proper reactivity.

2. **Partial State**: Use `Partial<Schema>` type for state to handle incomplete forms during editing.

3. **Reset Pattern**: Keep initial state object for easy reset:
```typescript
const initialState = { email: '', password: '' }
const state = reactive({ ...initialState })

function reset() {
  Object.assign(state, initialState)
}
```

### Validation Patterns

1. **Schema Validation**: Use for standard field validation (required, email, min/max, patterns)

2. **Custom Validation**: Use for complex business logic (password match, unique constraints, cross-field validation)

3. **Combined Validation**: Use both schema and custom validation when needed - they work together

### Error Display

Errors automatically route to FormField components based on the `name` prop. Ensure FormField names exactly match state keys and validation rule names.

### Accessibility Recommendations

1. Always handle the `@error` event to focus the first invalid field
2. Use proper `label` props on FormField components
3. Include helpful error messages in validation rules
4. Consider using `aria-describedby` for additional field context
5. Test with keyboard navigation and screen readers

---

Research completed: 2025-11-06
Component: Form
Framework: Nuxt UI
Documentation: https://ui.nuxt.com/components/form
