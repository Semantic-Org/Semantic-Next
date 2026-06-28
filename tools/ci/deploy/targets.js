/*
  The deploy targets the bot knows about, in display order. Each is requested by
  a PR label (wired in pr-deploy.yml), and a target with no facts file in a run
  renders as NA. A new target appears in every comment the moment it has a row
  here and a deploy job in the workflow.
*/
export const TARGETS = [
  { id: 'docs' },
  { id: 'mcp' },
];
