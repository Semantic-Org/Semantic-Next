# Angular Material - Radio Button Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://material.angular.io/components/radio
Status: ⚠️ Redirected to https://material.angular.dev/components/radio
Version: Current (Material Design 3)
Last Verified: 2025-11-05

## Documentation Quality
Good - Comprehensive API reference available with TypeScript source code, though official documentation pages have some accessibility issues with web scraping tools. Community documentation provides extensive examples and patterns.

## Component Definition
- **Core purpose**: Provides Material Design styled radio button inputs that allow users to select a single option from a set of mutually exclusive choices within a group.
- **Mental model**: Radio buttons are wrapped in a parent `mat-radio-group` component that coordinates selection state, ensuring only one button can be selected at a time. The group acts as a form control and manages the shared state.
- **Semantic meaning**: Represents a single choice selection from a predefined set of options. The group communicates that options are mutually exclusive, and selecting one automatically deselects others.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Text placed between `<mat-radio-button>` tags becomes the label |
| Icon support | ✅ | Composed | Icons can be placed within button content alongside or instead of text |
| Custom content | ✅ | Composed | Any HTML content can be projected into the label area |
| Rich content | ✅ | Composed | Complex markup supported within radio button content projection |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single radio | ✅ | Native | Individual `mat-radio-button` components can exist standalone |
| Radio group | ✅ | Native | `mat-radio-group` component wraps multiple buttons, provides ControlValueAccessor |
| Button style | ❌ | N/A | No dedicated button-style variant; standard Material Design radio appearance only |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` input on group (disables all) or individual button |
| Checked/Selected | ✅ | Native | `checked` input on button, `value`/`selected` on group |
| Error/Invalid | ✅ | Native | Through Angular Forms integration with `required` validator |
| Required | ✅ | Native | `required` input on `mat-radio-group` for form validation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No native size variants; requires custom CSS styling |
| Orientation | ✅ | CSS-only | Vertical (default with flexbox column), horizontal via CSS flex-direction |
| Color options | ✅ | Native | `color` input: 'primary', 'accent', 'warn' (Material Design 2 theme colors) |
| Spacing control | ✅ | CSS-only | Controlled via CSS on `.example-radio-group` or custom classes |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange handler | ✅ | Native | `(change)` output on group emits `MatRadioChange` event (user interaction only) |
| Controlled/Uncontrolled | ✅ | Native | Supports both patterns via `[(ngModel)]` or `[value]` with `(change)` |
| Form integration | ✅ | Native | Full Angular Forms support: `ngModel`, `formControl`, `formGroup`, ControlValueAccessor |

## Code Examples

### Basic Radio Group
```typescript
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'radio-example',
  template: `
    <mat-radio-group aria-label="Select an option">
      <mat-radio-button value="1">Option 1</mat-radio-button>
      <mat-radio-button value="2">Option 2</mat-radio-button>
    </mat-radio-group>
  `,
  standalone: true,
  imports: [MatRadioModule]
})
export class RadioExample {}
```

### With Two-Way Binding (ngModel)
```typescript
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'radio-ngmodel-example',
  template: `
    <mat-radio-group [(ngModel)]="selectedOption">
      <mat-radio-button value="1">Option 1</mat-radio-button>
      <mat-radio-button value="2">Option 2</mat-radio-button>
    </mat-radio-group>
    <p>Selected: {{ selectedOption }}</p>
  `,
  standalone: true,
  imports: [MatRadioModule, FormsModule]
})
export class RadioNgModelExample {
  selectedOption: string;
}
```

### With FormControl (Reactive Forms)
```typescript
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'radio-reactive-example',
  template: `
    <mat-radio-group [formControl]="genderControl">
      <mat-radio-button value="f">Female</mat-radio-button>
      <mat-radio-button value="m">Male</mat-radio-button>
    </mat-radio-group>
  `,
  standalone: true,
  imports: [MatRadioModule, ReactiveFormsModule]
})
export class RadioReactiveExample {
  genderControl = new FormControl('f');
}
```

### Dynamic List with *ngFor
```typescript
@Component({
  template: `
    <mat-radio-group [(ngModel)]="favoriteFruit">
      <mat-radio-button *ngFor="let fruit of fruits" [value]="fruit">
        {{ fruit }}
      </mat-radio-button>
    </mat-radio-group>
  `
})
export class RadioDynamicExample {
  fruits = ['Apple', 'Banana', 'Orange'];
  favoriteFruit: string;
}
```

### With Change Event Handler
```typescript
import { MatRadioChange } from '@angular/material/radio';

@Component({
  template: `
    <mat-radio-group (change)="radioButtonGroupChange($event)">
      <mat-radio-button value="1">Option 1</mat-radio-button>
      <mat-radio-button value="2">Option 2</mat-radio-button>
    </mat-radio-group>
  `
})
export class RadioChangeExample {
  radioButtonGroupChange(event: MatRadioChange) {
    console.log('Selected value:', event.value);
    console.log('Source button:', event.source);
  }
}
```

### With Color Theme
```html
<mat-radio-group color="primary">
  <mat-radio-button value="1">Primary Color</mat-radio-button>
</mat-radio-group>

<mat-radio-group color="accent">
  <mat-radio-button value="2">Accent Color</mat-radio-button>
</mat-radio-group>

<mat-radio-group color="warn">
  <mat-radio-button value="3">Warn Color</mat-radio-button>
</mat-radio-group>
```

### With Label Position
```html
<mat-radio-group labelPosition="before">
  <mat-radio-button value="1">Label appears before radio</mat-radio-button>
</mat-radio-group>

<mat-radio-group labelPosition="after">
  <mat-radio-button value="2">Label appears after radio</mat-radio-button>
</mat-radio-group>
```

### Disabled States
```html
<!-- Disable entire group -->
<mat-radio-group disabled>
  <mat-radio-button value="1">Option 1</mat-radio-button>
  <mat-radio-button value="2">Option 2</mat-radio-button>
</mat-radio-group>

<!-- Disable individual button -->
<mat-radio-group>
  <mat-radio-button value="1">Enabled</mat-radio-button>
  <mat-radio-button value="2" disabled>Disabled</mat-radio-button>
</mat-radio-group>
```

### Vertical Layout (CSS)
```css
.example-radio-group {
  display: flex;
  flex-direction: column;
  margin: 15px 0;
}

.example-radio-button {
  margin: 5px;
}
```

```html
<mat-radio-group class="example-radio-group">
  <mat-radio-button class="example-radio-button" value="1">Option 1</mat-radio-button>
  <mat-radio-button class="example-radio-button" value="2">Option 2</mat-radio-button>
</mat-radio-group>
```

### Horizontal Layout (CSS)
```css
.example-radio-group {
  display: flex;
  flex-direction: row;
}

.example-radio-button {
  margin: 0 10px;
}
```

### With Required Validation
```typescript
import { FormControl, Validators } from '@angular/forms';

@Component({
  template: `
    <mat-radio-group [formControl]="requiredControl" required>
      <mat-radio-button value="1">Option 1</mat-radio-button>
      <mat-radio-button value="2">Option 2</mat-radio-button>
    </mat-radio-group>
    <div *ngIf="requiredControl.invalid && requiredControl.touched">
      Selection is required
    </div>
  `
})
export class RadioValidationExample {
  requiredControl = new FormControl('', Validators.required);
}
```

### With Accessibility Attributes
```html
<mat-radio-group aria-label="Select your preference">
  <mat-radio-button value="1"
                     aria-label="First option"
                     aria-describedby="option1-description">
    Option 1
  </mat-radio-button>
  <span id="option1-description" class="sr-only">
    Detailed description of option 1
  </span>
</mat-radio-group>
```

### Disabling Ripple Effect
```html
<mat-radio-group>
  <mat-radio-button value="1" disableRipple>No Ripple</mat-radio-button>
  <mat-radio-button value="2">With Ripple</mat-radio-button>
</mat-radio-group>
```

## Notable Features

### ControlValueAccessor Implementation
`MatRadioGroup` implements Angular's `ControlValueAccessor` interface, providing seamless integration with Angular Forms (both template-driven and reactive forms). This allows radio groups to work naturally with `ngModel`, `formControl`, and `formGroup` directives.

### Change Event Behavior
The `(change)` event only fires from **user interactions**, not programmatic value changes. If you set the value via code (e.g., `control.setValue()`), the change event will not trigger. This prevents infinite loops and follows Angular Forms patterns.

### Automatic Name Coordination
When radio buttons are placed in a `mat-radio-group`, they automatically share the same `name` attribute, ensuring browser-level mutual exclusivity without manual configuration.

### Material Design 3 Integration
The component uses Material Design 3 (MDC) styling with proper focus indicators, ripple effects, and theme color integration. The `color` input accepts 'primary', 'accent', and 'warn' theme colors.

### Interactive Disabled State
The `disabledInteractive` input (available on both group and button) allows disabled buttons to remain interactive for accessibility purposes while still being marked as disabled programmatically.

### TypeScript Type Safety
The `MatRadioChange<T>` event type is generic, preserving type information for the selected value throughout the change event flow.

### Focus Management
The `MatRadioButton` exposes a `focus()` method with optional parameters for focus origin tracking, enabling programmatic focus control for accessibility implementations.

### QueryList of Children
`MatRadioGroup` maintains a `QueryList<MatRadioButton>` of its children, enabling dynamic radio button addition/removal with automatic coordination.

## Research Notes

### Framework Integration Approach
Angular Material takes a **component-centric** approach with the `mat-radio-group` acting as the coordinator and form control. This differs from frameworks that use context APIs or render props. The parent-child relationship is explicit through Angular's content projection and `@ContentChildren` decorator.

### State Management Philosophy
State management is **centralized in the group** rather than distributed across buttons. Individual buttons communicate their checked state to the group, which maintains the single source of truth. This follows Angular's unidirectional data flow patterns.

### Styling Architecture
The framework uses **CSS class-based theming** with Material Design tokens rather than inline styles or CSS-in-JS. Layout control (orientation, spacing) is **intentionally left to CSS** rather than providing dedicated props, giving developers full layout control while maintaining a simpler API surface.

### Form Integration
Angular Material's deep integration with **Angular Forms** makes it feel native to the Angular ecosystem. The `ControlValueAccessor` implementation is complete and handles edge cases like disabled state propagation, initial value setting, and validation state.

### Accessibility First
The component includes comprehensive **ARIA attribute support** (`aria-label`, `aria-labelledby`, `aria-describedby`) and manages focus, keyboard navigation, and screen reader announcements automatically. The `disabledInteractive` feature shows attention to advanced accessibility requirements.

### Event Model Constraints
The limitation that change events only fire from user interaction (not programmatic changes) is a **deliberate design decision** that aligns with Angular Forms conventions and prevents common bugs in reactive applications. Developers expecting events from all value changes may need to use form control value observables instead.

### No Size Variants
Unlike some component libraries, Angular Material **does not provide size variants** (small, medium, large) for radio buttons. This reflects Material Design's opinionated approach to consistent component sizing. Custom sizing requires CSS overrides of the Material Design tokens.

### Type System Integration
The framework provides **full TypeScript support** with generic types, exported interfaces (`MatRadioChange`, `MatRadioDefaultOptions`), and injection tokens for configuration. This enables type-safe event handling and dependency injection patterns.

### Comparison to Other Frameworks
- **More Angular-specific** than framework-agnostic libraries like Radix or Headless UI
- **Less prop-heavy** than React libraries (Chakra UI, Material UI) - relies on CSS for layout
- **More opinionated** about styling than headless component libraries
- **Stronger form integration** than most UI libraries due to ControlValueAccessor pattern
- **Template-driven** rather than JSX/render function based

The Angular Material approach favors **explicit component relationships** and **framework-native patterns** over universal abstractions, making it powerful within the Angular ecosystem but less portable to other frameworks.
