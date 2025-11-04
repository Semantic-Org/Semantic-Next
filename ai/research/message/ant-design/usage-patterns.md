# Ant Design - Message Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://ant.design/components/message/
Status: ⚠️ Direct access blocked, documented via web search
Version: 5.x (current)
Last Verified: 2025-11-04

## Documentation Quality
Ant Design provides comprehensive documentation with extensive examples, TypeScript support, and clear API references. Documentation covers both legacy static methods and modern hook-based approaches. The component has evolved to support context-aware usage through ConfigProvider integration.

## Component Definition
- **Core purpose**: Provides transient feedback messages for system operations that appear at the top center of the screen, maintaining user workflow continuity without blocking interaction
- **Mental model**: A global notification system triggered imperatively via method calls rather than declarative JSX components. Messages are ephemeral, auto-dismissing feedback that floats above content
- **Semantic meaning**: Communicates system status, operation results, and lightweight notifications to users in a non-intrusive manner

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Display Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Info message | ✅ | Native | `message.info()` - blue with info icon |
| Success message | ✅ | Native | `message.success()` - green with checkmark icon |
| Warning message | ✅ | Native | `message.warning()` - yellow with exclamation mark |
| Error message | ✅ | Native | `message.error()` - red with X icon |
| Loading message | ✅ | Native | `message.loading()` - purple with spinner animation |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Primary method - string or React node as content |
| Title + description | ❌ | N/A | Not supported - use Notification component for structured content |
| Icon support | ✅ | Native | Built-in icons per type, custom via `icon` prop |
| Rich content/JSX | ✅ | Native | Accepts React nodes in content parameter |
| Action buttons | ❌ | N/A | Not supported - use Notification component for actions |
| Links | ✅ | Composed | Can include links within content JSX |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Dismissible | ✅ | Native | Manual close via `message.destroy()` or `onClick` handler |
| Auto-dismiss | ✅ | Native | Default 3s duration, configurable per message |
| Duration control | ✅ | Native | Set via `duration` param (seconds), 0 = no auto-dismiss |
| Animation | ✅ | Native | Built-in enter/exit animations |
| Stacking/queueing | ✅ | Native | Multiple messages stack vertically, `maxCount` limits display |
| Global positioning | ✅ | Native | Top-center default, configurable via `top` offset in config |

## Variant Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Filled/solid style | ✅ | Native | Default appearance with colored icons and light backgrounds |
| Outlined style | ❌ | CSS | Not built-in, would require custom styling |
| Subtle/light style | ✅ | Native | Default style is subtle/light (not fully colored backgrounds) |
| Size variants | ❌ | CSS | No built-in size variants, customizable via `style` prop |

## Code Examples

### Basic Usage (Static Methods)
```typescript
import { Button, message, Space } from 'antd';
import React from 'react';

const success = () => {
  message.success('This is a success message');
};

const error = () => {
  message.error('This is an error message');
};

const warning = () => {
  message.warning('This is a warning message');
};

const info = () => {
  message.info('This is an info message');
};

const App: React.FC = () => (
  <Space>
    <Button onClick={success}>Success</Button>
    <Button onClick={error}>Error</Button>
    <Button onClick={warning}>Warning</Button>
    <Button onClick={info}>Info</Button>
  </Space>
);

export default App;
```

### Hook-Based Usage (Context-Aware)
```typescript
import { Button, message } from 'antd';
import React from 'react';

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const info = () => {
    messageApi.open({
      type: 'info',
      content: 'Hello from hook-based message!',
      duration: 2,
    });
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={info}>
        Display message
      </Button>
    </>
  );
};

export default App;
```

### Custom Duration and Styling
```typescript
import { message } from 'antd';

const customMessage = () => {
  message.success({
    content: 'This is a custom message with custom className and style',
    className: 'custom-class',
    style: {
      marginTop: '20vh',
    },
    duration: 5, // 5 seconds
  });
};
```

### Custom Icon
```typescript
import { message } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const customIconMessage = () => {
  message.open({
    type: 'info',
    content: 'This is a message with custom icon',
    icon: <SmileOutlined />,
  });
};
```

### Promise Interface for Sequential Messages
```typescript
import { message } from 'antd';

const sequentialMessages = () => {
  message.loading('Action in progress...', 2.5)
    .then(() => message.success('Loading finished', 2.5))
    .then(() => message.info('All done!', 2.5));
};
```

### Update Message Content with Key
```typescript
import { message } from 'antd';

const updateMessage = () => {
  const key = 'updatable';

  message.open({
    key,
    type: 'loading',
    content: 'Loading...',
    duration: 0, // Don't auto-dismiss
  });

  // Simulate async operation
  setTimeout(() => {
    message.open({
      key,
      type: 'success',
      content: 'Loading complete!',
      duration: 2,
    });
  }, 2000);
};
```

### Manual Close with onClick
```typescript
import { message } from 'antd';

const clickableMessage = () => {
  const key = 'clickable-msg';

  message.error({
    key,
    content: 'Click to dismiss',
    duration: 5,
    onClick: () => message.destroy(key),
  });
};
```

### Global Configuration
```typescript
import { message } from 'antd';

// Configure globally once
message.config({
  top: 100,              // Offset from top in pixels
  duration: 2,           // Default duration in seconds
  maxCount: 3,           // Max messages displayed simultaneously
  rtl: false,            // RTL mode
  prefixCls: 'my-msg',   // Custom CSS prefix
});

// Then use messages normally
message.success('Configured message');
```

## API Reference

### Static Methods
| Method | Signature | Description |
|--------|-----------|-------------|
| `message.success()` | `(content, [duration], onClose)` or `(config)` | Show success message |
| `message.error()` | `(content, [duration], onClose)` or `(config)` | Show error message |
| `message.info()` | `(content, [duration], onClose)` or `(config)` | Show info message |
| `message.warning()` | `(content, [duration], onClose)` or `(config)` | Show warning message |
| `message.loading()` | `(content, [duration], onClose)` or `(config)` | Show loading message |
| `message.open()` | `(config)` | Show message with custom config |
| `message.destroy()` | `(key?)` | Remove message by key, or all if no key |
| `message.config()` | `(options)` | Global configuration |

### Hook API
| Hook | Returns | Description |
|------|---------|-------------|
| `message.useMessage()` | `[messageApi, contextHolder]` | Returns context-aware message API and holder node |

### Config Object Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `ReactNode` | - | Message content |
| `duration` | `number` | 3 | Auto-dismiss duration in seconds, 0 = manual close only |
| `type` | `'success' \| 'error' \| 'info' \| 'warning' \| 'loading'` | - | Message type |
| `icon` | `ReactNode` | - | Custom icon to override default |
| `key` | `string \| number` | - | Unique identifier for updating/closing specific message |
| `className` | `string` | - | Custom CSS class |
| `style` | `CSSProperties` | - | Custom inline styles |
| `onClick` | `() => void` | - | Click handler for message |
| `onClose` | `() => void` | - | Callback when message closes |

### Global Config Options
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `top` | `number` | 8 | Offset from top in pixels |
| `duration` | `number` | 3 | Default duration for all messages |
| `maxCount` | `number` | - | Max messages displayed simultaneously |
| `rtl` | `boolean` | false | Enable RTL mode |
| `prefixCls` | `string` | `'ant-message'` | Custom CSS prefix |
| `getContainer` | `() => HTMLElement` | `() => document.body` | Container mount node |

### Return Value
All message methods return a Promise-like object with a `then` method for chaining.

## Notable Features

### 1. **Imperative API Design**
Unlike most React components, Message uses an imperative API (`message.success()`) rather than declarative JSX. This aligns with the transient, non-UI-tree nature of global notifications.

### 2. **Promise Interface**
Messages support promise chaining via `.then()`, enabling sequential message flows for multi-step operations.

### 3. **Context-Aware Hooks**
Version 5.x introduces `useMessage()` hook that respects ConfigProvider context, solving the limitation of static methods not accessing React context.

### 4. **Message Updating**
Using the `key` parameter, messages can be updated in place rather than stacking, perfect for progress indicators.

### 5. **Stacking Control**
The `maxCount` global config limits simultaneous messages, automatically removing oldest when limit is exceeded.

### 6. **TypeScript Support**
Full TypeScript definitions with typed config objects and method signatures.

### 7. **RTL Support**
Built-in RTL mode support via global configuration.

### 8. **Lightweight Design**
Messages are designed for brief feedback only - no built-in action buttons or complex layouts (use Notification component for that).

### 9. **Application Component Integration**
Recommended to wrap app with Ant Design's `App` component which automatically handles contextHolder management.

### 10. **Zero Duration for Manual Control**
Setting `duration: 0` creates persistent messages that must be manually dismissed, useful for errors requiring acknowledgment.

## Research Notes

### API Evolution
Ant Design has evolved from purely static methods to a hybrid approach:
- **Legacy (v4 and earlier)**: Static methods only (`message.success()`)
- **Modern (v5+)**: Hook-based API (`useMessage()`) recommended for context support
- Both approaches coexist for backward compatibility

### Message vs Notification
Important distinction in Ant Design ecosystem:
- **Message**: Simple, brief, top-center feedback without actions
- **Notification**: Rich content with title, description, actions, and flexible positioning

### Static Method Limitations
The documentation explicitly warns that static methods cannot consume React context, so ConfigProvider data won't work with them. This led to the introduction of the hook-based API.

### Positioning Constraints
Unlike Notification component, Message has limited positioning options - primarily top-center with vertical offset control only. No bottom/corner positioning natively supported.

### No Declarative Component
There is no `<Message>` component to render in JSX. All usage is imperative via method calls. This is intentional for the use case.

### Browser Tab Behavior
Found GitHub issue (#32101) indicating `maxCount` behavior can be affected by browser tab switching, suggesting potential edge cases in visibility/lifecycle management.

### Accessibility Considerations
Documentation doesn't extensively cover ARIA attributes or screen reader support, which may be a consideration for accessibility-critical applications.

### Performance Notes
Messages are rendered outside the normal component tree using portals, with efficient mounting/unmounting. The `getContainer` option allows customizing mount location.
