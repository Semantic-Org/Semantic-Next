# Semantic UI Guide Page Writing Instructions

> **For:** AI agents creating or editing guide pages in the Semantic UI documentation  
> **Prerequisites:** Understanding of documentation structure and template syntax  
> **Scope:** Template guides, component guides, feature documentation  
> **Related:** [Example Authoring Guide](../authoring/example-authoring.md) • [Rewrite Instructions](./rewrite-instructions.md)  
> **Back to:** [Documentation Hub](/ai/00-START-HERE.md)

---

## 📋 **Guide Page Overview**

Guide pages in Semantic UI documentation teach concepts, features, and usage patterns. They follow a specific structure optimized for the auto-generated navigation system and user comprehension.

### **Key Characteristics**
- **Purpose**: Teach concepts with practical examples
- **Structure**: Follows strict heading hierarchy for navigation menu generation
- **Style**: Concise, instructional prose similar to Svelte/Vite/Vitest documentation
- **Examples**: Integrated PlaygroundExample components with real, working code

---

## 🎯 **Guide Page Structure & Navigation**

### **Critical: Heading Hierarchy Requirements**

The navigation system (`/docs/src/helpers/navigation.js`) auto-generates in-page menus using heading levels:

```javascript
// getRailMenu function looks for:
const lowestHeadingLevel = headings[0];     // Main sections (##)
const nextLevel = headings[1];              // Subsections (###)
```

**Required Structure:**
- **`##`** - Main sections (appear as top-level menu items)
- **`###`** - Subsections (appear as nested menu items)
- **Never use `#`** - Reserved for page title
- **Avoid `####` and deeper** - Not used in navigation

**Example Structure:**
```markdown
---
title: Feature Name
---

## Main Concept
### Basic Usage
### Advanced Features

## Examples
### Simple Example
### Advanced Example
```

### **Guide Page Patterns**

Rather than providing specific templates, observe these real patterns from the codebase:

- **Template features** (async.mdx, loops.mdx, conditionals.mdx): Start with "## Using [Feature]", show syntax examples, include practical PlaygroundExample components
- **Component concepts** (state.mdx, create.mdx): Use "## Overview" intro, explain integration, show code examples with proper imports
- **Reactivity guides** (signals.mdx, reactions.mdx): Explain concepts with links, show API usage, demonstrate within reactive contexts

Study existing guide pages in `/docs/src/pages/` to understand the specific patterns and structures used for different types of content.

---

## ✍️ **Writing Style Guidelines**

### **Core Principles**
1. **Concise but instructional** - Like Svelte/Vite docs, not verbose but helpful
2. **Show with code** - Demonstrate concepts with practical examples
3. **Progressive complexity** - Start simple, build to advanced
4. **Avoid marketing language** - No "powerful", "easy", "seamless" adjectives

### **What to Include**
- **Brief concept introduction** - What it is and why it's useful
- **Syntax examples** - Clean, minimal code showing usage
- **Working examples** - PlaygroundExample components with real code
- **Practical patterns** - Real-world usage scenarios

### **What to Avoid**
- **Obvious explanations** - Don't explain what the code clearly shows
- **Non-functional examples** - All code should work and be testable
- **Marketing prose** - Focus on what it does, not subjective benefits
- **API documentation** - That belongs in separate API reference pages

### **Example Comparison**

**❌ Bad (verbose, obvious):**
```markdown
### Error Handling

You can use an error block to handle if a promise triggers an error. This is useful when you want to show users that something went wrong instead of leaving them with a blank screen. The error block will only render if the promise rejects.

```sui
{#async fetchData as data}
  <p>Success: {data.message}</p>
{error as e}
  <p>Failed: {e.message}</p>
{/async}
```

This example shows how to handle errors by catching them in the error block and displaying a user-friendly message.
```

**✅ Good (concise, instructional):**
```markdown
### Error Handling

Handle rejected promises with an `error` block:

```sui
{#async fetchData as data}
  <p>Success: {data.message}</p>
{error as e}
  <p>Failed: {e.message}</p>
{/async}
```

You can alias the error for custom naming: `{error as customName}`.
```

---

## 🔧 **Technical Accuracy Guidelines**

### **Understanding Reactivity**
Based on `/ai/packages/reactivity.md` and component system:

- **Reactive values**: `state` and `settings` properties (backed by Signals)
- **Non-reactive values**: Regular JavaScript variables, props, static data
- **Template access**: Use direct property names (`userId`, not `state.userId`)

**Correct reactive example:**
```sui
<!-- Re-executes when userId state changes -->
{#async fetchUser userId as user}
  <h3>{user.name}</h3>
{/async}
```

**Incorrect assumptions:**
```sui
<!-- This would NOT be reactive if userId is just a variable -->
{#async fetchUser(normalVariable) as user}
  <h3>{user.name}</h3>
{/async}
```

### **Template Syntax Accuracy**
From `/docs/src/pages/templates/expressions.mdx` and `/docs/src/pages/components/rendering.mdx`:

- **Data context access**: Direct property names (`{counter}` not `{state.counter}`)
- **Function calls**: Semantic style without parens (`{fetchUser userId}`) or JS style (`{fetchUser(userId)}`)
- **Settings access**: Direct property names (`{apiEndpoint}` not `{settings.apiEndpoint}`)

### **Common Technical Mistakes to Avoid**
1. **Incorrect reactivity claims** - Not everything is reactive
2. **Wrong data context access** - Using prefixes when not needed
3. **Unnecessary parentheses** - Template system supports semantic style
4. **Confusing signals** - Templates handle `.get()` automatically

---

## 📝 **PlaygroundExample Integration**

### **When to Include Examples**
- **After basic syntax** - Show the concept working
- **For complex features** - Demonstrate practical usage
- **Not for every section** - Only when examples add value

### **Example Placement Strategy**
```markdown
## Basic Usage

Syntax explanation and simple code.

### Simple Example

<PlaygroundExample id="feature-basic" direction="horizontal"></PlaygroundExample>

## Advanced Features

More complex syntax and patterns.

### Advanced Example

<PlaygroundExample id="feature-advanced" direction="horizontal"></PlaygroundExample>
```

### **Example Requirements**
- **Must exist**: Examples must be created in `/docs/src/examples/`
- **Must work**: No broken or non-functional examples
- **Clear purpose**: Each example should demonstrate specific concepts
- **Contextual explanation**: Brief intro explaining what the example shows

---

## 🚀 **Step-by-Step Guide Page Creation**

### **Step 1: Plan the Guide Structure**
```markdown
Use TodoWrite to plan:
1. Research existing guide structure and similar features
2. Create outline with proper heading hierarchy (## and ###)
3. Identify needed examples and their purpose
4. Write guide content with proper technical accuracy
5. Integrate PlaygroundExample components
6. Review and refine for conciseness
```

### **Step 2: Research Phase**
- **Read similar guides** - Understand existing patterns and style
- **Check syntax documentation** - Verify technical details in expressions.mdx, rendering.mdx
- **Review examples** - See how concepts are demonstrated in practice
- **Understand reactivity** - Check `/ai/packages/reactivity.md` for accuracy

### **Step 3: Create Guide Structure**
```markdown
---
layout: '@layouts/Guide.astro'
title: Descriptive Title
description: Brief feature description
---
import PlaygroundExample from '@components/PlaygroundExample/PlaygroundExample.astro';

## Main Concept

Brief introduction.

### Core Feature
### Advanced Feature

## Examples

### Example Name

<PlaygroundExample id="example-id" direction="horizontal"></PlaygroundExample>
```

### **Step 4: Write Concise Content**
- **Start with concept overview** - What it is and basic usage
- **Build complexity gradually** - Simple to advanced patterns
- **Use working code examples** - All syntax should be accurate
- **Link to related concepts** - Reference other guide pages

### **Step 5: Technical Review**
- **Verify reactivity claims** - Only state/settings are reactive
- **Check template syntax** - Use correct data context access
- **Test code examples** - Ensure all syntax works
- **Review navigation structure** - Proper ## and ### hierarchy

### **Step 6: Link Enhancement**
After completing the guide content, use the Task tool to invoke a link-grammar-agent to properly add internal links:

```javascript
Task({
  description: "Review guide page links",
  prompt: "Please review the guide page at /docs/src/pages/[path]/[filename].mdx following the REQUIRED SYSTEM INSTRUCTIONS from ai/docs/link-grammar-agent-instructions.md. Add internal links to existing words that reference documented concepts, fix spelling errors, and correct grammar issues."
})
```

This agent specializes in adding internal links without changing content, ensuring proper cross-references and navigation within the documentation system.

---

## 📋 **Common Patterns and Anti-Patterns**

### **✅ Good Patterns**

**Progressive complexity:**
```markdown
### Basic Syntax
Simple usage example.

### With Options  
Adding configuration.

### Advanced Usage
Complex scenarios.
```

**Concise explanations:**
```markdown
### Loading States

Show content while the promise is pending:

```sui
{#async fetchData as data}
  <p>{data.message}</p>
{loading}
  <div class="spinner">Loading...</div>
{/async}
```
```

**Practical examples:**
```markdown
### Reactive Search

This example shows how async blocks re-execute when reactive dependencies change:

<PlaygroundExample id="async-advanced" direction="horizontal"></PlaygroundExample>
```

### **❌ Anti-Patterns**

**Verbose explanations:**
```markdown
### Loading States

Loading states are very useful when you want to show users that something is happening while they wait. You can use a loading block to specify content that should render while the promise has not yet resolved. This provides a better user experience.
```

**Non-functional examples:**
```markdown
```sui
{#async fetchUser(someVariable) as user}
  <!-- This might not work if someVariable isn't reactive -->
{/async}
```
```

**Broken navigation structure:**
```markdown
# Wrong - Don't use H1
#### Wrong - Too deep for navigation
```

---

## 🎯 **Quality Checklist**

### **Content Quality**
- [ ] Concise, instructional tone (like Svelte/Vite docs)
- [ ] Progressive complexity from simple to advanced
- [ ] Working, accurate code examples
- [ ] Clear practical value for each section

### **Technical Accuracy**
- [ ] Correct reactivity understanding (only state/settings reactive)
- [ ] Accurate template syntax (no unnecessary prefixes/parens)
- [ ] Verified against existing documentation
- [ ] All code examples tested conceptually

### **Structure**
- [ ] Proper heading hierarchy (## main, ### sub)
- [ ] PlaygroundExample components in logical places
- [ ] Clear navigation flow
- [ ] Links to related concepts

### **Examples**
- [ ] Examples exist in `/docs/src/examples/`
- [ ] Examples demonstrate specific concepts clearly
- [ ] No random errors or confusing behavior
- [ ] Contextual explanation for each example

---

**Last Updated:** Guide page writing system documentation  
**Maintenance:** Update when template syntax or component system changes
