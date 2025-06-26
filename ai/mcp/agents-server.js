#!/usr/bin/env node

import { spawn } from 'child_process';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
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
    
    // Prepare the agent prompt
    const agentPrompt = this.buildAgentPrompt(agentType, args);
    
    return new Promise((resolve, reject) => {
      const claudeProcess = spawn('claude-code', [
        '--no-interactive',
        '--context-file', contextFile
      ], {
        cwd: projectRoot,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      claudeProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      claudeProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      claudeProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Agent process exited with code ${code}: ${stderr}`));
          return;
        }

        try {
          // Parse the structured response from the agent
          const response = this.parseAgentResponse(stdout);
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse agent response: ${error.message}`));
        }
      });

      claudeProcess.on('error', (error) => {
        reject(new Error(`Failed to spawn agent process: ${error.message}`));
      });

      // Send the prompt to the agent
      claudeProcess.stdin.write(agentPrompt);
      claudeProcess.stdin.end();
    });
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

  buildAgentPrompt(agentType, args) {
    const { task, context = {}, package: packageName } = args;
    
    return `
You are a specialized agent: ${agentType}

TASK: ${task}

CONTEXT: ${JSON.stringify(context, null, 2)}

${packageName ? `PACKAGE: ${packageName}` : ''}

Please complete this task following your specialized context and return a structured JSON response with:

For COMPLETED work:
{
  "status": "complete",
  "deliverables": {
    "files_changed": ["array of file paths"],
    "files_created": ["array of file paths"],
    "summary": "brief summary of work completed"
  },
  "handoff_context": {
    "for_next_agent": "specific context for the NEXT agent in sequence",
    "concerns": ["issues that might affect downstream agents"],
    "recommendations": ["suggestions for next steps"]
  },
  "questions_about_previous_work": [
    {
      "about": "previous_agent_work",
      "question": "specific question about earlier work"
    }
  ]
}

For BLOCKED work requiring human decision:
{
  "status": "blocked",
  "reason": "clear explanation of why you cannot proceed",
  "escalation_request": {
    "question": "specific question for human decision",
    "options": ["option 1", "option 2", "option 3"],
    "blocking_issue": "technical details of the conflict",
    "agent_recommendation": "your recommended solution",
    "impact_of_options": {
      "option_1": "consequences of this choice",
      "option_2": "consequences of this choice"
    }
  },
  "questions_about_previous_work": [
    {
      "about": "previous_agent_work",
      "question": "clarification needed to proceed"
    }
  ]
}

Focus on your specialized domain expertise. If you encounter conflicts with previous work or need human guidance, use the escalation pattern.
`;
  }

  parseAgentResponse(stdout) {
    // Look for JSON in the output (agents should return structured JSON)
    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON response found in agent output');
    }
    
    try {
      const response = JSON.parse(jsonMatch[0]);
      
      // Enhanced response categorization for orchestrator
      if (response.status === 'blocked' && response.escalation_request) {
        return {
          type: 'escalation_needed',
          escalation: response.escalation_request,
          context: response,
          agent_questions: response.questions_about_previous_work || []
        };
      }
      
      if (response.status === 'complete') {
        return {
          type: 'agent_complete',
          result: response
        };
      }
      
      // Default case
      return {
        type: 'agent_response',
        result: response
      };
      
    } catch (error) {
      throw new Error(`Invalid JSON in agent response: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Semantic UI Agents MCP Server running on stdio');
  }
}

const server = new SemanticUIAgentsServer();
server.run().catch(console.error);