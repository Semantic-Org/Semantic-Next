# MUI (Material-UI) - Tabs Usage Patterns

## Component URLs
- Main: https://mui.com/material-ui/react-tabs/
- Tabs API: https://mui.com/material-ui/api/tabs/
- Tab API: https://mui.com/material-ui/api/tab/
- TabPanel API: https://mui.com/material-ui/api/tab-panel/
- TabContext API: https://mui.com/material-ui/api/tab-context/
- Version: Current (v5+/v6)
- Last Verified: 2025-11-04

## Documentation Quality
Excellent - MUI provides comprehensive documentation with interactive demos, complete API reference, code examples, accessibility guidance, and Material Design specifications. Includes lab components (`@mui/lab`) for advanced patterns like scrollable tabs.

---

## 1. Component Overview

The MUI Tabs component is Material Design's implementation of tabbed content organization. Tabs make it easy to explore and switch between different views, organizing and allowing navigation between groups of content that are related and at the same level of hierarchy.

**Key Philosophy**: Tabs are used for content organization, not navigation. They show alternative views of the same data or related content within the same context (like GitHub's PR tabs: "Conversations", "Checks", "Files Changed").

**Component Hierarchy**:
```
Tabs (container, manages active tab)
├── Tab (individual tab button)
├── Tab
├── Tab
└── TabPanel (content container)
```

**Important Distinction**: MUI separates visual tabs (the buttons) from tab content (panels). This is different from some frameworks that couple them together.

---

## 2. Basic Usage

### Import
```jsx
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

// For advanced patterns
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';

// Material icons for labels
import { AccountBox, Lock, Phone } from '@mui/icons-material';
```

### Simple Tabs (Basic Pattern)

The most straightforward implementation uses `Tabs` with `Tab` children and manages state with `useState`:

```jsx
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function SimpleTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Tab 1" />
        <Tab label="Tab 2" />
        <Tab label="Tab 3" />
      </Tabs>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {value === 0 && <Typography>Content for Tab 1</Typography>}
        {value === 1 && <Typography>Content for Tab 2</Typography>}
        {value === 2 && <Typography>Content for Tab 3</Typography>}
      </Box>
    </Box>
  );
}
```

**Key Pattern Notes**:
- `value` is a numeric index (0, 1, 2, etc.) representing the active tab
- `handleChange` receives both the event and the new value
- Tab content is rendered conditionally based on the value
- Tabs can use either simple labels or custom content

### Tabs with TabPanel (Recommended for Complex Content)

For more complex layouts, use `TabPanel` from the lab package:

```jsx
import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';

function TabsWithPanels() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Item One" value="1" />
          <Tab label="Item Two" value="2" />
          <Tab label="Item Three" value="3" />
        </Tabs>
      </Box>

      <TabPanel value="1">
        <Typography>Item One Panel Content</Typography>
      </TabPanel>
      <TabPanel value="2">
        <Typography>Item Two Panel Content</Typography>
      </TabPanel>
      <TabPanel value="3">
        <Typography>Item Three Panel Content</Typography>
      </TabPanel>
    </TabContext>
  );
}
```

**Key Differences from Simple Pattern**:
- `TabContext` wraps both Tabs and TabPanels
- Values can be strings (more semantic) or numbers
- Each TabPanel matches a Tab's value
- Cleaner code for complex content
- TabPanel handles the conditional rendering

---

## 3. Props/API

### Core Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| string` | `0` | The value of the currently selected tab. For controlled component. |
| `onChange` | `function` | - | Callback fired when the tab selection changes. Signature: `(event: SyntheticEvent, value: any) => void` |
| `children` | `node` | - | The content of the Tabs component, typically Tab components. |
| `variant` | `'standard' \| 'scrollable'` | `'standard'` | Determines how tabs are displayed. 'standard' = all visible, 'scrollable' = horizontal scroll on overflow. |
| `scrollButtons` | `'auto' \| true \| false` | `'auto'` | When variant is 'scrollable', determines if scroll buttons appear. 'auto' shows only when needed. |
| `scrollButtonsHideMobile` | `boolean` | `false` | If `true`, scroll buttons are hidden on mobile. Only relevant for scrollable variant. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The tabs orientation (direction of scrolling). Vertical tabs stack top-to-bottom. |
| `centered` | `boolean` | `false` | If `true`, tabs are centered within the container. Doesn't work with `variant="scrollable"`. |
| `TabIndicatorProps` | `object` | - | Props applied to the tab indicator (the underline/highlight). Can customize color, style, etc. |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for custom styles with theme access. |
| `classes` | `object` | - | Override styles. Supports: `root`, `scroller`, `flexContainer`, `indicator`, `scrollButtons`, `scrollButtonsHideMobile`, `fixed`, `fullWidth`, `vertical`. |
| `indicatorColor` | `'inherit' \| 'primary' \| 'secondary'` | `'primary'` | Determines the color of the indicator (underline). |
| `textColor` | `'inherit' \| 'primary' \| 'secondary' \| 'standard'` | `'inherit'` | Determines the color of the tab text. |
| `visibleScrollButtonCount` | `number` | `2` | When variant is 'scrollable', number of tabs to show before hiding scroll buttons (auto mode). |
| `allowScrollButtonsMobile` | `boolean` | `false` | If `true`, scroll buttons are allowed on mobile. |
| `selectionFollowsFocus` | `boolean` | `false` | If `true`, keyboard focus on a tab automatically selects it. Otherwise, you must press Enter/Space. |
| `aria-label` | `string` | - | Provides an accessible label for the tab list. |
| `aria-labelledby` | `string` | - | ID of element that labels the tab list. |

**Inherited from HTMLAttributes**: Various standard HTML attributes like `id`, `className`, `style`, etc.

### Tab Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| node` | - | The label for the tab. Can be text or any React element (icon, avatar, etc.). |
| `value` | `any` | - | The value associated with this tab. Should be unique within the parent Tabs component. If not provided, uses zero-based index. |
| `icon` | `elementType` | - | Icon element to display. Usually used with `iconPosition` prop. |
| `iconPosition` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'top'` | Position of the icon relative to the label. 'start'/'end' useful for RTL. |
| `disabled` | `boolean` | `false` | If `true`, the tab is disabled and cannot be selected. |
| `selected` | `boolean` | `false` | If `true`, the tab is highlighted as selected. Usually managed by parent Tabs component. |
| `onClick` | `function` | - | Click handler for the tab. Signature: `(event: React.MouseEvent) => void`. Usually not needed (Tabs handles it). |
| `component` | `elementType` | `'div'` | The component used for the root node. Can be 'button', 'a', or custom component. |
| `href` | `string` | - | If component is 'a', the URL to link to. Enables Tab as a link. |
| `wrapped` | `boolean` | `false` | If `true`, tab text will wrap. Useful for longer labels. |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for custom styles. |
| `classes` | `object` | - | Override styles. Supports: `root`, `selected`, `disabled`, `fullWidth`, `textColorInherit`, `textColorPrimary`, `textColorSecondary`, `minHeight`, `minWidth`. |
| `fullWidth` | `boolean` | `false` | If `true`, the tab takes up the full width of the Tabs container (divides equally). |

### TabPanel Props (from @mui/lab)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any` | - | The value of the tab this panel corresponds to. Must match a Tab's value. |
| `children` | `node` | - | The content of the tab panel. |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for custom styles. |
| `classes` | `object` | - | Override styles. Supports: `root`. |
| `component` | `elementType` | `'div'` | The component used for the root node. |

### TabContext Props (from @mui/lab)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any` | - | The currently active tab value. Usually passed from parent state. |
| `children` | `node` | - | Child elements (Tabs and TabPanels). |

---

## 4. Variants & Patterns

### 1. Scrollable Tabs (Overflow Handling)

When tabs exceed the available width, use `variant="scrollable"`:

```jsx
function ScrollableTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabLabels = [
    'Page One',
    'Page Two',
    'Page Three',
    'Page Four',
    'Page Five',
    'Page Six',
    'Page Seven',
    'Page Eight',
    'Page Nine',
    'Page Ten',
  ];

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="scrollable auto tabs example"
    >
      {tabLabels.map((label, index) => (
        <Tab key={index} label={label} />
      ))}
    </Tabs>
  );
}
```

**Scrollable Props**:
- `variant="scrollable"` - Enables scroll behavior
- `scrollButtons="auto"` - Shows arrow buttons only when needed
- `scrollButtons={true}` - Always show arrow buttons
- `scrollButtons={false}` - Hide arrow buttons
- `orientation="vertical"` - Vertical scrolling (less common)

**User Interaction**:
- Click arrow buttons to scroll
- Use horizontal mouse wheel to scroll
- Keyboard arrow keys navigate between visible tabs

### 2. Centered Tabs

For a more balanced layout with fewer tabs:

```jsx
function CenteredTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <Tabs
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
      centered
    >
      <Tab label="Item One" />
      <Tab label="Item Two" />
      <Tab label="Item Three" />
    </Tabs>
  );
}
```

**Centered Behavior**:
- Tabs centered horizontally within container
- Cannot be used with `variant="scrollable"`
- Best with 3-5 tabs
- Great for top-level navigation

### 3. Full Width Tabs

Each tab takes equal space:

```jsx
function FullWidthTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <Tabs
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
      variant="fullWidth"
      sx={{ width: '100%' }}
    >
      <Tab label="Item One" />
      <Tab label="Item Two" />
      <Tab label="Item Three" />
    </Tabs>
  );
}
```

**Note**: "fullWidth" variant is achieved by combining properties, not a specific prop value. Better approach:

```jsx
<Tabs value={value} onChange={handleChange}>
  <Tab label="Item One" sx={{ flex: 1 }} />
  <Tab label="Item Two" sx={{ flex: 1 }} />
  <Tab label="Item Three" sx={{ flex: 1 }} />
</Tabs>
```

Or for all tabs:
```jsx
<Tabs
  value={value}
  onChange={handleChange}
  sx={{ '& .MuiTab-root': { flex: 1 } }}
>
  <Tab label="Item One" />
  <Tab label="Item Two" />
  <Tab label="Item Three" />
</Tabs>
```

### 4. Tabs with Icons

Icons can be displayed above, below, or beside labels:

```jsx
import { Phone, Favorite, Person } from '@mui/icons-material';

function IconTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
      <Tab icon={<Phone />} label="Recents" />
      <Tab icon={<Favorite />} label="Favorites" />
      <Tab icon={<Person />} label="Contacts" />
    </Tabs>
  );
}
```

**Icon Positioning**:
```jsx
// Icon on top (default)
<Tab icon={<Phone />} label="Recents" iconPosition="top" />

// Icon on bottom
<Tab icon={<Phone />} label="Recents" iconPosition="bottom" />

// Icon on left (for RTL, use "start")
<Tab icon={<Phone />} label="Recents" iconPosition="start" />

// Icon on right (for RTL, use "end")
<Tab icon={<Phone />} label="Recents" iconPosition="end" />

// Icon only (no label)
<Tab icon={<Phone />} aria-label="phone" />
```

**Best Practices**:
- Use icons sparingly and for clarity
- Combine with labels for better accessibility
- Ensure icons are 24px or smaller (use Material-UI icons)
- Test with screen readers if icon-only

### 5. Icon-Only Tabs

For compact interfaces:

```jsx
import { Settings, Help, EmojiEvents } from '@mui/icons-material';

function IconOnlyTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <Tabs
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
      aria-label="icon tabs example"
    >
      <Tab icon={<Settings />} aria-label="settings" />
      <Tab icon={<Help />} aria-label="help" />
      <Tab icon={<EmojiEvents />} aria-label="awards" />
    </Tabs>
  );
}
```

**Important**: Include `aria-label` on each Tab for accessibility.

### 6. Vertical Tabs

Tabs stacked vertically:

```jsx
function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ display: 'flex' }}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        sx={{ borderRight: 1, borderColor: 'divider', minWidth: 100 }}
      >
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
        <Tab label="Item Four" />
      </Tabs>

      <Box sx={{ flex: 1, p: 3 }}>
        {value === 0 && <Typography>Content One</Typography>}
        {value === 1 && <Typography>Content Two</Typography>}
        {value === 2 && <Typography>Content Three</Typography>}
        {value === 3 && <Typography>Content Four</Typography>}
      </Box>
    </Box>
  );
}
```

**Vertical Layout**:
- `orientation="vertical"` rotates tabs 90 degrees
- Tabs typically on left, content on right
- Use flexbox for layout
- Good for navigation-heavy interfaces

### 7. Disabled Tabs

Prevent selection of specific tabs:

```jsx
function DisabledTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
      <Tab label="Item One" />
      <Tab label="Item Two (Disabled)" disabled />
      <Tab label="Item Three" />
    </Tabs>
  );
}
```

**Visual State**:
- Reduced opacity (typically 50%)
- Cursor: not-allowed
- Cannot be clicked
- Remain visible (provides context)

### 8. Custom Indicator

Customize the tab indicator (underline/highlight):

```jsx
function CustomIndicatorTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <Tabs
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
      TabIndicatorProps={{
        sx: {
          backgroundColor: '#FF6B6B',
          height: 4,
          borderRadius: '2px 2px 0 0',
        }
      }}
    >
      <Tab label="Item One" />
      <Tab label="Item Two" />
      <Tab label="Item Three" />
    </Tabs>
  );
}
```

**Indicator Customization Options**:
- Color (via `sx`)
- Height
- Border radius
- Animation (duration, easing)

### 9. Colored Tabs

Different color schemes:

```jsx
function ColoredTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <>
      {/* Primary indicator (default) */}
      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Item One" />
        <Tab label="Item Two" />
      </Tabs>

      {/* Secondary indicator */}
      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        indicatorColor="secondary"
        textColor="secondary"
      >
        <Tab label="Item One" />
        <Tab label="Item Two" />
      </Tabs>

      {/* Inherit color */}
      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        sx={{
          color: '#FF6B6B',
          '& .MuiTabs-indicator': { backgroundColor: '#FF6B6B' }
        }}
      >
        <Tab label="Item One" />
        <Tab label="Item Two" />
      </Tabs>
    </>
  );
}
```

### 10. Wrapped Tab Labels

For longer text that should wrap:

```jsx
function WrappedTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <Tabs
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
      variant="scrollable"
      scrollButtons="auto"
    >
      <Tab label="New Arrivals in the Collection" wrapped />
      <Tab label="This Tab is Very Long and Should Wrap" wrapped />
      <Tab label="Short" wrapped />
    </Tabs>
  );
}
```

**Wrapped Behavior**:
- Text wraps to multiple lines
- Tab height increases
- Good for dynamic/internationalized content
- More space required

### 11. Tab with Badge

Using Badge component with tabs:

```jsx
import Badge from '@mui/material/Badge';
import { Mail, Person, Settings } from '@mui/icons-material';

function TabsWithBadge() {
  const [value, setValue] = React.useState(0);

  return (
    <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
      <Tab
        icon={<Badge badgeContent={4} color="error"><Mail /></Badge>}
        label="Messages"
      />
      <Tab
        icon={<Badge badgeContent={2} color="success"><Person /></Badge>}
        label="Friends"
      />
      <Tab icon={<Settings />} label="Settings" />
    </Tabs>
  );
}
```

### 12. Navigational Tabs with Router

Integrating with React Router:

```jsx
import { Link, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function NavigationTabs() {
  const location = useLocation();

  const pathToValue = {
    '/profile': 0,
    '/settings': 1,
    '/help': 2,
  };

  const value = pathToValue[location.pathname] ?? false;

  return (
    <Tabs value={value}>
      <Tab
        label="Profile"
        component={Link}
        to="/profile"
      />
      <Tab
        label="Settings"
        component={Link}
        to="/settings"
      />
      <Tab
        label="Help"
        component={Link}
        to="/help"
      />
    </Tabs>
  );
}
```

**Router Integration**:
- Use `component` prop to render as Link
- Use `to` prop for navigation
- Track value based on current route
- Works with React Router, Next.js Link, etc.

### 13. TabPanel Alternative (Manual Content Switching)

When TabPanel from lab is not suitable:

```jsx
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

function TabPanelComponent({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function ManualTabPanels() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab id="tab-0" aria-controls="tabpanel-0" label="Item One" />
          <Tab id="tab-1" aria-controls="tabpanel-1" label="Item Two" />
          <Tab id="tab-2" aria-controls="tabpanel-2" label="Item Three" />
        </Tabs>
      </Box>

      <TabPanelComponent value={value} index={0}>
        <Typography>Content for Item One</Typography>
      </TabPanelComponent>
      <TabPanelComponent value={value} index={1}>
        <Typography>Content for Item Two</Typography>
      </TabPanelComponent>
      <TabPanelComponent value={value} index={2}>
        <Typography>Content for Item Three</Typography>
      </TabPanelComponent>
    </>
  );
}
```

---

## 5. Composition Patterns

### Core Component Hierarchy

```
Box (container)
└── Tabs (tab list container)
    ├── Tab (individual tab button)
    ├── Tab
    └── Tab

+ Separate content area:
├── TabPanel (or custom container)
│   └── Content
├── TabPanel
│   └── Content
└── TabPanel
    └── Content
```

### TabContext Pattern (Recommended for Complex Apps)

```jsx
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';

function ComplexTabbedInterface() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tab navigation"
        >
          <Tab label="Dashboard" value="1" />
          <Tab label="Analytics" value="2" />
          <Tab label="Settings" value="3" />
        </Tabs>
      </Box>

      <TabPanel value="1">
        <DashboardContent />
      </TabPanel>
      <TabPanel value="2">
        <AnalyticsContent />
      </TabPanel>
      <TabPanel value="3">
        <SettingsContent />
      </TabPanel>
    </TabContext>
  );
}
```

**Advantages**:
- Cleaner code for multiple panels
- Automatic visibility management
- Better performance (only active panel rendered)
- Built-in ARIA attributes
- Semantic structure

### Nested Tabs

Tabs within tabs (use with caution):

```jsx
function NestedTabs() {
  const [mainValue, setMainValue] = useState('1');
  const [subValue, setSubValue] = useState('a');

  return (
    <TabContext value={mainValue}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={mainValue} onChange={(e, newValue) => setMainValue(newValue)}>
          <Tab label="Section 1" value="1" />
          <Tab label="Section 2" value="2" />
        </Tabs>
      </Box>

      <TabPanel value="1">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          <Tabs
            value={subValue}
            onChange={(e, newValue) => setSubValue(newValue)}
            variant="scrollable"
          >
            <Tab label="Sub 1a" value="a" />
            <Tab label="Sub 1b" value="b" />
            <Tab label="Sub 1c" value="c" />
          </Tabs>
        </Box>

        {subValue === 'a' && <Typography>Content 1a</Typography>}
        {subValue === 'b' && <Typography>Content 1b</Typography>}
        {subValue === 'c' && <Typography>Content 1c</Typography>}
      </TabPanel>

      <TabPanel value="2">
        <Typography>Content for Section 2</Typography>
      </TabPanel>
    </TabContext>
  );
}
```

**Best Practices**:
- Limit to 2 levels (avoid 3+ nested)
- Use clear visual hierarchy
- Consider alternative UI patterns (collapsible sections, etc.)
- Test on mobile for usability

---

## 6. Styling & Theming

### Using sx Prop

```jsx
function StyledTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <Tabs
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
      sx={{
        borderBottom: 2,
        borderColor: 'divider',
        backgroundColor: 'grey.100',
        '& .MuiTab-root': {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          '&:hover': {
            backgroundColor: 'grey.200',
          },
          '&.Mui-selected': {
            color: 'primary.main',
            fontWeight: 600,
          }
        },
        '& .MuiTabs-indicator': {
          backgroundColor: 'primary.main',
          height: 3,
        }
      }}
    >
      <Tab label="Item One" />
      <Tab label="Item Two" />
      <Tab label="Item Three" />
    </Tabs>
  );
}
```

### Tab Styling

```jsx
<Tab
  label="Custom Tab"
  sx={{
    backgroundColor: '#f0f0f0',
    borderRadius: 1,
    margin: 0.5,
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
    '&.Mui-selected': {
      backgroundColor: 'primary.main',
      color: 'white',
    },
    '&.Mui-disabled': {
      opacity: 0.5,
    },
    minHeight: 48,
    minWidth: 120,
  }}
/>
```

### Styled Components API

```jsx
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const CustomTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[100],
  '& .MuiTab-root': {
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: '1rem',
    margin: theme.spacing(0, 2),
    transition: theme.transitions.create(['color', 'background-color']),
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    }
  },
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
    borderRadius: '3px 3px 0 0',
  }
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  minHeight: 50,
  minWidth: 140,
  padding: theme.spacing(1.5, 2),
}));

function StyledComponent() {
  const [value, setValue] = React.useState(0);

  return (
    <CustomTabs
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
    >
      <CustomTab label="Item One" />
      <CustomTab label="Item Two" />
      <CustomTab label="Item Three" />
    </CustomTabs>
  );
}
```

### Theme-Level Customization

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '2px solid #ddd',
        },
        indicator: {
          backgroundColor: '#ff5722',
          height: 4,
        }
      },
      defaultProps: {
        indicatorColor: 'primary',
        textColor: 'primary',
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          fontWeight: 600,
          minHeight: 48,
          '&:hover': {
            opacity: 0.7,
          }
        },
        selected: {
          fontWeight: 700,
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* All tabs will use these styles */}
    </ThemeProvider>
  );
}
```

### CSS Classes for Customization

**Tabs CSS Classes**:
- `.MuiTabs-root` - Root element
- `.MuiTabs-scroller` - Scrolling container
- `.MuiTabs-flexContainer` - Flex container for tabs
- `.MuiTabs-indicator` - The underline/indicator
- `.MuiTabs-fixed` - Fixed layout (default)
- `.MuiTabs-scrollable` - Scrollable layout
- `.MuiTabs-vertical` - Vertical orientation
- `.MuiTabs-centered` - Centered layout

**Tab CSS Classes**:
- `.MuiTab-root` - Root element
- `.MuiTab-selected` - Active tab
- `.MuiTab-disabled` - Disabled tab
- `.MuiTab-fullWidth` - Full width variant
- `.Mui-selected` - Selected state

---

## 7. Accessibility

### ARIA Attributes

**Automatic ARIA**:
- `role="tablist"` - Applied to Tabs container
- `role="tab"` - Applied to each Tab
- `role="tabpanel"` - Applied to TabPanel (from lab)
- `aria-selected="true|false"` - Indicates selected state
- `aria-disabled="true"` - When tab is disabled
- `aria-controls` - Links tab to panel
- `aria-labelledby` - Links panel to tab

**Manual ARIA for Complex Scenarios**:
```jsx
function AccessibleTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <>
      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        aria-label="navigation tabs"
        role="tablist"
      >
        <Tab
          id="tab-profile"
          aria-controls="panel-profile"
          label="Profile"
        />
        <Tab
          id="tab-settings"
          aria-controls="panel-settings"
          label="Settings"
        />
      </Tabs>

      <TabPanel
        id="panel-profile"
        role="tabpanel"
        aria-labelledby="tab-profile"
        hidden={value !== 0}
      >
        Profile Content
      </TabPanel>

      <TabPanel
        id="panel-settings"
        role="tabpanel"
        aria-labelledby="tab-settings"
        hidden={value !== 1}
      >
        Settings Content
      </TabPanel>
    </>
  );
}
```

### Keyboard Navigation

**Supported Keys**:
- **Arrow Left/Right** (Horizontal) - Navigate between tabs
- **Arrow Up/Down** (Vertical) - Navigate between tabs
- **Home** - Jump to first tab
- **End** - Jump to last tab
- **Tab** - Move focus out of tabs (to next focusable element)
- **Shift+Tab** - Move focus out of tabs (to previous element)

**Keyboard Behavior**:
- Automatic focus change or manual selection depends on `selectionFollowsFocus`
- By default, arrow keys change focus but don't select
- Press Enter/Space to select (depends on settings)
- Wrap-around navigation (circular)

**Configuration**:
```jsx
<Tabs
  value={value}
  onChange={handleChange}
  selectionFollowsFocus  // Arrow keys automatically select
>
  <Tab label="Tab 1" />
  <Tab label="Tab 2" />
</Tabs>
```

### Focus Management

```jsx
function FocusManagement() {
  const [value, setValue] = React.useState(0);
  const tabsRef = React.useRef(null);

  return (
    <>
      <button onClick={() => tabsRef.current?.focus()}>
        Focus Tabs
      </button>

      <Tabs
        ref={tabsRef}
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
      >
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>
    </>
  );
}
```

### Screen Reader Announcements

**Proper Implementation**:
```jsx
<Tabs
  value={value}
  onChange={handleChange}
  aria-label="document navigation" // Describe purpose
>
  <Tab label="Overview" />
  <Tab label="Contents" />
  <Tab label="Bibliography" />
</Tabs>
```

**Expected Announcement**:
```
"Overview, tab, 1 of 3, document navigation"
"Contents, tab, 2 of 3, selected, document navigation"
```

### Accessibility Checklist

- ✅ Tab list has `role="tablist"` and `aria-label`
- ✅ Each Tab has `role="tab"`, `aria-selected`, `aria-controls`
- ✅ Each TabPanel has `role="tabpanel"`, `aria-labelledby`, proper `id`
- ✅ Keyboard navigation works with arrow keys, Home, End
- ✅ Tab order is logical (left-to-right, top-to-bottom)
- ✅ Icon-only tabs have `aria-label`
- ✅ Disabled tabs are visually distinct and skipped in navigation
- ✅ Color is not the only indicator of state
- ✅ Focus indicator is visible and has sufficient contrast
- ✅ Content updates don't cause unexpected page scrolls

---

## 8. Best Practices

### When to Use Tabs

**Use Tabs for**:
- Organizing related content at same hierarchy level
- Switching between different views of same data
- Secondary navigation within a page/section
- Content that doesn't require linear flow
- Mobile-friendly navigation (bottom tabs)

**Don't Use Tabs for**:
- Primary page navigation (use nav bar)
- Sequential workflows (use steps/wizard)
- Comparing multiple items (use tables/grids)
- Content that benefits from simultaneous viewing (use panels)
- Very long lists of items (>10 items, use select)

### Tabs Patterns

**Tab Count**:
- Ideal: 3-5 tabs
- Acceptable: 2-7 tabs
- If more than 7, consider alternative UI (segmented control, select, navigation drawer)
- If only 2, consider alternatives (toggle button, accordion)

**Tab Labels**:
- Keep labels short (1-2 words when possible)
- Use consistent grammar (all nouns or all verbs)
- Use sentence case ("Documents" not "DOCUMENTS")
- Be specific and descriptive
- Never abbreviate without context

**Tab Content**:
- Ensure content is distinct between tabs
- Don't repeat content across tabs
- Keep related content together
- Avoid deep nesting (max 2 levels)
- Support bookmarking/permalinks when possible

**Visual Hierarchy**:
- Make active tab clearly distinct
- Use subtle hover effects
- Maintain consistent tab height
- Align content properly with tab

### Performance Optimization

```jsx
import React, { Suspense, lazy } from 'react';

const Panel1 = lazy(() => import('./Panel1'));
const Panel2 = lazy(() => import('./Panel2'));
const Panel3 = lazy(() => import('./Panel3'));

function OptimizedTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <>
      <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
        <Tab label="Panel 1" />
        <Tab label="Panel 2" />
        <Tab label="Panel 3" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        <Suspense fallback={<Skeleton variant="rectangular" />}>
          {value === 0 && <Panel1 />}
          {value === 1 && <Panel2 />}
          {value === 2 && <Panel3 />}
        </Suspense>
      </Box>
    </>
  );
}
```

**Techniques**:
- Lazy load tab content
- Use Suspense for async content
- Render only active tab (avoid DOM bloat)
- Memoize heavy components
- Use `keepMounted` sparingly

### Mobile Considerations

```jsx
function MobileFriendlyTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <Tabs
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        // Touch-friendly height
        '& .MuiTab-root': {
          minHeight: 48,
          minWidth: 80,
        },
        // Better touch targets
        '& .MuiTabs-scrollButtonsHideMobile': {
          display: { xs: 'none', sm: 'inline-flex' },
        }
      }}
    >
      <Tab label="Tab 1" />
      <Tab label="Tab 2" />
      <Tab label="Tab 3" />
    </Tabs>
  );
}
```

**Mobile Best Practices**:
- Use scrollable variant on narrow screens
- Minimum 44×44px touch targets
- Test on actual devices
- Consider bottom tab placement (easier to reach)
- Avoid icon-only tabs without labels

### Common Pitfalls

```jsx
// ❌ DON'T: Separate state for open/closed
const [open, setOpen] = useState(false);
const [value, setValue] = useState(0);
// Can get out of sync

// ✅ DO: Use value for state
const [value, setValue] = useState(0);
const open = value !== -1;

// ❌ DON'T: Render all content always
<Tabs value={value} onChange={handleChange}>
  {/* All panels rendered always */}
  {value === 0 && <Panel1 />}
  {value === 1 && <Panel2 />}
  {value === 2 && <Panel3 />}
</Tabs>

// ✅ DO: Use TabPanel for automatic management
<TabContext value={value}>
  <Tabs value={value} onChange={handleChange}>
    <Tab label="Panel 1" value="1" />
    <Tab label="Panel 2" value="2" />
    <Tab label="Panel 3" value="3" />
  </Tabs>
  <TabPanel value="1"><Panel1 /></TabPanel>
  <TabPanel value="2"><Panel2 /></TabPanel>
  <TabPanel value="3"><Panel3 /></TabPanel>
</TabContext>

// ❌ DON'T: Use tabs for navigation
<Tabs value={currentRoute}>
  <Tab label="Home" onClick={() => navigate('/')} />
  <Tab label="About" onClick={() => navigate('/about')} />
</Tabs>

// ✅ DO: Use actual nav elements or Links
<Tabs value={currentRoute} component="nav">
  <Tab component={Link} to="/" label="Home" />
  <Tab component={Link} to="/about" label="About" />
</Tabs>
```

---

## 9. Material Design Specifications

### Tab Dimensions (Material Design 3)

**Standard Tab Height**:
- Desktop: 48px
- Mobile: 56px

**Tab Width**:
- Fixed width: Typically 80-200px depending on label
- Full width: Container width ÷ number of tabs
- Scrollable: Min 80px, max 360px per tab

**Icon Sizes**:
- Icons in tabs: 24×24px
- Icon with label: 18×24px
- Icon-only: 24×24px

### Typography

**Tab Labels**:
- Font: Roboto (default Material Design font)
- Weight: 500 (medium)
- Size: 14sp (default), 16sp (on mobile)
- Case: Sentence case or lowercase
- Color: Inherit or primary/secondary

### Spacing

**Internal Padding**:
- Horizontal: 16px each side
- Vertical: 12px each side (standard), 8px (dense)
- Icon margin: 8px from text

**Gap Between Tabs**:
- No gap (tabs touch)
- Indicator connects adjacent tabs

### Colors

**Material Design 3 Token System**:
- Text: `onSurface` (default), `primary` (active)
- Indicator: `primary` (default)
- Background: `surface` (default), `surfaceVariant` (hover)
- Disabled: 38% opacity of `onSurface`

**Light Mode**:
```css
Text: rgba(0, 0, 0, 0.87)  /* 87% black */
Active: #6200ee              /* Primary blue */
Indicator: #6200ee           /* Primary blue */
Hover: rgba(0, 0, 0, 0.04)  /* 4% black overlay */
```

**Dark Mode**:
```css
Text: rgba(255, 255, 255, 0.87)  /* 87% white */
Active: #bb86fc                   /* Primary light blue */
Indicator: #bb86fc                /* Primary light blue */
Hover: rgba(255, 255, 255, 0.08)  /* 8% white overlay */
```

### Animation

**Transition Characteristics**:
- Duration: 200ms (Material Design standard)
- Easing: cubic-bezier(0.4, 0, 0.2, 1) (Material easing)
- Properties: Background color, text color, indicator position

**Indicator Animation**:
- Linear motion across x-axis
- Smooth, not jarring
- Matches tab selection speed

---

## 10. Related Components & Alternatives

### When to Use Alternatives

**Tabs vs Select**:
- Use Tabs when: Content organization is primary, visual context important
- Use Select when: Form input, space-constrained, many options

**Tabs vs Buttons**:
- Use Tabs when: Switching between content views
- Use Buttons when: Taking actions, not switching views

**Tabs vs Stepper**:
- Use Tabs when: Non-linear, equal-weight sections
- Use Stepper when: Sequential workflow, validation required

**Tabs vs Navigation Drawer**:
- Use Tabs when: Few items (2-5), equal importance
- Use Drawer when: Many items, hierarchical

### Related MUI Components

- **Select**: https://mui.com/material-ui/react-select/
- **Stepper**: https://mui.com/material-ui/react-stepper/
- **Menu**: https://mui.com/material-ui/react-menu/
- **BottomNavigation**: https://mui.com/material-ui/react-bottom-navigation/
- **Drawer**: https://mui.com/material-ui/react-drawer/
- **AppBar**: https://mui.com/material-ui/react-app-bar/

---

## 11. Additional Resources

### Official Documentation
- Main docs: https://mui.com/material-ui/react-tabs/
- Tabs API: https://mui.com/material-ui/api/tabs/
- Tab API: https://mui.com/material-ui/api/tab/
- TabPanel (Lab): https://mui.com/material-ui/api/tab-panel/
- TabContext (Lab): https://mui.com/material-ui/api/tab-context/

### Material Design Specifications
- Tabs design guidelines: https://m3.material.io/components/tabs/overview
- Material Design 3: https://m3.material.io/

### Community Resources
- MUI GitHub issues: https://github.com/mui/material-ui/issues
- Stack Overflow MUI tag: https://stackoverflow.com/questions/tagged/material-ui
- MUI Discord community: https://discord.gg/mui

### Examples & Templates
- MUI examples: https://github.com/mui/material-ui/tree/master/examples
- Codesandbox templates: https://codesandbox.io/s/mui-tabs-example

---

## Summary

MUI Tabs component provides:

- **Flexible Tab Organization**: Standard, scrollable, vertical, and centered layouts
- **Rich Composition**: Tab with icons, labels, badges, custom content
- **Complete Theming**: System props, styled components, theme customization
- **Full Accessibility**: ARIA attributes, keyboard navigation, screen reader support
- **Material Design**: Specifications-compliant with elevation, animation, colors
- **Lab Components**: TabPanel and TabContext for cleaner code patterns
- **Multiple Styling Approaches**: sx prop, styled components, theme-level overrides

The Tabs component is production-ready, well-documented, and handles common use cases from simple content organization to complex multi-level navigation patterns. Its separation of tab controls from content containers provides flexibility while maintaining semantic HTML structure.

**Key Takeaway**: Use Tabs for organizing related content at the same hierarchy level, not for primary navigation. Keep labels concise, limit to 3-7 tabs, and ensure proper keyboard accessibility.

---

## Research Metadata

**Documentation Version**: Material-UI v5+ / v6
**Research Date**: 2025-11-04
**Component Category**: Navigation / Content Organization
**Framework**: React
**TypeScript Support**: Full
**Package**: @mui/material + @mui/lab
**Accessibility Level**: WCAG 2.1 AA compliant
**Material Design Compliance**: Material Design 3
**Last Updated**: 2025-11-05
