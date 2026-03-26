# Chakra UI: Stat Component Patterns

> Research Date: 2025-11-04
> Framework: Chakra UI (v2 and v3)
> Component: Stat
> Documentation URL: https://chakra-ui.com/docs/components/stat
> v2 Documentation URL: https://v2.chakra-ui.com/docs/components/stat

## Executive Summary

Chakra UI provides a comprehensive Stat component for displaying statistical information and metrics. The component has evolved significantly from v2 to v3, adopting a compound component architecture pattern.

**Key Architectural Differences**:
- **v2**: Individual named exports (Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup)
- **v3**: Compound component pattern (Stat.Root, Stat.Label, Stat.ValueText, Stat.HelpText, Stat.UpIndicator, Stat.DownIndicator, Stat.ValueUnit)

**Notable Features**:
- Compound component architecture for flexible composition (v3)
- Built-in trend indicators (up/down arrows)
- Integration with FormatNumber for currency and percentage formatting
- StatGroup for displaying multiple statistics
- Multipart theming system for granular customization
- Semantic HTML structure for accessibility

---

## Component Definitions

### Stat Component

**Purpose**: Display statistical information with a title, value, and optional help text and trend indicators

**Mental Model**: A data display component that presents key metrics in a structured, scannable format. Think dashboard cards, analytics displays, or KPI panels.

**Semantic Meaning**: Statistics communicate:
- Key metrics and KPIs
- Trends (positive/negative changes)
- Performance indicators
- Time-based context (help text)
- Comparative data

**Use Cases**:
- Dashboard metric cards
- Analytics displays
- Performance indicators
- User statistics (total users, revenue, engagement)
- Real-time data displays
- Comparison metrics with trends
- KPI monitoring panels

---

## Version Comparison

### Component Structure Changes (v2 → v3)

| Feature | v2 | v3 | Notes |
|---------|----|----|-------|
| Root Component | `Stat` | `Stat.Root` | Namespace change |
| Label | `StatLabel` | `Stat.Label` | Namespace change |
| Value/Number | `StatNumber` | `Stat.ValueText` | Renamed + namespace |
| Help Text | `StatHelpText` | `Stat.HelpText` | Namespace change |
| Trend Up | `<StatArrow type="increase" />` | `<Stat.UpIndicator />` | Explicit component |
| Trend Down | `<StatArrow type="decrease" />` | `<Stat.DownIndicator />` | Explicit component |
| Unit Display | Manual composition | `Stat.ValueUnit` | New component |
| Group Container | `StatGroup` | Layout components | Simplified |
| Import Pattern | Named exports | Single namespace | Major change |

### Props Changes (v2 → v3)

| Feature | v2 | v3 | Notes |
|---------|----|----|-------|
| Color System | `colorScheme` | `colorPalette` | Breaking change |
| Arrow Direction | `type="increase/decrease"` | Separate components | Better DX |
| Size | `size` prop | Style props | More flexible |
| Variants | Limited | Recipe system | More customizable |

### Key Architectural Improvements in v3

1. **Compound Component Pattern**: All sub-components namespaced under `Stat.*`
2. **Explicit Indicators**: Separate `UpIndicator` and `DownIndicator` components instead of type prop
3. **ValueUnit Component**: Dedicated component for units (not present in v2)
4. **Integration with FormatNumber**: Seamless integration for number formatting
5. **Recipe System**: More powerful theming through slot recipes

---

## Pattern Analysis: Stat Component

### Component Architecture

**Support Level**: Level 1 (Universal)

#### v2 Architecture
```jsx
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup
} from "@chakra-ui/react"

<Stat>
  <StatLabel>Label</StatLabel>
  <StatNumber>Value</StatNumber>
  <StatHelpText>
    <StatArrow type='increase' />
    Help text
  </StatHelpText>
</Stat>
```

**Component Composition (v2)**:
- `Stat` - Container (composes Box)
- `StatLabel` - Label text (composes Text)
- `StatNumber` - Primary value (composes Text)
- `StatHelpText` - Supporting text (composes Text)
- `StatArrow` - Trend indicator (composes Icon)
- `StatGroup` - Group container (composes Box)

#### v3 Architecture
```jsx
import { Stat } from "@chakra-ui/react"

<Stat.Root>
  <Stat.Label>Label</Stat.Label>
  <Stat.ValueText>Value</Stat.ValueText>
  <Stat.HelpText>Help text</Stat.HelpText>
</Stat.Root>
```

**Component Composition (v3)**:
- `Stat.Root` - Container component
- `Stat.Label` - Label/title text
- `Stat.ValueText` - Primary value display
- `Stat.HelpText` - Supporting information
- `Stat.UpIndicator` - Upward trend arrow
- `Stat.DownIndicator` - Downward trend arrow
- `Stat.ValueUnit` - Unit display (e.g., "hr", "min")

**Benefits of v3 Architecture**:
- Clear namespace prevents naming conflicts
- Better TypeScript support
- More discoverable API
- Explicit component relationships
- Easier to understand composition

### Basic Usage Patterns

**Support Level**: Level 1 (Universal)

#### v2 Basic Example
```jsx
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react"

function BasicStat() {
  return (
    <Stat>
      <StatLabel>Collected Fees</StatLabel>
      <StatNumber>£0.00</StatNumber>
      <StatHelpText>Feb 12 - Feb 28</StatHelpText>
    </Stat>
  )
}
```

#### v3 Basic Example
```jsx
import { Stat } from "@chakra-ui/react"

function BasicStat() {
  return (
    <Stat.Root>
      <Stat.Label>Unique Visitors</Stat.Label>
      <Stat.ValueText>192.1k</Stat.ValueText>
      <Stat.HelpText>Feb 12 - Feb 28</Stat.HelpText>
    </Stat.Root>
  )
}
```

### Trend Indicators

**Support Level**: Level 1 (Universal)

Trend indicators show positive or negative changes in statistics, commonly used for percentage changes or comparative metrics.

#### v2 Trend Indicators
```jsx
import { Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from "@chakra-ui/react"

function TrendStat() {
  return (
    <Stat>
      <StatLabel>Sent</StatLabel>
      <StatNumber>345,670</StatNumber>
      <StatHelpText>
        <StatArrow type='increase' />
        23.36%
      </StatHelpText>
    </Stat>
  )
}
```

**v2 Arrow Types**:
- `type="increase"` - Shows upward arrow (green by default)
- `type="decrease"` - Shows downward arrow (red by default)

#### v3 Trend Indicators
```jsx
import { Badge, Stat } from "@chakra-ui/react"

// Upward trend
function UpTrendStat() {
  return (
    <Stat.Root>
      <Stat.Label>Revenue</Stat.Label>
      <Stat.ValueText>$8,456</Stat.ValueText>
      <Badge colorPalette="green" gap="0">
        <Stat.UpIndicator />
        12%
      </Badge>
    </Stat.Root>
  )
}

// Downward trend
function DownTrendStat() {
  return (
    <Stat.Root>
      <Stat.Label>Unique Visitors</Stat.Label>
      <Stat.ValueText>192.1k</Stat.ValueText>
      <Badge colorPalette="red" variant="plain" px="0">
        <Stat.DownIndicator />
        1.9%
      </Badge>
    </Stat.Root>
  )
}
```

**v3 Trend Features**:
- Separate `UpIndicator` and `DownIndicator` components
- Typically combined with Badge for color coding
- More flexible positioning
- Explicit component names improve readability

### Number Formatting

**Support Level**: Level 1 (Universal in v3)

v3 introduces seamless integration with the FormatNumber component for currency, percentage, and custom number formatting.

#### Currency Formatting
```jsx
import { FormatNumber, Stat } from "@chakra-ui/react"

function CurrencyStat() {
  return (
    <Stat.Root>
      <Stat.Label>Revenue</Stat.Label>
      <Stat.ValueText>
        <FormatNumber value={935.4} style="currency" currency="USD" />
      </Stat.ValueText>
    </Stat.Root>
  )
}
```

#### Percentage Formatting
```jsx
import { Badge, FormatNumber, Stat } from "@chakra-ui/react"

function PercentageStat() {
  return (
    <Stat.Root>
      <Stat.Label>Conversion Rate</Stat.Label>
      <Stat.ValueText>
        <FormatNumber value={0.145} style="percent" maximumFractionDigits={2} />
      </Stat.ValueText>
    </Stat.Root>
  )
}
```

#### Custom Number Formatting
```jsx
import { FormatNumber, Stat } from "@chakra-ui/react"

function FormattedStat() {
  return (
    <Stat.Root>
      <Stat.Label>Users</Stat.Label>
      <Stat.ValueText>
        <FormatNumber
          value={1234567}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
      </Stat.ValueText>
    </Stat.Root>
  )
}
```

**FormatNumber Props**:
- `style`: "decimal" | "currency" | "percent"
- `currency`: Currency code (e.g., "USD", "EUR", "GBP")
- `minimumFractionDigits`: Minimum decimal places
- `maximumFractionDigits`: Maximum decimal places
- Uses Intl.NumberFormat API internally
- Supports locale-based formatting
- Automatically handles thousand separators

### Help Text Patterns

**Support Level**: Level 1 (Universal)

Help text provides additional context, time ranges, or explanatory information below the main value.

#### v2 Help Text
```jsx
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react"

function StatWithHelp() {
  return (
    <Stat>
      <StatLabel>Total Revenue</StatLabel>
      <StatNumber>$45,890</StatNumber>
      <StatHelpText>Since last month</StatHelpText>
    </Stat>
  )
}
```

#### v3 Help Text
```jsx
import { Stat } from "@chakra-ui/react"

function StatWithHelp() {
  return (
    <Stat.Root>
      <Stat.Label>Total Revenue</Stat.Label>
      <Stat.ValueText>$45,890</Stat.ValueText>
      <Stat.HelpText>Since last month</Stat.HelpText>
    </Stat.Root>
  )
}
```

**Common Help Text Patterns**:
- Time ranges: "Feb 12 - Feb 28"
- Comparisons: "Since last month"
- Context: "Compared to last year"
- Updates: "Updated 5 minutes ago"
- Trend description: "23.36% increase"

### Value Units

**Support Level**: Level 2 (v3 only)

v3 introduces `Stat.ValueUnit` for displaying units alongside values.

```jsx
import { Stat } from "@chakra-ui/react"

function StatWithUnit() {
  return (
    <Stat.Root>
      <Stat.Label>Response Time</Stat.Label>
      <Stat.ValueText>
        45
        <Stat.ValueUnit>ms</Stat.ValueUnit>
      </Stat.ValueText>
    </Stat.Root>
  )
}
```

**Common Units**:
- Time: "ms", "sec", "min", "hr"
- Data: "KB", "MB", "GB"
- Rate: "/sec", "/min", "/day"
- Currency symbols: "$", "€", "£"

### Multiple Statistics (StatGroup)

**Support Level**: Level 1 (Universal in v2, Layout components in v3)

#### v2 StatGroup
```jsx
import { Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup } from "@chakra-ui/react"

function StatsGroup() {
  return (
    <StatGroup>
      <Stat>
        <StatLabel>Sent</StatLabel>
        <StatNumber>345,670</StatNumber>
        <StatHelpText>
          <StatArrow type='increase' />
          23.36%
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Clicked</StatLabel>
        <StatNumber>45</StatNumber>
        <StatHelpText>
          <StatArrow type='decrease' />
          9.05%
        </StatHelpText>
      </Stat>
    </StatGroup>
  )
}
```

#### v3 Layout Approach
```jsx
import { Badge, FormatNumber, HStack, SimpleGrid, Stat } from "@chakra-ui/react"

function StatsGrid() {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
      <Stat.Root>
        <Stat.Label>Total Users</Stat.Label>
        <Stat.ValueText>
          <FormatNumber value={345670} />
        </Stat.ValueText>
        <Badge colorPalette="green" gap="0">
          <Stat.UpIndicator />
          23.36%
        </Badge>
      </Stat.Root>

      <Stat.Root>
        <Stat.Label>Revenue</Stat.Label>
        <Stat.ValueText>
          <FormatNumber value={45890} style="currency" currency="USD" />
        </Stat.ValueText>
        <Badge colorPalette="green" gap="0">
          <Stat.UpIndicator />
          12%
        </Badge>
      </Stat.Root>

      <Stat.Root>
        <Stat.Label>Bounce Rate</Stat.Label>
        <Stat.ValueText>
          <FormatNumber value={0.45} style="percent" />
        </Stat.ValueText>
        <Badge colorPalette="red" gap="0">
          <Stat.DownIndicator />
          9.05%
        </Badge>
      </Stat.Root>
    </SimpleGrid>
  )
}
```

**v3 Layout Options**:
- `SimpleGrid` - Responsive grid layout
- `Grid` - More control over grid structure
- `HStack` - Horizontal layout
- `Stack` - Vertical layout
- `Flex` - Flexible box layout

### Responsive Sizing

**Support Level**: Level 1 (Universal)

Both v2 and v3 support responsive sizing through Chakra UI's responsive style props.

#### v2 Responsive
```jsx
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react"

function ResponsiveStat() {
  return (
    <Stat>
      <StatLabel fontSize={{ base: "sm", md: "md" }}>Total Users</StatLabel>
      <StatNumber fontSize={{ base: "2xl", md: "4xl" }}>45,890</StatNumber>
      <StatHelpText fontSize={{ base: "xs", md: "sm" }}>Since last month</StatHelpText>
    </Stat>
  )
}
```

#### v3 Responsive
```jsx
import { Stat } from "@chakra-ui/react"

function ResponsiveStat() {
  return (
    <Stat.Root>
      <Stat.Label fontSize={{ base: "sm", md: "md" }}>Total Users</Stat.Label>
      <Stat.ValueText fontSize={{ base: "2xl", md: "4xl" }}>45,890</Stat.ValueText>
      <Stat.HelpText fontSize={{ base: "xs", md: "sm" }}>Since last month</Stat.HelpText>
    </Stat.Root>
  )
}
```

**Responsive Breakpoints**:
- `base`: 0px+ (mobile)
- `sm`: 480px+ (small tablet)
- `md`: 768px+ (tablet)
- `lg`: 992px+ (desktop)
- `xl`: 1280px+ (large desktop)
- `2xl`: 1536px+ (extra large)

### Advanced Composition Patterns

**Support Level**: Level 2 (Common)

#### Dynamic Trend Indicator (v3)
```jsx
import { Badge, FormatNumber, Show, Stat } from "@chakra-ui/react"

function DynamicStat({ label, value, change, formatOptions }) {
  return (
    <Stat.Root>
      {label && <Stat.Label>{label}</Stat.Label>}
      <Stat.ValueText>
        {value != null && formatOptions && (
          <FormatNumber value={value} {...formatOptions} />
        )}
        {value != null && !formatOptions && value}
      </Stat.ValueText>
      {change != null && (
        <Badge colorPalette={change > 0 ? "green" : "red"} gap="0">
          <Show when={change > 0} fallback={<Stat.DownIndicator />}>
            <Stat.UpIndicator />
          </Show>
          <FormatNumber
            value={Math.abs(change)}
            style="percent"
            maximumFractionDigits={2}
          />
        </Badge>
      )}
    </Stat.Root>
  )
}

// Usage
<DynamicStat
  label="Revenue"
  value={45890}
  change={0.12}
  formatOptions={{ style: "currency", currency: "USD" }}
/>
```

#### Stat with Icon (v3)
```jsx
import { Badge, FormatNumber, HStack, Icon, Stat } from "@chakra-ui/react"
import { FiUsers } from "react-icons/fi"

function StatWithIcon() {
  return (
    <Stat.Root borderWidth="1px" borderRadius="lg" p={6}>
      <HStack justify="space-between" mb={2}>
        <Stat.Label>Total Users</Stat.Label>
        <Icon as={FiUsers} boxSize={6} color="gray.400" />
      </HStack>
      <Stat.ValueText fontSize="2xl" fontWeight="bold">
        <FormatNumber value={45890} />
      </Stat.ValueText>
      <Badge colorPalette="green" gap="0">
        <Stat.UpIndicator />
        12%
      </Badge>
    </Stat.Root>
  )
}
```

#### Stat with Progress Bar (v3)
```jsx
import { Progress, Stat, VStack } from "@chakra-ui/react"

function StatWithProgress() {
  return (
    <Stat.Root>
      <Stat.Label>Goal Progress</Stat.Label>
      <Stat.ValueText>75%</Stat.ValueText>
      <VStack align="stretch" mt={2}>
        <Progress value={75} size="sm" colorScheme="green" />
        <Stat.HelpText>$7,500 of $10,000</Stat.HelpText>
      </VStack>
    </Stat.Root>
  )
}
```

---

## Code Examples

### Basic Statistics Display

#### v2 Example
```jsx
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react"

function BasicStats() {
  return (
    <Stat>
      <StatLabel>Total Revenue</StatLabel>
      <StatNumber>$45,890</StatNumber>
      <StatHelpText>Since last month</StatHelpText>
    </Stat>
  )
}
```

#### v3 Example
```jsx
import { Stat } from "@chakra-ui/react"

function BasicStats() {
  return (
    <Stat.Root>
      <Stat.Label>Total Revenue</Stat.Label>
      <Stat.ValueText>$45,890</Stat.ValueText>
      <Stat.HelpText>Since last month</Stat.HelpText>
    </Stat.Root>
  )
}
```

### Statistics with Trend Indicators

#### v2 Example
```jsx
import { Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup } from "@chakra-ui/react"

function TrendStats() {
  return (
    <StatGroup>
      <Stat>
        <StatLabel>Sent</StatLabel>
        <StatNumber>345,670</StatNumber>
        <StatHelpText>
          <StatArrow type='increase' />
          23.36%
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Clicked</StatLabel>
        <StatNumber>45</StatNumber>
        <StatHelpText>
          <StatArrow type='decrease' />
          9.05%
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Conversion</StatLabel>
        <StatNumber>3.5%</StatNumber>
        <StatHelpText>
          <StatArrow type='increase' />
          2.1%
        </StatHelpText>
      </Stat>
    </StatGroup>
  )
}
```

#### v3 Example
```jsx
import { Badge, SimpleGrid, Stat } from "@chakra-ui/react"

function TrendStats() {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
      <Stat.Root>
        <Stat.Label>Sent</Stat.Label>
        <Stat.ValueText>345,670</Stat.ValueText>
        <Badge colorPalette="green" gap="0">
          <Stat.UpIndicator />
          23.36%
        </Badge>
      </Stat.Root>

      <Stat.Root>
        <Stat.Label>Clicked</Stat.Label>
        <Stat.ValueText>45</Stat.ValueText>
        <Badge colorPalette="red" gap="0">
          <Stat.DownIndicator />
          9.05%
        </Badge>
      </Stat.Root>

      <Stat.Root>
        <Stat.Label>Conversion</Stat.Label>
        <Stat.ValueText>3.5%</Stat.ValueText>
        <Badge colorPalette="green" gap="0">
          <Stat.UpIndicator />
          2.1%
        </Badge>
      </Stat.Root>
    </SimpleGrid>
  )
}
```

### Currency and Percentage Formatting (v3)

```jsx
import { Badge, FormatNumber, HStack, SimpleGrid, Stat } from "@chakra-ui/react"

function FormattedStats() {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
      {/* Currency */}
      <Stat.Root>
        <Stat.Label>Revenue</Stat.Label>
        <HStack>
          <Stat.ValueText>
            <FormatNumber value={8456.4} style="currency" currency="USD" />
          </Stat.ValueText>
          <Badge colorPalette="green" gap="0">
            <Stat.UpIndicator />
            12%
          </Badge>
        </HStack>
        <Stat.HelpText>Since last month</Stat.HelpText>
      </Stat.Root>

      {/* Percentage */}
      <Stat.Root>
        <Stat.Label>Conversion Rate</Stat.Label>
        <Stat.ValueText>
          <FormatNumber value={0.145} style="percent" maximumFractionDigits={2} />
        </Stat.ValueText>
        <Badge colorPalette="green" gap="0">
          <Stat.UpIndicator />
          <FormatNumber value={0.021} style="percent" maximumFractionDigits={1} />
        </Badge>
      </Stat.Root>

      {/* Number with decimals */}
      <Stat.Root>
        <Stat.Label>Average Order Value</Stat.Label>
        <Stat.ValueText>
          <FormatNumber
            value={156.78}
            style="currency"
            currency="USD"
            minimumFractionDigits={2}
            maximumFractionDigits={2}
          />
        </Stat.ValueText>
        <Stat.HelpText>Per transaction</Stat.HelpText>
      </Stat.Root>
    </SimpleGrid>
  )
}
```

### Dashboard Grid Layout (v3)

```jsx
import { Badge, Box, FormatNumber, Icon, SimpleGrid, Stat, VStack } from "@chakra-ui/react"
import { FiDollarSign, FiTrendingUp, FiUsers, FiShoppingCart } from "react-icons/fi"

function DashboardStats() {
  const stats = [
    {
      label: "Total Revenue",
      value: 45890,
      change: 0.12,
      icon: FiDollarSign,
      format: { style: "currency", currency: "USD" }
    },
    {
      label: "Total Users",
      value: 12456,
      change: 0.23,
      icon: FiUsers,
      format: null
    },
    {
      label: "Conversion Rate",
      value: 0.035,
      change: -0.009,
      icon: FiTrendingUp,
      format: { style: "percent", maximumFractionDigits: 2 }
    },
    {
      label: "Orders",
      value: 2345,
      change: 0.18,
      icon: FiShoppingCart,
      format: null
    }
  ]

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
      {stats.map((stat, index) => (
        <Box
          key={index}
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          bg="white"
          _dark={{ bg: "gray.800" }}
        >
          <Stat.Root>
            <HStack justify="space-between" mb={2}>
              <Stat.Label color="gray.600" _dark={{ color: "gray.400" }}>
                {stat.label}
              </Stat.Label>
              <Icon as={stat.icon} boxSize={5} color="gray.400" />
            </HStack>

            <Stat.ValueText fontSize="2xl" fontWeight="bold">
              {stat.format ? (
                <FormatNumber value={stat.value} {...stat.format} />
              ) : (
                <FormatNumber value={stat.value} />
              )}
            </Stat.ValueText>

            {stat.change !== 0 && (
              <Badge
                colorPalette={stat.change > 0 ? "green" : "red"}
                gap="0"
                mt={2}
              >
                {stat.change > 0 ? (
                  <Stat.UpIndicator />
                ) : (
                  <Stat.DownIndicator />
                )}
                <FormatNumber
                  value={Math.abs(stat.change)}
                  style="percent"
                  maximumFractionDigits={1}
                />
              </Badge>
            )}
          </Stat.Root>
        </Box>
      ))}
    </SimpleGrid>
  )
}
```

### Responsive Statistics Cards (v3)

```jsx
import { Badge, Box, FormatNumber, SimpleGrid, Stat, useBreakpointValue } from "@chakra-ui/react"

function ResponsiveStats() {
  const fontSize = useBreakpointValue({ base: "2xl", md: "3xl", lg: "4xl" })
  const labelSize = useBreakpointValue({ base: "sm", md: "md" })
  const padding = useBreakpointValue({ base: 4, md: 6 })

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: 4, md: 6 }}>
      <Box borderWidth="1px" borderRadius="lg" p={padding} bg="white">
        <Stat.Root>
          <Stat.Label fontSize={labelSize}>Total Revenue</Stat.Label>
          <Stat.ValueText fontSize={fontSize} fontWeight="bold">
            <FormatNumber value={45890} style="currency" currency="USD" />
          </Stat.ValueText>
          <Badge colorPalette="green" gap="0" mt={2}>
            <Stat.UpIndicator />
            12%
          </Badge>
          <Stat.HelpText fontSize={{ base: "xs", md: "sm" }}>
            Since last month
          </Stat.HelpText>
        </Stat.Root>
      </Box>

      <Box borderWidth="1px" borderRadius="lg" p={padding} bg="white">
        <Stat.Root>
          <Stat.Label fontSize={labelSize}>Active Users</Stat.Label>
          <Stat.ValueText fontSize={fontSize} fontWeight="bold">
            <FormatNumber value={12456} />
          </Stat.ValueText>
          <Badge colorPalette="green" gap="0" mt={2}>
            <Stat.UpIndicator />
            23%
          </Badge>
          <Stat.HelpText fontSize={{ base: "xs", md: "sm" }}>
            This week
          </Stat.HelpText>
        </Stat.Root>
      </Box>

      <Box borderWidth="1px" borderRadius="lg" p={padding} bg="white">
        <Stat.Root>
          <Stat.Label fontSize={labelSize}>Bounce Rate</Stat.Label>
          <Stat.ValueText fontSize={fontSize} fontWeight="bold">
            <FormatNumber value={0.45} style="percent" />
          </Stat.ValueText>
          <Badge colorPalette="red" gap="0" mt={2}>
            <Stat.DownIndicator />
            9%
          </Badge>
          <Stat.HelpText fontSize={{ base: "xs", md: "sm" }}>
            Compared to last month
          </Stat.HelpText>
        </Stat.Root>
      </Box>

      <Box borderWidth="1px" borderRadius="lg" p={padding} bg="white">
        <Stat.Root>
          <Stat.Label fontSize={labelSize}>Avg. Session</Stat.Label>
          <Stat.ValueText fontSize={fontSize} fontWeight="bold">
            4.2
            <Stat.ValueUnit fontSize="md" ml={1}>min</Stat.ValueUnit>
          </Stat.ValueText>
          <Badge colorPalette="green" gap="0" mt={2}>
            <Stat.UpIndicator />
            5%
          </Badge>
          <Stat.HelpText fontSize={{ base: "xs", md: "sm" }}>
            Per user
          </Stat.HelpText>
        </Stat.Root>
      </Box>
    </SimpleGrid>
  )
}
```

### Stat with Value Unit (v3)

```jsx
import { Badge, SimpleGrid, Stat } from "@chakra-ui/react"

function StatsWithUnits() {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
      <Stat.Root>
        <Stat.Label>Response Time</Stat.Label>
        <Stat.ValueText>
          45
          <Stat.ValueUnit>ms</Stat.ValueUnit>
        </Stat.ValueText>
        <Badge colorPalette="green" gap="0">
          <Stat.UpIndicator />
          15%
        </Badge>
      </Stat.Root>

      <Stat.Root>
        <Stat.Label>Data Transfer</Stat.Label>
        <Stat.ValueText>
          2.4
          <Stat.ValueUnit>GB</Stat.ValueUnit>
        </Stat.ValueText>
        <Stat.HelpText>This month</Stat.HelpText>
      </Stat.Root>

      <Stat.Root>
        <Stat.Label>API Calls</Stat.Label>
        <Stat.ValueText>
          1,234
          <Stat.ValueUnit>/min</Stat.ValueUnit>
        </Stat.ValueText>
        <Badge colorPalette="red" gap="0">
          <Stat.DownIndicator />
          5%
        </Badge>
      </Stat.Root>
    </SimpleGrid>
  )
}
```

### Compact Stat Layout (v3)

```jsx
import { Badge, HStack, Stat } from "@chakra-ui/react"

function CompactStat() {
  return (
    <Stat.Root>
      <HStack justify="space-between" align="center">
        <Stat.Label>Revenue</Stat.Label>
        <Badge colorPalette="green" gap="0">
          <Stat.UpIndicator />
          12%
        </Badge>
      </HStack>
      <Stat.ValueText fontSize="2xl" fontWeight="bold">
        $45,890
      </Stat.ValueText>
    </Stat.Root>
  )
}
```

---

## Accessibility

### Built-in Accessibility Features

**Support Level**: Level 1 (Universal)

**Semantic HTML Structure**:
- Stat components use semantic HTML elements
- Composes standard Text and Box components
- Screen readers can naturally traverse content
- Proper heading hierarchy

**ARIA Attributes**:
```jsx
// Adding explicit ARIA labels when needed
<Stat.Root aria-label="Revenue statistics">
  <Stat.Label>Revenue</Stat.Label>
  <Stat.ValueText aria-label="$45,890 USD">$45,890</Stat.ValueText>
  <Stat.HelpText>Since last month</Stat.HelpText>
</Stat.Root>
```

**Screen Reader Considerations**:
```jsx
// Providing context for screen readers
<Stat.Root>
  <Stat.Label>Revenue</Stat.Label>
  <Stat.ValueText>
    <FormatNumber value={45890} style="currency" currency="USD" />
  </Stat.ValueText>
  <Box aria-label="12% increase since last month">
    <Badge colorPalette="green" gap="0">
      <Stat.UpIndicator />
      12%
    </Badge>
  </Box>
  <Stat.HelpText>Since last month</Stat.HelpText>
</Stat.Root>
```

**Best Practices**:
1. Use `aria-label` for trend indicators when the visual isn't sufficient
2. Provide context for percentage changes
3. Include time ranges in help text
4. Use semantic HTML structure
5. Test with screen readers (NVDA, VoiceOver)
6. Ensure proper contrast ratios for text
7. Make interactive stats keyboard accessible

### Color and Contrast

```jsx
// Ensuring proper contrast
<Stat.Root>
  <Stat.Label color="gray.600" _dark={{ color: "gray.400" }}>
    Total Users
  </Stat.Label>
  <Stat.ValueText color="gray.900" _dark={{ color: "white" }}>
    12,456
  </Stat.ValueText>
</Stat.Root>
```

---

## Theming and Customization

### v2 Theming System

**Support Level**: Level 2 (Common in v2)

v2 uses a multipart component system for theming:

```jsx
import { createMultiStyleConfigHelpers } from "@chakra-ui/react"

const helpers = createMultiStyleConfigHelpers(['container', 'label', 'number', 'helpText', 'icon'])

const statTheme = helpers.defineMultiStyleConfig({
  baseStyle: {
    container: {
      borderWidth: '1px',
      borderRadius: 'lg',
      p: 6,
      bg: 'white'
    },
    label: {
      fontWeight: 'medium',
      fontSize: 'sm',
      color: 'gray.600'
    },
    number: {
      fontSize: '2xl',
      fontWeight: 'bold',
      color: 'gray.900'
    },
    helpText: {
      fontSize: 'sm',
      color: 'gray.500'
    },
    icon: {
      w: 6,
      h: 6
    }
  },
  variants: {
    card: {
      container: {
        boxShadow: 'md',
        _hover: {
          boxShadow: 'lg'
        }
      }
    },
    minimal: {
      container: {
        borderWidth: 0,
        p: 0
      }
    }
  },
  sizes: {
    sm: {
      container: { p: 4 },
      number: { fontSize: 'xl' },
      label: { fontSize: 'xs' }
    },
    lg: {
      container: { p: 8 },
      number: { fontSize: '4xl' },
      label: { fontSize: 'md' }
    }
  },
  defaultProps: {
    variant: 'card',
    size: 'md'
  }
})

// Apply theme
const theme = extendTheme({
  components: {
    Stat: statTheme
  }
})
```

### v3 Recipe System

**Support Level**: Level 1 (Universal in v3)

v3 uses the recipe system for more powerful theming:

```jsx
import { createSystem, defineConfig, defineRecipe } from "@chakra-ui/react"

const statRecipe = defineRecipe({
  slots: ['root', 'label', 'valueText', 'helpText'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    },
    label: {
      fontWeight: 'medium',
      fontSize: 'sm',
      color: 'gray.600',
      _dark: { color: 'gray.400' }
    },
    valueText: {
      fontSize: '2xl',
      fontWeight: 'bold',
      color: 'gray.900',
      _dark: { color: 'white' }
    },
    helpText: {
      fontSize: 'sm',
      color: 'gray.500',
      _dark: { color: 'gray.400' }
    }
  },
  variants: {
    style: {
      card: {
        root: {
          borderWidth: '1px',
          borderRadius: 'lg',
          p: 6,
          bg: 'white',
          _dark: { bg: 'gray.800' }
        }
      },
      minimal: {
        root: {
          p: 0
        }
      },
      bordered: {
        root: {
          borderWidth: '2px',
          borderRadius: 'md',
          p: 4
        }
      }
    },
    size: {
      sm: {
        root: { p: 4 },
        valueText: { fontSize: 'xl' },
        label: { fontSize: 'xs' }
      },
      lg: {
        root: { p: 8 },
        valueText: { fontSize: '4xl' },
        label: { fontSize: 'md' }
      }
    }
  },
  defaultVariants: {
    style: 'card',
    size: 'md'
  }
})

const config = defineConfig({
  theme: {
    recipes: {
      stat: statRecipe
    }
  }
})

export const system = createSystem(defaultConfig, config)
```

### ColorPalette Integration (v3)

```jsx
// Using colorPalette with badges and indicators
<Stat.Root colorPalette="blue">
  <Stat.Label>Users</Stat.Label>
  <Stat.ValueText>12,456</Stat.ValueText>
  <Badge colorPalette="blue" gap="0">
    <Stat.UpIndicator />
    23%
  </Badge>
</Stat.Root>
```

**Available Color Palettes**:
- gray, red, orange, yellow, green, teal, blue, cyan, purple, pink
- whiteAlpha, blackAlpha

### Custom Variants Example (v3)

```jsx
// Creating a gradient stat card
const gradientStatRecipe = defineRecipe({
  slots: ['root', 'label', 'valueText'],
  variants: {
    style: {
      gradient: {
        root: {
          bgGradient: 'to-r',
          gradientFrom: 'blue.400',
          gradientTo: 'purple.500',
          borderRadius: 'lg',
          p: 6,
          color: 'white'
        },
        label: {
          color: 'whiteAlpha.800'
        },
        valueText: {
          color: 'white',
          fontSize: '3xl',
          fontWeight: 'bold'
        }
      }
    }
  }
})

// Usage
<Stat.Root variant="gradient">
  <Stat.Label>Premium Users</Stat.Label>
  <Stat.ValueText>4,567</Stat.ValueText>
</Stat.Root>
```

---

## Performance Considerations

### Optimization Tips

**Support Level**: Level 2 (Common)

**1. Memoization for Dynamic Stats**:
```jsx
import { memo } from "react"
import { Badge, FormatNumber, Stat } from "@chakra-ui/react"

const OptimizedStat = memo(({ label, value, change, currency }) => (
  <Stat.Root>
    <Stat.Label>{label}</Stat.Label>
    <Stat.ValueText>
      <FormatNumber
        value={value}
        style="currency"
        currency={currency}
      />
    </Stat.ValueText>
    {change && (
      <Badge colorPalette={change > 0 ? "green" : "red"} gap="0">
        {change > 0 ? <Stat.UpIndicator /> : <Stat.DownIndicator />}
        <FormatNumber value={Math.abs(change)} style="percent" />
      </Badge>
    )}
  </Stat.Root>
))
```

**2. Lazy Loading for Large Grids**:
```jsx
import { Suspense, lazy } from "react"
import { Skeleton, SimpleGrid } from "@chakra-ui/react"

const StatCard = lazy(() => import("./StatCard"))

function LazyStatsGrid() {
  return (
    <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
      <Suspense fallback={<Skeleton height="150px" />}>
        <StatCard label="Revenue" value={45890} />
      </Suspense>
      {/* More stat cards */}
    </SimpleGrid>
  )
}
```

**3. Efficient Number Formatting**:
```jsx
// FormatNumber uses Intl.NumberFormat which is cached
// Reuse format options for better performance
const currencyFormat = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}

function EfficientStats() {
  return (
    <>
      <Stat.ValueText>
        <FormatNumber value={123.45} {...currencyFormat} />
      </Stat.ValueText>
      <Stat.ValueText>
        <FormatNumber value={678.90} {...currencyFormat} />
      </Stat.ValueText>
    </>
  )
}
```

**4. Virtual Scrolling for Many Stats**:
```jsx
import { useVirtualizer } from "@tanstack/react-virtual"
import { Box, Stat } from "@chakra-ui/react"

function VirtualizedStats({ stats }) {
  const parentRef = useRef(null)

  const virtualizer = useVirtualizer({
    count: stats.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 5
  })

  return (
    <Box ref={parentRef} height="600px" overflow="auto">
      <Box height={`${virtualizer.getTotalSize()}px`} position="relative">
        {virtualizer.getVirtualItems().map((item) => (
          <Box
            key={item.key}
            position="absolute"
            top={0}
            left={0}
            width="100%"
            transform={`translateY(${item.start}px)`}
          >
            <Stat.Root>
              <Stat.Label>{stats[item.index].label}</Stat.Label>
              <Stat.ValueText>{stats[item.index].value}</Stat.ValueText>
            </Stat.Root>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
```

---

## Migration Guide (v2 → v3)

### Component Name Changes

**All imports become namespaced**:

```jsx
// v2
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup
} from "@chakra-ui/react"

// v3
import { Stat } from "@chakra-ui/react"
```

### Component Structure Migration

**v2 to v3 mapping**:

| v2 Component | v3 Component | Notes |
|-------------|--------------|-------|
| `Stat` | `Stat.Root` | Namespace change |
| `StatLabel` | `Stat.Label` | Namespace change |
| `StatNumber` | `Stat.ValueText` | Renamed + namespace |
| `StatHelpText` | `Stat.HelpText` | Namespace change |
| `<StatArrow type="increase" />` | `<Stat.UpIndicator />` | Separate component |
| `<StatArrow type="decrease" />` | `<Stat.DownIndicator />` | Separate component |
| N/A | `Stat.ValueUnit` | New component |
| `StatGroup` | Use layout components | Removed |

### Step-by-Step Migration

**Step 1: Update Imports**
```jsx
// Before
import { Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from "@chakra-ui/react"

// After
import { Stat } from "@chakra-ui/react"
```

**Step 2: Update Component Names**
```jsx
// Before
<Stat>
  <StatLabel>Revenue</StatLabel>
  <StatNumber>$45,890</StatNumber>
  <StatHelpText>Since last month</StatHelpText>
</Stat>

// After
<Stat.Root>
  <Stat.Label>Revenue</Stat.Label>
  <Stat.ValueText>$45,890</Stat.ValueText>
  <Stat.HelpText>Since last month</Stat.HelpText>
</Stat.Root>
```

**Step 3: Replace StatArrow**
```jsx
// Before
<StatHelpText>
  <StatArrow type='increase' />
  23.36%
</StatHelpText>

// After (with Badge for color)
<Badge colorPalette="green" gap="0">
  <Stat.UpIndicator />
  23.36%
</Badge>
```

**Step 4: Replace StatGroup**
```jsx
// Before
<StatGroup>
  <Stat>...</Stat>
  <Stat>...</Stat>
  <Stat>...</Stat>
</StatGroup>

// After
<SimpleGrid columns={3} gap={6}>
  <Stat.Root>...</Stat.Root>
  <Stat.Root>...</Stat.Root>
  <Stat.Root>...</Stat.Root>
</SimpleGrid>
```

**Step 5: Add Number Formatting (Optional)**
```jsx
// Before
<StatNumber>$45,890</StatNumber>

// After (with FormatNumber)
<Stat.ValueText>
  <FormatNumber value={45890} style="currency" currency="USD" />
</Stat.ValueText>
```

### Complete Migration Example

```jsx
// v2 Code
import { Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup } from "@chakra-ui/react"

function OldStats() {
  return (
    <StatGroup>
      <Stat>
        <StatLabel>Revenue</StatLabel>
        <StatNumber>$45,890</StatNumber>
        <StatHelpText>
          <StatArrow type='increase' />
          12%
        </StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Users</StatLabel>
        <StatNumber>12,456</StatNumber>
        <StatHelpText>
          <StatArrow type='increase' />
          23%
        </StatHelpText>
      </Stat>
    </StatGroup>
  )
}

// v3 Code
import { Badge, FormatNumber, SimpleGrid, Stat } from "@chakra-ui/react"

function NewStats() {
  return (
    <SimpleGrid columns={2} gap={6}>
      <Stat.Root>
        <Stat.Label>Revenue</Stat.Label>
        <Stat.ValueText>
          <FormatNumber value={45890} style="currency" currency="USD" />
        </Stat.ValueText>
        <Badge colorPalette="green" gap="0">
          <Stat.UpIndicator />
          12%
        </Badge>
      </Stat.Root>

      <Stat.Root>
        <Stat.Label>Users</Stat.Label>
        <Stat.ValueText>
          <FormatNumber value={12456} />
        </Stat.ValueText>
        <Badge colorPalette="green" gap="0">
          <Stat.UpIndicator />
          23%
        </Badge>
      </Stat.Root>
    </SimpleGrid>
  )
}
```

---

## Common Patterns and Recipes

### Pattern: Dashboard KPI Cards

```jsx
import { Badge, Box, FormatNumber, Icon, SimpleGrid, Stat } from "@chakra-ui/react"
import { FiDollarSign, FiUsers, FiTrendingUp, FiShoppingCart } from "react-icons/fi"

function KPIDashboard() {
  const kpis = [
    {
      label: "Total Revenue",
      value: 45890,
      change: 0.12,
      icon: FiDollarSign,
      colorPalette: "green",
      format: { style: "currency", currency: "USD" }
    },
    {
      label: "Active Users",
      value: 12456,
      change: 0.23,
      icon: FiUsers,
      colorPalette: "blue"
    },
    {
      label: "Conversion Rate",
      value: 0.035,
      change: 0.021,
      icon: FiTrendingUp,
      colorPalette: "purple",
      format: { style: "percent", maximumFractionDigits: 2 }
    },
    {
      label: "Total Orders",
      value: 2345,
      change: -0.05,
      icon: FiShoppingCart,
      colorPalette: "orange"
    }
  ]

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
      {kpis.map((kpi, index) => (
        <Box
          key={index}
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          bg="white"
          _dark={{ bg: "gray.800" }}
          _hover={{ boxShadow: "lg" }}
          transition="all 0.2s"
        >
          <Stat.Root>
            <HStack justify="space-between" mb={3}>
              <Stat.Label>{kpi.label}</Stat.Label>
              <Icon
                as={kpi.icon}
                boxSize={5}
                color={`${kpi.colorPalette}.400`}
              />
            </HStack>

            <Stat.ValueText fontSize="3xl" fontWeight="bold">
              {kpi.format ? (
                <FormatNumber value={kpi.value} {...kpi.format} />
              ) : (
                <FormatNumber value={kpi.value} />
              )}
            </Stat.ValueText>

            <Badge
              colorPalette={kpi.change > 0 ? "green" : "red"}
              gap="0"
              mt={2}
            >
              {kpi.change > 0 ? (
                <Stat.UpIndicator />
              ) : (
                <Stat.DownIndicator />
              )}
              <FormatNumber
                value={Math.abs(kpi.change)}
                style="percent"
                maximumFractionDigits={1}
              />
            </Badge>
          </Stat.Root>
        </Box>
      ))}
    </SimpleGrid>
  )
}
```

### Pattern: Comparison Stats

```jsx
import { Badge, Box, Divider, FormatNumber, HStack, Stat, VStack } from "@chakra-ui/react"

function ComparisonStats() {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack align="stretch" spacing={4}>
        <Stat.Root>
          <Stat.Label>This Month</Stat.Label>
          <Stat.ValueText fontSize="4xl" fontWeight="bold">
            <FormatNumber value={45890} style="currency" currency="USD" />
          </Stat.ValueText>
        </Stat.Root>

        <Divider />

        <Stat.Root>
          <Stat.Label>Last Month</Stat.Label>
          <Stat.ValueText fontSize="2xl" color="gray.600">
            <FormatNumber value={40890} style="currency" currency="USD" />
          </Stat.ValueText>
        </Stat.Root>

        <Divider />

        <HStack justify="space-between">
          <Stat.Label>Difference</Stat.Label>
          <Badge colorPalette="green" gap="0">
            <Stat.UpIndicator />
            <FormatNumber value={5000} style="currency" currency="USD" />
          </Badge>
        </HStack>
      </VStack>
    </Box>
  )
}
```

### Pattern: Sparkline Integration

```jsx
import { Badge, Box, FormatNumber, Sparkline, Stat } from "@chakra-ui/react"

function StatWithSparkline() {
  const data = [12, 15, 18, 14, 20, 25, 23, 28, 30, 35]

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <Stat.Root>
        <Stat.Label>Revenue Trend</Stat.Label>
        <Stat.ValueText fontSize="3xl" fontWeight="bold">
          <FormatNumber value={45890} style="currency" currency="USD" />
        </Stat.ValueText>
        <Badge colorPalette="green" gap="0" mt={2}>
          <Stat.UpIndicator />
          12%
        </Badge>
        <Box mt={4}>
          <Sparkline data={data} height={40} />
        </Box>
        <Stat.HelpText mt={2}>Last 10 days</Stat.HelpText>
      </Stat.Root>
    </Box>
  )
}
```

### Pattern: Stat with Loading State

```jsx
import { Badge, Box, FormatNumber, Skeleton, Stat } from "@chakra-ui/react"

function LoadingStat({ isLoading, data }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <Stat.Root>
        <Stat.Label>Revenue</Stat.Label>
        <Skeleton isLoaded={!isLoading}>
          <Stat.ValueText fontSize="3xl" fontWeight="bold">
            {data?.value && (
              <FormatNumber
                value={data.value}
                style="currency"
                currency="USD"
              />
            )}
          </Stat.ValueText>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} mt={2}>
          {data?.change && (
            <Badge
              colorPalette={data.change > 0 ? "green" : "red"}
              gap="0"
            >
              {data.change > 0 ? (
                <Stat.UpIndicator />
              ) : (
                <Stat.DownIndicator />
              )}
              <FormatNumber
                value={Math.abs(data.change)}
                style="percent"
              />
            </Badge>
          )}
        </Skeleton>
      </Stat.Root>
    </Box>
  )
}
```

### Pattern: Real-time Updating Stat

```jsx
import { Badge, Box, FormatNumber, Stat, useInterval } from "@chakra-ui/react"
import { useState } from "react"

function RealtimeStat() {
  const [value, setValue] = useState(45890)
  const [change, setChange] = useState(0.12)

  useInterval(() => {
    // Simulate real-time updates
    const newValue = value + Math.random() * 100 - 50
    const newChange = ((newValue - value) / value)
    setValue(Math.round(newValue))
    setChange(newChange)
  }, 5000) // Update every 5 seconds

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <Stat.Root>
        <Stat.Label>Live Revenue</Stat.Label>
        <Stat.ValueText fontSize="3xl" fontWeight="bold">
          <FormatNumber value={value} style="currency" currency="USD" />
        </Stat.ValueText>
        <Badge
          colorPalette={change >= 0 ? "green" : "red"}
          gap="0"
          mt={2}
        >
          {change >= 0 ? (
            <Stat.UpIndicator />
          ) : (
            <Stat.DownIndicator />
          )}
          <FormatNumber
            value={Math.abs(change)}
            style="percent"
            maximumFractionDigits={2}
          />
        </Badge>
        <Stat.HelpText>Updates every 5 seconds</Stat.HelpText>
      </Stat.Root>
    </Box>
  )
}
```

---

## URL Verification

### Successfully Accessed
- ✅ https://www.chakra-ui.com/docs/components/stat (v3 - primary documentation)
- ✅ https://v2.chakra-ui.com/docs/components/stat (v2 - legacy documentation)
- ✅ https://www.chakra-ui.com/docs/components/format-number (FormatNumber integration)

### Access Method
- WebFetch tool used for initial documentation retrieval
- WebSearch used for comprehensive pattern discovery
- Information gathered from:
  - Official Chakra UI v3 documentation
  - Official Chakra UI v2 documentation
  - GitHub discussions and source code
  - Community examples and implementations
  - Stack Overflow solutions
  - Third-party documentation sites

### Information Completeness
Comprehensive information gathered through multiple sources:
- Complete component API for v2 and v3
- Migration patterns and guides
- Code examples from official docs
- Real-world usage patterns
- Theming and customization approaches
- Accessibility best practices
- Performance optimization techniques

---

## Summary and Recommendations

### Stat Component Summary

**Strengths**:
- Clear compound component architecture (v3)
- Excellent integration with FormatNumber
- Built-in trend indicators
- Flexible composition patterns
- Strong theming system (recipe-based in v3)
- Semantic HTML structure
- Responsive by default
- Good accessibility support

**Limitations**:
- Breaking changes from v2 to v3
- Requires Badge component for colored trend indicators (v3)
- StatGroup removed in v3 (use layout components instead)
- Manual composition needed for complex layouts

**Best For**:
- Dashboard analytics displays
- KPI monitoring
- Performance metrics
- Financial data display
- User statistics
- Real-time data updates
- Comparative analytics

### Version Recommendations

**Use v2 if**:
- Working with existing Chakra UI v2 projects
- Need StatGroup component
- Simple migration path from older code

**Use v3 if**:
- Starting new projects
- Want compound component pattern
- Need better TypeScript support
- Want FormatNumber integration
- Prefer explicit indicator components
- Need modern theming system

### Semantic UI Integration Recommendations

**Must-Have Features (Level 1)**:
1. Compound component architecture (Statistic.Root, Statistic.Label, Statistic.Value)
2. Trend indicators (up/down arrows)
3. Help text support
4. Number formatting integration
5. Responsive sizing
6. Multiple statistics layout
7. Color palette system
8. Accessible by default

**Should-Have Features (Level 2)**:
1. Value unit component
2. Icon integration
3. Badge/trend integration patterns
4. Grid layout support
5. Card variants
6. Loading states
7. Custom theming/recipes

**Nice-to-Have Features (Level 3)**:
1. Sparkline integration
2. Real-time updates
3. Comparison views
4. Progress bar integration
5. Virtual scrolling for large datasets

**Key Learnings**:
- Compound component pattern provides excellent flexibility and discoverability
- Explicit UpIndicator/DownIndicator components are more intuitive than type prop
- FormatNumber integration is essential for internationalization
- Badge integration provides flexible color coding
- Recipe system enables powerful theming
- Layout components (SimpleGrid, Grid) replace StatGroup effectively
- Accessibility built-in through semantic HTML

**Implementation Priorities**:
1. **Core**: Compound components, trend indicators, help text
2. **Formatting**: Number/currency formatting, units
3. **Layout**: Grid support, responsive patterns
4. **Theming**: Recipe system, color palettes, variants
5. **Advanced**: Icons, loading states, real-time updates
6. **Optional**: Sparklines, comparisons, virtual scrolling

**Unique Innovations**:
- Stat.ValueUnit component for explicit unit display
- FormatNumber component integration
- Recipe-based theming with slot support
- Explicit UpIndicator/DownIndicator (better than type prop)
- Flexible Badge integration for color-coded trends
