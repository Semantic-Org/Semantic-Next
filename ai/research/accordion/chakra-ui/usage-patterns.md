# Chakra UI - Accordion Component

## Component Overview

The Accordion component in Chakra UI is a vertically stacked set of interactive headings that each reveal a section of content. It allows users to expand and collapse sections of content, making it ideal for FAQs, documentation, feature lists, and any scenario where content organization and space efficiency are important. Chakra UI's Accordion is built following the W3C ARIA Authoring Practices guidelines and supports keyboard navigation, multiple content sections, and customizable expand/collapse behavior.

---

## Usage Patterns

### Basic Usage (v3)

The simplest accordion configuration with a single expandable item:

```jsx
import { Accordion } from "@chakra-ui/react"

function BasicAccordion() {
  return (
    <Accordion.Root>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <Span flex="1">Item 1</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            This is the content for item 1
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### Multiple Items

An accordion with multiple items where only one can be expanded at a time (default behavior):

```jsx
function MultipleItemsAccordion() {
  return (
    <Accordion.Root>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <Span flex="1">What is React?</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            React is a JavaScript library for building user interfaces with reusable components.
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.ItemTrigger>
          <Span flex="1">How do I learn React?</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            Start with the official React documentation and practice building small projects.
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-3">
        <Accordion.ItemTrigger>
          <Span flex="1">What is the future of React?</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            React continues to evolve with improved performance and new features like concurrent rendering.
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### Controlled Accordion

Using state to control which items are expanded:

```jsx
"use client"
import { useState } from "react"
import { Accordion } from "@chakra-ui/react"

function ControlledAccordion() {
  const [value, setValue] = useState(["item-1"])

  return (
    <Accordion.Root value={value} onValueChange={(e) => setValue(e.value)}>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <Span flex="1">Item 1</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Content 1</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.ItemTrigger>
          <Span flex="1">Item 2</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Content 2</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### Default Expanded Items

Specifying which items should be expanded by default:

```jsx
function DefaultExpandedAccordion() {
  return (
    <Accordion.Root defaultValue={["item-1", "item-3"]}>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <Span flex="1">Initially Expanded Item</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            This item is expanded by default
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.ItemTrigger>
          <Span flex="1">Collapsed Item</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>This item is collapsed by default</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-3">
        <Accordion.ItemTrigger>
          <Span flex="1">Also Initially Expanded</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            This item is also expanded by default
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

---

## Variants/Styles

### Size Variants

Chakra UI Accordion supports different sizes for better visual hierarchy:

```jsx
function SizeVariantsAccordion() {
  return (
    <>
      <Accordion.Root size="sm">
        <Accordion.Item value="item-1">
          <Accordion.ItemTrigger>
            <Span flex="1">Small Accordion</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Small size content</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>

      <Accordion.Root size="md">
        <Accordion.Item value="item-1">
          <Accordion.ItemTrigger>
            <Span flex="1">Medium Accordion (default)</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Medium size content</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>

      <Accordion.Root size="lg">
        <Accordion.Item value="item-1">
          <Accordion.ItemTrigger>
            <Span flex="1">Large Accordion</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Large size content</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </>
  )
}
```

### Visual Variants

Different visual styles for different use cases:

```jsx
function VariantAccordion() {
  return (
    <>
      {/* Elevated variant - appears raised with shadow */}
      <Accordion.Root variant="elevated">
        <Accordion.Item value="item-1">
          <Accordion.ItemTrigger>
            <Span flex="1">Elevated Style</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Elevated accordion content</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>

      {/* Outline variant - bordered appearance */}
      <Accordion.Root variant="outline">
        <Accordion.Item value="item-1">
          <Accordion.ItemTrigger>
            <Span flex="1">Outline Style</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Outline accordion content</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>

      {/* Unstyled variant - minimal styling */}
      <Accordion.Root variant="unstyled">
        <Accordion.Item value="item-1">
          <Accordion.ItemTrigger>
            <Span flex="1">Unstyled</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Unstyled accordion content</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </>
  )
}
```

---

## States

### Single Expansion (Default)

By default, only one accordion item can be expanded at a time:

```jsx
function SingleExpansion() {
  return (
    <Accordion.Root>
      {/* Only one item can be open at a time */}
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <Span flex="1">Item 1</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Opens item 1, closes item 2</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.ItemTrigger>
          <Span flex="1">Item 2</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Opens item 2, closes item 1</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### Multiple Expansion

Allow multiple items to be expanded simultaneously:

```jsx
function MultipleExpansion() {
  return (
    <Accordion.Root multiple>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <Span flex="1">Item 1</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Item 1 can stay open with item 2</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.ItemTrigger>
          <Span flex="1">Item 2</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Item 2 can stay open with item 1</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-3">
        <Accordion.ItemTrigger>
          <Span flex="1">Item 3</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>All items can be open simultaneously</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### Collapsible State

Allow an expanded item to be collapsed again:

```jsx
function CollapsibleAccordion() {
  return (
    <Accordion.Root collapsible>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <Span flex="1">Collapsible Item</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            Click the trigger again to collapse this item
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.ItemTrigger>
          <Span flex="1">Another Item</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Any expanded item can be collapsed</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### Disabled Items

Disable specific accordion items:

```jsx
function DisabledItemsAccordion() {
  return (
    <Accordion.Root>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <Span flex="1">Enabled Item</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>This item works normally</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-2" disabled>
        <Accordion.ItemTrigger>
          <Span flex="1">Disabled Item</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>This item cannot be opened</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-3">
        <Accordion.ItemTrigger>
          <Span flex="1">Another Enabled Item</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>This item also works</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

---

## Sizing Options

The Accordion supports three primary sizes:

- **`sm`** - Small size, compact padding and text
- **`md`** - Medium size (default), balanced spacing
- **`lg`** - Large size, more spacious padding

```jsx
function SizedAccordion() {
  return (
    <Stack>
      <Box>
        <Text fontWeight="bold" mb="2">Small</Text>
        <Accordion.Root size="sm">
          <Accordion.Item value="item-1">
            <Accordion.ItemTrigger>
              <Span flex="1">Small Item</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>Compact content</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Box>

      <Box>
        <Text fontWeight="bold" mb="2">Large</Text>
        <Accordion.Root size="lg">
          <Accordion.Item value="item-1">
            <Accordion.ItemTrigger>
              <Span flex="1">Large Item</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>Spacious content</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Box>
    </Stack>
  )
}
```

---

## Layout & Positioning

### Nested/Hierarchical Accordions

Create nested accordions for hierarchical information:

```jsx
function NestedAccordion() {
  return (
    <Accordion.Root>
      <Accordion.Item value="section-1">
        <Accordion.ItemTrigger>
          <Span flex="1">Section 1</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <Accordion.Root>
              <Accordion.Item value="subsection-1">
                <Accordion.ItemTrigger>
                  <Span flex="1">Subsection 1.1</Span>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>Nested content</Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>

              <Accordion.Item value="subsection-2">
                <Accordion.ItemTrigger>
                  <Span flex="1">Subsection 1.2</Span>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>More nested content</Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            </Accordion.Root>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="section-2">
        <Accordion.ItemTrigger>
          <Span flex="1">Section 2</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Section 2 content</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### Side-by-Side Layout

Multiple accordions in a grid layout:

```jsx
function SideBySideAccordions() {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <Box>
        <Heading mb="4">Category A</Heading>
        <Accordion.Root>
          <Accordion.Item value="a1">
            <Accordion.ItemTrigger>
              <Span flex="1">A - Item 1</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>Content A1</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Box>

      <Box>
        <Heading mb="4">Category B</Heading>
        <Accordion.Root>
          <Accordion.Item value="b1">
            <Accordion.ItemTrigger>
              <Span flex="1">B - Item 1</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>Content B1</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Box>
    </Grid>
  )
}
```

---

## Content & Structure

### Rich Content

Accordion with complex HTML and component content:

```jsx
function RichContentAccordion() {
  return (
    <Accordion.Root>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <Span flex="1">Product Features</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <VStack align="start" spacing={4}>
              <Text>Our product includes:</Text>
              <UnorderedList>
                <ListItem>Feature 1</ListItem>
                <ListItem>Feature 2</ListItem>
                <ListItem>Feature 3</ListItem>
              </UnorderedList>
              <Button colorScheme="blue">Learn More</Button>
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.ItemTrigger>
          <Span flex="1">Pricing Details</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Plan</Th>
                  <Th>Price</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Basic</Td>
                  <Td>$9/month</Td>
                </Tr>
                <Tr>
                  <Td>Pro</Td>
                  <Td>$29/month</Td>
                </Tr>
              </Tbody>
            </Table>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### Custom Trigger Content

More complex trigger designs:

```jsx
function CustomTriggerAccordion() {
  return (
    <Accordion.Root>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <HStack flex="1">
            <Icon as={InfoIcon} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">Item Title</Text>
              <Text fontSize="sm" color="gray.500">Subtitle here</Text>
            </VStack>
          </HStack>
          <Badge colorScheme="green">New</Badge>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Content with metadata</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

---

## Interactive Features

### Expand/Collapse Toggle

Control expansion programmatically:

```jsx
"use client"
import { useState } from "react"
import { Accordion, Button } from "@chakra-ui/react"

function ToggleAccordion() {
  const [value, setValue] = useState([])

  const expandAll = () => setValue(["item-1", "item-2", "item-3"])
  const collapseAll = () => setValue([])

  return (
    <>
      <HStack mb={4}>
        <Button onClick={expandAll}>Expand All</Button>
        <Button onClick={collapseAll}>Collapse All</Button>
      </HStack>

      <Accordion.Root value={value} onValueChange={(e) => setValue(e.value)} multiple>
        <Accordion.Item value="item-1">
          <Accordion.ItemTrigger>
            <Span flex="1">Item 1</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Content 1</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <Accordion.ItemTrigger>
            <Span flex="1">Item 2</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Content 2</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        <Accordion.Item value="item-3">
          <Accordion.ItemTrigger>
            <Span flex="1">Item 3</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Content 3</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </>
  )
}
```

### Dynamic Item Creation

Build accordion items dynamically from data:

```jsx
"use client"
import { Accordion } from "@chakra-ui/react"

function DynamicAccordion() {
  const items = [
    { id: "1", title: "FAQ 1", content: "Answer 1" },
    { id: "2", title: "FAQ 2", content: "Answer 2" },
    { id: "3", title: "FAQ 3", content: "Answer 3" },
  ]

  return (
    <Accordion.Root>
      {items.map((item) => (
        <Accordion.Item key={item.id} value={item.id}>
          <Accordion.ItemTrigger>
            <Span flex="1">{item.title}</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{item.content}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
```

### Change Event Handling

Respond to expansion/collapse changes:

```jsx
"use client"
import { useState } from "react"
import { Accordion } from "@chakra-ui/react"

function EventHandlingAccordion() {
  const [lastChanged, setLastChanged] = useState(null)

  return (
    <>
      <Text mb={4}>Last changed: {lastChanged || "None"}</Text>

      <Accordion.Root onValueChange={(e) => setLastChanged(JSON.stringify(e.value))}>
        <Accordion.Item value="item-1">
          <Accordion.ItemTrigger>
            <Span flex="1">Item 1</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Content 1</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <Accordion.ItemTrigger>
            <Span flex="1">Item 2</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Content 2</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </>
  )
}
```

---

## Animation & Transitions

### Default Animations

Chakra UI Accordion includes smooth height transitions by default:

```jsx
function AnimatedAccordion() {
  return (
    <Accordion.Root>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <Span flex="1">Item with smooth animation</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            Content expands and collapses with smooth height animation
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### Custom Indicator Animation

Style the indicator with rotation on expand:

```jsx
function CustomIndicatorAccordion() {
  return (
    <Accordion.Root>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger
          _expanded={{
            '& .accordion-indicator': {
              transform: 'rotate(180deg)',
            }
          }}
        >
          <Span flex="1">Item with rotating indicator</Span>
          <Accordion.ItemIndicator
            className="accordion-indicator"
            transition="transform 0.2s"
          />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Content with custom animation</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

---

## Integration Patterns

### With Forms

Accordion as part of a form workflow:

```jsx
"use client"
import { useState } from "react"
import { Accordion, FormControl, Input, FormLabel, Button } from "@chakra-ui/react"

function FormAccordion() {
  const [data, setData] = useState({
    personal: {},
    address: {},
    payment: {},
  })

  return (
    <Accordion.Root defaultValue={["personal"]}>
      <Accordion.Item value="personal">
        <Accordion.ItemTrigger>
          <Span flex="1">Personal Information</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input placeholder="Enter name" />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Enter email" />
              </FormControl>
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="address">
        <Accordion.ItemTrigger>
          <Span flex="1">Address</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Street</FormLabel>
                <Input placeholder="Enter street" />
              </FormControl>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Input placeholder="Enter city" />
              </FormControl>
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="payment">
        <Accordion.ItemTrigger>
          <Span flex="1">Payment Method</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Card Number</FormLabel>
                <Input placeholder="Enter card number" />
              </FormControl>
              <Button colorScheme="blue">Submit</Button>
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### With Tabs

Combining accordion with tabs for complex navigation:

```jsx
function AccordionWithTabs() {
  return (
    <Tabs>
      <TabList>
        <Tab>Documentation</Tab>
        <Tab>Examples</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Accordion.Root>
            <Accordion.Item value="guide">
              <Accordion.ItemTrigger>
                <Span flex="1">Getting Started Guide</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>Documentation content...</Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
        </TabPanel>

        <TabPanel>
          <Accordion.Root>
            <Accordion.Item value="example1">
              <Accordion.ItemTrigger>
                <Span flex="1">Example 1</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>Example code...</Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
```

---

## Accessibility Features

### Keyboard Navigation

The Accordion component supports comprehensive keyboard navigation:

| Key | Behavior |
|-----|----------|
| **Tab** | Move focus to the next accordion trigger |
| **Shift + Tab** | Move focus to the previous accordion trigger |
| **Enter / Space** | Toggle the expanded state of the focused accordion item |
| **ArrowDown** | Move focus to the next accordion trigger |
| **ArrowUp** | Move focus to the previous accordion trigger |
| **Home** | Move focus to the first accordion trigger |
| **End** | Move focus to the last accordion trigger |

### ARIA Attributes

Chakra UI automatically manages ARIA attributes:

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `role="region"` | Identifies the accordion as a region | Applied to AccordionPanel |
| `aria-expanded` | Indicates expanded/collapsed state | `true` or `false` |
| `aria-controls` | Associates trigger with content | Points to panel ID |
| `aria-disabled` | Indicates disabled state | `true` or `false` |
| `aria-labelledby` | Associates panel with trigger | Points to trigger ID |

### Screen Reader Support

```jsx
function AccessibleAccordion() {
  return (
    <Accordion.Root>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger id="trigger-1">
          <Span flex="1">About Our Company</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent aria-labelledby="trigger-1">
          <Accordion.ItemBody>
            We are a leading provider of web components and UI solutions.
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.ItemTrigger id="trigger-2">
          <Span flex="1">Contact Information</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent aria-labelledby="trigger-2">
          <Accordion.ItemBody>
            Email: info@example.com
            Phone: (555) 123-4567
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### Focus Management

Chakra UI manages focus automatically, but you can customize focus styles:

```jsx
function FocusableAccordion() {
  return (
    <Accordion.Root>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger
          _focus={{
            boxShadow: 'outline',
            bg: 'gray.100',
            outline: '2px solid blue',
            outlineOffset: '2px'
          }}
        >
          <Span flex="1">Focusable Item with Custom Styles</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Content for focused item</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

---

## Key Properties/Props

### Accordion.Root Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string[]` | - | The controlled value of the expanded accordion items |
| `defaultValue` | `string[]` | `[]` | The initially expanded items (uncontrolled) |
| `onValueChange` | `(details: { value: string[] }) => void` | - | Callback invoked when items are expanded/collapsed |
| `multiple` | `boolean` | `false` | If true, multiple accordion items can be expanded simultaneously |
| `collapsible` | `boolean` | `false` | If true, any expanded accordion item can be collapsed again |
| `disabled` | `boolean` | `false` | If true, all accordion items are disabled |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The size of the accordion |
| `variant` | `'elevated' \| 'outline' \| 'unstyled'` | `'elevated'` | The visual style of the accordion |
| `id` | `string` | - | The id of the accordion element |

### Accordion.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | **Required.** Unique identifier for the accordion item |
| `disabled` | `boolean` | `false` | If true, this accordion item cannot be expanded |
| `id` | `string` | - | Custom id for the accordion item |

### Accordion.ItemTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI box props | - | - | Inherits all styling props from Box component |

### Accordion.ItemContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI box props | - | - | Inherits all styling props from Box component |

### Accordion.ItemBody Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI box props | - | - | Inherits all styling props from Box component |

### Accordion.ItemIndicator Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI box props | - | - | Inherits all styling props from Box component |

---

## Code Examples

### Example 1: Basic FAQ Accordion

```jsx
import { Accordion, Box, Heading } from "@chakra-ui/react"

function FAQAccordion() {
  const faqs = [
    { title: "What is Chakra UI?", answer: "Chakra UI is a popular React component library for building accessible and customizable user interfaces." },
    { title: "Is it free?", answer: "Yes, Chakra UI is completely free and open-source." },
    { title: "Does it support TypeScript?", answer: "Yes, Chakra UI has full TypeScript support with excellent type definitions." }
  ]

  return (
    <Box p={8}>
      <Heading mb={6}>Frequently Asked Questions</Heading>
      <Accordion.Root>
        {faqs.map((faq, index) => (
          <Accordion.Item key={index} value={`faq-${index}`}>
            <Accordion.ItemTrigger>
              <Span flex="1">{faq.title}</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>{faq.answer}</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Box>
  )
}
```

### Example 2: Settings Panel with Multiple Sections

```jsx
"use client"
import { useState } from "react"
import { Accordion, VStack, Switch, FormControl, FormLabel, Select } from "@chakra-ui/react"

function SettingsAccordion() {
  const [theme, setTheme] = useState("light")
  const [notifications, setNotifications] = useState(true)

  return (
    <Accordion.Root multiple defaultValue={["appearance", "privacy"]}>
      <Accordion.Item value="appearance">
        <Accordion.ItemTrigger>
          <Span flex="1">Appearance</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <VStack align="start" spacing={4}>
              <FormControl>
                <FormLabel>Theme</FormLabel>
                <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </Select>
              </FormControl>
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="notifications">
        <Accordion.ItemTrigger>
          <Span flex="1">Notifications</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <VStack align="start" spacing={4}>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Enable notifications</FormLabel>
                <Switch isChecked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
              </FormControl>
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="privacy">
        <Accordion.ItemTrigger>
          <Span flex="1">Privacy & Security</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <VStack align="start" spacing={4}>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Share analytics data</FormLabel>
                <Switch defaultChecked />
              </FormControl>
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

### Example 3: Product Documentation Accordion

```jsx
import { Accordion, Box, Code, VStack, Text, UnorderedList, ListItem } from "@chakra-ui/react"

function DocumentationAccordion() {
  return (
    <Accordion.Root variant="outline" size="lg">
      <Accordion.Item value="installation">
        <Accordion.ItemTrigger>
          <Span flex="1">Installation</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <VStack align="start" spacing={3}>
              <Text>Install using npm:</Text>
              <Code p={3} bg="gray.100" borderRadius="md">
                npm install @chakra-ui/react @emotion/react
              </Code>
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="setup">
        <Accordion.ItemTrigger>
          <Span flex="1">Basic Setup</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <VStack align="start" spacing={3}>
              <Text>Setup steps:</Text>
              <UnorderedList>
                <ListItem>Import ChakraProvider</ListItem>
                <ListItem>Wrap your app with the provider</ListItem>
                <ListItem>Start using components</ListItem>
              </UnorderedList>
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="usage">
        <Accordion.ItemTrigger>
          <Span flex="1">Usage Examples</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <VStack align="start" spacing={3}>
              <Text>Common usage patterns are documented in our guide.</Text>
              <Code p={3} bg="gray.100" borderRadius="md">
                {'<Button colorScheme="blue">Click me</Button>'}
              </Code>
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

---

## Accessibility Notes

1. **Keyboard Navigation**: All accordion items are fully navigable using keyboard (Tab, Arrow keys, Enter/Space)
2. **ARIA Support**: Automatic ARIA attributes (`aria-expanded`, `aria-controls`, `aria-labelledby`) are applied
3. **Focus Indicators**: Visual focus indicators are automatically provided and customizable
4. **Screen Reader Compatibility**: Content structure and state changes are properly announced
5. **Color Contrast**: Ensure sufficient color contrast between trigger and background, especially for expanded state indicators
6. **Labels**: Always provide clear, descriptive labels for accordion triggers
7. **Disabled State**: Disabled items are properly communicated to assistive technology

---

## Common Patterns

### FAQ/Help Documentation
Displaying frequently asked questions in an organized, space-efficient manner

### Settings/Configuration Panels
Grouping related settings into collapsible sections

### Product/Feature Showcase
Organizing product features or features by category

### Multi-Step Forms
Breaking complex forms into logical, expandable sections

### Nested Content Navigation
Creating hierarchical navigation structures with nested accordions

### Comparison Tables
Organizing comparison data in expandable rows

### Pricing Tiers
Displaying different pricing options with expandable feature lists

### Technical Documentation
Organizing API documentation, parameters, and code examples

---

## Related Components

- **Tabs** - Alternative for sequential, single-view content organization
- **Collapse** - Lower-level collapse component for custom expansion behavior
- **Menu** - For dropdown navigation and actions
- **Drawer** - For side panel information display
- **Modal** - For focused, interrupting information displays
- **Card** - For organizing related content blocks
- **Stack** - For basic layout and spacing management

---

Research completed: 2025-11-05
Component: Accordion
Framework: Chakra UI (v3)
Documentation: https://chakra-ui.com/docs/components/accordion
