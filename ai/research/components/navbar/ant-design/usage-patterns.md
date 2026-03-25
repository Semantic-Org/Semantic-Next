# Ant Design - Navbar / App Bar Usage Patterns

## Component URL
https://ant.design/components/layout/
Status: ✅ Working
Version: Current (v4.x as of documentation accessed)
Last Verified: 2025-11-10

## Documentation Quality
Good - Comprehensive examples with code snippets, though API documentation is minimal as Header is a layout container without specific props.

## Component Definition
- **Core purpose**: Provides a top-level layout container for application headers/navigation bars. The Header component is designed to contain navigation elements, branding, and user actions as part of the overall Layout system.
- **Mental model**: Header is a semantic layout wrapper that establishes the top region of the page structure. Users compose navigation elements (Menu, logo, actions) within it rather than configuring header-specific props.
- **Semantic meaning**: Represents the primary navigation and branding area of the application, establishing visual hierarchy and providing consistent positioning for top-level UI elements.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `text="Hello"`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Logo/Brand | ✅ | Composed | Composed as child element, commonly styled with `.logo` class and floated left |
| Navigation links | ✅ | Composed | Via nested `<Menu mode="horizontal">` component with item configuration |
| Actions/Buttons | ✅ | Composed | Any child elements can be added (buttons, icons, etc.) |
| Search | ✅ | Composed | Via nested Input.Search or AutoComplete components |
| User menu | ✅ | Composed | Via nested Menu with user-related items or Dropdown component |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fixed position | ✅ | CSS-only | `style={{ position: 'fixed', top: 0, zIndex: 1, width: '100%' }}` |
| Sticky position | ✅ | CSS-only | `style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}` - shown in official examples |
| Responsive collapse | ✅ | Composed | Via Menu component's responsive behavior and custom collapse logic |
| Multi-row layout | ✅ | Composed | Via nested Row/Col components or custom flex/grid layouts |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active/Selected | ✅ | Composed | Via Menu's `selectedKeys` and `defaultSelectedKeys` props |
| Scroll behavior | ✅ | CSS-only | Controlled via sticky/fixed positioning styles |
| Collapsible | ✅ | Composed | Via custom trigger logic (e.g., MenuUnfoldOutlined/MenuFoldOutlined icons) to toggle sidebar, affecting header state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Height options | ✅ | CSS-only | Default height is 64px, customizable via `style={{ height: 'value' }}` |
| Color themes | ✅ | Composed | Menu supports `theme="dark"` or `theme="light"`, Header background via CSS/style prop |
| Alignment | ✅ | CSS-only | Content alignment via flexbox/CSS (logo float left, menu items horizontal) |
| Spacing control | ✅ | CSS-only | Padding controlled via `style={{ padding: '0 50px' }}` or CSS classes |

## Code Examples

### Basic Header with Horizontal Menu
```typescript
import { Breadcrumb, Layout, Menu } from 'antd';
import React from 'react';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => (
  <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={new Array(15).fill(null).map((_, index) => {
          const key = index + 1;
          return {
            key,
            label: `nav ${key}`,
          };
        })}
      />
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-content">Content</div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      Ant Design ©2018 Created by Ant UED
    </Footer>
  </Layout>
);

export default App;
```

### Sticky Header (Fixed on Scroll)
```typescript
const App: React.FC = () => (
  <Layout>
    <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={new Array(3).fill(null).map((_, index) => ({
          key: String(index + 1),
          label: `nav ${index + 1}`,
        }))}
      />
    </Header>
    <Content className="site-layout" style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
        Content
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      Ant Design ©2018 Created by Ant UED
    </Footer>
  </Layout>
);
```

### Header with Sidebar Toggle
```typescript
<Header className="site-layout-background" style={{ padding: 0 }}>
  {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
    className: 'trigger',
    onClick: () => setCollapsed(!collapsed),
  })}
</Header>
```

### Typical Logo Styling
```css
#components-layout-demo-top .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}
```

[View Live Examples](https://ant.design/components/layout/)

## Notable Features
- **Composition-first approach**: Header is a simple layout container with no dedicated props beyond className/style, encouraging flexible composition
- **Tight Menu integration**: Menu component provides horizontal mode specifically designed for header navigation
- **Layout system integration**: Works seamlessly with Layout, Sider, Content, Footer for complete page layouts
- **Theme support**: Menu component supports dark/light themes that integrate naturally with Header
- **Responsive patterns**: Pairs with responsive sidebars and collapsible menus for mobile-friendly navigation
- **Standard sizing**: Default 64px height follows common UI conventions
- **Flexible positioning**: Easy to make fixed or sticky via inline styles
- **No JavaScript bloat**: Header itself has no behavior - pure layout semantics

## API Reference
The Header component is minimal by design:

**Props:**
- `className`: string - Container CSS class
- `style`: CSSProperties - Inline styles
- `children`: ReactNode - Composed content (logo, menu, actions, etc.)

All other functionality comes from composed components (Menu, Button, Input, etc.).

## Research Notes
- Documentation is spread across Layout component page - no dedicated Header API section
- Examples are comprehensive and production-ready
- Framework philosophy emphasizes composition over configuration for layout components
- The sticky header example demonstrates current best practice (position: sticky instead of fixed)
- Color scheme values found: default background `#7dbcea` (light), dark theme `#6aa0c7`
- Horizontal spacing follows formula: `48 + 8n` pixels
- Common pattern: logo floated left, menu taking remaining space, actions floated right
- No accessibility-specific props documented, relies on semantic HTML and composed component accessibility
