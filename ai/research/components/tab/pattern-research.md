# Component Pattern Research: Tabs

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 11
- Date: 2025-11-05
- Unique patterns identified: 55+
- Research coverage: Ant Design, Chakra UI, Mantine, MUI, PrimeReact, Semantic UI Classic, Vuetify, HeroUI, Nuxt UI, ShadCN, Radix UI

## Component Definition Consensus

Tabs components solve the fundamental problem of **organizing related content into separate views within the same container**. They provide:

- **Space efficiency** by showing one view at a time in a constrained area
- **Content organization** through labeled navigation between related panels
- **Cognitive clarity** by grouping related information into distinct sections
- **Progressive disclosure** hiding complexity until users explicitly request it

**Mental Models:**
- **Filing Cabinet** (most common): Tabs as labeled dividers organizing documents
- **Multi-page Document**: Each tab represents a different page of the same document
- **Switcher**: Toggle between mutually exclusive views
- **Navigation**: Tabs as a specialized navigation pattern for related content

**Universal Characteristics:**
- Two-part structure: Tab controls (navigation) + Tab panels (content)
- One active tab at a time (mutually exclusive)
- Click or keyboard interaction to switch
- Visual indicator showing active tab

## Terminology Variations

### Component Names
- **Tabs**: Ant Design, Chakra UI (v2), Mantine, MUI, Vuetify, HeroUI, Nuxt UI, ShadCN, Radix UI (11/11 = 100%)
- **Tab**: Semantic UI Classic (singular form)
- **TabView**: PrimeReact (specialized name)

### Sub-Component Structure
**Composition-Based (7/11 = 64%):**
- **Tabs + Tab + TabPanel**: MUI, Chakra v3, Radix UI
- **Tabs.Root + Tabs.List + Tabs.Trigger + Tabs.Content**: Radix UI, ShadCN
- **Tabs + TabList + Tab + TabPanels + TabPanel**: Chakra v2
- **v-tabs + v-tab + v-tab-item**: Vuetify

**Single Component (4/11 = 36%):**
- **Tabs** (with items prop): Ant Design, Mantine, HeroUI, Nuxt UI
- **TabView + TabPanel**: PrimeReact
- **Tab module**: Semantic UI (jQuery module)

### Tab Positioning Terms
- **top**: Default (11/11 = 100%)
- **bottom**: Footer tabs (7/11 = 64%)
- **left**: Vertical left (8/11 = 73%)
- **right**: Vertical right (8/11 = 73%)
- **start/end**: i18n-friendly (2/11 = 18%)

## Pattern Inventory

### Core Structural Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Tab list + panels | Two-part structure | 11/11 (100%) | Level 1 | All |
| Single active tab | Mutually exclusive views | 11/11 (100%) | Level 1 | All |
| Click to switch | Tab selection on click | 11/11 (100%) | Level 1 | All |
| Labeled tabs | Text labels for tabs | 11/11 (100%) | Level 1 | All |
| Semantic HTML | Proper ARIA roles | 11/11 (100%) | Level 1 | All |

### Tab Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Line/underlined tabs | Default with underline | 11/11 (100%) | Level 1 | All |
| Card tabs | Bordered/boxed style | 6/11 (55%) | Level 2 | Ant, Chakra (enclosed), MUI, PrimeReact, Semantic, Vuetify |
| Pill tabs | Rounded button style | 5/11 (45%) | Level 3 | Chakra, Mantine (pills), HeroUI, Nuxt (default), custom |
| Button tabs | Button-like appearance | 3/11 (27%) | Level 3 | Ant (button), Chakra (enclosed), custom |
| Borderless/plain | Minimal styling | 4/11 (36%) | Level 3 | Chakra (unstyled), Radix (unstyled), ShadCN, Semantic |

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Text labels | Plain text tab labels | 11/11 (100%) | Level 1 | All |
| Icons with text | Icon + label combo | 11/11 (100%) | Level 1 | All |
| Icon-only tabs | Icons without labels | 9/11 (82%) | Level 1 | All except Semantic, PrimeReact TabView |
| Badges/counts | Notification badges | 7/11 (64%) | Level 2 | Ant, Chakra, MUI, HeroUI, Nuxt, Vuetify, custom |
| Avatars | Profile images in tabs | 3/11 (27%) | Level 3 | Nuxt, HeroUI, custom |
| Custom content | Complex tab headers | 10/11 (91%) | Level 1 | All except Semantic |
| Rich panel content | Any React/HTML in panels | 11/11 (100%) | Level 1 | All |

### Layout & Positioning Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|----------||
| Horizontal (top) | Default layout | 11/11 (100%) | Level 1 | All |
| Vertical (left/right) | Side-positioned tabs | 9/11 (82%) | Level 1 | All except Semantic, PrimeReact |
| Bottom tabs | Footer positioning | 7/11 (64%) | Level 2 | Ant, Chakra, MUI, Radix, ShadCN, Vuetify, Semantic |
| Centered tabs | Centered alignment | 8/11 (73%) | Level 2 | Ant, Chakra, MUI, Mantine, HeroUI, Nuxt, Vuetify, Radix |
| Full-width tabs | Tabs span container | 8/11 (73%) | Level 2 | Ant, Chakra, Mantine, MUI, HeroUI, Nuxt, Vuetify, PrimeReact |
| Scrollable tabs | Overflow handling | 10/11 (91%) | Level 1 | All except Semantic |
| Fitted tabs | Equal-width tabs | 6/11 (55%) | Level 2 | Chakra, Mantine, HeroUI, Nuxt, Vuetify, MUI |

### Interactive Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Keyboard navigation | Arrow keys, Tab, Enter | 11/11 (100%) | Level 1 | All |
| Disabled tabs | Non-interactive tabs | 11/11 (100%) | Level 1 | All |
| Editable tabs | Add/remove tabs | 2/11 (18%) | Level 4 | Ant Design, dynamic patterns |
| Draggable tabs | Reorder via drag | 1/11 (9%) | Level 5 | Ant Design |
| Closable tabs | Remove tab button | 2/11 (18%) | Level 4 | Ant Design, PrimeReact |
| Manual activation | Activate on Enter/Space | 4/11 (36%) | Level 3 | Radix, ShadCN, Chakra, HeroUI |
| Automatic activation | Activate on focus | 8/11 (73%) | Level 2 | Most (Radix default, others) |

### State Management Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Controlled mode | Parent manages state | 11/11 (100%) | Level 1 | All |
| Uncontrolled mode | Internal state | 11/11 (100%) | Level 1 | All |
| Default active tab | Initial selection | 11/11 (100%) | Level 1 | All |
| onChange callback | Selection change event | 11/11 (100%) | Level 1 | All |
| Active key/value | Identifier for active tab | 11/11 (100%) | Level 1 | All |

### Content Loading Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Lazy loading | Load on first view | 7/11 (64%) | Level 2 | Chakra, MUI, Radix, ShadCN, HeroUI, Vuetify, Ant |
| Eager loading | Load all at mount | 11/11 (100%) | Level 1 | All (default behavior) |
| keepMounted | Keep inactive panels in DOM | 5/11 (45%) | Level 3 | Chakra, Mantine, HeroUI, Radix, ShadCN |
| Unmount inactive | Remove from DOM when inactive | 6/11 (55%) | Level 2 | Ant, MUI, PrimeReact, Nuxt, Vuetify, HeroUI |
| Remote content | Load panel content from API | 2/11 (18%) | Level 4 | Semantic UI, custom implementations |

### Visual Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Size variants | Small/default/large | 8/11 (73%) | Level 2 | Ant, Chakra, Mantine, MUI, HeroUI, Nuxt, Vuetify, Semantic |
| Color themes | Semantic colors | 7/11 (64%) | Level 2 | Chakra, MUI, HeroUI, Nuxt, Vuetify, PrimeReact, custom |
| Custom indicators | Active tab marker | 6/11 (55%) | Level 2 | Ant, MUI, HeroUI, Nuxt, Vuetify, custom |
| Animated transitions | Smooth panel switching | 8/11 (73%) | Level 2 | Chakra, MUI, HeroUI, Nuxt, Vuetify, Radix (via CSS), custom |
| Density control | Compact/comfortable spacing | 4/11 (36%) | Level 3 | Ant, MUI, Vuetify, HeroUI |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| ARIA roles | role="tablist/tab/tabpanel" | 11/11 (100%) | Level 1 | All |
| aria-selected | Selection state | 11/11 (100%) | Level 1 | All |
| aria-controls | Panel association | 11/11 (100%) | Level 1 | All |
| aria-labelledby | Reverse association | 11/11 (100%) | Level 1 | All |
| Keyboard navigation | Full arrow key support | 11/11 (100%) | Level 1 | All |
| Focus management | Roving tabindex | 10/11 (91%) | Level 1 | All except Semantic |
| Screen reader support | Descriptive labels | 11/11 (100%) | Level 1 | All |
| Home/End keys | Jump to first/last | 9/11 (82%) | Level 1 | All except Semantic, PrimeReact |

### Router Integration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| URL-based tabs | Sync with browser URL | 6/11 (55%) | Level 2 | Semantic (history), MUI, Vuetify, HeroUI, Nuxt, Chakra |
| Hash navigation | URL hash for tabs | 3/11 (27%) | Level 3 | Semantic, custom implementations |
| Path-based routing | Full path routing | 5/11 (45%) | Level 3 | MUI (React Router), Vuetify (Vue Router), HeroUI, Nuxt |
| Browser history | Back/forward support | 2/11 (18%) | Level 4 | Semantic (HTML5 history), custom |

### Advanced Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Nested tabs | Tabs within tabs | 6/11 (55%) | Level 2 | Ant, Chakra, MUI, Vuetify, HeroUI, Semantic |
| Dynamic tabs | Add/remove at runtime | 8/11 (73%) | Level 2 | Ant, Chakra, MUI, PrimeReact, HeroUI, Nuxt, Vuetify, Radix |
| Tab overflow | Handle many tabs | 10/11 (91%) | Level 1 | All except Semantic |
| Dropdown overflow | Overflow menu | 3/11 (27%) | Level 3 | Ant, custom implementations |
| Scrollable content | Scroll to view tabs | 9/11 (82%) | Level 1 | All except Semantic, PrimeReact |
| Sticky tabs | Fixed position on scroll | 2/11 (18%) | Level 4 | MUI, custom |
| Loading states | Panel loading indicators | 5/11 (45%) | Level 3 | Ant, Semantic, custom implementations |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
- **Two-Part Structure**: Tab navigation + content panels
- **Single Active Tab**: Mutually exclusive views
- **Click to Switch**: Primary interaction
- **Text Labels**: Basic labeling
- **Controlled/Uncontrolled**: Both state modes
- **Default Active Tab**: Initial selection
- **onChange Callback**: Selection events
- **Full ARIA Support**: Complete accessibility
- **Keyboard Navigation**: Arrow keys required
- **Line/Underlined Style**: Default visual treatment
- **Rich Panel Content**: Any content supported
- **Disabled Tabs**: Non-interactive states

**Nearly Universal (73-91% adoption):**
- **Icon-Only Tabs**: Visual-only navigation (82%)
- **Vertical Layout**: Side positioning (82%)
- **Scrollable Tabs**: Overflow handling (91%)
- **Centered Tabs**: Center alignment (73%)
- **Full-Width Tabs**: Container spanning (73%)
- **Size Variants**: Multiple sizes (73%)
- **Animated Transitions**: Smooth switching (73%)
- **Dynamic Tabs**: Runtime manipulation (73%)
- **Nested Tabs**: Hierarchical organization (55% - borders on Level 2)
- **Custom Content**: Complex headers (91%)

### Emerging Patterns (Level 3-4)

**Moderate Adoption (36-64%):**
- **Card/Boxed Tabs**: Bordered style (55%)
- **Badges/Counts**: Notifications (64%)
- **Bottom Tabs**: Footer positioning (64%)
- **Fitted Tabs**: Equal-width distribution (55%)
- **Lazy Loading**: Deferred panel loading (64%)
- **keepMounted**: DOM persistence (45%)
- **Color Themes**: Semantic colors (64%)
- **Custom Indicators**: Active markers (55%)
- **Density Control**: Spacing options (36%)
- **Router Integration**: URL synchronization (55%)
- **Pill Tabs**: Rounded button style (45%)
- **Manual Activation**: Explicit activation (36%)

**Occasional Patterns (18-27%):**
- **Avatars**: Profile images (27%)
- **Editable Tabs**: Add/remove UI (18%)
- **Closable Tabs**: Close buttons (18%)
- **Button Tabs**: Button appearance (27%)
- **Borderless**: Minimal styling (36%)
- **Dropdown Overflow**: Overflow menu (27%)
- **Hash Navigation**: URL hash routing (27%)
- **Remote Content**: API-loaded panels (18%)
- **Sticky Tabs**: Fixed scroll positioning (18%)
- **Browser History**: Back/forward (18%)

### Unique Innovations (Level 5)

**Rare But Innovative (<10% adoption):**

**Ant Design:**
- **Draggable Tabs**: Only framework with native drag-to-reorder (unique)
- **Editable Tabs**: Built-in add/remove UI with callbacks
- **Dropdown Overflow**: Extra tabs in dropdown menu
- **Button Type**: Tabs styled as buttons (unique variant)
- **Card Type**: Distinct card-style tabs

**Chakra UI:**
- **Three Variants**: Line, enclosed (card), soft-rounded (pill)
- **Manual Activation**: Activate on Space/Enter, not focus
- **Variant Prop**: Simple API for visual styles
- **LazyMount + UnmountOnExit**: Fine-grained loading control
- **Multi-version Support**: v2 and v3 both documented

**Radix UI / ShadCN:**
- **Unstyled Primitives**: Complete styling freedom (unique philosophy)
- **Activation Mode**: Automatic vs manual prop
- **Data Attributes**: Comprehensive `data-state`, `data-orientation` for CSS
- **AsChild Pattern**: Render as different element
- **ForceMount**: Override lazy mounting per panel

**Semantic UI Classic:**
- **jQuery Module**: JavaScript module pattern (legacy but unique)
- **Remote Content**: Built-in AJAX loading
- **History API**: Native browser history integration
- **Script Evaluation**: Execute JS in loaded content
- **Deep Nesting**: Support for 25-level nested tabs
- **Data-Tab Paths**: Hierarchical path identifiers
- **Context Scoping**: Limit tab behavior to DOM subtree

**Vuetify:**
- **v-window**: Dedicated content animation component
- **Slider Color**: Customizable active indicator
- **Centered Active**: Scroll to center active tab
- **Align with Title**: Toolbar integration
- **Pagination Arrows**: Always-visible scroll buttons

**HeroUI:**
- **React Aria Foundation**: Accessibility-first approach
- **Slot-Based Styling**: Granular style customization
- **destroyInactiveTabPanel**: Memory optimization
- **disabledKeys**: Array of disabled tab identifiers
- **Cursor Indicator**: Animated position marker

**MUI:**
- **TabContext**: Context-based panel association
- **Sticky Tabs**: AppBar integration for fixed tabs
- **Wrapped Labels**: Multi-line tab text
- **Secondary Action**: Additional content in tabs
- **Indicator Props**: Full indicator customization

**Nuxt UI:**
- **Minimal API**: Only essential props
- **Tailwind-First**: Deep Tailwind integration
- **Link Variant**: Underlined link-style tabs
- **Unmount Prop**: Toggle DOM persistence
- **Label Key**: Custom data mapping

**Mantine:**
- **Placement**: All 4 sides (top/bottom/left/right)
- **Inverted**: Flip tab/panel layout
- **Activation Prop**: Prevent deactivation
- **Keep Mounted**: Explicit DOM control
- **Variant Prop**: Multiple visual styles

**PrimeReact:**
- **Closable**: Built-in close buttons
- **Header Template**: Custom header rendering
- **Scrollable**: Built-in scroll buttons
- **Panel-Level Props**: Per-panel configuration

## Pattern Correlations

**When Composition-Based → Likely has:**
- Multiple sub-components (7/7 = 100%)
- Flexible content patterns (7/7 = 100%)
- Complex customization (7/7 = 100%)
- TypeScript support (7/7 = 100%)

**When Configuration-Based → Likely has:**
- Items prop pattern (4/4 = 100%)
- Simpler API surface (4/4 = 100%)
- Built-in features (4/4 = 100%)
- Less boilerplate (4/4 = 100%)

**When Has Vertical Layout → Likely has:**
- Four-side positioning (8/9 = 89%)
- Orientation prop (9/9 = 100%)
- Responsive orientation (6/9 = 67%)

**When Has Router Integration → Likely has:**
- URL synchronization (6/6 = 100%)
- Navigation components (6/6 = 100%)
- History support (4/6 = 67%)

**When Unstyled (Primitives) → Excludes:**
- Built-in visual variants (2/2 = 100%)
- Opinionated styling (2/2 = 100%)
- Theme integration (2/2 = 100%)

**When Material Design → Likely has:**
- Underlined indicator (2/2 = 100%)
- Ripple effects (2/2 = 100%)
- Dense mode (2/2 = 100%)
- Specific sizing (48px height) (2/2 = 100%)

**When Has Lazy Loading → Likely has:**
- keepMounted option (5/7 = 71%)
- Performance focus (7/7 = 100%)
- Large app patterns (7/7 = 100%)

## Implementation Notes

### Composition vs Configuration

**Composition-Based (64%):**
- **Frameworks**: MUI, Chakra, Radix, ShadCN, Vuetify, some PrimeReact patterns
- **Structure**: Multiple components (Tabs, TabList, Tab, TabPanel)
- **Benefits**: Maximum flexibility, clear separation, reusable parts
- **Drawbacks**: More verbose, steeper learning curve

**Configuration-Based (36%):**
- **Frameworks**: Ant Design, Mantine, HeroUI, Nuxt UI
- **Structure**: Single component with items prop
- **Benefits**: Less boilerplate, simpler API, faster development
- **Drawbacks**: Less flexible for complex cases

**Hybrid Approach:**
- Ant Design: Supports both `items` prop and composition
- PrimeReact: TabView container + TabPanel children
- Semantic UI: Module + HTML structure

### Activation Modes

**Automatic Activation (73%):**
- Tab activates when focused via keyboard
- **Frameworks**: Most (default behavior)
- **ARIA Pattern**: Common but can be confusing
- **Use Case**: Quick navigation between tabs

**Manual Activation (36%):**
- Tab activates only on Space/Enter
- **Frameworks**: Radix, ShadCN, Chakra, HeroUI (optional)
- **ARIA Pattern**: Alternative pattern for complex tabs
- **Use Case**: Tabs with forms or when arrow keys should skip

**Choice Available (36%):**
- **Frameworks**: Radix, ShadCN, Chakra, HeroUI
- **API**: `activationMode="manual"` or similar prop
- **Recommendation**: Manual for complex, automatic for simple

### Content Loading Strategies

**Eager Loading (Default):**
- All panels render at mount
- **Pros**: Instant switching, no loading flicker
- **Cons**: Slower initial load, higher memory

**Lazy Loading (64%):**
- Panel renders on first activation
- **Pros**: Faster initial load, better performance
- **Cons**: Delay on first view, more complex state

**Keep Mounted (45%):**
- Inactive panels stay in DOM (display: none)
- **Pros**: Maintains form state, no re-render cost
- **Cons**: Higher DOM size, memory usage

**Unmount on Hide (55%):**
- Inactive panels removed from DOM
- **Pros**: Lower memory, smaller DOM
- **Cons**: Loses state, re-renders on switch

**Best Practice:**
- Simple content: Eager loading
- Heavy content: Lazy loading
- Forms: Keep mounted
- Static content: Unmount on hide

### Keyboard Navigation Standards

**Arrow Keys (100%):**
- **Left/Up**: Previous tab
- **Right/Down**: Next tab
- **Behavior**: Circular (wrap) in most frameworks

**Home/End Keys (82%):**
- **Home**: First tab
- **End**: Last tab
- **Missing**: Semantic UI, PrimeReact

**Tab Key (100%):**
- Move focus from tab list to panel
- Does NOT switch tabs (activation)

**Enter/Space (100%):**
- Activate focused tab
- **Automatic mode**: Also activates on arrow keys
- **Manual mode**: Only activates on Enter/Space

**Focus Management:**
- **Roving Tabindex**: Only one tab is focusable (91%)
- **Tab → Panel**: Tab key moves from list to content
- **Circular Navigation**: Arrow keys wrap around (100%)

### Router Integration Patterns

**Hash-Based (27%):**
```javascript
// Semantic UI, custom
#section1, #section2
```
- Simple, works without JS
- Visible in URL
- Page doesn't reload

**Path-Based (45%):**
```javascript
// MUI + React Router, Vuetify + Vue Router
/settings/profile, /settings/notifications
```
- Clean URLs
- Full routing power
- Requires router integration

**Query Parameter:**
```javascript
// Custom implementations
?tab=profile, ?tab=notifications
```
- Preserves base path
- Easy to parse
- Less common in frameworks

**HTML5 History (18%):**
- Semantic UI native support
- Custom `pushState` implementations
- Back/forward button support

### Visual Variant Approaches

**Variant Prop (45%):**
```javascript
<Tabs variant="line" />        // Underlined
<Tabs variant="enclosed" />    // Boxed/card
<Tabs variant="pills" />       // Rounded buttons
<Tabs variant="unstyled" />    // No styling
```
- **Frameworks**: Chakra, Mantine, HeroUI, Nuxt
- Clear, type-safe API

**Type Prop (18%):**
```javascript
<Tabs type="line" />
<Tabs type="card" />
<Tabs type="editable-card" />
```
- **Framework**: Ant Design
- Combines variant + behavior

**Separate Components:**
```javascript
<LineTabs />
<CardTabs />
<PillTabs />
```
- Less common in modern frameworks
- More explicit but more components

**CSS Classes (18%):**
```javascript
<div class="ui top attached tabular menu">
```
- **Framework**: Semantic UI
- Most flexible but requires CSS knowledge

### Size and Density

**Size Variants (73%):**
- **Small**: Compact UI, dense layouts
- **Medium/Default**: Standard sizing
- **Large**: Prominent navigation, accessibility

**Density Control (36%):**
- Material Design concept
- **Comfortable**: More padding
- **Compact**: Less padding
- **Frameworks**: MUI, Vuetify, Ant, HeroUI

**Height Standards:**
- **Material Design**: 48px (default), 36px (dense)
- **Most Frameworks**: Flexible, theme-based
- **Accessibility**: Minimum 44px touch target

## Accessibility Implementation

### ARIA Roles

**Tablist (100%):**
```html
<div role="tablist" aria-orientation="horizontal">
```
- Container for tabs
- Orientation indicates arrow key behavior

**Tab (100%):**
```html
<button role="tab" aria-selected="true" aria-controls="panel-1">
```
- Individual tab button
- Must be button or have button role
- `aria-selected` indicates active state
- `aria-controls` links to panel ID

**Tabpanel (100%):**
```html
<div role="tabpanel" aria-labelledby="tab-1" id="panel-1">
```
- Content container
- `aria-labelledby` links to tab ID
- Hidden panels: `hidden` or `aria-hidden="true"`

### Keyboard Support

**Required Keys (100%):**
- **Arrow Keys**: Navigate between tabs
- **Enter/Space**: Activate tab
- **Tab**: Move to panel content

**Recommended Keys (82%):**
- **Home**: First tab
- **End**: Last tab

**Optional Keys:**
- **Delete**: Close tab (if closable)
- **PageDown**: Next panel (less common)
- **PageUp**: Previous panel (less common)

### Focus Management

**Roving Tabindex (91%):**
```html
<button tabindex="0">Active</button>
<button tabindex="-1">Inactive</button>
<button tabindex="-1">Inactive</button>
```
- Only active tab is focusable
- Arrow keys update tabindex
- Prevents Tab key from visiting all tabs

**Focus on Activation (100%):**
- When tab activates, it receives focus
- Visual focus indicator required
- Keyboard and mouse activation both work

## Migration Considerations

**From Bootstrap Tabs:**
- Similar structure (nav + content)
- .nav-tabs → Tabs component
- .tab-pane → TabPanel
- data-toggle="tab" → onClick handler

**From jQuery UI Tabs:**
- Hash-based navigation similar to Semantic UI
- Composition pattern maps to modern frameworks
- Event system → React/Vue state

**Between Modern Frameworks:**
- **Composition → Configuration**: Easier (flatten structure)
- **Configuration → Composition**: Harder (expand structure)
- **MUI → Vuetify**: Similar Material Design patterns
- **Chakra → Mantine**: Similar composition approaches
- **Ant → MUI**: Different philosophies (config vs compose)

**Semantic UI Classic → Modern:**
- jQuery module → React/Vue component
- data-tab → key/value props
- $.tab() API → component props
- Remote loading → fetch in useEffect/onMounted

## Sophisticated Design Patterns

### Ant Design - Dual-Purpose Type System

**What it does**: Ant Design's `type` prop serves dual purposes: it defines both visual appearance (line, card, button) and behavioral capabilities (editable-card enables add/remove operations). A single `type="card"` with `closable` and `onEdit` callback transforms a display component into an interactive editor, eliminating the need for separate management logic.

**Why it's sophisticated**: Most frameworks separate visual variants from behavioral modes. Ant Design collapses this distinction by making the card type a semantic carrier of intent—when you choose card type, you're not just changing style, you're signaling that these tabs are mutable. This reduces API surface area while increasing discoverability.

**Evidence of design maturity**:
- Handles the edge case where the last tab is removed (must select another tab programmatically)
- The `onEdit` callback receives both `targetKey` and `action` parameters, allowing branching logic for add vs. remove in a single function
- Size variants (large/small) persist across type changes, showing thoughtful composition of concerns

### Radix UI - Activation Mode Duality

**What it does**: Radix exposes `activationMode` as a first-class property with two distinct modes: `"automatic"` (arrow keys activate immediately, like browser tabs) and `"manual"` (arrow keys focus only, Space/Enter activates, like form controls). This isn't just styling—it's a fundamental interaction pattern shift that changes keyboard semantics entirely.

**Why it's sophisticated**: This pattern addresses a UX ambiguity that most frameworks leave unresolved. When keyboard focus moves via arrow keys, should the tab automatically display? This depends on context—fast navigation favors automatic, forms with validation favor manual. Radix makes this explicit and toggleable, delegating the UX decision to developers rather than enforcing one pattern.

**Evidence of design maturity**:
- Both modes are fully ARIA-compliant, with the spec supporting both patterns through different use cases
- The `forceMount` prop on Content works with both activation modes without requiring different APIs
- Keyboard behavior changes (Home/End still work in both modes), showing consistent treatment of special keys across modes

### Semantic UI Classic - Hierarchical Scoping with Context

**What it does**: Semantic UI's `context` parameter enables the Tab module to scope activation to a specific DOM subtree. When `$('#group1 .menu .item').tab({ context: '#group1' })` executes, clicking tabs in group1 only affects tab visibility within group1, leaving other tab groups unaffected. This pattern scales to arbitrary nesting depth through the `maxDepth: 25` setting.

**Why it's sophisticated**: This solves a real problem in complex UIs where multiple independent tab groups exist on the same page. Other frameworks force developers to manage this through state isolation (separate state for each group). Semantic UI inverts the problem: the component itself respects DOM structure as the source of truth, eliminating entire classes of state bugs.

**Evidence of design maturity**:
- The `deactivate: 'siblings'` default respects the semantic meaning of "tab group" (siblings in the menu)
- Nested tabs (via `data-tab="parent/child"`) work with the same context mechanism, avoiding special cases for nesting
- Cache management (`cache read`, `cache write`) is transparent but hookable, allowing performance tuning without breaking the scoping model

---

## Framework Recommendations

**For Maximum Flexibility:**
- **Radix UI**: Unstyled primitives, complete control
- **ShadCN**: Radix + beautiful defaults
- **MUI**: Most comprehensive API

**For Rapid Development:**
- **Ant Design**: Rich features out of the box
- **HeroUI**: Modern defaults, great DX
- **Nuxt UI**: Minimal API, Tailwind integration

**For Material Design:**
- **MUI**: Strict Material Design 3 compliance
- **Vuetify**: Material Design for Vue

**For Advanced Features:**
- **Ant Design**: Editable, draggable, dropdown overflow
- **Semantic UI**: Remote content, history API
- **Chakra**: Manual activation, multi-version support

**For Accessibility:**
- **HeroUI**: React Aria foundation
- **Radix UI**: WAI-ARIA compliant primitives
- **MUI**: Comprehensive ARIA implementation

**For Performance:**
- **Radix/ShadCN**: Minimal JavaScript
- **All Modern Frameworks**: Lazy loading support

**For Styling Freedom:**
- **Radix UI**: Completely unstyled
- **ShadCN**: Copy-paste, full ownership
- **Chakra UI**: Powerful theming system

## Future Trends

**Unstyled Primitives:**
- Radix UI influencing ecosystem
- Separation of behavior and style
- Copy-paste component model growing

**React Aria Integration:**
- Accessibility-first approach
- HeroUI leading adoption
- More frameworks may follow

**Router Integration:**
- URL-based tab state becoming standard
- Deep linking patterns
- Better back/forward support

**Performance Focus:**
- Lazy loading becoming default
- Virtualization for many tabs
- Memory optimization patterns

**Composition Over Configuration:**
- Trend toward flexible sub-components
- Better TypeScript support
- More granular control

**Accessibility Baseline:**
- Full ARIA compliance expected
- Keyboard navigation required
- Screen reader support standard

## Raw Data References

Individual framework research reports available at:
- `ai/research/tab/ant-design/usage-patterns.md`
- `ai/research/tab/chakra-ui/usage-patterns.md`
- `ai/research/tab/mantine/usage-patterns.md`
- `ai/research/tab/mui/usage-patterns.md`
- `ai/research/tab/primereact/usage-patterns.md`
- `ai/research/tab/semantic-ui-classic/usage-patterns.md`
- `ai/research/tab/vuetify/usage-patterns.md`
- `ai/research/tab/heroui/usage-patterns.md`
- `ai/research/tab/nuxt-ui/usage-patterns.md`
- `ai/research/tab/shadcn/usage-patterns.md`
- `ai/research/tab/radix-ui/usage-patterns.md`

## Research Methodology

All research conducted on 2025-11-05 through:
1. Direct documentation access via WebFetch
2. Web search for supplementary information
3. Cross-verification across sources
4. Code example extraction from official docs
5. Parallel research using 11 simultaneous subagents

Frameworks surveyed represent major players across React, Vue, and CSS ecosystems, plus unstyled primitive approaches, providing comprehensive cross-framework pattern analysis for Tab components.
