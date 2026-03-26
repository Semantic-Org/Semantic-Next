# Radix UI Checkbox - Usage Patterns Report

## 1. Component Overview

Radix UI Checkbox is an **unstyled primitive component** that provides a fully accessible, customizable control for toggling between checked and unchecked states. Unlike styled component libraries, this primitive offers complete visual freedom while handling complex accessibility, keyboard navigation, and state management concerns. The component supports three distinct states (checked, unchecked, and indeterminate), making it suitable for both simple toggles and advanced selection patterns like hierarchical "select all" functionality.

As part of the Radix Primitives ecosystem, this component serves as the foundational layer for building design systems, requiring developers to provide their own styling while benefiting from battle-tested accessibility and behavior patterns.

## 2. Installation & Setup

### Package Installation

```bash
npm install @radix-ui/react-checkbox
```

### Basic Imports

```jsx
import * as Checkbox from '@radix-ui/react-checkbox';
// Or named import
import { Root, Indicator } from '@radix-ui/react-checkbox';
```

### Optional Icon Library

```bash
npm install @radix-ui/react-icons
```

```jsx
import { CheckIcon } from '@radix-ui/react-icons';
```

## 3. Basic Usage

Since Radix Primitives are unstyled, all examples must include custom styling. Here are practical examples:

### Minimal Example with Inline Styles

```jsx
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

function BasicCheckbox() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox.Root
        id="terms"
        defaultChecked
        style={{
          width: 20,
          height: 20,
          border: '2px solid #333',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label
        htmlFor="terms"
        style={{ marginLeft: 8, cursor: 'pointer' }}
      >
        Accept terms and conditions
      </label>
    </div>
  );
}
```

### Example with CSS Classes

```jsx
// Component
function StyledCheckbox() {
  return (
    <div className="checkbox-container">
      <Checkbox.Root
        className="checkbox-root"
        id="notifications"
      >
        <Checkbox.Indicator className="checkbox-indicator">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor="notifications" className="checkbox-label">
        Enable notifications
      </label>
    </div>
  );
}
```

```css
/* styles.css */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-root {
  width: 20px;
  height: 20px;
  border: 2px solid #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.checkbox-root:hover {
  border-color: #0066cc;
}

.checkbox-root[data-state="checked"] {
  background-color: #0066cc;
  border-color: #0066cc;
}

.checkbox-root[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox-indicator {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-label {
  cursor: pointer;
  user-select: none;
}
```

### Example with CSS-in-JS (Styled Components)

```jsx
import styled from 'styled-components';
import * as Checkbox from '@radix-ui/react-checkbox';

const StyledRoot = styled(Checkbox.Root)`
  width: 20px;
  height: 20px;
  border: 2px solid #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  cursor: pointer;

  &:hover {
    border-color: #0066cc;
  }

  &[data-state="checked"] {
    background-color: #0066cc;
    border-color: #0066cc;
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledIndicator = styled(Checkbox.Indicator)`
  color: white;
`;

function CheckboxWithStyledComponents() {
  return (
    <StyledRoot defaultChecked>
      <StyledIndicator>
        <CheckIcon />
      </StyledIndicator>
    </StyledRoot>
  );
}
```

### Example with Tailwind CSS

```jsx
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

function TailwindCheckbox() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox.Root
        className="w-5 h-5 border-2 border-gray-800 rounded flex items-center justify-center bg-white hover:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed transition-colors"
        id="tailwind-example"
      >
        <Checkbox.Indicator className="text-white">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor="tailwind-example" className="cursor-pointer select-none">
        Tailwind styled checkbox
      </label>
    </div>
  );
}
```

## 4. API/Props Reference

### Checkbox.Root

The container component that manages checkbox logic and state.

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `asChild` | `boolean` | `false` | No | Merge props onto child element instead of rendering a button |
| `defaultChecked` | `boolean \| 'indeterminate'` | — | No | Initial checked state when uncontrolled |
| `checked` | `boolean \| 'indeterminate'` | — | No | Controlled checked state |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | — | No | Event handler called when the checked state changes |
| `disabled` | `boolean` | — | No | When true, prevents user interaction and applies disabled styling |
| `required` | `boolean` | — | No | When true, indicates the checkbox must be checked before form submission |
| `name` | `string` | — | No | Name of the checkbox for form submission |
| `value` | `string` | `"on"` | No | Value submitted with form data when checkbox is checked |

**Additional Props**: Accepts all standard HTML button attributes (aria-label, aria-describedby, etc.)

**Data Attributes**:
- `[data-state]`: `"checked"` | `"unchecked"` | `"indeterminate"` - Current checkbox state
- `[data-disabled]`: Present when `disabled={true}`

**Rendered Element**: `<button type="button" role="checkbox" />`

### Checkbox.Indicator

Renders content when the checkbox is checked or indeterminate. Typically contains an icon or visual indicator.

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `asChild` | `boolean` | `false` | No | Merge props onto child element instead of rendering a span |
| `forceMount` | `boolean` | — | No | Force mount the indicator regardless of checked state (useful for animations) |

**Data Attributes**:
- `[data-state]`: `"checked"` | `"unchecked"` | `"indeterminate"` - Inherited from parent state
- `[data-disabled]`: Present when parent is disabled

**Rendered Element**: `<span />`

**Visibility**: Only rendered in the DOM when `data-state` is `"checked"` or `"indeterminate"` (unless `forceMount={true}`)

## 5. Component Composition

### Root Component

The `Checkbox.Root` component serves as the primary container and state manager. It:
- Renders as a `<button>` element with `role="checkbox"`
- Manages internal checked/unchecked/indeterminate state
- Handles keyboard interactions (Space key)
- Provides accessibility attributes automatically
- Emits state change events
- Creates a hidden `<input type="checkbox">` for form integration

### Indicator Component

The `Checkbox.Indicator` component is the visual feedback element. It:
- Renders only when checked or indeterminate (conditional rendering)
- Provides a container for icons or custom visual elements
- Inherits state from parent Root component via data attributes
- Can be forced to mount with `forceMount` for custom animations

### How They Work Together

```jsx
<Checkbox.Root>          {/* State manager + accessibility */}
  <Checkbox.Indicator>   {/* Conditional visual feedback */}
    <CheckIcon />         {/* Your custom icon/element */}
  </Checkbox.Indicator>
</Checkbox.Root>
```

The Root component tracks state and communicates it to the Indicator through:
1. **Conditional rendering**: Indicator only appears in DOM when checked/indeterminate
2. **Data attributes**: Both components receive matching `data-state` attributes
3. **Context**: Internal React context passes state information

### State Values

#### Checked State
```jsx
<Checkbox.Root checked={true}>
  <Checkbox.Indicator>
    <CheckIcon />  {/* Visible */}
  </Checkbox.Indicator>
</Checkbox.Root>
```
- `data-state="checked"`
- Indicator is mounted and visible
- Value submitted with forms

#### Unchecked State
```jsx
<Checkbox.Root checked={false}>
  <Checkbox.Indicator>
    <CheckIcon />  {/* Not rendered */}
  </Checkbox.Indicator>
</Checkbox.Root>
```
- `data-state="unchecked"`
- Indicator is not mounted (unless `forceMount={true}`)
- No value submitted with forms

#### Indeterminate State
```jsx
<Checkbox.Root checked="indeterminate">
  <Checkbox.Indicator>
    <MinusIcon />  {/* Visible - often shows minus/dash */}
  </Checkbox.Indicator>
</Checkbox.Root>
```
- `data-state="indeterminate"`
- Indicator is mounted and visible
- Represents partial selection (e.g., parent checkbox when some children are selected)
- Clicking typically toggles to checked state

## 6. State Management

### Uncontrolled Mode

Use `defaultChecked` for initial state. Component manages its own state internally.

```jsx
function UncontrolledExample() {
  return (
    <Checkbox.Root defaultChecked={true}>
      <Checkbox.Indicator>
        <CheckIcon />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}
```

**When to use**: Simple cases where you don't need to track or synchronize state externally.

### Controlled Mode

Use `checked` prop with `onCheckedChange` callback. You manage state externally.

```jsx
function ControlledExample() {
  const [checked, setChecked] = React.useState(false);

  return (
    <div>
      <Checkbox.Root
        checked={checked}
        onCheckedChange={setChecked}
      >
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <p>Checked state: {String(checked)}</p>
    </div>
  );
}
```

**When to use**: When you need to:
- Synchronize with external state management
- Derive state from other values
- Perform side effects on state changes
- Reset state programmatically

### Indeterminate State Example

Common pattern for hierarchical selections:

```jsx
function IndeterminateExample() {
  const [items, setItems] = React.useState([
    { id: 1, checked: false, label: 'Item 1' },
    { id: 2, checked: true, label: 'Item 2' },
    { id: 3, checked: false, label: 'Item 3' },
  ]);

  const allChecked = items.every(item => item.checked);
  const someChecked = items.some(item => item.checked);
  const parentState = allChecked ? true : someChecked ? 'indeterminate' : false;

  const handleParentChange = (checked) => {
    const newCheckedState = checked === true;
    setItems(items.map(item => ({ ...item, checked: newCheckedState })));
  };

  const handleChildChange = (id, checked) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked } : item
    ));
  };

  return (
    <div>
      <Checkbox.Root
        checked={parentState}
        onCheckedChange={handleParentChange}
      >
        <Checkbox.Indicator>
          {parentState === 'indeterminate' ? <MinusIcon /> : <CheckIcon />}
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label>Select All</label>

      <div style={{ marginLeft: 24 }}>
        {items.map(item => (
          <div key={item.id}>
            <Checkbox.Root
              checked={item.checked}
              onCheckedChange={(checked) => handleChildChange(item.id, checked)}
            >
              <Checkbox.Indicator>
                <CheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label>{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Data Attributes for Reading State

Both Root and Indicator expose data attributes that can be used for:

1. **CSS styling** (see Styling Approaches section)
2. **JavaScript queries**:
```javascript
const checkbox = document.querySelector('[role="checkbox"]');
const isChecked = checkbox.dataset.state === 'checked';
const isDisabled = 'disabled' in checkbox.dataset;
```

3. **Testing**:
```javascript
// Playwright/Cypress
await expect(page.locator('[data-state="checked"]')).toBeVisible();
```

## 7. Styling Approaches

Since Radix Primitives are completely unstyled, you have full control over appearance. Here are the recommended approaches:

### Using Data Attributes (Recommended)

Data attributes provide semantic state selectors:

```css
/* Target checked state */
.checkbox-root[data-state="checked"] {
  background-color: #0066cc;
  border-color: #0066cc;
}

/* Target unchecked state */
.checkbox-root[data-state="unchecked"] {
  background-color: white;
  border-color: #333;
}

/* Target indeterminate state */
.checkbox-root[data-state="indeterminate"] {
  background-color: #ffa500;
  border-color: #ffa500;
}

/* Target disabled state */
.checkbox-root[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Combine states */
.checkbox-root[data-state="checked"][data-disabled] {
  background-color: #cccccc;
}
```

### CSS-in-JS with Emotion

```jsx
import { css } from '@emotion/react';
import * as Checkbox from '@radix-ui/react-checkbox';

const rootStyles = css`
  width: 20px;
  height: 20px;
  border: 2px solid #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    border-color: #0066cc;
  }

  &:focus-visible {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }

  &[data-state="checked"] {
    background-color: #0066cc;
    border-color: #0066cc;
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function EmotionCheckbox() {
  return (
    <Checkbox.Root css={rootStyles}>
      <Checkbox.Indicator>
        <CheckIcon />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}
```

### Tailwind CSS with Data Attributes

```jsx
<Checkbox.Root
  className="
    w-5 h-5
    border-2 border-gray-800
    rounded
    flex items-center justify-center
    bg-white
    cursor-pointer
    transition-all
    hover:border-blue-600
    focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2
    data-[state=checked]:bg-blue-600
    data-[state=checked]:border-blue-600
    data-[state=indeterminate]:bg-orange-500
    data-[state=indeterminate]:border-orange-500
    data-[disabled]:opacity-50
    data-[disabled]:cursor-not-allowed
  "
>
  <Checkbox.Indicator className="text-white">
    <CheckIcon />
  </Checkbox.Indicator>
</Checkbox.Root>
```

### Styled Components

```jsx
import styled from 'styled-components';
import * as Checkbox from '@radix-ui/react-checkbox';

const StyledRoot = styled(Checkbox.Root)`
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background};
  cursor: pointer;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  &[data-state="checked"] {
    background-color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
  }

  &[data-state="indeterminate"] {
    background-color: ${props => props.theme.colors.warning};
    border-color: ${props => props.theme.colors.warning};
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledIndicator = styled(Checkbox.Indicator)`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;
```

### Animation Examples

Using CSS transitions:

```css
.checkbox-root {
  transition: background-color 150ms ease, border-color 150ms ease;
}

.checkbox-indicator {
  /* Scale animation when appearing */
  animation: scaleIn 150ms ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
```

Using `forceMount` with custom animations:

```jsx
import { css, keyframes } from '@emotion/react';

const scaleIn = keyframes`
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const scaleOut = keyframes`
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0); opacity: 0; }
`;

const indicatorStyles = (state) => css`
  animation: ${state === 'checked' ? scaleIn : scaleOut} 150ms ease;
`;

function AnimatedCheckbox() {
  const [checked, setChecked] = React.useState(false);

  return (
    <Checkbox.Root checked={checked} onCheckedChange={setChecked}>
      <Checkbox.Indicator forceMount css={indicatorStyles(checked ? 'checked' : 'unchecked')}>
        <CheckIcon />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}
```

## 8. Accessibility

### Built-in ARIA Attributes

Radix Checkbox implements the WAI-ARIA Tri-state Checkbox pattern automatically:

**Rendered HTML** (example):
```html
<button
  type="button"
  role="checkbox"
  aria-checked="true"
  data-state="checked"
  id="terms"
  value="on"
>
  <span data-state="checked">
    <!-- CheckIcon -->
  </span>
</button>
<input type="checkbox" name="terms" value="on" checked hidden />
```

**Automatic attributes**:
- `role="checkbox"` - Identifies element as a checkbox to assistive technology
- `aria-checked="true|false|mixed"` - Communicates current state (mixed = indeterminate)
- `type="button"` - Prevents form submission on click
- Hidden native `<input>` - Ensures form compatibility and native browser features

### Keyboard Support

| Key | Action |
|-----|--------|
| `Space` | Toggles the checkbox between checked and unchecked states |
| `Tab` | Moves focus to/from the checkbox (standard focus management) |

**Focus Behavior**:
- Checkbox receives focus when tabbed to
- Visual focus indicator should be styled with `:focus-visible`
- Space key toggles state while focused

### Screen Reader Support

**State Announcements**:
- "Checkbox, checked" - When state is checked
- "Checkbox, not checked" - When state is unchecked
- "Checkbox, mixed" - When state is indeterminate
- "Checkbox, checked, dimmed" - When checked and disabled

**Label Association**:

```jsx
// Method 1: Using htmlFor (recommended)
<div>
  <Checkbox.Root id="agree">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
  </Checkbox.Root>
  <label htmlFor="agree">I agree to the terms</label>
</div>

// Method 2: Using aria-label
<Checkbox.Root aria-label="I agree to the terms">
  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
</Checkbox.Root>

// Method 3: Using aria-labelledby
<div>
  <Checkbox.Root aria-labelledby="terms-label">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
  </Checkbox.Root>
  <span id="terms-label">I agree to the terms</span>
</div>
```

### Form Integration

The component automatically renders a hidden native `<input type="checkbox">` when placed inside a `<form>`:

```jsx
<form onSubmit={(e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(formData.get('terms')); // "on" if checked, null if unchecked
}}>
  <Checkbox.Root name="terms" value="yes">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
  </Checkbox.Root>
  <button type="submit">Submit</button>
</form>
```

**Form validation**:
```jsx
<Checkbox.Root required name="consent">
  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
</Checkbox.Root>
```

### Additional ARIA Attributes

You can add supplementary ARIA attributes as needed:

```jsx
<Checkbox.Root
  aria-label="Accept terms and conditions"
  aria-describedby="terms-description"
  aria-invalid={hasError}
>
  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
</Checkbox.Root>
<p id="terms-description">
  You must accept our terms to continue
</p>
```

## 9. Best Practices

### When to Use Primitives vs Themes

**Use Radix Primitives (Checkbox) when**:
- You have an existing design system with specific visual requirements
- You need complete control over styling and animations
- You're building a custom component library
- Your design doesn't match any pre-built theme
- You want minimal bundle size (tree-shakeable, no style overhead)
- You need to integrate with specific CSS frameworks or styling solutions

**Use Radix Themes (Checkbox) when**:
- You want to build quickly without styling components from scratch
- You're prototyping or building internal tools
- You're comfortable with the Radix Themes design language
- You want consistent styling across components out of the box
- You prefer configuration over implementation

### Composition Patterns

#### Pattern 1: Reusable Checkbox Component

```jsx
// components/Checkbox.jsx
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import './checkbox.css';

export function Checkbox({ label, id, ...props }) {
  const checkboxId = id || `checkbox-${Math.random()}`;

  return (
    <div className="checkbox-wrapper">
      <RadixCheckbox.Root
        className="checkbox-root"
        id={checkboxId}
        {...props}
      >
        <RadixCheckbox.Indicator className="checkbox-indicator">
          <CheckIcon />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && (
        <label htmlFor={checkboxId} className="checkbox-label">
          {label}
        </label>
      )}
    </div>
  );
}

// Usage
<Checkbox label="Accept terms" name="terms" required />
```

#### Pattern 2: Checkbox Group Component

```jsx
export function CheckboxGroup({ items, value, onChange, label }) {
  const handleChange = (itemValue, checked) => {
    const newValue = checked
      ? [...value, itemValue]
      : value.filter(v => v !== itemValue);
    onChange(newValue);
  };

  return (
    <fieldset>
      <legend>{label}</legend>
      {items.map(item => (
        <Checkbox
          key={item.value}
          label={item.label}
          checked={value.includes(item.value)}
          onCheckedChange={(checked) => handleChange(item.value, checked)}
        />
      ))}
    </fieldset>
  );
}

// Usage
<CheckboxGroup
  label="Select features"
  items={[
    { label: 'Dark mode', value: 'dark' },
    { label: 'Notifications', value: 'notifications' },
  ]}
  value={selectedFeatures}
  onChange={setSelectedFeatures}
/>
```

#### Pattern 3: Checkbox with Description

```jsx
export function CheckboxWithDescription({ label, description, ...props }) {
  const id = `checkbox-${Math.random()}`;
  const descId = `${id}-description`;

  return (
    <div className="checkbox-with-description">
      <Checkbox
        {...props}
        id={id}
        aria-describedby={descId}
      />
      <div>
        <label htmlFor={id}>{label}</label>
        <p id={descId} className="checkbox-description">
          {description}
        </p>
      </div>
    </div>
  );
}
```

### Common Pitfalls & Solutions

**Pitfall 1: Forgetting to style the component**
```jsx
// ❌ Bad - Checkbox will be unstyled and nearly invisible
<Checkbox.Root>
  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
</Checkbox.Root>

// ✅ Good - Always provide styling
<Checkbox.Root className="styled-checkbox">
  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
</Checkbox.Root>
```

**Pitfall 2: Not providing a label**
```jsx
// ❌ Bad - Inaccessible to screen readers
<Checkbox.Root />

// ✅ Good - Always associate with a label
<Checkbox.Root id="terms" aria-label="Accept terms" />
// or
<label>
  <Checkbox.Root /> Accept terms
</label>
```

**Pitfall 3: Using wrong indicator content for indeterminate state**
```jsx
// ❌ Bad - Confusing to users
<Checkbox.Root checked="indeterminate">
  <Checkbox.Indicator>
    <CheckIcon />  {/* Checkmark doesn't communicate "partial" */}
  </Checkbox.Indicator>
</Checkbox.Root>

// ✅ Good - Use minus/dash for indeterminate
<Checkbox.Root checked="indeterminate">
  <Checkbox.Indicator>
    <MinusIcon />  {/* Clearly shows partial state */}
  </Checkbox.Indicator>
</Checkbox.Root>
```

**Pitfall 4: Controlled component without onChange**
```jsx
// ❌ Bad - Component will be locked in place
const [checked, setChecked] = useState(false);
<Checkbox.Root checked={checked} />

// ✅ Good - Always provide onCheckedChange with checked prop
<Checkbox.Root checked={checked} onCheckedChange={setChecked} />
```

### Performance Considerations

**1. Memoize callback functions**:
```jsx
const handleChange = useCallback((checked) => {
  // expensive operation
  updateDatabase(checked);
}, []);

<Checkbox.Root onCheckedChange={handleChange} />
```

**2. Use `asChild` to avoid wrapper elements**:
```jsx
// Creates: <button><span>Custom wrapper</span></button>
<Checkbox.Root>
  <span>Custom wrapper</span>
</Checkbox.Root>

// Creates: <button>Custom wrapper</button>
<Checkbox.Root asChild>
  <CustomButton />
</Checkbox.Root>
```

**3. Conditional rendering vs `forceMount`**:
```jsx
// More performant - indicator not in DOM when unchecked
<Checkbox.Indicator>
  <CheckIcon />
</Checkbox.Indicator>

// Less performant but enables exit animations
<Checkbox.Indicator forceMount>
  <CheckIcon />
</Checkbox.Indicator>
```

### Testing Best Practices

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('checkbox toggles on click', async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();

  render(
    <Checkbox.Root
      onCheckedChange={handleChange}
      aria-label="Test checkbox"
    >
      <Checkbox.Indicator>
        <CheckIcon />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).toHaveAttribute('aria-checked', 'false');

  await user.click(checkbox);

  expect(handleChange).toHaveBeenCalledWith(true);
  expect(checkbox).toHaveAttribute('aria-checked', 'true');
});

test('checkbox responds to keyboard', async () => {
  const user = userEvent.setup();

  render(
    <Checkbox.Root aria-label="Test checkbox">
      <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
    </Checkbox.Root>
  );

  const checkbox = screen.getByRole('checkbox');
  checkbox.focus();

  await user.keyboard('[Space]');

  expect(checkbox).toHaveAttribute('data-state', 'checked');
});
```

## 10. Comparison Notes

### Primitives vs Styled Libraries Philosophy

**Radix Primitives Approach** (Checkbox):
- **Headless/Unstyled**: Zero styling provided, complete visual freedom
- **Composition**: Small, focused components that compose together
- **Flexibility**: Works with any styling solution (CSS, CSS-in-JS, Tailwind, etc.)
- **Bundle Size**: Minimal - only behavior and accessibility code
- **Learning Curve**: Must understand both primitive API and styling approach
- **Control**: Maximum control over every visual detail
- **Use Case**: Building custom design systems from scratch

**Styled Libraries Approach** (e.g., Material-UI, Ant Design, Chakra):
- **Pre-styled**: Ships with complete visual design
- **All-in-one**: Single component handles behavior + styling
- **Theme System**: Customization through theme configuration
- **Bundle Size**: Larger - includes all styles and theming infrastructure
- **Learning Curve**: Learn component API and theme system
- **Control**: Limited to theme customization options
- **Use Case**: Rapid development with opinionated design

### Radix Primitives vs Radix Themes

Both are from the same Radix team, serving different needs:

**Radix Primitives (Checkbox)**:
```jsx
// You provide ALL styling
import * as Checkbox from '@radix-ui/react-checkbox';

<Checkbox.Root className="custom-checkbox">
  <Checkbox.Indicator className="custom-indicator">
    <CheckIcon />
  </Checkbox.Indicator>
</Checkbox.Root>
```

**Radix Themes (Checkbox)**:
```jsx
// Styling provided, you customize via props
import { Checkbox } from '@radix-ui/themes';

<Checkbox defaultChecked size="2" variant="soft" color="blue" />
```

| Aspect | Radix Primitives | Radix Themes |
|--------|-----------------|--------------|
| **Styling** | None - fully unstyled | Complete design system included |
| **Customization** | Unlimited - style from scratch | Theme tokens and prop variants |
| **Bundle Size** | Minimal (~5-10kb) | Larger (~50-100kb with styles) |
| **Setup Time** | Slower - requires styling | Faster - works immediately |
| **Design Control** | Complete freedom | Limited to theme system |
| **Best For** | Custom design systems | Rapid prototyping, internal tools |
| **Package** | `@radix-ui/react-checkbox` | `@radix-ui/themes` |

**When to migrate from one to the other**:

Primitives → Themes:
- Prototyping phase is over, need faster iteration
- Design requirements simplified to match Radix design language
- Team prefers configuration over implementation

Themes → Primitives:
- Need design customization beyond theme tokens
- Reducing bundle size is critical
- Integrating with existing design system
- Require specific styling solution (e.g., CSS Modules, Tailwind)

### Comparison with Other Headless UI Libraries

**Radix vs Headless UI** (by Tailwind Labs):

| Feature | Radix Primitives | Headless UI |
|---------|-----------------|-------------|
| **Framework** | React only | React, Vue |
| **Composition** | Multi-part (`Root`, `Indicator`) | Single component with render props |
| **TypeScript** | Fully typed | Fully typed |
| **Accessibility** | WAI-ARIA compliant | WAI-ARIA compliant |
| **Bundle Size** | Slightly smaller | Slightly larger |
| **Ecosystem** | Primitives + Themes | Tailwind ecosystem |

**Radix vs Reach UI**:

| Feature | Radix Primitives | Reach UI |
|---------|-----------------|----------|
| **Active Development** | Very active | Maintenance mode |
| **Styling** | Completely unstyled | Minimal base styles |
| **Granularity** | Highly granular parts | More monolithic |
| **Documentation** | Excellent | Good |

**Radix vs React Aria** (by Adobe):

| Feature | Radix Primitives | React Aria |
|---------|-----------------|------------|
| **Approach** | Component-based | Hook-based |
| **Learning Curve** | Easier | Steeper |
| **Flexibility** | High | Very high |
| **Bundle Size** | Smaller | Larger (more features) |

### Key Differentiators of Radix Primitives

1. **Composition over Configuration**: Multi-part components give granular control
2. **Data Attributes**: Semantic state exposed via `data-*` attributes for styling
3. **Tree Shakeable**: Import only what you need
4. **Framework Agnostic Styling**: Works with any styling solution
5. **Consistent API**: Patterns learned in Checkbox apply to all Radix components
6. **No Style Opinions**: Truly zero styling - not even resets

---

## Summary

Radix UI Checkbox Primitives represents a **headless component philosophy** that separates behavior/accessibility from visual presentation. This approach offers:

**Strengths**:
- Complete visual control and design system integration
- Maximum flexibility in styling approach
- Minimal bundle size impact
- Production-ready accessibility
- Framework-agnostic (works with any styling solution)

**Considerations**:
- Requires more initial setup than styled libraries
- Team must implement and maintain styling layer
- Longer time-to-first-render in prototyping phase

**The Primitives Philosophy**: Radix Primitives views components as foundational building blocks that handle the complex, error-prone aspects of UI development (accessibility, keyboard navigation, state management, ARIA attributes) while leaving creative visual expression entirely to the developer. This "separation of concerns" between behavior and appearance makes them ideal for:
- Design system foundations
- Applications with strict brand requirements
- Teams that want styling flexibility without sacrificing accessibility
- Projects that need to support multiple visual themes

By providing robust, accessible, unstyled primitives, Radix enables developers to focus on design implementation rather than reinventing accessibility and interaction patterns for each project.
