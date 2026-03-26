# Angular Material - Sidenav Component

## Component Overview

The Angular Material Sidenav component provides collapsible side content alongside a primary content area, designed specifically for fullscreen applications. It delivers navigation panels, table of contents, filters, or auxiliary information that can be shown or hidden based on user interaction or screen size.

**Core purpose**: Provides responsive, accessible side navigation for fullscreen Angular applications with flexible display modes and programmatic control. The component supports both temporary overlays and permanent side-by-side layouts.

**Architecture**: A three-component composition system where `mat-sidenav-container` acts as the structural wrapper, `mat-sidenav` represents the collapsible side panel(s), and `mat-sidenav-content` wraps the primary content area. The container manages layout, backdrop visibility, and scroll interactions.

**Common use cases**: Primary navigation menus, contextual help panels, filtering sidebars, table of contents, settings panels, multi-level navigation hierarchies, responsive mobile-to-desktop layouts.

**Note**: Angular Material also provides `mat-drawer` which shares identical API but lacks fixed positioning support. Drawers are designed for localized sections within a page rather than fullscreen apps.

## Usage Patterns

### Basic Usage

The simplest Sidenav requires a container with at least one sidenav and content area:

```typescript
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-basic-sidenav',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule],
  template: `
    <mat-sidenav-container class="example-container">
      <mat-sidenav mode="side" opened>
        Sidenav content
      </mat-sidenav>
      <mat-sidenav-content>
        Main content
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .example-container {
      height: 100vh;
    }
  `]
})
export class BasicSidenavComponent {}
```

**Implicit Content**: If `mat-sidenav-content` is omitted, all non-sidenav children automatically become content:

```html
<mat-sidenav-container>
  <mat-sidenav>Navigation</mat-sidenav>
  <!-- This becomes implicit mat-sidenav-content -->
  <div>Main content area</div>
</mat-sidenav-container>
```

### Content Patterns

#### Header/Body/Footer Structure

Organize sidenav content using standard HTML semantic elements:

```html
<mat-sidenav mode="side" opened>
  <header>
    <h2>Navigation</h2>
    <button mat-icon-button (click)="sidenav.close()">
      <mat-icon>close</mat-icon>
    </button>
  </header>

  <nav>
    <mat-nav-list>
      <a mat-list-item routerLink="/home">Home</a>
      <a mat-list-item routerLink="/about">About</a>
      <a mat-list-item routerLink="/contact">Contact</a>
    </mat-nav-list>
  </nav>

  <footer>
    <p>Version 1.0.0</p>
  </footer>
</mat-sidenav>
```

#### Close Button Pattern

Common pattern for adding close functionality within sidenav:

```html
<mat-sidenav #sidenav mode="over">
  <button mat-icon-button (click)="sidenav.close()">
    <mat-icon>close</mat-icon>
  </button>
  <mat-nav-list>
    <a mat-list-item routerLink="/dashboard">Dashboard</a>
  </mat-nav-list>
</mat-sidenav>
```

#### Custom Content Composition

Sidenav can contain any Angular components or HTML content:

```html
<mat-sidenav mode="side">
  <!-- Search widget -->
  <app-search-bar></app-search-bar>

  <!-- Filter controls -->
  <mat-expansion-panel>
    <mat-expansion-panel-header>Filters</mat-expansion-panel-header>
    <app-filter-controls></app-filter-controls>
  </mat-expansion-panel>

  <!-- User profile -->
  <app-user-profile></app-user-profile>
</mat-sidenav>
```

### Placement Patterns

#### Left/Right Positioning

Control sidenav placement using the `position` property:

```html
<!-- Left side (default: "start") -->
<mat-sidenav-container>
  <mat-sidenav position="start">Left navigation</mat-sidenav>
  <mat-sidenav-content>Main content</mat-sidenav-content>
</mat-sidenav-container>

<!-- Right side -->
<mat-sidenav-container>
  <mat-sidenav position="end">Right panel</mat-sidenav>
  <mat-sidenav-content>Main content</mat-sidenav-content>
</mat-sidenav-container>
```

**RTL Support**: In right-to-left languages, `start` and `end` automatically swap to maintain proper directionality.

#### Dual Sidenav Layout

Support both left and right panels (maximum one per side):

```html
<mat-sidenav-container>
  <mat-sidenav position="start" mode="side" opened>
    Primary navigation
  </mat-sidenav>

  <mat-sidenav position="end" mode="over">
    Contextual actions
  </mat-sidenav>

  <mat-sidenav-content>
    Main content area
  </mat-sidenav-content>
</mat-sidenav-container>
```

**Common Error**: Attempting multiple sidenavs at the same position throws: `"A drawer was already declared for 'position=...'"`. Default position is `start`.

#### Top/Bottom Positioning

While not directly supported, vertical drawers can be achieved with CSS:

```css
mat-sidenav {
  width: 100%;
  height: 200px;
  position: fixed;
  top: 0;
}
```

**Note**: This pattern is uncommon; consider alternatives like `mat-toolbar` or header components.

### State Patterns

#### Open/Closed State Management

Control sidenav visibility programmatically:

```typescript
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav-state',
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav mode="side" [(opened)]="opened">
        Navigation content
      </mat-sidenav>
      <mat-sidenav-content>
        <button mat-button (click)="sidenav.toggle()">Toggle</button>
        <button mat-button (click)="sidenav.open()">Open</button>
        <button mat-button (click)="sidenav.close()">Close</button>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class SidenavStateComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  opened = true;
}
```

**Methods**:
- `open()`: Returns `Promise<boolean>` resolving when animation completes
- `close()`: Returns `Promise<boolean>` resolving when animation completes
- `toggle()`: Returns `Promise<boolean>` alternating between open/close

#### Two-Way Binding

Sync sidenav state with component property:

```html
<mat-sidenav [(opened)]="isOpen">
  Content
</mat-sidenav>

<mat-checkbox [(ngModel)]="isOpen">Open Sidenav</mat-checkbox>
```

#### Loading State Pattern

Show loading indicator while fetching sidenav content:

```typescript
@Component({
  template: `
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>
        @if (loading) {
          <mat-spinner></mat-spinner>
        } @else {
          <mat-nav-list>
            @for (item of navItems; track item.id) {
              <a mat-list-item [routerLink]="item.route">
                {{item.label}}
              </a>
            }
          </mat-nav-list>
        }
      </mat-sidenav>
      <mat-sidenav-content>Main content</mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class SidenavLoadingComponent {
  loading = true;
  navItems: NavItem[] = [];

  ngOnInit() {
    this.loadNavigation();
  }

  async loadNavigation() {
    this.navItems = await this.navService.getItems();
    this.loading = false;
  }
}
```

### Variation Patterns

#### Display Modes

Three distinct display modes control layout behavior:

**Mode: "over" (Default)**
- Sidenav floats above content with backdrop
- Content remains stationary
- Best for mobile/temporary navigation

```html
<mat-sidenav mode="over">
  Navigation
</mat-sidenav>
```

**Mode: "push"**
- Sidenav pushes content aside with backdrop
- Content shifts when sidenav opens
- Best for emphasizing navigation importance

```html
<mat-sidenav mode="push">
  Navigation
</mat-sidenav>
```

**Mode: "side"**
- Sidenav and content render side-by-side
- No backdrop shown
- Content area shrinks to accommodate sidenav
- Best for desktop/permanent navigation

```html
<mat-sidenav mode="side" opened>
  Navigation
</mat-sidenav>
```

#### Dynamic Mode Switching

Switch modes based on screen size or user preference:

```typescript
@Component({
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav [mode]="modeControl.value || 'over'">
        <mat-radio-group [formControl]="modeControl">
          <label>Display Mode:</label>
          <mat-radio-button value="over">Over</mat-radio-button>
          <mat-radio-button value="side">Side</mat-radio-button>
          <mat-radio-button value="push">Push</mat-radio-button>
        </mat-radio-group>
      </mat-sidenav>
      <mat-sidenav-content>
        <button mat-button (click)="sidenav.toggle()">Toggle</button>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class SidenavModesComponent {
  modeControl = new FormControl('over');
}
```

#### Size Variations

Control sidenav width via CSS:

```css
/* Narrow sidenav */
mat-sidenav.narrow {
  width: 56px;
}

/* Standard sidenav */
mat-sidenav.standard {
  width: 256px;
}

/* Wide sidenav */
mat-sidenav.wide {
  width: 320px;
}

/* Responsive width */
mat-sidenav.responsive {
  width: 100%;
  max-width: 360px;
}
```

**Note**: Avoid percentage-based widths as resize events aren't automatically handled.

#### Mini/Expanded Pattern

Toggle between collapsed icon view and expanded text view:

```typescript
@Component({
  template: `
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened [class.mini]="miniMode">
        <mat-nav-list>
          <a mat-list-item>
            <mat-icon>home</mat-icon>
            @if (!miniMode) {
              <span>Home</span>
            }
          </a>
          <a mat-list-item>
            <mat-icon>settings</mat-icon>
            @if (!miniMode) {
              <span>Settings</span>
            }
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <button mat-icon-button (click)="miniMode = !miniMode">
          <mat-icon>menu</mat-icon>
        </button>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    mat-sidenav {
      width: 256px;
      transition: width 0.3s;
    }
    mat-sidenav.mini {
      width: 64px;
    }
  `]
})
export class MiniSidenavComponent {
  miniMode = false;
}
```

#### Nested Navigation Pattern

Create hierarchical navigation with expansion panels:

```html
<mat-sidenav mode="side" opened>
  <mat-nav-list>
    <a mat-list-item routerLink="/dashboard">Dashboard</a>

    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-icon>inventory</mat-icon>
        Products
      </mat-expansion-panel-header>
      <mat-nav-list>
        <a mat-list-item routerLink="/products/list">All Products</a>
        <a mat-list-item routerLink="/products/add">Add Product</a>
      </mat-nav-list>
    </mat-expansion-panel>

    <a mat-list-item routerLink="/settings">Settings</a>
  </mat-nav-list>
</mat-sidenav>
```

### Interactive Patterns

#### Click Outside to Close

Enable backdrop clicking to close sidenav (default for `over` and `push` modes):

```html
<!-- Default behavior: closes on backdrop click -->
<mat-sidenav mode="over">
  Navigation
</mat-sidenav>

<!-- Disable closing on backdrop click -->
<mat-sidenav mode="over" [disableClose]="true">
  Navigation
</mat-sidenav>
```

Listen to backdrop clicks:

```html
<mat-sidenav (backdropClick)="onBackdropClick()">
  Navigation
</mat-sidenav>
```

```typescript
onBackdropClick() {
  console.log('Backdrop clicked');
  // Custom logic before closing
}
```

#### ESC Key Handling

Close sidenav with Escape key (default behavior):

```html
<!-- Default: ESC closes sidenav -->
<mat-sidenav mode="over">
  Navigation
</mat-sidenav>

<!-- Disable ESC closing -->
<mat-sidenav mode="over" [disableClose]="true">
  Navigation
</mat-sidenav>
```

Custom keyboard handling:

```typescript
@Component({
  template: `
    <mat-sidenav #sidenav
      (keydown)="handleKeydown($event, sidenav)">
      Navigation content
    </mat-sidenav>
  `
})
export class KeyboardSidenavComponent {
  handleKeydown(event: KeyboardEvent, sidenav: MatSidenav) {
    if (event.key === 'Escape' && sidenav.mode === 'over') {
      sidenav.close();
      event.preventDefault();
    }
  }
}
```

#### Event Callbacks

React to sidenav state changes:

```typescript
@Component({
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav
        (opened)="onOpened()"
        (closed)="onClosed()"
        (backdropClick)="onBackdropClick()">
        Navigation
      </mat-sidenav>
      <mat-sidenav-content>
        <p>Events log:</p>
        @for (event of events; track $index) {
          <div>{{event}}</div>
        }
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class SidenavEventsComponent {
  events: string[] = [];

  onOpened() {
    this.events.push('Sidenav opened at ' + new Date().toLocaleTimeString());
  }

  onClosed() {
    this.events.push('Sidenav closed at ' + new Date().toLocaleTimeString());
  }

  onBackdropClick() {
    this.events.push('Backdrop clicked');
  }
}
```

#### Focus Management

Control focus behavior when sidenav opens:

```html
<!-- Auto-focus first element (default for over/push) -->
<mat-sidenav mode="over" [autoFocus]="true">
  <input placeholder="Search...">
</mat-sidenav>

<!-- Target specific element with cdkFocusInitial -->
<mat-sidenav mode="over" [autoFocus]="true">
  <h2>Menu</h2>
  <button mat-button cdkFocusInitial>First Action</button>
  <button mat-button>Second Action</button>
</mat-sidenav>

<!-- Disable auto-focus -->
<mat-sidenav mode="side" [autoFocus]="false">
  Navigation
</mat-sidenav>
```

**Default behavior**:
- `over` and `push` modes: `autoFocus="true"`
- `side` mode: `autoFocus="false"`

#### Swipe Gestures (Mobile)

Implement touch gestures for mobile interactions:

```typescript
import { Component } from '@angular/core';

@Component({
  template: `
    <mat-sidenav-container
      (swipeleft)="onSwipeLeft()"
      (swiperight)="onSwipeRight()">
      <mat-sidenav #sidenav mode="over">
        Navigation
      </mat-sidenav>
      <mat-sidenav-content>
        Main content
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class SwipeSidenavComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  onSwipeRight() {
    this.sidenav.open();
  }

  onSwipeLeft() {
    this.sidenav.close();
  }
}
```

**Note**: Requires HammerJS for gesture support.

### Responsive Patterns

#### Breakpoint-Based Behavior

Use BreakpointObserver to adapt sidenav to screen size:

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-responsive-sidenav',
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav
        [mode]="isMobile ? 'over' : 'side'"
        [opened]="!isMobile">
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard">Dashboard</a>
          <a mat-list-item routerLink="/analytics">Analytics</a>
          <a mat-list-item routerLink="/settings">Settings</a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        @if (isMobile) {
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
        }
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class ResponsiveSidenavComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;

  constructor(private observer: BreakpointObserver) {}

  ngAfterViewInit() {
    this.observer.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;

      if (this.isMobile) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }
}
```

#### Custom Breakpoint

Define specific breakpoint thresholds:

```typescript
ngAfterViewInit() {
  this.observer.observe(['(max-width: 800px)']).subscribe(result => {
    if (result.matches) {
      this.sidenav.mode = 'over';
      this.sidenav.close();
    } else {
      this.sidenav.mode = 'side';
      this.sidenav.open();
    }
  });
}
```

#### Multiple Breakpoints

Handle tablet and mobile separately:

```typescript
ngAfterViewInit() {
  this.observer.observe([
    Breakpoints.HandsetPortrait,
    Breakpoints.TabletPortrait
  ]).subscribe(result => {
    if (result.breakpoints[Breakpoints.HandsetPortrait]) {
      // Mobile phone: overlay mode, closed by default
      this.sidenav.mode = 'over';
      this.sidenav.close();
    } else if (result.breakpoints[Breakpoints.TabletPortrait]) {
      // Tablet: push mode, closed by default
      this.sidenav.mode = 'push';
      this.sidenav.close();
    } else {
      // Desktop: side mode, open by default
      this.sidenav.mode = 'side';
      this.sidenav.open();
    }
  });
}
```

### Fixed Positioning Pattern

Enable fixed positioning for sidenav (sidenav only, not drawer):

```html
<mat-sidenav
  fixedInViewport
  [fixedTopGap]="64"
  [fixedBottomGap]="0">
  Navigation content
</mat-sidenav>
```

**Use case**: Fixed sidenav with scrollable content below a fixed toolbar.

```typescript
@Component({
  template: `
    <mat-toolbar color="primary" class="fixed-toolbar">
      <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>My App</span>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav
        mode="over"
        fixedInViewport
        [fixedTopGap]="64">
        <mat-nav-list>
          <a mat-list-item>Navigation</a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        Content scrolls independently
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .fixed-toolbar {
      position: fixed;
      top: 0;
      z-index: 2;
    }
    .sidenav-container {
      margin-top: 64px;
      height: calc(100vh - 64px);
    }
  `]
})
export class FixedSidenavComponent {}
```

### Backdrop Customization

Control backdrop display:

```html
<!-- Force backdrop for side mode -->
<mat-sidenav-container [hasBackdrop]="true">
  <mat-sidenav mode="side">Navigation</mat-sidenav>
  <mat-sidenav-content>Content</mat-sidenav-content>
</mat-sidenav-container>

<!-- Remove backdrop from over mode -->
<mat-sidenav-container [hasBackdrop]="false">
  <mat-sidenav mode="over">Navigation</mat-sidenav>
  <mat-sidenav-content>Content</mat-sidenav-content>
</mat-sidenav-container>

<!-- Conditional backdrop -->
<mat-sidenav-container [hasBackdrop]="showBackdrop">
  <mat-sidenav mode="over">Navigation</mat-sidenav>
  <mat-sidenav-content>Content</mat-sidenav-content>
</mat-sidenav-container>
```

**Default backdrop behavior**:
- `over` mode: backdrop shown
- `push` mode: backdrop shown
- `side` mode: no backdrop

### Scroll Interaction Pattern

Access scroll events from sidenav content:

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';

@Component({
  template: `
    <mat-sidenav-container #sidenavContainer>
      <mat-sidenav mode="side" opened>Navigation</mat-sidenav>
      <mat-sidenav-content>
        <div style="height: 2000px">
          Scrollable content
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class ScrollSidenavComponent implements AfterViewInit {
  @ViewChild('sidenavContainer')
  sidenavContainer!: MatSidenavContainer;

  ngAfterViewInit() {
    this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {
      console.log('Content scrolled');
      // Handle scroll position
      const scrollTop = this.sidenavContainer.scrollable
        .getElementRef().nativeElement.scrollTop;
      console.log('Scroll position:', scrollTop);
    });
  }
}
```

### Auto-sizing Pattern

Enable automatic container resizing when sidenav content changes:

```html
<mat-sidenav mode="side" [autosize]="true">
  <div [style.height.px]="dynamicHeight">
    Dynamic content
  </div>
</mat-sidenav>
```

**Performance note**: `autosize` uses ResizeObserver and may impact performance. Use only when necessary.

## Key Properties/Props

### MatSidenavContainer Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `hasBackdrop` | `boolean \| null` | `null` | Whether to show backdrop. Null uses mode default (true for over/push, false for side) |
| `backdropClass` | `string` | `''` | Custom CSS class for backdrop element |
| `autosize` | `boolean` | `false` | Whether container should resize when sidenav content changes (performance impact) |
| `scrollable` | `CdkScrollable` | - | Reference to the underlying scrollable element (read-only) |

### MatSidenav Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `position` | `'start' \| 'end'` | `'start'` | Side of the viewport to attach sidenav. Supports RTL |
| `mode` | `'over' \| 'push' \| 'side'` | `'over'` | Display mode controlling layout behavior |
| `opened` | `boolean` | `false` | Whether sidenav is open. Supports two-way binding with `[(opened)]` |
| `disableClose` | `boolean` | `false` | Whether sidenav can be closed by ESC key or backdrop click |
| `autoFocus` | `boolean` | `true` for over/push, `false` for side | Whether to focus first tabbable element on open |
| `fixedInViewport` | `boolean` | `false` | Whether sidenav uses fixed positioning (sidenav only, not drawer) |
| `fixedTopGap` | `number` | `0` | Pixels of space above fixed sidenav |
| `fixedBottomGap` | `number` | `0` | Pixels of space below fixed sidenav |

### MatSidenav Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `open()` | `Promise<boolean>` | Opens the sidenav. Resolves when animation completes |
| `close()` | `Promise<boolean>` | Closes the sidenav. Resolves when animation completes |
| `toggle()` | `Promise<boolean>` | Toggles the sidenav open/closed state |

### MatSidenav Events

| Event | Type | Description |
|-------|------|-------------|
| `(opened)` | `void` | Emitted when sidenav opening animation completes |
| `(closed)` | `void` | Emitted when sidenav closing animation completes |
| `(openedStart)` | `void` | Emitted when sidenav opening animation starts |
| `(closedStart)` | `void` | Emitted when sidenav closing animation starts |
| `(backdropClick)` | `void` | Emitted when backdrop is clicked |

### MatSidenavContent Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `scrollable` | `CdkScrollable` | - | Reference to the underlying scrollable element (read-only) |

## Code Examples

### Example 1: Basic Sidenav with Toggle

```typescript
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'basic-sidenav-example',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule],
  template: `
    <mat-sidenav-container class="example-container">
      <mat-sidenav #sidenav mode="side">
        Sidenav content
      </mat-sidenav>
      <mat-sidenav-content>
        <button mat-button (click)="sidenav.toggle()">
          Toggle sidenav
        </button>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .example-container {
      height: 100vh;
    }
  `]
})
export class BasicSidenavExample {}
```

### Example 2: Open/Close with Events

```typescript
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sidenav-events-example',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatCheckboxModule, FormsModule],
  template: `
    <mat-sidenav-container class="example-container">
      <mat-sidenav #sidenav
        mode="side"
        [(opened)]="opened"
        (opened)="events.push('open!')"
        (closed)="events.push('close!')">
        Sidenav content
      </mat-sidenav>

      <mat-sidenav-content>
        <p>
          <mat-checkbox [(ngModel)]="opened">
            sidenav.opened
          </mat-checkbox>
        </p>
        <p>
          <button mat-button (click)="sidenav.toggle()">
            sidenav.toggle()
          </button>
        </p>
        <p>Events:</p>
        <div class="example-events">
          @for (e of events; track $index) {
            <div>{{e}}</div>
          }
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .example-container {
      height: 400px;
      border: 1px solid #ccc;
    }
    .example-events {
      padding: 10px;
      max-height: 200px;
      overflow: auto;
    }
  `]
})
export class SidenavEventsExample {
  opened = false;
  events: string[] = [];
}
```

### Example 3: Mode Switching

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sidenav-mode-example',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-sidenav-container class="example-container">
      <mat-sidenav #sidenav [mode]="mode.value || 'over'">
        <p>
          <button mat-button (click)="sidenav.toggle()">
            Toggle
          </button>
        </p>
        <p>
          <mat-radio-group class="example-radio-group" [formControl]="mode">
            <label>Mode:</label>
            <mat-radio-button value="over">Over</mat-radio-button>
            <mat-radio-button value="side">Side</mat-radio-button>
            <mat-radio-button value="push">Push</mat-radio-button>
          </mat-radio-group>
        </p>
      </mat-sidenav>

      <mat-sidenav-content>
        <p>
          <button mat-button (click)="sidenav.toggle()">
            Toggle
          </button>
        </p>
        <p>
          <mat-radio-group class="example-radio-group" [formControl]="mode">
            <label>Mode:</label>
            <mat-radio-button value="over">Over</mat-radio-button>
            <mat-radio-button value="side">Side</mat-radio-button>
            <mat-radio-button value="push">Push</mat-radio-button>
          </mat-radio-group>
        </p>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .example-container {
      height: 400px;
    }
    .example-radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
    }
  `]
})
export class SidenavModeExample {
  mode = new FormControl('over');
}
```

### Example 4: Dual Sidenav (Left and Right)

```typescript
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'dual-sidenav-example',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule],
  template: `
    <mat-sidenav-container class="example-container">
      <mat-sidenav #leftSidenav position="start" mode="side" opened>
        Left sidenav content
      </mat-sidenav>

      <mat-sidenav #rightSidenav position="end" mode="over">
        Right sidenav content
      </mat-sidenav>

      <mat-sidenav-content>
        <p>
          <button mat-button (click)="leftSidenav.toggle()">
            Toggle Left
          </button>
          <button mat-button (click)="rightSidenav.toggle()">
            Toggle Right
          </button>
        </p>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .example-container {
      height: 500px;
    }
  `]
})
export class DualSidenavExample {}
```

### Example 5: Responsive Sidenav

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'responsive-sidenav-example',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <mat-sidenav-container class="container">
      <mat-sidenav #sidenav
        [mode]="isMobile ? 'over' : 'side'"
        [opened]="!isMobile"
        role="navigation">
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard">
            <mat-icon>dashboard</mat-icon>
            Dashboard
          </a>
          <a mat-list-item routerLink="/analytics">
            <mat-icon>analytics</mat-icon>
            Analytics
          </a>
          <a mat-list-item routerLink="/settings">
            <mat-icon>settings</mat-icon>
            Settings
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        @if (isMobile) {
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
        }
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .container {
      height: 100vh;
    }
  `]
})
export class ResponsiveSidenavExample implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;

  constructor(private observer: BreakpointObserver) {}

  ngAfterViewInit() {
    this.observer.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }
}
```

### Example 6: Sidenav with Backdrop Control

```typescript
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'backdrop-sidenav-example',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule
  ],
  template: `
    <mat-sidenav-container
      class="example-container"
      [hasBackdrop]="hasBackdrop">
      <mat-sidenav #sidenav
        mode="side"
        opened
        (backdropClick)="onBackdropClick()">
        Sidenav content
      </mat-sidenav>

      <mat-sidenav-content>
        <p>
          <mat-checkbox [(ngModel)]="hasBackdrop">
            Show Backdrop
          </mat-checkbox>
        </p>
        <p>Backdrop clicks: {{backdropClicks}}</p>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .example-container {
      height: 400px;
    }
  `]
})
export class BackdropSidenavExample {
  hasBackdrop = false;
  backdropClicks = 0;

  onBackdropClick() {
    this.backdropClicks++;
  }
}
```

### Example 7: Fixed Sidenav with Toolbar

```typescript
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'fixed-sidenav-example',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>My Application</span>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav
        mode="over"
        fixedInViewport
        [fixedTopGap]="64">
        <mat-nav-list>
          <a mat-list-item>
            <mat-icon>home</mat-icon>
            Home
          </a>
          <a mat-list-item>
            <mat-icon>person</mat-icon>
            Profile
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <div style="height: 2000px; padding: 20px;">
          Scrollable content area
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .toolbar {
      position: fixed;
      top: 0;
      z-index: 2;
    }
    .sidenav-container {
      margin-top: 64px;
      height: calc(100vh - 64px);
    }
  `]
})
export class FixedSidenavExample {}
```

### Example 8: Sidenav with Focus Management

```typescript
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'focus-sidenav-example',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule],
  template: `
    <mat-sidenav-container class="example-container">
      <mat-sidenav #sidenav mode="over" [autoFocus]="true">
        <h2>Navigation Menu</h2>
        <button mat-button>First Button</button>
        <button mat-button cdkFocusInitial>
          Focused on Open
        </button>
        <button mat-button>Third Button</button>
      </mat-sidenav>

      <mat-sidenav-content>
        <button mat-raised-button color="primary" (click)="sidenav.open()">
          Open Sidenav
        </button>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .example-container {
      height: 400px;
    }
  `]
})
export class FocusSidenavExample {}
```

### Example 9: Mini Sidenav (Collapsed/Expanded)

```typescript
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mini-sidenav-example',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="container">
      <mat-sidenav mode="side" opened [class.mini]="miniMode">
        <mat-nav-list>
          <a mat-list-item>
            <mat-icon>home</mat-icon>
            @if (!miniMode) {
              <span class="label">Home</span>
            }
          </a>
          <a mat-list-item>
            <mat-icon>settings</mat-icon>
            @if (!miniMode) {
              <span class="label">Settings</span>
            }
          </a>
          <a mat-list-item>
            <mat-icon>help</mat-icon>
            @if (!miniMode) {
              <span class="label">Help</span>
            }
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <button mat-icon-button (click)="miniMode = !miniMode">
          <mat-icon>menu</mat-icon>
        </button>
        <p>Main content area</p>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .container {
      height: 100vh;
    }
    mat-sidenav {
      width: 256px;
      transition: width 0.3s ease;
    }
    mat-sidenav.mini {
      width: 64px;
    }
    .label {
      margin-left: 16px;
    }
  `]
})
export class MiniSidenavExample {
  miniMode = false;
}
```

### Example 10: Sidenav with Nested Navigation

```typescript
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nested-sidenav-example',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule
  ],
  template: `
    <mat-sidenav-container class="container">
      <mat-sidenav mode="side" opened>
        <mat-nav-list>
          <a mat-list-item>
            <mat-icon>dashboard</mat-icon>
            Dashboard
          </a>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>inventory</mat-icon>
                Products
              </mat-panel-title>
            </mat-expansion-panel-header>
            <mat-nav-list>
              <a mat-list-item>All Products</a>
              <a mat-list-item>Add Product</a>
              <a mat-list-item>Categories</a>
            </mat-nav-list>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>people</mat-icon>
                Users
              </mat-panel-title>
            </mat-expansion-panel-header>
            <mat-nav-list>
              <a mat-list-item>All Users</a>
              <a mat-list-item>Add User</a>
              <a mat-list-item>Roles</a>
            </mat-nav-list>
          </mat-expansion-panel>

          <a mat-list-item>
            <mat-icon>settings</mat-icon>
            Settings
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <p>Main content area</p>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .container {
      height: 100vh;
    }
    mat-sidenav {
      width: 280px;
    }
  `]
})
export class NestedSidenavExample {}
```

## Accessibility Features

### ARIA Roles

Apply appropriate ARIA roles based on sidenav content:

```html
<!-- Navigation menu -->
<mat-sidenav role="navigation" aria-label="Main navigation">
  <mat-nav-list>
    <a mat-list-item routerLink="/home">Home</a>
  </mat-nav-list>
</mat-sidenav>

<!-- Table of contents -->
<mat-sidenav role="directory" aria-label="Table of contents">
  <nav>
    <a href="#section1">Section 1</a>
  </nav>
</mat-sidenav>

<!-- Generic region -->
<mat-sidenav role="region" aria-label="Filters">
  <app-filter-panel></app-filter-panel>
</mat-sidenav>

<!-- Main content -->
<mat-sidenav-content role="main">
  Content
</mat-sidenav-content>
```

### Focus Management

Control focus behavior for keyboard users:

```typescript
@Component({
  template: `
    <mat-sidenav #sidenav
      mode="over"
      [autoFocus]="true"
      role="navigation"
      aria-label="Main navigation">
      <h2 id="nav-heading">Navigation</h2>
      <button mat-button cdkFocusInitial>
        First Action
      </button>
      <mat-nav-list>
        <a mat-list-item routerLink="/home">Home</a>
      </mat-nav-list>
    </mat-sidenav>
  `
})
export class AccessibleSidenavComponent {}
```

**Focus order**:
1. When opened, focus moves to first tabbable element
2. Use `cdkFocusInitial` to target specific element
3. When closed, focus returns to trigger element

### Keyboard Support

```typescript
@Component({
  template: `
    <mat-sidenav #sidenav
      (keydown)="handleKeydown($event, sidenav)"
      role="navigation"
      aria-label="Main navigation">
      Navigation content
    </mat-sidenav>
  `
})
export class KeyboardSidenavComponent {
  handleKeydown(event: KeyboardEvent, sidenav: MatSidenav) {
    // ESC closes sidenav (default behavior)
    if (event.key === 'Escape') {
      sidenav.close();
    }

    // Tab trapping within sidenav (if needed)
    if (event.key === 'Tab') {
      // Custom tab trap logic
    }
  }
}
```

**Default keyboard behavior**:
- `Escape`: Closes sidenav (unless `disableClose="true"`)
- `Tab`: Standard focus navigation within sidenav
- Focus automatically trapped in `over` and `push` modes

### Screen Reader Support

Provide descriptive labels and announcements:

```html
<mat-sidenav
  role="navigation"
  aria-label="Main navigation"
  aria-describedby="nav-description">
  <p id="nav-description" class="sr-only">
    Use arrow keys to navigate menu items
  </p>
  <mat-nav-list>
    <a mat-list-item routerLink="/home" aria-label="Go to home page">
      <mat-icon aria-hidden="true">home</mat-icon>
      Home
    </a>
  </mat-nav-list>
</mat-sidenav>
```

**Best practices**:
- Use `aria-label` or `aria-labelledby` for sidenav identification
- Add `aria-hidden="true"` to decorative icons
- Provide descriptive link text
- Announce state changes with live regions

### Color Contrast

Ensure sufficient contrast for visibility:

```css
/* High contrast theme support */
mat-sidenav {
  background-color: var(--sidenav-background);
  color: var(--sidenav-text);
}

@media (prefers-contrast: high) {
  mat-sidenav {
    border: 2px solid var(--border-color);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  mat-sidenav {
    background-color: #1e1e1e;
    color: #ffffff;
  }
}
```

### Backdrop Accessibility

Handle backdrop interactions accessibly:

```typescript
@Component({
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav
        mode="over"
        (backdropClick)="onBackdropClick()"
        [disableClose]="preventBackdropClose"
        role="navigation"
        aria-label="Menu">
        Navigation
      </mat-sidenav>
      <mat-sidenav-content>
        <button mat-raised-button
          (click)="sidenav.open()"
          aria-label="Open navigation menu">
          Open Menu
        </button>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class BackdropAccessibilityComponent {
  preventBackdropClose = false;

  onBackdropClick() {
    // Optionally announce to screen readers
    this.announceToScreenReader('Navigation menu closed');
  }

  announceToScreenReader(message: string) {
    // Implementation using live region
  }
}
```

## Common Patterns

1. **Responsive Navigation**: Use BreakpointObserver to switch between `side` mode (desktop) and `over` mode (mobile)
2. **Fixed Header with Sidenav**: Combine fixed toolbar with `fixedInViewport` sidenav below it
3. **Dual Sidenav Layout**: Left navigation and right contextual panel with `position="start"` and `position="end"`
4. **Mini/Expanded Toggle**: CSS-based width transition for collapsed icon-only and expanded text navigation
5. **Nested Navigation**: Use mat-expansion-panel within sidenav for hierarchical menu structures
6. **Close on Navigation**: Close sidenav automatically when route changes in mobile mode
7. **Persistent Desktop Nav**: Keep sidenav open in `side` mode for desktop, auto-close `over` mode for mobile
8. **Focus Management**: Use `cdkFocusInitial` to target specific element when sidenav opens
9. **Backdrop Customization**: Control backdrop visibility per mode or conditionally based on state
10. **Scroll Synchronization**: Listen to scroll events on sidenav content for synchronized behavior

## Related Components

- **MatDrawer** - Identical API to MatSidenav but without fixed positioning support, designed for localized page sections
- **MatToolbar** - Typically paired with sidenav for application header with menu toggle
- **MatNavList** - Standard navigation list component for sidenav content
- **MatExpansionPanel** - Used within sidenav for hierarchical/nested navigation
- **MatIcon** - Icons for navigation items and controls
- **MatButton** - Toggle buttons and navigation actions
- **CDK Layout (BreakpointObserver)** - Responsive design utility for adapting sidenav behavior
- **CDK A11y (FocusTrap)** - Focus management utilities for accessibility
- **Router** - Angular Router integration for navigation functionality

---

**Research completed:** 2025-11-06
**Component:** Sidenav (Side Navigation)
**Framework:** Angular Material
**Documentation:** https://material.angular.dev/components/sidenav

**Notable Features:**
- Three distinct display modes (over, push, side) controlling layout behavior
- Dual sidenav support (one per side maximum) with position="start/end"
- Fixed positioning for fullscreen app layouts with fixedInViewport
- Comprehensive event system (opened, closed, backdropClick)
- Built-in focus management with autoFocus and cdkFocusInitial
- Responsive design integration via BreakpointObserver
- Promise-based async methods for open/close/toggle
- Two-way binding support for opened state
- Automatic backdrop management based on mode
- Scroll event access via CdkScrollable
- Full ARIA support with role and label attributes
- Keyboard accessibility with ESC key handling
