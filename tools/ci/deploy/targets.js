/*
  The deploy targets the bot knows about, in display order. Each is requested by
  its own PR label, and a target with no facts file in a run renders as NA. A new
  target appears in every comment the moment it has a row here and a deploy job
  in the workflow.
*/
export const TARGETS = [
  { id: 'docs', label: 'Preview' },
  { id: 'mcp', label: 'Preview MCP' },
];
