# Stepper / Wizard - MUI Usage Patterns

> **Framework**: MUI (Material-UI)
> **Component**: Stepper
> **Documentation**: https://mui.com/material-ui/react-stepper/
> **Research Date**: 2025-11-06

## Component Definition

The Stepper component in Material UI provides a visual representation of steps in a process or workflow. It guides users through sequential or branching processes by displaying progress and allowing navigation between steps. Steppers are particularly useful for multi-step forms, onboarding flows, checkout processes, and any task that requires users to complete actions in a specific sequence.

MUI implements steppers as a **component system** with multiple related sub-components working together:
- **Stepper**: Container component managing the step sequence and layout
- **Step**: Individual step wrapper that holds step content
- **StepLabel**: Displays step title, status indicator, and optional description
- **StepButton**: Interactive step label that users can click to navigate
- **StepContent**: Container for expandable/collapsible step-specific content (vertical steppers)
- **StepIcon**: Visual indicator showing step completion status
- **StepConnector**: Visual line connecting steps
- **MobileStepper**: Simplified stepper variant optimized for mobile devices

The mental model is **declarative step definition**: developers declare the steps and their states, and MUI handles the visual representation, connector lines, and state styling automatically.

## Core Features

### Multi-Component Architecture

MUI's Stepper is not a single component but a coordinated system of components. Each component has a specific responsibility:
- The `Stepper` container manages overall layout and orientation
- Each `Step` wraps individual step content
- `StepLabel` or `StepButton` provides the visual label and icon
- `StepContent` (vertical only) contains collapsible content
- Custom `connector` and `StepIconComponent` enable visual customization

### Orientation Modes

**Horizontal Stepper** (default):
- Steps displayed left-to-right
- Ideal when contents of one step depend on an earlier step
- Good for desktop experiences with ample horizontal space
- Connectors appear as horizontal lines between steps

**Vertical Stepper**:
- Steps stacked vertically with expandable content areas
- Designed for narrow screen sizes and mobile devices
- Uses `StepContent` for collapsible step details
- Connectors appear as vertical lines along the left side
- All features of horizontal stepper can be implemented vertically

### Navigation Patterns

**Linear Stepper** (default):
- Users must complete steps sequentially
- Cannot skip ahead without completing current step
- Enforces a strict step-by-step workflow
- Typical for forms where each step validates before proceeding

**Non-Linear Stepper**:
- Enabled via `nonLinear` prop on `Stepper`
- Uses `StepButton` instead of `StepLabel` for clickable labels
- Users can jump between steps freely
- Developer must manage which steps are accessible
- Useful for settings, configuration, or review workflows

### Step States

Steps have multiple visual states:
- **Active**: Current step being viewed/edited
- **Completed**: Step has been finished successfully
- **Optional**: Step can be skipped (marked with "Optional" label)
- **Error**: Step has validation errors or issues
- **Disabled**: Step cannot be accessed
- **Skipped**: Optional step that was bypassed

### Mobile-Optimized Variant

**MobileStepper**: A separate component designed specifically for mobile devices with three variants:
- **Text**: Shows "Step X of Y" as text
- **Dots**: Shows progress as a series of dots
- **Progress**: Linear progress bar showing completion percentage
- Includes built-in back/next navigation buttons
- Compact design suitable for small screens

## Props API

### Stepper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeStep` | `number` | `0` | The active step index (zero-based). Controls which step is currently highlighted. |
| `alternativeLabel` | `bool` | `false` | If true, labels are placed below the step icon instead of to the right (horizontal) or below (vertical). |
| `children` | `node` | - | The content of the stepper, typically a collection of `Step` components. |
| `classes` | `object` | - | Override or extend the styles applied to the component. |
| `component` | `elementType` | - | The component used for the root node. Either a string to use an HTML element or a component. |
| `connector` | `element` | `<StepConnector />` | Custom connector element to display between steps. |
| `nonLinear` | `bool` | `false` | If true, the stepper supports non-linear navigation (users can jump between steps). |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The stepper orientation layout. |
| `sx` | `object` | - | System prop for styling with theme-aware style objects. |

**CSS Classes Applied**:
- `.MuiStepper-root`: Root element
- `.MuiStepper-horizontal`: Applied when `orientation="horizontal"`
- `.MuiStepper-vertical`: Applied when `orientation="vertical"`
- `.MuiStepper-alternativeLabel`: Applied when `alternativeLabel={true}`

### Step Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `bool` | `false` | If true, the step is marked as active. Usually controlled by parent Stepper's `activeStep`. |
| `children` | `node` | - | The content of the step, typically `StepLabel` or `StepButton`, and optionally `StepContent`. |
| `classes` | `object` | - | Override or extend the styles applied to the component. |
| `completed` | `bool` | `false` | If true, marks the step as completed. For optional skipped steps, set to `false`. |
| `component` | `elementType` | - | The component used for the root node. |
| `disabled` | `bool` | `false` | If true, the step is disabled and cannot be interacted with. |
| `expanded` | `bool` | `false` | If true, expands the step content (used with `StepContent` in vertical steppers). |
| `index` | `number` | - | The position of the step. Automatically provided by parent Stepper. |
| `last` | `bool` | - | If true, indicates this is the last step. Automatically provided by parent Stepper. |
| `sx` | `object` | - | System prop for styling. |

**CSS Classes Applied**:
- `.MuiStep-root`: Root element
- `.MuiStep-horizontal`: Applied when parent uses horizontal orientation
- `.MuiStep-vertical`: Applied when parent uses vertical orientation
- `.MuiStep-alternativeLabel`: Applied when parent uses alternative label
- `.MuiStep-completed`: Applied when step is completed

### StepLabel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `node` | - | The label text content displayed for the step. |
| `classes` | `object` | - | Override or extend the styles applied to the component. |
| `componentsProps` | `object` | - | Props applied to the StepIcon element. |
| `error` | `bool` | `false` | If true, the step label is marked as having an error. |
| `icon` | `node` | - | Override the default step icon. |
| `optional` | `node` | - | Optional node to display (typically `<Typography variant="caption">Optional</Typography>`). |
| `slotProps` | `object` | - | Props for component slots. |
| `slots` | `object` | - | Component slots for customization. |
| `StepIconComponent` | `elementType` | - | Custom component to render in place of the default StepIcon. |
| `StepIconProps` | `object` | - | Props applied to the StepIcon element. |
| `sx` | `object` | - | System prop for styling. |

**CSS Classes Applied**:
- `.MuiStepLabel-root`: Root element
- `.MuiStepLabel-horizontal`: Applied in horizontal stepper
- `.MuiStepLabel-vertical`: Applied in vertical stepper
- `.MuiStepLabel-alternativeLabel`: Applied when using alternative label
- `.MuiStepLabel-label`: The label text wrapper
- `.MuiStepLabel-iconContainer`: Container for the step icon
- `.Mui-active`: Applied when step is active
- `.Mui-completed`: Applied when step is completed
- `.Mui-disabled`: Applied when step is disabled
- `.Mui-error`: Applied when step has error state

### StepButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `node` | - | The content of the button, typically a `StepLabel`. |
| `classes` | `object` | - | Override or extend the styles applied to the component. |
| `icon` | `node` | - | The icon displayed by the step label. |
| `optional` | `node` | - | Optional node to display (e.g., "Optional" text). |
| `onClick` | `func` | - | Callback fired when the button is clicked. Signature: `function(event: object) => void` |
| `sx` | `object` | - | System prop for styling. |

Note: `StepButton` inherits most props from `StepLabel` and makes the step interactive/clickable.

### StepContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `node` | - | The content of the component (step details, form fields, etc.). |
| `classes` | `object` | - | Override or extend the styles applied to the component. |
| `TransitionComponent` | `elementType` | `Collapse` | The component used for the transition effect. |
| `transitionDuration` | `number \| { appear?: number, enter?: number, exit?: number } \| 'auto'` | `'auto'` | Adjust the duration of the content expand/collapse transition. |
| `TransitionProps` | `object` | - | Props applied to the transition element. |
| `sx` | `object` | - | System prop for styling. |

### MobileStepper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeStep` | `number` | `0` | The active step index (zero-based). |
| `backButton` | `node` | - | A back button element (typically a Button with back icon). |
| `classes` | `object` | - | Override or extend the styles applied to the component. |
| `LinearProgressProps` | `object` | - | Props applied to the LinearProgress element (progress variant only). |
| `nextButton` | `node` | - | A next button element (typically a Button with next icon). |
| `position` | `'bottom' \| 'static' \| 'top'` | `'bottom'` | Position of the mobile stepper on screen. |
| `steps` | `number` | - | **Required**. The total number of steps. |
| `sx` | `object` | - | System prop for styling. |
| `variant` | `'dots' \| 'progress' \| 'text'` | `'dots'` | The variant to use for displaying progress. |

## Usage Patterns

### Pattern 1: Basic Horizontal Linear Stepper

**Use case**: Sequential multi-step form where users complete steps in order.

**Implementation**: Use `Stepper` with `Step` and `StepLabel` components. Track active step in state. Provide Next/Back buttons to navigate.

```jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
```

### Pattern 2: Vertical Stepper with Content

**Use case**: Mobile-friendly stepper where each step has detailed content that expands/collapses.

**Implementation**: Use `orientation="vertical"` and `StepContent` for expandable step details.

```jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = [
  {
    label: 'Select campaign settings',
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions.`,
  },
  {
    label: 'Create an ad group',
    description: 'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Create an ad',
    description: `Try out different ad text to see what brings in the most customers.`,
  },
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Box sx={{ mt: 2 }}>
          <Typography>All steps completed</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Box>
      )}
    </Box>
  );
}
```

### Pattern 3: Non-Linear Stepper (Clickable Steps)

**Use case**: Configuration wizard where users can jump between steps to review/edit.

**Implementation**: Use `nonLinear` prop and `StepButton` instead of `StepLabel` for clickable steps.

```jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export default function NonLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
```

### Pattern 4: Optional Steps

**Use case**: Wizard where some steps can be skipped without affecting completion.

**Implementation**: Add `optional` prop with descriptive node to `StepLabel`. Manage skipped state manually.

```jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export default function OptionalStepStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === 1; // Second step is optional
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
```

### Pattern 5: Alternative Label Placement

**Use case**: Wide stepper where labels should appear below icons for better horizontal space usage.

**Implementation**: Add `alternativeLabel` prop to `Stepper`.

```jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = ['Select master blaster campaign settings', 'Create an ad group', 'Create an ad'];

export default function AlternativeLabelStepper() {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={1} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
```

### Pattern 6: Error State Handling

**Use case**: Form validation where a step needs to show error state.

**Implementation**: Use `error` prop on `StepLabel` to highlight failed validation.

```jsx
import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

export default function ErrorStepStepper() {
  const [activeStep, setActiveStep] = React.useState(1);
  const [hasError, setHasError] = React.useState(true);

  return (
    <Stepper activeStep={activeStep}>
      <Step>
        <StepLabel>Step 1</StepLabel>
      </Step>
      <Step>
        <StepLabel error={hasError}>Step 2 - Validation Error</StepLabel>
      </Step>
      <Step>
        <StepLabel>Step 3</StepLabel>
      </Step>
    </Stepper>
  );
}
```

### Pattern 7: Mobile Stepper with Dots

**Use case**: Mobile-optimized wizard with simple dot indicators.

**Implementation**: Use `MobileStepper` with `variant="dots"` for compact progress display.

```jsx
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function DotsMobileStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = 6;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant="dots"
      steps={maxSteps}
      position="static"
      activeStep={activeStep}
      sx={{ maxWidth: 400, flexGrow: 1 }}
      nextButton={
        <Button
          size="small"
          onClick={handleNext}
          disabled={activeStep === maxSteps - 1}
        >
          Next
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          Back
        </Button>
      }
    />
  );
}
```

### Pattern 8: Mobile Stepper with Progress Bar

**Use case**: Mobile wizard with many steps showing linear progress.

**Implementation**: Use `MobileStepper` with `variant="progress"`.

```jsx
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function ProgressMobileStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = 10;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant="progress"
      steps={maxSteps}
      position="static"
      activeStep={activeStep}
      sx={{ maxWidth: 400, flexGrow: 1 }}
      nextButton={
        <Button
          size="small"
          onClick={handleNext}
          disabled={activeStep === maxSteps - 1}
        >
          Next
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          Back
        </Button>
      }
    />
  );
}
```

### Pattern 9: Mobile Stepper with Text

**Use case**: Simple mobile wizard showing "Step X of Y" text.

**Implementation**: Use `MobileStepper` with `variant="text"`.

```jsx
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function TextMobileStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = 6;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant="text"
      steps={maxSteps}
      position="static"
      activeStep={activeStep}
      nextButton={
        <Button
          size="small"
          onClick={handleNext}
          disabled={activeStep === maxSteps - 1}
        >
          Next
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          Back
        </Button>
      }
    />
  );
}
```

### Pattern 10: Custom Icons

**Use case**: Stepper with custom icons for each step instead of numbered circles.

**Implementation**: Create custom `StepIcon` component and pass via `StepIconComponent` prop.

```jsx
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export default function CustomIconStepper() {
  return (
    <Stepper alternativeLabel activeStep={1}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
```

### Pattern 11: Custom Connector

**Use case**: Visually customized connector lines between steps.

**Implementation**: Create styled connector component and pass via `connector` prop.

```jsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import Check from '@mui/icons-material/Check';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export default function CustomConnectorStepper() {
  return (
    <Stepper alternativeLabel activeStep={1} connector={<QontoConnector />}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
```

## Variants and Composition

### Stepper Variants

**1. Horizontal Stepper**:
- Default layout orientation
- Steps arranged left-to-right
- Ideal for desktop and wide screens
- Good for 3-5 steps maximum
- Labels can be positioned beside or below icons

**2. Vertical Stepper**:
- Steps stacked vertically
- Includes expandable `StepContent` areas
- Mobile-friendly design
- Suitable for longer step descriptions
- Can accommodate more steps without horizontal space constraints

**3. MobileStepper**:
- Separate component optimized for mobile
- Three sub-variants: dots, text, progress
- Compact footprint
- Built-in navigation buttons
- Position can be static, top, or bottom

### Label Placement Variants

**Standard Labels** (`alternativeLabel={false}`):
- Horizontal: Labels appear to the right of icons
- Vertical: Labels appear below icons
- Default behavior

**Alternative Labels** (`alternativeLabel={true}`):
- Horizontal: Labels appear below icons, centered
- Better horizontal space distribution
- Good for longer step titles

### Navigation Variants

**Linear Navigation** (`nonLinear={false}`):
- Sequential step progression
- Users must complete current step before proceeding
- Use `StepLabel` for non-interactive labels
- Default behavior

**Non-Linear Navigation** (`nonLinear={true}`):
- Free-form step navigation
- Use `StepButton` for clickable step labels
- Developer manages which steps are accessible
- Good for review/edit workflows

### Component Composition

The stepper system is highly compositional:

```
Stepper
├── Step (multiple)
│   ├── StepLabel (or StepButton)
│   │   └── optional node
│   └── StepContent (vertical only)
│       └── custom content
└── Custom connector (optional)
```

## Accessibility

### Built-in ARIA Support

MUI Stepper automatically provides accessibility features:

**Semantic Structure**:
- Uses appropriate semantic HTML elements
- Stepper container has proper role attributes
- Steps have clear hierarchical structure

**Step Status Indicators**:
- Active step clearly identified
- Completed steps marked appropriately
- Error states announced
- Optional steps indicated

**Keyboard Navigation**:
- Interactive steps (StepButton) are keyboard accessible
- Tab navigation through clickable steps
- Enter/Space to activate step buttons
- Focus management handled automatically

**Screen Reader Support**:
- Step labels read aloud
- Current step position announced ("Step 2 of 5")
- Completion status conveyed
- Optional and error states communicated
- Icon-only steppers should include aria-label

### Accessibility Best Practices

**Provide Descriptive Labels**:
```jsx
<StepLabel>
  Select campaign settings
</StepLabel>
```

**Mark Optional Steps Clearly**:
```jsx
<StepLabel optional={<Typography variant="caption">Optional</Typography>}>
  Additional settings
</StepLabel>
```

**Error State Announcements**:
```jsx
<StepLabel error={true}>
  Payment information (Error: Invalid card)
</StepLabel>
```

**Custom Icons with Accessible Text**:
```jsx
<StepLabel
  StepIconComponent={CustomIcon}
  StepIconProps={{ 'aria-label': 'Settings step' }}
>
  Settings
</StepLabel>
```

**Mobile Stepper Buttons**:
```jsx
<Button aria-label="Go to next step">Next</Button>
<Button aria-label="Go to previous step">Back</Button>
```

### ARIA Attributes

MUI automatically applies:
- `aria-current="step"` for active step
- `aria-label` for step indicators
- `role="button"` for interactive steps
- `aria-disabled` for disabled steps
- `tabindex` management for keyboard navigation

### Focus Management

- Active step receives focus when navigating
- Tab order follows visual step order
- Focus visible indicators for keyboard users
- Non-linear steppers maintain focus on clicked step

### Color and Contrast

- Default theme provides sufficient contrast ratios
- Error states use color plus icon/text indicators
- Optional steps marked with text, not just color
- Custom themes should maintain WCAG AA compliance

## Responsive Design

### Breakpoint Adaptations

MUI Stepper responds to screen size changes:

**Desktop (md and up)**:
- Horizontal orientation recommended
- Standard or alternative label placement
- Full step labels visible
- Connector lines clearly visible

**Tablet (sm to md)**:
- Horizontal still usable with alternative labels
- Consider vertical orientation for many steps
- May need shorter step labels

**Mobile (xs to sm)**:
- Use `MobileStepper` component
- Or use vertical `Stepper` with `StepContent`
- Horizontal steppers with 3 or fewer steps
- Alternative labels for horizontal mobile steppers

### Responsive Patterns

**Adaptive Orientation**:
```jsx
import { useMediaQuery, useTheme } from '@mui/material';

function ResponsiveStepper() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stepper
      activeStep={activeStep}
      orientation={isMobile ? 'vertical' : 'horizontal'}
    >
      {/* steps */}
    </Stepper>
  );
}
```

**Mobile Stepper on Small Screens**:
```jsx
function AdaptiveStepper() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return <MobileStepper variant="dots" steps={5} activeStep={activeStep} />;
  }

  return (
    <Stepper activeStep={activeStep}>
      {/* steps */}
    </Stepper>
  );
}
```

**Responsive Label Length**:
```jsx
const steps = [
  { full: 'Select campaign settings', short: 'Settings' },
  { full: 'Create an ad group', short: 'Ad group' },
  { full: 'Create an ad', short: 'Ad' },
];

function ResponsiveLabels() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stepper activeStep={activeStep}>
      {steps.map((step) => (
        <Step key={step.full}>
          <StepLabel>{isMobile ? step.short : step.full}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
```

### Container Width

Steppers adapt to their container width:
- Horizontal steppers distribute steps evenly
- Alternative labels help with space constraints
- Vertical steppers constrain to container
- MobileStepper uses `maxWidth` for optimal size

## Theme Integration

### Theme Customization

MUI Stepper integrates fully with the theme system:

**Global Theme Overrides**:
```jsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-completed': {
            color: '#4caf50',
          },
          '&.Mui-active': {
            color: '#2196f3',
          },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: '#bdbdbd',
          borderTopWidth: 2,
        },
      },
    },
  },
});
```

**Default Props via Theme**:
```jsx
const theme = createTheme({
  components: {
    MuiStepper: {
      defaultProps: {
        alternativeLabel: true,
      },
    },
  },
});
```

### Component-Level Styling

**Using sx Prop**:
```jsx
<Stepper
  activeStep={activeStep}
  sx={{
    backgroundColor: 'background.paper',
    padding: 3,
    borderRadius: 2,
    boxShadow: 1,
  }}
>
  {/* steps */}
</Stepper>
```

**Styled Components**:
```jsx
import { styled } from '@mui/material/styles';

const CustomStepper = styled(Stepper)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));
```

### Color Palette Integration

Steppers use theme palette colors:
- Active steps: `primary.main`
- Completed steps: `primary.main`
- Inactive steps: `text.disabled`
- Error steps: `error.main`
- Connectors: `divider`

**Custom Colors**:
```jsx
<StepLabel
  sx={{
    '& .MuiStepLabel-label.Mui-active': {
      color: 'secondary.main',
    },
    '& .MuiStepLabel-label.Mui-completed': {
      color: 'success.main',
    },
  }}
>
  Custom colored label
</StepLabel>
```

### Dark Mode Support

MUI Stepper automatically adapts to theme mode:
```jsx
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Stepper activeStep={activeStep}>
        {/* steps automatically styled for dark mode */}
      </Stepper>
    </ThemeProvider>
  );
}
```

## Related Components

### Components Used With Stepper

**Button**: Navigation controls for Next/Back/Skip actions
- Used in step content navigation
- MobileStepper's nextButton and backButton props

**Typography**: Step labels and descriptions
- Step titles in StepLabel
- Optional step indicators
- Error messages
- Completion messages

**Box**: Layout container for stepper and content
- Wrapping stepper and step content
- Flexbox layout for navigation buttons
- Spacing and alignment control

**Dialog**: Modal wrapper for wizard flows
- Full-screen wizard dialogs
- Step-by-step configuration modals
- Onboarding flows

**Card**: Content container for steps
- Step details in vertical steppers
- Visual grouping of step content
- Elevation and borders

**Paper**: Alternative content wrapper
- Background for stepper
- Elevated step content areas

**LinearProgress**: Alternative progress indicator
- Used in MobileStepper progress variant
- Can supplement stepper for long operations

**Icons**: Step and navigation icons
- KeyboardArrowLeft, KeyboardArrowRight for navigation
- Check for completed steps
- Custom icons for step types
- Error and warning icons

### Similar/Alternative Components

**Tabs**: Alternative for non-sequential navigation
- Use when steps are not truly sequential
- Better for switching between views
- No inherent completion concept

**Timeline**: Alternative for process visualization
- Use for displaying past events
- Better for read-only process history
- Vertical only, no navigation

**Breadcrumbs**: Alternative for navigation hierarchy
- Use for page/section navigation
- Better for location awareness
- No completion status

**BottomNavigation**: Alternative for mobile navigation
- Use for app-level navigation
- Better for persistent navigation
- Not for sequential processes

### When to Use Stepper vs Alternatives

**Use Stepper When**:
- Process has clear sequential steps
- Need to show progress through a workflow
- Steps have dependencies (linear)
- Multi-step form or wizard
- Onboarding or setup flows
- Checkout or purchase processes

**Use Tabs When**:
- Content is equal priority
- No inherent order to sections
- Switching between views, not progressing
- All content equally accessible

**Use Timeline When**:
- Displaying historical events
- Read-only process visualization
- Chronological information
- No user interaction needed

## Framework-Specific Features

### MUI-Specific Implementation Details

**Component System Architecture**:
- Stepper, Step, StepLabel are separate components (not sub-components)
- Allows fine-grained composition and customization
- Props passed individually to each component
- Context-based state sharing between components

**State Management Pattern**:
- Stepper uses context to share state with children
- Active step determined by `activeStep` prop on Stepper
- Step completion managed via `completed` prop on Step
- No internal state management (fully controlled)

**Styling System**:
- Uses MUI's sx prop for inline styling
- Theme integration via createTheme
- Styled components via @mui/material/styles
- Class-based overrides via classes prop
- Supports both emotion and styled-components

**TypeScript Support**:
- Full TypeScript definitions included
- Prop types with strict typing
- Generic types for custom components
- Extensive JSDoc comments

### Buffer Variant (MUI-Specific)

MUI's MobileStepper progress variant uses a LinearProgress component underneath, which supports a buffer state (though this is not directly exposed in the MobileStepper API). This is unique to MUI's implementation.

### Connector Customization

MUI provides exceptional connector customization:
- Default StepConnector can be fully replaced
- Custom styled connectors via styled()
- Access to active/completed states in connector
- Alternative label mode adjusts connector positioning automatically

### StepIcon Customization

MUI's StepIcon system is highly flexible:
- Complete icon replacement via StepIconComponent
- Props passed to custom icons include: active, completed, error, icon
- Can render different icons per step
- Styled based on step state

### Integration with MUI Ecosystem

**Form Integration**:
- Works seamlessly with MUI form components
- TextField, Select, Checkbox in step content
- Form validation integrated with error states

**Layout Integration**:
- Container, Grid, Stack for step content layout
- Responsive breakpoints from theme
- Spacing system integration

**Animation System**:
- StepContent uses Collapse transition
- Customizable transition component
- Supports custom animation durations
- Smooth expand/collapse in vertical steppers

## Code Examples

### Complete Multi-Step Form Example

```jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const steps = ['Personal Information', 'Contact Details', 'Review & Submit'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return (
        <Box>
          <TextField fullWidth label="First Name" margin="normal" />
          <TextField fullWidth label="Last Name" margin="normal" />
          <TextField fullWidth label="Email" type="email" margin="normal" />
        </Box>
      );
    case 1:
      return (
        <Box>
          <TextField fullWidth label="Phone" margin="normal" />
          <TextField fullWidth label="Address" multiline rows={3} margin="normal" />
        </Box>
      );
    case 2:
      return <Typography>Review your information and submit the form.</Typography>;
    default:
      return 'Unknown step';
  }
}

export default function MultiStepForm() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Form submitted successfully!
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 2 }}>
            Submit Another Form
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 4 }}>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
```

### Import Statements

```jsx
// Main Stepper components
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import StepIcon from '@mui/material/StepIcon';
import StepConnector from '@mui/material/StepConnector';

// Mobile Stepper
import MobileStepper from '@mui/material/MobileStepper';

// Supporting components
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Icons for navigation
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

// Styling utilities
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
```

## Notes and Observations

### Design Philosophy

MUI's Stepper implementation follows Material Design guidelines closely. The component emphasizes clarity, simplicity, and progressive disclosure. The multi-component architecture (rather than a single monolithic component) provides exceptional flexibility while maintaining a consistent API.

### State Management Responsibility

Unlike some frameworks, MUI's Stepper is **fully controlled** - it does not manage its own state. Developers must explicitly:
- Track active step in component state
- Manage step completion status
- Handle navigation logic
- Implement validation
- Control when steps are accessible

This gives developers complete control but requires more implementation code.

### Composition Over Configuration

MUI favors composition over configuration props. Rather than a single component with many variant props, the Stepper system uses multiple components that compose together. This pattern enables:
- Mixing different step types in one stepper
- Granular control over individual steps
- Easy addition of custom behavior per step
- Clear separation of concerns

### Mobile-First Considerations

The separate MobileStepper component acknowledges that mobile steppers have fundamentally different requirements:
- Compact space usage
- Built-in navigation controls
- Simplified progress indicators
- Different interaction patterns

This design decision (separate component vs responsive prop) makes mobile optimization explicit.

### Vertical Stepper Design

The vertical stepper with StepContent creates an "accordion-like" experience where:
- Only active step content is visible
- Previous steps collapse but remain visible
- Next steps show labels but not content
- Natural scrolling behavior for long forms

This differs from horizontal steppers where all step content typically replaces the previous step entirely.

### Error Handling Pattern

Error states are visual-only by default. Developers must implement:
- Validation logic
- Error state management
- Error messages (StepLabel just shows red icon)
- Prevention of progression to next step

The error prop is purely presentational.

### Optional Steps Complexity

Optional steps require careful state management:
- Marking step as optional (visual indicator)
- Allowing skip functionality
- Setting `completed={false}` for skipped steps
- Tracking which steps were skipped
- Potentially different submission logic

The framework provides the visual pattern but not the skip logic.

### Performance Considerations

- Stepper components are lightweight
- No virtualization needed (typically < 10 steps)
- Re-renders only when props change
- Custom connectors/icons should be memoized
- Large step content should be lazy-loaded

### Customization Depth

MUI's Stepper is one of the most customizable stepper implementations:
- Complete icon replacement
- Full connector customization
- Theme integration at every level
- sx prop for inline styles
- classes prop for class overrides
- styled() for component-level styling

This flexibility comes with complexity - simple use cases are straightforward, but advanced customization requires understanding multiple styling systems.

### Comparison to Other Frameworks

**vs Ant Design Steps**: MUI is more compositional, Ant Design more configuration-based
**vs Chakra UI Stepper**: Similar component composition, MUI more Material Design opinionated
**vs Semantic UI Step**: MUI separates mobile stepper, Semantic UI more unified

### Real-World Usage Patterns

Common implementations observed:
- Multi-step checkout flows (3-4 steps)
- Onboarding wizards (5-7 steps)
- Configuration wizards (3-5 steps)
- Form sections (2-4 steps)
- Account setup (3-5 steps)

Rarely see more than 7 steps due to UX concerns about overwhelming users.

### Gotchas and Common Mistakes

1. **Forgetting to manage completion state** - Setting `completed` prop on steps
2. **Not preventing invalid navigation** - Disabling next button on validation errors
3. **Optional step completion** - Must set `completed={false}` for skipped optional steps
4. **Index management** - activeStep is zero-based
5. **Mobile responsiveness** - Horizontal steppers with many steps on small screens
6. **Custom icon props** - Custom StepIconComponent must accept specific props
7. **Connector positioning** - Alternative label mode changes connector calculations

### Framework Integration Patterns

**React Router Integration**:
```jsx
// Stepper steps mirror route paths
const steps = ['/profile', '/contact', '/review'];
const activeStep = steps.indexOf(location.pathname);

<Stepper activeStep={activeStep} nonLinear>
  {steps.map((path, index) => (
    <Step key={path}>
      <StepButton onClick={() => navigate(path)}>
        {stepLabels[index]}
      </StepButton>
    </Step>
  ))}
</Stepper>
```

**Form Libraries (Formik, React Hook Form)**:
```jsx
// Stepper navigation triggers form validation
const handleNext = async () => {
  const isValid = await trigger(); // React Hook Form validation
  if (isValid) {
    setActiveStep(prev => prev + 1);
  }
};
```

### Testing Considerations

- Test navigation between steps
- Verify completion state management
- Check optional step skip logic
- Validate error state display
- Test keyboard navigation for StepButton
- Verify responsive behavior changes
- Check accessibility attributes

---

**Research Completed**: 2025-11-06
**Component**: Stepper (including Step, StepLabel, StepButton, StepContent, StepIcon, StepConnector, MobileStepper)
**Framework**: Material-UI (MUI) v5+
**Documentation URL**: https://mui.com/material-ui/react-stepper/
**API References**:
- https://mui.com/material-ui/api/stepper/
- https://mui.com/material-ui/api/step/
- https://mui.com/material-ui/api/step-label/
- https://mui.com/material-ui/api/step-button/
- https://mui.com/material-ui/api/step-content/
- https://mui.com/material-ui/api/step-icon/
- https://mui.com/material-ui/api/mobile-stepper/
