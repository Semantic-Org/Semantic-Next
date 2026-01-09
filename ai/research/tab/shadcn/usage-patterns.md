# ShadCN UI - Tabs Usage Patterns

> Last Modified: 2025-11-05
> Source: https://ui.shadcn.com/docs/components/tabs

## Component URL
https://ui.shadcn.com/docs/components/tabs
Status: ✅ Working
Version: Current (Radix UI v2, Tailwind v4 compatible)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-structured with clear examples, Radix UI integration documentation, and detailed variant documentation. Strong foundation from Radix UI Tabs primitive.

## Component Definition
- **Core purpose**: Displays a list of tabbed content where users can switch between different content panels by clicking tab triggers. Built on Radix UI's accessible Tabs primitive.
- **Mental model**: A compound component system that manages tab state (which tab is active) and coordinates between clickable tab triggers and their corresponding content panels. The user clicks a trigger, and the associated content becomes visible.
- **Semantic meaning**: Represents a tabbed interface for organizing related content into logical sections. Each tab trigger is a semantic button controlling the visibility of related content panels.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text labels | ✅ | Native | Standard text content in TabsTrigger |
| Icon support | ✅ | Composed | Icons can be included in triggers via children composition |
| Icon + Text | ✅ | Composed | Icons and text compose naturally within triggers |
| Badge/Count | ✅ | Composed | Badges can be added in triggers as children |
| Disabled tabs | ✅ | Native | `disabled` prop on individual TabsTrigger elements |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal tabs | ✅ | Native | Default orientation - tabs arranged horizontally |
| Vertical tabs | ✅ | Native | `orientation="vertical"` prop enables vertical layout |
| Default tab | ✅ | Native | `defaultValue` sets which tab is initially active |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active tab | ✅ | Native | `value` prop shows which tab is active, `onValueChange` for changes |
| Disabled tab | ✅ | Native | `disabled` attribute on TabsTrigger prevents interaction |
| Focus management | ✅ | Native | Built-in focus handling between tabs |
| Controlled state | ✅ | Native | Fully controllable via `value` and `onValueChange` |
| Uncontrolled state | ✅ | Native | `defaultValue` for uncontrolled usage |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal orientation | ✅ | Native | Default - tabs displayed left-to-right |
| Vertical orientation | ✅ | Native | `orientation="vertical"` - tabs displayed top-to-bottom |
| Custom styling | ✅ | Native | Accepts className prop for Tailwind overrides |
| Activation mode | ✅ | Native | `activationMode="automatic"` or `"manual"` for tab selection behavior |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Tab selection | ✅ | Native | Click trigger to activate tab and display content |
| Keyboard navigation | ✅ | Native | Arrow keys to navigate, Enter/Space to activate |
| Programmatic control | ✅ | Native | `value` prop and `onValueChange` callback |
| Animations | ✅ | CSS-only | Fade/slide animations via Tailwind classes |

## Code Examples

### Installation
```bash
pnpm dlx shadcn@latest add tabs
```

### Basic Import and Usage
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Basic tabs
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account tab content
  </TabsContent>
  <TabsContent value="password">
    Password tab content
  </TabsContent>
</Tabs>
```

### Controlled Tabs
```typescript
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ControlledTabs() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Overview content
      </TabsContent>
      <TabsContent value="analytics">
        Analytics content
      </TabsContent>
      <TabsContent value="reports">
        Reports content
      </TabsContent>
    </Tabs>
  )
}
```

### Tabs with Icons
```typescript
import { FileText, Bell, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TabsWithIcons() {
  return (
    <Tabs defaultValue="documents">
      <TabsList>
        <TabsTrigger value="documents" className="gap-2">
          <FileText className="h-4 w-4" />
          Documents
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="documents">
        Documents list
      </TabsContent>
      <TabsContent value="notifications">
        Notifications list
      </TabsContent>
      <TabsContent value="settings">
        Settings form
      </TabsContent>
    </Tabs>
  )
}
```

### Vertical Tabs
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function VerticalTabs() {
  return (
    <Tabs defaultValue="general" orientation="vertical" className="flex gap-4">
      <TabsList className="flex flex-col h-auto w-40">
        <TabsTrigger value="general" className="justify-start">General</TabsTrigger>
        <TabsTrigger value="appearance" className="justify-start">Appearance</TabsTrigger>
        <TabsTrigger value="notifications" className="justify-start">Notifications</TabsTrigger>
        <TabsTrigger value="privacy" className="justify-start">Privacy</TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="general">
          General settings
        </TabsContent>
        <TabsContent value="appearance">
          Appearance settings
        </TabsContent>
        <TabsContent value="notifications">
          Notification settings
        </TabsContent>
        <TabsContent value="privacy">
          Privacy settings
        </TabsContent>
      </div>
    </Tabs>
  )
}
```

### Tabs with Badge Count
```typescript
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TabsWithBadge() {
  return (
    <Tabs defaultValue="inbox">
      <TabsList>
        <TabsTrigger value="inbox" className="gap-2">
          Inbox
          <Badge variant="secondary">12</Badge>
        </TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
        <TabsTrigger value="spam" className="gap-2">
          Spam
          <Badge variant="destructive">3</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inbox">
        Inbox messages (12)
      </TabsContent>
      <TabsContent value="archived">
        Archived messages
      </TabsContent>
      <TabsContent value="spam">
        Spam messages (3)
      </TabsContent>
    </Tabs>
  )
}
```

### Disabled Tabs
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DisabledTabs() {
  return (
    <Tabs defaultValue="free">
      <TabsList>
        <TabsTrigger value="free">Free Plan</TabsTrigger>
        <TabsTrigger value="pro">Pro Plan</TabsTrigger>
        <TabsTrigger value="enterprise" disabled>Enterprise (Coming Soon)</TabsTrigger>
      </TabsList>
      <TabsContent value="free">
        Features for free plan
      </TabsContent>
      <TabsContent value="pro">
        Features for pro plan
      </TabsContent>
      <TabsContent value="enterprise">
        Enterprise features
      </TabsContent>
    </Tabs>
  )
}
```

### Manual Activation Tabs
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ManualActivationTabs() {
  return (
    <Tabs defaultValue="tab1" activationMode="manual">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        Content 1 (requires Enter/Space to activate)
      </TabsContent>
      <TabsContent value="tab2">
        Content 2
      </TabsContent>
      <TabsContent value="tab3">
        Content 3
      </TabsContent>
    </Tabs>
  )
}
```

### Tabs with Forms
```typescript
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function TabsWithForms() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        Profile content
      </TabsContent>
      <TabsContent value="account">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update Account</Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  )
}
```

### Scrollable Tabs
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ScrollableTabs() {
  const tabs = Array.from({ length: 20 }, (_, i) => `Tab ${i + 1}`)

  return (
    <Tabs defaultValue="Tab 1">
      <TabsList className="w-full overflow-x-auto">
        {tabs.map(tab => (
          <TabsTrigger key={tab} value={tab} className="whitespace-nowrap">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab} value={tab}>
          Content for {tab}
        </TabsContent>
      ))}
    </Tabs>
  )
}
```

### Complete Example with Multiple Patterns
```typescript
import { useState } from "react"
import { FileText, Clock, Share2, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DocumentTabs() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview" className="gap-2">
          <FileText className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="history" className="gap-2">
          <Clock className="h-4 w-4" />
          History
          <Badge variant="secondary">5</Badge>
        </TabsTrigger>
        <TabsTrigger value="sharing" className="gap-2">
          <Share2 className="h-4 w-4" />
          Sharing
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Document Overview</h3>
          <p className="text-sm text-muted-foreground">
            This document contains important project information.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="font-medium">Oct 15, 2024</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Modified</p>
            <p className="font-medium">Nov 5, 2024</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <h3 className="text-lg font-semibold">Version History</h3>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Version {i}</p>
                <p className="text-xs text-muted-foreground">Nov {5 - i}, 2024</p>
              </div>
              <Button variant="ghost" size="sm">
                Restore
              </Button>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="sharing" className="space-y-4">
        <h3 className="text-lg font-semibold">Share Document</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">john@example.com</p>
              <p className="text-xs text-muted-foreground">Can edit</p>
            </div>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Button>Add People</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
```

## Notable Features

### Radix UI Tabs Primitive Foundation
- Built on `@radix-ui/react-tabs` - industry-standard accessible tabs primitive
- Radix provides core tab state management, keyboard navigation, and ARIA attributes
- ShadCN adds Tailwind styling on top of Radix's unstyled primitives

### Compound Component Architecture
- **Tabs** - Root container managing overall state
- **TabsList** - Container for tab triggers (horizontal or vertical)
- **TabsTrigger** - Individual clickable tab button
- **TabsContent** - Content panel associated with each trigger

### Full Keyboard Navigation
- Arrow keys to navigate between tabs (Left/Right for horizontal, Up/Down for vertical)
- Home/End keys to jump to first/last tab
- Enter/Space to activate a tab (in manual activation mode)
- Tab key for focus management

### Flexible Orientation
- Horizontal (default) - tabs displayed left to right
- Vertical - tabs displayed top to bottom
- Requires different CSS layout for vertical orientation

### Activation Modes
- **Automatic** (default) - Tabs activate when focused via keyboard
- **Manual** - Requires explicit Enter/Space to activate, useful for forms
- Prevents accidental content switching during keyboard navigation

### Tailwind CSS + Radix Integration
- Built with Tailwind utility classes
- Uses CSS custom properties for theming
- Data attributes for state styling (`data-[state=active]`)
- Easy to customize by modifying component file

### Copy-Paste Philosophy
- Not an npm package - code is copied into your project
- Full source customization without fighting framework constraints
- No version lock-in or breaking changes
- You own the implementation

## Styling & Theming

### Base Styling Classes
The TabsList uses flex layout for horizontal arrangement:
```tsx
className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1"
```

TabsTrigger styling includes state-specific styles:
```tsx
className={cn(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium",
  "ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  "data-[state=active]:bg-background data-[state=active]:text-foreground",
  "data-[state=active]:shadow-sm"
)}
```

### CSS Variables for Theming
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --ring: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
}
```

### Customization Approaches

#### 1. Via className Prop
```tsx
<TabsList className="w-full grid grid-cols-3">
  <TabsTrigger value="tab1" className="text-lg">Tab 1</TabsTrigger>
</TabsList>
```

#### 2. Vertical Layout Customization
```tsx
<Tabs orientation="vertical" className="flex gap-4">
  <TabsList className="flex flex-col h-auto w-40">
    {/* Triggers */}
  </TabsList>
  <div className="flex-1">
    {/* Content */}
  </div>
</Tabs>
```

#### 3. Data Attribute Styling
```tsx
<TabsTrigger
  value="tab"
  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
>
  Tab
</TabsTrigger>
```

#### 4. Component File Modification
Edit `/components/ui/tabs.tsx` directly for app-wide styling changes:
```tsx
const TabsTrigger = React.forwardRef<...>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center rounded-sm",
        "font-semibold", // Your custom default
        "data-[state=active]:bg-blue-500", // Your active style
        className
      )}
      {...props}
      ref={ref}
    />
  )
)
```

### Theming Best Practices
1. **Use CSS Variables** - Leverage ShadCN's CSS variable system
2. **Respect Dark Mode** - Always provide dark variants
3. **Maintain Accessibility** - Don't remove focus indicators
4. **Use Data Attributes** - Prefer `data-[state=active]` for state styling
5. **Keep Consistent Sizing** - Use standard sizes across tabs

## Accessibility

### ARIA Attributes from Radix
- `role="tablist"` on TabsList
- `role="tab"` on TabsTrigger
- `role="tabpanel"` on TabsContent
- `aria-selected="true|false"` on active/inactive triggers
- `aria-controls` connecting triggers to content
- `tabindex="0"` for focusable elements
- `aria-disabled="true"` on disabled tabs

### Keyboard Support
| Key | Action |
|-----|--------|
| `ArrowRight` / `ArrowDown` | Move focus to next tab |
| `ArrowLeft` / `ArrowUp` | Move focus to previous tab |
| `Home` | Move focus to first tab |
| `End` | Move focus to last tab |
| `Space` / `Enter` | Activate focused tab (manual mode) |
| `Tab` | Move focus out of tabs to next element |

### Focus Management
- Clear focus indicators with ring styles
- Focus automatically moves with arrow keys
- Tab key exits the tab list (standard behavior)
- Disabled tabs are skipped during navigation

### Screen Reader Support
- Screen readers announce "tab list" with number of tabs
- Each trigger announced as "tab" with selected state
- Content panels announced as "tabpanel"
- Relationships between triggers and content conveyed automatically

### Best Practices for Accessibility
1. **Unique tab values** - Each tab must have distinct `value` prop
2. **Semantic content** - Use proper HTML in content panels
3. **Avoid disabled tabs when possible** - Hide unavailable tabs instead
4. **Test keyboard navigation** - Verify all tabs accessible via keyboard
5. **Test with screen readers** - Confirm announcements are clear
6. **Don't remove focus indicators** - Essential for keyboard users

## Best Practices

### When to Use Tabs
**Use tabs for:**
- Organizing related content into sections
- Settings panels with multiple sections
- Dashboard views with different data perspectives
- Forms with multiple steps (though consider wizard pattern)
- Documentation with related sections
- Media galleries or portfolios

**Don't use tabs for:**
- Primary navigation (use Nav components)
- Main page sections (use dedicated pages)
- Sequential processes (consider wizard/stepper)
- Single content item with small amount of data

### Common Customizations

#### 1. Full-Width Tabs
```tsx
<TabsList className="w-full grid grid-cols-3">
  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  <TabsTrigger value="tab3">Tab 3</TabsTrigger>
</TabsList>
```

#### 2. Underline Style
```tsx
<TabsTrigger
  value="tab1"
  className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-blue-500 bg-transparent"
>
  Tab 1
</TabsTrigger>
```

#### 3. Animated Content
```tsx
<TabsContent
  value="tab1"
  className="animate-in fade-in duration-300"
>
  Content with fade-in animation
</TabsContent>
```

#### 4. Responsive Grid
```tsx
<TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {/* Triggers */}
</TabsList>
```

#### 5. Custom Separator
```tsx
<TabsList className="border-b-2 border-muted rounded-none">
  <TabsTrigger value="tab1" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
    Tab 1
  </TabsTrigger>
</TabsList>
```

### Gotchas and Pitfalls

**1. Missing Value Props**
```tsx
// ❌ Wrong - no value to match content
<TabsTrigger>Tab</TabsTrigger>

// ✅ Correct - unique values
<TabsTrigger value="unique-tab-id">Tab</TabsTrigger>
```

**2. Content Value Mismatch**
```tsx
// ❌ Wrong - value doesn't match any trigger
<TabsContent value="different-value">Content</TabsContent>

// ✅ Correct - matches trigger value
<TabsContent value="tab1">Content for Tab 1</TabsContent>
```

**3. Missing defaultValue**
```tsx
// ❌ Wrong - no tab is initially active
<Tabs>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
</Tabs>

// ✅ Correct - first tab active by default
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
</Tabs>
```

**4. Vertical Orientation Styling Issues**
```tsx
// ❌ Wrong - horizontal layout persists
<Tabs orientation="vertical">
  <TabsList>
    {/* Still displays horizontally */}
  </TabsList>
</Tabs>

// ✅ Correct - proper vertical layout
<Tabs orientation="vertical" className="flex gap-4">
  <TabsList className="flex flex-col h-auto">
    {/* Now displays vertically */}
  </TabsList>
</Tabs>
```

**5. Controlled State without Handling Changes**
```tsx
// ❌ Wrong - value never changes
const [tab, setTab] = useState("tab1")
<Tabs value={tab}>
  {/* Clicking doesn't switch tabs */}
</Tabs>

// ✅ Correct - handle changes
<Tabs value={tab} onValueChange={setTab}>
  {/* Now switching works */}
</Tabs>
```

**6. Content Not Displaying**
```tsx
// ❌ Wrong - TabsContent only renders active content
// If TabsContent is conditionally rendered, it won't work

// ✅ Correct - all TabsContent should be present
<Tabs>
  {/* All TabsContent rendered, only active one visible */}
</Tabs>
```

### Performance Considerations

1. **Lazy Load Content**: Consider lazy-loading heavy content in tabs
```tsx
<TabsContent value="heavy-tab">
  {activeTab === "heavy-tab" && <HeavyComponent />}
</TabsContent>
```

2. **Memoize Callbacks**: If triggering expensive operations
```tsx
const handleTabChange = useCallback((value) => {
  fetchTabData(value)
}, [])
```

3. **Avoid Re-rendering All Tabs**: Keep tab list and content separate
```tsx
<div>
  <Tabs value={tab} onValueChange={setTab}>
    <TabsList>{/* Minimal */}</TabsList>
  </Tabs>
  <div>
    {/* Content rendered separately */}
    <TabsContent value={tab}>...</TabsContent>
  </div>
</div>
```

## Underlying Implementation

### Radix UI Integration Points

The ShadCN Tabs component wraps **@radix-ui/react-tabs** with these mappings:

- **Tabs** → `Radix Tabs.Root` (state management, orientation)
- **TabsList** → `Radix Tabs.List` (container for triggers)
- **TabsTrigger** → `Radix Tabs.Trigger` (clickable tab button)
- **TabsContent** → `Radix Tabs.Content` (content panel)

### Component Structure

```tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1",
      className
    )}
    {...props}
  />
))

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium",
      "ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-background data-[state=active]:text-foreground",
      "data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

### How It Works

1. **Client Component**: Uses `"use client"` for Next.js App Router
2. **Forward Refs**: All components use `forwardRef` for proper ref forwarding
3. **Type Safety**: TypeScript types extend Radix primitives
4. **Class Merging**: `cn()` utility merges Tailwind classes
5. **Primitive Wrapping**: Wraps Radix primitives with ShadCN styling
6. **State Management**: Radix handles tab state, keyboard navigation, ARIA

## Research Notes

### Framework Approach
ShadCN Tabs follows the copy-paste philosophy:
- **Not a package**: Components are copied into your codebase, not installed
- **Full ownership**: You have complete control over the implementation
- **Composition-first**: Built on composable Radix UI primitives
- **Tailwind + Radix**: Combines Radix primitives with Tailwind styling

### Design Philosophy
- **Minimalist API**: Relies on Radix for state management
- **Compound pattern**: Multiple components work together
- **Accessibility-first**: Built on Radix UI's accessible primitives
- **Unstyled foundation**: Radix provides functionality, ShadCN adds styling

### Pattern Observations
1. **State Management**: Radix handles all tab state management
2. **Keyboard Navigation**: Full arrow key support built-in
3. **Orientation Flexibility**: Supports both horizontal and vertical layouts
4. **Controlled & Uncontrolled**: Works both ways via value/onValueChange
5. **Content Lazy Loading**: All content is present in DOM but hidden
6. **Focus Management**: Automatic focus handling via Radix

### Strengths
- Built on battle-tested Radix UI primitives
- Full keyboard navigation out of the box
- Simple, predictable API
- Easy customization via Tailwind classes
- Excellent accessibility support
- Flexible orientation support
- No external dependencies beyond Radix

### Potential Limitations
- All content rendered in DOM (may impact performance with many heavy tabs)
- Content animations need custom implementation
- No built-in lazy loading of content
- Vertical layout requires custom CSS structure
- Limited visual variations out of the box

### Semantic UI Integration Considerations
- **API Design**: Consider whether to expose Radix primitives or create higher-level API
- **State Management**: Decide between Radix-style dual API or simplified props-only
- **Orientation**: Ensure vertical layout works seamlessly
- **Styling**: Evaluate whether to use CSS-in-JS vs Tailwind approach
- **Accessibility**: Ensure equal or better ARIA support than Radix
- **Content Loading**: Consider lazy-loading support for heavy content panels
- **Keyboard Modes**: Consider supporting both automatic and manual activation modes

## Summary

The ShadCN Tabs component is a straightforward, accessible tab interface built on Radix UI's battle-tested Tabs primitive. It provides:

- **Clean Composition API**: Root, List, Trigger, and Content components
- **Full Keyboard Support**: Arrow keys, Home/End, Enter/Space navigation
- **Flexible Layouts**: Horizontal or vertical orientation
- **State Management**: Both controlled and uncontrolled modes
- **Customizable Styling**: Via Tailwind classes and CSS variables
- **Production Ready**: Accessible by default via Radix UI foundation
- **Copy-Paste Ownership**: You control the code completely

The component excels at organizing related content into logical sections with excellent accessibility and intuitive keyboard navigation. Its simplicity and reliance on Radix primitives makes it a solid foundation for custom tab-based interfaces.
