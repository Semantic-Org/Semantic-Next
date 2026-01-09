# Code - Chakra UI Usage Patterns

> **Framework**: Chakra UI
> **Component**: Code
> **Documentation**: https://chakra-ui.com/docs/components/code
> **Research Date**: 2025-11-06

## Component Definition

The Code component in Chakra UI is a typography element designed to display inline code within flowing text content. It provides semantic HTML markup using the `<code>` element for representing short code snippets, variable names, function references, and other programming-related text that should be visually distinguished from regular content.

**Purpose**: Render inline code references within normal text flow with appropriate semantic meaning and visual styling.

**Mental Model**: Think of Code as a semantic text wrapper specifically for programming-related content that appears inline with regular text, not for multi-line code blocks.

**When to Use**:
- Displaying variable names or function names within documentation text
- Showing short code snippets inline with explanatory text
- Marking up technical terms or syntax elements
- Referencing commands, API methods, or configuration values in prose

**When NOT to Use**:
- For multi-line code examples (use Code Block component instead)
- For keyboard shortcuts or key combinations (use Kbd component instead)
- For non-code technical content that just needs visual emphasis

## Core Features

### Semantic HTML Rendering
The component renders a semantic `<code>` HTML element, providing proper meaning to assistive technologies and search engines for code-related content.

### Inline Display
Renders as an inline-flex element, allowing it to flow naturally within text content while maintaining consistent spacing and alignment.

### Automatic Typography Styling
Applies monospace font family automatically through Chakra's design token system:
- Uses system monospace font stack: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New
- Inherits appropriate font sizing from Chakra's typography scale
- Maintains consistent line-height for inline placement

### Visual Differentiation
Provides subtle visual styling to distinguish code from regular text:
- Subtle background color (color-palette-subtle)
- Foreground text color (color-palette-fg)
- Muted border styling
- Rounded corners (l2 radius token)
- Appropriate inline and block padding

### Theme Integration
Fully integrated with Chakra's theming system:
- Responds to light/dark mode automatically
- Supports color palette customization
- Uses design tokens for consistent styling
- Inherits from global typography configuration

## Props API

### Code Props

The Code component accepts standard HTML `<code>` element attributes plus Chakra's styling props system.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | - | The code content to display |
| colorPalette | `string` | `"teal"` | Color palette variant from Chakra's color system |
| as | `React.ElementType` | `"code"` | HTML element or React component to render |

**Note**: The component also supports all standard Chakra style props (margin, padding, fontSize, etc.) and standard HTML attributes for the `<code>` element.

### Inherited Style Props

As a Chakra component, Code inherits the full Chakra style props API:

- **Layout**: display, width, height, minW, maxW, etc.
- **Color**: color, bg, bgColor, borderColor, etc.
- **Typography**: fontSize, fontWeight, lineHeight, letterSpacing, etc.
- **Space**: m, mt, mr, mb, ml, p, pt, pr, pb, pl, etc.
- **Flexbox**: alignItems, justifyContent, flexDir, etc.
- **Border**: border, borderWidth, borderStyle, borderRadius, etc.

## Usage Patterns

### Pattern 1: Basic Inline Code
**Use case**: Display code within normal text flow for documentation or explanatory content

**Implementation**: Wrap code content with the Code component inline with text

```jsx
import { Code } from "@chakra-ui/react"

<Text>
  Use the <Code>console.log()</Code> function to output debug information.
</Text>
```

### Pattern 2: Variable Names in Documentation
**Use case**: Highlight variable names, parameter names, or configuration keys in technical documentation

**Implementation**: Use Code component to distinguish technical identifiers from prose

```jsx
<Text>
  Set the <Code>apiKey</Code> property in your configuration file.
</Text>
```

### Pattern 3: Color Palette Customization
**Use case**: Match code styling to different semantic meanings or branding requirements

**Implementation**: Use the colorPalette prop to change the visual theme

```jsx
<Code colorPalette="blue">npm install</Code>
<Code colorPalette="green">success</Code>
<Code colorPalette="red">error</Code>
```

### Pattern 4: Multiple Code References in Sequence
**Use case**: Reference multiple code elements within the same sentence or paragraph

**Implementation**: Use multiple Code components inline as needed

```jsx
<Text>
  The <Code>useState</Code> and <Code>useEffect</Code> hooks are essential
  for managing state and side effects in React.
</Text>
```

### Pattern 5: Custom Styling with Style Props
**Use case**: Apply additional custom styling beyond the default theme

**Implementation**: Use Chakra's style props for one-off customizations

```jsx
<Code fontSize="lg" px="4" py="2" borderRadius="md">
  custom styled code
</Code>
```

## Variants and Composition

### Color Palette Variants
Chakra UI's Code component supports color customization through the `colorPalette` prop, which integrates with Chakra's color system. The default palette is "teal" but can be changed to any color from Chakra's color palette (blue, green, red, purple, gray, etc.).

### Composition with Typography Components
The Code component is designed to work seamlessly alongside other Chakra typography components:

- **Text**: Primary container for mixed content including inline code
- **Heading**: Section headings that may reference code elements
- **Blockquote**: Quoted text that may include code references
- **List**: List items containing code examples or references

### Composition Pattern Example
```jsx
<Box>
  <Heading>API Reference</Heading>
  <Text>
    The <Code>fetchData</Code> function accepts two parameters:
  </Text>
  <UnorderedList>
    <ListItem><Code>url</Code> - The endpoint URL</ListItem>
    <ListItem><Code>options</Code> - Request configuration</ListItem>
  </UnorderedList>
</Box>
```

## Accessibility

### Semantic HTML
The component renders a native `<code>` HTML element, which provides inherent semantic meaning that assistive technologies recognize as code or computer-related content.

### Screen Reader Support
Screen readers will announce the content as code, helping users understand the context and purpose of the text. The semantic markup provides clear boundaries between regular prose and technical content.

### Keyboard Navigation
As an inline element, the Code component does not interfere with normal keyboard navigation and text selection flows. Content within Code elements remains selectable and copyable.

### Color Contrast
The default styling provides appropriate color contrast ratios for readability. When using custom color palettes, ensure sufficient contrast between the background and text colors to meet WCAG accessibility guidelines.

## Responsive Design

### Font Size Inheritance
The Code component inherits font sizes from its parent context, making it responsive to the typography scale defined at higher levels. This ensures consistent scaling across breakpoints when used within responsive text components.

### Style Props for Breakpoints
Chakra's responsive style props can be applied to customize Code appearance across breakpoints:

```jsx
<Code fontSize={{ base: "sm", md: "md", lg: "lg" }}>
  responsive code
</Code>
```

### Inline Flow Behavior
The inline-flex display ensures the component adapts naturally to text reflow at different viewport sizes, maintaining proper spacing and alignment as text wraps.

## Theme Integration

### Design Token System
The Code component leverages Chakra's design token system through CSS custom properties:

- `--chakra-fonts-mono`: Monospace font family
- `--chakra-colors-color-palette-subtle`: Background color
- `--chakra-colors-color-palette-fg`: Foreground text color
- `--chakra-radii-l2`: Border radius

### Theme Customization
Code styling can be customized globally through the Chakra theme configuration. The component uses a recipe-based theming system located in `code.ts`.

**Global Theme Customization Pattern**:
```typescript
const theme = extendTheme({
  components: {
    Code: {
      baseStyle: {
        fontFamily: "mono",
        fontSize: "sm",
        px: "0.2em",
        py: "0.2em",
        borderRadius: "sm",
      },
      variants: {
        solid: {
          bg: "gray.100",
          color: "gray.800",
        },
        outline: {
          border: "1px solid",
          borderColor: "gray.200",
        },
      },
      defaultProps: {
        variant: "solid",
        colorPalette: "teal",
      },
    },
  },
})
```

### Light/Dark Mode Support
The component automatically responds to Chakra's color mode system, adjusting background and text colors appropriately for light and dark themes without requiring additional configuration.

## Related Components

### Code Block (Beta)
For multi-line code examples with syntax highlighting and line numbers. Use Code Block instead of Code when displaying larger code snippets that span multiple lines or require language-specific syntax highlighting.

**When to choose Code Block over Code**:
- Multi-line code examples
- Syntax highlighting needed
- Line numbering required
- Copy-to-clipboard functionality desired

### Kbd
For displaying keyboard shortcuts and key combinations. While visually similar, Kbd is semantically distinct and uses the `<kbd>` HTML element.

**When to choose Kbd over Code**:
- Keyboard shortcuts (e.g., "Press <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>")
- Key combinations in UI instructions
- Physical keyboard input representation

### Text
General text component for body copy and mixed content. Text serves as the typical container for inline Code components.

### Mark
For highlighting text with a background color to draw attention. While Mark provides visual emphasis, Code provides semantic meaning for programming-related content.

### Pre
For preformatted text blocks that preserve whitespace and line breaks. Often used in combination with Code for multi-line code display (though Code Block is preferred in modern Chakra).

## Framework-Specific Features

### Chakra Style Props System
The Code component fully integrates with Chakra's style props system, allowing direct prop-based styling without needing className or external CSS:

```jsx
<Code
  fontSize="lg"
  fontWeight="bold"
  color="blue.600"
  bg="blue.50"
  px={3}
  py={1}
  borderRadius="md"
>
  styled code
</Code>
```

### CSS-in-JS Integration
Built on Chakra's CSS-in-JS engine, the component benefits from:
- Automatic vendor prefixing
- Type-safe style props with TypeScript
- Dynamic style generation based on theme
- Runtime style calculation for responsive values

### Color Mode Awareness
Automatically adapts to Chakra's color mode without manual configuration:

```jsx
// Automatically adjusts for light/dark mode
<Code>theme-aware code</Code>
```

### Recipe-Based Theming
Uses Chakra's recipe system for component variants, allowing centralized theme configuration and consistent styling patterns across the application.

### Design Token Integration
Deep integration with Chakra's semantic token system ensures consistency with the overall design system and enables theme switching without component changes.

## Code Examples

### Basic Usage
```jsx
import { Code } from "@chakra-ui/react"

<Text>
  The <Code>console.log("Hello, world!")</Code> function outputs to the console.
</Text>
```

### With Color Palette
```jsx
<Stack>
  <Code colorPalette="teal">default teal</Code>
  <Code colorPalette="blue">blue variant</Code>
  <Code colorPalette="green">green variant</Code>
  <Code colorPalette="red">red variant</Code>
</Stack>
```

### In Documentation Context
```jsx
<Box>
  <Heading size="md">Installation</Heading>
  <Text mb={4}>
    Install the package using <Code>npm install @chakra-ui/react</Code>
    or <Code>yarn add @chakra-ui/react</Code>.
  </Text>

  <Heading size="md">Usage</Heading>
  <Text>
    Import the <Code>ChakraProvider</Code> and wrap your application:
  </Text>
</Box>
```

### With Custom Styling
```jsx
<Code
  fontSize="md"
  fontWeight="semibold"
  px={4}
  py={2}
  borderRadius="lg"
  border="1px solid"
  borderColor="gray.300"
>
  custom.styled.code
</Code>
```

### In Lists
```jsx
<UnorderedList spacing={2}>
  <ListItem>
    Use <Code>map()</Code> to transform arrays
  </ListItem>
  <ListItem>
    Use <Code>filter()</Code> to select elements
  </ListItem>
  <ListItem>
    Use <Code>reduce()</Code> to aggregate values
  </ListItem>
</UnorderedList>
```

## Notes and Observations

### Distinction from Code Block
It's important to note that Chakra UI maintains a clear distinction between the Code component (for inline code) and Code Block component (for multi-line code examples). This follows web standards best practices for semantic HTML usage.

### Limited Props Documentation
The official documentation provides limited explicit props table information, relying heavily on the inherited Chakra style props system. This is consistent with Chakra's approach of providing a consistent prop API across all components.

### Default Color Choice
The default "teal" color palette is a design decision that provides good contrast and visual distinction without being overly prominent. This can be overridden globally through theme configuration or per-instance with the colorPalette prop.

### Monospace Font Stack
The component uses a comprehensive monospace font stack that prioritizes system fonts for better performance and native feel across different operating systems.

### Inline-Flex Display
The use of inline-flex rather than inline display suggests intentional layout control for consistent alignment and spacing, particularly when code elements contain unusual characters or mixed content.

### Recipe-Based Architecture
Chakra UI v3 uses a recipe-based theming architecture (referenced in the source code location), indicating this is likely using the newer Panda CSS or similar CSS-in-JS approach rather than emotion/styled-components used in earlier Chakra versions.

### Source Code Organization
The component source is located at `packages/react/src/components/code`, indicating a monorepo structure with clear component organization. The recipe file `code.ts` suggests a separation of theming logic from component logic.

### Minimal API Surface
The component maintains a simple, focused API surface, adhering to the single responsibility principle by only handling inline code display without feature creep into areas like syntax highlighting or line numbering.
