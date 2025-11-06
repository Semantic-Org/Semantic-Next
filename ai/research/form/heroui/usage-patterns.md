# HeroUI Form Component - Usage Patterns

**Component:** Form
**Library:** HeroUI
**Documentation URL:** https://www.heroui.com/docs/components/form
**Research Date:** 2025-11-06

---

## Component Overview

The Form component is a container wrapper for form input elements and submission controls that provides integrated validation message support. Built on the native HTML `<form>` element, it enhances standard form functionality with modern React patterns while maintaining web platform fundamentals.

**Key Characteristics:**
- Native `<form>` element foundation
- Dual validation modes (native browser validation and ARIA-based real-time validation)
- Server-side validation error integration
- Accessibility-first design with ARIA landmark support
- Framework-agnostic but React-focused implementation
- Works with standard HTML input elements and HeroUI input components

**Installation:**
```bash
npm install @heroui/form

# Or via CLI
npx heroui-cli@latest add form
```

**Import:**
```tsx
import {Form} from "@heroui/react";
// or
import {Form} from "@heroui/form";
```

---

## Core Patterns

### Basic Form Structure

```tsx
<Form>
  <Input name="username" label="Username" isRequired />
  <Input name="email" label="Email" type="email" isRequired />
  <Button type="submit">Submit</Button>
</Form>
```

### Form with Validation Behavior

```tsx
<Form validationBehavior="aria">
  <Input
    name="username"
    label="Username"
    isRequired
    minLength={3}
  />
  <Button type="submit">Submit</Button>
</Form>
```

### Form with Server-Side Errors

```tsx
<Form validationErrors={{
  username: "This username is already taken",
  email: "Invalid email format"
}}>
  <Input name="username" label="Username" />
  <Input name="email" label="Email" />
  <Button type="submit">Submit</Button>
</Form>
```

### Form with Action and Method

```tsx
<Form
  action="/api/submit"
  method="post"
  encType="multipart/form-data"
>
  <Input name="file" type="file" />
  <Button type="submit">Upload</Button>
</Form>
```

---

## Props & Configuration

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Form content including inputs and buttons |
| `validationBehavior` | `'native' \| 'aria'` | `"native"` | Determines validation strategy |
| `validationErrors` | `Record<string, string \| string[]>` | - | Server-side validation errors mapped to field names |
| `action` | `string \| FormHTMLAttributes` | - | Form submission endpoint or action |
| `encType` | `'application/x-www-form-urlencoded' \| 'multipart/form-data' \| 'text/plain'` | - | Content encoding type for submission |
| `method` | `'get' \| 'post' \| 'dialog'` | - | HTTP method for submission |
| `target` | `'_blank' \| '_self' \| '_parent' \| '_top'` | - | Where to display response |
| `autoComplete` | `'off' \| 'on'` | - | Browser autofill behavior control |
| `autoCapitalize` | `'off' \| 'none' \| 'on' \| 'sentences' \| 'words' \| 'characters'` | - | Text capitalization for mobile keyboards |
| `className` | `string` | - | CSS class names for styling |
| `style` | `CSSProperties` | - | Inline styles object |

### Event Handler Props

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `FormEventHandler` | Triggered by Enter key or submit button click |
| `onReset` | `FormEventHandler` | Triggered by reset button press |

### HTML Form Attributes Support

The Form component supports standard HTML form attributes:
- `action` - URL or function to handle submission
- `method` - HTTP method (get, post, dialog)
- `encType` - Encoding type for form data
- `target` - Target for form response
- `autoComplete` - Browser autofill control
- `autoCapitalize` - Mobile keyboard capitalization

---

## Validation Patterns

### Native Validation (Default Mode)

**Behavior:** Prevents form submission when fields contain invalid or missing required values. Uses the browser's constraint validation API.

**Usage:**
```tsx
<Form>
  <Input
    name="username"
    label="Username"
    isRequired
    minLength={3}
    maxLength={20}
  />
  <Input
    name="email"
    label="Email"
    type="email"
    isRequired
  />
  <Button type="submit">Submit</Button>
</Form>
```

**Features:**
- Blocks form submission on validation failure
- Browser-native validation messages
- Works with HTML5 input types and attributes
- `isRequired`, `minLength`, `maxLength`, `pattern` props

### ARIA Validation Mode

**Behavior:** Displays real-time validation errors without blocking form submission. Errors appear as users type or blur fields.

**Usage:**
```tsx
<Form validationBehavior="aria">
  <Input
    name="username"
    label="Username"
    isRequired
    minLength={3}
  />
  <Button type="submit">Submit</Button>
</Form>
```

**Features:**
- Non-blocking validation
- Real-time error display
- Accessible error announcements
- Form can still be submitted with errors

**Field-Level Override:**
```tsx
<Form validationBehavior="native">
  <Input
    name="username"
    label="Username"
    validationBehavior="aria"  // Override for this field
    isRequired
  />
  <Input
    name="password"
    label="Password"
    isRequired  // Uses form's native validation
  />
</Form>
```

### Custom Validation Functions

**Pattern:** Fields accept a `validate` prop that receives the current value and returns error messages or null.

```tsx
<Input
  name="username"
  label="Username"
  validate={(value) => {
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (value === "admin") {
      return "Username 'admin' is not available";
    }
    return null;
  }}
/>
```

**Multiple Validation Rules:**
```tsx
<Input
  name="password"
  label="Password"
  validate={(value) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain an uppercase letter";
    }
    if (!/[0-9]/.test(value)) {
      return "Password must contain a number";
    }
    return null;
  }}
/>
```

### Server-Side Validation

**Pattern:** Pass validation errors from server responses through the `validationErrors` prop.

```tsx
const [serverErrors, setServerErrors] = useState({});

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  const response = await fetch('/api/submit', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();

  if (result.errors) {
    setServerErrors(result.errors);
  }
};

return (
  <Form onSubmit={handleSubmit} validationErrors={serverErrors}>
    <Input name="username" label="Username" />
    <Input name="email" label="Email" />
    <Button type="submit">Submit</Button>
  </Form>
);
```

**Error Format:**
```tsx
// Single error per field
validationErrors={{
  username: "Username already taken",
  email: "Invalid email format"
}}

// Multiple errors per field
validationErrors={{
  username: ["Too short", "Contains invalid characters"],
  password: ["Too weak", "Must contain numbers"]
}}
```

**Auto-Clear Behavior:** Server errors automatically clear when users modify the corresponding field.

---

## Layout Patterns

### Vertical Form Layout (Default)

```tsx
<Form className="flex flex-col gap-4">
  <Input name="name" label="Full Name" />
  <Input name="email" label="Email" />
  <Input name="phone" label="Phone" />
  <Button type="submit">Submit</Button>
</Form>
```

### Horizontal Form Layout

```tsx
<Form className="flex flex-row gap-4 items-end">
  <Input name="search" label="Search" />
  <Button type="submit">Search</Button>
</Form>
```

### Grid Layout

```tsx
<Form className="grid grid-cols-2 gap-4">
  <Input name="firstName" label="First Name" />
  <Input name="lastName" label="Last Name" />
  <Input name="email" label="Email" className="col-span-2" />
  <Input name="phone" label="Phone" />
  <Input name="zipCode" label="ZIP Code" />
  <Button type="submit" className="col-span-2">Submit</Button>
</Form>
```

### Multi-Section Forms

```tsx
<Form className="space-y-6">
  <div className="space-y-4">
    <h3>Personal Information</h3>
    <Input name="firstName" label="First Name" />
    <Input name="lastName" label="Last Name" />
  </div>

  <div className="space-y-4">
    <h3>Contact Information</h3>
    <Input name="email" label="Email" />
    <Input name="phone" label="Phone" />
  </div>

  <Button type="submit">Submit</Button>
</Form>
```

---

## Field Management

### Form Data Collection

**Pattern:** Use native FormData API to collect form values.

```tsx
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  // Get individual values
  const username = formData.get('username');
  const email = formData.get('email');

  // Convert to object
  const data = Object.fromEntries(formData);

  console.log(data);
  // { username: "...", email: "..." }
};

<Form onSubmit={handleSubmit}>
  <Input name="username" label="Username" />
  <Input name="email" label="Email" />
  <Button type="submit">Submit</Button>
</Form>
```

### Controlled Components

**Pattern:** Use React state to control form field values.

```tsx
const [formData, setFormData] = useState({
  username: '',
  email: ''
});

const handleChange = (name: string, value: string) => {
  setFormData(prev => ({ ...prev, [name]: value }));
};

<Form>
  <Input
    name="username"
    label="Username"
    value={formData.username}
    onChange={(e) => handleChange('username', e.target.value)}
  />
  <Input
    name="email"
    label="Email"
    value={formData.email}
    onChange={(e) => handleChange('email', e.target.value)}
  />
  <Button type="submit">Submit</Button>
</Form>
```

### Field Types Support

The Form component works with various field types:

```tsx
<Form>
  {/* Text inputs */}
  <Input name="text" type="text" label="Text" />
  <Input name="email" type="email" label="Email" />
  <Input name="password" type="password" label="Password" />
  <Input name="number" type="number" label="Number" />
  <Input name="tel" type="tel" label="Phone" />
  <Input name="url" type="url" label="Website" />

  {/* Textarea */}
  <Textarea name="description" label="Description" />

  {/* Select */}
  <Select name="country" label="Country">
    <SelectItem key="us">United States</SelectItem>
    <SelectItem key="ca">Canada</SelectItem>
  </Select>

  {/* Checkbox */}
  <Checkbox name="terms">I agree to terms</Checkbox>

  {/* Radio */}
  <RadioGroup name="plan" label="Select Plan">
    <Radio value="free">Free</Radio>
    <Radio value="pro">Pro</Radio>
  </RadioGroup>

  {/* File upload */}
  <Input name="file" type="file" label="Upload" />
</Form>
```

### Field Name Mapping

**Pattern:** Use descriptive names that map to server-side expectations.

```tsx
<Form>
  <Input name="user[firstName]" label="First Name" />
  <Input name="user[lastName]" label="Last Name" />
  <Input name="user[email]" label="Email" />
</Form>
```

---

## Submission Patterns

### Basic Form Submission

```tsx
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);

  console.log('Form submitted:', data);
};

<Form onSubmit={handleSubmit}>
  <Input name="username" label="Username" />
  <Button type="submit">Submit</Button>
</Form>
```

### Async Form Submission

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const formData = new FormData(e.currentTarget);
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};

<Form onSubmit={handleSubmit}>
  <Input name="username" label="Username" />
  <Button type="submit" isLoading={isLoading}>
    Submit
  </Button>
</Form>
```

### Form Reset

```tsx
const formRef = useRef<HTMLFormElement>(null);

const handleReset = () => {
  formRef.current?.reset();
};

<Form ref={formRef}>
  <Input name="username" label="Username" />
  <div className="flex gap-2">
    <Button type="submit">Submit</Button>
    <Button type="reset" onPress={handleReset}>Reset</Button>
  </div>
</Form>
```

### Programmatic Submission

```tsx
const formRef = useRef<HTMLFormElement>(null);

const handleExternalSubmit = () => {
  formRef.current?.requestSubmit();
};

<>
  <Form ref={formRef}>
    <Input name="username" label="Username" />
  </Form>
  <Button onPress={handleExternalSubmit}>Submit Form</Button>
</>
```

### Submit Button States

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

<Form>
  <Input name="username" label="Username" />
  <Button
    type="submit"
    isLoading={isSubmitting}
    isDisabled={isSubmitting}
  >
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </Button>
</Form>
```

### Submission with FormData

```tsx
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  // Add additional data
  formData.append('timestamp', Date.now().toString());

  await fetch('/api/submit', {
    method: 'POST',
    body: formData
  });
};
```

---

## State Management

### Form-Level State

**Pattern:** Use React state hooks to manage form-level data and status.

```tsx
const [formState, setFormState] = useState({
  values: { username: '', email: '' },
  errors: {},
  isSubmitting: false,
  isDirty: false
});

const handleChange = (name: string, value: string) => {
  setFormState(prev => ({
    ...prev,
    values: { ...prev.values, [name]: value },
    isDirty: true
  }));
};

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setFormState(prev => ({ ...prev, isSubmitting: true }));

  try {
    await submitForm(formState.values);
    setFormState(prev => ({ ...prev, isDirty: false }));
  } catch (error) {
    setFormState(prev => ({
      ...prev,
      errors: error.validationErrors
    }));
  } finally {
    setFormState(prev => ({ ...prev, isSubmitting: false }));
  }
};
```

### Uncontrolled Forms (Recommended)

**Pattern:** Let the DOM manage field state, collect data on submit.

```tsx
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);

  // Process data
  submitToServer(data);
};

<Form onSubmit={handleSubmit}>
  <Input name="username" label="Username" defaultValue="" />
  <Input name="email" label="Email" defaultValue="" />
  <Button type="submit">Submit</Button>
</Form>
```

### Controlled Forms

**Pattern:** Explicitly manage each field's value with React state.

```tsx
const [values, setValues] = useState({
  username: '',
  email: ''
});

const updateField = (name: string, value: string) => {
  setValues(prev => ({ ...prev, [name]: value }));
};

<Form>
  <Input
    name="username"
    label="Username"
    value={values.username}
    onChange={(e) => updateField('username', e.target.value)}
  />
  <Input
    name="email"
    label="Email"
    value={values.email}
    onChange={(e) => updateField('email', e.target.value)}
  />
  <Button type="submit">Submit</Button>
</Form>
```

### Dirty State Tracking

```tsx
const [isDirty, setIsDirty] = useState(false);

const handleChange = () => {
  if (!isDirty) setIsDirty(true);
};

<Form>
  <Input
    name="username"
    label="Username"
    onChange={handleChange}
  />
  {isDirty && <p>You have unsaved changes</p>}
  <Button type="submit">Submit</Button>
</Form>
```

### Form State Persistence

```tsx
const [formData, setFormData] = useState(() => {
  const saved = localStorage.getItem('formData');
  return saved ? JSON.parse(saved) : { username: '', email: '' };
});

useEffect(() => {
  localStorage.setItem('formData', JSON.stringify(formData));
}, [formData]);

<Form>
  <Input
    name="username"
    value={formData.username}
    onChange={(e) => setFormData(prev => ({
      ...prev,
      username: e.target.value
    }))}
  />
</Form>
```

---

## Accessibility

### ARIA Landmark

The Form component creates a `<form>` element which is automatically recognized as an ARIA landmark, helping screen reader users navigate the page structure.

### Validation Announcements

**ARIA Validation Mode:** Errors are announced to screen readers in real-time using ARIA live regions.

```tsx
<Form validationBehavior="aria">
  <Input name="username" label="Username" isRequired />
</Form>
```

### Required Field Indication

```tsx
<Form>
  <Input
    name="username"
    label="Username"
    isRequired
    description="Required field"
  />
</Form>
```

### Error Message Association

Error messages are properly associated with their fields using ARIA attributes:

```tsx
<Input
  name="email"
  label="Email"
  errorMessage="Invalid email format"
  isInvalid
/>
// Automatically adds aria-describedby and aria-invalid
```

### Keyboard Navigation

- Tab: Move between form fields
- Enter: Submit form (when focus is on input or submit button)
- Escape: Clear field (browser default)
- Space: Toggle checkboxes/radio buttons

### Focus Management

```tsx
const firstFieldRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  firstFieldRef.current?.focus();
}, []);

<Form>
  <Input ref={firstFieldRef} name="username" label="Username" />
  <Input name="email" label="Email" />
</Form>
```

### Form Labels

All fields should have proper labels for screen reader support:

```tsx
<Form>
  <Input name="username" label="Username" />  {/* Accessible */}
  <Input name="search" placeholder="Search" />  {/* Not accessible */}
  <Input name="search" label="Search" placeholder="Enter term" />  {/* Accessible */}
</Form>
```

### Autocomplete Attributes

Enable browser autofill for better accessibility and UX:

```tsx
<Form autoComplete="on">
  <Input name="name" label="Name" autoComplete="name" />
  <Input name="email" label="Email" autoComplete="email" />
  <Input name="tel" label="Phone" autoComplete="tel" />
  <Input name="address" label="Address" autoComplete="street-address" />
</Form>
```

---

## Framework-Specific Features

### React Foundation

The Form component is built specifically for React and leverages React patterns:

- React event handlers (`onSubmit`, `onReset`)
- React refs for form element access
- React state for controlled components
- React context for potential form-level state sharing

### HeroUI Component Integration

Works seamlessly with all HeroUI input components:

```tsx
<Form>
  <Input />
  <Textarea />
  <Select />
  <Checkbox />
  <Radio />
  <Switch />
  <Slider />
</Form>
```

### Native HTML Support

Also works with standard HTML form elements:

```tsx
<Form>
  <input type="text" name="username" />
  <textarea name="description" />
  <select name="country">
    <option>US</option>
  </select>
  <input type="checkbox" name="terms" />
</Form>
```

### FormData API Integration

Leverages the native FormData API for data collection:

```tsx
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  // Native API methods
  formData.get('username');
  formData.getAll('hobbies');
  formData.has('email');
  formData.append('extra', 'value');
};
```

### Constraint Validation API

Native validation mode uses the browser's Constraint Validation API:

- `validity.valid` - Overall validity state
- `validity.valueMissing` - Required field empty
- `validity.typeMismatch` - Type doesn't match (e.g., invalid email)
- `validity.patternMismatch` - Pattern attribute mismatch
- `validity.tooLong` / `validity.tooShort` - Length constraints

### React Aria Foundation

While not explicitly stated in the documentation, HeroUI components are typically built on React Aria, suggesting the Form component likely leverages:

- `useForm` hook
- ARIA form field management
- Keyboard interactions
- Focus management utilities

### TypeScript Support

Fully typed with TypeScript support:

```tsx
import type { FormEvent } from 'react';
import { Form } from '@heroui/react';

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
};

<Form onSubmit={handleSubmit}>
  {/* Typed props and event handlers */}
</Form>
```

### Framework Compatibility

Compatible with major React frameworks:

- **Next.js** - Works with App Router and Pages Router
- **Vite** - Standard React integration
- **Remix** - Form actions and loaders
- **Astro** - Client-side React islands
- **Laravel** - Inertia.js integration

---

## Implementation Notes

### Design Philosophy

1. **Web Platform First:** Built on native `<form>` element, respecting HTML semantics
2. **Progressive Enhancement:** Works with standard HTML forms, enhanced with React
3. **Flexible Validation:** Multiple validation strategies for different use cases
4. **Developer Choice:** Uncontrolled forms by default, controlled when needed
5. **Accessibility Baked In:** ARIA support and semantic HTML structure

### Best Practices

#### Use Uncontrolled Forms When Possible

```tsx
// Preferred - simpler, better performance
<Form onSubmit={(e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  submitData(Object.fromEntries(data));
}}>
  <Input name="username" />
</Form>

// Use controlled only when you need real-time state access
const [username, setUsername] = useState('');
<Input value={username} onChange={e => setUsername(e.target.value)} />
```

#### Choose Appropriate Validation Mode

- **Native validation** for simple forms, standard validation
- **ARIA validation** for multi-step forms, complex UX
- **Custom validation** for business logic rules
- **Server validation** for backend constraints

#### Handle Errors Gracefully

```tsx
const [errors, setErrors] = useState({});

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});  // Clear previous errors

  try {
    await submitForm();
  } catch (error) {
    if (error.validationErrors) {
      setErrors(error.validationErrors);
    }
  }
};

<Form validationErrors={errors}>
  {/* Fields */}
</Form>
```

#### Provide User Feedback

```tsx
const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

<Form>
  <Input name="email" />
  <Button type="submit" isLoading={status === 'submitting'}>
    Submit
  </Button>
  {status === 'success' && <p>Form submitted successfully!</p>}
  {status === 'error' && <p>An error occurred. Please try again.</p>}
</Form>
```

### Performance Considerations

1. **Uncontrolled forms** perform better (less re-renders)
2. **FormData API** is efficient for data collection
3. **Native validation** has no JavaScript overhead
4. **Avoid unnecessary state** - only track what you need

### Common Patterns

#### Login Form

```tsx
<Form onSubmit={handleLogin}>
  <Input
    name="email"
    label="Email"
    type="email"
    autoComplete="email"
    isRequired
  />
  <Input
    name="password"
    label="Password"
    type="password"
    autoComplete="current-password"
    isRequired
  />
  <Checkbox name="remember">Remember me</Checkbox>
  <Button type="submit">Log In</Button>
</Form>
```

#### Registration Form

```tsx
<Form validationBehavior="aria">
  <Input name="username" label="Username" isRequired minLength={3} />
  <Input name="email" label="Email" type="email" isRequired />
  <Input
    name="password"
    label="Password"
    type="password"
    isRequired
    minLength={8}
    validate={(value) => {
      if (!/[A-Z]/.test(value)) return "Must contain uppercase";
      if (!/[0-9]/.test(value)) return "Must contain number";
      return null;
    }}
  />
  <Checkbox name="terms" isRequired>
    I agree to the terms and conditions
  </Checkbox>
  <Button type="submit">Create Account</Button>
</Form>
```

#### Search Form

```tsx
<Form className="flex gap-2" onSubmit={handleSearch}>
  <Input
    name="query"
    label="Search"
    placeholder="Enter search term"
  />
  <Button type="submit">Search</Button>
</Form>
```

#### Multi-Step Form

```tsx
const [step, setStep] = useState(1);

<Form validationBehavior="aria">
  {step === 1 && (
    <>
      <Input name="firstName" label="First Name" isRequired />
      <Input name="lastName" label="Last Name" isRequired />
      <Button onPress={() => setStep(2)}>Next</Button>
    </>
  )}
  {step === 2 && (
    <>
      <Input name="email" label="Email" type="email" isRequired />
      <Input name="phone" label="Phone" type="tel" />
      <Button onPress={() => setStep(1)}>Back</Button>
      <Button type="submit">Submit</Button>
    </>
  )}
</Form>
```

### Limitations & Considerations

1. **No Built-In Form State Library:** Unlike libraries like React Hook Form or Formik, HeroUI Form is a simpler wrapper - you manage state yourself
2. **Validation Errors Object Format:** The `validationErrors` prop expects a specific format (field name to message mapping)
3. **Server Error Clearing:** Errors clear on field change - ensure this aligns with your UX needs
4. **File Upload Handling:** Use `encType="multipart/form-data"` for file uploads
5. **Browser Support:** Native validation behavior varies across browsers

### Integration with Form Libraries

While HeroUI Form can be used standalone, it can also work with popular form libraries:

**React Hook Form:**
```tsx
import { useForm } from 'react-hook-form';

const { register, handleSubmit } = useForm();

<Form onSubmit={handleSubmit(onSubmit)}>
  <Input {...register('username')} label="Username" />
  <Button type="submit">Submit</Button>
</Form>
```

**Formik:**
```tsx
import { Formik } from 'formik';

<Formik initialValues={{ username: '' }} onSubmit={handleSubmit}>
  {({ values, handleChange }) => (
    <Form>
      <Input
        name="username"
        label="Username"
        value={values.username}
        onChange={handleChange}
      />
      <Button type="submit">Submit</Button>
    </Form>
  )}
</Formik>
```

### Testing Considerations

```tsx
// Testing form submission
const handleSubmit = jest.fn((e) => e.preventDefault());

render(
  <Form onSubmit={handleSubmit}>
    <Input name="username" />
    <Button type="submit">Submit</Button>
  </Form>
);

fireEvent.submit(screen.getByRole('form'));
expect(handleSubmit).toHaveBeenCalled();
```

### Migration Notes

**From Standard HTML Forms:**
- Replace `<form>` with `<Form>`
- Add `validationBehavior` prop for enhanced validation
- Use `validationErrors` prop for server errors
- Form submission and data collection patterns remain the same

**From Other UI Libraries:**
- Most form patterns translate directly
- Validation approach may differ (native vs custom)
- Check field component prop compatibility
- Server error handling may need adjustment

---

## Summary

The HeroUI Form component provides a lightweight, accessible wrapper around native HTML forms with enhanced validation capabilities. It embraces web standards while offering modern React patterns and flexible validation strategies.

**Key Strengths:**
- Native HTML foundation with progressive enhancement
- Dual validation modes (native and ARIA)
- Server-side error integration
- Minimal abstraction over platform primitives
- Excellent accessibility support
- Works with controlled and uncontrolled patterns

**When to Use:**
- Any form submission requirement
- Forms needing flexible validation strategies
- Accessible form implementation
- Integration with server-side validation
- Standard CRUD operations

**When to Consider Alternatives:**
- Very complex multi-step wizards (consider form libraries)
- Highly dynamic form generation
- Complex field dependencies and computed values
- Need for built-in form state management utilities

The Form component strikes a balance between simplicity and capability, making it suitable for most common form use cases while remaining flexible enough for custom requirements.
