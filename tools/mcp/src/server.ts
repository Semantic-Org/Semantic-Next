import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as reactivity from '@semantic-ui/reactivity';
import { ICON_CATEGORIES, iconMappings } from '@semantic-ui/specs';
import { iconAliases } from '@semantic-ui/specs/icons/meta';
import { TemplateCompiler } from '@semantic-ui/compiler';
import * as utils from '@semantic-ui/utils';
import { z } from 'zod';
import { isContributor } from './config.js';

// LLMs sometimes stringify array parameters as JSON strings instead of passing
// actual arrays. Detect this and parse gracefully so batch calls still work.
function coerceArray(value: string | string[]): { value: string | string[]; wasCoerced: boolean; } {
  if (typeof value === 'string' && value.startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.every(v => typeof v === 'string')) {
        return { value: parsed, wasCoerced: true };
      }
    }
    catch { /* not valid JSON, use as-is */ }
  }
  return { value, wasCoerced: false };
}

import {
  ensureCache,
  extractMarkdownSection,
  fetchContent,
  fetchJson,
  findContext,
  findDoc,
  findExample,
  findRelatedForDoc,
  findRelatedForExample,
  findRelatedForSpec,
  findSkill,
  findWorkflow,
  listContext,
  listDocs,
  listExamples,
  listSkills,
  listWorkflows,
  search,
  searchApi,
} from './utils/cache.js';
import { getComponentWithChildren, listComponents } from './utils/specs.js';

// Run log-type examples and capture console output
function runLogExample(code: string): { logs: string[]; error?: string; } {
  const logs: string[] = [];

  // Mock console that captures output
  const mockConsole = {
    log: (...args: unknown[]) =>
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
    warn: (...args: unknown[]) => logs.push(`[warn] ${args.join(' ')}`),
    error: (...args: unknown[]) => logs.push(`[error] ${args.join(' ')}`),
  };

  // Strip import statements
  const codeWithoutImports = code.replace(/^import\s+.*from\s+['"].*['"];?\s*$/gm, '');

  // Build context with utils exports + mock console
  const context: Record<string, unknown> = {
    ...utils,
    ...reactivity,
    console: mockConsole,
  };

  // Filter to valid JS variable names
  const filteredContext = utils.filterObject(
    context,
    (_value: unknown, name: string) => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name),
  );

  try {
    const fn = new Function(
      'ctx',
      `
      with (ctx) {
        ${codeWithoutImports}
      }
    `,
    );

    fn(filteredContext);
    return { logs };
  }
  catch (e) {
    return {
      logs,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'semantic-ui',
    version: '0.1.0',
  });

  // ============================================================================
  // Orientation / Help
  // ============================================================================

  const HELP_TEXT = `# Semantic UI MCP Server

## Quick Start

**Already know Tailwind?** Just use it. Tailwind works inside Shadow DOM with \`TailwindPlugin\`:
\`\`\`js
defineComponent({ tagName: 'my-component', plugins: [TailwindPlugin] })
\`\`\`
Write classes you know. The sophisticated theming system is there when needed, not required.

## Tools Overview

### Discovery
- \`search\` - Find anything: components, examples, docs. Start here when unsure.
- \`list_components\` - See all UI components (button, card, modal, etc.)
- \`list_examples\` - Browse working code examples by category
- \`list_skills\` - See available deep-dive guides${
    isContributor() ? '' : ' (pass audience: "contributing" or "docs" to see more)'
  }
- \`list_workflows\` - See step-by-step procedures${
    isContributor() ? '' : ' (pass audience: "contributing" or "docs" to see more)'
  }
- \`list_user_docs\` - Browse user documentation (guides, API reference)

### Get Content
- \`get_component\` - Full spec for a component (attributes, variations, states)
- \`get_icon\` - Look up icons by canonical name, alias, or library-native name (e.g., Lucide's "house" → "home")
- \`get_example\` - Working code to reference or adapt
- \`get_api\` - Look up a specific method by name (e.g., "weightedObjectSearch")
- \`get_user_doc\` - User documentation by path:
  - \`api/*\` - Function signatures, parameters, return types (reference format)
  - \`guides/*\` - Tutorials explaining concepts and usage patterns

### Learn (AI-Optimized Docs)
- \`use_skill\` - Comprehensive guide for a topic (utils, reactivity, templating, etc.)
- \`get_context\` - AI context docs by path (internal patterns, architecture details)
- \`get_workflow\` - Step-by-step procedure by path

### Utilities
- \`validate_template\` - Check template syntax before running

## Common Patterns

**Building a UI component:**
1. \`get_component\` → see what attributes/slots are available
2. \`get_example\` → find working code to adapt
3. Write your component using specs as reference

**Learning a package:**
1. \`use_skill\` → load the comprehensive guide (e.g., "utils", "reactivity")
2. \`get_api\` → look up specific methods as needed
3. \`get_example\` → see working demonstrations

**Finding something:**
1. \`search\` → find it by keyword
2. Results include \`related\` field pointing to connected content

## Response Format

**List tools** return compact markdown by default (\`id — description\`, one per line). Examples are grouped by category.
Optional params:
- \`json: true\` — return JSON array instead of markdown

**Get tools** return a \`related\` field with connected content:
\`\`\`json
{
  "content": "...",
  "related": {
    "examples": ["utils-weightedobjectsearch"],
    "skills": ["utils"],
    "docs": ["api/utils/arrays"]
  }
}
\`\`\`
`;

  server.tool(
    'help',
    'Get orientation for using this MCP server. Start here to understand available tools and workflows.',
    {},
    async () => {
      return {
        content: [{ type: 'text', text: HELP_TEXT }],
      };
    },
  );

  // ============================================================================
  // Component Tools
  // ============================================================================

  server.tool(
    'list_components',
    'List all available Semantic UI components with their tag names and descriptions',
    {
      json: z.boolean().optional().describe('Return JSON instead of markdown'),
    },
    async ({ json }) => {
      await ensureCache();
      const components = listComponents();

      if (components.length === 0) {
        return {
          content: [{ type: 'text', text: 'No components available. The specs manifest may not have loaded.' }],
        };
      }

      if (json) {
        const slim = components.map(c => ({ id: c.id, name: c.name }));
        return {
          content: [{ type: 'text', text: JSON.stringify(slim) }],
        };
      }

      const lines = components.map(c => `* ${c.id} - ${c.name}`);
      return {
        content: [{ type: 'text', text: lines.join('\n') }],
      };
    },
  );

  server.tool(
    'get_component',
    'Get the full spec for a Semantic UI component. Supports batch fetching with array of queries.',
    {
      query: z.union([z.string(), z.array(z.string())])
        .describe('Component name/tag or array of names (e.g., "button" or ["button", "card"])'),
    },
    async ({ query: rawQuery }) => {
      await ensureCache();
      const { value: query, wasCoerced } = coerceArray(rawQuery);
      const isBatch = Array.isArray(query);
      const queries = isBatch ? query : [query];

      if (wasCoerced) {
        console.error(
          `[semantic-ui-mcp] Note: get_component received a stringified array — pass a native array instead of JSON-encoding it.`,
        );
      }

      const results = await Promise.all(queries.map(async (q) => {
        const result = await getComponentWithChildren(q);

        if (!result.success) {
          return { query: q, error: `Failed: ${result.error}` };
        }

        const { resolved, spec, children } = result.data!;
        const componentId = spec.tagName.replace('ui-', '');
        const related = findRelatedForSpec(componentId);

        return {
          query: q,
          data: {
            resolved,
            spec,
            ...(children.length > 0 && { children }),
            ...(Object.keys(related).length > 0 && { related }),
          },
        };
      }));

      // Single request: return data directly or error
      if (!isBatch) {
        const result = results[0];
        if (result.error) {
          return {
            content: [{ type: 'text', text: result.error }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(result.data, null, 2) }],
        };
      }

      // Batch request: return array of results
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    },
  );

  // ============================================================================
  // Icon Tools
  // ============================================================================

  // Build reverse lookup: library-native name → canonical name
  const ICON_LIBRARIES = ['lucide', 'phosphor', 'tabler', 'materialSymbols', 'heroicons'] as const;
  const LIB_DISPLAY: Record<string, string> = {
    lucide: 'lucide',
    phosphor: 'phosphor',
    tabler: 'tabler',
    materialSymbols: 'material-symbols',
    heroicons: 'heroicons',
  };

  // Reverse index: native name → { canonical, library }
  type NativeEntry = { canonical: string; library: string; };
  const nativeIndex = new Map<string, NativeEntry[]>();
  for (const [canonical, entry] of Object.entries(iconMappings)) {
    for (const lib of ICON_LIBRARIES) {
      const native = (entry as Record<string, unknown>)[lib] as string | null;
      if (native && native !== canonical) {
        const existing = nativeIndex.get(native) || [];
        existing.push({ canonical, library: lib });
        nativeIndex.set(native, existing);
      }
    }
  }

  function searchIcons(query: string, set?: string): object[] {
    const q = query.toLowerCase().replace(/\s+/g, '-');
    const results: object[] = [];
    const seen = new Set<string>();

    function addResult(canonical: string, match: string, via?: string) {
      if (seen.has(canonical)) { return; }
      seen.add(canonical);
      const entry = (iconMappings as Record<string, object>)[canonical];
      if (!entry) { return; }
      results.push({ name: canonical, match, ...(via && { via }), ...entry });
    }

    // If set is specified, do a targeted library-native lookup
    if (set) {
      const libKey = Object.entries(LIB_DISPLAY).find(([k, v]) => v === set || k === set)?.[0];
      if (libKey) {
        for (const [canonical, entry] of Object.entries(iconMappings)) {
          const native = (entry as Record<string, unknown>)[libKey] as string | null;
          if (native === q) {
            addResult(canonical, 'native', `${LIB_DISPLAY[libKey]}:${native}`);
          }
        }
      }
      if (results.length > 0) { return results; }
    }

    // Exact canonical match
    if ((iconMappings as Record<string, object>)[q]) {
      addResult(q, 'canonical');
    }

    // Exact alias match
    const aliasTarget = (iconAliases as Record<string, string>)[q];
    if (aliasTarget) {
      addResult(aliasTarget, 'alias', q);
    }

    // Exact native name match (any library)
    const nativeMatches = nativeIndex.get(q);
    if (nativeMatches) {
      for (const { canonical, library } of nativeMatches) {
        addResult(canonical, 'native', `${LIB_DISPLAY[library]}:${q}`);
      }
    }

    // If we got exact matches, return them
    if (results.length > 0) { return results; }

    // Fuzzy: substring match — collect by match type, then concat for natural tiering
    const nameMatches: [string, string, string?][] = [];
    const aliasMatches: [string, string, string?][] = [];
    const nativeFuzzy: [string, string, string?][] = [];
    const descMatches: [string, string, string?][] = [];

    for (const [canonical, entry] of Object.entries(iconMappings)) {
      const e = entry as Record<string, unknown>;
      if (canonical.includes(q)) {
        nameMatches.push([canonical, 'canonical']);
      }
      const aliases = e.aliases as string[] | undefined;
      if (aliases?.some(a => a.includes(q))) {
        aliasMatches.push([canonical, 'alias']);
      }
      for (const lib of ICON_LIBRARIES) {
        const native = e[lib] as string | null;
        if (native?.includes(q)) {
          nativeFuzzy.push([canonical, 'native', `${LIB_DISPLAY[lib]}:${native}`]);
          break;
        }
      }
      if ((e.description as string)?.toLowerCase().includes(q)) {
        descMatches.push([canonical, 'description']);
      }
    }

    for (const args of [...nameMatches, ...aliasMatches, ...nativeFuzzy, ...descMatches]) {
      addResult(args[0], args[1], args[2]);
    }

    return results;
  }

  server.tool(
    'get_icon',
    'Look up Semantic UI icon names. Search by canonical name, alias, or library-native name (e.g., Lucide\'s "house" → SUI\'s "home"). Pass a category to browse, or no args to list categories.',
    {
      query: z.string().optional().describe(
        'Icon name to search — canonical, alias, or library-native (e.g., "house", "trash-2", "arrow_downward")',
      ),
      set: z.string().optional().describe(
        'Icon library for native name lookup (lucide, phosphor, tabler, material-symbols, heroicons)',
      ),
      category: z.string().optional().describe(
        'Browse all icons in a category (e.g., "navigation", "action", "status")',
      ),
      verbose: z.boolean().optional().describe(
        'Include full library mappings in category results (default: false, returns names + descriptions only)',
      ),
    },
    async ({ query, set, category, verbose }) => {
      // Browse by category
      if (category) {
        const entries = Object.entries(iconMappings)
          .filter(([, e]) => (e as Record<string, unknown>).category === category);

        if (entries.length === 0) {
          return {
            content: [{
              type: 'text',
              text: `No icons in category: ${category}\n\nCategories: ${ICON_CATEGORIES.join(', ')}`,
            }],
            isError: true,
          };
        }

        if (verbose) {
          const icons = entries.map(([name, e]) => ({ name, ...e as object }));
          return {
            content: [{ type: 'text', text: JSON.stringify({ category, count: icons.length, icons }, null, 2) }],
          };
        }

        // Compact: names + descriptions only
        const icons = entries.map(([name, e]) => {
          const { description, aliases } = e as Record<string, unknown>;
          return { name, description, aliases };
        });
        return {
          content: [{ type: 'text', text: JSON.stringify({ category, count: icons.length, icons }, null, 2) }],
        };
      }

      // Search by query
      if (query) {
        const results = searchIcons(query, set);
        if (results.length === 0) {
          return {
            content: [{ type: 'text', text: `No icons found for: ${query}${set ? ` (in ${set})` : ''}` }],
          };
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
        };
      }

      // No args: compact category overview
      const lines = [
        `${Object.keys(iconMappings).length} canonical icons across ${ICON_CATEGORIES.length} categories:\n`,
      ];
      for (const cat of ICON_CATEGORIES) {
        const count = Object.values(iconMappings)
          .filter(e => (e as Record<string, unknown>).category === cat).length;
        if (count > 0) {
          lines.push(`  ${cat} (${count})`);
        }
      }
      lines.push('\nUse get_icon(category: "...") to browse a category, or get_icon(query: "...") to search.');
      return {
        content: [{ type: 'text', text: lines.join('\n') }],
      };
    },
  );

  // ============================================================================
  // Examples Tools
  // ============================================================================

  // Helper to fetch a single example
  async function fetchSingleExample(id: string): Promise<{ id: string; data?: unknown; error?: string; }> {
    const example = findExample(id);

    if (!example) {
      return { id, error: `Example not found: ${id}` };
    }

    const result = await fetchJson<{
      exampleType?: string;
      files: Record<string, string>;
    }>(example.path);

    if (!result.success) {
      return { id, error: `Failed to fetch: ${result.error}` };
    }

    const data = result.data!;
    const related = findRelatedForExample(example);

    // Run log-type examples and capture output
    if (data.exampleType === 'log' && data.files['index.js']) {
      const { logs, error } = runLogExample(data.files['index.js']);
      return {
        id,
        data: {
          ...data,
          output: { logs, error },
          ...(Object.keys(related).length > 0 && { related }),
        },
      };
    }

    return {
      id,
      data: {
        ...data,
        ...(Object.keys(related).length > 0 && { related }),
      },
    };
  }

  server.tool(
    'list_examples',
    'List available code examples. Optionally filter by category.',
    {
      category: z.string().optional().describe(
        'Filter by category (e.g., "framework", "query", "reactivity", "templates", "ui components", "utils")',
      ),
      json: z.boolean().optional().describe('Return JSON instead of markdown'),
    },
    async ({ category, json }) => {
      await ensureCache();
      const examples = listExamples(category);

      if (examples.length === 0) {
        return {
          content: [{
            type: 'text',
            text: category ? `No examples found in category: ${category}` : 'No examples available.',
          }],
        };
      }

      if (json) {
        const slim = examples.map(e =>
          category
            ? { id: e.id, title: e.title }
            : { id: e.id, title: e.title, category: e.category }
        );
        return {
          content: [{ type: 'text', text: JSON.stringify(slim) }],
        };
      }

      if (category) {
        // Filtered: simple list, category already known
        const lines = examples.map(e => `* ${e.id} - ${e.title}`);
        return {
          content: [{ type: 'text', text: lines.join('\n') }],
        };
      }

      // Unfiltered: group by category
      const groups: Record<string, typeof examples> = {};
      for (const e of examples) {
        const cat = e.category || 'Other';
        if (!groups[cat]) { groups[cat] = []; }
        groups[cat].push(e);
      }
      const sections: string[] = [];
      for (const [cat, items] of Object.entries(groups)) {
        sections.push(`## ${cat}\n${items.map(e => `* ${e.id} - ${e.title}`).join('\n')}`);
      }
      return {
        content: [{ type: 'text', text: sections.join('\n\n') }],
      };
    },
  );

  server.tool(
    'get_example',
    'Get the source files for a specific example by ID. Supports batch fetching with array of IDs.',
    {
      id: z.union([z.string(), z.array(z.string())])
        .describe('Example ID or array of IDs (e.g., "counter" or ["counter", "dropdown"])'),
    },
    async ({ id: rawId }) => {
      await ensureCache();
      const { value: id, wasCoerced } = coerceArray(rawId);
      const isBatch = Array.isArray(id);
      const ids = isBatch ? id : [id];

      if (wasCoerced) {
        console.error(
          `[semantic-ui-mcp] Note: get_example received a stringified array — pass a native array instead of JSON-encoding it.`,
        );
      }

      const results = await Promise.all(ids.map(fetchSingleExample));

      // Single request: return data directly or error
      if (!isBatch) {
        const result = results[0];
        if (result.error) {
          return {
            content: [{ type: 'text', text: result.error }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(result.data, null, 2) }],
        };
      }

      // Batch request: return array of results
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    },
  );

  // ============================================================================
  // Skills Tools
  // ============================================================================

  server.tool(
    'list_skills',
    isContributor()
      ? 'List available skills that can be loaded with use_skill. Skills are comprehensive guides organized by audience: usage, authoring, essentials, contributing, docs, and research. Pass audience to filter.'
      : 'List available skills that can be loaded with use_skill. Skills are comprehensive guides for specific topics like components, templating, and reactivity.',
    {
      audience: z.enum(['all', 'usage', 'authoring', 'essentials', 'contributing', 'docs', 'research']).optional()
        .describe('Filter by audience'),
      json: z.boolean().optional().describe('Return JSON instead of markdown'),
    },
    async ({ audience, json }) => {
      await ensureCache();
      const skills = listSkills(audience);

      if (skills.length === 0) {
        return {
          content: [{
            type: 'text',
            text: 'No skills available. Skills are defined by adding `skill: name` to context doc frontmatter.',
          }],
        };
      }

      if (json) {
        const slim = skills.map(s => ({
          skill: s.skill,
          title: s.title,
          ...(s.description && { description: s.description }),
        }));
        return {
          content: [{ type: 'text', text: JSON.stringify(slim) }],
        };
      }

      // Group by audience
      const groups: Record<string, typeof skills> = {};
      for (const s of skills) {
        const key = s.audience || 'other';
        if (!groups[key]) { groups[key] = []; }
        groups[key].push(s);
      }

      const AUDIENCE_LABELS: Record<string, string> = {
        usage: 'Using Components',
        authoring: 'Authoring Components',
        essentials: 'Essentials',
      };

      const sections: string[] = [];
      for (const [key, items] of Object.entries(groups)) {
        const heading = AUDIENCE_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
        const lines = items.map(s => {
          if (s.description) {
            return `* **${s.skill}** — ${s.description}`;
          }
          return `* **${s.skill}** — ${s.title}`;
        });
        sections.push(`## ${heading}\n${lines.join('\n')}`);
      }
      return {
        content: [{ type: 'text', text: sections.join('\n\n') }],
      };
    },
  );

  server.tool(
    'use_skill',
    'Load a skill to gain comprehensive knowledge about a topic. Use list_skills to see available skills.',
    {
      skill: z.string().describe('Skill name (e.g., "utils", "creating-components", "reactivity")'),
    },
    async ({ skill: skillName }) => {
      await ensureCache();
      const skillDoc = findSkill(skillName);

      if (!skillDoc) {
        const available = listSkills().map(s => s.skill).join(', ');
        return {
          content: [{
            type: 'text',
            text: `Unknown skill: "${skillName}"\n\nAvailable skills: ${available || 'none'}`,
          }],
          isError: true,
        };
      }

      const result = await fetchContent(skillDoc.path);

      if (!result.success) {
        return {
          content: [{
            type: 'text',
            text: `Failed to load skill "${skillName}"\nURL: ${result.url}\nError: ${result.error}`,
          }],
          isError: true,
        };
      }

      return {
        content: [{ type: 'text', text: result.data! }],
      };
    },
  );

  // ============================================================================
  // Workflow Tools
  // ============================================================================

  server.tool(
    'list_workflows',
    isContributor()
      ? 'List available step-by-step workflows organized by audience: usage, authoring, essentials, contributing, docs, and research. Pass audience to filter.'
      : 'List available step-by-step workflows for common tasks like adding components, writing templates, and configuring themes.',
    {
      audience: z.enum(['all', 'usage', 'authoring', 'essentials', 'contributing', 'docs', 'research']).optional()
        .describe('Filter by audience'),
      json: z.boolean().optional().describe('Return JSON instead of markdown'),
    },
    async ({ audience, json }) => {
      await ensureCache();
      const workflows = listWorkflows(audience);

      if (workflows.length === 0) {
        return {
          content: [{
            type: 'text',
            text: audience ? `No workflows for audience: ${audience}` : 'No workflows available.',
          }],
        };
      }

      if (json) {
        const slim = workflows.map(w => {
          const id = w.workflow || w.path.replace('/content/ai/', '').replace('.md', '');
          return {
            id,
            title: w.title,
            ...(w.description && { description: w.description }),
            ...(!audience && { audience: w.audience }),
          };
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(slim) }],
        };
      }

      const lines = workflows.map(w => {
        const id = w.workflow || w.path.replace('/content/ai/', '').replace('.md', '');
        if (w.description) {
          return `* **${id}** — ${w.description}`;
        }
        return `* **${id}** — ${w.title}`;
      });
      return {
        content: [{ type: 'text', text: lines.join('\n') }],
      };
    },
  );

  server.tool(
    'get_workflow',
    'Get a step-by-step workflow by ID or path. Supports batch fetching with array of IDs.',
    {
      id: z.union([z.string(), z.array(z.string())])
        .describe(
          'Workflow ID or array of IDs (e.g., "add-util-function" or "workflows/framework/add-util-function")',
        ),
    },
    async ({ id: rawId }) => {
      await ensureCache();
      const { value: id, wasCoerced } = coerceArray(rawId);
      const isBatch = Array.isArray(id);
      const ids = isBatch ? id : [id];

      if (wasCoerced) {
        console.error(
          `[semantic-ui-mcp] Note: get_workflow received a stringified array — pass a native array instead of JSON-encoding it.`,
        );
      }

      const results = await Promise.all(ids.map(async (docId) => {
        const workflow = findWorkflow(docId);

        if (!workflow) {
          return { id: docId, error: `Workflow not found: ${docId}` };
        }

        const result = await fetchContent(workflow.path);

        if (!result.success) {
          return { id: docId, error: `Failed to fetch: ${result.error}` };
        }

        return { id: docId, content: result.data! };
      }));

      if (!isBatch) {
        const result = results[0];
        if (result.error) {
          return {
            content: [{ type: 'text', text: result.error }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: result.content! }],
        };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    },
  );

  // ============================================================================
  // AI Context Tools
  // ============================================================================

  server.tool(
    'list_context',
    isContributor()
      ? 'List available AI context documents organized by audience: usage, authoring, essentials, contributing, docs, and research. Pass audience to filter.'
      : 'List available AI context documents covering component APIs, framework internals, and usage patterns.',
    {
      audience: z.enum(['all', 'usage', 'authoring', 'essentials', 'contributing', 'docs', 'research']).optional()
        .describe('Filter by audience'),
      json: z.boolean().optional().describe('Return JSON instead of markdown'),
    },
    async ({ audience, json }) => {
      await ensureCache();
      const docs = listContext(audience);

      if (docs.length === 0) {
        return {
          content: [{
            type: 'text',
            text: audience ? `No context docs for audience: ${audience}` : 'No context docs available.',
          }],
        };
      }

      if (json) {
        const slim = docs.map(d => {
          const shortPath = d.path.replace('/content/ai/', '').replace('.md', '');
          return {
            path: shortPath,
            title: d.title,
            ...(d.description && { description: d.description }),
            ...(!audience && { audience: d.audience }),
          };
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(slim) }],
        };
      }

      const lines = docs.map(d => {
        const shortPath = d.path.replace('/content/ai/', '').replace('.md', '');
        if (d.description) {
          return `* **${shortPath}** — ${d.description}`;
        }
        return `* **${shortPath}** — ${d.title}`;
      });
      return {
        content: [{ type: 'text', text: lines.join('\n') }],
      };
    },
  );

  server.tool(
    'get_context',
    'Get the full content of an AI context document by path. Supports batch fetching with array of paths.',
    {
      id: z.union([z.string(), z.array(z.string())])
        .describe(
          'Document path or array of paths (e.g., "framework/reactivity" or ["framework/reactivity", "ui/markup"])',
        ),
    },
    async ({ id: rawId }) => {
      await ensureCache();
      const { value: id, wasCoerced } = coerceArray(rawId);
      const isBatch = Array.isArray(id);
      const ids = isBatch ? id : [id];

      if (wasCoerced) {
        console.error(
          `[semantic-ui-mcp] Note: get_context received a stringified array — pass a native array instead of JSON-encoding it.`,
        );
      }

      const results = await Promise.all(ids.map(async (docId) => {
        const doc = findContext(docId);

        if (!doc) {
          return { id: docId, error: `Context document not found: ${docId}` };
        }

        const result = await fetchContent(doc.path);

        if (!result.success) {
          return { id: docId, error: `Failed to fetch: ${result.error}` };
        }

        return { id: docId, content: result.data! };
      }));

      // Single request: return content directly or error
      if (!isBatch) {
        const result = results[0];
        if (result.error) {
          return {
            content: [{ type: 'text', text: result.error }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: result.content! }],
        };
      }

      // Batch request: return array of results
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    },
  );

  // ============================================================================
  // User Documentation Tools
  // ============================================================================

  server.tool(
    'list_user_docs',
    'List user documentation pages (guides, API reference). Markdown files written for developers learning the framework.',
    {
      json: z.boolean().optional().describe('Return JSON instead of markdown'),
    },
    async ({ json }) => {
      await ensureCache();
      const docs = listDocs();

      if (docs.length === 0) {
        return {
          content: [{ type: 'text', text: 'No documentation available.' }],
        };
      }

      if (json) {
        const slim = docs.map(d => {
          const shortPath = d.path.replace('/content/docs/', '').replace('.md', '');
          return {
            path: shortPath,
            title: d.title,
            ...(d.section && { section: d.section }),
            ...(d.category && { category: d.category }),
          };
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(slim) }],
        };
      }

      // Group by section + category, preserving menu order
      const grouped: Record<string, typeof docs> = {};
      const ungrouped: typeof docs = [];
      for (const d of docs) {
        if (d.section && d.category) {
          const key = `${d.section} - ${d.category}`;
          if (!grouped[key]) { grouped[key] = []; }
          grouped[key].push(d);
        }
        else {
          ungrouped.push(d);
        }
      }

      const sections: string[] = [];
      for (const [heading, items] of Object.entries(grouped)) {
        sections.push(`## ${heading}\n${
          items.map(d => {
            const shortPath = d.path.replace('/content/docs/', '').replace('.md', '');
            return `* ${shortPath} - ${d.title}`;
          }).join('\n')
        }`);
      }
      if (ungrouped.length > 0) {
        sections.push(`## Other\n${
          ungrouped.map(d => {
            const shortPath = d.path.replace('/content/docs/', '').replace('.md', '');
            return `* ${shortPath} - ${d.title}`;
          }).join('\n')
        }`);
      }
      return {
        content: [{ type: 'text', text: sections.join('\n\n') }],
      };
    },
  );

  server.tool(
    'get_user_doc',
    'Get user documentation page by path. Supports batch fetching with array of paths.',
    {
      path: z.union([z.string(), z.array(z.string())])
        .describe(
          'Document path or array of paths (e.g., "guides/reactivity/signals" or ["api/utils/arrays", "api/utils/objects"])',
        ),
    },
    async ({ path: rawPath }) => {
      await ensureCache();
      const { value: path, wasCoerced } = coerceArray(rawPath);
      const isBatch = Array.isArray(path);
      const paths = isBatch ? path : [path];

      if (wasCoerced) {
        console.error(
          `[semantic-ui-mcp] Note: get_user_doc received a stringified array — pass a native array instead of JSON-encoding it.`,
        );
      }

      const results = await Promise.all(paths.map(async (docPath) => {
        const doc = findDoc(docPath);

        if (!doc) {
          return { path: docPath, error: `Document not found: ${docPath}` };
        }

        const result = await fetchContent(doc.path);

        if (!result.success) {
          return { path: docPath, error: `Failed to fetch: ${result.error}` };
        }

        const related = findRelatedForDoc(doc);

        // Replace interactive example URL references with tool-use hints
        const content = result.data!.replace(
          />\s*\*\*\[Interactive Example:\s*([^\]]+)\]\(\/examples\/([^)]+)\)\*\*\s*\|\s*\[source\]\([^)]+\)/g,
          '> **Interactive Example:** Use `get_example("$2")` to view the full source code.',
        );

        return {
          path: docPath,
          data: {
            path: docPath,
            title: doc.title,
            content,
            ...(Object.keys(related).length > 0 && { related }),
          },
        };
      }));

      // Single request: return data directly or error
      if (!isBatch) {
        const result = results[0];
        if (result.error) {
          return {
            content: [{ type: 'text', text: result.error }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(result.data, null, 2) }],
        };
      }

      // Batch request: return array of results
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    },
  );

  // ============================================================================
  // API Lookup
  // ============================================================================

  server.tool(
    'get_api',
    'Look up API documentation by method or function name. Returns the most relevant API doc page.',
    {
      method: z.string().describe('Method or function name (e.g., "weightedObjectSearch", "defineComponent", "each")'),
      package: z.string().optional().describe(
        'Package name to filter (e.g., "@semantic-ui/utils", "@semantic-ui/component")',
      ),
    },
    async ({ method, package: pkg }) => {
      await ensureCache();
      const doc = searchApi(method, pkg);

      if (!doc) {
        return {
          content: [{ type: 'text', text: `No API documentation found for: ${method}` }],
          isError: true,
        };
      }

      const result = await fetchContent(doc.path);

      if (!result.success) {
        return {
          content: [{
            type: 'text',
            text: `Found API doc for "${method}" but failed to fetch\nURL: ${result.url}\nError: ${result.error}`,
          }],
          isError: true,
        };
      }

      // Extract just the section for the requested method
      const section = extractMarkdownSection(result.data!, method);
      const apiContent = section || result.data!;

      // Find related examples and skills scoped to the specific method
      const related = findRelatedForDoc(doc, method);

      // Return structured response with content and related
      const response = {
        method,
        package: doc.package,
        content: apiContent,
        ...(Object.keys(related).length > 0 && { related }),
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
      };
    },
  );

  // ============================================================================
  // Unified Search
  // ============================================================================

  server.tool(
    'search',
    'Search across all content: components, examples, AI context, workflows, and user docs. Returns results ranked by relevance.',
    {
      query: z.string().describe('Search query'),
      type: z.enum(['spec', 'example', 'context', 'workflow', 'doc']).optional()
        .describe('Limit search to specific content type'),
      audience: z.enum(['all', 'usage', 'authoring', 'essentials', 'contributing', 'docs', 'research']).optional()
        .describe('Filter context docs by audience'),
      limit: z.number().optional().describe('Max results (default: 20)'),
    },
    async ({ query, type, audience, limit }) => {
      await ensureCache();
      const results = search(query, { type, audience, limit });

      if (results.length === 0) {
        return {
          content: [{ type: 'text', text: `No results found for: ${query}` }],
        };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    },
  );

  // ============================================================================
  // Template Validation
  // ============================================================================

  server.tool(
    'validate_template',
    'Validate template syntax and return any compile errors. Use this to check templates before running them.',
    {
      template: z.string().describe('Template string to validate'),
      includeAST: z.boolean().optional().describe('Include the compiled AST in the response for debugging'),
    },
    async ({ template, includeAST }) => {
      try {
        const compiler = new TemplateCompiler(template);
        const ast = compiler.compile();
        const result: { valid: boolean; nodeCount: number; ast?: unknown; } = {
          valid: true,
          nodeCount: ast.length,
        };
        if (includeAST) {
          result.ast = ast;
        }
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2),
          }],
        };
      }
      catch (e) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(
              {
                valid: false,
                error: e instanceof Error ? e.message : String(e),
              },
              null,
              2,
            ),
          }],
        };
      }
    },
  );

  return server;
}
