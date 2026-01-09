# Ant Design - Breadcrumb Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/breadcrumb
Status: ✅ Working
Version: 5.x (current), with examples from 4.x
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Ant Design provides excellent documentation with multiple code examples, complete API tables, React Router integration patterns, and version migration guidance.

## Component Definition
- **Core purpose**: Display the current location within a navigational hierarchy and provide links to navigate back to parent pages
- **Mental model**: A horizontal trail of links showing the path from root to current page, with separators between each level
- **Semantic meaning**: Communicates hierarchical context, current position in site structure, and provides wayfinding navigation

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `separator="/"`, `items={[...]}`)
- **Composed**: Via composition/children (e.g., `<Breadcrumb.Item>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text links | ✅ | Native | Direct text content in items, supports href prop for links |
| Icon support | ✅ | Composed | Icons can be included as ReactNode children within items |
| Dropdown menus | ✅ | Native | `menu` prop accepts MenuProps for dropdown navigation (v4.24.0+) |
| Custom separators | ✅ | Native | `separator` prop accepts string or ReactNode, plus `<Breadcrumb.Separator>` component |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple breadcrumb | ✅ | Native | Basic items array with title and optional href |
| With dropdown | ✅ | Native | Item-level `menu` prop for dropdown subnavigation |
| Icon breadcrumb | ✅ | Composed | Icons as ReactNode in item title or standalone items |
| Router-integrated | ✅ | Native | `itemRender` prop for custom Link components (React Router, Next.js) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Current page | ✅ | CSS-only | Last item typically rendered without href (non-clickable) |
| Disabled items | ❌ | - | No built-in disabled state for items |
| Clickable/non-clickable | ✅ | Native | Items with href are clickable, without href are static text |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Separator styles | ✅ | Native | String separators (">", "•", etc.) or custom ReactNode via separator prop |
| Size options | ❌ | CSS-only | No built-in size variants, uses default Ant Design typography size |
| Responsive behavior | ❌ | CSS-only | No built-in responsive collapse/overflow handling |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click navigation | ✅ | Native | href prop for standard navigation, onClick handler for custom behavior |
| Router integration | ✅ | Native | itemRender function for custom Link components (React Router, Next.js Link) |
| Programmatic nav | ✅ | Composed | Through itemRender with router.push() or navigate() calls |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| aria-label | ❌ | - | No documented ARIA label support |
| aria-current | ❌ | - | No automatic aria-current="page" on last item |
| Keyboard navigation | ✅ | Native | Standard link tab navigation inherited from <a> elements |

## Code Examples

### Basic Breadcrumb
```tsx
import { Breadcrumb } from 'antd';
import React from 'react';

const App: React.FC = () => (
  <Breadcrumb>
    <Breadcrumb.Item>Home</Breadcrumb.Item>
    <Breadcrumb.Item>
      <a href="">Application Center</a>
    </Breadcrumb.Item>
    <Breadcrumb.Item>
      <a href="">Application List</a>
    </Breadcrumb.Item>
    <Breadcrumb.Item>An Application</Breadcrumb.Item>
  </Breadcrumb>
);

export default App;
```

### Modern Items API (v5.3.0+)
```tsx
import { Breadcrumb } from 'antd';

const App: React.FC = () => (
  <Breadcrumb
    items={[
      { title: 'Home' },
      { title: 'Application Center', href: '' },
      { title: 'Application List', href: '' },
      { title: 'An Application' }
    ]}
  />
);

export default App;
```

### With Icons
```tsx
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import React from 'react';

const App: React.FC = () => (
  <Breadcrumb>
    <Breadcrumb.Item href="">
      <HomeOutlined />
    </Breadcrumb.Item>
    <Breadcrumb.Item href="">
      <UserOutlined />
      <span>Application List</span>
    </Breadcrumb.Item>
    <Breadcrumb.Item>Application</Breadcrumb.Item>
  </Breadcrumb>
);

export default App;
```

### Custom Separator
```tsx
import { Breadcrumb } from 'antd';
import React from 'react';

const App: React.FC = () => (
  <Breadcrumb separator=">">
    <Breadcrumb.Item>Home</Breadcrumb.Item>
    <Breadcrumb.Item href="">Application Center</Breadcrumb.Item>
    <Breadcrumb.Item href="">Application List</Breadcrumb.Item>
    <Breadcrumb.Item>An Application</Breadcrumb.Item>
  </Breadcrumb>
);

export default App;
```

### Custom Separator Component
```tsx
import { Breadcrumb } from 'antd';
import React from 'react';

const App: React.FC = () => (
  <Breadcrumb separator="">
    <Breadcrumb.Item>Location</Breadcrumb.Item>
    <Breadcrumb.Separator>:</Breadcrumb.Separator>
    <Breadcrumb.Item href="">Application Center</Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item href="">Application List</Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>An Application</Breadcrumb.Item>
  </Breadcrumb>
);

export default App;
```

### With Dropdown Menu
```tsx
import { Breadcrumb } from 'antd';
import React from 'react';

const items = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        General
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        Layout
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        Navigation
      </a>
    ),
  },
];

const App: React.FC = () => (
  <Breadcrumb>
    <Breadcrumb.Item>Ant Design</Breadcrumb.Item>
    <Breadcrumb.Item>
      <a href="">Component</a>
    </Breadcrumb.Item>
    <Breadcrumb.Item menu={{ items }}>
      <a href="">General</a>
    </Breadcrumb.Item>
    <Breadcrumb.Item>Button</Breadcrumb.Item>
  </Breadcrumb>
);

export default App;
```

### React Router v6 Integration
```tsx
import { Alert, Breadcrumb } from 'antd';
import React from 'react';
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom';

const Apps = () => (
  <ul className="app-list">
    <li>
      <Link to="/apps/1">Application1</Link>：<Link to="/apps/1/detail">Detail</Link>
    </li>
    <li>
      <Link to="/apps/2">Application2</Link>：<Link to="/apps/2/detail">Detail</Link>
    </li>
  </ul>
);

const breadcrumbNameMap: Record<string, string> = {
  '/apps': 'Application List',
  '/apps/1': 'Application1',
  '/apps/2': 'Application2',
  '/apps/1/detail': 'Detail',
  '/apps/2/detail': 'Detail',
};

const Home = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <div className="demo">
      <div className="demo-nav">
        <Link to="/">Home</Link>
        <Link to="/apps">Application List</Link>
      </div>
      <Routes>
        <Route path="/apps" element={<Apps />} />
        <Route path="*" element={<span>Home Page</span>} />
      </Routes>
      <Alert style={{ margin: '16px 0' }} message="Click the navigation above to switch:" />
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <Home />
  </HashRouter>
);

export default App;
```

## API Documentation

### Breadcrumb Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| itemRender | Custom item renderer | (route, params, routes, paths) => ReactNode | - | - |
| params | Routing parameters | object | - | - |
| items | Router stack information (recommended v5.3.0+) | ItemType[] | - | 5.3.0 |
| separator | Custom separator | ReactNode | `/` | - |

### RouteItemType (ItemType) Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| className | Additional CSS class | string | - | - |
| dropdownProps | Dropdown configuration | Dropdown | - | - |
| href | Hyperlink target (cannot work with path) | string | - | - |
| path | Connected routing path (cannot work with href) | string | - | - |
| menu | Menu configuration for dropdown | MenuProps | - | 4.24.0 |
| onClick | Click handler | (e:MouseEvent) => void | - | - |
| title | Item display name | ReactNode | - | - |

### SeparatorType

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| type | Separator marker | `separator` | - | 5.3.0 |
| separator | Custom separator | ReactNode | `/` | 5.3.0 |

### Breadcrumb.Item Props (Legacy, pre-v5.3.0)

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| className | CSS class name | string | - |
| dropdownProps | Dropdown props | Dropdown | - |
| href | Hyperlink target | string | - |
| overlay | Dropdown overlay (deprecated, use menu) | ReactNode | - |
| onClick | Click callback | (e:MouseEvent) => void | - |

### Breadcrumb.Separator Props

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| children | Custom separator content | ReactNode | `/` |

## Notable Features

### Version Evolution
- **v4.24.0**: Introduced `menu` prop for dropdown support with better performance
- **v5.3.0**: Introduced `items` array API as the recommended approach over children composition
- The component maintains backward compatibility with both APIs

### Router Integration Pattern
The `itemRender` function provides a powerful way to integrate with any routing library:
```tsx
itemRender={(route, params, routes, paths) => {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.title}</span>
  ) : (
    <Link to={paths.join('/')}>{route.title}</Link>
  );
}}
```

### Dropdown Menu Support
Items can have dropdown menus for nested navigation options, useful for showing multiple paths at a single breadcrumb level:
```tsx
<Breadcrumb.Item menu={{ items: menuItems }}>
  Component
</Breadcrumb.Item>
```

### Flexible Separator System
Supports both global separator configuration and per-item custom separators:
- Global: `<Breadcrumb separator=">">`
- Per-item: `<Breadcrumb.Separator>:</Breadcrumb.Separator>`

## Research Notes

### Strengths
- **Modern API Design**: The v5.3.0+ items array API is cleaner and more declarative than JSX composition
- **Router Flexibility**: itemRender provides universal router integration without framework lock-in
- **Dropdown Support**: Built-in menu prop for complex navigation hierarchies
- **Separator Customization**: Both global and per-item separator control

### Limitations
- **No Built-in Accessibility**: Missing aria-label, aria-current="page" on last item
- **No Responsive Handling**: No built-in solution for breadcrumb overflow on small screens
- **No Size Variants**: Relies on global Ant Design typography sizing
- **No Disabled State**: Cannot mark items as disabled (only clickable or non-clickable)

### Migration Considerations
- v5.3.0 introduced breaking changes favoring `items` array over `<Breadcrumb.Item>` children
- Warning issued for deprecated `Breadcrumb.Item` and `Breadcrumb.Separator` usage in v5.3.0+
- Legacy `breadcrumbName` prop deprecated in favor of `title`
- `overlay` prop deprecated in favor of `menu` prop for dropdowns

### Integration Patterns
- Works seamlessly with React Router through itemRender
- Compatible with Next.js Link component
- Can be dynamically generated from route configuration
- Supports both hash routing and browser history routing
