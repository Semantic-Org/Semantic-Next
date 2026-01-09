# Semantic UI Classic - Header Usage Patterns

## Component URL
https://semantic-ui.com/elements/header.html
Status: ✅ Working
Version: Semantic UI 2.x (jQuery-based)
Last Verified: 2025-11-05

## Documentation Quality
**Assessment: Good** - The documentation provides clear examples, comprehensive variations, and visual demonstrations of all header types and states. The organization distinguishes between page headers (rem-based) and content headers (em-based), showing understanding of responsive typography. However, accessibility information, keyboard navigation, and semantic HTML details are limited. No explicit version information or migration guides provided.

**Strengths:**
- Clear visual examples for all variations
- Logical categorization (types, states, variations)
- Multiple color and styling options demonstrated
- Good distinction between page vs content headers

**Gaps:**
- Limited accessibility documentation
- No ARIA attribute guidance
- Missing semantic HTML best practices
- No keyboard interaction patterns
- Limited responsive behavior details

## Component Definition
- **Core purpose**: Establish visual hierarchy and provide short summaries of content sections. Headers serve as navigation landmarks and content organization tools within pages and components.
- **Mental model**: Think of headers as semantic signposts that establish content structure. Page headers (h1-h5) create document hierarchy, while content headers provide flexible, context-aware emphasis that scales with surrounding content.
- **Semantic meaning**: Headers communicate both visual prominence and structural importance. They signal to users and assistive technologies where content sections begin and what those sections contain.

## Pattern Support Levels
- **Native**: Built-in support through CSS classes applied to HTML heading elements (h1-h5) or div elements with header class. The component provides styling and layout through CSS, with minimal JavaScript required (only for theme switching or dynamic content).
- **Composed**: Headers support composition through sub-headers, icons, and images as nested elements. Multiple elements combine within a single header container to create rich, meaningful headers.
- **CSS-only**: All visual variations (colors, alignment, sizing, dividers) are implemented purely through CSS classes. No JavaScript initialization required for basic header functionality.

## Core Patterns

### Header Types
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Page Headers | ✅ | Native | h1-h5 elements sized with rem units, independent of container context |
| Content Headers | ✅ | Native | Sized with em units (Huge, Large, Medium, Small, Tiny), responsive to container font-size |
| Icon Headers | ✅ | Composed | Header emphasizing icon alongside text content |
| Sub Headers | ✅ | Composed | Smaller label content within or below main header text |

### Sizing Systems

#### Page Headers (rem-based)
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| h1 / First Header | ✅ | Native | Largest page header, 2rem default |
| h2 / Second Header | ✅ | Native | 1.714rem default |
| h3 / Third Header | ✅ | Native | 1.28rem default |
| h4 / Fourth Header | ✅ | Native | 1.071rem default |
| h5 / Fifth Header | ✅ | Native | 1rem default |

#### Content Headers (em-based)
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Huge | ✅ | Native | Largest content header, scales with container |
| Large | ✅ | Native | Large content header |
| Medium | ✅ | Native | Default content header size |
| Small | ✅ | Native | Smaller content header |
| Tiny | ✅ | Native | Smallest content header |

### Layout Variations
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Dividing | ✅ | CSS-only | Adds horizontal divider below header |
| Block | ✅ | CSS-only | Formats header as content block with padding and background |
| Attached | ✅ | CSS-only | Attaches to adjacent content (Top, Middle, Bottom positions) |
| Floating | ✅ | CSS-only | Floats header left or right within content flow |

### Text Alignment
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Left Aligned | ✅ | CSS-only | Default left text alignment |
| Center Aligned | ✅ | CSS-only | Center-aligned text |
| Right Aligned | ✅ | CSS-only | Right-aligned text |
| Justified | ❌ | N/A | Not provided as built-in variation |

### Color Variations
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Red | ✅ | CSS-only | Red color scheme |
| Orange | ✅ | CSS-only | Orange color scheme |
| Yellow | ✅ | CSS-only | Yellow color scheme |
| Olive | ✅ | CSS-only | Olive color scheme |
| Green | ✅ | CSS-only | Green color scheme |
| Teal | ✅ | CSS-only | Teal color scheme |
| Blue | ✅ | CSS-only | Blue color scheme |
| Violet | ✅ | CSS-only | Violet color scheme |
| Purple | ✅ | CSS-only | Purple color scheme |
| Pink | ✅ | CSS-only | Pink color scheme |
| Brown | ✅ | CSS-only | Brown color scheme |
| Grey | ✅ | CSS-only | Grey color scheme |

### States
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | CSS-only | Reduces opacity to show inactive/disabled state |
| Inverted | ✅ | CSS-only | Light text on dark backgrounds, optimized for contrast |

### Content Elements
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Icon | ✅ | Composed | Icon element within header |
| Image | ✅ | Composed | Image element (circular, avatar, logo) within header |
| Sub Header | ✅ | Composed | Secondary text below or within main header |
| Multiple Lines | ✅ | Composed | Multi-line header content support |

## Code Examples

### Page Headers (Semantic HTML)
```html
<!-- Proper semantic page headers using h1-h5 -->
<h1 class="ui header">First Header</h1>
<h2 class="ui header">Second Header</h2>
<h3 class="ui header">Third Header</h3>
<h4 class="ui header">Fourth Header</h4>
<h5 class="ui header">Fifth Header</h5>
```

### Content Headers (Context-Sensitive)
```html
<!-- Content headers sized with em (scales with container) -->
<div class="ui huge header">Huge Header</div>
<div class="ui large header">Large Header</div>
<div class="ui medium header">Medium Header</div>
<div class="ui small header">Small Header</div>
<div class="ui tiny header">Tiny Header</div>
```

### Icon Headers
```html
<!-- Icon header with text -->
<h2 class="ui icon header">
  <i class="settings icon"></i>
  <div class="content">
    Account Settings
    <div class="sub header">Manage your preferences</div>
  </div>
</h2>

<!-- Circular icon header -->
<h2 class="ui icon header">
  <i class="circular users icon"></i>
  <div class="content">
    Friends
  </div>
</h2>
```

### Sub Headers
```html
<!-- Header with sub header -->
<div class="ui header">
  Account Settings
  <div class="sub header">Manage your account settings and preferences</div>
</div>

<!-- Multiple sub headers -->
<h2 class="ui header">
  <img class="ui circular image" src="/images/avatar.jpg">
  <div class="content">
    Username
    <div class="sub header">Manage your account</div>
  </div>
</h2>
```

### Image Headers
```html
<!-- Header with image -->
<h2 class="ui header">
  <img src="/images/logo.png">
  <div class="content">
    Company Name
  </div>
</h2>

<!-- Header with circular image -->
<h2 class="ui header">
  <img class="ui circular image" src="/images/avatar.jpg">
  <div class="content">
    Patrick
    <div class="sub header">Last activity 2 hours ago</div>
  </div>
</h2>
```

### Dividing Header
```html
<!-- Header with bottom divider -->
<h4 class="ui dividing header">
  Section Title
</h4>
<p>Content that follows the dividing header...</p>
```

### Block Header
```html
<!-- Header formatted as block element -->
<h3 class="ui block header">
  Block Header
</h3>
```

### Attached Headers
```html
<!-- Top attached header -->
<h3 class="ui top attached header">
  Dogs Characteristics
</h3>
<div class="ui attached segment">
  <p>Dogs are one of the most common household pets.</p>
</div>
<h3 class="ui attached header">
  Types of Dogs
</h3>
<div class="ui attached segment">
  <p>There are many breeds of dogs.</p>
</div>
<h3 class="ui bottom attached header">
  Caring for Dogs
</h3>
```

### Floating Headers
```html
<!-- Left floated header -->
<h3 class="ui left floated header">
  Left Header
</h3>

<!-- Right floated header -->
<h3 class="ui right floated header">
  Right Header
</h3>
```

### Text Alignment
```html
<!-- Right aligned -->
<h2 class="ui right aligned header">
  Right Aligned
</h2>

<!-- Center aligned -->
<h2 class="ui center aligned header">
  Center Aligned
</h2>

<!-- Left aligned (default) -->
<h2 class="ui left aligned header">
  Left Aligned
</h2>
```

### Colored Headers
```html
<!-- Various color options -->
<h4 class="ui red header">Red Header</h4>
<h4 class="ui orange header">Orange Header</h4>
<h4 class="ui yellow header">Yellow Header</h4>
<h4 class="ui olive header">Olive Header</h4>
<h4 class="ui green header">Green Header</h4>
<h4 class="ui teal header">Teal Header</h4>
<h4 class="ui blue header">Blue Header</h4>
<h4 class="ui violet header">Violet Header</h4>
<h4 class="ui purple header">Purple Header</h4>
<h4 class="ui pink header">Pink Header</h4>
<h4 class="ui brown header">Brown Header</h4>
<h4 class="ui grey header">Grey Header</h4>
```

### Inverted Headers
```html
<!-- Inverted header for dark backgrounds -->
<div class="ui inverted segment">
  <h4 class="ui inverted header">Inverted Header</h4>
  <h4 class="ui inverted red header">Inverted Red</h4>
  <h4 class="ui inverted blue header">Inverted Blue</h4>
</div>
```

### Disabled State
```html
<!-- Disabled header -->
<h3 class="ui disabled header">
  Disabled Header
</h3>
```

## Styling Approaches

### Class-Based System
Semantic UI uses a class-based styling approach where all variations are achieved through CSS classes applied to HTML elements. No JavaScript initialization is required for headers.

**Base Class:** `ui header`

**Modifier Classes:**
- Size: `huge`, `large`, `medium`, `small`, `tiny`
- Layout: `dividing`, `block`, `attached`, `top attached`, `bottom attached`, `floating`, `left floated`, `right floated`
- Alignment: `left aligned`, `center aligned`, `right aligned`
- Color: `red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey`
- State: `disabled`, `inverted`
- Type: `icon` (for icon headers)

### Sizing Philosophy

**Page Headers (rem-based):**
- Use semantic HTML heading elements (h1-h5)
- Sized in rem units (relative to root font size)
- Maintain consistent sizing regardless of container
- Establish document hierarchy

**Content Headers (em-based):**
- Use div elements with size classes
- Sized in em units (relative to parent font size)
- Scale with surrounding content context
- Provide flexible emphasis within content areas

### Composition Patterns

Headers support nested content elements:
```html
<div class="ui header">
  <i class="icon"></i>         <!-- Icon -->
  <img class="image">           <!-- Image -->
  <div class="content">         <!-- Main content wrapper -->
    Main Header Text
    <div class="sub header">    <!-- Sub header -->
      Secondary text
    </div>
  </div>
</div>
```

### Responsive Behavior
- Page headers maintain fixed sizes based on root font size
- Content headers scale proportionally with container font-size
- Floating headers adapt to container width
- No explicit mobile-first breakpoint modifiers documented

### Theming
Semantic UI Classic supports multiple themes:
- Default
- Classic
- Bookish
- Chubby
- Material

Theme switching affects typography, spacing, colors, and visual treatment of headers.

## Accessibility Patterns

### Semantic HTML Support
- Uses proper heading hierarchy (h1-h5) for page structure
- Supports semantic heading elements natively
- Allows div-based headers for non-hierarchical content

### ARIA Considerations
**Not explicitly documented**, but best practices would include:
- Using semantic heading elements when establishing page hierarchy
- Using `role="heading"` and `aria-level` for div-based headers
- Ensuring color is not the only means of conveying information
- Providing sufficient color contrast for colored headers

### Keyboard Navigation
**Not documented** - Headers are typically non-interactive elements and don't require keyboard navigation unless they contain interactive elements (links, buttons).

### Screen Reader Support
- Semantic heading elements (h1-h5) are naturally announced by screen readers with proper hierarchy
- Sub headers may need `aria-describedby` or careful markup to ensure proper association
- Icon-only headers should include visually hidden text or `aria-label`

### Best Practices (Inferred)
```html
<!-- Good: Semantic heading with proper hierarchy -->
<h2 class="ui header">Section Title</h2>

<!-- Good: Icon header with text content -->
<h2 class="ui icon header">
  <i class="settings icon"></i>
  <div class="content">Settings</div>
</h2>

<!-- Caution: Icon-only header needs accessible text -->
<h2 class="ui icon header">
  <i class="settings icon" aria-label="Settings"></i>
</h2>

<!-- Good: Sub header with proper nesting -->
<h2 class="ui header">
  Main Title
  <div class="sub header">Descriptive subtitle</div>
</h2>
```

## Notable Features

### Dual Sizing Systems
**Unique distinction** between page headers (rem-based) and content headers (em-based), providing both fixed hierarchy and contextual flexibility. This addresses two different use cases:
- Page headers maintain visual consistency across document structure
- Content headers adapt to their surrounding content context

### Rich Composition
Headers support multiple nested elements (icons, images, sub headers) within a single component, enabling expressive, information-dense headers without complex markup.

### Extensive Color Palette
Provides 12 built-in color variations plus inverted options, offering wide theming flexibility without custom CSS.

### Flexible Layout Options
- Dividing headers create visual separation
- Block headers provide emphasis through background and padding
- Attached headers connect to adjacent content
- Floating headers enable inline positioning

### No JavaScript Required
Pure CSS implementation means headers work without JavaScript initialization, improving performance and reducing dependencies.

### Theme System Integration
Headers fully participate in Semantic UI's theme system, allowing global visual changes without component-level modifications.

## Research Notes

### Strengths
1. **Clear mental model**: Distinction between page and content headers addresses different sizing needs elegantly
2. **Comprehensive variations**: Extensive color, sizing, and layout options cover most use cases
3. **Composition-friendly**: Icon, image, and sub header support enables rich, expressive headers
4. **Pure CSS**: No JavaScript dependency improves performance and simplicity
5. **Theme integration**: Participates in global theme system for consistent styling

### Limitations
1. **Accessibility gaps**: Limited documentation on ARIA attributes, screen reader behavior, or semantic HTML best practices
2. **No responsive modifiers**: Missing explicit mobile/tablet/desktop size variations
3. **Limited state variations**: Only disabled and inverted states; missing loading, active, or other interactive states
4. **No dynamic behavior**: No built-in JavaScript for collapsible headers, expandable sections, or interactive features
5. **Color-only semantics**: Colored headers rely on color alone to convey meaning, which may not be accessible

### Modernization Opportunities
1. **Web Components**: Convert to custom elements with Shadow DOM encapsulation
2. **CSS Custom Properties**: Replace fixed colors with themeable CSS variables
3. **ARIA Automation**: Automatically apply appropriate ARIA attributes based on context
4. **Responsive Sizing**: Add breakpoint-aware size variations
5. **Interactive States**: Support loading, clickable, expandable header states
6. **Dark Mode**: Built-in dark mode support beyond inverted variant
7. **TypeScript Definitions**: Add type safety for component usage
8. **Accessibility Audit**: Comprehensive WCAG compliance review and documentation

### Comparison to Modern Approaches
**Semantic UI Classic (2.x) approach:**
- Class-based styling
- jQuery ecosystem
- CSS-only component
- Fixed color palette
- Manual semantic HTML

**Modern web component approach might include:**
- Custom elements (`<ui-header>`)
- Shadow DOM encapsulation
- CSS custom properties for theming
- Automatic ARIA attribute application
- Responsive size variants
- Built-in accessibility features
- Framework-agnostic implementation

### Usage Patterns Observed
1. **Page structure**: h1-h5 for document outline and navigation landmarks
2. **Content sections**: Huge/Large/Medium/Small for flexible content emphasis
3. **Icon headers**: Settings pages, empty states, feature showcases
4. **Image headers**: User profiles, team member lists, product showcases
5. **Dividing headers**: Section separators in long content
6. **Attached headers**: Tabbed interfaces, accordion sections, connected content blocks
7. **Colored headers**: Category indicators, status labels, visual grouping

### Framework Integration Notes
- jQuery-based, so integration with modern frameworks (React, Vue, Angular) requires adapters or replacement
- Pure CSS means easy to port styling to other frameworks
- Class-based approach maps well to component props in modern frameworks
- Composition pattern translates naturally to slot-based components
