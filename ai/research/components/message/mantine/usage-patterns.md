# Mantine Alert Component - Usage Patterns Research

**Component:** Alert
**Framework:** Mantine (React)
**Package:** @mantine/core
**Documentation:** https://mantine.dev/core/alert
**Research Date:** 2025-11-04

---

## Display Patterns

### Visual Presentation
The Alert component is described as attracting "user attention with important static message[s]". It is a **static messaging component** (not dismissible by default) designed for persistent, important information display.

### Layout Structure
```
┌─────────────────────────────────────────┐
│ [Icon] [Title]              [Close Btn] │
│        Message content                   │
└─────────────────────────────────────────┘
```

**Element Hierarchy:**
- **Root Container**: Main wrapper with `role="alert"`
- **Wrapper**: Surrounds body and icon
- **Icon** (optional): Leading visual indicator
- **Body**: Contains title and message
  - **Title** (optional): Bold heading text
  - **Message**: Main content area (children)
- **Close Button** (optional): Trailing dismiss action

### Variant Patterns

Mantine Alert supports **6 visual variants** that control the overall styling approach:

1. **Light** (default in examples): Lighter background with colored text and accent
2. **Filled**: Solid background color variant
3. **Outline**: Border-based styling with transparent background
4. **Transparent**: Minimal visual treatment
5. **White**: Light background variant
6. **Default**: Standard presentation

Each variant interacts with the color system differently through CSS variables with specific states: `-text`, `-filled`, `-light`, `-outline`.

### Border Radius Control

Supports **5 size options** for border-radius customization:
- `xs` - Extra small
- `sm` - Small
- `md` - Medium (likely default)
- `lg` - Large
- `xl` - Extra large

---

## Content Patterns

### Title Usage
- **Optional** heading for the alert
- When provided, automatically connected via `aria-labelledby` for accessibility
- Visually distinct from message content (typically bold/emphasized)

### Message Content
- Passed as `children` prop
- Can contain rich content (not just text)
- Automatically referenced by `aria-describedby` for screen readers

### Icon Integration
- **Optional** icon element (typically from @tabler/icons-react or custom)
- Accepts ReactNode, allowing flexibility
- Examples show `IconInfoCircle` for informational alerts
- Icon appears at the leading edge of the alert

---

## Behavior Patterns

### Static by Default
Unlike notification components, Alert is designed for **persistent display** of important information. It does not auto-dismiss.

### Optional Dismissal
- **Close button disabled by default**
- Enable with `withCloseButton={true}` prop
- **Accessibility requirement**: Must provide `closeButtonLabel` prop when using close button
  - Example: `closeButtonLabel="Dismiss notification"`
  - Critical for screen reader users

### No Explicit Event Handlers
Documentation does not show:
- `onClose` callback
- Animation/transition behavior
- State management for show/hide

This suggests the component may handle internal state for dismissal, or dismissal is handled externally by conditional rendering.

---

## Variant Patterns

### Color System

**Theme-Aware Colors:**
The color prop determines semantic styling and adapts between light/dark modes automatically.

**Example colors shown:**
- `blue` - Informational (shown in examples)
- Custom colors: `ocean-blue`, `bright-pink`, `oklch-blue`, `virtual` (theme-extended)

**Semantic Mapping (inferred from common patterns):**
- Blue → Informational
- Red → Error/Danger
- Yellow → Warning
- Green → Success

**Color-Variant Interaction:**
Each color has CSS variable states that work with variants:
- `-text`: Text color for content
- `-filled`: Background for filled variant
- `-light`: Background for light variant
- `-outline`: Border color for outline variant

### Variant Examples

```jsx
// Light variant (default style)
<Alert variant="light" color="blue">Message</Alert>

// Filled variant (solid background)
<Alert variant="filled" color="red">Error message</Alert>

// Outline variant (border only)
<Alert variant="outline" color="yellow">Warning</Alert>

// Transparent variant (minimal)
<Alert variant="transparent" color="green">Success</Alert>
```

---

## Code Examples

### Basic Alert
```jsx
import { Alert } from '@mantine/core';

<Alert>
  Basic alert message without any configuration
</Alert>
```

### Alert with Title and Icon
```jsx
import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

<Alert
  variant="light"
  color="blue"
  title="Alert title"
  icon={<IconInfoCircle />}
>
  This is an informational message with an icon and title
</Alert>
```

### Dismissible Alert
```jsx
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

<Alert
  variant="filled"
  color="red"
  title="Error occurred"
  icon={<IconAlertCircle />}
  withCloseButton
  closeButtonLabel="Dismiss error alert"
>
  Something went wrong. Please try again.
</Alert>
```

### Custom Styling with Styles API
```jsx
<Alert
  variant="light"
  color="blue"
  title="Custom styled alert"
  classNames={{
    root: 'custom-alert-root',
    title: 'custom-alert-title',
    message: 'custom-alert-message'
  }}
  styles={{
    root: { borderLeft: '4px solid blue' },
    title: { fontSize: '1.2rem' }
  }}
>
  Alert with custom styles applied
</Alert>
```

---

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | - | Optional alert heading |
| `children` | `ReactNode` | - | Main message content |
| `icon` | `ReactNode` | - | Optional leading icon element |
| `color` | `string` | - | Semantic color (theme-aware) |
| `variant` | `'light' \| 'filled' \| 'outline' \| 'transparent' \| 'white' \| 'default'` | `'light'` (inferred) | Visual styling variant |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | - | Border radius size |
| `withCloseButton` | `boolean` | `false` | Show dismiss button |
| `closeButtonLabel` | `string` | - | **Required** when `withCloseButton` is true; accessible label for close button |
| `classNames` | `Partial<Record<StylesName, string>>` | - | Custom class names for Styles API elements |
| `styles` | `Partial<Record<StylesName, CSSProperties>>` | - | Inline styles for Styles API elements |

### Styles API Elements

Alert exposes these elements for styling customization:

- `root` - Main container element
- `wrapper` - Surrounds body and icon
- `body` - Contains title and message
- `title` - Title section wrapper
- `label` - Title text element
- `message` - Main content area
- `icon` - Icon display element
- `closeButton` - Dismiss button element

### Accessibility Attributes

- **`role="alert"`** - Applied to root element automatically
- **`aria-describedby`** - References body element for screen readers
- **`aria-labelledby`** - References title when provided
- **Close button accessibility** - Requires `closeButtonLabel` for proper screen reader support

---

## Notable Features

### 1. Static Messaging Focus
Unlike transient notifications, Alert is designed for **persistent, in-context messages** that remain visible until explicitly dismissed or removed from the DOM.

### 2. Accessibility Built-In
- Proper ARIA roles and attributes applied automatically
- Enforces accessible close buttons through required `closeButtonLabel` prop
- Semantic HTML structure for screen reader navigation

### 3. Styles API Integration
Alert implements Mantine's **Styles API** pattern, providing:
- Granular control over internal elements
- Both `classNames` and `styles` prop support
- CSS-in-JS and traditional CSS compatibility

### 4. Theme-Aware Design
- Colors automatically adapt to light/dark mode
- Supports custom theme colors beyond defaults
- Consistent with Mantine's theming system

### 5. Composable Icon System
- Accepts any ReactNode as icon
- Works well with @tabler/icons-react (Mantine's recommended icon library)
- No restrictions on icon source

### 6. Variant Flexibility
Six variants provide visual hierarchy options:
- **Light** for subtle emphasis
- **Filled** for high prominence
- **Outline** for minimal visual weight with clear boundaries
- **Transparent** for minimal interference
- **White/Default** for specific design needs

### 7. No Built-In Animations
Component appears to be stateless regarding show/hide transitions, leaving animation implementation to the consuming application.

---

## Research Notes

### Comparison Considerations

**Strengths:**
- Clear, focused purpose as a static alert component
- Strong accessibility defaults and requirements
- Flexible styling through Styles API
- Theme integration with light/dark mode support
- Simple, React-idiomatic API

**Limitations/Observations:**
- No explicit onClose handler shown (dismissal may be internal or require external state)
- No animation/transition configuration shown
- Documentation doesn't detail integration with Mantine's Notifications system
- Default color and variant not explicitly stated in documentation

### Integration with Mantine Ecosystem

- Part of @mantine/core package (core component library)
- Follows Mantine's design system conventions
- Uses theme color system
- Implements Styles API pattern (consistent with other Mantine components)

**Distinction from Notifications:**
While Mantine has a separate `Notifications` system for transient messages, Alert is for **static, in-context messaging** that persists within the page layout rather than appearing as overlays.

### Implementation Details

**DOM Structure (inferred):**
```html
<div role="alert" aria-describedby="body-id" aria-labelledby="title-id" class="root">
  <div class="wrapper">
    <div class="icon"><!-- Icon ReactNode --></div>
    <div class="body" id="body-id">
      <div class="title">
        <div class="label" id="title-id">Alert title</div>
      </div>
      <div class="message">Message content</div>
    </div>
  </div>
  <button class="closeButton" aria-label="closeButtonLabel">×</button>
</div>
```

### Styling Approach

Mantine uses **CSS-in-JS** with its Styles API pattern:
- Component generates CSS classes dynamically
- Supports both className overrides and inline styles
- Theme tokens available through CSS variables
- Each variant/color combination uses specific CSS variable patterns

**Example CSS variables (inferred):**
- `--color-blue-text`
- `--color-blue-filled`
- `--color-blue-light`
- `--color-blue-outline`

### React-Specific Patterns

- **Props-based API**: All configuration through props (no children function patterns)
- **ReactNode flexibility**: title, icon, children all accept ReactNode
- **Controlled/Uncontrolled**: Appears to be primarily uncontrolled (no value/onChange pattern shown)
- **Composition**: Uses children for content composition rather than slots

---

## Key Takeaways for Cross-Framework Analysis

1. **Terminology**: Uses "Alert" (common with Ant Design, MUI, Bootstrap)
2. **Semantic Colors**: Theme-based color system with semantic mappings
3. **Static vs Dynamic**: Positioned as static messaging (unlike transient notifications)
4. **Accessibility First**: Required props for accessible features (closeButtonLabel)
5. **Styling Philosophy**: CSS-in-JS with Styles API for granular control
6. **Icon Integration**: Flexible ReactNode approach (no icon library coupling)
7. **Variant System**: Multiple visual variants for different emphasis levels
8. **No Animation Config**: Component doesn't expose animation/transition controls

---

**Research Status:** Complete
**Documentation Quality:** Good - clear examples and API reference, though some defaults not explicitly stated
**Framework Maturity:** Production-ready component with strong accessibility focus
