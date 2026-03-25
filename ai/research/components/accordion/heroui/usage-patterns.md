# HeroUI - Accordion Component

## Component Overview

The HeroUI Accordion component provides a collapsible container for displaying expandable/collapsible list items to reveal or hide additional information. It's commonly used for FAQs, feature lists, settings menus, and step-by-step instructions where space optimization is important.

**Key Purpose**: Enable users to toggle the visibility of content sections in a compact, organized manner while maintaining a clean interface.

**Common Use Cases**:
- FAQ pages with expandable questions/answers
- Feature lists with detailed descriptions
- Settings or preferences panels
- Installation or setup instructions
- Documentation sections
- Product details with additional specifications

---

## Usage Patterns

### Basic Usage

The basic accordion uses the `Accordion` wrapper component with one or more `AccordionItem` children. Each item has a title that acts as a clickable toggle.

**Minimal Example:**
```jsx
import { Accordion, AccordionItem } from "@heroui/react";

<Accordion>
  <AccordionItem key="1" title="What is HeroUI?">
    HeroUI is a modern React UI library with Tailwind CSS integration.
  </AccordionItem>
  <AccordionItem key="2" title="Is it free?">
    Yes, HeroUI is open source and free to use.
  </AccordionItem>
</Accordion>
```

**Key Points**:
- Each `AccordionItem` requires a unique `key` prop
- The `title` prop sets the clickable header text
- Content goes inside the `AccordionItem` as children
- No configuration needed for basic functionality

### Variants/Styles

HeroUI provides multiple visual variants through the `variant` prop on the `Accordion` component:

**Available Variants:**
- `"light"` (default): Minimal styling, clean appearance
- `"shadow"`: Adds box shadow effect for depth
- `"bordered"`: Adds border around each item
- `"splitted"`: Items are visually separated

**Example:**
```jsx
// Shadow variant
<Accordion variant="shadow">
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
</Accordion>

// Bordered variant
<Accordion variant="bordered">
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
</Accordion>

// Splitted variant (items with spacing)
<Accordion variant="splitted">
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
</Accordion>
```

### States

The accordion supports multiple interactive states that are tracked on both the container and individual items:

**Item States:**
- **Default**: Item is collapsed, closed state
- **Expanded/Open**: Item is expanded, revealing content (tracked with `data-open` attribute)
- **Collapsed**: Item is not expanded
- **Disabled**: Item cannot be interacted with (tracked with `data-disabled` attribute)
- **Hover**: Item is being hovered (tracked with `data-hover` state)
- **Focus**: Item has keyboard focus (tracked with `data-focus` and `data-focus-visible` attributes)

**Controlled States:**
```jsx
// Track which items are expanded
const [expandedKeys, setExpandedKeys] = useState(new Set(["1"]));

<Accordion
  selectedKeys={expandedKeys}
  onSelectionChange={setExpandedKeys}
>
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
  <AccordionItem key="2" title="Item 2">Content</AccordionItem>
</Accordion>

// Disable specific items
<Accordion disabledKeys={["2", "3"]}>
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
  <AccordionItem key="2" title="Item 2">Content</AccordionItem>
  <AccordionItem key="3" title="Item 3">Content</AccordionItem>
</Accordion>

// Set items to be expanded by default
<Accordion defaultExpandedKeys={["1", "3"]}>
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
  <AccordionItem key="3" title="Item 3">Content</AccordionItem>
</Accordion>
```

### Sizing Options

While HeroUI doesn't provide explicit size variants, sizing is controlled through:

**Compact Layout:**
```jsx
// Reduced spacing and padding
<Accordion isCompact>
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
</Accordion>
```

**Width Configuration:**
```jsx
// Default: fullWidth (true)
// Expand to container width
<Accordion fullWidth>
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
</Accordion>

// Custom width via wrapper
<div style={{ width: "500px" }}>
  <Accordion>
    <AccordionItem key="1" title="Item 1">Content</AccordionItem>
  </Accordion>
</div>
```

### Layout & Positioning

**Divider Control:**
```jsx
// Show dividers between items (default: true)
<Accordion showDivider>
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
  <AccordionItem key="2" title="Item 2">Content</AccordionItem>
</Accordion>

// Hide dividers
<Accordion showDivider={false}>
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
</Accordion>
```

**Selection Mode (Single vs Multiple):**
```jsx
// Single selection (default) - only one item open at a time
<Accordion selectionMode="single">
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
  <AccordionItem key="2" title="Item 2">Content</AccordionItem>
</Accordion>

// Multiple selection - multiple items can be open simultaneously
<Accordion selectionMode="multiple">
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
  <AccordionItem key="2" title="Item 2">Content</AccordionItem>
</Accordion>

// No selection - items can't be toggled
<Accordion selectionMode="none">
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
</Accordion>
```

### Content & Structure

**Basic Content:**
```jsx
<AccordionItem key="1" title="Question?">
  This is the expandable content that appears when clicked.
</AccordionItem>
```

**With Subtitle:**
```jsx
<AccordionItem
  key="1"
  title="Main Title"
  subtitle="Secondary description text"
>
  Main content appears here.
</AccordionItem>
```

**With Start Content (Icons/Avatars):**
```jsx
import { Avatar } from "@heroui/react";
import { CheckCircleIcon } from "lucide-react";

<AccordionItem
  key="1"
  startContent={<CheckCircleIcon className="w-6 h-6" />}
  title="Completed Step"
>
  Content goes here.
</AccordionItem>

<AccordionItem
  key="2"
  startContent={<Avatar src="avatar.jpg" />}
  title="User Information"
>
  User details here.
</AccordionItem>
```

**Custom Heading Element:**
```jsx
// Change from default h2 to h3
<AccordionItem
  key="1"
  title="Item Title"
  HeadingComponent="h3"
>
  Content
</AccordionItem>
```

### Interactive Features

**Expandable Behavior:**
```jsx
// Items expand/collapse on click
// Default behavior without additional config

// Controlled expansion
const [selected, setSelected] = useState(new Set(["1"]));

<Accordion
  selectedKeys={selected}
  onSelectionChange={setSelected}
>
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
</Accordion>
```

**Single vs Multiple Expansion:**
```jsx
// Single: Only one item open
<Accordion selectionMode="single">
  {/* Opening item 2 closes item 1 */}
</Accordion>

// Multiple: Multiple items can be open
<Accordion selectionMode="multiple">
  {/* Opening item 2 keeps item 1 open */}
</Accordion>
```

**Disabled Items:**
```jsx
<AccordionItem key="1" title="Active Item">
  Can be expanded.
</AccordionItem>

<AccordionItem key="2" title="Disabled Item" isDisabled>
  Cannot be expanded or interacted with.
</AccordionItem>

// Or disable at accordion level
<Accordion disabledKeys={["2", "3"]}>
  <AccordionItem key="1" title="Active">Content</AccordionItem>
  <AccordionItem key="2" title="Disabled">Content</AccordionItem>
  <AccordionItem key="3" title="Disabled">Content</AccordionItem>
</Accordion>
```

**Preserve DOM Content:**
```jsx
// By default, content is unmounted when collapsed
// Use keepContentMounted to preserve DOM state
<AccordionItem
  key="1"
  title="Item with Form"
  keepContentMounted
>
  <input type="text" placeholder="Form state preserved" />
</AccordionItem>
```

### Animation & Transitions

**Custom Motion Props:**
```jsx
import { Accordion, AccordionItem } from "@heroui/react";

<Accordion
  motionProps={{
    variants: {
      enter: {
        y: 0,
        opacity: 1,
        height: "auto",
        transition: {
          height: {
            type: "spring",
            stiffness: 500,
            damping: 30,
            duration: 0.7,
          },
          opacity: {
            easings: "ease-out",
            duration: 0.5,
          },
        },
      },
      exit: {
        y: -10,
        opacity: 0,
        height: 0,
        transition: {
          height: {
            easings: "ease-in",
            duration: 0.3,
          },
          opacity: {
            easings: "ease-in",
            duration: 0.2,
          },
        },
      },
    },
  }}
>
  <AccordionItem key="1" title="Animated Item">
    Content with custom animation.
  </AccordionItem>
</Accordion>
```

**Features:**
- Built on Framer Motion for smooth animations
- Spring physics for natural motion
- Customizable easing functions
- Duration control for enter/exit
- Default animations handle collapse/expand smoothly

### Integration Patterns

**With Custom Styling:**
```jsx
<Accordion
  classNames={{
    base: "gap-3",
    heading: "flex relative w-full",
    trigger: "flex items-center flex-1 py-2",
    content: "pt-0 px-2 py-0",
  }}
  itemClasses={{
    heading: "rounded-lg h-14 flex gap-3 px-4 bg-default-100",
    trigger: "px-2 py-0 data-[hover=true]:bg-default-200 h-14 flex items-center",
    content: "text-small px-2",
  }}
>
  <AccordionItem key="1" title="Item 1">Content</AccordionItem>
</Accordion>
```

**With Form Content:**
```jsx
import { Input, Button } from "@heroui/react";

<Accordion>
  <AccordionItem key="settings" title="Settings">
    <form onSubmit={handleSubmit}>
      <Input label="Username" className="mb-4" />
      <Button type="submit">Save</Button>
    </form>
  </AccordionItem>
</Accordion>
```

**With Rich Content:**
```jsx
import { Card, CardBody, Chip, Avatar } from "@heroui/react";

<Accordion variant="splitted">
  <AccordionItem
    key="feature1"
    startContent={<Chip color="success">New</Chip>}
    title="Advanced Features"
  >
    <Card>
      <CardBody>
        <p>Feature 1: Description</p>
        <p>Feature 2: Description</p>
      </CardBody>
    </Card>
  </AccordionItem>
</Accordion>
```

### Accessibility Features

**Keyboard Navigation:**
- **Enter/Space**: Toggle item open/closed
- **Arrow Up**: Move focus to previous item
- **Arrow Down**: Move focus to next item
- **Home**: Move focus to first item
- **End**: Move focus to last item
- **Tab**: Navigate between items

**ARIA Attributes:**
```jsx
// Automatically managed by HeroUI
// aria-expanded="true|false" - Indicates open/closed state
// aria-disabled="true|false" - Indicates disabled items
// aria-controls - Links header to content region
// role="button" on header
// role="region" on content area
```

**Screen Reader Support:**
```jsx
// HeroUI provides semantic structure:
// - Headers are properly marked as buttons
// - Content regions are associated with headers
// - Expansion states are announced
// - Disabled state is indicated

<Accordion>
  <AccordionItem
    key="1"
    title="Screen Reader Friendly Title"
  >
    Descriptive content that provides context.
  </AccordionItem>
</Accordion>
```

**Focus Management:**
- Visible focus indicators on keyboard navigation (tracked with `data-focus-visible`)
- Automatic focus restoration
- Cross-browser focus normalization

---

## Key Properties/Props

### Accordion Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"light" \| "shadow" \| "bordered" \| "splitted"` | `"light"` | Visual styling variant |
| `selectionMode` | `"none" \| "single" \| "multiple"` | `"single"` | How many items can be open simultaneously |
| `selectedKeys` | `Set<string>` | - | Controlled: Keys of open items |
| `defaultExpandedKeys` | `string[]` | - | Keys of items expanded by default |
| `disabledKeys` | `string[]` | - | Keys of items that cannot be interacted with |
| `onSelectionChange` | `(keys: Set<string>) => void` | - | Callback when selection changes |
| `isCompact` | `boolean` | `false` | Reduce spacing and padding |
| `fullWidth` | `boolean` | `true` | Expand to container width |
| `showDivider` | `boolean` | `true` | Display dividers between items |
| `hideIndicator` | `boolean` | `false` | Hide expand/collapse indicator icon |
| `motionProps` | `MotionProps` | - | Framer Motion animation configuration |
| `classNames` | `object` | - | Override accordion container classes |
| `itemClasses` | `object` | - | Override item-level classes |

### AccordionItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `string` | Required | Unique identifier for item |
| `title` | `ReactNode` | Required | Header text/content |
| `subtitle` | `ReactNode` | - | Secondary header text |
| `isDisabled` | `boolean` | `false` | Disable this individual item |
| `indicator` | `ReactNode \| (props) => ReactNode` | - | Custom open/close indicator |
| `startContent` | `ReactNode` | - | Content at start of header (icons, avatars) |
| `HeadingComponent` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h2"` | HTML heading element |
| `keepContentMounted` | `boolean` | `false` | Preserve DOM when collapsed |
| `classNames` | `object` | - | Override item-level classes |
| `children` | `ReactNode` | - | Item content |

---

## Code Examples

### Example 1: Basic FAQ Accordion

```jsx
import { Accordion, AccordionItem } from "@heroui/react";

export default function FAQAccordion() {
  const faqs = [
    {
      id: "1",
      question: "What is HeroUI?",
      answer: "HeroUI is a modern React UI library with beautiful components and full Tailwind CSS support.",
    },
    {
      id: "2",
      question: "Is HeroUI free?",
      answer: "Yes, HeroUI is open source and completely free to use in your projects.",
    },
    {
      id: "3",
      question: "How do I install HeroUI?",
      answer: "You can install HeroUI via npm or yarn with: npm install @heroui/react",
    },
  ];

  return (
    <Accordion variant="bordered">
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          title={faq.question}
        >
          {faq.answer}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

### Example 2: Multi-Select Settings Panel

```jsx
import { Accordion, AccordionItem, Switch } from "@heroui/react";
import { useState } from "react";

export default function SettingsAccordion() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true,
  });

  return (
    <Accordion
      variant="shadow"
      selectionMode="multiple"
      defaultExpandedKeys={["general"]}
    >
      <AccordionItem key="general" title="General Settings">
        <Switch
          label="Enable Notifications"
          checked={settings.notifications}
          onChange={(e) =>
            setSettings({ ...settings, notifications: e.target.checked })
          }
        />
      </AccordionItem>
      <AccordionItem key="appearance" title="Appearance">
        <Switch
          label="Dark Mode"
          checked={settings.darkMode}
          onChange={(e) =>
            setSettings({ ...settings, darkMode: e.target.checked })
          }
        />
      </AccordionItem>
      <AccordionItem key="advanced" title="Advanced">
        <Switch
          label="Auto-Save"
          checked={settings.autoSave}
          onChange={(e) =>
            setSettings({ ...settings, autoSave: e.target.checked })
          }
        />
      </AccordionItem>
    </Accordion>
  );
}
```

### Example 3: Accordion with Custom Indicators

```jsx
import { Accordion, AccordionItem } from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";

export default function CustomIndicatorAccordion() {
  const CustomIndicator = ({ isOpen, isDisabled }) => (
    <ChevronDownIcon
      className={`transform transition-transform ${
        isOpen ? "rotate-180" : ""
      } ${isDisabled ? "opacity-50" : ""}`}
    />
  );

  return (
    <Accordion variant="splitted">
      <AccordionItem
        key="1"
        title="Item with Custom Icon"
        indicator={<CustomIndicator />}
      >
        Content displayed with custom indicator.
      </AccordionItem>
    </Accordion>
  );
}
```

### Example 4: Disabled Items in Accordion

```jsx
import { Accordion, AccordionItem } from "@heroui/react";

export default function DisabledAccordion() {
  return (
    <Accordion disabledKeys={["2"]}>
      <AccordionItem key="1" title="Available Item 1">
        This item can be expanded.
      </AccordionItem>
      <AccordionItem key="2" title="Locked Item">
        This item is disabled and cannot be interacted with.
      </AccordionItem>
      <AccordionItem key="3" title="Available Item 2">
        This item can be expanded.
      </AccordionItem>
    </Accordion>
  );
}
```

### Example 5: Controlled Accordion with External State

```jsx
import { Accordion, AccordionItem, Button } from "@heroui/react";
import { useState } from "react";

export default function ControlledAccordion() {
  const [expandedKeys, setExpandedKeys] = useState(new Set(["1"]));

  const expandAll = () => setExpandedKeys(new Set(["1", "2", "3"]));
  const collapseAll = () => setExpandedKeys(new Set());

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onPress={expandAll} color="primary">
          Expand All
        </Button>
        <Button onPress={collapseAll} variant="flat">
          Collapse All
        </Button>
      </div>

      <Accordion
        selectedKeys={expandedKeys}
        onSelectionChange={setExpandedKeys}
        variant="bordered"
      >
        <AccordionItem key="1" title="Section 1">
          Content for section 1.
        </AccordionItem>
        <AccordionItem key="2" title="Section 2">
          Content for section 2.
        </AccordionItem>
        <AccordionItem key="3" title="Section 3">
          Content for section 3.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
```

---

## Accessibility Notes

**Keyboard Navigation Implementation:**
- HeroUI automatically handles keyboard events
- Users can navigate with arrow keys between items
- Space/Enter toggles items
- Home/End jump to first/last items
- Tab moves through focusable elements

**ARIA Implementation:**
- `aria-expanded` automatically managed based on open/closed state
- `aria-disabled` applied to disabled items
- `aria-controls` links headers to content
- Headers have `role="button"` semantics
- Content areas marked as `role="region"`

**Best Practices for Accessible Content:**
1. Use clear, descriptive titles that indicate what content will be revealed
2. Avoid putting critical information only in collapsed content
3. Use semantic HTML inside accordion items
4. Test with keyboard navigation only (no mouse)
5. Test with screen readers to verify announcements
6. Ensure sufficient color contrast in all states
7. Don't rely on color alone to indicate state

**Screen Reader Experience:**
- Item expansion state is announced
- Disabled items are identified
- Content regions are properly associated with headers
- Title text is read aloud when focus moves to item

---

## Common Patterns

1. **FAQ Pages**: Use bordered or shadow variant with single selection mode
2. **Settings Panels**: Use multiple selection mode with form controls inside
3. **Feature Lists**: Combine with rich content (images, cards, badges)
4. **Installation Steps**: Use sequential keys and highlight current step
5. **Documentation Sections**: Use with code examples and keep content mounted
6. **Product Details**: Use startContent for icons/images with detailed specs
7. **Dynamic Forms**: Use keepContentMounted to preserve form state
8. **Guided Workflows**: Programmatically control expanded items for tutorials

---

## Related Components

- **Tabs**: For horizontal navigation between sections (alternative to accordion)
- **Card**: For grouping related content (can be used with accordion items)
- **Divider**: For visual separation (automatically managed in accordion)
- **Button**: For interactive actions within accordion items
- **Input/Form Components**: Commonly placed inside accordion items
- **Avatar**: Often used with `startContent` for user-related accordions
- **Chip/Badge**: For labeling or categorizing accordion items
- **CollapsibleSection/Details**: Native HTML alternative

---

Research completed: 2025-11-05
Component: Accordion
Framework: HeroUI
Documentation: https://www.heroui.com/docs/components/accordion
