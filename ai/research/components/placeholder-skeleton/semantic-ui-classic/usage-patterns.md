# Semantic UI Classic - Placeholder Usage Patterns

## Component URL
https://semantic-ui.com/elements/placeholder.html

Status: ✅ Working (accessed via documentation sources)
Version: 2.4.0+ (Component added in v2.4.0)
Last Verified: 2025-11-04

## Documentation Quality
**Comprehensive** - Well-documented with clear examples, multiple content types, extensive variation support, and detailed HTML structure examples.

## Component Definition

- **Core purpose**: Reserve space for content that will appear asynchronously in a layout. Provides visual feedback during loading states to improve perceived performance and user experience.

- **Mental model**: A skeleton/shimmer that mimics the layout and structure of content while it loads. Users understand this as "content is loading and will appear here momentarily."

- **Semantic meaning**: Communicates loading state, reduces perceived wait time, prevents layout shift, and provides visual continuity during asynchronous data fetching.

## Pattern Support Levels

- **Native**: Dedicated class-based API (e.g., `class="ui placeholder"`, `class="image header"`)
- **Composed**: Via nested element structure (lines within paragraphs/headers)
- **CSS-only**: Pure CSS implementation with class modifiers

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Line content** | ✅ | Native | Base building block - `<div class="line"></div>` - Variable width lines with length modifiers |
| **Header content** | ✅ | Native | Two types: standard header and image header - `<div class="header">` or `<div class="image header">` |
| **Paragraph content** | ✅ | Native | Container for multiple lines - `<div class="paragraph">` groups lines together |
| **Image placeholder** | ✅ | Native | Block-level image loader - `<div class="image"></div>` with aspect ratio support |
| **Composed structures** | ✅ | Native | Combine headers, paragraphs, and images in single placeholder |

### Content Type Examples

**Lines (Basic Building Block)**:
```html
<div class="ui placeholder">
  <div class="line"></div>
  <div class="line"></div>
  <div class="line"></div>
</div>
```

**Header**:
```html
<div class="ui placeholder">
  <div class="header">
    <div class="line"></div>
    <div class="line"></div>
  </div>
</div>
```

**Image Header** (larger block styling):
```html
<div class="ui placeholder">
  <div class="image header">
    <div class="line"></div>
    <div class="line"></div>
  </div>
</div>
```

**Paragraph**:
```html
<div class="ui placeholder">
  <div class="paragraph">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  </div>
</div>
```

**Image**:
```html
<div class="ui placeholder">
  <div class="image"></div>
</div>
```

**Complete Composed Structure**:
```html
<div class="ui placeholder">
  <div class="image header">
    <div class="line"></div>
    <div class="line"></div>
  </div>
  <div class="paragraph">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  </div>
</div>
```

## Type Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Standard placeholder** | ✅ | Native | Default `ui placeholder` class - white background with gray shimmer |
| **Inverted placeholder** | ✅ | Native | Dark theme variant - `ui inverted placeholder` - for dark backgrounds |
| **Active state** | ✅ | Native | Animated shimmer effect - `ui active placeholder` |

### Type Examples

**Standard Placeholder**:
```html
<div class="ui placeholder">
  <div class="line"></div>
  <div class="line"></div>
</div>
```

**Inverted Placeholder** (for dark backgrounds):
```html
<div class="ui inverted segment">
  <div class="ui inverted placeholder">
    <div class="image header">
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <div class="paragraph">
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</div>
```

**Active/Animated Inverted**:
```html
<div class="ui inverted segment">
  <div class="ui active inverted placeholder">
    <div class="image header">
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <div class="paragraph">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</div>
```

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Static (default)** | ✅ | Native | No animation - base loading state |
| **Active/Animated** | ✅ | Native | Shimmer/pulse animation - `active` class modifier |

### Animation Behavior

The `active` class triggers a subtle shimmer animation (similar to a loading pulse or wave effect) that moves across the placeholder, providing visual feedback that content is actively loading.

**Animated Example**:
```html
<div class="ui active placeholder">
  <div class="line"></div>
  <div class="line"></div>
  <div class="line"></div>
</div>
```

## Variation Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Line length control** | ✅ | Native | Six length modifiers: `full`, `very long`, `long`, `medium`, `short`, `very short` |
| **Fluid width** | ✅ | Native | `fluid` class - expands to fill container width |
| **Image aspect ratios** | ✅ | Native | `square` (1:1) and `rectangular` (4:3) ratio classes |
| **Container integration** | ✅ | Composed | Works within cards, segments, grids for layout consistency |

### Line Length Variations

**All Six Line Lengths**:
```html
<div class="ui placeholder">
  <div class="full line"></div>
  <div class="very long line"></div>
  <div class="long line"></div>
  <div class="medium line"></div>
  <div class="short line"></div>
  <div class="very short line"></div>
</div>
```

**Header with Line Lengths**:
```html
<div class="ui placeholder">
  <div class="header">
    <div class="short line"></div>
    <div class="medium line"></div>
  </div>
</div>
```

**Image Header with Line Lengths**:
```html
<div class="ui placeholder">
  <div class="image header">
    <div class="short line"></div>
    <div class="medium line"></div>
  </div>
  <div class="paragraph">
    <div class="long line"></div>
    <div class="medium line"></div>
  </div>
</div>
```

### Fluid Placeholder

**Fluid Width** (takes full container width):
```html
<div class="ui fluid placeholder">
  <div class="header">
    <div class="line"></div>
    <div class="line"></div>
  </div>
  <div class="paragraph">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  </div>
</div>
```

### Image Aspect Ratios

**Square Image** (1:1 ratio):
```html
<div class="ui placeholder">
  <div class="square image"></div>
</div>
```

**Rectangular Image** (4:3 ratio):
```html
<div class="ui placeholder">
  <div class="rectangular image"></div>
</div>
```

### Container Integration Examples

**Card Placeholder**:
```html
<div class="ui card">
  <div class="content">
    <div class="ui placeholder">
      <div class="header">
        <div class="very short line"></div>
        <div class="medium line"></div>
      </div>
      <div class="paragraph">
        <div class="short line"></div>
        <div class="medium line"></div>
      </div>
    </div>
  </div>
</div>
```

**Raised Segment Placeholder**:
```html
<div class="ui raised segment">
  <div class="ui placeholder">
    <div class="image header">
      <div class="short line"></div>
      <div class="medium line"></div>
    </div>
    <div class="paragraph">
      <div class="large line"></div>
      <div class="medium line"></div>
    </div>
  </div>
</div>
```

**Grid Column Placeholders**:
```html
<div class="ui four column grid">
  <div class="column">
    <div class="ui raised segment">
      <div class="ui placeholder">
        <div class="image header">
          <div class="line"></div>
          <div class="line"></div>
        </div>
        <div class="paragraph">
          <div class="line"></div>
          <div class="line"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="column">
    <div class="ui raised segment">
      <div class="ui placeholder">
        <div class="image header">
          <div class="line"></div>
          <div class="line"></div>
        </div>
        <div class="paragraph">
          <div class="line"></div>
          <div class="line"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- Repeat for additional columns -->
</div>
```

## Code Examples

### Example 1: Basic Placeholder
```html
<!DOCTYPE html>
<html>
<head>
    <title>Semantic UI Placeholder</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
          rel="stylesheet" />
</head>
<body>
    <div class="ui container">
        <h2>Basic Placeholder</h2>
        <div class="ui placeholder">
            <div class="image header">
                <div class="line"></div>
                <div class="line"></div>
            </div>
            <div class="paragraph">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js">
    </script>
</body>
</html>
```

### Example 2: Card Grid with Placeholders
```html
<!DOCTYPE html>
<html>
<head>
    <title>Semantic UI Placeholder Cards</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
          rel="stylesheet" />
</head>
<body>
    <div class="ui container">
        <h3>Card Loading States</h3>
        <div class="ui four column grid">
            <div class="column">
                <div class="ui raised segment">
                    <div class="ui placeholder">
                        <div class="image header">
                            <div class="short line"></div>
                            <div class="medium line"></div>
                        </div>
                        <div class="paragraph">
                            <div class="long line"></div>
                            <div class="medium line"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="ui raised segment">
                    <div class="ui placeholder">
                        <div class="image header">
                            <div class="short line"></div>
                            <div class="medium line"></div>
                        </div>
                        <div class="paragraph">
                            <div class="long line"></div>
                            <div class="medium line"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="ui raised segment">
                    <div class="ui placeholder">
                        <div class="image header">
                            <div class="short line"></div>
                            <div class="medium line"></div>
                        </div>
                        <div class="paragraph">
                            <div class="long line"></div>
                            <div class="medium line"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="ui raised segment">
                    <div class="ui placeholder">
                        <div class="image header">
                            <div class="short line"></div>
                            <div class="medium line"></div>
                        </div>
                        <div class="paragraph">
                            <div class="long line"></div>
                            <div class="medium line"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js">
    </script>
</body>
</html>
```

### Example 3: Inverted Placeholder
```html
<!DOCTYPE html>
<html>
<head>
    <title>Semantic UI Inverted Placeholder</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
          rel="stylesheet" />
</head>
<body>
    <div class="ui container">
        <h3>Dark Theme Loading State</h3>
        <div class="ui inverted segment">
            <div class="ui active inverted placeholder">
                <div class="image header">
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
                <div class="paragraph">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js">
    </script>
</body>
</html>
```

### Example 4: Image Placeholders with Aspect Ratios
```html
<!DOCTYPE html>
<html>
<head>
    <title>Semantic UI Image Placeholders</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
          rel="stylesheet" />
</head>
<body>
    <div class="ui container">
        <h3>Image Loading States</h3>
        <div class="ui two column grid">
            <div class="column">
                <h4>Square Image (1:1)</h4>
                <div style="width: 200px;" class="ui placeholder">
                    <div class="square image"></div>
                </div>
            </div>
            <div class="column">
                <h4>Rectangular Image (4:3)</h4>
                <div style="width: 200px;" class="ui placeholder">
                    <div class="rectangular image"></div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js">
    </script>
</body>
</html>
```

### Example 5: Line Length Variations
```html
<!DOCTYPE html>
<html>
<head>
    <title>Semantic UI Line Lengths</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
          rel="stylesheet" />
</head>
<body>
    <div class="ui container">
        <h3>All Line Length Options</h3>
        <div class="ui segment">
            <div class="ui placeholder">
                <div class="full line"></div>
                <div class="very long line"></div>
                <div class="long line"></div>
                <div class="medium line"></div>
                <div class="short line"></div>
                <div class="very short line"></div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js">
    </script>
</body>
</html>
```

### Example 6: Fluid Placeholder
```html
<!DOCTYPE html>
<html>
<head>
    <title>Semantic UI Fluid Placeholder</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
          rel="stylesheet" />
</head>
<body>
    <div class="ui container">
        <h3>Full-Width Placeholder</h3>
        <div class="ui fluid placeholder">
            <div class="header">
                <div class="line"></div>
                <div class="line"></div>
            </div>
            <div class="paragraph">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js">
    </script>
</body>
</html>
```

## Notable Features

### Class-Based API Architecture

**Pure CSS Implementation**: The entire placeholder system is implemented through CSS classes without requiring JavaScript for visual effects. The shimmer animation is pure CSS.

**Compositional Pattern**: Placeholders are built by nesting semantic elements (header, paragraph, line, image) within the main placeholder container. This mirrors the structure of actual content.

**Semantic Naming**: Class names directly describe the content type they represent (`image header`, `paragraph`, `line`), making the code self-documenting.

### Flexibility and Precision

**Six Line Length Options**: The granular control over line widths (`very short` to `full`) allows developers to closely match the expected content layout, creating more realistic loading states.

**Mixed Content Structures**: A single placeholder can combine image headers, multiple paragraphs, and standalone images, allowing it to match complex content layouts.

**Aspect Ratio Support**: Image placeholders maintain proper aspect ratios (`square` 1:1, `rectangular` 4:3) ensuring they resize correctly in responsive layouts without layout shift.

### Theme Integration

**Inverted Mode**: Full support for dark themes through the `inverted` modifier, ensuring placeholders work well in both light and dark UI contexts.

**Active State**: The `active` class adds subtle shimmer animation, providing visual feedback that content is actively loading rather than stalled.

### Container Compatibility

**Works Everywhere**: Placeholders integrate seamlessly within Semantic UI's grid, segment, and card components, maintaining visual consistency with the design system.

**Fluid Behavior**: The `fluid` class ensures placeholders can expand to fill their container, making them adaptable to any layout width.

## Research Notes

### Access Methodology
- Primary documentation was accessed through multiple sources including GitHub repository documentation files, educational resources (GeeksforGeeks), and search engine results
- Direct access to semantic-ui.com domain was restricted, requiring alternative documentation sources
- All information cross-verified across multiple sources for accuracy

### Component Context
- **Added in version 2.4.0** - This is a relatively newer addition to Semantic UI Classic (likely added around 2018-2019 based on the v2.4.0 timeline)
- The component addresses the modern UX pattern of skeleton/shimmer loading states that became popular in the mid-2010s
- Semantic UI uses the term "Placeholder" while most modern frameworks use "Skeleton" for the same concept

### Documentation Observations
- Well-documented component with clear structural examples
- The class-based API approach is consistent with Semantic UI Classic's overall design philosophy
- Documentation emphasizes composition and nesting patterns
- Examples demonstrate both simple and complex use cases
- Strong focus on visual consistency with the broader Semantic UI design system

### Implementation Approach
- **Pure CSS implementation** - No JavaScript required for the visual effects or structure
- **Compositional model** - Build complex placeholders by nesting simpler elements
- **Class modifiers** - All variations controlled through additional CSS classes
- **Shadow DOM compatibility** - Structure is simple enough to work well in web component contexts

### Unique Aspects
- **Six-tier line length system** - More granular than most frameworks (which typically offer 3-4 levels)
- **Semantic element naming** - `image header` vs just `header` provides clear visual hierarchy
- **Paragraph grouping** - Explicit paragraph containers for organizing lines logically
- **Active state animation** - Built-in CSS shimmer effect through `active` class

### Potential Modern Adaptations
The class-based API could translate well to web components through:
1. **Settings-based configuration**: `settings.variant = 'inverted'`, `settings.fluid = true`
2. **Slot-based composition**: Named slots for header, paragraph, image content
3. **CSS custom properties**: Design tokens for animation timing, colors, spacing
4. **Reactive sizing**: Signal-based line length controls
