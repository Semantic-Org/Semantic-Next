# Proposal & Engineering Contract: The `{#define}` Universal Block

## 1. Feature: The `{#define}` Block

This document specifies a new, universal template block designed to handle both asynchronous value resolution and synchronous variable scoping with a single, elegant, and declarative API.

### 2. Core Philosophy & Value

* **Unified API:** Solves async/promise handling and synchronous `let`/aliasing with one construct, reducing the API surface area.
* **NL-First:** All keywords are chosen for natural language readability. The common case of `{#define getUsers as users}` reads naturally without redundancy.
* **Developer Flexibility:** Provides keyword aliases (`{#load}`, `{before}`, `{loading}`) to allow developers to choose the term that best fits their mental model.

### 3. Final Keyword API

* **Primary Keyword: `{#define}`**
    * The general-purpose keyword for defining a value in a new scope. It is ideal for all use cases, including synchronous aliasing (`let` behavior).
    * **Example:** `{#define state.user.profile as profile}` or `{#define getUsers() as users}`

* **Alias Keyword: `{#load}`**
    * A permitted alias for `{#define}`.
    * Offers stronger semantic clarity when the explicit intent is asynchronous data fetching, aligning with the framework's existing `loading` state vocabulary.

### 4. Final Syntax & Clauses

* **Main Clause (Success State)**
    * **Alias:** `{#define expression as alias}`
    * **Destructuring:** `{#define expression as { prop1, prop2, ...rest }}`
        * The first pass will support basic destructuring of properties and a rest operator. Renaming within the destructuring (`{ prop: newName }`) is out of scope for the first pass.
    * **Abbreviated:** `{#define expression}`
        * When no `as` clause is provided, the resolved value will be available via `{this}`, mirroring `{#each}`.

* **Sub-Clauses (Optional, Fixed Branches)**
    * **Pending State:** `{before}` and `{loading}` are interchangeable aliases.
    * **Error State:** `{error}` (injects a default `error` variable) and `{error as e}` (provides a custom alias).
    * **Else State:** `{else}` (renders if the successfully resolved value is nullish or an empty collection).

### 5. Implementation Architecture & Contract

This section codifies the key technical decisions that are to be followed during implementation.

* **AST Structure (The Final Blueprint)**
    * The `template-compiler.js` will parse the syntax into a `Define` node. The structure will have dedicated, named properties for each optional clause. This is more precise and efficient for the renderer than a generic `branches` array, as our clauses are fixed and not repeatable.
    * **Final AST Format:**
        ```json
        {
          "type": "define",
          "expression": "getUsers()",
          "alias": "users",

          "content": [ /* Array of nodes for success state */ ],

          "pending": [ /* Optional: Array of nodes for {before}/{loading} state */ ],
          "error": [ /* Optional: Array of nodes for {error} state */ ],
          "errorAlias": "e", // Optional: The alias for the error object
          "else": [ /* Optional: Array of nodes for {else} state */ ]
        }
        ```

* **Compiler & Renderer Responsibility**
    * The **`template-compiler.js`** is responsible *only* for parsing the `{#define}` and `{#load}` grammar into the standard `Define` AST node detailed above.
    * The **`renderer.js`** is responsible for interpreting the `Define` AST node, invoking the directive, and managing the creation of new data contexts for child templates, following the pattern established in the `{#each}` implementation.

* **Reactivity & Runtime Logic (The Critical Path)**
    * The stateful logic will be encapsulated in a new Lit directive (`define.js`).
    * This directive **must** be modeled on existing reactive directives.
    * The directive's core logic **must** be wrapped in a `Reaction.create()` to establish a reactive context, ensuring the block re-evaluates when signals in the `expression` change.

### 6. Development Workflow

The implementation will proceed in the following order to mitigate risk and ensure quality.

1.  **Phase 1: Compiler Implementation:** Update `template-compiler.js`.
2.  **Phase 2: Renderer & Directive Implementation:** Build the reactive `define` directive and integrate it into `renderer.js`.
3.  **Phase 3: Rigorous Testing:** Write comprehensive unit and integration tests covering the compiler, the directive's logic, and the final DOM output *before* proceeding.
4.  **Phase 4: Documentation:** After the feature is verified as stable, author all user-facing documentation and update all internal framework guides.
