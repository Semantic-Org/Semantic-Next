# Semantic UI Classic - Progress Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://semantic-ui.com/modules/progress.html
Status: ✅ Working
Version: 2.4+
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-documented with clear examples, multiple variations, and detailed API information

## Component Definition
- **Core purpose**: Visually display the progression of a task or workflow, showing completion percentage and current state
- **Mental model**: A visual indicator that communicates task progress to users through animated bars, percentage values, and state indicators
- **Semantic meaning**: Provides transparent feedback about long-running operations and task completion status, reducing user uncertainty

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `data-percent`, `progress()` method with options)
- **Composed**: Via HTML markup with class combinations (e.g., `<div class="ui progress"><div class="bar"></div></div>`)
- **CSS-only**: Requires JavaScript initialization for full functionality (animations, state transitions)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Templated labels with `{percent}`, `{value}`, `{total}`, `{left}` variables |
| Icon support | ❌ | N/A | Not mentioned in documentation |
| Custom content | ✅ | Composed | Labels and descriptive text via HTML markup |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | Standard horizontal progress bar (primary type) |
| Circular | ❌ | N/A | Not supported in classic version |
| Dashboard/Arc | ❌ | N/A | Not supported in classic version |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Indeterminate | ✅ | Native | Active state without percent value shows continuous animation |
| Success state | ✅ | Native | `success` class indicates task completion with visual styling |
| Error state | ✅ | Native | `error` class signals failure with distinct styling |
| Active/animating | ✅ | Native | `active` class enables smooth animation and polling |
| Warning state | ✅ | Native | `warning` class alerts to potential issues |
| Disabled state | ✅ | Native | `disabled` class makes component non-interactive |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Tiny, Small, Standard, Large, Big via size classes |
| Color options | ✅ | Native | Multiple color schemes with inverted variants for dark backgrounds |
| Percentage display | ✅ | Native | Dynamic tracking via `percent` setting, customizable with templates |
| Segmented/steps | ✅ | Native | Support for stepped progress with multiple bars |
| Labeling | ✅ | Native | Templated labels with progress variables |
| Attached | ✅ | Native | Can attach to other elements via `attached` class |

## Code Examples

### Basic Progress Bar
```html
<div class="ui progress">
  <div class="bar"></div>
  <div class="label">Loading</div>
</div>
```

```javascript
$('#example').progress({ percent: 22 });
```

### Progress with Label Template
```html
<div class="ui progress" data-percent="60">
  <div class="bar"></div>
  <div class="label">{percent}% Complete</div>
</div>
```

### Active (Indeterminate) Progress
```html
<div class="ui active progress">
  <div class="bar"></div>
  <div class="label">Loading...</div>
</div>
```

### Success State Progress
```html
<div class="ui success progress" data-percent="100">
  <div class="bar" style="width: 100%"></div>
  <div class="label">Task Complete</div>
</div>
```

### Error State Progress
```html
<div class="ui error progress" data-percent="45">
  <div class="bar" style="width: 45%"></div>
  <div class="label">Error Occurred</div>
</div>
```

### Size Variations
```html
<!-- Small Progress -->
<div class="ui small progress" data-percent="33">
  <div class="bar"></div>
</div>

<!-- Large Progress -->
<div class="ui large progress" data-percent="67">
  <div class="bar"></div>
</div>

<!-- Big Progress -->
<div class="ui big progress" data-percent="90">
  <div class="bar"></div>
</div>
```

### Segmented Progress
```html
<div class="ui progress" data-percent="66">
  <div class="bar">
    <div class="progress"></div>
  </div>
</div>
```

### Attached Progress
```html
<div class="ui attached progress" data-percent="50">
  <div class="bar"></div>
</div>
<div class="ui attached segment">
  Content below progress bar
</div>
```

### JavaScript API Usage
```javascript
// Initialize with options
$('#progress').progress({ percent: 0 });

// Increment progress
$('#progress').progress('increment', 10);

// Set progress value
$('#progress').progress('set progress', 75);

// Set label
$('#progress').progress('set label', 'Processing...');

// Complete task
$('#progress').progress('complete');
```

[View Live Examples](https://semantic-ui.com/modules/progress.html) *(Available on official documentation)*

## Notable Features

- **Templated labels**: Uses special variables `{percent}`, `{value}`, `{total}`, `{left}` to automatically update progress text without JavaScript
- **Automatic polling**: Continues smooth animation even with frequent programmatic updates
- **State transitions**: Smooth visual transitions between active, success, error, and warning states
- **Responsive sizing**: Multiple built-in size classes adjust progress bar dimensions
- **Metadata initialization**: Can extract percent value from `data-percent` attribute
- **Color schemes**: Comprehensive color palette with semantic meaning (success=green, error=red, warning=yellow)
- **Inverted variants**: Dark background compatible colors for accessibility
- **Dynamic text variables**: Progress label automatically calculates and displays `{value}`, `{total}`, `{left}` without additional JavaScript

## Research Notes

- Documentation is well-structured with clear examples and API documentation
- Component is mature and stable (version 2.4+)
- jQuery-based initialization using `.progress()` method
- Component relies on CSS classes for states and variations rather than data attributes alone
- Label templating is particularly powerful for reducing JavaScript boilerplate
- No circular or arc-based progress variants in classic version - linear bars only
- Active state provides indeterminate progress animation for tasks of unknown duration
- The component is attachment-aware, allowing it to pair with other semantic elements
