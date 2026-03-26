# Mantine - Tree Usage Patterns

## Component URL
https://mantine.dev/core/tree/
Status: ✅ Working
Version: @mantine/core v8.3.7
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent documentation with multiple examples, full API reference, TypeScript support, and clear implementation patterns.

## Component Definition
- **Core purpose**: Display hierarchical data structures in a tree format with expand/collapse functionality, selection, and custom rendering capabilities. Serves as a foundation for file explorers, organization charts, and nested navigation systems.
- **Mental model**: A hierarchical data visualization component that transforms nested data structures into an interactive tree interface. Users can navigate through parent-child relationships by expanding/collapsing nodes, selecting items, and optionally checking nodes for multi-selection scenarios.
- **Semantic meaning**: Represents hierarchical relationships and nested structures in a visually organized manner, communicating containment, categorization, and hierarchical organization to users.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `data={treeData}`, `tree={useTree()}`)
- **Composed**: Via composition/children (e.g., custom `renderNode` function)
- **CSS-only**: Requires custom styling (e.g., custom icons, connecting lines)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Required `label` property on each node data object |
| Icon support | ✅ | Composed | Via `renderNode` function, accepts any React component (commonly uses @tabler/icons-react) |
| Custom content | ✅ | Composed | Full control through `renderNode` prop receiving `RenderTreeNodePayload` with node data, state, and pre-configured props |
| Badges/counts | ✅ | Composed | Can be added via `renderNode` using Mantine's Badge component or custom elements |

## Interaction Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Expandable/collapsible | ✅ | Native | Automatic via `expandOnClick` prop, manual via `tree.toggleExpanded()`, `expand()`, `collapse()`, `expandAllNodes()`, `collapseAllNodes()` |
| Selectable nodes | ✅ | Native | Single/multi selection via `tree.select()`, `tree.deselect()`, `tree.toggleSelected()`, `tree.clearSelected()`. Enable with `selectOnClick` prop |
| Checkable nodes | ✅ | Composed | Implemented via `Checkbox.Indicator` in `renderNode`, with `tree.checkNode()`, `tree.uncheckNode()`, `tree.isNodeChecked()`, `tree.isNodeIndeterminate()` for parent-child relationships |
| Draggable nodes | ❌ | N/A | Not supported natively, would require external library integration |
| Search/filter | ❌ | N/A | Not built-in, would require custom implementation filtering data array |
| Multi-select | ✅ | Native | Enabled via `multiple: true` in `useTree()` hook configuration |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | Composed/CSS-only | No native loading state, could be implemented via custom renderNode with loading indicators |
| Disabled | ❌ | Composed/CSS-only | No native disabled state prop, would need custom implementation in renderNode |
| Selected | ✅ | Native | Tracked via `initialSelectedState` in useTree, queried via selected parameter in renderNode, manipulated via tree.select/deselect methods |
| Expanded/Collapsed | ✅ | Native | Tracked via `initialExpandedState` in useTree, queried via expanded parameter in renderNode, manipulated via tree.expand/collapse/toggle methods |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Virtual scrolling | ❌ | N/A | Not supported, all nodes rendered in DOM |
| Directory tree | ✅ | Composed | Example implementation shown with folder/file icons using custom renderNode |
| Connecting lines | ❌ | CSS-only | Not provided by default, would require custom CSS styling |
| Block node style | ✅ | Native/CSS-only | Controlled via `levelOffset` prop for indentation, full styling via Styles API |

## Code Examples

### Basic Tree Structure
```jsx
import { Tree } from '@mantine/core';

const data = [
  {
    value: 'src',
    label: 'src',
    children: [
      { value: 'src/components', label: 'components' },
      { value: 'src/utils', label: 'utils' },
    ],
  },
];

function Demo() {
  return <Tree data={data} />;
}
```

### Custom Rendering with Icons
```jsx
import { Tree, Group } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

function Demo() {
  return (
    <Tree
      data={data}
      levelOffset={23}
      renderNode={({ node, expanded, hasChildren, elementProps }) => (
        <Group gap={5} {...elementProps}>
          {hasChildren && (
            <IconChevronDown
              size={18}
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          )}
          <span>{node.label}</span>
        </Group>
      )}
    />
  );
}
```

### Controlled State with useTree Hook
```jsx
import { Tree, useTree, Button, Group } from '@mantine/core';

function Demo() {
  const tree = useTree();

  return (
    <>
      <Tree data={data} tree={tree} />
      <Group mt="md">
        <Button onClick={() => tree.expandAllNodes()}>Expand all</Button>
        <Button onClick={() => tree.collapseAllNodes()}>Collapse all</Button>
      </Group>
    </>
  );
}
```

### Checkable Tree with Indeterminate States
```jsx
import { Tree, Checkbox, Group, useTree, getTreeExpandedState } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

const renderTreeNode = ({ node, expanded, hasChildren, elementProps, tree }) => {
  const checked = tree.isNodeChecked(node.value);
  const indeterminate = tree.isNodeIndeterminate(node.value);

  return (
    <Group gap="xs" {...elementProps}>
      <Checkbox.Indicator
        checked={checked}
        indeterminate={indeterminate}
        onClick={() =>
          checked ? tree.uncheckNode(node.value) : tree.checkNode(node.value)
        }
      />
      <Group gap={5} onClick={() => tree.toggleExpanded(node.value)}>
        <span>{node.label}</span>
        {hasChildren && (
          <IconChevronDown
            size={14}
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        )}
      </Group>
    </Group>
  );
};

function Demo() {
  const tree = useTree({
    initialExpandedState: getTreeExpandedState(data, ['src']),
    initialCheckedState: ['node1'],
  });

  return <Tree tree={tree} data={data} renderNode={renderTreeNode} />;
}
```

### Multi-Selection Tree
```jsx
import { Tree, useTree } from '@mantine/core';

function Demo() {
  const tree = useTree({
    multiple: true,
    initialSelectedState: ['node1', 'node2'],
  });

  return (
    <Tree
      data={data}
      tree={tree}
      selectOnClick
      clearSelectionOnOutsideClick
    />
  );
}
```

[View Live Examples](https://mantine.dev/core/tree/)

## Notable Features

### 1. Separation of State Management and Presentation
Mantine uses the `useTree` hook pattern to completely decouple state management from the Tree component itself. This provides:
- External control over tree state via imperative methods
- Easy integration with external UI controls (expand all, select all, etc.)
- State persistence and initialization capabilities

### 2. Indeterminate Checkbox Support
The tree provides built-in support for indeterminate checkbox states, automatically calculating when a parent node should show indeterminate status based on partially checked children. This is exposed via `tree.isNodeIndeterminate()`.

### 3. Flexible Rendering Architecture
The `renderNode` prop receives a comprehensive payload object:
- `node`: The actual data object
- `expanded`, `selected`: Current state booleans
- `hasChildren`: Structural information
- `level`: Depth in tree hierarchy
- `tree`: Full TreeController instance for imperative actions
- `elementProps`: Pre-configured styling and event handlers that should be spread onto the root element

This architecture allows complete customization while maintaining accessibility and proper event handling.

### 4. Helper Utilities
`getTreeExpandedState()` utility function simplifies initial state setup:
- Accepts data and array of node values to expand
- Supports `'*'` wildcard to expand all nodes
- Returns properly formatted state object for `useTree` hook

### 5. Type Safety
Full TypeScript support with exported types:
- `TreeNodeData` for data structure
- `TreeController` for useTree return value
- `RenderTreeNodePayload` for renderNode parameters

### 6. Minimal Default Styling
Component intentionally provides minimal visual styling, making it easy to customize through the Styles API without fighting against opinionated defaults.

### 7. Value-Based State Management
All state operations work with node `value` identifiers rather than node objects, simplifying state management and avoiding object reference issues.

## Implementation Patterns

### Data Structure Requirements
- Flat or nested array of objects
- Each node must have unique `value` property (string)
- `label` property for display text (string)
- Optional `children` array for nested nodes
- All node values must be globally unique across entire tree

### State Management Pattern
1. Create tree controller: `const tree = useTree({ ...config })`
2. Pass controller to Tree: `<Tree tree={tree} data={data} />`
3. Access methods: `tree.expand()`, `tree.select()`, etc.
4. Query state: `tree.isNodeChecked()`, via renderNode payload

### Custom Rendering Pattern
1. Define renderNode function accepting payload object
2. Destructure needed properties from payload
3. Spread `elementProps` onto root element for proper styling/events
4. Use `tree` instance for imperative state changes
5. Use `node` data for custom content

### Event Handling
- `onNodeExpand`: Callback when node expands
- `onNodeCollapse`: Callback when node collapses
- Custom events via onClick in renderNode
- Automatic event handling through `elementProps`

## Research Notes

### Documentation Quality
The Mantine Tree documentation is exceptionally well-structured:
- Clear separation between basic and advanced usage
- Multiple real-world examples (file explorer, checkable tree, controlled state)
- Complete API reference with TypeScript types
- Integration examples with other Mantine components
- Helper utilities documented alongside main component

### Framework Philosophy
Mantine's approach emphasizes:
- **Composition over configuration**: Custom rendering via renderNode rather than dozens of props
- **Controlled state**: useTree hook provides external state management
- **Minimal opinions**: Basic styling allows easy customization
- **Type safety**: Full TypeScript support throughout
- **Accessibility**: Proper props and handlers provided via elementProps

### Comparison to Other Frameworks
Notable architectural differences:
- **State separation**: Unlike many tree components that manage state internally, Mantine completely externalizes state via useTree hook
- **Rendering flexibility**: renderNode receives both state and imperative control, allowing complex interactions
- **No built-in search**: Expects filtering to happen at data level before passing to component
- **Value-based operations**: All methods work with string values rather than node objects

### Potential Limitations
- No virtual scrolling for large trees (performance concern for 1000+ nodes)
- No built-in drag-and-drop support
- No search/filter functionality
- No built-in connecting lines (common visual pattern)
- No built-in loading states for async tree nodes
- No disabled state support

### Implementation Complexity
- **Simple trees**: Very straightforward with just data prop
- **Selectable trees**: Requires useTree hook but remains simple
- **Checkable trees**: Moderate complexity requiring custom renderNode
- **Full-featured trees**: Significant implementation effort for icons, checkboxes, custom styling

The component strikes a balance between simplicity for basic use cases and power for complex scenarios through the renderNode escape hatch.
