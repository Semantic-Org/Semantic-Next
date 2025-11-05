# Radix UI - Progress Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.radix-ui.com/themes/docs/components/progress
Status: ✅ Working (Themes version preferred)
Alternative: https://www.radix-ui.com/primitives/docs/components/progress ✅ Working (Primitives/underlying API)
Version: Current (Radix Themes + Primitives integration)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Themes documentation provides design-focused guidance with visual variants and theming options. Primitives documentation provides technical implementation details and accessibility compliance information.

## Component Definition
- **Core purpose**: Displays a visual indicator of task completion or ongoing work progress. Shows both determined (percentage-based) and indeterminate (duration-based) progress states.
- **Mental model**: Users think of progress as a bar-based visualization that communicates work completion status. Can represent exact progress (0-100%) or estimated duration for operations with unknown completion time.
- **Semantic meaning**: Communicates system state and user expectations about task duration. Provides visual feedback that distinguishes between "work is happening" (indeterminate) and "here's how far we are" (determined).

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text/Label overlay | ✅ | Composed | Can add text or percentage labels as children/siblings, styled independently |
| Percentage display | ✅ | Composed | Custom rendering alongside progress: `{value}%` managed externally |
| Multiple indicators | ✅ | Composed | Multiple Progress components can be stacked or arranged as needed |
| Custom content | ✅ | Composed | Any content can be overlaid, typically positioned absolutely over the bar |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | Default horizontal progress bar layout |
| Circular/Radial | ❌ | Not supported | Not included in Radix UI Progress - would require custom CSS implementation |
| Dashboard/Arc | ❌ | Not supported | Use custom SVG or third-party components for arc-based progress |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Determined/Complete | ✅ | Native | `value` prop (0-100) shows exact progress percentage |
| Indeterminate | ✅ | Native | Omit `value` or use `duration` prop to show approximate timing of unknown-length tasks |
| Duration-based | ✅ | Native | `duration` prop (e.g., "30s") shows estimated completion time with animation |
| Complete state | ✅ | Native | When `value` reaches `max`, data attribute `[data-state]="complete"` applies |
| Loading state | ✅ | Native | Data attributes `[data-state]="loading"` when value < max |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="1" \| "2" \| "3"` - Three responsive size options, default "2" |
| Color options | ✅ | Native | `color` prop accepts theme colors (indigo, cyan, orange, crimson, gray, etc.) |
| Variant options | ✅ | Native | `variant="classic" \| "surface" \| "soft"` - Three visual style variants |
| Radius options | ✅ | Native | `radius="none" \| "small" \| "medium" \| "large" \| "full"` - Full border-radius control |
| High contrast | ✅ | Native | `highContrast` boolean prop enhances color distinction against backgrounds |
| Animation duration | ✅ | Native | `duration` prop specifies animation timing (e.g., "30s") for indeterminate states |
| Value precision | ✅ | Native | Numeric `value` prop (0-100 range) for exact progress representation |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA role | ✅ | Native | Automatic `role="progressbar"` with proper ARIA attributes |
| Value labeling | ✅ | Native | `getValueLabel` function customizes accessible label for screen readers |
| State communication | ✅ | Native | Data attributes and ARIA automatically communicate progress state to assistive tech |
| Data attributes | ✅ | Native | `[data-state]`, `[data-value]`, `[data-max]` for styling and scripting |

## Code Examples

### Basic Determined Progress (Themes API)
```jsx
// Simple progress bar with 75% completion
<Progress value={75} />

// With color and styling
<Progress
  value={75}
  color="indigo"
  variant="soft"
  radius="full"
/>
```

### Indeterminate Progress
```jsx
// Show ongoing work with estimated duration
<Progress duration="30s" />

// Duration prop shows approximate timing, then starts indeterminate animation
```

### Full-Featured Example (Themes)
```jsx
// Complete progress implementation with size, color, and styling
<Progress
  value={50}
  size="2"
  color="indigo"
  variant="soft"
  radius="full"
/>
```

### Primitives Implementation (Lower-level API)
```jsx
// Compound component structure for more control
<Progress.Root value={65} max={100}>
  <Progress.Indicator />
</Progress.Root>

// With custom label and data attributes
<Progress.Root value={65} max={100} getValueLabel={({ value, max }) => `${value} of ${max}`}>
  <Progress.Indicator style={{ transform: `translateX(${-100 + (value/max) * 100}%)` }} />
</Progress.Root>
```

### Size Variants
```jsx
<Stack gap="3">
  <Progress size="1" value={33} />
  <Progress size="2" value={50} />
  <Progress size="3" value={75} />
</Stack>
```

### Style Variants
```jsx
<Stack gap="3">
  <Progress value={50} variant="classic" />
  <Progress value={50} variant="surface" />
  <Progress value={50} variant="soft" />
</Stack>
```

### Color Customization
```jsx
<Stack gap="3">
  <Progress value={25} color="gray" variant="soft" />
  <Progress value={50} color="cyan" variant="soft" />
  <Progress value={75} color="orange" variant="soft" />
  <Progress value={100} color="green" variant="soft" />
</Stack>
```

### Radius Options
```jsx
<Stack gap="3">
  <Progress value={50} radius="none" />
  <Progress value={50} radius="small" />
  <Progress value={50} radius="large" />
  <Progress value={50} radius="full" />
</Stack>
```

### With Percentage Label
```jsx
<Box position="relative" width="100%">
  <Progress value={65} variant="soft" />
  <Text position="absolute" right="4" top="1" size="1">
    {65}%
  </Text>
</Box>
```

## Notable Features

### Determined vs Indeterminate Modes
- **Determined**: Use `value` prop for exact progress (0-100%)
- **Indeterminate**: Use `duration` prop for estimated timing of operations with unknown duration
- **Smart behavior**: Once duration expires, progress automatically transitions to indeterminate animation

### Visual Hierarchy Through Variants
Three design variants provide different visual weights:
1. **Classic**: Traditional progress bar appearance
2. **Surface**: Subtle styling with background context
3. **Soft**: Light, modern appearance with soft colors

### Size System
- Three sizes (1, 2, 3) provide responsive scaling
- Default size "2" works for most contexts
- Size 1 for compact layouts, Size 3 for prominent displays

### Color Integration
- Full integration with Radix Themes color system
- Supports all theme colors: indigo, cyan, orange, crimson, gray, plus others
- Color communicates semantic meaning (success, warning, error) through variant pairing

### Accessibility Excellence
- W3C progressbar role compliance (Primitives)
- Automatic ARIA attributes without configuration
- Custom label formatting via `getValueLabel`
- Assistive technology-friendly state communication

### Animation Handling
- Smooth cubic-bezier transitions for value changes
- Indeterminate animation when duration expires
- No layout shift during animation (uses transform-based animations)
- Duration prop controls timing for approximate task length

### Radius Control
- From sharp corners (none) to fully rounded (full)
- Medium (default) provides good balance
- Radius "full" common for modern, polished appearance

## Primitives API Details (Lower-level)

### Root Element Props
- `value` (number | null): Current progress value
- `max` (number): Maximum progress value
- `asChild` (boolean): Replace with custom element
- `getValueLabel` (function): Custom accessible label formatter

### Indicator Element
- Visual element that fills based on parent progress value
- Typically styled with `overflow: hidden` on root
- Indicator uses `translateX()` transforms for smooth animation

### Styling Patterns
- Root uses `overflow: hidden` with border-radius
- Indicator fills 100% height, width driven by value/max ratio
- Transform-based animation prevents reflow: `translateX(calc(-100% + (value/max) * 100%))`
- Data attributes enable CSS-based styling alternatives

## Research Notes

### Framework Philosophy
Radix UI Progress reflects a "simple but complete" philosophy:
- Simple API: Just `value` and `duration` for most cases
- Compound components (Primitives) for advanced control
- Themes API for design-system integrated styling
- Composition for custom layout or overlaid content

### Determined vs Indeterminate Design Decision
- **Determined**: Use when you can measure exact progress (file uploads, multi-step forms)
- **Indeterminate**: Use when duration is approximate (API calls, processing tasks)
- **Accessibility advantage**: Even indeterminate states show some visual feedback (unlike spinners)

### Styling Approach
- CSS custom properties for theming
- Data attributes (`[data-state]`, `[data-value]`) for conditional styling
- No shadow DOM - fully styleable from outside
- Can combine with theme color system for semantic meaning

### Transform-Based Animation Strategy
- Uses `translateX()` instead of width animation to avoid reflow
- More performant than width or scaleX transformations
- Smooth cubic-bezier easing built in
- Completes instantly or with specified duration

### Accessibility Strengths
- Automatic role="progressbar" without configuration
- Built-in ARIA attributes updated as value changes
- `getValueLabel` enables custom accessible text
- Data attributes support both CSS and script-based styling
- Assistive technology fully aware of progress state changes

### Component Completeness
- ✅ Determined progress (exact percentage)
- ✅ Indeterminate progress (estimated duration)
- ✅ Complete state detection
- ✅ Full color customization via theme system
- ✅ Three size options
- ✅ Three visual variants
- ✅ Radius control
- ✅ High contrast mode
- ✅ Accessibility compliance (W3C)
- ❌ No circular/radial variants (intentional simplification)
- ❌ No segmented/step indicators

### Comparison Points for Semantic UI
- **Simplicity**: Only two main modes (determined/indeterminate) vs complex state trees
- **Animation strategy**: Transform-based instead of width-based
- **Compound structure**: Primitives provide fine control; Themes provide defaults
- **Accessibility-first**: ARIA built in, not an afterthought
- **Color system**: Deep integration with design tokens
- **Data attributes**: Strategic use for styling hooks
- **No max prop in Themes**: Simplified to 0-100 range
- **Duration animations**: Automatic transition to indeterminate after duration expires

### Layout Impact
- No dimension shift during animation (transform-based)
- Smooth transitions prevent jarring visual changes
- Can be used in tight layouts without layout thrashing
- Responsive sizing through size prop, not media queries
