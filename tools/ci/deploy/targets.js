/*
  The deploy targets the bot knows about, in display order. Each is requested by
  its own PR label; a target with no facts file in a run renders as NA (not
  requested this run). This list is the reporter's display registry — the deploy
  workflow holds the matching Vercel project per target, so a new target appears
  in every comment the moment it has a row here and a job there.
*/
export const TARGETS = [
  { id: 'docs', label: 'Preview' },
  { id: 'mcp', label: 'Preview MCP' },
];
