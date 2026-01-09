# Vuetify List Component - Usage Patterns Report

**Framework:** Vuetify (Vue.js)
**Component:** v-list (primary), v-list-item (sub-component)
**Version:** 3.x (Latest) / 2.x (Current LTS)
**Research Date:** 2025-11-05
**Documentation:** https://vuetifyjs.com/en/components/lists/

---

## 1. Component Overview

The Vuetify `v-list` component is a **Material Design-compliant container** for displaying organized, scannable information. Lists present content in a way that makes it easy to identify and interact with specific items in a collection.

Vuetify's list system is built on Material Design principles and provides a comprehensive hierarchy of sub-components for creating flexible, feature-rich list implementations across various use cases: navigation menus, data display, selection lists, and more.

**Core Philosophy:** Lists are semantic containers that organize content into scannable, actionable items with proper spacing, typography, and interaction patterns.

---

## 2. Component Architecture

### Primary Components

| Component | Purpose | Example |
|-----------|---------|---------|
| **v-list** | Main container that holds list items | Wrapper for all list content |
| **v-list-item** | Individual list entry or row | Single selectable/clickable item |
| **v-list-item-title** | Title text wrapper within item | Primary text content |
| **v-list-item-subtitle** | Subtitle text wrapper | Secondary/supporting text |
| **v-list-item-icon** | Icon container (v2) / Icon slot | Visual indicators |
| **v-list-item-media** | Media/image container (v3) | Avatar, thumbnail, etc. |
| **v-list-item-action** | Action container for buttons/checkboxes | Trailing action elements |
| **v-list-group** | Collapsible group of items | Expandable item sections |
| **v-list-subheader** | Section header/separator | Category or section label |
| **v-list-item-img** | Image display element | Inline image content |

### Component Hierarchy

```
v-list (container)
├── v-list-item (individual item)
│   ├── v-list-item-media (leading)
│   ├── v-list-item-content
│   │   ├── v-list-item-title (primary text)
│   │   └── v-list-item-subtitle (secondary text)
│   └── v-list-item-action (trailing)
├── v-list-subheader (section divider)
├── v-divider (visual separator)
└── v-list-group (collapsible section)
    └── v-list-item (nested items)
```

---

## 3. Basic Usage Patterns

### Simple Single-Line List

```vue
<v-list>
  <v-list-item
    v-for="item in items"
    :key="item.id"
    :title="item.title"
  />
</v-list>
```

**Explanation:** The most basic list displays items with a title only. Uses the `title` prop for binding item text.

### List with Titles and Subtitles (Two-Line)

```vue
<v-list lines="two">
  <v-list-item
    v-for="item in items"
    :key="item.id"
    :title="item.title"
    :subtitle="item.description"
  />
</v-list>
```

**Explanation:** The `lines="two"` prop creates two-line list items. Items have both title and subtitle with proper spacing and typography.

### Three-Line List

```vue
<v-list lines="three">
  <v-list-item
    v-for="item in items"
    :key="item.id"
    :title="item.title"
    :subtitle="item.description"
  >
    <template #prepend>
      <v-avatar color="primary">{{ item.initials }}</v-avatar>
    </template>
  </v-list-item>
</v-list>
```

**Explanation:** The `lines="three"` prop creates three-line items. Subtitles clamp vertically at 2 lines using CSS line-clamp, then ellipsis.

### List with Avatars/Images

```vue
<v-list>
  <v-list-item
    v-for="user in users"
    :key="user.id"
    :title="user.name"
  >
    <template #prepend>
      <v-avatar :src="user.avatar" />
    </template>
  </v-list-item>
</v-list>
```

**Explanation:** The `#prepend` slot (v3) or `#default` with icon/avatar (v2) adds leading content like avatars or icons.

### List with Trailing Actions

```vue
<v-list>
  <v-list-item
    v-for="item in items"
    :key="item.id"
    :title="item.title"
  >
    <template #append>
      <v-btn
        icon="mdi-delete"
        size="small"
        @click="deleteItem(item.id)"
      />
    </template>
  </v-list-item>
</v-list>
```

**Explanation:** The `#append` slot (v3) adds trailing actions like buttons, checkboxes, or menu triggers.

---

## 4. Line Variants (Content Density)

Vuetify lists support three main line variants that determine item height and text clamping:

### Single-Line (Default)

```vue
<v-list>
  <v-list-item title="Single line item" />
</v-list>
```

**Height:** ~48px (default)
**Use Case:** Compact lists with only titles
**Subtitle Behavior:** Not displayed; content would overflow

### Two-Line

```vue
<v-list lines="two">
  <v-list-item
    title="Title"
    subtitle="Supporting text"
  />
</v-list>
```

**Height:** ~64px
**Use Case:** Lists with titles and descriptions
**Subtitle Behavior:** Single line of text with ellipsis overflow

### Three-Line

```vue
<v-list lines="three">
  <v-list-item
    title="Title"
    subtitle="This is a longer subtitle that may span multiple lines but will clamp at 2 lines and then ellipsis."
  />
</v-list>
```

**Height:** ~80px
**Use Case:** Rich content lists with longer descriptions
**Subtitle Behavior:** Clamps at 2 lines vertically, then ellipsis overflow

**Note:** The three-line clamping uses CSS `line-clamp` which may not be supported in all older browsers.

---

## 5. Density Variants

Vuetify provides density control through the `density` prop to adjust spacing and visual weight:

### Default Density

```vue
<v-list density="default">
  <v-list-item title="Default spacing" />
</v-list>
```

**Spacing:** Normal padding and margins
**Use Case:** Standard UI layouts
**Padding:** 16px horizontal, 8px vertical (single-line)

### Comfortable Density

```vue
<v-list density="comfortable">
  <v-list-item title="More spacious" />
</v-list>
```

**Spacing:** Increased padding
**Use Case:** Touch-friendly interfaces, accessibility-focused UIs
**Padding:** 16px horizontal, 12px vertical

### Compact Density

```vue
<v-list density="compact">
  <v-list-item title="Tight spacing" />
</v-list>
```

**Spacing:** Reduced padding
**Use Case:** Space-constrained layouts, data tables, dense information displays
**Padding:** 16px horizontal, 4px vertical

### Dense Shorthand (v2)

```vue
<!-- Vuetify v2 syntax -->
<v-list dense>
  <v-list-item title="Compact item" />
</v-list>
```

**Note:** In Vuetify v3, `dense` has been replaced with `density="compact"`

---

## 6. Navigation Variant

The `nav` prop creates an alternative styling optimized for navigation use cases:

### Navigation List

```vue
<v-list nav>
  <v-list-item
    v-for="route in routes"
    :key="route.path"
    :to="route.path"
    :title="route.label"
  >
    <template #prepend>
      <v-icon :icon="route.icon" />
    </template>
  </v-list-item>
</v-list>
```

**Key Changes with `nav`:**
- **Width Reduction:** Items take up less horizontal space
- **Border Radius:** Rounded corners applied to items
- **Hover Effects:** Different visual feedback pattern
- **Active State:** Better highlighting for selected routes

### Navigation in Drawer

```vue
<template>
  <v-navigation-drawer>
    <v-list nav density="compact">
      <v-list-item
        v-for="item in navItems"
        :key="item.id"
        :to="item.path"
        :prepend-icon="item.icon"
        :title="item.title"
        link
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      navItems: [
        { id: 1, path: '/dashboard', icon: 'mdi-home', title: 'Dashboard' },
        { id: 2, path: '/users', icon: 'mdi-account', title: 'Users' },
        { id: 3, path: '/settings', icon: 'mdi-cog', title: 'Settings' }
      ]
    }
  }
}
</script>
```

**Common Pattern:** `nav` + `dense` or `density="compact"` creates compact navigation menus often used in sidebars and navigation drawers.

---

## 7. List Groups (Collapsible Sections)

The `v-list-group` component creates collapsible item sections, useful for hierarchical navigation and data organization:

### Basic List Group

```vue
<v-list>
  <v-list-group>
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        title="Expandable Section"
        prepend-icon="mdi-folder"
      />
    </template>

    <v-list-item
      v-for="item in subItems"
      :key="item.id"
      :title="item.title"
    />
  </v-list-group>
</v-list>
```

**Explanation:** The `#activator` slot defines the clickable/expandable header. Content within the group shows when expanded.

### Multi-Level Navigation with Groups

```vue
<v-list nav>
  <v-list-group>
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        title="Products"
        prepend-icon="mdi-shopping"
      />
    </template>

    <v-list-item
      v-for="product in products"
      :key="product.id"
      :title="product.name"
      @click="selectProduct(product)"
    />
  </v-list-group>

  <v-list-group>
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        title="Categories"
        prepend-icon="mdi-tag"
      />
    </template>

    <v-list-item
      v-for="category in categories"
      :key="category.id"
      :title="category.name"
    />
  </v-list-group>
</v-list>
```

### Group Props Control

```vue
<v-list-group
  value="active-group"
  eager
>
  <!-- Group is rendered/opened by default -->
</v-list-group>
```

**Key Props:**
- `value` - Programmatically control open/closed state
- `eager` - Render group content even when closed (performance consideration)
- `no-action` - Disable expand/collapse on click

---

## 8. Subheaders and Dividers

### Subheaders (Section Titles)

```vue
<v-list>
  <v-list-subheader>Fruits</v-list-subheader>

  <v-list-item title="Apple" />
  <v-list-item title="Banana" />
  <v-list-item title="Orange" />

  <v-list-subheader>Vegetables</v-list-subheader>

  <v-list-item title="Carrot" />
  <v-list-item title="Lettuce" />
</v-list>
```

**Purpose:** Organize list items into logical sections
**Styling:** Smaller font, secondary color, padding

### Dividers

```vue
<v-list>
  <v-list-item title="Item 1" />
  <v-list-item title="Item 2" />

  <v-divider />

  <v-list-item title="Item 3" />
  <v-list-item title="Item 4" />
</v-list>
```

**Purpose:** Visual separation between groups
**Styling:** Thin line separator, subtle styling

### Using Type Property (v3)

```vue
<v-list>
  <v-list-item type="subheader" title="Section A" />
  <v-list-item title="Item 1" />
  <v-list-item title="Item 2" />
  <v-list-item type="divider" />
  <v-list-item title="Item 3" />
</v-list>
```

**Explanation:** The `type` property can specify special item types (subheader, divider) inline.

---

## 9. Selection and Interaction Patterns

### Clickable/Selectable Items

```vue
<template>
  <v-list>
    <v-list-item
      v-for="item in items"
      :key="item.id"
      @click="selectItem(item)"
      :active="selectedId === item.id"
    >
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  data() {
    return {
      selectedId: null,
      items: [
        { id: 1, title: 'Item 1' },
        { id: 2, title: 'Item 2' }
      ]
    }
  },
  methods: {
    selectItem(item) {
      this.selectedId = item.id
    }
  }
}
</script>
```

**Key Props:**
- `active` - Highlight active/selected item
- `@click` - Handle item selection

### Multiple Selection with Checkboxes

```vue
<template>
  <v-list>
    <v-list-item
      v-for="item in items"
      :key="item.id"
      @click="toggleSelection(item.id)"
    >
      <template #prepend>
        <v-checkbox
          :model-value="selected.includes(item.id)"
          @click="toggleSelection(item.id)"
        />
      </template>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  data() {
    return {
      selected: [],
      items: [
        { id: 1, title: 'Item 1' },
        { id: 2, title: 'Item 2' }
      ]
    }
  },
  methods: {
    toggleSelection(id) {
      const index = this.selected.indexOf(id)
      if (index > -1) {
        this.selected.splice(index, 1)
      } else {
        this.selected.push(id)
      }
    }
  }
}
</script>
```

### Router Navigation Links

```vue
<v-list nav>
  <v-list-item
    v-for="route in routes"
    :key="route.path"
    :to="route.path"
    :title="route.label"
    :prepend-icon="route.icon"
  />
</v-list>
```

**Key Props:**
- `to` - Vue Router path (creates automatic active state)
- `href` - External link
- `link` - Makes item visually/functionally a link

---

## 10. Disabled Items

### Disabling Individual Items

```vue
<v-list>
  <v-list-item
    title="Available Item"
  />

  <v-list-item
    title="Disabled Item"
    disabled
  />

  <v-list-item
    title="Conditionally Disabled"
    :disabled="!isAdmin"
  />
</v-list>
```

**Styling:** Reduced opacity, grayed text, cursor: not-allowed
**Behavior:** Click events not fired, no hover effects

### Disable Entire List

```vue
<v-list disabled>
  <v-list-item title="All items disabled" />
</v-list>
```

---

## 11. Material Design Compliance

Vuetify's list implementation follows Material Design 3 specifications:

### Spacing Standards

| Element | Spacing |
|---------|---------|
| List item height (single-line) | 48dp |
| List item height (two-line) | 64dp |
| List item height (three-line) | 80dp or more |
| Text left padding | 16dp |
| Icon left padding | 16dp |
| Icon size | 24dp |
| Avatar size | 40dp |

### Typography

| Element | Style |
|---------|-------|
| Primary text (title) | Body (14-16sp) |
| Secondary text (subtitle) | Body Small (12-14sp) |
| Subheader | Label Medium (12sp) |
| Supporting text color | Medium emphasis (60% opacity) |

### Color and States

**Material Design States:**
- **Default:** Full opacity, no effects
- **Hover:** Subtle background color change
- **Active:** Highlight color, active indicator
- **Disabled:** 38% opacity, no interaction
- **Focus:** Focus ring indicator (keyboard navigation)

### Interaction Ripple

```vue
<!-- Vuetify applies Material Design ripple effect automatically -->
<v-list>
  <v-list-item title="Ripple effect on click" />
</v-list>
```

The ripple effect (ink splash animation) is applied automatically to interactive list items, following Material Design principles.

---

## 12. Expansion Panels Integration

Vuetify provides separate components for different use cases, but they can be integrated:

### Lists Inside Expansion Panels

```vue
<v-expansion-panels>
  <v-expansion-panel>
    <template #title>
      Panel Title
    </template>

    <v-card-text>
      <v-list>
        <v-list-item
          v-for="item in panelItems"
          :key="item.id"
          :title="item.title"
        />
      </v-list>
    </v-card-text>
  </v-expansion-panel>
</v-expansion-panels>
```

**Use Case:** Display list content that expands/collapses in accordion-style panels

### List Groups vs Expansion Panels

| Feature | List Group | Expansion Panel |
|---------|-----------|-----------------|
| **Purpose** | Navigation/Menu nesting | Content disclosure |
| **Expand Animation** | Quick reveal | Smooth accordion |
| **Visual Style** | List-like | Card-like |
| **Ideal For** | Navigation trees | FAQ, details, rich content |
| **Multiple Open** | Yes (by default) | No (by default, accordion) |

**Recommendation:** Use `v-list-group` for navigation structures and `v-expansion-panel` for rich content disclosure.

---

## 13. Data-Driven Lists

### Using Items Prop (v3)

```vue
<template>
  <v-list
    :items="items"
    item-title="name"
    item-value="id"
  >
    <template #item="{ item, props }">
      <v-list-item
        v-bind="props"
        :title="item.name"
        :subtitle="item.email"
      >
        <template #prepend>
          <v-avatar :src="item.avatar" />
        </template>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'user1.jpg' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'user2.jpg' }
      ]
    }
  }
}
</script>
```

**Key Props:**
- `items` - Array of data objects
- `item-title` - Property name for item title
- `item-value` - Property name for item value/id
- `#item` - Slot for custom item rendering

### Custom Filtering (v3)

```vue
<v-list
  :items="filteredItems"
  :search="searchQuery"
  @update:model-value="onSelect"
>
</v-list>
```

---

## 14. Advanced Styling Features

### Rounded Items

```vue
<v-list rounded="md">
  <v-list-item title="Rounded item" />
</v-list>
```

**Rounded Values:** `sm`, `md`, `lg`, `xl`, `pill`, or boolean

### Shaped Borders

```vue
<v-list>
  <v-list-item
    title="Item with shape"
    rounded="lg"
  />
</v-list>
```

### Custom Colors

```vue
<v-list>
  <v-list-item
    title="Colored item"
    bg-color="primary"
    text-color="white"
  />
</v-list>
```

### Hover Effects

```vue
<v-list>
  <v-list-item
    title="Hover item"
    hover
  />
</v-list>
```

---

## 15. Props & API Reference

### v-list Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `density` | `'compact' \| 'comfortable' \| 'default'` | `'default'` | Spacing density |
| `lines` | `'one' \| 'two' \| 'three'` | `'one'` | Number of content lines |
| `nav` | `boolean` | `false` | Navigation variant styling |
| `disabled` | `boolean` | `false` | Disable all items |
| `items` | `array` | `[]` | Data-driven items (v3) |
| `item-title` | `string` | `'title'` | Item title property name |
| `item-value` | `string` | `'value'` | Item value property name |
| `rounded` | `string \| boolean` | `false` | Border radius |
| `bg-color` | `string` | - | Background color |
| `color` | `string` | - | Text color |
| `hover` | `boolean` | `false` | Show hover effect |

### v-list-item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Item title text |
| `subtitle` | `string` | - | Item subtitle text |
| `prepend-icon` | `string` | - | Leading icon |
| `append-icon` | `string` | - | Trailing icon |
| `to` | `string \| object` | - | Vue Router destination |
| `href` | `string` | - | External link |
| `disabled` | `boolean` | `false` | Disable item |
| `active` | `boolean` | `false` | Active/selected state |
| `link` | `boolean` | `false` | Make item look like link |
| `slim` | `boolean` | `false` | Reduce spacing (v3) |
| `lines` | `string` | - | Override list lines |
| `bg-color` | `string` | - | Background color |
| `text-color` | `string` | - | Text color |

### v-list-item Slots

| Slot | Purpose |
|------|---------|
| `#prepend` | Leading content (icon, avatar) |
| `#append` | Trailing content (button, menu) |
| `#default` | Main content area |
| `#title` | Custom title rendering |
| `#subtitle` | Custom subtitle rendering |

### v-list-group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | - | Group identifier/state |
| `eager` | `boolean` | `false` | Pre-render group content |
| `no-action` | `boolean` | `false` | Disable expand/collapse |
| `fluid` | `boolean` | `false` | Full width (v3) |

---

## 16. Common Use Cases & Patterns

### User Account Menu

```vue
<v-list nav>
  <v-list-item title="Profile" prepend-icon="mdi-account" />
  <v-list-item title="Settings" prepend-icon="mdi-cog" />
  <v-divider />
  <v-list-item title="Logout" prepend-icon="mdi-logout" />
</v-list>
```

### File/Folder Browser

```vue
<v-list nav>
  <v-list-group v-for="folder in folders" :key="folder.id">
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        :title="folder.name"
        prepend-icon="mdi-folder"
      />
    </template>

    <v-list-item
      v-for="file in folder.files"
      :key="file.id"
      :title="file.name"
      prepend-icon="mdi-file"
    />
  </v-list-group>
</v-list>
```

### Data Table with Actions

```vue
<v-list>
  <v-list-item v-for="row in tableData" :key="row.id">
    <v-list-item-title>{{ row.name }}</v-list-item-title>
    <template #append>
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" size="small" v-bind="props" />
        </template>
        <v-list density="compact">
          <v-list-item title="Edit" @click="editRow(row)" />
          <v-list-item title="Delete" @click="deleteRow(row)" />
        </v-list>
      </v-menu>
    </template>
  </v-list-item>
</v-list>
```

### Settings Page with Groups

```vue
<v-list>
  <v-list-group>
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        title="Account Settings"
        prepend-icon="mdi-account"
      />
    </template>

    <v-list-item title="Email Address" />
    <v-list-item title="Password" />
    <v-list-item title="Two-Factor Authentication" />
  </v-list-group>

  <v-list-group>
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        title="Preferences"
        prepend-icon="mdi-palette"
      />
    </template>

    <v-list-item title="Theme" />
    <v-list-item title="Language" />
    <v-list-item title="Notifications" />
  </v-list-group>
</v-list>
```

### Checklist with Progress

```vue
<v-list>
  <v-list-item
    v-for="(task, index) in tasks"
    :key="index"
    :title="task.title"
  >
    <template #prepend>
      <v-checkbox
        :model-value="task.completed"
        @update:model-value="toggleTask(index)"
      />
    </template>
    <template #append>
      <v-progress-linear
        :model-value="task.progress"
        width="100"
      />
    </template>
  </v-list-item>

  <v-list-item title="Overall Progress">
    <template #append>
      <v-chip :text="`${overallProgress}%`" />
    </template>
  </v-list-item>
</v-list>
```

---

## 17. Comparison with Other Frameworks

### Vuetify vs Other Vue List Components

| Feature | Vuetify | Quasar | Bootstrap Vue |
|---------|---------|--------|---------------|
| **Material Design** | ✅ Native | ✅ Native | ⚠️ Partial |
| **Nested Groups** | ✅ v-list-group | ✅ Similar | ⚠️ Manual |
| **Line Variants** | ✅ One/Two/Three | ✅ Similar | ❌ No |
| **Dense Mode** | ✅ Yes | ✅ Yes | ⚠️ CSS |
| **Active States** | ✅ Automatic | ✅ Automatic | ⚠️ Manual |
| **Icons & Avatars** | ✅ Slots | ✅ Props | ⚠️ Manual |
| **Accessibility** | ✅ Good | ✅ Good | ✅ Good |

### Material Design Alignment

Vuetify's list component is explicitly designed to follow Material Design 3 specifications:
- **Typography:** Proper text hierarchy and sizing
- **Spacing:** Standard Material Design padding (16dp, 8dp, etc.)
- **Colors:** Semantic color system with opacity levels
- **Interactions:** Ripple effects, hover states, focus indicators
- **Density:** Material Design density variants (default, compact, comfortable)

---

## 18. Performance Considerations

### Virtual Scrolling for Long Lists

For lists with hundreds or thousands of items, consider using `v-virtual-scroll`:

```vue
<v-virtual-scroll
  :items="largeList"
  height="400"
  item-height="48"
>
  <template #default="{ item }">
    <v-list-item :title="item.title" />
  </template>
</v-virtual-scroll>
```

### Lazy Rendering

Use `eager: false` on list groups to defer rendering until expanded:

```vue
<v-list-group :eager="false">
  <!-- Content not rendered until expanded -->
</v-list-group>
```

### Dynamic List Updates

For reactive list updates:

```vue
<v-list>
  <v-list-item
    v-for="item in reactiveList"
    :key="item.id"
    :title="item.title"
  />
</v-list>
```

Use the `key` binding to ensure proper DOM updates on item changes.

---

## 19. Accessibility Features

### Keyboard Navigation

- **Tab:** Move focus between items
- **Enter/Space:** Activate item or expand group
- **Arrow Keys:** Navigate within list (not always auto-supported)

### ARIA Attributes

Vuetify automatically applies:
- `role="listitem"` on v-list-item
- `aria-label` for navigation items
- `aria-expanded` on collapsible groups
- `aria-disabled` on disabled items

### Semantic HTML

```vue
<!-- Semantic structure -->
<nav>
  <v-list nav>
    <v-list-item
      v-for="route in routes"
      :key="route.path"
      :to="route.path"
      :title="route.title"
    />
  </v-list>
</nav>
```

### Color Contrast

Vuetify lists use Material Design color contrast ratios:
- Text: 4.5:1 (AA compliance)
- Interactive elements: 3:1 minimum

---

## 20. Best Practices

### Do's

✅ **Use semantic components:** Choose `v-list-group` for navigation, `v-expansion-panel` for content disclosure

✅ **Provide clear labels:** Always include meaningful titles and subtitles

✅ **Use appropriate line variants:** Single-line for navigation, two-line for content, three-line for rich data

✅ **Include icons:** Visual indicators help with scannability

✅ **Test keyboard navigation:** Ensure lists are accessible via keyboard

✅ **Optimize performance:** Use virtual scrolling for large lists

✅ **Follow Material Design:** Respect spacing, typography, and interaction patterns

### Don'ts

❌ **Don't nest too deeply:** Keep navigation tree shallow (2-3 levels max)

❌ **Don't overload items:** Keep content concise and readable

❌ **Don't disable entire lists:** Consider hiding unavailable sections instead

❌ **Don't mix list and expansion panel:** Use appropriate component for use case

❌ **Don't ignore accessibility:** Always test with keyboard and screen readers

❌ **Don't ignore performance:** Monitor large lists for rendering issues

---

## 21. Troubleshooting Common Issues

### List Items Not Responding to Clicks

**Issue:** Click handlers not firing on items
**Solution:** Ensure the item has click handler or `to` prop:

```vue
<!-- Fix: Add to prop or @click -->
<v-list-item @click="handleClick" />
```

### Group Not Expanding

**Issue:** v-list-group not expanding on click
**Solution:** Ensure activator template is properly structured:

```vue
<!-- Correct: -->
<v-list-group>
  <template #activator="{ props }">
    <v-list-item v-bind="props" title="Click to expand" />
  </template>
  <!-- Group content -->
</v-list-group>
```

### Subtitles Being Cut Off

**Issue:** Two-line or three-line subtitles not showing properly
**Solution:** Ensure correct `lines` prop on list:

```vue
<!-- Fix: Add lines prop -->
<v-list lines="two">
  <v-list-item title="Title" subtitle="Subtitle" />
</v-list>
```

### Styling Not Applying

**Issue:** Custom CSS not affecting list items
**Solution:** Use proper Vuetify class scoping or CSS variables:

```vue
<!-- Use Vuetify props instead of custom CSS -->
<v-list-item bg-color="primary" text-color="white" />
```

---

## 22. Version-Specific Notes

### Vuetify v3 vs v2

| Feature | v3 | v2 |
|---------|----|----|
| **lines prop** | ✅ Native | ❌ N/A |
| **density prop** | ✅ Yes | `dense` boolean |
| **item-title/item-value** | ✅ String paths | ❌ N/A |
| **#prepend/#append slots** | ✅ Native | `v-list-item-icon`, `v-list-item-action` |
| **title/subtitle props** | ✅ Direct props | Manual slots |
| **Composition API** | ✅ Native | ⚠️ Partial |

### Migration from v2 to v3

Key changes:
- Replace `v-list-item-content` with default slot
- Replace `v-list-item-icon` with `#prepend` slot
- Replace `v-list-item-action` with `#append` slot
- Use `density` instead of `dense` boolean
- Use `lines` prop instead of manual height management

---

## Summary

Vuetify's `v-list` component provides a comprehensive, Material Design-compliant solution for displaying organized information in list format. Key strengths include:

**Strengths:**
- ✅ Native Material Design implementation
- ✅ Multiple line variants (1, 2, 3-line)
- ✅ Density control for spacing flexibility
- ✅ Built-in list groups for hierarchical content
- ✅ Navigation-optimized styling
- ✅ Excellent v3 API with modern slots
- ✅ Strong accessibility support
- ✅ Icon and avatar integration

**Best For:**
- Navigation menus and sidebars
- User account menus
- Settings pages with grouped options
- Data displays with mixed line content
- File/folder browsers
- Task lists and checklists
- Table row action menus

**Considerations:**
- Complex nested structures may become unwieldy
- Limited built-in search/filter (must be custom)
- Virtual scrolling requires separate `v-virtual-scroll` component
- Material Design aesthetic may not fit all design systems

---

## References

- **Official Documentation:** https://vuetifyjs.com/en/components/lists/
- **Vuetify v2 Docs:** https://v2.vuetifyjs.com/en/components/lists/
- **Vuetify GitHub:** https://github.com/vuetifyjs/vuetify
- **Material Design Lists:** https://m3.material.io/components/lists
- **Coding Beauty Tutorial:** https://codingbeautydev.com/blog/vuetify-list/

