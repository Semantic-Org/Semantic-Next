# Ant Design Transfer Component - Usage Patterns Report

**Framework:** Ant Design (React)
**Component:** Transfer
**Version:** 5.x (Latest)
**Research Date:** 2025-11-05
**Documentation:** https://ant.design/components/transfer/

---

## 1. Component Overview

The Ant Design Transfer component is a **dual-list selection interface** that allows users to move items between two lists. It provides an intuitive way to handle multi-select operations, particularly useful for scenarios like user permission assignment, feature selection, or data filtering where users need to select multiple items from a larger set.

The Transfer component displays two lists side-by-side:
- **Left list** - Available items to select
- **Right list** - Selected items
- **Transfer buttons** - Move items between lists

Users can select items in either list and use directional buttons to move them between lists. It's fundamentally different from a Checkbox Group or Select component, providing a more visual and interactive approach to multi-item selection.

**Key Distinction:** Transfer is for **visual, interactive multi-item selection** with explicit left/right positioning, while Select is for **form input** with a dropdown list.

---

## 2. Basic Usage

### Simple Transfer with Data

```typescript
import React, { useState } from 'react';
import { Transfer } from 'antd';

const mockData = Array.from({ length: 20 }, (_, k) => ({
  key: k.toString(),
  title: `Item ${k + 1}`,
  description: `Description for item ${k + 1}`,
}));

const App: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const handleChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const handleSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <Transfer
      dataSource={mockData}
      titles={['Source', 'Target']}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={handleChange}
      onSelectChange={handleSelectChange}
      render={(item) => item.title}
    />
  );
};

export default App;
```

**Explanation:** The basic Transfer accepts:
- `dataSource` - Array of items with `key` and other properties
- `titles` - Labels for left and right lists
- `targetKeys` - Keys of items displayed in right list
- `selectedKeys` - Currently selected items in both lists
- `onChange` - Handler when items are transferred
- `onSelectChange` - Handler when items are selected/deselected
- `render` - Function to customize how each item displays

### Transfer with Custom Titles and Descriptions

```typescript
const mockData = Array.from({ length: 20 }, (_, k) => ({
  key: k.toString(),
  title: `Item ${k + 1}`,
  description: `Description for item ${k + 1}`,
}));

<Transfer
  dataSource={mockData}
  titles={['Available Items', 'Selected Items']}
  targetKeys={targetKeys}
  onChange={handleChange}
  render={(item) => `${item.title} (${item.description})`}
/>
```

### Controlled Transfer Component

```typescript
const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const handleChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
    // Perform side effects like API calls
    console.log('New target keys:', nextTargetKeys);
  };

  return (
    <Transfer
      dataSource={mockData}
      targetKeys={targetKeys}
      onChange={handleChange}
    />
  );
};
```

---

## 3. Props/API

### Core Transfer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataSource` | `TransferItem[]` | `[]` | Data source for the transfer list |
| `titles` | `[string, string]` | `['', '']` | Title text for left and right lists |
| `targetKeys` | `string[]` | `[]` | Keys of items in the right list (controlled) |
| `selectedKeys` | `string[]` | `[]` | Keys of items currently selected |
| `onChange` | `(targetKeys: string[], direction: 'left' \| 'right', movedKeys: string[]) => void` | - | Callback when items are transferred |
| `onSelectChange` | `(sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void` | - | Callback when selection changes |
| `onScroll` | `(direction: 'left' \| 'right', e: SyntheticEvent) => void` | - | Callback when lists are scrolled |
| `listStyle` | `CSSProperties` | - | CSS style for each list container |
| `operationStyle` | `CSSProperties` | - | CSS style for the operation area (buttons) |
| `render` | `(item: TransferItem) => ReactNode` | `item => item.title` | Function to render each item |
| `locale` | `TransferLocale` | `enUS` | Internationalization configuration |
| `operations` | `string[]` | `['>','<']` | Custom operation button labels |
| `showSearch` | `boolean` | `false` | Show search input on both sides |
| `filterOption` | `(inputValue: string, option: TransferItem) => boolean` | - | Custom filter function for search |
| `searchPlaceholder` | `string` | `'Search'` | Placeholder for search input |
| `notFoundContent` | `ReactNode` | `'Not Found'` | Content when no items match filter |
| `disabled` | `boolean` | `false` | Disable the entire transfer |
| `status` | `'error' \| 'warning'` | - | Validation status (since 5.4.0) |
| `oneWay` | `boolean` | `false` | Only allow left to right transfer (since 4.24.0) |

### TransferItem Structure

Each item in `dataSource` should have:

```typescript
interface TransferItem {
  key: string;           // Unique identifier (required)
  title: string;         // Display text (used if render not provided)
  description?: string;  // Optional description
  disabled?: boolean;    // Optional: disable this item
  [key: string]: any;    // Any custom properties
}
```

### Locale Configuration

The `locale` prop controls text labels:

```typescript
interface TransferLocale {
  titles?: [string, string];           // Alternative to `titles` prop
  notFoundContent?: string;            // Text when no items
  searchPlaceholder?: string;          // Search input placeholder
  itemUnit?: string;                   // Unit label (e.g., 'item')
  itemsUnit?: string;                  // Plural unit label (e.g., 'items')
  notFoundContentLeft?: string;        // Left side not found text
  notFoundContentRight?: string;       // Right side not found text
}
```

---

## 4. Variants & Patterns

### Transfer with Search/Filter

```typescript
const mockData = Array.from({ length: 20 }, (_, k) => ({
  key: k.toString(),
  title: `Item ${k + 1}`,
  description: `Description for item ${k + 1}`,
}));

const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  return (
    <Transfer
      dataSource={mockData}
      titles={['Source', 'Target']}
      targetKeys={targetKeys}
      onChange={(keys) => setTargetKeys(keys)}
      render={(item) => item.title}
      showSearch
      filterOption={(inputValue, option) =>
        option.title.toLowerCase().includes(inputValue.toLowerCase())
      }
      searchPlaceholder="Search items"
    />
  );
};
```

**Key Points:**
- `showSearch` enables search inputs on both lists
- `filterOption` provides custom filtering logic
- Search filters items in real-time
- Search state is independent for each list

### One-Way Transfer (Left to Right Only)

```typescript
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  oneWay
/>
```

The `oneWay` prop removes the left-pointing button, allowing only left→right transfers. Useful for wizards or workflows where items shouldn't move back.

### Transfer with Custom Rendering

```typescript
const App: React.FC = () => {
  const mockData = [
    { key: '1', title: 'Alice', email: 'alice@example.com' },
    { key: '2', title: 'Bob', email: 'bob@example.com' },
    { key: '3', title: 'Charlie', email: 'charlie@example.com' },
  ];

  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  return (
    <Transfer
      dataSource={mockData}
      targetKeys={targetKeys}
      onChange={(keys) => setTargetKeys(keys)}
      render={(item) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{item.title}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {item.email}
          </div>
        </div>
      )}
    />
  );
};
```

The `render` function provides complete control over how each item displays, allowing custom layouts with multiple properties.

### Transfer with Disabled Items

```typescript
const mockData = Array.from({ length: 20 }, (_, k) => ({
  key: k.toString(),
  title: `Item ${k + 1}`,
  disabled: k % 3 === 0, // Every third item is disabled
}));

<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
/>
```

Disabled items appear grayed out and cannot be selected or transferred.

### Transfer with Custom Operation Buttons

```typescript
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  operations={['Add to Selected', 'Remove from Selected']}
/>
```

The `operations` prop customizes the labels for transfer buttons (default: ['>', '<']).

### Transfer with Custom Not Found Content

```typescript
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  notFoundContent="No items available"
/>
```

Displays custom message when no items are found (either no data or search returns nothing).

### Transfer with Scroll Handler

```typescript
const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const handleScroll = (direction: 'left' | 'right', event: React.SyntheticEvent) => {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      console.log(`Reached bottom of ${direction} list`);
      // Load more items
    }
  };

  return (
    <Transfer
      dataSource={mockData}
      targetKeys={targetKeys}
      onChange={(keys) => setTargetKeys(keys)}
      onScroll={handleScroll}
    />
  );
};
```

The `onScroll` handler enables infinite scroll or lazy loading patterns.

### Transfer with Validation Status

```typescript
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  status={targetKeys.length === 0 ? 'error' : 'success'}
/>
```

The `status` prop (v5.4.0+) shows validation feedback with red border for error state.

### Transfer in Form Context

```typescript
import { Form, Transfer, Button } from 'antd';

const App: React.FC = () => {
  const [form] = Form.useForm();

  const mockData = Array.from({ length: 20 }, (_, k) => ({
    key: k.toString(),
    title: `Item ${k + 1}`,
  }));

  const onFinish = (values) => {
    console.log('Form values:', values);
    // values.selectedItems contains the target keys
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="selectedItems"
        label="Select Items"
        rules={[
          {
            required: true,
            message: 'Please select at least one item',
            validator: (_, value) => {
              return value && value.length > 0
                ? Promise.resolve()
                : Promise.reject();
            },
          },
        ]}
      >
        <Transfer
          dataSource={mockData}
          render={(item) => item.title}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
```

Transfer can be integrated with Ant Design Form for validation and submission.

### Transfer with Pagination-like Behavior

```typescript
const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState(mockData);
  const [itemsPerPage] = useState(10);

  return (
    <Transfer
      dataSource={dataSource}
      targetKeys={targetKeys}
      onChange={(keys) => setTargetKeys(keys)}
      listStyle={{
        height: 400, // Fixed height with scrollbar
      }}
    />
  );
};
```

Fixed `listStyle.height` creates scrollable lists with pagination feel.

---

## 5. Composition Patterns

### Basic Standalone Transfer

```typescript
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={handleChange}
  render={(item) => item.title}
/>
```

Most common usage - Transfer as a standalone component for multi-select.

### Transfer with Label

```typescript
<div>
  <label style={{ display: 'block', marginBottom: '8px' }}>
    Select your preferences:
  </label>
  <Transfer
    dataSource={mockData}
    targetKeys={targetKeys}
    onChange={handleChange}
    render={(item) => item.title}
  />
</div>
```

Wrap Transfer in a labeled container for form-like appearance.

### Transfer with Instructions

```typescript
<div>
  <h3>Item Selection</h3>
  <p style={{ marginBottom: '16px', color: '#666' }}>
    Select items from the left list and use the arrows to move them to the right list.
  </p>
  <Transfer
    dataSource={mockData}
    targetKeys={targetKeys}
    onChange={handleChange}
    render={(item) => item.title}
    showSearch
  />
</div>
```

Add contextual instructions for better UX.

### Transfer with Summary Info

```typescript
const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  return (
    <div>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={(keys) => setTargetKeys(keys)}
        render={(item) => item.title}
      />
      <div style={{ marginTop: '16px', padding: '8px', background: '#f0f0f0' }}>
        <strong>Selected:</strong> {targetKeys.length} / {mockData.length} items
      </div>
    </div>
  );
};
```

Display selection summary below or alongside Transfer.

### Transfer in Modal/Dialog

```typescript
const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Select Items
      </Button>
      <Modal
        title="Select Items"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <Transfer
          dataSource={mockData}
          targetKeys={targetKeys}
          onChange={(keys) => setTargetKeys(keys)}
          render={(item) => item.title}
        />
      </Modal>
    </>
  );
};
```

Transfer commonly appears in modals for multi-step workflows.

---

## 6. Selection & Transfer Mechanisms

### Understanding Change Events

```typescript
const handleChange = (
  nextTargetKeys: string[],
  direction: 'left' | 'right',
  movedKeys: string[]
) => {
  console.log('New target keys:', nextTargetKeys);
  console.log('Direction:', direction); // 'left' = right→left, 'right' = left→right
  console.log('Moved keys:', movedKeys); // Keys that were just moved
};

<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={handleChange}
/>
```

The `onChange` handler receives:
- **nextTargetKeys** - Complete new list of items in right list
- **direction** - Which direction items moved
- **movedKeys** - Specific keys that were transferred

### Understanding Selection Changes

```typescript
const handleSelectChange = (
  sourceSelectedKeys: string[],
  targetSelectedKeys: string[]
) => {
  console.log('Left list selected:', sourceSelectedKeys);
  console.log('Right list selected:', targetSelectedKeys);
};

<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  selectedKeys={selectedKeys}
  onChange={handleChange}
  onSelectChange={handleSelectChange}
/>
```

The `onSelectChange` handler receives selected keys from both lists independently. Selection doesn't automatically transfer items.

### Item Selection vs Transfer

```typescript
const App: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  // Selection changes (user clicks checkboxes)
  const handleSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  // Transfer happens (user clicks buttons)
  const handleChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
    // Clear selection after transfer
    setSelectedKeys([]);
  };

  return (
    <Transfer
      dataSource={mockData}
      titles={['Available', 'Selected']}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={handleChange}
      onSelectChange={handleSelectChange}
      render={(item) => item.title}
    />
  );
};
```

**Key Distinction:**
- **Selection** (checkboxes) = Which items to act on
- **Transfer** (buttons) = Actually move selected items

### Bulk Operations

```typescript
const App: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const handleSelectAll = (direction: 'left' | 'right') => {
    const availableKeys = direction === 'left'
      ? mockData.filter(item => !targetKeys.includes(item.key)).map(item => item.key)
      : targetKeys;

    if (direction === 'left') {
      setSelectedKeys([...selectedKeys, ...availableKeys]);
    } else {
      setSelectedKeys([...selectedKeys.filter(k => !targetKeys.includes(k)), ...availableKeys]);
    }
  };

  return (
    <div>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={(keys) => setTargetKeys(keys)}
        onSelectChange={(source, target) => {
          setSelectedKeys([...source, ...target]);
        }}
        render={(item) => item.title}
      />
      <div style={{ marginTop: '16px' }}>
        <Button onClick={() => handleSelectAll('left')}>
          Select All Available
        </Button>
        <Button onClick={() => handleSelectAll('right')} style={{ marginLeft: '8px' }}>
          Select All Selected
        </Button>
      </div>
    </div>
  );
};
```

Custom buttons can implement select-all or other bulk operations.

---

## 7. Search & Filter

### Basic Search

```typescript
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  render={(item) => item.title}
  showSearch
  searchPlaceholder="Search by title"
/>
```

`showSearch` enables search inputs on both lists. By default, searches the `title` property.

### Custom Filter Logic

```typescript
const handleFilterOption = (inputValue: string, option: TransferItem) => {
  // Search in both title and description
  return (
    option.title.toLowerCase().includes(inputValue.toLowerCase()) ||
    option.description?.toLowerCase().includes(inputValue.toLowerCase())
  );
};

<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  showSearch
  filterOption={handleFilterOption}
  searchPlaceholder="Search title or description"
/>
```

The `filterOption` function enables searching across multiple properties.

### Case-Insensitive Search

```typescript
const filterOption = (inputValue: string, option: TransferItem) => {
  return option.title.toLowerCase().includes(inputValue.toLowerCase());
};

<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  showSearch
  filterOption={filterOption}
/>
```

Convert both input and option values to lowercase for case-insensitive matching.

### Regex-Based Search

```typescript
const filterOption = (inputValue: string, option: TransferItem) => {
  try {
    const regex = new RegExp(inputValue, 'i');
    return regex.test(option.title);
  } catch {
    return false;
  }
};

<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  showSearch
  filterOption={filterOption}
  searchPlaceholder="Use regex patterns to search"
/>
```

Support regex patterns in search for advanced filtering.

### Disable Search on One Side

```typescript
const App: React.FC = () => {
  // Note: Transfer doesn't support per-side search control
  // Workaround: Use custom styling to hide search on one side
  return (
    <div>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={(keys) => setTargetKeys(keys)}
        showSearch
      />
      <style>{`
        .ant-transfer-list:nth-child(3) .ant-transfer-list-search {
          display: none; /* Hide search on right side */
        }
      `}</style>
    </div>
  );
};
```

---

## 8. Custom Rendering

### Simple Text Rendering

```typescript
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  render={(item) => item.title}
/>
```

Basic string rendering from the `title` property.

### Rich Content with Multiple Properties

```typescript
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  render={(item) => (
    <div>
      <div style={{ fontWeight: 'bold' }}>{item.title}</div>
      <div style={{ fontSize: '12px', color: '#999' }}>
        {item.description}
      </div>
    </div>
  )}
/>
```

Display multiple properties in a structured layout.

### Item with Status Badge

```typescript
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  render={(item) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{item.title}</span>
      <span style={{
        fontSize: '12px',
        padding: '2px 8px',
        background: item.status === 'active' ? '#52c41a' : '#d9d9d9',
        color: '#fff',
        borderRadius: '2px',
      }}>
        {item.status}
      </span>
    </div>
  )}
/>
```

Include conditional styling based on item properties.

### Item with Icons

```typescript
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  render={(item) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {item.active ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#f5222d' }} />}
      <span>{item.title}</span>
    </div>
  )}
/>
```

Use icons to convey item status or type.

### Item with Avatar

```typescript
import { Avatar } from 'antd';

<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  render={(item) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Avatar size="small" src={item.avatar} />
      <div>
        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
        <div style={{ fontSize: '12px', color: '#999' }}>{item.email}</div>
      </div>
    </div>
  )}
/>
```

Combine Avatar with text information for user selection scenarios.

---

## 9. Drag-Drop Support

### Native Transfer (No Drag-Drop)

Ant Design Transfer **does NOT have built-in drag-and-drop support** as of v5.x. Items are moved using the transfer buttons only.

If drag-drop is required, there are two approaches:

### Approach 1: Add Custom Drag-Drop Library

```typescript
import { Transfer } from 'antd';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [leftItems, setLeftItems] = useState(mockData.filter(item => !targetKeys.includes(item.key)));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = leftItems.findIndex(item => item.key === active.id);
      const newIndex = leftItems.findIndex(item => item.key === over.id);
      setLeftItems(arrayMove(leftItems, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={leftItems.map(i => i.key)} strategy={verticalListSortingStrategy}>
        <Transfer
          dataSource={mockData}
          targetKeys={targetKeys}
          onChange={(keys) => setTargetKeys(keys)}
        />
      </SortableContext>
    </DndContext>
  );
};
```

**Libraries for Drag-Drop Integration:**
- `@dnd-kit/core` - Modern drag-drop (recommended)
- `react-beautiful-dnd` - Drag-drop with animations
- `react-dnd` - Flexible drag-drop system

### Approach 2: Use Tree Component with Drag-Drop

For hierarchical data that also needs drag-drop, consider using Tree component instead of Transfer:

```typescript
import { Tree } from 'antd';

const App: React.FC = () => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  return (
    <Tree
      checkable
      draggable
      defaultExpandAll
      checkedKeys={checkedKeys}
      onCheck={setCheckedKeys}
      treeData={treeData}
    />
  );
};
```

The Tree component supports both selection and drag-drop.

---

## 10. Styling & Theming

### CSS Variables (v5+)

Ant Design v5 uses CSS variables for theming:

```typescript
import { ConfigProvider } from 'antd';

<ConfigProvider theme={{ cssVar: true }}>
  <App />
</ConfigProvider>
```

### Design Tokens

Customize Transfer appearance using design tokens:

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
      Transfer: {
        // Component-specific tokens
        controlItemBgHover: '#f5f5f5',
        controlItemBgSelected: '#e6f7ff',
      },
    },
  }}
>
  <App />
</ConfigProvider>
```

### Custom Styling with CSS Classes

```typescript
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  className="custom-transfer"
  listStyle={{
    width: 300,
    height: 400,
  }}
  operationStyle={{
    gap: '8px',
  }}
/>
```

And in CSS:

```css
.custom-transfer {
  padding: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.custom-transfer .ant-transfer-list {
  border-radius: 4px;
}

.custom-transfer .ant-transfer-list-header {
  background-color: #f5f5f5;
}

.custom-transfer .ant-transfer-list-content-item {
  padding: 8px 12px;
  border-radius: 2px;
}
```

### Responsive Styling

```typescript
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={(keys) => setTargetKeys(keys)}
  listStyle={{
    width: window.innerWidth < 768 ? 150 : 250,
    height: window.innerHeight < 600 ? 300 : 400,
  }}
/>
```

Adjust list dimensions based on viewport size.

### Dark Mode Support

```typescript
import { ConfigProvider, theme } from 'antd';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {/* Transfer component automatically adapts */}
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={(keys) => setTargetKeys(keys)}
      />
    </ConfigProvider>
  );
};
```

---

## 11. Accessibility

### Current State

Ant Design Transfer has **good basic accessibility support** with some limitations:

**Supported Features:**
- ✅ Keyboard navigation (Tab, Enter)
- ✅ ARIA labels on buttons and lists
- ✅ Checkbox accessibility (spacebar to toggle)
- ✅ Screen reader announcements

**Known Limitations:**
- ⚠️ Arrow key navigation within lists is not fully supported
- ⚠️ Search input accessibility could be improved
- ⚠️ Limited announcements for item transfers

### ARIA Attributes

Transfer automatically applies appropriate ARIA attributes:

```html
<!-- Transfer structure with ARIA -->
<div class="ant-transfer" role="group">
  <!-- Left list -->
  <div class="ant-transfer-list" role="listbox">
    <input type="checkbox" aria-label="Select all items" />
    <div class="ant-transfer-list-content">
      <div class="ant-transfer-list-content-item" role="option">
        <input type="checkbox" aria-label="Item 1" />
        <span>Item 1</span>
      </div>
    </div>
  </div>

  <!-- Transfer buttons -->
  <div class="ant-transfer-operation">
    <button aria-label="Move selected to right" />
    <button aria-label="Move selected to left" />
  </div>

  <!-- Right list -->
  <div class="ant-transfer-list" role="listbox">
    <!-- Similar structure -->
  </div>
</div>
```

### Best Practices for Accessibility

1. **Provide Meaningful Labels:**
```typescript
<Transfer
  dataSource={mockData}
  titles={['Available Items', 'Selected Items']}
  render={(item) => item.title}
/>
```

2. **Use Search When Appropriate:**
```typescript
<Transfer
  dataSource={mockData}
  showSearch
  searchPlaceholder="Search items by name"
  filterOption={(inputValue, option) =>
    option.title.toLowerCase().includes(inputValue.toLowerCase())
  }
/>
```

3. **Provide Instructions:**
```typescript
<div>
  <p id="transfer-instructions">
    Use the buttons in the middle to move items between the available and selected lists.
  </p>
  <Transfer
    dataSource={mockData}
    targetKeys={targetKeys}
    onChange={(keys) => setTargetKeys(keys)}
    aria-describedby="transfer-instructions"
  />
</div>
```

4. **Keyboard Support:**
```typescript
const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Programmatically transfer selected items
      const newTargetKeys = [...targetKeys, ...selectedKeys];
      setTargetKeys(newTargetKeys);
      setSelectedKeys([]);
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={(keys) => setTargetKeys(keys)}
        onSelectChange={(source, target) =>
          setSelectedKeys([...source, ...target])
        }
      />
    </div>
  );
};
```

5. **Test with Screen Readers:**
- Test with NVDA (Windows), VoiceOver (macOS), or JAWS
- Verify that list operations announce correctly
- Ensure button labels are clear and descriptive

---

## 12. Advanced Features

### Virtual Scrolling for Large Lists

```typescript
const App: React.FC = () => {
  const mockData = Array.from({ length: 10000 }, (_, k) => ({
    key: k.toString(),
    title: `Item ${k + 1}`,
  }));

  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  return (
    <Transfer
      dataSource={mockData}
      targetKeys={targetKeys}
      onChange={(keys) => setTargetKeys(keys)}
      listStyle={{
        height: 400, // Enable scrolling
      }}
      // Note: Transfer doesn't have built-in virtual scrolling
      // For large lists, consider pagination or Tree component
    />
  );
};
```

**Important:** Ant Design Transfer does NOT have built-in virtual scrolling. For lists with 10,000+ items, performance may degrade. Consider:
- Paginating the data
- Using Tree component with virtual scrolling
- Implementing custom virtualization with react-window

### Async Data Loading

```typescript
const App: React.FC = () => {
  const [mockData, setMockData] = useState<TransferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = Array.from({ length: 20 }, (_, k) => ({
        key: k.toString(),
        title: `Item ${k + 1}`,
      }));
      setMockData(data);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Spin size="large">Loading items...</Spin>;
  }

  return (
    <Transfer
      dataSource={mockData}
      targetKeys={targetKeys}
      onChange={(keys) => setTargetKeys(keys)}
      render={(item) => item.title}
    />
  );
};
```

### Persisting State to localStorage

```typescript
const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>(() => {
    const stored = localStorage.getItem('transferTargetKeys');
    return stored ? JSON.parse(stored) : [];
  });

  const handleChange = (keys: string[]) => {
    setTargetKeys(keys);
    localStorage.setItem('transferTargetKeys', JSON.stringify(keys));
  };

  return (
    <Transfer
      dataSource={mockData}
      targetKeys={targetKeys}
      onChange={handleChange}
      render={(item) => item.title}
    />
  );
};
```

---

## 13. Best Practices

### When to Use Transfer Component

**Use Transfer when:**
- Users need to select **multiple items** from a larger set
- You want to show both available and selected items **side-by-side**
- A **visual, interactive interface** is preferred over a dropdown
- You need to display the items that were **explicitly selected**
- Space on the page allows for two lists

**Don't use Transfer when:**
- Users only need to select **one item** (use Radio or Select)
- Space is extremely limited (use Select or Autocomplete)
- Items form a **hierarchy** (use Tree with checkboxes)
- You need **drag-and-drop reordering** (use custom implementation or Tree)

### Comparison to Alternatives

| Component | Use Case | Pros | Cons |
|-----------|----------|------|------|
| **Transfer** | Multi-select with visual confirmation | Clear selected items, intuitive | Takes up more space |
| **Checkbox Group** | Multiple selections in a list | Compact, straightforward | Less clear what's selected |
| **Select (multiple)** | Form input with many options | Space-efficient, searchable | Hard to see all selections |
| **Tree** | Hierarchical selection | Supports nesting, dragging | More complex UI |

### Common Gotchas

1. **Don't Confuse Selection with Transfer:**
```typescript
// ❌ Wrong: Selected items don't automatically transfer
const [selectedKeys, setSelectedKeys] = useState([]);
// This doesn't change targetKeys!

// ✅ Right: Use onChange handler to transfer
const handleChange = (newTargetKeys) => {
  setTargetKeys(newTargetKeys);
};
```

2. **Empty dataSource:**
```typescript
// ❌ Wrong: Items disappear when transferred
const [targetKeys, setTargetKeys] = useState([]);
const availableItems = mockData.filter(item => !targetKeys.includes(item.key));

// ✅ Right: Transfer receives complete dataSource
<Transfer
  dataSource={mockData} // Always include all items
  targetKeys={targetKeys}
/>
```

3. **Performance with Large Lists:**
```typescript
// ❌ Inefficient: No pagination or virtual scrolling
const largeData = Array.from({ length: 100000 }, (_, k) => ({...}));
<Transfer dataSource={largeData} />

// ✅ Better: Paginate or use Tree
<Transfer
  dataSource={largeData.slice(0, 100)} // Limit displayed items
/>
```

4. **Form Integration:**
```typescript
// ✅ Correct: Transfer stores array of keys
const onFinish = (values) => {
  console.log(values.selectedItems); // Array of selected item keys
  // Send to API
};
```

---

## 14. Comparison Notes

### Unique Characteristics of Ant Design Transfer

1. **Dual-List Interface:**
   - Clear separation between available and selected items
   - More intuitive than dropdown selects for multiple items
   - Visual confirmation of selections

2. **Flexible Rendering:**
   - `render` prop allows complete control over item display
   - Supports rich content (avatars, icons, status badges)
   - No limitations on complexity of item content

3. **Built-in Search:**
   - Search/filter on both lists simultaneously
   - Customizable filter logic
   - Helpful for large datasets

4. **One-Way Transfer Option:**
   - `oneWay` prop for wizard-like workflows
   - Prevents moving items back to left list
   - Unique feature not common in other frameworks

5. **Selection Independent from Transfer:**
   - Selection (checkboxes) separate from transfer action (buttons)
   - Enables bulk operations and confirmations
   - More control than single-action patterns

6. **No Built-in Drag-Drop:**
   - Unlike some components, Transfer doesn't support dragging
   - Requires integration with external libraries
   - Trade-off for simplicity and stability

7. **Scroll Callbacks:**
   - `onScroll` handler for pagination patterns
   - Enables infinite scroll or lazy loading
   - Advanced feature for large datasets

8. **Form Integration:**
   - Works with Ant Design Form component
   - Validation support via Form rules
   - Easy to integrate into form workflows

---

## 15. Internationalization

### Supported Locales

```typescript
import { Transfer, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';

const App: React.FC = () => {
  const [locale, setLocale] = useState(enUS);

  return (
    <ConfigProvider locale={locale}>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={(keys) => setTargetKeys(keys)}
      />
    </ConfigProvider>
  );
};
```

### Custom Locale Object

```typescript
const customLocale = {
  Transfer: {
    titles: ['Available Choices', 'Selected Choices'],
    notFoundContent: 'No items found',
    searchPlaceholder: 'Search here',
    itemUnit: 'item',
    itemsUnit: 'items',
    notFoundContentLeft: 'No available items',
    notFoundContentRight: 'No selected items',
  },
};

<ConfigProvider locale={customLocale}>
  <Transfer
    dataSource={mockData}
    targetKeys={targetKeys}
    onChange={(keys) => setTargetKeys(keys)}
  />
</ConfigProvider>
```

---

## 16. Research Metadata

**Total Frameworks Analyzed:** 1 (Ant Design v5.x)

**Research Date:** 2025-11-05

**Component Category:** Multi-Select / Form Control / Data Selection

**Related Components:**
- Select (single/multiple select with dropdown)
- Checkbox Group (inline multiple selections)
- Tree (hierarchical selection with drag-drop)
- Radio Group (exclusive selection)

**Technology Stack:**
- **Framework:** React
- **TypeScript Support:** Full
- **CSS System:** CSS Variables (v5), Design Tokens
- **Styling:** Ant Design Theme System
- **Accessibility:** ARIA support with some gaps

---

## Summary

The Ant Design Transfer component is a **purpose-built dual-list interface** for multi-item selection. It excels at:

- **Visual clarity** - Clear distinction between available and selected items
- **Flexibility** - Rich rendering options and custom content
- **Scalability** - Works well with moderate to large datasets (with pagination)
- **Form integration** - Plays well with Ant Design Form system
- **Internationalization** - Excellent locale support

**Key Strengths:**
- Clear separation of concerns (selection vs. transfer)
- Highly customizable item rendering
- Built-in search/filter functionality
- One-way transfer option for workflows
- Good form integration

**Key Limitations:**
- No built-in drag-drop support
- No virtual scrolling for very large lists (10,000+ items)
- Some accessibility gaps (arrow key navigation)
- Requires careful state management for controlled mode
- Takes up significant screen space

**Best For:** User permission assignment, feature selection, data filtering, item prioritization, and any scenario requiring clear visual management of multi-item selections with form submission.

---

## References

- Official Documentation: https://ant.design/components/transfer/
- GitHub Repository: https://github.com/ant-design/ant-design
- Design Tokens: https://ant.design/docs/react/customize-theme
- Locale Support: https://ant.design/docs/react/i18n
- API Reference: https://ant.design/components/transfer/#API

---

**Last Modified:** 2025-11-05
