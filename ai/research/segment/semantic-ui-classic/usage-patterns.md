# Semantic UI Classic - Segment Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://semantic-ui.com/elements/segment.html
Status: ✅ Working
Version: Classic (CSS framework)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - The documentation provides thorough coverage of segment patterns including container types, layout options, variations, and state patterns. Strong visual examples demonstrate each pattern's purpose.

## Component Definition
- **Core purpose**: Creates a grouping of related content with visual boundaries. Segments are fundamental layout primitives for organizing and containing content sections - NOT cards (cards are a separate component).
- **Mental model**: A bordered box or container that visually groups related content. Think of it as a "section" or "panel" that separates one content area from another.
- **Semantic meaning**: Communicates content organization and hierarchy through visual separation. Segments can show elevation (raised), stacking depth (stacked/piled), emphasis levels, and attachment relationships.

## Pattern Support Levels
- **Native**: Dedicated CSS class
- **Composed**: Via HTML composition and nesting
- **CSS-only**: Requires custom styling (all Semantic UI Classic patterns are CSS-only)

## Container Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic segment | ✅ | Native | Standard bordered container with `class="ui segment"` |
| Raised | ✅ | Native | `class="ui raised segment"` - elevated with shadow effect |
| Stacked | ✅ | Native | `class="ui stacked segment"` - appears as layered pages |
| Piled | ✅ | Native | `class="ui piled segment"` - stack of pages effect with negative z-index |
| Vertical segment | ✅ | Native | `class="ui vertical segment"` - for vertical group arrangements |
| Placeholder | ✅ | Native | `class="ui placeholder segment"` - reserves space for conditional content (v2.4.0+) |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Standard text and paragraphs within segment |
| Headers | ✅ | Composed | Any heading elements (h1-h6) within segment |
| Nested segments | ✅ | Composed | Segments can contain other segments |
| Floated content | ✅ | Composed | Use with clearing variation for float management |
| Inline content | ✅ | Composed | Inline-block content via wrapper class |
| Images | ✅ | Composed | Image elements within segments |
| Mixed content | ✅ | Composed | Any combination of standard HTML content |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Colors | ✅ | Native | 13 colors: red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, grey, black |
| Primary emphasis | ✅ | Native | `class="ui primary segment"` - highest emphasis level |
| Secondary emphasis | ✅ | Native | `class="ui secondary segment"` - moderate emphasis |
| Tertiary emphasis | ✅ | Native | `class="ui tertiary segment"` - subtle emphasis |
| Inverted | ✅ | Native | `class="ui inverted segment"` - reversed color scheme for dark backgrounds |
| Padded | ✅ | Native | `class="ui padded segment"` or `very padded` - increased internal spacing |
| Compact | ✅ | Native | `class="ui compact segment"` - minimal space usage |
| Circular | ✅ | Native | `class="ui circular segment"` - round container (requires manual sizing) |
| Basic | ✅ | Native | `class="ui basic segment"` - minimal formatting, no special styling |
| Clearing | ✅ | Native | `class="ui clearing segment"` - clears floated content within |
| Floated | ✅ | Native | `class="ui left floated segment"` or `right floated` - aligns within parent |
| Text alignment | ✅ | Native | `class="ui left aligned segment"`, `center aligned`, or `right aligned` |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Attached | ✅ | Native | `class="ui attached segment"` - seamless borders with adjacent content |
| Top attached | ✅ | Native | `class="ui top attached segment"` - attaches to content below |
| Bottom attached | ✅ | Native | `class="ui bottom attached segment"` - attaches to content above |
| Attached to header | ✅ | Composed | Segments can attach to headers seamlessly |
| Attached to message | ✅ | Composed | Segments can attach to message components |
| Segment groups | ✅ | Native | `class="ui segments"` - standard grouped arrangement |
| Horizontal segments | ✅ | Native | `class="ui horizontal segments"` - side-by-side layout |
| Raised group | ✅ | Native | `class="ui raised segments"` - entire group elevated |
| Stacked group | ✅ | Native | `class="ui stacked segments"` - group with stacked appearance |
| Piled group | ✅ | Native | `class="ui piled segments"` - group with pile effect |
| Nested groups | ✅ | Composed | Groups can contain nested groups |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `class="ui disabled segment"` - shows inactive/non-interactive state |
| Loading | ✅ | Native | `class="ui loading segment"` - displays loading indicator (compatible with loaders/placeholders) |

## Code Examples

### Basic Segment
```html
<!-- Standard Segment -->
<div class="ui segment">
  <p>A segment is used to create a grouping of related content.</p>
</div>

<!-- Segment with Header -->
<div class="ui segment">
  <h3>User Profile</h3>
  <p>Profile information goes here.</p>
</div>
```

### Container Types

#### Raised Segment
```html
<div class="ui raised segment">
  <p>Pellentesque habitant morbi tristique senectus.</p>
</div>
```

#### Stacked Segment
```html
<div class="ui stacked segment">
  <p>This segment appears as if stacked on top of other pages.</p>
</div>
```

#### Piled Segment
```html
<div class="ui piled segment">
  <h4>A Piled Segment</h4>
  <p>Pellentesque habitant morbi tristique senectus.</p>
</div>
```

#### Vertical Segment
```html
<div class="ui vertical segment">
  <p>Content in vertical group arrangement.</p>
</div>
<div class="ui vertical segment">
  <p>Another vertical segment.</p>
</div>
```

#### Placeholder Segment
```html
<!-- New in v2.4.0 - reserves space for conditional content -->
<div class="ui placeholder segment">
  <div class="ui icon header">
    <i class="pdf file outline icon"></i>
    No documents are listed for this customer.
  </div>
  <div class="ui primary button">Add Document</div>
</div>
```

### Color Variations
```html
<!-- Primary Color -->
<div class="ui red segment">
  <p>Red segment</p>
</div>

<!-- All Colors -->
<div class="ui orange segment">Orange</div>
<div class="ui yellow segment">Yellow</div>
<div class="ui olive segment">Olive</div>
<div class="ui green segment">Green</div>
<div class="ui teal segment">Teal</div>
<div class="ui blue segment">Blue</div>
<div class="ui violet segment">Violet</div>
<div class="ui purple segment">Purple</div>
<div class="ui pink segment">Pink</div>
<div class="ui brown segment">Brown</div>
<div class="ui grey segment">Grey</div>
<div class="ui black segment">Black</div>
```

### Emphasis Levels
```html
<!-- Primary Emphasis -->
<div class="ui primary segment">
  <p>This segment is styled with primary emphasis.</p>
</div>

<!-- Secondary Emphasis -->
<div class="ui secondary segment">
  <p>This segment is styled with secondary emphasis.</p>
</div>

<!-- Tertiary Emphasis -->
<div class="ui tertiary segment">
  <p>This segment is styled with tertiary emphasis - subtle and requires deliberate viewing.</p>
</div>
```

### Inverted Segments
```html
<!-- Inverted Segment (for dark backgrounds) -->
<div class="ui inverted segment">
  <p>This segment has inverted colors for dark backgrounds.</p>
</div>

<!-- Inverted with Colors -->
<div class="ui inverted red segment">Red Inverted</div>
<div class="ui inverted blue segment">Blue Inverted</div>
<div class="ui inverted teal segment">Teal Inverted</div>
```

### Spacing Variations
```html
<!-- Padded -->
<div class="ui padded segment">
  <p>This segment has increased padding.</p>
</div>

<!-- Very Padded -->
<div class="ui very padded segment">
  <p>This segment has a lot of padding.</p>
</div>

<!-- Compact -->
<div class="ui compact segment">
  <p>Compact segment with minimal space.</p>
</div>
```

### Special Variations

#### Circular Segment
```html
<!-- Note: Requires manual sizing to maintain equal width/height -->
<div class="ui circular segment" style="width: 200px; height: 200px;">
  <h2>Circle</h2>
  <p>Content here</p>
</div>
```

#### Basic Segment
```html
<!-- Minimal styling -->
<div class="ui basic segment">
  <p>This segment has minimal styling - no border or background.</p>
</div>
```

#### Clearing Segment
```html
<!-- Clears floated content -->
<div class="ui clearing segment">
  <div style="float: left;">Floated Left</div>
  <div style="float: right;">Floated Right</div>
</div>
```

### Layout Patterns

#### Attached Segments
```html
<!-- Top Attached -->
<div class="ui top attached segment">
  <p>This segment is attached to the segment below.</p>
</div>
<div class="ui attached segment">
  <p>This segment is attached to both segments.</p>
</div>
<div class="ui bottom attached segment">
  <p>This segment is attached to the segment above.</p>
</div>

<!-- Attached to Header -->
<h3 class="ui top attached header">
  User Profile
</h3>
<div class="ui attached segment">
  <p>Profile content goes here.</p>
</div>

<!-- Attached to Message -->
<div class="ui attached message">
  <div class="header">Welcome!</div>
  <p>Fill out the form below to sign-up for a new account</p>
</div>
<div class="ui bottom attached segment">
  <form class="ui form">
    <!-- Form fields -->
  </form>
</div>
```

#### Segment Groups
```html
<!-- Standard Group -->
<div class="ui segments">
  <div class="ui segment">
    <p>First segment in group</p>
  </div>
  <div class="ui segment">
    <p>Second segment in group</p>
  </div>
  <div class="ui segment">
    <p>Third segment in group</p>
  </div>
</div>

<!-- Horizontal Segments -->
<div class="ui horizontal segments">
  <div class="ui segment">
    <p>Left</p>
  </div>
  <div class="ui segment">
    <p>Middle</p>
  </div>
  <div class="ui segment">
    <p>Right</p>
  </div>
</div>

<!-- Raised Group -->
<div class="ui raised segments">
  <div class="ui segment">
    <p>First segment</p>
  </div>
  <div class="ui segment">
    <p>Second segment</p>
  </div>
</div>

<!-- Stacked Group -->
<div class="ui stacked segments">
  <div class="ui segment">
    <p>First segment</p>
  </div>
  <div class="ui segment">
    <p>Second segment</p>
  </div>
</div>

<!-- Piled Group -->
<div class="ui piled segments">
  <div class="ui segment">
    <p>First segment</p>
  </div>
  <div class="ui segment">
    <p>Second segment</p>
  </div>
</div>

<!-- Nested Groups -->
<div class="ui segments">
  <div class="ui segment">
    <p>Top Level</p>
  </div>
  <div class="ui segments">
    <div class="ui segment">
      <p>Nested segment 1</p>
    </div>
    <div class="ui segment">
      <p>Nested segment 2</p>
    </div>
  </div>
  <div class="ui segment">
    <p>Bottom Level</p>
  </div>
</div>
```

### Text Alignment
```html
<!-- Left Aligned -->
<div class="ui left aligned segment">
  <p>Left aligned content</p>
</div>

<!-- Center Aligned -->
<div class="ui center aligned segment">
  <p>Center aligned content</p>
</div>

<!-- Right Aligned -->
<div class="ui right aligned segment">
  <p>Right aligned content</p>
</div>
```

### Floated Segments
```html
<!-- Left Floated -->
<div class="ui left floated segment">
  <p>This segment floats left</p>
</div>

<!-- Right Floated -->
<div class="ui right floated segment">
  <p>This segment floats right</p>
</div>
```

### State Patterns
```html
<!-- Disabled State -->
<div class="ui disabled segment">
  <p>This segment is disabled and appears inactive.</p>
</div>

<!-- Loading State -->
<div class="ui loading segment">
  <p>This content is loading...</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
</div>
```

### Nested Segments
```html
<!-- Segment within Segment -->
<div class="ui segment">
  <h3>Outer Segment</h3>
  <div class="ui segment">
    <p>Inner nested segment</p>
  </div>
  <p>More outer content</p>
</div>

<!-- Multiple Nesting Levels -->
<div class="ui segment">
  <h3>Level 1</h3>
  <div class="ui segment">
    <h4>Level 2</h4>
    <div class="ui segment">
      <p>Level 3 - nested segments can go deep</p>
    </div>
  </div>
</div>
```

### Combined Patterns
```html
<!-- Raised + Padded + Colored -->
<div class="ui raised very padded blue segment">
  <h3>Premium Content</h3>
  <p>This segment combines multiple modifiers.</p>
</div>

<!-- Inverted + Primary + Attached -->
<h3 class="ui top attached inverted header">
  Dark Header
</h3>
<div class="ui attached inverted primary segment">
  <p>Dark themed content area.</p>
</div>

<!-- Compact + Basic + Floated -->
<div class="ui compact basic right floated segment">
  <p>Minimal floated box</p>
</div>
```

## Notable Features

### Core Design Principles
- **Visual hierarchy through depth**: Raised, stacked, and piled variations create visual depth cues without adding semantic complexity
- **Not a card component**: Segments are basic containers for content grouping, distinct from Semantic UI's Card component which has specific semantic meaning for entity representation
- **Pure CSS implementation**: All patterns achieved through CSS classes without JavaScript dependencies
- **Flexible composition**: Segments can be nested, grouped, attached, and combined with other Semantic UI components

### Unique Patterns
- **Piled segments**: Unique stacking effect using negative z-index positioning that creates the illusion of multiple pages
- **Placeholder segment**: Dedicated pattern (v2.4.0+) for empty states and conditional content display
- **Attachment system**: Seamless border connection between segments and other components (headers, messages)
- **Group composition**: Powerful grouping system with independent styling for entire groups

### Layout Capabilities
- **Horizontal segments**: Built-in support for side-by-side segment layouts
- **Nested groups**: Groups can contain nested groups for complex hierarchical layouts
- **Float management**: Built-in clearing variation for managing floated content
- **Text alignment**: Direct support for left, center, and right text alignment

### Styling Flexibility
- **Comprehensive color palette**: 13 semantic and decorative colors
- **Three emphasis levels**: Primary, secondary, and tertiary for content hierarchy
- **Inverted theming**: Special consideration for dark background usage with inverted color schemes
- **Spacing control**: Padded (regular and very), compact variations for different density needs
- **Circular shape**: Dedicated support for circular containers (requires manual sizing)
- **Basic style**: Minimal styling option removes borders and backgrounds

### Technical Considerations
- **Circular sizing**: Circular segments require manual width/height specification to maintain proper proportions
- **Z-index awareness**: Piled segments use negative z-index, requiring z-index management on offset containers
- **Loading state compatibility**: Loading state works with loaders and placeholder components
- **Attachment semantics**: Attached segments remove internal borders for seamless visual connection

### Framework Integration
- **Class-based API**: All variations achieved through composable CSS classes following consistent naming pattern
- **Component interoperability**: Works seamlessly with other Semantic UI components (headers, messages, forms)
- **CSS-only framework**: Classic Semantic UI is a CSS framework - no JavaScript required for visual patterns
- **Responsive considerations**: Can be combined with Semantic UI grid system for responsive layouts

## Research Notes

### Semantic Distinction
- **Segment vs Card**: Segments are generic containers for content grouping. Cards are semantic components representing distinct entities (products, users, articles) with specific structure expectations. Do not conflate these two component types.
- **Segment vs Container**: Segments have visible borders/backgrounds and are part of visual design. Containers are layout utilities for width constraints.

### Design Philosophy
- **Visual separation over semantic meaning**: Segments primarily serve visual organization rather than semantic HTML structure
- **Composability first**: Heavy emphasis on combining classes for sophisticated visual effects
- **Depth cues through CSS**: Raised, stacked, and piled patterns create depth perception purely through CSS effects

### Pattern Evolution
- **Placeholder pattern addition**: The placeholder segment pattern was added in v2.4.0, showing evolution toward modern empty-state patterns
- **Emphasis levels**: Three-level emphasis system (primary/secondary/tertiary) provides more nuanced hierarchy than binary systems
- **Attachment system**: The attachment pattern enables complex UI compositions with seamless visual connections

### Implementation Notes
- **No JavaScript dependency**: Unlike some Semantic UI components (dropdown, modal), segments are purely CSS-based
- **Grid compatibility**: While segments can contain grids, they're distinct from the grid system
- **Performance**: CSS-only implementation means no runtime performance overhead
- **Theming**: Segments respect Semantic UI's theming system through CSS variables and LESS variables

### Historical Context
- **Classic Semantic UI**: This is the original jQuery-based CSS framework, not the modern React port (Semantic UI React)
- **Foundation element**: Segments are one of the most fundamental building blocks in Semantic UI's design system
- **CSS framework approach**: Predates modern component frameworks, using utility-style class composition

### Usage Recommendations
- **Prefer groups over nesting**: For multiple related sections, use segment groups rather than deeply nested segments
- **Circular sizing**: Always specify both width and height for circular segments to maintain shape
- **Loading states**: Ensure adequate initial content size when using loading state to prevent layout shift
- **Inverted usage**: Reserve inverted segments for genuinely dark backgrounds to maintain proper contrast
- **Attachment planning**: Plan attachment relationships carefully as they remove borders and can affect visual hierarchy

### Common Patterns
- **Form containers**: Segments are commonly used to contain forms with attached headers
- **Content sections**: Main use case is separating distinct content areas on a page
- **Dashboard panels**: Raised segments often used for dashboard widgets and panels
- **Empty states**: Placeholder segments ideal for showing empty states with call-to-action buttons
- **Card-like layouts**: While not cards semantically, raised/padded segments can create card-like visual effects

### Browser Compatibility
- **CSS-based**: Works in all browsers supporting CSS3 box-shadow and border-radius
- **No polyfills needed**: Pure CSS implementation requires no JavaScript polyfills
- **Degradation**: Gracefully degrades in older browsers to basic bordered containers
