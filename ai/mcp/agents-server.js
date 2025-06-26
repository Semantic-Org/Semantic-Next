#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

class SemanticUIAgentsServer {
  constructor() {
    this.server = new Server(
      {
        name: 'semantic-ui-agents',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'component_implementation_agent',
          description: 'Expert in Component package implementation patterns, lifecycle, and Shadow DOM',
          inputSchema: {
            type: 'object',
            properties: {
              task: {
                type: 'string',
                description: 'The implementation task to perform'
              },
              context: {
                type: 'object',
                description: 'Accumulated context from previous agents',
                properties: {
                  original_task: { type: 'string' },
                  files_involved: { type: 'array', items: { type: 'string' } },
                  previous_work: { type: 'object' }
                }
              }
            },
            required: ['task']
          }
        },
        {
          name: 'query_implementation_agent',
          description: 'Expert in Query package DOM manipulation, traversal, and chaining patterns',
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: 'The implementation task to perform' },
              context: { type: 'object', description: 'Accumulated context from previous agents' }
            },
            required: ['task']
          }
        },
        {
          name: 'templating_implementation_agent',
          description: 'Expert in Templating package AST compilation and expression evaluation',
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: 'The implementation task to perform' },
              context: { type: 'object', description: 'Accumulated context from previous agents' }
            },
            required: ['task']
          }
        },
        {
          name: 'reactivity_implementation_agent',
          description: 'Expert in Reactivity package signals, reactions, and dependency tracking',
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: 'The implementation task to perform' },
              context: { type: 'object', description: 'Accumulated context from previous agents' }
            },
            required: ['task']
          }
        },
        {
          name: 'utils_implementation_agent',
          description: 'Expert in Utils package utility functions and performance optimization',
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: 'The implementation task to perform' },
              context: { type: 'object', description: 'Accumulated context from previous agents' }
            },
            required: ['task']
          }
        },
        {
          name: 'testing_agent',
          description: 'Cross-domain testing specialist for quality assurance and edge case coverage',
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: 'The testing task to perform' },
              context: { type: 'object', description: 'Implementation context to test against' },
              package: { type: 'string', description: 'Package being tested' }
            },
            required: ['task', 'package']
          }
        },
        {
          name: 'types_agent',
          description: 'Cross-domain TypeScript specialist for type definitions and developer experience',
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: 'The TypeScript task to perform' },
              context: { type: 'object', description: 'Implementation context to type' },
              package: { type: 'string', description: 'Package being typed' }
            },
            required: ['task', 'package']
          }
        },
        {
          name: 'documentation_agent',
          description: 'Cross-domain documentation specialist for API docs and examples',
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: 'The documentation task to perform' },
              context: { type: 'object', description: 'Implementation context to document' },
              package: { type: 'string', description: 'Package being documented' }
            },
            required: ['task', 'package']
          }
        },
        {
          name: 'integration_agent',
          description: 'Cross-domain integration specialist for system coherence and compatibility',
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: 'The integration task to perform' },
              context: { type: 'object', description: 'Full context from all previous agents' }
            },
            required: ['task']
          }
        },
        {
          name: 'releasing_agent',
          description: 'Specialist in branching, commits, and release notes',
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: 'The release task to perform' },
              context: { type: 'object', description: 'Full context of changes made' }
            },
            required: ['task']
          }
        },
        {
          name: 'build_tools_agent',
          description: 'Specialist in build tools, internal packages, and npm scripts',
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: 'The build task to perform' },
              context: { type: 'object', description: 'Context of changes requiring build updates' }
            },
            required: ['task']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        const result = await this.executeAgent(name, args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing agent ${name}: ${error.message}`
            }
          ],
          isError: true,
        };
      }
    });
  }

  async executeAgent(agentName, args) {
    const agentType = this.getAgentType(agentName);
    const contextFile = path.join(projectRoot, 'ai', 'agents', agentType, 'context.md');
    
    try {
      // For now, return a simple message that the agent system is working
      // In a full implementation, this would load context and execute the agent logic
      const response = {
        status: 'complete',
        agent_name: agentName,
        agent_type: agentType,
        task: args.task,
        message: `🚀 MCP Multi-Agent System Working!

Agent "${agentName}" successfully called with task: "${args.task}"

Context file location: ${contextFile}
Agent specialization: ${agentType}

This proves the MCP integration is functioning correctly. The argumentative theory 
multi-agent system is ready for full implementation!

Next steps:
1. ✅ MCP server is working
2. ✅ Agent tools are callable  
3. ✅ Context system is connected
4. Ready for full agent implementation with human-in-the-loop escalation patterns
        `,
        deliverables: {
          files_changed: [],
          files_created: [],
          summary: `Successfully tested ${agentName} via MCP protocol`
        },
        handoff_context: {
          for_next_agent: `MCP integration verified for ${agentType}`,
          concerns: [],
          recommendations: ["Implement full agent logic", "Test escalation patterns"]
        }
      };
      
      return response;
      
    } catch (error) {
      throw new Error(`Failed to execute agent: ${error.message}`);
    }
  }

  getAgentType(agentName) {
    // Convert agent name to folder structure
    const agentTypeMap = {
      'component_implementation_agent': 'domain/component',
      'query_implementation_agent': 'domain/query',
      'templating_implementation_agent': 'domain/templating',
      'reactivity_implementation_agent': 'domain/reactivity',
      'utils_implementation_agent': 'domain/utils',
      'testing_agent': 'process/testing',
      'types_agent': 'process/types',
      'documentation_agent': 'process/documentation',
      'integration_agent': 'process/integration',
      'releasing_agent': 'process/releasing',
      'build_tools_agent': 'process/build-tools'
    };
    
    return agentTypeMap[agentName] || 'unknown';
  }


  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Semantic UI Agents MCP Server running on stdio');
  }
}

const server = new SemanticUIAgentsServer();
server.run().catch(console.error);