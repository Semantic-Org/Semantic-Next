# Component Pattern Research: Stepper / Wizard

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 6 (Chakra UI, Ant Design, Nuxt UI, MUI, Mantine, PrimeReact)
- Date: 2025-11-05
- Unique patterns identified: 30+ distinct patterns across state management, navigation, visualization, and interaction

## Component Definition Consensus

Stepper (also called Steps or Wizard) is a navigation and progress indicator component that displays advancement through a multi-step sequential process. All six frameworks consistently conceptualize Stepper as:

- **Core purpose**: Visually represent progress through multi-step workflows, forms, or processes with clear indicators of completed, current, and upcoming steps
- **Mental model**: A guided navigation system that breaks complex tasks into manageable sequential steps, showing users where they are and where they're going
- **Semantic meaning**: Navigation landmark that indicates progress through a sequence, typically using numbered or iconographic step indicators

**Key observation**: Stepper is universally positioned as both a **progress indicator** and **navigation component** - all frameworks provide visual feedback about completion status while optionally enabling direct step navigation.

## Terminology Variations

### Component Names
- **Steps** (3/6): Chakra UI, Ant Design, PrimeReact
- **Stepper** (3/6): MUI, Mantine, Nuxt UI
- **MobileStepper** (1/6): MUI provides separate mobile-optimized variant

### Sub-Component Naming
- **Step** / **Step.Item** (4/6): MUI Step, Mantine Stepper.Step, Chakra Steps.Item, Ant Design item objects
- **StepLabel** / **StepButton** (1/6): MUI distinguishes between non-interactive label and interactive button
- **StepContent** (2/6): MUI, Chakra UI (for vertical/expandable content)
- **Stepper.Completed** (1/6): Mantine provides dedicated completion state component

### State Props
- **activeStep** (1/6): MUI - `activeStep={0}`
- **current** (1/6): Ant Design - `current={0}`
- **step** (1/6): Chakra UI - `step={0}` (controlled mode)
- **active** (1/6): Mantine - `active={0}`
- **modelValue** / **v-model** (1/6): Nuxt UI - `v-model="step"` (Vue pattern)
- **activeIndex** (1/6): PrimeReact - `activeIndex={0}`

### Navigation Control
- **linear** (3/6): Chakra UI, Nuxt UI, Mantine - boolean for sequential enforcement
- **nonLinear** (1/6): MUI - enables free navigation between steps
- **readOnly** (1/6): PrimeReact - `readOnly={false}` for interactive mode
- **onChange** (1/6): Ant Design - presence enables clickable steps
- **allowNextStepsSelect** (1/6): Mantine - controls forward jump permission

### Orientation
- **orientation** (4/6): Chakra UI, MUI, Mantine, Nuxt UI - `'horizontal' | 'vertical'`
- **direction** (1/6): Ant Design - `'horizontal' | 'vertical'`
- **No built-in vertical** (1/6): PrimeReact - horizontal only

## Pattern Inventory

### State Management Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Controlled state | Component requires external state management | 6/6 (100%) | Level 1 | All (via activeStep/current/step/active/modelValue/activeIndex) |
| Uncontrolled state | Component manages own state internally | 2/6 (33%) | Level 4 | Chakra UI (defaultStep), Nuxt UI (defaultValue) |
| Step change callback | Event fired when active step changes | 6/6 (100%) | Level 1 | All (onStepChange/onChange/update:modelValue/onSelect/onStepClick) |
| Completion callback | Event fired when all steps complete | 1/6 (17%) | Level 5 | Chakra UI (onStepComplete) |
| Step count prop | Explicit total step count | 1/6 (17%) | Level 5 | Chakra UI (count prop required) |

### Navigation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Linear mode | Sequential step-by-step progression | 6/6 (100%) | Level 1 | All (default or via linear prop) |
| Non-linear mode | Free navigation between any steps | 5/6 (83%) | Level 2 | All except PrimeReact (interactive by default or via nonLinear/allowNextStepsSelect) |
| Clickable steps | Steps can be clicked to navigate | 6/6 (100%) | Level 1 | All (via StepButton, onChange, onStepClick, readOnly=false) |
| Previous/Next buttons | Built-in navigation controls | 3/6 (50%) | Level 3 | Chakra UI (PrevTrigger/NextTrigger), Nuxt UI (prev/next methods), typical external pattern |
| Programmatic navigation | API methods for step control | 2/6 (33%) | Level 4 | Nuxt UI (next(), prev(), hasNext, hasPrev), common via state |
| Forward-only navigation | Prevent jumping to future steps | 2/6 (33%) | Level 4 | Mantine (allowNextStepsSelect), Ant Design (via disabled items) |

### Visualization Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Horizontal layout | Steps arranged left-to-right | 6/6 (100%) | Level 1 | All (default orientation) |
| Vertical layout | Steps stacked top-to-bottom | 5/6 (83%) | Level 2 | All except PrimeReact |
| Numbered indicators | Default step numbers | 6/6 (100%) | Level 1 | All |
| Custom icons | Replace numbers with icons | 6/6 (100%) | Level 1 | All (icon prop or StepIconComponent) |
| Progress connectors | Lines connecting steps | 6/6 (100%) | Level 1 | All (separator/connector) |
| Checkmark completion | Completed steps show checkmarks | 5/6 (83%) | Level 2 | All except PrimeReact (auto) |
| Progress percentage | Within-step progress tracking | 1/6 (17%) | Level 5 | Ant Design (percent prop v4.5+) |
| Progress bar visualization | Linear progress indicator | 2/6 (33%) | Level 4 | Chakra UI (Steps.Progress), MUI (MobileStepper variant) |

### Step State Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Active state | Current step being worked on | 6/6 (100%) | Level 1 | All |
| Completed state | Past completed steps | 6/6 (100%) | Level 1 | All |
| Pending/Wait state | Future upcoming steps | 6/6 (100%) | Level 1 | All |
| Error state | Step with validation errors | 4/6 (67%) | Level 3 | MUI, Ant Design, Mantine (via custom), Chakra (via styling) |
| Optional state | Skippable steps | 2/6 (33%) | Level 4 | MUI (optional prop), Ant Design (via status) |
| Disabled state | Non-accessible steps | 5/6 (83%) | Level 2 | All except Chakra UI |
| Loading state | Step in progress | 1/6 (17%) | Level 5 | Mantine (loading prop) |

### Content Management Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Title/label for steps | Primary step text | 6/6 (100%) | Level 1 | All |
| Description text | Secondary step text | 5/6 (83%) | Level 2 | All except PrimeReact (via template only) |
| Step-specific content | Content shown when step active | 4/6 (67%) | Level 3 | Chakra (Steps.Content), MUI (StepContent), Mantine (children), Nuxt (content/slots) |
| Completion content | Content after all steps | 2/6 (33%) | Level 4 | Chakra (CompletedContent), Mantine (Stepper.Completed) |
| Custom templates | Fully custom step rendering | 2/6 (33%) | Level 4 | PrimeReact (template function), Ant Design (progressDot function) |
| Named slots | Vue slot system | 1/6 (17%) | Level 5 | Nuxt UI (slot property) |

### API Architecture Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Compositional API | Multiple sub-components | 3/6 (50%) | Level 3 | Chakra (11 components), MUI (8 components), Mantine (3 components) |
| Items array API | Data-driven step definition | 3/6 (50%) | Level 3 | Ant Design, Nuxt UI, PrimeReact (MenuItem model) |
| Children-based API | Steps as child components | 3/6 (50%) | Level 3 | MUI (Step children), Mantine (Stepper.Step), Chakra (Steps.Item) |
| Deprecated children API | Old pattern being phased out | 1/6 (17%) | Level 5 | Ant Design (Steps.Step removed in v5.0) |

### Size and Styling Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Size variants | Predefined size options | 5/6 (83%) | Level 2 | Chakra (sm/md/lg), Ant (default/small), Nuxt (xs-xl), Mantine (xs-xl), MUI (via styling) |
| Color customization | Theme color integration | 5/6 (83%) | Level 2 | All except Ant Design (fixed Material colors) |
| Alternative label placement | Label below vs beside icon | 2/6 (33%) | Level 4 | MUI (alternativeLabel), Ant Design (labelPlacement) |
| Icon positioning | Icon left/right of label | 1/6 (17%) | Level 5 | Mantine (iconPosition) |
| Styles API | Granular style control | 2/6 (33%) | Level 4 | Mantine (11 part names), MUI (CSS classes) |

### Mobile and Responsive Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Responsive orientation | Auto-switch to vertical | 1/6 (17%) | Level 5 | Ant Design (responsive prop, <532px) |
| Mobile-specific variant | Dedicated mobile component | 1/6 (17%) | Level 5 | MUI (MobileStepper with 3 sub-variants) |
| Dots visualization | Compact dot indicators | 2/6 (33%) | Level 4 | Ant Design (progressDot), MUI (MobileStepper dots) |
| Progress bar mobile | Linear bar for mobile | 1/6 (17%) | Level 5 | MUI (MobileStepper progress variant) |
| Text progress mobile | "Step X of Y" display | 1/6 (17%) | Level 5 | MUI (MobileStepper text variant) |

### Accessibility Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| ARIA attributes | Automatic ARIA support | 6/6 (100%) | Level 1 | All (nav, aria-current, aria-label, etc.) |
| Keyboard navigation | Arrow keys, Tab, Enter/Space | 4/6 (67%) | Level 3 | Chakra, MUI, Mantine, PrimeReact |
| Screen reader support | Announces step changes | 6/6 (100%) | Level 1 | All |
| Semantic HTML | nav, ol, li structure | 5/6 (83%) | Level 2 | All except Chakra (uses div by default) |
| Focus management | Proper focus indicators | 6/6 (100%) | Level 1 | All |

## Notable Patterns

### Highly Adopted (Level 1, 100% adoption)

**Universal patterns across all Stepper implementations:**

- **Controlled state management**: All require external active step tracking
- **Linear progression**: All support sequential step-by-step workflows
- **Horizontal default layout**: All default to left-to-right arrangement
- **Numbered indicators**: All show step numbers by default
- **Clickable navigation**: All support step click navigation
- **Progress connectors**: All show lines between steps
- **Active/completed/pending states**: All distinguish step status visually
- **Title/label support**: All display primary text for each step
- **Custom icons**: All allow icon customization
- **Step change callbacks**: All fire events on step transitions
- **ARIA accessibility**: All provide automatic accessibility features
- **Theme integration**: All integrate with framework design systems

### Emerging Patterns (Level 2-3, 50-83% adoption)

**Patterns with strong adoption:**

- **Vertical layout** (83%): 5/6 support vertical orientation
- **Checkmark completion** (83%): 5/6 auto-show checkmarks for completed steps
- **Size variants** (83%): 5/6 provide predefined size options
- **Color customization** (83%): 5/6 support theme color integration
- **Non-linear mode** (83%): 5/6 allow free navigation between steps
- **Description text** (83%): 5/6 support secondary descriptive text
- **Disabled steps** (83%): 5/6 can mark steps as non-accessible
- **Semantic HTML** (83%): 5/6 use nav/ol/li structure

### Unique Innovations

**Framework-specific features:**

**Chakra UI**:
- **Most compositional**: 11 sub-components for maximum flexibility
- **Built on Ark UI**: Cross-framework foundation for consistency
- **RootProvider pattern**: Advanced context-based control
- **CompletedContent**: Dedicated post-completion state
- **Progress component**: Separate progress bar visualization
- **Uncontrolled mode**: Optional internal state management

**Ant Design**:
- **Modern items API**: v4.24+ declarative array approach (old pattern removed v5.0)
- **Progress percentage**: Within-step progress (percent prop v4.5+)
- **Auto-responsive**: Switches to vertical < 532px automatically
- **Navigation type**: Special variant for page-level navigation
- **Progress dot mode**: Alternative circular dot visualization
- **Custom dot rendering**: Function for interactive dot features

**Nuxt UI**:
- **Vue integration**: v-model for reactive two-way binding
- **Reka UI foundation**: Built on accessible headless primitives
- **7 color schemes**: Most color options (primary/secondary/success/info/warning/error/neutral)
- **5 size variants**: xs through xl sizing (most size options)
- **Named slots**: Vue slot system for custom content
- **Navigation methods**: Dedicated next(), prev(), hasNext, hasPrev API
- **Per-step disabled**: Individual step disable control

**MUI**:
- **8-component system**: Most comprehensive compositional architecture
- **MobileStepper**: Dedicated mobile component with 3 variants (dots/text/progress)
- **StepButton vs StepLabel**: Explicit interactive/non-interactive distinction
- **StepContent**: Built-in expandable content for vertical steppers
- **Alternative label placement**: Label below icon option
- **Optional steps**: Explicit optional step marking with "Optional" text
- **Custom StepIcon**: Component-level icon customization
- **Custom connector**: Replace connecting lines entirely

**Mantine**:
- **3 navigation patterns**: All clickable, forward-only, custom per-step control
- **Loading state**: Built-in loading spinner for steps
- **Icon sizing**: Independent icon size control from overall size
- **Icon positioning**: Left or right icon placement
- **Stepper.Completed**: Dedicated completion component
- **11-part Styles API**: Granular style control (root/steps/stepIcon/stepLabel/separator/etc.)
- **Per-step color**: Individual step color overrides

**PrimeReact**:
- **MenuItem model**: Uses consistent navigation API across framework
- **Read-only default**: Display-only mode requiring opt-in interaction
- **Template system**: Powerful custom rendering functions
- **Command callbacks**: Per-step side effect handlers
- **Menu consistency**: Familiar API for PrimeReact developers
- **Minimal built-in features**: Maximum flexibility, requires implementation

## Pattern Correlations

### When compositional architecture exists:
- More sub-components correlates with more features (Chakra 11 components, MUI 8 components)
- Vertical content support present (2/2, 100%) - Chakra, MUI
- Progress visualization components present (2/2, 100%) - Chakra, MUI
- Suggests: Composition enables richer feature sets

### When items API exists:
- More recently modernized (Ant v4.24+, Nuxt/PrimeReact newer)
- Simpler prop surface (fewer nested components)
- Template/custom rendering support (2/3, 67%)
- Suggests: Items API favors declarative, data-driven patterns

### When vertical layout exists:
- Horizontal always present too (5/5, 100%)
- Orientation prop standardized (4/5, 80%)
- Expandable content patterns emerge (2/5, 40%)
- Suggests: Vertical is enhancement, not replacement

### When mobile-specific features exist:
- Framework emphasizes responsive design (MUI, Ant Design)
- Multiple visualization modes (dots, progress, text)
- Suggests: Mobile requires specialized approaches

## Implementation Notes

### Common Technical Approaches

1. **State Management Pattern**:
   ```
   const [activeStep, setActiveStep] = useState(0)
   <Stepper activeStep={activeStep} onChange={setActiveStep}>
   ```
   All frameworks use controlled component pattern with external state

2. **Step Definition Patterns**:
   - **Compositional**: `<Step><StepLabel>Title</StepLabel></Step>`
   - **Items array**: `items={[{title: 'Step 1'}, {title: 'Step 2'}]}`
   - **MenuItem model**: `model={[{label: 'Step 1'}, {label: 'Step 2'}]}`

3. **Navigation Implementation**:
   - **Linear**: Users must complete steps sequentially (default)
   - **Non-linear**: Users can click any step (nonLinear/readOnly/onChange)
   - **Hybrid**: Completed + current clickable (allowNextStepsSelect)

4. **Visual Status Indicators**:
   - **Completed**: Checkmark or filled indicator
   - **Active**: Highlighted with color
   - **Pending**: Grayed out or outline only
   - **Error**: Red color with error icon

5. **Connector Rendering**:
   - Horizontal: Lines between step indicators
   - Vertical: Lines along left/right edge
   - Customizable: Custom components or styles

### Performance Considerations

- **Minimal re-renders**: Only active step re-renders on change
- **CSS-based styling**: Visual states via CSS classes
- **Lazy content**: Step content only rendered when active (some frameworks)
- **Icon optimization**: Custom icons should be memoized
- **Large step counts**: Consider virtualization for >20 steps

### Framework-Specific Strengths

**Chakra UI**:
- Most flexible composition
- Ark UI cross-framework consistency
- Best for custom, complex steppers
- Full control over every element

**Ant Design**:
- Modern, performance-optimized API
- Best responsive behavior
- Excellent for Chinese market
- Most polished default styling

**Nuxt UI**:
- Best Vue integration
- Most color schemes
- Clean, modern API
- Excellent for Nuxt/Vue projects

**MUI**:
- Most comprehensive feature set
- Best mobile optimization (MobileStepper)
- Material Design consistency
- Best for enterprise applications

**Mantine**:
- Most navigation control patterns
- Loading states built-in
- Excellent Styles API
- Best for React + TypeScript

**PrimeReact**:
- Most consistent with PrimeReact ecosystem
- Template system most flexible
- Read-only default prevents accidental interaction
- Best for PrimeReact users

## Architectural Insights

### Three Implementation Philosophies

1. **Compositional (Chakra, MUI, Mantine)**:
   - Multiple sub-components work together
   - Maximum flexibility and control
   - Steeper learning curve
   - Best for complex, custom steppers
   - Philosophy: Give developers all the pieces

2. **Declarative (Ant Design, Nuxt UI)**:
   - Items array defines all steps
   - Simpler API surface
   - Faster development
   - Less customization depth
   - Philosophy: Optimize for common cases

3. **Model-Based (PrimeReact)**:
   - MenuItem model for consistency
   - Familiar API across components
   - Template-driven customization
   - Minimal built-in features
   - Philosophy: Consistency over innovation

### API Evolution Trends

**Moving away from**:
- Children-based step definition (Ant deprecated Steps.Step)
- Uncontrolled mode (only Chakra + Nuxt still support)
- Complex prop surfaces
- Framework-specific patterns

**Moving toward**:
- Items/model array APIs
- Controlled-only components
- Declarative configuration
- Cross-framework consistency (Ark UI, Reka UI)
- TypeScript-first design
- Accessibility by default

### Stepper vs Alternative Patterns

| Aspect | Stepper | Tabs | Accordion | Wizard |
|--------|---------|------|-----------|--------|
| Purpose | Progress tracking + navigation | Content organization | Collapsed sections | Guided flow |
| Sequential | Usually | No | No | Always |
| Completion state | Yes | No | No | Yes |
| Back/forward | Common | Rare | N/A | Essential |
| Use case | Multi-step processes | Related content | FAQ, details | Onboarding, setup |

## Sophisticated Design Patterns

### Chakra UI - RootProvider with Programmatic Step Control

**What it does**: The `useSteps` hook combined with `Steps.RootProvider` provides external programmatic control of the stepper state. Developers can access the current step index, progress percentage, completion status, and methods like `setStep()`, `resetStep()`, `goToNextStep()`, and `goToPrevStep()`. This pattern enables complex workflows where step navigation is triggered by external events, conditional logic, or user actions outside the typical next/previous buttons.

**Why it's sophisticated**: This solves the non-obvious problem of needing fine-grained state introspection during a multi-step process. Instead of managing step progress manually in parent component state, the `percent` property (0-100) from the hook provides automatic progress calculation. The pattern separates state management concerns into a hook while allowing the stepper UI to be placed anywhere, including inside providers that need this state. This enables use cases like progress persistence, analytics tracking per-step, or wizard flows that need to save/restore state between page navigations.

**Evidence of design maturity**:
- The hook returns both state (`value`, `count`, `percent`) and actions (`setStep`, `resetStep`, `goToNextStep`, `goToPrevStep`) showing careful API design that separates concerns
- Helper properties like `hasNextStep`, `hasPrevStep`, and `isCompleted` prevent developers from reimplementing these checks on every navigation
- The pattern acknowledges that composition patterns alone aren't enough - programmatic control is equally important
- Built on Ark UI foundation (cross-framework), showing investment in consistent implementations

### Mantine - Progressive Step Access with Highest-Step Tracking

**What it does**: Mantine's pattern tracks the highest step visited and uses per-step `allowStepClick` props to enforce forward-progress constraints. Users can navigate back to any previously visited step (to review/edit) but cannot jump ahead to unvisited steps. This pattern requires maintaining highest-step state and passing individual step click allowance decisions to each step component. Code tracks the highest step reached and only allows clicking on steps up to that point, plus optionally allowing backward navigation.

**Why it's sophisticated**: This solves the complex UX problem of "allowing users to backtrack and review without losing their mental model of progress." Most step systems are either strictly linear (can't go back) or completely free (can go anywhere). This pattern sits in the middle, acknowledging that validation or complex forms often need bidirectional navigation but within a "earned progress" framework. The per-step click control requires understanding that step accessibility depends on state tracking that's external to the individual steps themselves - this is a form of coordinated component behavior that only makes sense in a sequential context.

**Evidence of design maturity**:
- The pattern explicitly implements the mental model of "you earned this progress" by only allowing access to previously visited steps
- The implementation requires thinking about step as a "gate" that can be open/closed based on external state, not just a simple button
- Acknowledges the difference between "disabled" (no access) and "not clickable yet" (future step) which affects user mental models
- Shows understanding that validation workflows need non-linear navigation but with constraints

### MUI - StepContent with Automatic Visibility and Collapse Transitions

**What it does**: MUI's vertical stepper pattern uses the `StepContent` sub-component which automatically manages visibility and expand/collapse animations for step-specific content. Each step can contain detailed information that's hidden when inactive and animated into view when active. The component uses a `Collapse` transition component under the hood, with customizable `transitionDuration` and `TransitionComponent` props. This provides automatic content visibility toggling - only the active step's content is visible, and changes between steps trigger smooth animations.

**Why it's sophisticated**: This solves the design problem of "how do we show rich, step-specific content without overwhelming the interface or losing context of previous steps?" The non-obvious aspect is that the content visibility is tied to step activation state automatically through component composition. Rather than developers managing visibility state for each step's content independently, the `StepContent` component intrinsically knows which step it belongs to and renders accordingly. The built-in transition system acknowledges that abrupt visibility changes feel jarring - smooth collapse/expand is better UX for sequential workflows.

**Evidence of design maturity**:
- The automatic visibility toggling (active step content visible, inactive steps collapsed) shows deep thinking about state binding in a compositional system
- The `TransitionComponent` prop shows flexibility without complexity - developers can customize animation if needed but good defaults exist
- The pattern separates concerns: the stepper tracks what's active, StepContent renders appropriately - no manual visibility props needed
- The vertical layout with expandable sections creates a "progressive disclosure" pattern that scales to many steps without overwhelming users

## Recommendations for Implementation

Based on pattern prevalence, a robust Stepper implementation should include:

### Essential Features (Level 1, 100% adoption)
1. Controlled state management (activeStep/current prop)
2. Linear mode (sequential progression)
3. Horizontal layout (default orientation)
4. Numbered step indicators
5. Clickable step navigation
6. Progress connectors between steps
7. Active/completed/pending states
8. Title/label for each step
9. Custom icon support
10. Step change callback
11. ARIA accessibility attributes
12. Theme integration

### Recommended Features (Level 2-3, 50-83% adoption)
1. Vertical layout option
2. Checkmark for completed steps
3. Size variants (small, medium, large)
4. Color customization
5. Non-linear mode (free navigation)
6. Description text for steps
7. Disabled step support
8. Semantic HTML (nav, ol, li)
9. Keyboard navigation
10. Error state indication
11. Step-specific content areas

### Optional Innovations (<50% adoption)
1. Uncontrolled mode with default state
2. Progress percentage within steps
3. Auto-responsive orientation
4. Mobile-specific variant
5. Dots visualization
6. Progress bar component
7. Completion content/component
8. Loading states
9. Optional steps
10. Template/render functions
11. Command callbacks
12. Alternative label placement

### API Design Recommendations

**Choose Architecture**:
1. **Compositional** - for maximum flexibility (Chakra/MUI style)
2. **Declarative** - for simplicity (Ant Design/Nuxt style)
3. **Hybrid** - support both patterns

**State Management**:
- Always controlled (activeStep + onChange)
- Optional uncontrolled mode (defaultStep) for simple cases
- Consider step count validation

**Navigation Control**:
- Linear mode as default
- `nonLinear` or `readOnly={false}` for free navigation
- Consider `allowNextStepsSelect` for hybrid approach

**Naming Conventions**:
- Component: "Stepper" or "Steps" (modern trend toward "Stepper")
- State prop: `activeStep` or `current` (activeStep more descriptive)
- Layout prop: `orientation` (industry standard)
- Callback: `onStepChange` or `onChange` (onStepChange more explicit)

### Theme Integration Strategy

1. **Color system**: Active/completed/pending colors from theme
2. **Spacing scale**: Step spacing and padding from theme
3. **Typography**: Label and description from theme text styles
4. **Icons**: Checkmarks and custom icons from icon system
5. **Breakpoints**: Responsive behavior from theme breakpoints

## Testing Considerations

Comprehensive testing should cover:

1. **State Management**:
   - Active step updates correctly
   - Completed steps tracked properly
   - Step change callbacks fire with correct data
   - State persists during re-renders

2. **Navigation Patterns**:
   - Linear mode prevents forward jumps
   - Non-linear mode allows free navigation
   - Disabled steps can't be clicked
   - Previous/next buttons work correctly

3. **Visual States**:
   - Active step highlighted correctly
   - Completed steps show checkmarks
   - Pending steps appear inactive
   - Error states display properly

4. **Orientation**:
   - Horizontal layout renders correctly
   - Vertical layout stacks properly
   - Connectors positioned correctly
   - Responsive switching (if supported)

5. **Content Rendering**:
   - Step titles display correctly
   - Descriptions render properly
   - Custom icons show correctly
   - Step content appears when active

6. **Accessibility**:
   - ARIA attributes present and correct
   - Keyboard navigation works
   - Screen readers announce changes
   - Focus management proper

7. **Edge Cases**:
   - Single step
   - Many steps (10+, 50+)
   - Empty titles/descriptions
   - Long text wrapping
   - Dynamic step addition/removal

## Framework Comparison Summary

| Feature | Chakra UI | Ant Design | Nuxt UI | MUI | Mantine | PrimeReact |
|---------|-----------|------------|---------|-----|---------|------------|
| **Architecture** | Compositional (11 parts) | Items API | Items API | Compositional (8 parts) | Compositional (3 parts) | MenuItem Model |
| **Sub-components** | ✅ Many (11) | ❌ Array API | ❌ Array API | ✅ Many (8) | ✅ Few (3) | ❌ Template API |
| **Orientation** | ✅ H + V | ✅ H + V (auto-responsive) | ✅ H + V | ✅ H + V | ✅ H + V | ❌ H only |
| **Linear mode** | ✅ linear prop | ✅ Default behavior | ✅ linear prop | ✅ Default (non via nonLinear) | ✅ Default + patterns | ✅ readOnly prop |
| **State** | Controlled + Uncontrolled | Controlled | Controlled + Uncontrolled | Controlled | Controlled | Controlled |
| **Size variants** | ✅ sm/md/lg | ✅ default/small | ✅ xs/sm/md/lg/xl | ⚠️ Via styling | ✅ xs/sm/md/lg/xl | ❌ No |
| **Colors** | ✅ colorPalette | ❌ Fixed Material | ✅ 7 schemes | ✅ Theme colors | ✅ Theme colors | ❌ Fixed |
| **Mobile variant** | ❌ No | ⚠️ Auto-responsive | ❌ No | ✅ MobileStepper | ❌ No | ❌ No |
| **Progress bar** | ✅ Steps.Progress | ✅ percent prop | ❌ No | ✅ MobileStepper variant | ❌ No | ❌ No |
| **Loading state** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No |
| **Error state** | ⚠️ Via styling | ✅ status="error" | ⚠️ Via custom | ✅ error prop | ⚠️ Via custom | ❌ No |
| **Optional steps** | ❌ No | ⚠️ Via status | ❌ No | ✅ optional prop | ❌ No | ❌ No |
| **Completion state** | ✅ CompletedContent | ❌ External | ⚠️ Via content | ❌ External | ✅ Stepper.Completed | ❌ External |
| **Custom templates** | ⚠️ Via composition | ✅ progressDot function | ✅ Named slots | ⚠️ Via composition | ⚠️ Via composition | ✅ template function |
| **Foundation** | Ark UI | Native | Reka UI | Native | Native | Native |
| **Best for** | Complex custom | Chinese market, enterprise | Vue/Nuxt | Material Design, mobile | React + TS | PrimeReact ecosystem |

## Key Takeaways

### Design Patterns:
1. **Controlled components dominate**: 6/6 require external state, only 2/6 offer uncontrolled mode
2. **Horizontal is universal**: All default to horizontal, 83% support vertical
3. **Linear is default**: Sequential progression is default, non-linear is opt-in
4. **Compositional vs declarative**: Split between sub-components and items arrays
5. **Accessibility is standard**: All provide ARIA support and keyboard navigation

### Implementation Approaches:
1. **Compositional** (Chakra, MUI): Maximum flexibility, more complexity
2. **Declarative** (Ant, Nuxt): Simpler API, faster development
3. **Model-based** (PrimeReact): Framework consistency, minimal features

### Framework Trends:
1. **Moving toward**: Items APIs, controlled-only, TypeScript-first, cross-framework foundations
2. **Moving away from**: Children patterns, uncontrolled mode, framework-specific designs
3. **Emerging**: Mobile-specific variants, loading states, progress percentage

### Selection Criteria:
- **Need maximum customization**: Chakra UI (11 components, Ark UI)
- **Need mobile optimization**: MUI (MobileStepper variants)
- **Using Vue/Nuxt**: Nuxt UI (v-model, slots, Reka UI)
- **Want modern API**: Ant Design (items array, responsive)
- **Need navigation patterns**: Mantine (3 control patterns, loading)
- **Using PrimeReact**: PrimeReact (MenuItem consistency)

## Raw Data

Individual framework reports available at:
- `/ai/research/stepper/chakra-ui/usage-patterns.md`
- `/ai/research/stepper/ant-design/usage-patterns.md`
- `/ai/research/stepper/nuxt-ui/usage-patterns.md`
- `/ai/research/stepper/mui/usage-patterns.md`
- `/ai/research/stepper/mantine/usage-patterns.md`
- `/ai/research/stepper/primereact/usage-patterns.md`
