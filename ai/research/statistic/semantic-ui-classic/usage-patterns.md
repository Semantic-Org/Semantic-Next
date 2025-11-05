# Semantic UI Classic - Statistic Usage Patterns

## Component URL
https://semantic-ui.com/views/statistic.html
Status: ✅ Working
Version: Semantic UI 2.x
Last Verified: 2025-11-04

## Documentation Quality
**Comprehensive** - Complete documentation with multiple variations and detailed examples

## Component Definition
- **Core purpose**: Emphasizes the current value of an attribute, displaying quantitative or qualitative measurements with contextual labels
- **Mental model**: A data visualization primitive that pairs values with descriptive labels to create emphasis and draw attention to important metrics
- **Semantic meaning**: Highlights key metrics, measurements, counts, or status information that requires prominence in the interface

## Unique Characteristic
Semantic UI Classic's Statistic is distinctive because it **treats statistics as a view component** rather than just a data display element. It emphasizes presentation flexibility with extensive layout options (vertical/horizontal), supports rich content types (text, icons, images), and provides sophisticated grouping mechanisms for dashboard-style metric displays.

## Pattern Support Levels
- **Native**: Dedicated class-based API (e.g., `class="ui statistic"`, `class="ui statistics"`)
- **Composed**: Via HTML structure and nesting (value/label ordering, icons, images)
- **CSS-only**: All styling through class modifiers

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric values | ✅ | Native | Default value display: `<div class="value">5,550</div>` |
| Text values | ✅ | Native | Text-based values: `<div class="text value">Three Thousand</div>` |
| Icon values | ✅ | Composed | Icons within values: `<i class="plane icon"></i> 5` |
| Image values | ✅ | Composed | Images + values: `<img class="ui circular inline image"> 42` |
| Labels | ✅ | Native | Contextual labels: `<div class="label">Downloads</div>` |
| Label positioning | ✅ | Native | Label above or below value via source order |
| Mixed content | ✅ | Composed | Combining text, icons, images in single statistic |

## Type Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic statistic | ✅ | Native | Single stat: `<div class="ui statistic">` |
| Statistic group | ✅ | Native | Multiple stats: `<div class="ui statistics">` |
| Horizontal statistic | ✅ | Native | Side-by-side layout: `class="ui horizontal statistic"` |
| Horizontal group | ✅ | Native | Horizontal group layout: `class="ui horizontal statistics"` |

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active/selected | ❌ | Not documented | No native active state |
| Disabled | ❌ | Not documented | No native disabled state |
| Loading | ❌ | Not documented | No native loading state |

## Variation Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | 6 sizes: `mini`, `tiny`, `small`, (default), `large`, `huge` |
| Color options | ✅ | Native | 12 colors: `red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey` |
| Inverted style | ✅ | Native | Dark background mode: `class="ui inverted statistic"` |
| Floated | ✅ | Native | Text wrapping: `class="ui left floated statistic"`, `class="ui right floated statistic"` |
| Semantic colors | ✅ | Implicit | Color names have semantic associations (red=negative, green=positive, etc.) |

## Group Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic groups | ✅ | Native | `<div class="ui statistics">` - automatic grid layout |
| Evenly divided | ✅ | Native | Equal width distribution: `class="ui four statistics"` (one through ten) |
| Horizontal groups | ✅ | Native | Horizontal layout group: `class="ui horizontal statistics"` |
| Colored groups | ✅ | Native | Group-level colors apply to all children |

## Code Examples

### Basic Statistic
```html
<!-- Label below value (most common) -->
<div class="ui statistic">
  <div class="value">
    5,550
  </div>
  <div class="label">
    Downloads
  </div>
</div>

<!-- Label above value -->
<div class="ui statistic">
  <div class="label">
    Views
  </div>
  <div class="value">
    40,509
  </div>
</div>
```

### Statistic Group
```html
<!-- Basic group - auto grid layout -->
<div class="ui statistics">
  <div class="statistic">
    <div class="value">
      22
    </div>
    <div class="label">
      Faves
    </div>
  </div>
  <div class="statistic">
    <div class="value">
      31,200
    </div>
    <div class="label">
      Views
    </div>
  </div>
  <div class="statistic">
    <div class="value">
      22
    </div>
    <div class="label">
      Members
    </div>
  </div>
</div>
```

### Value Variations
```html
<!-- Multiple value types in a group -->
<div class="ui statistics">
  <!-- Numeric value -->
  <div class="statistic">
    <div class="value">
      22
    </div>
    <div class="label">
      Saves
    </div>
  </div>

  <!-- Text value (use 'text' class) -->
  <div class="statistic">
    <div class="text value">
      Three<br>
      Thousand
    </div>
    <div class="label">
      Signups
    </div>
  </div>

  <!-- Icon value -->
  <div class="statistic">
    <div class="value">
      <i class="plane icon"></i> 5
    </div>
    <div class="label">
      Flights
    </div>
  </div>

  <!-- Image value -->
  <div class="statistic">
    <div class="value">
      <img src="/images/avatar/small/joe.jpg" class="ui circular inline image">
      42
    </div>
    <div class="label">
      Team Members
    </div>
  </div>
</div>
```

### Label Content
```html
<!-- Simple text label -->
<div class="ui statistic">
  <div class="value">
    2,204
  </div>
  <div class="label">
    Views
  </div>
</div>
```

### Horizontal Statistic
```html
<!-- Single horizontal statistic -->
<div class="ui horizontal statistic">
  <div class="value">
    2,204
  </div>
  <div class="label">
    Views
  </div>
</div>

<!-- Horizontal statistic group -->
<div class="ui horizontal statistics">
  <div class="statistic">
    <div class="value">
      2,204
    </div>
    <div class="label">
      Views
    </div>
  </div>
  <div class="statistic">
    <div class="value">
      3,322
    </div>
    <div class="label">
      Downloads
    </div>
  </div>
  <div class="statistic">
    <div class="value">
      22
    </div>
    <div class="label">
      Tasks
    </div>
  </div>
</div>
```

### Color Variations
```html
<!-- All 12 color options -->
<div class="ui statistics">
  <div class="red statistic">
    <div class="value">27</div>
    <div class="label">Red</div>
  </div>
  <div class="orange statistic">
    <div class="value">8</div>
    <div class="label">Orange</div>
  </div>
  <div class="yellow statistic">
    <div class="value">28</div>
    <div class="label">Yellow</div>
  </div>
  <div class="olive statistic">
    <div class="value">7</div>
    <div class="label">Olive</div>
  </div>
  <div class="green statistic">
    <div class="value">14</div>
    <div class="label">Green</div>
  </div>
  <div class="teal statistic">
    <div class="value">82</div>
    <div class="label">Teal</div>
  </div>
  <div class="blue statistic">
    <div class="value">1</div>
    <div class="label">Blue</div>
  </div>
  <div class="violet statistic">
    <div class="value">22</div>
    <div class="label">Violet</div>
  </div>
  <div class="purple statistic">
    <div class="value">23</div>
    <div class="label">Purple</div>
  </div>
  <div class="pink statistic">
    <div class="value">15</div>
    <div class="label">Pink</div>
  </div>
  <div class="brown statistic">
    <div class="value">36</div>
    <div class="label">Brown</div>
  </div>
  <div class="grey statistic">
    <div class="value">49</div>
    <div class="label">Grey</div>
  </div>
</div>
```

### Inverted Style
```html
<!-- For dark backgrounds -->
<div class="ui inverted segment">
  <!-- Basic inverted -->
  <div class="ui inverted statistic">
    <div class="value">54</div>
    <div class="label">Inverted</div>
  </div>

  <!-- Colored inverted -->
  <div class="ui red inverted statistic">
    <div class="value">27</div>
    <div class="label">Red</div>
  </div>
  <div class="ui orange inverted statistic">
    <div class="value">8</div>
    <div class="label">Orange</div>
  </div>
  <div class="ui yellow inverted statistic">
    <div class="value">28</div>
    <div class="label">Yellow</div>
  </div>
  <div class="ui olive inverted statistic">
    <div class="value">7</div>
    <div class="label">Olive</div>
  </div>
  <div class="ui green inverted statistic">
    <div class="value">14</div>
    <div class="label">Green</div>
  </div>
  <div class="ui teal inverted statistic">
    <div class="value">82</div>
    <div class="label">Teal</div>
  </div>
  <div class="ui blue inverted statistic">
    <div class="value">1</div>
    <div class="label">Blue</div>
  </div>
  <div class="ui violet inverted statistic">
    <div class="value">22</div>
    <div class="label">Violet</div>
  </div>
  <div class="ui purple inverted statistic">
    <div class="value">23</div>
    <div class="label">Purple</div>
  </div>
  <div class="ui pink inverted statistic">
    <div class="value">15</div>
    <div class="label">Pink</div>
  </div>
  <div class="ui brown inverted statistic">
    <div class="value">36</div>
    <div class="label">Brown</div>
  </div>
  <div class="ui grey inverted statistic">
    <div class="value">49</div>
    <div class="label">Grey</div>
  </div>
</div>
```

### Evenly Divided Groups
```html
<!-- Use word numbers: one, two, three, four, five, six, seven, eight, nine, ten -->

<!-- Four column layout -->
<div class="ui four statistics">
  <div class="statistic">
    <div class="value">22</div>
    <div class="label">Saves</div>
  </div>
  <div class="statistic">
    <div class="text value">Three<br>Thousand</div>
    <div class="label">Signups</div>
  </div>
  <div class="statistic">
    <div class="value"><i class="plane icon"></i> 5</div>
    <div class="label">Flights</div>
  </div>
  <div class="statistic">
    <div class="value">
      <img src="/images/avatar/small/joe.jpg" class="ui circular inline image">
      42
    </div>
    <div class="label">Team Members</div>
  </div>
</div>
```

### Floated Statistics
```html
<!-- Float within content -->
<div class="ui segment">
  <!-- Right floated -->
  <div class="ui right floated statistic">
    <div class="value">2,204</div>
    <div class="label">Views</div>
  </div>
  <p>Te eum doming eirmod, nominati pertinacia argumentum ad his...</p>

  <!-- Left floated -->
  <div class="ui left floated statistic">
    <div class="value">2,204</div>
    <div class="label">Views</div>
  </div>
  <p>Eu quo homero blandit intellegebat...</p>
</div>
```

### Size Variations
```html
<!-- 6 size options -->

<!-- Mini -->
<div class="ui mini statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<!-- Tiny -->
<div class="ui tiny statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<!-- Small -->
<div class="ui small statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<!-- Default (no size class) -->
<div class="ui statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<!-- Large -->
<div class="ui large statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<!-- Huge -->
<div class="ui huge statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>
```

### Horizontal Sizes
```html
<!-- Horizontal statistics also support all sizes -->
<div class="ui mini horizontal statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<div class="ui tiny horizontal statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<div class="ui small horizontal statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<div class="ui horizontal statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<div class="ui large horizontal statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<div class="ui huge horizontal statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>
```

## Notable Features

1. **Value/Label Flexibility**: Labels can be positioned above or below values simply by changing source order - no special classes needed

2. **Rich Value Types**: Support for four distinct value types:
   - **Numeric**: Plain numbers with automatic formatting
   - **Text**: Multi-line text values with `text` class
   - **Icon**: Icons integrated directly in value
   - **Image**: Avatar/image + number combinations

3. **Horizontal Layout Option**: Statistics can be displayed horizontally (side-by-side) rather than vertically stacked, providing layout flexibility for different contexts

4. **Automatic Grid Layout**: Statistic groups automatically arrange in a responsive grid without manual configuration

5. **Evenly Divided Groups**: Semantic width control using word numbers (`one` through `ten`) for equal-width column layouts

6. **Floating Capability**: Statistics can float within content, allowing text to wrap around them for integrated layouts

7. **Comprehensive Color System**: 12 color options with semantic meaning (green=positive metrics, red=negative metrics, blue=neutral info, etc.)

8. **Inverted Mode**: Full support for dark backgrounds with inverted color scheme and all color variations

9. **Class-Based API**: Pure CSS class composition - no JavaScript required for any visual variation

10. **Flexible Content Structure**: Values can contain mixed content (text + icons, images + numbers) without special markup

11. **Size Consistency**: All 6 sizes work with both vertical and horizontal orientations

12. **Group Coordination**: Size, color, and orientation can be applied at the group level to affect all child statistics

## Technical Details

### DOM Structure
```
.ui.statistic(s)           ← Container (singular or plural)
  .statistic               ← Individual stat (only in groups)
    .value                 ← Required: The main number/content
      (.text)              ← Optional: Modifier for text values
    .label                 ← Required: Descriptive label
```

### Class Composition Pattern
```html
<!-- Base class -->
.ui.statistic

<!-- Modifiers combine naturally -->
.ui.horizontal.statistic
.ui.red.statistic
.ui.mini.statistic
.ui.inverted.statistic
.ui.red.inverted.statistic
.ui.horizontal.red.statistic
.ui.large.horizontal.red.inverted.statistic

<!-- Groups use plural -->
.ui.statistics
.ui.horizontal.statistics
.ui.four.statistics
```

### Value Type Modifiers
- **Numeric**: No modifier needed (default)
- **Text**: Add `text` class to value: `<div class="text value">`
- **Icon**: Include `<i>` element inside value
- **Image**: Include `<img>` with `.ui.circular.inline.image` inside value

### Evenly Divided Options
Valid values: `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`, `ten`

### Color Options (12 total)
`red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey`

### Size Options (6 total)
`mini`, `tiny`, `small`, (default), `large`, `huge`

### Layout Modifiers
- **horizontal**: Side-by-side value/label layout
- **left floated**: Float left with text wrapping
- **right floated**: Float right with text wrapping

### Style Modifiers
- **inverted**: Light text on dark background
- **[color]**: Apply semantic color
- **[color] inverted**: Colored inverted version

## Research Notes

- **Presentation-focused component**: Unlike pure data display, statistics emphasize visual prominence and attention-drawing
- **View-level component**: Classified as a "view" rather than "element" in Semantic UI taxonomy, indicating higher-level composition
- **No JavaScript required**: Entirely CSS-based with no behavioral requirements
- **Semantic color usage**: Colors have implicit meaning (green=positive, red=negative) for dashboard metrics
- **Label positioning via source order**: Simple and elegant - just change HTML order to flip label position
- **Responsive by default**: Groups automatically reflow on smaller screens
- **Content flexibility**: Unusually flexible value content support (text, icons, images) compared to typical statistic components
- **Float integration**: Floating capability shows integration with document flow for mixed content layouts
- **Horizontal mode**: Provides alternative orientation for inline metrics or compact displays
- **Accessibility considerations**: Relies on visual hierarchy; screen readers would need proper semantic markup or ARIA labels

## API Implications for Implementation

### Core API Structure
```typescript
// Value/label are the fundamental units
interface StatisticProps {
  value: string | number | ReactNode;  // Support rich content
  label: string | ReactNode;            // Support rich labels

  // Layout options
  orientation?: 'vertical' | 'horizontal';
  labelPosition?: 'above' | 'below';   // Or handle via slot order

  // Visual variations
  size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'huge';
  color?: 'red' | 'orange' | 'yellow' | 'olive' | 'green' | 'teal' |
          'blue' | 'violet' | 'purple' | 'pink' | 'brown' | 'grey';
  inverted?: boolean;

  // Layout modifiers
  floated?: 'left' | 'right';

  // Content type hints
  valueType?: 'numeric' | 'text' | 'icon' | 'image';
}

interface StatisticGroupProps {
  // Group-level styling
  orientation?: 'vertical' | 'horizontal';
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;  // Evenly divided

  // Can apply size/color at group level
  size?: StatisticProps['size'];
  color?: StatisticProps['color'];
  inverted?: boolean;

  children: Statistic[];  // Array of statistics
}
```

### Component Relationships
```
StatisticGroup (statistics)
  ├── Statistic (statistic) ×N
  │     ├── Value (value)
  │     │     ├── Text content
  │     │     ├── Icon (optional)
  │     │     └── Image (optional)
  │     └── Label (label)
```

### Key Implementation Considerations

1. **Slot-based label positioning**: Use slot ordering to determine label above/below rather than a prop
2. **Rich content support**: Value and label should accept any renderable content
3. **Group-level inheritance**: Group size/color should cascade to children unless overridden
4. **Responsive grid**: Group layout should automatically reflow based on screen size
5. **Evenly divided**: Column count prop creates equal-width grid layout
6. **Text value detection**: May need automatic detection or explicit prop for text-based values
7. **Float behavior**: Floated statistics need proper float clearing in surrounding context
8. **Horizontal spacing**: Horizontal groups need appropriate gap/spacing between items
9. **Color semantics**: Consider providing semantic color names (success, error, warning, info) in addition to color names
10. **Accessibility**: Ensure proper semantic structure for screen readers (potentially using figure/figcaption)

### Design System Integration Points

1. **Typography scale**: Value and label sizes should align with design system type scale
2. **Color tokens**: Map color names to design system color palette
3. **Spacing system**: Use consistent spacing tokens for value/label gaps and group gaps
4. **Size scale**: Align size modifiers with design system component sizing
5. **Border radius**: If design system uses consistent radius values
6. **Shadow system**: If inverted mode uses shadows for depth
7. **Animation**: Consider transitions for value updates (count-up animations)
8. **Responsive breakpoints**: Group reflow should respect design system breakpoints
