#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import path from 'path';
import { fileURLToPath } from 'url';

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
        // Check if streaming is requested
        const useStreaming = args.streaming === true;
        
        const result = await this.executeAgent(name, args, useStreaming);
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

  async executeAgent(agentName, args, useStreaming = false) {
    const agentType = this.getAgentType(agentName);
    
    try {
      // Create specialized prompt for the agent
      const agentPrompt = await this.createAgentPrompt(agentName, agentType, args);
      
      // Connect to Claude Code MCP server and execute the agent task
      const result = await this.connectToClaudeCodeMCP(agentPrompt, agentName, agentType, args);
      
      return result;
      
    } catch (error) {
      throw new Error(`Failed to execute agent: ${error.message}`);
    }
  }

  async connectToClaudeCodeMCP(agentPrompt, agentName, agentType, args) {
    const { spawn } = await import('child_process');
    
    // Start Claude Code as MCP server
    const claudeProcess = spawn('claude', ['mcp', 'serve'], {
      cwd: projectRoot,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        CLAUDE_AGENT_TYPE: agentType,
        CLAUDE_AGENT_NAME: agentName
      }
    });

    try {
      // Create MCP client to connect to Claude Code server
      const client = new Client(
        {
          name: `${agentName}-client`,
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );

      // Connect to Claude Code MCP server via stdio
      const transport = new StdioClientTransport({
        stdin: claudeProcess.stdin,
        stdout: claudeProcess.stdout,
      });

      await client.connect(transport);

      // Get available tools from Claude Code
      const tools = await client.listTools();
      console.error(`[${agentName}] Available tools:`, tools.tools.map(t => t.name));

      // Use Claude Code's Task tool to execute the agent prompt
      const result = await client.callTool('Task', {
        description: `${agentType} agent work`,
        prompt: agentPrompt
      });

      await client.close();
      claudeProcess.kill();

      return this.parseAgentResponse(result, agentName, agentType, args);

    } catch (error) {
      claudeProcess.kill();
      throw new Error(`Failed to connect to Claude Code MCP: ${error.message}`);
    }
  }

  async createAgentPrompt(agentName, agentType, args) {
    const contextPath = path.join(projectRoot, 'ai');
    const contextFile = path.join(projectRoot, 'ai', 'agents', agentType, 'context.md');
    
    // Load specialized context for this agent type
    let specializedContext = '';
    try {
      const { readFile } = await import('fs/promises');
      specializedContext = await readFile(contextFile, 'utf-8');
    } catch (error) {
      // Context file doesn't exist, provide fallback instructions
      specializedContext = `No specialized context file found at ${contextFile}. Use general Semantic UI patterns.`;
    }
    
    return `You are a specialized ${agentName} working within the Semantic UI multi-agent system.

AGENT SPECIALIZATION:
- Name: ${agentName}
- Type: ${agentType}
- Working Directory: ${projectRoot}

CONTEXT LOADING PROTOCOL:
1. Load foundation context from: ${contextPath}/00-START-HERE.md
2. Load mental model from: ${contextPath}/foundations/mental-model.md
3. Apply your specialized context (provided below)

SPECIALIZED AGENT CONTEXT:
${specializedContext}

TASK:
${args.task}

CONTEXT:
${JSON.stringify(args.context || {}, null, 2)}

INSTRUCTIONS:
- Follow the Semantic UI architectural patterns defined in the AI context system
- Use the TodoWrite tool to track your progress if the task is complex
- Provide detailed implementation with proper file changes
- Return results in structured JSON format with status, deliverables, and handoff_context
- If you encounter issues, escalate with clear problem description

Begin your specialized work now.`;
  }

  parseAgentResponse(mcpToolResult, agentName, agentType, args) {
    try {
      // Handle MCP tool call result format
      let agentResult = '';
      
      if (mcpToolResult.isError) {
        throw new Error(`Agent execution failed: ${mcpToolResult.content[0]?.text || 'Unknown error'}`);
      }

      // Extract content from MCP tool result
      if (mcpToolResult.content && Array.isArray(mcpToolResult.content)) {
        agentResult = mcpToolResult.content
          .filter(item => item.type === 'text')
          .map(item => item.text)
          .join('\n');
      } else if (typeof mcpToolResult === 'string') {
        agentResult = mcpToolResult;
      } else {
        agentResult = JSON.stringify(mcpToolResult, null, 2);
      }
      
      // Try to parse structured JSON response from the agent's work
      let parsedResult;
      try {
        // Look for JSON in the agent's response
        const jsonMatch = agentResult.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                         agentResult.match(/(\{[\s\S]*"status"[\s\S]*\})/);
        
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[1]);
        }
      } catch (parseError) {
        // If parsing fails, create a structured response
      }

      // Return structured agent response
      const response = parsedResult || {
        status: 'complete',
        agent_name: agentName,
        agent_type: agentType,
        task: args.task,
        message: agentResult,
        deliverables: {
          files_changed: [],
          files_created: [],
          summary: `Completed ${agentName} task`
        },
        handoff_context: {
          for_next_agent: `Output from ${agentType}: ${agentResult.substring(0, 200)}...`,
          concerns: [],
          recommendations: []
        }
      };

      // Add execution metadata
      response.execution_metadata = {
        timestamp: new Date().toISOString(),
        agent_name: agentName,
        agent_type: agentType
      };

      return response;
      
    } catch (error) {
      throw new Error(`Failed to parse agent response: ${error.message}`);
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