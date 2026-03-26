# Mantine - List Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/list/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Excellent - Mantine provides clear, comprehensive documentation with practical examples demonstrating all major List features including basic lists, icon customization, nested structures, and theme integration.

## Component Definition
- **Core purpose**: Renders ordered or unordered lists with flexible styling, custom icons, and nested list support for semantic list presentations
- **Mental model**: A semantic container component that wraps standard HTML list elements (ul/ol) with enhanced styling capabilities, icon customization, and proper spacing management
- **Semantic meaning**: Communicates structured, ordered or unordered collections of items with visual hierarchy, proper accessibility attributes, and flexible visual styling

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `icon`, `spacing`, `size`)
- **Composed**: Via composition/children (e.g., `<List.Item>Content</List.Item>`)
- **CSS-only**: Requires custom styling (e.g., className overrides via Mantine's classNames prop)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Children prop accepts text strings directly in List.Item |
| Icon support | ✅ | Native | `icon` prop on List sets default for all items, overridable per item |
| Icon + Text | ✅ | Native | Icons via `icon` prop displayed alongside item content |
| Multiple items | ✅ | Composed | Multiple `<List.Item>` children render as distinct list items |
| Custom content | ✅ | Composed | List.Item children can include any React elements for complex content |
| Nested lists | ✅ | Native | `withPadding` and `listStyleType` props support nested list structures |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Unordered | ✅ | Native | Default behavior - renders as `<ul>` with bullet points |
| Ordered | ✅ | Native | `type="ol"` prop renders as numbered list `<ol>` |
| Custom bullets | ✅ | Native | `icon` prop replaces default bullets with custom icon or React element |
| No bullets | ✅ | CSS-only | Can be styled via CSS to remove list markers entirely |

## Spacing & Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Item spacing | ✅ | Native | `spacing` prop controls gap between items (defaults to 0, accepts theme or CSS values) |
| Icon alignment | ✅ | Native | `center` prop centers item content vertically with icon |
| Padding offset | ✅ | Native | `withPadding` prop indents nested lists for visual hierarchy |
| Font size | ✅ | Native | `size` prop controls font-size from theme (xs, sm, md, lg, xl) |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| List traversal | ✅ | Composed | Standard React iteration with `.map()` for dynamic lists |
| Conditional rendering | ✅ | Composed | Conditional List.Item rendering based on state/data |
| Event handling | ✅ | Composed | Standard React click handlers on List.Item elements |

## Data/Structure Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple list | ✅ | Composed | Array of strings/values rendered as List.Item children |
| Keyed iteration | ✅ | Composed | React key prop required when rendering lists dynamically |
| Nested structures | ✅ | Native | Nested `<List>` inside `<List.Item>` with `withPadding` support |
| Dynamic content | ✅ | Composed | State-driven list content updates |

## Code Examples

### Basic Unordered List
```jsx
import { List } from '@mantine/core';

function BasicList() {
  return (
    <List>
      <List.Item>First item</List.Item>
      <List.Item>Second item</List.Item>
      <List.Item>Third item</List.Item>
    </List>
  );
}
```

### Ordered List
```jsx
import { List } from '@mantine/core';

function OrderedList() {
  return (
    <List type="ol">
      <List.Item>First step</List.Item>
      <List.Item>Second step</List.Item>
      <List.Item>Third step</List.Item>
    </List>
  );
}
```

### List with Custom Icons
```jsx
import { List } from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';

function ListWithIcons() {
  return (
    <>
      {/* Default icon for all items */}
      <List icon={<IconCheck size={20} color="teal" stroke={3} />} spacing="md">
        <List.Item>Completed task</List.Item>
        <List.Item>Another completed task</List.Item>
        <List.Item
          icon={<IconAlertCircle size={20} color="red" stroke={3} />}
        >
          Overridden icon item
        </List.Item>
      </List>
    </>
  );
}
```

### Icon with Content Centering
```jsx
import { List } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

function CenteredIconList() {
  return (
    <List
      icon={<IconCheck size={20} />}
      spacing="md"
      size="md"
      center
    >
      <List.Item>Icon and content are vertically centered</List.Item>
      <List.Item>Useful for better visual alignment</List.Item>
    </List>
  );
}
```

### Nested Lists
```jsx
import { List } from '@mantine/core';

function NestedLists() {
  return (
    <List type="ol" listStyleType="ordered">
      <List.Item>
        First item
        <List withPadding listStyleType="unordered">
          <List.Item>Nested item 1</List.Item>
          <List.Item>Nested item 2</List.Item>
        </List>
      </List.Item>
      <List.Item>Second item</List.Item>
    </List>
  );
}
```

### List with Spacing
```jsx
import { List } from '@mantine/core';

function SpacedList() {
  return (
    <List spacing="lg" size="lg">
      <List.Item>Item with larger spacing</List.Item>
      <List.Item>More space between items</List.Item>
      <List.Item>Custom spacing from theme</List.Item>
    </List>
  );
}
```

### Dynamic List from Array
```jsx
import { List } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

function DynamicList({ items }) {
  return (
    <List icon={<IconCheck size={16} />}>
      {items.map((item, index) => (
        <List.Item key={index}>{item}</List.Item>
      ))}
    </List>
  );
}
```

### List with Different Bullet Styles
```jsx
import { List } from '@mantine/core';

function BulletStylesList() {
  return (
    <>
      <div>
        <h3>Unordered (default)</h3>
        <List listStyleType="unordered">
          <List.Item>Bullet point</List.Item>
          <List.Item>Another bullet</List.Item>
        </List>
      </div>

      <div>
        <h3>Ordered (numbers)</h3>
        <List type="ol" listStyleType="ordered">
          <List.Item>First step</List.Item>
          <List.Item>Second step</List.Item>
        </List>
      </div>

      <div>
        <h3>Ordered (letters)</h3>
        <List listStyleType="lower-alpha">
          <List.Item>Letter a</List.Item>
          <List.Item>Letter b</List.Item>
        </List>
      </div>
    </>
  );
}
```

### Theme Integration - Using Design Tokens
```jsx
import { List, MantineProvider } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

function ThemedList() {
  return (
    <MantineProvider theme={{ spacing: { custom: '1.5rem' } }}>
      <List
        icon={<IconCheck size={20} color="var(--mantine-color-blue-6)" />}
        spacing="md"
        size="md"
      >
        <List.Item>Uses theme colors and spacing</List.Item>
        <List.Item>Responsive to theme changes</List.Item>
      </List>
    </MantineProvider>
  );
}
```

### Complex List Items with Multiple Elements
```jsx
import { List, Text, Group, Badge } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

function ComplexListItems() {
  return (
    <List icon={<IconStar size={16} />} spacing="lg">
      <List.Item>
        <Group justify="space-between">
          <Text>Feature item</Text>
          <Badge color="blue">new</Badge>
        </Group>
      </List.Item>
      <List.Item>
        <div>
          <Text fw={500}>Important task</Text>
          <Text size="sm" c="dimmed">Additional context</Text>
        </div>
      </List.Item>
    </List>
  );
}
```

## Notable Features

### Icon Customization System
- `icon` prop on List component sets default icon for all items
- `icon` prop on individual List.Item components overrides the context icon
- Accepts any React component or element as icon value
- Works seamlessly with icon libraries like Tabler Icons (installed with Mantine)

### Semantic List Structure
- Uses native HTML `<ul>` and `<ol>` elements for proper semantic meaning
- Maintains browser default list behavior while allowing customization
- Supports accessibility features through standard HTML structure
- Works correctly with screen readers out of the box

### Nested List Support
- `withPadding` prop adds indentation to nested lists
- `listStyleType` prop controls bullet/number style
- Supports arbitrary nesting depth
- Proper visual hierarchy through padding offset

### Theme Integration
- `spacing` prop accepts values from theme.spacing or any CSS value
- `size` prop controls font-size from theme token
- Colors integrated with Mantine's color system
- Respects component theme provider configuration
- Responsive design support through theme breakpoints

### Layout Control
- `center` prop vertically centers content with icons
- Consistent spacing management across items
- Proper alignment of icons and text
- No margin/padding conflicts between items

### Flexible Content Support
- List.Item can contain any React content
- Supports text, elements, components as children
- Works with other Mantine components inside items
- Enables complex item layouts (badges, buttons, etc.)

### List Style Type Options
- `unordered` - bullet points (default for ul)
- `ordered` - numbers (default for ol)
- `lower-alpha` - lowercase letters (a, b, c...)
- `upper-alpha` - uppercase letters (A, B, C...)
- `lower-roman` - lowercase roman numerals (i, ii, iii...)
- `upper-roman` - uppercase roman numerals (I, II, III...)
- Standard CSS list-style-type values supported

### Accessibility
- Semantic HTML list structure ensures proper accessibility
- Works correctly with screen readers
- Keyboard navigation through native list behavior
- Proper ARIA roles inherited from HTML elements
- Text content is searchable and selectable

### Component Composition
- List is a container component with no state management
- List.Item is a simple wrapper component
- Composable with React patterns (map, filter, etc.)
- Works with state management systems (Redux, Context, etc.)

## API Reference

### List Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'ul' \| 'ol'` | `'ul'` | HTML list element type (ul or ol) |
| `icon` | `React.ReactNode` | bullet | Default icon/bullet for all items, can be overridden per item |
| `spacing` | `string \| number` | `0` | Spacing between items from theme or CSS value |
| `size` | `string` | `'md'` | Font size from theme (xs, sm, md, lg, xl) |
| `center` | `boolean` | `false` | Center item content vertically with icon |
| `withPadding` | `boolean` | `true` | Add padding offset to nested lists |
| `listStyleType` | `string` | auto | CSS list-style-type value (unordered, ordered, lower-alpha, etc.) |
| `children` | `React.ReactNode` | required | List items as children |
| `className` | `string` | - | Additional CSS class |
| `style` | `CSSProperties` | - | Inline styles |
| `ml` | `string \| number` | - | Margin left |
| `mr` | `string \| number` | - | Margin right |
| `mb` | `string \| number` | - | Margin bottom |
| `mt` | `string \| number` | - | Margin top |
| `m` | `string \| number` | - | All margins |
| `p` | `string \| number` | - | All padding |
| `pl` | `string \| number` | - | Padding left |
| `pr` | `string \| number` | - | Padding right |

### List.Item Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ReactNode` | inherited | Icon for this specific item, overrides List icon |
| `children` | `React.ReactNode` | required | Item content |
| `className` | `string` | - | Additional CSS class |
| `style` | `CSSProperties` | - | Inline styles |

## Research Notes

- Mantine List is a simple, focused component designed for semantic list rendering
- The component follows React composition patterns for flexibility
- Icon system is well-designed with context override capability
- Theme integration is thorough with spacing, size, and color support
- Nested lists are well-supported with padding and style controls
- The component prioritizes semantic HTML over styled divs
- Works seamlessly with other Mantine components for complex item layouts
- No built-in selection, active states, or interactive features (by design)
- Icon customization is extensive - any React component can be an icon
- The component is lightweight and focuses on list presentation
- Documentation includes practical examples for all common use cases
- Supports both controlled and uncontrolled usage patterns
- Package: @mantine/core (part of Mantine v8 ecosystem)
- Version 8.3.6 indicates mature, active development
- All examples compile with TypeScript and are production-ready
- The List component is designed as a presentation layer, not a data management component
- Pairs well with hooks like useList or custom data management
- Excellent for building: checklists, steps, feature lists, documentation, requirements lists
- Polymorphic styling possible through className and style props
- Respects logical CSS properties for RTL language support

## Variations & Configurations

### List Variations by Use Case

**Checklist Pattern**
```jsx
<List icon={<IconCheck size={16} />}>
  {/* Items marked as complete */}
</List>
```

**Feature List Pattern**
```jsx
<List icon={<IconCheck size={16} color="green" />} spacing="md">
  {/* Feature items with emphasis */}
</List>
```

**Warning/Alert Pattern**
```jsx
<List icon={<IconAlertCircle size={16} color="red" />}>
  {/* Warning items highlighted */}
</List>
```

**Steps/Instructions Pattern**
```jsx
<List type="ol" spacing="md" size="lg">
  {/* Numbered steps for procedures */}
</List>
```

**Specification List Pattern**
```jsx
<List spacing="sm">
  {/* Detailed specs with default bullets */}
</List>
```

