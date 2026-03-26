# Semantic UI Classic Icon - Usage Patterns

## Component URL
https://semantic-ui.com/elements/icon.html
Status: ✅ Working
Version: Semantic UI 2.x
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - Extensive documentation with multiple icon sets, variations, states, and interactive examples

## Component Definition
- **Core purpose**: Display scalable glyphs and symbols to represent actions, objects, concepts, or status
- **Mental model**: A universal icon system that combines representation glyphs, directional indicators, status symbols, and brand icons into a single flexible component
- **Semantic meaning**: Provides visual communication through standardized symbols that enhance usability and reduce cognitive load
- **Icon library**: Primarily Feather icons with additional brand icons and development framework icons

## Unique Characteristics

Semantic UI Classic's Icon component is distinctive because it:

1. **Icon-as-Element approach**: Uses `<i class="icon">` HTML element with semantic meaning (information icon), not just `<span>`
2. **Feather Icon Integration**: Built-in support for 280+ Feather icons covering most common use cases
3. **Semantic Color System**: 13 colors with implicit meaning (red=error, green=success, etc.) applied via classes
4. **Size Scaling**: Eight size options that scale smoothly via CSS classes
5. **Loading/Spinner Pattern**: Icons can be animated to represent loading/processing states
6. **Brand Icons**: Dedicated icons for JavaScript frameworks and platforms (React, Vue, Svelte, Angular, Next.js, Astro)
7. **Linkable Icons**: Icons can function as interactive links with hover states
8. **Group Support**: Multiple icons can share properties when grouped under `ui icons` container

## Pattern Support Levels
- **Native**: Dedicated class-based API (e.g., `class="ui icon"`, `class="ui red icon"`)
- **Composed**: Via HTML structure and nesting (e.g., icons in buttons, labels)
- **CSS-only**: Additional customization through standard CSS
- **Animated**: Spin/rotation animations for loading states

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Icon glyph | ✅ | Native | Base icon displays glyph: `<i class="ui icon"></i>` with `icon` class specifying type |
| Icon with color | ✅ | Native | Color via class: `<i class="ui red icon"></i>` |
| Icon with size | ✅ | Native | Size via class: `<i class="ui large icon"></i>` |
| Icon as link | ✅ | Native | Linkable: `<i class="ui link icon"></i>` or wrapped in `<a>` |
| Icon group | ✅ | Native | Multiple icons: `<i class="ui icons"></i>` container |
| Fitted icon | ✅ | Native | No margins: `class="ui fitted icon"` - tight spacing |
| Inverted icon | ✅ | Composed | Light icon on dark background: `class="ui inverted icon"` |
| Loading spinner | ✅ | Composed | Animated loader: `class="ui loading icon"` |
| Spinning animation | ✅ | Composed | Rotating animation: `class="ui spinning icon"` |

## Type Patterns (Icon Categories)

### Available Icon Types

| Category | Count | Examples | Support |
|----------|-------|----------|---------|
| Arrows | 15+ | arrow-up, arrow-down, arrow-left, arrow-right, chevron-* | Native |
| Media | 20+ | play, pause, camera, image, film, music | Native |
| Navigation | 15+ | menu, home, settings, help-circle, info | Native |
| Social/Brand | 25+ | facebook, twitter, github, linkedin, slack | Native |
| UI Controls | 30+ | check, x, minus, plus, menu, search | Native |
| Development | 10+ | code, git-*, terminal, layers | Native |
| Frameworks | 10+ | react, vue, angular, svelte, next, astro | Native |
| Editing | 15+ | edit, bold, italic, type, align-* | Native |
| Business | 20+ | briefcase, calendar, credit-card, dollar-sign | Native |
| Weather | 10+ | sun, moon, cloud, cloud-rain, wind | Native |
| Status | 15+ | alert-*, check-circle, info, help-circle | Native |
| Shapes | 10+ | circle, square, triangle, hexagon, octagon | Native |

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default | ✅ | Native | Standard icon appearance: `<i class="ui icon"></i>` |
| Disabled | ✅ | Native | Faded appearance: `class="ui disabled icon"` - reduced opacity, cursor: default |
| Loading | ✅ | Native | Animated spinner: `class="ui loading icon"` - spinning animation |
| Hover (for links) | ✅ | Implicit | Color/opacity change on link icons when hovering |
| Active | ❌ | Not native | Use color classes or custom CSS for active state styling |

## Variation Patterns

### Size Options

| Size Class | Semantic | Use Case |
|-----------|----------|----------|
| `mini` | Extra small | Subtle indicators, small UI elements |
| `tiny` | Very small | Compact UI, navigation bars |
| `small` | Small | Standard form fields, list items |
| (default) | Medium | General purpose, default size |
| `large` | Large | Prominent actions, hero sections |
| `big` | Larger | Emphasis, standalone icons |
| `huge` | Very large | Page headers, feature icons |
| `massive` | Extra large | Full-width emphasis, large displays |

### Color Options

13 semantic colors, each with implicit meaning:

```
red       - Error, danger, attention required
orange    - Warning, caution
yellow    - Caution, alert
olive     - Neutral, muted
green     - Success, positive, completed
teal      - Information, cool, professional
blue      - Primary, information, trust
violet    - Special, unique
purple    - Creative, premium
pink      - Attention, decorative
brown     - Neutral, earthy
grey      - Disabled, secondary, muted
black     - Strong emphasis, darkest
```

### Style Variations

| Variation | Syntax | Purpose |
|-----------|--------|---------|
| Colored | `class="ui red icon"` | Apply semantic color to icon |
| Fitted | `class="ui fitted icon"` | Remove left/right margins for tight spacing |
| Link | `class="ui link icon"` | Make icon interactive with hover states |
| Inverted | `class="ui inverted icon"` | Light icon for dark backgrounds |
| Circular | `class="ui circular icon"` | Round background (badge-style) |
| Spinning | `class="ui spinning icon"` | Continuous rotation animation |
| Loading | `class="ui loading icon"` | Show loading/processing state |

## Group Patterns

### Icon Groups
```html
<!-- Multiple icons sharing properties -->
<i class="ui icons">
  <i class="large icon"></i>
  <i class="small corner icon"></i>
</i>

<!-- Grouped colored icons -->
<i class="ui red icons">
  <i class="large bookmark icon"></i>
  <i class="star icon"></i>
</i>
```

### Group Types
- **Stacked icons**: Multiple icons in same position (using small corner positioning)
- **Colored groups**: All child icons inherit color from group
- **Sized groups**: All child icons inherit size from group

## Code Examples

### Basic Icon
```html
<!-- Simple icon -->
<i class="ui icon check"></i>

<!-- With semantic HTML -->
<i class="ui icon" title="Success"></i>

<!-- Common usage in buttons -->
<button>
  <i class="ui icon search"></i>
  Search
</button>
```

### Sized Icons
```html
<!-- 8 size options -->
<i class="ui mini icon check"></i>
<i class="ui tiny icon check"></i>
<i class="ui small icon check"></i>
<i class="ui icon check"></i>              <!-- Medium (default) -->
<i class="ui large icon check"></i>
<i class="ui big icon check"></i>
<i class="ui huge icon check"></i>
<i class="ui massive icon check"></i>
```

### Colored Icons
```html
<!-- 13 color options -->
<i class="ui red icon heart"></i>
<i class="ui orange icon warning"></i>
<i class="ui yellow icon star"></i>
<i class="ui olive icon leaf"></i>
<i class="ui green icon check-circle"></i>
<i class="ui teal icon info"></i>
<i class="ui blue icon home"></i>
<i class="ui violet icon settings"></i>
<i class="ui purple icon star"></i>
<i class="ui pink icon heart"></i>
<i class="ui brown icon coffee"></i>
<i class="ui grey icon volume-x"></i>
<i class="ui black icon square"></i>
```

### Loading/Spinner Icons
```html
<!-- Loading state icon (spinner animation) -->
<i class="ui loading icon"></i>

<!-- Specific loader icon with animation -->
<i class="ui icon loader"></i>

<!-- Loading in button -->
<button class="ui button">
  <i class="ui loading icon spinner"></i>
  Processing...
</button>

<!-- Custom spinning icon -->
<i class="ui spinning icon refresh-cw"></i>
```

### Link Icons
```html
<!-- Icon as interactive link -->
<i class="ui link icon search"></i>

<!-- Icon with hover effects -->
<i class="ui link icon heart"></i>

<!-- Multiple link icons -->
<a href="#">
  <i class="ui link icon home"></i>
</a>

<!-- In navigation -->
<i class="ui link icon bars"></i>
<i class="ui link icon heart"></i>
<i class="ui link icon share"></i>
```

### Icon States
```html
<!-- Disabled icon -->
<i class="ui disabled icon check"></i>

<!-- Icon with color and size -->
<i class="ui large red icon check-circle"></i>

<!-- Icon with multiple modifiers -->
<i class="ui large red link icon heart"></i>

<!-- Fitted (no margin) -->
<i class="ui fitted icon close"></i>
```

### Icon Groups
```html
<!-- Group of icons sharing size -->
<i class="ui large icons">
  <i class="icon heart"></i>
  <i class="icon star"></i>
  <i class="icon check"></i>
</i>

<!-- Stacked icons (corner positioning) -->
<i class="ui icons">
  <i class="large icon square"></i>
  <i class="small corner icon heart"></i>
</i>

<!-- Colored group -->
<i class="ui green icons">
  <i class="icon check"></i>
  <i class="icon star"></i>
</i>
```

### Inverted Icons
```html
<!-- Light icons on dark background -->
<div style="background: #333; padding: 1rem;">
  <i class="ui inverted icon sun"></i>
  <i class="ui inverted icon heart"></i>
</div>

<!-- Inverted with color -->
<i class="ui inverted red icon warning"></i>
```

### Icons in Common Contexts

#### In Buttons
```html
<button class="ui button">
  <i class="icon home"></i>
  Home
</button>

<button class="ui icon button">
  <i class="icon heart"></i>
</button>
```

#### In Forms
```html
<div class="ui input">
  <input type="text" placeholder="Search...">
  <i class="icon search"></i>
</div>
```

#### In Lists
```html
<div class="ui list">
  <div class="item">
    <i class="icon check-circle"></i>
    Completed task
  </div>
  <div class="item">
    <i class="icon x-circle"></i>
    Failed task
  </div>
</div>
```

#### In Menus
```html
<div class="ui menu">
  <a class="item">
    <i class="icon home"></i>
    Home
  </a>
  <a class="item">
    <i class="icon heart"></i>
    Favorites
  </a>
</div>
```

#### In Cards/Segments
```html
<div class="ui segment">
  <i class="ui huge icon settings"></i>
  <h2>Settings</h2>
  <p>Configure your preferences</p>
</div>
```

## Visual Variations

### Semantic Color Meanings
- **Red**: Error, danger, validation failure, attention required
- **Orange**: Warning, caution, in progress
- **Yellow**: Alert, important notice
- **Green**: Success, completion, positive action
- **Blue**: Primary action, information, default
- **Teal**: Secondary action, professional, cool tone
- **Purple**: Premium, special, creative

### Icon Styles
1. **Outlined** (default): Simple line-based design
2. **Solid** (implicit): Icons filled or stroked as appropriate
3. **Color-coded**: Semantic colors for quick recognition
4. **Badge-style** (circular): Rounded background for emphasis

## Size Patterns

### How Sizing Works
- Icons inherit `font-size` from parent element by default
- Size classes override inherited size
- Group container size applies to all child icons
- Relative sizing maintains proportional spacing

### Responsive Sizing
```html
<!-- Resize based on context (no class) -->
<i class="icon check"></i>

<!-- Explicit size for consistency -->
<i class="ui large icon check"></i>

<!-- Size variation in different contexts -->
<!-- Small in compact lists -->
<i class="ui small icon check"></i>

<!-- Large in feature sections -->
<i class="ui huge icon check"></i>
```

## Color/Theming

### Color System
- **13 semantic colors** mapped to class names
- **Color inheritance**: Groups apply color to children
- **Text color application**: Uses CSS `color` property (respects `currentColor`)
- **Theme integration**: Compatible with CSS custom properties for overrides

### Color Customization
```css
/* Override color with CSS */
.ui.custom.icon {
  color: #custom-color;
}

/* Theme variable override */
:root {
  --icon-red: #e74c3c;  /* Custom red */
  --icon-blue: #3498db; /* Custom blue */
}
```

## Icon Libraries

### Built-in Icon Sets

#### Feather Icons (Primary)
- **Count**: 280+ icons
- **Style**: Clean, minimalist line-based
- **Coverage**: Comprehensive UI and general purpose icons
- **Examples**: check, heart, home, settings, search, mail, user, etc.

#### Brand Icons (Framework/Platform)
- **React**: React icon
- **Vue**: Vue icon
- **Angular**: Angular icon
- **Svelte**: Svelte icon
- **Next.js**: Next icon
- **Astro**: Astro icon
- **JavaScript**: JS icon
- **Plus**: Brand icon variants with text marks

#### Social Icons
- Facebook, Twitter, GitHub, GitLab, LinkedIn, Instagram, Slack, Dribbble, Figma, Framer, CodePen, CodeSandbox, Trello, Twitch, YouTube, Pocket

### Icon Naming Convention
- **Kebab-case**: `alert-circle`, `arrow-down-left`, `check-circle`
- **Single word**: `heart`, `star`, `check`, `home`
- **Directional suffixes**: `arrow-up`, `arrow-down`, `chevron-left`
- **Variant numbers**: `edit`, `edit-2`, `edit-3`, `volume`, `volume-1`, `volume-2`

## Custom Icons

### Using Custom SVG Icons
While Semantic UI Classic provides 280+ built-in icons, custom icons can be added:

```html
<!-- Custom SVG as background -->
<i class="custom icon" style="
  -webkit-mask-image: url('custom-icon.svg');
  mask-image: url('custom-icon.svg');
  background-color: currentColor;
"></i>

<!-- or using CSS classes -->
<style>
  .custom-icon {
    -webkit-mask-image: url('my-icon.svg');
    mask-size: 100% 100%;
    background-color: currentColor;
  }
</style>

<i class="ui icon custom-icon"></i>
```

### Custom Icon Implementation Pattern
```html
<!-- Define custom icon class -->
<style>
  .icon.custom-logo {
    mask-image: var(--icon-custom-logo-svg);
    background-color: currentColor;
  }
</style>

<!-- Use in markup -->
<i class="ui icon custom-logo"></i>
<i class="ui red icon custom-logo"></i>
<i class="ui large icon custom-logo"></i>
```

## Accessibility

### Semantic HTML
- Uses `<i>` element (information) with semantic class names
- Screen readers see meaningful class names through context

### ARIA Patterns
```html
<!-- Icon with aria-label -->
<i class="ui icon check" aria-label="Success"></i>

<!-- Icon representing function with title -->
<i class="ui icon search" title="Search"></i>

<!-- Icon in button with visible text -->
<button>
  <i class="ui icon search"></i>
  Search
</button>

<!-- Icon as standalone (needs aria-label) -->
<a href="#" title="Like">
  <i class="ui icon heart" aria-label="Like this"></i>
</a>
```

### Best Practices
1. **With visible text**: Icon clarifies/enhances text (no additional ARIA needed)
2. **Standalone icons**: Use `title`, `aria-label`, or `aria-labelledby`
3. **In buttons**: Button text provides accessible label
4. **Decorative icons**: Only when truly decorative; otherwise provide label

### Screen Reader Considerations
- Icon class names are not read automatically
- Surrounding text provides context in most UI patterns
- Use aria-label for standalone interactive icons

## Interactive Patterns

### Click/Tap Handlers
```html
<!-- Icon as button -->
<i class="ui link icon heart" onclick="toggleLike()"></i>

<!-- Icon in clickable element -->
<a href="#" class="item">
  <i class="ui icon star"></i>
  Add to favorites
</a>

<!-- Icon with hover effects -->
<style>
  .ui.link.icon:hover {
    opacity: 0.8;
  }
</style>
```

### Icon Buttons
```html
<!-- Pure icon button -->
<button class="ui icon button">
  <i class="icon heart"></i>
</button>

<!-- Icon button with label -->
<button class="ui button">
  <i class="icon download"></i>
  Download
</button>

<!-- Icon button group -->
<div class="ui buttons">
  <button class="ui icon button">
    <i class="icon heart"></i>
  </button>
  <button class="ui icon button">
    <i class="icon star"></i>
  </button>
</div>
```

### Hover State Changes
```html
<!-- Icon changes on hover -->
<style>
  .ui.link.icon {
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s;
  }

  .ui.link.icon:hover {
    opacity: 1;
  }
</style>

<!-- Color change on hover -->
<style>
  .ui.link.icon {
    color: grey;
  }

  .ui.link.icon:hover {
    color: red;
  }
</style>
```

## Advanced Patterns

### Icon Animations
```html
<!-- Spinning/rotating icon -->
<i class="ui spinning icon refresh-cw"></i>

<!-- Loading spinner (preset animation) -->
<i class="ui loading icon"></i>

<!-- Custom rotation animation -->
<style>
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .ui.rotating.icon {
    animation: rotate 2s linear infinite;
  }
</style>

<i class="ui icon rotating cog"></i>
```

### Icon Transitions
```html
<!-- Smooth color transition -->
<style>
  .ui.icon {
    transition: color 0.3s ease, opacity 0.3s ease;
  }

  .ui.icon:hover {
    color: red;
    opacity: 1;
  }
</style>
```

### Icon Overlays
```html
<!-- Stacked icon effect -->
<i class="ui icons">
  <i class="large circle icon"></i>
  <i class="small icon check"></i>
</i>

<!-- Corner badge icon -->
<i class="ui icons">
  <i class="large icon square"></i>
  <i class="small corner red icon star"></i>
</i>
```

### Conditional Icons
```html
<!-- Icon varies based on state -->
<i class="ui icon" id="favoriteIcon"></i>

<script>
  function toggleFavorite() {
    const icon = document.getElementById('favoriteIcon');
    if (icon.classList.contains('heart')) {
      icon.classList.remove('heart');
      icon.classList.add('x');
    } else {
      icon.classList.remove('x');
      icon.classList.add('heart');
    }
  }
</script>
```

### Icon in Dynamic Lists
```html
<!-- Status icon updates with data -->
<style>
  .status-icon.success { color: green; }
  .status-icon.error { color: red; }
  .status-icon.pending { color: orange; }
</style>

<script>
  function updateStatus(itemId, status) {
    const icon = document.querySelector(`#item-${itemId} .status-icon`);
    icon.className = `status-icon ${status}`;

    const iconClass = status === 'success' ? 'check-circle'
                    : status === 'error' ? 'x-circle'
                    : 'loader';

    icon.classList.add(iconClass);
  }
</script>
```

## Notes

### Technical Implementation
- Uses CSS `mask-image` for SVG-based icon rendering
- Icons inherit text color via `currentColor`
- Size controlled via `font-size` on container
- Spacing managed via CSS margins (removed with `fitted` class)
- Animations use CSS `transform` and `animation` properties

### Icon Selection Guidelines
1. **Clarity**: Choose icons that clearly represent their function
2. **Consistency**: Use icons from the same set (Feather) for visual harmony
3. **Context**: Provide text label for important actions
4. **Color**: Use semantic colors for status/meaning (red=error, green=success)
5. **Size**: Scale appropriately for context (tiny in compact UI, large for emphasis)

### Performance Considerations
- Icons are lightweight CSS-based glyphs, not image files
- No additional HTTP requests required
- SVG masks are efficient for rendering
- Icon sizes scale smoothly without quality loss

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Uses standard CSS properties (`mask-image`, `background-color`)
- Fallback: `background-image` for browsers without mask support
- No JavaScript required for core functionality

### Common Use Cases
1. **Form validation**: Green checkmark for valid, red X for invalid
2. **Status indicators**: Loading spinner, success checkmark, error warning
3. **Navigation**: Home, menu, settings icons in headers and sidebars
4. **Actions**: Search, download, share, edit, delete icons in toolbars
5. **Information**: Info circle, help icon, warning symbol for contextual help
6. **Social**: Brand icons (Twitter, GitHub, etc.) in footer/profile
7. **Feedback**: Heart for favorites, star for ratings, check for completion
8. **UI Enhancement**: Icons alongside text in buttons, menus, lists

### Version Notes
- Semantic UI Classic uses Feather icon set (consistent across v2.x)
- Icon API remained stable throughout v2.x versions
- No major breaking changes in icon component between versions
- Brand icons added as framework popularity increased

### Research Notes
- **Icon coverage**: 280+ Feather icons + 10+ brand icons + social icons
- **Naming consistency**: Kebab-case naming follows CSS class conventions
- **Color semantics**: 13 colors map to meaningful states and emotions
- **Size scaling**: 8 sizes cover use cases from compact (mini) to prominent (massive)
- **Class composition**: Modifiers combine naturally: `class="ui red large link icon"`
- **No JavaScript required**: All variations and states achieved through CSS
- **Accessibility depends on context**: Surrounding text or aria-labels provide meaning
- **Lightweight**: Icon system adds minimal CSS/styling overhead
- **Extensible**: Custom SVG icons can be added via CSS mask-image properties

