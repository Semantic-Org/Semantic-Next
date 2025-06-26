import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function run() {
  const client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });
  const transport = new StdioClientTransport();

  try {
    await client.connect(transport);
    const result = await client.request({ method: 'tools/list', params: {} });
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('CLIENT ERROR:', e);
  } finally {
    await client.close();
  }
}

run();