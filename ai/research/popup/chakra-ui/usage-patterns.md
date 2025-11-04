# Chakra UI - Popover Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://chakra-ui.com/docs/components/popover (v3)
https://v2.chakra-ui.com/docs/components/popover (v2)
Status: ✅ Working
Version: v3 (Latest) / v2 (Stable)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - Excellent component documentation with multiple code examples, theming guidance, accessibility features, and clear API reference. Documentation available for both v2 and v3 with migration path.

## Component Definition
- **Core purpose**: Displays contextual information or interactive content in a floating overlay that appears when triggered, providing detailed information without navigating away from the current context.
- **Mental model**: A layered disclosure component - starts with a trigger element that reveals content in a floating container with smart positioning, focus management, and flexible composition patterns.
- **Semantic meaning**: Communicates supplementary information, contextual actions, or form inputs that enhance the primary interface without overwhelming it. Different from tooltips (which are read-only) by supporting interactive content.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `placement`, `isOpen`, `closeOnBlur`, `initialFocusRef`)
- **Composed**: Via composition/children (e.g., `<PopoverHeader>`, `<PopoverBody>`, `<PopoverFooter>`, Portal wrapping)
- **CSS-only**: Requires custom styling (e.g., custom arrow styles, animations beyond defaults)

## Trigger Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click trigger | ✅ | Native | Default trigger mode. v2: `trigger="click"` (default). v3: Default behavior in `Popover.Root` |
| Hover trigger | ✅ | Native | v2: `trigger="hover"`. v3: Likely via `openOnHover` or similar prop (not explicitly documented in search results) |
| Focus trigger | ✅ | Native | Automatic focus management. `initialFocusRef` prop targets specific element on open |
| Manual control | ✅ | Native | v2: `isOpen`, `onOpen`, `onClose` props with `useDisclosure` hook. v3: `open`, `onOpenChange` props for controlled state |
| External trigger | ✅ | Composed | Trigger button can be separate from target via `PopoverTrigger` wrapping any element |
| Programmatic | ✅ | Native | Controlled via state: v2 uses `isOpen`, v3 uses `open` prop |
| Keyboard (Enter/Space) | ✅ | Native | Automatic on trigger elements with proper `role="button"` or button elements |
| Custom trigger element | ✅ | Composed | v2: Any element wrapped in `PopoverTrigger`. v3: Uses `asChild` prop to compose with custom elements |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Header section | ✅ | Composed | v2: `<PopoverHeader>`. v3: `<Popover.Title>` component for semantic heading |
| Body content | ✅ | Composed | v2: `<PopoverBody>`. v3: `<Popover.Body>` for main content area |
| Footer section | ✅ | Composed | v2: `<PopoverFooter>` with flex layout support. v3: Likely `<Popover.Footer>` (not shown in examples but follows pattern) |
| Close button | ✅ | Composed | v2: `<PopoverCloseButton>` auto-positioned. v3: `<Popover.CloseTrigger>` for dismissal |
| Arrow/pointer | ✅ | Composed | v2: `<PopoverArrow>`. v3: `<Popover.Arrow>` with customizable background color |
| Rich content | ✅ | Composed | Children accept any ReactNode - forms, buttons, images, text, etc. |
| Form inputs | ✅ | Composed | Full form support with focus management via `initialFocusRef` |
| Action buttons | ✅ | Composed | ButtonGroup patterns shown in footer examples |
| Custom components | ✅ | Composed | Any React components can be children of content sections |
| Nested elements | ✅ | Composed | Complex layouts supported with Stack, Box, and other layout components |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Placement options | ✅ | Native | v2: `placement` prop with 12 options: `top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`. v3: `positioning={{ placement: "value" }}` object syntax |
| Auto positioning | ✅ | Native | v2: `auto`, `auto-start`, `auto-end` placements. Smart flip behavior to prevent overflow |
| Offset/spacing | ✅ | Native | v2: `gutter` prop (default: 8) for spacing from trigger, `offset` prop for [x, y] adjustment. v3: `positioning={{ offset: {...} }}` |
| Flip on overflow | ✅ | Native | Automatic flipping when popover would overflow viewport boundaries |
| Boundary detection | ✅ | Native | v2: `boundary` prop (default: `clippingParents`) to define overflow container. Prevents popover from escaping scrollable areas |
| Match trigger width | ✅ | Native | v3: Can match trigger width via positioning configuration |
| Portal rendering | ✅ | Composed | v2/v3: `<Portal>` wrapper renders content at document root for proper stacking context |
| Z-index control | ✅ | CSS-only | Themeable z-index via design tokens (default: 1500 for popovers) |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Close on blur | ✅ | Native | v2: `closeOnBlur={true}` (default: true). Closes when clicking outside popover |
| Close on ESC | ✅ | Native | v2: `closeOnEsc={true}` (default: true). Keyboard dismissal |
| Focus trap | ✅ | Composed | v2: Requires external `react-focus-lock` library. Example shows `<FocusLock>` wrapper for forms |
| Initial focus | ✅ | Native | v2: `initialFocusRef` targets element to focus on open. v3: Similar ref-based focus control |
| Return focus | ✅ | Native | v2: `returnFocusOnClose` (default: true) returns focus to trigger on close |
| Lazy mounting | ✅ | Native | v2: `isLazy={true}` defers rendering until first open. v3: `lazyMount={true}` with `unmountOnExit` for cleanup |
| Lazy behavior | ✅ | Native | v2: `lazyBehavior="unmount" \| "keepMounted"` controls whether content unmounts after first render |
| Animation/transitions | ✅ | CSS-only | Fade transitions via Chakra's motion components. Customizable via theme |
| Prevent scroll | ✅ | Native | Automatic scroll lock management when popover is open (if needed) |
| Click outside | ✅ | Native | Handled by `closeOnBlur`. Can disable for persistent popovers |
| Anchor positioning | ✅ | Composed | v2: `<PopoverAnchor>` allows positioning relative to different element than trigger |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled state | ✅ | Native | v2: `isOpen`, `onOpen`, `onClose` with `useDisclosure()` hook. v3: `open`, `onOpenChange` callback |
| Uncontrolled state | ✅ | Native | Default behavior - component manages its own open/close state internally |
| Render props | ✅ | Native | v2: Children function receives `{ isOpen, onClose }` for internal state access |
| Multiple popovers | ✅ | Native | Multiple independent popovers supported on same page |
| Nested popovers | ✅ | Native | Popovers can contain other popovers with proper portal stacking |
| Event callbacks | ✅ | Native | v2: `onOpen`, `onClose`. v3: `onOpenChange` event with open state |
| Custom close logic | ✅ | Composed | Close button actions fully customizable via onClick handlers |
| Form submission | ✅ | Composed | Examples show form patterns with validation and submission handling |
| Async loading | ✅ | Composed | Content can show loading states, spinners, or skeleton screens |
| Persistent popover | ✅ | Native | Set `closeOnBlur={false}` to keep popover open until explicit close |

## Code Examples

### Basic Usage (v2)
```jsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
} from '@chakra-ui/react'

<Popover>
  <PopoverTrigger>
    <Button>Trigger</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverArrow />
    <PopoverCloseButton />
    <PopoverHeader>Confirmation!</PopoverHeader>
    <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
  </PopoverContent>
</Popover>
```

### Basic Usage (v3)
```jsx
import { Button, Popover, Portal, Text } from "@chakra-ui/react"

const Demo = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button size="sm" variant="outline">
          Click me
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Popover.Title fontWeight="medium">Naruto Form</Popover.Title>
              <Text my="4">
                Naruto is a Japanese manga series written and illustrated by Masashi Kishimoto.
              </Text>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
```

### Portal Rendering for Stacking Context (v2)
```jsx
<Popover>
  <PopoverTrigger>
    <Button>Trigger</Button>
  </PopoverTrigger>
  <Portal>
    <PopoverContent>
      <PopoverArrow />
      <PopoverHeader>Header</PopoverHeader>
      <PopoverCloseButton />
      <PopoverBody>
        <Button colorScheme='blue'>Button</Button>
      </PopoverBody>
      <PopoverFooter>This is the footer</PopoverFooter>
    </PopoverContent>
  </Portal>
</Popover>
```

### Focus Management (v2)
```jsx
function WalkthroughPopover() {
  const initialFocusRef = React.useRef()

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement='bottom'
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Button>Trigger</Button>
      </PopoverTrigger>
      <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
        <PopoverHeader pt={4} fontWeight='bold' border='0'>
          Manage Your Channels
        </PopoverHeader>
        <PopoverArrow bg='blue.800' />
        <PopoverCloseButton />
        <PopoverBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore.
        </PopoverBody>
        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
        >
          <Box fontSize='sm'>Step 2 of 4</Box>
          <ButtonGroup size='sm'>
            <Button colorScheme='green'>Setup Email</Button>
            <Button colorScheme='blue' ref={initialFocusRef}>
              Next
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
```

### Focus Trap with Form (v2)
```jsx
const TextInput = React.forwardRef((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Input ref={ref} id={props.id} {...props} />
    </FormControl>
  )
})

const Form = ({ firstFieldRef, onCancel }) => {
  return (
    <Stack spacing={4}>
      <TextInput
        label='First name'
        id='first-name'
        ref={firstFieldRef}
        defaultValue='John'
      />
      <TextInput label='Last name' id='last-name' defaultValue='Smith' />
      <ButtonGroup display='flex' justifyContent='flex-end'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button isDisabled colorScheme='teal'>
          Save
        </Button>
      </ButtonGroup>
    </Stack>
  )
}

const PopoverForm = () => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const firstFieldRef = React.useRef(null)

  return (
    <>
      <Box display='inline-block' mr={3}>
        John Smith
      </Box>
      <Popover
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        placement='right'
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <IconButton size='sm' icon={<EditIcon />} />
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            <Form firstFieldRef={firstFieldRef} onCancel={onClose} />
          </FocusLock>
        </PopoverContent>
      </Popover>
    </>
  )
}
```

### Controlled Usage (v2)
```jsx
function ControlledUsage() {
  const { isOpen, onToggle, onClose } = useDisclosure()

  return (
    <>
      <Button mr={5} onClick={onToggle}>
        Trigger
      </Button>
      <Popover
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
        placement='right'
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <Button colorScheme='pink'>Popover Target</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            Are you sure you want to continue with your action?
          </PopoverBody>
          <PopoverFooter display='flex' justifyContent='flex-end'>
            <ButtonGroup size='sm'>
              <Button variant='outline'>Cancel</Button>
              <Button colorScheme='red'>Apply</Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </>
  )
}
```

### Controlled Usage (v3)
```jsx
"use client"
import { Button, Popover, Portal } from "@chakra-ui/react"
import { useState } from "react"

const Demo = () => {
  const [open, setOpen] = useState(false)

  return (
    <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Popover.Trigger asChild>
        <Button size="sm" variant="outline">
          Click me
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              This is a controlled popover
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
```

### PopoverAnchor Pattern (v2)
```jsx
function WithPopoverAnchor() {
  const [isEditing, setIsEditing] = useBoolean()
  const [color, setColor] = React.useState('red')

  return (
    <Popover
      isOpen={isEditing}
      onOpen={setIsEditing.on}
      onClose={setIsEditing.off}
      closeOnBlur={false}
      isLazy
      lazyBehavior='keepMounted'
    >
      <HStack>
        <PopoverAnchor>
          <Input
            color={color}
            w='auto'
            display='inline-flex'
            isDisabled={!isEditing}
            defaultValue='Popover Anchor'
          />
        </PopoverAnchor>
        <PopoverTrigger>
          <Button h='40px' colorScheme='pink'>
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </PopoverTrigger>
      </HStack>
      <PopoverContent>
        <PopoverBody>
          Colors:
          <RadioGroup value={color} onChange={(newColor) => setColor(newColor)}>
            <Radio value='red'>red</Radio>
            <Radio value='blue'>blue</Radio>
            <Radio value='green'>green</Radio>
            <Radio value='purple'>purple</Radio>
          </RadioGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
```

### Render Props for Internal State (v2)
```jsx
function InternalStateEx() {
  const initRef = React.useRef()

  return (
    <Popover closeOnBlur={false} placement='left' initialFocusRef={initRef}>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <Button>Click to {isOpen ? 'close' : 'open'}</Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverHeader>This is the header</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Box>
                  Hello. Nice to meet you! This is the body of the popover
                </Box>
                <Button
                  mt={4}
                  colorScheme='blue'
                  onClick={onClose}
                  ref={initRef}
                >
                  Close
                </Button>
              </PopoverBody>
              <PopoverFooter>This is the footer</PopoverFooter>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  )
}
```

### Custom Styling (v2)
```jsx
<Popover>
  <PopoverTrigger>
    <Box
      tabIndex='0'
      role='button'
      aria-label='Some box'
      p={5}
      w='120px'
      bg='gray.300'
      children='Click'
    />
  </PopoverTrigger>
  <PopoverContent bg='tomato' color='white'>
    <PopoverHeader fontWeight='semibold'>Customization</PopoverHeader>
    <PopoverArrow bg='pink.500' />
    <PopoverCloseButton bg='purple.500' />
    <PopoverBody>
      Tadaa!! The arrow color and background color is customized. Check the
      props for each component.
    </PopoverBody>
  </PopoverContent>
</Popover>
```

### Placement Options (v2)
```jsx
// Available placements:
// top-start, top, top-end
// bottom-start, bottom, bottom-end
// left-start, left, left-end
// right-start, right, right-end
// auto-start, auto, auto-end

<Popover placement='top-start'>
  <PopoverTrigger>
    <Button>Click me</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader fontWeight='semibold'>Popover placement</PopoverHeader>
    <PopoverArrow />
    <PopoverCloseButton />
    <PopoverBody>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore.
    </PopoverBody>
  </PopoverContent>
</Popover>
```

### Placement Options (v3)
```jsx
<Popover.Root positioning={{ placement: "bottom-end" }}>
  <Popover.Trigger asChild>
    <Button size="sm" variant="outline">
      Click me
    </Button>
  </Popover.Trigger>
  <Portal>
    <Popover.Positioner>
      <Popover.Content>
        <Popover.Arrow />
        <Popover.Body>
          Positioned at bottom-end
        </Popover.Body>
      </Popover.Content>
    </Popover.Positioner>
  </Portal>
</Popover.Root>
```

### Lazy Rendering (v2)
```jsx
<Popover isLazy>
  <PopoverTrigger>
    <Button>Click me</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader fontWeight='semibold'>Lazy loaded content</PopoverHeader>
    <PopoverArrow />
    <PopoverCloseButton />
    <PopoverBody>
      This content is only rendered when the popover opens for the first time.
    </PopoverBody>
  </PopoverContent>
</Popover>
```

### Lazy Rendering (v3)
```jsx
<Popover.Root lazyMount unmountOnExit>
  <Popover.Trigger asChild>
    <Button size="sm" variant="outline">
      Click me
    </Button>
  </Popover.Trigger>
  <Portal>
    <Popover.Positioner>
      <Popover.Content>
        <Popover.Arrow />
        <Popover.Body>
          Lazy loaded and unmounted on exit
        </Popover.Body>
      </Popover.Content>
    </Popover.Positioner>
  </Portal>
</Popover.Root>
```

### Theme Customization (v2)
```jsx
import { popoverAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

// Base style customization
const baseStyle = definePartsStyle({
  body: {
    bg: 'gray.800',
  },
  content: {
    padding: 3,
  },
})

export const popoverTheme = defineMultiStyleConfig({ baseStyle })

// Custom size
const sizes = {
  xl: definePartsStyle({
    header: defineStyle({
      padding: 14
    }),
    content: defineStyle({
      fontSize: "2xl",
      marginLeft: 6
    })
  }),
}

export const popoverTheme = defineMultiStyleConfig({ sizes })

// Usage
<Popover size="xl">
  {/* ... */}
</Popover>

// Custom variant
const custom = definePartsStyle({
  content: defineStyle({
    padding: 7,
    bg: "gray.700"
  }),
  footer: defineStyle({
    fontSize: "xl"
  })
})

export const popoverTheme = defineMultiStyleConfig({
  variants: { custom },
})

// Usage
<Popover variant="custom">
  {/* ... */}
</Popover>
```

## Notable Features

### Composition-Based Architecture (v3)
- New v3 API uses `Popover.Root`, `Popover.Trigger`, `Popover.Content` pattern
- `asChild` prop on `Popover.Trigger` enables composition with any element
- `Popover.Positioner` wrapper provides positioning context
- Aligns with React component composition best practices
- Built on Ark UI for battle-tested accessibility

### Multi-Part Component System (v2)
- Popover broken into semantic parts: Header, Body, Footer, Arrow, CloseButton
- Each part independently styleable and themeable
- Anatomy-based theming via `@chakra-ui/anatomy`
- Enables precise customization without fighting specificity

### Focus Management Excellence
- `initialFocusRef` for targeting first focusable element
- `returnFocusOnClose` ensures proper focus return to trigger
- Works seamlessly with external focus-lock libraries
- Essential for accessibility and keyboard navigation
- Proper tab order maintenance within popover

### PopoverAnchor Flexibility
- Separate trigger from positioning anchor
- Enables edit-in-place patterns
- Trigger can be visually separate from anchored content
- Advanced pattern for complex UIs

### Render Props Pattern (v2)
- Children function receives `{ isOpen, onClose }`
- Enables conditional rendering based on internal state
- No need for external state management
- Trigger button can show open/close state

### Portal Rendering for Z-Index
- `<Portal>` wrapper renders content at document root
- Solves stacking context issues automatically
- Prevents overflow clipping from parent containers
- Essential for proper layering in complex layouts

### Smart Positioning System
- 15 placement options (12 directional + 3 auto)
- Auto-flip prevents viewport overflow
- `gutter` and `offset` for fine-tuned spacing
- `boundary` prop respects scroll containers
- Powered by floating-ui (formerly Popper.js)

### Lazy Rendering Optimization
- `isLazy` defers mounting until first open (v2)
- `lazyMount` and `unmountOnExit` in v3
- `lazyBehavior` controls persistence after first render
- Improves initial page load performance
- Critical for pages with many popovers

### Behavior Customization
- `closeOnBlur` for click-outside dismissal
- `closeOnEsc` for keyboard dismissal
- Both can be disabled for persistent popovers
- Enables tooltip-like behavior (hover + no close)
- Full control over interaction model

### useDisclosure Hook Integration (v2)
- Provides `isOpen`, `onOpen`, `onClose`, `onToggle`
- Consistent state management across Chakra components
- Simplifies controlled component patterns
- Reduces boilerplate for common interactions

### Theme System Integration
- Multi-part component theming support
- Custom variants, sizes, and base styles
- Seamless light/dark mode support
- Design token integration (colors, spacing, z-index)
- Global theme overrides vs per-instance styling

### Accessibility First
- Automatic ARIA attributes
- Keyboard navigation (Enter, Space, Escape)
- Focus management and trapping
- Screen reader announcements
- Follows WAI-ARIA Popover pattern

### Trigger Flexibility
- Click (default), hover, focus modes
- Any element can be trigger with proper wrapping
- Custom trigger elements via composition
- Programmatic control via state
- Multiple triggers for same popover possible

### Form Integration Patterns
- Full form support with validation
- Focus management for multi-step forms
- ButtonGroup patterns for actions
- Input components as triggers
- Edit-in-place with PopoverAnchor

## Research Notes

### Access & Documentation
- Documentation successfully accessed at both v2 and v3 URLs
- v3 represents major API redesign with composition pattern
- v2 documentation more comprehensive with examples
- GitHub source available for both versions
- Storybook examples referenced for interactive demos

### Framework Approach Observations

**Version Evolution:**
- v2 uses flat component names: `Popover`, `PopoverTrigger`, `PopoverContent`
- v3 uses namespace pattern: `Popover.Root`, `Popover.Trigger`, `Popover.Content`
- v3 built on Ark UI foundation for cross-framework compatibility
- Migration path requires code changes but concepts remain similar

**Composition Philosophy:**
- v3 `asChild` prop enables true component composition
- Avoids render prop complexity for simple cases
- `Popover.Positioner` wrapper clarifies positioning responsibility
- Portal rendering explicit and composable

**State Management Patterns:**
- v2: `useDisclosure` hook provides standard state interface
- v3: `open`/`onOpenChange` follows controlled component conventions
- Render props (v2) provide internal state access without hooks
- Both support fully controlled and uncontrolled modes

**Positioning Architecture:**
- Built on floating-ui (successor to Popper.js)
- v2 uses flat props: `placement`, `gutter`, `offset`, `boundary`
- v3 groups positioning options: `positioning={{ placement, offset }}`
- Smart flip behavior prevents viewport overflow
- Boundary detection respects scroll containers

**Focus Management Design:**
- `initialFocusRef` pattern borrowed from React Modal patterns
- Works with forwarded refs for custom components
- External focus-lock library integration (react-focus-lock)
- Return focus behavior configurable
- Essential for complex form flows

**Lazy Loading Strategy:**
- Performance optimization for initial render
- v2: `isLazy` boolean + `lazyBehavior` enum
- v3: `lazyMount` + `unmountOnExit` booleans
- `keepMounted` option preserves state between opens
- Critical for pages with many popovers

**Theming Architecture:**
- Anatomy-based multi-part styling
- Theme defined via `definePartsStyle` helper
- Supports custom variants, sizes, and base styles
- Each part (header, body, footer, arrow) independently themeable
- Color mode integration automatic

**PopoverAnchor Pattern:**
- Advanced feature for separating trigger from anchor
- Enables edit-in-place UI patterns
- Anchor determines position, trigger controls open/close
- Example shows input editing with separate button trigger
- Not commonly needed but powerful when required

**Portal Usage:**
- Solves z-index and overflow clipping issues
- Renders at document root by default
- Required for proper stacking in complex layouts
- Can specify custom portal container
- V3 examples consistently show Portal wrapping

**Accessibility Features:**
- Focus trap for modal-like behavior
- Keyboard navigation (Enter, Space, Escape)
- ARIA attributes automatic
- Screen reader support
- Follows WAI-ARIA Popover guidance

**Potential Challenges:**
- v2 to v3 migration requires significant refactoring
- Focus-lock requires external dependency
- Render props pattern (v2) can be complex for newcomers
- v3 `asChild` pattern requires understanding ref forwarding
- Large API surface between v2 and v3

**Strengths:**
- Extremely flexible composition model
- Best-in-class focus management
- Comprehensive positioning system
- Strong accessibility foundation
- Excellent theming capabilities
- Clear upgrade path between versions
- Built on industry-standard libraries (floating-ui, Ark UI)
- Supports both simple and complex use cases
- Portal rendering solves stacking context issues
- Multiple interaction modes (click, hover, controlled)

**Unique Features:**
- PopoverAnchor for separating trigger from position
- Render props for internal state access (v2)
- useDisclosure hook for standardized state (v2)
- Multi-part anatomy-based theming
- `lazyBehavior` control over persistence
- `asChild` composition pattern (v3)
- Built on Ark UI for cross-framework portability (v3)

**Use Case Fit:**
- Excellent for form editing interfaces
- Strong for multi-step wizards and walkthroughs
- Great for contextual menus and actions
- Ideal for rich tooltips with interaction
- Perfect for inline editing patterns
- Well-suited for confirmation dialogs
- Good for complex positioned overlays
