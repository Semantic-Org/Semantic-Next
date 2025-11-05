# Radix UI Primitives - Tabs Usage Patterns

> **Framework**: Radix UI Primitives (Unstyled)
> **Component**: Tabs
> **Version**: 1.1.13 (as of January 2025)
> **Official Documentation**: https://www.radix-ui.com/primitives/docs/components/tabs
> **Package**: `@radix-ui/react-tabs`
> **Last Verified**: 2025-01-04

---

## 1. Component Overview

The Radix UI Tabs is an **unstyled primitive component** that provides a fully accessible tabbed interface implementation adhering to the WAI-ARIA Tabs design pattern. Unlike styled component libraries, Radix Primitives focus entirely on behavior, accessibility, and functionality, leaving all visual styling to the developer. This primitive handles complex implementation details including ARIA attributes, focus management, keyboard navigation, orientation support, and activation modes, while providing complete flexibility for custom styling through any CSS approach (vanilla CSS, CSS-in-JS, Tailwind, etc.).

The Tabs component organizes content into separate panels displayed one at a time, supporting both horizontal and vertical orientations. It provides automatic or manual activation modes where automatic mode activates tabs on focus (like navigating to a browser tab) and manual mode requires an explicit selection. This primitive is ideal for dashboards, settings panels, documentation tabs, and any interface requiring organized content switching.

---

## 2. Installation & Setup

### Installation

```bash
npm install @radix-ui/react-tabs
```

### Basic Import

```javascript
import * as Tabs from "@radix-ui/react-tabs";
```

### Alternative Named Imports

```javascript
import {
  Root,
  List,
  Trigger,
  Content,
} from "@radix-ui/react-tabs";
```

---

## 3. Basic Usage

Since Radix Primitives are unstyled, you must add your own styling. Here's a minimal example with inline styles:

```jsx
import * as Tabs from "@radix-ui/react-tabs";

function BasicTabs() {
  return (
    <Tabs.Root defaultValue="tab1" style={{ display: "flex", flexDirection: "column" }}>
      <Tabs.List style={{ display: "flex", borderBottom: "1px solid #e5e5e5" }}>
        <Tabs.Trigger
          value="tab1"
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderBottom: "2px solid transparent",
          }}
        >
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger
          value="tab2"
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderBottom: "2px solid transparent",
          }}
        >
          Tab 2
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="tab1" style={{ padding: "16px" }}>
        <p>Content for Tab 1</p>
      </Tabs.Content>
      <Tabs.Content value="tab2" style={{ padding: "16px" }}>
        <p>Content for Tab 2</p>
      </Tabs.Content>
    </Tabs.Root>
  );
}
```

### With Tailwind CSS

```jsx
<Tabs.Root defaultValue="tab1">
  <Tabs.List className="flex border-b border-gray-200">
    <Tabs.Trigger
      value="tab1"
      className="px-4 py-2 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
    >
      Tab 1
    </Tabs.Trigger>
    <Tabs.Trigger
      value="tab2"
      className="px-4 py-2 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
    >
      Tab 2
    </Tabs.Trigger>
    <Tabs.Trigger
      value="tab3"
      className="px-4 py-2 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
    >
      Tab 3
    </Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="tab1" className="p-4">
    <h2 className="text-lg font-semibold mb-2">Tab 1 Content</h2>
    <p className="text-gray-600">This is the content for the first tab.</p>
  </Tabs.Content>

  <Tabs.Content value="tab2" className="p-4">
    <h2 className="text-lg font-semibold mb-2">Tab 2 Content</h2>
    <p className="text-gray-600">This is the content for the second tab.</p>
  </Tabs.Content>

  <Tabs.Content value="tab3" className="p-4">
    <h2 className="text-lg font-semibold mb-2">Tab 3 Content</h2>
    <p className="text-gray-600">This is the content for the third tab.</p>
  </Tabs.Content>
</Tabs.Root>
```

---

## 4. API/Props - Component Parts

### 4.1 Tabs.Root

**Purpose**: Container for all parts of a tabbed interface.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | - | Initial active tab value (uncontrolled) |
| `value` | `string` | - | Controlled active tab value |
| `onValueChange` | `(value: string) => void` | - | Callback when active tab changes |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction of tabs |
| `activationMode` | `"automatic" \| "manual"` | `"automatic"` | When tabs activate on arrow key navigation |
| `dir` | `"ltr" \| "rtl"` | - | Reading direction for proper layout |

**Behavior Modes**:
- **`activationMode="automatic"`** (default): Moving arrow keys activates the tab immediately
- **`activationMode="manual"`**: Arrow keys focus the trigger, Space/Enter activates

**Usage**:
```jsx
// Uncontrolled
<Tabs.Root defaultValue="tab1">

// Controlled
const [activeTab, setActiveTab] = useState("tab1");
<Tabs.Root value={activeTab} onValueChange={setActiveTab}>

// Vertical tabs
<Tabs.Root defaultValue="tab1" orientation="vertical">

// Manual activation mode
<Tabs.Root defaultValue="tab1" activationMode="manual">
```

---

### 4.2 Tabs.List

**Purpose**: Container for all tab triggers. Manages keyboard navigation and focus.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loop` | `boolean` | `true` | Circular keyboard navigation (arrow keys wrap around) |

**ARIA Attributes Applied**:
- `role="tablist"` - Identifies this as a tab list
- `aria-orientation` - Reflects horizontal/vertical orientation

**Data Attributes**:
- `[data-orientation]` - Current orientation (`horizontal` or `vertical`)

**Usage**:
```jsx
<Tabs.List loop={true}>
  {/* Triggers */}
</Tabs.List>

<Tabs.List loop={false}>
  {/* Arrow navigation stops at first/last tab */}
</Tabs.List>
```

---

### 4.3 Tabs.Trigger

**Purpose**: The button that activates a tab (shows associated content).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | **Required**. Unique value identifying this tab |
| `disabled` | `boolean` | `false` | Prevents activation and keyboard focus |
| `asChild` | `boolean` | `false` | Merges props with child element instead of rendering button |

**ARIA Attributes Applied**:
- `role="tab"` - Identifies as a tab control
- `aria-selected="true|false"` - Whether this tab is currently active
- `aria-controls="content-id"` - References associated Content
- `aria-disabled="true"` - When disabled

**Data Attributes**:
- `[data-state]` - Current state (`active` or `inactive`)
- `[data-disabled]` - Present when disabled
- `[data-orientation]` - Orientation context (`horizontal` or `vertical`)

**Usage**:
```jsx
// Default button
<Tabs.Trigger value="tab1">
  Tab 1
</Tabs.Trigger>

// Custom element with asChild
<Tabs.Trigger value="tab1" asChild>
  <button className="custom-tab">Tab 1</button>
</Tabs.Trigger>

// Disabled tab
<Tabs.Trigger value="tab1" disabled>
  Disabled Tab
</Tabs.Trigger>
```

---

### 4.4 Tabs.Content

**Purpose**: The panel container displayed when associated trigger is active.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | **Required**. Must match a Trigger's value |
| `forceMount` | `boolean` | `false` | Force mount for animation control |
| `asChild` | `boolean` | `false` | Merges props with child element |

**ARIA Attributes Applied**:
- `role="tabpanel"` - Identifies as a tab panel
- `aria-labelledby="trigger-id"` - References associated Trigger
- `id="content-id"` - Auto-generated for aria-controls relationship

**Data Attributes**:
- `[data-state]` - Current state (`active` or `inactive`)
- `[data-orientation]` - Orientation context (`horizontal` or `vertical`)

**Behavior**:
- Content is unmounted/hidden when inactive (unless `forceMount=true`)
- Hidden content is removed from DOM (good for performance)
- Animated transitions require `forceMount` to control visibility

**Usage**:
```jsx
<Tabs.Content value="tab1">
  <p>Content for Tab 1</p>
</Tabs.Content>

// Force mount for animations
<Tabs.Content value="tab1" forceMount style={{ display: "none" }}>
  {/* Use CSS transitions for show/hide */}
</Tabs.Content>

// Custom element
<Tabs.Content value="tab1" asChild>
  <div className="tab-panel">Content</div>
</Tabs.Content>
```

---

## 5. Component Composition

### 5.1 Basic Structure

```jsx
<Tabs.Root defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
    <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
  <Tabs.Content value="tab3">Content 3</Tabs.Content>
</Tabs.Root>
```

### 5.2 Complete Example with All Features

```jsx
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";

function AdvancedTabs() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      defaultValue="account"
      className="w-full"
    >
      {/* Tab List */}
      <Tabs.List className="flex border-b border-gray-200 bg-gray-50">
        <Tabs.Trigger
          value="account"
          className="px-4 py-2 border-b-2 border-transparent cursor-pointer hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
        >
          Account
        </Tabs.Trigger>

        <Tabs.Trigger
          value="password"
          className="px-4 py-2 border-b-2 border-transparent cursor-pointer hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
        >
          Password
        </Tabs.Trigger>

        <Tabs.Trigger
          value="notifications"
          className="px-4 py-2 border-b-2 border-transparent cursor-pointer hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
        >
          Notifications
        </Tabs.Trigger>

        <Tabs.Trigger
          value="advanced"
          disabled
          className="px-4 py-2 border-b-2 border-transparent cursor-pointer hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
        >
          Advanced (Disabled)
        </Tabs.Trigger>
      </Tabs.List>

      {/* Tab Panels */}
      <Tabs.Content value="account" className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account Settings</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              defaultValue="user@example.com"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              defaultValue="john_doe"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </Tabs.Content>

      <Tabs.Content value="password" className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded" />
          </div>
        </div>
      </Tabs.Content>

      <Tabs.Content value="notifications" className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Notification Preferences</h2>
          <div className="flex items-center">
            <input type="checkbox" id="email-notif" defaultChecked className="mr-2" />
            <label htmlFor="email-notif">Email Notifications</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="push-notif" className="mr-2" />
            <label htmlFor="push-notif">Push Notifications</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="sms-notif" className="mr-2" />
            <label htmlFor="sms-notif">SMS Notifications</label>
          </div>
        </div>
      </Tabs.Content>

      <Tabs.Content value="advanced" className="p-6">
        <p>Advanced settings content...</p>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default AdvancedTabs;
```

---

## 6. State Management

### 6.1 Uncontrolled (Default)

The component manages its own active tab state internally:

```jsx
<Tabs.Root defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs.Root>
```

### 6.2 Controlled

You manage the active tab state externally:

```jsx
const [activeTab, setActiveTab] = useState("tab1");

<Tabs.Root value={activeTab} onValueChange={setActiveTab}>
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs.Root>

// External control
<button onClick={() => setActiveTab("tab2")}>
  Switch to Tab 2
</button>
```

### 6.3 Data Attributes for State-Based Styling

Tab state is exposed via data attributes for CSS-driven styling:

```css
/* Style active tabs */
[data-state="active"] {
  border-bottom: 2px solid #0070f3;
  color: #0070f3;
}

[data-state="inactive"] {
  color: #666;
}

/* Style disabled tabs */
[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

/* Orientation-based styling */
[data-orientation="vertical"] {
  writing-mode: vertical-rl;
}
```

---

## 7. Styling Approaches

Since Radix Primitives are completely unstyled, you have full flexibility in how you style them.

### 7.1 Vanilla CSS

```css
/* styles.css */
.tabs-root {
  display: flex;
  flex-direction: column;
}

.tabs-list {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  background: #f9f9f9;
}

.tabs-trigger {
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: color 150ms ease;
}

.tabs-trigger:hover {
  color: #333;
}

.tabs-trigger[data-state="active"] {
  color: #0070f3;
  border-bottom-color: #0070f3;
}

.tabs-trigger[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.tabs-content {
  padding: 16px;
  animation: fadeIn 200ms ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

```jsx
<Tabs.Root defaultValue="tab1" className="tabs-root">
  <Tabs.List className="tabs-list">
    <Tabs.Trigger value="tab1" className="tabs-trigger">
      Tab 1
    </Tabs.Trigger>
    <Tabs.Trigger value="tab2" className="tabs-trigger">
      Tab 2
    </Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="tab1" className="tabs-content">
    Content 1
  </Tabs.Content>
  <Tabs.Content value="tab2" className="tabs-content">
    Content 2
  </Tabs.Content>
</Tabs.Root>
```

### 7.2 Tailwind CSS

#### Option A: Direct Data Attribute Selectors (Modern)

```jsx
<Tabs.Root defaultValue="tab1">
  <Tabs.List className="flex border-b border-gray-200 bg-gray-50">
    <Tabs.Trigger
      value="tab1"
      className="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
    >
      Tab 1
    </Tabs.Trigger>
    <Tabs.Trigger
      value="tab2"
      className="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
    >
      Tab 2
    </Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="tab1" className="p-4">
    Content 1
  </Tabs.Content>
  <Tabs.Content value="tab2" className="p-4">
    Content 2
  </Tabs.Content>
</Tabs.Root>
```

#### Option B: tailwindcss-radix Plugin

Install: `npm install tailwindcss-radix`

Configure `tailwind.config.js`:
```javascript
module.exports = {
  plugins: [require("tailwindcss-radix")],
};
```

Usage:
```jsx
<Tabs.Trigger className="px-4 py-2 radix-state-active:border-b-2 radix-state-active:border-blue-500 radix-disabled:opacity-50">
  Tab
</Tabs.Trigger>
```

### 7.3 CSS-in-JS (styled-components, emotion)

```jsx
import styled from "styled-components";
import * as Tabs from "@radix-ui/react-tabs";

const StyledRoot = styled(Tabs.Root)`
  display: flex;
  flex-direction: column;
`;

const StyledList = styled(Tabs.List)`
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  background: #f9f9f9;
`;

const StyledTrigger = styled(Tabs.Trigger)`
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  color: #666;
  font-weight: 500;

  &:hover {
    color: #333;
  }

  &[data-state="active"] {
    color: #0070f3;
    border-bottom-color: #0070f3;
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledContent = styled(Tabs.Content)`
  padding: 16px;
  animation: fadeIn 200ms ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

function StyledTabs() {
  return (
    <StyledRoot defaultValue="tab1">
      <StyledList>
        <StyledTrigger value="tab1">Tab 1</StyledTrigger>
        <StyledTrigger value="tab2">Tab 2</StyledTrigger>
      </StyledList>

      <StyledContent value="tab1">Content 1</StyledContent>
      <StyledContent value="tab2">Content 2</StyledContent>
    </StyledRoot>
  );
}
```

### 7.4 Vertical Tabs Example

```jsx
<Tabs.Root
  defaultValue="tab1"
  orientation="vertical"
  className="flex gap-4"
>
  <Tabs.List className="flex flex-col border-r border-gray-200 bg-gray-50 w-32">
    <Tabs.Trigger
      value="tab1"
      className="px-4 py-2 text-left border-r-2 border-transparent data-[state=active]:border-r-blue-500 data-[state=active]:text-blue-600"
    >
      Tab 1
    </Tabs.Trigger>
    <Tabs.Trigger
      value="tab2"
      className="px-4 py-2 text-left border-r-2 border-transparent data-[state=active]:border-r-blue-500 data-[state=active]:text-blue-600"
    >
      Tab 2
    </Tabs.Trigger>
  </Tabs.List>

  <div className="flex-1">
    <Tabs.Content value="tab1" className="p-4">
      Content 1
    </Tabs.Content>
    <Tabs.Content value="tab2" className="p-4">
      Content 2
    </Tabs.Content>
  </div>
</Tabs.Root>
```

---

## 8. Accessibility

Radix UI Tabs is built with accessibility as a core principle and fully implements the WAI-ARIA Tabs design pattern.

### 8.1 ARIA Attributes (Automatically Applied)

**TabList**:
- `role="tablist"` - Identifies the container as a tab list
- `aria-orientation="horizontal|vertical"` - Reflects layout direction

**Trigger**:
- `role="tab"` - Identifies as a tab control
- `aria-selected="true|false"` - Whether currently active
- `aria-controls="panel-id"` - References associated content panel
- `aria-disabled="true"` - When disabled
- `tabindex="0|-1"` - Roving tabindex (only active trigger is focusable)

**Content**:
- `role="tabpanel"` - Identifies as a tab panel
- `aria-labelledby="trigger-id"` - References associated trigger
- `tabindex="0"` - Content is focusable

### 8.2 Keyboard Navigation

Radix handles all keyboard interactions automatically:

| Key | Action |
|-----|--------|
| `Tab` | Moves focus to the tablist (or first trigger) or into content |
| `Shift+Tab` | Moves focus backward |
| `ArrowRight` / `ArrowDown` | Moves to next tab trigger (horizontal/vertical) |
| `ArrowLeft` / `ArrowUp` | Moves to previous tab trigger |
| `Home` | Moves to first tab trigger |
| `End` | Moves to last tab trigger |

**Activation Behavior**:
- **`activationMode="automatic"`** (default): Arrow keys immediately activate and display the tab
- **`activationMode="manual"`**: Arrow keys only move focus; Space/Enter activates the focused tab

### 8.3 Focus Management

- **Auto-focus**: When tabs receive keyboard focus, the active tab trigger is focused
- **Roving tabindex**: Only one trigger is focusable at a time (active has `tabindex="0"`, others have `tabindex="-1"`)
- **Circular navigation**: Arrow navigation loops from last to first (and vice versa) when `loop={true}`

### 8.4 Screen Reader Announcements

Radix ensures proper announcements through:
- Correct ARIA roles (tablist, tab, tabpanel)
- Dynamic `aria-selected` updates
- Proper labeling via `aria-controls` relationship
- Screen readers announce: "Tab 1, selected, tab, 1 of 3"

### 8.5 Disabled Tabs

Disabled tabs are:
- Skipped in keyboard navigation
- Visually indicated with `data-disabled` attribute
- Marked with `aria-disabled="true"`
- Not interactive

```jsx
<Tabs.Trigger value="tab3" disabled>
  Disabled Tab
</Tabs.Trigger>
```

---

## 9. Best Practices

### 9.1 When to Use Primitives vs Themes

**Use Radix Primitives (this component) when**:
- Building a custom design system from scratch
- You need complete control over styling
- You want flexibility in CSS approach (Tailwind, CSS-in-JS, vanilla CSS, etc.)
- You're implementing brand-specific designs
- You need to match existing design tokens

**Use Radix Themes Tabs when**:
- You want professionally-designed components out of the box
- You need to ship quickly without custom styling
- You're building prototypes or internal tools
- You're comfortable with limited customization options
- You want a cohesive theme system across all components

**Key difference**: Primitives = 100% behavior, 0% style. Themes = behavior + styled components + theme system.

### 9.2 Composition Patterns

#### Pattern 1: Simple Horizontal Tabs

```jsx
<Tabs.Root defaultValue="tab1">
  <Tabs.List className="flex border-b">
    {["Tab 1", "Tab 2", "Tab 3"].map((label, i) => (
      <Tabs.Trigger key={i} value={`tab${i + 1}`} className="px-4 py-2">
        {label}
      </Tabs.Trigger>
    ))}
  </Tabs.List>

  {["Tab 1", "Tab 2", "Tab 3"].map((label, i) => (
    <Tabs.Content key={i} value={`tab${i + 1}`} className="p-4">
      Content for {label}
    </Tabs.Content>
  ))}
</Tabs.Root>
```

#### Pattern 2: Dynamic Tab Content

```jsx
const tabData = [
  { id: "account", label: "Account", content: <AccountSettings /> },
  { id: "security", label: "Security", content: <SecuritySettings /> },
  { id: "notifications", label: "Notifications", content: <NotificationSettings /> },
];

<Tabs.Root defaultValue="account">
  <Tabs.List className="flex border-b">
    {tabData.map((tab) => (
      <Tabs.Trigger key={tab.id} value={tab.id} className="px-4 py-2">
        {tab.label}
      </Tabs.Trigger>
    ))}
  </Tabs.List>

  {tabData.map((tab) => (
    <Tabs.Content key={tab.id} value={tab.id} className="p-4">
      {tab.content}
    </Tabs.Content>
  ))}
</Tabs.Root>
```

#### Pattern 3: Vertical Tabs with Icons

```jsx
import { SettingsIcon, BellIcon, ShieldIcon } from "@radix-ui/react-icons";

<Tabs.Root defaultValue="settings" orientation="vertical" className="flex gap-4">
  <Tabs.List className="flex flex-col border-r w-40">
    <Tabs.Trigger value="settings" className="flex items-center gap-2 px-4 py-2">
      <SettingsIcon /> Settings
    </Tabs.Trigger>
    <Tabs.Trigger value="notifications" className="flex items-center gap-2 px-4 py-2">
      <BellIcon /> Notifications
    </Tabs.Trigger>
    <Tabs.Trigger value="security" className="flex items-center gap-2 px-4 py-2">
      <ShieldIcon /> Security
    </Tabs.Trigger>
  </Tabs.List>

  <div className="flex-1">
    <Tabs.Content value="settings" className="p-4">Settings Content</Tabs.Content>
    <Tabs.Content value="notifications" className="p-4">Notifications Content</Tabs.Content>
    <Tabs.Content value="security" className="p-4">Security Content</Tabs.Content>
  </div>
</Tabs.Root>
```

#### Pattern 4: Lazy-Loaded Content with forceMount

```jsx
const [loadedTabs, setLoadedTabs] = useState({ tab1: true });

<Tabs.Root defaultValue="tab1" onValueChange={(value) => {
  setLoadedTabs((prev) => ({ ...prev, [value]: true }));
}}>
  <Tabs.List className="flex border-b">
    <Tabs.Trigger value="tab1" className="px-4 py-2">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2" className="px-4 py-2">Tab 2 (Lazy)</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="tab1" className="p-4">
    Content 1 (always loaded)
  </Tabs.Content>

  <Tabs.Content value="tab2" className="p-4">
    {loadedTabs.tab2 ? <ExpensiveComponent /> : <p>Loading...</p>}
  </Tabs.Content>
</Tabs.Root>
```

### 9.3 Styling Best Practices

1. **Use data attributes for state-based styling**:
   ```css
   [data-state="active"] { border-bottom: 2px solid blue; }
   [data-state="inactive"] { color: gray; }
   [data-disabled] { opacity: 0.5; cursor: not-allowed; }
   ```

2. **Ensure sufficient contrast for accessibility**:
   - Text vs background should meet WCAG AA standards (4.5:1 minimum)
   - Use clear visual indicators for active/inactive states

3. **Make click/touch targets at least 44×44px** for mobile usability:
   ```jsx
   <Tabs.Trigger className="px-4 py-2 min-h-[44px]">
     Tab
   </Tabs.Trigger>
   ```

4. **Support both horizontal and vertical orientations**:
   ```css
   [data-orientation="horizontal"] { flex-direction: row; }
   [data-orientation="vertical"] { flex-direction: column; }
   ```

5. **Consider animation performance**:
   ```css
   .tabs-content {
     animation: fadeIn 200ms ease;
   }

   @media (prefers-reduced-motion: reduce) {
     .tabs-content {
       animation: none;
     }
   }
   ```

### 9.4 Performance Considerations

1. **Use lazy loading for expensive content**:
   ```jsx
   const [activeTab, setActiveTab] = useState("tab1");

   <Tabs.Content value="tab1">
     {activeTab === "tab1" ? <ExpensiveComponent /> : null}
   </Tabs.Content>
   ```

2. **Memoize dynamic content** if it's expensive to compute:
   ```jsx
   const memoizedContent = useMemo(() => renderContent(activeTab), [activeTab]);
   ```

3. **Use `forceMount` only for animations** (be aware of performance impact):
   ```jsx
   <Tabs.Content forceMount value="tab1">
     {/* Always mounted in DOM, use CSS for visibility */}
   </Tabs.Content>
   ```

4. **Avoid recomputing tab data on every render**:
   ```jsx
   const tabData = useMemo(() => generateTabs(), []);
   ```

---

## 10. Advanced Usage

### 10.1 Controlled Tabs with External Navigation

```jsx
function ControlledTabs() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <>
      {/* External controls */}
      <div className="mb-4 space-x-2">
        <button onClick={() => setActiveTab("tab1")} className="px-3 py-1 bg-blue-500 text-white rounded">
          Go to Tab 1
        </button>
        <button onClick={() => setActiveTab("tab2")} className="px-3 py-1 bg-blue-500 text-white rounded">
          Go to Tab 2
        </button>
        <button onClick={() => setActiveTab("tab3")} className="px-3 py-1 bg-blue-500 text-white rounded">
          Go to Tab 3
        </button>
      </div>

      {/* Tabs controlled by state */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex border-b">
          <Tabs.Trigger value="tab1" className="px-4 py-2">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2" className="px-4 py-2">Tab 2</Tabs.Trigger>
          <Tabs.Trigger value="tab3" className="px-4 py-2">Tab 3</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="tab1" className="p-4">Content 1</Tabs.Content>
        <Tabs.Content value="tab2" className="p-4">Content 2</Tabs.Content>
        <Tabs.Content value="tab3" className="p-4">Content 3</Tabs.Content>
      </Tabs.Root>
    </>
  );
}
```

### 10.2 URL-Based Tab Navigation

```jsx
import { useSearchParams } from "react-router-dom";

function URLTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "tab1";

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };

  return (
    <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
      <Tabs.List className="flex border-b">
        <Tabs.Trigger value="tab1" className="px-4 py-2">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2" className="px-4 py-2">Tab 2</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="tab1" className="p-4">Content 1</Tabs.Content>
      <Tabs.Content value="tab2" className="p-4">Content 2</Tabs.Content>
    </Tabs.Root>
  );
}
```

### 10.3 Manual Activation Mode

```jsx
<Tabs.Root defaultValue="tab1" activationMode="manual">
  <Tabs.List className="flex border-b">
    <Tabs.Trigger value="tab1" className="px-4 py-2">
      Tab 1 (Press Enter to activate)
    </Tabs.Trigger>
    <Tabs.Trigger value="tab2" className="px-4 py-2">
      Tab 2 (Press Enter to activate)
    </Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="tab1" className="p-4">Content 1</Tabs.Content>
  <Tabs.Content value="tab2" className="p-4">Content 2</Tabs.Content>
</Tabs.Root>
```

---

## 11. Comparison Notes: Primitives vs Other Approaches

### Radix Primitives Philosophy

**Unstyled Components**:
- Radix Primitives provide zero styling out of the box
- Complete separation of behavior and presentation
- Maximum flexibility for design systems

**Behavior-First Design**:
- Focus on accessibility, keyboard navigation, ARIA attributes
- Solves complex implementation challenges (focus management, orientation support)
- Developers add styling via any CSS approach they prefer

### vs. Styled Component Libraries

**Styled Libraries** (Material-UI, Ant Design, Chakra UI):
- Provide pre-styled components with themes
- Faster initial development
- Limited customization (override styles via props/theme)
- Risk of "framework look" without extensive customization

**Radix Primitives**:
- No default styling (must style everything)
- Slower initial development, faster long-term iteration
- Complete customization freedom
- Creates unique, branded experiences
- Smaller bundle size (no style dependencies)

### vs. Headless UI / React ARIA

**Similar Philosophy**:
- All three provide unstyled, accessible components
- Focus on behavior and accessibility over styling

**Differences**:
- **Radix**: Rich component composition, data attributes, automatic ARIA
- **Headless UI**: Simpler API, Tailwind-first approach
- **React ARIA**: Lower-level hooks, maximum flexibility, Adobe-backed

**Radix Tabs advantages**:
- Rich data attributes for styling (`data-state`, `data-orientation`, `data-disabled`)
- Automatic ARIA attribute management
- Multiple orientation support (horizontal/vertical)
- Activation mode control (automatic/manual)
- Clean component API

---

## 12. Key Takeaways

1. **Unstyled Primitive**: Radix Tabs provides behavior and accessibility; you provide all styling.

2. **Simple Component Structure**: Root, List, Trigger, and Content parts make composition straightforward.

3. **Accessibility Built-In**: Full WAI-ARIA Tabs compliance, keyboard navigation, focus management, and screen reader support.

4. **Flexible Activation**: Both automatic (activate on focus) and manual (activate on Space/Enter) modes for different UX patterns.

5. **Orientation Support**: Build horizontal or vertical tab interfaces with the same component.

6. **State Management**: Both controlled and uncontrolled modes; rich data attributes (`data-state`, `data-disabled`) for styling.

7. **Styling Freedom**: Use vanilla CSS, Tailwind, CSS-in-JS, or any approach; leverage data attributes for state-based styling.

8. **Performance-Friendly**: Content can be unmounted when inactive (default) or kept mounted for animations (`forceMount`).

9. **Best for Custom Design Systems**: Choose Primitives when you need complete control; choose Themes for pre-styled components.

---

## Additional Resources

- **Official Documentation**: https://www.radix-ui.com/primitives/docs/components/tabs
- **npm Package**: https://www.npmjs.com/package/@radix-ui/react-tabs
- **GitHub Repository**: https://github.com/radix-ui/primitives
- **CodeSandbox Examples**: https://codesandbox.io/examples/package/@radix-ui/react-tabs
- **WAI-ARIA Tabs Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- **Radix UI Discord**: https://discord.gg/radix-ui
