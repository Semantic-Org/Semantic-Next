# HeroUI - Badge & Chip Usage Patterns

> Last Modified: 2025-11-04

## Component URLs
**Badge**: https://www.heroui.com/docs/components/badge
**Chip**: https://www.heroui.com/docs/components/chip
Status: ✅ Both URLs accessible
Version: Current (HeroUI v2.x - Previously NextUI)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - Both components have detailed documentation with examples, API references, and use case demonstrations.

---

# Badge Component

## Component Definition
- **Core purpose**: A small numerical value or status descriptor displayed on or near another UI element (typically overlaid on avatars, icons, or buttons). Used for notifications, counts, or status indicators.
- **Mental model**: A floating indicator that draws attention to counts, notifications, or status changes on parent elements. Users expect badges to show dynamic information (unread count, online status, etc.).
- **Semantic meaning**: Represents supplementary information that enhances the parent element - notification counts, status indicators, or visual markers that don't require user interaction.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Dot badge** | ✅ | Native | Content-less badge displays as a small dot indicator (no text/number) |
| **Number content** | ✅ | Native | Display numeric values via `content` prop (e.g., notification counts) |
| **Text content** | ✅ | Native | Display short text strings via `content` prop |
| **Empty/invisible** | ✅ | Native | `isInvisible` prop to conditionally hide badge |
| **One character** | ✅ | Native | `isOneChar` prop optimizes styling for single character display |

### Code Example - Content Variations
```jsx
import {Badge, Avatar} from "@heroui/react";

// Dot badge (no content)
<Badge color="danger" shape="circle" placement="bottom-right">
  <Avatar src="/avatar.jpg" />
</Badge>

// Number content
<Badge content={5} color="primary">
  <Avatar src="/avatar.jpg" />
</Badge>

// Text content
<Badge content="NEW" color="success">
  <Avatar src="/avatar.jpg" />
</Badge>

// Invisible badge (conditional visibility)
<Badge content={0} isInvisible={count === 0}>
  <Avatar src="/avatar.jpg" />
</Badge>
```

## Variant Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Solid** | ✅ | Native | `variant="solid"` - Filled background (default) |
| **Flat** | ✅ | Native | `variant="flat"` - Subtle background tint |
| **Faded** | ✅ | Native | `variant="faded"` - Semi-transparent background |
| **Shadow** | ✅ | Native | `variant="shadow"` - Elevated appearance with drop shadow |
| **Bordered** | ✅ | Native | `variant="bordered"` - Border-only styling |

### Code Example - Variants
```jsx
import {Badge, Avatar} from "@heroui/react";

<div className="flex gap-4">
  <Badge content={5} variant="solid">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} variant="flat">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} variant="faded">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} variant="shadow">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} variant="bordered">
    <Avatar src="/avatar.jpg" />
  </Badge>
</div>
```

## Color Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Default** | ✅ | Native | `color="default"` - Neutral gray |
| **Primary** | ✅ | Native | `color="primary"` - Brand primary color |
| **Secondary** | ✅ | Native | `color="secondary"` - Brand secondary color |
| **Success** | ✅ | Native | `color="success"` - Positive/success states |
| **Warning** | ✅ | Native | `color="warning"` - Warning/caution states |
| **Danger** | ✅ | Native | `color="danger"` - Error/danger states |

### Code Example - Colors
```jsx
import {Badge, Avatar} from "@heroui/react";

<div className="flex gap-4">
  <Badge content={5} color="default">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} color="primary">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} color="success">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} color="warning">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} color="danger">
    <Avatar src="/avatar.jpg" />
  </Badge>
</div>
```

## Size Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Small** | ✅ | Native | `size="sm"` - Compact badge |
| **Medium** | ✅ | Native | `size="md"` - Default size |
| **Large** | ✅ | Native | `size="lg"` - Larger badge for emphasis |

### Code Example - Sizes
```jsx
import {Badge, Avatar} from "@heroui/react";

<div className="flex gap-4 items-center">
  <Badge content={5} size="sm">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} size="md">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} size="lg">
    <Avatar src="/avatar.jpg" />
  </Badge>
</div>
```

## Placement Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Top-right** | ✅ | Native | `placement="top-right"` - Default placement |
| **Top-left** | ✅ | Native | `placement="top-left"` |
| **Bottom-right** | ✅ | Native | `placement="bottom-right"` |
| **Bottom-left** | ✅ | Native | `placement="bottom-left"` |

### Code Example - Placements
```jsx
import {Badge, Avatar} from "@heroui/react";

<div className="flex gap-4">
  <Badge content={5} placement="top-right">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} placement="top-left">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} placement="bottom-right">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} placement="bottom-left">
    <Avatar src="/avatar.jpg" />
  </Badge>
</div>
```

## Shape Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Rectangle** | ✅ | Native | `shape="rectangle"` - Rounded rectangle (default) |
| **Circle** | ✅ | Native | `shape="circle"` - Perfect circle (ideal for dots) |

### Code Example - Shapes
```jsx
import {Badge, Avatar} from "@heroui/react";

<div className="flex gap-4">
  <Badge content={5} shape="rectangle">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge content={5} shape="circle">
    <Avatar src="/avatar.jpg" />
  </Badge>
  <Badge shape="circle" color="danger">
    <Avatar src="/avatar.jpg" />
  </Badge>
</div>
```

## Visual Enhancement Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Outline** | ✅ | Native | `showOutline={true}` - White border around badge (default: true) |
| **No outline** | ✅ | Native | `showOutline={false}` - Remove border |
| **Visibility control** | ✅ | Native | `isInvisible` - Conditionally hide badge |
| **Disable animation** | ✅ | Native | `disableAnimation` - Remove scale/fade animations |

### Code Example - Visual Enhancements
```jsx
import {Badge, Avatar} from "@heroui/react";

<div className="flex gap-4">
  {/* With outline (default) */}
  <Badge content={5} showOutline={true}>
    <Avatar src="/avatar.jpg" />
  </Badge>

  {/* Without outline */}
  <Badge content={5} showOutline={false}>
    <Avatar src="/avatar.jpg" />
  </Badge>

  {/* Invisible badge */}
  <Badge content={0} isInvisible={true}>
    <Avatar src="/avatar.jpg" />
  </Badge>

  {/* No animation */}
  <Badge content={5} disableAnimation>
    <Avatar src="/avatar.jpg" />
  </Badge>
</div>
```

## Interactive Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Non-interactive** | ✅ | Native | Badges are display-only by default (no click handlers) |
| **Press events** | ❌ | Not Supported | No built-in onPress/onClick on badges themselves |
| **Parent interaction** | ✅ | Composed | Badge wraps clickable parent (Avatar, Button, etc.) |

**Note**: Badges are informational overlays, not interactive elements. User interaction targets the parent element, not the badge.

---

# Chip Component

## Component Definition
- **Core purpose**: A compact element displaying information, tags, or attributes. Can represent contacts, tags, categories, or selectable/removable items. Supports user interaction through press and close actions.
- **Mental model**: A tag or label that represents an entity, attribute, or action. Users expect chips to be dismissible (via close button) and sometimes selectable/pressable.
- **Semantic meaning**: Represents a discrete piece of information or an active filter/selection. Communicates categorization, selection state, or allows quick removal of items.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Text content** | ✅ | Native | Display text via `children` prop |
| **Avatar** | ✅ | Native | `avatar` prop to display user avatar at start |
| **Start icon** | ✅ | Native | `startContent` prop for leading icon/element |
| **End icon** | ✅ | Native | `endContent` prop for trailing icon/element |
| **Close button** | ✅ | Native | `onClose` prop enables dismissible close button |
| **Custom content** | ✅ | Composed | Children accepts ReactNode for flexible composition |

### Code Example - Content Variations
```jsx
import {Chip, Avatar} from "@heroui/react";

// Text only
<Chip>Chip</Chip>

// With avatar
<Chip avatar={<Avatar src="/avatar.jpg" />}>
  Jane Doe
</Chip>

// With start icon
<Chip startContent={<NotificationIcon />}>
  Notifications
</Chip>

// With end icon
<Chip endContent={<CheckIcon />}>
  Verified
</Chip>

// Closeable chip
<Chip onClose={() => console.log("close")}>
  Closeable
</Chip>

// Combined: avatar + close button
<Chip
  avatar={<Avatar src="/avatar.jpg" />}
  onClose={() => handleRemove()}
>
  Jane Doe
</Chip>
```

## Variant Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Solid** | ✅ | Native | `variant="solid"` - Filled background (default) |
| **Bordered** | ✅ | Native | `variant="bordered"` - Border-only styling |
| **Light** | ✅ | Native | `variant="light"` - Subtle background |
| **Flat** | ✅ | Native | `variant="flat"` - Muted fill |
| **Faded** | ✅ | Native | `variant="faded"` - Semi-transparent |
| **Shadow** | ✅ | Native | `variant="shadow"` - Elevated with drop shadow |
| **Dot** | ✅ | Native | `variant="dot"` - Small dot indicator before text |

### Code Example - Variants
```jsx
import {Chip} from "@heroui/react";

<div className="flex gap-2 flex-wrap">
  <Chip variant="solid">Solid</Chip>
  <Chip variant="bordered">Bordered</Chip>
  <Chip variant="light">Light</Chip>
  <Chip variant="flat">Flat</Chip>
  <Chip variant="faded">Faded</Chip>
  <Chip variant="shadow">Shadow</Chip>
  <Chip variant="dot">Dot</Chip>
</div>
```

## Color Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Default** | ✅ | Native | `color="default"` - Neutral gray |
| **Primary** | ✅ | Native | `color="primary"` - Brand primary color |
| **Secondary** | ✅ | Native | `color="secondary"` - Brand secondary color |
| **Success** | ✅ | Native | `color="success"` - Positive states |
| **Warning** | ✅ | Native | `color="warning"` - Warning states |
| **Danger** | ✅ | Native | `color="danger"` - Error/danger states |

### Code Example - Colors
```jsx
import {Chip} from "@heroui/react";

<div className="flex gap-2 flex-wrap">
  <Chip color="default">Default</Chip>
  <Chip color="primary">Primary</Chip>
  <Chip color="secondary">Secondary</Chip>
  <Chip color="success">Success</Chip>
  <Chip color="warning">Warning</Chip>
  <Chip color="danger">Danger</Chip>
</div>
```

## Size Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Small** | ✅ | Native | `size="sm"` - Compact chip |
| **Medium** | ✅ | Native | `size="md"` - Default size |
| **Large** | ✅ | Native | `size="lg"` - Larger chip |

### Code Example - Sizes
```jsx
import {Chip} from "@heroui/react";

<div className="flex gap-2 items-center">
  <Chip size="sm">Small</Chip>
  <Chip size="md">Medium</Chip>
  <Chip size="lg">Large</Chip>
</div>
```

## Radius Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **None** | ✅ | Native | `radius="none"` - Square corners |
| **Small** | ✅ | Native | `radius="sm"` - Slightly rounded |
| **Medium** | ✅ | Native | `radius="md"` - Moderately rounded |
| **Large** | ✅ | Native | `radius="lg"` - Very rounded |
| **Full** | ✅ | Native | `radius="full"` - Pill shape (default) |

### Code Example - Radius
```jsx
import {Chip} from "@heroui/react";

<div className="flex gap-2">
  <Chip radius="none">None</Chip>
  <Chip radius="sm">Small</Chip>
  <Chip radius="md">Medium</Chip>
  <Chip radius="lg">Large</Chip>
  <Chip radius="full">Full</Chip>
</div>
```

## Interactive Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Closeable** | ✅ | Native | `onClose` prop - Shows close button, triggers callback |
| **Press events** | ✅ | Native | `onPress` - Main press/click handler (mobile-first via React Aria) |
| **Press lifecycle** | ✅ | Native | `onPressStart`, `onPressEnd`, `onPressUp`, `onPressChange` - Granular press control |
| **Disabled** | ✅ | Native | `isDisabled` - Prevents all interaction |
| **Non-interactive** | ✅ | Native | No press/close handlers = display-only chip |

### Code Example - Interactive Patterns
```jsx
import {Chip} from "@heroui/react";

// Closeable chip
<Chip onClose={() => console.log("chip closed")}>
  Closeable
</Chip>

// Pressable chip (selectable)
<Chip onPress={() => console.log("chip pressed")}>
  Clickable
</Chip>

// Press lifecycle events
<Chip
  onPressStart={(e) => console.log("press start")}
  onPressEnd={(e) => console.log("press end")}
  onPressChange={(isPressed) => console.log("pressed:", isPressed)}
>
  Press tracking
</Chip>

// Both closeable and pressable
<Chip
  onPress={() => handleSelect()}
  onClose={() => handleRemove()}
>
  Select or remove
</Chip>

// Disabled chip
<Chip isDisabled>
  Disabled
</Chip>
```

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Disabled** | ✅ | Native | `isDisabled` - Visual disabled state, prevents interaction |
| **Hover** | ✅ | Native | Automatic hover states via data attributes |
| **Focus** | ✅ | Native | Keyboard focus management (when pressable) |
| **Pressed** | ✅ | Native | Active press state during interaction |

### Code Example - States
```jsx
import {Chip} from "@heroui/react";

// Disabled state
<Chip isDisabled>
  Disabled Chip
</Chip>

// Hover/focus states are automatic when onPress is provided
<Chip onPress={() => handleAction()}>
  Hover and focus me
</Chip>
```

## Visual Enhancement Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Disable animation** | ✅ | Native | `disableAnimation` - Remove hover/press animations |
| **Custom class** | ✅ | Native | `className` - Tailwind/CSS classes for custom styling |

---

## Badge vs Chip: Key Differences

### Purpose
- **Badge**: Supplementary indicator on another element (overlay pattern)
- **Chip**: Standalone tag/label element (discrete item)

### Placement
- **Badge**: Positioned relative to parent (top-right, bottom-left, etc.)
- **Chip**: Inline element in flow of content

### Interactivity
- **Badge**: Non-interactive (informational only)
- **Chip**: Interactive (closeable, pressable, selectable)

### Content
- **Badge**:
  - Typically numbers or very short text
  - Dot variation for status indicators
  - `content` prop for data
- **Chip**:
  - Full text labels
  - Supports avatars, icons
  - `children` prop for content
  - Start/end content slots

### Use Cases
- **Badge**:
  - Notification counts (5 unread messages)
  - Status indicators (online/offline dot)
  - Shopping cart item count
  - Unread message indicators
- **Chip**:
  - Tags/categories
  - Contact list (with avatars)
  - Filter selections (removable)
  - Keyword/hashtag display
  - Multi-select options

### Visual Characteristics
- **Badge**:
  - Small, compact
  - Often circular for dots
  - Floats above parent
- **Chip**:
  - More substantial
  - Pill-shaped (full radius)
  - In-line with content flow

---

## Notable Features

### Badge-Specific Features

#### 1. Overlay Positioning System
- Four corner placements with automatic positioning
- Respects parent element boundaries
- Smart offset to avoid covering parent content

#### 2. Outline Border
- White border around badge (default: enabled)
- Improves visibility on colored backgrounds
- Can be disabled via `showOutline={false}`

#### 3. One-Character Optimization
- `isOneChar` prop for perfect circle badges
- Optimizes padding/sizing for single digits
- Ensures visual consistency

#### 4. Dot Indicator Mode
- Content-less badge displays as small dot
- Perfect for status indicators (online/offline)
- Minimal visual footprint

#### 5. Conditional Visibility
- `isInvisible` prop for dynamic show/hide
- Useful for zero-count scenarios
- Smooth transitions when toggled

### Chip-Specific Features

#### 1. Mobile-First Press Events
- Built on React Aria's `usePress` hook
- Unified touch/mouse/keyboard handling
- Cross-platform consistency

#### 2. Press Event Granularity
- `onPress` - Main interaction
- `onPressStart` - Touch/click begins
- `onPressEnd` - Touch/click completes
- `onPressUp` - Pointer released
- `onPressChange` - Boolean state change

This granular event system enables:
- Custom press feedback
- Drag-to-cancel interactions
- Long-press detection (via duration tracking)

#### 3. Avatar Integration
- First-class `avatar` prop
- Automatic sizing and positioning
- Consistent spacing with text content

#### 4. Dual Content Slots
- `startContent` - Leading icons/elements
- `endContent` - Trailing icons/elements
- Independent from close button
- Flexible composition

#### 5. Close Button Pattern
- `onClose` prop automatically adds close icon
- Distinct from press interaction
- Prevents event bubbling
- Customizable via styling

#### 6. Dot Variant
- `variant="dot"` adds status dot before text
- Different from Badge dot (not overlay)
- Useful for status + label combination

#### 7. Extensive Radius Control
- 5 radius levels (none to full)
- Default: `full` (pill shape)
- Enables design system flexibility

---

## Research Notes

### Framework Architecture Observations

**React Aria Foundation**: Both Badge and Chip leverage React Aria for interaction handling. Chips use `usePress` for unified event handling across devices. This is a key differentiator - mobile-first interaction design.

**Data Attributes for State**: Both components expose state via data attributes (data-hover, data-focus, data-pressed, data-disabled). This pattern enables CSS-based state styling without JavaScript complexity.

**Composition Strategies**:
- **Badge**: Wrapper pattern - wraps target element and positions badge relative to it
- **Chip**: Content slots pattern - avatar/startContent/endContent/close button all compose

**Event Model Philosophy**: Chips use `onPress` instead of `onClick` for better cross-platform behavior. The granular press events (`onPressStart`, `onPressEnd`, etc.) enable sophisticated interaction patterns.

### Cross-Framework Considerations

For web components adaptation:

**Badge Patterns**:
1. **Positioning**: Use absolute positioning with CSS custom properties for placement offsets
2. **Outline**: Shadow DOM enables consistent white outline without z-index issues
3. **Dot mode**: Template conditionals based on content presence
4. **Visibility**: CSS visibility or opacity transitions for smooth show/hide

**Chip Patterns**:
1. **Press events**: Implement via standard click/pointerdown/pointerup events with touch-action CSS
2. **Avatar slot**: Use `<slot name="avatar">` for flexible avatar content
3. **Content slots**: Named slots for start/end content
4. **Close button**: Conditionally render based on close callback presence
5. **State attributes**: Mirror data-* attribute pattern for CSS hooks

### API Design Insights

**Badge Design**:
- **Minimal API**: Few props, clear purpose - overlay indicators only
- **Smart defaults**: Top-right placement, medium size, solid variant
- **Shape intelligence**: Circle shape pairs with dot badges naturally
- **Visibility control**: `isInvisible` better than removing component (preserves layout)

**Chip Design**:
- **Rich interaction model**: Press events + close events = flexible UX
- **Content composition**: Avatar + start/end content + close = 4 visual zones
- **Variant diversity**: 7 variants provide extensive visual options
- **Radius as identity**: Full radius (pill) is signature Chip characteristic

### Badge vs Chip Decision Framework

**Use Badge when**:
- Overlaying supplementary info on another element
- Displaying notification counts or status
- Non-interactive indicator needed
- Minimal visual footprint desired

**Use Chip when**:
- Standalone tag/label required
- User interaction needed (remove, select)
- Rich content (avatar, icons) included
- Part of a collection (tag list, filter selections)

### Accessibility Considerations

**Badge**:
- Should use `aria-label` for screen readers when content is numeric only
- Status indicators (dots) need semantic meaning communicated
- Invisible badges should still be in DOM for consistency

**Chip**:
- Close buttons need accessible labels (`aria-label="Remove"`)
- Pressable chips need keyboard support (Enter/Space)
- Focus indicators automatic via React Aria
- Disabled state properly announced

### Potential Improvements

**Badge**:
1. **Max count pattern**: No built-in "99+" overflow pattern for large numbers
2. **Pulse animation**: Missing attention-grabbing pulse for new notifications
3. **Multiple badges**: No pattern for multiple badges on same element
4. **Custom positioning**: No fine-grained offset control

**Chip**:
1. **Checkmark pattern**: No visual indicator for selected chips in multi-select
2. **Loading state**: No loading spinner option during async actions
3. **Truncation**: No built-in text truncation for long labels
4. **Group coordination**: No ChipGroup component for multi-chip management

---

## Installation

### Badge
```bash
# CLI installation
npx heroui-cli@latest add badge

# Manual installation
npm install @heroui/react
```

### Chip
```bash
# CLI installation
npx heroui-cli@latest add chip

# Manual installation
npm install @heroui/react
```

### Import
```jsx
import {Badge} from "@heroui/react";
import {Chip} from "@heroui/react";
```

---

## Complete API Reference

### Badge Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Element to overlay badge on |
| `content` | string \| number | - | Badge content (text/number) |
| `variant` | "solid" \| "flat" \| "faded" \| "shadow" \| "bordered" | "solid" | Visual variant |
| `color` | "default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger" | "default" | Color scheme |
| `size` | "sm" \| "md" \| "lg" | "md" | Badge size |
| `shape` | "rectangle" \| "circle" | "rectangle" | Badge shape |
| `placement` | "top-right" \| "top-left" \| "bottom-right" \| "bottom-left" | "top-right" | Badge position |
| `showOutline` | boolean | true | Show white border |
| `isInvisible` | boolean | false | Hide badge |
| `isOneChar` | boolean | false | Optimize for single character |
| `disableAnimation` | boolean | false | Disable animations |
| `className` | string | - | Custom CSS classes |

### Chip Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Chip content |
| `variant` | "solid" \| "bordered" \| "light" \| "flat" \| "faded" \| "shadow" \| "dot" | "solid" | Visual variant |
| `color` | "default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger" | "default" | Color scheme |
| `size` | "sm" \| "md" \| "lg" | "md" | Chip size |
| `radius` | "none" \| "sm" \| "md" \| "lg" \| "full" | "full" | Border radius |
| `avatar` | ReactNode | - | Avatar element |
| `startContent` | ReactNode | - | Leading icon/content |
| `endContent` | ReactNode | - | Trailing icon/content |
| `onPress` | () => void | - | Press handler |
| `onPressStart` | (e) => void | - | Press start handler |
| `onPressEnd` | (e) => void | - | Press end handler |
| `onPressUp` | (e) => void | - | Press up handler |
| `onPressChange` | (isPressed: boolean) => void | - | Press state change |
| `onClose` | () => void | - | Close button handler |
| `isDisabled` | boolean | false | Disable interaction |
| `disableAnimation` | boolean | false | Disable animations |
| `className` | string | - | Custom CSS classes |

---

## Conclusion

HeroUI provides well-differentiated Badge and Chip components with clear use cases:

**Badge strengths**:
- Focused overlay pattern
- Excellent for notification counts
- Smart positioning system
- Minimal, non-intrusive

**Chip strengths**:
- Rich interaction model (press + close)
- Extensive customization (7 variants, 5 radius options)
- Mobile-first event handling
- Avatar/icon integration

Both components demonstrate:
- Strong accessibility foundations (React Aria)
- Comprehensive theming support
- Clean, orthogonal APIs (variant × color × size)
- Extensive visual customization

The press event granularity in Chips is particularly notable for mobile-first applications, while Badge's overlay positioning system is well-suited for notification patterns.
