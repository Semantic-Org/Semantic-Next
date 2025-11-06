# Chakra UI - Popover Component

## Component Overview

The Chakra UI Popover component displays contextual information or interactive content inside a floating overlay element anchored to a trigger. Built on Ark UI's popover primitive, it provides a rich composition-based API for displaying detailed information, forms, menus, or complex interactive content that requires user action.

**Core purpose**: Displays rich, interactive content in a floating overlay that appears on user interaction (click, hover, or focus). Unlike tooltips, popovers are designed for complex content that requires user interaction, such as forms, menus, detailed information panels, or action lists.

**Architecture**: A composition-based system where `Popover.Root` manages state and wraps trigger and content elements. The component uses Portal rendering by default for proper z-index layering (z-index: 1500). Sub-components include `Trigger`, `Positioner`, `Content`, `Arrow`, `ArrowTip`, `Header`, `Body`, `Footer`, and `CloseTrigger` for fine-grained structural control.

**Common use cases**: Action menus, user profile cards, contextual settings panels, inline form editing, color pickers, date pickers, search interfaces, help documentation, confirmation dialogs, detailed status information, and rich content previews.

## Usage Patterns

### Basic Usage

The simplest Popover implementation requires wrapping a trigger element and content within the Popover component structure:

```jsx
import { Popover, Button } from "@chakra-ui/react"

// Basic popover with click trigger
<Popover.Root>
  <Popover.Trigger asChild>
    <Button variant="outline" size="sm">
      Open Popover
    </Button>
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      <Popover.Arrow>
        <Popover.ArrowTip />
      </Popover.Arrow>
      <Popover.Body>
        <Text>This is the popover content</Text>
      </Popover.Body>
    </Popover.Content>
  </Popover.Positioner>
</Popover.Root>

// Popover with header and footer
<Popover.Root>
  <Popover.Trigger asChild>
    <Button>Settings</Button>
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      <Popover.Header>
        <Heading size="sm">Settings</Heading>
      </Popover.Header>
      <Popover.Body>
        <Text>Configure your preferences here</Text>
      </Popover.Body>
      <Popover.Footer>
        <Button size="sm">Save</Button>
      </Popover.Footer>
    </Popover.Content>
  </Popover.Positioner>
</Popover.Root>
```

### Variants/Styles

Chakra UI Popover supports extensive visual customization through props and composition:

**Arrow Display** (`Popover.Arrow` component):
- Optional visual arrow pointing to trigger element
- Arrow automatically adjusts direction based on placement
- Uses `Popover.Arrow` wrapper with `Popover.ArrowTip` child
- Customizable size, color, and shadow
- Example:
```jsx
<Popover.Arrow>
  <Popover.ArrowTip />
</Popover.Arrow>
```

**Portal Rendering** (default behavior):
- Renders content in Portal outside normal DOM flow by default
- Uses popover z-index layer (1500) for proper stacking
- Prevents overflow and clipping issues
- Ensures visibility above most UI elements
- Can be disabled by not using Portal or using custom container

**Background and Border Styling**:
- Default: Panel background color (`--popover-bg`)
- Border radius: L3 radius tokens (rounded corners)
- Shadow: Elevation shadow (lg shadow by default)
- Fully customizable via Chakra style props
- Example:
```jsx
<Popover.Content bg="gray.800" borderColor="gray.600" shadow="xl">
  {/* content */}
</Popover.Content>
```

**Size Control**:
- Content width controlled via `maxW`, `minW`, or `width` props
- Default: Auto-width based on content
- Common constraint: `maxW="sm"` or `maxW="md"`
- Example:
```jsx
<Popover.Content maxW="md" width="400px">
  {/* content */}
</Popover.Content>
```

**Color Palette Integration**:
- Supports Chakra color palette tokens
- Semantic colors available (success, error, warning, info)
- Focus ring colors palette-specific
- Example:
```jsx
<Popover.Content colorPalette="blue">
  {/* content */}
</Popover.Content>
```

### States

**Closed State** (Default):
- Popover content hidden
- Trigger element visible and interactive
- No Portal content rendered
- No event listeners for close detection

**Open State**:
- Triggered by click, programmatic control, or keyboard interaction
- Content rendered in Portal with positioning
- Arrow (if enabled) points toward trigger
- Animated entrance based on placement direction
- Click-outside and Esc key listeners active
- Dismissible by default

**Controlled State**:
- Use `open` and `onOpenChange` props for full control
- Enables programmatic visibility management
- Useful for complex interactions, wizards, or guided tours
- Example:
```jsx
<Popover.Root open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
  {/* content */}
</Popover.Root>
```

**Uncontrolled State** (Default):
- Popover manages its own open/closed state internally
- Use `defaultOpen` prop for initial state
- Example:
```jsx
<Popover.Root defaultOpen={true}>
  {/* opens by default */}
</Popover.Root>
```

**Lazy Mounting**:
- Use `lazyMount` to defer mounting content until first open
- Use `unmountOnExit` to remove content from DOM when closed
- Performance optimization for complex content
- Example:
```jsx
<Popover.Root lazyMount unmountOnExit>
  {/* content only mounted when needed */}
</Popover.Root>
```

**Disabled State**:
- Prevents popover from opening
- Trigger remains visible but non-functional
- Useful for conditional availability
- Example:
```jsx
<Popover.Root disabled={!hasPermission}>
  {/* popover won't open */}
</Popover.Root>
```

**Modal Behavior**:
- `modal` prop creates a modal popover (with backdrop)
- Traps focus within popover content
- Prevents interaction with underlying content
- Requires explicit close action
- Example:
```jsx
<Popover.Root modal>
  {/* modal popover with focus trap */}
</Popover.Root>
```

### Sizing Options

Popover size is controlled through content width and height props:

**Width Control**:
- `maxW`: Maximum width constraint (e.g., "xs", "sm", "md", "lg", "xl", "2xl")
- `minW`: Minimum width constraint
- `width`: Fixed width
- Default: Auto-width based on content
- Example:
```jsx
<Popover.Content maxW="sm" minW="250px">
  {/* constrained width */}
</Popover.Content>
```

**Height Control**:
- `maxH`: Maximum height with scroll
- `minH`: Minimum height
- `height`: Fixed height
- Default: Auto-height based on content
- Example:
```jsx
<Popover.Content maxH="400px" overflowY="auto">
  {/* scrollable content */}
</Popover.Content>
```

**Responsive Sizing**:
- Use responsive array or object syntax
- Example: `maxW={{ base: "full", md: "md" }}`
- Adapts to viewport size
- Mobile: Often full-width or drawer-like
- Desktop: Constrained width with positioning

### Layout & Positioning

**Placement Options** (`positioning.placement` prop):
- `top`, `top-start`, `top-end`
- `bottom`, `bottom-start`, `bottom-end`
- `left`, `left-start`, `left-end`
- `right`, `right-start`, `right-end`
- Default: `bottom`
- Auto-adjusts if space is insufficient (flip behavior)
- Example:
```jsx
<Popover.Root positioning={{ placement: "right-end" }}>
  {/* popover appears at right-end of trigger */}
</Popover.Root>
```

**Offset Control** (`positioning.offset` prop):
- `mainAxis`: Distance along main placement axis (default: 8px)
- `crossAxis`: Distance along cross placement axis
- Fine-tune distance from trigger element
- Example:
```jsx
<Popover.Root positioning={{ offset: { mainAxis: 12, crossAxis: 4 } }}>
  {/* custom offset from trigger */}
</Popover.Root>
```

**Gutter** (`positioning.gutter` prop):
- Minimum distance from viewport edges
- Prevents popover from touching screen edges
- Default: 8px
- Example:
```jsx
<Popover.Root positioning={{ gutter: 16 }}>
  {/* 16px minimum from viewport edges */}
</Popover.Root>
```

**Flip Behavior** (`positioning.flip` prop):
- Automatically flips placement if insufficient space
- Default: `true`
- Prevents content clipping
- Example:
```jsx
<Popover.Root positioning={{ flip: false }}>
  {/* no auto-flip, may clip */}
</Popover.Root>
```

**Slide Behavior** (`positioning.slide` prop):
- Slides along axis if insufficient space
- Default: `true`
- Keeps popover visible within viewport
- Example:
```jsx
<Popover.Root positioning={{ slide: true }}>
  {/* slides to stay visible */}
</Popover.Root>
```

**Same Width** (`positioning.sameWidth` prop):
- Makes popover width match trigger width
- Useful for dropdowns and select-like interfaces
- Example:
```jsx
<Popover.Root positioning={{ sameWidth: true }}>
  {/* popover width matches trigger */}
</Popover.Root>
```

**Strategy** (`positioning.strategy` prop):
- `"absolute"` (default): Absolute positioning
- `"fixed"`: Fixed positioning
- Affects how popover positions relative to viewport
- Example:
```jsx
<Popover.Root positioning={{ strategy: "fixed" }}>
  {/* fixed positioning */}
</Popover.Root>
```

### Content & Structure

**Header Section** (`Popover.Header`):
- Optional header for titles or contextual information
- Typically contains heading or title text
- Visually separated from body content
- Example:
```jsx
<Popover.Header>
  <Heading size="sm">Settings</Heading>
</Popover.Header>
```

**Body Section** (`Popover.Body`):
- Main content area for popover
- Can contain text, forms, lists, or complex components
- Scrollable if `maxH` is set on Content
- Example:
```jsx
<Popover.Body>
  <Stack spacing={3}>
    <Text>Configuration options</Text>
    <Input placeholder="Enter value" />
  </Stack>
</Popover.Body>
```

**Footer Section** (`Popover.Footer`):
- Optional footer for actions or additional information
- Typically contains buttons or action links
- Visually separated from body content
- Example:
```jsx
<Popover.Footer>
  <Button size="sm">Save Changes</Button>
  <Button size="sm" variant="ghost">Cancel</Button>
</Popover.Footer>
```

**Close Button** (`Popover.CloseTrigger`):
- Explicit close button component
- Usually positioned in header or footer
- Provides accessible close action
- Example:
```jsx
<Popover.Header>
  <Heading size="sm">Title</Heading>
  <Popover.CloseTrigger asChild>
    <IconButton size="sm" variant="ghost" aria-label="Close">
      <X />
    </IconButton>
  </Popover.CloseTrigger>
</Popover.Header>
```

**Sub-component Hierarchy**:
```
Popover.Root (state management)
├── Popover.Trigger (trigger element wrapper)
└── Popover.Positioner (positioning logic)
    └── Popover.Content (content container)
        ├── Popover.Arrow (optional)
        │   └── Popover.ArrowTip (arrow styling)
        ├── Popover.Header (optional)
        │   └── Popover.CloseTrigger (optional)
        ├── Popover.Body (main content)
        └── Popover.Footer (optional)
```

### Interactive Features

**Click Trigger** (Default):
- Opens on trigger element click
- Closes on click outside, Esc key, or close button
- Most common interaction pattern
- Example:
```jsx
<Popover.Trigger asChild>
  <Button>Click to open</Button>
</Popover.Trigger>
```

**Hover Trigger** (`openOnHover` prop):
- Opens on mouse enter
- Closes on mouse leave
- Configurable delays
- Less common for popovers (more common for hover cards)
- Example:
```jsx
<Popover.Root openOnHover openDelay={200} closeDelay={100}>
  {/* opens on hover */}
</Popover.Root>
```

**Focus Trigger**:
- Opens when trigger receives keyboard focus
- Part of default accessibility behavior
- Ensures keyboard accessibility
- Can be disabled with `openOnFocus={false}`

**Controlled Display**:
- Use `open` prop for manual control
- Combine with `onOpenChange` for two-way binding
- Enables programmatic popover management
- Example:
```jsx
const [open, setOpen] = useState(false)
return (
  <Popover.Root
    open={open}
    onOpenChange={(details) => setOpen(details.open)}
  >
    {/* controlled popover */}
  </Popover.Root>
)
```

**Close Behavior**:
- `closeOnInteractOutside`: Close when clicking outside (default: true)
- `closeOnEscape`: Close on Esc key press (default: true)
- `closeOnScroll`: Close on scroll (default: true)
- `onInteractOutside`: Callback before closing on outside interaction
- `onEscapeKeyDown`: Callback before closing on Esc key
- Example:
```jsx
<Popover.Root
  closeOnInteractOutside={false}
  closeOnEscape={true}
  onInteractOutside={(event) => {
    // Custom logic before close
    if (hasUnsavedChanges) {
      event.preventDefault()
    }
  }}
>
  {/* custom close behavior */}
</Popover.Root>
```

**Return Focus**:
- Focus returns to trigger on close
- Configurable with `finalFocusEl` prop
- Ensures keyboard navigation continuity
- Important for accessibility

**Auto Focus**:
- `autoFocus`: Focus first focusable element on open
- `initialFocusEl`: Specify element to receive initial focus
- `restoreFocus`: Restore focus on close (default: true)
- Example:
```jsx
<Popover.Root autoFocus initialFocusEl={() => inputRef.current}>
  {/* auto-focus on open */}
</Popover.Root>
```

### Animation & Transitions

**Entrance Animation**:
- Fade-in effect with scale transform
- Directional slide based on placement
- Duration: 300ms (slow) for opening
- CSS cubic-bezier timing function for smooth motion
- Direction-aware: slides from placement direction
- Example placements:
  - `top`: Slides from bottom with fade
  - `bottom`: Slides from top with fade
  - `left`: Slides from right with fade
  - `right`: Slides from left with fade

**Exit Animation**:
- Fade-out with reverse scale
- Duration: 200ms (moderate) for closing
- Matches entrance animation for consistency
- Smooth transition out

**Custom Animations**:
- Customizable via Chakra theme animations
- Can override default animations with CSS
- Transform-origin aware based on placement
- Example:
```jsx
<Popover.Content
  sx={{
    animation: 'customFadeIn 0.3s ease-out',
    '@keyframes customFadeIn': {
      from: { opacity: 0, transform: 'scale(0.95)' },
      to: { opacity: 1, transform: 'scale(1)' }
    }
  }}
>
  {/* custom animation */}
</Popover.Content>
```

**Delay Controls**:
- `openDelay`: Delay before opening (default: 0ms)
- `closeDelay`: Delay before closing (default: 0ms)
- Useful for hover-triggered popovers
- Example:
```jsx
<Popover.Root openDelay={200} closeDelay={100}>
  {/* delayed open/close */}
</Popover.Root>
```

### Integration Patterns

**User Profile Card**:
```jsx
<Popover.Root>
  <Popover.Trigger asChild>
    <Avatar src={user.avatar} name={user.name} />
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content maxW="sm">
      <Popover.Body>
        <Stack spacing={3}>
          <Avatar size="lg" src={user.avatar} name={user.name} />
          <Heading size="sm">{user.name}</Heading>
          <Text fontSize="sm" color="gray.500">{user.email}</Text>
          <Button size="sm">View Profile</Button>
        </Stack>
      </Popover.Body>
    </Popover.Content>
  </Popover.Positioner>
</Popover.Root>
```

**Confirmation Popover**:
```jsx
<Popover.Root>
  <Popover.Trigger asChild>
    <Button colorScheme="red">Delete</Button>
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      <Popover.Header>
        <Heading size="sm">Confirm Deletion</Heading>
      </Popover.Header>
      <Popover.Body>
        <Text>Are you sure you want to delete this item?</Text>
      </Popover.Body>
      <Popover.Footer>
        <Button colorScheme="red" size="sm">Delete</Button>
        <Popover.CloseTrigger asChild>
          <Button variant="ghost" size="sm">Cancel</Button>
        </Popover.CloseTrigger>
      </Popover.Footer>
    </Popover.Content>
  </Popover.Positioner>
</Popover.Root>
```

**Form in Popover**:
```jsx
<Popover.Root>
  <Popover.Trigger asChild>
    <Button>Edit Details</Button>
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content maxW="md">
      <Popover.Header>
        <Heading size="sm">Edit Information</Heading>
      </Popover.Header>
      <Popover.Body>
        <Stack spacing={3}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Enter name" />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="Enter email" />
          </FormControl>
        </Stack>
      </Popover.Body>
      <Popover.Footer>
        <Button size="sm">Save</Button>
        <Popover.CloseTrigger asChild>
          <Button variant="ghost" size="sm">Cancel</Button>
        </Popover.CloseTrigger>
      </Popover.Footer>
    </Popover.Content>
  </Popover.Positioner>
</Popover.Root>
```

**Color Picker Popover**:
```jsx
<Popover.Root>
  <Popover.Trigger asChild>
    <Button
      leftIcon={<Box w={4} h={4} bg={selectedColor} borderRadius="sm" />}
    >
      Choose Color
    </Button>
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      <Popover.Body>
        <SimpleGrid columns={5} spacing={2}>
          {colors.map(color => (
            <Box
              key={color}
              w={8}
              h={8}
              bg={color}
              borderRadius="sm"
              cursor="pointer"
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </SimpleGrid>
      </Popover.Body>
    </Popover.Content>
  </Popover.Positioner>
</Popover.Root>
```

### Accessibility Features

**ARIA Attributes**:
- `role="dialog"` or `role="menu"` automatically applied to content
- `aria-labelledby`: Links header to content for screen readers
- `aria-describedby`: Links description to content
- `aria-haspopup`: Applied to trigger element
- `aria-expanded`: Indicates open/closed state on trigger
- `aria-controls`: Links trigger to content ID
- Proper ID management for associations

**Keyboard Support**:
- `Space/Enter` on trigger: Opens popover
- `Esc`: Closes popover
- `Tab`: Navigates through focusable elements in popover
- `Shift+Tab`: Reverse navigation
- Focus trap in modal mode
- Focus returns to trigger on close (or to `finalFocusEl`)

**Focus Management**:
- Auto-focus first focusable element on open (configurable)
- Focus trap for modal popovers
- Focus returns to trigger on close
- `initialFocusEl`: Specify initial focus target
- `finalFocusEl`: Specify focus target on close
- `restoreFocus`: Control focus restoration (default: true)

**Screen Reader Support**:
- Proper role and relationship attributes
- Header content announced via `aria-labelledby`
- Body content accessible and navigable
- Close button has proper `aria-label`
- State changes announced (open/closed)

**Dismissibility**:
- Click outside to close (configurable)
- Esc key to close (configurable)
- Explicit close button accessible to all users
- Close behavior can be customized

**Color Contrast**:
- Default styling meets WCAG AA requirements
- High contrast between background and text
- Focus indicators visible and high-contrast
- Works in both light and dark modes

## Key Properties/Props

### Popover.Root Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `undefined` | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(details: { open: boolean }) => void` | `undefined` | Callback when open state changes |
| `positioning` | `PositioningOptions` | See positioning section | Positioning configuration |
| `lazyMount` | `boolean` | `false` | Defer mounting content until first open |
| `unmountOnExit` | `boolean` | `false` | Remove content from DOM when closed |
| `modal` | `boolean` | `false` | Create modal popover with focus trap |
| `disabled` | `boolean` | `false` | Disable popover (prevents opening) |
| `autoFocus` | `boolean` | `true` | Auto-focus first element on open |
| `initialFocusEl` | `() => HTMLElement` | `undefined` | Element to focus on open |
| `finalFocusEl` | `() => HTMLElement` | `undefined` | Element to focus on close |
| `restoreFocus` | `boolean` | `true` | Restore focus to trigger on close |
| `closeOnInteractOutside` | `boolean` | `true` | Close when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Close on Esc key press |
| `closeOnScroll` | `boolean` | `true` | Close on scroll |
| `onInteractOutside` | `(event) => void` | `undefined` | Callback before close on outside click |
| `onEscapeKeyDown` | `(event) => void` | `undefined` | Callback before close on Esc key |
| `openDelay` | `number` | `0` | Delay in ms before opening |
| `closeDelay` | `number` | `0` | Delay in ms before closing |
| `openOnHover` | `boolean` | `false` | Open on hover instead of click |
| `openOnFocus` | `boolean` | `true` | Open when trigger receives focus |

### Positioning Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placement` | `Placement` | `"bottom"` | Popover placement relative to trigger |
| `offset` | `{ mainAxis?: number, crossAxis?: number }` | `{ mainAxis: 8 }` | Distance from trigger element |
| `gutter` | `number` | `8` | Minimum distance from viewport edge |
| `flip` | `boolean` | `true` | Auto-flip placement if insufficient space |
| `slide` | `boolean` | `true` | Slide along axis if insufficient space |
| `overlap` | `boolean` | `false` | Allow popover to overlap trigger |
| `sameWidth` | `boolean` | `false` | Match trigger width |
| `fitViewport` | `boolean` | `false` | Constrain within viewport |
| `strategy` | `"absolute" \| "fixed"` | `"absolute"` | CSS positioning strategy |

### Placement Values

Available placement options:
- `"top"`, `"top-start"`, `"top-end"`
- `"bottom"`, `"bottom-start"`, `"bottom-end"`
- `"left"`, `"left-start"`, `"left-end"`
- `"right"`, `"right-start"`, `"right-end"`

### Popover.Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxW` | `ResponsiveValue<string>` | `undefined` | Maximum width |
| `minW` | `ResponsiveValue<string>` | `undefined` | Minimum width |
| `width` | `ResponsiveValue<string>` | `"auto"` | Fixed width |
| `maxH` | `ResponsiveValue<string>` | `undefined` | Maximum height (enables scroll) |
| `bg` | `string` | Panel background | Background color |
| `shadow` | `string` | `"lg"` | Box shadow elevation |
| `borderRadius` | `string` | `"md"` | Corner radius |
| All Chakra Box props | Various | - | Full styling support |

### Popover.Trigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `true` | Render as child element (passes props to child) |

### Popover.Header Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra Box props | Various | - | Full styling support |

### Popover.Body Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra Box props | Various | - | Full styling support |

### Popover.Footer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra Box props | Various | - | Full styling support |

### Popover.Arrow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `string \| number` | `undefined` | Arrow size |

### Popover.CloseTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `true` | Render as child element |

## Code Examples

### Example 1: Basic Popover
```jsx
import { Popover, Button, Text } from "@chakra-ui/react"

export const BasicPopover = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm">
          Open Popover
        </Button>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Body>
            <Text>This is the popover content with useful information.</Text>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
```

### Example 2: Popover with Header and Footer
```jsx
import { Popover, Button, Heading, Text, Stack } from "@chakra-ui/react"

export const PopoverWithStructure = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button>Settings</Button>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content maxW="sm">
          <Popover.Header>
            <Heading size="sm">Account Settings</Heading>
          </Popover.Header>
          <Popover.Body>
            <Text>Configure your account preferences and privacy settings.</Text>
          </Popover.Body>
          <Popover.Footer>
            <Button size="sm" colorScheme="blue">Save Changes</Button>
            <Popover.CloseTrigger asChild>
              <Button size="sm" variant="ghost">Cancel</Button>
            </Popover.CloseTrigger>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
```

### Example 3: Popover with Arrow
```jsx
import { Popover, Button, Text } from "@chakra-ui/react"

export const PopoverWithArrow = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outline">Show Info</Button>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.Body>
            <Text>Popover with directional arrow pointing to trigger.</Text>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
```

### Example 4: Different Placements
```jsx
import { Popover, Button, Stack, Text } from "@chakra-ui/react"

export const PopoverPlacements = () => {
  return (
    <Stack direction="row" spacing={4}>
      <Popover.Root positioning={{ placement: "top" }}>
        <Popover.Trigger asChild>
          <Button>Top</Button>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Body>
              <Text>Top placement</Text>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>

      <Popover.Root positioning={{ placement: "right" }}>
        <Popover.Trigger asChild>
          <Button>Right</Button>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Body>
              <Text>Right placement</Text>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>

      <Popover.Root positioning={{ placement: "bottom" }}>
        <Popover.Trigger asChild>
          <Button>Bottom</Button>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Body>
              <Text>Bottom placement</Text>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>

      <Popover.Root positioning={{ placement: "left" }}>
        <Popover.Trigger asChild>
          <Button>Left</Button>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Body>
              <Text>Left placement</Text>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    </Stack>
  )
}
```

### Example 5: Controlled Popover
```jsx
"use client"

import { Popover, Button, Text } from "@chakra-ui/react"
import { useState } from "react"

export const ControlledPopover = () => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Popover.Root
        open={open}
        onOpenChange={(details) => setOpen(details.open)}
      >
        <Popover.Trigger asChild>
          <Button>Toggle Popover</Button>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Body>
              <Text>Controlled popover content. Current state: {open ? "Open" : "Closed"}</Text>
            </Popover.Body>
            <Popover.Footer>
              <Button size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>

      <Button ml={4} onClick={() => setOpen(!open)}>
        External Toggle
      </Button>
    </div>
  )
}
```

### Example 6: Form in Popover
```jsx
import { Popover, Button, Input, FormControl, FormLabel, Stack } from "@chakra-ui/react"

export const PopoverWithForm = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button>Edit Profile</Button>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content maxW="md">
          <Popover.Header>
            <Heading size="sm">Edit Profile</Heading>
          </Popover.Header>
          <Popover.Body>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter your name" />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Enter your email" />
              </FormControl>
            </Stack>
          </Popover.Body>
          <Popover.Footer>
            <Button size="sm" colorScheme="blue">Save</Button>
            <Popover.CloseTrigger asChild>
              <Button size="sm" variant="ghost">Cancel</Button>
            </Popover.CloseTrigger>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
```

### Example 7: Confirmation Popover
```jsx
import { Popover, Button, Text, Heading } from "@chakra-ui/react"

export const ConfirmationPopover = () => {
  const handleDelete = () => {
    console.log("Item deleted")
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button colorScheme="red">Delete</Button>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Header>
            <Heading size="sm">Confirm Deletion</Heading>
          </Popover.Header>
          <Popover.Body>
            <Text>Are you sure you want to delete this item? This action cannot be undone.</Text>
          </Popover.Body>
          <Popover.Footer>
            <Button
              size="sm"
              colorScheme="red"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Popover.CloseTrigger asChild>
              <Button size="sm" variant="ghost">Cancel</Button>
            </Popover.CloseTrigger>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
```

### Example 8: Popover with Custom Styling
```jsx
import { Popover, Button, Text } from "@chakra-ui/react"

export const CustomStyledPopover = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button colorScheme="purple">Show Custom</Button>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content
          bg="purple.600"
          color="white"
          borderColor="purple.400"
          shadow="2xl"
          maxW="xs"
        >
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.Header borderBottomColor="purple.400">
            <Heading size="sm">Custom Theme</Heading>
          </Popover.Header>
          <Popover.Body>
            <Text>This popover has custom colors and styling.</Text>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
```

### Example 9: Lazy Mounted Popover
```jsx
import { Popover, Button, Text } from "@chakra-ui/react"

export const LazyPopover = () => {
  return (
    <Popover.Root lazyMount unmountOnExit>
      <Popover.Trigger asChild>
        <Button>Open Lazy Popover</Button>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Body>
            <Text>
              This content is only mounted when the popover opens,
              and unmounted when it closes. Useful for performance optimization.
            </Text>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
```

### Example 10: Modal Popover
```jsx
import { Popover, Button, Text, Input, Stack } from "@chakra-ui/react"

export const ModalPopover = () => {
  return (
    <Popover.Root modal>
      <Popover.Trigger asChild>
        <Button>Open Modal Popover</Button>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content maxW="md">
          <Popover.Header>
            <Heading size="sm">Modal Popover</Heading>
            <Popover.CloseTrigger asChild>
              <IconButton size="sm" variant="ghost" aria-label="Close">
                <X />
              </IconButton>
            </Popover.CloseTrigger>
          </Popover.Header>
          <Popover.Body>
            <Stack spacing={3}>
              <Text>This popover is modal - it traps focus and requires explicit close.</Text>
              <Input placeholder="Focus is trapped here" />
            </Stack>
          </Popover.Body>
          <Popover.Footer>
            <Popover.CloseTrigger asChild>
              <Button size="sm">Done</Button>
            </Popover.CloseTrigger>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
```

## Accessibility Notes

**ARIA Implementation**:
- Popover.Content automatically has `role="dialog"` or appropriate role
- `aria-labelledby` links header to content for screen readers
- `aria-describedby` links description to content
- `aria-haspopup` applied to trigger element
- `aria-expanded` indicates open/closed state on trigger
- `aria-controls` links trigger to content ID
- Proper ID management ensures associations work correctly

**Keyboard Navigation**:
- `Space`/`Enter` on trigger opens popover
- `Esc` closes popover
- `Tab` navigates through focusable elements in popover
- `Shift+Tab` for reverse navigation
- Focus trap in modal mode prevents focus escaping
- Focus returns to trigger on close (configurable with `finalFocusEl`)

**Screen Reader Support**:
- Header content announced via `aria-labelledby`
- Body content fully accessible and navigable
- Close button has proper `aria-label`
- State changes (open/closed) announced to screen readers
- Proper role attributes ensure correct interpretation
- Interactive elements properly labeled

**Focus Management Best Practices**:
- Auto-focus first interactive element on open
- Use `initialFocusEl` for custom focus targets
- Ensure focus returns appropriately on close
- Modal popovers trap focus for clear interaction model
- Non-modal popovers allow background interaction

**Color Accessibility**:
- Default styling meets WCAG AA contrast requirements
- High contrast between background and text
- Focus indicators visible and meet contrast requirements
- Works correctly in both light and dark modes
- Customizable while maintaining accessibility standards

**Semantic HTML Best Practices**:
- Use proper heading elements in headers
- Structure content with semantic HTML
- Interactive elements use button elements
- Form controls properly labeled
- Lists use proper list markup

## Common Patterns

1. **User Profile Cards**: Display user information, status, and quick actions on avatar click
2. **Confirmation Dialogs**: Ask for user confirmation before destructive actions (delete, remove)
3. **Form Editing**: Inline form editing for updating records without page navigation
4. **Action Menus**: Context-specific actions for items (more options, settings)
5. **Color Pickers**: Display color palette for selection with visual preview
6. **Date Pickers**: Show calendar interface for date selection
7. **Filter Panels**: Display filter options and controls for data tables or lists
8. **Search Interfaces**: Expandable search with suggestions and advanced options
9. **Settings Panels**: Quick access to configuration options without navigation
10. **Rich Content Previews**: Show detailed previews of links, files, or content before opening

## Related Components

- **Tooltip** - Simpler, non-interactive alternative for brief information (use when content is simple text)
- **Hover Card** - Hover-triggered alternative specifically designed for hover interactions
- **Menu** - For navigation-focused action lists (use when presenting choices/commands)
- **Dialog** - Full-screen modal for larger, more complex content (use when content needs prominence)
- **Drawer** - Side panel alternative for mobile-friendly overlays (use for navigation or large forms)
- **Portal** - Used internally for rendering outside DOM tree (ensures proper z-index)
- **Positioner** - Handles positioning logic (placement, flip, offset calculations)
- **Select** - For selecting from options in a form (use with `sameWidth` positioning)
- **Combobox** - Autocomplete select with search (often uses popover-like positioning)

---

**Research completed:** 2025-11-06
**Component:** Popover
**Framework:** Chakra UI (v3.x)
**Documentation:** https://chakra-ui.com/docs/components/popover
**Source:** https://github.com/chakra-ui/chakra-ui
**Underlying Library:** Ark UI (https://ark-ui.com)

**Notable Features:**
- Built on Ark UI popover primitive for robust positioning and interactions
- Composition-based API with fine-grained sub-components (Root, Trigger, Content, Header, Body, Footer, Arrow)
- Portal rendering by default for proper z-index management (popover layer: 1500)
- Modal mode with focus trap for explicit user interaction
- Comprehensive positioning system with auto-flip, auto-slide, and viewport constraints
- Lazy mounting and unmount-on-exit for performance optimization
- Controlled and uncontrolled modes for flexible state management
- Rich accessibility with full ARIA support and keyboard navigation
- Auto-focus management with customizable initial and final focus targets
- Close behavior fully customizable (click outside, Esc, scroll, explicit button)
- Directional animations based on placement with smooth transitions
- Arrow display with automatic positioning and styling
- Configurable delays for open and close timing
- Supports hover trigger mode (though less common than click)
- Full TypeScript support with comprehensive type definitions
- Responsive positioning that adapts to viewport constraints
- Same-width option for dropdown-like interfaces
- Full Chakra style props support for customization
