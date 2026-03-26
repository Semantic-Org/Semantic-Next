# Ant Design Dropdown Component - Usage Patterns Report

**Framework:** Ant Design (React)
**Component:** Dropdown
**Version:** 5.x (Latest)
**Research Date:** 2025-11-04
**Documentation:** https://ant.design/components/dropdown/

---

## 1. Component Overview

The Ant Design Dropdown component is a **menu-focused overlay component** that displays a dropdown menu when triggered by hovering or clicking. It is designed for **action menus** rather than form inputs, providing a way to present a list of commands or navigation options to users.

The Dropdown wraps menu items in an overlay that appears on user interaction. When users interact with the trigger element, a menu appears allowing them to choose an option and execute an action. This component is fundamentally different from Select, which is form-focused for collecting user input.

**Key Distinction:** Dropdown is for **actions and commands** (like toolbar menus, context menus, navigation), while Select is for **form input** (choosing values to submit).

---

## 2. Basic Usage

### Simple Dropdown with Menu Items

```typescript
import React from 'react';
import { Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;
```

**Explanation:** The basic dropdown accepts a `menu` prop with an `items` array. The child element (anchor tag here) becomes the trigger. By default, hovering over the trigger shows the menu.

### Dropdown with Click Handler

```typescript
const onClick: MenuProps['onClick'] = ({ key }) => {
  console.log(`Clicked item: ${key}`);
  // Execute action based on key
};

const App: React.FC = () => (
  <Dropdown menu={{ items, onClick }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Click menu item
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);
```

**Explanation:** The `menu.onClick` handler receives the clicked item's key, allowing you to execute different actions for different menu items.

### Controlled Dropdown

```typescript
const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  const handleMenuClick = () => {
    // Optionally control when to close
    setOpen(false);
  };

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          Controlled
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};
```

**Explanation:** Use `open` and `onOpenChange` props to control the dropdown visibility state programmatically.

---

## 3. Props/API

### Dropdown Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menu` | `MenuProps` | - | Menu configuration with items and handlers |
| `arrow` | `boolean \| { pointAtCenter?: boolean }` | `false` | Whether to show arrow. With `{ pointAtCenter: true }`, arrow points to center of trigger |
| `autoAdjustOverflow` | `boolean` | `true` | Whether to adjust dropdown placement automatically when off screen (since 5.2.0) |
| `autoFocus` | `boolean` | `false` | Focus element in overlay when opened (since 4.21.0) |
| `disabled` | `boolean` | `false` | Whether the dropdown menu is disabled |
| `destroyPopupOnHide` | `boolean` | `false` | Whether destroy dropdown when hidden (deprecated, use `destroyOnHidden`) |
| `destroyOnHidden` | `boolean` | `false` | Whether destroy dropdown when hidden (since 5.25.0) |
| `getPopupContainer` | `(triggerNode: HTMLElement) => HTMLElement` | `() => document.body` | Container for the dropdown menu |
| `overlayClassName` | `string` | - | Class name of the dropdown root element |
| `overlayStyle` | `CSSProperties` | - | Style of the dropdown root element |
| `placement` | `'topLeft' \| 'topCenter' \| 'topRight' \| 'bottomLeft' \| 'bottomCenter' \| 'bottomRight'` | `'bottomLeft'` | Placement of popup menu |
| `trigger` | `Array<'click' \| 'hover' \| 'contextMenu'>` | `['hover']` | Trigger mode for showing dropdown |
| `open` | `boolean` | - | Whether the dropdown menu is currently open (controlled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `align` | `Object` | - | Alignment config object from rc-dropdown |
| `mouseEnterDelay` | `number` | `0.15` | Delay in seconds before showing on mouse enter |
| `mouseLeaveDelay` | `number` | `0.1` | Delay in seconds before hiding on mouse leave |
| `forceRender` | `boolean` | `false` | Force render dropdown before first open |

### MenuProps['items'] Structure

Each item in the `items` array can have:

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Unique identifier (required) |
| `label` | `ReactNode` | Display text or JSX element |
| `icon` | `ReactNode` | Icon to display alongside label |
| `disabled` | `boolean` | Whether the item is disabled |
| `danger` | `boolean` | Display item in danger/destructive style |
| `type` | `'divider'` | Creates a divider line instead of menu item |
| `children` | `MenuProps['items']` | Sub-menu items for nested menus |

### Dropdown.Button Props

`Dropdown.Button` extends Dropdown props and adds:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttonsRender` | `(buttons: ReactNode[]) => ReactNode[]` | - | Custom button rendering |
| `icon` | `ReactNode` | `<DownOutlined />` | Icon for the split button |
| `loading` | `boolean \| { delay: number }` | `false` | Show loading indicator |
| `type` | `ButtonType` | `'default'` | Button type (primary, default, dashed, etc.) |
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Button size |
| `onClick` | `(e: MouseEvent) => void` | - | Click handler for main button |

---

## 4. Variants & Patterns

### Trigger Types

#### Hover Trigger (Default)

```typescript
<Dropdown menu={{ items }}>
  <a>Hover me</a>
</Dropdown>
```

The menu appears on hover. This is the default behavior.

#### Click Trigger

```typescript
<Dropdown menu={{ items }} trigger={['click']}>
  <a>Click me</a>
</Dropdown>
```

The menu appears on click instead of hover.

#### Context Menu (Right-Click)

```typescript
<Dropdown menu={{ items }} trigger={['contextMenu']}>
  <div style={{
    textAlign: 'center',
    height: 200,
    lineHeight: '200px',
    border: '1px dashed #ccc'
  }}>
    Right click on me
  </div>
</Dropdown>
```

The menu appears on right-click. When using `contextMenu`, the popup position follows the right-click cursor position.

#### Combined Triggers

```typescript
<Dropdown menu={{ items }} trigger={['click', 'hover']}>
  <a>Click or hover</a>
</Dropdown>
```

Multiple trigger types can be combined.

### Placement/Positioning

Ant Design supports 6 placement options:

```typescript
const App: React.FC = () => (
  <Space direction="vertical" size="large">
    <Space wrap>
      <Dropdown menu={{ items }} placement="bottomLeft">
        <Button>bottomLeft</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="bottomCenter">
        <Button>bottomCenter</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Button>bottomRight</Button>
      </Dropdown>
    </Space>
    <Space wrap>
      <Dropdown menu={{ items }} placement="topLeft">
        <Button>topLeft</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="topCenter">
        <Button>topCenter</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="topRight">
        <Button>topRight</Button>
      </Dropdown>
    </Space>
  </Space>
);
```

The `autoAdjustOverflow` prop (default: `true`) automatically adjusts placement when the dropdown would appear off-screen.

### Menu Items with Icons

```typescript
import { MailOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';

const items: MenuProps['items'] = [
  {
    label: 'Email',
    key: 'email',
    icon: <MailOutlined />,
  },
  {
    label: 'Profile',
    key: 'profile',
    icon: <UserOutlined />,
  },
  {
    label: 'Settings',
    key: 'settings',
    icon: <SettingOutlined />,
  },
];
```

Icons enhance menu items with visual indicators.

### Dividers

```typescript
const items: MenuProps['items'] = [
  {
    label: 'Action 1',
    key: '1',
  },
  {
    label: 'Action 2',
    key: '2',
  },
  {
    type: 'divider',
  },
  {
    label: 'Separated Action',
    key: '3',
  },
];
```

Dividers visually separate groups of menu items.

### Disabled Items

```typescript
const items: MenuProps['items'] = [
  {
    label: 'Available Action',
    key: '1',
  },
  {
    label: 'Disabled Action',
    key: '2',
    disabled: true,
  },
];
```

Disabled items appear grayed out and are not clickable.

### Danger/Destructive Actions

```typescript
const items: MenuProps['items'] = [
  {
    label: 'Edit',
    key: 'edit',
  },
  {
    type: 'divider',
  },
  {
    label: 'Delete',
    key: 'delete',
    danger: true,
  },
];
```

The `danger` property styles the item in red to indicate a destructive action.

### Nested/Cascading Menus

```typescript
const items: MenuProps['items'] = [
  {
    label: 'Navigation',
    key: 'nav',
    children: [
      {
        label: 'Home',
        key: 'home',
      },
      {
        label: 'About',
        key: 'about',
      },
    ],
  },
  {
    label: 'Settings',
    key: 'settings',
    children: [
      {
        label: 'Profile Settings',
        key: 'profile-settings',
      },
      {
        label: 'Account Settings',
        key: 'account-settings',
      },
    ],
  },
];
```

Use the `children` property to create nested sub-menus. Sub-menus appear on hover or click.

### Custom Content with popupRender

```typescript
const App: React.FC = () => (
  <Dropdown
    menu={{ items }}
    dropdownRender={(menu) => (
      <div>
        <div style={{ padding: 8, background: '#f0f0f0' }}>
          Custom Header
        </div>
        {menu}
        <div style={{ padding: 8, background: '#f0f0f0' }}>
          Custom Footer
        </div>
      </div>
    )}
  >
    <a onClick={(e) => e.preventDefault()}>
      Custom Content
    </a>
  </Dropdown>
);
```

**Note:** `dropdownRender` has been deprecated in favor of `popupRender` in newer versions.

---

## 5. Composition Patterns

### With Button

The most common pattern - dropdown attached to a button:

```typescript
<Dropdown menu={{ items }}>
  <Button>
    Actions <DownOutlined />
  </Button>
</Dropdown>
```

### Dropdown Button (Split Button)

```typescript
import { Dropdown, Button } from 'antd';

const App: React.FC = () => (
  <Dropdown.Button
    menu={{ items }}
    onClick={() => console.log('Main button clicked')}
  >
    Primary Action
  </Dropdown.Button>
);
```

The `Dropdown.Button` provides a split button where the main button triggers a primary action and the dropdown icon shows additional options.

### With Navigation Links

```typescript
<Dropdown menu={{ items }}>
  <a onClick={(e) => e.preventDefault()}>
    <Space>
      User Menu
      <DownOutlined />
    </Space>
  </a>
</Dropdown>
```

Common in navigation bars for user menus, language selectors, etc.

### Table Row Actions

```typescript
const columns = [
  // ... other columns
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Dropdown menu={{
        items: [
          { label: 'Edit', key: 'edit' },
          { label: 'Delete', key: 'delete', danger: true },
        ],
        onClick: ({ key }) => handleAction(key, record)
      }}>
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
    ),
  },
];
```

Compact action menus for table rows.

### Context Menu

```typescript
<Dropdown menu={{ items }} trigger={['contextMenu']}>
  <div style={{ padding: 20, border: '1px solid #d9d9d9' }}>
    Right-click anywhere in this area
  </div>
</Dropdown>
```

Provides contextual actions for a specific area.

---

## 6. Styling & Theming

### CSS Variables (v5+)

Ant Design v5 uses CSS variables for theming. Enable CSS variable mode:

```typescript
import { ConfigProvider } from 'antd';

<ConfigProvider theme={{ cssVar: true }}>
  <App />
</ConfigProvider>
```

### Design Tokens

Customize the Dropdown component using design tokens:

```typescript
import { ConfigProvider } from 'antd';

<ConfigProvider
  theme={{
    token: {
      // Global tokens
      colorPrimary: '#00b96b',
      borderRadius: 2,
    },
    components: {
      Dropdown: {
        // Component-specific tokens
        controlItemBgHover: '#f5f5f5',
        controlItemBgActive: '#e6f7ff',
      },
    },
  }}
>
  <App />
</ConfigProvider>
```

### Custom Styling with overlayClassName and overlayStyle

```typescript
<Dropdown
  menu={{ items }}
  overlayClassName="custom-dropdown"
  overlayStyle={{
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    borderRadius: 8,
  }}
>
  <Button>Styled Dropdown</Button>
</Dropdown>
```

Use `overlayClassName` to apply custom CSS classes and `overlayStyle` for inline styles.

### Custom CSS

```css
.custom-dropdown {
  padding: 4px;
}

.custom-dropdown .ant-dropdown-menu-item {
  border-radius: 4px;
  margin: 2px 0;
}

.custom-dropdown .ant-dropdown-menu-item:hover {
  background-color: #e6f7ff;
}
```

---

## 7. Accessibility

### Current State

Ant Design Dropdown has **limited accessibility support** with known issues that need addressing:

**Known Issues:**
- **Keyboard Navigation:** Not fully keyboard accessible. There's an open GitHub issue (since 2020) requesting improvements.
- **Arrow Key Navigation:** Up/down arrow keys do not traverse menu items by default.
- **Escape Key:** Does not consistently close the menu.
- **SubMenu Navigation:** `Menu.SubMenu` is not keyboard accessible - pressing Enter does not open sub-menus.

### Supported Accessibility Features

**ARIA Attributes:**
- Basic ARIA labels are present on menu items
- Screen readers (like VoiceOver on Mac) can read menu item names
- `aria-labelledby` should be used to map labels to dropdowns

**Screen Reader Support:**
- Screen readers can announce menu items when they receive focus
- However, keyboard navigation issues prevent full screen reader accessibility

### Best Practices for Accessibility

1. **Always provide ARIA labels:**
```typescript
<Dropdown
  menu={{ items }}
  aria-label="Action menu"
>
  <Button>Actions</Button>
</Dropdown>
```

2. **Use semantic HTML:**
```typescript
<Dropdown menu={{ items }}>
  <button aria-haspopup="true" aria-expanded={open}>
    Menu
  </button>
</Dropdown>
```

3. **Implement custom keyboard handlers when needed:**
```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Escape') {
    setOpen(false);
  }
};

<div onKeyDown={handleKeyDown}>
  <Dropdown menu={{ items }} open={open} onOpenChange={setOpen}>
    <Button>Actions</Button>
  </Dropdown>
</div>
```

4. **Ensure sufficient color contrast** for disabled and danger items.

5. **Test with screen readers** (NVDA, JAWS, VoiceOver) to verify functionality.

### Recommendations

- Monitor the Ant Design GitHub repository for accessibility improvements
- Consider implementing custom keyboard event handlers for critical dropdowns
- For fully accessible applications, you may need to augment Ant Design's dropdown with additional ARIA attributes and keyboard handlers
- Follow WCAG 2.1 guidelines for dropdown menus

---

## 8. Best Practices

### When to Use Dropdown vs Menu vs Select

**Use Dropdown when:**
- You need to trigger **actions** (edit, delete, share, etc.)
- Creating toolbar or navigation menus
- Providing contextual actions (right-click menus)
- The user is executing commands, not selecting values
- You want actions attached to a button or link

**Use Menu when:**
- Building standalone navigation menus (sidebars, top bars)
- Creating vertical or horizontal navigation structures
- You need collapsible/expandable menu sections
- Building the menu content that goes inside a Dropdown

**Use Select when:**
- Collecting **form input** from users
- User needs to choose one or more values to submit
- You need searchable/filterable options
- The component is part of a form
- You want an elegant alternative to `<select>` HTML element

**Key Distinction:** Dropdown = Actions | Menu = Navigation | Select = Form Input

### Common Patterns

1. **User Account Menu:**
```typescript
const userMenuItems = [
  { label: 'Profile', key: 'profile', icon: <UserOutlined /> },
  { label: 'Settings', key: 'settings', icon: <SettingOutlined /> },
  { type: 'divider' },
  { label: 'Logout', key: 'logout', danger: true },
];

<Dropdown menu={{ items: userMenuItems, onClick: handleUserAction }}>
  <Avatar icon={<UserOutlined />} />
</Dropdown>
```

2. **Table Row Actions:**
```typescript
const rowActions = (record) => [
  { label: 'View', key: 'view' },
  { label: 'Edit', key: 'edit' },
  { type: 'divider' },
  { label: 'Delete', key: 'delete', danger: true },
];

<Dropdown menu={{ items: rowActions(record), onClick: (e) => handleRowAction(e, record) }}>
  <Button icon={<MoreOutlined />} />
</Dropdown>
```

3. **Bulk Actions:**
```typescript
<Dropdown.Button
  menu={{ items: bulkActions }}
  onClick={handlePrimaryAction}
  disabled={selectedRows.length === 0}
>
  Process Selected
</Dropdown.Button>
```

### Gotchas & Tips

1. **Prevent Default on Anchor Tags:**
```typescript
<a onClick={(e) => e.preventDefault()}>
  {/* Always prevent default on anchor triggers */}
</a>
```

2. **Child Element Requirements:**
The child of Dropdown must accept `onMouseEnter`, `onMouseLeave`, `onFocus`, and `onClick` events. If using a custom component, ensure it forwards these events:
```typescript
const CustomTrigger = React.forwardRef((props, ref) => (
  <div ref={ref} {...props}>
    Custom Trigger
  </div>
));

<Dropdown menu={{ items }}>
  <CustomTrigger />
</Dropdown>
```

3. **Menu Closes by Default:**
By default, clicking a menu item closes the dropdown. To prevent this:
```typescript
const handleMenuClick = (e) => {
  if (shouldStayOpen(e.key)) {
    e.domEvent.stopPropagation();
  }
};

<Dropdown menu={{ items, onClick: handleMenuClick }}>
  <Button>Actions</Button>
</Dropdown>
```

4. **getPopupContainer for Scrolling Areas:**
If the dropdown appears in a scrollable container, set `getPopupContainer` to ensure proper positioning:
```typescript
<Dropdown
  menu={{ items }}
  getPopupContainer={(triggerNode) => triggerNode.parentElement}
>
  <Button>Actions</Button>
</Dropdown>
```

5. **destroyOnHidden for Performance:**
If the dropdown content is expensive to render, use `destroyOnHidden` to unmount it when hidden:
```typescript
<Dropdown menu={{ items }} destroyOnHidden>
  <Button>Actions</Button>
</Dropdown>
```

6. **Deprecated Props:**
- Use `open` instead of `visible`
- Use `onOpenChange` instead of `onVisibleChange`
- Use `menu` instead of `overlay`
- Use `popupRender` instead of `dropdownRender`
- Use `destroyOnHidden` instead of `destroyPopupOnHide`

---

## 9. Comparison Notes

### Unique Characteristics of Ant Design Dropdown

1. **Menu-Focused, Not Form-Focused:**
   - Ant Design clearly separates Dropdown (actions) from Select (form input)
   - This is a **menu-oriented component** for triggering commands
   - Unlike some frameworks where "dropdown" is ambiguous, Ant Design's naming is clear

2. **Modern API (v5):**
   - Uses `menu.items` array-based configuration instead of JSX
   - Cleaner TypeScript support with `MenuProps['items']`
   - CSS variables and design tokens for theming

3. **Three Trigger Modes:**
   - Supports hover, click, and contextMenu (right-click)
   - Right-click mode positions menu at cursor location
   - Can combine multiple trigger modes

4. **Dropdown.Button Variant:**
   - Provides a split button pattern out of the box
   - Main button for primary action, dropdown for secondary actions
   - Uncommon in other frameworks

5. **Integration with Menu Component:**
   - Dropdown uses Menu component internally
   - Menu items configuration is shared between standalone Menu and Dropdown
   - Consistent API across navigation components

6. **Limited Accessibility:**
   - Keyboard navigation not fully implemented (as of this research)
   - Known issue tracked on GitHub since 2020
   - Developers may need custom keyboard handlers for accessible apps

7. **popupRender for Custom Content:**
   - Allows wrapping or modifying the menu with custom content
   - Useful for adding headers, footers, or custom styling

8. **Six Placement Options:**
   - More placement options than many frameworks
   - `topLeft`, `topCenter`, `topRight`, `bottomLeft`, `bottomCenter`, `bottomRight`

9. **Arrow Customization:**
   - Can show/hide arrow
   - Arrow can point to center of trigger with `{ pointAtCenter: true }`

10. **Design Token System:**
    - Comprehensive theming via ConfigProvider
    - Component-specific and global tokens
    - CSS variable mode for dynamic theming

### Comparison to Other Frameworks

**vs Bootstrap Dropdown:**
- Ant Design has better TypeScript support
- Ant Design separates action menus (Dropdown) from form inputs (Select)
- Bootstrap's dropdown is more generic

**vs Material-UI Menu:**
- Similar menu-focused approach
- Ant Design has explicit Dropdown.Button variant
- Material-UI has better accessibility out of the box

**vs Chakra UI Menu:**
- Chakra UI has superior keyboard accessibility
- Ant Design has more built-in styling options
- Both clearly separate menu actions from form selects

---

## Summary

The Ant Design Dropdown is a **menu-focused component** designed for presenting **action menus and commands**, not form inputs. It provides:

- Multiple trigger modes (hover, click, right-click)
- Six placement options with automatic overflow adjustment
- Rich menu item features (icons, dividers, danger styling, disabled states, nested menus)
- Modern array-based menu configuration with TypeScript support
- Split button variant (Dropdown.Button) for primary + secondary actions
- Design token system for comprehensive theming
- Clear separation from Select (form input component)

**Key Strengths:**
- Clean, modern API with excellent TypeScript support
- Flexible trigger modes including contextMenu
- Comprehensive theming via design tokens
- Split button pattern built-in

**Key Limitations:**
- Limited keyboard accessibility (known issue)
- Some deprecated props in migration from v4 to v5
- Requires custom implementation for full WCAG compliance

**Best For:** Toolbar actions, user account menus, table row actions, context menus, navigation dropdowns, and any scenario requiring action/command menus rather than form value selection.

---

## References

- Official Documentation: https://ant.design/components/dropdown/
- GitHub Repository: https://github.com/ant-design/ant-design
- Accessibility Issue: https://github.com/ant-design/ant-design/issues/24173
- Design Tokens: https://ant.design/docs/react/customize-theme
- CSS Variables: https://ant.design/docs/react/css-variables
