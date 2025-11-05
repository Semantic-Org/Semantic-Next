# Accordion Component - Cross-Framework Pattern Research

> Research Date: 2025-11-05
> Frameworks Analyzed: Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Semantic UI Classic, Vuetify, PrimeReact

## Executive Summary

The Accordion component (also known as Collapse, Expansion Panels, or Disclosure) is a **universal UI pattern** found across all major frameworks. It provides expandable/collapsible content sections for organizing information in a space-efficient manner. All frameworks support single/multiple expansion modes, rich content, and accessibility features.

**Usage Level: 1 (Universal)** - 100% of frameworks provide dedicated accordion implementations

---

## Pattern Inventory

### 1. Expansion Behavior Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Single expansion mode | 100% (9/9) | All | Only one panel can be expanded at a time (accordion mode) |
| Multiple expansion mode | 100% (9/9) | All | Multiple panels can be expanded simultaneously |
| Controlled state | 100% (9/9) | All | Parent component controls expanded state |
| Uncontrolled state | 100% (9/9) | All | Component manages its own state internally |
| Default expanded panels | 100% (9/9) | All | Specify which panels are initially expanded |
| Collapsible in single mode | 89% (8/9) | All except MUI | Allow closing the active panel in single mode |

**Implementation Examples:**

**Ant Design - Single vs Multiple:**
```jsx
// Multiple expansion (default)
<Collapse defaultActiveKey={['1', '2']}>
  <Panel header="Section 1" key="1">Content</Panel>
  <Panel header="Section 2" key="2">Content</Panel>
</Collapse>

// Single expansion (accordion mode)
<Collapse accordion defaultActiveKey={['1']}>
  <Panel header="Section 1" key="1">Content</Panel>
  <Panel header="Section 2" key="2">Content</Panel>
</Collapse>
```

**Chakra UI - Controlled State:**
```jsx
const [value, setValue] = useState(["item-1"])

<Accordion.Root value={value} onValueChange={(e) => setValue(e.value)}>
  <Accordion.Item value="item-1">
    <Accordion.ItemTrigger>Item 1</Accordion.ItemTrigger>
    <Accordion.ItemContent>Content</Accordion.ItemContent>
  </Accordion.Item>
</Accordion.Root>
```

**Nuxt UI - Type Modes:**
```vue
<!-- Single mode -->
<Accordion type="single" :collapsible="true" v-model="activeItem">
  <AccordionItem value="1" label="Item 1">Content</AccordionItem>
</Accordion>

<!-- Multiple mode -->
<Accordion type="multiple" v-model="activeItems">
  <AccordionItem value="1" label="Item 1">Content</AccordionItem>
  <AccordionItem value="2" label="Item 2">Content</AccordionItem>
</Accordion>
```

---

### 2. Component Architecture Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Compound component structure | 100% (9/9) | All | Parent container + child items |
| Separate trigger/header component | 78% (7/9) | Chakra, HeroUI, Mantine, MUI, Nuxt, Vuetify, PrimeReact | Explicit header/trigger element |
| Separate content component | 78% (7/9) | Chakra, HeroUI, Mantine, MUI, Nuxt, Vuetify, PrimeReact | Explicit content wrapper |
| Single item component | 22% (2/9) | Ant Design, Semantic UI | Header and content in one component |

**Architecture Comparison:**

**Compound (Chakra UI v3):**
```jsx
<Accordion.Root>
  <Accordion.Item value="1">
    <Accordion.ItemTrigger>Header</Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>Content</Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
</Accordion.Root>
```

**Compound (MUI):**
```jsx
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    Header
  </AccordionSummary>
  <AccordionDetails>
    Content
  </AccordionDetails>
</Accordion>
```

**Simple (Ant Design):**
```jsx
<Collapse>
  <Panel header="Header" key="1">
    Content
  </Panel>
</Collapse>
```

---

### 3. Visual Variant Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Bordered variant | 78% (7/9) | Ant, HeroUI, Mantine, MUI, Semantic, Vuetify, PrimeReact | Border around items |
| Borderless/ghost variant | 67% (6/9) | Ant, Chakra, Mantine, MUI, Semantic, Vuetify | No visible borders |
| Filled/contained variant | 56% (5/9) | HeroUI, Mantine, Vuetify, PrimeReact, Semantic | Background fill on headers |
| Shadow variant | 44% (4/9) | HeroUI, MUI, Vuetify, PrimeReact | Elevation/shadow effects |
| Separated/split variant | 44% (4/9) | HeroUI, Mantine, Vuetify, PrimeReact | Visual spacing between items |
| Inset variant | 22% (2/9) | Vuetify, Semantic | Indented content appearance |
| Popout variant | 11% (1/9) | Vuetify | Elevated active panel |

**Visual Variant Examples:**

**HeroUI:**
```jsx
<Accordion variant="light">...</Accordion>      // Default, minimal
<Accordion variant="shadow">...</Accordion>     // With shadow
<Accordion variant="bordered">...</Accordion>   // With borders
<Accordion variant="splitted">...</Accordion>   // Separated items
```

**Mantine:**
```jsx
<Accordion variant="default">...</Accordion>    // Standard
<Accordion variant="contained">...</Accordion>  // Boxed items
<Accordion variant="filled">...</Accordion>     // Filled headers
<Accordion variant="separated">...</Accordion>  // Separated items
<Accordion variant="unstyled">...</Accordion>   // No default styles
```

---

### 4. Content Structure Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Text-only headers | 100% (9/9) | All | Simple string headers |
| Rich header content | 100% (9/9) | All | Icons, components, custom JSX in headers |
| Plain text content | 100% (9/9) | All | Simple text in panel content |
| Rich panel content | 100% (9/9) | All | Components, forms, nested elements |
| Header icons/indicators | 100% (9/9) | All | Leading or trailing icons |
| Custom expand indicators | 100% (9/9) | All | Customize chevron/arrow icons |
| Subtitle in header | 33% (3/9) | HeroUI, Nuxt, Vuetify | Secondary text in header |
| Start/prefix content | 44% (4/9) | HeroUI, Nuxt, Vuetify, Semantic | Leading content (avatars, icons) |
| Action buttons in header | 33% (3/9) | MUI, Vuetify, PrimeReact | AccordionActions/extra buttons |

**Rich Content Examples:**

**HeroUI - Subtitle and Start Content:**
```jsx
<AccordionItem
  title="Main Title"
  subtitle="Subtitle text"
  startContent={<Avatar src="avatar.png" />}
>
  Panel content
</AccordionItem>
```

**MUI - AccordionActions:**
```jsx
<Accordion>
  <AccordionSummary>Header</AccordionSummary>
  <AccordionDetails>Content</AccordionDetails>
  <AccordionActions>
    <Button>Cancel</Button>
    <Button>Save</Button>
  </AccordionActions>
</Accordion>
```

---

### 5. State & Interaction Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Disabled panels | 100% (9/9) | All | Prevent interaction with specific panels |
| Hover state | 100% (9/9) | All | Visual feedback on hover |
| Focus state | 100% (9/9) | All | Visual feedback for keyboard focus |
| Active/expanded state styling | 100% (9/9) | All | Visual indication of expanded panels |
| Click to expand/collapse | 100% (9/9) | All | Standard interaction |
| Hover to expand | 11% (1/9) | Semantic UI | Alternative trigger method |
| Readonly/non-interactive | 22% (2/9) | Vuetify, Nuxt | Display only, no interaction |
| Mandatory/always one open | 33% (3/9) | Vuetify, Nuxt, PrimeReact | At least one panel must be open |

**State Examples:**

**Disabled Items:**
```jsx
// Ant Design
<Panel header="Disabled" key="1" disabled>Content</Panel>

// HeroUI
<Accordion disabledKeys={["2", "3"]}>
  <AccordionItem key="1">Enabled</AccordionItem>
  <AccordionItem key="2">Disabled</AccordionItem>
</Accordion>

// Nuxt UI
{ value: '1', label: 'Item', disabled: true }
```

---

### 6. Animation & Transition Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Expand/collapse animation | 100% (9/9) | All | Height transitions on toggle |
| Configurable duration | 67% (6/9) | Ant, Mantine, MUI, Semantic, Vuetify, PrimeReact | Control animation speed |
| Disable animations | 56% (5/9) | Ant, Mantine, Semantic, Vuetify, PrimeReact | Turn off animations |
| Custom animations | 56% (5/9) | Ant, Chakra, Mantine, Semantic, MUI | CSS or JS-based customization |
| Indicator rotation | 100% (9/9) | All | Chevron rotates on expand/collapse |
| Fade transitions | 67% (6/9) | Chakra, HeroUI, Nuxt, MUI, Vuetify, PrimeReact | Content fades in/out |

**Animation Examples:**

**Semantic UI - Multiple Transition Types:**
```javascript
$('.ui.accordion').accordion({
  animate: true,
  duration: 500,
  // Supports: fade, slide down, scale, etc.
});
```

**Mantine - Duration Control:**
```jsx
<Accordion transitionDuration={500}>
  <Accordion.Item>...</Accordion.Item>
</Accordion>
```

---

### 7. Nested & Layout Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Nested accordions | 100% (9/9) | All | Accordions within accordion panels |
| Multiple instances on page | 100% (9/9) | All | Multiple independent accordions |
| Full-width layout | 100% (9/9) | All | Accordion spans container width |
| Custom width control | 100% (9/9) | All | Via CSS or container |
| Icon position (left/right) | 89% (8/9) | All except HeroUI | Control chevron placement |
| Dividers between items | 78% (7/9) | Ant, Chakra, Mantine, MUI, Nuxt, Vuetify, PrimeReact | Visual separation |

**Nested Accordion Example (Ant Design):**
```jsx
<Collapse>
  <Panel header="Parent 1" key="1">
    <Collapse>
      <Panel header="Child 1.1" key="1-1">Nested content</Panel>
      <Panel header="Child 1.2" key="1-2">Nested content</Panel>
    </Collapse>
  </Panel>
</Collapse>
```

---

### 8. Sizing & Spacing Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Responsive sizing | 100% (9/9) | All | Adapts to container |
| Size variants (sm/md/lg) | 44% (4/9) | Chakra, HeroUI, Mantine, Vuetify | Predefined size options |
| Custom padding | 100% (9/9) | All | Via CSS or style props |
| Compact mode | 44% (4/9) | HeroUI, Mantine, Vuetify, PrimeReact | Reduced spacing |
| Custom chevron size | 67% (6/9) | Chakra, HeroUI, Mantine, Nuxt, Vuetify, PrimeReact | Control icon size |

**Size Variants Example (Chakra UI):**
```jsx
<Accordion.Root size="sm">...</Accordion.Root>  // Small
<Accordion.Root size="md">...</Accordion.Root>  // Medium (default)
<Accordion.Root size="lg">...</Accordion.Root>  // Large
```

---

### 9. Performance & Rendering Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Lazy rendering | 44% (4/9) | Ant, Nuxt, Vuetify, PrimeReact | Don't render closed panels |
| Unmount on collapse | 33% (3/9) | Ant, Nuxt, Vuetify | Remove from DOM when closed |
| Keep content mounted | 67% (6/9) | Chakra, HeroUI, Mantine, MUI, Semantic, PrimeReact | Content hidden with CSS |
| Eager rendering | 56% (5/9) | MUI, Semantic, Chakra, HeroUI, Mantine | All content rendered upfront |
| Virtual scrolling | 11% (1/9) | Vuetify | For large lists of panels |

**Performance Control Examples:**

**Ant Design:**
```jsx
<Collapse destroyInactivePanel={true}>
  <Panel>Content removed from DOM when collapsed</Panel>
</Collapse>
```

**Nuxt UI:**
```vue
<Accordion :unmount-on-hide="true">
  <!-- Content unmounted when hidden -->
</Accordion>
```

---

### 10. Accessibility Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| ARIA roles & attributes | 100% (9/9) | All | role="region", aria-expanded, aria-controls |
| Keyboard navigation (Tab) | 100% (9/9) | All | Tab between headers |
| Keyboard navigation (Arrow keys) | 100% (9/9) | All | Navigate between panels |
| Keyboard activation (Enter/Space) | 100% (9/9) | All | Expand/collapse with keyboard |
| Home/End key support | 78% (7/9) | Chakra, Mantine, MUI, Nuxt, Semantic, Vuetify, PrimeReact | Jump to first/last panel |
| Screen reader support | 100% (9/9) | All | Announces state changes |
| Focus management | 100% (9/9) | All | Proper focus handling |
| Semantic heading elements | 89% (8/9) | All except Ant | Use <h2>, <h3>, etc. for headers |

**ARIA Implementation (Common Pattern):**
- `role="region"` on content panels
- `aria-expanded="true/false"` on headers
- `aria-controls="panel-id"` linking header to content
- `aria-labelledby="header-id"` on content
- `aria-disabled="true"` on disabled items

**Keyboard Navigation Standard:**
- **Tab**: Move focus to next accordion header
- **Shift+Tab**: Move focus to previous header
- **Enter/Space**: Toggle focused panel
- **Arrow Down/Up**: Navigate between headers
- **Home**: Focus first header
- **End**: Focus last header

---

### 11. Dynamic Content & Data Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Dynamic panel generation | 100% (9/9) | All | Map over data to create panels |
| Add panels at runtime | 89% (8/9) | All except MUI | Dynamically add new panels |
| Remove panels at runtime | 89% (8/9) | All except MUI | Dynamically remove panels |
| AJAX/async content loading | 44% (4/9) | Semantic, Vuetify, PrimeReact, Chakra | Load content on expand |
| Search/filter panels | 33% (3/9) | MUI, Vuetify, PrimeReact | Filter visible panels |
| Drag-and-drop reordering | 22% (2/9) | Nuxt, Vuetify | Reorder panels via drag |

**Dynamic Content Example (Semantic UI):**
```javascript
$('.ui.accordion').accordion({
  onOpen: function() {
    const $content = $(this);
    // Load content via AJAX when panel opens
    $.get('/api/content', function(data) {
      $content.html(data);
    });
  }
});
```

---

### 12. Callback & Event Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| onChange/onValueChange | 100% (9/9) | All | Fired when expansion state changes |
| onExpand callback | 78% (7/9) | Ant, Chakra, MUI, Semantic, Vuetify, PrimeReact, Nuxt | When panel opens |
| onCollapse callback | 78% (7/9) | Ant, Chakra, MUI, Semantic, Vuetify, PrimeReact, Nuxt | When panel closes |
| Before/after callbacks | 44% (4/9) | Semantic, Vuetify, PrimeReact, Ant | onOpening, onOpen, onClosing, onClose |
| Event object with details | 89% (8/9) | All except Semantic | Provides context (index, value, etc.) |

**Event Handling Examples:**

**PrimeReact:**
```jsx
<Accordion onTabChange={(e) => {
  console.log(e.index); // Active index(es)
}}>
  <AccordionTab>...</AccordionTab>
</Accordion>
```

**Semantic UI:**
```javascript
$('.ui.accordion').accordion({
  onOpening: function() { console.log('Opening...'); },
  onOpen: function() { console.log('Opened'); },
  onClosing: function() { console.log('Closing...'); },
  onClose: function() { console.log('Closed'); }
});
```

---

### 13. Styling & Theming Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Theme integration | 100% (9/9) | All | Respects framework theme |
| Custom className | 100% (9/9) | All | Add custom CSS classes |
| Inline styles | 100% (9/9) | All | style prop support |
| CSS-in-JS styling | 78% (7/9) | Chakra, HeroUI, Mantine, MUI, Nuxt, Vuetify, PrimeReact | sx prop or styled API |
| Style parts individually | 89% (8/9) | All except Semantic | Separate header/content styling |
| Color customization | 89% (8/9) | All except Semantic | Custom colors for items |
| Dark mode support | 100% (9/9) | All | Adapts to dark themes |

**Styling Examples:**

**MUI - sx Prop:**
```jsx
<Accordion sx={{ bgcolor: 'grey.100', mb: 2 }}>
  <AccordionSummary sx={{ '& .MuiAccordionSummary-content': { margin: 0 } }}>
    Header
  </AccordionSummary>
</Accordion>
```

**Chakra UI - Style Props:**
```jsx
<Accordion.Root>
  <Accordion.Item bg="gray.50" borderRadius="md">
    <Accordion.ItemTrigger px={4} py={3}>Header</Accordion.ItemTrigger>
  </Accordion.Item>
</Accordion.Root>
```

---

### 14. Integration & Composition Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| With forms | 100% (9/9) | All | Accordion containing form fields |
| With tabs | 67% (6/9) | Ant, Mantine, MUI, Semantic, Vuetify, PrimeReact | Accordion + tab combinations |
| With modals/dialogs | 56% (5/9) | Chakra, Mantine, MUI, Semantic, Vuetify | Accordion inside dialogs |
| With drawers/sidebars | 56% (5/9) | Ant, Chakra, MUI, Semantic, Vuetify | Navigation patterns |
| With data tables | 33% (3/9) | MUI, Vuetify, PrimeReact | Expandable rows |
| With menus | 33% (3/9) | Semantic, Vuetify, Ant | Menu-based navigation |
| With cards | 44% (4/9) | Chakra, HeroUI, MUI, PrimeReact | Card-style panels |

---

## Framework Comparison Table

| Feature | Ant | Chakra | Hero | Mantine | MUI | Nuxt | Semantic | Vuetify | Prime |
|---------|-----|--------|------|---------|-----|------|----------|---------|-------|
| **Single expansion** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Multiple expansion** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Collapsible** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Disabled items** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Nested accordions** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Rich header content** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Action buttons** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Lazy rendering** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Visual variants** | 3 | 2 | 4 | 5 | 3 | 1 | 4 | 6 | 4 |
| **Size options** | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Hover trigger** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Animation control** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **ARIA support** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Keyboard nav** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Component Naming Across Frameworks

| Framework | Primary Name | Alternative Names | Notes |
|-----------|--------------|-------------------|-------|
| Ant Design | Collapse | Panel | Panel is the child component |
| Chakra UI | Accordion | - | v3 uses compound structure |
| HeroUI | Accordion | AccordionItem | - |
| Mantine | Accordion | - | Item, Control, Panel subcomponents |
| MUI | Accordion | - | Summary, Details, Actions subcomponents |
| Nuxt UI | Accordion | - | Built on Reka UI primitives |
| Semantic UI | Accordion | - | Module in classic Semantic |
| Vuetify | Expansion Panels | v-expansion-panel | Vue-specific naming |
| PrimeReact | Accordion | AccordionTab | Tab is the child component |

---

## Common Use Cases Across All Frameworks

1. **FAQ Pages** - Questions as headers, answers as content
2. **Settings Panels** - Grouped configuration options
3. **Documentation** - Organized content sections
4. **Features Lists** - Expandable feature descriptions
5. **Multi-step Forms** - Form divided into logical sections
6. **Product Details** - Specifications, reviews, shipping
7. **Navigation Menus** - Collapsible menu categories
8. **Hierarchical Data** - Nested information structures
9. **Content Filtering** - Show/hide filtered content
10. **Timeline/History** - Expandable historical entries

---

## Best Practices (Cross-Framework Consensus)

### Accessibility
1. Always provide meaningful header text
2. Use semantic heading elements when appropriate
3. Ensure keyboard navigation works (Tab, Enter, Space, Arrows)
4. Test with screen readers
5. Maintain proper ARIA attributes (automatically handled by frameworks)

### UX Design
1. Use single expansion for focused workflows (wizards, tutorials)
2. Use multiple expansion for comparison scenarios (settings, features)
3. Keep header text concise and scannable
4. Provide visual feedback for hover, focus, and active states
5. Consider default expanded state for important content

### Performance
1. Use lazy rendering for large accordions with heavy content
2. Consider unmounting closed panels for memory efficiency
3. Avoid nesting too deeply (max 2-3 levels)
4. Use virtual scrolling for very long lists (Vuetify)

### Content Structure
1. Keep panel content concise and focused
2. Use rich headers to provide context (icons, subtitles)
3. Consider action buttons for actionable panels (MUI pattern)
4. Ensure content is responsive and mobile-friendly

---

## Unique Features by Framework

### Ant Design
- **destroyInactivePanel**: Unmount content from DOM when collapsed
- **Ghost variant**: Borderless, minimal styling
- **Extra header content**: Additional elements in header area

### Chakra UI
- **Compound v3 structure**: Highly composable API
- **ItemIndicator**: Separate component for expand indicator
- **Size variants**: sm, md, lg sizing options

### HeroUI
- **Subtitle support**: Built-in secondary header text
- **Start content**: Leading avatars/icons
- **Splitted variant**: Distinct separated styling

### Mantine
- **5 visual variants**: Most variant options
- **Chevron position**: Left or right placement
- **Heading wrapping**: Automatic h2-h6 wrapping for accessibility

### MUI
- **AccordionActions**: Dedicated footer for action buttons
- **Material elevation**: Shadow depth control
- **TransitionComponent**: Custom transition components
- **Square prop**: Remove border radius

### Nuxt UI
- **Reka UI integration**: Built on accessible primitives
- **MDC support**: Markdown rendering in content
- **Drag-and-drop**: Via VueUse sortable integration
- **Item-specific slots**: Named slots per item

### Semantic UI
- **Hover trigger**: Open on hover instead of click
- **Multiple transition types**: fade, slide, scale, etc.
- **Progressive enhancement**: Works without JavaScript
- **Delegated events**: Efficient event handling

### Vuetify
- **6 visual variants**: Inset, popout, flat, accordion, etc.
- **Virtual scrolling**: For large lists
- **Mandatory prop**: Force at least one panel open
- **Readonly state**: Display only, no interaction

### PrimeReact
- **PassThrough API**: Granular DOM customization
- **Header template**: Complete header customization
- **Multiple style props**: headerClassName, contentClassName, etc.
- **Tab-based API**: AccordionTab component model

---

## Anti-Patterns to Avoid

1. **Overly deep nesting** - More than 3 levels becomes confusing
2. **Too many panels** - Consider pagination or infinite scroll
3. **Critical content hidden by default** - Important info should be visible
4. **No visual indication of expandability** - Always show chevron/indicator
5. **Disabling keyboard navigation** - Essential for accessibility
6. **Auto-expanding without user action** - Breaks user expectations
7. **Inconsistent expand/collapse behavior** - Stick to one pattern
8. **Heavy content without lazy loading** - Impacts initial load performance

---

## Migration Considerations

When moving between frameworks:

1. **API Structure**: Check if compound (Chakra, MUI) or simple (Ant, Semantic)
2. **Controlled State**: Verify prop names (value, activeIndex, expanded, etc.)
3. **Event Handling**: Different callback names across frameworks
4. **Visual Variants**: Map variants between frameworks (some are equivalent)
5. **Accessibility**: Most handle automatically, but verify keyboard navigation
6. **Performance**: Check unmount/lazy rendering options

**Example Migration (Ant → MUI):**
```jsx
// Ant Design
<Collapse accordion defaultActiveKey={['1']} onChange={handleChange}>
  <Panel header="Header" key="1">Content</Panel>
</Collapse>

// MUI Equivalent
<Accordion defaultExpanded={false} onChange={handleChange}>
  <AccordionSummary>Header</AccordionSummary>
  <AccordionDetails>Content</AccordionDetails>
</Accordion>
```

---

## Framework-Specific Prop Comparison

### Expansion Control Props

| Framework | Single Mode | Multiple Mode | Controlled | Default Open |
|-----------|-------------|---------------|------------|--------------|
| Ant | `accordion` | (default) | `activeKey` + `onChange` | `defaultActiveKey` |
| Chakra | (default) | `multiple` | `value` + `onValueChange` | `defaultValue` |
| HeroUI | `selectionMode="single"` | `selectionMode="multiple"` | `selectedKeys` + `onSelectionChange` | `defaultSelectedKeys` |
| Mantine | (default) | `multiple` | `value` + `onChange` | `defaultValue` |
| MUI | (default) | (multiple instances) | `expanded` + `onChange` | `defaultExpanded` |
| Nuxt | `type="single"` | `type="multiple"` | `v-model` | `default-value` |
| Semantic | `exclusive: true` | `exclusive: false` | JS API | `active` in markup |
| Vuetify | `accordion` | (default) | `v-model` | `v-model` |
| PrimeReact | (default) | `multiple` | `activeIndex` + `onTabChange` | `activeIndex` |

---

## Testing Recommendations

### Unit Testing
- Test controlled/uncontrolled modes
- Verify keyboard navigation
- Test disabled state handling
- Validate ARIA attributes
- Test callbacks/events

### Integration Testing
- Test with forms and validation
- Test nested accordion behavior
- Test dynamic content loading
- Verify theme integration

### Accessibility Testing
- Keyboard-only navigation
- Screen reader announcements
- Focus management
- Color contrast
- Touch target sizes (mobile)

---

## Research Metadata

**Frameworks Analyzed:** 9
**Total Patterns Identified:** 100+
**Documentation Quality:** All frameworks provide comprehensive docs
**Common Standards:** WAI-ARIA Authoring Practices for Disclosure/Accordion
**Research Date:** 2025-11-05
**Research Scope:** Official documentation, examples, API references

---

## Related Components

Across frameworks, these components are frequently mentioned alongside Accordion:

1. **Tabs** - Alternative content organization pattern
2. **Collapse/Disclosure** - Single collapsible section
3. **Drawer/Sidebar** - Offscreen collapsible panels
4. **Modal/Dialog** - Overlay content containers
5. **Dropdown/Menu** - Collapsible navigation
6. **Card** - Content containers
7. **Panel/Paper** - Container components
8. **List** - Structured data display

---

## Conclusion

The Accordion component is a **universal pattern** with exceptional consistency across all major frameworks. Key findings:

1. **100% Framework Support** - All 9 frameworks provide dedicated implementations
2. **Consistent Core API** - Single/multiple expansion modes are standard
3. **Rich Accessibility** - All frameworks implement WAI-ARIA patterns
4. **Flexible Architecture** - Both simple and compound component structures work well
5. **Visual Variety** - 3-6 variants per framework (bordered, filled, shadow, etc.)
6. **Performance Options** - 44% support lazy rendering/unmounting
7. **Excellent Documentation** - All frameworks provide comprehensive guides

**Recommendation for Semantic UI Next:**
- Support both single and multiple expansion modes
- Provide 4-5 visual variants (bordered, ghost, filled, separated, unstyled)
- Include lazy rendering option for performance
- Ensure full keyboard navigation and ARIA support
- Consider compound component structure for flexibility
- Support rich header content and action buttons
- Provide size variants (sm, md, lg) for flexibility

The accordion pattern is mature, standardized, and well-understood across the ecosystem.
