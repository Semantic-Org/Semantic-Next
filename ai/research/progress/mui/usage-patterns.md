# MUI - Progress Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mui.com/material-ui/react-progress/
Status: ✅ Working
Version: Current (Material UI v5.x)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Material UI provides extensive documentation with interactive examples, API reference, and detailed prop documentation for both LinearProgress and CircularProgress components.

## Component Definition
- **Core purpose**: Provides visual feedback to users about the progress of ongoing operations or tasks. Displays determinate (with known completion percentage) or indeterminate (continuous animation) progress indicators.
- **Mental model**: Users perceive progress components as visual representations of task completion state. Linear progress is used for sequential tasks, while circular progress is used for loading states or indeterminate operations.
- **Semantic meaning**: Communicates to the user that an operation is in progress and either shows how far along the operation is (determinate) or indicates that processing is occurring (indeterminate).

## Pattern Support Levels
- **Native**: Dedicated props (e.g., `value={50}`, `variant="determinate"`)
- **Composed**: Via sx prop and theme customization
- **CSS-only**: Can be styled via CSS classes and theme overrides

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Can display percentage value via custom content or label prop |
| Icon support | ✅ | Composed | Icons can be placed alongside progress indicators via composition |
| Custom content | ✅ | Composed | Children or custom elements can be added around progress component |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | LinearProgress component with horizontal bar layout |
| Circular | ✅ | Native | CircularProgress component with circular SVG-based indicator |
| Dashboard/Arc | ⚠️ | Composed | Can be created using CircularProgress with custom styling and positioning |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Indeterminate | ✅ | Native | `variant="indeterminate"` - continuous animation without specific value |
| Success state | ✅ | Native | `color="success"` - color variant indicating completion |
| Error state | ✅ | Native | `color="error"` - color variant indicating failure or issue |
| Active/animating | ✅ | Native | Animation controlled by variant prop (determinate or indeterminate) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop for CircularProgress (e.g., `size={40}`); LinearProgress height via `sx` |
| Color options | ✅ | Native | `color` prop supports "inherit", "primary", "secondary", "error", "info", "success", "warning" |
| Percentage display | ✅ | Composed | Value prop (0-100) controls progress level; display via custom content |
| Segmented/steps | ⚠️ | CSS-only | Multiple stacked LinearProgress bars can create segmented appearance |

## Code Examples

### LinearProgress - Basic Determinate
```jsx
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearProgressExample() {
  return <LinearProgress value={50} variant="determinate" />;
}
```

### LinearProgress - Indeterminate
```jsx
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearIndeterminateExample() {
  return <LinearProgress variant="indeterminate" />;
}
```

### LinearProgress - With Color Variants
```jsx
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearProgressVariants() {
  return (
    <>
      <LinearProgress value={30} color="primary" />
      <LinearProgress value={60} color="success" />
      <LinearProgress value={90} color="error" />
    </>
  );
}
```

### CircularProgress - Basic Indeterminate
```jsx
import CircularProgress from '@mui/material/CircularProgress';

export default function CircularProgressExample() {
  return <CircularProgress />;
}
```

### CircularProgress - Determinate with Value
```jsx
import CircularProgress from '@mui/material/CircularProgress';

export default function CircularDeterminateExample() {
  return <CircularProgress value={75} variant="determinate" />;
}
```

### CircularProgress - Custom Size and Color
```jsx
import CircularProgress from '@mui/material/CircularProgress';

export default function CircularProgressCustom() {
  return (
    <CircularProgress
      size={100}
      value={45}
      variant="determinate"
      color="success"
    />
  );
}
```

### CircularProgress - With Label Text
```jsx
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function CircularProgressWithLabel() {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={75} size={80} />
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
        <Typography variant="caption" component="div" color="textSecondary">
          75%
        </Typography>
      </Box>
    </Box>
  );
}
```

### LinearProgress - Colored Buffer
```jsx
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearProgressBuffer() {
  return (
    <LinearProgress
      variant="buffer"
      value={50}
      valueBuffer={75}
    />
  );
}
```

## Notable Features

- **SVG-based CircularProgress**: Uses SVG circle elements for smooth rendering and scalability
- **Determinate vs Indeterminate**: Two clear variants for different use cases - showing progress percentage or indicating ongoing activity
- **Buffer variant**: LinearProgress supports a buffer variant showing loaded vs buffered content (useful for video streaming)
- **Color palette integration**: Full color system support for theming and semantic meaning
- **Accessibility**: Components include aria-valuenow, aria-valuemin, aria-valuemax for screen readers
- **Smooth animations**: Default 200ms transition duration for LinearProgress state changes
- **RTL support**: Both components support right-to-left text direction
- **Theme customization**: Full support for theming via MUI's theme system and sx prop

## Research Notes

- **Documentation access**: MUI documentation pages were difficult to fully extract via automated methods; CSS styling information was more readily available than component examples in web captures
- **Version stability**: Documentation indicates stable v5.x API with consistent prop naming and behavior
- **Component imports**: Supports both default and named imports: `import LinearProgress from '@mui/material/LinearProgress'` or `import { LinearProgress } from '@mui/material'`
- **Theming approach**: Uses MUI theme system with component-level customization via `sx` prop and global theme overrides via `MuiLinearProgress` and `MuiCircularProgress` component themes
- **Real-world usage**: Both components are production-ready and widely used in Material Design applications
- **Performance**: SVG-based rendering provides smooth animations without layout thrashing
