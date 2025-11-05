# PrimeReact - ProgressBar Component

**Component**: ProgressBar
**Framework**: PrimeReact
**Version**: v8+ (primereact.org)
**Research Date**: 2025-11-05

---

## Component Overview

The **ProgressBar** is PrimeReact's process status indicator component designed to display progress towards task completion. It supports two primary modes: **determinate** (showing a specific percentage of progress) and **indeterminate** (showing indefinite progress when completion time is unknown). The component is lightweight, themeable, and provides flexible customization through props and CSS styling.

ProgressBar is rendered as a styled HTML progress element wrapped in a container, providing visual feedback for operations such as file uploads, data processing, loading tasks, or any operation with a measurable completion state.

---

## Usage Patterns

### Basic Usage

#### Import Statement

```jsx
import { ProgressBar } from 'primereact/progressbar';
```

#### Minimal Implementation (Determinate)

The simplest usage displays a fixed progress value:

```jsx
<ProgressBar value={50} />
```

This renders a progress bar at 50% completion with default styling.

#### Minimal Implementation (Indeterminate)

For operations without a measurable progress percentage:

```jsx
<ProgressBar mode="indeterminate" />
```

This renders an animated progress bar with no specific percentage value.

### Variants/Styles

#### Determinate Mode

The default mode displaying progress as a percentage (0-100):

```jsx
// Basic determinate progress
<ProgressBar value={75} />

// With text display
<ProgressBar value={75} displayValue />

// Custom styling
<ProgressBar
  value={75}
  style={{ height: '10px' }}
  className="custom-progress"
/>
```

**Key Characteristics**:
- Default mode
- Requires `value` prop (0-100)
- Shows filled portion representing progress
- Filled portion width correlates to value percentage

#### Indeterminate Mode

For indefinite progress indication:

```jsx
// Basic indeterminate
<ProgressBar mode="indeterminate" />

// Styled indeterminate
<ProgressBar
  mode="indeterminate"
  style={{ height: '6px' }}
/>

// With custom color
<ProgressBar
  mode="indeterminate"
  className="indeterminate-custom"
/>
```

**Key Characteristics**:
- Animated animation (bar moves left to right indefinitely)
- No `value` prop needed
- Indicates ongoing process without completion percentage
- Useful for operations with unknown duration

### States

#### Active State

Progress bar actively showing progress:

```jsx
<ProgressBar value={45} />
```

#### Completed State

Progress bar at 100% completion:

```jsx
<ProgressBar value={100} />
```

Visual indication that task has completed.

#### Empty State

Progress bar at 0% completion:

```jsx
<ProgressBar value={0} />
```

Shows no progress yet.

#### Disabled/Inactive State

While PrimeReact ProgressBar doesn't have a built-in `disabled` prop, it can be visually de-emphasized:

```jsx
<ProgressBar
  value={50}
  className="disabled-progress"
  style={{ opacity: 0.5 }}
/>
```

### Sizing Options

#### Height Customization

Control bar thickness via `style` prop:

```jsx
// Thin progress bar (default-like)
<ProgressBar value={50} style={{ height: '4px' }} />

// Standard height
<ProgressBar value={50} style={{ height: '10px' }} />

// Large/prominent bar
<ProgressBar value={50} style={{ height: '20px' }} />

// Extra large (for accessibility)
<ProgressBar value={50} style={{ height: '30px' }} />
```

#### Width Customization

Control bar width (defaults to 100% of container):

```jsx
// Full width (default)
<ProgressBar value={50} />

// Fixed width
<ProgressBar value={50} style={{ width: '400px' }} />

// Responsive width
<ProgressBar
  value={50}
  style={{ width: '100%', maxWidth: '500px' }}
/>
```

#### Container Sizing

Wrap in container for more control:

```jsx
<div style={{ width: '300px', margin: '1rem 0' }}>
  <ProgressBar value={65} style={{ height: '8px' }} />
</div>
```

### Layout & Positioning

#### Full Width Layout

Progress bar spanning full container width (default):

```jsx
<div>
  <ProgressBar value={50} style={{ height: '8px' }} />
</div>
```

#### Inline/Compact Layout

Progress bar in constrained space:

```jsx
<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
  <span>Processing:</span>
  <div style={{ flex: 1 }}>
    <ProgressBar value={50} style={{ height: '6px' }} />
  </div>
  <span>50%</span>
</div>
```

#### Stacked Layout

Multiple progress bars stacked vertically:

```jsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
  <div>
    <label>Task 1</label>
    <ProgressBar value={100} style={{ height: '6px' }} />
  </div>
  <div>
    <label>Task 2</label>
    <ProgressBar value={75} style={{ height: '6px' }} />
  </div>
  <div>
    <label>Task 3</label>
    <ProgressBar value={50} style={{ height: '6px' }} />
  </div>
</div>
```

### Content & Structure

#### Display Value Template

Custom rendering of progress information using `displayValueTemplate`:

```jsx
<ProgressBar
  value={65}
  displayValueTemplate={(value) => `${value}%`}
/>
```

#### Separate Value Display

Display progress value separately from bar:

```jsx
<div>
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <label>Upload Progress</label>
    <span>45%</span>
  </div>
  <ProgressBar value={45} style={{ height: '8px' }} />
</div>
```

#### Label with Context

Combine bar with descriptive context:

```jsx
<div>
  <p>Downloading file: document.pdf (45 MB of 100 MB)</p>
  <ProgressBar value={45} style={{ height: '6px' }} />
</div>
```

### Interactive Features

#### Dynamic Progress Updates

Update progress as operation progresses:

```jsx
import { useState, useEffect } from 'react';

function DownloadProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <ProgressBar value={Math.min(progress, 100)} />;
}
```

#### Manual Control with Buttons

Allow user to manually control progress:

```jsx
function ManualProgress() {
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <ProgressBar value={progress} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setProgress(Math.max(0, progress - 10))}>
          Decrease
        </button>
        <button onClick={() => setProgress(Math.min(100, progress + 10))}>
          Increase
        </button>
        <button onClick={() => setProgress(0)}>Reset</button>
        <button onClick={() => setProgress(100)}>Complete</button>
      </div>
    </div>
  );
}
```

#### Conditional Mode Switching

Switch between determinate and indeterminate modes:

```jsx
function AdaptiveProgress({ isLoading, progress }) {
  return (
    <ProgressBar
      value={progress}
      mode={isLoading ? 'indeterminate' : 'determinate'}
      style={{ height: '8px' }}
    />
  );
}
```

### Animation & Transitions

#### Indeterminate Animation

The component automatically provides smooth animation in indeterminate mode:

```jsx
<ProgressBar mode="indeterminate" style={{ height: '6px' }} />
```

The bar smoothly animates from left to right continuously.

#### Determinate Transitions

Smooth width transitions when value changes (via CSS):

```jsx
<style>{`
  .p-progressbar {
    transition: width 0.3s ease-in-out;
  }
`}</style>

<ProgressBar value={newValue} />
```

#### Custom Animation Timing

Control animation speed via CSS classes:

```jsx
<ProgressBar
  mode="indeterminate"
  className="fast-animation"
/>

<style>{`
  .fast-animation .p-progressbar-value {
    animation-duration: 0.5s;
  }
`}</style>
```

### Integration Patterns

#### File Upload Progress

Display progress during file upload:

```jsx
import { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';

function FileUploadWithProgress() {
  const [uploadProgress, setUploadProgress] = useState(0);

  const onUpload = (event) => {
    const file = event.files[0];
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 40;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 500);
  };

  return (
    <div>
      <FileUpload
        name="file"
        url="https://api.example.com/upload"
        onUpload={onUpload}
        customUpload
      />
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div style={{ marginTop: '1rem' }}>
          <ProgressBar value={uploadProgress} />
        </div>
      )}
      {uploadProgress === 100 && (
        <p style={{ color: 'green', marginTop: '1rem' }}>Upload complete!</p>
      )}
    </div>
  );
}
```

#### Data Processing Progress

Show progress for long-running data operations:

```jsx
function DataProcessing() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processData = async () => {
    setProcessing(true);
    setProgress(0);

    // Simulate data processing
    for (let i = 1; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress((i / 10) * 100);
    }

    setProcessing(false);
  };

  return (
    <div>
      <button onClick={processData} disabled={processing}>
        {processing ? 'Processing...' : 'Start Processing'}
      </button>
      {processing && <ProgressBar value={progress} style={{ marginTop: '1rem' }} />}
    </div>
  );
}
```

#### Multi-Step Progress

Show cumulative progress across multiple steps:

```jsx
function MultiStepProgress({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div>
      <ProgressBar
        value={progress}
        displayValueTemplate={() => `Step ${currentStep} of ${totalSteps}`}
      />
    </div>
  );
}
```

### Accessibility Features

#### ARIA Labels

Provide semantic information for screen readers:

```jsx
// Using aria-label
<ProgressBar
  value={65}
  aria-label="File upload progress, 65 percent complete"
/>

// Using aria-labelledby
<div>
  <h3 id="progress-title">Download Progress</h3>
  <ProgressBar value={80} aria-labelledby="progress-title" />
</div>
```

#### ARIA Attributes

The component automatically provides accessibility attributes:

```jsx
<ProgressBar
  value={50}
  // Automatically includes:
  // role="progressbar"
  // aria-valuemin="0"
  // aria-valuemax="100"
  // aria-valuenow={50}
/>
```

#### Text Alternatives

Provide text descriptions for context:

```jsx
<div>
  <label id="upload-label">File Upload Progress</label>
  <ProgressBar
    value={45}
    aria-labelledby="upload-label"
    style={{ height: '8px' }}
  />
  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
    Uploading file: document.pdf (45 MB of 100 MB uploaded)
  </div>
</div>
```

#### Indeterminate Progress Accessibility

Ensure indeterminate progress is labeled:

```jsx
<div>
  <ProgressBar
    mode="indeterminate"
    aria-label="Loading content, please wait"
  />
</div>
```

---

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `undefined` | Progress value between 0-100 for determinate mode. Required for determinate mode. |
| `mode` | `string` | `"determinate"` | Progress mode. Accepts `"determinate"` (shows percentage) or `"indeterminate"` (animated indefinite progress). |
| `displayValue` | `boolean` | `undefined` | When true, displays the progress value as text (e.g., "50%") inside or near the bar. |
| `displayValueTemplate` | `function` | `undefined` | Custom template function for displaying progress value. Receives the current value as parameter. |
| `style` | `object` | `undefined` | Inline CSS styles applied to the root element. Commonly used for width and height sizing. |
| `className` | `string` | `undefined` | CSS class name(s) to apply to the root element for styling. |
| `color` | `string` | `undefined` | Color of the progress bar fill. Accepts CSS color values or CSS variables. |
| `aria-label` | `string` | `undefined` | Accessibility label describing the progress bar's purpose. Required for screen reader users. |
| `aria-labelledby` | `string` | `undefined` | ID of an element that labels/describes the progress bar for screen readers. |
| `pt` | `ProgressBarPassThroughOptions` | `undefined` | PassThrough API object for advanced DOM customization of internal elements. |
| `ptOptions` | `ProgressBarPassThroughMethodOptions` | `undefined` | Configuration options for PassThrough behavior. |
| `unstyled` | `boolean` | `false` | When enabled, removes default PrimeReact styling, allowing full custom styling control. |

---

## Code Examples

### Example 1: Basic ProgressBar with Percentage

```jsx
import { ProgressBar } from 'primereact/progressbar';

function BasicProgressBar() {
  return (
    <div>
      <h3>Basic Progress Bar</h3>
      <ProgressBar value={50} style={{ height: '8px' }} />
    </div>
  );
}

export default BasicProgressBar;
```

### Example 2: Indeterminate Progress (Loading Indicator)

```jsx
import { ProgressBar } from 'primereact/progressbar';

function LoadingIndicator() {
  return (
    <div>
      <h3>Loading Content...</h3>
      <ProgressBar
        mode="indeterminate"
        style={{ height: '6px' }}
        aria-label="Loading content, please wait"
      />
    </div>
  );
}

export default LoadingIndicator;
```

### Example 3: Dynamic Progress with State

```jsx
import { useState, useEffect } from 'react';
import { ProgressBar } from 'primereact/progressbar';

function DynamicProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 5;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Dynamic Progress (Simulated Download)</h3>
      <div style={{ marginBottom: '1rem' }}>
        <ProgressBar
          value={progress}
          displayValueTemplate={() => `${Math.min(progress, 100).toFixed(0)}%`}
          style={{ height: '8px' }}
        />
      </div>
      <p>{progress >= 100 ? 'Download Complete!' : 'Downloading...'}</p>
    </div>
  );
}

export default DynamicProgress;
```

### Example 4: Multiple Progress Bars (Multi-Step)

```jsx
import { ProgressBar } from 'primereact/progressbar';

function MultiStepProgress() {
  const steps = [
    { name: 'Processing', progress: 100 },
    { name: 'Uploading', progress: 75 },
    { name: 'Finalizing', progress: 25 }
  ];

  return (
    <div>
      <h3>Multi-Step Progress</h3>
      {steps.map((step, index) => (
        <div key={index} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label>{step.name}</label>
            <span>{step.progress}%</span>
          </div>
          <ProgressBar value={step.progress} style={{ height: '6px' }} />
        </div>
      ))}
    </div>
  );
}

export default MultiStepProgress;
```

### Example 5: Styled Progress Bars with Theme Integration

```jsx
import { ProgressBar } from 'primereact/progressbar';
import './CustomProgress.css';

function StyledProgress() {
  return (
    <div>
      <h3>Styled Progress Bars</h3>

      <div style={{ marginBottom: '1.5rem' }}>
        <label>Success (Green)</label>
        <ProgressBar
          value={100}
          style={{ height: '8px' }}
          className="success-progress"
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label>Warning (Orange)</label>
        <ProgressBar
          value={60}
          style={{ height: '8px' }}
          className="warning-progress"
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label>Danger (Red)</label>
        <ProgressBar
          value={30}
          style={{ height: '8px' }}
          className="danger-progress"
        />
      </div>
    </div>
  );
}

export default StyledProgress;
```

**Custom CSS (CustomProgress.css)**:
```css
.success-progress .p-progressbar-value {
  background-color: #4caf50;
}

.warning-progress .p-progressbar-value {
  background-color: #ff9800;
}

.danger-progress .p-progressbar-value {
  background-color: #f44336;
}
```

### Example 6: Progress with Custom Template

```jsx
import { ProgressBar } from 'primereact/progressbar';

function CustomProgressBar() {
  const [progress, setProgress] = useState(0);

  const handleStart = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div>
      <h3>Custom Progress Display</h3>
      <div style={{ marginBottom: '1rem' }}>
        <ProgressBar
          value={progress}
          displayValueTemplate={() => {
            const status = progress < 50 ? 'Starting...' :
                          progress < 100 ? 'Processing...' :
                          'Complete!';
            return `${progress}% - ${status}`;
          }}
          style={{ height: '10px' }}
        />
      </div>
      <button onClick={handleStart}>Start Progress</button>
    </div>
  );
}

export default CustomProgressBar;
```

---

## Accessibility Notes

### Best Practices

1. **Always Provide Context**: Use `aria-label` to describe what's being loaded/processed
   ```jsx
   <ProgressBar
     value={50}
     aria-label="File upload progress, 50 percent complete"
   />
   ```

2. **Associate with Related Text**: Use `aria-labelledby` when descriptive text or heading exists
   ```jsx
   <h3 id="upload-title">Uploading Files</h3>
   <ProgressBar value={45} aria-labelledby="upload-title" />
   ```

3. **Indeterminate State Labels**: Ensure indeterminate progress is clearly labeled
   ```jsx
   <ProgressBar
     mode="indeterminate"
     aria-label="Loading data, please wait"
   />
   ```

4. **Include Status Text**: Provide additional context below or beside the bar
   ```jsx
   <ProgressBar value={75} />
   <small>Uploading: file.pdf (75 MB of 100 MB)</small>
   ```

### Screen Reader Support

- Component automatically includes `role="progressbar"`
- Sets `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-valuenow={value}`
- Supports custom labels via `aria-label` and `aria-labelledby`
- Screen readers will announce the current value when it changes

### Keyboard Support

ProgressBar has **no keyboard interaction** - it's a pure display component. This is semantically correct as progress indicators are status elements, not interactive controls.

---

## Common Patterns

### 1. Loading State with Fallback

Show different content based on loading state:

```jsx
function LoadableContent({ isLoading, data }) {
  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading content...</p>
      </div>
    );
  }

  return <div>{data}</div>;
}
```

### 2. Debounced Progress (Prevent Flashing)

Hide progress bar for quick operations:

```jsx
function useDebouncedProgress(isLoading, delay = 300) {
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowProgress(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShowProgress(false);
    }
  }, [isLoading, delay]);

  return showProgress;
}

function Component() {
  const [loading, setLoading] = useState(false);
  const showProgress = useDebouncedProgress(loading);

  return showProgress && <ProgressBar mode="indeterminate" />;
}
```

### 3. Inline Progress (Next to Text)

Compact progress indicator inline with text:

```jsx
function InlineProgress({ percentage, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span>{label}</span>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <ProgressBar value={percentage} style={{ height: '4px' }} />
      </div>
      <span style={{ minWidth: '40px' }}>{percentage}%</span>
    </div>
  );
}
```

### 4. Stacked Progress (Multiple Tasks)

Show progress for multiple concurrent tasks:

```jsx
function MultiTaskProgress({ tasks }) {
  return (
    <div>
      {tasks.map(task => (
        <div key={task.id} style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>{task.name}</strong>
            <span style={{ float: 'right' }}>{task.progress}%</span>
          </div>
          <ProgressBar value={task.progress} style={{ height: '6px' }} />
        </div>
      ))}
    </div>
  );
}
```

---

## Related Components

- **ProgressSpinner**: For indeterminate progress with circular animation
- **BlockUI**: Blocks UI interactions while showing a progress indicator
- **FileUpload**: File upload component with built-in progress tracking
- **Toast**: For displaying progress notifications and completion messages
- **Skeleton**: Alternative loading indicator using skeleton screens

---

## Summary

PrimeReact's **ProgressBar** is a versatile, accessible progress indicator optimized for both determinate (percentage-based) and indeterminate (indefinite) progress scenarios. Its simple but powerful API (`value`, `mode`, `displayValue`, `displayValueTemplate`) supports common use cases, while CSS customization and PassThrough API enable advanced scenarios. The component excels at clarity with automatic ARIA role/attributes, making it suitable for production applications when paired with proper accessibility labels and contextual information.

The component's strength lies in its composability—developers build complete loading patterns around the core bar rather than relying on built-in variants. This philosophy aligns with PrimeReact's general approach of providing focused, theme-aware primitives that integrate deeply with the design system.

---

Research completed: November 5, 2025
Component: ProgressBar
Framework: PrimeReact
Documentation: https://primereact.org/progressbar/
