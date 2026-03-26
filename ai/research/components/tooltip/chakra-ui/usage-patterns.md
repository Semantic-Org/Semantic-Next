# Chakra UI - Tooltip Component

## Component Overview

The Chakra UI Tooltip component displays additional information when a user hovers over, focuses on, or interacts with an element. It provides contextual help, labels for icon buttons, or supplementary information without cluttering the interface. Built on top of Ark UI's tooltip primitive, it offers comprehensive positioning, timing controls, and accessibility features.

**Core purpose**: Provides contextual information on hover or focus, enhancing user understanding without requiring additional screen space. Essential for icon buttons, truncated text, or providing supplementary context.

**Architecture**: A composition-based component system where `Tooltip.Root` wraps trigger and content elements. The component uses a Portal by default to render tooltips outside the DOM hierarchy, ensuring proper z-index layering. Sub-components include `Trigger`, `Positioner`, `Content`, `Arrow`, and `ArrowTip` for fine-grained control.

**Common use cases**: Icon button labels, truncated text expansion, supplementary information, form field hints, feature explanations, keyboard shortcut displays, status indicators.

## Usage Patterns

### Basic Usage

The simplest Tooltip implementation requires wrapping a trigger element with the Tooltip component and providing content:

```jsx
import { Button } from "@chakra-ui/react"
import { Tooltip } from "compositions/ui/tooltip"

// Basic tooltip with hover trigger
<Tooltip content="This is the tooltip content">
  <Button variant="outline" size="sm">
    Hover me
  </Button>
</Tooltip>

// Tooltip with custom content
<Tooltip content={<span>Custom <strong>HTML</strong> content</span>}>
  <Button>Rich content</Button>
</Tooltip>
```

The composition wrapper provides a simplified API while the underlying structure uses:
```jsx
<Tooltip.Root>
  <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
  <Portal>
    <Tooltip.Positioner>
      <Tooltip.Content>
        {content}
      </Tooltip.Content>
    </Tooltip.Positioner>
  </Portal>
</Tooltip.Root>
```

### Variants/Styles

Chakra UI Tooltip supports visual customization through props and CSS:

**Arrow Display** (`showArrow` prop):
- When true, displays a directional arrow pointing to the trigger element
- Arrow automatically adjusts based on tooltip placement
- Uses `Tooltip.Arrow` and `Tooltip.ArrowTip` sub-components
- Example: `<Tooltip showArrow content="...">`

**Portal Behavior** (`portalled` prop):
- Default: `true` - Renders tooltip in a Portal outside normal DOM flow
- When `false`: Renders tooltip within component tree
- Portal ensures proper z-index stacking and avoids overflow issues
- Example: `<Tooltip portalled={false}>`

**Custom Styling** (`contentProps`):
- Pass style props directly to tooltip content
- Supports all Box/Chakra style props
- Example: `<Tooltip contentProps={{ bg: "blue.500", color: "white" }}>`

**Disabled State** (`disabled` prop):
- When true, tooltip does not render at all
- Returns only the children without tooltip wrapper
- Useful for conditional tooltip display
- Example: `<Tooltip disabled={!showHelp}>`

### States

**Default (Closed)**:
- Tooltip hidden by default
- Trigger element visible and interactive
- No additional DOM elements rendered in Portal

**Open (Visible)**:
- Triggered by hover, focus, or programmatic control
- Content rendered in Portal with positioning
- Arrow (if enabled) points toward trigger
- Animated entrance based on placement

**Interactive Mode** (`interactive` prop):
- When true, tooltip remains open when hovering over tooltip content
- Allows users to interact with links, buttons, or selectable text in tooltip
- Includes slight delay before closing when leaving trigger
- Example: `<Tooltip interactive content="...">`

**Controlled State**:
- Use `open` and `onOpenChange` props for full control
- Enables programmatic tooltip visibility
- Useful for guided tours, form validation, or custom triggers
- Example: `<Tooltip open={isOpen} onOpenChange={(e) => setOpen(e.open)}>`

**Disabled State**:
- Component does not render tooltip wrapper
- Children render without tooltip functionality
- No event listeners attached
- Useful for conditional tooltip display based on user permissions or context

### Sizing Options

Tooltip size is primarily controlled by content width and CSS properties:

**Content Width**:
- Default: Auto-width based on content
- Controlled via `contentProps` with `maxW`, `minW`, or `width`
- Example: `<Tooltip contentProps={{ maxW: "xs" }}>`

**Font Size**:
- Default: Inherits from theme typography scale
- Customizable via `contentProps`
- Example: `<Tooltip contentProps={{ fontSize: "sm" }}>`

**Padding**:
- Default: Theme-based padding (typically `px-3 py-2`)
- Customizable via `contentProps`
- Example: `<Tooltip contentProps={{ px: 4, py: 3 }}>`

### Layout & Positioning

**Placement Options** (`positioning.placement` prop):
- `top`, `top-start`, `top-end`
- `bottom`, `bottom-start`, `bottom-end`
- `left`, `left-start`, `left-end`
- `right`, `right-start`, `right-end`
- Default: `bottom`
- Auto-adjusts if space is insufficient
- Example:
```jsx
<Tooltip
  content="Right-aligned tooltip"
  positioning={{ placement: "right-end" }}
>
  <Button>Hover me</Button>
</Tooltip>
```

**Offset Control** (`positioning.offset` prop):
- `mainAxis`: Distance along the main placement axis (default: 8px)
- `crossAxis`: Distance along the cross placement axis
- Useful for fine-tuning tooltip distance from trigger
- Example:
```jsx
<Tooltip
  content="Custom offset"
  positioning={{ offset: { mainAxis: 12, crossAxis: 4 } }}
>
  <Button>Hover me</Button>
</Tooltip>
```

**Portal Container** (`portalRef` prop):
- Specify custom container for Portal rendering
- Useful for modal dialogs, drawers, or constrained layouts
- Default: Document body
- Example: `<Tooltip portalRef={containerRef}>`

**Z-Index Management**:
- Tooltips render in Portal with high z-index by default
- Ensures visibility above most UI elements
- Customizable via `contentProps` and theme configuration

### Content & Structure

**Text Content**:
- Simple string content: `content="Tooltip text"`
- Multi-line text supported with proper line breaks
- Typography inherits from theme

**Rich HTML Content**:
- React nodes supported: `content={<span>Rich <strong>text</strong></span>}`
- Supports nested elements, icons, links
- Custom formatting with inline styles or classes

**Interactive Content**:
- Links, buttons, and interactive elements
- Requires `interactive={true}` prop
- Tooltip remains open when hovering content
- Example:
```jsx
<Tooltip
  interactive
  content={
    <div>
      Learn more at <a href="/docs">documentation</a>
    </div>
  }
>
  <Button>Info</Button>
</Tooltip>
```

**Arrow Display**:
- Optional arrow via `showArrow={true}`
- Arrow points toward trigger element
- Automatically positions based on placement
- Customizable via CSS (arrow size, color)

**Sub-component Hierarchy** (when using raw components):
```
Tooltip.Root (state management)
├── Tooltip.Trigger (trigger element wrapper)
└── Portal (optional)
    └── Tooltip.Positioner (positioning logic)
        └── Tooltip.Content (tooltip content)
            └── Tooltip.Arrow (optional)
                └── Tooltip.ArrowTip (arrow styling)
```

### Interactive Features

**Hover Trigger** (Default):
- Opens on mouse enter
- Closes on mouse leave
- Respects `openDelay` and `closeDelay` timing

**Focus Trigger**:
- Opens when trigger element receives keyboard focus
- Closes when focus leaves
- Essential for keyboard accessibility

**Controlled Display**:
- Use `open` prop for manual control
- Combine with `onOpenChange` for two-way binding
- Example:
```jsx
const [open, setOpen] = useState(false)
return (
  <Tooltip
    content="Controlled tooltip"
    open={open}
    onOpenChange={(e) => setOpen(e.open)}
  >
    <Button onClick={() => setOpen(!open)}>
      {open ? "Hide" : "Show"} tooltip
    </Button>
  </Tooltip>
)
```

**Interactive Mode**:
- `interactive={true}` keeps tooltip open when hovering content
- Enables clicking links, selecting text, interacting with buttons
- Slight delay before closing when mouse leaves

**Programmatic Control**:
- Access via controlled state
- Useful for guided tours, validation feedback
- Can trigger from external events

### Animation & Transitions

**Entrance Animation**:
- Fade-in with subtle scale effect
- Direction-aware slide based on placement
- CSS-based animation for smooth performance
- Duration: ~200ms (theme configurable)

**Exit Animation**:
- Fade-out with reverse scale
- Matches entrance animation
- Consistent timing for polished feel

**Delay Controls**:
- `openDelay`: Time before tooltip appears after trigger (default: 0ms)
- `closeDelay`: Time before tooltip disappears after mouse leave (default: 0ms)
- Example:
```jsx
<Tooltip
  content="Delayed tooltip"
  openDelay={500}
  closeDelay={100}
>
  <Button>Hover me</Button>
</Tooltip>
```

**Transition Easing**:
- CSS cubic-bezier for natural motion
- Configurable via theme animation tokens
- Smooth, non-jarring user experience

### Integration Patterns

**Icon Button Labels**:
```jsx
<Tooltip content="Save document">
  <IconButton aria-label="Save" icon={<SaveIcon />} />
</Tooltip>
```

**Form Field Hints**:
```jsx
<FormLabel>
  Password
  <Tooltip content="Minimum 8 characters with uppercase, lowercase, and numbers">
    <Icon as={InfoIcon} ml={2} />
  </Tooltip>
</FormLabel>
```

**Truncated Text Preview**:
```jsx
<Tooltip content={fullText}>
  <Text isTruncated maxW="200px">
    {longText}
  </Text>
</Tooltip>
```

**Keyboard Shortcut Display**:
```jsx
<Tooltip content={<><Kbd>Ctrl</Kbd> + <Kbd>S</Kbd></>}>
  <MenuItem>Save</MenuItem>
</Tooltip>
```

**Disabled Button Explanation**:
```jsx
<Tooltip content="Complete previous step to continue">
  <Button isDisabled>Next Step</Button>
</Tooltip>
```

**Multi-line Information**:
```jsx
<Tooltip
  content={
    <Stack spacing={1}>
      <Text fontWeight="bold">Pro Feature</Text>
      <Text fontSize="sm">Upgrade to access this feature</Text>
    </Stack>
  }
>
  <Badge>Pro</Badge>
</Tooltip>
```

### Accessibility Features

**ARIA Attributes**:
- `role="tooltip"` automatically applied to content
- `aria-describedby` links trigger to tooltip content
- Proper ID management for screen reader association
- `aria-hidden` manages visibility states

**Keyboard Support**:
- Tooltip opens on trigger focus (Tab key)
- Closes when focus leaves trigger
- Esc key closes tooltip
- Interactive tooltips support Tab navigation within content

**Screen Reader Announcements**:
- Tooltip content announced when trigger receives focus
- Proper labeling with `aria-describedby`
- Non-interactive by default (content not in tab order)
- Interactive mode includes content in focus order

**Focus Management**:
- Focus remains on trigger by default
- Interactive mode allows focus within tooltip
- Focus returns to trigger when tooltip closes
- No focus traps unless using interactive mode with focusable content

**Color Contrast**:
- Default styling meets WCAG AA contrast requirements
- Dark background with light text for visibility
- Customizable for theme compliance
- Works in both light and dark modes

**Semantic HTML**:
- Uses proper ARIA roles and attributes
- Trigger element maintains semantic meaning
- Tooltip content is supplementary, not required for understanding

## Key Properties/Props

### Tooltip (Composition Wrapper) Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `React.ReactNode` | **Required** | The content to display in the tooltip |
| `showArrow` | `boolean` | `false` | Whether to display an arrow pointing to the trigger |
| `portalled` | `boolean` | `true` | Whether to render tooltip in a Portal outside the DOM tree |
| `portalRef` | `React.RefObject<HTMLElement>` | `undefined` | Custom container for Portal rendering |
| `disabled` | `boolean` | `false` | When true, tooltip does not render |
| `contentProps` | `ChakraTooltip.ContentProps` | `undefined` | Additional props passed to Tooltip.Content component |
| `children` | `React.ReactNode` | **Required** | The trigger element that activates the tooltip |

### Tooltip.Root Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `undefined` | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(details: { open: boolean }) => void` | `undefined` | Callback when open state changes |
| `openDelay` | `number` | `0` | Delay in milliseconds before opening |
| `closeDelay` | `number` | `0` | Delay in milliseconds before closing |
| `interactive` | `boolean` | `false` | Whether tooltip content can be interacted with |
| `disabled` | `boolean` | `false` | Whether tooltip is disabled |
| `positioning` | `PositioningOptions` | See below | Positioning configuration |
| `closeOnScroll` | `boolean` | `true` | Whether to close tooltip on scroll |
| `closeOnPointerDown` | `boolean` | `true` | Whether to close on pointer down outside |

### Positioning Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placement` | `Placement` | `"bottom"` | Tooltip placement relative to trigger |
| `offset` | `{ mainAxis?: number, crossAxis?: number }` | `{ mainAxis: 8 }` | Distance from trigger element |
| `gutter` | `number` | `8` | Minimum distance from viewport edge |
| `flip` | `boolean` | `true` | Whether to flip placement if space insufficient |
| `slide` | `boolean` | `true` | Whether to slide along axis if space insufficient |
| `overlap` | `boolean` | `false` | Whether tooltip can overlap trigger |
| `sameWidth` | `boolean` | `false` | Whether tooltip width matches trigger width |
| `fitViewport` | `boolean` | `false` | Whether to constrain tooltip within viewport |
| `strategy` | `"absolute" \| "fixed"` | `"absolute"` | CSS positioning strategy |

### Placement Values

Available placement options for `positioning.placement`:
- `"top"`, `"top-start"`, `"top-end"`
- `"bottom"`, `"bottom-start"`, `"bottom-end"`
- `"left"`, `"left-start"`, `"left-end"`
- `"right"`, `"right-start"`, `"right-end"`

### Tooltip.Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Whether to render as child element |
| All Chakra Box props | Various | - | Accepts all style and layout props (bg, color, p, etc.) |

### Tooltip.Trigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `true` | Whether to render as child element (passes props to child) |

### Tooltip.Arrow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `string \| number` | `undefined` | Arrow size |

## Code Examples

### Example 1: Basic Tooltip
```jsx
import { Button } from "@chakra-ui/react"
import { Tooltip } from "compositions/ui/tooltip"

export const TooltipBasic = () => {
  return (
    <Tooltip content="This is the tooltip content">
      <Button variant="outline" size="sm">
        Hover me
      </Button>
    </Tooltip>
  )
}
```

### Example 2: Tooltip with Arrow
```jsx
import { Button } from "@chakra-ui/react"
import { Tooltip } from "compositions/ui/tooltip"

export const TooltipWithArrow = () => {
  return (
    <Tooltip showArrow content="This is the tooltip content">
      <Button variant="outline" size="sm">
        Hover me
      </Button>
    </Tooltip>
  )
}
```

### Example 3: Custom Placement
```jsx
import { Button, Stack } from "@chakra-ui/react"
import { Tooltip } from "compositions/ui/tooltip"

export const TooltipWithPlacement = () => {
  return (
    <Stack direction="row" spacing={4}>
      <Tooltip
        content="Top placement"
        positioning={{ placement: "top" }}
      >
        <Button>Top</Button>
      </Tooltip>
      <Tooltip
        content="Right placement"
        positioning={{ placement: "right" }}
      >
        <Button>Right</Button>
      </Tooltip>
      <Tooltip
        content="Bottom placement"
        positioning={{ placement: "bottom" }}
      >
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip
        content="Left placement"
        positioning={{ placement: "left" }}
      >
        <Button>Left</Button>
      </Tooltip>
    </Stack>
  )
}
```

### Example 4: Delayed Tooltip
```jsx
import { Button } from "@chakra-ui/react"
import { Tooltip } from "compositions/ui/tooltip"

export const TooltipWithDelay = () => {
  return (
    <Tooltip
      content="This tooltip appears after 500ms"
      openDelay={500}
      closeDelay={100}
    >
      <Button variant="outline" size="sm">
        Hover me (delayed)
      </Button>
    </Tooltip>
  )
}
```

### Example 5: Interactive Tooltip
```jsx
import { Button, Link } from "@chakra-ui/react"
import { Tooltip } from "compositions/ui/tooltip"

export const TooltipWithInteractive = () => {
  return (
    <Tooltip
      interactive
      content={
        <div>
          Visit our <Link href="/docs" color="blue.300">documentation</Link> for more info
        </div>
      }
    >
      <Button variant="outline" size="sm">
        Hover me
      </Button>
    </Tooltip>
  )
}
```

### Example 6: Controlled Tooltip
```jsx
"use client"

import { Button } from "@chakra-ui/react"
import { Tooltip } from "compositions/ui/tooltip"
import { useState } from "react"

export const TooltipControlled = () => {
  const [open, setOpen] = useState(false)

  return (
    <Tooltip
      content="Controlled tooltip content"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Button size="sm" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} tooltip
      </Button>
    </Tooltip>
  )
}
```

### Example 7: Disabled Tooltip
```jsx
import { Button } from "@chakra-ui/react"
import { Tooltip } from "compositions/ui/tooltip"
import { useState } from "react"

export const TooltipWithDisabled = () => {
  const [showTooltip, setShowTooltip] = useState(true)

  return (
    <div>
      <Tooltip content="This tooltip can be toggled" disabled={!showTooltip}>
        <Button variant="outline" size="sm">
          Hover me
        </Button>
      </Tooltip>
      <Button ml={4} size="sm" onClick={() => setShowTooltip(!showTooltip)}>
        {showTooltip ? "Disable" : "Enable"} Tooltip
      </Button>
    </div>
  )
}
```

### Example 8: Custom Offset
```jsx
import { Button } from "@chakra-ui/react"
import { Tooltip } from "compositions/ui/tooltip"

export const TooltipWithOffset = () => {
  return (
    <Tooltip
      content="This tooltip has custom offset"
      showArrow
      positioning={{ offset: { mainAxis: 16, crossAxis: 8 } }}
    >
      <Button variant="outline" size="sm">
        Hover me
      </Button>
    </Tooltip>
  )
}
```

### Example 9: Icon Button with Tooltip
```jsx
import { IconButton } from "@chakra-ui/react"
import { Tooltip } from "compositions/ui/tooltip"
import { LuSave } from "react-icons/lu"

export const TooltipIconButton = () => {
  return (
    <Tooltip content="Save your changes">
      <IconButton aria-label="Save" size="sm">
        <LuSave />
      </IconButton>
    </Tooltip>
  )
}
```

### Example 10: Rich Content Tooltip
```jsx
import { Button, Stack, Text } from "@chakra-ui/react"
import { Tooltip } from "compositions/ui/tooltip"

export const TooltipRichContent = () => {
  return (
    <Tooltip
      showArrow
      interactive
      contentProps={{ maxW: "xs" }}
      content={
        <Stack spacing={2}>
          <Text fontWeight="bold" fontSize="sm">
            Pro Feature
          </Text>
          <Text fontSize="xs" color="gray.300">
            Upgrade to Pro to access advanced analytics and reporting features.
          </Text>
          <Button size="xs" colorScheme="blue" mt={2}>
            Upgrade Now
          </Button>
        </Stack>
      }
    >
      <Button variant="outline" size="sm">
        View Analytics
      </Button>
    </Tooltip>
  )
}
```

## Accessibility Notes

**ARIA Implementation**:
- Tooltip.Content has `role="tooltip"` automatically applied
- Trigger element has `aria-describedby` pointing to tooltip ID
- Proper association between trigger and content for screen readers
- `aria-hidden` manages visibility for assistive technology

**Keyboard Navigation**:
- Tooltip opens when trigger receives keyboard focus (Tab)
- Closes when focus leaves trigger or Esc key pressed
- Interactive tooltips allow Tab navigation within content
- Focus returns to trigger when tooltip closes
- No keyboard trap unless using interactive mode with complex content

**Screen Reader Support**:
- Tooltip content announced when trigger receives focus
- Descriptive relationship via `aria-describedby`
- Content provides supplementary information, not critical UI
- Non-interactive by default (content not in focus order)
- Interactive mode includes tooltip in document flow for screen readers

**Focus Management**:
- Focus remains on trigger by default (recommended pattern)
- Interactive tooltips allow focus within content
- Proper focus restoration on close
- No unintended focus traps
- Tab order maintained for interactive content

**Color and Contrast**:
- Default theme provides WCAG AA compliant contrast
- Dark background with light text for high visibility
- Customizable color schemes maintain accessibility
- Arrow color matches tooltip background
- Works in both light and dark color modes

**Best Practices**:
- Keep tooltip content concise and scannable
- Use for supplementary information, not critical content
- Ensure trigger element has proper semantic meaning
- Provide aria-label for icon-only triggers
- Test with keyboard navigation and screen readers
- Avoid nesting interactive elements unless using interactive mode
- Consider touch device users (may need tap to activate)

**Touch Device Considerations**:
- Hover tooltips may not work well on touch devices
- Consider using click/tap trigger or interactive mode
- Mobile devices may require explicit tap to show tooltip
- Ensure alternative access method for touch users

## Common Patterns

1. **Icon Button Labels**: Provide accessible labels for icon-only buttons to explain their purpose
2. **Truncated Text Preview**: Show full text content when hovering over truncated or ellipsized text
3. **Form Field Help**: Display additional context, requirements, or examples for form fields
4. **Feature Explanations**: Provide brief explanations of features or UI elements for new users
5. **Keyboard Shortcuts**: Display keyboard shortcuts for actions (e.g., "Save (Ctrl+S)")
6. **Status Information**: Show detailed status, timestamps, or metadata for items in a list
7. **Disabled Element Explanation**: Explain why a button or feature is disabled and how to enable it
8. **Link Previews**: Show URL or destination preview before clicking a link
9. **Error Details**: Provide additional context for validation errors or warnings
10. **Progress Information**: Display detailed progress information for loading or processing states

## Related Components

- **Popover** - Similar positioning but for interactive content requiring clicks (use when content is more complex or interactive)
- **Menu** - For action lists (use when user needs to select from options)
- **Portal** - Used internally by Tooltip to render outside DOM tree (ensures proper z-index)
- **Positioner** - Handles tooltip positioning logic (placement, flip, offset calculations)
- **IconButton** - Common trigger element for tooltips (provides accessible buttons with icon-only UI)
- **Badge** - Often paired with tooltips to explain status or category
- **HoverCard** - Alternative for richer content that needs more space (similar but more prominent)
- **Alert** - For persistent, important messages (use when information must be seen)
- **Toast** - For temporary notifications (use for feedback after actions)

---

**Research completed:** 2025-11-06
**Component:** Tooltip
**Framework:** Chakra UI
**Documentation:** https://chakra-ui.com/docs/components/tooltip
**Source:** https://github.com/chakra-ui/chakra-ui

**Notable Features:**
- Built on Ark UI tooltip primitive for robust positioning and interactions
- Composition-based API with fine-grained control via sub-components
- Portal rendering by default for proper z-index management
- Interactive mode for tooltips with clickable content
- Comprehensive positioning options with auto-flip and auto-slide
- Configurable delays for open and close timing
- Full keyboard and screen reader accessibility
- Controlled and uncontrolled modes for flexibility
- Arrow display with automatic positioning
- Rich content support with React nodes
- Responsive to viewport constraints with intelligent placement
- TypeScript support with full type definitions
