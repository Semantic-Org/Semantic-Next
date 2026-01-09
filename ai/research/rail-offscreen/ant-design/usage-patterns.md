# Ant Design Drawer - Usage Patterns

## Component Overview

The Ant Design Drawer is an off-screen panel component that slides in from the edge of the viewport. It is designed for presenting supplementary content, forms, navigation, or additional information without fully replacing the main page content. Unlike modals that overlay and block interaction with the page behind, drawers can optionally push content to the side or overlay depending on the use case. The component supports multiple placement positions (left, right, top, bottom) and provides flexible sizing and styling options.

**Key Characteristics:**
- Off-screen panel that slides in/out from viewport edges
- Can overlay or push page content
- Supports nested drawers with independent state management
- Provides closable header with optional title and extra content
- Optional footer for action buttons
- Built-in mask/backdrop functionality
- Accessibility support with focus management

---

## Basic Usage

### Simple Drawer with Default Settings

```jsx
import { Drawer, Button } from 'antd';
import { useState } from 'react';

function BasicDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Drawer
      </Button>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <p>This is the drawer content.</p>
      </Drawer>
    </>
  );
}
```

### Drawer with Close Button Control

```jsx
<Drawer
  title="Drawer with Close Button"
  placement="right"
  onClose={() => setOpen(false)}
  open={open}
  closable={true}  // Default: shows close button in top-right
>
  Content goes here
</Drawer>
```

---

## Props/API

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls the visibility of the drawer (controlled component) |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | The position where the drawer slides in from |
| `onClose` | `(e?: React.KeyboardEvent \| React.MouseEvent) => void` | - | Callback triggered when the drawer should close (mask click, close button, ESC key, or Cancel button) |
| `afterOpenChange` | `(open: boolean) => void` | - | Callback fired after the open/close animation completes |
| `title` | `ReactNode` | - | The title displayed in the drawer header |
| `width` | `number \| string` | `378` | Width of the drawer (in pixels or percentage). Common preset: `736` for large |
| `height` | `number \| string` | `378` | Height of the drawer (for top/bottom placement, in pixels or percentage) |
| `closable` | `boolean` | `true` | Whether to display the close button in the top-right corner |
| `mask` | `boolean` | `true` | Whether to display a backdrop/overlay mask |
| `maskClosable` | `boolean` | `true` | Whether clicking the mask will close the drawer |
| `destroyOnClose` | `boolean` | `false` | Whether to unmount drawer children when closed |
| `footer` | `ReactNode` | - | Footer content for the drawer (typically action buttons) |
| `extra` | `ReactNode` | - | Extra content placed in the top-right corner of the header |
| `push` | `boolean \| { distance: number }` | `{ distance: 180 }` | Controls push behavior for nested drawers. `false` to disable, object to set distance |
| `bodyStyle` | `CSSProperties` | `{}` | Inline styles applied to the drawer content/body area |
| `headerStyle` | `CSSProperties` | `{}` | Inline styles applied to the drawer header |
| `footerStyle` | `CSSProperties` | `{}` | Inline styles applied to the drawer footer |
| `className` | `string` | - | CSS class applied to the drawer panel (v5+) |
| `rootClassName` | `string` | - | CSS class applied to the outermost drawer wrapper (v5+ replaces v4's `className`) |
| `style` | `CSSProperties` | - | Inline styles for the drawer panel (v5+) |
| `rootStyle` | `CSSProperties` | - | Inline styles for outermost wrapper (v5+ replaces v4's `style`) |
| `getContainer` | `string \| HTMLElement \| (() => HTMLElement)` | `body` | The container where the drawer portal is mounted |
| `zIndex` | `number` | `1000` | Z-index of the drawer |
| `loading` | `boolean` | - | Shows loading skeleton (v5.18.0+, replaces Spin with Skeleton) |

---

## Common Patterns

### Pattern: Basic Modal-Like Drawer with Title and Footer

The most common pattern combines title, body content, and footer action buttons for forms and multi-step tasks.

```jsx
import { Drawer, Button, Form, Input, Space } from 'antd';
import { useState } from 'react';

function FormDrawer() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = () => {
    // Form submission logic
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Create New Item
      </Button>
      <Drawer
        title="Create New Item"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name">
            <Input placeholder="Enter name" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
```

### Pattern: Drawer with Extra Header Content

Add custom content (like icons, badges, or additional controls) in the drawer header corner.

```jsx
<Drawer
  title="Settings"
  placement="right"
  onClose={handleClose}
  open={open}
  extra={
    <Button
      type="text"
      icon={<SettingsIcon />}
      onClick={handleExtraAction}
    />
  }
>
  Content with extra controls in header
</Drawer>
```

### Pattern: Responsive Width/Height

Adapt drawer size based on viewport or content needs.

```jsx
import { Drawer, Button } from 'antd';
import { useState } from 'react';

function ResponsiveDrawer() {
  const [open, setOpen] = useState(false);

  // Responsive width: 90% on mobile, fixed on desktop
  const drawerWidth = typeof window !== 'undefined'
    ? window.innerWidth < 768
      ? '90%'
      : 556
    : 556;

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer
        title="Responsive Drawer"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={drawerWidth}
      >
        Content adapts to screen size
      </Drawer>
    </>
  );
}
```

### Pattern: Drawer with Custom Styling

Apply custom styles to specific drawer sections.

```jsx
<Drawer
  title="Styled Drawer"
  placement="right"
  onClose={handleClose}
  open={open}
  headerStyle={{
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e8e8e8'
  }}
  bodyStyle={{
    padding: '24px',
    backgroundColor: '#fafafa'
  }}
  footerStyle={{
    textAlign: 'right',
    borderTop: '1px solid #e8e8e8'
  }}
>
  Drawer with custom header, body, and footer styles
</Drawer>
```

---

## Placement Patterns

The drawer can slide in from any edge of the viewport.

### Right Placement (Default)

Most common for side panels, navigation, and supplementary content.

```jsx
<Drawer
  title="Right Drawer"
  placement="right"
  onClose={handleClose}
  open={open}
  width={378}  // or 736 for large
>
  Content slides in from the right
</Drawer>
```

### Left Placement

Used for navigation menus, sidebars, or filter panels.

```jsx
<Drawer
  title="Left Navigation"
  placement="left"
  onClose={handleClose}
  open={open}
  width={250}
>
  Navigation menu content
</Drawer>
```

### Top Placement

Used for banners, announcements, or horizontal toolbars.

```jsx
<Drawer
  title="Top Toolbar"
  placement="top"
  onClose={handleClose}
  open={open}
  height={200}
>
  Content slides in from the top
</Drawer>
```

### Bottom Placement

Used for action sheets, bottom panels, or supplementary toolbars (common in mobile).

```jsx
<Drawer
  title="Bottom Action Sheet"
  placement="bottom"
  onClose={handleClose}
  open={open}
  height={300}
>
  Action sheet content
</Drawer>
```

---

## Size Patterns

### Preset Sizes

```jsx
// Small drawer (default)
<Drawer width={378} {...props}>
  Default size: 378px
</Drawer>

// Large drawer (preset)
<Drawer width={736} {...props}>
  Large size: 736px
</Drawer>

// Custom width
<Drawer width={500} {...props}>
  Custom width: 500px
</Drawer>

// Percentage width
<Drawer width="80%" {...props}>
  Percentage width: 80%
</Drawer>

// Full viewport width
<Drawer width="100vw" {...props}>
  Full width drawer
</Drawer>
```

### Responsive Sizing

```jsx
function ResponsiveDrawerSizes() {
  const [open, setOpen] = useState(false);

  const getDrawerWidth = () => {
    const width = window.innerWidth;
    if (width < 576) return '95%';      // Mobile
    if (width < 768) return '80%';      // Tablet
    if (width < 1200) return '70%';     // Small desktop
    return 556;                          // Large desktop
  };

  return (
    <Drawer
      width={getDrawerWidth()}
      {...otherProps}
    />
  );
}
```

### Height Sizing for Top/Bottom Placement

```jsx
// Small height panel
<Drawer placement="bottom" height={200} {...props} />

// Medium height panel
<Drawer placement="bottom" height={400} {...props} />

// Large height panel (3/4 of viewport)
<Drawer placement="bottom" height="75vh" {...props} />
```

---

## Content Patterns

### Header Structure

The drawer header automatically includes the title and close button. Additional content goes in `extra`.

```jsx
<Drawer
  title={<h2>Main Title</h2>}
  placement="right"
  onClose={handleClose}
  open={open}
  extra={
    <Tooltip title="Help">
      <InfoIcon onClick={() => setShowHelp(true)} />
    </Tooltip>
  }
  closable={true}  // Shows X button
>
  Body content here
</Drawer>
```

### Body Content Patterns

#### Simple Text Content

```jsx
<Drawer {...props}>
  <p>Simple paragraph content</p>
</Drawer>
```

#### Form Content

```jsx
<Drawer
  title="Form in Drawer"
  footer={
    <Space style={{ float: 'right' }}>
      <Button>Cancel</Button>
      <Button type="primary">Submit</Button>
    </Space>
  }
  {...props}
>
  <Form layout="vertical">
    <Form.Item label="Email">
      <Input type="email" />
    </Form.Item>
    <Form.Item label="Message">
      <Input.TextArea rows={4} />
    </Form.Item>
  </Form>
</Drawer>
```

#### List Content

```jsx
<Drawer {...props}>
  <List
    dataSource={items}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta
          title={item.title}
          description={item.description}
        />
      </List.Item>
    )}
  />
</Drawer>
```

#### Scrollable Content

```jsx
<Drawer
  {...props}
  bodyStyle={{
    overflow: 'auto',
    height: 'calc(100% - 108px)'  // Account for header/footer
  }}
>
  {/* Long content that scrolls */}
</Drawer>
```

### Footer Patterns

#### Action Buttons Footer

```jsx
<Drawer
  footer={
    <Space style={{ float: 'right' }}>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button type="primary" onClick={handleSave}>
        Save
      </Button>
    </Space>
  }
  {...props}
>
  Form content
</Drawer>
```

#### Status Footer

```jsx
<Drawer
  footer={
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>Last saved: {lastSavedTime}</span>
      <Button type="primary">Save</Button>
    </div>
  }
  {...props}
>
  Content
</Drawer>
```

#### Multi-Action Footer

```jsx
<Drawer
  footer={
    <Space style={{ float: 'right' }}>
      <Button danger>Delete</Button>
      <Button>Reset</Button>
      <Button onClick={onClose}>Cancel</Button>
      <Button type="primary" onClick={onSave}>
        Save Changes
      </Button>
    </Space>
  }
  {...props}
>
  Form content
</Drawer>
```

---

## State Patterns

### Controlled Component (Recommended)

The drawer is a controlled component using the `open` prop.

```jsx
function ControlledDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        {...otherProps}
      />
    </>
  );
}
```

### State Management with Forms

Combine drawer state with form state for complex interactions.

```jsx
import { Drawer, Form, Button, Input } from 'antd';
import { useState } from 'react';

function FormDrawer() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // API call
      await api.saveData(values);
      setOpen(false);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Edit Item"
      open={open}
      onClose={() => setOpen(false)}
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
```

### Multiple Drawer States

Managing multiple independent drawers in the same component.

```jsx
function MultipleDrawers() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setCreateOpen(true)}>Create</Button>
      <Button onClick={() => setEditOpen(true)}>Edit</Button>
      <Button onClick={() => setSettingsOpen(true)}>Settings</Button>

      <Drawer
        title="Create"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <Drawer
        title="Edit"
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
      <Drawer
        title="Settings"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
```

---

## Animation Patterns

### Lifecycle Callbacks

The `afterOpenChange` callback fires after animations complete.

```jsx
function DrawerWithAnimation() {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      afterOpenChange={(isOpen) => {
        setIsAnimating(false);
        if (isOpen) {
          console.log('Drawer fully opened');
          // Load data or focus elements
        } else {
          console.log('Drawer fully closed');
          // Cleanup or reset state
        }
      }}
      {...otherProps}
    >
      Content
    </Drawer>
  );
}
```

### Custom Animation Timing

Perform actions after the drawer animation completes.

```jsx
function AnimatedDrawerContent() {
  const [open, setOpen] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  const handleAfterOpenChange = (isOpen) => {
    if (isOpen) {
      // Data loads after drawer opens completely
      setContentReady(true);
    } else {
      setContentReady(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      afterOpenChange={handleAfterOpenChange}
    >
      {contentReady ? <ComplexContent /> : <LoadingSpinner />}
    </Drawer>
  );
}
```

### Disable Animation

While Ant Design doesn't directly expose an animation disable prop, you can use CSS to control animation behavior.

```jsx
// Via CSS
<Drawer
  rootClassName="no-animation"
  {...props}
>
  Content
</Drawer>

// CSS
const styles = `
  .no-animation.ant-drawer-content-wrapper {
    animation: none !important;
  }
`;
```

---

## Nested Drawers

### Basic Nested Drawer Pattern

Opening a drawer from within another drawer.

```jsx
import { Drawer, Button } from 'antd';
import { useState } from 'react';

function NestedDrawers() {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setParentOpen(true)}>Open Parent</Button>

      <Drawer
        title="Parent Drawer"
        placement="right"
        open={parentOpen}
        onClose={() => setParentOpen(false)}
        width={556}
      >
        <p>Parent drawer content</p>
        <Button
          type="primary"
          onClick={() => setChildOpen(true)}
        >
          Open Child Drawer
        </Button>

        <Drawer
          title="Child Drawer"
          placement="right"
          open={childOpen}
          onClose={() => setChildOpen(false)}
          width={400}
        >
          <p>Child drawer content</p>
        </Drawer>
      </Drawer>
    </>
  );
}
```

### Push Behavior for Nested Drawers

Control how nested drawers interact with the page content.

```jsx
function NestedDrawersWithPush() {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);

  return (
    <Drawer
      title="Parent"
      open={parentOpen}
      onClose={() => setParentOpen(false)}
      push={{ distance: 180 }}  // Push page content 180px
    >
      <Button onClick={() => setChildOpen(true)}>Open Child</Button>

      <Drawer
        title="Child"
        open={childOpen}
        onClose={() => setChildOpen(false)}
        push={false}  // Child drawer overlays without pushing
      >
        Child content
      </Drawer>
    </Drawer>
  );
}
```

### Multi-Level Nested Drawers

Managing three or more nested drawers with independent state.

```jsx
function MultiLevelNested() {
  const [level1, setLevel1] = useState(false);
  const [level2, setLevel2] = useState(false);
  const [level3, setLevel3] = useState(false);

  return (
    <>
      <Button onClick={() => setLevel1(true)}>Level 1</Button>

      <Drawer
        title="Level 1"
        open={level1}
        onClose={() => setLevel1(false)}
        width={600}
      >
        <Button onClick={() => setLevel2(true)}>Open Level 2</Button>

        <Drawer
          title="Level 2"
          open={level2}
          onClose={() => setLevel2(false)}
          width={500}
        >
          <Button onClick={() => setLevel3(true)}>Open Level 3</Button>

          <Drawer
            title="Level 3"
            open={level3}
            onClose={() => setLevel3(false)}
            width={400}
          >
            Final level content
          </Drawer>
        </Drawer>
      </Drawer>
    </>
  );
}
```

### Z-Index Management for Nested Drawers

Ensure proper stacking order for nested drawers.

```jsx
function NestedWithZIndex() {
  const [parent, setParent] = useState(false);
  const [child, setChild] = useState(false);

  return (
    <>
      <Drawer
        title="Parent"
        open={parent}
        onClose={() => setParent(false)}
        zIndex={1000}
      >
        <Button onClick={() => setChild(true)}>Open Child</Button>

        <Drawer
          title="Child"
          open={child}
          onClose={() => setChild(false)}
          zIndex={1001}  // Higher z-index ensures child appears on top
        >
          Child content
        </Drawer>
      </Drawer>
    </>
  );
}
```

---

## Accessibility

### ARIA Labels and Roles

```jsx
<Drawer
  title="Accessible Drawer"
  open={open}
  onClose={handleClose}
  // Implicit role="dialog" and aria-label from title
>
  <div role="main">
    Accessible content with semantic structure
  </div>
</Drawer>
```

### Keyboard Navigation

The drawer supports standard keyboard interactions:
- **ESC key**: Closes the drawer (when `maskClosable={true}`)
- **Tab**: Navigates through focusable elements within the drawer
- **Shift+Tab**: Reverse navigation
- **Enter**: Activates buttons and form submissions

```jsx
function AccessibleDrawer() {
  const [open, setOpen] = useState(false);
  const firstInputRef = useRef(null);

  const handleAfterOpenChange = (isOpen) => {
    if (isOpen && firstInputRef.current) {
      // Focus first input after drawer opens
      firstInputRef.current.focus();
    }
  };

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      afterOpenChange={handleAfterOpenChange}
    >
      <label htmlFor="name">Name:</label>
      <input ref={firstInputRef} id="name" />
      {/* ESC key automatically closes drawer */}
    </Drawer>
  );
}
```

### Focus Management

The drawer should manage focus properly for screen readers and keyboard users.

```jsx
function FocusAwareDrawer() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);

  const handleClose = () => {
    setOpen(false);
    // Return focus to trigger button (application-specific)
  };

  return (
    <>
      <Button
        id="openButton"
        onClick={() => setOpen(true)}
      >
        Open
      </Button>
      <Drawer
        open={open}
        onClose={handleClose}
        aria-labelledby="drawer-title"
        // Consider implementing focus trap
      >
        <h2 id="drawer-title">Drawer Title</h2>
        {/* Content with proper semantic HTML */}
      </Drawer>
    </>
  );
}
```

### Semantic HTML Structure

Use proper semantic HTML within the drawer for better accessibility.

```jsx
<Drawer title="Article">
  <article>
    <h2>Article Title</h2>
    <p>Article content...</p>
  </article>
</Drawer>

// Form drawer
<Drawer title="Create Item">
  <form>
    <fieldset>
      <legend>User Information</legend>
      <input type="text" aria-label="User Name" />
    </fieldset>
  </form>
</Drawer>
```

### Screen Reader Announcements

Provide context for screen reader users through proper labeling.

```jsx
<Drawer
  title="Save Changes?"  // Announced to screen readers
  open={open}
  onClose={handleClose}
  aria-describedby="drawer-description"
>
  <p id="drawer-description">
    Your changes will be saved to the database.
  </p>
</Drawer>
```

---

## Integration Patterns

### Drawer with Form Submission

```jsx
import { Drawer, Form, Button, Input, message } from 'antd';
import { useState } from 'react';

function FormDrawerIntegration() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // API call
      await saveData(values);
      message.success('Saved successfully');
      setOpen(false);
    } catch (error) {
      message.error('Failed to save');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Create New
      </Button>
      <Drawer
        title="Create New Item"
        open={open}
        onClose={() => {
          setOpen(false);
          form.resetFields();
        }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" onClick={() => form.submit()}>
              Submit
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
```

### Drawer with Navigation

```jsx
import { Drawer, Menu } from 'antd';
import { useState } from 'react';

function NavigationDrawer() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { key: '1', label: 'Dashboard', icon: <DashboardIcon /> },
    { key: '2', label: 'Settings', icon: <SettingsIcon /> },
    { key: '3', label: 'Profile', icon: <UserIcon /> },
  ];

  const handleMenuClick = (e) => {
    // Navigate to section
    navigate(`/${e.key}`);
    setOpen(false);  // Close drawer after selection
  };

  return (
    <Drawer
      title="Navigation"
      placement="left"
      onClose={() => setOpen(false)}
      open={open}
      closable={true}
    >
      <Menu
        items={menuItems}
        onClick={handleMenuClick}
        mode="vertical"
      />
    </Drawer>
  );
}
```

### Drawer with Data Display

```jsx
import { Drawer, Skeleton, Empty } from 'antd';
import { useEffect, useState } from 'react';

function DataDisplayDrawer() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      // Fetch data
      fetchData().then((result) => {
        setData(result);
        setLoading(false);
      });
    }
  }, [open]);

  return (
    <Drawer
      title="Item Details"
      open={open}
      onClose={() => setOpen(false)}
    >
      {loading ? (
        <Skeleton active />
      ) : data ? (
        <div>
          <p><strong>Title:</strong> {data.title}</p>
          <p><strong>Description:</strong> {data.description}</p>
        </div>
      ) : (
        <Empty />
      )}
    </Drawer>
  );
}
```

### Drawer with Dynamic Content

```jsx
function DynamicDrawer() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('view');

  const renderContent = () => {
    switch (content) {
      case 'view':
        return <ViewContent />;
      case 'edit':
        return <EditContent />;
      case 'delete':
        return <DeleteConfirmation />;
      default:
        return null;
    }
  };

  return (
    <Drawer
      title={content.charAt(0).toUpperCase() + content.slice(1)}
      open={open}
      onClose={() => {
        setOpen(false);
        setContent('view');
      }}
    >
      {renderContent()}
    </Drawer>
  );
}
```

---

## Advanced Patterns

### Custom Drawer with Hooks

```jsx
import { Drawer, Button } from 'antd';
import { useState } from 'react';

// Custom hook for drawer state management
function useDrawer(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  const [data, setData] = useState(null);

  return {
    open,
    setOpen,
    data,
    setData,
    openDrawer: (item) => {
      setData(item);
      setOpen(true);
    },
    closeDrawer: () => {
      setOpen(false);
      setTimeout(() => setData(null), 300); // Clear after animation
    }
  };
}

// Usage
function ComponentWithCustomHook() {
  const drawer = useDrawer();

  return (
    <>
      <Button onClick={() => drawer.openDrawer({ id: 1, name: 'Item' })}>
        Open
      </Button>
      <Drawer
        open={drawer.open}
        onClose={drawer.closeDrawer}
      >
        {drawer.data && <div>{drawer.data.name}</div>}
      </Drawer>
    </>
  );
}
```

### Drawer with Validation and Error Handling

```jsx
function DrawerWithValidation() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [errors, setErrors] = useState({});

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.name || values.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = 'Invalid email address';
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const validationErrors = validateForm(values);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Submit logic
      setOpen(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Drawer
      title="Add Item"
      open={open}
      onClose={() => setOpen(false)}
      footer={
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
```

### Drawer with Event Coordination

```jsx
function DrawerWithEventCoordination() {
  const [drawers, setDrawers] = useState({
    create: false,
    edit: false,
    delete: false
  });

  const openDrawer = (type) => {
    // Close all other drawers before opening new one
    setDrawers({
      create: false,
      edit: false,
      delete: false,
      [type]: true
    });
  };

  const closeDrawer = (type) => {
    setDrawers(prev => ({ ...prev, [type]: false }));
  };

  return (
    <>
      <Button onClick={() => openDrawer('create')}>Create</Button>
      <Button onClick={() => openDrawer('edit')}>Edit</Button>
      <Button onClick={() => openDrawer('delete')}>Delete</Button>

      <Drawer
        title="Create"
        open={drawers.create}
        onClose={() => closeDrawer('create')}
      >
        Create content
      </Drawer>
      <Drawer
        title="Edit"
        open={drawers.edit}
        onClose={() => closeDrawer('edit')}
      >
        Edit content
      </Drawer>
      <Drawer
        title="Delete"
        open={drawers.delete}
        onClose={() => closeDrawer('delete')}
      >
        Delete content
      </Drawer>
    </>
  );
}
```

### Drawer Container with Portal

Specify where the drawer mounts in the DOM for better layout control.

```jsx
function DrawerWithPortal() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  return (
    <>
      <div ref={containerRef} style={{ position: 'relative' }}>
        {/* Main content */}
      </div>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        getContainer={() => containerRef.current || document.body}
      >
        Content
      </Drawer>
    </>
  );
}
```

---

## Notes

### Important Observations

1. **Controlled Component**: Ant Design Drawer requires the `open` prop to be managed by the parent component. It doesn't have internal state management.

2. **onClose Behavior**: The `onClose` callback is triggered when the user attempts to close (mask click, close button, ESC key), but doesn't automatically close the drawer. The parent component must update the `open` state.

3. **destroyOnClose**: When `true`, unmounts children when the drawer closes. Useful for heavy components but may cause form data loss if not carefully managed with `Form.preserve`.

4. **Push vs Overlay**:
   - Default behavior is overlay (drawer appears on top of content)
   - `push={true}` or `push={{ distance: 180 }}` pushes page content aside
   - Useful for drawer-heavy applications but can cause layout shifts

5. **Animation Completion**: Use `afterOpenChange` callback to perform actions after animations complete, such as loading data or setting focus.

6. **Nested Drawer Z-Index**: Ant Design automatically manages z-index for nested drawers in most cases, but explicit `zIndex` prop can be set if needed.

7. **Header vs Extra**:
   - `title` is the main heading
   - `extra` is for supplementary controls (icons, buttons)
   - `closable` prop controls the close button visibility

8. **Footer Implementation**: Footer must be implemented using the `footer` prop and should include action buttons. Cannot use footer content directly.

9. **Scrolling Content**: When content exceeds drawer height, set `bodyStyle={{ overflow: 'auto' }}` to enable scrolling within the drawer body.

10. **Form Preservation**: When using forms with `destroyOnClose={true}`, use `<Form preserve={false}>` to control form state behavior independently.

11. **Mask Interactions**:
    - `mask={false}` removes the backdrop entirely
    - `maskClosable={false}` prevents closing via mask click but shows the mask

12. **API Changes (v4 to v5)**:
    - `className` and `style` now apply to the panel (not the wrapper)
    - Use `rootClassName` and `rootStyle` for the outermost element (v4 behavior)
    - `loading` prop now accepts only boolean (v5.18.0+)

13. **Responsive Design**: For mobile apps, use percentage-based widths or viewport units (e.g., `width="80vw"`) rather than fixed pixels.

14. **Keyboard Support**: Drawer supports ESC key to close and Tab key for navigation. Ensure focusable elements are properly ordered for keyboard users.

15. **Container Positioning**: The `getContainer` prop allows mounting the drawer to a specific DOM element rather than the body, useful for container-scoped modals.

---

## Related Resources

- [Ant Design Official Documentation](https://ant.design/components/drawer)
- [Ant Design GitHub Repository](https://github.com/ant-design/ant-design)
- [Ant Design v5 Migration Guide](https://ant.design/docs/react/migration-v5)
