# Radix UI - Button Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://www.radix-ui.com/themes/docs/components/button
Status: ✅ Working
Version: Current (Radix Themes)
Last Verified: 2024-11-04

## Documentation Quality
Comprehensive - Well-organized with clear examples and thorough API documentation

## Component Definition
- **Core purpose**: Triggers an action or event, such as submitting a form or displaying a dialog. Standard button element enhanced with Radix Themes styling system.
- **Mental model**: A flexible button primitive that adapts to various design needs through composition and prop-based configuration. Users think of it as a standard button with built-in design system integration.
- **Semantic meaning**: Communicates actionable elements in the UI - primary actions, secondary actions, tertiary options, and ghost buttons that blend with text content.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Plain text as children: `<Button>Edit profile</Button>` |
| Icon support | ✅ | Composed | Icons nested directly with automatic spacing: `<Button><BookmarkIcon /> Bookmark</Button>` |
| Icon + Text | ✅ | Composed | Icons and text automatically spaced when nested together |
| Loading indicator | ✅ | Native | `loading` prop displays spinner while preserving button dimensions and auto-disables |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Classic | ✅ | Native | `variant="classic"` - Traditional button appearance |
| Solid | ✅ | Native | `variant="solid"` (default) - Filled button design |
| Soft | ✅ | Native | `variant="soft"` - Lighter, subtle styling |
| Surface | ✅ | Native | `variant="surface"` - Surface-level emphasis |
| Outline | ✅ | Native | `variant="outline"` - Border-only variant |
| Ghost | ✅ | Native | `variant="ghost"` - No chrome styling, uses negative margin for optical alignment with text |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | Standard `disabled` attribute supported (HTML native) |
| Loading | ✅ | Native | `loading` prop shows spinner, preserves dimensions, auto-disables button |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="1" \| "2" \| "3" \| "4"` - Four responsive sizes, default "2", supports `Responsive<>` type |
| Color options | ✅ | Native | `color` prop accepts theme colors: indigo, cyan, orange, crimson, gray, and other theme colors |
| Radius options | ✅ | Native | `radius="none" \| "small" \| "medium" \| "large" \| "full"` - Full control over border radius |
| High contrast | ✅ | Native | `highContrast` boolean prop enhances color contrast against backgrounds across all variants |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | Standard HTML button element supports all native events (onClick, etc.) |
| As child | ✅ | Native | `asChild` prop enables polymorphic rendering - renders as child element instead of button |

## Code Examples

### Basic Usage
```jsx
// Simple text button
<Button>Edit profile</Button>

// With icon
<Button>
  <BookmarkIcon /> Bookmark
</Button>
```

### Size Variants
```jsx
<Flex gap="3" align="center">
  <Button size="1" variant="soft">Edit profile</Button>
  <Button size="2" variant="soft">Edit profile</Button>
  <Button size="3" variant="soft">Edit profile</Button>
</Flex>
```

### Visual Variants
```jsx
<Flex align="center" gap="3">
  <Button variant="classic">Edit profile</Button>
  <Button variant="solid">Edit profile</Button>
  <Button variant="soft">Edit profile</Button>
  <Button variant="surface">Edit profile</Button>
  <Button variant="outline">Edit profile</Button>
  <Button variant="ghost">Edit profile</Button>
</Flex>
```

### Color Customization
```jsx
<Flex gap="3">
  <Button color="indigo" variant="soft">Edit profile</Button>
  <Button color="cyan" variant="soft">Edit profile</Button>
  <Button color="orange" variant="soft">Edit profile</Button>
  <Button color="crimson" variant="soft">Edit profile</Button>
</Flex>
```

### High Contrast Mode
```jsx
<Button color="gray" variant="solid" highContrast>
  Edit profile
</Button>
```

### Border Radius Options
```jsx
<Flex gap="3">
  <Button radius="none" variant="soft">Edit profile</Button>
  <Button radius="large" variant="soft">Edit profile</Button>
  <Button radius="full" variant="soft">Edit profile</Button>
</Flex>
```

### Loading State (Native)
```jsx
// Built-in loading with automatic spinner
<Button loading variant="solid">Bookmark</Button>
```

### Loading State (Custom with Spinner)
```jsx
// Custom loading indicator with Spinner component
<Button disabled variant="solid">
  <Spinner loading>
    <BookmarkIcon />
  </Spinner>
  Bookmark
</Button>
```

### Polymorphic Rendering (asChild)
```jsx
// Render as a different element (e.g., anchor tag)
<Button asChild>
  <a href="/profile">Edit profile</a>
</Button>
```

## Notable Features

### Icon Integration
- **Automatic spacing**: Icons nested directly inside buttons receive appropriate gap automatically - no manual spacing required
- **Composition-first**: Icons are simply placed as children, no special icon prop needed
- **Flexible placement**: Icons can be placed before or after text naturally

### Loading State Management
- **Dimension preservation**: Loading state maintains the original button dimensions to prevent layout shift
- **Auto-disable**: Button automatically becomes disabled when `loading={true}`
- **Spinner integration**: Built-in spinner component works seamlessly with buttons
- **Custom loading**: Allows custom loading indicators via `Spinner` component with `loading` prop

### Ghost Variant Behavior
- **Layout alignment**: Uses negative margins to optically align with surrounding text
- **Text-like behavior**: Behaves like text in layout flow rather than a traditional button
- **No chrome**: Completely removes button styling while maintaining button semantics

### Polymorphic Composition
- **asChild pattern**: Allows rendering as any element while inheriting button styling
- **Semantic flexibility**: Can render as links, divs, or custom components
- **Style preservation**: Maintains all button styling regardless of underlying element

### Responsive Design
- **Responsive sizes**: Size prop accepts `Responsive<>` type for breakpoint-based sizing
- **Fluid scaling**: All variants and colors work consistently across all size options

### Theme Integration
- **Color system**: Deeply integrated with Radix Themes color system
- **Margin props**: Supports common margin props from theme system
- **Design tokens**: All styling uses theme tokens for consistency

## Research Notes

### API Design Philosophy
Radix UI Button follows a "composition over configuration" pattern while still providing convenient props for common variations. The component strikes a balance between:
- Native prop support for common patterns (variant, size, color, loading)
- Composition for content (icons, text, custom elements)
- Polymorphic rendering for semantic flexibility

### Variant Strategy
The six variants (classic, solid, soft, surface, outline, ghost) provide a comprehensive hierarchy of visual weight:
1. **Solid**: Highest visual weight - primary actions
2. **Classic**: Traditional button appearance
3. **Soft**: Medium weight - secondary actions
4. **Surface**: Lower weight with subtle background
5. **Outline**: Minimal weight - tertiary actions
6. **Ghost**: No chrome - inline with text content

This creates clear visual hierarchy without requiring additional props or classes.

### Loading State Innovation
The loading implementation is particularly thoughtful:
- Preserves button dimensions to prevent layout shift (common UX issue)
- Auto-disables to prevent double-submission
- Provides both native (`loading` prop) and custom (Spinner component) approaches
- Spinner component works independently, allowing flexible loading patterns

### Accessibility Considerations
- Built on semantic `<button>` element
- Supports all standard HTML button attributes
- Disabled state properly communicated
- Loading state preserves semantics while providing visual feedback
- asChild pattern maintains semantic correctness when rendering as links

### Pattern Completeness
The component provides comprehensive coverage of button use cases:
- ✅ All standard visual variants
- ✅ Complete size system
- ✅ Full color customization
- ✅ Loading states (both automatic and custom)
- ✅ Icon integration with automatic spacing
- ✅ Polymorphic rendering
- ✅ High contrast mode for accessibility
- ✅ Complete radius control

### Comparison Points for Semantic UI
- **Prop-based configuration**: All variations through props, no class-based variants
- **Composition for content**: Icons and text as children rather than dedicated icon props
- **Loading state preservation**: Automatic dimension preservation during loading
- **Ghost variant**: Uses negative margins for optical text alignment
- **asChild pattern**: Polymorphic rendering capability
- **Responsive size system**: Built-in responsive prop type support
- **Theme integration**: Deep integration with design token system
