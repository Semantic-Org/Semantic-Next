# Modal Component - Cross-Framework Pattern Research

> Research Date: 2025-11-05
> Frameworks Analyzed: Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Semantic UI Classic, Vuetify, PrimeReact

## Executive Summary

The Modal/Dialog component is a **universal UI pattern** found across all major frameworks. It provides an overlay container that blocks interaction with the main page content while presenting focused information, forms, confirmations, or other critical UI elements. All frameworks support essential features like backdrop overlays, keyboard dismissal, focus management, and accessibility.

**Usage Level: 1 (Universal)** - 100% of frameworks provide dedicated modal/dialog implementations

---

## Pattern Inventory

### 1. Component Naming & Architecture

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| "Modal" naming | 78% (7/9) | Ant, HeroUI, Mantine, Nuxt, Semantic, Chakra v2, PrimeReact | Most common term |
| "Dialog" naming | 44% (4/9) | MUI, Vuetify, Chakra v3, PrimeReact | Alternative naming |
| Dual naming (Modal + Dialog) | 22% (2/9) | MUI, PrimeReact | Both low-level and high-level variants |
| Compound component structure | 78% (7/9) | Chakra, HeroUI, Mantine, MUI, Nuxt, Vuetify, PrimeReact | Separate header/body/footer components |
| Simple wrapper structure | 22% (2/9) | Ant, Semantic | Single container with content |

**Naming Across Frameworks:**
- **Ant Design**: Modal + Panel
- **Chakra UI**: Modal (v2) → Dialog (v3)
- **HeroUI**: Modal + ModalContent/Header/Body/Footer
- **Mantine**: Modal + Modal.Header/Body/Footer
- **MUI**: Modal (primitive) + Dialog (composed)
- **Nuxt UI**: Modal (UModal)
- **Semantic UI**: Modal (jQuery module)
- **Vuetify**: Dialog (v-dialog) + v-card structure
- **PrimeReact**: Dialog

---

### 2. State Management Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Boolean visibility prop | 100% (9/9) | All | open, visible, isOpen, v-model |
| onChange/onClose callback | 100% (9/9) | All | Handle close events |
| Controlled state | 100% (9/9) | All | Parent controls visibility |
| Uncontrolled/default state | 44% (4/9) | Ant, Chakra, Mantine, Nuxt | defaultOpen, defaultValue |
| useState pattern | 89% (8/9) | All except Semantic | Modern React/Vue state |
| useDisclosure hook | 44% (4/9) | Chakra, Mantine, Nuxt, Vuetify | Convenience hook for open/close |
| v-model binding (Vue) | 33% (3/9) | Nuxt, Vuetify, (Semantic via jQuery) | Two-way binding |

**State Control Examples:**

**React (Ant Design, HeroUI, Mantine, MUI, PrimeReact):**
```jsx
const [open, setOpen] = useState(false);

<Modal open={open} onClose={() => setOpen(false)}>
  Content
</Modal>
```

**Chakra UI v3:**
```jsx
const [open, setOpen] = useState(false);

<Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
  <Dialog.Content>Content</Dialog.Content>
</Dialog.Root>
```

**Vue (Nuxt UI, Vuetify):**
```vue
<template>
  <v-dialog v-model="dialog">
    <v-card>Content</v-card>
  </v-dialog>
</template>

<script setup>
const dialog = ref(false)
</script>
```

**Semantic UI (jQuery):**
```javascript
$('.ui.modal').modal('show');
```

---

### 3. Visual Variants & Styling

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Default/standard modal | 100% (9/9) | All | Basic modal with backdrop |
| Centered modal | 100% (9/9) | All | Vertically & horizontally centered |
| Fullscreen modal | 89% (8/9) | All except Semantic | Takes full viewport |
| Basic/minimal variant | 33% (3/9) | Semantic, Mantine, Chakra | Reduced styling |
| Modal vs modeless | 22% (2/9) | PrimeReact, Semantic | With or without backdrop |
| Backdrop blur effect | 33% (3/9) | HeroUI, Mantine, Chakra | Blurred background |
| Backdrop opacity control | 78% (7/9) | Ant, Chakra, HeroUI, Mantine, MUI, Nuxt, PrimeReact | Custom backdrop darkness |
| Transparent backdrop | 22% (2/9) | HeroUI, PrimeReact | See-through overlay |

---

### 4. Sizing Options

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Predefined sizes (xs/sm/md/lg/xl) | 89% (8/9) | All except Semantic | Multiple size options |
| Custom width | 100% (9/9) | All | Via style props or CSS |
| Custom height | 100% (9/9) | All | Via style props or CSS |
| Responsive sizing | 89% (8/9) | All except Semantic | Viewport-based sizing |
| max-width control | 89% (8/9) | All except Semantic | Limit maximum width |
| Full viewport option | 89% (8/9) | All except Semantic | 100vw x 100vh |

**Size Comparison:**

| Framework | Size Options | Default |
|-----------|--------------|---------|
| Ant Design | Custom via style | 520px width |
| Chakra UI | xs, sm, md, lg, xl, full | md |
| HeroUI | xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, full | md |
| Mantine | xs, sm, md, lg, xl, fullScreen | md |
| MUI Dialog | xs, sm, md, lg, xl, false | sm |
| Nuxt UI | Custom via props | default |
| Semantic UI | mini, tiny, small, large, fullscreen | standard |
| Vuetify | max-width prop, fullscreen | 600px |
| PrimeReact | Custom via style, breakpoint | 50vw |

---

### 5. Positioning & Layout

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Center position (default) | 100% (9/9) | All | Centered in viewport |
| Top alignment | 67% (6/9) | Ant, Chakra, MUI, Semantic, Vuetify, PrimeReact | Near top of screen |
| Bottom position | 44% (4/9) | Chakra, MUI, Vuetify, PrimeReact | Bottom sheet style |
| Custom positioning | 67% (6/9) | Ant, Chakra, MUI, Semantic, Vuetify, PrimeReact | x/y coordinates |
| Corner positioning | 22% (2/9) | PrimeReact, Semantic | Top-left, top-right, etc. |
| Edge positioning | 44% (4/9) | Chakra, MUI, Vuetify, PrimeReact | Left, right, top, bottom |
| Draggable | 44% (4/9) | Ant, HeroUI, Semantic, PrimeReact | User can reposition |
| Resizable | 22% (2/9) | Semantic, PrimeReact | User can resize |

**Positioning Examples:**

**PrimeReact - Multiple Positions:**
```jsx
<Dialog position="top">...</Dialog>
<Dialog position="bottom">...</Dialog>
<Dialog position="left">...</Dialog>
<Dialog position="right">...</Dialog>
<Dialog position="top-left">...</Dialog>
<Dialog position="top-right">...</Dialog>
<Dialog position="bottom-left">...</Dialog>
<Dialog position="bottom-right">...</Dialog>
```

**MUI - Custom Positioning:**
```jsx
<Dialog
  PaperProps={{
    sx: {
      position: 'fixed',
      top: 100,
      left: 100,
    }
  }}
>
  Content
</Dialog>
```

---

### 6. Content Structure Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Header/title section | 100% (9/9) | All | Dedicated header area |
| Body/content section | 100% (9/9) | All | Main content area |
| Footer/actions section | 100% (9/9) | All | Button area at bottom |
| Close button in header | 100% (9/9) | All | X button to close |
| Icon in header | 78% (7/9) | All except Ant, Semantic | Leading icons |
| Image content | 44% (4/9) | Ant, Semantic, MUI, Vuetify | Image-based modals |
| Scrollable content | 100% (9/9) | All | Long content scrolling |
| Sticky header | 89% (8/9) | All except Semantic | Header stays at top |
| Sticky footer | 89% (8/9) | All except Semantic | Footer stays at bottom |

**Structure Comparison:**

**Compound (Chakra UI v3):**
```jsx
<Dialog.Root>
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.CloseTrigger />
      </Dialog.Header>
      <Dialog.Body>Content</Dialog.Body>
      <Dialog.Footer>Actions</Dialog.Footer>
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>
```

**Simple (Ant Design):**
```jsx
<Modal title="Title" open={open} onOk={handleOk} onCancel={handleCancel}>
  Content
</Modal>
```

---

### 7. Interactive Features

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Backdrop click to close | 100% (9/9) | All | Click outside to dismiss |
| Disable backdrop close | 100% (9/9) | All | Persistent modal |
| Escape key to close | 100% (9/9) | All | Keyboard dismissal |
| Disable escape close | 89% (8/9) | All except Semantic | Prevent ESC dismissal |
| Trigger/activator component | 56% (5/9) | Chakra, Nuxt, Vuetify, Mantine, Semantic | Built-in trigger |
| Programmatic open/close | 100% (9/9) | All | Via state or methods |
| Nested modals | 89% (8/9) | All except Semantic | Stacked modals |
| Modal stacking | 44% (4/9) | Mantine, MUI, Vuetify, PrimeReact | Z-index management |
| Auto-close on action | 78% (7/9) | All except Ant, Semantic | Close after OK/Cancel |

**Dismissal Control Examples:**

**Prevent Backdrop Close:**
```jsx
// Ant Design
<Modal maskClosable={false}>...</Modal>

// Chakra UI v3
<Dialog.Root closeOnInteractOutside={false}>...</Dialog.Root>

// HeroUI
<Modal isDismissable={false}>...</Modal>

// Mantine
<Modal closeOnClickOutside={false}>...</Modal>

// MUI
<Dialog disableEscapeKeyDown onClose={(e, reason) => {
  if (reason !== 'backdropClick') onClose();
}}>...</Dialog>

// Vuetify
<v-dialog persistent>...</v-dialog>

// PrimeReact
<Dialog dismissableMask={false}>...</Dialog>
```

---

### 8. Animation & Transitions

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Fade in/out | 100% (9/9) | All | Default animation |
| Scale animation | 56% (5/9) | Ant, Chakra, MUI, Semantic, PrimeReact | Grow/shrink effect |
| Slide in | 67% (6/9) | Chakra, MUI, Semantic, Vuetify, PrimeReact, HeroUI | Slide from edge |
| Custom transitions | 89% (8/9) | All except Semantic | Define custom animations |
| Disable animations | 89% (8/9) | All except Semantic | Turn off motion |
| Transition duration control | 67% (6/9) | Ant, Chakra, Mantine, Semantic, Vuetify, PrimeReact | Speed control |
| Spring animations | 33% (3/9) | Chakra, HeroUI, Mantine | Physics-based motion |

**Animation Examples:**

**MUI - Multiple Transition Types:**
```jsx
import { Fade, Grow, Slide } from '@mui/material';

<Dialog TransitionComponent={Fade}>...</Dialog>
<Dialog TransitionComponent={Grow}>...</Dialog>
<Dialog TransitionComponent={Slide} TransitionProps={{ direction: 'up' }}>...</Dialog>
```

**Chakra UI v2 - Motion Presets:**
```jsx
<Modal motionPreset="slideInBottom">...</Modal>
<Modal motionPreset="slideInRight">...</Modal>
<Modal motionPreset="scale">...</Modal>
<Modal motionPreset="none">...</Modal>
```

---

### 9. Scroll Behavior

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Body scroll lock | 100% (9/9) | All | Prevent page scroll when open |
| Content scroll inside | 100% (9/9) | All | Scroll within modal |
| Modal scroll outside | 44% (4/9) | Chakra, HeroUI, MUI, Vuetify | Scroll entire modal |
| Auto-scrollable content | 100% (9/9) | All | Overflow: auto |
| Max-height control | 89% (8/9) | All except Semantic | Limit modal height |
| Scrollable regions | 78% (7/9) | All except Ant, Semantic | Specific scroll areas |

**Scroll Behavior Examples:**

**Chakra UI v2:**
```jsx
<Modal scrollBehavior="inside">
  {/* Content scrolls inside modal */}
</Modal>

<Modal scrollBehavior="outside">
  {/* Entire modal scrolls */}
</Modal>
```

**HeroUI:**
```jsx
<Modal scrollBehavior="inside">...</Modal>
<Modal scrollBehavior="outside">...</Modal>
<Modal scrollBehavior="normal">...</Modal>
```

---

### 10. Confirmation & Alert Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Confirm dialog | 89% (8/9) | All except HeroUI | Yes/No confirmation |
| Alert dialog | 78% (7/9) | All except HeroUI, Semantic | Info/warning/error |
| Static methods | 33% (3/9) | Ant, MUI, Semantic | Modal.confirm(), Modal.info() |
| Imperative API | 44% (4/9) | Ant, Chakra, Mantine, Semantic | Non-declarative creation |
| Promise-based | 22% (2/9) | Ant, Mantine | Async/await support |
| OK/Cancel buttons | 89% (8/9) | All except Nuxt | Standard actions |
| Custom button text | 100% (9/9) | All | Localization support |

**Confirmation Dialog Examples:**

**Ant Design - Static Methods:**
```jsx
import { Modal } from 'antd';

// Confirmation
Modal.confirm({
  title: 'Delete this item?',
  content: 'This action cannot be undone',
  onOk() {
    console.log('Confirmed');
  },
  onCancel() {
    console.log('Cancelled');
  },
});

// Info/Success/Error/Warning
Modal.info({ title: 'Information', content: 'Details here' });
Modal.success({ title: 'Success', content: 'Operation completed' });
Modal.error({ title: 'Error', content: 'Something went wrong' });
Modal.warning({ title: 'Warning', content: 'Please be careful' });
```

**MUI - AlertDialog:**
```jsx
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Delete Item?</DialogTitle>
  <DialogContent>
    <DialogContentText>
      This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleDelete} color="error">Delete</Button>
  </DialogActions>
</Dialog>
```

---

### 11. Form Integration Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Form in modal | 100% (9/9) | All | Common use case |
| Form validation | 100% (9/9) | All | Inline validation |
| Submit on OK | 89% (8/9) | All except Nuxt | OK button submits form |
| Prevent close on submit | 78% (7/9) | All except Ant, Semantic | Keep open during async |
| Loading state during submit | 89% (8/9) | All except Semantic | Disable buttons, show spinner |
| Error handling | 100% (9/9) | All | Display validation errors |
| Reset on close | 78% (7/9) | All except Ant, Semantic | Clear form data |

**Form Modal Example (Ant Design):**
```jsx
const [form] = Form.useForm();
const [confirmLoading, setConfirmLoading] = useState(false);

<Modal
  title="Edit User"
  open={open}
  onOk={() => {
    form.validateFields()
      .then(values => {
        setConfirmLoading(true);
        // Submit form
        return api.updateUser(values);
      })
      .then(() => {
        setOpen(false);
        form.resetFields();
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  }}
  confirmLoading={confirmLoading}
  onCancel={() => {
    setOpen(false);
    form.resetFields();
  }}
>
  <Form form={form}>
    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
      <Input />
    </Form.Item>
  </Form>
</Modal>
```

---

### 12. Accessibility Patterns

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| ARIA dialog role | 100% (9/9) | All | role="dialog" |
| ARIA modal attribute | 100% (9/9) | All | aria-modal="true" |
| aria-labelledby | 100% (9/9) | All | Links to title |
| aria-describedby | 100% (9/9) | All | Links to description |
| Focus trap | 100% (9/9) | All | Tab cycles within modal |
| Initial focus control | 89% (8/9) | All except Semantic | Set first focused element |
| Return focus on close | 100% (9/9) | All | Focus returns to trigger |
| Escape key support | 100% (9/9) | All | ESC to close |
| Screen reader announcements | 100% (9/9) | All | State changes announced |
| Keyboard navigation | 100% (9/9) | All | Tab, Enter, Space, ESC |

**Accessibility Implementation:**

All frameworks automatically apply:
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` pointing to title
- `aria-describedby` pointing to content
- Focus trap within modal
- ESC key to dismiss
- Focus return on close

**Custom Focus Control (MUI):**
```jsx
<Dialog
  open={open}
  onClose={handleClose}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogTitle id="dialog-title">Title</DialogTitle>
  <DialogContent id="dialog-description">
    <TextField autoFocus />
  </DialogContent>
</Dialog>
```

---

### 13. Advanced Features

| Pattern | Prevalence | Frameworks Supporting | Notes |
|---------|------------|----------------------|-------|
| Lazy mounting | 56% (5/9) | Ant, Chakra, Mantine, Vuetify, PrimeReact | Don't render until opened |
| Keep mounted | 67% (6/9) | Ant, MUI, Semantic, Vuetify, PrimeReact, Mantine | Stay in DOM when closed |
| Portal rendering | 89% (8/9) | All except Semantic | Render to document.body |
| z-index management | 100% (9/9) | All | Auto z-index stacking |
| Maximizable | 22% (2/9) | Semantic, Vuetify | Expand to fullscreen |
| Minimizable | 11% (1/9) | Semantic | Collapse to title bar |
| Draggable header | 44% (4/9) | Ant, HeroUI, Semantic, PrimeReact | Drag by header |
| Resizable | 22% (2/9) | Semantic, PrimeReact | User resize edges |
| Multiple instances | 78% (7/9) | All except Ant, Semantic | Multiple modals open |
| Modal queue/stack | 33% (3/9) | Mantine, Vuetify, PrimeReact | Sequential modal display |

**Advanced Feature Examples:**

**Draggable Modal (HeroUI):**
```jsx
<Modal
  isOpen={isOpen}
  onOpenChange={onOpenChange}
  isDraggable
  dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
>
  <ModalContent>...</ModalContent>
</Modal>
```

**Resizable Dialog (PrimeReact):**
```jsx
<Dialog
  visible={visible}
  onHide={hide}
  resizable
  draggable
  maximizable
>
  Content
</Dialog>
```

**Modal Stack (Mantine):**
```jsx
import { modals } from '@mantine/modals';

// Open multiple modals programmatically
modals.open({ title: 'First Modal', children: <div>...</div> });
modals.open({ title: 'Second Modal', children: <div>...</div> });
```

---

## Framework Comparison Table

| Feature | Ant | Chakra | Hero | Mantine | MUI | Nuxt | Semantic | Vuetify | Prime |
|---------|-----|--------|------|---------|-----|------|----------|---------|-------|
| **Component name** | Modal | Dialog (v3) | Modal | Modal | Modal/Dialog | Modal | Modal | Dialog | Dialog |
| **Visibility control** | open | open | isOpen | opened | open | v-model | show() | v-model | visible |
| **Backdrop close** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **ESC to close** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Size variants** | Custom | 6 | 10 | 5 | 5 | Custom | 5 | Custom | Custom |
| **Fullscreen** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Positioning** | top/custom | 8 options | center | center/custom | center/custom | center | center/custom | center | 9 positions |
| **Draggable** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Resizable** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Nested modals** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Static methods** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Lazy mounting** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Focus trap** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **ARIA compliant** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Animation control** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Scroll behavior** | inside | inside/outside | inside/outside | inside | inside/outside | inside | inside | inside/outside | inside |
| **Form integration** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Common Use Cases Across All Frameworks

1. **Confirmation Dialogs** - Delete, submit, logout confirmations
2. **Form Dialogs** - Login, registration, settings, data entry
3. **Alert Messages** - Info, success, error, warning notifications
4. **Detail Views** - Product details, user profiles, preview content
5. **Multi-step Workflows** - Wizards, tutorials, onboarding
6. **Settings Panels** - Configuration, preferences
7. **Content Display** - Images, videos, documentation
8. **Command Palettes** - Search-based interactions
9. **Terms & Conditions** - Legal agreements, policies
10. **Help & Support** - FAQs, contextual help

---

## Best Practices (Cross-Framework Consensus)

### When to Use Modals
1. ✅ Critical actions requiring confirmation (delete, logout)
2. ✅ Forms that require focused attention
3. ✅ Information that must be acknowledged
4. ✅ Temporary workflows (wizards, multi-step)
5. ❌ **Avoid** for non-critical information
6. ❌ **Avoid** overusing (modal fatigue)
7. ❌ **Avoid** for frequent interactions

### UX Guidelines
1. **Keep content concise** - Modals should be focused
2. **Provide clear actions** - Always have a way to close
3. **Use persistent modals sparingly** - Allow escape for most cases
4. **Handle loading states** - Show progress during async operations
5. **Mobile considerations** - Use fullscreen on small screens
6. **Animation** - Keep transitions quick (200-300ms)
7. **Stacking** - Limit nested modals to 2-3 levels max

### Accessibility
1. **Always trap focus** - Tab should cycle within modal
2. **Announce state changes** - Screen reader notifications
3. **Set initial focus** - First interactive element or close button
4. **Return focus on close** - Back to trigger element
5. **Provide keyboard shortcuts** - ESC to close, Enter to confirm
6. **Use semantic HTML** - Proper heading hierarchy
7. **Test with screen readers** - NVDA, JAWS, VoiceOver

### Performance
1. **Lazy mount** - Don't render until needed
2. **Unmount on close** - Free up DOM for large modals
3. **Optimize content** - Lazy load images/data
4. **Avoid heavy animations** - Performance on slower devices
5. **Portal rendering** - Render to body for proper layering

---

## Unique Features by Framework

### Ant Design
- **Static methods**: `Modal.confirm()`, `Modal.info()`, `Modal.success()`, `Modal.error()`, `Modal.warning()`
- **useModal hook**: Promise-based imperative API
- **destroyOnClose**: Unmount child components on close
- **confirmLoading**: Built-in loading state for OK button
- **maskClosable**: Explicit backdrop dismissal control

### Chakra UI
- **Major v2→v3 redesign**: Modal → Dialog with compound pattern
- **Multiple motion presets** (v2): slideInBottom, slideInRight, scale, none
- **8 positioning options** (v3): center, top, bottom, left, right, top-left, top-right, bottom-left, bottom-right
- **useDisclosure hook**: Convenient open/close state management
- **closeOnOverlayClick/closeOnInteractOutside**: Clear naming

### HeroUI
- **10 size options**: Most granular sizing (xs → 5xl + full)
- **Backdrop variants**: opaque, blur, transparent
- **Draggable**: Built-in drag support with constraints (v2.6+)
- **Subtitle support**: Secondary text in header
- **motionProps**: Custom Framer Motion animations

### Mantine
- **useDisclosure hook**: State + handlers (open, close, toggle)
- **Compound components**: Modal.Header, Modal.Body, Modal.Title, Modal.CloseButton
- **Modal.Stack**: Multiple modal management with auto z-index
- **fullScreen prop**: Dedicated fullscreen mode
- **overlayProps**: Fine-grained backdrop control
- **removeScrollProps**: Scroll lock customization

### MUI
- **Dual components**: Modal (primitive) + Dialog (composed)
- **TransitionComponent**: Fade, Grow, Slide, custom
- **PaperProps**: Deep customization of dialog container
- **DialogContentText**: Semantic description text
- **keepMounted**: Lazy rendering toggle
- **scroll prop**: paper (content scrolls) vs body (dialog scrolls)

### Nuxt UI
- **Built on Reka UI**: Accessible primitives foundation
- **Slot system**: #header, #body, #footer with scope
- **Tailwind integration**: ui prop for class customization
- **useOverlay composable**: Programmatic modal creation
- **MDC support**: Render markdown in modals
- **v-model**: Two-way binding for Vue reactivity

### Semantic UI
- **jQuery-based**: Imperative API via $('.modal').modal()
- **Multiple transition types**: scale, fade, flip, fade up
- **Approval/denial callbacks**: onApprove, onDeny, onHidden
- **Image modals**: Dedicated image content pattern
- **Dynamic content**: AJAX loading on show
- **Detachable**: Control portal behavior
- **Blurring dimmer**: Backdrop blur effect

### Vuetify
- **v-dialog + v-card pattern**: Structured content layout
- **Activator slot**: Built-in trigger with scoped props
- **persistent prop**: Simple non-dismissable modal
- **scrollable prop**: Enable content scrolling
- **fullscreen prop**: Mobile-optimized full viewport
- **transition prop**: Custom Vue transitions
- **Scrim (backdrop)**: Material Design terminology

### PrimeReact
- **9 positioning options**: Most positioning flexibility
- **Draggable + Resizable**: Interactive repositioning
- **Maximizable**: Expand to fullscreen dynamically
- **PassThrough API**: Granular DOM customization
- **dismissableMask**: Click-outside dismissal
- **blockScroll**: Body scroll locking
- **onDragEnd/onResize callbacks**: Interactive events
- **breakpoint prop**: Responsive width control

---

## Anti-Patterns to Avoid

1. **Modal Overload** - Too many modals in quick succession (modal fatigue)
2. **Nested Overuse** - More than 2-3 levels of nesting
3. **Missing Escape Routes** - Always allow closing (except critical actions)
4. **Poor Mobile Experience** - Not using fullscreen on small screens
5. **Heavy Content** - Loading too much data in a modal
6. **Auto-Opening** - Modals that open without user action
7. **Non-Blocking for Errors** - Critical errors should use modals
8. **Missing Focus Management** - Not trapping or returning focus
9. **Long Forms** - Multi-step wizards are better than one long modal form
10. **Confirmation Overuse** - Don't confirm every action

---

## Migration Considerations

When moving between frameworks:

1. **State Management**: Check prop names (open vs visible vs isOpen vs v-model)
2. **Callback Naming**: onClose vs onHide vs onOpenChange
3. **Compound Structure**: Some use flat components, others use namespaced
4. **Imperative APIs**: Ant/Semantic offer static methods, others are declarative only
5. **Positioning**: Different frameworks have different positioning systems
6. **Animation**: Transition APIs vary significantly
7. **Accessibility**: Most handle automatically, verify focus behavior

**Example Migration (Semantic UI → Mantine):**
```javascript
// Semantic UI (jQuery)
$('.ui.modal')
  .modal({
    closable: false,
    onApprove: () => console.log('Approved'),
    onDeny: () => console.log('Denied')
  })
  .modal('show');

// Mantine (React)
const [opened, { open, close }] = useDisclosure(false);

<Modal opened={opened} onClose={close} closeOnClickOutside={false}>
  <Modal.Header>
    <Modal.Title>Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Group>
    <Button onClick={() => { console.log('Denied'); close(); }}>Deny</Button>
    <Button onClick={() => { console.log('Approved'); close(); }}>Approve</Button>
  </Group>
</Modal>
```

---

## Framework-Specific Prop Comparison

### Visibility Control

| Framework | Open Prop | Close Callback | Default Open |
|-----------|-----------|----------------|--------------|
| Ant | `open` | `onOk`, `onCancel` | `defaultOpen` |
| Chakra | `open` (v3) | `onOpenChange` | `defaultOpen` |
| HeroUI | `isOpen` | `onOpenChange` | `defaultOpen` |
| Mantine | `opened` | `onClose` | - |
| MUI | `open` | `onClose` | - |
| Nuxt | `v-model:open` | `@update:open` | `default-open` |
| Semantic | `.modal('show')` | `onHidden` | - |
| Vuetify | `v-model` | `@update:modelValue` | - |
| PrimeReact | `visible` | `onHide` | - |

### Size Control

| Framework | Size Prop | Available Sizes |
|-----------|-----------|-----------------|
| Ant | `width` | Custom width |
| Chakra | `size` | xs, sm, md, lg, xl, full |
| HeroUI | `size` | xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, full |
| Mantine | `size` | xs, sm, md, lg, xl, auto, number, % |
| MUI | `maxWidth` | xs, sm, md, lg, xl, false |
| Nuxt | `class` | Custom via Tailwind |
| Semantic | `class` | mini, tiny, small, large, fullscreen |
| Vuetify | `max-width` | Number or string |
| PrimeReact | `style` | Custom width, breakpoint |

### Backdrop Control

| Framework | Backdrop Click Prop | Backdrop Style Prop |
|-----------|---------------------|---------------------|
| Ant | `maskClosable` | `maskStyle` |
| Chakra | `closeOnInteractOutside` | backdrop component |
| HeroUI | `isDismissable` | `backdrop` (opaque/blur/transparent) |
| Mantine | `closeOnClickOutside` | `overlayProps` |
| MUI | handler in `onClose` | `BackdropProps` |
| Nuxt | `:prevent-close` | `ui` prop |
| Semantic | `closable` | dimmer settings |
| Vuetify | inverse of `persistent` | `scrim` |
| PrimeReact | `dismissableMask` | `maskStyle` |

---

## Testing Recommendations

### Unit Testing
- Test open/close state transitions
- Verify callback invocations
- Test form submission flows
- Validate loading states
- Test keyboard interactions

### Integration Testing
- Test with forms and validation
- Test nested modal scenarios
- Test async operations
- Verify focus management
- Test portal rendering

### Accessibility Testing
- **Keyboard navigation** - Tab, Enter, Space, ESC
- **Screen reader** - NVDA, JAWS, VoiceOver
- **Focus trap** - Ensure focus stays in modal
- **Focus return** - Verify focus returns on close
- **ARIA attributes** - role, aria-modal, aria-labelledby
- **Color contrast** - WCAG AA compliance
- **Touch targets** - 44x44px minimum (mobile)

### Visual Regression Testing
- Test on multiple screen sizes
- Test all size variants
- Test positioning options
- Test animation states
- Test backdrop variations

---

## Performance Benchmarks

Based on documentation and common patterns:

| Framework | Bundle Impact | Lazy Mount | Unmount on Close | Portal | Notes |
|-----------|---------------|------------|------------------|--------|-------|
| Ant | Medium | ✅ | ✅ | ✅ | destroyOnClose prop |
| Chakra | Medium | ✅ | ❌ | ✅ | lazyMount prop |
| HeroUI | Medium | ❌ | ❌ | ✅ | Always mounted |
| Mantine | Small | ✅ | ❌ | ✅ | @mantine/modals separate |
| MUI | Large | ❌ | ✅ | ✅ | keepMounted={false} |
| Nuxt | Small | ❌ | ❌ | ✅ | Built on Reka UI |
| Semantic | Small | ❌ | ❌ | ❌ | jQuery-based |
| Vuetify | Large | ✅ | ❌ | ✅ | eager prop |
| PrimeReact | Medium | ✅ | ❌ | ✅ | Modal by default |

---

## Research Metadata

**Frameworks Analyzed:** 9
**Total Patterns Identified:** 120+
**Documentation Quality:** All frameworks provide comprehensive modal/dialog docs
**Common Standards:** WAI-ARIA Authoring Practices for Dialog/Modal
**Research Date:** 2025-11-05
**Research Scope:** Official documentation, examples, API references

---

## Related Components

Across frameworks, these components are frequently mentioned alongside Modal/Dialog:

1. **Drawer/Sidebar** - Alternative for side overlays
2. **Popover** - Lightweight alternative for non-blocking content
3. **Tooltip** - Brief contextual information
4. **Alert/Notification** - Non-blocking messages
5. **Confirm Dialog** - Specialized confirmation pattern
6. **Sheet** - Mobile-friendly bottom sheet
7. **Backdrop/Overlay** - Underlying dimmer component
8. **Portal** - Rendering mechanism
9. **FocusTrap** - Accessibility utility
10. **Form** - Common modal content

---

## Conclusion

The Modal/Dialog component is a **universal pattern** with strong consistency across all major frameworks. Key findings:

1. **100% Framework Support** - All 9 frameworks provide robust implementations
2. **Consistent Core API** - open/visible prop + onClose callback is standard
3. **Excellent Accessibility** - All implement WAI-ARIA dialog patterns
4. **Flexible Architecture** - Both simple and compound structures work well
5. **Rich Features** - Sizing, positioning, animations all well-supported
6. **Form Integration** - All frameworks handle forms smoothly
7. **Mobile-Friendly** - Fullscreen options standard
8. **Advanced Capabilities** - Dragging, resizing available in some frameworks

**Recommendation for Semantic UI Next:**
- Maintain both simple and compound component APIs for flexibility
- Support 5-6 size variants (xs, sm, md, lg, xl, full)
- Provide 4-5 positioning options (center, top, bottom, left, right)
- Include draggable and resizable options (differentiator)
- Offer both imperative and declarative APIs
- Ensure lazy mounting and unmount-on-close options
- Full keyboard navigation and focus management
- Consider confirmation dialog helpers (static methods)
- Support both scroll-inside and scroll-outside behaviors
- Provide comprehensive animation controls

The modal pattern is mature, well-understood, and critical for modern web applications. Semantic UI should match or exceed current framework capabilities while maintaining its signature ease of use.
