# MUI - Tree Usage Patterns

## Component URL
https://mui.com/x/react-tree-view/
Status: ✅ Working
Version: MUI X v7 (Current as of 2025)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - MUI X provides extensive documentation with detailed API references, multiple examples, customization guides, and separate documentation for different component variants (SimpleTreeView vs RichTreeView).

## Component Definition
- **Core purpose**: Display hierarchical data structures with expandable/collapsible nodes, enabling users to navigate, select, and interact with tree-based data representations.
- **Mental model**: A nested file/folder structure where items can contain children, be expanded to reveal deeper levels, and support various interaction patterns (selection, editing, reordering). Users think of it as a navigable hierarchy similar to file explorers or organizational charts.
- **Semantic meaning**: Represents hierarchical relationships and parent-child data structures. Communicates organization, structure, and depth of information through visual indentation and expand/collapse affordances.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `multiSelect={true}`, `checkboxSelection={true}`)
- **Composed**: Via composition/children (e.g., `<SimpleTreeView><TreeItem /></SimpleTreeView>`)
- **CSS-only**: Requires custom styling (e.g., custom icons via `sx` prop)
- **Pro**: Requires MUI X Pro commercial license
- **Custom**: Requires custom implementation using hooks/APIs

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `label` prop on TreeItem or `getItemLabel` prop on RichTreeView. Supports string labels for all tree items. |
| Icon support | ✅ | Native + Composed | `collapseIcon`, `expandIcon`, and `defaultEndIcon` props/slots. Full icon customization through Material Icons or custom SVG components. |
| Custom content | ✅ | Composed + Slots | Use `slots` and `slotProps` to pass custom components. Can completely replace item rendering with custom components. Rich content beyond simple text labels supported. |
| Badges/counts | ✅ | Custom | Not built-in, but achievable through custom item components using slots system. Developers can add badges, counts, or status indicators to tree items. |

## Interaction Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Expandable/collapsible | ✅ | Native | Core feature. `defaultExpanded`, `expanded`, `onExpandedItemsChange` props. `expansionTrigger` prop controls whether clicking icon or entire content expands items. |
| Selectable nodes | ✅ | Native | `selectedItems` and `onSelectedItemsChange` props. Single selection by default. Click to select items. |
| Checkable nodes | ✅ | Native | `checkboxSelection` prop adds checkboxes to all items. Works with `multiSelect`. Parent-child selection relationships NOT automatic (requires custom implementation). |
| Draggable nodes | ✅ | Pro | `itemsReordering={true}` on RichTreeViewPro. Includes `isItemReorderable` and `canMoveItemToNewPosition` props for fine control. Custom drag handles via custom components. **Requires MUI X Pro license**. |
| Search/filter | ⚠️ | Custom | No built-in search/filter UI. Can be implemented using API methods and external input. `disableChildrenFiltering` prop available for filtering behavior control. |
| Multi-select | ✅ | Native | `multiSelect={true}` prop. Supports Ctrl+click for independent selection and Shift+click for range selection. Works with both regular selection and checkbox selection. |
| Label editing | ✅ | Native | Core feature in free version. `useTreeItemUtils` hook provides `toggleItemEditing`, `handleCancelItemLabelEditing`, and `handleSaveItemLabel` methods. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | Native | `useTreeItem` hook returns status object with `loading` property. Can display loading indicators on individual tree items. |
| Disabled | ✅ | Native | `disabled` prop on TreeItem. `setIsItemDisabled` API method. `disabledItemsFocusable` prop controls keyboard navigation behavior around disabled items. |
| Selected | ✅ | Native | Full selection state management via `selectedItems` prop. `setItemSelection()` API method for programmatic control. Visual styling via `treeItemClasses` and theme overrides. |
| Expanded/Collapsed | ✅ | Native | `expanded` (controlled) or `defaultExpanded` (uncontrolled) props. `onExpandedItemsChange` callback. Full expansion state control and keyboard navigation support. |
| Focused | ✅ | Native | `useTreeItem` hook status includes `focused` property. Accessible focus indicators with keyboard navigation support. |
| Editing | ✅ | Native | Status property and methods available through `useTreeItemUtils`. Toggle editing mode programmatically. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Virtual scrolling | ⚠️ | Pro (In Progress) | Not in free version. Advertised in Pro version but marked as "In Progress" on roadmap. Performance issues reported with >1000 items. Community workarounds use react-vtree or react-window. |
| Directory tree | ✅ | Native + Composed | Natural use case. Examples show file system navigation with folder/file icons. Achieved through nested TreeItems with appropriate icons. |
| Connecting lines | ❌ | CSS-only | Not built-in. Would require custom CSS styling to add visual connecting lines between parent-child items. |
| Block node style | ✅ | CSS-only | Achievable through theme customization and `treeItemClasses` targeting. Use `sx` prop or styleOverrides for full-width item backgrounds. |
| Lazy loading | ✅ | Pro | Pro feature for loading children on-demand. Optimizes performance for large datasets with dynamic data fetching. |
| Indentation control | ✅ | Native | `itemChildrenIndentation` prop changes nested item indentation (default 12px). |

## Architecture Patterns

### Two Component Variants

**SimpleTreeView** - Recommended for hardcoded items:
- Items defined as JSX children
- Manual tree structure composition
- Best for static, known-at-compile-time trees
- Direct TreeItem nesting

**RichTreeView** - Preferred for dynamic data:
- `items` prop accepts array of objects
- Data-driven rendering
- Better for large trees, editing, and virtualization
- Uses `getItemId` and `getItemLabel` for field mapping
- Supports Pro features like lazy loading

### Performance Considerations

- **Items prop reference stability**: RichTreeView requires stable `items` array reference to avoid re-generating entire structure
- **Performance limitations**: Significant issues with >1,000 items (delays), >5,000 items (stack overflow/unresponsiveness) without virtualization
- **Optimization**: Use lazy loading (Pro) or implement custom virtualization with react-window

## Code Examples

### Basic SimpleTreeView Example
```jsx
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

<SimpleTreeView
  aria-label="file system navigator"
  defaultCollapseIcon={<ExpandMoreIcon />}
  defaultExpandIcon={<ChevronRightIcon />}
  sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
>
  <TreeItem itemId="1" label="Applications">
    <TreeItem itemId="2" label="Calendar" />
    <TreeItem itemId="3" label="Chrome" />
  </TreeItem>
  <TreeItem itemId="5" label="Documents">
    <TreeItem itemId="6" label="MUI">
      <TreeItem itemId="7" label="src">
        <TreeItem itemId="8" label="index.js" />
        <TreeItem itemId="9" label="tree-view.js" />
      </TreeItem>
    </TreeItem>
  </TreeItem>
</SimpleTreeView>
```

### RichTreeView with Data-Driven Items
```jsx
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const items = [
  {
    id: '1',
    label: 'Applications',
    children: [
      { id: '2', label: 'Calendar' },
      { id: '3', label: 'Chrome' }
    ],
  },
  {
    id: '5',
    label: 'Documents',
    children: [
      {
        id: '6',
        label: 'MUI',
        children: [
          { id: '8', label: 'index.js' },
        ],
      },
    ],
  },
];

<RichTreeView
  items={items}
  defaultExpanded={['1', '5']}
/>
```

### Multi-Select with Checkboxes
```jsx
<SimpleTreeView
  checkboxSelection
  multiSelect
  selectedItems={selectedItems}
  onSelectedItemsChange={(event, itemIds) => setSelectedItems(itemIds)}
>
  <TreeItem itemId="1" label="Item 1" />
  <TreeItem itemId="2" label="Item 2">
    <TreeItem itemId="3" label="Child 2.1" />
    <TreeItem itemId="4" label="Child 2.2" />
  </TreeItem>
</SimpleTreeView>
```

### Custom Item Styling with Slots
```jsx
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';

function CustomTreeItem(props) {
  const { interactions, status } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });

  return (
    <div>
      {/* Custom rendering with full control */}
      <span onClick={interactions.handleSelection}>
        {props.label}
      </span>
      {status.loading && <CircularProgress size={16} />}
    </div>
  );
}

<RichTreeView
  items={items}
  slots={{
    item: CustomTreeItem,
  }}
/>
```

### Controlled Expansion
```jsx
const [expandedItems, setExpandedItems] = React.useState(['1']);

<SimpleTreeView
  expanded={expandedItems}
  onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
>
  <TreeItem itemId="1" label="Expandable Item">
    <TreeItem itemId="2" label="Child Item" />
  </TreeItem>
</SimpleTreeView>
```

### Customizing Icons and Indentation
```jsx
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

<SimpleTreeView
  expandIcon={<FolderIcon />}
  collapseIcon={<FolderOpenIcon />}
  defaultEndIcon={<InsertDriveFileIcon />}
  itemChildrenIndentation={24} // Increase indentation to 24px
>
  {/* Tree items */}
</SimpleTreeView>
```

### Imperative API Access
```jsx
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

function MyComponent() {
  const apiRef = useTreeViewApiRef();

  const handleExpandAll = () => {
    apiRef.current.setItemExpansion(event, itemId, true);
  };

  const handleSelectItem = (itemId) => {
    apiRef.current.setItemSelection(event, itemId, true);
  };

  return (
    <RichTreeView
      apiRef={apiRef}
      items={items}
    />
  );
}
```

[View Live Examples](https://mui.com/x/react-tree-view/getting-started/)

## Notable Features

### Advanced API and Hooks
- **useTreeViewApiRef**: Imperative API methods for external control (setItemExpansion, setItemSelection, etc.)
- **useTreeItemUtils**: Provides interaction methods and status for custom item implementations
- **Status object**: Comprehensive state tracking (expanded, expandable, focused, selected, disabled, editable, editing, loading)

### Accessibility First
- Full keyboard navigation support (Arrow keys, Enter, Space)
- `aria-label` support for screen readers
- Focus management with `disabledItemsFocusable` control
- Outline-based focus indicators meeting WCAG standards

### Flexible Data Mapping
- `getItemId` prop for custom ID field mapping (default: 'id')
- `getItemLabel` prop for custom label field mapping (default: 'label')
- Supports any data structure without transformation

### Two-Tier Product Strategy
- **Community (Free)**: Core features including expansion, selection, multi-select, checkboxes, label editing, basic customization
- **Pro (Commercial)**: Advanced features including drag & drop reordering, lazy loading, virtualization (in progress), enhanced performance for large datasets

### Theme Integration
- Full Material-UI theme system integration
- `treeItemClasses` for targeting internal elements
- `styleOverrides` in custom themes
- Light/dark mode support out of the box
- CSS custom properties for design tokens

### Parent-Child Selection Independence
- Selecting parent does NOT auto-select children (by design)
- Selecting all children does NOT auto-select parent
- This behavior is consistent across regular and checkbox selection
- Custom implementation required for cascading selection (common request in community)

### Customization Architecture
- **Slots system**: Replace entire components (item, checkbox, groupTransition)
- **SlotProps**: Pass props to slot components for data/behavior customization
- **Composition**: Nest custom components as TreeItem children
- **Styling**: CSS-in-JS via sx prop, treeItemClasses, or theme overrides

## Research Notes

### Documentation Access
- Documentation is comprehensive and well-organized across multiple pages
- Separate guides for SimpleTreeView vs RichTreeView features
- Extensive API reference pages for each component
- Active GitHub repository with issue tracking and feature roadmap

### Framework Approach Observations
1. **Two-component strategy** (Simple vs Rich) provides clear guidance based on use case rather than forcing single approach
2. **Slots and hooks system** offers deep customization while maintaining simplicity for basic uses
3. **Pro features behind paywall** is transparent but may limit adoption for open-source projects
4. **Performance limitations** (<1000 items) are well-documented in community but not prominently in official docs
5. **Parent-child selection independence** is a deliberate design choice that differs from many other tree view implementations
6. **Material Design philosophy** deeply integrated - customization works within MUI's system rather than against it

### Unique Patterns
- **useTreeItemUtils hook**: Innovative approach to expose internal interaction methods and status for custom implementations
- **expansionTrigger prop**: Explicit control over whether click target is icon-only or full content
- **itemChildrenIndentation prop**: Direct control over visual hierarchy depth
- **Stable reference requirement**: RichTreeView's performance optimization through reference equality checking is explicitly documented

### Community Feedback Themes
- High demand for built-in virtualization (marked as in progress for Pro)
- Frequent requests for cascading parent-child selection
- Third-party packages emerged to fill gaps (mui-draggable-treeview for free drag & drop)
- Performance concerns with large datasets a recurring theme
- Strong appreciation for customization flexibility

### Version Context
Research conducted on MUI X v7 documentation (2025). Tree View moved from @mui/lab to @mui/x-tree-view package, now a core part of MUI X product line with active development and feature roadmap.
