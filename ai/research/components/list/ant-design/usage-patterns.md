# Ant Design - List Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/list
Status: ✅ Working
Version: 5.24.0+ (Current)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent API documentation with detailed property descriptions, TypeScript interfaces, multiple code examples demonstrating various patterns, and design guidance on when and how to use the component.

## Component Definition
- **Core purpose**: Displays items in a structured list format with flexible content rendering. Provides layout options (vertical/horizontal), pagination, virtualization, and composition patterns to handle both simple and complex data-driven UIs. Designed for rendering collections where each item has consistent structure.
- **Mental model**: A container for rendering a data collection where each item follows a template pattern. Like a controlled `{#each}` loop in templates but with built-in support for pagination, virtualization, headers/footers, and responsive layouts.
- **Semantic meaning**: Communicates a collection of related items with consistent presentation. Visual organization signals that items are part of a cohesive dataset rather than independent components.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `itemLayout="vertical"`, `pagination`, `grid`, `dataSource`, `renderItem`)
- **Composed**: Via composition/children (e.g., `<List.Item>`, `<List.Item.Meta>`, custom content via renderItem function)
- **CSS-only**: Requires custom styling (e.g., custom animations, custom item spacing)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text items | ✅ | Native | Simple string/text items via dataSource array + renderItem function |
| Rich content items | ✅ | Composed | `<List.Item>` component wraps custom ReactNode content for flexibility |
| Icons/avatars | ✅ | Composed | Via `<List.Item.Meta avatar={...}>` sub-component for structured metadata |
| Images | ✅ | Composed | Support via custom renderItem or within List.Item.Meta |
| Actions/buttons | ✅ | Composed | `<List.Item actions={[...]}>` array of ReactNode elements positioned at end of item |
| Metadata | ✅ | Composed | `<List.Item.Meta>` sub-component with avatar, title, description props |
| Links | ✅ | Composed | Wrap List.Item content in anchor tags or use onClick handlers |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | Native | Default or `itemLayout="vertical"` - full-width items stacked |
| Horizontal layout | ✅ | Native | `itemLayout="horizontal"` - content in single row (default for most items) |
| Grid layout | ✅ | Native | `grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 8 }}` for responsive columns |
| Card-style items | ✅ | Composed | Render Card components within List.Item for nested card layout |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable items | ✅ | Composed | Add onClick handler to List.Item or wrap in clickable element |
| Selection | ✅ | Composed | Implement via state management in renderItem or List.Item component |
| Drag and drop | ✅ | CSS-only | Not built-in; requires integration with dnd-kit or similar library |
| Expandable items | ✅ | Composed | Implement via state in renderItem; List doesn't provide built-in expand API |

## Data Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Static data | ✅ | Native | `dataSource={[item1, item2, ...]}` array prop for static lists |
| Dynamic data source | ✅ | Native | `dataSource` can be updated dynamically; List re-renders when data changes |
| Pagination | ✅ | Native | `pagination={{ pageSize: 10, current: 1, total: 100, onChange: callback }}` for server-side or client-side pagination |
| Infinite scroll | ✅ | Composed | Can implement with `loadMore` callback pattern or external infinite-scroll-component integration |
| Loading states | ✅ | Native | `loading={true}` prop shows skeleton placeholder while data loads |
| Empty states | ✅ | Native | `locale={{ emptyText: 'No data' }}` or conditional rendering when dataSource is empty |
| Virtualization | ✅ | Native | Integrate with `rc-virtual-list` for rendering large datasets (100k+ items) efficiently |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="default" \| "small" \| "large"` for item padding/spacing |
| Bordered | ✅ | Native | `bordered={true}` adds border around list container |
| Split/divided | ✅ | Native | `split={true}` (default) adds dividers between items; `split={false}` removes dividers |
| Density control | ✅ | Native | `size="small"` for compact lists, `size="large"` for spacious lists; `split` controls dividers |

## Code Examples

### Basic List with Static Data
```jsx
import { List } from 'antd';

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Third example item.',
];

<List
  dataSource={data}
  renderItem={(item) => (
    <List.Item>
      {item}
    </List.Item>
  )}
/>
```

### List with Metadata (Avatar, Title, Description)
```jsx
import { List, Avatar } from 'antd';

const data = [
  {
    title: 'Ant Design Title 1',
    avatar: 'https://api.example.com/avatar1.jpg',
    description: 'Ant Design, a design language for background applications.',
  },
  {
    title: 'Ant Design Title 2',
    avatar: 'https://api.example.com/avatar2.jpg',
    description: 'Ant Design, a design language for background applications.',
  },
];

<List
  itemLayout="horizontal"
  dataSource={data}
  renderItem={(item) => (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={item.avatar} />}
        title={<a href="https://ant.design">{item.title}</a>}
        description={item.description}
      />
    </List.Item>
  )}
/>
```

### Vertical Layout with Actions
```jsx
<List
  itemLayout="vertical"
  dataSource={data}
  renderItem={(item) => (
    <List.Item
      key={item.id}
      actions={[
        <span>Action 1</span>,
        <span>Action 2</span>,
      ]}
    >
      <h4>{item.title}</h4>
      <p>{item.content}</p>
    </List.Item>
  )}
/>
```

### List with Pagination
```jsx
import { List, Pagination } from 'antd';
import { useState } from 'react';

const App = () => {
  const [current, setCurrent] = useState(1);

  return (
    <List
      dataSource={data}
      pagination={{
        pageSize: 10,
        current: current,
        total: data.length,
        onChange: (page) => setCurrent(page),
      }}
      renderItem={(item) => (
        <List.Item>{item}</List.Item>
      )}
    />
  );
};
```

### Responsive Grid Layout
```jsx
<List
  grid={{
    gutter: 16,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
    xxl: 8,
  }}
  dataSource={data}
  renderItem={(item) => (
    <List.Item>
      <Card title={item.title}>
        {item.description}
      </Card>
    </List.Item>
  )}
/>
```

### Loading State
```jsx
import { List } from 'antd';
import { useState, useEffect } from 'react';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setData([/* items */]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <List
      loading={loading}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>{item}</List.Item>
      )}
    />
  );
};
```

### List with Bordered Variant and Dividers
```jsx
<List
  bordered={true}
  split={true}
  size="small"
  dataSource={data}
  renderItem={(item) => (
    <List.Item>
      {item}
    </List.Item>
  )}
/>
```

### List with Header and Footer
```jsx
<List
  header={<div>Header Content</div>}
  footer={<div>Footer Content</div>}
  bordered={true}
  dataSource={data}
  renderItem={(item) => (
    <List.Item>{item}</List.Item>
  )}
/>
```

### Custom Item Rendering (Complex Content)
```jsx
const renderItem = (item) => (
  <List.Item
    key={item.id}
    actions={[
      <a key="list-loadmore-edit">edit</a>,
      <a key="list-loadmore-more">more</a>,
    ]}
  >
    <List.Item.Meta
      avatar={<Avatar size="large" src={item.picture} />}
      title={<a href="https://example.com">{item.name}</a>}
      description={item.description}
    />
    <div>{item.content}</div>
  </List.Item>
);

<List
  itemLayout="vertical"
  size="large"
  pagination={{
    onChange: (page) => console.log(page),
  }}
  dataSource={data}
  renderItem={renderItem}
/>
```

## Notable Features

### ItemLayout Prop
- **vertical**: Full-width items with content below title/meta. Better for detailed content.
- **horizontal**: Compact row layout with avatar/content side-by-side. Better for lists of people/items with metadata.
- Default is typically horizontal for List.Item with Meta, vertical for rich content

### DataSource + RenderItem Pattern
- `dataSource`: Array of data items (strings, objects, etc.)
- `renderItem`: Function `(item, index) => ReactNode` to transform each item into UI
- Consistent with React patterns for data-driven rendering
- Efficient: only renders visible items if virtualization enabled

### List.Item.Meta Sub-component
- Structured component for item metadata: `avatar`, `title`, `description`
- Handles layout and spacing automatically
- Works best with `itemLayout="horizontal"`
- Common pattern for user profiles, article previews, search results

### Pagination Integration
- Native `pagination` prop accepts Pagination component config
- Supports both client-side (via data filtering) and server-side pagination
- `onChange` callback for page changes
- Options: `pageSize`, `current`, `total`, `pageSizeOptions`

### Grid Layout Option
- Responsive grid via `grid` prop with breakpoint configuration
- Similar to Ant Design's Grid system breakpoints: xs, sm, md, lg, xl, xxl
- Each item rendered in grid cell determined by `gutter` (spacing) and column count
- Useful for card/tile layouts without separate Grid wrapper

### Virtualization Support
- Integrates with `rc-virtual-list` for handling 100k+ items
- Only renders visible items in viewport
- Significantly improves performance with large datasets
- Can combine with pagination for balanced approach

### Bordered & Split Props
- `bordered={true}`: Adds border around entire list
- `split={true}` (default): Adds dividers between items
- `split={false}`: No dividers for seamless layout
- `bordered` + `split` provide visual structure/hierarchy

### Size Variants
- `size="default"`: Standard padding (recommended)
- `size="small"`: Compact spacing (dashboards, dense lists)
- `size="large"`: Spacious padding (important items, feature lists)
- Affects item padding and font sizing

### Loading State
- `loading={true}`: Shows skeleton placeholder
- Shows loading skeleton for all item sub-components
- Single prop to indicate data fetching in progress
- No custom loading UI needed

### Empty State
- `locale={{ emptyText: 'No data' }}` or use ternary in renderItem
- Can show custom empty state component
- Common pattern: conditional rendering based on data length

### Header and Footer
- `header={ReactNode}`: Content above list
- `footer={ReactNode}`: Content below list
- Useful for list labels, instructions, or pagination info
- Full-width across list container

## Complete TypeScript Interface

### List Component Props
```typescript
interface ListProps<T> {
  // Data
  dataSource?: T[];                          // Array of items to render
  renderItem?: (item: T, index: number) => React.ReactNode;  // Render function

  // Layout
  itemLayout?: 'horizontal' | 'vertical';    // Item layout direction (default: 'horizontal')
  grid?: GridProps;                          // Responsive grid layout configuration
  split?: boolean;                           // Show dividers between items (default: true)
  bordered?: boolean;                        // Add border around list (default: false)
  size?: 'default' | 'small' | 'large';      // Item size/spacing (default: 'default')

  // State
  loading?: boolean;                         // Show loading skeleton (default: false)

  // Pagination
  pagination?: PaginationProps | false;      // Pagination configuration (false to disable)

  // Content
  header?: React.ReactNode;                  // List header content
  footer?: React.ReactNode;                  // List footer content

  // Localization
  locale?: {
    emptyText?: React.ReactNode;            // Empty list text (default: 'No data')
  };

  // Styling
  style?: React.CSSProperties;
  className?: string;
  rowKey?: string | ((record: T, index: number) => string); // Key for list items
}

interface GridProps {
  gutter?: number | [number, number];        // Spacing between items
  xs?: number;                               // <576px columns
  sm?: number;                               // ≥576px columns
  md?: number;                               // ≥768px columns
  lg?: number;                               // ≥992px columns
  xl?: number;                               // ≥1200px columns
  xxl?: number;                              // ≥1600px columns
}
```

### List.Item Props
```typescript
interface ListItemProps {
  key?: React.Key;                           // Key for list item in array render
  actions?: React.ReactNode[];               // Action buttons/elements at item end
  extra?: React.ReactNode;                   // Extra content (right side in horizontal layout)
  children?: React.ReactNode;                // Item main content
}
```

### List.Item.Meta Props
```typescript
interface ListItemMetaProps {
  avatar?: React.ReactNode;                  // Avatar/icon element
  title?: React.ReactNode;                   // Title content
  description?: React.ReactNode;             // Description/subtitle content
}
```

## Research Notes

### Documentation Access
- Primary documentation: https://ant.design/components/list
- Comprehensive API reference with TypeScript definitions
- Multiple examples showing different patterns
- Well-structured with clear prop descriptions

### Framework Approach Observations

**Data-Driven Rendering Pattern:**
- List component follows React's common pattern: dataSource + renderItem
- Separates data model from presentation logic
- Flexible: renderItem can be simple or complex
- Consistent with other collection components (Table, etc.)

**Sub-component Composition:**
- List.Item for wrapping individual items
- List.Item.Meta for structured metadata (avatar, title, description)
- List.Item actions for action buttons
- Static properties pattern similar to Card component

**Layout Flexibility:**
- itemLayout prop for content organization (horizontal vs vertical)
- Grid prop for responsive column layouts without separate Grid wrapper
- Composition with Grid/Row/Col components for advanced layouts
- Supports both container and item-level layout control

**Pagination Strategy:**
- Native pagination prop avoids composition complexity
- Accepts Pagination component props for configuration
- Controlled component pattern with onChange callback
- Works with both client-side and server-side pagination

**Performance Patterns:**
- Loading state for data fetching UX
- Virtualization support via rc-virtual-list for large datasets
- renderItem pattern only creates DOM for visible items
- Can combine pagination + virtualization for balanced performance

**Visual Hierarchy:**
- itemLayout distinguishes between metadata-focused (horizontal) and content-focused (vertical) layouts
- Size variants (small/default/large) for density control
- Bordered and split props for visual structure
- Header/footer for list-level labels and info

**State Communication:**
- Loading boolean for data fetch indication
- No built-in selection/checking (compose with Checkbox if needed)
- No built-in sorting/filtering (implement in parent)
- Pagination onChange callback for page management

**Semantic Structure:**
- List.Item.Meta pattern for consistent item metadata display
- Actions array provides predictable action placement
- Header/footer provide entry/exit points for list-level content
- Clear separation of concerns between layout and content

### Design Patterns Observed

**Content Organization:**
- Items arranged vertically by default
- Grid layout option for tile/card arrangements
- Horizontal layout combines metadata (avatar) with content
- Vertical layout emphasizes content with metadata below

**Interaction Patterns:**
- Actions array at item end for quick actions
- Clickable items via onClick or anchor tags
- Loading state for async operations
- Pagination for large datasets

**Layout Strategies:**
- itemLayout prop for presentation mode selection
- Grid for responsive layouts without Grid wrapper
- Bordered/split for visual structure
- Size for density control

**Data Handling:**
- DataSource array pattern (not reactive like Semantic UI signals)
- RenderItem function for transformation
- Pagination for subset display
- Virtualization for large collections

### Comparison Points for Semantic UI

**Strengths:**
- Clean dataSource + renderItem pattern for data-driven lists
- Integrated pagination without composition complexity
- Grid layout option for responsive arrangements
- Loading state with skeleton UI
- List.Item.Meta provides structured metadata layout
- Size variants for different densities

**Potential Improvements:**
- More built-in selection patterns (checkboxes, radio)
- Drag-and-drop integration (requires external library currently)
- Expandable/collapsible items pattern
- Built-in filtering/sorting UI
- Better empty state customization options
- Virtual scrolling more discoverable/integrated

**Alignment with Web Standards:**
- React-specific (not web components)
- Uses controlled component patterns (dataSource, renderItem)
- Could benefit from slots for content projection
- Could be more declarative vs function-based rendering

### API Design Lessons

**Prop Naming:**
- Clear action names: itemLayout, renderItem, dataSource
- Boolean modifiers: loading, bordered, split
- Composition via sub-components: Item, Item.Meta
- Localization via locale prop object

**Flexibility:**
- ItemLayout prop changes presentation without restructuring
- RenderItem function supports simple to complex content
- Grid prop enables layouts without separate components
- Pagination can be disabled or customized

**Composition:**
- List.Item for structure
- List.Item.Meta for metadata layout
- List.Item actions for action buttons
- Parent handles pagination state

**Progressive Enhancement:**
- Basic: just dataSource + renderItem
- Enhanced: add pagination, grid, itemLayout
- Advanced: virtualization, custom empty states, complex content

### Potential Limitations

- No built-in selection (checkbox/radio) - must compose
- No built-in sorting/filtering - must implement in parent
- No built-in drag-and-drop - must integrate external library
- No built-in expandable items - must implement via state
- ItemLayout change requires data restructuring (not dynamic)
- Grid layout less flexible than separate Grid component

