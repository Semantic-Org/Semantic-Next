# Stepper / Wizard - Chakra UI Usage Patterns

> **Framework**: Chakra UI (v3)
> **Component**: Steps
> **Documentation**: https://chakra-ui.com/docs/components/steps
> **Underlying Library**: Ark UI (https://ark-ui.com/react/docs/components/steps)
> **Research Date**: 2025-11-06

## Component Definition

The Steps component in Chakra UI is used to indicate progress through a multi-step process. It provides a visual representation of sequential steps in a workflow, form, or any multi-stage process. The component guides users through each step with clear visual indicators showing completed, current, and upcoming steps. Chakra UI's implementation is built on Ark UI's foundation and integrates seamlessly with Chakra's theming system.

Steps components are ideal for:
- Multi-step forms and wizards
- Onboarding flows
- Checkout processes
- Configuration wizards
- Tutorial sequences
- Progress tracking for sequential tasks

## Core Features

### Compositional Architecture

Chakra UI Steps follows a composition pattern with multiple sub-components that work together:

- **Steps.Root** - Main container that manages step state and provides context
- **Steps.List** - Container for the visual step indicators
- **Steps.Item** - Individual step wrapper (requires `index` prop)
- **Steps.Trigger** - Clickable step activator for navigation
- **Steps.Indicator** - Visual display for step number or status icon
- **Steps.Separator** - Visual connector line between steps
- **Steps.Content** - Content area for each step (requires `index` prop)
- **Steps.CompletedContent** - Special content shown when all steps complete
- **Steps.PrevTrigger** - Button to navigate to previous step
- **Steps.NextTrigger** - Button to navigate to next step
- **Steps.Progress** - Progress bar visualization
- **Steps.RootProvider** - Context provider for advanced control patterns

### State Management

The component supports both controlled and uncontrolled state patterns:

**Uncontrolled Mode**: Use `defaultStep` prop to set initial step, component manages state internally

**Controlled Mode**: Pass `step` prop and `onStepChange` handler to manage state externally

**Linear vs Non-Linear**: The `linear` prop enforces sequential step completion when true

### Orientation Support

Steps can be displayed in two orientations:
- **Horizontal** (default) - Steps arranged left-to-right
- **Vertical** - Steps stacked top-to-bottom

### Navigation Features

Built-in navigation controls:
- Previous/Next trigger buttons
- Direct step selection (if not in linear mode)
- Programmatic navigation via API
- Keyboard navigation support

### Progress Tracking

Multiple ways to visualize progress:
- Visual step indicators (numbered by default)
- Separator lines showing completion
- Progress bar component
- Completion percentage available via context

## Props API

### Steps.Root Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | - | **Required.** Total number of steps in the sequence |
| `defaultStep` | `number` | `0` | Initial step index for uncontrolled mode |
| `step` | `number` | - | Current step index for controlled mode |
| `linear` | `boolean` | `false` | When true, users must complete steps sequentially |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of step indicators |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Visual size scale |
| `colorPalette` | `string` | - | Color scheme for theming |
| `ids` | `ElementIds` | - | Custom element ID overrides |
| `onStepChange` | `(details: StepChangeDetails) => void` | - | Callback when step changes |
| `onStepComplete` | `() => void` | - | Callback when all steps completed |
| `asChild` | `boolean` | `false` | Use child element as default renderer |

### Steps.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | - | **Required.** Step position (0-indexed) |

### Steps.Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | - | **Required.** Associated step index |

### Steps.Trigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI box props | - | - | Inherits all styling props from Box component |

### Steps.Indicator Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI box props | - | - | Inherits all styling props from Box component |

### Steps.Separator Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI box props | - | - | Inherits all styling props from Box component |

### Steps.PrevTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI button props | - | - | Inherits all button props |

### Steps.NextTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI button props | - | - | Inherits all button props |

## Usage Patterns

### Pattern 1: Basic Uncontrolled Steps

**Use case**: Simple multi-step process where the component manages its own state

**Implementation**: Define step data array, render Steps with navigation controls

```jsx
import { Steps } from '@chakra-ui/react'

const items = [
  { value: 'first', title: 'First', description: 'Contact Info' },
  { value: 'second', title: 'Second', description: 'Date & Time' },
  { value: 'third', title: 'Third', description: 'Select Rooms' },
]

function BasicSteps() {
  return (
    <Steps.Root count={items.length} defaultStep={0}>
      <Steps.List>
        {items.map((item, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Trigger>
              <Steps.Indicator>{index + 1}</Steps.Indicator>
              <span>{item.title}</span>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      {items.map((item, index) => (
        <Steps.Content key={index} index={index}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </Steps.Content>
      ))}

      <Steps.CompletedContent>
        Steps Complete - Thank you!
      </Steps.CompletedContent>

      <div>
        <Steps.PrevTrigger>Back</Steps.PrevTrigger>
        <Steps.NextTrigger>Next</Steps.NextTrigger>
      </div>
    </Steps.Root>
  )
}
```

### Pattern 2: Controlled Steps with External State

**Use case**: When parent component needs to control or react to step changes

**Implementation**: Use React state with `step` and `onStepChange` props

```jsx
import { useState } from 'react'
import { Steps } from '@chakra-ui/react'

function ControlledSteps() {
  const [currentStep, setCurrentStep] = useState(0)

  const items = [
    { title: 'Step 1', description: 'Description 1' },
    { title: 'Step 2', description: 'Description 2' },
    { title: 'Step 3', description: 'Description 3' },
  ]

  return (
    <div>
      <p>Current Step: {currentStep + 1} of {items.length}</p>

      <Steps.Root
        count={items.length}
        step={currentStep}
        onStepChange={(details) => setCurrentStep(details.step)}
      >
        <Steps.List>
          {items.map((item, index) => (
            <Steps.Item key={index} index={index}>
              <Steps.Trigger>
                <Steps.Indicator>{index + 1}</Steps.Indicator>
                <span>{item.title}</span>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>

        {items.map((item, index) => (
          <Steps.Content key={index} index={index}>
            {item.description}
          </Steps.Content>
        ))}

        <div>
          <Steps.PrevTrigger>Previous</Steps.PrevTrigger>
          <Steps.NextTrigger>Continue</Steps.NextTrigger>
        </div>
      </Steps.Root>
    </div>
  )
}
```

### Pattern 3: Linear Step Progression

**Use case**: Enforce sequential completion (e.g., forms where each step must validate)

**Implementation**: Set `linear={true}` to prevent skipping ahead

```jsx
function LinearSteps() {
  return (
    <Steps.Root count={3} linear={true}>
      <Steps.List>
        <Steps.Item index={0}>
          <Steps.Trigger>
            <Steps.Indicator>1</Steps.Indicator>
            <span>Account Info</span>
          </Steps.Trigger>
          <Steps.Separator />
        </Steps.Item>

        <Steps.Item index={1}>
          <Steps.Trigger>
            <Steps.Indicator>2</Steps.Indicator>
            <span>Verification</span>
          </Steps.Trigger>
          <Steps.Separator />
        </Steps.Item>

        <Steps.Item index={2}>
          <Steps.Trigger>
            <Steps.Indicator>3</Steps.Indicator>
            <span>Complete</span>
          </Steps.Trigger>
        </Steps.Item>
      </Steps.List>

      {/* Content sections */}

      <div>
        <Steps.PrevTrigger>Back</Steps.PrevTrigger>
        <Steps.NextTrigger>Next</Steps.NextTrigger>
      </div>
    </Steps.Root>
  )
}
```

### Pattern 4: Vertical Orientation

**Use case**: Side navigation or mobile-friendly layouts

**Implementation**: Set `orientation="vertical"`

```jsx
function VerticalSteps() {
  const items = [
    { title: 'Step 1', description: 'First step' },
    { title: 'Step 2', description: 'Second step' },
    { title: 'Step 3', description: 'Third step' },
  ]

  return (
    <Steps.Root count={items.length} orientation="vertical">
      <Steps.List>
        {items.map((item, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Trigger>
              <Steps.Indicator>{index + 1}</Steps.Indicator>
              <div>
                <div>{item.title}</div>
                <div>{item.description}</div>
              </div>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      {items.map((item, index) => (
        <Steps.Content key={index} index={index}>
          Content for {item.title}
        </Steps.Content>
      ))}
    </Steps.Root>
  )
}
```

### Pattern 5: Custom Icons Instead of Numbers

**Use case**: Visual branding or semantic meaning for each step

**Implementation**: Replace numeric indicators with custom icons

```jsx
import { CheckIcon, TimeIcon, EmailIcon } from '@chakra-ui/icons'

function CustomIconSteps() {
  const steps = [
    { icon: <EmailIcon />, title: 'Contact' },
    { icon: <TimeIcon />, title: 'Schedule' },
    { icon: <CheckIcon />, title: 'Confirm' },
  ]

  return (
    <Steps.Root count={steps.length}>
      <Steps.List>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Trigger>
              <Steps.Indicator>{step.icon}</Steps.Indicator>
              <span>{step.title}</span>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      {/* Content sections */}
    </Steps.Root>
  )
}
```

### Pattern 6: RootProvider Pattern for Advanced Control

**Use case**: Need programmatic control (reset, jump to step) from outside the component

**Implementation**: Use `useSteps` hook with `Steps.RootProvider`

```jsx
import { useSteps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'

function AdvancedStepsControl() {
  const items = [
    { title: 'Step 1' },
    { title: 'Step 2' },
    { title: 'Step 3' },
  ]

  const steps = useSteps({ count: items.length })

  return (
    <div>
      <Button onClick={() => steps.resetStep()}>Reset to Start</Button>
      <Button onClick={() => steps.setStep(2)}>Jump to Step 3</Button>

      <p>Progress: {steps.percent}%</p>
      <p>Current: {steps.value + 1} of {steps.count}</p>

      <Steps.RootProvider value={steps}>
        <Steps.List>
          {items.map((item, index) => (
            <Steps.Item key={index} index={index}>
              <Steps.Trigger>
                <Steps.Indicator>{index + 1}</Steps.Indicator>
                <span>{item.title}</span>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>

        {items.map((item, index) => (
          <Steps.Content key={index} index={index}>
            {item.title} content
          </Steps.Content>
        ))}

        <Steps.CompletedContent>
          All steps completed!
        </Steps.CompletedContent>
      </Steps.RootProvider>
    </div>
  )
}
```

### Pattern 7: Progress Bar Visualization

**Use case**: Show visual progress indicator alongside steps

**Implementation**: Include `Steps.Progress` component

```jsx
function StepsWithProgress() {
  const items = [
    { title: 'Start' },
    { title: 'Middle' },
    { title: 'End' },
  ]

  return (
    <Steps.Root count={items.length}>
      <Steps.Progress />

      <Steps.List>
        {items.map((item, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Trigger>
              <Steps.Indicator>{index + 1}</Steps.Indicator>
              <span>{item.title}</span>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      {/* Content sections */}
    </Steps.Root>
  )
}
```

## Variants and Composition

### Size Variants

The Steps component supports three size variants via the `size` prop:

- **`sm`** - Small size with compact spacing
- **`md`** - Medium size (default)
- **`lg`** - Large size with generous spacing

```jsx
<Steps.Root count={3} size="lg">
  {/* steps content */}
</Steps.Root>
```

### Color Palette

Custom color schemes can be applied using the `colorPalette` prop:

```jsx
<Steps.Root count={3} colorPalette="blue">
  {/* steps content */}
</Steps.Root>
```

### Sub-Component Composition

The flexible composition pattern allows mixing and matching components:

```jsx
<Steps.Root count={3}>
  {/* Progress bar at top */}
  <Steps.Progress />

  {/* Step indicators */}
  <Steps.List>
    {/* Steps.Item + Trigger + Indicator + Separator */}
  </Steps.List>

  {/* Content areas */}
  <Steps.Content index={0}>...</Steps.Content>
  <Steps.Content index={1}>...</Steps.Content>
  <Steps.Content index={2}>...</Steps.Content>

  {/* Completion message */}
  <Steps.CompletedContent>Done!</Steps.CompletedContent>

  {/* Navigation */}
  <Steps.PrevTrigger>Back</Steps.PrevTrigger>
  <Steps.NextTrigger>Next</Steps.NextTrigger>
</Steps.Root>
```

## Accessibility

### Keyboard Navigation

The Steps component includes full keyboard support:

- **Tab** - Move focus between interactive elements
- **Enter / Space** - Activate focused step trigger
- **Arrow keys** - Navigate between steps (when not in linear mode)

### ARIA Attributes

Automatic ARIA attributes are applied:

- `aria-current="step"` - Applied to current step
- `aria-label` - Screen reader labels for navigation
- `role` attributes - Proper semantic roles for step elements
- `aria-disabled` - Applied to disabled navigation buttons

### Screen Reader Support

- Step status announcements (complete, current, incomplete)
- Progress percentage announcements
- Navigation button state announcements
- Completion messages announced

### Focus Management

- Visible focus indicators on all interactive elements
- Focus ring styling via Chakra's focus system
- Keyboard trap prevention in linear mode

## Responsive Design

### Automatic Orientation Switching

Steps can adapt to viewport size:

```jsx
<Steps.Root
  count={3}
  orientation={{ base: 'vertical', md: 'horizontal' }}
>
  {/* Vertical on mobile, horizontal on desktop */}
</Steps.Root>
```

### Responsive Sizing

```jsx
<Steps.Root
  count={3}
  size={{ base: 'sm', md: 'md', lg: 'lg' }}
>
  {/* Responsive size scaling */}
</Steps.Root>
```

## Theme Integration

### CSS Custom Properties

The Steps component exposes CSS variables for theming:

- `--percent` - Current progress percentage (available on Root)

### Data Attributes for Styling

Components expose data attributes for CSS targeting:

- `[data-scope="steps"]` - Scope identifier
- `[data-part="root"]` / `[data-part="list"]` / etc. - Component part
- `[data-orientation="horizontal"]` or `[data-orientation="vertical"]` - Layout
- `[data-state="open"]` or `[data-state="closed"]` - Content visibility
- `[data-complete]` - Present when step is complete
- `[data-current]` - Present on active step
- `[data-incomplete]` - Present on incomplete steps

### Custom Styling

```jsx
<Steps.Root
  count={3}
  css={{
    '& [data-current]': {
      color: 'blue.500',
      fontWeight: 'bold'
    },
    '& [data-complete]': {
      color: 'green.500'
    }
  }}
>
  {/* styled steps */}
</Steps.Root>
```

## Related Components

- **Tabs** - Alternative for non-sequential content organization
- **Progress** - Simple linear progress indicator without steps
- **Breadcrumb** - Navigation trail for hierarchical content
- **Menu** - Dropdown navigation and actions
- **Wizard** - Full-page step-by-step form flows (may be custom composition)

## Framework-Specific Features

### Chakra UI Integration

- Full integration with Chakra's design token system
- Uses Chakra's Box component props for styling flexibility
- Compatible with Chakra's responsive style props
- Theming via Chakra's recipe system

### Ark UI Foundation

Chakra UI's Steps component is built on Ark UI, which provides:
- Framework-agnostic core logic
- Consistent behavior across React, Solid, Vue, and Svelte
- Battle-tested accessibility patterns
- Headless component architecture

### useSteps Hook API

The `useSteps` hook provides programmatic control:

```typescript
interface UseStepsReturn {
  value: number              // Current step index
  percent: number            // Progress percentage (0-100)
  count: number              // Total number of steps
  hasNextStep: boolean       // Can navigate forward
  hasPrevStep: boolean       // Can navigate backward
  isCompleted: boolean       // All steps complete
  setStep: (step: number) => void        // Set specific step
  goToNextStep: () => void               // Advance one step
  goToPrevStep: () => void               // Go back one step
  resetStep: () => void                  // Return to initial step
  getItemState: (props: ItemProps) => ItemState  // Get step state
}
```

## Code Examples

### Example 1: Multi-Step Form

```jsx
import { useState } from 'react'
import { Steps, Input, FormControl, FormLabel, Button } from '@chakra-ui/react'

function MultiStepForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  })

  const steps = [
    { title: 'Personal', fields: ['name', 'email'] },
    { title: 'Address', fields: ['address'] },
    { title: 'Review', fields: [] }
  ]

  return (
    <Steps.Root count={steps.length} linear={true}>
      <Steps.List>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Trigger>
              <Steps.Indicator>{index + 1}</Steps.Indicator>
              <span>{step.title}</span>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      <Steps.Content index={0}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </FormControl>
      </Steps.Content>

      <Steps.Content index={1}>
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </FormControl>
      </Steps.Content>

      <Steps.Content index={2}>
        <div>
          <h3>Review Your Information</h3>
          <p>Name: {formData.name}</p>
          <p>Email: {formData.email}</p>
          <p>Address: {formData.address}</p>
        </div>
      </Steps.Content>

      <Steps.CompletedContent>
        <h2>Form Submitted Successfully!</h2>
      </Steps.CompletedContent>

      <div>
        <Steps.PrevTrigger>Back</Steps.PrevTrigger>
        <Steps.NextTrigger>Continue</Steps.NextTrigger>
      </div>
    </Steps.Root>
  )
}
```

### Example 2: Checkout Flow

```jsx
function CheckoutSteps() {
  const steps = [
    { title: 'Cart', description: 'Review items' },
    { title: 'Shipping', description: 'Delivery details' },
    { title: 'Payment', description: 'Payment method' },
    { title: 'Confirm', description: 'Order summary' }
  ]

  return (
    <Steps.Root count={steps.length} defaultStep={0}>
      <Steps.Progress />

      <Steps.List>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Trigger>
              <Steps.Indicator>{index + 1}</Steps.Indicator>
              <div>
                <div>{step.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'gray' }}>
                  {step.description}
                </div>
              </div>
            </Steps.Trigger>
            {index < steps.length - 1 && <Steps.Separator />}
          </Steps.Item>
        ))}
      </Steps.List>

      {steps.map((step, index) => (
        <Steps.Content key={index} index={index}>
          <h2>{step.title}</h2>
          <p>{step.description} content goes here</p>
        </Steps.Content>
      ))}

      <Steps.CompletedContent>
        <h2>Order Placed!</h2>
        <p>Thank you for your purchase.</p>
      </Steps.CompletedContent>

      <div>
        <Steps.PrevTrigger>Back</Steps.PrevTrigger>
        <Steps.NextTrigger>Continue</Steps.NextTrigger>
      </div>
    </Steps.Root>
  )
}
```

### Example 3: Onboarding Wizard

```jsx
import { useSteps } from '@chakra-ui/react'

function OnboardingWizard() {
  const steps = useSteps({ count: 4 })

  const onboardingSteps = [
    { title: 'Welcome', content: 'Welcome to our platform!' },
    { title: 'Setup Profile', content: 'Create your profile' },
    { title: 'Connect Apps', content: 'Connect your favorite apps' },
    { title: 'Get Started', content: 'You are all set!' }
  ]

  return (
    <div>
      <Button onClick={() => steps.resetStep()} disabled={steps.value === 0}>
        Start Over
      </Button>

      <p>Progress: {steps.percent}%</p>

      <Steps.RootProvider value={steps}>
        <Steps.List>
          {onboardingSteps.map((step, index) => (
            <Steps.Item key={index} index={index}>
              <Steps.Trigger>
                <Steps.Indicator>{index + 1}</Steps.Indicator>
                <span>{step.title}</span>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>

        {onboardingSteps.map((step, index) => (
          <Steps.Content key={index} index={index}>
            <h2>{step.title}</h2>
            <p>{step.content}</p>
          </Steps.Content>
        ))}

        <Steps.CompletedContent>
          <h2>Onboarding Complete!</h2>
          <Button>Go to Dashboard</Button>
        </Steps.CompletedContent>

        <div>
          <Steps.PrevTrigger disabled={!steps.hasPrevStep}>
            Previous
          </Steps.PrevTrigger>
          <Steps.NextTrigger disabled={!steps.hasNextStep}>
            {steps.isCompleted ? 'Finish' : 'Next'}
          </Steps.NextTrigger>
        </div>
      </Steps.RootProvider>
    </div>
  )
}
```

## Notes and Observations

### Composition Over Configuration

Chakra UI's Steps component follows a highly compositional pattern where each visual and functional piece is a separate component. This provides maximum flexibility but requires understanding the complete component structure.

### Ark UI Foundation

Unlike some Chakra UI components that are built from scratch, Steps is built on Ark UI's headless implementation. This means:
- The core logic and accessibility features come from Ark UI
- Chakra provides the styling and theming layer
- API surface is consistent with other Ark-based Chakra components
- Full TypeScript support from both libraries

### State Management Flexibility

The component offers three levels of state control:
1. **Uncontrolled with defaults** - Simplest, component manages everything
2. **Controlled with props** - Parent controls state via `step` prop
3. **RootProvider pattern** - Full programmatic access via `useSteps` hook

This flexibility allows choosing the right pattern for the use case complexity.

### Content Management

Each step's content is defined using `Steps.Content` with an `index` prop. This means:
- Content is declaratively associated with steps
- Only the active step's content is rendered/visible
- The `Steps.CompletedContent` is a special final state

### Navigation Control

Navigation is provided through:
- Built-in `PrevTrigger` and `NextTrigger` components
- Direct step clicking (when not in linear mode)
- Programmatic control via `useSteps` hook

### No Built-in Validation

The component does not include built-in form validation. When using Steps for forms:
- Validation must be implemented separately
- Consider disabling `NextTrigger` when validation fails
- Use `linear={true}` to enforce sequential progression

### Responsive Considerations

The component doesn't automatically switch orientation based on viewport. Developers must explicitly configure responsive behavior using Chakra's responsive props syntax.

### Separator Behavior

The `Steps.Separator` component must be explicitly included in each `Steps.Item`. By convention, it's omitted from the last item to avoid a trailing separator.

### Progress Percentage

The `--percent` CSS variable and `percent` property from `useSteps` provide 0-100 percentage values useful for progress bars or analytics.

### Framework Consistency

Being built on Ark UI means this component's API is consistent with Ark's Steps implementations in Solid, Vue, and Svelte - helpful for teams working across multiple frameworks.
