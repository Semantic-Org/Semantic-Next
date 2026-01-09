#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import {
  extractMarkdownSection,
  fetchContent,
  fetchJson,
  type FetchResult,
  findContext,
  findDoc,
  findExample,
  initCache,
  listContext,
  listDocs,
  listExamples,
  listSpecs,
  search,
  searchApi,
} from './utils/cache.js';
import { type ComponentSpec, getComponentWithChildren, listComponents } from './utils/specs.js';

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

    const result = await fetchJson<{ files: Record<string, { content: string; }>; }>(example.path);

    if (!result.success) {
      return {
        content: [{
          type: 'text',
          text: `Failed to fetch example "${id}"\nURL: ${result.url}\nError: ${result.error}`,
        }],
        isError: true,
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result.data!, null, 2) }],
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
// Server Startup
// ============================================================================

async function main() {
  // Initialize cache before accepting connections
  await initCache();

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
