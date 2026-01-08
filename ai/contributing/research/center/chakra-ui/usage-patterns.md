# Chakra UI - Center Component Usage Patterns

## Component URL
https://chakra-ui.com/docs/components/center
Status: ✅ Working
Version: 3.28.1 (current)
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear purpose and examples, though documentation is minimal. The component is intentionally simple and focused.

## Component Definition

### Center Component

**Core purpose**: Centers its child element within itself using flexbox layout. Provides a simple, declarative way to achieve both horizontal and vertical centering without manually configuring flexbox properties.

**Mental model**: Think of Center as a "centering box" that uses flexbox (`display: flex` with `align-items: center` and `justify-content: center`) to position content in the middle of its container. It's a convenience wrapper that eliminates the need to remember flexbox centering patterns.

**Semantic meaning**: Center communicates:
- Content should be visually centered within available space
- Equal spacing on all sides (when container is larger than content)
- Primary/important content that deserves visual prominence through centering
- Symmetrical layout balance

**Use Cases**:
- Centering icons, badges, or small UI elements
- Creating circular avatar containers
- Centering loading spinners
- Centering empty state messages
- Creating balanced card layouts
- Centering form elements or buttons
- Square containers for consistent sizing
- Absolute positioning of centered overlays

---

## Pattern Support Levels
- **Native**: Dedicated component with built-in centering behavior
- **Composed**: Composes Box component (inherits all Box props)
- **Variants**: Three specialized variants (Center, Square, Circle)

---

## Component Variants

### 1. Center (Base Component)

**Support Level**: Level 1 (Universal)

**Purpose**: General-purpose centering container with flexible dimensions.

**Implementation**: Renders as a flex container with:
- `display: flex`
- `align-items: center` (vertical centering)
- `justify-content: center` (horizontal centering)

**Basic Usage**:
```jsx
import { Center } from '@chakra-ui/react'

<Center bg="bg.emphasized" height="100px" maxWidth="320px">
  This will be centered
</Center>
```

**Common Patterns**:

**Icon Centering**:
```jsx
<Center w="40px" h="40px" bg="blue.500" color="white">
  <Icon as={FiStar} />
</Center>
```

**Badge Container**:
```jsx
<Center w="20px" h="20px" bg="red.500" color="white" borderRadius="full" fontSize="xs">
  5
</Center>
```

**Loading Spinner**:
```jsx
<Center minH="200px">
  <Spinner size="lg" />
</Center>
```

**Empty State**:
```jsx
<Center minH="400px" flexDirection="column" gap={4}>
  <Icon as={FiInbox} boxSize={12} color="gray.400" />
  <Text color="gray.600">No items found</Text>
</Center>
```

### 2. Square

**Support Level**: Level 1 (Universal)

**Purpose**: Enforces equal width and height for perfectly square containers.

**Implementation**: Extends Center with size constraint where width equals height.

**Common Usage**:
```jsx
import { Square } from '@chakra-ui/react'

<Square size="40px" bg="purple.500" color="white">
  <Icon as={FiUser} />
</Square>
```

**Avatar Placeholder**:
```jsx
<Square size="50px" bg="teal.500" color="white" fontSize="xl" fontWeight="bold">
  JD
</Square>
```

**Icon Button Base**:
```jsx
<Square size="44px" bg="gray.100" borderRadius="md" cursor="pointer" _hover={{ bg: 'gray.200' }}>
  <Icon as={FiSettings} />
</Square>
```

**Grid Items**:
```jsx
<SimpleGrid columns={3} spacing={4}>
  <Square size="100px" bg="red.100">1</Square>
  <Square size="100px" bg="green.100">2</Square>
  <Square size="100px" bg="blue.100">3</Square>
</SimpleGrid>
```

### 3. Circle

**Support Level**: Level 1 (Universal)

**Purpose**: Creates perfectly circular containers by combining Square's equal dimensions with full border radius.

**Implementation**: Extends Square with `borderRadius="full"` (50%).

**Common Usage**:
```jsx
import { Circle } from '@chakra-ui/react'

<Circle size="40px" bg="tomato" color="white">
  <Icon as={FiCheck} />
</Circle>
```

**Avatar**:
```jsx
<Circle size="60px" bg="blue.500" color="white" fontSize="2xl" fontWeight="bold">
  AK
</Circle>
```

**Status Indicator**:
```jsx
<Circle size="12px" bg="green.500" border="2px solid white" />
```

**Icon Circle**:
```jsx
<Circle size="50px" bg="purple.100" color="purple.600">
  <Icon as={FiHeart} boxSize={6} />
</Circle>
```

**Badge Count**:
```jsx
<Circle size="24px" bg="red.500" color="white" fontSize="sm" fontWeight="bold">
  9+
</Circle>
```

### 4. AbsoluteCenter

**Support Level**: Level 2 (Common)

**Purpose**: Centers content using absolute positioning within a relatively positioned parent.

**Implementation**: Uses `position: absolute` with centering transforms or positioning.

**Common Usage**:
```jsx
import { AbsoluteCenter, Box } from '@chakra-ui/react'

<Box position="relative" h="100px">
  <AbsoluteCenter>
    <Text>Absolutely centered</Text>
  </AbsoluteCenter>
</Box>
```

**Overlay Text**:
```jsx
<Box position="relative" h="200px" bgImage="url('/image.jpg')">
  <AbsoluteCenter bg="blackAlpha.700" color="white" px={4} py={2} borderRadius="md">
    Overlay Text
  </AbsoluteCenter>
</Box>
```

**Watermark**:
```jsx
<Box position="relative" minH="300px">
  <AbsoluteCenter opacity={0.1} fontSize="6xl" fontWeight="bold" transform="rotate(-45deg)">
    DRAFT
  </AbsoluteCenter>
  <Text>Document content...</Text>
</Box>
```

---

## Props and API

### Center Props

**Support Level**: Level 1 (Universal)

Since Center composes Box, it inherits all Box props plus flexbox properties:

**Layout Props**:
- `w`, `width` - Container width
- `h`, `height` - Container height
- `minW`, `minWidth` - Minimum width
- `minH`, `minHeight` - Minimum height
- `maxW`, `maxWidth` - Maximum width
- `maxH`, `maxHeight` - Maximum height

**Spacing Props**:
- `p`, `padding` - Internal padding
- `m`, `margin` - External margin
- `px`, `paddingInline` - Horizontal padding
- `py`, `paddingBlock` - Vertical padding

**Color Props**:
- `bg`, `background` - Background color
- `color` - Text/foreground color
- `bgGradient` - Gradient background

**Border Props**:
- `borderRadius` - Border radius
- `borderWidth` - Border width
- `borderColor` - Border color
- `border` - Shorthand border

**Flexbox Override Props**:
- `flexDirection` - Change flex direction (default: row)
- `gap` - Spacing between children
- `wrap` - Flex wrap behavior

### Square Props

**Support Level**: Level 1 (Universal)

All Center props plus:
- `size` - Sets both width and height to same value

**Size Prop Usage**:
```jsx
<Square size="40px">    {/* width: 40px, height: 40px */}
<Square size={10}>      {/* width: 2.5rem, height: 2.5rem (theme spacing) */}
<Square size="md">      {/* width: theme.sizes.md, height: theme.sizes.md */}
```

### Circle Props

**Support Level**: Level 1 (Universal)

All Square props plus:
- `borderRadius` - Automatically set to "full" (50%)

Can be overridden for semi-circles or custom radiuses:
```jsx
<Circle size="50px" borderRadius="30%">   {/* Custom radius */}
```

### AbsoluteCenter Props

**Support Level**: Level 2 (Common)

All Box props plus:
- `axis` - Which axis to center on ("horizontal" | "vertical" | "both")

**Axis Options**:
```jsx
<AbsoluteCenter axis="horizontal">  {/* Center horizontally only */}
<AbsoluteCenter axis="vertical">    {/* Center vertically only */}
<AbsoluteCenter axis="both">        {/* Center both axes (default) */}
```

---

## Composition Patterns

### Center with Stack

**Support Level**: Level 1 (Universal)

Combining Center with VStack/HStack for multi-element layouts:

```jsx
<Center minH="300px">
  <VStack spacing={4}>
    <Icon as={FiAlertCircle} boxSize={12} color="orange.500" />
    <Heading size="md">No Results</Heading>
    <Text color="gray.600">Try adjusting your search</Text>
    <Button>Clear Filters</Button>
  </VStack>
</Center>
```

### Center as Card Container

**Support Level**: Level 1 (Universal)

```jsx
<Center p={8} bg="white" borderRadius="lg" boxShadow="xl" minH="200px">
  <VStack spacing={3}>
    <Circle size="60px" bg="blue.100" color="blue.600">
      <Icon as={FiMail} boxSize={8} />
    </Circle>
    <Text fontSize="lg" fontWeight="bold">Check Your Email</Text>
    <Text fontSize="sm" color="gray.600" textAlign="center">
      We've sent a verification link to your inbox
    </Text>
  </VStack>
</Center>
```

### Responsive Centering

**Support Level**: Level 1 (Universal)

```jsx
<Center
  minH={{ base: "200px", md: "400px" }}
  bg={{ base: "gray.50", md: "white" }}
  p={{ base: 4, md: 8 }}
>
  <Box textAlign="center" maxW="md">
    <Heading size="xl">Welcome</Heading>
    <Text mt={4}>Get started with your journey</Text>
  </Box>
</Center>
```

### Grid of Circles

**Support Level**: Level 1 (Universal)

```jsx
<SimpleGrid columns={{ base: 3, md: 6 }} spacing={4}>
  {categories.map((cat) => (
    <Circle
      key={cat.id}
      size={{ base: "80px", md: "100px" }}
      bg={cat.color}
      color="white"
      cursor="pointer"
      _hover={{ transform: 'scale(1.1)' }}
      transition="transform 0.2s"
    >
      <VStack spacing={1}>
        <Icon as={cat.icon} boxSize={6} />
        <Text fontSize="xs">{cat.name}</Text>
      </VStack>
    </Circle>
  ))}
</SimpleGrid>
```

---

## Styling Approaches

### Background and Colors

**Support Level**: Level 1 (Universal)

```jsx
// Solid colors
<Center bg="blue.500" color="white" h="100px">
  Colored background
</Center>

// Gradients
<Center bgGradient="linear(to-r, purple.500, pink.500)" color="white" h="100px">
  Gradient background
</Center>

// Transparent backgrounds
<Center bg="blackAlpha.600" color="white" h="100px">
  Semi-transparent
</Center>
```

### Borders and Shadows

**Support Level**: Level 1 (Universal)

```jsx
<Circle
  size="60px"
  bg="white"
  borderWidth={2}
  borderColor="blue.500"
  boxShadow="lg"
>
  <Icon as={FiUser} color="blue.500" />
</Circle>
```

### Hover and Interactive States

**Support Level**: Level 1 (Universal)

```jsx
<Square
  size="50px"
  bg="gray.100"
  cursor="pointer"
  _hover={{
    bg: 'blue.500',
    color: 'white',
    transform: 'scale(1.1)'
  }}
  transition="all 0.2s"
>
  <Icon as={FiStar} />
</Square>
```

### Dark Mode Support

**Support Level**: Level 1 (Universal)

```jsx
import { useColorModeValue } from '@chakra-ui/react'

function ThemedCenter() {
  const bg = useColorModeValue('gray.100', 'gray.700')
  const color = useColorModeValue('gray.800', 'white')

  return (
    <Center bg={bg} color={color} h="100px">
      Theme-aware content
    </Center>
  )
}
```

---

## Accessibility

### Center Accessibility

**Support Level**: Level 1 (Universal)

Center is a layout component with no inherent accessibility concerns, but considerations include:

#### Semantic HTML

```jsx
// Use semantic elements when appropriate
<Center as="section" minH="400px">
  <article>
    <Heading>Centered Content</Heading>
  </article>
</Center>

// Don't add ARIA roles to layout containers
<Center role="banner">  {/* ❌ Incorrect - Center is layout only */}
```

#### Keyboard Navigation

```jsx
// Center doesn't interfere with focus
<Center minH="200px">
  <Button>Focusable Button</Button>
</Center>

// Interactive circles should have proper focus styles
<Circle
  size="50px"
  bg="blue.500"
  cursor="pointer"
  tabIndex={0}
  _focus={{
    outline: '2px solid',
    outlineColor: 'blue.300',
    outlineOffset: '2px'
  }}
>
  <Icon as={FiPlus} />
</Circle>
```

#### Color Contrast

```jsx
// Ensure sufficient contrast (WCAG AA: 4.5:1 for text)
<Circle size="50px" bg="blue.600" color="white">  {/* ✅ Good contrast */}
  <Text fontSize="xl">A</Text>
</Circle>

<Circle size="50px" bg="yellow.200" color="yellow.400">  {/* ❌ Poor contrast */}
  <Text fontSize="xl">A</Text>
</Circle>
```

#### Screen Readers

```jsx
// Add alt text for icon-only circles
<Circle size="40px" bg="green.500" aria-label="Success" role="img">
  <Icon as={FiCheck} color="white" />
</Circle>

// Avoid centering without context
<Center minH="100vh">
  <Spinner />  {/* ❌ Screen reader doesn't know what's happening */}
</Center>

// Better: Provide context
<Center minH="100vh">
  <VStack>
    <Spinner />
    <Text srOnly>Loading content, please wait</Text>
  </VStack>
</Center>
```

**Best Practices**:
- Don't use Center as a focusable element
- Ensure interactive children have proper focus indicators
- Meet WCAG color contrast requirements
- Provide context for decorative circles/squares
- Use semantic HTML elements where appropriate
- Test keyboard navigation flow
- Provide `aria-label` for icon-only content

---

## Responsive Design Patterns

### Responsive Sizing

**Support Level**: Level 1 (Universal)

```jsx
// Responsive height
<Center minH={{ base: "150px", md: "250px", lg: "400px" }}>
  <Text>Responsive height</Text>
</Center>

// Responsive circle sizes
<Circle size={{ base: "40px", md: "60px", lg: "80px" }} bg="purple.500">
  <Icon as={FiStar} boxSize={{ base: 4, md: 6, lg: 8 }} />
</Circle>
```

### Mobile-First Patterns

**Support Level**: Level 1 (Universal)

```jsx
<Center
  flexDirection={{ base: "column", md: "row" }}
  gap={{ base: 2, md: 4 }}
  p={{ base: 4, md: 8 }}
>
  <Circle size="50px" bg="blue.500">A</Circle>
  <Text>Stack on mobile, row on desktop</Text>
</Center>
```

### Responsive Grid of Circles

**Support Level**: Level 1 (Universal)

```jsx
<SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={{ base: 3, md: 6 }}>
  {items.map((item) => (
    <Circle
      key={item.id}
      size={{ base: "70px", md: "90px" }}
      bg={item.color}
      color="white"
    >
      <Icon as={item.icon} />
    </Circle>
  ))}
</SimpleGrid>
```

---

## Common Use Cases and Examples

### 1. Avatar Placeholders

```jsx
import { Circle, HStack, Text } from '@chakra-ui/react'

function AvatarList({ users }) {
  return (
    <HStack spacing={-2}>
      {users.slice(0, 3).map((user) => (
        <Circle
          key={user.id}
          size="40px"
          bg={user.color}
          color="white"
          borderWidth={2}
          borderColor="white"
          fontSize="sm"
          fontWeight="bold"
        >
          {user.initials}
        </Circle>
      ))}
      {users.length > 3 && (
        <Circle size="40px" bg="gray.200" color="gray.700" fontSize="xs">
          +{users.length - 3}
        </Circle>
      )}
    </HStack>
  )
}
```

### 2. Icon Grid

```jsx
import { SimpleGrid, Square, Icon, VStack, Text } from '@chakra-ui/react'
import { FiHome, FiUser, FiSettings, FiMail } from 'react-icons/fi'

function IconGrid() {
  const items = [
    { icon: FiHome, label: 'Home', color: 'blue.500' },
    { icon: FiUser, label: 'Profile', color: 'green.500' },
    { icon: FiSettings, label: 'Settings', color: 'purple.500' },
    { icon: FiMail, label: 'Messages', color: 'orange.500' },
  ]

  return (
    <SimpleGrid columns={2} spacing={6}>
      {items.map((item) => (
        <VStack key={item.label}>
          <Square
            size="80px"
            bg={`${item.color.split('.')[0]}.100`}
            color={item.color}
            borderRadius="lg"
            cursor="pointer"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
            transition="all 0.2s"
          >
            <Icon as={item.icon} boxSize={8} />
          </Square>
          <Text fontSize="sm" fontWeight="medium">{item.label}</Text>
        </VStack>
      ))}
    </SimpleGrid>
  )
}
```

### 3. Loading States

```jsx
import { Center, Spinner, VStack, Text } from '@chakra-ui/react'

function LoadingState({ message = "Loading..." }) {
  return (
    <Center minH="400px" bg="gray.50" borderRadius="lg">
      <VStack spacing={4}>
        <Spinner size="xl" thickness="4px" color="blue.500" />
        <Text color="gray.600">{message}</Text>
      </VStack>
    </Center>
  )
}
```

### 4. Empty States

```jsx
import { Center, VStack, Icon, Heading, Text, Button } from '@chakra-ui/react'
import { FiInbox } from 'react-icons/fi'

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <Center minH="400px">
      <VStack spacing={4} maxW="md" textAlign="center">
        <Circle size="80px" bg="gray.100">
          <Icon as={FiInbox} boxSize={10} color="gray.400" />
        </Circle>
        <Heading size="md" color="gray.700">{title}</Heading>
        <Text color="gray.600">{description}</Text>
        {actionLabel && (
          <Button colorScheme="blue" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </VStack>
    </Center>
  )
}
```

### 5. Status Badges

```jsx
import { HStack, Circle, Text } from '@chakra-ui/react'

function StatusBadge({ status, count }) {
  const config = {
    online: { bg: 'green.500', label: 'Online' },
    offline: { bg: 'gray.500', label: 'Offline' },
    busy: { bg: 'red.500', label: 'Busy' },
    away: { bg: 'yellow.500', label: 'Away' },
  }

  return (
    <HStack spacing={2}>
      <Circle size="8px" bg={config[status].bg} />
      <Text fontSize="sm" color="gray.700">
        {config[status].label}
      </Text>
      {count && (
        <Circle size="20px" bg="red.500" color="white" fontSize="xs">
          {count}
        </Circle>
      )}
    </HStack>
  )
}
```

### 6. Feature Cards

```jsx
import { Center, VStack, Circle, Icon, Heading, Text } from '@chakra-ui/react'
import { FiZap, FiShield, FiTrendingUp } from 'react-icons/fi'

function FeatureCard({ icon, title, description, color }) {
  return (
    <Center
      p={8}
      bg="white"
      borderRadius="lg"
      borderWidth={1}
      flexDirection="column"
      _hover={{ boxShadow: 'lg', transform: 'translateY(-4px)' }}
      transition="all 0.2s"
    >
      <VStack spacing={4}>
        <Circle size="60px" bg={`${color}.100`} color={`${color}.600`}>
          <Icon as={icon} boxSize={8} />
        </Circle>
        <Heading size="md">{title}</Heading>
        <Text textAlign="center" color="gray.600">
          {description}
        </Text>
      </VStack>
    </Center>
  )
}

// Usage
<SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
  <FeatureCard
    icon={FiZap}
    title="Fast"
    description="Lightning quick performance"
    color="yellow"
  />
  <FeatureCard
    icon={FiShield}
    title="Secure"
    description="Enterprise-grade security"
    color="green"
  />
  <FeatureCard
    icon={FiTrendingUp}
    title="Scalable"
    description="Grows with your needs"
    color="blue"
  />
</SimpleGrid>
```

### 7. Image Placeholder

```jsx
import { Center, Icon, Text, VStack } from '@chakra-ui/react'
import { FiImage } from 'react-icons/fi'

function ImagePlaceholder({ width = "200px", height = "200px" }) {
  return (
    <Center
      w={width}
      h={height}
      bg="gray.100"
      borderRadius="md"
      borderWidth={2}
      borderStyle="dashed"
      borderColor="gray.300"
    >
      <VStack spacing={2}>
        <Icon as={FiImage} boxSize={8} color="gray.400" />
        <Text fontSize="sm" color="gray.500">No image</Text>
      </VStack>
    </Center>
  )
}
```

---

## Notable Features

### Strengths

1. **Simplicity**: Eliminates the need to remember flexbox centering patterns
2. **Composability**: Built on Box, inherits all styling capabilities
3. **Variants**: Three specialized variants (Center, Square, Circle) cover common use cases
4. **Responsive**: Full support for responsive props via Chakra's system
5. **AbsoluteCenter**: Useful for overlays and watermarks
6. **Type-safe**: Full TypeScript support
7. **Performance**: Lightweight wrapper with minimal overhead

### Innovative Patterns

1. **Square component**: Enforces equal width/height with single `size` prop
2. **Circle component**: Automatic circular shape without manual border-radius
3. **AbsoluteCenter axis control**: Granular control over centering direction
4. **Seamless Box integration**: All Box props available for maximum flexibility

### Limitations

1. **Single-child optimization**: Works best with single child (multiple children may need additional layout)
2. **No grid alignment**: For complex grid centering, need to use Grid component
3. **No text-align**: Centers elements, not text within elements (use `textAlign` prop)
4. **Absolute positioning parent required**: AbsoluteCenter requires `position: relative` parent

---

## Performance Considerations

### Lightweight Component

Center is extremely lightweight:
- No state management
- No event listeners
- Simple CSS transformation
- Minimal re-render overhead

### Optimization Tips

```jsx
// ✅ Good: Static props
<Center minH="200px" bg="gray.50">
  <DynamicContent />
</Center>

// ❌ Avoid: Dynamic prop calculations
<Center minH={calculateHeight()} bg={theme.bg}>
  <DynamicContent />
</Center>

// ✅ Better: Memoize calculations
const height = useMemo(() => calculateHeight(), [deps])
<Center minH={height} bg="gray.50">
  <DynamicContent />
</Center>
```

---

## Integration with Other Chakra Components

### Center + Stack

```jsx
<Center minH="300px">
  <VStack spacing={4}>
    <Icon as={FiAlertCircle} boxSize={12} />
    <Text>Centered vertical stack</Text>
  </VStack>
</Center>
```

### Center + Modal

```jsx
<Modal isCentered isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <Center p={8}>
      <Text>Centered modal content</Text>
    </Center>
  </ModalContent>
</Modal>
```

### Center + Tooltip

```jsx
<Tooltip label="Centered icon with tooltip">
  <Center w="40px" h="40px" bg="blue.500" borderRadius="md">
    <Icon as={FiInfo} color="white" />
  </Center>
</Tooltip>
```

---

## Research Notes

### Documentation Observations

- Documentation is intentionally minimal - component is straightforward
- Focus on practical examples rather than extensive API documentation
- Part of Chakra UI's layout primitive set
- Version 3.28.1 maintains consistency with v2 API
- Source code readily available on GitHub
- Interactive Storybook examples available

### Framework Approach

- Chakra UI prioritizes composition over configuration
- Center demonstrates the "do one thing well" philosophy
- Variants (Square, Circle) show progressive enhancement pattern
- AbsoluteCenter shows thoughtful extension for related use cases
- Full integration with Chakra's styling system
- Type-safe props via TypeScript

### Developer Experience

- Intuitive naming (Center, Square, Circle)
- Predictable behavior
- Excellent TypeScript support
- Comprehensive responsive prop support
- Works seamlessly with all Chakra components
- Easy to customize via style props

---

## Summary

Chakra UI's Center component family provides simple, declarative centering utilities that eliminate common layout friction points. The base Center component handles general centering, while Square and Circle variants address specific geometric needs. AbsoluteCenter extends the pattern to absolute positioning scenarios.

**Key Takeaways**:
- Flexbox-based centering without manual configuration
- Three variants for common patterns (Center, Square, Circle)
- Full Box composition for maximum styling flexibility
- Responsive design support via array/object syntax
- Lightweight and performant
- Excellent for icons, badges, avatars, empty states, and loading indicators

**Best For**:
- Icon containers
- Avatar placeholders
- Badge/notification indicators
- Loading and empty states
- Centered layouts
- Circular UI elements
- Equal-dimension squares
- Overlay centering (AbsoluteCenter)
