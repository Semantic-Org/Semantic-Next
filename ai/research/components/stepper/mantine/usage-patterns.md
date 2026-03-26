# Stepper / Wizard - Mantine Usage Patterns

> **Framework**: Mantine
> **Component**: Stepper
> **Documentation**: https://mantine.dev/core/stepper/
> **Research Date**: 2025-11-05

## Component Definition

The Mantine Stepper is a navigation component that "displays content divided into a steps sequence." It provides a visual representation of multi-step processes, guiding users through sequential workflows by showing progress through labeled steps. The component supports both horizontal and vertical orientations, customizable icons, and flexible step selection controls.

**Mental Model**: Think of Stepper as a progress indicator combined with a navigation system. Users can see where they are in a process, where they've been, and optionally navigate between steps by clicking.

**When to Use**: Multi-step forms, onboarding flows, checkout processes, setup wizards, or any sequential task that benefits from visual progress tracking.

## Core Features

### Sequential Navigation

Stepper manages multi-step workflows with:
- Active step tracking (controlled component pattern)
- Clickable step navigation (configurable)
- Forward/backward progression
- Step completion states
- Final "Completed" state for post-workflow content

### Layout Flexibility

**Orientation**: Horizontal (default) or vertical layout
**Icon Positioning**: Icons can appear on the left (default) or right side of labels
**Size Variants**: xs, sm, md, lg, xl for overall component sizing
**Icon Sizing**: Independent icon size control separate from text sizing

### Visual States

Each step can be in one of several states:
- **Inactive**: Future step not yet reached
- **Active**: Current step being worked on
- **Completed**: Previously completed step
- **Loading**: Step in progress (shows loader animation)
- **Error**: Step with error state (via custom icons and colors)

### Customization

- Custom icons for individual steps or states
- Per-step or global color overrides
- Custom completion icons
- Styling via Styles API
- Support for icon-only mode

### Step Selection Control

Three patterns for controlling which steps users can click:
1. **Default**: All steps clickable (`allowNextStepsSelect={true}`)
2. **Forward-only**: Only completed and current step clickable (`allowNextStepsSelect={false}`)
3. **Custom Logic**: Per-step control via `allowStepClick` and state tracking

## Props API

### Stepper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `number` | `0` | Current active step index (0-based) |
| `onStepClick` | `(stepIndex: number) => void` | - | Callback fired when a step is clicked |
| `allowNextStepsSelect` | `boolean` | `true` | Whether future steps can be selected before reaching them |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the stepper |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Position of step icons relative to labels |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Overall size of the stepper |
| `iconSize` | `number` | - | Override icon dimensions independently from size prop |
| `color` | `string` | `'blue'` | Theme color for active and completed states |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'xl'` | Border radius of step icons |
| `completedIcon` | `React.ReactNode` | checkmark | Icon shown for all completed steps (can be overridden per step) |
| `ref` | `React.Ref<HTMLDivElement>` | - | Reference to root div element |
| `styles` | `Styles` | - | Styles API object for customizing component parts |
| `classNames` | `ClassNames` | - | Class names for component parts |

### Stepper.Step Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `React.ReactNode` | - | Step title text displayed above or beside icon |
| `description` | `React.ReactNode` | - | Supporting text displayed below label |
| `icon` | `React.ReactNode \| number` | step number | Custom icon or number for the step |
| `completedIcon` | `React.ReactNode` | - | Custom icon for this step when completed (overrides Stepper.completedIcon) |
| `allowStepClick` | `boolean` | `true` | Whether this specific step can be clicked/selected |
| `loading` | `boolean` | `false` | Show loading spinner instead of icon |
| `color` | `string` | - | Override color for this specific step |
| `aria-label` | `string` | - | Accessibility label for screen readers (required if no label/description) |
| `title` | `string` | - | Alternative accessibility label for screen readers |
| `ref` | `React.Ref<HTMLButtonElement>` | - | Reference to the step button element |
| `children` | `React.ReactNode` | - | Content displayed when this step is active |

### Stepper.Completed Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Content displayed when active index exceeds last step index |

## Usage Patterns

### Pattern 1: Basic Linear Stepper

**Use case**: Simple sequential flow with next/previous navigation
**Implementation**: Controlled component with state tracking active step

```jsx
import { useState } from 'react';
import { Stepper, Button, Group } from '@mantine/core';

function Demo() {
  const [active, setActive] = useState(1);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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
        <Stepper.Completed>
          Completed, click back button to get to previous step
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

### Pattern 2: Forward-Only Navigation

**Use case**: Prevent users from jumping ahead to future steps (e.g., form validation required)
**Implementation**: Use `allowNextStepsSelect={false}` prop

```jsx
<Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
  <Stepper.Step label="First step" description="Create an account" />
  <Stepper.Step label="Second step" description="Verify email" />
  <Stepper.Step label="Final step" description="Get full access" />
</Stepper>
```

### Pattern 3: Tracked Progress with Selective Access

**Use case**: Allow users to revisit previously completed steps but not skip ahead
**Implementation**: Track highest step visited and use per-step `allowStepClick` logic

```jsx
import { useState } from 'react';
import { Stepper } from '@mantine/core';

function Demo() {
  const [active, setActive] = useState(1);
  const [highestStepVisited, setHighestStepVisited] = useState(active);

  const handleStepChange = (nextStep) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;
    if (isOutOfBounds) return;

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  const shouldAllowSelectStep = (step) =>
    highestStepVisited >= step && active !== step;

  return (
    <Stepper active={active} onStepClick={setActive}>
      <Stepper.Step
        label="First step"
        description="Create an account"
        allowStepClick={shouldAllowSelectStep(0)}
      />
      <Stepper.Step
        label="Second step"
        description="Verify email"
        allowStepClick={shouldAllowSelectStep(1)}
      />
      <Stepper.Step
        label="Final step"
        description="Get full access"
        allowStepClick={shouldAllowSelectStep(2)}
      />
      <Stepper.Completed>Completed!</Stepper.Completed>
    </Stepper>
  );
}
```

### Pattern 4: Custom Icons and Branding

**Use case**: Match stepper appearance to brand or provide contextual icons
**Implementation**: Use `icon` prop on steps and `completedIcon` on Stepper

```jsx
import {
  IconUserCheck,
  IconMailOpened,
  IconShieldCheck,
  IconCircleCheck,
} from '@tabler/icons-react';

<Stepper
  active={active}
  onStepClick={setActive}
  completedIcon={<IconCircleCheck size={18} />}
>
  <Stepper.Step
    icon={<IconUserCheck size={18} />}
    label="Step 1"
    description="Create an account"
  />
  <Stepper.Step
    icon={<IconMailOpened size={18} />}
    label="Step 2"
    description="Verify email"
  />
  <Stepper.Step
    icon={<IconShieldCheck size={18} />}
    label="Step 3"
    description="Get full access"
  />
</Stepper>
```

### Pattern 5: Loading State

**Use case**: Show async operation in progress for a specific step
**Implementation**: Set `loading={true}` on the active step

```jsx
<Stepper active={1}>
  <Stepper.Step label="Step 1" description="Create an account" />
  <Stepper.Step label="Step 2" description="Verify email" loading />
  <Stepper.Step label="Step 3" description="Get full access" />
</Stepper>
```

### Pattern 6: Error State

**Use case**: Indicate step failure or validation error
**Implementation**: Use custom icon and color on the step

```jsx
import { IconCircleX } from '@tabler/icons-react';

<Stepper active={2}>
  <Stepper.Step label="Step 1" description="Create an account" />
  <Stepper.Step
    label="Step 2"
    description="Verify email"
    color="red"
    completedIcon={<IconCircleX size={20} />}
  />
  <Stepper.Step label="Step 3" description="Get full access" />
</Stepper>
```

### Pattern 7: Vertical Layout

**Use case**: Sidebar navigation or limited horizontal space
**Implementation**: Set `orientation="vertical"`

```jsx
<Stepper active={active} onStepClick={setActive} orientation="vertical">
  <Stepper.Step label="Step 1" description="Create an account" />
  <Stepper.Step label="Step 2" description="Verify email" />
  <Stepper.Step label="Step 3" description="Get full access" />
</Stepper>
```

### Pattern 8: Icon-Only Compact Mode

**Use case**: Space-constrained layouts or minimalist UI
**Implementation**: Provide only icons without labels (requires accessibility labels)

```jsx
<Stepper active={active} onStepClick={setActive}>
  <Stepper.Step
    icon={<IconUserCheck size={18} />}
    aria-label="Create an account"
  />
  <Stepper.Step
    icon={<IconMailOpened size={18} />}
    aria-label="Verify email"
  />
  <Stepper.Step
    icon={<IconShieldCheck size={18} />}
    aria-label="Get full access"
  />
</Stepper>
```

### Pattern 9: Custom Styling with Styles API

**Use case**: Match design system or create unique visual appearance
**Implementation**: Use `styles` prop targeting component parts

```jsx
<Stepper
  active={active}
  styles={{
    stepBody: { display: 'none' },
    step: { padding: 0 },
    stepIcon: { borderWidth: 4 },
    separator: {
      marginLeft: -2,
      marginRight: -2,
      height: 10,
    },
  }}
>
  <Stepper.Step label="Step 1" />
  <Stepper.Step label="Step 2" />
</Stepper>
```

### Pattern 10: Step Content Management

**Use case**: Display different content based on active step
**Implementation**: Children of `Stepper.Step` render when that step is active

```jsx
<Stepper active={active}>
  <Stepper.Step label="Profile">
    <ProfileForm />
  </Stepper.Step>
  <Stepper.Step label="Payment">
    <PaymentForm />
  </Stepper.Step>
  <Stepper.Step label="Review">
    <ReviewScreen />
  </Stepper.Step>
  <Stepper.Completed>
    <SuccessMessage />
  </Stepper.Completed>
</Stepper>
```

## Variants and Composition

### Sub-components

**Stepper.Step**: Individual step definition. Must be direct child of Stepper (wrapping not supported).

**Stepper.Completed**: Optional component displaying content after the last step is completed (when `active` exceeds the number of steps).

### Size Variants

Five size options: `xs`, `sm`, `md` (default), `lg`, `xl`

Independent control of icon size via `iconSize` prop overrides the size-based defaults.

### Orientation Variants

- **Horizontal**: Default, steps arranged left-to-right with vertical connectors
- **Vertical**: Steps stacked top-to-bottom with horizontal connectors

### Icon Position Variants

- **Left** (default): Icon appears before label
- **Right**: Icon appears after label

## Accessibility

### Screen Reader Support

**Critical Requirement**: When using icon-only steppers or steps without `label`/`description`, you **must** provide `aria-label` or `title` props for screen reader compatibility.

```jsx
// Not accessible
<Stepper.Step icon={<IconUser />} />

// Accessible
<Stepper.Step icon={<IconUser />} aria-label="Create account" />
```

### Semantic Structure

- Step buttons are keyboard navigable
- Active step is indicated to assistive technologies
- Completed states are communicated
- Each step button can receive focus

### Element References

Stepper provides ref support:
- `Stepper` ref: Root div element
- `Stepper.Step` ref: Individual step button elements

```jsx
const firstStep = useRef<HTMLButtonElement>(null);
const stepper = useRef<HTMLDivElement>(null);

<Stepper ref={stepper}>
  <Stepper.Step ref={firstStep} label="First" />
</Stepper>
```

## Responsive Design

No explicit responsive props documented, but layout adapts based on:
- Container width (horizontal orientation)
- Container height (vertical orientation)
- Font size inheritance from theme

Consider switching from horizontal to vertical orientation on mobile viewports for better usability.

## Theme Integration

### Color System

- Integrates with Mantine's theme color palette
- `color` prop accepts any theme color key
- Per-step color overrides available
- Completed steps inherit completion color

### Size System

- Respects Mantine's size scale (xs, sm, md, lg, xl)
- Typography scales with size
- Icon sizing can be independent or proportional

### Radius System

- `radius` prop follows theme radius values
- Applied to step icon backgrounds

### Styles API

Granular styling control via component parts:

**Layout Parts**:
- `root`: Root container
- `steps`: Steps container
- `content`: Step content area
- `separator`: Connector lines (horizontal)
- `verticalSeparator`: Connector lines (vertical)

**Step Parts**:
- `step`: Individual step container
- `stepIcon`: Icon wrapper
- `stepBody`: Label and description container
- `stepLabel`: Step title
- `stepDescription`: Step subtitle
- `stepLoader`: Loading indicator

Both `styles` (inline) and `classNames` (CSS modules) approaches supported.

## Related Components

**Mantine Ecosystem**:
- **Tabs**: Alternative for non-sequential multi-section content
- **Progress**: Simple progress bar without step labels
- **Timeline**: Similar visual structure for chronological events (not interactive)
- **Breadcrumbs**: Navigation showing location hierarchy (not progress)

**When to Use Each**:
- **Stepper**: Multi-step processes with clear sequence and forward progression
- **Tabs**: Switching between independent sections (no concept of progress)
- **Timeline**: Displaying historical or chronological information (read-only)
- **Progress**: Simple percentage or fractional progress without step details

## Framework-Specific Features

### React Integration

- Fully controlled component (no uncontrolled mode)
- State management via React hooks (useState)
- Callbacks use standard React event patterns
- TypeScript types included for props and refs

### Mantine-Specific

- Integrates with Mantine's theming system
- Uses Mantine's Styles API pattern
- Supports polymorphic `component` prop pattern (not documented for Stepper)
- Built on Mantine's design token system

### Component Composition Rules

**Important Constraint**: `Stepper.Step` components must be direct children of `Stepper`. Wrapping steps in other components is not supported.

```jsx
// Not supported
<Stepper active={0}>
  <div>
    <Stepper.Step label="Step 1" />
  </div>
</Stepper>

// Supported
<Stepper active={0}>
  <Stepper.Step label="Step 1" />
</Stepper>
```

For complex step content, extract child elements into separate components rather than wrapping the Step component itself.

## Code Examples

### Basic Three-Step Flow

```jsx
import { useState } from 'react';
import { Stepper, Button, Group } from '@mantine/core';

function Demo() {
  const [active, setActive] = useState(1);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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
        <Stepper.Completed>
          Completed, click back button to get to previous step
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

### Icon Position Right

```jsx
import { useState } from 'react';
import { Stepper } from '@mantine/core';

function Demo() {
  const [active, setActive] = useState(1);

  return (
    <Stepper active={active} onStepClick={setActive} iconPosition="right">
      <Stepper.Step label="Step 1" description="Create an account" />
      <Stepper.Step label="Step 2" description="Verify email" />
      <Stepper.Step label="Step 3" description="Get full access" />
    </Stepper>
  );
}
```

### Large Icon Size

```jsx
import { Stepper } from '@mantine/core';

function Demo() {
  return (
    <Stepper iconSize={42} active={1}>
      <Stepper.Step label="Step 1" description="Create an account" />
      <Stepper.Step label="Step 2" description="Verify email" />
    </Stepper>
  );
}
```

### Accessing Step References

```jsx
import { useRef } from 'react';
import { Stepper } from '@mantine/core';

function MyStepper() {
  const firstStep = useRef<HTMLButtonElement>(null);
  const stepper = useRef<HTMLDivElement>(null);

  return (
    <Stepper ref={stepper} active={0}>
      <Stepper.Step label="First step" ref={firstStep} />
      <Stepper.Step label="Second step" />
    </Stepper>
  );
}
```

## Notes and Observations

### Design Patterns

1. **Controlled Component Only**: Stepper requires explicit state management. No uncontrolled mode is provided.

2. **0-Based Indexing**: Step indices start at 0, which affects the `active` prop and `onStepClick` callback.

3. **Completion State**: Setting `active` to a value equal to or greater than the number of steps shows the `Stepper.Completed` content.

4. **Direct Children Only**: The most significant constraint is that `Stepper.Step` components cannot be wrapped in other components. This affects how steps can be dynamically generated or conditionally rendered.

### State Management Patterns

The documentation consistently shows three common state patterns:
- Simple forward/backward with boundary checks
- Forward-only navigation with `allowNextStepsSelect={false}`
- Tracked highest step with per-step click logic

### Visual Customization

The component provides three levels of visual customization:
1. **Theme-level**: Global colors, sizes, radius through theme
2. **Component-level**: Props like `color`, `size`, `iconSize`
3. **Part-level**: Styles API for granular control of internal elements

### Accessibility Considerations

The documentation emphasizes accessibility for icon-only steppers but doesn't detail:
- Full keyboard navigation patterns
- ARIA live region updates when steps change
- Focus management best practices

### Common Gotchas

1. **Wrapping Steps**: Cannot wrap `Stepper.Step` in conditional components or fragments
2. **Click Handlers**: `onStepClick` fires even when `allowStepClick={false}` (you must handle the logic)
3. **Content Rendering**: All step children render but only active step content is visible (may affect performance with heavy content)

### Performance Considerations

- All step content is rendered but hidden via CSS
- For heavy content, consider lazy loading or conditional rendering based on active step
- Icon components should be memoized if complex

### TypeScript Support

Full TypeScript definitions provided with:
- Typed props interfaces
- Ref types for both Stepper and Step
- Generic support for polymorphic components

### Missing Documentation

Not explicitly documented:
- Server-side rendering behavior
- Animation/transition customization
- Mobile touch gesture support
- Programmatic focus control
- Step validation patterns
- Integration with form libraries
