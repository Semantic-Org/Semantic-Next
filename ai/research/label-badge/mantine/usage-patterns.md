# Mantine Badge & Chip Components - Usage Patterns Research

**Components:** Badge & Chip
**Framework:** Mantine (React)
**Package:** @mantine/core
**Documentation URLs:**
- Badge: https://mantine.dev/core/badge/
- Chip: https://mantine.dev/core/chip/
**Research Date:** 2025-11-04

---

## Component Definitions

### Badge Component
**Core purpose:** Display component for rendering badges, pills, or tags. A **non-interactive, presentational component** for displaying status indicators, labels, counts, or categorical information.

**Mental model:** Static visual label that attracts attention and provides context. Think of physical badges/labels that identify or categorize items.

**Semantic meaning:** Communicates status, category, count, or other metadata about associated content. Not actionable by itself.

### Chip Component
**Core purpose:** Interactive selection control that functions as a styled checkbox or radio input. Enables users to **select one or multiple values** through clickable, inline controls.

**Mental model:** Toggleable filter or selection tag. Like physical chips or tokens used for making choices in games or selection interfaces.

**Semantic meaning:** Represents a selectable option within a set of choices. Communicates both the option and its selection state.

**Key Distinction:** Badge is presentational; Chip is interactive. Badge shows information; Chip accepts input.

---

## Documentation Quality
**Badge:** Comprehensive - Clear examples, full API reference, polymorphic behavior documented
**Chip:** Comprehensive - Includes accessibility notes, group behavior, controlled/uncontrolled patterns

---

## Pattern Support Levels

### Badge Component

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Content Patterns** | | | |
| Text content | ✅ | Native | Via children prop |
| Icon support | ✅ | Native | `leftSection` and `rightSection` props |
| Custom content | ✅ | Composed | Accepts ReactNode as children |
| **Type Patterns** | | | |
| Variant styles | ✅ | Native | 7 variants: filled, light, outline, dot, gradient, transparent, white |
| Gradient support | ✅ | Native | `from`, `to`, `deg` props for gradient variant |
| **State Patterns** | | | |
| Color options | ✅ | Native | Theme-aware color prop |
| Auto contrast | ✅ | Native | `autoContrast` prop adjusts text color automatically |
| **Variation Patterns** | | | |
| Size options | ✅ | Native | xs, sm, md, lg, xl |
| Radius control | ✅ | Native | xs, sm, md, lg, xl |
| Circle mode | ✅ | Native | `circle` prop (equal width/height for counts) |
| Full width | ✅ | Native | `fullWidth` prop spans parent width |
| Polymorphic | ✅ | Native | Can render as different HTML elements/components |

### Chip Component

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Content Patterns** | | | |
| Text content | ✅ | Native | Via children prop |
| Custom icon | ✅ | Native | `icon` prop replaces default checkmark |
| **Type Patterns** | | | |
| Variant styles | ✅ | Native | 3 variants: filled, outline, light |
| Single selection | ✅ | Native | Via Chip.Group component |
| Multiple selection | ✅ | Native | Via Chip.Group with `multiple` prop |
| **State Patterns** | | | |
| Checked state | ✅ | Native | `checked`, `defaultChecked` props |
| Controlled mode | ✅ | Native | `checked` + `onChange` |
| Uncontrolled mode | ✅ | Native | `defaultChecked` |
| Color options | ✅ | Native | Theme-aware color prop |
| **Variation Patterns** | | | |
| Size options | ✅ | Native | xs, sm, md, lg, xl |
| Radius control | ✅ | Native | xs, sm, md, lg, xl |
| **Interaction Patterns** | | | |
| onChange callback | ✅ | Native | Called on state change |
| Keyboard accessible | ✅ | Native | Built on native inputs |
| Tooltip support | ✅ | Native | Works with `refProp="rootRef"` |
| Deselectable radio | ✅ | Composed | Via custom click handlers |

---

## Code Examples

### Badge - Basic Usage

```jsx
import { Badge } from '@mantine/core';

// Simple badge
<Badge>Default badge</Badge>

// With variant and color
<Badge variant="filled" color="blue">
  Filled badge
</Badge>

// Outline variant
<Badge variant="outline" color="red">
  Outline badge
</Badge>

// Light variant (subtle)
<Badge variant="light" color="green">
  Light badge
</Badge>

// Dot variant
<Badge variant="dot" color="orange">
  With dot indicator
</Badge>
```

### Badge - Gradient Variant

```jsx
<Badge variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
  Gradient badge
</Badge>
```

### Badge - With Icons/Sections

```jsx
import { IconStar } from '@tabler/icons-react';

<Badge
  leftSection={<IconStar size={14} />}
  variant="filled"
  color="yellow"
>
  Featured
</Badge>

<Badge
  rightSection={<IconX size={14} />}
  variant="light"
>
  Removable tag
</Badge>
```

### Badge - Circle Mode (Count)

```jsx
// For notification counts - equal width/height
<Badge circle size="lg">
  5
</Badge>

<Badge circle variant="filled" color="red">
  99+
</Badge>
```

### Badge - Sizing & Radius

```jsx
// Size variants
<Badge size="xs">Extra Small</Badge>
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
<Badge size="xl">Extra Large</Badge>

// Radius variants
<Badge radius="xs">Sharp corners</Badge>
<Badge radius="xl">Very rounded</Badge>
```

### Badge - Polymorphic Component

```jsx
// Render as different element
<Badge component="a" href="/user/123" variant="light">
  @username
</Badge>

// With TypeScript wrapper
import { ElementProps } from '@mantine/core';

type BadgeLinkProps = React.ComponentPropsWithoutRef<'a'> &
  ElementProps<typeof Badge, 'a'>;

const BadgeLink = (props: BadgeLinkProps) => (
  <Badge component="a" {...props} />
);
```

### Badge - Styles API Customization

```jsx
<Badge
  variant="light"
  color="blue"
  classNames={{
    root: 'custom-badge-root',
    label: 'custom-badge-label'
  }}
  styles={{
    root: { textTransform: 'uppercase' },
    label: { letterSpacing: '0.05em' }
  }}
>
  Custom styled
</Badge>
```

### Chip - Basic Usage

```jsx
import { Chip } from '@mantine/core';

// Uncontrolled (default)
<Chip defaultChecked>Awesome chip</Chip>

// Without default checked
<Chip>Select me</Chip>
```

### Chip - Controlled State

```jsx
import { useState } from 'react';

const [checked, setChecked] = useState(false);

<Chip
  checked={checked}
  onChange={() => setChecked((v) => !v)}
>
  My chip
</Chip>
```

### Chip - Variants & Styling

```jsx
// Filled variant (selected shows solid)
<Chip variant="filled" defaultChecked>
  Filled chip
</Chip>

// Outline variant (border style)
<Chip variant="outline" color="red">
  Outline chip
</Chip>

// Light variant (subtle background)
<Chip variant="light" color="green">
  Light chip
</Chip>

// Size and radius
<Chip size="xs" radius="xl">
  Small rounded
</Chip>
```

### Chip - Custom Icon

```jsx
import { IconX } from '@tabler/icons-react';

<Chip
  icon={<IconX style={{ width: 16, height: 16 }} />}
  defaultChecked
  color="red"
>
  Remove filter
</Chip>
```

### Chip.Group - Single Selection

```jsx
import { Chip } from '@mantine/core';

// Radio-style behavior
<Chip.Group>
  <Chip value="react">React</Chip>
  <Chip value="vue">Vue</Chip>
  <Chip value="angular">Angular</Chip>
  <Chip value="svelte">Svelte</Chip>
</Chip.Group>
```

### Chip.Group - Multiple Selection

```jsx
// Checkbox-style behavior
<Chip.Group multiple>
  <Chip value="html">HTML</Chip>
  <Chip value="css">CSS</Chip>
  <Chip value="js">JavaScript</Chip>
  <Chip value="ts">TypeScript</Chip>
</Chip.Group>
```

### Chip.Group - Controlled Multi-Select

```jsx
import { useState } from 'react';

const [selectedValues, setSelectedValues] = useState(['react', 'vue']);

<Chip.Group
  multiple
  value={selectedValues}
  onChange={setSelectedValues}
>
  <Chip value="react">React</Chip>
  <Chip value="vue">Vue</Chip>
  <Chip value="angular">Angular</Chip>
  <Chip value="svelte">Svelte</Chip>
</Chip.Group>
```

### Chip - With Tooltip

```jsx
import { Chip, Tooltip } from '@mantine/core';

<Tooltip label="Click to filter">
  <Chip refProp="rootRef">Chip with tooltip</Chip>
</Tooltip>
```

### Chip - Deselectable Radio (Custom Behavior)

```jsx
import { useState } from 'react';

const [value, setValue] = useState<string | null>('react');

<Chip.Group value={value} onChange={setValue}>
  <Chip
    value="react"
    onClick={() => value === 'react' && setValue(null)}
  >
    React
  </Chip>
  <Chip
    value="vue"
    onClick={() => value === 'vue' && setValue(null)}
  >
    Vue
  </Chip>
</Chip.Group>
```

---

## API Reference

### Badge Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Badge content |
| `variant` | `'filled' \| 'light' \| 'outline' \| 'dot' \| 'gradient' \| 'transparent' \| 'white'` | `'filled'` | Visual style variant |
| `color` | `string` | - | Theme color |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Badge size |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | - | Border radius |
| `gradient` | `{ from: string, to: string, deg?: number }` | - | Gradient configuration (gradient variant only) |
| `leftSection` | `ReactNode` | - | Content on left side (icon, etc.) |
| `rightSection` | `ReactNode` | - | Content on right side (icon, etc.) |
| `circle` | `boolean` | `false` | Equal width/height (for counts) |
| `fullWidth` | `boolean` | `false` | Span parent width |
| `autoContrast` | `boolean` | `false` | Auto-adjust text color for contrast (filled variant) |
| `component` | `React.ElementType` | `'div'` | Root element type (polymorphic) |
| `classNames` | `Partial<Record<StylesName, string>>` | - | Custom class names for Styles API |
| `styles` | `Partial<Record<StylesName, CSSProperties>>` | - | Inline styles for Styles API |

### Badge Styles API Elements

- `root` - Main badge container
- `section` - Left and right section wrappers
- `label` - Badge content/children wrapper

### Chip Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Chip label content |
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Initial uncontrolled state |
| `onChange` | `(checked: boolean) => void` | - | Called when state changes |
| `value` | `string` | - | Value for Chip.Group |
| `icon` | `ReactNode` | - | Custom checked icon |
| `variant` | `'filled' \| 'outline' \| 'light'` | `'filled'` | Visual style |
| `color` | `string` | - | Theme color |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Chip size |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | - | Border radius |
| `wrapperProps` | `Record<string, any>` | - | Props for root wrapper element |

### Chip.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Chip components |
| `value` | `string \| string[]` | - | Controlled value(s) |
| `defaultValue` | `string \| string[]` | - | Initial uncontrolled value(s) |
| `onChange` | `(value: string \| string[]) => void` | - | Called when selection changes |
| `multiple` | `boolean` | `false` | Allow multiple selections (checkbox behavior) |

---

## Notable Features

### Badge-Specific Features

#### 1. Polymorphic Component System
Badge can render as any HTML element or React component through the `component` prop. This makes it highly flexible for creating interactive badge-links or integrating with routing libraries.

**Type-safe polymorphism:**
```typescript
<Badge<'a'> component="a" href="/profile">
  Link badge
</Badge>
```

#### 2. Circle Mode for Counts
The `circle` prop optimizes badges for displaying notification counts by making width equal to height. This is a common pattern for count indicators.

#### 3. Dual Section Support
`leftSection` and `rightSection` props allow flexible icon/content placement on either or both sides of the badge text, unlike simpler implementations that only support a single icon position.

#### 4. Gradient Variant
Full gradient support with customizable colors and degree angle. Few badge implementations offer this level of gradient control.

#### 5. Auto Contrast
`autoContrast` automatically adjusts text color to ensure sufficient contrast with the background—an accessibility feature that reduces manual theming work.

#### 6. Seven Variants
More variant options than most implementations:
- **Filled** - High emphasis
- **Light** - Subtle emphasis
- **Outline** - Minimal weight with boundaries
- **Dot** - Minimal indicator
- **Gradient** - Visual interest
- **Transparent** - Minimal treatment
- **White** - Light backgrounds

### Chip-Specific Features

#### 1. True Form Control Foundation
Built on native radio/checkbox inputs, ensuring full accessibility and form integration. Many chip implementations are purely visual.

#### 2. Chip.Group for Collections
Dedicated grouping component manages selection state and coordination between chips. Supports both single (radio) and multiple (checkbox) selection modes through a simple `multiple` boolean.

#### 3. Controlled & Uncontrolled Patterns
Full React patterns support:
- Uncontrolled with `defaultChecked`
- Controlled with `checked` + `onChange`
- Works at both individual chip and group levels

#### 4. Custom Check Icons
The `icon` prop allows complete customization of the checked indicator. This enables semantic icons (checkmarks, X's, stars, etc.) based on context.

#### 5. Deselectable Radio Pattern
Documentation explicitly shows how to make radio chips deselectable through custom click handlers—a pattern often requested but not commonly documented.

#### 6. Tooltip Integration
Explicit support for Tooltip wrapping via `refProp="rootRef"`, acknowledging a common use case.

#### 7. Keyboard Accessibility Built-In
As native form controls, chips are fully keyboard accessible without additional implementation work.

---

## Styles API Integration

Both Badge and Chip implement Mantine's **Styles API** pattern, providing:
- Granular control over internal elements
- Both `classNames` and `styles` prop support
- CSS-in-JS and traditional CSS compatibility

This allows:
```jsx
// Class-based styling
<Badge classNames={{ root: 'my-badge', label: 'my-label' }}>
  Styled with CSS classes
</Badge>

// Inline styles
<Badge styles={{ root: { textTransform: 'uppercase' } }}>
  Styled inline
</Badge>

// Combined approach
<Badge
  classNames={{ root: 'my-badge' }}
  styles={{ label: { letterSpacing: '0.05em' } }}
>
  Combined styling
</Badge>
```

---

## Badge vs Chip: Key Differences

| Aspect | Badge | Chip |
|--------|-------|------|
| **Purpose** | Display/presentation | Selection/interaction |
| **Interactivity** | Non-interactive (unless polymorphic) | Interactive (form control) |
| **State** | No internal state | Checked/unchecked state |
| **Foundation** | Styled div | Native checkbox/radio |
| **Variants** | 7 variants | 3 variants |
| **Use Case** | Status, labels, counts, tags | Filters, multi-select, toggles |
| **Grouping** | No group component | Chip.Group component |
| **Accessibility** | Visual only | Form control accessibility |
| **onChange** | N/A | State change callback |
| **Polymorphic** | Yes | No (form control) |

**When to use Badge:** Status indicators, category labels, notification counts, non-interactive tags, visual metadata

**When to use Chip:** Filter selections, multi-select options, toggleable tags, form inputs, interactive choice sets

---

## Research Notes

### Design Philosophy

**Badge Philosophy:**
- Maximum flexibility through polymorphism
- Visual variety through 7 variants
- Composability through section props
- Not opinionated about interactivity (can be made interactive via `component` prop)

**Chip Philosophy:**
- Form control first (accessibility and standards compliance)
- Group coordination through dedicated component
- Clear selection patterns (controlled/uncontrolled)
- React idiomatic (embraces both patterns)

### Implementation Details

**Badge DOM Structure (inferred):**
```html
<div class="root">
  <span class="section"><!-- leftSection --></span>
  <span class="label">Badge content</span>
  <span class="section"><!-- rightSection --></span>
</div>
```

**Chip DOM Structure (inferred):**
```html
<div class="wrapper">
  <input type="checkbox" class="input" />
  <label class="label">
    <span class="iconWrapper">
      <!-- icon or default checkmark -->
    </span>
    <span class="labelText">Chip content</span>
  </label>
</div>
```

### Framework Integration Notes

- **Theme System:** Both components fully integrate with Mantine's theme for colors, spacing, and sizing
- **CSS-in-JS:** Uses Mantine's emotion-based styling system
- **CSS Variables:** Leverages CSS custom properties for theming
- **TypeScript:** Full type safety with discriminated unions for polymorphic behavior

### Comparison to Other Frameworks

**Strengths:**
- Clear separation between Badge (display) and Chip (interaction)
- Strong accessibility through native form controls (Chip)
- Polymorphic Badge is more flexible than most implementations
- Gradient support is uncommon in badge components
- Chip.Group coordination pattern is cleaner than many alternatives

**Unique Patterns:**
- `circle` prop for equal-dimension badges (not common)
- `autoContrast` for accessibility (progressive enhancement)
- `leftSection`/`rightSection` naming (clearer than start/end or before/after)
- Explicit deselectable radio pattern documentation

---

## Key Takeaways for Cross-Framework Analysis

1. **Component Separation:** Clear distinction between presentational (Badge) and interactive (Chip) components rather than combining into one component
2. **Variant Philosophy:** Badge has more variants (7) than Chip (3) reflecting different use case complexity
3. **Polymorphism:** Badge's polymorphic nature makes it adaptable to many contexts
4. **Form Control Foundation:** Chip prioritizes standards compliance over pure styling flexibility
5. **Group Coordination:** Dedicated Chip.Group component vs inline state management
6. **Section Props:** `leftSection`/`rightSection` pattern for icon/content placement
7. **Styling Approach:** Consistent Styles API across both components
8. **React Patterns:** Full support for both controlled and uncontrolled components
9. **Accessibility First:** Chip built on native inputs; Badge supports semantic HTML via polymorphism
10. **No Animation Config:** Neither component exposes transition/animation controls (framework-level concern)

---

**Research Status:** Complete
**Documentation Quality:** Excellent - comprehensive examples, clear API reference, accessibility notes, TypeScript patterns
**Framework Maturity:** Production-ready with strong patterns for both presentational and interactive use cases
