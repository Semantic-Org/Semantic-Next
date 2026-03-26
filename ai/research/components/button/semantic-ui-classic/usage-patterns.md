# Semantic UI Classic - Button Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://semantic-ui.com/elements/button.html
Status: ✅ Working
Version: Classic (jQuery-based)
Last Verified: 2024-11-04

## Documentation Quality
Comprehensive - The documentation provides extensive coverage of all button patterns with visual examples and detailed descriptions.

## Component Definition
- **Core purpose**: Indicates a possible user action and serves as the primary interactive element for user input
- **Mental model**: A clickable element that triggers actions. Users understand buttons as actionable items that respond to clicks/taps
- **Semantic meaning**: Communicates intent through emphasis levels (primary, secondary), sentiment (positive, negative), and visual styling (colors, icons, sizes)

## Pattern Support Levels
- **Native**: Dedicated class/API
- **Composed**: Via HTML composition
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Standard text button with `class="ui button"` |
| Icon support | ✅ | Native | Icon-only buttons with `class="ui icon button"` |
| Icon + Text | ✅ | Native | Labeled icon buttons with `class="ui labeled icon button"` |
| Labeled button | ✅ | Composed | Button paired with label element for counts/metadata |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Primary | ✅ | Native | `class="ui primary button"` - highest emphasis |
| Secondary | ✅ | Native | `class="ui secondary button"` - secondary emphasis |
| Basic | ✅ | Native | `class="ui basic button"` - outline style, less pronounced |
| Animated | ✅ | Native | Three animation types: standard, vertical, fade with `class="ui animated button"` |
| Inverted | ✅ | Native | `class="ui inverted button"` - designed for dark backgrounds |
| Social | ✅ | Native | Branded buttons: facebook, twitter, google plus, vk, linkedin, instagram, youtube |
| Positive | ✅ | Native | `class="ui positive button"` - hints at positive consequence |
| Negative | ✅ | Native | `class="ui negative button"` - hints at negative consequence |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `class="ui disabled button"` - prevents interaction |
| Loading | ✅ | Native | `class="ui loading button"` - displays loading spinner |
| Active | ✅ | Native | `class="ui active button"` - shows current selection |
| Toggle | ✅ | Native | `class="ui toggle button"` - on/off state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | 8 sizes: mini, tiny, small, medium (default), large, big, huge, massive |
| Color options | ✅ | Native | 13 colors: red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, grey, black |
| Compact | ✅ | Native | `class="ui compact button"` - reduced padding |
| Fluid | ✅ | Native | `class="ui fluid button"` - full container width |
| Circular | ✅ | Native | `class="ui circular button"` - rounded, typically with icons |
| Social | ✅ | Native | Social media branded buttons with brand colors |
| Floated | ✅ | Native | `class="ui left floated button"` or `right floated` |
| Attached | ✅ | Native | Vertically or horizontally attached to other content |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | Standard browser click events, jQuery integration |
| Button group | ✅ | Native | `class="ui buttons"` - horizontal grouping |
| Toggle | ✅ | Native | `class="ui toggle button"` - toggleable state |
| Or divider | ✅ | Native | `<div class="or"></div>` - choice indicator between buttons |
| Vertical group | ✅ | Native | `class="ui vertical buttons"` - vertical stacking |
| Conditional | ✅ | Composed | Or divider with localization via `data-text` attribute |

## Code Examples

### Basic Button Types
```html
<!-- Standard Button -->
<button class="ui button">
  Follow
</button>

<!-- Focusable Div (requires tabindex) -->
<div class="ui button" tabindex="0">
  Focusable
</div>
```

### Emphasis Levels
```html
<!-- Primary Emphasis -->
<button class="ui primary button">
  Save
</button>

<!-- Secondary Emphasis -->
<button class="ui secondary button">
  Discard
</button>

<!-- Standard Emphasis -->
<button class="ui button">
  Cancel
</button>
```

### Animated Buttons
```html
<!-- Standard Animation (horizontal reveal) -->
<div class="ui animated button" tabindex="0">
  <div class="visible content">Next</div>
  <div class="hidden content">
    <i class="right arrow icon"></i>
  </div>
</div>

<!-- Vertical Animation -->
<div class="ui vertical animated button" tabindex="0">
  <div class="hidden content">Shop</div>
  <div class="visible content">
    <i class="shop icon"></i>
  </div>
</div>

<!-- Fade Animation -->
<div class="ui animated fade button" tabindex="0">
  <div class="visible content">Sign-up for a Pro account</div>
  <div class="hidden content">
    $12.99 a month
  </div>
</div>
```

### Labeled Buttons
```html
<!-- Right Labeled -->
<div class="ui labeled button" tabindex="0">
  <div class="ui button">
    <i class="heart icon"></i> Like
  </div>
  <a class="ui basic label">
    2,048
  </a>
</div>

<!-- Left Labeled -->
<div class="ui left labeled button" tabindex="0">
  <a class="ui basic right pointing label">
    2,048
  </a>
  <div class="ui button">
    <i class="heart icon"></i> Like
  </div>
</div>

<!-- Labeled Icon -->
<div class="ui left labeled button" tabindex="0">
  <a class="ui basic label">
    1,048
  </a>
  <div class="ui icon button">
    <i class="fork icon"></i>
  </div>
</div>
```

### Icon Buttons
```html
<!-- Icon Only -->
<button class="ui icon button">
  <i class="cloud icon"></i>
</button>

<!-- Labeled Icon (left) -->
<button class="ui labeled icon button">
  <i class="pause icon"></i>
  Pause
</button>

<!-- Labeled Icon (right) -->
<button class="ui right labeled icon button">
  <i class="right arrow icon"></i>
  Next
</button>
```

### Basic (Outline) Style
```html
<button class="ui basic button">
  Standard
</button>
<button class="ui primary basic button">Primary</button>
<button class="ui secondary basic button">Secondary</button>
<button class="ui positive basic button">Positive</button>
<button class="ui negative basic button">Negative</button>

<!-- Basic with all colors -->
<button class="ui red basic button">Red</button>
<button class="ui orange basic button">Orange</button>
<button class="ui yellow basic button">Yellow</button>
<button class="ui olive basic button">Olive</button>
<button class="ui green basic button">Green</button>
<button class="ui teal basic button">Teal</button>
<button class="ui blue basic button">Blue</button>
<button class="ui violet basic button">Violet</button>
<button class="ui purple basic button">Purple</button>
<button class="ui pink basic button">Pink</button>
<button class="ui brown basic button">Brown</button>
<button class="ui grey basic button">Grey</button>
<button class="ui black basic button">Black</button>
```

### Inverted Style (for dark backgrounds)
```html
<!-- Inverted Standard -->
<button class="ui inverted button">Standard</button>
<button class="ui inverted primary button">Primary</button>
<button class="ui inverted secondary button">Secondary</button>

<!-- Inverted Colors -->
<button class="ui inverted red button">Red</button>
<button class="ui inverted orange button">Orange</button>
<button class="ui inverted yellow button">Yellow</button>
<button class="ui inverted olive button">Olive</button>
<button class="ui inverted green button">Green</button>
<button class="ui inverted teal button">Teal</button>
<button class="ui inverted blue button">Blue</button>
<button class="ui inverted violet button">Violet</button>
<button class="ui inverted purple button">Purple</button>
<button class="ui inverted pink button">Pink</button>
<button class="ui inverted brown button">Brown</button>
<button class="ui inverted grey button">Grey</button>
<button class="ui inverted black button">Black</button>

<!-- Inverted Basic -->
<button class="ui inverted basic button">Basic</button>
<button class="ui inverted primary basic button">Primary</button>
<button class="ui inverted red basic button">Basic Red</button>
```

### Button Groups
```html
<!-- Horizontal Group -->
<div class="ui buttons">
  <button class="ui button">One</button>
  <button class="ui button">Two</button>
  <button class="ui button">Three</button>
</div>

<!-- Vertical Group -->
<div class="ui vertical buttons">
  <button class="ui button">Feed</button>
  <button class="ui button">Messages</button>
  <button class="ui button">Events</button>
  <button class="ui button">Photos</button>
</div>

<!-- Icon Button Group -->
<div class="ui icon buttons">
  <button class="ui button"><i class="align left icon"></i></button>
  <button class="ui button"><i class="align center icon"></i></button>
  <button class="ui button"><i class="align right icon"></i></button>
  <button class="ui button"><i class="align justify icon"></i></button>
</div>

<!-- Labeled Icon Group (Vertical) -->
<div class="ui vertical labeled icon buttons">
  <button class="ui button">
    <i class="pause icon"></i>
    Pause
  </button>
  <button class="ui button">
    <i class="play icon"></i>
    Play
  </button>
  <button class="ui button">
    <i class="shuffle icon"></i>
    Shuffle
  </button>
</div>

<!-- Mixed Group -->
<div class="ui buttons">
  <button class="ui labeled icon button">
    <i class="left chevron icon"></i>
    Back
  </button>
  <button class="ui button">
    <i class="stop icon"></i>
    Stop
  </button>
  <button class="ui right labeled icon button">
    Forward
    <i class="right chevron icon"></i>
  </button>
</div>
```

### Conditional (Or Divider)
```html
<!-- Standard Or -->
<div class="ui buttons">
  <button class="ui button">Cancel</button>
  <div class="or"></div>
  <button class="ui positive button">Save</button>
</div>

<!-- Localized Or (custom text) -->
<div class="ui buttons">
  <button class="ui button">un</button>
  <div class="or" data-text="ou"></div>
  <button class="ui positive button">deux</button>
</div>
```

### States
```html
<!-- Active State -->
<button class="ui active button">
  <i class="user icon"></i>
  Follow
</button>

<!-- Disabled State -->
<button class="ui disabled button">
  <i class="user icon"></i>
  Followed
</button>

<!-- Loading State -->
<button class="ui loading button">Loading</button>
<button class="ui basic loading button">Loading</button>
<button class="ui primary loading button">Loading</button>
<button class="ui secondary loading button">Loading</button>

<!-- Toggle Button -->
<button class="ui toggle button">
  Vote
</button>
```

### Social Buttons
```html
<button class="ui facebook button">
  <i class="facebook icon"></i>
  Facebook
</button>
<button class="ui twitter button">
  <i class="twitter icon"></i>
  Twitter
</button>
<button class="ui google plus button">
  <i class="google plus icon"></i>
  Google Plus
</button>
<button class="ui vk button">
  <i class="vk icon"></i>
  VK
</button>
<button class="ui linkedin button">
  <i class="linkedin icon"></i>
  LinkedIn
</button>
<button class="ui instagram button">
  <i class="instagram icon"></i>
  Instagram
</button>
<button class="ui youtube button">
  <i class="youtube icon"></i>
  YouTube
</button>
```

### Size Variations
```html
<button class="mini ui button">Mini</button>
<button class="tiny ui button">Tiny</button>
<button class="small ui button">Small</button>
<button class="medium ui button">Medium</button>
<button class="large ui button">Large</button>
<button class="big ui button">Big</button>
<button class="huge ui button">Huge</button>
<button class="massive ui button">Massive</button>

<!-- Sized Groups -->
<div class="large ui buttons">
  <button class="ui button">One</button>
  <button class="ui button">Two</button>
  <button class="ui button">Three</button>
</div>
```

### Color Variations
```html
<button class="ui red button">Red</button>
<button class="ui orange button">Orange</button>
<button class="ui yellow button">Yellow</button>
<button class="ui olive button">Olive</button>
<button class="ui green button">Green</button>
<button class="ui teal button">Teal</button>
<button class="ui blue button">Blue</button>
<button class="ui violet button">Violet</button>
<button class="ui purple button">Purple</button>
<button class="ui pink button">Pink</button>
<button class="ui brown button">Brown</button>
<button class="ui grey button">Grey</button>
<button class="ui black button">Black</button>
```

### Layout Variations
```html
<!-- Compact -->
<button class="compact ui button">Hold</button>
<button class="ui compact icon button">
  <i class="pause icon"></i>
</button>
<button class="ui compact labeled icon button">
  <i class="pause icon"></i>
  Pause
</button>

<!-- Fluid -->
<button class="fluid ui button">Fits container</button>

<!-- Floated -->
<button class="ui right floated button">Right Floated</button>
<button class="ui left floated button">Left Floated</button>

<!-- Circular -->
<button class="circular ui icon button">
  <i class="icon settings"></i>
</button>

<!-- Circular Social -->
<button class="ui circular facebook icon button">
  <i class="facebook icon"></i>
</button>
<button class="ui circular twitter icon button">
  <i class="twitter icon"></i>
</button>
<button class="ui circular linkedin icon button">
  <i class="linkedin icon"></i>
</button>
<button class="ui circular google plus icon button">
  <i class="google plus icon"></i>
</button>
```

### Attached Variations
```html
<!-- Vertically Attached -->
<div class="ui top attached button" tabindex="0">Top</div>
<div class="ui attached segment">
  <img src="/images/wireframe/paragraph.png" class="ui wireframe image">
</div>
<div class="ui bottom attached button" tabindex="0">Bottom</div>

<!-- Two Attached Buttons -->
<div class="ui two top attached buttons">
  <div class="ui button">One</div>
  <div class="ui button">Two</div>
</div>
<div class="ui attached segment">
  <img src="/images/wireframe/paragraph.png" class="ui wireframe image">
</div>
<div class="ui two bottom attached buttons">
  <div class="ui button">One</div>
  <div class="ui button">Two</div>
</div>

<!-- Horizontally Attached -->
<button class="ui left attached button">Left</button>
<button class="right attached ui button">Right</button>
```

### Positive/Negative Sentiment
```html
<button class="positive ui button">Positive Button</button>
<button class="negative ui button">Negative Button</button>
```

## Notable Features
- **Class-based API**: All variations achieved through composable CSS classes following a consistent naming pattern
- **Animated content reveals**: Buttons can show hidden content with smooth animations (standard, vertical, fade)
- **Flexible theming**: Primary and secondary button colors can be customized via `site.variables`
- **Social media integration**: Built-in branded styles for major social platforms
- **Or divider**: Unique pattern for presenting choice between two actions with optional localization
- **Non-button elements**: Any element can become a button (div, a, etc.) but requires `tabindex="0"` for keyboard accessibility
- **Extensive size system**: 8 distinct size options from mini to massive
- **Comprehensive color palette**: 13 semantic and decorative colors
- **Label integration**: Seamless integration with Semantic UI Label component for counts/metadata
- **Inverted styling**: Special consideration for dark background usage
- **Group compositions**: Sophisticated grouping with support for equal width, colors, sizes, and vertical/horizontal orientations
- **jQuery-based**: Classic version uses jQuery for interactive behaviors

## Research Notes
- **Framework approach**: Class-based utility system predating modern component frameworks. Semantic UI Classic uses a compositional approach where functionality is added through combining class names.
- **Accessibility consideration**: Documentation explicitly notes the need for `tabindex="0"` on non-button elements to maintain keyboard accessibility.
- **Animation auto-sizing**: Animated buttons automatically size themselves based on visible content, requiring developers to ensure adequate space.
- **Localization support**: The or divider supports custom text via `data-text` attribute, showing consideration for internationalization.
- **Design philosophy**: Strong emphasis on semantic naming (`positive`, `negative`, `primary`, `secondary`) rather than purely visual descriptors.
- **jQuery dependency**: This is the jQuery-based classic version, not the modern React port (Semantic UI React). Interactive behaviors rely on jQuery initialization.
- **Icon integration**: Deep integration with icon fonts (Font Awesome style), with dedicated patterns for icon-only and labeled-icon buttons.
- **Theming flexibility**: Documentation references `site.variables` for customization, indicating a comprehensive theming system.
- **Group patterns**: Sophisticated button group system with support for mixed content types (regular, icon, labeled icon) and conditional elements (or dividers).
- **Historical significance**: One of the pioneering UI frameworks that popularized semantic, human-readable class names in web development.
