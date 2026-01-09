# MUI (Material-UI) - Drawer Component

## Component Overview

The MUI Drawer component provides a navigation panel that slides in from the edge of the screen. Based on Material Design principles, it serves as a primary navigation mechanism for applications, particularly on mobile devices and responsive layouts. The Drawer can be permanent, persistent, or temporary, adapting to different screen sizes and use cases.

**Core purpose**: Provides hierarchical navigation and app-level actions through a slide-out panel, maximizing screen real estate while maintaining easy access to navigation options.

**Architecture**: Built on top of the Modal component (for temporary variant) or rendered directly in the DOM (for persistent/permanent variants), using Paper component for the drawer surface. Supports positioning from any edge of the screen (left, right, top, bottom).

**Common use cases**: App navigation menus, settings panels, filter sidebars, multi-level navigation hierarchies, mobile-first responsive layouts, dashboard side panels, documentation navigation.

## Usage Patterns

### Basic Usage

The Drawer component requires an `open` prop to control visibility and an `onClose` callback for temporary drawers:

```jsx
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { useState } from 'react';

// Basic temporary drawer (default variant)
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Drawer</Button>
<Drawer
  open={open}
  onClose={() => setOpen(false)}
>
  <div>Drawer content</div>
</Drawer>

// With anchor position
<Drawer
  anchor="left"  // Default is 'left'
  open={open}
  onClose={() => setOpen(false)}
>
  <div>Navigation menu</div>
</Drawer>
```

### Variants/Styles

MUI Drawer provides three distinct variants based on Material Design navigation patterns:

**Temporary Drawer** (`variant="temporary"` - default):
- Overlays content with a backdrop
- Closes when backdrop is clicked or Esc key is pressed
- Closes when navigation item is selected
- Default behavior for mobile/tablet screens
- Highest elevation level (sits above all content)
- Example: Mobile navigation menus

**Persistent Drawer** (`variant="persistent"`):
- Sits at same elevation as content
- No backdrop overlay
- Toggles open/closed via user action
- Content area adjusts to accommodate drawer
- Stays open until explicitly closed
- Example: Dashboard side panels that can be collapsed

**Permanent Drawer** (`variant="permanent"`):
- Always visible, cannot be closed
- No backdrop, no close mechanism
- Fixed to edge of screen
- Content area permanently adjusted
- Recommended for desktop applications
- Example: Desktop app navigation, documentation sidebars

### Anchor Positions

The `anchor` prop determines which edge the drawer slides from:

**Left Anchor** (`anchor="left"` - default):
- Standard position for primary navigation (LTR languages)
- Material Design recommended for main navigation
- Slides from left edge

**Right Anchor** (`anchor="right"`):
- Used for secondary actions, settings, or filters
- Appropriate for RTL language layouts as primary navigation
- Slides from right edge

**Top Anchor** (`anchor="top"`):
- Less common, used for notification panels
- Slides down from top edge
- Full-width by default

**Bottom Anchor** (`anchor="bottom"`):
- Mobile-friendly for action sheets
- Slides up from bottom edge
- Full-width by default

### States

**Open/Closed States**:
- Controlled via `open` boolean prop
- State typically managed in parent component
- Temporary: closes on backdrop click, Esc key, or programmatically
- Persistent: only closes programmatically
- Permanent: always open (open prop ignored)

**Transition States**:
- Smooth slide animation during open/close
- Configurable duration via `transitionDuration` prop
- Can be disabled for instant appearance
- Uses CSS transitions for performance

### Sizing Options

**Width Customization**:
- No built-in size prop (differs from other MUI components)
- Width controlled via `PaperProps` styling
- Common pattern: `PaperProps={{ sx: { width: 240 } }}`
- Can use responsive width values
- Default width: 240px (Material Design guideline)

**Responsive Sizing**:
```jsx
// Fixed width
<Drawer PaperProps={{ sx: { width: 280 } }}>

// Percentage width
<Drawer PaperProps={{ sx: { width: '25%' } }}>

// Responsive width
<Drawer PaperProps={{
  sx: {
    width: { xs: '100%', sm: 320, md: 240 }
  }
}}>
```

### Layout & Positioning

**Elevation Control**:
- `elevation` prop controls shadow depth
- Default: 16 (for temporary)
- Range: 0-24
- Higher values = more prominent shadow
- Permanent drawers typically use lower elevation

**Backdrop Customization**:
- `hideBackdrop` prop removes backdrop overlay
- `BackdropProps` for backdrop styling
- Backdrop click triggers `onClose` (temporary variant)
- Example: `BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.3)' } }}`

**Modal Behavior**:
- `ModalProps` passed through to underlying Modal (temporary variant)
- `keepMounted` improves mobile performance
- `disableScrollLock` prevents body scroll lock
- Example: `ModalProps={{ keepMounted: true }}`

**Paper Styling**:
- `PaperProps` customizes drawer surface
- Controls width, padding, background
- Applied to Paper component inside drawer
- Example: `PaperProps={{ sx: { backgroundColor: 'grey.100' } }}`

### Content & Structure

**Navigation Lists**:
- Typically contains List, ListItem, ListItemButton components
- Divider components for visual grouping
- Icons paired with text labels
- Example structure:
```jsx
<Drawer open={open} onClose={handleClose}>
  <List>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon><HomeIcon /></ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
    </ListItem>
    <Divider />
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon><SettingsIcon /></ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </ListItem>
  </List>
</Drawer>
```

**Header Section**:
- Optional toolbar/header at top of drawer
- Often contains app logo, title, or close button
- Toolbar component commonly used
- Example:
```jsx
<Drawer>
  <Toolbar>
    <Typography variant="h6">App Name</Typography>
  </Toolbar>
  <Divider />
  <List>{/* navigation items */}</List>
</Drawer>
```

**Footer Actions**:
- Optional action buttons at bottom
- User profile, logout, help links
- Fixed positioning via CSS or Box component

### Interactive Features

**Click-to-Close**:
- Temporary drawer closes on backdrop click
- Closes on navigation item selection (implement in onClick)
- Persistent drawer requires explicit close button
- Example:
```jsx
const handleNavClick = () => {
  // Navigate to page
  navigate('/home');
  // Close drawer
  setOpen(false);
};
```

**Keyboard Interaction**:
- Esc key closes temporary drawer (automatic)
- Tab key navigation within drawer
- Focus trap active when drawer open (temporary)
- Arrow keys for list navigation

**Swipeable Variant**:
- `SwipeableDrawer` component for touch gestures
- Swipe from edge to open
- Swipe to close
- Additional 2kB payload
- Optimized for mobile performance
- Props: `onOpen`, `onClose`, `disableBackdropTransition`, `disableSwipeToOpen`

### Animation & Transitions

**Slide Transition**:
- Default slide animation from anchor edge
- Smooth, hardware-accelerated
- Duration: 225ms enter, 195ms exit (default)

**Custom Duration**:
```jsx
// Single duration for all transitions
<Drawer transitionDuration={300}>

// Separate enter/exit durations
<Drawer transitionDuration={{ enter: 225, exit: 195 }}>
```

**Disable Transitions**:
```jsx
// Instant appearance
<Drawer transitionDuration={0}>
```

**Backdrop Transition**:
- Fades in/out with drawer
- Can be disabled: `disableBackdropTransition` (SwipeableDrawer)
- Improves performance on low-end devices

### Integration Patterns

**Responsive Navigation**:
```jsx
import { useTheme, useMediaQuery } from '@mui/material';

const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

<Drawer
  variant={isMobile ? 'temporary' : 'permanent'}
  open={isMobile ? open : true}
  onClose={() => setOpen(false)}
>
  {/* Navigation content */}
</Drawer>
```

**App Bar Integration**:
```jsx
// With persistent drawer, shift content
<Box sx={{ display: 'flex' }}>
  <AppBar position="fixed" sx={{
    width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
    ml: open ? `${drawerWidth}px` : 0,
  }}>
    <Toolbar>
      <IconButton onClick={() => setOpen(!open)}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6">App Title</Typography>
    </Toolbar>
  </AppBar>
  <Drawer variant="persistent" open={open}>
    {/* Drawer content */}
  </Drawer>
  <Box component="main" sx={{
    flexGrow: 1,
    p: 3,
    ml: open ? 0 : `-${drawerWidth}px`
  }}>
    {/* Main content */}
  </Box>
</Box>
```

**Multi-level Navigation**:
```jsx
// Expandable nested lists
<List>
  <ListItemButton onClick={() => setSubmenuOpen(!submenuOpen)}>
    <ListItemText primary="Products" />
    {submenuOpen ? <ExpandLess /> : <ExpandMore />}
  </ListItemButton>
  <Collapse in={submenuOpen}>
    <List component="div" disablePadding>
      <ListItemButton sx={{ pl: 4 }}>
        <ListItemText primary="Category 1" />
      </ListItemButton>
    </List>
  </Collapse>
</List>
```

**Filter Drawer**:
```jsx
// Right-side drawer for filtering
<Button onClick={() => setFilterOpen(true)}>
  <FilterListIcon /> Filters
</Button>
<Drawer
  anchor="right"
  open={filterOpen}
  onClose={() => setFilterOpen(false)}
>
  <Box sx={{ width: 300, p: 2 }}>
    <Typography variant="h6">Filters</Typography>
    {/* Filter controls */}
  </Box>
</Drawer>
```

### Accessibility Features

**ARIA Attributes**:
- Modal component provides `role="presentation"` on backdrop
- Drawer itself gets appropriate ARIA roles
- Add `aria-label` to drawer for screen readers
- Example: `<Drawer aria-label="Main navigation">`

**Focus Management**:
- Focus automatically trapped in temporary drawer (via Modal)
- Tab cycles through drawer contents only when open
- Focus returns to trigger element on close
- Manual focus management needed for persistent/permanent drawers

**Keyboard Navigation**:
- Esc key closes temporary drawer (automatic)
- Tab/Shift+Tab for focus navigation
- Arrow keys work with List components
- Enter/Space activate list items

**Screen Reader Support**:
- Announce drawer open/close state changes
- List items announced with context
- Icon-only buttons need `aria-label`
- Example: `<IconButton aria-label="Open navigation menu">`

**Color Contrast**:
- Default theme meets WCAG AA standards
- Ensure custom colors maintain contrast
- Selected/hover states clearly distinguishable
- Dark mode support built-in

## Key Properties/Props

### Drawer Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls drawer visibility |
| `onClose` | `function` | - | Callback when drawer should close (required for temporary) |
| `anchor` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Side of screen drawer appears from |
| `variant` | `'permanent' \| 'persistent' \| 'temporary'` | `'temporary'` | Drawer behavior type |
| `children` | `node` | - | Drawer content |
| `elevation` | `number` | `16` | Shadow elevation (0-24) |
| `hideBackdrop` | `boolean` | `false` | If true, backdrop is not rendered |
| `transitionDuration` | `number \| { enter?: number, exit?: number }` | `{ enter: 225, exit: 195 }` | Transition duration in milliseconds |
| `sx` | `object` | - | System prop for styling |
| `className` | `string` | - | CSS class name |

### Paper Props (via PaperProps)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `PaperProps.sx` | `object` | - | Styling for Paper component (use for width) |
| `PaperProps.style` | `object` | - | Inline styles for Paper |
| `PaperProps.elevation` | `number` | - | Paper elevation override |

### Modal Props (via ModalProps - temporary variant only)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ModalProps.keepMounted` | `boolean` | `false` | Keep drawer mounted when closed (better mobile performance) |
| `ModalProps.disableScrollLock` | `boolean` | `false` | Disable body scroll lock when drawer open |
| `ModalProps.BackdropProps` | `object` | - | Props for backdrop component |
| `ModalProps.disableEscapeKeyDown` | `boolean` | `false` | Disable Esc key to close |

### Slide Props (via SlideProps)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `SlideProps.timeout` | `number \| object` | - | Transition timeout override |
| `SlideProps.easing` | `string \| object` | - | Transition easing function |

## Code Examples

### Example 1: Basic Temporary Drawer
```jsx
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function BasicDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          <ListItem button onClick={() => setOpen(false)}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => setOpen(false)}>
            <ListItemText primary="About" />
          </ListItem>
          <ListItem button onClick={() => setOpen(false)}>
            <ListItemText primary="Contact" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
```

### Example 2: All Anchor Positions
```jsx
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function AnchorDrawer() {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' &&
        (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Item 1', 'Item 2', 'Item 3'].map((text) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {['left', 'right', 'top', 'bottom'].map((anchor) => (
        <div key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </div>
      ))}
    </>
  );
}
```

### Example 3: Persistent Drawer with AppBar
```jsx
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const drawerWidth = 240;

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default function PersistentDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Persistent Drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Toolbar>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <Toolbar />
        <Typography paragraph>
          Main content here
        </Typography>
      </Main>
    </Box>
  );
}
```

### Example 4: Permanent Drawer
```jsx
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

export default function PermanentDrawer() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Permanent Drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <Typography paragraph>
          Main content here
        </Typography>
      </Box>
    </Box>
  );
}
```

### Example 5: SwipeableDrawer for Mobile
```jsx
import { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function SwipeableTemporaryDrawer() {
  const [open, setOpen] = useState(false);

  const iOS = typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        <List sx={{ width: 250 }}>
          {['Home', 'Profile', 'Settings'].map((text) => (
            <ListItem button key={text} onClick={() => setOpen(false)}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
    </>
  );
}
```

### Example 6: Responsive Drawer
```jsx
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const drawerWidth = 240;

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawer = (
    <List>
      {['Home', 'About', 'Services', 'Contact'].map((text) => (
        <ListItem button key={text}>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Responsive Drawer
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography paragraph>
          Main content that adapts to drawer state
        </Typography>
      </Box>
    </Box>
  );
}
```

### Example 7: Styled Drawer with Custom Width
```jsx
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

export default function StyledDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Styled Drawer
      </Button>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 320,
            backgroundColor: 'primary.light',
            color: 'primary.contrastText',
            padding: 2,
          }
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            Custom Drawer
          </Typography>
          <List>
            {['Item 1', 'Item 2', 'Item 3'].map((text) => (
              <ListItem button key={text} onClick={() => setOpen(false)}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
```

### Example 8: Drawer with Navigation Icons
```jsx
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';

export default function IconDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Menu</Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 280 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpen(false)}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpen(false)}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpen(false)}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpen(false)}>
              <ListItemIcon><InfoIcon /></ListItemIcon>
              <ListItemText primary="About" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
```

### Example 9: Drawer with Nested Navigation
```jsx
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function NestedDrawer() {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Navigation</Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 280 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpen(false)}>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItemButton onClick={() => setSubmenuOpen(!submenuOpen)}>
            <ListItemText primary="Products" />
            {submenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => setOpen(false)}>
                <ListItemText primary="Electronics" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => setOpen(false)}>
                <ListItemText primary="Clothing" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => setOpen(false)}>
                <ListItemText primary="Books" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpen(false)}>
              <ListItemText primary="Contact" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
```

### Example 10: Filter Drawer (Right Anchor)
```jsx
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function FilterDrawer() {
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([20, 80]);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={() => setOpen(true)}
      >
        Filters
      </Button>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
            Category
          </Typography>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Electronics" />
            <FormControlLabel control={<Checkbox />} label="Clothing" />
            <FormControlLabel control={<Checkbox />} label="Books" />
          </FormGroup>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
            Price Range
          </Typography>
          <Slider
            value={priceRange}
            onChange={(e, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="outlined" fullWidth onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" fullWidth onClick={() => setOpen(false)}>
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
```

## Accessibility Notes

**Material Design Compliance**:
- Follows Material Design navigation drawer specifications
- Elevation system creates clear visual hierarchy
- Motion guidelines implemented in transitions
- Touch target sizes meet Material Design minimums (48px)

**ARIA Implementation**:
- Modal component provides appropriate ARIA attributes automatically
- Add `aria-label` to drawer for screen reader context
- Navigation lists should use semantic HTML (nav, ul, li)
- Icon-only buttons require `aria-label` attributes
- Example: `<IconButton aria-label="Open navigation menu"><MenuIcon /></IconButton>`

**Keyboard Support**:
- Esc key closes temporary drawer (automatic)
- Tab/Shift+Tab cycles through focusable elements
- Focus trapped within temporary drawer when open
- Enter/Space activates buttons and list items
- Arrow keys navigate list items (when using List components)

**Focus Management**:
- Focus automatically moves to drawer on open (temporary variant)
- Focus returns to trigger element on close
- Visual focus indicators on all interactive elements
- Persistent/permanent drawers don't trap focus

**Screen Reader Experience**:
- Drawer open/close state changes announced
- Navigation items announced with context
- Nested lists properly structured for screen readers
- Loading states announced via aria-live regions if applicable

**Color and Contrast**:
- Default theme meets WCAG AA standards (4.5:1 minimum)
- Selected state has sufficient contrast
- Hover states visually distinct
- Dark mode fully supported
- Don't rely on color alone to convey information

**Touch and Mobile**:
- Touch targets minimum 48x48px (Material Design guideline)
- SwipeableDrawer optimized for touch gestures
- Sufficient spacing between interactive elements
- Backdrop provides large dismissal area

## Common Patterns

1. **Mobile Navigation Menu**: Temporary drawer with hamburger icon trigger, closes on item selection
2. **Dashboard Sidebar**: Permanent drawer on desktop, temporary on mobile (responsive)
3. **Filter Panel**: Right-anchored temporary drawer with form controls and apply/cancel buttons
4. **Settings Drawer**: Persistent drawer that toggles open/closed, content adjusts accordingly
5. **Multi-level Navigation**: Nested lists with expandable sections using Collapse component
6. **App Bar Integration**: Permanent/persistent drawer with coordinated AppBar positioning
7. **Swipeable Mobile Nav**: SwipeableDrawer for native app-like swipe gestures on mobile
8. **Split Layout**: Permanent drawer on left with main content area adjusting to drawer width
9. **Contextual Actions**: Right drawer for secondary actions, filters, or details panel
10. **Responsive Pattern**: useMediaQuery to switch between temporary (mobile) and permanent (desktop) variants

## Related Components

- **SwipeableDrawer** - Touch-optimized drawer variant with swipe gestures (2kB overhead)
- **AppBar** - Top navigation bar, often coordinated with drawer positioning
- **List, ListItem, ListItemButton** - Standard navigation list components for drawer content
- **Divider** - Visual separators between navigation sections
- **Collapse** - Expandable sections for nested navigation
- **IconButton** - Menu toggle buttons (hamburger icon)
- **Toolbar** - Header/footer sections within drawer
- **Box** - Layout container for drawer content
- **Modal** - Underlying component for temporary drawer (props passed through)
- **Paper** - Surface component used for drawer (styled via PaperProps)

## Material Design Specific Features

**Elevation System**:
- Temporary drawers use elevation 16 (highest, above all content)
- Persistent drawers at elevation 0 or 1 (same level as content)
- Permanent drawers typically elevation 0 (part of base layout)
- Backdrop provides depth perception for temporary variant

**Motion Design**:
- Slide transition from anchor edge follows Material motion principles
- Standard duration: 225ms enter, 195ms exit
- Easing curves: ease-out (enter), ease-in (exit)
- Backdrop fades in sync with drawer movement

**Surface Treatment**:
- Paper component provides Material Design surface
- Background color adapts to theme (light/dark mode)
- Optional elevation shadow for depth perception

**Responsive Behavior**:
- Mobile-first navigation patterns
- Temporary variant default for smaller screens
- Permanent variant recommended for desktop
- Breakpoint-based variant switching encouraged

**Navigation Patterns**:
- Standard, modal, and bottom navigation drawer types
- Follows Material Design navigation hierarchy
- Consistent with Android/iOS navigation patterns
- Touch-friendly sizing and spacing

**Typography and Spacing**:
- Default drawer width: 240px (Material Design guideline)
- List items use standard Material typography scale
- Consistent padding/spacing via theme spacing units
- Icon-text alignment follows Material Design specs

---

**Research completed:** 2025-11-06
**Component:** Drawer
**Framework:** MUI (Material-UI)
**Documentation:** https://mui.com/material-ui/react-drawer/

**Notable Features:**
- Three distinct variants (temporary, persistent, permanent) following Material Design patterns
- Four anchor positions (left, right, top, bottom) for flexible placement
- Built on Modal component with full Modal props passthrough for temporary variant
- SwipeableDrawer variant for touch-optimized mobile interactions
- Comprehensive accessibility with automatic focus management and ARIA attributes
- Responsive design patterns with useMediaQuery integration
- PaperProps for extensive styling customization
- Material Design compliant elevation, motion, and spacing system
- Integration patterns with AppBar, List, and other Material components
- Performance optimizations (keepMounted, disableScrollLock) for mobile devices
