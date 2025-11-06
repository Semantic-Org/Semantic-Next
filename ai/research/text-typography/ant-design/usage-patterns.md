# Ant Design - Typography Usage Patterns

> Last Modified: 2025-11-06

## Component URL
https://4x.ant.design/components/typography
Status: ✅ Working
Version: v4.24.16
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - Extensive documentation with detailed API, interactive features, and practical examples. Clear prop documentation and version tracking for feature additions.

## Component Definition
- **Core purpose**: Display and format text content including headings, body text, lists, and other textual content with semantic HTML and interactive capabilities
- **Mental model**: Compositional typography system with sub-components for different text types (Title, Paragraph, Text, Link) and rich interactive features (copyable, editable, ellipsis)
- **Semantic meaning**: Communicates textual information with proper HTML semantics, type variants for semantic coloring, and interactive text behaviors for enterprise applications

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **Styled**: Via CSS/className only
- **Not Supported**: Pattern not available

## Sub-Component Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Typography.Title | ✅ | Native | Renders heading levels 1-5 via `level` prop (default level 1) |
| Typography.Paragraph | ✅ | Native | Full-width text block container for paragraphs |
| Typography.Text | ✅ | Native | Inline text element with styling options |
| Typography.Link | ✅ | Native | Hyperlink element supporting react-router integration |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size variants | ✅ | Native | Title component supports levels 1-5 (h1-h5) |
| Font weight | ✅ | Native | `strong` prop for bold text (boolean) |
| Text color/type | ✅ | Native | `type` prop: secondary, success, warning, danger (success added v4.6.0) |
| Text alignment | ❌ | Not Supported | No native text alignment prop |
| Text decoration | ✅ | Native | `underline`, `delete` (strikethrough) props (boolean) |
| Text transform | ❌ | Not Supported | No native text transform prop |
| Line height | ❌ | Not Supported | No native line height prop |
| Letter spacing | ❌ | Not Supported | No native letter spacing prop |
| Truncation | ✅ | Native | `ellipsis` prop with extensive configuration options |
| Line clamping | ✅ | Native | `ellipsis.rows` for multi-line truncation (Paragraph only, Text fixed on first ellipsis) |

## Text Style Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Code styling | ✅ | Native | `code` prop for monospace/code appearance (boolean) |
| Mark/Highlight | ✅ | Native | `mark` prop for highlight background (boolean) |
| Strong/Bold | ✅ | Native | `strong` prop (boolean) |
| Italic | ✅ | Native | `italic` prop (boolean, added v4.16.0) |
| Underline | ✅ | Native | `underline` prop (boolean) |
| Delete/Strikethrough | ✅ | Native | `delete` prop (boolean) |
| Keyboard | ✅ | Native | `keyboard` prop for keyboard key styling (boolean, added v4.3.0) |
| Disabled | ✅ | Native | `disabled` prop for disabled appearance (boolean) |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Copyable text | ✅ | Native | `copyable` prop (boolean or config object) with custom icons, tooltips, and copy text |
| Editable text | ✅ | Native | `editable` prop (config object) for inline editing with onChange callback, maxLength, autoSize |
| Selectable | ❌ | Not Supported | No native user selection control |
| Expandable | ✅ | Native | `ellipsis.expandable` shows "Expand" button for truncated text |

## Semantic & Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Semantic HTML | ✅ | Native | Title renders h1-h5, Paragraph renders p, Text renders span, Link renders a |
| Polymorphic rendering | ❌ | Not Supported | No component/as prop for changing element type |
| ARIA attributes | ⚠️ | Partial | Basic accessibility via semantic HTML, no explicit ARIA prop documentation |
| Keyboard navigation | ✅ | Native | Editable text supports keyboard interaction, Enter for edit icon trigger |

## Theming Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Design tokens | ✅ | Native | Integrates with Ant Design token system for colors and sizing |
| CSS variables | ⚠️ | Partial | Uses Ant Design's Less variables/CSS-in-JS system |
| Theme customization | ✅ | Native | Can customize via Ant Design theme configuration |
| Responsive typography | ⚠️ | Partial | Text component requires manual width setting for responsive ellipsis |

## Code Examples

### Basic Title
```tsx
import { Typography } from 'antd';
const { Title } = Typography;

<Title>h1. Ant Design</Title>
<Title level={2}>h2. Ant Design</Title>
<Title level={3}>h3. Ant Design</Title>
<Title level={4}>h4. Ant Design</Title>
<Title level={5}>h5. Ant Design</Title>
```

### Basic Paragraph
```tsx
import { Typography } from 'antd';
const { Paragraph } = Typography;

<Paragraph>
  Supply Sketch and Axure resources to streamline prototyping.
</Paragraph>
```

### Basic Text
```tsx
import { Typography } from 'antd';
const { Text } = Typography;

<Text>Ant Design (default)</Text>
<Text type="secondary">Ant Design (secondary)</Text>
<Text type="success">Ant Design (success)</Text>
<Text type="warning">Ant Design (warning)</Text>
<Text type="danger">Ant Design (danger)</Text>
<Text disabled>Ant Design (disabled)</Text>
```

### With Styling Variants
```tsx
import { Typography } from 'antd';
const { Text } = Typography;

<Text code>code</Text>
<Text mark>highlight</Text>
<Text strong>bold</Text>
<Text italic>italic</Text>
<Text underline>underline</Text>
<Text delete>strikethrough</Text>
<Text keyboard>keyboard</Text>

// Combine multiple styles
<Text strong code>Bold Code</Text>
```

### Interactive Features (Copyable)
```tsx
import { Typography } from 'antd';
const { Paragraph, Text } = Typography;

// Simple copyable
<Paragraph copyable>This is a copyable text.</Paragraph>

// Custom copyable configuration
<Paragraph
  copyable={{
    text: 'Custom copy text',
    icon: [<CopyIcon />, <CopiedIcon />],
    tooltips: ['click here', 'you clicked!!']
  }}
>
  This text has custom copy behavior.
</Paragraph>
```

### Editable Text
```tsx
import { Typography } from 'antd';
import { useState } from 'react';
const { Paragraph } = Typography;

function EditableExample() {
  const [editableStr, setEditableStr] = useState('This is an editable text.');

  return (
    <Paragraph editable={{
      onChange: setEditableStr,
      maxLength: 100,
      autoSize: { minRows: 2, maxRows: 6 },
      triggerType: ['icon', 'text']
    }}>
      {editableStr}
    </Paragraph>
  );
}
```

### Ellipsis with Expandable
```tsx
import { Typography } from 'antd';
const { Paragraph } = Typography;

<Paragraph
  ellipsis={{
    rows: 2,
    expandable: true,
    symbol: 'more',
    suffix: '--Author Name'
  }}
>
  Ant Design, a design language for background applications, is refined by Ant UED Team.
  This is a long paragraph that will be truncated to 2 rows with an expandable button.
  The suffix will be preserved at the end of the ellipsis.
</Paragraph>
```

### Suffix Ellipsis (Middle Ellipsis Pattern)
```tsx
import { Typography } from 'antd';
const { Text } = Typography;

<Text
  style={{ width: 200 }}
  ellipsis={{ suffix: '.txt' }}
>
  /path/to/very/long/filename/that/needs/truncation.txt
</Text>
// Result: /path/to/very/l....txt
```

### Complete Typography Composition
```tsx
import { Typography } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

<Typography>
  <Title level={2}>Guidelines and Resources</Title>
  <Paragraph>
    Supply <Text code>Sketch</Text> and <Text code>Axure</Text>
    resources to <Text mark>streamline prototyping</Text>.
  </Paragraph>
  <Paragraph>
    Try to <Text strong>drag</Text> the elements to the canvas,
    and we will <Text underline>help you</Text> with the rest.
  </Paragraph>
  <Link href="/docs" target="_blank">Learn more</Link>
</Typography>
```

## Notable Features

### Suffix Ellipsis for Middle Truncation
Unique feature that preserves ending content via suffix configuration. Enables "middle ellipsis" patterns perfect for file paths where the extension or ending is more important than the middle characters. Example: `/path/to/very/long/filename....txt`

### Comprehensive Editable Configuration
Editable text supports extensive customization including:
- Custom edit and confirmation icons
- Tooltip messages
- Character limits (maxLength)
- Auto-sizing text areas with min/max rows
- Multiple trigger types (icon, text)
- Full lifecycle callbacks (onStart, onChange, onCancel, onEnd)

### Markdown-like Text Decorations
Multiple text styles can be combined on a single element (e.g., `<Text strong code>`), enabling markdown-like compositions without nested elements. All styles render using semantic HTML and CSS rather than wrapper divs.

### Copyable with Full Customization
The copyable feature goes beyond simple copy-to-clipboard:
- Custom copy text different from displayed text
- Custom copy/copied icons
- Custom tooltip messages for both states
- Integrates seamlessly with all text components

### Type System for Semantic Colors
The `type` prop provides semantic color variants (secondary, success, warning, danger) that integrate with Ant Design's theme system, ensuring consistent color usage across applications.

### Responsive Ellipsis Considerations
Documentation explicitly notes that Text component requires manual width setting for responsive ellipsis behavior, providing clear guidance on implementation requirements.

### Version-Tracked Features
Clear documentation of when features were added:
- `success` type (v4.6.0)
- `keyboard` prop (v4.3.0)
- `italic` prop (v4.16.0)
- `text` editable trigger option (v4.24.0)

## Research Notes

- Ant Design's Typography system is highly compositional with four distinct sub-components for different use cases
- Strong focus on enterprise use cases with interactive features (copyable, editable) that are uncommon in other frameworks
- The ellipsis system is notably sophisticated with expandable, suffix, tooltip, and callback options
- Unlike many frameworks, combines multiple text styles via props rather than nesting components
- No polymorphic rendering (component/as prop) - each sub-component has a fixed HTML element
- Text alignment and transform are missing, likely expected to be handled via CSS className
- The suffix ellipsis feature for middle truncation is unique and practical for file paths/URLs
- Keyboard prop for styling keyboard keys is a thoughtful addition for documentation sites
- Integration with react-router for Link component shows consideration for SPA development
- All interactive features are opt-in via boolean or config object props
- Documentation quality is excellent with clear API tables and version tracking
- Package: antd
- Version: v4.24.16 (v5.x is also available but v4 documentation was analyzed)
- The compositional approach (Typography.Title vs separate components) is consistent with Ant Design's overall API design
- Editable text with inline editing is a standout enterprise feature not commonly found in other UI libraries
- The ability to have different copyable text from displayed text is useful for formatted content
- Emphasis on semantic HTML (h1-h5, p, span, a) over generic divs shows accessibility consideration
- Missing features like text alignment suggest reliance on Ant Design's Layout/Grid for positioning
