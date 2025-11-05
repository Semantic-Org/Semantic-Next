# Component Pattern Research: Space (Layout)

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 2
- Date: 2025-11-05
- Unique patterns identified: 20+

## Component Definition Consensus

Space components provide consistent spacing between inline or stacked elements using theme-defined values. Universal mental model: "Automatic spacing distributor."

**Primary Purpose:** Solve the "components clinging together" problem by automatically applying uniform spacing between child elements without requiring manual margin/padding management.

**Mental Model:** An intelligent wrapper that automatically distributes consistent spacing between its children - a layout utility that handles the common pattern of "put some space between these elements" without custom CSS.

**Semantic meaning:** Communicates visual rhythm and grouping through consistent spacing, indicating that child elements are related but distinct, with spacing amount communicating the degree of relationship or visual hierarchy.

## Terminology Variations

- **Space** (2 frameworks) = Ant Design, Mantine

Both frameworks use identical naming, reflecting the component's universal purpose as a spacing utility.

## Pattern Inventory

### Layout Direction Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Horizontal layout | Row arrangement with horizontal spacing | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Vertical layout | Column arrangement with vertical spacing | 2/2 (100%) | **Level 1: Universal** | All | Native |

### Spacing Size Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Preset size tokens | Theme-defined size presets | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Small size | Compact spacing | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |
| Medium/middle size | Default spacing | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |
| Large size | Generous spacing | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |
| Theme scale (xs-xl) | Design system scale | 1/2 (50%) | **Level 3: Frequent** | Mantine | Native |
| Custom numeric spacing | Pixel or rem values | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Asymmetric spacing | Different H/V spacing | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |
| Responsive spacing | Breakpoint-based sizing | 2/2 (100%) | **Level 1: Universal** | All | Native |

### Alignment Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Start alignment | Align to start of cross axis | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |
| Center alignment | Center on cross axis | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |
| End alignment | Align to end of cross axis | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |
| Baseline alignment | Text baseline alignment | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |

### Wrapping Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Auto wrap | Enable line wrapping | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |
| No wrap | Single line/column only | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |

### Visual Separator Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Split/divider | Render element between children | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |

### Compact Mode Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Compact sub-component | Collapsed borders for forms | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |
| Block mode | Full-width compact groups | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |
| Direction control | Horizontal/vertical compact | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Native |

### Customization Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| className prop | Custom CSS classes | 2/2 (100%) | **Level 1: Universal** | All | CSS-only |
| style prop | Inline styles | 2/2 (100%) | **Level 1: Universal** | All | CSS-only |
| classNames object | Granular class control | 1/2 (50%) | **Level 3: Frequent** | Ant Design | CSS-only |
| styles object | Granular style control | 1/2 (50%) | **Level 3: Frequent** | Ant Design | CSS-only |
| Theme integration | Design system values | 2/2 (100%) | **Level 1: Universal** | All | Native |

### Integration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Flex/Grid integration | Works with layout components | 2/2 (100%) | **Level 1: Universal** | All | Composed |
| Form element spacing | Button groups, inputs | 2/2 (100%) | **Level 1: Universal** | All | Composed |
| Nested spacing | Space within Space | 1/2 (50%) | **Level 3: Frequent** | Ant Design | Composed |

## Notable Patterns

### Universal (100%)
- Horizontal layout direction
- Vertical layout direction
- Preset size tokens from theme
- Custom numeric spacing values
- Responsive spacing support
- className customization
- style prop support
- Theme integration
- Flex/Grid composition
- Form element spacing use cases

### Ant Design Specializations
- Four alignment options (start, center, end, baseline)
- Three preset sizes (small, middle, large)
- Asymmetric H/V spacing via array
- Wrap behavior control
- Split/divider prop for visual separators
- Space.Compact sub-component (v4.24.0+)
  - Block mode for full-width groups
  - Direction control (horizontal/vertical)
  - Collapsed border styling
- classNames/styles objects for granular control (v5.6.0+)
- Automatic child element wrapping
- Design token integration (v5.x)
- Zero layout shift guarantee
- ConfigProvider theme customization

### Mantine Specializations
- Five-point theme scale (xs, sm, md, lg, xl)
- Horizontal (h) and vertical (w) prop naming
- Theme spacing scale integration
- Responsive prop system
- Mantine design system integration
- Layout primitive positioning
- v8.3.6 implementation
- Client-side rendering documentation
- Consistent spacing utility approach

## Implementation Notes

### Installation

**Ant Design:**
```bash
npm install antd
```

**Mantine:**
```bash
npm install @mantine/core
```

### Basic Usage Comparison

**Ant Design:**
```jsx
import { Space, Button } from 'antd'

<Space>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Space>
```

**Mantine:**
```tsx
import { Space } from '@mantine/core'

<div>
  <p>First paragraph</p>
  <Space h="md" />
  <p>Second paragraph</p>
</div>
```

### Vertical Layout Pattern

**Ant Design:**
```jsx
<Space direction="vertical">
  <Card title="Card 1" />
  <Card title="Card 2" />
  <Card title="Card 3" />
</Space>
```

**Mantine:**
```tsx
<div>
  <div>First element</div>
  <Space h="xl" />
  <div>Second element</div>
</div>
```

### Custom Spacing Pattern

**Ant Design:**
```jsx
// Numeric value
<Space size={16}>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Space>

// Asymmetric spacing
<Space size={[8, 16]}>
  {/* 8px horizontal, 16px vertical */}
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Space>
```

**Mantine:**
```tsx
// Theme token
<Space h="xs" />

// Custom value
<Space h={20} />
<Space h="2rem" />
```

### Alignment Pattern (Ant Design Only)

```jsx
<Space align="center">
  <Button size="large">Large</Button>
  <Button>Normal</Button>
  <Button size="small">Small</Button>
</Space>
```

### Wrap Pattern (Ant Design Only)

```jsx
<Space wrap>
  {items.map(item => (
    <Tag key={item}>{item}</Tag>
  ))}
</Space>
```

### Split/Divider Pattern (Ant Design Only)

```jsx
<Space split={<Divider type="vertical" />}>
  <Link>Home</Link>
  <Link>About</Link>
  <Link>Contact</Link>
</Space>
```

### Compact Mode Pattern (Ant Design Only)

```jsx
import { Space, Button, Input, Select } from 'antd'

// Horizontal compact group
<Space.Compact>
  <Input placeholder="Name" />
  <Button>Submit</Button>
</Space.Compact>

// Vertical compact group
<Space.Compact direction="vertical">
  <Input placeholder="First" />
  <Input placeholder="Second" />
  <Input placeholder="Third" />
</Space.Compact>

// Block mode (full width)
<Space.Compact block>
  <Input placeholder="Username" />
  <Button type="primary">Submit</Button>
</Space.Compact>
```

### Responsive Spacing Pattern

**Ant Design:**
```jsx
<Space
  size={{
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32
  }}
>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Space>
```

**Mantine:**
```tsx
<Space
  h={{ base: 'sm', sm: 'md', md: 'lg' }}
/>
```

## Design Philosophy Differences

### Container-Based (Ant Design)
- **Philosophy**: Space as a wrapper/container component
- **Approach**: Wraps multiple children to distribute spacing
- **Use case**: Grouping related elements with consistent spacing
- **API style**: Rich prop API with alignment, wrap, split features
- **Audience**: Form layouts, button groups, inline element spacing
- **Special features**: Compact mode for form element groups

### Separator-Based (Mantine)
- **Philosophy**: Space as an invisible separator element
- **Approach**: Renders as standalone spacing element between content
- **Use case**: Adding vertical/horizontal space between sections
- **API style**: Minimal prop API focused on size and direction
- **Audience**: Layout spacing, section separation
- **Special features**: Theme-integrated spacing scale

## Use Case Consensus

Both frameworks emphasize spacing utility patterns:
1. **Button groups** - Spacing between action buttons
2. **Form layouts** - Spacing between form elements
3. **Inline elements** - Tags, badges, links with consistent spacing
4. **Card layouts** - Spacing between cards in lists
5. **Navigation items** - Spacing in horizontal menus
6. **Vertical stacks** - Spacing between stacked content sections
7. **Toolbar elements** - Icon buttons, dropdowns with spacing

## Key Differences

### Component Model
- **Ant Design**: Container/wrapper that manages children spacing
- **Mantine**: Standalone separator element inserted between content

### Feature Richness
- **Ant Design**: Rich feature set (alignment, wrap, split, compact mode)
- **Mantine**: Minimal focused utility (spacing only)

### API Complexity
- **Ant Design**: 10+ props for comprehensive control
- **Mantine**: 2-3 props (h/w for size, direction implicit)

### Spacing Configuration
- **Ant Design**: 3 presets + custom numbers + arrays
- **Mantine**: 5-point scale + custom values

### Alignment Control
- **Ant Design**: 4 alignment options (start, center, end, baseline)
- **Mantine**: No alignment control (not a container)

### Special Features
- **Ant Design**: Space.Compact for collapsed form element borders
- **Mantine**: Pure spacing separator utility

### Usage Pattern
- **Ant Design**: `<Space>{children}</Space>` - wraps children
- **Mantine**: `<Space h="md" />` - standalone element

### Version Maturity
- **Ant Design**: v5.x with extensive evolution (classNames/styles in v5.6.0+, Compact in v4.24.0+)
- **Mantine**: v8.3.6 with consistent API

## Raw Data

- [Ant Design](./ant-design/usage-patterns.md)
- [Mantine](./mantine/usage-patterns.md)
