# PrimeReact OrderList Component - Usage Patterns Research

**Research Date:** 2025-11-05
**Component:** OrderList
**Framework:** PrimeReact
**Version Researched:** 10.9.7 (current), with reference to v8+ documentation
**Documentation:** https://primereact.org/orderlist/

---

## 1. Component Overview

The **OrderList** component is PrimeReact's specialized list component designed specifically for **sorting and reordering collections**. It provides users with multiple methods to rearrange items within a single list: traditional control buttons (Move Up, Move Down, Move Top, Move Bottom) and optional drag-and-drop functionality.

OrderList is distinct from other PrimeReact list components:
- **ListBox**: Selection component (choose items from a list)
- **OrderList**: Reordering component (arrange items in sequence)
- **PickList**: Transfer component (move items between two lists)

The OrderList component is particularly valuable when:
- The order of items matters (priority lists, task sequences, ranking)
- Users need to arrange items in a specific sequence
- Both traditional button-based and drag-and-drop interfaces are desired
- Item filtering during reordering is needed

---

## 2. Basic Usage

### Import

```javascript
import { OrderList } from 'primereact/orderlist';
```

### Minimal Example

```javascript
import React, { useState } from 'react';
import { OrderList } from 'primereact/orderlist';

export default function BasicOrderList() {
  const [items, setItems] = useState([
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'Python' },
    { id: 3, name: 'Java' },
    { id: 4, name: 'C++' }
  ]);

  const itemTemplate = (item) => (
    <div className="flex align-items-center">
      <div>{item.name}</div>
    </div>
  );

  return (
    <OrderList
      dataKey="id"
      value={items}
      onChange={(e) => setItems(e.value)}
      itemTemplate={itemTemplate}
      header="Languages"
      dragdrop
    />
  );
}
```

### Controlled Component Pattern

OrderList operates as a **fully controlled component**:

```javascript
// State tracks the current order
const [orderedItems, setOrderedItems] = useState(initialItems);

// onChange event returns the new order
<OrderList
  value={orderedItems}
  onChange={(e) => setOrderedItems(e.value)}
  dataKey="id"
  itemTemplate={itemTemplate}
/>
```

**Key Pattern:** The parent component owns the item order state. OrderList is a presentation layer for reordering that feeds state changes back to the parent via `onChange`.

---

## 3. Props/API

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Array` | `null` | Array of items to display and allow reordering |
| `onChange` | `function` | `null` | Callback fired when items are reordered: `(e) => { e.value: reordered array }` |
| `dataKey` | `string` | `null` | **Required.** Property name uniquely identifying each item (e.g., "id") |
| `itemTemplate` | `function` | `null` | Function to customize how each item renders: `(item, index) => ReactNode` |
| `header` | `string` | `null` | Text header displayed above the list |
| `headerTemplate` | `function` | `null` | Custom render function for header content |
| `dragdrop` | `boolean` | `false` | Enables drag-and-drop reordering (in addition to buttons) |
| `filter` | `boolean` | `false` | Enables filter input field above the list |
| `filterBy` | `string` | `null` | Property name to filter against (e.g., "name") |
| `filterPlaceholder` | `string` | `null` | Placeholder text for the filter input |
| `filterTemplate` | `function` | `null` | Custom render function for filter input |
| `listProps` | `object` | `null` | Props passed to the underlying list element (for aria-label, aria-labelledby) |
| `className` | `string` | `null` | CSS class(es) applied to the root container |
| `style` | `object` | `null` | Inline styles for the root container |
| `id` | `string` | `null` | Unique identifier for the component |
| `moveTopButtonProps` | `object` | `null` | Props for the "Move to Top" button element |
| `moveUpButtonProps` | `object` | `null` | Props for the "Move Up" button element |
| `moveDownButtonProps` | `object` | `null` | Props for the "Move Down" button element |
| `moveBottomButtonProps` | `object` | `null` | Props for the "Move to Bottom" button element |
| `pt` | `object` | `null` | PassThrough props for DOM element customization |
| `ptOptions` | `object` | `null` | Options for PassThrough configuration |
| `unstyled` | `boolean` | `false` | Whether to disable default PrimeReact styles |
| `metaKeySelection` | `boolean` | `true` | When true, selecting multiple items requires holding meta/ctrl key |
| `responsive` | `boolean` | `false` | Enables responsive behavior for mobile |
| `breakpoint` | `string` | `"960px"` | Breakpoint for responsive layout (when responsive=true) |
| `showSourceControls` | `boolean` | `true` | Show/hide control buttons (for button-based reordering) |
| `tabIndex` | `number \| string` | `0` | Tab index for keyboard navigation |

### Component Methods

OrderList can be controlled via a ref (though it's primarily state-driven):

```javascript
const orderListRef = useRef(null);

// Methods available on ref (if needed for programmatic control)
// Note: Most interactions are managed through state and onChange
```

**Change Event Object Structure:**

```javascript
{
  value: Array,        // Reordered items array
  originalEvent: Event // Browser event that triggered the change
}
```

---

## 4. Reordering Patterns

### 4.1 Control Buttons (Default)

OrderList provides four control buttons for reordering:

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
/>
```

**Default Button Set:**
- **Move Top** (|↑): Moves selected item(s) to the top
- **Move Up** (↑): Moves selected item(s) one position up
- **Move Down** (↓): Moves selected item(s) one position down
- **Move Bottom** (|↓): Moves selected item(s) to the bottom

**Visibility Control:**

```javascript
// Hide control buttons if only drag-drop is needed
<OrderList
  showSourceControls={false}
  dragdrop
  // ... other props
/>
```

**Button Customization:**

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  moveTopButtonProps={{
    'aria-label': 'Move to top of priority',
    className: 'custom-btn'
  }}
  moveUpButtonProps={{
    'aria-label': 'Increase priority'
  }}
  moveDownButtonProps={{
    'aria-label': 'Decrease priority'
  }}
  moveBottomButtonProps={{
    'aria-label': 'Move to bottom of priority'
  }}
/>
```

**Button Order Customization (CSS):**

```css
/* Change the order of control buttons using flexbox */
.p-orderlist-controls {
  display: flex;
  flex-direction: column;
}

.p-orderlist-controls button:nth-child(1) { order: 4; } /* Move bottom */
.p-orderlist-controls button:nth-child(2) { order: 3; } /* Move down */
.p-orderlist-controls button:nth-child(3) { order: 2; } /* Move up */
.p-orderlist-controls button:nth-child(4) { order: 1; } /* Move top */
```

### 4.2 Drag-and-Drop Reordering

Enable drag-and-drop for intuitive mouse/touch reordering:

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  dragdrop
  header="Drag items to reorder"
/>
```

**Drag-and-Drop Behavior:**
- Items can be grabbed and dragged to new positions
- Visual feedback shows the drop target
- Works alongside button controls (not mutually exclusive)
- Automatically updates state through onChange
- Works with touch devices (mobile-friendly)

**Combining Drag-Drop and Buttons:**

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  dragdrop={true}           // Enable drag-drop
  showSourceControls={true} // Keep control buttons visible
  header="Reorder by dragging or using buttons"
/>
```

### 4.3 Conditional Reordering

Allow reordering only for certain items:

```javascript
const [items, setItems] = useState([
  { id: 1, name: 'Task 1', locked: false },
  { id: 2, name: 'Task 2', locked: true },
  { id: 3, name: 'Task 3', locked: false }
]);

const itemTemplate = (item, index) => (
  <div className="flex align-items-center justify-content-between">
    <span>{item.name}</span>
    {item.locked && <span className="locked-badge">Locked</span>}
  </div>
);

// Parent component filters reordering events if needed
const handleReorder = (e) => {
  // Could add custom validation here before accepting new order
  setItems(e.value);
};

<OrderList
  dataKey="id"
  value={items}
  onChange={handleReorder}
  itemTemplate={itemTemplate}
  dragdrop
/>
```

---

## 5. Selection Patterns

### 5.1 Single Selection

By default, OrderList supports multi-selection. For single selection, track and manage state manually:

```javascript
const [items, setItems] = useState([...]);
const [selectedItem, setSelectedItem] = useState(null);

const itemTemplate = (item) => (
  <div
    onClick={() => setSelectedItem(item.id)}
    style={{
      padding: '8px',
      backgroundColor: selectedItem === item.id ? '#e3f2fd' : 'transparent',
      cursor: 'pointer'
    }}
  >
    {item.name}
  </div>
);

<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
/>
```

### 5.2 Multiple Selection with Meta Key

Control multi-selection behavior:

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  metaKeySelection={true}  // Ctrl/Cmd key required for multiple selection
/>
```

**Behavior:**
- `metaKeySelection={true}`: Users must hold Ctrl (Windows) or Cmd (Mac) to select multiple items
- `metaKeySelection={false}`: Any click adds/removes item from selection

### 5.3 Visual Selection Feedback

Customize how selected items appear:

```javascript
const [items, setItems] = useState([...]);
const [selectedItems, setSelectedItems] = useState(new Set());

const itemTemplate = (item) => {
  const isSelected = selectedItems.has(item.id);

  return (
    <div
      className={`item-row ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(item.id)) {
          newSelected.delete(item.id);
        } else {
          newSelected.add(item.id);
        }
        setSelectedItems(newSelected);
      }}
    >
      <span className={isSelected ? 'checkmark' : ''}></span>
      <span>{item.name}</span>
    </div>
  );
};

return (
  <OrderList
    dataKey="id"
    value={items}
    onChange={(e) => setItems(e.value)}
    itemTemplate={itemTemplate}
  />
);
```

---

## 6. Filtering Patterns

### 6.1 Basic Filtering

Enable a built-in filter input:

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  filter
  filterBy="name"
  filterPlaceholder="Search items..."
/>
```

**Behavior:**
- Filter input appears above the list
- Filters items by the specified property (case-insensitive)
- Does not reorder items (only hides non-matching items)

### 6.2 Custom Filter Template

Create a custom filter input:

```javascript
const [filterValue, setFilterValue] = useState('');

const filterTemplate = () => (
  <div className="p-input-icon-left">
    <i className="pi pi-search"></i>
    <InputText
      type="search"
      value={filterValue}
      onChange={(e) => setFilterValue(e.target.value)}
      placeholder="Search by name or category..."
      className="w-full"
    />
  </div>
);

const filteredItems = filterValue
  ? items.filter(item =>
      item.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      item.category.toLowerCase().includes(filterValue.toLowerCase())
    )
  : items;

<OrderList
  dataKey="id"
  value={filteredItems}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  filterTemplate={filterTemplate}
/>
```

### 6.3 Multi-Property Filtering

Filter across multiple item properties:

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  filter
  filterBy="name,category,tags"  // Comma-separated property names
  filterPlaceholder="Search name, category, or tags..."
/>
```

---

## 7. Item Template Patterns

### 7.1 Simple Text Template

```javascript
const itemTemplate = (item) => <span>{item.name}</span>;

<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
/>
```

### 7.2 Rich Content Template

```javascript
const itemTemplate = (item, index) => (
  <div className="item-container flex align-items-center gap-3">
    <Avatar label={item.name.charAt(0)} shape="circle" size="large" />
    <div className="flex-grow-1">
      <div className="font-bold">{item.name}</div>
      <div className="text-color-secondary text-sm">{item.category}</div>
    </div>
    <Badge value={item.priority} severity={item.priorityColor} />
  </div>
);

<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
/>
```

### 7.3 Template with Index

Use the index parameter for row numbers or special handling:

```javascript
const itemTemplate = (item, index) => (
  <div className="flex gap-3 align-items-center">
    <span className="item-rank">{index + 1}</span>
    <span className="flex-grow-1">{item.name}</span>
    <span className="item-score">{item.score}</span>
  </div>
);

<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  header="Ranking"
/>
```

### 7.4 Template with Actions

Include action buttons or controls within items:

```javascript
const itemTemplate = (item) => (
  <div className="flex align-items-center justify-content-between gap-3">
    <div className="flex-grow-1">
      <div className="font-bold">{item.name}</div>
      <div className="text-sm">{item.description}</div>
    </div>
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text"
        onClick={() => handleEdit(item)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text p-button-danger"
        onClick={() => handleDelete(item)}
      />
    </div>
  </div>
);
```

### 7.5 Dynamic Template Based on State

```javascript
const itemTemplate = (item) => {
  const isExpanded = expandedItems.has(item.id);

  return (
    <div>
      <div
        className="flex align-items-center justify-content-between cursor-pointer"
        onClick={() => toggleExpand(item.id)}
      >
        <span>{item.name}</span>
        <i className={`pi ${isExpanded ? 'pi-chevron-down' : 'pi-chevron-right'}`}></i>
      </div>
      {isExpanded && (
        <div className="ml-3 text-color-secondary">
          {item.details}
        </div>
      )}
    </div>
  );
};
```

---

## 8. Composition Patterns

### 8.1 OrderList with Header and Actions

```javascript
function PriorityListManager() {
  const [items, setItems] = useState(initialTasks);

  const headerTemplate = () => (
    <div className="flex align-items-center justify-content-between">
      <span>Task Priority</span>
      <Button
        label="Reset Order"
        icon="pi pi-refresh"
        className="p-button-text p-button-sm"
        onClick={() => setItems([...initialTasks])}
      />
    </div>
  );

  const itemTemplate = (item, index) => (
    <div className="flex align-items-center gap-3">
      <span className="font-bold">{index + 1}.</span>
      <span>{item.name}</span>
      <Tag value={item.status} />
    </div>
  );

  return (
    <Card>
      <OrderList
        dataKey="id"
        value={items}
        onChange={(e) => setItems(e.value)}
        itemTemplate={itemTemplate}
        headerTemplate={headerTemplate}
        dragdrop
        filter
        filterBy="name"
      />
    </Card>
  );
}
```

### 8.2 OrderList with Confirmation

```javascript
function SafeOrderList() {
  const [items, setItems] = useState(initialItems);
  const [confirming, setConfirming] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const confirmDialog = useRef(null);

  const handleReorder = (e) => {
    setPendingOrder(e.value);
    confirmDialog.current.show();
  };

  const onConfirm = () => {
    setItems(pendingOrder);
    toast.current.show({
      severity: 'success',
      summary: 'Updated',
      detail: 'Item order updated successfully'
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog
        ref={confirmDialog}
        onHide={() => setConfirming(false)}
        message="Save new item order?"
        header="Confirm"
        icon="pi pi-exclamation-triangle"
        accept={onConfirm}
        reject={() => setPendingOrder(null)}
      />
      <OrderList
        dataKey="id"
        value={items}
        onChange={handleReorder}
        itemTemplate={itemTemplate}
        dragdrop
      />
    </>
  );
}
```

### 8.3 OrderList with Two-Way Sync

```javascript
function SyncedOrderLists() {
  const [group1, setGroup1] = useState(initialGroup1);
  const [group2, setGroup2] = useState(initialGroup2);

  const handleGroup1Reorder = (e) => {
    setGroup1(e.value);
    // Optionally sync related data
    saveOrderToDatabase('group1', e.value);
  };

  const handleGroup2Reorder = (e) => {
    setGroup2(e.value);
    saveOrderToDatabase('group2', e.value);
  };

  return (
    <div className="grid">
      <div className="col">
        <OrderList
          dataKey="id"
          value={group1}
          onChange={handleGroup1Reorder}
          itemTemplate={itemTemplate}
          header="Group 1"
          dragdrop
        />
      </div>
      <div className="col">
        <OrderList
          dataKey="id"
          value={group2}
          onChange={handleGroup2Reorder}
          itemTemplate={itemTemplate}
          header="Group 2"
          dragdrop
        />
      </div>
    </div>
  );
}
```

### 8.4 With Form Integration

```javascript
function TaskPriorityForm() {
  const [formData, setFormData] = useState({
    name: '',
    tasks: [
      { id: 1, name: 'Task 1' },
      { id: 2, name: 'Task 2' }
    ]
  });

  const handleTasksReorder = (e) => {
    setFormData({
      ...formData,
      tasks: e.value
    });
  };

  const handleSubmit = () => {
    // Submit form with reordered tasks
    submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">Project Name</label>
        <InputText
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="field">
        <label>Task Priority Order</label>
        <OrderList
          dataKey="id"
          value={formData.tasks}
          onChange={handleTasksReorder}
          itemTemplate={(item) => item.name}
          dragdrop
        />
      </div>

      <Button label="Submit" onClick={handleSubmit} />
    </form>
  );
}
```

---

## 9. Styling & Theming

### 9.1 PrimeReact Theming

OrderList automatically inherits PrimeReact's theme system:

```javascript
// Import a theme globally in your app
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
```

**Available Themes:**
- Lara (Light/Dark variants)
- Material Design
- Bootstrap
- Fluent
- Custom themes

### 9.2 Component-Level Styling

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  className="w-full md:w-30rem shadow-lg"
  style={{ borderRadius: '8px', minHeight: '400px' }}
  headerTemplate={() => (
    <div style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
      My Custom Header
    </div>
  )}
/>
```

### 9.3 Item-Level Styling

Styling is applied through the itemTemplate:

```javascript
const itemTemplate = (item) => (
  <div
    style={{
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
      backgroundColor: item.priority === 'high' ? '#fff3cd' : 'transparent'
    }}
  >
    {item.name}
  </div>
);
```

### 9.4 Built-in CSS Classes

**Root Container:**
- `p-orderlist`: Main container
- `p-orderlist-controls`: Control buttons container
- `p-orderlist-list`: The list container

**List Elements:**
- `p-orderlist-item`: Individual list item
- `p-orderlist-item-selected`: Selected item
- `p-orderlist-item-content`: Item content wrapper

**Buttons:**
- `p-orderlist-button`: Control button element
- `p-button`: Button base class
- `p-button-icon`: Icon within button

**Filter:**
- `p-orderlist-filter`: Filter input wrapper
- `p-inputtext`: Text input class

**Example CSS Override:**

```css
/* Custom item styling */
.p-orderlist-item {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.p-orderlist-item-selected {
  background-color: #e3f2fd;
  border-left: 4px solid #1976d2;
}

.p-orderlist-item:hover {
  background-color: #f5f5f5;
  cursor: grab;
}

.p-orderlist-item:active {
  cursor: grabbing;
}
```

### 9.5 PassThrough API

Customize DOM elements at a low level:

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  pt={{
    root: { className: 'custom-orderlist' },
    header: { className: 'header-custom', style: { padding: '1rem' } },
    item: {
      className: 'item-custom',
      'data-testid': 'order-item'
    },
    content: { className: 'item-content-custom' },
    controls: { className: 'controls-custom' },
    button: {
      className: 'btn-custom',
      style: { marginRight: '0.5rem' }
    }
  }}
/>
```

**Available PassThrough Sections:**
- `root`: Main container div
- `header`: Header section
- `filterContainer`: Filter input wrapper
- `filter`: Filter input element
- `list`: UL element
- `item`: LI element for each item
- `content`: Item content wrapper
- `controls`: Control buttons container
- `button`: Individual button elements

### 9.6 Unstyled Mode

For complete styling control (e.g., with Tailwind CSS):

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  unstyled
  pt={{
    root: { className: 'bg-white rounded-lg shadow-lg' },
    header: { className: 'px-4 py-3 border-b' },
    list: { className: 'divide-y' },
    item: { className: 'px-4 py-3 hover:bg-gray-50' },
    controls: { className: 'flex flex-col gap-2' },
    button: { className: 'px-3 py-2 bg-blue-500 text-white rounded' }
  }}
/>
```

---

## 10. Accessibility

### 10.1 ARIA Roles and Attributes

OrderList implements WCAG 2.1 Level AA standards:

**List Container:**
- `role="listbox"`: Applied to the list container
- `aria-multiselectable="true"`: Indicates multiple items can be selected
- `aria-label` or `aria-labelledby`: Required for unlabeled lists

**List Items:**
- `role="option"`: Applied to individual items
- `aria-selected="true|false"`: Indicates selection state
- `aria-disabled="true"`: Applied to disabled items

**Control Buttons:**
- `aria-label`: Required for all control buttons
- Uses locale API defaults (aria.moveTop, aria.moveUp, etc.)
- Can be customized via buttonProps

**Example with Accessibility:**

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  listProps={{
    'aria-label': 'Task priority order',
    role: 'listbox',
    'aria-multiselectable': 'true'
  }}
  moveTopButtonProps={{
    'aria-label': 'Move selected task to top'
  }}
  moveUpButtonProps={{
    'aria-label': 'Increase selected task priority'
  }}
  moveDownButtonProps={{
    'aria-label': 'Decrease selected task priority'
  }}
  moveBottomButtonProps={{
    'aria-label': 'Move selected task to bottom'
  }}
/>
```

### 10.2 Keyboard Navigation

| Key | Function |
|-----|----------|
| **Tab** | Moves focus into/out of the OrderList |
| **Space** | Selects/deselects the focused item |
| **Ctrl+Space** | Adds/removes focused item from multi-selection |
| **Arrow Down** | Moves focus to next item |
| **Arrow Up** | Moves focus to previous item |
| **Home** | Moves focus to first item |
| **End** | Moves focus to last item |
| **Enter** | Activates focused control button (when focused) |

### 10.3 Screen Reader Support

**Announcements:**
- List label is announced when focus enters the list
- Item position and selected state are announced
- Control button purposes are announced
- Disabled items are announced as disabled

### 10.4 Focus Management

```javascript
// Ensure the OrderList is keyboard-accessible
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  tabIndex={0}  // Make focusable
  listProps={{
    'aria-label': 'Orderable list of items'
  }}
/>
```

---

## 11. Advanced Patterns

### 11.1 Persistence (localStorage)

```javascript
const STORAGE_KEY = 'task-order';

function PersistentOrderList() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialItems;
  });

  const handleReorder = (e) => {
    const newOrder = e.value;
    setItems(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
  };

  return (
    <OrderList
      dataKey="id"
      value={items}
      onChange={handleReorder}
      itemTemplate={itemTemplate}
      dragdrop
    />
  );
}
```

### 11.2 Server Synchronization

```javascript
function SyncedOrderList() {
  const [items, setItems] = useState(initialItems);
  const [isSaving, setIsSaving] = useState(false);

  const handleReorder = async (e) => {
    const newOrder = e.value;
    setItems(newOrder);
    setIsSaving(true);

    try {
      await fetch('/api/tasks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemIds: newOrder.map(item => item.id)
        })
      });

      toast.current.show({
        severity: 'success',
        summary: 'Saved',
        detail: 'Order saved to server'
      });
    } catch (error) {
      // Revert on error
      setItems(initialItems);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save order'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <OrderList
      dataKey="id"
      value={items}
      onChange={handleReorder}
      itemTemplate={itemTemplate}
      dragdrop
      disabled={isSaving}
    />
  );
}
```

### 11.3 Undo/Redo

```javascript
function UndoableOrderList() {
  const [items, setItems] = useState(initialItems);
  const [history, setHistory] = useState([initialItems]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleReorder = (e) => {
    const newOrder = e.value;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newOrder);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setItems(newOrder);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setItems(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setItems(history[newIndex]);
    }
  };

  return (
    <>
      <div className="flex gap-2 mb-3">
        <Button
          icon="pi pi-arrow-left"
          onClick={handleUndo}
          disabled={historyIndex === 0}
        />
        <Button
          icon="pi pi-arrow-right"
          onClick={handleRedo}
          disabled={historyIndex === history.length - 1}
        />
      </div>
      <OrderList
        dataKey="id"
        value={items}
        onChange={handleReorder}
        itemTemplate={itemTemplate}
        dragdrop
      />
    </>
  );
}
```

### 11.4 Grouped Ordering

```javascript
function GroupedOrderList() {
  const [groups, setGroups] = useState([
    {
      category: 'High Priority',
      items: [
        { id: 1, name: 'Task 1' },
        { id: 2, name: 'Task 2' }
      ]
    },
    {
      category: 'Low Priority',
      items: [
        { id: 3, name: 'Task 3' },
        { id: 4, name: 'Task 4' }
      ]
    }
  ]);

  return (
    <div className="grid">
      {groups.map(group => (
        <div key={group.category} className="col">
          <OrderList
            dataKey="id"
            value={group.items}
            onChange={(e) => {
              // Update specific group
              setGroups(groups.map(g =>
                g.category === group.category ? { ...g, items: e.value } : g
              ));
            }}
            itemTemplate={(item) => item.name}
            header={group.category}
            dragdrop
          />
        </div>
      ))}
    </div>
  );
}
```

---

## 12. Differences from Standard List/Listbox

### OrderList vs ListBox

| Feature | OrderList | ListBox |
|---------|-----------|---------|
| **Primary Purpose** | Reordering/sorting items | Selecting items from a list |
| **Primary UI** | Control buttons, drag-drop | Selection/multi-select |
| **State Model** | Array order matters | Selected items matter |
| **Best For** | Priorities, sequences, rankings | Form inputs, selection |
| **Use Case** | "Arrange these items" | "Choose from these items" |

### OrderList vs PickList

| Feature | OrderList | PickList |
|---------|-----------|----------|
| **List Count** | Single list | Two lists (source & target) |
| **Direction** | Reorder within one list | Transfer between lists |
| **Transfer** | Not applicable | Move items between lists |
| **Use Case** | Prioritization | Selection and arrangement |

### Key Differences Summary

1. **OrderList is specifically for sequence**: Its entire design revolves around allowing users to change the order of items within a single list
2. **Control buttons are core**: Unlike ListBox (which is about selection), OrderList emphasizes its Move Top/Up/Down/Bottom controls
3. **Drag-drop is optional enhancement**: ListBox has no drag-drop; OrderList adds it as an enhancement to button controls
4. **State is the array itself**: In ListBox, you track `selectedItems`; in OrderList, you track the order of all items
5. **Accessibility is sequence-focused**: ARIA labeling emphasizes position and ordering, not selection

---

## 13. Best Practices

### 13.1 When to Use OrderList

**Use OrderList when:**
- Order/sequence/priority matters (task lists, voting, ranking)
- Users need to arrange items in a specific sequence
- You want to offer both button and drag-drop controls
- Items aren't being selected for an action, but arranged

**Don't use OrderList for:**
- Selecting items from a list (use ListBox)
- Moving items between two lists (use PickList)
- Simple lists with no reordering (use regular components)

### 13.2 Always Provide dataKey

```javascript
// Good: Every item has a unique key
<OrderList
  dataKey="id"  // Required, unique per item
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
/>

// Avoid: Using index as key
<OrderList
  dataKey="index"  // Wrong! Index changes with reorder
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
/>
```

### 13.3 Memoize Item Templates

```javascript
// Good: Memoized template
const itemTemplate = useCallback((item) => (
  <div>{item.name}</div>
), []);

// Or define outside component if static
const staticTemplate = (item) => <div>{item.name}</div>;

<OrderList itemTemplate={itemTemplate} /* ... */ />
```

### 13.4 Provide Clear Accessibility Labels

```javascript
<OrderList
  listProps={{
    'aria-label': 'Task priority order - drag items or use buttons to reorder'
  }}
  moveUpButtonProps={{
    'aria-label': 'Increase priority of selected task'
  }}
  moveDownButtonProps={{
    'aria-label': 'Decrease priority of selected task'
  }}
  // ... other props
/>
```

### 13.5 Consider Touch/Mobile

```javascript
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  dragdrop  // Works with touch events
  responsive
  breakpoint="640px"
/>
```

### 13.6 Provide Feedback

```javascript
const [isSaving, setIsSaving] = useState(false);
const toast = useRef(null);

const handleReorder = async (e) => {
  setIsSaving(true);
  try {
    // Save to server
    await saveOrder(e.value);
    setItems(e.value);
    toast.current.show({
      severity: 'success',
      summary: 'Reordered',
      detail: 'Order saved successfully'
    });
  } catch (error) {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save order'
    });
  } finally {
    setIsSaving(false);
  }
};

return (
  <>
    <Toast ref={toast} />
    <OrderList
      value={items}
      onChange={handleReorder}
      disabled={isSaving}
      // ... other props
    />
  </>
);
```

---

## 14. Common Gotchas

### 14.1 State Not Updating

```javascript
// Wrong: Mutation instead of state update
const handleReorder = (e) => {
  items = e.value;  // Direct mutation, no state update
};

// Correct: Update state
const handleReorder = (e) => {
  setItems(e.value);
};
```

### 14.2 Immutable Updates Required

```javascript
// Wrong: Mutating nested objects
const handleReorder = (e) => {
  const newItems = e.value;
  newItems[0].name = 'Changed';  // Mutates original
  setItems(newItems);
};

// Correct: Create new array if modifying items
const handleReorder = (e) => {
  const newItems = e.value.map((item, index) => ({
    ...item,
    order: index
  }));
  setItems(newItems);
};
```

### 14.3 Key Uniqueness

```javascript
// Wrong: Using non-unique dataKey
const items = [
  { id: 1, name: 'Item' },  // Duplicate ID
  { id: 1, name: 'Item' }
];
<OrderList dataKey="id" value={items} /* ... */ />

// Correct: Ensure unique dataKey
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
];
<OrderList dataKey="id" value={items} /* ... */ />
```

### 14.4 Filter Doesn't Persist Order

```javascript
// Filter only hides items, doesn't change order
const [items, setItems] = useState([...]);
const [filter, setFilter] = useState('');

const filteredItems = items.filter(item =>
  item.name.toLowerCase().includes(filter.toLowerCase())
);

<OrderList
  value={filteredItems}  // Only shows matching items
  onChange={(e) => setItems(e.value)}  // Updates full order
  // ... other props
/>
```

### 14.5 Ref Methods Limited

```javascript
// OrderList doesn't have many imperative methods
const orderListRef = useRef(null);

// Can't do:
// orderListRef.current.moveTo(index)
// orderListRef.current.select(item)

// Must manage through state and onChange
```

---

## 15. Testing Recommendations

### 15.1 Unit Testing

```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('reorders items when button clicked', () => {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];
  const onChange = jest.fn();

  const { container } = render(
    <OrderList
      dataKey="id"
      value={items}
      onChange={onChange}
      itemTemplate={(item) => item.name}
    />
  );

  // Find and click move down button
  const moveDownBtn = container.querySelectorAll('.p-orderlist-button')[2];
  fireEvent.click(moveDownBtn);

  expect(onChange).toHaveBeenCalled();
});
```

### 15.2 Drag-Drop Testing

```javascript
test('reorders items on drag-drop', async () => {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];
  const onChange = jest.fn();

  const { container } = render(
    <OrderList
      dataKey="id"
      value={items}
      onChange={onChange}
      itemTemplate={(item) => item.name}
      dragdrop
    />
  );

  const firstItem = container.querySelector('[role="option"]');

  // Simulate drag-drop
  fireEvent.dragStart(firstItem);
  fireEvent.drop(container.querySelectorAll('[role="option"]')[1]);
  fireEvent.dragEnd(firstItem);

  expect(onChange).toHaveBeenCalled();
});
```

### 15.3 Accessibility Testing

```javascript
test('has proper ARIA attributes', () => {
  const { container } = render(
    <OrderList
      dataKey="id"
      value={items}
      onChange={jest.fn()}
      itemTemplate={(item) => item.name}
      listProps={{ 'aria-label': 'Test list' }}
    />
  );

  const list = container.querySelector('[role="listbox"]');
  expect(list).toHaveAttribute('aria-multiselectable', 'true');
  expect(list).toHaveAttribute('aria-label', 'Test list');

  const options = container.querySelectorAll('[role="option"]');
  expect(options.length).toBe(items.length);
});
```

---

## 16. Summary of Key Findings

### Core Strengths

1. **Purpose-Built for Reordering**: Unlike multi-purpose list components, OrderList is optimized for exactly one thing - allowing users to change item order
2. **Multiple Interaction Modalities**: Supports both traditional button controls and modern drag-drop, meeting diverse user preferences
3. **Model-Driven State**: Items are tracked in parent state; the component is purely presentational
4. **Flexible Templating**: itemTemplate provides complete control over item rendering
5. **Accessibility First**: Full WCAG compliance with comprehensive ARIA support

### Design Philosophy

- **Controlled Component Pattern**: Parent always owns state; OrderList is presentation-only
- **Separation of Concerns**: Reordering logic (buttons/drag) is separate from rendering (itemTemplate)
- **Progressive Enhancement**: Start with buttons, add drag-drop as enhancement
- **Composition-Friendly**: Easily integrated with forms, confirmations, persistence, etc.

### Recommended Use Cases

- **Priority/Task Management**: Arrange tasks by priority
- **Ranking Systems**: Let users rank items
- **Workflow Steps**: Sequence process steps
- **Playlist Editors**: Arrange songs/media
- **Precedence Lists**: Order dependencies or rules

### Key Implementation Principles

1. **Always use dataKey**: Required and must be unique
2. **Leverage itemTemplate**: Customize appearance completely
3. **Support both interfaces**: Buttons + drag-drop for accessibility
4. **Persist order appropriately**: localStorage or server as needed
5. **Provide feedback**: Toast notifications on save/error
6. **Handle selection separately**: If needed, manage selection state independently
7. **Think about the user**: Some users prefer buttons, some prefer drag-drop

### Distinctions from Related Components

| vs ListBox | OrderList is for **reordering items**, not selecting them |
| vs PickList | OrderList reorders **within one list**, not between two |
| vs DataTable | OrderList is **simpler, focused on sequence**, not tabular data |

---

**Research Completed:** 2025-11-05
**Researcher:** Claude (Anthropic)
**Purpose:** Inform Semantic UI List/OrderList component development
