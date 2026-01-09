# Semantic UI Classic - Container Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://semantic-ui.com/elements/container.html
Status: ✅ Working
Version: Classic (jQuery-based)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - The documentation provides thorough coverage of container patterns with visual examples showing responsive behavior, integration patterns with other components, and detailed breakpoint information.

## Component Definition
- **Core purpose**: Limits content to a maximum width based on device size, providing a consistent content container that responds to different screen sizes
- **Mental model**: A responsive wrapper that constrains content width while maintaining appropriate margins and gutters. Acts as the foundation for page layout by centering content and preventing overly wide text lines on large screens
- **Semantic meaning**: Establishes content boundaries and hierarchy. A text container signals optimized reading width, while a fluid container indicates full-width utilization. Alignment variations communicate content orientation and emphasis

## Pattern Support Levels
- **Native**: Dedicated class/API
- **Composed**: Via HTML composition with other elements
- **CSS-only**: Requires custom styling

## Container Types
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Standard container | ✅ | Native | Basic responsive container with `class="ui container"` |
| Text container | ✅ | Native | Single-column text optimized with `class="ui text container"` |
| Fluid container | ✅ | Native | Full-width container with `class="ui fluid container"` |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Primary use case - containing flowing text and paragraphs |
| Grid integration | ✅ | Composed | Container wrapping grid for responsive layouts |
| Nested containers | ✅ | Composed | Containers can be nested for hierarchical layouts |
| Mixed content | ✅ | Native | Can contain any HTML elements, components, or content types |

## Responsive Behavior
| Device Type | Container Width | Gutter | Breakpoint | Details |
|-------------|----------------|--------|------------|---------|
| Mobile | 100% | 1em | Below 768px | Full-width with minimal side gutters |
| Tablet | 723px | Fluid | 768px-991px | Fixed width, centered |
| Small Monitor | 933px | Fluid | 992px-1200px | Fixed width, centered |
| Large Monitor | 1127px | Fluid | Above 1200px | Fixed width, centered |

**Width Calculation Formula**: Container widths account for minimum gutter size (1em) and scrollbar width (17px default) to prevent horizontal scrolling.

## Alignment Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Left aligned | ✅ | Native | `class="ui left aligned container"` - content aligned left |
| Center aligned | ✅ | Native | `class="ui center aligned container"` - content centered |
| Right aligned | ✅ | Native | `class="ui right aligned container"` - content aligned right |
| Justified | ✅ | Native | `class="ui justified container"` - text justified edge-to-edge |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| With grid system | ✅ | Composed | Container wrapping grid for responsive column layouts |
| With menu | ✅ | Composed | Container inside menu to align items with page content |
| With segment | ✅ | Composed | Container wrapping segments for consistent content width |
| With header | ✅ | Composed | Container wrapping headers for aligned page titles |
| Stackable menu | ✅ | Composed | Combined with stackable class for mobile responsiveness |

## Code Examples

### Standard Container
```html
<!-- Basic responsive container -->
<div class="ui container">
  <h1 class="ui header">Dogs Roles with Humans</h1>
  <p>Dogs have been domesticated for thousands of years and serve various roles in human society including companionship, herding, protection, and assistance.</p>
  <p>The domestic dog has evolved to live with humans, adapting over thousands of years to changing lifestyles and environments.</p>
</div>
```

**Behavior**: On mobile (below 768px), takes full width with 1em side gutters. On tablet (768px+), constrains to 723px centered. On small monitors (992px+), expands to 933px. On large monitors (1200px+), expands to 1127px.

### Text Container
```html
<!-- Optimized for single-column text content -->
<div class="ui text container">
  <h2>Header</h2>
  <p>This is a text container designed specifically for optimal reading width. It's narrower than a standard container to prevent lines of text from becoming too wide, which can reduce readability.</p>
  <p>Text containers are a simpler markup alternative to using a grid with a single column. They're perfect for blog posts, articles, and other text-heavy content.</p>
  <p>The maximum width is optimized for reading comfort, typically around 50-75 characters per line, which research shows is ideal for comprehension and reading speed.</p>
</div>
```

**Purpose**: Provides narrower maximum width optimized for reading text. Alternative to using a single-column grid. Ideal for articles, blog posts, and text-focused pages.

**Typical Use Case**: Blog posts, documentation pages, article content, terms of service, privacy policies.

### Fluid Container
```html
<!-- Full-width container without maximum width constraint -->
<div class="ui fluid container">
  <h3>Fluid Container</h3>
  <p>A fluid container has no maximum width and will expand to fill its parent container. This is useful for full-width designs or when you need the container to adapt to its parent's size rather than enforcing specific breakpoint widths.</p>
  <p>While it has no max-width, it still provides the container semantics and can be combined with other variations like text alignment.</p>
</div>
```

**Purpose**: Removes maximum width constraint while maintaining container semantics. Useful for setting text alignment or other container variations on unstyled content without width restrictions.

**Typical Use Case**: Full-width hero sections, dashboard layouts, admin interfaces, applications requiring maximum screen space utilization.

### Text Alignment Variations

#### Left Aligned
```html
<div class="ui left aligned container">
  <h2>Left Aligned Container</h2>
  <p>All content within this container is aligned to the left. This is the default alignment for most Western languages and is typically the most readable option for body text.</p>
  <p>Left alignment creates a strong vertical line on the left side, which helps guide the eye down the page.</p>
</div>
```

#### Center Aligned
```html
<div class="ui center aligned container">
  <h2>Center Aligned Container</h2>
  <p>Content in this container is center-aligned. This works well for headers, titles, and short blocks of text where you want to create a balanced, formal appearance.</p>
  <p>Center alignment should be used sparingly for body text as it can reduce readability for longer paragraphs.</p>
</div>
```

**Typical Use Case**: Landing page headers, marketing copy, testimonials, calls-to-action, promotional content.

#### Right Aligned
```html
<div class="ui right aligned container">
  <h2>Right Aligned Container</h2>
  <p>This container aligns content to the right. Useful for right-to-left languages or for creating specific visual effects and emphasis.</p>
  <p>Right alignment can be used for decorative purposes or to create visual interest in certain layouts.</p>
</div>
```

**Typical Use Case**: RTL language content, pull quotes, sidebar content, design accents.

#### Justified Text
```html
<div class="ui justified container">
  <h2>Justified Container</h2>
  <p>Justified text alignment creates even edges on both the left and right sides of the text block by adjusting word spacing. This can create a cleaner, more formal appearance but may reduce readability due to irregular spacing between words.</p>
  <p>Justified alignment is common in print media like newspapers and magazines, where it helps maximize space efficiency and creates a uniform text block appearance.</p>
</div>
```

**Typical Use Case**: Formal documents, print-style layouts, newspaper-style columns, magazine layouts.

**Caution**: Justified text can create irregular word spacing ("rivers" of white space) which may reduce readability, especially on narrow columns or mobile devices.

### Container with Grid System
```html
<!-- Container providing responsive width constraint for grid -->
<div class="ui container">
  <div class="ui grid">
    <div class="four wide column">
      <div class="ui segment">Sidebar</div>
    </div>
    <div class="twelve wide column">
      <div class="ui segment">
        <h3>Main Content</h3>
        <p>The container constrains the overall width of this grid layout, ensuring the content doesn't become too wide on large screens.</p>
      </div>
    </div>
  </div>
</div>
```

**Pattern**: Container wraps grid to provide maximum width constraint while grid handles internal column layout. This is the standard pattern for creating responsive page layouts with consistent width constraints.

**Typical Use Case**: Dashboard layouts, admin panels, content/sidebar layouts, multi-column pages.

### Container with Menu
```html
<!-- Container inside menu to align menu items with page content -->
<div class="ui menu">
  <div class="ui container">
    <a class="item">Home</a>
    <a class="item">About</a>
    <a class="item">Contact</a>
    <div class="right menu">
      <a class="item">Login</a>
    </div>
  </div>
</div>

<!-- Page content with same container width -->
<div class="ui container">
  <h1>Page Content</h1>
  <p>This content aligns perfectly with the menu items above because both use the same container width.</p>
</div>
```

**Pattern**: Placing a container inside a menu ensures menu items align with the main page content container. The menu itself can be full-width while the container constrains the menu items.

**Typical Use Case**: Site navigation, top bars, header menus, footer menus that need to align with page content.

### Container with Segment
```html
<div class="ui container">
  <div class="ui segment">
    <h3>Raised Segment</h3>
    <p>This segment is contained within a container, ensuring consistent width with other page content.</p>
  </div>

  <div class="ui segment">
    <h3>Another Segment</h3>
    <p>Multiple segments can be stacked within a container for consistent layout.</p>
  </div>

  <div class="ui raised segment">
    <h3>Raised Segment</h3>
    <p>Segments provide visual separation while the container maintains width consistency.</p>
  </div>
</div>
```

**Pattern**: Container provides width constraint while segments provide visual separation and grouping of content.

**Typical Use Case**: Content sections, card-like layouts, form sections, dashboard widgets.

### Responsive Menu with Container
```html
<!-- Stackable menu with container for mobile responsiveness -->
<div class="ui stackable menu">
  <div class="ui container">
    <a class="item">
      <i class="home icon"></i> Home
    </a>
    <a class="item">
      <i class="info icon"></i> About
    </a>
    <a class="item">
      <i class="mail icon"></i> Contact
    </a>
    <div class="right menu">
      <div class="item">
        <div class="ui button">Sign Up</div>
      </div>
    </div>
  </div>
</div>

<div class="ui container">
  <h2>Main Content</h2>
  <p>Content that aligns with the menu items.</p>
</div>
```

**Pattern**: Combines stackable menu pattern with container for responsive navigation that aligns with page content on desktop and stacks vertically on mobile.

**Typical Use Case**: Responsive site navigation, mobile-friendly menus, adaptive header navigation.

### Nested Containers
```html
<div class="ui container">
  <h1>Outer Container</h1>
  <p>This is the main container for the page.</p>

  <div class="ui text container">
    <h2>Nested Text Container</h2>
    <p>A narrower text container nested within the standard container for optimal text readability in a specific section.</p>
    <p>This pattern allows you to have wider content in the outer container while constraining text-heavy sections to a more readable width.</p>
  </div>

  <p>Back to the standard container width for other content.</p>
</div>
```

**Pattern**: Containers can be nested to create hierarchical width constraints. A text container within a standard container provides a narrower section for better text readability.

**Typical Use Case**: Article pages with wide images but narrow text, mixed-content pages, pages with alternating wide and narrow sections.

### Combined Alignment and Container Type
```html
<!-- Fluid container with center alignment -->
<div class="ui fluid center aligned container">
  <h1>Welcome to Our Site</h1>
  <p>This is a full-width container with centered content.</p>
  <div class="ui button">Get Started</div>
</div>

<!-- Text container with justified alignment -->
<div class="ui justified text container">
  <h2>Article Title</h2>
  <p>This combines the narrow width of a text container with justified alignment for a traditional print-like appearance. The text is optimized for reading while maintaining even edges.</p>
</div>

<!-- Standard container with right alignment -->
<div class="ui right aligned container">
  <h3>Right Aligned Content</h3>
  <p>Standard container width with right-aligned content.</p>
  <div class="ui button">Action</div>
</div>
```

**Pattern**: Container types (text, fluid, standard) can be combined with alignment classes for precise layout control.

### Full Page Layout Example
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="semantic.min.css">
  <title>Container Example</title>
</head>
<body>
  <!-- Full-width header menu -->
  <div class="ui menu">
    <div class="ui container">
      <a class="item" href="/">Home</a>
      <a class="item">About</a>
      <a class="item">Services</a>
      <div class="right menu">
        <a class="item">Login</a>
      </div>
    </div>
  </div>

  <!-- Main content -->
  <div class="ui container" style="margin-top: 3em;">
    <h1 class="ui header">Page Title</h1>

    <div class="ui text container">
      <h2>Article Content</h2>
      <p>This text container provides optimal reading width for article content. The container ensures consistent alignment with the menu items above.</p>
      <p>Multiple paragraphs of text remain readable and comfortable to scan.</p>
    </div>

    <div class="ui segment">
      <h3>Additional Content Section</h3>
      <p>This segment is back to standard container width.</p>
    </div>
  </div>

  <!-- Full-width footer -->
  <div class="ui inverted vertical footer segment">
    <div class="ui container">
      <div class="ui stackable inverted divided equal height stackable grid">
        <div class="three wide column">
          <h4 class="ui inverted header">About</h4>
          <div class="ui inverted link list">
            <a href="#" class="item">Sitemap</a>
            <a href="#" class="item">Contact Us</a>
          </div>
        </div>
        <div class="three wide column">
          <h4 class="ui inverted header">Services</h4>
          <div class="ui inverted link list">
            <a href="#" class="item">Service 1</a>
            <a href="#" class="item">Service 2</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

**Pattern**: Complete page structure showing how containers are used throughout a typical webpage - in menus, main content area, and footer to maintain consistent alignment and responsive behavior.

## Customization Patterns

### Breakpoint Customization
```less
// In site.variables or theme configuration
@mobileBreakpoint: 320px;
@tabletBreakpoint: 768px;
@computerBreakpoint: 992px;
@largeMonitorBreakpoint: 1200px;
@widescreenMonitorBreakpoint: 1920px;

// Container widths can be customized per breakpoint
@tabletContainer: 723px;
@computerContainer: 933px;
@largeMonitorContainer: 1127px;
@widescreenMonitorContainer: 1127px;
```

**Note**: While container breakpoints respond to standard Semantic UI breakpoints, the actual container widths are calculated using the formula:
`deviceWidth - (gutterWidth * 2) - scrollbarWidth`

Where:
- `gutterWidth` = 1em minimum
- `scrollbarWidth` = 17px (browser default)

### Text Container Width Customization
```less
// Customize text container maximum width
@textWidth: 700px; // Default is optimized for ~70 characters per line

// Adjust for different reading preferences
@textWidth: 600px; // Narrower for easier reading
@textWidth: 800px; // Wider for technical documentation
```

## Notable Features

- **Responsive by default**: Automatically adjusts width based on viewport size without additional classes or configuration
- **Breakpoint-aware**: Built-in responsive breakpoints for mobile, tablet, small monitor, and large monitor sizes
- **Gutter management**: Automatically accounts for minimum gutters and scrollbar width to prevent horizontal scrolling
- **Grid alignment**: Designed to work seamlessly with Semantic UI's grid system for complex layouts
- **Component integration**: Works with menus, segments, headers, and all other Semantic UI components
- **Text optimization**: Dedicated text container variant optimized for readability with ~70 character line length
- **Flexible alignment**: Support for all text alignment options (left, center, right, justified)
- **Fluid variant**: Option to remove maximum width constraint while maintaining container semantics
- **Nested support**: Can be nested for hierarchical width constraints
- **Menu integration pattern**: Special pattern for aligning menu items with page content
- **Minimal markup**: Simple, semantic class-based API requiring only a single wrapper element
- **Customizable breakpoints**: Breakpoint values can be customized via `site.variables` for project-specific needs
- **Class-based API**: Pure CSS implementation with no JavaScript required for core functionality
- **Accessibility**: Maintains semantic HTML structure while providing visual constraints

## Implementation Details

### CSS Architecture
The container is implemented as a pure CSS solution with no JavaScript dependencies. It uses:
- **Media queries** for responsive breakpoint behavior
- **Max-width constraints** calculated per breakpoint
- **Auto margins** for horizontal centering
- **Percentage widths** for mobile/fluid behavior
- **Fixed widths** for tablet and larger screens

### Width Calculation Strategy
Container widths are calculated to ensure:
1. Minimum 1em gutter on each side
2. Compensation for 17px scrollbar width (standard browser default)
3. No horizontal scrolling on any breakpoint
4. Optimal line lengths for text content

Formula: `containerWidth = deviceWidth - (2 * gutterWidth) - scrollbarWidth`

Example for tablet (768px viewport):
- Device width: 768px
- Subtract gutters: 768px - (2 * 16px) = 736px
- Subtract scrollbar: 736px - 17px = 719px
- Actual container: ~723px (rounded for clean values)

### Browser Compatibility
- Works across all modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ support in Semantic UI Classic
- Graceful degradation: Falls back to fluid width in very old browsers
- No JavaScript required for core functionality

### Performance Characteristics
- **Minimal CSS footprint**: Simple max-width rules with media queries
- **No JavaScript overhead**: Pure CSS implementation
- **Paint performance**: Minimal reflows due to container-only width constraints
- **Layout stability**: Fixed widths prevent layout shift on different screen sizes

## Research Notes

- **Design philosophy**: Container follows the principle of "content-first" design by ensuring text and content remain readable across all device sizes. The breakpoint widths are specifically calculated to prevent overly wide text lines which reduce readability.

- **Grid relationship**: While containers constrain overall width, they're designed to work hand-in-hand with Semantic UI's grid system. The container handles page-level width constraints while the grid handles internal layout structure. This separation of concerns is a key architectural decision.

- **Text container rationale**: The text container variant addresses a specific UX concern - optimal reading line length. Research in typography shows that lines between 50-75 characters are optimal for reading comprehension and speed. The text container enforces this without requiring complex grid configurations.

- **Fluid container use case**: The fluid container's primary purpose isn't just full-width layouts, but rather maintaining container semantics (like alignment) on unstyled content without width constraints. This is useful for dashboard interfaces, admin panels, or application layouts where maximum screen space is desired.

- **Alignment as container variation**: Unlike many frameworks where text alignment is a separate utility class, Semantic UI integrates alignment into the container component itself. This suggests alignment is considered a core container behavior rather than a separate concern.

- **Menu integration pattern**: The pattern of placing containers inside menus (rather than the reverse) is noteworthy. This allows the menu background to span full-width while menu items align with page content. This pattern is essential for modern web design where full-width headers are common.

- **Responsive calculation formula**: The explicit accounting for scrollbar width (17px) in container width calculations shows attention to detail in preventing horizontal scrolling. Many frameworks ignore this, leading to subtle scrollbar issues.

- **No JavaScript dependency**: The container being pure CSS reflects Semantic UI Classic's philosophy of progressive enhancement. The core layout functionality works even if JavaScript fails to load or execute.

- **Breakpoint customization**: The ability to customize breakpoints via `site.variables` indicates Semantic UI Classic uses a theming system (likely LESS variables) rather than hardcoded values. This makes the framework adaptable to different project requirements.

- **Nesting behavior**: The documentation's implicit support for nested containers (text container within standard container) shows flexibility in the component's design. This allows for complex layouts with varying width constraints.

- **Historical context**: Semantic UI Classic's container component predates CSS Grid and modern CSS layout tools. It represents a transitional period where responsive design was achieved primarily through media queries and max-width constraints rather than modern layout systems.

- **Component composition**: The container's integration with segments, grids, and menus demonstrates Semantic UI's component composition philosophy - simple, single-purpose components that combine to create complex layouts.

- **Accessibility consideration**: While the documentation doesn't explicitly mention accessibility, the container maintains semantic HTML structure (just a div with classes) and doesn't interfere with screen readers or keyboard navigation.

- **Migration consideration**: For teams migrating from Semantic UI Classic to modern frameworks, the container pattern translates well to CSS container queries, max-width utilities in Tailwind, or custom CSS with modern layout features.

- **Mobile-first approach**: Despite being an older framework, the container's mobile-first responsive behavior (100% width on mobile, fixed widths on larger screens) aligns with modern responsive design principles.

- **Gutter strategy**: The 1em gutter provides relative spacing that scales with the user's font size settings, showing consideration for accessibility and user preferences.

## Comparison with Modern Patterns

### Container Queries
Modern CSS container queries provide more sophisticated containment, but Semantic UI Classic's container predates this feature. The classic approach uses viewport-based media queries which is still valid but less flexible for component-based design.

### CSS Grid/Flexbox
The container component predates widespread CSS Grid adoption. Modern implementations might use Grid's `fr` units or Flexbox for more flexible layouts. However, the container's simple max-width approach has less complexity and better legacy browser support.

### Utility-First Frameworks
Frameworks like Tailwind CSS provide similar functionality through utility classes (`max-w-7xl`, `mx-auto`, etc.). Semantic UI Classic's approach is more opinionated with predefined breakpoints, while utility-first frameworks offer more granular control.

### Modern Component Libraries
React/Vue component libraries often provide Container components with props for configuration. Semantic UI Classic's class-based approach is less flexible but simpler for static sites and non-JavaScript environments.

## Migration Considerations

When migrating to Semantic UI Next or other modern frameworks, consider:

1. **Breakpoint alignment**: Ensure custom breakpoints are carried over
2. **Container widths**: Document any custom width values in theme configuration
3. **Nesting patterns**: Verify nested container behaviors are preserved
4. **Menu integration**: Test menu-with-container patterns work identically
5. **Fluid behavior**: Confirm fluid containers maintain full-width behavior
6. **Text container**: Preserve optimal reading width calculations
7. **Alignment classes**: Map alignment modifiers to new framework equivalents
8. **Grid integration**: Test container + grid combinations thoroughly
9. **Responsive behavior**: Verify breakpoint transitions are smooth
10. **Theme variables**: Migrate any customized `site.variables` values

## Common Use Cases

### Marketing Website
```html
<div class="ui container">
  <div class="ui text container">
    <h1 class="ui center aligned header">Product Name</h1>
    <p class="ui center aligned">Tagline goes here</p>
  </div>
</div>
```

### Blog/Article Layout
```html
<div class="ui container">
  <div class="ui text container">
    <h1>Article Title</h1>
    <div class="meta">By Author Name</div>
    <p>Article content with optimal reading width...</p>
  </div>
</div>
```

### Dashboard Layout
```html
<div class="ui fluid container">
  <div class="ui grid">
    <div class="four wide column">Sidebar</div>
    <div class="twelve wide column">Main content</div>
  </div>
</div>
```

### Documentation Site
```html
<div class="ui container">
  <div class="ui grid">
    <div class="four wide column">
      <!-- Table of contents -->
    </div>
    <div class="twelve wide column">
      <div class="ui text container">
        <!-- Documentation content -->
      </div>
    </div>
  </div>
</div>
```

## Edge Cases and Gotchas

1. **Nested fluid containers**: Nesting fluid containers has no effect since both remove max-width constraints
2. **Container in container**: Nesting standard containers can cause unexpected narrow layouts
3. **Text container with grid**: Text containers may be too narrow for multi-column grids
4. **Alignment on mobile**: Text alignment applies at all breakpoints, which may not be ideal for mobile
5. **Justified text on narrow screens**: Justified text can create poor word spacing on mobile
6. **Scrollbar width variation**: The 17px scrollbar assumption may not hold on all browsers/OS combinations
7. **Container with negative margins**: Negative margins on child elements can break container constraints
8. **Full-bleed content**: Getting content to break out of a container requires careful negative margin calculations

## Best Practices

1. **Use text container for articles**: Apply text containers to long-form content for optimal readability
2. **Align containers with menus**: Place containers inside menus to maintain alignment with page content
3. **Limit container nesting**: Avoid deeply nested containers which can cause overly narrow layouts
4. **Mobile testing**: Always test alignment variations on mobile devices for readability
5. **Gutter consideration**: Be aware of the 1em gutters when positioning content
6. **Fluid for dashboards**: Use fluid containers for data-dense interfaces and dashboards
7. **Consistent usage**: Use the same container type throughout a page for visual consistency
8. **Combine with grid**: Use containers with grids for complex responsive layouts
9. **Breakpoint awareness**: Understand which breakpoints affect container width
10. **Semantic structure**: Don't use containers purely for styling - ensure they serve a semantic layout purpose
