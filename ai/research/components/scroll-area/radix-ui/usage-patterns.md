# Radix UI - Scroll Area Usage Patterns

## Component URL
https://www.radix-ui.com/themes/docs/components/scroll-area
Status: ✅ Working
Version: Radix Themes (current)
Last Verified: 2025-11-05

## Documentation Quality
The documentation is concise and clear, focusing on practical implementation with visual examples. It provides:
- Clear prop definitions with type information
- Multiple size and radius variant demonstrations
- Directional scrollbar examples
- Implementation details for custom styling
- Brief but sufficient accessibility information

The documentation is production-ready with good balance between completeness and brevity. However, it could benefit from more detailed accessibility guidance and advanced customization examples.

## Component Definition
- **Core purpose**: Provide custom-styled scrollbars while maintaining native browser scrolling functionality and performance
- **Mental model**: A scrollable container that replaces default browser scrollbars with styled versions without compromising native behavior or accessibility
- **Semantic meaning**: A scrollable region with enhanced visual design that preserves the browser's native scrolling capabilities

## Pattern Support Levels
- **Native**: Features built directly into the component API through props (size, radius, scrollbars, type)
- **Composed**: Functionality achieved by combining ScrollArea with other Radix Themes components (Box, Flex, Grid) for layout
- **CSS-only**: Customization through theme tokens, CSS custom properties, and standard margin props without additional components

## Core Patterns

### Size Variants
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size "1" (small) | ✅ | Native | 12px scrollbar height, compact for dense layouts |
| Size "2" (medium) | ✅ | Native | 16px scrollbar height, default size |
| Size "3" (large) | ✅ | Native | 20px scrollbar height, prominent scrollbars |
| Responsive sizes | ✅ | Native | `Responsive<"1" \| "2" \| "3">` type support for breakpoint-based sizing |

### Radius Variants
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| none | ✅ | Native | Square scrollbar handles, no border radius |
| small | ✅ | Native | Subtle rounded corners |
| medium | ✅ | Native | Moderate rounded corners |
| large | ✅ | Native | Prominent rounded corners |
| full | ✅ | Native | Fully rounded (pill-shaped) scrollbar handles |

### Scrollbar Direction
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| vertical | ✅ | Native | Vertical scrollbar only via `scrollbars="vertical"` |
| horizontal | ✅ | Native | Horizontal scrollbar only via `scrollbars="horizontal"` |
| both | ✅ | Native | Both axes scrollable (default) via `scrollbars="both"` |
| auto-detection | ❌ | N/A | Must explicitly specify which axes are scrollable |

### Scrollbar Display Types
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| type="always" | ✅ | Native | Scrollbars always visible (inherited from Radix Primitives) |
| type="auto" | ✅ | Native | Scrollbars appear on hover/scroll (inherited from Radix Primitives) |
| type="scroll" | ✅ | Native | Scrollbars visible when scrollable (inherited from Radix Primitives) |
| type="hover" | ✅ | Native | Scrollbars visible on hover only (inherited from Radix Primitives) |

### Layout Integration
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fixed height container | ✅ | CSS-only | Common pattern: `style={{ height: 180 }}` for vertical scrolling |
| Fixed width container | ✅ | CSS-only | Common pattern for horizontal scrolling |
| Margin props | ✅ | Native | Standard Radix Themes margin props (m, mx, my, mt, mr, mb, ml) |
| Padding control | ✅ | Composed | Apply padding via child Box/Flex components |
| Flex integration | ✅ | Composed | Works seamlessly with Flex layouts |
| Grid integration | ✅ | Composed | Demonstrated in directional examples |

### Composition Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| asChild | ✅ | Native | Polymorphic rendering - merge props with child element |
| Content wrapping | ✅ | Composed | Wrap content in Box/Flex for padding/spacing control |
| Nested components | ✅ | Composed | Can contain any Radix Themes components |

## Code Examples

### Basic Vertical Scroll
```jsx
<ScrollArea type="always" scrollbars="vertical" style={{ height: 180 }}>
  <Box p="2" pr="8">
    <Heading size="4" mb="2" trim="start">
      Principles of the typographic craft
    </Heading>
    <Flex direction="column" gap="4">
      <Text as="p">
        Three fundamental aspects of typography are legibility, readability, and
        aesthetics. Although in a restrictive sense legibility and readability
        differ, they are often used interchangeably.
      </Text>
    </Flex>
  </Box>
</ScrollArea>
```

### Size Variants Demonstration
```jsx
<Flex direction="column" gap="2">
  <ScrollArea size="1" type="always" scrollbars="horizontal"
    style={{ width: 300, height: 12 }}>
    <Box width="800px" height="1px" />
  </ScrollArea>

  <ScrollArea size="2" type="always" scrollbars="horizontal"
    style={{ width: 350, height: 16 }}>
    <Box width="900px" height="1px" />
  </ScrollArea>

  <ScrollArea size="3" type="always" scrollbars="horizontal"
    style={{ width: 400, height: 20 }}>
    <Box width="1000px" height="1px" />
  </ScrollArea>
</Flex>
```

### Radius Variants
```jsx
<Flex direction="column" gap="3">
  <ScrollArea radius="none" type="always" scrollbars="horizontal"
    style={{ width: 350, height: 20 }}>
    <Box width="800px" height="1px" />
  </ScrollArea>

  <ScrollArea radius="full" type="always" scrollbars="horizontal"
    style={{ width: 350, height: 20 }}>
    <Box width="800px" height="1px" />
  </ScrollArea>
</Flex>
```

### Directional Scrollbars
```jsx
<Grid columns="2" gap="2">
  <ScrollArea type="always" scrollbars="vertical" style={{ height: 150 }}>
    <Box p="2" pr="8">
      {/* Vertical content */}
      <Heading size="4" mb="2" trim="start">
        Vertical Content
      </Heading>
      <Text as="p">Long vertical content here...</Text>
    </Box>
  </ScrollArea>

  <ScrollArea type="always" scrollbars="horizontal" style={{ height: 150 }}>
    <Box p="2" pb="8">
      <Flex gap="4">
        {/* Horizontal content */}
        <Box width="200px">Item 1</Box>
        <Box width="200px">Item 2</Box>
        <Box width="200px">Item 3</Box>
      </Flex>
    </Box>
  </ScrollArea>
</Grid>
```

### Responsive Size Example
```jsx
<ScrollArea
  size={{ initial: "1", sm: "2", md: "3" }}
  type="always"
  scrollbars="vertical"
  style={{ height: 200 }}
>
  <Box p="2" pr="8">
    {/* Content adapts scrollbar size based on viewport */}
  </Box>
</ScrollArea>
```

### AsChild Pattern
```jsx
<ScrollArea asChild>
  <section style={{ height: 300 }}>
    <Box p="4">
      {/* Content rendered in semantic section element */}
    </Box>
  </section>
</ScrollArea>
```

## Styling Approaches

### Native Prop-Based Styling
- **size** - Three progressive sizes (1, 2, 3) controlling scrollbar handle dimensions
- **radius** - Five radius options (none, small, medium, large, full) for scrollbar handle corners
- **scrollbars** - Directional control (vertical, horizontal, both)
- **type** - Display behavior (always, auto, scroll, hover) inherited from Radix Primitives

### Margin Props Integration
Standard Radix Themes margin props for spacing:
- `m` - All sides margin
- `mx`, `my` - Horizontal/vertical margins
- `mt`, `mr`, `mb`, `ml` - Individual side margins

### Theme System Integration
Radix Themes provides token-based theming:
- Scrollbar colors inherit from theme color palette
- Consistent with overall design system
- Customizable through theme configuration

### CSS Custom Properties
Direct styling via inline styles:
```jsx
<ScrollArea style={{ height: 180, maxWidth: '100%' }}>
```

### Viewport Hiding Implementation
The component hides native scrollbars while preserving functionality:
```css
[data-radix-scroll-area-viewport] {
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

[data-radix-scroll-area-viewport]::-webkit-scrollbar {
  display: none;
}
```

## Accessibility Patterns

### Native Scrolling Behavior
- **Keyboard navigation**: Preserved through native browser scrolling
  - Arrow keys for incremental scrolling
  - Page Up/Page Down for page-based scrolling
  - Home/End for jumping to start/end
  - Space for page scrolling
- **Screen reader compatibility**: Uses native scrolling regions recognized by assistive technology
- **Platform consistency**: Respects user's system scrolling preferences and settings

### Semantic Structure
- Built on Radix UI Primitives foundation ensuring accessible structure
- Maintains proper scrollable region semantics
- No custom ARIA attributes needed due to native scrolling approach

### Responsive Design
- Supports responsive prop values for different breakpoints
- `Responsive<>` type allows size adaptation based on viewport
- Example: `size={{ initial: "1", md: "2", lg: "3" }}`

### Touch and Mobile Support
- `-webkit-overflow-scrolling: touch` enables momentum scrolling on iOS
- Native touch gestures preserved
- Responsive sizing for mobile-friendly scrollbar dimensions

## Notable Features

### Hybrid Approach
- **Native functionality**: Uses browser's native scrolling engine for performance and accessibility
- **Custom appearance**: Provides styled scrollbars that integrate with design system
- **Best of both worlds**: Performance and accessibility of native scrolling with visual control

### Radix Primitives Foundation
- Built on `@radix-ui/react-scroll-area` primitive
- Inherits `Root` and `Viewport` props from primitive layer
- Type system includes `type` prop for display behavior (always, auto, scroll, hover)

### Responsive API
- All props support responsive syntax via `Responsive<>` type
- Breakpoint-based customization without media queries
- Consistent with Radix Themes responsive patterns

### AsChild Pattern
- Polymorphic component rendering
- Merges ScrollArea functionality with custom element
- Useful for semantic HTML (section, article, main)

### Layout Flexibility
- Works with all Radix Themes layout primitives (Box, Flex, Grid, Container, Section)
- No restrictions on content type
- Composable with full component library

### Performance Optimized
- Uses native scrolling for optimal performance
- No JavaScript-based scroll handling
- Minimal DOM overhead

## Research Notes

### Implementation Philosophy
Radix UI Scroll Area takes a "progressive enhancement" approach - it enhances visual appearance while preserving 100% of native scrolling functionality. This differs from custom scrollbar implementations that rebuild scrolling behavior in JavaScript.

### Type System Strengths
Strong TypeScript integration with:
- Union types for variants (`"1" | "2" | "3"`, `"vertical" | "horizontal" | "both"`)
- Responsive type wrappers
- Inherited props from Radix Primitives
- Type-safe prop composition

### CSS Strategy
The viewport hiding technique is cross-browser compatible:
- `scrollbar-width: none` - Firefox
- `-ms-overflow-style: none` - IE/Edge
- `::-webkit-scrollbar { display: none }` - Chrome/Safari/Opera
- `-webkit-overflow-scrolling: touch` - iOS momentum scrolling

### Design System Integration
ScrollArea is a Radix Themes component, meaning:
- Consistent with theme tokens and color system
- Shares common prop patterns (size, radius, margin)
- Works seamlessly with other Radix Themes components
- Part of a cohesive design language

### Limitations and Constraints
1. **Fixed size container required**: Must specify `height` (vertical) or `width` (horizontal) via inline styles
2. **No auto-detection**: Cannot automatically determine which scrollbars to show based on content overflow
3. **Theme dependency**: Tightly coupled to Radix Themes ecosystem
4. **Limited customization**: Cannot deeply customize scrollbar appearance beyond provided props
5. **No scrollbar position callbacks**: No events for scroll position tracking (would need to add manually to viewport)

### Comparison to Alternatives
- **vs. Native scrollbars**: Better visual control, consistent cross-browser appearance
- **vs. JavaScript scrollers**: Better performance, native accessibility, simpler implementation
- **vs. CSS-only solutions**: More reliable cross-browser support, integrated with design system
- **vs. Other libraries**: Lighter weight, no jQuery dependency, modern React patterns

### Common Use Cases
1. **Content viewers**: Long-form text, documentation, articles
2. **Data tables**: Horizontal scrolling for wide tables
3. **Code editors**: Syntax-highlighted code blocks with custom scrollbars
4. **Chat interfaces**: Vertically scrolling message lists
5. **Image galleries**: Horizontally scrolling thumbnail strips
6. **Navigation menus**: Overflow menus with many items

### Best Practices Observed
1. **Explicit dimensions**: Always specify container height/width
2. **Padding on children**: Use `pr="8"` or `pb="8"` on child elements to prevent content from hiding under scrollbar
3. **Type specification**: Use `type="always"` during development to see scrollbars, adjust before production
4. **Direction clarity**: Explicitly set `scrollbars` prop to communicate intent
5. **Responsive sizing**: Consider smaller scrollbars on mobile devices

### Framework Context
This is a Radix Themes component (high-level design system) built on Radix Primitives (low-level unstyled components). For non-Radix projects, the underlying primitive `@radix-ui/react-scroll-area` provides the same functionality without theming.
