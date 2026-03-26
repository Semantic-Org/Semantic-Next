# MUI (Material-UI) - App Bar Component

## Component URL
https://mui.com/material-ui/react-app-bar/
Status: ✅ Working
API Reference: https://mui.com/material-ui/api/app-bar/
Toolbar API: https://mui.com/material-ui/api/toolbar/
Version: Current (v5+/v6)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - MUI provides excellent documentation with interactive demos, complete API reference, multiple examples covering positioning patterns, responsive behavior, and Material Design specifications. The component system is well-structured with clear Toolbar composition patterns and extensive customization options through the sx prop and theme system.

---

## 1. Component Overview

The MUI App Bar is Material Design's implementation of a top navigation bar - the primary header component for web applications. It provides a consistent container for branding, navigation, search, and user actions across an application.

App Bar is a composite component system consisting of:
- **AppBar** - The wrapper/container for the navigation bar with positioning and styling
- **Toolbar** - The content container that provides proper spacing and layout
- **Associated Components** - IconButton, Typography, Menu, Drawer, TextField for composing navigation

The component supports multiple positioning strategies (static, fixed, sticky, absolute, relative) and integrates seamlessly with MUI's theming system for Material Design-compliant navigation.

**Key Design Features**:
- Full Material Design compliance with elevation and color schemes
- Flexible positioning behavior (static, fixed, sticky)
- Built-in responsive patterns with Drawer integration
- Customizable styling with sx prop and theme integration
- Elevation system for depth and hierarchy
- Seamless integration with MUI navigation components

---

## 2. Basic Usage

### Import
```jsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';

// Alternative import
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button
} from '@mui/material';
```

### Basic App Bar (Static Position)
The simplest pattern - static position in document flow:

```jsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function BasicAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div">
          My Application
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
```

**Key Pattern Notes**:
- `position="static"` - App Bar in normal document flow (no fixed positioning)
- `Toolbar` - Essential child component providing proper padding and layout
- `Typography variant="h6"` - Standard text size for app bar titles
- Default primary theme color applied

### App Bar with Navigation (Fixed Position)
Common pattern with menu icon, title, and navigation buttons:

```jsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';

function NavigationAppBar() {
  return (
    <AppBar position="fixed">
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
          Brand Name
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
}
```

**Navigation Pattern Notes**:
- `position="fixed"` - App Bar stays at top while content scrolls
- `edge="start"` - Aligns icon to start edge with proper spacing
- `sx={{ flexGrow: 1 }}` - Makes title take available space, pushing buttons right
- `color="inherit"` - Inherits color from App Bar (typically white on primary)
- Requires content offset (margin or padding) to account for fixed header

---

## 3. Content Patterns

### Logo/Brand Positioning

**Left-aligned brand with text**:
```jsx
<Toolbar>
  <Typography variant="h6" component="div">
    Brand Name
  </Typography>
</Toolbar>
```

**Left-aligned logo image**:
```jsx
<Toolbar>
  <Box
    component="img"
    src="/logo.png"
    alt="Logo"
    sx={{ height: 40, mr: 2 }}
  />
  <Typography variant="h6" component="div">
    Brand Name
  </Typography>
</Toolbar>
```

**Clickable logo/brand**:
```jsx
<Toolbar>
  <IconButton
    edge="start"
    color="inherit"
    component={Link}
    to="/"
    sx={{ mr: 2 }}
  >
    <img src="/logo.svg" alt="Home" height="32" />
  </IconButton>
  <Typography variant="h6" component="div">
    Brand Name
  </Typography>
</Toolbar>
```

### Navigation Links

**Desktop navigation links**:
```jsx
<Toolbar>
  <Typography variant="h6" sx={{ mr: 4 }}>
    Brand
  </Typography>
  <Button color="inherit" component={Link} to="/home">
    Home
  </Button>
  <Button color="inherit" component={Link} to="/about">
    About
  </Button>
  <Button color="inherit" component={Link} to="/products">
    Products
  </Button>
  <Button color="inherit" component={Link} to="/contact">
    Contact
  </Button>
  <Box sx={{ flexGrow: 1 }} />
  <Button color="inherit">Login</Button>
</Toolbar>
```

**Active link indication**:
```jsx
function NavigationLinks() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Toolbar>
      <Button
        color="inherit"
        component={Link}
        to="/home"
        sx={{
          borderBottom: isActive('/home') ? 2 : 0,
          borderRadius: 0
        }}
      >
        Home
      </Button>
      <Button
        color="inherit"
        component={Link}
        to="/about"
        sx={{
          borderBottom: isActive('/about') ? 2 : 0,
          borderRadius: 0
        }}
      >
        About
      </Button>
    </Toolbar>
  );
}
```

### Actions/Buttons

**Right-aligned action buttons**:
```jsx
<Toolbar>
  <Typography variant="h6" sx={{ flexGrow: 1 }}>
    Brand
  </Typography>
  <IconButton color="inherit" aria-label="notifications">
    <Badge badgeContent={4} color="error">
      <NotificationsIcon />
    </Badge>
  </IconButton>
  <IconButton color="inherit" aria-label="messages">
    <MailIcon />
  </IconButton>
  <Button color="inherit">Login</Button>
</Toolbar>
```

**Icon buttons with tooltips**:
```jsx
<Toolbar>
  <Typography variant="h6" sx={{ flexGrow: 1 }}>
    Brand
  </Typography>
  <Tooltip title="Notifications">
    <IconButton color="inherit">
      <NotificationsIcon />
    </IconButton>
  </Tooltip>
  <Tooltip title="Settings">
    <IconButton color="inherit">
      <SettingsIcon />
    </IconButton>
  </Tooltip>
</Toolbar>
```

### Search Integration

**Search field in app bar**:
```jsx
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

const Search = styled('div')(({ theme }) => ({
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

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function SearchAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Brand
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
      </Toolbar>
    </AppBar>
  );
}
```

**Expandable search**:
```jsx
function ExpandableSearch() {
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Brand
      </Typography>
      {searchOpen ? (
        <TextField
          autoFocus
          variant="standard"
          placeholder="Search…"
          InputProps={{
            endAdornment: (
              <IconButton
                size="small"
                onClick={() => setSearchOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            ),
          }}
          sx={{ mr: 2 }}
        />
      ) : (
        <IconButton
          color="inherit"
          onClick={() => setSearchOpen(true)}
        >
          <SearchIcon />
        </IconButton>
      )}
    </Toolbar>
  );
}
```

### User Menu

**User profile menu**:
```jsx
function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Brand
      </Typography>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </Toolbar>
  );
}
```

**Avatar with menu**:
```jsx
<Toolbar>
  <Typography variant="h6" sx={{ flexGrow: 1 }}>
    Brand
  </Typography>
  <IconButton
    onClick={handleMenu}
    size="small"
    sx={{ ml: 2 }}
  >
    <Avatar sx={{ width: 32, height: 32 }}>
      {user.name[0]}
    </Avatar>
  </IconButton>
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleClose}
  >
    <MenuItem>
      <ListItemIcon>
        <PersonIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Profile</ListItemText>
    </MenuItem>
    <MenuItem>
      <ListItemIcon>
        <SettingsIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Settings</ListItemText>
    </MenuItem>
    <Divider />
    <MenuItem>
      <ListItemIcon>
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Logout</ListItemText>
    </MenuItem>
  </Menu>
</Toolbar>
```

---

## 4. Layout Patterns

### Fixed Position

**Standard fixed app bar**:
```jsx
function FixedAppBar() {
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">
            Fixed App Bar
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Add spacing to account for fixed app bar */}
      <Toolbar /> {/* Empty Toolbar as spacer */}
      <Box sx={{ p: 3 }}>
        {/* Page content */}
      </Box>
    </>
  );
}
```

**Fixed with custom offset**:
```jsx
<AppBar position="fixed">
  <Toolbar>Content</Toolbar>
</AppBar>
<Box sx={{ mt: 8 }}> {/* 8 * theme.spacing (64px) */}
  {/* Page content */}
</Box>
```

### Sticky Position

**Sticky app bar**:
```jsx
<AppBar position="sticky">
  <Toolbar>
    <Typography variant="h6">
      Sticky App Bar
    </Typography>
  </Toolbar>
</AppBar>
```

**Use Cases for Sticky**:
- Stays at top when scrolled into view
- Better for multi-section pages
- Doesn't require content offset
- Scrolls with content initially

### Responsive Collapse

**Mobile drawer with desktop links**:
```jsx
function ResponsiveAppBar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = ['Home', 'About', 'Services', 'Contact'];

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Brand
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} color="inherit">
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            Brand
          </Typography>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton sx={{ textAlign: 'center' }}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
```

### Multi-Row Layout

**Two-row app bar (primary and secondary)**:
```jsx
<AppBar position="static">
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      Brand Name
    </Typography>
    <IconButton color="inherit">
      <SearchIcon />
    </IconButton>
    <IconButton color="inherit">
      <AccountCircle />
    </IconButton>
  </Toolbar>
  <Toolbar variant="dense" sx={{ bgcolor: 'primary.dark' }}>
    <Button color="inherit">Home</Button>
    <Button color="inherit">Products</Button>
    <Button color="inherit">About</Button>
    <Button color="inherit">Contact</Button>
  </Toolbar>
</AppBar>
```

**App bar with tabs**:
```jsx
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function AppBarWithTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Brand
        </Typography>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="inherit"
        indicatorColor="secondary"
        variant="fullWidth"
      >
        <Tab label="Home" />
        <Tab label="Products" />
        <Tab label="Services" />
        <Tab label="Contact" />
      </Tabs>
    </AppBar>
  );
}
```

---

## 5. State Patterns

### Active/Selected State

**Active navigation item**:
```jsx
function NavigationWithActive() {
  const [activeItem, setActiveItem] = React.useState('home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 4 }}>
          Brand
        </Typography>
        {navItems.map((item) => (
          <Button
            key={item.id}
            color="inherit"
            onClick={() => setActiveItem(item.id)}
            sx={{
              borderBottom: activeItem === item.id ? 2 : 0,
              borderRadius: 0,
              opacity: activeItem === item.id ? 1 : 0.7
            }}
          >
            {item.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}
```

### Scroll Behavior

**Hide on scroll down**:
```jsx
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function App() {
  return (
    <>
      <HideOnScroll>
        <AppBar>
          <Toolbar>
            <Typography variant="h6">
              Hide on Scroll
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar /> {/* Spacer */}
      <Box sx={{ height: '200vh' }}>
        {/* Scrollable content */}
      </Box>
    </>
  );
}
```

**Elevate on scroll**:
```jsx
import useScrollTrigger from '@mui/material/useScrollTrigger';

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

function App() {
  return (
    <>
      <ElevationScroll>
        <AppBar>
          <Toolbar>
            <Typography variant="h6">
              Elevate on Scroll
            </Typography>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <Box sx={{ height: '200vh' }}>
        {/* Scrollable content */}
      </Box>
    </>
  );
}
```

**Change color on scroll**:
```jsx
function ColorOnScroll() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <AppBar
      position="fixed"
      color={trigger ? "primary" : "transparent"}
      elevation={trigger ? 4 : 0}
      sx={{
        transition: 'all 0.3s ease'
      }}
    >
      <Toolbar>
        <Typography variant="h6">
          Transparent Until Scroll
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
```

### Collapsible Menu State

**Expandable mobile menu**:
```jsx
function CollapsibleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          onClick={handleMenu}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Brand
        </Typography>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Home</MenuItem>
          <MenuItem onClick={handleClose}>About</MenuItem>
          <MenuItem onClick={handleClose}>Services</MenuItem>
          <MenuItem onClick={handleClose}>Contact</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
```

---

## 6. Variation Patterns

### Height Options

**Standard toolbar (default)**:
```jsx
<AppBar position="static">
  <Toolbar>
    {/* Default height: 64px desktop, 56px mobile */}
    <Typography variant="h6">Standard Height</Typography>
  </Toolbar>
</AppBar>
```

**Dense toolbar**:
```jsx
<AppBar position="static">
  <Toolbar variant="dense">
    {/* Reduced height: 48px */}
    <Typography variant="h6">Dense Toolbar</Typography>
  </Toolbar>
</AppBar>
```

**Custom height**:
```jsx
<AppBar position="static">
  <Toolbar sx={{ minHeight: 80 }}>
    <Typography variant="h6">Custom Height</Typography>
  </Toolbar>
</AppBar>
```

### Color Themes

**Primary color (default)**:
```jsx
<AppBar position="static" color="primary">
  <Toolbar>
    <Typography variant="h6">Primary Color</Typography>
  </Toolbar>
</AppBar>
```

**Secondary color**:
```jsx
<AppBar position="static" color="secondary">
  <Toolbar>
    <Typography variant="h6">Secondary Color</Typography>
  </Toolbar>
</AppBar>
```

**Default/neutral color**:
```jsx
<AppBar position="static" color="default">
  <Toolbar>
    <Typography variant="h6">Default Color</Typography>
  </Toolbar>
</AppBar>
```

**Transparent background**:
```jsx
<AppBar
  position="static"
  color="transparent"
  elevation={0}
  sx={{ borderBottom: 1, borderColor: 'divider' }}
>
  <Toolbar>
    <Typography variant="h6" color="text.primary">
      Transparent App Bar
    </Typography>
  </Toolbar>
</AppBar>
```

**Custom gradient**:
```jsx
<AppBar
  position="static"
  sx={{
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  }}
>
  <Toolbar>
    <Typography variant="h6">Gradient App Bar</Typography>
  </Toolbar>
</AppBar>
```

### Alignment Options

**Left-aligned content**:
```jsx
<Toolbar>
  <IconButton edge="start" color="inherit">
    <MenuIcon />
  </IconButton>
  <Typography variant="h6">
    Left Aligned
  </Typography>
</Toolbar>
```

**Centered content**:
```jsx
<Toolbar>
  <Box sx={{ flexGrow: 1 }} />
  <Typography variant="h6">
    Centered
  </Typography>
  <Box sx={{ flexGrow: 1 }} />
</Toolbar>
```

**Split layout (logo left, actions right)**:
```jsx
<Toolbar>
  <Typography variant="h6">
    Brand
  </Typography>
  <Box sx={{ flexGrow: 1 }} />
  <Button color="inherit">Login</Button>
</Toolbar>
```

**Three-section layout**:
```jsx
<Toolbar>
  <IconButton edge="start" color="inherit">
    <MenuIcon />
  </IconButton>
  <Typography variant="h6" sx={{ flexGrow: 1 }}>
    Brand
  </Typography>
  <Box>
    <Button color="inherit">About</Button>
    <Button color="inherit">Contact</Button>
  </Box>
  <Box sx={{ flexGrow: 1 }} />
  <IconButton color="inherit">
    <SearchIcon />
  </IconButton>
  <IconButton color="inherit">
    <AccountCircle />
  </IconButton>
</Toolbar>
```

### Spacing Control

**Compact spacing**:
```jsx
<Toolbar variant="dense" sx={{ gap: 1 }}>
  <IconButton size="small" edge="start" color="inherit">
    <MenuIcon />
  </IconButton>
  <Typography variant="subtitle1">Brand</Typography>
  <Button size="small" color="inherit">Home</Button>
  <Button size="small" color="inherit">About</Button>
</Toolbar>
```

**Generous spacing**:
```jsx
<Toolbar sx={{ gap: 3, py: 2 }}>
  <IconButton size="large" edge="start" color="inherit">
    <MenuIcon />
  </IconButton>
  <Typography variant="h5">Brand</Typography>
  <Button color="inherit" sx={{ mx: 1 }}>Home</Button>
  <Button color="inherit" sx={{ mx: 1 }}>About</Button>
</Toolbar>
```

---

## 7. Props/API

### AppBar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `node` | - | The content of the app bar, typically Toolbar |
| `position` | `'fixed' \| 'absolute' \| 'sticky' \| 'static' \| 'relative'` | `'fixed'` | Positioning type for the app bar |
| `color` | `'default' \| 'inherit' \| 'primary' \| 'secondary' \| 'transparent'` | `'primary'` | The color of the component |
| `elevation` | `number` | `4` | Shadow depth. Accepts values 0-24 |
| `enableColorOnDark` | `boolean` | `false` | If true, applies theme color to shadow in dark mode |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for defining custom styles |
| `classes` | `object` | - | Override or extend styles. Supports: `root`, `positionFixed`, `positionAbsolute`, `positionSticky`, `positionStatic`, `positionRelative`, `colorDefault`, `colorPrimary`, `colorSecondary`, `colorInherit`, `colorTransparent` |

**Inherited from Paper**:
- `component` - Root component element type
- `square` - If true, removes border radius
- `variant` - Paper variant ('elevation' or 'outlined')

### Toolbar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `node` | - | Toolbar children, usually IconButton, Typography, Button |
| `variant` | `'regular' \| 'dense'` | `'regular'` | Height variant of the toolbar |
| `disableGutters` | `boolean` | `false` | If true, removes horizontal padding |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for custom styles |
| `classes` | `object` | - | Override styles. Supports: `root`, `gutters`, `regular`, `dense` |

**Toolbar Heights**:
- Regular: 64px (desktop), 56px (mobile)
- Dense: 48px (all viewports)

---

## 8. Styling & Theming

### Using sx Prop

**Basic styling**:
```jsx
<AppBar
  sx={{
    bgcolor: 'background.paper',
    color: 'text.primary',
    boxShadow: 1
  }}
>
  <Toolbar>
    <Typography variant="h6">Styled App Bar</Typography>
  </Toolbar>
</AppBar>
```

**Responsive styling**:
```jsx
<AppBar
  sx={{
    height: { xs: 56, sm: 64 },
    bgcolor: { xs: 'primary.main', md: 'secondary.main' }
  }}
>
  <Toolbar>
    <Typography variant="h6">Responsive Styles</Typography>
  </Toolbar>
</AppBar>
```

**Hover effects**:
```jsx
<Toolbar>
  <Button
    color="inherit"
    sx={{
      '&:hover': {
        bgcolor: 'rgba(255, 255, 255, 0.1)',
      }
    }}
  >
    Hover Me
  </Button>
</Toolbar>
```

### Styled Components API

```jsx
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';

const CustomAppBar = styled(MuiAppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
}));

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: 72,
  [theme.breakpoints.up('sm')]: {
    minHeight: 80,
  },
}));

function StyledAppBar() {
  return (
    <CustomAppBar position="static">
      <CustomToolbar>
        <Typography variant="h6">Custom Styled</Typography>
      </CustomToolbar>
    </CustomAppBar>
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
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        },
        colorPrimary: {
          backgroundColor: '#1976d2',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 72,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* All AppBars will use these styles */}
    </ThemeProvider>
  );
}
```

### CSS Classes for Customization

**AppBar CSS classes**:
- `.MuiAppBar-root` - Root element
- `.MuiAppBar-positionFixed` - Applied when position="fixed"
- `.MuiAppBar-positionAbsolute` - Applied when position="absolute"
- `.MuiAppBar-positionSticky` - Applied when position="sticky"
- `.MuiAppBar-positionStatic` - Applied when position="static"
- `.MuiAppBar-positionRelative` - Applied when position="relative"
- `.MuiAppBar-colorPrimary` - Applied when color="primary"
- `.MuiAppBar-colorSecondary` - Applied when color="secondary"
- `.MuiAppBar-colorDefault` - Applied when color="default"
- `.MuiAppBar-colorTransparent` - Applied when color="transparent"

**Toolbar CSS classes**:
- `.MuiToolbar-root` - Root element
- `.MuiToolbar-regular` - Applied with variant="regular"
- `.MuiToolbar-dense` - Applied with variant="dense"
- `.MuiToolbar-gutters` - Applied when gutters are enabled

---

## 9. Accessibility

### ARIA Attributes

**App bar with navigation**:
```jsx
<AppBar position="static">
  <Toolbar component="nav" role="navigation" aria-label="main navigation">
    <Typography variant="h6">Brand</Typography>
    <Button color="inherit" aria-current="page">Home</Button>
    <Button color="inherit">About</Button>
    <Button color="inherit">Contact</Button>
  </Toolbar>
</AppBar>
```

**Icon buttons with labels**:
```jsx
<Toolbar>
  <IconButton
    color="inherit"
    aria-label="open navigation menu"
    aria-controls="menu-drawer"
    aria-haspopup="true"
  >
    <MenuIcon />
  </IconButton>
  <IconButton
    color="inherit"
    aria-label="search"
  >
    <SearchIcon />
  </IconButton>
  <IconButton
    color="inherit"
    aria-label="notifications"
    aria-describedby="notification-count"
  >
    <Badge badgeContent={4} color="error">
      <NotificationsIcon />
    </Badge>
  </IconButton>
</Toolbar>
```

### Keyboard Navigation

**Supported Keys**:
- **Tab** - Move focus through app bar elements
- **Shift+Tab** - Move focus backward
- **Enter/Space** - Activate focused button or link
- **Escape** - Close open menus

**Keyboard-accessible menu**:
```jsx
function KeyboardMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setAnchorEl(null);
    }
  };

  return (
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="menu"
        aria-controls="main-menu"
        aria-haspopup="true"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        onKeyDown={handleKeyDown}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="main-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onKeyDown={handleKeyDown}
      >
        <MenuItem>Home</MenuItem>
        <MenuItem>About</MenuItem>
        <MenuItem>Contact</MenuItem>
      </Menu>
    </Toolbar>
  );
}
```

### Focus Management

**Skip navigation link**:
```jsx
function AccessibleAppBar() {
  return (
    <>
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 999,
        }}
        onFocus={(e) => {
          e.target.style.left = '0';
        }}
        onBlur={(e) => {
          e.target.style.left = '-9999px';
        }}
      >
        Skip to main content
      </a>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Brand</Typography>
        </Toolbar>
      </AppBar>
      <main id="main-content" tabIndex="-1">
        {/* Main content */}
      </main>
    </>
  );
}
```

### Screen Reader Support

**Semantic markup**:
```jsx
<AppBar position="static" component="header">
  <Toolbar component="nav" aria-label="primary navigation">
    <Typography variant="h6" component="h1">
      Site Title
    </Typography>
    <Box component="ul" sx={{ display: 'flex', listStyle: 'none' }}>
      <li>
        <Button color="inherit" component="a" href="/">
          Home
        </Button>
      </li>
      <li>
        <Button color="inherit" component="a" href="/about">
          About
        </Button>
      </li>
    </Box>
  </Toolbar>
</AppBar>
```

---

## 10. Notable Features

### Elevation System

MUI's elevation system provides depth through shadows:

```jsx
{/* No elevation - flat appearance */}
<AppBar elevation={0}>
  <Toolbar>Flat</Toolbar>
</AppBar>

{/* Default elevation - subtle depth */}
<AppBar elevation={4}>
  <Toolbar>Default</Toolbar>
</AppBar>

{/* High elevation - prominent depth */}
<AppBar elevation={12}>
  <Toolbar>Prominent</Toolbar>
</AppBar>
```

### Integration with Drawer

**Persistent drawer with app bar**:
```jsx
function PersistentDrawerLayout() {
  const [open, setOpen] = React.useState(false);
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
          ml: open ? `${drawerWidth}px` : 0,
          transition: 'width 0.3s, margin 0.3s',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setOpen(!open)}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Brand</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
      >
        {/* Drawer content */}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: open ? `${drawerWidth}px` : 0,
          transition: 'margin 0.3s',
        }}
      >
        <Toolbar /> {/* Spacer */}
        {/* Page content */}
      </Box>
    </Box>
  );
}
```

### Scroll Triggers

**Multiple scroll effects**:
```jsx
function AdvancedScrollBehavior() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <AppBar
      position="fixed"
      elevation={trigger ? 4 : 0}
      sx={{
        bgcolor: trigger ? 'primary.main' : 'transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar>
        <Typography variant="h6">
          Scroll to See Effects
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
```

### Color on Dark Mode

```jsx
<AppBar
  position="static"
  enableColorOnDark
  color="primary"
>
  <Toolbar>
    <Typography variant="h6">
      Enhanced Dark Mode
    </Typography>
  </Toolbar>
</AppBar>
```

### Integration with CssBaseline

```jsx
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Application</Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
```

---

## 11. Complete Example: Full-Featured App Bar

```jsx
import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  InputBase,
  useMediaQuery,
  useTheme,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled, alpha } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function FullFeaturedAppBar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const pages = ['Products', 'Pricing', 'Blog'];
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        LOGO
      </Typography>
      <Divider />
      <List>
        {pages.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              {/* Mobile menu icon */}
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="open navigation menu"
                  onClick={handleDrawerToggle}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Desktop logo */}
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                LOGO
              </Typography>

              {/* Desktop navigation */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>

              {/* Search */}
              {!isMobile && (
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              )}

              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton color="inherit" sx={{ mr: 1 }}>
                  <Badge badgeContent={4} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User menu */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User Name" src="/avatar.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
}

export default FullFeaturedAppBar;
```

---

## 12. Best Practices

### When to Use App Bar

**Use App Bar for**:
- Primary application navigation
- Branding and logo placement
- Global search functionality
- User account access
- Notifications and alerts
- Persistent navigation across pages

**Use Other Components for**:
- Secondary navigation - Use Tabs or Navigation Menu
- Contextual actions - Use Bottom App Bar or Floating Action Button
- Page-specific headers - Use Typography with custom layout

### Design Guidelines

**Ordering (left to right)**:
```jsx
// Good: Standard layout pattern
<Toolbar>
  <IconButton>{/* Menu/Back */}</IconButton>
  <Typography>{/* Brand/Title */}</Typography>
  <Box sx={{ flexGrow: 1 }} />
  <IconButton>{/* Search */}</IconButton>
  <IconButton>{/* Notifications */}</IconButton>
  <Avatar>{/* User */}</Avatar>
</Toolbar>
```

**Content Hierarchy**:
- Most important actions on left (menu, home)
- Branding prominent and clickable
- Secondary actions on right
- User-related actions rightmost

**Visual Clarity**:
```jsx
// Good: Clear contrast and spacing
<AppBar position="static" color="primary">
  <Toolbar sx={{ gap: 2 }}>
    <IconButton edge="start" color="inherit">
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      Clear Brand Name
    </Typography>
  </Toolbar>
</AppBar>

// Good: Sufficient touch targets
<IconButton size="large" color="inherit">
  <MenuIcon />
</IconButton>
```

### Mobile Considerations

**Responsive breakpoints**:
```jsx
<Toolbar>
  {/* Mobile: hamburger menu */}
  <IconButton
    sx={{ display: { xs: 'flex', md: 'none' } }}
    onClick={handleDrawerToggle}
  >
    <MenuIcon />
  </IconButton>

  {/* Desktop: inline navigation */}
  <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
    <Button>Home</Button>
    <Button>About</Button>
    <Button>Contact</Button>
  </Box>
</Toolbar>
```

**Touch target sizes**:
- Minimum 48x48px for tap targets
- Use `size="large"` for IconButton on mobile
- Adequate spacing between interactive elements

### Performance Optimization

**Fixed position offset**:
```jsx
{/* Use Toolbar spacer instead of manual margin */}
<AppBar position="fixed">
  <Toolbar>Content</Toolbar>
</AppBar>
<Toolbar /> {/* Spacer - matches app bar height */}
<Box component="main">
  {/* Content */}
</Box>
```

**Conditional rendering**:
```jsx
// Good: Render mobile drawer only when needed
{isMobile && (
  <Drawer open={mobileOpen} onClose={handleClose}>
    {/* Navigation */}
  </Drawer>
)}
```

**Scroll performance**:
```jsx
// Use useScrollTrigger with threshold to reduce updates
const trigger = useScrollTrigger({
  disableHysteresis: true,
  threshold: 100, // Only trigger after 100px scroll
});
```

---

## 13. Material Design Specifications

### App Bar Dimensions

**Standard heights**:
- Desktop: 64px (regular Toolbar)
- Mobile: 56px (regular Toolbar)
- Dense: 48px (dense Toolbar variant)

**Padding**:
- Horizontal: 16px (default Toolbar gutters)
- Vertical: Automatic based on height

### Elevation

**Default elevation**: 4 (subtle shadow)
- Position fixed: elevation 4
- Position static: elevation 0-4
- On scroll: Can increase elevation
- Range: 0-24

### Animation

**Transitions**:
- Position changes: 225ms standard
- Color changes: 250ms ease-in-out
- Elevation: 250ms ease-in-out
- Hide/show: Slide animation 225ms

### Color Scheme

**Primary variant**:
- Background: theme.palette.primary.main
- Text: theme.palette.primary.contrastText
- Icons: inherit color from text

**Transparent variant**:
- Background: transparent
- Text: theme.palette.text.primary
- Useful for hero sections

### Z-Index

**Default z-index**: 1100 (AppBar)
- Above content: 1000
- Below modals: 1300
- Below tooltips: 1500

---

## 14. Common Patterns & Use Cases

### E-commerce Header
- Logo left
- Search center
- Cart and user icons right
- Category navigation second row

### Dashboard Header
- Menu toggle left
- Page title
- Breadcrumbs (optional)
- User menu right

### Marketing Site
- Logo left
- Navigation links center
- CTA button right
- Transparent on hero, solid on scroll

### Admin Panel
- Menu toggle
- Application name
- Search
- Notifications
- User menu

### Mobile App
- Back button or menu
- Page title center
- Actions right
- Bottom navigation (separate)

---

## 15. Additional Resources

### Official Documentation
- Main docs: https://mui.com/material-ui/react-app-bar/
- AppBar API: https://mui.com/material-ui/api/app-bar/
- Toolbar API: https://mui.com/material-ui/api/toolbar/
- useScrollTrigger: https://mui.com/material-ui/api/use-scroll-trigger/

### Material Design Specifications
- App bars: https://m3.material.io/components/top-app-bar/overview
- Material Design 3: https://m3.material.io/

### Related Components
- Drawer: https://mui.com/material-ui/react-drawer/
- Menu: https://mui.com/material-ui/react-menu/
- Toolbar: https://mui.com/material-ui/api/toolbar/
- Tabs: https://mui.com/material-ui/react-tabs/
- Bottom Navigation: https://mui.com/material-ui/react-bottom-navigation/

---

## Summary

MUI App Bar is a comprehensive, Material Design-compliant navigation component that provides:

- **Flexible positioning** - static, fixed, sticky, absolute, relative options
- **Rich composition** - Toolbar with IconButton, Typography, Menu, Drawer integration
- **Material Design integration** - Elevation, color schemes, smooth animations, theme support
- **Responsive patterns** - Mobile drawer, desktop navigation, adaptive layouts
- **Full accessibility** - ARIA attributes, keyboard navigation, screen reader support
- **Extensive customization** - sx prop, styled components, theme-level overrides
- **Scroll behaviors** - Hide on scroll, elevate on scroll, color transitions
- **Performance optimized** - Efficient rendering with scroll triggers and conditional display

The component is production-ready, well-documented, and suitable for application headers, navigation bars, branding containers, and persistent UI shells. Its composition system makes it easy to create rich, responsive navigation experiences that work across devices.

---

Research completed: 2025-11-10
Component: App Bar
Framework: MUI (Material-UI)
Documentation: https://mui.com/material-ui/react-app-bar/
