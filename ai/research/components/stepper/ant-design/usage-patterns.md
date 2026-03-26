# Stepper / Wizard - Ant Design Usage Patterns

> **Framework**: Ant Design
> **Component**: Steps
> **Documentation**: https://ant.design/components/steps / https://4x.ant.design/components/steps
> **Research Date**: 2025-11-06

## Component Definition

The Steps component in Ant Design is a navigation bar that guides users through the steps of a task in a sequential manner. It serves as a visual progress indicator that decomposes complicated tasks with specific sequences into manageable subtasks.

**Mental Model**: Steps provides a linear workflow visualization where users can see their current position in a multi-step process, what steps have been completed, and what remains. It's particularly useful for wizards, forms, onboarding flows, and any process that requires users to complete tasks in a specific order.

**When to Use**:
- When a task is complicated or has a certain sequence in the series of subtasks
- When there is a need to decompose a task into sequential steps
- When you need to inform users which steps have been completed and which step they are currently at
- For multi-step forms, checkout processes, installation wizards, or onboarding flows

## Core Features

### Modern Items API (v4.24.0+)

Starting with version 4.24.0, Ant Design introduced a simplified `items` array API that provides better performance and cleaner code. This modern API is the recommended approach, and the older `<Steps.Step>` child component pattern was deprecated in browser console warnings and removed in Ant Design v5.0.

```javascript
const items = [
  { title: 'First Step' },
  { title: 'Second Step' },
  { title: 'Third Step' }
];
<Steps items={items} current={1} />
```

### Sequential Navigation

Steps manages sequential task progression through a current step index (0-based). The component visually indicates:
- **Completed steps**: Steps before the current index (typically with checkmarks)
- **Current step**: The active step being worked on (highlighted)
- **Upcoming steps**: Steps after the current index (waiting state)

### Status Visualization

Each step can display different statuses to communicate progress:
- **wait**: Step is pending and not yet started
- **process**: Step is currently active and in progress
- **finish**: Step has been completed successfully
- **error**: Step encountered an error or validation failure

### Direction and Layout

Steps supports both horizontal and vertical orientations:
- **Horizontal** (default): Steps arranged left-to-right, ideal for forms and wizards
- **Vertical**: Steps stacked top-to-bottom, suitable for sidebars and narrow layouts
- **Responsive**: Automatically switches to vertical on screens narrower than 532px (configurable via `responsive` prop)

### Size Variants

Two size options are available:
- **default**: Standard size for typical use cases
- **small**: Compact version for space-constrained layouts

### Progress Visualization Types

**Standard Mode** (default): Traditional step indicators with connecting lines

**Progress Dot Mode**: Circular dot indicators instead of numbered steps, providing a more subtle visual style. Can be enabled via `progressDot` boolean or customized with a function for interactive features.

**Navigation Mode**: Designed for page-level navigation in multi-step processes, with a different visual treatment optimized for top-level navigation bars.

### Interactive Stepping

When the `onChange` callback is provided, Steps becomes clickable, allowing users to navigate between steps by clicking on them. This enables non-linear navigation when appropriate for the workflow.

### Progress Percentage

The `percent` prop (added in v4.5.0) allows displaying a progress percentage for the current step, useful for showing completion status of long-running operations within a step.

### Custom Icons

Each step can have custom icons defined through the `icon` property in the items array, allowing for visual differentiation and enhanced meaning communication.

### Label Placement

The `labelPlacement` prop controls whether step titles and descriptions are placed horizontally (beside the indicator) or vertically (below the indicator), providing layout flexibility.

## Props API

### Steps Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | - | Additional CSS class name for custom styling |
| `current` | number | 0 | Current active step index (0-based) |
| `direction` | 'horizontal' \| 'vertical' | 'horizontal' | Layout direction of steps |
| `initial` | number | 0 | Initial step index, useful for starting at a specific step |
| `labelPlacement` | 'horizontal' \| 'vertical' | 'horizontal' | Placement of step title and description relative to indicator |
| `percent` | number | - | Progress percentage of current step (0-100), displays progress within the step (v4.5.0+) |
| `progressDot` | boolean \| (iconDot, {index, status, title, description}) => ReactNode | false | Enable dot-style progress indicators; can be function for custom rendering |
| `responsive` | boolean | true | Automatically change to vertical direction when screen width < 532px |
| `size` | 'default' \| 'small' | 'default' | Size of the steps component |
| `status` | 'wait' \| 'process' \| 'finish' \| 'error' | 'process' | Status of current step, affects visual styling |
| `type` | 'default' \| 'navigation' | 'default' | Type of steps; navigation is optimized for page-level navigation |
| `onChange` | (current: number) => void | - | Callback triggered when current step changes; makes steps clickable when provided |
| `items` | StepItem[] | [] | Array of step item objects defining each step (v4.24.0+) |

### StepItem Object Props

Each object in the `items` array supports the following properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | ReactNode | - | Primary title text for the step |
| `description` | ReactNode | - | Detailed description text displayed below the title |
| `subTitle` | ReactNode | - | Secondary title text, often used for time estimates or additional context |
| `icon` | ReactNode | - | Custom icon component to display instead of the default step number |
| `status` | 'wait' \| 'process' \| 'finish' \| 'error' | 'wait' | Override status for individual step; typically managed by parent Steps component |
| `disabled` | boolean | false | Whether the step is disabled and non-clickable |

## Usage Patterns

### Pattern 1: Basic Linear Wizard

**Use case**: Simple multi-step process where users progress sequentially through steps.

**Implementation**: Use the `current` prop to track active step, update it as user completes each step.

```javascript
import { Steps } from 'antd';

const items = [
  { title: 'Step 1', description: 'This is step 1' },
  { title: 'Step 2', description: 'This is step 2' },
  { title: 'Step 3', description: 'This is step 3' }
];

const App = () => {
  const [current, setCurrent] = React.useState(0);

  return (
    <div>
      <Steps current={current} items={items} />
      {/* Step content here */}
      <Button onClick={() => setCurrent(current + 1)}>Next</Button>
    </div>
  );
};
```

### Pattern 2: Interactive Step Navigation

**Use case**: Allow users to jump between steps freely (non-linear navigation).

**Implementation**: Provide `onChange` callback to make steps clickable.

```javascript
const App = () => {
  const [current, setCurrent] = React.useState(0);

  return (
    <Steps
      current={current}
      onChange={setCurrent}
      items={[
        { title: 'Login' },
        { title: 'Verification' },
        { title: 'Pay' },
        { title: 'Done' }
      ]}
    />
  );
};
```

### Pattern 3: Custom Icons per Step

**Use case**: Use meaningful icons to enhance step recognition and visual hierarchy.

**Implementation**: Define `icon` property in each item with icon components.

```javascript
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';

const items = [
  { title: 'Login', icon: <UserOutlined /> },
  { title: 'Verification', icon: <SolutionOutlined /> },
  { title: 'Pay', icon: <LoadingOutlined /> },
  { title: 'Done', icon: <SmileOutlined /> }
];

<Steps current={1} items={items} />
```

### Pattern 4: Error State Handling

**Use case**: Indicate when a step fails validation or encounters an error.

**Implementation**: Set `status="error"` on Steps component to show error state for current step.

```javascript
const App = () => {
  const [current, setCurrent] = React.useState(1);
  const [hasError, setHasError] = React.useState(true);

  return (
    <Steps
      current={current}
      status={hasError ? 'error' : 'process'}
      items={[
        { title: 'Step 1' },
        { title: 'Step 2' },
        { title: 'Step 3' }
      ]}
    />
  );
};
```

### Pattern 5: Vertical Layout for Sidebars

**Use case**: Display steps in narrow sidebar or mobile layouts.

**Implementation**: Set `direction="vertical"` for top-to-bottom layout.

```javascript
<Steps
  direction="vertical"
  current={1}
  items={[
    { title: 'Finished', description: 'This is a description' },
    { title: 'In Progress', description: 'This is a description' },
    { title: 'Waiting', description: 'This is a description' }
  ]}
/>
```

### Pattern 6: Progress Dot Style

**Use case**: More subtle visual style suitable for decorative contexts or secondary workflows.

**Implementation**: Enable `progressDot` boolean prop.

```javascript
<Steps
  progressDot
  current={1}
  items={[
    { title: 'Finished', description: 'You can hover on the dot' },
    { title: 'In Progress', description: 'You can hover on the dot' },
    { title: 'Waiting', description: 'You can hover on the dot' }
  ]}
/>
```

### Pattern 7: Custom Progress Dots with Popovers

**Use case**: Provide additional information on hover/click of progress indicators.

**Implementation**: Use function form of `progressDot` to render custom interactive elements.

```javascript
import { Popover } from 'antd';

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>step {index} status: {status}</span>
    }
  >
    {dot}
  </Popover>
);

<Steps progressDot={customDot} current={1} items={items} />
```

### Pattern 8: Navigation Type for Page Routing

**Use case**: Multi-page workflows where each step represents a different page.

**Implementation**: Use `type="navigation"` for page-level navigation styling.

```javascript
<Steps
  type="navigation"
  current={current}
  onChange={handleNavigationChange}
  items={[
    { title: 'Step 1', status: 'finish' },
    { title: 'Step 2', status: 'process' },
    { title: 'Step 3', status: 'wait' }
  ]}
/>
```

### Pattern 9: Mini Size for Compact Layouts

**Use case**: Space-constrained interfaces requiring smaller step indicators.

**Implementation**: Set `size="small"` prop.

```javascript
<Steps
  size="small"
  current={1}
  items={[
    { title: 'Finished' },
    { title: 'In Progress' },
    { title: 'Waiting' }
  ]}
/>
```

### Pattern 10: Step with Progress Percentage

**Use case**: Show completion percentage for long-running operations within a step.

**Implementation**: Use `percent` prop to display progress bar in current step (v4.5.0+).

```javascript
<Steps
  current={1}
  percent={60}
  items={[
    { title: 'Finished' },
    { title: 'In Progress' },
    { title: 'Waiting' }
  ]}
/>
```

### Pattern 11: Vertical Label Placement

**Use case**: Horizontal steps with labels below indicators for better space utilization.

**Implementation**: Set `labelPlacement="vertical"`.

```javascript
<Steps
  labelPlacement="vertical"
  current={1}
  items={[
    { title: 'Finished', description: 'This is a description' },
    { title: 'In Progress', description: 'This is a description' },
    { title: 'Waiting', description: 'This is a description' }
  ]}
/>
```

### Pattern 12: Responsive Auto-Vertical

**Use case**: Automatically adapt layout for mobile devices.

**Implementation**: Use default `responsive={true}` to auto-switch to vertical on narrow screens.

```javascript
// Automatically vertical on screens < 532px
<Steps
  responsive
  current={1}
  items={items}
/>
```

## Variants and Composition

### Type Variants

**Default Type**: Standard step indicator with numbered circles and connecting lines, suitable for most wizards and forms.

**Navigation Type**: Optimized visual style for page-level navigation, with different styling that emphasizes the navigation aspect over process completion.

### Visual Style Variants

**Standard Indicators**: Numbered circles with connecting lines (default)

**Progress Dots**: Smaller circular dots with more subtle connecting lines, enabled via `progressDot` prop

**Custom Icons**: Replace default numbered indicators with custom icon components via `icon` property in items

### Layout Variants

**Horizontal Layout**: Default left-to-right arrangement

**Vertical Layout**: Top-to-bottom stacking via `direction="vertical"`

**Horizontal with Vertical Labels**: Labels below indicators via `labelPlacement="vertical"`

### Size Variants

**Default Size**: Standard sizing for typical desktop interfaces

**Small Size**: Compact version via `size="small"` for space-constrained layouts

## Accessibility

**Keyboard Navigation**: When `onChange` is provided making steps clickable, steps can be navigated using keyboard (Tab to focus, Enter/Space to activate).

**ARIA Semantics**: The component renders semantic HTML structure that screen readers can interpret as a navigation/progress indicator.

**Visual Status Communication**: Status is communicated through:
- Color (green for finished, blue for process, red for error)
- Icons (checkmarks for finished, numbers for pending)
- Visual styles (connecting lines show completion)

**Note**: The documentation does not explicitly detail ARIA attributes, role assignments, or screen reader announcements. Actual accessibility implementation details would require inspection of the component's source code.

## Responsive Design

**Automatic Breakpoint**: By default (`responsive={true}`), Steps automatically switches from horizontal to vertical layout on screens narrower than 532px.

**Manual Control**: Developers can disable automatic responsive behavior by setting `responsive={false}` and manage layout programmatically.

**Mobile Considerations**: Vertical layout is preferred on mobile devices as it provides better usability with limited horizontal space.

## Theme Integration

Ant Design Steps integrates with the Ant Design theme system through:

**Color Palette**: Steps use theme colors for different states:
- Primary color for active/process state
- Success color (green) for finished state
- Error color (red) for error state
- Disabled/gray colors for waiting state

**Customization Methods**:
- CSS class overrides via `className` prop
- Ant Design theme configuration (less variables or CSS-in-JS theme)
- Component-level styling through standard CSS or CSS-in-JS solutions

**Theming Variables**: Ant Design provides less/CSS variables for:
- Step indicator size
- Connection line colors
- Icon colors and sizes
- Spacing between steps
- Text colors for titles and descriptions

**Note**: Specific theming variable names and customization details would require reference to Ant Design's theming documentation.

## Related Components

**Timeline**: Similar sequential visualization but optimized for chronological events rather than process steps. Use Timeline for history/activity logs, Steps for workflows.

**Progress**: Shows completion percentage of a single task. Use Progress for single-operation loading states, Steps for multi-stage processes.

**Pagination**: Navigates through sequential pages of content. Use Pagination for data sets, Steps for task workflows.

**Menu**: General navigation component. Use Menu for application navigation, Steps for workflow navigation.

**Form**: Often used together with Steps for multi-step form experiences (form wizards).

**Tabs**: Alternative way to organize content into sections. Use Tabs for peer content sections, Steps for sequential workflows.

## Framework-Specific Features

### Modern Items API (Ant Design Specific)

The `items` array API introduced in v4.24.0 is an Ant Design optimization that:
- Provides better performance through optimized rendering
- Simplifies code by eliminating nested component structure
- Improves tree-shaking capabilities
- Aligns with other Ant Design components using similar patterns (Menu, Tabs, etc.)

This pattern replaces the older `<Steps.Step>` child component approach which was deprecated.

### Integration with Ant Design Icon System

Steps seamlessly integrates with Ant Design's icon library (`@ant-design/icons`), allowing use of hundreds of pre-designed icons through the `icon` property.

### Form Integration Patterns

Ant Design provides complementary patterns for Steps + Form integration:
- Form validation per step
- Conditional step visibility based on form values
- Step completion tracking tied to form submission state
- Integration with Ant Design Pro's `StepsForm` component for advanced scenarios

### Navigation Type Optimization

The `type="navigation"` variant is specifically designed for Ant Design's multi-page application patterns, with styling that matches Ant Design's navigation components.

## Code Examples

### Example 1: Basic Steps

```javascript
import React from 'react';
import { Steps } from 'antd';

const items = [
  {
    title: 'First',
    description: 'This is the first step',
  },
  {
    title: 'Second',
    description: 'This is the second step',
  },
  {
    title: 'Third',
    description: 'This is the third step',
  },
];

const App = () => <Steps current={1} items={items} />;

export default App;
```

### Example 2: Small Size Steps

```javascript
import React from 'react';
import { Steps } from 'antd';

const items = [
  { title: 'Finished' },
  { title: 'In Progress' },
  { title: 'Waiting' },
];

const App = () => <Steps size="small" current={1} items={items} />;

export default App;
```

### Example 3: With Custom Icons

```javascript
import React from 'react';
import { Steps } from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';

const items = [
  {
    title: 'Login',
    status: 'finish',
    icon: <UserOutlined />,
  },
  {
    title: 'Verification',
    status: 'finish',
    icon: <SolutionOutlined />,
  },
  {
    title: 'Pay',
    status: 'process',
    icon: <LoadingOutlined />,
  },
  {
    title: 'Done',
    status: 'wait',
    icon: <SmileOutlined />,
  },
];

const App = () => <Steps items={items} />;

export default App;
```

### Example 4: Interactive Step Switching

```javascript
import React, { useState } from 'react';
import { Steps, Button, message } from 'antd';

const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];

const App = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      <Steps current={current} items={items} />
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
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

export default App;
```

### Example 5: Vertical Steps

```javascript
import React from 'react';
import { Steps } from 'antd';

const items = [
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
];

const App = () => <Steps direction="vertical" current={1} items={items} />;

export default App;
```

### Example 6: Error Status

```javascript
import React from 'react';
import { Steps } from 'antd';

const items = [
  {
    title: 'Finished',
    description: 'This is a description',
  },
  {
    title: 'In Process',
    description: 'This is a description',
  },
  {
    title: 'Waiting',
    description: 'This is a description',
  },
];

const App = () => <Steps current={1} status="error" items={items} />;

export default App;
```

### Example 7: Progress Dot Style

```javascript
import React from 'react';
import { Steps } from 'antd';

const items = [
  {
    title: 'Finished',
    description: 'You can hover on the dot.',
  },
  {
    title: 'In Progress',
    description: 'You can hover on the dot.',
  },
  {
    title: 'Waiting',
    description: 'You can hover on the dot.',
  },
  {
    title: 'Waiting',
    description: 'You can hover on the dot.',
  },
];

const App = () => <Steps progressDot current={1} items={items} />;

export default App;
```

### Example 8: Customized Progress Dot

```javascript
import React from 'react';
import { Steps, Popover } from 'antd';

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

const items = [
  {
    title: 'Finished',
    description: 'You can hover on the dot.',
  },
  {
    title: 'In Progress',
    description: 'You can hover on the dot.',
  },
  {
    title: 'Waiting',
    description: 'You can hover on the dot.',
  },
  {
    title: 'Waiting',
    description: 'You can hover on the dot.',
  },
];

const App = () => <Steps current={1} progressDot={customDot} items={items} />;

export default App;
```

### Example 9: Clickable Steps

```javascript
import React, { useState } from 'react';
import { Steps } from 'antd';

const items = [
  {
    title: 'Step 1',
    description: 'This is step 1',
  },
  {
    title: 'Step 2',
    description: 'This is step 2',
  },
  {
    title: 'Step 3',
    description: 'This is step 3',
  },
];

const App = () => {
  const [current, setCurrent] = useState(0);

  const onChange = (value) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  return (
    <>
      <Steps current={current} onChange={onChange} items={items} />
      <div style={{ marginTop: 24 }}>Current step: {current}</div>
    </>
  );
};

export default App;
```

### Example 10: Navigation Steps

```javascript
import React, { useState } from 'react';
import { Steps } from 'antd';

const items = [
  {
    title: 'Step 1',
    status: 'finish',
    description: 'This is a description.',
  },
  {
    title: 'Step 2',
    status: 'process',
    description: 'This is a description.',
  },
  {
    title: 'Step 3',
    status: 'wait',
    description: 'This is a description.',
  },
  {
    title: 'Step 4',
    status: 'wait',
    description: 'This is a description.',
  },
];

const App = () => {
  const [current, setCurrent] = useState(0);

  const onChange = (value) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  return (
    <Steps
      type="navigation"
      size="small"
      current={current}
      onChange={onChange}
      items={items}
    />
  );
};

export default App;
```

### Example 11: Progress Step with Percentage

```javascript
import React, { useState } from 'react';
import { Steps, Button } from 'antd';

const items = [
  {
    title: 'Login',
  },
  {
    title: 'Verification',
  },
  {
    title: 'Pay',
  },
  {
    title: 'Done',
  },
];

const App = () => {
  const [percent, setPercent] = useState(0);

  const increase = () => {
    setPercent((prev) => {
      const newPercent = prev + 10;
      if (newPercent > 100) {
        return 100;
      }
      return newPercent;
    });
  };

  const decline = () => {
    setPercent((prev) => {
      const newPercent = prev - 10;
      if (newPercent < 0) {
        return 0;
      }
      return newPercent;
    });
  };

  return (
    <>
      <Steps current={1} percent={percent} items={items} />
      <Button onClick={decline} style={{ marginTop: 8 }}>
        Decline
      </Button>
      <Button onClick={increase} style={{ marginTop: 8 }}>
        Increase
      </Button>
    </>
  );
};

export default App;
```

### Example 12: Vertical Label Placement

```javascript
import React from 'react';
import { Steps } from 'antd';

const items = [
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
];

const App = () => (
  <Steps
    current={1}
    labelPlacement="vertical"
    items={items}
  />
);

export default App;
```

## Notes and Observations

### API Evolution

The Steps component underwent a significant API change in v4.24.0 with the introduction of the `items` array prop. The older pattern of using `<Steps.Step>` child components was deprecated and removed in v5.0. This represents Ant Design's broader trend toward more declarative, array-based APIs that improve performance and developer experience.

### Performance Considerations

The `items` API was specifically designed for better performance compared to the child component pattern. This is achieved through:
- More efficient reconciliation during re-renders
- Reduced component tree depth
- Better tree-shaking capabilities
- Simplified internal implementation

### Status Management

Status can be managed at two levels:
1. **Component-level** via `status` prop on `<Steps>` - affects the current step
2. **Item-level** via `status` property in individual items - overrides for specific steps

This dual-level control provides flexibility for complex workflows with mixed states.

### Responsive Behavior

The automatic responsive behavior (vertical layout on screens < 532px) is enabled by default. This is a sensible default for mobile-first development but can be disabled when custom responsive logic is needed.

### Navigation vs. Default Type

The `navigation` type is visually distinct from the `default` type and is specifically designed for page-level navigation scenarios where each step might correspond to a different route/page. The styling emphasizes the navigation aspect over the process completion visualization.

### Icon Integration

The seamless integration with `@ant-design/icons` makes it easy to use consistent, high-quality icons throughout the step progression. Custom SVG or image icons can also be used by passing any React element.

### Progress Dots Customization

The `progressDot` prop accepting a function for custom rendering is a powerful extension point. The function receives the default dot element and metadata (status, index), allowing for rich customizations like tooltips, popovers, or entirely custom visualizations while preserving accessibility and interaction patterns.

### Percent Prop Behavior

The `percent` prop only affects the current step's visualization (added in v4.5.0). It displays a progress bar within the step indicator, useful for showing progress of long-running operations within a particular step (e.g., file upload progress during a "Upload Documents" step).

### Label Placement Flexibility

The `labelPlacement` prop provides layout flexibility particularly useful for:
- Horizontal steps with many items where horizontal labels might overflow
- Asian languages where vertical text layout is more natural
- Dense interfaces where vertical space is more available than horizontal

### Disabled Steps

Individual steps can be disabled via the `disabled` property in items, preventing user interaction even when `onChange` is provided. This is useful for enforcing sequential progression in workflows where later steps shouldn't be accessible until earlier steps are completed.

### Version Compatibility

Documentation was researched from both v4.x and v5.x documentation. The `items` API is the current standard in both versions. Developers maintaining v3.x projects should consult legacy documentation as the component structure differs significantly.

### Integration with Form Libraries

While not explicitly documented in the Steps component page, Ant Design provides complementary `StepsForm` component in Ant Design Pro that tightly integrates Steps with Form for common wizard patterns. This handles step-by-step form validation, data persistence, and navigation automatically.

---

**Component Complexity**: Medium - The Steps component has a straightforward API but offers significant depth through customization options, status management, and integration patterns.

**Primary Use Cases**: Multi-step forms, wizards, onboarding flows, checkout processes, installation sequences, configuration workflows.

**Design Philosophy**: Ant Design's Steps embodies their "make things easier" philosophy by providing sensible defaults (responsive, status colors, auto-numbering) while offering escape hatches for customization (custom icons, progress dots, navigation type).
