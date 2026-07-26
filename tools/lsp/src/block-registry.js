/*
  Static registry of template block keywords and the section keywords that live
  inside them. Maps each keyword to a description, example, and guide page for
  completions and hover.
  Mirrors the block patterns in packages/compiler/src/template-compiler.js.

  type 'block' opens with {#name} and is offered after {#
  type 'section' is a bare {name} valid only inside the blocks it lists in parents
*/

export const blocks = {
  if: {
    type: 'block',
    description: 'Renders content when a condition is truthy',
    example: [
      '{#if hasAny items}',
      '  Has items',
      '{/if}',
    ],
    docsPath: '/docs/guides/templates/conditionals',
  },

  'else if': {
    type: 'section',
    parents: ['if'],
    description: 'Adds another condition when the previous branch did not match',
    example: [
      '{#if isEven number}',
      '  Even',
      '{else if isZero number}',
      '  Zero',
      '{/if}',
    ],
    docsPath: '/docs/guides/templates/conditionals',
  },

  else: {
    type: 'section',
    parents: ['if', 'each', 'match'],
    description: 'Fallback content when no earlier branch matched',
    example: [
      '{#if isLoggedIn}',
      '  Dashboard',
      '{else}',
      '  Please log in',
      '{/if}',
    ],
    docsPath: '/docs/guides/templates/conditionals',
  },

  each: {
    type: 'block',
    description: 'Iterates over a collection',
    example: [
      '{#each member in team.members}',
      '  <li>{member.name}</li>',
      '{/each}',
    ],
    docsPath: '/docs/guides/templates/loops',
  },

  match: {
    type: 'block',
    description: 'Branches on the value of a single discriminant',
    example: [
      '{#match status}',
      "  {is 'loading'}",
      '    Loading...',
      '{/match}',
    ],
    docsPath: '/docs/guides/templates/match',
  },

  is: {
    type: 'section',
    parents: ['match'],
    description: 'Match case taken when the value loosely equals (==) any listed value',
    example: [
      '{#match plan}',
      "  {is 'free' 'trial'}",
      '    Limited features',
      '{/match}',
    ],
    docsPath: '/docs/guides/templates/match',
  },

  isExactly: {
    type: 'section',
    parents: ['match'],
    description: 'Match case compared strictly (===) with no coercion',
    example: [
      '{#match user}',
      '  {isExactly undefined}',
      '    Loading...',
      '{/match}',
    ],
    docsPath: '/docs/guides/templates/match',
  },

  async: {
    type: 'block',
    description: 'Renders content after a promise resolves',
    example: [
      '{#async fetchUsers as users}',
      '  <p>Found {users.length} users</p>',
      '{/async}',
    ],
    docsPath: '/docs/guides/templates/async',
  },

  loading: {
    type: 'section',
    parents: ['async'],
    description: 'Content rendered while the promise is pending',
    example: [
      '{#async getResults as result}',
      '  Result is {result}',
      '{loading}',
      '  Loading results..',
      '{/async}',
    ],
    docsPath: '/docs/guides/templates/async',
  },

  before: {
    type: 'section',
    parents: ['async'],
    description: 'Alias for loading, rendered while the promise is pending',
    example: [
      '{#async getResults as result}',
      '  Result is {result}',
      '{before}',
      '  Loading results..',
      '{/async}',
    ],
    docsPath: '/docs/guides/templates/async',
  },

  error: {
    type: 'section',
    parents: ['async'],
    description: 'Content rendered when the promise rejects',
    example: [
      '{#async getResults as result}',
      '  Result is {result}',
      '{error as e}',
      '  <p>Failed: {e.message}</p>',
      '{/async}',
    ],
    docsPath: '/docs/guides/templates/async',
  },

  catch: {
    type: 'section',
    parents: ['async'],
    description: 'Alias for error, rendered when the promise rejects',
    example: [
      '{#async getResults as result}',
      '  Result is {result}',
      '{catch as e}',
      '  <p>Failed: {e.message}</p>',
      '{/async}',
    ],
    docsPath: '/docs/guides/templates/async',
  },

  snippet: {
    type: 'block',
    description: 'Defines a reusable fragment rendered with {>name}',
    example: [
      '{#snippet content}',
      '  {beforeText} {text} {afterText}',
      '{/snippet}',
    ],
    docsPath: '/docs/guides/templates/snippets',
  },

  rerender: {
    type: 'block',
    description: 'Forces the whole block to re-evaluate when the key changes',
    example: [
      '{#rerender userId}',
      '  <p>User: {userName}</p>',
      '  <p>Timestamp: {getTimestamp}</p>',
      '{/rerender}',
    ],
    docsPath: '/docs/guides/templates/reactivity',
  },

  guard: {
    type: 'block',
    description: 'Re-renders only when the guarded value actually changes',
    example: [
      '{#guard getUserStatus}',
      '  <p>Status: {getUserStatus}</p>',
      '{/guard}',
    ],
    docsPath: '/docs/guides/templates/reactivity',
  },

  html: {
    type: 'block',
    selfClosing: true,
    description: 'Renders the expression result as raw HTML instead of escaped text',
    example: [
      '{#html sanitizedContent}',
    ],
    docsPath: '/docs/guides/templates/expressions',
  },

  fn: {
    type: 'block',
    selfClosing: true,
    description: 'Passes a function itself instead of invoking it',
    example: [
      '<ui-dropdown .onChange={#fn updateUsers}>',
    ],
    docsPath: '/docs/guides/templates/expressions',
  },
};

export function getBlock(name) {
  return blocks[name] || null;
}

export function getBlockNames() {
  return Object.keys(blocks);
}

// Keywords offered after {#, the openers rather than their sections
export function getBlockKeywords() {
  return Object.keys(blocks).filter(name => blocks[name].type === 'block');
}

export function getSectionKeywords(parent) {
  return Object.keys(blocks).filter(name => blocks[name].parents?.includes(parent));
}

// {#html} and {#fn} are expression modifiers, so they never open a scope
export function hasClosingTag(name) {
  const block = blocks[name];
  return block?.type === 'block' && !block.selfClosing;
}

export function formatBlockTag(name) {
  const block = blocks[name];
  if (!block) { return null; }
  return block.type === 'block' ? `{#${name}}` : `{${name}}`;
}

export function formatBlockDoc(name, tag = formatBlockTag(name)) {
  const block = blocks[name];
  if (!block) { return null; }
  let doc = `**${tag}**\n\n${block.description}\n\n`;
  doc += `\`\`\`html\n${block.example.join('\n')}\n\`\`\``;
  if (block.docsPath) { doc += `\n\n[docs](${block.docsPath})`; }
  return doc;
}
