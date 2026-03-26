# Mantine - Form Field Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/form/use-form/
Status: ✅ Working
Version: 7.8.0+ (Current)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with detailed API reference, code examples, and integration patterns. Multiple related pages cover different aspects (validation, controlled/uncontrolled modes, input components).

## Component Definition
- **Core purpose**: Mantine provides form state management through the `useForm` hook, which is completely decoupled from UI components. This hook manages form values, validation, errors, and submission handling independently of the visual components.
- **Mental model**: Form logic (state, validation, errors) is separate from presentation (input components). The hook provides utility methods that connect to input components via props spreading, creating a clean separation of concerns.
- **Semantic meaning**: Forms represent data collection interfaces that maintain state, validate input, and handle submission. Form fields communicate their purpose through labels, provide feedback through errors, and guide users with descriptions.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `label="Name"`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label association | ✅ | Native | `label` prop on all input components (TextInput, Select, etc.). Also supports `Input.Wrapper` component with `label` prop for custom inputs. Automatically generates proper `id` and `for` attributes for accessibility. |
| Help text | ✅ | Native | `description` prop displays helper text below input. Rendered via `Input.Wrapper` system. Positioned below label, above input field. |
| Error messages | ✅ | Native | Dual error support: Boolean `error={true}` for styling only, or string/ReactNode `error="message"` for displaying validation feedback. Managed by `form.errors` object and `form.getInputProps()` automatically binds errors. |
| Required indicator | ✅ | Native | `withAsterisk` prop adds red asterisk to label. Also accessible via Styles API `required` element. No automatic validation - purely visual indicator. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Invalid/Error | ✅ | Native | Error state via `error` prop (boolean or message). `form.errors` object stores validation errors. `form.setFieldError()` for manual errors. Visual red border + error text below field. Use `withErrorStyles={false}` to show text without border styling. |
| Disabled | ✅ | Native | `disabled` prop on all input components prevents interaction. Standard HTML behavior. |
| Required | ✅ | Native | Visual indicator via `withAsterisk` prop. Validation via `form.validate` rules - not automatic. Requires explicit validation function. |
| Read-only | ✅ | Native | `readOnly` prop available on input components. Standard HTML readonly behavior. |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | Native | Default layout via `Input.Wrapper` - label on top, description below label, input below description, error below input. Standard form field pattern. |
| Horizontal layout | ✅ | Composed | Use Mantine layout components (`Group`, `Flex`, `Grid`) to arrange label and input horizontally. Not built-in to form components. |
| Inline layout | ✅ | Composed | Combine with `Group` or `Flex` components for inline field arrangements. Requires manual composition. |
| Label placement | ✅ | Native + Composed | Default: top placement via `Input.Wrapper`. Custom placement via `inputWrapperOrder` prop - can reorder label, input, error, description. For left/right placement, use layout components. |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ✅ | Native | `validate` object with field-specific rules. Each field gets validation function: `(value, values, path) => errorString \| null`. Supports nested field validation with dot notation (e.g., `user.email`). |
| Custom validation | ✅ | Native | Two patterns: (1) Object mapping field names to validation functions, (2) Single function receiving all values and returning errors object. Both support cross-field validation via `values` parameter. |
| Real-time validation | ✅ | Native | `validateInputOnChange` (validates on typing) and `validateInputOnBlur` (validates on focus loss). Can be boolean (all fields) or array of field paths (specific fields). `clearInputErrorOnChange` controls whether errors clear during typing. |
| Error message display | ✅ | Native | Automatic via `form.getInputProps('field')` which binds errors from `form.errors`. Manual control via `form.setFieldError()` and `form.clearErrors()`. Errors displayed below input field in red text. |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Form library integration | ✅ | Native | Mantine's own `useForm` hook from `@mantine/form`. Also integrates with external validators like Zod, Yup via custom validation functions. Schema validators work with `validate` function pattern. |
| Native HTML form | ✅ | Native | `form.onSubmit()` integrates with `<form onSubmit={...}>`. Supports standard form submission. `onSubmitPreventDefault` option controls `preventDefault()` behavior ('always', 'never', 'validation-failed'). |
| Controlled components | ✅ | Native | Controlled mode (pre-7.8.0 default): Form data in React state, `form.values` updates on every change, causes rerenders. Accessed via `form.values.fieldName`. |
| Uncontrolled components | ✅ | Native | Uncontrolled mode (recommended, default in 7.8.0+): Form data in ref, better performance, requires `key={form.key('field')}` prop. Access via `form.getValues()` instead of `form.values`. |

## Code Examples

### Basic Form with Validation
```tsx
import { useForm } from '@mantine/form';
import { TextInput, Checkbox, Button } from '@mantine/core';

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
        key={form.key('email')}
        label="Email"
        description="Enter your email address"
        placeholder="your@email.com"
        withAsterisk
        {...form.getInputProps('email')}
      />
      <Checkbox
        key={form.key('termsOfService')}
        label="I agree to terms of service"
        {...form.getInputProps('termsOfService', { type: 'checkbox' })}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Input.Wrapper for Custom Inputs
```tsx
import { Input } from '@mantine/core';

function CustomInput() {
  return (
    <Input.Wrapper
      label="Custom input label"
      description="Custom input description"
      error="Custom input error"
      withAsterisk
    >
      <Input placeholder="Custom input implementation" />
    </Input.Wrapper>
  );
}
```

### Nested Field Validation
```tsx
const form = useForm({
  initialValues: {
    user: {
      firstName: '',
      email: '',
    },
  },
  validate: {
    user: {
      firstName: (value) =>
        value.length < 2 ? 'First name must have at least 2 letters' : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'Invalid email',
    },
  },
});

// Usage
<TextInput
  key={form.key('user.firstName')}
  {...form.getInputProps('user.firstName')}
/>
```

### Real-time Validation
```tsx
const form = useForm({
  initialValues: { email: '' },
  validateInputOnChange: true, // or ['email'] for specific fields
  validateInputOnBlur: true,
  clearInputErrorOnChange: true,
  validate: {
    email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
  },
});
```

### Cross-field Validation
```tsx
const form = useForm({
  initialValues: {
    password: '',
    confirmPassword: '',
  },
  validate: {
    confirmPassword: (value, values) =>
      value !== values.password ? 'Passwords did not match' : null,
  },
});
```

### Dynamic List Fields
```tsx
import { TextInput, Button, Group } from '@mantine/core';

const form = useForm({
  initialValues: {
    fruits: [{ name: 'Apple' }, { name: 'Banana' }],
  },
});

// Render list
form.values.fruits.map((fruit, index) => (
  <Group key={index}>
    <TextInput
      {...form.getInputProps(`fruits.${index}.name`)}
      placeholder="Fruit name"
    />
    <Button onClick={() => form.removeListItem('fruits', index)}>
      Remove
    </Button>
  </Group>
));

// Add item
<Button onClick={() => form.insertListItem('fruits', { name: '' })}>
  Add Fruit
</Button>
```

### Custom Layout with inputWrapperOrder
```tsx
<Input.Wrapper
  label="Custom order"
  description="Description first"
  error="Error message"
  inputWrapperOrder={['description', 'label', 'input', 'error']}
>
  <Input />
</Input.Wrapper>
```

### Form Submission with Error Handling
```tsx
<form onSubmit={form.onSubmit(
  (values, event) => {
    // Success callback - validation passed
    console.log('Valid values:', values);
  },
  (validationErrors, values, event) => {
    // Error callback - validation failed
    console.log('Validation errors:', validationErrors);
    // Focus first invalid field
    const firstErrorPath = Object.keys(validationErrors)[0];
    form.getInputNode(firstErrorPath)?.focus();
  }
)}>
  {/* form inputs */}
</form>
```

[View Live Examples](https://mantine.dev/form/use-form/) *(official documentation)*

## Notable Features

### Hook-Based Architecture
- **Completely decoupled from UI**: `useForm` hook works independently of components, enabling use with any input library or custom inputs
- **Zero dependencies on @mantine/core**: Form logic can work standalone without Mantine UI components
- **Framework agnostic validation**: Can integrate with Zod, Yup, or any custom validation library

### Performance Optimizations
- **Uncontrolled mode by default (7.8.0+)**: Stores data in ref instead of state, preventing unnecessary rerenders
- **Key-based updates**: Requires `form.key('field')` in uncontrolled mode for selective component updates
- **Selective validation**: Can validate individual fields without revalidating entire form

### Advanced State Management
- **Nested field support**: Dot notation for deep paths (`user.profile.email`)
- **Array manipulation**: Specialized methods for list operations (insert, remove, reorder, replace)
- **Touched/dirty tracking**: `form.isTouched()` and `form.isDirty()` for granular state monitoring
- **State snapshots**: `form.getValues()` returns current state without triggering rerenders

### Flexible Validation System
- **Multiple validation patterns**: Object rules, function-based, or schema validators
- **Timing control**: Validate on change, blur, submit, or manually
- **Cross-field validation**: Access all form values in validation functions
- **formRootRule**: Special validation for collections while validating individual items
- **Async validation ready**: Validation functions can be async for API checks

### Input Integration Utilities
- **`form.getInputProps()`**: Bundles value, onChange, error, and other props for easy spreading
- **Type-specific props**: `getInputProps('field', { type: 'checkbox' })` for different input types
- **`form.key()`**: Generates stable keys for React list rendering and uncontrolled mode
- **Manual control**: Individual methods like `setFieldValue()`, `setFieldError()` for fine-grained control

### Input.Wrapper Standardization
- **Consistent layout system**: All Mantine inputs use `Input.Wrapper` for label, description, error positioning
- **Customizable order**: `inputWrapperOrder` prop reorders wrapper elements
- **Accessible by default**: Automatic `id`, `for`, `aria-describedby` associations
- **Reusable for custom inputs**: Can wrap any custom input implementation

## Research Notes

### Documentation Structure
- Main hook documentation at `/form/use-form/` with comprehensive API reference
- Separate pages for specific topics: validation, controlled/uncontrolled modes
- Input components documented separately (TextInput, Input, etc.) with form integration examples
- Clear migration guide from older versions (controlled to uncontrolled mode)

### Framework Philosophy
- **Separation of concerns**: Form logic completely separate from presentation layer
- **Progressive enhancement**: Start with basic forms, add validation and features as needed
- **Type safety**: Full TypeScript support with `UseFormReturnType<T>` for type-safe form passing
- **Performance first**: Uncontrolled mode default shows commitment to performance optimization

### Integration Observations
- `form.getInputProps()` is the primary integration method - spreads all necessary props
- Requires explicit `key={form.key('field')}` in uncontrolled mode - easy to forget
- Works seamlessly with Mantine's input components but also supports any custom input
- Schema validation (Zod/Yup) works through custom validation function, not direct integration

### Notable Patterns
- **Validation functions receive 3 arguments**: `(value, values, path)` enabling complex validation logic
- **Error handling on submit**: Optional second callback for validation failures
- **onSubmitPreventDefault options**: Granular control over form submission behavior
- **List operations**: First-class support for dynamic form arrays with specialized methods

### Potential Gotchas
- `form.values` may be stale in uncontrolled mode - must use `form.getValues()` instead
- Forgetting `form.key()` in uncontrolled mode breaks updates from `setFieldValue()`
- `withAsterisk` is visual only - doesn't enforce required validation automatically
- `clearInputErrorOnChange` defaults to `true`, which may mask errors during typing
