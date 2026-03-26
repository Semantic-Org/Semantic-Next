# Classic Semantic UI Divider HTML Patterns

## Basic Patterns

### Standard Divider
```html
<div class="ui divider"></div>
```

### Horizontal Divider with Text
```html
<div class="ui horizontal divider">
  Or
</div>
```

### Horizontal Divider with Icon
```html
<div class="ui horizontal divider">
  <i class="tag icon"></i>
</div>
```

### Horizontal Divider with Header
```html
<div class="ui horizontal divider header">
  <i class="tag icon"></i>
  Description
</div>
```

### Vertical Divider
```html
<!-- Parent needs position: relative -->
<div class="ui vertical divider">
  And
</div>
```

## Variations

### Inverted Divider
```html
<div class="ui inverted divider"></div>
<div class="ui horizontal inverted divider">Text</div>
```

### Fitted Divider (no vertical margin)
```html
<div class="ui fitted divider"></div>
```

### Hidden Divider (spacing only)
```html
<div class="ui hidden divider"></div>
```

### Section Divider (extra margin)
```html
<div class="ui section divider"></div>
```

### Clearing Divider (clears floats)
```html
<div class="ui clearing divider"></div>
```

## Combination Examples

### Multiple Variations
```html
<!-- Inverted section divider -->
<div class="ui inverted section divider"></div>

<!-- Hidden fitted divider -->
<div class="ui hidden fitted divider"></div>

<!-- Horizontal inverted divider with icon -->
<div class="ui horizontal inverted divider">
  <i class="heart icon"></i>
</div>
```

## Usage in Context

### Between Segments
```html
<div class="ui segment">
  Content A
</div>
<div class="ui divider"></div>
<div class="ui segment">
  Content B
</div>
```

### In Forms
```html
<div class="ui form">
  <div class="field">...</div>
  <div class="ui horizontal divider">Or</div>
  <div class="field">...</div>
</div>
```

### With Grid (Vertical)
```html
<div class="ui two column middle aligned very relaxed stackable grid">
  <div class="column">
    Left content
  </div>
  <div class="ui vertical divider">
    Or
  </div>
  <div class="column">
    Right content
  </div>
</div>
```