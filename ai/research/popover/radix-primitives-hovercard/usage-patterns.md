# Radix UI Primitives - Hover Card Usage Patterns

## Component URL
https://www.radix-ui.com/primitives/docs/components/hover-card
Status: ✅ Working

## Documentation Quality
Excellent - Comprehensive documentation with detailed API reference for all sub-components, accessibility notes, keyboard interactions, data attributes, CSS variables, and code examples. Well-structured with clear technical specifications.

## Component Definition
- **Core purpose**: A low-level UI primitive specifically designed to enable sighted users to preview content available behind a link. Provides hover-triggered contextual previews without requiring navigation.
- **Mental model**: A composable, multi-part hover-triggered disclosure component where Root manages timing and state, Trigger defines the hover target (typically a link), Content contains the preview, and Portal handles positioning. Explicitly designed for visual preview only - ignored by screen readers.
- **Semantic meaning**: Non-semantic preview mechanism for sighted users. Does not convey meaningful information to assistive technologies. Implements hover-based progressive disclosure with configurable timing delays.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Content accepts arbitrary children for flexible text layouts |
| Icon support | ✅ | Can include any React elements including icons |
| Media support | ✅ | Commonly used with images for link previews |
| Custom content | ✅ | Fully composable - accepts any valid React children |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled | ✅ | Via `open` and `onOpenChange` props on Root |
| Uncontrolled | ✅ | Via `defaultOpen` prop for internal state management |
| Hover-triggered | ✅ | Primary interaction model - opens on pointer enter, closes on pointer leave |
| Focus-triggered | ✅ | Also opens on keyboard focus (Tab), closes on blur |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Open/Closed | ✅ | Exposed via `[data-state]` attribute on Trigger and Content ("open" \| "closed") |
| Loading | ❌ | No built-in loading state |
| Disabled | ❌ | No explicit disabled state |
| Timing delays | ✅ | `openDelay` (default: 700ms) and `closeDelay` (default: 300ms) on Root |
| Force mount | ✅ | `forceMount` prop on Portal and Content for animation/measurement needs |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ❌ | No built-in sizing - controlled by consumer styles |
| Positioning | ✅ | Comprehensive system: `side` (top/right/bottom/left, default: "bottom"), `align` (start/center/end, default: "center"), `sideOffset` (default: 0), `alignOffset` |
| Collision handling | ✅ | `avoidCollisions` (default: true), `collisionBoundary`, `collisionPadding` for viewport/boundary detection |
| Arrow support | ✅ | Optional Arrow component with configurable width (default: 10) and height (default: 5) |
| Spacing control | ✅ | `arrowPadding` for arrow positioning constraints |
| Animation support | ✅ | CSS variables for transform origin, data attributes for state-based animations |
| Sticky behavior | ✅ | `sticky` prop (default: "partial") for alignment maintenance during scroll |
| Hide on detach | ✅ | `hideWhenDetached` prop to hide content when trigger is obscured |

## Code Examples

### Basic Hover Card
```jsx
<HoverCard.Root>
  <HoverCard.Trigger asChild>
    <a href="https://twitter.com/radix_ui">@radix_ui</a>
  </HoverCard.Trigger>
  <HoverCard.Portal>
    <HoverCard.Content>
      <p>Radix UI preview content</p>
      <HoverCard.Arrow />
    </HoverCard.Content>
  </HoverCard.Portal>
</HoverCard.Root>
```

### Controlled with Custom Delays
```jsx
<HoverCard.Root
  open={open}
  onOpenChange={setOpen}
  openDelay={500}
  closeDelay={200}
>
  <HoverCard.Trigger asChild>
    <a href="/profile">User Profile</a>
  </HoverCard.Trigger>
  <HoverCard.Content>
    Preview content
  </HoverCard.Content>
</HoverCard.Root>
```

### With Positioning and Collision Handling
```jsx
<HoverCard.Content
  side="top"
  align="start"
  sideOffset={10}
  avoidCollisions={true}
  collisionPadding={20}
  hideWhenDetached={true}
>
  <img src="avatar.jpg" />
  <div>User details</div>
  <HoverCard.Arrow />
</HoverCard.Content>
```

### Custom Portal Container
```jsx
<HoverCard.Portal container={customContainer} forceMount={shouldMount}>
  <HoverCard.Content>
    Content rendered in custom container
  </HoverCard.Content>
</HoverCard.Portal>
```

## Notable Features
- **Purpose-specific design**: Explicitly designed for link previews, not general tooltips or popovers
- **Accessibility-aware**: Deliberately hidden from screen readers (not a semantic disclosure mechanism)
- **Timing control**: Configurable open and close delays (defaults: 700ms open, 300ms close) prevent flickering
- **Dual interaction model**: Responds to both hover (pointer) and keyboard focus (Tab) for inclusive interaction
- **Composable architecture**: Multi-part system (Root, Trigger, Portal, Content, Arrow) with clear separation of concerns
- **asChild pattern**: Trigger supports `asChild` to merge with existing link elements without wrapper divs
- **Rich data attributes**: `[data-state]`, `[data-side]`, `[data-align]` enable state and position-based styling
- **CSS variable system**: Exposes `--radix-hover-card-content-transform-origin`, `--radix-hover-card-trigger-width/height`, `--radix-hover-card-content-available-width/height`
- **Collision-aware positioning**: Automatic boundary detection with smart repositioning
- **Portal control**: Optional Portal with customizable container (defaults to document.body)
- **Keyboard navigation**: Tab to open/close, Enter to activate underlying link
- **State synchronization**: Open state accessible via data attributes for coordinated UI updates
- **Performance-oriented**: CSS variables enable GPU-accelerated animations based on actual computed position

## Research Notes
- This is a headless/unstyled primitive - provides behavior and accessibility without visual styling
- Distinct from Popover and Tooltip - specifically designed for link preview use cases
- The long default open delay (700ms) prevents accidental triggers during cursor movement
- Shorter close delay (300ms) allows users to move pointer to content without it disappearing
- Explicitly not for screen readers - different from tooltip which should be accessible
- The `asChild` pattern on Trigger is crucial - allows merging with semantic `<a>` elements
- CSS variable exposure enables sophisticated entry/exit animations based on card position
- No modal mode (unlike Popover) - always allows interaction with page content
- Sticky positioning with "partial" default balances stability with repositioning flexibility
- `hideWhenDetached` is useful for scrolling scenarios where trigger moves out of view
- The component doesn't enforce content structure - consumer decides what constitutes a "preview"
- Version-stable API (similar to Popover, suggests mature Radix Primitives ecosystem)
- Documentation emphasizes the "for sighted users" aspect - clear about accessibility limitations
- Timing delays are not just UX polish - they're essential for preventing hover card fatigue
