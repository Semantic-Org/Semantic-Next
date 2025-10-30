# AI Tools Directory

This directory contains development tools and utilities for working with the Semantic UI AI documentation system.

---

## Directory Structure

```
tools/
├── README.md              ← You are here
├── scripts/               ← Automation scripts for AI agents and developers
│   └── update-markdown-links.sh
├── subagents/             ← Agent coordination system
│   ├── orchestrator.md        ← Orchestrator agent instructions
│   ├── agent-list.md          ← Registry of all available agents
│   ├── input-spec.md          ← Agent input format specification
│   ├── output-spec.md         ← Agent output format specification
│   ├── shared-context.md      ← Shared agent context and principles
│   ├── domain/                ← Domain-specific agent configurations
│   └── process/               ← Process-specific agent configurations
└── mcp/                   ← Model Context Protocol integrations
```

---

## Scripts

### `update-markdown-links.sh`

**Purpose:** Automatically update markdown link paths when files are moved or reorganized in the `ai/` directory.

**Use Cases:**
- Files have been moved to new locations
- Directory structure has been reorganized
- Need to update cross-references after a refactoring

**Usage:**

```bash
# Preview changes (dry run - recommended first step)
./ai/tools/scripts/update-markdown-links.sh <old-path> <new-path> --dry-run

# Apply changes
./ai/tools/scripts/update-markdown-links.sh <old-path> <new-path>
```

**Arguments:**
- `<old-path>` - The old path to replace (e.g., `ai/agents/orchestrator.md`)
- `<new-path>` - The new path to use (e.g., `ai/tools/sub-agents/orchestrator.md`)
- `--dry-run` - Optional flag to preview changes without modifying files

**What It Does:**
- Searches all `.md` files in the `ai/` directory
- Updates inline markdown links: `[text](path)`
- Updates reference-style links: `[text]: path`
- Updates backtick-quoted paths: `` `path` ``
- Updates plain text paths in list items
- Handles both relative and absolute paths (with or without leading `/`)
- Shows which files and lines will be changed

**Examples:**

```bash
# Example 1: Moving a single file
# Preview changes when moving orchestrator.md
./ai/tools/scripts/update-markdown-links.sh \
  'ai/agents/orchestrator.md' \
  'ai/tools/subagents/orchestrator.md' \
  --dry-run

# Apply the changes
./ai/tools/scripts/update-markdown-links.sh \
  'ai/agents/orchestrator.md' \
  'ai/tools/subagents/orchestrator.md'

# Example 2: Moving a directory
# Update all references from old directory structure
./ai/tools/scripts/update-markdown-links.sh \
  'ai/guides/component-generation-instructions.md' \
  'ai/guides/components/generation.md' \
  --dry-run

# Example 3: Fixing broken links
# Update references that point to old location
./ai/tools/scripts/update-markdown-links.sh \
  'ai/specialized/reactivity-system-guide.md' \
  'ai/packages/reactivity.md'
```

**Output:**

The script provides colored output showing:
- 📄 Files that will be updated
- Line numbers and content of matching lines
- ✓ Confirmation of updates (or ⚠ in dry-run mode)
- Summary of total files affected

**Tips:**

1. **Always run with `--dry-run` first** to preview changes
2. **Review the output** carefully to ensure correct matches
3. **Use git** to review changes after applying: `git diff ai/`
4. **Run tests** if available to verify no links are broken
5. **Update multiple paths** by running the script multiple times

**When Files Are Moved:**

If you're reorganizing the `ai/` directory structure:

1. Move the files first: `git mv old/path.md new/path.md`
2. Run this script with `--dry-run` for each moved file
3. Review the proposed changes
4. Apply changes by running without `--dry-run`
5. Use `git diff` to verify all updates
6. Commit the link updates separately from the file moves

**Limitations:**

- Only updates markdown files (`.md` extension)
- Only searches within the `ai/` directory
- Requires exact path match (case-sensitive)
- Does not update links in code comments or other file types

---

## Subagents System

The `subagents/` directory contains the orchestration system for specialized AI agents working on the Semantic UI codebase.

**Key Files:**
- `orchestrator.md` - Instructions for the orchestrator agent that coordinates work
- `agent-list.md` - Registry of all domain and process agents
- `input-spec.md` - Standard format for agent task inputs
- `output-spec.md` - Standard format for agent outputs

**Agent Types:**
- **Domain Agents** - Specialize in specific framework areas (components, reactivity, query, etc.)
- **Process Agents** - Specialize in cross-cutting concerns (testing, types, documentation, etc.)

See the individual agent documentation files for detailed usage instructions.

---

## MCP Integrations

The `mcp/` directory contains Model Context Protocol integrations for extending AI agent capabilities with external tools and data sources.

---

## Contributing

When adding new tools or scripts to this directory:

1. **Document thoroughly** - Update this README with usage instructions
2. **Add examples** - Include practical examples of tool usage
3. **Follow conventions** - Use similar patterns to existing tools
4. **Test before committing** - Verify tools work as expected
5. **Use clear output** - Provide helpful messages and colored output

---

## For AI Agents

If you're an AI agent working on the Semantic UI codebase:

- **Use `update-markdown-links.sh`** whenever you move or reorganize documentation files
- **Always run with `--dry-run` first** to verify changes are correct
- **Check your changes** with git diff before completing your task
- **Update this README** if you add new tools or scripts

---

**Last Updated:** Tools directory structure documented
**Maintenance:** Update this file when adding new tools or scripts
