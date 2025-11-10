# Component Pattern Research: File Upload

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 5 (Chakra UI, Ant Design, Mantine, Nuxt UI, PrimeReact)
- Date: 2025-11-05
- Unique patterns identified: 40+ distinct patterns across file selection, validation, upload management, and UI customization

## Component Definition Consensus

File Upload is a form input component that enables users to select and upload files from their device to a remote server or application. All five frameworks consistently conceptualize File Upload as:

- **Core purpose**: Facilitate file selection from user's device, provide visual feedback during upload, and manage file lifecycle (selection, validation, upload, removal)
- **Mental model**: An enhanced file input that abstracts away browser file input limitations while providing rich UI for file management, progress tracking, and validation
- **Semantic meaning**: Uses semantic HTML (`<input type="file">`) as foundation with enhanced UI layer for better user experience

**Key observation**: File Upload is universally positioned as both a **selection interface** and **upload manager** - all frameworks handle file selection UI while varying significantly in upload execution patterns (auto-upload vs manual, XHR vs form submission).

## Terminology Variations

### Component Names
- **FileUpload** (2/5): Chakra UI, PrimeReact
- **Upload** (1/5): Ant Design
- **FileInput** (1/5): Mantine
- **File Upload** (1/5): Nuxt UI (UFileUpload)

### Selection Modes
- **multiple** (5/5): All support multiple file selection prop
- **directory** (2/5): Ant Design, Chakra UI support folder upload

### Display Patterns
- **listType** (1/5): Ant Design - `text|picture|picture-card`
- **mode** (1/5): PrimeReact - `basic|advanced`
- **variant** (1/5): Nuxt UI - `area|button`
- **Compositional** (1/5): Chakra UI - separate components for each UI element
- **valueComponent** (1/5): Mantine - custom render function

### Upload Execution
- **action** (2/5): Ant Design, PrimeReact - URL endpoint for auto-upload
- **customRequest** (2/5): Ant Design, PrimeReact - override default upload
- **No auto-upload** (3/5): Chakra UI, Mantine, Nuxt UI - selection only, upload separate

## Pattern Inventory

### File Selection Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Single file selection | Select one file at a time | 5/5 (100%) | Level 1 | All (default behavior) |
| Multiple file selection | Select multiple files | 5/5 (100%) | Level 1 | All (multiple prop) |
| File type filtering | Accept specific file types | 5/5 (100%) | Level 1 | All (accept prop) |
| Directory upload | Select entire folders | 2/5 (40%) | Level 4 | Ant Design, Chakra UI |
| Camera capture | Mobile camera integration | 1/5 (20%) | Level 5 | Mantine (capture prop) |
| Max file count | Limit number of files | 4/5 (80%) | Level 2 | All except Mantine |
| Max file size | File size validation | 4/5 (80%) | Level 2 | All except Mantine |

### Upload Execution Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Auto-upload | Automatic upload on selection | 2/5 (40%) | Level 4 | Ant Design (default), PrimeReact (auto prop) |
| Manual upload | Developer controls upload | 5/5 (100%) | Level 1 | All (various patterns) |
| Custom request handler | Override default XHR | 2/5 (40%) | Level 4 | Ant Design, PrimeReact |
| Form submission | Submit via HTML form | 3/5 (60%) | Level 3 | Chakra (HiddenInput), Mantine (name/form), PrimeReact |
| Progress tracking | Show upload progress | 3/5 (60%) | Level 3 | Ant Design, PrimeReact, Chakra (via context) |
| Chunked upload | Split large files | 0/5 (0%) | N/A | None natively |

### UI Display Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Button trigger | Click button to select | 5/5 (100%) | Level 1 | All |
| Drag and drop zone | Drag files to upload | 5/5 (100%) | Level 1 | All (Dropzone/Dragger) |
| File list display | Show selected files | 5/5 (100%) | Level 1 | All |
| Image preview | Thumbnail for images | 5/5 (100%) | Level 1 | All |
| File icons | Type-specific icons | 5/5 (100%) | Level 1 | All |
| File name display | Show filename | 5/5 (100%) | Level 1 | All |
| File size display | Show file size | 5/5 (100%) | Level 1 | All |
| Remove file button | Delete individual files | 5/5 (100%) | Level 1 | All |
| Clear all button | Remove all files | 3/5 (60%) | Level 3 | Chakra UI, Mantine, Nuxt UI |

### Layout Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Text list | Simple text-based list | 3/5 (60%) | Level 3 | Ant Design, Mantine, PrimeReact |
| Picture list | List with thumbnails | 2/5 (40%) | Level 4 | Ant Design, PrimeReact |
| Picture card/grid | Card grid layout | 3/5 (60%) | Level 3 | Ant Design, Nuxt UI, PrimeReact |
| Custom item rendering | Full render control | 4/5 (80%) | Level 2 | All except Mantine |
| Template customization | Header/item/empty templates | 1/5 (20%) | Level 5 | PrimeReact |

### Validation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| File type validation | Accept only specified types | 5/5 (100%) | Level 1 | All (accept prop) |
| File size validation | Max size per file | 4/5 (80%) | Level 2 | All except Mantine (built-in) |
| File count limit | Max total files | 4/5 (80%) | Level 2 | All except Mantine |
| Pre-upload validation | Custom validation hook | 3/5 (60%) | Level 3 | Ant Design (beforeUpload), Chakra (onFileChange), PrimeReact (onValidationFail) |
| Error display | Show validation errors | 5/5 (100%) | Level 1 | All |
| Error state styling | Visual error indication | 5/5 (100%) | Level 1 | All |

### State Management Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Controlled component | External state management | 5/5 (100%) | Level 1 | All (value/fileList prop) |
| Uncontrolled component | Internal state management | 3/5 (60%) | Level 3 | Ant Design, Mantine, PrimeReact |
| onChange callback | File selection events | 5/5 (100%) | Level 1 | All |
| Upload lifecycle events | onUpload, onSuccess, onError | 3/5 (60%) | Level 3 | Ant Design, PrimeReact, Chakra (context) |
| File state tracking | Uploading/done/error states | 3/5 (60%) | Level 3 | Ant Design, PrimeReact, Chakra |

### Interaction Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Click to select | Button/area click opens picker | 5/5 (100%) | Level 1 | All |
| Drag and drop | Drag files onto component | 5/5 (100%) | Level 1 | All |
| Paste from clipboard | Paste images from clipboard | 1/5 (20%) | Level 5 | Chakra UI |
| Preview on click | Click file to preview | 3/5 (60%) | Level 3 | Ant Design, PrimeReact, Nuxt |
| Download files | Download uploaded files | 2/5 (40%) | Level 4 | Ant Design, PrimeReact |
| Disabled state | Prevent interaction | 5/5 (100%) | Level 1 | All |

### Customization Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Custom icons | Replace default icons | 5/5 (100%) | Level 1 | All |
| Custom render | Full UI control | 4/5 (80%) | Level 2 | All except Mantine |
| Slots/sections | Left/right sections | 2/5 (40%) | Level 4 | Mantine (sections), Nuxt UI (slots) |
| Templates | Header/item/empty templates | 1/5 (20%) | Level 5 | PrimeReact |
| Style props | CSS customization | 4/5 (80%) | Level 2 | All except Ant Design |
| Class names | CSS class control | 5/5 (100%) | Level 1 | All |

## Notable Patterns

### Highly Adopted (Level 1, 100% adoption)

**Universal patterns across all File Upload implementations:**

- **Single and multiple selection**: All support both modes
- **File type filtering**: All use accept prop
- **Button trigger**: All provide click-to-select
- **Drag and drop**: All support file drop zones
- **File list display**: All show selected files
- **Image previews**: All display image thumbnails
- **File metadata**: All show name and size
- **Remove file capability**: All allow file deletion
- **Controlled state**: All support external state management
- **onChange callback**: All fire selection events
- **Error states**: All indicate validation failures
- **Visual feedback**: All provide loading/success/error states
- **Disabled state**: All support disabling interaction
- **Custom icons**: All allow icon customization
- **Class name control**: All support CSS classes
- **Accessibility**: All use semantic file input foundation

### Emerging Patterns (Level 2-3, 60-80% adoption)

**Patterns with strong adoption:**

- **Max file count** (80%): 4/5 limit total files
- **File size validation** (80%): 4/5 enforce size limits
- **Custom rendering** (80%): 4/5 allow full UI customization
- **Style props** (80%): 4/5 provide style customization
- **Text list layout** (60%): 3/5 offer simple list view
- **Picture card/grid** (60%): 3/5 provide card layout
- **Pre-upload validation** (60%): 3/5 have validation hooks
- **Uncontrolled mode** (60%): 3/5 manage internal state
- **Upload lifecycle events** (60%): 3/5 track upload progress
- **File state tracking** (60%): 3/5 show upload states
- **Preview on click** (60%): 3/5 support file preview
- **Clear all button** (60%): 3/5 provide clear all
- **Progress tracking** (60%): 3/5 show upload progress
- **Form submission** (60%): 3/5 integrate with forms
- **Manual upload** (100% support, but patterns vary)

### Unique Innovations

**Framework-specific features:**

**Chakra UI**:
- **Most compositional**: 14 sub-components for maximum control
- **Clipboard integration**: Paste files from clipboard
- **File transformation**: Transform files before upload
- **Ark UI foundation**: Cross-framework consistency
- **RootProvider pattern**: Programmatic API access
- **Initial files**: Pre-populate with existing files
- **Custom validation**: validate function for file rules

**Ant Design**:
- **Three display types**: text, picture, picture-card
- **LIST_IGNORE pattern**: Smart file filtering in beforeUpload
- **Custom request**: Complete XHR override
- **Progress customization**: ProgressProps for bar styling
- **Automatic upload**: Auto-upload on selection
- **Download support**: Built-in download functionality
- **Upload.Dragger**: Dedicated drag-drop component

**Mantine**:
- **Simplest API**: FileInput as enhanced input field
- **valueComponent**: Custom file display rendering
- **Camera capture**: Mobile camera integration
- **TypeScript generics**: Type-safe based on multiple prop
- **resetRef**: Programmatic reset capability
- **Left/right sections**: Icon placement control
- **Minimal props**: 30 props vs 50+ in others

**Nuxt UI**:
- **Vue integration**: v-model and reactive patterns
- **Area vs button variants**: Two distinct UX patterns
- **Grid/list layouts**: Built-in layout modes
- **Four slot types**: Default, empty, button, item
- **Zod integration**: Type-safe form validation
- **Composition API**: Methods via template ref

**PrimeReact**:
- **Dual mode system**: basic (simple) vs advanced (full-featured)
- **Template system**: Header, item, empty templates
- **Auto-upload option**: auto prop for automatic upload
- **Toast integration**: Built-in notification support
- **Upload methods**: Programmatic upload via ref
- **Comprehensive events**: 9 lifecycle events
- **File operations**: Choose, upload, clear methods

## Pattern Correlations

### When compositional architecture exists:
- More sub-components (Chakra 14 components)
- More customization depth (100%)
- Programmatic API access (100%)
- Suggests: Composition enables fine-grained control

### When auto-upload exists:
- action/url prop present (2/2, 100%)
- customRequest option available (2/2, 100%)
- Progress tracking built-in (2/2, 100%)
- Suggests: Auto-upload requires comprehensive upload management

### When selection-only pattern exists:
- No action/url prop (3/3, 100%)
- Form integration focus (3/3, 100%)
- Simpler API surface (2/3, 67%)
- Suggests: Selection-only enables simpler component

### When validation is strong:
- Pre-upload hooks present (3/3, 100%)
- Error events comprehensive (3/3, 100%)
- Size/count limits supported (3/3, 100%)
- Suggests: Validation is holistic feature set

## Implementation Notes

### Common Technical Approaches

1. **Native File Input Foundation**:
   ```html
   <input type="file" accept="image/*" multiple hidden />
   ```
   All frameworks use native input with enhanced UI layer

2. **File Selection Patterns**:
   - **Controlled**: `<FileUpload value={files} onChange={setFiles} />`
   - **Uncontrolled**: `<FileUpload defaultFileList={[]} />`
   - **Form**: `<input type="file" name="upload" />`

3. **Drag and Drop**:
   - Listen to dragover, drop events
   - Prevent default to enable drop
   - Extract files from dataTransfer
   - Visual feedback during drag

4. **File Validation**:
   - MIME type checking (accept attribute)
   - Size validation (file.size comparison)
   - Count validation (length check)
   - Custom validation hooks

5. **Upload Execution**:
   - **Auto**: XHR/fetch on selection
   - **Manual**: Developer-controlled upload
   - **Form**: Standard form submission
   - **Custom**: customRequest override

### Performance Considerations

- **Large files**: Consider chunked upload (not natively supported)
- **Many files**: Validate synchronously, upload async
- **Image previews**: Use URL.createObjectURL() and cleanup
- **Memory**: Revoke object URLs when done
- **Progress**: Use XMLHttpRequest.upload.onprogress

### Framework-Specific Strengths

**Chakra UI**:
- Most flexible via composition
- Best for custom complex UIs
- Clipboard integration unique
- Ark UI cross-framework

**Ant Design**:
- Most complete out-of-box
- Best auto-upload implementation
- Three display types
- Enterprise-ready features

**Mantine**:
- Simplest API (input-like)
- Best TypeScript types
- Camera capture for mobile
- Clean, minimal approach

**Nuxt UI**:
- Best Vue integration
- Zod validation integration
- Area/button variants
- Composition API friendly

**PrimeReact**:
- Dual mode flexibility
- Most template control
- Best event lifecycle
- PrimeReact ecosystem consistency

## Architectural Insights

### Three Implementation Philosophies

1. **Compositional (Chakra UI)**:
   - 14 sub-components for granular control
   - Maximum flexibility
   - Steeper learning curve
   - Philosophy: Give all the pieces

2. **Full-Featured (Ant Design, PrimeReact)**:
   - Complete upload management
   - Auto-upload capabilities
   - Progress tracking built-in
   - Philosophy: Handle entire lifecycle

3. **Input-First (Mantine, Nuxt UI)**:
   - Selection-focused design
   - Upload is separate concern
   - Simpler mental model
   - Philosophy: Do selection well

### Selection vs Upload Responsibility

**Selection-Only Frameworks** (Chakra, Mantine, Nuxt):
- Component handles file selection and display
- Developer implements upload logic
- Lighter component footprint
- More flexibility in upload implementation

**Full Upload Frameworks** (Ant Design, PrimeReact):
- Component handles selection AND upload
- Built-in XHR/upload logic
- Heavier component footprint
- Faster implementation for standard cases

## Sophisticated Design Patterns

### Chakra UI - File Transformation Pipeline

**What it does**: Provides a `transformFiles` async function that processes files immediately after selection but before they're added to the accepted list. This allows operations like image compression, format conversion, or metadata extraction to happen transparently during file selection without requiring separate API calls or manual processing steps.

```javascript
const transformFiles = async (files: File[]) => {
  return Promise.all(
    files.map(async (file) => {
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file);
        return new File([compressed], file.name, { type: 'image/webp' });
      }
      return file;
    })
  );
};

<FileUpload.Root accept="image/*" transformFiles={transformFiles}>
```

**Why it's sophisticated**: Most file upload components treat file selection as passive - files are selected and then upload logic handles them. Chakra's pattern recognizes that File Upload is unique in needing to modify files *during selection* rather than after. This solves real-world problems where you need optimized files before they ever reach the server, but you want the transformation transparent to the user. The async nature means long-running operations (compression, validation calls) don't block the UI.

**Evidence of design maturity**:
- Transformation happens at the right lifecycle moment (selection, before list display)
- Errors in transformation can be caught and handled gracefully (showing original file if compression fails)
- Transformed files maintain original filename and metadata, just with modified content
- Enables complex workflows (image compression, PDF generation, format normalization) without duplicating upload logic

### Ant Design - LIST_IGNORE Pattern (Graceful Partial Failure Handling)

**What it does**: The `beforeUpload` validation hook can return `Upload.LIST_IGNORE` to exclude a file from the list without blocking the upload flow. This enables showing users exactly which files are problematic while still accepting valid files from the same batch selection, rather than all-or-nothing validation.

```javascript
const beforeUpload = (file) => {
  const isValid = file.size < 5 * 1024 * 1024;

  if (!isValid) {
    message.error(`${file.name} exceeds 5MB limit`);
    return Upload.LIST_IGNORE;  // Exclude from list, don't block
  }

  return true;  // Include in list
};

<Upload beforeUpload={beforeUpload} multiple>
  <Button>Upload Files</Button>
</Upload>
```

**Why it's sophisticated**: Most form validation is binary - accept or reject. But File Upload handles *collections* where partial failures are meaningful and common. When a user selects 10 files but 3 are too large, the naive approach rejects all 10 or shows unclear errors for the batch. Ant's pattern recognizes that File Upload needs granular failure handling: show feedback for invalid files (via message) while silently excluding them, letting the upload flow complete with only valid files. This creates a UX where users understand exactly what went wrong without feeling blocked.

**Evidence of design maturity**:
- Distinguishes between validation failure (file is bad) and upload failure (network issue)
- LIST_IGNORE is an explicit return value, not a silent behavior, making developer intent clear
- Works with mixed file types/sizes in single selection (real-world scenario)
- Paired with message feedback, creates clear communication without interrupting flow
- Enables batch operations where not all files succeed but work continues

### PrimeReact - Dual Mode System (Complexity-Adaptive Architecture)

**What it does**: A single `mode` prop switches between two fundamentally different UI architectures: `basic` (minimal single-button trigger) and `advanced` (full drag-drop interface with file list, progress, and action buttons). Both modes share identical upload logic, validation, and API contracts, just differing in visual presentation and interaction density.

```javascript
// Simple use case - single file selection
<FileUpload mode="basic" name="avatar" url="/api/upload" auto />

// Complex use case - multiple files with feedback
<FileUpload
  mode="advanced"
  name="documents"
  url="/api/upload"
  multiple
  accept=".pdf,.doc"
  itemTemplate={customTemplate}
/>
```

**Why it's sophisticated**: File Upload is unique among form components in needing to span a vast UX spectrum. A user uploading a single avatar needs minimal UI (button + preview). A user uploading documents for processing needs rich interactions (drag-drop, file list, progress, removal). Rather than creating two separate components or forcing one UI on all use cases, the pattern recognizes that the *upload logic is identical* - only the presentation changes. This solves the real problem: supporting both simple and complex scenarios without API duplication or component bloat. The shared validation, event system, and upload mechanism mean developers can start simple and add complexity without rewriting.

**Evidence of design maturity**:
- Both modes expose identical event handlers (onUpload, onError, onValidationFail)
- Template system works in both modes, allowing gradual UI enhancement
- Props like `maxFileSize` and `accept` apply identically across modes
- Switching between modes doesn't require component replacement, just prop change
- Acknowledges that upload complexity is use-case-dependent, not component-inherent

---

## Recommendations for Implementation

Based on pattern prevalence, a robust File Upload implementation should include:

### Essential Features (Level 1, 100% adoption)
1. Single and multiple file selection (multiple prop)
2. File type filtering (accept prop)
3. Button click to select files
4. Drag and drop zone
5. File list display with metadata (name, size)
6. Image preview thumbnails
7. Remove individual files
8. Controlled component pattern (value, onChange)
9. Visual error states
10. Disabled state
11. Custom icon support
12. CSS class customization
13. Semantic HTML foundation (input type=file)
14. Accessibility (labels, ARIA, keyboard)

### Recommended Features (Level 2-3, 60-80% adoption)
1. Max file count validation
2. Max file size validation
3. Custom item rendering
4. Style props customization
5. Text list layout
6. Picture card/grid layout
7. Pre-upload validation hooks
8. Uncontrolled component mode
9. Upload lifecycle events
10. File state tracking (uploading/done/error)
11. Preview on click
12. Clear all files button
13. Progress tracking
14. Form integration (name attribute, HiddenInput)

### Optional Innovations (<60% adoption)
1. Directory/folder upload
2. Camera capture (mobile)
3. Auto-upload on selection
4. Custom request handler
5. Picture list with thumbnails
6. Template customization system
7. Download uploaded files
8. Clipboard paste support
9. File transformation pipeline
10. Chunked upload (for large files)

### API Design Recommendations

**Core Props**:
- `value` / `onChange`: Controlled state
- `multiple`: Allow multiple files
- `accept`: MIME type filter
- `maxFiles`: File count limit
- `maxSize`: File size limit
- `disabled`: Disable interaction

**UI Props**:
- `showFileList`: Toggle file list
- `itemRender`: Custom file rendering
- `icon`: Custom icon
- `className`: CSS classes

**Validation Props**:
- `validate`: Custom validation function
- `onError`: Validation error callback
- `error`: Error message display

**Choose Architecture**:
- **Selection-only** (simpler, more flexible)
- **Full upload** (complete, faster implementation)
- **Compositional** (maximum control)

## Testing Considerations

Comprehensive testing should cover:

1. **File Selection**:
   - Single file selection
   - Multiple file selection
   - File type filtering
   - Directory selection (if supported)

2. **Drag and Drop**:
   - Drag over feedback
   - Drop to select files
   - Multiple file drops
   - Invalid file drops

3. **Validation**:
   - File type validation
   - File size limits
   - File count limits
   - Custom validation rules

4. **File Management**:
   - Display file list
   - Show file metadata
   - Remove individual files
   - Clear all files

5. **State Management**:
   - Controlled mode
   - Uncontrolled mode
   - onChange callbacks
   - State persistence

6. **Upload (if supported)**:
   - Upload progress
   - Upload success
   - Upload failure
   - Network errors

7. **Accessibility**:
   - Keyboard navigation
   - Screen reader support
   - ARIA attributes
   - Focus management

8. **Edge Cases**:
   - No files selected
   - Very large files
   - Many files (100+)
   - Invalid file types
   - Network failures

## Framework Comparison Summary

| Feature | Chakra UI | Ant Design | Mantine | Nuxt UI | PrimeReact |
|---------|-----------|------------|---------|---------|------------|
| **Sub-components** | ✅ 14 components | ❌ Single | ❌ Single | ❌ Single | ❌ Single + Dragger |
| **Auto-upload** | ❌ No | ✅ Yes (default) | ❌ No | ❌ No | ⚠️ Optional (auto prop) |
| **Custom request** | ⚠️ Manual implementation | ✅ customRequest prop | ⚠️ Manual | ⚠️ Manual | ✅ customRequest prop |
| **Display types** | ⚠️ Via composition | ✅ 3 types (text/picture/card) | ❌ Single | ⚠️ 2 variants (area/button) | ⚠️ 2 modes (basic/advanced) |
| **Drag and drop** | ✅ Dropzone component | ✅ Upload.Dragger | ⚠️ Built-in but basic | ✅ Area variant | ✅ Built-in |
| **Progress tracking** | ⚠️ Via context | ✅ Built-in | ❌ No | ❌ No | ✅ Built-in |
| **File previews** | ✅ ItemPreview | ✅ Built-in | ⚠️ Custom valueComponent | ✅ Slots | ✅ Templates |
| **Validation hooks** | ✅ validate, onFileChange | ✅ beforeUpload | ⚠️ Via error prop | ⚠️ External (Zod) | ✅ onValidationFail |
| **Max file count** | ✅ maxFiles | ✅ maxCount | ❌ No | ✅ max | ✅ maxFileSize |
| **Max file size** | ⚠️ Via validate | ❌ Via beforeUpload | ❌ No built-in | ⚠️ External validation | ✅ maxFileSize |
| **Directory upload** | ✅ directory prop | ✅ directory prop | ❌ No | ❌ No | ❌ No |
| **Camera capture** | ❌ No | ❌ No | ✅ capture prop | ❌ No | ❌ No |
| **Clipboard paste** | ✅ Unique | ❌ No | ❌ No | ❌ No | ❌ No |
| **Custom rendering** | ✅ Composition | ✅ itemRender | ⚠️ valueComponent | ✅ Slots (4 types) | ✅ Templates (3 types) |
| **Form integration** | ✅ HiddenInput | ✅ name attribute | ✅ name/form props | ⚠️ Via slots | ✅ name/form attributes |
| **TypeScript** | ✅ Full | ✅ Full | ✅ Best (generics) | ✅ Full | ✅ Full |
| **Accessibility** | ✅ Excellent | ✅ Good | ✅ Excellent | ✅ Good | ✅ Good |
| **API complexity** | Highest (compositional) | High (many props) | Low (input-like) | Medium (Vue patterns) | High (many props + events) |
| **Best for** | Custom complex UIs | Enterprise auto-upload | Simple input-like | Vue/Nuxt apps | PrimeReact ecosystem |

## Key Takeaways

### Design Patterns:
1. **Selection is universal**: All handle file selection UI
2. **Upload responsibility varies**: Split between selection-only vs full upload management
3. **Drag-and-drop standard**: All provide drop zones
4. **Validation is critical**: All support file type/size validation
5. **Customization is key**: Most provide custom rendering capabilities

### Implementation Approaches:
1. **Compositional** (Chakra): Maximum flexibility through sub-components
2. **Full-featured** (Ant, Prime): Complete upload lifecycle management
3. **Input-first** (Mantine, Nuxt): Enhanced input field approach

### Framework Trends:
1. **Moving toward**: Composition, TypeScript, accessibility, form integration
2. **Diverging on**: Upload responsibility (selection-only vs full upload)
3. **Innovating in**: Custom rendering, validation patterns, mobile support

### Selection Criteria:
- **Need maximum customization**: Chakra UI (14 sub-components)
- **Need auto-upload**: Ant Design or PrimeReact (built-in upload)
- **Want simplicity**: Mantine (input-like API)
- **Using Vue/Nuxt**: Nuxt UI (v-model, slots, Zod)
- **Using PrimeReact**: PrimeReact (ecosystem consistency)
- **Need mobile camera**: Mantine (capture prop)
- **Need clipboard paste**: Chakra UI (unique feature)

## Raw Data

Individual framework reports available at:
- `/ai/research/file-upload/chakra-ui/usage-patterns.md`
- `/ai/research/file-upload/ant-design/usage-patterns.md`
- `/ai/research/file-upload/mantine/usage-patterns.md`
- `/ai/research/file-upload/nuxt-ui/usage-patterns.md`
- `/ai/research/file-upload/primereact/usage-patterns.md`
