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

## Sophisticated Design Patterns

### Ant Design - Asymmetric Spacing via Array Notation

**What it does**: Space accepts `size={[horizontal, vertical]}` array format to apply different spacing values on the main and cross axes simultaneously. For example, `size={[8, 16]}` creates 8px horizontal spacing and 16px vertical spacing in the same component instance.

**Why it's sophisticated**: This solves a real layout problem that appears simple but is difficult to handle otherwise. Most spacing solutions force you to choose: either consistent spacing in one direction, or nest multiple components. The array approach allows fine-grained control over both axes simultaneously without additional wrapping, making it essential for designs where horizontal and vertical rhythm differ.

**Evidence of design maturity**:
- **Edge case handling**: Works correctly with `wrap={true}`, maintaining proper spacing on both wrapped lines and within lines
- **Real-world usage**: Essential for responsive button groups and tag layouts where compact horizontal spacing is needed but generous vertical spacing prevents visual crowding
- **Design restraint**: Doesn't expose every flexbox property; instead intentionally limits to exactly two dimensions (horizontal/vertical), preventing misuse

---

### Ant Design - Space.Compact with Collapsed Borders

**What it does**: Space.Compact is a sub-component that renders form elements (Input, Select, Button) with visually collapsed borders so they appear as a single connected unit. For example:
```jsx
<Space.Compact>
  <Input style={{ width: '20%' }} defaultValue="0571" />
  <Input style={{ width: '30%' }} defaultValue="26888888" />
</Space.Compact>
```
Results in inputs that appear as a single component with no border separation.

**Why it's sophisticated**: This pattern requires understanding how form components render borders and managing the interaction between spacing layout and visual border collapse. It's not a simple spacing utility—it's a specialized layout pattern that solves the "connected input groups" problem by combining spacing control with CSS border suppression on adjacent elements.

**Evidence of design maturity**:
- **Edge case handling**: Includes `direction` prop (horizontal/vertical) to handle both linear input groups and vertical form stacks; `block` mode ensures full-width behavior without layout shift
- **Real-world usage**: Ubiquitous in real applications for date pickers (country code + phone number), search with filter, and other compound input patterns
- **Design restraint**: Deliberately scoped to form elements only; doesn't attempt to collapse borders on arbitrary components, preventing misuse and unintended visual effects

---

### Ant Design - Split/Divider Injection Pattern

**What it does**: Space accepts a `split` prop that automatically renders a specified element (typically Divider) between each child without manually adding dividers to the children array. Example:
```jsx
<Space split={<Divider type="vertical" />}>
  <Link>Home</Link>
  <Link>About</Link>
  <Link>Contact</Link>
</Space>
```
Automatically renders dividers between items without cluttering the children array.

**Why it's sophisticated**: This pattern solves a meta-problem about component composition: how to add visual separators without either (1) requiring users to manually interleave elements, or (2) using CSS nth-child selectors that are fragile. By making the divider a prop, Space takes responsibility for placement logic, reducing boilerplate and making the intent explicit in the JSX.

**Evidence of design maturity**:
- **Edge case handling**: Correctly handles edge cases like not rendering a divider after the last child or before the first child; works with both horizontal and vertical layouts by automatically selecting the correct divider orientation
- **Real-world usage**: Standard pattern for navigation links, breadcrumb separators, and action button lists where visual separation improves scannability
- **Design restraint**: Accepts any ReactNode (not just Divider), but the pattern implicitly assumes the split element is a visual separator, preventing confusion about when to use this vs. wrapping children

---

## Raw Data

- [Ant Design](./ant-design/usage-patterns.md)
- [Mantine](./mantine/usage-patterns.md)
