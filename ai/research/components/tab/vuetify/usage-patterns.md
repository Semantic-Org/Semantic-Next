# Vuetify - Tabs Usage Patterns

## Component URL
https://vuetifyjs.com/en/components/tabs/
Status: ✅ Working

## Documentation Quality
Excellent - Documentation provides comprehensive examples, detailed API references, accessibility guidance, and practical patterns. Vuetify's tabs system is well-documented with Material Design compliance and flexible configuration options.

## Component Definition
- **Core purpose**: A Material Design-compliant navigation component that organizes related content into separate, selectable sections. Provides a tabbed interface for hiding and revealing content.
- **Mental model**: A container system where v-tabs manages the overall tab group, v-tab represents individual tab headers/buttons, and v-tab-item (or v-tabs-items) holds the content for each tab. Tabs function as a content organizer that shows one section at a time.
- **Semantic meaning**: Tabs communicate a flat hierarchy of content grouping. Uses proper ARIA roles (tablist, tab, tabpanel) for semantic structure and keyboard accessibility.

## Component Architecture

### Primary Components
| Component | Role | Purpose |
|-----------|------|---------|
| `v-tabs` | Container | Manages tab group, handles active state, provides layout and styling context |
| `v-tab` | Tab Header | Individual tab button/label that activates corresponding content |
| `v-tab-item` | Content Container | Individual content panel associated with a tab (legacy - deprecated in v3) |
| `v-tabs-items` | Content Wrapper | Modern container for all tab content panels (recommended for v3) |

### Component Relationships
```
v-tabs (container)
├── v-tab (header 1)
├── v-tab (header 2)
├── v-tab (header 3)
└── [optionally]
    └── v-tabs-items
        ├── v-tab-item (content 1)
        ├── v-tab-item (content 2)
        └── v-tab-item (content 3)
```

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Full support. Tab headers can display plain text. Content sections support all HTML and Vue components |
| Icon support | ✅ | Icons can be used in tab headers, either standalone or combined with text. When both present, v-tabs height increases to 72px |
| Media support | ✅ | Tab content can include any media types - images, videos, embedded content via slots |
| Custom content | ✅ | Highly composable. Supports scoped slots for complete template control over tab headers and content |
| Dynamic content | ✅ | Tabs can be created, removed, and reordered dynamically using v-for loops with automatic model management |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Horizontal tabs | ✅ | Default orientation. Tab headers displayed in horizontal row above content |
| Vertical tabs | ✅ | Via `direction` prop with value `vertical`. Headers displayed vertically alongside content |
| Icon-only tabs | ✅ | Tabs can display only icons without text labels. Reduces v-tabs height from 72px to 48px |
| Icon + text tabs | ✅ | Combined display increases height to 72px. Requires proper alignment with `align-icons-and-text` prop (v2) or `stacked` prop (v3) |
| Dynamic tabs | ✅ | Tabs created from arrays with automatic v-for binding. Full support for add/remove operations |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Active/selected | ✅ | Managed via `v-model` binding. Only one tab active at a time. Active tab receives `active-class` styling |
| Disabled | ✅ | Via `disabled` prop on individual v-tab elements. Prevents activation and interaction |
| Loading | ❌ | Not built-in. Must be implemented in tab content using separate loading components |
| Other states | ⚠️ | Hover states and focus states handled automatically by Material Design theme |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Color options | ✅ | Via `color` prop (applies to active tab indicator). Vuetify theme colors supported |
| Size options | ⚠️ | No dedicated size prop. Height varies: 48px (icons only), 72px (icons+text), custom via CSS |
| Fixed width | ✅ | `fixed-tabs` prop forces each tab to maximum 300px width, consuming available space |
| Grow/fill | ✅ | `grow` prop expands tabs to fill all available space without width limit |
| Alignment | ✅ | `align-tabs` prop with values: `start` (default), `center`, `end`. Can align with toolbar title via `align-tabs="title"` |
| Centered active | ✅ | `center-active` prop keeps active tab centered during horizontal scroll |
| Spacing | ✅ | `spaced` prop adds spacing between icons and text in vertical layouts |
| Slider indicator | ✅ | Built-in animated underline/indicator. Customizable via `slider-color` prop |
| Show arrows | ✅ | `show-arrows` prop displays pagination arrows on mobile when tabs overflow. Auto-shows on desktop |

## Props & Configuration

### v-tabs Key Props (v3)
```javascript
// Alignment and Layout
align-tabs: String         // 'start' | 'center' | 'end' | 'title'
center-active: Boolean     // Keep active tab centered in viewport
direction: String          // 'horizontal' (default) | 'vertical'
fixed-tabs: Boolean        // Constrain tabs to 300px max
grow: Boolean              // Expand tabs to fill space
stacked: Boolean           // Stack icons above text (72px height)

// Appearance
bg-color: String           // Background color
color: String              // Active indicator color (Material Design)
slider-color: String       // Custom slider indicator color

// Pagination (overflow)
show-arrows: Boolean       // Show pagination arrows (auto on desktop, optional on mobile)
prev-icon: String          // Custom previous arrow icon
next-icon: String          // Custom next arrow icon

// State Management
v-model: Any               // Two-way binding for active tab value
next-icon: String          // Icon for next pagination button
prev-icon: String          // Icon for previous pagination button

// Content Organization
items: Array               // Array of objects for dynamic tab generation (with template slot)
```

### v-tab Key Props (v3)
```javascript
disabled: Boolean          // Disable tab interaction
value: Any                 // Unique identifier for tab (used in v-model)
href: String               // Make tab a link (optional)
to: String|Object          // Vue Router navigation (optional)
exact: Boolean             // Exact matching for active state when using 'to' prop
```

### v-tab-item / v-tabs-items Props
```javascript
value: Any                 // Matches corresponding v-tab value for sync
```

## Events & Methods

### v-tabs Events
| Event | Payload | Purpose |
|-------|---------|---------|
| `update:modelValue` | Tab value | Fired when active tab changes (emitted from v-model binding) |

### v-tab Events
| Event | Payload | Purpose |
|-------|---------|---------|
| `click` | Native click event | Standard click handling |

### Accessible Keyboard Events
- **Tab key**: Focus into tab component
- **Arrow keys**: Navigate between tabs (should follow: Left/Up to previous, Right/Down to next)
- **Enter/Space**: Activate focused tab

### Methods (via template refs)
Limited direct methods - tabs are primarily controlled via v-model binding. Navigation typically done through:
- v-model binding changes
- Vue Router integration via `to` prop
- Custom click handlers on tabs

## Slots & Templates

### v-tabs Slots
| Slot | Scope | Purpose |
|------|-------|---------|
| `default` | - | Main content area. Typically contains v-tab elements |
| `extension` | - | Area extending below tab headers, often used for nested content or v-toolbar |

### v-tab Slots
| Slot | Purpose | Notes |
|------|---------|-------|
| `default` | Custom tab header content | Renders inside tab. Can include icons, text, badges |

### Tab Content (v-tab-item / v-tabs-items)
| Slot | Purpose |
|------|---------|
| `default` | Tab panel content. Displayed when tab is active |

### Template Slot Pattern (Dynamic Tabs)
```html
<v-tabs v-model="activeTab" :items="tabArray">
  <template v-slot:tab="{ item }">
    <!-- Custom tab header rendering -->
    <v-icon>{{ item.icon }}</v-icon>
    <span>{{ item.title }}</span>
  </template>
  <template v-slot:item="{ item }">
    <!-- Custom tab content rendering -->
    <div>{{ item.content }}</div>
  </template>
</v-tabs>
```

## Code Examples

### Basic Horizontal Tabs
```html
<v-tabs v-model="activeTab">
  <v-tab value="tab-1">Tab 1</v-tab>
  <v-tab value="tab-2">Tab 2</v-tab>
  <v-tab value="tab-3">Tab 3</v-tab>

  <v-window v-model="activeTab">
    <v-window-item value="tab-1">
      <p>Content for Tab 1</p>
    </v-window-item>
    <v-window-item value="tab-2">
      <p>Content for Tab 2</p>
    </v-window-item>
    <v-window-item value="tab-3">
      <p>Content for Tab 3</p>
    </v-window-item>
  </v-window>
</v-tabs>

<script>
export default {
  data() {
    return {
      activeTab: 'tab-1'
    }
  }
}
</script>
```

### Tabs with Icons
```html
<v-tabs v-model="activeTab">
  <v-tab value="home">
    <v-icon left>mdi-home</v-icon>
    Home
  </v-tab>
  <v-tab value="settings">
    <v-icon left>mdi-cog</v-icon>
    Settings
  </v-tab>
  <v-tab value="info">
    <v-icon left>mdi-information</v-icon>
    Info
  </v-tab>
</v-tabs>
```

### Icon-Only Tabs
```html
<v-tabs v-model="activeTab" icons-and-text>
  <v-tab value="camera">
    <v-icon>mdi-camera</v-icon>
  </v-tab>
  <v-tab value="music">
    <v-icon>mdi-music</v-icon>
  </v-tab>
  <v-tab value="search">
    <v-icon>mdi-magnify</v-icon>
  </v-tab>
</v-tabs>
```

### Dynamic Tabs from Array
```html
<v-tabs v-model="activeTab" :items="tabs">
  <template v-slot:tab="{ item }">
    <v-badge v-if="item.badge" :content="item.badge" color="red" inline>
      {{ item.title }}
    </v-badge>
    <span v-else>{{ item.title }}</span>
  </template>

  <template v-slot:item="{ item }">
    <v-card flat>
      <v-card-text>{{ item.content }}</v-card-text>
    </v-card>
  </template>
</v-tabs>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      tabs: [
        { title: 'Tab 1', content: 'Content 1' },
        { title: 'Tab 2', content: 'Content 2', badge: 3 },
        { title: 'Tab 3', content: 'Content 3' }
      ]
    }
  }
}
</script>
```

### Vertical Tabs
```html
<v-row>
  <v-col cols="12" sm="3">
    <v-tabs v-model="activeTab" direction="vertical">
      <v-tab value="profile">Profile</v-tab>
      <v-tab value="security">Security</v-tab>
      <v-tab value="notifications">Notifications</v-tab>
    </v-tabs>
  </v-col>
  <v-col cols="12" sm="9">
    <v-window v-model="activeTab">
      <v-window-item value="profile">
        <v-card>
          <v-card-title>Profile Settings</v-card-title>
          <v-card-text>...</v-card-text>
        </v-card>
      </v-window-item>
      <!-- More window items -->
    </v-window>
  </v-col>
</v-row>
```

### Tabs with Custom Styling
```html
<v-tabs
  v-model="activeTab"
  bg-color="primary"
  color="white"
  slider-color="yellow"
  grow
  fixed-tabs
>
  <v-tab value="tab-1">Tab 1</v-tab>
  <v-tab value="tab-2">Tab 2</v-tab>
  <v-tab value="tab-3">Tab 3</v-tab>
</v-tabs>
```

### Tabs with Pagination (Mobile)
```html
<v-tabs
  v-model="activeTab"
  show-arrows
  mobile-breakpoint="md"
>
  <v-tab v-for="i in 10" :key="i" :value="`tab-${i}`">
    Tab {{ i }}
  </v-tab>
</v-tabs>
```

### Aligned Tabs (Title Alignment)
```html
<v-toolbar>
  <v-toolbar-title>Title</v-toolbar-title>
  <v-spacer></v-spacer>
  <v-tabs align-tabs="title" class="ml-auto">
    <v-tab>Menu 1</v-tab>
    <v-tab>Menu 2</v-tab>
    <v-tab>Menu 3</v-tab>
  </v-tabs>
</v-toolbar>
```

### Disabled Tab Example
```html
<v-tabs v-model="activeTab">
  <v-tab value="tab-1">Active Tab</v-tab>
  <v-tab value="tab-2" disabled>Disabled Tab</v-tab>
  <v-tab value="tab-3">Another Active Tab</v-tab>
</v-tabs>
```

### Tabs with Vue Router Integration
```html
<v-tabs v-model="activeTab">
  <v-tab to="/">Home</v-tab>
  <v-tab to="/about">About</v-tab>
  <v-tab to="/contact">Contact</v-tab>
</v-tabs>
```

### Nested Tabs (Tabs within Tabs)
```html
<v-tabs v-model="outerTab">
  <v-tab value="section-1">Section 1</v-tab>
  <v-tab value="section-2">Section 2</v-tab>

  <v-window v-model="outerTab">
    <v-window-item value="section-1">
      <v-tabs v-model="innerTab">
        <v-tab value="inner-1">Subsection 1</v-tab>
        <v-tab value="inner-2">Subsection 2</v-tab>

        <v-window v-model="innerTab">
          <v-window-item value="inner-1">Inner content 1</v-window-item>
          <v-window-item value="inner-2">Inner content 2</v-window-item>
        </v-window>
      </v-tabs>
    </v-window-item>
    <v-window-item value="section-2">
      Section 2 content
    </v-window-item>
  </v-window>
</v-tabs>

<script>
export default {
  data() {
    return {
      outerTab: 'section-1',
      innerTab: 'inner-1'
    }
  }
}
</script>
```

### Centered Active Tab with Scroll
```html
<v-tabs
  v-model="activeTab"
  center-active
  show-arrows
>
  <v-tab v-for="i in 20" :key="i" :value="`tab-${i}`">
    Tab {{ i }}
  </v-tab>
</v-tabs>
```

## Notable Features

### Material Design Compliance
- **Official Material Design implementation**: Follows Google's Material Design 3 specifications
- **Animated indicator**: Active tab underline animates smoothly between tabs
- **Default styling**: Includes proper color contrast, hover states, and focus indicators
- **Ripple effect**: Touch ripple feedback on tab activation (when enabled in Vuetify config)

### Flexible Sizing
- **Fixed tabs**: `fixed-tabs` prop constrains each tab to 300px maximum width
- **Growing tabs**: `grow` prop expands tabs to fill container without limit
- **Default behavior**: Tabs size naturally based on content, scrollable if overflow

### Pagination System
- **Desktop behavior**: Pagination arrows automatically show when tabs overflow
- **Mobile behavior**: `show-arrows` prop explicitly enables pagination arrows on mobile
- **Custom arrows**: `prev-icon` and `next-icon` props allow custom arrow icons
- **Center active**: `center-active` prop keeps active tab centered in viewport

### Alignment Options
- `align-tabs="start"`: Align tabs to left edge
- `align-tabs="center"`: Center tabs in container
- `align-tabs="end"`: Align tabs to right edge
- `align-tabs="title"`: Special alignment for use with v-toolbar-title components
- Perfect for navbar/toolbar integration

### Dynamic Tab Management
- Tabs created from `items` array using v-for
- Add/remove tabs at runtime with automatic model binding
- Scroll-into-view functionality for newly added tabs
- Selection management when tabs are removed

### Content Organization
- Multiple content patterns: v-tab-item (legacy), v-window (recommended), custom components
- Scoped slots for complete control over rendering
- Smooth transitions between tab content
- Support for any component type in tab content

### Color and Theming
- `color` prop: Changes active tab indicator color
- `slider-color` prop: Explicit control over indicator color (v2 compatibility)
- `bg-color` prop: Background color customization
- Full Vuetify color system support (primary, secondary, error, warning, success, info)
- CSS custom properties for advanced theming

### Vertical Tabs
- `direction="vertical"` prop enables vertical tab layout
- `spaced` prop adds spacing between vertical icons and text
- Sidebar navigation pattern support
- Settings/preferences interface common use case

### Accessibility Concerns
- **Known issue**: Keyboard arrow navigation not fully W3C ARIA compliant in some versions
- **Tab key behavior**: Tab key enters component; arrow keys may not work as expected
- **Recommended ARIA attributes**: aria-label, aria-selected, aria-controls should be properly set
- **Focus management**: Active tab should have tabindex="0", inactive tabs tabindex="-1"
- **Workaround**: Some developers implement custom arrow key handlers for full accessibility

## State Management Patterns

### V-model Binding
```javascript
// Controlled by v-model
data() {
  return {
    activeTab: 'tab-1'  // Can be string, number, or object
  }
}
```

### Tab Value Types
- String values: `value="tab-1"` (recommended for clarity)
- Numeric values: `value="0"` (useful for array indices)
- Object values: `value="{ id: 1, name: 'Tab 1' }"` (complex scenarios)

### Initial State
- Default first tab active if no `v-model` value provided
- Set `v-model` to specific value to control which tab starts active
- v-model updates reactively when tab is clicked

## Browser & Device Support

### Desktop
- Tab overflow: Shows pagination arrows automatically
- Keyboard navigation: Tab key to enter, ideally arrow keys to navigate (varies by browser/Vue version)
- Mouse interaction: Full support

### Mobile
- Tab overflow: Shows pagination arrows via `show-arrows` prop
- Touch interaction: Full support with ripple feedback
- Vertical tabs: Responsive layouts with direction changes possible via media queries

### Responsive Design
- Display utilities (d-none, d-sm-block, etc.) for responsive tab visibility
- Vertical direction on narrow viewports, horizontal on wide
- Media breakpoint-based behavior using Vue's responsive class system

## Integration Patterns

### With v-toolbar
```html
<v-toolbar>
  <v-toolbar-title>Title</v-toolbar-title>
  <v-spacer></v-spacer>
  <v-tabs align-tabs="title">
    <v-tab>Menu 1</v-tab>
    <v-tab>Menu 2</v-tab>
  </v-tabs>
</v-toolbar>
```

### With v-window for Content Animation
```html
<v-tabs v-model="activeTab">
  <v-tab>Tab 1</v-tab>
  <v-tab>Tab 2</v-tab>
  <v-window v-model="activeTab">
    <v-window-item>Content 1</v-window-item>
    <v-window-item>Content 2</v-window-item>
  </v-window>
</v-tabs>
```

### With v-card for Content Containers
```html
<v-tabs v-model="activeTab">
  <v-tab>Details</v-tab>
  <v-tab>Reviews</v-tab>
  <v-window v-model="activeTab">
    <v-window-item>
      <v-card>
        <v-card-text>Details content</v-card-text>
      </v-card>
    </v-window-item>
    <v-window-item>
      <v-card>
        <v-card-text>Reviews content</v-card-text>
      </v-card>
    </v-window-item>
  </v-window>
</v-tabs>
```

## Research Notes

### Documentation Access
- Main documentation at vuetifyjs.com is comprehensive with good examples
- GitHub markdown source provides detailed implementation patterns
- Vuetify 3.x (current) and Vuetify 2.x documentation both available
- API documentation includes all props, events, and slots

### Framework Approach Observations

**Material Design First**: Vuetify's tabs are a strict implementation of Material Design 3 specifications, ensuring consistency with Google's design language.

**Composability-Focused**: Unlike monolithic tab components, Vuetify uses composition (v-tabs + v-window) enabling flexible content patterns and animation control.

**Flexible Styling**: Multiple alignment options (start, center, end, title), color control, and growth patterns support diverse use cases from simple nav to complex settings interfaces.

**Mobile-Aware**: Built-in pagination for overflow scenarios and show-arrows prop for explicit mobile control. Responsive behavior integrates with Vuetify's display utilities.

**Accessibility Gaps**: Known issues with W3C ARIA keyboard navigation patterns (arrow keys not fully supported in all versions). Requires attention when building accessible tabs.

**Vue Integration**: Tight integration with Vue Router (`to` prop) and v-model binding pattern makes it familiar to Vue developers.

### Comparison Observations

**vs Semantic UI (Classic)**: More flexible styling system (bg-color, slider-color props); built-in pagination; better Material Design compliance

**vs Ant Design**: Simpler prop structure; better mobile pagination; less feature-heavy but easier to customize

**vs Material-UI**: Similar Material Design approach; Vuetify integrates better with Vue ecosystem; pagination handling different

**vs Chakra UI**: Vuetify more comprehensive with built-in pagination; Chakra simpler but less Material Design aligned

**vs Headless UI**: Vuetify more opinionated with Material Design; Headless UI offers more customization freedom

**vs shadcn**: Vuetify pre-styled and ready to use; shadcn requires more setup but offers complete code ownership

**vs Radix UI**: Vuetify Material Design focused; Radix more accessible-by-default with better ARIA implementation

### Version Differences (v2 vs v3)
- **v2**: Uses v-tab-item for content, `icons-and-text` prop for stacking
- **v3**: Introduces `v-tabs-items`, `stacked` prop, more flexible prop naming
- **Migration**: v3 maintains some v2 compatibility but deprecates v-tab-item in favor of v-window

### Key Takeaways for Semantic UI Implementation

1. **Separation of concerns**: Tabs container (v-tabs) separate from content container (v-window) allows flexible composition
2. **Material Design as reference**: Strong adherence to Material Design specifications provides accessibility and UX baseline
3. **Pagination for overflow**: Built-in pagination pattern valuable for responsive behavior
4. **Accessibility needs attention**: Arrow key navigation should be implemented for full W3C ARIA compliance
5. **Multiple alignment options**: Toolbar integration patterns suggest value of flexible alignment options
6. **Dynamic tab support**: Array-based tab generation with v-for common pattern for flexible tab structures
