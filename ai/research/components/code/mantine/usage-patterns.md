# Code - Mantine Usage Patterns

> **Framework**: Mantine
> **Component**: Code
> **Documentation**: https://mantine.dev/core/code/
> **Research Date**: 2025-11-06

## Component Definition

The Code component in Mantine is a dual-purpose text formatting component designed to display code snippets in both inline and block contexts. By default, it renders an inline `<code>` HTML element for short code references within text. When the `block` prop is provided, it renders a `<pre>` element to display multi-line code blocks with preserved formatting.

**Mental Model**: Code is a presentation component that applies consistent styling to code text. It's not a syntax highlighter - it provides the container and basic styling, while syntax highlighting would be handled by external libraries if needed.

**When to Use**:
- Inline code references within documentation or text (default behavior)
- Multi-line code blocks for examples and demonstrations (`block` variant)
- When you need theme-consistent code styling without full syntax highlighting

## Core Features

### Inline vs Block Display

The component has two fundamental display modes controlled by the `block` prop:

- **Inline Mode** (default): Renders as `<code>` element for inline code references within text
- **Block Mode** (`block` prop): Renders as `<pre>` element for multi-line code blocks with preserved whitespace and line breaks

### Theme-Integrated Styling

Code integrates with Mantine's theming system, allowing:
- Default gray background for code elements
- Custom background colors via the `color` prop
- Theme color references (e.g., "blue.9")
- CSS custom properties (e.g., "var(--mantine-color-blue-light)")
- Text color customization via the `c` prop

### Semantic HTML

The component uses appropriate semantic HTML elements:
- `<code>` for inline code (default)
- `<pre>` for preformatted block code (when `block` is true)

## Props API

### Code Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| block | boolean | false | When true, renders code in a `<pre>` element instead of inline `<code>` |
| color | string | gray | Background color - accepts theme color keys (e.g., "blue.9") or CSS values (e.g., "var(--mantine-color-blue-light)") |
| c | string | undefined | Text color property for customizing the code text color |

**Note**: The Code component likely inherits additional props from Mantine's base component system (Box props, style props, etc.), but these are not explicitly documented in the main Code documentation.

## Usage Patterns

### Pattern 1: Inline Code Reference
**Use case**: Displaying code, function names, or technical terms within regular text flow
**Implementation**: Use the Code component without the `block` prop

```jsx
<Code>React.createElement()</Code>
```

This renders an inline `<code>` element styled consistently with the theme.

### Pattern 2: Block Code Display
**Use case**: Displaying multi-line code examples, snippets, or demonstrations
**Implementation**: Pass the `block` prop to render as a `<pre>` block

```jsx
<Code block>{codeForPreviousDemo}</Code>
```

This preserves whitespace and line breaks for formatted code display.

### Pattern 3: Custom Color Styling
**Use case**: Highlighting specific code blocks or matching code styling to semantic meaning (e.g., error examples in red)
**Implementation**: Use the `color` and `c` props for background and text colors

```jsx
<Code color="blue.9" c="white">React.createElement()</Code>
```

This applies a blue background with white text using Mantine's theme color scale.

### Pattern 4: CSS Custom Properties
**Use case**: Dynamic theming or custom color schemes beyond the default palette
**Implementation**: Pass CSS custom properties to the `color` prop

```jsx
<Code color="var(--mantine-color-blue-light)">React.createElement()</Code>
```

This allows integration with custom CSS variables and design systems.

## Variants and Composition

The Code component has two primary variants:

1. **Inline Variant** (default): Renders as `<code>` element
2. **Block Variant** (`block` prop): Renders as `<pre>` element

The component does not appear to have sub-components or complex composition patterns. It's designed as a simple, single-purpose formatting component.

## Accessibility

The documentation does not explicitly detail accessibility features. However, the component uses semantic HTML elements (`<code>` and `<pre>`), which have inherent accessibility benefits:

- Screen readers recognize code elements as technical content
- Semantic markup provides context about content type
- Preformatted blocks preserve spacing for screen reader users

**Note**: For accessibility best practices, developers should ensure:
- Code blocks have appropriate context (aria-label or surrounding text)
- Syntax highlighting colors have sufficient contrast
- Long code blocks are properly labeled for screen reader users

## Responsive Design

The documentation does not explicitly mention responsive capabilities or breakpoint support. The Code component appears to use standard text styling that would flow responsively with its container.

## Theme Integration

### Mantine Theme System

Code integrates with Mantine's theming system through:

1. **Color Prop**: Accepts theme color keys from Mantine's color palette
   - Example: `color="blue.9"` references the 9th shade of blue from the theme
   - Supports all theme colors (blue, red, green, gray, etc.)

2. **CSS Custom Properties**: Supports Mantine's CSS variable system
   - Example: `color="var(--mantine-color-blue-light)"`
   - Allows dynamic theming and custom color schemes

3. **Default Styling**: Uses gray background by default, consistent with Mantine's design system

### Styles API

The documentation mentions that Code supports the Styles API, which is Mantine's system for customizing component styles. This allows developers to:
- Override default styles
- Apply custom classes
- Use inline styles
- Target specific component parts

**Note**: Specific Styles API selectors for the Code component are not detailed in the main documentation.

## Related Components

The documentation references these related components:

1. **Blockquote**: For displaying quoted text with formatting
2. **Highlight**: For highlighting specific text portions (likely with search/match functionality)

These components serve complementary purposes for text formatting and emphasis within Mantine applications.

## Framework-Specific Features

### Mantine Integration

1. **Version**: Component is part of @mantine/core v8.3.6
2. **Package**: Available via `@mantine/core` npm package
3. **Theme Colors**: Uses Mantine's color scale system (e.g., "blue.9" notation)
4. **Styles API**: Integrates with Mantine's component styling system
5. **Box Props**: Likely inherits props from Mantine's Box component for spacing, sizing, etc.

### Mantine Design Philosophy

The Code component follows Mantine's patterns:
- Simple prop API focused on common use cases
- Theme integration through standardized props
- Semantic HTML foundation
- Minimal configuration for basic usage

## Code Examples

### Basic Inline Code

```jsx
<Code>React.createElement()</Code>
```

Renders inline code with default gray styling.

### Block Code Display

```jsx
<Code block>{codeForPreviousDemo}</Code>
```

Renders multi-line code in a preformatted block.

### Custom Styled Code

```jsx
<Code color="blue.9" c="white">React.createElement()</Code>
```

Renders code with custom background and text colors from the theme.

### CSS Variable Integration

```jsx
<Code color="var(--mantine-color-blue-light)">React.createElement()</Code>
```

Uses CSS custom properties for dynamic theming.

## Notes and Observations

### Simplicity Focus

The Code component is intentionally simple - it handles presentation and styling but does not include syntax highlighting. This design decision:
- Keeps the component lightweight
- Allows developers to choose their preferred syntax highlighting library
- Maintains flexibility for different use cases

### Not a Syntax Highlighter

Unlike some framework code components, Mantine's Code component does not provide:
- Syntax highlighting out of the box
- Language-specific formatting
- Line numbering
- Copy-to-clipboard functionality

Developers needing these features would integrate external libraries like Prism.js or highlight.js alongside the Code component.

### Theme Color Notation

Mantine uses a distinctive color notation pattern:
- `"blue.9"` refers to the 9th shade in the blue color scale
- This is different from traditional CSS color values
- The system provides consistent color palettes across components

### Pre Element Behavior

When using `block` mode, the component renders a `<pre>` element, which:
- Preserves all whitespace and line breaks
- Uses a monospace font by default
- May overflow horizontally if content is too wide
- Typically requires scroll behavior or word-wrap styling for long lines

### Missing Documentation Details

The documentation does not explicitly cover:
- Full list of inherited props from Box or other base components
- Specific Styles API selectors for targeting component parts
- Scroll behavior for long code blocks
- Mobile/responsive behavior patterns
- Keyboard navigation or focus management
- ARIA attributes or accessibility enhancements

These details may be available in more comprehensive Mantine documentation or source code.