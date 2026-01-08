# MUI Stepper - Usage Patterns

**Research Date**: 2025-11-05
**MUI Version**: v5+
**Component**: Stepper (with Step, StepLabel, StepContent, StepButton, StepIcon, StepConnector)
**URL**: https://mui.com/material-ui/react-stepper/

---

## Component Overview

The MUI Stepper component displays progress through a sequence of logical and numbered steps. It is designed to guide users through multi-step processes such as forms, wizards, checkout flows, and onboarding experiences. The Stepper system is composed of seven related components that work together to create flexible, accessible step-based interfaces.

**Primary Purpose**: Sequential workflow navigation with visual progress indication

**Note**: This component is no longer documented in the Material Design guidelines, but Material UI continues to support it.

---

## Component Architecture

The Stepper system uses a modular architecture with seven specialized components:

1. **Stepper**: Container component that holds all steps and manages orientation
2. **Step**: Individual step element representing one stage of the process
3. **StepLabel**: Label and optional description for each step
4. **StepContent**: Optional expandable content area for vertical steppers
5. **StepButton**: Optional clickable step element for non-linear navigation
6. **StepIcon**: Optional custom visual indicator (icon/number) for each step
7. **StepConnector**: Optional connector line between steps

---

## Basic Usage

### Import Statements

```jsx
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import StepButton from '@mui/material/StepButton';
import StepIcon from '@mui/material/StepIcon';
import StepConnector from '@mui/material/StepConnector';
```

### Minimal Linear Stepper

```jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';

const steps = ['Step 1', 'Step 2', 'Step 3'];

export default function BasicStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
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
        <Box sx={{ mt: 2 }}>
          <Typography>All steps completed</Typography>
          <Button onClick={handleReset}>Reset</Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
```

---

## Props/API

### Stepper Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeStep` | number | 0 | Zero-based index of the currently active step |
| `alternativeLabel` | bool | false | Places labels below step icons instead of beside them |
| `children` | node | - | Step components to be displayed |
| `connector` | element | `<StepConnector />` | Custom connector element between steps |
| `nonLinear` | bool | false | Allows non-sequential step navigation |
| `orientation` | 'horizontal' \| 'vertical' | 'horizontal' | Orientation of the stepper |
| `sx` | object | - | System prop for styling |

### Step Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | bool | false | Mark step as active (usually controlled by Stepper) |
| `completed` | bool | false | Mark step as completed |
| `disabled` | bool | false | Mark step as disabled |
| `expanded` | bool | false | Expand step content (vertical stepper only) |
| `index` | number | - | Position in stepper (usually controlled by Stepper) |
| `last` | bool | false | Is this the last step (usually controlled by Stepper) |

### StepLabel Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | Label text or content |
| `error` | bool | false | Mark step as error/failure state |
| `icon` | node | - | Override the default step icon |
| `optional` | node | - | Optional subtext (e.g., "Optional") |
| `StepIconComponent` | elementType | - | Custom component for step icon |
| `StepIconProps` | object | - | Props forwarded to StepIcon |

### StepContent Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | Content to display when step is active |
| `slotProps` | object | - | Props for internal slots (e.g., transition) |
| `TransitionComponent` | elementType | Collapse | Component used for transition |
| `transitionDuration` | number \| { enter?: number, exit?: number } | 'auto' | Duration of transition |

### StepButton Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | Button content (typically StepLabel) |
| `icon` | node | - | Override the step icon |
| `optional` | node | - | Optional label |

### StepConnector Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sx` | object | - | System prop for styling |
| `classes` | object | - | Override default classes |

---

## Orientation Patterns

### Horizontal Stepper (Default)

Horizontal steppers are ideal when step contents depend on earlier steps and when screen width allows.

```jsx
import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export default function HorizontalStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <Stepper activeStep={activeStep} orientation="horizontal">
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
```

**Best Practices**:
- Keep step labels concise (avoid long step names)
- Use 3-7 steps for optimal horizontal display
- Consider vertical orientation for more than 5 steps

### Vertical Stepper

Vertical steppers are designed for narrow screen sizes and mobile viewports. All horizontal stepper features can be implemented vertically.

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
    description: 'For each ad campaign that you create, you can control how much you\'re willing to spend on clicks and conversions.',
  },
  {
    label: 'Create an ad group',
    description: 'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Create an ad',
    description: 'Try out different ad text to see what brings in the most customers.',
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
            <StepLabel>
              {step.label}
            </StepLabel>
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
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
```

**Key Features**:
- Uses `StepContent` to display content for each step
- Content expands when step is active
- Well-suited for mobile devices and narrow viewports
- Can display longer descriptions and form fields

**Performance Note**: Step content unmounts when closed by default. To maintain component trees:

```jsx
<StepContent slotProps={{ transition: { unmountOnExit: false } }} />
```

---

## Type Patterns

### Linear Stepper

Linear steppers require users to complete steps in sequence. Steps are automatically marked as disabled based on the `activeStep` prop.

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
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
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

**Key Characteristics**:
- Controlled via `activeStep` prop (zero-based index)
- Steps are disabled until previous steps are completed
- Optional steps can be skipped
- Requires manual state management for skipped steps

### Non-Linear Stepper

Non-linear steppers allow users to enter the workflow at any point. Steps can be accessed in any order.

```jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export default function HorizontalNonLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

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

**Key Characteristics**:
- Uses `nonLinear` prop on Stepper
- Uses `StepButton` instead of `StepLabel` for clickable steps
- Steps are not automatically disabled
- Requires manual management of completion state
- Users can jump to any step at any time

---

## Status Patterns

### Active Step

The active step is controlled via the `activeStep` prop (zero-based index):

```jsx
<Stepper activeStep={1}>
  <Step>
    <StepLabel>Step 1</StepLabel>
  </Step>
  <Step>
    <StepLabel>Step 2</StepLabel> {/* Active */}
  </Step>
  <Step>
    <StepLabel>Step 3</StepLabel>
  </Step>
</Stepper>
```

### Completed Step

Mark steps as completed explicitly:

```jsx
<Step completed={true}>
  <StepLabel>Completed Step</StepLabel>
</Step>
```

For linear steppers, steps before `activeStep` are automatically marked completed.

### Error Step

Display error state on a step:

```jsx
<Step>
  <StepLabel error={true}>
    Error Step
  </StepLabel>
</Step>
```

**Visual Indicators**:
- Error step label appears in error color (typically red)
- Step icon displays error indicator
- Can be combined with optional descriptive text

### Disabled Step

Disable step interaction:

```jsx
<Step disabled={true}>
  <StepLabel>Disabled Step</StepLabel>
</Step>
```

In linear steppers, steps are automatically disabled until previous steps complete.

### Combined Status Example

```jsx
const [activeStep, setActiveStep] = React.useState(1);
const [completed, setCompleted] = React.useState({ 0: true });
const [hasError, setHasError] = React.useState(false);

<Stepper activeStep={activeStep}>
  <Step completed={completed[0]}>
    <StepLabel>Completed Step</StepLabel>
  </Step>
  <Step>
    <StepLabel error={hasError}>
      {hasError ? 'Error in this step' : 'Active Step'}
    </StepLabel>
  </Step>
  <Step disabled={!completed[1]}>
    <StepLabel>Disabled Step</StepLabel>
  </Step>
</Stepper>
```

---

## Content Patterns

### Simple Labels

```jsx
<Stepper activeStep={activeStep}>
  <Step>
    <StepLabel>Step One</StepLabel>
  </Step>
  <Step>
    <StepLabel>Step Two</StepLabel>
  </Step>
  <Step>
    <StepLabel>Step Three</StepLabel>
  </Step>
</Stepper>
```

### Optional Label

Display optional indicator for skippable steps:

```jsx
<Step>
  <StepLabel optional={<Typography variant="caption">Optional</Typography>}>
    Create Backup
  </StepLabel>
</Step>
```

### Description (Vertical Stepper)

Add detailed descriptions in vertical steppers using `StepContent`:

```jsx
<Step>
  <StepLabel>Select campaign settings</StepLabel>
  <StepContent>
    <Typography>
      For each ad campaign that you create, you can control how much
      you're willing to spend on clicks and conversions.
    </Typography>
  </StepContent>
</Step>
```

### Custom Icons

Override default step icons:

```jsx
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';

const icons = {
  1: <SettingsIcon />,
  2: <GroupAddIcon />,
  3: <VideoLabelIcon />,
};

function CustomStepIcon(props) {
  const { active, completed, className, icon } = props;
  return (
    <div className={className}>
      {icons[String(icon)]}
    </div>
  );
}

<Stepper activeStep={activeStep}>
  {steps.map((label, index) => (
    <Step key={label}>
      <StepLabel StepIconComponent={CustomStepIcon}>
        {label}
      </StepLabel>
    </Step>
  ))}
</Stepper>
```

### Alternative Label Positioning

Place labels below icons instead of beside them:

```jsx
<Stepper activeStep={activeStep} alternativeLabel>
  {steps.map((label) => (
    <Step key={label}>
      <StepLabel>{label}</StepLabel>
    </Step>
  ))}
</Stepper>
```

**Best for**:
- Short, concise labels
- Horizontal layouts with limited space
- Consistent icon-first visual hierarchy

---

## Navigation Patterns

### Linear Navigation

Standard forward/backward navigation:

```jsx
const [activeStep, setActiveStep] = React.useState(0);

const handleNext = () => {
  setActiveStep((prevStep) => prevStep + 1);
};

const handleBack = () => {
  setActiveStep((prevStep) => prevStep - 1);
};

<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
  <Button
    disabled={activeStep === 0}
    onClick={handleBack}
  >
    Back
  </Button>
  <Box sx={{ flex: '1 1 auto' }} />
  <Button onClick={handleNext}>
    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
  </Button>
</Box>
```

### Non-Linear Navigation

Allow direct navigation to any step:

```jsx
const handleStep = (step) => () => {
  setActiveStep(step);
};

<Stepper nonLinear activeStep={activeStep}>
  {steps.map((label, index) => (
    <Step key={label}>
      <StepButton onClick={handleStep(index)}>
        {label}
      </StepButton>
    </Step>
  ))}
</Stepper>
```

### Skip Navigation

Allow users to skip optional steps:

```jsx
const [skipped, setSkipped] = React.useState(new Set());

const isStepOptional = (step) => {
  return step === 1; // Step 2 is optional
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

{isStepOptional(activeStep) && (
  <Button onClick={handleSkip}>
    Skip
  </Button>
)}
```

### Reset Navigation

Return to the first step:

```jsx
const handleReset = () => {
  setActiveStep(0);
  setCompleted({});
  setSkipped(new Set());
};

<Button onClick={handleReset}>Reset</Button>
```

---

## Progress Patterns

### Completion Tracking

Track which steps have been completed:

```jsx
const [completed, setCompleted] = React.useState({});

const handleComplete = () => {
  const newCompleted = { ...completed };
  newCompleted[activeStep] = true;
  setCompleted(newCompleted);
};

<Step completed={completed[index]}>
  <StepLabel>{label}</StepLabel>
</Step>
```

### Progress Percentage

Calculate overall progress:

```jsx
const completedSteps = () => {
  return Object.keys(completed).length;
};

const totalSteps = () => {
  return steps.length;
};

const progressPercentage = () => {
  return (completedSteps() / totalSteps()) * 100;
};

<Box sx={{ width: '100%', mb: 2 }}>
  <Typography variant="body2" color="text.secondary">
    Progress: {completedSteps()} / {totalSteps()} ({progressPercentage()}%)
  </Typography>
</Box>
```

### All Steps Completed State

Display completion message:

```jsx
const allStepsCompleted = () => {
  return completedSteps() === totalSteps();
};

{allStepsCompleted() ? (
  <Box>
    <Typography>All steps completed - you're finished!</Typography>
    <Button onClick={handleReset}>Start Over</Button>
  </Box>
) : (
  // Render stepper and controls
)}
```

---

## Connector Patterns

### Default Connector

MUI provides a default line connector between steps:

```jsx
<Stepper activeStep={activeStep}>
  {/* Default StepConnector used automatically */}
  <Step>
    <StepLabel>Step 1</StepLabel>
  </Step>
  <Step>
    <StepLabel>Step 2</StepLabel>
  </Step>
</Stepper>
```

### Custom Connector - QontoConnector

Create a styled connector with different active/completed states:

```jsx
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

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

<Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
  {steps.map((label) => (
    <Step key={label}>
      <StepLabel>{label}</StepLabel>
    </Step>
  ))}
</Stepper>
```

### Custom Connector - ColorlibConnector

Create a more elaborate connector with gradient styling:

```jsx
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

<Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
  {steps.map((label) => (
    <Step key={label}>
      <StepLabel>{label}</StepLabel>
    </Step>
  ))}
</Stepper>
```

### Removing Connectors

Hide connectors entirely:

```jsx
const NoConnector = styled(StepConnector)(() => ({
  display: 'none',
}));

<Stepper activeStep={activeStep} connector={<NoConnector />}>
  {steps.map((label) => (
    <Step key={label}>
      <StepLabel>{label}</StepLabel>
    </Step>
  ))}
</Stepper>
```

---

## Mobile Stepper Pattern

The `MobileStepper` is a specialized compact variant optimized for mobile devices:

### Text Variant

```jsx
import * as React from 'react';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function TextMobileStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = 3;

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
          <KeyboardArrowRight />
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          <KeyboardArrowLeft />
          Back
        </Button>
      }
    />
  );
}
```

### Dots Variant

Best for small step counts (2-5 steps):

```jsx
<MobileStepper
  variant="dots"
  steps={3}
  position="static"
  activeStep={activeStep}
  nextButton={<Button size="small" onClick={handleNext}>Next</Button>}
  backButton={<Button size="small" onClick={handleBack}>Back</Button>}
/>
```

### Progress Variant

Best for many steps (6+ steps):

```jsx
<MobileStepper
  variant="progress"
  steps={10}
  position="static"
  activeStep={activeStep}
  nextButton={<Button size="small" onClick={handleNext}>Next</Button>}
  backButton={<Button size="small" onClick={handleBack}>Back</Button>}
/>
```

**Position Options**:
- `static` - Normal document flow
- `fixed` - Fixed to viewport
- `bottom` - Fixed to bottom of viewport
- `top` - Fixed to top of viewport

---

## Accessibility

### ARIA Patterns

MUI Stepper implements proper ARIA attributes automatically:

**Stepper Container**:
```jsx
// Automatically applied
<div role="group" aria-label="progress">
  {/* Steps */}
</div>
```

**Step Elements**:
```jsx
// Automatically applied based on state
<div aria-current={active ? "step" : undefined}>
  <span aria-label="Step 1 of 3">
    {/* Step content */}
  </span>
</div>
```

### Keyboard Navigation

For non-linear steppers with `StepButton`:

- **Tab**: Focus next step button
- **Shift + Tab**: Focus previous step button
- **Enter/Space**: Activate focused step
- **Arrow Keys**: Navigate between steps (when focused)

### Screen Reader Support

Provide meaningful labels:

```jsx
<Stepper activeStep={activeStep} aria-label="Checkout progress">
  <Step>
    <StepLabel>
      Shipping Address
      <Typography variant="caption" sx={{ display: 'block' }}>
        {/* Additional context for screen readers */}
        Enter your delivery location
      </Typography>
    </StepLabel>
  </Step>
</Stepper>
```

### Error Announcements

Announce errors to screen readers:

```jsx
<Step>
  <StepLabel error={hasError}>
    Payment Information
    {hasError && (
      <Typography
        variant="caption"
        color="error"
        role="alert"
        aria-live="polite"
      >
        Invalid credit card number
      </Typography>
    )}
  </StepLabel>
</Step>
```

### Focus Management

Manage focus when steps change:

```jsx
const stepRefs = React.useRef([]);

const handleNext = () => {
  setActiveStep((prev) => {
    const nextStep = prev + 1;
    // Focus next step heading
    stepRefs.current[nextStep]?.focus();
    return nextStep;
  });
};

<Step>
  <StepLabel>
    <Typography
      variant="h6"
      component="h3"
      tabIndex={-1}
      ref={(el) => (stepRefs.current[index] = el)}
    >
      {label}
    </Typography>
  </StepLabel>
</Step>
```

---

## Integration Patterns

### Multi-Step Form

```jsx
import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const steps = ['Personal Info', 'Address', 'Confirmation'];

export default function MultiStepForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    address: '',
    city: '',
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Submit form data
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleChange('name')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={handleChange('email')}
              fullWidth
              margin="normal"
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              label="Address"
              value={formData.address}
              onChange={handleChange('address')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              value={formData.city}
              onChange={handleChange('city')}
              fullWidth
              margin="normal"
            />
          </>
        );
      case 2:
        return (
          <>
            <Typography>Please review your information:</Typography>
            <Typography>Name: {formData.name}</Typography>
            <Typography>Email: {formData.email}</Typography>
            <Typography>Address: {formData.address}</Typography>
            <Typography>City: {formData.city}</Typography>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2, mb: 2 }}>
        {renderStepContent(activeStep)}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}>
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
}
```

### Wizard Pattern

```jsx
export default function WizardStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [wizardData, setWizardData] = React.useState({});

  const steps = [
    { label: 'Choose Template', component: TemplateSelector },
    { label: 'Configure Settings', component: SettingsForm },
    { label: 'Add Content', component: ContentEditor },
    { label: 'Review & Publish', component: ReviewStep },
  ];

  const handleNext = (stepData) => {
    setWizardData({ ...wizardData, ...stepData });
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const CurrentStepComponent = steps[activeStep].component;

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 3 }}>
        <CurrentStepComponent
          data={wizardData}
          onNext={handleNext}
          onBack={handleBack}
        />
      </Box>
    </Box>
  );
}
```

### Validation Integration

```jsx
export default function ValidatedStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [errors, setErrors] = React.useState({});
  const [formData, setFormData] = React.useState({});

  const validateStep = (step) => {
    const stepErrors = {};

    switch (step) {
      case 0:
        if (!formData.name) stepErrors.name = 'Name is required';
        if (!formData.email) stepErrors.email = 'Email is required';
        break;
      case 1:
        if (!formData.address) stepErrors.address = 'Address is required';
        break;
      // Add validation for other steps
    }

    return stepErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(activeStep);

    if (Object.keys(stepErrors).length === 0) {
      setErrors({});
      setActiveStep((prev) => prev + 1);
    } else {
      setErrors(stepErrors);
    }
  };

  return (
    <Stepper activeStep={activeStep}>
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel error={Object.keys(errors).length > 0 && index === activeStep}>
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
```

---

## Advanced Patterns

### Dynamic Steps

Add or remove steps dynamically:

```jsx
export default function DynamicStepper() {
  const [steps, setSteps] = React.useState(['Step 1', 'Step 2']);
  const [activeStep, setActiveStep] = React.useState(0);

  const addStep = () => {
    setSteps([...steps, `Step ${steps.length + 1}`]);
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    if (activeStep >= newSteps.length) {
      setActiveStep(newSteps.length - 1);
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>
              {label}
              <IconButton size="small" onClick={() => removeStep(index)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Button onClick={addStep}>Add Step</Button>
    </Box>
  );
}
```

### Conditional Steps

Show/hide steps based on conditions:

```jsx
export default function ConditionalStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [showOptionalSteps, setShowOptionalSteps] = React.useState(false);

  const allSteps = [
    'Required Step 1',
    'Required Step 2',
    'Optional Step A',
    'Optional Step B',
    'Final Step',
  ];

  const visibleSteps = showOptionalSteps
    ? allSteps
    : allSteps.filter((_, i) => i !== 2 && i !== 3);

  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={showOptionalSteps}
            onChange={(e) => setShowOptionalSteps(e.target.checked)}
          />
        }
        label="Include optional steps"
      />
      <Stepper activeStep={activeStep}>
        {visibleSteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
```

### Nested Steppers

Create multi-level stepper hierarchies:

```jsx
export default function NestedStepper() {
  const [mainStep, setMainStep] = React.useState(0);
  const [subStep, setSubStep] = React.useState(0);

  const mainSteps = ['Setup', 'Configure', 'Complete'];
  const subSteps = {
    0: ['Account', 'Profile', 'Preferences'],
    1: ['Basic Settings', 'Advanced Settings'],
    2: ['Review', 'Confirm'],
  };

  return (
    <Box>
      <Stepper activeStep={mainStep}>
        {mainSteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2, ml: 4 }}>
        <Stepper activeStep={subStep} orientation="vertical">
          {subSteps[mainStep].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
}
```

### Async Step Validation

Validate steps with async operations:

```jsx
export default function AsyncValidationStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const validateStepAsync = async (step) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      const response = await fetch(`/api/validate-step/${step}`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const isValid = await validateStepAsync(activeStep);

    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel error={error && index === activeStep}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        onClick={handleNext}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Next'}
      </Button>
    </Box>
  );
}
```

### Save and Resume Progress

Persist stepper state for multi-session workflows:

```jsx
export default function PersistentStepper() {
  const [activeStep, setActiveStep] = React.useState(() => {
    const saved = localStorage.getItem('stepperProgress');
    return saved ? JSON.parse(saved).activeStep : 0;
  });

  const [formData, setFormData] = React.useState(() => {
    const saved = localStorage.getItem('stepperProgress');
    return saved ? JSON.parse(saved).formData : {};
  });

  // Save progress whenever it changes
  React.useEffect(() => {
    localStorage.setItem('stepperProgress', JSON.stringify({
      activeStep,
      formData,
    }));
  }, [activeStep, formData]);

  const clearProgress = () => {
    localStorage.removeItem('stepperProgress');
    setActiveStep(0);
    setFormData({});
  };

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Button onClick={clearProgress}>Clear Saved Progress</Button>
    </Box>
  );
}
```

---

## Notes

### Design System Compatibility

MUI Stepper is designed to work seamlessly with Material-UI's theming system:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: '1.1rem',
          fontWeight: 500,
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
  },
});

<ThemeProvider theme={theme}>
  <Stepper>
    {/* Steps */}
  </Stepper>
</ThemeProvider>
```

### Performance Considerations

1. **Step Content Unmounting**: By default, `StepContent` unmounts when inactive to improve performance. Disable with:
   ```jsx
   <StepContent slotProps={{ transition: { unmountOnExit: false } }} />
   ```

2. **Large Step Counts**: For steppers with many steps (10+), consider:
   - Using `MobileStepper` with progress variant
   - Grouping steps into sections
   - Implementing pagination

3. **Memoization**: For complex step content, use `React.memo` to prevent unnecessary re-renders:
   ```jsx
   const StepContent = React.memo(({ data }) => {
     // Complex rendering logic
   });
   ```

### Browser Support

MUI Stepper is fully supported in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Migration from Material Design Guidelines

MUI notes that the Stepper component "is no longer documented in the Material Design guidelines" but continues to support it. For new projects, consider:
- Whether a stepper is the appropriate UX pattern
- Alternative patterns like progress bars or numbered lists
- Simplified mobile-first approaches

### Common Pitfalls

1. **Forgetting Zero-Based Index**: `activeStep` is zero-based (first step = 0)
2. **Not Managing Skipped Steps**: Must manually set `completed={false}` for skipped steps
3. **Missing Optional Label**: Use `optional` prop to indicate skippable steps
4. **Connector Styling**: Custom connectors require `alternativeLabel` positioning adjustments
5. **Vertical Stepper Height**: Ensure container has adequate height for expanded content

### Best Practices

1. **Keep Steps Focused**: Each step should represent a single, clear task
2. **Limit Step Count**: 3-7 steps is optimal; more may overwhelm users
3. **Provide Clear Labels**: Use action-oriented labels ("Enter Details" vs "Step 1")
4. **Show Progress**: Always indicate current position and overall progress
5. **Enable Navigation**: Allow users to go back and review previous steps
6. **Validate Before Advancing**: Check step completion before allowing next step
7. **Mobile Considerations**: Use vertical orientation or `MobileStepper` on small screens
8. **Accessibility**: Ensure keyboard navigation and screen reader support
9. **Error Handling**: Clearly indicate which steps have errors
10. **Save Progress**: For long workflows, persist state between sessions

---

## Related Components

- **MobileStepper**: Compact mobile-optimized variant
- **Tabs**: Alternative navigation pattern for non-sequential content
- **Breadcrumbs**: Show navigation path in hierarchical structures
- **ProgressBar**: Simple linear progress indication

---

## References

- Official Documentation: https://mui.com/material-ui/react-stepper/
- API Reference - Stepper: https://mui.com/material-ui/api/stepper/
- API Reference - Step: https://mui.com/material-ui/api/step/
- API Reference - StepLabel: https://mui.com/material-ui/api/step-label/
- API Reference - StepContent: https://mui.com/material-ui/api/step-content/
- API Reference - StepButton: https://mui.com/material-ui/api/step-button/
- API Reference - StepIcon: https://mui.com/material-ui/api/step-icon/
- API Reference - StepConnector: https://mui.com/material-ui/api/step-connector/
- API Reference - MobileStepper: https://mui.com/material-ui/api/mobile-stepper/

---

**Research Completed**: 2025-11-05
