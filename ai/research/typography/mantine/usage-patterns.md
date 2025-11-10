# Mantine - Typography Usage Patterns

> Last Modified: 2025-11-10

## Component URL
https://mantine.dev/core/text/
https://mantine.dev/core/title/
Status: ✅ Working
Version: v8.3.7
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Clear and well-structured documentation with interactive demos, complete prop reference, and practical code examples. Clean API design with prop shorthand patterns and theme integration guidance.

## Component Definition
- **Core purpose**: Display and format text content with two distinct components: Text for inline/paragraph text with extensive styling options, and Title for semantic headings with theme-consistent typography
- **Mental model**: Dual-component typography system where Text is the flexible inline text element with rich styling capabilities, and Title is the semantic heading element with independent size/order control
- **Semantic meaning**: Text renders as `<p>` by default (polymorphic), Title renders semantic `<h1>`-`<h6>` elements based on order prop, both support theme-consistent typography and accessibility through semantic HTML

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **Styled**: Via CSS/className only
- **Not Supported**: Pattern not available

## Component Architecture Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text Component | ✅ | Native | Primary text element, renders `<p>` by default, polymorphic via `component` prop |
| Title Component | ✅ | Native | Semantic heading element, renders `<h1>`-`<h6>` via `order` prop (1-6) |
| Polymorphic rendering | ✅ | Native | Text supports `component` prop to render as any HTML element or custom component |
| Span shorthand | ✅ | Native | `span` prop as shorthand for `component="span"` on Text component |
| Typography container | ⚠️ | Partial | `Typography` component exists for layout context (shown in line clamp example) |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Paragraph text | ✅ | Native | Text component default behavior (renders as `<p>`) |
| Heading levels | ✅ | Native | Title component with `order` prop (1-6 maps to h1-h6) |
| Inline text | ✅ | Native | Text with `span` prop or `component="span"` |
| Code text | ❌ | Not Supported | No dedicated code prop (use Code component instead) |
| Links | ⚠️ | Composed | Via polymorphic `component="a"` on Text |

## Type Patterns (Semantic Colors)
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default/Body | ✅ | Native | Default text color from theme |
| Secondary/Dimmed | ✅ | Native | `c="dimmed"` for secondary/muted text |
| Primary | ✅ | Native | Via theme colors `c="blue"`, `c="teal.4"` etc |
| Success | ✅ | Native | Via theme colors (e.g., `c="green"`) |
| Warning | ✅ | Native | Via theme colors (e.g., `c="yellow"`) |
| Danger/Error | ✅ | Native | Via theme colors (e.g., `c="red"`) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ❌ | Not Supported | No native disabled prop for text |
| Muted/Dimmed | ✅ | Native | `c="dimmed"` for muted appearance |
| Error state | ✅ | Native | Via color prop `c="red"` or theme error color |
| Success state | ✅ | Native | Via color prop `c="green"` or theme success color |

## Variation Patterns

### Font Size
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size variants | ✅ | Native | `size` prop: xs, sm, md (default), lg, xl |
| Custom pixel size | ✅ | Native | Title accepts numeric values: `size={16}` |
| Theme size tokens | ✅ | Native | Both components support theme size tokens |
| Heading-specific sizes | ✅ | Native | Title `size` accepts h1-h6 values independent of `order` |

### Font Weight
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Weight control | ✅ | Native | `fw` prop: 500 (semibold), 700 (bold), 900 (extra-bold) |
| Numeric values | ✅ | Native | `fw` accepts any numeric font-weight value |

### Color
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Theme colors | ✅ | Native | `c` prop with theme color names: "blue", "red", "green" etc |
| Color shades | ✅ | Native | Dot notation for shades: `c="teal.4"` |
| Dimmed/Muted | ✅ | Native | `c="dimmed"` for secondary text color |
| Custom colors | ✅ | Native | `c` prop accepts custom color values |

### Text Alignment
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Alignment control | ✅ | Native | `ta` prop: left, center, right |

### Truncation
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single-line truncate | ✅ | Native | `truncate` prop: "end" (default), "start" for ellipsis position |
| Ellipsis position | ✅ | Native | Control truncation direction (end vs start) |
| Container required | ⚠️ | Native | Requires width constraint on parent container |

### Line Height
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Line height control | ⚠️ | Styled | Via theme configuration or inline styles, no dedicated prop |

### Letter Spacing
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Letter spacing | ❌ | Styled | No dedicated prop, handle via style prop or CSS |

### Text Transforms
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Transform control | ✅ | Native | `tt` prop: uppercase, capitalize |
| Lowercase | ⚠️ | Styled | No "lowercase" value documented, likely via style prop |

### Line Clamping
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Multi-line clamp | ✅ | Native | `lineClamp` prop with number of lines (uses -webkit-line-clamp) |
| Works with HTML | ✅ | Native | Can wrap Typography component with nested HTML |
| Padding limitation | ⚠️ | Native | "padding-bottom cannot be set on text element" when using lineClamp |

### Text Decoration
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Underline | ✅ | Native | `td="underline"` |
| Strikethrough | ✅ | Native | `td="line-through"` |
| Font style | ✅ | Native | `fs="italic"` for italic text |

### Special Features
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Gradient text | ✅ | Native | `variant="gradient"` with `gradient` prop: { from, to, deg } |
| Default gradient | ✅ | Native | Uses theme.defaultGradient if gradient prop omitted |
| Inherit styles | ✅ | Native | `inherit` prop forces text to inherit parent styles |
| Copyable text | ❌ | Not Supported | No native copy-to-clipboard feature |
| Editable text | ❌ | Not Supported | No native inline editing feature |
| Keyboard display | ❌ | Not Supported | Use Kbd component instead |

### Text Wrapping
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text wrap control | ✅ | Native | `textWrap` prop on Title (e.g., "wrap", "balance") |
| Global config | ✅ | Native | Configurable via theme.headings for Title |

## Code Examples

### Basic Text Sizes
```tsx
import { Text } from '@mantine/core';

function Demo() {
  return (
    <>
      <Text size="xs">Extra small text</Text>
      <Text size="sm">Small text</Text>
      <Text size="md">Default text</Text>
      <Text size="lg">Large text</Text>
      <Text size="xl">Extra large text</Text>
    </>
  );
}
```

### Text Styling Variants
```tsx
import { Text } from '@mantine/core';

function Demo() {
  return (
    <>
      <Text fw={500}>Semibold</Text>
      <Text fw={700}>Bold</Text>
      <Text fs="italic">Italic</Text>
      <Text td="underline">Underlined</Text>
      <Text td="line-through">Strikethrough</Text>
      <Text tt="uppercase">Uppercase</Text>
      <Text tt="capitalize">capitalized text</Text>
    </>
  );
}
```

### Text Colors
```tsx
import { Text } from '@mantine/core';

function Demo() {
  return (
    <>
      <Text c="dimmed">Dimmed text</Text>
      <Text c="blue">Blue text</Text>
      <Text c="teal.4">Teal 4 text</Text>
    </>
  );
}
```

### Text Alignment
```tsx
import { Text } from '@mantine/core';

function Demo() {
  return (
    <>
      <Text ta="center">Aligned to center</Text>
      <Text ta="right">Aligned to right</Text>
    </>
  );
}
```

### Gradient Text
```tsx
import { Text } from '@mantine/core';

function Demo() {
  return (
    <Text
      size="xl"
      fw={900}
      variant="gradient"
      gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
    >
      Gradient Text
    </Text>
  );
}
```

### Truncate Text
```tsx
import { Text, Box } from '@mantine/core';

function Demo() {
  return (
    <Box w={300}>
      <Text truncate="end">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde provident eos fugiat id
        necessitatibus magni ducimus molestias. Placeat, consequatur. Quisquam, quae magnam
        perspiciatis excepturi iste sint itaque sunt laborum. Nihil?
      </Text>
    </Box>
  );
}
```

### Line Clamp
```tsx
import { Text } from '@mantine/core';

function Demo() {
  return (
    <Text lineClamp={4}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt nulla quam aut sed
      corporis voluptates praesentium inventore, sapiente ex tempore sit consequatur debitis
      non! Illo cum ipsa reiciendis quidem facere, deserunt eos totam impedit.
    </Text>
  );
}
```

### Line Clamp with Typography (HTML Content)
```tsx
import { Typography, Text } from '@mantine/core';

function Demo() {
  return (
    <Text lineClamp={3} component="div">
      <Typography>
        <h3>Line clamp with Typography</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt nulla quam aut sed
          corporis voluptates praesentium inventore, sapiente ex tempore sit consequatur debitis
          non! Illo cum ipsa reiciendis quidem facere, deserunt eos totam impedit. Vel ab, ipsum
          veniam aperiam odit molestiae incidunt minus, sint eos iusto earum quaerat vitae
          perspiciatis.
        </p>
      </Typography>
    </Text>
  );
}
```

### Inherit Styles (Inline Highlighting)
```tsx
import { Text, Title } from '@mantine/core';

function Demo() {
  return (
    <Title order={3}>
      Title in which you want to <Text span c="blue" inherit>highlight</Text> something
    </Title>
  );
}
```

### Polymorphic Component (Render as Link)
```tsx
import { Text } from '@mantine/core';

function Demo() {
  return <Text component="a" href="/docs">Link text</Text>;
}
```

### Span Shorthand
```tsx
import { Text } from '@mantine/core';

function Demo() {
  return (
    <>
      <Text span>Same as below</Text>
      <Text component="span">Same as above</Text>
    </>
  );
}
```

### Title - Basic Heading Levels
```tsx
import { Title } from '@mantine/core';

function Demo() {
  return (
    <>
      <Title order={1}>This is h1 title</Title>
      <Title order={2}>This is h2 title</Title>
      <Title order={3}>This is h3 title</Title>
      <Title order={4}>This is h4 title</Title>
      <Title order={5}>This is h5 title</Title>
      <Title order={6}>This is h6 title</Title>
    </>
  );
}
```

### Title - Size Customization (Independent of Order)
```tsx
import { Title } from '@mantine/core';

function Demo() {
  return (
    <>
      <Title order={3} size="h1">
        H3 heading with h1 font-size
      </Title>
      <Title size="h4">H1 heading with h4 font-size</Title>
      <Title size={16}>H1 heading with 16px size</Title>
      <Title size="xs">H1 heading with xs size</Title>
    </>
  );
}
```

### Title - Text Wrap
```tsx
import { Title } from '@mantine/core';

function Demo() {
  return (
    <Title order={3} textWrap="wrap">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum vitae quasi,
      adipisci non veniam maiores blanditiis illum est.
    </Title>
  );
}
```

### Title - Line Clamp
```tsx
import { Title, Box } from '@mantine/core';

function Demo() {
  return (
    <Box maw={400}>
      <Title order={2} lineClamp={2}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum vitae quasi,
        adipisci non veniam maiores blanditiis illum est voluptatibus ullam.
      </Title>
    </Box>
  );
}
```

## Notable Features

### Independent Order and Size Control (Title)
The Title component decouples semantic meaning (order/heading level) from visual appearance (size). You can render an h3 element with h1 styling via `<Title order={3} size="h1">`, providing flexibility for SEO and accessibility without compromising design requirements.

### Gradient Text with Theme Integration
Native gradient text support with configurable direction and colors. Falls back to theme.defaultGradient when gradient prop is omitted, ensuring consistent brand identity. Supports linear gradients with two colors via simple object syntax: `gradient={{ from: 'blue', to: 'cyan', deg: 90 }}`.

### Polymorphic Component Architecture
Text component is fully polymorphic via the `component` prop, allowing it to render as any HTML element or custom React component. This enables semantic flexibility (e.g., rendering as `<a>`, `<label>`, `<div>`) without changing the styling API.

### Span Shorthand Syntax
The `span` boolean prop provides cleaner inline text syntax compared to `component="span"`, making inline compositions more readable: `<Text span c="blue">inline text</Text>`.

### Inherit Prop for Parent Style Adoption
The `inherit` prop forces Text to adopt parent typography styles instead of applying default font properties. Critical for inline highlighting within headings where maintaining parent size and weight is desired.

### Directional Truncation
Unlike many frameworks that only support end-ellipsis, Mantine's `truncate` prop accepts "start" or "end", enabling file path patterns where the beginning is more important than the middle.

### Line Clamp with Complex HTML
The `lineClamp` feature works with nested HTML content when wrapping a Typography component, enabling multi-line truncation of rich content beyond simple text strings.

### Text Wrapping Control (Title)
The `textWrap` prop on Title supports CSS text wrapping behaviors like "balance", with theme-level configuration via `theme.headings` for global consistency.

### Prop Shorthand Naming Convention
Mantine uses terse prop names (fw, fs, td, tt, ta, c) for common styling properties, reducing verbosity in component markup. This is consistent with their overall API design philosophy.

### Theme-Based Color System
The `c` prop integrates with Mantine's theme system, supporting named colors ("blue"), shade notation ("teal.4"), and special values ("dimmed"). Ensures color consistency across the application.

### No Default Margins
Both Text and Title components have no default margins or padding, giving developers full layout control without fighting framework defaults.

### Padding-Bottom Limitation with Line Clamp
Documentation explicitly warns that "padding-bottom cannot be set on text element" when using lineClamp, providing clear guidance on the technical constraint from -webkit-line-clamp.

## Research Notes

- Mantine's typography system uses a dual-component approach: Text for flexible inline/paragraph text, Title for semantic headings
- Strong emphasis on polymorphic components - Text can render as any element via `component` prop
- The order vs size separation in Title is a sophisticated approach to balancing semantics and design
- Gradient text is a native first-class feature, not an addon or workaround
- The inherit prop solves a common problem of maintaining parent styles in inline compositions
- No interactive features (copyable, editable) unlike Ant Design - Mantine expects separate components for these
- Prop naming convention favors brevity (fw, fs, td, tt, ta) over verbosity (fontWeight, fontSize, etc)
- lineClamp implementation uses -webkit-line-clamp, which has known limitations (padding-bottom)
- No dedicated code, keyboard, or mark props - Mantine provides separate components (Code, Kbd, Mark)
- Text alignment (ta), transform (tt), and decoration (td) are native props rather than CSS-only
- The "dimmed" color is a special theme value for secondary/muted text, not just opacity reduction
- Both components emphasize theme integration over inline style props
- Package: @mantine/core
- Version: v8.3.7 (current stable as of 2025-11-10)
- Framework: React only (no framework-agnostic version)
- The span shorthand demonstrates attention to developer experience in API design
- Title's textWrap prop with theme.headings configuration shows thoughtful global defaults
- Truncate accepting "start" or "end" is more flexible than typical single-direction ellipsis
- No mention of disabled state for text - likely handled via opacity in parent containers
- The Typography component appears to be primarily for layout/context rather than a catch-all wrapper
- Line clamp with complex HTML (via Typography wrapper) is more powerful than string-only implementations
- Missing features: copyable, editable, keyboard display, mark/highlight (provided via other components)
- The polymorphic architecture enables Text to replace multiple specialized text components
- Theme-first color system prevents inline color values, enforcing design system consistency
- Documentation is concise and example-driven, assuming familiarity with React and styling concepts
- No version tracking of when features were added (unlike Ant Design's detailed version notes)
