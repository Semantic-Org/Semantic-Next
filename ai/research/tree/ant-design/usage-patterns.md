# Ant Design - Tree Usage Patterns

## Component URL
https://ant.design/components/tree
Status: ✅ Working
Version: Current (5.x)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Official documentation with multiple examples, complete API reference, and interactive demos.

## Component Definition
- **Core purpose**: Represents hierarchical relationships between items in a multi-level structure, allowing users to view, navigate, expand, collapse, select, and interact with tree-structured data.
- **Mental model**: A hierarchical tree structure where nodes can be parents (with children) or leaves (endpoints), supporting expansion/collapse, selection, checking, and drag-and-drop operations.
- **Semantic meaning**: Communicates organizational structure, file systems, taxonomies, classification hierarchies, and any parent-child relationships in the UI.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `checkable={true}`, `draggable={true}`)
- **Composed**: Via composition/children (e.g., custom icons via `icon` prop, custom rendering via `titleRender`)
- **CSS-only**: Requires custom styling (e.g., custom spacing, colors via className)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `title` prop on each node defines display text |
| Icon support | ✅ | Native | `showIcon={true}` + `icon` prop per node or globally |
| Custom content | ✅ | Native | `titleRender` function for custom node rendering |
| Badges/counts | ✅ | Composed | Via custom `titleRender` or `icon` with badge components |

## Interaction Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Expandable/collapsible | ✅ | Native | `expandedKeys`, `defaultExpandedKeys`, `defaultExpandAll`, `autoExpandParent`, `onExpand` |
| Selectable nodes | ✅ | Native | `selectable={true}` (default), `selectedKeys`, `defaultSelectedKeys`, `onSelect` |
| Checkable nodes | ✅ | Native | `checkable={true}`, `checkedKeys`, `defaultCheckedKeys`, `onCheck` |
| Draggable nodes | ✅ | Native | `draggable={true}`, drag events (`onDragStart`, `onDrop`, etc.), `allowDrop` control |
| Search/filter | ✅ | Native | `filterTreeNode` function prop, custom filtering logic |
| Multi-select | ✅ | Native | `multiple={true}` for selection, checkable mode supports multi-check by default |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | Native | Async data loading via `loadData` callback, `onLoad` event |
| Disabled | ✅ | Native | `disabled` prop per node, `disableCheckbox` for checkbox-only disable |
| Selected | ✅ | Native | `selectedKeys` array controls selection state, visual highlight |
| Expanded/Collapsed | ✅ | Native | `expandedKeys` array controls expansion state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Virtual scrolling | ✅ | Native | `virtual={true}` (default in v5), `height` prop required, `scrollTo()` method |
| Directory tree | ✅ | Native | `DirectoryTree` component variant with built-in folder/file styling |
| Connecting lines | ✅ | Native | `showLine={true}` displays tree structure lines, `showLeafIcon` for leaf indicators |
| Block node style | ✅ | Native | `blockNode={true}` makes nodes fill full width with background |

## Code Examples

### Basic Tree
```jsx
import { Tree } from 'antd';

const treeData = [
  {
    title: 'Parent Node',
    key: '0-0',
    children: [
      {
        title: 'Child Node 1',
        key: '0-0-0',
        children: [
          { title: 'Leaf', key: '0-0-0-0' },
          { title: 'Leaf', key: '0-0-0-1' },
        ],
      },
      {
        title: 'Child Node 2',
        key: '0-0-1',
        children: [
          { title: 'Leaf', key: '0-0-1-0' },
        ],
      },
    ],
  },
  {
    title: 'Parent Node 2',
    key: '0-1',
    children: [
      { title: 'Child Node', key: '0-1-0' },
    ],
  },
];

export default function BasicTree() {
  return (
    <Tree
      treeData={treeData}
      defaultExpandAll
    />
  );
}
```

### Checkable Tree
```jsx
import { Tree } from 'antd';
import { useState } from 'react';

const treeData = [
  {
    title: 'Documents',
    key: '0-0',
    children: [
      {
        title: 'Work',
        key: '0-0-0',
        children: [
          { title: 'Report.docx', key: '0-0-0-0' },
          { title: 'Presentation.pptx', key: '0-0-0-1' },
        ],
      },
      {
        title: 'Personal',
        key: '0-0-1',
        disabled: true,
        children: [
          { title: 'Resume.pdf', key: '0-0-1-0', disableCheckbox: true },
        ],
      },
    ],
  },
];

export default function CheckableTree() {
  const [checkedKeys, setCheckedKeys] = useState(['0-0-0-0']);

  const onCheck = (checkedKeysValue) => {
    console.log('Checked:', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  return (
    <Tree
      checkable
      defaultExpandAll
      checkedKeys={checkedKeys}
      onCheck={onCheck}
      treeData={treeData}
    />
  );
}
```

### Draggable Tree
```jsx
import { Tree } from 'antd';
import { useState } from 'react';

const initialData = [
  {
    title: 'Item 0',
    key: '0',
    children: [
      { title: 'Item 0-0', key: '0-0' },
      { title: 'Item 0-1', key: '0-1' },
    ],
  },
  {
    title: 'Item 1',
    key: '1',
    children: [
      { title: 'Item 1-0', key: '1-0' },
    ],
  },
];

export default function DraggableTree() {
  const [treeData, setTreeData] = useState(initialData);

  const onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // Logic to update tree structure
    console.log('Drop:', { dragKey, dropKey, dropPosition });
    // Update treeData based on drop logic
  };

  return (
    <Tree
      draggable
      blockNode
      defaultExpandAll
      onDrop={onDrop}
      treeData={treeData}
    />
  );
}
```

### Virtual Scrolling Tree
```jsx
import { Tree } from 'antd';
import { useState, useEffect } from 'react';

export default function VirtualTree() {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    // Generate large dataset
    const data = [];
    for (let i = 0; i < 1000; i++) {
      data.push({
        title: `Node ${i}`,
        key: `node-${i}`,
        children: [
          { title: `Leaf ${i}-0`, key: `node-${i}-0` },
          { title: `Leaf ${i}-1`, key: `node-${i}-1` },
        ],
      });
    }
    setTreeData(data);
  }, []);

  return (
    <Tree
      virtual
      height={400}
      treeData={treeData}
      defaultExpandedKeys={['node-0', 'node-1']}
    />
  );
}
```

### Tree with Search
```jsx
import { Tree, Input } from 'antd';
import { useState } from 'react';

const treeData = [
  {
    title: 'Documents',
    key: '0-0',
    children: [
      { title: 'Work Report', key: '0-0-0' },
      { title: 'Personal Notes', key: '0-0-1' },
    ],
  },
  {
    title: 'Images',
    key: '0-1',
    children: [
      { title: 'Vacation Photos', key: '0-1-0' },
      { title: 'Screenshots', key: '0-1-1' },
    ],
  },
];

export default function SearchableTree() {
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);

  const onSearch = (value) => {
    const newExpandedKeys = [];
    const search = (data) => {
      data.forEach((node) => {
        if (node.title.toLowerCase().includes(value.toLowerCase())) {
          newExpandedKeys.push(node.key);
        }
        if (node.children) {
          search(node.children);
        }
      });
    };

    search(treeData);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
  };

  return (
    <>
      <Input.Search
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Tree
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        treeData={treeData}
      />
    </>
  );
}
```

### Tree with Connecting Lines
```jsx
import { Tree } from 'antd';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';

const treeData = [
  {
    title: 'Root',
    key: '0-0',
    icon: <FolderOutlined />,
    children: [
      {
        title: 'Folder 1',
        key: '0-0-0',
        icon: <FolderOutlined />,
        children: [
          { title: 'File 1.txt', key: '0-0-0-0', icon: <FileOutlined />, isLeaf: true },
          { title: 'File 2.txt', key: '0-0-0-1', icon: <FileOutlined />, isLeaf: true },
        ],
      },
      {
        title: 'Folder 2',
        key: '0-0-1',
        icon: <FolderOutlined />,
        children: [
          { title: 'File 3.txt', key: '0-0-1-0', icon: <FileOutlined />, isLeaf: true },
        ],
      },
    ],
  },
];

export default function LineTree() {
  return (
    <Tree
      showLine
      showIcon
      defaultExpandAll
      treeData={treeData}
    />
  );
}
```

### Async Data Loading
```jsx
import { Tree } from 'antd';
import { useState } from 'react';

const initialData = [
  { title: 'Expand to load', key: '0' },
  { title: 'Expand to load', key: '1' },
];

export default function AsyncTree() {
  const [treeData, setTreeData] = useState(initialData);

  const updateTreeData = (list, key, children) => {
    return list.map((node) => {
      if (node.key === key) {
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
      }
      return node;
    });
  };

  const onLoadData = ({ key, children }) => {
    return new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }

      setTimeout(() => {
        setTreeData((origin) =>
          updateTreeData(origin, key, [
            { title: `Child ${key}-0`, key: `${key}-0` },
            { title: `Child ${key}-1`, key: `${key}-1` },
          ])
        );
        resolve();
      }, 1000);
    });
  };

  return <Tree loadData={onLoadData} treeData={treeData} />;
}
```

### Directory Tree Variant
```jsx
import { Tree } from 'antd';

const { DirectoryTree } = Tree;

const treeData = [
  {
    title: 'src',
    key: '0-0',
    children: [
      {
        title: 'components',
        key: '0-0-0',
        children: [
          { title: 'Header.jsx', key: '0-0-0-0', isLeaf: true },
          { title: 'Footer.jsx', key: '0-0-0-1', isLeaf: true },
        ],
      },
      {
        title: 'utils',
        key: '0-0-1',
        children: [
          { title: 'helpers.js', key: '0-0-1-0', isLeaf: true },
        ],
      },
    ],
  },
  {
    title: 'public',
    key: '0-1',
    children: [
      { title: 'index.html', key: '0-1-0', isLeaf: true },
    ],
  },
];

export default function DirectoryTreeExample() {
  const onSelect = (keys, info) => {
    console.log('Selected:', keys, info);
  };

  return (
    <DirectoryTree
      multiple
      defaultExpandAll
      onSelect={onSelect}
      treeData={treeData}
    />
  );
}
```
[View Live Examples](https://ant.design/components/tree/#components-tree-demo-basic)

## Notable Features

### Virtual Scrolling (Performance)
- Enabled by default in v5 (`virtual={true}`)
- Only renders visible nodes, dramatically improves performance with large datasets
- Requires explicit `height` prop
- Does not support horizontal scrolling or auto-width content
- Provides `scrollTo()` method for programmatic navigation

### Parent-Child Checkbox Relationship
- Checking a parent automatically checks all children
- Unchecking a parent unchecks all children
- Partially checked state shown when some children are checked
- Can disable with `checkStrictly={true}` for independent checkboxes

### Controlled vs Uncontrolled
- **Uncontrolled**: Use `defaultExpandedKeys`, `defaultSelectedKeys`, `defaultCheckedKeys`
- **Controlled**: Use `expandedKeys`, `selectedKeys`, `checkedKeys` with state management
- Controlled mode enables "expand all" / "collapse all" functionality

### Drag and Drop
- Built-in drag-and-drop with visual feedback
- `allowDrop` callback controls where nodes can be dropped
- Drop positions: before, after, or inside (as child)
- Events: `onDragStart`, `onDragEnter`, `onDragOver`, `onDragLeave`, `onDragEnd`, `onDrop`

### Async Loading
- `loadData` prop accepts function returning Promise
- Dynamically loads children when parent expands
- `onLoad` callback for completion handling
- Useful for large datasets or API-driven trees

### Field Name Customization
- `fieldNames` prop allows mapping custom data structures
- Default: `{ title: 'title', key: 'key', children: 'children' }`
- Example: `fieldNames={{ title: 'name', key: 'id', children: 'items' }}`

### DirectoryTree Component
- Specialized variant for file/folder structures
- Built-in folder and file icons
- Multiple selection with Ctrl/Cmd key support
- Optimized for file browser UIs

## API Reference

### Tree Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `treeData` | `TreeNode[]` | `[]` | Tree data structure array |
| `checkable` | `boolean` | `false` | Add checkbox before nodes |
| `selectable` | `boolean` | `true` | Allow node selection |
| `multiple` | `boolean` | `false` | Allow multiple selection |
| `draggable` | `boolean` | `false` | Enable drag-and-drop |
| `blockNode` | `boolean` | `false` | Fill full width with background |
| `showIcon` | `boolean` | `false` | Show icons before titles |
| `showLine` | `boolean \| object` | `false` | Show connecting lines |
| `virtual` | `boolean` | `true` | Enable virtual scrolling |
| `height` | `number` | - | Height for virtual scrolling |
| `defaultExpandAll` | `boolean` | `false` | Expand all nodes initially |
| `defaultExpandedKeys` | `string[]` | `[]` | Initially expanded nodes |
| `expandedKeys` | `string[]` | - | Controlled expanded nodes |
| `autoExpandParent` | `boolean` | `true` | Auto-expand parent nodes |
| `defaultCheckedKeys` | `string[]` | `[]` | Initially checked nodes |
| `checkedKeys` | `string[]` | - | Controlled checked nodes |
| `checkStrictly` | `boolean` | `false` | Disable parent-child relationship |
| `defaultSelectedKeys` | `string[]` | `[]` | Initially selected nodes |
| `selectedKeys` | `string[]` | - | Controlled selected nodes |
| `filterTreeNode` | `function(node)` | - | Filter function for nodes |
| `loadData` | `function(node)` | - | Async data loading function |
| `titleRender` | `function(node)` | - | Custom title rendering |
| `fieldNames` | `object` | - | Customize field names |
| `allowDrop` | `function(options)` | - | Control drop behavior |
| `onExpand` | `function(keys, info)` | - | Expand/collapse callback |
| `onSelect` | `function(keys, info)` | - | Selection callback |
| `onCheck` | `function(keys, info)` | - | Check callback |
| `onDrop` | `function(info)` | - | Drop callback |
| `onLoad` | `function(loadedKeys, info)` | - | Load data callback |
| `onRightClick` | `function({event, node})` | - | Right-click callback |

### TreeNode Props (in treeData)
| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Title content |
| `key` | `string` | Unique identifier (required) |
| `children` | `TreeNode[]` | Child nodes |
| `disabled` | `boolean` | Disable the node |
| `disableCheckbox` | `boolean` | Disable checkbox only |
| `selectable` | `boolean` | Allow selection |
| `checkable` | `boolean` | Show checkbox |
| `isLeaf` | `boolean` | Mark as leaf node |
| `icon` | `ReactNode` | Custom icon |
| `switcherIcon` | `ReactNode` | Custom switcher icon |

### Tree Methods
| Method | Description |
|--------|-------------|
| `scrollTo({ key, align, offset })` | Scroll to specific node (virtual scroll) |

## Research Notes

### Accessibility
- Ant Design Tree includes built-in keyboard navigation
- Arrow keys for navigation, Space/Enter for selection
- Proper ARIA attributes for screen readers
- Focus management for keyboard users

### Performance Considerations
- Virtual scrolling is default in v5 for performance
- Large trees (1000+ nodes) should always use virtual scrolling
- Async loading recommended for very large datasets
- `defaultExpandAll` can be slow with many nodes; use controlled expansion instead

### Version Notes
- Virtual scrolling added in v4.1.0
- DirectoryTree component available since v3.x
- v5 made virtual scrolling default
- Field name customization improved in v5

### Common Patterns
1. **File Browser**: DirectoryTree with icons and multiple selection
2. **Organization Chart**: Tree with custom rendering and connecting lines
3. **Taxonomy Browser**: Searchable tree with async loading
4. **Settings Menu**: Checkable tree for multi-option selection
5. **Project Structure**: Draggable tree for reordering items

### Limitations
- Virtual scroll doesn't support horizontal scrolling
- `defaultExpandAll` doesn't work with async data (use controlled `expandedKeys`)
- Tree node keys must be globally unique across all levels
- Disabled nodes don't conduct state to other nodes

### Framework Integration
- Works seamlessly with React 16.9+
- TypeScript support with full type definitions
- Compatible with Next.js, Create React App, Vite
- SSR-compatible with proper configuration
