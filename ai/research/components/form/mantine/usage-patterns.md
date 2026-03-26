# Mantine - Form Usage Patterns

## Component URL
https://mantine.dev/form/use-form/
Status: ✅ Working
Version: Current (v7+ based on API patterns)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent documentation with complete API reference, detailed code examples, TypeScript support, and clear patterns for all major use cases. The documentation includes practical examples, multiple schema validation integrations, and extensive feature coverage.

## Component Definition
- **Core purpose**: To manage form state, validation, submission, and error handling in React applications without external dependencies, providing both controlled and uncontrolled modes for optimal performance
- **Mental model**: A centralized form state manager - users think of it as a "form brain" that handles all form logic (values, errors, validation, submission) while components focus on rendering. The hook returns methods and state that components consume via spread operators.
- **Semantic meaning**: Represents the complete state and behavior of a form, communicating the current validity, values, errors, and interaction state to the user through integrated input components

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., via useForm hook methods and configuration)
- **Composed**: Via composition/children (e.g., layout through Mantine Grid/Group components)
- **CSS-only**: Requires custom styling (no built-in support)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Field grouping | ✅ | Native | Nested object support with dot notation (e.g., `user.firstName`) for logical field grouping |
| Field labels | ✅ | Composed | Labels provided through Mantine input components (`<TextInput label="Email">`) |
| Help text | ✅ | Composed | Help text via Mantine component props (e.g., `description` prop on inputs) |
| Error messages | ✅ | Native | Built-in error state management via `form.errors`, `setFieldError()`, `clearFieldError()`, auto-integrated with inputs via `getInputProps()` |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ✅ | Native | Function-based validators in `validate` config object; returns `null` for valid or error string. Built-in validators: `isNotEmpty`, `isEmail`, `matches`, `isInRange`, `hasLength`, `matchesField`, `isJSONString`, `isNotEmptyHTML` |
| Custom validation | ✅ | Native | Any custom logic via functions receiving `(value, values, path)`, enables full access to form state for complex validation |
| Async validation | ⚠️ | CSS-only | No dedicated async validation API documented; must be implemented manually in submit handler or validation functions |
| Cross-field validation | ✅ | Native | Validation functions receive full `values` object as second parameter, enabling field comparison (e.g., password confirmation) |
| Validation triggers | ✅ | Native | Multiple validation methods: `validate()` all fields, `validateField('path')` single field, `isValid()` check without setting errors. Configurable timing: `validateInputOnChange`, `validateInputOnBlur`, `clearInputErrorOnChange` |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled values | ✅ | Native | Default mode stores values in React state, `form.values` always current, causes rerenders on changes |
| Uncontrolled values | ✅ | Native | `mode: 'uncontrolled'` stores values in ref for performance, requires `form.key()` on inputs, use `form.getValues()` to access |
| Initial values | ✅ | Native | `initialValues` config, `setInitialValues()` to update reference, `initialize()` for one-time data loading, `initialErrors`, `initialTouched`, `initialDirty` for initial state |
| Dynamic fields | ✅ | Native | Comprehensive list operations: `insertListItem(path, item, index?)`, `removeListItem(path, index)`, `replaceListItem(path, index, item)`, `reorderListItem(path, {from, to})` for array manipulation |
| Field dependencies | ✅ | Native | `form.watch(path, callback)` for field watching, `onValuesChange` for global changes, validation functions access all values, `cascadeUpdates` option for nested watchers |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal layout | ✅ | Composed | Via Mantine's `Group` component with `justify` and `align` props for horizontal field arrangement |
| Vertical layout | ✅ | Composed | Default stacking behavior via `Stack` component or natural block layout of inputs |
| Inline layout | ✅ | Composed | Via `Group` with `grow` or `Flex` components for inline fields with flexible spacing |
| Grid layout | ✅ | Composed | Via Mantine's `Grid` component with responsive column system (`Grid.Col` with `span` prop) |
| Responsive layout | ✅ | Composed | Mantine's responsive prop system with breakpoints (e.g., `span={{ base: 12, md: 6 }}`) |

## Submission Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Submit handling | ✅ | Native | `form.onSubmit(successHandler, errorHandler)` with automatic validation, receives `(values, event)`. `onSubmitPreventDefault` option: 'always' (default), 'never', or 'validation-failed' |
| Loading state | ✅ | Native | `form.submitting` automatically managed during async submit, manual control via `form.setSubmitting(boolean)` |
| Error handling | ✅ | Native | Error callback receives `(validationErrors, values, event)`, manual error setting via `setErrors()`, `setFieldError()`, `getInputNode()` for focus management |
| Success handling | ✅ | Native | Success callback receives validated `values` and `event`, can perform async operations, automatic `submitting` state management |
| Reset functionality | ✅ | Native | `form.reset()` resets to initial values and clears errors/touched/dirty, `form.resetField(path)` for single field, `form.onReset` handler for form reset events |

## Code Examples

### Primary Usage Example
```typescript
import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput
        withAsterisk
        label="Email"
        placeholder="your@email.com"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <Checkbox
        mt="md"
        label="I agree to sell my privacy"
        key={form.key('termsOfService')}
        {...form.getInputProps('termsOfService', { type: 'checkbox' })}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
```
[View Live](https://mantine.dev/form/use-form/) *(documentation has interactive demos)*

### Nested Field Handling
```typescript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    user: {
      firstName: 'John',
      lastName: 'Doe',
    },
  },
  validate: {
    user: {
      firstName: (value) =>
        value.length < 2
          ? 'First name must have at least 2 letters'
          : null,
    },
  },
});

// Set nested field value
form.setFieldValue('user.firstName', 'Jane');

// Validate nested field
form.validateField('user.firstName');

// Usage in component
<TextInput
  label="First Name"
  key={form.key('user.firstName')}
  {...form.getInputProps('user.firstName')}
/>
```

### Dynamic List Management
```typescript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    fruits: [
      { name: 'Banana', available: true },
      { name: 'Orange', available: false },
    ],
  },
});

// Insert list item (at end or specific position)
form.insertListItem('fruits', { name: 'Apple', available: true });
form.insertListItem('fruits', { name: 'Orange', available: true }, 1);

// Remove list item
form.removeListItem('fruits', 1);

// Replace list item
form.replaceListItem('fruits', 1, { name: 'Apple', available: true });

// Reorder list items
form.reorderListItem('fruits', { from: 1, to: 0 });
```

### Cross-Field Validation
```typescript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    password: '',
    confirmPassword: '',
  },
  validate: {
    password: (value) => (value.length < 8 ? 'Password too short' : null),
    confirmPassword: (value, values) =>
      value !== values.password ? 'Passwords do not match' : null,
  },
});
```

### Submission with Error Handling
```typescript
const handleSubmit = form.onSubmit(
  (values, event) => {
    // Success handler - receives validated values
    console.log('Submit success:', values, event);
  },
  (validationErrors, values, event) => {
    // Error handler - receives validation errors
    console.log('Submit failed:', validationErrors, values, event);

    // Focus first invalid field
    const firstErrorPath = Object.keys(validationErrors)[0];
    form.getInputNode(firstErrorPath)?.focus();
  }
);

<form onSubmit={handleSubmit}>
  {/* form fields */}
</form>
```

### Value Transformation
```typescript
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

### Watching Value Changes
```typescript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: { email: '', password: '' },

  // Global change handler
  onValuesChange: (values, previous) => {
    console.log('Current values:', values);
    console.log('Previous values:', previous);
  },
});

// Watch specific field
form.watch('email', ({ previousValue, value, touched, dirty }) => {
  console.log('Email changed:', { previousValue, value, touched, dirty });
});
```

### Schema Validation (Zod)
```typescript
import { z } from 'zod';
import { zodResolver } from 'mantine-form-zod-resolver';

const schema = z.object({
  name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
  email: z.string().email({ message: 'Invalid email' }),
  age: z.number().min(18, { message: 'You must be at least 18' }),
});

const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    email: '',
    age: 16,
  },
  validate: zodResolver(schema),
});
```

### Built-in Validators
```typescript
import {
  isNotEmpty,
  isEmail,
  hasLength,
  matchesField,
  isInRange,
} from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    email: '',
    age: 0,
    password: '',
    confirmPassword: '',
  },
  validate: {
    name: hasLength({ min: 2, max: 50 }, 'Name must be 2-50 characters'),
    email: isEmail('Invalid email address'),
    age: isInRange({ min: 18, max: 120 }, 'Age must be 18-120'),
    password: hasLength({ min: 8 }, 'Password must be at least 8 characters'),
    confirmPassword: matchesField('password', 'Passwords do not match'),
  },
});
```

### Type-Safe Form Components
```typescript
import { TextInput } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';

interface FormValues {
  name: string;
  occupation: string;
}

function NameInput({
  form,
}: {
  form: UseFormReturnType<FormValues>;
}) {
  return (
    <TextInput
      label="Name"
      key={form.key('name')}
      {...form.getInputProps('name')}
    />
  );
}

function Demo() {
  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: { name: '', occupation: '' },
  });
  return <NameInput form={form} />;
}
```

### Form Actions (Remote Control)
```typescript
// In form component
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

// Control form from anywhere
registrationFormActions.setFieldValue('email', 'new@example.com');
registrationFormActions.validate();
registrationFormActions.reset();
```

### Async Submission with Loading State
```typescript
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

## Notable Features

### Zero Dependencies
- Does not depend on any external form libraries
- Can be used with or without `@mantine/core` input components
- Standalone form state management solution

### Performance-Optimized Uncontrolled Mode
- `mode: 'uncontrolled'` stores values in ref instead of state
- Eliminates unnecessary rerenders during typing
- Recommended for all forms, especially large ones
- Requires `form.key()` on inputs for proper updates

### Comprehensive State Tracking
- **Touched state**: Track user interaction with `isTouched()`, `setTouched()`, `resetTouched()`
- **Dirty state**: Detect modifications with `isDirty()`, `setDirty()`, `resetDirty()`
- **Submitting state**: Automatic async submission tracking with `form.submitting`

### Nested and List Field Support
- Deep path support with dot notation (`user.address.zip`)
- Full suite of list operations (insert, remove, replace, reorder)
- Works seamlessly with nested validation
- Array field validation with `*` wildcard syntax

### Multiple Schema Validation Libraries
- Zod integration via `zodResolver`
- Yup integration via `yupResolver`
- Joi integration via `joiResolver`
- Valibot integration via `valibotResolver`
- Superstruct integration via `superstructResolver`
- Consistent resolver API across all libraries

### Built-in Validators
Provides ready-to-use validators:
- `isNotEmpty`, `isEmail`, `matches`
- `isInRange`, `hasLength`, `matchesField`
- `isJSONString`, `isNotEmptyHTML`

### TypeScript Integration
- Full TypeScript support with generics
- `UseFormReturnType<T>` for type-safe form props
- Type inference from `initialValues`
- `TransformedValues<T>` type for transformed values

### Value Transformation
- `transformValues` config for submission value transformation
- `getTransformedValues()` method with optional custom values
- Useful for combining fields, type conversion, computed values

### Flexible Validation Timing
- `validateInputOnChange`: Validate on every keystroke
- `validateInputOnBlur`: Validate when focus leaves field
- `clearInputErrorOnChange`: Clear errors as user types
- Per-field configuration with array syntax

### Field Watching System
- `form.watch(path, callback)` for field-specific watchers
- `onValuesChange` global change handler
- `cascadeUpdates` option for nested object watchers
- Receives `{ previousValue, value, touched, dirty }` payload

### Form Actions System
- Remote form control via `createFormActions(name)`
- Control forms from anywhere in application
- Useful for modal forms, multi-step wizards
- Supports all form methods

### Enhanced getInputProps
- `enhanceGetInputProps` for global input customization
- Access to form state, field path, errors
- Useful for conditional disabled states, custom styling
- Automatic ARIA attributes for accessibility

### Input Integration Helper
- `form.key(path)` provides unique keys for React list rendering
- `getInputProps(path, options?)` spreads all necessary props
- Automatic error and value binding
- Supports `type: 'checkbox'` option for boolean inputs
- `withError` and `withFocus` options

### Focus Management
- `getInputNode(path)` returns DOM node for field
- Enables programmatic focus and scroll
- Useful for focusing first error on submit failure

### Initialization System
- `initialize(values)` for one-time data loading
- `setInitialValues(values)` for updating reference
- `initialErrors`, `initialTouched`, `initialDirty` options
- Useful for forms loaded from API

## Research Notes

### Accessing the Documentation
- Documentation was accessible and comprehensive
- Well-organized with interactive examples
- Clear API reference with TypeScript signatures
- Multiple integration guides (schema validation, Mantine components)

### Framework Approach
- React-specific hook (not framework-agnostic)
- Designed for seamless Mantine component integration
- Can work independently of Mantine UI components
- Strong emphasis on TypeScript and type safety
- Performance-first with uncontrolled mode

### Notable Design Decisions
- **Uncontrolled mode as recommended approach**: Unique performance optimization not common in other form libraries
- **form.key() requirement**: Necessary trade-off for uncontrolled mode performance
- **Nested path string syntax**: Simpler API than object references, enables dynamic paths
- **Separation of touched/dirty state**: More granular control than combined "modified" state
- **List operations built-in**: No need for additional libraries like FieldArray
- **Resolver pattern for schemas**: Consistent API across multiple validation libraries
- **Form actions system**: Enables remote control patterns for complex UIs

### Comparison to Other Libraries
- **Zero dependencies**: Unlike React Hook Form (requires additional packages for some features)
- **Built-in uncontrolled mode**: More performant than typical controlled approaches
- **No built-in async validation**: Must be implemented manually (unlike Formik)
- **Form actions system**: Unique feature for remote control (not in React Hook Form or Formik)
- **Watch system with cascade**: More sophisticated than basic field watching
- **Multiple schema resolvers**: More flexible than libraries locked to one validation approach

### Missing or Undocumented Features
- Async validation not documented (may require custom implementation)
- No built-in debounce/throttle for validation
- Field-level `asyncValidate` function not mentioned
- No documented field masking/formatting utilities
- No built-in file upload progress tracking

### Best Use Cases
- Large forms where performance matters (use uncontrolled mode)
- Forms with complex nested structures
- Multi-step wizards (use form actions)
- Forms with dynamic fields
- Forms requiring schema validation with TypeScript
- Mantine UI applications (seamless integration)
- Forms needing remote control from other components
