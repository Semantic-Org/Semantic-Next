# Ant Design - Progress Component

## Component Overview

The Ant Design Progress component displays the current progress of an operation flow, providing visual feedback to users about the completion status of ongoing tasks. It's commonly used for file uploads, data loading indicators, system metrics displays, and multi-step processes. The component supports multiple visual styles (line, circle, dashboard) with extensive customization options for colors, sizes, and animations.

## Usage Patterns

### Basic Usage

The most basic implementation requires only the `percent` prop to display a progress bar:

```jsx
import { Progress } from 'antd';

export default () => (
  <Progress percent={30} />
);
```

The default type is "line" (horizontal progress bar), showing the percentage value to the right of the bar.

### Variants/Styles

#### Line Progress (Default)
Horizontal progress bar, ideal for sequential progress indication:

```jsx
<Progress type="line" percent={30} />
<Progress type="line" percent={100} />
```

**Line-specific props:**
- `steps` - Display progress as discrete steps (integer value)
- `strokeWidth` - Height of the progress bar
- `strokeLinecap` - Shape of the progress line ends ('round' or 'butt')

#### Circle Progress
Circular progress bar, ideal for percentage indicators and radial progress:

```jsx
<Progress type="circle" percent={75} />
<Progress type="circle" percent={100} width={80} />
```

**Circle-specific props:**
- `width` - Width and height of the circle (default: 120)
- `strokeWidth` - Thickness of the circle stroke

#### Dashboard Progress
Half-circle (180-degree) progress bar, ideal for gauge-like indicators:

```jsx
<Progress type="dashboard" percent={75} />
<Progress type="dashboard" percent={50} gapDegree={30} />
```

**Dashboard-specific props:**
- `gapDegree` - Gap degree of the half-circle
- `gapPosition` - Gap position ('top' or 'bottom')
- `width` - Canvas width

### States

#### Active
Progress that is currently in motion, used for ongoing operations:

```jsx
<Progress percent={50} status="active" />
```

#### Success
Indicates completed successful operation:

```jsx
<Progress percent={100} status="success" />
```

#### Exception
Indicates an error or failed operation:

```jsx
<Progress percent={50} status="exception" />
<Progress percent={100} status="exception" />
```

#### Normal
Default state for progress indication:

```jsx
<Progress percent={50} status="normal" />
```

### Sizing Options

#### Stroke Width (Line Progress)
Controls the thickness of the progress bar:

```jsx
<Progress percent={30} strokeWidth={4} />
<Progress percent={30} strokeWidth={8} />
<Progress percent={30} strokeWidth={16} />
```

#### Circle/Dashboard Width
Controls the canvas size for circle and dashboard types:

```jsx
<Progress type="circle" percent={75} width={80} />
<Progress type="circle" percent={75} width={120} />
<Progress type="circle" percent={75} width={200} />
```

#### Steps Display
Display progress as discrete segments:

```jsx
<Progress type="line" steps={5} percent={20} />
<Progress type="line" steps={10} percent={40} />
```

### Layout & Positioning

#### Show/Hide Info
Control whether to display the progress percentage and status icon:

```jsx
<Progress percent={30} showInfo={true} />
<Progress percent={30} showInfo={false} />
<Progress percent={100} />
```

#### Percent Position (Circle Progress)
Customize where the percentage text appears:

```jsx
<Progress type="circle" percent={75} percentPosition="start" />
<Progress type="circle" percent={75} percentPosition="end" />
```

### Content & Structure

#### Custom Format
Override the default percentage display with custom content:

```jsx
<Progress percent={75} format={percent => `${percent}%`} />
<Progress percent={75} format={percent => `Complete: ${percent}%`} />
<Progress type="circle" percent={75} format={percent => `${percent}% Done`} />
<Progress percent={0} format={() => 'Not Started'} />
<Progress percent={100} format={() => <span>✓ Finished</span>} />
```

#### Success Segment
Display a success portion separately from the current progress:

```jsx
<Progress
  percent={50}
  success={{ percent: 30 }}
/>
```

This shows 30% complete (success) and 20% in progress.

#### Trail Color
Customize the color of the unfilled portion:

```jsx
<Progress
  percent={50}
  strokeColor="#1890ff"
  trailColor="#f5f5f5"
/>
```

### Interactive Features

#### Dynamic Progress
Update progress percentage in response to user actions or API calls:

```jsx
function DynamicProgressExample() {
  const [percent, setPercent] = useState(0);

  const handleIncrement = () => {
    setPercent(prev => Math.min(100, prev + 10));
  };

  return (
    <>
      <Progress percent={percent} />
      <button onClick={handleIncrement}>Increment</button>
    </>
  );
}
```

#### Conditional Styling
Change appearance based on progress value:

```jsx
<Progress
  percent={percent}
  status={percent === 100 ? 'success' : percent > 50 ? 'active' : 'normal'}
  strokeColor={percent > 75 ? '#52c41a' : percent > 50 ? '#1890ff' : '#d9d9d9'}
/>
```

### Animation & Transitions

#### Active Animation
The `status="active"` automatically applies animation effects to indicate ongoing progress:

```jsx
<Progress percent={50} status="active" />
```

The progress bar will show a moving animation effect when in active state.

#### Smooth Updates
Progress updates are automatically animated when the percent value changes.

#### Stroke Linecap
Different linecap styles provide different visual effects:

```jsx
<Progress percent={75} strokeLinecap="round" />
<Progress percent={75} strokeLinecap="butt" />
<Progress percent={75} strokeLinecap="square" />
```

### Integration Patterns

#### File Upload Progress
Integrate with file upload to show upload completion:

```jsx
function FileUploadProgress() {
  const [percent, setPercent] = useState(0);

  const handleUpload = (file) => {
    // Simulate file upload with progress updates
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 30;
      if (current >= 100) {
        setPercent(100);
        clearInterval(interval);
      } else {
        setPercent(current);
      }
    }, 500);
  };

  return (
    <>
      <Progress percent={percent} status={percent === 100 ? 'success' : 'active'} />
      <p>Uploading... {Math.round(percent)}%</p>
    </>
  );
}
```

#### Data Loading Indicator
Show progress during data fetching or processing:

```jsx
function DataLoadingProgress() {
  const [data, setData] = useState(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setPercent(20);
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      setPercent(50);

      const response = await fetch('/api/data');
      setPercent(80);

      const result = await response.json();
      setPercent(100);
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <>
      <Progress percent={percent} status={percent === 100 ? 'success' : 'active'} />
      {data ? <div>Data loaded successfully</div> : <div>Loading...</div>}
    </>
  );
}
```

#### Multi-Step Process
Use progress bar to show completion of multi-step workflows:

```jsx
function MultiStepProgress() {
  const [step, setStep] = useState(0);
  const steps = ['Validation', 'Processing', 'Upload', 'Completion'];
  const percent = ((step + 1) / steps.length) * 100;

  return (
    <>
      <Progress percent={percent} format={() => steps[step]} />
      <button onClick={() => setStep(step + 1)}>Next Step</button>
    </>
  );
}
```

#### System Metrics Display
Show system performance metrics with multiple progress indicators:

```jsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
  <div>CPU Usage: <Progress type="circle" percent={65} width={80} /></div>
  <div>Memory: <Progress type="circle" percent={45} width={80} /></div>
  <div>Disk: <Progress type="circle" percent={80} width={80} /></div>
</div>
```

### Accessibility Features

#### ARIA Labels
The component supports standard semantic HTML and ARIA attributes:

```jsx
<Progress
  percent={50}
  aria-label="File upload progress"
  aria-valuenow={50}
  aria-valuemin={0}
  aria-valuemax={100}
/>
```

#### Screen Reader Support
Progress bar provides text representation that screen readers can announce:

```jsx
<Progress
  percent={75}
  format={percent => `${percent}% complete`}
/>
```

#### Status Indication
Status text ('active', 'success', 'exception') is conveyed through color and visual indicators that should be supported by alternative text:

```jsx
<div role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
  <Progress percent={50} status="active" />
  <span>Processing file... 50% complete</span>
</div>
```

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `percent` | number | 0 | The completion percentage (0-100) |
| `type` | 'line' \| 'circle' \| 'dashboard' | 'line' | Type of progress bar |
| `status` | 'success' \| 'exception' \| 'normal' \| 'active' | - | Status of the progress (color and icon indication) |
| `strokeColor` | string \| { [percentage: number]: string } | - | Color of the progress bar (supports gradient) |
| `strokeWidth` | number | - | Stroke width of the progress bar |
| `strokeLinecap` | 'round' \| 'butt' \| 'square' | 'round' | Shape at the end of the progress line |
| `trailColor` | string | - | Color of the unfilled portion |
| `format` | (percent: number) => ReactNode | percent => `${percent}%` | Custom formatting of progress text |
| `showInfo` | boolean | true | Whether to display progress value and status icon |
| `width` | number | 120 (circle), 260 (dashboard) | Width/diameter for circle/dashboard types |
| `success` | { percent: number, strokeColor?: string } | - | Configuration for success progress segment |
| `steps` | number | - | Number of discrete steps to display (line type only) |
| `gapDegree` | number | 0 | Gap degree for dashboard type (0-360) |
| `gapPosition` | 'top' \| 'bottom' \| 'left' \| 'right' | 'top' | Position of gap in dashboard type |
| `percentPosition` | 'start' \| 'end' | - | Position of percent text in circle type |

## Code Examples

### Example 1: Basic Progress Bar
```jsx
import { Progress } from 'antd';

export default function BasicProgress() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Progress percent={30} />
      <Progress percent={60} />
      <Progress percent={100} />
    </div>
  );
}
```

### Example 2: Different Progress States
```jsx
import { Progress } from 'antd';

export default function ProgressStates() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Progress percent={50} status="active" />
      <Progress percent={100} status="success" />
      <Progress percent={50} status="exception" />
    </div>
  );
}
```

### Example 3: All Progress Types with Colored Strokes
```jsx
import { Progress } from 'antd';

export default function AllProgressTypes() {
  const colors = {
    '0%': '#108ee9',
    '100%': '#87d068',
  };

  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <div>
        <h4>Line</h4>
        <Progress type="line" percent={75} strokeColor={colors} />
      </div>
      <div>
        <h4>Circle</h4>
        <Progress type="circle" percent={75} strokeColor={colors} />
      </div>
      <div>
        <h4>Dashboard</h4>
        <Progress type="dashboard" percent={75} strokeColor={colors} />
      </div>
    </div>
  );
}
```

### Example 4: Gradient Progress Bar
```jsx
import { Progress } from 'antd';

export default function GradientProgress() {
  const gradientStrokeColor = {
    '0%': '#108ee9',
    '25%': '#87d068',
    '50%': '#eec900',
    '75%': '#ff85c0',
    '100%': '#f50',
  };

  return (
    <Progress
      type="circle"
      percent={80}
      strokeColor={gradientStrokeColor}
    />
  );
}
```

### Example 5: Progress with Success Segment
```jsx
import { Progress } from 'antd';

export default function ProgressWithSuccess() {
  return (
    <>
      <Progress
        percent={70}
        success={{ percent: 30 }}
        showInfo={false}
      />
      <p>30% completed, 40% in progress</p>
    </>
  );
}
```

### Example 6: Dynamic Progress Update
```jsx
import { useState } from 'react';
import { Progress, Button } from 'antd';

export default function DynamicProgress() {
  const [percent, setPercent] = useState(0);

  const increase = () => {
    let newPercent = percent + 10;
    if (newPercent > 100) newPercent = 100;
    setPercent(newPercent);
  };

  const reset = () => {
    setPercent(0);
  };

  return (
    <>
      <Progress
        percent={percent}
        status={percent === 100 ? 'success' : percent > 50 ? 'active' : 'normal'}
      />
      <Button onClick={increase}>Increment</Button>
      <Button onClick={reset}>Reset</Button>
    </>
  );
}
```

### Example 7: Circular Progress with Custom Format
```jsx
import { Progress } from 'antd';

export default function CustomFormatProgress() {
  const customFormat = (percent) => (
    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
      {percent}%
    </span>
  );

  return (
    <Progress
      type="circle"
      percent={75}
      format={customFormat}
      width={200}
    />
  );
}
```

### Example 8: Multiple Progress Bars with Steps
```jsx
import { Progress } from 'antd';

export default function StepProgress() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Progress type="line" steps={5} percent={20} />
      <Progress type="line" steps={10} percent={40} />
      <Progress type="line" steps={3} percent={66.67} />
    </div>
  );
}
```

## Accessibility Notes

### Screen Reader Compatibility
- Progress bars should include a text alternative indicating completion percentage
- Status values ('active', 'success', 'exception') should be communicated through text labels
- When used in forms or critical processes, include descriptive labels explaining what is being tracked

### Color Contrast
- Ensure stroke color has sufficient contrast against the background (WCAG AA minimum 4.5:1)
- Don't rely solely on color to convey status (active, success, exception) - use icons or text
- Consider colorblind users when selecting status colors

### Keyboard Access
- Progress bars are typically not interactive, so keyboard access is not required
- Parent containers containing progress bars should be keyboard accessible if they contain interactive elements

### ARIA Attributes
- Use `role="progressbar"` when the component isn't semantically clear
- Include `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for screen reader context
- Provide `aria-label` for additional context when status indicators aren't clear

## Common Patterns

### Upload Progress with File Information
Show progress alongside file upload details:

```jsx
function FileUploadWithDetails() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileName = 'large-video.mp4';
  const fileSize = '2.5 GB';

  return (
    <div>
      <p>Uploading: {fileName}</p>
      <p>Size: {fileSize}</p>
      <Progress percent={uploadProgress} status="active" />
      <p>{uploadProgress}% uploaded</p>
    </div>
  );
}
```

### Batch Operation Progress
Track progress of multiple operations:

```jsx
function BatchProgress() {
  const [progress, setProgress] = useState({
    files: 45,
    optimization: 30,
    upload: 0,
  });

  return (
    <>
      <div>Files Processed: <Progress percent={progress.files} /></div>
      <div>Optimization: <Progress percent={progress.optimization} /></div>
      <div>Upload: <Progress percent={progress.upload} /></div>
    </>
  );
}
```

### Installation/Setup Progress
Multi-step installation with progress visualization:

```jsx
function InstallationProgress() {
  const [step, setStep] = useState(0);
  const steps = [
    { name: 'Validation', percent: 20 },
    { name: 'Download', percent: 40 },
    { name: 'Extract', percent: 60 },
    { name: 'Configure', percent: 80 },
    { name: 'Complete', percent: 100 },
  ];

  return (
    <>
      <Progress percent={steps[step].percent} />
      <p>{steps[step].name}</p>
    </>
  );
}
```

### Dashboard with Multiple Metrics
Display system or application metrics using circular progress:

```jsx
function DashboardMetrics() {
  const metrics = [
    { label: 'CPU', value: 65 },
    { label: 'Memory', value: 45 },
    { label: 'Disk', value: 80 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
      {metrics.map(metric => (
        <div key={metric.label} style={{ textAlign: 'center' }}>
          <p>{metric.label}</p>
          <Progress type="circle" percent={metric.value} width={120} />
          <p>{metric.value}%</p>
        </div>
      ))}
    </div>
  );
}
```

### Download Progress with Remaining Time
Show progress with estimated time remaining:

```jsx
function DownloadProgress() {
  const [percent, setPercent] = useState(35);
  const estimatedTime = Math.round((100 - percent) * 0.5); // seconds

  return (
    <>
      <Progress percent={percent} status="active" />
      <p>
        {percent}% - Estimated time remaining: {estimatedTime}s
      </p>
    </>
  );
}
```

## Related Components

- **Spin** - Loading indicator for when no progress information is available
- **Skeleton** - Placeholder for content while loading
- **Divider** - Visual separator of content
- **Steps** - Multi-step process indicator (more detailed than Progress)
- **Tooltip** - Can display progress details on hover
- **Modal** - Container for progress dialogs
- **Card** - Container for embedding progress indicators

---

Research completed: 2025-11-05
Component: Progress
Framework: Ant Design
Documentation: https://ant.design/components/progress
