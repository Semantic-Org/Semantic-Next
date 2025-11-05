# Ant Design Steps - Usage Patterns

**Research Date**: 2025-11-05
**Component URL**: https://ant.design/components/steps
**Version**: 5.x (latest), 4.x documented

---

## Component Overview

The Steps component is a navigation bar that guides users through sequential, multi-step processes. It visualizes the current position in a workflow and shows progress through a series of logical and numbered stages. Steps is essential for breaking down complex tasks into manageable chunks, particularly useful in wizards, checkout flows, form submissions, and onboarding experiences.

**Primary Use Cases**:
- Multi-step forms and wizards
- Checkout and payment flows
- Installation and setup processes
- Progress tracking interfaces
- Onboarding tutorials
- Application workflows

**Component Philosophy**: Steps provides clear visual feedback about process progression, helping users understand where they are, where they've been, and what comes next.

---

## Basic Usage

### Modern Syntax (v4.24.0+)

```jsx
import { Steps } from 'antd';

const App = () => (
  <Steps
    current={1}
    items={[
      {
        title: 'Finished',
        description: 'This is a description.',
      },
      {
        title: 'In Progress',
        description: 'This is a description.',
      },
      {
        title: 'Waiting',
        description: 'This is a description.',
      },
    ]}
  />
);
```

### Legacy Syntax (Deprecated)

```jsx
import { Steps } from 'antd';
const { Step } = Steps;

// Old pattern - still works but shows console warnings
<Steps current={1}>
  <Step title="Finished" description="This is a description." />
  <Step title="In Progress" description="This is a description." />
  <Step title="Waiting" description="This is a description." />
</Steps>
```

**Recommendation**: Use the `items` array prop for all new implementations. The deprecated `<Step>` child component syntax will be removed in future versions.

---

## Props/API

### Steps Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `current` | number | 0 | Current step index (0-based) |
| `direction` | `horizontal` \| `vertical` | `horizontal` | Display direction of steps |
| `size` | `default` \| `small` | `default` | Size of the step bar |
| `status` | `wait` \| `process` \| `finish` \| `error` | `process` | Status of current step |
| `type` | `default` \| `navigation` \| `inline` | `default` | Type of steps |
| `percent` | number | - | Progress percentage of current step (0-100) |
| `progressDot` | boolean \| (iconDot, {index, status, title, description}) => ReactNode | false | Enable dot style with optional custom renderer |
| `labelPlacement` | `horizontal` \| `vertical` | `horizontal` | Position of title and description |
| `responsive` | boolean | true | Auto-switch to vertical on screens < 532px |
| `onChange` | (current: number) => void | - | Trigger when step is clicked (enables navigation) |
| `items` | StepItem[] | [] | Array of step configurations |
| `initial` | number | 0 | Initial step index |
| `className` | string | - | Additional CSS class |
| `style` | CSSProperties | - | Inline styles |

### StepItem Props

Each item in the `items` array accepts:

| Prop | Type | Description |
|------|------|-------------|
| `title` | ReactNode | Step title |
| `subTitle` | ReactNode | Sub-title (e.g., timing information) |
| `description` | ReactNode | Detailed description below title |
| `icon` | ReactNode | Custom icon to replace default numbered circle |
| `status` | `wait` \| `process` \| `finish` \| `error` | Override parent status for this step |
| `disabled` | boolean | Disable click interaction for this step |

---

## Common Patterns

### Pattern 1: Controlled Navigation with State

```jsx
import { Steps, Button, message } from 'antd';
import { useState } from 'react';

const App = () => {
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: 'First',
      description: 'Fill in basic information',
    },
    {
      title: 'Second',
      description: 'Configure settings',
    },
    {
      title: 'Last',
      description: 'Review and submit',
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Steps current={current} items={steps} />
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prev}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};
```

### Pattern 2: Content Switching Based on Current Step

```jsx
import { Steps } from 'antd';
import { useState } from 'react';

const steps = [
  {
    title: 'Account Info',
    description: 'Enter your details',
  },
  {
    title: 'Verification',
    description: 'Verify your identity',
  },
  {
    title: 'Complete',
    description: 'Finish setup',
  },
];

const stepContent = [
  <div>Account Information Form Content</div>,
  <div>Verification Form Content</div>,
  <div>Completion Summary Content</div>,
];

const App = () => {
  const [current, setCurrent] = useState(0);

  return (
    <>
      <Steps current={current} items={steps} />
      <div className="steps-content" style={{ marginTop: 24 }}>
        {stepContent[current]}
      </div>
    </>
  );
};
```

### Pattern 3: Error State Handling

```jsx
import { Steps } from 'antd';
import { useState } from 'react';

const App = () => {
  const [current, setCurrent] = useState(1);
  const [status, setStatus] = useState('error');

  const items = [
    {
      title: 'Finished',
      description: 'Step completed',
    },
    {
      title: 'In Progress',
      description: 'Validation failed',
      status: 'error', // Override status for this step
    },
    {
      title: 'Waiting',
      description: 'Not started',
    },
  ];

  return <Steps current={current} status={status} items={items} />;
};
```

---

## Orientation Patterns

### Horizontal Steps (Default)

```jsx
<Steps
  current={1}
  items={[
    { title: 'Step 1', description: 'First step' },
    { title: 'Step 2', description: 'Second step' },
    { title: 'Step 3', description: 'Third step' },
  ]}
/>
```

**Use Cases**:
- Desktop layouts with sufficient width
- Short workflows (3-5 steps)
- Top navigation in forms

### Vertical Steps

```jsx
<Steps
  direction="vertical"
  current={1}
  items={[
    {
      title: 'Step 1',
      description: 'This is the first step with detailed description'
    },
    {
      title: 'Step 2',
      description: 'This is the second step with detailed description'
    },
    {
      title: 'Step 3',
      description: 'This is the third step with detailed description'
    },
  ]}
/>
```

**Use Cases**:
- Narrow layouts or sidebars
- Many steps (5+ steps)
- Content-heavy descriptions
- Mobile responsive designs

### Responsive Layout

```jsx
<Steps
  responsive={true}
  current={1}
  items={[
    { title: 'Login', description: 'Enter credentials' },
    { title: 'Verification', description: 'Two-factor auth' },
    { title: 'Select role', description: 'Choose your role' },
  ]}
/>
```

**Behavior**: Automatically switches from horizontal to vertical when viewport width < 532px.

---

## Size Patterns

### Default Size

```jsx
<Steps
  size="default"
  current={1}
  items={[
    { title: 'Step 1' },
    { title: 'Step 2' },
    { title: 'Step 3' },
  ]}
/>
```

**Use Cases**: Primary forms, main workflows, prominent placement

### Small Size (Mini)

```jsx
<Steps
  size="small"
  current={1}
  items={[
    { title: 'Login' },
    { title: 'Verification' },
    { title: 'Complete' },
  ]}
/>
```

**Use Cases**:
- Space-constrained layouts
- Sidebar navigation
- Compact dashboards
- Embedded in modals or cards

---

## Status Patterns

### Wait Status (Not Started)

```jsx
<Steps
  current={2}
  items={[
    { title: 'Finished', status: 'finish' },
    { title: 'In Progress', status: 'process' },
    { title: 'Waiting', status: 'wait' }, // Gray, unfilled
  ]}
/>
```

**Visual**: Gray icon, unfilled circle
**Meaning**: Step not yet reached

### Process Status (Active)

```jsx
<Steps
  current={1}
  status="process"
  items={[
    { title: 'Step 1' },
    { title: 'Step 2' }, // Blue, filled (current step)
    { title: 'Step 3' },
  ]}
/>
```

**Visual**: Blue icon, filled circle
**Meaning**: Currently active step

### Finish Status (Completed)

```jsx
<Steps
  current={2}
  items={[
    { title: 'Login', status: 'finish' }, // Green checkmark
    { title: 'Verification', status: 'finish' }, // Green checkmark
    { title: 'Complete', status: 'process' },
  ]}
/>
```

**Visual**: Green checkmark icon
**Meaning**: Step successfully completed

### Error Status (Failed)

```jsx
<Steps
  current={1}
  status="error"
  items={[
    { title: 'Account', status: 'finish' },
    { title: 'Verification', status: 'error' }, // Red X icon
    { title: 'Complete', status: 'wait' },
  ]}
/>
```

**Visual**: Red X icon, error styling
**Meaning**: Step failed validation or encountered error

### Mixed Status Per Step

```jsx
<Steps
  current={2}
  items={[
    { title: 'Login', status: 'finish' },
    { title: 'Payment', status: 'error' }, // Step 2 error
    { title: 'Confirmation', status: 'wait' },
  ]}
/>
```

**Pattern**: Each step can override global status

---

## Type Patterns

### Default Type

```jsx
<Steps
  type="default"
  current={1}
  items={[
    { title: 'Step 1', description: 'Description' },
    { title: 'Step 2', description: 'Description' },
    { title: 'Step 3', description: 'Description' },
  ]}
/>
```

**Visual**: Numbered circles with connecting lines
**Use Cases**: Standard multi-step processes, forms, wizards

### Navigation Type

```jsx
<Steps
  type="navigation"
  current={1}
  onChange={(current) => console.log('Clicked step:', current)}
  items={[
    {
      title: 'Step 1',
      subTitle: '00:00:08',
      status: 'finish',
      description: 'This is a description',
    },
    {
      title: 'Step 2',
      subTitle: '00:01:02',
      status: 'process',
      description: 'This is a description',
    },
    {
      title: 'Step 3',
      subTitle: 'waiting for longlong time',
      status: 'wait',
      description: 'This is a description',
    },
  ]}
/>
```

**Visual**: Tab-like navigation style
**Features**:
- More prominent, clickable appearance
- Better suited for page navigation
- Displays subTitle prominently
- Horizontal pill/tab design

**Use Cases**:
- Page-level navigation
- Multi-page forms
- Settings sections
- Dashboard tabs

### Inline Type

```jsx
<Steps
  type="inline"
  current={1}
  items={[
    { title: 'Login' },
    { title: 'Verification' },
    { title: 'Pay' },
    { title: 'Done' },
  ]}
/>
```

**Visual**: Compact inline display
**Use Cases**:
- List content scenes
- Table rows
- Compact status display
- Process state in lists

---

## Content Patterns

### Title Only

```jsx
<Steps
  current={1}
  items={[
    { title: 'Login' },
    { title: 'Verification' },
    { title: 'Pay' },
    { title: 'Done' },
  ]}
/>
```

**Use Cases**: Simple, clear workflows where step names are self-explanatory

### Title with Description

```jsx
<Steps
  current={1}
  items={[
    {
      title: 'Create Account',
      description: 'Enter your email and password',
    },
    {
      title: 'Verify Email',
      description: 'Check your inbox for verification link',
    },
    {
      title: 'Complete Profile',
      description: 'Add your personal information',
    },
  ]}
/>
```

**Use Cases**: Complex workflows requiring additional context

### Title with SubTitle

```jsx
<Steps
  type="navigation"
  current={1}
  items={[
    {
      title: 'Step 1',
      subTitle: 'Left 00:00:08',
    },
    {
      title: 'Step 2',
      subTitle: 'Left 00:01:02',
    },
    {
      title: 'Step 3',
      subTitle: 'Left 00:00:05',
    },
  ]}
/>
```

**Use Cases**:
- Time-based processes
- Deadline tracking
- Estimated completion times
- Secondary metadata

### Custom Icons

```jsx
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';

<Steps
  current={1}
  items={[
    {
      title: 'Login',
      icon: <UserOutlined />,
    },
    {
      title: 'Verification',
      icon: <SolutionOutlined />,
    },
    {
      title: 'Pay',
      icon: <LoadingOutlined />,
    },
    {
      title: 'Done',
      icon: <SmileOutlined />,
    },
  ]}
/>
```

**Use Cases**:
- Brand-specific iconography
- Process-specific symbols
- Enhanced visual communication
- Accessibility improvements

### Rich Content (JSX in Title/Description)

```jsx
<Steps
  current={1}
  items={[
    {
      title: 'Finished',
      description: (
        <div>
          <p>Completed at 12:30</p>
          <a href="#">View details</a>
        </div>
      ),
    },
    {
      title: 'In Progress',
      description: 'Current step description',
    },
    {
      title: 'Waiting',
      description: 'Future step description',
    },
  ]}
/>
```

**Use Cases**: Complex metadata, links, formatted text

---

## Navigation Patterns

### Clickable Steps

```jsx
import { Steps } from 'antd';
import { useState } from 'react';

const App = () => {
  const [current, setCurrent] = useState(0);

  const onChange = (value) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  return (
    <Steps
      current={current}
      onChange={onChange} // Enables clicking
      items={[
        { title: 'Step 1', description: 'Click to navigate' },
        { title: 'Step 2', description: 'Click to navigate' },
        { title: 'Step 3', description: 'Click to navigate' },
      ]}
    />
  );
};
```

**Pattern**: Setting `onChange` prop makes all steps clickable

### Conditional Navigation (Disabled Steps)

```jsx
import { Steps } from 'antd';
import { useState } from 'react';

const App = () => {
  const [current, setCurrent] = useState(0);

  return (
    <Steps
      current={current}
      onChange={(value) => setCurrent(value)}
      items={[
        { title: 'Step 1', description: 'Available' },
        {
          title: 'Step 2',
          description: 'Complete Step 1 first',
          disabled: current < 1, // Conditionally disable
        },
        {
          title: 'Step 3',
          description: 'Complete Step 2 first',
          disabled: current < 2,
        },
      ]}
    />
  );
};
```

**Pattern**: Use `disabled` prop to prevent navigation to incomplete prerequisites

### Sequential Navigation Only

```jsx
const App = () => {
  const [current, setCurrent] = useState(0);

  const onChange = (value) => {
    // Only allow forward navigation to next step
    if (value === current + 1) {
      setCurrent(value);
    }
    // Or allow backward navigation
    if (value < current) {
      setCurrent(value);
    }
  };

  return (
    <Steps current={current} onChange={onChange} items={steps} />
  );
};
```

**Pattern**: Control navigation logic in `onChange` handler

---

## Progress Patterns

### Current Step Indicator

```jsx
<Steps
  current={1} // Highlights step at index 1
  items={[
    { title: 'Step 1', status: 'finish' },
    { title: 'Step 2', status: 'process' }, // Current
    { title: 'Step 3', status: 'wait' },
  ]}
/>
```

**Visual**: Current step shown with blue color and process icon

### Progress Percentage

```jsx
<Steps
  current={1}
  percent={60} // Shows 60% progress in current step
  items={[
    { title: 'Step 1' },
    { title: 'Step 2' }, // Shows 60% circular progress
    { title: 'Step 3' },
  ]}
/>
```

**Visual**: Small circular progress indicator inside step icon
**Use Cases**: Long-running operations, file uploads, multi-part steps

### Progress Dot Style

```jsx
<Steps
  progressDot
  current={1}
  items={[
    { title: 'Finished', description: 'This is a description.' },
    { title: 'In Progress', description: 'This is a description.' },
    { title: 'Waiting', description: 'This is a description.' },
  ]}
/>
```

**Visual**: Small dots instead of numbered circles
**Use Cases**:
- Minimalist design
- Space-constrained layouts
- Many steps (7+)
- Timeline-style displays

### Custom Progress Dot Render

```jsx
import { Popover, Steps } from 'antd';

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

<Steps
  current={1}
  progressDot={customDot}
  items={[
    { title: 'Finished', description: 'You can hover on the dot.' },
    { title: 'In Progress', description: 'You can hover on the dot.' },
    { title: 'Waiting', description: 'You can hover on the dot.' },
  ]}
/>
```

**Pattern**: Use custom render function to wrap dots with tooltips, popovers, or custom styling

### Vertical Progress Dot

```jsx
<Steps
  progressDot
  direction="vertical"
  current={1}
  items={[
    { title: 'Finished', description: 'This is a description.' },
    { title: 'In Progress', description: 'This is a description.' },
    { title: 'Waiting', description: 'This is a description.' },
  ]}
/>
```

**Use Cases**: Timeline displays, activity feeds, version history

---

## Accessibility

### ARIA Attributes

Ant Design Steps automatically includes:
- `role="navigation"` on the Steps container
- `aria-current="step"` on the current step
- Semantic HTML structure for screen readers

### Keyboard Navigation

**Pattern**: When `onChange` is provided, steps become keyboard accessible:
- **Tab**: Move focus between steps
- **Enter/Space**: Activate focused step
- **Arrow keys**: Navigate between steps (in some implementations)

### Screen Reader Support

```jsx
<Steps
  current={1}
  items={[
    {
      title: 'Step 1',
      description: 'Completed',
      'aria-label': 'Step 1: Account creation - Completed', // Custom ARIA label
    },
    {
      title: 'Step 2',
      description: 'In progress',
      'aria-label': 'Step 2: Verification - In progress',
    },
  ]}
/>
```

**Best Practices**:
- Provide clear, descriptive titles
- Use status to convey state (finish, error, etc.)
- Include descriptions for complex steps
- Ensure sufficient color contrast
- Don't rely on color alone to convey status

### Focus Management

```jsx
import { Steps } from 'antd';
import { useRef, useEffect } from 'react';

const App = () => {
  const [current, setCurrent] = useState(0);
  const stepsRef = useRef(null);

  useEffect(() => {
    // Focus management when step changes
    if (stepsRef.current) {
      const currentStep = stepsRef.current.querySelector('.ant-steps-item-active');
      if (currentStep) {
        currentStep.focus();
      }
    }
  }, [current]);

  return (
    <Steps
      ref={stepsRef}
      current={current}
      onChange={setCurrent}
      items={steps}
    />
  );
};
```

---

## Integration Patterns

### Form Integration (Multi-Step Form)

```jsx
import { Steps, Form, Input, Button, message } from 'antd';
import { useState } from 'react';

const App = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  const steps = [
    {
      title: 'Account',
      content: (
        <Form form={form}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Profile',
      content: (
        <Form form={form}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Done',
      content: <div>Review and submit your information</div>,
    },
  ];

  const next = async () => {
    try {
      await form.validateFields();
      setCurrent(current + 1);
    } catch (error) {
      message.error('Please complete all required fields');
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = () => {
    message.success('Processing complete!');
  };

  return (
    <>
      <Steps current={current} items={steps} />
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={onFinish}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prev}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};
```

### Wizard Pattern

```jsx
import { Steps, Card } from 'antd';
import { useState } from 'react';

const Wizard = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = [
    {
      title: 'Basic Info',
      description: 'Personal details',
    },
    {
      title: 'Address',
      description: 'Location information',
    },
    {
      title: 'Confirmation',
      description: 'Review and submit',
    },
  ];

  const updateData = (data) => {
    setFormData({ ...formData, ...data });
    setCurrent(current + 1);
  };

  return (
    <Card>
      <Steps current={current} items={steps} />
      <div style={{ marginTop: 24, minHeight: 300 }}>
        {/* Step-specific form components */}
        {current === 0 && <BasicInfoForm onSubmit={updateData} />}
        {current === 1 && <AddressForm onSubmit={updateData} data={formData} />}
        {current === 2 && <ConfirmationView data={formData} />}
      </div>
    </Card>
  );
};
```

### Checkout Flow

```jsx
import { Steps } from 'antd';
import { ShoppingCartOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';

const CheckoutSteps = ({ current }) => (
  <Steps
    current={current}
    items={[
      {
        title: 'Shopping Cart',
        icon: <ShoppingCartOutlined />,
        description: 'Review items',
      },
      {
        title: 'Payment',
        icon: <CreditCardOutlined />,
        description: 'Enter payment details',
      },
      {
        title: 'Complete',
        icon: <CheckCircleOutlined />,
        description: 'Order confirmation',
      },
    ]}
  />
);
```

### Progress Tracking Dashboard

```jsx
import { Steps, Card, Row, Col } from 'antd';

const OrderTracking = ({ orderStatus }) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < orderStatus.current) return 'finish';
    if (stepIndex === orderStatus.current) {
      return orderStatus.hasError ? 'error' : 'process';
    }
    return 'wait';
  };

  return (
    <Card title="Order Tracking">
      <Steps
        current={orderStatus.current}
        items={[
          {
            title: 'Order Placed',
            description: orderStatus.placedDate,
            status: getStepStatus(0),
          },
          {
            title: 'Processing',
            description: 'Preparing your order',
            status: getStepStatus(1),
          },
          {
            title: 'Shipped',
            description: orderStatus.trackingNumber,
            status: getStepStatus(2),
          },
          {
            title: 'Delivered',
            description: 'Expected delivery date',
            status: getStepStatus(3),
          },
        ]}
      />
    </Card>
  );
};
```

---

## Advanced Patterns

### Dynamic Steps (Runtime Generation)

```jsx
import { Steps, Button } from 'antd';
import { useState } from 'react';

const App = () => {
  const [steps, setSteps] = useState([
    { title: 'Step 1' },
    { title: 'Step 2' },
  ]);
  const [current, setCurrent] = useState(0);

  const addStep = () => {
    setSteps([...steps, { title: `Step ${steps.length + 1}` }]);
  };

  return (
    <>
      <Steps current={current} items={steps} />
      <Button onClick={addStep}>Add Step</Button>
    </>
  );
};
```

### Conditional Step Visibility

```jsx
import { Steps } from 'antd';

const App = ({ userType }) => {
  const baseSteps = [
    { title: 'Account' },
    { title: 'Profile' },
  ];

  const enterpriseSteps = [
    { title: 'Company Info' },
    { title: 'Team Members' },
  ];

  const allSteps = userType === 'enterprise'
    ? [...baseSteps, ...enterpriseSteps, { title: 'Complete' }]
    : [...baseSteps, { title: 'Complete' }];

  return <Steps current={0} items={allSteps} />;
};
```

### Branching Workflows

```jsx
import { Steps } from 'antd';
import { useState } from 'react';

const App = () => {
  const [current, setCurrent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const getSteps = () => {
    const baseSteps = [
      { title: 'Cart' },
      { title: 'Payment Method' },
    ];

    if (paymentMethod === 'card') {
      return [...baseSteps,
        { title: 'Card Details' },
        { title: 'Complete' },
      ];
    } else if (paymentMethod === 'paypal') {
      return [...baseSteps,
        { title: 'PayPal Login' },
        { title: 'Complete' },
      ];
    }

    return [...baseSteps, { title: 'Complete' }];
  };

  return <Steps current={current} items={getSteps()} />;
};
```

### Nested Steps (Sub-processes)

```jsx
import { Steps, Card } from 'antd';

const MainProcess = () => {
  const [mainStep, setMainStep] = useState(0);
  const [subStep, setSubStep] = useState(0);

  return (
    <>
      <Steps
        current={mainStep}
        items={[
          { title: 'Registration' },
          { title: 'Verification' },
          { title: 'Complete' },
        ]}
      />

      {mainStep === 1 && (
        <Card style={{ marginTop: 24 }}>
          <Steps
            size="small"
            current={subStep}
            items={[
              { title: 'Email' },
              { title: 'Phone' },
              { title: 'Identity' },
            ]}
          />
        </Card>
      )}
    </>
  );
};
```

### Async Validation Between Steps

```jsx
import { Steps, Button, message, Spin } from 'antd';
import { useState } from 'react';

const App = () => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  const validateStep = async (stepIndex) => {
    setLoading(true);
    try {
      // Simulate API validation
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.2) {
            resolve();
          } else {
            reject(new Error('Validation failed'));
          }
        }, 1000);
      });
      return true;
    } catch (error) {
      message.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const next = async () => {
    const isValid = await validateStep(current);
    if (isValid) {
      setCurrent(current + 1);
    }
  };

  return (
    <Spin spinning={loading}>
      <Steps current={current} items={steps} />
      <Button onClick={next} disabled={loading}>
        Next
      </Button>
    </Spin>
  );
};
```

### Save Progress Pattern

```jsx
import { Steps, Button } from 'antd';
import { useState, useEffect } from 'react';

const App = () => {
  const [current, setCurrent] = useState(0);

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem('wizardProgress');
    if (saved) {
      setCurrent(parseInt(saved, 10));
    }
  }, []);

  // Save progress whenever step changes
  useEffect(() => {
    localStorage.setItem('wizardProgress', current.toString());
  }, [current]);

  const resetProgress = () => {
    setCurrent(0);
    localStorage.removeItem('wizardProgress');
  };

  return (
    <>
      <Steps current={current} items={steps} />
      <Button onClick={resetProgress}>Reset Progress</Button>
    </>
  );
};
```

### Label Placement Variants

```jsx
// Horizontal label placement (default)
<Steps
  current={1}
  labelPlacement="horizontal"
  items={[
    { title: 'Step 1', description: 'Description below title' },
    { title: 'Step 2', description: 'Description below title' },
  ]}
/>

// Vertical label placement
<Steps
  current={1}
  labelPlacement="vertical"
  items={[
    { title: 'Step 1', description: 'Description below title' },
    { title: 'Step 2', description: 'Description below title' },
  ]}
/>
```

**Use Cases**:
- `horizontal`: Default, labels beside icons
- `vertical`: Compact layouts, labels stack below icons

---

## Notes

### Important Observations

1. **Modern API Preference**: The `items` array prop is now the recommended pattern. The deprecated `<Steps.Step>` child component pattern still works but will be removed in future versions.

2. **Zero-based Indexing**: The `current` prop uses 0-based indexing (first step is 0, not 1).

3. **Automatic Status**: Steps automatically manage status based on position relative to `current`:
   - Steps before current: `finish`
   - Current step: `process`
   - Steps after current: `wait`

4. **Clickable Steps**: Steps become clickable only when `onChange` prop is provided. Without it, steps are display-only.

5. **Responsive Behavior**: By default (`responsive={true}`), Steps automatically switches to vertical orientation on screens narrower than 532px.

6. **Navigation Type Limitations**: The `navigation` type works best with horizontal orientation and has different styling than the default type.

7. **Progress Dot Customization**: The `progressDot` prop accepts either a boolean or a render function, allowing complete control over dot appearance.

8. **Icon Priority**: If both a custom `icon` and `progressDot` are specified, the custom icon takes precedence over the dot style.

9. **Status Override**: Individual step items can override the global `status` prop by setting their own `status` property.

10. **SubTitle Usage**: SubTitle is most commonly used with `type="navigation"` and may not display properly with other types.

### Best Practices

1. **Step Count**: Keep steps between 3-7 for optimal user experience. Too many steps can overwhelm users.

2. **Clear Titles**: Use concise, action-oriented titles (e.g., "Enter Details" rather than "Details").

3. **Descriptions**: Add descriptions for complex steps or when additional context helps users.

4. **Validation**: Always validate current step before allowing navigation to next step in critical workflows.

5. **Error Handling**: Use error status and clear messaging when step validation fails.

6. **Progress Indication**: Consider using `percent` prop for long-running operations within a step.

7. **Accessibility**: Always provide meaningful titles and descriptions for screen reader users.

8. **Mobile Considerations**: Test responsive behavior or explicitly use vertical orientation for mobile-first designs.

9. **State Persistence**: For long forms, consider saving progress to localStorage or backend.

10. **Visual Consistency**: Match step count in Steps component with actual content sections.

### Migration Notes

**From Old API to New API**:

```jsx
// Old (Deprecated)
<Steps current={1}>
  <Steps.Step title="Step 1" description="Description" />
  <Steps.Step title="Step 2" description="Description" />
</Steps>

// New (Recommended)
<Steps
  current={1}
  items={[
    { title: 'Step 1', description: 'Description' },
    { title: 'Step 2', description: 'Description' },
  ]}
/>
```

### Common Pitfalls

1. **Forgetting onChange**: Steps won't be clickable without the `onChange` prop.

2. **Index Confusion**: Remember `current` is 0-based, not 1-based.

3. **Status Management**: Don't try to manually set status for all steps—let the component handle it based on `current`.

4. **Responsive Issues**: If Steps overflow on mobile, ensure `responsive={true}` or use `direction="vertical"`.

5. **Icon Sizing**: Custom icons should be appropriately sized (usually 24x24px) to match default styling.

6. **Navigation Type Width**: Navigation type Steps need more horizontal space than default type.

### Performance Considerations

1. **Memoization**: When using large step arrays or custom render functions, consider using `useMemo` to prevent unnecessary re-renders.

2. **Conditional Rendering**: For complex step content, use conditional rendering rather than rendering all steps and hiding them.

3. **Heavy Components**: If step content includes heavy components, consider lazy loading or code splitting.

---

## Related Components

- **Progress**: For simple linear progress indication without steps
- **Timeline**: For event sequences and historical data display
- **Menu**: For navigation without sequential flow
- **Tabs**: For non-sequential content organization
- **Breadcrumb**: For hierarchical navigation

---

## Comparison with Similar Components

| Feature | Steps | Progress | Timeline | Tabs |
|---------|-------|----------|----------|------|
| Sequential flow | ✅ | ✅ | ❌ | ❌ |
| Clickable navigation | ✅ | ❌ | ❌ | ✅ |
| Progress indication | ✅ | ✅ | ❌ | ❌ |
| Historical events | ❌ | ❌ | ✅ | ❌ |
| Current state highlight | ✅ | ✅ | ❌ | ✅ |
| Descriptions | ✅ | ❌ | ✅ | ✅ |
| Error states | ✅ | ✅ | ❌ | ❌ |

**When to use Steps**: Multi-step processes with clear sequential flow, wizards, checkout flows, onboarding.

**When to use Progress**: Simple percentage-based progress without distinct stages.

**When to use Timeline**: Historical events, activity logs, version history (non-interactive).

**When to use Tabs**: Non-sequential content organization where users can jump between sections freely.

---

## Summary

The Ant Design Steps component is a robust, feature-rich solution for guiding users through multi-step processes. Its modern `items` array API provides a clean, declarative way to define steps while maintaining flexibility through customization options.

**Key Strengths**:
- Clean, modern API with backward compatibility
- Comprehensive status management (wait, process, finish, error)
- Multiple display modes (default, navigation, inline)
- Flexible orientation (horizontal, vertical, responsive)
- Rich content support (titles, subtitles, descriptions, icons)
- Progress indication and dot style variants
- Accessibility built-in

**Recommended Use Cases**:
- Multi-step forms and wizards
- Checkout and payment flows
- Onboarding processes
- Installation wizards
- Progress tracking dashboards
- Sequential workflow guidance

The component excels at providing clear visual feedback about process progression while offering enough flexibility to handle complex workflows, error states, and custom styling requirements.
