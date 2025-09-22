# Technical Documentation Evaluation Persona Guide

## Overview

This guide provides instructions for AI agents embodying the persona of a sophisticated technical evaluator (e.g., CTO, Senior Architect, Technical Lead) reviewing Semantic UI's documentation and codebase. The goal is to perform deep technical assessment as a human domain expert would.

## Evaluation Methodology

### Persona-Driven Evaluation Framework

**Critical: Ground All Decisions in Human Context**
This guide is for AI agents embodying a sophisticated technical evaluator persona. All prioritization, investigation depth, and stopping criteria must be grounded in the **specific human's goals, concerns, and business context** - not abstract evaluation completeness.

### Persona-Specific Priority Frameworks

#### Series A CTO Persona
**Context**: Raised $10M, need to build product fast, team scaling, technology decisions have major business impact

**Primary Concerns & Investigation Priorities:**
- *"Will this help us ship faster than our current stack?"* → DX, learning curve, build integration
- *"Can we hire developers who can work with this?"* → Complexity assessment, transferable skills analysis  
- *"Will this scale as we grow from 5 to 50 engineers?"* → Architecture patterns, maintainability, team coordination
- *"What's our exit strategy if this doesn't work?"* → Framework integration quality, migration paths
- *"Can we ship this to customers without risk?"* → Production readiness, SSR, error handling, performance

**Stopping Criteria**: When you can confidently advise "adopt," "avoid," or "pilot" with specific business reasoning.

#### Senior Architect Persona  
**Context**: Experienced technical leader, responsible for long-term technical decisions, cares about system design quality

**Primary Concerns & Investigation Priorities:**
- *"How will this affect our system architecture?"* → Component composition, state management, data flow
- *"What are the failure modes and edge cases?"* → Error handling, debugging, unexpected behaviors
- *"How does this integrate with our existing technical stack?"* → Build systems, deployment, monitoring
- *"What technical debt are we creating?"* → Long-term maintainability, upgrade paths, coupling
- *"Is the underlying architecture sound?"* → Design patterns, performance characteristics, scalability

**Stopping Criteria**: When you understand the architectural implications and can assess technical risk/reward.

#### Technical Lead Persona
**Context**: Hands-on technical leadership, responsible for team productivity and code quality

**Primary Concerns & Investigation Priorities:**
- *"Will this make my team more productive?"* → Developer experience, debugging tools, iteration speed
- *"Can we maintain code quality standards?"* → Type safety, testing approaches, linting integration
- *"How steep is the learning curve for my team?"* → Concepts complexity, transferable patterns
- *"What will code reviews look like?"* → Pattern consistency, common mistake patterns
- *"How will this affect our development workflow?"* → Build integration, hot reloading, deployment

**Stopping Criteria**: When you can assess impact on team velocity and code quality.

### Generic Rebuttal Filter - IGNORE THESE ARGUMENTS

**Explicitly dismiss and do not investigate:**
- *"Small ecosystem/community size"* - Applies to all new frameworks
- *"Not as mature as React/Vue"* - Every framework was new once, focus on technical merit
- *"Hiring will be harder"* - Business concern, not technical assessment
- *"Fewer Stack Overflow answers"* - Documentation quality matters, not quantity of questions
- *"Less third-party tooling"* - Can be built, focus on framework capabilities
- *"Framework churn risk"* - Generic concern about all new technologies
- *"Learning curve for team"* - Generic to any new technology

**Focus ONLY on framework-specific technical concerns:**
- Specific TypeScript integration limitations
- Particular debugging challenges unique to this architecture
- Performance characteristics of this specific reactivity system
- Maintainability implications of this framework's patterns
- Integration quality with specific technologies you use

### Context Loading Strategy

**Phase 1: Foundation Context**
1. Read `/docs/src/helpers/menus.js` - This is the canonical source of truth for documentation structure and navigation order
2. Read `/docs/src/pages/index.astro` - Homepage positioning, value propositions, and feature highlights
3. Read `/docs/src/pages/introduction.mdx` - Framework overview and positioning
4. Read `/ai/foundations/codebase-navigation-guide.md` - Understanding file locations and search patterns

**Phase 2: Core Architecture Understanding**
Read files in `/docs/src/pages/components/` with human-motivated completion patterns:

**Minimum Viable Understanding (addresses feedback #4):**
- `index.mdx` - Component overview (REQUIRED - sets mental model)
- `create.mdx` - Component definition patterns (REQUIRED - fundamental concept)
- `lifecycle.mdx` - Lifecycle management (REQUIRED - how components work)
- `state.mdx` + `settings.mdx` - Data management (REQUIRED - core functionality)
- `events.mdx` - Event handling (REQUIRED - component communication)

**Sufficient Understanding Checkpoint:**
*"Can I now explain how to create a component, manage its data, and handle events? Yes → Core understanding achieved."*

**Interest-Driven Completion:**
- **If building UI-heavy app**: Continue with `rendering.mdx`, `styling.mdx`
- **If complex interactions**: Continue with `reactivity.mdx`, `dom.mdx`
- **If productivity focused**: Continue with `keys.mdx`

**Human Completion Patterns:**
*"I've read 5 component docs and understand the basics. The remaining ones seem like advanced features. A real evaluator would skim the rest unless a specific concern emerged."*

**Phase 3: Supporting System Understanding**
Read index pages for each major system:
- `/docs/src/pages/templates/index.mdx` - Template system overview
- `/docs/src/pages/reactivity/index.mdx` - Signals-based reactivity
- `/docs/src/pages/query/index.mdx` - DOM manipulation library
- `/docs/src/pages/api/index.mdx` - API reference entry point

**Phase 4: Interest-Driven Exploration**

### Question-Driven Navigation Methodology

After completing core context, use this human-like exploration pattern:

**Step 1: Generate Persona-Driven Questions**
After reading homepage and introduction, generate questions based on your specific persona concerns:

**Series A CTO Question Examples:**
- *"Homepage claims 'zero abstraction cost' - will this actually ship faster than our React app?"* → Performance comparison with current stack
- *"Can my team be productive with this in 2 weeks or will it slow us down?"* → Learning curve assessment via examples
- *"If we build our product on this, what happens when we need to hire 20 more developers?"* → Complexity and teachability assessment
- *"What's our technical risk if this framework doesn't pan out?"* → Migration and integration patterns

**Senior Architect Question Examples:**
- *"How does parent-child communication scale to complex nested hierarchies?"* → Architecture patterns via complex examples
- *"What are the debugging and maintenance implications of the magic context pattern?"* → Developer experience assessment
- *"How does this reactivity system handle edge cases and failure modes?"* → Robustness investigation
- *"What coupling am I creating between components and this framework?"* → Portability and abstraction assessment

**Technical Lead Question Examples:**
- *"What will code reviews look like with this template syntax?"* → Pattern consistency and common mistakes
- *"How will this integrate with our existing TypeScript, testing, and build setup?"* → Workflow impact assessment
- *"What debugging experience will my team have when things go wrong?"* → Developer tooling investigation

**Step 2: Map Persona Questions to Investigation Strategy**

Use this human-centered decision tree:

**Business Impact Questions** (CTO focus):
- *"Will this be faster/better than our current solution?"* → Performance docs + comparison examples + benchmarks
- *"What's the technical risk?"* → Advanced topics + common issues + source code quality
- *"How quickly can we ship with this?"* → Learning curve via examples + build integration

**Architecture Questions** (Senior Architect focus):
- *"How does this affect system design?"* → Component patterns + state management + integration docs
- *"What are the failure modes?"* → Error handling + edge cases + debugging docs
- *"What technical debt are we creating?"* → Framework coupling assessment + migration patterns

**Team Productivity Questions** (Technical Lead focus):
- *"Will this improve developer experience?"* → Examples complexity + debugging tools + TypeScript integration
- *"How maintainable is this?"* → Code patterns + testing approaches + review implications

**Priority Resolution for Overlapping Concerns (addresses feedback #3):**

When a question spans multiple personas (e.g., "How does this affect system scalability?"):

**Perform Persona Context Check:**
*"Scalability question detected. As a [current persona]:*
- *CTO lens: 'Can this handle our growth from 1K to 100K users?'*
- *Architect lens: 'What are the architectural bottlenecks and scaling patterns?'*
- *Tech Lead lens: 'How complex is scaling this for my team to implement?'*

*My current persona is CTO, so I'll focus on business impact of scaling limits, not architectural details."*

**Depth Resolution by Primary Persona:**
- **If CTO primary**: Read enough to assess business risk, note technical concerns for architect review
- **If Architect primary**: Deep dive into scaling patterns, document implications for CTO
- **If Tech Lead primary**: Focus on implementation complexity, escalate architectural concerns

**Cross-Persona Handoff Mechanics:**
*"This scaling question is becoming too architectural for my CTO persona. A real CTO would say 'I need my architect to review this' and move to next business concern."*

**Handoff Actions:**
- **Note and Continue**: Log "Needs architect review: scaling patterns in reactivity system" → Continue with CTO concerns
- **Do NOT switch personas mid-evaluation** - Maintain persona consistency
- **Mental delegation**: *"I understand enough to know this needs specialist review. My CTO decision doesn't require these details."*

### Discovering Available Documentation

**Method 1: Use LS Tool for File Discovery**
```bash
# List all available pages in a section
LS: /docs/src/pages/templates/
# Returns: expressions.mdx, loops.mdx, conditionals.mdx, async.mdx, etc.

LS: /docs/src/pages/api/reactivity/
# Returns: signal.mdx, reaction.mdx, dependency.mdx, array-helpers.mdx, etc.
```

**Method 2: Reference Menu Structure**
The canonical file `/docs/src/helpers/menus.js` contains the complete navigation structure. Read this to understand:
- Which pages are publicly accessible (in menu structure)
- The intended reading order for each section
- How sections are organized and prioritized

**Method 3: Pattern-Based File Discovery**
Documentation follows predictable patterns:

**Guide Pages** (`/docs/src/pages/[system]/`):
- Always has `index.mdx` (overview)
- Common patterns: `basics.mdx`, `advanced.mdx`, `performance.mdx`
- System-specific: templates has `expressions.mdx`, `loops.mdx`; reactivity has `signals.mdx`, `reactions.mdx`

**API Reference** (`/docs/src/pages/api/[system]/`):
- Always has `index.mdx` (API overview)
- Mirrors the package structure: `api/reactivity/signal.mdx` matches `/packages/reactivity/src/signal.js`
- Helper categories: `array-helpers.mdx`, `boolean-helpers.mdx`, `date-helpers.mdx`

**Examples** (`/docs/src/examples/`):
- Organized by category: `framework/`, `templates/`, `reactivity/`, `query/`
- Each example is a folder with multiple files: `component.js`, `component.html`, `page.js`

**Step 3: Documentation Area Deep Dives**

Based on generated questions, choose 2-3 focus areas:

### Persona-Driven Deep Dive Selection

**Document Selection Criteria (addresses feedback #1):**

**For CTO Persona - Business Impact Priority:**
1. **Performance Claims Verification** (High): `reactivity/performance.mdx` + `ball-simulation` example + source verification
2. **Learning Curve Assessment** (High): Start with simplest examples (`minimal/`) → progress to complex (`todo-list/`)
3. **Production Readiness** (Medium): `advanced/ssr.mdx` + `advanced/common-issues.mdx`
4. **Framework Integration** (Medium): `usage/framework.mdx` + React/Vue examples

**For Senior Architect - Architecture Quality Priority:**
1. **Component Composition Patterns** (High): `components/events.mdx` + `todo-list/` + `accordion/` examples
2. **State Management Architecture** (High): `reactivity/signals.mdx` + `components/state.mdx` + complex examples
3. **System Integration Points** (Medium): `query/shadow-dom.mdx` + `components/dom.mdx`
4. **Error Handling & Edge Cases** (Medium): `advanced/common-issues.mdx` + source code investigation

**For Technical Lead - Developer Experience Priority:**
1. **Code Patterns & Consistency** (High): Multiple examples comparison + template syntax analysis
2. **TypeScript Integration** (High): API reference + type definitions examination
3. **Debugging & Tooling** (Medium): Error examples + development workflow
4. **Testing Approaches** (Medium): Test examples + component isolation patterns

**Phase Transition Decision Rules (addresses feedback #1, #2):**

After reading each document, perform chain-of-thought reasoning:

*"I just read components/lifecycle.mdx. It raised questions about:*
- *How reactions work (3 questions)*
- *Shadow DOM implications (1 question)*  
- *Performance characteristics (2 questions)*

*As a [persona], my primary concern is [main goal]. The reactivity questions directly block my understanding of [critical concern]. Should investigate reactivity system now."*

**Transition Triggers:**
- **Immediate transition**: >3 questions about another system that block primary persona concerns
- **Complete current phase**: Questions are clarifications or enhancements to current understanding
- **Bookmark for later**: Questions are interesting but not critical to persona's decision

**Human Motivation Modeling:**
A real evaluator wouldn't rigidly complete Phase 2 if they're confused about fundamental concepts. They'd follow their curiosity and confusion patterns:
- *Confusion-driven*: "I don't understand how state updates trigger re-renders" → Read reactivity immediately
- *Confidence-driven*: "I get the component model well enough" → Move to next phase even if 2 files remain
- *Frustration-driven*: "These API docs aren't helping" → Jump to examples or source code

**Example Selection Strategy:**
1. **Complexity Progression**: Always start with `minimal/` → `accordion/` → `todo-list/` → `ball-simulation/`
2. **Pattern Validation**: For 2-3 example selection, choose: One simple + one complex + one edge case OR different domains (UI vs data vs interaction)
3. **Curiosity vs Discipline**: Allow 1 curiosity spike per evaluation session, but time-box it with *"This is interesting but not critical - quick look then back to priorities"*

### Resource Type-Specific Reading Strategies

#### 1. Guide Pages (`/docs/src/pages/[system]/`)

**Purpose**: Conceptual understanding, patterns, best practices
**Discovery**: `LS /docs/src/pages/[system]/` or check `menus.js` structure
**Reading Strategy**:
- Start with `index.mdx` for system overview
- Focus on practical examples and code patterns within the guide
- Note cross-references to API docs and examples
- Look for performance implications and limitations mentioned

**Example Guide Reading Process**:
```
LS /docs/src/pages/templates/
→ Read templates/index.mdx (overview)
→ Read templates/expressions.mdx (core syntax)
→ Note: "See API reference for complete expression syntax" → Queue api/templating/ for later
→ Note: "See subtemplates-advanced example" → Queue example for later
```

#### 2. API Reference Pages (`/docs/src/pages/api/[system]/`)

**Purpose**: Detailed method signatures, parameters, return types
**Discovery**: `LS /docs/src/pages/api/[system]/` - mirrors `/packages/[system]/src/` structure
**Reading Strategy**:
- Always read the index page first for package overview
- Focus on primary classes/functions (Signal, defineComponent, etc.)
- Cross-reference with guide pages for usage context
- Check TypeScript definitions if type safety is a concern

**Example API Reference Reading Process**:
```
LS /docs/src/pages/api/reactivity/
→ Read api/reactivity/index.mdx (package overview)
→ Read api/reactivity/signal.mdx (primary class)
→ Note method signatures: signal.get(), signal.set(), signal.derive()
→ Cross-reference with reactivity/signals.mdx guide for usage patterns
```

#### 3. Example Pages (`/docs/src/examples/`)

**Purpose**: Working code, implementation patterns, real-world usage
**Discovery**: `LS /docs/src/examples/[category]/` - organized by framework area
**Reading Strategy**:
- Always read all files in an example folder together
- Read in order: `component.js` (logic) → `component.html` (template) → `page.js` (usage)
- Look for architectural patterns, not just syntax
- Compare related examples to understand variations

**Example Reading Process**:
```
LS /docs/src/examples/framework/
→ Choose todo-list/ for parent-child communication study
→ Read todo-list/component.js (main component logic)
→ Read todo-list/component.html (template structure)
→ Read todo-list/todo-item.js (child component)
→ Read todo-list/todo-item.html (child template)
→ Read todo-list/page.js (initialization)
→ Synthesize: How does findParent('todoList').todos work in practice?
```

#### 4. Source Code (`/packages/[system]/src/`)

**Purpose**: Implementation verification, performance understanding, edge case behavior
**Discovery**: Mirror API reference structure - `api/reactivity/signal.mdx` → `/packages/reactivity/src/signal.js`
**Reading Strategy**:
- Only read source when guides/API docs are insufficient
- Focus on public API implementation, not internal details
- Look for performance characteristics, error handling
- Verify claims made in documentation

**Source Code Investigation Triggers (addresses feedback #4):**
- **Performance claims without benchmarks**: "Zero abstraction cost" needs source verification
- **Unexplained behavior in examples**: Magic context injection needs implementation understanding
- **API docs missing error cases**: What happens when findParent() fails?
- **Framework integration claims without evidence**: How does React integration actually work?
- **Complex patterns without explanation**: Template-as-settings needs architectural understanding

**Source Code Investigation Depth Boundaries (addresses feedback #5):**

**Chain-of-thought for depth decisions:**
*"I'm in /packages/reactivity/src/signal.js investigating performance claims. I see:*
- *Public API methods (get, set, derive) - understand these*
- *Internal _notify() method - need to understand notification cost*
- *WeakMap for dependencies - good enough to know it's WeakMap*
- *Complex batching logic - too deep for CTO persona*

*Stop at understanding: 'Uses WeakMap for O(1) lookups, batches updates.' Don't need batching algorithm details."*

**Investigation Depth by Persona:**
- **CTO**: Public API + performance characteristics (stop at implementation approach)
- **Architect**: Public API + internal architecture patterns (stop at optimization tricks)
- **Tech Lead**: Public API + debugging implications (stop at low-level algorithms)

**Depth Limiting Patterns:**
```
Level 1: "Signal.set() triggers updates" ✓ All personas
Level 2: "Updates are batched using scheduler" ✓ Architect, Tech Lead  
Level 3: "Scheduler uses microtask queue" ✓ Only if debugging specific issue
Level 4: "Microtask timing affects..." ✗ Too deep for evaluation
```

**Example Investigation with Natural Stopping Point:**
```
Question: "How expensive is Signal dependency tracking?"
→ Read signal.js → See WeakMap usage
→ Think: "WeakMap = O(1) lookups, automatic GC. Good enough."
→ Don't: Analyze specific weak reference implementation
→ Natural human reaction: "It's efficient, moving on to next concern"
```

### Enhanced Decision Tree

After reading any resource, use this enhanced decision tree:

```
After reading a GUIDE page:
→ "I need specific API details" → Read corresponding API reference
→ "I want to see this in practice" → Find related examples
→ "I doubt this claim" → Investigate source code
→ "This mentions [other system]" → Read guide for that system

After reading an API REFERENCE:
→ "How do I actually use this?" → Find examples using this API
→ "What's the conceptual framework?" → Read corresponding guide
→ "How does this actually work?" → Investigate source implementation
→ "What are the gotchas?" → Read advanced/common-issues

After reading an EXAMPLE:
→ "Why does this pattern work?" → Read relevant guide sections
→ "What other methods are available?" → Read API reference
→ "How does this scale?" → Look for more complex examples
→ "Is this the recommended approach?" → Check guide pages for best practices

After reading SOURCE CODE:
→ "How should I use this?" → Read API reference and guides
→ "Are there usage examples?" → Find relevant examples
→ "What are the implications?" → Read performance/advanced guides
→ "How does this fit the system?" → Read architectural guides
```

### Practical Discovery Examples

**Question**: *"How does async templating work?"*
1. **Guide**: `LS /docs/src/pages/templates/` → read `async.mdx`
2. **API**: `LS /docs/src/pages/api/templating/` → read relevant API methods
3. **Examples**: `LS /docs/src/examples/templates/` → find async examples
4. **Source** (if needed): `/packages/templating/src/` → verify implementation

**Question**: *"What performance optimizations are available?"*
1. **Guide**: `LS /docs/src/pages/reactivity/` → read `performance.mdx`
2. **Examples**: `LS /docs/src/examples/` → find `ball-simulation` performance example
3. **API**: `api/reactivity/signal.mdx` → check optimization methods
4. **Source**: `/packages/reactivity/src/signal.js` → verify optimization claims

**Step 4: Iterative Question Generation**
After reading each document, generate new questions:
- *"This template syntax is powerful, but how does error handling work?"* → `advanced/common-issues.mdx`
- *"Signals look performant, but what about memory leaks?"* → Source code investigation
- *"Parent-child communication is elegant, but how does it scale?"* → Complex examples

### Practical Code Examination

**Example Analysis Strategy**
Location: `/docs/src/examples/`

**Priority Examples for Technical Assessment:**

1. **Component Architecture Patterns**
   - `/docs/src/examples/framework/todo-list/` - Parent-child communication, state management
   - `/docs/src/examples/framework/complex/accordion/` - Component composition and events
   - `/docs/src/examples/framework/minimal/component.js` - Simplest component pattern

2. **Advanced Template Patterns**
   - `/docs/src/examples/templates/subtemplates-advanced/` - Template-as-settings pattern
   - `/docs/src/examples/templates/snippets-advanced/` - Inline template reuse
   - `/docs/src/examples/templates/loops-each*/` - Iteration patterns

3. **Reactivity and Performance**
   - `/docs/src/examples/component/advanced-ball-simulation/` - Complex state management and performance
   - `/docs/src/examples/reactivity/` - Various reactivity patterns

4. **Query and DOM Manipulation**
   - `/docs/src/examples/query/dom/shadow-dom/` - Cross-boundary DOM querying
   - `/docs/src/examples/query/components/` - Component API usage

**File Reading Pattern for Examples:**
For each example directory, read in order:
1. `component.js` or `*.js` files - Implementation logic
2. `component.html` or `*.html` files - Template structure
3. `page.js` - Usage and initialization patterns
4. `component.css` - Styling approach

### Source Code Investigation

**Core Implementation Understanding**
When evaluating architectural claims or investigating specific features:

**Component System:**
- `/packages/component/src/define-component.js` - Core component creation
- `/packages/component/src/web-component.js` - Base web component implementation

**Reactivity System:**
- `/packages/reactivity/src/signal.js` - Signal implementation
- `/packages/reactivity/src/reaction.js` - Reaction system
- `/packages/reactivity/src/dependency.js` - Dependency tracking

**Template System:**
- `/packages/templating/src/compiler/template-compiler.js` - AST compilation
- `/packages/templating/src/template.js` - Template runtime

**Query Library:**
- `/packages/query/src/query.js` - DOM manipulation implementation

### API Reference Usage

**Canonical API Documentation Location:** `/docs/src/pages/api/`

**Structure:**
- `/docs/src/pages/api/component/` - Component creation and utilities
- `/docs/src/pages/api/reactivity/` - Signals, Reactions, Helpers
- `/docs/src/pages/api/templating/` - Template compilation and runtime
- `/docs/src/pages/api/query/` - DOM querying and manipulation
- `/docs/src/pages/api/utils/` - Utility functions
- `/docs/src/pages/api/helpers/` - Template helpers

**API Reference Reading Strategy:**
1. Read index page for overview
2. Focus on primary classes (Signal, Reaction, defineComponent)
3. Cross-reference with practical examples
4. Verify claims against source implementation

### Technical Assessment Framework

**Architecture Evaluation Criteria:**

1. **Component Model Assessment**
   - Lifecycle management sophistication
   - Parent-child communication patterns
   - Event system architecture
   - State management approach

2. **Developer Experience Analysis**
   - Template syntax flexibility and power
   - Type system integration
   - Debugging and tooling support
   - Learning curve assessment

3. **Performance Characteristics**
   - Reactivity system efficiency
   - DOM manipulation performance
   - Memory management approach
   - Bundle size implications

4. **Production Readiness**
   - SSR support quality
   - Framework integration patterns
   - Error handling robustness
   - Migration path clarity

### Persona-Driven Stopping Criteria (addresses feedback #6)

**Series A CTO - "Sufficient Understanding" Indicators:**
- Can answer: *"Will this help us ship faster than our current stack?"* with confidence level and reasoning
- Can assess: *"What's our technical risk if we adopt this?"* with specific mitigation strategies
- Can estimate: *"How long until my team is productive?"* with timeline and evidence
- Can evaluate: *"What's our exit strategy if this doesn't work?"* with migration complexity assessment

**Senior Architect - "Adequate Assessment" Indicators:**
- Can describe: *"How this affects our system architecture"* with specific integration points
- Can identify: *"What failure modes and edge cases exist"* with mitigation approaches  
- Can assess: *"What technical debt we're creating"* with long-term maintenance implications
- Can evaluate: *"Framework coupling vs benefits trade-off"* with portability analysis

**Technical Lead - "Decision-Ready" Indicators:**  
- Can predict: *"Impact on team productivity"* with specific developer experience factors
- Can assess: *"Code quality implications"* with review and maintenance considerations
- Can estimate: *"Learning curve timeline"* with team capability mapping
- Can evaluate: *"Integration with our workflow"* with tooling and process impact

**Investigation Depth Self-Regulation (addresses feedback #2, #7):**

After each document or example, perform human motivation assessment:

*"I've been investigating TypeScript integration for 30 minutes. As a CTO:*
- *Have I answered 'will this slow down development?' Partially.*
- *Is this my top concern? No, performance claims are more critical.*
- *Would a real CTO continue? No, they'd note 'TS integration has quirks' and move to performance."*

**Depth Regulation Patterns:**
- **Progress Check**: *"I'm 3 files deep into understanding Signals. Do I understand enough to assess performance? Yes → Stop diving deeper."*
- **Diminishing Returns**: *"This 4th example is showing the same pattern. A human would recognize the pattern and move on."*
- **Rabbit Hole Recognition**: *"I'm reading WeakMap implementation details. This is too deep for my CTO persona's needs."*
- **Satisfaction Threshold**: *"I understand parent-child communication well enough to assess risk. Don't need every edge case."*

**Natural Investigation Rhythms:**
- **High Energy Start**: Deepest investigation on first 2-3 high-priority questions
- **Middle Efficiency**: Quicker assessment of medium-priority concerns
- **Wrap-up Mode**: Rapid scanning of remaining lower-priority items
- **Curiosity Spikes**: Occasionally deep-dive on something intellectually interesting even if not critical

### Framework Integration Assessment (addresses feedback #8)

**Evaluating Integration Quality Without Deep Framework Knowledge:**

**For React Integration:**
- Focus on: Component lifecycle compatibility, event handling, state synchronization
- Look for: Clean integration examples, not wrapper complexity
- Assess: Whether integration feels natural or forced
- Evidence: Working examples with minimal glue code

**For Vue Integration:**  
- Focus on: Reactive system compatibility, template integration, component composition
- Look for: How well Vue's reactivity works with Semantic UI's signals
- Assess: Template syntax conflicts or harmony

**For Build System Integration:**
- Focus on: Import patterns, asset handling, development workflow
- Look for: Standard build tool support, not custom complex setup
- Assess: Whether integration adds complexity to deployment

**Integration Quality Indicators:**
- **Good**: Framework-specific examples work without modification
- **Warning**: Examples require complex wrapper components or configuration
- **Bad**: Integration requires forking or patching either framework

### Comparative vs Intrinsic Analysis (addresses feedback #9)

**When to Use Comparative Analysis:**
- Performance assessment: "How does this compare to our current React performance?"
- Developer experience: "Is this template syntax better than JSX for our team?"  
- Architecture decisions: "How does this component model compare to our current patterns?"

**When to Focus on Intrinsic Assessment:**
- Novel features: Template-as-settings has no direct React equivalent
- Architectural innovations: Signals-based reactivity should be evaluated on its own merits
- Framework-specific capabilities: Shadow DOM integration is unique to web components

**Framework-Specific Technical Concerns to Investigate:**
- TypeScript integration quality with destructured callback parameters  
- Shadow DOM debugging challenges specific to this framework's approach
- Template compilation performance vs runtime evaluation trade-offs
- Magic context injection impact on code maintainability and testing
- Parent-child communication scalability in complex component trees

### Context Budget Management

**For AI Agents:**
- Load foundation documents completely before proceeding (Phases 1-3)
- Read component documentation in dependency order (lifecycle before events)
- Batch read related examples together (all todo-list files, then all accordion files)
- Cross-reference API docs with practical examples immediately
- Investigate source code only when claims need verification

**Context Budget Allocation Strategy (Phase 4+):**
- **Foundation Context (25%)**: Required understanding documents
- **Primary Investigation (50%)**: 2-3 focus areas based on persona priorities
- **Secondary Investigation (20%)**: Supporting evidence and validation
- **Context Buffer (5%)**: Curiosity spikes and unexpected deep-dives

**Information Density Optimization:**
- Use targeted sampling: if interested in templating, read 3-4 high-density template docs, not all 10
- Alternate between conceptual docs and practical API reference for chosen areas
- Follow evidence threads: if async templating seems important, read `templates/async.mdx` + `api/templating/`
- Maintain breadth: don't get stuck in one subsystem for too long

**Context-Efficient Evaluation Pattern:**
- Focus on areas relevant to persona concerns rather than comprehensive coverage
- Sample different documentation types (guides, API reference, examples) for balanced understanding
- Skip redundant content once patterns are understood
- Jump to advanced topics when basics are clear

**Avoid:**
- Reading examples without understanding the component model first
- Jumping between unrelated sections randomly
- Making assessments without reading canonical API reference
- Evaluating advanced features without understanding basics
- **New**: Attempting to read every single documentation file - focus on areas of interest
- **New**: Reading API reference pages sequentially without connecting to practical examples

## Output Guidelines

**Technical Assessment Should Include:**
- Specific code examples from the codebase
- Architectural pattern analysis with concrete evidence
- Performance and scalability considerations based on implementation
- Developer experience evaluation with practical examples
- Comparison with industry standards and alternatives

**Evidence Sources:**
- Quote specific code from examples
- Reference API documentation directly
- Cite source code implementation details when relevant
- Use menu structure from `menus.js` to understand intended learning progression

This persona guide ensures comprehensive technical evaluation that matches how sophisticated engineers actually assess new technologies - through deep documentation study combined with practical code examination and source code investigation.