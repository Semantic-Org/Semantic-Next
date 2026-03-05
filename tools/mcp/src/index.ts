#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as reactivity from '@semantic-ui/reactivity';
import { TemplateCompiler } from '@semantic-ui/templating';
import * as utils from '@semantic-ui/utils';
import { z } from 'zod';

import {
  extractMarkdownSection,
  fetchContent,
  fetchJson,
  type FetchResult,
  findContext,
  findDoc,
  findExample,
  findRelatedForDoc,
  findRelatedForExample,
  findRelatedForSpec,
  findSkill,
  initCache,
  listContext,
  listDocs,
  listExamples,
  listSkills,
  listSpecs,
  search,
  searchApi,
} from './utils/cache.js';
import { type ComponentSpec, getComponentWithChildren, listComponents } from './utils/specs.js';

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
    // Debug: log available keys
    console.error('Available in context:', Object.keys(filteredContext).filter(k => /^[A-Z]/.test(k)));

    // Use with + proxy pattern for controlled scope
    const proxyHandler = {
      has(target: Record<string, unknown>, key: string) {
        const result = key in target;
        if (key === 'Signal') { console.error(`has('Signal') = ${result}`); }
        return result;
      },
      get(target: Record<string, unknown>, prop: string) {
        if (prop === 'Signal') { console.error(`get('Signal') =`, target[prop]); }
        return target[prop];
      },
    };

    const proxiedContext = new Proxy(filteredContext, proxyHandler);

    const fn = new Function(
      'ctx',
      `
      with (ctx) {
        ${codeWithoutImports}
      }
    `,
    );

    fn(proxiedContext);
    return { logs };
  }
  catch (e) {
    return {
      logs,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

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
- \`list_skills\` - See available deep-dive guides
- \`list_user_docs\` - Browse user documentation (guides, API reference)

### Get Content
- \`get_component\` - Full spec for a component (attributes, variations, states)
- \`get_example\` - Working code to reference or adapt
- \`get_api\` - Look up a specific method by name (e.g., "weightedObjectSearch")
- \`get_user_doc\` - User documentation by path:
  - \`api/*\` - Function signatures, parameters, return types (reference format)
  - \`guides/*\` - Tutorials explaining concepts and usage patterns

### Learn (AI-Optimized Docs)
- \`use_skill\` - Comprehensive guide for a topic (utils, reactivity, templating, etc.)
- \`get_context\` - AI context docs by path (internal patterns, architecture details)

### Utilities
- \`validate_template\` - Check template syntax before running

## Typical Workflows

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

**List tools** return compact markdown by default (\`id - title\`, one per line). Examples are grouped by category.
Optional params:
- \`json: true\` — return JSON array instead of markdown
- \`includeMetadata: true\` — include descriptions (available on \`list_skills\`, \`list_context\`)

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
  async ({ query }) => {
    const isBatch = Array.isArray(query);
    const queries = isBatch ? query : [query];

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
// Examples Tools
// ============================================================================

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
  'get_example',
  'Get the source files for a specific example by ID. Supports batch fetching with array of IDs.',
  {
    id: z.union([z.string(), z.array(z.string())])
      .describe('Example ID or array of IDs (e.g., "counter" or ["counter", "dropdown"])'),
  },
  async ({ id }) => {
    const isBatch = Array.isArray(id);
    const ids = isBatch ? id : [id];

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
  'List available skills that can be loaded with use_skill. Skills are comprehensive guides for specific topics.',
  {
    includeMetadata: z.boolean().optional().describe('Include descriptions for each skill'),
    json: z.boolean().optional().describe('Return JSON instead of markdown'),
  },
  async ({ includeMetadata, json }) => {
    const skills = listSkills();

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
      ui: 'Using Components',
      framework: 'Authoring Components',
    };

    const sections: string[] = [];
    for (const [key, items] of Object.entries(groups)) {
      const heading = AUDIENCE_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
      const lines = items.map(s => {
        let line = `* ${s.skill} - ${s.title}`;
        if (includeMetadata && s.description) {
          line += ` — ${s.description}`;
        }
        return line;
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
// AI Context Tools
// ============================================================================

server.tool(
  'list_context',
  'List available AI context documents. Defaults to ui, framework, and skills. Pass audience to filter, including "contributing" or "research" for specialized docs.',
  {
    audience: z.enum(['ui', 'framework', 'skills', 'contributing', 'research']).optional()
      .describe('Filter by audience'),
    includeMetadata: z.boolean().optional().describe('Include descriptions for each document'),
    json: z.boolean().optional().describe('Return JSON instead of markdown'),
  },
  async ({ audience, includeMetadata, json }) => {
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
      let line = `* ${shortPath} - ${d.title}`;
      if (includeMetadata && d.description) {
        line += ` — ${d.description}`;
      }
      return line;
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
  async ({ id }) => {
    const isBatch = Array.isArray(id);
    const ids = isBatch ? id : [id];

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
  async ({ path }) => {
    const isBatch = Array.isArray(path);
    const paths = isBatch ? path : [path];

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
  'Search across all content: components, examples, AI context, and user docs. Returns results ranked by relevance.',
  {
    query: z.string().describe('Search query'),
    type: z.enum(['spec', 'example', 'context', 'doc']).optional()
      .describe('Limit search to specific content type'),
    audience: z.enum(['ui', 'framework', 'contributing', 'research']).optional()
      .describe('Filter context docs by audience'),
    limit: z.number().optional().describe('Max results (default: 20)'),
  },
  async ({ query, type, audience, limit }) => {
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

// ============================================================================
// Server Startup
// ============================================================================

async function main() {
  // Initialize cache before accepting connections
  await initCache();

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
