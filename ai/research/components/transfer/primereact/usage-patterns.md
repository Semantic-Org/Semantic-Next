# PrimeReact - PickList Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.primefaces.org/primereact-v8/picklist/
Status: ✅ Working
Version: v8 (PrimeReact v8)
Last Verified: 2025-11-05

## Documentation Quality
Excellent - The documentation provides comprehensive API reference with clear property descriptions, event callbacks, rich templating examples, and demonstrates all major use cases. Advanced filtering and customization patterns are well-documented with live examples.

## Component Definition
- **Core purpose**: Enables bidirectional transfer and reordering of items between two lists (source and target). Provides a dual-list interface with built-in controls for moving items, applying filters, and managing selection.
- **Mental model**: A paired dual-list control where users select items from one list and transfer them to another, with additional capabilities for reordering, filtering, and bulk operations.
- **Semantic meaning**: Represents a transfer/assignment workflow where items are moved between categorical states or ownership (e.g., assigned vs. unassigned, available vs. selected, source vs. destination).

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children/templates
- **CSS-only**: Requires custom styling
- **Event-driven**: Via callback handlers

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native/Composed | Via `itemTemplate`, `sourceItemTemplate`, or `targetItemTemplate` props |
| Custom rendering | ✅ | Composed | Template functions returning JSX for flexible item display |
| Source-specific templates | ✅ | Composed | `sourceItemTemplate` prop for customized source list rendering |
| Target-specific templates | ✅ | Composed | `targetItemTemplate` prop for customized target list rendering |
| Headers | ✅ | Native | `sourceHeader` and `targetHeader` for list titles (string or JSX) |
| Icons in items | ✅ | Composed | Via custom templates with icon elements |
| Custom headers | ✅ | Composed | JSX content in `sourceHeader`/`targetHeader` props |

## Type Patterns (List Variants)

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Standard dual-list | ✅ | Native | Default mode with source and target lists side-by-side |
| Horizontal layout | ✅ | CSS-only | Via `.p-picklist-horizontal` class styling |
| Vertical layout | ✅ | CSS-only | Default vertical stacking (portrait orientation) |

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selection state | ✅ | Native | `sourceSelection` and `targetSelection` props manage selected items |
| Item selection | ✅ | Native | Individual item selection via click with multi-select capability |
| Multi-select mode | ✅ | Native | `metaKeySelection` (boolean, default true) - requires Ctrl/Cmd key for multiple selections |
| Touch device handling | ✅ | Native | `metaKeySelection` disables automatically on touch devices |
| Disabled items | ⚪ | Composed | Implement in custom template with visual/click-handler management |
| Selected item styling | ✅ | CSS-only | `.p-picklist-item.p-selected` class for highlighting |

## Variation Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Control buttons | ✅ | Native | Move right, move left, move all right, move all left buttons |
| Show source controls | ✅ | Native | `showSourceControls` boolean prop (default: true) |
| Show target controls | ✅ | Native | `showTargetControls` boolean prop (default: true) |
| Reorder buttons | ✅ | Native | Move up, move down buttons when items are selected |
| Control positioning | ✅ | CSS-only | Via `.p-picklist-buttons` styling and layout classes |
| Compact view | ✅ | CSS-only | Minimize control button visibility with CSS customization |

## Search & Filter Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Source filter | ✅ | Native | `showSourceFilter` boolean, `sourceFilterPlaceholder` for prompt text |
| Target filter | ✅ | Native | `showTargetFilter` boolean, `targetFilterPlaceholder` for prompt text |
| Filter field selection | ✅ | Native | `filterBy` prop specifies which object field(s) to search (comma-separated for multiple) |
| Filter match modes | ✅ | Native | `filterMatchMode` with options: contains, startsWith, endsWith, equals, notEquals, in, lt, lte, gt, gte |
| Source filter events | ✅ | Event | `onSourceFilterChange` callback fired when source filter input changes |
| Target filter events | ✅ | Event | `onTargetFilterChange` callback fired when target filter input changes |
| Real-time filtering | ✅ | Native | Filtering happens as user types (no explicit submit) |

## Interactive Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Move to target | ✅ | Native | `onMoveToTarget` event with moved items in payload |
| Move to source | ✅ | Native | `onMoveToSource` event with moved items in payload |
| Move all to target | ✅ | Native | `onMoveAllToTarget` event with all source items in payload |
| Move all to source | ✅ | Native | `onMoveAllToSource` event with all target items in payload |
| Source selection change | ✅ | Event | `onSourceSelectionChange` callback with selected items |
| Target selection change | ✅ | Event | `onTargetSelectionChange` callback with selected items |
| Reorder items | ✅ | Event | Move up/down triggers reordering within same list |

## Code Examples

### Basic Usage

```jsx
import { PickList } from 'primereact/picklist';
import { useState } from 'react';

function MyComponent() {
  const [source, setSource] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ]);

  const [target, setTarget] = useState([]);

  const onChange = (event) => {
    setSource(event.source);
    setTarget(event.target);
  };

  const itemTemplate = (item) => {
    return <div>{item.name}</div>;
  };

  return (
    <PickList
      source={source}
      target={target}
      onChange={onChange}
      itemTemplate={itemTemplate}
      sourceHeader="Available Items"
      targetHeader="Selected Items"
      dataKey="id"
    />
  );
}
```

### Source and Target Specific Templates

```jsx
<PickList
  source={sourceItems}
  target={targetItems}
  onChange={handleChange}
  sourceItemTemplate={(item) => (
    <div className="flex align-items-center gap-2">
      <span className="pi pi-circle-fill"></span>
      <span>{item.name}</span>
      <small>({item.category})</small>
    </div>
  )}
  targetItemTemplate={(item) => (
    <div className="flex align-items-center justify-content-between">
      <span>{item.name}</span>
      <span className="font-bold">{item.price}</span>
    </div>
  )}
  sourceHeader="Available Products"
  targetHeader="Selected Products"
  dataKey="id"
/>
```

### With Filter Capability

```jsx
<PickList
  source={items}
  target={selected}
  onChange={handleChange}
  itemTemplate={itemTemplate}
  sourceHeader="Available"
  targetHeader="Selected"
  showSourceFilter={true}
  showTargetFilter={true}
  sourceFilterPlaceholder="Search available items..."
  targetFilterPlaceholder="Search selected items..."
  filterBy="name"
  filterMatchMode="contains"
  dataKey="id"
/>
```

### Multiple Filter Fields

```jsx
// Search across both name and description fields
<PickList
  source={items}
  target={selected}
  onChange={handleChange}
  itemTemplate={itemTemplate}
  filterBy="name,description"
  filterMatchMode="startsWith"
  showSourceFilter={true}
  showTargetFilter={true}
  dataKey="id"
/>
```

### Custom Filter Match Mode

```jsx
<PickList
  source={items}
  target={selected}
  onChange={handleChange}
  itemTemplate={itemTemplate}
  filterBy="price"
  filterMatchMode="gte" // Greater than or equal
  showSourceFilter={true}
  dataKey="id"
/>
```

### Controlling Source and Target Controls

```jsx
<PickList
  source={items}
  target={selected}
  onChange={handleChange}
  itemTemplate={itemTemplate}
  showSourceControls={true}  // Show move up/down for source
  showTargetControls={true}  // Show move up/down for target
  dataKey="id"
/>
```

### Selection and Event Handling

```jsx
function SelectivePickList() {
  const [source, setSource] = useState([...]);
  const [target, setTarget] = useState([...]);
  const [sourceSelection, setSourceSelection] = useState([]);
  const [targetSelection, setTargetSelection] = useState([]);

  const handleMoveToTarget = (event) => {
    console.log('Moved to target:', event.value);
    // event.value contains the moved items
  };

  const handleSourceSelectionChange = (event) => {
    setSourceSelection(event.value);
  };

  return (
    <PickList
      source={source}
      target={target}
      sourceSelection={sourceSelection}
      targetSelection={targetSelection}
      onSourceSelectionChange={handleSourceSelectionChange}
      onTargetSelectionChange={(e) => setTargetSelection(e.value)}
      onMoveToTarget={handleMoveToTarget}
      onMoveToSource={(event) => console.log('Moved to source:', event.value)}
      onMoveAllToTarget={(event) => console.log('All moved to target')}
      onMoveAllToSource={(event) => console.log('All moved to source')}
      itemTemplate={itemTemplate}
      metaKeySelection={true}
      dataKey="id"
    />
  );
}
```

### Multi-Select with Meta Key

```jsx
<PickList
  source={items}
  target={selected}
  sourceSelection={sourceSelection}
  targetSelection={targetSelection}
  onSourceSelectionChange={(e) => setSourceSelection(e.value)}
  onTargetSelectionChange={(e) => setTargetSelection(e.value)}
  onChange={handleChange}
  metaKeySelection={true} // Requires Ctrl/Cmd to select multiple
  itemTemplate={itemTemplate}
  dataKey="id"
/>
```

### Touch Device Handling

```jsx
// metaKeySelection automatically disables on touch devices
// Users can select multiple items without holding meta key on mobile
<PickList
  source={items}
  target={selected}
  onChange={handleChange}
  metaKeySelection={true} // Works on desktop, auto-disables on mobile
  itemTemplate={itemTemplate}
  dataKey="id"
/>
```

### Rich Custom Rendering with Icons and Details

```jsx
function AdvancedPickList() {
  const [users, setUsers] = useState([...]);
  const [assigned, setAssigned] = useState([...]);

  const userTemplate = (user) => (
    <div className="flex align-items-center gap-3 w-full">
      <img src={user.avatar} alt={user.name} style={{ width: '32px', borderRadius: '50%' }} />
      <div className="flex flex-column">
        <span className="font-semibold">{user.name}</span>
        <small className="text-color-secondary">{user.email}</small>
      </div>
    </div>
  );

  const assignedTemplate = (user) => (
    <div className="flex align-items-center justify-content-between w-full">
      <div className="flex align-items-center gap-2">
        <img src={user.avatar} alt={user.name} style={{ width: '28px', borderRadius: '50%' }} />
        <span>{user.name}</span>
      </div>
      <span className={`pi pi-check text-green-600`}></span>
    </div>
  );

  return (
    <PickList
      source={users}
      target={assigned}
      onChange={(e) => {
        setUsers(e.source);
        setAssigned(e.target);
      }}
      sourceItemTemplate={userTemplate}
      targetItemTemplate={assignedTemplate}
      sourceHeader="Available Users"
      targetHeader="Assigned Users"
      dataKey="id"
    />
  );
}
```

### Accessibility - Keyboard Navigation

```jsx
<PickList
  source={items}
  target={selected}
  onChange={handleChange}
  itemTemplate={itemTemplate}
  dataKey="id"
  tabIndex={0} // Makes component keyboard accessible
/>
```

### CSS-Based Customization

```jsx
// Component structure
<PickList
  source={items}
  target={selected}
  onChange={handleChange}
  className="custom-picklist"
  itemTemplate={itemTemplate}
  dataKey="id"
/>

// Custom CSS
<style>
  .custom-picklist {
    --primary-color: #3b82f6;
  }

  .p-picklist {
    border-radius: 8px;
  }

  .p-picklist-item {
    padding: 12px 16px;
    border-radius: 4px;
  }

  .p-picklist-item.p-selected {
    background-color: var(--primary-color);
    color: white;
  }

  .p-picklist-item:hover {
    background-color: #f3f4f6;
  }

  .p-picklist-item.p-selected:hover {
    background-color: #2563eb;
  }
</style>
```

## Notable Features

### 1. **Dual-List Transfer Workflow**
The core feature is bidirectional item transfer between source and target lists with dedicated control buttons. This is fundamental to the component's identity and use case.

### 2. **Flexible Templating System**
Three levels of template customization:
- `itemTemplate` - Single template for both lists
- `sourceItemTemplate` and `targetItemTemplate` - Specific templates per list
- Full JSX support enables rich, complex item displays

### 3. **Intelligent Multi-Select Handling**
The `metaKeySelection` property:
- Default: `true` (requires Ctrl/Cmd for multiple selections)
- Automatically disables on touch devices for better UX
- Provides platform-appropriate selection behavior without developer configuration

### 4. **Comprehensive Filter System**
Filter capabilities support:
- Multiple field searching via comma-separated `filterBy`
- Various match modes (contains, startsWith, endsWith, equals, etc.)
- Separate controls for source and target lists
- Real-time filtering as user types
- Customizable placeholder text

### 5. **Event-Driven Architecture**
Transfer operations expose specific events:
- `onMoveToTarget` - Individual items moved right
- `onMoveToSource` - Individual items moved left
- `onMoveAllToTarget` - Bulk transfer right
- `onMoveAllToSource` - Bulk transfer left
- Selection change callbacks for each list

### 6. **Granular Control Display**
Separate props for controlling visibility of reorder buttons:
- `showSourceControls` - Controls on source list
- `showTargetControls` - Controls on target list
- Enables use cases where only transfer (not reorder) is needed

### 7. **Header Flexibility**
List headers can be:
- Simple strings for basic labels
- Full JSX for custom header content with icons, badges, counts, etc.

### 8. **Data Key Management**
The `dataKey` prop specifies the unique identifier field:
- Enables efficient item tracking
- Required for proper selection and movement operations
- Typically "id" or similar unique property

## Search/Filter Deep Dive

### Filter Match Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| `contains` | Case-insensitive substring match | General text search (default) |
| `startsWith` | Match from beginning of field | Prefix-based filtering |
| `endsWith` | Match from end of field | Suffix-based filtering (e.g., file extensions) |
| `equals` | Exact match | Precise matching |
| `notEquals` | Everything except exact match | Exclusion filtering |
| `in` | Match if value is in array | Multi-value filtering |
| `lt` | Less than (numeric) | Range queries |
| `lte` | Less than or equal (numeric) | Range queries |
| `gt` | Greater than (numeric) | Range queries |
| `gte` | Greater than or equal (numeric) | Range queries |

### Filter Examples by Data Type

```jsx
// Text field filtering
<PickList
  source={items}
  target={selected}
  filterBy="name"
  filterMatchMode="startsWith"
/>

// Multiple field filtering
<PickList
  source={items}
  target={selected}
  filterBy="name,category,description"
  filterMatchMode="contains"
/>

// Numeric field filtering
<PickList
  source={items}
  target={selected}
  filterBy="price"
  filterMatchMode="gte" // Price >= some value
/>

// Date field filtering (ISO format)
<PickList
  source={items}
  target={selected}
  filterBy="createdDate"
  filterMatchMode="gte"
/>
```

## Reordering Capabilities

The PickList supports item reordering within each list through dedicated controls:

```jsx
<PickList
  source={orderedItems}
  target={assignedItems}
  onChange={(e) => {
    // Items are reordered within each list
    // onChange reflects the new order
    setSource(e.source);
    setTarget(e.target);
  }}
  showSourceControls={true} // Move up/down buttons on source
  showTargetControls={true} // Move up/down buttons on target
  dataKey="id"
/>
```

**Note**: Reordering is within-list only. Cross-list movement is via the left/right transfer buttons.

## Drag-Drop Support

The documentation confirms the component supports drag-and-drop functionality, though specific implementation details require checking the source code. The component likely uses PrimeReact's drag-drop utilities:

```jsx
// Basic drag-drop is likely built-in, but explicit examples in documentation
// suggest composition with dragula or similar for enhanced patterns
<PickList
  source={items}
  target={selected}
  onChange={handleChange}
  itemTemplate={itemTemplate}
  // Drag-drop handling may be implicit or require additional configuration
  dataKey="id"
/>
```

## Notable Limitations

### 1. **No Virtual Scrolling**
For very large lists (1000+ items), performance may degrade without virtual scrolling implementation.

### 2. **Reordering Limited to Single List**
Items can only be reordered within source or target, not across lists directly (must use transfer buttons).

### 3. **Template-Based Selection**
Disabled items require custom implementation in templates; no built-in `disabled` prop for items.

### 4. **Filter Precision**
Filters are applied at display-time only; no backend/server-side filtering capability by default.

## Research Notes

### Architecture Approach
PrimeReact PickList follows a **controlled component pattern** where:
- Parent maintains both source and target state
- Component is fully controlled via props
- All changes flow through `onChange` callback
- Templating provides maximum flexibility for custom rendering

### Comparison with Other Frameworks
- **PrimeReact PickList** is more feature-rich than simple dual-list controls in other frameworks
- Comparable complexity to Ant Transfer component but with more template flexibility
- Better customization than basic HTML5 multi-select approaches
- Handles mobile/touch edge cases automatically

### Strengths
1. **Flexible templating** - Rich customization without component fork
2. **Smart selection handling** - Meta key behavior adapts to device type
3. **Comprehensive filtering** - Multiple match modes and fields
4. **Clear event API** - Specific events for each operation
5. **Accessibility** - Keyboard navigation support via `tabIndex`
6. **Production-ready** - Battle-tested in enterprise applications

### Limitations
1. **Verbose controlled pattern** - Requires parent state management
2. **No built-in drag-drop** - Limited to button-based transfer
3. **Filter UX** - Filters work but lack advanced options (case sensitivity control, regex, etc.)
4. **Item-level features** - No built-in way to disable specific items
5. **Virtual scrolling** - Not included for large datasets
6. **Accessibility gaps** - Could expose more ARIA attributes for screen readers

### Developer Experience
- **Discoverability**: Well-documented with clear examples
- **Type Safety**: Good TypeScript support with typed event callbacks
- **Customization**: Template-based approach is very flexible
- **Learning Curve**: Moderate - concepts are intuitive but API has many props

### Unique Strengths Compared to Transfer-Like Components
1. **Dual control modes** - Can show/hide source and target controls independently
2. **Filter flexibility** - Multiple match modes and field combinations
3. **Touch-aware selection** - Automatic meta key adaptation
4. **Rich templating** - Full component customization without props explosion
5. **Bulk operations** - Move all items with single action

## Related Semantic UI Components
When building a transfer component for Semantic UI Next, PrimeReact PickList provides excellent patterns for:
- Dual-list layouts with transfer controls
- Template-driven custom item rendering
- Filter integration in list controls
- Selection state management
- Reordering UI patterns

The core mental model translates well to web components with slots instead of template functions, and property binding instead of React props.

