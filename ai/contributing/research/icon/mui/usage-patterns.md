# MUI Icon - Usage Patterns

## Research Metadata
- **Framework**: Material-UI (MUI) v5+
- **Component**: Icon, SvgIcon, IconButton (related)
- **Documentation URL**: https://mui.com/material-ui/icons/
- **Research Date**: 2025-11-05
- **URL Status**: Verified accessible
- **Icon Library**: @mui/icons-material (1000+ Material Design icons)

---

## Component Overview

The Material-UI Icon component is a fundamental building block for displaying scalable vector icons within React applications. It's based on Google's Material Design icon system and provides:

- **Standardized styling** for consistent icon presentation
- **Multiple sizing options** (small, medium, large, inherit, custom)
- **Theme-based colors** (primary, secondary, error, warning, info, success, action, disabled)
- **Full customization** via the `sx` prop
- **Semantic HTML** and accessibility support
- **SVG-based rendering** for crisp, scalable display at any size

**Mental Model**: The Icon component wraps SVG icons with built-in Material Design styling, sizing, and theming. It's complementary to IconButton (which adds interaction) and works with @mui/icons-material icons or custom SVGs.

---

## Component Architecture

### Icon Component Hierarchy

```
Icon (base wrapper)
├── Renders: <svg> element
├── Default: Material Design system icon
└── Inherits: currentColor from parent

IconButton (interactive layer)
├── Wraps: Icon component
├── Adds: Click handling, focus states, size
└── Pattern: <IconButton><Icon>content</Icon></IconButton>

SvgIcon (custom icon wrapper)
├── Renders: Custom SVG content
├── Scales: 24x24px viewport
└── Pattern: Wrap custom SVG paths
```

**Key Distinction**:
- **Icon**: Base component for displaying icons with styling
- **SvgIcon**: Wrapper for custom SVG icons
- **IconButton**: Interactive container that typically wraps Icon

---

## Basic Usage

### Simple Icon Display

```jsx
import Icon from '@mui/material/Icon';

// Using Material Design icon names as children
<Icon>home</Icon>
<Icon>settings</Icon>
<Icon>favorite</Icon>
<Icon>delete</Icon>
```

**Rendering**: Produces `<svg>` element with Material Design icon

### Icon with @mui/icons-material

Most common pattern - import specific icon components:

```jsx
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';

// Use as components directly
<HomeIcon />
<SettingsIcon />
<FavoriteIcon />
<DeleteIcon />
```

**Advantages**:
- Better tree-shaking and bundle optimization
- IDE autocomplete support
- Type safety with TypeScript
- No font ligature dependency

**Disadvantages**:
- Larger icon library to install
- More imports needed for variety

---

## Props/API

### Core Icon Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **children** | `string \| node` | - | Icon name (for Icon component) or SVG content (for SvgIcon) | Level 1 |
| **fontSize** | `'small' \| 'medium' \| 'large' \| 'inherit'` | `'medium'` | Icon size variant | Level 1 |
| **color** | `'inherit' \| 'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success' \| 'action' \| 'disabled'` | `'inherit'` | Theme color variant | Level 1 |
| **sx** | `object` | - | System props and CSS overrides | Level 1 |
| **className** | `string` | - | CSS class name | Level 1 |
| **baseClassName** | `string` | `'material-icons'` | Base font class for ligature icons | Level 2 |
| **component** | `elementType` | `'span'` | Root element to render as | Level 2 |
| **htmlColor** | `string` | - | Custom color (CSS color value) | Level 2 |
| **noWrap** | `boolean` | `false` | Prevent wrapping | Level 2 |
| **variant** | `'filled' \| 'outlined' \| 'rounded' \| 'sharp' \| 'two-tone'` | `'filled'` | Material Design icon variant (via @mui/icons-material) | Level 1 |

### CSS Classes Available

```javascript
.MuiIcon-root                    // Root element
.MuiIcon-colorPrimary           // Primary color variant
.MuiIcon-colorSecondary         // Secondary color variant
.MuiIcon-colorError             // Error color variant
.MuiIcon-colorWarning           // Warning color variant
.MuiIcon-colorInfo              // Info color variant
.MuiIcon-colorSuccess           // Success color variant
.MuiIcon-colorAction            // Action color variant
.MuiIcon-colorDisabled          // Disabled color variant
.MuiIcon-fontSizeSmall          // Small size variant
.MuiIcon-fontSizeLarge          // Large size variant
.MuiIcon-fontSizeInherit        // Inherit size variant
```

---

## Common Patterns

### Pattern 1: Size Variants (Level 1)

MUI provides four built-in size options:

```jsx
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Small (18px)
<RestartAltIcon fontSize="small" />

// Medium (24px) - default
<RestartAltIcon fontSize="medium" />

// Large (32px)
<RestartAltIcon fontSize="large" />

// Inherit from parent font size
<RestartAltIcon fontSize="inherit" />
```

**Sizing Details**:
- **small**: 18px (body text)
- **medium**: 24px (default, standard icon size)
- **large**: 32px (headings, prominent icons)
- **inherit**: Scales with parent `font-size`

### Pattern 2: Color Variants (Level 1)

Theme-based color options:

```jsx
import FavoriteIcon from '@mui/icons-material/Favorite';

// Default - inherit from parent text color
<FavoriteIcon />

// Theme colors
<FavoriteIcon color="primary" />
<FavoriteIcon color="secondary" />
<FavoriteIcon color="error" />
<FavoriteIcon color="warning" />
<FavoriteIcon color="info" />
<FavoriteIcon color="success" />

// Semantic colors
<FavoriteIcon color="action" />      // Default action color
<FavoriteIcon color="disabled" />    // Disabled state

// Inherit from parent
<FavoriteIcon color="inherit" />
```

**Color Semantics**:
- **primary**: Primary brand color
- **secondary**: Secondary brand color
- **error**: Error/destructive actions (#d32f2f)
- **warning**: Warning states (#f57c00)
- **info**: Information (#1976d2)
- **success**: Success states (#388e3c)
- **action**: Default interactive elements
- **disabled**: Disabled/inactive state
- **inherit**: Parent text color

### Pattern 3: Custom Styling (Level 1)

Using the `sx` prop for theme-aware custom styles:

```jsx
import { green } from '@mui/material/colors';
import CameraIcon from '@mui/icons-material/Camera';

// Custom color from palette
<CameraIcon sx={{ color: green[500] }} />

// Custom font size (CSS value)
<CameraIcon sx={{ fontSize: 30 }} />

// Multiple style properties
<CameraIcon sx={{
  color: green[500],
  fontSize: 40,
  fontWeight: 'bold'
}} />

// Responsive sizing
<CameraIcon sx={{
  fontSize: { xs: 20, sm: 24, md: 32 }
}} />

// Hover effects
<CameraIcon sx={{
  color: green[200],
  fontSize: 24,
  '&:hover': {
    color: green[500]
  }
}} />

// Animation
<CameraIcon sx={{
  animation: 'spin 1s linear infinite',
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
}} />
```

**Key Pattern**: The `sx` prop provides access to theme tokens while allowing CSS-in-JS styling.

### Pattern 4: Icon Button Integration (Level 1)

Combining Icon with IconButton for interactive use:

```jsx
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// Basic icon button
<IconButton>
  <DeleteIcon />
</IconButton>

// Colored icon button
<IconButton color="error">
  <DeleteIcon />
</IconButton>

// Sized icon button
<IconButton size="small">
  <DeleteIcon fontSize="small" />
</IconButton>

<IconButton size="large">
  <DeleteIcon fontSize="large" />
</IconButton>

// Disabled state
<IconButton disabled>
  <DeleteIcon />
</IconButton>

// With aria-label (important for accessibility)
<IconButton aria-label="delete">
  <DeleteIcon />
</IconButton>

// With tooltip
import Tooltip from '@mui/material/Tooltip';

<Tooltip title="Delete item">
  <IconButton aria-label="delete">
    <DeleteIcon />
  </IconButton>
</Tooltip>
```

**Best Practice**: Always include `aria-label` on IconButton for screen readers, especially important since icon buttons have no visible text.

### Pattern 5: Icon Button with States (Level 2)

Managing interactive states:

```jsx
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function FavoriteButton() {
  const [liked, setLiked] = useState(false);

  return (
    <IconButton
      onClick={() => setLiked(!liked)}
      aria-label="add to favorites"
      color={liked ? 'error' : 'default'}
    >
      {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  );
}
```

**Pattern**:
- Track state with `useState`
- Switch icon based on state
- Change color based on state
- Include meaningful `aria-label`

### Pattern 6: Icon Button with Loading (Level 3)

Loading state support (MUI v6.4.0+):

```jsx
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function LoadingIconButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await someAsyncOperation();
    setLoading(false);
  };

  return (
    <IconButton
      onClick={handleClick}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <CloudUploadIcon />
      )}
    </IconButton>
  );
}
```

**Pattern**:
- Show loading spinner while async operation runs
- Disable button during loading
- Use `aria-busy` for accessibility

### Pattern 7: Badge Integration (Level 2)

Adding badges/counts to icons:

```jsx
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import MailIcon from '@mui/icons-material/Mail';

// Notification badge
<Badge badgeContent={4} color="error">
  <MailIcon />
</Badge>

// In icon button
<IconButton aria-label="show mail">
  <Badge badgeContent={4} color="error">
    <MailIcon />
  </Badge>
</IconButton>

// Custom styling
<Badge
  badgeContent={4}
  color="primary"
  sx={{
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: '0 0 0 2px #fff'
    }
  }}
>
  <MailIcon />
</Badge>
```

**Use Cases**:
- Notification counts
- Status indicators
- Unread message counts
- Active state indicators

---

## Visual Variations

### Material Design Icon Variants

The @mui/icons-material library includes icons in five variants:

```jsx
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';

// Filled (default, solid)
<HomeIcon />  {/* Solid fill */}

// Outlined (border only)
<HomeOutlinedIcon />  {/* Just outline */}

// Rounded (softer corners)
<HomeRoundedIcon />  {/* Rounded corners */}

// Sharp (no rounding)
<HomeSharpIcon />  {/* Fully sharp */}

// Two-tone (two colors)
<HomeTwoToneIcon />  {/* Primary + secondary */}
```

**Visual Characteristics**:
- **Filled**: Solid, dense appearance (default)
- **Outlined**: Light, border-based design
- **Rounded**: Softer, modern appearance
- **Sharp**: Geometric, precise design
- **Two-tone**: Primary + secondary color combination

### Custom Icon Colors

Creating visual hierarchy with color:

```jsx
import Box from '@mui/material/Box';
import SettingsIcon from '@mui/icons-material/Settings';

// Icon series with different states
<Box sx={{ display: 'flex', gap: 2 }}>
  <SettingsIcon color="action" />      {/* Default */}
  <SettingsIcon color="primary" />     {/* Active */}
  <SettingsIcon color="disabled" />    {/* Disabled */}
</Box>

// Color intensity variations using palette shades
import { blue } from '@mui/material/colors';

<Box sx={{ display: 'flex', gap: 1 }}>
  <SettingsIcon sx={{ color: blue[300] }} />   {/* Light */}
  <SettingsIcon sx={{ color: blue[500] }} />   {/* Medium */}
  <SettingsIcon sx={{ color: blue[900] }} />   {/* Dark */}
</Box>
```

---

## Size Patterns

### Fixed Size Variants

```jsx
import DownloadIcon from '@mui/icons-material/Download';

// Small (18px) - inline with body text
<p>
  <DownloadIcon fontSize="small" /> Download file
</p>

// Medium (24px) - default, standard use
<DownloadIcon fontSize="medium" />

// Large (32px) - prominent display
<DownloadIcon fontSize="large" />

// Custom exact size
<DownloadIcon sx={{ fontSize: '48px' }} />
```

### Responsive Sizing

Adjusting icon size based on screen size:

```jsx
import DownloadIcon from '@mui/icons-material/Download';

// Responsive font sizes using array syntax
<DownloadIcon sx={{
  fontSize: { xs: 18, sm: 24, md: 32, lg: 40 }
}} />

// Responsive font sizes using object syntax
<DownloadIcon sx={{
  fontSize: {
    xs: '18px',
    sm: '24px',
    md: '32px',
    lg: '40px',
    xl: '48px'
  }
}} />
```

**Breakpoints**:
- **xs**: < 600px (mobile)
- **sm**: 600px - 900px (tablet)
- **md**: 900px - 1200px (laptop)
- **lg**: 1200px - 1536px (desktop)
- **xl**: > 1536px (large desktop)

### Icon in Different Contexts

Size selection by use case:

```jsx
import SearchIcon from '@mui/icons-material/Search';

// Inline with text (small)
<Typography>
  <SearchIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
  Search items
</Typography>

// Navigation menu (medium)
<ListItemIcon>
  <SearchIcon />
</ListItemIcon>

// Heading/hero (large)
<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
  <SearchIcon sx={{ fontSize: 64 }} />
</Box>

// Toolbar (medium to large)
<Toolbar>
  <IconButton>
    <SearchIcon />
  </IconButton>
</Toolbar>
```

---

## Color/Theming

### Theme Integration

Icons automatically respect MUI theme colors:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',  // Icons with color="primary" use this
    },
    secondary: {
      main: '#dc004e',  // Icons with color="secondary" use this
    },
  },
});

<ThemeProvider theme={theme}>
  <SettingsIcon color="primary" />      {/* Uses theme.palette.primary.main */}
  <SettingsIcon color="secondary" />    {/* Uses theme.palette.secondary.main */}
</ThemeProvider>
```

### Custom Theme Colors

Using theme color palette shades:

```jsx
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';

function ThemedIcon() {
  const theme = useTheme();

  return (
    <EditIcon sx={{
      color: theme.palette.primary.main,
      fontSize: 24,
      '&:hover': {
        color: theme.palette.primary.dark
      }
    }} />
  );
}
```

### Mode-Aware Colors (Light/Dark)

Responding to theme mode:

```jsx
import { useTheme } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

function ModeAwareIcon() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <IconButton onClick={handleToggle}>
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
```

### Palette Color Variants

Using MUI color palette for fine-grained control:

```jsx
import {
  red, pink, purple, deepPurple,
  indigo, blue, lightBlue, cyan,
  teal, green, lightGreen, lime,
  yellow, amber, orange, deepOrange,
  brown, grey, blueGrey
} from '@mui/material/colors';
import SendIcon from '@mui/icons-material/Send';

// Primary shades
<SendIcon sx={{ color: blue[100] }} />   {/* Light blue */}
<SendIcon sx={{ color: blue[500] }} />   {/* Medium blue */}
<SendIcon sx={{ color: blue[900] }} />   {/* Dark blue */}

// Success/Warning/Error
<SendIcon sx={{ color: green[500] }} />  {/* Success green */}
<SendIcon sx={{ color: amber[500] }} />  {/* Warning amber */}
<SendIcon sx={{ color: red[500] }} />    {/* Error red */}
```

---

## Icon Libraries

### Material Design Icons (@mui/icons-material)

Official icon library with 1000+ icons:

```bash
npm install @mui/icons-material
```

**Available Icons** (categorized):

1. **Navigation Icons**
   - ArrowBack, ArrowForward, ArrowUpward, ArrowDownward
   - Menu, MoreVert, Close, Expand

2. **Action Icons**
   - Add, Edit, Delete, Save, Cancel, Check
   - Settings, Help, Info, Warning, Error

3. **File/Content Icons**
   - Note, Draft, Folder, Download, Upload
   - Copy, Paste, Attachment, Description

4. **Communication Icons**
   - Message, Email, Phone, Chat, Send
   - Notifications, Comment, Forum

5. **Social Icons**
   - Person, Group, Favorite, Share, Public
   - LocationOn, PersonAdd

6. **Media Icons**
   - PlayArrow, Pause, Stop, SkipNext, Volume
   - Image, Movie, Music

7. **Toggle Icons**
   - Star, Bookmark, Visibility, Lock, Radio

**Installation**:
```jsx
// Install once
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Use throughout application
<IconButton><AddIcon /></IconButton>
<IconButton><EditIcon /></IconButton>
<IconButton><DeleteIcon /></IconButton>
```

### Custom SVG Icons with SvgIcon

Wrapping custom SVG icons:

```jsx
import SvgIcon from '@mui/material/SvgIcon';

// Using SvgIcon directly
<SvgIcon>
  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
</SvgIcon>

// Custom component
function CustomIcon() {
  return (
    <SvgIcon>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

// With styling
<SvgIcon sx={{ color: 'primary.main', fontSize: 32 }}>
  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
</SvgIcon>
```

### Font Awesome Integration (Level 3)

Using Font Awesome icons with MUI:

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import SvgIcon from '@mui/material/SvgIcon';

// Approach 1: Wrap Font Awesome Icon
function FontAwesomeIconWrapper() {
  return (
    <SvgIcon>
      <FontAwesomeIcon icon={faHome} />
    </SvgIcon>
  );
}

// Approach 2: Use Font Awesome directly (less ideal)
<FontAwesomeIcon icon={faHome} style={{ fontSize: 24 }} />
```

**Note**: MUI icons are recommended as primary choice for consistency with Material Design.

---

## Custom Icons

### Creating Custom SVG Icons

Method 1: Using SvgIcon wrapper:

```jsx
import SvgIcon from '@mui/material/SvgIcon';

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

// Use like any MUI icon
<HomeIcon color="primary" fontSize="large" />
```

Method 2: Using createSvgIcon utility:

```jsx
import { createSvgIcon } from '@mui/material/utils';

const HomeIcon = createSvgIcon(
  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />,
  'Home'
);

// Use as component
<HomeIcon color="primary" fontSize="large" />
```

### Custom Icon from Image

Rendering image-based icons:

```jsx
import SvgIcon from '@mui/material/SvgIcon';

function ImageIcon() {
  return (
    <SvgIcon sx={{ fontSize: 40 }}>
      <image
        href="/path/to/icon.svg"
        height="24"
        width="24"
      />
    </SvgIcon>
  );
}
```

### Styled Custom Icons

Creating reusable styled custom icons:

```jsx
import { createSvgIcon } from '@mui/material/utils';
import { styled } from '@mui/material/styles';

const BaseIcon = createSvgIcon(
  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />,
  'Home'
);

const StyledHomeIcon = styled(BaseIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 32,
  '&:hover': {
    color: theme.palette.primary.dark,
    transform: 'scale(1.1)',
    transition: 'all 200ms ease-in-out'
  }
}));

// Use styled icon
<StyledHomeIcon />
```

---

## Accessibility

### Alt Text / Aria Labels

When icons are standalone (not with text):

```jsx
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// ❌ Bad - no label, unclear to screen readers
<IconButton>
  <DeleteIcon />
</IconButton>

// ✅ Good - descriptive aria-label
<IconButton aria-label="delete item">
  <DeleteIcon />
</IconButton>

// ✅ Also good - title attribute for tooltips
<IconButton title="Delete this item">
  <DeleteIcon />
</IconButton>
```

### Icons with Text

When icon has accompanying text, aria-label may not be needed:

```jsx
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';

<MenuItem>
  <ListItemIcon>
    <DeleteIcon fontSize="small" />
  </ListItemIcon>
  <ListItemText>Delete</ListItemText>
</MenuItem>
```

**Pattern**: Text content makes icon purpose clear to screen readers.

### ARIA Properties

```jsx
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';

// For saving state
<IconButton aria-label="save changes">
  <SaveIcon />
</IconButton>

// For loading state
<IconButton
  disabled
  aria-busy="true"
  aria-label="saving changes"
>
  <CircularProgress size={24} />
</IconButton>

// For disabled state
<IconButton
  disabled
  aria-label="delete (disabled)"
>
  <DeleteIcon />
</IconButton>
```

### Semantic HTML

Using proper HTML semantics with icons:

```jsx
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import Link from '@mui/material/Link';

// Navigation link with icon
<Link href="/">
  <HomeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
  Home
</Link>

// List item with icon
<ListItem>
  <ListItemIcon>
    <HomeIcon />
  </ListItemIcon>
  <ListItemText primary="Home" />
</ListItem>
```

---

## Interactive Patterns

### Toggle Icon Button (Level 2)

Button that switches between states:

```jsx
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function ToggleButton() {
  const [selected, setSelected] = useState(false);

  return (
    <IconButton
      onClick={() => setSelected(!selected)}
      aria-label="add to favorites"
      color={selected ? 'error' : 'default'}
    >
      {selected ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  );
}
```

### Icon with Tooltip (Level 2)

Providing context for icon-only buttons:

```jsx
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

<Tooltip title="Edit item" arrow>
  <IconButton
    aria-label="edit"
    onClick={handleEdit}
  >
    <EditIcon />
  </IconButton>
</Tooltip>
```

### Icon Menu Trigger (Level 2)

Using icon button to open menus:

```jsx
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function IconMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        aria-label="more options"
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
        <MenuItem onClick={handleClose}>Share</MenuItem>
      </Menu>
    </>
  );
}
```

### Icon with Ripple Effect (Level 2)

Default IconButton behavior includes ripple on click:

```jsx
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

// Ripple enabled by default
<IconButton>
  <SendIcon />
</IconButton>

// Disable ripple if needed
<IconButton disableRipple>
  <SendIcon />
</IconButton>

// Custom ripple color
<IconButton sx={{
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.1)'
  }
}}>
  <SendIcon />
</IconButton>
```

---

## Advanced Patterns

### Pattern 1: Animated Icons (Level 3)

Adding animations to icons:

```jsx
import { keyframes } from '@emotion/react';
import EditIcon from '@mui/icons-material/Edit';

// CSS keyframe animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

<EditIcon sx={{
  animation: `${spin} 2s linear infinite`
}} />

// Hover animation
<EditIcon sx={{
  transition: 'transform 200ms ease-in-out',
  '&:hover': {
    transform: 'rotate(20deg) scale(1.1)'
  }
}} />

// Pulsing animation
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

<EditIcon sx={{
  animation: `${pulse} 2s ease-in-out infinite`
}} />
```

### Pattern 2: Icon with Tooltip and Keyboard Shortcut (Level 3)

Enhanced interactive icon:

```jsx
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import { useEffect } from 'react';

function SaveButton() {
  const handleSave = () => {
    // Save logic
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <Tooltip title="Save (Ctrl+S)" arrow>
      <IconButton
        aria-label="save"
        onClick={handleSave}
      >
        <SaveIcon />
      </IconButton>
    </Tooltip>
  );
}
```

### Pattern 3: Icon with Progress Indicator (Level 3)

Showing progress with icon:

```jsx
import { useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';

function DownloadWithProgress() {
  const [progress, setProgress] = useState(0);

  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={40}
        sx={{
          color: 'rgba(0, 0, 0, 0.1)',
          position: 'absolute'
        }}
      />
      <Box sx={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }}>
        <DownloadIcon sx={{ fontSize: 24 }} />
      </Box>
    </Box>
  );
}
```

### Pattern 4: Icon Grid/Gallery (Level 3)

Displaying multiple icons in grid:

```jsx
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import {
  Home,
  Settings,
  Favorite,
  Search,
  Notifications,
  Person,
  Share,
  MoreVert
} from '@mui/icons-material';

const icons = [
  { icon: Home, label: 'Home' },
  { icon: Settings, label: 'Settings' },
  { icon: Favorite, label: 'Favorite' },
  { icon: Search, label: 'Search' },
  { icon: Notifications, label: 'Notifications' },
  { icon: Person, label: 'Profile' },
  { icon: Share, label: 'Share' },
  { icon: MoreVert, label: 'More' },
];

<Grid container spacing={2}>
  {icons.map((item) => (
    <Grid item xs={6} sm={4} md={3} key={item.label}>
      <IconButton
        fullWidth
        aria-label={item.label}
        sx={{ flexDirection: 'column', gap: 1 }}
      >
        <item.icon fontSize="large" />
      </IconButton>
    </Grid>
  ))}
</Grid>
```

### Pattern 5: Icon with Loading State (Level 3)

Showing loading while action completes:

```jsx
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import UploadIcon from '@mui/icons-material/Upload';

function UploadButton() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    try {
      await uploadFile();
    } finally {
      setUploading(false);
    }
  };

  return (
    <IconButton
      onClick={handleUpload}
      disabled={uploading}
      aria-busy={uploading}
      aria-label={uploading ? 'uploading' : 'upload file'}
    >
      {uploading ? (
        <CircularProgress size={24} />
      ) : (
        <UploadIcon />
      )}
    </IconButton>
  );
}
```

---

## Notes

### Key Insights

1. **Icon vs SvgIcon**:
   - `Icon`: For Material Design icons (via font ligatures or @mui/icons-material)
   - `SvgIcon`: For custom SVG icons

2. **Best Practice - Use @mui/icons-material**:
   - Provides 1000+ pre-made Material Design icons
   - Better tree-shaking and optimization
   - TypeScript support
   - Consistent sizing and theming

3. **Typography Integration**:
   - Icons inherit `currentColor` by default
   - Pair with text elements for clarity
   - Always provide `aria-label` for icon-only buttons

4. **Color Pattern**:
   - Use semantic colors: `primary`, `secondary`, `error`, `warning`, `info`, `success`
   - Use `action` for default interactive elements
   - Use `disabled` for inactive state

5. **Sizing Pattern**:
   - **small** (18px): inline with body text
   - **medium** (24px): standard, default size
   - **large** (32px): prominent, hero sections
   - Custom: use `sx={{ fontSize: value }}`

6. **Responsive Design**:
   - Use responsive `sx` prop for breakpoint-based sizing
   - Pair icons with text on small screens
   - Icon-only on larger screens with tooltips

7. **Accessibility Critical**:
   - **Always** include `aria-label` on icon buttons
   - Provide context via text or tooltip
   - Use semantic HTML structures
   - Test with screen readers

8. **Performance**:
   - Import only needed icons from @mui/icons-material
   - Avoid dynamic icon selection that prevents tree-shaking
   - Lazy-load icons for large icon collections

9. **Material Design Variants**:
   - Filled (solid, default)
   - Outlined (border-based)
   - Rounded (soft corners)
   - Sharp (geometric)
   - Two-tone (dual color)

   Use variants to create visual hierarchy and distinct states.

10. **Theme Integration**:
    - Icons automatically respect theme colors
    - Use `useTheme()` hook for custom theme-aware logic
    - Theme mode affects colors (light/dark)

### Common Mistakes to Avoid

1. **No aria-label on icon buttons** - Screen readers can't determine purpose
2. **Icon sizing inconsistencies** - Use variants (small/medium/large) for consistency
3. **Poor color contrast** - Especially in light/dark theme modes
4. **Icon without context** - Ensure text or tooltip accompanies icon
5. **Overcustomizing** - Respect Material Design patterns for consistency
6. **Not using theme colors** - Hardcoding colors breaks theme switching
7. **Forgetting disabled state** - Use `disabled` prop on IconButton
8. **Icon-only interfaces** - Always provide keyboard/touch alternatives

### Browser Support

- **Icon component**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **SVG support**: 100% in modern browsers
- **CSS animations**: Supported in all modern browsers
- **Theme system**: Requires CSS-in-JS support (@emotion/react)

### Related MUI Components

- **IconButton**: Interactive wrapper for icons
- **SvgIcon**: Custom SVG icon wrapper
- **Badge**: Add badges/counts to icons
- **Tooltip**: Provide context for icon-only buttons
- **Button**: Use with startIcon/endIcon props
- **ListItemIcon**: Icon in list items
- **Avatar**: Profile pictures (different from icons)

---

## Recommendations for Semantic UI

### Comparison with MUI

**MUI Strengths**:
- Comprehensive Material Design icon system (1000+ icons)
- Built-in @mui/icons-material package
- Theme integration with palette system
- Multiple icon variants (filled, outlined, rounded, sharp, two-tone)
- SvgIcon wrapper for custom SVGs
- Tight integration with other MUI components

**MUI Weaknesses**:
- Requires Material Design aesthetic
- Font ligature approach adds complexity
- Limited customization without sx prop

### Implementation Opportunities

1. **Icon Component**:
   - Lightweight wrapper for SVG icons
   - Theme-aware sizing and coloring
   - Accessibility support (aria-label patterns)

2. **Icon Library**:
   - Consider creating Semantic UI icon set
   - Or leverage existing Material Design icons
   - Support multiple icon sources

3. **Visual Variants**:
   - Implement filled/outlined/rounded variants
   - Provide clear API for variant selection
   - Consistent with Material Design patterns

4. **Interactive Patterns**:
   - Toggle icons (selected/unselected states)
   - Loading indicators
   - Badge integration
   - Tooltip support

5. **Responsive Design**:
   - Built-in responsive sizing
   - Icon size based on breakpoints
   - Automatic text fallback on small screens

6. **Animation Support**:
   - Rotation, pulse, spin animations
   - Smooth transitions
   - Hover effects
   - Custom animation patterns

---

## Additional Resources

### Official Documentation
- Icon Component: https://mui.com/material-ui/icons/
- Icon API: https://mui.com/material-ui/api/icon/
- SvgIcon API: https://mui.com/material-ui/api/svg-icon/
- Material Design Icons: https://mui.com/material-ui/material-icons/
- IconButton API: https://mui.com/material-ui/api/icon-button/

### Icon Libraries
- Material Design Icons: https://fonts.google.com/icons
- Font Awesome: https://fontawesome.com/
- React Icons: https://react-icons.github.io/react-icons/

### Related Patterns
- Button with Icons: https://mui.com/material-ui/react-button/
- IconButton Component: https://mui.com/material-ui/api/icon-button/
- Badge Component: https://mui.com/material-ui/react-badge/
- Tooltip Component: https://mui.com/material-ui/react-tooltip/

