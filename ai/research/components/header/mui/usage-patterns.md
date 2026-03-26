# MUI (Material-UI) - AppBar Usage Patterns

## Component URL
https://mui.com/material-ui/react-app-bar/
Status: ✅ Working
API Reference: https://mui.com/material-ui/api/app-bar/
Toolbar API: https://mui.com/material-ui/api/toolbar/
Version: Current (v5/v6)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - MUI provides excellent documentation with interactive examples, complete API reference, code samples, theming guides, and Material Design specification alignment. The component follows Material Design guidelines and has extensive community resources.

---

## 1. Component Overview

The MUI AppBar is Material Design's implementation of a prominent header/navigation bar positioned at the top of the application. AppBar serves as the primary visual container for branding, navigation, and user actions (typically integrated with a Toolbar component for content layout).

AppBar is a fixed-positioning container that uses Material Design's elevation system and shadow depths to establish visual hierarchy. It provides built-in support for responsive behavior, color theming, and positioning flexibility. The component is typically paired with the Toolbar component to organize and align content within the bar.

**Key Distinction**: In Material Design terminology, AppBar (also called "Top App Bar") is the canonical header component. Other frameworks may call similar components "Header", "Navigation Bar", or "Top Bar", but AppBar is Material Design's standard term.

---

## 2. Basic Usage

### Import
```jsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Alternative import
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
```

### Simple AppBar (Basic Pattern)
The most common pattern uses AppBar with Toolbar for content layout:

```jsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function BasicAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
}
```

**Key Pattern Notes**:
- `position="static"` keeps AppBar in normal document flow
- `Toolbar` is the recommended layout container inside AppBar
- `flexGrow: 1` pushes buttons to the right
- `color="inherit"` makes text inherit AppBar's text color
- AppBar's background color defaults to primary theme color

### AppBar with Fixed Position
```jsx
function FixedAppBar() {
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Toolbar />  {/* This spacer prevents content from hiding under fixed AppBar */}
      <main>
        {/* Page content here */}
      </main>
    </>
  );
}
```

### AppBar with Icons and Menu
```jsx
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

function AppBarWithMenu() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
}
```

---

## 3. Props/API

### Core AppBar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'absolute' \| 'fixed' \| 'relative' \| 'static' \| 'sticky'` | `'fixed'` | The positioning type. 'static' = normal flow, 'fixed' = viewport fixed, 'sticky' = sticky scroll behavior. |
| `color` | `'inherit' \| 'primary' \| 'secondary' \| 'default' \| string` | `'primary'` | The color of the AppBar. Can use theme colors or custom color values. |
| `elevation` | `number` | `4` | Shadow depth. Range: 0-24. Controls Material Design elevation/shadow. |
| `children` | `node` | - | AppBar contents, typically a Toolbar component. |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for defining custom styles with theme access. |
| `enableColorOnDark` | `boolean` | `false` | If `true`, the color is applied even in dark mode. |
| `variant` | `'permanent' \| 'persistent' \| 'temporary'` | - | Navigation drawer variant coordination (if using drawer). |
| `classes` | `object` | - | Override or extend styles applied to the component. |

### Toolbar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `node` | - | Toolbar contents (buttons, text, icons, etc.). |
| `disableGutters` | `boolean` | `false` | If `true`, removes horizontal padding (gutters). |
| `variant` | `'regular' \| 'dense'` | `'regular'` | Height variant. 'dense' = 48px, 'regular' = 64px. |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for custom styles. |

**Inherited Props**: Both components inherit from Box, supporting common layout props like `display`, `justifyContent`, `alignItems`, `gap`, etc.

---

## 4. Positioning Patterns

### Position Options

**Static** (Default for standalone AppBar):
```jsx
<AppBar position="static">
  {/* Normal document flow */}
</AppBar>
```
- AppBar stays in normal document flow
- Does not overlay content
- Content below automatically shifts down
- Best for: Simple layouts without scrolling content

**Fixed** (Most common for persistent headers):
```jsx
<AppBar position="fixed">
  <Toolbar>{/* content */}</Toolbar>
</AppBar>
<Toolbar />  {/* Spacer to prevent content overlap */}
```
- AppBar stays fixed to viewport top
- Overlays all page content
- Must add `<Toolbar />` spacer to prevent content hiding
- Best for: Persistent navigation across page scrolls

**Sticky** (Modern positioning):
```jsx
<AppBar position="sticky">
  <Toolbar>{/* content */}</Toolbar>
</AppBar>
```
- AppBar scrolls with page initially
- Becomes fixed when reaching viewport top
- No spacer needed
- Best for: Sections where AppBar should stick only when needed

**Relative** (Custom layout):
```jsx
<AppBar position="relative">
  {/* Positioned relative to nearest positioned parent */}
</AppBar>
```

**Absolute** (Overlay positioning):
```jsx
<AppBar position="absolute">
  {/* Positioned absolutely within parent context */}
</AppBar>
```

### Responsive Positioning

```jsx
<AppBar
  position={{ xs: 'fixed', md: 'static' }}
>
  {/* Fixed on mobile, static on desktop */}
</AppBar>
```

---

## 5. Color Schemes & Theming

### Theme-Based Colors

**Primary (Default)**:
```jsx
<AppBar color="primary">
  <Toolbar>Primary AppBar</Toolbar>
</AppBar>
```

**Secondary**:
```jsx
<AppBar color="secondary">
  <Toolbar>Secondary AppBar</Toolbar>
</AppBar>
```

**Default**:
```jsx
<AppBar color="default">
  <Toolbar>Default AppBar</Toolbar>
</AppBar>
```

**Inherit** (Inherits from parent):
```jsx
<AppBar color="inherit">
  <Toolbar>Inherited Color</Toolbar>
</AppBar>
```

### Custom Colors

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar color="primary">
        <Toolbar>Themed AppBar</Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
```

### Dark Mode AppBar

```jsx
<AppBar
  position="fixed"
  sx={{
    backgroundColor: 'background.paper',
    color: 'text.primary',
  }}
>
  <Toolbar>Dark Mode AppBar</Toolbar>
</AppBar>
```

**Or use enable color in dark mode**:
```jsx
<AppBar
  color="primary"
  enableColorOnDark
  position="fixed"
>
  <Toolbar>Always Colored</Toolbar>
</AppBar>
```

### Gradient and Custom Backgrounds

```jsx
<AppBar
  sx={{
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  }}
>
  <Toolbar>Gradient AppBar</Toolbar>
</AppBar>
```

### Transparent AppBar

```jsx
<AppBar
  position="fixed"
  sx={{
    background: 'transparent',
    boxShadow: 'none',
  }}
>
  <Toolbar>Transparent AppBar</Toolbar>
</AppBar>
```

---

## 6. Elevation & Shadow

### Shadow Depth Control

```jsx
// No shadow
<AppBar elevation={0}>
  <Toolbar>No Shadow</Toolbar>
</AppBar>

// Subtle shadow
<AppBar elevation={2}>
  <Toolbar>Subtle Shadow</Toolbar>
</AppBar>

// Default shadow
<AppBar elevation={4}>
  <Toolbar>Default (4)</Toolbar>
</AppBar>

// Heavy shadow
<AppBar elevation={12}>
  <Toolbar>Heavy Shadow</Toolbar>
</AppBar>
```

### Material Design Elevation Scale

- **0**: No shadow (flat)
- **2**: Subtle elevation
- **4**: Default AppBar elevation
- **6**: Raised
- **8**: Floating
- **12-24**: Progressive increases for emphasis

### Conditional Elevation on Scroll

```jsx
function ScrollAwareAppBar() {
  const [elevation, setElevation] = React.useState(4);

  const handleScroll = () => {
    setElevation(window.scrollY > 50 ? 8 : 4);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar position="fixed" elevation={elevation}>
      <Toolbar>Scroll-Aware Shadow</Toolbar>
    </AppBar>
  );
}
```

---

## 7. Toolbar Integration

### Basic Toolbar Layout

```jsx
<AppBar position="static">
  <Toolbar>
    {/* Icon on left */}
    <IconButton edge="start">
      <MenuIcon />
    </IconButton>

    {/* Title in center-left */}
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      App Title
    </Typography>

    {/* Actions on right */}
    <Button color="inherit">Login</Button>
    <IconButton color="inherit">
      <AccountCircle />
    </IconButton>
  </Toolbar>
</AppBar>
```

**Toolbar Spacing Formula**:
- `flexGrow: 1` pushes subsequent items to the right
- `mr: 2` adds right margin for spacing
- `edge="start"` optimizes IconButton positioning

### Dense Toolbar (Compact)

```jsx
<AppBar position="fixed">
  <Toolbar variant="dense">
    {/* Reduced height toolbar */}
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      Compact App
    </Typography>
    <Button color="inherit">Login</Button>
  </Toolbar>
</AppBar>
```

**Height Comparison**:
- Regular Toolbar: 64px
- Dense Toolbar: 48px

### Multi-Row Toolbar

```jsx
<AppBar position="static">
  <Toolbar>
    <IconButton edge="start" color="inherit">
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      My App
    </Typography>
  </Toolbar>
  <Toolbar variant="dense">
    <Button color="inherit" size="small">Tab 1</Button>
    <Button color="inherit" size="small">Tab 2</Button>
    <Button color="inherit" size="small">Tab 3</Button>
  </Toolbar>
</AppBar>
```

### Search Bar in Toolbar

```jsx
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

function AppBarWithSearch() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          App
        </Typography>
        <SearchBar>
          <InputBase
            placeholder="Search..."
            sx={{ color: 'inherit', width: '100%' }}
          />
        </SearchBar>
      </Toolbar>
    </AppBar>
  );
}
```

---

## 8. Responsive Behavior

### Mobile-First Layout

```jsx
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/useTheme';

function ResponsiveAppBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit">
          {isMobile ? <MenuIcon /> : null}
        </IconButton>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          sx={{ flexGrow: 1 }}
        >
          {isMobile ? 'App' : 'My Application'}
        </Typography>
        {!isMobile && (
          <Button color="inherit">Docs</Button>
        )}
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
}
```

### SX Prop Responsive Styling

```jsx
<AppBar
  position="fixed"
  sx={{
    width: { xs: '100%', md: 'calc(100% - 240px)' },
    marginLeft: { md: '240px' },
    backgroundColor: {
      xs: 'primary.main',
      md: 'primary.light',
    },
  }}
>
  <Toolbar sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
    <Typography sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
      Responsive Title
    </Typography>
  </Toolbar>
</AppBar>
```

### Drawer Integration (Responsive Navigation)

```jsx
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const DRAWER_WIDTH = 240;

function ResponsiveLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawer = (
    <List>
      <ListItem>Item 1</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
    </List>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{ width: DRAWER_WIDTH }}
      >
        {drawer}
      </Drawer>
      <Box sx={{ ml: { md: `${DRAWER_WIDTH}px` } }}>
        {/* Main content */}
      </Box>
    </>
  );
}
```

---

## 9. Composition Patterns

### Component Hierarchy

```
AppBar (header container)
└── Toolbar (layout container)
    ├── IconButton (menu icon)
    ├── Typography (logo/title)
    ├── TextField (search)
    └── Button (actions)
        or
    └── Menu (dropdown)
```

### Complete Composition Example

```jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  InputBase,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle as AccountIcon,
  NotificationsActive as NotificationsIcon,
} from '@mui/icons-material';

function CompleteAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <AppBar position="fixed" elevation={4}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            MyApp
          </Typography>
        </Box>

        {/* Center section - Search */}
        <InputBase
          placeholder="Search…"
          startAdornment={<SearchIcon sx={{ mr: 1, color: 'inherit' }} />}
          sx={{
            color: 'inherit',
            flex: 1,
            mx: 4,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 1,
            px: 2,
            py: 0.5,
          }}
        />

        {/* Right section - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" aria-label="notifications">
            <NotificationsIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <AccountIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
```

---

## 10. Styling & Theming

### Using SX Prop

```jsx
<AppBar
  sx={{
    backgroundColor: 'primary.main',
    color: 'common.white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderBottom: '1px solid',
    borderColor: 'divider',
  }}
>
  <Toolbar>Styled AppBar</Toolbar>
</AppBar>
```

### Styled Components API

```jsx
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.shadows[4],
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&.scroll': {
    boxShadow: theme.shadows[8],
  },
}));

function App() {
  return (
    <StyledAppBar position="fixed">
      <Toolbar>Styled with styled()</Toolbar>
    </StyledAppBar>
  );
}
```

### Theme-Level Customization

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
          color: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #ddd',
        },
        colorPrimary: {
          backgroundColor: '#1976d2',
        },
      },
      defaultProps: {
        elevation: 4,
        position: 'fixed',
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
        },
        dense: {
          height: 48,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar>Themed AppBar</Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
```

### CSS Classes for Customization

**AppBar CSS classes**:
- `.MuiAppBar-root` - Root element
- `.MuiAppBar-colorPrimary` - Applied when color="primary"
- `.MuiAppBar-colorSecondary` - Applied when color="secondary"
- `.MuiAppBar-colorDefault` - Applied when color="default"
- `.MuiAppBar-positionFixed` - Applied when position="fixed"
- `.MuiAppBar-positionSticky` - Applied when position="sticky"

**Toolbar CSS classes**:
- `.MuiToolbar-root` - Root element
- `.MuiToolbar-dense` - Applied when variant="dense"
- `.MuiToolbar-gutters` - Applied by default (has padding)

---

## 11. Accessibility

### ARIA Attributes

```jsx
<AppBar
  role="banner"
  aria-label="Application header"
>
  <Toolbar>
    <IconButton
      aria-label="open menu"
      edge="start"
      color="inherit"
    >
      <MenuIcon />
    </IconButton>
    <Typography
      variant="h6"
      role="heading"
      aria-level="1"
    >
      App Title
    </Typography>
  </Toolbar>
</AppBar>
```

### Keyboard Navigation

AppBar itself is not keyboard-interactive, but its contained components support:
- **Tab**: Navigate between buttons and interactive elements
- **Enter/Space**: Activate buttons
- **Arrow Keys**: Navigate in menus/dropdowns

### Focus Management

```jsx
function AccessibleAppBar() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          tabIndex={0}  // Ensure focusable
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Button color="inherit" sx={{ '&:focus': { outline: '2px solid' } }}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}
```

### Screen Reader Announcements

```jsx
<AppBar>
  <Toolbar>
    <Typography
      variant="h6"
      component="h1"  // Semantic HTML
      id="app-title"
    >
      Application Title
    </Typography>
    <nav aria-label="Main navigation">
      <Button>Home</Button>
      <Button>About</Button>
      <Button>Contact</Button>
    </nav>
  </Toolbar>
</AppBar>
```

### Color Contrast Accessibility

Material Design AppBar uses theme-aware contrast text that meets WCAG AA standards by default:
- Primary color with white text
- Secondary color with appropriate contrast text
- Disabled states with reduced opacity

---

## 12. Material Design Patterns

### Elevation System

Material Design uses elevation (shadow depth) to establish hierarchy:

```jsx
// Flat (no elevation)
<AppBar elevation={0}>

// Raised (subtle)
<AppBar elevation={2}>

// Floating (default)
<AppBar elevation={4}>

// Featured (emphasized)
<AppBar elevation={8}>
```

### Top App Bar Variants (Material Design 3)

**Small**:
```jsx
<AppBar position="static">
  <Toolbar sx={{ minHeight: 56 }} variant="dense">
    {/* Compact header */}
  </Toolbar>
</AppBar>
```

**Medium**:
```jsx
<AppBar position="static">
  <Toolbar sx={{ minHeight: 88 }}>
    {/* Default header with additional space */}
  </Toolbar>
</AppBar>
```

**Large**:
```jsx
<AppBar position="static">
  <Toolbar sx={{ minHeight: 152 }}>
    {/* Prominent header with large title */}
  </Toolbar>
</AppBar>
```

### Material Design Color System

AppBar respects Material Design's semantic color system:

```jsx
// Primary (most common)
<AppBar color="primary">

// Secondary (alternative)
<AppBar color="secondary">

// Error (urgent actions)
<AppBar color="error" sx={{ backgroundColor: 'error.main' }}>

// Success (confirmation states)
<AppBar color="success" sx={{ backgroundColor: 'success.main' }}>

// Warning (cautionary states)
<AppBar color="warning" sx={{ backgroundColor: 'warning.main' }}>

// Info (informational states)
<AppBar color="info" sx={{ backgroundColor: 'info.main' }}>
```

### Material Design Typography in AppBar

```jsx
<AppBar position="static">
  <Toolbar>
    {/* Headline - Large title */}
    <Typography
      variant="h5"  // Material Design Headline
      sx={{ flexGrow: 1 }}
    >
      Application Title
    </Typography>

    {/* Label - Action buttons */}
    <Button variant="text">
      Action
    </Button>
  </Toolbar>
</AppBar>
```

---

## 13. Advanced Patterns

### Scroll-Aware AppBar (Hide/Show on Scroll)

```jsx
import useScrollTrigger from '@mui/material/useScrollTrigger';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({ target: window });

  return (
    <Slide in={!trigger}>
      {children}
    </Slide>
  );
}

function ScrollAwareLayout() {
  return (
    <>
      <HideOnScroll>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6">My App</Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />  {/* Spacer */}
      <main>
        {/* Content scrolls here */}
      </main>
    </>
  );
}
```

### Transparent AppBar with Content Behind

```jsx
<Box sx={{ position: 'relative', height: 400 }}>
  {/* Background image */}
  <Box
    sx={{
      backgroundImage: 'url(/banner.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    }}
  />

  {/* AppBar on top */}
  <AppBar
    position="absolute"
    sx={{
      backgroundColor: 'transparent',
      boxShadow: 'none',
      zIndex: 1,
    }}
  >
    <Toolbar>
      <Typography
        variant="h6"
        sx={{ color: 'white', flexGrow: 1 }}
      >
        Featured App
      </Typography>
    </Toolbar>
  </AppBar>
</Box>
```

### AppBar with Persistent Drawer

```jsx
const DRAWER_WIDTH = 240;

function AppBarWithDrawer() {
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${open ? DRAWER_WIDTH : 0}px)`,
          marginLeft: open ? `${DRAWER_WIDTH}px` : 0,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            onClick={() => setOpen(!open)}
            color="inherit"
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            App
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
        open={open}
      >
        {/* Drawer content */}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Main content */}
      </Box>
    </Box>
  );
}
```

### Sticky AppBar with Tabs

```jsx
function AppBarWithTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <>
      <AppBar position="sticky" sx={{ top: 0 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
        </Toolbar>
        <Tabs
          value={value}
          onChange={(e, v) => setValue(v)}
          sx={{ backgroundColor: 'primary.dark' }}
        >
          <Tab label="Tab 1" />
          <Tab label="Tab 2" />
          <Tab label="Tab 3" />
        </Tabs>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {/* Tab content */}
      </Box>
    </>
  );
}
```

---

## 14. Best Practices

### Do's

1. **Use position="fixed" for persistent navigation** - Most applications benefit from fixed AppBar
2. **Add Toolbar spacer** - Prevents content overlap under fixed AppBar
3. **Use sx prop for responsive styling** - Adapts to different screen sizes
4. **Leverage theme colors** - Maintains design consistency
5. **Keep AppBar concise** - Only essential navigation and actions
6. **Use proper semantic HTML** - Typography variants for headings
7. **Implement skip-to-content link** - Accessibility improvement
8. **Test on mobile devices** - Ensure touch targets are adequate

### Don'ts

1. **Don't put too many actions in AppBar** - Overflow into menus instead
2. **Don't use AppBar for input forms** - Use dedicated form containers
3. **Don't remove elevation entirely** - Subtle shadow maintains hierarchy
4. **Don't ignore responsive behavior** - Test across all breakpoints
5. **Don't hardcode color values** - Use theme palette instead
6. **Don't nest AppBar inside other components** - Should be top-level
7. **Don't forget focus management** - Keyboard navigation must work

### Common Patterns

**Pattern 1: Simple Navigation**
```jsx
<AppBar position="fixed">
  <Toolbar>
    <Logo />
    <NavLinks />
    <LoginButton />
  </Toolbar>
</AppBar>
```

**Pattern 2: Search + Actions**
```jsx
<AppBar position="fixed">
  <Toolbar sx={{ justifyContent: 'space-between' }}>
    <Logo />
    <SearchBar />
    <ActionsMenu />
  </Toolbar>
</AppBar>
```

**Pattern 3: Drawer Integration**
```jsx
<AppBar position="fixed" sx={{ ml: { md: drawerWidth } }}>
  <Toolbar>
    <MenuToggle />
    <Logo />
    <Actions />
  </Toolbar>
</AppBar>
<Drawer>{/* Navigation */}</Drawer>
```

**Pattern 4: Multi-level Navigation**
```jsx
<AppBar position="sticky">
  <Toolbar>
    {/* Primary navigation */}
  </Toolbar>
  <Tabs>{/* Secondary navigation */}</Tabs>
</AppBar>
```

---

## 15. Performance Considerations

### Avoid Unnecessary Re-renders

```jsx
// Good: Separate component for AppBar
const Header = React.memo(() => (
  <AppBar position="fixed">
    <Toolbar>Static content</Toolbar>
  </AppBar>
));

// Avoid: AppBar inside component that frequently re-renders
function Page() {
  return (
    <>
      <AppBar>{/* Re-renders every time parent updates */}</AppBar>
      <Content />
    </>
  );
}
```

### Conditional Rendering

```jsx
// Good: Skip rendering when not needed
function ResponsiveAppBar() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      {isMobile && <CompactAppBar />}
      {!isMobile && <FullAppBar />}
    </>
  );
}
```

### useScrollTrigger Hook

Material Design provides `useScrollTrigger` hook for efficient scroll-dependent styling without constant DOM updates.

---

## 16. Common Issues & Solutions

### Content Hidden Behind Fixed AppBar

**Problem**: Content appears behind AppBar when position="fixed"
```jsx
// Solution: Add spacer Toolbar
<AppBar position="fixed">
  <Toolbar>Content</Toolbar>
</AppBar>
<Toolbar />  {/* This is the spacer */}
```

### AppBar Z-Index Issues

**Problem**: AppBar appears below other components
```jsx
// Solution: Check z-index values (AppBar default is 1100)
<AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  {/* Higher than drawer */}
</AppBar>
```

### Responsive Width with Drawer

**Problem**: AppBar doesn't resize when drawer opens
```jsx
// Solution: Use sx prop with breakpoints
<AppBar sx={{ width: { md: `calc(100% - ${drawerWidth}px)` } }}>
```

---

## 17. Comparison with Other Frameworks

### vs Bootstrap Navbar
- MUI: Fixed positioning with z-index management
- Bootstrap: Sticky positioning, simpler API
- MUI: Material Design elevation system
- Bootstrap: Simpler shadow implementation

### vs Chakra UI Header
- MUI: Elevation system, Material Design principles
- Chakra: More flexible spacing system
- MUI: Built-in Toolbar component
- Chakra: Uses Box/Flex for layout

### vs Ant Design Layout.Header
- MUI: AppBar/Toolbar separation of concerns
- Ant: Single Header component
- MUI: Material Design focus
- Ant: Ant Design system focus

---

## 18. Additional Resources

### Official Documentation
- Main docs: https://mui.com/material-ui/react-app-bar/
- AppBar API: https://mui.com/material-ui/api/app-bar/
- Toolbar API: https://mui.com/material-ui/api/toolbar/
- Theming guide: https://mui.com/material-ui/customization/theming/

### Material Design Specifications
- Top App Bar: https://m3.material.io/components/top-app-bar/overview
- Material Design 3: https://m3.material.io/

### Related Components
- Drawer: https://mui.com/material-ui/react-drawer/
- Tabs: https://mui.com/material-ui/react-tabs/
- Menu: https://mui.com/material-ui/react-menu/
- Button: https://mui.com/material-ui/react-button/
- Typography: https://mui.com/material-ui/react-typography/

---

## Summary

MUI AppBar is a comprehensive, Material Design-compliant header component that provides:

- **Flexible positioning** via position prop (static, fixed, sticky, relative, absolute)
- **Rich theming** with semantic color system and dark mode support
- **Material Design elevation** system for visual hierarchy
- **Responsive design** through sx prop and useMediaQuery hook
- **Toolbar integration** for organized content layout
- **Accessibility** with semantic HTML and keyboard navigation
- **Performance optimization** through React.memo and efficient scroll handling
- **Extensibility** through styled components and theme customization

The component is production-ready, well-documented, and suitable for virtually all application header use cases from simple navigation to complex multi-level layouts with drawers and tabs. Its alignment with Material Design principles makes it ideal for applications adopting Google's design language.

---

**Document created**: 2025-11-05
**Research scope**: MUI v5/v6 AppBar documentation
**Status**: Comprehensive research complete
