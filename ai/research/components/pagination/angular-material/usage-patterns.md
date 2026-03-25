# Angular Material - Paginator Usage Patterns

## Component URL
https://material.angular.dev/components/paginator/overview
Status: ⚠️ Redirected from https://material.angular.io/components/paginator (301 Moved Permanently)
Version: Current (Angular Material 19+)
Last Verified: 2025-11-06

## Documentation Quality
Good - Official Angular Material documentation exists but detailed API information is primarily found through community resources, Stack Overflow discussions, and GitHub examples. The component is well-established with extensive real-world usage examples.

## Component Definition
- **Core purpose**: Divides large datasets into smaller, manageable pages with user-controlled navigation and page size selection. Designed to integrate seamlessly with Angular Material's mat-table component.
- **Mental model**: A control bar that sits below content (typically a table) allowing users to navigate through pages and control how many items appear per page. Users understand it as "navigation for long lists/tables."
- **Semantic meaning**: Communicates the current position within a dataset (e.g., "Page 1 of 10"), provides controls to move between pages, and allows users to choose how much data to view at once.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling
- **Not Present**: Feature not available

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Page numbers | ❌ | Not Present | Shows page range text (e.g., "1-10 of 100") but not discrete page number buttons |
| Previous/Next buttons | ✅ | Native | Built-in navigation buttons with icons |
| First/Last buttons | ✅ | Native | Optional via `showFirstLastButtons` input |
| Page size selector | ✅ | Native | Dropdown menu via `pageSizeOptions` input |
| Total count display | ✅ | Native | Displays as "Page X of Y" or "1-10 of 100" format |
| Quick jumper | ❌ | Not Present | No direct page number input field |
| Range display | ✅ | Native | Shows current item range (e.g., "1-10 of 100") |
| Items per page label | ✅ | Native | Customizable via MatPaginatorIntl |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | Not Present | No visual size variants (small, medium, large) |
| Simplified mode | ✅ | Native | Can hide page size selector via `hidePageSize` |
| Button style | ✅ | Native | Material Design icon buttons (consistent styling) |
| Disabled state | ✅ | Native | Via `disabled` input, prevents all interaction |
| Custom rendering | ✅ | Native | MatPaginatorIntl for label customization |
| Color theming | ✅ | Native | Via `color` input (inherits Material theme) |
| First/Last visibility | ✅ | Native | Toggle via `showFirstLastButtons` input |
| Hide page size | ✅ | Native | Via `hidePageSize` input |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange callback | ✅ | Native | `(page)` output emits PageEvent object |
| Controlled mode | ✅ | Native | Via `pageIndex`, `pageSize`, `length` inputs |
| Uncontrolled mode | ✅ | Native | Can initialize with defaults and let paginator manage state |
| Keyboard navigation | ✅ | Native | Full keyboard support with tab navigation, disabled buttons properly excluded from tab order |
| PageEvent data | ✅ | Native | Emits `{pageIndex, previousPageIndex, pageSize, length}` |
| Integration with table | ✅ | Native | Direct integration with MatTableDataSource |
| Automatic updates | ✅ | Native | When connected to MatTableDataSource, automatically updates table |
| Internationalization | ✅ | Native | Full i18n support via MatPaginatorIntl and @angular/localize |
| Initialized event | ✅ | Native | `(initialized)` output for lifecycle hooks |

## Code Examples

### Basic Usage
```typescript
import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'paginator-basic',
  template: `
    <mat-paginator
      [length]="100"
      [pageSize]="10"
      [pageSizeOptions]="[5, 10, 25, 100]"
      [showFirstLastButtons]="true"
      (page)="onPageChange($event)">
    </mat-paginator>
  `,
  imports: [MatPaginatorModule]
})
export class PaginatorBasicExample {
  onPageChange(event: PageEvent) {
    console.log('Page event:', event);
    // event.pageIndex: current page index (0-based)
    // event.previousPageIndex: previous page index
    // event.pageSize: items per page
    // event.length: total items
  }
}
```

### Integration with mat-table
```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

interface Employee {
  id: number;
  name: string;
  position: string;
}

@Component({
  selector: 'table-paginator-example',
  template: `
    <table mat-table [dataSource]="dataSource">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let element">{{element.name}}</td>
      </ng-container>
      <!-- More columns... -->
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator
      #paginator
      [pageSizeOptions]="[5, 10, 20]"
      [pageSize]="10"
      showFirstLastButtons>
    </mat-paginator>
  `,
  imports: [MatTableModule, MatPaginatorModule]
})
export class TablePaginatorExample implements AfterViewInit {
  @ViewChild('paginator') paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'position'];
  dataSource = new MatTableDataSource<Employee>([
    { id: 1, name: 'John Doe', position: 'Developer' },
    // ... more data
  ]);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
```

### Internationalization (Custom Labels)
```typescript
import { Component, Injectable } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import '@angular/localize/init';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  // Customizable labels
  firstPageLabel = $localize`First page`;
  itemsPerPageLabel = $localize`Items per page:`;
  lastPageLabel = $localize`Last page`;
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} of ${amountPages}`;
  }
}

@Component({
  selector: 'paginator-intl-example',
  template: `
    <mat-paginator [length]="100" [pageSize]="10"></mat-paginator>
  `,
  imports: [MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }]
})
export class PaginatorIntlExample {}
```

### Hide Page Size Selector
```typescript
@Component({
  selector: 'paginator-simple',
  template: `
    <mat-paginator
      [length]="100"
      [pageSize]="20"
      [hidePageSize]="true"
      [showFirstLastButtons]="true">
    </mat-paginator>
  `
})
export class PaginatorSimpleExample {}
```

[View Live Examples](https://material.angular.dev/components/paginator/examples)

## Notable Features

### 1. **Seamless MatTableDataSource Integration**
The paginator directly connects to MatTableDataSource via a simple property assignment (`dataSource.paginator = this.paginator`), automatically handling all pagination logic without manual event handling.

### 2. **PageEvent Object Structure**
Every page change emits a comprehensive PageEvent with:
- `pageIndex`: Current page (0-based)
- `previousPageIndex`: Previous page (useful for detecting navigation direction)
- `pageSize`: Current items per page
- `length`: Total items

This enables developers to determine if the user clicked next/previous by comparing indices.

### 3. **Full Internationalization Support**
The MatPaginatorIntl service provides complete control over all label text with built-in support for Angular's @angular/localize system, making it truly framework-native for i18n.

### 4. **Accessibility-First Design**
- Full keyboard navigation with tab support
- Recent fix ensures disabled buttons are excluded from tab order (PR #30627)
- ARIA labels for screen readers
- Tab index management for proper assistive technology support
- Announces navigation and page ranges to screen readers

### 5. **Flexible Page Size Configuration**
The `pageSizeOptions` array is flexible - the current `pageSize` automatically appears in the dropdown even if not explicitly included in the options array.

### 6. **Dynamic Length Updates**
The `length` property can be updated dynamically, and the paginator automatically recalculates the number of pages via `getNumberOfPages()` method.

### 7. **Initialization Event**
Provides `(initialized)` output event for component lifecycle integration, useful for setup logic.

### 8. **Material Design Theming**
Integrates with Material Design 3 tokens and color system, supporting color customization via the `color` input.

## API Summary

### Inputs
- `color: ThemePalette` - Theme color palette
- `disabled: boolean` - Disables all interaction
- `hidePageSize: boolean` - Hides page size selector
- `length: number` - Total number of items (required)
- `pageIndex: number` - Current page index (0-based, default: 0)
- `pageSize: number` - Items per page (default: 50)
- `pageSizeOptions: number[]` - Available page size options
- `showFirstLastButtons: boolean` - Show first/last navigation buttons

### Outputs
- `(page): EventEmitter<PageEvent>` - Emitted when page changes
- `(initialized): EventEmitter<void>` - Emitted when component initializes

### PageEvent Interface
```typescript
interface PageEvent {
  pageIndex: number;          // Current page (0-based)
  previousPageIndex: number;  // Previous page
  pageSize: number;           // Items per page
  length: number;             // Total items
}
```

### Methods
- `getNumberOfPages(): number` - Calculates total number of pages

### Customization Service
- `MatPaginatorIntl` - Injectable service for label customization

## Research Notes

### Documentation Access
The official Angular Material site redirected from material.angular.io to material.angular.dev (301 redirect), indicating a recent documentation infrastructure update. The overview page structure was difficult to scrape directly, but comprehensive API information was readily available through community resources.

### Framework Approach
Angular Material takes a **component-centric, integration-focused approach**:
1. **Single-purpose component**: Unlike some frameworks that embed pagination in tables, Angular Material provides a standalone paginator
2. **Smart integration**: The MatTableDataSource integration pattern shows thoughtful design for the primary use case while maintaining flexibility
3. **Enterprise focus**: Strong TypeScript typing, comprehensive events, and full i18n support indicate enterprise application focus
4. **Accessibility commitment**: Recent PRs addressing keyboard navigation show ongoing commitment to accessibility
5. **Material Design consistency**: Strictly follows Material Design patterns and theming

### Unique Characteristics
- **No page number buttons**: Focuses on range display ("1-10 of 100") rather than discrete page numbers, which is a Material Design pattern choice
- **Dependency injection for customization**: Using MatPaginatorIntl service for label customization is very Angular-idiomatic
- **ViewChild pattern**: Standard Angular pattern requiring AfterViewInit lifecycle hook for table integration
- **Observable changes**: MatPaginatorIntl uses RxJS Subject for reactive label updates

### Community Insights
Stack Overflow discussions reveal:
- Common integration pattern with mat-table is well-understood
- Most questions focus on dynamic length updates and state persistence
- The PageEvent structure is praised for providing navigation direction detection
- Recent accessibility improvements addressed real user feedback about keyboard navigation with disabled buttons

### Comparison to Other Frameworks
Angular Material's paginator is notably **simpler** than many other frameworks:
- ❌ No discrete page number buttons (only range display)
- ❌ No quick jump to page N
- ❌ No size variants (compact, etc.)
- ✅ Strong TypeScript integration
- ✅ Excellent table integration pattern
- ✅ Superior internationalization approach
- ✅ Comprehensive accessibility support

This simplicity appears intentional, following Material Design guidelines rather than trying to support every possible pagination pattern.
