# Chakra UI - Image Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://chakra-ui.com/docs/components/image
Status: ✅ Working (v2 documentation also available at https://v2.chakra-ui.com/docs/components/image)
Version: Current (v2 and v3)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - Chakra UI provides good documentation with examples, though v3 documentation is less detailed than v2. The component has stable APIs and good community support through GitHub discussions.

## Component Definition
- **Core purpose**: Display images with enhanced functionality including lazy loading, fallback handling, and responsive sizing. Extends the native HTML `<img>` element with Chakra's styling system.
- **Mental model**: An enhanced image element that automatically handles common concerns like loading states, errors, and responsive design. Prevents broken image icons through intelligent fallback mechanisms.
- **Semantic meaning**: Represents visual content in the interface with built-in performance optimization (lazy loading) and error resilience (fallbacks).

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `fallbackSrc="..."`)
- **Composed**: Via composition/wrapping (e.g., wrapping in `<Box>` for layout)
- **CSS-only**: Requires custom styling (e.g., filters, transforms)
- **Inherited**: From Box component (all style props)

## Image Loading Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Standard loading | ✅ | Native | Default HTML image loading with `src` prop |
| Lazy loading | ✅ | Native | Images load when visible in viewport, enabled by default |
| Fallback image | ✅ | Native | `fallbackSrc` prop for placeholder during load or on error |
| Custom fallback | ✅ | Native | `fallback` prop accepts custom React component instead of image |
| Disable fallback | ✅ | Native | `ignoreFallback` prop to opt out of fallback behavior |
| Loading callbacks | ✅ | Native | `onLoad` and `onError` event handlers |
| SSR optimization | ✅ | Native | `Img` component bypasses client-side checks for server rendering |

## Sizing & Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fixed dimensions | ✅ | Native | `htmlWidth` and `htmlHeight` set native image dimensions |
| Box sizing | ✅ | Inherited | `boxSize` prop for consistent dimensions (e.g., "sm", "100px") |
| Responsive sizing | ✅ | Inherited | All Box style props support responsive arrays/objects |
| Aspect ratio | ✅ | Native | `aspectRatio` prop controls aspect ratio (e.g., `{4/3}`) |
| Width/Height | ✅ | Inherited | Style props `width` and `height` from Box component |
| Max dimensions | ✅ | Inherited | `maxW`, `maxH` props for maximum size constraints |

## Display & Fit Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Object fit | ✅ | Native | `fit` prop controls object-fit: fill, contain, cover, none, scale-down |
| Object position | ✅ | Native | `align` prop controls object-position for alignment |
| Border radius | ✅ | Inherited | `borderRadius` prop: full (circular), xl, lg, md, sm, custom values |
| Rounded shorthand | ✅ | Inherited | `rounded` prop as shorthand for borderRadius (e.g., `rounded="md"`) |
| Filters | ✅ | Inherited | CSS `filter` prop for visual effects (blur, brightness, etc.) |
| Transformations | ✅ | Inherited | All CSS transform properties via style props |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Alt text | ✅ | Native | Required `alt` prop for screen readers and SEO |
| Cross-origin | ✅ | Native | `crossOrigin` prop for CORS configuration |
| Loading attribute | ✅ | Native | HTML `loading` attribute support (lazy/eager) |
| ARIA attributes | ✅ | Inherited | All ARIA props from Box component |
| Semantic HTML | ✅ | Native | Renders as native `<img>` element |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Next.js Image | ✅ | Composed | Via `@chakra-ui/next-js` package or `asChild` prop |
| Chakra factory | ✅ | Composed | `chakra(NextImage)` wrapper with `shouldForwardProp` |
| Caption support | ✅ | Composed | Wrap in Figure/Figcaption components |
| Clickable images | ✅ | Composed | Nest within Link component |
| Image gallery | ✅ | Composed | Combine with Stack, Grid, or Flex layouts |

## Code Examples

### Basic Usage
```jsx
import { Image } from '@chakra-ui/react'

<Image
  src='https://bit.ly/dan-abramov'
  alt='Dan Abramov'
/>
```

### Size Control
```jsx
import { Box, Image, Stack } from '@chakra-ui/react'

{/* Using boxSize prop */}
<Box boxSize='sm'>
  <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
</Box>

{/* Multiple sizes */}
<Stack direction='row' spacing={4}>
  <Image
    boxSize='100px'
    objectFit='cover'
    src='https://bit.ly/dan-abramov'
    alt='Dan Abramov'
  />
  <Image
    boxSize='150px'
    objectFit='cover'
    src='https://bit.ly/dan-abramov'
    alt='Dan Abramov'
  />
  <Image
    boxSize='200px'
    src='https://bit.ly/dan-abramov'
    alt='Dan Abramov'
  />
</Stack>
```

### Border Radius and Rounded Corners
```jsx
{/* Circular image */}
<Image
  borderRadius='full'
  boxSize='150px'
  src='https://bit.ly/dan-abramov'
  alt='Dan Abramov'
/>

{/* Using rounded shorthand (v3) */}
<Image
  rounded='md'
  src='https://i.pravatar.cc/300?img=4'
  alt='John Doe'
/>

{/* Custom border radius */}
<Image
  borderRadius='xl'
  src='https://bit.ly/dan-abramov'
  alt='Dan Abramov'
/>
```

### Fallback Handling
```jsx
{/* Fallback image source */}
<Image
  src='broken-image.png'
  fallbackSrc='https://via.placeholder.com/150'
  alt='Fallback example'
/>

{/* Custom fallback component */}
<Image
  src='broken-image.png'
  fallback={
    <Box bg='gray.100' width='200px' height='200px' display='flex' alignItems='center' justifyContent='center'>
      Image Failed to Load
    </Box>
  }
  alt='Custom fallback'
/>

{/* Disable fallback behavior */}
<Image
  src='image.png'
  ignoreFallback
  alt='No fallback'
/>
```

### Object Fit Options
```jsx
import { Stack, Image, Text, VStack } from '@chakra-ui/react'

<Stack spacing={4}>
  {/* Fill - stretches to container, may distort */}
  <VStack>
    <Image
      boxSize='200px'
      objectFit='fill'
      src='https://bit.ly/dan-abramov'
      alt='Fill example'
    />
    <Text>Fill</Text>
  </VStack>

  {/* Contain - maintains aspect ratio with letterboxing */}
  <VStack>
    <Image
      boxSize='200px'
      objectFit='contain'
      src='https://bit.ly/dan-abramov'
      alt='Contain example'
    />
    <Text>Contain</Text>
  </VStack>

  {/* Cover - maintains aspect ratio, fills container, may crop */}
  <VStack>
    <Image
      boxSize='200px'
      objectFit='cover'
      src='https://bit.ly/dan-abramov'
      alt='Cover example'
    />
    <Text>Cover</Text>
  </VStack>

  {/* None - uses original size */}
  <VStack>
    <Image
      boxSize='200px'
      objectFit='none'
      src='https://bit.ly/dan-abramov'
      alt='None example'
    />
    <Text>None</Text>
  </VStack>

  {/* Scale-down - smallest size between none/contain */}
  <VStack>
    <Image
      boxSize='200px'
      objectFit='scale-down'
      src='https://bit.ly/dan-abramov'
      alt='Scale-down example'
    />
    <Text>Scale-down</Text>
  </VStack>
</Stack>
```

### Using fit and align Props (v2)
```jsx
{/* fit prop controls object-fit */}
<Image
  boxSize='200px'
  fit='cover'
  src='https://bit.ly/dan-abramov'
  alt='Fit prop example'
/>

{/* align prop controls object-position */}
<Image
  boxSize='200px'
  fit='cover'
  align='top'
  src='https://bit.ly/dan-abramov'
  alt='Align prop example'
/>
```

### Aspect Ratio
```jsx
{/* Maintain 16:9 aspect ratio */}
<Image
  src='https://bit.ly/dan-abramov'
  alt='Aspect ratio example'
  aspectRatio={16/9}
  objectFit='cover'
/>

{/* Maintain 4:3 aspect ratio */}
<Image
  src='https://bit.ly/dan-abramov'
  alt='4:3 aspect ratio'
  aspectRatio={4/3}
  objectFit='cover'
/>

{/* Square aspect ratio */}
<Image
  src='https://bit.ly/dan-abramov'
  alt='Square'
  aspectRatio={1}
  objectFit='cover'
/>
```

### Native Dimensions
```jsx
{/* Setting native HTML width and height */}
<Image
  htmlWidth='300px'
  htmlHeight='200px'
  src='https://bit.ly/dan-abramov'
  alt='Native dimensions'
/>

{/* Responsive with max constraints */}
<Image
  src='https://bit.ly/dan-abramov'
  alt='Responsive image'
  width='100%'
  maxW='500px'
  height='auto'
/>
```

### Loading and Error Callbacks
```jsx
import { useState } from 'react'
import { Image, Spinner, Text } from '@chakra-ui/react'

function ImageWithCallbacks() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <>
      {loading && <Spinner />}
      {error && <Text color='red.500'>Failed to load image</Text>}
      <Image
        src='https://bit.ly/dan-abramov'
        alt='Callback example'
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false)
          setError(true)
        }}
        display={loading ? 'none' : 'block'}
      />
    </>
  )
}
```

### Lazy Loading
```jsx
{/* Lazy loading is enabled by default */}
<Image
  src='https://bit.ly/dan-abramov'
  alt='Lazy loaded image'
/>

{/* Explicitly set loading attribute */}
<Image
  src='https://bit.ly/dan-abramov'
  alt='Eager loading'
  loading='eager'
/>

{/* Note: There's a known issue with loading="lazy" and fallbackSrc */}
<Image
  src='https://bit.ly/dan-abramov'
  alt='Lazy with fallback'
  loading='lazy'
  fallbackSrc='https://via.placeholder.com/150'
/>
```

### SSR with Img Component
```jsx
import { Img } from '@chakra-ui/react'

{/* Use Img for server-side rendering (no fallback checks) */}
<Img
  src='https://bit.ly/dan-abramov'
  alt='SSR image'
/>
```

### Next.js Integration (Option 1: @chakra-ui/next-js)
```jsx
import { Image } from '@chakra-ui/next-js'
import NextImage from 'next/image'

{/* Modern approach with asChild prop */}
<Image asChild>
  <NextImage
    src='/dan-abramov.jpg'
    alt='Dan Abramov'
    width={300}
    height={300}
  />
</Image>
```

### Next.js Integration (Option 2: Chakra Factory)
```jsx
import { chakra } from '@chakra-ui/react'
import NextImage from 'next/image'

const ChakraNextImage = chakra(NextImage, {
  shouldForwardProp: (prop) =>
    ['width', 'height', 'src', 'alt', 'quality', 'placeholder', 'blurDataURL'].includes(prop),
})

<ChakraNextImage
  src='/dan-abramov.jpg'
  alt='Dan Abramov'
  width={300}
  height={300}
  borderRadius='lg'
  boxShadow='md'
/>
```

### Next.js Integration (Option 3: Box Wrapper)
```jsx
import { Box } from '@chakra-ui/react'
import NextImage from 'next/image'

<Box position='relative' width='300px' height='300px' borderRadius='lg' overflow='hidden'>
  <NextImage
    src='/dan-abramov.jpg'
    alt='Dan Abramov'
    layout='fill'
    objectFit='cover'
  />
</Box>
```

### Filters and Visual Effects
```jsx
import { Stack, Image } from '@chakra-ui/react'

<Stack spacing={4}>
  {/* Blur filter */}
  <Image
    src='https://bit.ly/dan-abramov'
    alt='Blurred'
    filter='blur(4px)'
  />

  {/* Grayscale */}
  <Image
    src='https://bit.ly/dan-abramov'
    alt='Grayscale'
    filter='grayscale(100%)'
  />

  {/* Brightness adjustment */}
  <Image
    src='https://bit.ly/dan-abramov'
    alt='Bright'
    filter='brightness(1.5)'
  />

  {/* Sepia tone */}
  <Image
    src='https://bit.ly/dan-abramov'
    alt='Sepia'
    filter='sepia(100%)'
  />

  {/* Combined filters */}
  <Image
    src='https://bit.ly/dan-abramov'
    alt='Combined filters'
    filter='contrast(1.2) saturate(1.3)'
  />
</Stack>
```

### Responsive Images
```jsx
{/* Responsive sizing with arrays */}
<Image
  src='https://bit.ly/dan-abramov'
  alt='Responsive'
  boxSize={['100px', '150px', '200px', '250px']}
  objectFit='cover'
/>

{/* Responsive with objects */}
<Image
  src='https://bit.ly/dan-abramov'
  alt='Responsive object'
  width={{ base: '100%', md: '50%', lg: '33%' }}
  height='auto'
/>
```

### With Captions
```jsx
import { Box, Image, Text } from '@chakra-ui/react'

{/* Using Box wrapper */}
<Box maxW='sm'>
  <Image
    src='https://bit.ly/dan-abramov'
    alt='Dan Abramov'
    borderRadius='md'
  />
  <Text mt={2} fontSize='sm' color='gray.600'>
    Dan Abramov speaking at a conference
  </Text>
</Box>

{/* Using semantic HTML figure/figcaption */}
<Box as='figure' maxW='sm'>
  <Image
    src='https://bit.ly/dan-abramov'
    alt='Dan Abramov'
    borderRadius='md'
  />
  <Box as='figcaption' mt={2} fontSize='sm' color='gray.600'>
    Dan Abramov speaking at a conference
  </Box>
</Box>
```

### Clickable Images
```jsx
import { Link, Image } from '@chakra-ui/react'

{/* Image as link */}
<Link href='https://example.com' isExternal>
  <Image
    src='https://bit.ly/dan-abramov'
    alt='Clickable image'
    borderRadius='md'
    _hover={{ opacity: 0.8, transform: 'scale(1.02)' }}
    transition='all 0.2s'
  />
</Link>
```

### Image Gallery
```jsx
import { Grid, Image } from '@chakra-ui/react'

<Grid templateColumns='repeat(3, 1fr)' gap={4}>
  <Image
    src='https://bit.ly/dan-abramov'
    alt='Image 1'
    objectFit='cover'
    aspectRatio={1}
  />
  <Image
    src='https://bit.ly/code-beast'
    alt='Image 2'
    objectFit='cover'
    aspectRatio={1}
  />
  <Image
    src='https://bit.ly/sage-adebayo'
    alt='Image 3'
    objectFit='cover'
    aspectRatio={1}
  />
  <Image
    src='https://bit.ly/prosper-baba'
    alt='Image 4'
    objectFit='cover'
    aspectRatio={1}
  />
  <Image
    src='https://bit.ly/ryan-florence'
    alt='Image 5'
    objectFit='cover'
    aspectRatio={1}
  />
  <Image
    src='https://bit.ly/kent-c-dodds'
    alt='Image 6'
    objectFit='cover'
    aspectRatio={1}
  />
</Grid>
```

### Cross-Origin Images
```jsx
{/* CORS configuration */}
<Image
  src='https://external-domain.com/image.jpg'
  alt='Cross-origin image'
  crossOrigin='anonymous'
/>

{/* With credentials */}
<Image
  src='https://external-domain.com/image.jpg'
  alt='Cross-origin with credentials'
  crossOrigin='use-credentials'
/>
```

### Dark Mode Support
```jsx
import { Image, useColorMode } from '@chakra-ui/react'

function DarkModeImage() {
  const { colorMode } = useColorMode()

  return (
    <Image
      src={colorMode === 'dark' ? '/image-dark.jpg' : '/image-light.jpg'}
      alt='Theme-aware image'
    />
  )
}

{/* Or use colorMode prop for filters */}
<Image
  src='https://bit.ly/dan-abramov'
  alt='Dark mode adjusted'
  filter={colorMode === 'dark' ? 'brightness(0.8)' : 'none'}
/>
```

## Props Reference

### Image-Specific Props
- **src**: `string` - Image source URL (required)
- **alt**: `string` - Alternative text for accessibility (required)
- **fallbackSrc**: `string` - Fallback image URL when loading or on error
- **fallback**: `ReactElement` - Custom fallback component instead of image
- **ignoreFallback**: `boolean` - Disable fallback behavior. Default: false
- **fit**: `ObjectFit` - Controls object-fit CSS property (v2). Values: fill, contain, cover, none, scale-down
- **align**: `ObjectPosition` - Controls object-position CSS property (v2)
- **htmlWidth**: `string | number` - Native image width attribute
- **htmlHeight**: `string | number` - Native image height attribute
- **onLoad**: `() => void` - Callback when image loads successfully
- **onError**: `() => void` - Callback when image fails to load
- **loading**: `"eager" | "lazy"` - HTML loading attribute (lazy by default)
- **crossOrigin**: `"anonymous" | "use-credentials"` - CORS configuration

### Inherited from Box (Style Props)
- **boxSize**: `ResponsiveValue<string | number>` - Width and height shorthand
- **width/w**: `ResponsiveValue<string | number>` - Width
- **height/h**: `ResponsiveValue<string | number>` - Height
- **maxW/maxWidth**: `ResponsiveValue<string | number>` - Maximum width
- **maxH/maxHeight**: `ResponsiveValue<string | number>` - Maximum height
- **objectFit**: `ObjectFit` - How image fits container (v3)
- **objectPosition**: `string` - Image position within container (v3)
- **aspectRatio**: `number` - Aspect ratio (e.g., 16/9, 4/3)
- **borderRadius**: `ResponsiveValue<string>` - Border radius (full, xl, lg, md, sm)
- **rounded**: `ResponsiveValue<string>` - Shorthand for borderRadius (v3)
- **filter**: `string` - CSS filter effects
- **transform**: `string` - CSS transforms
- **opacity**: `ResponsiveValue<number>` - Opacity value
- **All Box props**: Spacing (m, p), colors, shadows, borders, etc.

### Standard HTML img Attributes
The component supports all standard HTML img element attributes including `title`, `decoding`, `referrerPolicy`, `sizes`, `srcSet`, etc.

## Notable Features

### Automatic Lazy Loading
Images are lazy-loaded by default, meaning they only load when they enter the viewport. This significantly improves initial page load performance for image-heavy pages.

### Intelligent Fallback System
The fallback mechanism prevents broken image icons from appearing in the UI. It supports both fallback image URLs (`fallbackSrc`) and custom React components (`fallback`), providing flexibility for different error states.

### SSR Optimization
The `Img` component variant bypasses client-side loading checks, making it ideal for server-side rendering scenarios where fallback behavior isn't needed or desired.

### Box Component Inheritance
By composing the Box component, Image inherits all of Chakra's powerful style props system, including responsive arrays/objects, pseudo-selectors (`_hover`, `_focus`), and complete theming support.

### Aspect Ratio Preservation
The `aspectRatio` prop provides an elegant way to maintain image proportions across different screen sizes without manual calculation or wrapper elements.

### Next.js Compatibility
Multiple integration patterns with Next.js Image component allow developers to leverage Next.js image optimization while using Chakra's styling system. The `@chakra-ui/next-js` package provides the smoothest integration.

### Comprehensive Object-Fit Support
Full support for all CSS object-fit values (fill, contain, cover, none, scale-down) via both `objectFit` style prop (v3) and dedicated `fit` prop (v2), with `align` prop for positioning.

### Visual Effects System
Direct access to CSS filter and transform properties enables sophisticated visual effects without external libraries or custom CSS.

### Responsive Design First
All sizing and styling props support Chakra's responsive syntax with arrays (mobile-first) and objects (breakpoint-specific), enabling complex responsive layouts with minimal code.

### Callback Support
`onLoad` and `onError` callbacks enable custom loading states, analytics tracking, and error handling logic integrated directly into the component.

### CORS Handling
Built-in `crossOrigin` prop simplifies working with images from different domains, essential for canvas manipulation or credential-requiring resources.

## Research Notes

### Version Differences
- **v2** uses dedicated `fit` and `align` props for object-fit and object-position
- **v3** uses standard CSS props `objectFit` and `objectPosition` via Box inheritance
- **v2** documentation is more comprehensive than v3 at time of research
- **v3** introduces `rounded` as shorthand for `borderRadius`
- Both versions support the same core functionality

### Known Issues
- **Issue #7956**: Image component may not show fallback when `loading="lazy"` is explicitly set
- **Issue #2563**: `onLoad` callback may not always fire reliably in certain scenarios
- **Next.js Integration**: Width/height props conflict between Chakra (style props) and Next.js (required attributes)

### Documentation Coverage
The v2 documentation provides more detailed examples and prop descriptions. The v3 documentation is more concise and assumes familiarity with the component pattern. Community discussions on GitHub provide valuable real-world usage patterns not covered in official docs.

### CSS Architecture
Chakra UI Image implementation uses:
- Native `<img>` element for semantic HTML and accessibility
- CSS custom properties for theming integration
- Inline-flex or block display depending on context
- Zero-runtime CSS approach where possible
- Fallback handled via JavaScript loading state tracking

### Common Use Cases
1. **Profile avatars**: Circular images with `borderRadius="full"` and `objectFit="cover"`
2. **Product images**: Aspect ratio control with fallback for missing images
3. **Hero images**: Full-width responsive images with `objectFit="cover"`
4. **Galleries**: Grid layouts with consistent aspect ratios
5. **Thumbnails**: Fixed size with `boxSize` and `objectFit="cover"`
6. **Next.js apps**: Optimized images using `@chakra-ui/next-js` integration

### Best Practices
1. **Always provide alt text** for accessibility and SEO
2. **Use fallbackSrc** for production to handle loading failures gracefully
3. **Leverage aspectRatio** for consistent layouts across breakpoints
4. **Use Img component** in SSR contexts to avoid hydration issues
5. **Combine with Box** for complex layouts requiring specific positioning
6. **Use htmlWidth/htmlHeight** to prevent layout shift during loading
7. **Apply objectFit="cover"** with fixed dimensions for consistent image display

### Observations
Chakra UI's Image component successfully extends the native img element with thoughtful enhancements that address real-world development needs. The fallback system is particularly elegant, preventing the common UI problem of broken image icons. The component's inheritance from Box provides exceptional flexibility without complexity. The Next.js integration challenges highlight the tension between framework-specific optimization (Next.js Image) and design system consistency (Chakra styling), which the community has addressed with multiple viable patterns. Overall, this is a production-ready component that balances simplicity with powerful features.
