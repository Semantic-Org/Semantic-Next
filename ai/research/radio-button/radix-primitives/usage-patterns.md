# Radix Primitives - Radio Group Usage Patterns

## Component URL
https://www.radix-ui.com/primitives/docs/components/radio-group
Status: ✅ Working

## Documentation Quality
Excellent - Comprehensive documentation with clear API reference, accessibility guidance, keyboard interaction details, and practical code examples. Well-organized with complete prop documentation and data attribute reference. The unstyled primitive approach is clearly explained with CSS examples.

## Component Definition
- **Core purpose**: A set of checkable buttons (radio items) where only one can be checked at a time. Used for mutually exclusive choices where the user must select exactly one option from a set.
- **Mental model**: A group of circular buttons representing a single form control where selecting one automatically deselects others. Unlike checkboxes (which allow multiple selections), radio groups enforce single selection. The group acts as a single tab stop with arrow key navigation between options.
- **Semantic meaning**: Represents a set of mutually exclusive options in a form or configuration context. Follows WAI-ARIA radio group pattern with proper role semantics and keyboard navigation. The checked state represents the current selection that will be submitted with form data.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text labels | ✅ | Standard HTML label elements associated via htmlFor/id |
| Icon content | ⚠️ | Not directly shown but supported via asChild composition |
| Custom indicator | ✅ | RadioGroup.Indicator with full styling control |
| Custom content | ✅ | asChild prop allows arbitrary element composition |
| Label positioning | ✅ | Flexible - shown with label after item, positioning via CSS |
| Description text | ⚠️ | Not built-in but can be added via composition |
| Helper text | ⚠️ | Not built-in but can be added via composition |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Single radio item | ✅ | RadioGroup.Item component |
| Radio group | ✅ | RadioGroup.Root container component |
| Button-style radio | ⚠️ | Not shown but achievable via custom styling |
| Card-style radio | ⚠️ | Not shown but achievable via custom styling |
| Nested items | ✅ | Items wrapped in div containers for layout |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Checked state | ✅ | Managed via value prop on Root, value prop on Item |
| Unchecked state | ✅ | Default state when value doesn't match |
| Disabled (all) | ✅ | disabled prop on Root disables entire group |
| Disabled (single) | ✅ | disabled prop on individual Item |
| Required | ✅ | required prop on Root for form validation |
| Invalid/error state | ❌ | Not built-in (unstyled primitive) |
| Data attributes | ✅ | [data-state]="checked"\|"unchecked", [data-disabled] |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size variants | ❌ | Unstyled - controlled via CSS (example shows 25px circle) |
| Color variants | ❌ | Unstyled - controlled via CSS (example uses Violet theme) |
| Orientation | ✅ | orientation prop: "vertical" (default) \| "horizontal" \| undefined |
| Spacing/gap | ❌ | Unstyled - controlled via CSS (example uses gap: 10px) |
| Border radius | ❌ | Unstyled - controlled via CSS (example shows 100% for circles) |
| Custom styling | ✅ | Full control via className and CSS |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| onChange callback | ✅ | onValueChange function receives new value string |
| Controlled state | ✅ | value + onValueChange props for external control |
| Uncontrolled state | ✅ | defaultValue prop for internal state management |
| Form integration | ✅ | name prop, automatic hidden input rendering for forms |
| Form submission | ✅ | Proper form event propagation and submission support |
| Keyboard navigation | ✅ | Arrow keys, Tab, Space - full ARIA radio group pattern |
| Mouse interaction | ✅ | Click to select |
| Focus management | ✅ | Roving tabindex - only checked item or first item is tabbable |
| Loop navigation | ✅ | loop prop (default: true) for circular arrow key navigation |
| Direction support | ✅ | dir prop: "ltr" \| "rtl" for internationalization |
| Custom focus behavior | ❌ | Not documented |
| Validation | ⚠️ | required prop available, custom validation via composition |

## Code Examples

### Basic Vertical Radio Group (Official Example)
```jsx
import * as React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import "./styles.css";

const RadioGroupDemo = () => (
  <form>
    <RadioGroup.Root
      className="RadioGroupRoot"
      defaultValue="default"
      aria-label="View density"
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <RadioGroup.Item className="RadioGroupItem" value="default" id="r1">
          <RadioGroup.Indicator className="RadioGroupIndicator" />
        </RadioGroup.Item>
        <label className="Label" htmlFor="r1">
          Default
        </label>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <RadioGroup.Item className="RadioGroupItem" value="comfortable" id="r2">
          <RadioGroup.Indicator className="RadioGroupIndicator" />
        </RadioGroup.Item>
        <label className="Label" htmlFor="r2">
          Comfortable
        </label>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <RadioGroup.Item className="RadioGroupItem" value="compact" id="r3">
          <RadioGroup.Indicator className="RadioGroupIndicator" />
        </RadioGroup.Item>
        <label className="Label" htmlFor="r3">
          Compact
        </label>
      </div>
    </RadioGroup.Root>
  </form>
);

export default RadioGroupDemo;
```

### CSS Styling (Official Example)
```css
@import "@radix-ui/colors/black-alpha.css";
@import "@radix-ui/colors/violet.css";

button {
  all: unset;
}

.RadioGroupRoot {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.RadioGroupItem {
  background-color: white;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  box-shadow: 0 2px 10px var(--black-a7);
}

.RadioGroupItem:hover {
  background-color: var(--violet-3);
}

.RadioGroupItem:focus {
  box-shadow: 0 0 0 2px black;
}

.RadioGroupIndicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.RadioGroupIndicator::after {
  content: "";
  display: block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: var(--violet-11);
}

.Label {
  color: white;
  font-size: 15px;
  line-height: 1;
  padding-left: 15px;
}
```

### Controlled State Pattern
```jsx
const [value, setValue] = React.useState("default");

<RadioGroup.Root value={value} onValueChange={setValue}>
  <RadioGroup.Item value="option1" id="r1">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
  <label htmlFor="r1">Option 1</label>

  <RadioGroup.Item value="option2" id="r2">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
  <label htmlFor="r2">Option 2</label>
</RadioGroup.Root>
```

### Horizontal Orientation Pattern
```jsx
<RadioGroup.Root
  orientation="horizontal"
  defaultValue="option1"
  aria-label="Options"
>
  <RadioGroup.Item value="option1" id="h1">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
  <label htmlFor="h1">Option 1</label>

  <RadioGroup.Item value="option2" id="h2">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
  <label htmlFor="h2">Option 2</label>
</RadioGroup.Root>
```

### Form Integration with Name
```jsx
<form onSubmit={(e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  console.log(formData.get("size")); // Gets selected value
}}>
  <RadioGroup.Root
    name="size"
    defaultValue="medium"
    required
  >
    <RadioGroup.Item value="small" id="s">
      <RadioGroup.Indicator />
    </RadioGroup.Item>
    <label htmlFor="s">Small</label>

    <RadioGroup.Item value="medium" id="m">
      <RadioGroup.Indicator />
    </RadioGroup.Item>
    <label htmlFor="m">Medium</label>

    <RadioGroup.Item value="large" id="l">
      <RadioGroup.Indicator />
    </RadioGroup.Item>
    <label htmlFor="l">Large</label>
  </RadioGroup.Root>
  <button type="submit">Submit</button>
</form>
```

### Disabled States
```jsx
// Entire group disabled
<RadioGroup.Root disabled defaultValue="option1">
  <RadioGroup.Item value="option1" id="d1">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
  <label htmlFor="d1">Option 1</label>

  <RadioGroup.Item value="option2" id="d2">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
  <label htmlFor="d2">Option 2</label>
</RadioGroup.Root>

// Individual item disabled
<RadioGroup.Root defaultValue="option1">
  <RadioGroup.Item value="option1" id="d1">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
  <label htmlFor="d1">Option 1</label>

  <RadioGroup.Item value="option2" id="d2" disabled>
    <RadioGroup.Indicator />
  </RadioGroup.Item>
  <label htmlFor="d2">Option 2 (Disabled)</label>
</RadioGroup.Root>
```

### RTL Direction Support
```jsx
<RadioGroup.Root
  dir="rtl"
  defaultValue="option1"
  aria-label="Options"
>
  <RadioGroup.Item value="option1" id="rtl1">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
  <label htmlFor="rtl1">خيار 1</label>

  <RadioGroup.Item value="option2" id="rtl2">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
  <label htmlFor="rtl2">خيار 2</label>
</RadioGroup.Root>
```

### Custom Composition with asChild
```jsx
<RadioGroup.Root defaultValue="option1">
  <RadioGroup.Item value="option1" asChild>
    <button className="custom-radio-button">
      <RadioGroup.Indicator />
      <span>Custom Option 1</span>
    </button>
  </RadioGroup.Item>

  <RadioGroup.Item value="option2" asChild>
    <button className="custom-radio-button">
      <RadioGroup.Indicator />
      <span>Custom Option 2</span>
    </button>
  </RadioGroup.Item>
</RadioGroup.Root>
```

### Force Mount Indicator (for animations)
```jsx
<RadioGroup.Root defaultValue="option1">
  <RadioGroup.Item value="option1" id="f1">
    <RadioGroup.Indicator forceMount>
      {/* Always rendered, style with data-state */}
      <div data-state={checked ? "checked" : "unchecked"}>
        <CheckIcon />
      </div>
    </RadioGroup.Indicator>
  </RadioGroup.Item>
  <label htmlFor="f1">Option 1</label>
</RadioGroup.Root>
```

## API Reference Summary

### RadioGroup.Root
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultValue | string | - | Initial value when uncontrolled |
| value | string | - | Controlled value |
| onValueChange | (value: string) => void | - | Callback when value changes |
| disabled | boolean | false | Disables all radio items |
| name | string | - | Form field name |
| required | boolean | false | HTML required attribute |
| orientation | "horizontal" \| "vertical" \| undefined | undefined | Layout direction |
| dir | "ltr" \| "rtl" | "ltr" | Reading direction |
| loop | boolean | true | Circular keyboard navigation |
| asChild | boolean | false | Merge props with child element |

**Data Attributes:**
- `[data-disabled]` - Present when disabled

### RadioGroup.Item
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | - | Unique value for this option (required) |
| disabled | boolean | false | Disables this specific item |
| required | boolean | false | HTML required attribute |
| asChild | boolean | false | Merge props with child element |

**Data Attributes:**
- `[data-state]` - "checked" \| "unchecked"
- `[data-disabled]` - Present when disabled

### RadioGroup.Indicator
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| forceMount | boolean | false | Force render even when unchecked |
| asChild | boolean | false | Merge props with child element |

**Data Attributes:**
- `[data-state]` - "checked" \| "unchecked"
- `[data-disabled]` - Present when disabled

## Keyboard Interactions
| Key | Behavior |
|-----|----------|
| Tab | Moves focus to checked item (or first item if none checked) |
| Space | Checks the focused radio item if not already checked |
| ArrowDown | Moves focus to and checks next radio item |
| ArrowRight | Moves focus to and checks next radio item |
| ArrowUp | Moves focus to and checks previous radio item |
| ArrowLeft | Moves focus to and checks previous radio item |

**Note:** Arrow key navigation is circular when loop={true} (default)

## Notable Features
- **Unstyled primitive**: Complete behavioral control without imposed styles, full CSS customization
- **Three-component structure**: Clean separation between Root (container), Item (button), and Indicator (visual marker)
- **Automatic form integration**: Renders hidden input element for seamless form submission
- **Roving tabindex**: Single tab stop for entire group with arrow key navigation (ARIA best practice)
- **Data attributes**: Exposed [data-state] and [data-disabled] for CSS-based styling
- **AsChild pattern**: Polymorphic composition via asChild prop on all components
- **Controlled/uncontrolled**: Full support for both state management patterns
- **Orientation support**: Vertical and horizontal layout options with proper keyboard behavior
- **RTL support**: Built-in right-to-left layout support via dir prop
- **Loop navigation**: Configurable circular keyboard navigation
- **Individual disable**: Can disable entire group or individual items
- **Required validation**: HTML5 required attribute support for form validation
- **Accessibility first**: Full WAI-ARIA radio group pattern implementation
- **Focus management**: Proper focus handling with roving tabindex
- **Label association**: Standard HTML label/id association pattern
- **No dependencies**: Self-contained primitive with minimal overhead
- **Force mount option**: Enable custom animations via forceMount on Indicator
- **TypeScript support**: Full type definitions included
- **Framework agnostic**: Works with any React-based setup
- **Small bundle size**: 10.2 kB gzipped (v1.3.8)
- **Production ready**: Part of battle-tested Radix Primitives collection
- **Event propagation**: Proper form event bubbling and submission support

## Research Notes
- Radix Primitives are completely unstyled - all visual design is user-controlled via CSS
- The three-component structure (Root/Item/Indicator) provides clear semantic separation
- Documentation is excellent with clear API reference and practical examples
- The asChild pattern is consistently used for flexible composition
- Keyboard navigation follows ARIA radio group pattern precisely (roving tabindex)
- Only one item in the group is tabbable at a time (checked item or first item)
- Arrow keys both move focus AND change selection (different from some implementations)
- Data attributes provide styling hooks without requiring JavaScript
- The Indicator component is where the visual "checked" marker renders
- The example uses ::after pseudo-element for the indicator dot
- Form integration is automatic - no manual hidden input management needed
- The name prop on Root is passed to the hidden input for form submission
- Required validation works out of the box with HTML5 form validation
- Loop navigation can be disabled if linear navigation is preferred
- Orientation prop affects both layout hints and keyboard navigation logic
- Individual items can be disabled while keeping others interactive
- The disabled state on Root disables ALL items in the group
- RTL support is built-in and affects both layout and keyboard navigation
- No built-in error/invalid state - expected to be composed in by consumers
- No built-in description or helper text - composition-first approach
- Package is stable (v1.3.8) with years of production use
- Fits into Radix Primitives ecosystem philosophy: unstyled, accessible, composable
- Can be styled to match any design system (Material, Chakra, custom, etc.)
- The forceMount prop on Indicator enables CSS/JS transition control
- Labels are external HTML elements, not part of the component API
- Flexibility comes at cost of more markup compared to styled alternatives
- No built-in size or color variants - pure primitive approach
- Documentation shows best practices for label association (htmlFor/id pattern)
- The example uses Radix Colors for theming (optional dependency)
