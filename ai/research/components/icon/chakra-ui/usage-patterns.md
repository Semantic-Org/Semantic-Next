# Chakra UI Icon - Usage Patterns

## Component Overview

The Icon component in Chakra UI is designed to display SVG icons within applications with consistent styling, responsive sizing, theming support, and built-in accessibility features. Unlike generic SVG rendering, the Icon component provides:

- Consistent sizing through a design token system
- Automatic color inheritance from parent context
- Seamless integration with Chakra's color system and theming
- Built-in accessibility attributes (ARIA, semantic HTML)
- Support for both third-party icon libraries (like react-icons) and custom SVG icons
- Responsive sizing through CSS custom properties

The Icon component serves as a lightweight wrapper around SVG elements, extending them with Chakra UI's styling capabilities rather than imposing strict visual constraints.

## Basic Usage

### Simple SVG Icon

```jsx
import { Icon } from '@chakra-ui/react'

function BasicIcon() {
  return (
    <Icon>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" />
      </svg>
    </Icon>
  )
}
```

### With react-icons Library

```jsx
import { Icon } from '@chakra-ui/react'
import { FiHome, FiSettings } from 'react-icons/fi'

function IconsFromLibrary() {
  return (
    <>
      <Icon as={FiHome} />
      <Icon as={FiSettings} />
    </>
  )
}
```

### Direct SVG Path as Children

```jsx
import { Icon } from '@chakra-ui/react'

function HeartIcon() {
  return (
    <Icon>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </Icon>
  )
}
```

## Props/API

### Core Icon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType \| string` | - | Changes the rendered element. Can be a component or HTML element. Commonly used with react-icons (e.g., `as={FiHome}`) |
| `boxSize` | `string \| number \| ResponsiveValue<string \| number>` | `1em` | Sets both width and height of the icon. Accepts responsive values like `["16px", "20px", "24px"]` |
| `w` / `width` | `string \| number \| ResponsiveValue<string \| number>` | - | Sets the icon width. Can be used independently of height |
| `h` / `height` | `string \| number \| ResponsiveValue<string \| number>` | - | Sets the icon height. Can be used independently of width |
| `color` | `string` | - | Sets the icon color. Accepts Chakra color tokens (e.g., `"blue.500"`) or standard CSS colors (e.g., `"tomato"`, `"#FF5733"`) |
| `viewBox` | `string` | `0 0 24 24` | Sets the SVG viewBox attribute. Rarely needed as most SVGs define this |
| `focusable` | `boolean` | `false` | If true, the icon is focusable and will be included in tab order |
| `role` | `string` | - | Sets the ARIA role. Typically used for decorative icons that need semantic HTML |
| `aria-label` | `string` | - | Provides an accessible label for the icon. Essential when icon conveys meaning |
| `aria-hidden` | `boolean` | `true` (default for decorative icons) | If true, icon is hidden from screen readers (appropriate for decorative icons) |

### Style Props

Icon components accept all Chakra style props through the Box component base:

```jsx
<Icon
  as={FiHome}
  boxSize="6"           // Responsive sizing
  color="blue.500"      // Color from theme
  _hover={{ color: "blue.700" }}  // Hover state
  _dark={{ color: "blue.200" }}   // Dark mode
  transition="all 0.2s"  // Smooth transitions
/>
```

## Common Patterns

### Pattern: Size Variants

Icons scale through the `boxSize` prop. Use consistent sizing for visual coherence:

```jsx
import { Icon, Stack } from '@chakra-ui/react'
import { FiStar } from 'react-icons/fi'

function SizeVariants() {
  return (
    <Stack direction="row" spacing={4}>
      <Icon as={FiStar} boxSize="4" />    {/* 16px */}
      <Icon as={FiStar} boxSize="6" />    {/* 24px */}
      <Icon as={FiStar} boxSize="8" />    {/* 32px */}
      <Icon as={FiStar} boxSize="12" />   {/* 48px */}
    </Stack>
  )
}
```

### Pattern: Icon Buttons

Combine icons with button functionality for interactive icon-based actions:

```jsx
import { Icon, IconButton, HStack } from '@chakra-ui/react'
import { FiEdit, FiTrash2, FiDownload } from 'react-icons/fi'

function IconButtons() {
  return (
    <HStack>
      <IconButton
        icon={<Icon as={FiEdit} />}
        aria-label="Edit item"
        colorScheme="blue"
      />
      <IconButton
        icon={<Icon as={FiTrash2} />}
        aria-label="Delete item"
        colorScheme="red"
      />
      <IconButton
        icon={<Icon as={FiDownload} />}
        aria-label="Download"
        colorScheme="green"
      />
    </HStack>
  )
}
```

### Pattern: Icon with Text

Combine icons with text for enhanced communication:

```jsx
import { Icon, HStack, Text, Button } from '@chakra-ui/react'
import { FiDownload, FiCheck } from 'react-icons/fi'

function IconWithText() {
  return (
    <HStack spacing={3}>
      {/* Icon next to text */}
      <HStack>
        <Icon as={FiDownload} />
        <Text>Download Report</Text>
      </HStack>

      {/* Button with icon and text */}
      <Button leftIcon={<Icon as={FiCheck} />}>
        Save Changes
      </Button>
    </HStack>
  )
}
```

### Pattern: Navigation Icons

Icons are commonly used in navigation components to provide visual cues:

```jsx
import { Icon, VStack, Box } from '@chakra-ui/react'
import { FiHome, FiSettings, FiLogOut } from 'react-icons/fi'

function NavigationIcons() {
  return (
    <VStack spacing={6} p={4}>
      <Box cursor="pointer" _hover={{ color: 'blue.500' }}>
        <Icon as={FiHome} boxSize="6" />
      </Box>
      <Box cursor="pointer" _hover={{ color: 'blue.500' }}>
        <Icon as={FiSettings} boxSize="6" />
      </Box>
      <Box cursor="pointer" _hover={{ color: 'red.500' }}>
        <Icon as={FiLogOut} boxSize="6" />
      </Box>
    </VStack>
  )
}
```

### Pattern: Status Indicators

Use colored icons to indicate status:

```jsx
import { Icon, HStack, Text, VStack } from '@chakra-ui/react'
import { FiCheckCircle, FiAlertCircle, FiXCircle, FiClock } from 'react-icons/fi'

function StatusIndicators() {
  return (
    <VStack align="start" spacing={3}>
      <HStack>
        <Icon as={FiCheckCircle} color="green.500" />
        <Text>Completed</Text>
      </HStack>
      <HStack>
        <Icon as={FiClock} color="yellow.500" />
        <Text>In Progress</Text>
      </HStack>
      <HStack>
        <Icon as={FiAlertCircle} color="orange.500" />
        <Text>Warning</Text>
      </HStack>
      <HStack>
        <Icon as={FiXCircle} color="red.500" />
        <Text>Failed</Text>
      </HStack>
    </VStack>
  )
}
```

### Pattern: Icon Loading Spinner

Create animated loading indicators with icons:

```jsx
import { Icon, Spinner } from '@chakra-ui/react'

function LoadingIcon() {
  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  )
}

// Or with animation
import { Icon, keyframes } from '@chakra-ui/react'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

function AnimatedIcon() {
  return (
    <Icon
      as={() => <svg>...</svg>}
      animation={`${spin} 1s linear infinite`}
    />
  )
}
```

### Pattern: Custom SVG Icons

Create wrapper components for frequently used custom icons:

```jsx
import { Icon, IconProps } from '@chakra-ui/react'

// Custom arrow icon
function ArrowRightIcon(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
      />
    </Icon>
  )
}

// Custom star icon
function StarIcon(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </Icon>
  )
}

// Usage
function CustomIcons() {
  return (
    <>
      <ArrowRightIcon boxSize="6" />
      <StarIcon boxSize="6" color="yellow.400" />
    </>
  )
}
```

## Visual Variations

### Color Variations

```jsx
import { Icon, Stack } from '@chakra-ui/react'
import { FiHeart } from 'react-icons/fi'

function ColorVariations() {
  return (
    <Stack direction="row" spacing={2}>
      <Icon as={FiHeart} color="red.500" />
      <Icon as={FiHeart} color="orange.500" />
      <Icon as={FiHeart} color="yellow.500" />
      <Icon as={FiHeart} color="green.500" />
      <Icon as={FiHeart} color="blue.500" />
      <Icon as={FiHeart} color="purple.500" />
    </Stack>
  )
}
```

### Weight/Stroke Variations

Different icon libraries offer various weights. react-icons provides multiple icon sets:

```jsx
import { Icon, Stack } from '@chakra-ui/react'
import { FiHome } from 'react-icons/fi'              // Feather icons (thin)
import { MdHome } from 'react-icons/md'              // Material Design (medium)
import { FaHome } from 'react-icons/fa'              // FontAwesome (bold)
import { HiHome } from 'react-icons/hi'              // HeroIcons (medium)

function WeightVariations() {
  return (
    <Stack direction="row" spacing={4}>
      <Icon as={FiHome} boxSize="6" />
      <Icon as={MdHome} boxSize="6" />
      <Icon as={FaHome} boxSize="6" />
      <Icon as={HiHome} boxSize="6" />
    </Stack>
  )
}
```

### Opacity/Disabled State

```jsx
import { Icon, Stack } from '@chakra-ui/react'
import { FiSettings } from 'react-icons/fi'

function DisabledIcon() {
  return (
    <Stack direction="row" spacing={4}>
      <Icon as={FiSettings} boxSize="6" />
      <Icon as={FiSettings} boxSize="6" opacity={0.5} />
      <Icon as={FiSettings} boxSize="6" opacity={0.25} />
    </Stack>
  )
}
```

## Size Patterns

### Fixed Sizes

```jsx
import { Icon, HStack } from '@chakra-ui/react'
import { FiHome } from 'react-icons/fi'

function FixedSizes() {
  const sizes = ['2', '4', '6', '8', '10', '12', '16']

  return (
    <HStack spacing={4}>
      {sizes.map(size => (
        <Icon key={size} as={FiHome} boxSize={size} />
      ))}
    </HStack>
  )
}
```

### Responsive Sizes

```jsx
import { Icon } from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'

function ResponsiveIcon() {
  return (
    // Small on mobile, medium on tablet, large on desktop
    <Icon as={FiMenu} boxSize={['4', '6', '8']} />
  )
}
```

### Scaling with Text

Icons should scale proportionally with adjacent text:

```jsx
import { Icon, HStack, Text, Heading } from '@chakra-ui/react'
import { FiStar } from 'react-icons/fi'

function ScaledIcon() {
  return (
    <>
      {/* Small text with small icon */}
      <HStack fontSize="sm">
        <Icon as={FiStar} boxSize="4" />
        <Text>Small text</Text>
      </HStack>

      {/* Normal text with normal icon */}
      <HStack fontSize="md">
        <Icon as={FiStar} boxSize="6" />
        <Text>Normal text</Text>
      </HStack>

      {/* Large heading with large icon */}
      <HStack fontSize="lg">
        <Icon as={FiStar} boxSize="8" />
        <Heading size="lg">Large heading</Heading>
      </HStack>
    </>
  )
}
```

### Custom Size Scale

```jsx
import { Icon } from '@chakra-ui/react'

function CustomSizeScale() {
  const sizes = {
    xs: '0.75rem',    // 12px
    sm: '1rem',       // 16px
    md: '1.5rem',     // 24px
    lg: '2rem',       // 32px
    xl: '3rem',       // 48px
  }

  return (
    <>
      <Icon as={FiHome} w={sizes.xs} h={sizes.xs} />
      <Icon as={FiHome} w={sizes.sm} h={sizes.sm} />
      <Icon as={FiHome} w={sizes.md} h={sizes.md} />
      <Icon as={FiHome} w={sizes.lg} h={sizes.lg} />
      <Icon as={FiHome} w={sizes.xl} h={sizes.xl} />
    </>
  )
}
```

## Color/Theming

### Using Chakra Color Tokens

```jsx
import { Icon, Stack } from '@chakra-ui/react'
import { FiHome } from 'react-icons/fi'

function ColorTokens() {
  return (
    <Stack>
      <Icon as={FiHome} color="gray.500" />
      <Icon as={FiHome} color="blue.500" />
      <Icon as={FiHome} color="teal.500" />
      <Icon as={FiHome} color="red.500" />
    </Stack>
  )
}
```

### Dark Mode Support

```jsx
import { Icon } from '@chakra-ui/react'
import { FiSun, FiMoon } from 'react-icons/fi'

function DarkModeIcon() {
  return (
    <>
      {/* Light gray in light mode, light color in dark mode */}
      <Icon
        as={FiSun}
        color="gray.700"
        _dark={{ color: 'yellow.200' }}
      />

      {/* Dark color in light mode, light color in dark mode */}
      <Icon
        as={FiMoon}
        color="gray.500"
        _dark={{ color: 'blue.200' }}
      />
    </>
  )
}
```

### Conditional Theming

```jsx
import { Icon, useColorMode } from '@chakra-ui/react'
import { FiStar } from 'react-icons/fi'

function ThemingExample() {
  const { colorMode } = useColorMode()
  const color = colorMode === 'dark' ? 'yellow.200' : 'yellow.400'

  return <Icon as={FiStar} color={color} />
}
```

### CSS Custom Properties

```jsx
import { Icon } from '@chakra-ui/react'

function CustomPropertyIcon() {
  return (
    <Icon
      as={() => (
        <svg viewBox="0 0 24 24" fill="var(--icon-color)">
          <path d="..." />
        </svg>
      )}
      style={{ '--icon-color': '#3182ce' } as React.CSSProperties}
    />
  )
}
```

## Icon Libraries

### react-icons

The most popular choice, offering multiple icon sets:

```jsx
import { Icon } from '@chakra-ui/react'
// Feather icons
import { FiHome, FiSettings, FiSearch } from 'react-icons/fi'
// Material Design icons
import { MdHome, MdSettings, MdSearch } from 'react-icons/md'
// Font Awesome icons
import { FaHome, FaGithub, FaGoogle } from 'react-icons/fa'
// HeroIcons
import { HiHome, HiCog, HiMagnifyingGlass } from 'react-icons/hi2'

function IconLibraryExamples() {
  return (
    <>
      <Icon as={FiHome} />
      <Icon as={MdHome} />
      <Icon as={FaHome} />
      <Icon as={HiHome} />
    </>
  )
}
```

### Using SVG Files Directly

```jsx
import { Icon } from '@chakra-ui/react'
import Logo from './logo.svg'

function SVGFileIcon() {
  return <Icon as={Logo} boxSize="6" />
}
```

### Using react-icons with Tree-shaking

```jsx
// ✅ Optimal - only import what you use
import { FiHome } from 'react-icons/fi'

// ❌ Avoid - imports entire library
import * as FiIcons from 'react-icons/fi'
```

## Custom Icons

### Creating Reusable Custom Icon Components

```jsx
import { Icon, IconProps } from '@chakra-ui/react'

// Generic custom icon wrapper
function CustomIcon({ children, ...props }) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      {children}
    </Icon>
  )
}

// Specific custom icons
function PlayIcon(props) {
  return (
    <CustomIcon {...props}>
      <path
        fill="currentColor"
        d="M8 5v14l11-7z"
      />
    </CustomIcon>
  )
}

function PauseIcon(props) {
  return (
    <CustomIcon {...props}>
      <path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </CustomIcon>
  )
}

// Usage
function VideoControls() {
  return (
    <>
      <PlayIcon boxSize="6" color="blue.500" />
      <PauseIcon boxSize="6" color="blue.500" />
    </>
  )
}
```

### Custom Icon from Sketch/Figma

```jsx
import { Icon } from '@chakra-ui/react'

function BrandLogoIcon(props) {
  return (
    <Icon viewBox="0 0 100 100" {...props}>
      {/* SVG paths from your design tool */}
      <circle cx="50" cy="50" r="45" fill="currentColor" />
      <path d="..." fill="white" />
    </Icon>
  )
}
```

### Multi-color Custom Icon

```jsx
import { Icon } from '@chakra-ui/react'

function MultiColorIcon() {
  return (
    <Icon viewBox="0 0 24 24">
      <path fill="#3182ce" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path fill="white" d="M16 13h-5v5h-2v-5H4v-2h5V6h2v5h5v2z" />
    </Icon>
  )
}
```

## Accessibility

### Decorative Icons

For purely decorative icons (no semantic meaning), hide from screen readers:

```jsx
import { Icon, Heading, HStack } from '@chakra-ui/react'
import { FiStar } from 'react-icons/fi'

function DecorativeIcon() {
  return (
    <HStack>
      <Icon as={FiStar} aria-hidden boxSize="6" />
      <Heading>Rating: 5 stars</Heading>
    </HStack>
  )
}
```

### Meaningful Icons

When icons convey important information, provide accessible labels:

```jsx
import { Icon, HStack, Text } from '@chakra-ui/react'
import { FiAlertCircle } from 'react-icons/fi'

function MeaningfulIcon() {
  return (
    <HStack>
      <Icon
        as={FiAlertCircle}
        color="red.500"
        aria-label="Error"
      />
      <Text>An error occurred</Text>
    </HStack>
  )
}
```

### Icon Button Accessibility

```jsx
import { Icon, IconButton } from '@chakra-ui/react'
import { FiSettings } from 'react-icons/fi'

function AccessibleIconButton() {
  return (
    <IconButton
      aria-label="Settings"
      icon={<Icon as={FiSettings} />}
      onClick={() => {}}
    />
  )
}
```

### ARIA Labels with Titles

```jsx
import { Icon, Tooltip } from '@chakra-ui/react'
import { FiInfo } from 'react-icons/fi'

function TooltipIcon() {
  return (
    <Tooltip label="This is additional information">
      <Icon
        as={FiInfo}
        aria-label="Information"
        boxSize="5"
        cursor="help"
      />
    </Tooltip>
  )
}
```

## Interactive Patterns

### Clickable Icon

```jsx
import { Icon, Box } from '@chakra-ui/react'
import { FiHeart } from 'react-icons/fi'
import { useState } from 'react'

function ClickableIcon() {
  const [liked, setLiked] = useState(false)

  return (
    <Box
      as="button"
      cursor="pointer"
      _focus={{ outline: 'none' }}
      onClick={() => setLiked(!liked)}
    >
      <Icon
        as={FiHeart}
        color={liked ? 'red.500' : 'gray.400'}
        _hover={{ color: 'red.400' }}
        boxSize="6"
        transition="all 0.2s"
      />
    </Box>
  )
}
```

### Icon Hover Effects

```jsx
import { Icon, Box } from '@chakra-ui/react'
import { FiBell } from 'react-icons/fi'

function HoverIcon() {
  return (
    <Icon
      as={FiBell}
      boxSize="6"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        transform: 'scale(1.2)',
        color: 'blue.500',
      }}
      _active={{
        transform: 'scale(0.95)',
      }}
    />
  )
}
```

### Icon with Animation

```jsx
import { Icon, keyframes } from '@chakra-ui/react'
import { FiRefreshCw } from 'react-icons/fi'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

function AnimatedIcon() {
  return (
    <Icon
      as={FiRefreshCw}
      boxSize="6"
      animation={`${spin} 1s linear infinite`}
    />
  )
}
```

### Icon Badge

```jsx
import { Icon, Box, Badge } from '@chakra-ui/react'
import { FiBell } from 'react-icons/fi'

function IconWithBadge() {
  return (
    <Box position="relative" display="inline-block">
      <Icon as={FiBell} boxSize="6" />
      <Badge
        position="absolute"
        top="-2"
        right="-2"
        borderRadius="full"
        colorScheme="red"
      >
        5
      </Badge>
    </Box>
  )
}
```

## Advanced Patterns

### Icon SVG with Gradient

```jsx
import { Icon } from '@chakra-ui/react'

function GradientIcon() {
  return (
    <Icon viewBox="0 0 24 24">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3182ce', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ed8936', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#grad1)" />
      <path fill="white" d="M12 7v5h5v2h-7V7h2z" />
    </Icon>
  )
}
```

### SVG with Stroke and Fill

```jsx
import { Icon } from '@chakra-ui/react'

function StrokeAndFillIcon() {
  return (
    <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  )
}
```

### Icon Filter/Effect

```jsx
import { Icon } from '@chakra-ui/react'

function FilteredIcon() {
  return (
    <Icon viewBox="0 0 24 24" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path fill="white" d="M12 7v10M7 12h10" />
    </Icon>
  )
}
```

### Animated SVG Path

```jsx
import { Icon, keyframes } from '@chakra-ui/react'

const draw = keyframes`
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
`

function AnimatedPathIcon() {
  return (
    <Icon
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="1000"
      animation={`${draw} 2s ease-in-out`}
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </Icon>
  )
}
```

### Icon Composition Pattern

```jsx
import { Icon, Box } from '@chakra-ui/react'
import { FiHome, FiCheckCircle } from 'react-icons/fi'

function ComposedIcon() {
  return (
    <Box position="relative" display="inline-block">
      <Icon as={FiHome} boxSize="8" color="blue.500" />
      <Box
        position="absolute"
        bottom="-1"
        right="-1"
        bg="white"
        borderRadius="full"
        p="0.5"
      >
        <Icon as={FiCheckCircle} boxSize="4" color="green.500" />
      </Box>
    </Box>
  )
}
```

### Icon in Form Field

```jsx
import { Icon, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'

function SearchIcon() {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Icon as={FiSearch} color="gray.400" />
      </InputLeftElement>
      <Input type="text" placeholder="Search..." />
    </InputGroup>
  )
}
```

## Notes

### Important Observations

1. **Color Inheritance**: Icons use `currentColor` by default, meaning they inherit the color from their parent element. This makes it easy to apply colors through container styling.

2. **Responsive Design**: Use array-based boxSize values for responsive icon sizing:
   ```jsx
   <Icon boxSize={['4', '6', '8']} />  // 16px, 24px, 32px on different screen sizes
   ```

3. **Icon Library Performance**: When using react-icons, ensure you're importing specific icons rather than entire icon sets to minimize bundle size.

4. **SVG ViewBox**: Always verify your custom SVG has a proper viewBox attribute (e.g., `viewBox="0 0 24 24"`). Without it, scaling may not work as expected.

5. **Accessibility Default**: Icons are `aria-hidden` by default (treated as decorative). Always add `aria-label` or ensure text context exists for meaningful icons.

6. **Box vs Icon**: The Icon component is specifically for SVG icons. For raster images, use the Image component instead.

7. **Spacing**: When combining icons with text, use Chakra's Stack or HStack with appropriate spacing rather than trying to position icons with margins.

8. **Custom SVG Optimization**: When creating custom SVG icons, ensure paths are optimized and remove unnecessary fill/stroke attributes to let `currentColor` work properly.

9. **Theme Integration**: Icons automatically respect Chakra's color mode (light/dark) through the color system. Use color tokens instead of hardcoded colors.

10. **Focus States**: For interactive icons, ensure proper focus states are visible using `_focus={{}}` pseudo-style props.

---

**Research Date**: 2025-11-05
**Chakra UI Versions Analyzed**: v2.x and v3.x
**Documentation Sources**: Official Chakra UI documentation, react-icons library, GitHub examples, accessibility guidelines
