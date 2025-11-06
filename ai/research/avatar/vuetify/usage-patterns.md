# Vuetify - Avatar Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://vuetifyjs.com/en/components/avatars
Status: ✅ Working (v3)
Legacy Documentation: https://v2.vuetifyjs.com/en/components/avatars (v2)
Version: Vuetify 3 (Current), with references to v2 where relevant
Last Verified: 2025-11-05

## Documentation Quality
**Good** - Documentation provides clear examples and API details. The component is well-documented with practical usage patterns. GitHub repository contains multiple example files demonstrating various use cases. Community resources and Stack Overflow provide additional integration patterns.

## Component Definition
- **Core purpose**: Display circular or square user profile pictures, icons, or text initials with consistent sizing and Material Design styling
- **Mental model**: A container that enforces aspect ratio and provides a consistent shape (circle/square) for visual identity elements like profile pictures, user initials, or iconic representations
- **Semantic meaning**: Represents user identity or entity visualization in the interface. Provides visual consistency for profile representations across different contexts (lists, cards, toolbars, chips, badges)

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children/slots
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Direct text/initials in default slot: `<v-avatar color="red"><span class="text-h5">CJ</span></v-avatar>` |
| Icon support | ✅ | Composed | Via `v-icon` component in default slot with Material Design Icons support |
| Image support | ✅ | Composed | Via `v-img` component in default slot: `<v-avatar><v-img src="..." /></v-avatar>` |
| Icon prop | ✅ | Native | Direct icon via `icon` prop: `<v-avatar icon="mdi-account-circle">` (v3) |
| Custom content | ✅ | Composed | Any Vue component or HTML in default slot |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Circular | ✅ | Native | Default shape with `rounded` prop controlling border-radius |
| Square | ✅ | Native | Via `tile` prop - "Removes the component's border-radius" for hard-lined avatars |
| Custom radius | ✅ | Native | Via `rounded` prop - "Designates the border-radius applied to the component" |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | CSS-only | Not built-in, would need custom implementation |
| Disabled | ❌ | N/A | Not applicable for display component |
| Active/Selected | ❌ | CSS-only | No built-in active state, parent component handles selection |
| Other states | ⚠️ | Composed | Presence indicators (away, busy, offline) require custom implementation or composition with badges |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop - "Defines the height and width of v-avatar. This prop scales both evenly with an aspect ratio of 1" |
| Size override | ✅ | Native | `height` and `width` props override `size` prop for non-square avatars |
| Min/Max dimensions | ✅ | Native | `min-height`, `min-width`, `max-height`, `max-width` props for responsive control |
| Color options | ✅ | Native | `color` prop - "Applies specified color to the control - material color names (success, purple) or CSS color (#033, rgba(255,0,0,0.5))" |
| Position hints | ✅ | Native | `left` and `right` props - "Designates that the avatar is on the left/right side of a component. Hooked into by v-chip and v-btn" |
| Tile variant | ✅ | Native | `tile` prop removes border-radius for square avatars |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | Standard Vue `@click` event support |
| Badge integration | ✅ | Composed | Via `v-badge` component - "Removes badge padding for the use of v-avatar in the badge slot" |
| Chip integration | ✅ | Composed | Works within `v-chip` component, respects `left`/`right` props |
| Button integration | ✅ | Composed | Can be used within `v-btn`, respects positioning props |
| Avatar groups | ✅ | CSS-only | Stacked/overlapping avatars require custom CSS with negative margins |
| Tooltip support | ✅ | Composed | Via `v-tooltip` wrapper for hover information |

## Code Examples

### Basic Avatar Types

#### Icon Avatar (Composed)
```vue
<v-avatar color="info">
  <v-icon icon="mdi-account-circle"></v-icon>
</v-avatar>
```

#### Icon Avatar (Native Prop)
```vue
<v-avatar color="info" icon="mdi-account-circle"></v-avatar>
```

#### Image Avatar
```vue
<v-avatar>
  <v-img
    alt="John"
    src="https://cdn.vuetifyjs.com/images/john.jpg"
  ></v-img>
</v-avatar>
```

#### Text/Initials Avatar
```vue
<v-avatar color="red">
  <span class="text-h5">CJ</span>
</v-avatar>
```

### Size Variations

#### Using size Prop
```vue
<!-- Small avatar -->
<v-avatar size="40">
  <v-img src="profile.jpg"></v-img>
</v-avatar>

<!-- Medium avatar -->
<v-avatar size="64">
  <v-img src="profile.jpg"></v-img>
</v-avatar>

<!-- Large avatar -->
<v-avatar size="96">
  <v-img src="profile.jpg"></v-img>
</v-avatar>

<!-- Dynamic size -->
<v-avatar :size="avatarSize">
  <span class="text-h6">AB</span>
</v-avatar>
```

#### Size Override with Width/Height
```vue
<!-- Non-square avatar (aspect ratio override) -->
<v-avatar width="80" height="100">
  <v-img src="profile.jpg"></v-img>
</v-avatar>
```

#### Responsive Sizing
```vue
<v-avatar
  :size="$vuetify.display.mobile ? 40 : 64"
  color="primary"
>
  <span class="text-button">JD</span>
</v-avatar>
```

### Shape Variations

#### Circular (Default)
```vue
<v-avatar color="purple">
  <span class="text-h5">RP</span>
</v-avatar>
```

#### Square/Tile
```vue
<v-avatar color="teal" tile>
  <span class="text-h5">SQ</span>
</v-avatar>
```

#### Custom Rounded
```vue
<!-- Slightly rounded square -->
<v-avatar color="indigo" rounded="lg">
  <span class="text-h5">RD</span>
</v-avatar>

<!-- No rounding (equivalent to tile) -->
<v-avatar color="blue" rounded="0">
  <span>NR</span>
</v-avatar>
```

### Color Options

#### Material Color Names
```vue
<v-avatar color="primary">
  <v-icon icon="mdi-account"></v-icon>
</v-avatar>

<v-avatar color="success">
  <span>OK</span>
</v-avatar>

<v-avatar color="error">
  <v-icon icon="mdi-alert"></v-icon>
</v-avatar>
```

#### Custom CSS Colors
```vue
<!-- Hex color -->
<v-avatar color="#FF5722">
  <span class="white--text">HX</span>
</v-avatar>

<!-- RGB/RGBA -->
<v-avatar color="rgba(76, 175, 80, 0.8)">
  <span>RG</span>
</v-avatar>
```

#### Dynamic Color Generation
```vue
<template>
  <v-avatar :color="generateColor(user.name)">
    <span class="white--text">{{ user.initials }}</span>
  </v-avatar>
</template>

<script>
export default {
  methods: {
    generateColor(name) {
      // Generate consistent color based on name
      const colors = ['red', 'pink', 'purple', 'indigo', 'blue', 'teal', 'green'];
      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    }
  }
}
</script>
```

### Integration with Other Components

#### Avatar in List Items
```vue
<v-list>
  <v-list-item>
    <template v-slot:prepend>
      <v-avatar color="primary">
        <v-icon icon="mdi-account"></v-icon>
      </v-avatar>
    </template>
    <v-list-item-title>John Doe</v-list-item-title>
    <v-list-item-subtitle>john@example.com</v-list-item-subtitle>
  </v-list-item>

  <v-list-item>
    <template v-slot:append>
      <v-avatar size="32">
        <v-img src="profile2.jpg"></v-img>
      </v-avatar>
    </template>
    <v-list-item-title>Jane Smith</v-list-item-title>
  </v-list-item>
</v-list>
```

#### Avatar with Badge
```vue
<!-- Notification badge on avatar -->
<v-badge
  color="error"
  content="3"
  overlap
>
  <v-avatar size="56">
    <v-img src="user-avatar.jpg"></v-img>
  </v-avatar>
</v-badge>

<!-- Presence indicator -->
<v-badge
  color="success"
  dot
  overlap
  bottom
>
  <v-avatar color="grey">
    <span class="white--text">JD</span>
  </v-avatar>
</v-badge>

<!-- Icon badge -->
<v-badge overlap>
  <template v-slot:badge>
    <v-icon icon="mdi-lock" size="small"></v-icon>
  </template>
  <v-avatar>
    <v-img src="locked-profile.jpg"></v-img>
  </v-avatar>
</v-badge>
```

#### Avatar in Chips
```vue
<!-- Avatar on left (default) -->
<v-chip>
  <v-avatar left color="primary">
    <span>JD</span>
  </v-avatar>
  John Doe
</v-chip>

<!-- Avatar on right -->
<v-chip>
  Jane Smith
  <v-avatar right color="teal">
    <v-icon icon="mdi-account"></v-icon>
  </v-avatar>
</v-chip>

<!-- Image avatar in chip -->
<v-chip>
  <v-avatar left>
    <v-img src="profile.jpg"></v-img>
  </v-avatar>
  Active User
</v-chip>
```

#### Avatar in Buttons
```vue
<!-- Icon button with avatar -->
<v-btn icon>
  <v-avatar size="36">
    <v-img src="user.jpg"></v-img>
  </v-avatar>
</v-btn>

<!-- Regular button with avatar -->
<v-btn>
  <v-avatar left size="28" color="white">
    <span class="primary--text">JD</span>
  </v-avatar>
  Profile
</v-btn>
```

#### Avatar in Toolbar/App Bar
```vue
<v-toolbar>
  <v-toolbar-title>My App</v-toolbar-title>
  <v-spacer></v-spacer>

  <!-- User menu with avatar -->
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar size="40">
          <v-img src="user-profile.jpg"></v-img>
        </v-avatar>
      </v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-title>Profile</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Settings</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</v-toolbar>
```

#### Profile Card with Avatar
```vue
<v-card max-width="434" rounded="0">
  <v-img
    src="background.jpg"
    height="200"
  >
    <v-container fill-height fluid>
      <v-row align="end" justify="center">
        <v-avatar size="150" rounded="0">
          <v-img src="profile.jpg"></v-img>
        </v-avatar>
      </v-row>
    </v-container>
  </v-img>

  <v-list-item
    title="Marcus Obrien"
    subtitle="Network Engineer"
    class="text-white"
  ></v-list-item>
</v-card>
```

### Advanced Patterns

#### Avatar Group (Stacked/Overlapping)
```vue
<template>
  <div class="avatar-group">
    <v-avatar
      v-for="(user, index) in users.slice(0, 5)"
      :key="user.id"
      :style="{ zIndex: users.length - index }"
      size="40"
      color="grey lighten-1"
    >
      <v-img v-if="user.avatar" :src="user.avatar"></v-img>
      <span v-else class="white--text">{{ user.initials }}</span>
    </v-avatar>

    <!-- +N indicator for remaining users -->
    <v-avatar
      v-if="users.length > 5"
      size="40"
      color="grey darken-2"
      style="z-index: 0"
    >
      <span class="white--text">+{{ users.length - 5 }}</span>
    </v-avatar>
  </div>
</template>

<style scoped>
.avatar-group {
  display: flex;
  align-items: center;
}
.avatar-group .v-avatar {
  margin-left: -12px;
  border: 2px solid white;
}
.avatar-group .v-avatar:first-child {
  margin-left: 0;
}
</style>
```

#### Conditional Avatar Content
```vue
<template>
  <v-avatar :color="user.avatar ? undefined : 'primary'" size="64">
    <!-- Show image if available -->
    <v-img
      v-if="user.avatar"
      :src="user.avatar"
      :alt="user.name"
    ></v-img>

    <!-- Fall back to initials -->
    <span v-else class="white--text text-h5">
      {{ getInitials(user.name) }}
    </span>
  </v-avatar>
</template>

<script>
export default {
  methods: {
    getInitials(name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
  }
}
</script>
```

#### Avatar with Tooltip
```vue
<v-tooltip location="bottom">
  <template v-slot:activator="{ props }">
    <v-avatar v-bind="props" color="primary">
      <span class="white--text">JD</span>
    </v-avatar>
  </template>
  <span>John Doe - Online</span>
</v-tooltip>
```

#### Clickable Avatar with Action
```vue
<v-avatar
  @click="openProfile"
  style="cursor: pointer"
  size="56"
  color="primary"
>
  <v-img :src="userAvatar"></v-img>
</v-avatar>
```

#### Avatar with Loading State
```vue
<template>
  <v-avatar size="64" :color="loading ? 'grey lighten-3' : 'primary'">
    <v-progress-circular
      v-if="loading"
      indeterminate
      size="32"
      color="primary"
    ></v-progress-circular>
    <v-img v-else :src="avatarUrl"></v-img>
  </v-avatar>
</template>
```

#### Avatar Selection Grid
```vue
<template>
  <v-row>
    <v-col
      v-for="avatar in avatarOptions"
      :key="avatar.id"
      cols="2"
    >
      <v-avatar
        @click="selectAvatar(avatar)"
        :color="selectedId === avatar.id ? 'primary' : 'grey'"
        :class="{ 'avatar-selected': selectedId === avatar.id }"
        size="64"
        style="cursor: pointer"
      >
        <v-img :src="avatar.src"></v-img>
      </v-avatar>
    </v-col>
  </v-row>
</template>

<style scoped>
.avatar-selected {
  border: 3px solid currentColor;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
}
</style>
```

### Responsive Patterns

#### Mobile vs Desktop Sizing
```vue
<v-avatar
  :size="$vuetify.display.smAndDown ? 40 : 64"
  color="primary"
>
  <v-img :src="userAvatar"></v-img>
</v-avatar>
```

#### Breakpoint-Based Layout
```vue
<v-list-item>
  <!-- Show avatar on larger screens only -->
  <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
    <v-avatar size="48">
      <v-img :src="item.avatar"></v-img>
    </v-avatar>
  </template>

  <v-list-item-title>{{ item.title }}</v-list-item-title>
  <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
</v-list-item>
```

## Notable Features

### 1. Material Design Compliance
Vuetify's avatar follows Material Design principles:
- **Circular by default**: Aligns with Material Design avatar specifications
- **Consistent sizing**: Enforces 1:1 aspect ratio by default via `size` prop
- **Color system integration**: Uses Vuetify's Material Design color palette
- **Elevation support**: Can be combined with `v-card` or custom classes for elevation effects

### 2. Flexible Content Model
The default slot accepts multiple content types:
- **Text/Initials**: Direct text or styled spans for user initials
- **Icons**: `v-icon` component with Material Design Icons
- **Images**: `v-img` component with built-in lazy loading and error handling
- **Custom components**: Any Vue component for specialized avatar content
- **Icon prop**: Direct icon rendering via `icon` prop (v3 feature)

### 3. Composition-First Architecture
Avatar is designed to compose with other Vuetify components:
- **v-badge**: Adds notification indicators or status dots
- **v-chip**: Integrates avatars in chip components with `left`/`right` props
- **v-btn**: Works within buttons for profile actions
- **v-list-item**: Prepend/append slots for list avatars
- **v-menu**: Dropdown menus triggered by avatar clicks
- **v-tooltip**: Hover information for avatar context

### 4. Size Control System
Multiple sizing approaches for different use cases:
- **size prop**: Single value for square aspect ratio (most common)
- **width/height props**: Override for non-square avatars
- **min/max props**: Responsive sizing constraints
- **Responsive sizing**: Works with Vuetify's display breakpoint system

### 5. Position Hints for Integration
The `left` and `right` props communicate positioning intent:
- **Component integration**: "Hooked into by components such as v-chip and v-btn"
- **Automatic spacing**: Parent components adjust spacing based on these props
- **Layout semantics**: Indicates whether avatar leads or trails content

### 6. Shape Flexibility
Control over avatar shape via border-radius:
- **rounded prop**: Custom border-radius values (sm, md, lg, xl, etc.)
- **tile prop**: Complete removal of border-radius for square avatars
- **Default circular**: Standard Material Design circular avatar

### 7. Color System Integration
Full integration with Vuetify's theming:
- **Material colors**: Semantic color names (primary, success, error, etc.)
- **CSS colors**: Hex, RGB, RGBA values
- **Theme-aware**: Adapts to light/dark theme modes
- **Dynamic colors**: Supports computed color values

### 8. Vue-Specific Patterns
Leverages Vue framework features:
- **Slots**: Default slot for content composition
- **Scoped slots**: Works with parent component scoped slots (v-list-item, v-menu)
- **v-bind/v-on**: Standard Vue directives for props and events
- **Reactivity**: Responsive to data changes for dynamic avatars

### 9. No Built-in Accessibility Attributes
Notable limitation:
- **No automatic alt text**: Must be added to child `v-img` component
- **No automatic ARIA labels**: Requires manual `aria-label` on avatar or parent
- **No role attribute**: Relies on semantic parent components for context

### 10. Minimal API Surface
Intentionally simple component:
- **Focused scope**: Size, shape, color, and content container
- **No state management**: Pure presentation component
- **No built-in interactions**: Click handlers added via Vue event listeners
- **Composition over configuration**: Complex features via component composition

## Research Notes

### Framework Approach
Vuetify adopts a **composition-focused** approach where:
- Avatar is a simple container enforcing aspect ratio and shape
- Complex features achieved through composition with other Vuetify components
- Tight integration with Vuetify's theming and color system
- Minimal API surface keeps component simple and focused

### API Design Philosophy
- **Slot-based content**: Default slot for maximum flexibility
- **Material Design alignment**: Props match Material Design specifications
- **Component integration**: Position hints (`left`/`right`) for parent components
- **Size consistency**: `size` prop enforces 1:1 aspect ratio by default
- **Override capability**: `width`/`height` props for non-standard cases

### Component Architecture
- **Pure presentation**: No internal state or logic
- **Container role**: Enforces dimensions and shape, delegates content to slot
- **Integration points**: `left`/`right` props signal positioning to parents
- **Composition hooks**: Works seamlessly with badges, chips, buttons, lists

### Material Design Patterns
1. **Circular by default**: Standard Material Design avatar shape
2. **Consistent sizing**: Enforced aspect ratio for visual consistency
3. **Color semantics**: Uses Material Design color palette
4. **Typography integration**: Text content styled with Vuetify typography classes
5. **Component composition**: Designed to work within Material Design layouts

### Vue Framework Integration
- **Default slot**: Content projection following Vue patterns
- **Scoped slots**: Works with parent component slot APIs
- **Reactivity**: Responsive to prop and data changes
- **Directives**: Standard Vue directives for events and attributes
- **Composition API**: Can be wrapped in composables for reusable logic

### State Management
- **Stateless component**: No internal state
- **Presentation only**: Parent components handle interactions
- **Data-driven**: Content and styling controlled by props and slot content
- **No built-in states**: Loading, disabled, active handled by parent or composition

### Customization Layers
1. **Props**: Size, color, shape, position hints
2. **Slots**: Content composition via default slot
3. **Classes**: Vuetify utility classes for spacing, typography, etc.
4. **CSS**: Custom styling via class or style attributes
5. **Theme**: Global color and styling via Vuetify theme configuration

## Comparison Insights

### Strengths
1. **Simplicity**: Minimal API, easy to understand and use
2. **Composition**: Excellent integration with other Vuetify components
3. **Flexibility**: Supports text, icons, images via slot
4. **Material Design**: Strong adherence to design system
5. **Size control**: Comprehensive sizing options
6. **Color system**: Full Vuetify theme integration
7. **Position hints**: Smart integration with chips and buttons

### Potential Limitations
1. **No accessibility props**: Must add ARIA attributes manually
2. **No built-in states**: Loading, disabled, active require custom implementation
3. **No avatar groups**: Stacking/overlapping requires custom CSS
4. **No presence indicators**: Status dots require badge composition
5. **No fallback prop**: Must implement image fallback logic manually
6. **No automatic initials**: Text content must be computed externally

### Patterns to Consider for Semantic UI

#### Adopt These Patterns
1. **size prop**: Single value for consistent aspect ratio is intuitive
2. **Slot-based content**: Maximum flexibility for different content types
3. **Position hints**: `left`/`right` props for parent component integration
4. **Shape control**: `rounded` and `tile` props for shape variations
5. **Color integration**: Direct theme color support
6. **Minimal API**: Keep core component simple, extend via composition

#### Improve Upon
1. **Accessibility built-in**: Add automatic alt text, ARIA label support
2. **Image fallback**: Built-in fallback to initials when image fails
3. **Status indicators**: Built-in presence/status indicator options
4. **Avatar groups**: Native stacking/overlapping support
5. **Initials generation**: Automatic initial extraction from name prop
6. **Loading state**: Built-in loading indicator option

#### Vue-Specific Patterns to Consider
1. **Scoped slot patterns**: Vuetify's use of scoped slots for composition
2. **Reactivity**: Vue's reactive props for dynamic avatar updates
3. **Directives**: Standard Vue event and attribute directives
4. **Component communication**: Parent-child prop passing patterns
5. **Computed properties**: For dynamic styling and content

### Questions for Semantic UI Design
1. **Content model**: Slots vs. props for text/icon/image content?
2. **Accessibility**: Built-in ARIA support or user responsibility?
3. **Image fallback**: Automatic fallback to initials or manual?
4. **Status indicators**: Built-in or compose with badge component?
5. **Avatar groups**: Native stacking support or CSS-only?
6. **Size system**: Single `size` prop or separate width/height?
7. **Shape control**: Preset shapes or flexible border-radius?
8. **Framework patterns**: Vue-specific vs. framework-agnostic?

## Implementation Details Worth Noting

### Component Props (v3 API)
```typescript
interface VAvatar {
  // Size control
  size?: string | number;        // Unified size (aspect 1:1)
  height?: string | number;      // Override height
  width?: string | number;       // Override width
  minHeight?: string | number;   // Minimum height
  maxHeight?: string | number;   // Maximum height
  minWidth?: string | number;    // Minimum width
  maxWidth?: string | number;    // Maximum width

  // Shape control
  rounded?: string | number | boolean;  // Border radius
  tile?: boolean;                       // Remove border radius

  // Styling
  color?: string;                // Background color

  // Position hints
  left?: boolean;                // Avatar on left side
  right?: boolean;               // Avatar on right side

  // Content (v3)
  icon?: string;                 // Direct icon rendering

  // Standard HTML attributes
  [key: string]: any;
}
```

### Slot Interface
```vue
<v-avatar>
  <!-- Default slot: accepts any content -->
  <template v-slot:default>
    <!-- Text, icons, images, or custom components -->
  </template>
</v-avatar>
```

### CSS Classes
Vuetify applies these classes:
```css
.v-avatar {
  /* Core avatar styling */
  align-items: center;
  border-radius: 50%;        /* Circular by default */
  display: inline-flex;
  justify-content: center;
  line-height: normal;
  overflow: hidden;
  position: relative;
  text-align: center;
  vertical-align: middle;
}

/* Tile variant */
.v-avatar.v-avatar--tile {
  border-radius: 0;
}

/* Size applied via inline style */
.v-avatar {
  height: var(--size);
  width: var(--size);
}
```

### Common Integration Patterns
```vue
<!-- Badge composition -->
<v-badge>
  <v-avatar />
</v-badge>

<!-- Chip composition -->
<v-chip>
  <v-avatar left />
  Content
</v-chip>

<!-- Button composition -->
<v-btn icon>
  <v-avatar />
</v-btn>

<!-- List item composition -->
<v-list-item>
  <template v-slot:prepend>
    <v-avatar />
  </template>
</v-list-item>
```

### Material Design Specifications
- **Default size**: Typically 40dp for list items, 48dp for standalone
- **Large avatar**: 64-96dp for profile headers
- **Small avatar**: 24-32dp for compact UIs
- **Shape**: Circular for user profiles, square for groups/entities
- **Color**: Background color when no image present

## Framework-Specific Observations

### Vue Integration Benefits
1. **Reactive props**: Avatar responds to data changes automatically
2. **Scoped slots**: Works with parent component slot APIs
3. **Directives**: Standard Vue event and attribute bindings
4. **Component composition**: Natural composition with other Vue components
5. **Template syntax**: Clean template integration

### Material Design Considerations
1. **Circle-first**: Material Design prefers circular avatars for users
2. **Size guidelines**: Material Design specifies avatar sizes for different contexts
3. **Color system**: Uses Material Design color palette
4. **Elevation**: Can combine with elevation classes for depth
5. **Typography**: Text content follows Material Design type scale

### Community Patterns
Based on Stack Overflow and community resources:
1. **Automatic color generation**: Hash user names to consistent colors
2. **Initial extraction**: Compute initials from full names
3. **Stacked avatars**: Negative margins for overlapping effect
4. **Presence indicators**: Badge dots for online/away/busy states
5. **Avatar uploaders**: File input integration for profile uploads
6. **Fallback handling**: Graceful degradation when images fail to load
