# Stepper / Wizard - PrimeReact Usage Patterns

> **Framework**: PrimeReact
> **Component**: Steps
> **Documentation**: https://primereact.org/steps/
> **Research Date**: 2025-11-05

## Component Definition

The Steps component in PrimeReact is a workflow indicator that displays progression through a numbered sequence of steps. Also referred to as "Stepper," it serves as a visual guide for multi-step processes like forms, wizards, checkout flows, and guided workflows. The component is optimized for responsive design and can operate in both read-only (display-only) and interactive modes. By default, Steps functions as a passive indicator, but can be configured to allow direct navigation between steps.

The component is part of PrimeReact's Menu category and uses a MenuItem array-based API, making it consistent with other navigation components in the framework.

---

## Core Features

### Workflow Indicator

The primary purpose of Steps is to show users where they are in a multi-step process. Each step is represented visually with a number and label, with the active step highlighted to indicate current position.

### Linear Mode (Default)

By default, Steps operates in linear mode where it serves purely as a visual indicator. Users must complete steps sequentially through external controls (buttons, form submissions, etc.). The component does not handle navigation directly in this mode.

### Interactive Mode

When configured with `readOnly={false}`, Steps becomes interactive, allowing users to click on any step to navigate directly to it. This enables non-linear workflows where users can jump between steps freely.

### Controlled State Management

Steps is a controlled component that accepts an `activeIndex` prop to determine which step is currently active. Navigation is handled through the `onSelect` event callback, giving developers complete control over step transitions and validation logic.

### Menu Item Model

Steps uses PrimeReact's standard MenuItem interface for defining steps. This provides a familiar API for developers already using PrimeReact's menu components and supports various properties for customization.

### Custom Templates

The component supports custom rendering through the `template` property on menu items, allowing developers to create personalized step displays with custom icons, badges, or additional metadata.

### Responsive Design

Steps is optimized for responsive layouts and adapts to different screen sizes, though specific breakpoint behaviors are not detailed in the documentation.

---

## Props API

### Steps Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[]` | `null` | Array of MenuItem objects defining the steps. Each item represents one step in the workflow. |
| `activeIndex` | `number` | `0` | Index of the currently active step (0-based). Used for controlled component pattern. |
| `readOnly` | `boolean` | `true` | When `true`, Steps is display-only. When `false`, steps are clickable and interactive. |
| `className` | `string` | `null` | Custom CSS class name(s) to apply to the component root element. |
| `style` | `object` | `null` | Inline styles to apply to the component root element. |
| `id` | `string` | `null` | Unique identifier for the component. |
| `aria-label` | `string` | `null` | ARIA label for accessibility. |
| `aria-labelledby` | `string` | `null` | ID of element that labels the Steps component. |
| `onSelect` | `function` | `null` | Callback fired when a step is selected. Receives event object: `(e: StepsSelectEvent) => void` |

### MenuItem Properties

Steps uses PrimeReact's MenuItem interface. Relevant properties for Steps include:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `null` | Text label displayed for the step. |
| `icon` | `string` | `null` | Icon class name to display (e.g., PrimeIcons classes). |
| `template` | `function` | `null` | Custom render function for the step: `(item: MenuItem, options: MenuItemOptions) => ReactNode` |
| `disabled` | `boolean` | `false` | Whether the step is disabled (not clickable even in interactive mode). |
| `url` | `string` | `null` | URL to navigate to when step is clicked (if using as navigation). |
| `target` | `string` | `null` | Target attribute for URL navigation (e.g., '_blank'). |
| `command` | `function` | `null` | Callback function to execute when step is clicked: `(e: MenuItemCommandEvent) => void` |
| `className` | `string` | `null` | Custom CSS class for the individual step. |
| `style` | `object` | `null` | Inline styles for the individual step. |

### Event Objects

**StepsSelectEvent:**
```typescript
{
  originalEvent: Event,  // Native browser event
  index: number          // Index of the selected step (0-based)
}
```

---

## Usage Patterns

### Pattern 1: Read-Only Indicator (Default)

**Use case**: Display progress through a multi-step process without allowing direct navigation. Step advancement is controlled externally (e.g., through Next/Previous buttons).

**Implementation**: The default behavior of Steps. Set up the model array and control `activeIndex` programmatically.

```javascript
import React, { useState } from 'react';
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';

function LinearWizard() {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { label: 'Personal Info' },
    { label: 'Address' },
    { label: 'Confirmation' }
  ];

  return (
    <div>
      <Steps model={items} activeIndex={activeIndex} />

      <div className="step-content">
        {/* Step content goes here */}
      </div>

      <div className="step-actions">
        <Button
          label="Back"
          onClick={() => setActiveIndex(prev => prev - 1)}
          disabled={activeIndex === 0}
        />
        <Button
          label="Next"
          onClick={() => setActiveIndex(prev => prev + 1)}
          disabled={activeIndex === items.length - 1}
        />
      </div>
    </div>
  );
}
```

### Pattern 2: Interactive Navigation

**Use case**: Allow users to freely navigate between steps by clicking on them. Useful for forms where users may need to review or edit previous steps.

**Implementation**: Set `readOnly={false}` and handle the `onSelect` event.

```javascript
import React, { useState } from 'react';
import { Steps } from 'primereact/steps';

function InteractiveStepper() {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Step 3' }
  ];

  return (
    <div>
      <Steps
        model={items}
        activeIndex={activeIndex}
        onSelect={(e) => setActiveIndex(e.index)}
        readOnly={false}
      />

      <div className="step-content">
        {/* Render content based on activeIndex */}
      </div>
    </div>
  );
}
```

### Pattern 3: Validated Step Navigation

**Use case**: Allow navigation to specific steps only after validation. Prevent users from skipping required steps or moving forward without completing current step.

**Implementation**: Use interactive mode with custom validation logic in the `onSelect` handler.

```javascript
import React, { useState } from 'react';
import { Steps } from 'primereact/steps';

function ValidatedStepper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);

  const items = [
    { label: 'Personal Info' },
    { label: 'Account Setup' },
    { label: 'Confirmation' }
  ];

  const handleSelect = (e) => {
    const targetIndex = e.index;

    // Allow backward navigation
    if (targetIndex < activeIndex) {
      setActiveIndex(targetIndex);
      return;
    }

    // Allow forward navigation only to next step if current is complete
    if (targetIndex === activeIndex + 1 && completedSteps[activeIndex]) {
      setActiveIndex(targetIndex);
      return;
    }

    // Otherwise prevent navigation
    console.log('Complete current step first');
  };

  const completeCurrentStep = () => {
    const newCompleted = [...completedSteps];
    newCompleted[activeIndex] = true;
    setCompletedSteps(newCompleted);

    if (activeIndex < items.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <div>
      <Steps
        model={items}
        activeIndex={activeIndex}
        onSelect={handleSelect}
        readOnly={false}
      />

      <div className="step-content">
        {/* Step content */}
      </div>

      <button onClick={completeCurrentStep}>
        Complete & Continue
      </button>
    </div>
  );
}
```

### Pattern 4: Custom Step Templates

**Use case**: Display additional information in steps, such as icons, status badges, or custom styling.

**Implementation**: Use the `template` property on MenuItem objects.

```javascript
import React, { useState } from 'react';
import { Steps } from 'primereact/steps';

function CustomTemplateStepper() {
  const [activeIndex, setActiveIndex] = useState(0);

  const stepTemplate = (item, options) => {
    return (
      <div className={`custom-step ${options.active ? 'active' : ''}`}>
        {options.index < activeIndex && (
          <i className="pi pi-check" style={{ color: 'green' }} />
        )}
        {options.index >= activeIndex && (
          <span>{options.index + 1}</span>
        )}
        <div className="step-label">{item.label}</div>
      </div>
    );
  };

  const items = [
    { label: 'Order', template: stepTemplate },
    { label: 'Payment', template: stepTemplate },
    { label: 'Confirmation', template: stepTemplate }
  ];

  return (
    <Steps
      model={items}
      activeIndex={activeIndex}
      readOnly={false}
      onSelect={(e) => setActiveIndex(e.index)}
    />
  );
}
```

### Pattern 5: Steps with Icons

**Use case**: Enhance visual communication by adding icons to steps.

**Implementation**: Use the `icon` property on MenuItem objects.

```javascript
import React, { useState } from 'react';
import { Steps } from 'primereact/steps';

function IconSteps() {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { label: 'Personal', icon: 'pi pi-user' },
    { label: 'Seat', icon: 'pi pi-home' },
    { label: 'Payment', icon: 'pi pi-credit-card' },
    { label: 'Confirmation', icon: 'pi pi-check' }
  ];

  return (
    <Steps
      model={items}
      activeIndex={activeIndex}
      readOnly={false}
      onSelect={(e) => setActiveIndex(e.index)}
    />
  );
}
```

### Pattern 6: Command Callbacks

**Use case**: Execute specific logic when a step is selected, such as analytics tracking or state updates.

**Implementation**: Use the `command` property on MenuItem objects.

```javascript
import React, { useState } from 'react';
import { Steps } from 'primereact/steps';

function CommandSteps() {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    {
      label: 'Step 1',
      command: (event) => {
        console.log('Step 1 selected');
        // Track analytics, validate, etc.
      }
    },
    {
      label: 'Step 2',
      command: (event) => {
        console.log('Step 2 selected');
      }
    },
    {
      label: 'Step 3',
      command: (event) => {
        console.log('Step 3 selected');
      }
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

### Pattern 7: Disabled Steps

**Use case**: Prevent navigation to certain steps based on business logic or permissions.

**Implementation**: Use the `disabled` property on MenuItem objects.

```javascript
import React, { useState } from 'react';
import { Steps } from 'primereact/steps';

function DisabledSteps() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const items = [
    { label: 'Basic Setup' },
    { label: 'Standard Features' },
    {
      label: 'Premium Features',
      disabled: !isPremiumUser
    },
    { label: 'Review' }
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

---

## Variants and Composition

### Single Component

Steps is a standalone component without explicit variants. Customization is achieved through:
- Props (`readOnly`, `className`, `style`)
- MenuItem configuration (labels, icons, templates, disabled states)
- Custom CSS classes and theming
- Template functions for complete rendering control

### No Sub-Components

Unlike some other stepper implementations, PrimeReact Steps does not use multiple sub-components (like separate Step, StepLabel, StepContent components). Instead, it uses a single `<Steps>` component with a MenuItem array model.

---

## Accessibility

### ARIA Support

PrimeReact Steps implements comprehensive ARIA attributes for accessibility:

- **Semantic HTML**: Uses `<nav>` element with an ordered list (`<ol>`) structure
- **aria-current**: The currently active step is marked with `aria-current="step"`
- **aria-label**: Can be set via the `aria-label` prop for screen reader context
- **aria-labelledby**: Can reference an external label via the `aria-labelledby` prop
- **role**: Proper roles are automatically applied to list and list items

### Keyboard Navigation

Full keyboard support for navigation and interaction:

| Key | Action |
|-----|--------|
| **Tab** | Move focus to the Steps component or traverse to next focusable element |
| **Enter** / **Space** | Activate the focused step (when `readOnly={false}`) |
| **Arrow Right** / **Arrow Down** | Move focus to the next step |
| **Arrow Left** / **Arrow Up** | Move focus to the previous step |
| **Home** | Move focus to the first step |
| **End** | Move focus to the last step |

### Screen Reader Support

- Steps are announced as a navigation landmark
- Current step position is communicated (e.g., "Step 2 of 4")
- Step labels are properly exposed to screen readers
- State changes (active step) are announced
- Disabled steps are indicated to assistive technology

### Focus Management

- Proper focus indicators for keyboard navigation
- Focus is maintained when steps change programmatically
- Tab order is logical and sequential

---

## Responsive Design

Steps is designed to be responsive and adapt to different screen sizes. The component automatically adjusts its layout for mobile, tablet, and desktop viewports, though specific breakpoint behaviors are not explicitly documented.

Developers can apply custom responsive styling using the `className` and `style` props, or by targeting PrimeReact's CSS classes with media queries.

---

## Theme Integration

### PrimeReact Theming System

Steps integrates with PrimeReact's comprehensive theming system:

- **Pre-built Themes**: Works with all PrimeReact themes (Material, Bootstrap, etc.)
- **CSS Variables**: Can be customized using PrimeReact's CSS variable system
- **Custom Styling**: Supports `className` and `style` props for component-level customization
- **Global Theme**: Inherits from the global PrimeReact theme configuration

### Styling Options

**Component-Level:**
```javascript
<Steps
  model={items}
  className="my-custom-steps"
  style={{ marginBottom: '2rem' }}
/>
```

**Item-Level:**
```javascript
const items = [
  {
    label: 'Step 1',
    className: 'highlighted-step',
    style: { fontWeight: 'bold' }
  }
];
```

### CSS Class Structure

PrimeReact Steps generates standard CSS classes that can be targeted:
- `.p-steps`: Root container
- `.p-steps-item`: Individual step item
- `.p-steps-number`: Step number indicator
- `.p-steps-title`: Step label/title
- `.p-highlight`: Active step indicator
- `.p-disabled`: Disabled step

---

## Related Components

### Tabs
Alternative UI pattern for organizing content into multiple sections. Unlike Steps, Tabs don't imply sequential progression and are better for categorizing related content.

### Breadcrumb
Shows hierarchical navigation path. Use when displaying location within a nested structure rather than progress through a workflow.

### Timeline
Displays events in chronological order. Use for showing historical data or event sequences rather than interactive workflows.

### Menu
General navigation component. Steps uses MenuItem interface for consistency with PrimeReact's menu system.

### ProgressBar
Shows completion percentage of a single task. Use for file uploads, loading states, or determinate progress rather than multi-step workflows.

---

## Framework-Specific Features

### MenuItem Interface Consistency

PrimeReact Steps leverages the same MenuItem interface used across PrimeReact's navigation components (Menu, MenuBar, TieredMenu, etc.). This provides:
- Consistent API across navigation components
- Familiar patterns for PrimeReact developers
- Shared typings and documentation
- Reusable item definitions

### Integration with PrimeReact Ecosystem

- **PrimeIcons**: Native support for PrimeReact's icon library
- **Theming**: Seamless integration with PrimeReact theme system
- **Form Components**: Designed to work alongside PrimeReact form components in wizard workflows
- **Validation**: Compatible with PrimeReact's form validation patterns

### Template System

PrimeReact's template prop pattern allows complete rendering customization while maintaining component logic and accessibility features. This is a distinctive feature of PrimeReact's component architecture.

---

## Code Examples

### Example 1: Multi-Step Form Wizard

```javascript
import React, { useState } from 'react';
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

function FormWizard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {},
    address: {},
    preferences: {}
  });

  const items = [
    { label: 'Personal Information' },
    { label: 'Address' },
    { label: 'Preferences' },
    { label: 'Confirmation' }
  ];

  const renderStepContent = () => {
    switch(activeIndex) {
      case 0:
        return (
          <div className="field">
            <label htmlFor="firstname">First Name</label>
            <InputText
              id="firstname"
              value={formData.personalInfo.firstName || ''}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, firstName: e.target.value }
              })}
            />
          </div>
        );
      case 1:
        return (
          <div className="field">
            <label htmlFor="address">Address</label>
            <InputText
              id="address"
              value={formData.address.street || ''}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, street: e.target.value }
              })}
            />
          </div>
        );
      case 2:
        return (
          <div className="field">
            <label htmlFor="preferences">Preferences</label>
            <InputText
              id="preferences"
              value={formData.preferences.theme || ''}
              onChange={(e) => setFormData({
                ...formData,
                preferences: { ...formData.preferences, theme: e.target.value }
              })}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h3>Confirmation</h3>
            <p>Name: {formData.personalInfo.firstName}</p>
            <p>Address: {formData.address.street}</p>
            <p>Theme: {formData.preferences.theme}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container">
      <Steps model={items} activeIndex={activeIndex} />

      <div className="wizard-content">
        {renderStepContent()}
      </div>

      <div className="wizard-actions">
        <Button
          label="Previous"
          icon="pi pi-angle-left"
          onClick={() => setActiveIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
        />
        <Button
          label={activeIndex === items.length - 1 ? 'Finish' : 'Next'}
          icon="pi pi-angle-right"
          iconPos="right"
          onClick={() => {
            if (activeIndex === items.length - 1) {
              // Submit form
              console.log('Form submitted:', formData);
            } else {
              setActiveIndex(activeIndex + 1);
            }
          }}
        />
      </div>
    </div>
  );
}

export default FormWizard;
```

### Example 2: E-Commerce Checkout Flow

```javascript
import React, { useState } from 'react';
import { Steps } from 'primereact/steps';
import { Card } from 'primereact/card';

function CheckoutSteps() {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { label: 'Cart', icon: 'pi pi-shopping-cart' },
    { label: 'Shipping', icon: 'pi pi-map-marker' },
    { label: 'Payment', icon: 'pi pi-credit-card' },
    { label: 'Confirmation', icon: 'pi pi-check' }
  ];

  const stepContent = [
    <div>Cart Summary: 3 items, $99.99</div>,
    <div>Enter shipping address</div>,
    <div>Payment information</div>,
    <div>Order confirmed! #12345</div>
  ];

  return (
    <Card>
      <Steps
        model={items}
        activeIndex={activeIndex}
        readOnly={false}
        onSelect={(e) => setActiveIndex(e.index)}
      />

      <div style={{ marginTop: '2rem', padding: '1rem' }}>
        {stepContent[activeIndex]}
      </div>
    </Card>
  );
}

export default CheckoutSteps;
```

### Example 3: Account Setup with Status Indicators

```javascript
import React, { useState } from 'react';
import { Steps } from 'primereact/steps';
import { Badge } from 'primereact/badge';

function AccountSetup() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const customTemplate = (item, options) => {
    const isCompleted = completedSteps.includes(options.index);
    const isCurrent = options.index === activeIndex;

    return (
      <div className="custom-step-item">
        <div className={`step-number ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}>
          {isCompleted ? (
            <i className="pi pi-check" />
          ) : (
            <span>{options.index + 1}</span>
          )}
        </div>
        <div className="step-label">
          {item.label}
          {isCompleted && <Badge value="Done" severity="success" />}
          {isCurrent && !isCompleted && <Badge value="In Progress" severity="info" />}
        </div>
      </div>
    );
  };

  const items = [
    { label: 'Profile', template: customTemplate },
    { label: 'Security', template: customTemplate },
    { label: 'Notifications', template: customTemplate },
    { label: 'Review', template: customTemplate }
  ];

  const completeStep = () => {
    if (!completedSteps.includes(activeIndex)) {
      setCompletedSteps([...completedSteps, activeIndex]);
    }
    if (activeIndex < items.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <div>
      <Steps
        model={items}
        activeIndex={activeIndex}
        readOnly={false}
        onSelect={(e) => setActiveIndex(e.index)}
      />

      <div className="step-content">
        <h3>Step {activeIndex + 1}: {items[activeIndex].label}</h3>
        <p>Complete the information for this step.</p>
        <button onClick={completeStep}>
          {activeIndex < items.length - 1 ? 'Complete & Continue' : 'Finish'}
        </button>
      </div>
    </div>
  );
}

export default AccountSetup;
```

---

## Notes and Observations

### Model-Based Architecture
PrimeReact's MenuItem-based model is distinctive. Rather than composing multiple components (like `<Step>`, `<StepLabel>`, `<StepContent>`), developers define steps declaratively through a configuration array. This approach:
- Reduces JSX verbosity
- Makes dynamic step generation straightforward
- Provides consistency with other PrimeReact navigation components
- May feel less "React-like" to developers expecting component composition

### Read-Only Default
Unlike many stepper implementations that default to interactive mode, PrimeReact Steps defaults to `readOnly={true}`. This makes it a display-only indicator by default, requiring explicit opt-in for interactive navigation. This design choice emphasizes Steps as primarily a progress indicator rather than a navigation control.

### Limited Documentation Specificity
The official documentation provides high-level API coverage but lacks detailed examples for some advanced scenarios like:
- Responsive behavior specifics
- Complex validation patterns
- Animation/transition customization
- Advanced template patterns

### State Management Responsibility
Steps is a fully controlled component with no internal state management for the active index. Developers must manage `activeIndex` state and handle the `onSelect` callback. This provides maximum flexibility but requires more boilerplate than semi-controlled alternatives.

### No Built-in Content Panels
Steps only handles the indicator/navigation portion of a stepper UI. Developers must implement their own content switching logic (typically with conditional rendering based on `activeIndex`). This is different from some implementations that include built-in panel components.

### Template Flexibility
The template system is powerful but requires understanding PrimeReact's template callback signature. Templates receive both the menu item and an options object containing metadata (index, active state, etc.), enabling sophisticated custom rendering.

### Accessibility First
PrimeReact's implementation of comprehensive keyboard navigation and ARIA attributes demonstrates strong commitment to accessibility standards. The semantic HTML structure (`<nav>` with `<ol>`) is appropriate for the component's purpose.

### Icon Integration
Native support for PrimeIcons through the `icon` property provides easy visual enhancement, though developers can also use the template system for custom icon implementations or other icon libraries.

### Validation Patterns Not Built-In
Unlike some enterprise UI libraries, Steps doesn't include built-in validation or step completion tracking. These patterns must be implemented at the application level, giving developers full control but requiring more implementation effort.

### Performance Considerations
The model-based approach with template functions means step rendering logic should be optimized to avoid unnecessary re-renders. Memoization of template functions and items array may be beneficial for complex implementations with many steps.
