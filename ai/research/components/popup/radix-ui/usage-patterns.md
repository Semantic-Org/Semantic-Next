# Radix UI - Popover Usage Patterns

## Component URL
https://www.radix-ui.com/themes/docs/components/popover
https://www.radix-ui.com/primitives/docs/components/popover
Status: ✅ Working

## Documentation Quality
Excellent - Comprehensive documentation with both high-level Themes API and low-level Primitives API. Interactive examples, complete API reference, accessibility guidance, and clear code examples. Well-organized with visual demonstrations.

## Component Definition
- **Core purpose**: A floating element for displaying rich content, triggered by a user action (typically clicking a button). Provides contextual information, forms, or interactive content without navigating away from the current view.
- **Mental model**: A non-modal overlay that appears near a trigger element, containing rich interactive content. Unlike tooltips (which show simple text on hover), popovers are click-activated and support complex content including forms, images, and multiple interactive elements.
- **Semantic meaning**: Provides supplementary, contextual content related to the trigger element. The content is important but not critical to the primary task flow. Follows WAI-ARIA dialog pattern for accessibility.

## Trigger Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Click activation | ✅ | Primary activation method via `<Popover.Trigger>` |
| Button trigger | ✅ | Typically wraps a Button component with icon and label |
| Custom trigger | ✅ | Supports `asChild` prop to compose with any element |
| Anchor positioning | ✅ | Optional `<Popover.Anchor>` for positioning reference separate from trigger |
| Controlled state | ✅ | `open` and `onOpenChange` props for external control |
| Uncontrolled state | ✅ | `defaultOpen` prop for internal state management |
| Data attributes | ✅ | `[data-state]` on Trigger ("open" \| "closed") for styling |

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Full Text, Heading, and paragraph support |
| Icon support | ✅ | Icons shown in examples (ChatBubbleIcon, Share2Icon, Link1Icon) |
| Media support | ✅ | Images with `<Inset>` component for flush alignment |
| Form elements | ✅ | TextArea, Checkbox, and input elements supported |
| Interactive elements | ✅ | Buttons, checkboxes, and other controls within content |
| Avatar support | ✅ | Avatar component shown in comment pattern |
| Flex layouts | ✅ | Flex-based content arrangement with gap and alignment |
| Grid layouts | ✅ | Grid layouts for columnar content (image + text pattern) |
| Nested components | ✅ | Full Radix Themes component ecosystem available |
| Inset content | ✅ | `<Inset>` component for edge-aligned content |
| Custom content | ✅ | Arbitrary React components and HTML |
| Portal rendering | ✅ | `<Popover.Portal>` for body-level rendering |

## Positioning Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Side placement | ✅ | `side` prop: "top" \| "right" \| "bottom" (default) \| "left" |
| Alignment | ✅ | `align` prop: "start" \| "center" (default) \| "end" |
| Side offset | ✅ | `sideOffset` number prop (default: 0) - distance from trigger |
| Align offset | ✅ | `alignOffset` number prop (default: 0) - alignment adjustment |
| Collision detection | ✅ | `avoidCollisions` boolean (default: true) |
| Collision boundary | ✅ | `collisionBoundary` prop for custom boundaries |
| Collision padding | ✅ | `collisionPadding` number or Padding object (default: 0) |
| Arrow element | ✅ | `<Popover.Arrow>` component with width/height props |
| Arrow padding | ✅ | `arrowPadding` number prop (default: 0) |
| Sticky positioning | ✅ | `sticky` prop (default: "partial") |
| Hide when detached | ✅ | `hideWhenDetached` boolean (default: false) |
| Transform origin | ✅ | CSS variable `--radix-popover-content-transform-origin` |
| Available space | ✅ | CSS variables for available width/height |
| Trigger dimensions | ✅ | CSS variables for trigger width/height |

## Behavior Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Click to open | ✅ | Trigger click opens popover |
| Click to close | ✅ | `<Popover.Close>` wrapper for close buttons |
| Outside click dismiss | ✅ | `onPointerDownOutside` and `onInteractOutside` handlers |
| Escape key dismiss | ✅ | `onEscapeKeyDown` handler, closes on Esc key |
| Focus outside dismiss | ✅ | `onFocusOutside` handler |
| Modal mode | ✅ | `modal` boolean prop (default: false) |
| Auto focus on open | ✅ | `onOpenAutoFocus` callback for focus management |
| Auto focus on close | ✅ | `onCloseAutoFocus` callback, returns focus to trigger |
| Force mount | ✅ | `forceMount` prop for animation control |
| Data attributes | ✅ | `[data-state]`, `[data-side]`, `[data-align]` for styling/animation |
| Custom portal container | ✅ | Portal `container` prop (default: document.body) |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Keyboard navigation | ✅ | Space/Enter to open, Esc to close, Tab/Shift+Tab for focus |
| Mouse interaction | ✅ | Click-based activation and dismissal |
| Focus management | ✅ | Automatic focus trap in modal mode, managed focus in non-modal |
| Focus return | ✅ | Returns focus to trigger on close |
| Nested interactivity | ✅ | Buttons, forms, checkboxes within content |
| Event callbacks | ✅ | Multiple event handlers for interaction points |
| Controlled focus | ✅ | Custom focus handling via callbacks |
| ARIA compliance | ✅ | Follows WAI-ARIA dialog pattern |
| Screen reader support | ✅ | Proper ARIA attributes and focus management |

## Size & Dimension Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size variants | ✅ | `size` prop: "1" \| "2" (default) \| "3" \| "4" - controls padding and border-radius |
| Fixed width | ✅ | `width` responsive string prop |
| Min width | ✅ | `minWidth` responsive string constraint |
| Max width | ✅ | `maxWidth` responsive string constraint (default: "480px") |
| Fixed height | ✅ | `height` responsive string prop |
| Min height | ✅ | `minHeight` responsive string constraint |
| Max height | ✅ | `maxHeight` responsive string constraint |
| Responsive sizing | ✅ | All dimension props support responsive values |
| Content-based sizing | ✅ | Dimensions adapt to content when not specified |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Open/closed state | ✅ | Controlled via `open` prop or uncontrolled via `defaultOpen` |
| Loading state | ❌ | Not documented |
| Disabled state | ❌ | No disabled prop on Root (can disable Trigger) |
| Error state | ❌ | Not documented as built-in feature |
| Data attributes | ✅ | `[data-state]` for open/closed styling |

## Code Examples

### Basic Comment Pattern
```jsx
<Popover.Root>
  <Popover.Trigger>
    <Button variant="soft">
      <ChatBubbleIcon width="16" height="16" />
      Comment
    </Button>
  </Popover.Trigger>
  <Popover.Content width="360px">
    <Flex gap="3">
      <Avatar
        size="2"
        src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
        fallback="A"
        radius="full"
      />
      <Box flexGrow="1">
        <TextArea placeholder="Write a comment…" style={{ height: 80 }} />
        <Flex gap="3" mt="3" justify="between">
          <Flex align="center" gap="2" asChild>
            <Text as="label" size="2">
              <Checkbox />
              <Text>Send to group</Text>
            </Text>
          </Flex>
          <Popover.Close>
            <Button size="1">Comment</Button>
          </Popover.Close>
        </Flex>
      </Box>
    </Flex>
  </Popover.Content>
</Popover.Root>
```

### Inset Image Share Pattern
```jsx
<Popover.Root>
  <Popover.Trigger>
    <Button variant="soft">
      <Share2Icon width="16" height="16" />
      Share image
    </Button>
  </Popover.Trigger>
  <Popover.Content width="360px">
    <Grid columns="130px 1fr">
      <Inset side="left" pr="current">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?&auto=format&fit=crop&w=400&q=80"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </Inset>
      <div>
        <Heading size="2" mb="1">Share this image</Heading>
        <Text as="p" size="2" mb="4" color="gray">
          Minimalistic 3D rendering wallpaper.
        </Text>
        <Flex direction="column" align="stretch">
          <Popover.Close>
            <Button size="1" variant="soft">
              <Link1Icon width="16" height="16" />
              Copy link
            </Button>
          </Popover.Close>
        </Flex>
      </div>
    </Grid>
  </Popover.Content>
</Popover.Root>
```

### Controlled State Pattern
```jsx
const [open, setOpen] = React.useState(false);

<Popover.Root open={open} onOpenChange={setOpen}>
  <Popover.Trigger>
    <Button>Toggle</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Text>Controlled popover content</Text>
  </Popover.Content>
</Popover.Root>
```

### Positioned with Anchor
```jsx
<Popover.Root>
  <Popover.Anchor asChild>
    <div>Reference element</div>
  </Popover.Anchor>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content side="top" align="start" sideOffset={5}>
    <Text>Positioned relative to anchor</Text>
  </Popover.Content>
</Popover.Root>
```

### With Arrow and Advanced Positioning
```jsx
<Popover.Root>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content
    side="right"
    align="center"
    sideOffset={10}
    collisionPadding={20}
    avoidCollisions={true}
  >
    <Popover.Arrow />
    <Text>Content with arrow</Text>
  </Popover.Content>
</Popover.Root>
```

### With Portal and Custom Container
```jsx
<Popover.Root>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Portal container={customContainerRef.current}>
    <Popover.Content>
      <Text>Rendered in custom container</Text>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
```

### With Custom Event Handlers
```jsx
<Popover.Root modal={true}>
  <Popover.Trigger>
    <Button>Open Modal Popover</Button>
  </Popover.Trigger>
  <Popover.Content
    onOpenAutoFocus={(e) => {
      e.preventDefault();
      // Custom focus logic
    }}
    onCloseAutoFocus={(e) => {
      // Handle focus return
    }}
    onEscapeKeyDown={(e) => {
      // Handle escape key
    }}
    onPointerDownOutside={(e) => {
      // Handle outside clicks
    }}
    onInteractOutside={(e) => {
      // Handle any outside interaction
    }}
  >
    <Text>Modal popover with event handlers</Text>
  </Popover.Content>
</Popover.Root>
```

## Notable Features
- **Dual API approach**: High-level Radix Themes API for styled components, low-level Primitives API for full control
- **Comprehensive positioning**: Extensive placement, alignment, and collision detection options
- **Rich content support**: Forms, images, interactive elements, complex layouts
- **Flexible triggering**: Supports custom triggers via `asChild`, separate anchor positioning
- **Advanced focus management**: Modal and non-modal modes with customizable focus behavior
- **Animation-friendly**: CSS variables for transform origin, data attributes for transitions
- **Collision handling**: Automatic collision detection with customizable boundaries and padding
- **Portal flexibility**: Custom container support for advanced use cases
- **Event-driven API**: Comprehensive callbacks for all interaction points
- **Accessibility first**: WAI-ARIA compliant with keyboard navigation and screen reader support
- **Responsive design**: All dimension props support responsive values
- **Inset system**: Special component for flush edge alignment with images/media
- **Component composition**: Integrates seamlessly with entire Radix Themes ecosystem
- **Data attributes**: Exposed state attributes for custom styling and animations
- **Size system**: Consistent numeric sizing (1-4) across Radix Themes
- **AsChild pattern**: Polymorphic composition via `asChild` prop on all major parts
- **Force mount option**: Enables custom animation/transition control

## Research Notes
- Documentation is exceptionally comprehensive with both conceptual and API reference
- Component is built on battle-tested Radix Primitives with years of production use
- Clear separation between styled Themes version and unstyled Primitives version
- Emphasis on accessibility and keyboard navigation from the ground up
- Very flexible positioning system with collision detection and boundary awareness
- Modal vs non-modal modes provide different UX patterns for different use cases
- The `asChild` pattern is used consistently throughout for composition
- Event callbacks provide fine-grained control over all interaction points
- Portal rendering with custom container is more advanced than many implementations
- CSS variables enable animation without JavaScript
- Data attributes provide styling hooks for all states
- The Arrow component is optional but well-integrated when needed
- Inset component pattern is unique and elegant for media-rich popovers
- Package size is reasonable (28.73 kB gzipped) considering feature richness
- Version 1.1.15 indicates mature, stable API
- No built-in loading or error states - expected to be composed in by consumers
- Responsive sizing is deeply integrated throughout the API
