#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { getCategories, getContext, getTags, isContextAvailable, listContext, searchContext } from './utils/context.js';
import { getComponentWithChildren, listComponents } from './utils/specs.js';

const server = new McpServer({
  name: 'semantic-ui',
  version: '0.1.0',
});

// List all available components
server.tool(
  'list_components',
  'List all available Semantic UI components with their tag names and descriptions',
  {},
  async () => {
    const components = listComponents();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(components, null, 2),
        },
      ],
    };
  },
);

// Get a specific component spec
server.tool(
  'get_component',
  'Get the full spec for a Semantic UI component. Supports tag names (ui-button), names (Button), or short forms (button).',
  {
    query: z.string().describe('Component name or tag name (e.g., "button", "ui-button", "Button")'),
  },
  async ({ query }) => {
    const result = getComponentWithChildren(query);

    if (!result) {
      return {
        content: [
          {
            type: 'text',
            text: `Component not found: ${query}`,
          },
        ],
        isError: true,
      };
    }

    const response = {
      resolved: result.resolved,
      spec: result.spec,
      ...(result.children.length > 0 && { children: result.children }),
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
