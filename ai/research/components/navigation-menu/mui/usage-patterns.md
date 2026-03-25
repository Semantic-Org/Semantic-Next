# MUI - Navigation Menu Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mui.com/material-ui/react-app-bar/
Status: ✅ Working
Version: Material UI v5+ (Current)
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - Excellent documentation with interactive examples, extensive prop references, API documentation, theming guidance, and accessibility considerations. Includes TypeScript types and detailed customization patterns through Toolbar and related components.

## Component Definition
- **Core purpose**: The AppBar is a Material Design-compliant header navigation component that sits at the top of a page or application, providing a fixed container for brand identity, primary navigation, search, and user actions.
- **Mental model**: A flexible header container that uses Toolbar to manage content layout, combining brand/logo, navigation links, search, and utility actions in a responsive, accessible hierarchy.
- **Semantic meaning**: Communicates the top-level navigation context of the application, establishes brand identity, and provides quick access to primary actions and user controls. The position and elevation signal importance as the primary navigation element.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Logo/Brand | ✅ | Composed | Via Typography or custom component; typically using `sx={{ flexGrow: 1 }}` to reserve space |
| Navigation links | ✅ | Composed | Via Button components or custom Link elements as children in Toolbar |
| Search integration | ✅ | Composed | Via styled SearchIcon with InputBase; requires custom component creation via `styled()` |
| User menu/avatar | ✅ | Composed | Via IconButton with Menu dropdown; Avatar component for user profile |
| Action buttons | ✅ | Composed | Via Button or IconButton components positioned in Toolbar |
| Typography labels | ✅ | Composed | Via Typography component with semantic variants |
| Icons | ✅ | Native | Via @mui/icons-material package; MenuIcon, SearchIcon, etc. |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal navigation | ✅ | Composed | Natural default; Toolbar provides row layout via Flexbox |
| Vertical navigation | ❌ | CSS-only | AppBar defaults to horizontal; vertical drawer handled separately |
| Nested menus | ✅ | Composed | Via Menu component with nested MenuItem children for dropdowns |
| Mega menu | ✅ | Composed | Achievable via custom Box components with grid layout inside Menu |
| Responsive hamburger | ✅ | Composed | IconButton with MenuIcon; display hidden on larger breakpoints via `sx={{ display: { xs: "block", md: "none" } }}` |
| Drawer integration | ✅ | Composed | AppBar works with Drawer component for side navigation on mobile |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active/Current link | ✅ | Composed | Manual management via custom state or router library; highlighting via Button color prop |
| Hover states | ✅ | Native | Automatic via Button and IconButton components; controllable via theme |
| Disabled links | ✅ | Composed | Via Button `disabled` prop |
| Mobile menu toggle | ✅ | Composed | IconButton with MenuIcon triggers Drawer or Menu component |
| Fixed positioning | ✅ | Native | `position="fixed"` keeps AppBar at top while content scrolls |
| Sticky positioning | ✅ | Native | `position="sticky"` (CSS-based, not exclusive to AppBar) |
| Scroll behavior | ✅ | Composed | Requires custom implementation with scroll event listeners |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Position options | ✅ | Native | `position="static"` (default), `"fixed"`, `"absolute"`, `"relative"`, `"sticky"` |
| Color options | ✅ | Native | `color="primary"` (default), `"secondary"`, `"inherit"`, `"default"`, or custom theme colors |
| Elevation control | ✅ | Native | `elevation` prop (0-24); controls shadow depth via Material elevation system |
| Responsive visibility | ✅ | Composed | Via `sx` prop with breakpoint arrays: `sx={{ display: { xs: "none", md: "flex" } }}` |
| Background effects | ✅ | Native | Via `sx` prop; Material Design supports `backgroundColor`, `backdropFilter` for glass effect |
| Enable dark mode color | ✅ | Native | `enableColorOnDark` prop applies color to AppBar in dark theme |

## Code Examples

### Basic Navigation Bar
```jsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function BasicAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MyApp
        </Typography>
        <Button color="inherit">Sign Up</Button>
        <Button color="inherit">Sign In</Button>
      </Toolbar>
    </AppBar>
  );
}
```

### AppBar with Menu Icon and Logout Button
```jsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function MenuAppBar() {
  return (
    <AppBar>
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
          Geeksforgeeks
        </Typography>
        <Button color="inherit">Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
```

### Responsive Navigation with Hidden Menu
```jsx
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function ResponsiveAppBar() {
  const [auth, setAuth] = React.useState(true);

  return (
    <Box sx={{ flexGrow: 1 }}>
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
            Geeksforgeeks
          </Typography>
          {auth && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              <Typography>Contact US</Typography>
              <Typography>About US</Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
```

### AppBar with Search Bar
```jsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  marginLeft: theme.spacing(1),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
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

export default function SearchAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Search App
        </Typography>
        <SearchContainer>
          <SearchIcon />
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </SearchContainer>
      </Toolbar>
    </AppBar>
  );
}
```

### AppBar with User Menu Dropdown
```jsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import React from 'react';

export default function UserMenuAppBar() {
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
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          User Menu
        </Typography>
        <IconButton
          size="large"
          onClick={handleMenu}
          color="inherit"
        >
          <Avatar>JD</Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
```

### AppBar with Multiple Navigation Sections
```jsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

export default function FullAppBar() {
  return (
    <AppBar position="static" color="primary" elevation={4}>
      <Toolbar>
        {/* Brand/Logo */}
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mr: 3 }}>
          AppName
        </Typography>

        {/* Primary Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, flexGrow: 1 }}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Products</Button>
          <Button color="inherit">Services</Button>
          <Button color="inherit">About</Button>
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton color="inherit" aria-label="notifications">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="settings">
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
```

### AppBar with Different Positions
```jsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function PositionAppBar() {
  return (
    <>
      {/* Static position (default, scrolls with content) */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Static Position</Typography>
        </Toolbar>
      </AppBar>

      {/* Fixed position (stays at top, scrollable content flows under) */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Fixed Position</Typography>
        </Toolbar>
      </AppBar>

      {/* Sticky position (CSS-based, stays at top during scroll in viewport) */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">Sticky Position</Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
```

### Themed AppBar with Custom Colors
```jsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function ThemedAppBar() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Themed App
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Secondary Color
          </Typography>
          <Button color="inherit">Signup</Button>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
```

[View Live Examples](https://mui.com/material-ui/react-app-bar/) *(Interactive examples available on MUI documentation site)*

## Notable Features

### 1. Toolbar Component Integration
The Toolbar component is essential for proper AppBar layout management. It provides:
- Automatic padding and spacing based on Material Design specs
- Built-in flex layout for horizontal alignment
- Responsive height adjustments
- Handles icon button sizing conventions (48px minimum touch target)

### 2. Flexible Content Positioning
The pattern of using `sx={{ flexGrow: 1 }}` on Typography is a common technique to:
- Push subsequent elements to the right side of the AppBar
- Create left-aligned branding with right-aligned actions
- Implement multi-section layouts without manual flex container creation

### 3. Responsive Breakpoint System
Material UI provides responsive utilities via `sx` prop with breakpoints:
- `xs`: Extra small (default)
- `sm`: Small
- `md`: Medium
- `lg`: Large
- `xl`: Extra large
Used to hide/show navigation elements across device sizes (e.g., hamburger on mobile, nav links on desktop)

### 4. Position Flexibility
AppBar supports multiple positioning strategies:
- `static`: Scrolls with page (default)
- `fixed`: Stays at top, content flows behind (may need top padding on body)
- `absolute/relative`: For specific layout contexts
- `sticky`: CSS-based positioning (stays visible during scroll within viewport)

### 5. Icon Button Conventions
MUI enforces Material Design touch target minimums:
- `size="large"` for menu icons (48px)
- `edge="start"` removes left margin for first button
- `aria-label` for accessibility on icon-only buttons
- Ripple effect automatically applied

### 6. Menu Integration
AppBar commonly integrates Menu component for:
- User profile dropdowns
- Multi-level navigation
- Mega menu patterns
- Mobile navigation drawers

### 7. Color System Integration
AppBar inherits Material Design color system:
- `color="primary"` (brand color, default)
- `color="secondary"` (accent color)
- `color="inherit"` (inherits parent text color)
- `enableColorOnDark` applies color in dark theme mode

### 8. Elevation and Shadows
Default elevation of 4 provides visual separation. Controllable via `elevation` prop (0-24 scale), with higher numbers creating stronger shadows for increased visual hierarchy.

### 9. Accessibility Features
- Semantic HTML with Toolbar managing layout
- Icon buttons include `aria-label` attributes
- Menu components handle focus management
- Keyboard navigation fully supported
- Color contrast compliance with theme system

### 10. Custom Styling with sx Prop
The `sx` prop enables inline Material Design system styling:
- Theme-aware spacing via `theme.spacing()`
- Responsive arrays for breakpoint-based styling
- Direct access to theme variables
- Pseudo-selector support for hover/focus states

## Research Notes

### Framework Approach
MUI takes a **composition-first** approach where:
- AppBar is a container component providing positioning and base styling
- Toolbar manages internal layout and spacing
- Content is composed using Button, IconButton, Typography, Menu, and other MUI components
- Heavy use of theme system for consistency and customization
- Strictly follows Material Design specifications

### API Design Philosophy
- **Separation of concerns**: AppBar handles positioning/styling, Toolbar handles layout
- **Prop-driven configuration**: Most patterns available via dedicated props
- **Theme integration**: Heavy reliance on Material Design theme system
- **Composition over monolithic components**: Encourages combining smaller, focused components
- **Accessibility-first**: ARIA attributes and semantic HTML built-in

### Component Architecture
AppBar is built on Paper component base, which means:
- Inherits all Paper props (elevation, sx, classes, etc.)
- Full theme support through MUI's theming system
- Shadow and elevation control
- Background color and styling capabilities

### Common Implementation Patterns

**Pattern 1: Brand + Navigation + Actions**
```
[Logo] [Nav Links] [User Menu]
```
Uses `flexGrow: 1` on logo to push navigation right, then standard flex layout for actions

**Pattern 2: Menu Icon + Title + Search**
```
[Menu Icon] [Title] [Search Bar]
```
Menu triggers Drawer or Menu for mobile navigation

**Pattern 3: Multi-level Navigation**
```
[Logo] [Main Nav] [Dropdown] [User Actions]
```
Uses Menu component with MenuItem children for dropdowns

**Pattern 4: Responsive Desktop/Mobile**
- Desktop: Full navigation links visible
- Mobile: Hamburger menu triggers Drawer with full navigation

### Material Design Adherence
MUI's AppBar strictly follows Material Design 3 specifications:
- 64px height on desktop (48px base + padding)
- 56px height on mobile
- Automatic elevation creating shadow
- Color from theme palette
- Ripple effect on interactive elements
- Standard Material spacing scale

### State Management Considerations
- **Router integration**: Manual active link styling; use router library's Link component with `component` prop
- **Menu state**: Use React useState for Menu anchorEl and open state
- **Mobile toggle**: State for Drawer open/close
- **Search**: Controlled input with state management
- **Dark mode**: Handled automatically by theme system with `enableColorOnDark`

### Customization Layers
1. **Theme-level**: Global AppBar overrides via theme configuration
2. **Component-level**: `sx` prop for one-off styling
3. **Composition**: Custom components as children of AppBar/Toolbar
4. **CSS class overrides**: `classes` prop for style targeting

### Performance Considerations
- Toolbar is lightweight, used mainly for layout
- Menu component lazy-renders content
- No significant re-render overhead with responsive breakpoints
- Large lists in dropdowns should use virtualization

### Accessibility Compliance
- Semantic HTML structure maintained
- ARIA labels required for icon-only buttons
- Focus management via Menu component
- Keyboard navigation fully supported
- Color contrast compliance through theme
- Touch targets meet 48px minimum (Material Design standard)

## Comparison Insights with Other Frameworks

### Strengths of MUI AppBar
1. **Material Design compliance**: Strict adherence to design specifications
2. **Composition flexibility**: Build complex headers from simple components
3. **Theme integration**: Deep integration with Material Design system
4. **Accessibility built-in**: ARIA attributes and semantic HTML automatic
5. **Responsive utilities**: Clean breakpoint system via sx prop
6. **Icon ecosystem**: Comprehensive @mui/icons-material library
7. **Theming power**: Theme-based customization at scale

### Potential Limitations
1. **More boilerplate**: Composition requires more code than monolithic "navbar" components
2. **Material Design lock-in**: Hard to deviate from Material aesthetic
3. **Toolbar required**: Always need Toolbar component for proper spacing
4. **Position management**: Fixed position may need body top padding workarounds
5. **Manual active links**: No built-in active link detection without router integration

### Notable Implementation Differences
- **vs. Chakra UI**: MUI requires explicit Toolbar; Chakra has flatter component hierarchy
- **vs. Bootstrap**: MUI theme system more powerful; Bootstrap uses CSS utilities
- **vs. Tailwind**: MUI theme-based; Tailwind utility-first
- **vs. Mantine**: MUI more Material Design focused; Mantine more flexible

### Patterns to Consider for Semantic UI

#### Adopt These Patterns
1. **Toolbar component**: Dedicated layout component for AppBar children improves consistency
2. **Composition over monolithic**: Small, focused components composed together
3. **Theme integration**: System-wide theming for consistency
4. **Semantic colors**: Named palette (primary, secondary, error, success, warning, info)
5. **Responsive breakpoints**: Clean array-based responsive syntax
6. **Icon prop conventions**: Dedicated props for icon placement
7. **Elevation system**: Numerical elevation levels for shadows

#### Improve Upon
1. **Built-in responsive layout**: Detect viewport automatically for common patterns
2. **Simplified positioning**: Smarter defaults for fixed/sticky position behavior
3. **Active link detection**: Router library integration or built-in detection
4. **Less boilerplate**: Combine AppBar + Toolbar into single component
5. **Mobile-first defaults**: Hamburger menu pattern out of the box
6. **Search integration**: Built-in search bar component
7. **Dropdown helpers**: More helper components for common menu patterns

## Implementation Details Worth Noting

### Prop Interface
```typescript
interface AppBarProps {
  position?: 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';
  color?: 'inherit' | 'primary' | 'secondary' | 'default' | 'error' | 'warning' | 'info' | 'success';
  elevation?: number; // 0-24
  enableColorOnDark?: boolean;
  sx?: SxProps;
  classes?: Record<string, string>;
  children?: ReactNode;
  // Plus all Paper component props
}
```

### Toolbar Spacing Rules
```typescript
interface ToolbarProps {
  disableGutters?: boolean; // Removes default horizontal padding (16px desktop, 8px mobile)
  variant?: 'regular' | 'dense'; // dense reduces height for compact layouts
  sx?: SxProps;
  children?: ReactNode;
}
```

### Common sx Patterns
```jsx
// Responsive display
sx={{ display: { xs: "none", md: "flex" } }}

// Flexible spacer
sx={{ flexGrow: 1 }}

// Spacing utilities
sx={{ mr: 2, ml: 1 }} // margin-right, margin-left

// Responsive spacing
sx={{ px: { xs: 1, md: 3 } }} // padding-x: responsive

// Custom colors
sx={{ backgroundColor: theme.palette.primary.main }}
```

### Automatic Component Sizes
- AppBar height: 64px (desktop), 56px (mobile)
- Toolbar height: 64px (desktop), 56px (mobile)
- Icon button size: 48px minimum (Material Design)
- Menu item height: 48px
- Typography variants: h6 commonly used in AppBar (24px font size)
