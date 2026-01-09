# MUI (Material-UI) - Drawer Usage Patterns

## Component URL
https://mui.com/material-ui/react-drawer/
Status: ✅ Working
API Reference: https://mui.com/material-ui/api/drawer/
SwipeableDrawer API: https://mui.com/material-ui/api/swipeable-drawer/
Version: Current (v5+/v6)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - MUI provides excellent documentation with interactive demos, complete API reference, code examples, accessibility guidance, and multiple drawer variants. The component follows Material Design specifications and integrates well with Modal, Popover, and other MUI components.

---

## 1. Component Overview

The MUI Drawer component is a Material Design implementation of an off-canvas panel that slides in from the edge of the screen. Drawers are side navigation panels that appear when triggered, providing access to navigation menus, filters, secondary content, or settings without consuming permanent screen space.

The Drawer component has three main architectural variants:
- **Temporary Drawer** - Overlay-based, dismissible with backdrop click or escape key (default behavior)
- **Persistent Drawer** - Stays visible, doesn't use backdrop, content shifts aside
- **Permanent Drawer** - Always visible, integrated into layout, no animation

MUI also provides a **SwipeableDrawer** component for mobile-optimized touch interactions, allowing users to swipe open/close from screen edges.

**Key Characteristics**:
- Built on top of the Modal component
- Animates in from screen edge (left, right, top, or bottom)
- Supports configurable width/height
- Material Design elevation and shadows
- Full accessibility with proper focus management
- Responsive behavior across screen sizes

---

## 2. Basic Usage

### Import
```jsx
import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
```

### Simple Drawer (Temporary - Default)
The most common pattern uses `useState` to manage drawer open state:

```jsx
import React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function BasicDrawer() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open Drawer</Button>
      <Drawer
        anchor="left"
        open={open}
        onClose={handleClose}
      >
        <List sx={{ width: 250 }}>
          <ListItem button onClick={handleClose}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={handleClose}>
            <ListItemText primary="About" />
          </ListItem>
          <ListItem button onClick={handleClose}>
            <ListItemText primary="Contact" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
```

**Key Pattern Notes**:
- `open` state controls visibility
- `anchor` prop determines which edge drawer slides from (left/right/top/bottom)
- `onClose` callback fires when backdrop is clicked or escape is pressed
- Default `variant` is "temporary" (overlay with backdrop)
- Drawer content should have defined width to prevent layout shifts

### Navigation Drawer Pattern
```jsx
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';

function NavigationDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Menu</Button>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 280, pt: 0 }}>
          <ListItem button>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Shop" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
```

---

## 3. Props/API

### Core Drawer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `anchor` | `'left' \| 'top' \| 'right' \| 'bottom'` | `'left'` | Which edge of the screen the drawer slides in from. |
| `open` | `boolean` | `false` | If `true`, the drawer is visible. Controls the open/close state. |
| `onClose` | `function` | - | Callback fired when the drawer requests to close. Signature: `(event: object, reason: string) => void`. Reason can be 'escapeKeyDown' or 'backdropClick'. |
| `variant` | `'permanent' \| 'persistent' \| 'temporary'` | `'temporary'` | The type of drawer: temporary (overlay), persistent (stays open with backdrop), or permanent (always visible). |
| `children` | `node` | - | The content of the drawer. Typically a List component. |
| `elevation` | `number` | `16` | The elevation (shadow depth) of the drawer. Range: 0-24. |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for defining custom styles with theme access. |
| `classes` | `object` | - | Override styles applied to the component. Supports: `paper`, `docked`, `modal`, `permanentDrawerDocked`, `permanentDrawerPaper`. |
| `PaperProps` | `object` | - | **Deprecated in v6** - Use `slotProps.paper` instead. Props applied to the Paper element. |
| `ModalProps` | `object` | - | **Deprecated in v6** - Use `slotProps.modal` instead. Props passed to the Modal component (for temporary variant). |
| `SlideProps` | `object` | - | **Deprecated in v6** - Use `slotProps.slide` instead. Props passed to the Slide transition component. |
| `slotProps` | `object` | - | Props for component slots. Supports `paper` (Paper props), `modal` (Modal props), and `slide` (Slide props). |
| `transitionDuration` | `'auto' \| number \| object` | `{ enter: 225, exit: 195 }` | Duration of the enter/exit animation in milliseconds. Can be a number or object with enter/exit keys. |
| `hideBackdrop` | `boolean` | `false` | If `true`, the backdrop is not rendered. Useful for permanent drawers. |

**Inherited from Modal** (when variant='temporary'): `BackdropComponent`, `BackdropProps`, `disableEscapeKeyDown`, `disablePortal`, `keepMounted`, `manager`, etc.

### SwipeableDrawer Props (extends Drawer)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disableBackdropTransition` | `boolean` | `false` | Disable the backdrop transition. Useful for performance. |
| `disableDiscovery` | `boolean` | `false` | If `true`, swiping from the edge won't open the drawer. |
| `disableSwipeToOpen` | `boolean` | `false` | If `true`, the drawer can't be opened by swiping from the edge. |
| `hysteresis` | `number` | `0.52` | Threshold for swipe distance. Higher values require more swipe distance to open. |
| `minFlingVelocity` | `number` | `400` | Minimum velocity required to trigger fling-open behavior. |
| `onOpen` | `function` | - | Callback fired when the drawer opens via swipe. |
| `onClose` | `function` | - | Callback fired when the drawer closes via swipe. |
| `swipeAreaWidth` | `number` | `20` | Width in pixels of the swipe area at the screen edge that triggers drawer opening. |
| `ModalProps` | `object` | - | Props passed to the underlying Modal component. |

---

## 4. Drawer Variant Patterns

### Temporary Drawer (Default - Overlay)

Most common pattern. Drawer appears as overlay, can be dismissed via backdrop click or escape.

```jsx
function TemporaryDrawerExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary"  // Default, can be omitted
      >
        {/* Drawer content */}
      </Drawer>
    </>
  );
}
```

**Characteristics**:
- Renders a Modal backdrop
- Dismissible on backdrop click or escape
- Content doesn't push page content aside
- Elevation 16 by default (floats above content)
- Best for mobile-first designs

### Persistent Drawer

Drawer stays visible but can be toggled. When closed, it doesn't take up space. When open, it pushes content aside without a backdrop.

```jsx
function PersistentDrawerExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: 'flex' }}>
      <Button onClick={() => setOpen(!open)}>Toggle</Button>
      <Drawer
        anchor="left"
        open={open}
        variant="persistent"
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {/* Drawer content */}
      </Drawer>
      <main style={{ flex: 1 }}>
        {/* Main content shifts right when drawer opens */}
      </main>
    </div>
  );
}
```

**Characteristics**:
- No backdrop (content behind is clickable)
- Content shifts aside when drawer opens
- Smooth transition animation
- Useful for collapsible sidebars
- Maintains scroll position in main content

### Permanent Drawer

Drawer is always visible, integrated into layout. No animation or backdrop.

```jsx
function PermanentDrawerExample() {
  return (
    <div style={{ display: 'flex' }}>
      <Drawer
        anchor="left"
        variant="permanent"
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {/* Drawer content */}
      </Drawer>
      <main style={{ flex: 1 }}>
        {/* Main content shifts right from drawer */}
      </main>
    </div>
  );
}
```

**Characteristics**:
- Always visible, never closes
- Part of normal layout flow
- No animation or backdrop
- Useful for desktop layouts
- Responsive hiding via media queries

### SwipeableDrawer (Mobile)

Allows opening/closing via swipe gesture on mobile devices.

```jsx
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

function SwipeableDrawerExample() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(true);
  };

  const handleClose = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        swipeAreaWidth={20}  // Pixels from edge to trigger swipe
        disableSwipeToOpen={false}  // Allow swiping to open
      >
        {/* Drawer content */}
      </SwipeableDrawer>
    </>
  );
}
```

**Characteristics**:
- Open via swipe from screen edge
- Close via swipe outward
- Hysteresis controls ease of activation
- Mobile-optimized interaction
- Fallback button still recommended

---

## 5. Placement Patterns

### Left Anchor (Default)
```jsx
<Drawer anchor="left" open={open} onClose={handleClose}>
  {/* Slides in from left side */}
</Drawer>
```

### Right Anchor
```jsx
<Drawer anchor="right" open={open} onClose={handleClose}>
  {/* Slides in from right side - common for RTL layouts */}
</Drawer>
```

### Top Anchor
```jsx
<Drawer anchor="top" open={open} onClose={handleClose}>
  {/* Slides down from top - like mobile actionsheet */}
</Drawer>
```

### Bottom Anchor
```jsx
<Drawer anchor="bottom" open={open} onClose={handleClose}>
  {/* Slides up from bottom - mobile favorite pattern */}
</Drawer>
```

**Anchor Selection Guidelines**:
- **Left/Right**: Standard for vertical navigation menus
- **Left**: Default in LTR languages
- **Right**: Common in RTL languages or context menus
- **Bottom**: Mobile action sheets, quick actions
- **Top**: Less common, use for persistent top panels

---

## 6. Size Patterns

### Fixed Width Drawer
```jsx
<Drawer
  anchor="left"
  open={open}
  onClose={handleClose}
  sx={{
    '& .MuiDrawer-paper': {
      width: 280,
      boxSizing: 'border-box',
    },
  }}
>
  {/* 280px wide drawer */}
</Drawer>
```

### Responsive Width
```jsx
<Drawer
  anchor="left"
  open={open}
  onClose={handleClose}
  sx={{
    '& .MuiDrawer-paper': {
      width: {
        xs: '100%',    // Mobile: full width
        sm: 280,       // Tablet: 280px
        md: 300,       // Desktop: 300px
      },
      boxSizing: 'border-box',
    },
  }}
>
  {/* Responsive width */}
</Drawer>
```

### Max Width with Percentage
```jsx
<Drawer
  anchor="left"
  open={open}
  onClose={handleClose}
  sx={{
    '& .MuiDrawer-paper': {
      maxWidth: 400,
      width: '90vw',  // 90% of viewport width
      boxSizing: 'border-box',
    },
  }}
>
  {/* Responsive with max constraint */}
</Drawer>
```

### Full Height Drawer
```jsx
<Drawer
  anchor="bottom"
  open={open}
  onClose={handleClose}
  sx={{
    '& .MuiDrawer-paper': {
      height: 'auto',
      maxHeight: '80vh',  // Don't exceed 80% of viewport
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
  }}
>
  {/* Bottom drawer with flexible height */}
</Drawer>
```

---

## 7. Content Patterns

### List Navigation Content
```jsx
function DrawerWithList() {
  const [open, setOpen] = React.useState(false);

  const navigationItems = [
    { icon: HomeIcon, label: 'Home' },
    { icon: ShoppingCartIcon, label: 'Shop' },
    { icon: FavoriteIcon, label: 'Favorites' },
    { icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)}>Menu</Button>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280 }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Navigation</Typography>
          </Box>

          {/* Navigation List */}
          <List>
            {navigationItems.map((item) => (
              <ListItem button key={item.label}>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>

          {/* Divider */}
          <Divider />

          {/* Footer */}
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Version 1.0.0
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
```

### Drawer with Header and Footer
```jsx
function DrawerWithLayout() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
      <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">Menu Title</Typography>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List>
            {/* List items here */}
          </List>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Button fullWidth variant="outlined">
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
```

### Collapsible Drawer (Persistent)
```jsx
function CollapsibleDrawer() {
  const [open, setOpen] = React.useState(true);

  return (
    <div style={{ display: 'flex' }}>
      <Drawer
        anchor="left"
        open={open}
        variant="persistent"
        sx={{
          width: open ? 280 : 60,
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1)',
          '& .MuiDrawer-paper': {
            width: open ? 280 : 60,
            overflowX: 'hidden',
            transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1)',
          },
        }}
      >
        <List>
          {[
            { icon: HomeIcon, label: 'Home' },
            { icon: ShoppingCartIcon, label: 'Shop' },
          ].map((item) => (
            <ListItem button key={item.label}>
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItem>
          ))}
        </List>
      </Drawer>

      <main style={{ flex: 1 }}>
        <Button onClick={() => setOpen(!open)}>
          {open ? 'Collapse' : 'Expand'}
        </Button>
      </main>
    </div>
  );
}
```

---

## 8. State Patterns

### Controlled Drawer
```jsx
function ControlledDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Button onClick={() => setOpen(false)}>Close</Button>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        {/* Drawer content */}
      </Drawer>
    </div>
  );
}
```

### Multiple Drawers
```jsx
function MultipleDrawers() {
  const [leftOpen, setLeftOpen] = React.useState(false);
  const [rightOpen, setRightOpen] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setLeftOpen(true)}>Left Menu</Button>
      <Button onClick={() => setRightOpen(true)}>Right Menu</Button>

      <Drawer anchor="left" open={leftOpen} onClose={() => setLeftOpen(false)}>
        {/* Left drawer content */}
      </Drawer>

      <Drawer anchor="right" open={rightOpen} onClose={() => setRightOpen(false)}>
        {/* Right drawer content */}
      </Drawer>
    </div>
  );
}
```

### Drawer with Navigation Link Handling
```jsx
function DrawerWithNavigation() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);  // Close after navigation
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Menu</Button>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 280 }}>
          <ListItem button onClick={() => handleNavigation('/')}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/about')}>
            <ListItemText primary="About" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
```

---

## 9. Animation Patterns

### Custom Transition Duration
```jsx
<Drawer
  anchor="left"
  open={open}
  onClose={handleClose}
  transitionDuration={300}  // Milliseconds
>
  {/* Drawer content */}
</Drawer>
```

### Separate Enter/Exit Duration
```jsx
<Drawer
  anchor="left"
  open={open}
  onClose={handleClose}
  transitionDuration={{ enter: 225, exit: 195 }}
>
  {/* Drawer content */}
</Drawer>
```

### Disable Animation
```jsx
<Drawer
  anchor="left"
  open={open}
  onClose={handleClose}
  transitionDuration={0}  // Instant open/close
>
  {/* Drawer content */}
</Drawer>
```

### Custom Slide Direction
```jsx
<Drawer
  anchor="left"
  open={open}
  onClose={handleClose}
  slotProps={{
    slide: {
      direction: 'right',  // Direction of Slide component
    }
  }}
>
  {/* Drawer content */}
</Drawer>
```

---

## 10. Styling & Theming

### Using sx Prop
```jsx
<Drawer
  anchor="left"
  open={open}
  onClose={handleClose}
  sx={{
    '& .MuiDrawer-paper': {
      backgroundColor: '#fafafa',
      width: 300,
      boxSizing: 'border-box',
    }
  }}
>
  {/* Drawer content */}
</Drawer>
```

### PaperProps (Deprecated in v6 - Use slotProps)
```jsx
// v5 style (deprecated in v6)
<Drawer
  PaperProps={{
    sx: {
      backgroundColor: '#fafafa',
      width: 300,
    }
  }}
>
  {/* Drawer content */}
</Drawer>

// v6 style (current)
<Drawer
  slotProps={{
    paper: {
      sx: {
        backgroundColor: '#fafafa',
        width: 300,
      }
    }
  }}
>
  {/* Drawer content */}
</Drawer>
```

### Styled Components API
```jsx
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 280,
  }
}));

function CustomStyledDrawer() {
  return (
    <StyledDrawer
      anchor="left"
      open={open}
      onClose={handleClose}
    >
      {/* Content */}
    </StyledDrawer>
  );
}
```

### Theme-Level Customization
```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fafafa',
          borderRight: '1px solid #e0e0e0',
        },
        paperAnchorLeft: {
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        }
      },
      defaultProps: {
        elevation: 1,
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* All drawers will use these styles */}
    </ThemeProvider>
  );
}
```

### CSS Classes for Customization
**Drawer CSS classes**:
- `.MuiDrawer-root` - Root element
- `.MuiDrawer-paper` - Paper component (drawer surface)
- `.MuiDrawer-paperAnchorLeft` - Applied when anchor is left
- `.MuiDrawer-paperAnchorRight` - Applied when anchor is right
- `.MuiDrawer-paperAnchorTop` - Applied when anchor is top
- `.MuiDrawer-paperAnchorBottom` - Applied when anchor is bottom
- `.MuiDrawer-docked` - Applied for permanent/persistent variants
- `.MuiDrawer-modal` - Applied for temporary variant

---

## 11. Accessibility

### ARIA Attributes
```jsx
<Button
  id="drawer-toggle"
  aria-haspopup="dialog"
  aria-expanded={open}
  onClick={() => setOpen(true)}
>
  Menu
</Button>

<Drawer
  anchor="left"
  open={open}
  onClose={() => setOpen(false)}
  aria-labelledby="drawer-toggle"
  role="presentation"  // Or role="dialog" if drawer is modal
>
  {/* Content */}
</Drawer>
```

### Keyboard Navigation
**Supported Keys**:
- **Escape** - Close drawer (if temporary variant)
- **Tab** - Navigate through drawer content
- **Shift+Tab** - Reverse tab navigation
- **Enter/Space** - Activate buttons/links

### Focus Management
```jsx
function AccessibleDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        id="drawer-button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Open Menu
      </Button>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="drawer-button"
      >
        <Box
          role="presentation"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
          sx={{ width: 280 }}
        >
          {/* Drawer content with focusable elements */}
        </Box>
      </Drawer>
    </>
  );
}
```

### Screen Reader Support
- Temporary drawer is announced as dialog/modal
- Focus trap prevents tabbing outside drawer
- Backdrop indicates non-dismissible content below
- Proper heading hierarchy in drawer content

---

## 12. Advanced Patterns

### Nested Drawers
```jsx
function NestedDrawersExample() {
  const [leftOpen, setLeftOpen] = React.useState(false);
  const [rightOpen, setRightOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setLeftOpen(true)}>Open Left</Button>

      {/* Left Drawer */}
      <Drawer
        anchor="left"
        open={leftOpen}
        onClose={() => setLeftOpen(false)}
      >
        <List sx={{ width: 250 }}>
          <ListItem button onClick={() => setRightOpen(true)}>
            <ListItemText primary="Open Nested" />
          </ListItem>
        </List>
      </Drawer>

      {/* Right Drawer (nested on top of left) */}
      <Drawer
        anchor="right"
        open={rightOpen}
        onClose={() => setRightOpen(false)}
      >
        <List sx={{ width: 250 }}>
          <ListItem button onClick={() => setRightOpen(false)}>
            <ListItemText primary="Close" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
```

### Drawer with Form Content
```jsx
function DrawerWithForm() {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Settings</Button>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            User Settings
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" type="submit">
                Save
              </Button>
              <Button onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  );
}
```

### Drawer with Scroll Lock
```jsx
function DrawerWithScrollLock() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    document.body.style.overflow = 'hidden';
    setOpen(true);
  };

  const handleClose = () => {
    document.body.style.overflow = 'auto';
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Open</Button>
      <Drawer anchor="left" open={open} onClose={handleClose}>
        {/* Content */}
      </Drawer>
    </>
  );
}
```

### Drawer with Scrollable Content
```jsx
function DrawerWithScroll() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
      <Box sx={{ width: 300 }}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', flexShrink: 0 }}>
          <Typography variant="h6">Navigation</Typography>
        </Box>

        {/* Scrollable content area */}
        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          <List>
            {Array.from({ length: 20 }).map((_, i) => (
              <ListItem button key={i}>
                <ListItemText primary={`Item ${i + 1}`} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Button fullWidth>Logout</Button>
        </Box>
      </Box>
    </Drawer>
  );
}
```

---

## 13. Responsive Patterns

### Mobile-First Responsive Drawer
```jsx
function ResponsiveDrawer() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {isMobile && (
        <Button onClick={() => setOpen(true)}>Menu</Button>
      )}

      <Drawer
        anchor="left"
        open={isMobile ? open : true}
        onClose={() => setOpen(false)}
        variant={isMobile ? 'temporary' : 'permanent'}
        sx={{
          width: {
            xs: '100%',
            sm: 280,
          },
          '& .MuiDrawer-paper': {
            width: {
              xs: '100%',
              sm: 280,
            },
            boxSizing: 'border-box',
          }
        }}
      >
        {/* Drawer content */}
      </Drawer>
    </>
  );
}
```

### Tablet/Desktop Persistent Drawer
```jsx
function DesktopDrawer() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <div style={{ display: 'flex' }}>
      {isDesktop && (
        <Drawer
          anchor="left"
          variant="permanent"
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
            }
          }}
        >
          {/* Navigation */}
        </Drawer>
      )}

      <main style={{ flex: 1 }}>
        {/* Main content */}
      </main>
    </div>
  );
}
```

---

## 14. Integration Patterns

### With AppBar
```jsx
function DrawerWithAppBar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            App Title
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        {/* Navigation drawer */}
      </Drawer>
    </>
  );
}
```

### With Layout Grid
```jsx
function DrawerLayout() {
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        variant="persistent"
      >
        <Sidebar />
      </Drawer>

      <Box sx={{ flex: 1 }}>
        <AppBar />
        <Box sx={{ p: 2 }}>
          <MainContent />
        </Box>
      </Box>
    </Box>
  );
}
```

---

## 15. Best Practices

### Design Guidelines

**When to Use Drawer**:
- Primary or secondary navigation
- Filters or sorting options
- Settings panels
- Additional actions menu
- Off-canvas content that doesn't fit inline

**When NOT to Use Drawer**:
- Critical content that must always be visible (use sidebar)
- Modal dialogs (use Dialog instead)
- Dropdown menus (use Menu component)

**Drawer Width Guidelines**:
- Mobile: Full width (or up to 80% for narrower variant)
- Tablet: 280-320px
- Desktop: 280-360px

**Content Organization**:
- Header: Branding, close button, title
- Body: Navigation list, filters, content
- Footer: Additional actions, logout

### Performance Considerations

**Conditional Rendering**:
```jsx
// Good: Only render drawer when open (on mobile)
{isMobile && (
  <Drawer anchor="left" open={open} onClose={handleClose}>
    {/* Content */}
  </Drawer>
)}

// Also good: Always render but toggle visibility
<Drawer
  anchor="left"
  open={open}
  onClose={handleClose}
  variant="temporary"
>
  {/* Content always in DOM, just hidden */}
</Drawer>
```

**Large Content Lists**:
```jsx
// Use virtualization for very long lists
import { FixedSizeList } from 'react-window';

<Drawer anchor="left" open={open} onClose={handleClose}>
  <FixedSizeList
    height={600}
    itemCount={1000}
    itemSize={48}
    width="100%"
  >
    {({ index, style }) => (
      <ListItem style={style} button>
        <ListItemText primary={`Item ${index}`} />
      </ListItem>
    )}
  </FixedSizeList>
</Drawer>
```

### Common Patterns

**Auto-close After Navigation**:
```jsx
const handleNavigate = (path) => {
  navigate(path);
  setOpen(false);  // Close drawer after navigation
};
```

**Preventing Unintended Closes**:
```jsx
const handleDrawerClick = (e) => {
  if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
    return;  // Don't close on Tab key
  }
};
```

---

## 16. Comparison Notes - Material Design Approach

### Unique Material Design Characteristics

**Elevation System**:
- Material Design uses elevation (shadow depth) for depth hierarchy
- Default elevation is 16 for drawers
- Can be customized via `elevation` prop
- Drawer floats above other content

**Slide Animation**:
- Drawers use Slide transition component
- Smooth animation from screen edge
- Configurable duration and direction
- Creates visual connection to trigger

**Backdrop Behavior**:
- Temporary variant includes scrim/backdrop
- Backdrop is interactive (click to close)
- Can be customized or hidden

**Variant Architecture**:
- Material Design defines three drawer types
- Each serves different layout needs
- Permanent/persistent integrate into layout
- Temporary overlays entire content

### Differences from Other Frameworks

**vs Bootstrap**:
- MUI uses Material Design (3+), Bootstrap uses Bootstrap design
- MUI: Elevation shadows vs Bootstrap: Border-based styling
- MUI: Semantic variants vs Bootstrap: CSS classes
- MUI: Better accessibility defaults

**vs Chakra UI**:
- Similar component structure
- MUI has Material Design specific patterns
- Chakra has more flexible styling system
- MUI integrates deeper with theme system

**vs Ant Design**:
- Ant uses "Drawer" terminology (same)
- MUI focuses on Material Design patterns
- Ant has different elevation/shadow approach
- Both have good accessibility support

---

## 17. Additional Resources

### Official Documentation
- React Drawer: https://mui.com/material-ui/react-drawer/
- Drawer API: https://mui.com/material-ui/api/drawer/
- SwipeableDrawer API: https://mui.com/material-ui/api/swipeable-drawer/

### Material Design Specifications
- Drawer design guidelines: https://m3.material.io/components/navigation-drawer/overview
- Material Design 3: https://m3.material.io/

### Related Components
- AppBar: https://mui.com/material-ui/react-app-bar/
- List: https://mui.com/material-ui/react-list/
- Modal: https://mui.com/material-ui/react-modal/
- Popover: https://mui.com/material-ui/react-popover/

---

## Summary

MUI Drawer is a comprehensive, Material Design-compliant off-canvas navigation component that provides:

- **Three variants**: Temporary (overlay), Persistent (with backdrop), Permanent (always visible)
- **Flexible positioning**: Left, right, top, or bottom placement
- **SwipeableDrawer**: Touch-optimized mobile variant with swipe gestures
- **Responsive sizing**: Fixed or responsive width/height
- **Rich composition**: Works with List, ListItem, Icons, and custom content
- **Multiple styling approaches**: sx prop, styled components, theme customization
- **Full accessibility**: ARIA support, keyboard navigation, focus management
- **Smooth animations**: Configurable enter/exit transitions
- **Material Design integration**: Elevation, ripples, and design system alignment

The component is production-ready and suitable for navigation menus, filters, settings panels, and other off-canvas content across desktop, tablet, and mobile devices.
