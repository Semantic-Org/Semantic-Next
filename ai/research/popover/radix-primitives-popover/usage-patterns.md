# Radix UI Primitives - Popover Usage Patterns

## Component URL
https://www.radix-ui.com/primitives/docs/components/popover
Status: ✅ Working

## Documentation Quality
Excellent - Comprehensive documentation with detailed prop tables for each sub-component, accessibility information, keyboard interactions, data attributes, CSS variables, and practical code examples. Well-organized with clear API reference sections.

## Component Definition
- **Core purpose**: A low-level UI primitive that displays rich content in a portal, triggered by a button interaction. Provides maximum flexibility and control for building custom popover implementations.
- **Mental model**: A composable, multi-part component system where Root manages state, Trigger controls activation, Content defines the floating panel, and Portal handles DOM positioning. Designed as an unstyled primitive that provides behavior and accessibility without imposing visual design.
- **Semantic meaning**: Implements the WAI-ARIA Dialog pattern for accessible disclosure of contextual content. Can function as a modal or non-modal interaction depending on configuration.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Content component accepts arbitrary children for flexible text layouts |
| Icon support | ✅ | Can include any React elements including icon components |
| Media support | ✅ | Supports images and other media through children composition |
| Custom content | ✅ | Fully composable - accepts any valid React children in Content component |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled | ✅ | Via `open` and `onOpenChange` props on Root |
| Uncontrolled | ✅ | Via `defaultOpen` prop for internal state management |
| Modal | ✅ | Via `modal` prop (default: false) - controls focus trapping and interaction blocking |
| Non-modal | ✅ | Default behavior - allows interaction with underlying content |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Open/Closed | ✅ | Exposed via `[data-state]` attribute on Trigger and Content ("open" \| "closed") |
| Loading | ❌ | No built-in loading state - must be implemented in consuming code |
| Disabled | ❌ | No explicit disabled state - can be implemented via trigger element |
| Force mount | ✅ | `forceMount` prop on Portal and Content for animation/measurement needs |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ❌ | No built-in sizing - controlled by consumer styles |
| Positioning | ✅ | Comprehensive positioning system: `side` (top/right/bottom/left), `align` (start/center/end), `sideOffset`, `alignOffset` |
| Collision handling | ✅ | `avoidCollisions` (default: true), `collisionBoundary`, `collisionPadding` for viewport/boundary collision detection |
| Arrow support | ✅ | Optional Arrow component with configurable width/height |
| Spacing control | ✅ | `arrowPadding` prop for arrow positioning constraints |
| Animation support | ✅ | CSS variables for transform origin, data attributes for state-based animations |
| Sticky behavior | ✅ | `sticky` prop (default: "partial") for alignment maintenance during scroll |
| Anchor override | ✅ | Separate Anchor component to position content against different element than trigger |

## Code Examples

### Basic Uncontrolled Popover
```jsx
<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Portal>
    <Popover.Content>
      <p>Popover content</p>
      <Popover.Close>Close</Popover.Close>
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
```

### Controlled with Positioning
```jsx
<Popover.Root open={open} onOpenChange={setOpen}>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content
    side="top"
    align="start"
    sideOffset={5}
    avoidCollisions={true}
  >
    Content here
  </Popover.Content>
</Popover.Root>
```

### Modal Mode with Custom Anchor
```jsx
<Popover.Root modal={true}>
  <Popover.Trigger>Trigger</Popover.Trigger>
  <Popover.Anchor asChild>
    <div>Position relative to this</div>
  </Popover.Anchor>
  <Popover.Content>Modal content</Popover.Content>
</Popover.Root>
```

### With Focus Management
```jsx
<Popover.Content
  onOpenAutoFocus={(e) => {
    e.preventDefault();
    // Custom focus logic
  }}
  onCloseAutoFocus={(e) => {
    // Custom return focus
  }}
  onEscapeKeyDown={(e) => {
    // Handle escape
  }}
  onInteractOutside={(e) => {
    // Handle outside interaction
  }}
>
  Content
</Popover.Content>
```

## Notable Features
- **Composable architecture**: Multi-part component system with clear separation of concerns (Root, Trigger, Anchor, Portal, Content, Arrow, Close)
- **asChild pattern**: All sub-components support `asChild` prop for merging with custom elements while preserving functionality
- **Collision-aware positioning**: Automatic boundary detection with configurable collision handling and padding
- **Rich data attributes**: `[data-state]`, `[data-side]`, `[data-align]` enable CSS-based state and position styling
- **CSS variable system**: Exposes `--radix-popover-content-transform-origin`, `--radix-popover-trigger-width`, `--radix-popover-content-available-width/height` for advanced styling
- **Flexible focus management**: Callbacks for auto-focus behavior on open/close with preventable defaults
- **Event interception**: Granular control over escape key, pointer down outside, focus outside, and interact outside events
- **Portal control**: Optional Portal component with customizable container target (defaults to document.body)
- **Hide on detach**: `hideWhenDetached` prop automatically hides content when trigger is obscured
- **Keyboard navigation**: Full keyboard support (Space/Enter to toggle, Tab for focus traversal, Escape to close)
- **Accessibility foundation**: Adheres to WAI-ARIA Dialog pattern with proper ARIA attributes and focus management
- **Lightweight**: 28.73 kB gzipped, tree-shakeable

## Research Notes
- This is a headless/unstyled primitive - zero visual styling provided, maximum flexibility for custom design systems
- The primitive focuses exclusively on behavior, accessibility, and positioning logic
- Clear distinction between modal (focus trapped) and non-modal (interactive background) modes
- Extensive positioning system rivals dedicated positioning libraries (Floating UI, Popper)
- CSS variable exposure enables sophisticated animation patterns based on actual computed position
- The Anchor component is a unique feature allowing positioning relative to elements other than the trigger
- Version 1.1.15 indicates mature, stable API
- Documentation includes accessibility guidance referencing W3C WAI-ARIA specifications
- No opinions on visual design - intentionally delegates all styling to consuming application
- The `sticky` prop with "partial" default is interesting - maintains alignment during scroll but allows repositioning when needed
