# Mantine - use-form Hook

## Component Overview

**Note:** The `use-form` hook is a form state management hook, not a visual component. It provides comprehensive form handling capabilities including state management, validation, error handling, and integration with Mantine input components.

The `use-form` hook from `@mantine/form` manages form state without external dependencies. It works independently or seamlessly integrates with `@mantine/core` input components. The hook provides a complete form management solution with validation, error handling, nested field support, array/list operations, and sophisticated state tracking for building complex forms.

**Common Use Cases:**
- User registration and login forms
- Multi-step wizards with validation
- Complex forms with nested objects and arrays
- Dynamic forms with conditional fields
- Forms requiring sophisticated validation logic
- Settings panels with multiple input types
- Data entry interfaces with real-time validation
- Forms with dependent field validation

**Key Characteristics:**
- Zero external dependencies (validation libraries are optional)
- Supports both uncontrolled (recommended) and controlled modes
- Deep object and array nesting with dot notation
- Comprehensive validation framework with schema support
- Touched/dirty state tracking for UX optimization
- Form actions for remote state management
- Seamless Mantine component compatibility
- TypeScript-first with full type inference

---

## Hook API & Configuration

### Basic Initialization

```javascript
import { useForm } from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled', // 'uncontrolled' (recommended) or 'controlled'
  initialValues: {
    email: '',
    password: '',
    rememberMe: false,
  },
});
```

### Complete Configuration Options

```javascript
const form = useForm({
  // Mode selection
  mode: 'uncontrolled', // or 'controlled'

  // Initial state
  initialValues: {
    user: {
      firstName: 'John',
      lastName: 'Doe',
    },
    items: [
      { name: 'Item 1', quantity: 1 },
    ],
  },

  // Initial errors (useful for server-side validation)
  initialErrors: {
    email: 'Email is already taken',
  },

  // Initial touched state
  initialTouched: {
    email: true,
  },

  // Initial dirty state
  initialDirty: {
    password: true,
  },

  // Validation rules
  validate: {
    email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    password: (value) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
  },

  // Validation timing
  validateInputOnChange: true, // or ['email', 'password'] for specific fields
  validateInputOnBlur: true, // or ['email'] for specific fields
  clearInputErrorOnChange: true, // Clear errors as user types (default: true)

  // Submit behavior
  onSubmitPreventDefault: 'always', // 'always' (default), 'never', or 'validation-failed'

  // Value transformation
  transformValues: (values) => ({
    fullName: `${values.firstName} ${values.lastName}`,
    age: Number(values.age) || 0,
  }),

  // Value change callback
  onValuesChange: (values, previous) => {
    console.log('Values changed:', values);
  },

  // Touch behavior
  touchTrigger: 'change', // 'change' (default) or 'focus'

  // Form actions name (for remote control)
  name: 'my-form',

  // Enhanced getInputProps configuration
  enhanceGetInputProps: (payload) => {
    // Customize input props behavior
    if (!payload.form.initialized) {
      return { disabled: true };
    }
    return {};
  },
});
```

---

## Core Patterns

### Pattern 1: Basic Form Setup

```javascript
import { useForm } from '@mantine/form';
import { TextInput, Button, Box } from '@mantine/core';

function BasicForm() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <Box component="form" onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput
        label="Name"
        placeholder="Your name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <TextInput
        label="Email"
        placeholder="your@email.com"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />
      <Button type="submit">Submit</Button>
    </Box>
  );
}
```

### Pattern 2: Nested Objects

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    user: {
      firstName: '',
      lastName: '',
      address: {
        street: '',
        city: '',
        zip: '',
      },
    },
  },
  validate: {
    user: {
      firstName: (value) => (value.length < 2 ? 'Too short' : null),
      lastName: (value) => (value.length < 2 ? 'Too short' : null),
      address: {
        zip: (value) => (/^\d{5}$/.test(value) ? null : 'Invalid ZIP code'),
      },
    },
  },
});

// Usage in component
<TextInput
  label="First Name"
  key={form.key('user.firstName')}
  {...form.getInputProps('user.firstName')}
/>
<TextInput
  label="ZIP Code"
  key={form.key('user.address.zip')}
  {...form.getInputProps('user.address.zip')}
/>
```

### Pattern 3: Dynamic Lists/Arrays

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    employees: [
      { name: 'John', age: 30 },
    ],
  },
});

// Render list
{form.getValues().employees.map((employee, index) => (
  <div key={form.key(`employees.${index}`)}>
    <TextInput
      label="Name"
      key={form.key(`employees.${index}.name`)}
      {...form.getInputProps(`employees.${index}.name`)}
    />
    <NumberInput
      label="Age"
      key={form.key(`employees.${index}.age`)}
      {...form.getInputProps(`employees.${index}.age`)}
    />
    <Button onClick={() => form.removeListItem('employees', index)}>
      Remove
    </Button>
  </div>
))}

<Button onClick={() => form.insertListItem('employees', { name: '', age: 0 })}>
  Add Employee
</Button>
```

---

## Field Management

### Getting and Setting Values

```javascript
// Get all form values (always returns latest values)
const values = form.getValues();

// Get specific field value
const email = form.getValues().email;

// Set multiple values (shallow merge)
form.setValues({ name: 'John', age: 21 });

// Set multiple values with function
form.setValues((prev) => ({ ...prev, name: 'Jane' }));

// Set single field value
form.setFieldValue('email', 'new@example.com');

// Set nested field value
form.setFieldValue('user.firstName', 'Jane');

// Set array item value
form.setFieldValue('employees.0.name', 'Bob');
```

### Resetting Values

```javascript
// Reset to initial values, clear errors and touched state
form.reset();

// Reset specific field
form.resetField('email');

// Update initial values reference
form.setInitialValues({ name: 'John', email: 'john@example.com' });
```

### Transformed Values

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    firstName: 'John',
    lastName: 'Doe',
    age: '25',
  },
  transformValues: (values) => ({
    fullName: `${values.firstName} ${values.lastName}`,
    age: Number(values.age) || 0,
  }),
});

// Get transformed values
const transformed = form.getTransformedValues();
// { fullName: 'John Doe', age: 25 }

// Pass custom values to transform
const customTransformed = form.getTransformedValues({ firstName: 'Jane', lastName: 'Smith', age: '30' });
```

### List Operations

```javascript
// Insert at end of array
form.insertListItem('employees', { name: 'New Employee', age: 25 });

// Insert at specific index
form.insertListItem('employees', { name: 'New Employee', age: 25 }, 1);

// Remove item by index
form.removeListItem('employees', 0);

// Replace item
form.replaceListItem('employees', 0, { name: 'Updated Name', age: 30 });

// Reorder items
form.reorderListItem('employees', { from: 0, to: 2 });
```

### Input Props Integration

```javascript
// Basic input props
<TextInput
  label="Email"
  key={form.key('email')}
  {...form.getInputProps('email')}
/>

// Checkbox input props
<Checkbox
  label="Accept terms"
  key={form.key('acceptTerms')}
  {...form.getInputProps('acceptTerms', { type: 'checkbox' })}
/>

// Custom withError prop
<TextInput
  key={form.key('email')}
  {...form.getInputProps('email', { withError: false })}
/>

// Custom withFocus prop (focus on error)
<TextInput
  key={form.key('email')}
  {...form.getInputProps('email', { withFocus: true })}
/>
```

---

## Validation Patterns

### Inline Validation Rules

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    email: '',
    age: 0,
  },
  validate: {
    name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
    email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    age: (value) => (value < 18 ? 'You must be at least 18' : null),
  },
});
```

### Function-Based Validation

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    password: '',
    confirmPassword: '',
  },
  validate: (values) => ({
    password: values.password.length < 8 ? 'Password too short' : null,
    confirmPassword: values.confirmPassword !== values.password ? 'Passwords do not match' : null,
  }),
});
```

### Validation Function Arguments

```javascript
validate: {
  email: (value, values, path) => {
    // value: current field value
    // values: all form values
    // path: field path like 'user.email'

    if (!value) return 'Email is required';
    if (!/^\S+@\S+$/.test(value)) return 'Invalid email';
    if (values.alternateEmail === value) return 'Email must be different from alternate';

    return null;
  },
}
```

### Cross-Field Validation

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    password: '',
    confirmPassword: '',
    email: '',
    alternateEmail: '',
  },
  validate: {
    confirmPassword: (value, values) =>
      value !== values.password ? 'Passwords must match' : null,
    alternateEmail: (value, values) =>
      value === values.email ? 'Alternate email must be different' : null,
  },
});
```

### Nested Object Validation

```javascript
validate: {
  user: {
    firstName: (value) => (value.length < 2 ? 'Name too short' : null),
    lastName: (value) => (value.length < 2 ? 'Name too short' : null),
    address: {
      street: (value) => (!value ? 'Street is required' : null),
      zip: (value) => (/^\d{5}$/.test(value) ? null : 'Invalid ZIP'),
    },
  },
}
```

### Array/List Validation

```javascript
validate: {
  'employees': (value) => (value.length === 0 ? 'At least one employee required' : null),
  'employees.*': {
    name: (value) => (!value ? 'Name is required' : null),
    age: (value) => (value < 18 ? 'Must be 18 or older' : null),
  },
}
```

### Validation Timing Configuration

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '', password: '' },
  validate: {
    email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    password: (value) => (value.length < 8 ? 'Too short' : null),
  },

  // Validate all fields on every change
  validateInputOnChange: true,

  // Validate only specific fields on change
  validateInputOnChange: ['email', 'password'],

  // Validate all fields when focus leaves input
  validateInputOnBlur: true,

  // Validate only specific fields on blur
  validateInputOnBlur: ['email'],

  // Keep errors visible until submission (default: true)
  clearInputErrorOnChange: false,
});
```

### Built-in Validators

```javascript
import {
  isNotEmpty,
  isEmail,
  matches,
  isInRange,
  hasLength,
  matchesField,
  isJSONString,
  isNotEmptyHTML
} from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    email: '',
    age: 0,
    password: '',
    confirmPassword: '',
    bio: '',
    jsonData: '',
  },
  validate: {
    name: hasLength({ min: 2, max: 50 }, 'Name must be 2-50 characters'),
    email: isEmail('Invalid email address'),
    age: isInRange({ min: 18, max: 120 }, 'Age must be 18-120'),
    password: hasLength({ min: 8 }, 'Password must be at least 8 characters'),
    confirmPassword: matchesField('password', 'Passwords do not match'),
    bio: isNotEmpty('Bio is required'),
    jsonData: isJSONString('Must be valid JSON'),
  },
});
```

### Validation Methods

```javascript
// Validate all fields, set form.errors
const hasErrors = form.validate();

// Validate specific field
form.validateField('email');
form.validateField('user.firstName');
form.validateField('employees.0.name');

// Check validity without setting errors (returns boolean)
const isFormValid = form.isValid();
const isFieldValid = form.isValid('email');
```

---

## State Management

### Uncontrolled Mode (Recommended)

Uncontrolled mode stores form data in a ref instead of React state, providing significant performance improvements for large forms. This is the recommended approach for all forms.

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { name: '', email: '' },
});

// Always use form.key() in uncontrolled mode
<TextInput
  label="Name"
  key={form.key('name')}
  {...form.getInputProps('name')}
/>

// Always use form.getValues() instead of form.values
const currentValues = form.getValues();
```

**Key Points:**
- Form data stored in ref, not state
- Components don't rerender on every keystroke
- Must use `form.key()` for proper updates
- Use `form.getValues()` to access current values
- `form.values` doesn't update during input changes

### Controlled Mode

Controlled mode stores form data in React state, causing rerenders on every value change.

```javascript
const form = useForm({
  mode: 'controlled',
  initialValues: { name: '', email: '' },
});

// No need for form.key() in controlled mode
<TextInput
  label="Name"
  {...form.getInputProps('name')}
/>

// form.values is always up-to-date
console.log(form.values.name);
```

**When to Use:**
- Small forms where performance isn't a concern
- Need to access form.values in render (though `onValuesChange` is better)
- Legacy code migration

### Watching Value Changes

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { name: '', email: '' },

  // Global value change callback
  onValuesChange: (values, previous) => {
    console.log('Current:', values);
    console.log('Previous:', previous);
  },
});

// Watch specific field
form.watch('email', ({ previousValue, value, touched, dirty }) => {
  console.log('Email changed:', { previousValue, value, touched, dirty });
});

// Watch nested field
form.watch('user.firstName', (payload) => {
  console.log('First name changed:', payload);
});

// Cascade updates for nested objects
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { user: { name: '', email: '' } },
  watch: {
    cascadeUpdates: true, // Parent writes trigger nested subscriptions
  },
});
```

### Form Initialization

```javascript
// Initialize form with data (can only be called once)
form.initialize({
  name: 'John',
  email: 'john@example.com',
});

// Set initial values (can be called multiple times)
form.setInitialValues({
  name: 'Jane',
  email: 'jane@example.com',
});

// Enhance getInputProps to disable before initialization
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { name: '', email: '' },
  enhanceGetInputProps: (payload) => {
    if (!payload.form.initialized) {
      return { disabled: true };
    }
    return {};
  },
});
```

### Touched State Management

```javascript
// Check if any field was touched
const anyTouched = form.isTouched();

// Check if specific field was touched
const emailTouched = form.isTouched('email');
const nestedTouched = form.isTouched('user.firstName');

// Set touched state
form.setTouched({ email: true, password: true });
form.setTouched({ 'user.firstName': true });

// Reset touched state
form.resetTouched();

// Configure when fields become touched
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '' },
  touchTrigger: 'focus', // 'change' (default) or 'focus'
});
```

### Dirty State Management

```javascript
// Check if any field is dirty (differs from initial)
const anyDirty = form.isDirty();

// Check if specific field is dirty
const emailDirty = form.isDirty('email');
const nestedDirty = form.isDirty('user.firstName');

// Set dirty state
form.setDirty({ email: true });

// Reset dirty state
form.resetDirty();

// Reset dirty with new baseline values
form.resetDirty({ email: 'new@example.com' });
```

### Submitting State

```javascript
// Automatically tracks async submission
const handleSubmit = form.onSubmit(async (values) => {
  // form.submitting is automatically set to true
  await api.submitForm(values);
  // form.submitting is automatically set to false
});

// Access submitting state
const isSubmitting = form.submitting;

// Manually control submitting state
form.setSubmitting(true);
// ... async operation
form.setSubmitting(false);

// Use in UI
<Button type="submit" loading={form.submitting}>
  Submit
</Button>
```

---

## Submission Patterns

### Basic Submission

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '', password: '' },
});

const handleSubmit = form.onSubmit((values) => {
  console.log('Form values:', values);
  // Submit to API
});

<form onSubmit={handleSubmit}>
  <TextInput key={form.key('email')} {...form.getInputProps('email')} />
  <Button type="submit">Submit</Button>
</form>
```

### Submission with Validation Error Handling

```javascript
const handleSubmit = form.onSubmit(
  (values, event) => {
    // Success handler - all validation passed
    console.log('Valid values:', values);
    console.log('Event:', event);
  },
  (validationErrors, values, event) => {
    // Error handler - validation failed
    console.log('Errors:', validationErrors);
    console.log('Values:', values);
    console.log('Event:', event);

    // Show notification
    showNotification({
      title: 'Validation Error',
      message: 'Please fix the errors',
      color: 'red',
    });

    // Focus first invalid field
    const firstErrorPath = Object.keys(validationErrors)[0];
    form.getInputNode(firstErrorPath)?.focus();
  }
);
```

### Async Submission with Loading State

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '', password: '' },
});

const handleSubmit = form.onSubmit(async (values) => {
  // form.submitting automatically set to true
  try {
    const response = await api.register(values);
    console.log('Success:', response);
    form.reset();
  } catch (error) {
    form.setFieldError('email', error.message);
  }
  // form.submitting automatically set to false
});

<form onSubmit={handleSubmit}>
  <TextInput
    key={form.key('email')}
    {...form.getInputProps('email')}
    disabled={form.submitting}
  />
  <Button type="submit" loading={form.submitting}>
    Register
  </Button>
</form>
```

### Submit with Transformed Values

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    firstName: '',
    lastName: '',
    age: '',
  },
  transformValues: (values) => ({
    fullName: `${values.firstName} ${values.lastName}`,
    age: Number(values.age),
  }),
});

const handleSubmit = form.onSubmit((values) => {
  // values = { fullName: 'John Doe', age: 25 }
  console.log('Transformed:', values);
});
```

### Submit Prevention Configuration

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '' },

  // Always prevent default (default behavior)
  onSubmitPreventDefault: 'always',

  // Never prevent default (allows native form submission)
  // onSubmitPreventDefault: 'never',

  // Prevent only on validation failure
  // onSubmitPreventDefault: 'validation-failed',
});
```

### Reset Form After Submission

```javascript
const handleSubmit = form.onSubmit(async (values) => {
  await api.submitForm(values);
  form.reset(); // Reset to initial values, clear errors
});

// Reset specific fields
form.resetField('email');

// Reset with new initial values
form.setInitialValues({ email: '', password: '' });
form.reset();
```

---

## Error Handling

### Getting Errors

```javascript
// Access all errors
const allErrors = form.errors;
// { email: 'Invalid email', password: 'Too short' }

// Access specific error
const emailError = form.errors.email;
const nestedError = form.errors['user.firstName'];
const arrayError = form.errors['employees.0.age'];
```

### Setting Errors Manually

```javascript
// Set multiple errors
form.setErrors({
  email: 'Email is already taken',
  password: 'Password is too weak',
});

// Set single field error
form.setFieldError('email', 'This email is already registered');

// Set nested field error
form.setFieldError('user.firstName', 'First name is required');

// Set array field error
form.setFieldError('employees.0.age', 'Age must be 18 or older');
```

### Clearing Errors

```javascript
// Clear all errors
form.clearErrors();

// Clear specific field error
form.clearFieldError('email');

// Clear nested field error
form.clearFieldError('user.firstName');

// Clear array field error
form.clearFieldError('employees.0.age');
```

### Error Display Configuration

```javascript
// Clear errors as user types (default: true)
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '' },
  clearInputErrorOnChange: true,
});

// Keep errors visible until validation passes
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '' },
  clearInputErrorOnChange: false,
});
```

### Initial Errors

```javascript
// Set errors on form initialization (useful for server-side validation)
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    email: 'existing@example.com',
  },
  initialErrors: {
    email: 'This email is already registered',
  },
});
```

### Error Handling in Submission

```javascript
const handleSubmit = form.onSubmit(
  (values) => {
    // Success - no validation errors
  },
  (errors, values, event) => {
    // Validation errors occurred
    console.log('Validation errors:', errors);

    // Focus first error field
    const firstErrorPath = Object.keys(errors)[0];
    const inputNode = form.getInputNode(firstErrorPath);
    if (inputNode) {
      inputNode.focus();
    }

    // Show error notification
    showNotification({
      title: 'Form has errors',
      message: 'Please check all fields',
      color: 'red',
    });
  }
);
```

### Server-Side Error Handling

```javascript
const handleSubmit = form.onSubmit(async (values) => {
  try {
    const response = await api.register(values);
    console.log('Success:', response);
  } catch (error) {
    // Handle API errors
    if (error.field === 'email') {
      form.setFieldError('email', error.message);
    } else {
      form.setErrors(error.fieldErrors);
    }
  }
});
```

### Getting Input Node for Error Focus

```javascript
// Get DOM node for field
const emailInput = form.getInputNode('email');
const nestedInput = form.getInputNode('user.firstName');
const arrayInput = form.getInputNode('employees.0.name');

// Focus on error
if (emailInput) {
  emailInput.focus();
}

// Scroll to error
emailInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
```

---

## Schema Validation

### Zod Integration

```javascript
import { z } from 'zod';
import { zodResolver } from 'mantine-form-zod-resolver';

const schema = z.object({
  name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
  email: z.string().email({ message: 'Invalid email' }),
  age: z.number().min(18, { message: 'You must be at least 18' }),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept terms',
  }),
});

const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    email: '',
    age: 16,
    terms: false,
  },
  validate: zodResolver(schema),
});
```

### Zod with Nested Objects

```javascript
const schema = z.object({
  user: z.object({
    firstName: z.string().min(2, 'First name too short'),
    lastName: z.string().min(2, 'Last name too short'),
    email: z.string().email('Invalid email'),
    address: z.object({
      street: z.string().min(1, 'Street is required'),
      city: z.string().min(1, 'City is required'),
      zip: z.string().regex(/^\d{5}$/, 'Invalid ZIP code'),
    }),
  }),
});

const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    user: {
      firstName: '',
      lastName: '',
      email: '',
      address: {
        street: '',
        city: '',
        zip: '',
      },
    },
  },
  validate: zodResolver(schema),
});
```

### Zod with Arrays

```javascript
const schema = z.object({
  employees: z.array(
    z.object({
      name: z.string().min(2, 'Name too short'),
      age: z.number().min(18, 'Must be 18 or older'),
      email: z.string().email('Invalid email'),
    })
  ).min(1, 'At least one employee required'),
});

const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    employees: [
      { name: '', age: 0, email: '' },
    ],
  },
  validate: zodResolver(schema),
});
```

### Zod v4 Support

```javascript
import { z } from 'zod/v4';
import { zod4Resolver } from 'mantine-form-zod-resolver';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '', age: 0 },
  validate: zod4Resolver(schema),
});
```

### Yup Integration

```javascript
import * as yup from 'yup';
import { yupResolver } from 'mantine-form-yup-resolver';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name should have at least 2 letters'),
  email: yup.string().required('Invalid email').email('Invalid email'),
  age: yup.number().min(18, 'You must be at least 18'),
});

const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    email: '',
    age: 16,
  },
  validate: yupResolver(schema),
});
```

### Joi Integration

```javascript
import Joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';

const schema = Joi.object({
  name: Joi.string().min(2).messages({
    'string.min': 'Name should have at least 2 letters',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Invalid email',
    }),
  age: Joi.number().min(18).messages({
    'number.min': 'You must be at least 18',
  }),
});

const form = useForm({
  mode: 'uncontrolled',
  initialValues: { name: '', email: '', age: 16 },
  validate: joiResolver(schema),
});
```

### Valibot Integration

```javascript
import * as v from 'valibot';
import { valibotResolver } from 'mantine-form-valibot-resolver';

const schema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, 'Name should have at least 2 letters')
  ),
  email: v.pipe(
    v.string(),
    v.email('Invalid email')
  ),
  age: v.pipe(
    v.number(),
    v.minValue(18, 'You must be at least 18')
  ),
});

const form = useForm({
  mode: 'uncontrolled',
  initialValues: { name: '', email: '', age: 16 },
  validate: valibotResolver(schema),
});

// TypeScript type inference
type FormValues = v.InferInput<typeof schema>;
```

### Superstruct Integration

```javascript
import { object, string, number, size, refine } from 'superstruct';
import { superstructResolver } from 'mantine-form-superstruct-resolver';

const schema = object({
  name: size(string(), 2, Infinity),
  email: refine(string(), 'email', (value) => /^\S+@\S+$/.test(value)),
  age: refine(number(), 'min-age', (value) => value >= 18),
});

const form = useForm({
  mode: 'uncontrolled',
  initialValues: { name: '', email: '', age: 16 },
  validate: superstructResolver(schema),
});
```

---

## Form Values & Transformations

### Getting Values

```javascript
// Get all form values (recommended - always returns latest)
const values = form.getValues();

// In uncontrolled mode, form.values may be stale
// Always use form.getValues() instead

// Get transformed values
const transformed = form.getTransformedValues();

// Transform custom values
const customTransformed = form.getTransformedValues({
  firstName: 'Jane',
  lastName: 'Smith',
});
```

### Value Transformations

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    firstName: '',
    lastName: '',
    age: '',
    acceptTerms: false,
  },
  transformValues: (values) => ({
    // Combine fields
    fullName: `${values.firstName} ${values.lastName}`.trim(),

    // Type conversion
    age: Number(values.age) || 0,

    // Boolean normalization
    acceptTerms: Boolean(values.acceptTerms),

    // Computed fields
    isAdult: Number(values.age) >= 18,

    // Remove fields
    // firstName and lastName not included
  }),
});

// On submission, transformed values are passed
const handleSubmit = form.onSubmit((values) => {
  // values = {
  //   fullName: 'John Doe',
  //   age: 25,
  //   acceptTerms: true,
  //   isAdult: true
  // }
});
```

### Watching Value Changes

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '', password: '' },

  // Global change handler
  onValuesChange: (values, previous) => {
    console.log('Current values:', values);
    console.log('Previous values:', previous);

    // Track changes
    const changedFields = Object.keys(values).filter(
      key => values[key] !== previous[key]
    );
    console.log('Changed fields:', changedFields);
  },
});

// Watch specific field
form.watch('email', ({ previousValue, value, touched, dirty }) => {
  console.log('Email changed from', previousValue, 'to', value);
  console.log('Touched:', touched, 'Dirty:', dirty);

  // Trigger side effects
  if (value.includes('@')) {
    // Fetch email suggestions
  }
});

// Watch nested field
form.watch('user.address.city', (payload) => {
  // Update related fields
  if (payload.value === 'New York') {
    form.setFieldValue('user.address.state', 'NY');
  }
});

// Cascade updates for nested objects
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    user: { name: '', email: '' },
  },
  watch: {
    cascadeUpdates: true, // Parent updates trigger nested subscriptions
  },
});
```

### Initial Values

```javascript
// Set at initialization
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    name: 'John',
    email: 'john@example.com',
  },
});

// Update initial values reference
form.setInitialValues({
  name: 'Jane',
  email: 'jane@example.com',
});

// Initialize form with data (one-time operation)
form.initialize({
  name: 'Bob',
  email: 'bob@example.com',
});
```

---

## Advanced Features

### Form Actions (Remote Control)

Form actions allow controlling forms from anywhere in your application without direct access to the form instance.

```javascript
// In form component
import { useForm } from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  name: 'registration-form', // Unique form identifier
  initialValues: {
    email: '',
    password: '',
  },
});

// In separate file or component
import { createFormActions } from '@mantine/form';

const registrationFormActions = createFormActions('registration-form');

// Use actions from anywhere
registrationFormActions.setFieldValue('email', 'new@example.com');
registrationFormActions.setValues({ email: 'test@test.com', password: '12345' });
registrationFormActions.setErrors({ email: 'Email already taken' });
registrationFormActions.validate();
registrationFormActions.reset();

// All available action methods:
// - setFieldValue(path, value)
// - setValues(values)
// - setInitialValues(values)
// - setErrors(errors)
// - setFieldError(path, error)
// - clearFieldError(path)
// - clearErrors()
// - reset()
// - validate()
// - validateField(path)
// - reorderListItem(path, payload)
// - removeListItem(path, index)
// - insertListItem(path, item, index?)
// - setDirty(state)
// - setTouched(state)
// - resetDirty(values?)
// - resetTouched()
```

### Enhanced getInputProps

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '', password: '' },
  enhanceGetInputProps: (payload) => {
    // Disable all inputs before form initialization
    if (!payload.form.initialized) {
      return { disabled: true };
    }

    // Add custom validation styling
    if (payload.error) {
      return {
        className: 'error-input',
        'data-error': true,
      };
    }

    // Field-specific customization
    if (payload.field === 'email') {
      return {
        autoComplete: 'email',
        inputMode: 'email',
      };
    }

    return {};
  },
});
```

### TypeScript Integration

```javascript
import { useForm, UseFormReturnType } from '@mantine/form';

// Define form values type
interface FormValues {
  name: string;
  email: string;
  age: number;
  user: {
    firstName: string;
    lastName: string;
  };
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

// Use with explicit type
const form = useForm<FormValues>({
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    email: '',
    age: 0,
    user: {
      firstName: '',
      lastName: '',
    },
    items: [],
  },
});

// Infer type from initialValues
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    email: '',
  },
});
type InferredFormValues = typeof form.values;

// Use form type in components
function EmailInput({ form }: { form: UseFormReturnType<FormValues> }) {
  return (
    <TextInput
      label="Email"
      key={form.key('email')}
      {...form.getInputProps('email')}
    />
  );
}

// Transformed values type
import { TransformedValues } from '@mantine/form';

type TransformedFormValues = TransformedValues<typeof form>;
```

### Dynamic Form Fields

```javascript
function DynamicForm() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      advanced: {
        notifications: true,
        theme: 'light',
      },
    },
  });

  return (
    <form onSubmit={form.onSubmit(console.log)}>
      <TextInput
        label="Email"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <Checkbox
        label="Show advanced options"
        checked={showAdvanced}
        onChange={(e) => setShowAdvanced(e.currentTarget.checked)}
      />

      {showAdvanced && (
        <>
          <Switch
            label="Enable notifications"
            key={form.key('advanced.notifications')}
            {...form.getInputProps('advanced.notifications', { type: 'checkbox' })}
          />
          <Select
            label="Theme"
            data={['light', 'dark']}
            key={form.key('advanced.theme')}
            {...form.getInputProps('advanced.theme')}
          />
        </>
      )}

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Field Dependencies

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    country: '',
    state: '',
    city: '',
  },
});

// Watch country and update state options
form.watch('country', ({ value }) => {
  form.setFieldValue('state', ''); // Reset dependent field
  form.setFieldValue('city', ''); // Reset deeper dependent field
});

// Watch state and update city options
form.watch('state', ({ value }) => {
  form.setFieldValue('city', ''); // Reset dependent field
});
```

### Conditional Validation

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    accountType: 'personal',
    companyName: '',
    taxId: '',
  },
  validate: {
    companyName: (value, values) => {
      // Only validate if account type is business
      if (values.accountType === 'business' && !value) {
        return 'Company name is required for business accounts';
      }
      return null;
    },
    taxId: (value, values) => {
      // Only validate if account type is business
      if (values.accountType === 'business') {
        if (!value) return 'Tax ID is required';
        if (!/^\d{9}$/.test(value)) return 'Tax ID must be 9 digits';
      }
      return null;
    },
  },
});
```

### Multi-Step Forms

```javascript
function MultiStepForm() {
  const [step, setStep] = useState(1);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      // Step 1
      email: '',
      password: '',
      // Step 2
      firstName: '',
      lastName: '',
      // Step 3
      address: '',
      city: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 8 ? 'Too short' : null),
      firstName: (value) => (!value ? 'Required' : null),
      lastName: (value) => (!value ? 'Required' : null),
      address: (value) => (!value ? 'Required' : null),
      city: (value) => (!value ? 'Required' : null),
    },
  });

  const validateStep = (fields: string[]) => {
    const fieldsValid = fields.every((field) => form.isValid(field));
    if (!fieldsValid) {
      fields.forEach((field) => form.validateField(field));
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep(['email', 'password'])) {
      setStep(2);
    } else if (step === 2 && validateStep(['firstName', 'lastName'])) {
      setStep(3);
    }
  };

  return (
    <form onSubmit={form.onSubmit(console.log)}>
      {step === 1 && (
        <>
          <TextInput key={form.key('email')} {...form.getInputProps('email')} />
          <PasswordInput key={form.key('password')} {...form.getInputProps('password')} />
          <Button onClick={nextStep}>Next</Button>
        </>
      )}

      {step === 2 && (
        <>
          <TextInput key={form.key('firstName')} {...form.getInputProps('firstName')} />
          <TextInput key={form.key('lastName')} {...form.getInputProps('lastName')} />
          <Button onClick={() => setStep(1)}>Back</Button>
          <Button onClick={nextStep}>Next</Button>
        </>
      )}

      {step === 3 && (
        <>
          <TextInput key={form.key('address')} {...form.getInputProps('address')} />
          <TextInput key={form.key('city')} {...form.getInputProps('city')} />
          <Button onClick={() => setStep(2)}>Back</Button>
          <Button type="submit">Submit</Button>
        </>
      )}
    </form>
  );
}
```

---

## Integration with Mantine Inputs

### Text Inputs

```javascript
import { TextInput, Textarea, PasswordInput } from '@mantine/core';

<TextInput
  label="Email"
  placeholder="your@email.com"
  withAsterisk
  key={form.key('email')}
  {...form.getInputProps('email')}
/>

<Textarea
  label="Bio"
  placeholder="Tell us about yourself"
  key={form.key('bio')}
  {...form.getInputProps('bio')}
/>

<PasswordInput
  label="Password"
  placeholder="Enter password"
  key={form.key('password')}
  {...form.getInputProps('password')}
/>
```

### Number Inputs

```javascript
import { NumberInput } from '@mantine/core';

<NumberInput
  label="Age"
  placeholder="Enter your age"
  min={0}
  max={120}
  key={form.key('age')}
  {...form.getInputProps('age')}
/>
```

### Select and MultiSelect

```javascript
import { Select, MultiSelect } from '@mantine/core';

<Select
  label="Country"
  placeholder="Select country"
  data={['USA', 'Canada', 'UK', 'Germany']}
  key={form.key('country')}
  {...form.getInputProps('country')}
/>

<MultiSelect
  label="Skills"
  placeholder="Select your skills"
  data={['JavaScript', 'TypeScript', 'React', 'Node.js']}
  key={form.key('skills')}
  {...form.getInputProps('skills')}
/>
```

### Checkbox and Switch

```javascript
import { Checkbox, Switch, CheckboxGroup } from '@mantine/core';

<Checkbox
  label="Accept terms and conditions"
  key={form.key('acceptTerms')}
  {...form.getInputProps('acceptTerms', { type: 'checkbox' })}
/>

<Switch
  label="Enable notifications"
  key={form.key('notifications')}
  {...form.getInputProps('notifications', { type: 'checkbox' })}
/>

<CheckboxGroup
  label="Select your interests"
  key={form.key('interests')}
  {...form.getInputProps('interests')}
>
  <Checkbox value="sports" label="Sports" />
  <Checkbox value="music" label="Music" />
  <Checkbox value="travel" label="Travel" />
</CheckboxGroup>
```

### Radio

```javascript
import { Radio, RadioGroup } from '@mantine/core';

<RadioGroup
  label="Account type"
  key={form.key('accountType')}
  {...form.getInputProps('accountType')}
>
  <Radio value="personal" label="Personal" />
  <Radio value="business" label="Business" />
</RadioGroup>
```

### Date and Time Inputs

```javascript
import { DateInput, DateTimePicker, TimeInput } from '@mantine/dates';

<DateInput
  label="Date of birth"
  placeholder="Select date"
  key={form.key('dateOfBirth')}
  {...form.getInputProps('dateOfBirth')}
/>

<DateTimePicker
  label="Event start"
  placeholder="Pick date and time"
  key={form.key('eventStart')}
  {...form.getInputProps('eventStart')}
/>

<TimeInput
  label="Appointment time"
  key={form.key('appointmentTime')}
  {...form.getInputProps('appointmentTime')}
/>
```

### Slider and Range Slider

```javascript
import { Slider, RangeSlider } from '@mantine/core';

<Slider
  label="Volume"
  min={0}
  max={100}
  key={form.key('volume')}
  {...form.getInputProps('volume')}
/>

<RangeSlider
  label="Price range"
  min={0}
  max={1000}
  key={form.key('priceRange')}
  {...form.getInputProps('priceRange')}
/>
```

### File Input

```javascript
import { FileInput } from '@mantine/core';

<FileInput
  label="Upload resume"
  placeholder="Click to select file"
  accept="application/pdf"
  key={form.key('resume')}
  {...form.getInputProps('resume')}
/>
```

### Color Input

```javascript
import { ColorInput } from '@mantine/core';

<ColorInput
  label="Brand color"
  placeholder="Pick color"
  key={form.key('brandColor')}
  {...form.getInputProps('brandColor')}
/>
```

### JSON Input

```javascript
import { JsonInput } from '@mantine/core';

<JsonInput
  label="Configuration"
  placeholder="Enter JSON"
  formatOnBlur
  autosize
  minRows={4}
  key={form.key('config')}
  {...form.getInputProps('config')}
/>
```

---

## Accessibility

### Automatic ARIA Support

The `getInputProps()` method automatically provides accessibility attributes:

```javascript
<TextInput
  key={form.key('email')}
  {...form.getInputProps('email')}
  // Automatically includes:
  // - id attribute for label association
  // - aria-invalid when field has error
  // - aria-describedby pointing to error message
/>
```

### Focus Management

```javascript
// Get DOM node for any field
const inputNode = form.getInputNode('email');

// Focus on error
if (inputNode) {
  inputNode.focus();
  inputNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Focus first error on submit
const handleSubmit = form.onSubmit(
  (values) => console.log(values),
  (errors) => {
    const firstErrorPath = Object.keys(errors)[0];
    form.getInputNode(firstErrorPath)?.focus();
  }
);
```

### Required Field Indicators

```javascript
<TextInput
  label="Email"
  withAsterisk // Shows visual required indicator
  key={form.key('email')}
  {...form.getInputProps('email')}
/>
```

### Error Announcements

```javascript
// Errors are automatically associated via aria-describedby
<TextInput
  key={form.key('email')}
  {...form.getInputProps('email')}
  // When error exists:
  // aria-invalid="true"
  // aria-describedby="email-error"
/>
// Error message has id="email-error" for screen readers
```

### Keyboard Navigation

All Mantine inputs support standard keyboard navigation:
- Tab/Shift+Tab for focus movement
- Enter to submit forms
- Space for checkboxes and radio buttons
- Arrow keys for select, radio groups, and sliders

### Label Association

```javascript
// Labels are automatically associated with inputs
<TextInput
  label="Full Name"
  key={form.key('name')}
  {...form.getInputProps('name')}
  // Generates:
  // <label for="mantine-id">Full Name</label>
  // <input id="mantine-id" ... />
/>
```

---

## Framework-Specific Features

### Uncontrolled Mode (Mantine-Specific)

Mantine's uncontrolled mode is a unique feature that stores form data in refs instead of state, providing significant performance improvements:

```javascript
const form = useForm({
  mode: 'uncontrolled', // Mantine-specific optimization
  initialValues: { email: '', password: '' },
});

// Must use form.key() in uncontrolled mode
<TextInput
  key={form.key('email')} // Required for uncontrolled mode
  {...form.getInputProps('email')}
/>
```

### Form Actions System

Mantine provides a unique form actions system for controlling forms remotely:

```javascript
// Define form with name
const form = useForm({
  mode: 'uncontrolled',
  name: 'myForm',
  initialValues: { email: '' },
});

// Create actions in separate file
import { createFormActions } from '@mantine/form';
const myFormActions = createFormActions('myForm');

// Control form from anywhere
myFormActions.setFieldValue('email', 'new@example.com');
myFormActions.validate();
```

### Enhanced getInputProps

Mantine's `enhanceGetInputProps` allows customizing input props globally:

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '' },
  enhanceGetInputProps: (payload) => {
    // Disable inputs before initialization
    if (!payload.form.initialized) {
      return { disabled: true };
    }
    return {};
  },
});
```

### Watch System with Cascade Updates

Mantine provides a sophisticated watch system with cascade update support:

```javascript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { user: { name: '', email: '' } },
  watch: {
    cascadeUpdates: true, // Parent updates trigger nested watchers
  },
});

form.watch('user', (payload) => {
  // Triggered when parent updates
});

form.watch('user.name', (payload) => {
  // Also triggered when parent updates with cascadeUpdates: true
});
```

### Built-in Validators

Mantine provides built-in validators not found in other form libraries:

```javascript
import {
  isNotEmpty,
  isEmail,
  matches,
  isInRange,
  hasLength,
  matchesField,
  isJSONString,
  isNotEmptyHTML
} from '@mantine/form';
```

### Schema Resolver Pattern

Mantine uses a resolver pattern for schema validation, supporting multiple libraries:

```javascript
import { zodResolver } from 'mantine-form-zod-resolver';
import { yupResolver } from 'mantine-form-yup-resolver';
import { joiResolver } from 'mantine-form-joi-resolver';
import { valibotResolver } from 'mantine-form-valibot-resolver';

// Consistent API across all schema libraries
const form = useForm({
  validate: zodResolver(schema),
  // or yupResolver(schema)
  // or joiResolver(schema)
  // or valibotResolver(schema)
});
```

---

## Implementation Notes

### Performance Considerations

1. **Use Uncontrolled Mode**: Recommended for all forms, especially large ones. Provides significant performance improvements by storing data in refs.

2. **Always Use form.key()**: In uncontrolled mode, always use `form.key()` on inputs to ensure proper updates when `setFieldValue()` is called.

3. **Use form.getValues()**: Instead of accessing `form.values` directly, always use `form.getValues()` which returns the latest values in both modes.

4. **Validate Specific Fields**: Use `form.validateField()` instead of `form.validate()` when you only need to validate one field.

5. **Conditional Rendering**: When conditionally rendering large sections of forms, component unmounting/remounting won't cause performance issues in uncontrolled mode.

### Migration from Controlled to Uncontrolled

```javascript
// Before (controlled mode)
const form = useForm({
  mode: 'controlled', // or omit mode
  initialValues: { email: '' },
});

// Usage
<TextInput {...form.getInputProps('email')} />
console.log(form.values.email); // Always up-to-date

// After (uncontrolled mode)
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '' },
});

// Usage - add form.key()
<TextInput
  key={form.key('email')} // Required in uncontrolled mode
  {...form.getInputProps('email')}
/>

// Use form.getValues() instead of form.values
console.log(form.getValues().email); // Always returns latest

// Replace useEffect watching form.values
// Before:
useEffect(() => {
  console.log(form.values.email);
}, [form.values.email]);

// After:
form.watch('email', ({ value }) => {
  console.log(value);
});

// Or use onValuesChange
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '' },
  onValuesChange: (values) => {
    console.log(values.email);
  },
});
```

### Common Patterns

**Loading Initial Data:**
```javascript
useEffect(() => {
  fetchUserData().then((data) => {
    form.initialize(data); // One-time initialization
  });
}, []);
```

**Conditional Field Display:**
```javascript
const showAdvanced = form.getValues().showAdvanced;
{showAdvanced && (
  <TextInput
    key={form.key('advanced.option')}
    {...form.getInputProps('advanced.option')}
  />
)}
```

**Form Reset After Success:**
```javascript
const handleSubmit = form.onSubmit(async (values) => {
  await api.submit(values);
  form.reset(); // Clear form after success
});
```

**Dirty State for Unsaved Changes Warning:**
```javascript
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (form.isDirty()) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, []);
```

### Best Practices

1. **Always validate on submit**: Use `form.onSubmit()` which automatically validates before calling your handler.

2. **Use schema validation for complex rules**: For forms with complex validation logic, use Zod, Yup, or another schema library.

3. **Initialize once**: Use `form.initialize()` for one-time data loading. Use `form.setValues()` for updates.

4. **Handle async errors**: Catch API errors in submit handler and set field errors using `form.setFieldError()`.

5. **Use TypeScript**: Define form value types for better DX and fewer runtime errors.

6. **Leverage watchers**: Use `form.watch()` instead of `useEffect` for reacting to value changes.

7. **Disable on submit**: Disable submit button during async submission: `<Button loading={form.submitting}>`.

8. **Focus on errors**: Focus the first error field on failed validation for better UX.

9. **Clear errors appropriately**: Use `clearInputErrorOnChange: true` for real-time validation, `false` for submit-only validation.

10. **Use form actions sparingly**: Only use form actions for legitimate remote control scenarios, not as a replacement for proper component composition.

---

Research completed: November 6, 2025
Component: use-form Hook
Framework: Mantine
Documentation: https://mantine.dev/form/use-form/
