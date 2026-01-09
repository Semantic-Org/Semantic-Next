# Chakra UI - Dialog/Modal Component

## Component Overview

The Dialog component is Chakra UI's primary modal implementation for displaying dialog prompts and modal overlays.

**Version Context:**
- **v3**: Named "Dialog" with a modern compound component API (`Dialog.Root`, `Dialog.Content`, etc.) built on Ark UI
- **v2**: Named "Modal" with a simpler flat component structure (`Modal`, `ModalContent`, `ModalOverlay`, etc.)

In Chakra UI v3, the Modal component was renamed to Dialog and received a significant architectural redesign to use a compound component pattern. This document covers both versions with emphasis on v3 (Dialog).

**Key Characteristics:**
- Modal overlay with backdrop/dimmed background
- Fixed positioning with z-index management (default z-index: 1400)
- Built-in focus management and focus trapping
- Accessible by default (WAI-ARIA compliant)
- Smooth fade animations for opening/closing
- Composable subcomponents for flexible structure
- Support for various sizes and positioning options

---

## Version Comparison (v2 vs v3)

### Major Architectural Changes

#### v2 Modal Structure (Flat API)
```jsx
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, Button } from '@chakra-ui/react';

const { isOpen, onOpen, onClose } = useDisclosure();

<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Modal Title</ModalHeader>
    <ModalCloseButton />
    <ModalBody>Content here</ModalBody>
    <ModalFooter>
      <Button onClick={onClose}>Close</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

#### v3 Dialog Structure (Compound Pattern)
```jsx
import { Dialog, Portal, Button } from '@chakra-ui/react';

const [open, setOpen] = useState(false);

<Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
  <Dialog.Trigger asChild>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  <Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Dialog Title</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>Content here</Dialog.Body>
        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <Button>Close</Button>
          </Dialog.ActionTrigger>
        </Dialog.Footer>
        <Dialog.CloseTrigger />
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog.Root>
```

### Breaking Changes Summary

| Feature | v2 | v3 | Migration Impact |
|---------|----|----|------------------|
| **Component naming** | `Modal`, `ModalOverlay`, `ModalContent` | `Dialog.Root`, `Dialog.Backdrop`, `Dialog.Content` | HIGH - Requires renaming all components |
| **State control** | `useDisclosure` hook returns `isOpen`, `onOpen`, `onClose` | useState with `open` and `onOpenChange` props | MEDIUM - Different hook-based to prop-based pattern |
| **Props naming** | `isOpen`, `onClose` | `open`, `onOpenChange` | MEDIUM - Props renamed |
| **Centering** | `isCentered` prop | `placement="center"` prop | LOW - Simple prop change |
| **Trigger component** | No explicit trigger, button outside | `Dialog.Trigger` component | MEDIUM - New component added |
| **Close button** | `ModalCloseButton` component | `Dialog.CloseTrigger` component | LOW - Component rename |
| **Portal wrapping** | Optional `<Portal>` | Recommended `<Portal>` wrapper | MEDIUM - More explicit structure required |
| **Size prop** | Passed to Modal | Passed to Dialog.Content or Dialog.Root | LOW - Same sizes (xs, sm, md, lg, xl, full) |
| **Scroll behavior** | `scrollBehavior` prop (inside/outside) | Likely via positioning configuration | MEDIUM - May require different approach |
| **Animation** | `motionPreset` prop (slideInBottom, slideInRight, scale, none) | Built-in fade animations | MEDIUM - Limited animation customization |
| **Focus management** | `initialFocusRef`, `finalFocusRef` props | Different focus prop names/approach | MEDIUM - Check v3 documentation |
| **Lazy mounting** | `isLazy` prop | `lazyMount` prop | LOW - Simple prop rename |
| **Backdrop click** | `closeOnOverlayClick` prop | `closeOnInteractOutside` prop | LOW - Prop rename |

### New Features in v3

1. **Explicit Positioner**: `Dialog.Positioner` component for better positioning control
2. **Portal Integration**: First-class Portal support for better layering
3. **Compound Pattern**: Namespaced components (`Dialog.X`) make relationships explicit
4. **CloseTrigger Component**: Dedicated `Dialog.CloseTrigger` for close button
5. **ActionTrigger Component**: `Dialog.ActionTrigger` for footer action buttons
6. **Better Performance**: `lazyMount` by default in v3.6.0+
7. **Ark UI Foundation**: Built on battle-tested Ark UI state machine

### Known Migration Issues

1. **Complex Animation Customization**: v3 has more limited animation presets
2. **Focus Props**: Different naming/implementation for initial/final focus
3. **Motion Presets**: No direct equivalent to v2's motion presets
4. **Scroll Behavior**: Implementation details not yet fully documented
5. **No Automated Migration**: Manual migration required for all components

---

## Basic Usage

### v2 Basic Example
```jsx
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, useDisclosure } from '@chakra-ui/react';

function BasicModalDemo() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            This is a basic modal dialog. It displays content in a centered overlay with a backdrop.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

### v3 Basic Example
```jsx
import { Dialog, Portal, Button } from '@chakra-ui/react';
import { useState } from 'react';

function BasicDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          Open Dialog
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              This is a basic dialog. It displays content in a centered overlay with a backdrop.
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button>Save</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
```

---

## Sizing Options

### v2 Modal Sizes
```jsx
{/* Size values: xs, sm, md, lg, xl, full */}
<Modal isOpen={isOpen} onClose={onClose} size="lg">
  <ModalOverlay />
  <ModalContent>
    {/* Content */}
  </ModalContent>
</Modal>
```

### v3 Dialog Sizes
```jsx
{/* Size values: xs, sm, md, lg, xl, full */}
{/* Pass to Dialog.Root or Dialog.Content */}
<Dialog.Root size="lg">
  {/* Dialog content */}
</Dialog.Root>

{/* Or pass maxW directly to Dialog.Content for custom sizing */}
<Dialog.Content maxW="600px">
  {/* Content */}
</Dialog.Content>
```

**Size Reference:**
- **xs** - Extra small (20rem / 320px)
- **sm** - Small (24rem / 384px)
- **md** - Medium (28rem / 448px, typical default)
- **lg** - Large (32rem / 512px)
- **xl** - Extra large (36rem / 576px)
- **full** - Full width with padding (100% - 2rem)

---

## Layout & Positioning

### v2 Positioning

#### Centered Modal
```jsx
<Modal isOpen={isOpen} onClose={onClose} isCentered>
  <ModalOverlay />
  <ModalContent>
    {/* Vertically centered content */}
  </ModalContent>
</Modal>
```

#### Custom Top Position
```jsx
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent top="10rem">
    {/* Modal positioned 10rem from top */}
  </ModalContent>
</Modal>
```

#### Default Positioning
Default has a vertical offset of 3.75rem (60px) from top.

### v3 Positioning

#### Centered Dialog
```jsx
<Dialog.Root placement="center">
  {/* Dialog centered on screen */}
</Dialog.Root>
```

#### Custom Positioning via Positioner Props
```jsx
<Dialog.Positioner>
  <Dialog.Content>
    {/* Positioning controlled by Dialog.Positioner */}
  </Dialog.Content>
</Dialog.Positioner>
```

#### Custom Positioning Props
```jsx
<Dialog.Root positioning={{ placement: "center" }}>
  {/* Positioning via positioning object */}
</Dialog.Root>
```

---

## Content & Structure

### v2 Structure
```jsx
<Modal>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>
      Title text here
      <ModalCloseButton />
    </ModalHeader>
    <ModalBody>
      Main content here
    </ModalBody>
    <ModalFooter>
      Action buttons here
    </ModalFooter>
  </ModalContent>
</Modal>
```

### v3 Structure
```jsx
<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Description>
          Optional descriptive text
        </Dialog.Description>
        <Dialog.Body>
          Main content here
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <Button>Close</Button>
          </Dialog.ActionTrigger>
          <Button>Save</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog.Root>
```

### Component Responsibilities

**v2 Components:**
- **ModalHeader**: Container for title and close button
- **ModalBody**: Main content area (can scroll independently if scrollBehavior="inside")
- **ModalFooter**: Action buttons area
- **ModalCloseButton**: Close icon button

**v3 Components:**
- **Dialog.Header**: Container for title and/or close button
- **Dialog.Title**: Title text (semantic heading)
- **Dialog.Description**: Optional descriptive text
- **Dialog.Body**: Main content area
- **Dialog.Footer**: Action buttons area
- **Dialog.CloseTrigger**: Close button (polymorphic via asChild)
- **Dialog.ActionTrigger**: Action button wrapper (for footer actions)

---

## State Management

### v2: useDisclosure Hook
```jsx
import { useDisclosure } from '@chakra-ui/react';

function MyComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        {/* Modal content */}
      </Modal>
    </>
  );
}
```

### v3: useState with onOpenChange
```jsx
import { useState } from 'react';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button>Open</Button>
      </Dialog.Trigger>
      {/* Dialog content */}
    </Dialog.Root>
  );
}
```

### v3: Advanced State with useDialog (if available)
```jsx
import { Dialog } from '@chakra-ui/react';

function MyComponent() {
  const dialog = Dialog.useDialog();

  return (
    <Dialog.RootProvider value={dialog}>
      <Dialog.Trigger>Open</Dialog.Trigger>
      {/* Dialog content */}
    </Dialog.RootProvider>
  );
}
```

---

## Scroll Behavior

### v2 Scroll Behavior

#### Inside Scroll (Modal Body Only Scrolls)
```jsx
<Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Title</ModalHeader>
    <ModalBody overflowY="auto">
      {/* Long content scrolls within body only */}
    </ModalBody>
    <ModalFooter>
      {/* Stays fixed at bottom */}
    </ModalFooter>
  </ModalContent>
</Modal>
```

#### Outside Scroll (Entire Modal Scrolls)
```jsx
<Modal isOpen={isOpen} onClose={onClose} scrollBehavior="outside">
  {/* Entire modal content scrolls with the page */}
</Modal>
```

### v3 Scroll Behavior
In v3, scroll behavior control may be handled differently. Check if `scrollBehavior` prop is available or if it's controlled via Dialog.Body styling.

---

## Focus Management

### v2 Focus Management

#### Initial Focus
```jsx
const initialRef = useRef();

<Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
  <ModalOverlay />
  <ModalContent>
    <ModalBody>
      <Input ref={initialRef} placeholder="This gets focus" />
    </ModalBody>
  </ModalContent>
</Modal>
```

#### Final Focus (After Close)
```jsx
const finalRef = useRef();

return (
  <>
    <Button ref={finalRef}>Open Modal</Button>
    <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={finalRef}>
      {/* Modal content */}
    </Modal>
  </>
);
```

### v3 Focus Management
Focus management in v3 may use different prop names. Refer to v3-specific documentation for `initialFocusEl` or similar props.

---

## Animations & Transitions

### v2 Motion Presets
```jsx
{/* Motion preset values: slideInBottom, slideInRight, scale, none */}
<Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
  <ModalOverlay />
  <ModalContent>
    {/* Slides in from bottom */}
  </ModalContent>
</Modal>
```

**Available Presets:**
- **slideInBottom** - Slides in from bottom
- **slideInRight** - Slides in from right
- **scale** - Scales in from center (default)
- **none** - No animation

### v3 Animations
v3 uses built-in fade animations:
- **Opening**: `fade-in` animation (300ms)
- **Closing**: `fade-out` animation (200ms)

Custom animations are controlled via `Dialog.Backdrop` and `Dialog.Content` with CSS-in-JS or Chakra style props.

```jsx
<Dialog.Backdrop
  backdropFilter="blur(4px)"
  animation="fadeIn 0.3s ease-in-out"
>
  {/* Custom backdrop styling */}
</Dialog.Backdrop>
```

---

## Interactive Features

### v2: Close on Overlay Click
```jsx
<Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
  {/* Clicking overlay closes modal */}
</Modal>

<Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
  {/* Clicking overlay does NOT close modal */}
</Modal>
```

### v3: Close on Interact Outside
```jsx
<Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} closeOnInteractOutside={true}>
  {/* Interacting outside closes dialog */}
</Dialog.Root>

<Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} closeOnInteractOutside={false}>
  {/* Interacting outside does NOT close dialog */}
</Dialog.Root>
```

### v2: Block Scroll on Mount
```jsx
<Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={true}>
  {/* Body scroll is blocked when modal opens */}
</Modal>
```

---

## Lazy Mounting

### v2 Lazy Mounting
```jsx
<Modal isOpen={isOpen} onClose={onClose} isLazy>
  <ModalOverlay />
  <ModalContent>
    {/* Content not mounted until modal opens */}
  </ModalContent>
</Modal>
```

### v3 Lazy Mounting
```jsx
<Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} lazyMount>
  {/* Content not mounted until dialog opens */}
</Dialog.Root>
```

**Note**: In v3.6.0+, `lazyMount` is enabled by default.

---

## Key Properties/Props

### v2 Modal Props

#### Modal (Container)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | **Required**. Controls visibility |
| `onClose` | `() => void` | - | **Required**. Callback when modal closes |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal width |
| `isCentered` | `boolean` | `false` | Vertically center modal |
| `scrollBehavior` | `'inside' \| 'outside'` | `'outside'` | Where scrolling occurs |
| `motionPreset` | `'slideInBottom' \| 'slideInRight' \| 'scale' \| 'none'` | `'scale'` | Opening animation |
| `initialFocusRef` | `RefObject` | - | Element to focus on open |
| `finalFocusRef` | `RefObject` | - | Element to focus on close |
| `closeOnOverlayClick` | `boolean` | `true` | Close when backdrop clicked |
| `closeOnEsc` | `boolean` | `true` | Close when Escape pressed |
| `blockScrollOnMount` | `boolean` | `true` | Block body scroll when open |
| `isLazy` | `boolean` | `false` | Defer mounting until open |
| `trapFocus` | `boolean` | `true` | Trap focus within modal |

#### ModalContent
- Composes `Box` - accepts all Box props
- `maxW` - Custom max-width (if size not sufficient)

#### ModalHeader / ModalBody / ModalFooter
- Compose `Box` - accept all Box props

### v3 Dialog Props

#### Dialog.Root
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | **Required**. Controls visibility |
| `onOpenChange` | `(e: { open: boolean }) => void` | - | **Required**. Callback on state change |
| `placement` | `string` | `'center'` | Position of dialog (e.g., 'center', 'top') |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Dialog width |
| `lazyMount` | `boolean` | `true` (v3.6.0+) | Defer mounting until open |
| `unmountOnExit` | `boolean` | `true` (v3.6.0+) | Unmount when closed |
| `closeOnInteractOutside` | `boolean` | `true` | Close on backdrop/outside interaction |
| `closeOnEsc` | `boolean` | `true` | Close when Escape pressed |
| `positioning` | `object` | - | Advanced positioning configuration |

#### Dialog.Trigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | - | Render as child (polymorphic) |

#### Dialog.Content
- Accepts Chakra style props
- `maxW` - Custom max-width

#### Dialog.Backdrop
- Accepts Chakra style props for styling
- `bg` - Background color/style
- `backdropFilter` - CSS backdrop filter (blur, etc.)

#### Dialog.Positioner
- Minimal props exposed
- Handles positioning logic

#### Dialog.CloseTrigger / Dialog.ActionTrigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | - | Render as child (polymorphic) |

---

## Code Examples

### Example 1: Basic Dialog/Modal

#### v2
```jsx
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, useDisclosure } from '@chakra-ui/react';

export function BasicModalExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Enter your information below to create a new account.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

#### v3
```jsx
import { Dialog, Portal, Button } from '@chakra-ui/react';
import { useState } from 'react';

export function BasicDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create Account</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              Enter your information below to create a new account.
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button>Save</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
```

### Example 2: Confirmation Dialog

#### v2
```jsx
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@chakra-ui/react';

export function ConfirmationDialogExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirm = () => {
    console.log('Confirmed!');
    onClose();
  };

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Delete Item
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this item? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleConfirm}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

#### v3
```jsx
import { Dialog, Portal, Button } from '@chakra-ui/react';
import { useState } from 'react';

export function ConfirmationDialogExample() {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Confirmed!');
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement="center" closeOnInteractOutside={false}>
      <Dialog.Trigger asChild>
        <Button colorScheme="red">Delete Item</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm Delete</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              Are you sure you want to delete this item? This action cannot be undone.
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button colorScheme="red" onClick={handleConfirm}>
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
```

### Example 3: Form in Modal

#### v2
```jsx
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, FormControl, FormLabel, useDisclosure } from '@chakra-ui/react';
import { useRef } from 'react';

export function FormModalExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef();

  return (
    <>
      <Button onClick={onOpen}>Open Form</Button>

      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Profile</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input ref={initialRef} placeholder="Enter name" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input placeholder="Enter email" type="email" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

#### v3
```jsx
import { Dialog, Portal, Button, Input, FormControl, FormLabel } from '@chakra-ui/react';
import { useState, useRef } from 'react';

export function FormDialogExample() {
  const [open, setOpen] = useState(false);
  const initialRef = useRef();

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button>Open Form</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>User Profile</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input ref={initialRef} placeholder="Enter name" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter email" type="email" />
              </FormControl>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={() => setOpen(false)}>
                Save
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
```

### Example 4: Different Sizes

#### v2
```jsx
export function SizesModalExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = useState('md');

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];

  return (
    <>
      {sizes.map((s) => (
        <Button key={s} mr={4} onClick={() => { setSize(s); onOpen(); }}>
          {s}
        </Button>
      ))}

      <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{size} Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            This is a {size} sized modal.
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

#### v3
```jsx
export function SizesDialogExample() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState('md');

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];

  return (
    <>
      {sizes.map((s) => (
        <Button key={s} mr={4} onClick={() => { setSize(s); setOpen(true); }}>
          {s}
        </Button>
      ))}

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} size={size}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{size} Dialog</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                This is a {size} sized dialog.
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button onClick={() => setOpen(false)}>Close</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
```

---

## Accessibility Features

### ARIA Implementation

Both v2 and v3 implement WAI-ARIA modal dialog patterns.

#### v2 Modal ARIA Attributes
- **Modal**:
  - `role="dialog"`
  - `aria-modal="true"`
  - `aria-labelledby` (links to ModalHeader)
  - `aria-describedby` (links to ModalBody if present)

- **ModalCloseButton**:
  - `aria-label="Close"`

#### v3 Dialog ARIA Attributes
- **Dialog.Root**:
  - Manages modal state and ARIA attributes

- **Dialog.Content**:
  - `role="alertdialog"` (for alert dialogs) or `role="dialog"`
  - `aria-modal="true"`
  - `aria-labelledby` (links to Dialog.Title)
  - `aria-describedby` (links to Dialog.Description if present)

- **Dialog.Title**:
  - Automatically receives unique `id` for aria-labelledby linking

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Escape` | Close dialog/modal |
| `Tab` | Navigate focus forward within modal |
| `Shift+Tab` | Navigate focus backward within modal |
| `Enter` | Activate focused button |
| `Space` | Activate focused button/toggle |

### Focus Management

**v2:**
- Focus automatically set to first focusable element
- Can customize with `initialFocusRef`
- Focus returns to `finalFocusRef` element on close (default: trigger)
- Focus is trapped within modal while open

**v3:**
- Similar focus trapping behavior
- Focus props implementation may differ (check v3 docs)
- `Dialog.Positioner` and content structure affects focus order

### Screen Reader Support

- Announces dialog opening
- Reads dialog title (from Dialog.Title / ModalHeader)
- Reads dialog description (from Dialog.Description / ModalBody)
- Announces when dialog closes
- Announces disabled state of buttons within modal
- Proper semantic structure with heading hierarchy

### Color Contrast

- Backdrop has sufficient contrast (`black-alpha-500`)
- Content should follow WCAG AA contrast standards (built-in with Chakra theme)
- Text within dialog content must have adequate contrast

---

## Common Patterns

### 1. Alert/Confirmation Dialog
Modal/Dialog used to confirm destructive actions or alert users to important information.

### 2. Form Modal
Modal/Dialog containing a form for user input (user registration, profile editing, etc.).

### 3. Nested Modals
Multiple dialogs stacked (less common, use with caution for UX).

### 4. Modal with Tabs
Dialog containing tabbed content for organizing related options.

### 5. Modal with Scrollable Content
Large content that overflows viewport - use `scrollBehavior="inside"` (v2) or scroll-enabled `Dialog.Body` (v3).

### 6. Loading/Async Modal
Dialog that shows loading state while async operation completes, then displays results or success message.

### 7. Contextual Help Modal
Modal that provides additional information or help documentation for a feature.

### 8. Multi-step Wizard Modal
Dialog that guides user through multiple steps/pages of a workflow.

### 9. Modal Triggered by External Event
Dialog opened in response to application state changes (errors, notifications, etc.), not just user click.

### 10. Modal with Custom Animations
Dialog with custom motion presets or CSS animations for unique visual effects.

---

## Related Components

- **AlertDialog** - Specialized dialog for alerts and confirmations (v2 exists, check v3 availability)
- **Drawer** - Slide-out panel alternative to modal (better for mobile)
- **Popover** - Floating element for menus/popovers (not full-screen overlay)
- **Tooltip** - Small informational popup
- **Menu** - Dropdown menu component
- **Select** - Form select dropdown
- **Textarea** - Text input for long content
- **Button** - Common trigger for modals

---

## Migration Guide (v2 → v3)

### Step 1: Update Imports
```jsx
// Before (v2)
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure } from '@chakra-ui/react';

// After (v3)
import { Dialog, Portal, Button } from '@chakra-ui/react';
import { useState } from 'react';
```

### Step 2: Replace useDisclosure with useState
```jsx
// Before (v2)
const { isOpen, onOpen, onClose } = useDisclosure();

// After (v3)
const [open, setOpen] = useState(false);
```

### Step 3: Restructure Component Tree
```jsx
// Before (v2)
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Title</ModalHeader>
    <ModalCloseButton />
    <ModalBody>Content</ModalBody>
    <ModalFooter>
      <Button onClick={onClose}>Close</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// After (v3)
<Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Title</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>Content</Dialog.Body>
        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </Dialog.ActionTrigger>
        </Dialog.Footer>
        <Dialog.CloseTrigger />
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog.Root>
```

### Step 4: Rename Props
- `isOpen` → `open`
- `onClose` → `onOpenChange={(e) => setOpen(e.open)}`
- `isCentered={true}` → `placement="center"`
- `closeOnOverlayClick` → `closeOnInteractOutside`
- `isLazy` → `lazyMount`
- `ModalCloseButton` → `Dialog.CloseTrigger`

### Step 5: Update Focus Management Props
v3 may use different prop names for focus management. Check documentation for:
- `initialFocusRef` replacement
- `finalFocusRef` replacement

### Step 6: Handle Motion Presets
v3 has limited animation presets. If using custom animations:
```jsx
// v2
<Modal motionPreset="slideInBottom">

// v3 - Use custom CSS animations or style props
<Dialog.Backdrop animation="slideInBottom 0.3s ease-out" />
```

### Step 7: Test All Functionality
- [ ] Modal/Dialog opens and closes
- [ ] Focus management works correctly
- [ ] Keyboard navigation (Escape, Tab) works
- [ ] Accessibility features (ARIA, screen readers) work
- [ ] Content displays correctly
- [ ] Actions trigger correctly
- [ ] Animation/transitions work as expected

---

## Best Practices

### When to Use Dialog/Modal
✅ **Use Dialog/Modal for:**
- Confirming destructive actions (delete, logout)
- Collecting user input (forms, registration)
- Important alerts or warnings
- Focused tasks (checkout, login)
- Contextual help or additional information
- Critical decisions requiring user attention

❌ **Don't Use Dialog/Modal for:**
- Navigation between pages (use routing instead)
- Non-critical information (use alerts or tooltips)
- Long-form content (consider separate page)
- Frequently repeated actions (consider inline UI)

### UX Best Practices

1. **Clear Purpose**: Modal title should clearly indicate its purpose
2. **Simple Content**: Keep modal content focused and simple
3. **Clear Actions**: Use descriptive button labels (not just "OK"/"Cancel")
4. **Escape Routes**: Always provide a way to close (X button, Cancel button, Escape key)
5. **Focus Management**: Set initial focus to most relevant field/action
6. **Blocking**: Use `closeOnInteractOutside={false}` only for critical confirmations
7. **Sizing**: Use appropriate size for content (avoid tiny text or wasted space)
8. **Loading States**: Show loading indicator during async operations
9. **Error Handling**: Display clear error messages if something fails
10. **Mobile Consideration**: Ensure dialog is usable on mobile (may need full-screen or drawer)

### Performance Optimization

#### v2
```jsx
{/* Lazy mount to defer rendering until needed */}
<Modal isOpen={isOpen} onClose={onClose} isLazy>
  <ModalOverlay />
  <ModalContent>
    {/* Content only rendered when modal opens */}
  </ModalContent>
</Modal>
```

#### v3
```jsx
{/* Lazy mounting is default in v3.6.0+ */}
<Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} lazyMount>
  {/* Content only rendered when dialog opens */}
</Dialog.Root>
```

### Accessibility Best Practices

1. **Always have a title**: Dialog.Title (v3) or ModalHeader (v2) is required for proper labeling
2. **Use semantic HTML**: Use proper heading levels within dialog
3. **Focus trap**: Ensure focus remains within modal while open
4. **Keyboard support**: Test Escape key, Tab navigation, Enter on buttons
5. **Screen reader test**: Use screen reader to verify announcements
6. **Color contrast**: Ensure sufficient contrast for all text
7. **Icon buttons**: Always provide `aria-label` for icon buttons (like close button)

---

## Troubleshooting

### Issue: Modal/Dialog Not Closing
**Cause**: `onClose` callback not being called properly
**Solution**:
- v2: Ensure `onClose` is passed to Modal
- v3: Ensure `onOpenChange` callback is updating state correctly

### Issue: Focus Not Returning to Trigger
**Cause**: Focus management not configured
**Solution**:
- v2: Set `finalFocusRef` to trigger button ref
- v3: Check if Dialog.Root handles this automatically

### Issue: Content Not Scrolling
**Cause**: Scroll behavior not configured
**Solution**:
- v2: Use `scrollBehavior="inside"` on Modal
- v3: Check Dialog.Body styling or overflow properties

### Issue: Z-Index Problems with Other Modals
**Cause**: Multiple dialogs using same z-index
**Solution**: Use `Portal` to create separate stacking context

### Issue: Animations Not Working
**v2**: Set `motionPreset` prop
**v3**: Use custom CSS animations on Dialog.Content or Dialog.Backdrop

---

## Testing Guide

### Unit Testing Examples

#### v2 Testing
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BasicModalExample } from './BasicModalExample';

describe('Modal', () => {
  it('opens modal on button click', () => {
    render(<BasicModalExample />);
    const button = screen.getByText('Open Modal');
    fireEvent.click(button);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('closes modal on close button click', () => {
    render(<BasicModalExample />);
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText('Create Account')).not.toBeInTheDocument();
  });
});
```

#### v3 Testing
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BasicDialogExample } from './BasicDialogExample';

describe('Dialog', () => {
  it('opens dialog on trigger click', () => {
    render(<BasicDialogExample />);
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('closes dialog on close trigger click', () => {
    render(<BasicDialogExample />);
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText('Create Account')).not.toBeInTheDocument();
  });
});
```

---

## Additional Resources

- **Chakra UI v3 Dialog Docs**: https://www.chakra-ui.com/docs/components/dialog
- **Chakra UI v2 Modal Docs**: https://v2.chakra-ui.com/docs/components/modal
- **Chakra UI v3 Migration Guide**: https://www.chakra-ui.com/docs/get-started/migration
- **Ark UI Dialog**: https://ark-ui.com/docs/components/dialog (v3 foundation)
- **WAI-ARIA Dialog Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/
- **Chakra UI GitHub Issues**: https://github.com/chakra-ui/chakra-ui/issues

---

**Research completed**: 2025-11-05
**Component**: Dialog/Modal
**Framework**: Chakra UI
**Documentation URLs**:
- v3: https://www.chakra-ui.com/docs/components/dialog
- v2: https://v2.chakra-ui.com/docs/components/modal
