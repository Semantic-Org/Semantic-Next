# HeroUI - Modal Component

## Component Overview
The Modal component is a dialog box that displays content on top of the main application interface. It is used to capture user attention and present important information, forms, confirmations, or actions that require immediate user interaction. The Modal component prevents interaction with the main content and typically requires explicit action (closing, confirming, or canceling) before returning to the main interface. It consists of several composable sub-components including ModalHeader, ModalBody, ModalFooter, and ModalContent for flexible layout control.

Common use cases include:
- Alert dialogs for confirmations or warnings
- Forms for user input (login, registration, settings)
- Detail views or preview windows
- Droppable/draggable floating panels
- Notifications requiring user acknowledgment

## Usage Patterns

### Basic Usage
The basic modal requires an open/close state trigger and consists of Modal wrapper with ModalContent containing ModalHeader, ModalBody, and ModalFooter sub-components. The Modal component wraps all content and manages the overlay, stacking, and backdrop.

Key pattern:
```jsx
<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
  <ModalContent>
    <ModalHeader>Title</ModalHeader>
    <ModalBody>Content</ModalBody>
    <ModalFooter>Actions</ModalFooter>
  </ModalContent>
</Modal>
```

### Variants/Styles
HeroUI Modal provides several visual variants and styling approaches:

**Backdrop Variants:**
- `backdrop="opaque"` - Fully opaque dark overlay (default)
- `backdrop="blur"` - Blurred overlay effect for depth perception
- `backdrop="transparent"` - Transparent overlay allowing background visibility

**Size Variants:**
- `size="xs"` - Extra small modal
- `size="sm"` - Small modal
- `size="md"` - Medium modal (default)
- `size="lg"` - Large modal
- `size="xl"` - Extra large modal
- `size="2xl"` - 2x extra large modal
- `size="3xl"` - 3x extra large modal
- `size="4xl"` - 4x extra large modal
- `size="5xl"` - 5x extra large modal
- `size="full"` - Full screen modal

**Scrolling Behavior:**
- `scrollBehavior="inside"` - Content inside modal scrolls
- `scrollBehavior="outside"` - Modal itself scrolls
- `scrollBehavior="normal"` - Default behavior

### States
Modal supports several behavioral states controlled through props:

**Open/Closed State:**
- `isOpen` - Boolean to control visibility
- `onOpenChange` - Callback when modal should open/close
- Controls initial visibility and controlled/uncontrolled patterns

**Focus Management:**
- `autoFocus` - Whether to automatically focus the first focusable element on open
- `disallowEmptySelection` - Requires keeping focus within modal

**Interaction States:**
- `isDismissable` (default: true) - Allow closing by clicking backdrop
- `isKeyboardDismissDisabled` - Prevent closing with Esc key
- Modal can be in interactive or non-interactive dismiss state

**Loading/Processing:**
- Can use className and conditional rendering for loading states
- Common pattern: disable buttons, show spinners in ModalBody

**Animation States:**
- Modal supports enter/exit animation with `motionProps`
- Controls transition-in and transition-out behavior
- Custom animation timing and effects possible

### Sizing Options
Size control through dedicated size prop covering multiple predefined breakpoints:

| Size | Use Case |
|------|----------|
| `xs` | Inline confirmations, small alerts |
| `sm` | Simple forms, small messages |
| `md` | Standard dialogs (default) |
| `lg` | Complex forms, detailed information |
| `xl`, `2xl`, `3xl`, `4xl`, `5xl` | Large content, multi-section layouts |
| `full` | Full-screen applications, mobile-optimized views |

Full-width control also possible through ModalContent styling and CSS.

### Layout & Positioning
Modal positioning and layout patterns:

**Centering (Default):**
- Modal centers on screen by default
- Both horizontally and vertically centered
- Respects viewport boundaries

**Positioning Control:**
- `placement` prop for positioning (center is default)
- Can control through ModalContent styling
- Backdrop covers entire viewport

**Full-Screen:**
- `size="full"` option fills viewport
- Useful for mobile-responsive designs
- ModalHeader and ModalFooter stick to top/bottom

**Stacking:**
- Multiple modals can stack
- Higher z-index applied to newer modals
- Each modal has its own backdrop

**Overflow Handling:**
- `scrollBehavior="inside"` - Content scrolls within modal bounds
- `scrollBehavior="outside"` - Modal itself scrolls if too large
- ModalBody handles scroll behavior

### Content & Structure
Modal sub-components define structure:

**ModalContent:** Wrapper component that contains all modal elements and manages layout
- Direct child of Modal
- Contains header, body, footer in order
- Manages padding and spacing

**ModalHeader:** Top section for titles and close buttons
- Typically contains modal title/heading
- Often includes close button (action element)
- Sticky positioning possible with className

**ModalBody:** Main content area
- Contains primary modal content (text, forms, lists)
- Handles scrolling based on scrollBehavior prop
- Flexible height based on content

**ModalFooter:** Bottom section for action buttons
- Contains primary and secondary action buttons
- Buttons for confirm, cancel, or custom actions
- Sticky positioning common pattern

**Slot Content:**
- ModalHeader can include title and close button
- ModalBody can contain any JSX (forms, lists, text)
- ModalFooter typically contains Button components
- Sub-components are composable and flexible

### Interactive Features
Interactive patterns and behaviors:

**Open/Close Behavior:**
- Controlled via `isOpen` state and `onOpenChange` callback
- onOpenChange fires when user clicks backdrop or presses Esc (if enabled)
- Programmatic control via state setter

**Confirm Dialogs:**
- ModalFooter with confirm/cancel buttons
- Buttons call different handlers via onClick
- Confirm action updates parent state or makes API calls

**Backdrop Interaction:**
- Clicking backdrop triggers onOpenChange if `isDismissable={true}`
- `isDismissable={false}` prevents backdrop close
- Useful for critical confirmations or forms

**Keyboard Interaction:**
- Esc key closes modal by default (unless `isKeyboardDismissDisabled={true}`)
- Tab key manages focus within modal
- Enter key often used for form submission

**Nested Modals:**
- Multiple modals can be displayed simultaneously
- Each gets its own backdrop
- Later modals appear on top
- Focus management important for nested scenarios

### Animation & Transitions
Animation and motion control:

**Default Animations:**
- Fade-in for modal appearance
- Fade-out for modal disappearance
- Smooth backdrop transition

**Custom Animations via motionProps:**
- `motionProps` prop accepts Framer Motion configurations
- Control enter animation: `variants`, `initial`, `animate`, `exit`
- Timing control: `duration`, `delay`
- Easing functions supported

**Example Pattern:**
```jsx
motionProps={{
  variants: {
    enter: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: 20, opacity: 0, transition: { duration: 0.2 } }
  }
}}
```

**Animation States:**
- Entering: Modal fades/slides in
- Stable: Modal displayed and interactive
- Exiting: Modal fades/slides out and unmounts

### Draggable Feature
Modal supports draggable behavior (v2.6.0+):

**Enabling Drag:**
- Add `isDraggable` prop to enable dragging
- Modal is draggable only from the ModalHeader area
- Useful for floating panel interfaces

**Use Cases:**
- Floating tool palettes
- Resizable/draggable information panels
- Multi-window-like interfaces within web apps

**Constraints:**
- Drag handle limited to header region
- Prevents accidental dragging from body content
- Maintains modal visibility on drag

### Integration Patterns

**With Forms:**
- ModalBody contains form elements (inputs, selects, etc.)
- ModalFooter contains submit/cancel buttons
- Form state managed in parent component
- onOpenChange triggers form reset on close

**With Async Operations:**
- Loading state controlled via disabled button state
- Spinner component in ModalBody during loading
- API call triggered by ModalFooter button click
- Result determines if modal closes

**With Context Menus:**
- Modal can contain nested menus or dropdowns
- Menu items trigger actions that close modal
- State coordination between modals and menus

**With Lists/Tables:**
- Large lists displayed in ModalBody with scrolling
- Selection from list triggers action
- Modal may close after selection

**With Multi-Step Forms:**
- ModalBody shows current step
- Previous/Next buttons in ModalFooter
- onOpenChange triggers step reset

### Accessibility Features

**ARIA Implementation:**
- `role="dialog"` on modal root
- `aria-labelledby` connecting to ModalHeader for title announcement
- `aria-modal="true"` indicating modal behavior
- `aria-describedby` optional for additional description

**Focus Management:**
- Focus automatically moves to first focusable element on open
- `autoFocus` prop controls this behavior
- Focus trap prevents tabbing outside modal
- Focus returns to trigger element on close

**Keyboard Navigation:**
- Esc key closes modal (unless disabled)
- Tab navigates through focusable elements within modal
- Shift+Tab navigates backwards
- Enter submits forms in modal

**Screen Reader Support:**
- Modal title announced via ModalHeader content
- Modal purpose announced via aria-labelledby
- Button purposes announced via label text
- Content changes announced as they occur

**Visual Indicators:**
- Clear visual distinction from background
- Backdrop provides visual separation
- Modal header distinguishes from body content
- Focus indicators on interactive elements

**Color Contrast:**
- Text contrast meets WCAG AA standards
- Button colors distinct and accessible
- Visual focus indicators clearly visible

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | false | Controls whether modal is visible |
| `onOpenChange` | function | - | Callback fired when modal should open/close |
| `size` | enum | 'md' | Modal size: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, full |
| `backdrop` | enum | 'opaque' | Backdrop style: opaque, blur, transparent |
| `scrollBehavior` | enum | 'inside' | Scroll behavior: inside, outside, normal |
| `isDismissable` | boolean | true | Allow closing by clicking backdrop |
| `isKeyboardDismissDisabled` | boolean | false | Prevent closing with Esc key |
| `isDraggable` | boolean | false | Enable dragging modal from header (v2.6.0+) |
| `autoFocus` | boolean | true | Auto-focus first focusable element on open |
| `motionProps` | object | - | Custom animation configuration |
| `classNames` | object | - | Custom CSS classes for modal elements |
| `className` | string | - | CSS class for modal root |

## Code Examples

### Example 1: Basic Modal with Close Button
```jsx
import { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';

export default function BasicModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
          <ModalBody>
            <p>This is the modal content.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setIsOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

### Example 2: Confirmation Dialog
```jsx
import { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';

export default function ConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    // Handle confirmation action
    console.log('Confirmed');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button color="danger" onPress={() => setIsOpen(true)}>Delete Item</Button>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={handleCancel}>Cancel</Button>
            <Button color="danger" onPress={handleConfirm}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

### Example 3: Modal with Form and Validation
```jsx
import { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from '@heroui/react';

export default function FormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', { email });
    setIsLoading(false);
    setEmail('');
    setIsOpen(false);
  };

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open Form Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Enter Email</ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Email"
              placeholder="Enter your email"
              value={email}
              onValueChange={setEmail}
              type="email"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={() => setIsOpen(false)}>Cancel</Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

### Example 4: Modal with Draggable Header
```jsx
import { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';

export default function DraggableModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open Draggable Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} isDraggable>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Draggable Modal</ModalHeader>
          <ModalBody>
            <p>Drag this modal by its header.</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
```

### Example 5: Large Modal with Custom Animation
```jsx
import { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';

export default function LargeAnimatedModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open Large Modal</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        size="3xl"
        backdrop="blur"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.3, ease: 'easeOut' }
            },
            exit: {
              y: 20,
              opacity: 0,
              transition: { duration: 0.2, ease: 'easeIn' }
            },
          },
        }}
      >
        <ModalContent className="max-h-[80vh]">
          <ModalHeader>Large Content Modal</ModalHeader>
          <ModalBody className="overflow-y-auto">
            <p>This is a large modal with custom animations and blur backdrop.</p>
            {/* More content here */}
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setIsOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

## Accessibility Notes

**Focus Management Implementation:**
- HeroUI Modal automatically implements focus trap behavior
- Focus cannot escape to background content
- First interactive element auto-focused on modal open
- Focus returns to trigger element on close

**ARIA Implementation Details:**
- Modal implements `role="dialog"` with proper ARIA attributes
- `aria-labelledby` connects to ModalHeader for title announcement
- `aria-modal="true"` clearly indicates modal state
- Backdrop is not interactive, doesn't receive focus

**Keyboard Interaction Requirements:**
- Esc key must close modal (or set `isKeyboardDismissDisabled` for critical actions)
- Tab key cycles through focusable elements
- Enter/Space activate buttons appropriately
- Form submission handled via Enter in form contexts

**Screen Reader Announcements:**
- Modal title announced via ModalHeader content
- Button purposes announced based on labels
- Dynamic content changes announced
- Modal open/close events should be announced

**Visual Accessibility:**
- Sufficient color contrast in all text
- Focus indicators clearly visible on interactive elements
- Modal visually distinct from background (via backdrop)
- Loading states visually indicated (spinners, disabled buttons)

## Common Patterns

1. **Alert/Confirmation Dialog**: Simple modal with title, message, and action buttons for user confirmations

2. **Form Modal**: Modal containing form inputs for data collection with submit/cancel buttons

3. **Detail View Modal**: Modal displaying expanded information about a selected item with close button

4. **Multi-Step Modal**: Modal with multiple steps, using state to manage current step and navigation buttons

5. **Loading Modal**: Modal preventing interaction while async operation completes, showing loading indicator

6. **Nested Modals**: Multiple modals displayed simultaneously for complex workflows requiring layered decisions

7. **Scrollable Content Modal**: Modal with large content exceeding viewport height, scrolling contained within modal

8. **Floating Tool Panel**: Draggable modal behaving like a floating tool palette or widget

9. **Responsive Modal**: Modal adjusting size/layout for different screen sizes using size prop and responsive classes

10. **Custom Styled Modal**: Modal with custom colors, fonts, and decorative elements via classNames prop

## Related Components

- **Button** - Used in ModalFooter for actions
- **Input** - Form input component used inside ModalBody
- **Card** - Can be used similarly for non-overlaying layouts
- **Dropdown** - Can contain menus within modal
- **Tooltip** - Can provide additional context within modals
- **Spinner** - Used for loading states in modals
- **Dialog** (HTML element) - Native alternative (HeroUI Modal recommended for React)

---
Research completed: 2025-11-05
Component: Modal
Framework: HeroUI
Documentation: https://www.heroui.com/docs/components/modal
