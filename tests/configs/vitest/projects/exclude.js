import { configDefaults } from 'vitest/config';

export const exclude = [
  ...configDefaults.exclude,
  // agent worktrees are whole repo checkouts so every suite would collect twice
  // gitignored, but vitest doesnt read gitignore
  '**/.claude/**',
  'docs/**',
];
