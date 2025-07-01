import * as esbuild from 'esbuild';
import fs from 'fs/promises';
import { resolve } from 'path';
import { WebSocketServer } from 'ws';
import { build } from './lib/build.js';

const BASE_DIR = process.env.BASE_DIR || process.cwd();
const WORKSPACE_DIR = resolve(BASE_DIR, 'ai/workspace');

/*
  MCP-enabled debugging environment for AI workspace
  Sets up WebSocket server for MCP tools and esbuild serve with debug injection
*/
export const buildAIWorkspace = async ({
  serve = false,
  port = 8080,
  wsPort = 8081,
  host = 'localhost',
  buildDeps = false,
  watch = false,
} = {}) => {
  if (serve) {
    console.log('🚀 Starting AI Workspace with MCP debugging...');

    // Set up WebSocket server for MCP tool communication
    const wss = new WebSocketServer({ port: wsPort });
    const connections = new Set();

    console.log(`🔌 MCP WebSocket server running on ws://${host}:${wsPort}`);

    wss.on('connection', (ws) => {
      connections.add(ws);
      console.log('🔗 Debug bridge connected');

      ws.on('close', () => {
        connections.delete(ws);
        console.log('🔌 Debug bridge disconnected');
      });

      // Handle MCP tool requests from agents
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data);

          if (message.type === 'mcp-tool-request') {
            console.log(`🛠️ Agent tool request: ${message.tool}`);

            // Forward to browser debug bridge
            for (const conn of connections) {
              if (conn !== ws && conn.readyState === 1) {
                conn.send(data);
              }
            }
          }
          else if (message.type === 'mcp-tool-response') {
            // Forward response back to requesting agent
            for (const conn of connections) {
              if (conn !== ws && conn.readyState === 1) {
                conn.send(data);
              }
            }
          }
          else if (message.type === 'event-triggered') {
            // Broadcast events to all connected agents
            console.log(`📡 Component event: ${message.event} on ${message.selector}`);
            for (const conn of connections) {
              if (conn !== ws && conn.readyState === 1) {
                conn.send(data);
              }
            }
          }
        }
        catch (error) {
          console.error('❌ WebSocket message error:', error);
        }
      });
    });

    // esbuild plugin to inject debug bridge
    const debugBridgePlugin = {
      name: 'debug-bridge-injector',
      setup(build) {
        build.onLoad({ filter: /\.html$/ }, async (args) => {
          let content = await fs.readFile(args.path, 'utf8');

          // Inject debug bridge script before </body>
          const injection = `
            <script src="/debug-bridge.js"></script>
            <script>
              // Auto-connect debug bridge when page loads
              document.addEventListener('DOMContentLoaded', () => {
                window.__debugBridge.connect('ws://${host}:${wsPort}');
              });
            </script>
          `;

          content = content.replace('</body>', injection + '</body>');
          return { contents: content, loader: 'html' };
        });
      },
    };

    try {
      const context = await esbuild.context({
        entryPoints: [
          resolve(WORKSPACE_DIR, 'public/index.html'),
          resolve(WORKSPACE_DIR, 'debug-bridge.js'),
          resolve(WORKSPACE_DIR, 'mcp-tools.js'),
        ],
        bundle: false,
        format: 'esm',
        outdir: resolve(WORKSPACE_DIR, '.esbuild'),
        plugins: [debugBridgePlugin],
        logLevel: 'info',
        loader: {
          '.html': 'text',
          '.css': 'text',
          '.js': 'js',
          '.ts': 'ts',
        },
      });

      if (watch) {
        await context.watch();
        console.log('👀 File watching enabled');
      }

      const result = await context.serve({
        port,
        host,
        servedir: WORKSPACE_DIR,
      });

      console.log(`\n✅ AI Workspace Ready!`);
      console.log(`📡 Web server: http://${result.host}:${result.port}`);
      console.log(`🔌 MCP WebSocket: ws://${host}:${wsPort}`);
      console.log(`📁 Serving from: ${WORKSPACE_DIR}`);
      console.log(`\n🎯 Quick Links:`);
      console.log(`   • Main page: http://localhost:${port}/public/`);
      console.log(`   • Component tester: http://localhost:${port}/public/component.html`);
      console.log(`   • Test component: http://localhost:${port}/public/component.html?name=test-component`);
      console.log(`\n💡 MCP Tools Available:`);
      console.log(`   • inspect_component - Deep component analysis`);
      console.log(`   • execute_in_component - Run code in component context`);
      console.log(`   • monitor_events - Real-time event streaming`);
      console.log(`   • list_components - See all components on page`);
      console.log(`   • See mcp-tools.js for complete tool reference`);

      // Keep the process alive
      return new Promise(() => {
        // Graceful shutdown handling
        process.on('SIGINT', () => {
          console.log('\n🛑 Shutting down AI workspace...');
          wss.close();
          context.dispose();
          process.exit(0);
        });
      });
    }
    catch (error) {
      console.error('❌ Failed to start workspace:', error);
      wss.close();
      return { success: false, error };
    }
  }

  return { success: true };
};

// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    const serve = process.argv.includes('--serve');
    const port = process.argv.includes('--port')
      ? parseInt(process.argv[process.argv.indexOf('--port') + 1])
      : 8080;

    return buildAIWorkspace({
      serve,
      port,
      watch: serve, // Enable watch mode when serving
    });
  })();
}
