# PrimeReact - Form Field Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primereact.org/floatlabel/
Status: ✅ Working
Version: 10.9.7
Last Verified: 2025-11-05

## Documentation Quality
Good - Provides clear examples and integration patterns, though form field patterns are distributed across multiple component pages rather than unified in a single FormField component.

## Component Definition
- **Core purpose**: PrimeReact does not provide a unified "FormField" component. Instead, it offers modular building blocks (FloatLabel, IconField, Message) that compose together with form inputs to create complete form field experiences.
- **Mental model**: Composition-based approach where developers combine wrappers (FloatLabel, IconField) with inputs (InputText, Dropdown, etc.) and feedback components (Message) to build form fields with labels, help text, and validation.
- **Semantic meaning**: Each piece communicates specific UI patterns - FloatLabel provides animated label positioning, IconField adds visual indicators, and Message component delivers validation feedback.

## Pattern Support Levels
- **Native**: Dedicated component/prop (e.g., `invalid` prop, `disabled` prop)
- **Composed**: Via composition/children (e.g., `<FloatLabel><InputText /></FloatLabel>`)
- **CSS-only**: Requires custom styling (e.g., `.p-invalid` class, `.p-inputtext-sm` size class)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label association | ✅ | Composed/Native | FloatLabel wrapper for animated labels, or standard `<label htmlFor>` with `inputId` prop |
| Help text | ✅ | Composed | `<small>` element with `aria-describedby` for advisory text |
| Error messages | ✅ | Composed | Message component with `severity="error"` positioned adjacent to invalid inputs |
| Required indicator | ❌ | CSS-only | No built-in support; requires custom CSS/HTML implementation |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Invalid/Error | ✅ | Native/CSS-only | `invalid` prop on inputs, plus `.p-invalid` CSS class for custom styling |
| Disabled | ✅ | Native | `disabled` prop prevents editing and focus |
| Required | ❌ | CSS-only | No dedicated prop; use standard HTML `required` attribute |
| Read-only | ✅ | Native | `readOnly` prop available on applicable input components |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | CSS-only | Standard block layout with inputs and labels stacked |
| Horizontal layout | ✅ | CSS-only | Use flex containers and utility classes for inline arrangements |
| Inline layout | ✅ | CSS-only | Flex containers with gap utilities (e.g., `className="flex gap-2"`) |
| Label placement | ✅ | Composed | FloatLabel: labels float above on focus; Standard: labels positioned via HTML structure |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ⚠️ | Native | Min/max constraints on InputNumber; no comprehensive validation system |
| Custom validation | ✅ | Native | `invalid` prop designed for integration with external validation libraries |
| Real-time validation | ✅ | Composed | Use `onChange` with external validation logic and `invalid` prop |
| Error message display | ✅ | Composed | Message component with `severity="error"` and `text` prop |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Form library integration | ✅ | Native | `invalid` prop explicitly designed for form validation libraries (React Hook Form, Formik, etc.) |
| Native HTML form | ✅ | Native | Standard controlled components using `value` and `onChange` |
| Controlled components | ✅ | Native | All inputs are controlled via `value`/`onChange` (or `checked`/`onCheckedChange` for checkboxes) |
| Uncontrolled components | ❌ | - | Not supported; PrimeReact uses controlled component pattern exclusively |

## Code Examples

### Basic FloatLabel with Input
```jsx
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';

function BasicFormField() {
  const [value, setValue] = useState('');

  return (
    <FloatLabel>
      <InputText
        id="username"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <label htmlFor="username">Username</label>
    </FloatLabel>
  );
}
```
[View Live](https://primereact.org/floatlabel/)

### Invalid State with Error Message
```jsx
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';

function InvalidFormField() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(true);

  return (
    <div>
      <InputText
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={error ? 'p-invalid' : ''}
        invalid={error}
      />
      {error && (
        <Message
          severity="error"
          text="Username is required"
        />
      )}
    </div>
  );
}
```
[View Live](https://primereact.org/message/)

### FloatLabel with Dropdown
```jsx
import { FloatLabel } from 'primereact/floatlabel';
import { Dropdown } from 'primereact/dropdown';

function DropdownFormField() {
  const [value, setValue] = useState(null);
  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 }
  ];

  return (
    <FloatLabel>
      <Dropdown
        inputId="dd-city"
        value={value}
        onChange={(e) => setValue(e.value)}
        options={options}
        className="w-full"
      />
      <label htmlFor="dd-city">Select a City</label>
    </FloatLabel>
  );
}
```
[View Live](https://primereact.org/dropdown/)

### IconField with Search Input
```jsx
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

function SearchFormField() {
  const [search, setSearch] = useState('');

  return (
    <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      />
    </IconField>
  );
}
```
[View Live](https://primereact.org/iconfield/)

### Help Text with aria-describedby
```jsx
import { InputText } from 'primereact/inputtext';

function HelpTextFormField() {
  const [value, setValue] = useState('');

  return (
    <div>
      <label htmlFor="username">Username</label>
      <InputText
        id="username"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-describedby="username-help"
      />
      <small id="username-help">
        Enter your username to log in.
      </small>
    </div>
  );
}
```
[View Live](https://primereact.org/inputtext/)

### Checkbox with Label
```jsx
import { Checkbox } from 'primereact/checkbox';

function CheckboxFormField() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex align-items-center">
      <Checkbox
        inputId="terms"
        checked={checked}
        onChange={(e) => setChecked(e.checked)}
      />
      <label htmlFor="terms" className="ml-2">
        I agree to the terms and conditions
      </label>
    </div>
  );
}
```
[View Live](https://primereact.org/checkbox/)

### Disabled State
```jsx
import { InputText } from 'primereact/inputtext';

function DisabledFormField() {
  return (
    <InputText
      value="Cannot edit"
      disabled
      placeholder="Disabled input"
    />
  );
}
```
[View Live](https://primereact.org/inputtext/)

### Size Variants
```jsx
import { InputText } from 'primereact/inputtext';

function SizedFormFields() {
  return (
    <div className="flex flex-column gap-3">
      <InputText
        placeholder="Small"
        className="p-inputtext-sm"
      />
      <InputText
        placeholder="Default"
      />
      <InputText
        placeholder="Large"
        className="p-inputtext-lg"
      />
    </div>
  );
}
```
[View Live](https://primereact.org/inputtext/)

### Filled Variant
```jsx
import { InputText } from 'primereact/inputtext';

function FilledFormField() {
  const [value, setValue] = useState('');

  return (
    <InputText
      value={value}
      onChange={(e) => setValue(e.target.value)}
      variant="filled"
      placeholder="Filled variant"
    />
  );
}
```
[View Live](https://primereact.org/inputtext/)

### Form Integration with Validation Library
```jsx
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';

function FormWithValidation() {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-3">
      <div>
        <label htmlFor="email">Email</label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          }}
          render={({ field }) => (
            <InputText
              id="email"
              {...field}
              invalid={!!errors.email}
              className="w-full"
            />
          )}
        />
        {errors.email && (
          <Message
            severity="error"
            text={errors.email.message}
          />
        )}
      </div>

      <Button type="submit" label="Submit" />
    </form>
  );
}
```

## Notable Features

### Composition Over Configuration
PrimeReact uses a modular composition approach rather than providing a unified FormField component. This allows developers to:
- Mix and match wrappers (FloatLabel, IconField)
- Add validation feedback separately (Message component)
- Customize layout and structure flexibly
- Maintain fine-grained control over each piece

### Consistent `invalid` Prop Pattern
All form inputs support the `invalid` prop, making integration with validation libraries straightforward and consistent across different input types.

### FloatLabel Animation
The FloatLabel component provides an elegant animated label pattern that improves UX by:
- Keeping the label visible after user interaction
- Reducing visual clutter when fields are empty
- Working consistently across different input types (text, dropdowns, etc.)

### Accessibility-First Design
- Standard HTML label association via `htmlFor` and `inputId`
- ARIA attributes support (`aria-label`, `aria-labelledby`, `aria-describedby`)
- Message component uses `alert` role for validation feedback
- Semantic HTML structure for screen reader compatibility

### Size System via CSS Classes
Rather than size props, PrimeReact uses CSS utility classes (`.p-inputtext-sm`, `.p-inputtext-lg`) for sizing, providing:
- Consistent sizing across components
- Easy customization via CSS
- No prop bloat on components

### External Validation Library Integration
PrimeReact explicitly designs for integration with validation libraries like React Hook Form and Formik:
- `invalid` prop designed for validation state
- Controlled component pattern works seamlessly
- No built-in validation to avoid library lock-in

## Research Notes

### Distributed Documentation
Form field patterns are documented across multiple component pages (FloatLabel, InputText, IconField, Message, Dropdown, Checkbox) rather than in a unified FormField guide. This reflects the composition-based architecture but requires checking multiple sources to understand complete patterns.

### No Unified FormField Component
Unlike some frameworks that provide a comprehensive FormField or FormControl component, PrimeReact expects developers to compose field structures from primitives. This provides flexibility but requires more implementation work.

### Limited Built-in Validation
PrimeReact intentionally provides minimal built-in validation (only basic constraints like min/max on InputNumber). The framework is designed to integrate with external validation libraries rather than compete with them.

### CSS Class-Based Patterns
Several patterns (sizing, required indicators, custom styling of invalid states) rely on CSS classes rather than props. This keeps component APIs minimal but requires understanding the CSS class system.

### No Required Field Indicator
There is no built-in visual pattern for required field indicators (asterisks, etc.). Developers must implement these manually using custom CSS or HTML elements.

### Consistent API Across Inputs
All form inputs follow a consistent pattern:
- `value` and `onChange` for controlled state
- `invalid` prop for validation state
- `disabled` prop for disabled state
- `inputId` for label association
- `variant` prop for filled/outlined styles

This consistency makes it easy to learn and use different input types once you understand the basic pattern.

### Version-Specific Features
Documentation reflects PrimeReact 10.9.7. Features like FloatLabel and IconField are relatively recent additions to the framework.

---

## Summary

PrimeReact takes a **composition-based approach** to form fields rather than providing a monolithic FormField component. Developers combine:

1. **Wrappers**: FloatLabel (animated labels), IconField (icon integration)
2. **Inputs**: InputText, Dropdown, Checkbox, etc. (all with consistent `invalid`, `disabled`, `inputId` props)
3. **Feedback**: Message component (for validation errors)
4. **Structure**: Standard HTML elements (`<label>`, `<small>`) with semantic associations

**Strengths**:
- Maximum flexibility through composition
- Consistent API across all input types
- Designed for external validation library integration
- Strong accessibility support
- Clean separation of concerns

**Limitations**:
- Requires more manual composition vs. unified FormField component
- No built-in required field indicators
- Patterns distributed across multiple doc pages
- Some features require CSS class knowledge

**Best suited for**: Applications that need flexible form field composition and plan to integrate with validation libraries like React Hook Form or Formik.
