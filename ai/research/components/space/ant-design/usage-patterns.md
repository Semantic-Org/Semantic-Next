# Ant Design - Space Usage Patterns

## Component URL
https://ant.design/components/space
Status: ✅ Working (verified via web search)
Version: 5.x (current)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - the official Ant Design documentation provides detailed API reference, multiple code examples, and interactive demos. The component is well-documented with clear explanations of its purpose and usage patterns.

---

## Component Definition

- **Core purpose**: The Space component is used to set spacing between inline elements, providing a consistent and manageable way to create equidistant arrangements of multiple child elements in both horizontal and vertical layouts. It solves the problem of components "clinging together" by automatically applying uniform spacing without requiring manual margin/padding management.

- **Mental model**: Think of Space as an intelligent wrapper that automatically distributes consistent spacing between its children. It's a layout utility component that handles the common pattern of "put some space between these elements" without requiring custom CSS. The component wraps each child element to enable proper inline alignment and spacing control.

- **Semantic meaning**: Space communicates visual rhythm and grouping through consistent spacing. It indicates that child elements are related but distinct, with the spacing amount (size) communicating the degree of relationship or visual hierarchy.

---

## Pattern Support Levels

- **Native**: Features built directly into the Space component with dedicated props and first-class API support. Examples include size presets (small, middle, large), direction control (horizontal/vertical), alignment options, and wrap behavior.

- **Composed**: Patterns achieved by combining Space with other Ant Design components or nesting Space components. Examples include using Space within Forms, composing with Buttons, or creating complex layouts by nesting horizontal and vertical Space components.

- **CSS-only**: Customizations achieved through className, style, classNames (v5.6.0+), or styles (v5.6.0+) props to override or extend default spacing behavior. Examples include custom spacing values, responsive sizing via media queries, or theme-specific styling through ConfigProvider.

---

## Core Patterns

### Layout Direction

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal layout | ✅ | Native | Default direction, arranges children in a row with horizontal spacing |
| Vertical layout | ✅ | Native | Set via `direction="vertical"`, arranges children in a column with vertical spacing |

### Spacing Sizes

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Small spacing | ✅ | Native | Preset size option via `size="small"` |
| Middle spacing | ✅ | Native | Preset size option via `size="middle"` (default when size prop is omitted) |
| Large spacing | ✅ | Native | Preset size option via `size="large"` |
| Custom pixel spacing | ✅ | Native | Accept numeric value for custom spacing, e.g., `size={16}` |
| Responsive spacing | ✅ | Native | Can use responsive size configuration with breakpoints |
| Different horizontal/vertical spacing | ✅ | Native | Can provide array `[horizontal, vertical]` for asymmetric spacing |

### Alignment

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Start alignment | ✅ | Native | `align="start"` - aligns children to the start of cross axis |
| Center alignment | ✅ | Native | `align="center"` - centers children on cross axis |
| End alignment | ✅ | Native | `align="end"` - aligns children to the end of cross axis |
| Baseline alignment | ✅ | Native | `align="baseline"` - aligns children along text baseline |

### Wrapping Behavior

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Auto wrap | ✅ | Native | `wrap={true}` enables automatic line wrapping for horizontal layouts |
| No wrap | ✅ | Native | Default behavior (wrap={false}), items stay in single line/column |

### Visual Separators

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Split/Divider | ✅ | Native | `split` prop accepts ReactNode to render between each child element |

### Compact Mode

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Space.Compact | ✅ | Native | Dedicated sub-component for compactly connecting form elements with collapsed borders (v4.24.0+) |
| Compact block | ✅ | Native | `Space.Compact` with `block` prop for full-width compact groups |
| Compact direction | ✅ | Native | `Space.Compact` supports `direction` prop for horizontal/vertical compact layouts |

### Styling Customization

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom className | ✅ | Native | Standard `className` prop for wrapper element |
| Custom style | ✅ | Native | Standard `style` prop for inline styles on wrapper |
| Child classNames | ✅ | Native | `classNames` prop (v5.6.0+) for customizing wrapper classes of children |
| Child styles | ✅ | Native | `styles` prop (v5.6.0+) for customizing inline styles of children |

---

## Code Examples

### Basic Horizontal Spacing

```jsx
import { Space, Button } from 'antd';

function App() {
  return (
    <Space>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </Space>
  );
}
```

### Vertical Layout with Custom Size

```jsx
import { Space, Card } from 'antd';

function App() {
  return (
    <Space direction="vertical" size="large">
      <Card>Card 1</Card>
      <Card>Card 2</Card>
      <Card>Card 3</Card>
    </Space>
  );
}
```

### Custom Numeric Spacing

```jsx
import { Space, Button } from 'antd';

function App() {
  return (
    <Space size={16}>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Space>
  );
}
```

### Asymmetric Spacing (Different Horizontal/Vertical)

```jsx
import { Space, Button } from 'antd';

function App() {
  return (
    <Space size={[8, 16]} wrap>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
      <Button>Button 4</Button>
    </Space>
  );
}
```

### Alignment Options

```jsx
import { Space, Button } from 'antd';

function App() {
  return (
    <>
      <Space align="center">
        <Button type="primary">Primary Button</Button>
        <span>Centered Text</span>
      </Space>

      <Space align="baseline">
        <div style={{ fontSize: 24 }}>Large Text</div>
        <div style={{ fontSize: 14 }}>Small Text</div>
      </Space>
    </>
  );
}
```

### Wrap Behavior for Responsive Layouts

```jsx
import { Space, Button } from 'antd';

function App() {
  return (
    <Space wrap>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
      <Button>Button 4</Button>
      <Button>Button 5</Button>
      <Button>Button 6</Button>
    </Space>
  );
}
```

### Split/Divider Pattern

```jsx
import { Space, Button, Divider } from 'antd';

function App() {
  return (
    <Space split={<Divider type="vertical" />}>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Space>
  );
}
```

### Space.Compact for Form Elements

```jsx
import { Space, Input, Button, Select } from 'antd';

function App() {
  return (
    <Space.Compact>
      <Input style={{ width: '20%' }} defaultValue="0571" />
      <Input style={{ width: '30%' }} defaultValue="26888888" />
    </Space.Compact>
  );
}
```

### Space.Compact with Block Mode

```jsx
import { Space, Input, Button } from 'antd';

function App() {
  return (
    <Space.Compact block>
      <Input placeholder="Input content" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
  );
}
```

### Custom Styling with classNames and styles (v5.6.0+)

```jsx
import { Space, Button } from 'antd';

function App() {
  return (
    <Space
      classNames={{ item: 'custom-space-item' }}
      styles={{ item: { border: '1px solid #d9d9d9', padding: '8px' } }}
    >
      <Button>Button 1</Button>
      <Button>Button 2</Button>
    </Space>
  );
}
```

### Nested Space for Complex Layouts

```jsx
import { Space, Button, Card } from 'antd';

function App() {
  return (
    <Space direction="vertical" size="large">
      <Card>
        <Space>
          <Button>Action 1</Button>
          <Button>Action 2</Button>
        </Space>
      </Card>
      <Card>
        <Space>
          <Button>Action 3</Button>
          <Button>Action 4</Button>
        </Space>
      </Card>
    </Space>
  );
}
```

---

## API Reference

### Space Props

| Property | Type | Default | Description | Version |
|----------|------|---------|-------------|---------|
| align | `start` \| `end` \| `center` \| `baseline` | - | Align items on cross axis | - |
| className | string | - | Custom className for the wrapper element | - |
| direction | `vertical` \| `horizontal` | `horizontal` | The space direction | - |
| size | `small` \| `middle` \| `large` \| number \| [number, number] | `small` | The space size. Array format allows different horizontal and vertical spacing | - |
| split | ReactNode | - | Set split element between children | - |
| style | CSSProperties | - | Custom inline styles for the wrapper element | - |
| wrap | boolean | false | Auto wrap line, effective only when direction is horizontal | - |
| classNames | Record<'item', string> | - | Semantic className for child wrapper elements | 5.6.0 |
| styles | Record<'item', CSSProperties> | - | Semantic inline styles for child wrapper elements | 5.6.0 |

### Space.Compact Props

| Property | Type | Default | Description | Version |
|----------|------|---------|-------------|---------|
| block | boolean | false | Option to fit width to its parent's width | 4.24.0 |
| direction | `vertical` \| `horizontal` | `horizontal` | Set direction of compact elements | 4.24.0 |
| size | `small` \| `middle` \| `large` | `middle` | Set child component size | 4.24.0 |

---

## Styling Approaches

### Default Styling
- Space applies consistent gap spacing between children without adding visible backgrounds or borders
- The component is visually transparent, affecting only layout spacing
- Default spacing values align with Ant Design's design token system

### Size Tokens
The preset size values map to design tokens:
- **small**: 8px
- **middle**: 16px (default)
- **large**: 24px

### Custom Spacing
- Numeric values: Direct pixel values for precise control
- Array format: `[horizontal, vertical]` for asymmetric spacing
- Responsive sizing: Can integrate with Ant Design's responsive grid breakpoints

### Theme Integration
Space respects the global theme configuration set through ConfigProvider:

```jsx
import { ConfigProvider, Space } from 'antd';

<ConfigProvider
  theme={{
    components: {
      Space: {
        // Custom theme tokens can be defined here
      },
    },
  }}
>
  <Space>
    {/* Content */}
  </Space>
</ConfigProvider>
```

### CSS Customization
Direct styling through className and style props:

```jsx
<Space
  className="custom-space"
  style={{ background: '#f0f0f0', padding: 16 }}
>
  {/* Content */}
</Space>
```

### Child Element Styling (v5.6.0+)
The classNames and styles props provide fine-grained control over wrapped children:

```jsx
<Space
  classNames={{ item: 'space-item' }}
  styles={{ item: { padding: '4px' } }}
>
  {/* Each child is wrapped with these classes/styles */}
</Space>
```

---

## Accessibility Patterns

### Semantic HTML Structure
- Space renders as a standard `<div>` wrapper with child wrappers
- Maintains semantic structure of wrapped components
- Does not interfere with screen reader navigation of child elements

### Keyboard Navigation
- Space itself is not focusable (layout component)
- Preserves keyboard navigation of wrapped interactive elements
- Does not trap focus or alter tab order

### ARIA Considerations
- No specific ARIA attributes needed for Space itself
- Wrapped components maintain their own ARIA attributes
- The layout spacing does not affect assistive technology announcements

### Screen Reader Support
- Space is transparent to screen readers (pure layout)
- Child elements are announced naturally in document order
- No additional screen reader considerations needed

### Visual Accessibility
- Proper spacing improves visual clarity and scannability
- Helps distinguish between separate interactive elements
- Reduces cognitive load by organizing related items with consistent rhythm

### Best Practices for Accessibility
1. Ensure wrapped interactive elements have proper labels
2. Maintain logical document order (Space doesn't reorder children)
3. Use semantic HTML within Space children
4. Don't rely solely on spacing to convey relationships (use headings, landmarks, etc.)
5. Test keyboard navigation through spaced elements

---

## Notable Features

### 1. Automatic Child Wrapping
Space automatically wraps each child element in a wrapper div, enabling:
- Proper inline alignment regardless of child element type
- Consistent spacing application
- Individual child styling through classNames/styles props (v5.6.0+)

### 2. Flexible Size System
The component offers multiple sizing approaches:
- Preset tokens (small, middle, large) for consistency
- Custom pixel values for precise control
- Array format for asymmetric spacing `[horizontal, vertical]`
- Responsive size configurations

### 3. Space.Compact Sub-component
A specialized variant (v4.24.0+) for form element grouping:
- Collapses borders between adjacent form components
- Creates visually connected input groups
- Supports both horizontal and vertical layouts
- Optional block mode for full-width groups

### 4. Split/Divider Integration
The split prop enables visual separation:
- Accepts any ReactNode (commonly Divider component)
- Automatically positioned between each child
- Maintains consistent spacing around dividers
- Useful for creating action lists or navigation items

### 5. Wrap Support for Responsive Design
The wrap prop enables automatic line wrapping:
- Prevents horizontal overflow on small screens
- Maintains consistent spacing in wrapped layouts
- Only applies to horizontal direction
- Essential for responsive button groups and tag lists

### 6. Granular Styling Control (v5.6.0+)
The classNames and styles props provide fine-grained customization:
- Apply classes/styles to individual child wrappers
- Enables complex layout customizations
- Maintains component encapsulation
- Useful for creating custom spacing patterns

### 7. Design System Integration
Space seamlessly integrates with Ant Design's ecosystem:
- Respects global theme configuration
- Uses design tokens for spacing values
- Works with all Ant Design components
- Supports ConfigProvider theming

### 8. Zero Layout Shift
Space applies spacing without causing layout shifts:
- Uses flexbox with gap (modern browsers)
- Falls back to margin-based spacing (legacy support)
- Maintains stable layouts during interactions
- No cumulative layout shift (CLS) issues

---

## Research Notes

### Component Philosophy
The Space component embodies Ant Design's principle of "design as code" - it encapsulates the common layout pattern of "add consistent spacing between elements" into a reusable, configurable component. This approach:
- Reduces boilerplate CSS for spacing
- Ensures consistency across the application
- Makes spacing decisions explicit and discoverable in code
- Simplifies maintenance of spacing systems

### Relationship to Flex Component
Ant Design also provides a Flex component (newer addition) that offers more comprehensive flexbox control. The distinction:
- **Space**: Simplified, opinionated spacing utility for common cases
- **Flex**: Full flexbox API for complex layouts
- **When to use Space**: Simple, consistent spacing needs
- **When to use Flex**: Complex alignment, justification, or flex item control

### Version Evolution
- **v4.24.0**: Introduced Space.Compact for form element grouping
- **v5.6.0**: Added classNames and styles props for child customization
- **Current (5.x)**: Mature, stable API with comprehensive features

### Common Use Cases
Based on documentation and examples:
1. **Button groups**: Horizontal spacing between action buttons
2. **Form layouts**: Vertical spacing between form items
3. **Card lists**: Vertical spacing between cards
4. **Navigation items**: Horizontal spacing with dividers
5. **Tag clouds**: Wrapped tags with consistent spacing
6. **Toolbar actions**: Horizontal action lists
7. **Input groups**: Compact connected inputs (Space.Compact)

### Performance Considerations
- Lightweight wrapper component with minimal overhead
- Uses CSS flexbox gap when available (modern browsers)
- Falls back to margin-based spacing for legacy support
- No JavaScript-based spacing calculations
- Efficient re-rendering (only updates when props change)

### Browser Compatibility
- Modern browsers: Uses CSS gap property for optimal performance
- Legacy browsers: Falls back to margin-based spacing
- Consistent visual results across browsers
- No known compatibility issues with Ant Design's supported browser matrix

### Design Tokens Integration
Space integrates with Ant Design's token system:
- Size presets map to semantic tokens
- Respects theme customization
- Can be overridden at global or component level
- Maintains visual consistency with other components

### Limitations and Considerations
1. **Wrapping only works horizontally**: The wrap prop only applies when direction="horizontal"
2. **Child wrapper overhead**: Each child is wrapped in a div, which may affect specific CSS selectors
3. **No built-in grid**: For grid layouts, use Ant Design's Grid component instead
4. **Split limitation**: The split element appears between ALL children (no conditional splits)
5. **Alignment on main axis**: Space doesn't provide justification control (use Flex component for that)

### Future Considerations
Based on GitHub discussions and issues:
- Community interest in exposing the Item wrapper component for advanced customization
- Potential improvements to responsive sizing API
- Discussion around alignment on main axis (justify-content equivalent)
- Exploration of conditional spacing patterns

### Comparison with CSS Gap
The Space component is essentially a wrapper around CSS flexbox gap, but provides:
- Consistent API across legacy browsers
- Integration with design tokens
- Semantic size presets
- Additional features (split, compact mode, asymmetric spacing)

### Migration Notes
For teams migrating from manual margin-based spacing:
1. Space reduces CSS complexity by handling spacing in JSX
2. Makes spacing decisions visible in component tree
3. Simplifies responsive spacing patterns
4. Easier to maintain consistent spacing across the app
5. May require refactoring existing margin-based layouts

---

## Summary

The Ant Design Space component is a well-designed layout utility that solves the common problem of spacing between elements. Its strength lies in:

1. **Simplicity**: Easy to use with sensible defaults
2. **Flexibility**: Multiple sizing options and customization points
3. **Consistency**: Design token integration ensures visual harmony
4. **Accessibility**: Transparent to assistive technology
5. **Performance**: Lightweight with efficient rendering
6. **Extensibility**: Granular customization through classNames/styles props

The component represents a mature, production-ready solution for spacing management in React applications using Ant Design. Its API is well-balanced between simplicity for common cases and flexibility for advanced scenarios.

**Key Takeaway**: Space is not just a convenience wrapper - it's a design system primitive that encodes spacing decisions as first-class component props, making layout intentions explicit and maintainable.
