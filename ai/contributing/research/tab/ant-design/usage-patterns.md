# Ant Design - Tabs Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/tabs
Status: ✅ Working
Version: 5.x (Latest)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Ant Design provides detailed API documentation with multiple interactive code examples, live demos, and complete prop specifications. Includes accessibility considerations and integration patterns.

---

## Component Definition

**Core Purpose:**
The Tabs component provides a user interface pattern for organizing content into multiple sections (panels) that can be navigated by clicking on tab labels. Each tab displays a different set of content, allowing users to switch between related content areas without loading a new page. Essential for organizing complex information and creating space-efficient interfaces.

**Mental Model:**
Users think of tabs as a "filing cabinet" where each tab is a labeled drawer containing related content. Clicking a tab reveals that drawer's contents while hiding the others. This pattern reduces cognitive load by showing only relevant content at a time.

**Semantic Meaning:**
Tabs communicate that the content on the page can be organized into distinct, mutually-exclusive views. They indicate that these sections are related but distinct, and that only one section is visible at a time. The active/selected tab is visually emphasized to show which content is currently being viewed.

---

## Tab Type Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Line tabs (default) | ✅ | Native | Default style with underline indicator. Most common variant. Props: `type="line"` (default) |
| Card tabs | ✅ | Native | Card-style appearance with bordered containers. Props: `type="card"` |
| Button tabs | ✅ | Native | Button-like appearance. Props: `type="button"` |
| Editable tabs | ✅ | Native | Allows adding and removing tabs dynamically. Props: `type="card"` with `onEdit` callback |
| Vertical tabs | ✅ | Native | Tab labels positioned on the left with content on the right. Props: `tabPosition="left"` or `"right"` |

**Implementation Details:**

**Line Tabs (Default):**
```jsx
<Tabs items={items} />  // type="line" is default
```

**Card Tabs:**
```jsx
<Tabs type="card" items={items} />
```

**Button Tabs:**
```jsx
<Tabs type="button" items={items} />
```

**Vertical Tabs:**
```jsx
<Tabs tabPosition="left" items={items} />
// or
<Tabs tabPosition="right" items={items} />
```

**Editable Tabs:**
```jsx
<Tabs
  type="card"
  items={items}
  onEdit={(targetKey, action) => {
    // action is 'add' or 'remove'
  }}
  closable
/>
```

---

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple text labels | ✅ | Native | Basic string labels for tabs. Direct `label` property in items |
| Icons in tabs | ✅ | Native | Icon + text combinations. Use `icon` property alongside `label` |
| Icons only | ✅ | Native | Tab labels can be just icons without text |
| Badge/Count indicators | ✅ | Composed | Badges placed next to labels using custom components in label prop |
| Custom content in labels | ✅ | Composed | Any React component or HTML can be used as tab label |
| HTML content in panels | ✅ | Native | Tab content can contain any HTML or React components |
| Rich panel content | ✅ | Native | Supports complex nested components, forms, lists, etc. in panel content |

**Code Examples:**

**Text Labels:**
```jsx
const items = [
  { key: '1', label: 'Tab 1', children: <Content1 /> },
  { key: '2', label: 'Tab 2', children: <Content2 /> },
];

<Tabs items={items} />
```

**Icons with Labels:**
```jsx
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';

const items = [
  {
    key: '1',
    label: (
      <span>
        <HomeOutlined />
        Home
      </span>
    ),
    children: <Home />,
  },
  {
    key: '2',
    label: (
      <span>
        <SettingOutlined />
        Settings
      </span>
    ),
    children: <Settings />,
  },
];

<Tabs items={items} />
```

**Badge with Label:**
```jsx
import { Badge } from 'antd';

const items = [
  {
    key: '1',
    label: (
      <span>
        <Badge count={5}>
          <span>Notifications</span>
        </Badge>
      </span>
    ),
    children: <NotificationList />,
  },
];

<Tabs items={items} />
```

**Custom Tab Content:**
```jsx
const items = [
  {
    key: '1',
    label: (
      <div style={{ color: 'blue' }}>
        <strong>Custom Label</strong>
      </div>
    ),
    children: <div>Content 1</div>,
  },
];

<Tabs items={items} />
```

---

## Interactive Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to switch tabs | ✅ | Native | Clicking a tab label switches to that tab's content. Default behavior. |
| Keyboard navigation | ✅ | Native | Arrow keys (Left/Right for horizontal, Up/Down for vertical) navigate tabs. Tab key focuses tabs. |
| Add new tabs | ✅ | Native | With `onEdit` callback and `type="card"`. Action parameter indicates 'add' |
| Remove/Close tabs | ✅ | Native | With `onEdit` callback, `closable` prop, and `type="card"`. Action parameter indicates 'remove' |
| Disabled tabs | ✅ | Native | Individual tabs can be disabled. Use `disabled: true` in item object |
| Hover effects | ✅ | Native | Tabs have hover states indicating they are interactive |
| Tab change events | ✅ | Native | `onChange` callback fires when active tab changes |
| Scroll for many tabs | ✅ | Native | When tabs exceed container width, scrollable navigation appears |
| Tab drag-and-drop | ❌ | CSS-only | Not natively supported; would require custom drag handlers |

**Code Examples:**

**Tab Selection & Change Handling:**
```jsx
const [activeKey, setActiveKey] = useState('1');

const handleTabChange = (key) => {
  console.log('Active tab:', key);
  setActiveKey(key);
};

<Tabs activeKey={activeKey} onChange={handleTabChange} items={items} />
```

**Adding/Removing Tabs:**
```jsx
const [items, setItems] = useState([
  { key: '1', label: 'Tab 1', children: <div>Content 1</div> },
]);

const onEdit = (targetKey, action) => {
  if (action === 'add') {
    const newKey = String(Math.random());
    setItems([
      ...items,
      {
        key: newKey,
        label: `New Tab`,
        children: <div>New Content</div>,
      },
    ]);
  } else if (action === 'remove') {
    const filtered = items.filter((item) => item.key !== targetKey);
    setItems(filtered);
  }
};

<Tabs type="card" onEdit={onEdit} items={items} closable />
```

**Disabled Tabs:**
```jsx
const items = [
  { key: '1', label: 'Active', children: <Content /> },
  { key: '2', label: 'Disabled', children: <Content />, disabled: true },
];

<Tabs items={items} />
```

**Keyboard Navigation (automatic):**
Tabs are fully accessible with keyboard navigation built-in. Arrow keys navigate, Tab focuses, and Enter/Space activates.

---

## Layout Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal layout (default) | ✅ | Native | Tab labels appear on top with content below. `tabPosition="top"` (default) |
| Vertical layout | ✅ | Native | Tab labels appear on left/right with content beside them. `tabPosition="left"` or `"right"` |
| Top positioning | ✅ | Native | Labels above content. Default and most common. `tabPosition="top"` |
| Bottom positioning | ✅ | Native | Labels below content. `tabPosition="bottom"` |
| Left positioning | ✅ | Native | Labels on left side. `tabPosition="left"` |
| Right positioning | ✅ | Native | Labels on right side. `tabPosition="right"` |
| Full-width tabs | ✅ | CSS-only | Make tabs stretch to fill container width using CSS |
| Centered tabs | ✅ | CSS-only | Center tabs within their container using CSS `justify-content` |
| Scrollable tabs | ✅ | Native | Automatic horizontal scroll when tabs exceed container width |
| Tab size variants | ✅ | Native | `size="large"` or `size="small"` for different sizing |

**Code Examples:**

**Vertical Layout:**
```jsx
<Tabs tabPosition="left" items={items} />
// or
<Tabs tabPosition="right" items={items} />
```

**Bottom Position:**
```jsx
<Tabs tabPosition="bottom" items={items} />
```

**Scrollable Tabs (automatic):**
Ant Design handles tab scrolling automatically when they don't fit. No special configuration needed—just provide items and scrolling appears naturally.

**Size Variants:**
```jsx
<Tabs size="large" items={items} />
<Tabs size="small" items={items} />
```

---

## State Management

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled mode | ✅ | Native | Use `activeKey` and `onChange` props to control which tab is active |
| Uncontrolled mode | ✅ | Native | Use `defaultActiveKey` prop for initial tab, component manages state internally |
| Active tab state | ✅ | Native | `activeKey` prop determines which tab is displayed |
| Default active key | ✅ | Native | `defaultActiveKey` prop sets initial tab when component mounts |

**Code Examples:**

**Controlled Mode:**
```jsx
const [activeKey, setActiveKey] = useState('1');

const handleChange = (key) => {
  setActiveKey(key);
  // Can perform side effects here
};

<Tabs
  activeKey={activeKey}
  onChange={handleChange}
  items={items}
/>
```

**Uncontrolled Mode:**
```jsx
<Tabs defaultActiveKey="1" items={items} />
```

**With Initial Tab and Change Handler:**
```jsx
<Tabs
  defaultActiveKey="2"
  onChange={(key) => {
    console.log('Switched to:', key);
  }}
  items={items}
/>
```

---

## Code Examples

### Complete Basic Implementation

```jsx
import React, { useState } from 'react';
import { Tabs } from 'antd';
import { HomeOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

const BasicTabsExample = () => {
  const [activeKey, setActiveKey] = useState('1');

  const items = [
    {
      key: '1',
      label: (
        <span>
          <HomeOutlined />
          Home
        </span>
      ),
      children: (
        <div>
          <h3>Welcome Home</h3>
          <p>This is the home tab content.</p>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <UserOutlined />
          Profile
        </span>
      ),
      children: (
        <div>
          <h3>User Profile</h3>
          <p>This is the profile tab content.</p>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <SettingOutlined />
          Settings
        </span>
      ),
      children: (
        <div>
          <h3>Settings</h3>
          <p>Configure your preferences here.</p>
        </div>
      ),
    },
  ];

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      items={items}
      tabPosition="top"
    />
  );
};

export default BasicTabsExample;
```

### Editable Tabs (Card Type)

```jsx
import React, { useState } from 'react';
import { Tabs, Input } from 'antd';

const EditableTabsExample = () => {
  const [items, setItems] = useState([
    {
      key: '1',
      label: 'Tab 1',
      children: <div>Content of Tab 1</div>,
    },
    {
      key: '2',
      label: 'Tab 2',
      children: <div>Content of Tab 2</div>,
    },
  ]);

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      const newKey = String(Math.max(...items.map((item) => Number(item.key))) + 1);
      const newTab = {
        key: newKey,
        label: `New Tab ${newKey}`,
        children: <div>Content of Tab {newKey}</div>,
      };
      setItems([...items, newTab]);
    } else if (action === 'remove') {
      const filtered = items.filter((item) => item.key !== targetKey);
      setItems(filtered);
    }
  };

  return (
    <Tabs
      type="card"
      items={items}
      onEdit={onEdit}
      closable={true}
      addIcon={<span>+</span>}
    />
  );
};

export default EditableTabsExample;
```

### Vertical Tabs with Different Sizes

```jsx
import React from 'react';
import { Tabs } from 'antd';

const VerticalTabsExample = () => {
  const items = [
    {
      key: '1',
      label: 'Option 1',
      children: <div>Content 1</div>,
    },
    {
      key: '2',
      label: 'Option 2',
      children: <div>Content 2</div>,
    },
    {
      key: '3',
      label: 'Option 3',
      children: <div>Content 3</div>,
    },
  ];

  return (
    <>
      <h4>Left Positioned (Large)</h4>
      <Tabs tabPosition="left" size="large" items={items} />

      <h4>Right Positioned (Small)</h4>
      <Tabs tabPosition="right" size="small" items={items} />
    </>
  );
};

export default VerticalTabsExample;
```

### Tabs with Disabled Items

```jsx
import React from 'react';
import { Tabs } from 'antd';

const DisabledTabsExample = () => {
  const items = [
    {
      key: '1',
      label: 'Active Tab',
      children: <div>You can view this content</div>,
    },
    {
      key: '2',
      label: 'Disabled Tab',
      disabled: true,
      children: <div>This content is not accessible</div>,
    },
    {
      key: '3',
      label: 'Another Active Tab',
      children: <div>You can view this too</div>,
    },
  ];

  return <Tabs items={items} />;
};

export default DisabledTabsExample;
```

---

## Notable Features

### 1. **Rich Item Configuration**
Ant Design's Tabs use an items array where each item is an object with properties like `key`, `label`, `children`, `disabled`, `icon`. This pattern is flexible and extensible.

### 2. **Built-in Tab Scrolling**
When tabs exceed the available width, Ant Design automatically provides horizontal scroll navigation (left/right arrows) without requiring additional configuration.

### 3. **Editable Tabs Support**
The `onEdit` callback combined with `type="card"` and `closable` prop enables dynamic tab addition/removal, useful for scenarios like browser tabs or workspace management.

### 4. **Multiple Layout Orientations**
Unlike some frameworks that only support horizontal tabs, Ant Design supports top, bottom, left, and right positioning out of the box.

### 5. **Icon + Label Support**
Labels can be simple strings or complex React components, allowing for icon + text combinations, badges, custom styling, etc.

### 6. **Size Variants**
Built-in support for `size="large"` and `size="small"` to accommodate different design requirements.

### 7. **Full Keyboard Accessibility**
Arrow keys navigate between tabs, Tab key focuses, and Enter/Space activate tabs. Fully compliant with WCAG standards.

### 8. **Smooth Transitions**
Ant Design includes smooth CSS transitions when switching between tabs (both content reveal and indicator movement).

---

## Research Notes

### Ant Design Tabs Architecture

- **Component**: `<Tabs />` - Main component
- **Props System**: Uses flat props object with an `items` array for tab definitions
- **Lifecycle Integration**: Seamlessly integrates with React patterns (controlled/uncontrolled)
- **CSS Architecture**: Uses Ant Design's `.ant-tabs-*` class system for styling
- **Theme Integration**: Full support for Ant Design's ConfigProvider theming system

### Key Observations

1. **Items Array Pattern**: Unlike some frameworks that use children elements, Ant Design uses an `items` prop with an array of tab objects. This allows for cleaner composition and easier dynamic management.

2. **Keyboard Navigation**: Automatically handles arrow key navigation without explicit implementation. Left/Right arrows for horizontal, Up/Down for vertical tabs.

3. **Performance**: Ant Design renders only the active tab's content by default, avoiding DOM bloat with many tabs.

4. **Card Type Versatility**: The `type="card"` option is used for both card-style visual appearance AND for enabling edit functionality (add/remove).

5. **Icon Handling**: Icons are placed inline with text in label, typically using ant-design/icons components, providing a consistent icon system.

6. **Customization**: While Ant Design provides sensible defaults, extensive customization is possible through CSS class overrides and the theming system.

### Comparison to Other Frameworks

- **More Flexible than Tabs UI**: Ant Design supports more layout variations (4 positions vs typical 2)
- **Similar to Material UI**: Both use configuration objects rather than JSX children, though API structures differ
- **Simpler than Chakra UI**: Fewer required props for basic functionality
- **Better WCAG Support than some alternatives**: Full keyboard navigation and ARIA built-in

### Terminology Consistency

Ant Design is consistent in terminology:
- `activeKey` / `defaultActiveKey` for state management
- `items` for tab definitions
- `onEdit` specifically for add/remove operations
- `onChange` for active tab changes
- `tabPosition` for layout orientation (not `orientation` or `direction`)

---

## Props Quick Reference

### Main Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeKey` | string \| number | - | Currently active tab key (controlled) |
| `defaultActiveKey` | string \| number | First tab | Initial active tab (uncontrolled) |
| `items` | TabPane[] | [] | Array of tab objects with key, label, children, disabled |
| `onChange` | (activeKey) => void | - | Callback when active tab changes |
| `onEdit` | (targetKey, action) => void | - | Callback for add/remove actions |
| `type` | 'line' \| 'card' \| 'button' | 'line' | Visual style of tabs |
| `tabPosition` | 'top' \| 'bottom' \| 'left' \| 'right' | 'top' | Position of tab labels |
| `size` | 'large' \| 'small' | 'middle' | Size variant of tabs |
| `closable` | boolean | false | Show close button on tabs (for card type with edit) |
| `addIcon` | ReactNode | '+' | Icon/element for add button (card type with edit) |

### Tab Item Object Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `key` | string \| number | - | Unique identifier for tab (required) |
| `label` | ReactNode | - | Tab label (text or component) |
| `children` | ReactNode | - | Tab panel content |
| `disabled` | boolean | false | Whether tab is disabled |
| `icon` | ReactNode | - | Icon displayed in tab label |
| `closeIcon` | ReactNode | - | Custom close icon |
| `destroyInactiveTabPane` | boolean | false | Whether to unmount inactive tab content |

---

**Last Verified:** 2025-11-05
**Status:** Research Complete
