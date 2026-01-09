# Chakra UI - Heading Usage Patterns

## Component URL
https://chakra-ui.com/docs/components/heading
Status: ✅ Working
Version: v3.x (current), v2.x (legacy)
Last Verified: 2025-11-05

## Documentation Quality
The Chakra UI Heading component documentation is clear and concise, providing essential information about the component's purpose, props, and usage patterns. The documentation includes practical code examples and demonstrates the relationship between visual appearance (size) and semantic HTML (as prop). However, it is relatively minimal compared to more complex interactive components, which is appropriate given the Heading component's simplicity. The migration guide provides context for differences between v2 and v3, though the Heading component itself saw minimal API changes between versions.

**Strengths:**
- Clear separation between semantic meaning and visual presentation
- Practical size variant examples with responsive behavior
- Accessibility considerations documented
- Multiple version documentation available (v0, v1, v2, v3)

**Areas for improvement:**
- Limited advanced customization examples
- Minimal theming examples specific to Heading
- Could benefit from more composition pattern examples
- Limited discussion of when to use Heading vs Text with specific styles

## Component Definition
- **Core purpose**: The Heading component is used to render semantic HTML heading elements with consistent styling, visual hierarchy, and responsive behavior. It provides a type-safe way to create headings that automatically adapt to different screen sizes while maintaining proper document structure for accessibility and SEO.
- **Mental model**: Think of the Heading component as a styled, responsive heading element that separates visual appearance from semantic meaning. The `as` prop controls which HTML heading tag is rendered (h1-h6 for document structure), while the `size` prop controls visual appearance (font size, line height, etc.). This allows you to maintain proper document hierarchy while having full control over visual presentation.
- **Semantic meaning**: The Heading component communicates structural hierarchy in a document. Each heading level (h1-h6) conveys different levels of importance, with h1 being the most important (typically page title) and h6 being the least important (sub-sub-sub-section heading). Screen readers and search engines use these semantic tags to understand document structure and navigation.

## Pattern Support Levels
- **Native**: The Heading component is a single, standalone component without composable parts. It natively supports props like `as`, `size`, `fontWeight`, and all style props from Chakra's Box component. In v3, it integrates natively with the design token system and supports the `colorPalette` prop for theming.
- **Composed**: The Heading component can be composed with other Chakra UI components like Highlight (for text highlighting), VStack/Stack (for layout), and can be used within other layout components. It can also be wrapped in custom components to create application-specific heading variants.
- **CSS-only**: While the Heading component provides styled defaults, you can override any styling using Chakra's style props (fontSize, color, lineHeight, etc.) or by providing custom CSS classes. The component accepts all standard Box component props, enabling full CSS customization.

## Core Patterns

### Size Variants
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| xs | ❌ | N/A | Not available; sm is the smallest size |
| sm | ✅ | Native | fontSize "md" (16px), lineHeight 1.2 |
| md | ✅ | Native | fontSize "xl" (20px), lineHeight 1.2 - default size |
| lg | ✅ | Native | fontSize ["2xl", null, "3xl"], lineHeight [1.33, null, 1.2] - responsive |
| xl | ✅ | Native | fontSize ["3xl", null, "4xl"], lineHeight [1.33, null, 1.2] - responsive |
| 2xl | ✅ | Native | fontSize ["4xl", null, "5xl"] - very large heading |
| 3xl | ✅ | Native | fontSize ["5xl", null, "6xl"] - extra large heading |
| 4xl | ✅ | Native | fontSize ["6xl", null, "7xl"] - extra extra large |
| 5xl | ✅ | Native | fontSize ["7xl", null, "8xl"] - massive heading |
| 6xl | ✅ | Native | fontSize ["8xl", null, "9xl"] - largest size available |
| 7xl | ✅ | Native | fontSize ["9xl", null, "10xl"] - ultra large |

### Semantic Heading Levels
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| h1 | ✅ | Native | Main page title, most important heading |
| h2 | ✅ | Native | Section headings, default rendered tag |
| h3 | ✅ | Native | Subsection headings |
| h4 | ✅ | Native | Sub-subsection headings |
| h5 | ✅ | Native | Minor section headings |
| h6 | ✅ | Native | Least important heading level |

### Font Weight Variants
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| normal | ✅ | Native | fontWeight: 400 |
| medium | ✅ | Native | fontWeight: 500 |
| semibold | ✅ | Native | fontWeight: 600 - common for headings |
| bold | ✅ | Native | fontWeight: 700 - emphasized headings |
| extrabold | ✅ | Native | fontWeight: 800 - highly emphasized |
| black | ✅ | Native | fontWeight: 900 - maximum emphasis |

### Responsive Behavior
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Auto-responsive sizes | ✅ | Native | Larger sizes (lg, xl, 2xl+) automatically reduce on smaller screens |
| Responsive props | ✅ | Native | Can use array syntax: size={["sm", "md", "lg"]} for breakpoints |
| Mobile-first | ✅ | Native | Default behavior follows mobile-first responsive design |

### Theming & Styling
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| colorPalette (v3) | ✅ | Native | Apply semantic color palettes from theme |
| Style props | ✅ | Native | All Chakra Box props available (color, bg, p, m, etc.) |
| Theme customization | ✅ | Native | Can customize via theme recipes in v3, component theme in v2 |
| CSS-in-JS | ✅ | Native | Chakra's sx prop and style prop overrides |

### Accessibility
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Semantic HTML | ✅ | Native | Renders proper h1-h6 tags based on `as` prop |
| Screen reader support | ✅ | Native | Proper heading hierarchy for assistive technology |
| SEO optimization | ✅ | Native | Search engines recognize semantic heading structure |
| Focus management | ✅ | Native | Standard focus behavior when used as link/button wrapper |

## Code Examples

### Basic Usage
```jsx
import { Heading } from "@chakra-ui/react"

function BasicExample() {
  return (
    <Heading>The quick brown fox jumps over the lazy dog</Heading>
  )
}
```

### Size Variants Showcase
```jsx
import { Heading, Stack } from "@chakra-ui/react"

function SizeVariants() {
  return (
    <Stack gap="2" align="flex-start">
      <Heading size="sm">Heading (sm)</Heading>
      <Heading size="md">Heading (md) - Default</Heading>
      <Heading size="lg">Heading (lg)</Heading>
      <Heading size="xl">Heading (xl)</Heading>
      <Heading size="2xl">Heading (2xl)</Heading>
      <Heading size="3xl">Heading (3xl)</Heading>
      <Heading size="4xl">Heading (4xl)</Heading>
      <Heading size="5xl">Heading (5xl)</Heading>
      <Heading size="6xl">Heading (6xl)</Heading>
      <Heading size="7xl">Heading (7xl)</Heading>
    </Stack>
  )
}
```

### Semantic HTML Levels with `as` Prop
```jsx
import { Heading, Stack } from "@chakra-ui/react"

function SemanticLevels() {
  return (
    <Stack gap="4" align="flex-start">
      <Heading as="h1" size="2xl">Page Title (h1)</Heading>
      <Heading as="h2" size="xl">Section Heading (h2)</Heading>
      <Heading as="h3" size="lg">Subsection Heading (h3)</Heading>
      <Heading as="h4" size="md">Sub-subsection Heading (h4)</Heading>
      <Heading as="h5" size="sm">Minor Heading (h5)</Heading>
      <Heading as="h6" size="sm">Least Important (h6)</Heading>
    </Stack>
  )
}
```

### Separating Visual Size from Semantic Level
```jsx
// Visual appearance (size) independent from semantic meaning (as)
// This is important for accessibility: maintain proper document structure
// while controlling visual presentation

function SeparatedConcerns() {
  return (
    <>
      {/* Large visual size, but semantically a section heading */}
      <Heading as="h2" size="4xl">
        Large Section Title
      </Heading>

      {/* Small visual size, but semantically the main page title */}
      <Heading as="h1" size="md">
        Compact Page Title
      </Heading>
    </>
  )
}
```

### Font Weight Customization
```jsx
import { Heading, Stack } from "@chakra-ui/react"

function FontWeightVariants() {
  return (
    <Stack gap="2" align="flex-start">
      <Heading fontWeight="normal">Normal Weight</Heading>
      <Heading fontWeight="medium">Medium Weight</Heading>
      <Heading fontWeight="semibold">Semibold (default)</Heading>
      <Heading fontWeight="bold">Bold Weight</Heading>
      <Heading fontWeight="extrabold">Extrabold</Heading>
      <Heading fontWeight="black">Black Weight</Heading>
    </Stack>
  )
}
```

### Color and Style Customization
```jsx
import { Heading } from "@chakra-ui/react"

function StyledHeadings() {
  return (
    <>
      {/* Using color prop */}
      <Heading color="blue.500">Blue Heading</Heading>

      {/* Using colorPalette (v3) */}
      <Heading colorPalette="red">Red Palette Heading</Heading>

      {/* Multiple style props */}
      <Heading
        color="purple.600"
        fontSize="3xl"
        fontWeight="bold"
        letterSpacing="tight"
        lineHeight="shorter"
      >
        Custom Styled Heading
      </Heading>

      {/* With background and padding */}
      <Heading
        bg="gray.100"
        p="4"
        borderRadius="md"
        borderLeft="4px"
        borderColor="blue.500"
      >
        Heading with Background
      </Heading>
    </>
  )
}
```

### Responsive Sizing with Array Syntax
```jsx
import { Heading } from "@chakra-ui/react"

function ResponsiveHeading() {
  return (
    <>
      {/* Array syntax: [base, sm, md, lg, xl, 2xl] */}
      <Heading size={["md", "lg", "xl", "2xl"]}>
        Responsive Heading
      </Heading>

      {/* Object syntax for specific breakpoints */}
      <Heading
        size={{ base: "sm", md: "md", lg: "lg", xl: "xl" }}
      >
        Another Responsive Heading
      </Heading>

      {/* Responsive font size directly */}
      <Heading fontSize={["2xl", "3xl", "4xl", "5xl"]}>
        Direct Font Size Control
      </Heading>
    </>
  )
}
```

### Composition with Other Components
```jsx
import { Heading, Highlight, VStack, Box, Icon } from "@chakra-ui/react"
import { FiStar } from "react-icons/fi"

function ComposedHeadings() {
  return (
    <VStack gap="6" align="flex-start">
      {/* With Highlight component */}
      <Heading>
        <Highlight query="brown fox" styles={{ bg: "yellow.200", px: "2" }}>
          The quick brown fox jumps over the lazy dog
        </Highlight>
      </Heading>

      {/* With Icon */}
      <Heading display="flex" alignItems="center" gap="2">
        <Icon as={FiStar} />
        Featured Article
      </Heading>

      {/* In a Box with custom styling */}
      <Box
        borderLeft="4px"
        borderColor="blue.500"
        pl="4"
        py="2"
      >
        <Heading size="lg">Section Title</Heading>
        <Heading size="sm" fontWeight="normal" color="gray.600">
          Subtitle or description
        </Heading>
      </Box>
    </VStack>
  )
}
```

### Theme Customization (v2)
```jsx
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  components: {
    Heading: {
      baseStyle: {
        fontFamily: 'heading', // Use theme's heading font
        fontWeight: 'bold',
        letterSpacing: 'tight',
      },
      sizes: {
        // Custom size
        '8xl': {
          fontSize: ['6xl', '7xl', '8xl'],
          lineHeight: 1,
        },
      },
      variants: {
        // Custom variant
        'section': {
          borderBottom: '2px',
          borderColor: 'gray.200',
          pb: 2,
          mb: 4,
        },
      },
      defaultProps: {
        size: 'xl', // Change default size
        variant: null,
      },
    },
  },
})
```

### Theme Customization (v3)
```jsx
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    recipes: {
      heading: {
        base: {
          fontWeight: 'bold',
          letterSpacing: 'tight',
          lineHeight: '1.2',
        },
        variants: {
          style: {
            section: {
              borderBottom: '2px solid',
              borderColor: 'gray.200',
              paddingBottom: '2',
              marginBottom: '4',
            },
          },
        },
        defaultVariants: {
          size: 'xl',
        },
      },
    },
    tokens: {
      fonts: {
        heading: { value: "'Inter', sans-serif" },
      },
    },
  },
})

const system = createSystem(defaultConfig, customConfig)
```

### With Text Truncation
```jsx
import { Heading } from "@chakra-ui/react"

function TruncatedHeading() {
  return (
    <>
      {/* Single line truncation */}
      <Heading
        noOfLines={1}
        maxW="300px"
      >
        This is a very long heading that will be truncated with an ellipsis
      </Heading>

      {/* Multi-line truncation */}
      <Heading
        noOfLines={2}
        maxW="400px"
        size="md"
      >
        This is a longer heading that spans multiple lines but will be
        truncated after two lines with an ellipsis at the end
      </Heading>
    </>
  )
}
```

## Styling Approaches

### Native Props
The Heading component accepts all Chakra UI Box component props, providing extensive styling capabilities through the props API:

**Common Style Props:**
- `color` - Text color
- `fontSize` - Direct font size control (use `size` prop instead when possible)
- `fontWeight` - Font weight (normal, medium, semibold, bold, etc.)
- `letterSpacing` - Letter spacing
- `lineHeight` - Line height
- `textAlign` - Text alignment (left, center, right, justify)
- `textTransform` - Text transformation (uppercase, lowercase, capitalize)
- `textDecoration` - Text decoration (underline, line-through, etc.)

**Layout Props:**
- `margin` / `m`, `mt`, `mr`, `mb`, `ml` - Margin
- `padding` / `p`, `pt`, `pr`, `pb`, `pl` - Padding
- `width` / `w`, `maxW`, `minW` - Width constraints
- `display` - Display mode (block, inline, flex, etc.)

**Visual Props:**
- `bg` / `backgroundColor` - Background color
- `border`, `borderColor`, `borderWidth`, `borderRadius` - Border styling
- `boxShadow` - Drop shadow
- `opacity` - Opacity level

### Theme-Based Styling

**v2 Theme Structure:**
The Heading component can be customized through the theme using:
- `baseStyle` - Default styles applied to all headings
- `sizes` - Custom size variants
- `variants` - Named style variations
- `defaultProps` - Default prop values

**v3 Theme Structure:**
In v3, use the recipe system:
- `base` - Default styles for all instances
- `variants` - Style variations with semantic names
- `defaultVariants` - Default variant selections

### Responsive Styling

**Array Syntax:**
```jsx
<Heading
  fontSize={["xl", "2xl", "3xl", "4xl"]}
  color={["blue.500", "blue.600", "blue.700"]}
  textAlign={["center", "center", "left"]}
>
  Responsive Heading
</Heading>
```

**Object Syntax:**
```jsx
<Heading
  fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
  color={{ base: "blue.500", md: "blue.600" }}
>
  Responsive Heading
</Heading>
```

### CSS-in-JS with sx Prop
```jsx
<Heading
  sx={{
    bgGradient: "linear(to-r, blue.500, purple.500)",
    bgClip: "text",
    fontSize: "6xl",
    fontWeight: "extrabold",
    _hover: {
      bgGradient: "linear(to-r, purple.500, pink.500)",
    },
  }}
>
  Gradient Heading
</Heading>
```

### Pseudo Selectors
```jsx
<Heading
  _hover={{ color: "blue.600", textDecoration: "underline" }}
  _focus={{ outline: "2px solid", outlineColor: "blue.500" }}
  _active={{ color: "blue.800" }}
  cursor="pointer"
>
  Interactive Heading
</Heading>
```

### Color Palette System (v3)
```jsx
// Uses semantic color tokens from the theme
<Heading colorPalette="blue">Blue Palette</Heading>
<Heading colorPalette="red">Red Palette</Heading>
<Heading colorPalette="green">Green Palette</Heading>

// With custom color palette in theme
const customConfig = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.purple.500}" },
          contrast: { value: "white" },
          fg: { value: "{colors.purple.700}" },
        },
      },
    },
  },
})
```

## Accessibility Patterns

### Semantic HTML Structure
The Heading component prioritizes proper semantic HTML through the `as` prop:

**Proper Document Structure:**
```jsx
<article>
  <Heading as="h1">Main Article Title</Heading>
  <Heading as="h2">First Section</Heading>
  <Heading as="h3">Subsection A</Heading>
  <Heading as="h3">Subsection B</Heading>
  <Heading as="h2">Second Section</Heading>
</article>
```

**Key Points:**
- Use `h1` for the main page title (only one per page)
- Use `h2-h6` in hierarchical order without skipping levels
- Don't choose heading level based on visual size alone
- Use the `size` prop to control visual appearance independently

### Screen Reader Compatibility

The Heading component renders proper semantic HTML that screen readers understand:

**Announced as:** "Heading level 2, [heading text]"

**Navigation:**
- Screen readers can list all headings
- Users can jump between headings
- Heading levels convey document structure

### SEO Benefits

Search engines use heading hierarchy to understand page structure:
- `h1` indicates the main topic
- `h2-h6` indicate subtopics and content organization
- Proper heading structure improves content indexing
- Better document outline for search result snippets

### Focus Management

When used as an interactive element or with tabIndex:
```jsx
// Focusable heading (for skip links, etc.)
<Heading
  as="h2"
  tabIndex={0}
  _focus={{
    outline: "2px solid",
    outlineColor: "blue.500",
    outlineOffset: "2px",
  }}
>
  Focusable Heading
</Heading>
```

### ARIA Labels and Descriptions

For headings that need additional context:
```jsx
<Heading
  as="h2"
  aria-label="User Profile Settings"
  aria-describedby="settings-description"
>
  Settings
</Heading>
<Text id="settings-description" srOnly>
  Configure your account preferences and privacy options
</Text>
```

### Contrast and Readability

Ensure sufficient color contrast for accessibility:
```jsx
// Good: High contrast
<Heading color="gray.900" bg="white">
  High Contrast Heading
</Heading>

// Bad: Low contrast (avoid)
<Heading color="gray.400" bg="gray.300">
  Low Contrast Heading
</Heading>

// Good: Proper contrast with dark background
<Heading color="white" bg="gray.800">
  Dark Background Heading
</Heading>
```

**WCAG Guidelines:**
- Normal text: 4.5:1 contrast ratio minimum
- Large text (18pt+): 3:1 contrast ratio minimum
- Headings are typically large text, requiring 3:1 minimum

## Notable Features

### Automatic Responsive Behavior
One of the most distinctive features of the Chakra UI Heading component is its automatic responsive sizing. When using size props like `lg`, `xl`, `2xl`, and larger, the component automatically reduces font size on smaller screens. This behavior is built into the size definitions using responsive array syntax, eliminating the need for manual breakpoint configuration in common cases.

**Example:** A heading with `size="4xl"` will render at `fontSize={["6xl", null, "7xl"]}`, automatically scaling down on mobile devices.

### Separation of Concerns: Visual vs Semantic
The Heading component enforces a clean separation between visual presentation (`size` prop) and semantic HTML structure (`as` prop). This design pattern is particularly valuable for accessibility and SEO, allowing developers to maintain proper document structure while having complete control over visual appearance.

**Example:** You can render an `h1` tag with small visual size: `<Heading as="h1" size="md">`.

### Zero Configuration Styling
The component works out-of-the-box with sensible defaults. Without any configuration, it renders as an `h2` with medium size, proper line height, and font weight. This zero-config approach makes it easy to start using while still offering extensive customization options.

### Design Token Integration
In v3, the Heading component integrates deeply with Chakra's design token system. The `colorPalette` prop allows headings to automatically adapt to theme changes, supporting both light and dark modes seamlessly. This integration extends to all style props, which reference theme tokens by default.

### Box Component Inheritance
By inheriting all props from Chakra's Box component, the Heading component gains access to the entire Chakra style prop API. This means you can use layout props (margin, padding), visual props (background, border), and responsive props without any additional wrappers or configuration.

### No Composable Parts
Unlike many other components in Chakra UI v3 (which were refactored to use composable parts like `.Root`, `.Control`, `.Label`), the Heading component remains a simple, single component. This decision reflects the component's straightforward nature and aligns with its primary purpose as a styled HTML heading element.

### Theme Recipe System (v3)
The v3 recipe system allows for powerful theme-based customization without component-specific configuration. Headings can be styled globally through recipes with variants, and these styles cascade through the application. This is a significant improvement over v2's component theme structure.

### Built-in Text Utilities
The Heading component includes built-in support for text utilities like `noOfLines` (for truncation), `isTruncated` (for single-line truncation), and all text-related style props. This eliminates the need for wrapper components or custom CSS for common text manipulation patterns.

### Consistent API with Text Component
The Heading and Text components share a similar API, making it easy to switch between them or understand one if you know the other. Both support the same style props, responsive syntax, and theming approach.

### No Default Margin
Unlike native HTML heading elements which have default browser margins, the Chakra UI Heading component resets these margins to zero by default. This provides more predictable spacing behavior and aligns with modern CSS reset practices. Margins can be added explicitly using margin props.

### TypeScript Support
The component has excellent TypeScript support with proper type inference for:
- Size values (autocompletion for "sm", "md", "lg", etc.)
- HTML element types (when using `as` prop)
- All style prop values
- Theme token references

## Research Notes

### Version Stability
The Heading component has remained relatively stable across Chakra UI versions (v0, v1, v2, v3). Unlike many other components that saw significant architectural changes in v3 (moving to composable parts), the Heading component's API remained largely the same. The main changes were in theming configuration rather than component usage.

### Migration Complexity
The migration from v2 to v3 for Heading is straightforward compared to other components. The primary changes are:
1. Theme configuration syntax (extendTheme → createSystem)
2. `colorScheme` prop renamed to `colorPalette` (though color prop still works)
3. Component recipe structure for theme customization

No breaking changes to core functionality or common usage patterns.

### Design Philosophy
The Heading component embodies Chakra UI's core philosophy:
1. **Accessibility first** - Semantic HTML and proper document structure
2. **Flexibility** - Extensive customization through props and theme
3. **Responsive by default** - Automatic mobile optimization
4. **Developer experience** - Intuitive API with TypeScript support
5. **Minimal footprint** - Simple component without unnecessary abstraction

### Comparison with Other Frameworks

**vs HTML Native Headings:**
- Adds consistent styling across browsers
- Provides responsive behavior out of the box
- Integrates with design token system
- Maintains semantic HTML while offering visual flexibility

**vs Material-UI Typography:**
- Simpler API focused specifically on headings
- More flexible style prop system
- Better responsive default behavior
- Less opinionated about typography hierarchy

**vs Tailwind CSS:**
- Component-based rather than utility-class-based
- Built-in responsive behavior without class modifiers
- Theme integration more straightforward
- TypeScript autocomplete for props vs class names

**vs Radix UI:**
- Radix doesn't provide a heading component (heading is just HTML)
- Chakra provides styled component with responsive behavior
- Chakra offers more out-of-the-box functionality
- Radix approach requires more manual styling

### Common Use Cases

1. **Page Titles:** Main heading for each page (h1 with large size)
2. **Section Headers:** Dividing content into sections (h2-h3)
3. **Card Titles:** Headings within cards or panels (h3-h4 with smaller sizes)
4. **Navigation Headings:** Headers for navigation sections (h2-h3)
5. **Dashboard Widgets:** Titles for dashboard components (h3-h4)
6. **Form Sections:** Grouping form fields (h3-h4)

### Performance Considerations
- Minimal runtime overhead compared to native HTML headings
- No composable parts means simpler DOM structure
- Style props are processed at build time when possible
- Theme token references are optimized for performance
- Responsive array syntax doesn't create additional DOM elements

### Browser Support
The Heading component works in all browsers that Chakra UI supports:
- All modern browsers (Chrome, Firefox, Safari, Edge)
- No polyfills required for basic functionality
- Responsive behavior uses standard CSS media queries
- No known browser-specific issues

### Limitations and Considerations

1. **No Built-in Variants:** Unlike some component libraries, Chakra doesn't provide named style variants for headings (like "hero", "section", "card"). These must be created in the theme if desired.

2. **Font Family:** The default font family comes from the theme's `fonts.heading` token. If not customized, it uses the system font stack.

3. **No Automatic Anchor Links:** The component doesn't automatically generate anchor links for headings (common in documentation sites). This must be implemented separately.

4. **Size Prop Priority:** When both `size` and `fontSize` props are provided, `fontSize` takes priority, which might be counterintuitive.

5. **No Title Case Transformation:** Unlike some frameworks, there's no built-in title case transformation. Use `textTransform="capitalize"` manually if needed.

### Best Practices Observed

1. **Always use `as` prop:** Explicitly set the semantic level for clarity and maintainability
2. **Use `size` for visual appearance:** Don't rely on default sizes for h1-h6
3. **Maintain heading hierarchy:** Don't skip levels (h1 → h3) in document structure
4. **One h1 per page:** Each page should have exactly one h1 element
5. **Responsive considerations:** Test heading sizes across breakpoints
6. **Color contrast:** Ensure WCAG AA compliance (minimum 3:1 for large text)
7. **Avoid overly large sizes:** Sizes above 4xl should be used sparingly
8. **Theme-based styling:** Prefer theme customization over inline styles for consistency

### Documentation Gaps

While the documentation is generally good, some areas could be expanded:
- More composition pattern examples with other components
- Detailed theming guide specifically for headings
- Accessibility best practices and common pitfalls
- Performance optimization techniques for large lists of headings
- Advanced use cases (dynamic heading levels, context-based styling)
- Integration examples with popular libraries (Markdown renderers, CMS systems)

### Community Feedback

Based on GitHub issues and discussions:
- Users generally satisfied with simplicity
- Some confusion about responsive size behavior
- Requests for more built-in variants (generally solved with theme customization)
- Questions about theme migration from v2 to v3
- Desire for automatic heading anchors (common in docs sites)

### Future Considerations

As Chakra UI evolves:
- Theme system may continue to evolve in future versions
- Potential integration with upcoming CSS features (container queries, etc.)
- Possible addition of built-in variants for common use cases
- Enhanced TypeScript types for even better DX
- Better documentation for advanced theming scenarios
