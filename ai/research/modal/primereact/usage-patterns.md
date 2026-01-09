# PrimeReact - Dialog Component

## Component Overview

The PrimeReact Dialog component is a sophisticated overlay container used to display content in a modal or modeless window. It provides a flexible, feature-rich solution for presenting information, forms, confirmations, and other content that requires user attention or interaction. The component excels at handling complex interactions with support for dragging, resizing, animations, and multiple positioning options.

**Common Use Cases:**
- Modal dialogs for confirmations and alerts
- Form submission and data entry windows
- Detail views and inspectors
- Feature showcases and tutorials
- Settings and configuration panels
- Dynamic content overlays
- Multi-step workflows and wizards

---

## Usage Patterns

### Basic Usage

The fundamental Dialog implementation requires managing visibility state and handling the `onHide` callback to update visibility when the user closes the dialog.

```jsx
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function BasicDialog() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        label="Show Dialog"
        icon="pi pi-external-link"
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="Dialog Title"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <p>This is the dialog content.</p>
      </Dialog>
    </>
  );
}
```

**Key Pattern**: The `visible` prop controls dialog visibility, and `onHide` is the required callback to handle close events. This controlled pattern ensures the parent component always manages state.

### Variants/Styles

PrimeReact Dialog supports multiple styling approaches and visual configurations:

#### 1. **Modal Dialog** (Default)
```jsx
<Dialog
  header="Modal Dialog"
  visible={visible}
  modal={true}
  style={{ width: '50vw' }}
  onHide={() => setVisible(false)}
>
  Content with background mask
</Dialog>
```

Modal dialogs display with a semi-transparent background mask that prevents interaction with content behind the dialog.

#### 2. **Modeless Dialog**
```jsx
<Dialog
  header="Modeless Dialog"
  visible={visible}
  modal={false}
  style={{ width: '50vw' }}
  onHide={() => setVisible(false)}
>
  Content without background mask
</Dialog>
```

Modeless dialogs allow interaction with background content while the dialog remains open.

#### 3. **Dismissable Mask** (Click outside to close)
```jsx
<Dialog
  header="Dismissable Dialog"
  visible={visible}
  modal={true}
  dismissableMask={true}
  style={{ width: '50vw' }}
  onHide={() => setVisible(false)}
>
  Click the background to close this dialog
</Dialog>
```

#### 4. **Close on Escape**
```jsx
<Dialog
  header="Close on Escape"
  visible={visible}
  closeOnEscape={true}
  style={{ width: '50vw' }}
  onHide={() => setVisible(false)}
>
  Press Escape key to close
</Dialog>
```

### States

Dialog manages several interactive states:

#### 1. **Visible/Hidden State**
```jsx
const [visible, setVisible] = useState(false);

<Dialog visible={visible} onHide={() => setVisible(false)}>
  {/* Content */}
</Dialog>
```

#### 2. **Closable State** (Show/hide close button)
```jsx
<Dialog
  closable={true}  // Default: true
  header="Dialog"
  visible={visible}
  onHide={() => setVisible(false)}
>
  Content with close button (X)
</Dialog>
```

#### 3. **Maximized State**
```jsx
const [visible, setVisible] = useState(false);
const [maximized, setMaximized] = useState(false);

<Dialog
  header="Maximizable Dialog"
  visible={visible}
  maximizable={true}
  modal={true}
  onMaximize={(e) => setMaximized(e.maximized)}
  onHide={() => setVisible(false)}
>
  Content
</Dialog>
```

The `onMaximize` event receives an event object with a `maximized` boolean property indicating the current state.

#### 4. **Drag State**
```jsx
<Dialog
  header="Draggable Dialog"
  visible={visible}
  draggable={true}  // Default: true
  onHide={() => setVisible(false)}
>
  Drag by the header to reposition
</Dialog>
```

#### 5. **Resize State**
```jsx
const [visible, setVisible] = useState(false);
const [resizing, setResizing] = useState(false);

<Dialog
  header="Resizable Dialog"
  visible={visible}
  resizable={true}  // Default: true
  onResizeStart={() => setResizing(true)}
  onResizeEnd={() => setResizing(false)}
  onHide={() => setVisible(false)}
>
  Resize from the edges and corners
</Dialog>
```

### Sizing Options

#### 1. **Fixed Width**
```jsx
<Dialog
  header="Fixed Width"
  visible={visible}
  style={{ width: '400px' }}
  onHide={() => setVisible(false)}
>
  Content
</Dialog>
```

#### 2. **Percentage Width**
```jsx
<Dialog
  header="Responsive Width"
  visible={visible}
  style={{ width: '80vw' }}
  onHide={() => setVisible(false)}
>
  Content
</Dialog>
```

#### 3. **Responsive Breakpoints**
```jsx
<Dialog
  header="Breakpoint Responsive"
  visible={visible}
  breakpoints={{ '960px': '75vw', '640px': '90vw' }}
  style={{ width: '50vw' }}
  onHide={() => setVisible(false)}
>
  Adjusts width based on viewport
</Dialog>
```

This pattern defines max-width for each breakpoint, automatically adjusting the dialog width as the viewport changes.

#### 4. **Height Management**
```jsx
<Dialog
  header="Height Management"
  visible={visible}
  style={{ width: '50vw', height: '300px' }}
  contentStyle={{ maxHeight: '300px', overflowY: 'auto' }}
  onHide={() => setVisible(false)}
>
  Long content with scrolling
</Dialog>
```

### Layout & Positioning

#### 1. **Center Position** (Default)
```jsx
<Dialog
  header="Centered Dialog"
  visible={visible}
  position="center"
  onHide={() => setVisible(false)}
>
  Content
</Dialog>
```

#### 2. **Edge Positions**
```jsx
<Dialog
  header="Top Position"
  visible={visible}
  position="top"  // 'bottom', 'left', 'right'
  onHide={() => setVisible(false)}
>
  Positioned at screen edge
</Dialog>
```

#### 3. **Corner Positions**
```jsx
<Dialog
  header="Corner Dialog"
  visible={visible}
  position="top-left"  // 'top-right', 'bottom-left', 'bottom-right'
  onHide={() => setVisible(false)}
>
  Positioned at corner
</Dialog>
```

Available positions: `"center"`, `"top"`, `"bottom"`, `"left"`, `"right"`, `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`

#### 4. **Custom Positioning with Dragging**
```jsx
<Dialog
  header="Custom Position"
  visible={visible}
  draggable={true}
  position="top-left"
  minX={0}
  minY={0}
  onHide={() => setVisible(false)}
>
  Position with drag constraints
</Dialog>
```

`minX` and `minY` set minimum coordinates for dragging boundaries.

### Content & Structure

#### 1. **Header**
```jsx
<Dialog
  header={<div className="flex items-center gap-2">
    <i className="pi pi-exclamation-triangle"></i>
    Confirmation Required
  </div>}
  visible={visible}
  onHide={() => setVisible(false)}
>
  Content
</Dialog>
```

#### 2. **Footer**
```jsx
<Dialog
  header="Dialog with Footer"
  visible={visible}
  footer={
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={() => {
          // Save logic
          setVisible(false);
        }}
      />
    </div>
  }
  onHide={() => setVisible(false)}
>
  Content
</Dialog>
```

#### 3. **Header and Footer**
```jsx
<Dialog
  header="Complete Dialog"
  visible={visible}
  footer={renderFooter()}
  style={{ width: '50vw' }}
  onHide={() => setVisible(false)}
>
  <p>Main content area</p>
</Dialog>

function renderFooter() {
  return (
    <div>
      <Button label="Close" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
      <Button label="Save" icon="pi pi-check" onClick={() => handleSave()} />
    </div>
  );
}
```

### Interactive Features

#### 1. **Visible State Management**
```jsx
const [visible, setVisible] = useState(false);

// Control visibility from parent
<Dialog visible={visible} onHide={() => setVisible(false)}>
  {/* Content */}
</Dialog>
```

#### 2. **onHide Callback** (Required)
```jsx
<Dialog
  onHide={() => {
    // Handle close action
    setVisible(false);
    // Additional cleanup logic
    resetForm();
  }}
  visible={visible}
>
  Content
</Dialog>
```

#### 3. **onShow Callback**
```jsx
<Dialog
  header="Dialog"
  visible={visible}
  onShow={() => {
    // Perform actions when dialog opens
    console.log('Dialog opened');
    focusFirstInput();
  }}
  onHide={() => setVisible(false)}
>
  Content
</Dialog>
```

#### 4. **Closable Toggle** (Show/hide close button)
```jsx
<Dialog
  closable={true}  // Shows X button in header
  header="Dialog"
  visible={visible}
  onHide={() => setVisible(false)}
>
  Content
</Dialog>
```

#### 5. **Modal vs Modeless**
```jsx
// Modal: blocks background interaction
<Dialog modal={true} visible={visible} onHide={() => setVisible(false)}>
  Content
</Dialog>

// Modeless: allows background interaction
<Dialog modal={false} visible={visible} onHide={() => setVisible(false)}>
  Content
</Dialog>
```

#### 6. **Draggable**
```jsx
<Dialog
  draggable={true}  // Default: true
  header="Draggable Dialog"
  visible={visible}
  onHide={() => setVisible(false)}
>
  Drag by header to move
</Dialog>
```

#### 7. **Resizable**
```jsx
<Dialog
  resizable={true}  // Default: true
  header="Resizable Dialog"
  visible={visible}
  onResizeStart={() => console.log('Resize started')}
  onResize={(e) => console.log('Resizing', e)}
  onResizeEnd={() => console.log('Resize ended')}
  onHide={() => setVisible(false)}
>
  Resize from edges and corners
</Dialog>
```

### Animation & Transitions

#### 1. **Default Animation**
```jsx
<Dialog
  header="Animated Dialog"
  visible={visible}
  // Animation enabled by default
  onHide={() => setVisible(false)}
>
  Content
</Dialog>
```

PrimeReact uses react-transition-group internally to provide smooth animations.

#### 2. **Disable Animation**
```jsx
<Dialog
  header="No Animation"
  visible={visible}
  transitionOptions="none"  // Disable animations
  onHide={() => setVisible(false)}
>
  Content
</Dialog>
```

#### 3. **Custom Transition**
```jsx
<Dialog
  header="Custom Transition"
  visible={visible}
  transitionOptions={{
    timeout: 150,  // Animation duration in ms
    classNames: 'custom-dialog'  // Custom CSS class
  }}
  onHide={() => setVisible(false)}
>
  Content
</Dialog>
```

### Integration Patterns

#### 1. **Form Integration**
```jsx
const [visible, setVisible] = useState(false);
const [formData, setFormData] = useState({});

const handleSubmit = () => {
  // Submit form
  console.log(formData);
  setVisible(false);
};

return (
  <>
    <Button label="Open Form" onClick={() => setVisible(true)} />

    <Dialog
      header="User Form"
      visible={visible}
      modal={true}
      onHide={() => setVisible(false)}
      footer={
        <div>
          <Button label="Cancel" onClick={() => setVisible(false)} className="p-button-text" />
          <Button label="Submit" onClick={handleSubmit} />
        </div>
      }
    >
      <div className="p-field">
        <label>Name</label>
        <InputText
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      <div className="p-field">
        <label>Email</label>
        <InputText
          value={formData.email || ''}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>
    </Dialog>
  </>
);
```

#### 2. **Async Operations**
```jsx
const [visible, setVisible] = useState(false);
const [loading, setLoading] = useState(false);

const handleAsyncAction = async () => {
  setLoading(true);
  try {
    const result = await fetchData();
    // Process result
    setVisible(false);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

return (
  <Dialog
    header="Async Operation"
    visible={visible}
    onHide={() => setVisible(false)}
    footer={
      <Button
        label="Process"
        onClick={handleAsyncAction}
        loading={loading}
      />
    }
  >
    Loading indicator shown during async operation
  </Dialog>
);
```

#### 3. **Nested Dialogs**
```jsx
const [dialog1, setDialog1] = useState(false);
const [dialog2, setDialog2] = useState(false);

return (
  <>
    <Button label="Open Dialog 1" onClick={() => setDialog1(true)} />

    <Dialog
      header="Dialog 1"
      visible={dialog1}
      onHide={() => setDialog1(false)}
    >
      <Button label="Open Dialog 2" onClick={() => setDialog2(true)} />

      <Dialog
        header="Dialog 2"
        visible={dialog2}
        onHide={() => setDialog2(false)}
        appendTo={document.body}  // Render nested dialog to body
      >
        Nested dialog content
      </Dialog>
    </Dialog>
  </>
);
```

### Accessibility Features

#### 1. **Keyboard Navigation**
- **Escape Key**: Closes the dialog (if `closeOnEscape={true}`)
- **Tab Key**: Cycles through focusable elements within the dialog
- **Focus Trap**: Focus automatically returns to trigger element when dialog closes

```jsx
<Dialog
  header="Accessible Dialog"
  visible={visible}
  closeOnEscape={true}  // Enable Escape to close
  onHide={() => setVisible(false)}
>
  Content with focusable elements
</Dialog>
```

#### 2. **ARIA Attributes**
The Dialog component automatically applies:
- `role="dialog"` on the dialog container
- `aria-modal="true"` for modal dialogs
- `aria-labelledby` linking to the header
- `aria-describedby` for content description

#### 3. **Screen Reader Support**
```jsx
<Dialog
  header="Important Information"
  id="dialog-info"
  visible={visible}
  aria-describedby="dialog-description"
  onHide={() => setVisible(false)}
>
  <p id="dialog-description">
    This dialog contains important information that requires your attention.
  </p>
</Dialog>
```

#### 4. **Focus Management**
```jsx
const contentRef = useRef(null);

<Dialog
  header="Dialog"
  visible={visible}
  onShow={() => {
    // Focus first interactive element when dialog opens
    const firstButton = contentRef.current?.querySelector('button');
    firstButton?.focus();
  }}
  onHide={() => setVisible(false)}
>
  <div ref={contentRef}>
    <Button label="Action" />
  </div>
</Dialog>
```

#### 5. **Semantic HTML**
```jsx
<Dialog
  header="Confirmation"
  visible={visible}
  onHide={() => setVisible(false)}
>
  <p>Are you sure you want to delete this item?</p>

  <div className="flex gap-2">
    <Button
      label="Cancel"
      onClick={() => setVisible(false)}
      aria-label="Cancel deletion"
    />
    <Button
      label="Delete"
      severity="danger"
      onClick={() => handleDelete()}
      aria-label="Confirm deletion"
    />
  </div>
</Dialog>
```

---

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | boolean | false | Controls whether the dialog is displayed |
| `header` | string \| React.ReactNode | undefined | Title or header content of the dialog |
| `footer` | string \| React.ReactNode | undefined | Footer content, typically action buttons |
| `modal` | boolean | true | Shows semi-transparent background mask |
| `style` | object | undefined | Inline CSS styles (e.g., `{ width: '50vw' }`) |
| `contentStyle` | object | undefined | CSS styles for the dialog content container |
| `breakpoints` | object | undefined | Responsive width values for different screen sizes |
| `appendTo` | 'self' \| HTMLElement | document.body | DOM element where the overlay is rendered |
| `position` | string | 'center' | Dialog position: center, top, bottom, left, right, top-left, top-right, bottom-left, bottom-right |
| `draggable` | boolean | true | Allows dragging the dialog by its header |
| `resizable` | boolean | true | Allows resizing the dialog from edges and corners |
| `closable` | boolean | true | Shows close (X) button in the header |
| `dismissableMask` | boolean | false | Closes dialog when clicking the background mask |
| `closeOnEscape` | boolean | false | Closes dialog when Escape key is pressed |
| `minimizable` | boolean | false | Shows minimize button in header |
| `maximizable` | boolean | false | Shows maximize button in header |
| `minX` | number | 0 | Minimum X coordinate for dragging |
| `minY` | number | 0 | Minimum Y coordinate for dragging |
| `minWidth` | number | 150 | Minimum width for resizing |
| `minHeight` | number | 150 | Minimum height for resizing |
| `transitionOptions` | object | undefined | Animation configuration |
| `transitionTimeout` | number | 300 | Animation duration in milliseconds |
| `className` | string | undefined | CSS class for the dialog container |
| `headerClassName` | string | undefined | CSS class for the header |
| `contentClassName` | string | undefined | CSS class for the content area |
| `footerClassName` | string | undefined | CSS class for the footer |
| `maskClassName` | string | undefined | CSS class for the background mask |
| `onShow` | function | undefined | Callback when dialog opens |
| `onHide` | function | undefined | Callback when dialog closes (required) |
| `onMaximize` | function | undefined | Callback when maximize button is clicked |
| `onResizeStart` | function | undefined | Callback when resize starts |
| `onResize` | function | undefined | Callback during resize |
| `onResizeEnd` | function | undefined | Callback when resize ends |
| `onDragStart` | function | undefined | Callback when drag starts |
| `onDragEnd` | function | undefined | Callback when drag ends |
| `focusTrap` | boolean | true | Traps focus within the dialog |
| `rtl` | boolean | false | Right-to-left layout support |
| `showHeader` | boolean | true | Shows the header section |
| `baseZIndex` | number | 0 | Base z-index for layering |
| `blockScroll` | boolean | false | Prevents scrolling of background when dialog is open |
| `autoZIndex` | boolean | true | Automatically manages z-index for multiple dialogs |

---

## Code Examples

### Example 1: Basic Dialog

```jsx
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function BasicDialog() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        label="Show Dialog"
        icon="pi pi-external-link"
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="Welcome"
        visible={visible}
        style={{ width: '50vw' }}
        modal
        onHide={() => setVisible(false)}
      >
        <p>This is a basic dialog component.</p>
      </Dialog>
    </>
  );
}
```

### Example 2: Confirmation Dialog

```jsx
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function ConfirmationDialog() {
  const [visible, setVisible] = useState(false);

  const handleConfirm = () => {
    console.log('Action confirmed');
    setVisible(false);
  };

  const footer = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Confirm"
        icon="pi pi-check"
        onClick={handleConfirm}
        autoFocus
      />
    </div>
  );

  return (
    <>
      <Button
        label="Delete Item"
        severity="danger"
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="Confirm Delete"
        visible={visible}
        modal
        footer={footer}
        onHide={() => setVisible(false)}
      >
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </Dialog>
    </>
  );
}
```

### Example 3: Form Dialog

```jsx
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

export default function FormDialog() {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setVisible(false);
    setFormData({ name: '', email: '' });
  };

  const footer = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Submit"
        icon="pi pi-check"
        onClick={handleSubmit}
      />
    </div>
  );

  return (
    <>
      <Button
        label="Open Form"
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="User Information"
        visible={visible}
        style={{ width: '50vw' }}
        modal
        footer={footer}
        onHide={() => setVisible(false)}
      >
        <div className="p-field p-col-12">
          <label>Name</label>
          <InputText
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter your name"
          />
        </div>

        <div className="p-field p-col-12">
          <label>Email</label>
          <InputText
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Enter your email"
            type="email"
          />
        </div>
      </Dialog>
    </>
  );
}
```

### Example 4: Responsive Dialog with Breakpoints

```jsx
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function ResponsiveDialog() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        label="Show Responsive Dialog"
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="Responsive Dialog"
        visible={visible}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '640px': '90vw' }}
        modal
        onHide={() => setVisible(false)}
      >
        <p>This dialog adjusts its width based on screen size using breakpoints.</p>
      </Dialog>
    </>
  );
}
```

### Example 5: Draggable and Resizable Dialog

```jsx
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function DraggableResizableDialog() {
  const [visible, setVisible] = useState(false);
  const [resizing, setResizing] = useState(false);

  return (
    <>
      <Button
        label="Show Dialog"
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="Draggable & Resizable"
        visible={visible}
        draggable
        resizable
        style={{ width: '50vw', height: '300px' }}
        position="top-left"
        modal
        onResizeStart={() => setResizing(true)}
        onResizeEnd={() => setResizing(false)}
        onHide={() => setVisible(false)}
      >
        <p>Drag the header to move, resize from edges and corners.</p>
        {resizing && <p>Currently resizing...</p>}
      </Dialog>
    </>
  );
}
```

---

## Accessibility Notes

**Focus Management:**
- Dialog traps focus automatically
- First focusable element receives focus when dialog opens
- Focus returns to trigger element when dialog closes
- Tab navigation cycles through dialog elements only

**ARIA Implementation:**
- Automatic `role="dialog"` applied
- `aria-modal="true"` for modal dialogs
- Header linked via `aria-labelledby`
- Screen readers announce dialog opening

**Keyboard Support:**
- **Escape**: Close dialog (when `closeOnEscape={true}`)
- **Tab**: Navigate through focusable elements
- **Shift+Tab**: Navigate backwards
- **Enter**: Activate buttons

**Color Contrast:**
- Ensure button text meets WCAG AA standards
- Test with browser accessibility checker
- Verify focus indicators are visible

**Content Readability:**
- Use semantic HTML for content
- Provide descriptive labels for form inputs
- Use appropriate heading hierarchy
- Ensure text is sufficiently large

---

## Common Patterns

### 1. **Confirmation Dialogs**
Typically used for destructive actions (delete, logout), presenting a clear choice between confirming or canceling.

### 2. **Alert/Notification Dialogs**
Simple dialogs presenting information with an acknowledgment button.

### 3. **Form Dialogs**
Collecting user input through forms embedded in dialogs, commonly used for creating or editing records.

### 4. **Multi-Step Dialogs**
Wizards or stepped processes where users progress through multiple stages within a single dialog.

### 5. **Position-Specific Dialogs**
Dialogs positioned at specific screen edges or corners for context-aware interactions.

### 6. **Draggable Overlays**
Floating windows allowing users to reposition and resize, similar to desktop applications.

### 7. **Modal vs Modeless**
Modal dialogs block background interaction (standard for critical actions), while modeless dialogs allow continued background interaction.

### 8. **Nested Dialogs**
Multiple dialogs layered on top of each other, common in complex workflows.

---

## Related Components

- **ConfirmDialog**: Confirmation dialog using a service-based API
- **Popover**: Non-modal overlay positioned relative to trigger elements
- **Drawer**: Side panel overlay alternative to center dialogs
- **Toast**: Non-intrusive notifications
- **ConfirmPopup**: Contextual confirmation overlay
- **ContextMenu**: Right-click triggered action menu
- **Tooltip**: Lightweight information overlay

---

## Notes

- The `onHide` callback is **required** to manage dialog visibility state
- Dialog uses **react-transition-group** for animations internally
- Multiple dialogs automatically manage z-index with `autoZIndex={true}`
- The `blockScroll` prop prevents background scrolling when dialog is open
- Nested dialogs should have `appendTo={document.body}` to render outside parent dialog
- Responsive breakpoints allow graceful adaptation to mobile devices
- The dialog is fully accessible by default with automatic ARIA attributes

---

Research completed: 2025-11-05
Component: Dialog
Framework: PrimeReact
Documentation: https://primereact.org/dialog/
