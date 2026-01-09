# Code - HeroUI Usage Patterns

> **Framework**: HeroUI (NextUI)
> **Component**: Code
> **Documentation**: https://www.heroui.com/docs/components/code
> **Research Date**: 2025-11-05

## Component Definition

The HeroUI Code component is a lightweight, inline code display element designed to present code snippets within text content. It is purpose-built for displaying short code fragments inline with regular text, such as command-line instructions, variable names, function calls, or configuration values.

**Purpose**: Display inline code snippets with semantic HTML and visual styling that distinguishes code from surrounding text.

**Mental Model**: Think of it as a styled `<code>` element that integrates seamlessly with HeroUI's design system. It's not a code block or syntax highlighter—it's for short, inline references within prose.

**When to Use**:
- Inline code references within documentation
- Command-line instructions (e.g., `npm install package`)
- Variable or function names in technical text
- Configuration values or parameters
- File paths or URLs in text
- Short code snippets that fit on a single line

**When NOT to Use**:
- Multi-line code blocks (use a code block component instead)
- Syntax-highlighted code examples (requires a different component)
- Interactive code editors or playgrounds
- Large code samples requiring scrolling

---

## Core Features

### Inline Code Display
The Code component renders content as inline code with semantic HTML structure. It applies monospace font styling and visual treatment to distinguish code from surrounding text while maintaining inline flow.

### Visual Variants
Six color schemes align with HeroUI's semantic color system:
- **default**: Neutral, general-purpose code display
- **primary**: Emphasizes important code references
- **secondary**: De-emphasized or secondary code references
- **success**: Positive code examples or successful operations
- **warning**: Code requiring caution or attention
- **danger**: Deprecated code, errors, or dangerous operations

### Size Flexibility
Three size variants provide hierarchy and emphasis:
- **sm** (small): Default size for inline code
- **md** (medium): Slightly larger for emphasis
- **lg** (large): Maximum emphasis for critical code references

### Border Radius Control
Border radius customization for design consistency:
- **none**: Sharp corners, no rounding
- **sm**: Subtle rounding (default)
- **md**: Moderate rounding
- **lg**: Significant rounding
- **full**: Fully rounded ends (pill shape)

### Design System Integration
Full integration with HeroUI's theming system including automatic dark mode support, consistent spacing, and typography that matches the design system's monospace font stack.

---

## Props API

### Code Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | The code content to display |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` | Visual sizing of the code element |
| `color` | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | Semantic color variant |
| `radius` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"sm"` | Border radius styling |

**No other props documented.** The component appears to have a minimal API focused on inline code display.

---

## Usage Patterns

### Pattern 1: Basic Inline Code
**Use case**: Display simple code snippets inline with text
**Implementation**: Wrap code content in the Code component with default props

```jsx
import { Code } from "@heroui/react";

<p>
  To install the package, run <Code>npm install @heroui/react</Code> in your terminal.
</p>
```

### Pattern 2: Emphasized Code with Colors
**Use case**: Use semantic colors to convey meaning or emphasis
**Implementation**: Apply color prop to indicate status or importance

```jsx
import { Code } from "@heroui/react";

<div>
  <p>Success: <Code color="success">npm install</Code> completed</p>
  <p>Warning: <Code color="warning">deprecated-function()</Code> will be removed</p>
  <p>Error: <Code color="danger">undefined variable</Code> detected</p>
  <p>Primary: <Code color="primary">apiKey</Code> is required</p>
</div>
```

### Pattern 3: Size Variants for Hierarchy
**Use case**: Create visual hierarchy in documentation with different code sizes
**Implementation**: Use size prop to emphasize or de-emphasize code references

```jsx
import { Code } from "@heroui/react";

<div>
  <p>Main command: <Code size="lg">npm start</Code></p>
  <p>Optional flag: <Code size="md">--verbose</Code></p>
  <p>Default behavior uses <Code size="sm">port 3000</Code></p>
</div>
```

### Pattern 4: Border Radius Styling
**Use case**: Match code styling to design system's border radius conventions
**Implementation**: Adjust radius prop to align with overall design language

```jsx
import { Code } from "@heroui/react";

<div>
  <Code radius="none">Sharp corners</Code>
  <Code radius="sm">Subtle rounding</Code>
  <Code radius="md">Moderate rounding</Code>
  <Code radius="lg">Large rounding</Code>
  <Code radius="full">Pill shape</Code>
</div>
```

### Pattern 5: Command-Line Instructions
**Use case**: Display terminal commands in documentation
**Implementation**: Default styling works well for CLI commands

```jsx
import { Code } from "@heroui/react";

<div className="space-y-2">
  <p>Install dependencies: <Code>npm install</Code></p>
  <p>Start development server: <Code>npm run dev</Code></p>
  <p>Build for production: <Code>npm run build</Code></p>
</div>
```

### Pattern 6: Configuration Values
**Use case**: Highlight configuration parameters or environment variables
**Implementation**: Use semantic colors to indicate configuration importance

```jsx
import { Code } from "@heroui/react";

<div>
  <p>Set the <Code color="primary">API_URL</Code> environment variable</p>
  <p>Default timeout is <Code>5000ms</Code></p>
  <p>Required: <Code color="danger">SECRET_KEY</Code></p>
</div>
```

### Pattern 7: Inline Code in Lists
**Use case**: Technical documentation with code references in list items
**Implementation**: Inline Code components within list structures

```jsx
import { Code } from "@heroui/react";

<ul>
  <li>Import the component: <Code>import {'{Button}'} from "@heroui/react"</Code></li>
  <li>Add the <Code>color</Code> prop for styling</li>
  <li>Use <Code>size="lg"</Code> for larger buttons</li>
</ul>
```

---

## Variants and Composition

### Color Variants
Six semantic color schemes:
- **default**: Neutral gray background, suitable for general code
- **primary**: Brand color, draws attention to important code
- **secondary**: Muted variant for secondary information
- **success**: Green tones for successful operations or correct examples
- **warning**: Yellow/orange tones for code requiring attention
- **danger**: Red tones for errors, deprecated code, or dangerous operations

### Size Variants
Three size options create visual hierarchy:
- **sm**: Compact, default size for inline code
- **md**: Medium emphasis, slightly larger
- **lg**: High emphasis, largest inline size

### Radius Variants
Five border radius options:
- **none**: No rounding (0 radius)
- **sm**: Small rounding (default)
- **md**: Medium rounding
- **lg**: Large rounding
- **full**: Fully rounded (pill-shaped)

**No sub-components or composition patterns documented.** The Code component is a single, self-contained element.

---

## Accessibility

**Semantic HTML**: The Code component likely renders as a `<code>` element, providing semantic meaning for assistive technologies.

**Screen Reader Considerations**: Code content is announced as-is by screen readers. For complex code, consider providing additional context or descriptions.

**Keyboard Navigation**: As an inline element, Code does not receive focus or require keyboard interaction.

**ARIA Support**: No specific ARIA attributes documented. The semantic HTML `<code>` element provides baseline accessibility.

**Best Practices**:
- Provide context for code snippets in surrounding text
- Avoid relying on color alone to convey meaning (use text labels)
- Keep code snippets short and readable
- Consider screen reader users when using technical jargon

---

## Responsive Design

No responsive behavior is documented. The Code component appears to flow inline with text, inheriting responsive text behavior from parent elements.

**Responsive Considerations**:
- Long code snippets may wrap or break awkwardly on narrow screens
- Consider using smaller size variants on mobile devices
- Test code readability at different viewport sizes

---

## Theme Integration

### Dark Mode Support
HeroUI's Code component automatically adapts to dark mode theming. Background colors, text colors, and borders adjust based on the active theme.

### Design System Integration
The component integrates with HeroUI's:
- Color system (semantic color tokens)
- Typography system (monospace font stack)
- Spacing system (consistent padding)
- Border radius system (radius tokens)

### Customization
**ClassNames API**: Not explicitly documented, but HeroUI components typically support className overrides.

**CSS Variables**: Likely supports theme customization through HeroUI's CSS custom properties.

**Tailwind CSS**: HeroUI is built with Tailwind CSS, suggesting the component can be styled with Tailwind utilities.

---

## Related Components

### Code Block Components
For multi-line code display, HeroUI or adjacent libraries may provide:
- Code Block (multi-line code with syntax highlighting)
- Pre (preformatted text blocks)

### Typography Components
Related text display components:
- Text (general text display)
- Kbd (keyboard key display)
- Snippet (code with copy functionality)

### Documentation Components
Components often used alongside Code in documentation:
- Card (grouping related code examples)
- Divider (separating code sections)
- Tabs (organizing multiple code examples)

---

## Framework-Specific Features

### React Integration
- Uses React children pattern for content
- Supports ReactNode for flexible content (text, components, etc.)
- Integrates with React rendering lifecycle

### Next.js Compatibility
The documentation mentions "Server Components" support, indicating the Code component can be used in Next.js server components without client-side JavaScript.

### HeroUI Ecosystem
- Follows HeroUI's consistent API patterns (size, color, radius props)
- Integrates with HeroUI's theme provider
- Shares design tokens with other HeroUI components

### TypeScript Support
Component is written in TypeScript with type definitions for all props.

---

## Code Examples

### Example 1: Basic Usage
```jsx
import { Code } from "@heroui/react";

export default function App() {
  return <Code>npm install @heroui/react</Code>;
}
```

### Example 2: Color Variants
```jsx
import { Code } from "@heroui/react";

export default function ColorVariants() {
  return (
    <div className="space-y-4">
      <p><Code color="default">default color</Code></p>
      <p><Code color="primary">primary color</Code></p>
      <p><Code color="secondary">secondary color</Code></p>
      <p><Code color="success">success color</Code></p>
      <p><Code color="warning">warning color</Code></p>
      <p><Code color="danger">danger color</Code></p>
    </div>
  );
}
```

### Example 3: Size Variants
```jsx
import { Code } from "@heroui/react";

export default function SizeVariants() {
  return (
    <div className="space-y-4">
      <p>Small: <Code size="sm">npm install</Code></p>
      <p>Medium: <Code size="md">npm install</Code></p>
      <p>Large: <Code size="lg">npm install</Code></p>
    </div>
  );
}
```

### Example 4: Radius Variants
```jsx
import { Code } from "@heroui/react";

export default function RadiusVariants() {
  return (
    <div className="space-y-4">
      <p><Code radius="none">No radius</Code></p>
      <p><Code radius="sm">Small radius</Code></p>
      <p><Code radius="md">Medium radius</Code></p>
      <p><Code radius="lg">Large radius</Code></p>
      <p><Code radius="full">Full radius</Code></p>
    </div>
  );
}
```

### Example 5: Documentation Pattern
```jsx
import { Code } from "@heroui/react";

export default function DocumentationExample() {
  return (
    <div className="prose">
      <h2>Installation</h2>
      <p>
        To get started, install the package using <Code>npm install @heroui/react</Code>.
      </p>

      <h3>Usage</h3>
      <p>
        Import the component: <Code color="primary">import {'{Code}'} from "@heroui/react"</Code>
      </p>

      <h3>Props</h3>
      <ul>
        <li><Code>size</Code>: Controls the size of the code element</li>
        <li><Code>color</Code>: Sets the color variant</li>
        <li><Code>radius</Code>: Adjusts border radius</li>
      </ul>
    </div>
  );
}
```

### Example 6: Technical Reference
```jsx
import { Code } from "@heroui/react";

export default function TechnicalReference() {
  return (
    <div>
      <p>
        Call the <Code color="primary">getUserData()</Code> function to retrieve user information.
      </p>
      <p>
        The response includes <Code>userId</Code>, <Code>email</Code>, and <Code>createdAt</Code> fields.
      </p>
      <p>
        Warning: <Code color="warning">accessToken</Code> expires after 1 hour.
      </p>
      <p>
        Error: <Code color="danger">Invalid API key</Code>
      </p>
    </div>
  );
}
```

---

## Notes and Observations

### Minimal API Design
The Code component has a deliberately minimal API with only four props (children, size, color, radius). This simplicity makes it easy to learn and use but limits advanced functionality.

### No Syntax Highlighting
The component does not provide syntax highlighting capabilities. It's designed for simple inline code display, not for presenting formatted code examples with language-specific coloring.

### No Copy Functionality
Unlike some code components, there is no built-in copy-to-clipboard functionality. For this feature, developers would need to use a separate Snippet component or implement custom copy behavior.

### No Line Numbers
The component is inline-only and does not support line numbers, which are typically associated with multi-line code blocks.

### Server Component Support
The documentation explicitly mentions server component support, making it suitable for Next.js applications using the App Router and React Server Components.

### Installation Flexibility
HeroUI provides multiple installation methods including a CLI tool (`npx heroui-cli@latest add code`) for granular package installation, which is useful for bundle size optimization.

### Semantic HTML Foundation
By using semantic `<code>` elements, the component provides baseline accessibility without requiring additional ARIA attributes.

### Design System Consistency
The props API (size, color, radius) is consistent with other HeroUI components, making the learning curve minimal for developers already familiar with the framework.

### Inline Flow Behavior
As an inline element, the Code component flows naturally with surrounding text, making it ideal for documentation and technical writing where code references are interspersed with prose.

### Limited Customization Documentation
While the component likely supports advanced customization through classNames or style props (common in HeroUI), these options are not documented in the official documentation.

### Use Case Clarity
The component's documentation and design make its intended use case clear: inline code references within text, not standalone code blocks or syntax-highlighted examples.
