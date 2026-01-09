# ShadCN Spinner (Loader) Component - Usage Patterns Research

**Component**: Spinner (Loader)
**Framework**: ShadCN
**Research Date**: 2025-11-04
**Distribution Model**: Copy-Paste (Radix + Tailwind)

---

## 1. Component Overview

The ShadCN Spinner is a minimalist loading indicator component designed to provide visual feedback during asynchronous operations. Unlike traditional component libraries, ShadCN uses a **copy-paste distribution model** where components are copied directly into your project and customized as needed. The Spinner component is built using the `LoaderIcon` from Lucide React combined with Tailwind CSS's animation utilities, providing a simple, accessible loading state indicator that can be easily integrated into buttons, forms, and other UI elements.

---

## 2. Installation/Setup

### CLI Installation (Recommended)

ShadCN provides a CLI tool that automatically adds components to your project:

```bash
pnpm dlx shadcn@latest add spinner
```

This command:
- Downloads the component source code
- Adds it to your project's components directory (typically `@/components/ui/spinner.tsx`)
- Ensures all dependencies are installed

### Manual Copy-Paste

Alternatively, you can manually create the component file:

**File**: `components/ui/spinner.tsx`

```typescript
import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
```

### Dependencies

- **lucide-react**: Icon library providing the LoaderIcon
- **@/lib/utils**: Utility function for className merging (typically using `clsx` or `tailwind-merge`)
- **Tailwind CSS**: Required for the `animate-spin` and `size-*` utilities

### Copy-Paste Model Note

Because ShadCN uses a copy-paste approach, the component code lives **in your project**, not in node_modules. This means:
- Full control over the implementation
- No version lock-in or breaking changes from updates
- Easy to customize without worrying about upgrades
- The component is yours to modify as needed

---

## 3. Basic Usage

### Simple Spinner

```typescript
import { Spinner } from "@/components/ui/spinner"

export function SpinnerDemo() {
  return <Spinner />
}
```

### With Loading Text

```typescript
export function LoadingState() {
  return (
    <div className="flex items-center gap-2">
      <Spinner />
      <span>Loading...</span>
    </div>
  )
}
```

### Conditional Rendering

```typescript
export function ConditionalSpinner({ isLoading }: { isLoading: boolean }) {
  return (
    <div>
      {isLoading ? <Spinner /> : <p>Content loaded</p>}
    </div>
  )
}
```

---

## 4. Props/API

The Spinner component accepts all standard SVG element props via spreading.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes to merge with defaults |
| `role` | `string` | `"status"` | ARIA role (inherited from LoaderIcon wrapper) |
| `aria-label` | `string` | `"Loading"` | Accessible label for screen readers |
| **SVG Props** | | | |
| `width` | `number \| string` | — | SVG width (overridden by size classes) |
| `height` | `number \| string` | — | SVG height (overridden by size classes) |
| `fill` | `string` | — | SVG fill color |
| `stroke` | `string` | — | SVG stroke color |
| `strokeWidth` | `number \| string` | — | SVG stroke width |
| `viewBox` | `string` | — | SVG viewBox attribute |
| ...other | `React.ComponentProps<"svg">` | — | Any other valid SVG attributes |

**Default Applied Classes**:
- `size-4`: Sets width and height to 1rem (16px)
- `animate-spin`: Applies continuous rotation animation

**Note**: The component uses `React.ComponentProps<"svg">` which provides full TypeScript support for all SVG attributes.

---

## 5. Variants & Patterns

### Size Variants

The Spinner uses Tailwind's size utilities for consistent sizing:

```typescript
// Extra Small (0.75rem / 12px)
<Spinner className="size-3" />

// Small (1rem / 16px) - DEFAULT
<Spinner className="size-4" />

// Medium (1.5rem / 24px)
<Spinner className="size-6" />

// Large (2rem / 32px)
<Spinner className="size-8" />

// Extra Large (3rem / 48px)
<Spinner className="size-12" />

// Custom size
<Spinner className="w-5 h-5" />
```

### Color Variants

Control color through Tailwind text utilities (colors the SVG stroke):

```typescript
// Primary
<Spinner className="text-primary" />

// Destructive/Error
<Spinner className="text-destructive" />

// Muted
<Spinner className="text-muted-foreground" />

// Success (custom)
<Spinner className="text-green-500" />

// Warning (custom)
<Spinner className="text-yellow-500" />

// Custom opacity
<Spinner className="text-blue-500/50" />
```

### Animation Speed Customization

Modify the animation speed by customizing or extending the component:

```typescript
// Slower spin
<Spinner className="animate-[spin_2s_linear_infinite]" />

// Faster spin
<Spinner className="animate-[spin_0.5s_linear_infinite]" />
```

Or extend Tailwind config for reusable variants:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
      }
    }
  }
}
```

Then use:
```typescript
<Spinner className="animate-spin-slow" />
<Spinner className="animate-spin-fast" />
```

### Icon Replacement

Replace the LoaderIcon with any other spinning icon from Lucide:

```typescript
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

function CustomSpinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}
```

---

## 6. Implementation Details

### Underlying Primitives

The Spinner component is built on:

1. **Lucide React Icons**: Provides the `LoaderIcon` SVG
2. **Tailwind CSS**: Provides utilities (`animate-spin`, `size-*`)
3. **Class Name Utility**: The `cn()` function merges classes intelligently

### Component Structure

```
Spinner Component
├── LoaderIcon (from lucide-react)
│   ├── SVG element
│   ├── Accessibility attributes (role, aria-label)
│   └── Default + custom classes
└── Props spreading (all SVG props accepted)
```

### How It's Built

```typescript
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon                           // 1. Lucide icon component
      role="status"                        // 2. Accessibility: ARIA role
      aria-label="Loading"                 // 3. Accessibility: screen reader label
      className={cn("size-4 animate-spin", className)}  // 4. Merge default + custom classes
      {...props}                           // 5. Spread all other SVG props
    />
  )
}
```

**Key Design Decisions**:
- Uses `LoaderIcon` (circle with partial arc) for visual clarity
- Relies on Tailwind's built-in `animate-spin` (360° rotation)
- Props spreading enables full SVG customization
- `cn()` utility ensures proper class merging (custom classes override defaults)

---

## 7. Composition Patterns

### With Buttons

#### Loading Button State

```typescript
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function LoadingButton() {
  return (
    <Button disabled>
      <Spinner className="mr-2" />
      Loading...
    </Button>
  )
}
```

#### Conditional Button Loading

```typescript
export function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button disabled={isLoading}>
      {isLoading && <Spinner className="mr-2" />}
      {isLoading ? "Submitting..." : "Submit"}
    </Button>
  )
}
```

### With Badges

```typescript
import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }: { status: "pending" | "complete" }) {
  return (
    <Badge>
      {status === "pending" && <Spinner className="mr-1 size-3" />}
      {status === "pending" ? "Processing" : "Complete"}
    </Badge>
  )
}
```

### With Input Groups

```typescript
import { Input } from "@/components/ui/input"

export function SearchInput({ isSearching }: { isSearching: boolean }) {
  return (
    <div className="relative">
      <Input placeholder="Search..." />
      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Spinner className="size-4" />
        </div>
      )}
    </div>
  )
}
```

### In Cards/Empty States

```typescript
import { Card, CardContent } from "@/components/ui/card"

export function LoadingCard() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Spinner className="size-8 mb-4" />
        <p className="text-sm text-muted-foreground">Loading data...</p>
      </CardContent>
    </Card>
  )
}
```

### In Item Lists

```typescript
export function DownloadItem({ isDownloading }: { isDownloading: boolean }) {
  return (
    <div className="flex items-center gap-3 p-4 border rounded">
      {isDownloading ? (
        <Spinner className="size-5" />
      ) : (
        <CheckIcon className="size-5 text-green-500" />
      )}
      <div>
        <p className="font-medium">file.pdf</p>
        <p className="text-sm text-muted-foreground">
          {isDownloading ? "Downloading..." : "Complete"}
        </p>
      </div>
    </div>
  )
}
```

### Centered Page Loading

```typescript
export function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-12" />
        <p className="text-muted-foreground">Loading page...</p>
      </div>
    </div>
  )
}
```

---

## 8. Styling & Theming

### Tailwind Classes

The Spinner leverages these Tailwind utilities:

#### Size Utilities

```typescript
size-3  // 0.75rem (12px)
size-4  // 1rem (16px) - default
size-6  // 1.5rem (24px)
size-8  // 2rem (32px)
size-12 // 3rem (48px)
```

#### Color Utilities

```typescript
text-primary           // Primary brand color
text-destructive       // Error/danger color
text-muted-foreground  // Muted/subtle color
text-blue-500          // Custom color
text-current           // Inherits parent text color
```

#### Animation Utilities

```typescript
animate-spin  // Continuous 360° rotation (1s duration)
```

### CSS Variables (Theming)

ShadCN uses CSS variables for theming. The Spinner inherits these from your theme:

```css
/* globals.css or theme file */
:root {
  --primary: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --muted-foreground: 215.4 16.3% 46.9%;
  /* ... other theme variables */
}

.dark {
  --primary: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --muted-foreground: 215 20.2% 65.1%;
  /* ... other dark mode overrides */
}
```

When using `text-primary`, the Spinner automatically adapts to light/dark themes.

### Customization Approaches

#### 1. Inline Class Customization

Most straightforward for one-off uses:

```typescript
<Spinner className="size-6 text-blue-500" />
```

#### 2. Wrapper Component

For consistent project-wide variants:

```typescript
// components/ui/spinner-variants.tsx
import { Spinner } from "./spinner"

export function LargeSpinner() {
  return <Spinner className="size-8" />
}

export function PrimarySpinner() {
  return <Spinner className="text-primary" />
}

export function ErrorSpinner() {
  return <Spinner className="size-6 text-destructive" />
}
```

#### 3. Direct Component Modification

Since the component lives in your project, modify it directly:

```typescript
// Change default size from size-4 to size-6
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-6 animate-spin", className)}  // Changed here
      {...props}
    />
  )
}
```

#### 4. CSS Module Styling (Advanced)

For complex custom styling:

```css
/* spinner.module.css */
.customSpinner {
  animation: customSpin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  color: hsl(var(--primary));
}

@keyframes customSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

```typescript
import styles from "./spinner.module.css"

<Spinner className={styles.customSpinner} />
```

---

## 9. Accessibility

### Built-in Accessibility Features

The Spinner component includes proper ARIA attributes out of the box:

#### Role Attribute

```typescript
role="status"
```

- Identifies the element as a status indicator
- Announces changes to assistive technologies
- Appropriate for loading states that update live

#### ARIA Label

```typescript
aria-label="Loading"
```

- Provides screen reader-friendly text
- Announces "Loading" when focused or when status changes
- Essential since the icon is purely visual

### Accessibility Best Practices

#### 1. Always Pair with Text Labels (When Possible)

```typescript
// Good: Visible text for all users
<Button disabled>
  <Spinner className="mr-2" />
  Loading...
</Button>

// Acceptable: Icon-only with proper aria-label
<Spinner aria-label="Loading data" />

// Bad: Icon-only without context
<Spinner />
```

#### 2. Disable Interactive Elements During Loading

```typescript
// Good: Button disabled while loading
<Button disabled={isLoading}>
  {isLoading && <Spinner className="mr-2" />}
  Submit
</Button>

// Bad: Button clickable while loading
<Button onClick={handleSubmit}>
  {isLoading && <Spinner className="mr-2" />}
  Submit
</Button>
```

#### 3. Use aria-live for Dynamic Status Updates

```typescript
export function LoadingStatus({ message }: { message: string }) {
  return (
    <div aria-live="polite" className="flex items-center gap-2">
      <Spinner />
      <span>{message}</span>
    </div>
  )
}
```

#### 4. Provide Context for Spinner-Only States

```typescript
// Customize aria-label for specific contexts
<Spinner aria-label="Validating email address" />
<Spinner aria-label="Uploading file" />
<Spinner aria-label="Refreshing data" />
```

### Keyboard Support

The Spinner itself is non-interactive and doesn't require keyboard support. However:

- Ensure buttons containing spinners remain focusable (even when disabled, if appropriate)
- Use `aria-busy="true"` on containers being loaded:

```typescript
<div aria-busy={isLoading}>
  {isLoading ? <Spinner /> : <DataTable data={data} />}
</div>
```

---

## 10. Best Practices

### When to Use

#### ✅ Good Use Cases

1. **Button Loading States**: Indicate form submission or action processing
2. **Data Fetching**: Show while API requests are in progress
3. **Background Operations**: Indicate sync, upload, or download progress
4. **Lazy Loading**: Display while components/images load
5. **Validation**: Show during async form validation

#### ❌ Avoid Using For

1. **Known Long Operations**: Use progress bars instead (>5 seconds)
2. **Page Transitions**: Consider skeleton loaders for better UX
3. **Multiple Simultaneous Operations**: Use specific indicators per operation
4. **Without Context**: Always provide accompanying text or labels

### Common Customizations

#### Size Consistency

Match spinner size to the element it's paired with:

```typescript
// Small button → small spinner
<Button size="sm">
  <Spinner className="size-3" />
  Loading
</Button>

// Default button → default spinner
<Button>
  <Spinner className="size-4" />
  Loading
</Button>

// Large button → large spinner
<Button size="lg">
  <Spinner className="size-5" />
  Loading
</Button>
```

#### Color Coordination

Use semantic colors:

```typescript
// Error/destructive actions
<Button variant="destructive" disabled>
  <Spinner className="text-destructive-foreground" />
  Deleting...
</Button>

// Success/primary actions
<Button variant="default" disabled>
  <Spinner className="text-primary-foreground" />
  Saving...
</Button>

// Subtle/ghost buttons
<Button variant="ghost" disabled>
  <Spinner className="text-muted-foreground" />
  Loading...
</Button>
```

#### Spacing and Layout

Consistent spacing when combining with text:

```typescript
// Horizontal layout (spinner before text)
<div className="flex items-center gap-2">
  <Spinner />
  <span>Loading...</span>
</div>

// Vertical layout (centered)
<div className="flex flex-col items-center gap-2">
  <Spinner />
  <span>Loading...</span>
</div>

// Inline with margin
<Button disabled>
  <Spinner className="mr-2" />
  Submit
</Button>
```

### Gotchas and Common Mistakes

#### 1. Forgetting to Disable Buttons

**Problem**: Button remains clickable during loading

```typescript
// ❌ Bad: Can be clicked multiple times
<Button onClick={handleSubmit}>
  {isLoading && <Spinner />}
  Submit
</Button>

// ✅ Good: Disabled during loading
<Button onClick={handleSubmit} disabled={isLoading}>
  {isLoading && <Spinner className="mr-2" />}
  {isLoading ? "Submitting..." : "Submit"}
</Button>
```

#### 2. Missing Loading State Cleanup

**Problem**: Spinner persists after operation completes due to forgotten state reset

```typescript
// ✅ Good: Always reset loading state
const handleSubmit = async () => {
  setIsLoading(true)
  try {
    await submitForm()
  } catch (error) {
    // Handle error
  } finally {
    setIsLoading(false)  // Always reset
  }
}
```

#### 3. Using Wrong Size Units

**Problem**: Mixing size utilities with manual width/height

```typescript
// ❌ Bad: Conflicting size declarations
<Spinner className="size-4 w-6 h-6" />

// ✅ Good: Use one approach
<Spinner className="size-6" />
// OR
<Spinner className="w-6 h-6" />
```

#### 4. Accessibility Labels Missing Context

**Problem**: Generic "Loading" label for specific operations

```typescript
// ❌ Bad: Vague label
<Spinner aria-label="Loading" />  // Loading what?

// ✅ Good: Specific label
<Spinner aria-label="Loading user profile" />
```

#### 5. Overriding animate-spin Incorrectly

**Problem**: Adding conflicting animation classes

```typescript
// ❌ Bad: Conflicting animations
<Spinner className="animate-pulse" />  // Removes spin animation

// ✅ Good: Extend or replace properly
<Spinner className="animate-[spin_2s_linear_infinite]" />
```

### Performance Considerations

- Spinners are lightweight (single SVG icon)
- CSS animations are GPU-accelerated via `animate-spin`
- No re-render performance concerns
- Safe to use multiple spinners on a page

### Testing Tips

```typescript
// Testing spinner visibility
import { render, screen } from "@testing-library/react"

test("shows spinner during loading", () => {
  render(<MyComponent isLoading={true} />)
  expect(screen.getByRole("status")).toBeInTheDocument()
  expect(screen.getByLabelText("Loading")).toBeInTheDocument()
})

test("hides spinner after loading", () => {
  const { rerender } = render(<MyComponent isLoading={true} />)
  rerender(<MyComponent isLoading={false} />)
  expect(screen.queryByRole("status")).not.toBeInTheDocument()
})
```

---

## 11. Comparison Notes: Copy-Paste Model vs Traditional Component Libraries

### How the Copy-Paste Model Affects Usage

#### Traditional Component Library Approach

**Example: Material-UI, Chakra UI, Ant Design**

```typescript
// Installed as npm dependency
import { CircularProgress } from "@mui/material"

// Used directly with library-defined props
<CircularProgress size={40} color="primary" />

// Upgrades may introduce breaking changes
npm update @mui/material  // ⚠️ Risk of breaks
```

**Characteristics**:
- ✅ Easy to install and update
- ✅ Consistent API across team projects
- ❌ Version lock-in and breaking changes
- ❌ Limited customization without overrides/theming
- ❌ Bundle size includes entire library
- ❌ Dependent on maintainer support

#### ShadCN Copy-Paste Approach

```typescript
// Component lives in YOUR project
import { Spinner } from "@/components/ui/spinner"

// Direct modification of source code
// File: components/ui/spinner.tsx (yours to edit)

// No version dependencies to break
// No npm update needed - component is frozen in time
```

**Characteristics**:
- ✅ Full ownership and control
- ✅ Zero breaking changes from updates
- ✅ Customize without fighting the library
- ✅ Minimal bundle size (only what you use)
- ✅ No vendor lock-in
- ❌ Manual updates if you want new features
- ❌ Less consistency across different projects
- ❌ More initial setup per project

### Practical Implications for Spinner

#### Customization Freedom

**Traditional Library**:
```typescript
// Customization via props/theme
<CircularProgress
  size={40}
  sx={{ color: "custom.color" }}  // Theme override
/>
```

**ShadCN**:
```typescript
// Direct source modification
// Edit components/ui/spinner.tsx directly
function Spinner({ className, ...props }) {
  return (
    <MyCustomIcon  // Swap icon entirely
      className={cn("size-6 animate-bounce", className)}  // Change defaults
      {...props}
    />
  )
}
```

#### Update Strategy

**Traditional Library**:
```bash
# Updates all components at once
npm update @mui/material

# May break existing spinners if API changes
```

**ShadCN**:
```bash
# Re-run CLI to get latest version
pnpm dlx shadcn@latest add spinner

# Prompts to overwrite or shows diff
# You choose what changes to accept
```

#### Versioning and Consistency

**Traditional Library**:
- Single source of truth (node_modules)
- All projects using v5.0 have identical behavior
- Team-wide consistency enforced by package.json

**ShadCN**:
- Each project has its own frozen version
- Project A and Project B can have different implementations
- Consistency achieved through code sharing (copy files between projects)

### When to Choose Copy-Paste (ShadCN) vs Traditional Library

**Choose ShadCN Copy-Paste Model When**:
- You need extensive customization beyond theming
- You want zero risk of breaking changes
- You prefer owning your component code
- You're building a custom design system
- Bundle size optimization is critical
- You want to learn component internals

**Choose Traditional Component Library When**:
- You need rapid prototyping with zero setup
- You want automatic updates and bug fixes
- You value ecosystem plugins and integrations
- You need strict consistency across many projects
- You have limited frontend expertise
- You want community support and patterns

### Impact on Development Workflow

**ShadCN Workflow**:
```bash
# 1. Install component (once per project)
pnpm dlx shadcn@latest add spinner

# 2. Use in your code
import { Spinner } from "@/components/ui/spinner"

# 3. Customize directly
# Edit components/ui/spinner.tsx

# 4. No package updates to worry about
# Component is now part of your codebase
```

**Traditional Library Workflow**:
```bash
# 1. Install library (once per project)
npm install @mui/material

# 2. Import from library
import { CircularProgress } from "@mui/material"

# 3. Customize via theme/props
<ThemeProvider theme={customTheme}>
  <CircularProgress />
</ThemeProvider>

# 4. Monitor for updates
npm update @mui/material
```

### Summary Table

| Aspect | ShadCN (Copy-Paste) | Traditional Library |
|--------|---------------------|---------------------|
| **Installation** | CLI copies to project | npm install package |
| **Location** | `src/components/ui/` | `node_modules/` |
| **Customization** | Edit source directly | Props/theme overrides |
| **Updates** | Manual re-add | `npm update` |
| **Breaking Changes** | None (frozen) | Possible on update |
| **Bundle Size** | Minimal (only used components) | Entire library |
| **Learning Curve** | See actual code | Read documentation |
| **Consistency** | Per-project | Cross-project |
| **TypeScript** | Fully typed in your project | Library definitions |
| **Testing** | Direct access to source | Test through API |

---

## Key Findings Summary

### Architecture Insights

1. **Extreme Minimalism**: The Spinner is one of the simplest ShadCN components (9 lines of code)
2. **Composition Over Configuration**: Uses existing primitives (Lucide icon + Tailwind utilities)
3. **Accessibility First**: Includes proper ARIA attributes by default
4. **Zero JavaScript Logic**: Pure presentational component, all behavior via CSS

### Unique Characteristics

1. **No Built-in Variants**: Unlike other frameworks, no size="sm" props—uses Tailwind classes
2. **Icon Swappable**: Easy to replace LoaderIcon with any Lucide icon
3. **SVG-Based**: Not a custom animation, just a rotating SVG icon
4. **Theme-Aware**: Automatically adapts to light/dark themes via CSS variables

### Most Common Use Cases (from documentation)

1. **Button loading states** (disabled buttons with spinner + text)
2. **Form validation feedback** (input groups with spinner)
3. **List item status** (download/sync progress indicators)
4. **Empty states** (centered with loading message)
5. **Badge status** (ongoing operations in small badges)

### Developer Experience Highlights

- **Fast to customize**: Just edit the source file in your project
- **No props to memorize**: Accepts standard SVG props + className
- **Predictable sizing**: Tailwind size utilities work as expected
- **Easy testing**: Uses semantic role="status" for queries

### Potential Gotchas for Semantic UI Implementation

1. **No prop-based variants**: Would need to add size/color props for traditional API
2. **Requires Tailwind**: The `animate-spin` utility is Tailwind-specific
3. **Single icon dependency**: LoaderIcon from Lucide is hardcoded
4. **No built-in delay**: Shows immediately (no delay prop for short operations)
5. **No determinate mode**: Only indeterminate spinner (no progress percentage)

---

**End of Research Report**
