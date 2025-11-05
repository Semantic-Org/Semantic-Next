# Radix UI Themes - Badge Component Usage Patterns

## Research Metadata
- **Framework**: Radix UI Themes (React)
- **Component**: Badge
- **Documentation URL**: https://www.radix-ui.com/themes/docs/components/badge
- **Source Code**: https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/badge.tsx
- **Research Date**: 2025-11-04
- **URL Status**: Accessible (via web search data extraction)

---

## Component Definition

### Badge Component
**Purpose**: A stylized badge element for displaying status indicators, labels, or count notifications.

**Mental Model**: Badge is a **standalone label** component designed to:
- Display status information
- Show categorical labels
- Mark items with visual indicators
- Provide contextual information inline

**Key Characteristic**: Based on `<span>` element; compact, inline display component with rich theming support.

**Note on Radix Themes**: Radix UI Themes provides Badge but **not Tag**. The Badge component serves labeling and status indication purposes.

---

## Badge Component - Detailed Analysis

### Supported Variants & Types

#### 1. **Visual Variants** (Level 1 - Core)
**Support**: Full - 4 variant options
**Description**: Controls the visual style and background treatment

**Available Variants**:
- `solid` - Filled background with contrasting text
- `soft` - Subtle background with medium contrast (most common)
- `surface` - Elevated appearance with shadow/border
- `outline` - Bordered style with minimal fill

```jsx
<Badge variant="solid" color="indigo">New</Badge>
<Badge variant="soft" color="indigo">New</Badge>
<Badge variant="surface" color="indigo">New</Badge>
<Badge variant="outline" color="indigo">New</Badge>
```

**Default**: `soft` variant

#### 2. **Size Variants** (Level 1 - Core)
**Support**: Full - 3 size options
**Description**: Controls component dimensions using numeric scale

**Available Sizes**:
- `size="1"` - Compact/smallest size
- `size="2"` - Default/medium size
- `size="3"` - Large size

```jsx
<Badge size="1" color="indigo">New</Badge>
<Badge size="2" color="indigo">New</Badge>
<Badge size="3" color="indigo">New</Badge>
```

**Default**: `size="2"`

**Breaking Change Note**: In Radix Themes updates, `size="3"` was added, `size="2"` was made smaller, and `size="1"` dimensions were tweaked. Users migrating should replace old `size="2"` with `size="3"`.

#### 3. **Color System** (Level 1 - Core)
**Support**: Full - Complete theme color palette
**Description**: Semantic color assignment using theme accent colors

**Color Options Include**:
- Gray (neutral)
- Blue (information)
- Green/Jade (success)
- Amber/Yellow (warning)
- Red/Crimson (error)
- Indigo, Purple, Pink, Cyan, and more accent colors

```jsx
<Badge color="blue">Info</Badge>
<Badge color="green">Success</Badge>
<Badge color="amber">Warning</Badge>
<Badge color="red">Error</Badge>
<Badge color="gray">Neutral</Badge>
```

**Philosophy**: Not limited to predefined semantic types; full theme palette access enables flexible color semantics.

#### 4. **High Contrast Mode** (Level 1 - Accessibility)
**Support**: Full
**Description**: Enhances color contrast with background for improved accessibility

```jsx
<Badge color="gray" variant="solid" highContrast>New</Badge>
<Badge color="gray" variant="soft" highContrast>New</Badge>
<Badge color="gray" variant="surface" highContrast>New</Badge>
<Badge color="gray" variant="outline" highContrast>New</Badge>
```

**Use Case**: Improves visibility and meets accessibility standards; works with all variants and colors.

#### 5. **Radius Control** (Level 2 - Styling)
**Support**: Full
**Description**: Assigns specific border-radius value, overriding theme defaults

```jsx
<Badge radius="none">Sharp corners</Badge>
<Badge radius="small">Slightly rounded</Badge>
<Badge radius="medium">Moderately rounded</Badge>
<Badge radius="large">Highly rounded</Badge>
<Badge radius="full">Pill shape</Badge>
```

**Note**: Allows per-component radius customization independent of global theme radius setting.

### Badge API Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **variant** | `'solid' \| 'soft' \| 'surface' \| 'outline'` | `'soft'` | Visual style variant | Level 1 |
| **size** | `'1' \| '2' \| '3'` | `'2'` | Component size scale | Level 1 |
| **color** | `ThemeColor` | - | Theme accent color | Level 1 |
| **highContrast** | `boolean` | `false` | Enhanced contrast mode | Level 1 |
| **radius** | `'none' \| 'small' \| 'medium' \| 'large' \| 'full'` | - | Border radius override | Level 2 |
| **asChild** | `boolean` | `false` | Composition via Slot | Level 2 |
| **Margin props** | Various | - | Common margin spacing | Level 1 |

**Base Element**: `<span>`

**Additional Props**: Inherits all standard HTML span attributes.

### Variant Behavior Comparison

| Variant | Background | Border | Text | Use Case |
|---------|------------|--------|------|----------|
| **solid** | Fully filled | None | High contrast | Maximum visibility, call-to-action |
| **soft** | Subtle tint | None | Medium contrast | Default, gentle emphasis |
| **surface** | Elevated | Shadow/Border | Medium contrast | Card-like, separated context |
| **outline** | Minimal | Visible border | Color-matched | Lightweight, understated |

### Size Scale Dimensions

**Note**: Exact pixel/rem dimensions are not explicitly documented. Radix Themes uses a consistent scaling system across components.

- **Size 1**: Compact size for inline use or space-constrained contexts
- **Size 2**: Default balanced size for most use cases
- **Size 3**: Large size for prominent display or touch-friendly interfaces

### Color Palette Integration

**Theme Integration**: Badge deeply integrates with Radix Themes color system:
- 12-step color scale per color
- Automatic dark mode support
- Accent color pairing with complementary grays
- Consistent color application across variants

**Custom Palette**: Radix Themes provides a custom color palette tool for creating brand-specific color configurations.

**Gray Options**: 6 gray options available, including pure gray and tinted grays that auto-pair with accent colors.

**Color Accessibility**: Built on accessible color contrast ratios; high-contrast mode provides additional enhancement.

### Composition Patterns

#### AsChild Pattern (Level 2)
**Support**: Full
**Description**: Renders Badge behavior onto a child element instead of default span

```jsx
// Instead of rendering <span>, clones child and adds Badge props
<Badge asChild>
  <a href="/new">New Feature</a>
</Badge>
```

**Philosophy**: Follows Radix Primitives composition pattern; enables polymorphic component behavior.

#### Margin Props Pattern (Level 1)
**Support**: Full
**Description**: Common margin properties for layout control

```jsx
<Badge m="2">Margin all sides</Badge>
<Badge mx="4">Margin horizontal</Badge>
<Badge my="2">Margin vertical</Badge>
<Badge mt="1" mb="3">Individual margins</Badge>
```

**Integration**: Part of Radix Themes layout prop system.

---

## Code Examples

### Basic Badge Usage
```jsx
import { Badge } from '@radix-ui/themes';

// Simple badge
<Badge>Default</Badge>

// With color
<Badge color="blue">Information</Badge>

// With variant
<Badge variant="solid" color="green">Success</Badge>
```

### Size Variants
```jsx
import { Flex, Badge } from '@radix-ui/themes';

<Flex align="center" gap="2">
  <Badge size="1" color="indigo">Small</Badge>
  <Badge size="2" color="indigo">Medium</Badge>
  <Badge size="3" color="indigo">Large</Badge>
</Flex>
```

### Visual Variants
```jsx
// All four visual styles
<Badge variant="solid" color="indigo">Solid</Badge>
<Badge variant="soft" color="indigo">Soft</Badge>
<Badge variant="surface" color="indigo">Surface</Badge>
<Badge variant="outline" color="indigo">Outline</Badge>
```

### Semantic Color Usage
```jsx
// Status indicators
<Badge color="blue">Info</Badge>
<Badge color="green">Success</Badge>
<Badge color="amber">Warning</Badge>
<Badge color="red">Error</Badge>
<Badge color="gray">Neutral</Badge>
```

### High Contrast Mode
```jsx
// Standard contrast
<Badge color="gray" variant="soft">Standard</Badge>

// Enhanced contrast
<Badge color="gray" variant="soft" highContrast>High Contrast</Badge>

// Works with all variants
<Badge color="blue" variant="solid" highContrast>Solid</Badge>
<Badge color="blue" variant="outline" highContrast>Outline</Badge>
```

### Radius Customization
```jsx
// Override theme radius
<Badge radius="none">Sharp</Badge>
<Badge radius="small">Subtle</Badge>
<Badge radius="medium">Moderate</Badge>
<Badge radius="large">Rounded</Badge>
<Badge radius="full">Pill</Badge>
```

### Composition with AsChild
```jsx
// Badge behavior on custom element
<Badge color="red" asChild>
  <a href="/urgent">Urgent Update</a>
</Badge>

// Preserves accessibility and semantics
<Badge color="green" variant="outline" asChild>
  <button>Active</button>
</Badge>
```

### Combined Patterns
```jsx
// Multiple props combined
<Badge
  variant="solid"
  color="crimson"
  size="3"
  highContrast
  radius="full"
>
  Important
</Badge>

// With spacing
<Badge
  color="indigo"
  variant="soft"
  m="2"
>
  Spaced Badge
</Badge>
```

### Practical Use Cases
```jsx
import { Flex, Card, Heading, Text, Badge } from '@radix-ui/themes';

// Status indicator in list
<Card>
  <Flex justify="between" align="center">
    <Text>User Account</Text>
    <Badge color="green" variant="soft">Active</Badge>
  </Flex>
</Card>

// Multiple status badges
<Flex gap="2">
  <Badge color="blue">Draft</Badge>
  <Badge color="amber">Pending</Badge>
  <Badge color="green">Published</Badge>
  <Badge color="red">Archived</Badge>
</Flex>

// Category labels
<Flex gap="2" wrap="wrap">
  <Badge variant="surface" color="indigo">React</Badge>
  <Badge variant="surface" color="purple">TypeScript</Badge>
  <Badge variant="surface" color="cyan">CSS</Badge>
</Flex>
```

---

## Pattern Support Levels Summary

| Pattern | Support Level | Adoption |
|---------|---------------|----------|
| Visual variants (4 types) | Level 1 | Core feature |
| Size scale (1-3) | Level 1 | Core feature |
| Color palette integration | Level 1 | Core feature |
| High contrast mode | Level 1 | Core accessibility |
| Radius control | Level 2 | Styling customization |
| AsChild composition | Level 2 | Advanced composition |
| Margin props | Level 1 | Core layout |
| Base span element | Level 1 | Web standards |

---

## Implementation Philosophy

### Badge Design Philosophy
Radix UI Themes Badge embodies a **theming-first** approach:
- Deep integration with theme color system (not hardcoded colors)
- Variant system separates visual style from semantic meaning
- Size scale provides consistent sizing across components
- High-contrast mode as first-class accessibility feature
- Composition patterns (asChild) enable flexible usage
- Standalone component (no overlay/wrapper patterns like Ant Design)

### Radix Themes Patterns
**Key Characteristics**:
- CSS custom properties for runtime theming
- 12-step color scales for nuanced color usage
- Automatic dark mode through color system
- Consistent prop naming across components (size, variant, color)
- Polymorphic composition via asChild
- Layout props (margin) built into components

### No Tag Component
**Important Note**: Radix UI Themes does **not** include a separate Tag component. Badge serves the labeling, categorization, and status indication use cases that other frameworks split between Badge and Tag.

---

## Accessibility Considerations

### High Contrast Support
- `highContrast` prop enhances visibility
- Works with all variant and color combinations
- Meets WCAG contrast requirements
- Essential for users with vision impairments

### Color Semantics
- Color should not be sole indicator
- Combine with text labels for clarity
- Theme ensures accessible contrast ratios
- High-contrast mode provides additional safety

### Keyboard & Screen Readers
- Badge is presentational (non-interactive)
- When used with asChild on interactive elements, inherits that element's accessibility
- Text content read by screen readers
- No keyboard interaction (not focusable)

---

## Research Notes

### Data Collection Method
- Web search extraction from official Radix UI documentation
- GitHub source code inspection for TypeScript interfaces
- Cross-referenced multiple documentation pages
- Research date: 2025-11-04

### Documentation Quality
- Official documentation is clear and comprehensive
- Interactive examples provided
- TypeScript definitions publicly available
- Strong theme integration documentation
- Color system well-documented separately

### Limitations
- Direct URL fetching blocked; relied on web search
- Exact size dimensions (px/rem) not explicitly documented
- Some advanced theme customization details require source inspection
- Full color palette list requires separate color documentation

### Notable Observations

**Radix Themes vs Radix Primitives**:
- This research covers Radix **Themes** (opinionated design system)
- Radix **Primitives** are unstyled, accessible components
- Badge is a Themes component, not a Primitive
- Requires Radix Themes provider context

**Framework Integration**:
- React-specific component library
- Requires React 16.8+ (hooks)
- Not framework-agnostic or portable
- CSS-in-JS approach via design tokens

**Breaking Changes**:
- Size scale was revised in recent versions
- Size 2 became smaller; size 3 was added
- Users migrating must update size props

---

## Recommendations for Semantic UI

### Badge Implementation Priority

**Must-Have (Level 1)**:
1. Visual variants (solid, soft, surface, outline)
2. Size scale with clear numeric progression (1-3)
3. Full theme color palette integration
4. High-contrast mode for accessibility
5. Margin/spacing controls
6. Text content support

**Should-Have (Level 2)**:
1. Radius customization
2. Composition patterns (slot-based equivalent to asChild)
3. Responsive sizing
4. Dark mode support

**Consider**:
- Custom color palette configuration
- Automatic gray pairing with accent colors
- 12-step color scale system
- CSS custom property architecture

### Semantic UI Differentiators

**Natural Language Patterns**:
- Radix uses numeric size scale (`1`, `2`, `3`)
- Consider: `small`, `medium`, `large` for more semantic naming
- Radix uses `color` prop; consider `accent` or `tone` for clarity

**Settings Architecture**:
- Leverage reactive settings for color, variant, size
- Support runtime theme changes via settings
- Use settings for radius, contrast overrides

**Component Composition**:
- Badge content via default slot
- No wrapper/overlay mode (unlike Ant Design Badge)
- AsChild pattern could translate to slot-based polymorphism

**Web Component Advantages**:
- Shadow DOM for true style encapsulation
- Standard HTML attributes instead of React props
- Framework-agnostic usage
- Progressive enhancement support

### Radix Themes Insights

**Strengths**:
- Excellent variant system (separates style from semantics)
- Strong accessibility with high-contrast mode
- Deep theme integration
- Clear prop naming conventions
- Composition flexibility via asChild

**Potential Adaptations for Semantic UI**:
- Variant pattern maps well to Semantic UI philosophy
- Size numeric scale is simple and clear
- High-contrast mode addresses real accessibility needs
- Radius control enables design system flexibility
- Margin props pattern useful for layout

**Considerations**:
- Radix approach is React-specific; requires adaptation
- CSS-in-JS vs Shadow DOM CSS approach
- Theme provider context vs web standards theming
- Component vs primitive distinction

### Key Insight
Radix UI Themes takes a **design system** approach where Badge is deeply integrated with theming. The variant system cleanly separates visual style from semantic meaning, enabling flexible color usage beyond predefined types. This contrasts with frameworks that hardcode semantic types (info/success/warning/error). Semantic UI should consider whether to follow Radix's flexible color approach or provide predefined semantic variants for natural language clarity.

---

## Comparison: Badge vs Tag in Other Frameworks

**Note**: Radix UI Themes provides **Badge only** (no Tag component).

Radix's Badge serves purposes that other frameworks (like Ant Design) split between:
- **Badge**: Count indicators, overlays, status dots
- **Tag**: Labels, categories, removable chips

Radix Themes Badge is **standalone only** (not an overlay/wrapper) and focuses on:
- Status indication
- Categorical labeling
- Visual markers
- Inline information display

This suggests Radix considers "Badge" to encompass all compact labeling use cases, without distinguishing overlay notification badges from standalone category tags.

### Implications for Semantic UI
When designing label/badge/tag primitives, consider:
1. **Single unified component** (like Radix) vs **separate Badge/Tag** (like Ant Design)
2. Radix's approach is simpler but less semantically specific
3. Separate components provide clearer use case separation
4. Natural language naming (`ui-label`, `ui-badge`, `ui-tag`) could clarify purposes

---

## URL Verification Status

- **Documentation URL**: https://www.radix-ui.com/themes/docs/components/badge
  - Status: ✅ Accessible via web search
  - Content: Comprehensive API documentation with examples

- **Source Code URL**: https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/badge.tsx
  - Status: ✅ Accessible
  - Content: TypeScript implementation with prop definitions

- **Research Method**: Web search data extraction (direct fetch blocked)
- **Research Date**: 2025-11-04
- **Framework Version**: Radix Themes (current/latest)
