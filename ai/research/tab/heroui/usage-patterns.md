# HeroUI Tabs Component - Usage Patterns

**Component:** Tabs
**Framework:** HeroUI (NextUI)
**Documentation:** https://www.heroui.com/docs/components/tabs
**Research Date:** 2025-11-05

---

## 1. Component Overview

The HeroUI Tabs component provides a flexible, accessible interface for organizing content into multiple switchable sections. Built on React Aria's Tabs patterns, it enables users to navigate between different content panels with keyboard and mouse support. The component combines a tab list with content panels, supporting both controlled and uncontrolled modes, dynamic rendering from data arrays, link-based navigation, and extensive customization through Tailwind CSS slots and data attributes. It integrates seamlessly with form workflows and multi-step processes while maintaining full accessibility compliance (WCAG 2.1 Level AA).

---

## 2. Basic Usage

### Minimal Example

```jsx
import { Tabs, Tab } from "@heroui/react";

export default function App() {
  return (
    <Tabs>
      <Tab key="photos" title="Photos">
        Photo content
      </Tab>
      <Tab key="music" title="Music">
        Music content
      </Tab>
      <Tab key="videos" title="Videos">
        Video content
      </Tab>
    </Tabs>
  );
}
```

### Uncontrolled with Default Selection

```jsx
<Tabs defaultSelectedKey="music">
  <Tab key="photos" title="Photos">Content</Tab>
  <Tab key="music" title="Music">Content</Tab>
  <Tab key="videos" title="Videos">Content</Tab>
</Tabs>
```

### Controlled Component

```jsx
const [selected, setSelected] = React.useState("photos");

<Tabs selectedKey={selected} onSelectionChange={setSelected}>
  <Tab key="photos" title="Photos">Content</Tab>
  <Tab key="music" title="Music">Content</Tab>
  <Tab key="videos" title="Videos">Content</Tab>
</Tabs>
```

### With Event Handlers

```jsx
<Tabs
  defaultSelectedKey="photos"
  onSelectionChange={(key) => {
    console.log('Selected tab:', key);
  }}
>
  <Tab key="photos" title="Photos">Content</Tab>
  <Tab key="music" title="Music">Content</Tab>
</Tabs>
```

### Dynamic Tabs from Array

```jsx
const tabs = [
  { key: "photos", title: "Photos", content: "Photo content" },
  { key: "music", title: "Music", content: "Music content" },
  { key: "videos", title: "Videos", content: "Video content" }
];

<Tabs>
  {tabs.map((tab) => (
    <Tab key={tab.key} title={tab.title}>
      {tab.content}
    </Tab>
  ))}
</Tabs>
```

---

## 3. Props/API Reference

### Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Tab components to render |
| `selectedKey` | `string \| number` | — | Controlled active tab key |
| `defaultSelectedKey` | `string \| number` | — | Initial uncontrolled active tab |
| `onSelectionChange` | `(key: string \| number) => void` | — | Callback when tab selection changes |
| `isDisabled` | `boolean` | `false` | Disables all tabs |
| `disabledKeys` | `Set<string \| number> \| string[] \| number[]` | — | Specific tab keys to disable |
| `variant` | `solid \| bordered \| light \| underlined` | `solid` | Visual style variant |
| `color` | `default \| primary \| secondary \| success \| warning \| danger` | `default` | Color scheme |
| `size` | `sm \| md \| lg` | `md` | Tab and text size |
| `radius` | `none \| sm \| md \| lg \| full` | — | Border radius styling |
| `fullWidth` | `boolean` | `false` | Expand tabs to fill available width |
| `placement` | `top \| bottom \| start \| end` | `top` | Tab list position relative to content |
| `isVertical` | `boolean` | `false` | Vertical orientation (overrides placement) |
| `disableCursorAnimation` | `boolean` | `false` | Disable animated cursor effect |
| `destroyInactiveTabPanel` | `boolean` | `true` | Unmount inactive panel DOM (saves memory) |
| `motionProps` | `MotionProps` | — | Framer Motion configuration for animations |
| `classNames` | `Record<slot, string>` | — | Tailwind classes for slots |
| `items` | `Array<{ key: string; title: ReactNode; children?: ReactNode }>` | — | Data array for dynamic tabs |

### Tab Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | — | Tab label/heading text |
| `children` | `ReactNode` | — | Tab content panel |
| `key` | `string \| number` | — | Unique identifier for tab |
| `isDisabled` | `boolean` | `false` | Disables individual tab |
| `href` | `string` | — | Renders tab as a link (navigation) |
| `textValue` | `string` | — | Text for sorting/filtering (hidden) |

### Event Handler Types

| Event | Signature | Description |
|-------|-----------|-------------|
| `onSelectionChange` | `(key: string \| number) => void` | Fired when tab selection changes |

---

## 4. Variants & Patterns

### Variant System

HeroUI provides four visual style variants for tabs:

```jsx
// Solid variant (default) - filled background
<Tabs variant="solid">
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>

// Bordered variant - outlined tabs
<Tabs variant="bordered">
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>

// Light variant - subtle styling
<Tabs variant="light">
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>

// Underlined variant - underline indicator
<Tabs variant="underlined">
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>
```

**Variant Characteristics:**
- `solid`: Heavy emphasis, suitable for primary navigation
- `bordered`: Outlined style, good for secondary navigation
- `light`: Minimal emphasis, works well on light backgrounds
- `underlined`: Clean, modern appearance with accent underline

**Recommended Use Cases:**
- **Solid**: Main navigation, clear section division needed
- **Bordered**: Dashboard navigation, equal visual weight needed
- **Light**: Subtle navigation, secondary features
- **Underlined**: Modern apps, content-focused layouts

### Size Variants

Three size options control overall dimensions:

```jsx
<Tabs size="sm">Small tabs</Tabs>
<Tabs size="md">Medium tabs (default)</Tabs>
<Tabs size="lg">Large tabs</Tabs>
```

**Size Guidelines:**
- `sm`: Compact sidebars, dense interfaces, mobile
- `md`: Standard forms, content panels (default)
- `lg`: Prominent navigation, accessibility requirements

### Color Variants

Six semantic color schemes:

```jsx
<Tabs color="default">Default color</Tabs>
<Tabs color="primary">Primary brand color</Tabs>
<Tabs color="secondary">Secondary alternative</Tabs>
<Tabs color="success">Success/complete state</Tabs>
<Tabs color="warning">Cautionary/attention state</Tabs>
<Tabs color="danger">Error/destructive action</Tabs>
```

**Semantic Meanings:**
- `default`: Neutral, no special emphasis
- `primary`: Main navigation, primary actions
- `secondary`: Alternative options, secondary features
- `success`: Completed workflows, confirmations
- `warning`: Important notices, caution needed
- `danger`: Errors, critical sections, destructive actions

### Radius Variants

Five border radius options:

```jsx
<Tabs radius="none">Sharp corners</Tabs>
<Tabs radius="sm">Small radius</Tabs>
<Tabs radius="md">Medium radius</Tabs>
<Tabs radius="lg">Large radius</Tabs>
<Tabs radius="full">Fully rounded</Tabs>
```

### Placement Options

Control tab list position relative to content:

```jsx
// Horizontal placements (default)
<Tabs placement="top">Tab list above content</Tabs>
<Tabs placement="bottom">Tab list below content</Tabs>

// Vertical placements
<Tabs placement="start">Tab list on left (vertical)</Tabs>
<Tabs placement="end">Tab list on right (vertical)</Tabs>
```

**Use Cases:**
- `top`: Standard horizontal layout (default)
- `bottom`: Upside-down horizontal layout
- `start`: Sidebar navigation on left
- `end`: Sidebar navigation on right

### Vertical Orientation

Force vertical tab layout regardless of placement:

```jsx
<Tabs isVertical>
  <Tab key="tab1" title="Tab 1">Content</Tab>
  <Tab key="tab2" title="Tab 2">Content</Tab>
  <Tab key="tab3" title="Tab 3">Content</Tab>
</Tabs>
```

**Characteristics:**
- Tab list displays vertically
- Better for narrow screens and sidebars
- Overrides `placement` prop
- Keyboard: Arrow Up/Down navigate tabs

### Full Width Expansion

Expand tabs to fill available width:

```jsx
<Tabs fullWidth>
  <Tab key="tab1" title="Tab 1">Content</Tab>
  <Tab key="tab2" title="Tab 2">Content</Tab>
  <Tab key="tab3" title="Tab 3">Content</Tab>
</Tabs>
```

**Effects:**
- Each tab receives equal width share
- Stretches to container width
- Useful for navigation bars
- Responsive: Can stack on mobile

### Disabled States

#### Disable All Tabs

```jsx
<Tabs isDisabled>
  <Tab key="tab1" title="Tab 1">Content</Tab>
  <Tab key="tab2" title="Tab 2">Content</Tab>
</Tabs>
```

#### Disable Specific Tabs

```jsx
<Tabs disabledKeys={["tab2", "tab3"]}>
  <Tab key="tab1" title="Tab 1">Content</Tab>
  <Tab key="tab2" title="Tab 2">Content</Tab>
  <Tab key="tab3" title="Tab 3">Content</Tab>
</Tabs>

// Or with Set
<Tabs disabledKeys={new Set(["tab2", "tab3"])}>
  ...
</Tabs>
```

**Visual Characteristics:**
- Reduced opacity
- No hover effects
- No pointer cursor
- Cannot be selected via keyboard or mouse
- Remain visible in tab list (not hidden)

**Recommended Pattern:**
Disable tabs conditionally rather than hiding them to maintain layout stability:
```jsx
const [isProcessing, setIsProcessing] = useState(false);

<Tabs disabledKeys={isProcessing ? ["review", "submit"] : []}>
  <Tab key="fill" title="Fill Form">...</Tab>
  <Tab key="review" title="Review">...</Tab>
  <Tab key="submit" title="Submit">...</Tab>
</Tabs>
```

### Icon Support

Include icons alongside tab titles:

```jsx
import { Icon } from "@heroui/react";

<Tabs>
  <Tab
    key="photos"
    title={
      <div className="flex items-center gap-2">
        <PhotoIcon />
        <span>Photos</span>
      </div>
    }
  >
    Photo content
  </Tab>
  <Tab
    key="music"
    title={
      <div className="flex items-center gap-2">
        <MusicIcon />
        <span>Music</span>
      </div>
    }
  >
    Music content
  </Tab>
</Tabs>
```

**Best Practices:**
- Use gap spacing between icon and text
- Keep icons simple and meaningful
- Ensure icons work in small/large sizes
- Consider color contrast with background

### Link-Based Navigation

Render tabs as navigation links:

```jsx
<Tabs>
  <Tab key="home" title="Home" href="/">
    Home content (fallback if JS disabled)
  </Tab>
  <Tab key="about" title="About" href="/about">
    About content
  </Tab>
  <Tab key="contact" title="Contact" href="/contact">
    Contact content
  </Tab>
</Tabs>
```

**With Next.js Router:**
```jsx
import Link from "next/link";

// Implement custom component using as prop or wrapper
<Tabs>
  <Tab
    key="home"
    title="Home"
    href="/"
  >
    Home fallback
  </Tab>
</Tabs>
```

**Use Cases:**
- Page navigation in Next.js/React Router
- Deep linking support
- History and back button support
- SEO-friendly navigation
- Progressive enhancement (works without JS)

### Animation Control

Control cursor animation effect:

```jsx
// Default: animated cursor follows selected tab
<Tabs>
  <Tab key="tab1" title="Tab 1">Content</Tab>
  <Tab key="tab2" title="Tab 2">Content</Tab>
</Tabs>

// Disable cursor animation
<Tabs disableCursorAnimation>
  <Tab key="tab1" title="Tab 1">Content</Tab>
  <Tab key="tab2" title="Tab 2">Content</Tab>
</Tabs>

// Custom animation timing
<Tabs
  motionProps={{
    variants: {
      enter: { opacity: [0, 1], transition: { duration: 0.3 } },
      exit: { opacity: [1, 0], transition: { duration: 0.2 } }
    }
  }}
>
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>
```

**Considerations:**
- Animation enabled by default for modern feel
- Disable for accessibility (respects `prefers-reduced-motion`)
- Framer Motion integration for custom animations

### Panel Lifecycle Management

Control whether inactive panels are removed from DOM:

```jsx
// Default: Unmount inactive panels (saves memory)
<Tabs destroyInactiveTabPanel={true}>
  <Tab key="tab1" title="Tab 1">Content</Tab>
  <Tab key="tab2" title="Tab 2">Content</Tab>
</Tabs>

// Keep panels in DOM (preserves state)
<Tabs destroyInactiveTabPanel={false}>
  <Tab key="tab1" title="Tab 1">Content</Tab>
  <Tab key="tab2" title="Tab 2">Content</Tab>
</Tabs>
```

**Trade-offs:**
- `true` (default): Smaller memory footprint, clean state on switch
- `false`: Preserves component state, smoother transitions

---

## 5. Composition Patterns

### Form Integration

**Multi-Step Forms:**
```jsx
import { useForm } from "react-hook-form";

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState("step1");
  const { watch, getValues } = useForm();

  return (
    <Tabs
      selectedKey={currentStep}
      onSelectionChange={setCurrentStep}
    >
      <Tab key="step1" title="Personal Info">
        {/* Form fields for step 1 */}
      </Tab>
      <Tab key="step2" title="Address">
        {/* Form fields for step 2 */}
      </Tab>
      <Tab key="step3" title="Confirmation">
        {/* Summary of all steps */}
      </Tab>
    </Tabs>
  );
}
```

**Conditional Tab Enabling:**
```jsx
function ConditionalTabs() {
  const [formData, setFormData] = useState({ country: "" });

  const canProceedToStep2 = formData.country !== "";

  return (
    <Tabs disabledKeys={!canProceedToStep2 ? ["step2"] : []}>
      <Tab key="step1" title="Select Country">
        <CountrySelect
          onChange={(v) => setFormData({ ...formData, country: v })}
        />
      </Tab>
      <Tab key="step2" title="Select State" isDisabled={!canProceedToStep2}>
        {/* Conditional content */}
      </Tab>
    </Tabs>
  );
}
```

### Dashboard Navigation

```jsx
function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <div className="flex h-screen gap-4">
      <Tabs
        isVertical
        placement="start"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
        classNames={{
          base: "w-48",
          tabList: "flex-col gap-2"
        }}
      >
        <Tab key="overview" title="Overview">
          <DashboardOverview />
        </Tab>
        <Tab key="analytics" title="Analytics">
          <AnalyticsPanel />
        </Tab>
        <Tab key="reports" title="Reports">
          <ReportsPanel />
        </Tab>
        <Tab key="settings" title="Settings">
          <SettingsPanel />
        </Tab>
      </Tabs>
    </div>
  );
}
```

### Content Organization

**Documentation Tabs:**
```jsx
function DocumentationPage() {
  const [docType, setDocType] = useState("guide");

  return (
    <Tabs
      variant="bordered"
      selectedKey={docType}
      onSelectionChange={setDocType}
    >
      <Tab key="guide" title="Getting Started" className="prose max-w-3xl">
        <Guide />
      </Tab>
      <Tab key="api" title="API Reference" className="prose max-w-3xl">
        <APIRef />
      </Tab>
      <Tab key="examples" title="Examples" className="prose max-w-3xl">
        <Examples />
      </Tab>
      <Tab key="faq" title="FAQ" className="prose max-w-3xl">
        <FAQ />
      </Tab>
    </Tabs>
  );
}
```

**Product Information:**
```jsx
function ProductPage() {
  return (
    <Tabs variant="underlined" fullWidth>
      <Tab key="overview" title="Overview">
        <ProductOverview />
      </Tab>
      <Tab key="features" title="Features">
        <FeaturesList />
      </Tab>
      <Tab key="specs" title="Specifications">
        <SpecsTable />
      </Tab>
      <Tab key="reviews" title="Reviews">
        <ReviewsSection />
      </Tab>
      <Tab key="qna" title="Q&A">
        <QAndA />
      </Tab>
    </Tabs>
  );
}
```

### Responsive Tabs

```jsx
function ResponsiveTabs() {
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Tabs
      isVertical={isVertical}
      classNames={{
        base: isVertical ? "flex gap-4" : "",
        tabList: isVertical ? "flex-col w-48" : "flex-row"
      }}
    >
      <Tab key="tab1" title="Tab 1">Content 1</Tab>
      <Tab key="tab2" title="Tab 2">Content 2</Tab>
      <Tab key="tab3" title="Tab 3">Content 3</Tab>
    </Tabs>
  );
}
```

### Tabs with Search

```jsx
function SearchableTabs() {
  const [filter, setFilter] = useState("");
  const tabs = [
    { key: "all", title: "All Results" },
    { key: "articles", title: "Articles" },
    { key: "docs", title: "Documentation" },
    { key: "code", title: "Code Examples" }
  ];

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search..."
        value={filter}
        onValueChange={setFilter}
        startContent={<SearchIcon />}
      />

      <Tabs>
        {tabs.map(tab => (
          <Tab key={tab.key} title={tab.title}>
            <SearchResults filter={filter} category={tab.key} />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
```

---

## 6. Styling & Theming

### Slot-Based Customization

HeroUI provides granular control through slots for each tab component part:

```jsx
<Tabs
  classNames={{
    base: "w-full",
    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
    cursor: "w-full bg-blue-500",
    tab: [
      "max-w-md",
      "px-0",
      "h-12",
      "relative",
      "only-child:mr-0",
      "focus-visible:outline-none"
    ],
    tabContent: "group-data-[selected=true]:text-blue-500 text-base font-semibold",
    panel: "w-full h-full p-4"
  }}
>
  <Tab key="photos" title="Photos">Photo content</Tab>
  <Tab key="music" title="Music">Music content</Tab>
</Tabs>
```

**Available Slots:**
- `base`: Root tabs container
- `tabList`: List of tab buttons
- `tab`: Individual tab button
- `tabContent`: Tab label text content
- `cursor`: Animated cursor indicator
- `panel`: Tab content panel wrapper
- `tabWrapper`: Tab button with panel combined

### CSS Variables Integration

HeroUI respects design tokens through CSS variables:

```css
/* Global theme customization */
:root {
  --heroui-primary: 220 90% 56%;
  --heroui-content1: 0 0% 100%;
  --heroui-border: 220 13% 91%;
}

.dark {
  --heroui-primary: 220 100% 60%;
  --heroui-content1: 0 0% 10%;
  --heroui-border: 220 13% 20%;
}
```

### Data Attributes for Styling

HeroUI applies state-based data attributes for conditional CSS:

| Attribute | Condition | Usage |
|-----------|-----------|-------|
| `data-selected` | Tab is active | `data-[selected=true]:text-primary` |
| `data-disabled` | Tab is disabled | `data-[disabled=true]:opacity-50` |
| `data-hover` | Mouse over tab | `data-[hover=true]:bg-content2` |
| `data-focus` | Tab has focus | `data-[focus=true]:outline` |
| `data-focus-visible` | Keyboard focus | `data-[focus-visible=true]:ring-2` |
| `data-pressed` | Tab being clicked | `data-[pressed=true]:scale-95` |

**Example Usage:**
```jsx
<Tabs
  classNames={{
    tab: cn(
      "px-4 py-2 rounded-md transition-colors",
      "data-[selected=true]:bg-primary data-[selected=true]:text-white",
      "data-[hover=true]:bg-gray-200",
      "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
    )
  }}
>
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>
```

### Tailwind Classes Integration

Complete Tailwind CSS integration through classNames:

```jsx
<Tabs
  variant="underlined"
  classNames={{
    tabList: "border-b border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50",
    tab: [
      "h-12",
      "px-4",
      "text-sm font-medium",
      "rounded-t-lg",
      "data-[selected=true]:border-b-2 data-[selected=true]:border-primary",
      "hover:bg-white/50"
    ],
    tabContent: "group-data-[selected=true]:font-bold",
    panel: "pt-6"
  }}
>
  <Tab key="tab1" title="Dashboard">Dashboard content</Tab>
  <Tab key="tab2" title="Analytics">Analytics content</Tab>
</Tabs>
```

### Responsive Design Patterns

```jsx
<Tabs
  classNames={{
    base: "w-full",
    tabList: "gap-2 sm:gap-4 md:gap-6",
    tab: "text-xs sm:text-sm md:text-base px-2 sm:px-4",
    panel: "p-2 sm:p-4 md:p-6"
  }}
>
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>
```

### Dark Mode Support

```jsx
<Tabs
  classNames={{
    tabList: "bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700",
    tab: [
      "text-gray-700 dark:text-gray-300",
      "data-[selected=true]:text-blue-600 dark:data-[selected=true]:text-blue-400"
    ]
  }}
>
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>
```

### Animation Customization

```jsx
// Disable animation for accessibility
<Tabs disableCursorAnimation>
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>

// Custom Framer Motion animation
<Tabs
  motionProps={{
    variants: {
      enter: {
        opacity: [0, 1],
        x: [-10, 0],
        transition: { duration: 0.3 }
      },
      exit: {
        opacity: [1, 0],
        transition: { duration: 0.2 }
      }
    }
  }}
>
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>

// Responsive animation timing
<Tabs
  disableCursorAnimation={window.innerWidth < 768}
  motionProps={{
    variants: {
      enter: { transition: { duration: 0.2 } }
    }
  }}
>
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>
```

---

## 7. Accessibility

### ARIA Attributes

HeroUI Tabs automatically provides comprehensive ARIA support:

**Tab List (Role: Tablist):**
- `role="tablist"` - Identifies the tab list container
- `aria-orientation="horizontal|vertical"` - Tab orientation

**Individual Tabs (Role: Tab):**
- `role="tab"` - Identifies individual tab buttons
- `aria-selected="true|false"` - Current selection state
- `aria-controls="panel-id"` - Links to associated panel
- `aria-disabled="true"` - When tab is disabled
- `aria-label` / `aria-labelledby` - Tab label association
- `tabindex="-1|0"` - Focus management (0 = currently selected)

**Tab Panels (Role: Tabpanel):**
- `role="tabpanel"` - Identifies content panel
- `aria-labelledby="tab-id"` - Links back to controlling tab
- `tabindex="0"` - Allows focus if panel has focusable content

### Keyboard Support

Full keyboard navigation is supported by default:

| Key | Action |
|-----|--------|
| `Tab` | Move focus to next focusable element (tab or content) |
| `Shift + Tab` | Move focus to previous focusable element |
| `ArrowRight` / `ArrowDown` | Move to next tab (horizontal/vertical) |
| `ArrowLeft` / `ArrowUp` | Move to previous tab (horizontal/vertical) |
| `Home` | Jump to first tab |
| `End` | Jump to last tab |
| `Space` / `Enter` | Activate tab (if not already active) |

### Screen Reader Support

Screen readers announce:
- Tab list with count: "Tablist with 3 tabs"
- Each tab: "[Tab Title], tab, 1 of 3, selected" (or "not selected")
- Disabled state: "disabled" or "dimmed"
- Panel content: "[Panel title], tabpanel, selected"

### Focus Management

```jsx
// Reference to manage focus programmatically
const tabsRef = useRef(null);

<Tabs ref={tabsRef}>
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>

// Focus management example
function focusTab(key) {
  // Note: HeroUI handles focus internally
  // Use controlled selectedKey to manage which tab displays
}
```

**Focus Behavior:**
- Initially: First tab has focus
- Selection: Automatic focus moves to selected tab
- Disabled tabs: Skipped during navigation
- Panel content: Focus can move to interactive elements in panel

### Visual Focus Indicators

HeroUI provides distinct focus indicators:

```jsx
<Tabs
  classNames={{
    tab: cn(
      // Keyboard focus (prominent)
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      // Mouse focus (subtle)
      "focus:outline-none focus:shadow-sm"
    )
  }}
>
  <Tab key="tab1" title="Tab 1">Content</Tab>
</Tabs>
```

### Color Contrast

All color variants meet WCAG 2.1 Level AA standards:
- Minimum 4.5:1 contrast for tab text
- 3:1 contrast for UI components
- Enhanced contrast maintained in disabled states

### Best Practices for Accessibility

1. **Always provide meaningful tab titles:**
   ```jsx
   <Tab key="overview" title="Dashboard Overview">
     Dashboard content here
   </Tab>
   ```

2. **Use icons with supporting text:**
   ```jsx
   <Tab key="settings" title={
     <div className="flex items-center gap-2">
       <SettingsIcon />
       <span>Settings</span>
     </div>
   }>
     Settings content
   </Tab>
   ```

3. **Properly manage focus in panels:**
   ```jsx
   <Tab key="form" title="Form">
     <form>
       <input autoFocus type="text" />
       {/* Form fields */}
     </form>
   </Tab>
   ```

4. **Disable tabs conditionally (don't hide them):**
   ```jsx
   // Good: Tab remains visible but disabled
   <Tabs disabledKeys={!isFormValid ? ["review"] : []}>
     <Tab key="fill" title="Fill Form">...</Tab>
     <Tab key="review" title="Review">...</Tab>
   </Tabs>
   ```

5. **Provide status updates for long operations:**
   ```jsx
   <Tabs disabledKeys={isLoading ? ["next"] : []}>
     <Tab key="current" title="Processing">
       {isLoading && <Spinner label="Loading..." />}
     </Tab>
     <Tab key="next" title="Next Step">Next content</Tab>
   </Tabs>
   ```

6. **Respect user preferences for motion:**
   ```jsx
   <Tabs
     disableCursorAnimation={prefersReducedMotion}
     motionProps={{
       transition: { duration: prefersReducedMotion ? 0 : 0.3 }
     }}
   >
     <Tab key="tab1" title="Tab 1">Content</Tab>
   </Tabs>
   ```

7. **Include helpful link text for navigation tabs:**
   ```jsx
   <Tab key="home" title="Home" href="/">
     <span className="sr-only">Go to home page</span>
   </Tab>
   ```

---

## 8. Best Practices

### When to Use Tabs

**Use tabs when:**
- Organizing content into logical sections
- Users need to switch between related content
- All tabs should be equally visible/accessible
- Horizontal space is limited
- Content fits within reasonable panel sizes
- Different views of the same data

**Don't use tabs when:**
- Hiding content that should always be visible
- Only 2 options exist (use toggle/switch instead)
- Sequential steps are required (consider wizard/stepper)
- Many tabs needed (consider sidebar or dropdown navigation)
- Content is rarely accessed (consider collapsible sections)

### State Management Patterns

**Uncontrolled (Simple Cases):**
```jsx
// Good for simple navigation with no external state dependency
<Tabs defaultSelectedKey="overview">
  <Tab key="overview" title="Overview">Overview content</Tab>
  <Tab key="details" title="Details">Details content</Tab>
</Tabs>
```

**Controlled (Complex Cases):**
```jsx
// Good for multi-step forms, external state management, validation
const [activeTab, setActiveTab] = useState("step1");

function handleTabChange(key) {
  // Validate before switching
  if (validateStep(activeTab)) {
    setActiveTab(key);
  }
}

<Tabs selectedKey={activeTab} onSelectionChange={handleTabChange}>
  <Tab key="step1" title="Step 1">Content</Tab>
  <Tab key="step2" title="Step 2">Content</Tab>
</Tabs>
```

**Choose controlled when:**
- Validation before tab switching
- Preserving form state across switches
- Multi-step workflows
- Analytics tracking needed
- External store integration (Redux, Zustand)

### Performance Optimization

```jsx
// Memoize tab content
const MemoizedTabContent = React.memo(({ tabKey }) => {
  return <TabContent key={tabKey} />;
});

// Use destroyInactiveTabPanel strategically
<Tabs destroyInactiveTabPanel={true}> {/* Memory efficient */}
  <Tab key="heavy" title="Heavy Content">
    <ExpensiveComponent /> {/* Unmounted when not selected */}
  </Tab>
</Tabs>

// Virtual scrolling for many tabs
import { useVirtual } from "@tanstack/react-virtual";

const items = Array.from({ length: 1000 }, (_, i) => i);

<Tabs>
  {items.map(i => (
    <Tab key={i} title={`Tab ${i}`}>Content {i}</Tab>
  ))}
</Tabs>

// Lazy load tab content
const LazyTabContent = React.lazy(() => import("./TabContent"));

<Tab key="lazy" title="Lazy Loaded">
  <React.Suspense fallback={<Spinner />}>
    <LazyTabContent />
  </React.Suspense>
</Tab>
```

### Common Pitfalls

1. **Using tabs for sequential steps (wrong):**
   ```jsx
   // Bad: Suggests non-linear navigation
   <Tabs>
     <Tab key="step1" title="Step 1">Personal info</Tab>
     <Tab key="step2" title="Step 2">Address</Tab>
     <Tab key="step3" title="Step 3">Confirmation</Tab>
   </Tabs>

   // Good: Use progress indicator for steps
   <Stepper activeStep={step}>
     <Step>Fill personal info</Step>
     <Step>Enter address</Step>
     <Step>Confirm details</Step>
   </Stepper>
   ```

2. **Hiding critical tabs (wrong):**
   ```jsx
   // Bad: Tab disappears
   {showAdvanced && (
     <Tab key="advanced" title="Advanced">Advanced options</Tab>
   )}

   // Good: Disable if not available
   <Tabs disabledKeys={!showAdvanced ? ["advanced"] : []}>
     <Tab key="advanced" title="Advanced">Advanced options</Tab>
   </Tabs>
   ```

3. **Too many tabs (wrong):**
   ```jsx
   // Bad: 15+ tabs become unusable
   <Tabs>
     {allOptions.map(opt => <Tab key={opt.id} title={opt.name} />)}
   </Tabs>

   // Good: Group or use alternative navigation
   <Tabs>
     <Tab key="common" title="Common">
       {/* Most used options */}
     </Tab>
     <Tab key="advanced" title="Advanced">
       {/* Less common options */}
     </Tab>
   </Tabs>
   ```

4. **Mixing controlled and uncontrolled:**
   ```jsx
   // Bad: Both selectedKey and defaultSelectedKey
   <Tabs selectedKey={active} defaultSelectedKey="tab1">
     ...
   </Tabs>

   // Good: Pick one pattern
   <Tabs selectedKey={active} onSelectionChange={setActive}>
     ...
   </Tabs>
   ```

5. **Not handling loading states:**
   ```jsx
   // Bad: No feedback while loading
   <Tabs selectedKey={tab} onSelectionChange={setTab}>
     <Tab key="data" title="Data">{data}</Tab>
   </Tabs>

   // Good: Show loading state
   <Tabs
     selectedKey={tab}
     onSelectionChange={setTab}
     disabledKeys={isLoading ? ["data"] : []}
   >
     <Tab key="data" title="Data">
       {isLoading ? <Spinner /> : data}
     </Tab>
   </Tabs>
   ```

### Validation Patterns

```jsx
function ValidatedTabs() {
  const [activeTab, setActiveTab] = useState("personal");
  const [personalValid, setPersonalValid] = useState(false);
  const [addressValid, setAddressValid] = useState(false);

  const disabledTabs = new Set();
  if (!personalValid) disabledTabs.add("address");
  if (!addressValid) disabledTabs.add("review");

  return (
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={setActiveTab}
      disabledKeys={disabledTabs}
    >
      <Tab key="personal" title="Personal Info">
        <PersonalForm onValidChange={setPersonalValid} />
      </Tab>
      <Tab key="address" title="Address">
        <AddressForm onValidChange={setAddressValid} />
      </Tab>
      <Tab key="review" title="Review">
        <ReviewSummary />
      </Tab>
    </Tabs>
  );
}
```

### Loading and Error States

```jsx
function DataTabs() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const handleTabChange = async (key) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      await fetchTabData(key);
      setActiveTab(key);
    } catch (error) {
      setErrors(prev => ({ ...prev, [key]: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={handleTabChange}
    >
      <Tab
        key="overview"
        title={
          loading.overview ? "Overview (loading...)" : "Overview"
        }
      >
        {errors.overview && <ErrorBanner message={errors.overview} />}
        {loading.overview ? <Spinner /> : <OverviewContent />}
      </Tab>
    </Tabs>
  );
}
```

---

## 9. Unique Features & Comparison

### Unique Features of HeroUI Tabs

1. **Slot-Based Styling System**
   - Fine-grained control over each component part
   - More flexible than single-class approaches
   - Easy to customize colors, sizes, and layout

2. **Animated Cursor Indicator**
   - Smooth animated line/cursor following active tab
   - Can be disabled for accessibility
   - Framer Motion based for smooth transitions

3. **Comprehensive Data Attributes**
   - Rich `data-*` attributes for state-based styling
   - Enables complex CSS-based conditional styling
   - Works with Tailwind's `data-[*]` syntax

4. **Variant System**
   - Four distinct visual styles (solid/bordered/light/underlined)
   - Each with semantic meaning and use case
   - Consistent with HeroUI design language

5. **Dual Orientation Support**
   - Seamless horizontal and vertical layouts
   - `isVertical` prop overrides placement
   - Perfect for responsive sidebars

6. **Built-in Link Support**
   - Tabs function as navigation links via `href`
   - Progressive enhancement support
   - Works with modern routers (Next.js, React Router)

7. **Panel Lifecycle Control**
   - `destroyInactiveTabPanel` for memory optimization
   - Preserves component state when disabled
   - Configurable based on use case

8. **Rich Keyboard Support**
   - Arrow key navigation
   - Home/End key support
   - Semantic tab order management

### Comparison to Other UI Libraries

**vs. Material-UI Tabs:**
- HeroUI: Tailwind-based, smaller bundle
- MUI: Emotion/styled-components, larger ecosystem
- HeroUI: More modern animations
- MUI: More enterprise features

**vs. Chakra UI Tabs:**
- HeroUI: Slot-based, more granular styling
- Chakra: Style props based, more intuitive for beginners
- HeroUI: Built-in link support
- Chakra: More flexible composition

**vs. Radix UI Tabs:**
- HeroUI: Styled by default, rapid development
- Radix: Unstyled primitives, full control
- HeroUI: Opinionated styling
- Radix: Zero opinions on styling

**vs. Ant Design Tabs:**
- HeroUI: Modern React patterns, better TypeScript
- Ant Design: Enterprise features, larger bundle
- HeroUI: Tailwind integration
- Ant Design: CSS-in-JS based

**vs. React Bootstrap Tabs:**
- HeroUI: Modern component design, accessibility first
- React Bootstrap: Classic Bootstrap styling
- HeroUI: Framer Motion animations
- React Bootstrap: No built-in animations

---

## 10. Advanced Patterns

### Compound Tab Component

```jsx
function CompoundTabExample() {
  return (
    <Tabs
      variant="underlined"
      color="primary"
      isVertical
      className="max-w-4xl"
    >
      <Tab key="general" title="General Settings">
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-semibold">General Preferences</h3>
          <SettingItem label="Theme" />
          <SettingItem label="Language" />
          <SettingItem label="Timezone" />
        </div>
      </Tab>

      <Tab key="notifications" title="Notifications">
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-semibold">Notification Settings</h3>
          <SettingItem label="Email Notifications" />
          <SettingItem label="Push Notifications" />
          <SettingItem label="SMS Alerts" />
        </div>
      </Tab>

      <Tab key="privacy" title="Privacy & Security">
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-semibold">Privacy Settings</h3>
          <SettingItem label="Profile Visibility" />
          <SettingItem label="Two-Factor Authentication" />
          <SettingItem label="Session Management" />
        </div>
      </Tab>
    </Tabs>
  );
}
```

### Nested Tabs

```jsx
function NestedTabsExample() {
  return (
    <Tabs variant="solid">
      <Tab key="frontend" title="Frontend">
        <Tabs variant="bordered" className="mt-4">
          <Tab key="react" title="React">
            React content
          </Tab>
          <Tab key="vue" title="Vue">
            Vue content
          </Tab>
          <Tab key="angular" title="Angular">
            Angular content
          </Tab>
        </Tabs>
      </Tab>

      <Tab key="backend" title="Backend">
        <Tabs variant="bordered" className="mt-4">
          <Tab key="node" title="Node.js">
            Node.js content
          </Tab>
          <Tab key="python" title="Python">
            Python content
          </Tab>
          <Tab key="go" title="Go">
            Go content
          </Tab>
        </Tabs>
      </Tab>
    </Tabs>
  );
}
```

### Tabs with Dynamic Content Loading

```jsx
function DynamicTabsWithLoading() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState({});

  const handleTabChange = async (key) => {
    if (!content[key]) {
      setLoading(prev => ({ ...prev, [key]: true }));
      try {
        const data = await fetchTabContent(key);
        setContent(prev => ({ ...prev, [key]: data }));
      } finally {
        setLoading(prev => ({ ...prev, [key]: false }));
      }
    }
  };

  return (
    <Tabs onSelectionChange={handleTabChange} defaultSelectedKey="tab1">
      <Tab key="tab1" title="Tab 1">
        {loading.tab1 ? <Spinner /> : content.tab1}
      </Tab>
      <Tab key="tab2" title="Tab 2">
        {loading.tab2 ? <Spinner /> : content.tab2}
      </Tab>
      <Tab key="tab3" title="Tab 3">
        {loading.tab3 ? <Spinner /> : content.tab3}
      </Tab>
    </Tabs>
  );
}
```

---

## Key Findings Summary

### Strengths
1. **Comprehensive accessibility** - Built on React Aria with full keyboard navigation
2. **Flexible styling system** - Slot-based with Tailwind integration and data attributes
3. **Animated cursor indicator** - Smooth visual feedback for active tab
4. **Rich keyboard support** - Arrow keys, Home/End for navigation
5. **Built-in link support** - Navigate with `href` for progressive enhancement
6. **Multiple layout options** - Horizontal, vertical, left, right, top, bottom
7. **Variant system** - Four semantic visual styles for different contexts
8. **Panel lifecycle control** - Memory optimization with `destroyInactiveTabPanel`

### Notable Patterns
1. **Controlled/uncontrolled modes** - Clear separation with explicit defaultSelectedKey
2. **Data-driven tabs** - Dynamic rendering from arrays
3. **Disabled tab management** - Conditional disabling instead of hiding
4. **Multi-step workflows** - Well-suited for form wizards and step-by-step processes
5. **Responsive design** - Easy vertical orientation on mobile
6. **Icon integration** - Simple icon + text in tab titles

### Use Cases Excel At
- Content organization and section navigation
- Multi-step forms and workflows
- Dashboard navigation with sidebars
- Tabbed documentation and guides
- Settings panels with categories
- Product pages with multiple sections
- Data exploration with different views
- Accessible form validation workflows

### Potential Limitations
- Requires HeroUI ecosystem (not standalone)
- React-specific (no framework-agnostic version)
- Opinionated styling may require overrides for custom designs
- Larger bundle than unstyled primitive libraries
- Animation behavior fixed (limited customization beyond Framer Motion)

---

**Research completed:** 2025-11-05
**Documentation source:** https://www.heroui.com/docs/components/tabs
**Research methodology:** Direct documentation review and API pattern analysis
