# Radix UI Themes - Select Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.radix-ui.com/themes/docs/components/select
Status: ✅ Working
Version: Current (Radix Themes)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with clear examples, thorough API coverage, and well-organized sections. Includes SSR considerations and advanced customization patterns.

## Component Definition
- **Core purpose**: Displays a list of options for users to pick from, triggered by a button. A form control that enables single selection from grouped or ungrouped items.
- **Mental model**: A composed dropdown selection component built from multiple sub-components (Root, Trigger, Content, Item, Group, Label, Separator) that work together to create a complete select experience. Users interact with a trigger button that reveals a dropdown menu of selectable options.
- **Semantic meaning**: Represents a single-choice selection control for forms and interfaces. Communicates available options through grouped or flat lists, with clear visual feedback for selection state. Supports disabled items and placeholder text for empty states.

## Pattern Support Levels
- **Native**: Dedicated prop/API with first-class support
- **Composed**: Via composition/children pattern
- **CSS-only**: Requires custom styling
- **Not Present**: Feature not available

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Options/Items | ✅ | Native | `Select.Item` component with `value` prop for individual options |
| Groups | ✅ | Native | `Select.Group` wraps related items with `Select.Label` for group headings |
| Labels | ✅ | Native | `Select.Label` provides semantic labels for item groups |
| Separators | ✅ | Native | `Select.Separator` creates visual dividers between groups or sections |
| Placeholder | ✅ | Native | `placeholder` prop on Trigger for empty state without default value |
| Disabled items | ✅ | Native | `disabled` prop on individual `Select.Item` components |
| Custom trigger content | ✅ | Composed | Manually control Trigger children to render custom content, icons, or complex layouts |
| Icons in trigger | ✅ | Composed | Custom children in Trigger can include icons alongside selected text |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single select | ✅ | Native | Core functionality - selects single value from list |
| Multi-select | ❌ | Not Present | No multi-selection support documented |
| Searchable | ❌ | Not Present | No built-in search/filter functionality |
| Creatable | ❌ | Not Present | No ability to create new options |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default value | ✅ | Native | `defaultValue` prop on Root for uncontrolled initial selection |
| Controlled value | ✅ | Native | `value` and `onValueChange` props on Root for controlled state |
| Open/closed state | ✅ | Native | Built-in state management for dropdown visibility |
| Disabled items | ✅ | Native | Individual items can be disabled via `disabled` prop |
| Required | ✅ | Native | Form validation support through standard HTML attributes |
| Empty state | ✅ | Native | Placeholder text shown when no value selected |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="1" \| "2" \| "3"` on Root - three responsive sizes, default "2", supports `Responsive<>` type |
| Trigger variants | ✅ | Native | `variant="classic" \| "surface" \| "soft" \| "ghost"` on Trigger, default "surface" |
| Content variants | ✅ | Native | `variant="solid" \| "soft"` on Content, default "solid" |
| Color options | ✅ | Native | `color` prop on both Trigger and Content accepts theme colors: indigo, cyan, orange, crimson, gray, and full theme palette |
| Radius options | ✅ | Native | `radius="none" \| "small" \| "medium" \| "large" \| "full"` on Trigger for border radius control |
| High contrast | ✅ | Native | `highContrast` boolean prop on Content increases item contrast for accessibility |
| Position control | ✅ | Native | `position="popper"` on Content positions menu below trigger to prevent layout conflicts |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Value change handler | ✅ | Native | `onValueChange` callback on Root provides selected value |
| Keyboard navigation | ✅ | Native | Built-in keyboard support (arrows, enter, escape, etc.) |
| Click to open | ✅ | Native | Trigger click opens dropdown menu |
| Click outside to close | ✅ | Native | Standard dropdown closing behavior |
| Margin props | ✅ | Native | Trigger supports common margin props from theme system |

## Composition Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Sub-components | ✅ | Native | Composed from Root, Trigger, Content, Item, Group, Label, Separator |
| Custom trigger rendering | ✅ | Composed | Control Trigger children manually for custom layouts and icons |
| Nested structure | ✅ | Native | Hierarchical composition: Root wraps Trigger and Content, Content contains Groups/Items/Separators |
| Theme integration | ✅ | Native | Deep integration with Radix Themes design token system |

## Code Examples

### Basic Usage
```jsx
<Select.Root defaultValue="apple">
  <Select.Trigger />
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      <Select.Item value="orange">Orange</Select.Item>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="grape" disabled>
        Grape
      </Select.Item>
    </Select.Group>
    <Select.Separator />
    <Select.Group>
      <Select.Label>Vegetables</Select.Label>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="potato">Potato</Select.Item>
    </Select.Group>
  </Select.Content>
</Select.Root>
```

### Size Variants
```jsx
<Flex gap="3" align="center">
  <Select.Root size="1" defaultValue="apple">
    <Select.Trigger />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>

  <Select.Root size="2" defaultValue="apple">
    <Select.Trigger />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>

  <Select.Root size="3" defaultValue="apple">
    <Select.Trigger />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>
</Flex>
```

### Trigger Variants
```jsx
<Flex gap="3" align="center">
  <Select.Root defaultValue="apple">
    <Select.Trigger variant="surface" />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>

  <Select.Root defaultValue="apple">
    <Select.Trigger variant="classic" />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>

  <Select.Root defaultValue="apple">
    <Select.Trigger variant="soft" />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>
</Flex>
```

### Ghost Variant
```jsx
// Ghost triggers render without a visually containing element
<Flex gap="3" align="center">
  <Select.Root defaultValue="apple">
    <Select.Trigger variant="surface" />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>

  <Select.Root defaultValue="apple">
    <Select.Trigger variant="ghost" />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>
</Flex>
```

### Color Customization
```jsx
<Flex gap="3">
  <Select.Root defaultValue="apple">
    <Select.Trigger color="indigo" variant="soft" />
    <Select.Content color="indigo">
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>

  <Select.Root defaultValue="apple">
    <Select.Trigger color="cyan" variant="soft" />
    <Select.Content color="cyan">
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>

  <Select.Root defaultValue="apple">
    <Select.Trigger color="orange" variant="soft" />
    <Select.Content color="orange">
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>

  <Select.Root defaultValue="apple">
    <Select.Trigger color="crimson" variant="soft" />
    <Select.Content color="crimson">
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>
</Flex>
```

### High Contrast Mode
```jsx
<Flex gap="3">
  <Select.Root defaultValue="apple">
    <Select.Trigger color="gray" />
    <Select.Content color="gray" variant="solid">
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>

  <Select.Root defaultValue="apple">
    <Select.Trigger color="gray" />
    <Select.Content color="gray" variant="solid" highContrast>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>
</Flex>
```

### Border Radius Options
```jsx
<Flex gap="3">
  <Select.Root defaultValue="apple">
    <Select.Trigger radius="none" />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>

  <Select.Root defaultValue="apple">
    <Select.Trigger radius="large" />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>

  <Select.Root defaultValue="apple">
    <Select.Trigger radius="full" />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Root>
</Flex>
```

### With Placeholder
```jsx
// Trigger without an initial value
<Select.Root>
  <Select.Trigger placeholder="Pick a fruit" />
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      <Select.Item value="orange">Orange</Select.Item>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="grape" disabled>
        Grape
      </Select.Item>
    </Select.Group>
    <Select.Separator />
    <Select.Group>
      <Select.Label>Vegetables</Select.Label>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="potato">Potato</Select.Item>
    </Select.Group>
  </Select.Content>
</Select.Root>
```

### Position Popper
```jsx
// Position menu below trigger to prevent layout conflicts
<Select.Root defaultValue="apple">
  <Select.Trigger />
  <Select.Content position="popper">
    <Select.Item value="apple">Apple</Select.Item>
    <Select.Item value="orange">Orange</Select.Item>
  </Select.Content>
</Select.Root>
```

### Server-Side Rendering (SSR)
```jsx
// Manually render Trigger to avoid layout shift after hydration
() => {
  const data = {
    apple: "Apple",
    orange: "Orange",
  };
  const [value, setValue] = React.useState("apple");
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger>{data[value]}</Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="orange">Orange</Select.Item>
      </Select.Content>
    </Select.Root>
  );
};
```

### With Icon
```jsx
// Custom trigger rendering with icons
() => {
  const data = {
    light: { label: "Light", icon: <SunIcon /> },
    dark: { label: "Dark", icon: <MoonIcon /> },
  };
  const [value, setValue] = React.useState("light");
  return (
    <Flex direction="column" maxWidth="160px">
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Trigger>
          <Flex as="span" align="center" gap="2">
            {data[value].icon}
            {data[value].label}
          </Flex>
        </Select.Trigger>
        <Select.Content position="popper">
          <Select.Item value="light">Light</Select.Item>
          <Select.Item value="dark">Dark</Select.Item>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};
```

## Notable Features

### Multi-Component Composition
- **Modular architecture**: Select is composed of multiple specialized sub-components (Root, Trigger, Content, Item, Group, Label, Separator) that work together
- **Clear separation of concerns**: Each sub-component handles a specific aspect - Root for state, Trigger for display, Content for dropdown, Items for options
- **Flexible nesting**: Groups and Labels organize items hierarchically, Separators provide visual structure
- **Composition-first**: Extension through composition rather than prop proliferation

### Trigger Customization
- **Variant system**: Four distinct visual styles (classic, surface, soft, ghost) for different UI contexts
- **Ghost variant behavior**: Uses negative margin for optical alignment with surrounding text, renders without visible container
- **Custom children**: Manually control Trigger children to render complex layouts, icons, badges, or custom formatting
- **Automatic selection display**: When not manually controlled, Trigger automatically displays selected item's content

### Content Organization
- **Grouping system**: `Select.Group` organizes related options with `Select.Label` for semantic structure
- **Visual separators**: `Select.Separator` creates clear visual boundaries between groups or sections
- **Disabled items**: Individual items can be disabled without affecting other options
- **Placeholder support**: Display hint text when no value is selected

### Position Control
- **Popper positioning**: `position="popper"` prop places menu below trigger, preventing layout shifts and conflicts
- **Default positioning**: Default behavior optimizes placement within available space
- **Layout considerations**: Position control enables consistent behavior in constrained spaces

### SSR-Safe Implementation
- **Hydration protection**: Manual Trigger rendering prevents layout shift during client-side hydration
- **Value mapping**: Store value-to-display mappings for consistent SSR/client rendering
- **Controlled state**: Use controlled value state with manual Trigger children for SSR contexts

### State Management
- **Dual modes**: Supports both uncontrolled (defaultValue) and controlled (value + onValueChange) patterns
- **Value change callback**: `onValueChange` provides selected value for state management
- **Built-in state**: Internal open/closed state management for dropdown visibility
- **Form integration**: Works with standard form controls and validation

### Accessibility Features
- **Semantic labels**: `Select.Label` ensures proper labeling for screen readers
- **High contrast mode**: `highContrast` prop on Content improves visual accessibility
- **Keyboard navigation**: Full keyboard support for navigation and selection
- **Disabled state**: Proper disabled state communication for items
- **ARIA integration**: Built on Radix Primitives with comprehensive ARIA attributes

### Responsive Design
- **Responsive sizes**: Size prop accepts `Responsive<>` type for breakpoint-specific sizing
- **Fluid scaling**: All variants and colors work consistently across all size options
- **Theme integration**: Inherits responsive behavior from Radix Themes system

### Theme Integration
- **Color system**: Deep integration with Radix Themes color palette for both Trigger and Content
- **Margin props**: Trigger supports common margin props from theme system (m, mx, my, mt, mr, mb, ml)
- **Design tokens**: All styling uses theme tokens for consistency across application
- **Variant coordination**: Content variants can match or contrast with Trigger variants

### Content Variants
- **Solid variant**: High-contrast dropdown with solid background (default)
- **Soft variant**: Subtle background with reduced visual weight
- **Color coordination**: Content can match Trigger color or use independent colors
- **High contrast option**: Further increases item contrast within Content for accessibility

## Research Notes

### API Design Philosophy
Radix UI Themes Select follows a "composition with configuration" approach, balancing multiple concerns:
- **Multi-component structure**: Splits functionality across specialized components rather than monolithic design
- **Native props for common patterns**: Size, variant, color, radius, placeholder all available as props
- **Composition for content**: Options, groups, labels, and separators defined through component nesting
- **Manual control escape hatch**: Custom Trigger children enable advanced customization when needed
- **SSR considerations**: Built-in patterns for safe server-side rendering

### Sub-Component Architecture
The seven-component structure provides excellent separation of concerns:
1. **Root**: State container, manages value and open/closed state
2. **Trigger**: Display component, shows selected value and opens menu
3. **Content**: Dropdown container, manages menu appearance and positioning
4. **Item**: Individual option, handles selection and disabled state
5. **Group**: Semantic grouping container for related items
6. **Label**: Heading for groups, provides context and accessibility
7. **Separator**: Visual divider between sections

This architecture enables flexible composition while maintaining clear responsibilities.

### Variant Strategy
The trigger variant system provides comprehensive visual hierarchy:
1. **Surface** (default): Moderate visual weight with subtle background
2. **Classic**: Traditional select appearance with clear boundaries
3. **Soft**: Reduced visual weight for secondary selections
4. **Ghost**: No chrome, blends with text content using negative margin

Content variants add another dimension:
- **Solid** (default): High contrast dropdown for clarity
- **Soft**: Subtle background for less prominent selections

This creates a 4×2 matrix of trigger/content combinations for different contexts.

### Customization Patterns
The component provides multiple levels of customization:
1. **Simple props**: variant, size, color, radius for common variations
2. **Composition**: Groups, labels, separators organize content structure
3. **Manual Trigger control**: Custom children override default rendering for complex needs
4. **Position control**: Popper positioning for layout-constrained scenarios
5. **SSR-safe patterns**: Manual rendering prevents hydration mismatches

This progressive customization approach serves simple and complex use cases.

### State Management Patterns
Offers both controlled and uncontrolled patterns:
- **Uncontrolled**: `defaultValue` prop for simple forms, internal state management
- **Controlled**: `value` + `onValueChange` for external state management, integrations
- **Hybrid**: Can use controlled state with manual Trigger rendering for SSR

This flexibility supports various state management approaches (React state, form libraries, global stores).

### Grouping and Organization
The grouping system provides semantic and visual organization:
- **Select.Group**: Wraps related items, provides semantic structure
- **Select.Label**: Labels groups for screen readers and visual context
- **Select.Separator**: Creates visual boundaries without semantic meaning
- **Disabled items**: Can disable individual items within any group

This enables complex option hierarchies while maintaining accessibility.

### Accessibility Considerations
- Built on Radix Primitives with comprehensive ARIA support
- `Select.Label` ensures proper group labeling for screen readers
- `highContrast` prop improves visual accessibility for items
- Keyboard navigation built-in (arrows, enter, escape, typing)
- Disabled state properly communicated to assistive technologies
- Focus management handles dropdown open/close automatically

### SSR Optimization
The manual Trigger rendering pattern solves hydration issues:
- **Problem**: Selected value might not be known during SSR
- **Solution**: Control Trigger children manually with client-side state
- **Benefit**: No layout shift when client-side JavaScript hydrates
- **Pattern**: Store value-to-display mapping, use controlled state, render Trigger children explicitly

This is a sophisticated solution to a common SSR problem.

### Position Strategy
The `position="popper"` prop addresses layout challenges:
- **Default behavior**: Optimizes placement within available space
- **Popper mode**: Always positions below trigger, prevents layout shifts
- **Use case**: Constrained spaces, fixed layouts, predictable positioning needs
- **Trade-off**: Less automatic optimization for more predictable behavior

### Pattern Completeness
The component provides comprehensive coverage of select use cases:
- ✅ Single selection with full state management
- ✅ Grouped options with labels
- ✅ Visual separators for organization
- ✅ Disabled items
- ✅ Placeholder text for empty state
- ✅ Multiple trigger variants for different contexts
- ✅ Custom trigger rendering for icons and complex layouts
- ✅ SSR-safe patterns
- ✅ Position control for layout constraints
- ✅ High contrast accessibility mode
- ✅ Full color and size customization
- ❌ No multi-select (single-select only)
- ❌ No search/filter (external implementation needed)
- ❌ No creatable options (static options only)

### Comparison Points for Semantic UI
- **Multi-component composition**: Split functionality across Root, Trigger, Content, Item, Group, Label, Separator
- **Variant systems**: Separate variants for Trigger (4 options) and Content (2 options)
- **Ghost variant**: Uses negative margin for optical text alignment
- **Manual Trigger control**: Custom children pattern for advanced customization
- **SSR-safe patterns**: Explicit guidance for avoiding hydration issues
- **Position prop**: `position="popper"` for explicit layout control
- **Grouping system**: Native support via Group and Label components
- **High contrast mode**: Accessibility enhancement for Content items
- **Responsive props**: Built-in responsive prop type support
- **Theme integration**: Deep integration with design token system
- **Margin props**: Theme-aware spacing control on Trigger
- **Item-level disabled**: Granular control over disabled options
- **Automatic display**: Trigger automatically shows selected item unless manually controlled

### Implementation Insights
Key technical decisions observed:
- **Composition over configuration**: Uses multiple components rather than heavy prop API
- **Controlled customization points**: Trigger children can be controlled without breaking other features
- **Layered variant system**: Trigger and Content have independent variant controls
- **Position as behavior**: `position` prop changes positioning strategy, not just CSS
- **SSR as first-class**: Documentation explicitly covers SSR patterns
- **Accessibility by default**: Semantic structure (Group, Label) encourages accessible implementations
- **Progressive enhancement**: Works with simple props, scales to complex customization

### Documentation Quality Observations
- Excellent organization with clear sections for each feature
- Multiple working examples for every major pattern
- SSR considerations explicitly documented (rare in component docs)
- Advanced patterns (custom icons, manual rendering) clearly explained
- API props organized by sub-component
- Visual examples show all variants side-by-side
- Composition patterns demonstrated through code examples
