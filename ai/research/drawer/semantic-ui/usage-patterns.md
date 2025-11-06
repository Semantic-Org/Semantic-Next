# Semantic UI - Sidebar Component

## Component Overview

The Semantic UI Sidebar is a jQuery-based module that displays off-canvas content that slides in from the edges of the viewport. It's designed to hide additional content beside a page and reveal it through user interaction, typically used for navigation menus or supplementary content panels.

**Core purpose**: Provides a slide-out panel mechanism for navigation, settings, or auxiliary content that doesn't clutter the main interface but remains easily accessible. The component pushes or overlays main content while presenting hidden information.

**Architecture**: A jQuery module built on Semantic UI's behavior pattern. Requires a specific DOM structure with `.ui.sidebar` element and `.pusher` sibling element within a `.pushable` container. The module uses JavaScript to control visibility, animations, and page layout adjustments.

**Common use cases**: Mobile navigation menus, off-canvas navigation panels, settings panels, filter panels, user account menus, contextual help panels, shopping cart sidebars, notification panels.

## Usage Patterns

### Basic Usage

The simplest Sidebar requires a specific DOM structure with the sidebar element and a pusher for main content:

```html
<div class="ui sidebar inverted vertical menu">
  <a class="item">
    <i class="home icon"></i>
    Home
  </a>
  <a class="item">
    <i class="block layout icon"></i>
    Topics
  </a>
  <a class="item">
    <i class="smile icon"></i>
    Friends
  </a>
</div>
<div class="pusher">
  <div class="ui segment">
    <h3>Application Content</h3>
    <p>Main page content goes here</p>
  </div>
</div>
```

```javascript
// Toggle sidebar visibility
$('.ui.sidebar').sidebar('toggle');

// Attach toggle to a button
$('.ui.sidebar')
  .sidebar('attach events', '.toggle.button');
```

### Variants/Styles

Semantic UI Sidebar supports multiple visual variations and directions:

**Direction Variants**:
- **Left** (default): Slides from left edge
  ```html
  <div class="ui left sidebar">...</div>
  ```
- **Right**: Slides from right edge
  ```html
  <div class="ui right sidebar">...</div>
  ```
- **Top**: Slides from top edge
  ```html
  <div class="ui top sidebar">...</div>
  ```
- **Bottom**: Slides from bottom edge
  ```html
  <div class="ui bottom sidebar">...</div>
  ```

**Width/Height Variations**:
- **Thin**: Narrower sidebar
  ```html
  <div class="ui thin sidebar">...</div>
  ```
- **Very Thin**: Even narrower
  ```html
  <div class="ui very thin sidebar">...</div>
  ```
- **Wide**: Wider sidebar
  ```html
  <div class="ui wide sidebar">...</div>
  ```
- **Very Wide**: Even wider
  ```html
  <div class="ui very wide sidebar">...</div>
  ```

**Note**: Custom widths/heights via CSS are supported, and animations automatically adjust to match.

**Visual Styling**:
- **Inverted**: Dark background (commonly paired with vertical menus)
  ```html
  <div class="ui inverted sidebar vertical menu">...</div>
  ```

### States

**Visible State**:
- Add `visible` class to display sidebar on page load
- Can be set through JavaScript API
- Example: `<div class="ui visible sidebar">...</div>`

**Hidden State** (default):
- Sidebar is hidden off-canvas by default
- Main content occupies full width

**Animating State**:
- Applied automatically during transitions
- Prevents interaction during animation
- Managed by the module

**Dimmed State**:
- Main content can be dimmed when sidebar appears
- Controlled by `dimPage` setting
- Creates focus on sidebar content

### Sizing Options

**Predefined Sizes**:
- `very thin` - Minimal width for compact sidebars
- `thin` - Reduced width for less content
- Default - Standard width
- `wide` - Expanded width for more content
- `very wide` - Maximum width for rich content

**Custom Sizing**:
- Any width/height can be specified via CSS
- Animations automatically adapt to custom dimensions
- Example:
  ```css
  .ui.sidebar {
    width: 350px;
  }
  ```

**Note**: Visibly-loaded sidebars (with `visible` class) should use standard sizes for proper positioning before JavaScript initializes.

### Layout & Positioning

**Required DOM Structure**:
```html
<body>
  <div class="pushable">
    <div class="ui sidebar">
      <!-- Sidebar content -->
    </div>
    <div class="pusher">
      <!-- Main page content -->
    </div>
  </div>
</body>
```

**Fixed Content Integration**:
Fixed elements (like fixed headers/footers) must be siblings to the sidebar and use the `fixed` class to move with page content:

```html
<div class="ui sidebar">...</div>
<div class="ui top fixed menu">
  <!-- Fixed header -->
</div>
<div class="pusher">
  <!-- Main content -->
</div>
```

**Custom Context**:
Sidebars can be initialized within any container element, not just body:

```javascript
$('.ui.sidebar').sidebar({
  context: $('.custom.container')
});
```

**Important Constraint**: The context element cannot have padding (it's removed during initialization).

**Positioning Rules**:
- Sidebar is positioned absolutely within its context
- Pusher element contains all main content
- Multiple sidebars can coexist with overlay or push animations

### Content & Structure

**Typical Content Patterns**:

**Navigation Menu** (most common):
```html
<div class="ui inverted vertical menu sidebar">
  <a class="item">Home</a>
  <a class="item">About</a>
  <a class="item">Services</a>
  <div class="item">
    <div class="header">Products</div>
    <div class="menu">
      <a class="item">Product A</a>
      <a class="item">Product B</a>
    </div>
  </div>
</div>
```

**Icon Menu**:
```html
<div class="ui labeled icon menu sidebar vertical inverted">
  <a class="item">
    <i class="home icon"></i>
    Home
  </a>
  <a class="item">
    <i class="mail icon"></i>
    Messages
  </a>
</div>
```

**Custom Content**:
```html
<div class="ui sidebar">
  <div class="ui segment">
    <h3>Custom Panel</h3>
    <p>Any content can be placed here</p>
    <div class="ui form">
      <!-- Forms, filters, etc. -->
    </div>
  </div>
</div>
```

**Structure Hierarchy**:
```
.pushable (optional wrapper)
├── .ui.sidebar (off-canvas panel)
│   └── [any content - typically .vertical.menu]
├── .ui.fixed.menu (optional fixed header)
└── .pusher (main content wrapper)
    └── [main page content]
```

### Interactive Features

**Toggle Behavior**:
```javascript
// Simple toggle
$('.ui.sidebar').sidebar('toggle');

// Attach toggle to button
$('.ui.sidebar')
  .sidebar('attach events', '.menu .item', 'toggle');
```

**Show/Hide Explicitly**:
```javascript
// Show sidebar
$('.ui.sidebar').sidebar('show');

// Hide sidebar
$('.ui.sidebar').sidebar('hide');

// Attach show behavior to button
$('.ui.sidebar')
  .sidebar('attach events', '.open.button', 'show');
```

**Visibility Checking**:
```javascript
// Check if visible
if ($('.ui.sidebar').sidebar('is visible')) {
  console.log('Sidebar is visible');
}

// Check if hidden
if ($('.ui.sidebar').sidebar('is hidden')) {
  console.log('Sidebar is hidden');
}
```

**Attach Events Method**:
```javascript
// Syntax: .sidebar('attach events', selector, behavior)
$('.ui.sidebar')
  .sidebar('attach events', '.toggle.button', 'toggle');

// Behaviors: 'toggle', 'show', 'hide'
```

**Multiple Sidebars**:
```javascript
// Can display multiple simultaneously with overlay/push animations
$('.left.sidebar').sidebar('show');
$('.right.sidebar').sidebar('show');
```

### Animation & Transitions

**Available Transitions**:

1. **Overlay** (all directions):
   - Sidebar slides over content
   - Content remains stationary
   - Example: `transition: 'overlay'`

2. **Push** (all directions):
   - Sidebar pushes content aside
   - Content moves with sidebar
   - Example: `transition: 'push'`

3. **Scale Down** (all directions):
   - Content scales down and moves
   - Creates depth effect
   - Example: `transition: 'scale down'`

4. **Uncover** (vertical only):
   - Content moves to reveal sidebar underneath
   - Example: `transition: 'uncover'`

5. **Slide Along** (vertical only):
   - Sidebar and content move together
   - Example: `transition: 'slide along'`

6. **Slide Out** (vertical only):
   - Content slides out as sidebar appears
   - Example: `transition: 'slide out'`

**Transition Configuration**:
```javascript
$('.ui.sidebar').sidebar({
  transition: 'overlay',           // Default animation
  mobileTransition: 'overlay',     // Mobile-specific override
  duration: 500,                    // Animation duration (ms)
  easing: 'easeInOutQuint'         // Easing function
});
```

**Default Transitions by Direction**:
- Left/Right: Auto-selected based on best fit
- Top/Bottom: Auto-selected for vertical animations
- Mobile: Can override with `mobileTransition`

**Auto Selection**:
```javascript
// Let module choose best transition
$('.ui.sidebar').sidebar({
  transition: 'auto'
});
```

### Integration Patterns

**With Fixed Navigation**:
```html
<div class="ui sidebar inverted vertical menu">
  <!-- Sidebar menu -->
</div>
<div class="ui top fixed menu">
  <a class="item toggle">
    <i class="sidebar icon"></i>
  </a>
  <a class="item">Logo</a>
</div>
<div class="pusher">
  <div class="ui container">
    <!-- Main content -->
  </div>
</div>

<script>
$('.ui.sidebar')
  .sidebar('attach events', '.toggle');
</script>
```

**Multiple Sidebars**:
```html
<div class="ui left sidebar">Left Panel</div>
<div class="ui right sidebar">Right Panel</div>
<div class="pusher">
  <button class="left-toggle">Toggle Left</button>
  <button class="right-toggle">Toggle Right</button>
</div>

<script>
$('.ui.left.sidebar')
  .sidebar('attach events', '.left-toggle');
$('.ui.right.sidebar')
  .sidebar('attach events', '.right-toggle');
</script>
```

**Custom Context Container**:
```html
<div class="custom container">
  <div class="ui sidebar">
    <!-- Sidebar content -->
  </div>
  <div class="bottom segment">
    <!-- Main content -->
  </div>
</div>

<script>
$('.custom.container .ui.sidebar').sidebar({
  context: $('.custom.container .bottom.segment')
}).sidebar('attach events', '.custom.container .menu .item');
</script>
```

**Responsive Pattern**:
```javascript
// Different transitions for mobile vs desktop
$('.ui.sidebar').sidebar({
  transition: 'push',
  mobileTransition: 'overlay'
});
```

### Accessibility Features

**Mobile Optimizations**:
- iOS-specific fixes via userAgent detection
- Prevents canvas auto-resizing issues on iOS
- Touch-scrolling optimization with `-webkit-overflow-scrolling: touch`
- Prevents page scrolling behind sidebar

**Keyboard Support**:
- Sidebar content is keyboard accessible when visible
- Standard tab navigation within sidebar menus
- Closable sidebars can be dismissed with click/tap outside

**Screen Reader Considerations**:
- Use semantic menu markup for navigation sidebars
- Sidebar content is part of natural DOM order
- Consider adding ARIA labels to toggle buttons:
  ```html
  <button class="toggle" aria-label="Toggle navigation menu">
    <i class="sidebar icon"></i>
  </button>
  ```

**Focus Management**:
- No automatic focus trapping (content remains accessible)
- Consider manually setting focus to first item on open for better UX

## Key Properties/Props

### Behavior Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `context` | Selector/jQuery | `'body'` | Selector or jQuery object specifying where sidebar should appear |
| `exclusive` | Boolean | `false` | Whether multiple sidebars can be visible simultaneously |
| `closable` | Boolean | `true` | Whether sidebar can be closed by clicking dimmed page |
| `dimPage` | Boolean | `true` | Whether to dim page contents when sidebar is visible |
| `scrollLock` | Boolean | `false` | Whether to lock page scroll when sidebar is visible |
| `returnScroll` | Boolean | `false` | Whether to return to original scroll position on hide |
| `delaySetup` | Boolean | `false` | Whether to defer creation of DOM elements until sidebar first shown |

### Animation Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `transition` | String | `'auto'` | Named animation transition. Options: overlay, push, scale down, uncover, slide along, slide out |
| `mobileTransition` | String | `'auto'` | Transition to use on mobile. Defaults to auto if unspecified |
| `defaultTransition` | Object | Direction-based | Default transitions for each direction (horizontal/vertical) |
| `useLegacy` | Boolean/String | `false` | Whether to use legacy (pre-2.2) JavaScript animations. Can be 'auto' |
| `duration` | Number | `500` | Duration of animation in milliseconds (legacy animations only) |
| `easing` | String | `'easeInOutQuint'` | CSS easing function for animation |

### Silent Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `silent` | Boolean | `false` | Silences all console output including error messages |
| `debug` | Boolean | `false` | Provides extra debug output to console |
| `performance` | Boolean | `true` | Provides standard debug output to console |
| `verbose` | Boolean | `false` | Provides ancillary debug output to console |

## API Methods

### Control Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `toggle` | Toggles visibility of sidebar | jQuery |
| `show` | Shows sidebar | jQuery |
| `hide` | Hides sidebar | jQuery |
| `attach events(selector, event)` | Attaches sidebar action to given selector. Event can be 'toggle', 'show', or 'hide' | jQuery |

### State Query Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `is visible` | Returns whether sidebar is visible | Boolean |
| `is hidden` | Returns whether sidebar is hidden | Boolean |

### Utility Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `push page` | Pushes page content to be visible alongside sidebar | jQuery |
| `pull page` | Returns page content to original position | jQuery |
| `get direction` | Returns direction of current sidebar | String |
| `add body CSS` | Adds stylesheet to head to trigger sidebar animations | jQuery |
| `remove body CSS` | Removes any inline stylesheets for sidebar animation | jQuery |
| `get transition event` | Returns vendor prefixed transition end event | String |
| `destroy` | Destroys instance and removes all events | jQuery |

### Standard Module Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `setting(name, value)` | Changes setting | jQuery |
| `setting(name)` | Gets setting value | Mixed |
| `invoke(query)` | Invokes internal method | Mixed |

## Code Examples

### Example 1: Basic Left Sidebar
```html
<div class="ui left sidebar inverted vertical menu">
  <a class="item">
    <i class="home icon"></i>
    Home
  </a>
  <a class="item">
    <i class="block layout icon"></i>
    Topics
  </a>
  <a class="item">
    <i class="smile icon"></i>
    Friends
  </a>
</div>
<div class="pusher">
  <div class="ui basic segment">
    <button class="ui button toggle">
      <i class="sidebar icon"></i>
      Toggle Sidebar
    </button>
    <h3 class="ui header">Application Content</h3>
  </div>
</div>

<script>
$('.ui.sidebar')
  .sidebar('attach events', '.toggle.button');
</script>
```

### Example 2: Right Sidebar
```html
<div class="ui right sidebar inverted vertical menu">
  <a class="item">Settings</a>
  <a class="item">Profile</a>
  <a class="item">Logout</a>
</div>
<div class="pusher">
  <button class="ui button toggle right">
    Open Right Menu
  </button>
</div>

<script>
$('.ui.right.sidebar')
  .sidebar('attach events', '.toggle.right');
</script>
```

### Example 3: Top Sidebar
```html
<div class="ui top sidebar">
  <div class="ui segment">
    <h3>Top Panel Content</h3>
    <p>Notification panel or filtering options</p>
  </div>
</div>
<div class="pusher">
  <button class="ui button toggle">Show Top Panel</button>
</div>

<script>
$('.ui.top.sidebar')
  .sidebar('attach events', '.toggle');
</script>
```

### Example 4: Push Transition
```html
<div class="ui sidebar inverted vertical menu">
  <a class="item">Option 1</a>
  <a class="item">Option 2</a>
</div>
<div class="pusher">
  <button class="ui button toggle">Toggle (Push)</button>
</div>

<script>
$('.ui.sidebar')
  .sidebar({
    transition: 'push'
  })
  .sidebar('attach events', '.toggle');
</script>
```

### Example 5: Overlay Transition
```html
<div class="ui sidebar inverted vertical menu">
  <a class="item">Menu Item</a>
</div>
<div class="pusher">
  <button class="ui button toggle">Toggle (Overlay)</button>
</div>

<script>
$('.ui.sidebar')
  .sidebar({
    transition: 'overlay'
  })
  .sidebar('attach events', '.toggle');
</script>
```

### Example 6: Scale Down Transition
```html
<div class="ui sidebar inverted vertical menu">
  <a class="item">Navigation</a>
</div>
<div class="pusher">
  <button class="ui button toggle">Toggle (Scale Down)</button>
</div>

<script>
$('.ui.sidebar')
  .sidebar({
    transition: 'scale down'
  })
  .sidebar('attach events', '.toggle');
</script>
```

### Example 7: Multiple Sidebars
```html
<div class="ui left sidebar inverted vertical menu">
  <a class="item">Left Menu</a>
</div>
<div class="ui right sidebar inverted vertical menu">
  <a class="item">Right Menu</a>
</div>
<div class="pusher">
  <button class="ui button left">Toggle Left</button>
  <button class="ui button right">Toggle Right</button>
</div>

<script>
$('.ui.left.sidebar')
  .sidebar('attach events', '.ui.button.left');
$('.ui.right.sidebar')
  .sidebar('attach events', '.ui.button.right');
</script>
```

### Example 8: Visible on Load
```html
<div class="ui visible sidebar inverted vertical menu">
  <a class="item">Always Visible Initially</a>
</div>
<div class="pusher">
  <button class="ui button toggle">Toggle</button>
</div>

<script>
$('.ui.sidebar')
  .sidebar('attach events', '.toggle');
</script>
```

### Example 9: Custom Context
```html
<div class="custom container">
  <div class="ui sidebar inverted vertical menu">
    <a class="item">Menu Item</a>
  </div>
  <div class="bottom segment">
    <button class="ui button toggle">Toggle in Context</button>
  </div>
</div>

<script>
$('.custom.container .ui.sidebar')
  .sidebar({
    context: $('.custom.container .bottom.segment')
  })
  .sidebar('attach events', '.custom.container .toggle');
</script>
```

### Example 10: With Fixed Header
```html
<div class="ui sidebar inverted vertical menu">
  <a class="item">Navigation</a>
</div>
<div class="ui top fixed menu">
  <a class="item toggle">
    <i class="sidebar icon"></i>
  </a>
  <a class="item">Logo</a>
</div>
<div class="pusher">
  <div class="ui container">
    <h1>Main Content</h1>
  </div>
</div>

<script>
$('.ui.sidebar')
  .sidebar('attach events', '.top.menu .toggle');
</script>
```

### Example 11: Different Mobile Transition
```html
<div class="ui sidebar inverted vertical menu">
  <a class="item">Responsive Menu</a>
</div>
<div class="pusher">
  <button class="ui button toggle">Toggle</button>
</div>

<script>
$('.ui.sidebar')
  .sidebar({
    transition: 'push',
    mobileTransition: 'overlay'
  })
  .sidebar('attach events', '.toggle');
</script>
```

### Example 12: Manual Show/Hide
```html
<div class="ui sidebar inverted vertical menu">
  <a class="item">Manual Control</a>
</div>
<div class="pusher">
  <button class="ui button show">Show</button>
  <button class="ui button hide">Hide</button>
</div>

<script>
// Manual control without attach events
$('.show').click(function() {
  $('.ui.sidebar').sidebar('show');
});
$('.hide').click(function() {
  $('.ui.sidebar').sidebar('hide');
});
</script>
```

### Example 13: Check Visibility State
```html
<div class="ui sidebar inverted vertical menu">
  <a class="item">State Check</a>
</div>
<div class="pusher">
  <button class="ui button toggle">Toggle</button>
  <button class="ui button check">Check State</button>
</div>

<script>
$('.ui.sidebar')
  .sidebar('attach events', '.toggle');

$('.check').click(function() {
  if ($('.ui.sidebar').sidebar('is visible')) {
    alert('Sidebar is visible');
  } else {
    alert('Sidebar is hidden');
  }
});
</script>
```

### Example 14: Custom Width Sidebar
```html
<style>
.ui.custom.sidebar {
  width: 350px;
}
</style>

<div class="ui custom sidebar inverted vertical menu">
  <a class="item">Wide Sidebar</a>
</div>
<div class="pusher">
  <button class="ui button toggle">Toggle Custom Width</button>
</div>

<script>
$('.ui.custom.sidebar')
  .sidebar('attach events', '.toggle');
</script>
```

### Example 15: No Page Dimming
```html
<div class="ui sidebar inverted vertical menu">
  <a class="item">No Dim</a>
</div>
<div class="pusher">
  <button class="ui button toggle">Toggle (No Dim)</button>
</div>

<script>
$('.ui.sidebar')
  .sidebar({
    dimPage: false
  })
  .sidebar('attach events', '.toggle');
</script>
```

## Accessibility Notes

**Semantic HTML**:
- Use proper menu markup (`<nav>` or menu classes) for navigation sidebars
- Maintain logical heading hierarchy within sidebar content
- Use semantic list structures when appropriate

**ARIA Considerations**:
- Consider adding `role="navigation"` to navigation sidebars
- Add `aria-label` or `aria-labelledby` to describe sidebar purpose
- Toggle buttons should have descriptive labels:
  ```html
  <button aria-label="Open navigation menu" class="toggle">
    <i class="sidebar icon" aria-hidden="true"></i>
  </button>
  ```

**Keyboard Navigation**:
- All interactive elements within sidebar are keyboard accessible
- Standard tab order applies
- No focus trapping by default (content outside sidebar remains accessible)
- Consider implementing Escape key to close sidebar for better UX:
  ```javascript
  $(document).keyup(function(e) {
    if (e.keyCode === 27) { // Escape
      $('.ui.sidebar').sidebar('hide');
    }
  });
  ```

**Mobile Accessibility**:
- Touch-scrolling optimized for mobile devices
- iOS-specific fixes for smooth performance
- Mobile transitions can differ from desktop for better mobile UX

**Focus Management Best Practices**:
- Consider moving focus to first interactive element when sidebar opens
- Return focus to trigger element when sidebar closes
- Example:
  ```javascript
  $('.ui.sidebar')
    .sidebar({
      onShow: function() {
        $('.sidebar .item').first().focus();
      },
      onHide: function() {
        $('.toggle').focus();
      }
    });
  ```

**Color Contrast**:
- Inverted menu variant provides high contrast
- Ensure custom color schemes meet WCAG standards
- Dimmed page provides visual focus cue

## Common Patterns

1. **Mobile Navigation Menu**: Left sidebar with vertical menu, overlay transition, attached to hamburger icon
2. **User Account Panel**: Right sidebar with user settings, overlay transition
3. **Filter Panel**: Left/right sidebar with form controls, push transition to show results alongside filters
4. **Multi-sidebar Layout**: Left navigation + right settings, both using overlay to allow simultaneous visibility
5. **Responsive Navigation**: Different transitions for mobile (overlay) vs desktop (push)
6. **Contextual Sidebar**: Sidebar within a specific container rather than full page
7. **Persistent Sidebar**: Visible on load for desktop layouts, hideable on mobile
8. **Top Notification Panel**: Top sidebar for system messages or alerts
9. **Bottom Filter Panel**: Bottom sidebar for search filters or options
10. **Off-canvas Content**: Any supplementary content that slides in on demand

## Related Components

- **Menu** - Most commonly used content within sidebars (especially vertical inverted menus)
- **Dimmer** - Implicitly used when `dimPage: true` to focus attention on sidebar
- **Icon** - Used in labeled icon menus and toggle buttons
- **Button** - Trigger elements for showing/hiding sidebar
- **Segment** - Can contain custom sidebar content
- **Container** - Often wraps pusher content for proper layout
- **Fixed Menu** - Integrates with sidebar using `fixed` class
- **Dropdown** - Can be used within sidebar menus
- **Accordion** - Can be nested in sidebar for expandable sections

## Callbacks

### Lifecycle Callbacks

| Callback | Context | Description |
|----------|---------|-------------|
| `onVisible` | Sidebar | Called before sidebar becomes visible |
| `onShow` | Sidebar | Called when sidebar starts to show |
| `onChange` | Sidebar | Called when sidebar visibility changes |
| `onHide` | Sidebar | Called when sidebar starts to hide |
| `onHidden` | Sidebar | Called after sidebar is hidden |

**Usage Example**:
```javascript
$('.ui.sidebar').sidebar({
  onShow: function() {
    console.log('Sidebar is showing');
  },
  onHidden: function() {
    console.log('Sidebar is now hidden');
  }
});
```

## DOM Settings

| Setting | Description |
|---------|-------------|
| `namespace` | Event namespace. Used to bind events |
| `className` | Class names used to attach style to state |
| `regExp` | Regular expressions used for template matching |
| `selector` | Selectors used to find parts of a module |

**Default Class Names**:
- `active`: "active"
- `animating`: "animating"
- `dimmed`: "dimmed"
- `ios`: "ios"
- `pushable`: "pushable"
- `pushed`: "pushed"
- `right`: "right"
- `top`: "top"
- `left`: "left"
- `bottom`: "bottom"
- `visible`: "visible"

## Technical Notes

**jQuery Dependency**: This is a jQuery-based module requiring jQuery to function. Modern frameworks may prefer native JavaScript drawer/sidebar implementations.

**DOM Manipulation**: The module manipulates the DOM structure, adding wrapper elements (`.pushable`) if not present. It also removes padding from context elements.

**CSS Animations**: Newer versions use CSS transitions for better performance. Legacy JavaScript animations available via `useLegacy` setting.

**Mobile Detection**: Uses userAgent detection for iOS-specific optimizations. Consider feature detection for more robust cross-platform support.

**Context Constraints**: Custom context elements cannot have padding (it's forcibly removed during initialization).

**Performance Considerations**:
- Multiple sidebars with complex animations may impact performance
- CSS transitions generally perform better than JavaScript animations
- Delay setup option can improve initial page load time

**Browser Compatibility**: Designed for modern browsers with CSS3 transition support. Legacy animation fallback available for older browsers.

---

**Research completed:** 2025-11-06
**Component:** Sidebar (Drawer)
**Framework:** Semantic UI Classic (jQuery)
**Documentation:** https://semantic-ui.com/modules/sidebar.html

**Notable Features:**
- jQuery-based module with behavior pattern API
- Six different animation transitions (overlay, push, scale down, uncover, slide along, slide out)
- Four directional variants (left, right, top, bottom)
- Multiple sizing options (very thin, thin, default, wide, very wide)
- Custom context support for sidebars within specific containers
- Multiple simultaneous sidebars with compatible animations
- Mobile-specific transition overrides
- iOS-specific optimizations
- Comprehensive callback system for lifecycle events
- Integration with fixed menus and other Semantic UI components
- CSS-based animations with legacy JavaScript fallback
- Automatic DOM structure creation and manipulation
