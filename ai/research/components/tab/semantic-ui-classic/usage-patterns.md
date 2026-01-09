# Tab - Semantic UI Classic Usage Patterns

## Executive Summary

The Semantic UI Tab module provides a jQuery-based system for creating tabbed interfaces with hidden content sections. Tabs are activated through menu interactions and support advanced features including history management, remote content loading, and nested tab structures.

**Key Characteristics:**
- Menu-driven activation pattern
- jQuery initialization and API
- Data attribute-based path mapping
- History support with hash and HTML5 state options
- Built-in caching mechanism
- Nested tab support with configurable depth
- Event callbacks for lifecycle management
- Script evaluation control

---

## HTML Structure

### Basic Tab Structure

```html
<div class="ui top attached tabular menu">
  <a class="item active" data-tab="first">First Tab</a>
  <a class="item" data-tab="second">Second Tab</a>
  <a class="item" data-tab="third">Third Tab</a>
</div>

<div class="ui bottom attached segment">
  <div class="ui tab segment active" data-tab="first">
    Content for first tab
  </div>
  <div class="ui tab segment" data-tab="second">
    Content for second tab
  </div>
  <div class="ui tab segment" data-tab="third">
    Content for third tab
  </div>
</div>
```

### Nested Tab Structure

```html
<div class="ui tab">
  <div class="ui menu">
    <a class="item active" data-tab="parent/child1">Child 1</a>
    <a class="item" data-tab="parent/child2">Child 2</a>
  </div>
  <div class="ui segment active" data-tab="parent/child1">
    Nested content 1
  </div>
  <div class="ui segment" data-tab="parent/child2">
    Nested content 2
  </div>
</div>
```

---

## CSS Classes

### Core Tab Classes

| Class | Purpose | Applied To |
|-------|---------|-----------|
| `.ui.tab` | Identifies a tab container | Container element |
| `.active` | Makes tab visible | Tab and active menu item |
| `.loading` | Displays loading state | Tab during AJAX request |

### Related Classes for Tab Menus

| Class | Purpose | Notes |
|-------|---------|-------|
| `.ui.tabular.menu` | Styled menu for tabs | Often paired with `.top` or `.bottom` |
| `.top.attached` | Positions menu at top of content | Standard tab appearance |
| `.bottom.attached` | Positions menu at bottom | Alternative tab layout |
| `.segment` | Container for tab content | Typically paired with `.tab` |
| `.attached` | Eliminates border spacing | Groups menu and content visually |

### State Classes

| Class | State | Description |
|-------|-------|-------------|
| `.active` | Visible | Tab is currently displayed |
| `.loading` | Loading | Content is being fetched via AJAX |

---

## HTML Attributes

### Data Attributes for Tab Identification

| Attribute | Purpose | Example | Notes |
|-----------|---------|---------|-------|
| `data-tab` | Tab path identifier | `data-tab="first"` | Must match between menu item and content |
| `data-tab` (nested) | Hierarchical path | `data-tab="parent/child"` | Forward slashes separate hierarchy levels |

### Implementation Details

**Path Matching:**
- Paths are case-sensitive
- Menu items and content must have identical `data-tab` values
- Paths support forward slash hierarchy for nested tabs
- Path identifiers can be simple strings or dot-notation

**Example Path Variations:**
```html
<!-- Simple path -->
<a class="item" data-tab="overview">Overview</a>
<div class="tab" data-tab="overview">...</div>

<!-- Hierarchical path -->
<a class="item" data-tab="settings/advanced">Advanced Settings</a>
<div class="tab" data-tab="settings/advanced">...</div>

<!-- Nested path -->
<a class="item" data-tab="parent/child/grandchild">Deep Tab</a>
<div class="tab" data-tab="parent/child/grandchild">...</div>
```

---

## JavaScript Module API

### Initialization

#### Basic Initialization

```javascript
// Initialize all menu items to activate tabs
$('.menu .item').tab();
```

#### Context-Based Initialization

```javascript
// Limit tab activation to specific context
$('#context1 .menu .item').tab({ context: $('#context1') });

// Or with string selector
$('.menu .item').tab({ context: 'parent' });
```

#### With Configuration

```javascript
$('.menu .item').tab({
  auto: true,
  history: true,
  cache: true,
  context: '#tab-container',
  evaluateScripts: 'once'
});
```

---

### Configuration Settings

#### Essential Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `auto` | boolean | `false` | Auto-loads remote content matching URL hash |
| `history` | boolean | `false` | Records tab navigation in browser history |
| `cache` | boolean | `true` | Caches loaded tab content locally |
| `context` | selector/object | `false` | DOM element containing tabs; limits scope of activation |
| `historyType` | string | `'hash'` | History tracking method: `'hash'` or `'state'` |
| `evaluateScripts` | string | `'once'` | Script evaluation behavior: `'once'`, `'always'`, or `false` |
| `deactivate` | string | `'siblings'` | Deactivation scope: `'siblings'` (same menu), `'all'` (all activators) |

#### Advanced Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `maxDepth` | number | `25` | Maximum nesting depth for tabs |
| `path` | string | `false` | Base URL path for remote content |
| `onFirstLoad` | function | - | Callback for initial tab load |
| `onLoad` | function | - | Callback for any tab activation |
| `onRequest` | function | - | Callback when remote content begins loading |
| `onVisible` | function | - | Callback when tab becomes visible |
| `alwaysRefresh` | boolean | `false` | Always fetch remote content (ignore cache) |
| `loadOnce` | boolean | `false` | Load remote content only once |

---

### Methods

#### Changing Tabs Programmatically

```javascript
// Change to specific tab
$('.menu .item').tab('change tab', 'second');

// Get current active tab path
var activePath = $('.menu .item').tab('get path');

// Set tab state
$('.menu .item').tab('set state', 'third');
```

#### Content Caching

```javascript
// Read cached content
var content = $('.menu .item').tab('cache read', 'first');

// Cache behavior is automatic, but can be controlled via settings
```

#### Event Management

```javascript
// Attach events to specific selectors
$('.menu .item').tab('attach events', '.button', 'click');
```

---

## Event Callbacks

### Callback Functions

#### onFirstLoad
Triggered only on the initial activation of a tab.

```javascript
$('.menu .item').tab({
  onFirstLoad: function(tabPath, parameterArray, historyEvent) {
    console.log('First load for tab:', tabPath);
    console.log('Parameters:', parameterArray);
  }
});
```

**Parameters:**
- `tabPath` (string) - The path identifier of the loaded tab
- `parameterArray` (array) - URL parameters if using remote content
- `historyEvent` (object) - History event details if history is enabled

#### onLoad
Triggered every time a tab is activated.

```javascript
$('.menu .item').tab({
  onLoad: function(tabPath, parameterArray, historyEvent) {
    console.log('Tab loaded:', tabPath);
    // Initialize plugins for newly loaded content
    $(this).find('[data-tooltip]').popup();
  }
});
```

**Parameters:**
- `tabPath` (string) - The path identifier of the activated tab
- `parameterArray` (array) - URL parameters if using remote content
- `historyEvent` (object) - History event details if history is enabled

#### onRequest
Triggered when remote content begins loading.

```javascript
$('.menu .item').tab({
  onRequest: function(tabPath) {
    console.log('Requesting content for:', tabPath);
    // Show loading indicator
    $('.tab').addClass('loading');
  }
});
```

**Parameters:**
- `tabPath` (string) - The path being requested

#### onVisible
Triggered when a tab becomes visible in the DOM.

```javascript
$('.menu .item').tab({
  onVisible: function(tabPath) {
    console.log('Tab is now visible:', tabPath);
    // Perform visibility-dependent operations
    $('canvas').redraw();
  }
});
```

**Parameters:**
- `tabPath` (string) - The path of the now-visible tab

---

## Implementation Patterns

### Pattern 1: Simple Static Tabs

```html
<div class="ui top attached tabular menu">
  <a class="item active" data-tab="home">Home</a>
  <a class="item" data-tab="about">About</a>
  <a class="item" data-tab="contact">Contact</a>
</div>

<div class="ui bottom attached segment">
  <div class="ui tab segment active" data-tab="home">
    <h3>Home</h3>
    <p>Welcome to our site</p>
  </div>
  <div class="ui tab segment" data-tab="about">
    <h3>About</h3>
    <p>Learn about us</p>
  </div>
  <div class="ui tab segment" data-tab="contact">
    <h3>Contact</h3>
    <p>Get in touch</p>
  </div>
</div>

<script>
  $('.menu .item').tab();
</script>
```

### Pattern 2: Multiple Independent Tab Groups

```html
<!-- Group 1 -->
<div id="group1">
  <div class="ui menu">
    <a class="item active" data-tab="g1-tab1">Tab 1</a>
    <a class="item" data-tab="g1-tab2">Tab 2</a>
  </div>
  <div class="ui tab segment active" data-tab="g1-tab1">Content 1</div>
  <div class="ui tab segment" data-tab="g1-tab2">Content 2</div>
</div>

<!-- Group 2 -->
<div id="group2">
  <div class="ui menu">
    <a class="item active" data-tab="g2-tab1">Tab A</a>
    <a class="item" data-tab="g2-tab2">Tab B</a>
  </div>
  <div class="ui tab segment active" data-tab="g2-tab1">Content A</div>
  <div class="ui tab segment" data-tab="g2-tab2">Content B</div>
</div>

<script>
  // Initialize each group separately with context
  $('#group1 .menu .item').tab({ context: '#group1' });
  $('#group2 .menu .item').tab({ context: '#group2' });
</script>
```

### Pattern 3: Tabs with Remote Content

```html
<div class="ui top attached tabular menu">
  <a class="item active" data-tab="overview">Overview</a>
  <a class="item" data-tab="details">Details</a>
  <a class="item" data-tab="settings">Settings</a>
</div>

<div class="ui bottom attached segment">
  <div class="ui tab segment active" data-tab="overview"></div>
  <div class="ui tab segment" data-tab="details"></div>
  <div class="ui tab segment" data-tab="settings"></div>
</div>

<script>
  $('.menu .item').tab({
    auto: true,
    cache: true,
    path: '/content/'  // Base path for AJAX requests
  });
</script>
```

With this setup, clicking "Details" tab will load `/content/details.html`.

### Pattern 4: Tabs with History Support

```javascript
$('.menu .item').tab({
  history: true,
  historyType: 'hash',  // or 'state' for HTML5 history
  onLoad: function(tabPath) {
    console.log('Navigated to:', tabPath);
  }
});
```

**URL Behavior:**
- Hash mode: `example.com#first`, `example.com#second`
- State mode: Requires server-side routing setup

### Pattern 5: Nested Tabs

```html
<div class="ui top attached tabular menu">
  <a class="item active" data-tab="settings/general">General</a>
  <a class="item" data-tab="settings/advanced">Advanced</a>
</div>

<div class="ui bottom attached segment">
  <div class="ui tab segment active" data-tab="settings/general">
    <h3>General Settings</h3>
  </div>
  <div class="ui tab segment" data-tab="settings/advanced">
    <h3>Advanced Settings</h3>
  </div>
</div>

<script>
  $('.menu .item').tab({
    maxDepth: 25,  // Support nested tabs
    cache: true
  });
</script>
```

### Pattern 6: Programmatic Tab Control

```javascript
// Initialize tabs
$('.menu .item').tab();

// Programmatically change tabs
$('#open-details-btn').on('click', function() {
  $('.menu .item').tab('change tab', 'details');
});

// Get current tab
$('#check-current-btn').on('click', function() {
  var current = $('.menu .item').tab('get path');
  console.log('Current tab:', current);
});

// Respond to tab changes
$('.menu .item').tab({
  onLoad: function(tabPath) {
    console.log('User navigated to:', tabPath);
    // Update external state, analytics, etc.
  }
});
```

### Pattern 7: Dynamic Content with Script Evaluation

```javascript
$('.menu .item').tab({
  auto: true,
  path: '/tabs/',
  evaluateScripts: 'once',  // Evaluate inline scripts on first load
  onLoad: function(tabPath) {
    // Initialize plugins for dynamically loaded content
    $(this).find('[data-popup]').popup();
    $(this).find('[data-tooltip]').tooltip();
  }
});
```

### Pattern 8: Tabs with Loading Indicator

```javascript
$('.menu .item').tab({
  auto: true,
  path: '/content/',
  onRequest: function(tabPath) {
    // Show loading state
    $('[data-tab="' + tabPath + '"]').addClass('loading');
  },
  onLoad: function(tabPath) {
    // Hide loading state
    $('[data-tab="' + tabPath + '"]').removeClass('loading');
  }
});
```

---

## Advanced Features

### History Management

**Hash-Based History (Default):**
```javascript
$('.menu .item').tab({
  history: true,
  historyType: 'hash'
});

// URL examples:
// example.com#overview
// example.com#details
// example.com#settings
```

**HTML5 State-Based History:**
```javascript
$('.menu .item').tab({
  history: true,
  historyType: 'state'
});

// Requires server-side routing:
// Routes like /overview, /details, /settings
// Server should serve same HTML for all routes
```

### Caching Mechanism

The Tab module automatically caches loaded content:

```javascript
$('.menu .item').tab({
  cache: true,  // Enable caching (default)
  alwaysRefresh: false  // Don't fetch if cached
});

// Manual cache access
var cachedContent = $('.menu .item').tab('cache read', 'details');
```

**Cache Behavior:**
- When `cache: true`, loaded content is stored in memory
- Subsequent clicks on same tab use cached content (no AJAX request)
- Caching happens per tab path
- Cache persists for the session only

### Script Evaluation Control

Control how inline scripts in remote content are handled:

```javascript
// Evaluate scripts only on first load
$('.menu .item').tab({
  evaluateScripts: 'once',
  auto: true,
  path: '/content/'
});

// Always evaluate scripts (even cached content)
$('.menu .item').tab({
  evaluateScripts: 'always'
});

// Never evaluate scripts
$('.menu .item').tab({
  evaluateScripts: false
});
```

### Nested Tab Support

Tabs can be nested multiple levels deep:

```html
<div class="ui menu">
  <a class="item active" data-tab="section1/subsection1">
    Section 1.1
  </a>
  <a class="item" data-tab="section1/subsection2">
    Section 1.2
  </a>
</div>

<div class="tab active" data-tab="section1/subsection1">
  <div class="ui menu">
    <a class="item active" data-tab="section1/subsection1/detail1">
      Detail 1
    </a>
    <a class="item" data-tab="section1/subsection1/detail2">
      Detail 2
    </a>
  </div>

  <div class="tab active" data-tab="section1/subsection1/detail1">
    Deep nested content
  </div>
</div>
```

Configuration for nested tabs:
```javascript
$('.menu .item').tab({
  maxDepth: 25,  // Maximum nesting level (default)
  cache: true
});
```

### Deactivation Scope

Control how other tabs deactivate when one is activated:

```javascript
// Deactivate only sibling tabs (default)
$('.menu .item').tab({
  deactivate: 'siblings'
});

// Deactivate all tabs on the page
$('.menu .item').tab({
  deactivate: 'all'
});
```

---

## State Management

### Active Tab State

**Visual State:**
```html
<!-- Active tab has .active class -->
<div class="ui tab segment active" data-tab="first">
  This tab is visible
</div>

<!-- Inactive tab doesn't have .active class -->
<div class="ui tab segment" data-tab="second">
  This tab is hidden
</div>

<!-- Active menu item also has .active class -->
<a class="item active" data-tab="first">First</a>
```

**Programmatic State:**
```javascript
// Check if tab is active
var isActive = $('[data-tab="first"]').hasClass('active');

// Manually add active class (not recommended)
$('[data-tab="first"]').addClass('active');

// Use tab method instead
$('.menu .item').tab('change tab', 'first');
```

### Loading State

```html
<!-- Tab shows loading indicator -->
<div class="ui tab segment loading" data-tab="first">
  <div class="ui active centered inline loader"></div>
  <p>Loading content...</p>
</div>
```

The `.loading` class is automatically applied during AJAX requests when `auto: true`.

---

## Common Integration Patterns

### Pattern: Initialize on Page Load

```javascript
$(document).ready(function() {
  $('.menu .item').tab();
});
```

### Pattern: Conditional Tab Activation

```javascript
// Only activate specific tabs
$('.menu .item').not('.disabled').tab();

// Or with custom selector
$('#main-menu .item').tab();
```

### Pattern: Dynamic Tab Switching Based on Data

```javascript
$('[data-action="open-tab"]').on('click', function() {
  var tabName = $(this).data('tab');
  $('.menu .item').tab('change tab', tabName);
});
```

### Pattern: Tab Navigation with Parameters

```javascript
// Useful for tracking or analytics
$('.menu .item').tab({
  onLoad: function(tabPath, parameterArray) {
    // Log navigation
    console.log('Tab path:', tabPath);
    console.log('Parameters:', parameterArray);

    // Send to analytics
    gtag('event', 'tab_change', {
      tab_name: tabPath
    });
  }
});
```

### Pattern: Content Initialization on Tab Load

```javascript
$('.menu .item').tab({
  onLoad: function(tabPath) {
    // Initialize plugins for newly loaded content
    var $tab = $('[data-tab="' + tabPath + '"]');

    // Initialize dropdowns
    $tab.find('.ui.dropdown').dropdown();

    // Initialize modals
    $tab.find('.ui.modal').modal();

    // Initialize tooltips
    $tab.find('[data-tooltip]').tooltip();
  }
});
```

---

## Browser Compatibility Considerations

### History API Support

- `historyType: 'hash'` - Works in all browsers
- `historyType: 'state'` - Requires HTML5 History API (IE 10+)

### AJAX Support

- Remote content loading requires `jQuery.ajax()` support
- CORS restrictions apply for cross-domain requests
- Server should set appropriate cache headers for optimal performance

---

## Performance Considerations

### Caching
- Default caching improves performance for frequently accessed tabs
- Disable caching with `cache: false` if content changes frequently
- Use `alwaysRefresh: true` to bypass cache

### Lazy Loading
- Remote content only loads when tab is activated
- Large tab sets benefit from lazy loading strategy
- Combine with caching for balanced performance

### Script Evaluation
- `evaluateScripts: 'once'` preferred for performance
- Avoid `evaluateScripts: 'always'` unless necessary
- Consider using event delegation instead of inline scripts

---

## Known Limitations

1. **Path Sensitivity**: Tab paths are case-sensitive
2. **Scope Isolation**: Context parameter required for multiple independent tab groups
3. **History Conflicts**: HTML5 state history requires server-side routing setup
4. **Deep Nesting**: Deeply nested tabs may impact performance
5. **Content Isolation**: No built-in content isolation between tabs
6. **Memory Management**: Cached content persists in memory for session duration
7. **Script Safety**: Evaluating scripts from untrusted sources is a security risk

---

## Research Metadata

**Component:** Tab (Tabbed Interface)

**Framework:** Semantic UI Classic

**Documentation Source:** https://semantic-ui.com/modules/tab.html

**Implementation Type:** jQuery Plugin Module

**Key Dependencies:**
- jQuery
- Semantic UI CSS
- Optional: Server endpoints for remote content

**Version Compatibility:** Semantic UI v1.0+

**Usage Pattern Category:** Content Organization / Navigation

---

## Key Takeaways

### Must-Have Features
1. ✅ Menu-driven activation (click to switch)
2. ✅ Data attribute-based path mapping
3. ✅ `.active` class for visibility
4. ✅ Context scoping for multiple tab groups
5. ✅ Basic caching mechanism

### Should-Have Features
1. 🔶 History tracking (hash or state-based)
2. 🔶 Remote content loading (AJAX)
3. 🔶 Event callbacks (onLoad, onRequest, onVisible)
4. 🔶 Script evaluation control
5. 🔶 Nested tab support

### Advanced Features
1. ⭐ Loading indicators
2. ⭐ Cache control
3. ⭐ Deactivation scope management
4. ⭐ Dynamic tab switching
5. ⭐ Content initialization hooks

### Design Considerations for Modern Implementation
1. Consider replacing jQuery with vanilla JavaScript or web components
2. Evaluate accessibility (keyboard navigation, ARIA attributes)
3. Consider responsive design for mobile
4. Plan for URL state management (modern routing libraries)
5. Consider content security for remote loading
6. Plan for TypeScript support for better DX
7. Consider performance implications of large numbers of tabs

---

**Last Updated:** 2025-11-05

**Report Status:** Complete - Comprehensive documentation of Semantic UI Classic Tab module patterns and implementation
