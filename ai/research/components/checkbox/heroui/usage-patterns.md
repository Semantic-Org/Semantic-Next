# HeroUI Checkbox Component - Usage Patterns

**Component:** Checkbox
**Framework:** HeroUI (NextUI)
**Documentation:** https://www.heroui.com/docs/components/checkbox
**Research Date:** 2025-11-04

---

## 1. Component Overview

The HeroUI Checkbox component is a fully accessible form control that enables users to select multiple items from a list or mark individual items as selected. It's built on native HTML `<input type="checkbox">` elements with React Aria integration for enhanced accessibility and user experience. The component supports controlled and uncontrolled modes, provides comprehensive state management (including indeterminate states), and offers extensive customization through Tailwind CSS classes and slot-based styling. It integrates seamlessly with popular form libraries like Formik and React Hook Form.

---

## 2. Basic Usage

### Minimal Example
```jsx
import { Checkbox } from "@heroui/react";

export default function App() {
  return <Checkbox defaultSelected>Option</Checkbox>;
}
```

### Uncontrolled with Default State
```jsx
<Checkbox defaultSelected>Subscribe to newsletter</Checkbox>
```

### Controlled Component
```jsx
const [isSelected, setIsSelected] = React.useState(false);

<Checkbox
  isSelected={isSelected}
  onValueChange={setIsSelected}
>
  Subscribe to newsletter
</Checkbox>
```

### With Event Handlers
```jsx
<Checkbox
  defaultSelected
  onChange={(e) => console.log('Native event:', e.target.checked)}
  onValueChange={(isSelected) => console.log('React state:', isSelected)}
>
  Accept terms
</Checkbox>
```

---

## 3. Props/API Reference

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Label text content for the checkbox |
| `isSelected` | `boolean` | — | Controlled selection state |
| `defaultSelected` | `boolean` | — | Initial uncontrolled selection state |
| `isDisabled` | `boolean` | `false` | Disables user interaction |
| `isReadOnly` | `boolean` | — | Allows selection but prevents changes |
| `isRequired` | `boolean` | `false` | Marks as required for form submission |
| `isIndeterminate` | `boolean` | — | Sets partial selection state (overrides appearance) |
| `isInvalid` | `boolean` | `false` | Displays error/invalid state styling |
| `validationState` | `valid \| invalid` | — | Deprecated - use `isInvalid` instead |

### Visual Customization Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `sm \| md \| lg` | `md` | Controls checkbox dimensions |
| `color` | `default \| primary \| secondary \| success \| warning \| danger` | `primary` | Visual color scheme |
| `radius` | `none \| sm \| md \| lg \| full` | — | Border radius styling |
| `lineThrough` | `boolean` | `false` | Applies strikethrough to label text when selected |
| `disableAnimation` | `boolean` | `false` | Removes transition/animation effects |

### Advanced Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `CheckboxIconProps` | — | Custom check icon component |
| `classNames` | `Record<slot, string>` | — | Tailwind classes for each slot |

### Event Handlers

| Event | Type | Description |
|-------|------|-------------|
| `onChange` | `React.ChangeEvent<HTMLInputElement>` | Native HTML change event |
| `onValueChange` | `(isSelected: boolean) => void` | React-specific selection state callback |

---

## 4. Variants & Patterns

### Size Variants

Three size options control the checkbox dimensions:

```jsx
<Checkbox defaultSelected size="sm">Small checkbox</Checkbox>
<Checkbox defaultSelected size="md">Medium checkbox (default)</Checkbox>
<Checkbox defaultSelected size="lg">Large checkbox</Checkbox>
```

**Usage Guidelines:**
- `sm`: Compact UIs, dense data tables, mobile interfaces
- `md`: Standard forms and lists (default)
- `lg`: Prominent actions, accessibility requirements, touch interfaces

### Color Variants

Six semantic color schemes are available:

```jsx
<Checkbox defaultSelected color="default">Default</Checkbox>
<Checkbox defaultSelected color="primary">Primary</Checkbox>
<Checkbox defaultSelected color="secondary">Secondary</Checkbox>
<Checkbox defaultSelected color="success">Success</Checkbox>
<Checkbox defaultSelected color="warning">Warning</Checkbox>
<Checkbox defaultSelected color="danger">Danger</Checkbox>
```

**Semantic Meanings:**
- `default`: Neutral, low-emphasis selections
- `primary`: Main brand actions, primary selections
- `secondary`: Alternative options, secondary features
- `success`: Confirmations, completed tasks, positive actions
- `warning`: Cautionary selections, important notices
- `danger`: Critical actions, destructive operations, errors

### Radius Variants

Five border radius options for visual customization:

```jsx
<Checkbox defaultSelected radius="none">Sharp corners</Checkbox>
<Checkbox defaultSelected radius="sm">Small radius</Checkbox>
<Checkbox defaultSelected radius="md">Medium radius</Checkbox>
<Checkbox defaultSelected radius="lg">Large radius</Checkbox>
<Checkbox defaultSelected radius="full">Fully rounded</Checkbox>
```

### Checkbox Groups

HeroUI provides a separate `CheckboxGroup` component for managing multiple related checkboxes:

```jsx
import { CheckboxGroup, Checkbox } from "@heroui/react";

<CheckboxGroup label="Select features">
  <Checkbox value="feature1">Feature 1</Checkbox>
  <Checkbox value="feature2">Feature 2</Checkbox>
  <Checkbox value="feature3">Feature 3</Checkbox>
</CheckboxGroup>
```

**Note:** Detailed CheckboxGroup documentation is available at the dedicated page. The group component handles array value management, group-level validation, and coordinated state.

### Indeterminate State

The indeterminate state represents partial selection, commonly used in hierarchical checkbox trees:

```jsx
<Checkbox isIndeterminate>
  Partial selection (some children selected)
</Checkbox>
```

**Key Behaviors:**
- Overrides the checkbox appearance with a minus/dash icon
- Remains indeterminate until explicitly set to `false`
- Does not automatically change based on selection state
- Useful for parent checkboxes in tree structures

**Example Use Case:**
```jsx
// Parent checkbox shows indeterminate when some (but not all) children are selected
const [children, setChildren] = useState({
  child1: true,
  child2: false,
  child3: false
});

const allSelected = Object.values(children).every(v => v);
const someSelected = Object.values(children).some(v => v);
const isIndeterminate = someSelected && !allSelected;

<Checkbox
  isSelected={allSelected}
  isIndeterminate={isIndeterminate}
  onValueChange={(checked) => {
    setChildren({ child1: checked, child2: checked, child3: checked });
  }}
>
  Select all
</Checkbox>
```

### Disabled State

Prevents user interaction while maintaining visual feedback:

```jsx
<Checkbox isDisabled>Unselected and disabled</Checkbox>
<Checkbox defaultSelected isDisabled>Selected and disabled</Checkbox>
```

**Visual Characteristics:**
- Reduced opacity
- No hover effects
- No pointer cursor
- Cannot be changed via keyboard or mouse
- Still participates in form submission (if form library supports it)

### Invalid/Error States

Indicates validation errors or invalid input:

```jsx
<Checkbox isInvalid>
  This selection has an error
</Checkbox>

<Checkbox
  defaultSelected
  isInvalid
  color="danger"
>
  Invalid selection
</Checkbox>
```

**Use Cases:**
- Form validation errors
- Business rule violations
- Required field not checked
- Mutually exclusive constraint violations

### Line-Through Styles

Applies strikethrough text decoration to the label when selected:

```jsx
<Checkbox defaultSelected lineThrough>
  Completed task
</Checkbox>
```

**Common Use Cases:**
- Todo lists and task completion
- Item selection for deletion
- Completed checklist items
- Archived or dismissed notifications

### Icon Customization

Replace the default check icon with custom components:

```jsx
const HeartIcon = ({ isSelected, isIndeterminate, ...otherProps }) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width="1em"
    {...otherProps}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

<Checkbox icon={<HeartIcon />} defaultSelected color="danger">
  Favorite
</Checkbox>
```

**Important Notes:**
- Custom icon receives props: `isSelected`, `isIndeterminate`, `disableAnimation`, `className`
- **Do not pass these props directly to DOM elements** - they're for component logic only
- Icon should handle both selected and unselected states
- Must support `className` for proper styling integration

### Tailwind-Specific Patterns

HeroUI Checkbox integrates deeply with Tailwind CSS through the `classNames` prop, which targets specific component slots:

```jsx
<Checkbox
  classNames={{
    base: "inline-flex max-w-md w-full bg-content1 m-0 hover:bg-content2 items-center justify-start cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent data-[selected=true]:border-primary",
    label: "w-full text-sm font-medium text-foreground",
    icon: "w-4 h-4 text-white",
    wrapper: "w-5 h-5 border-2 rounded"
  }}
>
  Custom styled with Tailwind
</Checkbox>
```

**Available Slots:**
- `base`: Root wrapper, controls layout and hover states
- `wrapper`: Inner container around the checkbox visual
- `icon`: The check/indeterminate icon element
- `label`: The text label element
- `hiddenInput`: The native input (usually stays hidden)

**Tailwind Patterns:**
```jsx
// Responsive sizing
classNames={{
  base: "p-2 sm:p-3 md:p-4"
}}

// State-based styling with data attributes
classNames={{
  base: "data-[selected=true]:bg-primary-100 data-[disabled=true]:opacity-40"
}}

// Custom focus rings
classNames={{
  wrapper: "ring-offset-2 focus-visible:ring-2 ring-primary"
}}

// Dark mode support
classNames={{
  label: "text-foreground dark:text-foreground-dark"
}}
```

### Data Attributes for Styling

HeroUI applies data attributes to the base element for state-based CSS styling:

| Attribute | Condition | Usage |
|-----------|-----------|-------|
| `data-selected` | When checked | `data-[selected=true]:bg-primary` |
| `data-pressed` | During interaction | `data-[pressed=true]:scale-95` |
| `data-invalid` | Validation error | `data-[invalid=true]:border-danger` |
| `data-readonly` | Read-only state | `data-[readonly=true]:cursor-not-allowed` |
| `data-indeterminate` | Partial selection | `data-[indeterminate=true]:bg-warning` |
| `data-hover` | Mouse over | `data-[hover=true]:bg-content2` |
| `data-focus` | Any focus | `data-[focus=true]:outline` |
| `data-focus-visible` | Keyboard focus | `data-[focus-visible=true]:ring-2` |
| `data-disabled` | Disabled state | `data-[disabled=true]:opacity-50` |
| `data-loading` | Loading state | `data-[loading=true]:animate-pulse` |

**Example Usage:**
```jsx
<Checkbox
  classNames={{
    base: cn(
      "border-2 border-transparent p-4",
      "data-[selected=true]:border-primary",
      "data-[hover=true]:bg-content2",
      "data-[disabled=true]:cursor-not-allowed"
    )
  }}
>
  Styled with data attributes
</Checkbox>
```

---

## 5. Composition Patterns

### Form Integration

**With React Hook Form:**
```jsx
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "@heroui/react";

function MyForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="terms"
        control={control}
        rules={{ required: "You must accept terms" }}
        render={({ field, fieldState }) => (
          <Checkbox
            {...field}
            isSelected={field.value}
            onValueChange={field.onChange}
            isInvalid={!!fieldState.error}
          >
            I accept the terms and conditions
          </Checkbox>
        )}
      />
    </form>
  );
}
```

**With Formik:**
```jsx
import { Formik, Form } from "formik";
import { Checkbox } from "@heroui/react";

<Formik initialValues={{ newsletter: false }}>
  {({ values, setFieldValue }) => (
    <Form>
      <Checkbox
        isSelected={values.newsletter}
        onValueChange={(checked) => setFieldValue("newsletter", checked)}
      >
        Subscribe to newsletter
      </Checkbox>
    </Form>
  )}
</Formik>
```

### Permission Matrices

```jsx
const permissions = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" }
];

const [userPermissions, setUserPermissions] = useState(new Set(["read"]));

<div className="flex flex-col gap-2">
  {permissions.map((perm) => (
    <Checkbox
      key={perm.id}
      isSelected={userPermissions.has(perm.id)}
      onValueChange={(checked) => {
        const newPerms = new Set(userPermissions);
        checked ? newPerms.add(perm.id) : newPerms.delete(perm.id);
        setUserPermissions(newPerms);
      }}
    >
      {perm.label}
    </Checkbox>
  ))}
</div>
```

### Task Lists with Line-Through

```jsx
const [tasks, setTasks] = useState([
  { id: 1, text: "Design mockups", completed: true },
  { id: 2, text: "Implement feature", completed: false },
  { id: 3, text: "Write tests", completed: false }
]);

<div className="flex flex-col gap-2">
  {tasks.map((task) => (
    <Checkbox
      key={task.id}
      isSelected={task.completed}
      lineThrough
      color={task.completed ? "success" : "default"}
      onValueChange={(checked) => {
        setTasks(tasks.map(t =>
          t.id === task.id ? { ...t, completed: checked } : t
        ));
      }}
    >
      {task.text}
    </Checkbox>
  ))}
</div>
```

### Hierarchical Selection with Indeterminate

```jsx
function HierarchicalCheckbox() {
  const [children, setChildren] = useState({
    feature1: true,
    feature2: false,
    feature3: true
  });

  const allSelected = Object.values(children).every(Boolean);
  const someSelected = Object.values(children).some(Boolean);
  const isIndeterminate = someSelected && !allSelected;

  const toggleAll = (checked) => {
    setChildren({
      feature1: checked,
      feature2: checked,
      feature3: checked
    });
  };

  const toggleChild = (key) => (checked) => {
    setChildren({ ...children, [key]: checked });
  };

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        isSelected={allSelected}
        isIndeterminate={isIndeterminate}
        onValueChange={toggleAll}
      >
        Select all features
      </Checkbox>

      <div className="ml-6 flex flex-col gap-1">
        <Checkbox
          isSelected={children.feature1}
          onValueChange={toggleChild("feature1")}
        >
          Feature 1
        </Checkbox>
        <Checkbox
          isSelected={children.feature2}
          onValueChange={toggleChild("feature2")}
        >
          Feature 2
        </Checkbox>
        <Checkbox
          isSelected={children.feature3}
          onValueChange={toggleChild("feature3")}
        >
          Feature 3
        </Checkbox>
      </div>
    </div>
  );
}
```

---

## 6. Styling & Theming

### Slot-Based Customization

HeroUI uses a slot-based styling system that allows precise control over each part of the component:

```jsx
<Checkbox
  classNames={{
    base: [
      "inline-flex max-w-md w-full bg-content1",
      "hover:bg-content2 items-center justify-start",
      "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
      "data-[selected=true]:border-primary"
    ],
    label: "w-full text-sm font-medium text-foreground",
    icon: "w-4 h-4 text-white",
    wrapper: [
      "w-5 h-5 border-2 rounded",
      "after:bg-primary after:text-white",
      "group-data-[selected=true]:border-primary"
    ]
  }}
>
  Fully customized checkbox
</Checkbox>
```

### CSS Variables Integration

HeroUI components respect CSS custom properties for theming:

```css
/* Global theme customization */
:root {
  --heroui-primary: 220 100% 50%;
  --heroui-primary-foreground: 0 0% 100%;
  --heroui-content1: 0 0% 100%;
  --heroui-content2: 0 0% 98%;
}

.dark {
  --heroui-primary: 220 100% 60%;
  --heroui-content1: 0 0% 10%;
  --heroui-content2: 0 0% 15%;
}
```

### Advanced Custom Implementation

For complete control, use the `useCheckbox` hook:

```jsx
import { useCheckbox, VisuallyHidden } from "@heroui/react";

function CustomCheckbox(props) {
  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps
  } = useCheckbox(props);

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>

      <div className={cn(
        "border-2 rounded w-5 h-5 flex items-center justify-center",
        isSelected ? "bg-primary border-primary" : "bg-transparent border-default",
        isFocusVisible && "ring-2 ring-primary ring-offset-2"
      )}>
        {isSelected && <CheckIcon />}
      </div>

      <span {...getLabelProps()}>{children}</span>
    </label>
  );
}
```

### Responsive Design Patterns

```jsx
<Checkbox
  size="sm"
  classNames={{
    base: "p-2 sm:p-3 md:p-4",
    label: "text-xs sm:text-sm md:text-base"
  }}
>
  Responsive checkbox
</Checkbox>
```

### Animation Customization

```jsx
// Disable all animations
<Checkbox disableAnimation>No animation</Checkbox>

// Custom animation with Tailwind
<Checkbox
  classNames={{
    wrapper: "transition-all duration-500 ease-in-out",
    icon: "transition-transform duration-300"
  }}
>
  Custom animation timing
</Checkbox>
```

---

## 7. Accessibility

### ARIA Attributes

HeroUI Checkbox automatically provides comprehensive ARIA support:

- **`role="checkbox"`**: Implicitly provided by native `<input type="checkbox">`
- **`aria-checked`**: Reflects selection state (`true`, `false`, or `mixed` for indeterminate)
- **`aria-invalid`**: Set when `isInvalid` prop is true
- **`aria-required`**: Set when `isRequired` prop is true
- **`aria-disabled`**: Set when `isDisabled` prop is true
- **`aria-readonly`**: Set when `isReadOnly` prop is true

### Keyboard Support

Full keyboard navigation is supported out of the box:

| Key | Action |
|-----|--------|
| `Tab` | Moves focus to/from the checkbox |
| `Space` | Toggles the checkbox selection state |
| `Enter` | (In forms) Submits the form |

### Screen Reader Support

- Label text is properly associated with the input
- State changes are announced ("checked", "unchecked", "mixed")
- Invalid state is announced with error descriptions
- Required fields are announced as "required"
- Disabled state prevents interaction and is announced

### Focus Management

```jsx
// Programmatic focus
const checkboxRef = useRef(null);

<Checkbox ref={checkboxRef}>Focus target</Checkbox>

// Focus on mount
useEffect(() => {
  checkboxRef.current?.focus();
}, []);
```

### Visual Focus Indicators

HeroUI provides two types of focus:

1. **Mouse/Touch Focus (`data-focus`)**: Subtle outline
2. **Keyboard Focus (`data-focus-visible`)**: Prominent ring

```jsx
<Checkbox
  classNames={{
    wrapper: cn(
      // Only show prominent ring for keyboard navigation
      "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      // Subtle focus for mouse users
      "focus:outline-none focus:shadow-sm"
    )
  }}
>
  Accessible focus styles
</Checkbox>
```

### Color Contrast

All color variants meet WCAG 2.1 Level AA standards:
- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text and UI components
- Enhanced contrast in disabled states maintains visibility

### Best Practices for Accessibility

1. **Always provide meaningful labels**
   ```jsx
   <Checkbox>Clear, descriptive label text</Checkbox>
   ```

2. **Use `isRequired` for required fields**
   ```jsx
   <Checkbox isRequired>I accept terms (required)</Checkbox>
   ```

3. **Provide error messages with `isInvalid`**
   ```jsx
   <Checkbox isInvalid>
     {error ? "Please check this box" : "Required field"}
   </Checkbox>
   ```

4. **Group related checkboxes with proper labels**
   ```jsx
   <CheckboxGroup label="Select your interests">
     <Checkbox value="tech">Technology</Checkbox>
     <Checkbox value="art">Art</Checkbox>
   </CheckboxGroup>
   ```

5. **Don't rely solely on color**
   ```jsx
   // Good: Uses icon + color + text
   <Checkbox color="danger" icon={<WarningIcon />}>
     Delete all data (cannot be undone)
   </Checkbox>
   ```

---

## 8. Best Practices

### When to Use Checkboxes

**Use checkboxes when:**
- Users can select zero, one, or multiple options from a list
- Each option is independent of others
- Users need to see all available options at once
- Selection state should be immediately visible
- The action can be undone or isn't critical

**Don't use checkboxes when:**
- Only one option can be selected (use Radio instead)
- The action is binary on/off toggle (use Switch instead)
- Options are mutually exclusive
- The list is very long (consider Select/Dropdown instead)

### State Management Patterns

**Controlled vs Uncontrolled:**
```jsx
// Uncontrolled: Simple forms, rapid prototyping
<Checkbox defaultSelected>Uncontrolled</Checkbox>

// Controlled: Complex validation, external state
<Checkbox
  isSelected={state}
  onValueChange={setState}
>
  Controlled
</Checkbox>
```

**Choose controlled when:**
- Validation depends on multiple fields
- State is managed by external libraries (Redux, Zustand)
- Parent component needs to react to changes
- Need to reset/manipulate state programmatically

### Performance Optimization

```jsx
// Memoize change handlers in lists
const handleChange = useCallback((id) => (checked) => {
  setItems(items => items.map(item =>
    item.id === id ? { ...item, checked } : item
  ));
}, []);

// Use keys properly
{items.map(item => (
  <Checkbox
    key={item.id}
    onValueChange={handleChange(item.id)}
  >
    {item.label}
  </Checkbox>
))}

// Consider virtualization for very long lists
<VirtualList>
  {virtualItems.map(item => (
    <Checkbox key={item.id}>{item.label}</Checkbox>
  ))}
</VirtualList>
```

### Common Pitfalls

1. **Don't mix controlled and uncontrolled:**
   ```jsx
   // Bad: Has both isSelected and defaultSelected
   <Checkbox isSelected={state} defaultSelected>...</Checkbox>

   // Good: Pick one
   <Checkbox isSelected={state}>...</Checkbox>
   ```

2. **Don't use for binary toggles:**
   ```jsx
   // Bad: Single checkbox for settings
   <Checkbox>Enable dark mode</Checkbox>

   // Good: Use Switch for toggles
   <Switch>Enable dark mode</Switch>
   ```

3. **Don't forget labels:**
   ```jsx
   // Bad: No accessible label
   <Checkbox />

   // Good: Always provide label
   <Checkbox>Clear label text</Checkbox>
   ```

4. **Don't override data attributes improperly:**
   ```jsx
   // Bad: Prevents internal state management
   <Checkbox data-selected="true">...</Checkbox>

   // Good: Use isSelected prop
   <Checkbox isSelected={true}>...</Checkbox>
   ```

### Validation Patterns

```jsx
function ValidatedCheckbox() {
  const [accepted, setAccepted] = useState(false);
  const [touched, setTouched] = useState(false);
  const error = touched && !accepted;

  return (
    <div>
      <Checkbox
        isRequired
        isInvalid={error}
        isSelected={accepted}
        onValueChange={setAccepted}
        onBlur={() => setTouched(true)}
        color={error ? "danger" : "default"}
      >
        I accept the terms and conditions
      </Checkbox>
      {error && (
        <p className="text-danger text-sm mt-1">
          You must accept the terms to continue
        </p>
      )}
    </div>
  );
}
```

### Loading States

```jsx
// Show loading state while processing
<Checkbox
  isDisabled={isLoading}
  classNames={{
    base: isLoading ? "data-[loading=true]:opacity-60" : ""
  }}
>
  {isLoading ? "Processing..." : "Save changes"}
</Checkbox>
```

---

## 9. Comparison Notes

### Unique Features of HeroUI Checkbox

1. **Slot-Based Styling System**
   - Unlike many checkbox libraries, HeroUI provides granular control through slots
   - Each part of the component (base, wrapper, icon, label) can be styled independently
   - More flexible than single-class approaches

2. **Data Attribute State Management**
   - Rich set of `data-*` attributes for CSS-based state styling
   - Enables complex conditional styling without JavaScript
   - Better for performance and maintainability

3. **Dual Event System**
   - Provides both native `onChange` and React-specific `onValueChange`
   - `onChange`: Full event object for form libraries
   - `onValueChange`: Clean boolean for React state
   - Better form library compatibility than single-event approaches

4. **Native Input Foundation**
   - Built on real `<input type="checkbox">` elements
   - Better browser autofill support
   - Native form participation without extra configuration
   - True accessibility without polyfills

5. **Indeterminate State as First-Class**
   - `isIndeterminate` prop with full styling support
   - Properly announced to screen readers
   - Not an afterthought like in many libraries

6. **Built-in Line-Through**
   - Native `lineThrough` prop for task completion UX
   - No need for custom CSS or wrapper components
   - Semantic and accessible implementation

7. **Comprehensive Color System**
   - Six semantic colors with consistent theming
   - Respects HeroUI design tokens
   - Dark mode support out of the box

### Comparison to Other Libraries

**vs. MUI Checkbox:**
- HeroUI: Tailwind-based, smaller bundle size
- MUI: Emotion/styled-components, larger ecosystem

**vs. Chakra UI Checkbox:**
- HeroUI: More opinionated styling, slot-based system
- Chakra: More flexible composition, style props approach

**vs. Radix UI Checkbox:**
- HeroUI: Higher-level with built-in styles
- Radix: Unstyled primitives, full control

**vs. Ant Design Checkbox:**
- HeroUI: Modern React patterns, better TypeScript
- Ant Design: More enterprise features, larger bundle

**vs. HeadlessUI:**
- HeroUI: Styled by default, rapid development
- HeadlessUI: Completely unstyled, maximum flexibility

### Notable Design Decisions

1. **Controlled vs Uncontrolled Default**
   - Uses `defaultSelected` for uncontrolled (explicit)
   - Better DX than defaulting to controlled

2. **Separate Invalid Prop**
   - `isInvalid` prop separate from `validationState`
   - `validationState` marked as deprecated
   - Cleaner API surface

3. **Animation Control**
   - `disableAnimation` for a11y and performance
   - Respects `prefers-reduced-motion`
   - Animation enabled by default for modern feel

4. **Icon Customization Pattern**
   - Passes state props to custom icons
   - Warning about not spreading props to DOM
   - Balance of flexibility and safety

5. **React Aria Integration**
   - Built on React Aria for solid accessibility
   - Handles edge cases (touch, keyboard, screen readers)
   - Production-ready without extra testing

---

## Key Findings Summary

### Strengths
1. **Comprehensive accessibility** - Built on React Aria with full ARIA support
2. **Flexible styling** - Slot-based system with Tailwind integration and data attributes
3. **Dual event system** - Native onChange + React onValueChange for broad compatibility
4. **First-class indeterminate state** - Properly supported as a primary feature
5. **Native input foundation** - Real checkbox elements for better form integration
6. **Built-in task completion UX** - Line-through prop for common use case
7. **Rich state management** - Data attributes for CSS-based conditional styling

### Notable Patterns
1. **Controlled/uncontrolled modes** - Clear separation with explicit defaultSelected
2. **Custom icon support** - Flexible with safety warnings about prop spreading
3. **Form library compatibility** - Works with React Hook Form and Formik
4. **Hierarchical selection** - Well-designed indeterminate state for tree structures
5. **Responsive and themeable** - Respects CSS custom properties and system preferences

### Use Cases Excel At
- Multi-select lists and feature selection
- Permission matrices and settings panels
- Task completion interfaces (with lineThrough)
- Form validation with clear error states
- Hierarchical data selection (with indeterminate)
- Accessible enterprise applications

### Potential Limitations
- Requires HeroUI ecosystem (not standalone)
- React-specific (no framework-agnostic version)
- CheckboxGroup details limited in this research
- Opinionated styling may require override for custom designs
- Larger bundle than unstyled primitive libraries

---

**Research completed:** 2025-11-04
**Documentation source:** https://www.heroui.com/docs/components/checkbox
**Note:** CheckboxGroup component has separate documentation that was not fully accessible during this research session.
