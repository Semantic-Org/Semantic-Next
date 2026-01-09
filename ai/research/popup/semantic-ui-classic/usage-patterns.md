# Semantic UI Classic - Popup Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://semantic-ui.com/modules/popup.html
Status: ✅ Working
Version: Classic (jQuery-based)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - The documentation provides extensive coverage of popup patterns with detailed API reference, visual examples, and interactive demonstrations. Includes both declarative HTML and programmatic JavaScript approaches.

## Component Definition
- **Core purpose**: Displays additional content in a floating layer positioned relative to a target element. Provides contextual information, tooltips, menus, and rich content overlays.
- **Mental model**: A floating layer that appears adjacent to an activating element, anchored to specific positions. Users understand popups as temporary overlays providing supplementary information or actions.
- **Semantic meaning**: Note: Semantic UI calls this component "Popup" rather than "Popover". It serves multiple purposes: tooltips (simple text hints), popovers (rich content overlays), dropdown menus (when hoverable), and contextual panels.

## Pattern Support Levels
- **Native**: Dedicated class/API with JavaScript behavior module
- **Composed**: Via HTML composition and data attributes
- **CSS-only**: Tooltip variant using pseudo-elements (limited functionality)

## Trigger Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Hover | ✅ | Native | Default trigger - shows on mouse enter, hides on leave |
| Click | ✅ | Native | `on: 'click'` - toggles on click, closable on outside click |
| Focus | ✅ | Native | `on: 'focus'` - shows when element receives focus |
| Manual | ✅ | Native | `on: 'manual'` - requires explicit `.popup('show')` calls |
| Touch | ✅ | Native | `addTouchEvents: true` - touchstart on hover triggers (mobile) |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Via `data-content` attribute or `content` setting |
| HTML content | ✅ | Native | Via `data-html` attribute or `html` setting |
| Title + content | ✅ | Native | `data-title` attribute creates header section |
| Inline element | ✅ | Native | Reference existing DOM element with `inline: true` or `popup` selector |
| HTML title fallback | ✅ | Native | Uses browser's native `title` attribute if no other content specified |
| Dynamic content | ✅ | Native | `.popup('change content', html)` updates content programmatically |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Top positions | ✅ | Native | `top left`, `top center`, `top right` |
| Bottom positions | ✅ | Native | `bottom left`, `bottom center`, `bottom right` |
| Left center | ✅ | Native | `left center` - positions to left of element |
| Right center | ✅ | Native | `right center` - positions to right of element |
| Auto-positioning | ✅ | Native | Searches alternative positions if preferred exceeds boundaries |
| Manual offset | ✅ | Native | `offset` property or `data-offset` attribute for pixel correction |
| Target override | ✅ | Native | `target` setting positions relative to different element |
| Boundary constraint | ✅ | Native | `boundary` setting (default: window) constrains positioning |
| Last resort | ✅ | Native | `lastResort` forces position when standard positions unavailable |
| Adjacent/opposite | ✅ | Native | `prefer: 'adjacent'` or `'opposite'` for constrained positioning |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Inline vs appended | ✅ | Native | `inline: true` creates adjacent, `false` appends to body |
| Preserve in DOM | ✅ | Native | `preserve: true` retains popup after hiding for faster reappearance |
| Exclusive mode | ✅ | Native | `exclusive: true` hides other popups when opening |
| Hoverable | ✅ | Native | `hoverable: true` prevents closing when hovering popup itself |
| Closable | ✅ | Native | `closable: true` allows click-outside dismissal (with `on: 'click'`) |
| Hide on scroll | ✅ | Native | `hideOnScroll: 'auto'` - auto-hides, `false` preserves focus in inputs |
| Move with target | ✅ | Native | `movePopup: true` relocates popup with target element |
| Observe changes | ✅ | Native | `observeChanges: true` destroys if element removed from DOM |
| Transition effects | ✅ | Native | `transition` setting with various animation options |
| Delay timing | ✅ | Native | `delay: {show: ms, hide: ms}` configures trigger delays |

## Style Variations
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic style | ✅ | Native | `class="ui basic popup"` - minimal formatting |
| Inverted style | ✅ | Native | `class="ui inverted popup"` - reversed color scheme |
| Titled popup | ✅ | Composed | Header section via `data-title` or HTML structure |
| Fluid width | ✅ | Native | `class="ui fluid popup"` - full container width |
| Flowing width | ✅ | Native | `class="ui flowing popup"` - no max-width, expands for content |
| Wide variants | ✅ | Native | `class="ui wide popup"`, `very wide`, `extra wide` |
| Size options | ✅ | Native | 8 sizes: mini, tiny, small, medium, large, big, huge, massive |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Tooltip behavior | ✅ | CSS-only | Lightweight tooltip using `:before`/`:after` pseudo-elements |
| Menu behavior | ✅ | Composed | `inline: true` + `hoverable: true` + delays for dropdown menus |
| Modal-like | ✅ | Composed | Click trigger with `closable: true` for dismissible overlays |
| Focus hints | ✅ | Native | `on: 'focus'` for form field contextual help |
| Programmatic control | ✅ | Native | Full API for show/hide/toggle/reposition |

## Code Examples

### Basic Trigger Methods
```html
<!-- Hover Trigger (Default) -->
<div class="ui button" data-content="Appears on hover">
  Hover me
</div>

<!-- Click Trigger -->
<div class="ui button" data-content="Click to toggle">
  Click me
</div>
<script>
$('.ui.button').popup({
  on: 'click'
});
</script>

<!-- Focus Trigger -->
<input type="text" data-content="Helpful hint" placeholder="Focus me">
<script>
$('input').popup({
  on: 'focus'
});
</script>

<!-- Manual Trigger -->
<div class="ui button" id="manual-popup">
  Manual
</div>
<script>
$('#manual-popup').popup({
  on: 'manual',
  content: 'Manually triggered'
});
// Show programmatically
$('#manual-popup').popup('show');
</script>
```

### Content Patterns
```html
<!-- Data Attribute Content (Text) -->
<i class="heart icon" data-content="Save for later"></i>

<!-- Data Attribute Content (HTML) -->
<i class="info circle icon"
   data-html="<b>Bold</b> and <em>italic</em> text">
</i>

<!-- Title + Content -->
<div class="ui button"
     data-title="User Information"
     data-content="Additional details here">
  Show Info
</div>

<!-- JavaScript Content -->
<div class="ui button" id="js-content">Info</div>
<script>
$('#js-content').popup({
  title: 'Popup Title',
  content: 'Hello I am a popup',
  position: 'top left'
});
</script>

<!-- HTML Content via JavaScript -->
<div class="ui button" id="html-content">Details</div>
<script>
$('#html-content').popup({
  html: '<div class="header">Styled Content</div><p>Rich HTML here</p>'
});
</script>

<!-- Inline Element (Pre-existing popup) -->
<div class="ui button" id="inline-trigger">Menu</div>
<div class="ui popup" id="inline-popup">
  <div class="ui link list">
    <a class="item">Link 1</a>
    <a class="item">Link 2</a>
    <a class="item">Link 3</a>
  </div>
</div>
<script>
$('#inline-trigger').popup({
  popup: $('#inline-popup'),
  on: 'click'
});
</script>
```

### Positioning Examples
```html
<!-- Top Positions -->
<i class="heart icon" data-content="Top Left" data-position="top left"></i>
<i class="heart icon" data-content="Top Center" data-position="top center"></i>
<i class="heart icon" data-content="Top Right" data-position="top right"></i>

<!-- Bottom Positions -->
<i class="heart icon" data-content="Bottom Left" data-position="bottom left"></i>
<i class="heart icon" data-content="Bottom Center" data-position="bottom center"></i>
<i class="heart icon" data-content="Bottom Right" data-position="bottom right"></i>

<!-- Side Positions -->
<i class="heart icon" data-content="Left Center" data-position="left center"></i>
<i class="heart icon" data-content="Right Center" data-position="right center"></i>

<!-- Position with Offset -->
<div class="ui button" data-content="Offset by 10px" data-offset="10"></div>

<!-- JavaScript Positioning -->
<div class="ui button" id="positioned">Positioned</div>
<script>
$('#positioned').popup({
  position: 'bottom right',
  content: 'Positioned bottom right'
});
</script>
```

### Style Variations
```html
<!-- Basic Style -->
<i class="heart icon" data-content="Basic popup" data-variation="basic"></i>

<!-- Inverted Style -->
<i class="heart icon" data-content="Inverted popup" data-variation="inverted"></i>

<!-- Wide Variations -->
<i class="heart icon" data-content="Standard width popup"></i>
<i class="heart icon" data-variation="wide"
   data-content="Wide popup with more horizontal space"></i>
<i class="heart icon" data-variation="very wide"
   data-content="Very wide popup with even more horizontal space"></i>

<!-- Flowing (No max-width) -->
<i class="heart icon" data-variation="flowing"
   data-content="This popup will expand to fit its content without constraint"></i>

<!-- Size Variations -->
<i class="heart icon" data-variation="mini" data-content="Mini popup"></i>
<i class="heart icon" data-variation="tiny" data-content="Tiny popup"></i>
<i class="heart icon" data-variation="small" data-content="Small popup"></i>
<i class="heart icon" data-content="Standard popup"></i>
<i class="heart icon" data-variation="large" data-content="Large popup"></i>
<i class="heart icon" data-variation="huge" data-content="Huge popup"></i>

<!-- Combining Variations -->
<i class="heart icon"
   data-variation="inverted wide"
   data-content="Inverted and wide"></i>
```

### CSS-Only Tooltip
```html
<!-- Basic Tooltip (No JavaScript) -->
<style>
/* Tooltip requires custom CSS using :before and :after */
</style>
<div class="ui icon button" data-tooltip="Tooltip text">
  <i class="add icon"></i>
</div>

<!-- Note: For icons, wrap in container -->
<span data-tooltip="Tooltip on icon">
  <i class="heart icon"></i>
</span>
```

### Hoverable Menu Pattern
```html
<!-- Dropdown Menu Behavior -->
<div class="ui button" id="menu-trigger">
  Browse
  <i class="dropdown icon"></i>
</div>
<div class="ui popup" id="menu-popup">
  <div class="ui link list">
    <div class="item">
      <i class="mail icon"></i> Email
    </div>
    <div class="item">
      <i class="users icon"></i> People
    </div>
    <div class="item">
      <i class="settings icon"></i> Settings
    </div>
  </div>
</div>

<script>
$('#menu-trigger').popup({
  popup: $('#menu-popup'),
  inline: true,
  hoverable: true,
  position: 'bottom left',
  delay: {
    show: 300,
    hide: 800
  }
});
</script>
```

### Advanced Behavior Patterns
```html
<!-- Click with Closable -->
<div class="ui button" id="click-popup">Click Me</div>
<script>
$('#click-popup').popup({
  on: 'click',
  closable: true, // Click outside to close
  content: 'Click outside to dismiss'
});
</script>

<!-- Exclusive Popups (Only one open at a time) -->
<div class="ui button" data-content="Popup 1">Button 1</div>
<div class="ui button" data-content="Popup 2">Button 2</div>
<script>
$('.ui.button').popup({
  exclusive: true
});
</script>

<!-- Preserve in DOM -->
<div class="ui button" id="preserved">Show</div>
<script>
$('#preserved').popup({
  preserve: true, // Keeps popup in DOM when hidden
  content: 'I stay in the DOM'
});
</script>

<!-- Inline vs Body Appended -->
<div class="ui segment">
  <div class="ui button" id="inline-popup">Inline</div>
</div>
<script>
$('#inline-popup').popup({
  inline: true, // Created adjacent to element (inherits local styles)
  content: 'Inline popup'
});

// Default behavior (inline: false) appends to body
</script>

<!-- Custom Boundary -->
<div class="ui segment" id="container">
  <div class="ui button" id="bounded">Bounded</div>
</div>
<script>
$('#bounded').popup({
  boundary: '#container', // Constrain within container
  content: 'Bounded to container'
});
</script>
```

### Transition Effects
```html
<div class="ui button" id="animated">Animated</div>
<script>
$('#animated').popup({
  transition: 'slide down', // Default
  duration: 200,
  content: 'Smooth animation'
});

// Other transitions: fade, scale, fly left, fly right, etc.
</script>
```

### Dynamic Content Updates
```html
<div class="ui button" id="dynamic">Show Status</div>
<div class="ui button" id="update">Update</div>

<script>
$('#dynamic').popup({
  content: 'Initial content'
});

$('#update').on('click', function() {
  $('#dynamic').popup('change content', 'Updated at ' + new Date().toLocaleTimeString());
  $('#dynamic').popup('show');
});
</script>
```

## JavaScript API Methods

### Core Methods
```javascript
// Show popup
$('.element').popup('show');

// Hide popup
$('.element').popup('hide');

// Hide all popups on page
$('.element').popup('hide all');

// Toggle visibility
$('.element').popup('toggle');

// Get current popup element
var $popup = $('.element').popup('get popup');

// Change content
$('.element').popup('change content', '<p>New content</p>');

// Reposition (after content size changes)
$('.element').popup('reposition');

// Set new position
$('.element').popup('set position', 'top left');

// Destroy popup and remove events
$('.element').popup('destroy');

// Remove popup from DOM only
$('.element').popup('remove popup');

// Check visibility
var isVisible = $('.element').popup('is visible');
var isHidden = $('.element').popup('is hidden');

// Check if popup exists
var exists = $('.element').popup('exists');
```

### Initialization with Settings
```javascript
$('.element').popup({
  // Trigger
  on: 'hover',              // hover, click, focus, manual

  // Position
  position: 'top left',     // Position relative to element
  offset: 0,                // Distance offset in pixels
  distanceAway: 0,          // Offset distance from element
  target: false,            // Element to position relative to

  // Content
  content: '',              // Text content
  html: '',                 // HTML content
  title: '',                // Popup title
  popup: false,             // Selector or jQuery object for existing popup

  // Behavior
  inline: false,            // Create adjacent vs append to body
  preserve: false,          // Keep in DOM when hidden
  hoverable: false,         // Allow hovering popup without closing
  closable: true,           // Click outside to close (with on: 'click')
  exclusive: false,         // Hide other popups when opening
  hideOnScroll: 'auto',     // Hide on scroll (auto, true, false)
  movePopup: true,          // Move popup with target element
  observeChanges: true,     // Destroy if element removed

  // Boundary
  boundary: window,         // Container to constrain popup
  scrollContext: window,    // Element that triggers hide on scroll
  jitter: 2,                // Permissible boundary overflow (px)
  prefer: 'adjacent',       // Prefer 'adjacent' or 'opposite' when constrained
  lastResort: false,        // Force position if cannot fit (position or boolean)

  // Animation
  transition: 'slide down', // Show/hide animation
  duration: 200,            // Animation duration (ms)
  delay: {                  // Trigger delays
    show: 50,
    hide: 0
  },

  // Mobile
  addTouchEvents: true,     // Add touchstart events for mobile

  // Advanced
  context: 'body',          // DOM insertion point
  setFluidWidth: true,      // Prevent overflow with fluid width
  arrowPixelsFromEdge: 20   // Arrow centering threshold
});
```

## Callback Events

### Lifecycle Callbacks
```javascript
$('.element').popup({
  // Called after popup element is created
  onCreate: function($module, $popup) {
    console.log('Popup created');
  },

  // Called before popup is shown (return false to cancel)
  onShow: function($module, $popup) {
    console.log('About to show');
    return true; // Return false to prevent showing
  },

  // Called after popup is visible (animation complete)
  onVisible: function($module, $popup) {
    console.log('Popup is now visible');
  },

  // Called before popup is hidden (return false to cancel)
  onHide: function($module, $popup) {
    console.log('About to hide');
    return true; // Return false to prevent hiding
  },

  // Called after popup is hidden (animation complete)
  onHidden: function($module, $popup) {
    console.log('Popup is now hidden');
  },

  // Called immediately before popup is removed from DOM
  onRemove: function($module, $popup) {
    console.log('Popup being removed');
  },

  // Called if popup positioning fails
  onUnplaceable: function($module, $popup) {
    console.log('Could not position popup');
  }
});
```

### Callback Use Cases
```javascript
// Lazy load content
$('.lazy-popup').popup({
  onShow: function($module, $popup) {
    // Load content only when showing
    $.get('/api/content', function(data) {
      $popup.html(data);
    });
  }
});

// Track analytics
$('.tracked-popup').popup({
  onVisible: function() {
    analytics.track('Popup Viewed');
  }
});

// Validate before closing
$('.validated-popup').popup({
  onHide: function() {
    if (!isValid()) {
      alert('Please complete the form');
      return false; // Prevent closing
    }
  }
});
```

## Notable Features

### 1. Intelligent Auto-Positioning
- **Boundary detection**: Automatically searches alternative positions if preferred position exceeds container boundaries
- **Preference system**: Can prefer `adjacent` (same side) or `opposite` positions when constrained
- **Last resort**: Forces position even if partially offscreen when no standard positions work
- **Jitter tolerance**: Allows small boundary overflow (2px default) before repositioning

### 2. Flexible Content Sources
- **Data attributes**: Declarative HTML approach via `data-content`, `data-html`, `data-title`
- **JavaScript settings**: Programmatic configuration with `content`, `html`, `title` options
- **Inline elements**: Reference existing DOM elements for complex layouts
- **HTML title fallback**: Uses browser's native title attribute if no other content
- **Dynamic updates**: Change content on-the-fly with `.popup('change content', html)`

### 3. Advanced Behavior Controls
- **Inline vs appended**:
  - `inline: true` - Creates popup adjacent to element (inherits local CSS)
  - `inline: false` - Appends to body (avoids parent overflow constraints)
- **Preserve mode**: Keeps popup in DOM when hidden for faster reappearance
- **Exclusive mode**: Automatically closes other popups when opening
- **Hoverable**: Prevents closing when mouse moves from trigger to popup (essential for menus)
- **Move with target**: Popup follows if target element is repositioned

### 4. Multiple Trigger Modes
- **Hover**: Default, with configurable show/hide delays
- **Click**: Toggleable with outside-click dismissal
- **Focus**: Perfect for form field hints
- **Manual**: Full programmatic control
- **Touch support**: Automatic touchstart events for mobile devices

### 5. CSS-Only Tooltip Variant
- **Lightweight**: Uses `:before` and `:after` pseudo-elements
- **No JavaScript**: Pure CSS implementation
- **Limitations**: Less flexible than full popup, conflicts with elements already using pseudo-elements
- **Wrapper requirement**: Icons need span wrapper for tooltip

### 6. Comprehensive API
- **Visibility control**: show, hide, toggle, hide all
- **Content management**: change content, get popup
- **Position control**: reposition, set position
- **State queries**: is visible, is hidden, exists
- **Lifecycle**: destroy, remove popup

### 7. Smart Defaults
- **Auto-hide on scroll**: Prevents orphaned popups (with `auto` mode preserving input focus)
- **Mutation observer**: Automatically destroys popup if trigger element removed from DOM
- **Fluid width handling**: `setFluidWidth: true` prevents 100% width overflow issues
- **Touch event support**: Automatically adds touch triggers on mobile

### 8. Rich Styling System
- **Basic/Inverted**: Minimal or reversed color schemes
- **Width variations**: Standard, wide, very wide, flowing (no max-width)
- **Size scale**: 8 sizes from mini to massive
- **Combinable**: Mix variations like `inverted wide` or `basic large`

### 9. Menu-like Behavior
- Combine settings for dropdown menu experience:
  - `inline: true` - Keep in layout flow
  - `hoverable: true` - Allow hovering menu items
  - `delay: {show: 300, hide: 800}` - Prevent accidental triggers
  - `position: 'bottom left'` - Position like dropdown

### 10. jQuery Integration
- **Module pattern**: Follows Semantic UI's jQuery module architecture
- **Event delegation**: Efficient event handling
- **Method chaining**: Standard jQuery chainable API
- **Data API**: Stores settings and state in jQuery data

## Research Notes

### Framework Architecture
- **jQuery-based**: Classic version built on jQuery (not React/Vue)
- **Module system**: Uses Semantic UI's behavior module pattern
- **CSS framework**: Declarative styling through compositional class names
- **Mutation observer**: Modern DOM monitoring for element lifecycle

### Design Philosophy
- **Semantic naming**: Human-readable class names (`inverted`, `flowing`, `wide`)
- **Progressive enhancement**: Works with data attributes or JavaScript initialization
- **Declarative first**: Prefers HTML configuration over JavaScript
- **Flexible content**: Multiple content sources for different use cases

### Positioning Intelligence
- **Multi-strategy**: Tries preferred position, then searches alternatives
- **Boundary-aware**: Respects container constraints
- **Offset controls**: Manual pixel-level adjustment when needed
- **Target override**: Can position relative to different element than activator

### Performance Considerations
- **Preserve mode**: Trade-off between DOM size and show/hide speed
- **Inline placement**: Affects CSS inheritance and overflow behavior
- **Mutation observer overhead**: `observeChanges: true` adds monitoring cost
- **Animation timing**: Configurable duration and delays for UX optimization

### Common Patterns
- **Tooltip**: Hover trigger, short delay, simple content
- **Popover**: Click trigger, closable, rich content
- **Dropdown menu**: Inline, hoverable, delayed hiding
- **Form hints**: Focus trigger, positioned near input
- **Manual control**: For complex conditional display logic

### Mobile Considerations
- **Touch events**: `addTouchEvents: true` enables mobile interaction
- **Scroll behavior**: `hideOnScroll: false` prevents dismissal when tapping inputs
- **Tap targets**: Hover triggers convert to tap on touch devices

### Accessibility Notes
- **No explicit ARIA**: Documentation doesn't mention ARIA attributes
- **Keyboard navigation**: Focus trigger supports keyboard interaction
- **Screen readers**: Unclear how popup content is announced
- **Manual implementation**: Developers responsible for accessibility features

### Styling Constraints
- **Pseudo-element conflicts**: CSS tooltip can't be used on elements with `:before`/`:after`
- **Wrapper workaround**: Icons need container for tooltip variant
- **Inline CSS scope**: `inline: true` inherits local styles, `false` loses context
- **Max-width defaults**: May need adjustment for content that exceeds boundaries

### Historical Context
- **Pre-component era**: Designed before modern component frameworks
- **jQuery dominance**: Reflects web development patterns of early 2010s
- **CSS architecture**: Pioneered semantic, compositional class naming
- **Comprehensive API**: Mature module with extensive configuration options

### Comparison to Modern Patterns
- **Data attributes vs props**: Uses HTML attributes instead of component props
- **jQuery methods vs hooks**: `.popup('show')` vs React setState patterns
- **Global CSS vs scoped**: Class-based styling vs CSS-in-JS
- **Imperative vs declarative**: Mix of both approaches

### Migration Considerations
- **Class-based API**: Translates to component prop system
- **jQuery selectors**: Replace with refs or query selectors
- **Callbacks**: Map to event handlers or lifecycle hooks
- **Global state**: Multiple popups require coordination (exclusive mode)
