# Ant Design Textarea - Usage Patterns

> Research Date: 2025-11-06
> Component URL: https://ant.design/components/input/#components-input-demo-textarea

## Component Overview

Ant Design's TextArea component is part of the Input component family, designed specifically for multi-line text input. It wraps the `rc-textarea` library with Ant Design's styling system and extends the standard HTML textarea with advanced features like auto-sizing, character counting with custom formatting, and comprehensive status states.

**Core Purpose**: To provide a flexible, accessible multi-line text input with automatic height adjustment, character counting, and integrated validation feedback.

**Mental Model**: An enhanced HTML textarea that automatically adapts to content, provides visual feedback for validation states, and includes sophisticated character counting for modern use cases (e.g., emoji-aware counting).

**Semantic Meaning**: Represents a multi-line text input field that can automatically resize, display character counts, and communicate validation states through visual styling and ARIA attributes.

## Core Patterns

### Component Structure
- Implemented as `Input.TextArea` within the Input component family
- Built on top of `rc-textarea` with Ant Design's configuration and styling system
- Supports all standard HTML textarea attributes plus Ant Design enhancements
- ForwardRef component exposing `TextAreaRef` interface with focus, blur, and resizableTextArea methods

### API Design Philosophy
- Inherits all Input component props (allowClear, status, variant, size, etc.)
- Extends with textarea-specific features (autoSize, rows, cols, onResize)
- Supports native textarea attributes for maximum compatibility
- Progressive enhancement approach: works as standard textarea with optional advanced features

### Import Pattern
```jsx
import { Input } from 'antd';
const { TextArea } = Input;

// Usage
<TextArea placeholder="Enter text" />
```

## Props & Configuration

### TextArea-Specific Props

#### autoSize
- **Type**: `boolean | { minRows?: number; maxRows?: number }`
- **Default**: `undefined`
- **Description**: Makes height automatically adjust based on content. Can specify min/max rows for boundaries.
- **Added**: Available since early versions
- **Note**: Property name changed from `autosize` (lowercase) in 2.x to `autoSize` (camelCase) in later versions

#### rows
- **Type**: `number`
- **Default**: `undefined`
- **Description**: Initial number of rows (standard HTML textarea attribute)

#### cols
- **Type**: `number`
- **Default**: `undefined`
- **Description**: Number of columns (standard HTML textarea attribute)

#### onResize
- **Type**: `(size: { width: number; height: number; rows?: number }) => void`
- **Default**: `undefined`
- **Description**: Callback triggered when textarea is resized (user drag or autoSize adjustment)
- **Added**: Version 4.x+

### Inherited Input Props

#### allowClear
- **Type**: `boolean | { clearIcon?: ReactNode }`
- **Default**: `false`
- **Description**: Adds a clear icon button to remove all text content

#### showCount
- **Type**: `boolean | { formatter: (info: { value: string; count: number; maxLength?: number }) => ReactNode }`
- **Default**: `false`
- **Description**: Display character count below textarea, supports custom formatting
- **Added**: Version 4.18.0
- **Enhanced**: Version 4.23.0 added formatter support

#### count
- **Type**: `{ show?: boolean | ((args: { value: string; count: number; maxLength?: number }) => ReactNode); max?: number; strategy?: (value: string) => number; exceedFormatter?: (value: string, config: { max: number }) => string }`
- **Default**: `undefined`
- **Description**: Advanced character counting configuration for custom counting logic (e.g., emoji-aware counting)
- **Added**: Version 5.10.0+
- **Features**:
  - `max`: Maximum character count (warning state, not truncation)
  - `strategy`: Custom counting function for special characters
  - `exceedFormatter`: Custom display when limit exceeded
  - `show`: Whether to display count

#### maxLength
- **Type**: `number`
- **Default**: `undefined`
- **Description**: Maximum character length enforced by browser (native truncation)

#### value
- **Type**: `string`
- **Default**: `undefined`
- **Description**: Current textarea value (controlled component)

#### defaultValue
- **Type**: `string`
- **Default**: `undefined`
- **Description**: Initial textarea value (uncontrolled component)

#### placeholder
- **Type**: `string`
- **Default**: `undefined`
- **Description**: Placeholder text displayed when empty
- **Accessibility Note**: Not read by screen readers, should not be sole label

#### disabled
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Disables the textarea and prevents user interaction

#### readOnly
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Makes textarea read-only but still accessible
- **Note**: Preferred over disabled for accessibility in some scenarios

#### status
- **Type**: `'error' | 'warning'`
- **Default**: `undefined`
- **Description**: Validation status with visual styling
- **Added**: Version 4.19.0

#### size
- **Type**: `'large' | 'middle' | 'small'`
- **Default**: `'middle'`
- **Description**: Textarea height preset
- **Dimensions**: large (40px), middle/default (32px), small (24px)
- **Note**: TextArea size property had limited support historically (Issue #11624)

#### variant
- **Type**: `'outlined' | 'borderless' | 'filled'`
- **Default**: `'outlined'`
- **Description**: Visual style variant
- **Added**: Version 5.13.0
- **Replaces**: Deprecated `bordered` prop

#### bordered
- **Type**: `boolean`
- **Default**: `true`
- **Status**: **Deprecated** - Use `variant` instead
- **Description**: Whether textarea has border

#### classNames
- **Type**: `Record<SemanticDOM, string>`
- **Default**: `undefined`
- **Description**: Semantic CSS class names for internal elements

#### styles
- **Type**: `Record<SemanticDOM, CSSProperties>`
- **Default**: `undefined`
- **Description**: Semantic inline styles for internal elements

#### rootClassName
- **Type**: `string`
- **Default**: `undefined`
- **Description**: CSS class for root wrapper element

#### className
- **Type**: `string`
- **Default**: `undefined`
- **Description**: CSS class for textarea element

#### style
- **Type**: `CSSProperties`
- **Default**: `undefined`
- **Description**: Inline styles for textarea element

#### prefixCls
- **Type**: `string`
- **Default**: `'ant-input'`
- **Description**: CSS class prefix for component styling

### Event Handlers

#### onChange
- **Type**: `(e: React.ChangeEvent<HTMLTextAreaElement>) => void`
- **Description**: Callback when textarea value changes

#### onPressEnter
- **Type**: `(e: React.KeyboardEvent<HTMLTextAreaElement>) => void`
- **Description**: Callback when Enter key is pressed

#### onFocus
- **Type**: `(e: React.FocusEvent<HTMLTextAreaElement>) => void`
- **Description**: Callback when textarea receives focus

#### onBlur
- **Type**: `(e: React.FocusEvent<HTMLTextAreaElement>) => void`
- **Description**: Callback when textarea loses focus

#### onMouseDown
- **Type**: `(e: React.MouseEvent<HTMLTextAreaElement>) => void`
- **Description**: Callback for mousedown events

## Visual Patterns

### Variants
Ant Design provides three visual variants (v5.13.0+):

| Variant | Description | Use Case |
|---------|-------------|----------|
| `outlined` (default) | Border around textarea | Standard form inputs, clear boundaries |
| `filled` | Filled background with subtle border | Reduced visual weight, modern aesthetic |
| `borderless` | No border or background | Inline editing, minimal UI |

### Sizes
Three size presets control the overall dimensions:

| Size | Height | Use Case |
|------|--------|----------|
| `large` | 40px | Prominent inputs, accessibility |
| `middle` (default) | 32px | Standard form contexts |
| `small` | 24px | Compact UIs, space-constrained layouts |

**Note**: Size primarily affects the initial height and padding. With `autoSize`, the height grows dynamically.

### Status States
Visual feedback for validation:

| Status | Color | Description |
|--------|-------|-------------|
| `error` | Red border/background | Validation failure, required field missing |
| `warning` | Orange border/background | Non-critical issues, recommendations |
| (none) | Default styling | No validation feedback |

### Disabled vs ReadOnly Styling
- **disabled**: Grayed out appearance, cursor not-allowed, not focusable
- **readOnly**: Normal appearance, cursor text, focusable but not editable

## Behavioral Patterns

### Auto-Sizing Feature

#### Basic Auto-Sizing
Automatically adjusts height based on content:
```jsx
<TextArea autoSize placeholder="Grows with content" />
```

#### Constrained Auto-Sizing
Specify minimum and maximum rows:
```jsx
<TextArea
  autoSize={{ minRows: 2, maxRows: 6 }}
  placeholder="2-6 rows based on content"
/>
```

**Implementation Details**:
- Uses `rc-textarea`'s resize observer to detect content changes
- Calculates required height based on line height and padding
- Triggers `onResize` callback with new dimensions
- Maintains constraints even when user manually resizes

#### Auto-Sizing Edge Cases
- Tables with fixed columns: Known issue #18039 with autosizing in table cells
- Height calculation: Early versions had issues (#9107) with autoSize configuration
- Performance: Efficient for most cases, uses ResizeObserver API

### Character Counting

#### Basic Character Count
Display simple character count:
```jsx
<TextArea showCount maxLength={100} />
// Displays: 0/100
```

#### Custom Count Formatter
Customize count display format:
```jsx
<TextArea
  showCount={{
    formatter: ({ count, maxLength }) => `${count}${maxLength ? `/${maxLength}` : ''} characters`
  }}
  maxLength={100}
/>
```

#### Advanced Count Configuration (v5.10.0+)
Custom counting strategy for emoji and multi-byte characters:
```jsx
<TextArea
  count={{
    show: true,
    max: 100,
    strategy: (txt) => [...new Intl.Segmenter().segment(txt)].length, // Emoji as 1 char
    exceedFormatter: (txt, { max }) => `Content too long! (${txt.length}/${max})`
  }}
/>
```

**Count vs MaxLength**:
- `maxLength`: Native HTML5 attribute, browser enforces truncation
- `count.max`: Display-only warning, does not truncate content
- Use `count.max` for soft limits with custom messages
- Use `maxLength` for hard limits enforced by browser

### Resize Behavior

#### User Resize
By default, TextArea supports manual resize via drag handle:
- CSS `resize` property controls resize directions: `vertical`, `horizontal`, `both`, `none`
- Browser provides native resize handle
- `onResize` callback fires on manual resize

#### Programmatic Resize Detection
Track resize events for layout adjustments:
```jsx
const [isMultiLine, setIsMultiLine] = useState(false);

<TextArea
  autoSize={{ minRows: 1, maxRows: 6 }}
  onResize={({ rows }) => setIsMultiLine(rows > 1)}
/>
```

#### Resize Control
Disable user resizing with CSS:
```jsx
<TextArea style={{ resize: 'none' }} />
```

### Focus Management

#### Programmatic Focus
Using ref to control focus:
```jsx
const textAreaRef = useRef<TextAreaRef>(null);

<TextArea ref={textAreaRef} />
<Button onClick={() => textAreaRef.current?.focus()}>Focus TextArea</Button>
```

#### Focus Options
```jsx
textAreaRef.current?.focus({
  cursor: 'start' | 'end' | 'all'
});
```

## Content Patterns

### Controlled vs Uncontrolled

#### Controlled Component
Parent manages state:
```jsx
const [text, setText] = useState('');

<TextArea
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

#### Uncontrolled Component
Component manages own state:
```jsx
<TextArea
  defaultValue="Initial text"
  onChange={(e) => console.log(e.target.value)}
/>
```

### Placeholder Text
- Displayed when textarea is empty
- Vanishes when user starts typing
- Not accessible to screen readers (use proper labels)
- Default browser styling: low contrast (accessibility concern)

### Clear Functionality
Allow users to quickly clear content:
```jsx
<TextArea
  allowClear
  placeholder="Click X to clear"
  onChange={(e) => console.log('Cleared or changed:', e.target.value)}
/>
```

Custom clear icon:
```jsx
<TextArea
  allowClear={{ clearIcon: <CloseCircleOutlined style={{ color: 'red' }} /> }}
/>
```

### Default Values
Set initial content for uncontrolled components:
```jsx
<TextArea
  defaultValue="This is the initial content.\nMultiple lines supported."
  rows={4}
/>
```

## Accessibility

### ARIA Attributes

Ant Design TextArea supports standard ARIA attributes for accessibility:

#### Common ARIA Props
- `aria-label`: Accessible name when no visible label
- `aria-labelledby`: Reference to labeling element ID
- `aria-describedby`: Reference to description element ID
- `aria-invalid`: Indicates validation error state
- `aria-required`: Indicates required field
- `aria-readonly`: Indicates read-only state (not fully supported by all screen readers)
- `aria-disabled`: Indicates disabled state

#### Status and ARIA
When using `status="error"` or `status="warning"`:
- Visually indicated with color changes
- Should be paired with `aria-invalid="true"` and `aria-describedby` pointing to error message
- Ant Design form integration handles this automatically

### Keyboard Support

#### Standard Textarea Navigation
- **Tab**: Move focus to/from textarea
- **Shift+Tab**: Move focus backward
- **Enter**: Insert newline (not submit)
- **Ctrl/Cmd + A**: Select all text
- **Ctrl/Cmd + C/V/X**: Copy/paste/cut operations
- **Arrow keys**: Move cursor within text
- **Home/End**: Move to line start/end
- **Ctrl/Cmd + Home/End**: Move to document start/end

#### Enter Key Behavior
Unlike regular inputs, pressing Enter in a textarea inserts a newline rather than submitting forms. Use `onPressEnter` to detect Enter key presses for custom behavior:
```jsx
<TextArea
  onPressEnter={(e) => {
    if (e.ctrlKey) {
      // Ctrl+Enter could trigger submission
      handleSubmit();
    }
  }}
/>
```

### Accessibility Considerations

#### Known Issues
Based on GitHub issues and community reports:
- **ARIA Labels**: Some instances where ARIA labels not properly read by screen readers (#31692)
- **Placeholder Accessibility**: Placeholders not read by JAWS/NVDA, insufficient contrast in default styling
- **ReadOnly Attribute**: `aria-readonly="true"` not consistently announced by all screen readers
- **Disabled vs ReadOnly**: Disabled elements not accessible to screen readers; prefer readonly when content needs to be readable

#### Best Practices
- **Always provide labels**: Use `<label>` elements or `aria-label`, never rely on placeholder alone
- **Error messages**: Associate error messages with `aria-describedby`
- **Required fields**: Mark with `aria-required="true"` and visual indicator
- **Status feedback**: Provide text-based error messages, not just color
- **Focus indicators**: Ensure visible focus states for keyboard users
- **Character limits**: Announce maxLength to screen readers via label or description

## Framework-Specific Features

### Integration with Ant Design Ecosystem

#### Form Integration
Seamless integration with Ant Design Form components:
```jsx
<Form>
  <Form.Item
    name="description"
    label="Description"
    rules={[{ required: true, message: 'Please enter a description' }]}
  >
    <TextArea
      rows={4}
      placeholder="Enter description"
      showCount
      maxLength={200}
    />
  </Form.Item>
</Form>
```

When used with Form.Item:
- Automatic validation state management (status prop set automatically)
- Error message display handled by Form.Item
- Required field indicators
- Label association for accessibility

#### ConfigProvider Integration
Respects global configuration:
```jsx
<ConfigProvider
  theme={{
    components: {
      Input: {
        colorBorder: '#d9d9d9',
        borderRadius: 6,
      }
    }
  }}
>
  <TextArea /> {/* Inherits theme configuration */}
</ConfigProvider>
```

#### CSS Variable System
Uses Ant Design's CSS variable system for theming:
- `--ant-color-primary`: Primary brand color
- `--ant-color-error`: Error state color
- `--ant-color-warning`: Warning state color
- `--ant-border-radius`: Border radius
- Runtime theme switching without CSS-in-JS overhead

#### Size Context
Inherits size from parent Form or ConfigProvider:
```jsx
<Form size="large">
  <Form.Item name="notes">
    <TextArea /> {/* Automatically large size */}
  </Form.Item>
</Form>
```

### Advanced Count Feature (v5.10.0+)

Ant Design's `count` prop provides sophisticated character counting unavailable in other frameworks:

#### Emoji-Aware Counting
```jsx
<TextArea
  count={{
    show: true,
    max: 10,
    strategy: (text) => [...new Intl.Segmenter().segment(text)].length
  }}
  placeholder="Emojis count as 1 character"
/>
```

#### Soft Limits with Custom Messages
```jsx
<TextArea
  count={{
    max: 100,
    exceedFormatter: (value, { max }) =>
      `Content too long by ${value.length - max} characters`,
  }}
/>
```

#### Strategy vs MaxLength
- `maxLength`: Hard browser limit (native, truncates)
- `count.strategy`: Custom counting logic (display only, no truncation)
- `count.max`: Soft limit with warning styling (no truncation)

### Resize Observer Integration

Built-in ResizeObserver for automatic height adjustments:
- Detects content changes (typing, paste, external updates)
- Detects container size changes
- Efficient performance with debouncing
- Provides dimensions via `onResize` callback

### TypeScript Support

Full TypeScript definitions:
```typescript
import { TextAreaRef } from 'antd/es/input';

const textAreaRef = useRef<TextAreaRef>(null);

// Strongly typed props
const props: InputProps = {
  autoSize: { minRows: 2, maxRows: 6 },
  status: 'error',
  variant: 'filled',
  showCount: true,
  onResize: (size) => console.log(size.height),
};
```

### Ref Interface
```typescript
interface TextAreaRef {
  focus: (options?: InputFocusOptions) => void;
  blur: () => void;
  resizableTextArea?: RcTextAreaRef['resizableTextArea'];
}
```

## Implementation Notes

### Architecture

#### Component Hierarchy
```
Input.TextArea (Ant Design wrapper)
  └── RcTextArea (rc-textarea library)
      └── HTMLTextAreaElement (native)
```

#### Key Dependencies
- `rc-textarea`: Core textarea implementation with resize functionality
- `@ant-design/cssinjs`: CSS-in-JS system for theming
- `rc-util`: Shared utilities for React components
- ResizeObserver API (browser): For autoSize feature

#### Styling System
- CSS-in-JS with runtime CSS variables
- Shadow DOM-free (uses className-based isolation)
- BEM-like naming convention: `.ant-input`, `.ant-input-status-error`
- Responsive via media queries and container queries

### API Evolution

#### Version History
- **2.x**: `autosize` (lowercase), basic features
- **4.18.0**: Added `showCount` prop
- **4.19.0**: Added `status` prop (error/warning)
- **4.23.0**: Added `showCount.formatter` for custom count display
- **5.10.0+**: Added advanced `count` prop with strategy, max, exceedFormatter
- **5.13.0**: Added `variant` prop, deprecated `bordered`
- **5.16.0**: Enhanced variant support

#### Breaking Changes
- `autosize` → `autoSize` (camelCase)
- `bordered` → `variant` (prop replacement)

### Performance Considerations

#### Auto-Sizing Performance
- ResizeObserver is efficient and non-blocking
- Debounced recalculations prevent layout thrashing
- Minimal reflows with CSS-based sizing

#### Character Counting Performance
- `count.strategy` function called on every change
- For large texts, consider debouncing or memoization
- Standard `showCount` is performant for typical use cases

#### Controlled Component Performance
- Frequent `onChange` calls with large content can impact performance
- Consider debouncing state updates for real-time preview scenarios
- Use `defaultValue` for uncontrolled if full control not needed

### Design Patterns

#### Composition Over Configuration
TextArea extends Input rather than being completely separate, promoting code reuse and consistent API across input types.

#### Progressive Enhancement
Works as standard textarea with optional enhancements (autoSize, count, status), ensuring basic functionality without advanced features.

#### Separation of Concerns
- `rc-textarea`: Core functionality (resize, ref management)
- Ant Design wrapper: Theming, status, integration with Form/ConfigProvider
- Browser: Native textarea behavior (selection, clipboard, IME)

### Known Issues and Limitations

#### GitHub Issues
- **#11624**: TextArea size property had limited support compared to other form elements
- **#18039**: Table with TextArea and fixed columns has autosize issues
- **#9107**: Height calculation errors with autoSize in early versions
- **#33049**: Errors setting height style with showCount
- **#31692**: ARIA accessibility issues with proper labeling
- **#44048**: Request for rows in onResize callback (added in later versions)

#### Browser Limitations
- ResizeObserver not supported in IE11 (requires polyfill)
- Emoji counting varies by browser (use `count.strategy` for consistency)
- Placeholder contrast ratio often fails WCAG standards

#### CSS Limitations
- Fixed height conflicts with autoSize feature
- CSS `resize` property behavior varies slightly across browsers
- Some CSS-in-JS overhead with dynamic theming

## Research Notes

### Documentation Quality
Ant Design provides comprehensive documentation with:
- Interactive demos for each feature
- Complete API reference with TypeScript types
- Migration guides for breaking changes
- Active GitHub repository with issue tracking

### Community Feedback
- Strong ecosystem integration with Form, ConfigProvider
- Advanced `count` feature unique among major UI libraries
- Some historical accessibility concerns (being addressed)
- Active development with regular updates

### Comparison with Standard HTML Textarea
Ant Design TextArea adds:
- Auto-sizing based on content
- Character counting with custom strategies
- Visual status states (error/warning)
- Integration with design system
- Enhanced theming and variants
- Improved developer experience with TypeScript

### Notable Implementation Decisions
- Built on `rc-textarea` for maintainability and code reuse across Ant Design ecosystem
- CSS variables for runtime theming without performance penalty
- Separate `count` and `maxLength` for soft vs hard limits
- ForwardRef pattern for imperative operations (focus, blur)
- Semantic class names for custom styling overrides

### Version Recommendations
- **v5.x**: Latest, best features (advanced count, variant prop, improved accessibility)
- **v4.x**: Stable, mature, good for existing projects
- **v2.x/v3.x**: Legacy, consider upgrading for better features and security

### Testing Observations
Based on issue reports, key test scenarios:
- Auto-sizing with varying content lengths
- Character counting with emojis and multi-byte characters
- Resize behavior in constrained containers (tables, grids)
- Form validation integration
- Accessibility with screen readers
- Cross-browser consistency

### Framework Philosophy
Ant Design emphasizes:
- Enterprise-grade quality and consistency
- Comprehensive form handling
- Strong TypeScript support
- Design system integration
- Accessibility (improving over time)
- Backward compatibility with clear migration paths
