# Semantic UI Classic Sidebar - Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://semantic-ui.com/modules/sidebar.html
Status: ✅ Working
Version: Semantic UI 2.x (jQuery-based)
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - Extensive documentation with detailed examples covering all placement directions, animation types, states, jQuery API, and advanced configuration options.

## Component Definition
- **Core purpose**: A versatile off-canvas navigation and content container that slides in from any edge of the viewport, with sophisticated animation and behavioral control
- **Mental model**: A dynamic side panel that pushes or overlays page content when opened, designed for navigation menus, filters, or additional content that shouldn't always be visible
- **Semantic meaning**: Provides contextual navigation or auxiliary content access without permanently consuming screen space

## Unique Characteristics
Semantic UI Classic's Sidebar is distinctive because it:
- **Multi-directional placement**: Supports left, right, top, and bottom positioning
- **Rich animation system**: Multiple animation types including push, overlay, scale down, uncover, slide along, and slide out
- **Intelligent context handling**: Automatically manages pusher elements and content layout
- **Mobile-aware transitions**: Different default transitions for mobile vs desktop
- **Exclusive mode support**: Can enforce mutually exclusive sidebars or allow simultaneous visibility
- **RTL support**: Built-in right-to-left language support

## Pattern Support Levels
- **Native**: Dedicated class-based API and jQuery behaviors (e.g., `class="ui sidebar"`, `.sidebar('show')`)
- **Composed**: Via HTML structure with sidebar + pusher pattern
- **JavaScript-Enhanced**: Rich jQuery API for control, callbacks, and advanced behavioral options

---

## HTML Structure Pattern

### Basic Structure
```html
<body class="pushable">
  <!-- Sidebar -->
  <div class="ui left sidebar vertical menu">
    <a class="item">
      <i class="home icon"></i>
      Home
    </a>
    <a class="item">
      <i class="file icon"></i>
      Messages
    </a>
  </div>

  <!-- Pusher element (wraps main page content) -->
  <div class="pusher">
    <!-- Main page content -->
    <div class="ui basic segment">
      <h1>Main Content</h1>
    </div>
  </div>
</body>
```

**Key Components:**
- Container: `<body class="pushable">` - Root container that enables sidebar behavior (can be any element with semantic context)
- Sidebar: `<div class="ui [direction] sidebar [type] [variation]">` - The sidebar element itself
- Pusher: `<div class="pusher">` - Wraps main content that will be pushed when sidebar opens
- Direction classes: `left`, `right`, `top`, `bottom`
- Menu type (optional): `vertical menu`, `menu`, or custom content
- Additional classes can include variations and styling

**Notes:**
- The `.pushable` container should be the body or a wrapper that contains all content
- Sidebar must be a direct child of the pushable context
- Pusher element wraps all content that should be pushed/overlaid
- Multiple sidebars can exist (controlled via exclusive/non-exclusive modes)

---

## jQuery API

### Initialization
```javascript
$('.ui.sidebar').sidebar();

// With settings
$('.ui.sidebar').sidebar({
  context: 'body',
  transition: 'auto',
  dimPage: true,
  closable: true
});

// Initialize with different contexts
$('.ui.sidebar').sidebar({
  context: $('.custom-container')
});
```

### Core Methods

| Method | Description | Example |
|--------|-------------|---------|
| `show` | Display sidebar with animation | `$('.ui.sidebar').sidebar('show')` |
| `hide` | Hide sidebar with animation | `$('.ui.sidebar').sidebar('hide')` |
| `toggle` | Switch sidebar visibility state | `$('.ui.sidebar').sidebar('toggle')` |
| `push page` | Animate page push (internal) | `$('.ui.sidebar').sidebar('push page')` |
| `pull page` | Animate page pull (internal) | `$('.ui.sidebar').sidebar('pull page')` |

### Event Attachment
```javascript
// Attach sidebar toggle to button
$('.ui.sidebar').sidebar('attach events', '.toggle.button');

// Attach show action to button
$('.ui.sidebar').sidebar('attach events', '.show.button', 'show');

// Attach hide action to button
$('.ui.sidebar').sidebar('attach events', '.hide.button', 'hide');
```

### Query Methods (Return Booleans)

| Method | Returns | Description |
|--------|---------|-------------|
| `is visible` | Boolean | Whether sidebar is currently visible |
| `is hidden` | Boolean | Whether sidebar is currently hidden |
| `is open` | Boolean | Alias for `is visible` |
| `is closed` | Boolean | Alias for `is hidden` |
| `is animating` | Boolean | Whether sidebar is currently animating |
| `is vertical` | Boolean | Whether sidebar uses top/bottom direction |
| `is rtl` | Boolean | Whether document is right-to-left |

### Utility Methods

| Method | Description |
|--------|-------------|
| `refresh` | Refresh selector cache and context |
| `refresh sidebars` | Refresh other sidebar references |
| `repaint` | Force browser repaint (internal) |

### Method Invocation Examples
```javascript
// Show sidebar with callback
$('.ui.sidebar').sidebar('show', function() {
  console.log('Sidebar is now visible');
});

// Toggle with callback
$('.ui.sidebar').sidebar('toggle', function() {
  console.log('Sidebar toggled');
});

// Query visibility state
var isVisible = $('.ui.sidebar').sidebar('is visible');

// Refresh after dynamic DOM changes
$('.ui.sidebar').sidebar('refresh');

// Hide all other sidebars
$('.ui.sidebar').not('.current').sidebar('hide');
```

---

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `context` | Selector/DOM | `body` | Context element that contains sidebar and pusher |
| `transition` | String | `'auto'` | Animation type: `auto`, `overlay`, `push`, `scale down`, `uncover`, `slide along`, `slide out`. `auto` uses direction-specific defaults |
| `mobileTransition` | String | `'auto'` | Animation type specifically for mobile devices |
| `exclusive` | Boolean | `false` | Whether only one sidebar can be visible at a time |
| `closable` | Boolean | `true` | Whether clicking outside sidebar closes it |
| `dimPage` | Boolean | `true` | Whether to dim the page when sidebar is visible |
| `scrollLock` | Boolean | `false` | Whether to prevent page scrolling when sidebar is open |
| `returnScroll` | Boolean | `false` | Whether to restore scroll position after sidebar closes |
| `delaySetup` | Boolean | `false` | Whether to delay initial layout setup to avoid render blocking |
| `duration` | Number | `500` | Animation duration in milliseconds |

### Default Transitions by Direction

```javascript
defaultTransition: {
  computer: {
    left: 'uncover',
    right: 'uncover',
    top: 'overlay',
    bottom: 'overlay'
  },
  mobile: {
    left: 'uncover',
    right: 'uncover',
    top: 'overlay',
    bottom: 'overlay'
  }
}
```

### Debug Settings
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `silent` | Boolean | `false` | Silences console output |
| `debug` | Boolean | `false` | Shows debug messages in console |
| `verbose` | Boolean | `false` | Shows verbose debug messages |
| `performance` | Boolean | `true` | Shows performance metrics |

---

## Callbacks

### State Change Callbacks

| Callback | Context | Description |
|----------|---------|-------------|
| `onChange` | Sidebar Element | Fired when sidebar state changes (show or hide) |
| `onShow` | Sidebar Element | Fired when sidebar show animation begins |
| `onVisible` | Sidebar Element | Fired when sidebar show animation completes |
| `onHide` | Sidebar Element | Fired when sidebar hide animation begins |
| `onHidden` | Sidebar Element | Fired when sidebar hide animation completes |

### Callback Examples
```javascript
$('.ui.sidebar').sidebar({
  onShow: function() {
    console.log('Sidebar is showing');
  },
  onVisible: function() {
    console.log('Sidebar animation complete');
  },
  onChange: function() {
    console.log('State changed');
  },
  onHidden: function() {
    console.log('Sidebar is now hidden');
  }
});
```

---

## Component Overview

### Basic Sidebar with Menu
```html
<body class="pushable">
  <div class="ui left sidebar vertical menu">
    <a class="item">
      <i class="home icon"></i>
      Home
    </a>
    <a class="item">
      <i class="gamepad icon"></i>
      Games
    </a>
    <a class="item">
      <i class="camera icon"></i>
      Channels
    </a>
  </div>

  <div class="pusher">
    <div class="ui basic segment">
      <h1>Main Content Area</h1>
    </div>
  </div>
</body>

<script>
$('.ui.sidebar').sidebar();
$('.hamburger.button').on('click', function() {
  $('.ui.sidebar').sidebar('toggle');
});
</script>
```

---

## Placement Patterns

### Left Sidebar (Default)
```html
<body class="pushable">
  <div class="ui left sidebar vertical menu">
    <a class="item">Navigation</a>
  </div>
  <div class="pusher">
    <!-- Main content -->
  </div>
</body>

<script>
$('.ui.sidebar').sidebar();
</script>
```

### Right Sidebar
```html
<body class="pushable">
  <div class="ui right sidebar vertical menu">
    <a class="item">Sidebar Item</a>
  </div>
  <div class="pusher">
    <!-- Main content -->
  </div>
</body>

<script>
$('.ui.sidebar').sidebar();
</script>
```

### Top Sidebar
```html
<body class="pushable">
  <div class="ui top sidebar menu">
    <a class="item">Home</a>
    <a class="item">About</a>
  </div>
  <div class="pusher">
    <!-- Main content -->
  </div>
</body>

<script>
$('.ui.sidebar').sidebar();
</script>
```

### Bottom Sidebar
```html
<body class="pushable">
  <div class="ui bottom sidebar menu">
    <a class="item">Footer Item 1</a>
    <a class="item">Footer Item 2</a>
  </div>
  <div class="pusher">
    <!-- Main content -->
  </div>
</body>

<script>
$('.ui.sidebar').sidebar();
</script>
```

---

## Size Patterns

### Width Control (Horizontal Sidebars)
```html
<!-- Default width -->
<div class="ui left sidebar vertical menu">
  <!-- Content -->
</div>

<!-- Custom width via CSS -->
<style>
  .ui.sidebar {
    width: 300px; /* Custom width */
  }

  /* Thin sidebar -->
  .ui.sidebar.thin {
    width: 200px;
  }

  /* Wide sidebar -->
  .ui.sidebar.wide {
    width: 400px;
  }
</style>
```

### Height Control (Vertical Sidebars)
```html
<!-- Custom height for top/bottom sidebars -->
<style>
  .ui.top.sidebar {
    height: 200px;
  }

  .ui.bottom.sidebar {
    height: 150px;
  }
</style>
```

### Responsive Sizing
```html
<style>
  .ui.sidebar {
    width: 100%;
    max-width: 250px;
  }

  @media (max-width: 768px) {
    .ui.sidebar {
      max-width: 200px;
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .ui.sidebar {
      width: 100%;
      max-width: 100%;
    }
  }
</style>
```

---

## Content Patterns

### Menu Content
```html
<div class="ui left sidebar vertical menu">
  <a class="item">
    <i class="home icon"></i>
    Home
  </a>
  <a class="item">
    <i class="file icon"></i>
    Documents
  </a>
  <div class="divider"></div>
  <a class="item">
    <i class="sign out icon"></i>
    Logout
  </a>
</div>
```

### Custom Content
```html
<div class="ui left sidebar">
  <div class="segment">
    <h3>Sidebar Title</h3>
    <p>Custom HTML content in sidebar</p>
    <button class="ui button">Action Button</button>
  </div>
</div>
```

### Rich Content with Images
```html
<div class="ui left sidebar vertical menu">
  <div class="header item">
    <img class="ui mini circular image" src="avatar.png">
    <span>User Name</span>
  </div>
  <a class="item">Profile</a>
  <a class="item">Settings</a>
</div>
```

### Form Content
```html
<div class="ui left sidebar">
  <div class="ui form">
    <div class="field">
      <label>Search</label>
      <input type="text" placeholder="Search...">
    </div>
    <button class="ui button">Search</button>
  </div>
</div>
```

---

## Animation Patterns

### Push Animation
Pushes the page content along with the sidebar (default for left/right on desktop)
```html
<div class="ui left sidebar vertical menu">
  <!-- Content -->
</div>

<script>
$('.ui.sidebar').sidebar({
  transition: 'push'
});
</script>
```

### Overlay Animation
Sidebar overlays the content without pushing (default for top/bottom on desktop)
```html
<script>
$('.ui.sidebar').sidebar({
  transition: 'overlay'
});
</script>
```

### Scale Down Animation
Content scales down while sidebar appears
```html
<script>
$('.ui.sidebar').sidebar({
  transition: 'scale down'
});
</script>
```

### Uncover Animation
Content slides out to reveal sidebar (default for left/right on mobile)
```html
<script>
$('.ui.sidebar').sidebar({
  transition: 'uncover'
});
</script>
```

### Slide Along Animation
Sidebar and content slide together from the edge
```html
<script>
$('.ui.sidebar').sidebar({
  transition: 'slide along'
});
</script>
```

### Slide Out Animation
Content slides out as sidebar appears
```html
<script>
$('.ui.sidebar').sidebar({
  transition: 'slide out'
});
</script>
```

### Auto Transition (Direction-Aware)
```html
<script>
// Default behavior - optimal transition per direction
$('.ui.sidebar').sidebar({
  transition: 'auto' // Uses defaults based on direction
});

// Left/Right: uncover on mobile, uncover on desktop
// Top/Bottom: overlay on mobile, overlay on desktop
</script>
```

### Custom Duration
```html
<script>
$('.ui.sidebar').sidebar({
  transition: 'push',
  duration: 800 // 800ms animation
});
</script>
```

---

## State Patterns

### Visible/Hidden State
```javascript
// Check visibility
if ($('.ui.sidebar').sidebar('is visible')) {
  console.log('Sidebar is open');
}

// Check hidden state
if ($('.ui.sidebar').sidebar('is hidden')) {
  console.log('Sidebar is closed');
}

// Check if animating
if ($('.ui.sidebar').sidebar('is animating')) {
  console.log('Sidebar is currently animating');
}
```

### Programmatic Show/Hide
```javascript
// Show sidebar
$('.ui.sidebar').sidebar('show', function() {
  console.log('Sidebar shown');
});

// Hide sidebar
$('.ui.sidebar').sidebar('hide', function() {
  console.log('Sidebar hidden');
});

// Toggle sidebar
$('.ui.sidebar').sidebar('toggle', function() {
  console.log('Sidebar toggled');
});
```

### Initial Visibility
```html
<!-- Start sidebar as visible -->
<div class="ui left sidebar vertical menu visible">
  <!-- Content -->
</div>

<script>
$('.ui.sidebar').sidebar({
  onVisible: function() {
    console.log('Sidebar is visible');
  }
});
</script>
```

---

## Accessibility

### Keyboard Navigation
```html
<body class="pushable">
  <div class="ui left sidebar vertical menu" role="navigation">
    <a class="item" href="#home" tabindex="0">
      <i class="home icon"></i>
      Home
    </a>
    <a class="item" href="#about" tabindex="0">
      <i class="info icon"></i>
      About
    </a>
  </div>

  <div class="pusher">
    <!-- Main content -->
  </div>
</body>
```

### ARIA Attributes
```html
<div class="ui left sidebar vertical menu"
     role="navigation"
     aria-label="Main navigation"
     aria-hidden="false">
  <a class="item" role="menuitem">Item</a>
</div>

<button aria-controls="sidebar-menu" aria-expanded="false">
  Toggle Menu
</button>

<script>
$('.ui.sidebar').sidebar({
  onShow: function() {
    $('[aria-controls="sidebar-menu"]').attr('aria-expanded', 'true');
  },
  onHidden: function() {
    $('[aria-controls="sidebar-menu"]').attr('aria-expanded', 'false');
  }
});
</script>
```

### Focus Management
```javascript
$('.ui.sidebar').sidebar({
  onShow: function() {
    // Set focus to first focusable element in sidebar
    $('.ui.sidebar').find('a, button').first().focus();
  },
  onHidden: function() {
    // Return focus to trigger button
    $('.menu.button').focus();
  }
});
```

### Close on Escape Key
```javascript
$(document).on('keydown', function(e) {
  if (e.keyCode === 27) { // Escape key
    $('.ui.sidebar').sidebar('hide');
  }
});
```

---

## Integration Patterns

### With Toggle Button
```html
<body class="pushable">
  <div class="ui">
    <button class="ui icon button" id="menu-toggle">
      <i class="sidebar icon"></i>
    </button>
  </div>

  <div class="ui left sidebar vertical menu">
    <a class="item">Navigation Item</a>
  </div>

  <div class="pusher">
    <!-- Main content -->
  </div>
</body>

<script>
$('.ui.sidebar').sidebar();
$('#menu-toggle').on('click', function() {
  $('.ui.sidebar').sidebar('toggle');
});
</script>
```

### With Navigation Bar
```html
<body class="pushable">
  <nav class="ui menu">
    <button class="ui icon button" id="sidebar-toggle">
      <i class="sidebar icon"></i>
    </button>
    <div class="ui header item">App Title</div>
  </nav>

  <div class="ui left sidebar vertical menu">
    <a class="item">Home</a>
    <a class="item">Settings</a>
  </div>

  <div class="pusher">
    <div class="ui container">
      <!-- Main content -->
    </div>
  </div>
</body>
```

### Multiple Sidebars (Exclusive Mode)
```html
<body class="pushable">
  <!-- Left sidebar -->
  <div class="ui left sidebar vertical menu">
    <a class="item">Left Nav 1</a>
  </div>

  <!-- Right sidebar -->
  <div class="ui right sidebar vertical menu">
    <a class="item">Right Nav 1</a>
  </div>

  <div class="pusher">
    <button class="toggle.left.button">Open Left</button>
    <button class="toggle.right.button">Open Right</button>
  </div>
</body>

<script>
$('.ui.sidebar').sidebar({
  exclusive: true // Only one can be open at a time
});

$('.toggle.left.button').on('click', function() {
  $('.ui.left.sidebar').sidebar('toggle');
});

$('.toggle.right.button').on('click', function() {
  $('.ui.right.sidebar').sidebar('toggle');
});
</script>
```

### Multiple Sidebars (Non-Exclusive Mode)
```javascript
$('.ui.sidebar').sidebar({
  exclusive: false // Multiple sidebars can be open
});

// Both sidebars can be visible simultaneously
$('.ui.left.sidebar').sidebar('show');
$('.ui.right.sidebar').sidebar('show');
```

### Close on Link Click
```javascript
$('.ui.sidebar').sidebar();

// Close sidebar when a link is clicked
$('.ui.sidebar a').on('click', function() {
  $('.ui.sidebar').sidebar('hide');
});
```

### Dynamic Content Loading
```javascript
$('.ui.sidebar').sidebar({
  onShow: function() {
    // Load content dynamically
    $.get('/api/sidebar-content', function(data) {
      $('.ui.sidebar').html(data);
    });
  }
});
```

---

## Advanced Patterns

### Custom Context Container
```html
<div class="custom-container pushable">
  <div class="ui left sidebar vertical menu">
    <!-- Sidebar content -->
  </div>

  <div class="pusher">
    <!-- Main content -->
  </div>
</div>

<script>
$('.ui.sidebar').sidebar({
  context: '.custom-container'
});
</script>
```

### RTL (Right-to-Left) Support
```html
<html dir="rtl">
<body class="pushable">
  <div class="ui left sidebar vertical menu">
    <!-- Direction is automatically flipped in RTL -->
  </div>
  <div class="pusher">
    <!-- Content -->
  </div>
</body>

<script>
$('.ui.sidebar').sidebar({
  // RTL is automatically detected
});
</script>
```

### Responsive Sidebar Behavior
```javascript
$('.ui.sidebar').sidebar({
  transition: 'auto', // Uses defaults per direction
  mobileTransition: 'overlay' // Force overlay on mobile
});

// Adjust for screen size
$(window).on('resize', function() {
  if ($(window).width() < 768) {
    // Mobile adjustments
    $('.ui.sidebar').sidebar('setting', 'transition', 'overlay');
  } else {
    // Desktop adjustments
    $('.ui.sidebar').sidebar('setting', 'transition', 'push');
  }
});
```

### Page Dimming Control
```javascript
$('.ui.sidebar').sidebar({
  dimPage: true, // Dim background when open (default)
  closable: true // Click outside to close
});

// Custom close handler
$('.ui.dimmer').on('click', function() {
  $('.ui.sidebar').sidebar('hide');
});
```

### Scroll Lock for Mobile
```javascript
$('.ui.sidebar').sidebar({
  scrollLock: true, // Prevent body scroll when sidebar open
  returnScroll: true // Restore scroll position after close
});
```

### Performance Optimization
```javascript
$('.ui.sidebar').sidebar({
  delaySetup: true, // Prevents render blocking on page load
  duration: 300 // Faster animations for perceived performance
});
```

### Event Delegation
```javascript
// Attach sidebar toggle to dynamically created buttons
$('.ui.sidebar').sidebar('attach events', '.menu-toggle', 'toggle');

// Later, dynamically created buttons automatically toggle sidebar
$('<button class="menu-toggle">Menu</button>').appendTo('body');
```

### State Persistence
```javascript
// Remember sidebar state
$('.ui.sidebar').sidebar({
  onShow: function() {
    localStorage.setItem('sidebarOpen', 'true');
  },
  onHidden: function() {
    localStorage.setItem('sidebarOpen', 'false');
  }
});

// Restore sidebar state on page load
$(document).ready(function() {
  if (localStorage.getItem('sidebarOpen') === 'true') {
    $('.ui.sidebar').sidebar('show');
  }
});
```

---

## Notable Features

- **Multi-directional support**: Four directions (left, right, top, bottom) with directionally-optimized defaults
- **Rich animation library**: Six distinct animation types with direction-aware defaults for desktop/mobile
- **Intelligent content layout**: Automatic pusher element creation if missing, with CSS-based transforms
- **Exclusive mode control**: Can enforce single-sidebar or allow multiple simultaneous sidebars
- **Mobile detection**: Automatic responsive transitions based on device type
- **RTL support**: Built-in right-to-left language detection and layout adjustment
- **Click-outside handling**: Optional auto-close when clicking outside the sidebar
- **Scroll management**: Optional scroll locking and restoration capabilities
- **Dimming effect**: Optional background dimming with customizable behavior
- **jQuery-based**: Classic version uses jQuery for all interactions
- **Flexible context**: Works with any parent element, not just body
- **Callback system**: Comprehensive before/after callbacks for show, hide, and state changes

---

## Research Notes

- **Framework approach**: Class-based utility system with jQuery plugin architecture. Semantic UI Classic uses a compositional approach where sidebar behavior is achieved through HTML structure (sidebar + pusher) and jQuery initialization.

- **Layout strategy**: Uses CSS transforms (translate3d) for smooth 60fps animations while maintaining layout efficiency. Dynamically injects CSS rules for proper animation distances based on element dimensions.

- **Mobile awareness**: Sophisticated mobile detection that adjusts default animation types per device. Separate configuration for mobile vs desktop transitions enables optimal UX for each context.

- **Exclusive vs non-exclusive**: The exclusive mode setting allows enforcement of single-sidebar visibility, useful for navigation where only one drawer should be open. Non-exclusive mode allows simultaneous visibility of multiple sidebars.

- **Pusher pattern**: The "pusher" concept (content wrapper) is central to the sidebar mechanism. When the sidebar shows, the pusher element is transformed, creating either a push effect or allowing the sidebar to overlay.

- **Animation diversity**: Six animation types provide rich visual options:
  - Push: Content moves with sidebar (complex layout)
  - Overlay: Sidebar appears over content (no layout shift)
  - Scale down: Content scales while sidebar appears
  - Uncover: Content slides revealing sidebar beneath
  - Slide along: Both animate together
  - Slide out: Content slides away as sidebar appears

- **CSS injection**: For optimal performance, sidebar injects custom CSS rules for animation distances at runtime, allowing responsive sizing based on actual element dimensions.

- **IE compatibility**: Special handling for IE browser limitations with transforms and pseudo-elements (using :after elements for transform context).

- **Touch support**: Built-in touch event handling for mobile devices with preventDefault for scrolling control.

- **Callback timing**: Distinction between show/hide callbacks (when animation starts) and visible/hidden callbacks (when animation completes), enabling fine-grained state management.

- **jQuery integration**: This is the jQuery-based classic version. Interactive behaviors rely entirely on jQuery initialization via `.sidebar()` plugin.

- **Historical significance**: One of the pioneering off-canvas navigation implementations that popularized the "hamburger menu" sidebar pattern.

---

## Common Implementation Issues & Solutions

### Pusher Element Missing
**Issue**: Sidebar doesn't push content properly
**Solution**: Ensure all content is wrapped in a `.pusher` element and `.pushable` is on the context
```html
<body class="pushable">
  <div class="ui sidebar"></div>
  <div class="pusher"><!-- All content here --></div>
</body>
```

### Sidebar Not Detecting Direction
**Issue**: Sidebar appears but animations are incorrect
**Solution**: Use directional classes (left, right, top, bottom)
```html
<div class="ui left sidebar"><!-- left is required --></div>
```

### Multiple Sidebars Conflict
**Issue**: Toggling one sidebar doesn't affect the other
**Solution**: Use exclusive mode or manually manage state
```javascript
$('.ui.sidebar').sidebar({ exclusive: true });
```

### Mobile Animation Issues
**Issue**: Different animations on mobile than expected
**Solution**: Set explicit transition instead of 'auto'
```javascript
$('.ui.sidebar').sidebar({ transition: 'overlay' });
```

---

**Last Updated:** Complete comprehensive usage patterns documentation
**Maintenance**: Update this file when Semantic UI sidebar component is updated or when new patterns emerge

