# PrimeReact - RadioButton Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primereact.org/radiobutton/
Status: ✅ Working
Version: Latest (PrimeReact)
Last Verified: 2025-11-05

## Documentation Quality
Good - The documentation provides clear examples with live demos, comprehensive prop tables, and covers all common use cases including accessibility patterns. The integration with React's controlled component pattern is well-documented. Some advanced customization patterns may require consulting the source code.

## Component Definition
- **Core purpose**: An enhanced standard radio button element with integrated theming that enables users to select a single option from a set of mutually exclusive choices. Provides a controlled React component that wraps the native radio button with consistent styling and behavior.
- **Mental model**: A controlled input component that represents one choice in a radio button group. Multiple RadioButton components sharing the same `name` form a mutually exclusive selection group where only one can be selected at a time. The parent component manages the selected state and updates it through the onChange handler.
- **Semantic meaning**: Represents a single selectable option within a group of mutually exclusive choices. Communicates selection state through visual feedback (filled/unfilled circle) and enforces single-selection semantics at the group level through shared naming.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label association | ✅ | Composed | Labels connected via `inputId` and `htmlFor` attributes, labels are separate elements |
| Icon/custom content | ❌ | N/A | RadioButton is a form primitive, custom content would be in associated labels |
| Standalone | ✅ | Native | Can be used without label, though not recommended for accessibility |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single radio | ✅ | Native | Individual RadioButton component represents one option |
| Radio group | ✅ | Composed | Multiple RadioButtons with shared `name` prop form a group |
| Button-style radio | ❌ | N/A | No button-group variant, uses traditional circular radio appearance |
| Segmented control | ❌ | N/A | Not provided by RadioButton component |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked | ✅ | Native | `checked` boolean prop controls selection state |
| Unchecked | ✅ | Native | Default state when `checked={false}` or not checked |
| Disabled | ✅ | Native | `disabled` boolean prop prevents interaction |
| Invalid/Error | ✅ | Native | `invalid` boolean prop shows validation failure state |
| Required | ✅ | Native | `required` prop for form validation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No built-in size variants, would require custom CSS |
| Orientation | ✅ | Composed | Vertical/horizontal layout controlled by parent container styling |
| Variant styles | ✅ | Native | `variant="filled"` or `variant="outlined"` (default) for visual emphasis |
| Color schemes | ✅ | CSS-only | Theming through PrimeReact theme system |
| Spacing | ✅ | Composed | Gap between radio buttons controlled by parent layout |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange handler | ✅ | Native | `onChange={(e) => handleChange(e.value)}` provides selected value |
| Controlled | ✅ | Native | Requires `checked` prop and `onChange` handler (controlled component pattern) |
| Uncontrolled | ❌ | N/A | Must be controlled, no defaultChecked pattern shown |
| Form integration | ✅ | Native | Works with form libraries via `name`, `value`, `checked`, and `invalid` props |
| Keyboard navigation | ✅ | Native | Tab, Arrow keys, and Space key support built-in |

## Code Examples

### Basic Usage
```jsx
import { useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';

function BasicRadio() {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <div>
      <div>
        <RadioButton
          inputId="option1"
          name="basic"
          value="Option 1"
          onChange={(e) => setSelectedValue(e.value)}
          checked={selectedValue === 'Option 1'}
        />
        <label htmlFor="option1">Option 1</label>
      </div>
      <div>
        <RadioButton
          inputId="option2"
          name="basic"
          value="Option 2"
          onChange={(e) => setSelectedValue(e.value)}
          checked={selectedValue === 'Option 2'}
        />
        <label htmlFor="option2">Option 2</label>
      </div>
    </div>
  );
}
```

### Dynamic Radio Group
```jsx
import { useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';

function DynamicRadioGroup() {
  const categories = [
    { name: 'Accounting', key: 'A' },
    { name: 'Marketing', key: 'M' },
    { name: 'Production', key: 'P' },
    { name: 'Research', key: 'R' }
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[1]);

  return (
    <div>
      {categories.map((category) => (
        <div key={category.key}>
          <RadioButton
            inputId={category.key}
            name="category"
            value={category}
            onChange={(e) => setSelectedCategory(e.value)}
            checked={selectedCategory.key === category.key}
          />
          <label htmlFor={category.key}>{category.name}</label>
        </div>
      ))}
    </div>
  );
}
```

### Variant Styles
```jsx
import { RadioButton } from 'primereact/radiobutton';

function VariantExamples() {
  const [variant, setVariant] = useState('outlined');

  return (
    <div>
      {/* Default outlined variant */}
      <RadioButton
        inputId="outlined"
        name="variant"
        value="outlined"
        variant="outlined"
        onChange={(e) => setVariant(e.value)}
        checked={variant === 'outlined'}
      />
      <label htmlFor="outlined">Outlined</label>

      {/* Filled variant for emphasis */}
      <RadioButton
        inputId="filled"
        name="variant"
        value="filled"
        variant="filled"
        onChange={(e) => setVariant(e.value)}
        checked={variant === 'filled'}
      />
      <label htmlFor="filled">Filled</label>
    </div>
  );
}
```

### States: Disabled and Invalid
```jsx
import { RadioButton } from 'primereact/radiobutton';

function StateExamples() {
  const [value, setValue] = useState('');

  return (
    <div>
      {/* Disabled state */}
      <div>
        <RadioButton
          inputId="disabled1"
          name="disabled"
          value="disabled-option"
          disabled
        />
        <label htmlFor="disabled1">Disabled</label>
      </div>

      {/* Disabled and checked */}
      <div>
        <RadioButton
          inputId="disabled2"
          name="disabled-checked"
          value="disabled-checked-option"
          checked
          disabled
        />
        <label htmlFor="disabled2">Disabled Checked</label>
      </div>

      {/* Invalid state */}
      <div>
        <RadioButton
          inputId="invalid"
          name="invalid"
          value="invalid-option"
          onChange={(e) => setValue(e.value)}
          checked={value === 'invalid-option'}
          invalid
        />
        <label htmlFor="invalid">Invalid Option</label>
      </div>
    </div>
  );
}
```

### Form Integration
```jsx
import { useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';

function FormExample() {
  const [formData, setFormData] = useState({
    subscription: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.subscription) {
      setErrors({ subscription: 'Please select a subscription type' });
      return;
    }

    console.log('Form submitted:', formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h4>Select Subscription</h4>

        <div>
          <RadioButton
            inputId="free"
            name="subscription"
            value="free"
            onChange={(e) => handleChange('subscription', e.value)}
            checked={formData.subscription === 'free'}
            invalid={!!errors.subscription}
          />
          <label htmlFor="free">Free</label>
        </div>

        <div>
          <RadioButton
            inputId="premium"
            name="subscription"
            value="premium"
            onChange={(e) => handleChange('subscription', e.value)}
            checked={formData.subscription === 'premium'}
            invalid={!!errors.subscription}
          />
          <label htmlFor="premium">Premium</label>
        </div>

        <div>
          <RadioButton
            inputId="enterprise"
            name="subscription"
            value="enterprise"
            onChange={(e) => handleChange('subscription', e.value)}
            checked={formData.subscription === 'enterprise'}
            invalid={!!errors.subscription}
          />
          <label htmlFor="enterprise">Enterprise</label>
        </div>

        {errors.subscription && (
          <small style={{ color: 'red' }}>{errors.subscription}</small>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Accessibility Patterns
```jsx
import { RadioButton } from 'primereact/radiobutton';

function AccessibilityExamples() {
  const [choice, setChoice] = useState('');

  return (
    <div>
      {/* Label association via inputId/htmlFor */}
      <div>
        <RadioButton
          inputId="choice1"
          name="choice"
          value="A"
          onChange={(e) => setChoice(e.value)}
          checked={choice === 'A'}
        />
        <label htmlFor="choice1">Choice A</label>
      </div>

      {/* Aria-label for screen readers */}
      <div>
        <RadioButton
          inputId="choice2"
          name="choice"
          value="B"
          onChange={(e) => setChoice(e.value)}
          checked={choice === 'B'}
          aria-label="Choice B description"
        />
        <label htmlFor="choice2">Choice B</label>
      </div>

      {/* Aria-labelledby referencing external element */}
      <div>
        <span id="choice3-description">Detailed description for Choice C</span>
        <RadioButton
          inputId="choice3"
          name="choice"
          value="C"
          onChange={(e) => setChoice(e.value)}
          checked={choice === 'C'}
          aria-labelledby="choice3-description"
        />
        <label htmlFor="choice3">Choice C</label>
      </div>
    </div>
  );
}
```

### Object Values Pattern
```jsx
import { useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';

function ObjectValueExample() {
  const options = [
    { id: 1, name: 'New York', code: 'NY' },
    { id: 2, name: 'Rome', code: 'RM' },
    { id: 3, name: 'London', code: 'LDN' },
    { id: 4, name: 'Paris', code: 'PRS' }
  ];
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div>
      {options.map((city) => (
        <div key={city.id}>
          <RadioButton
            inputId={city.code}
            name="city"
            value={city}
            onChange={(e) => setSelectedCity(e.value)}
            checked={selectedCity?.id === city.id}
          />
          <label htmlFor={city.code}>{city.name}</label>
        </div>
      ))}

      {selectedCity && (
        <div>Selected: {selectedCity.name} ({selectedCity.code})</div>
      )}
    </div>
  );
}
```

## Notable Features

### 1. **Controlled Component Pattern**
PrimeReact RadioButton strictly follows React's controlled component pattern, requiring both `checked` and `onChange` props. This ensures predictable state management and integrates seamlessly with React form libraries.

### 2. **Value Access Pattern**
The `onChange` handler receives `e.value` directly, providing immediate access to the selected value without needing to access `e.target.value`. This simplifies state updates and is more intuitive than native HTML radio buttons.

### 3. **Object Value Support**
RadioButton can use complex objects as values, not just strings. The component handles object comparison through the `checked` prop logic, enabling rich data structures in radio groups.

### 4. **Built-in Invalid State**
The `invalid` prop provides native support for validation feedback without requiring custom CSS or wrapper components. This integrates naturally with form validation libraries.

### 5. **Variant System**
The `variant` prop ("outlined" or "filled") provides visual emphasis options, allowing designers to adjust prominence based on context without custom styling.

### 6. **Accessibility-First Design**
RadioButton uses a hidden native radio button element internally, ensuring full screen reader compatibility while providing enhanced visual styling. The component supports all standard ARIA attributes for advanced accessibility patterns.

### 7. **Keyboard Navigation**
Complete keyboard support is built-in:
- **Tab**: Moves focus to the checked button in a group (or first button if none checked)
- **Arrow Keys**: Navigate between radio buttons in the same group
- **Space**: Selects the focused radio button

### 8. **Label Flexibility**
Labels are separate elements, providing flexibility in layout and styling. The `inputId` and `htmlFor` connection ensures proper accessibility while allowing custom label markup and positioning.

## Research Notes

### Architecture Approach
PrimeReact RadioButton follows a **controlled primitive approach** where:
- The component is a thin wrapper around native radio input
- All state management is external (parent component responsibility)
- Props mirror native HTML attributes with React naming conventions
- No internal state or uncontrolled mode

### Comparison with Other Frameworks

**Similarities to Material-UI (MUI)**:
- Both require controlled component pattern
- Both support object values
- Similar prop naming (checked, disabled, value)

**Differences from Chakra UI**:
- Chakra provides RadioGroup wrapper for easier state management
- PrimeReact requires manual group composition
- Chakra has more built-in size variants

**Differences from Ant Design**:
- Ant Design has Radio.Group component for automatic state management
- PrimeReact is more primitive, requiring manual wiring
- Ant Design provides button-style radio variant

### Strengths
1. **Simple and predictable**: Minimal abstraction over native radio buttons
2. **Flexible composition**: No prescribed group wrapper allows custom layouts
3. **Object value support**: Can pass complex data structures as values
4. **Excellent accessibility**: Native element ensures screen reader compatibility
5. **Form library friendly**: Works seamlessly with React Hook Form, Formik, etc.
6. **Validation integration**: Built-in invalid state for error feedback
7. **Keyboard navigation**: Full keyboard support out of the box

### Limitations
1. **No RadioGroup component**: Requires manual state management and composition
2. **Limited visual variants**: Only filled/outlined, no size options
3. **Manual group wiring**: Must manually ensure shared `name` across group
4. **Verbose for simple cases**: Every radio requires full prop set
5. **No button-style variant**: Only traditional circular radio appearance
6. **Layout management external**: Parent must handle spacing and orientation

### Developer Experience
- **Discoverability**: Clear prop API, well-documented
- **Type Safety**: TypeScript support for all props
- **Boilerplate**: More verbose than frameworks with RadioGroup wrappers
- **Flexibility**: High control over layout and behavior
- **Learning Curve**: Requires understanding of controlled components

### Use Case Recommendations

**Best for**:
- Applications needing fine control over radio group layout
- Integration with existing form validation libraries
- Custom radio group patterns not supported by wrapper components
- Teams familiar with controlled React patterns

**Consider alternatives when**:
- Need button-style radio groups (use ButtonGroup-style components)
- Want less boilerplate (frameworks with RadioGroup wrapper)
- Require built-in size variants
- Need automatic group state management

### Pattern Evolution Opportunity
A RadioGroup wrapper component could reduce boilerplate:

```jsx
// Current (verbose but flexible)
<div>
  <RadioButton inputId="1" name="x" value="A" onChange={e => set(e.value)} checked={val === 'A'} />
  <label htmlFor="1">A</label>
  <RadioButton inputId="2" name="x" value="B" onChange={e => set(e.value)} checked={val === 'B'} />
  <label htmlFor="2">B</label>
</div>

// Potential improvement with wrapper
<RadioGroup value={val} onChange={set} name="x">
  <Radio value="A" label="A" />
  <Radio value="B" label="B" />
</RadioGroup>
```

However, the current approach provides maximum flexibility for custom layouts and complex use cases, which aligns with PrimeReact's philosophy of providing building blocks rather than prescriptive patterns.
