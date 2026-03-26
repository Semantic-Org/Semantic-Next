# Chakra UI - Tabs Usage Patterns

> **Component Location**: Chakra UI calls this component "Tabs" - a tabbed interface for organizing and displaying content in panels.

## Component URL
- **v3**: https://www.chakra-ui.com/docs/components/tabs
- **v2**: https://v2.chakra-ui.com/docs/components/tabs

Status: ✅ Working
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Chakra UI provides detailed documentation with code examples, accessibility information, theming guidance, and interactive examples for both v2 and v3.

---

## 1. Component Overview

The **Tabs component** in Chakra UI is an accessible tabbed interface for displaying content organized into multiple panels. It follows WAI-ARIA design patterns for tab interfaces and provides built-in keyboard navigation, focus management, and screen reader support.

**Key Characteristics**:
- Composable architecture with multiple sub-components (Root, List, Trigger, Content, Indicator)
- Built-in accessibility (ARIA roles, keyboard navigation, focus management)
- Multiple visual variants (underline, bordered, soft, enclosed)
- Flexible orientation support (horizontal and vertical)
- State management (controlled and uncontrolled)
- Rich content support (icons, badges, custom content)
- Responsive behavior with mobile-friendly scroll

---

## 2. Version Comparison (v2 vs v3)

### Major Architectural Changes

#### **v2 Component Structure** (Simpler, direct component names)
```jsx
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

<Tabs>
  <TabList>
    <Tab>One</Tab>
    <Tab>Two</Tab>
    <Tab>Three</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Panel One</TabPanel>
    <TabPanel>Panel Two</TabPanel>
    <TabPanel>Panel Three</TabPanel>
  </TabPanels>
</Tabs>
```

#### **v3 Component Structure** (Compound pattern, explicit namespacing)
```jsx
import { Tabs } from '@chakra-ui/react';

<Tabs.Root defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab One</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab Two</Tabs.Trigger>
    <Tabs.Trigger value="tab-3">Tab Three</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Panel One</Tabs.Content>
  <Tabs.Content value="tab-2">Panel Two</Tabs.Content>
  <Tabs.Content value="tab-3">Panel Three</Tabs.Content>
</Tabs.Root>
```

### Breaking Changes Summary

| Feature | v2 | v3 | Migration Impact |
|---------|----|----|------------------|
| **Component naming** | `<Tabs>`, `<Tab>`, `<TabPanel>` | `<Tabs.Root>`, `<Tabs.Trigger>`, `<Tabs.Content>` | HIGH - Requires renaming all components |
| **Panel identification** | Index-based (implicit order) | Value-based (explicit `value` prop) | MEDIUM - Must add `value` prop to each pair |
| **Container wrapper** | `<TabPanels>` required | Direct `<Tabs.Content>` children | MEDIUM - Flatten hierarchy |
| **Lazy mounting** | `isLazy` prop | `lazyMount` prop (default: true) | LOW - Better defaults in v3 |
| **Disabled state** | `isDisabled` | `disabled` | LOW - Simple prop rename |
| **Indicator** | Automatic underline | Explicit `<Tabs.Indicator>` component | MEDIUM - May need custom styling |
| **Orientation** | `orientation` prop | `orientation` prop (same) | NONE - No change |
| **Icon support** | Icons as children | Icons as children or icon prop | LOW - Similar approach |
| **Responsive tabs** | Manual responsive implementation | Built-in responsive support | LOW - Improved defaults |
| **Underlying library** | Custom implementation | Built on Ark UI state machine | HIGH - Different internal architecture |

### New Features in v3

1. **Explicit Indicator**: `<Tabs.Indicator>` component for visual marker styling
2. **Better Performance**: `lazyMount` enabled by default, unmounts panels when not active
3. **Clearer Component Hierarchy**: Compound pattern makes parent-child relationships explicit
4. **Value-based Identification**: Required `value` prop enables better programmatic control
5. **Responsive Defaults**: Better mobile-first behavior out of the box
6. **Ark UI Foundation**: Leverages headless UI state machine for robust behavior

### Known Migration Issues

1. **Index vs Value**: v2 uses implicit index ordering, v3 requires explicit value prop
2. **No Codemods**: Manual migration required - no automated tooling available
3. **Indicator Styling**: Behavior of visual indicator may differ between versions
4. **Lazy mounting defaults**: v3 lazy mounts by default (v2 required `isLazy` prop)
5. **Component tree flattening**: TabPanels wrapper removed in v3

---

## 3. Basic Usage

### v2 Basic Example
```jsx
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/react';

<Tabs>
  <TabList>
    <Tab>One</Tab>
    <Tab>Two</Tab>
    <Tab>Three</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Box p={4}>Content for Tab One</Box>
    </TabPanel>
    <TabPanel>
      <Box p={4}>Content for Tab Two</Box>
    </TabPanel>
    <TabPanel>
      <Box p={4}>Content for Tab Three</Box>
    </TabPanel>
  </TabPanels>
</Tabs>
```

### v3 Basic Example
```jsx
import { Tabs } from '@chakra-ui/react';

<Tabs.Root defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab One</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab Two</Tabs.Trigger>
    <Tabs.Trigger value="tab-3">Tab Three</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content for Tab One</Tabs.Content>
  <Tabs.Content value="tab-2">Content for Tab Two</Tabs.Content>
  <Tabs.Content value="tab-3">Content for Tab Three</Tabs.Content>
</Tabs.Root>
```

---

## 4. Props/API Reference

### v2 Props

#### Tabs (Container)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | - | Controlled active tab index |
| `defaultIndex` | `number` | `0` | Uncontrolled default active tab index |
| `onChange` | `(index: number) => void` | - | Callback when tab changes |
| `isLazy` | `boolean` | `false` | Lazy mount tab panels |
| `lazyBehavior` | `'unmount' \| 'keepMounted'` | `'unmount'` | Control panel unmounting when lazy |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab orientation |
| `variant` | `'line' \| 'enclosed' \| 'soft-rounded' \| 'unstyled'` | `'line'` | Visual style variant |
| `colorScheme` | `string` | `'blue'` | Color palette for active indicator |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Tab list alignment |
| `isFitted` | `boolean` | `false` | Tabs take equal width in container |
| `isManual` | `boolean` | `false` | Manual activation (click required vs automatic on arrow keys) |

#### Tab (Individual trigger)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isDisabled` | `boolean` | `false` | Disable individual tab |
| `isSelected` | `boolean` | - | Controlled selected state (rarely needed) |
| `icon` | `ReactElement` | - | Icon to display in tab |
| `children` | `ReactNode` | - | Tab label/content |
- Composes `Box` - accepts all Box props for styling

#### TabPanel
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Panel content |
- Composes `Box` - accepts all Box props for styling

#### TabList
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Tab components |
- Composes `Box` - accepts all Box props for styling

#### TabPanels
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | TabPanel components |
- Composes `Box` - accepts all Box props for styling

### v3 Props

#### Tabs.Root (Container)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled active tab value |
| `defaultValue` | `string` | - | Uncontrolled default active tab value |
| `onChange` | `(value: string) => void` | - | Callback when tab changes |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab orientation |
| `disabled` | `boolean` | `false` | Disable all tabs |
| `lazyMount` | `boolean` | `true` (v3.6.0+) | Defer mounting until tab is active |
| `unmountOnExit` | `boolean` | `true` (v3.6.0+) | Unmount panel when tab becomes inactive |
| `selectOnFocus` | `boolean` | `false` | Auto-select tab on focus (vs manual activation) |

#### Tabs.List
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| Standard style props | - | - | Accepts Chakra style props |

#### Tabs.Trigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **Required** | Unique identifier for tab |
| `disabled` | `boolean` | `false` | Disable individual tab |
| `asChild` | `boolean` | - | Render as child element (polymorphic) |

#### Tabs.Content
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **Required** | Must match corresponding Trigger value |

#### Tabs.Indicator
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| Standard style props | - | - | Accepts Chakra style props for styling |

**Note**: v3 is built on Ark UI - consult [Ark UI Tabs docs](https://ark-ui.com/docs/components/tabs) for complete prop reference and advanced features.

---

## 5. Tab Types & Variants

### Visual Variants

#### v2: Variant Styles
```jsx
// Line variant (default) - underline indicator
<Tabs variant="line">
  <TabList>
    <Tab>Tab One</Tab>
    <Tab>Tab Two</Tab>
  </TabList>
  <TabPanels>...</TabPanels>
</Tabs>

// Enclosed variant - bordered container
<Tabs variant="enclosed">
  <TabList>
    <Tab>Tab One</Tab>
    <Tab>Tab Two</Tab>
  </TabList>
  <TabPanels>...</TabPanels>
</Tabs>

// Soft-rounded variant - soft background
<Tabs variant="soft-rounded">
  <TabList>
    <Tab>Tab One</Tab>
    <Tab>Tab Two</Tab>
  </TabList>
  <TabPanels>...</TabPanels>
</Tabs>

// Unstyled variant - minimal styling
<Tabs variant="unstyled">
  <TabList>
    <Tab>Tab One</Tab>
    <Tab>Tab Two</Tab>
  </TabList>
  <TabPanels>...</TabPanels>
</Tabs>
```

#### v3: Implicit Styling
```jsx
// Default style (underline indicator)
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab One</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab Two</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content</Tabs.Content>
  <Tabs.Content value="tab-2">Content</Tabs.Content>
</Tabs.Root>

// Custom styling via style props
<Tabs.Root>
  <Tabs.List borderBottomWidth="2px" borderColor="gray.200">
    <Tabs.Trigger value="tab-1">Tab One</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content</Tabs.Content>
</Tabs.Root>
```

### Variant Characteristics

| Variant | Appearance | Use Case | v2 | v3 |
|---------|------------|----------|----|----|
| **Line** | Underline indicator | Default, simple tabbed content | ✅ | ✅ (default) |
| **Enclosed** | Full border container | Distinct tab container | ✅ | ⚠️ (via style props) |
| **Soft-rounded** | Soft background pill | Modern, rounded appearance | ✅ | ⚠️ (via style props) |
| **Unstyled** | No default styling | Fully custom styling | ✅ | ✅ (minimal by default) |

---

## 6. Tab Types - Content Organization

### Basic Tab Pattern
```jsx
// v2
<Tabs>
  <TabList>
    <Tab>Profile</Tab>
    <Tab>Settings</Tab>
    <Tab>Privacy</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Profile content</TabPanel>
    <TabPanel>Settings content</TabPanel>
    <TabPanel>Privacy content</TabPanel>
  </TabPanels>
</Tabs>

// v3
<Tabs.Root defaultValue="profile">
  <Tabs.List>
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    <Tabs.Trigger value="privacy">Privacy</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="profile">Profile content</Tabs.Content>
  <Tabs.Content value="settings">Settings content</Tabs.Content>
  <Tabs.Content value="privacy">Privacy content</Tabs.Content>
</Tabs.Root>
```

### Vertical Tabs
```jsx
// v2
<Tabs orientation="vertical">
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabPanels>
</Tabs>

// v3
<Tabs.Root orientation="vertical" defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content 1</Tabs.Content>
  <Tabs.Content value="tab-2">Content 2</Tabs.Content>
</Tabs.Root>
```

### Icon with Text
```jsx
// v2
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

<Tabs>
  <TabList>
    <Tab icon={<AddIcon />}>Add</Tab>
    <Tab icon={<DeleteIcon />}>Delete</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Add content</TabPanel>
    <TabPanel>Delete content</TabPanel>
  </TabPanels>
</Tabs>

// v3
<Tabs.Root defaultValue="add">
  <Tabs.List>
    <Tabs.Trigger value="add">
      <AddIcon mr={2} /> Add
    </Tabs.Trigger>
    <Tabs.Trigger value="delete">
      <DeleteIcon mr={2} /> Delete
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="add">Add content</Tabs.Content>
  <Tabs.Content value="delete">Delete content</Tabs.Content>
</Tabs.Root>
```

### Fitted Tabs (Equal Width)
```jsx
// v2
<Tabs isFitted>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
    <Tab>Tab 3</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
    <TabPanel>Content 3</TabPanel>
  </TabPanels>
</Tabs>

// v3
<Tabs.Root defaultValue="tab-1">
  <Tabs.List flex="1">
    <Tabs.Trigger value="tab-1" flex="1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2" flex="1">Tab 2</Tabs.Trigger>
    <Tabs.Trigger value="tab-3" flex="1">Tab 3</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content 1</Tabs.Content>
  <Tabs.Content value="tab-2">Content 2</Tabs.Content>
  <Tabs.Content value="tab-3">Content 3</Tabs.Content>
</Tabs.Root>
```

---

## 7. Content Patterns

### Rich Tab Content

#### v2: Complex Panel Content
```jsx
<Tabs>
  <TabList>
    <Tab>Dashboard</Tab>
    <Tab>Analytics</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <VStack spacing={4}>
        <Heading size="md">Dashboard</Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <Box bg="blue.50" p={4} borderRadius="md">
            <Text fontWeight="bold">Metric 1</Text>
            <Text fontSize="2xl">1,234</Text>
          </Box>
          <Box bg="green.50" p={4} borderRadius="md">
            <Text fontWeight="bold">Metric 2</Text>
            <Text fontSize="2xl">567</Text>
          </Box>
        </Grid>
      </VStack>
    </TabPanel>
    <TabPanel>
      <Text>Analytics content here</Text>
    </TabPanel>
  </TabPanels>
</Tabs>
```

#### v3: Equivalent Structure
```jsx
<Tabs.Root defaultValue="dashboard">
  <Tabs.List>
    <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
    <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="dashboard">
    <VStack spacing={4}>
      <Heading size="md">Dashboard</Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box bg="blue.50" p={4} borderRadius="md">
          <Text fontWeight="bold">Metric 1</Text>
          <Text fontSize="2xl">1,234</Text>
        </Box>
        <Box bg="green.50" p={4} borderRadius="md">
          <Text fontWeight="bold">Metric 2</Text>
          <Text fontSize="2xl">567</Text>
        </Box>
      </Grid>
    </VStack>
  </Tabs.Content>
  <Tabs.Content value="analytics">
    <Text>Analytics content here</Text>
  </Tabs.Content>
</Tabs.Root>
```

### Lazy-Loaded Panels

#### v2: Lazy Mounting
```jsx
<Tabs isLazy>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2 (Lazy)</Tab>
    <Tab>Tab 3 (Lazy)</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Always mounted</TabPanel>
    <TabPanel>Only rendered when active</TabPanel>
    <TabPanel>Only rendered when active</TabPanel>
  </TabPanels>
</Tabs>
```

#### v3: Lazy Mounting (Default)
```jsx
// v3.6.0+ has lazyMount=true by default
<Tabs.Root defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab 2 (Lazy)</Tabs.Trigger>
    <Tabs.Trigger value="tab-3">Tab 3 (Lazy)</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Always mounted</Tabs.Content>
  <Tabs.Content value="tab-2">Only rendered when active</Tabs.Content>
  <Tabs.Content value="tab-3">Only rendered when active</Tabs.Content>
</Tabs.Root>

// To disable lazy mounting
<Tabs.Root lazyMount={false}>
  ...
</Tabs.Root>
```

### Badge/Notification Support

#### v2: Badge in Tabs
```jsx
import { Badge } from '@chakra-ui/react';

<Tabs>
  <TabList>
    <Tab>
      Inbox
      <Badge ml={2} colorScheme="red">3</Badge>
    </Tab>
    <Tab>
      Archive
      <Badge ml={2} colorScheme="gray">0</Badge>
    </Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Inbox items</TabPanel>
    <TabPanel>Archived items</TabPanel>
  </TabPanels>
</Tabs>
```

#### v3: Badge in Tabs
```jsx
<Tabs.Root defaultValue="inbox">
  <Tabs.List>
    <Tabs.Trigger value="inbox">
      Inbox
      <Badge ml={2} colorScheme="red">3</Badge>
    </Tabs.Trigger>
    <Tabs.Trigger value="archive">
      Archive
      <Badge ml={2} colorScheme="gray">0</Badge>
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="inbox">Inbox items</Tabs.Content>
  <Tabs.Content value="archive">Archived items</Tabs.Content>
</Tabs.Root>
```

---

## 8. Interactive Patterns

### Controlled vs Uncontrolled

#### v2: Controlled Tabs
```jsx
const [tabIndex, setTabIndex] = useState(0);

<Tabs index={tabIndex} onChange={setTabIndex}>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabPanels>
</Tabs>
```

#### v2: Uncontrolled Tabs
```jsx
<Tabs defaultIndex={0}>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabPanels>
</Tabs>
```

#### v3: Controlled Tabs
```jsx
const [value, setValue] = useState('tab-1');

<Tabs.Root value={value} onChange={setValue}>
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content 1</Tabs.Content>
  <Tabs.Content value="tab-2">Content 2</Tabs.Content>
</Tabs.Root>
```

#### v3: Uncontrolled Tabs
```jsx
<Tabs.Root defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content 1</Tabs.Content>
  <Tabs.Content value="tab-2">Content 2</Tabs.Content>
</Tabs.Root>
```

### Disabled Tabs

#### v2: Individual Tab Disabled
```jsx
<Tabs>
  <TabList>
    <Tab>Enabled</Tab>
    <Tab isDisabled>Disabled</Tab>
    <Tab>Enabled</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2 - Not accessible</TabPanel>
    <TabPanel>Content 3</TabPanel>
  </TabPanels>
</Tabs>
```

#### v3: Individual Tab Disabled
```jsx
<Tabs.Root defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Enabled</Tabs.Trigger>
    <Tabs.Trigger value="tab-2" disabled>Disabled</Tabs.Trigger>
    <Tabs.Trigger value="tab-3">Enabled</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content 1</Tabs.Content>
  <Tabs.Content value="tab-2">Content 2 - Not accessible</Tabs.Content>
  <Tabs.Content value="tab-3">Content 3</Tabs.Content>
</Tabs.Root>
```

### Manual Activation (v2 Only)

```jsx
// v2 - Click required to activate tab
<Tabs isManual>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabPanels>
</Tabs>

// v3 - Use selectOnFocus
<Tabs.Root selectOnFocus={false}>
  {/* Arrow keys focus but don't activate, click required */}
</Tabs.Root>
```

---

## 9. Layout & Positioning

### Tab List Alignment

#### v2: Tab Alignment
```jsx
// Start (default)
<Tabs align="start">

// Center
<Tabs align="center">

// End
<Tabs align="end">
```

#### v3: Tab List Alignment (via style props)
```jsx
// Start (default)
<Tabs.Root>
  <Tabs.List justifyContent="flex-start">

// Center
<Tabs.Root>
  <Tabs.List justifyContent="center">

// End
<Tabs.Root>
  <Tabs.List justifyContent="flex-end">
```

### Horizontal Scrolling Tabs

#### v2: Scrollable Tab List
```jsx
<Tabs>
  <TabList overflowX="auto" pb={4}>
    <Tab minW="max-content">Tab 1</Tab>
    <Tab minW="max-content">Tab 2</Tab>
    <Tab minW="max-content">Tab 3</Tab>
    {/* ... many more tabs ... */}
  </TabList>
  <TabPanels>
    {/* Content */}
  </TabPanels>
</Tabs>
```

#### v3: Scrollable Tab List
```jsx
<Tabs.Root>
  <Tabs.List overflowX="auto" pb={4}>
    <Tabs.Trigger value="tab-1" minW="max-content">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2" minW="max-content">Tab 2</Tabs.Trigger>
    <Tabs.Trigger value="tab-3" minW="max-content">Tab 3</Tabs.Trigger>
    {/* ... many more tabs ... */}
  </Tabs.List>
  <Tabs.Content value="tab-1">Content 1</Tabs.Content>
  {/* ... */}
</Tabs.Root>
```

---

## 10. State Management

### Handling Tab Changes

#### v2: onChange Callback
```jsx
function handleTabsChange(index) {
  console.log('Tab changed to', index);
  // Perform analytics, fetch data, etc.
}

<Tabs onChange={handleTabsChange}>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabPanels>
</Tabs>
```

#### v3: onChange Callback
```jsx
function handleTabsChange(value) {
  console.log('Tab changed to', value);
  // Perform analytics, fetch data, etc.
}

<Tabs.Root onChange={handleTabsChange}>
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content 1</Tabs.Content>
  <Tabs.Content value="tab-2">Content 2</Tabs.Content>
</Tabs.Root>
```

### Async Content Loading

#### v2: Lazy Load with State
```jsx
const [activeIndex, setActiveIndex] = useState(0);
const [data, setData] = useState({});

useEffect(() => {
  // Fetch data when tab changes
  if (activeIndex === 1 && !data[1]) {
    fetchTabData(1).then(result => {
      setData(prev => ({ ...prev, [1]: result }));
    });
  }
}, [activeIndex]);

<Tabs index={activeIndex} onChange={setActiveIndex} isLazy>
  <TabList>
    <Tab>Dashboard</Tab>
    <Tab>Analytics {data[1] && '✓'}</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Dashboard content</TabPanel>
    <TabPanel>
      {data[1] ? <AnalyticsChart data={data[1]} /> : <Spinner />}
    </TabPanel>
  </TabPanels>
</Tabs>
```

#### v3: Lazy Load with State
```jsx
const [activeValue, setActiveValue] = useState('dashboard');
const [data, setData] = useState({});

useEffect(() => {
  if (activeValue === 'analytics' && !data.analytics) {
    fetchTabData('analytics').then(result => {
      setData(prev => ({ ...prev, analytics: result }));
    });
  }
}, [activeValue]);

<Tabs.Root value={activeValue} onChange={setActiveValue}>
  <Tabs.List>
    <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
    <Tabs.Trigger value="analytics">
      Analytics {data.analytics && '✓'}
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="dashboard">Dashboard content</Tabs.Content>
  <Tabs.Content value="analytics">
    {data.analytics ? (
      <AnalyticsChart data={data.analytics} />
    ) : (
      <Spinner />
    )}
  </Tabs.Content>
</Tabs.Root>
```

---

## 11. Styling & Theming

### v2 Theming System

#### Multipart Component Structure

Tabs is a **multipart component** with these parts:
- `tablist` - Tab list container
- `tab` - Individual tab trigger
- `tabpanel` - Content panel
- `tabpanels` - Panel container
- `indicator` - Active indicator line/background

#### Using useMultiStyleConfig

```jsx
import { useMultiStyleConfig, Box } from '@chakra-ui/react';

function CustomTabs(props) {
  const styles = useMultiStyleConfig('Tabs', props);

  return (
    <Tabs>
      <TabList sx={styles.tablist}>
        <Tab sx={styles.tab}>Tab 1</Tab>
      </TabList>
      <TabPanels sx={styles.tabpanels}>
        <TabPanel sx={styles.tabpanel}>Content</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
```

#### Theme Customization

```jsx
// theme.js
export const TabsTheme = {
  baseStyle: {
    tablist: {
      borderBottomWidth: '2px',
      borderBottomColor: 'gray.200',
    },
    tab: {
      py: 2,
      px: 4,
      fontWeight: 'medium',
      color: 'gray.600',
      borderBottomWidth: '2px',
      borderBottomColor: 'transparent',
      _selected: {
        color: 'blue.600',
        borderBottomColor: 'blue.600',
      },
      _hover: {
        color: 'gray.800',
      },
    },
    tabpanel: {
      py: 4,
      px: 0,
    },
  },
  variants: {
    enclosed: {
      tablist: {
        borderWidth: '1px',
        borderColor: 'gray.200',
        borderRadius: 'md',
        p: 2,
      },
      tab: {
        borderRadius: 'md',
        _selected: {
          bg: 'blue.50',
        },
      },
    },
    'soft-rounded': {
      tablist: {
        bg: 'gray.100',
        borderRadius: 'lg',
        p: 1,
      },
      tab: {
        borderRadius: 'md',
        _selected: {
          bg: 'white',
          boxShadow: 'sm',
        },
      },
    },
  },
  defaultProps: {
    variant: 'line',
    colorScheme: 'blue',
  },
};
```

### v3 Theming System

**Note**: v3 theming API differs from v2. v3 is built on Ark UI and uses component-based theming.

#### Component-Based Styling

```jsx
// Direct style props
<Tabs.Root>
  <Tabs.List
    borderBottomWidth="2px"
    borderBottomColor="gray.200"
    bg="gray.50"
  >
    <Tabs.Trigger
      value="tab-1"
      py={2}
      px={4}
      color="gray.600"
      _selected={{ color: 'blue.600' }}
      _hover={{ bg: 'gray.100' }}
    >
      Tab 1
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content
    value="tab-1"
    py={4}
    px={0}
  >
    Content
  </Tabs.Content>
</Tabs.Root>
```

#### Indicator Styling (v3)

```jsx
<Tabs.Root>
  <Tabs.List position="relative">
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
    <Tabs.Indicator
      height="2px"
      bg="blue.600"
      bottom="0"
      transition="all 0.3s ease"
    />
  </Tabs.List>
</Tabs.Root>
```

---

## 12. Accessibility

### ARIA Implementation

Both v2 and v3 follow **WAI-ARIA Tab Pattern** guidelines.

#### ARIA Attributes (v2)

- **TabList**:
  - `role="tablist"`

- **Tab**:
  - `role="tab"`
  - `id="{tabId}"`
  - `aria-selected="true"` (active) or `"false"`
  - `aria-controls="{panelId}"`
  - `tabIndex="0"` (active) or `"-1"`

- **TabPanel**:
  - `role="tabpanel"`
  - `id="{panelId}"`
  - `aria-labelledby="{tabId}"`
  - `tabIndex="0"`

#### Keyboard Support

| Key | Action |
|-----|--------|
| `ArrowRight` / `ArrowDown` | Move focus to next tab |
| `ArrowLeft` / `ArrowUp` | Move focus to previous tab |
| `Home` | Move focus to first tab |
| `End` | Move focus to last tab |
| `Enter` / `Space` | Activate focused tab (if manual mode) |

#### Focus Management

- **Auto-focus**: First tab auto-focused when component mounts
- **Focus trap**: Focus remains within tab container (circular)
- **Tab order**: Active tab is in tab order, inactive tabs have `tabIndex="-1"`
- **Manual mode**: In manual mode (`isManual`), arrow keys move focus only, activation requires Enter/Space

### Screen Reader Support

- Announces tab list and its role
- Reads tab labels and state (selected/not selected)
- Announces panel titles via `aria-labelledby`
- Proper role announcements for all elements

#### Best Practice Example (v3)

```jsx
<Tabs.Root defaultValue="tab-1">
  <Tabs.List aria-label="Tab navigation">
    <Tabs.Trigger
      value="tab-1"
      aria-label="Account settings"
    >
      Account
    </Tabs.Trigger>
    <Tabs.Trigger
      value="tab-2"
      aria-label="Privacy settings"
    >
      Privacy
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">
    <div role="region" aria-live="polite">
      Account settings content
    </div>
  </Tabs.Content>
  <Tabs.Content value="tab-2">
    <div role="region" aria-live="polite">
      Privacy settings content
    </div>
  </Tabs.Content>
</Tabs.Root>
```

---

## 13. Notable Features

### Composition Patterns

#### v2 Component Hierarchy
```
Tabs (container)
├── TabList (tab trigger list)
│   ├── Tab (individual trigger)
│   ├── Tab
│   └── Tab
└── TabPanels (content container)
    ├── TabPanel (content)
    ├── TabPanel
    └── TabPanel
```

#### v3 Component Hierarchy
```
Tabs.Root (container)
├── Tabs.List (tab trigger list)
│   ├── Tabs.Trigger (individual trigger, requires value)
│   ├── Tabs.Trigger
│   ├── Tabs.Trigger
│   └── Tabs.Indicator (visual indicator, optional)
├── Tabs.Content (content, requires matching value)
├── Tabs.Content
└── Tabs.Content
```

### Performance Features

#### v2: Lazy Mounting
```jsx
<Tabs isLazy lazyBehavior="unmount">
  {/* Panels only rendered when active, unmounted when inactive */}
</Tabs>
```

#### v3: Lazy Mounting (Default)
```jsx
// v3.6.0+ defaults: lazyMount={true}, unmountOnExit={true}
<Tabs.Root>
  {/* Panels only rendered when active by default */}
</Tabs.Root>

// Disable if needed
<Tabs.Root lazyMount={false} unmountOnExit={false}>
  {/* All panels always rendered */}
</Tabs.Root>
```

### Size Variants

#### v2: Size Options
```jsx
<Tabs size="sm">  {/* Small */}
<Tabs size="md">  {/* Medium (default) */}
<Tabs size="lg">  {/* Large */}
```

#### v3: Size via Style Props
```jsx
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger py={1} px={2} fontSize="sm">Small</Tabs.Trigger>
    <Tabs.Trigger py={2} px={4} fontSize="md">Medium</Tabs.Trigger>
    <Tabs.Trigger py={3} px={6} fontSize="lg">Large</Tabs.Trigger>
  </Tabs.List>
</Tabs.Root>
```

### Color Schemes (v2)

```jsx
// Built-in color schemes
<Tabs colorScheme="blue">     {/* Default */}
<Tabs colorScheme="red">      {/* Red accent */}
<Tabs colorScheme="green">    {/* Green accent */}
<Tabs colorScheme="purple">   {/* Purple accent */}
{/* Plus all other Chakra colors */}
```

---

## 14. Best Practices

### When to Use Tabs

✅ **Use Tabs for**:
- Organizing related content into logical sections
- Switching between different views without navigation
- Horizontal content organization
- Settings/preferences pages
- Multi-step forms (with careful consideration)
- Sidebar navigation in mobile layouts

❌ **Don't Use Tabs for**:
- Primary site navigation (use proper navigation components)
- Switching between completely unrelated sections
- More than 5-8 tabs (consider alternative UI patterns)
- Mobile-only content (use accordion instead)
- Heavy content switching (consider page navigation)

### Naming & Labeling

```jsx
// ✅ Good: Clear, concise labels
<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
<Tabs.Trigger value="details">Details</Tabs.Trigger>
<Tabs.Trigger value="activity">Activity</Tabs.Trigger>

// ❌ Poor: Vague labels
<Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
<Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
```

### Managing Content

```jsx
// ✅ Good: Keep content focused per tab
<Tabs.Content value="profile">
  <ProfileForm />
</Tabs.Content>

// ❌ Poor: Unrelated content in one tab
<Tabs.Content value="profile">
  <ProfileForm />
  <BillingInfo />
  <NotificationSettings />
</Tabs.Content>
```

### Responsive Considerations

```jsx
// Mobile: Stack vertically, show fewer tabs
// Desktop: Horizontal layout, show all tabs

<Tabs.Root orientation={isMobile ? "vertical" : "horizontal"}>
  <Tabs.List flexDirection={isMobile ? "column" : "row"}>
    {/* Tabs */}
  </Tabs.List>
</Tabs.Root>
```

### Migration Guide (v2 → v3)

#### Step 1: Update Imports
```jsx
// Before (v2)
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

// After (v3)
import { Tabs } from '@chakra-ui/react';
```

#### Step 2: Restructure Component Hierarchy
```jsx
// Before (v2)
<Tabs index={activeIndex} onChange={setActiveIndex}>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabPanels>
</Tabs>

// After (v3)
<Tabs.Root value={activeValue} onChange={setActiveValue} defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content 1</Tabs.Content>
  <Tabs.Content value="tab-2">Content 2</Tabs.Content>
</Tabs.Root>
```

#### Step 3: Update Props
- `index` → `value` (for controlled state)
- `defaultIndex` → `defaultValue` (with string tab id)
- `onChange` → `onChange` (signature changes: `index` → `value`)
- `isDisabled` → `disabled`
- `isLazy` → `lazyMount` (enabled by default in v3.6.0+)

#### Step 4: Remove TabPanels Wrapper
- v2 requires `<TabPanels>` wrapper
- v3 uses direct `<Tabs.Content>` children

#### Step 5: Add Value Props
- v3 requires `value` prop on both `<Tabs.Trigger>` and `<Tabs.Content>`
- Values must match between pairs

#### Step 6: Update Theming
- v2 uses `useMultiStyleConfig` approach
- v3 uses component-based styling with style props
- May need to refactor theme customizations

#### Step 7: Handle Breaking Changes
- Index-based selection changed to value-based
- Indicator styling may differ
- Some props may not have direct equivalents (check Ark UI docs)

---

## 15. Comparison Notes

### What Makes Chakra's Tabs Unique

1. **Multipart Architecture** (v2): Clear separation of concerns with themed parts system
2. **Compound Pattern** (v3): Explicit component relationships via namespaced components (`Tabs.X`)
3. **Built on Ark UI** (v3): Leverages headless UI state machine for consistent behavior
4. **Variant System**: Named variants (line, enclosed, soft-rounded) for quick styling
5. **Lazy Mounting**: Performance optimization with customizable behavior
6. **Full Style Props**: All components accept Chakra's style system
7. **Accessibility Built-in**: ARIA compliance without opt-in
8. **Type-ahead Support**: Keyboard navigation with quick tab access
9. **Color Scheme Integration**: Semantic color customization
10. **Responsive Ready**: Works well with mobile and desktop layouts

### Framework Philosophy

- **Web Standards**: Follows WAI-ARIA Tab Pattern closely
- **Developer Experience**: Balance between simplicity and control
- **Composability**: All components work with Chakra's design system
- **Accessibility**: Non-negotiable - built-in from the ground up
- **Flexibility**: Multiple ways to achieve different layouts

---

## 16. Research Notes

- **Documentation Source**: Chakra UI official documentation
- **Version Coverage**: Both v2 and v3 documented with migration guidance
- **Ark UI Integration**: v3 built on Ark UI - full prop reference available in Ark UI docs
- **Breaking Changes**: v3 has significant breaking changes from v2
- **Migration Tools**: No automated codemods - manual migration required
- **Performance**: v3 improved lazy mounting defaults (v3.6.0+)
- **Theme System**: Significant theming API changes between v2 and v3

---

## Additional Resources

- **Chakra UI v3 Docs**: https://www.chakra-ui.com/docs/components/tabs
- **Chakra UI v2 Docs**: https://v2.chakra-ui.com/docs/components/tabs
- **Ark UI Tabs**: https://ark-ui.com/docs/components/tabs (v3 foundation)
- **Migration Guide**: https://www.chakra-ui.com/docs/get-started/migration
- **WAI-ARIA Tab Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- **GitHub Discussions**: https://github.com/chakra-ui/chakra-ui/discussions
