import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function run() {
  const client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });

  // StdioClientTransport will spawn the server process for us
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['agents-server.js'],
  });

  // Set a 60 second timeout for Task tool calls
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out after 60 seconds')), 60000);
  });

  try {
    await Promise.race([
      client.connect(transport),
      timeoutPromise,
    ]);
    console.log('Connected to server!');

    // Skip tool listing, go straight to tool call
    console.log('Calling component_implementation_agent...');
    const result = await Promise.race([
      client.callTool({
        name: 'component_implementation_agent',
        arguments: {
          task: 'Test task: Just return a simple response to verify the connection works',
        },
      }),
      timeoutPromise,
    ]);

    console.log('\nAgent response:');
    console.log(JSON.stringify(result, null, 2));
  }
  catch (e) {
    console.error('CLIENT ERROR:', e);
  }
  finally {
    await client.close();
    process.exit(0); // Force exit
  }
}

run();
