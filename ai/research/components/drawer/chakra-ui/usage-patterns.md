# Chakra UI - Drawer Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/drawer (v3)
https://v2.chakra-ui.com/docs/components/drawer (v2)
Status: ✅ Working
Version: v3 (Latest) / v2 (Stable)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with clear API reference, multiple code examples, accessibility guidance, focus management details, and form integration patterns. v2 documentation particularly thorough with implementation examples.

## Component Definition
- **Core purpose**: A panel that slides out from the edge of the screen to display supplementary content, forms, or details without navigating away from the current page. Provides a focused overlay experience for task completion or information display.
- **Mental model**: A temporary side panel that overlays the current page - starts hidden, slides in from a screen edge when triggered, contains focused content with optional header/body/footer sections, and dismisses to return to the main interface.
- **Semantic meaning**: Communicates a focused, modal-like interaction for secondary tasks or detailed information. The slide-in animation from screen edges provides spatial context. Different from modal dialogs (centered) by anchoring to screen edges and different from popovers (small, contextual) by providing full-height panels for substantial content.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `placement="right"`, `size="md"`, `isOpen`, `onClose`)
- **Composed**: Via composition/children (e.g., `<DrawerHeader>`, `<DrawerBody>`, `<DrawerFooter>`, `<DrawerOverlay>`)
- **CSS-only**: Requires custom styling (e.g., custom animations beyond default slide transitions)

## Trigger Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click trigger | ✅ | Native | Standard pattern using button with `onClick={onOpen}`. Use `useDisclosure` hook for state management |
| Programmatic control | ✅ | Native | Controlled via `isOpen` prop with `onClose` callback. Full control over open/close state |
| useDisclosure hook | ✅ | Native | v2: Provides `{ isOpen, onOpen, onClose }` for simplified state management. Standard Chakra UI pattern |
| External trigger | ✅ | Composed | Any element can trigger via `onClick={onOpen}`. Trigger completely separate from drawer implementation |
| Focus return | ✅ | Native | `finalFocusRef` prop returns focus to specific element (typically trigger button) on close |
| Keyboard (Escape) | ✅ | Native | `closeOnEsc={true}` (default) - Escape key dismissal built-in |
| Overlay click | ✅ | Native | `closeOnOverlayClick={true}` (default) - Click backdrop to dismiss |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Header section | ✅ | Composed | `<DrawerHeader>` component for title/heading area. Composes Box component for styling |
| Body content | ✅ | Composed | `<DrawerBody>` component for main content area. Scrollable by default. Composes Box component |
| Footer section | ✅ | Composed | `<DrawerFooter>` component for action buttons/controls. Typically contains ButtonGroup. Composes Box |
| Close button | ✅ | Composed | `<DrawerCloseButton>` auto-positioned close button. Composes CloseButton component |
| Rich content | ✅ | Composed | Children accept any ReactNode - forms, images, text, lists, complex layouts |
| Form inputs | ✅ | Composed | Full form support with `initialFocusRef` for first field focus. HTML form integration via `form` attribute |
| Action buttons | ✅ | Composed | ButtonGroup patterns in footer for Cancel/Save/Submit actions |
| Custom components | ✅ | Composed | Any React components supported as drawer content |
| Scrollable content | ✅ | Native | DrawerBody automatically scrollable when content exceeds drawer height |
| Overlay/Backdrop | ✅ | Composed | `<DrawerOverlay />` component creates semi-transparent backdrop |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Placement options | ✅ | Native | `placement` prop: `'left'`, `'right'` (default), `'top'`, `'bottom'`. Slides from specified edge |
| Right placement | ✅ | Native | `placement='right'` - Default. Slides in from right edge of screen |
| Left placement | ✅ | Native | `placement='left'` - Slides in from left edge of screen |
| Top placement | ✅ | Native | `placement='top'` - Slides down from top edge. Use `isFullHeight` for 100vh |
| Bottom placement | ✅ | Native | `placement='bottom'` - Slides up from bottom edge. Use `isFullHeight` for 100vh |
| Full height | ✅ | Native | `isFullHeight={true}` - Sets drawer to 100vh for top/bottom placements |
| Portal rendering | ✅ | Native | Automatic portal rendering. Configurable via `portalProps` for custom portal container |

## Size Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Extra small | ✅ | Native | `size='xs'` - Default size. Narrowest drawer width |
| Small | ✅ | Native | `size='sm'` - Small drawer width |
| Medium | ✅ | Native | `size='md'` - Medium drawer width |
| Large | ✅ | Native | `size='lg'` - Large drawer width |
| Extra large | ✅ | Native | `size='xl'` - Widest drawer width |
| Full screen | ✅ | Native | `size='full'` - Full screen width/height |
| Responsive sizes | ✅ | Native | Size prop accepts responsive values: `size={{ base: 'full', md: 'md' }}` |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Close on overlay click | ✅ | Native | `closeOnOverlayClick={true}` (default) - Clicking backdrop dismisses drawer |
| Close on ESC | ✅ | Native | `closeOnEsc={true}` (default) - Escape key dismissal |
| Focus trap | ✅ | Native | `trapFocus={true}` (default) - Locks focus within drawer. Prevents tabbing outside |
| Initial focus | ✅ | Native | `initialFocusRef` targets specific element to receive focus on open. Auto-focuses first element by default |
| Return focus | ✅ | Native | `returnFocusOnClose={true}` (default) - Returns focus to trigger element on close |
| Auto focus | ✅ | Native | `autoFocus={true}` (default) - Automatically focuses first focusable element |
| Final focus target | ✅ | Native | `finalFocusRef` specifies element receiving focus after close (typically trigger button) |
| Block scroll | ✅ | Native | `blockScrollOnMount={true}` (default) - Disables body scroll when drawer open |
| Preserve scrollbar gap | ✅ | Native | `preserveScrollBarGap={true}` (default) - Prevents layout shift when scroll removed |
| Animation/transitions | ✅ | Native | Slide-in animations from specified placement edge. Fade-in/fade-out for overlay |
| useInert siblings | ✅ | Native | `useInert={true}` (default) - Applies `aria-hidden` to sibling elements for accessibility |
| Allow pinch zoom | ✅ | Native | `allowPinchZoom={false}` (default) - Controls iOS zoom gestures with scroll lock |
| Lock focus across frames | ✅ | Native | `lockFocusAcrossFrames={false}` (default) - Aggressive focus capture in iframes |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled state | ✅ | Native | `isOpen` and `onClose` props for complete state control. External state management |
| Uncontrolled state | ✅ | Native | Internal state via `useDisclosure` hook. Component manages its own open/close |
| useDisclosure hook | ✅ | Native | v2: Returns `{ isOpen, onOpen, onClose }` for simplified state. Standard pattern across Chakra UI |
| Event callbacks | ✅ | Native | `onClose`, `onCloseComplete`, `onEsc`, `onOverlayClick` callbacks for interaction handling |
| Close completion | ✅ | Native | `onCloseComplete` fires when all exit animations finish. Useful for cleanup |
| Form submission | ✅ | Composed | HTML form integration: Submit button can reference form via `form='my-form'` attribute |
| Multiple drawers | ✅ | Native | Multiple independent drawers supported. Each manages own state and portal |
| Nested drawers | ✅ | Native | Drawers can open other drawers with proper portal stacking |
| Dynamic placement | ✅ | Composed | Placement can change dynamically via state. Example shows RadioGroup controlling placement |

## Code Examples

### Basic Usage (v2)
```jsx
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input
} from '@chakra-ui/react'

function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  return (
    <>
      <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder='Type here...' />
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### Placement Options (v2)
```jsx
function PlacementExample() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [placement, setPlacement] = React.useState('right')

  return (
    <>
      <RadioGroup defaultValue={placement} onChange={setPlacement}>
        <Stack direction='row' mb='4'>
          <Radio value='top'>Top</Radio>
          <Radio value='right'>Right</Radio>
          <Radio value='bottom'>Bottom</Radio>
          <Radio value='left'>Left</Radio>
        </Stack>
      </RadioGroup>

      <Button colorScheme='blue' onClick={onOpen}>
        Open Drawer
      </Button>

      <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>
          <DrawerBody>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### Focus Management (v2)
```jsx
function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const firstField = React.useRef()

  return (
    <>
      <Button leftIcon={<AddIcon />} colorScheme='teal' onClick={onOpen}>
        Create user
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>
            Create a new account
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing='24px'>
              <Box>
                <FormLabel htmlFor='username'>Name</FormLabel>
                <Input
                  ref={firstField}
                  id='username'
                  placeholder='Please enter user name'
                />
              </Box>

              <Box>
                <FormLabel htmlFor='url'>Url</FormLabel>
                <InputGroup>
                  <InputLeftAddon>https://</InputLeftAddon>
                  <Input
                    type='url'
                    id='url'
                    placeholder='Please enter domain'
                  />
                  <InputRightAddon>.com</InputRightAddon>
                </InputGroup>
              </Box>

              <Box>
                <FormLabel htmlFor='owner'>Select Owner</FormLabel>
                <Select id='owner' defaultValue='segun'>
                  <option value='segun'>Segun Adebayo</option>
                  <option value='kola'>Kola Tioluwani</option>
                </Select>
              </Box>

              <Box>
                <FormLabel htmlFor='desc'>Description</FormLabel>
                <Textarea id='desc' />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### Form Integration with HTML Form Attribute (v2)
```jsx
export const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Open</Button>
      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <form
              id='my-form'
              onSubmit={(e) => {
                e.preventDefault()
                console.log('submitted')
              }}
            >
              <FormControl>
                <FormLabel htmlFor='nickname'>Nickname</FormLabel>
                <Input
                  name='nickname'
                  id='nickname'
                  placeholder='Type here...'
                />
              </FormControl>
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button type='submit' form='my-form'>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### Size Variations (v2)
```jsx
function SizeExample() {
  const [size, setSize] = React.useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'full']

  return (
    <>
      {sizes.map((size) => (
        <Button
          onClick={() => handleClick(size)}
          key={size}
          m={4}
        >{`Open ${size} Drawer`}</Button>
      ))}

      <Drawer onClose={onClose} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>{`${size} drawer contents`}</DrawerHeader>
          <DrawerBody>
            <Lorem count={2} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### Using Refs and finalFocusRef (v2)
```jsx
function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  return (
    <>
      <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder='Type here...' />
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### Full Height for Top/Bottom Placement (v2)
```jsx
function FullHeightDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Open Drawer</Button>
      <Drawer
        isOpen={isOpen}
        placement='top'
        onClose={onClose}
        isFullHeight={true}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Full Height Drawer</DrawerHeader>
          <DrawerBody>
            <p>This drawer takes full viewport height</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### Drawer with Theming (v2)
```jsx
<Drawer
  isOpen={isOpen}
  onClose={onClose}
  colorScheme='purple'
  variant='alwaysOpen'
>
  <DrawerOverlay />
  <DrawerContent>
    <DrawerHeader>Custom Themed Drawer</DrawerHeader>
    <DrawerBody>Styled via theme customization</DrawerBody>
  </DrawerContent>
</Drawer>
```

## Notable Features

### Multi-Part Component System
- Drawer broken into semantic subcomponents: Overlay, Content, Header, Body, Footer, CloseButton
- Each part independently styleable and themeable
- Follows Chakra UI's composition-based architecture
- All parts except CloseButton compose the Box component for full style prop support
- Enables precise customization without complex CSS overrides

### useDisclosure Hook Integration
- Provides standardized state management: `{ isOpen, onOpen, onClose }`
- Consistent pattern across all Chakra UI overlay components (Modal, Drawer, Popover)
- Simplifies controlled component implementation
- Reduces boilerplate for common open/close patterns
- Can be extended for custom state logic

### Comprehensive Focus Management
- `initialFocusRef` targets specific element for initial focus (essential for forms)
- `finalFocusRef` returns focus to specific element on close (typically trigger button)
- `autoFocus` automatically focuses first focusable element
- `returnFocusOnClose` ensures proper focus restoration
- `trapFocus` prevents focus from leaving drawer (accessibility requirement)
- Automatic focus management without refs when not specified
- Essential for keyboard navigation and screen reader users

### Flexible Placement System
- Four placement options: left, right (default), top, bottom
- Slides in from specified screen edge with smooth animation
- `isFullHeight` prop for 100vh height on top/bottom placements
- Dynamic placement changes supported via state
- Appropriate for different content types and user expectations

### Size Variations
- Six size options: xs (default), sm, md, lg, xl, full
- Responsive size values supported: `size={{ base: 'full', md: 'md' }}`
- Full size creates edge-to-edge drawer experience
- Width/height applied appropriately based on placement
- Balances content needs with screen real estate

### Smart Scroll Management
- `blockScrollOnMount` prevents body scroll by default
- `preserveScrollBarGap` prevents layout shift when scrollbar hidden
- DrawerBody automatically scrollable when content overflows
- `allowPinchZoom` controls iOS zoom gesture handling
- Maintains smooth user experience across devices

### Portal Rendering
- Automatic portal rendering to document body
- Configurable via `portalProps` for custom container
- Solves z-index and stacking context issues
- Prevents overflow clipping from parent containers
- Essential for proper layering in complex layouts

### Accessibility First Design
- Implements WAI-ARIA dialog pattern
- `aria-hidden` applied to siblings via `useInert` prop
- Focus trapping required for modal behavior
- Keyboard navigation (Escape key dismissal)
- Screen reader announcements for modal state
- Proper focus management on open/close
- All interactive elements properly labeled

### Behavior Customization
- `closeOnOverlayClick` controls backdrop dismissal (default: true)
- `closeOnEsc` enables keyboard dismissal (default: true)
- Both can be disabled for persistent drawers
- `onCloseComplete` callback fires after exit animations
- `onEsc` and `onOverlayClick` for granular interaction handling
- Full control over interaction model

### HTML Form Integration
- Form buttons can reference form via `form` attribute
- Allows submit button outside form element (in footer)
- Follows native HTML form patterns
- No JavaScript form handling required for basic cases
- Simplifies form layout and action placement

### Animation System
- Slide-in transitions from specified edge
- Fade-in/fade-out for overlay backdrop
- Smooth, performant CSS transitions
- `onCloseComplete` callback for post-animation logic
- Customizable via Chakra UI's theme system

### Theme Integration
- Multi-part component theming support
- Custom variants and color schemes
- Seamless light/dark mode support
- Design token integration (colors, spacing, z-index)
- Global theme overrides or per-instance styling

### Cross-Frame Focus Management
- `lockFocusAcrossFrames` for iframe scenarios
- Handles complex embedding situations
- Aggressive focus capture when needed
- Disabled by default for performance

## Research Notes

### Access & Documentation
- v2 documentation at v2.chakra-ui.com provides comprehensive examples and API details
- v3 documentation at chakra-ui.com focuses on latest version with updated patterns
- Both versions maintain good documentation quality
- GitHub source available for implementation reference
- Storybook examples provide interactive demos

### Framework Approach Observations

**Component Architecture:**
- Built on Ark UI dialog foundation for v3
- Multi-part composition pattern enables flexibility
- Each subcomponent has clear responsibility
- Follows Chakra UI's consistent API patterns across components
- Portal rendering handled automatically

**State Management Pattern:**
- useDisclosure hook provides standardized state interface
- Controlled via `isOpen` and `onClose` props
- Uncontrolled mode not available (always requires state)
- External state management fully supported
- Event callbacks for granular control

**Focus Management Design:**
- Ref-based focus targeting (initialFocusRef, finalFocusRef)
- Automatic focus to first element when refs not provided
- Focus trap enabled by default for accessibility
- Return focus behavior configurable
- Essential for form-heavy drawer use cases

**Placement Strategy:**
- Four-edge positioning covers all screen anchoring needs
- Slide animations appropriate to placement direction
- isFullHeight for top/bottom full-screen experience
- Dynamic placement changes supported
- Default to right (Western reading pattern)

**Size System:**
- Six size options from xs to full
- Responsive size values enable mobile-first design
- Default xs encourages minimal drawer usage
- Full size useful for mobile navigation patterns
- Appropriate sizing for different content densities

**Scroll Behavior:**
- Body scroll blocked by default (modal behavior)
- Scrollbar gap preservation prevents layout shift
- DrawerBody scrolls independently
- Platform-specific scroll handling (iOS pinch zoom)
- Maintains fixed drawer position

**Accessibility Implementation:**
- Focus trap required for proper modal behavior
- aria-hidden on siblings via useInert
- Keyboard dismissal (Escape) built-in
- Focus management automatic and customizable
- Follows WAI-ARIA dialog pattern closely

**Form Integration:**
- HTML form attribute enables button outside form
- No JavaScript form handling required
- initialFocusRef targets first form field
- Drawer perfectly suited for form workflows
- Submit button in footer pattern common

**Portal Strategy:**
- Automatic portal to document body
- Configurable portal container
- Solves stacking context issues
- Required for proper z-index management
- Prevents parent overflow clipping

**Animation Approach:**
- CSS-based slide and fade transitions
- Performance optimized (no JavaScript animation)
- onCloseComplete for post-animation logic
- Theme-customizable timing and easing
- Smooth across devices and browsers

**Potential Challenges:**
- Always requires external state management (useDisclosure or custom)
- No lazy rendering option (drawer content always mounted)
- v2 to v3 migration requires API updates
- Focus management refs can be complex for nested forms
- Multiple drawers require careful state coordination

**Strengths:**
- Excellent focus management system
- Comprehensive accessibility implementation
- Flexible placement and sizing options
- Strong form integration patterns
- useDisclosure hook simplifies state
- Multi-part composition enables customization
- Built on battle-tested Ark UI foundation
- Consistent API with other Chakra overlays
- Portal rendering solves common z-index issues
- Strong theme integration

**Unique Features:**
- HTML form attribute integration pattern
- isFullHeight for top/bottom placements
- finalFocusRef for return focus control
- useInert for sibling aria-hidden management
- lockFocusAcrossFrames for iframe scenarios
- preserveScrollBarGap prevents layout shift
- onCloseComplete post-animation callback
- Multi-part themeable component system

**Use Case Fit:**
- Excellent for form editing workflows
- Perfect for navigation panels (mobile-first)
- Ideal for multi-step wizards in side panel
- Great for filtering interfaces
- Strong for settings/preferences panels
- Well-suited for shopping carts
- Good for detail views without page navigation
- Perfect for create/edit operations

**Comparison to Other Patterns:**
- **vs Modal**: Drawer anchored to edge, Modal centered. Drawer feels less disruptive
- **vs Popover**: Drawer full-height panel, Popover small contextual. Different content scale
- **vs Sheet**: Similar concept. Drawer slides from edge, Sheet typically bottom-anchored mobile pattern
- **vs Offcanvas**: Essentially same concept, different terminology. Offcanvas term from Bootstrap

**Framework Philosophy:**
- Composition over configuration
- Accessibility first, not afterthought
- Consistent APIs across similar components
- Theme system enables design system alignment
- Portal rendering by default for safety
- Focus management automated but customizable
- Native HTML patterns where possible
