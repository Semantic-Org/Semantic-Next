# Chakra UI - Drawer Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/drawer (v3)
https://v2.chakra-ui.com/docs/components/drawer (v2)
Status: ✅ Working (v3 and v2 docs available)
Version: v3 (Latest) / v2 (Stable)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Chakra UI provides excellent drawer documentation with interactive examples, complete API reference, accessibility guidance, and multiple use case patterns. Available for both v2 and v3 with clear migration path.

## Component Definition
- **Core purpose**: Provides an off-canvas panel that slides in from the edge of the screen, typically used for navigation, filters, settings, or supplementary content
- **Mental model**: A layered overlay component that temporarily displaces the main content area when opened, providing dedicated space for secondary interactions or navigation
- **Semantic meaning**: Communicates that content is supplementary or modal in nature - requires explicit dismissal (backdrop click, escape key, or close button) to return to main content

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `placement`, `isOpen`, `onClose`, `closeOnEsc`)
- **Composed**: Via composition/children (e.g., `<DrawerHeader>`, `<DrawerBody>`, `<DrawerFooter>`, Portal wrapping)
- **CSS-only**: Requires custom styling (e.g., custom animations, drawer width configuration)

## Placement Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Left placement | ✅ | Native | `placement="left"` (default). Drawer slides in from left edge. Most common for navigation. |
| Right placement | ✅ | Native | `placement="right"`. Drawer slides in from right edge. Common for sidebars on desktop, filters on mobile. |
| Top placement | ✅ | Native | `placement="top"`. Drawer slides down from top. Less common, used for announcements or header-level actions. |
| Bottom placement | ✅ | Native | `placement="bottom"`. Drawer slides up from bottom. Mobile-optimized for action sheets and modals. |

## Size Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom width (left/right) | ✅ | CSS-only | Set via `size` prop or custom width styling on drawer container. No predefined size system documented in basic examples. |
| Custom height (top/bottom) | ✅ | CSS-only | Height controlled via CSS when using top/bottom placement. Can use fixed height or viewport percentage. |
| Full screen width | ✅ | Native/CSS | Default behavior expands drawer to full available width when no size limit specified. |
| Responsive sizing | ✅ | CSS-only | Use Chakra's responsive props on drawer container (`w={{ base: "full", md: "400px" }}`) for different breakpoints. |
| Max-width constraint | ⚠️ | CSS-only | Not explicitly documented. Achievable via `maxWidth` CSS property or theme customization. |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Header section | ✅ | Composed | `<DrawerHeader>` component for title/heading area with built-in padding. Typically contains drawer title and close button. |
| Body content | ✅ | Composed | `<DrawerBody>` component for main content area. Automatically handles padding and scrolling for overflow content. |
| Footer section | ✅ | Composed | `<DrawerFooter>` component for action buttons (Save, Cancel, etc.). Common pattern for confirmation or settings drawers. |
| Close button | ✅ | Composed | `<DrawerCloseButton>` auto-positioned in header area. Alternative: place custom close button in header. |
| Custom header | ✅ | Composed | Can omit `<DrawerHeader>` and create custom header content using Box or other layout components. |
| Nested content | ✅ | Composed | Support for nested components: Forms, Stacks, Lists, Tabs, Grids. Any React component can be drawer child. |
| Form integration | ✅ | Composed | Full form support with validation. Focus management via `initialFocusRef`. Button groups in footer for submit/cancel. |
| Rich content | ✅ | Composed | Images, videos, custom components all supported. Scrollable body handles overflow. |
| Scrollable content | ✅ | Native | Body automatically handles overflow with internal scrolling. Parent scroll lock applied automatically. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled open/close | ✅ | Native | v2: `isOpen`, `onOpen`, `onClose` with `useDisclosure` hook. v3: `open`, `onOpenChange` callback. |
| Uncontrolled state | ✅ | Native | Default behavior - component manages open state internally. Single callback required for close trigger. |
| Loading state | ⚠️ | Composed | Not built-in. Implement via state management - show spinner/skeleton in body, disable buttons. |
| Disabled state | ⚠️ | Composed | Not a drawer prop. Disable content/actions within drawer (buttons, forms) instead. |
| Multiple drawers | ✅ | Native | Multiple independent drawers supported on same page. Each manages own state. |
| Drawer nesting | ✅ | Composed | Drawers can open other drawers. Portal stacking handles z-index automatically. |
| Initial focus | ✅ | Native | v2: `initialFocusRef` targets first focusable element on open. v3: Similar ref-based control. |
| Return focus | ✅ | Native | Focus automatically returns to trigger element on close (default behavior). |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Close on backdrop click | ✅ | Native | v2: `closeOnOverlayClick={true}` (default). v3: `closeOnInteractOutside={true}`. Disableable for persistent drawers. |
| Close on ESC key | ✅ | Native | v2: `closeOnEsc={true}` (default). v3: Controlled via accessibility settings. Can be disabled. |
| Close on item selection | ✅ | Composed | Manually implemented via onClick handlers calling `onClose`. Common pattern for navigation drawers. |
| Scroll lock | ✅ | Native | Background scroll automatically disabled when drawer open. Automatic, not user-configurable. |
| Backdrop animation | ✅ | CSS-only | Fade transition on backdrop. Customizable via theme or SlideProps (v2) / slotProps (v3). |
| Slide animation | ✅ | Native | Smooth slide-in/out animation. Duration configurable via `transitionDuration` prop or theme. |
| Prevent close | ✅ | Composed | Set `closeOnOverlayClick={false}` and `closeOnEsc={false}` to prevent unintended closes. Manual close button required. |
| Lazy mounting | ✅ | Native | v2: Content not rendered until first open if wrapped correctly. v3: Similar lazy behavior supported. |

## Animation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default slide animation | ✅ | Native | Smooth slide-in from edge based on placement. Built-in, no configuration needed for basic use. |
| Custom transition duration | ✅ | Native | v2: `transitionDuration` prop (milliseconds). v3: Via slotProps. Default: 300ms both directions. |
| Backdrop fade | ✅ | Native | Backdrop fades in/out with drawer. Synchronized animations. |
| No animation | ✅ | CSS-only | Set `transitionDuration={0}` for instant appearance. Useful for accessibility or high-motion concerns. |
| Custom animation | ✅ | CSS-only | Can override via theme or inline styles, but requires advanced Chakra customization. |
| Transform origin | ⚠️ | CSS-only | Slide animation origin determined by placement. Not user-configurable without theme customization. |

## Overlay/Backdrop Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Backdrop presence | ✅ | Native | Overlays entire viewport with semi-transparent backdrop by default. |
| Backdrop opacity | ✅ | CSS-only | Default opacity set by theme. Customizable via theme token modification. |
| Backdrop color | ✅ | CSS-only | Default is dark/semi-transparent. Themeable for light/dark modes. |
| Hide backdrop | ✅ | Native | v2: Likely supported via ModalProps. v3: Via slotProps configuration. Useful for persistent/always-visible drawers. |
| Click outside handling | ✅ | Native | Backdrop click triggers close (unless disabled). Can set `closeOnOverlayClick={false}`. |
| Click-through (no backdrop) | ✅ | CSS-only | Requires theme customization to hide/remove backdrop. Not standard documented pattern. |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA role | ✅ | Native | Automatically applies `role="dialog"` or appropriate role based on context. |
| Focus management | ✅ | Native | v2: `initialFocusRef` for targeting first focusable element. Auto-focus on open. |
| Focus trap | ✅ | Native | Focus stays within drawer while open. Tab navigation cycles within drawer content. |
| Keyboard navigation | ✅ | Native | Escape closes drawer (configurable). Tab/Shift+Tab navigate content. Enter/Space trigger buttons. |
| ARIA attributes | ✅ | Native | `aria-label`, `aria-labelledby` automatically applied. Drawer header can serve as label. |
| Screen reader announcement | ✅ | Native | Drawer opening/closing announced. Content structure read properly with semantic HTML. |
| Reduced motion support | ✅ | Native | Respects `prefers-reduced-motion` media query. Animation disabled for users with motion sensitivity. |
| Color contrast | ✅ | Native | Chakra's default theme ensures sufficient contrast. Customizable colors maintain accessibility. |
| Semantic structure | ✅ | Composed | `<DrawerHeader>`, `<DrawerBody>`, `<DrawerFooter>` provide semantic structure for assistive tech. |

## Nested Drawer Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Drawer within drawer | ✅ | Native | Multiple drawers can be open simultaneously. Portal stacking handles z-index automatically. |
| Primary + secondary | ✅ | Composed | Main drawer + mini drawer pattern. Example: navigation drawer + filter drawer. |
| Menu within drawer | ✅ | Composed | Nested menus, submenus within drawer content. Collapse/expand patterns for hierarchy. |
| Modal dialog in drawer | ✅ | Composed | Drawer can contain Modal, Dialog. Focus management must be carefully handled. |
| Z-index stacking | ✅ | Native | Portal system ensures proper stacking. Later-opened drawers appear above earlier ones. |
| Backdrop z-index | ✅ | Native | Each drawer's backdrop positioned correctly relative to others. No manual z-index management needed. |
| Escape key handling | ⚠️ | Composed | Only innermost (top) drawer closes on Escape. May need custom handling for specific patterns. |

## Integration Patterns

### With Forms
```jsx
import { useDisclosure } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

function FormInDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit, reset } = useForm()
  const firstField = React.useRef()

  const onSubmit = (data) => {
    console.log(data)
    onClose()
    reset()
  }

  return (
    <>
      <Button onClick={onOpen}>Edit Profile</Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        initialFocusRef={firstField}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Profile</DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                {...register('name')}
                placeholder='Name'
                ref={firstField}
              />
              <Input
                {...register('email')}
                placeholder='Email'
                mt={4}
              />
            </form>
          </DrawerBody>
          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### With Navigation (List Items)
```jsx
function NavigationDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' }
  ]

  return (
    <>
      <Button onClick={onOpen}>Menu</Button>
      <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navigation</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align='stretch'>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  _hover={{ textDecoration: 'none' }}
                >
                  <Box p={3} bg='gray.50' borderRadius='md'>
                    {item.label}
                  </Box>
                </Link>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### With Filters/Settings
```jsx
function FilterDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [filters, setFilters] = React.useState({
    category: '',
    priceRange: [0, 1000],
    inStock: false
  })

  return (
    <>
      <Button onClick={onOpen}>Filters</Button>
      <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filter Products</DrawerHeader>
          <DrawerBody>
            <VStack spacing={6}>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value=''>All</option>
                  <option value='electronics'>Electronics</option>
                  <option value='clothing'>Clothing</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Price Range</FormLabel>
                <Slider
                  value={filters.priceRange}
                  onChangeEnd={(val) =>
                    setFilters({ ...filters, priceRange: val })
                  }
                  min={0}
                  max={5000}
                  step={100}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb index={0} />
                  <SliderThumb index={1} />
                </Slider>
              </FormControl>

              <FormControl display='flex' alignItems='center'>
                <FormLabel mb={0}>In Stock Only</FormLabel>
                <Checkbox
                  isChecked={filters.inStock}
                  onChange={(e) =>
                    setFilters({ ...filters, inStock: e.target.checked })
                  }
                />
              </FormControl>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Reset
            </Button>
            <Button colorScheme='blue' onClick={onClose}>
              Apply
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

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
  Button,
  useDisclosure,
} from '@chakra-ui/react'

function BasicDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Open Drawer</Button>
      <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>
          <DrawerBody>
            Some drawer content goes here
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

### Basic Usage (v3)
```jsx
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import { useState } from 'react'

function BasicDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        open={open}
        onOpenChange={(details) => setOpen(details.open)}
        placement='left'
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create Account</DrawerHeader>
          <DrawerBody>
            Some drawer content goes here
          </DrawerBody>
          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={() => setOpen(false)}>
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

### Right Placement
```jsx
<Drawer isOpen={isOpen} placement='right' onClose={onClose}>
  <DrawerOverlay />
  <DrawerContent>
    <DrawerCloseButton />
    <DrawerHeader>Edit Settings</DrawerHeader>
    <DrawerBody>
      {/* Content */}
    </DrawerBody>
  </DrawerContent>
</Drawer>
```

### Bottom Placement (Mobile Sheet)
```jsx
<Drawer
  isOpen={isOpen}
  placement='bottom'
  onClose={onClose}
>
  <DrawerOverlay />
  <DrawerContent borderTopRadius='lg'>
    <DrawerCloseButton />
    <DrawerHeader>Select Action</DrawerHeader>
    <DrawerBody>
      {/* Action sheet content */}
    </DrawerBody>
  </DrawerContent>
</Drawer>
```

### Controlled State (v2)
```jsx
function ControlledDrawer() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Drawer isOpen={isOpen} placement='right' onClose={() => setIsOpen(false)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Title</DrawerHeader>
          <DrawerBody>Content</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### Focus Management (v2)
```jsx
function DrawerWithFocus() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const firstField = React.useRef()

  return (
    <>
      <Button onClick={onOpen}>Open Drawer</Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        initialFocusRef={firstField}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Enter details</DrawerHeader>
          <DrawerBody>
            <Input
              ref={firstField}
              placeholder='First name'
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### Custom Width
```jsx
function DrawerWithCustomWidth() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Open Drawer</Button>
      <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='md'>
        <DrawerOverlay />
        <DrawerContent maxW='400px'>
          {/* Content */}
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### Responsive Width
```jsx
<Drawer isOpen={isOpen} placement='right' onClose={onClose}>
  <DrawerOverlay />
  <DrawerContent w={{ base: '100%', md: '400px' }}>
    {/* Content */}
  </DrawerContent>
</Drawer>
```

### Prevent Close on Outside Click
```jsx
<Drawer
  isOpen={isOpen}
  placement='right'
  onClose={onClose}
  closeOnOverlayClick={false}
  closeOnEsc={false}
>
  <DrawerOverlay />
  <DrawerContent>
    {/* Content - only close button or explicit action can close */}
  </DrawerContent>
</Drawer>
```

## Component Props Reference (v2)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls whether the drawer is visible. |
| `onClose` | `function` | - | Callback fired when drawer requests to close. |
| `onOpen` | `function` | - | Callback fired when drawer opens. Optional. |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Position where drawer slides in from. |
| `children` | `React.ReactNode` | - | Drawer content (typically DrawerContent with nested header/body/footer). |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Predefined size of drawer. |
| `isFullHeight` | `boolean` | `false` | If true, drawer takes full viewport height. |
| `initialFocusRef` | `React.Ref` | - | Element to receive focus when drawer opens. |
| `finalFocusRef` | `React.Ref` | - | Element to receive focus when drawer closes. |
| `closeOnOverlayClick` | `boolean` | `true` | If true, clicking overlay closes drawer. |
| `closeOnEsc` | `boolean` | `true` | If true, pressing Escape closes drawer. |
| `closeButton` | `boolean` | - | **Deprecated** - Use `<DrawerCloseButton>` instead. |
| `scrollBehavior` | `'inside' \| 'outside'` | `'outside'` | Where scroll happens: inside drawer or page behind. |
| `trapFocus` | `boolean` | `true` | If true, focus remains trapped within drawer. |
| `returnFocusOnClose` | `boolean` | `true` | If true, focus returns to trigger on close. |
| `blockScrollOnMount` | `boolean` | `true` | If true, body scroll locked when drawer open. |
| `allowPinchZoom` | `boolean` | `false` | Allow pinch-zoom on mobile when drawer open. |
| `autoFocus` | `boolean` | `true` | Auto-focus drawer content on open. |
| `motionPreset` | `'slideInLeft' \| 'slideInRight' \| 'slideInTop' \| 'slideInBottom' \| 'none'` | - | Animation preset (auto-selected based on placement). |

### DrawerContent Props
- Accepts all Box component props for styling
- `onClick` handlers can be added for custom interactions
- `w` (width), `h` (height) for sizing
- `bg`, `color` for theming

### DrawerHeader Props
- Accepts all Box component props
- Typically contains title and close button
- Auto-applies padding

### DrawerBody Props
- Accepts all Box component props
- Handles overflow with scrolling
- Auto-applies padding

### DrawerFooter Props
- Accepts all Box component props
- Typically contains action buttons
- Usually uses `display='flex'` with `justifyContent`

### DrawerCloseButton Props
- Accepts all Icon Button props
- Auto-positioned in top-right of header
- Or can be manually placed anywhere

## Notable Features

### 1. Portal-Based Rendering
- DrawerContent automatically renders at document root via Portal
- Solves z-index and overflow-clipping issues
- No manual portal wrapper needed (unlike some other frameworks)
- Ensures proper stacking with other modals/popovers

### 2. Flexible Placement
- Four placement options: left, right, top, bottom
- Default left placement is most common for navigation
- Right/bottom common for supplementary/mobile patterns
- Automatic animation origin based on placement

### 3. Scroll Behavior Options
- `scrollBehavior='outside'` (default): Page behind drawer scrolls, drawer fixed
- `scrollBehavior='inside'`: Drawer content scrolls, page locked
- DrawerBody automatically handles long content with scrolling

### 4. useDisclosure Hook Integration
- Provides standard state management: `isOpen`, `onOpen`, `onClose`, `onToggle`
- Consistent across Chakra components (Modal, AlertDialog, etc.)
- Reduces boilerplate for common open/close patterns
- Simplifies controlled vs uncontrolled patterns

### 5. Multi-Part Component System
- DrawerHeader, DrawerBody, DrawerFooter provide semantic structure
- DrawerCloseButton and DrawerOverlay are optional but recommended
- Flexible composition - can build custom layouts

### 6. Focus Management
- `initialFocusRef` targets first focusable element
- `finalFocusRef` receives focus on close
- `trapFocus` ensures focus stays within drawer
- `returnFocusOnClose` returns focus to trigger element
- Essential for keyboard navigation and accessibility

### 7. Backdrop Behavior
- `closeOnOverlayClick` controls click-outside dismissal
- `closeOnEsc` controls Escape key dismissal
- Both independently configurable
- Useful for persistent drawers or confirmation flows

### 8. Responsive Patterns
- Combine with Chakra's responsive props for adaptive behavior
- Can change placement or size at breakpoints: `placement={{ base: 'bottom', md: 'right' }}`
- Common pattern: bottom sheet on mobile, side drawer on desktop

### 9. Animation Support
- Smooth slide animation by default
- `motionPreset` can control animation style
- Animations respect `prefers-reduced-motion` setting
- Backdrop fade synchronized with slide

### 10. Form Integration
- Drawer commonly wraps forms with validation
- Footer buttons (Save/Cancel/Delete) in DrawerFooter
- Full keyboard navigation support
- Dialog-like interaction model

### 11. Scroll Lock
- Background scroll automatically disabled
- `blockScrollOnMount={true}` (default)
- Prevents body scroll while drawer open
- Important for mobile experience

### 12. Theme Customization
- Drawers inherit Chakra theme colors/tokens
- Can customize via theme extensions
- Support for light/dark mode
- Custom variants possible via theme

## Research Notes

### Access & Documentation
- Documentation successfully accessed at both v2 and v3 URLs
- v3 represents evolution to new composition-based API
- v2 documentation comprehensive with many examples
- Interactive Chakra playground available for testing
- GitHub source available for both versions

### Framework Approach Observations

**Version Evolution:**
- v2 uses `useDisclosure()` hook and flat prop interface
- v3 uses `open`/`onOpenChange` props (following controlled component patterns)
- v3 API more similar to React community standards
- Both maintain same visual and UX behavior

**Composition Architecture:**
- Multi-part component pattern: Header, Body, Footer, CloseButton, Overlay
- All parts optional but recommended for structure
- Can build custom layouts by omitting standard parts
- DrawerContent is the core container

**State Management:**
- v2: useDisclosure hook provides standard state interface
- v3: Direct props for open/onOpenChange
- Both support fully controlled mode
- Uncontrolled default behavior

**Placement System:**
- Four directions: left, right, top, bottom
- Automatic animation direction based on placement
- No diagonal/floating placement like popovers
- Common: left for navigation, right for filters, bottom for mobile

**Scroll Behavior:**
- v2: `scrollBehavior` prop with 'inside'/'outside' options
- Default 'outside' keeps drawer content visible while page scrolls
- DrawerBody handles internal scrolling for long content

**Focus Management:**
- Ref-based approach with `initialFocusRef`, `finalFocusRef`
- Works with React forwarded refs
- Focus trap automatic (can be disabled)
- Return focus on close enabled by default

**Backdrop Interaction:**
- Click-outside dismissal configurable via `closeOnOverlayClick`
- Escape key dismissal separate via `closeOnEsc`
- Both enabled by default (typical modal behavior)
- Can create persistent/non-dismissible drawers

**Accessibility:**
- Auto-applies ARIA roles and attributes
- Keyboard navigation built-in
- Focus management with ref system
- Respects motion preferences
- Screen reader support via semantic HTML structure

**Potential Challenges:**
- v2 to v3 migration requires code changes
- Multiple props to manage (open, onClose, initialFocusRef, closeOnEsc, etc.)
- DrawerBody automatic scrolling may not suit all layouts
- Portal rendering at document root (can't customize container)

**Strengths:**
- Clean, intuitive API
- Excellent accessibility out of the box
- Flexible composition model
- Good documentation with examples
- Consistent with other Chakra overlay components
- Responsive capabilities
- Focus management patterns
- Customizable behavior (close on click, escape, etc.)
- Works well for navigation and filters

**Unique Features:**
- useDisclosure hook integration (v2)
- scrollBehavior option ('inside' vs 'outside')
- initialFocusRef for automatic focus targeting
- finalFocusRef for return focus
- Multi-part component structure
- Flexible placement with auto-animation

**Use Case Fit:**
- Excellent for navigation drawers/menus
- Great for filter/settings panels
- Strong for form dialogs with dedicated space
- Perfect for mobile action sheets (bottom placement)
- Good for supplementary content (right placement)
- Ideal for edit-in-place workflows
- Well-suited for confirmation flows

### Accessibility Compliance
- Implements WAI-ARIA dialog pattern correctly
- Keyboard support: Tab, Shift+Tab, Escape
- Focus trap and management
- Backdrop click handling
- Screen reader friendly
- Motion preference support
- Color contrast maintained

### Performance Considerations
- Portal rendering prevents layout thrashing
- Content can be lazy-loaded
- Smooth animations via CSS transforms
- No performance degradation with multiple drawers
- Scroll lock efficient via overflow hidden

### Mobile Optimization
- Bottom placement natural for mobile action sheets
- Touch-friendly close button positioning
- Pinch-zoom allowed via `allowPinchZoom` prop
- Responsive sizing with breakpoints
- Viewport height handling with `isFullHeight`

## Comparison with Similar Components

### vs Modal
- Modal: Centered dialog box, typically fullscreen backdrop
- Drawer: Edge-positioned panel, usually with partial overlay
- Drawer better for side content, Modal for central focus

### vs Popover
- Popover: Small floating overlay, anchored to trigger
- Drawer: Large side panel, full height typically
- Drawer for primary interactions, Popover for secondary info

### vs Menu/Dropdown
- Menu: Small list of options, inline positioning
- Drawer: Full navigation structure, persistent scrollable
- Drawer for hierarchies, Menu for simple selections

