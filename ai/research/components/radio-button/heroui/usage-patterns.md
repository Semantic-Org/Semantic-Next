# HeroUI - Radio Group Component

## Component Overview

The HeroUI Radio Group component enables users to select a single option from a mutually exclusive list of choices. It provides a complete solution for radio button groups with full accessibility support through React Aria and native HTML input elements.

**Component URL:** https://www.heroui.com/docs/components/radio-group

**Status:** Stable - Full production component with comprehensive documentation

**Core purpose**: Provides an accessible, customizable radio button group for single-option selection from mutually exclusive choices in forms and interfaces.

**Mental model**: A container component (`RadioGroup`) that manages the selection state of multiple child radio buttons (`Radio`), ensuring only one option can be selected at a time. The group handles keyboard navigation, focus management, and validation while individual radios can have their own descriptions and states.

**Semantic meaning**: Represents a form control for selecting exactly one option from a set of mutually exclusive choices. Built on native HTML radio inputs with enhanced styling and accessibility features through React Aria.

## Documentation Quality Assessment

**Strengths:**
- Clear, progressive examples from basic to advanced usage
- Comprehensive prop documentation for both RadioGroup and Radio components
- Excellent accessibility documentation including ARIA patterns
- Custom styling patterns with both simple and advanced approaches
- Form integration guidance with validation patterns
- Data attributes documented for styling hooks

**Completeness:** 9/10
- All major features documented with code examples
- Props table available with types and defaults
- Accessibility features well explained
- Custom implementation patterns shown

**Areas for improvement:**
- Could benefit from more form library integration examples (Formik, React Hook Form)
- Animation/transition patterns not extensively covered
- Limited guidance on complex nested layouts

## Content Patterns

### Text Content

**Label Text:**
- Group label via `label` prop on RadioGroup
- Individual radio labels via children or `label` prop
- Example: `<RadioGroup label="Select your favorite city">`

**Description Text:**
- Group-level descriptions via `description` prop
- Individual radio descriptions via `description` prop
- Provides contextual information beneath labels
- Example: `<Radio description="The capital of Argentina" value="buenos-aires">`

**Helper Text:**
- Group description for overall context
- Individual radio descriptions for option details
- Error messages via `errorMessage` prop when validation fails

### Icon Content

- Icon support through children composition
- Can embed icons alongside text labels
- Custom implementations can include icons in any slot
- No built-in icon props (uses React children pattern)

### Custom Content

**Advanced Layouts:**
- Custom radio components using `useRadio` hook
- Full control over internal structure and styling
- Can include complex layouts with multiple text elements
- Badge, price, or status indicators can be embedded

**Content Slots:**
RadioGroup has slots: `base`, `wrapper`, `label`, `description`, `errorMessage`
Radio has slots: `base`, `wrapper`, `hiddenInput`, `labelWrapper`, `label`, `control`, `description`

## Type Patterns

### Single Radio (Individual)

Individual Radio components can be styled and configured independently:
```jsx
<Radio value="option-id" description="Helper text">
  Option Label
</Radio>
```

Each radio accepts its own props for state overrides (disabled, readonly) while inheriting group-level defaults.

### Radio Group (Container)

RadioGroup manages state and provides shared configuration:
```jsx
<RadioGroup label="Group Label" value={selected} onValueChange={setSelected}>
  <Radio value="opt1">Option 1</Radio>
  <Radio value="opt2">Option 2</Radio>
</RadioGroup>
```

The group controls selection state, validation, orientation, and shared styling.

### Button-Style Radios

Custom implementations can create button-style appearances:
- Use `classNames` prop to style radios as buttons
- `data-[selected=true]` attribute for selected styling
- Flex layouts for card-like or button-like radio options
- Full visual customization through Tailwind classes

## State Patterns

### Disabled State

**Group-level disable:**
```jsx
<RadioGroup isDisabled label="Select option">
  <Radio value="opt1">Option 1</Radio>
  <Radio value="opt2">Option 2</Radio>
</RadioGroup>
```

**Individual radio disable:**
```jsx
<RadioGroup label="Select option">
  <Radio value="opt1">Option 1</Radio>
  <Radio value="opt2" isDisabled>Option 2 (Disabled)</Radio>
</RadioGroup>
```

Disabled radios are not selectable and show reduced opacity.

### Checked/Selected State

**Uncontrolled (default value):**
```jsx
<RadioGroup defaultValue="london">
  <Radio value="london">London</Radio>
  <Radio value="tokyo">Tokyo</Radio>
</RadioGroup>
```

**Controlled state:**
```jsx
const [selected, setSelected] = useState("london");
<RadioGroup value={selected} onValueChange={setSelected}>
  <Radio value="london">London</Radio>
  <Radio value="tokyo">Tokyo</Radio>
</RadioGroup>
```

Only one radio can be selected at a time within a group.

### Error/Invalid State

```jsx
const [selected, setSelected] = useState("london");
const validOptions = ["buenos-aires", "tokyo"];
const isInvalid = !validOptions.includes(selected);

<RadioGroup
  isInvalid={isInvalid}
  errorMessage="Please select a valid city"
  value={selected}
  onValueChange={setSelected}
>
  <Radio value="buenos-aires">Buenos Aires</Radio>
  <Radio value="london">London</Radio>
  <Radio value="tokyo">Tokyo</Radio>
</RadioGroup>
```

Invalid state shows error styling and message.

### Required State

```jsx
<RadioGroup isRequired label="Select your country">
  <Radio value="usa">USA</Radio>
  <Radio value="canada">Canada</Radio>
</RadioGroup>
```

Required prop adds visual indicator and affects form validation.

### Readonly State

```jsx
<RadioGroup isReadOnly value="selected-option">
  <Radio value="selected-option">Selected Option</Radio>
  <Radio value="other-option">Other Option</Radio>
</RadioGroup>
```

Readonly prevents changes but maintains accessibility for reading values.

## Variation Patterns

### Size Variations

**Available sizes:** `sm`, `md` (default), `lg`

```jsx
<RadioGroup size="sm" label="Small radios">
  <Radio value="opt1">Option 1</Radio>
  <Radio value="opt2">Option 2</Radio>
</RadioGroup>

<RadioGroup size="md" label="Medium radios">
  <Radio value="opt1">Option 1</Radio>
  <Radio value="opt2">Option 2</Radio>
</RadioGroup>

<RadioGroup size="lg" label="Large radios">
  <Radio value="opt1">Option 1</Radio>
  <Radio value="opt2">Option 2</Radio>
</RadioGroup>
```

Size affects the radio button circle, text size, and spacing.

### Orientation Options

**Vertical (default):**
```jsx
<RadioGroup label="Select option" orientation="vertical">
  <Radio value="opt1">Option 1</Radio>
  <Radio value="opt2">Option 2</Radio>
</RadioGroup>
```

**Horizontal:**
```jsx
<RadioGroup label="Select option" orientation="horizontal">
  <Radio value="opt1">Option 1</Radio>
  <Radio value="opt2">Option 2</Radio>
</RadioGroup>
```

Orientation controls layout direction of radio options.

### Color Variations

**Available colors:** `default`, `primary` (default), `secondary`, `success`, `warning`, `danger`

```jsx
<RadioGroup color="primary" label="Primary">
  <Radio value="opt1">Option 1</Radio>
</RadioGroup>

<RadioGroup color="secondary" label="Secondary">
  <Radio value="opt1">Option 1</Radio>
</RadioGroup>

<RadioGroup color="success" label="Success">
  <Radio value="opt1">Option 1</Radio>
</RadioGroup>

<RadioGroup color="warning" label="Warning">
  <Radio value="opt1">Option 1</Radio>
</RadioGroup>

<RadioGroup color="danger" label="Danger">
  <Radio value="opt1">Option 1</Radio>
</RadioGroup>
```

Color affects the selected radio button indicator.

### Spacing Variations

Spacing is controlled through Tailwind utility classes:
- Use `className` prop on RadioGroup for outer spacing
- Individual Radio spacing via margins
- Gap between radios controlled by group's flex gap
- Custom layouts through `classNames` prop targeting slots

## Interactive Patterns

### onChange Handler

```jsx
const [selected, setSelected] = useState("london");

<RadioGroup
  value={selected}
  onValueChange={setSelected}
>
  <Radio value="london">London</Radio>
  <Radio value="tokyo">Tokyo</Radio>
</RadioGroup>
```

`onValueChange` callback receives the new selected value string.

### Controlled vs Uncontrolled

**Uncontrolled (internal state):**
```jsx
<RadioGroup defaultValue="london" label="Select city">
  <Radio value="london">London</Radio>
  <Radio value="tokyo">Tokyo</Radio>
</RadioGroup>
```

**Controlled (external state):**
```jsx
const [selected, setSelected] = useState("london");
<RadioGroup value={selected} onValueChange={setSelected}>
  <Radio value="london">London</Radio>
  <Radio value="tokyo">Tokyo</Radio>
</RadioGroup>
```

Controlled mode provides programmatic control over selection.

### Form Integration

**Native form integration:**
- Radios use native HTML input elements
- Support standard form submission
- Work with FormData API
- Compatible with HTML5 validation

**Form library integration:**
```jsx
// React Hook Form example pattern
const { register, watch } = useForm();
const value = watch("city");

<RadioGroup value={value}>
  <Radio {...register("city")} value="london">London</Radio>
  <Radio {...register("city")} value="tokyo">Tokyo</Radio>
</RadioGroup>
```

**Custom validation:**
```jsx
<RadioGroup
  validate={(value) => {
    if (!value) return "Selection is required";
    if (!validOptions.includes(value)) return "Invalid selection";
    return null;
  }}
  validationBehavior="native" // or "aria"
>
  <Radio value="opt1">Option 1</Radio>
  <Radio value="opt2">Option 2</Radio>
</RadioGroup>
```

The `validate` prop accepts a function that returns an error message or null.

## Code Examples

### Example 1: Basic Usage

```jsx
import {RadioGroup, Radio} from "@heroui/react";

export default function App() {
  return (
    <RadioGroup label="Select your favorite city">
      <Radio value="buenos-aires">Buenos Aires</Radio>
      <Radio value="sydney">Sydney</Radio>
      <Radio value="san-francisco">San Francisco</Radio>
      <Radio value="london">London</Radio>
      <Radio value="tokyo">Tokyo</Radio>
    </RadioGroup>
  );
}
```

Demonstrates a standard radio group with five city options and a descriptive label.

### Example 2: Disabled State

```jsx
import {RadioGroup, Radio} from "@heroui/react";

export default function App() {
  return (
    <RadioGroup isDisabled label="Select your favorite city">
      <Radio value="buenos-aires">Buenos Aires</Radio>
      <Radio value="sydney">Sydney</Radio>
      <Radio value="san-francisco">San Francisco</Radio>
      <Radio value="london">London</Radio>
      <Radio value="tokyo">Tokyo</Radio>
    </RadioGroup>
  );
}
```

Shows how to disable all radio options within a group using the `isDisabled` prop.

### Example 3: Default Value

```jsx
import {RadioGroup, Radio} from "@heroui/react";

export default function App() {
  return (
    <RadioGroup
      color="secondary"
      defaultValue="london"
      label="Select your favorite city"
    >
      <Radio value="buenos-aires">Buenos Aires</Radio>
      <Radio value="sydney">Sydney</Radio>
      <Radio value="san-francisco">San Francisco</Radio>
      <Radio value="london">London</Radio>
      <Radio value="tokyo">Tokyo</Radio>
    </RadioGroup>
  );
}
```

Establishes a pre-selected option ("London") and uses a secondary color variant.

### Example 4: With Description

```jsx
import {RadioGroup, Radio} from "@heroui/react";

export default function App() {
  return (
    <RadioGroup color="warning" label="Select your favorite city">
      <Radio description="The capital of Argentina" value="buenos-aires">
        Buenos Aires
      </Radio>
      <Radio description="The capital of Australia" value="canberra">
        Canberra
      </Radio>
      <Radio description="The capital of England" value="london">
        London
      </Radio>
      <Radio description="The capital of Japan" value="tokyo">
        Tokyo
      </Radio>
    </RadioGroup>
  );
}
```

Adds supplementary text descriptions beneath each radio option for contextual information.

### Example 5: Horizontal Layout

```jsx
import {RadioGroup, Radio} from "@heroui/react";

export default function App() {
  return (
    <RadioGroup
      label="Select your favorite city"
      orientation="horizontal"
    >
      <Radio value="buenos-aires">Buenos Aires</Radio>
      <Radio value="sydney">Sydney</Radio>
      <Radio value="san-francisco">San Francisco</Radio>
      <Radio value="london">London</Radio>
      <Radio value="tokyo">Tokyo</Radio>
    </RadioGroup>
  );
}
```

Arranges radio buttons side-by-side using the `orientation="horizontal"` property.

### Example 6: Controlled Component

```jsx
import {RadioGroup, Radio} from "@heroui/react";
import React from "react";

export default function App() {
  const [selected, setSelected] = React.useState("london");

  return (
    <div className="flex flex-col gap-3">
      <RadioGroup
        label="Select your favorite city"
        value={selected}
        onValueChange={setSelected}
      >
        <Radio value="buenos-aires">Buenos Aires</Radio>
        <Radio value="sydney">Sydney</Radio>
        <Radio value="san-francisco">San Francisco</Radio>
        <Radio value="london">London</Radio>
        <Radio value="tokyo">Tokyo</Radio>
      </RadioGroup>
      <p className="text-default-500 text-small">Selected: {selected}</p>
    </div>
  );
}
```

Manages state externally using `value` and `onValueChange` to display the selected option dynamically.

### Example 7: Invalid State

```jsx
import {RadioGroup, Radio} from "@heroui/react";
import React from "react";

export default function App() {
  const [selected, setSelected] = React.useState("london");
  const validOptions = ["buenos-aires", "san-francisco", "tokyo"];
  const isInvalid = !validOptions.includes(selected);

  return (
    <div className="flex flex-col gap-3">
      <RadioGroup
        isInvalid={isInvalid}
        label="Select your favorite city"
        value={selected}
        onValueChange={setSelected}
      >
        <Radio value="buenos-aires">Buenos Aires</Radio>
        <Radio value="sydney">Sydney</Radio>
        <Radio value="san-francisco">San Francisco</Radio>
        <Radio value="london">London</Radio>
        <Radio value="tokyo">Tokyo</Radio>
      </RadioGroup>
      <p className="text-default-500 text-small">Selected: {selected}</p>
    </div>
  );
}
```

Validates selection against allowed values and applies invalid styling when criteria aren't met.

### Example 8: Custom Styled Radio

```jsx
import {RadioGroup, Radio, cn} from "@heroui/react";

export const CustomRadio = (props) => {
  const {children, ...otherProps} = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default function App() {
  return (
    <RadioGroup
      description="Selected plan can be changed at any time."
      label="Plans"
    >
      <CustomRadio description="Up to 20 items" value="free">
        Free
      </CustomRadio>
      <CustomRadio description="Unlimited items. $10 per month." value="pro">
        Pro
      </CustomRadio>
      <CustomRadio description="24/7 support. Contact us for pricing." value="enterprise">
        Enterprise
      </CustomRadio>
    </RadioGroup>
  );
}
```

Demonstrates customized styling through Tailwind CSS classes applied to component slots.

### Example 9: Custom Implementation Using useRadio Hook

```jsx
import {RadioGroup, useRadio, VisuallyHidden, cn} from "@heroui/react";

export const CustomRadio = (props) => {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center justify-between hover:opacity-70 active:opacity-50 flex-row-reverse tap-highlight-transparent",
        "max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
        "data-[selected=true]:border-primary",
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">{description}</span>
        )}
      </div>
    </Component>
  );
};

export default function App() {
  return (
    <RadioGroup label="Plans">
      <CustomRadio description="Up to 20 items" value="free">
        Free
      </CustomRadio>
      <CustomRadio description="Unlimited items. $10 per month." value="pro">
        Pro
      </CustomRadio>
      <CustomRadio description="24/7 support. Contact us for pricing." value="enterprise">
        Enterprise
      </CustomRadio>
    </RadioGroup>
  );
}
```

Leverages the `useRadio` hook for advanced customization beyond styling, providing full control over component structure.

## Notable Features

### React Aria Integration

**Built on React Aria:**
- Full ARIA pattern implementation
- Keyboard navigation with arrow keys
- Focus management and roving tabindex
- Screen reader optimized announcements
- Browser behavior normalization

**Accessibility features:**
- Semantic HTML with native inputs
- Proper role and ARIA attributes
- Focus visible indicators
- High contrast mode support

### Composition-Based Architecture

**Flexible structure:**
- RadioGroup container manages state
- Individual Radio components are independent
- Sub-component slots for fine-grained styling
- Hook-based customization via `useRadio`

**Slot system:**
- Each component exposes named slots
- Target specific parts for styling
- Maintain accessibility while customizing
- Compose complex layouts easily

### Data Attributes for Styling

**Available data attributes:**
- `data-selected`: Radio is selected
- `data-pressed`: Radio is being pressed
- `data-invalid`: Validation failed
- `data-readonly`: Component is readonly
- `data-hover`: Mouse hover state
- `data-focus`: Keyboard focus state
- `data-focus-visible`: Focus from keyboard
- `data-disabled`: Component is disabled
- `data-orientation`: vertical or horizontal

These enable CSS/Tailwind styling based on state without JavaScript.

### Validation System

**Multiple validation approaches:**
- Native HTML5 validation
- ARIA validation patterns
- Custom validation functions
- Real-time validation feedback

**Validation behavior control:**
- `validationBehavior="native"`: Uses HTML5 validation
- `validationBehavior="aria"`: Uses ARIA live regions
- Custom `validate` function for business logic
- Error messages via `errorMessage` prop

### Tailwind CSS Integration

**Styling system:**
- Tailwind utility classes for theming
- Custom classes via `classNames` prop
- Data attribute selectors for states
- Theme-aware color palettes
- Responsive design patterns

**Design tokens:**
- Semantic color names (primary, success, danger)
- Consistent size scales (sm, md, lg)
- Theme-aware spacing and sizing
- Dark mode support built-in

## Research Notes

### Framework Philosophy

HeroUI follows a composition-based architecture with heavy React Aria integration. The Radio Group component demonstrates this through:

1. **Native HTML foundation**: Uses actual `<input type="radio">` elements (can be visually hidden) ensuring form compatibility and accessibility
2. **React Aria patterns**: Implements full keyboard navigation, focus management, and ARIA attributes automatically
3. **Slot-based customization**: Named slots allow targeting specific parts of the component for styling
4. **Hook-based extensibility**: `useRadio` hook enables building completely custom radio implementations while maintaining behavior
5. **Tailwind-first styling**: Deep integration with Tailwind CSS including data attribute selectors

### Comparison with Other Frameworks

**Strengths vs other frameworks:**
- More flexible than Material-UI's FormControl pattern
- Better accessibility than basic Chakra UI implementation
- More customizable than Ant Design's rigid structure
- Simpler API than Radix UI's headless primitives (but less framework-agnostic)

**Trade-offs:**
- React-specific (not framework agnostic like Radix)
- Tailwind dependency for optimal styling
- More opinionated than headless solutions
- Less mature ecosystem than Material-UI

### API Design Observations

**Controlled vs Uncontrolled:**
- Clear separation with `value`/`onValueChange` vs `defaultValue`
- Follows React conventions closely
- No confusion about state ownership

**Validation patterns:**
- Dual validation modes (native vs ARIA) is unique
- Custom validation function is cleaner than most frameworks
- Error message handling is straightforward

**Styling approach:**
- `classNames` prop with slot targeting is powerful
- Data attributes provide state-based styling hooks
- More flexible than CSS-in-JS but requires Tailwind knowledge

**Composition model:**
- RadioGroup > Radio hierarchy is clear
- Individual radio descriptions are convenient
- Hook-based custom components maintain behavior

### Implementation Considerations for Semantic UI

**Patterns to consider adopting:**
1. Slot-based styling system with `classNames` prop
2. Data attributes for state-based styling (`data-selected`, `data-invalid`)
3. Hook-based extensibility (`useRadio` pattern)
4. Dual validation behavior (native vs ARIA)
5. Individual radio descriptions alongside labels

**Patterns to adapt:**
1. Could use Semantic UI's signals instead of React state
2. Web component implementation instead of React components
3. CSS custom properties instead of Tailwind classes
4. Component tree navigation for RadioGroup > Radio communication
5. Template-based customization instead of JSX/hooks

**Accessibility lessons:**
- React Aria integration shows value of established patterns
- Native HTML inputs ensure maximum compatibility
- Focus management is complex and benefits from library support
- Data attributes enable styling without breaking accessibility

---

**Research completed:** 2025-11-05
**Component:** Radio Group
**Framework:** HeroUI (NextUI)
**Documentation:** https://www.heroui.com/docs/components/radio-group

**Last Modified:** 2025-11-05
