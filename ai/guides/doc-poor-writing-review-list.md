# Documentation Poor Writing Review List

## How to Use This Document

For each problematic passage found, record:
- **File**: Path to the file
- **Line**: Line number(s)
- **Issue**: Pattern type from identification guide
- **Text**: Exact problematic text (quoted)
- **Suggestion**: Brief improvement direction

## Example Entry Format

**File**: `/docs/src/pages/api/templating/ast.mdx`  
**Line**: 172  
**Issue**: Concluding Paragraph  
**Text**: "By working with this AST structure, you can create highly optimized and flexible rendering systems that suit your specific needs while leveraging the powerful parsing capabilities of the Semantic UI Templating system."  
**Suggestion**: Delete entirely

---

## Framework Documentation Issues

### Introduction Section

**File**: `/docs/src/pages/introduction.mdx`  
**Line**: 11  
**Issue**: Overly Long Sentence  
**Text**: "Semantic UI is a framework for authoring **standard W3C [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)** that work natively in modern browsers, integrate readily with frameworks like [React](https://react.dev/), [Vue](https://vuejs.org/), [Angular](https://angular.io/), or others supporting Web Components, and offer long-term maintainability with reduced framework lock-in."  
**Suggestion**: Split into two sentences - FIXED

**File**: `/docs/src/pages/introduction.mdx`  
**Line**: 26  
**Issue**: Marketing Buzzword  
**Text**: "Robust CSS token framework"  
**Suggestion**: Remove "Robust" - FIXED

**File**: `/docs/src/pages/introduction.mdx`  
**Line**: 32  
**Issue**: Verbose Introduction  
**Text**: "provides a collection of essential, pre-built UI components that can be used as a basis to build your website, or other higher-order UI components"  
**Suggestion**: Simplify to core purpose - FIXED

**File**: `/docs/src/pages/introduction.mdx`  
**Line**: 46  
**Issue**: Typo + Awkward Phrasing  
**Text**: "Semantic UI providesthe [component authoring framework](/components) a set of composable libraries"  
**Suggestion**: Fix typo, simplify structure - FIXED

**File**: `/docs/src/pages/introduction.mdx`  
**Line**: 59  
**Issue**: Academic Tone  
**Text**: "Reactive templating language"  
**Suggestion**: Remove "Reactive" - FIXED

**File**: `/docs/src/pages/introduction.mdx`  
**Line**: 65  
**Issue**: Marketing Buzzword  
**Text**: "Performant signals-based reactivity library"  
**Suggestion**: Remove "Performant" - FIXED

**File**: `/docs/src/pages/introduction.mdx`  
**Line**: 83  
**Issue**: Typo + Redundant Phrasing  
**Text**: "are each designed to be standalone and can be used without adoping"  
**Suggestion**: Fix typo, remove redundancy - FIXED

**File**: `/docs/src/pages/introduction.mdx`  
**Line**: 13, 21  
**Issue**: Poor Header Organization  
**Text**: H3 headers before H2 headers breaking rail menu hierarchy  
**Suggestion**: Convert H3s to H2s for proper rail menu structure - FIXED

### Components Section

**File**: `/docs/src/pages/components/index.mdx`  
**Line**: 10  
**Issue**: Overly Long Sentence  
**Text**: "Semantic UI components are standard [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) built with an integrated authoring framework that simplifies common UI development tasks like managing state, rendering templates, handling events, and styling."  
**Suggestion**: Split into two sentences - FIXED

**File**: `/docs/src/pages/components/index.mdx`  
**Line**: 16  
**Issue**: Academic Tone  
**Text**: "A reactive AST-based templating system"  
**Suggestion**: Remove "reactive" - FIXED

**File**: `/docs/src/pages/components/index.mdx`  
**Line**: 17  
**Issue**: Marketing Buzzword  
**Text**: "A performant [Signals](/reactivity/variables)-based system"  
**Suggestion**: Remove "performant" - FIXED

**File**: `/docs/src/pages/components/index.mdx`  
**Line**: 31  
**Issue**: Unnecessary Drama + Marketing Speak  
**Text**: "Web components can be notoriously difficult to integrate using vanilla js" + "developer magic"  
**Suggestion**: Remove "notoriously", replace "developer magic" with "build complexity" - FIXED

**File**: `/docs/src/pages/components/create.mdx`  
**Line**: 8  
**Issue**: Overly Long Sentence  
**Text**: "Semantic UI extends [native web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) to support [reactive data](/components/reactivity), [event binding](/components/events), [templating](/components/rendering), [DOM Querying](/components/dom), [keybindings](/components/keys) and more to allow you to build complex web applications purely with web components."  
**Suggestion**: Split into two sentences - FIXED

**File**: `/docs/src/pages/components/create.mdx`  
**Line**: 36  
**Issue**: Typo  
**Text**: "allowing you include it"  
**Suggestion**: Add missing "to" - FIXED

**File**: `/docs/src/pages/components/create.mdx`  
**Line**: 52  
**Issue**: Verbose Introduction  
**Text**: "In most real world use-cases you will need to provide additional information"  
**Suggestion**: Simplify to "Most components need additional configuration options:" - FIXED

**File**: `/docs/src/pages/components/create.mdx`  
**Line**: 171  
**Issue**: Typo + Grammar  
**Text**: "arbitray code during different parts of a components lifecycle"  
**Suggestion**: Fix "arbitrary" and add apostrophe to "component's" - FIXED

**File**: `/docs/src/pages/components/create.mdx`  
**Line**: 207  
**Issue**: Syntax Error  
**Text**: "const defineComponent({"  
**Suggestion**: Remove "const" declaration - FIXED

**File**: `/docs/src/pages/components/instances.mdx`  
**Line**: 9  
**Issue**: Overly Long Sentence  
**Text**: "The `createComponent` callback can be used when [creating a component](/components/create) to define the behaviors of your component so that they can be accessed in various other locations that might need to reference or invoke them."  
**Suggestion**: Split into two sentences, make more direct - FIXED

**File**: `/docs/src/pages/components/instances.mdx`  
**Line**: 27  
**Issue**: Redundant Phrasing  
**Text**: "including methods that define your components behavior"  
**Suggestion**: Simplify to "and its methods" - FIXED

**File**: `/docs/src/pages/components/instances.mdx`  
**Line**: 46  
**Issue**: Typo  
**Text**: "You you can access"  
**Suggestion**: Remove duplicate "You" - FIXED

**File**: `/docs/src/pages/components/instances.mdx`  
**Line**: 61  
**Issue**: Syntax Error  
**Text**: "const onRendered(({ self, isClient }) => {"  
**Suggestion**: Add missing "=" - FIXED

**File**: `/docs/src/pages/components/instances.mdx`  
**Line**: 136  
**Issue**: Broken Link  
**Text**: "[sub template](templates/subtemplates)"  
**Suggestion**: Fix missing "/" in link - FIXED

**File**: `/docs/src/pages/components/instances.mdx`  
**Line**: 181  
**Issue**: Verbose Explanation  
**Text**: "Each copy of your component will have a separate instance which will store its values"  
**Suggestion**: Simplify to "Each component instance stores its values" - FIXED

**File**: `/docs/src/pages/components/instances.mdx`  
**Line**: 13-14  
**Issue**: Logical Inconsistency  
**Text**: "**Outside Component**" containing "**Inside** your [component]"  
**Suggestion**: Change to "**From Other Components**" with "From parent/child components" - FIXED

#### Components/rendering.mdx

**File**: `/docs/src/pages/components/rendering.mdx`  
**Line**: 25-27  
**Issue**: Redundant List Item  
**Text**: \"Snippets\" listed twice with different descriptions  
**Suggestion**: Remove duplicate entry - FIXED

**File**: `/docs/src/pages/components/rendering.mdx`  
**Line**: 29  
**Issue**: Informal Phrasing  
**Text**: \"check our dedicated subsection\"  
**Suggestion**: Simplify to \"see\" - FIXED

**File**: `/docs/src/pages/components/rendering.mdx`  
**Line**: 48  
**Issue**: Verbose Explanation  
**Text**: Long explanation about template data context flexibility  
**Suggestion**: Condense to essential point - FIXED

**File**: `/docs/src/pages/components/rendering.mdx`  
**Line**: 84  
**Issue**: Marketing Buzzword  
**Text**: \"reactive data store\"  
**Suggestion**: Remove \"reactive\" - FIXED

**File**: `/docs/src/pages/components/rendering.mdx`  
**Line**: 172  
**Issue**: Redundant Phrasing  
**Text**: \"available across all templates\"  
**Suggestion**: Simplify to \"available in all templates\" - FIXED

**File**: `/docs/src/pages/components/rendering.mdx`  
**Line**: 187  
**Issue**: Redundant Concluding Reference  
**Text**: \"For a complete list of available global helpers see [global helpers]\"  
**Suggestion**: Delete - already referenced above - FIXED

#### Components/settings.mdx

**File**: `/docs/src/pages/components/settings.mdx`  
**Line**: 67  
**Issue**: Marketing Buzzword  
**Text**: \"convenient methods\"  
**Suggestion**: Remove \"convenient\" - FIXED

**File**: `/docs/src/pages/components/settings.mdx`  
**Line**: 107  
**Issue**: Verbose Introduction  
**Text**: \"For components that need to be configured before they're used, the\"  
**Suggestion**: Remove unnecessary explanation - FIXED

**File**: `/docs/src/pages/components/settings.mdx`  
**Line**: 119  
**Issue**: Hedging Words  
**Text**: \"This is especially useful\"  
**Suggestion**: Remove \"This is especially\" - FIXED

**File**: `/docs/src/pages/components/settings.mdx`  
**Line**: 146  
**Issue**: Syntax Error  
**Text**: \"setting(users,\" missing quotes  
**Suggestion**: Add quotes around 'users' - FIXED

**File**: `/docs/src/pages/components/settings.mdx`  
**Line**: 159  
**Issue**: Syntax Error  
**Text**: Missing closing parenthesis  
**Suggestion**: Add closing parenthesis - FIXED

**File**: `/docs/src/pages/components/settings.mdx`  
**Line**: 162-172  
**Issue**: Verbose Concluding Section  
**Text**: \"Putting It All Together\" section with excessive bullet points  
**Suggestion**: Simplify to brief example introduction - FIXED

#### Components/state.mdx

**File**: `/docs/src/pages/components/state.mdx`  
**Line**: 16  
**Issue**: Marketing Buzzword  
**Text**: \"Signals-based reactivity system\"  
**Suggestion**: Remove \"-based\" - FIXED

**File**: `/docs/src/pages/components/state.mdx`  
**Line**: 70  
**Issue**: Redundant Explanation  
**Text**: Duplicate explanation of template access syntax  
**Suggestion**: Remove redundant sentence, keep emphasis block - FIXED

**File**: `/docs/src/pages/components/state.mdx`  
**Line**: 75  
**Issue**: HTML Comment Syntax Error  
**Text**: \"<!--- Right !-- >\" with extra space  
**Suggestion**: Fix comment syntax - FIXED

**File**: `/docs/src/pages/components/state.mdx`  
**Line**: 136  
**Issue**: Marketing Buzzword  
**Text**: \"convenient built-in\"  
**Suggestion**: Remove \"convenient\" - FIXED

**File**: `/docs/src/pages/components/state.mdx`  
**Line**: 174  
**Issue**: Verbose Reference  
**Text**: Long reference with parenthetical explanation  
**Suggestion**: Simplify reference - FIXED

**File**: `/docs/src/pages/components/state.mdx`  
**Line**: 224  
**Issue**: Wrong Reference  
**Text**: \"Reactive Computations\" (doesn't exist)  
**Suggestion**: Change to \"Reactions\" - FIXED

#### Components/events.mdx

**File**: `/docs/src/pages/components/events.mdx`  
**Line**: 5  
**Issue**: Typo  
**Text**: \"Usings events\"  
**Suggestion**: Change to \"Using events\" - FIXED

**File**: `/docs/src/pages/components/events.mdx`  
**Line**: 73  
**Issue**: Syntax Error  
**Text**: Missing comma after event handler  
**Suggestion**: Add comma - FIXED

**File**: `/docs/src/pages/components/events.mdx`  
**Line**: 168  
**Issue**: Syntax Error  
**Text**: Extra bracket in destructuring \"data]}\"  
**Suggestion**: Remove extra bracket - FIXED

**File**: `/docs/src/pages/components/events.mdx`  
**Line**: 180  
**Issue**: Syntax Error  
**Text**: Missing \"=\" in arrow function  
**Suggestion**: Add missing \"=\" - FIXED

**File**: `/docs/src/pages/components/events.mdx`  
**Line**: 213  
**Issue**: Wrong Reference  
**Text**: \"abortSignals\" should be \"abortController\"  
**Suggestion**: Fix reference - FIXED

**File**: `/docs/src/pages/components/events.mdx`  
**Line**: 253  
**Issue**: Wrong Link Path  
**Text**: \"/component/settings\" missing \"s\"  
**Suggestion**: Fix to \"/components/settings\" - FIXED

**File**: `/docs/src/pages/components/events.mdx`  
**Line**: 302  
**Issue**: Grammar Error + Run-on Sentence  
**Text**: \"similar to Components all emit\"  
**Suggestion**: Split into two sentences - FIXED

### Templates Section

*No issues recorded yet*

### Reactivity Section

*No issues recorded yet*

### Query Section

*No issues recorded yet*

### Advanced Usage Section

*No issues recorded yet*

---

## API Reference Issues

### Components API

*No issues recorded yet*

### Template Helpers

*No issues recorded yet*

### Reactivity API

*No issues recorded yet*

### Query API

*No issues recorded yet*

### Utils API

*No issues recorded yet*

### Template Compiler

**File**: `/docs/src/pages/api/templating/ast.mdx`  
**Line**: 162  
**Issue**: Hedging Words + Typo  
**Text**: "but Semantic UI templates can hypothetically be used with any custom renderering engine"  
**Suggestion**: Remove "hypothetically", fix "renderering" → "rendering"

**File**: `/docs/src/pages/api/templating/ast.mdx`  
**Line**: 172  
**Issue**: Concluding Paragraph  
**Text**: "By working with this AST structure, you can create highly optimized and flexible rendering systems that suit your specific needs while leveraging the powerful parsing capabilities of the Semantic UI Templating system."  
**Suggestion**: Delete entirely

### Renderer

*No issues recorded yet*

---

## UI Components Issues

### Usage Section

*No issues recorded yet*

### UI Primitives

*No issues recorded yet*

---

## Header Structure Issues

### Pages with Poor InPageMenu Structure

*No issues recorded yet*

### Headers Too Long for Sidebar

*No issues recorded yet*

---

## Summary Statistics

- **Total Issues Found**: 2
- **Pages Reviewed**: 1
- **Most Common Issue**: Concluding Paragraphs
- **Files Needing Header Restructure**: 0

---

## Notes for Reviewers

- Follow the identification guide patterns
- Focus on deletion over rewriting  
- Validate InPageMenu structure after changes
- Mark pages as reviewed in the checklist
- Add new patterns to the identification guide if discovered