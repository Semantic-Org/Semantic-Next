# Chakra UI - Hover Card Component

## Component Overview

The Chakra UI Hover Card component displays rich contextual content when hovering over a trigger element. Built on Ark UI's hover-card primitive, it provides a hover-specific overlay designed for supplementary information without requiring user clicks. Unlike tooltips (simple text) or popovers (click-triggered), hover cards are specifically optimized for hover interactions with richer content support.

**Core purpose**: Displays rich, non-critical content triggered by hovering over an element. Provides supplementary information, previews, or context without disrupting the user's flow or requiring explicit interaction. Ideal for progressive disclosure of information that enhances but doesn't block the experience.

**Architecture**: A composition-based system where `HoverCard.Root` manages state and wraps trigger and content elements. The component uses Portal rendering by default for proper z-index layering (popover layer: 1500). Sub-components include `Trigger`, `Positioner`, `Content`, `Arrow`, and `ArrowTip` for fine-grained control. Optimized specifically for hover timing and interactions.

**Common use cases**: Link previews, user profile cards on avatar hover, feature explanations, product quick views, definition displays, supplementary documentation, image previews, contact information, status details, and rich tooltips with formatted content.

## Usage Patterns

### Basic Usage

The simplest Hover Card implementation requires wrapping a trigger element and content within the HoverCard component structure:

```jsx
import { HoverCard, Button, Text } from "@chakra-ui/react"

// Basic hover card with hover trigger
<HoverCard.Root>
  <HoverCard.Trigger asChild>
    <Button variant="link">
      Hover over me
    </Button>
  </HoverCard.Trigger>
  <HoverCard.Positioner>
    <HoverCard.Content>
      <Text>This content appears when hovering over the trigger.</Text>
    </HoverCard.Content>
  </HoverCard.Positioner>
</HoverCard.Root>

// Hover card with arrow
<HoverCard.Root>
  <HoverCard.Trigger asChild>
    <Text as="span" textDecoration="underline" cursor="pointer">
      User Profile
    </Text>
  </HoverCard.Trigger>
  <HoverCard.Positioner>
    <HoverCard.Content>
      <HoverCard.Arrow>
        <HoverCard.ArrowTip />
      </HoverCard.Arrow>
      <Stack spacing={2}>
        <Avatar name="John Doe" />
        <Text fontWeight="bold">John Doe</Text>
        <Text fontSize="sm" color="gray.500">Software Engineer</Text>
      </Stack>
    </HoverCard.Content>
  </HoverCard.Positioner>
</HoverCard.Root>
```

### Variants/Styles

Chakra UI Hover Card supports visual customization through props and composition:

**Arrow Display** (`HoverCard.Arrow` component):
- Optional visual arrow pointing to trigger element
- Arrow automatically adjusts direction based on placement
- Uses `HoverCard.Arrow` wrapper with `HoverCard.ArrowTip` child
- Customizable size, color, and shadow matching content
- Example:
```jsx
<HoverCard.Arrow>
  <HoverCard.ArrowTip />
</HoverCard.Arrow>
```

**Portal Rendering** (default behavior):
- Renders content in Portal outside normal DOM flow by default
- Uses popover z-index layer (1500) for proper stacking
- Prevents overflow and clipping issues
- Ensures visibility above most UI elements
- Can be disabled for specific layout requirements

**Background and Border Styling**:
- Default: Panel background color (`--hovercard-bg`)
- Border radius: L3 radius tokens (rounded corners)
- Shadow: Elevation shadow (lg shadow by default)
- Fully customizable via Chakra style props
- Example:
```jsx
<HoverCard.Content
  bg="white"
  borderColor="gray.200"
  shadow="xl"
  borderWidth="1px"
>
  {/* content */}
</HoverCard.Content>
```

**Size Control**:
- Content width controlled via `maxW`, `minW`, or `width` props
- Default: Auto-width based on content
- Common constraint: `maxW="sm"` (20rem / 320px default)
- Example:
```jsx
<HoverCard.Content maxW="md" width="350px">
  {/* content */}
</HoverCard.Content>
```

**Padding**:
- Default: Full-height padding (`p-4` or similar)
- Customizable via standard Chakra padding props
- Example:
```jsx
<HoverCard.Content p={6}>
  {/* more padding */}
</HoverCard.Content>
```

**Color Palette Integration**:
- Supports Chakra color palette tokens
- Focus ring colors palette-specific
- Example:
```jsx
<HoverCard.Content colorPalette="blue">
  {/* blue color scheme */}
</HoverCard.Content>
```

### States

**Closed State** (Default):
- Hover card content hidden
- Trigger element visible and interactive
- No Portal content rendered
- No hover listeners active until mouse proximity

**Open State**:
- Triggered by hovering over trigger element
- Content rendered in Portal with positioning
- Arrow (if enabled) points toward trigger
- Animated entrance based on placement direction
- Remains open while hovering trigger or content
- Closes when mouse leaves both trigger and content (with delay)

**Hover Timing**:
- `openDelay`: Delay before opening on hover (default: 700ms)
- `closeDelay`: Delay before closing when mouse leaves (default: 300ms)
- Prevents accidental triggering from quick mouse movements
- Provides smooth user experience
- Example:
```jsx
<HoverCard.Root openDelay={500} closeDelay={200}>
  {/* custom timing */}
</HoverCard.Root>
```

**Controlled State**:
- Use `open` and `onOpenChange` props for programmatic control
- Enables external control of visibility
- Useful for coordinated UI states or tutorials
- Example:
```jsx
<HoverCard.Root
  open={isOpen}
  onOpenChange={(details) => setIsOpen(details.open)}
>
  {/* controlled hover card */}
</HoverCard.Root>
```

**Uncontrolled State** (Default):
- Hover card manages its own open/closed state internally
- Use `defaultOpen` prop for initial state
- Example:
```jsx
<HoverCard.Root defaultOpen={true}>
  {/* opens by default */}
</HoverCard.Root>
```

**Disabled State**:
- Prevents hover card from opening
- Trigger remains visible but non-functional
- Useful for conditional availability
- Example:
```jsx
<HoverCard.Root disabled={!showPreview}>
  {/* hover card won't open */}
</HoverCard.Root>
```

**Interactive Content**:
- Content can contain interactive elements (links, buttons)
- Hover card remains open when hovering content
- Allows users to interact with content
- Close delay provides time to move from trigger to content
- Example:
```jsx
<HoverCard.Content>
  <Stack spacing={2}>
    <Text>Additional Information</Text>
    <Link href="/learn-more" color="blue.500">
      Learn More
    </Link>
  </Stack>
</HoverCard.Content>
```

### Sizing Options

Hover card size is controlled through content dimensions:

**Width Control**:
- `maxW`: Maximum width constraint (default: "sm" / 20rem / 320px)
- `minW`: Minimum width constraint
- `width`: Fixed width
- Default: Auto-width based on content, constrained to maxW
- Example:
```jsx
<HoverCard.Content maxW="lg" minW="300px">
  {/* constrained width */}
</HoverCard.Content>
```

**Height Control**:
- `maxH`: Maximum height with scroll
- `minH`: Minimum height
- `height`: Fixed height
- Default: Auto-height based on content
- Example:
```jsx
<HoverCard.Content maxH="400px" overflowY="auto">
  {/* scrollable content if needed */}
</HoverCard.Content>
```

**Responsive Sizing**:
- Use responsive array or object syntax
- Example: `maxW={{ base: "full", md: "sm" }}`
- Adapts to viewport size
- Mobile: Often full-width or hidden
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
<HoverCard.Root positioning={{ placement: "right" }}>
  {/* appears to the right of trigger */}
</HoverCard.Root>
```

**Offset Control** (`positioning.offset` prop):
- `mainAxis`: Distance along main placement axis (default: 8px)
- `crossAxis`: Distance along cross placement axis
- Fine-tune distance from trigger element
- Example:
```jsx
<HoverCard.Root positioning={{ offset: { mainAxis: 12, crossAxis: 0 } }}>
  {/* custom offset from trigger */}
</HoverCard.Root>
```

**Gutter** (`positioning.gutter` prop):
- Minimum distance from viewport edges
- Prevents hover card from touching screen edges
- Default: 8px
- Example:
```jsx
<HoverCard.Root positioning={{ gutter: 16 }}>
  {/* 16px minimum from viewport edges */}
</HoverCard.Root>
```

**Flip Behavior** (`positioning.flip` prop):
- Automatically flips placement if insufficient space
- Default: `true`
- Prevents content clipping
- Example:
```jsx
<HoverCard.Root positioning={{ flip: false }}>
  {/* no auto-flip, may clip */}
</HoverCard.Root>
```

**Slide Behavior** (`positioning.slide` prop):
- Slides along axis if insufficient space
- Default: `true`
- Keeps hover card visible within viewport
- Example:
```jsx
<HoverCard.Root positioning={{ slide: true }}>
  {/* slides to stay visible */}
</HoverCard.Root>
```

**Transform Origin**:
- Dynamically set based on placement
- Ensures animations originate from correct direction
- Top placement: `transform-origin: bottom`
- Bottom placement: `transform-origin: top`
- Left placement: `transform-origin: right`
- Right placement: `transform-origin: left`

**Strategy** (`positioning.strategy` prop):
- `"absolute"` (default): Absolute positioning
- `"fixed"`: Fixed positioning
- Affects how hover card positions relative to viewport
- Example:
```jsx
<HoverCard.Root positioning={{ strategy: "fixed" }}>
  {/* fixed positioning */}
</HoverCard.Root>
```

### Content & Structure

**Rich Content Support**:
- Supports complex React components
- Can include text, images, links, buttons, forms
- Layout with Chakra Stack, Grid, Flex components
- Example:
```jsx
<HoverCard.Content>
  <Stack spacing={3}>
    <Image src={productImage} alt={productName} />
    <Heading size="sm">{productName}</Heading>
    <Text fontSize="sm" color="gray.600">{productDescription}</Text>
    <Badge colorScheme="green">In Stock</Badge>
  </Stack>
</HoverCard.Content>
```

**User Profile Pattern**:
- Avatar with name and details
- Common use case for hover cards
- Example:
```jsx
<HoverCard.Content>
  <Stack spacing={2} align="center">
    <Avatar size="lg" name="Jane Smith" src={avatarUrl} />
    <Heading size="sm">Jane Smith</Heading>
    <Text fontSize="sm" color="gray.500">Product Designer</Text>
    <Text fontSize="xs" color="gray.400">jane@company.com</Text>
    <Button size="sm" variant="outline">View Profile</Button>
  </Stack>
</HoverCard.Content>
```

**Link Preview Pattern**:
- Show link destination details
- Common for external links
- Example:
```jsx
<HoverCard.Content>
  <Stack spacing={2}>
    <Text fontWeight="bold" fontSize="sm">Article Title</Text>
    <Text fontSize="xs" color="gray.500">
      A detailed description of the article content and what users can expect to find.
    </Text>
    <Text fontSize="xs" color="gray.400">example.com</Text>
  </Stack>
</HoverCard.Content>
```

**Definition Pattern**:
- Show term definitions or explanations
- Common for glossary or help text
- Example:
```jsx
<HoverCard.Content maxW="xs">
  <Stack spacing={1}>
    <Text fontWeight="bold" fontSize="sm">API (Application Programming Interface)</Text>
    <Text fontSize="xs" color="gray.600">
      A set of protocols and tools for building software applications, defining how components should interact.
    </Text>
  </Stack>
</HoverCard.Content>
```

**Arrow Display**:
- Optional arrow via `HoverCard.Arrow` component
- Arrow points toward trigger element
- Automatically positions based on placement
- Customizable via CSS (arrow size, color)
- Example:
```jsx
<HoverCard.Arrow>
  <HoverCard.ArrowTip />
</HoverCard.Arrow>
```

**Sub-component Hierarchy**:
```
HoverCard.Root (state management)
├── HoverCard.Trigger (trigger element wrapper)
└── HoverCard.Positioner (positioning logic)
    └── HoverCard.Content (content container)
        └── HoverCard.Arrow (optional)
            └── HoverCard.ArrowTip (arrow styling)
```

### Interactive Features

**Hover Trigger** (Primary):
- Opens on mouse enter over trigger
- Delayed opening (default: 700ms) prevents accidental activation
- Remains open while hovering trigger or content
- Closes on mouse leave with delay (default: 300ms)
- Smooth user experience for browsing

**Interactive Content**:
- Content can contain clickable links and buttons
- Hover card remains open when hovering content
- Users can move from trigger to content without closing
- Close delay provides transition time
- Essential for interactive hover cards

**Controlled Display**:
- Use `open` prop for manual control
- Combine with `onOpenChange` for two-way binding
- Enables programmatic hover card management
- Example:
```jsx
const [open, setOpen] = useState(false)
return (
  <HoverCard.Root
    open={open}
    onOpenChange={(details) => setOpen(details.open)}
  >
    {/* controlled hover card */}
  </HoverCard.Root>
)
```

**Close Behavior**:
- Automatically closes when mouse leaves trigger and content
- `closeDelay` provides buffer time (default: 300ms)
- No manual close button needed (non-modal)
- Can be controlled programmatically
- Esc key support (if keyboard accessible)

**Touch Device Considerations**:
- Hover cards may not work on touch devices
- Consider providing alternative access method
- Tap to show on mobile (requires controlled state)
- Or hide on touch devices entirely
- Example:
```jsx
const isTouchDevice = 'ontouchstart' in window
return (
  <HoverCard.Root disabled={isTouchDevice}>
    {/* disabled on touch devices */}
  </HoverCard.Root>
)
```

### Animation & Transitions

**Entrance Animation**:
- Fade-in effect with subtle scale
- Directional slide based on placement
- Duration: 150ms (fast) for quick appearance
- CSS-based animation for smooth performance
- Transform-origin aware for natural motion
- Direction-aware animations:
  - `top`: Slides from bottom
  - `bottom`: Slides from top
  - `left`: Slides from right
  - `right`: Slides from left

**Exit Animation**:
- Fade-out with reverse scale
- Duration: 150ms (fast) for quick disappearance
- Matches entrance for consistency
- Smooth transition out

**Animation Configuration**:
- Built-in animations optimized for hover interactions
- Fast timing prevents lag feel
- Can be customized via Chakra theme
- Transform-origin set based on placement
- Example custom animation:
```jsx
<HoverCard.Content
  sx={{
    animation: 'fadeIn 150ms ease-out',
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'scale(0.95)' },
      to: { opacity: 1, transform: 'scale(1)' }
    }
  }}
>
  {/* custom animation */}
</HoverCard.Content>
```

**Delay Controls**:
- `openDelay`: Delay before opening (default: 700ms)
- `closeDelay`: Delay before closing (default: 300ms)
- Prevents accidental activation from quick mouse movements
- Provides smooth browsing experience
- Example:
```jsx
<HoverCard.Root openDelay={500} closeDelay={200}>
  {/* custom delays */}
</HoverCard.Root>
```

### Integration Patterns

**User Profile on Avatar Hover**:
```jsx
<HoverCard.Root>
  <HoverCard.Trigger asChild>
    <Avatar
      name="Sarah Johnson"
      src={user.avatar}
      cursor="pointer"
    />
  </HoverCard.Trigger>
  <HoverCard.Positioner>
    <HoverCard.Content maxW="sm">
      <HoverCard.Arrow>
        <HoverCard.ArrowTip />
      </HoverCard.Arrow>
      <Stack spacing={3} align="center">
        <Avatar size="xl" name="Sarah Johnson" src={user.avatar} />
        <Heading size="md">Sarah Johnson</Heading>
        <Text fontSize="sm" color="gray.500">Senior Software Engineer</Text>
        <Text fontSize="sm" color="gray.600">{user.bio}</Text>
        <HStack spacing={2}>
          <Button size="sm" colorScheme="blue">View Profile</Button>
          <Button size="sm" variant="outline">Message</Button>
        </HStack>
      </Stack>
    </HoverCard.Content>
  </HoverCard.Positioner>
</HoverCard.Root>
```

**Link Preview**:
```jsx
<HoverCard.Root>
  <HoverCard.Trigger asChild>
    <Link href="https://example.com/article" color="blue.500">
      Read the full article
    </Link>
  </HoverCard.Trigger>
  <HoverCard.Positioner>
    <HoverCard.Content maxW="md">
      <Stack spacing={2}>
        <Heading size="sm">Understanding React Hooks</Heading>
        <Text fontSize="sm" color="gray.600">
          A comprehensive guide to React Hooks, covering useState, useEffect, and custom hooks with practical examples.
        </Text>
        <HStack spacing={2} fontSize="xs" color="gray.400">
          <Text>example.com</Text>
          <Text>•</Text>
          <Text>5 min read</Text>
        </HStack>
      </Stack>
    </HoverCard.Content>
  </HoverCard.Positioner>
</HoverCard.Root>
```

**Product Quick View**:
```jsx
<HoverCard.Root>
  <HoverCard.Trigger asChild>
    <Box cursor="pointer" p={4} borderWidth="1px" borderRadius="md">
      <Image src={product.thumbnail} alt={product.name} />
      <Text fontWeight="bold" mt={2}>{product.name}</Text>
      <Text fontSize="sm" color="gray.500">${product.price}</Text>
    </Box>
  </HoverCard.Trigger>
  <HoverCard.Positioner>
    <HoverCard.Content maxW="sm">
      <Stack spacing={3}>
        <Image src={product.image} alt={product.name} borderRadius="md" />
        <Heading size="sm">{product.name}</Heading>
        <Text fontSize="sm" color="gray.600">{product.description}</Text>
        <HStack justify="space-between" align="center">
          <Text fontWeight="bold" fontSize="lg">${product.price}</Text>
          <Badge colorScheme={product.inStock ? "green" : "red"}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </HStack>
        <Button size="sm" colorScheme="blue" width="full">
          Add to Cart
        </Button>
      </Stack>
    </HoverCard.Content>
  </HoverCard.Positioner>
</HoverCard.Root>
```

**Definition Tooltip**:
```jsx
<HoverCard.Root openDelay={300} closeDelay={100}>
  <HoverCard.Trigger asChild>
    <Text
      as="span"
      textDecoration="underline"
      textDecorationStyle="dotted"
      cursor="help"
    >
      API
    </Text>
  </HoverCard.Trigger>
  <HoverCard.Positioner>
    <HoverCard.Content maxW="xs">
      <Stack spacing={1}>
        <Text fontWeight="bold" fontSize="sm">
          API (Application Programming Interface)
        </Text>
        <Text fontSize="xs" color="gray.600">
          A set of rules and protocols that allows different software applications to communicate with each other.
        </Text>
      </Stack>
    </HoverCard.Content>
  </HoverCard.Positioner>
</HoverCard.Root>
```

### Accessibility Features

**IMPORTANT ACCESSIBILITY LIMITATION**:
> Hover cards are inaccessible to screen readers and cannot be activated via keyboard. They rely entirely on mouse hover interactions. Avoid placing critical content within hover cards. Use them only for supplementary, non-essential information.

**ARIA Attributes**:
- Limited ARIA support due to hover-only nature
- Content not in accessibility tree by default
- `aria-hidden="true"` may be appropriate for decorative content
- Use `role="tooltip"` sparingly as content may be too rich

**Keyboard Accessibility**:
- No native keyboard activation (hover-only)
- Cannot be focused via Tab key
- Not accessible to keyboard-only users
- Consider providing alternative access method for keyboard users
- Example alternative:
```jsx
// Provide button alternative for keyboard users
<HStack spacing={2}>
  <HoverCard.Root>
    <HoverCard.Trigger asChild>
      <Link href="/profile">John Doe</Link>
    </HoverCard.Trigger>
    <HoverCard.Positioner>
      <HoverCard.Content>{/* profile info */}</HoverCard.Content>
    </HoverCard.Positioner>
  </HoverCard.Root>

  {/* Alternative for keyboard users */}
  <Button
    size="xs"
    variant="ghost"
    onClick={() => navigate('/profile')}
    aria-label="View full profile"
  >
    View Profile
  </Button>
</HStack>
```

**Screen Reader Considerations**:
- Content not announced by screen readers
- Trigger element should be properly labeled
- Critical information should not be exclusive to hover card
- Provide alternative access to same information
- Consider using aria-describedby for trigger with summary

**Touch Device Accessibility**:
- Hover cards don't work on touch devices without modification
- Consider disabling on touch devices
- Provide tap-to-view alternative for mobile
- Or ensure content is accessible through other means
- Example detection:
```jsx
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
<HoverCard.Root disabled={isTouchDevice}>
  {/* disabled on touch */}
</HoverCard.Root>
```

**Best Practices for Accessibility**:
1. Use hover cards only for supplementary, non-critical information
2. Ensure trigger element is properly labeled and accessible
3. Provide alternative access to information (links, buttons, pages)
4. Don't rely on hover cards for essential functionality
5. Test with keyboard-only navigation
6. Consider screen reader users
7. Disable on touch devices or provide alternative interaction
8. Use Popover component if content needs to be accessible

**Color Contrast**:
- Default styling meets WCAG AA requirements
- High contrast between background and text
- Works in both light and dark modes
- Customizable while maintaining contrast standards

## Key Properties/Props

### HoverCard.Root Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `undefined` | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(details: { open: boolean }) => void` | `undefined` | Callback when open state changes |
| `openDelay` | `number` | `700` | Delay in ms before opening on hover |
| `closeDelay` | `number` | `300` | Delay in ms before closing when hover ends |
| `disabled` | `boolean` | `false` | Disable hover card (prevents opening) |
| `positioning` | `PositioningOptions` | See positioning section | Positioning configuration |

### Positioning Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placement` | `Placement` | `"bottom"` | Hover card placement relative to trigger |
| `offset` | `{ mainAxis?: number, crossAxis?: number }` | `{ mainAxis: 8 }` | Distance from trigger element |
| `gutter` | `number` | `8` | Minimum distance from viewport edge |
| `flip` | `boolean` | `true` | Auto-flip placement if insufficient space |
| `slide` | `boolean` | `true` | Slide along axis if insufficient space |
| `overlap` | `boolean` | `false` | Allow hover card to overlap trigger |
| `strategy` | `"absolute" \| "fixed"` | `"absolute"` | CSS positioning strategy |

### Placement Values

Available placement options:
- `"top"`, `"top-start"`, `"top-end"`
- `"bottom"`, `"bottom-start"`, `"bottom-end"`
- `"left"`, `"left-start"`, `"left-end"`
- `"right"`, `"right-start"`, `"right-end"`

### HoverCard.Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxW` | `ResponsiveValue<string>` | `"sm"` (20rem) | Maximum width |
| `minW` | `ResponsiveValue<string>` | `undefined` | Minimum width |
| `width` | `ResponsiveValue<string>` | `"auto"` | Fixed width |
| `maxH` | `ResponsiveValue<string>` | `undefined` | Maximum height (enables scroll) |
| `bg` | `string` | Panel background | Background color |
| `shadow` | `string` | `"lg"` | Box shadow elevation |
| `borderRadius` | `string` | `"md"` | Corner radius |
| `p` | `ResponsiveValue<string \| number>` | `4` | Padding |
| All Chakra Box props | Various | - | Full styling support |

### HoverCard.Trigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `true` | Render as child element (passes props to child) |

### HoverCard.Arrow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `string \| number` | `undefined` | Arrow size |

## Code Examples

### Example 1: Basic Hover Card
```jsx
import { HoverCard, Button, Text } from "@chakra-ui/react"

export const BasicHoverCard = () => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Button variant="link" color="blue.500">
          Hover over me
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Positioner>
        <HoverCard.Content>
          <Text>This content appears when you hover over the trigger element.</Text>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  )
}
```

### Example 2: User Profile Card
```jsx
import { HoverCard, Avatar, Heading, Text, Stack, Button } from "@chakra-ui/react"

export const UserProfileHoverCard = () => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Avatar
          name="Jane Smith"
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
          cursor="pointer"
        />
      </HoverCard.Trigger>
      <HoverCard.Positioner>
        <HoverCard.Content maxW="sm">
          <HoverCard.Arrow>
            <HoverCard.ArrowTip />
          </HoverCard.Arrow>
          <Stack spacing={3} align="center">
            <Avatar
              size="xl"
              name="Jane Smith"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            />
            <Heading size="md">Jane Smith</Heading>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Senior Product Designer at Tech Corp
            </Text>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Passionate about creating intuitive user experiences
            </Text>
            <Button size="sm" colorScheme="blue" width="full">
              View Profile
            </Button>
          </Stack>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  )
}
```

### Example 3: Link Preview
```jsx
import { HoverCard, Link, Heading, Text, Stack, HStack } from "@chakra-ui/react"

export const LinkPreviewHoverCard = () => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Link href="https://example.com/article" color="blue.500">
          Understanding React Hooks
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Positioner>
        <HoverCard.Content maxW="md">
          <Stack spacing={2}>
            <Heading size="sm">Understanding React Hooks</Heading>
            <Text fontSize="sm" color="gray.600">
              A comprehensive guide to React Hooks including useState, useEffect, useContext, and custom hooks with practical examples and best practices.
            </Text>
            <HStack spacing={2} fontSize="xs" color="gray.400">
              <Text>example.com</Text>
              <Text>•</Text>
              <Text>8 min read</Text>
              <Text>•</Text>
              <Text>Published Dec 15, 2024</Text>
            </HStack>
          </Stack>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  )
}
```

### Example 4: Product Quick View
```jsx
import { HoverCard, Box, Image, Heading, Text, Stack, Button, Badge, HStack } from "@chakra-ui/react"

export const ProductHoverCard = () => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Box
          cursor="pointer"
          p={4}
          borderWidth="1px"
          borderRadius="md"
          _hover={{ shadow: "md" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
            alt="Wireless Headphones"
            borderRadius="md"
          />
          <Text fontWeight="bold" mt={2}>Wireless Headphones</Text>
          <Text fontSize="sm" color="gray.500">$199.99</Text>
        </Box>
      </HoverCard.Trigger>
      <HoverCard.Positioner>
        <HoverCard.Content maxW="sm">
          <Stack spacing={3}>
            <Image
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
              alt="Wireless Headphones"
              borderRadius="md"
            />
            <Heading size="sm">Wireless Headphones</Heading>
            <Text fontSize="sm" color="gray.600">
              Premium noise-cancelling headphones with 30-hour battery life and superior audio quality.
            </Text>
            <HStack justify="space-between" align="center">
              <Text fontWeight="bold" fontSize="lg">$199.99</Text>
              <Badge colorScheme="green">In Stock</Badge>
            </HStack>
            <Button size="sm" colorScheme="blue" width="full">
              Add to Cart
            </Button>
          </Stack>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  )
}
```

### Example 5: Definition Tooltip
```jsx
import { HoverCard, Text, Stack } from "@chakra-ui/react"

export const DefinitionHoverCard = () => {
  return (
    <Text>
      Learn more about our{" "}
      <HoverCard.Root openDelay={300} closeDelay={100}>
        <HoverCard.Trigger asChild>
          <Text
            as="span"
            textDecoration="underline"
            textDecorationStyle="dotted"
            cursor="help"
            color="blue.500"
          >
            API
          </Text>
        </HoverCard.Trigger>
        <HoverCard.Positioner>
          <HoverCard.Content maxW="xs">
            <Stack spacing={1}>
              <Text fontWeight="bold" fontSize="sm">
                API (Application Programming Interface)
              </Text>
              <Text fontSize="xs" color="gray.600">
                A set of protocols and tools for building software applications, defining how components should interact.
              </Text>
            </Stack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </HoverCard.Root>
      {" "}documentation.
    </Text>
  )
}
```

### Example 6: Custom Timing
```jsx
import { HoverCard, Button, Text } from "@chakra-ui/react"

export const CustomTimingHoverCard = () => {
  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <Button variant="outline">Fast Response</Button>
      </HoverCard.Trigger>
      <HoverCard.Positioner>
        <HoverCard.Content>
          <Text>This hover card appears quickly (200ms delay) and closes fast (100ms delay).</Text>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  )
}
```

### Example 7: Different Placements
```jsx
import { HoverCard, Button, Stack, Text } from "@chakra-ui/react"

export const HoverCardPlacements = () => {
  return (
    <Stack direction="row" spacing={4} justify="center">
      <HoverCard.Root positioning={{ placement: "top" }}>
        <HoverCard.Trigger asChild>
          <Button>Top</Button>
        </HoverCard.Trigger>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <Text>Top placement</Text>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </HoverCard.Root>

      <HoverCard.Root positioning={{ placement: "right" }}>
        <HoverCard.Trigger asChild>
          <Button>Right</Button>
        </HoverCard.Trigger>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <Text>Right placement</Text>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </HoverCard.Root>

      <HoverCard.Root positioning={{ placement: "bottom" }}>
        <HoverCard.Trigger asChild>
          <Button>Bottom</Button>
        </HoverCard.Trigger>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <Text>Bottom placement</Text>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </HoverCard.Root>

      <HoverCard.Root positioning={{ placement: "left" }}>
        <HoverCard.Trigger asChild>
          <Button>Left</Button>
        </HoverCard.Trigger>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <Text>Left placement</Text>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </HoverCard.Root>
    </Stack>
  )
}
```

### Example 8: Controlled Hover Card
```jsx
"use client"

import { HoverCard, Button, Text, Stack } from "@chakra-ui/react"
import { useState } from "react"

export const ControlledHoverCard = () => {
  const [open, setOpen] = useState(false)

  return (
    <Stack spacing={4}>
      <HoverCard.Root
        open={open}
        onOpenChange={(details) => setOpen(details.open)}
      >
        <HoverCard.Trigger asChild>
          <Button>Hover or click external control</Button>
        </HoverCard.Trigger>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <Text>
              Controlled hover card. State: {open ? "Open" : "Closed"}
            </Text>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </HoverCard.Root>

      <Button size="sm" onClick={() => setOpen(!open)}>
        {open ? "Close" : "Open"} Externally
      </Button>
    </Stack>
  )
}
```

### Example 9: Custom Styled Hover Card
```jsx
import { HoverCard, Button, Text, Stack } from "@chakra-ui/react"

export const CustomStyledHoverCard = () => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Button colorScheme="purple">Hover for Info</Button>
      </HoverCard.Trigger>
      <HoverCard.Positioner>
        <HoverCard.Content
          bg="purple.50"
          borderColor="purple.200"
          borderWidth="2px"
          shadow="2xl"
          maxW="xs"
          p={6}
        >
          <HoverCard.Arrow>
            <HoverCard.ArrowTip />
          </HoverCard.Arrow>
          <Stack spacing={2}>
            <Text fontWeight="bold" color="purple.800">
              Custom Styling
            </Text>
            <Text fontSize="sm" color="purple.600">
              This hover card has custom colors, borders, and shadows.
            </Text>
          </Stack>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  )
}
```

### Example 10: Interactive Content
```jsx
import { HoverCard, Avatar, Heading, Text, Stack, Button, Link, HStack } from "@chakra-ui/react"

export const InteractiveHoverCard = () => {
  return (
    <HoverCard.Root closeDelay={500}>
      <HoverCard.Trigger asChild>
        <Avatar
          name="Alex Chen"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
          cursor="pointer"
        />
      </HoverCard.Trigger>
      <HoverCard.Positioner>
        <HoverCard.Content maxW="sm">
          <Stack spacing={3}>
            <Avatar
              size="lg"
              name="Alex Chen"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
            />
            <Heading size="sm">Alex Chen</Heading>
            <Text fontSize="sm" color="gray.500">
              Full Stack Developer
            </Text>
            <Text fontSize="sm" color="gray.600">
              Building scalable web applications with modern technologies.
            </Text>
            <HStack spacing={2}>
              <Link href="/profile" color="blue.500" fontSize="sm">
                View Profile
              </Link>
              <Text color="gray.300">•</Text>
              <Link href="/contact" color="blue.500" fontSize="sm">
                Contact
              </Link>
            </HStack>
            <Button size="sm" colorScheme="blue" width="full">
              Follow
            </Button>
          </Stack>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  )
}
```

## Accessibility Notes

**Critical Accessibility Limitation**:
- **Hover cards are NOT accessible to keyboard users** - they cannot be activated via keyboard navigation
- **Screen readers cannot access hover card content** - content is not exposed to assistive technologies
- **Touch device users cannot trigger hover cards** - hover interactions don't work on mobile devices

**Use Hover Cards Only For**:
- Supplementary, non-critical information
- Content that enhances but doesn't block the user experience
- Progressive disclosure of optional details
- Preview information that's available elsewhere

**Do NOT Use Hover Cards For**:
- Critical functionality or information
- Content that users need to accomplish tasks
- Important help text or instructions
- Form validation messages
- Error messages or warnings
- Any content that all users need access to

**Accessible Alternatives**:
- Use **Tooltip** component for simple text hints (has better accessibility)
- Use **Popover** component for interactive content that needs keyboard access
- Provide **alternative access** to information (links to full pages, buttons for details)
- Ensure trigger element is properly labeled and accessible
- Consider providing both hover card AND accessible alternative

**Touch Device Handling**:
- Detect touch devices and disable hover cards
- Provide tap-to-view alternative for mobile
- Or ensure information is available through other UI elements
- Example:
```jsx
const isTouchDevice = 'ontouchstart' in window
<HoverCard.Root disabled={isTouchDevice}>
  {/* disabled on touch devices */}
</HoverCard.Root>
```

**Best Practices**:
1. Never put critical content in hover cards
2. Ensure trigger element has proper semantic meaning and labels
3. Provide alternative access to hover card content
4. Test that application works without hover cards
5. Consider disabling on touch devices
6. Document that content is supplementary only
7. Use Popover instead if content needs to be accessible

**Color Contrast**:
- Default styling meets WCAG AA requirements
- High contrast between background and text
- Works in both light and dark modes
- Customizable while maintaining standards

## Common Patterns

1. **User Profile Cards**: Display user information, bio, and quick actions on avatar hover
2. **Link Previews**: Show article summaries, images, and metadata when hovering over links
3. **Product Quick Views**: Display product images, descriptions, and pricing on product card hover
4. **Definition Tooltips**: Show term definitions or explanations when hovering over dotted underline text
5. **Image Previews**: Display larger image or additional details when hovering over thumbnails
6. **Contact Information**: Show email, phone, social links when hovering over contact names
7. **Status Details**: Display detailed status information when hovering over status indicators
8. **Feature Explanations**: Provide additional context for features without cluttering UI
9. **Rich Tooltips**: Display formatted content, lists, or structured information beyond simple text
10. **Social Media Previews**: Show profile information when hovering over usernames or handles

## Related Components

- **Tooltip** - Simpler alternative for brief text information (better accessibility, keyboard support)
- **Popover** - Click-triggered alternative for interactive content that requires accessibility
- **Portal** - Used internally for rendering outside DOM tree (ensures proper z-index)
- **Positioner** - Handles positioning logic (placement, flip, offset calculations)
- **Menu** - For action lists requiring keyboard navigation
- **Drawer** - Mobile-friendly side panel for larger content
- **Dialog** - Modal overlay for critical interactive content
- **ToggleTip** - Chakra's accessible tooltip alternative that supports keyboard

---

**Research completed:** 2025-11-06
**Component:** Hover Card
**Framework:** Chakra UI (v3.x)
**Documentation:** https://chakra-ui.com/docs/components/hover-card
**Source:** https://github.com/chakra-ui/chakra-ui
**Underlying Library:** Ark UI (https://ark-ui.com)

**Notable Features:**
- Built on Ark UI hover-card primitive for robust hover interactions
- Composition-based API with sub-components (Root, Trigger, Content, Arrow, ArrowTip)
- Portal rendering by default for proper z-index management (popover layer: 1500)
- Hover-optimized timing with configurable open/close delays (default: 700ms open, 300ms close)
- Fast animations (150ms) optimized for hover interactions
- Supports interactive content that remains open when hovering content
- Directional animations based on placement with transform-origin awareness
- Comprehensive positioning system with auto-flip and auto-slide
- Maximum width default of 320px (20rem) with full customization
- Controlled and uncontrolled modes for flexible state management
- Arrow display with automatic positioning based on placement
- Full Chakra style props support for extensive customization
- Responsive positioning that adapts to viewport constraints
- Full TypeScript support with type definitions

**Critical Limitations:**
- **NOT accessible to keyboard users** - cannot be activated via keyboard
- **NOT accessible to screen readers** - content not exposed to assistive technologies
- **NOT usable on touch devices** - hover interactions don't work on mobile
- Should only contain supplementary, non-critical information
- Critical content should use Popover or Tooltip instead
- Always provide alternative access to information

**Key Differences from Popover:**
1. **Trigger Method**: Hover Card uses hover, Popover uses click
2. **Accessibility**: Hover Card is not keyboard/screen reader accessible, Popover is fully accessible
3. **Timing**: Hover Card has delays (700ms/300ms), Popover opens immediately on click
4. **Use Case**: Hover Card for supplementary info, Popover for interactive content that needs accessibility
5. **Close Behavior**: Hover Card closes automatically on mouse leave, Popover requires explicit close action
6. **Animation Speed**: Hover Card is faster (150ms), Popover is slower (300ms open/200ms close)
7. **Modal Support**: Popover has modal mode with focus trap, Hover Card does not
8. **Touch Devices**: Popover works on touch, Hover Card does not (requires workaround)
