# PrimeReact - Tree Usage Patterns

## Component URL
https://primereact.org/tree/
Status: ✅ Working
Version: v10.9.7
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Includes extensive examples, accessibility documentation, keyboard navigation, events, and advanced features like drag-drop and lazy loading.

## Component Definition
- **Core purpose**: Display hierarchical data in an expandable/collapsible tree structure with support for selection, filtering, drag-drop reordering, and lazy loading.
- **Mental model**: Users think of this as a file explorer or organizational hierarchy where items can be expanded to reveal children, selected for actions, and reorganized through drag-drop.
- **Semantic meaning**: Represents hierarchical relationships between data entities, communicating parent-child relationships and data organization through visual nesting and indentation.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `selectionMode="checkbox"`, `filter={true}`)
- **Composed**: Via composition/children (e.g., custom templates via `nodeTemplate`)
- **CSS-only**: Requires custom styling (e.g., `className` prop for styling)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Via `label` property on TreeNode objects |
| Icon support | ✅ | Native | Via `icon` property on TreeNode; integrates with PrimeIcons |
| Custom content | ✅ | Composed | Via `nodeTemplate` prop for custom node rendering; `togglerTemplate` for custom expand/collapse toggles |
| Badges/counts | ❌ | - | Not documented; would require custom template implementation |

## Interaction Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Expandable/collapsible | ✅ | Native | Controlled via `expandedKeys` prop and `onToggle` event; programmatic control available |
| Selectable nodes | ✅ | Native | Three modes: `selectionMode="single"`, `selectionMode="multiple"`, `selectionMode="checkbox"`; controlled via `selectionKeys` and `onSelectionChange` |
| Checkable nodes | ✅ | Native | Checkbox mode with partial checked state support; format: `{ '0-0': { checked: true, partialChecked: false } }` |
| Draggable nodes | ✅ | Native | Via `dragdropScope` prop with `onDragDrop` callback for state updates after reordering |
| Search/filter | ✅ | Native | `filter={true}` enables filtering; `filterMode="lenient"` or `"strict"`; `filterBy` for custom field filtering; `filterPlaceholder` for input text |
| Multi-select | ✅ | Native | `selectionMode="multiple"` with optional `metaKeySelection` boolean to require metaKey for multi-selection |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | Native | `loading` prop mentioned for lazy loading scenarios; used with `onExpand` event for dynamic loading |
| Disabled | ❌ | - | No disabled node functionality documented |
| Selected | ✅ | Native | Managed via `selectionKeys` prop; supports single/multiple/checkbox modes with detailed state tracking |
| Expanded/Collapsed | ✅ | Native | Controlled via `expandedKeys` object; format: `{ '0-0': true, '0-1': true }` |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Virtual scrolling | ⚠️ | - | VirtualScroller mentioned as separate component but no documented integration with Tree |
| Directory tree | ✅ | Native | Natural use case; TreeNode `leaf` property distinguishes folders from files |
| Connecting lines | ⚠️ | CSS-only | Not documented; likely requires custom styling via `className` |
| Block node style | ⚠️ | CSS-only | Not documented; styling controlled via `className` prop |

## Code Examples

### Basic Usage
```jsx
import { Tree } from 'primereact/tree';

<Tree value={nodes} className="w-full md:w-30rem" />
```

### Controlled Expansion
```jsx
const [expandedKeys, setExpandedKeys] = useState({});

<Tree
  value={nodes}
  expandedKeys={expandedKeys}
  onToggle={(e) => setExpandedKeys(e.value)}
  className="w-full md:w-30rem"
/>
```

### Single Selection
```jsx
const [selectedKey, setSelectedKey] = useState(null);

<Tree
  value={nodes}
  selectionMode="single"
  selectionKeys={selectedKey}
  onSelectionChange={(e) => setSelectedKey(e.value)}
  className="w-full md:w-30rem"
/>
```

### Multiple Selection with MetaKey
```jsx
const [selectedKeys, setSelectedKeys] = useState({});
const [metaKey, setMetaKey] = useState(true);

<Tree
  value={nodes}
  selectionMode="multiple"
  selectionKeys={selectedKeys}
  onSelectionChange={(e) => setSelectedKeys(e.value)}
  metaKeySelection={metaKey}
  className="w-full md:w-30rem"
/>
```

### Checkbox Selection
```jsx
const [selectedKeys, setSelectedKeys] = useState({});

<Tree
  value={nodes}
  selectionMode="checkbox"
  selectionKeys={selectedKeys}
  onSelectionChange={(e) => setSelectedKeys(e.value)}
  className="w-full md:w-30rem"
/>

// Selection format for checkboxes:
// {
//   '0-0': { checked: true, partialChecked: false },
//   '0-1-0': { checked: true, partialChecked: false }
// }
```

### Drag and Drop
```jsx
const [nodes, setNodes] = useState(initialNodes);

<Tree
  value={nodes}
  dragdropScope="demo"
  onDragDrop={(e) => setNodes(e.value)}
  className="w-full md:w-30rem"
/>
```

### Filtering
```jsx
<Tree
  value={nodes}
  filter
  filterMode="lenient"
  filterPlaceholder="Search..."
  className="w-full md:w-30rem"
/>

// filterMode options:
// - "lenient": Stops at matching nodes
// - "strict": Continues searching descendants
```

### Lazy Loading
```jsx
const [nodes, setNodes] = useState(initialNodes);
const [loading, setLoading] = useState(false);

const onExpand = (event) => {
  setLoading(true);

  // Simulate async loading
  setTimeout(() => {
    const node = event.node;
    const children = loadChildrenData(node.key);

    node.children = children;
    setNodes([...nodes]);
    setLoading(false);
  }, 500);
};

<Tree
  value={nodes}
  onExpand={onExpand}
  loading={loading}
  className="w-full md:w-30rem"
/>
```

### Custom Templates
```jsx
const nodeTemplate = (node) => {
  return (
    <div>
      <b>{node.label}</b>
      <span style={{ marginLeft: '0.5rem' }}>Custom content</span>
    </div>
  );
};

const togglerTemplate = (node, options) => {
  if (!node) {
    return;
  }

  const expanded = options.expanded;
  const iconClassName = expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right';

  return (
    <button
      type="button"
      className={iconClassName}
      onClick={options.onClick}
    />
  );
};

<Tree
  value={nodes}
  nodeTemplate={nodeTemplate}
  togglerTemplate={togglerTemplate}
  className="w-full md:w-30rem"
/>
```

### Context Menu Integration
```jsx
const [selectedNodeKey, setSelectedNodeKey] = useState(null);
const cm = useRef(null);

const menuModel = [
  { label: 'View', icon: 'pi pi-search' },
  { label: 'Delete', icon: 'pi pi-times' }
];

<ContextMenu model={menuModel} ref={cm} />
<Tree
  value={nodes}
  contextMenuSelectionKey={selectedNodeKey}
  onContextMenuSelectionChange={(e) => setSelectedNodeKey(e.value)}
  onContextMenu={(e) => cm.current.show(e.originalEvent)}
  className="w-full md:w-30rem"
/>
```

### Events
```jsx
<Tree
  value={nodes}
  onExpand={(e) => console.log('Expanded:', e.node)}
  onCollapse={(e) => console.log('Collapsed:', e.node)}
  onSelect={(e) => console.log('Selected:', e.node)}
  onUnselect={(e) => console.log('Unselected:', e.node)}
  className="w-full md:w-30rem"
/>
```

## TreeNode Data Structure
```javascript
// Minimal TreeNode structure (inferred from documentation):
{
  key: '0-0',              // Unique identifier
  label: 'Node Label',     // Display text
  data: { /* custom */ },  // Custom data object
  icon: 'pi pi-folder',    // PrimeIcon class name
  leaf: false,             // Boolean: true if no children
  children: [              // Array of child TreeNodes
    {
      key: '0-0-0',
      label: 'Child Node',
      leaf: true
    }
  ]
}
```

## Notable Features

- **Comprehensive Selection Modes**: Three distinct selection patterns (single, multiple, checkbox) with fine-grained control via `metaKeySelection` for power users
- **Partial Checked State**: Checkbox mode supports partial selection state for parent nodes when only some children are selected
- **Dual Filter Modes**: "Lenient" mode stops at matching nodes while "strict" mode continues searching descendants, providing flexibility for different use cases
- **Lazy Loading Support**: Built-in `onExpand` event enables efficient loading of large datasets on-demand
- **Template Flexibility**: Separate templates for node content (`nodeTemplate`) and toggle controls (`togglerTemplate`) enable extensive customization
- **Context Menu Integration**: First-class support for right-click context menus via dedicated props
- **Accessible by Default**: Comprehensive ARIA attributes and keyboard navigation (arrow keys, enter, space) built-in
- **Controlled Component Pattern**: Follows React best practices with controlled `expandedKeys` and `selectionKeys` props
- **Drag-Drop Reordering**: Native support for node reordering with automatic state management through `onDragDrop`

## Accessibility Features

**ARIA Attributes:**
- Root element: `role="tree"`
- Each node: `role="treeitem"` with `aria-label`, `aria-selected`, `aria-expanded`
- Checkboxes: `aria-checked` attribute
- Icons: Marked with `aria-hidden="true"` to prevent screen reader confusion

**Keyboard Navigation:**
- `Tab` / `Shift+Tab`: Focus management between tree and other page elements
- `Enter` / `Space`: Toggle selection of focused node
- `Up Arrow` / `Down Arrow`: Navigate between visible nodes
- `Right Arrow`: Expand closed node or move to first child
- `Left Arrow`: Collapse open node or move to parent

## Research Notes

- Documentation is well-organized with clear examples for each feature
- No accessibility issues in fetching the documentation
- Framework follows controlled component patterns consistently
- TreeNode structure is not explicitly documented but can be inferred from examples
- Virtual scrolling integration is not documented (VirtualScroller exists as separate component)
- Disabled state for individual nodes is not documented
- Visual styling (connecting lines, block styles) appears to be CSS-only via `className` prop
- Badge/count display would require custom `nodeTemplate` implementation
- The component appears mature with comprehensive feature coverage for common tree use cases
- Strong emphasis on accessibility with complete keyboard navigation and ARIA support
