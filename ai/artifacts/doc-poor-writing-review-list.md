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

*No issues recorded yet*

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