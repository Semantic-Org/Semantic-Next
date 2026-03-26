# Radix UI Themes - Radio Group Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.radix-ui.com/themes/docs/components/radio-group
Status: ✅ Working
Version: Current (Radix Themes)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-structured with clear examples and thorough API documentation. Includes visual examples for all variants and integration patterns.

## Component Definition
- **Core purpose**: A set of interactive radio buttons where only one can be selected at a time. Used for mutually exclusive selections where users must choose exactly one option from a group.
- **Mental model**: A coordinated group of radio inputs that work together to maintain single-selection state. Users think of it as choosing one option from several alternatives, like selecting a preference or configuration option.
- **Semantic meaning**: Represents mutually exclusive choices in forms and settings. Communicates "pick one" interactions where all options are visible and equally weighted.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text labels | ✅ | Composed | Radio items with text labels: `<RadioGroup.Item value="1">Default</RadioGroup.Item>` |
| Text alignment | ✅ | Composed | Automatic vertical centering when composed within `Text` component - aligns with first line of text |
| Multi-line text | ✅ | Composed | Supports multi-line labels with proper alignment to first line |
| Icon support | ❌ | CSS-only | No dedicated icon pattern shown, would require custom composition |
| Custom content | ✅ | Composed | Can wrap items in layout components for complex content structures |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Surface | ✅ | Native | `variant="surface"` (default) - Subtle styling with background surface |
| Classic | ✅ | Native | `variant="classic"` - Traditional radio button appearance |
| Soft | ✅ | Native | `variant="soft"` - Lighter, more subtle visual treatment |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | Native `disabled` attribute on `RadioGroup.Item` prevents selection |
| Checked | ✅ | Native | Controlled via `defaultValue` (uncontrolled) on RadioGroup.Root |
| Required | ⚠️ | Unclear | Not explicitly documented, may inherit from HTML native support |
| Error/Invalid | ❌ | None | No native error state visualization or validation props shown |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="1" \| "2" \| "3"` - Three responsive sizes, default "2", supports `Responsive<>` type |
| Color options | ✅ | Native | `color` prop accepts theme colors: indigo, cyan, orange, crimson, gray, and other theme colors |
| High contrast | ✅ | Native | `highContrast` boolean prop enhances color contrast against backgrounds |
| Orientation | ✅ | Composed | Layout managed via container components (Flex) - vertical with `direction="column"`, horizontal default |
| Spacing | ✅ | Composed | Item spacing controlled via layout components using `gap` prop: `<Flex gap="2">` |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange handler | ✅ | Native | Inherits from Radio Group primitive - standard change handlers |
| Controlled mode | ✅ | Native | `value` prop for controlled usage (not shown in examples but inherited from primitives) |
| Uncontrolled mode | ✅ | Native | `defaultValue` prop on RadioGroup.Root for initial selection without state management |
| Form integration | ✅ | Native | `name` attribute on RadioGroup.Root enables standard form submission with selected value |
| As child | ✅ | Native | `asChild` prop enables polymorphic rendering for custom component composition |

## Code Examples

### Basic Usage
```jsx
// Simple radio group with text labels
<RadioGroup.Root defaultValue="1" name="example">
  <RadioGroup.Item value="1">Default</RadioGroup.Item>
  <RadioGroup.Item value="2">Comfortable</RadioGroup.Item>
  <RadioGroup.Item value="3">Compact</RadioGroup.Item>
</RadioGroup.Root>
```

### Size Variants
```jsx
// Three size options with visual comparison
<Flex align="center" gap="2">
  <RadioGroup.Root size="1" defaultValue="1">
    <RadioGroup.Item value="1" />
  </RadioGroup.Root>
  <RadioGroup.Root size="2" defaultValue="1">
    <RadioGroup.Item value="1" />
  </RadioGroup.Root>
  <RadioGroup.Root size="3" defaultValue="1">
    <RadioGroup.Item value="1" />
  </RadioGroup.Root>
</Flex>
```

### Visual Variants
```jsx
// Three variant styles: surface, classic, soft
<Flex direction="column" gap="3">
  <RadioGroup.Root variant="surface" defaultValue="1">
    <RadioGroup.Item value="1">Surface</RadioGroup.Item>
  </RadioGroup.Root>
  <RadioGroup.Root variant="classic" defaultValue="1">
    <RadioGroup.Item value="1">Classic</RadioGroup.Item>
  </RadioGroup.Root>
  <RadioGroup.Root variant="soft" defaultValue="1">
    <RadioGroup.Item value="1">Soft</RadioGroup.Item>
  </RadioGroup.Root>
</Flex>
```

### Color Customization
```jsx
// Theme color integration
<Flex direction="column" gap="2">
  <RadioGroup.Root color="indigo" defaultValue="1">
    <RadioGroup.Item value="1">Indigo</RadioGroup.Item>
  </RadioGroup.Root>
  <RadioGroup.Root color="cyan" defaultValue="1">
    <RadioGroup.Item value="1">Cyan</RadioGroup.Item>
  </RadioGroup.Root>
  <RadioGroup.Root color="orange" defaultValue="1">
    <RadioGroup.Item value="1">Orange</RadioGroup.Item>
  </RadioGroup.Root>
  <RadioGroup.Root color="crimson" defaultValue="1">
    <RadioGroup.Item value="1">Crimson</RadioGroup.Item>
  </RadioGroup.Root>
</Flex>
```

### High Contrast Mode
```jsx
// Enhanced contrast for accessibility
<RadioGroup.Root color="gray" highContrast defaultValue="1">
  <RadioGroup.Item value="1">Default</RadioGroup.Item>
  <RadioGroup.Item value="2">Comfortable</RadioGroup.Item>
  <RadioGroup.Item value="3">Compact</RadioGroup.Item>
</RadioGroup.Root>
```

### Disabled State
```jsx
// Prevent interaction on specific items
<RadioGroup.Root defaultValue="1">
  <RadioGroup.Item value="1">Default</RadioGroup.Item>
  <RadioGroup.Item value="2" disabled>Comfortable (disabled)</RadioGroup.Item>
  <RadioGroup.Item value="3">Compact</RadioGroup.Item>
</RadioGroup.Root>
```

### Vertical Layout (Explicit)
```jsx
// Vertical stacking with spacing
<Flex direction="column" gap="2">
  <RadioGroup.Root defaultValue="1">
    <RadioGroup.Item value="1">Default</RadioGroup.Item>
    <RadioGroup.Item value="2">Comfortable</RadioGroup.Item>
    <RadioGroup.Item value="3">Compact</RadioGroup.Item>
  </RadioGroup.Root>
</Flex>
```

### Horizontal Layout
```jsx
// Horizontal arrangement with spacing
<Flex align="center" gap="3">
  <RadioGroup.Root defaultValue="1">
    <RadioGroup.Item value="1">Default</RadioGroup.Item>
    <RadioGroup.Item value="2">Comfortable</RadioGroup.Item>
    <RadioGroup.Item value="3">Compact</RadioGroup.Item>
  </RadioGroup.Root>
</Flex>
```

### Text Alignment
```jsx
// Proper alignment with multi-line text
<RadioGroup.Root defaultValue="1">
  <Text as="label" size="2">
    <Flex gap="2">
      <RadioGroup.Item value="1" />
      <Box>
        Default spacing
        <Text as="div" size="1" color="gray">
          Use default spacing for most layouts
        </Text>
      </Box>
    </Flex>
  </Text>
</RadioGroup.Root>
```

### Form Integration
```jsx
// Standard form submission
<form onSubmit={handleSubmit}>
  <RadioGroup.Root defaultValue="default" name="spacing">
    <RadioGroup.Item value="default">Default</RadioGroup.Item>
    <RadioGroup.Item value="comfortable">Comfortable</RadioGroup.Item>
    <RadioGroup.Item value="compact">Compact</RadioGroup.Item>
  </RadioGroup.Root>
  <Button type="submit">Submit</Button>
</form>
```

## Notable Features

### Radix Themes Integration
This is the **styled version** of Radix UI's Radio Group component, part of Radix Themes (not Radix Primitives). Key differences from the headless primitive version:
- **Pre-styled**: Complete visual design system integration out of the box
- **Theme tokens**: Deep integration with Radix Themes color system and design tokens
- **Variant system**: Built-in visual variants (classic, surface, soft) instead of custom styling
- **Size system**: Standardized responsive sizing rather than custom size implementation
- **Margin props**: Inherits theme spacing utilities automatically

### Two-Component Architecture
- **RadioGroup.Root**: Container that manages selection state and provides context
- **RadioGroup.Item**: Individual radio buttons that participate in the group
- Clear separation between group configuration (Root) and item definition (Item)

### Text Alignment Behavior
- **Automatic centering**: When RadioGroup.Item is composed within Text component, it automatically centers with the first line
- **Multi-line support**: Maintains proper alignment even with multi-line labels
- **No manual alignment**: No need for CSS positioning or flexbox alignment tricks

### Layout Flexibility
- **Container-based orientation**: Uses standard layout components (Flex) rather than orientation prop
- **Consistent spacing**: Gap prop on containers provides uniform spacing between items
- **Responsive layouts**: Can adapt orientation and spacing based on breakpoints using Flex responsive props

### Polymorphic Rendering
- **asChild pattern**: Allows rendering Root as different elements while maintaining radio group behavior
- **Composition flexibility**: Can wrap items in custom components for complex layouts
- **Semantic preservation**: Maintains accessibility and form behavior regardless of DOM structure

### State Management Patterns
- **Uncontrolled by default**: `defaultValue` prop provides initial selection without React state
- **Controlled support**: Inherits `value` and `onValueChange` from primitives for controlled usage
- **Form integration**: Native `name` attribute enables standard form submission without JavaScript

### Color System Integration
- **Theme colors**: Accepts any color from Radix Themes palette
- **High contrast mode**: Single prop enhances contrast across all variants
- **Consistent application**: Colors work uniformly across all three visual variants

### Responsive Design
- **Responsive sizes**: Size prop accepts `Responsive<>` type for breakpoint-based sizing
- **Fluid scaling**: All variants and colors work consistently across size options
- **Layout adaptation**: Can combine with responsive Flex props for adaptive layouts

### Accessibility Foundation
- Built on Radix Primitives with comprehensive accessibility support
- Keyboard navigation inherited from primitive base
- ARIA attributes automatically managed
- Proper focus management and visual indicators
- Disabled state properly communicated to assistive technologies

## Research Notes

### API Design Philosophy
Radix Themes Radio Group follows a "styled primitives" approach:
- Inherits all functionality from Radix UI Primitives (headless version)
- Adds complete visual design system on top
- Provides convenience props for common styling patterns (variant, color, size)
- Maintains composition patterns for layout and content
- Separates concerns: state management in primitives, styling in themes

### Variant Strategy
The three variants provide visual hierarchy without semantic differences:
1. **Surface** (default): Subtle background with clear distinction
2. **Classic**: Traditional radio button appearance familiar to users
3. **Soft**: Lighter treatment for less visual weight

All variants maintain the same behavior and API, differing only in visual presentation.

### Layout Control Philosophy
Notable absence of orientation prop - deliberately delegates layout to container components:
- **Flexibility**: Allows complex layouts beyond simple vertical/horizontal
- **Consistency**: Uses same layout system (Flex) as rest of the application
- **Separation**: Radio group handles selection logic, layout components handle positioning
- **Composability**: Enables grid layouts, responsive changes, custom arrangements

### Form Integration Pattern
Follows HTML standards for form integration:
- `name` attribute on Root for form field identification
- `value` attribute on items for submission values
- Works with native form submission without JavaScript
- Progressive enhancement friendly

### Controlled vs Uncontrolled
Documentation emphasizes uncontrolled pattern with `defaultValue`:
- Simpler API for common cases
- No state management required
- Form submission handles data collection
- Controlled mode available but not prominently featured (inherited from primitives)

### Comparison to Primitives Version
Key differences from Radix UI Primitives (headless) Radio Group:
- **Styling**: Pre-styled vs unstyled base
- **Props**: Additional theme props (variant, color, size, highContrast)
- **Integration**: Built-in theme system vs BYO styling
- **Use case**: Rapid development with design system vs maximum customization

### Pattern Completeness
The component provides comprehensive coverage for radio group use cases:
- ✅ All common visual variants
- ✅ Complete size system with responsive support
- ✅ Full color customization
- ✅ Disabled state per item
- ✅ Form integration
- ✅ Both controlled and uncontrolled modes
- ✅ High contrast accessibility mode
- ✅ Text alignment automation
- ✅ Flexible layout composition
- ❌ No native error/validation states
- ❌ No icon integration patterns
- ❌ No loading states

### Comparison Points for Semantic UI
- **Styled vs unstyled**: Radix Themes provides complete styling, unlike primitives-focused Radix UI base
- **Two-component structure**: Clear separation between Root (group) and Item (radio)
- **Layout delegation**: No orientation prop, uses container components for layout
- **Theme integration**: Deep integration with design token system
- **Variant approach**: Visual variants without semantic differences
- **Size system**: Responsive prop type support built-in
- **Form-first**: Emphasizes standard form integration patterns
- **Uncontrolled default**: Documentation prioritizes defaultValue over controlled state
- **Text alignment**: Automatic centering when composed with Text component
- **No validation**: Lacks native error states or validation props
- **Polymorphic composition**: asChild pattern for rendering flexibility

### Notable Absences
Features not present in Radix Themes Radio Group:
- Button-style radio groups (all options styled as buttons)
- Error/invalid state styling
- Required state indication
- Icon integration patterns
- Loading states
- Helper text or description support
- Label position control (all labels appear to right of radio)
- Validation feedback
- Group-level disabled state (only per-item)
