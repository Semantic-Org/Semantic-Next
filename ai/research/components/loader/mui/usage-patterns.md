# MUI (Material UI) - CircularProgress Usage Patterns

## Component URL
https://mui.com/material-ui/react-progress/#circular
Status: ✅ Working
API Reference: https://mui.com/material-ui/api/circular-progress/
Version: Material UI v5+ (Current)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - Material UI provides detailed documentation with interactive examples, complete API reference, accessibility guidance, and extensive customization options.

---

## 1. Component Overview

CircularProgress is Material UI's circular loading indicator component that visualizes progress or activity. It provides both determinate (percentage-based) and indeterminate (continuous animation) modes to indicate task completion or ongoing processes. As part of Material Design's progress indicator system, it works alongside LinearProgress to provide visual feedback during asynchronous operations, data loading, or background tasks.

---

## 2. Basic Usage

### Import
```jsx
import CircularProgress from '@mui/material/CircularProgress';
// or
import { CircularProgress } from '@mui/material';
```

### Minimal Example (Indeterminate)
```jsx
// Default indeterminate spinner
<CircularProgress />
```

### Basic Variants
```jsx
// Different colors
<CircularProgress />
<CircularProgress color="secondary" />
<CircularProgress color="success" />
<CircularProgress color="inherit" />

// Determinate with specific value
<CircularProgress variant="determinate" value={25} />
<CircularProgress variant="determinate" value={50} />
<CircularProgress variant="determinate" value={75} />
<CircularProgress variant="determinate" value={100} />
```

---

## 3. Props/API

### Complete Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'determinate' \| 'indeterminate'` | `'indeterminate'` | The variant to use. Use indeterminate when there is no progress value. Use determinate when showing specific progress percentage. |
| `value` | `number` | `0` | The value of the progress indicator for determinate variant. Value between 0 and 100. |
| `size` | `number \| string` | `40` | The size of the component. If using a number, pixel units are assumed. Can use CSS units (e.g., '3rem', '30px'). |
| `thickness` | `number` | `3.6` | The thickness of the circle stroke. Controls the width of the circular ring. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'info' \| 'success' \| 'warning' \| 'inherit'` | `'primary'` | The color of the component. Supports theme palette colors or 'inherit' from parent. |
| `disableShrink` | `boolean` | `false` | If true, disables the shrink animation. Only works with indeterminate variant. Useful for performance under heavy load. |
| `sx` | `SxProps` | - | System prop for styling. Accepts all CSS properties and theme-aware values. |
| `classes` | `object` | - | Override or extend component styles. See CSS API for available classes. |

### Inherited Props
CircularProgress also accepts all standard HTML `div` element props (className, style, etc.) as it renders to a `div`.

---

## 4. Variants & Patterns

### Determinate vs Indeterminate Modes

**Indeterminate Mode** (Default)
- Continuously animates without showing specific progress
- Used when task duration is unknown
- Shows two animations: rotation + expanding/contracting arc
- Best for API calls, data fetching, unknown wait times

```jsx
<CircularProgress />
```

**Determinate Mode**
- Shows specific progress percentage (0-100)
- Used when progress can be measured
- Static arc length representing completion percentage
- Best for file uploads, multi-step processes, measurable tasks

```jsx
<CircularProgress variant="determinate" value={progress} />

// Dynamic progress example
function DynamicProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return <CircularProgress variant="determinate" value={progress} />;
}
```

### Size Variants

```jsx
// Number (pixels assumed)
<CircularProgress size={20} />
<CircularProgress size={40} />  {/* default */}
<CircularProgress size={60} />

// String with CSS units
<CircularProgress size="30px" />
<CircularProgress size="3rem" />
<CircularProgress size="10vw" />
```

### Color Variants

```jsx
// Theme palette colors
<CircularProgress color="primary" />    {/* default - theme primary color */}
<CircularProgress color="secondary" />  {/* theme secondary color */}
<CircularProgress color="error" />
<CircularProgress color="warning" />
<CircularProgress color="info" />
<CircularProgress color="success" />
<CircularProgress color="inherit" />    {/* inherit from parent */}

// Custom colors via sx prop
<CircularProgress sx={{ color: '#ff6b6b' }} />
<CircularProgress sx={{ color: 'red' }} />
```

### Thickness Control

```jsx
// Thin stroke
<CircularProgress thickness={2} />

// Default
<CircularProgress thickness={3.6} />  {/* default */}

// Thick stroke
<CircularProgress thickness={7} />

// Combined with size
<CircularProgress size={100} thickness={4} />
```

### Value Display (Percentage)

Material UI doesn't provide built-in percentage display. Requires composition:

```jsx
// Basic composition with percentage
<Box sx={{ position: 'relative', display: 'inline-flex' }}>
  <CircularProgress variant="determinate" value={progress} />
  <Box
    sx={{
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Typography variant="caption" component="div" color="text.secondary">
      {`${Math.round(progress)}%`}
    </Typography>
  </Box>
</Box>
```

### Performance: disableShrink

```jsx
// Default: rotation + shrink/expand animation
<CircularProgress />

// Performance mode: rotation only, no shrink animation
<CircularProgress disableShrink />
```

**When to use `disableShrink`:**
- Under heavy computational load
- When experiencing animation stuttering
- On lower-end devices
- IE 11 compatibility (where shrink animation doesn't work properly)

**Note:** CircularProgress does NOT have a native buffer/secondary progress feature like LinearProgress. For multi-layer progress, you would need to compose multiple CircularProgress components manually.

---

## 5. Composition Patterns

### With Backdrop (Fullscreen Loading)

```jsx
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function FullscreenLoader() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Load</Button>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
```

### With Buttons

```jsx
// Loading button with icon
<Button
  endIcon={<CircularProgress size={20} />}
  variant="outlined"
  disabled
>
  Loading...
</Button>

// Centered in button
<Button disabled>
  <CircularProgress size={24} />
</Button>
```

### With Box (Centered Layout)

```jsx
<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
  <CircularProgress />
</Box>
```

### Multiple Layers (Manual Buffer Simulation)

```jsx
// Two overlapping progress indicators
<Box sx={{ position: 'relative', display: 'inline-flex' }}>
  <CircularProgress
    variant="determinate"
    value={100}
    size={60}
    thickness={4}
    sx={{ color: 'grey.300' }}
  />
  <CircularProgress
    variant="determinate"
    value={progress}
    size={60}
    thickness={4}
    sx={{
      position: 'absolute',
      left: 0,
    }}
  />
</Box>
```

---

## 6. Styling & Theming

### Using the sx Prop (Recommended)

The `sx` prop is the recommended approach for single-instance customizations:

```jsx
// Custom color
<CircularProgress
  sx={{ color: 'red' }}
/>

// Multiple style properties
<CircularProgress
  sx={{
    color: '#1976d2',
    margin: 2,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }}
/>

// Theme-aware styling
<CircularProgress
  sx={{
    color: (theme) => theme.palette.success.main,
  }}
/>
```

### Using CSS Classes

```jsx
// Target specific classes
<CircularProgress
  className="custom-progress"
  sx={{
    '&.MuiCircularProgress-colorPrimary': {
      color: 'purple',
    },
  }}
/>
```

### Theme-Level Customization

Configure defaults for all CircularProgress instances:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiCircularProgress: {
      defaultProps: {
        size: 50,
        thickness: 4,
      },
      styleOverrides: {
        root: {
          color: '#1976d2',
        },
        colorPrimary: {
          color: '#ff6b6b',
        },
      },
    },
  },
});

<ThemeProvider theme={theme}>
  <CircularProgress />
</ThemeProvider>
```

### Styled Components Approach

```jsx
import { styled } from '@mui/material/styles';

const StyledProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.success.main,
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginTop: -20,
  marginLeft: -20,
}));

<StyledProgress size={40} />
```

### CSS Variables

```jsx
// Using CSS custom properties
<CircularProgress
  sx={{
    '--CircularProgress-size': '60px',
    width: 'var(--CircularProgress-size)',
    height: 'var(--CircularProgress-size)',
  }}
/>
```

---

## 7. Accessibility

### ARIA Attributes

Material UI automatically adds appropriate ARIA attributes:

**For Indeterminate Variant:**
- `role="progressbar"`
- `aria-busy="true"`

**For Determinate Variant:**
- `role="progressbar"`
- `aria-valuenow={value}` (current value)
- `aria-valuemin={0}`
- `aria-valuemax={100}`

### Required: Accessible Name

**Important:** Progress indicators require an accessible name for screen readers.

```jsx
// Using aria-label
<CircularProgress aria-label="Loading user data" />

// Using aria-labelledby
<div>
  <Typography id="loading-label">Loading...</Typography>
  <CircularProgress aria-labelledby="loading-label" />
</div>

// For regions being loaded
<Box aria-busy={loading} aria-describedby="progress-indicator">
  <CircularProgress id="progress-indicator" aria-label="Loading content" />
  {/* Content area */}
</Box>
```

### Keyboard Support

CircularProgress is a visual indicator and does not receive keyboard focus or require keyboard interaction.

### Screen Reader Support

With proper ARIA labels:
- Indeterminate: Announces as "Loading..." or custom label
- Determinate: Announces percentage and custom label (e.g., "Uploading file: 45%")

### Common Accessibility Issues

❌ **Failure:** Missing accessible name
```jsx
<CircularProgress />  {/* Accessibility scan will fail */}
```

✅ **Success:** With accessible name
```jsx
<CircularProgress aria-label="Loading" />
```

---

## 8. Best Practices

### When to Use Circular vs Linear

**Use CircularProgress When:**
- Loading data from APIs or databases
- General loading states in smaller spaces
- Unknown task duration
- Space is limited (buttons, cards, small containers)
- Compact, centered loading indicators needed

**Use LinearProgress When:**
- File uploads or downloads (measurable progress)
- Multi-step processes with clear stages
- Horizontal layouts with available width
- Need to show buffer/secondary progress
- Progress needs to be more prominent

### When to Use Determinate vs Indeterminate

**Use Indeterminate When:**
- Task duration is unknown
- Progress cannot be measured
- Waiting for server response
- Continuous background processes
- Initial data fetching

**Use Determinate When:**
- Progress can be calculated (0-100%)
- File uploads/downloads with size known
- Multi-step forms or wizards
- Tasks with measurable completion
- User needs to know "how much longer"

### Timing Guidelines

**Delay Display:**
- 0-100ms: No feedback needed
- 100ms-1s: Optional feedback
- 1s+: Show loading indicator

**Implementation:**
```jsx
function DelayedProgress() {
  const [showProgress, setShowProgress] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowProgress(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return showProgress ? <CircularProgress /> : null;
}
```

### Performance Considerations

1. **Use `disableShrink` under heavy load**
```jsx
<CircularProgress disableShrink />
```

2. **Avoid excessive re-renders**
```jsx
// Bad: Creates new function on every render
<CircularProgress value={getValue()} />

// Good: Memoize or use stable reference
const value = useMemo(() => getValue(), [dependencies]);
<CircularProgress value={value} />
```

3. **Consider lazy loading for conditional display**
```jsx
{isLoading && <CircularProgress />}
```

### Color and Contrast

- Ensure sufficient contrast against background (4.5:1 minimum)
- Use `color="inherit"` when displaying over varying backgrounds
- Test in both light and dark modes
- Consider color blindness (don't rely solely on color)

### Common Patterns

**Loading State:**
```jsx
{isLoading ? <CircularProgress /> : <DataDisplay />}
```

**Centered Page Loading:**
```jsx
<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
  <CircularProgress aria-label="Loading application" />
</Box>
```

**Inline Loading:**
```jsx
<Button disabled={loading}>
  {loading ? <CircularProgress size={24} /> : 'Submit'}
</Button>
```

---

## 9. Comparison Notes

### Relationship to LinearProgress

Both CircularProgress and LinearProgress are part of MUI's progress indicator family:

**Shared Features:**
- Same variant types (determinate/indeterminate)
- Same color prop options
- Similar accessibility requirements
- Consistent theming approach

**Key Differences:**

| Feature | CircularProgress | LinearProgress |
|---------|------------------|----------------|
| Shape | Circular ring | Horizontal bar |
| Space usage | Compact, square | Requires width |
| Buffer mode | ❌ Not supported | ✅ Native support |
| Query mode | ❌ Not supported | ✅ Native support |
| Typical use | General loading, API calls | File uploads, steps |
| Visual prominence | Subtle, contained | More prominent |

**LinearProgress Exclusive Features:**
```jsx
// Buffer variant (not available in CircularProgress)
<LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />

// Query variant (not available in CircularProgress)
<LinearProgress variant="query" />
```

### Material Design Approach

**Unique to Material Design/MUI:**
1. **No built-in text labels** - Composition required for percentage display
2. **disableShrink prop** - Performance optimization for indeterminate variant
3. **Shrink animation** - Default indeterminate has dual rotation + shrink effect
4. **Theme integration** - Deep integration with Material UI's theming system
5. **Palette colors** - Uses semantic color tokens (primary, secondary, error, etc.)

**Material Design Philosophy:**
- Progress indicators should be unobtrusive
- Use only when necessary (>1 second wait)
- Prefer determinate when possible for user clarity
- Maintain consistency with other Material components

**Compared to Other Frameworks:**
- Some frameworks (Ant Design, Chakra) provide built-in text/percentage display
- MUI requires manual composition for labels (more flexible but more code)
- MUI's `disableShrink` is unique for performance tuning
- Strong emphasis on accessibility (ARIA attributes auto-applied)

---

## Notable Features

1. **Automatic ARIA attributes** - Accessibility built-in with role="progressbar" and appropriate aria-* attributes
2. **Dual animation in indeterminate mode** - Both rotation and expanding/contracting arc (can disable shrink for performance)
3. **Flexible sizing** - Accepts both numeric (px) and string (CSS units) values
4. **Theme-aware colors** - Integrates with Material UI's palette system
5. **Performance optimization** - `disableShrink` prop for high-load scenarios
6. **sx prop support** - Modern, powerful styling system with theme access
7. **TypeScript support** - Full type definitions included
8. **Composition-based** - No built-in labels encourages flexible, accessible composition patterns

---

## Research Notes

- Material UI documentation is comprehensive with live interactive examples
- The component follows Material Design specification closely
- Strong focus on accessibility, though requires manual ARIA labels
- The lack of built-in percentage/label display is intentional (composition pattern)
- `disableShrink` is a pragmatic addition for real-world performance needs
- Documentation includes migration guides from older versions
- Active community with extensive Stack Overflow coverage
- Well-maintained with regular updates and bug fixes

---

## Code Examples Summary

### Complete Usage Example

```jsx
import React from 'react';
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  Backdrop,
} from '@mui/material';

function ComprehensiveExample() {
  const [progress, setProgress] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  // Simulated progress
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      {/* Basic indeterminate */}
      <CircularProgress aria-label="Loading" />

      {/* With color and size */}
      <CircularProgress
        color="secondary"
        size={60}
        aria-label="Secondary loading"
      />

      {/* Determinate with percentage */}
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          aria-label={`Upload progress: ${progress}%`}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      </Box>

      {/* In a button */}
      <Button
        variant="contained"
        disabled
        endIcon={<CircularProgress size={20} color="inherit" />}
      >
        Loading
      </Button>

      {/* With backdrop */}
      <Button onClick={() => setLoading(true)}>Show Backdrop</Button>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={loading}
        onClick={() => setLoading(false)}
      >
        <CircularProgress color="inherit" aria-label="Loading data" />
      </Backdrop>
    </Box>
  );
}

export default ComprehensiveExample;
```

---

**Last Modified:** 2025-11-04
**Framework Version:** Material UI v5+
**Research Methodology:** Web search analysis of official documentation, API reference, community examples, and accessibility guidelines
