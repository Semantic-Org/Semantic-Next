# Radix UI - Aspect Ratio Usage Patterns

## Component URL
https://www.radix-ui.com/primitives/docs/components/aspect-ratio
Status: ✅ Working
Version: 1.1.7 (Gzipped Size: 1.71 kB)
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - Clean, focused documentation with clear examples for multiple styling approaches (CSS, Tailwind), API reference, installation instructions, and GitHub source access.

## Component Definition
- **Core purpose**: Constrains content to maintain a specific width-to-height proportion (aspect ratio), preventing layout shifts and ensuring visual consistency across different screen sizes.
- **Mental model**: A container wrapper that enforces dimensional proportions - users specify a ratio (e.g., 16/9) and the component ensures the content always respects that relationship regardless of available space.
- **Semantic meaning**: Communicates dimensional consistency and proportional scaling in the UI, commonly used for media containers (images, videos, embedded content) where maintaining aspect ratio is critical.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `ratio={16/9}`)
- **Composed**: Via composition/children (content passed as children)
- **CSS-only**: Requires custom styling (styling the content itself)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image content | ✅ | Composed | Primary use case shown in examples - images passed as children with custom styling |
| Media support | ✅ | Composed | Designed for any media content (images, video, iframes) - container agnostic |
| Custom content | ✅ | Composed | Accepts any child content - not limited to media |
| Text content | ✅ | Composed | Can contain text or any React elements |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Ratio-based container | ✅ | Native | Core component type - single purpose container |
| Flexible ratios | ✅ | Native | Supports any numeric ratio value (16/9, 1/1, 4/3, custom) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | N/A | No built-in loading state - handled by content |
| Disabled | ❌ | N/A | Container doesn't have disabled semantics |
| Error states | ❌ | N/A | No built-in error handling - handled by content |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No built-in size variants - controlled via CSS on wrapper |
| Spacing control | ❌ | CSS-only | No built-in spacing - handled via CSS classes/styles |
| Visual styles | ❌ | CSS-only | Container has no visual styling - completely style-agnostic |
| Color options | ❌ | N/A | Container doesn't have color semantics |
| Alignment | ❌ | CSS-only | Content alignment controlled via CSS (e.g., object-fit, object-position) |

## Composition Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| asChild prop | ✅ | Native | Enables prop merging with child element for advanced composition |
| Single root | ✅ | Native | AspectRatio.Root is the only component part |
| Unstyled primitive | ✅ | Native | Zero default styling - completely headless approach |

## Props/API Documentation

### AspectRatio.Root
The primary and only component in the Aspect Ratio primitive.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | `false` | Merges props with a child element instead of rendering a default container. Enables composition with custom elements. |
| `ratio` | number | `1` | The desired aspect ratio expressed as width/height (e.g., 16/9 = 1.777..., 1/1 = 1, 4/3 = 1.333...) |

**Additional Props**: Accepts all standard HTML div attributes when `asChild` is false.

## Code Examples

### Basic Usage with CSS
```jsx
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import './styles.css';

const AspectRatioDemo = () => (
  <div className="Container">
    <AspectRatio.Root ratio={16 / 9}>
      <img
        className="Image"
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape photograph"
      />
    </AspectRatio.Root>
  </div>
);

export default AspectRatioDemo;
```

**Associated CSS:**
```css
.Container {
  width: 300px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.Image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Tailwind CSS Implementation
```jsx
import * as AspectRatio from '@radix-ui/react-aspect-ratio';

const TailwindExample = () => (
  <div className="w-[300px] overflow-hidden rounded-md shadow-blackA4">
    <AspectRatio.Root ratio={16 / 9}>
      <img
        className="size-full object-cover"
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape photograph"
      />
    </AspectRatio.Root>
  </div>
);
```

### Common Aspect Ratios
```jsx
// 16:9 (Widescreen video)
<AspectRatio.Root ratio={16 / 9}>
  {/* content */}
</AspectRatio.Root>

// 1:1 (Square)
<AspectRatio.Root ratio={1}>
  {/* content */}
</AspectRatio.Root>

// 4:3 (Classic TV/Photo)
<AspectRatio.Root ratio={4 / 3}>
  {/* content */}
</AspectRatio.Root>

// 21:9 (Ultrawide)
<AspectRatio.Root ratio={21 / 9}>
  {/* content */}
</AspectRatio.Root>

// 3:2 (Classic photography)
<AspectRatio.Root ratio={3 / 2}>
  {/* content */}
</AspectRatio.Root>
```

### Using asChild for Composition
```jsx
import * as AspectRatio from '@radix-ui/react-aspect-ratio';

// Merge props with a custom div
const CustomContainer = () => (
  <AspectRatio.Root ratio={16 / 9} asChild>
    <div className="custom-video-container">
      <iframe src="..." />
    </div>
  </AspectRatio.Root>
);
```

[View Live Demo](https://www.radix-ui.com/primitives/docs/components/aspect-ratio)

## Styling Approaches

### 1. CSS Modules
```jsx
import styles from './styles.module.css';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';

<div className={styles.container}>
  <AspectRatio.Root ratio={16 / 9}>
    <img className={styles.image} src="..." alt="..." />
  </AspectRatio.Root>
</div>
```

### 2. Tailwind CSS
```jsx
<div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
  <AspectRatio.Root ratio={16 / 9}>
    <img className="w-full h-full object-cover" src="..." alt="..." />
  </AspectRatio.Root>
</div>
```

### 3. Inline Styles
```jsx
<div style={{ width: 300, borderRadius: 6, overflow: 'hidden' }}>
  <AspectRatio.Root ratio={16 / 9}>
    <img
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      src="..."
      alt="..."
    />
  </AspectRatio.Root>
</div>
```

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Semantic HTML | ✅ | Native | Renders as div by default (or merged element with asChild) |
| ARIA attributes | ✅ | Composed | Passes through all ARIA props to underlying element |
| Alt text support | ✅ | Composed | Alt text responsibility of child content (e.g., img) |
| Keyboard navigation | N/A | N/A | Container only - navigation depends on content |
| Screen reader support | ✅ | Composed | Works with screen readers via proper semantic content |

## Implementation Architecture

### Rendering Approach
- **Headless/Unstyled**: Zero default styling - completely style-agnostic
- **Single Component**: Only one part (AspectRatio.Root) - minimal API surface
- **Composition-First**: Uses asChild for advanced composition scenarios
- **Framework Integration**: React-specific implementation (@radix-ui/react-aspect-ratio)

### Technical Implementation
The component likely uses the CSS "padding-bottom trick" or modern aspect-ratio CSS property to maintain proportions:
- Traditional: `padding-bottom: calc(height / width * 100%)`
- Modern: `aspect-ratio: width / height` CSS property

## Notable Features

### Strengths
- **Minimal API**: Only 2 props (ratio, asChild) makes it extremely simple to use
- **Framework Agnostic Styling**: Works with any CSS approach (CSS-in-JS, CSS Modules, Tailwind, inline styles)
- **Precise Ratio Control**: Numeric ratio prop allows any proportion (not limited to presets)
- **Composition Pattern**: asChild prop enables advanced integration scenarios
- **Tiny Bundle Size**: 1.71 kB gzipped - negligible performance impact
- **Zero Opinions**: Completely unstyled allows full design flexibility
- **GitHub Source Access**: Open source with accessible implementation

### Limitations
- **Single Purpose**: Only handles aspect ratio - no additional features (loading, error states, etc.)
- **No Built-in Styling**: Requires understanding of CSS for proper styling of children
- **React Only**: Not available for other frameworks (Vue, Svelte, etc.)
- **No Responsive Ratios**: Single ratio prop - doesn't handle different ratios per breakpoint natively

### Design Philosophy
Radix UI's approach is to provide minimal, unstyled primitives that handle complex behavior (in this case, aspect ratio maintenance) while leaving all styling to the consumer. This is evident in:
- No size/color/spacing variants
- No default visual styling
- Focus on single responsibility (ratio enforcement)
- Composition over configuration

## Installation & Setup
```bash
npm install @radix-ui/react-aspect-ratio
```

**Package Details:**
- Package: `@radix-ui/react-aspect-ratio`
- Version: 1.1.7
- Gzipped Size: 1.71 kB
- Repository: https://github.com/radix-ui/primitives

## Research Notes

### Documentation Quality
- Very clear and focused documentation
- Multiple styling examples (CSS, Tailwind) demonstrate flexibility
- API reference is concise and complete
- Live demo available on documentation page
- GitHub source linked for deep investigation

### Framework Philosophy
Radix UI follows a "headless primitives" philosophy:
- No default styling whatsoever
- Minimal API surface (just the essential behavior)
- Maximum flexibility for design systems
- Composition through asChild pattern
- Single responsibility per component

### Common Use Cases (Implied)
1. **Image galleries** - Ensure consistent thumbnail sizes
2. **Video embeds** - Maintain 16:9 or other video ratios
3. **Card layouts** - Create uniform card image areas
4. **Avatar containers** - Square (1:1) ratio enforcement
5. **Responsive media** - Prevent layout shift during image load
6. **Embed containers** - YouTube, maps, other iframes

### Comparison Context
This is one of the simplest components in the Radix UI primitive library - it has no complex state, interactions, or accessibility concerns beyond what the child content requires. It's purely a layout utility primitive.
