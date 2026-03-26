# Ant Design - Popover Usage Patterns

> Last Modified: 2025-11-06

## Component URL
https://ant.design/components/popover
Status: ✅ Working
Version: 5.x (Latest)
Last Verified: 2025-11-06

## Documentation Quality
**Assessment**: Excellent. Ant Design provides comprehensive documentation with multiple interactive examples, clear API tables, and detailed explanations. The documentation includes TypeScript definitions, accessibility notes, and practical use cases. Examples demonstrate basic to advanced patterns including nested popovers, controlled visibility, and combined triggers.

## Component Definition
- **Core purpose**: A floating card that pops up when clicking or hovering over an element, providing contextual information and optional action elements like links and buttons. More feature-rich than Tooltip with support for complex content including titles, formatted text, and interactive elements.
- **Mental model**: An enhanced tooltip that can contain rich interactive content. Think of it as a "lightweight modal" that appears near its trigger element rather than centered on screen.
- **Semantic meaning**: Communicates supplementary information or actions related to a specific UI element without leaving the current context or navigating away from the page.

## Trigger Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click trigger | ✅ | Native | `trigger="click"` - Opens on click, closes on outside click or explicit action |
| Hover trigger | ✅ | Native | `trigger="hover"` (default) - Opens on mouse enter, closes on mouse leave |
| Focus trigger | ✅ | Native | `trigger="focus"` - Opens when element receives focus, closes on blur |
| Manual/Controlled | ✅ | Native | `open` prop + `onOpenChange` callback for full programmatic control |
| Multiple triggers | ✅ | Native | `trigger={["hover", "click"]}` - Array syntax for combining triggers |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Title | ✅ | Native | `title` prop accepts string or ReactNode for heading content |
| Rich content | ✅ | Native | `content` prop accepts ReactNode for any JSX including formatted text, images, lists |
| Actions/buttons | ✅ | Composed | Actions implemented via content prop with Button components and click handlers |
| Custom rendering | ✅ | Native | Full JSX composition support in both title and content props |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Placement options | ✅ | Native | 12 placements: top, topLeft, topRight, bottom, bottomLeft, bottomRight, left, leftTop, leftBottom, right, rightTop, rightBottom |
| Auto positioning | ✅ | Native | `autoAdjustOverflow={true}` (default) - Automatically flips position when near screen edges |
| Offset control | ✅ | Native | `align` prop for custom offset configuration using rc-tooltip positioning system |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Close on outside click | ✅ | Native | Automatic when `trigger="click"` - clicks outside close the popover |
| Close on escape | ✅ | Native | ESC key closes popover when open (inherits from rc-tooltip) |
| Nested popovers | ✅ | Composed | Multiple Popover components can be nested for complex interactions |
| Arrow/pointer | ✅ | Native | Arrow displayed by default, can be hidden with `arrow={false}` prop |

## Code Examples

### Basic Popover with Title and Content
```jsx
import { Popover, Button } from 'antd';

const content = (
  <div>
    <p>Content paragraph 1</p>
    <p>Content paragraph 2</p>
  </div>
);

const App = () => (
  <Popover content={content} title="Popover Title">
    <Button type="primary">Hover me</Button>
  </Popover>
);
```

### Different Trigger Types
```jsx
import { Popover, Button } from 'antd';

const content = <div><p>Popover content</p></div>;

const App = () => (
  <div>
    <Popover content={content} title="Hover" trigger="hover">
      <Button>Hover me</Button>
    </Popover>

    <Popover content={content} title="Click" trigger="click">
      <Button>Click me</Button>
    </Popover>

    <Popover content={content} title="Focus" trigger="focus">
      <Button>Focus me</Button>
    </Popover>
  </div>
);
```

### Controlled Popover with Close Button
```jsx
import { Button, Popover } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const content = (
    <div>
      <p>Popover content with action</p>
      <Button onClick={hide} type="link">Close</Button>
    </div>
  );

  return (
    <Popover
      content={content}
      title="Controlled Popover"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button type="primary">Click me</Button>
    </Popover>
  );
};
```

### Placement Options
```jsx
import { Popover, Button } from 'antd';

const content = <div>Popover content</div>;

const App = () => (
  <div>
    <Popover content={content} title="Top Left" placement="topLeft">
      <Button>TL</Button>
    </Popover>

    <Popover content={content} title="Top" placement="top">
      <Button>Top</Button>
    </Popover>

    <Popover content={content} title="Top Right" placement="topRight">
      <Button>TR</Button>
    </Popover>

    <Popover content={content} title="Left" placement="left">
      <Button>Left</Button>
    </Popover>

    <Popover content={content} title="Right" placement="right">
      <Button>Right</Button>
    </Popover>

    <Popover content={content} title="Bottom" placement="bottom">
      <Button>Bottom</Button>
    </Popover>
  </div>
);
```

### Nested Popovers (Hover + Click)
```jsx
import { Button, Popover } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hide = () => {
    setClicked(false);
    setHovered(false);
  };

  const handleHoverChange = (open) => {
    setHovered(open);
    setClicked(false);
  };

  const handleClickChange = (open) => {
    setHovered(false);
    setClicked(open);
  };

  const hoverContent = <div>This is hover content.</div>;
  const clickContent = (
    <div>
      <div>This is click content.</div>
      <a onClick={hide}>Close</a>
    </div>
  );

  return (
    <Popover
      content={hoverContent}
      title="Hover title"
      trigger="hover"
      open={hovered}
      onOpenChange={handleHoverChange}
    >
      <Popover
        content={clickContent}
        title="Click title"
        trigger="click"
        open={clicked}
        onOpenChange={handleClickChange}
      >
        <Button>Hover and click / Click me</Button>
      </Popover>
    </Popover>
  );
};
```

## Complete API Reference

### Core Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | ReactNode \| () => ReactNode | - | Content of the card |
| `title` | ReactNode \| () => ReactNode | - | Title of the card |
| `trigger` | hover \| focus \| click \| contextMenu \| Array<string> | hover | Trigger mode which can be multiple |
| `open` | boolean | false | Whether the popover is visible (controlled) |
| `defaultOpen` | boolean | false | Whether the popover is visible by default |
| `onOpenChange` | (open: boolean) => void | - | Callback when visibility changes |

### Positioning Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placement` | string | top | Position: top, left, right, bottom, topLeft, topRight, bottomLeft, bottomRight, leftTop, leftBottom, rightTop, rightBottom |
| `align` | object | - | Align config of rc-tooltip, includes points, offset, targetOffset |
| `autoAdjustOverflow` | boolean | true | Auto adjust position when popover is close to screen edge |

### Styling Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `arrow` | boolean \| { pointAtCenter: boolean } | true | Show/hide arrow and configure arrow behavior |
| `overlayClassName` | string | - | Class name for the popover card |
| `overlayStyle` | CSSProperties | - | Style for the popover card |
| `overlayInnerStyle` | CSSProperties | - | Style for the popover inner content |

### Behavior Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mouseEnterDelay` | number | 0.1 | Delay in seconds before showing on mouse enter |
| `mouseLeaveDelay` | number | 0.1 | Delay in seconds before hiding on mouse leave |
| `destroyTooltipOnHide` | boolean | false | Whether destroy tooltip when hidden |
| `getPopupContainer` | (triggerNode) => HTMLElement | () => document.body | Parent node which the selector should be rendered to |
| `zIndex` | number | - | Z-index of the popover |
| `fresh` | boolean | false | Tooltip will cache content when closed by default. Set this to true to force render content on every open |

## Notable Features

### 1. **Shared API with Tooltip**
Popover extends Tooltip and shares most of its API. The key difference is that Popover supports more complex content including titles and rich JSX, while Tooltip is optimized for simple text hints.

### 2. **Child Component Requirements**
The child component must accept mouse and focus events (`onMouseEnter`, `onMouseLeave`, `onPointerEnter`, `onPointerLeave`, `onFocus`, `onClick`). This means wrapping text nodes requires a span or other element wrapper.

### 3. **Smart Edge Detection**
With `autoAdjustOverflow={true}` (default), the popover intelligently:
- Flips to the opposite side when space is insufficient (e.g., top → bottom)
- Adjusts alignment when at screen edges (e.g., topLeft → bottomLeft)
- Maintains arrow position to point at the trigger element

### 4. **Performance Optimization**
The `destroyTooltipOnHide` prop can be used to completely unmount content when hidden, useful for popovers with expensive rendering or side effects. Default behavior caches content for faster reopening.

### 5. **Portal Rendering**
By default, popovers render into document.body via React Portal to escape z-index stacking contexts. The `getPopupContainer` prop allows custom container selection for specific layout requirements.

### 6. **Programmatic Control**
Full controlled component support with `open` and `onOpenChange` enables complex interaction patterns:
- Multi-step wizards in popovers
- Conditional visibility based on application state
- Coordinated animations with other UI elements

### 7. **Known Issue**
There's a documented interaction between `destroyTooltipOnHide={true}` and `getPopupContainer` where the container function is only called on first render. This is tracked in the Ant Design issue tracker.

## Research Notes

### Architecture Insights
1. **Built on rc-tooltip**: Ant Design Popover is built on top of the `rc-tooltip` library, which provides the positioning, trigger, and animation primitives. This explains the shared API surface with Tooltip and Popconfirm components.

2. **React-centric Design**: The API is deeply integrated with React patterns (ReactNode, hooks, controlled components), making it less portable to other frameworks compared to web component alternatives.

3. **CSS-in-JS Foundation**: Styling relies on Ant Design's design token system and CSS-in-JS approach, requiring the full Ant Design theme context.

### Comparison Patterns
- **vs Tooltip**: Popover supports complex content (title, JSX) and actions, while Tooltip is optimized for simple text
- **vs Modal**: Popover is contextually positioned near trigger elements and lighter-weight, while Modal is centered and demands full attention
- **vs Dropdown**: Popover supports any content type, while Dropdown is specialized for menu/list structures

### Implementation Considerations
For Semantic UI implementation:
1. The 12-placement system is comprehensive and should be considered standard
2. Auto-adjustment on screen edges is essential for good UX
3. Support for both simple (text) and complex (JSX) content is valuable
4. Controlled + uncontrolled modes serve different use cases
5. Multiple trigger types (click, hover, focus) should be first-class features
6. Arrow pointing at trigger provides important visual connection

### Potential Improvements Over Ant Design
1. **Framework Agnostic**: Web component approach vs React-only
2. **Lighter Weight**: No need for full design system context
3. **Simpler API**: Could simplify some prop names (open vs visible confusion in migration)
4. **Native Events**: Standard CustomEvents vs React synthetic events
5. **Better Nested Handling**: The nested popover pattern in Ant Design is complex; could be simplified
