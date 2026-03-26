# shadcn/ui - Calendar Usage Patterns

> Last Modified: 2025-11-10

## Component URL
https://ui.shadcn.com/docs/components/calendar
Status: ✅ Working
Version: Built on React DayPicker (specific version not documented)
Framework: Tailwind v3/v4 compatible, React with "use client" directive
Last Verified: 2025-11-10

## Documentation Quality
Good - Clear component usage examples with practical implementations. Provides installation commands, basic to advanced examples, and integration patterns. However, lacks comprehensive API documentation for all props (relies on React DayPicker docs for advanced features).

## Component Definition
- **Core purpose**: Provides a date selection interface supporting single dates, date ranges, and multiple date selections with flexible display options and natural language parsing capabilities.
- **Mental model**: A composable date picker foundation built on React DayPicker, designed to be embedded in popovers, forms, or used standalone. Emphasizes flexibility through mode switching and caption layout variations.
- **Semantic meaning**: Represents temporal data selection with visual calendar metaphor. Communicates current selection, available dates, and navigation through months/years. Supports both precise date picking and range selection for scheduling/booking scenarios.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `mode="single"`, `captionLayout="dropdown"`, `numberOfMonths={2}`)
- **Composed**: Via composition/wrappers (e.g., wrapping in Popover, combining with Input for date+time)
- **React DayPicker**: Extended features via underlying library (e.g., disabled dates, modifiers, custom rendering)
- **CSS-only**: Requires custom styling (e.g., custom cell sizes via `--cell-size` variable)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Date display | ✅ | Native | Calendar grid displays dates for selected month(s). Default month controlled via `defaultMonth` prop |
| Caption/Header | ✅ | Native | Configurable via `captionLayout`: "label" (static), "dropdown" (month+year), "dropdown-months" (month only), "dropdown-years" (year only) |
| Multiple months | ✅ | Native | `numberOfMonths={2}` displays consecutive months, commonly used for range selection |
| Month navigation | ✅ | Native | Built-in previous/next month navigation buttons. Month can be controlled via `month` and `onMonthChange` props |
| Week display | ⚠️ | React DayPicker | Week numbers and week selection supported via React DayPicker props (not explicitly documented in shadcn/ui) |
| Custom rendering | ⚠️ | React DayPicker | Date cell customization available through React DayPicker's component props (not shown in examples) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single date | ✅ | Native | `mode="single"` - Select one date. Returns `Date \| undefined` |
| Date range | ✅ | Native | `mode="range"` - Select from/to dates. Returns `DateRange` type with `from` and `to` properties |
| Multiple dates | ✅ | Native | `mode="multiple"` - Select multiple individual dates (mentioned but no example provided) |
| Month picker | ⚠️ | Composed | Achievable via `captionLayout="dropdown-months"` but requires custom handling |
| Year picker | ⚠️ | Composed | Achievable via `captionLayout="dropdown-years"` but requires custom handling |
| Week picker | ❌ | React DayPicker | Not documented, but likely available through React DayPicker |
| Quarter picker | ❌ | Custom | Not supported, would require custom implementation |
| Date + Time | ✅ | Composed | Shown via example combining Calendar with native HTML time input |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled dates | ⚠️ | React DayPicker | Supported via React DayPicker props but not documented in shadcn/ui examples |
| Selected state | ✅ | Native | `selected` prop accepts Date, DateRange, or Date[] depending on mode |
| Min/Max dates | ⚠️ | React DayPicker | Available through React DayPicker's `fromDate` and `toDate` props (not documented) |
| Today indicator | ✅ | Native | Current date visually highlighted by default styling |
| Controlled state | ✅ | Native | Fully controlled via `selected` and `onSelect` props |
| Uncontrolled state | ❌ | N/A | Component appears to require controlled state management |
| Loading state | ❌ | Custom | Not provided, would need custom implementation |
| Error state | ❌ | Custom | Not provided, would need custom validation wrapper |
| Read-only | ⚠️ | React DayPicker | Likely available via React DayPicker's `disabled` prop |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | CSS-only | Custom cell sizing via `--cell-size` CSS variable: `[--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]` |
| Custom styling | ✅ | Native | `className` prop for Tailwind classes. Supports shadow, border, rounded corners |
| Button variants | ✅ | Native | `buttonVariant="ghost"` prop for day button styling |
| Caption layouts | ✅ | Native | Four options: label, dropdown, dropdown-months, dropdown-years |
| Locale support | ⚠️ | React DayPicker | Internationalization via React DayPicker locale prop (not documented) |
| RTL support | ⚠️ | React DayPicker | Mentioned as available but no examples |
| Alternative calendars | ✅ | Composed | Persian/Hijri/Jalali calendar via importing `react-day-picker/persian` |
| Timezone handling | ✅ | Native | `timeZone` prop for accurate date display across timezones. Auto-detected via `Intl.DateTimeFormat().resolvedOptions().timeZone` |
| Date presets | ❌ | Custom | Common preset ranges (Last 7 days, This month) not provided out of box |
| Natural language | ✅ | Composed | Integration example with `chrono-node` for parsing phrases like "In 2 days", "next week" |

## Code Examples

### Basic Single Date Selection
```typescript
"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
    />
  )
}
```

### Date Range Selection
```typescript
"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"

export function Calendar05() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  })

  return (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm"
    />
  )
}
```

### Date and Time Picker (Popover Integration)
```typescript
"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Calendar24() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="10:30:00"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
```

### Natural Language Date Parsing
```typescript
"use client"

import * as React from "react"
import { parseDate } from "chrono-node"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function Calendar29() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("In 2 days")
  const [date, setDate] = React.useState<Date | undefined>(
    parseDate(value) || undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Schedule Date
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="Tomorrow or next week"
          className="bg-background pr-10"
          onChange={(e) => {
            setValue(e.target.value)
            const date = parseDate(e.target.value)
            if (date) {
              setDate(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date)
                setValue(formatDate(date))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="text-muted-foreground px-1 text-sm">
        Your post will be published on{" "}
        <span className="font-medium">{formatDate(date)}</span>.
      </div>
    </div>
  )
}
```

### Caption Layout Variations
```typescript
"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Calendar13() {
  const [dropdown, setDropdown] =
    React.useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    )
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        captionLayout={dropdown}
        className="rounded-lg border shadow-sm"
      />
      <div className="flex flex-col gap-3">
        <Label htmlFor="dropdown" className="px-1">
          Dropdown
        </Label>
        <Select
          value={dropdown}
          onValueChange={(value) =>
            setDropdown(
              value as React.ComponentProps<typeof Calendar>["captionLayout"]
            )
          }
        >
          <SelectTrigger
            id="dropdown"
            size="sm"
            className="bg-background w-full"
          >
            <SelectValue placeholder="Dropdown" />
          </SelectTrigger>
          <SelectContent align="center">
            <SelectItem value="dropdown">Month and Year</SelectItem>
            <SelectItem value="dropdown-months">Month Only</SelectItem>
            <SelectItem value="dropdown-years">Year Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
```

### Custom Cell Size (Responsive)
```typescript
"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export function Calendar18() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
      buttonVariant="ghost"
    />
  )
}
```

### Timezone-Aware Calendar
```typescript
"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export function CalendarWithTimezone() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [timeZone, setTimeZone] = React.useState<string>()

  React.useEffect(() => {
    // Detect user's timezone on client side to prevent hydration mismatch
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      timeZone={timeZone}
      className="rounded-md border"
    />
  )
}
```

### Persian/Hijri Calendar
```typescript
"use client"

import * as React from "react"
// Import Persian calendar variant
import { DayPicker } from "react-day-picker/persian"
import { Calendar } from "@/components/ui/calendar"

export function PersianCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  // Replace the Calendar component import with Persian DayPicker
  // Configuration follows standard Calendar API
  return (
    <DayPicker
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}
```

## Notable Features

### Built on React DayPicker
- shadcn/ui's Calendar is a styled wrapper around React DayPicker
- Full React DayPicker API accessible for advanced features
- Documentation references React DayPicker docs for extended functionality
- Enables features like disabled dates, modifiers, and custom renderers through underlying library

### Flexible Caption Layouts
- **Label mode**: Static month/year display for minimal interface
- **Dropdown mode**: Combined month and year dropdowns for quick navigation
- **Dropdown-months**: Month-only selection, useful for financial reports
- **Dropdown-years**: Year-only selection, useful for date of birth pickers
- Enables optimizing UX for different date selection scenarios

### Mode-Based Selection Types
- Single date selection for simple date inputs
- Range selection with visual from/to highlighting
- Multiple dates selection for event scheduling
- Type-safe with TypeScript (`Date`, `DateRange`, `Date[]`)

### Multi-Month Display
- `numberOfMonths={2}` shows consecutive months
- Particularly useful for range selection UX
- Enables users to see entire range span
- Improves booking/reservation interfaces

### Natural Language Date Parsing
- Integration example with `chrono-node` library
- Accepts phrases like "tomorrow", "next week", "in 2 days"
- Provides text input with calendar fallback
- Enhances accessibility and speed for power users

### Timezone Support
- `timeZone` prop ensures correct date display
- Critical for applications with global users
- Auto-detects via `Intl.DateTimeFormat()`
- Client-side detection prevents hydration mismatches

### Popover Integration Pattern
- Calendar typically embedded in Popover component
- Provides space-efficient date picker UI
- Auto-closes on selection for streamlined UX
- Common pattern shown across multiple examples

### Custom Cell Sizing
- CSS variable `--cell-size` for responsive sizing
- Tailwind utility classes for breakpoint-specific sizes
- Example: `[--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]`
- Enables mobile-optimized calendar layouts

### Button Variant Customization
- `buttonVariant` prop for day button styling
- Example: `buttonVariant="ghost"` for subtle appearance
- Integrates with shadcn/ui design system
- Maintains consistency with other UI components

### Alternative Calendar Systems
- Support for Persian/Hijri/Jalali calendars
- Requires importing alternative DayPicker variant
- Shows cultural awareness in internationalization
- Important for applications serving Middle Eastern markets

### Controlled State Management
- Fully controlled component pattern
- `selected` + `onSelect` for date state
- `month` + `onMonthChange` for navigation state
- Enables complex date validation and business logic

### TypeScript Integration
- Strong typing for all props and callbacks
- `DateRange` type for range selections
- Type-safe mode-based return types
- Enhances developer experience and prevents bugs

## Research Notes

### Access & Documentation
- Documentation successfully accessed at https://ui.shadcn.com/docs/components/calendar
- Installation via CLI command: `pnpm dlx shadcn@latest add calendar`
- Built on React DayPicker (https://react-day-picker.js.org)
- Tailwind v3 and v4 compatible with upgrade guide provided

### Framework Approach Observations

**Component Philosophy:**
- Wrapper/adapter pattern - provides styled interface to React DayPicker
- Minimal abstraction - exposes underlying library capabilities
- Composition-first - designed to be embedded in Popovers, Forms, etc.
- Not a standalone date picker widget but a calendar building block

**Documentation Strategy:**
- Shows practical examples over exhaustive API documentation
- Assumes familiarity with React DayPicker for advanced features
- Focuses on common use cases (single, range, datetime)
- References React DayPicker docs for comprehensive API

**Integration Patterns:**
- Strong emphasis on Popover integration for space efficiency
- Natural language parsing as advanced UX enhancement
- Timezone handling for global applications
- Form integration through composition (not built-in form props)

**Styling Approach:**
- Tailwind-based with CSS variable extensibility
- Custom cell sizing via `--cell-size` variable
- Responsive sizing through Tailwind breakpoint utilities
- Consistent with shadcn/ui design system tokens

**TypeScript First:**
- All examples use TypeScript syntax
- Type-safe props and callbacks
- Generic types for different modes (`Date`, `DateRange`, `Date[]`)
- Strong typing improves DX and prevents runtime errors

**Mode-Based API:**
- Single prop (`mode`) determines selection behavior and return type
- Simple but powerful abstraction
- TypeScript ensures correct usage patterns
- Avoids prop explosion while maintaining flexibility

**Accessibility Considerations:**
- Keyboard navigation via ArrowDown mentioned
- Screen reader text in examples (`<span className="sr-only">`)
- Native HTML time input for time selection
- Semantic HTML structure from React DayPicker

**Gaps in Documentation:**
- No explicit examples for disabled dates (available via React DayPicker)
- Min/Max date restrictions not documented
- Custom date rendering/modifiers not shown
- Form validation patterns not included
- Loading states not addressed
- Error handling not demonstrated

**Strengths:**
- Clean, minimal API surface
- Strong TypeScript integration
- Practical, real-world examples
- Excellent composition patterns
- Timezone awareness
- Alternative calendar system support

**Potential Challenges:**
- Requires React (no vanilla JS version)
- Depends on external library (React DayPicker)
- Advanced features require consulting separate docs
- Controlled component requires state management
- No built-in form integration (requires composition)
- Limited styling examples beyond basics

**Comparison to Other Frameworks:**
- More minimal than Ant Design's comprehensive DatePicker
- Composition-focused vs monolithic component
- Relies on ecosystem (Popover, Input) vs all-in-one
- Less opinionated about form integration
- Lighter weight but requires more assembly

**Use Case Optimization:**
- Excellent for custom date pickers in design systems
- Good for applications needing flexible calendar displays
- Well-suited for booking/reservation interfaces (range selection)
- Appropriate for global applications (timezone support)
- Less ideal if you need out-of-box form integration

**Design System Integration:**
- Part of larger shadcn/ui component library
- Consistent styling with Button, Popover, Input, etc.
- Uses shared design tokens via Tailwind
- Follows shadcn/ui installation patterns (CLI-based)

**Notable Design Decisions:**
- Calendar as primitive building block (not complete date picker)
- Composition over configuration
- Minimal prop API, leverage React DayPicker for advanced needs
- TypeScript-first approach
- Client directive required ("use client") for React Server Components

**Versioning & Maintenance:**
- No version numbers in documentation
- References Tailwind v3/v4 compatibility
- Active maintenance implied by upgrade guides
- Built on stable React DayPicker library
