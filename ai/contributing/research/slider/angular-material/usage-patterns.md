# Angular Material - Slider Usage Patterns

## Component URL
https://material.angular.io/components/slider
Status: ⚠️ Redirected to https://material.angular.dev/components/slider
Version: Angular 15+ (Major refactor with MDC-based components)
Last Verified: 2025-11-10

## Documentation Quality
Good - The documentation provides clear API references and the component has been refactored in Angular 15+ to use Material Design Components (MDC) with a new architecture requiring explicit input elements.

## Component Definition
- **Core purpose**: Allows users to select from a range of values by moving the slider thumb. Provides both single-value and dual-thumb range selection with visual feedback through track, thumb, and optional tick marks.
- **Mental model**: Users think of this as a linear value picker with drag interaction - similar to native `<input type="range">` but with Material Design styling and enhanced features like discrete mode, tick marks, and custom value formatters.
- **Semantic meaning**: Communicates value selection within a bounded range, with visual representation of the selected value(s) through thumb position and filled track portion.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value | ✅ | Native | Via `min`, `max`, `step` attributes on `<mat-slider>` |
| Range (min-max) | ✅ | Native | Dual-thumb mode with `matSliderStartThumb` and `matSliderEndThumb` |
| Labels/marks | ✅ | Native | `showTickMarks` boolean attribute displays tick marks along track |
| Tooltips on handle | ✅ | Native | `discrete` mode shows numeric value label on thumb during interaction |
| Custom handle content | ✅ | Native | `displayWith` function prop formats value text: `[displayWith]="formatFn"` |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single value | ✅ | Native | Single `<input matSliderThumb />` child |
| Range (dual handles) | ✅ | Native | Two inputs: `<input matSliderStartThumb />` and `<input matSliderEndThumb />` |
| Vertical orientation | ✅ | Native | `vertical="true"` attribute (older API) |
| Reverse direction | ✅ | Native | `invert="true"` attribute displays slider in inverted direction |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled="true"` on `<mat-slider>` disables interaction |
| Read-only | ❌ | N/A | No explicit read-only state |
| Error state | ❌ | N/A | No visual error state pattern |
| Loading | ❌ | N/A | No loading state pattern |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Step increments | ✅ | Native | `step` attribute (default: 1) |
| Track marks | ✅ | Native | `showTickMarks` boolean displays tick marks at step intervals |
| Color customization | ✅ | Native | `color` attribute with values: `primary`, `accent`, `warn` (M2 themes only) |
| Size variants | ❌ | CSS-only | No built-in size variants |
| Track styling | ⚠️ | CSS-only | For M3 themes, custom styling required (M2 color prop deprecated) |

## Code Examples

### Basic Single Value Slider
```html
<mat-slider>
  <input matSliderThumb />
</mat-slider>
```

### Range Slider (Dual Thumbs)
```html
<mat-slider>
  <input matSliderStartThumb />
  <input matSliderEndThumb />
</mat-slider>
```

### Range with Min/Max Constraints
```html
<mat-slider [min]="30" [max]="75">
  <input matSliderStartThumb />
  <input matSliderEndThumb />
</mat-slider>
```

### Discrete Mode with Value Indicator
```html
<mat-slider discrete>
  <input matSliderThumb />
</mat-slider>
```

### With Tick Marks
```html
<mat-slider showTickMarks>
  <input matSliderThumb />
</mat-slider>
```

### Discrete with Steps and Tick Marks
```html
<mat-slider discrete showTickMarks step="10">
  <input matSliderThumb />
</mat-slider>
```

### Custom Value Display Formatter
```html
<mat-slider min="0" max="100000" step="1000"
            [displayWith]="formatValue">
  <input matSliderThumb />
</mat-slider>
```

```typescript
export class MySliderComponent {
  formatValue(value: number): string {
    return value >= 1000 ? Math.round(value / 1000) + 'k' : `${value}`;
  }
}
```

### With Theme Color (M2 Only)
```html
<!-- Primary theme -->
<mat-slider color="primary">
  <input matSliderThumb />
</mat-slider>

<!-- Warn theme -->
<mat-slider color="warn">
  <input matSliderThumb />
</mat-slider>
```

### Disabled State
```html
<mat-slider disabled="true">
  <input matSliderThumb />
</mat-slider>
```

### Inverted Direction
```html
<mat-slider invert="true">
  <input matSliderThumb />
</mat-slider>
```

### Vertical Orientation
```html
<mat-slider vertical="true">
  <input matSliderThumb />
</mat-slider>
```

### Form Integration with FormControl
```typescript
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [MatSliderModule, ReactiveFormsModule],
  templateUrl: 'item.component.html'
})
export class ItemComponent {
  constructor(private formBuilder: FormBuilder) { }

  itemForm = this.formBuilder.group({
    startThumbVal: 50,
    endThumbVal: 100
  });

  onFormSubmit() {
    console.log(this.itemForm?.value);
  }
}
```

```html
<form [formGroup]="itemForm" (ngSubmit)="onFormSubmit()">
  <mat-slider min="30" max="150">
    <input matSliderStartThumb formControlName="startThumbVal">
    <input matSliderEndThumb formControlName="endThumbVal">
  </mat-slider>
  <button mat-raised-button>Submit</button>
</form>
```

### With ARIA Labels
```html
<mat-slider>
  <input [attr.aria-valueText]="customTextValue" matSliderThumb />
</mat-slider>
```

### Module Setup
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, FormsModule, MatSliderModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Notable Features

### Architectural Refactor (Angular 15+)
- **Major redesign**: Complete rewrite based on Material Design Components for the Web (MDC)
- **Explicit input pattern**: Requires explicit `<input>` elements with directive selectors (`matSliderThumb`, `matSliderStartThumb`, `matSliderEndThumb`) rather than attribute-based configuration
- **Mode detection**: Automatically determines single vs. range mode based on which input directives are present

### Internal Implementation Details
- **Ripple effects**: Built-in ripple radius of 24px, can be disabled with `disableRipple` prop
- **Tick mark system**: Tracks active and inactive tick marks with calculated positions based on step intervals
- **RTL support**: Automatic right-to-left layout detection via Angular's Directionality service
- **ResizeObserver**: Uses ResizeObserver for responsive layout adjustments
- **Knob radius**: 8px default knob radius with calculated input padding

### Accessibility
- ARIA attributes supported via Angular's attribute binding
- Keyboard navigation follows native range input patterns
- Screen reader compatible with customizable value text

### Form Integration
- Full Angular Forms integration (both Template-driven and Reactive Forms)
- Works with `FormControl` and form validation
- Two-way data binding support with `ngModel`

### Theme Integration
- **M2 themes**: Support `color` property with `primary`, `accent`, `warn` values
- **M3 themes**: Color property deprecated, requires custom CSS for color customization
- Follows Material Design theming system

### Animation Control
- Can disable animations via internal `_noopAnimations()` method
- Smooth thumb transitions during value changes

## Research Notes

- **URL redirect**: Official documentation moved from `material.angular.io` to `material.angular.dev` (301 redirect)
- **Documentation access limitations**: The main documentation pages use heavy client-side rendering, making direct content extraction challenging. Most detailed information was gathered from GitHub source code, Stack Overflow discussions, and third-party tutorials.
- **Breaking changes**: The Angular 15 refactor introduced breaking changes requiring migration from attribute-based API to the new input-directive pattern
- **M3 migration**: Material 3 theming removes the `color` property, requiring developers to use custom CSS for color customization
- **Source code location**: Primary implementation at `github.com/angular/components/blob/main/src/material/slider/slider.ts`

### Framework Approach Observations

Angular Material's slider demonstrates a highly structured, type-safe approach typical of Angular's philosophy:
- **Explicit composition**: Requiring explicit `<input>` elements makes the API more verbose but clearer about single vs. range mode
- **TypeScript-first**: Strong typing throughout with interfaces for all configuration options
- **Directive-based**: Uses Angular directives (`matSliderThumb`, etc.) rather than props/attributes for key functionality
- **Form ecosystem integration**: Deep integration with Angular's reactive and template-driven forms
- **Lifecycle management**: Implements Angular lifecycle hooks for proper initialization and cleanup

This approach contrasts with more prop-heavy APIs in React-based frameworks, trading conciseness for type safety and explicit composition.
