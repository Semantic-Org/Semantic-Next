# Vuetify - Grid Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://vuetifyjs.com/en/components/grids
Status: ✅ Working
Version: v3.x (Current)
Last Verified: 2025-11-05

## Documentation Quality
Good - Comprehensive coverage of grid system features with practical examples, though web fetch limitations required supplementary research through search results and community resources.

## Component Definition
- **Core purpose**: Provides a 12-column Flexbox-based responsive grid system for laying out content with automatic spacing and alignment, following Material Design specifications
- **Mental model**: Container → Row → Columns structure where v-container provides responsive width constraints, v-row creates flex containers, and v-col defines flexible column widths that adapt across breakpoints
- **Semantic meaning**: Communicates layout structure and responsive behavior, organizing content into a standardized grid that adapts to different screen sizes

## Pattern Support Levels
- **Native**: Vue component props (e.g., `<v-col cols="12" md="6">`)
- **Composed**: Via component nesting (e.g., `<v-container><v-row><v-col></v-col></v-row></v-container>`)
- **CSS-only**: Not applicable - requires Vue components

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Row/Column system | ✅ | Native | v-container, v-row, v-col components |
| 12-column grid | ✅ | Native | cols prop accepts 1-12, auto, and responsive breakpoint variations |
| Flexbox based | ✅ | Native | All layout uses Flexbox, v-row is flex container, v-col uses flex properties |
| Container wrapper | ✅ | Native | v-container with fixed/fluid width options |
| Nested grids | ✅ | Composed | v-row can be nested inside v-col for complex layouts |
| Auto-width columns | ✅ | Native | Omit cols prop or use cols="auto" for content-based width |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Breakpoints | ✅ | Native | xs: <600px, sm: 600px, md: 960px, lg: 1264px, xl: 1904px |
| Responsive props | ✅ | Native | cols, sm, md, lg, xl props on v-col (xs is implicit via cols) |
| Breakpoint-specific sizing | ✅ | Native | `<v-col cols="12" sm="6" md="4" lg="3">` |
| Breakpoint-specific offset | ✅ | Native | offset, offset-sm, offset-md, offset-lg, offset-xl |
| Breakpoint-specific order | ✅ | Native | order, order-sm, order-md, order-lg, order-xl |
| Programmatic breakpoint access | ✅ | Native | this.$vuetify.breakpoint.name in component logic |
| Mobile-first design | ✅ | Native | xs (cols) applies by default, overridden by larger breakpoints |

## Spacing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Gutter control | ✅ | Native | Default 24px gutter, no-gutters prop removes all gutters |
| Dense spacing | ✅ | Native | dense prop on v-row reduces gutter size |
| Custom gutter | ⚠️ | CSS-only | No built-in prop, requires custom CSS overrides |
| Container padding | ✅ | Native | Default 16px horizontal padding on v-container |
| Negative margins | ✅ | Native | v-row uses negative margins (removed with no-gutters) |

## Alignment Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal alignment | ✅ | Native | justify prop: 'start', 'center', 'end', 'space-around', 'space-between' |
| Vertical alignment | ✅ | Native | align prop: 'start', 'center', 'end', 'baseline', 'stretch' |
| Self alignment | ✅ | Native | align-self prop on v-col: 'start', 'center', 'end', 'auto', 'baseline', 'stretch' |
| Content alignment | ✅ | Native | Combined align and justify on v-row for full control |

## Sizing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Column sizing | ✅ | Native | cols prop accepts 1-12 or "auto" |
| Responsive sizing | ✅ | Native | sm, md, lg, xl props override cols at breakpoints |
| Offset | ✅ | Native | offset prop shifts column (1-11), responsive variants available |
| Auto sizing | ✅ | Native | cols="auto" sizes column based on content width |
| Equal width columns | ✅ | Native | Omit cols prop on all v-col in v-row for equal distribution |
| Fixed width | ⚠️ | CSS-only | No built-in prop, requires custom width styles |

## Advanced Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Nested grids | ✅ | Composed | Place v-row inside v-col for sub-grids |
| Order control | ✅ | Native | order, order-sm, order-md, order-lg, order-xl (values 0-12) |
| Grow/shrink | ⚠️ | CSS-only | No direct props, inherits Flexbox grow/shrink behavior |
| Fluid container | ✅ | Native | fluid prop on v-container for full-width |
| Fill height | ✅ | Native | fill-height prop on v-container for viewport height |
| Conditional fluid | ✅ | Composed | Combine fluid with responsive class bindings |

## Code Examples

### Basic Grid Layout
```vue
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        Full width column
      </v-col>
      <v-col cols="6">
        Half width column
      </v-col>
      <v-col cols="6">
        Half width column
      </v-col>
      <v-col cols="4">
        One third
      </v-col>
      <v-col cols="4">
        One third
      </v-col>
      <v-col cols="4">
        One third
      </v-col>
    </v-row>
  </v-container>
</template>
```

### Responsive Column Sizing
```vue
<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3">
        <!--
          Mobile (xs): 12 columns (full width)
          Tablet (sm): 6 columns (half width)
          Desktop (md): 4 columns (one third)
          Large (lg): 3 columns (one quarter)
        -->
        Responsive column
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3">
        Responsive column
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3">
        Responsive column
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3">
        Responsive column
      </v-col>
    </v-row>
  </v-container>
</template>
```

### Alignment and Justification
```vue
<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <!-- Centered both vertically and horizontally -->
        Centered content
      </v-col>
    </v-row>

    <v-row align="end" justify="space-between">
      <v-col cols="auto">
        Left aligned
      </v-col>
      <v-col cols="auto">
        Right aligned
      </v-col>
    </v-row>

    <v-row align="start">
      <v-col cols="4" align-self="center">
        Self-centered column
      </v-col>
      <v-col cols="4" align-self="end">
        Self-aligned to bottom
      </v-col>
    </v-row>
  </v-container>
</template>
```

### Offset and Order
```vue
<template>
  <v-container>
    <v-row>
      <v-col cols="4" offset="4">
        <!-- Centered using offset (4 cols + 4 offset = 8, leaving 2 on each side) -->
        Offset column
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="3" offset="3" offset-md="0">
        <!-- Offset on mobile, no offset on desktop -->
        Responsive offset
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" order="3">
        Appears third
      </v-col>
      <v-col cols="4" order="1">
        Appears first
      </v-col>
      <v-col cols="4" order="2">
        Appears second
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" order="2" order-md="1">
        <!-- Order changes with breakpoint -->
        First on desktop, second on mobile
      </v-col>
      <v-col cols="12" md="6" order="1" order-md="2">
        Second on desktop, first on mobile
      </v-col>
    </v-row>
  </v-container>
</template>
```

### Spacing Control
```vue
<template>
  <v-container>
    <!-- Default spacing (24px gutters) -->
    <v-row>
      <v-col cols="6">
        <v-sheet class="pa-2">Default spacing</v-sheet>
      </v-col>
      <v-col cols="6">
        <v-sheet class="pa-2">Default spacing</v-sheet>
      </v-col>
    </v-row>

    <!-- Dense spacing (reduced gutters) -->
    <v-row dense>
      <v-col cols="6">
        <v-sheet class="pa-2">Dense spacing</v-sheet>
      </v-col>
      <v-col cols="6">
        <v-sheet class="pa-2">Dense spacing</v-sheet>
      </v-col>
    </v-row>

    <!-- No gutters -->
    <v-row no-gutters>
      <v-col cols="6">
        <v-sheet class="pa-2">No gutters</v-sheet>
      </v-col>
      <v-col cols="6">
        <v-sheet class="pa-2">No gutters</v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
```

### Fluid Container
```vue
<template>
  <!-- Fixed width container (default) -->
  <v-container>
    <v-row>
      <v-col>Fixed width container with max-width based on breakpoint</v-col>
    </v-row>
  </v-container>

  <!-- Fluid container (full width) -->
  <v-container fluid>
    <v-row>
      <v-col>Fluid container extends to viewport width</v-col>
    </v-row>
  </v-container>

  <!-- Fill height container -->
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col>Vertically centered in viewport</v-col>
    </v-row>
  </v-container>
</template>
```

### Nested Grids
```vue
<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Main Content</v-card-title>
          <v-card-text>
            <!-- Nested grid inside column -->
            <v-row>
              <v-col cols="6">Nested column 1</v-col>
              <v-col cols="6">Nested column 2</v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Sidebar</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
```

### Complex Responsive Layout
```vue
<template>
  <v-container class="bg-surface-variant">
    <v-row class="mb-6" no-gutters>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-sheet class="pa-2 ma-2">
          xs12 sm12 md6 lg4
        </v-sheet>
      </v-col>
      <v-col cols="6" sm="6" md="3" lg="4">
        <v-sheet class="pa-2 ma-2">
          xs6 sm6 md3 lg4
        </v-sheet>
      </v-col>
      <v-col cols="6" sm="6" md="3" lg="4">
        <v-sheet class="pa-2 ma-2">
          xs6 sm6 md3 lg4
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
```

### Programmatic Breakpoint Access
```vue
<template>
  <v-container>
    <v-row>
      <v-col>
        <div v-if="$vuetify.breakpoint.mobile">
          Mobile view content
        </div>
        <div v-else>
          Desktop view content
        </div>
        <p>Current breakpoint: {{ $vuetify.breakpoint.name }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name // 'xs', 'sm', 'md', 'lg', 'xl'
    }
  }
}
</script>
```

## Notable Features

### Vue-Specific Patterns
- **Reactive breakpoint system**: Access current breakpoint via `this.$vuetify.breakpoint.name` in component logic
- **Mobile/desktop helpers**: Boolean properties like `$vuetify.breakpoint.mobile` for conditional rendering
- **Component-based**: Grid is implemented as Vue components (v-container, v-row, v-col) rather than CSS classes
- **Props-driven**: All configuration done via component props rather than CSS classes

### Material Design Integration
- **12-column system**: Follows Material Design's grid specifications
- **Standardized breakpoints**: Breakpoints align with Material Design's device categories
- **Consistent spacing**: Default 24px gutters match Material Design spacing guidelines
- **Elevation and surfaces**: Grid works seamlessly with v-sheet and v-card for elevation

### Flexbox Foundation
- **Modern layout**: Built entirely on Flexbox rather than float-based layouts
- **Automatic equal heights**: Columns in same row automatically match height
- **Content-based sizing**: cols="auto" allows natural content width
- **Easy alignment**: justify and align props provide simple alignment control

### Container Max-Width System
- **Responsive max-widths**: Container width automatically adjusts based on breakpoint
- **Centered by default**: Fixed containers are horizontally centered
- **Fluid option**: fluid prop removes max-width for full-viewport layouts
- **Predictable behavior**: Consistent horizontal padding (16px) prevents edge touching

### No XS Prop (Design Decision)
- **cols replaces xs**: The xs breakpoint is implicit via the cols prop
- **Simplified API**: Reduces prop clutter since mobile-first is default
- **Mobile-first approach**: cols applies at all sizes unless overridden

### Negative Margin Pattern
- **Row margins**: v-row uses negative margins to offset column padding
- **Gutter system**: Creates consistent spacing between columns
- **no-gutters removal**: Removes both negative margins and column padding together

### Order Control with Breakpoints
- **Source order independence**: Visual order can differ from DOM order
- **Responsive reordering**: order-sm, order-md, etc. allow breakpoint-specific ordering
- **Accessibility consideration**: Screen readers follow DOM order, not visual order

## Research Notes

### Documentation Access Challenges
- Direct web fetch of official documentation encountered limitations showing only page title
- Supplemented with web search results, community tutorials, and Stack Overflow examples
- Information cross-verified across multiple sources to ensure accuracy

### Version Considerations
- Documentation appears to be for Vuetify v3.x (current version)
- Some community resources reference v2 (v15.vuetifyjs.com) with similar but slightly different APIs
- v2 and v3 grid systems are largely compatible with minor prop name changes

### Community Resources
- Strong community documentation available (dilshankelsen.com, blog.logrocket.com, dev.to)
- Many practical examples on Stack Overflow for real-world usage patterns
- GitHub issues reveal edge cases and customization patterns

### Framework Philosophy
- **Component-first**: Grid system requires Vue components, not CSS-only solution
- **Props over classes**: Configuration through component props rather than utility classes
- **Material Design adherence**: Strict following of Material Design grid specifications
- **Opinionated spacing**: Fixed gutter sizes (24px default, dense option) with limited customization

### Comparison to Other Frameworks
- **Bootstrap-like structure**: Similar container/row/column hierarchy
- **More opinionated**: Less flexible than CSS Grid but more consistent
- **Vue-specific**: Tight integration with Vue reactivity and component system
- **Flexbox only**: No CSS Grid support, purely Flexbox-based

### Performance Considerations
- **Component overhead**: Each grid element is a Vue component with lifecycle
- **Reactive breakpoint**: Breakpoint detection is reactive, updates on resize
- **DOM structure**: Additional wrapper elements compared to pure CSS solutions

### Edge Cases Discovered
- **7 or 8 column grids**: Not directly supported (12-column system only), requires custom CSS or creative column sizing
- **4K screen max-width**: Container max-width (1785px) may be too narrow on 4K displays (3840px), requires fluid or custom max-width
- **Custom gutter sizes**: No built-in prop for arbitrary gutter sizes, requires CSS overrides
- **Fixed widths**: No prop for fixed pixel widths, columns are always percentage-based

### Migration Considerations
- **v2 to v3**: Largely compatible API, minimal breaking changes in grid system
- **From Bootstrap**: Similar mental model, straightforward migration path
- **From CSS Grid**: Different paradigm, requires component-based thinking
- **Tailwind CSS**: More verbose than utility classes, but more structured

### Customization Limitations
- **Locked to 12 columns**: Cannot change column count without forking framework
- **Fixed gutter options**: Only default, dense, or no-gutters (no arbitrary values)
- **Breakpoint thresholds**: Fixed breakpoint values, customization requires theme configuration
- **Container max-widths**: Limited control over container width at different breakpoints

### Best Practices from Community
- **Always use v-container**: Wrap v-row in v-container for proper padding
- **Avoid nested v-containers**: Can cause unexpected padding/margin issues
- **Mobile-first sizing**: Start with cols, add breakpoint-specific overrides
- **Use no-gutters sparingly**: Default gutters provide better visual hierarchy
- **Leverage fill-height**: Useful for centering content vertically in viewport
- **Combine with Vuetify spacing**: Use ma-* and pa-* classes with grid for fine-tuning

### Accessibility Considerations
- **Semantic HTML**: v-row and v-col render as divs, not semantic elements
- **Order vs DOM order**: Visual reordering (order prop) doesn't affect screen reader order
- **Responsive considerations**: Ensure content hierarchy makes sense at all breakpoints
- **Touch targets**: Consider mobile touch target sizes when using dense spacing

### Common Pitfalls
- **Forgetting v-container**: Using v-row directly without container wrapper
- **Mixed gutter approaches**: Combining no-gutters with manual margin/padding
- **Over-nesting**: Creating unnecessarily deep grid hierarchies
- **Breakpoint confusion**: Using xs prop (doesn't exist, use cols instead)
- **Fixed expectations**: Expecting pixel-perfect layouts in percentage-based system
