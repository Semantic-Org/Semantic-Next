# Nuxt UI - Calendar Usage Patterns

> Last Modified: 2025-11-10

## Component URL
https://ui.nuxt.com/components/calendar
Status: ✅ Working
Version: v4.1.0 (Current)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent API documentation with detailed property descriptions, multiple code examples demonstrating all major features, and clear integration patterns with other components (Popover, Button, Chip).

## Component Definition
- **Core purpose**: Provides an interactive calendar interface for selecting single dates, multiple dates, or date ranges with extensive internationalization support through the @internationalized/date library.
- **Mental model**: A date selection interface that adapts its behavior based on selection mode (single/multiple/range) with built-in support for multiple calendar systems, locales, and timezones. Acts as both a standalone widget and as content for date picker popovers.
- **Semantic meaning**: Represents a visual calendar grid for date navigation and selection with clear visual states for selected, disabled, and unavailable dates. Communicates date availability, constraints, and current selection state through color and interaction patterns.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `v-model`, `multiple`, `range`, `disabled`, `size="xl"`, `minValue`, `maxValue`)
- **Composed**: Via composition/children (e.g., slot-based day customization with `#day`, integration with UButton/UPopover for date pickers)
- **Function-based**: Via function props (e.g., `isDateDisabled`, `isDateUnavailable` predicate functions)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Date input | ✅ | Native | `v-model` accepts `CalendarDate`, array of `CalendarDate`, or `{start, end}` object depending on mode |
| Calendar popup | ✅ | Composed | Integrates with `UPopover` component for date picker UI pattern. Examples show popover with calendar content |
| Time selection | ❌ | N/A | No time selection capabilities - pure date component. Time handling would require separate component |
| Custom format | ✅ | Composed | Uses `DateFormatter` from @internationalized/date for display formatting. Example: `new DateFormatter('en-US', { dateStyle: 'medium' })` |
| Event indicators | ✅ | Composed | Via `#day` slot with `UChip` component to show colored indicators on specific dates |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single date | ✅ | Native | Default mode. `v-model` binds to single `CalendarDate` value. Example: `v-model="ref(new CalendarDate(2022, 2, 3))"` |
| Date range | ✅ | Native | `range` prop enables range selection. `v-model` binds to object with `{start: CalendarDate, end: CalendarDate}` |
| Multiple dates | ✅ | Native | `multiple` prop enables multi-select. `v-model` binds to array of `CalendarDate` values |
| Month picker | ⚠️ | Partial | Can navigate by month via `monthControls` but no dedicated month-only selection mode |
| Year picker | ⚠️ | Partial | Can navigate by year via `yearControls` but no dedicated year-only selection mode |
| Week picker | ❌ | N/A | No week selection mode available |
| Quarter picker | ❌ | N/A | No quarter selection mode available |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled={true}` - Disables all calendar interactions globally |
| Read-only | ❌ | N/A | No explicit read-only state. Disabled is the only non-interactive state |
| Error | ❌ | N/A | No error state prop. Validation would be handled externally |
| Loading | ❌ | N/A | No loading state indicator built into component |
| Selected | ✅ | Native | Automatically styled based on `v-model` value. Visual distinction for selected dates |
| Today indicator | ✅ | Native | Current date automatically highlighted (implementation detail, not explicitly documented) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="xs" \| "sm" \| "md" \| "lg" \| "xl"` (default: "md") |
| Color variants | ✅ | Native | `color` prop accepts standard colors. Default: "primary". Example: `color="neutral"` |
| Visual variants | ✅ | Native | `variant="solid" \| "outline" \| "soft" \| "subtle" \| "ghost" \| "link"` (default: "solid") |
| Restrictions | ✅ | Native + Function | `minValue`, `maxValue` for date boundaries. `isDateDisabled` function for custom logic |
| Disabled dates | ✅ | Function-based | `isDateDisabled={(date) => boolean}` - Predicate function marks dates unselectable |
| Unavailable dates | ✅ | Function-based | `isDateUnavailable={(date) => boolean}` - Similar to disabled but semantic distinction |
| Locale support | ✅ | Library-based | Via @internationalized/date package. `DateFormatter` accepts locale string (e.g., 'en-US', 'de-DE') |
| Calendar systems | ✅ | Library-based | Supports multiple calendar systems via @internationalized/date: Gregorian, Hebrew, Islamic, Buddhist, etc. |
| Custom rendering | ✅ | Composed | `#day` slot for customizing individual day cells. Receives `{ day }` slot props |
| Preset ranges | ❌ | N/A | No built-in preset date ranges (like "Last 7 days", "This month"). Would need external implementation |
| Timezone support | ✅ | Library-based | Via `getLocalTimeZone()` from @internationalized/date. Handles timezone-aware date conversion |
| Multiple months | ✅ | Native | `numberOfMonths={number}` - Display multiple consecutive months. Default: 1. Example: `:number-of-months="3"` |
| Control visibility | ✅ | Native | `monthControls={boolean}` and `yearControls={boolean}` to show/hide navigation buttons |
| Week layout | ✅ | Native | `fixedWeeks={boolean}` - Toggle between fixed 6-week layout (true, default) or variable week count (false) |

## Code Examples

### Basic Single Date Selection
```vue
<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const value = ref(new CalendarDate(2022, 2, 3))
</script>

<template>
  <UCalendar v-model="value" />
</template>
```

### Uncontrolled with Default Value
```vue
<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const defaultValue = ref(new CalendarDate(2022, 2, 6))
</script>

<template>
  <UCalendar :default-value="defaultValue" />
</template>
```

### Multiple Date Selection
```vue
<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const value = ref([
  new CalendarDate(2022, 2, 4),
  new CalendarDate(2022, 2, 6),
  new CalendarDate(2022, 2, 8)
])
</script>

<template>
  <UCalendar multiple v-model="value" />
</template>
```

### Date Range Selection
```vue
<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const value = ref({
  start: new CalendarDate(2022, 2, 3),
  end: new CalendarDate(2022, 2, 20)
})
</script>

<template>
  <UCalendar range v-model="value" />
</template>
```

### Color and Variant Customization
```vue
<template>
  <!-- Custom color -->
  <UCalendar color="neutral" />

  <!-- Custom variant -->
  <UCalendar variant="subtle" />

  <!-- Combined -->
  <UCalendar color="primary" variant="soft" />
</template>
```

### Size Variations
```vue
<template>
  <UCalendar size="xs" />
  <UCalendar size="sm" />
  <UCalendar size="md" />  <!-- default -->
  <UCalendar size="lg" />
  <UCalendar size="xl" />
</template>
```

### Disabled State
```vue
<template>
  <UCalendar disabled />
</template>
```

### Multiple Months Display
```vue
<template>
  <!-- Show 3 consecutive months -->
  <UCalendar :number-of-months="3" />
</template>
```

### Control Visibility
```vue
<template>
  <!-- Hide month navigation controls -->
  <UCalendar :month-controls="false" />

  <!-- Hide year navigation controls -->
  <UCalendar :year-controls="false" />

  <!-- Hide both -->
  <UCalendar :month-controls="false" :year-controls="false" />
</template>
```

### Week Layout Control
```vue
<template>
  <!-- Variable week count (not fixed to 6 weeks) -->
  <UCalendar :fixed-weeks="false" />
</template>
```

### Custom Day Rendering with Event Chips
```vue
<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const modelValue = shallowRef(new CalendarDate(2022, 1, 10))

function getColorByDate(date: Date) {
  const isWeekend = date.getDay() % 6 === 0
  const isDayMeeting = date.getDay() % 3 === 0

  if (isWeekend) return undefined
  if (isDayMeeting) return 'error'
  return 'success'
}
</script>

<template>
  <UCalendar v-model="modelValue">
    <template #day="{ day }">
      <UChip
        :show="!!getColorByDate(day.toDate('UTC'))"
        :color="getColorByDate(day.toDate('UTC'))"
        size="2xs"
      >
        {{ day.day }}
      </UChip>
    </template>
  </UCalendar>
</template>
```

### Disabled Date Range
```vue
<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'

const modelValue = shallowRef({
  start: new CalendarDate(2022, 1, 1),
  end: new CalendarDate(2022, 1, 9)
})

const isDateDisabled = (date: DateValue) => {
  return date.day >= 10 && date.day <= 16
}
</script>

<template>
  <UCalendar
    v-model="modelValue"
    :is-date-disabled="isDateDisabled"
    range
  />
</template>
```

### Unavailable Date Range
```vue
<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'

const modelValue = shallowRef({
  start: new CalendarDate(2022, 1, 1),
  end: new CalendarDate(2022, 1, 9)
})

const isDateUnavailable = (date: DateValue) => {
  return date.day >= 10 && date.day <= 16
}
</script>

<template>
  <UCalendar
    v-model="modelValue"
    :is-date-unavailable="isDateUnavailable"
    range
  />
</template>
```

### Min/Max Date Constraints
```vue
<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const modelValue = shallowRef(new CalendarDate(2023, 9, 10))
const minDate = new CalendarDate(2023, 9, 1)
const maxDate = new CalendarDate(2023, 9, 30)
</script>

<template>
  <UCalendar
    v-model="modelValue"
    :min-value="minDate"
    :max-value="maxDate"
  />
</template>
```

### Alternative Calendar System (Hebrew)
```vue
<script setup lang="ts">
import { CalendarDate, HebrewCalendar } from '@internationalized/date'

const hebrewDate = shallowRef(
  new CalendarDate(new HebrewCalendar(), 5781, 1, 1)
)
</script>

<template>
  <UCalendar v-model="hebrewDate" />
</template>
```

### External Month Navigation Controls
```vue
<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const date = shallowRef(new CalendarDate(2025, 4, 2))
</script>

<template>
  <div class="flex flex-col gap-4">
    <UCalendar
      v-model="date"
      :month-controls="false"
      :year-controls="false"
    />

    <div class="flex justify-between gap-4">
      <UButton
        color="neutral"
        variant="outline"
        @click="date = date.subtract({ months: 1 })"
      >
        Prev
      </UButton>

      <UButton
        color="neutral"
        variant="outline"
        @click="date = date.add({ months: 1 })"
      >
        Next
      </UButton>
    </div>
  </div>
</template>
```

### Single Date Picker with Popover
```vue
<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone
} from '@internationalized/date'

const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const modelValue = shallowRef(new CalendarDate(2022, 1, 10))
</script>

<template>
  <UPopover>
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
      {{
        modelValue
          ? df.format(modelValue.toDate(getLocalTimeZone()))
          : 'Select a date'
      }}
    </UButton>

    <template #content>
      <UCalendar v-model="modelValue" class="p-2" />
    </template>
  </UPopover>
</template>
```

### Date Range Picker with Popover
```vue
<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone
} from '@internationalized/date'

const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const modelValue = shallowRef({
  start: new CalendarDate(2022, 1, 20),
  end: new CalendarDate(2022, 2, 10)
})
</script>

<template>
  <UPopover>
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
      <template v-if="modelValue.start">
        <template v-if="modelValue.end">
          {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }} -
          {{ df.format(modelValue.end.toDate(getLocalTimeZone())) }}
        </template>

        <template v-else>
          {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }}
        </template>
      </template>

      <template v-else>
        Pick a date
      </template>
    </UButton>

    <template #content>
      <UCalendar
        v-model="modelValue"
        class="p-2"
        :number-of-months="2"
        range
      />
    </template>
  </UPopover>
</template>
```

## Notable Features

### @internationalized/date Integration
- Built on Adobe's `@internationalized/date` library for robust date handling
- Provides `CalendarDate` class for calendar-system-aware dates
- Supports multiple calendar systems (Gregorian, Hebrew, Islamic, Buddhist, Persian, etc.)
- Timezone-aware via `getLocalTimeZone()` and `.toDate()` conversion
- Date arithmetic methods: `.add()`, `.subtract()` for programmatic navigation

### Three Selection Modes
- **Single date**: Default mode with simple `CalendarDate` binding
- **Multiple dates**: Non-contiguous date selection via array binding
- **Date range**: Continuous range with `{start, end}` object structure
- Each mode has distinct v-model type for type safety

### Controlled vs Uncontrolled Patterns
- Controlled: `v-model` for external state management
- Uncontrolled: `:default-value` for component-internal state
- Follows React-style controlled/uncontrolled component pattern
- Enables flexibility in state management approach

### Date Restriction Strategies
- **Boundary constraints**: `minValue`/`maxValue` for hard date limits
- **Disabled dates**: `isDateDisabled` predicate for complex logic
- **Unavailable dates**: `isDateUnavailable` for semantic distinction from disabled
- Predicate functions receive `DateValue` and return boolean

### Slot-Based Customization
- `#day` slot accepts custom rendering for each day cell
- Receives `{ day }` slot prop with `CalendarDate` instance
- Enables event indicators, custom styling, badges, etc.
- Example integration with `UChip` for colored indicators

### Component Composition Patterns
- Integrates seamlessly with `UPopover` for date picker UI
- Works with `UButton` for trigger elements
- Can embed `UChip` for visual indicators
- Demonstrates compositional design philosophy

### Multiple Month Display
- `numberOfMonths` prop for side-by-side month grids
- Useful for date range selection (common to show 2 months)
- Automatically handles month navigation across displayed range
- No limit on number of months (though UI practical limits apply)

### Control Flexibility
- `monthControls` and `yearControls` to show/hide navigation
- Enables external control implementation (custom buttons)
- Date arithmetic methods (`.add()`, `.subtract()`) for programmatic navigation
- Useful for custom UI designs that don't fit default controls

### Fixed vs Dynamic Week Layout
- `fixedWeeks={true}` (default): Always shows 6 weeks for consistent height
- `fixedWeeks={false}`: Variable week count (4-6 weeks) for space efficiency
- Affects calendar visual stability across month changes

### Locale-Aware Formatting
- `DateFormatter` class for locale-specific date display
- Configurable styles: `{ dateStyle: 'full' | 'long' | 'medium' | 'short' }`
- Automatic locale detection via `getLocalTimeZone()`
- Example: `new DateFormatter('en-US', { dateStyle: 'medium' })`

### Reactive Date Updates
- Recommends `shallowRef` instead of `ref` for date objects
- Improves performance by avoiding deep reactivity on date instances
- CalendarDate immutability aligns with shallow reactivity pattern

### Timezone Handling
- `.toDate(timezone)` method converts to JavaScript Date
- `getLocalTimeZone()` provides user's timezone
- UTC conversion via `.toDate('UTC')`
- Handles DST and timezone offset complexities

## Research Notes

### Access & Documentation
- Documentation successfully accessed at https://ui.nuxt.com/components/calendar
- Part of Nuxt UI v4.1.0 component library
- Comprehensive examples covering all major features
- Clear API documentation with prop types and defaults
- Examples include both basic and advanced integration patterns

### Framework Approach Observations

**Library-First Design:**
- Delegates core date logic to @internationalized/date library
- Focuses component on UI and interaction patterns
- Avoids reinventing date/locale/timezone handling
- Smart architectural decision leveraging battle-tested library

**Type-Safe Date Handling:**
- Uses `CalendarDate` instead of JavaScript Date objects
- Provides immutability and calendar-system awareness
- Type-safe v-model bindings (single date, array, or range object)
- Compile-time safety for date operations

**Flexible Selection Modes:**
- Three distinct modes via simple boolean props (`multiple`, `range`)
- Each mode has appropriate v-model type signature
- No confusing "mode" enum - clear single/multiple/range naming
- Progressive API: start simple (single date) and add props as needed

**Function-Based Restrictions:**
- Predicate functions (`isDateDisabled`, `isDateUnavailable`) for complex logic
- More flexible than prop-based disabled date arrays
- Enables dynamic date validation (e.g., weekends, holidays, business logic)
- Separates "disabled" vs "unavailable" for semantic clarity

**Composition Over Configuration:**
- Integrates with other components (Popover, Button, Chip) via composition
- Slot-based day customization instead of render props
- No monolithic "date picker" component - compose calendar + popover
- Follows Vue composition patterns naturally

**Internationalization First-Class:**
- Multiple calendar systems (not just Gregorian)
- Locale-aware formatting built-in
- Timezone handling via library integration
- Not an afterthought - core to component design

**Visual Customization:**
- Standard color/variant/size props consistent with Nuxt UI system
- Integrates with design system tokens
- Slot-based rendering for advanced customization
- Balance between theming and custom rendering

**Control Flexibility:**
- Can hide built-in controls and implement custom navigation
- Date arithmetic methods for programmatic control
- External button examples show extensibility
- Doesn't force specific UX pattern

**Performance Considerations:**
- Recommends `shallowRef` over `ref` for dates
- Immutable date objects align with reactive system
- Multiple months don't seem to cause performance warnings
- Efficient update patterns

**Potential Challenges:**
- Requires understanding @internationalized/date library (learning curve)
- No built-in time selection (separate concern, needs integration)
- No preset date ranges (common in date pickers)
- Multiple calendar systems add complexity if not needed
- JavaScript Date conversion required for some integrations

**Strengths:**
- Excellent internationalization support (calendar systems, locales, timezones)
- Type-safe date handling avoids common Date object pitfalls
- Flexible restriction system via predicate functions
- Compositional design enables varied UI patterns
- Clear separation of concerns (date logic in library, UI in component)
- Multiple months display for range selection UX
- Slot-based customization for advanced use cases
- Good documentation with practical examples
- Controlled/uncontrolled patterns for state flexibility

**Design Philosophy:**
- Leverage specialized libraries for complex domains (dates/locales)
- Provide flexible, composable primitives rather than prescriptive widgets
- Type safety and immutability for reliability
- Internationalization as first-class concern, not add-on
- Vue-idiomatic patterns (slots, v-model, composition)

**Use Case Fit:**
- Excellent for international applications (multi-locale, multi-calendar)
- Good for complex date restriction logic (booking systems, availability)
- Strong for custom calendar UIs via slots
- Well-suited for composition-based architectures
- May be overkill for simple date selection without i18n needs
- Requires additional work for time selection or preset ranges
