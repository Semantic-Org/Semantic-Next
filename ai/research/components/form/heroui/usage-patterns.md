# HeroUI - Form Usage Patterns

## Component URL
https://www.heroui.com/docs/components/form

Status: ✅ Working
Version: Current (v2.6.0+ with React 19 RC and Next.js 15 support)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - The documentation covers all major use cases with detailed examples, validation patterns, accessibility considerations, and framework integrations.

## Component Definition
- **Core purpose**: Provides an accessible, enhanced wrapper around the native HTML `<form>` element that adds dual validation strategies (native browser validation and ARIA-based real-time validation), server-side error integration, and seamless React state management patterns.
- **Mental model**: A form is a group of inputs that allows users to submit data to a server. The Form component respects native HTML semantics while adding modern React patterns for validation feedback and error handling.
- **Semantic meaning**: A navigable form landmark in the document structure (when properly labeled with aria-label or aria-labelledby). Communicates to users and assistive technology that this section contains interactive inputs for data collection and submission.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Field grouping | ✅ | Composed | Via `<div>` containers and semantic HTML structure with headings |
| Field labels | ✅ | Native | All HeroUI input components have built-in `label` prop with proper association |
| Help text | ✅ | Native | Input components support `description` prop for help text |
| Error messages | ✅ | Native | `errorMessage` prop on inputs + `validationErrors` prop on Form component |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ✅ | Native | HTML5 constraint validation via `isRequired`, `minLength`, `maxLength`, `pattern` props; uses browser's Constraint Validation API |
| Custom validation | ✅ | Native | `validate` prop accepts function that receives value and returns error message or null |
| Async validation | ❌ | CSS-only | Must implement manually with controlled state and async functions |
| Cross-field validation | ❌ | CSS-only | Requires custom implementation in form-level validation logic |
| Validation triggers | ✅ | Native | Two modes: `validationBehavior="native"` (on submit) or `validationBehavior="aria"` (real-time) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled values | ✅ | Native | `value` + `onChange` props on input components |
| Uncontrolled values | ✅ | Native | Default behavior, uses `defaultValue` prop and native FormData API |
| Initial values | ✅ | Native | `defaultValue` for uncontrolled, `value` for controlled |
| Dynamic fields | ❌ | CSS-only | Must implement with React state and array mapping; works well with React Hook Form's `useFieldArray` |
| Field dependencies | ❌ | CSS-only | Requires custom implementation with controlled state or React Hook Form's `useWatch` |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal layout | ✅ | CSS-only | `className="flex flex-row gap-4 items-end"` |
| Vertical layout | ✅ | CSS-only | `className="flex flex-col gap-4"` (default pattern) |
| Inline layout | ✅ | CSS-only | `className="flex gap-2"` for compact single-row forms |
| Grid layout | ✅ | CSS-only | `className="grid grid-cols-2 gap-4"` with Tailwind CSS |
| Responsive layout | ✅ | CSS-only | Tailwind responsive classes: `className="grid grid-cols-1 md:grid-cols-2 gap-4"` |

## Submission Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Submit handling | ✅ | Native | `onSubmit` prop, receives React `FormEvent`, use `e.preventDefault()` for custom handling |
| Loading state | ✅ | Composed | Button component has `isLoading` prop; must manage loading state manually |
| Error handling | ✅ | Native | `validationErrors` prop accepts object mapping field names to error messages |
| Success handling | ❌ | CSS-only | Must implement success state and messaging manually |
| Reset functionality | ✅ | Native | `onReset` prop + `<Button type="reset">` or `formRef.current?.reset()` |

## Code Examples

### Basic Usage
```jsx
import { Form, Input, Button } from "@heroui/react";

function BasicForm() {
  return (
    <Form>
      <Input name="username" label="Username" isRequired />
      <Input name="email" label="Email" type="email" isRequired />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### ARIA Validation Mode (Real-time)
```jsx
function AriaValidationForm() {
  return (
    <Form validationBehavior="aria">
      <Input
        name="username"
        label="Username"
        isRequired
        minLength={3}
        errorMessage="Username must be at least 3 characters"
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### Server-Side Validation Errors
```jsx
'use client';
import { Form, Input, Button } from '@heroui/react';
import { useState } from 'react';

function ServerValidationForm() {
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (result.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <Form onSubmit={handleSubmit} validationErrors={errors}>
      <Input name="username" label="Username" />
      <Input name="email" label="Email" />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### Next.js Server Actions Integration
```jsx
'use client';
import { Form, Input, Button } from '@heroui/react';
import { useActionState } from 'react';

async function submitForm(prevState, formData) {
  'use server';

  const username = formData.get('username');
  const email = formData.get('email');

  // Validate
  if (!username || username.length < 3) {
    return {
      errors: { username: 'Username must be at least 3 characters' }
    };
  }

  // Process...
  return { success: true };
}

function ServerActionForm() {
  const [state, formAction] = useActionState(submitForm, {});

  return (
    <Form action={formAction} validationErrors={state?.errors}>
      <Input name="username" label="Username" />
      <Input name="email" label="Email" />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### React Hook Form Integration
```jsx
'use client';
import { useForm } from 'react-hook-form';
import { Form, Input, Button } from '@heroui/react';

function ReactHookFormExample() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('username', { required: 'Username is required' })}
        label="Username"
        isInvalid={!!errors.username}
        errorMessage={errors.username?.message}
      />
      <Input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        label="Email"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Zod Schema Validation
```jsx
'use client';
import { useState } from 'react';
import { z } from 'zod';
import { Form, Input, Button } from '@heroui/react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

function ZodValidationForm() {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
      const formErrors = {};
      validation.error.errors.forEach((error) => {
        formErrors[error.path[0]] = error.message;
      });
      setErrors(formErrors);
      return;
    }

    setErrors({});
    console.log('Valid data:', data);
  };

  return (
    <Form onSubmit={handleSubmit} validationErrors={errors}>
      <Input name="email" label="Email" type="email" />
      <Input name="password" label="Password" type="password" />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### React Hook Form + Zod Integration
```jsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Button } from '@heroui/react';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormData = z.infer<typeof schema>;

function RHFZodForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email')}
        label="Email"
        type="email"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />
      <Input
        {...register('password')}
        label="Password"
        type="password"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
      />
      <Button type="submit" isLoading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
```

### Custom Validation Function
```jsx
<Form validationBehavior="aria">
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
  <Button type="submit">Submit</Button>
</Form>
```

### Multi-Section Form with Layout
```jsx
<Form className="space-y-6">
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Personal Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <Input name="firstName" label="First Name" isRequired />
      <Input name="lastName" label="Last Name" isRequired />
    </div>
    <Input name="email" label="Email" type="email" isRequired />
  </div>

  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Contact Information</h3>
    <Input name="phone" label="Phone" type="tel" />
    <Input name="address" label="Address" />
  </div>

  <Button type="submit">Submit</Button>
</Form>
```

[View Live Examples](https://www.heroui.com/docs/components/form)

## Notable Features

### Dual Validation Modes
HeroUI Form uniquely offers two validation behaviors:
- **Native mode** (default): Uses browser's constraint validation API, prevents submission on invalid fields
- **ARIA mode**: Shows real-time validation errors without blocking submission, better for accessibility and complex forms

### Server-Side Error Integration
The `validationErrors` prop provides first-class support for displaying server-side validation errors with automatic field association and auto-clearing behavior when users modify fields.

### Next.js 15 and React 19 Support
As of v2.6.0, HeroUI fully supports Next.js 15 and React 19 RC, including seamless integration with Server Actions via the `useActionState` hook.

### Framework-Agnostic Validation
Works with any validation approach:
- Native HTML5 validation attributes
- Custom validation functions
- React Hook Form integration
- Schema validation libraries (Zod, Yup, etc.)
- Server-side validation

### Accessibility First
Built on React Aria foundation with:
- Automatic ARIA landmark creation
- Proper label association via id/for attributes
- Live region announcements for validation errors
- Full keyboard navigation support
- Screen reader optimized error messaging

### Minimal Abstraction
Unlike heavy form libraries, HeroUI Form is a thin wrapper over native `<form>` that respects web platform fundamentals while adding modern React patterns.

### FormData API Integration
Leverages the native FormData API for efficient data collection without controlled state overhead.

### TypeScript Support
Fully typed with comprehensive TypeScript definitions for all props and event handlers.

## Research Notes

### Documentation Access
The HeroUI documentation at https://www.heroui.com/docs/components/form is fully accessible and comprehensive. The framework was previously known as NextUI and rebranded to HeroUI.

### Framework Observations

**Strengths:**
1. **Web Platform First**: Respects HTML semantics and native form behavior
2. **Progressive Enhancement**: Works as a standard form with React enhancements layered on top
3. **Flexible Validation**: Multiple strategies that can be mixed and matched
4. **Developer Choice**: Supports both controlled and uncontrolled patterns
5. **Modern React Integration**: Works seamlessly with Server Actions, hooks, and concurrent features

**Trade-offs:**
1. **No Built-in Form State Library**: Unlike React Hook Form or Formik, you manage complex form state yourself
2. **Limited Dynamic Field Support**: No built-in utilities for field arrays or dynamic forms (must use external libraries)
3. **No Cross-Field Validation**: Must implement field dependencies and conditional validation manually
4. **Layout is CSS-based**: No built-in layout props, relies on Tailwind CSS classes

**Best For:**
- Standard CRUD forms
- Forms with server-side validation
- Accessible form implementations
- Projects already using HeroUI components
- Teams preferring minimal abstraction over web standards

**Consider Alternatives When:**
- Complex multi-step wizards with intricate state management
- Dynamic form generation with many conditional fields
- Need for advanced features like field arrays, field dependencies, computed values
- Preference for opinionated form state management (use React Hook Form or Formik directly)

### Integration Patterns
The documentation shows strong patterns for:
- React Hook Form integration (via `register` and native event handlers)
- Zod schema validation (via `safeParse` or with `@hookform/resolvers`)
- Next.js Server Actions (via `useActionState` hook)
- Standard fetch-based submissions
- Custom validation logic

### Version Information
- Current version supports React 19 RC and Next.js 15 (as of v2.6.0)
- Version 2.4.0 changed default `validationBehavior` from `native` to `aria`
- Version 2.7.10 fixed bugs with `validationErrors` not displaying properly

### Recommended Validation Strategy
Based on the documentation patterns:
1. **Simple forms**: Use native validation with HTML5 attributes
2. **Real-time feedback**: Use ARIA validation mode
3. **Complex validation**: Integrate React Hook Form + Zod
4. **Server validation**: Use `validationErrors` prop with fetch or Server Actions
5. **Hybrid**: Combine client-side (Zod) and server-side validation patterns
