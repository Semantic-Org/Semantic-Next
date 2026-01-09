#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
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
    console: mockConsole,
  };

  // Filter to valid JS variable names
  const filteredContext = utils.filterObject(
    context,
    (_value: unknown, name: string) => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name),
  );

  try {
    // Use with + proxy pattern for controlled scope
    const proxyHandler = {
      has(target: Record<string, unknown>, key: string) {
        return key in target;
      },
      get(target: Record<string, unknown>, prop: string) {
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
// Component Tools
// ============================================================================

server.tool(
  'list_components',
  'List all available Semantic UI components with their tag names and descriptions',
  {},
  async () => {
    const components = listComponents();

    if (components.length === 0) {
      return {
        content: [{ type: 'text', text: 'No components available. The specs manifest may not have loaded.' }],
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(components, null, 2) }],
    };
  },
);

server.tool(
  'get_component',
  'Get the full spec for a Semantic UI component. Supports tag names (ui-button), names (Button), or short forms (button).',
  {
    query: z.string().describe('Component name or tag name (e.g., "button", "ui-button", "Button")'),
  },
  async ({ query }) => {
    const result = await getComponentWithChildren(query);

    if (!result.success) {
      return {
        content: [{
          type: 'text',
          text: `Failed to get component "${query}"\nURL: ${result.url}\nError: ${result.error}`,
        }],
        isError: true,
      };
    }

    const { resolved, spec, children } = result.data!;
    const response = {
      resolved,
      spec,
      ...(children.length > 0 && { children }),
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
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
    category: z.string().optional().describe('Filter by category (e.g., "component", "template", "reactivity")'),
  },
  async ({ category }) => {
    const examples = listExamples(category);

    if (examples.length === 0) {
      return {
        content: [{
          type: 'text',
          text: category ? `No examples found in category: ${category}` : 'No examples available.',
        }],
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(examples, null, 2) }],
    };
  },
);

server.tool(
  'get_example',
  'Get the source files for a specific example by ID.',
  {
    id: z.string().describe('Example ID (e.g., "component/card-search", "template/each-loop")'),
  },
  async ({ id }) => {
    const example = findExample(id);

    if (!example) {
      return {
        content: [{ type: 'text', text: `Example not found: ${id}` }],
        isError: true,
      };
    }

    const result = await fetchJson<{
      exampleType?: string;
      files: Record<string, string>;
    }>(example.path);

    if (!result.success) {
      return {
        content: [{
          type: 'text',
          text: `Failed to fetch example "${id}"\nURL: ${result.url}\nError: ${result.error}`,
        }],
        isError: true,
      };
    }

    const data = result.data!;

    // Run log-type examples and capture output
    if (data.exampleType === 'log' && data.files['index.js']) {
      const { logs, error } = runLogExample(data.files['index.js']);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ ...data, output: { logs, error } }, null, 2),
        }],
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    };
  },
);

// ============================================================================
// Skills Tools
// ============================================================================

server.tool(
  'list_skills',
  'List available skills that can be loaded with use_skill. Skills are comprehensive guides for specific topics.',
  {},
  async () => {
    const skills = listSkills().map(s => ({
      skill: s.skill,
      title: s.title,
      description: s.description || '',
      tokens: s.tokens,
    }));

    if (skills.length === 0) {
      return {
        content: [{
          type: 'text',
          text: 'No skills available. Skills are defined by adding `skill: name` to context doc frontmatter.',
        }],
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(skills, null, 2) }],
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
  'List available AI context documents. Filter by audience: "ui" (using components), "framework" (building components), "contributing", or "research".',
  {
    audience: z.enum(['ui', 'framework', 'contributing', 'research']).optional()
      .describe('Filter by audience'),
  },
  async ({ audience }) => {
    const docs = listContext(audience);

    if (docs.length === 0) {
      return {
        content: [{
          type: 'text',
          text: audience ? `No context docs for audience: ${audience}` : 'No context docs available.',
        }],
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(docs, null, 2) }],
    };
  },
);

server.tool(
  'get_context',
  'Get the full content of an AI context document by path (e.g., "framework/reactivity", "ui/markup").',
  {
    id: z.string().describe('Document path (e.g., "framework/reactivity", "ui/markup")'),
  },
  async ({ id }) => {
    const doc = findContext(id);

    if (!doc) {
      return {
        content: [{ type: 'text', text: `Context document not found: ${id}` }],
        isError: true,
      };
    }

    const result = await fetchContent(doc.path);

    if (!result.success) {
      return {
        content: [{
          type: 'text',
          text: `Failed to fetch context document "${id}"\nURL: ${result.url}\nError: ${result.error}`,
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
// User Documentation Tools
// ============================================================================

server.tool(
  'list_docs',
  'List available user documentation pages.',
  {},
  async () => {
    const docs = listDocs();

    if (docs.length === 0) {
      return {
        content: [{ type: 'text', text: 'No documentation available.' }],
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(docs, null, 2) }],
    };
  },
);

server.tool(
  'get_doc',
  'Get the content of a user documentation page by path (e.g., "guides/reactivity/signals").',
  {
    path: z.string().describe('Document path (e.g., "guides/reactivity/signals", "api/component")'),
  },
  async ({ path }) => {
    const doc = findDoc(path);

    if (!doc) {
      return {
        content: [{ type: 'text', text: `Document not found: ${path}` }],
        isError: true,
      };
    }

    const result = await fetchContent(doc.path);

    if (!result.success) {
      return {
        content: [{
          type: 'text',
          text: `Failed to fetch document "${path}"\nURL: ${result.url}\nError: ${result.error}`,
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
    const content = section || result.data!;

    return {
      content: [{ type: 'text', text: content }],
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
