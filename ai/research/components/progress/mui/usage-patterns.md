# MUI - Progress Components (LinearProgress & CircularProgress)

> Last Modified: 2025-11-05

## Component Overview

MUI provides two primary progress component types for visualizing task completion and operation status:

- **LinearProgress** - A horizontal bar indicator showing progress with optional buffer state (useful for streaming)
- **CircularProgress** - A circular/ring-style indicator with SVG-based rendering for smooth scaling and animation

Both components serve as visual feedback mechanisms for asynchronous operations, file uploads, downloads, and multi-step processes. They support determinate states (showing exact percentage) and indeterminate states (continuous animation for unknown duration).

**Primary Use Cases:**
- File upload/download progress tracking
- Data loading indicators
- Long-running operation feedback
- Multi-step form progression
- Async task completion status
- Buffering states (for video/media)

## Usage Patterns

### Basic Usage

#### LinearProgress - Determinate
Shows exact progress percentage with a horizontal bar:
```jsx
import LinearProgress from '@mui/material/LinearProgress';

// Basic usage with value
<LinearProgress value={50} variant="determinate" />

// With automatic label display (via composition)
<LinearProgress value={75} variant="determinate" />
```

#### LinearProgress - Indeterminate
Shows continuous animation without specific percentage:
```jsx
import LinearProgress from '@mui/material/LinearProgress';

// Default indeterminate animation
<LinearProgress variant="indeterminate" />

// Equivalent (variant is default)
<LinearProgress />
```

#### CircularProgress - Indeterminate
Standard loading spinner animation:
```jsx
import CircularProgress from '@mui/material/CircularProgress';

// Default circular spinner
<CircularProgress />

// Equivalent (variant is default)
<CircularProgress variant="indeterminate" />
```

#### CircularProgress - Determinate
Circular progress ring showing completion percentage:
```jsx
import CircularProgress from '@mui/material/CircularProgress';

<CircularProgress variant="determinate" value={75} />
```

### Variants/Styles

#### LinearProgress Variants

**1. Determinate Variant** - Shows specific progress percentage
```jsx
<LinearProgress variant="determinate" value={60} />
```
- Displays bar filled to specified percentage (0-100)
- Width of bar represents completion status
- Static or animated as value updates

**2. Indeterminate Variant** - Continuous animation
```jsx
<LinearProgress variant="indeterminate" />
```
- Continuous left-to-right stripe animation
- No specific value representation
- Used when duration is unknown

**3. Buffer Variant** - Shows loaded vs buffered (MUI-specific)
```jsx
<LinearProgress variant="buffer" value={50} valueBuffer={75} />
```
- Shows two progress states: downloaded and buffered
- `value` = downloaded/loaded amount
- `valueBuffer` = total buffered amount
- Useful for video streaming and media playback
- Unique to Material UI

#### CircularProgress Variants

**1. Indeterminate Variant** - Default rotating spinner
```jsx
<CircularProgress variant="indeterminate" />
```
- Continuous rotating animation
- No value displayed
- 360-degree rotation animation

**2. Determinate Variant** - Progress ring
```jsx
<CircularProgress variant="determinate" value={75} />
```
- SVG-based circular progress indicator
- Stroke animates from 0 to specified value degrees
- Smooth scaling via size control

**3. Static Display** - Static ring at specific angle
```jsx
<CircularProgress variant="determinate" value={100} />
```
- Full circle when value={100}
- Partial ring for values < 100
- No animation

### States

**Determinate State** (both components):
- `variant="determinate"`
- `value` prop: 0-100
- Shows exact completion percentage
- Animated transition when value updates

**Indeterminate State** (both components):
- `variant="indeterminate"` (or omitted - it's default)
- No value prop or value={null}
- Continuous animation
- Used when progress duration unknown

**Color States** (both components):
- `color="primary"` - Primary theme color (default)
- `color="secondary"` - Secondary theme color
- `color="error"` - Error/failure state (red)
- `color="warning"` - Warning state (yellow/orange)
- `color="info"` - Informational state (blue)
- `color="success"` - Success/completion state (green)
- `color="inherit"` - Inherits parent color

**Disabled Appearance** - Visual indication of disabled state:
```jsx
<LinearProgress
  variant="determinate"
  value={50}
  sx={{ opacity: 0.5 }} // Composed disabled styling
/>
```
Note: No native disabled prop; use `sx` for styling

### Sizing Options

#### LinearProgress Sizing

**Height Control** - Via `sx` prop:
```jsx
// Default height is ~4px
<LinearProgress sx={{ height: 8 }} /> // 8px height
<LinearProgress sx={{ height: '0.5rem' }} /> // CSS units
```

**Height Variants** (common sizes):
- Extra small: `sx={{ height: 2 }}` (2px)
- Small: `sx={{ height: 4 }}` (4px - default)
- Medium: `sx={{ height: 6 }}` (6px)
- Large: `sx={{ height: 8 }}` (8px)
- Extra large: `sx={{ height: 10 }}` (10px)

#### CircularProgress Sizing

**Size Control** - Via `size` prop (pixels):
```jsx
<CircularProgress size={20} /> // 20px diameter
<CircularProgress size={40} /> // 40px diameter (default)
<CircularProgress size={80} /> // 80px diameter
```

**Size Variants** (common sizes):
- Extra small: `size={20}` (20px)
- Small: `size={30}` (30px)
- Medium: `size={40}` (40px - default)
- Large: `size={60}` (60px)
- Extra large: `size={80}` (80px)
- Custom: `size={100}` (any numeric value)

**Thickness Control** (CircularProgress):
```jsx
<CircularProgress size={40} thickness={4} /> // Default ~3.6px
```
- `thickness` prop controls stroke width as ratio (3.6 / 4 = 0.9)
- Higher values = thicker stroke
- Typical range: 2-6 for visible variation

### Layout & Positioning

#### LinearProgress Layout

**Full Width** (default):
```jsx
<LinearProgress variant="determinate" value={50} />
```
- Spans 100% of parent container width
- Typical height ~4px
- Stacks vertically with other elements

**Custom Width** - Via container:
```jsx
<Box sx={{ width: '200px' }}>
  <LinearProgress variant="determinate" value={50} />
</Box>
```

**Positioned Above Content**:
```jsx
<LinearProgress variant="indeterminate" />
<Box>Content below progress bar</Box>
```

**Within Container** - Positioned absolutely:
```jsx
<Box sx={{ position: 'relative' }}>
  <LinearProgress
    sx={{ position: 'absolute', top: 0, left: 0, right: 0 }}
    variant="determinate"
    value={50}
  />
  <Box>Content with progress indicator</Box>
</Box>
```

#### CircularProgress Layout

**Centered Display**:
```jsx
import Box from '@mui/material/Box';

<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <CircularProgress variant="indeterminate" />
</Box>
```

**Absolute Positioning** (overlay):
```jsx
<Box sx={{ position: 'relative' }}>
  <img src="image.jpg" />
  <CircularProgress
    sx={{ position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)' }}
    variant="indeterminate"
  />
</Box>
```

**Inline Display**:
```jsx
<Typography>
  Loading <CircularProgress size={20} sx={{ ml: 1, verticalAlign: 'middle' }} />
</Typography>
```

**Grid Layout** (multiple indicators):
```jsx
<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
  <CircularProgress />
  <CircularProgress />
  <CircularProgress />
</Box>
```

### Content & Structure

#### LinearProgress with Text

**Percentage Label** - Above or below:
```jsx
<Box>
  <Typography variant="caption">Loading...</Typography>
  <LinearProgress variant="determinate" value={50} />
  <Typography variant="caption" align="right">50%</Typography>
</Box>
```

**Label with Dynamic Percentage**:
```jsx
import React, { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

function ProgressWithLabel() {
  const [progress, setProgress] = useState(0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Uploading file...</Typography>
        <Typography>{`${Math.round(progress)}%`}</Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}
```

**Label Inside Progress Bar** (custom styling):
```jsx
<Box sx={{ position: 'relative', width: '100%' }}>
  <LinearProgress variant="determinate" value={50} />
  <Typography
    sx={{ position: 'absolute', top: '50%', left: '10px',
          transform: 'translateY(-50%)', color: 'white', fontSize: '0.8rem' }}
  >
    50%
  </Typography>
</Box>
```

#### CircularProgress with Label

**Centered Percentage**:
```jsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function CircularProgressWithLabel() {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={75} size={80} />
      <Box
        sx={{
          top: 0, left: 0, bottom: 0, right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="textSecondary">
          75%
        </Typography>
      </Box>
    </Box>
  );
}
```

**Label Below Circle**:
```jsx
<Box sx={{ textAlign: 'center' }}>
  <CircularProgress variant="determinate" value={50} />
  <Typography sx={{ mt: 1 }}>50% Complete</Typography>
</Box>
```

**Status Text with Multiple Lines**:
```jsx
<Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column' }}>
  <CircularProgress variant="determinate" value={60} />
  <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
    Uploading...
  </Typography>
  <Typography variant="body2" sx={{ textAlign: 'center' }}>
    3.5 MB / 5 MB
  </Typography>
</Box>
```

### Interactive Features

#### Dynamic Progress Updates

**LinearProgress - Animation on Value Change**:
```jsx
function ProgressAnimation() {
  const [progress, setProgress] = useState(0);

  // Animate progress
  React.useEffect(() => {
    if (progress < 100) {
      setTimeout(() => setProgress(prev => prev + 1), 500);
    }
  }, [progress]);

  return <LinearProgress variant="determinate" value={progress} />;
}
```

**CircularProgress - Animated Update**:
```jsx
function CircularProgressAnimation() {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 5 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <CircularProgress variant="determinate" value={progress} />;
}
```

#### Batch Upload Progress

```jsx
function MultipleProgressIndicators() {
  const [progress, setProgress] = useState({ file1: 30, file2: 60, file3: 90 });

  return (
    <Box sx={{ width: '100%' }}>
      {Object.entries(progress).map(([name, value]) => (
        <Box key={name} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{name}</Typography>
            <Typography variant="body2">{value}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={value} />
        </Box>
      ))}
    </Box>
  );
}
```

#### Buffer/Streaming Progress

```jsx
function BufferProgress() {
  const [loaded, setLoaded] = useState(25);
  const [buffered, setBuffered] = useState(50);

  return (
    <LinearProgress
      variant="buffer"
      value={loaded}
      valueBuffer={buffered}
      sx={{ height: 8 }}
    />
  );
}
```

### Animation & Transitions

#### LinearProgress Animations

**Default Animation** - Built-in smooth transitions:
```jsx
<LinearProgress
  variant="determinate"
  value={50}
  sx={{
    transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  }}
/>
```

**Indeterminate Animation** - Continuous stripe animation:
```jsx
<LinearProgress variant="indeterminate" />
// Built-in animation: linear-gradient stripe moving left to right continuously
```

**Custom Animation Duration**:
```jsx
<LinearProgress
  variant="determinate"
  value={progress}
  sx={{
    '& .MuiLinearProgress-bar': {
      transitionDuration: '500ms', // Default is 300ms
    }
  }}
/>
```

#### CircularProgress Animations

**Indeterminate Rotation** - Default circular animation:
```jsx
<CircularProgress variant="indeterminate" />
// Built-in: 360-degree continuous rotation at ~1.4s per rotation
```

**Determinate Animation** - Smooth stroke animation:
```jsx
<CircularProgress
  variant="determinate"
  value={progress}
  sx={{
    '& .MuiCircularProgress-circle': {
      strokeDasharray: '1, 1', // Custom stroke pattern
    }
  }}
/>
```

**Custom Animation Speed**:
```jsx
<CircularProgress
  variant="indeterminate"
  sx={{
    animation: '$rotate 2s linear infinite', // Custom 2s rotation
    '@keyframes rotate': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    }
  }}
/>
```

### Integration Patterns

#### File Upload Progress

```jsx
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function FileUploadProgress() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    setUploading(true);
    setProgress(0);

    // Simulate upload with progress tracking
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 500);
  };

  return (
    <Box>
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={Math.min(progress, 100)} />
        </Box>
      )}
    </Box>
  );
}
```

#### Data Loading State

```jsx
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function DataLoading({ isLoading, data }) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <Box>{data}</Box>;
}
```

#### Long-Running Operation Feedback

```jsx
function LongRunningTask() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Processing...');

  const handleStart = async () => {
    // Simulate task with progress updates
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(i);
      setStatus(`${i}% Complete`);
    }
    setStatus('Complete!');
  };

  return (
    <Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mb: 2 }}
      />
      <Typography>{status}</Typography>
      <Button onClick={handleStart} disabled={progress > 0 && progress < 100}>
        Start Task
      </Button>
    </Box>
  );
}
```

### Accessibility Features

#### Built-in ARIA Support

**LinearProgress ARIA Attributes**:
```html
<!-- Automatically applied by MUI -->
<div role="progressbar"
     aria-valuenow="50"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="Upload progress">
  <!-- SVG or CSS bar -->
</div>
```

**CircularProgress ARIA Attributes**:
```html
<!-- Automatically applied by MUI -->
<div role="progressbar"
     aria-valuenow="75"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="Data loading">
  <!-- SVG circle -->
</div>
```

#### Accessible Progress Component

```jsx
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

function AccessibleProgress() {
  const [progress, setProgress] = useState(50);

  return (
    <div>
      <Typography id="progress-label" variant="label">
        Uploading file...
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        aria-labelledby="progress-label"
        aria-describedby="progress-status"
      />
      <Typography id="progress-status" variant="caption">
        {progress}% uploaded
      </Typography>
    </div>
  );
}
```

**Screen Reader Announcements**:
- Initial: "progress bar, 50% complete"
- On update: "progress bar, 75% complete"
- Indeterminate: "progress bar, loading"

#### Keyboard Accessibility

- Both components are non-interactive (read-only)
- No keyboard controls needed
- Focus can reach associated buttons/controls
- Screen readers announce current state and completion percentage

### Accessibility Notes
- `role="progressbar"` automatically applied
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` auto-updated
- Use `aria-label` or `aria-labelledby` for context when value alone insufficient
- Indeterminate state announced as "loading" or similar
- Color should not be sole indicator (use text labels)
- Sufficient contrast maintained in light and dark themes
- Respects `prefers-reduced-motion` with CSS media query option

## Key Properties/Props

### LinearProgress Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'determinate' \| 'indeterminate' \| 'buffer' \| 'query'` | `'indeterminate'` | Progress type - determinate shows percentage, indeterminate is animation, buffer shows download/buffered states, query is query variant |
| `value` | `number` | - | Progress percentage (0-100) for determinate variant |
| `valueBuffer` | `number` | - | Buffered progress percentage (0-100) for buffer variant only |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'info' \| 'success' \| 'warning' \| 'inherit'` | `'primary'` | Color theme for the progress bar |
| `sx` | `SxProps` | - | System props for styling (height, margins, etc.) |
| `classes` | `object` | - | Override CSS classes for specific elements |
| `className` | `string` | - | CSS class name for root element |

**Example Usage**:
```jsx
<LinearProgress
  variant="determinate"
  value={50}
  color="success"
  sx={{ height: 8, borderRadius: 4 }}
/>
```

### CircularProgress Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'determinate' \| 'indeterminate'` | `'indeterminate'` | Progress type - determinate shows ring at angle, indeterminate is rotating animation |
| `value` | `number` | - | Progress percentage (0-100) for determinate variant |
| `size` | `number \| string` | 40 | Diameter of the circle in pixels or string unit (e.g., '4rem') |
| `thickness` | `number` | 3.6 | Stroke width as a ratio of circle radius |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'info' \| 'success' \| 'warning' \| 'inherit'` | `'primary'` | Color theme for the progress circle |
| `disableShrink` | `boolean` | false | Prevent shrinking animation in indeterminate mode |
| `sx` | `SxProps` | - | System props for styling |
| `classes` | `object` | - | Override CSS classes for specific elements |
| `className` | `string` | - | CSS class name for root element |

**Example Usage**:
```jsx
<CircularProgress
  variant="determinate"
  value={75}
  size={60}
  thickness={4}
  color="success"
/>
```

## Common Patterns

### Pattern 1: File Upload with Progress
```jsx
// Shows percentage uploaded with label
<Box>
  <Typography>Uploading: {progress}%</Typography>
  <LinearProgress variant="determinate" value={progress} />
</Box>
```

### Pattern 2: Data Loading Overlay
```jsx
// Centered spinner over loading content
{isLoading && (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
    <CircularProgress />
  </Box>
)}
```

### Pattern 3: Multi-File Progress
```jsx
// Multiple bars for batch uploads
{files.map(file => (
  <Box key={file.id} sx={{ mb: 2 }}>
    <Typography>{file.name}</Typography>
    <LinearProgress variant="determinate" value={file.progress} />
  </Box>
))}
```

### Pattern 4: Circular Progress with Text
```jsx
// Percentage in center of circle
<Box sx={{ position: 'relative', display: 'inline-flex' }}>
  <CircularProgress variant="determinate" value={value} size={80} />
  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
             display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Typography>{value}%</Typography>
  </Box>
</Box>
```

### Pattern 5: Buffer State (Video Streaming)
```jsx
// Shows downloaded vs buffered for media
<LinearProgress
  variant="buffer"
  value={downloaded}
  valueBuffer={buffered}
  color="primary"
/>
```

### Pattern 6: Status-Based Color
```jsx
// Color changes based on operation state
<LinearProgress
  variant="determinate"
  value={progress}
  color={status === 'error' ? 'error' : 'primary'}
/>
```

## Related Components

MUI Progress components work alongside:

- **Box** - Container for layout and positioning
- **Typography** - For labels and percentage text
- **Button** - Triggers for starting/canceling operations
- **Card** - Context container for progress indicators
- **Skeleton** - Alternative loading state indicator
- **Backdrop** - Overlay for full-screen loading states

## Notable Features

- **SVG-based CircularProgress**: Uses SVG circle elements for smooth rendering and scalability
- **Determinate vs Indeterminate**: Two clear variants for different use cases - showing progress percentage or indicating ongoing activity
- **Buffer variant**: LinearProgress supports a buffer variant showing loaded vs buffered content (unique to Material UI) - useful for video streaming and media playback
- **Color palette integration**: Full color system support for theming and semantic meaning
- **Built-in accessibility**: Components automatically include proper ARIA attributes (role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax)
- **Smooth animations**: Default 300ms transition duration for LinearProgress state changes; continuous rotation for CircularProgress indeterminate
- **RTL support**: Both components automatically support right-to-left text direction
- **Theme customization**: Full support for theming via MUI's theme system with component-level customization via `sx` prop and global theme overrides
- **Responsive sizing**: Both components scale responsively with container or via explicit size props
- **Motion preferences**: Can respect `prefers-reduced-motion` with CSS media query styling

## Research Notes

- **Documentation Quality**: MUI provides comprehensive documentation with interactive examples and API reference
- **Version Stability**: Stable v5.x API with consistent prop naming and behavior
- **Component Imports**: Supports both default and named imports:
  - `import LinearProgress from '@mui/material/LinearProgress'`
  - `import { LinearProgress, CircularProgress } from '@mui/material'`
- **Theming Approach**: Uses MUI theme system with component-level customization via `sx` prop and global theme overrides via `MuiLinearProgress` and `MuiCircularProgress` component themes
- **Real-World Usage**: Both components are production-ready and widely used in Material Design applications
- **Performance**: SVG-based rendering (CircularProgress) and CSS-based (LinearProgress) provide smooth animations without layout thrashing
- **Browser Support**: Works across all modern browsers; limited support in IE11
- **Bundle Size Impact**: Minimal bundle size impact as components are part of core Material UI library

---

Research completed: 2025-11-05
Component: LinearProgress & CircularProgress
Framework: Material-UI (MUI)
Documentation: https://mui.com/material-ui/react-progress/
