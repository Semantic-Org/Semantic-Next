# Chakra UI - File Upload Component

## Component Overview

The File Upload component in Chakra UI is used to select and upload files from a device. Built on top of Ark UI's file-upload primitive, it provides a comprehensive file selection and management interface with support for drag-and-drop, file validation, multiple file selection, image previews, and complete form integration. The component follows Chakra's composition pattern, providing granular control through multiple sub-components while maintaining full accessibility support and ARIA compliance.

The File Upload component is ideal for scenarios requiring file uploads such as profile picture uploads, document management systems, image galleries, form attachments, and bulk file processing applications.

---

## Component Structure

### Sub-Components

The File Upload component is composed of the following sub-components:

- **FileUpload.Root** - Container component that manages file state, validation, and overall configuration
- **FileUpload.Dropzone** - Drag-and-drop zone with visual feedback during drag operations
- **FileUpload.Trigger** - Button that opens the native file picker dialog
- **FileUpload.ItemGroup** - Container for displaying the list of uploaded files
- **FileUpload.Item** - Individual file entry wrapper
- **FileUpload.ItemPreview** - Type-based file preview component (supports images, PDFs, etc.)
- **FileUpload.ItemPreviewImage** - Image thumbnail renderer for image files
- **FileUpload.ItemName** - Displays the file name
- **FileUpload.ItemSizeText** - Shows formatted file size
- **FileUpload.ItemDeleteTrigger** - Button to remove individual files
- **FileUpload.ClearTrigger** - Button to remove all files at once
- **FileUpload.Label** - Accessible label element
- **FileUpload.HiddenInput** - Native form input integration for form submissions
- **FileUpload.Context** - Context consumer for accessing file upload state
- **FileUpload.RootProvider** - Programmatic API access via the `useFileUpload` hook

---

## Usage Patterns

### Basic Usage

The simplest file upload configuration with file selection and display:

```jsx
import { FileUpload } from "@chakra-ui/react"
import { FileIcon } from "lucide-react"

function BasicFileUpload() {
  return (
    <FileUpload.Root maxFiles={5}>
      <FileUpload.Label>File Upload</FileUpload.Label>
      <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file}>
                <FileUpload.ItemPreview type="image/*">
                  <FileUpload.ItemPreviewImage />
                </FileUpload.ItemPreview>
                <FileUpload.ItemPreview type=".*">
                  <FileIcon />
                </FileUpload.ItemPreview>
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
                <FileUpload.ItemDeleteTrigger>X</FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  )
}
```

### Drag and Drop

Enable drag-and-drop functionality with the Dropzone component:

```jsx
import { FileUpload } from "@chakra-ui/react"

function DragAndDropFileUpload() {
  return (
    <FileUpload.Root accept="image/*" maxFiles={3}>
      <FileUpload.Dropzone>Drag and drop your images here</FileUpload.Dropzone>

      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file} className="file-item">
                <FileUpload.ItemPreview type="image/*">
                  <FileUpload.ItemPreviewImage />
                </FileUpload.ItemPreview>
                <FileUpload.ItemName />
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>

      <FileUpload.HiddenInput />
    </FileUpload.Root>
  )
}
```

### Initial Files (Pre-populated State)

Pre-populate the component with default accepted files:

```jsx
import { FileUpload } from "@chakra-ui/react"
import { FileIcon } from "lucide-react"

function InitialFilesUpload() {
  return (
    <FileUpload.Root
      defaultAcceptedFiles={[
        new File(['Welcome to Chakra UI'], 'README.md', { type: 'text/plain' })
      ]}
    >
      <FileUpload.Label>File Upload</FileUpload.Label>
      <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file}>
                <FileIcon />
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  )
}
```

### Clear All Files

Include a clear trigger to remove all uploaded files at once:

```jsx
import { FileUpload } from "@chakra-ui/react"

function ClearTriggerUpload() {
  return (
    <FileUpload.Root maxFiles={5} accept="image/png,image/jpeg">
      <FileUpload.Label>File Upload</FileUpload.Label>
      <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
      <FileUpload.ClearTrigger>Clear Files</FileUpload.ClearTrigger>
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file}>
                <FileUpload.ItemPreview type="image/*">
                  <FileUpload.ItemPreviewImage />
                </FileUpload.ItemPreview>
                <FileUpload.ItemName />
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  )
}
```

### Directory Upload

Allow uploading entire folders using the directory prop:

```jsx
import { FileUpload } from "@chakra-ui/react"

function DirectoryUpload() {
  return (
    <FileUpload.Root directory>
      <FileUpload.Trigger>Upload Folder</FileUpload.Trigger>
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file}>
                <FileUpload.ItemName>
                  {file.webkitRelativePath ?? file.name}
                </FileUpload.ItemName>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  )
}
```

---

## Validation & Error Handling

### Accepted File Types

Restrict file types using the accept prop with separate rendering for rejected files:

```jsx
import { FileUpload } from "@chakra-ui/react"

function AcceptedFileTypesUpload() {
  return (
    <FileUpload.Root accept="image/png,image/jpeg">
      <FileUpload.Label>File Upload (PNG and JPEG only)</FileUpload.Label>
      <FileUpload.Dropzone>Drop your files here</FileUpload.Dropzone>
      <FileUpload.Trigger>Select Files</FileUpload.Trigger>

      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file}>
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
                <FileUpload.ItemDeleteTrigger>Remove</FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>

      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ rejectedFiles }) =>
            rejectedFiles.map((fileRejection) => (
              <FileUpload.Item key={fileRejection.file.name} file={fileRejection.file}>
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
                <div>
                  {fileRejection.errors.map((error) => (
                    <div key={error} style={{ color: 'red' }}>
                      {error}
                    </div>
                  ))}
                </div>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>

      <FileUpload.HiddenInput />
    </FileUpload.Root>
  )
}
```

### Comprehensive Error Handling

Demonstrate comprehensive validation with custom error messages:

```jsx
import { FileUpload, type FileUploadFileError } from "@chakra-ui/react"

const errorMessages: Record<FileUploadFileError, string> = {
  TOO_MANY_FILES: '📊 Too many files selected (max 3 allowed)',
  FILE_INVALID_TYPE: '🚫 Invalid file type (only images and PDFs allowed)',
  FILE_TOO_LARGE: '📏 File too large (max 1MB)',
  FILE_TOO_SMALL: '📐 File too small (min 1KB)',
  FILE_INVALID: '⚠️ Invalid file',
  FILE_EXISTS: '🔄 File already exists',
}

function ErrorHandlingUpload() {
  return (
    <FileUpload.Root
      maxFiles={3}
      maxFileSize={1024 * 1024}
      minFileSize={1024}
      accept="image/*,application/pdf"
    >
      <FileUpload.Label>File Upload with Validation</FileUpload.Label>
      <FileUpload.Trigger>Select Files</FileUpload.Trigger>

      <div data-status="accepted">
        <h3>✅ Accepted Files</h3>
        <FileUpload.ItemGroup>
          <FileUpload.Context>
            {({ acceptedFiles }) =>
              acceptedFiles.length === 0 ? (
                <div>No files uploaded yet</div>
              ) : (
                acceptedFiles.map((file) => (
                  <FileUpload.Item
                    key={file.name}
                    file={file}
                    className="file-item"
                    data-status="accepted"
                  >
                    <FileUpload.ItemPreview type="image/*">
                      <FileUpload.ItemPreviewImage />
                    </FileUpload.ItemPreview>
                    <FileUpload.ItemPreview type="application/pdf">
                      <div data-type="pdf">PDF</div>
                    </FileUpload.ItemPreview>
                    <FileUpload.ItemName />
                    <FileUpload.ItemSizeText />
                    <FileUpload.ItemDeleteTrigger>Remove</FileUpload.ItemDeleteTrigger>
                  </FileUpload.Item>
                ))
              )
            }
          </FileUpload.Context>
        </FileUpload.ItemGroup>
      </div>

      <div data-status="rejected">
        <h3>❌ Rejected Files</h3>
        <FileUpload.ItemGroup>
          <FileUpload.Context>
            {({ rejectedFiles }) =>
              rejectedFiles.length === 0 ? (
                <div>No rejected files</div>
              ) : (
                rejectedFiles.map((fileRejection) => (
                  <FileUpload.Item
                    key={fileRejection.file.name}
                    file={fileRejection.file}
                    className="file-item"
                    data-status="rejected"
                  >
                    <FileUpload.ItemName />
                    <FileUpload.ItemSizeText />
                    <div>
                      <strong>Validation Errors:</strong>
                      {fileRejection.errors.map((error, index) => (
                        <div key={index} data-error-code={error}>
                          {errorMessages[error as FileUploadFileError] || `❓ ${error}`}
                        </div>
                      ))}
                    </div>
                  </FileUpload.Item>
                ))
              )
            }
          </FileUpload.Context>
        </FileUpload.ItemGroup>
      </div>

      <FileUpload.HiddenInput />
    </FileUpload.Root>
  )
}
```

### Built-in Validation Error Codes

The component provides the following built-in validation error codes:

- **`TOO_MANY_FILES`** - Exceeds maxFiles limit
- **`FILE_INVALID_TYPE`** - File not in accept list
- **`FILE_TOO_LARGE`** - Exceeds maxFileSize
- **`FILE_TOO_SMALL`** - Below minFileSize
- **`FILE_INVALID`** - Generic validation failure
- **`FILE_EXISTS`** - Duplicate file detected

### Custom Validation

Implement custom validation logic beyond built-in constraints:

```jsx
import { FileUpload } from "@chakra-ui/react"
import { FileIcon } from "lucide-react"

function CustomValidationUpload() {
  return (
    <FileUpload.Root
      validate={(file) => {
        if (file.name.length > 20) return ['FILE_NAME_TOO_LONG']
        return null
      }}
    >
      <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file}>
                <FileUpload.ItemPreview type="image/*">
                  <FileUpload.ItemPreviewImage />
                </FileUpload.ItemPreview>
                <FileUpload.ItemPreview type=".*">
                  <FileIcon />
                </FileUpload.ItemPreview>
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
                <FileUpload.ItemDeleteTrigger>X</FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  )
}
```

---

## Advanced Features

### File Transformations

Process files before they're added to the accepted list (e.g., compression, format conversion):

```jsx
import { FileUpload } from "@chakra-ui/react"
import { compressAccurately } from "image-conversion"

function FileTransformationsUpload() {
  const transformFiles = async (files: File[]) => {
    return Promise.all(
      files.map(async (file) => {
        if (file.type.startsWith('image/')) {
          try {
            const blob = await compressAccurately(file, 200)
            return new File([blob], file.name, { type: blob.type })
          } catch (error) {
            console.error('Compression failed for:', file.name, error)
            return file
          }
        }
        return file
      }),
    )
  }

  return (
    <FileUpload.Root accept="image/*" maxFiles={5} transformFiles={transformFiles}>
      <FileUpload.Label>File Upload with Compression</FileUpload.Label>
      <FileUpload.Trigger>Choose Images</FileUpload.Trigger>

      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file} className="file-item">
                <FileUpload.ItemPreview type="image/*">
                  <FileUpload.ItemPreviewImage />
                </FileUpload.ItemPreview>
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
                <FileUpload.ItemDeleteTrigger>Remove</FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>

      <FileUpload.HiddenInput />
    </FileUpload.Root>
  )
}
```

### Programmatic Control with Root Provider

Use the useFileUpload hook with RootProvider for programmatic control:

```jsx
import { FileUpload, useFileUpload } from "@chakra-ui/react"
import { FileIcon } from "lucide-react"

function RootProviderUpload() {
  const fileUpload = useFileUpload({ maxFiles: 5 })

  return (
    <>
      <button onClick={() => fileUpload.clearFiles()}>Clear</button>

      <FileUpload.RootProvider value={fileUpload}>
        <FileUpload.Label>File Upload</FileUpload.Label>
        <FileUpload.Dropzone>Drag your file(s) here</FileUpload.Dropzone>
        <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
        <FileUpload.ItemGroup>
          <FileUpload.Context>
            {({ acceptedFiles }) =>
              acceptedFiles.map((file) => (
                <FileUpload.Item key={file.name} file={file}>
                  <FileUpload.ItemPreview type="image/*">
                    <FileUpload.ItemPreviewImage />
                  </FileUpload.ItemPreview>
                  <FileUpload.ItemPreview type=".*">
                    <FileIcon />
                  </FileUpload.ItemPreview>
                  <FileUpload.ItemName />
                  <FileUpload.ItemSizeText />
                  <FileUpload.ItemDeleteTrigger>X</FileUpload.ItemDeleteTrigger>
                </FileUpload.Item>
              ))
            }
          </FileUpload.Context>
        </FileUpload.ItemGroup>
        <FileUpload.HiddenInput />
      </FileUpload.RootProvider>
    </>
  )
}
```

### Clipboard Integration (Paste Files)

Enable pasting images directly from the clipboard:

```jsx
import { FileUpload, useFileUpload } from "@chakra-ui/react"
import { XIcon } from "lucide-react"

function PasteFilesUpload() {
  const fileUpload = useFileUpload({ maxFiles: 3, accept: 'image/*' })

  return (
    <FileUpload.RootProvider value={fileUpload}>
      <FileUpload.Label>File Upload with Paste</FileUpload.Label>
      <textarea
        placeholder="Paste image here..."
        onPaste={(e) => {
          fileUpload.setClipboardFiles(e.clipboardData)
        }}
      />
      <FileUpload.ItemGroup>
        {fileUpload.acceptedFiles.map((file) => (
          <FileUpload.Item key={file.name} file={file}>
            <FileUpload.ItemPreview type="image/*">
              <FileUpload.ItemPreviewImage />
            </FileUpload.ItemPreview>
            <FileUpload.ItemDeleteTrigger>
              <XIcon />
            </FileUpload.ItemDeleteTrigger>
          </FileUpload.Item>
        ))}
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.RootProvider>
  )
}
```

---

## Integration Patterns

### Form Integration with Field Component

Integrate with the Field component for error and helper text:

```jsx
import { Field } from "@chakra-ui/react"
import { FileUpload } from "@chakra-ui/react"

function FormFieldUpload(props: Field.RootProps) {
  return (
    <Field.Root {...props}>
      <FileUpload.Root maxFiles={5}>
        <FileUpload.Label>Label</FileUpload.Label>
        <FileUpload.Trigger>Select</FileUpload.Trigger>
        <FileUpload.ItemGroup />
        <FileUpload.HiddenInput data-testid="input" />
      </FileUpload.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
```

---

## Context API

The FileUpload.Context provides access to the following state and methods:

```typescript
interface FileUploadContext {
  // State properties
  dragging: boolean              // Whether files are being dragged over dropzone
  focused: boolean               // Whether component has focus
  disabled: boolean              // Whether component is disabled
  transforming: boolean          // Whether file transformation is in progress
  acceptedFiles: File[]          // Array of accepted files
  rejectedFiles: FileRejection[] // Array of rejected files with error details

  // Methods
  openFilePicker(): void                              // Open native file picker
  deleteFile(file: File, type?: ItemType): void       // Remove specific file
  setFiles(files: File[]): void                       // Replace all files
  clearFiles(): void                                  // Remove all files
  clearRejectedFiles(): void                          // Clear rejected files
  getFileSize(file: File): string                     // Format file size
  createFileUrl(file: File, callback): () => void     // Create object URL
  setClipboardFiles(dataTransfer: DataTransfer): boolean // Add from clipboard
}
```

---

## Props API

### FileUpload.Root Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accept` | `string` | - | MIME types or file extensions to accept (e.g., "image/*", "image/png,image/jpeg") |
| `maxFiles` | `number` | `1` | Maximum number of files that can be uploaded |
| `maxFileSize` | `number` | `Infinity` | Maximum file size in bytes |
| `minFileSize` | `number` | `0` | Minimum file size in bytes |
| `directory` | `boolean` | `false` | Enable folder/directory uploads |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `allowDrop` | `boolean` | `true` | Enable drag-and-drop functionality |
| `preventDocumentDrop` | `boolean` | `true` | Prevent accidental drops on document |
| `defaultAcceptedFiles` | `File[]` | `[]` | Initial files (uncontrolled) |
| `transformFiles` | `(files: File[]) => Promise<File[]>` | - | Transform files before acceptance |
| `validate` | `(file: File) => string[] \| null` | - | Custom validation function |
| `onFileAccept` | `(details: { acceptedFiles: File[] }) => void` | - | Callback when files are accepted |
| `onFileReject` | `(details: { rejectedFiles: FileRejection[] }) => void` | - | Callback when files are rejected |
| `onFileChange` | `(details: { acceptedFiles: File[], rejectedFiles: FileRejection[] }) => void` | - | Callback on any file change |

### FileUpload.Dropzone Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI box props | - | - | Inherits all styling props from Box component |

**Data Attributes:**
- `data-dragging` - Present when files are being dragged over the dropzone

### FileUpload.Trigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI button props | - | - | Inherits all button styling and interaction props |

### FileUpload.ItemGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI box props | - | - | Inherits all styling props from Box component |

### FileUpload.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `file` | `File` | - | **Required.** The file object to display |
| All Chakra UI box props | - | - | Inherits all styling props from Box component |

### FileUpload.ItemPreview Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | - | MIME type pattern for conditional rendering (e.g., "image/*", "video/*", "application/pdf", ".*") |
| All Chakra UI box props | - | - | Inherits all styling props from Box component |

### FileUpload.ItemPreviewImage Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI image props | - | - | Inherits all image styling props |

### FileUpload.ItemName Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI text props | - | - | Inherits all text styling props |

### FileUpload.ItemSizeText Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI text props | - | - | Inherits all text styling props |

### FileUpload.ItemDeleteTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI button props | - | - | Inherits all button styling and interaction props |

### FileUpload.ClearTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI button props | - | - | Inherits all button styling and interaction props |

### FileUpload.Label Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI text props | - | - | Inherits all text styling props |

### FileUpload.HiddenInput Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All native input props | - | - | Inherits native HTML input attributes for form integration |

---

## Accessibility Features

### Keyboard Navigation

The File Upload component supports full keyboard navigation:

| Key | Behavior |
|-----|----------|
| **Tab** | Move focus to trigger button or delete buttons |
| **Shift + Tab** | Move focus backward through interactive elements |
| **Enter / Space** | Activate focused trigger or delete button |
| **Escape** | Cancel file picker dialog (native behavior) |

### ARIA Attributes

Chakra UI automatically manages ARIA attributes:

| Attribute | Purpose | Applied To |
|-----------|---------|------------|
| `aria-label` | Provides accessible name | Trigger, DeleteTrigger |
| `aria-disabled` | Indicates disabled state | Root, Trigger |
| `role="button"` | Identifies interactive elements | Trigger, DeleteTrigger |
| `aria-describedby` | Associates with helper text | Root (when in Field) |
| `aria-invalid` | Indicates validation errors | Root (when in Field) |

### Screen Reader Support

- File names are announced when added or removed
- Validation errors are announced through Field.ErrorText
- Upload progress and state changes are communicated
- Dropzone provides clear instructions for drag-and-drop

### Focus Management

- Focus moves to trigger button after file selection
- Delete buttons receive proper focus indicators
- Visual focus styles can be customized via Chakra's styling props
- Tab order follows natural document flow

---

## Styling & Theming

### Theme Integration

The File Upload component inherits from Chakra's theme system:

```jsx
// Example custom styling
<FileUpload.Root>
  <FileUpload.Dropzone
    borderWidth="2px"
    borderStyle="dashed"
    borderColor="gray.300"
    borderRadius="md"
    padding="8"
    textAlign="center"
    _hover={{ borderColor: "blue.500" }}
    _dragging={{ borderColor: "blue.500", bg: "blue.50" }}
  >
    Drag and drop files here
  </FileUpload.Dropzone>
</FileUpload.Root>
```

### Data Attributes for CSS

All components include data attributes for targeting:

- `[data-scope="file-upload"]` - Identifies all File Upload components
- `[data-part="root"]`, `[data-part="dropzone"]`, etc. - Identifies specific parts
- `[data-dragging]` - Applied to Dropzone during drag operations
- `[data-status="accepted"]`, `[data-status="rejected"]` - For styling based on file status

### Dark Mode Support

The component automatically adapts to Chakra's color mode:

```jsx
<FileUpload.Dropzone
  bg={useColorModeValue("gray.50", "gray.800")}
  borderColor={useColorModeValue("gray.300", "gray.600")}
>
  Drop files here
</FileUpload.Dropzone>
```

---

## Common Patterns

### Profile Picture Upload
Single image upload with preview for user avatars

### Document Management
Multiple file uploads with file type restrictions for document libraries

### Image Gallery
Drag-and-drop multiple images with thumbnails for photo galleries

### Form Attachments
File upload integrated with forms for email attachments or support tickets

### Bulk File Processing
Multiple file selection with progress indication for batch operations

### Resume/CV Upload
Single file upload with file type and size validation for job applications

### Invoice Upload
Multiple document uploads with validation for accounting systems

### Media Library
Large file uploads with compression and transformation for content management

---

## Related Components

- **Field** - For form integration with labels, helper text, and error messages
- **Button** - Used as trigger for file selection
- **Image** - For displaying image previews
- **Icon** - For file type indicators and UI actions
- **Badge** - For displaying file status or metadata
- **Progress** - For showing upload progress (external integration)
- **Toast** - For notifications about upload success or failures

---

## Framework-Specific Features

### Built on Ark UI

Chakra UI's File Upload is built on Ark UI's file-upload primitive, providing:

- Framework-agnostic core logic
- Comprehensive accessibility implementation
- Battle-tested state management
- Extensive validation and error handling

### Composition Pattern

The component follows Chakra's composition philosophy:

- Granular control through sub-components
- Flexible layouts without constraints
- Consistent API across all Chakra components
- Easy customization through props

### TypeScript Support

Full TypeScript definitions provided:

```typescript
import { FileUpload, type FileUploadFileError } from "@chakra-ui/react"

// Type-safe error handling
const errorMessages: Record<FileUploadFileError, string> = {
  TOO_MANY_FILES: "Too many files",
  FILE_INVALID_TYPE: "Invalid file type",
  FILE_TOO_LARGE: "File too large",
  FILE_TOO_SMALL: "File too small",
  FILE_INVALID: "Invalid file",
  FILE_EXISTS: "File exists",
}
```

---

## Notes and Observations

### Design Philosophy

1. **Composition over Configuration** - The component provides building blocks rather than a monolithic component, allowing flexible layouts and customizations
2. **Accessibility First** - Full ARIA support and keyboard navigation built-in
3. **Validation-Centric** - Comprehensive validation with both built-in and custom validators
4. **Form-Friendly** - Seamless integration with native forms via HiddenInput

### Performance Considerations

1. **File Transformations** - Transform operations are async and should be optimized for large files
2. **Preview Generation** - Image previews use object URLs which should be properly cleaned up
3. **Large File Handling** - Consider chunked uploads for files larger than a few megabytes
4. **Memory Management** - Use cleanup functions with `createFileUrl` to avoid memory leaks

### Best Practices

1. **Always Include HiddenInput** - Required for form submissions
2. **Validate File Size** - Set reasonable maxFileSize to prevent memory issues
3. **Provide Clear Error Messages** - Customize error messages for better UX
4. **Use ItemPreview Type Patterns** - Conditionally render appropriate previews based on file type
5. **Implement Loading States** - Show feedback during file transformations
6. **Handle Rejected Files** - Always display rejected files and reasons to users
7. **Clean Up Object URLs** - Properly dispose of preview URLs to prevent memory leaks

### Common Use Cases

- **Profile/Avatar Upload** - Single image with preview and validation
- **Document Upload** - Multiple PDFs/documents with file type restrictions
- **Gallery Upload** - Multiple images with thumbnails and drag-and-drop
- **Form Attachments** - Integrated file upload within larger forms
- **Bulk Operations** - Large numbers of files with progress indication

### Limitations

1. **Upload Logic Not Included** - Component handles selection and validation, not actual HTTP uploads
2. **No Built-in Progress** - Upload progress must be implemented separately
3. **Browser Compatibility** - Directory upload requires modern browser support
4. **Preview Support** - Limited to images and PDFs by default

### Integration Requirements

- Requires `@chakra-ui/react` package
- Built on `@ark-ui/react` (included as dependency)
- Icon library optional but recommended (e.g., lucide-react)
- Image processing library optional for transformations (e.g., image-conversion)

---

**Research completed:** 2025-01-06
**Component:** File Upload
**Framework:** Chakra UI (v3.x)
**Documentation:** https://chakra-ui.com/docs/components/file-upload
**Underlying Library:** https://ark-ui.com/react/docs/components/file-upload
