# Mantine Stepper - Usage Patterns

**Component**: Stepper
**URL**: https://mantine.dev/core/stepper/
**Research Date**: 2025-11-05
**Framework Version**: Mantine v7

---

## Component Overview

The Mantine Stepper component is designed for displaying content divided into a logical sequence of steps, commonly used in multi-step forms, onboarding flows, and wizard-style interfaces. It provides a visual representation of progress through sequential stages with built-in state management for step navigation.

**Key Characteristics**:
- **Sequential workflow management**: Guides users through ordered steps
- **Flexible orientation**: Horizontal (default) or vertical layouts
- **Interactive navigation**: Clickable steps with customizable selection rules
- **Status visualization**: Clear indication of active, completed, and incomplete states
- **Content wrapping**: Each step contains its own content section
- **Compound component pattern**: Uses `Stepper` parent with `Stepper.Step` and `Stepper.Completed` children

**Primary Use Cases**:
- Multi-step forms and registration flows
- Checkout processes
- Onboarding and setup wizards
- Progress tracking interfaces
- Tutorial sequences

---

## Basic Usage

### Minimal Implementation

```tsx
import { useState } from 'react';
import { Stepper, Button, Group } from '@mantine/core';

function BasicStepper() {
  const [active, setActive] = useState(0);

  return (
    <>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="First step" description="Create an account">
          Step 1 content: Create an account
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email">
          Step 2 content: Verify email
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Get full access">
          Step 3 content: Get full access
        </Stepper.Step>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={() => setActive(active - 1)}>Back</Button>
        <Button onClick={() => setActive(active + 1)}>Next step</Button>
      </Group>
    </>
  );
}
```

### Controlled State Pattern

```tsx
function ControlledStepper() {
  const [active, setActive] = useState(1);

  const nextStep = () => setActive((current) =>
    (current < 3 ? current + 1 : current)
  );

  const prevStep = () => setActive((current) =>
    (current > 0 ? current - 1 : current)
  );

  return (
    <>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Step 1" description="Description">
          Content 1
        </Stepper.Step>
        <Stepper.Step label="Step 2" description="Description">
          Content 2
        </Stepper.Step>
        <Stepper.Step label="Step 3" description="Description">
          Content 3
        </Stepper.Step>
        <Stepper.Completed>
          Completed! Click back to return to previous step.
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </>
  );
}
```

---

## Props/API

### Stepper Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `number` | `0` | Current active step index (0-based) |
| `onStepClick` | `(stepIndex: number) => void` | - | Callback fired when step header is clicked |
| `allowNextStepsSelect` | `boolean` | `true` | Whether to allow clicking future (incomplete) steps |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of stepper |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Position of step icon relative to label |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the stepper (affects icon, label, description) |
| `iconSize` | `number` | - | Custom icon size in pixels (overrides size-based default) |
| `color` | `MantineColor` | `theme.primaryColor` | Theme color for active and completed steps |
| `radius` | `MantineSize` | - | Border radius for step icon circles |
| `completedIcon` | `ReactNode` | - | Custom icon for completed steps (defaults to checkmark) |
| `loading` | `boolean` | `false` | Shows loading spinner on active step |
| `classNames` | `object` | - | Custom class names for component parts |
| `styles` | `object` | - | Custom styles for component parts |

### Stepper.Step Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | - | Step title/label text |
| `description` | `ReactNode` | - | Step subtitle/description text |
| `icon` | `ReactNode` | - | Custom icon for this step (overrides default number) |
| `completedIcon` | `ReactNode` | - | Custom icon when step is completed (overrides parent) |
| `allowStepSelect` | `boolean` | `true` | Whether this specific step can be clicked |
| `color` | `MantineColor` | - | Custom color for this step (overrides parent) |
| `loading` | `boolean` | - | Loading state for this specific step |
| `aria-label` | `string` | - | Accessibility label for step button |
| `title` | `string` | - | Title attribute for step button (accessibility fallback) |
| `ref` | `React.Ref<HTMLButtonElement>` | - | Reference to step button element |
| `children` | `ReactNode` | - | Content displayed when step is active |

### Stepper.Completed Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Content displayed when all steps are completed |

---

## Common Patterns

### Navigation Control Pattern

**Controlled progression with validation**:

```tsx
function ValidatedStepper() {
  const [active, setActive] = useState(0);
  const [formData, setFormData] = useState({
    step1: { valid: false },
    step2: { valid: false },
  });

  const nextStep = () => {
    // Validate current step before advancing
    if (formData[`step${active + 1}`]?.valid) {
      setActive((current) => Math.min(current + 1, 3));
    }
  };

  const prevStep = () => {
    setActive((current) => Math.max(current - 1, 0));
  };

  return (
    <>
      <Stepper active={active} breakpoint="sm">
        <Stepper.Step label="Step 1" description="Enter details">
          {/* Step 1 form */}
        </Stepper.Step>
        <Stepper.Step label="Step 2" description="Verify information">
          {/* Step 2 form */}
        </Stepper.Step>
        <Stepper.Step label="Step 3" description="Submit">
          {/* Step 3 review */}
        </Stepper.Step>
        <Stepper.Completed>
          Form submitted successfully!
        </Stepper.Completed>
      </Stepper>

      <Group justify="flex-end" mt="xl">
        {active > 0 && <Button variant="default" onClick={prevStep}>Back</Button>}
        <Button onClick={nextStep} disabled={!formData[`step${active + 1}`]?.valid}>
          {active === 2 ? 'Submit' : 'Next'}
        </Button>
      </Group>
    </>
  );
}
```

### Step History Pattern

**Track visited steps to enable selective navigation**:

```tsx
function HistoryTrackedStepper() {
  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);

  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;

    if (isOutOfBounds) {
      return;
    }

    setActive(nextStep);
    setHighestStepVisited((highest) => Math.max(highest, nextStep));
  };

  // Allow clicking only on visited steps
  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step;

  return (
    <Stepper
      active={active}
      onStepClick={handleStepChange}
      allowNextStepsSelect={false}
    >
      <Stepper.Step
        label="Step 1"
        allowStepSelect={shouldAllowSelectStep(0)}
      >
        Step 1 content
      </Stepper.Step>
      <Stepper.Step
        label="Step 2"
        allowStepSelect={shouldAllowSelectStep(1)}
      >
        Step 2 content
      </Stepper.Step>
      <Stepper.Step
        label="Step 3"
        allowStepSelect={shouldAllowSelectStep(2)}
      >
        Step 3 content
      </Stepper.Step>
    </Stepper>
  );
}
```

---

## Orientation Patterns

### Horizontal Layout (Default)

Steps arranged left-to-right with connecting lines. Optimal for desktop views and workflows with 3-5 steps.

```tsx
<Stepper active={active} onStepClick={setActive} orientation="horizontal">
  <Stepper.Step label="Account" description="Create account" />
  <Stepper.Step label="Profile" description="Setup profile" />
  <Stepper.Step label="Complete" description="All done" />
</Stepper>
```

**Use Cases**:
- Registration flows
- Checkout processes
- Short onboarding sequences

### Vertical Layout

Steps arranged top-to-bottom. Better for mobile views, longer step lists, or when horizontal space is limited.

```tsx
<Stepper active={active} onStepClick={setActive} orientation="vertical">
  <Stepper.Step label="Personal Information" description="Name and email" />
  <Stepper.Step label="Address Details" description="Shipping address" />
  <Stepper.Step label="Payment Method" description="Credit card info" />
  <Stepper.Step label="Review Order" description="Confirm your order" />
  <Stepper.Step label="Complete" description="Order placed" />
</Stepper>
```

**Use Cases**:
- Mobile-first designs
- Multi-step forms with 5+ steps
- Sidebar navigation patterns
- Complex configuration wizards

### Icon Positioning

Control icon placement relative to labels:

```tsx
// Icon on left (default)
<Stepper active={active} iconPosition="left">
  <Stepper.Step label="Step 1" description="Description" />
</Stepper>

// Icon on right
<Stepper active={active} iconPosition="right">
  <Stepper.Step label="Step 1" description="Description" />
</Stepper>
```

---

## Size Patterns

### Predefined Size Scale

```tsx
// Extra small - compact mobile views
<Stepper active={active} size="xs">
  <Stepper.Step label="Step 1" />
  <Stepper.Step label="Step 2" />
</Stepper>

// Small - condensed interfaces
<Stepper active={active} size="sm">
  <Stepper.Step label="Step 1" description="Details" />
  <Stepper.Step label="Step 2" description="Details" />
</Stepper>

// Medium (default) - standard forms
<Stepper active={active} size="md">
  <Stepper.Step label="Step 1" description="Description" />
  <Stepper.Step label="Step 2" description="Description" />
</Stepper>

// Large - prominent workflows
<Stepper active={active} size="lg">
  <Stepper.Step label="Step 1" description="Description" />
  <Stepper.Step label="Step 2" description="Description" />
</Stepper>

// Extra large - hero sections
<Stepper active={active} size="xl">
  <Stepper.Step label="Step 1" description="Description" />
  <Stepper.Step label="Step 2" description="Description" />
</Stepper>
```

**Size affects**:
- Icon circle diameter
- Label font size
- Description font size
- Separator line spacing
- Overall component padding

### Custom Icon Sizing

Override default icon size independently:

```tsx
<Stepper active={active} size="md" iconSize={60}>
  <Stepper.Step label="Large Icons" description="Custom sizing" />
  <Stepper.Step label="Step 2" description="Same large icons" />
</Stepper>
```

### Radius Control

Customize step icon border radius:

```tsx
<Stepper active={active} radius="xs">  {/* Minimal rounding */}
<Stepper active={active} radius="sm">  {/* Slight rounding */}
<Stepper active={active} radius="md">  {/* Moderate rounding */}
<Stepper active={active} radius="lg">  {/* More rounding */}
<Stepper active={active} radius="xl">  {/* Maximum rounding */}
```

---

## Status Patterns

### Active Step

The current step indicated by the `active` prop (0-based index). Displays filled icon circle with theme color.

```tsx
<Stepper active={1}> {/* Step 2 is active */}
  <Stepper.Step label="Step 1" />
  <Stepper.Step label="Step 2" />
  <Stepper.Step label="Step 3" />
</Stepper>
```

**Visual Characteristics**:
- Filled icon background
- Bold label text
- Primary theme color
- Step content rendered

### Completed Steps

All steps with index lower than `active`. Display checkmark icon by default.

```tsx
<Stepper active={2}> {/* Steps 1 and 2 are completed */}
  <Stepper.Step label="Step 1" />
  <Stepper.Step label="Step 2" />
  <Stepper.Step label="Step 3" />
</Stepper>
```

**Visual Characteristics**:
- Checkmark icon (or custom `completedIcon`)
- Filled background with theme color
- Normal label weight
- Clickable (unless `allowNextStepsSelect={false}`)

### Incomplete Steps

All steps with index greater than `active`. Display step number.

```tsx
<Stepper active={0}> {/* Steps 2 and 3 are incomplete */}
  <Stepper.Step label="Step 1" />
  <Stepper.Step label="Step 2" />
  <Stepper.Step label="Step 3" />
</Stepper>
```

**Visual Characteristics**:
- Numbered icon (1, 2, 3, etc.)
- Outlined circle (not filled)
- Muted label color
- Conditionally clickable based on `allowNextStepsSelect`

### Error States

Custom completed icon with error color for failed validation:

```tsx
import { IconCircleX } from '@tabler/icons-react';

<Stepper active={2}>
  <Stepper.Step label="Step 1" description="Account created" />
  <Stepper.Step
    label="Step 2"
    description="Verification failed"
    color="red"
    completedIcon={<IconCircleX size={20} />}
  />
  <Stepper.Step label="Step 3" />
</Stepper>
```

### Loading States

Display spinner during async operations:

```tsx
// Global loading on active step
<Stepper active={1} loading>
  <Stepper.Step label="Step 1" />
  <Stepper.Step label="Step 2" />
  <Stepper.Step label="Step 3" />
</Stepper>

// Per-step loading
<Stepper active={1}>
  <Stepper.Step label="Step 1" />
  <Stepper.Step label="Step 2" loading />
  <Stepper.Step label="Step 3" />
</Stepper>
```

**Use Cases**:
- API calls during step transitions
- Async validation
- Data fetching between steps
- Processing indicators

---

## Type Patterns

### Standard Steps with Labels and Descriptions

Most common pattern with full context:

```tsx
<Stepper active={active}>
  <Stepper.Step
    label="Personal Information"
    description="Enter your name and email"
  >
    {/* Form fields */}
  </Stepper.Step>
  <Stepper.Step
    label="Address"
    description="Provide shipping address"
  >
    {/* Address form */}
  </Stepper.Step>
  <Stepper.Step
    label="Payment"
    description="Add payment method"
  >
    {/* Payment form */}
  </Stepper.Step>
</Stepper>
```

### Label-Only Steps

Minimal UI for simple workflows:

```tsx
<Stepper active={active}>
  <Stepper.Step label="Account" />
  <Stepper.Step label="Profile" />
  <Stepper.Step label="Complete" />
</Stepper>
```

### Icon-Only Steps

Semantic icons for visual workflows (requires accessibility labels):

```tsx
import { IconUser, IconMailCheck, IconShieldCheck } from '@tabler/icons-react';

<Stepper active={active}>
  <Stepper.Step
    icon={<IconUser size={18} />}
    aria-label="Create account"
  />
  <Stepper.Step
    icon={<IconMailCheck size={18} />}
    aria-label="Verify email"
  />
  <Stepper.Step
    icon={<IconShieldCheck size={18} />}
    aria-label="Setup security"
  />
</Stepper>
```

### Custom Icon Steps

Mix numbered and custom icons:

```tsx
import { IconUser, IconPhoto, IconSettings } from '@tabler/icons-react';

<Stepper active={active}>
  <Stepper.Step
    label="Account"
    description="Create account"
    icon={<IconUser size={18} />}
  />
  <Stepper.Step
    label="Profile Picture"
    description="Upload photo"
    icon={<IconPhoto size={18} />}
  />
  <Stepper.Step
    label="Settings"
    description="Configure preferences"
    icon={<IconSettings size={18} />}
  />
</Stepper>
```

---

## Content Patterns

### Step Content Rendering

Each step's children render when that step is active:

```tsx
<Stepper active={active}>
  <Stepper.Step label="Step 1">
    <TextInput label="Username" placeholder="Enter username" />
    <PasswordInput label="Password" placeholder="Enter password" mt="md" />
  </Stepper.Step>

  <Stepper.Step label="Step 2">
    <Textarea label="Bio" placeholder="Tell us about yourself" />
    <FileInput label="Avatar" placeholder="Upload image" mt="md" />
  </Stepper.Step>

  <Stepper.Step label="Step 3">
    <Checkbox label="Agree to terms" />
    <Checkbox label="Subscribe to newsletter" mt="md" />
  </Stepper.Step>
</Stepper>
```

**Rendering behavior**:
- Only active step's content is rendered in DOM
- Previous/next step content is unmounted
- State within step content may be lost on navigation (use parent state)

### Completion Content

Display success message or summary after all steps:

```tsx
<Stepper active={active}>
  <Stepper.Step label="Step 1">Step 1 content</Stepper.Step>
  <Stepper.Step label="Step 2">Step 2 content</Stepper.Step>
  <Stepper.Step label="Step 3">Step 3 content</Stepper.Step>

  <Stepper.Completed>
    <Paper p="xl" withBorder>
      <Title order={3}>Registration Complete!</Title>
      <Text mt="md">
        Your account has been successfully created.
        Check your email for verification.
      </Text>
      <Button mt="xl" onClick={() => setActive(0)}>
        Start Over
      </Button>
    </Paper>
  </Stepper.Completed>
</Stepper>
```

**Display trigger**: When `active` index equals or exceeds the number of steps.

### Empty Content Steps

Steps can have no children for header-only displays:

```tsx
<Stepper active={active}>
  <Stepper.Step label="Step 1" description="Already completed" />
  <Stepper.Step label="Step 2" description="Already completed" />
  <Stepper.Step label="Current Step" description="Active now">
    {/* Only current step has content */}
    <Text>Current step content here</Text>
  </Stepper.Step>
</Stepper>
```

---

## Navigation Patterns

### Clickable Steps (Default)

All steps are clickable by default:

```tsx
<Stepper active={active} onStepClick={setActive}>
  <Stepper.Step label="Step 1" />
  <Stepper.Step label="Step 2" />
  <Stepper.Step label="Step 3" />
</Stepper>
```

### Disable Future Step Selection

Prevent users from jumping ahead:

```tsx
<Stepper
  active={active}
  onStepClick={setActive}
  allowNextStepsSelect={false}
>
  <Stepper.Step label="Step 1" />
  <Stepper.Step label="Step 2" />
  <Stepper.Step label="Step 3" />
</Stepper>
```

**Behavior**: Users can only navigate to completed steps or the current step.

### Per-Step Click Control

Fine-grained control over individual step clickability:

```tsx
<Stepper active={active} onStepClick={setActive}>
  <Stepper.Step
    label="Step 1"
    allowStepSelect={true}  // Always clickable
  />
  <Stepper.Step
    label="Step 2"
    allowStepSelect={isStep2Valid}  // Conditionally clickable
  />
  <Stepper.Step
    label="Step 3"
    allowStepSelect={false}  // Never clickable
  />
</Stepper>
```

### Button-Based Navigation

External controls for step changes:

```tsx
function ButtonNavigatedStepper() {
  const [active, setActive] = useState(0);
  const totalSteps = 3;

  return (
    <>
      <Stepper active={active}>
        <Stepper.Step label="Step 1">Step 1 content</Stepper.Step>
        <Stepper.Step label="Step 2">Step 2 content</Stepper.Step>
        <Stepper.Step label="Step 3">Step 3 content</Stepper.Step>
        <Stepper.Completed>All steps completed</Stepper.Completed>
      </Stepper>

      <Group position="apart" mt="xl">
        <Button
          variant="default"
          onClick={() => setActive(Math.max(0, active - 1))}
          disabled={active === 0}
        >
          Previous
        </Button>

        <Button
          onClick={() => setActive(Math.min(totalSteps, active + 1))}
          disabled={active >= totalSteps}
        >
          {active === totalSteps - 1 ? 'Finish' : 'Next'}
        </Button>
      </Group>
    </>
  );
}
```

### Keyboard Navigation

Step buttons support native keyboard interaction:
- **Tab**: Focus next/previous step button
- **Enter/Space**: Activate focused step (if clickable)
- **Arrow keys**: Not implemented by default (can be added via refs)

---

## Progress Patterns

### Linear Progress

Sequential step completion:

```tsx
function LinearProgress() {
  const [active, setActive] = useState(0);
  const steps = ['Account', 'Profile', 'Settings', 'Complete'];

  const nextStep = () => setActive((current) =>
    Math.min(current + 1, steps.length)
  );

  return (
    <>
      <Text size="sm" mb="md">
        Step {active + 1} of {steps.length}
      </Text>

      <Stepper active={active} allowNextStepsSelect={false}>
        {steps.map((step, index) => (
          <Stepper.Step key={step} label={step}>
            Step {index + 1} content
          </Stepper.Step>
        ))}
        <Stepper.Completed>All steps completed!</Stepper.Completed>
      </Stepper>

      <Button onClick={nextStep} mt="xl">
        {active === steps.length - 1 ? 'Finish' : 'Continue'}
      </Button>
    </>
  );
}
```

### Non-Linear Progress (Visited Steps)

Allow revisiting completed steps:

```tsx
function NonLinearProgress() {
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const handleStepClick = (step: number) => {
    if (completed.includes(step) || step === active) {
      setActive(step);
    }
  };

  const completeStep = () => {
    setCompleted([...completed, active]);
    setActive(active + 1);
  };

  return (
    <Stepper
      active={active}
      onStepClick={handleStepClick}
      allowNextStepsSelect={false}
    >
      <Stepper.Step
        label="Step 1"
        allowStepSelect={completed.includes(0)}
      >
        <Button onClick={completeStep}>Complete Step 1</Button>
      </Stepper.Step>

      <Stepper.Step
        label="Step 2"
        allowStepSelect={completed.includes(1)}
      >
        <Button onClick={completeStep}>Complete Step 2</Button>
      </Stepper.Step>

      <Stepper.Step label="Step 3">
        <Button>Finish</Button>
      </Stepper.Step>
    </Stepper>
  );
}
```

### Progress with Validation

Track step completion status:

```tsx
function ValidatedProgress() {
  const [active, setActive] = useState(0);
  const [stepValidation, setStepValidation] = useState({
    0: false,
    1: false,
    2: false,
  });

  const validateAndProceed = () => {
    // Perform validation
    const isValid = validateCurrentStep();

    if (isValid) {
      setStepValidation({ ...stepValidation, [active]: true });
      setActive(active + 1);
    }
  };

  return (
    <>
      <Stepper active={active} allowNextStepsSelect={false}>
        <Stepper.Step
          label="Step 1"
          completedIcon={stepValidation[0] ? undefined : <IconCircleX />}
          color={stepValidation[0] ? undefined : 'red'}
        >
          Step 1 content
        </Stepper.Step>
        {/* Additional steps */}
      </Stepper>

      <Button onClick={validateAndProceed} mt="xl">
        Continue
      </Button>
    </>
  );
}
```

### Percentage Progress Indicator

Combine with Progress component:

```tsx
import { Progress } from '@mantine/core';

function ProgressWithPercentage() {
  const [active, setActive] = useState(0);
  const totalSteps = 4;
  const progress = ((active + 1) / totalSteps) * 100;

  return (
    <>
      <Progress value={progress} mb="md" />
      <Text size="sm" color="dimmed" mb="xl">
        {Math.round(progress)}% complete
      </Text>

      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Step 1" />
        <Stepper.Step label="Step 2" />
        <Stepper.Step label="Step 3" />
        <Stepper.Step label="Step 4" />
      </Stepper>
    </>
  );
}
```

---

## Accessibility

### ARIA Support

**Built-in accessibility features**:
- Step buttons render as semantic `<button>` elements
- Proper focus management
- Keyboard navigation support (Tab, Enter, Space)

### Required Labels for Icon-Only Steps

Steps without visible labels require accessibility labels:

```tsx
<Stepper active={active}>
  <Stepper.Step
    icon={<IconUser size={18} />}
    aria-label="Create user account"
  />
  <Stepper.Step
    icon={<IconMail size={18} />}
    aria-label="Verify email address"
  />
  <Stepper.Step
    icon={<IconCheck size={18} />}
    aria-label="Complete registration"
  />
</Stepper>
```

### Alternative: Title Attribute

```tsx
<Stepper.Step
  icon={<IconUser size={18} />}
  title="Create user account"
/>
```

### Focus Management

Steps maintain focus state and support keyboard interaction:

```tsx
// Access step button for programmatic focus control
const stepRef = useRef<HTMLButtonElement>(null);

<Stepper.Step
  label="Step 1"
  ref={stepRef}
/>

// Focus step programmatically
useEffect(() => {
  if (shouldFocusStep) {
    stepRef.current?.focus();
  }
}, [shouldFocusStep]);
```

### Screen Reader Announcements

Provide context about step status:

```tsx
<Stepper active={active}>
  <Stepper.Step
    label="Personal Information"
    description="Step 1 of 4 - Enter your details"
  />
  <Stepper.Step
    label="Address"
    description="Step 2 of 4 - Provide shipping address"
  />
</Stepper>
```

### Color Contrast

Ensure sufficient contrast for step states:

```tsx
// Use high-contrast theme colors
<Stepper active={active} color="blue">
  <Stepper.Step label="Step 1" />
</Stepper>

// Avoid low-contrast colors
<Stepper active={active} color="gray"> {/* May have contrast issues */}
  <Stepper.Step label="Step 1" />
</Stepper>
```

### Disabled State Communication

Communicate why steps are not clickable:

```tsx
<Stepper active={active} allowNextStepsSelect={false}>
  <Stepper.Step
    label="Step 2"
    description="Complete Step 1 first"
    allowStepSelect={false}
  />
</Stepper>
```

---

## Integration Patterns

### Form Integration

Wrap form sections in steps with validation:

```tsx
import { useForm } from '@mantine/form';

function FormStepper() {
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      address: '',
      city: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name too short' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      address: (value) => (value.length < 5 ? 'Address too short' : null),
      city: (value) => (value.length < 2 ? 'City required' : null),
    },
  });

  const nextStep = () => {
    // Validate current step fields
    const fieldsToValidate = active === 0
      ? ['name', 'email']
      : ['address', 'city'];

    const validation = form.validate();

    if (!fieldsToValidate.some((field) => validation.hasErrors(field))) {
      setActive(active + 1);
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stepper active={active} allowNextStepsSelect={false}>
        <Stepper.Step label="Personal Info" description="Name and email">
          <TextInput
            label="Name"
            placeholder="John Doe"
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Email"
            placeholder="john@example.com"
            mt="md"
            {...form.getInputProps('email')}
          />
        </Stepper.Step>

        <Stepper.Step label="Address" description="Shipping details">
          <TextInput
            label="Address"
            placeholder="123 Main St"
            {...form.getInputProps('address')}
          />
          <TextInput
            label="City"
            placeholder="New York"
            mt="md"
            {...form.getInputProps('city')}
          />
        </Stepper.Step>

        <Stepper.Step label="Review" description="Confirm details">
          <Text>Name: {form.values.name}</Text>
          <Text>Email: {form.values.email}</Text>
          <Text>Address: {form.values.address}</Text>
          <Text>City: {form.values.city}</Text>
        </Stepper.Step>

        <Stepper.Completed>
          <Text>Form submitted successfully!</Text>
        </Stepper.Completed>
      </Stepper>

      <Group justify="flex-end" mt="xl">
        {active > 0 && (
          <Button variant="default" onClick={() => setActive(active - 1)}>
            Back
          </Button>
        )}
        {active < 2 && <Button onClick={nextStep}>Next</Button>}
        {active === 2 && <Button type="submit">Submit</Button>}
      </Group>
    </form>
  );
}
```

### Wizard Pattern

Multi-step configuration flow:

```tsx
function SetupWizard() {
  const [active, setActive] = useState(0);
  const [config, setConfig] = useState({
    theme: 'light',
    notifications: true,
    language: 'en',
  });

  const updateConfig = (key: string, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Appearance" description="Choose theme">
          <SegmentedControl
            value={config.theme}
            onChange={(value) => updateConfig('theme', value)}
            data={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
            ]}
          />
        </Stepper.Step>

        <Stepper.Step label="Notifications" description="Configure alerts">
          <Switch
            label="Enable notifications"
            checked={config.notifications}
            onChange={(e) => updateConfig('notifications', e.currentTarget.checked)}
          />
        </Stepper.Step>

        <Stepper.Step label="Language" description="Select language">
          <Select
            value={config.language}
            onChange={(value) => updateConfig('language', value)}
            data={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
            ]}
          />
        </Stepper.Step>

        <Stepper.Completed>
          <Text>Setup complete! Your preferences have been saved.</Text>
        </Stepper.Completed>
      </Stepper>

      <Group justify="space-between" mt="xl">
        <Button
          variant="default"
          onClick={() => setActive(active - 1)}
          disabled={active === 0}
        >
          Back
        </Button>
        <Button
          onClick={() => setActive(active + 1)}
          disabled={active >= 3}
        >
          {active === 2 ? 'Finish' : 'Next'}
        </Button>
      </Group>
    </>
  );
}
```

### Async Step Transitions

Handle async operations between steps:

```tsx
function AsyncStepper() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Proceed to next step on success
      setActive(active + 1);
    } catch (error) {
      console.error('Step transition failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stepper active={active} loading={loading}>
        <Stepper.Step label="Step 1">Step 1 content</Stepper.Step>
        <Stepper.Step label="Step 2">Step 2 content</Stepper.Step>
        <Stepper.Step label="Step 3">Step 3 content</Stepper.Step>
      </Stepper>

      <Button onClick={handleNext} loading={loading} mt="xl">
        {loading ? 'Processing...' : 'Continue'}
      </Button>
    </>
  );
}
```

### Checkout Flow

E-commerce checkout with cart, shipping, and payment:

```tsx
function CheckoutStepper() {
  const [active, setActive] = useState(0);
  const [cartItems, setCartItems] = useState([...]);
  const [shippingInfo, setShippingInfo] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({});

  return (
    <Stepper active={active} breakpoint="sm">
      <Stepper.Step
        label="Cart"
        description="Review items"
        icon={<IconShoppingCart size={18} />}
      >
        <CartReview items={cartItems} />
      </Stepper.Step>

      <Stepper.Step
        label="Shipping"
        description="Delivery address"
        icon={<IconTruck size={18} />}
      >
        <ShippingForm
          value={shippingInfo}
          onChange={setShippingInfo}
        />
      </Stepper.Step>

      <Stepper.Step
        label="Payment"
        description="Billing info"
        icon={<IconCreditCard size={18} />}
      >
        <PaymentForm
          value={paymentInfo}
          onChange={setPaymentInfo}
        />
      </Stepper.Step>

      <Stepper.Step
        label="Confirm"
        description="Review order"
        icon={<IconCheck size={18} />}
      >
        <OrderSummary
          cart={cartItems}
          shipping={shippingInfo}
          payment={paymentInfo}
        />
      </Stepper.Step>

      <Stepper.Completed>
        <Paper p="xl" withBorder>
          <Title order={2}>Order Confirmed!</Title>
          <Text mt="md">
            Thank you for your purchase. You will receive a confirmation email shortly.
          </Text>
        </Paper>
      </Stepper.Completed>
    </Stepper>
  );
}
```

---

## Advanced Patterns

### Custom Completed Icons Per Step

Override completion icons for semantic meaning:

```tsx
import {
  IconCircleCheck,
  IconCircleX,
  IconAlertCircle
} from '@tabler/icons-react';

<Stepper active={3}>
  <Stepper.Step
    label="Validation"
    completedIcon={<IconCircleCheck size={18} />}
  />
  <Stepper.Step
    label="Processing"
    completedIcon={<IconCircleCheck size={18} />}
  />
  <Stepper.Step
    label="Payment Failed"
    completedIcon={<IconCircleX size={18} />}
    color="red"
  />
  <Stepper.Step
    label="Retry Payment"
    icon={<IconAlertCircle size={18} />}
  />
</Stepper>
```

### Dynamic Step Generation

Generate steps from data:

```tsx
function DynamicStepper() {
  const [active, setActive] = useState(0);

  const steps = [
    { label: 'Account', description: 'Create account', component: AccountForm },
    { label: 'Profile', description: 'Setup profile', component: ProfileForm },
    { label: 'Settings', description: 'Configure', component: SettingsForm },
  ];

  return (
    <Stepper active={active} onStepClick={setActive}>
      {steps.map((step, index) => {
        const StepComponent = step.component;
        return (
          <Stepper.Step
            key={index}
            label={step.label}
            description={step.description}
          >
            <StepComponent />
          </Stepper.Step>
        );
      })}
      <Stepper.Completed>All steps completed!</Stepper.Completed>
    </Stepper>
  );
}
```

### Conditional Steps

Show/hide steps based on conditions:

```tsx
function ConditionalStepper() {
  const [active, setActive] = useState(0);
  const [userType, setUserType] = useState<'individual' | 'business'>('individual');

  const steps = [
    { label: 'Type', show: true },
    { label: 'Personal', show: userType === 'individual' },
    { label: 'Business', show: userType === 'business' },
    { label: 'Review', show: true },
  ].filter((step) => step.show);

  return (
    <Stepper active={active}>
      <Stepper.Step label="Account Type">
        <SegmentedControl
          value={userType}
          onChange={setUserType}
          data={[
            { label: 'Individual', value: 'individual' },
            { label: 'Business', value: 'business' },
          ]}
        />
      </Stepper.Step>

      {userType === 'individual' && (
        <Stepper.Step label="Personal Information">
          <TextInput label="Name" />
          <TextInput label="Email" mt="md" />
        </Stepper.Step>
      )}

      {userType === 'business' && (
        <Stepper.Step label="Business Information">
          <TextInput label="Company Name" />
          <TextInput label="Tax ID" mt="md" />
        </Stepper.Step>
      )}

      <Stepper.Step label="Review">
        <Text>Account type: {userType}</Text>
      </Stepper.Step>
    </Stepper>
  );
}
```

### Step Refs for Programmatic Control

Access step button elements:

```tsx
function RefControlledStepper() {
  const [active, setActive] = useState(0);
  const stepRefs = [
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
  ];

  const focusStep = (index: number) => {
    stepRefs[index].current?.focus();
  };

  return (
    <>
      <Stepper active={active}>
        <Stepper.Step label="Step 1" ref={stepRefs[0]}>
          Step 1 content
        </Stepper.Step>
        <Stepper.Step label="Step 2" ref={stepRefs[1]}>
          Step 2 content
        </Stepper.Step>
        <Stepper.Step label="Step 3" ref={stepRefs[2]}>
          Step 3 content
        </Stepper.Step>
      </Stepper>

      <Group mt="xl">
        <Button onClick={() => focusStep(0)}>Focus Step 1</Button>
        <Button onClick={() => focusStep(1)}>Focus Step 2</Button>
        <Button onClick={() => focusStep(2)}>Focus Step 3</Button>
      </Group>
    </>
  );
}
```

### Custom Styling with Styles API

Override component part styles:

```tsx
<Stepper
  active={active}
  styles={{
    root: { padding: '2rem' },
    steps: { gap: '2rem' },
    step: { minWidth: 120 },
    stepIcon: { borderWidth: 3 },
    stepLabel: { fontSize: '1.1rem', fontWeight: 600 },
    stepDescription: { fontSize: '0.9rem' },
    separator: { height: 3, backgroundColor: 'blue' },
    content: { paddingTop: '2rem' },
  }}
>
  <Stepper.Step label="Step 1">Content 1</Stepper.Step>
  <Stepper.Step label="Step 2">Content 2</Stepper.Step>
</Stepper>
```

### Hiding Step Body (Header Only Mode)

Display only step headers without content sections:

```tsx
<Stepper
  active={active}
  onStepClick={setActive}
  styles={{
    stepBody: { display: 'none' },
  }}
>
  <Stepper.Step label="Step 1" description="Account" />
  <Stepper.Step label="Step 2" description="Profile" />
  <Stepper.Step label="Step 3" description="Complete" />
</Stepper>

{/* Render content separately based on active step */}
<Box mt="xl">
  {active === 0 && <div>Account content</div>}
  {active === 1 && <div>Profile content</div>}
  {active === 2 && <div>Complete content</div>}
</Box>
```

---

## Notes

### Important Behavioral Considerations

1. **Step Content Unmounting**: When navigating between steps, the previous step's content is unmounted from the DOM. State within step content will be lost unless managed in parent component.

2. **Zero-Based Indexing**: The `active` prop uses 0-based indexing. First step is `0`, second is `1`, etc.

3. **Completion Detection**: `Stepper.Completed` renders when `active` index equals or exceeds the number of `Stepper.Step` children.

4. **Wrapping Step Components**: The documentation explicitly warns that wrapping `Stepper.Step` components (e.g., with `Fragment` or custom components) will break rendering. Steps must be direct children of `Stepper`.

   ```tsx
   {/* This breaks rendering */}
   <Stepper active={active}>
     <Wrapper>
       <Stepper.Step label="Step 1" />
     </Wrapper>
   </Stepper>

   {/* This works correctly */}
   <Stepper active={active}>
     <Stepper.Step label="Step 1" />
   </Stepper>
   ```

5. **Click Handler Required**: The `onStepClick` prop is necessary for step click functionality. Without it, clicking steps has no effect.

6. **Loading State**: When `loading={true}`, a spinner replaces the active step's icon. This doesn't prevent interaction unless you add disabled logic.

7. **Icon Size Defaults**: Icon sizes are derived from the `size` prop unless `iconSize` is explicitly set. Manual icon size overrides apply to all steps.

8. **Color Inheritance**: Step `color` prop overrides parent Stepper `color`. Useful for error/warning states on specific steps.

9. **Separator Styling**: Connecting lines between steps can be customized via `styles.separator` or hidden entirely.

10. **Responsive Behavior**: Use `breakpoint` prop to control responsive behavior. Vertical orientation recommended for mobile devices.

### Performance Considerations

- Only active step content is rendered, providing good performance for complex multi-step forms
- Step headers remain in DOM for all steps (for navigation)
- Avoid expensive computations in step render functions; memoize when possible
- Consider lazy loading step content components for very large wizards

### Common Pitfalls

1. **State Loss**: Don't store form state inside step children; use parent state or form library
2. **Index Sync**: Ensure `active` state stays in sync with actual step count
3. **Validation Timing**: Validate before incrementing `active`, not after
4. **Click Handler Omission**: Remember to add `onStepClick` prop for clickable steps
5. **Accessibility Labels**: Always provide `aria-label` or `title` for icon-only steps

### Framework-Specific Notes

- **Compound Component Pattern**: Mantine uses `Parent.Child` naming convention
- **Theme Integration**: Leverages Mantine's theme system for consistent colors and sizing
- **Tabler Icons**: Documentation examples use `@tabler/icons-react` for icons
- **Styles API**: Powerful customization through `classNames` and `styles` props
- **No Built-in Form Integration**: Designed to be framework-agnostic; integrate with any form library

### Comparison to Other Frameworks

**Unique to Mantine**:
- `Stepper.Completed` component for post-completion content
- `iconPosition` prop for left/right icon placement
- Per-step `loading` state support
- `allowStepSelect` on individual steps

**Missing Features** (compared to some frameworks):
- No built-in progress percentage display
- No automatic form validation integration
- No animation/transition props
- No branch/conditional step flow support

**Strengths**:
- Clean compound component API
- Excellent TypeScript support
- Comprehensive styling customization
- Good accessibility defaults
- Clear documentation with practical examples
