# Radix UI - Callout Usage Patterns

## Component URL
https://www.radix-ui.com/themes/docs/components/callout
Status: ✅ Working
Version: Radix Themes (current)
Last Verified: 2025-11-04

## Documentation Quality
Good - Clear API documentation with interactive examples, comprehensive prop reference, and accessibility guidance.

## Component Definition
- **Core purpose**: Displays a short message to attract user's attention. Functions as an embedded alert or notification element within page content.
- **Mental model**: A visually distinct message container with optional icon and semantic color coding. Unlike toast notifications, it's static and embedded in the page layout.
- **Semantic meaning**: Communicates information, warnings, errors, or success states through color-coded visual treatment. When using `role="alert"`, announces critical messages to screen readers.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `color="red"`, `variant="soft"`)
- **Composed**: Via composition/children (e.g., `<Callout.Icon>`, `<Callout.Text>`)
- **CSS-only**: Requires custom styling

## Display Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Icon + Text layout | ✅ | Composed | Icon and text positioned via Callout.Icon and Callout.Text composition |
| Text-only | ✅ | Composed | Can omit Callout.Icon component |
| Icon-only | ✅ | Composed | Can omit Callout.Text component |
| Multi-paragraph | ✅ | Composed | Callout.Text based on `p` element, supports multiple instances |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Via Callout.Text component (based on `p` element) |
| Icon support | ✅ | Composed | Via Callout.Icon component with consistent sizing |
| Rich content | ✅ | Composed | Can include links, formatting within Callout.Text |
| Custom content | ✅ | Composed | Callout.Root accepts any children via composition |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Info | ✅ | Native | Via color prop (e.g., `color="blue"`) |
| Success | ✅ | Native | Via color prop (e.g., `color="green"`) |
| Warning | ✅ | Native | Via color prop (e.g., `color="amber"` or `color="yellow"`) |
| Error | ✅ | Native | Via color prop (e.g., `color="red"`) |
| Neutral | ✅ | Native | Via color prop (e.g., `color="gray"`) |
| Custom semantic | ✅ | Native | Full theme color palette available |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | - | No built-in loading state |
| Disabled | ❌ | - | No disabled state (callout is presentational) |
| Dismissible | ❌ | - | No built-in close/dismiss functionality |
| Expanded/Collapsed | ❌ | - | No built-in expand/collapse state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="1" \| "2" \| "3"` (default: "2") |
| Visual variants | ✅ | Native | `variant="soft" \| "surface" \| "outline"` (default: "soft") |
| Color options | ✅ | Native | Full theme color palette (blue, green, red, amber, gray, etc.) |
| High-contrast mode | ✅ | Native | `highContrast` boolean prop for enhanced accessibility |
| Spacing control | ✅ | Native | Common margin props supported on Callout.Root |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Accessibility roles | ✅ | Native | Supports `role="alert"` for critical announcements |
| Screen reader support | ✅ | Native | WAI-ARIA alert role interrupts and announces to screen readers |
| Keyboard navigation | ❌ | - | No interactive elements by default |
| Focus management | ❌ | - | Not applicable (non-interactive component) |

## Code Examples

### Basic Usage
```jsx
import { Callout } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';

<Callout.Root>
  <Callout.Icon>
    <InfoCircledIcon />
  </Callout.Icon>
  <Callout.Text>
    You will need admin privileges to install and access this application.
  </Callout.Text>
</Callout.Root>
```

### Size Variants
```jsx
// Small
<Callout.Root size="1">
  <Callout.Icon><InfoCircledIcon /></Callout.Icon>
  <Callout.Text>Small callout message</Callout.Text>
</Callout.Root>

// Medium (default)
<Callout.Root size="2">
  <Callout.Icon><InfoCircledIcon /></Callout.Icon>
  <Callout.Text>Medium callout message</Callout.Text>
</Callout.Root>

// Large
<Callout.Root size="3">
  <Callout.Icon><InfoCircledIcon /></Callout.Icon>
  <Callout.Text>Large callout message</Callout.Text>
</Callout.Root>
```

### Visual Variants
```jsx
// Soft (default) - subtle background with colored text
<Callout.Root variant="soft" color="blue">
  <Callout.Icon><InfoCircledIcon /></Callout.Icon>
  <Callout.Text>Soft variant with colored background</Callout.Text>
</Callout.Root>

// Surface - elevated appearance
<Callout.Root variant="surface" color="blue">
  <Callout.Icon><InfoCircledIcon /></Callout.Icon>
  <Callout.Text>Surface variant with elevation</Callout.Text>
</Callout.Root>

// Outline - bordered appearance
<Callout.Root variant="outline" color="blue">
  <Callout.Icon><InfoCircledIcon /></Callout.Icon>
  <Callout.Text>Outline variant with border</Callout.Text>
</Callout.Root>
```

### Semantic Color Usage
```jsx
import { InfoCircledIcon, CheckCircledIcon, ExclamationTriangleIcon, CrossCircledIcon } from '@radix-ui/react-icons';

// Info
<Callout.Root color="blue">
  <Callout.Icon><InfoCircledIcon /></Callout.Icon>
  <Callout.Text>Informational message</Callout.Text>
</Callout.Root>

// Success
<Callout.Root color="green">
  <Callout.Icon><CheckCircledIcon /></Callout.Icon>
  <Callout.Text>Operation completed successfully</Callout.Text>
</Callout.Root>

// Warning
<Callout.Root color="amber">
  <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
  <Callout.Text>Please review before proceeding</Callout.Text>
</Callout.Root>

// Error
<Callout.Root color="red">
  <Callout.Icon><CrossCircledIcon /></Callout.Icon>
  <Callout.Text>An error occurred</Callout.Text>
</Callout.Root>
```

### High-Contrast Mode
```jsx
<Callout.Root color="gray" variant="soft" highContrast>
  <Callout.Icon><InfoCircledIcon /></Callout.Icon>
  <Callout.Text>
    Enhanced contrast for improved visibility and accessibility
  </Callout.Text>
</Callout.Root>
```

### Accessibility Alert Pattern
```jsx
<Callout.Root color="red" role="alert">
  <Callout.Icon>
    <ExclamationTriangleIcon />
  </Callout.Icon>
  <Callout.Text>
    Access denied. Please contact the administrator.
  </Callout.Text>
</Callout.Root>
```

### Text-Only Callout
```jsx
<Callout.Root color="blue">
  <Callout.Text>
    Simple message without an icon
  </Callout.Text>
</Callout.Root>
```

### Complex Content
```jsx
<Callout.Root color="blue">
  <Callout.Icon><InfoCircledIcon /></Callout.Icon>
  <Callout.Text>
    Your trial expires in 3 days. <a href="/upgrade">Upgrade now</a> to continue using premium features.
  </Callout.Text>
</Callout.Root>
```

## API Reference

### Callout.Root
Based on: `div`

Props:
- `size?: "1" | "2" | "3"` - Controls component dimensions (default: "2")
- `variant?: "soft" | "surface" | "outline"` - Visual styling approach (default: "soft")
- `color?: ThemeColor` - Semantic color from theme palette (blue, green, red, amber, gray, etc.)
- `highContrast?: boolean` - Enhances contrast for accessibility
- `asChild?: boolean` - Enables polymorphic composition
- Plus common margin props from Radix Themes

### Callout.Icon
Wrapper component providing consistent icon sizing and positioning.

Props:
- Standard HTML attributes
- Accepts icon components as children

### Callout.Text
Based on: `p`

Props:
- Standard HTML paragraph attributes
- Accepts text content and inline formatting

## Notable Features

### Composition-Based Architecture
- Clean separation between container (Root), icon (Icon), and content (Text)
- Flexible composition allows icon-only, text-only, or combined layouts
- No rigid slot-based structure - components can be arranged freely

### Theme Integration
- Deep integration with Radix Themes design system
- Automatic dark mode support through CSS custom properties
- Consistent sizing with theme's typographic scale
- Full access to theme color palette

### Accessibility First
- Built-in support for WAI-ARIA `alert` role
- High-contrast mode for enhanced visibility
- Semantic color coding with accessible contrast ratios
- Screen reader friendly structure

### Variant System
- **Soft**: Subtle background with medium contrast (default)
- **Surface**: Elevated appearance with shadow/border
- **Outline**: Bordered style with minimal fill

### Size Scale
- Size 1: Compact for inline or space-constrained contexts
- Size 2: Default balanced size for most use cases
- Size 3: Large for prominent messages or touch-friendly interfaces

### Color Semantics
- Not limited to predefined types (info/success/warning/error)
- Full theme palette access enables custom semantic meanings
- Consistent color application across variant styles

### No Built-in Interactivity
- Intentionally non-interactive component
- No dismiss/close functionality by default
- Focused purely on message display
- Interactivity can be added through composition if needed

## Research Notes

### Framework Approach Observations

**Composition Philosophy:**
- Strong preference for composition over configuration
- Three distinct components (Root/Icon/Text) provide clear separation of concerns
- Flexibility to omit any component based on use case
- Aligns with React patterns but could translate to web components via slots

**Design System Integration:**
- Deeply embedded in Radix Themes ecosystem
- Relies on theme tokens for colors, spacing, typography
- Not standalone - requires Radix Themes context
- CSS custom properties enable runtime theming

**Accessibility Emphasis:**
- WAI-ARIA roles explicitly documented
- High-contrast mode as first-class feature
- Semantic color usage encouraged
- Screen reader considerations built into examples

**Minimalist API:**
- Small, focused prop surface
- No built-in dismiss/close functionality
- No loading or disabled states
- Composition handles edge cases rather than props

**Variant Strategy:**
- Limited to three core variants (soft/surface/outline)
- Variants affect visual treatment consistently across colors
- High-contrast as modifier, not separate variant
- Size separate from visual style

### Comparison Points for Semantic UI

**Strengths to Consider:**
- Excellent composition model translates well to web components with slots
- High-contrast mode addresses real accessibility needs
- Clean separation of icon and text areas
- Size scale (1-3) is simple and intuitive
- Full theme color palette access vs predefined types

**Potential Adaptations:**
- Slot-based architecture for `<slot name="icon">` and `<slot name="text">`
- Design token integration for theming
- Consider dismiss functionality as optional enhancement
- High-contrast mode via CSS custom property or attribute

**Differences from Web Standards:**
- React-specific composition pattern
- Requires Radix Themes provider context
- Not framework-agnostic or portable
- CSS custom properties used but not exposed as public API

**Pattern Insights:**
- Icon + text is primary pattern, but both optional
- Color prop is semantic driver (not separate "type" prop)
- Variants control visual style independently from semantics
- No interactive states suggests purely informational role
- Missing dismiss suggests different use case from transient notifications

### Implementation Considerations for Semantic UI

**Web Component Translation:**
```html
<!-- Potential Semantic UI equivalent -->
<ui-message color="blue" variant="soft" size="2">
  <ui-icon slot="icon">info-circle</ui-icon>
  <p slot="text">Message content</p>
</ui-message>
```

**Design Token Mapping:**
- Size scale could map to --message-size-1/2/3 tokens
- Variant styles to --message-variant-* custom properties
- Color palette to semantic color tokens
- High-contrast to --message-high-contrast modifier

**Accessibility Adaptation:**
- Support `role="alert"` attribute
- High-contrast via attribute or CSS class
- Ensure proper ARIA announcements
- Maintain semantic color associations

**Composition Pattern:**
- Icon slot for flexible icon content
- Default text slot for message content
- Support text-only and icon-only configurations
- Allow rich content within text slot

**Notable Omissions to Consider:**
- Dismiss/close functionality (common in message components)
- Loading states (less common but useful)
- Multi-line/expandable content (handled via composition)
- Animation/transitions (not documented)
