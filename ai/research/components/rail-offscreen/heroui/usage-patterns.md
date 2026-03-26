# HeroUI Drawer - Usage Patterns

**Research Date**: 2025-11-05
**Framework**: HeroUI (React UI Library)
**Component**: Drawer
**Documentation**: https://www.heroui.com/docs/components/drawer

---

## Component Overview

The HeroUI Drawer component is a sliding panel interface that displays supplementary content from the edge of the screen. It combines overlay functionality with smooth animations, focus management, and accessibility features. The drawer is ideal for navigation panels, sidebars, settings panels, and offscreen menu content.

The Drawer is built on React Aria principles and uses a composition pattern with five interrelated components: **Drawer** (main container), **DrawerContent** (wrapper), **DrawerHeader** (header section), **DrawerBody** (content area), and **DrawerFooter** (footer section).

**Key Characteristics**:
- Slides in from screen edge (left, right, top, bottom)
- Customizable sizing (xs to 5xl, or full width)
- Backdrop overlay with configurable opacity
- Focus trapping and automatic restoration
- Keyboard navigation (Esc to close)
- WCAG 2.1 Level AA compliant accessibility

---

## Basic Usage

### Minimal Uncontrolled Drawer

```jsx
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  useDisclosure
} from "@heroui/react";

function BasicDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Open Drawer</Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            Drawer Title
          </DrawerHeader>
          <DrawerBody>
            <p>Drawer content goes here</p>
          </DrawerBody>
          <DrawerFooter>
            <Button onPress={onOpenChange}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

**Key Points**:
- Use `useDisclosure` hook for simple state management
- `isOpen` prop controls visibility
- `onOpenChange` callback handles state updates
- Drawer composition requires Content, Header, Body, and Footer

### Controlled Drawer with useState

```jsx
import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button } from "@heroui/react";

function ControlledDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = () => {
    console.log("Action performed");
    setIsOpen(false); // Close after action
  };

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open Settings</Button>

      <Drawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <DrawerContent>
          <DrawerHeader>Settings</DrawerHeader>
          <DrawerBody>
            <p>Your settings content</p>
          </DrawerBody>
          <DrawerFooter>
            <Button color="danger" onPress={() => setIsOpen(false)}>
              Close
            </Button>
            <Button color="primary" onPress={handleAction}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

**Key Points**:
- Full control over open/close state
- Suitable for form submission or complex workflows
- Can trigger side effects on state changes

---

## Props/API

### Drawer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | **Required**. Must contain `DrawerContent` |
| `isOpen` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(isOpen: boolean) => void` | - | Callback when open state changes |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Drawer position |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl' \| '5xl' \| 'full'` | `'md'` | Drawer width/height |
| `backdrop` | `'opaque' \| 'blur' \| 'transparent'` | `'opaque'` | Backdrop style |
| `isDismissable` | `boolean` | `true` | Allow dismissal by clicking overlay |
| `isKeyboardDismissDisabled` | `boolean` | `false` | Disable Esc key dismissal |
| `shouldBlockScroll` | `boolean` | `true` | Prevent body scroll when open |
| `motionProps` | `MotionProps` | - | Framer Motion animation config |
| `classNames` | `Record<string, string>` | - | Classes for overlay and backdrop |

### DrawerContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content (DrawerHeader, Body, Footer) |
| `className` | `string` | - | Custom CSS class |
| `classNames` | `Record<string, string>` | - | Classes for content slots |

**DrawerContent Slots**: `base`, `header`, `body`, `footer`, `closeButton`

### DrawerHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Header content/title |
| `className` | `string` | - | Custom CSS class |
| `closeButton` | `boolean` | `true` | Show close button in header |

### DrawerBody Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Main content |
| `className` | `string` | - | Custom CSS class |

### DrawerFooter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Footer content (usually buttons) |
| `className` | `string` | - | Custom CSS class |

---

## Common Patterns

### Pattern 1: Navigation Drawer

```jsx
function NavigationDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onOpenChange(false); // Auto-close after navigation
  };

  return (
    <>
      <Button isIconOnly onPress={onOpen}>
        <MenuIcon />
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
        <DrawerContent>
          <DrawerHeader>
            <h2>Navigation</h2>
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-4">
            <Button
              variant="light"
              className="justify-start"
              onPress={() => handleNavigate('/')}
            >
              Home
            </Button>
            <Button
              variant="light"
              className="justify-start"
              onPress={() => handleNavigate('/about')}
            >
              About
            </Button>
            <Button
              variant="light"
              className="justify-start"
              onPress={() => handleNavigate('/contact')}
            >
              Contact
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

**Key Points**:
- `placement="left"` for typical navigation pattern
- Auto-close after navigation
- Icon-only trigger button for compact design

### Pattern 2: Form in Drawer

```jsx
function FormDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleSubmit = async () => {
    try {
      // Submit form data
      await submitForm(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>Create New</Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <DrawerContent>
          <DrawerHeader>Create New Item</DrawerHeader>
          <DrawerBody>
            <Input
              label="Name"
              value={formData.name}
              onValueChange={(value) =>
                setFormData({ ...formData, name: value })
              }
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onValueChange={(value) =>
                setFormData({ ...formData, email: value })
              }
            />
          </DrawerBody>
          <DrawerFooter>
            <Button onPress={() => onOpenChange(false)}>Cancel</Button>
            <Button color="primary" onPress={handleSubmit}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

**Key Points**:
- `size="lg"` for more form content area
- Form state management in parent component
- Submit handler closes drawer on success

### Pattern 3: Settings/Configuration Drawer

```jsx
function SettingsDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    emailUpdates: false
  });

  return (
    <>
      <Button isIconOnly onPress={onOpen}>
        <SettingsIcon />
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="right" size="md">
        <DrawerContent>
          <DrawerHeader>Settings</DrawerHeader>
          <DrawerBody className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <Select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </Select>
            </div>

            <Checkbox
              checked={settings.notifications}
              onChange={(e) =>
                setSettings({ ...settings, notifications: e.target.checked })
              }
            >
              Enable Notifications
            </Checkbox>

            <Checkbox
              checked={settings.emailUpdates}
              onChange={(e) =>
                setSettings({ ...settings, emailUpdates: e.target.checked })
              }
            >
              Email Updates
            </Checkbox>
          </DrawerBody>
          <DrawerFooter>
            <Button onPress={() => onOpenChange(false)}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

**Key Points**:
- Settings persist in state until explicitly saved
- Multiple control types (select, checkbox)
- Auto-save or manual save patterns

### Pattern 4: Multi-Step Drawer

```jsx
function MultiStepDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    // Handle completion
    setStep(1);
    onOpenChange(false);
  };

  return (
    <>
      <Button onPress={onOpen}>Start Wizard</Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <DrawerContent>
          <DrawerHeader>
            <div className="flex justify-between items-center w-full">
              <h2>Setup Wizard</h2>
              <span className="text-sm text-default-500">Step {step} of 3</span>
            </div>
          </DrawerHeader>

          <DrawerBody>
            {step === 1 && <Step1Content />}
            {step === 2 && <Step2Content />}
            {step === 3 && <Step3Content />}
          </DrawerBody>

          <DrawerFooter>
            <Button
              isDisabled={step === 1}
              onPress={handlePrev}
            >
              Previous
            </Button>
            {step < 3 && (
              <Button color="primary" onPress={handleNext}>
                Next
              </Button>
            )}
            {step === 3 && (
              <Button color="success" onPress={handleComplete}>
                Complete
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function Step1Content() {
  return <div>Step 1: Enter your details</div>;
}

function Step2Content() {
  return <div>Step 2: Choose preferences</div>;
}

function Step3Content() {
  return <div>Step 3: Review and confirm</div>;
}
```

**Key Points**:
- Use state to track current step
- Disable "Previous" on first step
- Show different content based on step
- Complete action resets step

---

## Placement Patterns

### All Placement Options

```jsx
// From left edge
<Drawer placement="left">

// From right edge (default)
<Drawer placement="right">

// From top edge
<Drawer placement="top">

// From bottom edge
<Drawer placement="bottom">
```

### Responsive Placement

```jsx
function ResponsiveDrawer() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Drawer placement={isMobile ? "bottom" : "right"}>
      <DrawerContent>
        {/* Content */}
      </DrawerContent>
    </Drawer>
  );
}
```

**Best Practices**:
- Mobile: `placement="bottom"` (easier thumb access)
- Desktop: `placement="right"` or `placement="left"` (standard pattern)
- Use `placement="left"` for navigation
- Use `placement="right"` for sidebars and settings

---

## Size Patterns

### Size Options

```jsx
// Extra small - xs (90px width typically)
<Drawer size="xs">

// Small - sm (250px)
<Drawer size="sm">

// Medium - md (400px, default)
<Drawer size="md">

// Large - lg (550px)
<Drawer size="lg">

// Extra large - xl (700px)
<Drawer size="xl">

// 2xl (800px)
<Drawer size="2xl">

// 3xl (900px)
<Drawer size="3xl">

// 4xl (1000px)
<Drawer size="4xl">

// 5xl (1200px)
<Drawer size="5xl">

// Full width/height
<Drawer size="full">
```

### Responsive Sizing

```jsx
function ResponsiveSizeDrawer() {
  const isSmallScreen = useMediaQuery('(max-width: 640px)');
  const isMediumScreen = useMediaQuery('(max-width: 1024px)');

  let size = 'lg';
  if (isSmallScreen) size = 'full';
  else if (isMediumScreen) size = 'md';

  return (
    <Drawer size={size}>
      <DrawerContent>
        {/* Content adapts to screen size */}
      </DrawerContent>
    </Drawer>
  );
}
```

**Size Selection Guide**:
- `xs`: Quick filters, compact panels
- `sm`: Narrow sidebars
- `md`: Default for most forms and panels
- `lg`: Extended forms, documentation
- `xl` to `5xl`: Large content panels, full editors
- `full`: Immersive experiences, mobile full-screen

---

## Content Patterns

### Header with Custom Close Button

```jsx
<Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
  <DrawerContent>
    <DrawerHeader className="flex items-center justify-between">
      <h2>Header Title</h2>
      <Button
        isIconOnly
        variant="light"
        onPress={() => onOpenChange(false)}
      >
        <XIcon />
      </Button>
    </DrawerHeader>
    <DrawerBody>
      {/* Content */}
    </DrawerBody>
  </DrawerContent>
</Drawer>
```

### Body with Scrollable Content

```jsx
<DrawerBody className="flex flex-col overflow-y-auto flex-grow">
  {/* Long content that scrolls independently */}
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</DrawerBody>
```

### Footer with Multiple Actions

```jsx
<DrawerFooter className="flex justify-between">
  <div className="flex gap-2">
    <Button variant="bordered" onPress={() => onOpenChange(false)}>
      Cancel
    </Button>
    <Button onPress={handleDelete} color="danger">
      Delete
    </Button>
  </div>
  <Button color="primary" onPress={handleSave}>
    Save Changes
  </Button>
</DrawerFooter>
```

### Minimal Drawer (Header-only Close)

```jsx
<Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
  <DrawerContent>
    <DrawerHeader closeButton>
      {/* Auto-included close button in header */}
      Title
    </DrawerHeader>
    <DrawerBody>
      {/* Content */}
    </DrawerBody>
  </DrawerContent>
</Drawer>
```

---

## State Patterns

### Uncontrolled (useDisclosure)

```jsx
function UncontrolledDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Open</Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        {/* Content */}
      </Drawer>
    </>
  );
}
```

**Benefits**:
- Simplest implementation
- Drawer manages own state
- Built-in close on Esc/overlay click

### Fully Controlled

```jsx
function FullyControlledDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveData();
      setIsOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open</Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <DrawerContent>
          <DrawerFooter>
            <Button isLoading={saving} onPress={handleSave}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

**Benefits**:
- Full control over open/close timing
- Can prevent close during async operations
- External state management integration

### Conditional Opening

```jsx
function ConditionalDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmRequired, setConfirmRequired] = useState(false);

  const handleOpen = () => {
    if (confirmRequired) {
      // Show confirmation first
      setConfirmRequired(false);
    }
    setIsOpen(true);
  };

  const handleClose = async () => {
    const hasUnsavedChanges = true; // Check actual state
    if (hasUnsavedChanges) {
      setConfirmRequired(true);
      return;
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button onPress={handleOpen}>Open</Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (open) setIsOpen(true);
          else handleClose();
        }}
      >
        {/* Content */}
      </Drawer>
    </>
  );
}
```

---

## Animation Patterns

### Default Animation

```jsx
<Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
  {/* Uses default Framer Motion slide animation */}
</Drawer>
```

### Custom Animation - Fade and Slide

```jsx
<Drawer
  isOpen={isOpen}
  onOpenChange={onOpenChange}
  placement="right"
  motionProps={{
    variants: {
      enter: {
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      },
      exit: {
        x: 320,
        opacity: 0,
        transition: {
          duration: 0.3,
          ease: "easeIn",
        },
      },
    },
  }}
>
  <DrawerContent>
    {/* Content */}
  </DrawerContent>
</Drawer>
```

### Slow, Smooth Animation

```jsx
<Drawer
  isOpen={isOpen}
  onOpenChange={onOpenChange}
  motionProps={{
    variants: {
      enter: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: "circOut",
        },
      },
      exit: {
        y: 100,
        opacity: 0,
        transition: {
          duration: 0.5,
          ease: "circIn",
        },
      },
    },
  }}
>
  {/* Bottom drawer with slow animation */}
</Drawer>
```

### Pop-In Animation (Faster Entrance)

```jsx
<Drawer
  isOpen={isOpen}
  onOpenChange={onOpenChange}
  motionProps={{
    variants: {
      enter: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.2,
          ease: "backOut",
        },
      },
      exit: {
        scale: 0.95,
        opacity: 0,
        transition: {
          duration: 0.15,
          ease: "backIn",
        },
      },
    },
  }}
>
  {/* Quick pop-in effect */}
</Drawer>
```

**Animation Properties**:
- `x`, `y`: Translate position
- `scale`: Size scaling
- `opacity`: Fade effect
- `duration`: Time in seconds
- `ease`: Easing function (easeOut, easeIn, circOut, backOut, etc.)
- `type`: Spring, tween, inertia

---

## Nested Drawers

### Drawer Within Drawer

```jsx
function NestedDrawers() {
  const outer = useDisclosure();
  const inner = useDisclosure();

  return (
    <>
      <Button onPress={outer.onOpen}>Open Outer</Button>

      <Drawer isOpen={outer.isOpen} onOpenChange={outer.onOpenChange}>
        <DrawerContent>
          <DrawerHeader>Outer Drawer</DrawerHeader>
          <DrawerBody>
            <Button onPress={inner.onOpen}>Open Inner Drawer</Button>
            <p>Outer content here</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer isOpen={inner.isOpen} onOpenChange={inner.onOpenChange}>
        <DrawerContent>
          <DrawerHeader>Inner Drawer</DrawerHeader>
          <DrawerBody>
            <p>Nested drawer content</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

**Key Points**:
- Use separate `useDisclosure` hooks
- Inner drawer appears on top
- Both can have independent state
- Close inner first, then outer

### Drawer Stacking with Navigation

```jsx
function DrawerStack() {
  const [drawerStack, setDrawerStack] = useState([]);

  const pushDrawer = (config) => {
    setDrawerStack([...drawerStack, config]);
  };

  const popDrawer = () => {
    setDrawerStack(drawerStack.slice(0, -1));
  };

  const currentDrawer = drawerStack[drawerStack.length - 1];

  return (
    <>
      <Button onPress={() => pushDrawer({ title: "First Drawer" })}>
        Start
      </Button>

      {currentDrawer && (
        <Drawer isOpen={true} onOpenChange={popDrawer}>
          <DrawerContent>
            <DrawerHeader>{currentDrawer.title}</DrawerHeader>
            <DrawerBody>
              {currentDrawer.title === "First Drawer" && (
                <Button onPress={() => pushDrawer({ title: "Second Drawer" })}>
                  Next Step
                </Button>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
```

---

## Accessibility

### ARIA and Focus Management

```jsx
import { useRef, useEffect } from 'react';

function AccessibleDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      // Focus first input when drawer opens
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      <Button
        onPress={onOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        Open Drawer
      </Button>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        role="dialog"
        aria-labelledby="drawer-title"
        aria-modal="true"
      >
        <DrawerContent>
          <DrawerHeader id="drawer-title">
            Important Settings
          </DrawerHeader>
          <DrawerBody>
            <Input
              ref={firstInputRef}
              label="First Field"
              aria-label="First Field"
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

### Keyboard Navigation

```jsx
function KeyboardAwareDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleKeyDown = (e) => {
    // Esc closes drawer (default behavior)
    if (e.key === 'Escape' && isOpen) {
      onOpenChange(false);
    }

    // Enter could submit forms
    if (e.key === 'Enter' && e.ctrlKey) {
      // Submit action
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isKeyboardDismissDisabled={false}
    >
      <DrawerContent onKeyDown={handleKeyDown}>
        {/* Content */}
      </DrawerContent>
    </Drawer>
  );
}
```

### Disable Esc Key (When Needed)

```jsx
function RequiredActionDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <DrawerContent>
        <DrawerHeader>Required Confirmation</DrawerHeader>
        <DrawerBody>
          <p>You must take an action before closing</p>
        </DrawerBody>
        <DrawerFooter>
          <Button color="primary" onPress={() => onOpenChange(false)}>
            I Understand
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
```

### Screen Reader Announcements

```jsx
function AnnouncedDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} aria-label="Open navigation menu">
        Menu
      </Button>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        aria-label="Navigation menu"
      >
        <DrawerContent role="navigation">
          <DrawerHeader>
            <h2 id="nav-title">Site Navigation</h2>
          </DrawerHeader>
          <DrawerBody>
            <nav aria-labelledby="nav-title">
              <ul role="list">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

---

## Integration Patterns

### With React Router

```jsx
import { useNavigate, useLocation } from 'react-router-dom';

function NavigationDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const routes = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <>
      <Button onPress={onOpen}>Menu</Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
        <DrawerContent>
          <DrawerBody className="flex flex-col gap-2">
            {routes.map(route => (
              <Button
                key={route.path}
                variant={location.pathname === route.path ? "solid" : "light"}
                className="justify-start"
                onPress={() => handleNavigate(route.path)}
              >
                {route.label}
              </Button>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

### With Form Validation

```jsx
import { useForm, Controller } from 'react-hook-form';

function FormDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await submitForm(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <>
      <Button onPress={onOpen}>Add Item</Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <DrawerContent>
          <DrawerHeader>Add New Item</DrawerHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerBody className="flex flex-col gap-4">
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Title"
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Description"
                  />
                )}
              />
            </DrawerBody>
            <DrawerFooter>
              <Button onPress={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" color="primary">Submit</Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

### With Data Fetching

```jsx
import { useEffect, useState } from 'react';

function DataDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchData()
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  return (
    <>
      <Button onPress={onOpen}>View Details</Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>Details</DrawerHeader>
          <DrawerBody>
            {loading && <Spinner />}
            {data && <DisplayData data={data} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

---

## Advanced Patterns

### Drawer with Search/Filter

```jsx
function FilterDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const handleApplyFilters = () => {
    // Apply filters to main content
    console.log('Filters applied:', { searchTerm, ...filters });
    onOpenChange(false);
  };

  return (
    <>
      <Button onPress={onOpen}>Filters</Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left" size="md">
        <DrawerContent>
          <DrawerHeader>Search & Filter</DrawerHeader>
          <DrawerBody className="flex flex-col gap-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              startContent={<SearchIcon />}
            />

            <Checkbox
              checked={filters.active}
              onChange={(e) =>
                setFilters({ ...filters, active: e.target.checked })
              }
            >
              Active Only
            </Checkbox>

            <Checkbox
              checked={filters.premium}
              onChange={(e) =>
                setFilters({ ...filters, premium: e.target.checked })
              }
            >
              Premium
            </Checkbox>

            <Divider />

            <Select
              label="Sort By"
              selectedKeys={[filters.sort || 'name']}
              onChange={(e) =>
                setFilters({ ...filters, sort: e.target.value })
              }
            >
              <SelectItem key="name">Name</SelectItem>
              <SelectItem key="date">Date</SelectItem>
              <SelectItem key="popularity">Popularity</SelectItem>
            </Select>
          </DrawerBody>

          <DrawerFooter>
            <Button onPress={() => setFilters({})}>
              Reset
            </Button>
            <Button color="primary" onPress={handleApplyFilters}>
              Apply Filters
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

### Drawer with Tabs

```jsx
function TabbedDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <Button onPress={onOpen}>View</Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <DrawerContent>
          <DrawerHeader>Content Details</DrawerHeader>

          <Tabs
            activeKey={activeTab}
            onSelectionChange={setActiveTab}
            className="px-4 pt-2"
          >
            <Tab key="overview" title="Overview">
              <Card className="mt-4">
                <CardBody>
                  {/* Overview content */}
                </CardBody>
              </Card>
            </Tab>

            <Tab key="details" title="Details">
              <Card className="mt-4">
                <CardBody>
                  {/* Details content */}
                </CardBody>
              </Card>
            </Tab>

            <Tab key="history" title="History">
              <Card className="mt-4">
                <CardBody>
                  {/* History content */}
                </CardBody>
              </Card>
            </Tab>
          </Tabs>

          <DrawerFooter>
            <Button onPress={() => onOpenChange(false)}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

### Drawer with Split View

```jsx
function SplitViewDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);

  const items = [
    { id: 1, name: 'Item 1', details: 'Details for item 1' },
    { id: 2, name: 'Item 2', details: 'Details for item 2' },
    { id: 3, name: 'Item 3', details: 'Details for item 3' },
  ];

  return (
    <>
      <Button onPress={onOpen}>List Drawer</Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <DrawerContent>
          <DrawerHeader>Items</DrawerHeader>
          <DrawerBody className="flex flex-row gap-4">
            {/* Left side - List */}
            <div className="flex-1 border-r pr-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`p-3 cursor-pointer rounded ${
                    selectedItem?.id === item.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  {item.name}
                </div>
              ))}
            </div>

            {/* Right side - Details */}
            <div className="flex-1">
              {selectedItem ? (
                <div>
                  <h3 className="text-lg font-bold">{selectedItem.name}</h3>
                  <p className="text-default-500">{selectedItem.details}</p>
                </div>
              ) : (
                <p className="text-default-400">Select an item</p>
              )}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

---

## Notes

### Important Observations

1. **Focus Management**
   - Drawer automatically traps focus within the drawer content
   - Focus returns to trigger element when drawer closes
   - Auto-focus first input with `autoFocus` prop on Input component

2. **Dismissal Behavior**
   - By default, clicking backdrop or pressing Esc closes drawer
   - Set `isDismissable={false}` to disable overlay click closing
   - Set `isKeyboardDismissDisabled={true}` to disable Esc key closing
   - Both can be combined to require explicit close action

3. **Scroll Behavior**
   - Body scroll locks by default (`shouldBlockScroll={true}`)
   - Drawer content can scroll independently
   - Useful for preventing background scroll while drawer is open

4. **Size Behavior**
   - Width/height applies based on placement
   - Horizontal placements (left/right) use width
   - Vertical placements (top/bottom) use height
   - `size="full"` makes drawer take full dimension

5. **Z-Index and Stacking**
   - Drawer appears above page content
   - Multiple drawers stack on top of each other
   - Use separate `useDisclosure` hooks for each drawer

6. **Animation Performance**
   - Default animations are optimized for 60fps
   - Framer Motion handles GPU acceleration
   - Custom animations should use performant properties (transform, opacity)

7. **Responsive Considerations**
   - Mobile: Use `placement="bottom"` and `size="full"`
   - Tablet: Use `placement="left"` or `placement="right"` with `size="lg"`
   - Desktop: Use `size="xl"` or larger with full control

8. **Backdrop Styles**
   - `'opaque'`: Solid semi-transparent overlay (default)
   - `'blur'`: Blur effect on background content
   - `'transparent'`: Only dim effect, no blur

9. **Header Close Button**
   - Default `closeButton={true}` in DrawerHeader
   - Set `closeButton={false}` to hide default button
   - Provide custom close button in DrawerFooter

10. **Theme Integration**
    - HeroUI Drawer respects theme colors and dark mode
    - Customize via Tailwind classes and CSS variables
    - Use `classNames` prop for slot-based styling

### Common Gotchas

1. **State Management**
   - Using `useState` directly requires manual Esc key handling
   - Prefer `useDisclosure` hook for simpler implementations
   - Remember to close drawer after async operations

2. **Form Submission**
   - Wrap form in `<form>` element, not just `<DrawerBody>`
   - Use proper form submission handling (prevent default if needed)
   - Validate before closing drawer

3. **Animation Configuration**
   - Don't animate both x/y simultaneously without careful calculation
   - Keep animation durations under 400ms for smooth UX
   - Test animations on actual devices for performance

4. **Nested Content**
   - Ensure scrollable content has explicit height
   - Use `flex` layout properly in DrawerBody
   - Consider content overflow carefully

5. **Accessibility**
   - Always include `aria-label` on Drawer when no header title
   - Provide clear keyboard navigation hints
   - Test with screen readers for proper announcements

---

## Comparison with Other Drawer Implementations

### HeroUI Drawer Strengths vs Generic Drawers

1. **Built-in Accessibility**
   - WCAG 2.1 Level AA compliance by default
   - Focus management automatic
   - Keyboard navigation pre-configured

2. **Animation Support**
   - Native Framer Motion integration
   - Smooth, GPU-accelerated animations
   - Customizable enter/exit variants

3. **Backdrop Options**
   - Three styles: opaque, blur, transparent
   - Integrated with theme system
   - Smooth transitions

4. **Composition Flexibility**
   - Header, Body, Footer as separate components
   - Mix static and dynamic content easily
   - Tailwind-first styling approach

5. **Dark Mode Support**
   - Automatic theme detection
   - Respects user preferences
   - Consistent with HeroUI design system

---

## Summary

The HeroUI Drawer component is a comprehensive, accessible overlay panel solution ideal for navigation menus, sidebars, settings panels, and modal content. It excels in focus management, keyboard navigation, and smooth animations while maintaining excellent accessibility standards.

**Best For**:
- Responsive navigation menus
- Settings and configuration panels
- Form-based sidebars
- Multi-step wizards
- Filter/search interfaces
- Detail views and previews

**Key Features**:
- Multiple placement options (left, right, top, bottom)
- 10 preset sizes plus full-width option
- Three backdrop styles with animation
- Automatic focus trapping and restoration
- Full keyboard navigation support
- Framer Motion animation customization
- Tailwind-first styling with slots
- WCAG 2.1 Level AA accessibility

**Recommended For**:
- Applications requiring responsive navigation
- Enterprise UIs with settings/preferences
- Mobile-first designs
- Accessible web applications
- Tailwind CSS projects
- React applications using HeroUI

---

**Research Source**: https://www.heroui.com/docs/components/drawer
