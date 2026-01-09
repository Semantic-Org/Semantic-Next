# Chakra UI Stepper/Steps Component - Usage Patterns Report

## 1. Component Overview

Chakra UI provides stepper/steps components to indicate progress through a multi-step process. These components are commonly used for:
- Multi-step forms and wizards
- Onboarding flows
- Checkout processes
- Progress tracking in workflows

**Version Differences:**
- **v2**: Called "Stepper" with a more granular component structure
- **v3**: Called "Steps" with a composable, Ark UI-based architecture

The component provides clear visual representation of progression, showing which steps are complete, which is active, and which are upcoming. Both versions offer horizontal and vertical orientations, multiple sizes, and extensive customization options.

## 2. Version Comparison (v2 vs v3)

### Major Architectural Changes

Chakra UI v3 represents a significant shift in architecture, moving from the v2 Stepper to a new Steps component built on Ark UI (a headless UI library) and Zag.js (statechart-based state management).

#### API Structure Changes

**v2 Structure (Granular Components):**
```jsx
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/react'

const { activeStep } = useSteps({
  index: 1,
  count: steps.length,
})

<Stepper index={activeStep}>
  {steps.map((step, index) => (
    <Step key={index}>
      <StepIndicator>
        <StepStatus
          complete={<StepIcon />}
          incomplete={<StepNumber />}
          active={<StepNumber />}
        />
      </StepIndicator>
      <Box flexShrink='0'>
        <StepTitle>{step.title}</StepTitle>
        <StepDescription>{step.description}</StepDescription>
      </Box>
      <StepSeparator />
    </Step>
  ))}
</Stepper>
```

**v3 Structure (Ark UI-based Composition):**
```jsx
import { Steps } from "@chakra-ui/react"

<Steps.Root defaultStep={1} count={steps.length}>
  <Steps.List>
    {steps.map((step, index) => (
      <Steps.Item key={index} index={index}>
        <Steps.Indicator />
        <Steps.Title>{step.title}</Steps.Title>
        <Steps.Separator />
      </Steps.Item>
    ))}
  </Steps.List>

  {steps.map((step, index) => (
    <Steps.Content key={index} index={index}>
      {step.description}
    </Steps.Content>
  ))}

  <Steps.CompletedContent>
    All steps complete!
  </Steps.CompletedContent>
</Steps.Root>
```

### Component Parts Comparison

**v2 Components:**
- `Stepper` - Parent container
- `Step` - Individual step wrapper
- `StepIndicator` - Wraps status elements
- `StepStatus` - Renders content based on step state
- `StepNumber` - Shows step number
- `StepIcon` - Shows completion icon
- `StepTitle` - Step title text
- `StepDescription` - Step description text
- `StepSeparator` - Visual connector between steps

**v3 Components:**
- `Steps.Root` - Main container
- `Steps.List` - Container for step items
- `Steps.Item` - Individual step element
- `Steps.Indicator` - Step number/status indicator
- `Steps.Title` - Step title
- `Steps.Separator` - Connector between steps (automatically hidden on last item)
- `Steps.Content` - Content area for each step
- `Steps.CompletedContent` - Content shown when all steps are complete
- `Steps.Trigger` - Makes steps clickable
- `Steps.NextTrigger` - Button to advance to next step
- `Steps.PrevTrigger` - Button to go to previous step

### Key Differences

| Aspect | v2 | v3 |
|--------|----|----|
| **Foundation** | Custom implementation | Built on Ark UI + Zag.js |
| **State Management** | `useSteps` hook | `useSteps` store hook + RootProvider |
| **Status Display** | `StepStatus` component with render props | Automatic state-based rendering |
| **Content Management** | External to stepper | Built-in `Steps.Content` system |
| **Navigation** | Custom implementation needed | Built-in trigger components |
| **Prop Passing** | `index` prop on Stepper | `defaultStep` and `count` on Root |
| **Clickable Steps** | Custom implementation | `Steps.Trigger` wrapper |

### Migration Considerations

**Breaking Changes:**
1. Component names changed from `Stepper` to `Steps`
2. Different prop structure (index → defaultStep)
3. New content management system
4. Different component composition patterns

**New Capabilities in v3:**
- Built-in content management per step
- Integrated navigation triggers
- RootProvider pattern for external state access
- Improved accessibility through Ark UI foundation
- Built-in completed state handling

## 3. Basic Usage

### v2 Basic Usage

**Minimal Stepper:**
```jsx
import {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepNumber,
  StepIcon,
  StepTitle,
  StepDescription,
  StepSeparator,
  Box,
  useSteps,
} from '@chakra-ui/react'

const steps = [
  { title: 'First', description: 'Contact Info' },
  { title: 'Second', description: 'Date & Time' },
  { title: 'Third', description: 'Select Rooms' },
]

function Example() {
  const { activeStep } = useSteps({
    index: 1,
    count: steps.length,
  })

  return (
    <Stepper index={activeStep}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink='0'>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  )
}
```

**With State Management:**
```jsx
import { Button, ButtonGroup } from '@chakra-ui/react'

function ControlledExample() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const goToNext = () => setActiveStep(activeStep + 1)
  const goToPrev = () => setActiveStep(activeStep - 1)

  return (
    <>
      <Stepper index={activeStep}>
        {/* steps mapping */}
      </Stepper>

      <ButtonGroup mt={4}>
        <Button onClick={goToPrev} isDisabled={activeStep === 0}>
          Previous
        </Button>
        <Button onClick={goToNext} isDisabled={activeStep === steps.length - 1}>
          Next
        </Button>
      </ButtonGroup>
    </>
  )
}
```

### v3 Basic Usage

**Minimal Steps:**
```jsx
import { Steps } from "@chakra-ui/react"

const steps = [
  { title: "Step 1", description: "Step 1 description" },
  { title: "Step 2", description: "Step 2 description" },
  { title: "Step 3", description: "Step 3 description" },
]

function Example() {
  return (
    <Steps.Root defaultStep={0} count={steps.length}>
      <Steps.List>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Indicator />
            <Steps.Title>{step.title}</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>
    </Steps.Root>
  )
}
```

**With Content and Navigation:**
```jsx
import { Button, ButtonGroup, Stack } from "@chakra-ui/react"

function CompleteExample() {
  return (
    <Steps.Root defaultStep={0} count={steps.length}>
      <Steps.List>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Indicator />
            <Steps.Title>{step.title}</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      <Stack>
        {steps.map((step, index) => (
          <Steps.Content key={index} index={index}>
            {step.description}
          </Steps.Content>
        ))}

        <Steps.CompletedContent>
          All steps are complete!
        </Steps.CompletedContent>

        <ButtonGroup size="sm" variant="outline">
          <Steps.PrevTrigger asChild>
            <Button>Previous</Button>
          </Steps.PrevTrigger>
          <Steps.NextTrigger asChild>
            <Button>Next</Button>
          </Steps.NextTrigger>
        </ButtonGroup>
      </Stack>
    </Steps.Root>
  )
}
```

## 4. Props/API Reference

### v2 Stepper Props

**Stepper Component:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | - | The index of the active step |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the stepper |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The size of the stepper |
| `colorScheme` | `string` | `'blue'` | The color scheme for the stepper |

**Step Component:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | The content of the step |

**StepIndicator Component:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Usually contains StepStatus |

**StepStatus Component:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `complete` | `ReactNode` | - | Content to render when step is complete |
| `incomplete` | `ReactNode` | - | Content to render when step is incomplete |
| `active` | `ReactNode` | - | Content to render when step is active |

**StepSeparator Component:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All style props | - | - | Accepts any Chakra UI style props |

### v2 useSteps Hook

**Parameters:**
```typescript
interface UseStepsProps {
  index: number       // The current active step index
  count: number       // Total number of steps
}
```

**Return Value:**
```typescript
interface UseStepsReturn {
  activeStep: number                    // Current active step index
  setActiveStep: (index: number) => void // Function to set active step
  nextStep: () => void                  // Go to next step
  prevStep: () => void                  // Go to previous step
  reset: () => void                     // Reset to initial step
}
```

**Example:**
```jsx
const { activeStep, nextStep, prevStep, reset } = useSteps({
  index: 1,
  count: steps.length,
})
```

### v3 Steps.Root Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | - | Total number of steps |
| `defaultStep` | `number` | `0` | The initial active step (0-indexed) |
| `step` | `number` | - | Controlled step value |
| `onStepChange` | `(details: { step: number }) => void` | - | Callback when step changes |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout orientation |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `variant` | `'subtle' \| 'solid'` | - | Visual style variant |
| `colorPalette` | `string` | `'gray'` | Color palette for theming |

### v3 Steps.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | - | The index of this step |
| `title` | `string` | - | Optional title prop (can also use Steps.Title) |

### v3 Steps.Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | - | The index of the step this content belongs to |
| `children` | `ReactNode` | - | Content to display when step is active |

### v3 Navigation Components

**Steps.NextTrigger / Steps.PrevTrigger:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render as child component |
| All button props | - | - | Accepts standard button props |

### v3 useSteps Store Hook

**Usage with RootProvider:**
```jsx
import { Steps, useStepsContext } from "@chakra-ui/react"

function StepControls() {
  const steps = useStepsContext()

  return (
    <div>
      <button onClick={() => steps.setStep(0)}>Reset</button>
      <p>Current step: {steps.step}</p>
    </div>
  )
}

function App() {
  return (
    <Steps.RootProvider defaultStep={0} count={3}>
      <Steps.List>
        {/* steps */}
      </Steps.List>
      <StepControls />
    </Steps.RootProvider>
  )
}
```

## 5. Orientation Patterns

### Horizontal Orientation (Default)

**v2:**
```jsx
<Stepper index={activeStep} orientation="horizontal">
  {steps.map((step, index) => (
    <Step key={index}>
      <StepIndicator>
        <StepStatus
          complete={<StepIcon />}
          incomplete={<StepNumber />}
          active={<StepNumber />}
        />
      </StepIndicator>
      <Box flexShrink='0'>
        <StepTitle>{step.title}</StepTitle>
        <StepDescription>{step.description}</StepDescription>
      </Box>
      <StepSeparator />
    </Step>
  ))}
</Stepper>
```

**v3:**
```jsx
<Steps.Root defaultStep={0} count={steps.length} orientation="horizontal">
  <Steps.List>
    {steps.map((step, index) => (
      <Steps.Item key={index} index={index}>
        <Steps.Indicator />
        <Steps.Title>{step.title}</Steps.Title>
        <Steps.Separator />
      </Steps.Item>
    ))}
  </Steps.List>
</Steps.Root>
```

### Vertical Orientation

**v2:**
```jsx
<Stepper index={activeStep} orientation="vertical" height="400px" gap="0">
  {steps.map((step, index) => (
    <Step key={index}>
      <StepIndicator>
        <StepStatus
          complete={<StepIcon />}
          incomplete={<StepNumber />}
          active={<StepNumber />}
        />
      </StepIndicator>

      <Box flexShrink='0'>
        <StepTitle>{step.title}</StepTitle>
        <StepDescription>{step.description}</StepDescription>
      </Box>

      <StepSeparator />
    </Step>
  ))}
</Stepper>
```

**v3:**
```jsx
<Steps.Root
  orientation="vertical"
  height="400px"
  defaultStep={0}
  count={steps.length}
>
  <Steps.List>
    {steps.map((step, index) => (
      <Steps.Item key={index} index={index}>
        <Steps.Indicator />
        <Steps.Title>{step.title}</Steps.Title>
        <Steps.Separator />
      </Steps.Item>
    ))}
  </Steps.List>

  <Stack>
    {steps.map((step, index) => (
      <Steps.Content key={index} index={index}>
        {step.description}
      </Steps.Content>
    ))}
  </Stack>
</Steps.Root>
```

**Vertical Orientation Considerations:**
- Typically needs an explicit height or max-height
- Content layout is often side-by-side with steps
- Separators connect vertically between indicators
- Better for detailed step content or wizards with forms

## 6. Size Patterns

### v2 Size Variants

```jsx
import { Stack } from '@chakra-ui/react'

// Small
<Stepper size="sm" index={activeStep}>
  {/* steps */}
</Stepper>

// Medium (default)
<Stepper size="md" index={activeStep}>
  {/* steps */}
</Stepper>

// Large
<Stepper size="lg" index={activeStep}>
  {/* steps */}
</Stepper>
```

**Size affects:**
- Indicator size
- Font size for titles and descriptions
- Icon size
- Spacing between elements
- Separator thickness

### v3 Size Variants

```jsx
// Small
<Steps.Root size="sm" defaultStep={0} count={3}>
  <Steps.List>
    {/* steps */}
  </Steps.List>
</Steps.Root>

// Medium (default)
<Steps.Root size="md" defaultStep={0} count={3}>
  <Steps.List>
    {/* steps */}
  </Steps.List>
</Steps.Root>

// Large
<Steps.Root size="lg" defaultStep={0} count={3}>
  <Steps.List>
    {/* steps */}
  </Steps.List>
</Steps.Root>
```

**Size implementation:**
- Controlled via CSS variables: `--steps-size` and `--steps-icon-size`
- Default size is `md` with indicator size of `var(--chakra-sizes-10)`
- Icon size scales with `var(--chakra-sizes-4)`
- Font size is `sm` (14px) by default

## 7. Status Patterns

### v2 Step States

Steps in v2 have three states: **complete**, **active**, and **incomplete**.

**Automatic State Determination:**
```jsx
// Steps before activeStep are complete
// Step at activeStep is active
// Steps after activeStep are incomplete

const { activeStep } = useSteps({ index: 1, count: 3 })
// Step 0 = complete
// Step 1 = active
// Step 2 = incomplete
```

**Custom Status Rendering:**
```jsx
<StepIndicator>
  <StepStatus
    complete={<StepIcon />}
    incomplete={<StepNumber />}
    active={<StepNumber />}
  />
</StepIndicator>
```

**Custom Icons for States:**
```jsx
import { CheckIcon } from '@chakra-ui/icons'

<StepIndicator>
  <StepStatus
    complete={<CheckIcon />}
    incomplete={<StepNumber />}
    active={<Box w="12px" h="12px" bg="blue.500" borderRadius="full" />}
  />
</StepIndicator>
```

**Emoji Status Indicators:**
```jsx
<StepIndicator>
  <StepStatus
    complete="😀"
    incomplete="😶"
    active="😅"
  />
</StepIndicator>
```

### v3 Step States

**Automatic State Management:**
```jsx
// v3 automatically manages step states based on defaultStep/step prop
<Steps.Root defaultStep={1} count={3}>
  {/* Step 0 = complete, Step 1 = active, Step 2 = incomplete */}
</Steps.Root>
```

**State Attributes:**
- Complete steps: Have `data-complete` attribute
- Active step: Has `data-selected` and `aria-selected="true"`
- Incomplete steps: Default appearance

**Custom Status Styling:**
```jsx
<Steps.Item>
  <Steps.Indicator
    sx={{
      '&[data-complete]': { bg: 'green.500', color: 'white' },
      '&[data-selected]': { bg: 'blue.500', color: 'white', borderWidth: '2px' },
    }}
  />
</Steps.Item>
```

## 8. Type Patterns

### v3 Visual Variants

**Subtle Variant:**
```jsx
<Steps.Root variant="subtle" defaultStep={0} count={3}>
  <Steps.List>
    {steps.map((step, index) => (
      <Steps.Item key={index} index={index}>
        <Steps.Indicator />
        <Steps.Title>{step.title}</Steps.Title>
        <Steps.Separator />
      </Steps.Item>
    ))}
  </Steps.List>
</Steps.Root>
```

**Solid Variant:**
```jsx
<Steps.Root variant="solid" defaultStep={0} count={3}>
  <Steps.List>
    {steps.map((step, index) => (
      <Steps.Item key={index} index={index}>
        <Steps.Indicator />
        <Steps.Title>{step.title}</Steps.Title>
        <Steps.Separator />
      </Steps.Item>
    ))}
  </Steps.List>
</Steps.Root>
```

**Variant Characteristics:**
- **Subtle**: Lighter appearance with subtle backgrounds
- **Solid**: More prominent with solid fills for indicators

### v2 Custom Variants

v2 doesn't have built-in variants but supports full style customization:

```jsx
<Stepper index={activeStep}>
  <Step>
    <StepIndicator
      sx={{
        '&[data-status=complete]': {
          background: 'green.500',
          borderColor: 'green.500',
        },
        '&[data-status=active]': {
          background: 'blue.500',
          borderColor: 'blue.500',
        },
        '&[data-status=incomplete]': {
          background: 'gray.200',
          borderColor: 'gray.300',
        },
      }}
    >
      <StepStatus
        complete={<StepIcon />}
        incomplete={<StepNumber />}
        active={<StepNumber />}
      />
    </StepIndicator>
    <Box>
      <StepTitle>Step Title</StepTitle>
      <StepDescription>Description</StepDescription>
    </Box>
    <StepSeparator />
  </Step>
</Stepper>
```

## 9. Content Patterns

### Title and Description

**v2:**
```jsx
<Step>
  <StepIndicator>
    <StepStatus
      complete={<StepIcon />}
      incomplete={<StepNumber />}
      active={<StepNumber />}
    />
  </StepIndicator>

  <Box flexShrink='0'>
    <StepTitle>Account Information</StepTitle>
    <StepDescription>Enter your email and password</StepDescription>
  </Box>

  <StepSeparator />
</Step>
```

**v3:**
```jsx
<Steps.Item index={0}>
  <Steps.Indicator />
  <Steps.Title>Account Information</Steps.Title>
  <Steps.Description>Enter your email and password</Steps.Description>
  <Steps.Separator />
</Steps.Item>
```

### Title Only

**v2:**
```jsx
<Step>
  <StepIndicator>
    <StepStatus
      complete={<StepIcon />}
      incomplete={<StepNumber />}
      active={<StepNumber />}
    />
  </StepIndicator>
  <StepTitle>Step Title</StepTitle>
  <StepSeparator />
</Step>
```

**v3:**
```jsx
<Steps.Item index={0}>
  <Steps.Indicator />
  <Steps.Title>Step Title</Steps.Title>
  <Steps.Separator />
</Steps.Item>
```

### Icon Only (Minimal)

**v2:**
```jsx
<Step>
  <StepIndicator>
    <StepStatus
      complete={<StepIcon />}
      incomplete={<StepNumber />}
      active={<StepNumber />}
    />
  </StepIndicator>
  <StepSeparator />
</Step>
```

**v3:**
```jsx
<Steps.Item index={0}>
  <Steps.Indicator />
  <Steps.Separator />
</Steps.Item>
```

### Custom Content in Steps

**v2:**
```jsx
<Step>
  <StepIndicator>
    <StepStatus
      complete={<CheckCircleIcon />}
      incomplete={<Box w="8px" h="8px" bg="gray.300" borderRadius="full" />}
      active={<Spinner size="sm" />}
    />
  </StepIndicator>

  <Box>
    <StepTitle fontWeight="bold" fontSize="lg">
      {step.title}
    </StepTitle>
    <StepDescription color="gray.600" fontSize="sm">
      {step.description}
    </StepDescription>
    {step.isOptional && <Badge ml={2}>Optional</Badge>}
  </Box>

  <StepSeparator />
</Step>
```

**v3 with Custom Content:**
```jsx
<Steps.Item index={0}>
  <Steps.Indicator>
    <CheckCircleIcon />
  </Steps.Indicator>

  <Box>
    <Steps.Title fontWeight="bold" fontSize="lg">
      Account Setup
    </Steps.Title>
    <Text fontSize="sm" color="gray.600">
      Create your account credentials
    </Text>
    <Badge mt={1}>Optional</Badge>
  </Box>

  <Steps.Separator />
</Steps.Item>
```

### Step Content Areas (v3)

**Displaying Content Per Step:**
```jsx
<Steps.Root defaultStep={0} count={3}>
  <Steps.List>
    {steps.map((step, index) => (
      <Steps.Item key={index} index={index}>
        <Steps.Indicator />
        <Steps.Title>{step.title}</Steps.Title>
        <Steps.Separator />
      </Steps.Item>
    ))}
  </Steps.List>

  {/* Content for each step */}
  <Steps.Content index={0}>
    <FormControl>
      <FormLabel>Email</FormLabel>
      <Input type="email" />
    </FormControl>
  </Steps.Content>

  <Steps.Content index={1}>
    <FormControl>
      <FormLabel>Password</FormLabel>
      <Input type="password" />
    </FormControl>
  </Steps.Content>

  <Steps.Content index={2}>
    <Text>Review your information...</Text>
  </Steps.Content>

  <Steps.CompletedContent>
    <Alert status="success">
      <AlertIcon />
      Registration complete!
    </Alert>
  </Steps.CompletedContent>
</Steps.Root>
```

## 10. Navigation Patterns

### Manual Navigation (v2)

```jsx
import { Button, ButtonGroup, Flex } from '@chakra-ui/react'

function StepperWithNavigation() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const isLastStep = activeStep === steps.length - 1
  const isFirstStep = activeStep === 0

  const goToNext = () => {
    if (!isLastStep) setActiveStep(activeStep + 1)
  }

  const goToPrev = () => {
    if (!isFirstStep) setActiveStep(activeStep - 1)
  }

  return (
    <Flex direction="column" gap={4}>
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      {/* Step content */}
      <Box p={4} borderWidth={1} borderRadius="md">
        {steps[activeStep].content}
      </Box>

      {/* Navigation */}
      <ButtonGroup>
        <Button onClick={goToPrev} isDisabled={isFirstStep}>
          Previous
        </Button>
        <Button onClick={goToNext} isDisabled={isLastStep}>
          {isLastStep ? 'Finish' : 'Next'}
        </Button>
      </ButtonGroup>
    </Flex>
  )
}
```

### Built-in Navigation (v3)

```jsx
import { Button, Stack } from "@chakra-ui/react"

function StepsWithNavigation() {
  return (
    <Steps.Root defaultStep={0} count={steps.length}>
      <Steps.List>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Indicator />
            <Steps.Title>{step.title}</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      <Stack>
        {steps.map((step, index) => (
          <Steps.Content key={index} index={index}>
            <Box p={4} borderWidth={1} borderRadius="md">
              {step.content}
            </Box>
          </Steps.Content>
        ))}

        <Steps.CompletedContent>
          <Alert status="success">
            All steps completed!
          </Alert>
        </Steps.CompletedContent>

        <ButtonGroup>
          <Steps.PrevTrigger asChild>
            <Button variant="outline">Previous</Button>
          </Steps.PrevTrigger>
          <Steps.NextTrigger asChild>
            <Button>Next</Button>
          </Steps.NextTrigger>
        </ButtonGroup>
      </Stack>
    </Steps.Root>
  )
}
```

### Clickable Steps

**v2 (Custom Implementation):**
```jsx
function ClickableStepper() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  return (
    <Stepper index={activeStep}>
      {steps.map((step, index) => (
        <Step key={index} onClick={() => setActiveStep(index)} cursor="pointer">
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <Box flexShrink='0'>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  )
}
```

**v3 (Built-in Support):**
```jsx
<Steps.Root defaultStep={0} count={steps.length}>
  <Steps.List>
    {steps.map((step, index) => (
      <Steps.Item key={index} index={index}>
        <Steps.Trigger>
          <Steps.Indicator />
          <Steps.Title>{step.title}</Steps.Title>
        </Steps.Trigger>
        <Steps.Separator />
      </Steps.Item>
    ))}
  </Steps.List>
</Steps.Root>
```

### Controlled Navigation

**v2:**
```jsx
function ControlledStepper() {
  const [step, setStep] = useState(0)

  return (
    <>
      <Stepper index={step}>
        {/* steps */}
      </Stepper>

      <Button onClick={() => setStep(2)}>
        Jump to Step 3
      </Button>
    </>
  )
}
```

**v3:**
```jsx
function ControlledSteps() {
  const [step, setStep] = useState(0)

  return (
    <>
      <Steps.Root
        step={step}
        onStepChange={(details) => setStep(details.step)}
        count={steps.length}
      >
        {/* steps */}
      </Steps.Root>

      <Button onClick={() => setStep(2)}>
        Jump to Step 3
      </Button>
    </>
  )
}
```

## 11. Progress Patterns

### Progress Indicator Integration (v2)

```jsx
import { Progress } from '@chakra-ui/react'

function StepperWithProgress() {
  const { activeStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const progress = ((activeStep + 1) / steps.length) * 100

  return (
    <Box>
      <Progress
        value={progress}
        size="sm"
        colorScheme="green"
        mb={4}
      />

      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Text mt={2} fontSize="sm" color="gray.600">
        Step {activeStep + 1} of {steps.length} ({Math.round(progress)}% complete)
      </Text>
    </Box>
  )
}
```

### Custom Separator with Progress (v2)

```jsx
function StepperWithProgressSeparator() {
  const { activeStep } = useSteps({
    index: 1,
    count: steps.length,
  })

  return (
    <Stepper index={activeStep}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink='0'>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator
            sx={{
              '&[data-status=complete]': {
                background: 'green.500',
              },
            }}
          />
        </Step>
      ))}
    </Stepper>
  )
}
```

### Step Completion Tracking

**v2:**
```jsx
function StepperWithCompletion() {
  const [completedSteps, setCompletedSteps] = useState([])
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const markStepComplete = (stepIndex) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex])
    }
  }

  const goToNext = () => {
    markStepComplete(activeStep)
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  return (
    <Box>
      <Stepper index={activeStep}>
        {steps.map((step, index) => {
          const isComplete = completedSteps.includes(index)

          return (
            <Step key={index}>
              <StepIndicator
                bg={isComplete ? 'green.500' : undefined}
                borderColor={isComplete ? 'green.500' : undefined}
              >
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box flexShrink='0'>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>
              <StepSeparator />
            </Step>
          )
        })}
      </Stepper>

      <Button onClick={goToNext} mt={4}>
        Complete & Continue
      </Button>

      <Text mt={2} fontSize="sm">
        {completedSteps.length} of {steps.length} steps completed
      </Text>
    </Box>
  )
}
```

## 12. Color Scheme / Palette Patterns

### v2 Color Schemes

```jsx
// Using colorScheme prop
<Stepper index={activeStep} colorScheme="purple">
  {/* steps */}
</Stepper>

// Multiple color options
<Stack spacing={8}>
  <Stepper colorScheme="blue" index={1}>
    {/* Blue themed stepper */}
  </Stepper>

  <Stepper colorScheme="green" index={1}>
    {/* Green themed stepper */}
  </Stepper>

  <Stepper colorScheme="red" index={1}>
    {/* Red themed stepper */}
  </Stepper>

  <Stepper colorScheme="purple" index={1}>
    {/* Purple themed stepper */}
  </Stepper>
</Stack>
```

**Affects:**
- Active step indicator background
- Completed step indicator background
- Step separator color when complete
- Step icon color

### v3 Color Palettes

```jsx
// Using colorPalette prop
<Steps.Root defaultStep={1} count={3} colorPalette="purple">
  <Steps.List>
    {/* steps */}
  </Steps.List>
</Steps.Root>

// Available color palettes
<Stack spacing={8}>
  <Steps.Root colorPalette="gray" defaultStep={1} count={3}>
    {/* Gray palette (default) */}
  </Steps.Root>

  <Steps.Root colorPalette="red" defaultStep={1} count={3}>
    {/* Red palette */}
  </Steps.Root>

  <Steps.Root colorPalette="blue" defaultStep={1} count={3}>
    {/* Blue palette */}
  </Steps.Root>

  <Steps.Root colorPalette="green" defaultStep={1} count={3}>
    {/* Green palette */}
  </Steps.Root>
</Stack>
```

**Color Palette Integration:**
- Uses CSS custom properties: `--chakra-colors-color-palette-*`
- Supports all Chakra UI color scales
- Automatic dark mode adaptation
- Consistent with v3's design token system

## 13. Accessibility

### Built-in Accessibility Features

**v2 & v3 Common Features:**
- Semantic HTML structure
- Keyboard navigation support (Tab key)
- Focus management with visible focus indicators
- ARIA attributes for screen readers

### Keyboard Navigation

**Tab Navigation:**
- Tab key moves focus between interactive elements
- In clickable steps, Tab navigates to each step
- Navigation buttons are keyboard accessible

**Custom Keyboard Shortcuts (v2):**
```jsx
function AccessibleStepper() {
  const { activeStep, nextStep, prevStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextStep()
      if (e.key === 'ArrowLeft') prevStep()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextStep, prevStep])

  return (
    <Stepper index={activeStep}>
      {/* steps */}
    </Stepper>
  )
}
```

### ARIA Attributes

**v3 Automatic ARIA Support:**
```html
<!-- Generated HTML structure -->
<div role="group" aria-label="Progress steps">
  <button
    role="tab"
    aria-selected="true"
    aria-controls="step-content-0"
    data-selected
  >
    <div>1</div>
    <span>Step 1</span>
  </button>
</div>
```

**v2 Manual ARIA Enhancement:**
```jsx
<Stepper index={activeStep} aria-label="Registration progress">
  {steps.map((step, index) => (
    <Step
      key={index}
      aria-current={index === activeStep ? 'step' : undefined}
    >
      <StepIndicator aria-label={`Step ${index + 1}: ${step.title}`}>
        <StepStatus
          complete={<StepIcon aria-label="Completed" />}
          incomplete={<StepNumber />}
          active={<StepNumber />}
        />
      </StepIndicator>
      <Box flexShrink='0'>
        <StepTitle>{step.title}</StepTitle>
        <StepDescription>{step.description}</StepDescription>
      </Box>
      <StepSeparator />
    </Step>
  ))}
</Stepper>
```

### Screen Reader Announcements

**v2 with Live Regions:**
```jsx
function AccessibleStepperWithAnnouncements() {
  const { activeStep, nextStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const [announcement, setAnnouncement] = useState('')

  const handleNext = () => {
    nextStep()
    setAnnouncement(`Moving to step ${activeStep + 2}: ${steps[activeStep + 1].title}`)
  }

  return (
    <>
      {/* Live region for screen readers */}
      <VisuallyHidden>
        <div role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      </VisuallyHidden>

      <Stepper index={activeStep}>
        {/* steps */}
      </Stepper>

      <Button onClick={handleNext}>
        Next
      </Button>
    </>
  )
}
```

### Focus Management

**v3 Focus Indicators:**
```jsx
<Steps.Root defaultStep={0} count={3}>
  <Steps.List>
    {steps.map((step, index) => (
      <Steps.Item key={index} index={index}>
        <Steps.Trigger
          sx={{
            _focus: {
              outline: '2px solid',
              outlineColor: 'blue.500',
              outlineOffset: '2px',
            },
          }}
        >
          <Steps.Indicator />
          <Steps.Title>{step.title}</Steps.Title>
        </Steps.Trigger>
        <Steps.Separator />
      </Steps.Item>
    ))}
  </Steps.List>
</Steps.Root>
```

### Best Practices

**Label Steps Clearly:**
```jsx
// Good - descriptive labels
<StepTitle>Create Account</StepTitle>
<StepDescription>Enter your email and password</StepDescription>

// Bad - vague labels
<StepTitle>Step 1</StepTitle>
```

**Provide Progress Information:**
```jsx
<Box>
  <Text fontSize="sm" mb={2} aria-live="polite">
    Step {activeStep + 1} of {steps.length}
  </Text>
  <Stepper index={activeStep} aria-label="Form progress">
    {/* steps */}
  </Stepper>
</Box>
```

**Indicate Required vs Optional Steps:**
```jsx
<StepTitle>
  Payment Information
  <Badge ml={2} colorScheme="red">Required</Badge>
</StepTitle>

<StepTitle>
  Newsletter Signup
  <Badge ml={2} colorScheme="gray">Optional</Badge>
</StepTitle>
```

## 14. Integration Patterns

### Form Integration (Multi-Step Forms)

**v2 with React Hook Form:**
```jsx
import { useForm } from 'react-hook-form'
import { Button, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'

function MultiStepForm() {
  const { activeStep, nextStep, prevStep } = useSteps({
    index: 0,
    count: 3,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm()

  const handleNext = async () => {
    // Validate current step before proceeding
    const isValid = await trigger()
    if (isValid) {
      nextStep()
    }
  }

  const onSubmit = (data) => {
    console.log('Form data:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stepper index={activeStep} mb={4}>
        <Step>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <Box flexShrink='0'>
            <StepTitle>Account</StepTitle>
          </Box>
          <StepSeparator />
        </Step>

        <Step>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <Box flexShrink='0'>
            <StepTitle>Profile</StepTitle>
          </Box>
          <StepSeparator />
        </Step>

        <Step>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <Box flexShrink='0'>
            <StepTitle>Confirm</StepTitle>
          </Box>
          <StepSeparator />
        </Step>
      </Stepper>

      {activeStep === 0 && (
        <FormControl isInvalid={errors.email}>
          <FormLabel>Email</FormLabel>
          <Input {...register('email', { required: 'Email is required' })} />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
      )}

      {activeStep === 1 && (
        <FormControl isInvalid={errors.name}>
          <FormLabel>Name</FormLabel>
          <Input {...register('name', { required: 'Name is required' })} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
      )}

      {activeStep === 2 && (
        <Box>
          <Text>Please review your information</Text>
        </Box>
      )}

      <ButtonGroup mt={4}>
        <Button onClick={prevStep} isDisabled={activeStep === 0}>
          Previous
        </Button>
        {activeStep < 2 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button type="submit" colorScheme="blue">Submit</Button>
        )}
      </ButtonGroup>
    </form>
  )
}
```

**v3 with Built-in Content Management:**
```jsx
import { useForm } from 'react-hook-form'

function MultiStepFormV3() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log('Form submitted:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Steps.Root defaultStep={0} count={3}>
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Indicator />
            <Steps.Title>Account</Steps.Title>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={1}>
            <Steps.Indicator />
            <Steps.Title>Profile</Steps.Title>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={2}>
            <Steps.Indicator />
            <Steps.Title>Confirm</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
        </Steps.List>

        <Steps.Content index={0}>
          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input {...register('email', { required: true })} />
            <FormErrorMessage>Email is required</FormErrorMessage>
          </FormControl>
        </Steps.Content>

        <Steps.Content index={1}>
          <FormControl isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input {...register('name', { required: true })} />
            <FormErrorMessage>Name is required</FormErrorMessage>
          </FormControl>
        </Steps.Content>

        <Steps.Content index={2}>
          <Alert status="info">
            <AlertIcon />
            Review your information before submitting
          </Alert>
        </Steps.Content>

        <Steps.CompletedContent>
          <Alert status="success">
            <AlertIcon />
            Form submitted successfully!
          </Alert>
        </Steps.CompletedContent>

        <ButtonGroup mt={4}>
          <Steps.PrevTrigger asChild>
            <Button variant="outline">Previous</Button>
          </Steps.PrevTrigger>
          <Steps.NextTrigger asChild>
            <Button>Next</Button>
          </Steps.NextTrigger>
        </ButtonGroup>
      </Steps.Root>
    </form>
  )
}
```

### Wizard Integration

**v2 Wizard Pattern:**
```jsx
function WizardWithStepper() {
  const [formData, setFormData] = useState({})
  const { activeStep, nextStep, prevStep, reset } = useSteps({
    index: 0,
    count: 4,
  })

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFinish = () => {
    console.log('Final data:', formData)
    // Submit to server
    reset()
  }

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <Stepper index={activeStep} mb={8}>
        {['Personal', 'Contact', 'Address', 'Review'].map((title, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>{title}</StepTitle>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Box minH="300px" p={6} borderWidth={1} borderRadius="lg">
        {activeStep === 0 && <PersonalInfoForm data={formData} onChange={updateFormData} />}
        {activeStep === 1 && <ContactInfoForm data={formData} onChange={updateFormData} />}
        {activeStep === 2 && <AddressForm data={formData} onChange={updateFormData} />}
        {activeStep === 3 && <ReviewStep data={formData} />}
      </Box>

      <ButtonGroup mt={4} w="100%" justifyContent="space-between">
        <Button onClick={prevStep} isDisabled={activeStep === 0}>
          Back
        </Button>
        {activeStep < 3 ? (
          <Button onClick={nextStep} colorScheme="blue">
            Continue
          </Button>
        ) : (
          <Button onClick={handleFinish} colorScheme="green">
            Finish
          </Button>
        )}
      </ButtonGroup>
    </Box>
  )
}
```

### Modal/Dialog Integration

**v2 Stepper in Modal:**
```jsx
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react'

function ModalWithStepper({ isOpen, onClose }) {
  const { activeStep, nextStep, prevStep, reset } = useSteps({
    index: 0,
    count: 3,
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Setup Wizard</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stepper index={activeStep} mb={4}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <Box flexShrink='0'>
                  <StepTitle>{step.title}</StepTitle>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          <Box minH="200px">
            {steps[activeStep].content}
          </Box>

          <ButtonGroup mt={4} w="100%" justifyContent="space-between">
            <Button onClick={prevStep} isDisabled={activeStep === 0}>
              Previous
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button onClick={nextStep} colorScheme="blue">
                Next
              </Button>
            ) : (
              <Button onClick={handleClose} colorScheme="green">
                Finish
              </Button>
            )}
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
```

### Tabs Integration Pattern

**Combined Tabs and Stepper (v2):**
```jsx
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'

function TabsWithStepper() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 3,
  })

  return (
    <Box>
      <Stepper index={activeStep} mb={4}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Tabs index={activeStep} onChange={setActiveStep}>
        <TabList display="none">
          {steps.map((step, index) => (
            <Tab key={index}>{step.title}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {steps.map((step, index) => (
            <TabPanel key={index}>
              {step.content}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  )
}
```

## 15. Advanced Patterns

### Dynamic Step Generation

**v2:**
```jsx
function DynamicStepper() {
  const [steps, setSteps] = useState([
    { id: 1, title: 'Step 1', description: 'First step' },
    { id: 2, title: 'Step 2', description: 'Second step' },
  ])

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const addStep = () => {
    const newStep = {
      id: steps.length + 1,
      title: `Step ${steps.length + 1}`,
      description: `Description ${steps.length + 1}`,
    }
    setSteps([...steps, newStep])
  }

  const removeStep = (id) => {
    const newSteps = steps.filter(step => step.id !== id)
    setSteps(newSteps)
    if (activeStep >= newSteps.length) {
      setActiveStep(newSteps.length - 1)
    }
  }

  return (
    <Box>
      <Button onClick={addStep} mb={4} size="sm">
        Add Step
      </Button>

      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={step.id}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
```

### Conditional Steps

**v2 with Step Skipping:**
```jsx
function ConditionalStepper() {
  const [includeOptionalStep, setIncludeOptionalStep] = useState(false)

  const allSteps = [
    { title: 'Basic Info', required: true },
    { title: 'Optional Details', required: false },
    { title: 'Review', required: true },
  ]

  const visibleSteps = includeOptionalStep
    ? allSteps
    : allSteps.filter(step => step.required)

  const { activeStep, nextStep, prevStep } = useSteps({
    index: 0,
    count: visibleSteps.length,
  })

  return (
    <Box>
      <Checkbox
        isChecked={includeOptionalStep}
        onChange={(e) => setIncludeOptionalStep(e.target.checked)}
        mb={4}
      >
        Include optional step
      </Checkbox>

      <Stepper index={activeStep}>
        {visibleSteps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <ButtonGroup mt={4}>
        <Button onClick={prevStep} isDisabled={activeStep === 0}>
          Previous
        </Button>
        <Button onClick={nextStep} isDisabled={activeStep === visibleSteps.length - 1}>
          Next
        </Button>
      </ButtonGroup>
    </Box>
  )
}
```

### Step Validation

**v2 with Validation State:**
```jsx
function ValidatedStepper() {
  const [validatedSteps, setValidatedSteps] = useState([])
  const [errors, setErrors] = useState({})

  const { activeStep, nextStep, prevStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const validateStep = (stepIndex) => {
    // Custom validation logic
    const isValid = /* validation logic */

    if (isValid) {
      setValidatedSteps([...validatedSteps, stepIndex])
      setErrors(prev => ({ ...prev, [stepIndex]: null }))
      return true
    } else {
      setErrors(prev => ({ ...prev, [stepIndex]: 'Please complete all required fields' }))
      return false
    }
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      nextStep()
    }
  }

  return (
    <Box>
      <Stepper index={activeStep}>
        {steps.map((step, index) => {
          const isValidated = validatedSteps.includes(index)
          const hasError = errors[index]

          return (
            <Step key={index}>
              <StepIndicator
                borderColor={hasError ? 'red.500' : undefined}
              >
                <StepStatus
                  complete={isValidated ? <CheckIcon color="green.500" /> : <StepIcon />}
                  incomplete={hasError ? <WarningIcon color="red.500" /> : <StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box flexShrink='0'>
                <StepTitle color={hasError ? 'red.500' : undefined}>
                  {step.title}
                </StepTitle>
                {hasError && (
                  <Text fontSize="xs" color="red.500">
                    {hasError}
                  </Text>
                )}
              </Box>
              <StepSeparator />
            </Step>
          )
        })}
      </Stepper>

      <ButtonGroup mt={4}>
        <Button onClick={prevStep} isDisabled={activeStep === 0}>
          Previous
        </Button>
        <Button onClick={handleNext} isDisabled={activeStep === steps.length - 1}>
          Next
        </Button>
      </ButtonGroup>
    </Box>
  )
}
```

### External State Management (v3)

**Using RootProvider for External Access:**
```jsx
import { Steps, useStepsContext } from "@chakra-ui/react"

function ExternalControls() {
  const steps = useStepsContext()

  return (
    <Box>
      <Text mb={2}>Current Step: {steps.step + 1}</Text>
      <ButtonGroup size="sm">
        <Button onClick={() => steps.setStep(0)}>Reset</Button>
        <Button onClick={() => steps.setStep(2)}>Jump to Step 3</Button>
      </ButtonGroup>
    </Box>
  )
}

function StepsWithExternalControl() {
  return (
    <Steps.RootProvider defaultStep={0} count={3}>
      <ExternalControls />

      <Steps.List>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Indicator />
            <Steps.Title>{step.title}</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      <Stack>
        {steps.map((step, index) => (
          <Steps.Content key={index} index={index}>
            {step.content}
          </Steps.Content>
        ))}
      </Stack>
    </Steps.RootProvider>
  )
}
```

### Async Step Transitions

**v2 with Async Operations:**
```jsx
function AsyncStepper() {
  const [isLoading, setIsLoading] = useState(false)
  const { activeStep, nextStep, prevStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const handleNext = async () => {
    setIsLoading(true)
    try {
      // Simulate API call or async operation
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validation or data processing
      const success = await validateCurrentStep()

      if (success) {
        nextStep()
      }
    } catch (error) {
      console.error('Step transition failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box>
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={isLoading ? <Spinner size="sm" /> : <StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <ButtonGroup mt={4}>
        <Button onClick={prevStep} isDisabled={activeStep === 0 || isLoading}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          isLoading={isLoading}
          isDisabled={activeStep === steps.length - 1}
        >
          Next
        </Button>
      </ButtonGroup>
    </Box>
  )
}
```

### Branching Steps (Non-linear Flow)

**v2 with Conditional Navigation:**
```jsx
function BranchingStepper() {
  const [userType, setUserType] = useState(null)
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 5,
  })

  const getNextStep = (current) => {
    if (current === 1) {
      // Branch based on user selection
      return userType === 'business' ? 3 : 2
    }
    return current + 1
  }

  const handleNext = () => {
    const nextStep = getNextStep(activeStep)
    setActiveStep(nextStep)
  }

  return (
    <Box>
      <Stepper index={activeStep}>
        <Step>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <Box flexShrink='0'>
            <StepTitle>User Type</StepTitle>
          </Box>
          <StepSeparator />
        </Step>

        {userType === 'personal' && (
          <Step>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>Personal Info</StepTitle>
            </Box>
            <StepSeparator />
          </Step>
        )}

        {userType === 'business' && (
          <Step>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>Business Info</StepTitle>
            </Box>
            <StepSeparator />
          </Step>
        )}

        <Step>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <Box flexShrink='0'>
            <StepTitle>Review</StepTitle>
          </Box>
          <StepSeparator />
        </Step>
      </Stepper>

      {activeStep === 1 && (
        <RadioGroup onChange={setUserType} value={userType}>
          <Stack>
            <Radio value="personal">Personal Account</Radio>
            <Radio value="business">Business Account</Radio>
          </Stack>
        </RadioGroup>
      )}

      <Button onClick={handleNext} mt={4} isDisabled={activeStep === 1 && !userType}>
        Next
      </Button>
    </Box>
  )
}
```

## 16. Notes

### Important Observations

1. **v2 to v3 Migration Complexity**: The architectural shift from v2 to v3 is significant. There are no automated codemods, requiring manual refactoring of all stepper implementations.

2. **Ark UI Foundation**: v3's Steps component is built on Ark UI, bringing statechart-based state management and improved consistency across frameworks. This provides better reliability but requires understanding a new component architecture.

3. **Content Management**: v3 introduces built-in content management through `Steps.Content` and `Steps.CompletedContent`, which simplifies implementation compared to v2's external content handling.

4. **Navigation Components**: v3 provides `Steps.NextTrigger` and `Steps.PrevTrigger` components, eliminating the need for custom navigation implementation common in v2.

5. **State Access**: v3's `RootProvider` and `useStepsContext` pattern allows external components to access and control stepper state, which is more elegant than v2's approach.

6. **Accessibility Improvements**: v3 has better built-in accessibility through Ark UI's foundation, with automatic ARIA attributes and proper role management.

7. **Separator Behavior**: v3 automatically hides the separator on the last step, while v2 requires manual handling or accepts the visual redundancy.

8. **Clickable Steps**: v3 provides `Steps.Trigger` for clickable steps out of the box, while v2 requires custom implementation with click handlers.

9. **TypeScript Support**: Both versions have TypeScript support, but v3's component composition provides better type inference for component parts.

10. **CSS Architecture**: v3 uses CSS custom properties and slot recipes for theming, aligning with the modern Chakra v3 theming system. v2 uses the traditional `colorScheme` prop with theme objects.

11. **Bundle Size**: v3's composable nature makes it more tree-shakeable, potentially reducing bundle size when only certain features are needed.

12. **Learning Curve**: v2 has a gentler learning curve with its simpler API. v3 requires understanding compound components and the Ark UI patterns.

### Community Resources

**Third-Party Alternatives:**
- **chakra-ui-steps** (npm package): Popular community package for v2 with additional features like clickable steps, custom icons, and enhanced styling options. Available at https://chakra-ui-steps.vercel.app/
- **SaasUI Stepper**: Alternative implementation with additional enterprise features

**Migration Considerations:**
- Plan for significant refactoring time when migrating from v2 to v3
- Consider creating wrapper components to maintain v2-like DX while using v3 internally
- Test thoroughly as state management behavior differs between versions
- Review all custom styling as CSS architecture changed significantly

### Best Practices Summary

1. **Use appropriate version for project stage**: v2 for stable, existing projects; v3 for new projects embracing modern patterns
2. **Prefer uncontrolled components** unless state synchronization is needed
3. **Validate steps before progression** in form wizards
4. **Provide clear progress indicators** for accessibility
5. **Consider vertical orientation** for content-heavy steps
6. **Use built-in navigation components** in v3 rather than custom implementations
7. **Implement proper keyboard navigation** for accessibility
8. **Provide screen reader announcements** for step changes
9. **Use color palette/scheme appropriately** for branding consistency
10. **Test across devices** especially for vertical orientation layouts

### Framework Integration Notes

- **React Hook Form**: Works well with both versions; v3's content system simplifies integration
- **Formik**: Similar integration patterns to React Hook Form
- **Next.js**: Both versions work in Next.js; ensure proper client-side rendering for v3
- **TypeScript**: Both versions have excellent TypeScript support
- **Storybook**: v3 has official Storybook stories in the repository

---

**Research Date**: 2025-11-05
**Chakra UI Versions Analyzed**: v2.x (Stepper) and v3.x (Steps)
**Documentation Sources**:
- Official Chakra UI v2 documentation: https://v2.chakra-ui.com/docs/components/stepper
- Official Chakra UI v3 documentation: https://chakra-ui.com/docs/components/steps
- Chakra UI Examples: https://chakra.iheartcomponents.com/navigation/stepper
- Community resources and GitHub discussions
- Ark UI documentation (v3 foundation)
