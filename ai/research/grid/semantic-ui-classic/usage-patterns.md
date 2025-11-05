# Semantic UI Classic - Grid Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://semantic-ui.com/collections/grid.html
Status: ✅ Working
Version: Current
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Extensive documentation covering all aspects of the grid system with thorough explanations of concepts, variations, and use cases.

## Component Definition
- **Core purpose**: Harmonize negative space in layouts by dividing horizontal space into columns with consistent gutters, providing a flexible and responsive layout foundation.
- **Mental model**: A flexbox-based container that divides horizontal space into 16 indivisible column units, with rows grouping columns horizontally. Content flows naturally, wrapping to new rows as needed.
- **Semantic meaning**: Structural layout primitive for organizing content into columns and rows with consistent spacing and responsive behavior.

## Pattern Support Levels
- **Native**: CSS classes (e.g., `class="ui grid"`)
- **Composed**: Via HTML composition with class names
- **CSS-only**: Pure CSS-based component

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Grid/Row/Column system | ✅ | Native | `.ui.grid`, `.row`, `.column` - explicit structure with semantic class names |
| 16-column grid | ✅ | Native | Default theme uses 16 columns per row (not 12-column like Bootstrap) |
| Flexbox based | ✅ | Native | Built on flexbox for flexible, modern layout capabilities |
| Fluid layout | ✅ | Native | Automatically scales to available width |
| Automatic flow | ✅ | Native | Columns flow to next row when space exhausted |
| Explicit rows | ✅ | Native | `.row` elements for manual row control |
| Implicit rows | ✅ | Native | Automatic row creation when columns fill width |
| Negative margins | ✅ | Native | Default behavior to align first/last columns flush with container edges |
| Column count control | ✅ | Native | Specify 2-column, 3-column, etc. per row |
| Nested grids | ✅ | Native | Grids can subdivide within other grids |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Device breakpoints | ✅ | Native | Mobile, Tablet, Computer, Large Screen, Widescreen |
| Responsive classes | ✅ | Native | `.(x).wide.(device)` syntax (e.g., `.eight.wide.tablet`) |
| Stackable | ✅ | Native | `.stackable` - automatically stacks columns to single column on mobile |
| Doubling | ✅ | Native | `.doubling` - doubles column width on tablet and mobile sizes |
| Device-specific widths | ✅ | Native | Different column widths per device breakpoint |
| Device visibility | ✅ | Native | Show/hide content per screen size with `.(device).only` |
| Reversed | ✅ | Native | `.reversed` - reverse column/row order at different device sizes |

## Spacing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Gutters (default) | ✅ | Native | Constant-width whitespace between columns using padding |
| Padded | ✅ | Native | `.padded.grid` - preserves vertical and horizontal gutters on first and last columns (overrides negative margins) |
| Relaxed | ✅ | Native | `.relaxed.grid` - increases gutter sizes for more negative space |
| Very Relaxed | ✅ | Native | Likely `.very.relaxed.grid` for maximum gutter spacing |
| Compact | ✅ | Native | Mentioned as available variation for reduced spacing |

## Alignment Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal alignment | ✅ | Native | `.left.aligned`, `.center.aligned`, `.right.aligned`, `.justified` |
| Vertical alignment | ✅ | Native | `.top.aligned`, `.middle.aligned`, `.bottom.aligned` |
| Floated columns | ✅ | Native | `.left.floated`, `.right.floated` for edge positioning |
| Centered grid | ✅ | Native | `.centered` to center column contents within grid |
| Stretched rows | ✅ | Native | `.stretched` to use entire column height |

## Sizing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Column widths | ✅ | Native | `.(x).wide` where x = one through sixteen (e.g., `.four.wide.column`) |
| Equal width | ✅ | Native | `.equal.width` for automatic even distribution of space |
| Stretched | ✅ | Native | `.stretched` rows stretch to match column heights |
| Responsive widths | ✅ | Native | `.(x).wide.(device)` for device-specific column widths |

## Advanced Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Nested grids | ✅ | Native | Full nesting support for grid subdivision |
| Reversed | ✅ | Native | `.(device).reversed` - reverse order at specific breakpoints |
| Celled | ✅ | Native | `.celled` - rows divided into cells with borders (requires explicit `.row` elements) |
| Internally celled | ✅ | Native | `.internally.celled` - cell divisions only between internal rows |
| Divided | ✅ | Native | `.divided` - dividers between columns (requires explicit `.row` elements) |
| Vertically divided | ✅ | Native | `.vertically.divided` - dividers between rows (requires explicit `.row` elements) |
| Colored | ✅ | Native | Named color variations for rows/columns (Red, Orange, Yellow, Olive, Green, Teal, Blue, Violet, Purple, Pink, Brown, Grey, Black) |
| Auto-clearing rows | ✅ | Native | Row wrappers automatically clear previous columns |

## Code Examples
```html
<!-- Basic 16-column grid -->
<div class="ui grid">
  <div class="four wide column"><!-- 4/16 --></div>
  <div class="four wide column"><!-- 4/16 --></div>
  <div class="four wide column"><!-- 4/16 --></div>
  <div class="four wide column"><!-- 4/16 --></div>
</div>

<!-- Stackable responsive grid -->
<div class="ui stackable grid">
  <div class="eight wide column"><!-- Half width on desktop, full on mobile --></div>
  <div class="eight wide column"><!-- Half width on desktop, full on mobile --></div>
</div>

<!-- Doubling grid -->
<div class="ui doubling grid">
  <div class="four wide column"><!-- Doubles width on smaller screens --></div>
  <div class="four wide column"><!-- Doubles width on smaller screens --></div>
  <div class="four wide column"><!-- Doubles width on smaller screens --></div>
  <div class="four wide column"><!-- Doubles width on smaller screens --></div>
</div>

<!-- Responsive column widths -->
<div class="ui grid">
  <div class="sixteen wide mobile eight wide tablet four wide computer column">
    <!-- Full width mobile, half tablet, quarter desktop -->
  </div>
</div>

<!-- Padded grid (preserves gutters on edges) -->
<div class="ui padded grid">
  <div class="column"><!-- Content --></div>
  <div class="column"><!-- Content --></div>
</div>

<!-- Relaxed grid (increased gutters) -->
<div class="ui relaxed grid">
  <div class="column"><!-- Content --></div>
  <div class="column"><!-- Content --></div>
</div>

<!-- Vertically aligned columns -->
<div class="ui middle aligned grid">
  <div class="four wide column"><!-- Vertically centered --></div>
  <div class="twelve wide column"><!-- Vertically centered --></div>
</div>

<!-- Nested grid -->
<div class="ui grid">
  <div class="eight wide column">
    <div class="ui grid">
      <div class="eight wide column"><!-- Nested --></div>
      <div class="eight wide column"><!-- Nested --></div>
    </div>
  </div>
  <div class="eight wide column"><!-- Content --></div>
</div>

<!-- Celled grid with explicit rows -->
<div class="ui celled grid">
  <div class="row">
    <div class="four wide column"><!-- Cell --></div>
    <div class="four wide column"><!-- Cell --></div>
  </div>
  <div class="row">
    <div class="four wide column"><!-- Cell --></div>
    <div class="four wide column"><!-- Cell --></div>
  </div>
</div>

<!-- Divided columns -->
<div class="ui divided grid">
  <div class="row">
    <div class="eight wide column"><!-- Column --></div>
    <div class="eight wide column"><!-- Column --></div>
  </div>
</div>

<!-- Reversed at mobile -->
<div class="ui mobile reversed grid">
  <div class="column"><!-- Second on mobile, first on larger --></div>
  <div class="column"><!-- First on mobile, second on larger --></div>
</div>

<!-- Equal width columns -->
<div class="ui equal width grid">
  <div class="column"><!-- Auto-sized --></div>
  <div class="column"><!-- Auto-sized --></div>
  <div class="column"><!-- Auto-sized --></div>
</div>

<!-- Centered grid -->
<div class="ui centered grid">
  <div class="eight wide column"><!-- Centered --></div>
</div>

<!-- Floated columns -->
<div class="ui grid">
  <div class="left floated four wide column"><!-- Left edge --></div>
  <div class="right floated four wide column"><!-- Right edge --></div>
</div>

<!-- Colored row -->
<div class="ui grid">
  <div class="red row">
    <div class="column"><!-- Red background --></div>
  </div>
</div>
```

## Notable Features
- **16-column system**: Semantic UI defaults to 16 columns (not 12 like Bootstrap), providing more granular control over layout proportions
- **Natural language class names**: `.four.wide.column`, `.stackable`, `.relaxed` follow semantic naming conventions
- **Flexbox foundation**: Modern CSS flexbox provides flexible, powerful layout capabilities
- **Negative margins strategy**: Default use of negative margins keeps grid edges flush with surrounding content; can be overridden with `.padded`
- **Explicit vs implicit rows**: Supports both manual row control and automatic flow
- **Device-aware responsive**: Five breakpoint levels (Mobile, Tablet, Computer, Large Screen, Widescreen)
- **Stackable innovation**: Simple `.stackable` class handles mobile-first responsive stacking automatically
- **Doubling pattern**: `.doubling` intelligently doubles column widths at smaller breakpoints
- **Row requirements**: Certain grid types (`.celled`, `.divided`) specifically require explicit `.row` elements for proper formatting
- **Column styling philosophy**: Styling should be applied to elements inside columns, not directly to column elements themselves
- **Color integration**: Built-in named color variations match Semantic UI's color palette
- **Comprehensive alignment**: Supports horizontal text alignment, vertical content alignment, floated positioning, centering, and stretched heights
- **Word-order sensitive**: Multi-word variations like "left floated" depend on specific word order

## Research Notes
- Documentation is comprehensive and well-organized, covering both basic and advanced use cases
- The 16-column default is a distinguishing feature from other frameworks (Bootstrap uses 12)
- Heavy emphasis on semantic class naming that reads like natural language
- The requirement for explicit `.row` elements with certain grid types (celled, divided) is an important implementation detail
- Documentation clearly explains the negative margin system and when/why to use `.padded` to override it
- Flexbox foundation enables modern layout capabilities while maintaining IE11 compatibility (as of documentation date)
- Strong focus on responsive patterns with multiple strategies (stackable, doubling, device-specific widths, visibility controls)
- Integration with Semantic UI's broader design system (colors, spacing, alignment) creates consistency across components
- HTML code examples were not fully extractable from the documentation page via web fetch, but class name patterns and behavior descriptions were comprehensive enough to reconstruct typical usage
