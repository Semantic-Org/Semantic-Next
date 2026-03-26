# Ant Design - Pagination Usage Patterns

## Component URL
https://ant.design/components/pagination
Status: ✅ Working
Version: Current (5.x)
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - The official Ant Design documentation provides detailed API reference, multiple interactive examples, and extensive property documentation.

## Component Definition
- **Core purpose**: A pagination component for splitting data into multiple pages with navigation controls, allowing users to browse through large datasets efficiently.
- **Mental model**: A navigation control that represents the current position within a dataset and provides methods to move between pages, adjust page size, and jump to specific pages.
- **Semantic meaning**: Communicates to users their current position in a multi-page dataset and provides intuitive controls for dataset navigation and viewing preferences.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `total={100}`, `showSizeChanger`)
- **Composed**: Via composition/children (e.g., `itemRender` for custom content)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`, `className`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Page numbers | ✅ | Native | Automatically displays page numbers based on `total` and `pageSize` props |
| Previous/Next buttons | ✅ | Native | Built-in navigation buttons, customizable via `itemRender` prop |
| First/Last buttons | ✅ | Native/Composed | Available in default mode; can be customized with `itemRender` |
| Page size selector | ✅ | Native | Enabled via `showSizeChanger` prop with `pageSizeOptions` array |
| Total count display | ✅ | Native | Rendered via `showTotal` prop accepting function: `(total, range) => string` |
| Quick jumper | ✅ | Native | Enabled via `showQuickJumper` prop for direct page input |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop with values: `"default"` or `"small"` |
| Simplified mode | ✅ | Native | `simple` prop for compact UI with minimal controls |
| Button style | ✅ | Composed | Customizable via `itemRender` for custom prev/next button content |
| Disabled state | ✅ | Native | `disabled` prop to disable all pagination interactions |
| Custom rendering | ✅ | Composed | `itemRender` function for customizing page item innerHTML |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange callback | ✅ | Native | `onChange(page, pageSize)` fires on page change |
| Controlled mode | ✅ | Native | Use `current` and `pageSize` props with state management |
| Uncontrolled mode | ✅ | Native | Use `defaultCurrent` and `defaultPageSize` for initial values |
| Keyboard navigation | ✅ | Native | Built-in keyboard support in quick jumper input |

## Code Examples
```jsx
// Primary usage example - Basic pagination
import React from 'react';
import { Pagination } from 'antd';

const BasicPagination = () => {
  return <Pagination defaultCurrent={1} total={50} />;
};

export default BasicPagination;
```

```jsx
// Controlled pagination with size changer
import React, { useState } from 'react';
import { Pagination } from 'antd';

const ControlledPagination = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const onChange = (page, pageSize) => {
    console.log('Page:', page);
    setCurrent(page);
  };

  const onShowSizeChange = (current, size) => {
    console.log('Current:', current, 'Size:', size);
    setPageSize(size);
    setCurrent(current);
  };

  return (
    <Pagination
      current={current}
      total={500}
      pageSize={pageSize}
      onChange={onChange}
      onShowSizeChange={onShowSizeChange}
      showSizeChanger
      showQuickJumper
      showTotal={(total) => `Total ${total} items`}
      pageSizeOptions={['10', '20', '30', '50', '100']}
    />
  );
};

export default ControlledPagination;
```

```jsx
// Simple mode with total display
import React from 'react';
import { Pagination } from 'antd';

const SimplePagination = () => {
  return (
    <Pagination
      simple
      defaultCurrent={2}
      total={500}
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
    />
  );
};

export default SimplePagination;
```

```jsx
// Small size with disabled state
import React from 'react';
import { Pagination } from 'antd';

const SmallDisabledPagination = () => {
  return (
    <Pagination
      size="small"
      total={50}
      disabled
      showSizeChanger
      showQuickJumper
    />
  );
};

export default SmallDisabledPagination;
```

```jsx
// Custom item rendering
import React from 'react';
import { Pagination } from 'antd';

const CustomPagination = () => {
  const itemRender = (current, type, originalElement) => {
    if (type === 'prev') {
      return <a>Previous</a>;
    }
    if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  };

  return (
    <Pagination
      total={500}
      itemRender={itemRender}
      showSizeChanger
      showQuickJumper
    />
  );
};

export default CustomPagination;
```

```jsx
// Responsive pagination with hide on single page
import React from 'react';
import { Pagination } from 'antd';

const ResponsivePagination = () => {
  return (
    <Pagination
      defaultCurrent={1}
      defaultPageSize={10}
      total={100}
      hideOnSinglePage={true}
      responsive
      showSizeChanger
    />
  );
};

export default ResponsivePagination;
```

## Notable Features
- **Flexible control modes**: Supports both controlled (with `current`/`pageSize`) and uncontrolled (with `defaultCurrent`/`defaultPageSize`) patterns
- **Rich customization options**: `itemRender` prop allows complete customization of page items, prev/next buttons, and jump controls
- **Smart UI adaptation**: `simple` mode for mobile/compact layouts; `responsive` prop for automatic screen-size adaptation
- **Comprehensive callback system**: Separate callbacks for page changes (`onChange`) and page size changes (`onShowSizeChange`)
- **Locale support**: Built-in internationalization with customizable locale strings
- **Auto-hide feature**: `hideOnSinglePage` prop automatically hides pagination when dataset fits on one page
- **Accessible range display**: `showTotal` accepts a function with both total count and current range `[start, end]`
- **Flexible page size options**: `pageSizeOptions` accepts array of strings for custom page size choices
- **Integrated with Table component**: Seamlessly works with Ant Design Table component for data presentation

## Research Notes
- The official documentation at https://ant.design/components/pagination is comprehensive and includes interactive examples
- Ant Design Pagination is highly mature and widely adopted in enterprise applications
- The component follows enterprise UI patterns with extensive configuration options
- Version 5.x is the current major version with improved TypeScript support
- The component integrates well with other Ant Design components, particularly Table and List
- WebFetch had difficulty accessing the live documentation page due to heavy client-side rendering, but web search revealed comprehensive API details
- The component is part of Ant Design's enterprise-class UI system, designed for complex data-heavy applications
- Community resources (Medium articles, Stack Overflow, GeeksforGeeks) provide extensive practical examples and implementation patterns
