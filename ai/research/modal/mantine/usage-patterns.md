# Mantine - Modal Component

## Component Overview

The Mantine Modal component is an accessible overlay dialog that provides a focused, contained interface for user interactions. It implements WAI-ARIA recommendations for the dialog pattern and supports comprehensive customization through compound components. The Modal is designed to interrupt user flow for critical interactions while maintaining accessibility and keyboard navigation standards.

**Primary Use Cases:**
- Confirming destructive actions (delete, archive, logout)
- Collecting form input (settings, feedback, signup)
- Displaying focused content (alerts, documentation, previews)
- Wizard/multi-step flows
- Modal stacking for complex interactions

---

## Usage Patterns

### Basic Usage

The Modal is controlled via the `opened` prop and `onClose` callback. The simplest implementation uses `useDisclosure` hook for state management:

```jsx
import { Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function BasicModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open}>Open Modal</Button>

      <Modal opened={opened} onClose={close} title="Authentication">
        <div>Sign in to your account</div>
      </Modal>
    </>
  );
}
```

### Compound Component Structure

Mantine Modal uses compound components for granular control:

```jsx
<Modal opened={opened} onClose={close}>
  <Modal.Header>
    <Modal.Title>Modal Title</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>

  <Modal.Body>
    Modal content goes here
  </Modal.Body>
</Modal>
```

**Compound Components:**
- `Modal.Root` – Context provider (implicit when using `Modal`)
- `Modal.Overlay` – Backdrop/overlay layer
- `Modal.Content` – Main container and positioning
- `Modal.Header` – Sticky header section (optional)
- `Modal.Title` – Semantic heading (h2 element)
- `Modal.CloseButton` – Close icon button in header
- `Modal.Body` – Content area with automatic scroll

---

## Variants/Styles

### Visual Variants

Mantine Modal doesn't have predefined variants, but achieves variation through size, positioning, and styling props:

**Fullscreen Modal**
```jsx
<Modal opened={opened} onClose={close} fullScreen>
  <Modal.Header>
    <Modal.Title>Full Screen Modal</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>Large content area</Modal.Body>
</Modal>
```

**Centered Modal**
```jsx
<Modal opened={opened} onClose={close} centered>
  <Modal.Header>
    <Modal.Title>Centered Modal</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>Content</Modal.Body>
</Modal>
```

**Confirmation Dialog (Compact)**
```jsx
<Modal opened={opened} onClose={close} size="sm" centered>
  <Modal.Header>
    <Modal.Title>Confirm Action</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>
    <Text size="sm">Are you sure?</Text>
    <Group mt="md">
      <Button onClick={close} variant="default">Cancel</Button>
      <Button color="red">Delete</Button>
    </Group>
  </Modal.Body>
</Modal>
```

### Overlay Styling

Customize the backdrop appearance:

```jsx
<Modal
  opened={opened}
  onClose={close}
  overlayProps={{
    backgroundOpacity: 0.55,
    blur: 3
  }}
>
  <Modal.Header>
    <Modal.Title>Styled Overlay</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>Content with custom backdrop</Modal.Body>
</Modal>
```

**Overlay Props:**
- `backgroundOpacity` (0-1) – Backdrop opacity
- `blur` (number) – Blur amount in pixels
- `color` – Overlay color
- All `Overlay` component properties supported

---

## States

### Open/Closed State

Controlled via `opened` prop and `onClose` callback:

```jsx
const [opened, { open, close, toggle }] = useDisclosure(false);

<Modal opened={opened} onClose={close}>
  {/* Modal content */}
</Modal>
```

### Loading State

Create loading state by disabling interactions:

```jsx
function ModalWithLoading() {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitForm();
      close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={close}>
      <Modal.Header>
        <Modal.Title>Form</Modal.Title>
        <Modal.CloseButton disabled={loading} />
      </Modal.Header>
      <Modal.Body>
        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          Submit
        </Button>
      </Modal.Body>
    </Modal>
  );
}
```

### Error/Success States

Manage validation and result states:

```jsx
function ModalWithValidation() {
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  return (
    <Modal opened={opened} onClose={close}>
      <Modal.Header>
        <Modal.Title>Submit Data</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        {error && <Alert color="red">{error}</Alert>}
        {success && <Alert color="green">Success!</Alert>}
        {/* Form content */}
      </Modal.Body>
    </Modal>
  );
}
```

---

## Sizing Options

### Predefined Sizes

Mantine provides five standard sizes:

```jsx
<Modal opened={opened} onClose={close} size="xs">
  {/* Extra small */}
</Modal>

<Modal opened={opened} onClose={close} size="sm">
  {/* Small (common for confirmations) */}
</Modal>

<Modal opened={opened} onClose={close} size="md">
  {/* Medium (default) */}
</Modal>

<Modal opened={opened} onClose={close} size="lg">
  {/* Large */}
</Modal>

<Modal opened={opened} onClose={close} size="xl">
  {/* Extra large */}
</Modal>
```

**Default Sizes (approximate widths):**
- `xs` ≈ 20rem (320px)
- `sm` ≈ 26rem (416px)
- `md` ≈ 34rem (544px) – Default
- `lg` ≈ 48rem (768px)
- `xl` ≈ 61rem (976px)

### Custom Sizes

Specify custom width using percentages or units:

```jsx
<Modal opened={opened} onClose={close} size="55%">
  {/* 55% of viewport width */}
</Modal>

<Modal opened={opened} onClose={close} size="50rem">
  {/* 800px width (50rem = 800px with 16px base) */}
</Modal>

<Modal opened={opened} onClose={close} size="90vw">
  {/* 90% of viewport width */}
</Modal>
```

### Auto Sizing

Content-based width:

```jsx
<Modal opened={opened} onClose={close} size="auto">
  <Modal.Body style={{ width: 'fit-content' }}>
    Flexible width content
  </Modal.Body>
</Modal>
```

**Constraints:**
- Maximum width cannot exceed `100vw`
- Minimum width determined by content and padding
- Responsive adjustments require custom media queries or `useMediaQuery` hook

---

## Layout & Positioning

### Vertical Centering

Center modal vertically on screen:

```jsx
<Modal opened={opened} onClose={close} centered>
  <Modal.Header>
    <Modal.Title>Centered Modal</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>Content</Modal.Body>
</Modal>
```

**Default positioning:** Top-aligned (non-centered)
**With `centered` prop:** Vertically centered

### Custom Offset

Control horizontal and vertical positioning:

```jsx
<Modal
  opened={opened}
  onClose={close}
  centered
  xOffset="md"  // Horizontal padding/offset
  yOffset="md"  // Vertical offset from top
>
  {/* Modal content */}
</Modal>
```

**yOffset values:** Mantine spacing scale (xs, sm, md, lg, xl) or pixel values

### Responsive Positioning

Use `useMediaQuery` for responsive behavior:

```jsx
function ResponsiveModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Modal
      opened={opened}
      onClose={close}
      fullScreen={isMobile}
      centered={!isMobile}
      size={isMobile ? '100%' : 'md'}
    >
      <Modal.Header>
        <Modal.Title>Responsive Modal</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>Adapts to screen size</Modal.Body>
    </Modal>
  );
}
```

### Fullscreen Mode

Covers entire viewport:

```jsx
<Modal opened={opened} onClose={close} fullScreen>
  <Modal.Header>
    <Modal.Title>Full Screen Modal</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>Takes up entire screen</Modal.Body>
</Modal>
```

**Fullscreen behavior:**
- Ignores `size` prop
- Ignores `centered` prop
- Ignores custom positioning
- Useful for mobile views or complex forms

---

## Content & Structure

### Header and Title

The Modal.Header provides a sticky section for heading and close button:

```jsx
<Modal opened={opened} onClose={close} title="Modal Title">
  {/* Using title prop is shorthand for header setup */}
</Modal>

// Equivalent to:
<Modal opened={opened} onClose={close}>
  <Modal.Header>
    <Modal.Title>Modal Title</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>Content</Modal.Body>
</Modal>
```

### Without Close Button

Remove close button from header:

```jsx
<Modal opened={opened} onClose={close} withCloseButton={false}>
  <Modal.Header>
    <Modal.Title>Action Required</Modal.Title>
  </Modal.Header>
  <Modal.Body>User must interact with form to close</Modal.Body>
</Modal>
```

### Custom Close Button

Customize the close button icon:

```jsx
<Modal
  opened={opened}
  onClose={close}
  closeButtonProps={{
    icon: <IconX />,
    size: 'lg',
    radius: 'md',
  }}
>
  <Modal.Header>
    <Modal.Title>Custom Close Button</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>Content</Modal.Body>
</Modal>
```

### Body Content

The Modal.Body handles scrolling and padding automatically:

```jsx
<Modal opened={opened} onClose={close}>
  <Modal.Header>
    <Modal.Title>Modal with Content</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>
    <Text>Regular text content</Text>
    <List>
      <List.Item>Item 1</List.Item>
      <List.Item>Item 2</List.Item>
    </List>
    <Group mt="md">
      <Button>Action 1</Button>
      <Button variant="subtle">Action 2</Button>
    </Group>
  </Modal.Body>
</Modal>
```

### Long Content with Scrolling

The Modal.Body automatically scrolls while header remains sticky:

```jsx
<Modal opened={opened} onClose={close} size="md">
  <Modal.Header>
    <Modal.Title>Long Content</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>
    {/* Content that may exceed modal height will scroll */}
    {Array.from({ length: 100 }).map((_, i) => (
      <div key={i}>Item {i + 1}</div>
    ))}
  </Modal.Body>
</Modal>
```

### Advanced Scroll Area

Use ScrollArea component for fine-grained control:

```jsx
import { ScrollArea } from '@mantine/core';

<Modal opened={opened} onClose={close}>
  <Modal.Header>
    <Modal.Title>Advanced Scrolling</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <ScrollArea.Autosize mah={400}>
    <Modal.Body p={0}>
      {/* Content with custom scroll behavior */}
    </Modal.Body>
  </ScrollArea.Autosize>
</Modal>
```

---

## Interactive Features

### Open/Close Behavior

**Programmatic Control:**
```jsx
const [opened, { open, close, toggle }] = useDisclosure(false);

<Button onClick={open}>Open</Button>
<Button onClick={close}>Close</Button>
<Button onClick={toggle}>Toggle</Button>
```

**Manual State Management:**
```jsx
const [opened, setOpened] = useState(false);

<Modal opened={opened} onClose={() => setOpened(false)}>
  {/* Content */}
</Modal>
```

### Close Triggers

Configure what closes the modal:

```jsx
<Modal
  opened={opened}
  onClose={close}
  closeOnEscape={true}           // Default: true
  closeOnClickOutside={true}     // Default: true
  trapFocus={true}               // Default: true
>
  <Modal.Header>
    <Modal.Title>Closeable Modal</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>Press Escape, click overlay, or close button</Modal.Body>
</Modal>
```

### Prevent Closing

Create modals that require explicit action:

```jsx
function ConfirmationModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const [agreed, setAgreed] = useState(false);

  const handleClose = () => {
    if (agreed || confirm('Cancel without confirming?')) {
      close();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      closeOnEscape={false}
      closeOnClickOutside={false}
    >
      <Modal.Header>
        <Modal.Title>Confirm Agreement</Modal.Title>
        <Modal.CloseButton onClick={handleClose} />
      </Modal.Header>
      <Modal.Body>
        <Checkbox
          label="I agree to terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.currentTarget.checked)}
        />
        <Group mt="md">
          <Button onClick={handleClose} variant="default">Cancel</Button>
          <Button onClick={close} disabled={!agreed}>Confirm</Button>
        </Group>
      </Modal.Body>
    </Modal>
  );
}
```

### Modal with Form

Integrate form handling:

```jsx
function FormModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (!value ? 'Email required' : null),
      password: (value) => (!value ? 'Password required' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
    close();
  });

  return (
    <Modal opened={opened} onClose={close} title="Login">
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
          mt="md"
        />
        <Group mt="md">
          <Button type="submit">Login</Button>
          <Button variant="default" onClick={close}>Cancel</Button>
        </Group>
      </form>
    </Modal>
  );
}
```

---

## Animation & Transitions

### Default Transition

Modals use fade transition by default:

```jsx
<Modal opened={opened} onClose={close}>
  {/* Fade in/out animation */}
</Modal>
```

### Custom Transitions

Configure transition behavior:

```jsx
<Modal
  opened={opened}
  onClose={close}
  transitionProps={{
    transition: 'fade',        // fade, scale, rotate-left, etc.
    duration: 200,             // ms
    timingFunction: 'ease',    // cubic-bezier timing
  }}
>
  <Modal.Header>
    <Modal.Title>Custom Animation</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>Content</Modal.Body>
</Modal>
```

**Available Transitions:**
- `fade` – Opacity change (default)
- `scale` – Zoom in/out
- `rotate-left` – Rotation animation
- Other Mantine `Transition` component types

### Transition Lifecycle Callbacks

Handle animation completion:

```jsx
const [data, setData] = useState(null);

<Modal
  opened={opened}
  onClose={close}
  transitionProps={{
    onEnterTransitionEnd: () => {
      console.log('Modal entered');
    },
    onExitTransitionEnd: () => {
      // Clear data after exit animation completes
      setData(null);
      console.log('Modal exited');
    },
  }}
>
  <Modal.Header>
    <Modal.Title>Modal with Callbacks</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>{data}</Modal.Body>
</Modal>
```

---

## Integration Patterns

### Modal with Async Operations

Handle loading and error states during async operations:

```jsx
function AsyncModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);

  const handleAsyncAction = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData();
      setResult(data);
      // Keep modal open to show result
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    close();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Async Action">
      {!result ? (
        <>
          {error && <Alert color="red">{error}</Alert>}
          <Button
            onClick={handleAsyncAction}
            loading={loading}
            fullWidth
          >
            Perform Action
          </Button>
        </>
      ) : (
        <>
          <Alert color="green">Success!</Alert>
          <Text>{result.message}</Text>
          <Button onClick={close} fullWidth mt="md">Close</Button>
        </>
      )}
    </Modal>
  );
}
```

### Multi-Step Modal (Wizard)

Create sequential step modals:

```jsx
function WizardModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const [step, setStep] = useState(0);
  const steps = ['Personal Info', 'Address', 'Confirmation'];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      close();
      setStep(0);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Modal opened={opened} onClose={() => { close(); setStep(0); }} title={steps[step]}>
      <Stepper active={step} onStepClick={setStep}>
        {steps.map((label, i) => (
          <Stepper.Step key={i} label={label} />
        ))}
      </Stepper>

      <div style={{ marginTop: '2rem' }}>
        {step === 0 && <PersonalInfo />}
        {step === 1 && <AddressInfo />}
        {step === 2 && <Confirmation />}
      </div>

      <Group mt="md">
        {step > 0 && <Button variant="default" onClick={handleBack}>Back</Button>}
        <Button onClick={handleNext} ml="auto">
          {step === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Group>
    </Modal>
  );
}
```

### Nested Modals

Mantine provides `Modal.Stack` for managing multiple concurrent modals:

```jsx
function NestedModals() {
  const stack = useModalsStack(['modal1', 'modal2']);

  return (
    <>
      <Button onClick={() => stack.open('modal1')}>
        Open First Modal
      </Button>

      <Modal
        opened={stack.state('modal1')}
        onClose={() => stack.close('modal1')}
        title="First Modal"
      >
        <Modal.Body>
          <Button onClick={() => stack.open('modal2')}>
            Open Nested Modal
          </Button>
        </Modal.Body>
      </Modal>

      <Modal
        opened={stack.state('modal2')}
        onClose={() => stack.close('modal2')}
        title="Nested Modal"
      >
        <Modal.Body>This is nested inside the first modal</Modal.Body>
      </Modal>
    </>
  );
}
```

---

## Accessibility Features

### Focus Trap

Focus is automatically trapped inside the modal:

```jsx
<Modal
  opened={opened}
  onClose={close}
  trapFocus={true}  // Default: true
>
  {/* Focus cannot escape this modal */}
</Modal>
```

### Focus Management

Use `data-autofocus` to control initial focus:

```jsx
<Modal opened={opened} onClose={close} title="Form">
  <Modal.Body>
    <TextInput
      label="Name"
      placeholder="Enter your name"
      data-autofocus  // Focus goes here on open
    />
    <Button mt="md">Submit</Button>
  </Modal.Body>
</Modal>
```

**Focus behavior:**
- First focusable element receives focus on open (or element with `data-autofocus`)
- Tab cycles through focusable elements only
- Focus returns to trigger element on close (`returnFocus=true`)

### Return Focus

Return focus to trigger element when modal closes:

```jsx
<Modal
  opened={opened}
  onClose={close}
  returnFocus={true}  // Default: true
>
  {/* Trigger element gets focus back when closed */}
</Modal>
```

### ARIA Attributes

Semantic markup and ARIA labels are automatically applied:

```jsx
<Modal
  opened={opened}
  onClose={close}
  title="Delete Item"  // Sets aria-labelledby
>
  <Modal.Body>
    Are you sure you want to delete?
    {/* Modal.Body sets aria-describedby */}
  </Modal.Body>
</Modal>
```

**Automatic ARIA:**
- `role="dialog"` on modal container
- `aria-labelledby` points to title
- `aria-describedby` points to body content
- `aria-hidden="true"` on background content

### Custom ARIA Labels

Customize accessibility labels for close button:

```jsx
<Modal
  opened={opened}
  onClose={close}
  closeButtonProps={{
    'aria-label': 'Close modal dialog',
  }}
>
  {/* Close button has custom accessible name */}
</Modal>
```

### Keyboard Navigation

Fully supported by default:

```jsx
// Users can:
// - Press Tab to navigate focusable elements
// - Press Shift+Tab to navigate backwards
// - Press Escape to close (if closeOnEscape=true)
// - Press Enter to activate buttons
```

### Scroll Lock

Prevent background scrolling while modal is open:

```jsx
<Modal
  opened={opened}
  onClose={close}
  // Scroll lock is automatic via react-remove-scroll
>
  {/* Body scroll is locked, pinch-zoom may be disabled */}
</Modal>
```

**Custom scroll configuration:**
```jsx
<Modal
  opened={opened}
  onClose={close}
  removeScrollProps={{
    allowPinchZoom: true,  // Allow pinch-zoom on mobile
    enabled: true,
  }}
>
  {/* Content */}
</Modal>
```

---

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opened` | boolean | false | Whether modal is visible |
| `onClose` | () => void | required | Called when modal should close |
| `title` | ReactNode | undefined | Modal title (shorthand for header setup) |
| `size` | string \| number | 'md' | Modal width (xs, sm, md, lg, xl, or custom) |
| `centered` | boolean | false | Vertically center modal |
| `fullScreen` | boolean | false | Cover entire viewport |
| `xOffset` | string \| number | 'md' | Horizontal offset (spacing scale or px) |
| `yOffset` | string \| number | 'md' | Vertical offset from top |
| `trapFocus` | boolean | true | Trap keyboard focus inside modal |
| `closeOnEscape` | boolean | true | Close when Escape key pressed |
| `closeOnClickOutside` | boolean | true | Close when overlay clicked |
| `withCloseButton` | boolean | true | Display close button in header |
| `closeButtonProps` | object | {} | Props for close button (icon, size, aria-label) |
| `children` | ReactNode | required | Modal content |
| `transitionProps` | object | {transition: 'fade'} | Animation config (transition, duration, timingFunction) |
| `overlayProps` | object | {} | Overlay styling (backgroundOpacity, blur, color) |
| `removeScrollProps` | object | {} | Scroll lock config (allowPinchZoom, enabled) |
| `scrollAreaComponent` | component | undefined | Custom scroll container component |
| `returnFocus` | boolean | true | Return focus to trigger on close |
| `zIndex` | number | undefined | CSS z-index value |
| `classNames` | object | {} | CSS class overrides |
| `styles` | object | {} | Inline style overrides |

### Modal.Root Props

Container component for compound API:

```jsx
<Modal.Root opened={opened} onClose={close}>
  {/* Compound structure */}
</Modal.Root>
```

### Modal.Content Props

Center sizing and positioning:

```jsx
<Modal.Content size="md" centered={true}>
  {/* Content goes here */}
</Modal.Content>
```

### Modal.Header Props

Sticky header container:

```jsx
<Modal.Header p="md">
  {/* Header content */}
</Modal.Header>
```

### Modal.Body Props

Content area with automatic scroll:

```jsx
<Modal.Body p="lg">
  {/* Body content automatically scrolls if overflow */}
</Modal.Body>
```

---

## Code Examples

### Example 1: Basic Modal

```jsx
import { Modal, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function BasicModalExample() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open}>Open Modal</Button>

      <Modal opened={opened} onClose={close} title="Welcome">
        <Text>This is a basic modal with simple content.</Text>
      </Modal>
    </>
  );
}
```

### Example 2: Confirmation Dialog

```jsx
import { Modal, Button, Text, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function ConfirmationModalExample() {
  const [opened, { open, close }] = useDisclosure(false);

  const handleConfirm = () => {
    console.log('Confirmed');
    close();
  };

  return (
    <>
      <Button onClick={open} color="red">Delete Item</Button>

      <Modal opened={opened} onClose={close} title="Confirm Deletion" size="sm" centered>
        <Modal.Body>
          <Text size="sm" mb="md">
            Are you sure you want to delete this item? This action cannot be undone.
          </Text>
          <Group gap="md">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button color="red" onClick={handleConfirm}>Delete</Button>
          </Group>
        </Modal.Body>
      </Modal>
    </>
  );
}
```

### Example 3: Form Modal

```jsx
import { Modal, Button, TextInput, PasswordInput, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

export function FormModalExample() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (!value ? 'Email is required' : null),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    console.log('Form submitted:', values);
    close();
    form.reset();
  });

  return (
    <>
      <Button onClick={open}>Open Login Form</Button>

      <Modal opened={opened} onClose={close} title="Login">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
            mb="md"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
            mb="md"
          />
          <Group gap="sm">
            <Button type="submit">Login</Button>
            <Button variant="default" onClick={close}>Cancel</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
```

### Example 4: Modal with Loading State

```jsx
import { Modal, Button, Text, Alert, Group, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

export function LoadingModalExample() {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsyncAction = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      close();
    } catch (err) {
      setError('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={open}>Perform Async Action</Button>

      <Modal opened={opened} onClose={close} title="Processing" closeOnClickOutside={false}>
        <Modal.Body>
          {error && <Alert color="red" mb="md">{error}</Alert>}

          {!error && (
            <Text mb="md">Click below to start the operation:</Text>
          )}

          <Group gap="sm">
            <Button
              onClick={handleAsyncAction}
              loading={loading}
              disabled={loading || !!error}
            >
              {loading ? 'Processing...' : 'Start'}
            </Button>
            <Button
              variant="default"
              onClick={close}
              disabled={loading}
            >
              Close
            </Button>
          </Group>
        </Modal.Body>
      </Modal>
    </>
  );
}
```

### Example 5: Responsive Modal

```jsx
import { Modal, Button } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

export function ResponsiveModalExample() {
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Button onClick={open}>Open Responsive Modal</Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Responsive Content"
        fullScreen={isMobile}
        centered={!isMobile}
        size={isMobile ? '100%' : 'lg'}
      >
        <Modal.Body>
          <p>This modal adapts to screen size.</p>
          <p>On mobile, it takes fullscreen. On desktop, it's centered with lg size.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
```

---

## Accessibility Notes

**Focus Management:**
- Focus is automatically trapped inside the modal when `trapFocus={true}` (default)
- Use `data-autofocus` attribute on the input/element that should receive initial focus
- Focus returns to the trigger element automatically when modal closes (`returnFocus={true}`)

**ARIA Implementation:**
- Modal automatically receives `role="dialog"`
- Title (via `title` prop) is linked via `aria-labelledby`
- Body content is linked via `aria-describedby`
- Close button receives `aria-label="Close modal"` by default
- Custom `aria-label` can be passed via `closeButtonProps`

**Keyboard Support:**
- **Tab:** Navigate forward through focusable elements
- **Shift+Tab:** Navigate backward through focusable elements
- **Escape:** Close modal (if `closeOnEscape={true}`)
- **Enter:** Activate buttons and submit forms
- All focusable elements within modal are reachable via keyboard

**Screen Reader Testing:**
- Test with NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS), TalkBack (Android)
- Verify modal title is announced on open
- Verify focus trap functionality
- Verify all interactive elements are reachable and properly labeled

**Accessibility Best Practices:**
- Always provide a meaningful title via `title` prop or `Modal.Title`
- Ensure color alone is not used to convey information (use text or icons)
- Use semantic HTML elements (buttons, inputs, etc.) not divs with click handlers
- Ensure minimum color contrast ratio of 4.5:1 for normal text
- Test with keyboard-only navigation
- Provide alternative text for any images or icons in the modal

---

## Common Patterns

### 1. Confirmation Dialog
Standard pattern for destructive actions:
```jsx
const [opened, { open, close }] = useDisclosure(false);

<Modal opened={opened} onClose={close} title="Confirm" size="sm" centered>
  <Modal.Body>
    <Text>Confirm your action?</Text>
    <Group mt="lg">
      <Button variant="default" onClick={close}>Cancel</Button>
      <Button color="red" onClick={() => { performAction(); close(); }}>Delete</Button>
    </Group>
  </Modal.Body>
</Modal>
```

### 2. Form in Modal
Common for collecting user input:
```jsx
<Modal opened={opened} onClose={close} title="Create Item">
  <form onSubmit={handleFormSubmit}>
    {/* Form inputs */}
    <Button type="submit">Create</Button>
  </form>
</Modal>
```

### 3. Responsive Mobile/Desktop
Adapt modal size based on screen:
```jsx
const isMobile = useMediaQuery('(max-width: 768px)');
<Modal fullScreen={isMobile} centered={!isMobile} />
```

### 4. Multi-Step Wizard
Guide users through sequential steps:
```jsx
<Modal>
  <Stepper active={step}>
    <Stepper.Step label="Step 1" />
    <Stepper.Step label="Step 2" />
  </Stepper>
  {/* Conditional step content */}
</Modal>
```

### 5. Loading/Async State
Handle long-running operations:
```jsx
<Modal closeOnClickOutside={!loading}>
  <Button loading={loading} onClick={handleAsync}>Process</Button>
</Modal>
```

### 6. Modal Stack
Manage multiple modals:
```jsx
const stack = useModalsStack(['id1', 'id2']);
// Handles z-index, focus, escape key automatically
```

---

## Related Components

- **Overlay** – Backdrop component used within Modal
- **Menu** – Alternative overlay pattern for actions
- **Dialog** – Alternative semantic dialog component
- **FocusTrap** – Focus management primitive
- **Transition** – Animation system used by Modal
- **ScrollArea** – Custom scroll behavior for long content
- **Stepper** – Multi-step workflow component
- **Group** – Layout component for buttons and content

---

Research completed: 2025-11-05
Component: Modal
Framework: Mantine
Documentation: https://mantine.dev/core/modal/
