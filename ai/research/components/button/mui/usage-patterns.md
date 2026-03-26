# MUI (Material-UI) - Button Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://mui.com/material-ui/react-button/
Status: ✅ Working
Version: Material UI v5 (Current)
Last Verified: 2024-11-04

## Documentation Quality
**Comprehensive** - Excellent documentation with extensive examples, props reference, API documentation, theming guidance, and accessibility considerations. Includes interactive demos, TypeScript types, and detailed customization patterns.

## Component Definition
- **Core purpose**: Provides Material Design-compliant buttons for user actions with emphasis hierarchy through visual variants
- **Mental model**: An interactive element that triggers actions, with visual weight indicating importance (contained > outlined > text)
- **Semantic meaning**: Communicates actionability and importance level in the interface through elevation, borders, and color fill patterns

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Direct text as children: `<Button>Click me</Button>` |
| Icon support | ✅ | Native | Via `startIcon` and `endIcon` props for icon placement |
| Icon + Text | ✅ | Native | Icons automatically positioned with proper spacing via `startIcon`/`endIcon` |
| Loading indicator | ❌ | CSS-only | Not built-in, requires custom implementation or `@mui/lab` LoadingButton |
| Custom content | ✅ | Composed | Any React node as children (images, badges, etc.) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Contained | ✅ | Native | `variant="contained"` - Solid background, elevated (high emphasis) |
| Outlined | ✅ | Native | `variant="outlined"` - Border only (medium emphasis) |
| Text | ✅ | Native | `variant="text"` - No background or border (low emphasis, default) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` prop - Reduced opacity, no interaction, maintains accessibility |
| Loading | ⚠️ | Composed | Available via separate `LoadingButton` component in `@mui/lab` |
| Active/Pressed | ✅ | Native | Automatic ripple effect on interaction, focus states via theme |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="small"`, `size="medium"` (default), `size="large"` |
| Color options | ✅ | Native | `color="primary"`, `secondary`, `error`, `warning`, `info`, `success`, `inherit` |
| Full width | ✅ | Native | `fullWidth` prop - Button spans full width of container |
| Elevation control | ✅ | Native | `disableElevation` prop - Removes shadow from contained buttons |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | Standard `onClick` prop |
| Button group | ✅ | Native | `ButtonGroup` component for related button sets |
| Icon button | ✅ | Native | Separate `IconButton` component for icon-only actions |
| As link | ✅ | Native | `component` prop and `href` - Renders as anchor element |
| Upload button | ✅ | Composed | Via `component="label"` with hidden file input |

## Code Examples

### Basic Button Types
```jsx
import Button from '@mui/material/Button';

// Text button (low emphasis, default)
<Button variant="text">Text</Button>

// Contained button (high emphasis)
<Button variant="contained">Contained</Button>

// Outlined button (medium emphasis)
<Button variant="outlined">Outlined</Button>
```

### Color Variants
```jsx
// Semantic colors
<Button color="primary">Primary</Button>
<Button color="secondary">Secondary</Button>
<Button color="success">Success</Button>
<Button color="error">Error</Button>
<Button color="info">Info</Button>
<Button color="warning">Warning</Button>

// Inherit parent color
<Button color="inherit">Inherit</Button>
```

### Sizes
```jsx
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>  {/* Default */}
<Button size="large">Large</Button>
```

### Buttons with Icons
```jsx
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

// Icon at start
<Button variant="outlined" startIcon={<DeleteIcon />}>
  Delete
</Button>

// Icon at end
<Button variant="contained" endIcon={<SendIcon />}>
  Send
</Button>

// Both icons
<Button
  startIcon={<SaveIcon />}
  endIcon={<ArrowForwardIcon />}
>
  Save and Continue
</Button>
```

### Icon-Only Button
```jsx
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

// Standard icon button
<IconButton aria-label="delete">
  <DeleteIcon />
</IconButton>

// With size and color
<IconButton aria-label="fingerprint" color="secondary" size="large">
  <FingerprintIcon />
</IconButton>

// Disabled state
<IconButton disabled aria-label="delete">
  <DeleteIcon />
</IconButton>
```

### Button Groups
```jsx
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

// Basic horizontal group
<ButtonGroup variant="contained" aria-label="Basic button group">
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</ButtonGroup>

// Vertical orientation
<ButtonGroup
  orientation="vertical"
  variant="outlined"
  aria-label="Vertical button group"
>
  <Button>Top</Button>
  <Button>Middle</Button>
  <Button>Bottom</Button>
</ButtonGroup>

// With size and color
<ButtonGroup size="small" color="secondary" variant="text">
  <Button>Left</Button>
  <Button>Middle</Button>
  <Button>Right</Button>
</ButtonGroup>
```

### Loading Button (from @mui/lab)
```jsx
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

// Basic loading state
<LoadingButton loading variant="outlined">
  Submit
</LoadingButton>

// Loading with icon
<LoadingButton
  loading
  loadingPosition="start"
  startIcon={<SaveIcon />}
  variant="contained"
>
  Save
</LoadingButton>

// Loading indicator only
<LoadingButton loading variant="text">
  Fetch Data
</LoadingButton>
```

### Button as Link
```jsx
import Button from '@mui/material/Button';

// Standard href link
<Button href="https://mui.com">Link</Button>

// With component override (e.g., Next.js Link)
<Button component={Link} to="/about">
  About
</Button>

// External link with target
<Button
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
>
  External Link
</Button>
```

### Upload Button
```jsx
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// File input hidden, button triggers
<Button
  component="label"
  role={undefined}
  variant="contained"
  tabIndex={-1}
  startIcon={<CloudUploadIcon />}
>
  Upload file
  <input
    type="file"
    style={{ display: 'none' }}
    onChange={(e) => console.log(e.target.files)}
  />
</Button>
```

### Disabled State
```jsx
// All variants support disabled
<Button disabled variant="text">Disabled Text</Button>
<Button disabled variant="contained">Disabled Contained</Button>
<Button disabled variant="outlined">Disabled Outlined</Button>

// Disabled with icon
<Button disabled startIcon={<DeleteIcon />}>
  Can't Delete
</Button>
```

### Full Width Button
```jsx
<Button variant="contained" fullWidth>
  Full Width Button
</Button>
```

### Custom Styling with sx Prop
```jsx
import Button from '@mui/material/Button';

// Using sx prop for one-off customization
<Button
  variant="contained"
  sx={{
    backgroundColor: 'purple',
    '&:hover': {
      backgroundColor: 'darkpurple',
    },
    borderRadius: 2,
    textTransform: 'none',
  }}
>
  Custom Styled
</Button>
```

### Theming Buttons Globally
```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
      variants: [
        {
          props: { variant: 'dashed' },
          style: {
            border: '2px dashed grey',
          },
        },
      ],
      defaultProps: {
        disableRipple: false,
        disableElevation: false,
      },
    },
  },
});

<ThemeProvider theme={theme}>
  <Button variant="contained">Themed Button</Button>
</ThemeProvider>
```

### Complex Button with Multiple Features
```jsx
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';

<Button
  variant="contained"
  color="primary"
  size="large"
  startIcon={<SaveIcon />}
  fullWidth
  onClick={() => console.log('Save clicked')}
  sx={{ mt: 2, borderRadius: 2 }}
>
  Save Changes
</Button>
```

## Notable Features

### 1. Material Design Compliance
MUI Buttons strictly follow Material Design specifications including:
- **Ripple effect**: Touch feedback animation on all interactive states
- **Elevation system**: Contained buttons use Material elevation shadows
- **Focus indicators**: Clear 2px outline offset for keyboard navigation
- **Color system**: Semantic color palette that adapts to light/dark modes

### 2. Comprehensive Size System
Three size options that scale proportionally:
- **Small**: Reduced padding and font size for compact UIs
- **Medium** (default): Standard Material Design button dimensions
- **Large**: Increased touch target for mobile or emphasis

### 3. Icon Integration
First-class icon support with:
- `startIcon` and `endIcon` props for automatic positioning
- Proper spacing and alignment
- Icon sizing adapts to button size
- Separate `IconButton` component for icon-only use cases

### 4. Component Polymorphism
`component` prop allows rendering as different HTML elements:
```jsx
<Button component="a" href="/link">Link Button</Button>
<Button component={RouterLink} to="/route">Router Button</Button>
<Button component="label">Upload Button</Button>
```

### 5. Advanced Theming System
- Global style overrides via theme
- Custom variant creation
- CSS variable support for dynamic theming
- `sx` prop for component-level customization

### 6. Accessibility Built-In
- Proper ARIA attributes automatically applied
- Keyboard navigation support
- Focus management
- Screen reader announcements for state changes
- Disabled state properly conveyed

### 7. Button Group Component
Specialized component for related button sets:
- Unified styling across grouped buttons
- Vertical or horizontal orientation
- Proper focus management between buttons
- Shared size, color, and variant props

### 8. Loading State (Lab Package)
`LoadingButton` component provides:
- Built-in spinner indicator
- Loading position control (start/center/end)
- Disabled during loading automatically
- Smooth loading state transitions

### 9. Ripple Effect System
Material Design touch feedback:
- Configurable via theme
- Can be disabled per button or globally
- Touch-optimized for mobile
- Color adapts to button variant and color

### 10. No Built-in Spacing Props
Follows Material-UI philosophy of separation of concerns:
- Layout and spacing handled by parent components or layout system
- Use `Box`, `Stack`, or spacing utilities for margins
- Keeps button API focused on appearance and interaction

## Research Notes

### Framework Approach
MUI takes a **prop-driven configuration** approach where:
- Most patterns available via dedicated props
- Composition used for complex content
- Heavy emphasis on theming for global consistency
- Strict Material Design adherence

### API Design Philosophy
- **Explicit over implicit**: Size and variant must be specified (defaults to text/medium)
- **Semantic color names**: Uses design system color tokens
- **Separation of concerns**: Button handles appearance, layout handled externally
- **Type safety**: Full TypeScript support with prop type inference

### Component Architecture
- **Single component for text/contained/outlined**: Unified API via `variant` prop
- **Separate IconButton**: Optimized component for icon-only use case
- **ButtonGroup**: Dedicated composition component
- **LoadingButton**: Extended component in Lab package (experimental/advanced features)

### Material Design Patterns
1. **Elevation hierarchy**: Contained > Outlined > Text
2. **Color semantics**: Primary (brand), Secondary (accent), Error/Warning/Info/Success (status)
3. **Ripple feedback**: All interactive states show ripple animation
4. **Focus indicators**: 2px offset outline for accessibility
5. **Size consistency**: Button sizes align with Material Design spacing scale

### State Management
- **Disabled**: Reduces opacity, removes interaction, maintains layout
- **Loading**: Requires separate LoadingButton component
- **Hover/Focus/Active**: Automatic via theme styling
- **Pressed**: Ripple effect indicates interaction

### Customization Layers
1. **Theme-level**: Global overrides for all buttons
2. **Component-level**: `sx` prop for one-off styling
3. **Variant extension**: Create custom variants via theme
4. **CSS override**: Traditional className/style props supported

## Comparison Insights

### Strengths
1. **Material Design compliance**: Full adherence to design system
2. **Icon integration**: First-class startIcon/endIcon support
3. **Button groups**: Dedicated component for related actions
4. **Theming power**: Extensive customization via theme system
5. **Accessibility**: Built-in ARIA and keyboard support
6. **Type safety**: Excellent TypeScript integration
7. **Ripple effect**: Polished interaction feedback

### Potential Limitations
1. **No built-in loading**: Requires separate Lab package
2. **No spacing props**: Must use layout components
3. **Material Design lock-in**: Hard to deviate from Material patterns
4. **Larger bundle**: Full Material Design system included
5. **No alignment props**: Content alignment requires custom styling

### Patterns to Consider for Semantic UI

#### Adopt These Patterns
1. **Dedicated icon props**: `startIcon`/`endIcon` cleaner than children composition
2. **Variant-based hierarchy**: `contained`/`outlined`/`text` communicates visual weight
3. **Semantic colors**: `primary`/`secondary`/`error`/`success`/`warning`/`info`
4. **Size scaling**: `small`/`medium`/`large` with proportional dimensions
5. **ButtonGroup component**: Useful for toolbar patterns
6. **Component polymorphism**: `component` prop for rendering flexibility

#### Improve Upon
1. **Built-in loading**: Include loading state in base component
2. **Spacing props**: Allow margin/padding for convenience
3. **Alignment options**: Built-in text/icon alignment control
4. **Lighter weight**: Optional Material Design features
5. **More flexible theming**: Break free from Material constraints

### Questions for Semantic UI Design
1. **Design system adherence**: Should we follow a specific design language or be agnostic?
2. **Loading state**: Built-in or separate component?
3. **Icon patterns**: Props vs. children vs. both?
4. **Spacing**: Component-level props or system-level only?
5. **Ripple effect**: Include animation feedback or leave to CSS?
6. **Button groups**: Separate component or button prop?
7. **Elevation**: Should we support Material-style shadows?

## Implementation Details Worth Noting

### Prop Interface
```typescript
interface ButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  disableElevation?: boolean;
  disableRipple?: boolean;
  fullWidth?: boolean;
  href?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  component?: React.ElementType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // Plus all standard HTML button attributes
}
```

### CSS Custom Properties
MUI uses CSS variables for dynamic theming:
```css
.MuiButton-root {
  --Button-gap: 8px;
  color: var(--mui-palette-primary-main);
  background-color: var(--mui-palette-background-paper);
}
```

### Accessibility Attributes
Automatically applied:
```html
<button
  class="MuiButton-root"
  type="button"
  aria-disabled="false"
  tabindex="0"
>
  Button Text
</button>
```

### Component Composition
Button components compose from base primitives:
```
Button → ButtonBase → TouchRipple → ButtonUnstyled
```

This architecture allows:
- Shared ripple logic across components
- Consistent focus management
- Unified event handling
- Theme integration at base level
