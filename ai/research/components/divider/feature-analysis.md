# Divider Component Feature Analysis

## Types Found in Classic Semantic UI

### 1. Standard Divider
- **Description**: Basic horizontal line separator
- **Classic HTML**: `<div class="ui divider"></div>`
- **Purpose**: Simple content separation

### 2. Horizontal Divider (with text/icon)
- **Description**: Divider with centered content
- **Classic HTML**: `<div class="ui horizontal divider">Or</div>`
- **With Icon**: `<div class="ui horizontal divider"><i class="tag icon"></i></div>`
- **Purpose**: Labeled separation, often for "Or" between options
- **Implementation**: Uses `display: table` with pseudo-elements for lines

### 3. Vertical Divider
- **Description**: Vertical content separator
- **Classic HTML**: `<div class="ui vertical divider">And</div>`
- **Constraints**:
  - Only supports 50/50 splits automatically
  - Requires `position: relative` on parent
  - Issues with flex container parents
  - Auto-converts to horizontal on mobile
- **Purpose**: Split content side-by-side

## Variations Found

### Visual Variations

1. **Inverted**
   - **Description**: Reversed colors for dark backgrounds
   - **Classic HTML**: `<div class="ui inverted divider"></div>`

2. **Fitted**
   - **Description**: No vertical margins
   - **Classic HTML**: `<div class="ui fitted divider"></div>`

3. **Hidden**
   - **Description**: Invisible spacing (margin only, no line)
   - **Classic HTML**: `<div class="ui hidden divider"></div>`

4. **Section**
   - **Description**: Larger margins for section breaks
   - **Classic HTML**: `<div class="ui section divider"></div>`

5. **Clearing**
   - **Description**: Clears floats
   - **Classic HTML**: `<div class="ui clearing divider"></div>`

## Content Patterns

1. **Text Content**
   - Centered text in horizontal dividers
   - Example: "Or", "And"

2. **Icon Content**
   - Icons as divider decoration
   - Uses `<i class="[name] icon"></i>`

3. **Header Integration**
   - Can be combined with headers for section titles
   - Example: `<div class="ui horizontal divider header">`

## States
- None identified (dividers are purely visual/structural)

## Special Behaviors

1. **Responsive**:
   - Vertical dividers convert to horizontal on mobile
   - Works with stackable grids

2. **Grid Integration**:
   - Special handling for `divided grid` variations
   - Column dividers

3. **Text Sizing**:
   - Horizontal dividers auto-adjust line length to text

## Potential Modernization Opportunities

1. **Slots for Content**:
   - `<slot name="content">` for text/icon content
   - More flexible than text nodes

2. **CSS Grid/Flexbox**:
   - Replace table layout for horizontal dividers
   - Better vertical divider implementation

3. **CSS Custom Properties**:
   - Dynamic color theming
   - Responsive spacing scales

4. **Container Queries**:
   - Better responsive behavior than media queries

5. **Simplified Vertical**:
   - Could be a separate component or removed (problematic in classic)