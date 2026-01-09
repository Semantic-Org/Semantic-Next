# Ant Design - Collapse Component

## Component Overview

The Collapse component (also called Accordion in some contexts) is a content container that allows users to toggle the visibility of content sections. It's designed to organize and present information in a compact, organized manner while keeping the interface clean by hiding complex regions until they're needed.

**Key characteristics:**
- Expandable/collapsible content panels
- Support for both multi-select (Collapse) and single-select (Accordion) modes
- Customizable styling with bordered and ghost variants
- Support for icon customization and positioning
- Built-in support for nested collapse components
- Lazy rendering of inactive panels (with option to force render)

**Common use cases:**
- FAQs and help documentation
- Settings and preferences panels
- Feature lists and expandable content
- Hierarchical information organization
- Form step-by-step wizards
- Nested navigation menus

---

## Usage Patterns

### Basic Usage

The simplest implementation with default styling and behavior:

```jsx
import { Collapse } from 'antd';
const { Panel } = Collapse;

export default function BasicCollapse() {
  return (
    <Collapse>
      <Panel header="Section 1: Panel Header" key="1">
        <p>Panel content goes here. This panel can be expanded or collapsed by clicking the header.</p>
      </Panel>
      <Panel header="Section 2: Panel Header" key="2">
        <p>Additional panel content for the second section.</p>
      </Panel>
      <Panel header="Section 3: Panel Header" key="3">
        <p>Third section content with more information.</p>
      </Panel>
    </Collapse>
  );
}
```

**Key elements:**
- `Collapse` - Container component for panels
- `Panel` - Individual expandable/collapsible section
- `header` prop - Title text displayed in the panel header
- `key` prop - Unique identifier for the panel

### Default Active Panels

Set which panels are expanded when the component first renders:

```jsx
<Collapse defaultActiveKey={['1', '2']}>
  <Panel header="Section 1" key="1">
    <p>This panel is expanded by default.</p>
  </Panel>
  <Panel header="Section 2" key="2">
    <p>This panel is also expanded by default.</p>
  </Panel>
  <Panel header="Section 3" key="3">
    <p>This panel is collapsed by default.</p>
  </Panel>
</Collapse>
```

**Features:**
- `defaultActiveKey` - Array of panel keys to expand initially
- Multiple panels can be open simultaneously
- Non-controlled mode (state managed internally by Collapse)

### Accordion Mode

Only one panel can be expanded at a time. When a new panel is opened, any previously open panel automatically closes:

```jsx
<Collapse accordion defaultActiveKey={['1']}>
  <Panel header="Section 1" key="1">
    <p>Accordion mode - only one panel can be open at a time.</p>
  </Panel>
  <Panel header="Section 2" key="2">
    <p>Opening this panel will automatically close any previously open panel.</p>
  </Panel>
  <Panel header="Section 3" key="3">
    <p>Third accordion section.</p>
  </Panel>
</Collapse>
```

**Key difference from basic collapse:**
- `accordion` prop set to `true`
- Mutually exclusive panel expansion
- Ideal for single-selection scenarios (similar to accordion UI pattern)

### Controlled Mode

Manage the expanded panels externally via state:

```jsx
import { Collapse } from 'antd';
import { useState } from 'react';

const { Panel } = Collapse;

export default function ControlledCollapse() {
  const [activeKeys, setActiveKeys] = useState(['1']);

  const handleChange = (keys) => {
    console.log('Panels changed:', keys);
    setActiveKeys(keys);
  };

  return (
    <>
      <button onClick={() => setActiveKeys(['1', '2', '3'])}>
        Expand All
      </button>
      <button onClick={() => setActiveKeys([])}>
        Collapse All
      </button>

      <Collapse activeKey={activeKeys} onChange={handleChange}>
        <Panel header="Section 1" key="1">
          <p>Content 1</p>
        </Panel>
        <Panel header="Section 2" key="2">
          <p>Content 2</p>
        </Panel>
        <Panel header="Section 3" key="3">
          <p>Content 3</p>
        </Panel>
      </Collapse>
    </>
  );
}
```

**Control features:**
- `activeKey` prop - Directly control which panels are open
- `onChange` callback - Triggered when user expands/collapses a panel
- Enables "Expand All" / "Collapse All" buttons
- Full programmatic control over expansion state

---

## Variants/Styles

### Bordered Collapse (Default)

Standard styling with borders around each panel:

```jsx
<Collapse bordered={true} defaultActiveKey={['1']}>
  <Panel header="Bordered Panel" key="1">
    <p>Default bordered style with visible borders.</p>
  </Panel>
</Collapse>
```

**Characteristics:**
- Visible borders around each panel
- Clear visual separation between panels
- Default styling when `bordered` prop is not specified
- Best for formal, structured layouts

### Borderless Collapse

Removes borders for a cleaner, more minimal appearance:

```jsx
<Collapse bordered={false} defaultActiveKey={['1']}>
  <Panel header="Borderless Panel 1" key="1">
    <p>Clean, minimal style without visible borders.</p>
  </Panel>
  <Panel header="Borderless Panel 2" key="2">
    <p>Content appears seamlessly within the layout.</p>
  </Panel>
</Collapse>
```

**Characteristics:**
- No borders between panels
- Cleaner, more modern appearance
- Better integration with surrounding content
- Useful for documentation and help sections

### Ghost Mode

Lightweight styling that blends into the background:

```jsx
<Collapse ghost defaultActiveKey={['overview']}>
  <Panel header={<div className="ghost-header">Overview</div>} key="overview">
    <p>Ghost mode content blends into the background.</p>
  </Panel>
  <Panel header={<div className="ghost-header">Details</div>} key="details">
    <p>Minimal styling for a subtle appearance.</p>
  </Panel>
</Collapse>
```

**Characteristics:**
- Minimal styling, no background color
- Transparent/ghost appearance
- Best for embedded panels within larger layouts
- Useful for settings and preference sections

---

## States

### Default State

Panel is collapsed (not visible) when component first renders:

```jsx
<Collapse>
  <Panel header="Collapsed by default" key="1">
    <p>This content is not visible initially.</p>
  </Panel>
</Collapse>
```

### Expanded State

Panel is expanded (visible) when component first renders or when user clicks:

```jsx
<Collapse defaultActiveKey={['1']}>
  <Panel header="Expanded by default" key="1">
    <p>This content is visible when component loads.</p>
  </Panel>
</Collapse>
```

### Disabled Panel

Panel cannot be expanded or collapsed:

```jsx
<Collapse>
  <Panel header="Normal Panel" key="1">
    <p>This panel can be toggled normally.</p>
  </Panel>
  <Panel header="Disabled Panel" key="2" disabled>
    <p>This content is locked and cannot be expanded.</p>
  </Panel>
</Collapse>
```

**Characteristics:**
- Panel header appears grayed out
- No click interaction on disabled panel
- Content remains hidden
- Visual indicator of disabled state

### Collapsible Control

Control which elements trigger the expand/collapse action:

```jsx
<Collapse>
  <Panel
    header="Click anywhere on header"
    key="1"
    collapsible="header"
  >
    <p>Default: clicking header toggles the panel.</p>
  </Panel>

  <Panel
    header="Click only the arrow icon"
    key="2"
    collapsible="icon"
  >
    <p>Only clicking the arrow icon will toggle this panel.</p>
  </Panel>

  <Panel
    header="Cannot be collapsed"
    key="3"
    collapsible="disabled"
  >
    <p>This panel is always expanded and cannot be collapsed.</p>
  </Panel>
</Collapse>
```

**Options:**
- `"header"` (default) - Entire header is clickable
- `"icon"` - Only arrow icon is clickable
- `"disabled"` - Panel cannot be collapsed once expanded

---

## Sizing Options

Ant Design Collapse does not have built-in size variants (small, medium, large). However, sizing is controlled through:

### Via Container Width

Control collapse width by wrapping in a sized container:

```jsx
<div style={{ width: '100%' }}>
  <Collapse defaultActiveKey={['1']}>
    <Panel header="Full width panel" key="1">
      <p>Stretches to fill container width.</p>
    </Panel>
  </Collapse>
</div>

<div style={{ width: '500px' }}>
  <Collapse defaultActiveKey={['1']}>
    <Panel header="Fixed width panel" key="1">
      <p>Fixed to 500px width.</p>
    </Panel>
  </Collapse>
</div>
```

### Via CSS Custom Styling

Customize font sizes and padding:

```jsx
<style>
  .custom-collapse :global(.ant-collapse-header) {
    font-size: 16px !important;
    padding: 16px !important;
  }

  .small-collapse :global(.ant-collapse-header) {
    font-size: 12px !important;
    padding: 8px !important;
  }
</style>

<Collapse className="custom-collapse" defaultActiveKey={['1']}>
  <Panel header="Custom sized panel" key="1">
    <p>Panel with custom sizing.</p>
  </Panel>
</Collapse>
```

---

## Layout & Positioning

### Vertical Layout (Default)

Panels stack vertically in a column:

```jsx
<Collapse defaultActiveKey={['1']}>
  <Panel header="Panel 1" key="1"><p>First panel</p></Panel>
  <Panel header="Panel 2" key="2"><p>Second panel</p></Panel>
  <Panel header="Panel 3" key="3"><p>Third panel</p></Panel>
</Collapse>
```

**Default behavior:**
- Panels stack vertically
- Full width of container
- Sequential layout

### Custom Layout with Spacing

Add spacing between panels using CSS:

```jsx
<Collapse
  className="spaced-collapse"
  defaultActiveKey={['1']}
>
  <Panel header="Panel 1" key="1"><p>Content 1</p></Panel>
  <Panel header="Panel 2" key="2"><p>Content 2</p></Panel>
  <Panel header="Panel 3" key="3"><p>Content 3</p></Panel>
</Collapse>

<style>
  .spaced-collapse :global(.ant-collapse-item) {
    margin-bottom: 16px;
  }

  .spaced-collapse :global(.ant-collapse-item:last-child) {
    margin-bottom: 0;
  }
</style>
```

### Icon Position

Control whether the expand/collapse arrow appears at the start or end of the header:

```jsx
<Collapse expandIconPosition="start" defaultActiveKey={['1']}>
  <Panel header="Arrow on the left" key="1">
    <p>Arrow icon positioned at the start of header.</p>
  </Panel>
</Collapse>

<Collapse expandIconPosition="end" defaultActiveKey={['1']}>
  <Panel header="Arrow on the right" key="2">
    <p>Arrow icon positioned at the end of header (default).</p>
  </Panel>
</Collapse>
```

**Options:**
- `"start"` - Arrow on the left side
- `"end"` (default) - Arrow on the right side
- Note: `"left"` and `"right"` are deprecated

### Nested Collapse

Collapse components can be nested within panel content:

```jsx
import { Collapse } from 'antd';

export default function NestedCollapse() {
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="Parent Panel 1" key="1">
        <Collapse defaultActiveKey={['nested1']}>
          <Panel header="Nested Panel 1.1" key="nested1">
            <p>Nested content goes here.</p>
          </Panel>
          <Panel header="Nested Panel 1.2" key="nested2">
            <p>More nested content.</p>
          </Panel>
        </Collapse>
      </Panel>
      <Panel header="Parent Panel 2" key="2">
        <p>Content that doesn't have nested panels.</p>
      </Panel>
    </Collapse>
  );
}
```

**Use cases:**
- Multi-level hierarchical content
- Categorized information with sub-categories
- Complex FAQ structures

---

## Content & Structure

### Text-Only Headers

Simple text headers without additional elements:

```jsx
<Collapse defaultActiveKey={['1']}>
  <Panel header="This is a simple text header" key="1">
    <p>Panel content here.</p>
  </Panel>
</Collapse>
```

### Rich Headers with JSX

Headers can contain React components and rich elements:

```jsx
import { Collapse, Badge, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export default function RichHeaders() {
  return (
    <Collapse>
      <Panel
        header={
          <Space>
            <span>Panel with Badge</span>
            <Badge count={5} />
          </Space>
        }
        key="1"
      >
        <p>Content for panel with badge.</p>
      </Panel>

      <Panel
        header={
          <Space>
            <InfoCircleOutlined />
            <span>Panel with Icon</span>
          </Space>
        }
        key="2"
      >
        <p>Content for panel with custom icon.</p>
      </Panel>

      <Panel
        header={
          <div>
            <h4 style={{ marginBottom: 0 }}>Styled Header</h4>
            <small>Subtitle or description</small>
          </div>
        }
        key="3"
      >
        <p>Content with custom styled header.</p>
      </Panel>
    </Collapse>
  );
}
```

### Extra Elements in Headers

Add buttons or controls in the header without triggering collapse:

```jsx
import { Collapse, Button, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default function ExtraElements() {
  const handleEdit = (e, key) => {
    e.stopPropagation(); // Prevent header click from triggering collapse
    console.log('Edit panel:', key);
  };

  const handleDelete = (e, key) => {
    e.stopPropagation();
    console.log('Delete panel:', key);
  };

  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel
        header="Panel with Actions"
        key="1"
        extra={
          <Space onClick={(e) => e.stopPropagation()}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => handleEdit(e, '1')}
            />
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={(e) => handleDelete(e, '1')}
            />
          </Space>
        }
      >
        <p>Panel content with action buttons in header.</p>
      </Panel>
    </Collapse>
  );
}
```

**Key points:**
- `extra` prop for additional header elements
- Must use `stopPropagation()` to prevent collapse trigger
- Useful for edit, delete, or other panel-specific actions

### Panel Content Types

Different content structures supported:

```jsx
<Collapse defaultActiveKey={['1', '2', '3', '4']}>
  {/* Text content */}
  <Panel header="Text Content" key="1">
    <p>This is just plain text content in the panel.</p>
  </Panel>

  {/* Rich content with multiple elements */}
  <Panel header="Rich Content" key="2">
    <h4>Heading</h4>
    <p>Paragraph text.</p>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
    </ul>
  </Panel>

  {/* Form elements */}
  <Panel header="Form Content" key="3">
    <form>
      <input type="text" placeholder="Enter text" />
      <textarea placeholder="Enter description"></textarea>
    </form>
  </Panel>

  {/* Components from Ant Design */}
  <Panel header="Component Content" key="4">
    <Table dataSource={data} columns={columns} />
  </Panel>
</Collapse>
```

---

## Interactive Features

### Expand/Collapse All

Provide buttons to expand or collapse all panels:

```jsx
import { Collapse, Button, Space } from 'antd';
import { useState } from 'react';

const { Panel } = Collapse;

export default function ExpandCollapseAll() {
  const [activeKeys, setActiveKeys] = useState([]);
  const panelKeys = ['1', '2', '3'];

  const expandAll = () => setActiveKeys(panelKeys);
  const collapseAll = () => setActiveKeys([]);

  return (
    <>
      <Space style={{ marginBottom: '16px' }}>
        <Button onClick={expandAll}>Expand All</Button>
        <Button onClick={collapseAll}>Collapse All</Button>
      </Space>

      <Collapse activeKey={activeKeys} onChange={setActiveKeys}>
        <Panel header="Panel 1" key="1"><p>Content 1</p></Panel>
        <Panel header="Panel 2" key="2"><p>Content 2</p></Panel>
        <Panel header="Panel 3" key="3"><p>Content 3</p></Panel>
      </Collapse>
    </>
  );
}
```

### Change Callback

Execute code when panels expand or collapse:

```jsx
import { Collapse } from 'antd';
import { useState } from 'react';

export default function ChangeCallback() {
  const [lastChanged, setLastChanged] = useState('');

  const handleChange = (keys) => {
    console.log('Active panels:', keys);
    setLastChanged(`Panels changed: ${keys.join(', ')}`);
  };

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <p>Last change: {lastChanged}</p>
      </div>

      <Collapse onChange={handleChange} defaultActiveKey={['1']}>
        <Panel header="Panel 1" key="1"><p>Content 1</p></Panel>
        <Panel header="Panel 2" key="2"><p>Content 2</p></Panel>
        <Panel header="Panel 3" key="3"><p>Content 3</p></Panel>
      </Collapse>
    </>
  );
}
```

### Hide Arrow Icon

Completely hide the expand/collapse arrow:

```jsx
<Collapse defaultActiveKey={['1']}>
  <Panel header="Panel with arrow (normal)" key="1" showArrow={true}>
    <p>Arrow is visible (default behavior).</p>
  </Panel>

  <Panel header="Panel without arrow" key="2" showArrow={false}>
    <p>Arrow icon is hidden, but header still toggles on click.</p>
  </Panel>
</Collapse>
```

### Lazy Rendering

Control whether inactive panel content is rendered to the DOM:

```jsx
<Collapse destroyInactivePanel={false} defaultActiveKey={['1']}>
  <Panel header="Panel 1" key="1"><p>Content rendered always.</p></Panel>
  <Panel header="Panel 2" key="2" forceRender={true}>
    <p>Content force-rendered even when collapsed.</p>
  </Panel>
  <Panel header="Panel 3" key="3">
    <p>Content lazy-rendered only when expanded.</p>
  </Panel>
</Collapse>
```

**Options:**
- `destroyInactivePanel={false}` (default) - Keeps inactive content in DOM
- `destroyInactivePanel={true}` - Removes inactive content from DOM
- `forceRender={true}` - Force render even if parent has `destroyInactivePanel=true`
- Useful for performance optimization with many panels

---

## Animation & Transitions

### Default Animation

Collapse includes built-in smooth expand/collapse animation:

```jsx
<Collapse defaultActiveKey={['1']}>
  <Panel header="Animated Panel" key="1">
    <p>Content animates in and out when expanded/collapsed.</p>
  </Panel>
</Collapse>
```

**Characteristics:**
- Smooth height transition
- Default duration (typically 300ms)
- Automatic animation on expand/collapse
- Cannot be disabled via props (handled by internal CSS)

### Custom Animation via CSS

Override default animation with custom CSS:

```jsx
<style>
  .custom-animation :global(.ant-collapse-content) {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
</style>

<Collapse className="custom-animation" defaultActiveKey={['1']}>
  <Panel header="Custom animation panel" key="1">
    <p>Uses custom animation duration and easing.</p>
  </Panel>
</Collapse>
```

---

## Integration Patterns

### With Forms

Collapse panels for form sections or steps:

```jsx
import { Collapse, Form, Input, Button, Space } from 'antd';

export default function CollapsibleForm() {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Collapse defaultActiveKey={['contact']}>
        <Panel header="Contact Information" key="contact">
          <Form.Item label="Email" name="email">
            <Input placeholder="email@example.com" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input placeholder="+1 (555) 123-4567" />
          </Form.Item>
        </Panel>

        <Panel header="Address" key="address">
          <Form.Item label="Street" name="street">
            <Input placeholder="123 Main St" />
          </Form.Item>
          <Form.Item label="City" name="city">
            <Input placeholder="New York" />
          </Form.Item>
        </Panel>
      </Collapse>

      <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
        Submit
      </Button>
    </Form>
  );
}
```

### With Tabs

Combine Collapse with Tabs for complex layouts:

```jsx
import { Collapse, Tabs } from 'antd';

export default function CollapseWithTabs() {
  return (
    <Tabs>
      <Tabs.TabPane tab="Settings" key="1">
        <Collapse defaultActiveKey={['appearance']}>
          <Panel header="Appearance" key="appearance">
            <p>Theme and visual settings.</p>
          </Panel>
          <Panel header="Notifications" key="notifications">
            <p>Notification preferences.</p>
          </Panel>
        </Collapse>
      </Tabs.TabPane>
    </Tabs>
  );
}
```

### With Lists

Use Collapse for expandable list items:

```jsx
import { Collapse, List, Avatar } from 'antd';

export default function CollapsibleList() {
  const items = [
    { id: 1, name: 'Item 1', description: 'Details for item 1' },
    { id: 2, name: 'Item 2', description: 'Details for item 2' },
    { id: 3, name: 'Item 3', description: 'Details for item 3' }
  ];

  return (
    <Collapse>
      {items.map(item => (
        <Panel
          header={
            <Space>
              <Avatar>{item.id}</Avatar>
              <span>{item.name}</span>
            </Space>
          }
          key={item.id}
        >
          <p>{item.description}</p>
        </Panel>
      ))}
    </Collapse>
  );
}
```

### With Dynamic Data

Render panels from dynamic data sources:

```jsx
import { Collapse, Empty, Spin } from 'antd';
import { useEffect, useState } from 'react';

export default function DynamicCollapse() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData([
        { id: 1, title: 'Section 1', content: 'Content 1' },
        { id: 2, title: 'Section 2', content: 'Content 2' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <Spin />;
  if (data.length === 0) return <Empty />;

  return (
    <Collapse>
      {data.map(item => (
        <Panel header={item.title} key={item.id}>
          <p>{item.content}</p>
        </Panel>
      ))}
    </Collapse>
  );
}
```

---

## Accessibility Features

### ARIA Attributes

Collapse components automatically include proper ARIA attributes:

```jsx
<Collapse defaultActiveKey={['1']}>
  <Panel header="Accessible Panel" key="1">
    <p>Includes role="button" and aria-expanded attributes.</p>
  </Panel>
</Collapse>

/* Generated HTML includes:
  role="button"
  aria-expanded="true|false"
  aria-controls="id of the associated content"
  tabindex="0"
*/
```

### Keyboard Navigation

Fully keyboard accessible:

```jsx
<Collapse defaultActiveKey={['1']}>
  <Panel header="Keyboard accessible panel" key="1">
    <p>Use Tab to focus header, Space/Enter to toggle.</p>
  </Panel>
  <Panel header="Another panel" key="2">
    <p>Tab through all headers to navigate.</p>
  </Panel>
</Collapse>

/* Keyboard interaction:
  - Tab: Move focus between panel headers
  - Space: Toggle focused panel
  - Enter: Toggle focused panel
*/
```

### Labels and Descriptions

Ensure headers provide clear descriptions:

```jsx
import { Collapse } from 'antd';

export default function AccessibleCollapse() {
  return (
    <Collapse>
      <Panel
        header={
          <span>
            Main Settings
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#999' }}>
              (Click to expand)
            </span>
          </span>
        }
        key="1"
      >
        <p>Detailed settings content.</p>
      </Panel>
    </Collapse>
  );
}
```

---

## Key Properties/Props

### Collapse Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accordion` | `boolean` | `false` | Enable accordion mode (only one panel expanded at a time) |
| `activeKey` | `string[] \| string` | - | Controlled mode: array of panel keys that are expanded |
| `defaultActiveKey` | `string[] \| string` | `[]` | Uncontrolled mode: initially expanded panel keys |
| `bordered` | `boolean` | `true` | Show borders around panels |
| `ghost` | `boolean` | `false` | Enable ghost mode (transparent background) |
| `expandIconPosition` | `'start' \| 'end'` | `'end'` | Position of expand/collapse arrow icon |
| `destroyInactivePanel` | `boolean` | `false` | Unmount inactive panel content from DOM |
| `onChange` | `(keys: string[]) => void` | - | Callback fired when panel expansion state changes |
| `items` | `CollapseProps[]` | - | Panel definitions (alternative to Panel children) |

### Panel Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `ReactNode` | - | Panel header content (title) |
| `key` | `string` | - | Unique identifier for the panel (required) |
| `disabled` | `boolean` | `false` | Disable panel expansion/collapse |
| `collapsible` | `'header' \| 'icon' \| 'disabled'` | `'header'` | Control which elements trigger collapse |
| `showArrow` | `boolean` | `true` | Show/hide expand/collapse arrow icon |
| `extra` | `ReactNode` | - | Extra elements to display in header (e.g., action buttons) |
| `forceRender` | `boolean` | `false` | Force render content even when collapsed |
| `className` | `string` | - | CSS class name for styling |
| `style` | `CSSProperties` | - | Inline styles |

---

## Code Examples

### Example 1: Basic FAQ Accordion

```jsx
import { Collapse } from 'antd';

const faqData = [
  {
    key: '1',
    label: 'What is Ant Design?',
    children: 'Ant Design is a UI library based on Ant Design principles.'
  },
  {
    key: '2',
    label: 'How do I install Ant Design?',
    children: 'npm install antd'
  },
  {
    key: '3',
    label: 'Is Ant Design free?',
    children: 'Yes, Ant Design is open source and free to use.'
  }
];

export default function FAQAccordion() {
  return (
    <div>
      <h2>Frequently Asked Questions</h2>
      <Collapse
        accordion
        items={faqData}
        defaultActiveKey={['1']}
      />
    </div>
  );
}
```

### Example 2: Settings Panel with Expand/Collapse All

```jsx
import { Collapse, Button, Space } from 'antd';
import { useState } from 'react';

export default function SettingsPanel() {
  const [activeKeys, setActiveKeys] = useState(['display']);

  const allKeys = ['display', 'notification', 'privacy', 'about'];

  return (
    <div>
      <h2>Settings</h2>

      <Space style={{ marginBottom: '16px' }}>
        <Button onClick={() => setActiveKeys(allKeys)}>Expand All</Button>
        <Button onClick={() => setActiveKeys([])}>Collapse All</Button>
      </Space>

      <Collapse
        activeKey={activeKeys}
        onChange={setActiveKeys}
        items={[
          {
            key: 'display',
            label: 'Display Settings',
            children: 'Theme, font size, and appearance options.'
          },
          {
            key: 'notification',
            label: 'Notifications',
            children: 'Email and browser notification preferences.'
          },
          {
            key: 'privacy',
            label: 'Privacy & Security',
            children: 'Data protection and security settings.'
          },
          {
            key: 'about',
            label: 'About',
            children: 'Version information and credits.'
          }
        ]}
      />
    </div>
  );
}
```

### Example 3: Nested Collapse (Hierarchical FAQs)

```jsx
import { Collapse } from 'antd';

export default function NestedFAQ() {
  return (
    <Collapse
      defaultActiveKey={['getting-started']}
      items={[
        {
          key: 'getting-started',
          label: 'Getting Started',
          children: (
            <Collapse
              items={[
                {
                  key: 'install',
                  label: 'How do I install?',
                  children: 'npm install antd'
                },
                {
                  key: 'first-component',
                  label: 'What is my first component?',
                  children: 'Import Button from antd and use it.'
                }
              ]}
            />
          )
        },
        {
          key: 'components',
          label: 'Components',
          children: (
            <Collapse
              items={[
                {
                  key: 'button',
                  label: 'Button Component',
                  children: 'Basic button with different types and states.'
                },
                {
                  key: 'form',
                  label: 'Form Component',
                  children: 'Form wrapper for input validation.'
                }
              ]}
            />
          )
        }
      ]}
    />
  );
}
```

### Example 4: Dynamic Panels from Data

```jsx
import { Collapse, Button, Modal, Form, Input } from 'antd';
import { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

export default function DynamicPanels() {
  const [panels, setPanels] = useState([
    { id: 1, title: 'Panel 1', content: 'Content 1' },
    { id: 2, title: 'Panel 2', content: 'Content 2' }
  ]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setPanels(panels.filter(p => p.id !== id));
  };

  const handleModalOk = async () => {
    const values = await form.validateFields();
    setPanels([
      ...panels,
      { id: Date.now(), title: values.title, content: values.content }
    ]);
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: '16px' }}
      >
        Add Panel
      </Button>

      <Collapse
        items={panels.map(panel => ({
          key: panel.id,
          label: panel.title,
          children: panel.content,
          extra: (
            <Space onClick={(e) => e.stopPropagation()}>
              <Button type="text" size="small" icon={<EditOutlined />} />
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(panel.id)}
              />
            </Space>
          )
        }))}
      />

      <Modal
        title="Add New Panel"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
```

---

## Accessibility Notes

1. **Semantic Structure**: Collapse uses semantic HTML with proper `role="button"` attributes
2. **Keyboard Support**: Full keyboard navigation with Tab and Space/Enter keys
3. **ARIA Labels**: Automatically includes `aria-expanded`, `aria-controls` attributes
4. **Focus Management**: Visual focus indicators for keyboard navigation
5. **Screen Reader Support**: Headers are announced with expansion state (expanded/collapsed)
6. **Label Clarity**: Use descriptive header text that clearly indicates content

---

## Common Patterns

1. **FAQs**: Use accordion mode to display frequently asked questions
2. **Settings Panels**: Group related settings under collapse headers
3. **Documentation**: Hide verbose explanations until requested
4. **Step-by-Step Wizards**: Use collapse to show form steps sequentially
5. **Expandable Lists**: Collapse panels for list item details
6. **Navigation Menus**: Create collapsible menu structures
7. **Hierarchical Organization**: Nest collapse components for nested content

---

## Related Components

- **Tabs**: Alternative to collapse for content organization, better for peer content
- **Drawer/Modal**: For modal content disclosure instead of inline expansion
- **Menu**: For navigation structures with hierarchical items
- **Card**: For content containers that don't need collapse functionality
- **Panel**: Wrapper component for specific panel styling
- **Button**: Often used with collapse for action controls in headers

---

Research completed: November 5, 2025
Component: Collapse (Accordion)
Framework: Ant Design
Documentation: https://ant.design/components/collapse
