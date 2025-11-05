# Semantic UI - Rating Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://semantic-ui.com/modules/rating.html
Status: ✅ Working
Version: 2.4+
Last Verified: 2025-11-05

## Documentation Quality
Good - Well-documented with clear examples, API methods, and configuration options. Includes interactive demonstrations and comprehensive settings reference.

## Component Definition
- **Core purpose**: Allows users to view or provide ratings for content, communicating interest level or quality assessment through interactive icon-based scoring
- **Mental model**: An interactive widget where users click on icons (stars, hearts, etc.) to select a rating value, with visual feedback showing current selection and hover states
- **Semantic meaning**: Indicates user interest, satisfaction level, or quality assessment of content through a familiar rating paradigm (e.g., 5-star rating system)

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `initialRating`, `maxRating`, `rating('set rating')` method)
- **Composed**: Via HTML structure with icon elements (e.g., `<div class="ui rating"><i class="icon"></i></div>`)
- **CSS-only**: Requires JavaScript initialization for interactive functionality

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Star symbols | ✅ | Native | Default star icon rating system |
| Custom icons | ✅ | Native | Heart icons via class modifier, customizable through CSS |
| Text labels | ❌ | CSS-only | Not built-in, would require custom HTML composition |
| Tooltips | ❌ | N/A | Not mentioned in documentation |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Read-only display | ✅ | Native | Disable via `disable` behavior or `interactive: false` setting |
| Interactive/Editable | ✅ | Native | Default state with click-to-rate functionality |
| Half-star support | ❌ | N/A | Not documented in classic version |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default/Unselected | ✅ | Native | Icons appear unfilled when rating is 0 |
| Hover state | ✅ | Native | Visual preview on hover before selection |
| Selected state | ✅ | Native | Active class applied to selected icons |
| Disabled | ✅ | Native | `disable` behavior makes component read-only |
| Focus state | ✅ | Native | Keyboard navigation support implied by module structure |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Multiple size classes: mini, tiny, small, large, huge, massive |
| Color options | ✅ | CSS-only | Customizable via CSS, semantic color scheme support |
| Count/Max value | ✅ | Native | Configurable via `maxRating` setting |
| Character customization | ✅ | Native | Star (default) and heart variations documented |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to rate | ✅ | Native | Primary interaction method, updates rating on click |
| Hover preview | ✅ | Native | Shows visual feedback on hover before selection |
| Clearable | ✅ | Native | `clearable` setting allows clicking current rating to reset to 0 |
| onChange callback | ✅ | Native | `onRate(value)` callback triggered after rating selection |

## Code Examples

### Basic Star Rating (Metadata Initialization)
```html
<div class="ui rating" data-rating="3" data-max-rating="5"></div>
```

```javascript
$('.ui.rating').rating();
```

### JavaScript Initialization with Settings
```html
<div class="ui rating"></div>
```

```javascript
$('.ui.rating').rating({
  initialRating: 3,
  maxRating: 5,
  onRate: function(value) {
    console.log('Rating selected:', value);
  }
});
```

### Heart Rating
```html
<div class="ui heart rating" data-rating="4" data-max-rating="5"></div>
```

```javascript
$('.ui.heart.rating').rating();
```

### Read-Only/Disabled Rating
```html
<div class="ui rating" data-rating="3" data-max-rating="5"></div>
```

```javascript
// Initialize then disable
$('.ui.rating')
  .rating({ initialRating: 3, maxRating: 5 })
  .rating('disable');

// Or use interactive setting
$('.ui.rating').rating({
  initialRating: 3,
  maxRating: 5,
  interactive: false
});
```

### Clearable Rating
```html
<div class="ui rating" data-rating="2" data-max-rating="5"></div>
```

```javascript
$('.ui.rating').rating({
  initialRating: 2,
  maxRating: 5,
  clearable: true
});

// Or dynamically enable clearable
$('.ui.rating')
  .rating({ initialRating: 2, maxRating: 5 })
  .rating('setting', 'clearable', true);
```

### Size Variations
```html
<!-- Mini rating -->
<div class="ui mini rating" data-rating="3" data-max-rating="5"></div>

<!-- Small rating -->
<div class="ui small rating" data-rating="3" data-max-rating="5"></div>

<!-- Default (medium) rating -->
<div class="ui rating" data-rating="3" data-max-rating="5"></div>

<!-- Large rating -->
<div class="ui large rating" data-rating="3" data-max-rating="5"></div>

<!-- Huge rating -->
<div class="ui huge rating" data-rating="3" data-max-rating="5"></div>

<!-- Massive rating -->
<div class="ui massive rating" data-rating="3" data-max-rating="5"></div>
```

```javascript
$('.ui.rating').rating();
```

### Programmatic Control
```html
<div class="ui rating" id="myRating"></div>
<button id="setRating">Set to 4 stars</button>
<button id="getRating">Get current rating</button>
<button id="clearRating">Clear rating</button>
<button id="enableRating">Enable</button>
<button id="disableRating">Disable</button>
```

```javascript
// Initialize rating
$('#myRating').rating({ maxRating: 5 });

// Set rating programmatically
$('#setRating').on('click', function() {
  $('#myRating').rating('set rating', 4);
});

// Get current rating
$('#getRating').on('click', function() {
  var currentRating = $('#myRating').rating('get rating');
  console.log('Current rating:', currentRating);
});

// Clear rating
$('#clearRating').on('click', function() {
  $('#myRating').rating('clear rating');
});

// Enable interactive mode
$('#enableRating').on('click', function() {
  $('#myRating').rating('enable');
});

// Disable interactive mode
$('#disableRating').on('click', function() {
  $('#myRating').rating('disable');
});
```

### Custom Max Rating (10-star system)
```html
<div class="ui rating" data-max-rating="10"></div>
```

```javascript
$('.ui.rating').rating({
  initialRating: 7,
  maxRating: 10
});
```

### With Callback Handler
```html
<div class="ui rating" id="productRating"></div>
<p>Selected rating: <span id="ratingDisplay">0</span></p>
```

```javascript
$('#productRating').rating({
  maxRating: 5,
  initialRating: 0,
  onRate: function(value) {
    $('#ratingDisplay').text(value);
    // Send to server, update UI, etc.
    console.log('User rated:', value);
  }
});
```

### Prevent Initial Callback (fireOnInit)
```html
<div class="ui rating"></div>
```

```javascript
$('.ui.rating').rating({
  initialRating: 3,
  maxRating: 5,
  fireOnInit: false, // Prevents onRate callback during initialization
  onRate: function(value) {
    console.log('User changed rating to:', value);
  }
});
```

[View Live Examples](https://semantic-ui.com/modules/rating.html)

## Notable Features

- **Dual initialization methods**: Supports both metadata attributes (`data-rating`, `data-max-rating`) and JavaScript settings object
- **Flexible icon systems**: Built-in support for star and heart icons with ability to customize via CSS
- **Clearable functionality**: Auto-detection mode or explicit setting allows users to reset ratings by clicking current selection
- **Comprehensive API**: Full set of behaviors (set, get, enable, disable, clear) for programmatic control
- **Visual hover feedback**: Real-time preview of rating selection before user commits
- **Callback system**: `onRate(value)` callback fires after rating change with optional `fireOnInit` control
- **Size flexibility**: Six built-in size variants from mini to massive
- **jQuery module pattern**: Follows Semantic UI's standard jQuery plugin architecture
- **State management**: Manages active, hover, and loading classes automatically
- **Namespace isolation**: Uses 'rating' namespace with `.icon` selector for consistent DOM structure

## Research Notes

- Documentation is clear and well-organized with examples and API reference
- Component is mature and stable (version 2.4+)
- jQuery-based initialization following Semantic UI module pattern (`.rating()` method)
- The component automatically generates icon elements based on `maxRating` setting
- Clearable mode uses "auto" detection by default but can be explicitly enabled/disabled
- Interactive state can be controlled both at initialization and dynamically via behaviors
- Half-star ratings are not supported in the classic version
- Custom icon types beyond star/heart would require CSS customization
- The module uses standard Semantic UI debugging and performance monitoring capabilities
- No circular or alternative layout patterns documented (linear horizontal display only)

