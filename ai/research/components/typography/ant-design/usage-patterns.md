# Ant Design - Text / Typography Usage Patterns

## Component URL
https://ant.design/components/typography
Status: ✅ Working
Version: 5.28.1 (Current as of 2025-11-10)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent documentation with detailed API tables, multiple code examples, TypeScript definitions, and extensive feature coverage

## Component Definition
- **Core purpose**: Provides semantic text rendering with rich styling options, interactive features (copy/edit), and content management capabilities for articles, blogs, and documentation
- **Mental model**: Hierarchical text content system with four specialized sub-components (Title, Text, Paragraph, Link) that share common styling and behavior props
- **Semantic meaning**: Communicates textual information with appropriate semantic HTML elements (h1-h5, p, span, a) while providing enhanced UX features like copying, editing, and ellipsis

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Paragraph text | ✅ | Native | `Typography.Paragraph` component renders block-level text with full styling support |
| Headings (h1-h6) | ✅ | Native | `Typography.Title` with `level={1-5}` prop (h1-h5, level 5 requires v4.6.0+) |
| Inline text styles | ✅ | Native | `strong`, `italic`, `underline`, `delete`, `mark`, `code`, `keyboard` boolean props |
| Code/monospace | ✅ | Native | `code={true}` prop applies monospace code styling |
| Links within text | ✅ | Native | `Typography.Link` component (extends anchor with ellipsis support) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Display text | ✅ | Native | `Typography.Title level={1}` for large headlines |
| Body text | ✅ | Native | `Typography.Paragraph` for standard content blocks |
| Caption/small text | ✅ | Composed | Use `Typography.Text` with CSS styling or `type="secondary"` for muted appearance |
| Label text | ✅ | Composed | `Typography.Text` suitable for labels |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled={true}` prop applies disabled styling |
| Muted/secondary | ✅ | Native | `type="secondary"` for lower emphasis text |
| Error/warning | ✅ | Native | `type="danger"` and `type="warning"` props |
| Success | ✅ | Native | `type="success"` prop (added v4.6.0) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Font size options | ✅ | Native | Title levels 1-5 provide semantic size hierarchy; custom sizes via CSS |
| Font weight options | ✅ | Native | `strong={true}` for bold text |
| Color variants | ✅ | Native | `type` prop: `secondary`, `success`, `warning`, `danger` |
| Text alignment | ❌ | CSS-only | Requires custom CSS styling |
| Text truncation | ✅ | Native | `ellipsis` prop with extensive configuration options |
| Line height control | ❌ | CSS-only | No native prop, requires CSS |
| Letter spacing | ❌ | CSS-only | No native prop, requires CSS |
| Text transform | ❌ | CSS-only | No native prop, requires CSS (uppercase, lowercase, etc.) |
| Line clamping | ✅ | Native | `ellipsis={{ rows: number }}` for multi-line truncation |
| Copyable text | ✅ | Native | `copyable` prop with extensive customization (icons, tooltips, async, format) |
| Editable text | ✅ | Native | `editable` prop with inline editing, custom icons, triggers, maxLength |
| Keyboard display | ✅ | Native | `keyboard={true}` prop for keyboard key styling (added v4.3.0) |

## Code Examples

### Basic Usage
```jsx
import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

const App = () => (
  <Typography>
    <Title>Introduction</Title>
    <Paragraph>
      Basic paragraph content demonstrating text composition.
    </Paragraph>
    <Title level={2}>Subheading</Title>
    <Paragraph>
      Additional content with <Text strong>bold text</Text>,
      <Text code>code formatting</Text>, and <Text keyboard>Esc</Text> keys.
    </Paragraph>
    <Paragraph>
      <Link href="/path">Navigation link</Link>
    </Paragraph>
  </Typography>
);

export default App;
```

### Copyable Text
```jsx
import { Typography } from 'antd';
import { SmileOutlined, SmileFilled } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

// Basic copyable
<Paragraph copyable>This is a copyable text.</Paragraph>

// Custom copy text
<Paragraph copyable={{ text: 'Custom copied content' }}>
  Display text (copies different content)
</Paragraph>

// Custom icons and tooltips
<Paragraph
  copyable={{
    icon: [<SmileOutlined />, <SmileFilled />],
    tooltips: ['Click to copy', 'Copied!']
  }}
>
  Custom copy experience
</Paragraph>

// Async copy
<Paragraph
  copyable={{
    text: () => new Promise(resolve =>
      setTimeout(() => resolve('Async content'), 500)
    )
  }}
>
  Async copy operation
</Paragraph>

// HTML format copy
<Paragraph copyable={{ format: 'text/html' }}>
  <strong>HTML</strong> formatted content
</Paragraph>
```

### Editable Text
```jsx
import { Typography } from 'antd';
import { HighlightOutlined, CheckOutlined } from '@ant-design/icons';

const { Paragraph, Title } = Typography;

const [editableStr, setEditableStr] = useState('Editable text');

// Basic editable
<Paragraph editable={{ onChange: setEditableStr }}>
  {editableStr}
</Paragraph>

// Advanced editable with constraints
<Paragraph
  editable={{
    icon: <HighlightOutlined />,
    tooltip: 'Click to edit',
    maxLength: 50,
    autoSize: { minRows: 2, maxRows: 6 },
    triggerType: ['icon', 'text'],
    enterIcon: <CheckOutlined />,
    onChange: setEditableStr
  }}
>
  {editableStr}
</Paragraph>

// Editable title
<Title level={2} editable={{ onChange: setEditableStr }}>
  {editableStr}
</Title>
```

### Ellipsis / Text Truncation
```jsx
import { Typography } from 'antd';

const { Paragraph, Text } = Typography;

// Simple single-line ellipsis
<Paragraph ellipsis>
  Very long text that will be truncated with ellipsis when it overflows the container width.
</Paragraph>

// Multi-line with expand
<Paragraph
  ellipsis={{
    rows: 2,
    expandable: true,
    symbol: 'more'
  }}
>
  Long paragraph content that will be limited to 2 rows with an expandable link to show more content.
</Paragraph>

// Collapsible (v5.16.0+)
<Paragraph
  ellipsis={{
    rows: 3,
    expandable: 'collapsible',
    symbol: (expanded) => expanded ? 'Show less' : 'Show more',
    onExpand: (e, { expanded }) => console.log('Expanded:', expanded)
  }}
>
  Content that can be expanded and collapsed again.
</Paragraph>

// With tooltip
<Text
  style={{ width: 200 }}
  ellipsis={{ tooltip: 'Full text content appears in tooltip' }}
>
  Text that gets truncated
</Text>

// Controlled expansion
<Paragraph
  ellipsis={{
    rows: 2,
    expandable: true,
    expanded: isExpanded,
    onExpand: (e, { expanded }) => setIsExpanded(expanded)
  }}
>
  Controlled expandable content
</Paragraph>
```

### Text Styling Combinations
```jsx
import { Typography } from 'antd';

const { Text } = Typography;

// Inline style modifiers
<Text strong>Bold text</Text>
<Text italic>Italic text</Text>
<Text underline>Underlined text</Text>
<Text delete>Deleted text</Text>
<Text mark>Highlighted text</Text>
<Text code>Inline code</Text>
<Text keyboard>Ctrl+C</Text>

// Type variants (colors)
<Text type="secondary">Secondary text</Text>
<Text type="success">Success text</Text>
<Text type="warning">Warning text</Text>
<Text type="danger">Danger text</Text>

// Combinations
<Text strong type="danger">Bold danger text</Text>
<Text code type="secondary">Secondary code</Text>
<Text mark strong>Bold highlighted text</Text>

// Disabled state
<Text disabled>Disabled text content</Text>
```

## Notable Features

- **Comprehensive Ellipsis System**: One of the most sophisticated ellipsis implementations with multi-line support, expand/collapse (including bidirectional as of v5.16.0), custom symbols that can be render functions, tooltip integration, and controlled state
- **Advanced Copyable**: Supports async copy operations, custom MIME types (text/plain, text/html), custom icons and tooltips, and tabIndex control for accessibility
- **Inline Editing**: Full-featured inline editing with controlled state, custom triggers (icon/text/both), maxLength constraints, autoSize textareas, and lifecycle hooks (onStart, onChange, onCancel, onEnd)
- **Semantic Type System**: Props map directly to semantic HTML elements (Title → h1-h5, Paragraph → p, Text → span, Link → a)
- **Rich Boolean Modifiers**: Extensive inline styling through boolean props (strong, italic, underline, delete, mark, code, keyboard)
- **Type-based Coloring**: Built-in semantic color variants (secondary, success, warning, danger) for consistent UI communication
- **Keyboard Component**: Dedicated `keyboard` prop for styling keyboard shortcuts (added v4.3.0)
- **React Router Integration**: Documented pattern for integrating Typography.Link with react-router's Link component
- **Component Token System**: Design token support for theme customization
- **TypeScript Support**: Comprehensive TypeScript definitions with generic component props extending native HTML element attributes

## API Reference Summary

### Typography.Text Props
- **Styling**: `code`, `delete`, `disabled`, `keyboard`, `mark`, `strong`, `italic`, `underline`
- **Interactive**: `copyable`, `editable`, `ellipsis` (limited - no expandable/rows/onExpand)
- **Semantic**: `type` (secondary/success/warning/danger)
- **Events**: `onClick`

### Typography.Title Props
- **Structure**: `level` (1-5, maps to h1-h5)
- **Styling**: `code`, `delete`, `disabled`, `mark`, `italic`, `underline`
- **Interactive**: `copyable`, `editable`, `ellipsis`
- **Semantic**: `type` (secondary/success/warning/danger)
- **Events**: `onClick`

### Typography.Paragraph Props
- **Styling**: `code`, `delete`, `disabled`, `mark`, `strong`, `italic`, `underline`
- **Interactive**: `copyable`, `editable`, `ellipsis`
- **Semantic**: `type` (secondary/success/warning/danger)
- **Events**: `onClick`

### Typography.Link Props
- Extends Typography.Text
- Additional: standard anchor attributes (`href`, `target`, etc.)
- Simplified: `ellipsis` as boolean only (no object config)
- Security: Auto-adds `rel="noopener noreferrer"` when `target="_blank"`

### Copyable Config Object
```typescript
{
  text: string | (() => string | Promise<string>),
  onCopy: (event) => void,
  icon: [ReactNode, ReactNode],  // [copyIcon, copiedIcon]
  tooltips: false | [ReactNode, ReactNode],  // false or [beforeCopy, afterCopy]
  format: 'text/plain' | 'text/html',
  tabIndex: number
}
```

### Editable Config Object
```typescript
{
  icon: ReactNode,
  tooltip: ReactNode | false,
  editing: boolean,
  maxLength: number,
  autoSize: boolean | { minRows: number, maxRows: number },
  text: string,
  onChange: (value: string) => void,
  onCancel: () => void,
  onStart: () => void,
  onEnd: () => void,
  triggerType: ('icon' | 'text')[],
  enterIcon: ReactNode,
  tabIndex: number
}
```

### Ellipsis Config Object
```typescript
{
  rows: number,
  expandable: boolean | 'collapsible',  // 'collapsible' added v5.16.0
  suffix: string,
  symbol: ReactNode | ((expanded: boolean) => ReactNode),
  tooltip: ReactNode | TooltipProps,
  defaultExpanded: boolean,  // v5.16.0+
  expanded: boolean,  // v5.16.0+
  onExpand: (event, { expanded: boolean }) => void,
  onEllipsis: (ellipsis: boolean) => void
}
```

## Research Notes

- **Access Method**: The live documentation site is client-side rendered (React), requiring access to raw GitHub markdown and TypeScript source files for comprehensive research
- **Version Progression**: Many features have version annotations showing active development (keyboard in v4.3.0, success type in v4.6.0, collapsible ellipsis in v5.16.0)
- **Design Philosophy**: Component follows Ant Design's approach of providing boolean props for common patterns with object configurations for advanced use cases
- **TypeScript Architecture**: Uses generic `BlockProps<C>` interface extended by all subcomponents, with component-specific prop restrictions (e.g., Text excludes rows/expandable from ellipsis)
- **HTML Semantics**: Strong emphasis on proper semantic HTML (Title uses h1-h5, Paragraph uses div/p, Text uses span, Link uses anchor)
- **Accessibility**: Includes tabIndex props on interactive elements (copyable, editable) for keyboard navigation control
- **Feature Completeness**: Exceptionally comprehensive typography system with features rarely found together (async copy, bidirectional expand/collapse, render function symbols, controlled ellipsis state)
