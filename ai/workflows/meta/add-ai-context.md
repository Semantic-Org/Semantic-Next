# Workflow: Add AI Context Documentation

**Purpose**: Publish a new AI context guide under `/ai/`  
**Scope**: Foundation/specialized docs consumed by LLM agents  
**Prerequisites**: Familiarity with existing context layout, manifest schema, and routing documents

---

## 1. Preflight Analysis

1. **Confirm necessity**  
   - Search for overlapping material: `rg "<topic>" ai/`  
   - READ every related context you find. Do not replicate content already covered elsewhere; new guides must add distinct value.
2. **Classify the document**  
   - Decide category: `foundation`, `specialized`, `package`, `workflow`, or `reference`.  
   - Determine dependencies (which guides must be read first).
3. **Define audience + tags**  
   - Choose tags aligned with manifest conventions (e.g., `components`, `styling`, `documentation`, `reactivity`).

## 2. Author the Context File

1. **Choose location**  
   - Foundation: `ai/foundations/`  
   - Specialized guide: `ai/guides/...` (subfolders like `guides/reactivity/foo.md` are encouraged when they reflect the structure)  
   - Documentation support: `ai/documentation/...`  
   - Packages/workflows: follow existing directory structure or add a sensible subfolder when introducing new families (`ai/workflows/<domain>/`).
2. **Structure for LLM consumption**
   - Use heading hierarchy (H1 title, H2 sections).
   - Favor bullet sequences, command snippets, and decision trees.
   - Avoid narrative/marketing prose; focus on actionable instructions.
   - Provide cross references to canonical docs using `/ai/...` paths; whenever material overlaps with an existing guide, link to that location instead of restating it.
   - **IMPORTANT**: Include a **Last Updated** field at the top of the file (e.g., `> Last Updated: 2025-10-30`). Always update this field when modifying file contents.
3. **Embed canonical references** where relevant (examples, source directories, API docs).

## 3. Register in the Manifest

1. Open `ai/meta/context-manifest.json`.  
2. Append a document entry containing:  
   - `id`: terse unique slug (e.g., `styling/new-topic`)  
   - `path`: relative file path  
   - `category`, `tags`, `dependsOn` (array of manifest ids), `recommendedOrder` (optional), `approxTokens`.  
3. Maintain alphabetical order by `id` when practical.
4. If the new guide omits material already covered elsewhere, mark the other doc as a `dependsOn` entry to establish the prerequisite explicitly.

## 4. Update Routing Documents

1. **00-START-HERE.md**  
   - Add the new guide under the appropriate section (e.g., Styling, Packages, Workflows).  
   - Include a one-line description consistent with adjacent entries.  
   - Only update existing instructions; do not edit `AGENTS.md` unless coordinated with maintainers.
2. **Other indices**  
   - Update decision trees or quick-reference tables that surface the new guide.

## 5. Link Maintenance

- If the new guide replaces an old file, run the link update script to rewrite existing references:
  ```bash
  ./ai/tools/scripts/update-markdown-links.sh 'old/path.md' 'new/path.md' --dry-run
  ./ai/tools/scripts/update-markdown-links.sh 'old/path.md' 'new/path.md'
  ```
- Otherwise, add new references in relevant docs manually.

## 6. Validation

1. **Consistency checks**  
   - Ensure headings follow established conventions.  
   - Confirm all inline links resolve locally (`./` vs `/ai/`).  
   - Verify token counts roughly match `approxTokens` in the manifest.
2. **Dependency integrity**  
   - For each `dependsOn` entry, confirm the referenced id exists in the manifest.  
   - Adjust other manifest entries if they now depend on the new guide.
3. **Diff review**  
   - `git diff` to inspect additions across the context file, manifest, START-HERE, and AGENTS routes.

## 7. Finalize

1. Document the change in commit message / PR summary (include new doc id).  
2. Notify maintainers if the new guide introduces required reading for agents so operational lists can be updated.
