# HeroUI - Form Field Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.heroui.com/docs/components/form
Status: ✅ Working
Version: Current
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent API documentation with multiple examples covering common scenarios, accessibility guidelines, and server integration patterns.

## Component Definition
- **Core purpose**: Provides a container for form inputs with built-in validation support, allowing users to submit data to a server with field-level error handling.
- **Mental model**: A native HTML form wrapper that enhances standard form behavior with React state management, validation patterns, and error display capabilities.
- **Semantic meaning**: Creates a form landmark in the accessibility tree, grouping related input controls and their validation states.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `validationBehavior="native"`)
- **Composed**: Via composition/children (e.g., `<Form>{inputs}</Form>`)
- **CSS-only**: Requires custom styling (e.g., `className="..."`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label association | ✅ | Composed | Labels passed via `label` prop on child Input components with `labelPlacement="outside"` for positioning |
| Help text | ✅ | Composed | Supported via `description` prop on child input components |
| Error messages | ✅ | Native | Via `errorMessage` prop on inputs; supports validation detail callbacks; cleared when user modifies field |
| Required indicator | ✅ | Native | Via `isRequired` prop on child input components; displays visual indicator |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Invalid/Error | ✅ | Native | `isInvalid` prop for styling; `validationErrors` prop maps server errors to fields; native HTML constraint validation |
| Disabled | ✅ | Native | Standard `disabled` prop on child input components |
| Required | ✅ | Native | `isRequired` prop on inputs; enforced via native or ARIA validation behavior |
| Read-only | ✅ | Native | Standard `readOnly` prop support on input fields |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | CSS-only | Default stacking with `flex flex-col gap-4` utilities |
| Horizontal layout | ✅ | CSS-only | Grid-based layouts possible with custom classes |
| Inline layout | ✅ | CSS-only | Requires custom flex or grid styling |
| Label placement | ✅ | Native | Via `labelPlacement="outside"` prop on inputs; supports top, left, inside positions |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ✅ | Native | HTML constraint validation via `validationBehavior="native"` (default); prevents submission on invalid state |
| Custom validation | ✅ | Native | `validate()` function prop on fields returns error string/boolean; supports complex validation logic |
| Real-time validation | ✅ | Native | Via `validationBehavior="aria"` - shows errors without blocking submission; updates on field change |
| Error message display | ✅ | Native | `errorMessage` prop accepts string or function with validation details; clears on field modification |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Form library integration | ❌ | N/A | No explicit integration shown for React Hook Form, Formik, etc.; relies on native form patterns |
| Native HTML form | ✅ | Native | Built on native `<form>` element; supports action, method, encType, target props; FormData API usage |
| Controlled components | ✅ | Native | `value` and `onValueChange` props for state management; `onSubmit` event handling |
| Uncontrolled components | ✅ | Native | Native form submission with FormData; supports reset functionality via `onReset` |

## Code Examples

### Basic Controlled Form
```jsx
import {Form, Input, Button} from "@heroui/react";

export default function App() {
  const [submitted, setSubmitted] = React.useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setSubmitted(data);
  };

  return (
    <Form className="w-full max-w-xs" validationBehavior="native" onSubmit={onSubmit}>
      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
      />
      <Input
        isRequired
        errorMessage="Please enter a valid password"
        label="Password"
        labelPlacement="outside"
        name="password"
        placeholder="Enter your password"
        type="password"
      />
      <div className="flex gap-2">
        <Button color="primary" type="submit">
          Submit
        </Button>
        <Button type="reset" variant="flat">
          Reset
        </Button>
      </div>
      {submitted && (
        <div className="text-small text-default-500">
          You submitted: <code>{JSON.stringify(submitted)}</code>
        </div>
      )}
    </Form>
  );
}
```

### Custom Validation
```jsx
<Form className="w-full max-w-xs">
  <Input
    label="Email"
    name="email"
    validate={(value) => {
      if (!value.includes("@")) {
        return "Please enter a valid email";
      }
      return true;
    }}
  />
</Form>
```

### ARIA Real-Time Validation
```jsx
<Form validationBehavior="aria">
  <Input
    isRequired
    errorMessage="Please enter a valid email"
    label="Email"
    name="email"
    type="email"
  />
</Form>
```

### Server-Side Validation
```jsx
const [serverErrors, setServerErrors] = React.useState({});

const onSubmit = async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));

  try {
    await saveData(data);
  } catch (err) {
    setServerErrors(err.errors);
  }
};

return (
  <Form validationErrors={serverErrors} onSubmit={onSubmit}>
    <Input
      label="Email"
      name="email"
      errorMessage={({validationDetails}) => {
        return validationDetails.valueMissing
          ? "Email is required"
          : "Please enter a valid email";
      }}
    />
  </Form>
);
```

## Notable Features
- **Native HTML Foundation**: Built entirely on native `<form>` element, ensuring full browser compatibility and autofill support
- **Dual Validation Modes**: Supports both `validationBehavior="native"` (blocks submission) and `validationBehavior="aria"` (real-time feedback without blocking)
- **Smart Error Clearing**: Validation errors automatically clear when user modifies the field
- **Validation Detail Callbacks**: Error messages can be functions receiving detailed validation state for context-aware messaging
- **Server Error Integration**: `validationErrors` prop maps server-side validation errors to specific fields by name
- **Accessibility First**: Creates form landmarks with proper ARIA attributes when labeled; supports aria-label and aria-labelledby
- **FormData API**: Native integration with FormData for easy form submission handling
- **Flexible Composition**: All form controls are composed as children rather than configured via props

## Research Notes
- Documentation is well-structured with clear API tables and practical examples
- Strong emphasis on accessibility with explicit guidance on form landmarks
- Examples cover both controlled and uncontrolled patterns thoroughly
- The component serves as a wrapper/orchestrator rather than providing field-specific functionality
- Form Field pattern is achieved through composition of Form + Input/Select/etc. components
- No dedicated FormField component; instead relies on Input/Select components with enhanced props
- Validation approach is flexible, supporting native HTML validation, custom validation functions, and server-side error integration
- The "form field" concept is distributed across Form (container/validation) and Input (individual field) components
