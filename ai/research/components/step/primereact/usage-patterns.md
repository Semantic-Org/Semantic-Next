# PrimeReact - Steps Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primereact.org/steps/
Status: ✅ Working
Version: Latest (v10+)
Last Verified: 2025-11-05

## Documentation Quality
Good - The Steps documentation provides clear examples of basic usage, interactive patterns, and customization options. Includes accessibility guidelines and API reference.

## Component Definition
- **Core purpose**: Visual indicator for multi-step workflows and wizards, showing progress through a linear sequence
- **Mental model**: Array-driven step indicator where each item represents a stage in a process
- **Semantic meaning**: Displays user's current position in a multi-step flow and allows navigation between steps (when interactive)

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `model={items}`, `activeIndex={0}`, `readOnly={false}`)
- **Composed**: Not used - purely array-driven configuration
- **CSS-only**: Requires custom styling (e.g., via `className`, `style`, or PassThrough `pt`)

## Component Overview

Steps (also known as Stepper in some contexts) is an indicator component for multi-step workflows. It displays a horizontal sequence of steps to guide users through a process like a wizard, form submission, or any linear workflow.

**Key Characteristics:**
- Menu-driven architecture (uses MenuItem API)
- Can be read-only (indicator only) or interactive (clickable navigation)
- Supports custom icons, labels, and templates
- Controlled via `activeIndex` prop
- Integrates with form workflows and wizards

## Basic Usage

```jsx
import { Steps } from 'primereact/steps';

const items = [
    { label: 'Personal' },
    { label: 'Seat' },
    { label: 'Payment' },
    { label: 'Confirmation' }
];

<Steps model={items} activeIndex={0} />
```

## Props/API

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[]` | `null` | An array of menuitems defining the step items |
| `activeIndex` | `number` | `0` | Index of the active step |
| `readOnly` | `boolean` | `true` | Whether steps are interactive or read-only |
| `onSelect` | `function` | `null` | Callback when a step is selected: `(e: {originalEvent, index, item}) => void` |
| `id` | `string` | `null` | Unique identifier of the element |
| `className` | `string` | `null` | Style class of the component |
| `style` | `object` | `null` | Inline style of the component |
| `pt` | `object` | `null` | PassThrough options for customization |

### MenuItem Properties (for model items)

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Text label for the step |
| `icon` | `string \| JSX.Element \| function` | Icon for the step (e.g., 'pi pi-user') |
| `command` | `function` | Callback to invoke when step is clicked: `(event) => void` |
| `url` | `string` | External URL to navigate to |
| `target` | `string` | Target attribute for URL navigation (e.g., '_blank') |
| `disabled` | `boolean` | Whether the step is disabled |
| `visible` | `boolean` | Whether the step is visible |
| `className` | `string` | Style class for the step item |
| `style` | `object` | Inline style for the step item |
| `template` | `function` | Custom template function: `(item, options) => JSX.Element` |

## Common Patterns

### Pattern Category 1: Read-Only Indicator

Basic progress indicator without interactivity.

```jsx
import { Steps } from 'primereact/steps';
import { useState } from 'react';

function CheckoutProcess() {
    const [activeStep, setActiveStep] = useState(0);

    const items = [
        { label: 'Cart' },
        { label: 'Shipping' },
        { label: 'Payment' },
        { label: 'Confirmation' }
    ];

    return (
        <div>
            <Steps model={items} activeIndex={activeStep} readOnly={true} />
            {/* Step content managed separately */}
            <div className="step-content">
                {activeStep === 0 && <CartContent />}
                {activeStep === 1 && <ShippingForm />}
                {activeStep === 2 && <PaymentForm />}
                {activeStep === 3 && <ConfirmationPage />}
            </div>
            <button onClick={() => setActiveStep(prev => prev + 1)}>
                Next
            </button>
        </div>
    );
}
```

### Pattern Category 2: Interactive Navigation

Steps with clickable navigation.

```jsx
import { Steps } from 'primereact/steps';
import { useState } from 'react';

function InteractiveWizard() {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { label: 'Personal Info' },
        { label: 'Address' },
        { label: 'Review' }
    ];

    return (
        <div>
            <Steps
                model={items}
                activeIndex={activeIndex}
                onSelect={(e) => setActiveIndex(e.index)}
                readOnly={false}
            />
            {/* Render content based on activeIndex */}
            <StepContent step={activeIndex} />
        </div>
    );
}
```

### Pattern Category 3: With Icons

Steps with custom icons for each stage.

```jsx
import { Steps } from 'primereact/steps';

const items = [
    { label: 'Personal', icon: 'pi pi-user' },
    { label: 'Seat', icon: 'pi pi-map-marker' },
    { label: 'Payment', icon: 'pi pi-credit-card' },
    { label: 'Confirmation', icon: 'pi pi-check' }
];

<Steps model={items} activeIndex={1} />
```

### Pattern Category 4: With Command Handlers

Steps with custom logic on selection.

```jsx
import { Steps } from 'primereact/steps';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';

function StepsWithCommands() {
    const toast = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        {
            label: 'Personal',
            command: (event) => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Personal Info',
                    detail: event.item.label
                });
            }
        },
        {
            label: 'Seat',
            command: (event) => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Seat Selection',
                    detail: event.item.label
                });
            }
        },
        {
            label: 'Payment',
            command: (event) => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Payment',
                    detail: event.item.label
                });
            }
        }
    ];

    return (
        <>
            <Toast ref={toast} />
            <Steps
                model={items}
                activeIndex={activeIndex}
                onSelect={(e) => setActiveIndex(e.index)}
                readOnly={false}
            />
        </>
    );
}
```

## Navigation Patterns

### Read-Only Mode (Default)

```jsx
// Steps is an indicator only - no click interaction
<Steps model={items} activeIndex={currentStep} readOnly={true} />
// or simply (readOnly is true by default)
<Steps model={items} activeIndex={currentStep} />
```

**Use Cases:**
- Progress indicator for linear workflows
- Non-skippable multi-step forms
- Status display where navigation is controlled elsewhere

### Interactive Mode

```jsx
const [activeIndex, setActiveIndex] = useState(0);

<Steps
    model={items}
    activeIndex={activeIndex}
    onSelect={(e) => setActiveIndex(e.index)}
    readOnly={false}
/>
```

**Use Cases:**
- Allow users to jump to previous steps
- Non-linear wizards where steps can be revisited
- Navigation between completed sections

### Controlled vs Uncontrolled

Steps is always **controlled** - you must manage `activeIndex` state externally.

```jsx
// Controlled (Required Pattern)
const [activeIndex, setActiveIndex] = useState(0);

<Steps
    model={items}
    activeIndex={activeIndex}
    onSelect={(e) => setActiveIndex(e.index)}
    readOnly={false}
/>
```

## Model Structure

### Basic Item Structure

```typescript
interface MenuItem {
    label?: string;              // Step label
    icon?: string | JSX.Element; // Step icon
    command?: (event: MenuItemCommandEvent) => void; // Click handler
    url?: string;                // External navigation URL
    target?: string;             // Link target (_blank, etc.)
    disabled?: boolean;          // Disable the step
    visible?: boolean;           // Show/hide the step
    className?: string;          // Custom CSS class
    style?: object;              // Inline styles
    template?: (item: MenuItem, options: any) => JSX.Element; // Custom renderer
}
```

### Complete Model Example

```jsx
const items = [
    {
        label: 'Personal Info',
        icon: 'pi pi-user',
        command: (e) => handleStepClick(e),
        className: 'custom-step-class'
    },
    {
        label: 'Address',
        icon: 'pi pi-map-marker',
        disabled: !isPersonalInfoComplete,
        command: (e) => handleStepClick(e)
    },
    {
        label: 'Payment',
        icon: 'pi pi-credit-card',
        visible: requiresPayment,
        command: (e) => handleStepClick(e)
    },
    {
        label: 'Confirmation',
        icon: 'pi pi-check',
        command: (e) => handleStepClick(e)
    }
];
```

## Status Patterns

### Current Step Indication

The active step is controlled via the `activeIndex` prop.

```jsx
const [activeIndex, setActiveIndex] = useState(0);

// activeIndex determines which step is highlighted
<Steps model={items} activeIndex={activeIndex} />
```

**Visual States:**
- **Active step**: Highlighted with primary color
- **Completed steps**: Typically shown with checkmark or filled indicator (before active)
- **Incomplete steps**: Grayed out or minimal styling (after active)

### Programmatic Step Control

```jsx
function WizardWithButtons() {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { label: 'Step 1' },
        { label: 'Step 2' },
        { label: 'Step 3' }
    ];

    const nextStep = () => {
        if (activeIndex < items.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const prevStep = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    return (
        <>
            <Steps model={items} activeIndex={activeIndex} />
            <div className="buttons">
                <button onClick={prevStep} disabled={activeIndex === 0}>
                    Previous
                </button>
                <button onClick={nextStep} disabled={activeIndex === items.length - 1}>
                    Next
                </button>
            </div>
        </>
    );
}
```

### Conditional Step Visibility

```jsx
const items = [
    { label: 'Personal', visible: true },
    { label: 'Business', visible: isBusinessAccount },
    { label: 'Payment', visible: true },
    { label: 'Review', visible: true }
];

// Only visible steps are rendered
<Steps model={items} activeIndex={activeIndex} />
```

## Content Patterns

### Label Only

```jsx
const items = [
    { label: 'Personal' },
    { label: 'Seat' },
    { label: 'Payment' }
];
```

### Label with Icon

```jsx
const items = [
    { label: 'Personal Info', icon: 'pi pi-user' },
    { label: 'Shipping', icon: 'pi pi-truck' },
    { label: 'Payment', icon: 'pi pi-credit-card' }
];
```

### Icon Only (No Label)

```jsx
const items = [
    { icon: 'pi pi-user' },
    { icon: 'pi pi-truck' },
    { icon: 'pi pi-credit-card' }
];

// Note: Consider accessibility - provide aria-label
```

### Custom Template

Complete control over step rendering.

```jsx
const items = [
    {
        label: 'Personal',
        template: (item, options) => {
            return (
                <a
                    className={options.className}
                    onClick={options.onClick}
                    style={options.style}
                >
                    <span className="step-number">1</span>
                    <span className="step-label">{item.label}</span>
                    <i className="pi pi-user" />
                </a>
            );
        }
    },
    {
        label: 'Payment',
        template: (item, options) => {
            return (
                <a
                    className={options.className}
                    onClick={options.onClick}
                    style={options.style}
                >
                    <span className="step-number">2</span>
                    <span className="step-label">{item.label}</span>
                    <i className="pi pi-credit-card" />
                </a>
            );
        }
    }
];

<Steps model={items} activeIndex={activeIndex} readOnly={false} />
```

### Dynamic Icons

```jsx
const getStepIcon = (stepIndex) => {
    if (stepIndex < activeIndex) return 'pi pi-check'; // Completed
    if (stepIndex === activeIndex) return 'pi pi-spin pi-spinner'; // In progress
    return 'pi pi-circle'; // Not started
};

const items = steps.map((step, index) => ({
    label: step,
    icon: getStepIcon(index)
}));
```

## Command Pattern

### Basic Command Handler

```jsx
const items = [
    {
        label: 'Step 1',
        command: (event) => {
            console.log('Step clicked:', event.item.label);
            console.log('Original event:', event.originalEvent);
        }
    }
];
```

### Command with State Management

```jsx
function WizardWithCommands() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [stepData, setStepData] = useState({});

    const handleStepCommand = (event, stepIndex) => {
        // Validate current step before allowing navigation
        if (validateStep(activeIndex)) {
            setActiveIndex(stepIndex);
            saveStepData(activeIndex, stepData);
        } else {
            alert('Please complete the current step');
        }
    };

    const items = [
        {
            label: 'Personal',
            command: (e) => handleStepCommand(e, 0)
        },
        {
            label: 'Address',
            command: (e) => handleStepCommand(e, 1)
        },
        {
            label: 'Payment',
            command: (e) => handleStepCommand(e, 2)
        }
    ];

    return (
        <Steps
            model={items}
            activeIndex={activeIndex}
            readOnly={false}
        />
    );
}
```

### Command with URL Navigation

```jsx
const items = [
    {
        label: 'Home',
        url: '/',
        target: '_self'
    },
    {
        label: 'External',
        url: 'https://example.com',
        target: '_blank'
    },
    {
        label: 'Current',
        // No url means current step
    }
];
```

### Combining command and onSelect

```jsx
const [activeIndex, setActiveIndex] = useState(0);

const items = [
    {
        label: 'Step 1',
        command: (event) => {
            // Custom logic per step
            console.log('Step 1 specific logic');
        }
    },
    {
        label: 'Step 2',
        command: (event) => {
            console.log('Step 2 specific logic');
        }
    }
];

<Steps
    model={items}
    activeIndex={activeIndex}
    onSelect={(e) => {
        // Global selection handler
        console.log('Any step selected:', e.index);
        setActiveIndex(e.index);
    }}
    readOnly={false}
/>
```

**Note:** Both `command` (per item) and `onSelect` (global) will fire if defined.

## Accessibility

### Screen Reader Support

The Steps component uses the `nav` element for semantic navigation structure.

```jsx
<Steps
    model={items}
    activeIndex={activeIndex}
    aria-label="Checkout progress"
/>
```

### ARIA Attributes

Since all attributes are passed to the root element, you can add ARIA attributes:

```jsx
<Steps
    model={items}
    activeIndex={activeIndex}
    aria-label="Multi-step form progress"
    aria-describedby="step-help-text"
/>
```

### Keyboard Navigation

- **Tab**: Navigate between clickable steps (when `readOnly={false}`)
- **Enter/Space**: Activate focused step
- **Arrow Keys**: Not explicitly documented but may work with standard link navigation

### Accessible Labels

```jsx
const items = [
    {
        label: 'Personal Information',
        // For icon-only steps, ensure label exists for screen readers
        icon: 'pi pi-user'
    },
    {
        label: 'Review and Submit',
        icon: 'pi pi-check'
    }
];
```

### Disabled Steps

```jsx
const items = [
    {
        label: 'Completed Step',
        disabled: false
    },
    {
        label: 'Current Step',
        disabled: false
    },
    {
        label: 'Future Step',
        disabled: true  // Not accessible yet
    }
];
```

## Integration Patterns

### Integration with Forms

```jsx
import { Steps } from 'primereact/steps';
import { useState } from 'react';

function MultiStepForm() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [formData, setFormData] = useState({
        personal: {},
        address: {},
        payment: {}
    });

    const items = [
        { label: 'Personal Info' },
        { label: 'Address' },
        { label: 'Payment' }
    ];

    const handleNext = () => {
        if (validateCurrentStep()) {
            setActiveIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        setActiveIndex(prev => prev - 1);
    };

    const validateCurrentStep = () => {
        // Validation logic
        return true;
    };

    return (
        <div className="multi-step-form">
            <Steps model={items} activeIndex={activeIndex} readOnly={true} />

            <div className="form-content">
                {activeIndex === 0 && (
                    <PersonalInfoForm
                        data={formData.personal}
                        onChange={(data) => setFormData({...formData, personal: data})}
                    />
                )}
                {activeIndex === 1 && (
                    <AddressForm
                        data={formData.address}
                        onChange={(data) => setFormData({...formData, address: data})}
                    />
                )}
                {activeIndex === 2 && (
                    <PaymentForm
                        data={formData.payment}
                        onChange={(data) => setFormData({...formData, payment: data})}
                    />
                )}
            </div>

            <div className="form-navigation">
                <button
                    onClick={handlePrevious}
                    disabled={activeIndex === 0}
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={activeIndex === items.length - 1}
                >
                    {activeIndex === items.length - 1 ? 'Submit' : 'Next'}
                </button>
            </div>
        </div>
    );
}
```

### Integration with React Router

```jsx
import { Steps } from 'primereact/steps';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function WizardWithRouter() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        {
            label: 'Personal',
            command: () => navigate('/wizard/personal')
        },
        {
            label: 'Address',
            command: () => navigate('/wizard/address')
        },
        {
            label: 'Payment',
            command: () => navigate('/wizard/payment')
        }
    ];

    // Sync activeIndex with current route
    useEffect(() => {
        const pathToIndex = {
            '/wizard/personal': 0,
            '/wizard/address': 1,
            '/wizard/payment': 2
        };
        setActiveIndex(pathToIndex[location.pathname] || 0);
    }, [location]);

    return (
        <Steps
            model={items}
            activeIndex={activeIndex}
            readOnly={false}
        />
    );
}
```

### Integration with State Management (Redux/Context)

```jsx
import { Steps } from 'primereact/steps';
import { useDispatch, useSelector } from 'react-redux';
import { setStep } from './wizardSlice';

function WizardWithRedux() {
    const dispatch = useDispatch();
    const activeIndex = useSelector(state => state.wizard.activeStep);
    const wizardData = useSelector(state => state.wizard.data);

    const items = [
        { label: 'Personal' },
        { label: 'Address' },
        { label: 'Payment' }
    ];

    return (
        <>
            <Steps
                model={items}
                activeIndex={activeIndex}
                onSelect={(e) => dispatch(setStep(e.index))}
                readOnly={false}
            />
            <WizardContent step={activeIndex} data={wizardData} />
        </>
    );
}
```

### Integration with Validation Libraries (Formik/React Hook Form)

```jsx
import { Steps } from 'primereact/steps';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function ValidatedWizard() {
    const [activeIndex, setActiveIndex] = useState(0);

    const validationSchemas = [
        Yup.object({ name: Yup.string().required() }),
        Yup.object({ address: Yup.string().required() }),
        Yup.object({ payment: Yup.string().required() })
    ];

    const formik = useFormik({
        initialValues: { name: '', address: '', payment: '' },
        validationSchema: validationSchemas[activeIndex],
        onSubmit: async (values) => {
            if (activeIndex < items.length - 1) {
                setActiveIndex(activeIndex + 1);
            } else {
                await submitForm(values);
            }
        }
    });

    const items = [
        { label: 'Personal' },
        { label: 'Address' },
        { label: 'Payment' }
    ];

    return (
        <form onSubmit={formik.handleSubmit}>
            <Steps model={items} activeIndex={activeIndex} readOnly={true} />
            {/* Form fields based on activeIndex */}
            <button type="submit">
                {activeIndex < items.length - 1 ? 'Next' : 'Submit'}
            </button>
        </form>
    );
}
```

## Advanced Patterns

### Dynamic Step Generation

```jsx
function DynamicStepsWizard({ stepDefinitions }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = stepDefinitions.map((def, index) => ({
        label: def.title,
        icon: def.icon,
        disabled: def.requiresPrevious && index > activeIndex,
        visible: def.condition ? def.condition() : true
    }));

    return (
        <>
            <Steps
                model={items}
                activeIndex={activeIndex}
                onSelect={(e) => setActiveIndex(e.index)}
                readOnly={false}
            />
            {stepDefinitions[activeIndex]?.component}
        </>
    );
}

// Usage
const wizardSteps = [
    {
        title: 'Account Type',
        icon: 'pi pi-user',
        component: <AccountTypeSelector />,
        requiresPrevious: false
    },
    {
        title: 'Business Info',
        icon: 'pi pi-briefcase',
        component: <BusinessInfoForm />,
        condition: () => accountType === 'business',
        requiresPrevious: true
    },
    {
        title: 'Payment',
        icon: 'pi pi-credit-card',
        component: <PaymentForm />,
        requiresPrevious: true
    }
];

<DynamicStepsWizard stepDefinitions={wizardSteps} />
```

### Step Validation and Progress Tracking

```jsx
function ValidatedStepsWizard() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const [stepErrors, setStepErrors] = useState({});

    const validateStep = async (stepIndex) => {
        try {
            await validators[stepIndex]();
            setStepErrors({ ...stepErrors, [stepIndex]: null });
            setCompletedSteps(new Set([...completedSteps, stepIndex]));
            return true;
        } catch (error) {
            setStepErrors({ ...stepErrors, [stepIndex]: error.message });
            return false;
        }
    };

    const handleStepSelect = async (e) => {
        const targetIndex = e.index;

        // Allow going back without validation
        if (targetIndex < activeIndex) {
            setActiveIndex(targetIndex);
            return;
        }

        // Validate current step before proceeding
        if (await validateStep(activeIndex)) {
            setActiveIndex(targetIndex);
        }
    };

    const items = [
        {
            label: 'Personal',
            icon: completedSteps.has(0) ? 'pi pi-check' : 'pi pi-user',
            className: stepErrors[0] ? 'step-error' : ''
        },
        {
            label: 'Address',
            icon: completedSteps.has(1) ? 'pi pi-check' : 'pi pi-map-marker',
            className: stepErrors[1] ? 'step-error' : ''
        },
        {
            label: 'Payment',
            icon: completedSteps.has(2) ? 'pi pi-check' : 'pi pi-credit-card',
            className: stepErrors[2] ? 'step-error' : ''
        }
    ];

    return (
        <>
            <Steps
                model={items}
                activeIndex={activeIndex}
                onSelect={handleStepSelect}
                readOnly={false}
            />
            {stepErrors[activeIndex] && (
                <div className="error-message">{stepErrors[activeIndex]}</div>
            )}
        </>
    );
}
```

### Custom Styling with PassThrough

```jsx
import { Steps } from 'primereact/steps';

function CustomStyledSteps() {
    const items = [
        { label: 'Step 1' },
        { label: 'Step 2' },
        { label: 'Step 3' }
    ];

    const pt = {
        root: {
            className: 'custom-steps-root'
        },
        menu: {
            className: 'custom-steps-menu'
        },
        menuitem: {
            className: 'custom-step-item'
        },
        action: {
            className: 'custom-step-action'
        },
        step: {
            className: 'custom-step-number'
        },
        label: {
            className: 'custom-step-label'
        }
    };

    return (
        <Steps
            model={items}
            activeIndex={0}
            pt={pt}
            className="my-custom-steps"
            style={{ margin: '2rem 0' }}
        />
    );
}
```

### Responsive Steps with Mobile Adaptation

```jsx
import { Steps } from 'primereact/steps';
import { useMediaQuery } from './hooks/useMediaQuery';

function ResponsiveSteps() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { label: 'Personal Info', icon: 'pi pi-user' },
        { label: 'Address', icon: 'pi pi-map-marker' },
        { label: 'Payment', icon: 'pi pi-credit-card' },
        { label: 'Confirmation', icon: 'pi pi-check' }
    ];

    // On mobile, show only icons or simplified labels
    const mobileItems = items.map(item => ({
        ...item,
        label: isMobile ? '' : item.label  // Hide labels on mobile
    }));

    return (
        <Steps
            model={mobileItems}
            activeIndex={activeIndex}
            onSelect={(e) => setActiveIndex(e.index)}
            readOnly={false}
            className={isMobile ? 'steps-mobile' : 'steps-desktop'}
        />
    );
}
```

### Async Step Loading

```jsx
function AsyncStepsWizard() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [stepData, setStepData] = useState({});

    const loadStepData = async (stepIndex) => {
        setLoading(true);
        try {
            const data = await fetchStepData(stepIndex);
            setStepData({ ...stepData, [stepIndex]: data });
        } catch (error) {
            console.error('Error loading step:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStepSelect = async (e) => {
        const targetIndex = e.index;
        await loadStepData(targetIndex);
        setActiveIndex(targetIndex);
    };

    const items = [
        { label: 'Personal', icon: loading && activeIndex === 0 ? 'pi pi-spin pi-spinner' : 'pi pi-user' },
        { label: 'Address', icon: loading && activeIndex === 1 ? 'pi pi-spin pi-spinner' : 'pi pi-map-marker' },
        { label: 'Payment', icon: loading && activeIndex === 2 ? 'pi pi-spin pi-spinner' : 'pi pi-credit-card' }
    ];

    return (
        <>
            <Steps
                model={items}
                activeIndex={activeIndex}
                onSelect={handleStepSelect}
                readOnly={false}
            />
            {loading ? <div>Loading step data...</div> : <StepContent data={stepData[activeIndex]} />}
        </>
    );
}
```

### TypeScript Usage

```tsx
import { Steps } from 'primereact/steps';
import { MenuItem, MenuItemCommandEvent } from 'primereact/menuitem';
import { useState } from 'react';

interface StepData {
    personal: PersonalInfo;
    address: AddressInfo;
    payment: PaymentInfo;
}

function TypedStepsWizard() {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [formData, setFormData] = useState<Partial<StepData>>({});

    const handleStepCommand = (event: MenuItemCommandEvent): void => {
        console.log('Step clicked:', event.item.label);
    };

    const items: MenuItem[] = [
        {
            label: 'Personal Info',
            icon: 'pi pi-user',
            command: handleStepCommand
        },
        {
            label: 'Address',
            icon: 'pi pi-map-marker',
            command: handleStepCommand
        },
        {
            label: 'Payment',
            icon: 'pi pi-credit-card',
            command: handleStepCommand
        }
    ];

    return (
        <Steps
            model={items}
            activeIndex={activeIndex}
            onSelect={(e) => setActiveIndex(e.index)}
            readOnly={false}
        />
    );
}
```

## Notes

### Component Architecture
- **Menu-driven**: Uses PrimeReact's MenuModel API, providing consistency with other menu components
- **Controlled component**: Always requires external state management via `activeIndex`
- **Separation of concerns**: Steps component handles indicator display; content rendering is external
- **No built-in content panels**: Unlike some stepper components, Steps doesn't manage step content - that's the developer's responsibility

### Key Differences from Other Frameworks
- **No built-in panels**: PrimeReact has a separate `Stepper` component (different from Steps) that includes panel content
- **MenuItem API**: Leverages the shared MenuModel, so developers familiar with PrimeReact menus already know the API
- **Always horizontal**: No vertical orientation option (unlike some frameworks)
- **Read-only by default**: Must explicitly set `readOnly={false}` for interactivity

### Best Practices
1. **Always control activeIndex**: Steps is a controlled component - manage state externally
2. **Validate before advancing**: Use `command` or `onSelect` to validate current step before allowing navigation
3. **Provide icons for clarity**: Icons help users quickly identify step purpose
4. **Consider accessibility**: Always provide meaningful labels, even if using icon-only display
5. **Separate step indicator from content**: Don't try to embed content in Steps - render it separately based on `activeIndex`
6. **Use readOnly for linear flows**: If users shouldn't skip steps, keep `readOnly={true}` (default)

### Common Pitfalls
- **Forgetting readOnly prop**: Steps is read-only by default - must explicitly enable interactivity
- **Not handling state externally**: Steps doesn't manage its own state - you must control `activeIndex`
- **Trying to embed content**: Steps is just an indicator - render step content separately
- **Ignoring validation**: In interactive mode, users can jump to any step - implement validation if needed
- **Accessibility oversights**: Ensure labels exist for screen readers, especially with icon-only displays

### Performance Considerations
- **Lightweight component**: Steps only renders indicator UI, no heavy content panels
- **Memoization opportunity**: If step items don't change, memoize the `model` array
- **Template performance**: Custom templates re-render on every update - keep them simple or memoize

### Theme Integration
- **30+ built-in themes**: Works with all PrimeReact themes (Material, Bootstrap, Tailwind, etc.)
- **PassThrough API**: Use `pt` prop for deep customization without CSS overrides
- **CSS customization**: Target `.p-steps`, `.p-steps-item`, `.p-steps-number`, `.p-steps-title` classes

### Integration Notes
- **Works well with forms**: Common pattern for multi-step form wizards
- **Router friendly**: Easy integration with React Router, Next.js, or other routing solutions
- **State management compatible**: Works with Redux, Context API, Zustand, etc.
- **No built-in persistence**: Implement your own state persistence if needed (localStorage, server, etc.)
