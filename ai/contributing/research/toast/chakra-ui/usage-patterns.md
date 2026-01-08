# Chakra UI - Toast/Toaster Usage Patterns

## Component URLs
- **v3**: https://chakra-ui.com/docs/components/toast
- **v2**: https://v2.chakra-ui.com/docs/components/toast
- **Ark UI Foundation**: https://ark-ui.com/docs/components/toast
- **Status**: ✅ All versions accessible

## Documentation Quality
Excellent - Comprehensive documentation across all versions. v2 has extensive hook-based API documentation. v3 uses a code snippet pattern built on Ark UI with detailed migration guides. Both versions include code examples, API references, and theming documentation.

## Component Definition
- **Core purpose**: Displays temporary, time-limited notifications to users. Provides feedback for actions, processes, or system states through non-blocking overlay messages.
- **Mental model**: A programmatically-triggered notification system with automatic positioning, stacking, and lifecycle management. Toasts appear temporarily, can be dismissed manually or automatically, and support various status types and customization.
- **Semantic meaning**: Communicates transient feedback (success, error, warning, info, loading) through positioned overlays that don't interrupt user workflow. Distinguished from inline alerts by their temporary, overlay nature.

## Version Differences

### v2 vs v3 Architecture

**v2 Structure (Hook-Based)**:
```jsx
import { useToast } from '@chakra-ui/react'

function Component() {
  const toast = useToast()

  return (
    <Button onClick={() => toast({
      title: 'Success',
      description: 'Your changes have been saved.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })}>
      Show Toast
    </Button>
  )
}
```

**v3 Structure (Code Snippet Pattern)**:
```jsx
import { Toaster, toaster } from '~/components/ui/toaster'

function App() {
  return (
    <>
      <Button onClick={() => toaster.create({
        title: 'Success',
        description: 'Your changes have been saved.',
        type: 'success',
      })}>
        Show Toast
      </Button>
      <Toaster />
    </>
  )
}
```

**Key Changes**:
- **API paradigm**: v2 uses `useToast()` hook → v3 uses imported `toaster` object with `Toaster` component
- **Installation**: v2 built-in → v3 code snippet via CLI (`npx @chakra-ui/cli snippet add`)
- **Configuration**: v2 hook options → v3 `createToaster()` function in snippet
- **Status vs Type**: v2 `status` prop → v3 `type` prop
- **Component requirement**: v2 auto-managed → v3 requires explicit `<Toaster />` placement
- **Foundation**: v2 custom implementation → v3 built on Ark UI
- **Customization**: v2 theme overrides → v3 edit snippet file directly
- **Multi-part anatomy**: v3 introduces Toast.Root, Toast.Title, Toast.Description, Toast.ActionTrigger, Toast.CloseTrigger
- **Variants**: v2 has 4 visual variants (subtle, solid, left-accent, top-accent) → v3 focused on type-based styling

## Display Patterns

### Toast Anatomy (v3)

**Parts**:
- **Toast.Root** - Main container (`data-part="root"`)
- **Toast.Title** - Heading text
- **Toast.Description** - Body content
- **Toast.ActionTrigger** - Optional action button
- **Toast.CloseTrigger** - Dismiss button

**Data Attributes**:
- `[data-scope='toast']` - Component scope identifier
- `[data-part]` - Component part (root, title, description, etc.)
- `[data-type]` - Toast type (success, error, warning, info, loading)
- `[data-state]` - Toast state (open, closed)

### Positioning & Layout

| Pattern | Present | Details |
|---------|---------|---------|
| Position control | ✅ | v2: 6 positions (top, top-right, top-left, bottom, bottom-right, bottom-left)<br>v3: 6 positions (top-start, top-center, top-end, bottom-start, bottom-center, bottom-end) |
| Stacking behavior | ✅ | Automatic toast stacking with configurable gaps |
| Maximum visible toasts | ✅ | v3: `max` prop in createToaster limits concurrent toasts, queues extras |
| Overlap mode | ✅ | v3: `overlap` boolean controls stacking vs. separate positioning |
| Custom container styles | ✅ | v2: `containerStyle` prop for wrapper styling |
| Offset from edges | ✅ | v3: Configurable offsets in createToaster |
| Responsive positioning | ⚠️ | Recommended: Full-width on mobile (≤640px) |

### Layout Variables (v3)
Runtime CSS variables available for styling:
- `--x`, `--y` - Position coordinates
- `--scale` - Scale transformation
- `--opacity` - Opacity value
- `--z-index` - Stacking order
- `--height` - Toast height
- `--gap` - Gap between toasts

## Content Patterns

| Pattern | Present | Details |
|---------|---------|---------|
| Title content | ✅ | v2: `title` prop (ReactNode)<br>v3: Toast.Title component or `title` in create options |
| Description content | ✅ | v2: `description` prop (ReactNode)<br>v3: Toast.Description component or `description` in create options |
| Custom icon | ✅ | v2: `icon` prop for custom ReactNode icon |
| Status/Type icons | ✅ | Automatic icons based on status/type (success ✓, error ×, warning ⚠, info ℹ) |
| Action buttons | ✅ | v3: Toast.ActionTrigger component with action.label and action.onClick |
| Close button | ✅ | v2: `isClosable` boolean<br>v3: Toast.CloseTrigger component |
| Custom render function | ✅ | v2: `render` prop accepts custom component function |
| Loading spinner | ✅ | v2: `status="loading"`<br>v3: `type="loading"` |
| Multi-line content | ✅ | ReactNode support allows complex JSX in all content areas |

## Behavior Patterns

### Lifecycle Management

| Pattern | Present | Details |
|---------|---------|---------|
| Auto-dismiss | ✅ | v2: `duration` prop (default 5000ms, null = never)<br>v3: `duration` option (Infinity keeps visible) |
| Manual dismiss | ✅ | v2: `toast.close(id)`, `toast.closeAll()`<br>v3: `toaster.dismiss(id)` |
| Pause on hover | ✅ | v3: Built-in pause on interaction |
| Update existing toast | ✅ | v2: `toast.update(id, options)`<br>v3: `toaster.update(id, options)` |
| Check if active | ✅ | v2: `toast.isActive(id)` for duplicate prevention |
| Callbacks | ✅ | v2: `onClose`, `onCloseComplete` callbacks |
| Return ID | ✅ | Both versions return unique ID for programmatic control |

### Creation Methods

**v2 Methods**:
- `toast(options)` - Create standard toast
- `toast.promise(promise, options)` - Promise-based toast with loading/success/error states
- `toast.close(id)` - Close specific toast
- `toast.closeAll()` - Close all toasts
- `toast.update(id, options)` - Update existing toast
- `toast.isActive(id)` - Check if toast with ID exists

**v3 Methods**:
- `toaster.create(options)` - Create standard toast
- `toaster.success(options)` - Create success toast
- `toaster.error(options)` - Create error toast
- `toaster.warning(options)` - Create warning toast
- `toaster.info(options)` - Create info toast
- `toaster.promise(promiseFn, options)` - Promise-based with auto state handling
- `toaster.update(id, options)` - Update existing toast
- `toaster.dismiss(id)` - Dismiss specific toast
- `toaster.pause(id)` - Pause auto-dismiss timer
- `toaster.resume(id)` - Resume auto-dismiss timer

### State Management

| Pattern | Present | Details |
|---------|---------|---------|
| Programmatic control | ✅ | Imperative API via hook (v2) or toaster object (v3) |
| Promise integration | ✅ | Automatic loading/success/error state transitions |
| Queue management | ✅ | v3: Automatic queuing when max toasts exceeded |
| Duplicate prevention | ✅ | v2: Manual via `toast.isActive(id)` check |
| Global state | ✅ | Centralized toast management across application |

## Type/Status Variants

### Status Types

**v2 Status Values**:
| Status | Icon | Default Color | Purpose |
|--------|------|---------------|---------|
| success | Checkmark (✓) | Green | Success confirmations |
| error | Error icon (×) | Red | Error messages |
| warning | Warning icon (⚠) | Orange | Warnings and cautions |
| info | Info icon (ℹ) | Blue | Informational messages |
| loading | Spinner | Blue | Loading/processing states |

**v3 Type Values**:
| Type | Icon | Purpose |
|------|------|---------|
| success | Checkmark (✓) | Success confirmations |
| error | Error icon (×) | Error messages |
| warning | Warning icon (⚠) | Warnings and cautions |
| info | Info icon (ℹ) | Informational messages |
| loading | Spinner | Loading/processing states |

### Visual Variants (v2 Only)

| Variant | Description |
|---------|-------------|
| subtle | Soft background with colored text (default) |
| solid | Colored background with white text |
| left-accent | Subtle with left border accent |
| top-accent | Subtle with top border accent |

*Note: v3 focuses on type-based styling rather than separate visual variants. Customization achieved through editing the snippet file.*

### Position Options

**v2 Positions**:
- `top`, `top-right`, `top-left`
- `bottom` (default), `bottom-right`, `bottom-left`

**v3 Placements**:
- `top-start`, `top-center`, `top-end`
- `bottom-start`, `bottom-center`, `bottom-end` (bottom-end common default)

## Code Examples

### Basic Toast (v2)

```jsx
import { useToast, Button } from '@chakra-ui/react'

function BasicToastExample() {
  const toast = useToast()

  return (
    <Button onClick={() => toast({
      title: 'Account created.',
      description: "We've created your account for you.",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })}>
      Show Toast
    </Button>
  )
}
```

### Basic Toast (v3)

```jsx
import { Button } from '@chakra-ui/react'
import { toaster } from '~/components/ui/toaster'

function BasicToastExample() {
  return (
    <Button onClick={() => toaster.create({
      title: 'Account created.',
      description: "We've created your account for you.",
      type: 'success',
    })}>
      Show Toast
    </Button>
  )
}

// Don't forget to render <Toaster /> in your app root
```

### Status/Type Examples (v2)

```jsx
import { useToast, Button, Wrap, WrapItem } from '@chakra-ui/react'

function StatusExamples() {
  const toast = useToast()
  const statuses = ['success', 'error', 'warning', 'info', 'loading']

  return (
    <Wrap>
      {statuses.map((status, i) => (
        <WrapItem key={i}>
          <Button onClick={() => toast({
            title: `${status} toast`,
            status: status,
            isClosable: true,
          })}>
            Show {status}
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  )
}
```

### Type Examples (v3)

```jsx
import { Button, Stack } from '@chakra-ui/react'
import { toaster } from '~/components/ui/toaster'

function TypeExamples() {
  return (
    <Stack>
      <Button onClick={() => toaster.success({
        title: 'Success!',
        description: 'Your changes have been saved.',
      })}>
        Success Toast
      </Button>

      <Button onClick={() => toaster.error({
        title: 'Error',
        description: 'Something went wrong.',
      })}>
        Error Toast
      </Button>

      <Button onClick={() => toaster.warning({
        title: 'Warning',
        description: 'Please review your input.',
      })}>
        Warning Toast
      </Button>

      <Button onClick={() => toaster.info({
        title: 'Information',
        description: 'Here is some useful info.',
      })}>
        Info Toast
      </Button>
    </Stack>
  )
}
```

### Position Examples (v2)

```jsx
import { useToast, Button, Wrap, WrapItem } from '@chakra-ui/react'

function PositionExample() {
  const toast = useToast()
  const positions = [
    'top',
    'top-right',
    'top-left',
    'bottom',
    'bottom-right',
    'bottom-left'
  ]

  return (
    <Wrap>
      {positions.map((position, i) => (
        <WrapItem key={i}>
          <Button onClick={() => toast({
            title: `${position} toast`,
            position: position,
            isClosable: true,
          })}>
            {position}
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  )
}
```

### Placement Configuration (v3)

```jsx
// In your components/ui/toaster.tsx snippet file
import { createToaster } from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'bottom-end',  // Default placement for all toasts
  overlap: true,
  gap: 24,
})

// In your component - override per-toast
function Component() {
  return (
    <Button onClick={() => toaster.create({
      title: 'Top center toast',
      placement: 'top-center',  // Override default
    })}>
      Show at Top
    </Button>
  )
}
```

### Visual Variants (v2 Only)

```jsx
import { useToast, Button, Wrap, WrapItem } from '@chakra-ui/react'

function VariantExample() {
  const toast = useToast()
  const variants = ['solid', 'subtle', 'left-accent', 'top-accent']

  return (
    <Wrap>
      {variants.map((variant, i) => (
        <WrapItem key={i}>
          <Button onClick={() => toast({
            title: `${variant} toast`,
            variant: variant,
            status: 'success',
            isClosable: true,
          })}>
            {variant}
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  )
}
```

### Promise-Based Toast (v2)

```jsx
import { useToast, Button } from '@chakra-ui/react'

function PromiseToastExample() {
  const toast = useToast()

  return (
    <Button onClick={() => {
      const uploadPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.5 ? resolve(200) : reject('Upload failed')
        }, 3000)
      })

      toast.promise(uploadPromise, {
        loading: {
          title: 'Uploading...',
          description: 'Please wait'
        },
        success: {
          title: 'Upload complete',
          description: 'File uploaded successfully'
        },
        error: {
          title: 'Upload failed',
          description: 'Please try again'
        },
      })
    }}>
      Upload File
    </Button>
  )
}
```

### Promise-Based Toast (v3)

```jsx
import { Button } from '@chakra-ui/react'
import { toaster } from '~/components/ui/toaster'

function PromiseToastExample() {
  const handleUpload = async () => {
    const uploadFile = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      return { fileName: 'document.pdf' }
    }

    toaster.promise(uploadFile(), {
      loading: {
        title: 'Uploading...',
        description: 'Please wait'
      },
      success: (data) => ({
        title: 'Upload complete',
        description: `${data.fileName} uploaded successfully`
      }),
      error: {
        title: 'Upload failed',
        description: 'Please try again'
      },
    })
  }

  return <Button onClick={handleUpload}>Upload File</Button>
}
```

### Updating Toast (v2)

```jsx
import { useToast, Button, Stack } from '@chakra-ui/react'
import { useRef } from 'react'

function UpdatingToastExample() {
  const toast = useToast()
  const toastIdRef = useRef()

  function addToast() {
    toastIdRef.current = toast({
      description: 'Processing...',
      status: 'loading',
      duration: null,
    })
  }

  function update() {
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, {
        description: 'Complete!',
        status: 'success',
        duration: 5000,
      })
    }
  }

  return (
    <Stack direction="row" spacing={2}>
      <Button onClick={addToast}>Start Process</Button>
      <Button onClick={update}>Complete</Button>
    </Stack>
  )
}
```

### Updating Toast (v3)

```jsx
import { Button, Stack } from '@chakra-ui/react'
import { toaster } from '~/components/ui/toaster'
import { useState } from 'react'

function UpdatingToastExample() {
  const [toastId, setToastId] = useState(null)

  const startProcess = () => {
    const id = toaster.create({
      title: 'Processing...',
      type: 'loading',
      duration: Infinity,
    })
    setToastId(id)
  }

  const completeProcess = () => {
    if (toastId) {
      toaster.update(toastId, {
        title: 'Complete!',
        type: 'success',
        duration: 5000,
      })
    }
  }

  return (
    <Stack direction="row" spacing={2}>
      <Button onClick={startProcess}>Start Process</Button>
      <Button onClick={completeProcess}>Complete</Button>
    </Stack>
  )
}
```

### Closing Toasts (v2)

```jsx
import { useToast, Button, Wrap, WrapItem } from '@chakra-ui/react'
import { useRef } from 'react'

function ClosingToastExample() {
  const toast = useToast()
  const toastIdRef = useRef()

  function addToast() {
    toastIdRef.current = toast({
      description: 'This toast can be closed programmatically',
      duration: null,
    })
  }

  function closeOne() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current)
    }
  }

  function closeAll() {
    toast.closeAll()
  }

  return (
    <Wrap>
      <WrapItem><Button onClick={addToast}>Add Toast</Button></WrapItem>
      <WrapItem><Button onClick={closeOne}>Close Last</Button></WrapItem>
      <WrapItem><Button onClick={closeAll}>Close All</Button></WrapItem>
    </Wrap>
  )
}
```

### Dismissing Toasts (v3)

```jsx
import { Button, Stack } from '@chakra-ui/react'
import { toaster } from '~/components/ui/toaster'
import { useState } from 'react'

function DismissExample() {
  const [lastId, setLastId] = useState(null)

  const addToast = () => {
    const id = toaster.create({
      title: 'Dismissible toast',
      description: 'This can be dismissed programmatically',
    })
    setLastId(id)
  }

  return (
    <Stack direction="row">
      <Button onClick={addToast}>Add Toast</Button>
      <Button onClick={() => toaster.dismiss(lastId)}>Dismiss Last</Button>
      <Button onClick={() => toaster.dismiss()}>Dismiss All</Button>
    </Stack>
  )
}
```

### Prevent Duplicate Toasts (v2)

```jsx
import { useToast, Button } from '@chakra-ui/react'

function PreventDuplicateExample() {
  const toast = useToast()
  const id = 'unique-toast-id'

  return (
    <Button onClick={() => {
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Only one instance allowed',
          description: 'Try clicking multiple times!',
        })
      }
    }}>
      Show Unique Toast
    </Button>
  )
}
```

### Custom Render Function (v2)

```jsx
import { useToast, Button, Box } from '@chakra-ui/react'

function CustomRenderExample() {
  const toast = useToast()

  return (
    <Button onClick={() => toast({
      position: 'bottom-left',
      render: () => (
        <Box
          color='white'
          p={3}
          bg='blue.500'
          borderRadius='md'
          boxShadow='lg'
        >
          <Box fontWeight='bold'>Custom Toast</Box>
          <Box fontSize='sm'>Completely custom rendering</Box>
        </Box>
      ),
    })}>
      Custom Toast
    </Button>
  )
}
```

### Custom Action Button (v3)

```jsx
// In your custom Toast component render
import { Toast } from '@chakra-ui/react'

function CustomToast() {
  return (
    <Toast.Root>
      <Toast.Title>File uploaded</Toast.Title>
      <Toast.Description>Your file has been uploaded successfully</Toast.Description>
      <Toast.ActionTrigger asChild>
        <Button variant="outline" size="sm">
          View File
        </Button>
      </Toast.ActionTrigger>
      <Toast.CloseTrigger />
    </Toast.Root>
  )
}

// Usage with action in options
toaster.create({
  title: 'Update available',
  action: {
    label: 'Update now',
    onClick: () => console.log('Updating...')
  }
})
```

### Custom Container Styles (v2)

```jsx
import { useToast, Button } from '@chakra-ui/react'

function CustomContainerExample() {
  const toast = useToast()

  return (
    <Button onClick={() => toast({
      title: 'Custom styled container',
      containerStyle: {
        width: '800px',
        maxWidth: '100%',
        border: '2px solid',
        borderColor: 'blue.500',
        borderRadius: 'lg',
      },
    })}>
      Custom Container
    </Button>
  )
}
```

### Global Configuration (v2)

```jsx
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider
      toastOptions={{
        defaultOptions: {
          position: 'top',
          duration: 3000,
          isClosable: true,
          variant: 'subtle',
        },
        motionVariants: {
          // Custom Framer Motion variants
        },
        toastSpacing: '0.5rem',
      }}
    >
      <YourApp />
    </ChakraProvider>
  )
}
```

### Global Configuration (v3)

```jsx
// In your components/ui/toaster.tsx snippet file
import { createToaster } from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'top-center',  // Default placement
  overlap: true,            // Allow overlapping toasts
  gap: 16,                  // Spacing between toasts (px)
  max: 5,                   // Maximum visible toasts
  duration: 5000,           // Default duration (ms)
  pauseOnInteraction: true, // Pause on hover/focus
})

export { Toaster } from '@chakra-ui/react'
```

### Standalone Toast Usage (v2)

```jsx
import * as ReactDOM from 'react-dom/client'
import { createStandaloneToast } from '@chakra-ui/react'

const { ToastContainer, toast } = createStandaloneToast()

// Use outside React components
toast({
  title: 'Error occurred',
  description: 'Unable to create user account.',
  status: 'error',
  duration: 9000,
  isClosable: true,
})

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <>
    <App />
    <ToastContainer />
  </>,
)
```

### Pause and Resume (v3)

```jsx
import { Button, Stack } from '@chakra-ui/react'
import { toaster } from '~/components/ui/toaster'
import { useState } from 'react'

function PauseResumeExample() {
  const [toastId, setToastId] = useState(null)

  const createLongToast = () => {
    const id = toaster.create({
      title: 'Long duration toast',
      description: 'This toast can be paused and resumed',
      duration: 10000,
    })
    setToastId(id)
  }

  return (
    <Stack direction="row">
      <Button onClick={createLongToast}>Create Toast</Button>
      <Button onClick={() => toaster.pause(toastId)}>Pause</Button>
      <Button onClick={() => toaster.resume(toastId)}>Resume</Button>
    </Stack>
  )
}
```

### React Effect Usage (v3)

```jsx
import { useEffect } from 'react'
import { toaster } from '~/components/ui/toaster'

function EffectExample() {
  useEffect(() => {
    // Wrap in queueMicrotask to prevent concurrency warnings
    queueMicrotask(() => {
      toaster.create({
        title: 'Component mounted',
        description: 'Toast triggered from useEffect',
      })
    })
  }, [])

  return <div>Component content</div>
}
```

## API Reference

### v2 API

**useToast Hook**
Returns toast object with methods:

| Method | Signature | Description |
|--------|-----------|-------------|
| toast() | `(options: UseToastOptions) => ToastId` | Create and show toast |
| toast.promise() | `(promise: Promise, options: PromiseOptions) => ToastId` | Promise-based toast |
| toast.close() | `(id: ToastId) => void` | Close specific toast |
| toast.closeAll() | `(options?: CloseAllOptions) => void` | Close all toasts |
| toast.update() | `(id: ToastId, options: UseToastOptions) => void` | Update existing toast |
| toast.isActive() | `(id: ToastId) => boolean` | Check if toast exists |

**UseToastOptions**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | ReactNode | - | Toast heading |
| description | ReactNode | - | Toast body text |
| status | "info" \| "warning" \| "success" \| "error" \| "loading" | - | Visual status indicator |
| variant | "subtle" \| "solid" \| "left-accent" \| "top-accent" | "subtle" | Visual presentation style |
| duration | number \| null | 5000 | Auto-dismiss milliseconds (null = never) |
| position | ToastPosition | "bottom" | Screen placement |
| isClosable | boolean | false | Show close button |
| id | ToastId | auto | Unique identifier |
| render | (props) => ReactNode | - | Custom render function |
| icon | ReactNode | - | Custom icon element |
| containerStyle | SystemProps | - | Container style overrides |
| onClose | () => void | - | Close callback |
| onCloseComplete | () => void | - | Post-close callback |
| addRole | boolean | false | Add ARIA alert role |

**ToastPosition Type**
```typescript
type ToastPosition =
  | "top"
  | "top-right"
  | "top-left"
  | "bottom"
  | "bottom-right"
  | "bottom-left"
```

**ChakraProvider toastOptions**
| Option | Type | Description |
|--------|------|-------------|
| defaultOptions | UseToastOptions | Default options for all toasts |
| motionVariants | MotionVariants | Framer Motion animation config |
| component | ComponentType | Custom toast component |
| portalProps | PortalProps | Portal component props |
| toastSpacing | string | Spacing between toasts |

### v3 API

**createToaster Function**
```typescript
const toaster = createToaster(config: ToasterConfig)
```

**ToasterConfig**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| placement | ToastPlacement | "bottom-end" | Default toast position |
| overlap | boolean | false | Allow overlapping toasts |
| gap | number | 16 | Spacing between toasts (px) |
| max | number | - | Maximum concurrent toasts |
| duration | number | 5000 | Default auto-dismiss duration (ms) |
| pauseOnInteraction | boolean | true | Pause timer on hover/focus |

**ToastPlacement Type**
```typescript
type ToastPlacement =
  | "top-start"
  | "top-center"
  | "top-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end"
```

**Toaster Methods**
| Method | Signature | Description |
|--------|-----------|-------------|
| create() | `(options: ToastOptions) => ToastId` | Create standard toast |
| success() | `(options: ToastOptions) => ToastId` | Create success toast |
| error() | `(options: ToastOptions) => ToastId` | Create error toast |
| warning() | `(options: ToastOptions) => ToastId` | Create warning toast |
| info() | `(options: ToastOptions) => ToastId` | Create info toast |
| promise() | `(promise: Promise, options: PromiseOptions) => ToastId` | Promise-based toast |
| update() | `(id: ToastId, options: ToastOptions) => void` | Update existing toast |
| dismiss() | `(id?: ToastId) => void` | Dismiss toast (no ID = all) |
| pause() | `(id: ToastId) => void` | Pause auto-dismiss timer |
| resume() | `(id: ToastId) => void` | Resume auto-dismiss timer |

**ToastOptions**
| Option | Type | Description |
|--------|------|-------------|
| title | string | Toast heading |
| description | string | Toast body content |
| type | "success" \| "error" \| "warning" \| "info" \| "loading" | Toast type/status |
| duration | number | Auto-dismiss duration (Infinity = never) |
| action | ActionConfig | Action button configuration |
| placement | ToastPlacement | Override default placement |

**ActionConfig**
| Property | Type | Description |
|----------|------|-------------|
| label | string | Action button text |
| onClick | () => void | Action button click handler |

**PromiseOptions (v3)**
```typescript
interface PromiseOptions {
  loading: { title: string; description?: string }
  success: { title: string; description?: string } | ((data) => ToastOptions)
  error: { title: string; description?: string } | ((error) => ToastOptions)
}
```

**Toast Component Parts (v3)**
| Component | Props | Description |
|-----------|-------|-------------|
| Toast.Root | asChild | Main container |
| Toast.Title | asChild | Heading text |
| Toast.Description | asChild | Body content |
| Toast.ActionTrigger | asChild | Action button |
| Toast.CloseTrigger | asChild | Close button |

**Data Attributes (v3)**
| Attribute | Values | Description |
|-----------|--------|-------------|
| data-scope | "toast" | Component scope |
| data-part | "root" \| "title" \| "description" | Component part |
| data-type | "success" \| "error" \| "warning" \| "info" \| "loading" | Toast type |
| data-state | "open" \| "closed" | Toast state |

**CSS Variables (v3)**
| Variable | Description |
|----------|-------------|
| --x | X position coordinate |
| --y | Y position coordinate |
| --scale | Scale transformation |
| --opacity | Opacity value |
| --z-index | Stacking order |
| --height | Toast height |
| --gap | Gap between toasts |

## Theming System

### v2 Theming

**Global Toast Options**:
```jsx
<ChakraProvider
  toastOptions={{
    defaultOptions: {
      position: 'top',
      duration: 3000,
      isClosable: true,
      variant: 'subtle',
      colorScheme: 'blue',
    },
    toastSpacing: '1rem',
  }}
>
  <App />
</ChakraProvider>
```

**Custom Motion Variants**:
```jsx
const customMotionVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8 },
}

<ChakraProvider
  toastOptions={{
    motionVariants: customMotionVariants
  }}
>
  <App />
</ChakraProvider>
```

**Custom Toast Component**:
```jsx
function CustomToastComponent({ id, onClose, title, description }) {
  return (
    <Box p={4} bg="purple.500" color="white" borderRadius="md">
      <Flex justify="space-between" align="start">
        <Box>
          <Text fontWeight="bold">{title}</Text>
          <Text fontSize="sm">{description}</Text>
        </Box>
        <CloseButton onClick={onClose} />
      </Flex>
    </Box>
  )
}

<ChakraProvider
  toastOptions={{
    component: CustomToastComponent
  }}
>
  <App />
</ChakraProvider>
```

### v3 Theming

**Customizing via Snippet File**:
```typescript
// components/ui/toaster.tsx
import { createToaster } from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'bottom-end',
  overlap: true,
  gap: 24,
  max: 5,
  duration: 5000,
  pauseOnInteraction: true,
})

// Custom Toaster component with styling
export function Toaster() {
  return (
    <Portal>
      <For each={toaster.toasts}>
        {(toast) => (
          <Toast.Root
            key={toast.id}
            // Custom styling via props
            bg="gray.800"
            color="white"
            borderRadius="lg"
            boxShadow="xl"
          >
            <Toast.Title>{toast.title}</Toast.Title>
            {toast.description && (
              <Toast.Description>{toast.description}</Toast.Description>
            )}
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            <Toast.CloseTrigger />
          </Toast.Root>
        )}
      </For>
    </Portal>
  )
}
```

**Styling via Data Attributes**:
```css
/* Target all toasts */
[data-scope='toast'][data-part='root'] {
  background: var(--chakra-colors-gray-800);
  border-radius: var(--chakra-radii-lg);
  box-shadow: var(--chakra-shadows-xl);
}

/* Target specific toast types */
[data-scope='toast'][data-type='success'] {
  border-left: 4px solid var(--chakra-colors-green-500);
}

[data-scope='toast'][data-type='error'] {
  border-left: 4px solid var(--chakra-colors-red-500);
}

/* Target toast states */
[data-scope='toast'][data-state='open'] {
  animation: slide-in 0.3s ease-out;
}

[data-scope='toast'][data-state='closed'] {
  animation: slide-out 0.2s ease-in;
}
```

**Using CSS Variables**:
```css
[data-scope='toast'][data-part='root'] {
  transform: translate(var(--x), var(--y)) scale(var(--scale));
  opacity: var(--opacity);
  z-index: var(--z-index);
  margin-bottom: var(--gap);
}
```

**Responsive Styling**:
```typescript
// In snippet file
export function Toaster() {
  return (
    <Portal>
      <For each={toaster.toasts}>
        {(toast) => (
          <Toast.Root
            key={toast.id}
            // Full width on mobile
            width={{ base: '100%', md: 'auto' }}
            maxWidth={{ base: '100%', md: '400px' }}
            mx={{ base: 0, md: 4 }}
          >
            {/* Toast content */}
          </Toast.Root>
        )}
      </For>
    </Portal>
  )
}
```

## Notable Features

### Programmatic API Evolution
- **v2**: Hook-based imperative API (`useToast()`) integrated directly into components
- **v3**: Standalone toaster object with component requirement - decouples toast logic from React lifecycle
- **Standalone support**: v2 offers `createStandaloneToast()` for non-React contexts
- **Code snippet pattern**: v3 uses CLI-generated snippet files for direct customization

### Promise Integration
- **Automatic state handling**: Both versions auto-update toast as promise transitions through loading/success/error
- **Dynamic content**: v3 success/error callbacks can receive promise result/error data
- **Loading indicators**: Built-in spinner display during promise pending state
- **Error handling**: Graceful error state display without try/catch in calling code

### State Management
- **Unique IDs**: Every toast returns unique identifier for programmatic control
- **Update capability**: Modify existing toast content, status, duration after creation
- **Duplicate prevention**: v2 `isActive()` check prevents duplicate toasts with same ID
- **Queue management**: v3 automatically queues toasts when max limit reached
- **Pause/resume**: v3 allows pausing auto-dismiss timer (useful for user interaction)

### Positioning & Layout
- **Six positions**: Comprehensive placement options (corners, edges, center)
- **Stacking behavior**: Automatic vertical stacking with configurable gaps
- **Overlap mode**: v3 supports overlapping vs. separate positioning
- **Maximum limits**: v3 `max` prop prevents notification overflow
- **Offset control**: v3 allows configuring distance from screen edges
- **Responsive design**: Recommended full-width on mobile (≤640px)

### Accessibility Features
- **ARIA roles**: Optional ARIA alert role for screen reader announcements
- **Keyboard navigation**: Built-in close button keyboard support
- **Focus management**: Proper focus handling for interactive toasts
- **Pause on interaction**: v3 pauses auto-dismiss on hover/focus
- **Semantic HTML**: Proper heading hierarchy with Title/Description components
- **Screen reader content**: Title and description appropriately announced

### Customization Capabilities
- **Custom render**: v2 `render` prop allows complete custom component
- **Container styling**: v2 `containerStyle` for wrapper modifications
- **Custom icons**: v2 `icon` prop for custom status icons
- **Action buttons**: v3 ActionTrigger for in-toast actions
- **Data attributes**: v3 provides comprehensive data attributes for CSS targeting
- **CSS variables**: v3 exposes runtime variables for dynamic styling
- **Snippet editing**: v3 allows editing toaster source directly in project

### Animation System
- **Framer Motion**: v2 uses Framer Motion for animations
- **Custom variants**: v2 allows custom motion variant configuration
- **CSS animations**: v3 supports CSS-based animations via data-state attributes
- **Position-aware**: Animations respect toast placement (slide from correct edge)
- **Exit animations**: Smooth transitions on dismiss

### Type Safety
- **TypeScript support**: Both versions have comprehensive TypeScript definitions
- **Type-safe options**: All configuration objects fully typed
- **Enum types**: Status, position, variant as typed string literals
- **Return type**: Toast ID properly typed for update/close operations

### Performance Optimizations
- **Portal rendering**: Toasts render in separate portal to avoid reflow
- **Minimal re-renders**: Toaster component optimized to minimize React updates
- **Queue efficiency**: v3 queue system prevents overwhelming DOM
- **Cleanup automation**: Automatic removal of closed toasts from DOM
- **Event delegation**: Efficient event handling for multiple toasts

## Research Notes

### Documentation Access
- **v3 Documentation**: Successfully accessed at chakra-ui.com with component examples
- **v2 Documentation**: Complete legacy documentation at v2.chakra-ui.com
- **Ark UI Foundation**: v3 built on ark-ui.com/docs/components/toast - accessible documentation
- **Migration Guide**: Available at chakra-ui.com/docs/get-started/migration
- **CLI Tooling**: v3 provides `npx @chakra-ui/cli snippet add` for code generation

### Framework Approach Observations

**Architectural Evolution (v2 → v3)**:
- **Paradigm shift**: Hook-based → Code snippet pattern with imported singleton
- **Component requirement**: v2 auto-managed → v3 requires explicit `<Toaster />` component
- **Customization approach**: v2 theme overrides → v3 edit snippet file directly
- **Foundation change**: v2 custom implementation → v3 built on Ark UI primitives
- **API surface**: v2 larger API (variants, colorScheme, containerStyle) → v3 streamlined
- **Type system**: v2 "status" → v3 "type" (terminology alignment)

**Code Snippet Philosophy**:
- **Direct control**: Developers own the toaster implementation in their codebase
- **No abstraction**: Edit the actual component/toaster code vs. configuring through props
- **Version independence**: Snippet updates independent of Chakra version bumps
- **Customization freedom**: Unlimited customization without theme escape hatches
- **CLI automation**: `snippet add` generates code, `snippet update` for improvements

**TypeScript Integration**:
- Comprehensive type definitions in both versions
- v2 exports all option types from main package
- v3 snippet includes types directly in generated file
- JSDoc annotations throughout for editor IntelliSense
- Type-safe method signatures with proper generics

**Chakra UI Philosophy**:
- **Developer experience**: v3 simplifies via code ownership over complex configuration
- **Composability**: Multi-part anatomy enables flexible toast composition
- **Accessibility first**: ARIA roles, semantic HTML, keyboard navigation built-in
- **Design system integration**: Strong token and theming support
- **Framework patterns**: v3 aligns with modern React patterns (hooks, composition)

**Ark UI Integration** (v3):
- **Headless foundation**: Ark provides unstyled behavior primitives
- **Data attributes**: Comprehensive `data-*` attributes for styling hooks
- **CSS variables**: Runtime variables for dynamic styling
- **Type safety**: Strong TypeScript definitions from Ark
- **Framework agnostic**: Ark supports React, Vue, Solid (Chakra wraps React version)
- **Part-based API**: Toast.Root, Toast.Title pattern from Ark anatomy

### Implementation Patterns

**v2 Patterns**:
- **Hook composition**: `const toast = useToast()` in component body
- **Imperative calls**: `toast({ ... })` in event handlers
- **Global configuration**: Provider-level defaults via `toastOptions`
- **Ref pattern**: `useRef()` to store toast IDs for updates/closes
- **Standalone usage**: `createStandaloneToast()` for non-React contexts
- **Custom components**: `render` prop or `component` in provider

**v3 Patterns**:
- **Singleton import**: `import { toaster } from '~/components/ui/toaster'`
- **Component placement**: `<Toaster />` in app root or layout
- **Configuration**: Edit `createToaster()` call in snippet file
- **Effect safety**: Wrap `toaster.create()` in `queueMicrotask()` within effects
- **Type helpers**: `toaster.success()`, `toaster.error()` convenience methods
- **Action integration**: `action: { label, onClick }` for in-toast buttons

**State Management**:
- **External state**: Toasts managed outside React state tree
- **ID tracking**: Manual ID storage for updates/dismissals (both versions)
- **Promise automation**: Automatic state updates from promise lifecycle
- **Queue system**: v3 automatic queuing when max toasts exceeded
- **Pause capability**: v3 pause/resume for user interaction scenarios

**Accessibility Approach**:
- **Screen reader announcements**: Title/Description semantically announced
- **ARIA roles**: Optional `role="alert"` for dynamic announcements
- **Keyboard support**: Built-in close button keyboard accessibility
- **Focus management**: Proper focus handling for interactive content
- **Pause on interaction**: v3 pauses timer when user hovers/focuses

**Styling Architecture**:
- **v2**: Chakra's style props + theme system + variant system
- **v3**: Data attributes + CSS variables + direct props on snippet components
- **Responsiveness**: Recommended full-width mobile, fixed-width desktop
- **Animations**: v2 Framer Motion, v3 CSS animations via data-state
- **Theming**: v2 provider config, v3 edit snippet component directly

### Comparison Points for Semantic UI

**Strengths to Consider**:
- **Promise integration**: Elegant async operation handling with auto state updates
- **Programmatic API**: Clean imperative API for triggering from any context
- **Position system**: Comprehensive 6-position placement with auto-stacking
- **Update capability**: Modify existing toasts (useful for progress indicators)
- **Queue management**: v3 max toasts with automatic queuing prevents overflow
- **Pause on interaction**: v3 pause/resume timer for better UX
- **Action buttons**: v3 ActionTrigger for in-toast actions
- **Code ownership**: v3 snippet pattern gives complete customization control
- **Type safety**: Strong TypeScript support throughout
- **Accessibility**: Built-in ARIA, keyboard support, pause on interaction

**Potential Improvements**:
- **Auto-dismiss defaults**: Consider smarter defaults based on toast type/content length
- **Batch operations**: API for showing multiple toasts with single call
- **Priority system**: Queue prioritization (errors first, then warnings, etc.)
- **Persistent storage**: Remember dismissed toasts to prevent re-showing
- **Undo/redo**: Built-in undo pattern for destructive actions
- **Sound/haptic**: Optional audio/vibration for important toasts
- **Read aloud**: Screen reader auto-read option for critical messages
- **Animation presets**: More built-in animation variants

**Alignment with Web Standards**:
- React-specific (not web components)
- JSX composition (not custom elements)
- v2: CSS-in-JS, v3: CSS variables + data attributes (better standards alignment)
- Strong TypeScript integration
- v3 data attributes enable standard CSS targeting
- Could benefit from Custom Element API for framework independence
- Portal rendering aligns with DOM best practices
- ARIA support follows accessibility standards

**Migration Considerations**:
- v2 → v3 requires significant refactoring
- Hook calls replaced with toaster imports
- Status → type terminology change
- Variants removed in v3 (customize via snippet instead)
- Component placement required in v3
- Theme configuration → snippet file editing
- More breaking changes but better long-term DX
- Migration guide available at chakra-ui.com/docs/get-started/migration

### Cross-Framework Pattern Analysis

**Toast vs Snackbar Terminology**:
- Chakra uses "Toast" (common with Mantine, HeroUI, Nuxt UI, ShadCN)
- MUI uses "Snackbar" (Material Design terminology)
- Ant Design uses "Message" (notification variant)
- Conceptually identical: temporary overlay notifications

**Composition Patterns**:
- Multi-part anatomy similar to Radix Toast (Toast.Root, Toast.Title, etc.)
- v3 builds on Ark UI (headless primitives like Radix)
- Promise pattern similar to React Hot Toast library
- Action buttons similar to Material Snackbar actions
- Position system similar to React Toastify placement

**State Management Approaches**:
- **Imperative API**: Chakra, React Hot Toast, React Toastify (programmatic)
- **Declarative API**: Some frameworks prefer component-based toasts
- **Hybrid**: v3 combines imperative trigger + declarative component structure
- **Global state**: All major toast libraries use external state management

**Customization Strategies**:
- **v2**: Theme-based (similar to Mantine, Ant Design)
- **v3**: Code ownership (similar to ShadCN's copy-paste philosophy)
- **Headless**: Radix, Ark, Headless UI provide unstyled primitives
- **Styled**: Chakra, MUI, Ant Design provide styled components
- **Hybrid**: v3 Chakra provides styled base with customization access

**Positioning Strategies**:
- **Six corners/edges**: Industry standard (Chakra, Toastify, Hot Toast)
- **Center positions**: Some support top-center, bottom-center
- **Multiple groups**: Advanced libraries support per-position stacks
- **Responsive**: Most recommend full-width mobile

**Animation Approaches**:
- **Framer Motion**: Chakra v2, some modern React libraries
- **CSS transitions**: Chakra v3, simpler implementations
- **Spring physics**: React Spring-based libraries
- **Custom**: v2 allows motion variant customization

**Promise Integration**:
- **Chakra pattern**: loading/success/error object with auto transitions
- **React Hot Toast**: Similar promise pattern
- **Unique feature**: Not all toast libraries support promise handling
- **Best practice**: Elegant UX for async operations

**Accessibility Patterns**:
- **ARIA roles**: Optional role="alert" (Chakra, accessible libraries)
- **Pause on hover**: v3 Chakra, React Toastify, best practice
- **Keyboard dismiss**: Standard across accessible implementations
- **Screen reader**: Title/description semantic announcements
- **Focus management**: Handling focus for interactive toasts
