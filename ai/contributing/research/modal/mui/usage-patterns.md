# MUI - Modal & Dialog Usage Patterns

> Last Modified: 2025-11-05

## Component URLs
- Modal: https://mui.com/material-ui/react-modal/
- Dialog: https://mui.com/material-ui/react-dialog/

Status: ✅ Referenced from Documentation (Direct fetch unavailable, documentation based on MUI v5+ standards)
Version: Material UI v5+ (Current)
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - MUI provides excellent documentation for both Modal (lower-level primitive) and Dialog (higher-level composed component). Both include extensive examples, props references, API documentation, theming guidance, and accessibility considerations.

## Component Definition

### Modal (Lower-Level Primitive)
- **Core purpose**: Provides a low-level, unstyled modal container that renders content above the main page, typically with a backdrop overlay
- **Mental model**: A fundamental building block for overlay UI patterns with focus trapping, backdrop click handling, and escape key dismissal
- **Semantic meaning**: Creates a modal context where user must interact with the overlay content before returning to main content
- **Use case**: Base component for creating custom modal experiences, advanced customization requirements

### Dialog (Higher-Level Component)
- **Core purpose**: Material Design-compliant modal dialog component with pre-built structure (title, content, actions)
- **Mental model**: A specialized modal optimized for presenting content with a clear hierarchy and action buttons
- **Semantic meaning**: Communicates a focused interaction pattern with clear title, body content, and actionable buttons
- **Use case**: Confirmations, alerts, form dialogs, information dialogs following Material Design patterns

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

---

## Component Overview

### Modal vs Dialog Differences

| Aspect | Modal | Dialog |
|--------|-------|--------|
| **Level** | Low-level primitive | High-level composed component |
| **Styling** | Unstyled, minimal defaults | Pre-styled with Material Design |
| **Structure** | Simple container with content | Title, content, actions structure |
| **Use Case** | Custom overlays, advanced patterns | Standard dialogs, confirmations |
| **API Complexity** | Simple (open/children) | Rich (title, actions, transition) |
| **Content Structure** | Flexible, any content | Structured (DialogTitle, DialogContent, DialogActions) |
| **Backdrop** | Customizable or none | Default with customization |

---

## Usage Patterns

### Basic Usage

#### Basic Modal
```jsx
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const [open, setOpen] = React.useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  aria-labelledby="modal-title"
>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
  }}>
    <h2 id="modal-title">Modal Title</h2>
    <p>Modal content goes here</p>
  </Box>
</Modal>
```

#### Basic Dialog
```jsx
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const [open, setOpen] = React.useState(false);

<Dialog open={open} onClose={() => setOpen(false)}>
  <DialogTitle>Dialog Title</DialogTitle>
  <DialogContent>
    Dialog content goes here
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={() => setOpen(false)} variant="contained">
      Confirm
    </Button>
  </DialogActions>
</Dialog>
```

### Variants/Styles

#### Modal Styling Options
```jsx
// Style via Box sx prop (custom styling required)
<Modal open={open} onClose={handleClose}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  }}>
    Content
  </Box>
</Modal>

// Dark themed modal
<Modal open={open} onClose={handleClose}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1e1e1e',
    color: '#fff',
    p: 4,
  }}>
    Content
  </Box>
</Modal>
```

#### Dialog Variants/Styles
```jsx
// Simple alert dialog
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Are you sure?</DialogTitle>
  <DialogContent>
    <p>This action cannot be undone.</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm} color="error">Delete</Button>
  </DialogActions>
</Dialog>

// Form dialog
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Edit Profile</DialogTitle>
  <DialogContent>
    <TextField fullWidth label="Name" defaultValue="John" sx={{ mt: 2 }} />
    <TextField fullWidth label="Email" defaultValue="john@example.com" sx={{ mt: 2 }} />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleSave} variant="contained">Save</Button>
  </DialogActions>
</Dialog>

// Info dialog with custom styling
<Dialog
  open={open}
  onClose={handleClose}
  sx={{
    '& .MuiDialog-paper': {
      backgroundColor: '#f0f4f8',
      borderRadius: 3,
    }
  }}
>
  <DialogTitle>Information</DialogTitle>
  <DialogContent>Content here</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>OK</Button>
  </DialogActions>
</Dialog>
```

### States

#### Modal States
| State | Property | Default | Details |
|-------|----------|---------|---------|
| **Open/Closed** | `open` | `false` | Controls visibility of modal |
| **Disabled** | `disableAutoFocus` | `false` | Disables automatic focus management |
| **Escape Key** | `disableEscapeKeyDown` | `false` | Disables closing on Escape key |
| **Backdrop Click** | `disableBackdropClick` | `false` (Dialog) | Disables closing when clicking backdrop |
| **Backdrop** | `BackdropComponent` | `Backdrop` | Customize or hide backdrop |
| **Focus Trap** | Built-in | N/A | Automatic focus trapping within modal |

#### Dialog States
```jsx
// Loading state (manual implementation)
const [loading, setLoading] = React.useState(false);

<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogContent>Proceed with the action?</DialogContent>
  <DialogActions>
    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
    <Button
      onClick={async () => {
        setLoading(true);
        await performAction();
        setLoading(false);
        handleClose();
      }}
      variant="contained"
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Confirm'}
    </Button>
  </DialogActions>
</Dialog>

// Disabled submit state
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Form</DialogTitle>
  <DialogContent>
    <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button
      onClick={handleSubmit}
      variant="contained"
      disabled={!name.trim()} // Disabled when empty
    >
      Submit
    </Button>
  </DialogActions>
</Dialog>

// Error state
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Error</DialogTitle>
  <DialogContent>
    <Alert severity="error">An error occurred while processing your request</Alert>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>OK</Button>
  </DialogActions>
</Dialog>
```

### Sizing Options

#### Modal Sizes
```jsx
// Small modal (custom positioning)
<Modal open={open} onClose={handleClose}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,  // Small
    bgcolor: 'background.paper',
    p: 3,
  }}>
    Content
  </Box>
</Modal>

// Medium modal (default size)
<Modal open={open} onClose={handleClose}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,  // Medium
    bgcolor: 'background.paper',
    p: 3,
  }}>
    Content
  </Box>
</Modal>

// Large modal
<Modal open={open} onClose={handleClose}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,  // Large
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    overflow: 'auto',
    p: 3,
  }}>
    Content
  </Box>
</Modal>

// Full screen modal
<Modal open={open} onClose={handleClose}>
  <Box sx={{
    position: 'absolute',
    width: '100%',
    height: '100%',
    bgcolor: 'background.paper',
    overflow: 'auto',
    p: 3,
  }}>
    Content
  </Box>
</Modal>
```

#### Dialog Sizes
```jsx
// Small dialog (via maxWidth)
<Dialog open={open} onClose={handleClose} maxWidth="xs">
  <DialogTitle>Small Dialog</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>

// Medium dialog (default)
<Dialog open={open} onClose={handleClose} maxWidth="sm">
  <DialogTitle>Dialog</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>

// Large dialog
<Dialog open={open} onClose={handleClose} maxWidth="md">
  <DialogTitle>Large Dialog</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>

// Full width dialog
<Dialog
  open={open}
  onClose={handleClose}
  maxWidth="lg"
  fullWidth
>
  <DialogTitle>Full Width Dialog</DialogTitle>
  <DialogContent>Content spanning full width</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>
```

### Layout & Positioning

#### Modal Positioning
```jsx
// Center top
<Modal open={open} onClose={handleClose}>
  <Box sx={{
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 3,
  }}>
    Top-aligned modal
  </Box>
</Modal>

// Center (default)
<Modal open={open} onClose={handleClose}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 3,
  }}>
    Centered modal
  </Box>
</Modal>

// Right side
<Modal open={open} onClose={handleClose}>
  <Box sx={{
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: 400,
    bgcolor: 'background.paper',
    p: 3,
    overflow: 'auto',
  }}>
    Side drawer style
  </Box>
</Modal>

// Bottom sheet
<Modal open={open} onClose={handleClose}>
  <Box sx={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    bgcolor: 'background.paper',
    p: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60vh',
    overflow: 'auto',
  }}>
    Bottom sheet content
  </Box>
</Modal>
```

#### Dialog Positioning (via Transition)
```jsx
import Grow from '@mui/material/Grow';

// Dialog at specific position via Grow transform
<Dialog
  open={open}
  onClose={handleClose}
  TransitionComponent={Grow}
  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
>
  <DialogTitle>Dialog</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>
```

### Content & Structure

#### Modal Content Structure
Modal is flexible and accepts any content:
```jsx
// Simple text content
<Modal open={open} onClose={handleClose}>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    <h2>Title</h2>
    <p>Content paragraph</p>
  </Box>
</Modal>

// Rich content with multiple elements
<Modal open={open} onClose={handleClose}>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    <h2>Modal Title</h2>
    <p>Descriptive text</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </Box>
</Modal>

// Content with image
<Modal open={open} onClose={handleClose}>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    <img src="/image.jpg" alt="Preview" style={{ width: '100%' }} />
    <p>Image caption or description</p>
  </Box>
</Modal>

// Complex nested content
<Modal open={open} onClose={handleClose}>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    <Card>
      <CardHeader title="Card Title" />
      <CardContent>
        <TextField fullWidth label="Input" />
      </CardContent>
      <CardActions>
        <Button>Action</Button>
      </CardActions>
    </Card>
  </Box>
</Modal>
```

#### Dialog Content Structure (Recommended)
Dialog has specialized sub-components:
```jsx
// Standard dialog structure
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Dialog Title</DialogTitle>

  <DialogContent>
    <DialogContentText>
      Descriptive text about the dialog purpose.
    </DialogContentText>
    {/* Form fields, content, etc. */}
  </DialogContent>

  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm} variant="contained">
      Confirm
    </Button>
  </DialogActions>
</Dialog>

// Dialog with scrollable content
<Dialog
  open={open}
  onClose={handleClose}
  scroll="paper"  // or "body"
>
  <DialogTitle>Long Dialog</DialogTitle>
  <DialogContent dividers>
    {/* Content that scrolls */}
    {longContent}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>

// Dialog with forms
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Edit Item</DialogTitle>
  <DialogContent sx={{ pt: 2 }}>
    <TextField
      autoFocus
      fullWidth
      id="name"
      label="Item Name"
      type="text"
      variant="outlined"
      margin="normal"
    />
    <TextField
      fullWidth
      id="description"
      label="Description"
      type="text"
      variant="outlined"
      margin="normal"
      multiline
      rows={4}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleSave} variant="contained">Save</Button>
  </DialogActions>
</Dialog>

// Dialog with custom styling
<Dialog open={open} onClose={handleClose}>
  <DialogTitle sx={{ backgroundColor: '#f0f0f0' }}>Title</DialogTitle>
  <DialogContent sx={{ backgroundColor: '#fafafa' }}>
    Content
  </DialogContent>
  <DialogActions sx={{ backgroundColor: '#f0f0f0' }}>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>
```

### Interactive Features

#### Modal Interactivity
```jsx
// Backdrop click handling
<Modal
  open={open}
  onClose={handleClose}
  onBackdropClick={() => {
    console.log('Backdrop clicked');
    handleClose();
  }}
>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    Content
  </Box>
</Modal>

// Escape key handling
<Modal
  open={open}
  onClose={handleClose}
  onKeyDown={(e) => {
    if (e.key === 'Escape') {
      console.log('Escape pressed');
      handleClose();
    }
  }}
  disableEscapeKeyDown={false}
>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    Content
  </Box>
</Modal>

// No backdrop click (requires manual close)
<Modal
  open={open}
  onClose={handleClose}
  disableBackdropClick={true}  // Note: deprecated, use onBackdropClick
>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    Content
    <button onClick={handleClose}>Close</button>
  </Box>
</Modal>

// No backdrop (transparent overlay)
<Modal
  open={open}
  onClose={handleClose}
  BackdropComponent={false}
>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    Content
  </Box>
</Modal>

// Custom backdrop styling
<Modal
  open={open}
  onClose={handleClose}
  slotProps={{
    backdrop: {
      sx: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }
    }
  }}
>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    Content
  </Box>
</Modal>
```

#### Dialog Interactivity
```jsx
// Confirm dialog
const [open, setOpen] = React.useState(false);

<Dialog open={open} onClose={() => setOpen(false)}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <p>Are you sure you want to delete this item?</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpen(false)}>No</Button>
    <Button
      onClick={() => {
        handleDelete();
        setOpen(false);
      }}
      color="error"
    >
      Yes, Delete
    </Button>
  </DialogActions>
</Dialog>

// Async dialog with loading
const [open, setOpen] = React.useState(false);
const [loading, setLoading] = React.useState(false);

<Dialog open={open} onClose={() => !loading && setOpen(false)}>
  <DialogTitle>Save Changes</DialogTitle>
  <DialogContent>
    <p>Do you want to save your changes?</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpen(false)} disabled={loading}>
      Cancel
    </Button>
    <Button
      onClick={async () => {
        setLoading(true);
        await saveChanges();
        setLoading(false);
        setOpen(false);
      }}
      variant="contained"
      disabled={loading}
    >
      {loading ? 'Saving...' : 'Save'}
    </Button>
  </DialogActions>
</Dialog>

// Multi-step dialog
const [activeStep, setActiveStep] = React.useState(0);

<Dialog open={open} onClose={() => setOpen(false)}>
  <DialogTitle>
    Step {activeStep + 1} of 3
  </DialogTitle>
  <DialogContent>
    {activeStep === 0 && <Step1Content />}
    {activeStep === 1 && <Step2Content />}
    {activeStep === 2 && <Step3Content />}
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
      disabled={activeStep === 0}
    >
      Back
    </Button>
    <Button
      onClick={() => {
        if (activeStep === 2) {
          handleComplete();
          setOpen(false);
        } else {
          setActiveStep(activeStep + 1);
        }
      }}
    >
      {activeStep === 2 ? 'Finish' : 'Next'}
    </Button>
  </DialogActions>
</Dialog>
```

### Animation & Transitions

#### Modal Animations
Modal uses `Fade` transition by default:
```jsx
import Fade from '@mui/material/Fade';

// Default fade transition
<Modal
  open={open}
  onClose={handleClose}
>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    Content
  </Box>
</Modal>

// Custom transition - Grow
<Modal
  open={open}
  onClose={handleClose}
  TransitionComponent={Grow}
>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    Content
  </Box>
</Modal>

// Custom transition - Slide
import Slide from '@mui/material/Slide';

const transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

<Modal
  open={open}
  onClose={handleClose}
  TransitionComponent={transition}
  transitionDuration={500}
>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    Content
  </Box>
</Modal>

// No transition (immediate appearance)
<Modal
  open={open}
  onClose={handleClose}
  transitionDuration={0}
>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    Content
  </Box>
</Modal>
```

#### Dialog Animations
Dialog uses `Grow` transition by default:
```jsx
import Fade from '@mui/material/Fade';

// Default Grow animation
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Dialog</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>

// Custom transition - Fade
<Dialog
  open={open}
  onClose={handleClose}
  TransitionComponent={Fade}
  transitionDuration={300}
>
  <DialogTitle>Dialog</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>

// Custom transition - Slide
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

<Dialog
  open={open}
  onClose={handleClose}
  TransitionComponent={Transition}
  transitionDuration={500}
>
  <DialogTitle>Dialog</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>
```

### Integration Patterns

#### Form Integration
```jsx
// Form in Modal
const [formData, setFormData] = React.useState({ name: '', email: '' });

<Modal open={open} onClose={handleClose}>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    <h2>Edit Profile</h2>
    <TextField
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      label="Name"
    />
    <TextField
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      label="Email"
    />
    <button onClick={() => handleSubmit(formData)}>Save</button>
  </Box>
</Modal>

// Form in Dialog (cleaner structure)
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Edit Profile</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      fullWidth
      margin="dense"
      label="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <TextField
      fullWidth
      margin="dense"
      label="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleSubmit} variant="contained">Save</Button>
  </DialogActions>
</Dialog>
```

#### Nested Modals
```jsx
// Parent modal
const [parentOpen, setParentOpen] = React.useState(false);
const [childOpen, setChildOpen] = React.useState(false);

<Modal open={parentOpen} onClose={() => setParentOpen(false)}>
  <Box sx={{ position: 'absolute', /* positioning */ }}>
    <h2>Parent Modal</h2>
    <button onClick={() => setChildOpen(true)}>Open Nested Modal</button>

    {/* Nested modal */}
    <Modal open={childOpen} onClose={() => setChildOpen(false)}>
      <Box sx={{ position: 'absolute', /* positioning */ }}>
        <h3>Child Modal</h3>
        <p>This is nested within parent modal</p>
        <button onClick={() => setChildOpen(false)}>Close</button>
      </Box>
    </Modal>
  </Box>
</Modal>
```

#### Async Operations
```jsx
// Dialog with async confirmation
const [open, setOpen] = React.useState(false);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState('');

const handleConfirm = async () => {
  setLoading(true);
  setError('');
  try {
    await performAsyncOperation();
    setOpen(false);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

<Dialog open={open} onClose={() => !loading && setOpen(false)}>
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogContent>
    {error && <Alert severity="error">{error}</Alert>}
    <p>Proceed with the action?</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
    <Button
      onClick={handleConfirm}
      variant="contained"
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Confirm'}
    </Button>
  </DialogActions>
</Dialog>
```

---

## Key Properties/Props

### Modal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls visibility of the modal |
| `onClose` | `function` | — | Callback fired when modal should close |
| `children` | `ReactNode` | — | The content of the modal |
| `BackdropComponent` | `component` | `Backdrop` | Component to render as backdrop |
| `disableAutoFocus` | `boolean` | `false` | Disables automatic focus management |
| `disableEscapeKeyDown` | `boolean` | `false` | If true, Escape key will not close modal |
| `disablePortal` | `boolean` | `false` | Disables rendering in a Portal |
| `disableRestoreFocus` | `boolean` | `false` | Disables restoration of focus when modal closes |
| `container` | `HTMLElement \| function` | — | Element in which the modal will be mounted |
| `slotProps` | `object` | `{}` | Props applied to slot targets (backdrop, root) |
| `TransitionComponent` | `component` | `Fade` | Component for transition effect |
| `transitionDuration` | `number \| object` | — | Duration of transition in milliseconds |
| `aria-labelledby` | `string` | — | ID of element describing the modal |
| `aria-describedby` | `string` | — | ID of element with modal description |

### Dialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls visibility of the dialog |
| `onClose` | `function` | — | Callback fired when dialog should close |
| `children` | `ReactNode` | — | Content of the dialog (typically DialogTitle, DialogContent, DialogActions) |
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false` | `'sm'` | Determines max-width of the dialog |
| `fullWidth` | `boolean` | `false` | If true, dialog takes full width |
| `scroll` | `'paper' \| 'body'` | `'paper'` | Determine which element should scroll (title/actions fixed or scroll with content) |
| `TransitionComponent` | `component` | `Grow` | Component for transition effect |
| `transitionDuration` | `number \| object` | — | Duration of transition |
| `PaperComponent` | `component` | `Paper` | Component for the dialog paper |
| `PaperProps` | `object` | `{}` | Props applied to the Paper element |
| `BackdropComponent` | `component` | `Backdrop` | Component to render as backdrop |
| `disableEscapeKeyDown` | `boolean` | `false` | If true, Escape key will not close dialog |
| `aria-labelledby` | `string` | — | ID of element describing the dialog |
| `aria-describedby` | `string` | — | ID of element with dialog description |

### DialogTitle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Title content |
| `id` | `string` | — | ID for aria-labelledby |
| `sx` | `object` | `{}` | System style prop for customization |

### DialogContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content to display |
| `dividers` | `boolean` | `false` | If true, adds dividers above and below content |
| `sx` | `object` | `{}` | System style prop for customization |

### DialogContentText Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | The text content |
| `id` | `string` | — | ID for aria-describedby |

### DialogActions Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Action buttons |
| `disableSpacing` | `boolean` | `false` | If true, removes spacing between buttons |
| `sx` | `object` | `{}` | System style prop for customization |

---

## Code Examples

### Example 1: Basic Confirmation Dialog
```jsx
function ConfirmDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Delete Item
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              handleDelete();
              handleClose();
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
```

### Example 2: Custom Modal with Positioning
```jsx
function PositionedModal() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Modal
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '1px solid #ccc',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="modal-title">Custom Modal</h2>
          <p>This modal is positioned absolutely in the center of the screen.</p>
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}
```

### Example 3: Form Dialog with Validation
```jsx
function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = React.useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setOpen(false);
      setFormData({ name: '', email: '' });
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add User
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
```

### Example 4: Async Dialog with Loading State
```jsx
function AsyncDialog() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Operation successful');
      setOpen(false);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Save Changes
      </Button>

      <Dialog
        open={open}
        onClose={() => !loading && setOpen(false)}
      >
        <DialogTitle>Save Changes</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <DialogContentText>
            Are you sure you want to save these changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
```

### Example 5: Modal as Bottom Sheet
```jsx
function BottomSheetModal() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Sheet
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 3,
            maxHeight: '60vh',
            overflow: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Bottom Sheet</h2>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <p>Content here</p>
        </Box>
      </Modal>
    </>
  );
}
```

---

## Accessibility Features

### Keyboard Navigation
- **Escape Key**: Closes modal/dialog (unless disabled with `disableEscapeKeyDown`)
- **Tab Navigation**: Focus trapped within open dialog/modal
- **Enter Key**: Can trigger default button actions
- **Arrow Keys**: Navigate within dialog content as needed

### Screen Reader Support
```jsx
// Proper ARIA labeling
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <Box>
    <h2 id="modal-title">Modal Title</h2>
    <p id="modal-description">Detailed description of modal purpose</p>
  </Box>
</Modal>

// Dialog automatically associates title
<Dialog
  open={open}
  onClose={handleClose}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogTitle id="dialog-title">Dialog Title</DialogTitle>
  <DialogContent>
    <DialogContentText id="dialog-description">
      Dialog description for screen readers
    </DialogContentText>
  </DialogContent>
</Dialog>
```

### Focus Management
- **Auto Focus**: First focusable element receives focus when modal opens
- **Focus Trap**: Focus stays within modal until closed
- **Focus Restore**: Focus returns to trigger element when modal closes
- **Disable Auto Focus**: Use `disableAutoFocus={true}` if needed
- **Disable Restore**: Use `disableRestoreFocus={true}` if custom handling needed

### ARIA Attributes
- `aria-labelledby`: Points to dialog title element ID
- `aria-describedby`: Points to description element ID
- `aria-modal`: Automatically set to true for dialogs
- `role="dialog"`: Automatically applied

### Color Contrast
- Dialog text meets WCAG AA minimum contrast ratios
- Ensure custom modal content also meets contrast requirements
- Test with dark mode to ensure adequate contrast

### Touch Targets
- Dialog actions buttons are minimum 44x44px for touch
- Ensure adequate spacing between interactive elements

---

## Common Patterns

### Pattern: Alert Dialog
```jsx
<Dialog open={alertOpen} onClose={() => setAlertOpen(false)}>
  <DialogTitle>Alert</DialogTitle>
  <DialogContent>
    <Alert severity="warning">
      This is an important message
    </Alert>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setAlertOpen(false)}>OK</Button>
  </DialogActions>
</Dialog>
```

### Pattern: Confirmation Dialog
```jsx
<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogContent>
    <p>Please confirm this action</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
    <Button
      onClick={() => {
        handleAction();
        setConfirmOpen(false);
      }}
      variant="contained"
    >
      Confirm
    </Button>
  </DialogActions>
</Dialog>
```

### Pattern: Form Dialog
Use Dialog for form submission with structured layout:
```jsx
<Dialog open={formOpen} onClose={() => setFormOpen(false)}>
  <DialogTitle>Edit Item</DialogTitle>
  <DialogContent>
    <TextField fullWidth label="Name" margin="normal" />
    <TextField fullWidth label="Description" margin="normal" multiline rows={4} />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setFormOpen(false)}>Cancel</Button>
    <Button variant="contained">Save</Button>
  </DialogActions>
</Dialog>
```

### Pattern: Custom Modal Overlay
Use Modal for custom positioning and styling:
```jsx
<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
  <Box sx={{ position: 'absolute', /* custom positioning */ }}>
    <CustomContent />
  </Box>
</Modal>
```

### Pattern: Loading Dialog
```jsx
<Dialog open={loadingOpen} onClose={() => !isLoading && setLoadingOpen(false)}>
  <DialogContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <CircularProgress />
    <span>Loading...</span>
  </DialogContent>
</Dialog>
```

---

## Related Components

- **Dialog**: Higher-level component for structured modals
- **Modal**: Lower-level primitive for custom overlays
- **Backdrop**: Overlay element behind modal
- **Drawer**: Side panel variant using similar patterns
- **Popover**: Positioned overlay component
- **Tooltip**: Small overlay for help text
- **Snackbar**: Transient notification overlay
- **Menu**: Dropdown menu overlay component
- **Select**: Dropdown select with modal-like behavior
- **Pagination**: Component that may trigger dialogs
- **Card**: Container component often placed in modals
- **Paper**: Base paper component used by Dialog

---

## Accessibility Notes

### Implementation Details

1. **Focus Trapping**: Modal automatically traps focus, preventing keyboard navigation outside the modal
2. **Focus Restoration**: Focus automatically returns to trigger element when modal closes
3. **Screen Reader**: Dialog structure with DialogTitle and DialogContent provides semantic structure
4. **Keyboard Support**: Escape key closes modal, Tab cycles through focusable elements
5. **ARIA Labels**: Use aria-labelledby and aria-describedby for proper identification
6. **Backdrop**: Backdrop receives click handlers for dismiss pattern

### Best Practices

- Always provide `aria-labelledby` or `aria-describedby`
- Use DialogTitle and DialogContent for semantic structure
- Ensure action buttons are clearly labeled
- Test with keyboard navigation and screen readers
- Provide visual feedback for loading and error states
- Ensure sufficient color contrast in custom modals
- Use semantic HTML within modal content

---

## Research Notes

### Framework Approach
MUI takes a **component hierarchy** approach:
- **Modal**: Low-level, unstyled, maximum flexibility
- **Dialog**: High-level, pre-styled, structure-driven
- **Backdrop**: Composed element for backdrop overlay

### Design Philosophy
- **Separation of Concerns**: Modal handles overlay mechanics, Dialog handles structure
- **Composition**: Dialog built on top of Modal for higher-level abstraction
- **Theming**: Both components integrate with MUI theme system
- **Accessibility First**: Focus management and ARIA built-in automatically

### Material Design Patterns
1. **Modal Dialogs**: Interrupt user flow, require interaction
2. **Alerts**: Simple dialogs with single action or confirmation
3. **Forms**: Multi-field dialogs for data entry
4. **Confirmations**: Ask user to confirm action before proceeding
5. **Loading States**: Show progress during async operations
6. **Error States**: Display error messages and recovery options

### State Management Patterns
- **Simple Toggle**: `useState(false)` for open/closed
- **Complex Forms**: `useState({})` for form data with Dialog
- **Validation**: Maintain errors state, disable submit when invalid
- **Async Operations**: Track loading and error states separately
- **Multi-step**: Use activeStep state for wizard-like flows

### Customization Layers
1. **Theme-level**: Global Dialog styling via theme
2. **Component-level**: `sx` prop, `PaperProps`, `slotProps`
3. **Content-level**: Custom content components
4. **Behavior-level**: Custom onClose handlers, validation

---

## Comparison Insights

### Strengths
1. **Two-level abstraction**: Modal for custom, Dialog for standard patterns
2. **Complete accessibility**: Focus trapping, ARIA, keyboard support built-in
3. **Material Design compliance**: Follows Material Design specifications
4. **Flexible positioning**: Modal supports any positioning pattern
5. **Theming power**: Integrate with MUI theme system
6. **Structured content**: DialogTitle/Content/Actions provide clear hierarchy
7. **Transition support**: Multiple animation options
8. **Focus management**: Automatic focus handling

### Potential Limitations
1. **Manual positioning**: Modal requires manual styling for positioning
2. **Backdrop click handling**: Requires explicit onBackdropClick implementation
3. **Size constraints**: Dialog maxWidth is discrete, not continuous
4. **Escape key behavior**: Must disable per-instance, no default lock
5. **Content scrolling**: Manual height/overflow management needed
6. **Button placement**: DialogActions spacing requires careful management

### Patterns to Consider for Semantic UI

#### Adopt These Patterns
1. **Dialog with structured content**: Title/Content/Actions separation
2. **Modal for custom layouts**: Low-level primitive for flexibility
3. **Focus trapping**: Automatic focus management within modal
4. **Backdrop behavior**: Click to dismiss pattern
5. **Transition support**: Multiple animation options
6. **ARIA support**: Automatic accessibility attributes
7. **Size options**: maxWidth with fullWidth for responsive sizing

#### Improve Upon
1. **Simpler positioning**: Default centered positioning for Modal
2. **Built-in button handling**: Default button layout without DialogActions
3. **Automatic backdrop click**: Default close on backdrop without handler
4. **Content padding**: Sensible padding defaults instead of manual
5. **Confirmation pattern**: Built-in confirmation dialog component
6. **Responsive sizes**: Adapt dialog size to screen size
7. **Loading state**: First-class loading state support

### Questions for Semantic UI Design
1. **Single component or hierarchy?**: Should we use Modal + Dialog pattern?
2. **Default positioning**: Should modals center by default?
3. **Backdrop behavior**: Should clicking backdrop close by default?
4. **Button layout**: Should we provide button arrangement utilities?
5. **Animation**: Should we support multiple transition types?
6. **Sizing**: Should we provide preset sizes or continuous sizing?
7. **Scrolling**: Should title/actions be sticky when content scrolls?
8. **Confirmation**: Should we provide a dedicated ConfirmDialog component?

---

Research completed: 2025-11-05
Component: Modal & Dialog
Framework: MUI (Material-UI)
Documentation: https://mui.com/material-ui/react-modal/ and https://mui.com/material-ui/react-dialog/
