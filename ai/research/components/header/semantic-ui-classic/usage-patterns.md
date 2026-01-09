# Semantic UI Classic Header - Usage Patterns Research

## Research Overview

**Component:** Header (Text & Content Hierarchy)
**Framework:** Semantic UI Classic
**Documentation Source:** https://semantic-ui.com/elements/header.html
**Research Date:** November 5, 2025
**Scope:** Complete CSS class inventory, type variations, modifiers, color system, and usage patterns

---

## Component Definition

Headers provide a short summary of content and serve as fundamental UI elements for:
- Establishing page structure and visual hierarchy
- Creating semantic document outlines
- Organizing content into distinct sections
- Emphasizing key information
- Supporting accessibility through proper heading semantics

### Core Philosophy

Semantic UI's header implementation distinguishes between two sizing contexts:
1. **Page Headers** - Scale relative to document base font size (H1-H5)
2. **Content Headers** - Scale relative to surrounding text context

This dual approach enables flexible use across different content scenarios and design patterns.

---

## CSS Class Inventory

### Base Class

```
.ui.header
```

All header variations build upon this fundamental class.

---

## Type Variations

### 1. Page Headers

Hierarchical headers using relative sizing to establish document structure. Best used for major page sections and document outlines.

#### HTML Structure
```html
<h1 class="ui header">Page Title</h1>
<h2 class="ui header">Section Heading</h2>
<h3 class="ui header">Subsection Heading</h3>
<h4 class="ui header">Minor Heading</h4>
<h5 class="ui header">Small Heading</h5>
```

#### CSS Classes
- `.ui.header` combined with semantic `<h1>` through `<h5>` tags
- Sizing determined by HTML heading level
- Fixed font sizes relative to page base (typically 16px)

#### Use Cases
- Main page title/heading
- Major section divisions
- Navigation landmarks
- Document outline structure

#### Key Characteristics
- Font sizes: Decreasing from h1 to h5
- Font weight: Bold for hierarchy
- Margin handling: Built-in spacing for semantic elements
- Accessibility: Proper semantic heading elements for screen readers

---

### 2. Content Headers

Flexible headers sized relative to surrounding text context. Used for headers within content blocks where relative sizing is more appropriate than fixed page hierarchy.

#### Size Classes

| Size | Class | Relative Size | Use Case |
|------|-------|---------------|----------|
| Huge | `.ui.huge.header` | Largest (2.5rem) | Major emphasis, hero sections |
| Large | `.ui.large.header` | Large (2rem) | Section headers, prominent titles |
| Medium | `.ui.medium.header` | Medium (1.5rem) | Default subsections |
| Small | `.ui.small.header` | Small (1.17rem) | Minor headings, cards |
| Tiny | `.ui.tiny.header` | Smallest (0.87rem) | Subtle labels, helper text |

#### HTML Structure
```html
<div class="ui huge header">Huge Content Header</div>
<div class="ui large header">Large Content Header</div>
<div class="ui medium header">Medium Content Header</div>
<div class="ui small header">Small Content Header</div>
<div class="ui tiny header">Tiny Content Header</div>
```

#### Key Characteristics
- Font sizes expressed in `em` units (relative to container)
- Responsive to parent container font-size
- Flexible for use with any element (div, span, etc.)
- No semantic heading implications (use semantic markup separately if needed)

#### Use Cases
- Card titles
- Modal headers
- Widget titles
- Emphasis within text blocks
- Responsive content hierarchies

---

### 3. Icon Headers

Specialized headers designed to emphasize accompanying icons. Icons are visually prominent with text positioned alongside.

#### CSS Class
```
.ui.icon.header
```

#### HTML Structure
```html
<div class="ui icon header">
  <i class="icon"><!-- Icon markup --></i>
  <div class="content">
    <div>Header Text</div>
    <div class="sub header">Optional subheader</div>
  </div>
</div>
```

#### Key Characteristics
- Icon takes visual prominence (larger, positioned prominently)
- Text is secondary but readable
- Content wrapper provides structure
- Supports subheaders within content
- Flexible icon/text ratio

#### Use Cases
- Feature highlights with icons
- Error/success messages with status icons
- Service offerings with representative icons
- Feature lists with visual anchors
- Status indicators with supporting text

#### Icon Integration
```html
<!-- With semantic icons -->
<div class="ui icon header">
  <i class="shield icon"></i>
  <div class="content">
    Secure & Reliable
    <div class="sub header">We take security seriously</div>
  </div>
</div>

<!-- With custom SVG -->
<div class="ui icon header">
  <svg class="icon"><!-- SVG content --></svg>
  <div class="content">Header Text</div>
</div>
```

---

### 4. Sub Headers

Smaller, de-emphasized text accompanying main headers. Used for providing context, metadata, or supporting information.

#### CSS Class
```
.ui.sub.header
```

#### HTML Structure
```html
<div class="ui header">
  Main Header Text
  <div class="sub header">Subheader context or description</div>
</div>

<!-- Or standalone -->
<div class="ui sub header">Supporting text or metadata</div>
```

#### Key Characteristics
- Reduced font size and visual weight
- De-emphasized appearance (lighter color, smaller)
- Used within or alongside main headers
- Supports additional context without distracting

#### Use Cases
- Metadata (dates, authors, categories)
- Supporting descriptions
- Secondary information
- Tags or secondary labels
- Timestamps or status indicators

#### Examples
```html
<!-- Within a header -->
<h2 class="ui header">
  Article Title
  <div class="sub header">Published on November 5, 2025 by John Doe</div>
</h2>

<!-- Standalone usage -->
<div class="ui sub header">Last updated: 2 hours ago</div>

<!-- With emphasis -->
<h3 class="ui header">
  Project Overview
  <div class="sub header">Dashboard • Team: 5 members • Status: Active</div>
</h3>
```

---

### 5. Dividing Headers

Headers that create visual separation from content below using a dividing line.

#### CSS Class
```
.ui.dividing.header
```

#### HTML Structure
```html
<div class="ui dividing header">Section Title</div>
<p>Content below the dividing header...</p>

<!-- With sizes -->
<h2 class="ui large dividing header">Large Dividing Header</h2>

<!-- With content header sizing -->
<div class="ui huge dividing header">Huge Dividing Header</div>
```

#### Key Characteristics
- Bottom border creates visual section break
- Border color typically matches text color (or theme)
- Padding provides appropriate spacing
- Works with all size variations
- Combinable with other modifiers

#### Visual Effect
- Horizontal line spans full width below header text
- Clear visual separation between sections
- Professional, organized appearance
- Commonly used in structured layouts

#### Use Cases
- Section separators in long content
- Card headers with content division
- Form section breaks
- Panel headers
- Content organization in dashboards
- Readable section breaks in articles

#### Examples
```html
<h2 class="ui dividing header">Installation</h2>
<p>Installation instructions...</p>

<h2 class="ui dividing header">Configuration</h2>
<p>Configuration details...</p>

<div class="ui large dividing header">Features</div>
<ul>
  <li>Feature 1</li>
  <li>Feature 2</li>
</ul>

<div class="ui small dividing header">Related Articles</div>
<p>Links to related content...</p>
```

---

### 6. Block Headers

Headers formatted as distinct content blocks. Often used with borders or background colors to create visual emphasis.

#### CSS Class
```
.ui.block.header
```

#### HTML Structure
```html
<div class="ui block header">Block Header</div>

<!-- With size variations -->
<div class="ui large block header">Large Block Header</div>

<!-- With additional styling -->
<div class="ui block header">Important Notice</div>
```

#### Key Characteristics
- Full-width block presentation
- Can incorporate background colors
- Borders optional but common
- Creates visual container/isolation
- Supports all size variations

#### Visual Presentation
- Typically has background color or border
- Padding creates breathing room
- Distinct visual separation
- Pseudo-container appearance

#### Use Cases
- Alert/notification headers
- Call-to-action blocks
- Sidebar section headers
- Panel headers with emphasis
- Dashboard section dividers
- Important notice banners

#### Examples
```html
<!-- Simple block -->
<div class="ui block header">Upcoming Events</div>

<!-- With semantic combination -->
<h3 class="ui large block header">Newsletter Signup</h3>

<!-- In a card-like context -->
<div class="ui segment">
  <div class="ui block header">Account Settings</div>
  <form>
    <!-- Form fields -->
  </form>
</div>
```

---

## Size Variations Summary

| Variation | Class Pattern | Typical Font Size | Best For |
|-----------|---------------|-------------------|----------|
| Huge | `.ui.huge.header` | 2.5rem / em equivalent | Major emphasis, hero content |
| Large | `.ui.large.header` | 2rem / em equivalent | Section headers |
| Medium | `.ui.medium.header` | 1.5rem / em equivalent | Default subsections |
| (Default) | `.ui.header` | 1.14rem / em equivalent | Standard headers |
| Small | `.ui.small.header` | 1.17rem / em equivalent | Minor headings |
| Tiny | `.ui.tiny.header` | 0.87rem / em equivalent | Labels, small text |

---

## Alignment & Positioning Modifiers

### Text Alignment

| Class | Effect | Use Case |
|-------|--------|----------|
| `.center.aligned` | Center-aligned text | Centered titles, emphasis |
| `.left.floated` | Float left in container | Sidenotes, side headers |
| `.right.floated` | Float right in container | Opposite-side positioning |
| `.right` | Right-aligned text | RTL support, right-to-left text |
| `.left` | Left-aligned text | Explicit left alignment |
| `.center` | Center-aligned text (alternative) | Central positioning |

#### HTML Examples
```html
<!-- Center aligned -->
<div class="ui center aligned header">Centered Header</div>

<!-- Left floated (alongside content) -->
<div class="ui left floated header">Sidebar Title</div>

<!-- Right floated -->
<div class="ui right floated header">Right-side Header</div>

<!-- Explicit right alignment -->
<div class="ui right header">Right-aligned Text</div>
```

### Attachment to Adjacent Content

| Class | Effect | Use Case |
|-------|--------|----------|
| `.top.attached.header` | Attaches to top of segment | Top of cards/panels |
| `.bottom.attached.header` | Attaches to bottom | Bottom section headers |
| `.attached.header` | Generic attached header | Default attached styling |

#### HTML Examples
```html
<!-- Top attached -->
<div class="ui top attached header">Card Title</div>
<div class="ui segment">
  <!-- Card content -->
</div>

<!-- Bottom attached -->
<div class="ui segment">
  <!-- Card content -->
</div>
<div class="ui bottom attached header">Footer Info</div>

<!-- Stand-alone attached -->
<div class="ui attached header">Section</div>
```

---

## Color Variations

Semantic UI headers support semantic color modifiers for thematic consistency.

### Color Classes

| Color | Class | Common Usage |
|-------|-------|--------------|
| Black | `.black.header` | Emphasis, strong presence |
| Blue | `.blue.header` | Primary, informational |
| Red | `.red.header` | Alert, error, attention |
| Green | `.green.header` | Success, positive |
| Purple | `.purple.header` | Premium, special |
| Teal | `.teal.header` | Secondary, accent |

#### HTML Examples
```html
<!-- Blue header (informational) -->
<h2 class="ui blue header">Information Section</h2>

<!-- Red header (alert/error) -->
<h3 class="ui red header">Warning: Important Alert</h3>

<!-- Green header (success) -->
<h4 class="ui green header">Success Message</h4>

<!-- Purple header (premium/special) -->
<div class="ui large purple header">Premium Feature</div>

<!-- Teal header (accent) -->
<div class="ui small teal header">Additional Info</div>
```

---

## Visual States & Special Modifiers

### Disabled Headers

| Class | Effect |
|-------|--------|
| `.disabled` | Indicates inactive/unavailable header |

```html
<div class="ui disabled header">Unavailable Section</div>
```

**Visual Effect:**
- Reduced opacity
- Grayed out appearance
- Indicates non-interactive state
- Semantic signal of unavailability

---

### Inverted Headers

| Class | Effect |
|-------|--------|
| `.inverted` | Reversed color scheme for dark backgrounds |

```html
<!-- On dark background -->
<div style="background-color: #333;">
  <h2 class="ui inverted header">Light Text on Dark</h2>
</div>
```

**Visual Effect:**
- Light text on dark backgrounds
- High contrast for readability
- Used with dark segment backgrounds
- Common in inverted color schemes

---

## Combining Modifiers

Semantic UI headers support flexible combination of modifiers for complex use cases.

### Common Combinations

```html
<!-- Large, dividing, centered header -->
<h2 class="ui large center aligned dividing header">Centered Section</h2>

<!-- Small, disabled header with color -->
<div class="ui small disabled red header">Inactive Section</div>

<!-- Large, icon header with dividing line -->
<div class="ui large icon dividing header">
  <i class="settings icon"></i>
  <div class="content">
    Configuration
    <div class="sub header">Customize your settings</div>
  </div>
</div>

<!-- Block header with inverted styling -->
<div class="ui large block inverted header">
  Premium Section
</div>

<!-- Floating header next to content -->
<div class="ui right floated header">Sidebar</div>
<p>Main content here...</p>

<!-- Icon header with size and color -->
<div class="ui large blue icon header">
  <i class="check circle icon"></i>
  <div class="content">
    Success
    <div class="sub header">Operation completed successfully</div>
  </div>
</div>

<!-- Top attached with size -->
<h3 class="ui large top attached header">Card Title</h3>
<div class="ui segment">
  Card content...
</div>
```

---

## Structural Patterns

### Header with Content Wrapper

```html
<div class="ui icon header">
  <i class="shield icon"></i>
  <div class="content">
    Main Title
    <div class="sub header">Supporting subtitle</div>
  </div>
</div>
```

### Header with Image

```html
<div class="ui header">
  <img class="ui circular mini image" src="...">
  <div class="content">
    Username
    <div class="sub header">Member since 2020</div>
  </div>
</div>
```

### Nested Headers

```html
<h1 class="ui header">
  Main Title
  <div class="sub header">Subtitle context</div>
</h1>

<h2 class="ui header">
  Section Title
  <div class="sub header">Section metadata</div>
</h2>
```

### Header in Container

```html
<div class="ui container">
  <h1 class="ui dividing header">Page Title</h1>
  <p>Content...</p>

  <h2 class="ui dividing header">Section</h2>
  <p>Section content...</p>
</div>
```

---

## Accessibility Considerations

### Semantic Markup

```html
<!-- ✅ Good: Semantic heading with UI enhancement -->
<h2 class="ui header">Proper Heading</h2>

<!-- ⚠️ Acceptable: Div with semantic content -->
<div class="ui header" role="heading" aria-level="2">Content Header</div>

<!-- ❌ Avoid: Non-semantic heading structure -->
<span class="ui large header">Not a proper heading</span>
```

### ARIA Attributes

- Semantic `<h1>` through `<h5>` elements provide proper heading semantics
- Use `role="heading"` and `aria-level` for div-based headers when semantic markup isn't possible
- Icon headers should have descriptive text in `.content` for screen readers

### Keyboard Navigation

Headers are typically non-interactive and don't require keyboard support. Interactive elements within headers (links, buttons) should be separately keyboard accessible.

---

## Common Use Cases & Examples

### Documentation/Blog Headers

```html
<article>
  <h1 class="ui dividing header">Article Title</h1>
  <div class="ui sub header">Published on November 5, 2025 by Jane Doe</div>

  <h2 class="ui dividing header">Section One</h2>
  <p>Content here...</p>

  <h3 class="ui dividing header">Subsection</h3>
  <p>More content...</p>
</article>
```

### Dashboard Section Headers

```html
<h2 class="ui large dividing header">Analytics</h2>

<h3 class="ui medium header">Revenue</h3>
<div class="ui segment"><!-- chart --></div>

<h3 class="ui medium header">Users</h3>
<div class="ui segment"><!-- chart --></div>
```

### Card/Panel Headers

```html
<div class="ui card">
  <h3 class="ui top attached header">Card Title</h3>
  <div class="content">
    <!-- Card body -->
  </div>
  <div class="ui bottom attached segment">
    Footer
  </div>
</div>
```

### Feature Highlights with Icons

```html
<div class="ui grid">
  <div class="column">
    <div class="ui icon header">
      <i class="rocket icon"></i>
      <div class="content">
        Fast Performance
        <div class="sub header">Optimized for speed</div>
      </div>
    </div>
  </div>

  <div class="column">
    <div class="ui icon header">
      <i class="shield icon"></i>
      <div class="content">
        Secure & Safe
        <div class="sub header">Enterprise-grade security</div>
      </div>
    </div>
  </div>
</div>
```

### Alert/Notification Headers

```html
<!-- Info alert -->
<h4 class="ui blue dividing header">
  <i class="info icon"></i>
  Information Notice
</h4>

<!-- Warning alert -->
<h4 class="ui red dividing header">
  <i class="warning icon"></i>
  Important Warning
</h4>

<!-- Success alert -->
<h4 class="ui green dividing header">
  <i class="check circle icon"></i>
  Success Message
</h4>
```

---

## Best Practices

### Document Structure
1. Use semantic `<h1>` through `<h5>` tags for proper document outline
2. Maintain heading hierarchy (don't skip levels)
3. Use content headers for non-hierarchical headers
4. Include proper heading level attributes for screen readers

### Visual Consistency
1. Use dividing headers to organize major sections
2. Maintain consistent size hierarchy throughout document
3. Use icon headers for visual emphasis and feature highlights
4. Apply colors consistently based on semantic meaning

### Content Quality
1. Keep header text concise and descriptive
2. Use subheaders for contextual information
3. Avoid excessive styling that reduces readability
4. Ensure sufficient contrast for accessibility

### Mobile Responsiveness
1. Consider header size scaling on smaller screens
2. Test readability on mobile devices
3. Ensure touch targets are appropriate (if interactive elements added)
4. Avoid float-based layouts that don't stack well

---

## CSS Class Reference Table

| Class | Type | Effect | Combinable |
|-------|------|--------|-----------|
| `.ui.header` | Base | Base header styling | Yes |
| `.ui.huge.header` | Size | Largest size (2.5rem) | Yes |
| `.ui.large.header` | Size | Large size (2rem) | Yes |
| `.ui.medium.header` | Size | Medium size (1.5rem) | Yes |
| `.ui.small.header` | Size | Small size (1.17rem) | Yes |
| `.ui.tiny.header` | Size | Tiny size (0.87rem) | Yes |
| `.ui.icon.header` | Type | Icon emphasis format | Yes |
| `.ui.sub.header` | Type | Subheader styling | Yes |
| `.ui.dividing.header` | Type | With bottom divider | Yes |
| `.ui.block.header` | Type | Block presentation | Yes |
| `.ui.disabled` | State | Inactive appearance | Yes |
| `.ui.inverted` | State | Dark background colors | Yes |
| `.black.header` | Color | Black text | Yes |
| `.blue.header` | Color | Blue text | Yes |
| `.red.header` | Color | Red text | Yes |
| `.green.header` | Color | Green text | Yes |
| `.purple.header` | Color | Purple text | Yes |
| `.teal.header` | Color | Teal text | Yes |
| `.left.floated` | Position | Float left | Yes |
| `.right.floated` | Position | Float right | Yes |
| `.center.aligned` | Alignment | Center text | Yes |
| `.left` | Alignment | Left align | Yes |
| `.right` | Alignment | Right align | Yes |
| `.top.attached` | Attach | Connect to top | Yes |
| `.bottom.attached` | Attach | Connect to bottom | Yes |
| `.attached` | Attach | Generic attach | Yes |

---

## Comparison with Modern Frameworks

**Semantic UI Classic** offers a clean, straightforward header implementation focused on:
- Semantic HTML integration (proper heading elements)
- Flexible sizing through dual page/content header contexts
- Simple modifier system for common variations
- Minimal JavaScript (CSS-based implementation)
- Accessibility through semantic markup

This contrasts with modern frameworks that often:
- Provide component-based APIs
- Offer more granular control via props
- Include additional features (truncation, tooltips, etc.)
- Require JavaScript for functionality

**Advantage:** Semantic UI's headers are lightweight, accessible, and follow web standards.

---

## Implementation Recommendations for Modern Semantic UI

When implementing headers in a modern web component version of Semantic UI:

1. **Preserve semantic HTML** - Use proper `<h1>` through `<h6>` elements
2. **Maintain class-based styling** - Support `.ui.header` and modifier classes
3. **Support Shadow DOM** - Encapsulate styles while allowing external CSS customization
4. **Provide size variations** - Support predefined sizes (huge, large, medium, small, tiny)
5. **Include color system** - Support semantic colors (blue, red, green, etc.)
6. **Support type variations** - Icon, dividing, block headers
7. **Ensure accessibility** - Proper heading hierarchy and ARIA attributes
8. **Consider responsive design** - Size adjustments for different viewports

---

## Research Metadata

- **Total CSS Classes:** 30+
- **Type Variations:** 6 (standard, page, content, icon, sub, dividing, block)
- **Size Options:** 6 (huge, large, medium, small, tiny, + default)
- **Color Options:** 6 semantic colors
- **Positioning Options:** 5 (center, left, right, left-floated, right-floated)
- **State Variations:** 2 (disabled, inverted)
- **Combinable Modifiers:** 20+
- **JavaScript Required:** None (pure CSS)
- **Accessibility Features:** Semantic HTML, ARIA support, heading hierarchy

---

## Conclusion

Semantic UI's header component provides a comprehensive, standards-based approach to content hierarchy and visual organization. Its strength lies in:

1. **Simplicity** - Straightforward class-based API
2. **Semantic Foundation** - Built on proper HTML heading elements
3. **Flexibility** - Works with multiple sizing contexts and modifier combinations
4. **Accessibility** - Native support through semantic markup
5. **Performance** - Pure CSS implementation

For modern implementations, these patterns should be preserved while adapting to current web component standards and framework expectations.
