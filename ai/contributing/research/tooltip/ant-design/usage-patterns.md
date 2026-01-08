# Ant Design - Tooltip Usage Patterns

> Last Modified: 2025-11-06

## Component URL
https://ant.design/components/tooltip
Status: ✅ Working
Version: 5.x (Current version, also available at 4x.ant.design, 3x.ant.design, 2x.ant.design)
Last Verified: 2025-11-06

## Documentation Quality
Excellent - Comprehensive API documentation with multiple interactive demos and detailed prop descriptions. Documentation includes basic to advanced examples with TypeScript support. The component has a shared API with Popover and Popconfirm components.

## Component Definition
- **Core purpose**: Displays a simple text popup that appears when users hover over, focus on, or tap an element. Provides helpful information or context without cluttering the interface.
- **Mental model**: A lightweight, non-intrusive information layer that appears temporarily near its trigger element. Think of it as a "quick hint" or "helper text" that explains an element without requiring interaction. Unlike Popover, Tooltip is purely informational and typically doesn't contain interactive elements.
- **Semantic meaning**: "Here's some helpful information about this." It communicates supplementary, explanatory content that enhances understanding but isn't critical to core functionality. The user doesn't need to interact with the tooltip itself.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling
- **N/A**: Not supported or not applicable

## Trigger Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Hover trigger | ✅ | Native | `trigger="hover"` - Default behavior, shows tooltip on mouse enter |
| Click trigger | ✅ | Native | `trigger="click"` - Opens tooltip on click event |
| Focus trigger | ✅ | Native | `trigger="focus"` - Opens tooltip when element receives focus |
| Context menu | ✅ | Native | `trigger="contextMenu"` - Opens tooltip on right-click (Version 4.0+) |
| Multiple triggers | ✅ | Native | `trigger={['hover', 'click']}` - Accepts array of trigger types |
| Manual control | ✅ | Native | `open` prop with `onOpenChange` callback for fully controlled state |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `title` prop accepts string for simple text content |
| Rich content | ✅ | Native | `title` prop accepts `ReactNode` for formatted text, spans, divs |
| Dynamic content | ✅ | Native | `title` prop accepts render function `() => ReactNode` for dynamic content |
| Icon support | ✅ | Composed | Icons can be included in title as React components |
| Empty/null title | ✅ | Native | Setting `title={null}` or `title=""` disables the tooltip |
| Custom content | ✅ | Native | Full JSX/React component support through ReactNode |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Placement options | ✅ | Native | 12 placement options: `top`, `topLeft`, `topRight`, `bottom`, `bottomLeft`, `bottomRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, `rightBottom` |
| Auto positioning | ✅ | Native | `autoAdjustOverflow` prop (defaults to `true`) flips placement when tooltip would be clipped (e.g., top to bottom, topLeft to bottomLeft) |
| Offset control | ✅ | Native | `align` prop merges into rc-tooltip placement config for fine-grained positioning |
| Arrow/pointer | ✅ | Native | Arrow displayed by default, can be centered on target with `arrowPointAtCenter={true}` |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Background color | ✅ | Native | `color` prop accepts preset colors ('pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime') or hex values ('#f50', '#2db7f5') |
| Custom overlay class | ✅ | Native | `overlayClassName` prop adds CSS class to tooltip card |
| Custom overlay style | ✅ | Native | `overlayStyle` prop accepts CSSProperties object for tooltip card styling |
| Inner content style | ✅ | Native | `overlayInnerStyle` prop accepts CSSProperties object for inner content styling (Version 4.0+) |
| Custom container | ✅ | Native | `getPopupContainer` function specifies DOM container for tooltip, useful for scoped styling |
| Global styling | ⚠️ | CSS-only | Target `.ant-tooltip-inner` for background/text, `.ant-tooltip-arrow::before` for arrow color |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Open/close animation | ✅ | Native | Built-in transitions for show/hide, inherits Ant Design motion system |
| Mouse enter delay | ✅ | Native | `mouseEnterDelay` prop (default `0.1` seconds) delays tooltip appearance on hover |
| Mouse leave delay | ✅ | Native | `mouseLeaveDelay` prop (default `0.1` seconds) delays tooltip disappearance |
| Click outside close | ✅ | Native | Automatically closes when clicking outside (for click and focus triggers) |
| Escape key close | ✅ | Native | Closes on ESC key press (standard overlay behavior) |
| Destroy on hide | ✅ | Native | `destroyTooltipOnHide` prop removes tooltip DOM when hidden, accepts boolean or `{ keepParent?: boolean }` |
| Z-index control | ✅ | Native | `zIndex` prop sets CSS z-index value for tooltip overlay |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled state | ✅ | Native | `open` prop (boolean) with `onOpenChange` callback for full control over visibility |
| Uncontrolled state | ✅ | Native | `defaultOpen` prop (default `false`) for initial state without continuous control |
| Visibility callbacks | ✅ | Native | `onOpenChange(open: boolean) => void` fires when visibility changes |
| Disabled state | ✅ | Native | Set `title={null}` or `title=""` to disable tooltip |
| Event forwarding | ✅ | Native | Child element must accept `onMouseEnter`, `onMouseLeave`, `onFocus`, `onClick` events |

## Code Examples

### Basic Usage (Uncontrolled)
```jsx
import React from 'react';
import { Tooltip, Button } from 'antd';

export default function App() {
  return (
    <div>
      <Tooltip title="Helpful tooltip text">
        <Button>Hover me to see tooltip!</Button>
      </Tooltip>

      <Tooltip placement="bottom" title="Bottom tooltip">
        <span>Hover over me</span>
      </Tooltip>
    </div>
  );
}
```

### All Placement Options
```jsx
import { Tooltip, Button } from 'antd';

const placements = [
  'topLeft', 'top', 'topRight',
  'leftTop', 'left', 'leftBottom',
  'rightTop', 'right', 'rightBottom',
  'bottomLeft', 'bottom', 'bottomRight'
];

export default function PlacementDemo() {
  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      {placements.map(placement => (
        <Tooltip
          key={placement}
          title="Tooltip text"
          placement={placement}
        >
          <Button>{placement}</Button>
        </Tooltip>
      ))}
    </div>
  );
}
```

### Multiple Trigger Types
```jsx
import { Tooltip, Button } from 'antd';

<div style={{ display: 'flex', gap: '8px' }}>
  <Tooltip title="Hover trigger" trigger="hover">
    <Button>Hover me</Button>
  </Tooltip>

  <Tooltip title="Click trigger" trigger="click">
    <Button>Click me</Button>
  </Tooltip>

  <Tooltip title="Focus trigger" trigger="focus">
    <Button>Focus me</Button>
  </Tooltip>

  <Tooltip title="Context menu" trigger="contextMenu">
    <Button>Right-click me</Button>
  </Tooltip>

  <Tooltip title="Multiple triggers" trigger={['hover', 'click']}>
    <Button>Hover or click me</Button>
  </Tooltip>
</div>
```

### Controlled State with Callbacks
```jsx
import React, { useState } from 'react';
import { Tooltip, Button } from 'antd';

function ControlledTooltip() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  const handleOpenChange = (visible) => {
    setOpen(visible);
    if (visible) {
      setCount(prev => prev + 1);
    }
  };

  return (
    <div>
      <p>Tooltip opened {count} times</p>
      <Tooltip
        title="Controlled tooltip content"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button>Controlled Tooltip</Button>
      </Tooltip>
      <Button onClick={() => setOpen(!open)} style={{ marginLeft: 8 }}>
        Toggle Programmatically
      </Button>
    </div>
  );
}
```

### Custom Colors
```jsx
import { Tooltip, Button } from 'antd';

const presetColors = ['pink', 'red', 'yellow', 'orange', 'cyan', 'green',
                      'blue', 'purple', 'geekblue', 'magenta', 'volcano',
                      'gold', 'lime'];

<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
  {presetColors.map(color => (
    <Tooltip key={color} title={color} color={color}>
      <Button>{color}</Button>
    </Tooltip>
  ))}

  <Tooltip title="Custom hex color" color="#f50">
    <Button>#f50</Button>
  </Tooltip>

  <Tooltip title="Custom hex color" color="#2db7f5">
    <Button>#2db7f5</Button>
  </Tooltip>

  <Tooltip title="Custom hex color" color="#87d068">
    <Button>#87d068</Button>
  </Tooltip>
</div>
```

### Arrow Centered on Element
```jsx
import { Tooltip, Button } from 'antd';

<Tooltip
  title="Arrow points to center"
  placement="topLeft"
  arrowPointAtCenter
>
  <Button style={{ width: 200 }}>Wide Button - Centered Arrow</Button>
</Tooltip>
```

### Custom Styling with overlayClassName
```jsx
import { Tooltip, Button } from 'antd';
import './tooltip-styles.css';

// In tooltip-styles.css:
// .custom-tooltip .ant-tooltip-inner {
//   background-color: #722ed1;
//   color: #fff;
//   font-size: 16px;
//   padding: 12px 16px;
// }
// .custom-tooltip .ant-tooltip-arrow::before {
//   background-color: #722ed1;
// }

<Tooltip
  title="Custom styled tooltip"
  overlayClassName="custom-tooltip"
>
  <Button>Custom Style</Button>
</Tooltip>
```

### Custom Styling with Scoped Container
```jsx
import { Tooltip, Button } from 'antd';
import styled from 'styled-components';

const StyledContainer = styled.div`
  .ant-tooltip-inner {
    background-color: green;
    color: yellow;
    width: 200px;
    font-size: 14px;
  }

  .ant-tooltip-arrow::before {
    background-color: green;
  }
`;

function ScopedStyledTooltip() {
  return (
    <StyledContainer>
      <Tooltip
        title="Scoped styled tooltip"
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
      >
        <Button>Scoped Style</Button>
      </Tooltip>
    </StyledContainer>
  );
}
```

### Dynamic Content with Render Function
```jsx
import { Tooltip, Button } from 'antd';

<Tooltip
  title={() => (
    <div>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      <p>Random: {Math.random().toFixed(2)}</p>
    </div>
  )}
  trigger="click"
>
  <Button>Dynamic Content (Click me)</Button>
</Tooltip>
```

### Custom Delays
```jsx
import { Tooltip, Button } from 'antd';

<div style={{ display: 'flex', gap: '8px' }}>
  <Tooltip
    title="Fast appearance (0s delay)"
    mouseEnterDelay={0}
  >
    <Button>Instant</Button>
  </Tooltip>

  <Tooltip
    title="Default delay (0.1s)"
  >
    <Button>Default</Button>
  </Tooltip>

  <Tooltip
    title="Slow appearance (1s delay)"
    mouseEnterDelay={1}
  >
    <Button>Slow (1s)</Button>
  </Tooltip>

  <Tooltip
    title="Persistent (stays open 2s)"
    mouseLeaveDelay={2}
  >
    <Button>Persistent</Button>
  </Tooltip>
</div>
```

### Disabled Tooltip
```jsx
import { Tooltip, Button } from 'antd';

<div style={{ display: 'flex', gap: '8px' }}>
  <Tooltip title="This shows">
    <Button>Enabled Tooltip</Button>
  </Tooltip>

  <Tooltip title="">
    <Button>Disabled (empty string)</Button>
  </Tooltip>

  <Tooltip title={null}>
    <Button>Disabled (null)</Button>
  </Tooltip>
</div>
```

### With Auto Overflow Adjustment
```jsx
import { Tooltip, Button } from 'antd';

<div style={{ padding: '10px', height: '200px', overflow: 'auto' }}>
  <div style={{ padding: '100px 0' }}>
    <Tooltip
      title="Auto adjusts position when near viewport edge"
      placement="top"
      autoAdjustOverflow={true}
    >
      <Button>Scroll to edge and hover</Button>
    </Tooltip>
  </div>
</div>
```

### Destroy on Hide (Performance)
```jsx
import { Tooltip, Button } from 'antd';

<Tooltip
  title={
    <div>
      {/* Expensive component that should be cleaned up */}
      <ExpensiveComponent />
    </div>
  }
  destroyTooltipOnHide={true}
>
  <Button>Tooltip destroyed when hidden</Button>
</Tooltip>
```

## Complete API Reference

Based on TypeScript interface definitions and documentation from version 4.x and 5.x:

### Tooltip-Specific Props

| Property | Type | Default | Description | Version |
|----------|------|---------|-------------|---------|
| `title` | `ReactNode \| () => ReactNode` | - | The text or content shown in the tooltip | - |

### Common Props (Shared with Popover, Popconfirm)

| Property | Type | Default | Description | Version |
|----------|------|---------|-------------|---------|
| `align` | `object` | - | Merges values into rc-tooltip placement configuration for fine-grained control | - |
| `arrowPointAtCenter` | `boolean` | `false` | Whether the arrow points to the center of the target element | - |
| `autoAdjustOverflow` | `boolean` | `true` | Automatically adjusts popup placement when it would be clipped by viewport | - |
| `color` | `string` | - | Background color of tooltip (preset color name or hex value) | 4.3.0 |
| `defaultOpen` | `boolean` | `false` | Whether tooltip is visible by default (uncontrolled mode) | 4.23.0 |
| `destroyTooltipOnHide` | `boolean \| { keepParent?: boolean }` | `false` | Whether to destroy tooltip DOM when hidden (useful for performance) | - |
| `getPopupContainer` | `(triggerNode: HTMLElement) => HTMLElement` | `() => document.body` | Parent DOM node where tooltip will be rendered | - |
| `mouseEnterDelay` | `number` | `0.1` | Delay in seconds before tooltip shows on mouse enter | - |
| `mouseLeaveDelay` | `number` | `0.1` | Delay in seconds before tooltip hides on mouse leave | - |
| `open` | `boolean` | `false` | Whether tooltip is visible (controlled mode, replaces deprecated `visible`) | 4.23.0 |
| `overlayClassName` | `string` | - | CSS class name applied to tooltip card | - |
| `overlayStyle` | `CSSProperties` | - | Custom styles for tooltip card | - |
| `overlayInnerStyle` | `CSSProperties` | - | Custom styles for tooltip inner content | 4.0.0 |
| `placement` | `string` | `top` | Position of tooltip relative to target (12 options available) | - |
| `trigger` | `'hover' \| 'focus' \| 'click' \| 'contextMenu' \| Array<string>` | `hover` | Tooltip trigger mode(s) | - |
| `zIndex` | `number` | - | CSS z-index value for tooltip overlay | - |
| `onOpenChange` | `(open: boolean) => void` | - | Callback fired when visibility changes (replaces deprecated `onVisibleChange`) | 4.23.0 |

### Placement Options (12 total)

- **Top**: `top`, `topLeft`, `topRight`
- **Bottom**: `bottom`, `bottomLeft`, `bottomRight`
- **Left**: `left`, `leftTop`, `leftBottom`
- **Right**: `right`, `rightTop`, `rightBottom`

### Preset Color Options

Ant Design provides built-in theme colors: `'pink'`, `'red'`, `'yellow'`, `'orange'`, `'cyan'`, `'green'`, `'blue'`, `'purple'`, `'geekblue'`, `'magenta'`, `'volcano'`, `'gold'`, `'lime'`

Custom colors can be specified using hex values (e.g., `'#f50'`, `'#2db7f5'`, `'#87d068'`)

## Notable Features

1. **Shared API Architecture**: Tooltip shares a common API with Popover and Popconfirm components, making it easy to understand all three if you know one. The main difference is complexity of content - Tooltip for simple text, Popover for interactive content.

2. **Render Function Support**: The `title` prop accepts render functions `() => ReactNode`, allowing for dynamic content that's re-evaluated each time the tooltip opens. Useful for showing timestamps, random values, or computed content.

3. **Event Forwarding Requirement**: The child element of Tooltip must properly forward events (`onMouseEnter`, `onMouseLeave`, `onFocus`, `onClick`). This is critical - if your custom component doesn't forward these events, the tooltip won't work. For custom components, spread event props or explicitly handle them.

4. **Controlled and Uncontrolled Modes**: Tooltip uses `useMergedState` internally to seamlessly support both controlled (`open` + `onOpenChange`) and uncontrolled (`defaultOpen`) patterns, following React best practices.

5. **Auto-Adjustment Intelligence**: With `autoAdjustOverflow={true}` (default), Tooltip intelligently repositions itself when it would be clipped by viewport boundaries. For example, a `top` placement near the top edge will flip to `bottom`, and `topLeft` will flip to `bottomLeft`.

6. **Performance Optimization**: The `destroyTooltipOnHide` prop allows you to control whether the tooltip DOM persists when hidden. For tooltips with expensive render content or many instances, setting this to `true` can improve performance by removing the DOM entirely.

7. **Scoped Styling via getPopupContainer**: By default, tooltips are appended to `document.body`, which means scoped styles won't apply. Use `getPopupContainer={(node) => node.parentElement}` to render the tooltip within a styled container, enabling scoped CSS or styled-components.

8. **Fine-Grained Positioning**: Beyond the 12 placement presets, the `align` prop provides access to the underlying rc-tooltip alignment configuration, allowing pixel-perfect positioning when needed.

9. **Rich Color System**: Supports both preset theme colors (integrated with Ant Design's color system) and arbitrary hex colors, making it easy to match brand colors or create semantic color schemes (e.g., red for errors, green for success).

10. **Context Menu Trigger**: The `contextMenu` trigger (added in v4.0+) enables right-click activated tooltips, useful for showing additional options or information on right-click without implementing a full context menu component.

11. **TypeScript-First Design**: Complete TypeScript definitions with proper type inference for all props, callbacks, and render functions, providing excellent developer experience.

12. **Flexible Delay Controls**: Separate controls for `mouseEnterDelay` and `mouseLeaveDelay` allow fine-tuning of the tooltip timing to match your UX needs - make tooltips appear instantly, or persist longer for easier reading.

## Research Notes

### Access Challenges
- The Ant Design documentation site (ant.design) uses a modern React-based architecture with dynamic content rendering
- Direct web scraping of the main documentation page was difficult due to compiled/minified JavaScript and CSS
- Most comprehensive information was gathered from:
  - Official API documentation via web search and alternative sources
  - 4x.ant.design (version 4.x documentation) which had better content extraction
  - GeeksforGeeks community tutorials
  - GitHub source code (TypeScript interfaces and implementation)
  - Stack Overflow discussions for styling and customization patterns

### Documentation Observations
- **Excellent API documentation**: Clear, comprehensive prop tables with types, defaults, and descriptions
- **Version evolution**: The API has remained relatively stable from v2 to v5, with main changes being:
  - `visible`/`onVisibleChange` → `open`/`onOpenChange` (v4.23.0)
  - Addition of `overlayInnerStyle` prop (v4.0.0)
  - Addition of `color` prop (v4.3.0)
  - Context menu trigger support (v4.0+)
- **React-centric approach**: Heavy use of React patterns (ReactNode, render functions, controlled/uncontrolled components)
- **TypeScript support**: Strong typing throughout with exported interfaces for excellent DX
- **Shared component abstraction**: Built on rc-tooltip from the react-component ecosystem, sharing behavior with Popover and Popconfirm

### Comparison Points
- **vs Popover**: Tooltip is simpler and typically non-interactive; Popover supports rich interactive content and actions
- **vs title attribute**: Native HTML `title` has poor styling control and inconsistent behavior; Ant Tooltip provides consistent, styleable, framework-integrated experience
- **vs custom CSS tooltips**: Ant Tooltip handles all complexity (positioning, arrow, animations, accessibility) with a simple API
- **Framework positioning**: Part of Ant Design's overlay component family, sharing patterns with Modal, Drawer, Popover, Dropdown

### API Design Patterns
- **Prop naming consistency**: Uses consistent naming across overlay components (open, onOpenChange, placement, trigger, etc.)
- **Defaults favor usability**: Sensible defaults (hover trigger, auto-adjustment enabled, 0.1s delays) work well for most cases
- **Progressive disclosure**: Simple use cases require minimal props; advanced features available through additional props
- **Composition friendly**: Works well with Ant Design buttons, icons, and other components; children can be any valid React element

### Styling Architecture
- **CSS class targeting**: Uses `.ant-tooltip-inner` for main content, `.ant-tooltip-arrow::before` for arrow
- **Theme integration**: Color prop integrates with Ant Design's theming system
- **Portal rendering**: Default rendering to document.body requires `getPopupContainer` for scoped styles
- **CSS-in-JS friendly**: Works well with styled-components, emotion, and other CSS-in-JS solutions

### Performance Considerations
- **destroyTooltipOnHide**: Critical for performance when using many tooltips or expensive content
- **Render function overhead**: Dynamic content via render functions re-evaluates on every open; memoize expensive computations
- **Portal rendering**: Appending to document.body is fast but can create z-index issues; weigh trade-offs with `getPopupContainer`
- **Animation system**: Built-in animations are performant but numerous simultaneous tooltips may need optimization

### Common Use Cases Observed
1. **Form field hints**: Explaining form inputs without cluttering labels
2. **Icon descriptions**: Providing context for icon-only buttons
3. **Truncated text**: Showing full text when hovering over ellipsized content
4. **Disabled state explanations**: Explaining why an action is disabled
5. **Keyboard shortcuts**: Displaying available keyboard shortcuts on hover
6. **Status indicators**: Providing detail about status icons or badges
7. **Data visualizations**: Showing precise values in charts and graphs

### Accessibility Considerations
- Component handles ARIA attributes automatically for proper screen reader support
- Keyboard navigation support through focus trigger
- Escape key closes tooltip for keyboard users
- Consider tooltip content length - very long tooltips may be better as Popovers or Modals
- Avoid putting critical information in tooltips that aren't accessible to touch device users

### Migration Notes (for updating from older versions)
- Replace `visible` with `open` (v4.23.0+)
- Replace `onVisibleChange` with `onOpenChange` (v4.23.0+)
- Consider using new `color` prop instead of custom CSS (v4.3.0+)
- `overlayInnerStyle` provides more targeted styling (v4.0.0+)

### Integration Patterns
- Works seamlessly with Ant Design's Button, Icon, Input, and other components
- Compatible with React 16.9+, React 17, and React 18
- Supports server-side rendering (SSR) with Next.js, Remix, etc.
- Works with React testing libraries for unit and integration tests
- Compatible with React DevTools for debugging

### Known Limitations and Gotchas
1. **Event forwarding**: Child components must forward DOM events; higher-order components may block events
2. **Tooltip positioning in scrollable containers**: May need `getPopupContainer` adjustments
3. **Multiple tooltips**: Nesting tooltips is not officially supported and may cause issues
4. **Touch devices**: Hover trigger doesn't work naturally on touch; consider using click trigger on mobile
5. **Global styles**: Default document.body rendering means global styles affect all tooltips
6. **Dynamic children**: If child component changes structure, tooltip positioning may need recalculation

### Best Practices Identified
1. Use hover for desktop-primary interfaces, click for mobile-friendly interfaces
2. Keep tooltip content concise - 1-2 sentences maximum
3. For longer content or interactive elements, use Popover instead
4. Use `destroyTooltipOnHide` for tooltips with expensive rendering
5. Leverage preset colors for consistent theming
6. Use controlled mode when tooltip visibility needs to coordinate with other UI state
7. Test on mobile devices - consider disabling hover tooltips or switching to click
8. Use `arrowPointAtCenter` for better alignment on wide elements
9. Adjust delays based on information density - longer delays for dense interfaces
10. Combine with disabled states to explain why actions aren't available
