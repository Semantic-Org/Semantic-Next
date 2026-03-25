# Chakra UI - Header Component

## Status: No Dedicated Header Component

Chakra UI does not provide a dedicated `Header` component for building page headers.

## Recommended Approach

Instead, Chakra UI developers build headers using layout primitives:

- **Box**: Basic layout container for building headers
- **Flex**: For flexbox-based header layouts with alignment control
- **Container**: For constraining header width and centering content
- **Heading**: For header title text (semantic HTML heading elements)
- **HStack/VStack**: For arranging header content horizontally or vertically

## Typical Header Pattern

Headers in Chakra UI are typically constructed by composing these primitive components:

```jsx
import { Box, Flex, Heading, Container } from "@chakra-ui/react"

function Header() {
  return (
    <Box bg="white" py={4} boxShadow="sm">
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg">
            Logo
          </Heading>
          {/* Navigation content */}
        </Flex>
      </Container>
    </Box>
  )
}
```

## Key Components Used

| Component | Purpose |
|-----------|---------|
| `Box` | Basic container for header wrapper |
| `Flex` | Flexible layout for positioning header items |
| `Container` | Constrain header width and center content |
| `Heading` | Semantic heading for site/app title |
| `HStack` | Horizontal alignment of items |
| `Spacer` | Space between header items |

## Documentation

- Components Overview: https://chakra-ui.com/docs/components/concepts/overview
- Flex Component: https://chakra-ui.com/docs/components/flex
- Box Component: https://chakra-ui.com/docs/components/box
- Container Component: https://chakra-ui.com/docs/components/container

## Conclusion

Chakra UI follows a composition-based approach rather than providing pre-built specialized components like Header. This gives developers maximum flexibility to create headers that match their specific design needs.
