# Chakra UI - List Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/list
Status: ✅ Working
Version: Latest (v3.x)
Last Verified: 2025-11-05

## Documentation Quality
Good - Well-organized component documentation with clear API structure, multipart composition examples, and basic usage patterns. Documentation covers List.Root and List.Item composition patterns with styling options.

## Component Definition
- **Core purpose**: Provides a flexible container for rendering ordered and unordered lists with support for custom icons, markers, and styling through CSS properties and theme variants.
- **Mental model**: A semantic composition-based list builder where List.Root acts as the container (configurable as `<ul>` or `<ol>`) and List.Item represents individual list entries. Icons and markers are optional enhancements for visual customization.
- **Semantic meaning**: Communicates structured content through semantic list elements, with markers indicating list type (bullet for unordered, numbers for ordered) and optional icons providing visual emphasis or additional context.

## Pattern Support Levels
- **Native**: Dedicated component/prop (e.g., `List.Root`, `List.Item`, `as="ol"`, `spacing`, `List.Indicator`)
- **Composed**: Via composition/children (e.g., nested lists, custom content in items, icon + text combinations)
- **CSS-only**: Requires custom styling (e.g., custom marker colors beyond theme, custom icon styling)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Children of List.Item accept any content. Text is rendered as direct child |
| Icon support | ✅ | Native | `List.Indicator` component with `asChild` prop for custom icons. Icons sized relative to font-size of parent List.Item |
| Icon + Text | ✅ | Native + Composed | List.Indicator followed by text children. Automatic alignment and spacing via theme |
| Custom content | ✅ | Composed | List.Item children accept any React elements/components for flexible content layout |
| Nested lists | ✅ | Composed | List.Root can be nested inside List.Item elements for hierarchical structures. Indentation via padding props (e.g., `ps="5"`) |
| Mixed content | ✅ | Composed | List.Item can contain mixed content: text, icons, components, and even nested lists |

## List Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Unordered list | ✅ | Native | List.Root renders as `<ul>` by default. Default bullet markers (disc) |
| Ordered list | ✅ | Native | List.Root with `as="ol"` prop renders as `<ol>`. Numeric markers (1, 2, 3...) |
| Custom element | ✅ | Native | `as` prop allows rendering as any valid HTML element (e.g., `as="nav"`, `as="div"`) |
| Unstyled list | ✅ | CSS-only | Default theme provides base styling; custom variants can remove markers |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled state | ⚠️ | CSS-only | No native disabled prop; disabled styling via custom CSS or opacity modifier (e.g., `opacity={0.5}`) |
| Hover state | ✅ | CSS-only | Hover effects applied via `_hover` pseudo-selector on List.Item |
| Active/Selected | ⚠️ | CSS-only | No built-in selection state; requires manual implementation via props + `_hover` or `bg` styling |
| Focus state | ✅ | CSS-only | Focus styles via `_focus` pseudo-selector for keyboard navigation |

## Marker & Icon Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default marker | ✅ | Native | Automatic bullets (`•`) for unordered, numbers for ordered lists |
| Custom marker color | ✅ | Native | `_marker={{ color: 'inherit' }}` or custom color for marker styling |
| Marker styling | ✅ | Native | `_marker` pseudo-selector supports color, font-size, and other CSS properties |
| Icon instead of marker | ✅ | Native | `List.Indicator` component replaces default marker with custom icon |
| Icon sizing | ✅ | Native | Icon size automatically scales with font-size of List.Item via theme |
| Multiple icons | ⚠️ | Composed | Multiple List.Indicator components can be placed before text, positioned via flexbox |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Spacing between items | ✅ | Native | `spacing` prop on List.Root controls gap between List.Item elements (e.g., `spacing="2"`, `spacing="1rem"`) |
| Padding/indentation | ✅ | Native | Padding props (e.g., `ps="5"`, `px="4"`) for list and items. Useful for nested lists |
| Font size | ✅ | Native | `fontSize` prop controls text size, which also scales icons via theme |
| Alignment | ✅ | Native | `align` prop on List.Root (e.g., `align="center"`, `align="start"`) for horizontal alignment |
| Colors | ✅ | Native | `color` prop for text color; `_marker` for marker color styling |
| Variants | ⚠️ | Theme-dependent | Variants can be extended in theme but not provided in default theme |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | `onClick` on List.Item for item selection/action handling |
| Keyboard navigation | ✅ | CSS-only | Focus states via `_focus` enable keyboard navigation; requires manual handler implementation |
| Selection/highlighting | ⚠️ | CSS-only | No built-in selection; implement via `bg` prop or custom styling based on state |
| List as link container | ✅ | Composed | List.Item can wrap `<a>` or Link components for navigation |
| Dynamic list rendering | ✅ | Composed | Map over array to generate List.Item elements dynamically |

## Layout & Spacing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Full-width list | ✅ | Native | `width="100%"` or Chakra's width props for full container width |
| Fixed width | ✅ | Native | `width` prop (e.g., `width="300px"`, `maxWidth="sm"`) |
| Horizontal spacing | ✅ | Native | Margin props (`mx`, `my`) on List.Root for outer spacing |
| Item padding | ✅ | Native | Padding props on List.Item for inner spacing around content |
| Gap between items | ✅ | Native | `spacing` prop controls vertical gap; horizontal gap not applicable for default list layout |

## Code Examples

### Basic Unordered List
```jsx
import { List } from "@chakra-ui/react"

function BasicList() {
  return (
    <List.Root>
      <List.Item>First item</List.Item>
      <List.Item>Second item</List.Item>
      <List.Item>Third item</List.Item>
    </List.Root>
  )
}
```

### Ordered List
```jsx
import { List } from "@chakra-ui/react"

function OrderedList() {
  return (
    <List.Root as="ol">
      <List.Item>First step</List.Item>
      <List.Item>Second step</List.Item>
      <List.Item>Third step</List.Item>
    </List.Root>
  )
}
```

### List with Icons
```jsx
import { List } from "@chakra-ui/react"
import { CheckIcon, WarningIcon } from "@chakra-ui/icons"

function ListWithIcons() {
  return (
    <List.Root>
      <List.Item>
        <List.Indicator asChild>
          <CheckIcon color="green.500" />
        </List.Indicator>
        Completed task
      </List.Item>
      <List.Item>
        <List.Indicator asChild>
          <WarningIcon color="orange.500" />
        </List.Indicator>
        Pending review
      </List.Item>
    </List.Root>
  )
}
```

### List with Custom Spacing
```jsx
import { List } from "@chakra-ui/react"

function SpacedList() {
  return (
    <List.Root spacing="4" ps="6">
      <List.Item>Item with larger spacing</List.Item>
      <List.Item>Between items</List.Item>
      <List.Item>And left padding</List.Item>
    </List.Root>
  )
}
```

### Nested Lists
```jsx
import { List } from "@chakra-ui/react"

function NestedLists() {
  return (
    <List.Root>
      <List.Item>
        Parent item
        <List.Root ps="5" as="ul">
          <List.Item>Child item 1</List.Item>
          <List.Item>Child item 2</List.Item>
        </List.Root>
      </List.Item>
      <List.Item>Second parent item</List.Item>
    </List.Root>
  )
}
```

### Styled Markers
```jsx
import { List } from "@chakra-ui/react"

function StyledMarkerList() {
  return (
    <List.Root _marker={{ color: "blue.500", fontSize: "lg" }}>
      <List.Item>Item with blue marker</List.Item>
      <List.Item>Another item</List.Item>
    </List.Root>
  )
}
```

### Dynamic List Rendering
```jsx
import { List } from "@chakra-ui/react"

function DynamicList({ items }) {
  return (
    <List.Root>
      {items.map((item, index) => (
        <List.Item key={index}>{item}</List.Item>
      ))}
    </List.Root>
  )
}

// Usage
const items = ["Learn React", "Build components", "Deploy app"]
<DynamicList items={items} />
```

### List with Click Handlers
```jsx
import { List, Box } from "@chakra-ui/react"
import { useState } from "react"

function InteractiveList() {
  const [selected, setSelected] = useState(null)

  return (
    <List.Root>
      {["Option A", "Option B", "Option C"].map((option, index) => (
        <List.Item
          key={index}
          onClick={() => setSelected(index)}
          bg={selected === index ? "blue.100" : "transparent"}
          cursor="pointer"
          px="3"
          py="2"
          borderRadius="md"
        >
          {option}
        </List.Item>
      ))}
    </List.Root>
  )
}
```

### List as Navigation
```jsx
import { List, Link } from "@chakra-ui/react"

function NavigationList() {
  return (
    <List.Root>
      <List.Item>
        <Link href="/home">Home</Link>
      </List.Item>
      <List.Item>
        <Link href="/about">About</Link>
      </List.Item>
      <List.Item>
        <Link href="/contact">Contact</Link>
      </List.Item>
    </List.Root>
  )
}
```

### Multiple Icons in List Item
```jsx
import { List, Box } from "@chakra-ui/react"
import { CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons"

function ListWithMultipleIcons() {
  return (
    <List.Root>
      <List.Item display="flex" alignItems="center" gap="3">
        <List.Indicator asChild>
          <CheckIcon color="green.500" />
        </List.Indicator>
        <Box flex="1">Item content</Box>
        <ExternalLinkIcon />
      </List.Item>
    </List.Root>
  )
}
```

### Colored List with Font Control
```jsx
import { List } from "@chakra-ui/react"

function StyledList() {
  return (
    <List.Root
      color="gray.700"
      fontSize="sm"
      spacing="2"
      _marker={{ color: "gray.400" }}
    >
      <List.Item>Smaller, gray text</List.Item>
      <List.Item>With light colored markers</List.Item>
      <List.Item>And tight spacing</List.Item>
    </List.Root>
  )
}
```

## Notable Features

### Multipart Composition Pattern
- List.Root is the container component that can be rendered as `<ul>` or `<ol>` via the `as` prop
- List.Item represents individual list entries
- List.Indicator is an optional component for replacing default markers with custom icons
- Clean separation of concerns enables flexible composition

### Icon Integration via List.Indicator
- List.Indicator replaces the default bullet or number marker with a custom icon
- `asChild` prop allows passing custom icon components
- Icons automatically scale with the font-size of the List.Item
- Supports any Chakra UI Icon or custom SVG

### Flexible Element Rendering
- `as` prop allows List.Root to render as different elements (`<ul>`, `<ol>`, `<nav>`, `<div>`)
- Enables semantic HTML when needed (e.g., navigation lists as `<nav>`)
- Allows non-semantic list layouts by rendering as `<div>`

### Marker Customization via _marker
- `_marker` pseudo-selector provides direct control over list marker styling
- Supports color, font-size, and other CSS properties on the marker itself
- Useful for subtle styling adjustments without replacing the marker entirely

### Theme-Based Spacing
- `spacing` prop on List.Root controls vertical gap between List.Item elements
- Works with Chakra's spacing scale (e.g., "2" = 8px, "4" = 16px, "1rem")
- Consistent with Chakra's design system approach

### Nested List Support
- List.Root can be nested inside List.Item for hierarchical structures
- Indentation via padding props (e.g., `ps="5"` for padding-start)
- Clean composition pattern without special nesting components

### Content Projection Flexibility
- List.Item accepts any content: text, icons, components, interactive elements
- Supports complex layouts within items (e.g., flexbox-based item layouts)
- Enables rich list patterns beyond simple text

### Keyboard Navigation Ready
- Focus states can be styled via `_focus` pseudo-selector
- Supports tabbing through list items when interactive
- Requires manual implementation of keyboard handlers for selection

### Color and Typography Control
- `color` prop on List.Root applies to text content
- `fontSize` prop controls text and icon sizing
- All standard Chakra styling props work on List components
- `fontWeight`, `lineHeight` for typography variations

### Accessibility Considerations
- Semantic `<ul>` and `<ol>` elements for screen reader support
- Focus states enable keyboard navigation
- Marker styling doesn't affect accessibility of underlying list structure
- Custom icons via List.Indicator maintain semantic list semantics

## Research Notes

### Access & Documentation
- Documentation successfully accessed at https://chakra-ui.com/docs/components/list
- Component is part of Chakra UI's data display components
- Available in current version (v3.x)
- Clear API structure with List.Root, List.Item, and List.Indicator components

### Framework Approach Observations

**Composition-Based Architecture:**
- Moves away from monolithic `<List>` component to multipart composition (List.Root, List.Item, List.Indicator)
- Follows modern compound component pattern similar to Radix UI
- Provides more flexibility than simpler list implementations

**Semantic HTML First:**
- List.Root can render as semantic `<ul>` or `<ol>` elements
- Maintains accessibility through proper semantic markup
- Allows non-semantic rendering when needed (as "div")

**Icon Pattern via List.Indicator:**
- Replaces default markers with custom icons through dedicated component
- `asChild` prop enables clean icon integration without wrapper elements
- Icons automatically scale with font size (responsive design)

**Minimal Props, Maximum Flexibility:**
- Core props: `as`, `spacing`, `align`, `_marker`, standard Chakra props
- Avoids excessive prop API; relies on composition for complex patterns
- Theme extensibility for custom variants (though not in default theme)

**Styled Props System:**
- Uses Chakra's styled system for all styling (color, fontSize, padding, etc.)
- `_marker` pseudo-selector for marker-specific styling
- `_hover`, `_focus` for interactive states
- Consistent with broader Chakra design system

**Content Flexibility:**
- List.Item children are unrestricted - any content allowed
- Supports nested lists, links, buttons, custom components
- Enables rich list patterns without special APIs

**Theme Integration:**
- List variants can be extended in Chakra theme
- Default theme provides base styling without variants
- Color scheme customization possible via theme extension
- Spacing scale integration (tokens: "2", "4", etc.)

**Potential Challenges:**
- No built-in disabled or selected state props (requires manual styling)
- Variants not provided in default theme (theme customization required)
- Multiple icons require custom flexbox layout (no built-in multi-icon support)
- Icon sizing relies on font-size inheritance (may need explicit control)
- No built-in keyboard interaction patterns (selection, arrow key navigation)

**Accessibility Strengths:**
- Semantic HTML elements maintain screen reader compatibility
- Focus styles via `_focus` pseudo-selector
- Supports semantic landmark elements (e.g., `as="nav"`)
- Marker styling doesn't interfere with accessibility

**Comparison Points:**
- Similar composition approach to Radix UI List component
- Simpler than Ant Design list (no data-display specific patterns)
- More flexible than HTML5 List element alone
- Emphasis on composition over pre-built patterns

**Design Philosophy:**
- Favors composition and flexibility over opinionated patterns
- Follows Chakra's broader philosophy: minimal, extensible, styleable
- Relies on developer to build complex patterns (list selection, keyboard nav)
- Pairs well with Chakra's form components for interactive lists

**Future Extensibility:**
- Architecture supports future enhancements (variants, size modifiers)
- Composition pattern allows for additional sub-components if needed
- Theme system enables design system customization without code changes

