# Ant Design - Drawer Usage Patterns

> Last Modified: 2025-11-06

## Component URL
https://ant.design/components/drawer
Status: ✅ Working
Version: 5.x (Current - as of 2024/2025)
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - Excellent documentation with detailed API reference, multiple examples (15+ demos), version migration notes, and accessibility features well documented.

## Component Definition
- **Core purpose**: A sliding panel that overlays from the edge of the screen, providing a way to present information, forms, or actions without navigating away from the current context.
- **Mental model**: An overlay drawer that slides in from any screen edge (top, right, bottom, left), similar to a mobile app drawer or side panel. It maintains user context while displaying additional content or functionality.
- **Semantic meaning**: A temporary overlay panel for contextual content, forms, or actions. Communicates "here's additional information/functionality related to what you're doing, but it's not the main focus."

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Header/title | ✅ | Native | `title` prop accepts ReactNode for header content, automatically styled with close button area |
| Body content | ✅ | Composed | Content passed as `children` to the Drawer component |
| Footer/actions | ✅ | Native | `footer` prop for action buttons/footer content, `extra` prop for additional header actions |
| Close button | ✅ | Native | `closable` boolean prop (default: true), `closeIcon` prop for custom icon |
| Custom content | ✅ | Composed | Full ReactNode support in title, footer, extra, and body areas |

## Placement Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Left side | ✅ | Native | `placement="left"` - slides from left edge |
| Right side | ✅ | Native | `placement="right"` (default) - slides from right edge |
| Top | ✅ | Native | `placement="top"` - slides from top edge |
| Bottom | ✅ | Native | `placement="bottom"` - slides from bottom edge |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Open/visible | ✅ | Native | `open` boolean prop (v4.23.0+, replaces `visible`) controls visibility |
| Closed/hidden | ✅ | Native | `open={false}` hides drawer, `onClose` callback for state management |
| Loading | ✅ | Native | `loading` boolean prop (v5.17.0+) shows skeleton loader; v5.18.0+ uses Skeleton instead of Spin |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop with 'default' (378px) and 'large' (736px) presets; `width` and `height` props for custom dimensions |
| Push vs overlay | ✅ | Native | `push` prop enables nested drawer behavior with configurable distance/displacement |
| Modal/backdrop | ✅ | Native | `mask` boolean (default: true) for backdrop; `maskStyle` for custom styling; `maskClosable` for click-to-close |
| Nested drawers | ✅ | Native | Full support for multi-level drawers with `push` behavior configuration |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click outside to close | ✅ | Native | `maskClosable` boolean prop (default: true) enables close on backdrop click |
| ESC to close | ✅ | Native | `keyboard` boolean prop (default: true) enables ESC key to close |
| onOpen/onClose callbacks | ✅ | Native | `onClose` function(e) triggered by mask click, close button, or ESC; `afterOpenChange` function(open) fires after animation completes |
| Focus management | ✅ | Native | `autoFocus` boolean (default: true) automatically focuses drawer after opening |

## Code Examples

### Basic Usage Example
```jsx
import { Drawer, Button } from 'antd';
import { useState } from 'react';

const App = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Open Drawer
      </Button>
      <Drawer
        title="Basic Drawer"
        onClose={onClose}
        open={open}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};
```

### Custom Placement Example
```jsx
import { Drawer, Button, Radio } from 'antd';
import { useState } from 'react';

const App = () => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (e) => {
    setPlacement(e.target.value);
  };

  return (
    <>
      <Radio.Group value={placement} onChange={onChange}>
        <Radio value="top">top</Radio>
        <Radio value="right">right</Radio>
        <Radio value="bottom">bottom</Radio>
        <Radio value="left">left</Radio>
      </Radio.Group>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer
        title="Drawer with Custom Placement"
        placement={placement}
        onClose={onClose}
        open={open}
      >
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};
```

### Drawer with Footer Example
```jsx
import { Drawer, Button, Space } from 'antd';
import { useState } from 'react';

const App = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer
        title="Drawer with Actions"
        placement="right"
        onClose={onClose}
        open={open}
        footer={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              Submit
            </Button>
          </Space>
        }
      >
        <p>Some form content...</p>
      </Drawer>
    </>
  );
};
```

## Notable Features

### Advanced API Props
- **destroyOnClose**: Boolean to unmount drawer content when closed (improves performance for heavy content)
- **forceRender**: Pre-renders the drawer component even when closed (useful for SEO or initial state requirements)
- **getContainer**: Specifies target DOM node for rendering (defaults to document.body; use `false` for relative positioning within parent)
- **zIndex**: Controls stacking order (default: 1000) for managing multiple overlays
- **drawerRender**: Custom function to render the drawer panel itself (advanced customization)

### Styling System (v5+)
Ant Design v5 introduced a sophisticated styling architecture:
- **Root-level**: `rootClassName` and `rootStyle` for container styling
- **Panel-level**: `className` and `style` moved to drawer panel (breaking change from v4)
- **Semantic structure**: Separate props for `bodyStyle`, `headerStyle`, `footerStyle`, `drawerStyle`, `maskStyle`, `contentWrapperStyle`
- **Component tokens**: Customizable design tokens via `classNames` and `styles` props for semantic DOM structure

### Accessibility Features
- Automatic focus management with `autoFocus` (default: true)
- Keyboard support with ESC to close (configurable via `keyboard` prop)
- Proper ARIA attributes and roles for screen readers
- Focus trap within drawer when open

### Multi-level Drawers
Full support for nested drawers with intelligent push behavior:
- Parent drawer can be "pushed" to the side when child drawer opens
- Configurable push distance
- Maintains proper z-index stacking
- Smooth animations between levels

### Loading States
Version evolution:
- **v5.17.0**: Introduced `loading` prop with Spin component support
- **v5.18.0**: Replaced Spin with Skeleton, restricted `loading` to boolean only
- Provides built-in skeleton loader without custom implementation

### Size Presets
Two built-in size options for rapid development:
- **default**: 378px (width for left/right, height for top/bottom)
- **large**: 736px
- Custom sizing via `width` and `height` props accepts string or number values

## Research Notes

### Documentation Access
- Main documentation at https://ant.design/components/drawer is comprehensive and well-maintained
- GitHub repository contains raw markdown documentation at https://github.com/ant-design/ant-design/blob/master/components/drawer/index.en-US.md
- Version 4.x documentation available at https://4x-ant-design.antgroup.com/components/drawer for migration reference

### Framework Evolution
- **v4 to v5 Migration**: Significant styling prop restructure (`className`/`style` moved to panel level, new `rootClassName`/`rootStyle` for container)
- **v4.23.0**: `visible` prop renamed to `open` for better semantic meaning
- **v5.17.0-5.18.0**: Loading implementation changed from Spin to Skeleton

### Implementation Observations
- Built on React principles with strong TypeScript support
- Leverages ReactNode for maximum flexibility in content rendering
- Uses render props pattern for advanced customization (`drawerRender`)
- Animation system appears to use CSS transitions (details in `afterOpenChange` callback timing)
- Proper cleanup and unmounting with `destroyOnClose` prevents memory leaks

### Unique Strengths
1. **Exceptional placement flexibility**: All four edges supported natively
2. **Rich content structure**: Native support for header, body, footer, and extra action areas
3. **Nested drawer system**: Built-in support with push behavior (uncommon in other frameworks)
4. **Comprehensive styling control**: Multiple layers of styling props for precise customization
5. **Loading state**: Built-in skeleton loader (v5.18.0+) without custom implementation required
6. **Size presets**: Common sizes pre-configured while allowing full customization
7. **Accessibility first**: Auto-focus, keyboard navigation, ARIA support built-in
8. **Performance options**: `destroyOnClose`, `forceRender` for optimization strategies
