# Ant Design - Message (Toast) Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/message
Status: ✅ Verified via web search and GitHub source
Version: 5.x (current)
Last Verified: 2025-11-05

## Documentation Quality
Ant Design provides comprehensive documentation with extensive TypeScript support and clear API references. Documentation covers both legacy static methods and modern hook-based approaches. The component has evolved to support context-aware usage through ConfigProvider integration and the App component wrapper. Full source code available on GitHub with detailed TypeScript interfaces.

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
| Info message | ✅ | Native | `message.info()` or `messageApi.info()` - blue with info icon |
| Success message | ✅ | Native | `message.success()` or `messageApi.success()` - green with checkmark icon |
| Warning message | ✅ | Native | `message.warning()` or `messageApi.warning()` - yellow with exclamation mark |
| Error message | ✅ | Native | `message.error()` or `messageApi.error()` - red with X icon |
| Loading message | ✅ | Native | `message.loading()` or `messageApi.loading()` - purple with spinner animation |

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
| Dismissible | ✅ | Native | Manual close via `message.destroy(key)` or `onClick` handler |
| Auto-dismiss | ✅ | Native | Default 3s duration, configurable per message |
| Duration control | ✅ | Native | Set via `duration` param (seconds), 0 = no auto-dismiss |
| Animation | ✅ | Native | Built-in enter/exit animations via `transitionName` config |
| Stacking/queueing | ✅ | Native | Multiple messages stack vertically, `maxCount` limits display |
| Global positioning | ✅ | Native | Top-center default, configurable via `top` offset in config |
| Update existing | ✅ | Native | Use same `key` to update message in place |
| Promise interface | ✅ | Native | All methods return promise-like object for chaining |

## Variant Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Filled/solid style | ✅ | Native | Default appearance with colored icons and light backgrounds |
| Outlined style | ❌ | CSS | Not built-in, would require custom styling |
| Subtle/light style | ✅ | Native | Default style is subtle/light (not fully colored backgrounds) |
| Size variants | ❌ | CSS | No built-in size variants, customizable via `style` prop |

## Code Examples

### Basic Usage (Static Methods - Legacy)
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

const loading = () => {
  message.loading('Action in progress...', 2.5);
};

const App: React.FC = () => (
  <Space>
    <Button onClick={success}>Success</Button>
    <Button onClick={error}>Error</Button>
    <Button onClick={warning}>Warning</Button>
    <Button onClick={info}>Info</Button>
    <Button onClick={loading}>Loading</Button>
  </Space>
);

export default App;
```

### Hook-Based Usage (Recommended - Context-Aware)
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

  const success = () => {
    messageApi.success('Operation completed successfully!');
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={info}>
        Display Info
      </Button>
      <Button onClick={success}>
        Display Success
      </Button>
    </>
  );
};

export default App;
```

### App Component Wrapper (Best Practice)
```typescript
import { App, Button } from 'antd';
import React from 'react';

const MyPage: React.FC = () => {
  const { message } = App.useApp();

  const showMessage = () => {
    message.success('This message has access to ConfigProvider context!');
  };

  return <Button onClick={showMessage}>Show Message</Button>;
};

const App: React.FC = () => (
  <App>
    <MyPage />
  </App>
);

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

// Configure globally once at app initialization
message.config({
  top: 100,              // Offset from top in pixels
  duration: 2,           // Default duration in seconds
  maxCount: 3,           // Max messages displayed simultaneously
  rtl: false,            // RTL mode
  prefixCls: 'my-msg',   // Custom CSS prefix
  transitionName: 'fade',// Custom animation transition
});

// Then use messages normally
message.success('Configured message');
```

### Destroy All Messages
```typescript
import { message } from 'antd';

const clearAll = () => {
  message.destroy(); // Remove all messages
};

const clearSpecific = () => {
  const key = 'my-message';
  message.destroy(key); // Remove specific message by key
};
```

### With React Router (Context Preservation)
```typescript
import { message } from 'antd';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <Outlet context={{ messageApi }} />
    </>
  );
};

// In a child route component
import { useOutletContext } from 'react-router-dom';

const ChildComponent: React.FC = () => {
  const { messageApi } = useOutletContext<{ messageApi: any }>();

  const showMessage = () => {
    messageApi.success('Message from child route!');
  };

  return <button onClick={showMessage}>Show Message</button>;
};
```

## API Reference

### Static Methods (Legacy - Not Context-Aware)
| Method | Signature | Description |
|--------|-----------|-------------|
| `message.success()` | `(content, [duration], onClose)` or `(config: ArgsProps)` | Show success message |
| `message.error()` | `(content, [duration], onClose)` or `(config: ArgsProps)` | Show error message |
| `message.info()` | `(content, [duration], onClose)` or `(config: ArgsProps)` | Show info message |
| `message.warning()` | `(content, [duration], onClose)` or `(config: ArgsProps)` | Show warning message |
| `message.loading()` | `(content, [duration], onClose)` or `(config: ArgsProps)` | Show loading message |
| `message.open()` | `(config: ArgsProps)` | Show message with custom config |
| `message.destroy()` | `(key?: React.Key)` | Remove message by key, or all if no key |
| `message.config()` | `(options: ConfigOptions)` | Global configuration |

### Hook API (Recommended - Context-Aware)
| Hook | Returns | Description |
|------|---------|-------------|
| `message.useMessage()` | `[messageApi, contextHolder]` | Returns context-aware message API and holder node that must be rendered |

### App Component Hook (Best Practice)
| Hook | Returns | Description |
|------|---------|-------------|
| `App.useApp()` | `{ message, notification, modal }` | Access all Ant Design global methods with context support |

### ArgsProps Interface (Config Object Properties)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `ReactNode` | - | Message content - string or React node |
| `duration` | `number` | 3 | Auto-dismiss duration in seconds, 0 = manual close only |
| `type` | `'success' \| 'error' \| 'info' \| 'warning' \| 'loading'` | - | Message type |
| `icon` | `ReactNode` | - | Custom icon to override default |
| `key` | `string \| number` | - | Unique identifier for updating/closing specific message |
| `className` | `string` | - | Custom CSS class |
| `style` | `CSSProperties` | - | Custom inline styles |
| `onClick` | `() => void` | - | Click handler for message |
| `onClose` | `() => void` | - | Callback when message closes |

### ConfigOptions Interface (Global Config)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `top` | `number \| string` | 8 | Offset from top in pixels |
| `duration` | `number` | 3 | Default duration for all messages in seconds |
| `maxCount` | `number` | - | Max messages displayed simultaneously |
| `rtl` | `boolean` | false | Enable RTL mode |
| `prefixCls` | `string` | `'ant-message'` | Custom CSS prefix |
| `transitionName` | `string` | - | Custom animation transition class name |
| `getContainer` | `() => HTMLElement` | `() => document.body` | Container mount node |

### MessageInstance Interface
Public API methods available from `messageApi` (returned from `useMessage()`):
- `info(content, [duration], onClose)` or `info(config: ArgsProps)` → `MessageType`
- `success(content, [duration], onClose)` or `success(config: ArgsProps)` → `MessageType`
- `error(content, [duration], onClose)` or `error(config: ArgsProps)` → `MessageType`
- `warning(content, [duration], onClose)` or `warning(config: ArgsProps)` → `MessageType`
- `loading(content, [duration], onClose)` or `loading(config: ArgsProps)` → `MessageType`
- `open(args: ArgsProps)` → `MessageType`
- `destroy(key?: React.Key)` → `void`

### TypeScript Types
```typescript
// Notice types
type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

// Return type (extends PromiseLike for chaining)
interface MessageType extends PromiseLike<boolean> {
  (): void;
}

// Function signature for typed methods
type TypeOpen = (
  content: React.ReactNode | ArgsProps,
  duration?: number | VoidFunction,
  onClose?: VoidFunction
) => MessageType;
```

### Return Value
All message methods return a `MessageType` object which:
- Extends `PromiseLike<boolean>` for promise chaining via `.then()`
- Can be called as a function to manually close the message
- Allows sequential message flows for multi-step operations

## Notable Features

### 1. **Imperative API Design**
Unlike most React components, Message uses an imperative API (`message.success()`) rather than declarative JSX. This aligns with the transient, non-UI-tree nature of global notifications.

### 2. **Promise Interface**
Messages support promise chaining via `.then()`, enabling sequential message flows for multi-step operations:
```typescript
message.loading('Step 1...').then(() => message.success('Done!'));
```

### 3. **Context-Aware Hooks (v5+)**
Version 5.x introduces `useMessage()` hook that respects ConfigProvider context, solving the limitation of static methods not accessing React context. The **App component wrapper** is now the recommended approach.

### 4. **Message Updating**
Using the `key` parameter, messages can be updated in place rather than stacking, perfect for progress indicators:
```typescript
message.open({ key: 'progress', type: 'loading', content: '50%' });
// Later update same message
message.open({ key: 'progress', type: 'success', content: 'Complete!' });
```

### 5. **Stacking Control**
The `maxCount` global config limits simultaneous messages, automatically removing oldest when limit is exceeded. Useful for preventing notification spam.

### 6. **TypeScript Support**
Full TypeScript definitions with typed config objects and method signatures. All interfaces exported for type-safe usage.

### 7. **RTL Support**
Built-in RTL mode support via global configuration for right-to-left languages.

### 8. **Lightweight Design**
Messages are designed for brief feedback only - no built-in action buttons or complex layouts. For richer notifications, use the Notification component instead.

### 9. **App Component Integration**
Recommended approach is wrapping your app with Ant Design's `App` component which automatically handles contextHolder management and provides all global methods:
```typescript
import { App } from 'antd';

const MyComponent = () => {
  const { message } = App.useApp();
  return <button onClick={() => message.success('Done!')}>Click</button>;
};

const Root = () => (
  <App>
    <MyComponent />
  </App>
);
```

### 10. **Zero Duration for Manual Control**
Setting `duration: 0` creates persistent messages that must be manually dismissed, useful for errors requiring acknowledgment or ongoing operations.

### 11. **Custom Animation Transitions**
The `transitionName` config option allows custom CSS animation classes for enter/exit transitions.

### 12. **Flexible Mount Point**
The `getContainer` option allows customizing where messages are rendered in the DOM, useful for modal or drawer contexts.

## Research Notes

### API Evolution
Ant Design has evolved from purely static methods to a hybrid approach:
- **Legacy (v4 and earlier)**: Static methods only (`message.success()`)
- **Modern (v5+)**: Hook-based API (`useMessage()`) recommended for context support
- **Best Practice (v5+)**: App component wrapper with `App.useApp()` hook
- All three approaches coexist for backward compatibility

### Message vs Notification
Important distinction in Ant Design ecosystem:
- **Message**: Simple, brief, top-center feedback without actions (this component)
- **Notification**: Rich content with title, description, actions, and flexible positioning (corner/edge)

### Static Method Limitations
The documentation explicitly warns that **static methods cannot consume React context**, so ConfigProvider data won't work with them. This led to the introduction of:
1. Hook-based API (`useMessage()`)
2. App component wrapper (current best practice)

### Positioning Constraints
Unlike the Notification component, Message has limited positioning options:
- Primarily top-center placement
- Only vertical offset control via `top` config
- No bottom/corner positioning natively supported
- For flexible positioning, use Notification component instead

### No Declarative Component
There is no `<Message>` component to render in JSX. All usage is imperative via method calls. This is intentional design for the transient feedback use case.

### Context Preservation with React Router
When using React Router or similar routing libraries, the `contextHolder` must be rendered at a level that persists across route changes. Common pattern is rendering in layout component with `<Outlet>` for child routes.

### Performance Characteristics
- Messages are rendered outside the normal component tree using portals
- Efficient mounting/unmounting with minimal re-renders
- The `getContainer` option allows customizing mount location
- Task queue system prevents race conditions with rapid message calls

### Accessibility Considerations
- Documentation doesn't extensively cover ARIA attributes
- Messages appear/disappear without explicit screen reader announcements in default config
- May require additional ARIA live regions for accessibility-critical applications
- Consider using Notification component for better accessibility control

### Browser Tab Behavior
- GitHub issue (#32101) indicates `maxCount` behavior can be affected by browser tab switching
- Suggests potential edge cases in visibility/lifecycle management
- Consider testing message behavior when tabs become inactive/active

### Global State Management
The message system maintains global state outside React component tree:
- Uses singleton pattern for static methods
- Hook-based API creates isolated instances per context
- Multiple `useMessage()` calls create independent message managers

### Migration Path
Ant Design recommends gradual migration:
1. Start: Static methods (`message.success()`)
2. Upgrade: Hook-based (`useMessage()` + contextHolder)
3. Best: App component wrapper (`App.useApp()`)

Each step is backward compatible.

### TypeScript Integration
- Full type definitions in `message/interface.ts`
- Exported types: `NoticeType`, `ArgsProps`, `ConfigOptions`, `MessageInstance`, `MessageType`, `TypeOpen`
- Generic support for custom content types
- Type-safe configuration and method signatures

### Design Philosophy
Messages follow Ant Design's principle of **"provide feedback and describe outcomes"**:
- Transient (auto-dismiss by default)
- Non-blocking (don't interrupt workflow)
- Positioned to grab attention without obscuring content
- Minimalist design (no actions, just information)
- Lightweight (for simple feedback only)

### Common Pitfalls
1. **Forgetting contextHolder**: Hook usage requires rendering `{contextHolder}`
2. **Static methods in ConfigProvider**: Static methods ignore provider context
3. **Route changes clearing messages**: contextHolder must be in persistent layout
4. **Too many concurrent messages**: Set `maxCount` to prevent UI clutter
5. **Missing key for updates**: Updating messages requires consistent `key` prop

### Use Case Recommendations
**Use Message when:**
- Providing brief operation feedback
- Confirming simple actions
- Showing loading states for quick operations
- Displaying simple status updates

**Use Notification instead when:**
- Need action buttons or links
- Require title + description structure
- Want flexible positioning (corners, edges)
- Need longer-lasting notifications
- Require complex content layout

### Framework Integration
- Works seamlessly with React 16.8+ (hooks support)
- Compatible with React Router, Next.js, Remix
- Integrates with Ant Design's ConfigProvider for theming
- Supports SSR with proper configuration
- Works with TypeScript, Flow, and vanilla JavaScript
