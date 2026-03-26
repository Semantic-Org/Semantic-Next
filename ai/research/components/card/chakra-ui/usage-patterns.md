# Chakra UI - Card Usage Patterns

## Component URL
https://chakra-ui.com/docs/components/card (v3)
https://v2.chakra-ui.com/docs/components/card (v2)

**Status:** ✅ Working (both versions)
**Version:** v3.28.1 (current), v2 (legacy)
**Last Verified:** 2025-11-04

## Documentation Quality
**Comprehensive** - Excellent documentation with clear examples, multiple variants, responsive patterns, and extensive composition examples.

## Component Definition
- **Core purpose**: A structured container component designed to group and display related content in a clear, organized format. Provides visual separation and hierarchy for content presentation.
- **Mental model**: A flexible box with optional header/body/footer sections, similar to a physical card that contains organized information.
- **Semantic meaning**: Communicates content grouping and encapsulation. Creates a clear visual boundary around related information with built-in structural sections.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `variant="outline"`, `size="md"`)
- **Composed**: Via composition/children (e.g., `<Card><CardBody>content</CardBody></Card>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Container Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic container | ✅ | Native | `<Card>` provides base container with default styling |
| Sectioned structure | ✅ | Composed | `<CardHeader>`, `<CardBody>`, `<CardFooter>` sub-components |
| Layout direction | ✅ | Native | `direction` prop accepts responsive values (column/row/etc.) |
| Flexbox alignment | ✅ | Native | `align` and `justify` props for content positioning |

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Header content | ✅ | Composed | `<CardHeader>` sub-component for titles, headings |
| Body content | ✅ | Composed | `<CardBody>` sub-component for main content |
| Footer content | ✅ | Composed | `<CardFooter>` sub-component for actions, buttons |
| Image support | ✅ | Composed | Standard `<Image>` component used within Card |
| Avatar support | ✅ | Composed | `<Avatar>` component composable in header |
| Icon support | ✅ | Composed | Icons via `<IconButton>` or inline icons |
| Dividers | ✅ | Composed | `<Divider />` component for content separation |
| Nested stacks | ✅ | Composed | `<Stack>` with dividers for organized content lists |

## Layout Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | Native | Default `direction="column"` |
| Horizontal layout | ✅ | Native | `direction="row"` or `{ base: 'column', sm: 'row' }` |
| Responsive direction | ✅ | Native | Object syntax for breakpoint-based layouts |
| Content alignment | ✅ | Native | `align` prop (flex-start, center, etc.) |
| Content justification | ✅ | Native | `justify` prop (flex-start, space-between, etc.) |
| Grid layouts | ✅ | Composed | Multiple cards in `<SimpleGrid>` component |
| Centered content | ✅ | Native | `align='center'` on Card or sections |

## Variation Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: "sm", "md" (default), "lg" - controls padding/spacing |
| Visual variants | ✅ | Native | `variant` prop: "elevated" (default), "outline", "filled", "unstyled" |
| Color schemes | ✅ | Native | `colorScheme` prop accepts color tokens (v2) |
| Max width control | ✅ | CSS-only | `maxW='sm'`, `maxW='md'`, etc. using style props |
| Border radius | ✅ | CSS-only | Customizable via theme or style props |
| Spacing/padding | ✅ | Native | Controlled by `size` prop + CSS custom properties |
| Shadow depth | ✅ | Native | "elevated" variant provides shadow styling |

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading state | ❌ | - | Not built-in, would need custom implementation |
| Disabled state | ❌ | - | Not built-in, would need custom implementation |
| Selected state | ❌ | - | Not built-in, would need custom implementation |
| Hover effects | ✅ | CSS-only | Can be added via `_hover` style prop |
| Focus state | ❌ | - | Not built-in for non-interactive cards |

## Interactive Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable card | ✅ | CSS-only | Wrap in `<Link>` or add `onClick` + cursor styling |
| Action buttons | ✅ | Composed | Buttons in `<CardFooter>` with `<ButtonGroup>` |
| Icon buttons | ✅ | Composed | `<IconButton>` for compact actions (e.g., three-dots menu) |
| Footer actions | ✅ | Composed | Button groups in footer with spacing control |
| Social actions | ✅ | Composed | Like/Comment/Share pattern shown in examples |

## Styling Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Style props | ✅ | Native | Full Chakra style props system (bg, p, m, etc.) |
| Theme tokens | ✅ | Native | CSS variables: `--card-padding`, `--chakra-radii-l3`, etc. |
| Color mode | ✅ | Native | Automatic light/dark theme support |
| Border control | ✅ | Native | "outline" variant provides bordered style |
| Background control | ✅ | Native | "filled" variant + `bg` style prop |
| Overflow handling | ✅ | Native | `overflow='hidden'` for image clipping |
| Custom properties | ✅ | Native | CSS variables like `--card-padding: var(--chakra-spacing-6)` |

## Composition Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Multi-part structure | ✅ | Composed | Header/Body/Footer as separate sub-components |
| Nested components | ✅ | Composed | Avatar, Image, Stack, Button all composable |
| Content projection | ✅ | Composed | Children passed to sections naturally |
| Flex layouts | ✅ | Native | Card uses `display: flex` by default |
| Responsive images | ✅ | Composed | Image with responsive `maxW` values |
| Button groups | ✅ | Composed | `<ButtonGroup>` for organized actions |

## Code Examples

### Basic Card (v2)
```jsx
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

<Card>
  <CardBody>
    <Text>View a summary of all your customers over the last month.</Text>
  </CardBody>
</Card>
```

### Card with All Sections (v2)
```jsx
<Card>
  <CardHeader>
    <Heading size='md'>Client Report</Heading>
  </CardHeader>
  <CardBody>
    <Stack divider={<StackDivider />} spacing='4'>
      <Box>
        <Heading size='xs' textTransform='uppercase'>Summary</Heading>
        <Text pt='2' fontSize='sm'>View summary of clients.</Text>
      </Box>
    </Stack>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Horizontal Layout with Image (v2)
```jsx
<Card
  direction={{ base: 'column', sm: 'row' }}
  overflow='hidden'
  variant='outline'
>
  <Image
    objectFit='cover'
    maxW={{ base: '100%', sm: '200px' }}
    src='...'
    alt='...'
  />
  <Stack>
    <CardBody>
      <Heading size='md'>Title</Heading>
      <Text>Description text</Text>
    </CardBody>
    <CardFooter>
      <Button>Action</Button>
    </CardFooter>
  </Stack>
</Card>
```

### Product Card with Image (v2)
```jsx
<Card maxW='sm'>
  <CardBody>
    <Image src='...' borderRadius='lg' />
    <Stack mt='6' spacing='3'>
      <Heading size='md'>Product Name</Heading>
      <Text>Product description here.</Text>
      <Text color='blue.600' fontSize='2xl'>$450</Text>
    </Stack>
  </CardBody>
  <Divider />
  <CardFooter>
    <ButtonGroup spacing='2'>
      <Button variant='solid' colorScheme='blue'>Buy now</Button>
      <Button variant='ghost' colorScheme='blue'>Add to cart</Button>
    </ButtonGroup>
  </CardFooter>
</Card>
```

### Social Media Card (v2)
```jsx
<Card maxW='md'>
  <CardHeader>
    <Flex spacing='4'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name='User' src='...' />
        <Box>
          <Heading size='sm'>Name</Heading>
          <Text>Role/Title</Text>
        </Box>
      </Flex>
      <IconButton
        variant='ghost'
        colorScheme='gray'
        icon={<BsThreeDotsVertical />}
      />
    </Flex>
  </CardHeader>
  <CardBody>
    <Text>Card content description.</Text>
  </CardBody>
  <Image src='...' />
  <CardFooter justify='space-between' flexWrap='wrap'>
    <Button flex='1' variant='ghost' leftIcon={<BiLike />}>Like</Button>
    <Button flex='1' variant='ghost' leftIcon={<BiChat />}>Comment</Button>
    <Button flex='1' variant='ghost' leftIcon={<BiShare />}>Share</Button>
  </CardFooter>
</Card>
```

### Card Grid Layout (v2)
```jsx
<SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
  <Card>
    <CardHeader>
      <Heading size='md'>Dashboard</Heading>
    </CardHeader>
    <CardBody>
      <Text>Summary content.</Text>
    </CardBody>
    <CardFooter>
      <Button>View</Button>
    </CardFooter>
  </Card>
  {/* Repeat as needed */}
</SimpleGrid>
```

### Centered Card (v2)
```jsx
<Card align='center'>
  <CardHeader>
    <Heading size='md'>Title</Heading>
  </CardHeader>
  <CardBody>
    <Text>Centered content</Text>
  </CardBody>
  <CardFooter>
    <Button colorScheme='blue'>Action</Button>
  </CardFooter>
</Card>
```

## Notable Features

### Multi-Part Component Architecture
- Card is structured as a multi-part component system with dedicated sub-components
- Each section (Header/Body/Footer) has its own styling and purpose
- Clean separation of concerns between structural sections

### Responsive Direction Control
- Native responsive layout switching via `direction` prop
- Object syntax for breakpoint-based changes: `direction={{ base: 'column', sm: 'row' }}`
- Enables mobile-first design patterns

### Variant System
Four distinct visual styles:
- **elevated**: Raised card with shadow (default)
- **outline**: Border-based design
- **filled**: Solid background
- **unstyled**: Blank canvas for custom styling

### Size Scale
Three size presets control padding/spacing:
- **sm**: Compact spacing
- **md**: Standard spacing (default)
- **lg**: Generous spacing

### Flexbox Foundation
- Built on flexbox with `display: flex` by default
- Native `align` and `justify` props for content positioning
- Natural integration with Stack and other layout components

### Theme Integration (v3)
- CSS custom properties for consistent theming: `--card-padding`, `--chakra-radii-l3`
- Border color uses semantic tokens: `var(--chakra-colors-border)`
- Background uses panel token: `bg-panel`
- Automatic color mode support

### Composition-First Design
- No "slots" - uses natural React composition
- Sub-components can be used independently or together
- Flexible content structure (can skip Header or Footer)
- Easy integration with other Chakra components (Avatar, Image, Button, etc.)

## Version Differences (v2 vs v3)

### v2 Features
- `colorScheme` prop for color variants
- More explicit examples with all props documented
- Multi-part style helpers for theme customization

### v3 Features
- Streamlined CSS variable system
- More consistent theming with design tokens
- Recipe-based theme configuration
- Modern CSS approach with layer-based architecture

Both versions maintain the same core API and component structure.

## Research Notes

### Documentation Strengths
- Excellent progression from simple to complex examples
- Real-world use cases (product cards, social media cards, client reports)
- Clear responsive patterns demonstrated
- Good coverage of composition with other components

### Implementation Approach
- Composition-heavy, not prop-heavy
- Relies on Chakra's style props system for customization
- Multi-part component pattern for flexibility
- No built-in interactive states (clickable, selected) - composition-based instead

### Philosophy
- Structural component, not a primitive
- Provides organization and consistent styling
- Flexibility through composition rather than props
- Integration with Chakra's broader component ecosystem
